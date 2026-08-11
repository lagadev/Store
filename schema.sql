-- ============================================================
-- TeleBot Store — D1 Schema (v4: no bot-hosting required)
-- ============================================================

DROP TABLE IF EXISTS user_bot_progress;
DROP TABLE IF EXISTS bots;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS settings;

-- Users are created automatically the first time someone opens the Mini App.
CREATE TABLE users (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id       INTEGER UNIQUE NOT NULL,
  username          TEXT,
  first_name        TEXT,
  photo_url         TEXT,
  balance           INTEGER DEFAULT 0,
  referred_by       INTEGER,              -- telegram_id of referrer
  referral_count    INTEGER DEFAULT 0,
  bots_unlocked     INTEGER DEFAULT 0,
  ads_watched_today INTEGER DEFAULT 0,
  last_ad_date      TEXT,                 -- 'YYYY-MM-DD', resets ads_watched_today
  is_banned         INTEGER DEFAULT 0,
  created_at        TEXT DEFAULT (datetime('now'))
);

CREATE TABLE bots (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  title           TEXT NOT NULL,
  description     TEXT,
  thumbnail_url   TEXT,
  tutorial_url    TEXT,
  redirect_link   TEXT NOT NULL,
  price_coins     INTEGER DEFAULT 100,   -- coin cost to unlock
  category        TEXT DEFAULT 'New',
  is_active       INTEGER DEFAULT 1,
  sort_order      INTEGER DEFAULT 0,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE user_bot_progress (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         INTEGER NOT NULL,
  bot_id          INTEGER NOT NULL,
  unlocked        INTEGER DEFAULT 0,
  unlocked_at     TEXT,
  UNIQUE(user_id, bot_id)
);

-- Every one of these is live-editable from /admin → Settings, no redeploy.
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_progress_user ON user_bot_progress(user_id);
CREATE INDEX idx_progress_bot ON user_bot_progress(bot_id);

INSERT INTO settings (key, value) VALUES
  ('coins_per_ad', '50'),
  ('daily_ad_limit', '10'),
  ('coins_per_refer', '20'),
  ('min_ad_seconds', '7'),
  ('bot_username', ''),
  ('app_short_name', 'store'),
  ('refer_share_text', 'Join and get TBC Bot Template For Free!'),
  ('contact_support_url', ''),
  ('tutorial_video_url', '');

-- Seed a couple of sample bots so the store isn't empty on first run
INSERT INTO bots (title, description, thumbnail_url, tutorial_url, redirect_link, price_coins, category)
VALUES
('SMM Panel Bot — TPY Source', 'Full SMM reseller bot source code. Multi-provider API, coin economy, referral system, admin panel included. Ready to deploy on Telebot Creator.', 'https://placehold.co/640x360/7B68EE/ffffff?text=SMM+Bot', '', 'https://t.me/', 250, 'New'),
('Crash Game Bot Source', 'Provably-fair crash gambling bot with bKash/Nagad deposit flow and admin dashboard.', 'https://placehold.co/640x360/8FCB3F/ffffff?text=Crash+Bot', '', 'https://t.me/', 300, 'Popular');
