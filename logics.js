const dvd5 = "https://script.google.com/macros/s/AKfycbzBZXY6wDVuDsfGOm5mMcKjuRJWbqyzGJKj_mezh7lGn7zOjJ1Y_mD82U5EZ5YGnfsH/exec";
        function dvc9() {
            let x = localStorage.getItem('dvid');
            if (!x) { x = 'dv-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); localStorage.setItem('dvid', x); }
            return x;
        }
        async function dvca(action, payload) {
            try {
                const r = await fetch(dvd5, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, deviceId: dvc9(), payload: payload || {} }) });
                if (!r.ok) return null;
                const d = await r.json();
                return (d && d.ok) ? d.result : null;
            } catch (e) { return null; }
        }
        async function dvcb() {
            const on = await dvca('getActiveSheets', {});
            if (!on) return;
            if (on.Users) dvca('checkIn', {});
            if (on.Telemetry) {
                try {
                    const ip = await fetch('https://ipapi.co/json/').then(r => r.ok ? r.json() : null).catch(() => null);
                    dvca('logTelemetry', {
                        country: ip && ip.country_name, city: ip && ip.city, isp: ip && ip.org,
                        userAgent: navigator.userAgent,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        screenSize: screen.width + 'x' + screen.height,
                        referral: document.referrer || ''
                    });
                } catch (e) {}
            }
            if (on.Ticker) {
                const t = await dvca('getTicker', {});
                if (t && t.length) {
                    const bar = document.createElement('div');
                    bar.style.cssText = 'position:fixed;bottom:64px;left:0;right:0;background:var(--dvd8, #1877F2);color:var(--dvd9, #fff);padding:5px 0;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;z-index:20;';
                    bar.innerHTML = `<marquee scrollamount="5">${t.map(x => x.text).join(' &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; ')}</marquee>`;
                    document.body.appendChild(bar);
                }
            }
           if (on.ReflectionOverlay) {
                const r = await dvca('getReflection', {});
                if (r) {
                    const ov = document.createElement('div');
                    ov.style.cssText = 'position:fixed;inset:0;background:' + (r.bg || 'rgba(0,0,0,0.7)') + ';z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;';                    
                    const authorHtml = r.writtenBy ? `<div style="font-family:'Roboto',sans-serif;font-size:18px;font-style:italic;color:${r.writtenByColor || '#555'};margin-bottom:12px;">— ${r.writtenBy}</div>` : '';                   
                    ov.innerHTML = `<div id="dvRefCard" style="background:#fff;border-radius:16px;padding:24px;max-width:340px;width:100%;text-align:left;box-sizing:border-box;display:flex;flex-direction:column;max-height:100dvh;transition:all 0.3s ease;">
                        <div style="font-family:'Roboto',sans-serif;font-size:18px;font-weight:800;color:${r.topicColor || '#1877F2'};margin-bottom:10px;">${r.topic || ''}</div>                        
                        <div id="dvRefMsg" style="font-family:'Roboto',sans-serif;font-size:18px;line-height:1.5;color:${r.textColor || '#333'};margin-bottom:12px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;text-overflow:ellipsis;white-space:pre-wrap;">${r.message || ''}</div>                        
                        <div style="font-family:'Roboto',sans-serif;font-size:18px;font-weight:700;color:${r.refColor || '#1877F2'};margin-bottom:8px;">${r.bibleRef || ''}</div>
                        
                        ${authorHtml}                        
                        <div style="flex-grow:1;min-height:10px;"></div>                        
                        <button id="dvRefBtn" style="font-family:'Roboto',sans-serif;font-size:18px;width:100%;padding:12px;border:none;border-radius:12px;background:#1877F2;color:#fff;font-weight:700;margin-top:auto;cursor:pointer;">Show More</button>
                    </div>`;
                    
                    document.body.appendChild(ov);                    
                    const btn = ov.querySelector('#dvRefBtn');
                    const msg = ov.querySelector('#dvRefMsg');
                    const card = ov.querySelector('#dvRefCard');
                    
                    btn.onclick = () => {
                        if (btn.innerText === 'Show More') {
                            ov.style.padding = '0';
                            card.style.maxWidth = '100vw';
                            card.style.height = '100dvh';
                            card.style.borderRadius = '0';
                            card.style.padding = '40px 24px';
                            card.style.overflowY = 'auto';
                            card.style.justifyContent = 'center';
                            msg.style.webkitLineClamp = 'unset'; 
                            btn.innerText = 'Close the Page';
                        } else {
                            ov.remove();
                        }
                    };
                }
            }
          }
        dvcb();
