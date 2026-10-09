/* =====================================================================
   GAME MODULE — JESUS Slide Puzzle.
   Independent module: delete this file and the app keeps working
   (the JESUS button simply disappears). Talks to the shell only via DV.
   Owns its own styles, markup, bottom-nav button and route.
   ===================================================================== */
(function(){
  try {
  if (!window.DV) return;

  /* ══ STYLES ══ */
  var dvgCSS = `
/* ══ CFG TOKENS — light ══ */
#dv-bg-w {
  --bg:         #fff3d6;
  --bg2:        #ffffff;
  --surface:    #ffffff;
  --chrome-bg:  #fff3d6;
  --text:       #1c1e21;
  --text-mute:  #65676b;
  --brand:      #1877F2;
  --tile-a:     #ffd166;
  --tile-b:     #f5a623;
  --tile-sh:    #b9780f;
  --tile-txt:   #5c3a00;
  --glow:       rgba(255,204,77,0.9);
  --btn-bg:     #fff0b3;
  --btn-txt:    #7a5200;
  --streak-bg:  #fff0b3;
  --streak-txt: #7a5200;
  --over-bg:    #fff3d6;
  --over-txt:   #1c1e21;
  --rule:       #e8c84a;
  --cert-bg:    #fffdf2;
  --cert-frame: #c8a000;
  --cert-txt:   #2a1a00;
  --cert-mute:  #7a5200;
}
/* ══ CFG TOKENS — dark ══ */
#dv-bg-w.dv-dark {
  --bg:         #0d1117;
  --bg2:        #161b22;
  --surface:    #21262d;
  --chrome-bg:  #1a1200;
  --text:       #e6edf3;
  --text-mute:  #8b949e;
  --brand:      #58a6ff;
  --tile-a:     #c07c00;
  --tile-b:     #a06000;
  --tile-sh:    #603800;
  --tile-txt:   #ffe299;
  --glow:       rgba(255,180,50,0.85);
  --btn-bg:     #2d2200;
  --btn-txt:    #ffd166;
  --streak-bg:  #2d2200;
  --streak-txt: #ffd166;
  --over-bg:    #0d1117;
  --over-txt:   #e6edf3;
  --rule:       #7a5200;
  --cert-bg:    #161b22;
  --cert-frame: #b8900a;
  --cert-txt:   #ffd166;
  --cert-mute:  #8b949e;
}

/* ══ CONTAINER ══ */
#dv-bg-w {
  display: none;
  position: relative;
  z-index: 0;
  margin: 0 -14px;
  height: 100%;
  background: linear-gradient(160deg, var(--bg) 0%, var(--bg2) 60%);
  font-family: Roboto, sans-serif;
  flex-direction: column;
  overflow: hidden;
  color: var(--text);
  transition: background .3s, color .3s;
}
#dv-bg-w.dv-page-active { display: flex; }
#dv-bg-w * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

/* ══ CHROME ══ */
.dvg-chrome {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  background: var(--chrome-bg);
  flex-shrink: 0;
  border-bottom: 1.5px solid var(--rule);
}
.dvg-chrome-title {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--brand);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 36dvw;
}
.dvg-btns {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
}
.dvg-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  background: var(--btn-bg);
  color: var(--btn-txt);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: background .15s, color .15s;
}
.dvg-btn.on {
  background: var(--brand);
  color: #fff;
}
.dvg-btn:active { opacity: 0.72; }

/* ══ CREDIT (bottom) ══ */
.dvg-credit {
  flex-shrink: 0;
  text-align: center;
  padding: 10px 0 14px;
  font-size: 1.2rem;
  font-weight: 200;
  color: #000;
}
#dv-bg-w.dv-dark .dvg-credit { color: #fff; }

/* ══ HUD ══ */
.dvg-hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px 4px;
  flex-shrink: 0;
}
.dvg-hud-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 64px;
}
.dvg-hud-val {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--brand);
  line-height: 1;
}
.dvg-hud-lbl {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-mute);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.dvg-diff-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.dvg-dots {
  display: flex;
  gap: 5px;
}
.dvg-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--btn-bg);
  border: 2px solid var(--brand);
  transition: background .2s;
}
.dvg-dot.on { background: var(--brand); }

/* ══ BODY ══ */
.dvg-body {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 16px 0;
  overflow: hidden;
}
.dvg-subtitle {
  text-align: center;
  color: var(--text-mute);
  font-size: 1.2rem;
  font-style: italic;
  margin-bottom: 14px;
  flex-shrink: 0;
}

/* ══ GRID ══ */
.dvg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(7px, 2.2dvw, 13px);
  width: min(90dvw, 330px);
  flex-shrink: 0;
  touch-action: none;
}
.dvg-tile {
  aspect-ratio: 1;
  border-radius: 14px;
  background: linear-gradient(160deg, var(--tile-a), var(--tile-b));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.6rem, 8dvw, 2.4rem);
  font-weight: 800;
  color: var(--tile-txt);
  box-shadow: 0 6px 0 var(--tile-sh), 0 10px 18px rgba(0,0,0,0.22);
  transform: translateY(0);
  transition: transform .08s, box-shadow .08s;
  cursor: pointer;
  user-select: none;
}
.dvg-tile:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 var(--tile-sh), 0 4px 8px rgba(0,0,0,0.18);
}
.dvg-tile.blank { visibility: hidden; }
.dvg-tile.glow {
  background: linear-gradient(160deg, #ffe08a, #ffcc4d);
  box-shadow: 0 6px 0 var(--tile-sh), 0 0 28px var(--glow);
}
.dvg-cross {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%;
}
.dvg-cross svg { width: 52%; height: 52%; }

/* ══ STREAK STRIP ══ */
.dvg-streak {
  width: 100%;
  max-width: min(90dvw, 330px);
  margin-top: 22px;
  padding: 10px 0 4px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--streak-txt);
  background: transparent;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

/* ══ SCREEN LAYER (overlays, cert, pause etc) ══ */
.dvg-screen {
  display: none;
  position: absolute;
  inset: 0;
  z-index: 100000;
  background: linear-gradient(160deg, var(--over-bg) 0%, var(--bg2) 60%);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  overflow-y: auto;
  overflow-x: hidden;
}
.dvg-screen.on { display: flex; }

/* ══ PAUSE SCREEN ══ */
.dvg-pause-big {
  font-size: 2rem;
  font-weight: 800;
  color: var(--brand);
  margin-bottom: 24px;
}

/* ══ WIN SCREEN ══ */
.dvg-win-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--brand);
  text-align: center;
}
.dvg-win-verse {
  font-size: 1.2rem;
  font-style: italic;
  color: var(--text);
  text-align: center;
  max-width: 300px;
  line-height: 1.6;
  margin: 8px 0 2px;
}
.dvg-win-ref {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--brand);
}
.dvg-win-badge-strip {
  background: var(--btn-bg);
  color: var(--btn-txt);
  border-radius: 10px;
  padding: 10px 22px;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: center;
}
.dvg-row { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

/* ══ BUTTONS ══ */
.dvg-tbtn {
  display: flex; align-items: center; justify-content: center;
  padding: 14px 30px;
  border-radius: 999px;
  border: none;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 52px;
  transition: opacity .15s;
}
.dvg-tbtn:active { opacity: 0.75; }
.dvg-tbtn-primary { background: var(--brand); color: #fff; }
.dvg-tbtn-ghost {
  background: var(--btn-bg);
  color: var(--btn-txt);
  border: 2px solid var(--rule);
}

/* ══ STATS CARD ══ */
.dvg-stats-card {
  background: var(--surface);
  border-radius: 18px;
  padding: 24px 22px;
  width: min(88dvw, 340px);
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1.5px solid var(--rule);
}
.dvg-stats-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--brand);
  text-align: center;
  margin-bottom: 8px;
}
.dvg-stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--rule);
}
.dvg-stats-row:last-child { border-bottom: none; }
.dvg-stats-lbl { font-size: 1.2rem; color: var(--text-mute); }
.dvg-stats-val  { font-size: 1.2rem; font-weight: 800; color: var(--text); }

/* ══ VERSE CARD ══ */
.dvg-verse-card {
  background: var(--surface);
  border-radius: 18px;
  padding: 30px 24px;
  width: min(88dvw, 340px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  border: 1.5px solid var(--rule);
}
.dvg-verse-icon { color: var(--brand); }
.dvg-verse-text {
  font-size: 1.2rem;
  font-style: italic;
  text-align: center;
  line-height: 1.65;
  color: var(--text);
}
.dvg-verse-ref {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--brand);
}

/* ══ NAME PROMPT ══ */
.dvg-name-card {
  background: var(--surface);
  border-radius: 18px;
  padding: 28px 24px;
  width: min(88dvw, 340px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border: 1.5px solid var(--rule);
}
.dvg-name-title { font-size: 1.4rem; font-weight: 800; color: var(--brand); text-align: center; }
.dvg-name-sub   { font-size: 1.2rem; color: var(--text-mute); text-align: center; line-height: 1.5; }
.dvg-name-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 2px solid var(--rule);
  font-size: 1.2rem;
  font-weight: 600;
  background: var(--bg);
  color: var(--text);
  outline: none;
}
.dvg-name-input:focus { border-color: var(--brand); }

/* ══ CERTIFICATE BANNER ══ */
#dv-cert-screen {
  padding: 16px 12px;
  justify-content: flex-start;
}
.dvg-cert-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.dvg-cert-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}
.dvg-cert-url {
  font-size: 1.2rem;
  color: var(--text-mute);
  text-align: center;
  line-height: 1.5;
  overflow-wrap: anywhere;
  word-break: break-all;
}
.dvg-cert-share-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.dvg-share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 1.2rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  min-height: 56px;
  transition: opacity .15s;
}
.dvg-share-btn:active { opacity: 0.75; }
.dvg-share-wa, .dvg-share-fb { width: 56px; border-radius: 50%; color: #fff; flex: none; }
.dvg-share-wa { background: #25D366; }
.dvg-share-fb { background: #1877F2; }
.dvg-share-close {
  flex: 1;
  border-radius: 999px;
  padding: 0 24px;
  background: var(--btn-bg);
  color: var(--btn-txt);
  border: 2px solid var(--rule);
}

/* ══ CONFETTI ══ */
.dvg-confetti {
  position: fixed; z-index: 100001; pointer-events: none;
  border-radius: 3px;
  animation: dvg-fall linear forwards;
}
@keyframes dvg-fall {
  0%   { transform: translateY(-30px) rotate(0deg); opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateY(105dvh) rotate(900deg); opacity: 0; }
}
`;

  /* ══ MARKUP ══ */
  var dvgHTML = `
<div id="dv-bg-w" class="dv-page">

  <!-- CHROME -->
  <div class="dvg-chrome">
    <div class="dvg-btns">
      <button class="dvg-btn on" id="dvg-snd" aria-label="Sound">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>
      </button>
      <button class="dvg-btn" id="dvg-verse-btn" aria-label="Verse">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      </button>
      <button class="dvg-btn" id="dvg-stats-btn" aria-label="Stats">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      </button>
      <button class="dvg-btn" id="dvg-new-btn" aria-label="New Game">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
      </button>
      <button class="dvg-btn" id="dvg-dark-btn" aria-label="Dark Mode">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <button class="dvg-btn" id="dvg-pause-btn" aria-label="Pause">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      </button>
      <button class="dvg-btn" id="dvg-exit-btn" aria-label="Exit">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  </div>

  <!-- HUD -->
  <div class="dvg-hud">
    <div class="dvg-hud-cell">
      <div class="dvg-hud-val" id="dvg-timer">0:00</div>
      <div class="dvg-hud-lbl">Time</div>
    </div>
    <div class="dvg-diff-wrap">
      <div class="dvg-dots" id="dvg-dots"></div>
      <div class="dvg-hud-lbl">Level</div>
    </div>
    <div class="dvg-hud-cell">
      <div class="dvg-hud-val" id="dvg-moves">0</div>
      <div class="dvg-hud-lbl">Moves</div>
    </div>
  </div>

  <!-- BODY -->
  <div class="dvg-body">
    <div class="dvg-subtitle">Slide to Spell JESUS</div>
    <div class="dvg-grid" id="dvg-grid"></div>
    <div class="dvg-streak" id="dvg-streak">&nbsp;</div>
  </div>

  <div class="dvg-credit">&#169; Rev. Chris Johnson</div>

  <!-- ── PAUSE SCREEN ── -->
  <div class="dvg-screen" id="dv-pause-screen">
    <div class="dvg-pause-big">Paused</div>
    <button class="dvg-tbtn dvg-tbtn-primary" id="dvg-resume-btn">Resume</button>
  </div>

  <!-- ── WIN SCREEN ── -->
  <div class="dvg-screen" id="dv-win-screen">
    <div class="dvg-win-title" id="dvg-win-title">Praise God!</div>
    <div class="dvg-win-verse" id="dvg-win-verse"></div>
    <div class="dvg-win-ref"   id="dvg-win-ref"></div>
    <div class="dvg-win-badge-strip" id="dvg-win-badge"></div>
    <div class="dvg-row" style="margin-top:8px;">
      <button class="dvg-tbtn dvg-tbtn-primary" id="dvg-next-btn">Next Puzzle</button>
      <button class="dvg-tbtn dvg-tbtn-ghost"   id="dvg-cert-btn" style="display:none;">View Certificate</button>
    </div>
  </div>

  <!-- ── NAME PROMPT SCREEN ── -->
  <div class="dvg-screen" id="dv-name-screen">
    <div class="dvg-name-card">
      <div class="dvg-name-title">Your Certificate</div>
      <div class="dvg-name-sub">Enter your name to personalise and share your Certificate of Faith.</div>
      <input class="dvg-name-input" id="dvg-name-input" type="text" placeholder="Your full name" maxlength="40" autocomplete="off"/>
      <button class="dvg-tbtn dvg-tbtn-primary" id="dvg-name-confirm-btn" style="width:100%;">Generate Certificate</button>
      <button class="dvg-tbtn dvg-tbtn-ghost"   id="dvg-name-skip-btn"    style="width:100%;">Skip</button>
    </div>
  </div>

  <!-- ── CERTIFICATE SCREEN (banner image) ── -->
  <div class="dvg-screen" id="dv-cert-screen">
    <div class="dvg-cert-box">
      <img class="dvg-cert-img" id="dvg-cert-img" alt="Certificate of Faith">
      <div class="dvg-cert-url" id="dvg-cert-url"></div>
      <div class="dvg-cert-share-row">
        <button class="dvg-share-btn dvg-share-wa" id="dvg-share-wa" aria-label="Share on WhatsApp">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.523 5.854L.057 23.882l6.196-1.624A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 0 1-5.003-1.374l-.36-.214-3.676.964.981-3.585-.234-.369A9.818 9.818 0 1 1 12 21.818z"/></svg>
        </button>
        <button class="dvg-share-btn dvg-share-fb" id="dvg-share-fb" aria-label="Share on Facebook">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
        </button>
        <button class="dvg-share-btn dvg-share-close" id="dvg-cert-close-btn">Close</button>
      </div>
    </div>
  </div>

  <!-- ── STATS SCREEN ── -->
  <div class="dvg-screen" id="dv-stats-screen">
    <div class="dvg-stats-card">
      <div class="dvg-stats-title">Your Stats</div>
      <div class="dvg-stats-row"><span class="dvg-stats-lbl">Total Wins</span><span class="dvg-stats-val" id="dvg-st-wins">0</span></div>
      <div class="dvg-stats-row"><span class="dvg-stats-lbl">Win Streak</span><span class="dvg-stats-val" id="dvg-st-streak">0</span></div>
      <div class="dvg-stats-row"><span class="dvg-stats-lbl">Best Moves</span><span class="dvg-stats-val" id="dvg-st-bmoves">--</span></div>
      <div class="dvg-stats-row"><span class="dvg-stats-lbl">Best Time</span><span class="dvg-stats-val"  id="dvg-st-btime">--</span></div>
      <div class="dvg-stats-row"><span class="dvg-stats-lbl">Level</span><span class="dvg-stats-val"      id="dvg-st-level">1</span></div>
      <div class="dvg-stats-row"><span class="dvg-stats-lbl">Badge</span><span class="dvg-stats-val"      id="dvg-st-badge">--</span></div>
    </div>
    <button class="dvg-tbtn dvg-tbtn-primary" id="dvg-stats-close-btn" style="margin-top:16px;">Close</button>
  </div>

  <!-- ── VERSE SCREEN ── -->
  <div class="dvg-screen" id="dv-verse-screen">
    <div class="dvg-verse-card">
      <div class="dvg-verse-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      </div>
      <div class="dvg-verse-text" id="dvg-verse-txt"></div>
      <div class="dvg-verse-ref"  id="dvg-verse-ref"></div>
    </div>
    <button class="dvg-tbtn dvg-tbtn-primary" id="dvg-verse-close-btn" style="margin-top:16px;">Close</button>
  </div>

</div><!-- end #dv-bg-w -->
`;

  /* ══ INJECT STYLES + MARKUP ══ */
  var dvgStyle = document.createElement('style');
  dvgStyle.textContent = dvgCSS;
  document.head.appendChild(dvgStyle);
  document.querySelector('main.dv-container').insertAdjacentHTML('beforeend', dvgHTML);

  /* ══ CFG ══ */
  var CFG = {
    LS_KEY:       'dvBibleGame_v3',
    CERT_WINS:    7,
    MAX_LEVEL:    5,
    BASE_SWAPS:   100,
    SWAPS_STEP:   60,
    APP_URL:      window.location.href,
    MINISTRY:     'YOUR_MINISTRY_NAME',
    ISSUER:       'YOUR_NAME',
    WHATSAPP:     'YOUR_WHATSAPP_NUMBER',
    EMAIL:        'YOUR_EMAIL',
    ORG_SHORT:    'YOUR_ORGANIZATION_SHORT'
  };

  var BADGES = [
    { wins:1,  label:'Seeker'   },
    { wins:5,  label:'Believer' },
    { wins:10, label:'Disciple' },
    { wins:20, label:'Apostle'  },
    { wins:50, label:'Saint'    }
  ];

  var VERSES = [
    { text:'I can do all things through Christ who strengthens me.',           ref:'Philippians 4:13' },
    { text:'For God so loved the world that He gave His only Son.',            ref:'John 3:16'        },
    { text:'Jesus said: I am the way, the truth, and the life.',               ref:'John 14:6'        },
    { text:'The name of Jesus is above every name.',                           ref:'Philippians 2:9'  },
    { text:'With God all things are possible.',                                ref:'Matthew 19:26'    },
    { text:'The Lord is my shepherd; I shall not want.',                       ref:'Psalm 23:1'       },
    { text:'Be strong and courageous. Do not be afraid.',                      ref:'Joshua 1:9'       },
    { text:'Trust in the Lord with all your heart.',                           ref:'Proverbs 3:5'     }
  ];

  var SOLVED = ['J','E','S','U','S','CROSS','CROSS','CROSS',null];

  /* ══ STATE ══ */
  var S = {
    soundOn:true, darkOn:false,
    tiles:null, paused:false,
    moves:0, seconds:0, timerTick:null,
    level:1, wins:0, streak:0,
    bestMoves:null, bestSec:null,
    lastVerse:null, playerName:'',
    swipeX:0, swipeY:0
  };

  /* ══ HELPERS ══ */
  function G(id){ return document.getElementById(id); }
  function fmt(s){ var m=Math.floor(s/60),r=s%60; return m+':'+(r<10?'0':'')+r; }
  function idxRC(i){ return [Math.floor(i/3), i%3]; }
  function isAdj(a,b){ var ra=idxRC(a),rb=idxRC(b); return Math.abs(ra[0]-rb[0])+Math.abs(ra[1]-rb[1])===1; }
  function rndVerse(){ return VERSES[Math.floor(Math.random()*VERSES.length)]; }
  function badgeFor(w){
    var b=null;
    for(var i=0;i<BADGES.length;i++){ if(w>=BADGES[i].wins) b=BADGES[i].label; }
    return b;
  }
  function hideAll(){
    ['dv-pause-screen','dv-win-screen','dv-name-screen',
     'dv-cert-screen','dv-stats-screen','dv-verse-screen'].forEach(function(id){
      G(id).classList.remove('on');
    });
  }
  function showScreen(id){ hideAll(); G(id).classList.add('on'); }

  /* ══ PERSIST ══ */
  function save(){
    try {
      localStorage.setItem(CFG.LS_KEY, JSON.stringify({
        wins:S.wins, streak:S.streak,
        bestMoves:S.bestMoves, bestSec:S.bestSec,
        level:S.level, darkOn:S.darkOn, soundOn:S.soundOn,
        playerName:S.playerName
      }));
    } catch(e){}
  }
  function load(){
    try {
      var d=JSON.parse(localStorage.getItem(CFG.LS_KEY)||'{}');
      S.wins       = d.wins       || 0;
      S.streak     = d.streak     || 0;
      S.bestMoves  = d.bestMoves  || null;
      S.bestSec    = d.bestSec    || null;
      S.level      = d.level      || 1;
      S.darkOn     = d.darkOn     || false;
      S.soundOn    = d.soundOn !== undefined ? d.soundOn : true;
      S.playerName = d.playerName || '';
    } catch(e){}
  }

  /* ══ AUDIO ══ */
  var actx=null;
  function getCtx(){
    if(!actx) actx=new(window.AudioContext||window.webkitAudioContext)();
    if(actx.state==='suspended') actx.resume();
    return actx;
  }
  function playFlip(){
    if(!S.soundOn) return;
    var ctx=getCtx(), b=ctx.createBuffer(1,ctx.sampleRate*0.06,ctx.sampleRate), d=b.getChannelData(0);
    for(var i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.2);
    var s=ctx.createBufferSource(), g=ctx.createGain();
    s.buffer=b; s.connect(g); g.connect(ctx.destination); g.gain.value=0.5; s.start();
  }
  function playInvalid(){
    if(!S.soundOn) return;
    var ctx=getCtx(), o=ctx.createOscillator(), g=ctx.createGain();
    o.connect(g); g.connect(ctx.destination); o.type='sine'; o.frequency.value=130;
    var t=ctx.currentTime;
    g.gain.setValueAtTime(0.3,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
    o.start(t); o.stop(t+0.18);
  }
  function playChime(freqs, wave, vol){
    if(!S.soundOn) return;
    var ctx=getCtx();
    freqs.forEach(function(f,i){
      var o=ctx.createOscillator(), g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.type=wave||'sine'; o.frequency.value=f;
      var t=ctx.currentTime+i*0.14;
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol||0.35,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.32);
      o.start(t); o.stop(t+0.32);
    });
  }
  function playVictory(){ playChime([523,659,784,1047,1319,1047,1319,1568],'sine',0.38); }
  function playBadge(){   playChime([784,988,1175],'triangle',0.4); }

  /* ══ CONFETTI ══ */
  function confetti(){
    var cols=['#ffd700','#c0c0c0','#4a0e4e','#1877F2','#ff6b6b','#51cf66','#ff922b'];
    for(var i=0;i<90;i++){
      var p=document.createElement('div');
      p.className='dvg-confetti';
      var dur=1.6+Math.random()*1.6, sz=8+Math.random()*10;
      p.style.cssText='left:'+(Math.random()*100)+'dvw;top:-30px;background:'+cols[i%cols.length]+';width:'+sz+'px;height:'+(sz*(0.6+Math.random()*0.8))+'px;border-radius:'+(Math.random()>0.4?'50%':'3px')+';animation-duration:'+dur+'s;animation-delay:'+(Math.random()*0.8)+'s;';
      document.body.appendChild(p);
      setTimeout(function(){ p.remove(); },(dur+0.9)*1000);
    }
  }

  /* ══ CROSS SVG ══ */
  function crossSVG(){
    return '<div class="dvg-cross"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="3" x2="12" y2="21"/><line x1="5" y1="8" x2="19" y2="8"/></svg></div>';
  }

  /* ══ TIMER ══ */
  function startTimer(){
    stopTimer();
    S.timerTick=setInterval(function(){
      if(!S.paused){ S.seconds++; G('dvg-timer').textContent=fmt(S.seconds); }
    },1000);
  }
  function stopTimer(){ if(S.timerTick){ clearInterval(S.timerTick); S.timerTick=null; } }

  /* ══ DOTS ══ */
  function renderDots(){
    var el=G('dvg-dots'); el.innerHTML='';
    for(var i=1;i<=CFG.MAX_LEVEL;i++){
      var d=document.createElement('div');
      d.className='dvg-dot'+(i<=S.level?' on':'');
      el.appendChild(d);
    }
  }

  /* ══ STREAK ══ */
  function renderStreak(){
    var b=badgeFor(S.wins);
    var el=G('dvg-streak');
    if(S.wins>0){
      el.textContent=(b?b+' · ':'')+S.wins+' win'+(S.wins!==1?'s':'')+' · Streak '+S.streak;
    } else {
      el.textContent='\u00a0';
    }
  }

  /* ══ DARK / SOUND UI ══ */
  function applyDark(){
    var c=G('dv-bg-w');
    c.classList.toggle('dv-dark',S.darkOn);
    G('dvg-dark-btn').classList.toggle('on',S.darkOn);
  }
  function applySound(){
    G('dvg-snd').classList.toggle('on',S.soundOn);
  }

  /* ══ PUZZLE ══ */
  /* fit the board to the space that is really available (never clipped top or bottom) */
  function fitGrid(){
    var b=document.querySelector('#dv-bg-w .dvg-body');
    if(!b||!b.clientHeight) return;
    var sub=b.querySelector('.dvg-subtitle'), st=G('dvg-streak');
    var used=sub.offsetHeight+parseFloat(getComputedStyle(sub).marginBottom)+st.offsetHeight+22+20;
    var w=Math.min(b.clientWidth*0.9,330,b.clientHeight-used);
    G('dvg-grid').style.width=Math.max(120,Math.floor(w))+'px';
  }
  window.addEventListener('resize',fitGrid);

  function newRound(){
    S.moves=0; S.seconds=0; S.paused=false;
    G('dvg-moves').textContent='0';
    G('dvg-timer').textContent='0:00';
    hideAll();

    var arr=SOLVED.slice(), blank=arr.indexOf(null);
    var swaps=CFG.BASE_SWAPS+(S.level-1)*CFG.SWAPS_STEP;
    for(var m=0;m<swaps;m++){
      var nb=[];
      for(var i=0;i<9;i++){ if(isAdj(i,blank)) nb.push(i); }
      var pick=nb[Math.floor(Math.random()*nb.length)];
      arr[blank]=arr[pick]; arr[pick]=null; blank=pick;
    }
    if(arr.join('')===SOLVED.join('')){
      var nb2=[];
      for(var j=0;j<9;j++){ if(isAdj(j,blank)) nb2.push(j); }
      var pp=nb2[0]; arr[blank]=arr[pp]; arr[pp]=null;
    }
    S.tiles=arr;
    renderGrid(); renderDots(); renderStreak(); startTimer();
    fitGrid();
  }

  function renderGrid(glow){
    var grid=G('dvg-grid'); grid.innerHTML='';
    S.tiles.forEach(function(val,i){
      var el=document.createElement('div');
      el.className='dvg-tile'+(val===null?' blank':'')+(glow?' glow':'');
      if(val==='CROSS') el.innerHTML=crossSVG();
      else el.textContent=val||'';
      el.addEventListener('click',function(){ tapTile(i); });
      grid.appendChild(el);
    });
    attachSwipe(grid);
  }

  function tapTile(i){
    if(S.paused||G('dv-pause-screen').classList.contains('on')) return;
    var blank=S.tiles.indexOf(null);
    if(!isAdj(i,blank)||S.tiles[i]===null){ playInvalid(); return; }
    playFlip();
    S.tiles[blank]=S.tiles[i]; S.tiles[i]=null;
    S.moves++; G('dvg-moves').textContent=S.moves;
    renderGrid(); checkWin();
  }

  function checkWin(){
    if(S.tiles.join('')!==SOLVED.join('')) return;
    stopTimer(); renderGrid(true); confetti();
    S.wins++; S.streak++;
    if(S.bestMoves===null||S.moves<S.bestMoves) S.bestMoves=S.moves;
    if(S.bestSec===null||S.seconds<S.bestSec)   S.bestSec=S.seconds;
    S.level=Math.min(CFG.MAX_LEVEL,1+Math.floor(S.wins/3));
    var badge=badgeFor(S.wins), verse=rndVerse();
    S.lastVerse=verse;
    playVictory();
    if(badge) setTimeout(playBadge,1200);
    save(); renderStreak();

    var title=S.streak>=3?'Hallelujah! '+S.streak+' in a row!':'Praise God!';
    G('dvg-win-title').textContent=title;
    G('dvg-win-verse').textContent=verse.text;
    G('dvg-win-ref').textContent='— '+verse.ref;
    G('dvg-win-badge').textContent=badge
      ?'Badge Unlocked: '+badge+' · '+S.wins+' wins'
      :S.wins+' win'+(S.wins!==1?'s':'')+' · Streak '+S.streak;

    // cert button only at 7+ wins
    G('dvg-cert-btn').style.display=S.wins>=CFG.CERT_WINS?'':'none';
    showScreen('dv-win-screen');
  }

  /* ══ SWIPE ══ */
  function attachSwipe(grid){
    grid.addEventListener('touchstart',function(e){
      S.swipeX=e.changedTouches[0].clientX;
      S.swipeY=e.changedTouches[0].clientY;
    },{passive:true});
    grid.addEventListener('touchend',function(e){
      var dx=e.changedTouches[0].clientX-S.swipeX;
      var dy=e.changedTouches[0].clientY-S.swipeY;
      if(Math.abs(dx)<12&&Math.abs(dy)<12) return;
      var blank=S.tiles.indexOf(null);
      var br=Math.floor(blank/3), bc=blank%3, target=-1;
      if(Math.abs(dx)>Math.abs(dy)){
        if(dx>0&&bc>0) target=blank-1;
        if(dx<0&&bc<2) target=blank+1;
      } else {
        if(dy>0&&br>0) target=blank-3;
        if(dy<0&&br<2) target=blank+3;
      }
      if(target>=0&&S.tiles[target]!==null){
        playFlip();
        S.tiles[blank]=S.tiles[target]; S.tiles[target]=null;
        S.moves++; G('dvg-moves').textContent=S.moves;
        renderGrid(); checkWin();
      }
    },{passive:true});
  }

  /* ══ CERTIFICATE ══ */
  function openCert(){
    if(S.playerName){
      buildCert(); showScreen('dv-cert-screen');
    } else {
      showScreen('dv-name-screen');
      G('dvg-name-input').value='';
      setTimeout(function(){ G('dvg-name-input').focus(); },200);
    }
  }

  function urlLines(){
    var u=window.location.origin+window.location.pathname;
    var m=/^(https?:\/\/[^\/]+)(.*)$/.exec(u);
    return m?{a:m[1],b:m[2]||'/'}:{a:u,b:''};
  }
  function wrapText(x,text,maxW){
    var words=text.split(' '),lines=[],line='';
    for(var i=0;i<words.length;i++){
      var t=line?line+' '+words[i]:words[i];
      if(x.measureText(t).width>maxW&&line){ lines.push(line); line=words[i]; } else line=t;
    }
    if(line) lines.push(line);
    return lines;
  }
  function drawCert(cb){
    var W=1200,H=900,c=document.createElement('canvas');
    c.width=W; c.height=H;
    var x=c.getContext('2d');
    var bg='#fffdf2',frame='#c8a000',txt='#2a1a00',mute='#7a5200',brand='#1877F2';
    x.fillStyle=bg; x.fillRect(0,0,W,H);
    x.strokeStyle=frame; x.lineWidth=6; x.strokeRect(24,24,W-48,H-48);
    x.lineWidth=2; x.globalAlpha=0.6; x.strokeRect(42,42,W-84,H-84); x.globalAlpha=1;
    x.lineWidth=5; x.lineCap='round';
    [[70,70],[W-70,70],[70,H-70],[W-70,H-70]].forEach(function(p){
      x.beginPath(); x.moveTo(p[0],p[1]-26); x.lineTo(p[0],p[1]+26); x.moveTo(p[0]-18,p[1]-8); x.lineTo(p[0]+18,p[1]-8); x.stroke();
    });
    x.globalAlpha=0.07; x.lineWidth=10;
    x.beginPath(); x.arc(W/2,H/2,250,0,Math.PI*2); x.stroke();
    x.beginPath(); x.moveTo(W/2,H/2-250); x.lineTo(W/2,H/2+250); x.moveTo(W/2-150,H/2-110); x.lineTo(W/2+150,H/2-110); x.stroke();
    x.globalAlpha=1;
    x.textAlign='center'; x.textBaseline='top';
    function T(s,y,font,col){ x.font=font; x.fillStyle=col; x.fillText(s,W/2,y); }
    function R(y,dbl){
      x.strokeStyle=frame; x.lineWidth=3; x.globalAlpha=0.7;
      x.beginPath(); x.moveTo(W*0.2,y); x.lineTo(W*0.8,y); x.stroke();
      if(dbl){ x.beginPath(); x.moveTo(W*0.2,y+10); x.lineTo(W*0.8,y+10); x.stroke(); }
      x.globalAlpha=1;
    }
    var badge=(badgeFor(S.wins)||'Faithful Player').toUpperCase();
    var name=S.playerName||'Faithful Player';
    T(CFG.MINISTRY.toUpperCase(),92,'bold 36px Roboto, sans-serif',frame);
    T('Certificate of Faith',146,'bold 84px Roboto, sans-serif',txt);
    R(250,true);
    T('This certificate is proudly presented to',282,'italic 34px Roboto, sans-serif',mute);
    var size=88;
    for(;size>=36;size-=2){ x.font='bold '+size+'px Roboto, sans-serif'; if(x.measureText(name).width<=960) break; }
    T(name,334,'bold '+size+'px Roboto, sans-serif',brand);
    R(450,false);
    x.font='36px Roboto, sans-serif'; x.fillStyle=txt;
    wrapText(x,'For completing the JESUS Slide Puzzle and earning the faith badge of',940).forEach(function(l,i){ x.fillText(l,W/2,476+i*48); });
    T(badge,582,'bold 72px Roboto, sans-serif',frame);
    R(690,true);
    T('Presented by: Rev. Chris Johnson, PhD',722,'bold 40px Roboto, sans-serif',txt);
    T('Date issued: '+new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),780,'34px Roboto, sans-serif',mute);
    c.toBlob(cb,'image/png');
  }
  function buildCert(){
    drawCert(function(blob){
      if(!blob) return;
      if(S.certUrl) URL.revokeObjectURL(S.certUrl);
      S.certBlob=blob; S.certUrl=URL.createObjectURL(blob);
      G('dvg-cert-img').src=S.certUrl;
    });
    var u=urlLines();
    G('dvg-cert-url').innerHTML=u.a+'<br>'+u.b;
  }

  function shareMsg(){
    var badge=badgeFor(S.wins)||'Faithful Player';
    var name=S.playerName||'A Faithful Player';
    return name+' just earned the "'+badge+'" badge on the JESUS Slide Puzzle!\n'
      +'Can you beat my score? '+S.wins+' wins · Best time: '+(S.bestSec!==null?fmt(S.bestSec):'--')+'.\n'
      +'Play free: '+CFG.APP_URL+'\n'
      +'— '+CFG.MINISTRY+' by '+CFG.ISSUER;
  }

  /* ══ BINDINGS ══ */
  G('dvg-snd').addEventListener('click',function(){
    S.soundOn=!S.soundOn; applySound(); save();
  });
  G('dvg-dark-btn').addEventListener('click',function(){
    S.darkOn=!S.darkOn; applyDark(); save();
  });
  G('dvg-new-btn').addEventListener('click',function(){
    stopTimer(); newRound();
  });
  G('dvg-pause-btn').addEventListener('click',function(){
    S.paused=true; showScreen('dv-pause-screen');
  });
  G('dvg-exit-btn').addEventListener('click',function(){
    stopTimer(); save();
    S.tiles=null; S.moves=0; S.seconds=0;
    hideAll();
    DV.navigate('');
  });
  G('dvg-resume-btn').addEventListener('click',function(){
    S.paused=false; hideAll();
  });
  
  G('dvg-stats-btn').addEventListener('click',function(){
    G('dvg-st-wins').textContent   = S.wins;
    G('dvg-st-streak').textContent = S.streak;
    G('dvg-st-bmoves').textContent = S.bestMoves!==null?S.bestMoves:'--';
    G('dvg-st-btime').textContent  = S.bestSec!==null?fmt(S.bestSec):'--';
    G('dvg-st-level').textContent  = S.level;
    G('dvg-st-badge').textContent  = badgeFor(S.wins)||'--';
    S.paused=true; showScreen('dv-stats-screen');
  });
  G('dvg-stats-close-btn').addEventListener('click',function(){
    S.paused=false; hideAll();
  });
  G('dvg-verse-btn').addEventListener('click',function(){
    var v=rndVerse();
    G('dvg-verse-txt').textContent=v.text;
    G('dvg-verse-ref').textContent='— '+v.ref;
    S.paused=true; showScreen('dv-verse-screen');
  });
  G('dvg-verse-close-btn').addEventListener('click',function(){
    S.paused=false; hideAll();
  });
  G('dvg-next-btn').addEventListener('click',function(){ newRound(); });
  G('dvg-cert-btn').addEventListener('click',function(){ openCert(); });

  G('dvg-name-confirm-btn').addEventListener('click',function(){
    var n=(G('dvg-name-input').value||'').trim();
    if(!n){ G('dvg-name-input').focus(); return; }
    S.playerName=n; save(); buildCert(); showScreen('dv-cert-screen');
  });
  G('dvg-name-skip-btn').addEventListener('click',function(){
    S.playerName='Faithful Player'; buildCert(); showScreen('dv-cert-screen');
  });

  G('dvg-cert-close-btn').addEventListener('click',function(){ hideAll(); });

  G('dvg-share-wa').addEventListener('click',function(){
    if(S.certBlob&&window.File&&navigator.canShare){
      var f=new File([S.certBlob],'certificate-of-faith.png',{type:'image/png'});
      if(navigator.canShare({files:[f]})){ navigator.share({files:[f],text:shareMsg()}).catch(function(){}); return; }
    }
    window.open('https://wa.me/?text='+encodeURIComponent(shareMsg()),'_blank');
  });
  G('dvg-share-fb').addEventListener('click',function(){
    var url='https://www.facebook.com/sharer/sharer.php?quote='+encodeURIComponent(shareMsg())+'&u='+encodeURIComponent(CFG.APP_URL);
    window.open(url,'_blank');
  });

  /* ══ REGISTER WITH THE SHELL (bottom-nav button + route) ══ */
  function openGame(){
    load(); applyDark(); applySound();
    if(!S.tiles) newRound();
    else S.paused=!!document.querySelector('#dv-bg-w .dvg-screen.on');
    requestAnimationFrame(fitGrid);
  }
  function closeGame(){
    S.paused=true;
  }

  DV.addRightItem({
    key: 'game_mod',
    label: 'Game',
    route: 'game',
    order: 10,
    icon: '<rect x="2" y="6" width="20" height="12" rx="4"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="11" r="1"/><circle cx="18" cy="13" r="1"/>'
  });
  DV.addPage('game', 'dv-bg-w', {
    title: 'JESUS Slide Puzzle',
    description: 'Slide the tiles to spell JESUS. Earn faith badges and a Certificate of Faith.',
    navNone: true,
    open: openGame,
    close: closeGame
  });
  if (DV.addQuickAction) DV.addQuickAction({
    label: 'Game',
    route: 'game',
    order: 30,
    icon: '<rect x="2" y="6" width="20" height="12" rx="4"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="11" r="1"/><circle cx="18" cy="13" r="1"/>'
  });

  } catch (e) {}
})();
