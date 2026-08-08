export const ADMIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bot Store — Admin</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#EEEBFC;--purple:#6C5CE7;--purple-dark:#5A4BD1;--ink:#221B3F;--sub:#918AAE;--red:#E0555C;--green:#3FBF83;--amber:#FFB74A;}
*{box-sizing:border-box;}
body{margin:0;font-family:'Inter',sans-serif;background:var(--bg);color:var(--ink);}
svg.ic{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;display:block;}
.wrap{max-width:900px;margin:0 auto;padding:24px 18px 60px;}
h1{font-family:'Baloo 2';font-size:22px;margin:0 0 4px;display:flex;align-items:center;gap:8px;}
.sub{color:var(--sub);font-size:13px;margin-bottom:20px;}
.tabs{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;}
.tab-btn{border:none;background:#fff;padding:10px 16px;border-radius:14px;font-weight:700;font-size:13px;color:var(--sub);box-shadow:0 4px 12px rgba(90,70,180,.08);display:flex;align-items:center;gap:7px;}
.tab-btn.active{background:var(--purple);color:#fff;}
.card{background:#fff;border-radius:22px;padding:20px;box-shadow:0 8px 20px rgba(90,70,180,.08);margin-bottom:16px;}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:18px;}
.stat-box{background:#fff;border-radius:18px;padding:18px;text-align:center;box-shadow:0 8px 20px rgba(90,70,180,.08);}
.stat-box .n{font-family:'Baloo 2';font-size:24px;font-weight:800;color:var(--purple-dark);}
.stat-box .l{font-size:11px;color:var(--sub);margin-top:2px;font-weight:600;}
table{width:100%;border-collapse:collapse;font-size:13px;}
th,td{text-align:left;padding:11px 8px;border-bottom:1px solid #F1EEFB;vertical-align:top;}
th{color:var(--sub);font-size:11px;text-transform:uppercase;letter-spacing:.03em;}
img.thumb-sm{width:74px;aspect-ratio:16/9;object-fit:cover;border-radius:10px;background:#eee;}
.btn{border:none;border-radius:11px;padding:8px 13px;font-weight:700;font-size:12px;cursor:pointer;}
.btn-edit{background:#DCEBFF;color:#2B7FE0;}
.btn-del{background:#FFE1E1;color:var(--red);}
.btn-primary{background:var(--purple);color:#fff;padding:12px 20px;border-radius:13px;}
.btn-ghost{background:#F1EEFF;color:var(--purple-dark);padding:12px 20px;border-radius:13px;}
form label{display:block;font-size:12px;font-weight:700;color:var(--sub);margin:14px 0 6px;}
form input,form textarea{width:100%;padding:12px 13px;border-radius:13px;border:1px solid #E7E3F8;background:#FAF9FF;font-size:13px;font-family:inherit;}
form textarea{min-height:70px;resize:vertical;}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.actions-row{display:flex;gap:10px;margin-top:20px;}
.denied{text-align:center;padding:60px 20px;}
.denied h2{font-family:'Baloo 2';}
.badge{display:inline-block;background:#F1EEFF;color:var(--purple-dark);font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:9px;}
.price-badge{display:inline-flex;align-items:center;gap:4px;background:#FFF4E2;color:#B4720C;font-size:11.5px;font-weight:800;padding:3px 9px;border-radius:9px;}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#221B3F;color:#fff;padding:11px 20px;border-radius:14px;font-size:12.5px;z-index:80;opacity:0;pointer-events:none;transition:opacity .25s;}
.toast.show{opacity:1;}
.settings-hint{font-size:11.5px;color:var(--sub);margin-top:4px;line-height:1.5;}
</style>
</head>
<body>
<div class="wrap" id="root"></div>
<div class="toast" id="toast"></div>

<script>
(function(){
  var ICONS = {
    box: '<svg class="ic" viewBox="0 0 24 24"><path d="M3.5 8.5 12 4l8.5 4.5v7L12 20l-8.5-4.5v-7Z"/><path d="M3.5 8.5 12 13l8.5-4.5"/><path d="M12 13v7"/></svg>',
    users: '<svg class="ic" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M2.5 19c1-3 3.3-4.6 6.5-4.6s5.5 1.6 6.5 4.6"/><path d="M15.5 5.2a3 3 0 0 1 0 5.8"/><path d="M17.8 14.6c2.2.4 3.7 1.9 4.5 4.4"/></svg>',
    gear: '<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.14-1.4l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.4-1.4L14 3h-4l-.16 2.2a7 7 0 0 0-2.4 1.4l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .5.05.95.14 1.4l-2 1.5 2 3.4 2.3-.9c.7.6 1.5 1.1 2.4 1.4L10 21h4l.16-2.2c.9-.3 1.7-.8 2.4-1.4l2.3.9 2-3.4-2-1.5c.09-.45.14-.9.14-1.4Z"/></svg>',
    shield: '<svg class="ic" viewBox="0 0 24 24"><path d="M12 3.5 19 6v6c0 4.6-3 7.6-7 8.5-4-.9-7-3.9-7-8.5V6l7-2.5Z"/></svg>'
  };

  var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  if (tg) { tg.ready(); tg.expand(); }
  var qs = new URLSearchParams(location.search);
  var myId = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : Number(qs.get('tid'));
  var initDataHeader = (tg && tg.initData) ? tg.initData : '';

  var state = { isAdmin:false, tab:'bots', bots:[], users:[], stats:{}, settings:{} };

  function api(path, opts){
    opts = opts || {};
    opts.headers = Object.assign({'Content-Type':'application/json','X-Tg-Id':String(myId||'')}, opts.headers||{});
    if (initDataHeader) opts.headers['X-Init-Data'] = initDataHeader;
    var sep = path.indexOf('?')===-1 ? '?' : '&';
    path += sep + 'tid=' + (myId||'');
    return fetch(path, opts).then(function(r){ return r.json(); });
  }

  function esc(s){ return (s==null?'':String(s)).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function toast(msg){ var t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(function(){t.classList.remove('show');},1900); }

  function boot(){
    api('/api/admin/check').then(function(res){
      state.isAdmin = res.isAdmin;
      if (!state.isAdmin){ renderDenied(); return; }
      loadAll();
    });
  }

  function loadAll(){
    Promise.all([
      api('/api/admin/bots'),
      api('/api/admin/users'),
      api('/api/admin/stats'),
      api('/api/admin/settings')
    ]).then(function(r){
      state.bots = r[0].bots || [];
      state.users = r[1].users || [];
      state.stats = r[2] || {};
      state.settings = r[3] || {};
      render();
    });
  }

  function renderDenied(){
    document.getElementById('root').innerHTML =
      '<div class="denied">' + ICONS.shield + '<h2>Access denied</h2><p class="sub">Your Telegram ID (' + esc(myId||'unknown') + ') is not the configured admin. Open this page inside the bot as the admin account, or update ADMIN_ID in wrangler.toml.</p></div>';
  }

  function render(){
    var root = document.getElementById('root');
    var html = '';
    html += '<h1>' + ICONS.gear + ' Bot Store Admin</h1><div class="sub">Signed in as admin &middot; ID ' + esc(myId) + '</div>';

    html += '<div class="stat-grid">';
    html += '  <div class="stat-box"><div class="n">' + (state.stats.users||0) + '</div><div class="l">Total Users</div></div>';
    html += '  <div class="stat-box"><div class="n">' + (state.stats.bots||0) + '</div><div class="l">Total Bots</div></div>';
    html += '  <div class="stat-box"><div class="n">' + (state.stats.unlocks||0) + '</div><div class="l">Total Unlocks</div></div>';
    html += '  <div class="stat-box"><div class="n">' + (state.stats.coinsInCirculation||0) + '</div><div class="l">Coins in Circulation</div></div>';
    html += '</div>';

    html += '<div class="tabs">';
    html += '  <button class="tab-btn ' + (state.tab==='bots'?'active':'') + '" data-tab="bots">' + ICONS.box + ' Bots</button>';
    html += '  <button class="tab-btn ' + (state.tab==='users'?'active':'') + '" data-tab="users">' + ICONS.users + ' Users</button>';
    html += '  <button class="tab-btn ' + (state.tab==='settings'?'active':'') + '" data-tab="settings">' + ICONS.gear + ' Settings</button>';
    html += '</div>';

    html += '<div id="tabContent"></div>';
    root.innerHTML = html;

    root.querySelectorAll('.tab-btn').forEach(function(btn){
      btn.onclick = function(){ state.tab = btn.getAttribute('data-tab'); render(); };
    });

    if (state.tab === 'bots') renderBotsTab();
    else if (state.tab === 'users') renderUsersTab();
    else renderSettingsTab();
  }

  function renderBotsTab(){
    var el = document.getElementById('tabContent');
    var html = '<div class="card">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
    html += '<b>Store Items</b><button class="btn btn-primary" id="addBotBtn">+ Add Bot</button></div>';
    html += '<table><thead><tr><th>Thumb</th><th>Title</th><th>Price</th><th>Status</th><th></th></tr></thead><tbody>';
    state.bots.forEach(function(b){
      html += '<tr>';
      html += '<td><img class="thumb-sm" src="' + esc(b.thumbnail_url||'') + '"></td>';
      html += '<td><b>' + esc(b.title) + '</b><br><span class="badge">' + esc(b.category||'New') + '</span></td>';
      html += '<td><span class="price-badge">🪙 ' + b.price_coins + '</span></td>';
      html += '<td>' + (b.is_active ? '🟢 Active' : '⚪ Hidden') + '</td>';
      html += '<td><button class="btn btn-edit" data-edit="' + b.id + '">Edit</button> <button class="btn btn-del" data-del="' + b.id + '">Delete</button></td>';
      html += '</tr>';
    });
    if (!state.bots.length) html += '<tr><td colspan="5" style="text-align:center;color:var(--sub);padding:20px;">No bots yet — add your first one.</td></tr>';
    html += '</tbody></table></div>';
    el.innerHTML = html;

    document.getElementById('addBotBtn').onclick = function(){ openBotForm(null); };
    el.querySelectorAll('[data-edit]').forEach(function(b){
      b.onclick = function(){ openBotForm(state.bots.find(function(x){return x.id===Number(b.getAttribute('data-edit'));})); };
    });
    el.querySelectorAll('[data-del]').forEach(function(b){
      b.onclick = function(){
        if (!confirm('Delete this bot listing?')) return;
        api('/api/admin/bots/' + b.getAttribute('data-del'), { method:'DELETE' }).then(function(){ toast('Deleted'); loadAll(); });
      };
    });
  }

  function openBotForm(bot){
    var el = document.getElementById('tabContent');
    var b = bot || { title:'', description:'', thumbnail_url:'', tutorial_url:'', redirect_link:'', price_coins:100, category:'New', is_active:1 };
    var html = '<div class="card">';
    html += '<b>' + (bot ? 'Edit Bot' : 'Add New Bot') + '</b>';
    html += '<form id="botForm">';
    html += '<label>Title</label><input name="title" value="' + esc(b.title) + '" required>';
    html += '<label>Description</label><textarea name="description">' + esc(b.description) + '</textarea>';
    html += '<label>Thumbnail Image URL (16:9)</label><input name="thumbnail_url" value="' + esc(b.thumbnail_url) + '" placeholder="https://...">';
    html += '<label>Tutorial Video Link (optional)</label><input name="tutorial_url" value="' + esc(b.tutorial_url) + '" placeholder="https://t.me/...">';
    html += '<label>Redirect Link (after unlock, e.g. bot deep link / file link)</label><input name="redirect_link" value="' + esc(b.redirect_link) + '" required placeholder="https://t.me/YourBot">';
    html += '<div class="row2"><div><label>Price (coins to unlock)</label><input name="price_coins" type="number" min="0" value="' + b.price_coins + '"></div>';
    html += '<div><label>Category</label><input name="category" value="' + esc(b.category) + '"></div></div>';
    html += '<label style="display:flex;align-items:center;gap:8px;"><input name="is_active_cb" type="checkbox" ' + (b.is_active ? 'checked' : '') + ' style="width:auto;">Visible in Store</label>';
    html += '<div class="actions-row"><button type="submit" class="btn-primary" style="border:none;flex:1;">Save</button><button type="button" class="btn-ghost" id="cancelFormBtn" style="border:none;">Cancel</button></div>';
    html += '</form></div>';
    el.innerHTML = html;

    document.getElementById('cancelFormBtn').onclick = renderBotsTab;
    document.getElementById('botForm').onsubmit = function(e){
      e.preventDefault();
      var f = e.target;
      var payload = {
        title: f.title.value.trim(),
        description: f.description.value.trim(),
        thumbnail_url: f.thumbnail_url.value.trim(),
        tutorial_url: f.tutorial_url.value.trim(),
        redirect_link: f.redirect_link.value.trim(),
        price_coins: Number(f.price_coins.value) || 0,
        category: f.category.value.trim() || 'New',
        is_active: f.is_active_cb.checked
      };
      var req = bot ? api('/api/admin/bots/' + bot.id, { method:'PUT', body: JSON.stringify(payload) })
                    : api('/api/admin/bots', { method:'POST', body: JSON.stringify(payload) });
      req.then(function(){ toast('Saved'); loadAll(); });
    };
  }

  function renderUsersTab(){
    var el = document.getElementById('tabContent');
    var html = '<div class="card"><b>Users</b> <span class="sub">(' + state.users.length + ')</span>';
    html += '<table><thead><tr><th>User</th><th>Coins</th><th>Refers</th><th>Bots</th><th>Today Ads</th><th>Joined</th><th></th></tr></thead><tbody>';
    state.users.forEach(function(u){
      html += '<tr>';
      html += '<td><b>' + esc(u.first_name) + '</b><br><span class="sub">@' + esc(u.username||'-') + ' &middot; ' + u.telegram_id + '</span></td>';
      html += '<td>' + u.balance + '</td>';
      html += '<td>' + u.referral_count + '</td>';
      html += '<td>' + u.bots_unlocked + '</td>';
      html += '<td>' + (u.ads_watched_today||0) + '</td>';
      html += '<td>' + esc((u.created_at||'').slice(0,10)) + '</td>';
      html += '<td><button class="btn ' + (u.is_banned?'btn-primary':'btn-del') + '" data-ban="' + u.id + '" data-state="' + (u.is_banned?0:1) + '">' + (u.is_banned?'Unban':'Ban') + '</button></td>';
      html += '</tr>';
    });
    if (!state.users.length) html += '<tr><td colspan="7" style="text-align:center;color:var(--sub);padding:20px;">No users yet.</td></tr>';
    html += '</tbody></table></div>';
    el.innerHTML = html;

    el.querySelectorAll('[data-ban]').forEach(function(b){
      b.onclick = function(){
        api('/api/admin/users/' + b.getAttribute('data-ban') + '/ban', { method:'POST', body: JSON.stringify({ banned: b.getAttribute('data-state')==='1' }) })
          .then(function(){ toast('Updated'); loadAll(); });
      };
    });
  }

  function renderSettingsTab(){
    var el = document.getElementById('tabContent');
    var s = state.settings;
    var html = '<div class="card">';
    html += '<b>Coin Economy Settings</b>';
    html += '<p class="settings-hint">These apply instantly across the app — no redeploy needed.</p>';
    html += '<form id="settingsForm">';
    html += '<div class="row3">';
    html += '<div><label>Coins per Ad</label><input name="coins_per_ad" type="number" min="0" value="' + s.coins_per_ad + '"></div>';
    html += '<div><label>Daily Ad Limit</label><input name="daily_ad_limit" type="number" min="0" value="' + s.daily_ad_limit + '"></div>';
    html += '<div><label>Coins per Refer</label><input name="coins_per_refer" type="number" min="0" value="' + s.coins_per_refer + '"></div>';
    html += '</div>';
    html += '<div class="actions-row"><button type="submit" class="btn-primary" style="border:none;">Save Settings</button></div>';
    html += '</form></div>';
    el.innerHTML = html;

    document.getElementById('settingsForm').onsubmit = function(e){
      e.preventDefault();
      var f = e.target;
      var payload = {
        coins_per_ad: Number(f.coins_per_ad.value) || 0,
        daily_ad_limit: Number(f.daily_ad_limit.value) || 0,
        coins_per_refer: Number(f.coins_per_refer.value) || 0
      };
      api('/api/admin/settings', { method:'PUT', body: JSON.stringify(payload) }).then(function(res){
        state.settings = res;
        toast('Settings saved');
      });
    };
  }

  boot();
})();
</script>
</body>
</html>`;
