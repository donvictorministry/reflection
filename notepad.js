/* =====================================================================
   NOTEPAD MODULE — full-page notepad plugged into the right sidebar.
   Independent module: delete this file (and its script tag) and the app
   keeps working (the Notepad menu item simply disappears). Talks to the
   shell only via DV. Owns its own styles, markup, storage and route.
   Never uses browser alert / confirm / prompt.
   ===================================================================== */
(function() {
  try {
    if (!window.DV) return;

    var KEY = 'dvNotes', DKEY = 'dvNpDraft';
    var notes = [], curId = null, actId = null;
    var hist = [''], hi = 0, histTimer = null;

    function Q(s) { return document.querySelector(s); }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function toast(m) { DV.toast(m); }
    function loadNotes() { try { notes = JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { notes = []; } }
    function saveNotes() { try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch (e) { toast('Storage is full'); } }
    function findNote(id) { for (var i = 0; i < notes.length; i++) { if (notes[i].id === id) return notes[i]; } return null; }
    function saveDraft() { try { localStorage.setItem(DKEY, JSON.stringify({ text: Q('#dvNpEditor').value, id: curId })); } catch (e) {} }

    /* ===== ICONS ===== */
    var ic = {
      back: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
      plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
      redo: '<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>',
      undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
      paste: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
      copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
      exit: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
      save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
      open: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
      rename: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
      lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      del: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
      share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
      eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
      eyeoff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>',
      note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'
    };
    function svg(p, s) { s = s || 22; return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }

    /* ===== STYLES ===== */
    var css = '' +
      '.dv-np{position:fixed;inset:0;z-index:9999;background:var(--dv-surface);display:none;flex-direction:column;font-family:Roboto,sans-serif;color:var(--dv-text)}' +
      '.dv-np.dv-np-on{display:flex}' +
      '#dvNpActions{z-index:10000}' +
      '.dv-np-bar{background:var(--dv-primary);color:#fff;display:flex;align-items:center;gap:12px;padding:10px 12px;font-size:1.15rem;font-weight:700;flex-shrink:0}' +
      '.dv-np-bar .dv-icon-btn{color:#fff}' +
      '.dv-np-bar span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '.dv-np-pills{display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;padding:10px 12px;border-bottom:1px solid var(--dv-border);scrollbar-width:none;flex-shrink:0;align-items:center}' +
      '.dv-np-pills::-webkit-scrollbar,.dv-np-tools::-webkit-scrollbar{display:none}' +
      '.dv-np-pill{flex:none;max-width:70vw;display:flex;align-items:center;gap:6px;overflow:hidden;white-space:nowrap;padding:8px 16px;border-radius:999px;border:2px solid var(--dv-primary);background:var(--dv-bg);color:var(--dv-primary);font-size:1rem;font-weight:700;font-family:inherit;cursor:pointer}' +
      '.dv-np-pill.dv-np-cur{background:var(--dv-primary);color:#fff}' +
      '.dv-np-pill b{overflow:hidden;text-overflow:ellipsis;font-weight:700}' +
      '.dv-np-none{font-size:1rem;color:var(--dv-text-sub);white-space:nowrap}' +
      '.dv-np-tools{display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;padding:10px 12px;border-bottom:1px solid var(--dv-border);scrollbar-width:none;flex-shrink:0;background:var(--dv-surface)}' +
      '.dv-np-tool{flex:none;display:flex;align-items:center;gap:8px;padding:10px 16px;min-height:48px;border-radius:24px;border:2px solid var(--dv-border);background:var(--dv-bg);color:var(--dv-text);font-size:1rem;font-weight:700;font-family:inherit;cursor:pointer;white-space:nowrap}' +
      '.dv-np-tool:active{transform:scale(0.96)}' +
      '.dv-np-tool.dv-np-save{background:#16A34A;border-color:#16A34A;color:#fff}' +
      '.dv-np-editor{flex:1;width:100%;border:none;outline:none;resize:none;padding:16px;background:var(--dv-surface);color:var(--dv-text);font-size:23px;line-height:1.6;font-family:Roboto,sans-serif}' +
      '.dv-np-list{flex:1;overflow-y:auto;display:flex;flex-direction:column}' +
      '.dv-np-row{display:flex;align-items:center;gap:16px;width:100%;padding:20px 18px;border:none;border-bottom:1px solid var(--dv-border);background:var(--dv-surface);color:var(--dv-text);font-size:1.2rem;font-weight:700;font-family:inherit;cursor:pointer;text-align:left}' +
      '.dv-np-row:active{background:var(--dv-bg)}' +
      '.dv-np-row svg{color:var(--dv-primary);flex-shrink:0}' +
      '.dv-np-row.dv-np-danger,.dv-np-row.dv-np-danger svg{color:#DC2626}' +
      '.dv-np-row small{margin-left:auto;font-size:1rem;color:var(--dv-text-sub);font-weight:600}' +
      '.dv-np-menu{margin:8px 18px 18px;border:2px solid var(--dv-border);border-radius:14px;overflow:hidden;background:var(--dv-surface);box-shadow:var(--dv-shadow)}' +
      '.dv-np-menu[hidden]{display:none}' +
      '.dv-np-mi{display:flex;align-items:center;gap:14px;width:100%;padding:16px 18px;border:none;border-bottom:1px solid var(--dv-border);background:transparent;color:var(--dv-text);font-size:1.1rem;font-weight:600;font-family:inherit;cursor:pointer;text-align:left}' +
      '.dv-np-mi:last-child{border-bottom:none}' +
      '.dv-np-mi svg{color:var(--dv-primary)}' +
      '.dv-np-dlg{position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,0.6);display:none;align-items:center;justify-content:center;padding:20px;font-family:Roboto,sans-serif}' +
      '.dv-np-dlg.dv-np-on{display:flex}' +
      '.dv-np-card{width:100%;max-width:420px;background:var(--dv-surface);color:var(--dv-text);border-radius:16px;padding:22px;box-shadow:var(--dv-shadow-lg)}' +
      '.dv-np-ct{font-size:1.3rem;font-weight:800;margin-bottom:10px}' +
      '.dv-np-cm{font-size:1.05rem;color:var(--dv-text-sub);line-height:1.5;margin-bottom:14px}' +
      '.dv-np-iw{position:relative;margin-bottom:16px}' +
      '.dv-np-input{width:100%;padding:13px 14px;font-size:1.1rem;font-family:inherit;border:2px solid var(--dv-border);border-radius:12px;background:var(--dv-bg);color:var(--dv-text);outline:none}' +
      '.dv-np-input:focus{border-color:var(--dv-primary)}' +
      '.dv-np-iw.dv-np-pinw .dv-np-input{padding-right:54px;letter-spacing:6px}' +
      '.dv-np-eye{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:46px;height:46px;border:none;background:transparent;color:var(--dv-text-sub);display:flex;align-items:center;justify-content:center;cursor:pointer}' +
      '.dv-np-bs{display:flex;gap:10px;flex-wrap:wrap}' +
      '.dv-np-b{flex:1;min-width:110px;padding:14px;border:2px solid transparent;border-radius:12px;font-size:1.05rem;font-weight:700;font-family:inherit;color:#fff;cursor:pointer}' +
      '.dv-np-b:active{opacity:0.8}' +
      '.dv-np-blue{background:#1877F2}.dv-np-red{background:#DC2626}.dv-np-green{background:#16A34A}' +
      '.dv-np-black{background:#000;border-color:var(--dv-border)}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    /* ===== MARKUP ===== */
    var tools = [
      ['new', 'plus', '+ New Note'], ['redo', 'redo', 'Redo'], ['undo', 'undo', 'Undo'], ['paste', 'paste', 'Paste'],
      ['copy', 'copy', 'Copy'], ['exit', 'exit', 'Exit'], ['save', 'save', 'Save']
    ];
    var toolsHTML = tools.map(function(t) {
      return '<button class="dv-np-tool' + (t[0] === 'save' ? ' dv-np-save' : '') + '" data-dvnp="' + t[0] + '">' + svg(ic[t[1]], 20) + t[2] + '</button>';
    }).join('');
    var rows = [['open', 'open', 'Open'], ['rename', 'rename', 'Rename'], ['pin', 'lock', 'PIN'], ['delete', 'del', 'Delete'], ['share', 'share', 'Share']];
    var rowsHTML = rows.map(function(r) {
      return '<button class="dv-np-row' + (r[0] === 'delete' ? ' dv-np-danger' : '') + '" data-dvact="' + r[0] + '">' + svg(ic[r[1]], 24) + r[2] + (r[0] === 'pin' ? '<small id="dvNpPinState"></small>' : '') + '</button>';
    }).join('');
    var menu = [['wa', 'share', 'WhatsApp'], ['bt', 'share', 'Bluetooth'], ['imp', 'save', 'Import to device'], ['x', 'exit', 'Exit']];
    var menuHTML = menu.map(function(m) { return '<button class="dv-np-mi" data-dvsh="' + m[0] + '">' + svg(ic[m[1]], 22) + m[2] + '</button>'; }).join('');

    document.body.insertAdjacentHTML('beforeend',
      '<div class="dv-np" id="dvNpPage">' +
        '<div class="dv-np-bar"><button class="dv-icon-btn" id="dvNpBack" aria-label="Back">' + svg(ic.back, 24) + '</button><span>Notepad</span></div>' +
        '<div class="dv-np-pills" id="dvNpPills"></div>' +
        '<div class="dv-np-tools" id="dvNpTools">' + toolsHTML + '</div>' +
        '<textarea class="dv-np-editor" id="dvNpEditor" placeholder="Start writing..." spellcheck="true"></textarea>' +
      '</div>' +
      '<div class="dv-np" id="dvNpActions">' +
        '<div class="dv-np-bar"><button class="dv-icon-btn" id="dvNpActBack" aria-label="Back">' + svg(ic.back, 24) + '</button><span id="dvNpActTitle"></span></div>' +
        '<div class="dv-np-list">' + rowsHTML + '<div class="dv-np-menu" id="dvNpMenu" hidden>' + menuHTML + '</div></div>' +
      '</div>' +
      '<div class="dv-np-dlg" id="dvNpDlg"></div>');

    /* ===== DIALOG (centre pop-up, replaces alert/confirm/prompt) ===== */
    function closeDlg() { Q('#dvNpDlg').classList.remove('dv-np-on'); Q('#dvNpDlg').innerHTML = ''; }
    function dialog(o) {
      var h = '<div class="dv-np-card"><div class="dv-np-ct">' + esc(o.title) + '</div>';
      if (o.message) h += '<div class="dv-np-cm">' + esc(o.message) + '</div>';
      if (o.input) {
        h += '<div class="dv-np-iw' + (o.input.pin ? ' dv-np-pinw' : '') + '"><input class="dv-np-input" id="dvNpIn" type="' + (o.input.pin ? 'password' : 'text') + '"' +
          (o.input.pin ? ' inputmode="numeric" maxlength="4" autocomplete="off"' : ' maxlength="60"') + ' placeholder="' + esc(o.input.placeholder || '') + '" value="' + esc(o.input.value || '') + '">' +
          (o.input.pin ? '<button class="dv-np-eye" id="dvNpEye" type="button" aria-label="Show PIN">' + svg(ic.eye, 24) + '</button>' : '') + '</div>';
      }
      h += '<div class="dv-np-bs">' + o.buttons.map(function(b, i) { return '<button class="dv-np-b dv-np-' + b.cls + '" data-dvb="' + i + '">' + esc(b.label) + '</button>'; }).join('') + '</div></div>';
      var w = Q('#dvNpDlg');
      w.innerHTML = h;
      w.classList.add('dv-np-on');
      var inp = Q('#dvNpIn');
      if (inp) {
        if (o.input.pin) inp.addEventListener('input', function() { inp.value = inp.value.replace(/\D/g, '').slice(0, 4); });
        setTimeout(function() { inp.focus(); inp.select(); }, 50);
        var eye = Q('#dvNpEye');
        if (eye) eye.addEventListener('click', function() {
          var show = inp.type === 'password';
          inp.type = show ? 'text' : 'password';
          eye.innerHTML = svg(show ? ic.eyeoff : ic.eye, 24);
          eye.setAttribute('aria-label', show ? 'Hide PIN' : 'Show PIN');
        });
      }
      w.querySelectorAll('.dv-np-b').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var b = o.buttons[+btn.getAttribute('data-dvb')];
          if (!b.onClick) { closeDlg(); return; }
          Promise.resolve(b.onClick(inp ? inp.value : '')).then(function(r) { if (r !== false) closeDlg(); });
        });
      });
    }

    /* ===== PIN ===== */
    function hash(pin, salt) {
      var s = salt + ':' + pin;
      if (window.crypto && crypto.subtle && window.TextEncoder) {
        return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function(b) {
          return Array.prototype.map.call(new Uint8Array(b), function(x) { return ('0' + x.toString(16)).slice(-2); }).join('');
        });
      }
      var h = 5381, i;
      for (i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
      return Promise.resolve('f' + h);
    }
    function unlock(note, then, title) {
      if (!note.pin) { then(); return; }
      dialog({
        title: title || 'Enter PIN', message: 'This note is locked.', input: { pin: true, placeholder: '4-digit PIN' },
        buttons: [
          { label: 'Cancel', cls: 'black' },
          { label: 'Unlock', cls: 'green', onClick: function(v) {
            if (!/^\d{4}$/.test(v)) { toast('Enter the 4-digit PIN'); return false; }
            return hash(v, note.pin.s).then(function(hx) {
              if (hx !== note.pin.h) { toast('Wrong PIN'); return false; }
              setTimeout(then, 0);
            });
          } }
        ]
      });
    }

    /* ===== EDITOR + HISTORY ===== */
    function flush() {
      clearTimeout(histTimer);
      var v = Q('#dvNpEditor').value;
      if (v === hist[hi]) return;
      hist = hist.slice(0, hi + 1); hist.push(v);
      if (hist.length > 200) hist.shift();
      hi = hist.length - 1;
    }
    function setText(v) { Q('#dvNpEditor').value = v; flush(); saveDraft(); }
    function resetHistory() { hist = [Q('#dvNpEditor').value]; hi = 0; }

    /* ===== PILLS ===== */
    function renderPills() {
      var el = Q('#dvNpPills');
      if (!notes.length) { el.innerHTML = '<span class="dv-np-none">No saved notes yet</span>'; return; }
      el.innerHTML = notes.slice().sort(function(a, b) { return b.updated - a.updated; }).map(function(n) {
        return '<button class="dv-np-pill' + (n.id === curId ? ' dv-np-cur' : '') + '" data-dvid="' + n.id + '">' + (n.pin ? svg(ic.lock, 18) : '') + '<b>' + esc(n.title) + '</b></button>';
      }).join('');
    }

    /* ===== TOOLBAR ===== */
    function doNew() {
      if (Q('#dvNpEditor').value.trim()) {
        dialog({
          title: 'Unsaved Note', message: 'There is a note in the editor. Save it first, or clear it to start a new note.',
          buttons: [
            { label: 'Cancel', cls: 'blue' },
            { label: 'Clear', cls: 'red', onClick: function() { setText(''); curId = null; saveDraft(); renderPills(); toast('New note started'); } }
          ]
        });
        return;
      }
      curId = null; saveDraft(); renderPills(); toast('New note');
    }
    function doUndo() { flush(); if (hi > 0) { hi--; Q('#dvNpEditor').value = hist[hi]; saveDraft(); toast('Undo'); } else toast('Nothing to undo'); }
    function doRedo() { flush(); if (hi < hist.length - 1) { hi++; Q('#dvNpEditor').value = hist[hi]; saveDraft(); toast('Redo'); } else toast('Nothing to redo'); }
    function doPaste() {
      var ta = Q('#dvNpEditor');
      if (!navigator.clipboard || !navigator.clipboard.readText) { toast('Paste is not available. Long-press the editor.'); return; }
      navigator.clipboard.readText().then(function(t) {
        if (!t) { toast('Clipboard is empty'); return; }
        flush();
        var s = ta.selectionStart, e = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + t + ta.value.slice(e);
        ta.selectionStart = ta.selectionEnd = s + t.length;
        flush(); saveDraft(); toast('Pasted');
      }).catch(function() { toast('Paste blocked. Long-press the editor.'); });
    }
    function doCopy() {
      var ta = Q('#dvNpEditor'), v = ta.value;
      if (!v.trim()) { toast('Nothing to copy'); return; }
      function fallback() {
        try { ta.select(); document.execCommand('copy'); ta.setSelectionRange(v.length, v.length); toast('Note copied'); } catch (e) { toast('Copy failed'); }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(function() { toast('Note copied'); }).catch(fallback);
      else fallback();
    }
    function doSave() {
      var ta = Q('#dvNpEditor');
      if (!ta.value.trim()) { toast('Write something first'); return; }
      var cur = curId ? findNote(curId) : null;
      dialog({
        title: 'Save Note', input: { placeholder: 'Note title', value: cur ? cur.title : '' },
        buttons: [
          { label: 'Cancel', cls: 'black' },
          { label: 'Save', cls: 'green', onClick: function(v) {
            v = v.trim();
            if (!v) { toast('Enter a title'); return false; }
            if (cur) { cur.title = v; cur.text = ta.value; cur.updated = Date.now(); }
            else { cur = { id: Date.now().toString(36), title: v, text: ta.value, updated: Date.now(), pin: null }; notes.push(cur); curId = cur.id; }
            saveNotes(); saveDraft(); renderPills(); toast('Note saved');
          } }
        ]
      });
    }

    /* ===== NOTE ACTIONS PAGE ===== */
    function actNote() { return actId ? findNote(actId) : null; }
    function showActions(id) {
      var n = findNote(id);
      if (!n) return;
      actId = id;
      Q('#dvNpActTitle').textContent = n.title;
      Q('#dvNpPinState').textContent = n.pin ? 'On' : 'Off';
      Q('#dvNpMenu').hidden = true;
      Q('#dvNpActions').classList.add('dv-np-on');
    }
    function hideActions() { Q('#dvNpActions').classList.remove('dv-np-on'); actId = null; }
    function refreshAct() { var n = actNote(); if (n) { Q('#dvNpActTitle').textContent = n.title; Q('#dvNpPinState').textContent = n.pin ? 'On' : 'Off'; } }

    function actOpen() {
      var n = actNote(); if (!n) return;
      unlock(n, function() {
        flush(); setText(n.text); curId = n.id; saveDraft(); renderPills(); hideActions(); toast('Note opened');
      });
    }
    function actRename() {
      var n = actNote(); if (!n) return;
      dialog({
        title: 'Rename Note', input: { placeholder: 'Note title', value: n.title },
        buttons: [
          { label: 'Cancel', cls: 'black' },
          { label: 'Save', cls: 'green', onClick: function(v) {
            v = v.trim();
            if (!v) { toast('Enter a title'); return false; }
            n.title = v; n.updated = Date.now(); saveNotes(); renderPills(); refreshAct(); toast('Note renamed');
          } }
        ]
      });
    }
    function setPinDialog(n) {
      var btns = [
        { label: 'Cancel', cls: 'black' },
        { label: 'Save', cls: 'green', onClick: function(v) {
          if (!/^\d{4}$/.test(v)) { toast('PIN must be 4 digits'); return false; }
          var salt = Date.now().toString(36);
          return hash(v, salt).then(function(hx) { n.pin = { s: salt, h: hx }; saveNotes(); renderPills(); refreshAct(); toast('PIN saved'); });
        } }
      ];
      if (n.pin) btns.push({ label: 'Remove PIN', cls: 'red', onClick: function() { n.pin = null; saveNotes(); renderPills(); refreshAct(); toast('PIN removed'); } });
      dialog({ title: n.pin ? 'Change PIN' : 'Set PIN', message: 'Choose a 4-digit PIN to lock this note.', input: { pin: true, placeholder: '4-digit PIN' }, buttons: btns });
    }
    function actPin() {
      var n = actNote(); if (!n) return;
      if (n.pin) unlock(n, function() { setPinDialog(n); }, 'Enter current PIN');
      else setPinDialog(n);
    }
    function actDelete() {
      var n = actNote(); if (!n) return;
      dialog({
        title: 'Delete Note', message: 'Delete "' + n.title + '" permanently? This cannot be undone.',
        buttons: [
          { label: 'Cancel', cls: 'blue' },
          { label: 'Delete', cls: 'red', onClick: function() {
            notes = notes.filter(function(x) { return x.id !== n.id; });
            if (curId === n.id) curId = null;
            saveNotes(); saveDraft(); renderPills(); hideActions(); toast('Note deleted');
          } }
        ]
      });
    }

    /* ===== SHARE ===== */
    function noteText(n) { return n.title + '\n\n' + n.text; }
    function fileName(n) { return (n.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'note') + '.txt'; }
    function shareWA(n) { window.open('https://wa.me/?text=' + encodeURIComponent(noteText(n)), '_blank'); toast('Opening WhatsApp'); }
    function shareBT(n) {
      var file = null;
      try { file = new File([noteText(n)], fileName(n), { type: 'text/plain' }); } catch (e) {}
      if (navigator.share && file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: n.title }).then(function() { toast('Shared'); }).catch(function() {});
      } else if (navigator.share) {
        navigator.share({ title: n.title, text: noteText(n) }).then(function() { toast('Shared'); }).catch(function() {});
      } else toast('Sharing is not supported on this device');
      toast('Choose Bluetooth from the list');
    }
    function shareImport(n) {
      var blob = new Blob([noteText(n)], { type: 'text/plain' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = fileName(n);
      document.body.appendChild(a); a.click(); a.remove();
      toast('Note saved to your device');
    }
    function doShare(kind) {
      var n = actNote(); if (!n) return;
      if (kind === 'x') { Q('#dvNpMenu').hidden = true; toast('Share menu closed'); return; }
      unlock(n, function() {
        Q('#dvNpMenu').hidden = true;
        if (kind === 'wa') shareWA(n);
        else if (kind === 'bt') shareBT(n);
        else shareImport(n);
      });
    }

    /* ===== EVENTS ===== */
    var ed = Q('#dvNpEditor');
    ed.addEventListener('input', function() {
      clearTimeout(histTimer);
      histTimer = setTimeout(function() { flush(); saveDraft(); }, 500);
    });
    Q('#dvNpTools').addEventListener('click', function(e) {
      var b = e.target.closest('[data-dvnp]'); if (!b) return;
      var k = b.getAttribute('data-dvnp');
      if (k === 'new') doNew();
      else if (k === 'redo') doRedo();
      else if (k === 'undo') doUndo();
      else if (k === 'paste') doPaste();
      else if (k === 'copy') doCopy();
      else if (k === 'exit') { DV.closeRoute(); toast('Notepad closed'); }
      else if (k === 'save') doSave();
    });
    Q('#dvNpPills').addEventListener('click', function(e) {
      var p = e.target.closest('[data-dvid]'); if (p) showActions(p.getAttribute('data-dvid'));
    });
    Q('#dvNpBack').addEventListener('click', function() { DV.closeRoute(); });
    Q('#dvNpActBack').addEventListener('click', hideActions);
    Q('#dvNpActions').addEventListener('click', function(e) {
      var s = e.target.closest('[data-dvsh]');
      if (s) { doShare(s.getAttribute('data-dvsh')); return; }
      var r = e.target.closest('[data-dvact]'); if (!r) return;
      var k = r.getAttribute('data-dvact');
      if (k === 'open') actOpen();
      else if (k === 'rename') actRename();
      else if (k === 'pin') actPin();
      else if (k === 'delete') actDelete();
      else if (k === 'share') { var m = Q('#dvNpMenu'); m.hidden = !m.hidden; }
    });

    /* ===== REGISTER WITH THE SHELL ===== */
    DV.route('notepad', {
      title: 'Notepad',
      description: 'A simple private notepad. Write, save, lock with a PIN and share your notes.',
      open: function() {
        loadNotes();
        var d = null;
        try { d = JSON.parse(localStorage.getItem(DKEY) || 'null'); } catch (e) {}
        ed.value = d && d.text ? d.text : '';
        curId = d && d.id && findNote(d.id) ? d.id : null;
        resetHistory();
        renderPills();
        Q('#dvNpPage').classList.add('dv-np-on');
      },
      close: function() {
        flush(); saveDraft();
        hideActions(); closeDlg();
        Q('#dvNpPage').classList.remove('dv-np-on');
      }
    });
    DV.addRightItem({
      key: 'notepad_mod',
      label: 'Notepad',
      route: 'notepad',
      order: 10,
      icon: ic.note
    });
  } catch (e) {}
})();
