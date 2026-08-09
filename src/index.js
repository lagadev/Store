hereimport { INDEX_HTML } from "./frontend.js";
import { ADMIN_HTML } from "./admin.js";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Init-Data, X-Tg-Id",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });
}

function html(body) {
  return new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ---------- Telegram initData verification ----------
async function hmacSha256(keyBytes, message) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return new Uint8Array(sig);
}
function toHex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function verifyInitData(initData, botToken) {
  if (!initData) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");
  const pairs = [];
  for (const [k, v] of params.entries()) pairs.push(`${k}=${v}`);
  pairs.sort();
  const dataCheckString = pairs.join("\n");

  let userRaw = params.get("user");
  let user = null;
  try { user = userRaw ? JSON.parse(userRaw) : null; } catch { user = null; }

  if (!botToken) return user; // dev mode: skip signature check
  if (!hash) return null;

  const secretKey = await hmacSha256(new TextEncoder().encode("WebAppData"), botToken);
  const computed = toHex(await hmacSha256(secretKey, dataCheckString));
  if (computed !== hash) return null;
  return user;
}

async function getIdentity(request, env) {
  const url = new URL(request.url);
  const initData = request.headers.get("X-Init-Data") || "";
  let user = await verifyInitData(initData, env.BOT_TOKEN);
  if (!user) {
    const tid = url.searchParams.get("tid") || request.headers.get("X-Tg-Id");
    if (tid) {
      user = {
        id: Number(tid),
        username: url.searchParams.get("username") || "",
        first_name: url.searchParams.get("first_name") || "User",
        photo_url: url.searchParams.get("photo_url") || "",
      };
    }
  }
  return user;
}

// ---------- settings ----------
const SETTING_DEFAULTS = {
  coins_per_ad: "50",
  daily_ad_limit: "10",
  coins_per_refer: "20",
  min_ad_seconds: "7",
  bot_username: "",
  start_text: "Welcome!",
  start_image_url: "",
  start_button_text: "Open App",
  contact_support_url: "",
  tutorial_video_url: "",
};

async function getSettings(db) {
  const { results } = await db.prepare("SELECT key, value FROM settings").all();
  const s = {};
  for (const row of results) s[row.key] = row.value;
  return {
    coins_per_ad: Number(s.coins_per_ad ?? SETTING_DEFAULTS.coins_per_ad),
    daily_ad_limit: Number(s.daily_ad_limit ?? SETTING_DEFAULTS.daily_ad_limit),
    coins_per_refer: Number(s.coins_per_refer ?? SETTING_DEFAULTS.coins_per_refer),
    min_ad_seconds: Number(s.min_ad_seconds ?? SETTING_DEFAULTS.min_ad_seconds),
    bot_username: s.bot_username ?? SETTING_DEFAULTS.bot_username,
    start_text: s.start_text ?? SETTING_DEFAULTS.start_text,
    start_image_url: s.start_image_url ?? SETTING_DEFAULTS.start_image_url,
    start_button_text: s.start_button_text ?? SETTING_DEFAULTS.start_button_text,
    contact_support_url: s.contact_support_url ?? SETTING_DEFAULTS.contact_support_url,
    tutorial_video_url: s.tutorial_video_url ?? SETTING_DEFAULTS.tutorial_video_url,
  };
}
async function setSetting(db, key, value) {
  await db
    .prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?")
    .bind(key, String(value), String(value))
    .run();
}

// ---------- users (created ONLY from the /start webhook) ----------
async function getUser(db, telegramId) {
  const row = await db.prepare("SELECT * FROM users WHERE telegram_id = ?").bind(telegramId).first();
  if (!row) return null;
  if (row.last_ad_date !== todayStr()) {
    await db.prepare("UPDATE users SET ads_watched_today = 0, last_ad_date = ? WHERE id = ?").bind(todayStr(), row.id).run();
    row.ads_watched_today = 0;
    row.last_ad_date = todayStr();
  }
  return row;
}

async function createUserFromStart(db, tgUser, referredByTgId) {
  let row = await db.prepare("SELECT * FROM users WHERE telegram_id = ?").bind(tgUser.id).first();

  if (!row) {
    let referrerRowId = null;
    if (referredByTgId && Number(referredByTgId) !== Number(tgUser.id)) {
      const ref = await db.prepare("SELECT id FROM users WHERE telegram_id = ?").bind(referredByTgId).first();
      if (ref) referrerRowId = ref.id;
    }

    await db
      .prepare(
        `INSERT INTO users (telegram_id, username, first_name, photo_url, referred_by, last_ad_date)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(tgUser.id, tgUser.username || "", tgUser.first_name || "User", tgUser.photo_url || "", referredByTgId ? Number(referredByTgId) : null, todayStr())
      .run();

    if (referrerRowId) {
      const settings = await getSettings(db);
      await db
        .prepare("UPDATE users SET referral_count = referral_count + 1, balance = balance + ? WHERE id = ?")
        .bind(settings.coins_per_refer, referrerRowId)
        .run();
    }
    row = await db.prepare("SELECT * FROM users WHERE telegram_id = ?").bind(tgUser.id).first();
  } else {
    await db
      .prepare("UPDATE users SET username = ?, first_name = ? WHERE telegram_id = ?")
      .bind(tgUser.username || row.username, tgUser.first_name || row.first_name, tgUser.id)
      .run();
  }
  return row;
}

function isAdmin(env, tgId) {
  return String(tgId) === String(env.ADMIN_ID);
}

// ---------- Telegram Bot API ----------
async function tgApi(env, method, payload) {
  if (!env.BOT_TOKEN) return { ok: false, description: "BOT_TOKEN not configured" };
  const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json().catch(() => ({ ok: false }));
}

async function sendStartMessage(env, db, chatId, miniAppUrl) {
  const s = await getSettings(db);
  const keyboard = { inline_keyboard: [[{ text: s.start_button_text || "Open App", web_app: { url: miniAppUrl } }]] };
  if (s.start_image_url) {
    return tgApi(env, "sendPhoto", { chat_id: chatId, photo: s.start_image_url, caption: s.start_text || "", reply_markup: keyboard });
  }
  return tgApi(env, "sendMessage", { chat_id: chatId, text: s.start_text || "Welcome!", reply_markup: keyboard });
}

async function runBroadcast(env, db, payload) {
  const { results } = await db.prepare("SELECT telegram_id FROM users WHERE is_banned = 0").all();
  const chatIds = results.map((r) => r.telegram_id);
  const keyboard = payload.button_text && payload.button_url
    ? { inline_keyboard: [[{ text: payload.button_text, url: payload.button_url }]] }
    : undefined;

  const chunkSize = 20;
  for (let i = 0; i < chatIds.length; i += chunkSize) {
    const chunk = chatIds.slice(i, i + chunkSize);
    await Promise.allSettled(
      chunk.map((chatId) => {
        const base = { chat_id: chatId, reply_markup: keyboard };
        if (payload.image_url) {
          return tgApi(env, "sendPhoto", { ...base, photo: payload.image_url, caption: payload.text || "" });
        }
        return tgApi(env, "sendMessage", { ...base, text: payload.text || "" });
      })
    );
    if (i + chunkSize < chatIds.length) await new Promise((r) => setTimeout(r, 1100));
  }
  return chatIds.length;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

    if (pathname === "/" || pathname === "/index.html") return html(INDEX_HTML);
    if (pathname === "/admin") return html(ADMIN_HTML);

    const db = env.DB;

    // ---------- Telegram webhook ----------
    if (pathname === "/webhook" && request.method === "POST") {
      if (env.WEBHOOK_SECRET) {
        const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
        if (secret !== env.WEBHOOK_SECRET) return new Response("forbidden", { status: 403 });
      }
      const update = await request.json().catch(() => ({}));
      const msg = update.message;
      if (msg && msg.text && msg.text.indexOf("/start") === 0) {
        const parts = msg.text.trim().split(/\s+/);
        const payload = parts[1] || "";
        const referredByTgId = payload.indexOf("ref_") === 0 ? payload.slice(4) : null;

        await createUserFromStart(db, {
          id: msg.from.id,
          username: msg.from.username || "",
          first_name: msg.from.first_name || "User",
        }, referredByTgId);

        const miniAppUrl = url.origin + "/";
        ctx.waitUntil(sendStartMessage(env, db, msg.chat.id, miniAppUrl));
      }
      return json({ ok: true });
    }

    if (!pathname.startsWith("/api/")) return new Response("Not found", { status: 404 });

    try {
      // ---------- /api/auth — read-only, never creates a user ----------
      if (pathname === "/api/auth" && request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        const initData = request.headers.get("X-Init-Data") || body.initData || "";
        let user = await verifyInitData(initData, env.BOT_TOKEN);
        if (!user && body.devUser) user = body.devUser;
        if (!user) return json({ error: "unauthorized" }, 401);

        const settings = await getSettings(db);
        const row = await getUser(db, user.id);
        if (!row) return json({ user: null, needsStart: true, settings });
        return json({ user: row, isAdmin: isAdmin(env, user.id), settings });
      }

      if (pathname === "/api/me" && request.method === "GET") {
        const user = await getIdentity(request, env);
        if (!user) return json({ error: "unauthorized" }, 401);
        const settings = await getSettings(db);
        const row = await getUser(db, user.id);
        if (!row) return json({ user: null, needsStart: true, settings });
        return json({ user: row, isAdmin: isAdmin(env, user.id), settings });
      }

      if (pathname === "/api/settings" && request.method === "GET") {
        return json(await getSettings(db));
      }

      // ---------- /api/earn/watch-ad ----------
      if (pathname === "/api/earn/watch-ad" && request.method === "POST") {
        const user = await getIdentity(request, env);
        if (!user) return json({ error: "unauthorized" }, 401);
        const row = await getUser(db, user.id);
        if (!row) return json({ error: "needs_start" }, 403);

        const body = await request.json().catch(() => ({}));
        const settings = await getSettings(db);
        const durationMs = Number(body.duration_ms) || 0;

        if (durationMs < settings.min_ad_seconds * 1000) {
          return json({ error: "ad_too_short", min_ad_seconds: settings.min_ad_seconds }, 400);
        }
        if (row.ads_watched_today >= settings.daily_ad_limit) {
          return json({ error: "daily_limit_reached", limit: settings.daily_ad_limit }, 400);
        }

        await db
          .prepare("UPDATE users SET balance = balance + ?, ads_watched_today = ads_watched_today + 1, last_ad_date = ? WHERE id = ?")
          .bind(settings.coins_per_ad, todayStr(), row.id)
          .run();

        const updated = await db.prepare("SELECT * FROM users WHERE id = ?").bind(row.id).first();
        return json({ user: updated, coins_earned: settings.coins_per_ad, settings });
      }

      // ---------- /api/bots (list) ----------
      if (pathname === "/api/bots" && request.method === "GET") {
        const { results } = await db.prepare("SELECT * FROM bots WHERE is_active = 1 ORDER BY sort_order DESC, id DESC").all();
        return json({ bots: results });
      }

      let m = pathname.match(/^\/api\/bots\/(\d+)$/);
      if (m && request.method === "GET") {
        const botId = Number(m[1]);
        const bot = await db.prepare("SELECT * FROM bots WHERE id = ?").bind(botId).first();
        if (!bot) return json({ error: "not found" }, 404);

        const user = await getIdentity(request, env);
        let progress = { unlocked: 0 };
        let balance = 0;
        if (user) {
          const row = await getUser(db, user.id);
          if (row) {
            balance = row.balance;
            const p = await db.prepare("SELECT * FROM user_bot_progress WHERE user_id = ? AND bot_id = ?").bind(row.id, botId).first();
            if (p) progress = p;
          }
        }
        return json({ bot, progress, balance });
      }

      m = pathname.match(/^\/api\/bots\/(\d+)\/unlock$/);
      if (m && request.method === "POST") {
        const botId = Number(m[1]);
        const user = await getIdentity(request, env);
        if (!user) return json({ error: "unauthorized" }, 401);
        const row = await getUser(db, user.id);
        if (!row) return json({ error: "needs_start" }, 403);

        const bot = await db.prepare("SELECT * FROM bots WHERE id = ?").bind(botId).first();
        if (!bot) return json({ error: "not found" }, 404);

        const existing = await db.prepare("SELECT * FROM user_bot_progress WHERE user_id = ? AND bot_id = ?").bind(row.id, botId).first();
        if (existing && existing.unlocked) return json({ redirect: bot.redirect_link, already: true });

        if (row.balance < bot.price_coins) {
          return json({ error: "insufficient_coins", need: bot.price_coins - row.balance }, 400);
        }

        await db.prepare("UPDATE users SET balance = balance - ?, bots_unlocked = bots_unlocked + 1 WHERE id = ?").bind(bot.price_coins, row.id).run();
        await db
          .prepare(
            `INSERT INTO user_bot_progress (user_id, bot_id, unlocked, unlocked_at) VALUES (?, ?, 1, datetime('now'))
             ON CONFLICT(user_id, bot_id) DO UPDATE SET unlocked = 1, unlocked_at = datetime('now')`
          )
          .bind(row.id, botId)
          .run();

        return json({ redirect: bot.redirect_link });
      }

      // ================= ADMIN ROUTES =================
      const adminId = request.headers.get("X-Tg-Id") || url.searchParams.get("tid");
      const requireAdmin = () => isAdmin(env, adminId);

      if (pathname === "/api/admin/check" && request.method === "GET") return json({ isAdmin: requireAdmin() });
      if (pathname.startsWith("/api/admin/") && !requireAdmin()) return json({ error: "forbidden" }, 403);

      if (pathname === "/api/admin/bots" && request.method === "GET") {
        const { results } = await db.prepare("SELECT * FROM bots ORDER BY id DESC").all();
        return json({ bots: results });
      }

      if (pathname === "/api/admin/bots" && request.method === "POST") {
        const b = await request.json();
        await db
          .prepare(`INSERT INTO bots (title, description, thumbnail_url, tutorial_url, redirect_link, price_coins, category, is_active)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(b.title || "", b.description || "", b.thumbnail_url || "", b.tutorial_url || "", b.redirect_link || "", Number(b.price_coins) || 0, b.category || "New", b.is_active === false ? 0 : 1)
          .run();
        return json({ ok: true });
      }

      m = pathname.match(/^\/api\/admin\/bots\/(\d+)$/);
      if (m && request.method === "PUT") {
        const b = await request.json();
        await db
          .prepare(`UPDATE bots SET title=?, description=?, thumbnail_url=?, tutorial_url=?, redirect_link=?, price_coins=?, category=?, is_active=? WHERE id=?`)
          .bind(b.title || "", b.description || "", b.thumbnail_url || "", b.tutorial_url || "", b.redirect_link || "", Number(b.price_coins) || 0, b.category || "New", b.is_active === false ? 0 : 1, Number(m[1]))
          .run();
        return json({ ok: true });
      }

      if (m && request.method === "DELETE") {
        await db.prepare("DELETE FROM bots WHERE id = ?").bind(Number(m[1])).run();
        return json({ ok: true });
      }

      if (pathname === "/api/admin/users" && request.method === "GET") {
        const { results } = await db.prepare("SELECT * FROM users ORDER BY id DESC LIMIT 500").all();
        return json({ users: results });
      }

      m = pathname.match(/^\/api\/admin\/users\/(\d+)\/ban$/);
      if (m && request.method === "POST") {
        const b = await request.json().catch(() => ({}));
        await db.prepare("UPDATE users SET is_banned = ? WHERE id = ?").bind(b.banned ? 1 : 0, Number(m[1])).run();
        return json({ ok: true });
      }

      if (pathname === "/api/admin/settings" && request.method === "GET") return json(await getSettings(db));

      if (pathname === "/api/admin/settings" && request.method === "PUT") {
        const b = await request.json();
        const numeric = ["coins_per_ad", "daily_ad_limit", "coins_per_refer", "min_ad_seconds"];
        const text = ["bot_username", "start_text", "start_image_url", "start_button_text", "contact_support_url", "tutorial_video_url"];
        for (const k of numeric) if (b[k] != null) await setSetting(db, k, Math.max(0, Number(b[k]) || 0));
        for (const k of text) if (b[k] != null) await setSetting(db, k, String(b[k]));
        return json(await getSettings(db));
      }

      if (pathname === "/api/admin/broadcast" && request.method === "POST") {
        const b = await request.json().catch(() => ({}));
        if (!b.text && !b.image_url) return json({ error: "text or image_url required" }, 400);
        const countRow = await db.prepare("SELECT COUNT(*) c FROM users WHERE is_banned = 0").first();
        ctx.waitUntil(runBroadcast(env, db, b));
        return json({ ok: true, queued: countRow.c });
      }

      if (pathname === "/api/admin/stats" && request.method === "GET") {
        const usersCount = await db.prepare("SELECT COUNT(*) c FROM users").first();
        const botsCount = await db.prepare("SELECT COUNT(*) c FROM bots").first();
        const unlocks = await db.prepare("SELECT COUNT(*) c FROM user_bot_progress WHERE unlocked = 1").first();
        const coinsIssued = await db.prepare("SELECT COALESCE(SUM(balance),0) c FROM users").first();
        return json({ users: usersCount.c, bots: botsCount.c, unlocks: unlocks.c, coinsInCirculation: coinsIssued.c });
      }

      return json({ error: "not found" }, 404);
    } catch (err) {
      return json({ error: String(err && err.message ? err.message : err) }, 500);
    }
  },
};
