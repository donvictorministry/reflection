/* =====================================================================
   REFLECT & ALIGN — DV Biblefirm
   Rev. Dr. Chris Johnson, PhD
   (c) DV Biblefirm. All rights reserved. Proprietary Software.
   ===================================================================== */

/* ===== LOCATION / ROUTING MODE ===== */
var dvScriptSrc = (document.currentScript && document.currentScript.src) || window.location.href;
var dvBase = new URL('./', dvScriptSrc).pathname;
var dvMode = ((window.location.protocol === 'http:' || window.location.protocol === 'https:') && window.history && window.history.pushState) ? 'path' : 'hash';
var dvDefaultTitle = document.title;
var dvDefaultDescription = (document.querySelector('meta[name="description"]') || { getAttribute: function() { return ''; } }).getAttribute('content');

/* ===== DV STATE ===== */
var dvState = {
  darkMode: false,
  theme: 'blue',
  deferredInstall: null
};

/* ===== REGISTRIES (filled by optional module files) ===== */
var dvLeftNavItems = [];
var dvQuickActions = [];
var dvRightModuleItems = [];
var dvRoutes = {};
var dvCurrentRoute = null;
var dvMatchers = [];
var dvPages = { home: 'dvPageHome' };

function dvAddLeftItem(item) {
  if (!item || !item.label) return;
  item.order = (typeof item.order === 'number') ? item.order : 100;
  item.seq = dvLeftNavItems.length;
  dvLeftNavItems.push(item);
}
function dvAddRightItem(item) {
  if (!item || !item.label || !(item.route || typeof item.onClick === 'function')) return;
  item.order = (typeof item.order === 'number') ? item.order : 100;
  item.seq = dvRightModuleItems.length;
  dvRightModuleItems.push(item);
}
function dvAddQuickAction(item) {
  if (!item || !item.label || !item.route) return;
  item.order = (typeof item.order === 'number') ? item.order : 100;
  item.seq = dvQuickActions.length;
  dvQuickActions.push(item);
}
function dvAddNavItem(item) {
  var nav = document.getElementById('dvBottomNav');
  if (!nav || !item || !item.key) return;
  var btn = document.createElement('button');
  btn.className = 'dv-nav-item';
  if (item.id) btn.id = item.id;
  btn.setAttribute('data-dv-page', item.key);
  btn.innerHTML = item.html || '';
  nav.appendChild(btn);
}
function dvAddRouteMatcher(fn) {
  if (typeof fn === 'function') dvMatchers.push(fn);
}
function dvAddPage(key, id, def) {
  def = def || {};
  var userOpen = def.open;
  dvPages[key] = id;
  def.open = function() { dvShowPage(key); if (typeof userOpen === 'function') userOpen(); };
  dvRegisterRoute(key, def);
}
function dvRegisterRoute(slug, def) {
  dvRoutes[dvNormalize(slug)] = def || {};
}
function dvUrl(slug) {
  slug = dvNormalize(slug);
  if (dvMode === 'path') return window.location.origin + dvBase + slug;
  return window.location.origin + window.location.pathname + '#/' + slug;
}

/* ===== TOAST ===== */
var dvToastTimer = null;
function dvShowToast(msg) {
  var el = document.getElementById('dvToast');
  el.textContent = msg;
  el.classList.add('dv-toast-show');
  clearTimeout(dvToastTimer);
  dvToastTimer = setTimeout(function() {
    el.classList.remove('dv-toast-show');
  }, 2200);
}

/* ===== LEFT SIDEBAR (items come from information.js) ===== */
function dvBuildLeftNav() {
  var nav = document.getElementById('dvLeftNav');
  var items = dvLeftNavItems.slice().sort(function(a, b) { return (a.order - b.order) || (a.seq - b.seq); });
  var html = '';
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    html += '<button class="dv-sidebar-item" data-dv-key="' + (item.key || '') + '">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + (item.icon || '') + '</svg>' +
      '<span class="dv-sidebar-item-label">' + item.label + '</span></button>';
  }
  nav.innerHTML = html;
  nav.querySelectorAll('.dv-sidebar-item').forEach(function(btn, idx) {
    var item = items[idx];
    btn.addEventListener('click', function() {
      dvCloseAllSidebars();
      if (item.route) { dvNavigate(item.route); return; }
      if (typeof item.onClick === 'function') item.onClick();
    });
  });
  if (!items.length) document.getElementById('dvHamburgerBtn').style.visibility = 'hidden';
}

/* ===== SIDEBAR CONTROLS ===== */
function dvOpenLeft() {
  document.getElementById('dvLeftSidebar').classList.add('dv-open');
  document.getElementById('dvOverlay').classList.add('dv-active');
}
function dvOpenRight() {
  document.getElementById('dvRightSidebar').classList.add('dv-open');
  document.getElementById('dvOverlay').classList.add('dv-active');
}
function dvCloseAllSidebars() {
  document.getElementById('dvLeftSidebar').classList.remove('dv-open');
  document.getElementById('dvRightSidebar').classList.remove('dv-open');
  document.getElementById('dvOverlay').classList.remove('dv-active');
}

document.getElementById('dvHamburgerBtn').addEventListener('click', dvOpenLeft);
document.getElementById('dvDotsBtn').addEventListener('click', dvOpenRight);
document.getElementById('dvCloseLeft').addEventListener('click', dvCloseAllSidebars);
document.getElementById('dvOverlay').addEventListener('click', dvCloseAllSidebars);

/* ===== MODAL ===== */
function dvOpenModal(title, html, onOpen) {
  var modal = document.getElementById('dvInfoModal');
  document.getElementById('dvModalTitle').textContent = title;
  document.getElementById('dvModalBody').innerHTML = html;
  if (typeof onOpen === 'function') onOpen();
  modal.classList.add('dv-active');
}
function dvCloseModal() {
  document.getElementById('dvInfoModal').classList.remove('dv-active');
}
document.getElementById('dvCloseModal').addEventListener('click', function() {
  dvCloseRoute();
});

/* ===== RIGHT SIDEBAR: THEMES, DARK MODE, TO-DO, INSTALL, SHARE APP ===== */
var dvThemes = [
  { name:'blue',   hex:'#1877F2' },
  { name:'purple', hex:'#7C3AED' },
  { name:'green',  hex:'#16A34A' },
  { name:'red',    hex:'#DC2626' },
  { name:'orange', hex:'#EA580C' },
  { name:'teal',   hex:'#0D9488' },
  { name:'pink',   hex:'#DB2777' },
  { name:'indigo', hex:'#4F46E5' },
  { name:'amber',  hex:'#D97706' },
  { name:'slate',  hex:'#475569' }
];

var dvRightNavItems = [
  { key:'todo', label:'To-Do List', icon:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' },
  { key:'install', label:'Install App', icon:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>' },
  { key:'share_app', label:'Share App', icon:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' },
  { key:'close_right', label:'Exit Sidebar', icon:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' }
];

function dvSetTheme(name) {
  dvState.theme = name;
  document.documentElement.setAttribute('data-dv-theme', name);
  try { localStorage.setItem('dv-theme', name); } catch (e) {}
  document.querySelectorAll('.dv-color-dot').forEach(function(d) {
    d.classList.toggle('dv-active-dot', d.getAttribute('data-dv-theme') === name);
  });
  var found = dvThemes.filter(function(t) { return t.name === name; });
  if (found.length) {
    document.getElementById('dvMetaTheme').setAttribute('content', found[0].hex);
  }
}

function dvSetDark(on) {
  dvState.darkMode = on;
  if (on) document.documentElement.setAttribute('data-dv-dark', '1');
  else document.documentElement.removeAttribute('data-dv-dark');
  try { localStorage.setItem('dv-dark', on ? '1' : '0'); } catch (e) {}
  var toggle = document.getElementById('dvDarkToggle');
  if (toggle) toggle.classList.toggle('dv-on', on);
}

function dvBuildRightNav() {
  var box = document.getElementById('dvRightSidebar');
  box.innerHTML =
    '<div class="dv-color-row" id="dvColorRow"></div>' +
    '<div class="dv-toggle-row">' +
      '<span class="dv-toggle-label">Dark Mode</span>' +
      '<button class="dv-toggle-switch" id="dvDarkToggle" aria-label="Toggle dark mode">' +
        '<span class="dv-toggle-thumb"></span>' +
      '</button>' +
    '</div>' +
    '<div id="dvRightNav"></div>';

  var colorRow = document.getElementById('dvColorRow');
  var colorHtml = '';
  for (var i = 0; i < dvThemes.length; i++) {
    var t = dvThemes[i];
    colorHtml += '<button class="dv-color-dot' + (dvState.theme === t.name ? ' dv-active-dot' : '') +
      '" style="background:' + t.hex + ';" data-dv-theme="' + t.name + '" aria-label="' + t.name + ' theme"></button>';
  }
  colorRow.innerHTML = colorHtml;
  colorRow.querySelectorAll('.dv-color-dot').forEach(function(dot) {
    dot.addEventListener('click', function() {
      dvSetTheme(dot.getAttribute('data-dv-theme'));
      dvCloseAllSidebars();
    });
  });

  var darkToggle = document.getElementById('dvDarkToggle');
  darkToggle.classList.toggle('dv-on', dvState.darkMode);
  darkToggle.addEventListener('click', function() { dvSetDark(!dvState.darkMode); });

  var nav = document.getElementById('dvRightNav');
  var html = '';
  var modItems = dvRightModuleItems.slice().sort(function(a, b) { return (a.order - b.order) || (a.seq - b.seq); });
  var allItems = dvRightNavItems.slice(0, -1).concat(modItems).concat(dvRightNavItems.slice(-1));
  for (var j = 0; j < allItems.length; j++) {
    var item = allItems[j];
    html += '<button class="dv-right-item" data-dv-rkey="' + (item.key || '') + '">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + item.icon + '</svg>' +
      item.label + '</button>';
  }
  nav.innerHTML = html;
  nav.querySelectorAll('.dv-right-item').forEach(function(btn, idx) {
    btn.addEventListener('click', function() {
      var key = btn.getAttribute('data-dv-rkey');
      var mod = allItems[idx];
      dvCloseAllSidebars();
      if (mod.route) { dvNavigate(mod.route); return; }
      if (typeof mod.onClick === 'function' && !mod.key) { mod.onClick(); return; }
      if (key === 'close_right') return;
      if (key === 'install') { dvHandleInstall(); return; }
      if (key === 'share_app') { dvShareApp(); return; }
      if (key === 'todo') { dvNavigate('to-do'); return; }
    });
  });
}

/* ===== INSTALL ===== */
function dvHandleInstall() {
  if (dvState.deferredInstall) {
    dvState.deferredInstall.prompt();
    dvState.deferredInstall.userChoice.then(function(r) {
      if (r.outcome === 'accepted') dvShowToast('App installed successfully!');
      dvState.deferredInstall = null;
    });
  } else {
    dvShowToast('Use browser menu to install this app');
  }
}
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  dvState.deferredInstall = e;
});

/* ===== SHARE APP ===== */
function dvShareApp() {
  if (navigator.share) {
    navigator.share({ title:'Reflect & Align', text:'Reflect on your life purpose. Align with divine direction.', url: window.location.href }).catch(function(){});
  } else {
    dvShowToast('Sharing is not supported on this device');
  }
}

/* ===== TO-DO ===== */
var dvTodos = [];
function dvLoadTodos() {
  try { dvTodos = JSON.parse(localStorage.getItem('dv-todos') || '[]'); } catch(e) { dvTodos = []; }
}
function dvSaveTodos() {
  try { localStorage.setItem('dv-todos', JSON.stringify(dvTodos)); } catch(e) {}
}
function dvBuildTodoHTML() {
  var html = '<div style="margin-bottom:14px;">' +
    '<div style="display:flex;gap:8px;width:100%;box-sizing:border-box;">' +
    '<input type="text" id="dvTodoInput" style="flex:1;min-width:0;padding:12px;border:2px solid var(--dv-border);border-radius:10px;background:var(--dv-bg);color:var(--dv-text);font-size:1rem;font-family:inherit;box-sizing:border-box;" placeholder="Add a task...">' +
    '<button id="dvTodoAdd" style="flex-shrink:0;padding:12px 18px;background:var(--dv-primary);color:#fff;border:none;border-radius:10px;font-size:1rem;font-family:inherit;cursor:pointer;font-weight:700;">Add</button>' +
    '</div></div>' +
    '<div id="dvTodoList"></div>';
  return html;
}
function dvRenderTodos() {
  var list = document.getElementById('dvTodoList');
  if (!list) return;
  if (!dvTodos.length) {
    list.innerHTML = '<div class="dv-empty"><div class="dv-empty-text">No tasks yet. Add one above.</div></div>';
    return;
  }
  var html = '';
  for (var i = 0; i < dvTodos.length; i++) {
    var t = dvTodos[i];
    html += '<div style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--dv-surface);border-radius:10px;margin-bottom:8px;border:1px solid var(--dv-border);">' +
      '<input type="checkbox" ' + (t.done ? 'checked' : '') + ' data-dv-ti="' + i + '" style="width:22px;height:22px;accent-color:var(--dv-primary);cursor:pointer;">' +
      '<span style="flex:1;font-size:1rem;' + (t.done ? 'text-decoration:line-through;color:var(--dv-text-sub);' : '') + '">' + t.text + '</span>' +
      '<button data-dv-tdel="' + i + '" style="background:transparent;border:none;color:#DC2626;cursor:pointer;padding:4px;font-size:1.1rem;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>' +
      '</div>';
  }
  list.innerHTML = html;
}
function dvBindTodoEvents() {
  dvLoadTodos();
  dvRenderTodos();
  var addBtn = document.getElementById('dvTodoAdd');
  var input = document.getElementById('dvTodoInput');
  if (addBtn) addBtn.addEventListener('click', function() {
    var val = input.value.trim();
    if (!val) return;
    dvTodos.push({ text: val, done: false });
    dvSaveTodos();
    input.value = '';
    dvRenderTodos();
    dvBindTodoCheckboxes();
  });
  if (input) input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') addBtn.click();
  });
  dvBindTodoCheckboxes();
}
function dvBindTodoCheckboxes() {
  var list = document.getElementById('dvTodoList');
  if (!list) return;
  list.querySelectorAll('input[data-dv-ti]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      var idx = parseInt(cb.getAttribute('data-dv-ti'));
      dvTodos[idx].done = cb.checked;
      dvSaveTodos();
      dvRenderTodos();
      dvBindTodoCheckboxes();
    });
  });
  list.querySelectorAll('button[data-dv-tdel]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var idx = parseInt(btn.getAttribute('data-dv-tdel'));
      dvTodos.splice(idx, 1);
      dvSaveTodos();
      dvRenderTodos();
      dvBindTodoCheckboxes();
    });
  });
}

/* ===== HOME: QUICK ACTIONS (each module adds its own) ===== */
function dvBuildQuickActions() {
  var box = document.getElementById('dvQuickActions');
  var items = dvQuickActions.slice().sort(function(a, b) { return (a.order - b.order) || (a.seq - b.seq); });
  if (!items.length) { box.style.display = 'none'; document.getElementById('dvQuickTitle').style.display = 'none'; return; }
  var html = '';
  for (var i = 0; i < items.length; i++) {
    html += '<button class="dv-qa-btn" data-dv-qa="' + i + '">' +
      '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (items[i].icon || '') + '</svg>' +
      '<span>' + items[i].label + '</span></button>';
  }
  box.innerHTML = html;
  box.querySelectorAll('button').forEach(function(btn) {
    btn.addEventListener('click', function() {
      dvNavigate(items[parseInt(btn.getAttribute('data-dv-qa'))].route);
    });
  });
}

/* ===== HOME: DAILY STREAK + INVITE ===== */
function dvStreakInit() {
  var today = new Date().toDateString(), n = 1, last = '';
  try { var s = JSON.parse(localStorage.getItem('dvStreak') || 'null'); if (s) { last = s.last; n = s.n; } } catch (e) {}
  if (last !== today) {
    var y = new Date(Date.now() - 86400000).toDateString();
    n = (last === y) ? n + 1 : 1;
    try { localStorage.setItem('dvStreak', JSON.stringify({ last: today, n: n })); } catch (e) {}
  }
  var el = document.getElementById('dvStreak');
  if (el) el.innerHTML = '<div class="dv-streak-n">\uD83D\uDD25 ' + n + ' Day Streak</div><div class="dv-streak-s">Open the app every day to keep it growing.</div>';
}
function dvInvite() {
  var text = 'Join me on Reflect & Align \u2014 reflect on your life purpose and align with divine direction. ' + dvUrl('');
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

/* ===== ROUTER (clean paths; hash fallback) ===== */
function dvNormalize(slug) {
  slug = (slug || '').replace(/^\/+|\/+$/g, '');
  if (slug === 'home' || slug === 'index' || slug === 'index.html') return '';
  return slug;
}
function dvCurrentSlug() {
  if (dvMode === 'path') {
    var p = window.location.pathname;
    if (p.indexOf(dvBase) === 0) p = p.slice(dvBase.length);
    return dvNormalize(p);
  }
  return dvNormalize(window.location.hash.replace(/^#\/?/, ''));
}
function dvUrlFor(slug) {
  if (dvMode === 'path') return dvBase + slug;
  return window.location.pathname + window.location.search + '#/' + slug;
}
function dvRestoreFrom404() {
  if (dvMode === 'path' && window.location.hash.indexOf('#/') === 0) {
    try { window.history.replaceState(null, '', dvBase + window.location.hash.slice(2)); } catch(e) {}
  }
}
function dvShowPage(page) {
  var dvScroller = document.querySelector('main.dv-container');
  if (dvScroller) dvScroller.scrollTop = 0;
  Object.keys(dvPages).forEach(function(k) {
    document.getElementById(dvPages[k]).classList.toggle('dv-page-active', k === page);
  });
}
function dvUpdateMeta(slug, route) {
  document.title = route.title ? route.title + ' | Reflect & Align' : dvDefaultTitle;
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', route.description || dvDefaultDescription);
  var canon = document.getElementById('dvCanonical');
  if (canon && dvMode === 'path') canon.setAttribute('href', window.location.origin + dvBase + slug);
}
function dvResolve() {
  var slug = dvCurrentSlug();
  var route = dvRoutes[slug];
  if (!route) {
    for (var m = 0; m < dvMatchers.length && !route; m++) {
      try { route = dvMatchers[m](slug) || null; } catch(e) { route = null; }
    }
    if (route) dvRoutes[slug] = route;
  }
  if (!route) { dvNavigate('', true); return; }
  if (dvCurrentRoute !== route) {
    if (dvCurrentRoute && typeof dvCurrentRoute.close === 'function') dvCurrentRoute.close();
    dvCurrentRoute = route;
    if (typeof route.open === 'function') route.open();
  }
  dvUpdateMeta(slug, route);
  var navKey = route.navKey || (slug === '' ? 'home' : slug);
  var btns = document.querySelectorAll('.dv-nav-item');
  var hit = false;
  btns.forEach(function(b) { if (b.getAttribute('data-dv-page') === navKey) hit = true; });
  if (route.navNone) btns.forEach(function(b) { b.classList.remove('dv-nav-active'); });
  if (hit) btns.forEach(function(b) { b.classList.toggle('dv-nav-active', b.getAttribute('data-dv-page') === navKey); });
}
function dvNavigate(slug, replace) {
  slug = dvNormalize(slug);
  if (slug === dvCurrentSlug()) { dvResolve(); return; }
  try {
    if (replace) window.history.replaceState(null, '', dvUrlFor(slug));
    else window.history.pushState({ dv: 1 }, '', dvUrlFor(slug));
  } catch(e) {
    window.location.hash = '#/' + slug;
    return;
  }
  dvResolve();
}
function dvCloseRoute() {
  if (window.history.state && window.history.state.dv) window.history.back();
  else dvNavigate('', true);
}

/* Core routes */
dvRegisterRoute('', { open: function() { dvShowPage('home'); } });
dvRegisterRoute('to-do', {
  title: 'To-Do List',
  open: function() { dvOpenModal('To-Do List', dvBuildTodoHTML(), dvBindTodoEvents); },
  close: function() { dvCloseModal(); }
});

document.getElementById('dvBottomNav').addEventListener('click', function(e) {
  var btn = e.target.closest ? e.target.closest('.dv-nav-item') : null;
  if (!btn) return;
  dvNavigate(btn.getAttribute('data-dv-page'));
});

/* ===== MODULE API (the only surface optional modules use) ===== */
window.DV = {
  state: dvState,
  toast: dvShowToast,
  openModal: dvOpenModal,
  closeModal: dvCloseModal,
  closeSidebars: dvCloseAllSidebars,
  navigate: dvNavigate,
  closeRoute: dvCloseRoute,
  route: dvRegisterRoute,
  addLeftItem: dvAddLeftItem,
  addRightItem: dvAddRightItem,
  addQuickAction: dvAddQuickAction,
  addNavItem: dvAddNavItem,
  addPage: dvAddPage,
  addRouteMatcher: dvAddRouteMatcher,
  showPage: dvShowPage,
  url: dvUrl
};

/* ===== SERVICE WORKER ===== */
if ('serviceWorker' in navigator && dvMode === 'path') {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register(new URL('sw.js', dvScriptSrc).href).catch(function(){});
  });
}

/* ===== INIT ===== */
(function dvInit() {
  var savedTheme = 'blue', savedDark = false;
  try { savedTheme = localStorage.getItem('dv-theme') || 'blue'; savedDark = localStorage.getItem('dv-dark') === '1'; } catch (e) {}
  dvSetTheme(savedTheme);
  dvSetDark(savedDark);
  dvLoadTodos();

  window.addEventListener('popstate', dvResolve);
  if (dvMode === 'hash') window.addEventListener('hashchange', dvResolve);

  // Finish the shell once every script tag in index.html has run, then open the requested route
  function dvFinishShell() {
    dvBuildLeftNav();
    dvBuildRightNav();
    dvBuildQuickActions();
    dvStreakInit();
    document.getElementById('dvInvite').addEventListener('click', dvInvite);
    dvRestoreFrom404();
    dvResolve();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dvFinishShell);
  else dvFinishShell();
})();
