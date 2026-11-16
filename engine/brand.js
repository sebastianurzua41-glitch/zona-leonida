// Genera el arte del canal: avatar (800x800) y banner (2560x1440).
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'); const out = path.join(ROOT, 'out/canal'); fs.mkdirSync(out, { recursive: true });
const icon = n => fs.readFileSync(path.join(ROOT, 'node_modules/lucide-static/icons', n + '.svg'), 'utf8').replace(/<!--[\s\S]*?-->/, '').replace(/\s+class="[^"]*"/, '').replace(/width="24"\s+height="24"/, '');
(async () => {
  const b = await chromium.launch();
  for (const kind of ['avatar', 'banner']) {
    const page = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: kind === 'banner' ? 4 / 3 : 1 });
    await page.goto('file://' + path.join(__dirname, 'player.html'));
    await page.evaluate(([t, i]) => window.THUMB(t, i, 'sunset'), [{ top: '', big: 'X', badge: '', icon: 'tree-palm' }, { 'tree-palm': icon('tree-palm') }]);
    await page.evaluate(([kind, palm]) => {
      const st = document.querySelector('#stage'); st.querySelector('.thumb').remove(); const dim = st.querySelector('.dim');
      const d = document.createElement('div'); d.style.cssText = 'position:absolute;inset:0;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center';
      if (kind === 'avatar') {
        dim.style.background = 'radial-gradient(circle at 50% 44%,rgba(11,6,32,.05),rgba(11,6,32,.55) 60%)';
        d.innerHTML = `<div style="margin-top:-90px;font-family:Anton;font-size:520px;line-height:1;letter-spacing:6px;color:#fff;text-shadow:0 14px 0 #12062b,0 0 60px rgba(18,6,43,.9)">ZL</div>
          <div style="margin-top:6px;font-family:'Barlow Condensed';font-weight:800;font-size:92px;letter-spacing:10px;color:#12062b;background:linear-gradient(90deg,#ffd23f,#ff9a3c,#ff2e88);padding:4px 40px 10px;border-radius:18px;border:6px solid #fff">GTA 6</div>`;
      } else {
        dim.style.background = 'radial-gradient(ellipse at 50% 48%,rgba(11,6,32,.72),rgba(11,6,32,.3) 60%,rgba(11,6,32,.1))';
        d.innerHTML = `<div style="display:flex;align-items:center;gap:26px"><div class="ico" style="width:120px;height:120px;border-radius:28px">${palm.replace('<svg', '<svg style="width:78px;height:78px"')}</div>
          <div style="font-family:Anton;font-size:150px;line-height:1;letter-spacing:3px;text-shadow:0 8px 0 #12062b,0 0 50px rgba(0,0,0,.7)">ZONA <span style="color:#ffd23f">LEONIDA</span></div></div>
          <div style="margin-top:22px;font-family:'Barlow Condensed';font-weight:800;font-size:46px;letter-spacing:6px;background:#ff2e88;padding:6px 30px 10px;border-radius:12px">TODO GTA 6 EN ESPAÑOL · GUÍAS · NOTICIAS · SECRETOS</div>`;
      }
      st.appendChild(d);
    }, [kind, icon('tree-palm')]);
    await page.evaluate(() => Promise.all([document.fonts.load('400 100px Anton', 'ZL'), document.fonts.load('800 50px "Barlow Condensed"', 'GTA')]));
    if (kind === 'avatar') await page.screenshot({ path: path.join(out, 'avatar_raw.png'), clip: { x: 420, y: 0, width: 1080, height: 1080 } });
    else await page.screenshot({ path: path.join(out, 'banner-2560x1440.png') });
    await page.close();
  }
  await b.close();
})();
