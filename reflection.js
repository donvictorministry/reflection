/* =====================================================================
   REFLECTION MODULE — daily reflections (grid + one unique URL each).
   Independent module: delete this file (and its script tag) and the app
   keeps working (the Reflection tab simply disappears). Talks to the shell
   only via DV. Owns its own styles, markup, nav button and routes.

   Each reflection opens at its own link:  /reflection-realign-today

   HOW TO PUBLISH: 20 ready-made hidden reflections (show: false) are in the list below.
   Edit one (title, date, text) and change show: false to show: true.
   Or add a new block at the TOP of
   dvReflections below. Block types:
     { t:'h', x:'Subtitle' }                      subtitle
     { t:'p', x:'Paragraph ==highlighted== text' }  paragraph (==...== = highlight)
     { t:'q', x:'Scripture text', r:'Reference' }  scripture quote
   ===================================================================== */
(function() {
  try {
    if (!window.DV) return;

    /* ===== CONTACT (call-to-action buttons) ===== */
    var dvRefCTA = {
      email: 'info@biblefirm.example.com',
      phone: '+2347000000000',
      whatsapp: '2347000000000',
      facebook: 'https://facebook.com/biblefirm'
    };

    /* ===== REFLECTIONS (newest first; date = YYYY-MM-DD) ===== */
    var dvReflections = [
      {
        slug: 'realign-today',
        show: true,
        title: 'Realign Today',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-10-08',
        body: [
          { t:'p', x:'Every morning, we have a choice to make about how we will live our day. We can choose to live in faith, happiness, and expectation of God\'s favor, or allow discouragement, defeat, and life\'s challenges to shape our outlook. Although we cannot always control what happens to us, we can choose how we respond to it.' },
          { t:'hl', x:'The choice is ours!' },
          { t:'h', x:'Hold On to Hope' },
          { t:'p', x:'As the year gradually winds down, many people will become increasingly desperate for money, including some churchgoers. The pressure to meet financial needs and achieve year end goals can cause people to become anxious and discouraged. However, people and circumstances will always change. Do not allow your present financial situation to convince you that you will remain in the dark forever.' },
          { t:'hl', x:'Instead, continue to trust God, stand firm in His Word, and remain hopeful about what lies ahead.' },
          { t:'p', x:'I encourage you today to apply God\'s Word to your life, live by faith, and keep your focus on what truly matters.' },
          { t:'h', x:'The Word Is Your Foundation' },
          { t:'p', x:'The Word of God must remain your foundation. Seeking solutions to life\'s problems without sufficiently feeding on God\'s Word is like treating the symptoms of an illness without diagnosing its underlying cause. God\'s Word provides wisdom, direction, and spiritual understanding to help you make sound decisions, strengthen your faith, and navigate life\'s challenges. Therefore, never allow the pursuit of solutions to distract you from the Word that guides your life.' },
          { t:'p', x:'The Word of God says:' },
          { t:'q', x:'While we look not at the things which are seen, but at the things which are not seen: for the things which are seen are temporal; but the things which are not seen are eternal.', r:'2 Corinthians 4:18 (KJV)' },
          { t:'h', x:'Your Story Is Not Over' },
          { t:'p', x:'No matter what you are going through, I encourage you to hold on to God!' },
          { t:'hl', x:'Your present condition is not the end of your story, and your current challenges do not determine how your story must end.' },
          { t:'p', x:'Stand firm on God\'s promises, remain steadfast in faith, and trust Him to guide you through your challenges and lead you forward.' },
          { t:'h', x:'Let\'s Connect' },
          { t:'p', x:'I trust this has ministered to your heart. If you are in need of mentorship, spiritual guidance, prayer, or counsel, I am available to support you.' },
          { t:'p', x:'Simply visit my appointment portal and submit your details. I will respond as soon as possible.' },
          { t:'p', x:'God bless you abundantly.' }
        ]
      },
      {
        slug: 'reflection-1',
        show: false,   // change to true to publish
        title: 'Reflection Title 1',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-10-07',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-2',
        show: false,   // change to true to publish
        title: 'Reflection Title 2',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-10-06',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-3',
        show: false,   // change to true to publish
        title: 'Reflection Title 3',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-10-05',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-4',
        show: false,   // change to true to publish
        title: 'Reflection Title 4',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-10-04',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-5',
        show: false,   // change to true to publish
        title: 'Reflection Title 5',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-10-03',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-6',
        show: false,   // change to true to publish
        title: 'Reflection Title 6',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-10-02',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-7',
        show: false,   // change to true to publish
        title: 'Reflection Title 7',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-10-01',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-8',
        show: false,   // change to true to publish
        title: 'Reflection Title 8',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-30',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-9',
        show: false,   // change to true to publish
        title: 'Reflection Title 9',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-29',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-10',
        show: false,   // change to true to publish
        title: 'Reflection Title 10',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-28',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-11',
        show: false,   // change to true to publish
        title: 'Reflection Title 11',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-27',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-12',
        show: false,   // change to true to publish
        title: 'Reflection Title 12',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-26',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-13',
        show: false,   // change to true to publish
        title: 'Reflection Title 13',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-25',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-14',
        show: false,   // change to true to publish
        title: 'Reflection Title 14',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-24',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-15',
        show: false,   // change to true to publish
        title: 'Reflection Title 15',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-23',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-16',
        show: false,   // change to true to publish
        title: 'Reflection Title 16',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-22',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-17',
        show: false,   // change to true to publish
        title: 'Reflection Title 17',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-21',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-18',
        show: false,   // change to true to publish
        title: 'Reflection Title 18',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-20',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-19',
        show: false,   // change to true to publish
        title: 'Reflection Title 19',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-19',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      },
      {
        slug: 'reflection-20',
        show: false,   // change to true to publish
        title: 'Reflection Title 20',
        author: 'Rev. Chris Johnson, PhD',
        date: '2026-09-18',
        body: [
          { t:'p', x:'Write your opening paragraph here.' },
          { t:'hl', x:'Write your key highlighted sentence here.' },
          { t:'h', x:'Subtitle goes here' },
          { t:'p', x:'Write your next paragraph here.' },
          { t:'q', x:'Scripture text goes here.', r:'Book 1:1 (KJV)' },
          { t:'p', x:'Write your closing paragraph here.' }
        ]
      }
    ];

    // Only reflections with  show: true  appear in the app. Reflections with  show: false  stay hidden.
    dvReflections = dvReflections.filter(function(r) { return r.show === true; });

    var dvRefPrefix = 'reflection-';
    var dvRefShown = 12, dvRefCur = null;

    /* ===== HELPERS ===== */
    function dvQ(s) { return document.querySelector(s); }
    function dvEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function dvRefFmt(s) { return dvEsc(s).replace(/==(.+?)==/g, '<span class="dv-ref-hl">$1</span>'); }
    function dvRefDate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
    function dvRefSorted() { return dvReflections.slice().sort(function(a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); }); }
    function dvRefFind(slug) { for (var i = 0; i < dvReflections.length; i++) { if (dvReflections[i].slug === slug) return dvReflections[i]; } return null; }
    function dvRefPlain(r) { var o = ''; r.body.forEach(function(b) { if (b.t === 'p' && !o) o = b.x.replace(/==/g, ''); }); return o; }

    /* ===== STYLES ===== */
    var css = '' +
      '#dvPageReflection [hidden]{display:none !important}' +
      '.dv-ref-search{display:flex;align-items:center;gap:10px;background:var(--dv-surface);border-radius:999px;padding:0 18px;min-height:56px;margin-bottom:12px;box-shadow:var(--dv-shadow);color:var(--dv-text-sub)}' +
      '.dv-ref-search input{flex:1;min-width:0;border:none;outline:none;background:transparent;color:var(--dv-text);font-size:1.1rem;font-family:inherit}' +
      '.dv-ref-list{display:flex;flex-direction:column;gap:8px}' +
      '.dv-ref-card{display:flex;gap:14px;align-items:flex-start;width:100%;background:var(--dv-surface);border:none;border-radius:12px;padding:14px;text-align:left;font-family:inherit;color:var(--dv-text);cursor:pointer}' +
      '.dv-ref-card:active{background:var(--dv-bg)}' +
      '.dv-ref-av{flex:none;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.5rem;font-weight:500}' +
      '.dv-ref-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}' +
      '.dv-ref-line1,.dv-ref-line3{display:flex;align-items:center;justify-content:space-between;gap:8px}' +
      '.dv-ref-title{flex:1;min-width:0;font-size:1.2rem;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.dv-ref-date{flex:none;font-size:1rem;font-weight:700}' +
      '.dv-ref-by{font-size:1.1rem;font-weight:700;color:#1877F2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.dv-ref-snip{flex:1;min-width:0;font-size:1.1rem;color:var(--dv-text-sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.dv-ref-star{flex:none;width:44px;height:44px;margin:-8px -6px -8px 0;display:flex;align-items:center;justify-content:center;color:var(--dv-text-sub)}' +
      '.dv-ref-star.dv-on{color:#FFD700}' +
      '.dv-ref-back{margin-bottom:12px;width:auto;flex:none}' +
      '.dv-ref-view-title{font-size:1.6rem;font-weight:800;line-height:1.25;color:#000;margin:0 0 22px}[data-dv-dark="1"] .dv-ref-view-title{color:#fff}' +
      '.dv-ref-body{position:relative;overflow:hidden;font-size:1.1rem;line-height:1.8rem;color:var(--dv-text)}' +
      '.dv-ref-body.dv-clamp{max-height:calc(3 * 1.8rem)}' +
      '.dv-ref-body.dv-clamp::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2rem;background:linear-gradient(to bottom,transparent,var(--dv-surface))}' +
      '.dv-ref-body h4{font-size:1.25rem;font-weight:800;margin:1.1rem 0 .2rem;padding-left:10px;border-left:4px solid var(--dv-primary);line-height:1.8rem}' +
      '.dv-ref-body p{margin:0 0 .9rem}' +
      '.dv-ref-body blockquote{margin:.2rem 0 1rem;padding:10px 14px;border-left:4px solid var(--dv-primary);background:var(--dv-bg);border-radius:0 10px 10px 0;font-style:italic}' +
      '.dv-ref-body cite{display:block;margin-top:6px;font-style:normal;font-weight:700;color:var(--dv-primary)}' +
      '.dv-ref-body p.dv-ref-hl{background:#FFD700;color:#000;font-weight:400;padding:4px 10px;border-radius:8px;border-left:6px solid #000;margin:0 0 .9rem}' +
      '.dv-ref-more{background:none;border:none;color:var(--dv-primary);font-weight:700;font-size:1rem;font-family:inherit;cursor:pointer;padding:10px 0;display:block;margin:0 auto}' +
      '.dv-ref-row{display:flex;flex-wrap:wrap;gap:10px}.dv-ref-row .dv-btn{min-width:110px}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    /* ===== ICONS ===== */
    var icoMail = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
    var icoPhone = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.13 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012.07 1h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>';
    var icoWa = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
    var icoFb = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
    var icoShare = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
    var icoBt = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/></svg>';
    var icoCopy = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

    /* ===== MARKUP ===== */
    document.querySelector('main.dv-container').insertAdjacentHTML('beforeend',
      '<section class="dv-page" id="dvPageReflection">' +
        '<div id="dvRefList">' +
          '<div class="dv-ref-search"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input id="dvRefSearch" type="search" placeholder="Search in reflections"></div>' +
          '<div class="dv-ref-list" id="dvRefGrid"></div>' +
          '<button class="dv-btn dv-btn-secondary dv-btn-full" id="dvRefMore" style="margin-top:14px;" hidden>Show more</button>' +
        '</div>' +
        '<div id="dvRefView" hidden></div>' +
      '</section>');

    /* ===== LIST (grid) ===== */
    var dvAvColors = ['#7986CB', '#F6BF26', '#4DD0E1', '#E67C73', '#33B679', '#8E24AA', '#F4511E'];
    var dvStarIco = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    function dvStars() { try { return JSON.parse(localStorage.getItem('dvRefStars') || '[]'); } catch (e) { return []; } }
    function dvRefShowList() {
      dvQ('#dvRefView').hidden = true;
      dvQ('#dvRefList').hidden = false;
      dvRefRender();
    }
    function dvRefRender() {
      var q = dvQ('#dvRefSearch').value.trim().toLowerCase(), stars = dvStars();
      var all = dvRefSorted().filter(function(r) { return !q || (r.title + ' ' + r.author + ' ' + dvRefPlain(r)).toLowerCase().indexOf(q) !== -1; });
      var h = '';
      all.slice(0, dvRefShown).forEach(function(r) {
        var sum = 0; for (var i = 0; i < r.title.length; i++) sum += r.title.charCodeAt(i);
        h += '<button class="dv-ref-card" data-dvslug="' + dvEsc(r.slug) + '">' +
          '<span class="dv-ref-av" style="background:' + dvAvColors[sum % dvAvColors.length] + '">' + dvEsc(r.title.charAt(0).toUpperCase()) + '</span>' +
          '<span class="dv-ref-main">' +
            '<span class="dv-ref-line1"><span class="dv-ref-title">' + dvEsc(r.title) + '</span><span class="dv-ref-date">' + new Date(r.date + 'T00:00:00').toLocaleDateString('en-US') + '</span></span>' +
            '<span class="dv-ref-by">' + dvEsc(r.author) + '</span>' +
            '<span class="dv-ref-line3"><span class="dv-ref-snip">' + dvEsc(dvRefPlain(r)) + '</span><span class="dv-ref-star' + (stars.indexOf(r.slug) !== -1 ? ' dv-on' : '') + '" data-dvstar="' + dvEsc(r.slug) + '">' + dvStarIco + '</span></span>' +
          '</span>' +
        '</button>';
      });
      dvQ('#dvRefGrid').innerHTML = h || '<div class="dv-empty"><div class="dv-empty-text">No reflections found.</div></div>';
      dvQ('#dvRefMore').hidden = all.length <= dvRefShown;
    }

    /* ===== READING VIEW ===== */
    function dvRefShowView(r) {
      dvRefCur = r;
      var body = '';
      r.body.forEach(function(b) {
        if (b.t === 'h') body += '<h4>' + dvEsc(b.x) + '</h4>';
        else if (b.t === 'hl') body += '<p class="dv-ref-hl">' + dvEsc(b.x) + '</p>';
        else if (b.t === 'q') body += '<blockquote>\u201C' + dvEsc(b.x) + '\u201D<cite>' + dvEsc(b.r || '') + '</cite></blockquote>';
        else body += '<p>' + dvRefFmt(b.x) + '</p>';
      });
      body += '<div class="dv-ref-author">By ' + dvEsc(r.author) + '</div>';
      dvQ('#dvRefView').innerHTML =
        '<button class="dv-btn dv-btn-secondary dv-ref-back" id="dvRefBack">&#8249; All Reflections</button>' +
        '<div class="dv-card">' +
          '<div class="dv-ref-view-title">' + dvEsc(r.title) + '</div>' +
          '<div class="dv-ref-body dv-clamp" id="dvRefBody">' + body + '</div>' +
          '<button class="dv-ref-more" id="dvRefToggle" hidden>Show more</button>' +
        '</div>' +
        '<div id="dvRefExtra">' +
        '<div class="dv-card">' +
          '<div class="dv-card-title">Reach Out</div>' +
          '<div class="dv-contact-row">' +
            '<button class="dv-contact-btn dv-email" data-dvcta="email" aria-label="Email">' + icoMail + '</button>' +
            '<button class="dv-contact-btn dv-wa" data-dvcta="whatsapp" aria-label="WhatsApp">' + icoWa + '</button>' +
            '<button class="dv-contact-btn dv-fb" data-dvcta="facebook" aria-label="Facebook">' + icoFb + '</button>' +
            '<button class="dv-contact-btn dv-phone" data-dvcta="phone" aria-label="Phone">' + icoPhone + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="dv-card">' +
          '<div class="dv-card-title">Share This Reflection</div>' +
          '<div class="dv-ref-row">' +
            '<button class="dv-btn dv-btn-primary" id="dvRefShare">' + icoShare + 'Share</button>' +
            '<button class="dv-btn dv-btn-secondary" id="dvRefBt">' + icoBt + 'Bluetooth</button>' +
            '<button class="dv-btn dv-btn-secondary" id="dvRefImg">Picture</button>' +
          '</div>' +
        '</div>' +
        '</div>';
      dvQ('#dvRefList').hidden = true;
      dvQ('#dvRefView').hidden = false;
      requestAnimationFrame(function() {
        var bodyEl = dvQ('#dvRefBody'), tg = dvQ('#dvRefToggle');
        if (!bodyEl || !tg) return;
        if (bodyEl.scrollHeight <= bodyEl.clientHeight + 2) { bodyEl.classList.remove('dv-clamp'); tg.hidden = true; return; }
        tg.hidden = false;
      });
    }

    /* ===== SHARE AS PICTURE ===== */
    function dvWrap(x, text, maxW) {
      var words = text.split(' '), lines = [], line = '';
      for (var i = 0; i < words.length; i++) {
        var t = line ? line + ' ' + words[i] : words[i];
        if (x.measureText(t).width > maxW && line) { lines.push(line); line = words[i]; } else line = t;
      }
      if (line) lines.push(line);
      return lines;
    }
    function dvRefImage(r, cb) {
      var W = 1080, H = 1080, c = document.createElement('canvas');
      c.width = W; c.height = H;
      var x = c.getContext('2d'), cs = getComputedStyle(document.documentElement);
      var p1 = cs.getPropertyValue('--dv-primary').trim() || '#1877F2', p2 = cs.getPropertyValue('--dv-primary-dark').trim() || '#0D5DBD';
      var g = x.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, p1); g.addColorStop(1, p2);
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'top';
      x.globalAlpha = 0.85; x.font = 'bold 36px Roboto, sans-serif'; x.fillText('DAILY REFLECTION', W / 2, 90); x.globalAlpha = 1;
      var ts = 72;
      for (; ts >= 40; ts -= 2) { x.font = 'bold ' + ts + 'px Roboto, sans-serif'; if (dvWrap(x, r.title, 900).length <= 2) break; }
      var y = 170;
      dvWrap(x, r.title, 900).forEach(function(l) { x.fillText(l, W / 2, y); y += Math.round(ts * 1.25); });
      var key = '';
      r.body.forEach(function(b) { if (!key && b.t === 'hl') key = b.x; });
      if (!key) key = dvRefPlain(r);
      if (key.length > 260) key = key.slice(0, 257) + '...';
      var q = '\u201C' + key + '\u201D', size = 52, lh = 72, lines = [];
      for (; size >= 28; size -= 2) {
        x.font = 'italic ' + size + 'px Roboto, sans-serif';
        lh = Math.round(size * 1.4);
        lines = dvWrap(x, q, 860);
        if (lines.length * lh <= 430) break;
      }
      y += 40;
      lines.forEach(function(l, i) { x.fillText(l, W / 2, y + i * lh); });
      x.font = 'bold 40px Roboto, sans-serif'; x.fillText('\u2014 ' + r.author, W / 2, 880);
      x.globalAlpha = 0.85; x.font = '32px Roboto, sans-serif';
      x.fillText('Reflect & Align', W / 2, 950); x.fillText(window.location.host, W / 2, 994);
      x.globalAlpha = 1;
      c.toBlob(cb, 'image/png');
    }

    /* ===== EVENTS ===== */
    dvQ('#dvPageReflection').addEventListener('click', function(e) {
      var star = e.target.closest('[data-dvstar]');
      if (star) {
        var sl = star.getAttribute('data-dvstar'), st2 = dvStars(), ix = st2.indexOf(sl);
        if (ix === -1) st2.push(sl); else st2.splice(ix, 1);
        try { localStorage.setItem('dvRefStars', JSON.stringify(st2)); } catch (er) {}
        star.classList.toggle('dv-on', ix === -1);
        return;
      }
      var card = e.target.closest('.dv-ref-card');
      if (card) { DV.navigate(dvRefPrefix + card.getAttribute('data-dvslug')); return; }
      if (e.target.closest('#dvRefMore')) { dvRefShown += 12; dvRefShowList(); return; }
      if (e.target.closest('#dvRefBack')) { DV.navigate('reflections'); return; }
      var tg = e.target.closest('#dvRefToggle');
      if (tg) {
        var open = dvQ('#dvRefBody').classList.toggle('dv-clamp');
        tg.textContent = open ? 'Show more' : 'Show less';
        return;
      }
      var cta = e.target.closest('[data-dvcta]');
      if (cta) {
        var k = cta.getAttribute('data-dvcta');
        if (k === 'email') window.location.href = 'mailto:' + dvRefCTA.email;
        else if (k === 'phone') window.location.href = 'tel:' + dvRefCTA.phone;
        else if (k === 'whatsapp') window.open('https://wa.me/' + dvRefCTA.whatsapp, '_blank');
        else if (k === 'facebook') window.open(dvRefCTA.facebook, '_blank');
        return;
      }
      if (!dvRefCur) return;
      var url = DV.url(dvRefPrefix + dvRefCur.slug);
      if (e.target.closest('#dvRefImg')) {
        dvRefImage(dvRefCur, function(blob) {
          if (!blob) return;
          var name = dvRefCur.slug + '.png', file = null;
          try { file = new File([blob], name, { type: 'image/png' }); } catch (er) {}
          if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({ files: [file], text: dvRefCur.title + ' \u2014 ' + dvRefCur.author + '\n' + url }).catch(function() {});
          } else {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob); a.download = name;
            document.body.appendChild(a); a.click(); a.remove();
            DV.toast('Picture saved');
          }
        });
        return;
      }
      if (e.target.closest('#dvRefShare')) {
        if (navigator.share) navigator.share({ title: dvRefCur.title, text: dvRefCur.title + ' \u2014 ' + dvRefCur.author, url: url }).catch(function() {});
        else DV.toast('Sharing is not supported on this device');
        return;
      }
      if (e.target.closest('#dvRefBt')) {
        var msg = dvRefCur.title + ' \u2014 ' + dvRefCur.author + '\n\n' + url, file = null;
        try { file = new File([msg], 'reflection.txt', { type: 'text/plain' }); } catch (er) {}
        if (navigator.share && file && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: dvRefCur.title }).catch(function() {});
        else if (navigator.share) navigator.share({ title: dvRefCur.title, text: msg }).catch(function() {});
        else { DV.toast('Sharing is not supported on this device'); return; }
        DV.toast('Choose Bluetooth from the list');
      }
    });

    dvQ('#dvRefSearch').addEventListener('input', function() { dvRefShown = 12; dvRefRender(); });

    /* ===== REGISTER WITH THE SHELL ===== */
    DV.addNavItem({
      key: 'reflection',
      id: 'dvReflectionNavBtn',
      html: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>Reflection'
    });

    DV.addPage('reflection', 'dvPageReflection', {
      title: 'Daily Reflections',
      description: 'Daily reflections to help you reflect on your life purpose and align with divine direction.',
      navKey: 'reflection',
      open: function() { var l = dvRefSorted()[0]; if (l) dvRefShowView(l); else dvRefShowList(); }
    });
    DV.route('reflections', {
      title: 'Daily Reflections',
      description: 'Daily reflections to help you reflect on your life purpose and align with divine direction.',
      navKey: 'reflection',
      open: function() { DV.showPage('reflection'); dvRefShowList(); }
    });

    // One unique link per reflection: /reflection-realign-today
    DV.addRouteMatcher(function(slug) {
      if (slug.indexOf(dvRefPrefix) !== 0) return null;
      var r = dvRefFind(slug.slice(dvRefPrefix.length));
      if (!r) return null;
      return {
        title: r.title + ' (Reflection)',
        description: dvRefPlain(r).slice(0, 155),
        navKey: 'reflection',
        open: function() { DV.showPage('reflection'); dvRefShowView(r); }
      };
    });

    var latest = dvRefSorted()[0];
    if (latest && DV.addQuickAction) {
      DV.addQuickAction({
        label: 'Reflection',
        route: 'reflections',
        order: 40,
        icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'
      });
    }
  } catch (e) {}
})();
