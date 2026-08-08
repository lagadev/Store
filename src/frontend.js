export const INDEX_HTML = `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Bot Store</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#EDEAFB;
  --bg2:#E3DFFC;
  --card:#ffffff;
  --purple:#7B68EE;
  --purple-dark:#6552D9;
  --green:#8FCB3F;
  --green-dark:#79b52c;
  --blue:#4FA6F7;
  --ink:#241E42;
  --sub:#8B85A7;
  --radius:22px;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{margin:0;font-family:'Inter','Noto Sans Bengali',sans-serif;background:var(--bg);color:var(--ink);}
.font-display{font-family:'Baloo 2','Noto Sans Bengali',sans-serif;}
#app{max-width:480px;margin:0 auto;min-height:100vh;background:linear-gradient(180deg,var(--bg) 0%,var(--bg2) 100%);padding-bottom:92px;position:relative;}

/* ---------- top bar ---------- */
.topbar{display:flex;align-items:center;gap:10px;padding:18px 18px 6px;}
.avatar{width:52px;height:52px;border-radius:50%;object-fit:cover;border:3px solid #fff;box-shadow:0 4px 14px rgba(123,104,238,.25);background:#ddd;}
.balance-pill{display:flex;align-items:center;gap:8px;background:#fff;border-radius:20px;padding:6px 14px 6px 8px;box-shadow:0 4px 14px rgba(90,70,180,.10);}
.balance-pill .coin{width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#FFE27A,#F5B942);display:flex;align-items:center;justify-content:center;font-size:14px;}
.balance-pill b{font-size:15px;line-height:1;}
.balance-pill span{display:block;font-size:10px;color:var(--sub);}
.earn-btn{margin-left:auto;background:#DCEBFF;color:#2B7FE0;border:none;padding:10px 14px;border-radius:16px;font-weight:700;font-size:12px;white-space:nowrap;}
.username-pill{display:block;width:max-content;margin:10px auto 0;background:#fff;border-radius:16px;padding:7px 18px;font-size:13px;font-weight:600;color:var(--purple-dark);box-shadow:0 4px 14px rgba(90,70,180,.08);}

/* ---------- stats ---------- */
.section-title{font-family:'Baloo 2','Noto Sans Bengali',sans-serif;font-size:22px;font-weight:700;text-align:center;margin:22px 0 14px;}
.stats-row{display:flex;gap:14px;padding:0 18px;}
.stat-card{flex:1;border-radius:var(--radius);padding:18px 14px;color:#fff;position:relative;overflow:hidden;min-height:118px;}
.stat-card.purple{background:radial-gradient(120% 100% at 100% 0%,#9C8CFF 0%,var(--purple) 55%,var(--purple-dark) 100%);}
.stat-card.green{background:radial-gradient(120% 100% at 100% 0%,#B6E56B 0%,var(--green) 55%,var(--green-dark) 100%);}
.stat-card .icon{width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:22px;}
.stat-card .label{font-size:12px;opacity:.9;font-weight:600;}
.stat-card .value{font-family:'Baloo 2';font-size:22px;font-weight:800;margin-top:2px;}
.sync-row{display:flex;justify-content:center;margin-top:14px;}
.sync-pill{display:flex;align-items:center;gap:8px;background:#fff;border:none;border-radius:16px;padding:9px 18px;font-size:13px;font-weight:600;color:var(--ink);box-shadow:0 4px 14px rgba(90,70,180,.08);}

/* ---------- chips ---------- */
.chip-row{display:flex;gap:10px;padding:0 18px;overflow-x:auto;margin-top:6px;}
.chip{flex:none;display:flex;align-items:center;gap:6px;background:#fff;border-radius:14px;padding:9px 14px;font-size:12px;font-weight:700;color:var(--sub);box-shadow:0 3px 10px rgba(90,70,180,.07);}
.chip.active{background:var(--purple);color:#fff;}

/* ---------- bot list card (home preview / store) ---------- */
.list-wrap{padding:14px 18px 4px;display:flex;flex-direction:column;gap:14px;}
.bot-card{background:#fff;border-radius:20px;padding:12px;display:flex;gap:12px;align-items:center;box-shadow:0 6px 18px rgba(90,70,180,.08);}
.bot-thumb{width:76px;height:43px;border-radius:12px;object-fit:cover;background:#eee;flex:none;}
.bot-info{flex:1;min-width:0;}
.bot-info .t{font-weight:700;font-size:13.5px;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.bot-info .m{font-size:11px;color:var(--sub);display:flex;gap:8px;align-items:center;}
.badge{display:inline-block;background:#F1EEFF;color:var(--purple-dark);font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;}
.view-btn{background:var(--blue);color:#fff;border:none;padding:9px 16px;border-radius:14px;font-weight:700;font-size:12px;flex:none;}

/* ---------- store grid (16:9 thumbnails) ---------- */
.store-grid{padding:12px 18px 4px;display:flex;flex-direction:column;gap:16px;}
.store-card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 6px 18px rgba(90,70,180,.08);}
.store-card .thumb{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;background:#eee;}
.store-card .body{padding:12px 14px 14px;}
.store-card .t{font-weight:700;font-size:14.5px;margin-bottom:2px;}
.store-card .cat{font-size:11px;color:var(--sub);margin-bottom:10px;}
.store-card .actions{display:flex;}
.btn-block{width:100%;background:var(--purple);color:#fff;border:none;padding:11px;border-radius:14px;font-weight:700;font-size:13px;}

/* ---------- bottom nav ---------- */
.navbar{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);width:calc(100% - 36px);max-width:444px;background:#fff;border-radius:24px;display:flex;justify-content:space-around;padding:10px 6px;box-shadow:0 10px 30px rgba(90,70,180,.18);}
.nav-item{border:none;background:none;display:flex;flex-direction:column;align-items:center;gap:3px;color:#B7B2CE;font-size:10.5px;font-weight:700;padding:4px 14px;}
.nav-item .ic{font-size:19px;}
.nav-item.active{color:var(--purple);}

/* ---------- sheet / modal ---------- */
.overlay{position:fixed;inset:0;background:rgba(36,30,66,.45);display:none;align-items:flex-end;justify-content:center;z-index:50;}
.overlay.show{display:flex;}
.sheet{background:#fff;width:100%;max-width:480px;border-radius:26px 26px 0 0;padding:20px 20px 26px;max-height:88vh;overflow-y:auto;animation:up .25s ease;}
@keyframes up{from{transform:translateY(30px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.sheet-handle{width:40px;height:4px;background:#E3E0F5;border-radius:4px;margin:0 auto 14px;}
.sheet .thumb{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:16px;background:#eee;margin-bottom:14px;}
.sheet h2{font-family:'Baloo 2';font-size:19px;margin:0 0 8px;}
.sheet p.desc{font-size:13.5px;color:#57517A;line-height:1.55;margin:0 0 16px;}
.progress-wrap{background:#F3F1FF;border-radius:16px;padding:14px;margin-bottom:14px;}
.progress-top{display:flex;justify-content:space-between;font-size:12.5px;font-weight:700;color:var(--purple-dark);margin-bottom:8px;}
.progress-bar{height:9px;background:#E3E0F5;border-radius:6px;overflow:hidden;}
.progress-fill{height:100%;background:linear-gradient(90deg,#9C8CFF,var(--purple));border-radius:6px;transition:width .3s ease;}
.stack{display:flex;flex-direction:column;gap:10px;}
.btn-secondary{width:100%;background:#F1EEFF;color:var(--purple-dark);border:none;padding:13px;border-radius:14px;font-weight:700;font-size:13.5px;}
.btn-primary{width:100%;background:var(--purple);color:#fff;border:none;padding:13px;border-radius:14px;font-weight:700;font-size:13.5px;}
.btn-primary:disabled{opacity:.45;}
.btn-success{width:100%;background:var(--green-dark);color:#fff;border:none;padding:13px;border-radius:14px;font-weight:700;font-size:13.5px;}

/* ---------- profile ---------- */
.profile-hero{display:flex;flex-direction:column;align-items:center;padding:26px 18px 6px;}
.profile-hero .avatar{width:84px;height:84px;margin-bottom:10px;}
.profile-hero .name{font-family:'Baloo 2';font-size:18px;font-weight:700;}
.profile-hero .handle{font-size:12.5px;color:var(--sub);}
.balance-strip{margin:16px 18px 0;background:linear-gradient(120deg,#9C8CFF,var(--purple));border-radius:20px;padding:16px 18px;color:#fff;display:flex;justify-content:space-between;align-items:center;}
.balance-strip .v{font-family:'Baloo 2';font-size:22px;font-weight:800;}
.balance-strip .l{font-size:11.5px;opacity:.85;}
.panel{margin:14px 18px 0;background:#fff;border-radius:20px;padding:16px 16px;box-shadow:0 6px 18px rgba(90,70,180,.08);}
.panel h3{margin:0 0 10px;font-size:13.5px;color:var(--sub);font-weight:700;text-transform:uppercase;letter-spacing:.03em;}
.refer-box{display:flex;align-items:center;background:#F3F1FF;border-radius:14px;padding:10px 12px;gap:8px;margin-bottom:10px;}
.refer-box input{border:none;background:none;flex:1;font-size:12px;color:var(--ink);min-width:0;}
.refer-actions{display:flex;gap:10px;}
.pill-btn{flex:1;text-align:center;background:var(--purple);color:#fff;border:none;padding:11px;border-radius:14px;font-weight:700;font-size:12.5px;}
.pill-btn.alt{background:#DCEBFF;color:#2B7FE0;}
.row-link{display:flex;align-items:center;justify-content:space-between;padding:12px 2px;font-size:13.5px;font-weight:600;border-bottom:1px solid #F0EEFA;}
.row-link:last-child{border-bottom:none;}
.row-link .arrow{color:#C7C2E6;}
.empty{text-align:center;color:var(--sub);font-size:13px;padding:30px 10px;}
.toast{position:fixed;bottom:110px;left:50%;transform:translateX(-50%);background:#241E42;color:#fff;padding:10px 18px;border-radius:14px;font-size:12.5px;z-index:80;opacity:0;pointer-events:none;transition:opacity .25s;}
.toast.show{opacity:1;}
.ad-overlay{position:fixed;inset:0;background:#181229;display:none;align-items:center;justify-content:center;flex-direction:column;color:#fff;z-index:99;}
.ad-overlay.show{display:flex;}
.ad-ring{width:64px;height:64px;border-radius:50%;border:5px solid rgba(255,255,255,.2);border-top-color:var(--purple);animation:spin 1s linear infinite;margin-bottom:16px;}
@keyframes spin{to{transform:rotate(360deg);}}
</style>
</head>
<body>
<div id="app">

  <div id="tab-home"></div>
  <div id="tab-store" style="display:none;"></div>
  <div id="tab-profile" style="display:none;"></div>

  <div class="navbar">
    <button class="nav-item active" data-tab="home"><span class="ic">🏠</span>Home</button>
    <button class="nav-item" data-tab="store"><span class="ic">🛒</span>Store</button>
    <button class="nav-item" data-tab="profile"><span class="ic">👤</span>Profile</button>
  </div>
</div>

<div class="overlay" id="sheetOverlay">
  <div class="sheet" id="sheetBody"></div>
</div>

<div class="ad-overlay" id="adOverlay">
  <div class="ad-ring"></div>
  <div id="adText" style="font-weight:700;">বিজ্ঞাপন চলছে…</div>
  <div style="font-size:12px;opacity:.7;margin-top:6px;" id="adSub">দয়া করে অপেক্ষা করুন</div>
</div>

<div class="toast" id="toast"></div>

<script>
(function(){
  var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  if (tg) { tg.ready(); tg.expand(); }

  var qs = new URLSearchParams(location.search);
  var tgUser = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : {
    id: Number(qs.get('tid')) || 999999,
    username: qs.get('username') || 'demo_user',
    first_name: qs.get('first_name') || 'Demo'
  };
  var startParam = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) ? tg.initDataUnsafe.start_param : qs.get('startapp');
  var refFromStart = null;
  if (startParam && startParam.indexOf('ref_') === 0) refFromStart = startParam.replace('ref_','');

  var initDataHeader = (tg && tg.initData) ? tg.initData : '';
  var BOT_USERNAME = 'YourBotUsername'; // TODO: set your bot's username
  var APP_NAME = 'store';               // TODO: set your Mini App short name

  var state = { user:null, isAdmin:false, bots:[], activeTab:'home', currentBot:null };

  function api(path, opts){
    opts = opts || {};
    opts.headers = Object.assign({'Content-Type':'application/json'}, opts.headers||{});
    if (initDataHeader) opts.headers['X-Init-Data'] = initDataHeader;
    var sep = path.indexOf('?') === -1 ? '?' : '&';
    if (!initDataHeader) path += sep + 'tid=' + tgUser.id + '&username=' + encodeURIComponent(tgUser.username||'') + '&first_name=' + encodeURIComponent(tgUser.first_name||'');
    return fetch(path, opts).then(function(r){ return r.json(); });
  }

  function toast(msg){
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, 1800);
  }

  function esc(s){
    return (s==null?'':String(s)).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  // ---------- render: HOME ----------
  function renderHome(){
    var u = state.user || {};
    var box = document.getElementById('tab-home');
    var html = '';
    html += '<div class="topbar">';
    html += '  <img class="avatar" src="' + esc(u.photo_url || 'https://placehold.co/100x100/7B68EE/ffffff?text=' + esc((u.first_name||'U')[0])) + '">';
    html += '  <div class="balance-pill"><div class="coin">🪙</div><div><b>' + (u.balance||0) + '</b><span>Coins</span></div></div>';
    html += '  <button class="earn-btn" id="howToEarnBtn">How to earn?</button>';
    html += '</div>';
    html += '<div class="username-pill">@' + esc(u.username || 'user') + '</div>';

    html += '<div class="section-title">Statistics</div>';
    html += '<div class="stats-row">';
    html += '  <div class="stat-card purple"><div class="icon">👥</div><div class="label">Total Refer</div><div class="value">' + (u.referral_count||0) + '</div></div>';
    html += '  <div class="stat-card green"><div class="icon">🤖</div><div class="label">Total Bot</div><div class="value">' + (u.bots_unlocked||0) + '</div></div>';
    html += '</div>';
    html += '<div class="sync-row"><button class="sync-pill" id="syncBtn">🔄 Today</button></div>';

    html += '<div class="section-title" style="margin-top:26px;">Recommended Bots</div>';
    html += '<div class="chip-row">';
    html += '  <div class="chip active">⭐ New</div>';
    html += '  <div class="chip">🔥 Popular</div>';
    html += '  <div class="chip">🎁 Free</div>';
    html += '</div>';
    html += '<div class="list-wrap" id="homeBotList"></div>';

    box.innerHTML = html;
    document.getElementById('howToEarnBtn').onclick = showEarnInfo;
    document.getElementById('syncBtn').onclick = function(){ loadUser(); loadBots(); toast('Refreshed'); };
    renderHomeBotList();
  }

  function renderHomeBotList(){
    var wrap = document.getElementById('homeBotList');
    if (!wrap) return;
    if (!state.bots.length){ wrap.innerHTML = '<div class="empty">No bots yet. Check back soon.</div>'; return; }
    var html = '';
    state.bots.slice(0,4).forEach(function(b){
      html += '<div class="bot-card">';
      html += '  <img class="bot-thumb" src="' + esc(b.thumbnail_url||'') + '">';
      html += '  <div class="bot-info"><div class="t">' + esc(b.title) + '</div><div class="m"><span class="badge">' + esc(b.category||'New') + '</span><span>' + b.ads_required + ' ads</span></div></div>';
      html += '  <button class="view-btn" data-id="' + b.id + '">View</button>';
      html += '</div>';
    });
    wrap.innerHTML = html;
    wrap.querySelectorAll('.view-btn').forEach(function(btn){
      btn.onclick = function(){ openBotDetail(Number(btn.getAttribute('data-id'))); };
    });
  }

  function showEarnInfo(){
    var html = '';
    html += '<div class="sheet-handle"></div>';
    html += '<h2>কয়েন কীভাবে আয় করবেন?</h2>';
    html += '<p class="desc">১) Store থেকে যেকোনো বট সিলেক্ট করে বিজ্ঞাপন দেখে সেটি আনলক করুন — প্রতিটি বট আনলকে কয়েন বোনাস পাবেন।<br><br>২) আপনার Refer Link বন্ধুদের সাথে শেয়ার করুন — প্রতিটি নতুন ইউজারে আপনি কয়েন পাবেন।</p>';
    html += '<button class="btn-primary" id="closeSheetBtn">বুঝেছি</button>';
    openSheet(html);
  }

  // ---------- render: STORE ----------
  function renderStore(){
    var box = document.getElementById('tab-store');
    var html = '';
    html += '<div class="section-title" style="margin-top:24px;">Latest Bots</div>';
    html += '<div class="store-grid" id="storeGrid"></div>';
    box.innerHTML = html;
    renderStoreGrid();
  }

  function renderStoreGrid(){
    var wrap = document.getElementById('storeGrid');
    if (!wrap) return;
    if (!state.bots.length){ wrap.innerHTML = '<div class="empty">No bots available right now.</div>'; return; }
    var html = '';
    state.bots.forEach(function(b){
      html += '<div class="store-card">';
      html += '  <img class="thumb" src="' + esc(b.thumbnail_url||'') + '">';
      html += '  <div class="body">';
      html += '    <div class="t">' + esc(b.title) + '</div>';
      html += '    <div class="cat">' + esc(b.category||'New') + ' &middot; ' + b.ads_required + ' ads to unlock</div>';
      html += '    <div class="actions"><button class="btn-block" data-id="' + b.id + '">View Details</button></div>';
      html += '  </div>';
      html += '</div>';
    });
    wrap.innerHTML = html;
    wrap.querySelectorAll('[data-id]').forEach(function(btn){
      btn.onclick = function(){ openBotDetail(Number(btn.getAttribute('data-id'))); };
    });
  }

  // ---------- bot detail sheet ----------
  function openBotDetail(id){
    api('/api/bots/' + id).then(function(res){
      if (res.error){ toast('Failed to load'); return; }
      state.currentBot = res;
      renderBotDetail();
    });
  }

  function renderBotDetail(){
    var d = state.currentBot;
    var bot = d.bot, p = d.progress || {ads_watched:0, unlocked:0};
    var pct = Math.min(100, Math.round((p.ads_watched / bot.ads_required) * 100));
    var done = p.ads_watched >= bot.ads_required;

    var html = '';
    html += '<div class="sheet-handle"></div>';
    html += '<img class="thumb" src="' + esc(bot.thumbnail_url||'') + '">';
    html += '<h2>' + esc(bot.title) + '</h2>';
    html += '<p class="desc">' + esc(bot.description||'') + '</p>';

    html += '<div class="progress-wrap"><div class="progress-top"><span>Ads Watched</span><span>' + p.ads_watched + '/' + bot.ads_required + ' ads</span></div>';
    html += '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%;"></div></div></div>';

    html += '<div class="stack">';
    if (bot.tutorial_url){
      html += '<button class="btn-secondary" id="tutorialBtn">🎬 Watch Tutorial</button>';
    }
    if (!done){
      html += '<button class="btn-primary" id="watchAdBtn">▶️ Watch Ad (' + (p.ads_watched) + '/' + bot.ads_required + ')</button>';
    } else {
      html += '<button class="btn-success" id="getBotBtn">✅ Get Bot</button>';
    }
    html += '</div>';

    openSheet(html);

    var tutBtn = document.getElementById('tutorialBtn');
    if (tutBtn) tutBtn.onclick = function(){ window.open(bot.tutorial_url, '_blank'); };

    var adBtn = document.getElementById('watchAdBtn');
    if (adBtn) adBtn.onclick = function(){ playAd(bot.id); };

    var getBtn = document.getElementById('getBotBtn');
    if (getBtn) getBtn.onclick = function(){ claimBot(bot.id); };
  }

  function playAd(botId){
    var overlay = document.getElementById('adOverlay');
    overlay.classList.add('show');
    var sub = document.getElementById('adSub');
    var secs = 5;
    sub.textContent = secs + 's';
    var timer = setInterval(function(){
      secs--;
      sub.textContent = secs > 0 ? secs + 's' : 'Done';
      if (secs <= 0){
        clearInterval(timer);
        overlay.classList.remove('show');
        api('/api/bots/' + botId + '/watch-ad', { method:'POST' }).then(function(res){
          if (res.error){ toast('Something went wrong'); return; }
          state.currentBot.progress = res.progress;
          renderBotDetail();
          loadUser();
        });
      }
    }, 1000);
    // NOTE: Replace this simulated timer with your real ad SDK call, e.g.:
    // show_9368336().then(() => api('/api/bots/'+botId+'/watch-ad', {method:'POST'}).then(...))
  }

  function claimBot(botId){
    api('/api/bots/' + botId + '/claim', { method:'POST' }).then(function(res){
      if (res.error){ toast(res.error); return; }
      closeSheet();
      loadUser();
      toast('Bot unlocked! 🎉');
      if (tg && tg.openLink) tg.openLink(res.redirect); else window.open(res.redirect, '_blank');
    });
  }

  // ---------- render: PROFILE ----------
  function renderProfile(){
    var u = state.user || {};
    var box = document.getElementById('tab-profile');
    var referLink = 'https://t.me/' + BOT_USERNAME + '/' + APP_NAME + '?startapp=ref_' + (u.telegram_id||'');
    var html = '';
    html += '<div class="profile-hero">';
    html += '  <img class="avatar" src="' + esc(u.photo_url || 'https://placehold.co/120x120/7B68EE/ffffff?text=' + esc((u.first_name||'U')[0])) + '">';
    html += '  <div class="name">' + esc(u.first_name||'User') + '</div>';
    html += '  <div class="handle">@' + esc(u.username||'user') + '</div>';
    html += '</div>';

    html += '<div class="balance-strip"><div><div class="l">Total Coins</div><div class="v">🪙 ' + (u.balance||0) + '</div></div><div style="text-align:right;"><div class="l">Bots Unlocked</div><div class="v">' + (u.bots_unlocked||0) + '</div></div></div>';

    html += '<div class="panel"><h3>Refer &amp; Earn</h3>';
    html += '<div class="refer-box"><input readonly id="referInput" value="' + esc(referLink) + '"></div>';
    html += '<div class="refer-actions"><button class="pill-btn" id="copyRefBtn">Copy Link</button><button class="pill-btn alt" id="shareRefBtn">Share</button></div>';
    html += '</div>';

    html += '<div class="panel"><h3>More</h3>';
    html += '<div class="row-link" id="supportRow"><span>💬 Contact Support</span><span class="arrow">›</span></div>';
    html += '<div class="row-link" id="tutorialRow"><span>🎬 Tutorial Video</span><span class="arrow">›</span></div>';
    if (state.isAdmin){
      html += '<div class="row-link" id="adminRow"><span>🛠️ Admin Panel</span><span class="arrow">›</span></div>';
    }
    html += '</div>';

    box.innerHTML = html;

    document.getElementById('copyRefBtn').onclick = function(){
      var input = document.getElementById('referInput');
      input.select(); input.setSelectionRange(0,999);
      navigator.clipboard && navigator.clipboard.writeText(input.value);
      toast('Link copied!');
    };
    document.getElementById('shareRefBtn').onclick = function(){
      var url = 'https://t.me/share/url?url=' + encodeURIComponent(referLink) + '&text=' + encodeURIComponent('Join and get bots free!');
      if (tg && tg.openTelegramLink) tg.openTelegramLink(url); else window.open(url, '_blank');
    };
    document.getElementById('supportRow').onclick = function(){
      var url = 'https://t.me/YourSupportUsername'; // TODO: set support username
      if (tg && tg.openTelegramLink) tg.openTelegramLink(url); else window.open(url, '_blank');
    };
    document.getElementById('tutorialRow').onclick = function(){
      window.open('https://t.me/YourChannel', '_blank'); // TODO: set tutorial link
    };
    var adminRow = document.getElementById('adminRow');
    if (adminRow) adminRow.onclick = function(){ location.href = '/admin?tid=' + tgUser.id; };
  }

  // ---------- sheet helpers ----------
  function openSheet(innerHtml){
    document.getElementById('sheetBody').innerHTML = innerHtml;
    document.getElementById('sheetOverlay').classList.add('show');
    var closeBtn = document.getElementById('closeSheetBtn');
    if (closeBtn) closeBtn.onclick = closeSheet;
  }
  function closeSheet(){ document.getElementById('sheetOverlay').classList.remove('show'); }
  document.getElementById('sheetOverlay').addEventListener('click', function(e){
    if (e.target.id === 'sheetOverlay') closeSheet();
  });

  // ---------- tabs ----------
  function switchTab(tab){
    state.activeTab = tab;
    document.getElementById('tab-home').style.display = tab==='home' ? '' : 'none';
    document.getElementById('tab-store').style.display = tab==='store' ? '' : 'none';
    document.getElementById('tab-profile').style.display = tab==='profile' ? '' : 'none';
    document.querySelectorAll('.nav-item').forEach(function(el){
      el.classList.toggle('active', el.getAttribute('data-tab')===tab);
    });
  }
  document.querySelectorAll('.nav-item').forEach(function(el){
    el.onclick = function(){ switchTab(el.getAttribute('data-tab')); };
  });

  // ---------- data loading ----------
  function loadUser(){
    var path = '/api/auth';
    return fetch(path, {
      method:'POST',
      headers: Object.assign({'Content-Type':'application/json'}, initDataHeader?{'X-Init-Data':initDataHeader}:{}),
      body: JSON.stringify({ initData: initDataHeader, devUser: tgUser, startParam: refFromStart })
    }).then(function(r){ return r.json(); }).then(function(res){
      if (res.user){ state.user = res.user; state.isAdmin = res.isAdmin; }
      renderHome(); renderProfile();
    });
  }

  function loadBots(){
    return api('/api/bots').then(function(res){
      state.bots = res.bots || [];
      renderHomeBotList(); renderStoreGrid();
    });
  }

  renderHome(); renderStore(); renderProfile();
  loadUser();
  loadBots();
})();
</script>
</body>
</html>`;
