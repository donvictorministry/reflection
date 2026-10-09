/* =====================================================================
   BIBLE MODULE — King James Bible reader (66 books, deep-linkable, shareable).
   Independent module: delete this file (and its script tag) and the app
   keeps working (the Bible tab simply disappears). Talks to the shell only
   via DV. Owns its own styles, markup, storage, nav button and routes.

   Deep links:  /bible   /matthew   /john-3   /1-corinthians-13   /psalms-23
   ===================================================================== */
(function() {
  try {
    if (!window.DV) return;

    /* ===== BOOK DATA (canonical order) ===== */
    var dvBookNames = ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];
    var dvChapCounts = [50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22];
    var dvBookSlugs = dvBookNames.map(function(n) { return n.toLowerCase().replace(/ /g, '-'); });
    var dvSlugIdx = {};
    dvBookSlugs.forEach(function(s, i) { dvSlugIdx[s] = i; });

    // The Bible is read only from your own copy: file kjv.json next to index.html
    var dvBibleSrc = (document.currentScript && document.currentScript.src) || window.location.href;
    var dvKjvUrls = [new URL('kjv.json', dvBibleSrc).href];

    /* ===== STATE ===== */
    var dvBData = null, dvBList = [], dvBShown = 0, dvBSrch = null;
    var dvBBi = 0, dvBCi = 0, dvBHl = 0, dvBMode = 'chapter', dvBSel = [], dvBShare = null;

    /* ===== HELPERS ===== */
    function dvQ(s) { return document.querySelector(s); }
    function dvEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function dvClean(v) { return String(v).replace(/\{[HG]\d+\}/g, '').replace(/[{}]/g, '').replace(/<[^>]*>/g, '').replace(/\u00B6/g, '').replace(/\[/g, '').replace(/\]/g, '').replace(/\b[HG]\d{1,4}\b/g, '').replace(/\s+/g, ' ').trim(); }
    function dvBibleSlug(bi, ci) { return (typeof ci === 'number') ? dvBookSlugs[bi] + '-' + (ci + 1) : dvBookSlugs[bi]; }

    /* ===== STORAGE (own database, downloaded once) ===== */
    function dvBOpenDB() {
      return new Promise(function(res, rej) {
        var r = indexedDB.open('dvBibleKJV', 1);
        r.onupgradeneeded = function() { r.result.createObjectStore('b'); };
        r.onsuccess = function() { res(r.result); };
        r.onerror = function() { rej(); };
      });
    }
    function dvBGetStored() {
      return dvBOpenDB().then(function(db) {
        return new Promise(function(res, rej) {
          var q = db.transaction('b').objectStore('b').get('kjv2');
          q.onsuccess = function() { res(q.result || null); };
          q.onerror = function() { rej(); };
        });
      });
    }
    function dvBPutStored(d) {
      return dvBOpenDB().then(function(db) {
        return new Promise(function(res, rej) {
          var q = db.transaction('b', 'readwrite').objectStore('b').put(d, 'kjv2');
          q.onsuccess = function() { res(); };
          q.onerror = function() { rej(); };
        });
      });
    }

    /* ===== HIGHLIGHT COLOURS (gold default, black text on every colour) ===== */
    var dvHlColors = [
      { n: 'Gold', c: '#FFD700', t: '#000' },
      { n: 'Light Gold', c: '#FFE88C', t: '#000' },
      { n: 'Yellow', c: '#FFFF4D', t: '#000' },
      { n: 'Green', c: '#8EE59B', t: '#000' },
      { n: 'Sky', c: '#8FD3FF', t: '#000' },
      { n: 'Pink', c: '#FFB3D1', t: '#000' },
      { n: 'Orange', c: '#FFB066', t: '#000' },
      { n: 'Light Dark', c: '#5A5F66', t: '#fff' }
    ];
    var dvHlIdx = 0, dvHlMap = {};
    try { dvHlIdx = Math.min(dvHlColors.length - 1, Math.max(0, +localStorage.getItem('dvBibleColor') || 0)); } catch (e) {}
    try { dvHlMap = JSON.parse(localStorage.getItem('dvBibleHl') || '{}') || {}; } catch (e) { dvHlMap = {}; }
    function dvHlPersist() { try { localStorage.setItem('dvBibleHl', JSON.stringify(dvHlMap)); } catch (e) {} }
    function dvHlCSS() {
      var s = '.dv-bible-vs.dv-bible-on{background:var(--dv-bg);box-shadow:inset 0 0 0 3px var(--dv-primary)}';
      dvHlColors.forEach(function(k, i) {
        s += '.dv-bible-vs.dv-bible-c' + i + '{background:' + k.c + ';color:' + k.t + ';border-left-color:' + k.t + '}';
        s += '.dv-bible-vs.dv-bible-c' + i + ' b{color:' + k.t + '}';
      });
      s += '.dv-bible-vs.dv-bible-hl{background:#FFD700;color:#000;border-left-color:#000}';
      s += '.dv-bible-vs.dv-bible-hl b{color:#000}';
      return s;
    }

    /* ===== STYLES ===== */
    var css = '' +
      '#dvPageBible [hidden]{display:none !important}' +
      '#dvBibleLoading{position:fixed;inset:0;z-index:99998;display:none;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:rgba(255,255,255,0.92);pointer-events:auto;touch-action:none}' +
      '[data-dv-dark="1"] #dvBibleLoading{background:rgba(24,25,26,0.92)}' +
      '#dvBibleLoading.dv-on{display:flex}' +
      '.dv-bible-spin{width:64px;height:64px;border-radius:50%;border:7px solid rgba(24,119,242,0.2);border-top-color:#1877F2;animation:dvBSpin .9s linear infinite}' +
      '@keyframes dvBSpin{to{transform:rotate(360deg)}}' +
      '.dv-bible-load-t{font-size:1.3rem;font-weight:800;color:#1877F2;text-align:center;padding:0 24px;line-height:1.4}' +
      '#dvPageBible{margin:0 -14px -14px}' +
      '#dvBibleRead .dv-card:last-child{margin-bottom:0}' +
      '#dvBibleFoot{margin-bottom:0}' +
      '#dvPageBible .dv-card{border-radius:0;margin-bottom:8px}' +
      '#dvBibleShareModal .dv-share-modal-body{padding:0 0 20px}' +
      '#dvBibleShareModal .dv-share-verse-preview{margin:0 0 16px;border-radius:0;overflow-wrap:anywhere;word-break:break-word}' +
      '#dvBibleShareModal .dv-share-verse-preview span{display:block;overflow-wrap:anywhere;word-break:break-all}' +
      '#dvBibleShareModal .dv-share-option{border-radius:0;border-left:0;border-right:0;margin-bottom:0}' +
      '#dvBibleShareModal .dv-share-exit{border-radius:0;border-left:0;border-right:0;margin-top:0}' +
      '.dv-bible-row{display:flex;align-items:center;gap:10px;margin-bottom:12px}' +
      '.dv-bible-sel{flex:1;min-width:0;padding:12px;border:2px solid var(--dv-border);border-radius:12px;background:var(--dv-bg);color:var(--dv-text);font-size:1rem;font-weight:600;font-family:inherit;min-height:52px}' +
      '.dv-bible-a{font-size:1rem;font-weight:700;color:var(--dv-text-sub)}' +
      '#dvBibleSize{flex:1;accent-color:var(--dv-primary)}' +
      '.dv-bible-find{width:100%;padding:12px 16px;border:2px solid var(--dv-border);border-radius:12px;background:var(--dv-bg);color:var(--dv-text);font-size:1rem;font-family:inherit}' +
      '.dv-bible-head{font-size:1.35rem;font-weight:700;color:var(--dv-text);margin-bottom:4px}' +
      '#dvBibleTip{background:#8FD3FF;color:#000;font-weight:700;padding:12px 14px;border-radius:8px;border-left:6px solid #000}' +
      '.dv-bible-hint{font-size:1rem;color:var(--dv-text-sub);margin-bottom:12px;line-height:1.5}' +
      '.dv-bible-text{font-family:Roboto,sans-serif;padding-bottom:0}' +
      '.dv-bible-vs{font-size:var(--dvBs,23px);line-height:1.7;color:var(--dv-text);margin-bottom:6px;padding:4px 8px;border-radius:8px;cursor:pointer;border-left:4px solid transparent}' +
      '.dv-bible-vs b{font-size:1rem;color:var(--dv-primary);margin-right:6px;font-family:Roboto,sans-serif}' +
      '' + dvHlCSS() +
      '.dv-bible-ref{display:block;font-size:1rem;font-weight:700;color:var(--dv-primary);font-family:Roboto,sans-serif}' +
      '.dv-bible-credit{text-align:center;color:var(--dv-text-sub);font-size:1rem;margin-top:14px;font-family:Roboto,sans-serif}' +
      '.dv-bible-selbar{position:fixed;left:0;right:0;bottom:80px;z-index:160;background:var(--dv-surface);border-top:1px solid var(--dv-border);box-shadow:0 -2px 12px rgba(0,0,0,0.12);padding:10px 12px;display:flex;flex-direction:column;align-items:stretch;gap:8px}' +
      '.dv-bible-selrow{display:flex;align-items:center;gap:8px}' +
      '.dv-bible-sw{display:flex;gap:6px;justify-content:space-between;width:100%}' +
      '.dv-bible-swb{width:34px;height:34px;flex:none;border-radius:50%;border:3px solid transparent;cursor:pointer;padding:0}' +
      '.dv-bible-swb.dv-bible-act{border-color:var(--dv-text)}' +
      '.dv-bible-selbar span{flex:1;font-weight:700;font-size:1rem;color:var(--dv-text)}' +
      '.dv-bible-selbar .dv-btn{flex:1;padding:10px 8px;min-height:48px}' +
      '.dv-bible-selbar #dvBibleSelClear{flex:none;min-height:44px;padding:8px 18px}' +
      '.dv-bible-selbar .dv-btn[hidden]{display:none}' +
      '.dv-bible-selbar[hidden],#dvBibleShImg[hidden]{display:none}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    /* ===== MARKUP ===== */
    var icoShare = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
    var icoDown = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    var icoCopy = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    var icoBt = '<svg class="dv-share-icon-nat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/></svg>';
    var icoImg = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

    var pageHTML =
      '<section class="dv-page" id="dvPageBible">' +
        '<div class="dv-card" id="dvBibleGet">' +
          '<div class="dv-card-title">King James Bible</div>' +
          '<p class="dv-bible-hint">The Bible is prepared automatically for offline reading.</p>' +
          '<button class="dv-btn dv-btn-primary dv-btn-full" id="dvBibleGo" hidden>' + icoDown + 'Try Again</button>' +
          '<p class="dv-bible-hint" id="dvBibleMsg" style="margin-top:12px;margin-bottom:0;">Preparing the Bible for offline reading...</p>' +
        '</div>' +
        '<div id="dvBibleRead" hidden>' +
          '<div class="dv-card">' +
            '<div class="dv-card-title">King James Bible</div>' +
            '<div class="dv-bible-row">' +
              '<select id="dvBibleBook" class="dv-bible-sel" aria-label="Book"></select>' +
              '<select id="dvBibleCh" class="dv-bible-sel" aria-label="Chapter"></select>' +
            '</div>' +
            '<div class="dv-bible-row">' +
              '<button class="dv-btn dv-btn-secondary" id="dvBiblePrev">&#8249; Prev</button>' +
              '<button class="dv-btn dv-btn-secondary" id="dvBibleNext">Next &#8250;</button>' +
            '</div>' +
            '<div class="dv-bible-row">' +
              '<span class="dv-bible-a">A</span>' +
              '<input type="range" id="dvBibleSize" min="23" max="26" step="1" value="23" aria-label="Text size">' +
              '<span class="dv-bible-a" style="font-size:1.2rem;">A+</span>' +
            '</div>' +
            '<div class="dv-bible-row">' +
              '<button class="dv-btn dv-btn-primary" id="dvBibleShareBook">' + icoShare + 'Share Book</button>' +
              '<button class="dv-btn dv-btn-primary" id="dvBibleShareCh">' + icoShare + 'Share Chapter</button>' +
            '</div>' +
            '<input id="dvBibleFind" class="dv-bible-find" type="search" placeholder="Search the Bible">' +
          '</div>' +
          '<div class="dv-card">' +
            '<div class="dv-bible-head" id="dvBibleHead"></div>' +
            '<div class="dv-bible-hint" id="dvBibleTip">Tap any verse to select it, then share it as text or as an image.</div>' +
            '<div class="dv-bible-text" id="dvBibleText"></div>' +
            '<div class="dv-bible-row" id="dvBibleFoot">' +
              '<button class="dv-btn dv-btn-secondary" id="dvBiblePrev2">&#8249; Prev</button>' +
              '<button class="dv-btn dv-btn-secondary" id="dvBibleNext2">Next &#8250;</button>' +
            '</div>' +
            '<div class="dv-bible-credit">King James Version &middot; Public Domain</div>' +
          '</div>' +
        '</div>' +
        '<div class="dv-bible-selbar" id="dvBibleSelBar" hidden>' +
          '<div class="dv-bible-selrow"><span id="dvBibleSelCount"></span><button class="dv-btn dv-btn-secondary" id="dvBibleSelClear" aria-label="Back"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg></button></div>' +
          '<div class="dv-bible-sw" id="dvBibleSw"></div>' +
          '<div class="dv-bible-selrow">' +
            '<button class="dv-btn dv-btn-primary" id="dvBibleSelShare">Share</button>' +
            '<button class="dv-btn dv-btn-secondary" id="dvBibleSelBt">Bluetooth</button>' +
            '<button class="dv-btn dv-btn-secondary" id="dvBibleSelErase" hidden>Erase</button>' +
          '</div>' +
        '</div>' +
      '</section>';

    var shareHTML =
      '<div class="dv-share-modal" id="dvBibleShareModal">' +
        '<div class="dv-share-modal-head">' +
          '<button class="dv-icon-btn" id="dvBibleShareClose" aria-label="Back"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg></button>' +
          '<div class="dv-share-modal-title">Share</div>' +
        '</div>' +
        '<div class="dv-share-modal-body">' +
          '<div class="dv-share-verse-preview"><p id="dvBibleSharePrev"></p><span id="dvBibleShareUrl"></span></div>' +
          '<button class="dv-share-option" id="dvBibleShNat">' + icoShare.replace('width="18" height="18"', 'width="26" height="26" class="dv-share-icon-nat"') + 'Share via Android</button>' +
          '<button class="dv-share-option" id="dvBibleShBt">' + icoBt + 'Share via Bluetooth</button>' +
          '<button class="dv-share-option" id="dvBibleShImg" hidden>' + icoImg.replace('<svg', '<svg class="dv-share-icon-nat"') + 'Share as Picture</button>' +
          '<button class="dv-share-exit" id="dvBibleShExit">Exit Share Page</button>' +
        '</div>' +
      '</div>';

    document.querySelector('main.dv-container').insertAdjacentHTML('beforeend', pageHTML);
    document.body.insertAdjacentHTML('beforeend', '<div id="dvBibleLoading"><div class="dv-bible-spin"></div><div class="dv-bible-load-t">Let\'s prepare the app for Offline use</div></div>');
    var dvBLoadTimer = null;
    function dvBibleLoad(on) {
      var l = dvQ('#dvBibleLoading');
      if (l) l.classList.toggle('dv-on', on);
      clearTimeout(dvBLoadTimer);
      if (on) dvBLoadTimer = setTimeout(function() { if (l) l.classList.remove('dv-on'); }, 120000); // safety: never trap the user longer than 2 minutes
    }
    document.body.insertAdjacentHTML('beforeend', shareHTML);

    /* ===== READER ===== */
    async function dvBibleOpen(bi, ci, auto) {
      if (!dvBData) { try { dvBData = await dvBGetStored(); } catch (e) {} }
      var has = !!dvBData;
      dvQ('#dvBibleGet').hidden = has;
      dvQ('#dvBibleRead').hidden = !has;
      var target = (typeof bi === 'number') ? { bi: bi, ci: ci } : null;
      if (has) {
        if (!dvQ('#dvBibleBook').options.length) {
          var h = '<optgroup label="Old Testament">';
          for (var i = 0; i < dvBookNames.length; i++) {
            if (i === 39) h += '</optgroup><optgroup label="New Testament">';
            h += '<option value="' + i + '">' + dvEsc(dvBookNames[i]) + '</option>';
          }
          dvQ('#dvBibleBook').innerHTML = h + '</optgroup>';
        }
        if (!target) {
          var last = null;
          try { last = (localStorage.getItem('dvBibleLast') || '').split(':'); } catch (e) {}
          target = (last && last.length === 2 && dvBookNames[+last[0]]) ? { bi: +last[0], ci: +last[1] } : { bi: 0, ci: 0 };
        }
        dvBibleChapters(target.bi, target.ci);
      } else {
        if (target) dvBPending = target;
        dvBibleGet();
      }
    }
    var dvBPending = null;

    function dvBibleChapters(bi, ci) {
      var n = dvBData[bi].c.length;
      if (ci >= n) ci = 0;
      dvBBi = bi; dvBCi = ci;
      dvQ('#dvBibleBook').value = bi;
      var h = '';
      for (var i = 0; i < n; i++) h += '<option value="' + i + '">Ch. ' + (i + 1) + '</option>';
      dvQ('#dvBibleCh').innerHTML = h;
      dvQ('#dvBibleCh').value = ci;
      dvBibleShow();
    }

    function dvBibleShow() {
      dvBMode = 'chapter';
      dvBSel = [];
      dvBibleSelUpdate();
      dvBList = dvBData[dvBBi].c[dvBCi].map(function(t, i) { return { n: i + 1, t: t }; });
      var h = '';
      for (var i = 0; i < dvBList.length; i++) {
        h += '<p class="dv-bible-vs" id="dvBVs' + dvBList[i].n + '" data-dvv="' + dvBList[i].n + '"><b>' + dvBList[i].n + '</b>' + dvEsc(dvBList[i].t) + '</p>';
      }
      dvQ('#dvBibleText').innerHTML = h;
      dvBiblePaint();
      dvQ('#dvBibleHead').textContent = dvBookNames[dvBBi] + ' ' + (dvBCi + 1);
      dvQ('#dvBibleTip').hidden = false;
      dvQ('#dvBibleFoot').hidden = false;
      var atStart = dvBBi === 0 && dvBCi === 0, atEnd = dvBBi === 65 && dvBCi === dvBData[65].c.length - 1;
      ['#dvBiblePrev', '#dvBiblePrev2'].forEach(function(s) { dvQ(s).disabled = atStart; });
      ['#dvBibleNext', '#dvBibleNext2'].forEach(function(s) { dvQ(s).disabled = atEnd; });
      try { localStorage.setItem('dvBibleLast', dvBBi + ':' + dvBCi); } catch (e) {}
      if (dvBHl) {
        var el = dvQ('#dvBVs' + dvBHl);
        dvBHl = 0;
        if (el) { el.classList.add('dv-bible-hl'); el.scrollIntoView({ block: 'center' }); return; }
      }
      var dvMain = document.querySelector('main.dv-container'); if (dvMain) dvMain.scrollTop = 0;
    }

    function dvBiblePaint() {
      var m = dvHlMap[dvBBi + ':' + dvBCi] || {};
      document.querySelectorAll('#dvBibleText .dv-bible-vs[data-dvv]').forEach(function(p) {
        for (var i = 0; i < dvHlColors.length; i++) p.classList.remove('dv-bible-c' + i);
        var c = m[p.getAttribute('data-dvv')];
        if (c !== undefined) p.classList.add('dv-bible-c' + c);
      });
    }
    function dvBibleSwatches() {
      document.querySelectorAll('#dvBibleSw .dv-bible-swb').forEach(function(s, i) {
        s.classList.toggle('dv-bible-act', i === dvHlIdx);
      });
      document.documentElement.style.setProperty('--dvHl', dvHlColors[dvHlIdx].c);
    }

    function dvBibleLeave() {
      dvBSel = [];
      dvBibleSelUpdate();
    }

    function dvBibleStep(dir) {
      var bi = dvBBi, ci = dvBCi + dir;
      if (ci < 0) { bi--; if (bi < 0) return; ci = dvChapCounts[bi] - 1; }
      else if (ci >= dvChapCounts[bi]) { bi++; if (bi > 65) return; ci = 0; }
      DV.navigate(dvBibleSlug(bi, ci));
    }

    /* ===== SEARCH ===== */
    function dvBibleReset() {
      dvBShown = 0;
      var b = dvQ('#dvBibleText');
      b.innerHTML = '';
      dvBibleMore();
    }
    function dvBibleMore() {
      var box = dvQ('#dvBibleText'), old = box.querySelector('.dv-bible-more');
      if (old) old.remove();
      if (!dvBList.length) { box.innerHTML = '<div class="dv-empty"><div class="dv-empty-text">No verses found.</div></div>'; return; }
      var end = Math.min(dvBShown + 25, dvBList.length), h = '';
      for (var i = dvBShown; i < end; i++) {
        var v = dvBList[i];
        h += '<p class="dv-bible-vs" data-dvg="' + v.g + '"><span class="dv-bible-ref">' + dvEsc(v.r) + '</span>' + dvEsc(v.t) + '</p>';
      }
      box.insertAdjacentHTML('beforeend', h);
      dvBShown = end;
      var rem = dvBList.length - end;
      if (rem > 0) box.insertAdjacentHTML('beforeend', '<button class="dv-btn dv-btn-secondary dv-btn-full dv-bible-more">Show more &mdash; ' + rem + ' verses remaining</button>');
    }
    function dvBibleFind(q) {
      q = q.trim().toLowerCase();
      if (q.length < 3) { if (dvBMode === 'search') dvBibleShow(); return; }
      var out = [];
      dvBData.forEach(function(b, bi) {
        b.c.forEach(function(ch, ci) {
          ch.forEach(function(t, vi) {
            if (t.toLowerCase().indexOf(q) !== -1) out.push({ r: dvBookNames[bi] + ' ' + (ci + 1) + ':' + (vi + 1), g: bi + ':' + ci + ':' + vi, t: t });
          });
        });
      });
      dvBMode = 'search';
      dvBSel = [];
      dvBibleSelUpdate();
      dvBList = out;
      dvQ('#dvBibleHead').textContent = out.length + ' result' + (out.length === 1 ? '' : 's');
      dvQ('#dvBibleTip').hidden = true;
      dvQ('#dvBibleFoot').hidden = true;
      dvBibleReset();
    }
    function dvBibleJump(g) {
      var p = g.split(':'), bi = +p[0], ci = +p[1];
      dvQ('#dvBibleFind').value = '';
      dvBHl = (+p[2]) + 1;
      if (bi === dvBBi && ci === dvBCi) dvBibleChapters(bi, ci);
      else DV.navigate(dvBibleSlug(bi, ci));
    }

    /* ===== VERSE SELECTION ===== */
    function dvBibleRef(nums) {
      var parts = [], s = nums[0], p = nums[0];
      for (var i = 1; i < nums.length; i++) {
        if (nums[i] === p + 1) { p = nums[i]; continue; }
        parts.push(s === p ? '' + s : s + '-' + p);
        s = p = nums[i];
      }
      parts.push(s === p ? '' + s : s + '-' + p);
      return dvBookNames[dvBBi] + ' ' + (dvBCi + 1) + ':' + parts.join(',');
    }
    function dvBibleSelText() {
      var nums = dvBSel.slice().sort(function(a, b) { return a - b; });
      var body = nums.map(function(n) { return (nums.length > 1 ? n + ' ' : '') + dvBList[n - 1].t; }).join(' ');
      return { ref: dvBibleRef(nums), body: body, plain: nums.map(function(n) { return dvBList[n - 1].t; }).join(' ') };
    }
    function dvBibleSelUpdate() {
      var bar = dvQ('#dvBibleSelBar');
      if (!bar) return;
      bar.hidden = !dvBSel.length;
      var dvMainBox = document.querySelector('main.dv-container');
      if (dvMainBox) dvMainBox.style.bottom = dvBSel.length ? (80 + bar.offsetHeight) + 'px' : '';
      dvQ('#dvBibleSelCount').textContent = dvBSel.length + ' selected';
      var m = dvHlMap[dvBBi + ':' + dvBCi] || {};
      dvQ('#dvBibleSelErase').hidden = !dvBSel.some(function(n) { return m[n] !== undefined; });
      document.querySelectorAll('#dvBibleText .dv-bible-vs[data-dvv]').forEach(function(p) {
        p.classList.toggle('dv-bible-on', dvBSel.indexOf(+p.getAttribute('data-dvv')) !== -1);
      });
    }

    /* ===== SHARING ===== */
    function dvBibleCtxBook() {
      return { slug: dvBibleSlug(dvBBi), text: 'Read the book of ' + dvBookNames[dvBBi] + ' in the King James Bible.' };
    }
    function dvBibleCtxChapter() {
      var v1 = dvBList.length && dvBMode === 'chapter' ? dvBList[0].t : '';
      return { slug: dvBibleSlug(dvBBi, dvBCi), text: dvBookNames[dvBBi] + ' ' + (dvBCi + 1) + ' (KJV)' + (v1 ? '\n\u201C' + v1 + '\u201D' : '') };
    }
    function dvBibleCtxVerses() {
      var s = dvBibleSelText();
      return { slug: dvBibleSlug(dvBBi, dvBCi), text: '\u201C' + s.body + '\u201D \u2014 ' + s.ref + ' (KJV)', image: { text: s.plain, ref: s.ref } };
    }
    function dvBibleShareOpen(ctx) {
      ctx.url = DV.url(ctx.slug);
      dvBShare = ctx;
      dvQ('#dvBibleSharePrev').textContent = ctx.text;
      dvQ('#dvBibleShareUrl').innerHTML = dvBibleUrlLines(ctx.url);
      dvQ('#dvBibleShImg').hidden = !ctx.image;
      dvQ('#dvBibleShareModal').classList.add('dv-active');
    }
    function dvBibleShareClose() { dvQ('#dvBibleShareModal').classList.remove('dv-active'); }
    function dvBibleMsg() { return dvBShare.text + '\n\n' + dvBShare.url; }
    function dvBibleUrlLines(u) {
      var m = /^(https?:\/\/[^\/]+)(.*)$/.exec(u);
      return m ? dvEsc(m[1]) + '<br>' + dvEsc(m[2] || '/') : dvEsc(u);
    }
    function dvBibleBluetooth() {
      var msg = dvBibleMsg(), file = null;
      try { file = new File([msg], 'bible-share.txt', { type: 'text/plain' }); } catch (e) {}
      if (navigator.share && file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'King James Bible' }).catch(function() {});
        DV.toast('Choose Bluetooth from the list');
      } else if (navigator.share) {
        navigator.share({ title: 'King James Bible', text: msg }).catch(function() {});
        DV.toast('Choose Bluetooth from the list');
      } else DV.toast('Sharing is not supported on this device');
    }

    function dvBibleWrap(x, text, maxW) {
      var words = text.split(' '), lines = [], line = '';
      for (var i = 0; i < words.length; i++) {
        var t = line ? line + ' ' + words[i] : words[i];
        if (x.measureText(t).width > maxW && line) { lines.push(line); line = words[i]; } else line = t;
      }
      if (line) lines.push(line);
      return lines;
    }
    function dvBibleImage(text, ref, cb) {
      var W = 1080, H = 1080, c = document.createElement('canvas');
      c.width = W; c.height = H;
      var x = c.getContext('2d');
      var cs = getComputedStyle(document.documentElement);
      var p1 = cs.getPropertyValue('--dv-primary').trim() || '#1877F2';
      var p2 = cs.getPropertyValue('--dv-primary-dark').trim() || '#0D5DBD';
      var g = x.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, p1); g.addColorStop(1, p2);
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'top';
      var q = '\u201C' + text + '\u201D', size = 60, lh = 84, lines = [];
      for (; size >= 26; size -= 2) {
        x.font = 'italic ' + size + 'px Roboto, sans-serif';
        lh = Math.round(size * 1.4);
        lines = dvBibleWrap(x, q, 860);
        if (lines.length * lh <= 640) break;
      }
      var top = Math.round((H - lines.length * lh) / 2 - 70);
      lines.forEach(function(l, i) { x.fillText(l, W / 2, top + i * lh); });
      x.font = 'bold 44px Roboto, sans-serif';
      x.fillText(ref + ' (KJV)', W / 2, top + lines.length * lh + 50);
      x.globalAlpha = 0.85;
      x.font = '32px Roboto, sans-serif';
      x.fillText('Reflect & Align', W / 2, H - 120);
      x.fillText(window.location.host, W / 2, H - 76);
      c.toBlob(cb, 'image/png');
    }
    function dvBibleShareImage() {
      var im = dvBShare && dvBShare.image;
      if (!im) return;
      if (im.text.length > 700) { DV.toast('Select fewer verses for an image'); return; }
      dvBibleImage(im.text, im.ref, function(blob) {
        if (!blob) return;
        var name = im.ref.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.png';
        var file = null;
        try { file = new File([blob], name, { type: 'image/png' }); } catch (e) {}
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], text: dvBibleMsg() }).catch(function() {});
        } else {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob); a.download = name;
          document.body.appendChild(a); a.click(); a.remove();
          DV.toast('Image saved');
        }
        dvBibleShareClose();
      });
    }

    /* ===== DOWNLOAD (once) ===== */
    var dvBDownloading = false;
    async function dvBibleGet() {
      if (dvBDownloading) return;
      dvBDownloading = true;
      var stt = dvQ('#dvBibleMsg'), btn = dvQ('#dvBibleGo');
      btn.hidden = true;
      dvBibleLoad(true);
      stt.textContent = 'Preparing the Bible for offline reading...';
      var d = null;
      for (var k = 0; k < dvKjvUrls.length; k++) {
        try {
          var r = await fetch(dvKjvUrls[k]);
          if (!r.ok) throw new Error('x');
          d = JSON.parse((await r.text()).replace(/^\uFEFF/, ''));
          break;
        } catch (e) {}
      }
      if (d && !(d.books && d.books.length >= 66)) d = null;
      if (!d) {
        stt.textContent = 'The Bible will finish preparing as soon as the internet connection returns.';
        btn.hidden = false;
        dvBibleLoad(false);
      } else {
        dvBData = d.books.map(function(b) {
          return { n: b.name, c: b.chapters.map(function(ch) { return ch.verses.map(function(v) { return dvClean(v.text); }); }) };
        });
        try { await dvBPutStored(dvBData); } catch (e) {}
        dvBibleLoad(false);
        stt.textContent = '';
        var t = dvBPending; dvBPending = null;
        dvBDownloading = false;
        if (t) dvBibleOpen(t.bi, t.ci);
        else if (dvQ('#dvPageBible').classList.contains('dv-page-active')) dvBibleOpen();
      }
      dvBDownloading = false;
    }
    function dvBibleAuto() {
      if (dvBData || dvBDownloading) return;
      dvBGetStored().then(function(d) { if (d) dvBData = d; else dvBibleGet(); }).catch(function() { dvBibleGet(); });
    }
    dvBibleAuto();
    window.addEventListener('online', dvBibleAuto);

    /* ===== BINDINGS ===== */
    (function() {
      var z = 23;
      try { z = Math.min(26, Math.max(23, +localStorage.getItem('dvBibleFont') || 23)); } catch (e) {}
      document.documentElement.style.setProperty('--dvBs', z + 'px');
      dvQ('#dvBibleSize').value = z;
      dvQ('#dvBibleSize').oninput = function(e) {
        document.documentElement.style.setProperty('--dvBs', e.target.value + 'px');
        try { localStorage.setItem('dvBibleFont', e.target.value); } catch (er) {}
      };
      dvQ('#dvBibleGo').onclick = function() { dvBibleGet(); };
      dvQ('#dvBibleBook').onchange = function() { DV.navigate(dvBibleSlug(+dvQ('#dvBibleBook').value, 0)); };
      dvQ('#dvBibleCh').onchange = function() { DV.navigate(dvBibleSlug(dvBBi, +dvQ('#dvBibleCh').value)); };
      dvQ('#dvBiblePrev').onclick = dvQ('#dvBiblePrev2').onclick = function() { dvBibleStep(-1); };
      dvQ('#dvBibleNext').onclick = dvQ('#dvBibleNext2').onclick = function() { dvBibleStep(1); };
      dvQ('#dvBibleFind').oninput = function(e) {
        clearTimeout(dvBSrch);
        dvBSrch = setTimeout(function() { dvBibleFind(e.target.value); }, 300);
      };
      dvQ('#dvBibleText').onclick = function(e) {
        if (e.target.closest('.dv-bible-more')) { dvBibleMore(); return; }
        var p = e.target.closest('.dv-bible-vs');
        if (!p) return;
        if (p.getAttribute('data-dvg')) { dvBibleJump(p.getAttribute('data-dvg')); return; }
        var n = +p.getAttribute('data-dvv'), at = dvBSel.indexOf(n);
        if (at === -1) dvBSel.push(n); else dvBSel.splice(at, 1);
        dvBibleSelUpdate();
      };
      dvQ('#dvBibleShareBook').onclick = function() { dvBibleShareOpen(dvBibleCtxBook()); };
      dvQ('#dvBibleShareCh').onclick = function() {
        if (dvBMode !== 'chapter') dvBibleShow();
        dvBibleShareOpen(dvBibleCtxChapter());
      };
      dvQ('#dvBibleSelShare').onclick = function() { dvBibleShareOpen(dvBibleCtxVerses()); };
      dvQ('#dvBibleSelBt').onclick = function() {
        var c = dvBibleCtxVerses();
        c.url = DV.url(c.slug);
        dvBShare = c;
        dvBibleBluetooth();
      };
      dvQ('#dvBibleSw').innerHTML = dvHlColors.map(function(k, i) {
        return '<button class="dv-bible-swb" data-dvc="' + i + '" style="background:' + k.c + ';" aria-label="' + k.n + ' highlight"></button>';
      }).join('');
      dvQ('#dvBibleSw').onclick = function(e) {
        var s = e.target.closest('.dv-bible-swb');
        if (!s) return;
        dvHlIdx = +s.getAttribute('data-dvc');
        try { localStorage.setItem('dvBibleColor', dvHlIdx); } catch (er) {}
        dvBibleSwatches();
        var key = dvBBi + ':' + dvBCi;
        dvHlMap[key] = dvHlMap[key] || {};
        dvBSel.forEach(function(n) { dvHlMap[key][n] = dvHlIdx; });
        dvHlPersist();
        dvBiblePaint();
        dvBibleSelUpdate();
        DV.toast('Highlighted');
      };
      dvBibleSwatches();
      dvQ('#dvBibleSelErase').onclick = function() {
        var key = dvBBi + ':' + dvBCi;
        if (dvHlMap[key]) {
          dvBSel.forEach(function(n) { delete dvHlMap[key][n]; });
          if (!Object.keys(dvHlMap[key]).length) delete dvHlMap[key];
        }
        dvHlPersist();
        dvBiblePaint();
        dvBibleSelUpdate();
        DV.toast('Highlight removed');
      };
      dvQ('#dvBibleSelClear').onclick = function() { dvBSel = []; dvBibleSelUpdate(); };
      dvQ('#dvBibleShareClose').onclick = dvBibleShareClose;
      dvQ('#dvBibleShExit').onclick = dvBibleShareClose;
      dvQ('#dvBibleShImg').onclick = dvBibleShareImage;
      dvQ('#dvBibleShNat').onclick = function() {
        if (navigator.share) navigator.share({ title: 'King James Bible', text: dvBShare.text, url: dvBShare.url }).catch(function() {});
        else DV.toast('Sharing is not supported on this device');
        dvBibleShareClose();
      };
      dvQ('#dvBibleShBt').onclick = function() {
        dvBibleBluetooth();
        dvBibleShareClose();
      };
    })();

    /* ===== REGISTER WITH THE SHELL ===== */
    DV.addNavItem({
      key: 'bible',
      id: 'dvBibleNavBtn',
      html: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>Bible'
    });

    DV.addPage('bible', 'dvPageBible', {
      title: 'King James Bible',
      description: 'Read the King James Bible free, all 66 books, offline. Share any book or chapter with a link.',
      navKey: 'bible',
      open: function() { dvBibleOpen(); },
      close: dvBibleLeave
    });

    // Deep links: /matthew (book) and /john-3 (chapter)
    if (DV.addQuickAction) DV.addQuickAction({
      label: 'Bible',
      route: 'bible',
      order: 10,
      icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'
    });

    DV.addRouteMatcher(function(slug) {
      var bi = dvSlugIdx[slug], ci = 0, label;
      if (bi !== undefined) {
        label = dvBookNames[bi];
      } else {
        var m = /^(.+)-(\d+)$/.exec(slug);
        if (!m || dvSlugIdx[m[1]] === undefined) return null;
        bi = dvSlugIdx[m[1]];
        ci = parseInt(m[2], 10) - 1;
        if (ci < 0 || ci >= dvChapCounts[bi]) return null;
        label = dvBookNames[bi] + ' ' + (ci + 1);
      }
      return {
        title: label + ' (KJV)',
        description: 'Read ' + label + ' in the King James Bible, free and offline. Share it with a link.',
        navKey: 'bible',
        open: function() { DV.showPage('bible'); dvBibleOpen(bi, ci, true); },
        close: dvBibleLeave
      };
    });
  } catch (e) {}
})();
