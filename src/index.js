import { INDEX_HTML } from "./frontend.js";
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
  return new Response(body, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

// ---------- Telegram initData verification ----------
async function hmacSha256(keyBytes, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return new Uint8Array(sig);
}

function toHex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifies Telegram WebApp initData and returns the parsed user object,
 * or null if invalid. If BOT_TOKEN is not configured, falls back to
 * unverified parsing (dev mode only) so local testing works without a token.
 */
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
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }

  if (!botToken) {
    // Dev mode: no signature check, trust the payload as-is.
    return user;
  }
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
    // Dev/testing fallback: allow ?tid=&username=&first_name= on GET requests
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

async function getOrCreateUser(db, tgUser, referredByTgId) {
  let row = await db
    .prepare("SELECT * FROM users WHERE telegram_id = ?")
    .bind(tgUser.id)
    .first();

  if (!row) {
    let referrerRowId = null;
    if (referredByTgId && Number(referredByTgId) !== Number(tgUser.id)) {
      const ref = await db
        .prepare("SELECT id FROM users WHERE telegram_id = ?")
        .bind(referredByTgId)
        .first();
      if (ref) referrerRowId = ref.id;
    }

    await db
      .prepare(
        `INSERT INTO users (telegram_id, username, first_name, photo_url, referred_by)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(
        tgUser.id,
        tgUser.username || "",
        tgUser.first_name || "User",
        tgUser.photo_url || "",
        referredByTgId ? Number(referredByTgId) : null
      )
      .run();

    if (referrerRowId) {
      await db
        .prepare("UPDATE users SET referral_count = referral_count + 1, balance = balance + 20 WHERE id = ?")
        .bind(referrerRowId)
        .run();
    }

    row = await db.prepare("SELECT * FROM users WHERE telegram_id = ?").bind(tgUser.id).first();
  } else {
    // keep profile fields fresh
    await db
      .prepare("UPDATE users SET username = ?, first_name = ?, photo_url = ? WHERE telegram_id = ?")
      .bind(tgUser.username || row.username, tgUser.first_name || row.first_name, tgUser.photo_url || row.photo_url, tgUser.id)
      .run();
  }
  return row;
}

function isAdmin(env, tgId) {
  return String(tgId) === String(env.ADMIN_ID);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    // ---------- static pages ----------
    if (pathname === "/" || pathname === "/index.html") {
      return html(INDEX_HTML);
    }
    if (pathname === "/admin") {
      return html(ADMIN_HTML);
    }

    if (!pathname.startsWith("/api/")) {
      return new Response("Not found", { status: 404 });
    }

    const db = env.DB;

    try {
      // ---------- /api/auth ----------
      if (pathname === "/api/auth" && request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        const initData = request.headers.get("X-Init-Data") || body.initData || "";
        let user = await verifyInitData(initData, env.BOT_TOKEN);
        if (!user && body.devUser) user = body.devUser; // dev fallback
        if (!user) return json({ error: "unauthorized" }, 401);

        const row = await getOrCreateUser(db, user, body.startParam);
        return json({ user: row, isAdmin: isAdmin(env, user.id) });
      }

      // ---------- /api/me ----------
      if (pathname === "/api/me" && request.method === "GET") {
        const user = await getIdentity(request, env);
        if (!user) return json({ error: "unauthorized" }, 401);
        const row = await getOrCreateUser(db, user, url.searchParams.get("ref"));
        return json({ user: row, isAdmin: isAdmin(env, user.id) });
      }

      // ---------- /api/bots (list) ----------
      if (pathname === "/api/bots" && request.method === "GET") {
        const { results } = await db
          .prepare("SELECT * FROM bots WHERE is_active = 1 ORDER BY sort_order DESC, id DESC")
          .all();
        return json({ bots: results });
      }

      // ---------- /api/bots/:id (detail + progress) ----------
      let m = pathname.match(/^\/api\/bots\/(\d+)$/);
      if (m && request.method === "GET") {
        const botId = Number(m[1]);
        const bot = await db.prepare("SELECT * FROM bots WHERE id = ?").bind(botId).first();
        if (!bot) return json({ error: "not found" }, 404);

        const user = await getIdentity(request, env);
        let progress = { ads_watched: 0, unlocked: 0 };
        if (user) {
          const row = await getOrCreateUser(db, user);
          const p = await db
            .prepare("SELECT * FROM user_bot_progress WHERE user_id = ? AND bot_id = ?")
            .bind(row.id, botId)
            .first();
          if (p) progress = p;
        }
        return json({ bot, progress });
      }

      // ---------- /api/bots/:id/watch-ad ----------
      m = pathname.match(/^\/api\/bots\/(\d+)\/watch-ad$/);
      if (m && request.method === "POST") {
        const botId = Number(m[1]);
        const user = await getIdentity(request, env);
        if (!user) return json({ error: "unauthorized" }, 401);
        const row = await getOrCreateUser(db, user);
        const bot = await db.prepare("SELECT * FROM bots WHERE id = ?").bind(botId).first();
        if (!bot) return json({ error: "not found" }, 404);

        await db
          .prepare(
            `INSERT INTO user_bot_progress (user_id, bot_id, ads_watched)
             VALUES (?, ?, 1)
             ON CONFLICT(user_id, bot_id) DO UPDATE SET
               ads_watched = MIN(ads_watched + 1, ?)`
          )
          .bind(row.id, botId, bot.ads_required)
          .run();

        const progress = await db
          .prepare("SELECT * FROM user_bot_progress WHERE user_id = ? AND bot_id = ?")
          .bind(row.id, botId)
          .first();
        return json({ progress, ads_required: bot.ads_required });
      }

      // ---------- /api/bots/:id/claim ----------
      m = pathname.match(/^\/api\/bots\/(\d+)\/claim$/);
      if (m && request.method === "POST") {
        const botId = Number(m[1]);
        const user = await getIdentity(request, env);
        if (!user) return json({ error: "unauthorized" }, 401);
        const row = await getOrCreateUser(db, user);
        const bot = await db.prepare("SELECT * FROM bots WHERE id = ?").bind(botId).first();
        if (!bot) return json({ error: "not found" }, 404);

        const progress = await db
          .prepare("SELECT * FROM user_bot_progress WHERE user_id = ? AND bot_id = ?")
          .bind(row.id, botId)
          .first();

        if (!progress || progress.ads_watched < bot.ads_required) {
          return json({ error: "ads not completed" }, 400);
        }

        if (!progress.unlocked) {
          await db
            .prepare(
              "UPDATE user_bot_progress SET unlocked = 1, unlocked_at = datetime('now') WHERE id = ?"
            )
            .bind(progress.id)
            .run();
          await db
            .prepare(
              "UPDATE users SET bots_unlocked = bots_unlocked + 1, balance = balance + ? WHERE id = ?"
            )
            .bind(bot.reward_coins, row.id)
            .run();
        }

        return json({ redirect: bot.redirect_link });
      }

      // ================= ADMIN ROUTES =================
      const adminId = request.headers.get("X-Tg-Id") || url.searchParams.get("tid");
      const requireAdmin = () => isAdmin(env, adminId);

      if (pathname === "/api/admin/check" && request.method === "GET") {
        return json({ isAdmin: requireAdmin() });
      }

      if (pathname.startsWith("/api/admin/") && !requireAdmin()) {
        return json({ error: "forbidden" }, 403);
      }

      if (pathname === "/api/admin/bots" && request.method === "GET") {
        const { results } = await db.prepare("SELECT * FROM bots ORDER BY id DESC").all();
        return json({ bots: results });
      }

      if (pathname === "/api/admin/bots" && request.method === "POST") {
        const b = await request.json();
        await db
          .prepare(
            `INSERT INTO bots (title, description, thumbnail_url, tutorial_url, redirect_link, ads_required, reward_coins, category, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            b.title || "",
            b.description || "",
            b.thumbnail_url || "",
            b.tutorial_url || "",
            b.redirect_link || "",
            Number(b.ads_required) || 9,
            Number(b.reward_coins) || 0,
            b.category || "New",
            b.is_active === false ? 0 : 1
          )
          .run();
        return json({ ok: true });
      }

      m = pathname.match(/^\/api\/admin\/bots\/(\d+)$/);
      if (m && request.method === "PUT") {
        const b = await request.json();
        await db
          .prepare(
            `UPDATE bots SET title=?, description=?, thumbnail_url=?, tutorial_url=?, redirect_link=?,
             ads_required=?, reward_coins=?, category=?, is_active=? WHERE id=?`
          )
          .bind(
            b.title || "",
            b.description || "",
            b.thumbnail_url || "",
            b.tutorial_url || "",
            b.redirect_link || "",
            Number(b.ads_required) || 9,
            Number(b.reward_coins) || 0,
            b.category || "New",
            b.is_active === false ? 0 : 1,
            Number(m[1])
          )
          .run();
        return json({ ok: true });
      }

      if (m && request.method === "DELETE") {
        await db.prepare("DELETE FROM bots WHERE id = ?").bind(Number(m[1])).run();
        return json({ ok: true });
      }

      if (pathname === "/api/admin/users" && request.method === "GET") {
        const { results } = await db
          .prepare("SELECT * FROM users ORDER BY id DESC LIMIT 500")
          .all();
        return json({ users: results });
      }

      m = pathname.match(/^\/api\/admin\/users\/(\d+)\/ban$/);
      if (m && request.method === "POST") {
        const b = await request.json().catch(() => ({}));
        await db
          .prepare("UPDATE users SET is_banned = ? WHERE id = ?")
          .bind(b.banned ? 1 : 0, Number(m[1]))
          .run();
        return json({ ok: true });
      }

      if (pathname === "/api/admin/stats" && request.method === "GET") {
        const usersCount = await db.prepare("SELECT COUNT(*) c FROM users").first();
        const botsCount = await db.prepare("SELECT COUNT(*) c FROM bots").first();
        const unlocks = await db.prepare("SELECT COUNT(*) c FROM user_bot_progress WHERE unlocked = 1").first();
        return json({
          users: usersCount.c,
          bots: botsCount.c,
          unlocks: unlocks.c,
        });
      }

      return json({ error: "not found" }, 404);
    } catch (err) {
      return json({ error: String(err && err.message ? err.message : err) }, 500);
    }
  },
};
