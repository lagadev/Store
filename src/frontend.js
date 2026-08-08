export const INDEX_HTML = `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Bot Store</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<!-- Monetag rewarded interstitial SDK — replace data-zone if your zone id differs -->
<script src="//libtl.com/sdk.js" data-zone="11533496" data-sdk="show_11533496"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#EEEBFC;
  --bg2:#E2DDFA;
  --card:#ffffff;
  --purple:#6C5CE7;
  --purple-2:#8A7BFF;
  --purple-dark:#5A4BD1;
  --green:#3FBF83;
  --green-2:#63D69E;
  --blue:#4A9DF8;
  --amber:#FFB74A;
  --ink:#221B3F;
  --sub:#918AAE;
  --line:#EFEBFB;
  --radius:24px;
  --shadow:0 10px 26px rgba(90,70,180,.10);
  --shadow-sm:0 6px 16px rgba(90,70,180,.08);
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{margin:0;font-family:'Inter','Noto Sans Bengali',sans-serif;background:var(--bg);color:var(--ink);}
.font-display{font-family:'Baloo 2','Noto Sans Bengali',sans-serif;}
#app{max-width:480px;margin:0 auto;min-height:100vh;background:linear-gradient(180deg,var(--bg) 0%,var(--bg2) 100%);padding-bottom:100px;position:relative;}
svg.ic{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;display:block;}

/* ---------- top bar ---------- */
.topbar{display:flex;align-items:center;gap:10px;padding:20px 18px 6px;}
.avatar{width:52px;height:52px;border-radius:18px;object-fit:cover;border:3px solid #fff;box-shadow:var(--shadow-sm);background:#ddd;}
.balance-pill{display:flex;align-items:center;gap:8px;background:#fff;border-radius:18px;padding:6px 14px 6px 8px;box-shadow:var(--shadow-sm);}
.balance-pill .coin{width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 32% 28%,#FFE9AE,var(--amber));display:flex;align-items:center;justify-content:center;color:#8a5c00;}
.balance-pill b{font-size:15px;line-height:1;font-weight:800;}
.balance-pill span{display:block;font-size:9.5px;color:var(--sub);font-weight:600;}
.earn-btn{margin-left:auto;background:var(--purple);color:#fff;border:none;padding:11px 15px;border-radius:16px;font-weight:700;font-size:12px;white-space:nowrap;display:flex;align-items:center;gap:6px;box-shadow:0 8px 18px rgba(108,92,231,.28);}
.username-pill{display:flex;align-items:center;gap:6px;width:max-content;margin:12px auto 0;background:#fff;border-radius:16px;padding:8px 16px;font-size:12.5px;font-weight:700;color:var(--purple-dark);box-shadow:var(--shadow-sm);}

/* ---------- stats ---------- */
.section-title{font-family:'Baloo 2','Noto Sans Bengali',sans-serif;font-size:21px;font-weight:700;text-align:center;margin:24px 0 14px;}
.stats-row{display:flex;gap:14px;padding:0 18px;}
.stat-card{flex:1;border-radius:var(--radius);padding:18px 16px;color:#fff;position:relative;overflow:hidden;min-height:120px;isolation:isolate;}
.stat-card.purple{background:linear-gradient(150deg,var(--purple-2) 0%,var(--purple) 55%,var(--purple-dark) 100%);}
.stat-card.gold{background:linear-gradient(150deg,#FFD980 0%,var(--amber) 55%,#E8952A 100%);}
.stat-card::after{content:"";position:absolute;right:-30px;top:-30px;width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.12);z-index:-1;}
.stat-card::before{content:"";position:absolute;right:10px;bottom:-40px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.08);z-index:-1;}
.stat-card .icon{width:42px;height:42px;border-radius:13px;background:rgba(255,255,255,.24);display:flex;align-items:center;justify-content:center;margin-bottom:24px;}
.stat-card .label{font-size:11.5px;opacity:.92;font-weight:700;}
.stat-card .value{font-family:'Baloo 2';font-size:23px;font-weight:800;margin-top:2px;}

/* ---------- promo banner (replaces recommended list) ---------- */
.promo{margin:22px 18px 0;border-radius:var(--radius);padding:20px;background:linear-gradient(120deg,#2E2657 0%,#463A87 55%,var(--purple) 100%);color:#fff;position:relative;overflow:hidden;box-shadow:var(--shadow);}
.promo .dot{position:absolute;border-radius:50%;background:rgba(255,255,255,.08);}
.promo .dot.d1{width:140px;height:140px;right:-40px;top:-50px;}
.promo .dot.d2{width:80px;height:80px;left:-20px;bottom:-30px;}
.promo .badge-ic{width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
.promo h3{font-family:'Baloo 2';font-size:17px;margin:0 0 4px;position:relative;}
.promo p{font-size:12.5px;opacity:.85;margin:0 0 16px;position:relative;line-height:1.5;}
.promo button{position:relative;background:#fff;color:var(--purple-dark);border:none;padding:11px 18px;border-radius:14px;font-weight:800;font-size:12.5px;display:flex;align-items:center;gap:6px;}

/* ---------- bot list / store cards ---------- */
.store-grid{padding:14px 18px 4px;display:flex;flex-direction:column;gap:16px;}
.store-card{background:#fff;border-radius:22px;overflow:hidden;box-shadow:var(--shadow-sm);transition:transform .15s ease;}
.store-card .thumb-wrap{position:relative;}
.store-card .thumb{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;background:#eee;}
.price-tag{position:absolute;top:10px;right:10px;background:rgba(34,27,63,.78);backdrop-filter:blur(3px);color:#fff;font-size:11.5px;font-weight:800;padding:6px 11px;border-radius:12px;display:flex;align-items:center;gap:5px;}
.price-tag .dot-coin{width:15px;height:15px;border-radius:50%;background:var(--amber);display:inline-flex;align-items:center;justify-content:center;color:#7a4d00;font-size:9px;}
.store-card .body{padding:13px 15px 15px;}
.store-card .t{font-weight:800;font-size:14.5px;margin-bottom:3px;}
.store-card .cat{font-size:11px;color:var(--sub);margin-bottom:12px;font-weight:600;}
.btn-block{width:100%;background:var(--purple);color:#fff;border:none;padding:12px;border-radius:14px;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;gap:7px;}

/* ---------- bottom nav ---------- */
.navbar{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);width:calc(100% - 32px);max-width:448px;background:#fff;border-radius:24px;display:flex;justify-content:space-around;padding:9px 4px;box-shadow:0 12px 30px rgba(90,70,180,.20);}
.nav-item{border:none;background:none;display:flex;flex-direction:column;align-items:center;gap:3px;color:#BDB6D8;font-size:10px;font-weight:700;padding:6px 10px;border-radius:14px;transition:background .15s ease;}
.nav-item.active{color:var(--purple);background:#F2EFFF;}

/* ---------- sheet / modal ---------- */
.overlay{position:fixed;inset:0;background:rgba(34,27,63,.5);display:none;align-items:flex-end;justify-content:center;z-index:50;}
.overlay.show{display:flex;}
.sheet{background:#fff;width:100%;max-width:480px;border-radius:28px 28px 0 0;padding:20px 20px 26px;max-height:90vh;overflow-y:auto;animation:up .25s ease;}
@keyframes up{from{transform:translateY(30px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.sheet-handle{width:40px;height:4px;background:#E5E1F7;border-radius:4px;margin:0 auto 14px;}
.sheet .thumb{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:18px;background:#eee;margin-bottom:14px;}
.sheet h2{font-family:'Baloo 2';font-size:19px;margin:0 0 8px;}
.sheet p.desc{font-size:13.5px;color:#5B5480;line-height:1.6;margin:0 0 16px;}
.price-row{display:flex;align-items:center;justify-content:space-between;background:#F5F3FF;border-radius:16px;padding:14px 16px;margin-bottom:14px;}
.price-row .p-label{font-size:11.5px;color:var(--sub);font-weight:700;}
.price-row .p-val{font-family:'Baloo 2';font-size:19px;font-weight:800;color:var(--purple-dark);display:flex;align-items:center;gap:6px;}
.price-row .bal{text-align:right;}
.price-row .bal .p-val{color:var(--ink);}
.stack{display:flex;flex-direction:column;gap:10px;}
.btn-secondary{width:100%;background:#F1EEFF;color:var(--purple-dark);border:none;padding:13px;border-radius:14px;font-weight:700;font-size:13.5px;display:flex;align-items:center;justify-content:center;gap:8px;}
.btn-primary{width:100%;background:var(--purple);color:#fff;border:none;padding:13px;border-radius:14px;font-weight:700;font-size:13.5px;display:flex;align-items:center;justify-content:center;gap:8px;}
.btn-primary:disabled{opacity:.4;}
.btn-danger-soft{width:100%;background:#FFEBEC;color:#E0555C;border:none;padding:13px;border-radius:14px;font-weight:700;font-size:12.5px;text-align:center;}
.btn-success{width:100%;background:var(--green);color:#fff;border:none;padding:13px;border-radius:14px;font-weight:700;font-size:13.5px;display:flex;align-items:center;justify-content:center;gap:8px;}

/* ---------- earn tab ---------- */
.earn-hero{margin:20px 18px 0;border-radius:var(--radius);padding:26px 20px;text-align:center;background:linear-gradient(150deg,var(--purple-2),var(--purple) 60%,var(--purple-dark));color:#fff;position:relative;overflow:hidden;box-shadow:var(--shadow);}
.earn-hero .dot{position:absolute;border-radius:50%;background:rgba(255,255,255,.08);}
.earn-hero .dot.e1{width:160px;height:160px;left:-50px;top:-60px;}
.earn-hero .dot.e2{width:100px;height:100px;right:-30px;bottom:-40px;}
.earn-hero .play-wrap{width:64px;height:64px;border-radius:20px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;position:relative;}
.earn-hero h2{font-family:'Baloo 2';font-size:20px;margin:0 0 4px;position:relative;}
.earn-hero p{font-size:12.5px;opacity:.85;margin:0;position:relative;}
.earn-stats{display:flex;gap:12px;margin:16px 18px 0;}
.earn-box{flex:1;background:#fff;border-radius:18px;padding:14px;text-align:center;box-shadow:var(--shadow-sm);}
.earn-box .n{font-family:'Baloo 2';font-size:19px;font-weight:800;color:var(--purple-dark);}
.earn-box .l{font-size:10.5px;color:var(--sub);font-weight:700;margin-top:2px;}
.watch-btn-wrap{margin:20px 18px 0;}
.watch-btn{width:100%;background:linear-gradient(120deg,var(--green-2),var(--green));color:#fff;border:none;padding:17px;border-radius:18px;font-weight:800;font-size:14.5px;display:flex;align-items:center;justify-content:center;gap:9px;box-shadow:0 10px 22px rgba(63,191,131,.35);}
.watch-btn:disabled{background:#D8D4EC;box-shadow:none;color:var(--sub);}
.earn-note{text-align:center;font-size:11.5px;color:var(--sub);margin:12px 20px 0;line-height:1.5;}

/* ---------- profile ---------- */
.profile-hero{display:flex;flex-direction:column;align-items:center;padding:26px 18px 6px;}
.profile-hero .avatar{width:84px;height:84px;margin-bottom:10px;border-radius:26px;}
.profile-hero .name{font-family:'Baloo 2';font-size:18px;font-weight:700;}
.profile-hero .handle{font-size:12.5px;color:var(--sub);}
.balance-strip{margin:16px 18px 0;background:linear-gradient(120deg,var(--purple-2),var(--purple));border-radius:22px;padding:18px;color:#fff;display:flex;justify-content:space-between;align-items:center;box-shadow:var(--shadow);}
.balance-strip .v{font-family:'Baloo 2';font-size:22px;font-weight:800;display:flex;align-items:center;gap:6px;}
.balance-strip .l{font-size:11px;opacity:.85;font-weight:600;}
.panel{margin:14px 18px 0;background:#fff;border-radius:20px;padding:16px 16px;box-shadow:var(--shadow-sm);}
.panel h3{margin:0 0 10px;font-size:12px;color:var(--sub);font-weight:800;text-transform:uppercase;letter-spacing:.04em;}
.refer-box{display:flex;align-items:center;background:#F5F3FF;border-radius:14px;padding:11px 13px;gap:8px;margin-bottom:10px;}
.refer-box input{border:none;background:none;flex:1;font-size:12px;color:var(--ink);min-width:0;}
.refer-actions{display:flex;gap:10px;}
.pill-btn{flex:1;text-align:center;background:var(--purple);color:#fff;border:none;padding:12px;border-radius:14px;font-weight:700;font-size:12.5px;display:flex;align-items:center;justify-content:center;gap:6px;}
.pill-btn.alt{background:#DCEBFF;color:#2B7FE0;}
.row-link{display:flex;align-items:center;justify-content:space-between;padding:13px 2px;font-size:13.5px;font-weight:600;border-bottom:1px solid var(--line);cursor:pointer;}
.row-link:last-child{border-bottom:none;}
.row-link .left{display:flex;align-items:center;gap:10px;}
.row-link .ic-badge{width:34px;height:34px;border-radius:11px;background:#F5F3FF;color:var(--purple);display:flex;align-items:center;justify-content:center;}
.row-link .arrow{color:#C9C4E6;}
.empty{text-align:center;color:var(--sub);font-size:13px;padding:34px 10px;}
.toast{position:fixed;bottom:112px;left:50%;transform:translateX(-50%);background:#221B3F;color:#fff;padding:11px 20px;border-radius:14px;font-size:12.5px;z-index:80;opacity:0;pointer-events:none;transition:opacity .25s;font-weight:600;}
.toast.show{opacity:1;}
</style>
</head>
<body>
<div id="app">

  <div id="tab-home"></div>
  <div id="tab-store" style="display:none;"></div>
  <div id="tab-earn" style="display:none;"></div>
  <div id="tab-profile" style="display:none;"></div>

  <div class="navbar">
    <button class="nav-item active" data-tab="home"></button>
    <button class="nav-item" data-tab="store"></button>
    <button class="nav-item" data-tab="earn"></button>
    <button class="nav-item" data-tab="profile"></button>
  </div>
</div>

<div class="overlay" id="sheetOverlay">
  <div class="sheet" id="sheetBody"></div>
</div>

<div class="toast" id="toast"></div>

<script>
(function(){
  var ICONS = {
    home: '<svg class="ic" viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"/></svg>',
    store: '<svg class="ic" viewBox="0 0 24 24"><path d="M4 8l1.2-3.6A1 1 0 0 1 6.15 3.7h11.7a1 1 0 0 1 .95.68L20 8"/><path d="M4 8h16v10.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z"/><path d="M9 12a3 3 0 0 0 6 0"/></svg>',
    play: '<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" stroke="none"/></svg>',
    user: '<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.5"/><path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5"/></svg>',
    coin: '<svg class="ic" viewBox="0 0 24 24" style="stroke-width:2.2;"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M9.3 9.3c0-1.1 1.1-1.8 2.7-1.8s2.7.8 2.7 1.9c0 2.6-5.4 1.2-5.4 3.8 0 1.1 1.1 1.9 2.7 1.9s2.7-.7 2.7-1.9"/></svg>',
    people: '<svg class="ic" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M2.5 19c1-3 3.3-4.6 6.5-4.6s5.5 1.6 6.5 4.6"/><path d="M15.5 5.2a3 3 0 0 1 0 5.8"/><path d="M17.8 14.6c2.2.4 3.7 1.9 4.5 4.4"/></svg>',
    gift: '<svg class="ic" viewBox="0 0 24 24"><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M4 9h16v3H4z"/><path d="M12 9v11"/><path d="M12 9c-1.2-3-3-4.2-4.3-3.5C6.4 6.2 6.8 8 8.4 9"/><path d="M12 9c1.2-3 3-4.2 4.3-3.5 1.3.7.9 2.5-.7 3.5"/></svg>',
    chevron: '<svg class="ic" style="width:16px;height:16px;" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
    check: '<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/></svg>',
    video: '<svg class="ic" viewBox="0 0 24 24"><rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10 6-3v10l-6-3"/></svg>',
    support: '<svg class="ic" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 1 3 6.2L4 19l.9-3.1A7.96 7.96 0 0 1 4 12Z"/></svg>',
    tag: '<svg class="ic" style="width:15px;height:15px;" viewBox="0 0 24 24"><path d="M3 12.5 12 3.5h7.5v7.5L10.5 21 3 12.5Z"/><circle cx="15.5" cy="8.5" r="1.4" fill="currentColor" stroke="none"/></svg>',
    link: '<svg class="ic" style="width:16px;height:16px;" viewBox="0 0 24 24"><path d="M9.5 14.5 14.5 9.5"/><path d="M11 7l1-1a3.2 3.2 0 0 1 4.5 4.5l-1.2 1.2"/><path d="M13 17l-1 1a3.2 3.2 0 0 1-4.5-4.5l1.2-1.2"/></svg>',
    share: '<svg class="ic" style="width:16px;height:16px;" viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.3"/><circle cx="17" cy="6" r="2.3"/><circle cx="17" cy="18" r="2.3"/><path d="m8 10.8 7-3.6M8 13.2l7 3.6"/></svg>'
  };

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

  var state = { user:null, isAdmin:false, bots:[], settings:{coins_per_ad:50, daily_ad_limit:10, coins_per_refer:20}, activeTab:'home', currentBot:null };

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
    setTimeout(function(){ t.classList.remove('show'); }, 1900);
  }

  function esc(s){
    return (s==null?'':String(s)).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  // ---------- nav icons ----------
  function renderNav(){
    var defs = [
      {tab:'home', icon:ICONS.home, label:'Home'},
      {tab:'store', icon:ICONS.store, label:'Store'},
      {tab:'earn', icon:ICONS.play, label:'Earn'},
      {tab:'profile', icon:ICONS.user, label:'Profile'}
    ];
    document.querySelectorAll('.nav-item').forEach(function(el, i){
      el.innerHTML = defs[i].icon + '<span>' + defs[i].label + '</span>';
    });
  }

  // ---------- render: HOME ----------
  function renderHome(){
    var u = state.user || {};
    var box = document.getElementById('tab-home');
    var html = '';
    html += '<div class="topbar">';
    html += '  <img class="avatar" src="' + esc(u.photo_url || 'https://placehold.co/100x100/6C5CE7/ffffff?text=' + esc((u.first_name||'U')[0])) + '">';
    html += '  <div class="balance-pill"><div class="coin">' + ICONS.coin.replace('class="ic"','class="ic" style="width:15px;height:15px;"') + '</div><div><b>' + (u.balance||0) + '</b><span>Coins</span></div></div>';
    html += '  <button class="earn-btn" id="howToEarnBtn">' + ICONS.play.replace('class="ic"','class="ic" style="width:15px;height:15px;"') + ' Earn</button>';
    html += '</div>';
    html += '<div class="username-pill">' + ICONS.user.replace('class="ic"','class="ic" style="width:14px;height:14px;"') + ' @' + esc(u.username || 'user') + '</div>';

    html += '<div class="section-title">Statistics</div>';
    html += '<div class="stats-row">';
    html += '  <div class="stat-card purple"><div class="icon">' + ICONS.people + '</div><div class="label">Total Refer</div><div class="value">' + (u.referral_count||0) + '</div></div>';
    html += '  <div class="stat-card gold"><div class="icon">' + ICONS.coin + '</div><div class="label">Total Coins</div><div class="value">' + (u.balance||0) + '</div></div>';
    html += '</div>';

    html += '<div class="promo"><div class="dot d1"></div><div class="dot d2"></div>';
    html += '  <div class="badge-ic">' + ICONS.play + '</div>';
    html += '  <h3>Watch ads, earn coins</h3>';
    html += '  <p>প্রতিটি বিজ্ঞাপন দেখে ' + state.settings.coins_per_ad + ' কয়েন পান, তারপর সেই কয়েন দিয়ে যেকোনো বট আনলক করুন।</p>';
    html += '  <button id="goEarnBtn">Start Earning ' + ICONS.chevron + '</button>';
    html += '</div>';

    box.innerHTML = html;
    document.getElementById('howToEarnBtn').onclick = function(){ switchTab('earn'); };
    document.getElementById('goEarnBtn').onclick = function(){ switchTab('earn'); };
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
      html += '  <div class="thumb-wrap"><img class="thumb" src="' + esc(b.thumbnail_url||'') + '">';
      html += '    <div class="price-tag"><span class="dot-coin">$</span>' + b.price_coins + '</div>';
      html += '  </div>';
      html += '  <div class="body">';
      html += '    <div class="t">' + esc(b.title) + '</div>';
      html += '    <div class="cat">' + ICONS.tag.replace('class="ic"','class="ic" style="width:12px;height:12px;display:inline;vertical-align:-2px;"') + ' ' + esc(b.category||'New') + '</div>';
      html += '    <button class="btn-block" data-id="' + b.id + '">View Details ' + ICONS.chevron.replace('class="ic"','class="ic" style="width:14px;height:14px;"') + '</button>';
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
    var bot = d.bot, p = d.progress || {unlocked:0}, balance = d.balance || 0;
    var unlocked = !!p.unlocked;
    var canAfford = balance >= bot.price_coins;

    var html = '';
    html += '<div class="sheet-handle"></div>';
    html += '<img class="thumb" src="' + esc(bot.thumbnail_url||'') + '">';
    html += '<h2>' + esc(bot.title) + '</h2>';
    html += '<p class="desc">' + esc(bot.description||'') + '</p>';

    if (!unlocked){
      html += '<div class="price-row"><div><div class="p-label">Price</div><div class="p-val">' + ICONS.coin.replace('class="ic"','class="ic" style="width:17px;height:17px;color:var(--amber);"') + bot.price_coins + '</div></div>';
      html += '<div class="bal"><div class="p-label">Your Balance</div><div class="p-val">' + balance + '</div></div></div>';
    }

    html += '<div class="stack">';
    if (bot.tutorial_url){
      html += '<button class="btn-secondary" id="tutorialBtn">' + ICONS.video + ' Watch Tutorial</button>';
    }
    if (unlocked){
      html += '<button class="btn-success" id="getBotBtn">' + ICONS.check + ' Get Bot</button>';
    } else if (canAfford){
      html += '<button class="btn-primary" id="unlockBtn">' + ICONS.coin.replace('class="ic"','class="ic" style="width:16px;height:16px;"') + ' Unlock for ' + bot.price_coins + ' coins</button>';
    } else {
      html += '<div class="btn-danger-soft">You need ' + (bot.price_coins - balance) + ' more coins</div>';
      html += '<button class="btn-primary" id="earnMoreBtn">' + ICONS.play.replace('class="ic"','class="ic" style="width:16px;height:16px;"') + ' Watch Ads to Earn</button>';
    }
    html += '</div>';

    openSheet(html);

    var tutBtn = document.getElementById('tutorialBtn');
    if (tutBtn) tutBtn.onclick = function(){ window.open(bot.tutorial_url, '_blank'); };

    var unlockBtn = document.getElementById('unlockBtn');
    if (unlockBtn) unlockBtn.onclick = function(){ unlockBot(bot.id); };

    var getBtn = document.getElementById('getBotBtn');
    if (getBtn) getBtn.onclick = function(){
      if (tg && tg.openLink) tg.openLink(bot.redirect_link); else window.open(bot.redirect_link, '_blank');
    };

    var earnMoreBtn = document.getElementById('earnMoreBtn');
    if (earnMoreBtn) earnMoreBtn.onclick = function(){ closeSheet(); switchTab('earn'); };
  }

  function unlockBot(botId){
    api('/api/bots/' + botId + '/unlock', { method:'POST' }).then(function(res){
      if (res.error === 'insufficient_coins'){ toast('Need ' + res.need + ' more coins'); return; }
      if (res.error){ toast('Something went wrong'); return; }
      toast('Bot unlocked! 🎉');
      loadUser();
      openBotDetail(botId);
      if (tg && tg.openLink) tg.openLink(res.redirect); else window.open(res.redirect, '_blank');
    });
  }

  // ---------- render: EARN ----------
  function renderEarn(){
    var u = state.user || {};
    var s = state.settings;
    var watched = u.ads_watched_today || 0;
    var remaining = Math.max(0, s.daily_ad_limit - watched);
    var box = document.getElementById('tab-earn');

    var html = '';
    html += '<div class="earn-hero"><div class="dot e1"></div><div class="dot e2"></div>';
    html += '  <div class="play-wrap">' + ICONS.play.replace('class="ic"','class="ic" style="width:28px;height:28px;"') + '</div>';
    html += '  <h2>Watch &amp; Earn</h2>';
    html += '  <p>প্রতিটি বিজ্ঞাপনে +' + s.coins_per_ad + ' কয়েন</p>';
    html += '</div>';

    html += '<div class="earn-stats">';
    html += '  <div class="earn-box"><div class="n">' + watched + '/' + s.daily_ad_limit + '</div><div class="l">TODAY</div></div>';
    html += '  <div class="earn-box"><div class="n">+' + s.coins_per_ad + '</div><div class="l">PER AD</div></div>';
    html += '  <div class="earn-box"><div class="n">' + (u.balance||0) + '</div><div class="l">BALANCE</div></div>';
    html += '</div>';

    html += '<div class="watch-btn-wrap">';
    if (remaining > 0){
      html += '<button class="watch-btn" id="watchAdBtn">' + ICONS.play.replace('class="ic"','class="ic" style="width:20px;height:20px;"') + ' Watch Ad (' + remaining + ' left today)</button>';
    } else {
      html += '<button class="watch-btn" disabled>' + ICONS.check.replace('class="ic"','class="ic" style="width:18px;height:18px;"') + ' Daily limit reached — come back tomorrow</button>';
    }
    html += '</div>';
    html += '<div class="earn-note">প্রতিদিন সর্বোচ্চ ' + s.daily_ad_limit + ' টি বিজ্ঞাপন দেখে কয়েন আয় করা যাবে। রাত ১২টায় (UTC) লিমিট রিসেট হয়।</div>';

    box.innerHTML = html;
    var btn = document.getElementById('watchAdBtn');
    if (btn) btn.onclick = watchAd;
  }

  function watchAd(){
    var btn = document.getElementById('watchAdBtn');
    if (btn){ btn.disabled = true; btn.textContent = 'Loading ad…'; }

    function creditCoins(){
      api('/api/earn/watch-ad', { method:'POST' }).then(function(res){
        if (res.error === 'daily_limit_reached'){ toast('Daily limit reached'); loadUser(); return; }
        if (res.error){ toast('Something went wrong'); loadUser(); return; }
        state.user = res.user;
        toast('+' + res.coins_earned + ' coins!');
        renderHome(); renderEarn(); renderProfile();
      });
    }

    if (typeof show_11533496 === 'function'){
      // Rewarded interstitial — see Monetag docs for full details.
      show_11533496().then(function(){
        creditCoins();
      }).catch(function(){
        toast('Ad failed to load, try again');
        renderEarn();
      });
    } else {
      // Ad SDK not loaded (e.g. testing outside Telegram) — fall back gracefully.
      toast('Ad unavailable, crediting anyway (dev mode)');
      creditCoins();
    }
  }

  // ---------- render: PROFILE ----------
  function renderProfile(){
    var u = state.user || {};
    var box = document.getElementById('tab-profile');
    var referLink = 'https://t.me/' + BOT_USERNAME + '/' + APP_NAME + '?startapp=ref_' + (u.telegram_id||'');
    var html = '';
    html += '<div class="profile-hero">';
    html += '  <img class="avatar" src="' + esc(u.photo_url || 'https://placehold.co/120x120/6C5CE7/ffffff?text=' + esc((u.first_name||'U')[0])) + '">';
    html += '  <div class="name">' + esc(u.first_name||'User') + '</div>';
    html += '  <div class="handle">@' + esc(u.username||'user') + '</div>';
    html += '</div>';

    html += '<div class="balance-strip"><div><div class="l">Total Coins</div><div class="v">' + ICONS.coin.replace('class="ic"','class="ic" style="width:18px;height:18px;"') + (u.balance||0) + '</div></div><div style="text-align:right;"><div class="l">Bots Unlocked</div><div class="v" style="justify-content:flex-end;">' + (u.bots_unlocked||0) + '</div></div></div>';

    html += '<div class="panel"><h3>Refer &amp; Earn</h3>';
    html += '<div class="refer-box">' + ICONS.link.replace('class="ic"','class="ic" style="color:var(--purple);"') + '<input readonly id="referInput" value="' + esc(referLink) + '"></div>';
    html += '<div class="refer-actions"><button class="pill-btn" id="copyRefBtn">' + ICONS.link + 'Copy Link</button><button class="pill-btn alt" id="shareRefBtn">' + ICONS.share + 'Share</button></div>';
    html += '<div style="font-size:11px;color:var(--sub);margin-top:10px;text-align:center;">প্রতি রেফারে আপনি পাবেন +' + state.settings.coins_per_refer + ' কয়েন</div>';
    html += '</div>';

    html += '<div class="panel"><h3>More</h3>';
    html += '<div class="row-link" id="supportRow"><div class="left"><div class="ic-badge">' + ICONS.support + '</div><span>Contact Support</span></div>' + ICONS.chevron.replace('class="ic"','class="ic arrow"') + '</div>';
    html += '<div class="row-link" id="tutorialRow"><div class="left"><div class="ic-badge">' + ICONS.video + '</div><span>Tutorial Video</span></div>' + ICONS.chevron.replace('class="ic"','class="ic arrow"') + '</div>';
    if (state.isAdmin){
      html += '<div class="row-link" id="adminRow"><div class="left"><div class="ic-badge">' + ICONS.gift + '</div><span>Admin Panel</span></div>' + ICONS.chevron.replace('class="ic"','class="ic arrow"') + '</div>';
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
    document.getElementById('tab-earn').style.display = tab==='earn' ? '' : 'none';
    document.getElementById('tab-profile').style.display = tab==='profile' ? '' : 'none';
    document.querySelectorAll('.nav-item').forEach(function(el){
      el.classList.toggle('active', el.getAttribute('data-tab')===tab);
    });
    if (tab === 'earn') renderEarn();
  }
  document.querySelectorAll('.nav-item').forEach(function(el){
    el.onclick = function(){ switchTab(el.getAttribute('data-tab')); };
  });

  // ---------- data loading ----------
  function loadUser(){
    return fetch('/api/auth', {
      method:'POST',
      headers: Object.assign({'Content-Type':'application/json'}, initDataHeader?{'X-Init-Data':initDataHeader}:{}),
      body: JSON.stringify({ initData: initDataHeader, devUser: tgUser, startParam: refFromStart })
    }).then(function(r){ return r.json(); }).then(function(res){
      if (res.user){ state.user = res.user; state.isAdmin = res.isAdmin; state.settings = res.settings || state.settings; }
      renderHome(); renderProfile(); renderEarn();
    });
  }

  function loadBots(){
    return api('/api/bots').then(function(res){
      state.bots = res.bots || [];
      renderStoreGrid();
    });
  }

  renderNav();
  renderHome(); renderStore(); renderEarn(); renderProfile();
  loadUser();
  loadBots();
})();
</script>
</body>
</html>`;
