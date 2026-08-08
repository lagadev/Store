export const ADMIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bot Store — Admin</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#EDEAFB;--purple:#7B68EE;--purple-dark:#6552D9;--ink:#241E42;--sub:#8B85A7;--red:#E85D5D;--green:#3FB27F;}
*{box-sizing:border-box;}
body{margin:0;font-family:'Inter',sans-serif;background:var(--bg);color:var(--ink);}
.wrap{max-width:880px;margin:0 auto;padding:22px 18px 60px;}
h1{font-family:'Baloo 2';font-size:22px;margin:0 0 4px;}
.sub{color:var(--sub);font-size:13px;margin-bottom:20px;}
.tabs{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;}
.tab-btn{border:none;background:#fff;padding:10px 16px;border-radius:14px;font-weight:700;font-size:13px;color:var(--sub);box-shadow:0 4px 12px rgba(90,70,180,.08);}
.tab-btn.active{background:var(--purple);color:#fff;}
.card{background:#fff;border-radius:20px;padding:18px;box-shadow:0 6px 18px rgba(90,70,180,.08);margin-bottom:16px;}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:18px;}
.stat-box{background:#fff;border-radius:16px;padding:16px;text-align:center;box-shadow:0 6px 18px rgba(90,70,180,.08);}
.stat-box .n{font-family:'Baloo 2';font-size:24px;font-weight:800;color:var(--purple-dark);}
.stat-box .l{font-size:11.5px;color:var(--sub);margin-top:2px;}
table{width:100%;border-collapse:collapse;font-size:13px;}
th,td{text-align:left;padding:10px 8px;border-bottom:1px solid #F0EEFA;vertical-align:top;}
th{color:var(--sub);font-size:11.5px;text-transform:uppercase;letter-spacing:.03em;}
img.thumb-sm{width:70px;aspect-ratio:16/9;object-fit:cover;border-radius:8px;background:#eee;}
.btn{border:none;border-radius:10px;padding:7px 12px;font-weight:700;font-size:12px;cursor:pointer;}
.btn-edit{background:#DCEBFF;color:#2B7FE0;}
.btn-del{background:#FFE1E1;color:var(--red);}
.btn-primary{background:var(--purple);color:#fff;padding:11px 18px;border-radius:12px;}
.btn-ghost{background:#F1EEFF;color:var(--purple-dark);padding:11px 18px;border-radius:12px;}
form label{display:block;font-size:12px;font-weight:700;color:var(--sub);margin:12px 0 6px;}
form input,form textarea{width:100%;padding:11px 12px;border-radius:12px;border:1px solid #E5E1F7;background:#F9F8FF;font-size:13px;font-family:inherit;}
form textarea{min-height:70px;resize:vertical;}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.actions-row{display:flex;gap:10px;margin-top:18px;}
.denied{text-align:center;padding:60px 20px;}
.denied h2{font-family:'Baloo 2';}
.hidden{display:none;}
.badge{display:inline-block;background:#F1EEFF;color:var(--purple-dark);font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:8px;}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#241E42;color:#fff;padding:10px 18px;border-radius:14px;font-size:12.5px;z-index:80;opacity:0;pointer-events:none;transition:opacity .25s;}
.toast.show{opacity:1;}
</style>
</head>
<body>
<div class="wrap" id="root"></div>
<div class="toast" id="toast"></div>

<script>
(function(){
  var tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  if (tg) { tg.ready(); tg.expand(); }
  var qs = new URLSearchParams(location.search);
  var myId = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : Number(qs.get('tid'));
  var initDataHeader = (tg && tg.initData) ? tg.initData : '';

  var state = { isAdmin:false, tab:'bots', bots:[], users:[], stats:{}, editing:null };

  function api(path, opts){
    opts = opts || {};
    opts.headers = Object.assign({'Content-Type':'application/json','X-Tg-Id':String(myId||'')}, opts.headers||{});
    if (initDataHeader) opts.headers['X-Init-Data'] = initDataHeader;
    var sep = path.indexOf('?')===-1 ? '?' : '&';
    path += sep + 'tid=' + (myId||'');
    return fetch(path, opts).then(function(r){ return r.json(); });
  }

  function esc(s){ return (s==null?'':String(s)).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function toast(msg){ var t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(function(){t.classList.remove('show');},1800); }

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
      api('/api/admin/stats')
    ]).then(function(r){
      state.bots = r[0].bots || [];
      state.users = r[1].users || [];
      state.stats = r[2] || {};
      render();
    });
  }

  function renderDenied(){
    document.getElementById('root').innerHTML =
      '<div class="denied"><h2>🔒 Access denied</h2><p class="sub">Your Telegram ID (' + esc(myId||'unknown') + ') is not the configured admin. Open this page inside the bot as the admin account, or update ADMIN_ID in wrangler.toml.</p></div>';
  }

  function render(){
    var root = document.getElementById('root');
    var html = '';
    html += '<h1>🛠️ Bot Store Admin</h1><div class="sub">Signed in as admin · ID ' + esc(myId) + '</div>';

    html += '<div class="stat-grid">';
    html += '  <div class="stat-box"><div class="n">' + (state.stats.users||0) + '</div><div class="l">Total Users</div></div>';
    html += '  <div class="stat-box"><div class="n">' + (state.stats.bots||0) + '</div><div class="l">Total Bots</div></div>';
    html += '  <div class="stat-box"><div class="n">' + (state.stats.unlocks||0) + '</div><div class="l">Total Unlocks</div></div>';
    html += '</div>';

    html += '<div class="tabs">';
    html += '  <button class="tab-btn ' + (state.tab==='bots'?'active':'') + '" data-tab="bots">📦 Bots</button>';
    html += '  <button class="tab-btn ' + (state.tab==='users'?'active':'') + '" data-tab="users">👥 Users</button>';
    html += '</div>';

    html += '<div id="tabContent"></div>';
    root.innerHTML = html;

    root.querySelectorAll('.tab-btn').forEach(function(btn){
      btn.onclick = function(){ state.tab = btn.getAttribute('data-tab'); render(); };
    });

    if (state.tab === 'bots') renderBotsTab(); else renderUsersTab();
  }

  function renderBotsTab(){
    var el = document.getElementById('tabContent');
    var html = '<div class="card">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
    html += '<b>Store Items</b><button class="btn btn-primary" id="addBotBtn">+ Add Bot</button></div>';
    html += '<table><thead><tr><th>Thumb</th><th>Title</th><th>Ads</th><th>Reward</th><th>Status</th><th></th></tr></thead><tbody>';
    state.bots.forEach(function(b){
      html += '<tr>';
      html += '<td><img class="thumb-sm" src="' + esc(b.thumbnail_url||'') + '"></td>';
      html += '<td><b>' + esc(b.title) + '</b><br><span class="badge">' + esc(b.category||'New') + '</span></td>';
      html += '<td>' + b.ads_required + '</td>';
      html += '<td>' + b.reward_coins + ' coins</td>';
      html += '<td>' + (b.is_active ? '🟢 Active' : '⚪ Hidden') + '</td>';
      html += '<td><button class="btn btn-edit" data-edit="' + b.id + '">Edit</button> <button class="btn btn-del" data-del="' + b.id + '">Delete</button></td>';
      html += '</tr>';
    });
    if (!state.bots.length) html += '<tr><td colspan="6" style="text-align:center;color:var(--sub);padding:20px;">No bots yet — add your first one.</td></tr>';
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
    var b = bot || { title:'', description:'', thumbnail_url:'', tutorial_url:'', redirect_link:'', ads_required:9, reward_coins:0, category:'New', is_active:1 };
    var html = '<div class="card">';
    html += '<b>' + (bot ? 'Edit Bot' : 'Add New Bot') + '</b>';
    html += '<form id="botForm">';
    html += '<label>Title</label><input name="title" value="' + esc(b.title) + '" required>';
    html += '<label>Description</label><textarea name="description">' + esc(b.description) + '</textarea>';
    html += '<label>Thumbnail Image URL (16:9)</label><input name="thumbnail_url" value="' + esc(b.thumbnail_url) + '" placeholder="https://...">';
    html += '<label>Tutorial Video Link (optional)</label><input name="tutorial_url" value="' + esc(b.tutorial_url) + '" placeholder="https://t.me/...">';
    html += '<label>Redirect Link (after unlock, e.g. bot deep link / file link)</label><input name="redirect_link" value="' + esc(b.redirect_link) + '" required placeholder="https://t.me/YourBot">';
    html += '<div class="row2"><div><label>Ads Required to Unlock</label><input name="ads_required" type="number" min="1" value="' + b.ads_required + '"></div>';
    html += '<div><label>Reward Coins</label><input name="reward_coins" type="number" min="0" value="' + b.reward_coins + '"></div></div>';
    html += '<div class="row2"><div><label>Category</label><input name="category" value="' + esc(b.category) + '"></div>';
    html += '<div><label>Visible in Store?</label><input name="is_active_cb" type="checkbox" ' + (b.is_active ? 'checked' : '') + ' style="width:auto;margin-top:14px;"></div></div>';
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
        ads_required: Number(f.ads_required.value) || 1,
        reward_coins: Number(f.reward_coins.value) || 0,
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
    html += '<table><thead><tr><th>User</th><th>Coins</th><th>Refers</th><th>Bots</th><th>Joined</th><th></th></tr></thead><tbody>';
    state.users.forEach(function(u){
      html += '<tr>';
      html += '<td><b>' + esc(u.first_name) + '</b><br><span class="sub">@' + esc(u.username||'-') + ' · ' + u.telegram_id + '</span></td>';
      html += '<td>' + u.balance + '</td>';
      html += '<td>' + u.referral_count + '</td>';
      html += '<td>' + u.bots_unlocked + '</td>';
      html += '<td>' + esc((u.created_at||'').slice(0,10)) + '</td>';
      html += '<td><button class="btn ' + (u.is_banned?'btn-primary':'btn-del') + '" data-ban="' + u.id + '" data-state="' + (u.is_banned?0:1) + '">' + (u.is_banned?'Unban':'Ban') + '</button></td>';
      html += '</tr>';
    });
    if (!state.users.length) html += '<tr><td colspan="6" style="text-align:center;color:var(--sub);padding:20px;">No users yet.</td></tr>';
    html += '</tbody></table></div>';
    el.innerHTML = html;

    el.querySelectorAll('[data-ban]').forEach(function(b){
      b.onclick = function(){
        api('/api/admin/users/' + b.getAttribute('data-ban') + '/ban', { method:'POST', body: JSON.stringify({ banned: b.getAttribute('data-state')==='1' }) })
          .then(function(){ toast('Updated'); loadAll(); });
      };
    });
  }

  boot();
})();
</script>
</body>
</html>`;
