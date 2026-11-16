// Uso: node render.js video <timeline.json> <out.mp4> <f0> <f1>
//      node render.js stills <timeline.json> <outdir> <t1,t2,...>
//      node render.js thumb <content.json> <outdir>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '..'), FPS = 30;
const icons = () => { const dir = path.join(ROOT, 'node_modules/lucide-static/icons'); const o = {};
  const need = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'build/icons.json'))));
  for (const n of need) { const f = path.join(dir, n + '.svg'); if (!fs.existsSync(f)) throw new Error('icono no existe: ' + n);
    o[n] = fs.readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/, '').replace(/\s+class="[^"]*"/, '').replace(/width="24"\s+height="24"/, ''); } return o; };
(async () => {
  const [mode, src, out, a, b] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exit(2); });
  await page.goto('file://' + path.join(__dirname, 'player.html'));
  const ICONS = icons();
  if (mode === 'thumb') {
    const vids = JSON.parse(fs.readFileSync(src)); fs.mkdirSync(out, { recursive: true });
    for (const v of vids) { await page.evaluate(([t, i, bg]) => window.THUMB(t, i, bg), [v.thumb, ICONS, v.bg]);
      await page.screenshot({ path: path.join(out, v.id + '.png') }); }
    await browser.close(); return;
  }
  const data = JSON.parse(fs.readFileSync(src));
  await page.evaluate(([d, i]) => window.INIT(d, i), [data, ICONS]);
  if (mode === 'stills') {
    fs.mkdirSync(out, { recursive: true });
    for (const t of a.split(',').map(Number)) { await page.evaluate(t => window.SEEK(t), t); await page.screenshot({ path: path.join(out, `t${String(t.toFixed(1)).padStart(6, '0')}.png`) }); }
    await browser.close(); return;
  }
  const total = Math.ceil(data.duration * FPS), f0 = +a || 0, f1 = Math.min(+b || total, total);
  const cdp = await page.context().newCDPSession(page);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-vf', 'scale=in_range=pc:out_range=tv:out_color_matrix=bt709', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise(r => ff.on('close', r));
  for (let f = f0; f < f1; f++) {
    await page.evaluate(t => window.SEEK(t), f / FPS);
    const { data: b64 } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 94, optimizeForSpeed: true });
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await done; await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
