/* Motor de escenas determinista: todo se dibuja en función del tiempo t (segundos). */
(() => {
  let D = null, ICON = {}, sceneEls = [], bgEls = {}, counters = [], toggles = [], lits = [];
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const ic = n => { if (!ICON[n]) throw new Error('icono faltante: ' + n); return ICON[n]; };
  const rnd = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  /* ───────── fondos ───────── */
  function skyline(seed, y, fill, win, minH, maxH, lit = .25) {
    const r = rnd(seed); let x = -20, out = '';
    while (x < 1940) {
      const w = 50 + r() * 110, h = minH + r() * (maxH - minH) * (r() < .18 ? 1.5 : 1);
      out += `<rect x="${x.toFixed(0)}" y="${(y - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${fill}"/>`;
      if (r() < .3) out += `<rect x="${(x + w / 2 - 3).toFixed(0)}" y="${(y - h - 34).toFixed(0)}" width="6" height="34" fill="${fill}"/>`;
      if (win) for (let wy = y - h + 14; wy < y - 14; wy += 22) for (let wx = x + 10; wx < x + w - 12; wx += 18)
        if (r() < lit) out += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="8" height="11" fill="${win}" opacity="${(.35 + r() * .6).toFixed(2)}"/>`;
      x += w + (r() < .25 ? 14 : 0);
    }
    return out;
  }
  function palm(x, y, h, s = 1, cls = '') {
    const fr = (a, l) => `<path transform="rotate(${a})" d="M0,0 C${l * .3},${-l * .42} ${l * .8},${-l * .3} ${l},${l * .2} C${l * .72},${-l * .02} ${l * .36},${-l * .1} 0,0Z"/>`;
    let f = ''; [[-78, .8], [-48, 1], [-18, 1.05], [14, .95], [42, .75]].forEach(([a, l]) => { f += fr(a, 190 * l); });
    const crown = `<g>${f}</g><g transform="scale(-1,1)">${f}</g><circle r="16"/>`;
    return `<g transform="translate(${x},${y}) scale(${s})" fill="#12062b"><g class="sway ${cls}"><path d="M-10,0 C-4,${-h * .4} 26,${-h * .7} 40,${-h} L58,${-h} C48,${-h * .7} 20,${-h * .4} 16,0Z"/><g transform="translate(49,${-h})">${crown}</g></g></g>`;
  }
  function stars(seed, n, maxY) {
    const r = rnd(seed); let o = '';
    for (let i = 0; i < n; i++) o += `<circle class="tw" style="animation-delay:${(-r() * 3).toFixed(2)}s;animation-duration:${(2 + r() * 3).toFixed(2)}s" cx="${(r() * 1920).toFixed(0)}" cy="${(r() * maxY).toFixed(0)}" r="${(1 + r() * 2.2).toFixed(1)}" fill="#fff"/>`;
    return o;
  }
  function sunSvg(cx, cy, R, id) {
    let cuts = ''; for (let i = 0; i < 7; i++) { const yy = cy + R * (.05 + i * .135), hh = 5 + i * 4.2; cuts += `<rect x="${cx - R}" y="${yy}" width="${2 * R}" height="${hh}" fill="#000"/>`; }
    return `<defs><linearGradient id="sg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a8"/><stop offset=".45" stop-color="#ffd23f"/><stop offset="1" stop-color="#ff2e88"/></linearGradient>
      <mask id="sm${id}"><rect width="1920" height="1080" fill="#fff"/>${cuts}</mask>
      <radialGradient id="sh${id}"><stop offset="0" stop-color="#ffd23f" stop-opacity=".55"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient></defs>
      <circle cx="${cx}" cy="${cy}" r="${R * 1.9}" fill="url(#sh${id})"/><circle class="sun" cx="${cx}" cy="${cy}" r="${R}" fill="url(#sg${id})" mask="url(#sm${id})"/>`;
  }
  const BG = {
    sunset: () => `<svg viewBox="0 0 1920 1080"><defs><linearGradient id="sk1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0b3d"/><stop offset=".3" stop-color="#5b1a8a"/><stop offset=".5" stop-color="#ff2e88"/><stop offset=".6" stop-color="#ff9a3c"/><stop offset=".6" stop-color="#0b0620"/></linearGradient></defs>
      <rect width="1920" height="1080" fill="url(#sk1)"/>${stars(3, 60, 300)}${sunSvg(960, 470, 250, 'a')}
      <g class="cloud" opacity=".35"><rect x="0" y="200" width="420" height="16" rx="8" fill="#fff"/><rect x="80" y="232" width="260" height="12" rx="6" fill="#fff"/></g>
      <g class="cloud" style="animation-delay:-32s" opacity=".28"><rect x="0" y="120" width="320" height="14" rx="7" fill="#fff"/><rect x="60" y="148" width="200" height="10" rx="5" fill="#fff"/></g>
      ${skyline(11, 648, '#3a1470', '#ffd23f', 40, 150, .18)}${skyline(23, 648, '#200a4a', '#ff9a3c', 20, 95, .28)}
      </svg><div class="floor" style="--g:#ff2e88"></div><div class="floorfade"></div>
      <svg viewBox="0 0 1920 1080">${palm(150, 1010, 560, 1.15)}${palm(330, 1040, 400, .9, 'b')}${palm(1740, 1010, 580, 1.15, 'b')}${palm(1560, 1040, 380, .9)}</svg>`,
    night: () => `<svg viewBox="0 0 1920 1080"><defs><linearGradient id="sk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05021a"/><stop offset=".45" stop-color="#1b0b4a"/><stop offset=".6" stop-color="#5b1a8a"/><stop offset=".6" stop-color="#070318"/></linearGradient>
      <radialGradient id="mo"><stop offset="0" stop-color="#29e6ff" stop-opacity=".5"/><stop offset="1" stop-color="#29e6ff" stop-opacity="0"/></radialGradient></defs>
      <rect width="1920" height="1080" fill="url(#sk2)"/>${stars(7, 170, 560)}
      <circle cx="1500" cy="210" r="260" fill="url(#mo)"/><circle cx="1500" cy="210" r="78" fill="#fff6c4"/><circle cx="1466" cy="190" r="92" fill="#0d0630" opacity=".0"/>
      ${skyline(41, 648, '#2b1070', '#29e6ff', 80, 260, .34)}${skyline(57, 648, '#120638', '#ff2e88', 40, 170, .42)}
      <rect x="0" y="644" width="1920" height="5" fill="#29e6ff" opacity=".9"/></svg><div class="floor" style="--g:#29e6ff"></div><div class="floorfade"></div>
      <svg viewBox="0 0 1920 1080">${palm(120, 1030, 500, 1.1)}${palm(1790, 1030, 520, 1.1, 'b')}</svg>`,
    ocean: () => {
      let w = ''; const cols = ['#29e6ff', '#ff9a3c', '#ffd23f', '#ff2e88'];
      for (let i = 0; i < 16; i++) { const y = 668 + i * i * 1.55 + i * 6, sw = 3 + i * .5; w += `<path class="wave ${i % 2 ? 'r' : ''}" d="M-240,${y} ${Array.from({ length: 12 }, (_, k) => `q60,${-(6 + i)} 120,0 t120,0`).join(' ')}" fill="none" stroke="${cols[i % 4]}" stroke-width="${sw}" opacity="${(.28 + (i % 3) * .14).toFixed(2)}" stroke-dasharray="${150 + i * 14} ${90 + i * 9}" stroke-linecap="round"/>`; }
      return `<svg viewBox="0 0 1920 1080"><defs><linearGradient id="sk3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a2a5c"/><stop offset=".28" stop-color="#3b3aa6"/><stop offset=".48" stop-color="#ff5e9c"/><stop offset=".6" stop-color="#ffb347"/><stop offset=".6" stop-color="#0a1440"/><stop offset="1" stop-color="#0b0620"/></linearGradient></defs>
      <rect width="1920" height="1080" fill="url(#sk3)"/>${stars(5, 40, 240)}${sunSvg(1380, 560, 190, 'b')}
      <g class="cloud" opacity=".4"><rect x="0" y="250" width="460" height="18" rx="9" fill="#fff"/><rect x="100" y="284" width="280" height="12" rx="6" fill="#fff"/></g>
      <path d="M0,648 L0,610 Q160,560 330,600 T620,625 L700,648Z" fill="#1b0b4a"/>${w}
      ${palm(170, 1020, 600, 1.2)}${palm(380, 1050, 430, .95, 'b')}${palm(-10, 1060, 420, 1, 'b')}</svg>`;
    },
    grid: () => `<svg viewBox="0 0 1920 1080"><defs><radialGradient id="g1"><stop offset="0" stop-color="#ff2e88" stop-opacity=".6"/><stop offset="1" stop-color="#ff2e88" stop-opacity="0"/></radialGradient>
      <radialGradient id="g2"><stop offset="0" stop-color="#29e6ff" stop-opacity=".5"/><stop offset="1" stop-color="#29e6ff" stop-opacity="0"/></radialGradient>
      <radialGradient id="g3"><stop offset="0" stop-color="#7b2cff" stop-opacity=".65"/><stop offset="1" stop-color="#7b2cff" stop-opacity="0"/></radialGradient>
      <pattern id="gp" width="96" height="96" patternUnits="userSpaceOnUse"><path d="M96,0H0V96" fill="none" stroke="#fff" stroke-opacity=".09" stroke-width="2"/></pattern></defs>
      <rect width="1920" height="1080" fill="#0d0630"/>
      <circle class="blob" cx="300" cy="260" r="520" fill="url(#g1)"/><circle class="blob b" cx="1640" cy="820" r="600" fill="url(#g2)"/><circle class="blob b" cx="1100" cy="200" r="520" fill="url(#g3)"/>
      <g class="gridpan"><rect x="-100" y="-100" width="2200" height="1400" fill="url(#gp)"/></g></svg>`,
  };

  /* ───────── helpers de tiempo ───────── */
  const ms = s => Math.round(s * 1000);
  const A = (cls, t, extra = '') => `class="a ${cls}" style="--t:${ms(t)};${extra}"`;
  const sentT = (sc, at, lead = .14) => { const s = sc.sent[Math.min(at ?? 0, sc.sent.length - 1)]; return Math.max(sc.start + .38, s.s - lead); };
  const span = (sc, at, toNext) => { // intervalo [s,e] en que un elemento está "activo"
    const s = sc.sent[Math.min(at ?? 0, sc.sent.length - 1)].s - .14; let e = toNext != null && toNext > at ? sc.sent[Math.min(toNext, sc.sent.length) - 1].e : sc.sent[Math.min(at ?? 0, sc.sent.length - 1)].e;
    return `data-s="${s.toFixed(3)}" data-e="${(e + .12).toFixed(3)}"`;
  };
  const nextAt = (arr, i) => { for (let k = i + 1; k < arr.length; k++) if (arr[k].at > arr[i].at) return arr[k].at; return 999; };
  const head = (sc, t) => sc.heading ? `<div ${A('inLeft heading', t)}><span>${esc(sc.heading)}</span></div>` : '';

  /* ───────── plantillas ───────── */
  const T = {
    title(sc) {
      const t0 = sc.start + .2, words = sc.title.split(' ');
      return `<div class="wrap"><div ${A('inDown kicker', t0)}>${esc(sc.kicker)}</div>
        <h1 data-fit="1740">${words.map((w, i) => `<span ${A('pop grad', t0 + .22 + i * .085)}>${esc(w)}</span>`).join('')}</h1>
        <div ${A('wipe rule', t0 + .75)}></div><div ${A('inUp sub', t0 + .95)}>${esc(sc.sub)}</div></div>`;
    },
    stat(sc) {
      const t0 = sc.start + .42; const num = sc.count ? `<span data-count="${sc.value}" data-c0="${(t0 + .1).toFixed(3)}">0</span>` : esc(sc.value);
      return `<div class="wrap">${sc.icon ? `<div ${A('pop ico', t0 - .05)}>${ic(sc.icon)}</div>` : ''}
        <div ${A('pop val grad', t0 + .1)}>${sc.prefix ? `<small>${esc(sc.prefix)}</small>` : ''}${num}${sc.unit ? `<small>${esc(sc.unit)}</small>` : ''}</div>
        <div ${A('inUp label', t0 + .45)}>${esc(sc.label)}</div>${sc.note ? `<div ${A('inUp note', t0 + .65)}>${esc(sc.note)}</div>` : ''}
        ${sc.chips ? `<div class="chips">${sc.chips.map((c, i) => `<div ${A('inUp', sentT(sc, c.at) + (sc.chips.slice(0, i).filter(x => x.at === c.at).length) * .18)}>${esc(c.text)}</div>`).join('')}</div>` : ''}</div>`;
    },
    list(sc) {
      const n = sc.items.length;
      const same = {}; // escalonado para elementos que aparecen en la misma frase
      return `<div class="wrap n${Math.min(5, Math.max(3, sc.cols === 2 ? 3 : n))}">${head(sc, sc.start + .4)}<div class="rows ${sc.cols === 2 ? 'c2' : ''} n${Math.min(5, Math.max(3, n))}">
        ${sc.items.map((it, i) => { const k = (same[it.at] = (same[it.at] || 0) + 1) - 1; const lone = sc.items.filter(x => x.at === it.at).length > 1;
          return `<div ${A('inUp row glass', sentT(sc, it.at) + k * .32)} ${lone ? '' : span(sc, it.at, nextAt(sc.items, i))}>
          <div class="ico">${sc.numbered ? (sc.num0 || 1) + i : ic(it.icon)}</div><div><div class="tx">${esc(it.text)}</div>${it.sub ? `<div class="sb">${esc(it.sub)}</div>` : ''}</div></div>`; }).join('')}</div></div>`;
    },
    table(sc) {
      const g = `grid-template-columns:${sc.widths.map(w => w + 'fr').join(' ')}`;
      return `<div class="wrap">${head(sc, sc.start + .4)}<div class="tb"><div ${A('fade tr th', sc.start + .6, g)}>${sc.cols.map(c => `<div>${esc(c)}</div>`).join('')}</div>
        ${sc.rows.map((r, i) => `<div ${A('inUp tr glass' + (r.hl ? ' hl' : ''), sentT(sc, r.at), g)} ${span(sc, r.at)}>${r.cells.map((c, j) => `<div class="td">${j === 0 && r.code ? `<span class="code">${esc(r.code)}</span>` : ''}${esc(c)}</div>`).join('')}</div>`).join('')}
        </div>${sc.foot ? `<div ${A('fade foot', sc.start + 1.2)}>${esc(sc.foot)}</div>` : ''}</div>`;
    },
    compare(sc) {
      const card = (c, dir) => `<div ${A(dir + ' card glass' + (c.hot ? ' hot' : ''), sentT(sc, c.at))}><h3>${esc(c.title)}</h3><div class="price grad">${esc(c.price)}</div><ul>${c.items.map((x, i) => `<li ${A('inUp', sentT(sc, c.at) + .5 + i * .35)}>${ic('check')}<span>${esc(x)}</span></li>`).join('')}</ul></div>`;
      return `<div class="wrap">${head(sc, sc.start + .4)}<div class="cmp">${card(sc.left, 'inLeft')}${card(sc.right, 'inRight')}</div></div>`;
    },
    cards(sc) {
      const n = sc.cards.length;
      return `<div class="wrap ${sc.big ? 'big' : ''}">${head(sc, sc.start + .4)}<div class="cards" style="grid-template-columns:repeat(${n},1fr)">
        ${sc.cards.map((c, i) => `<div ${A('inUp pc glass' + (c.hot ? ' hot' : ''), sentT(sc, c.at))} ${span(sc, c.at, nextAt(sc.cards, i))}><div class="ico">${ic(c.icon)}</div><h3 data-fit="${sc.big ? 690 : 450}">${esc(c.name)}</h3><div class="tag">${esc(c.tag)}</div><p>${esc(c.role)}</p></div>`).join('')}</div></div>`;
    },
    verdict(sc) {
      const n = sc.rows.length;
      return `<div class="wrap n${n >= 4 ? 4 : 3}">${head(sc, sc.start + .4)}<div class="rows">
        ${sc.rows.map((r, i) => { const s = sc.sent[r.at]; const ts = Math.min(s.e - .35, s.s + (s.e - s.s) * .6);
          return `<div ${A('inLeft vr glass', sentT(sc, r.at))} ${span(sc, r.at)}><div class="cl">${esc(r.claim)}</div><div ${A('slam stamp ' + r.kind, ts, `--r:${i % 2 ? 4 : -5}deg`)}>${esc(r.stamp)}</div></div>`; }).join('')}</div></div>`;
    },
    quote(sc) {
      const t0 = sc.start + .42;
      return `<div class="wrap">${sc.icon ? `<div ${A('pop ico', t0)}>${ic(sc.icon)}</div>` : ''}<div ${A('pop q grad', t0 + .18)} data-fitq="1">${esc(sc.text)}</div>
        <div ${A('inUp by', sc.sent.length > 1 ? sentT(sc, 1) : t0 + 1)}>${esc(sc.by)}</div></div>`;
    },
    bars(sc) {
      const same = {};
      return `<div class="wrap">${head(sc, sc.start + .4)}<div class="rows n4">
        ${sc.rows.map(r => { const k = (same[r.at] = (same[r.at] || 0) + 1) - 1, t = sentT(sc, r.at) + k * .5;
          return `<div ${A('inUp br glass' + (r.hot ? ' hot' : ''), t)}><div><div class="lb">${esc(r.label)}</div><div class="nt">${esc(r.note)}</div></div>
          <div class="track"><div class="a fill" style="--t:${ms(t + .3)};--w:${r.pct}%"></div></div><div class="pct"><span data-count="${r.pct}" data-c0="${(t + .3).toFixed(3)}">0</span>%</div></div>`; }).join('')}</div>
        ${sc.foot ? `<div ${A('fade foot', sc.start + 1.2)}>${esc(sc.foot)}</div>` : ''}</div>`;
    },
    map(sc) {
      const P = { keys: [400, 726, '#ffd23f', 'CAYOS', 0, 44], vice: [676, 560, '#ff2e88', 'VICE CITY', -30, 8], grass: [560, 436, '#3dffa2', 'GRASSRIVERS', -30, 8], ambrosia: [560, 276, '#ff9a3c', 'AMBROSIA', -30, 8], gellhorn: [150, 196, '#29e6ff', 'PORT GELLHORN', 30, 8], kalaga: [400, 128, '#b78cff', 'MONTE KALAGA', 30, 8] };
      const shown = new Set(sc.shown || []);
      const land = 'M60,120 C200,76 430,66 660,84 C726,92 748,146 738,226 C730,320 754,404 742,494 C732,586 704,646 650,672 C596,694 548,668 512,612 C474,552 436,500 404,440 C378,390 356,356 300,336 C230,312 130,300 76,250 C36,212 30,150 60,120Z';
      const isl = [[560, 700, 26, 11], [506, 716, 30, 12], [446, 728, 34, 12], [384, 736, 30, 11], [328, 742, 24, 9], [280, 746, 16, 7]].map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}"/>`).join('');
      const defs = Object.entries(P).map(([k, [x, y, c]]) => `<radialGradient id="rg_${k}_${sc.idx}"><stop offset="0" stop-color="${c}" stop-opacity=".75"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('');
      const glow = Object.entries(P).map(([k, [x, y]]) => { const r = sc.regions.find(q => q.id === k); const st = shown.has(k) ? 'class="rg lit"' : r ? `class="rg" data-lit="${(sc.sent[r.at].s - .14).toFixed(3)}"` : 'class="rg"'; return `<circle ${st} cx="${x}" cy="${y}" r="${k === 'keys' ? 150 : 130}" fill="url(#rg_${k}_${sc.idx})"/>`; }).join('');
      const pins = Object.entries(P).map(([k, [x, y, c, lb, dx, dy]]) => { const r = sc.regions.find(q => q.id === k); const st = shown.has(k) ? 'class="pin lit"' : r ? `class="pin" data-lit="${(sc.sent[r.at].s - .14).toFixed(3)}" data-now="${(nextAt(sc.regions, sc.regions.indexOf(r)) < 99 ? sc.sent[nextAt(sc.regions, sc.regions.indexOf(r))].s - .14 : sc.end).toFixed(3)}"` : 'class="pin"';
        return `<g ${st}><circle class="ring" cx="${x}" cy="${y}" r="22" fill="none" stroke="${c}" stroke-width="5"/><circle cx="${x}" cy="${y}" r="17" fill="${c}" stroke="#12062b" stroke-width="5"/><text x="${x + dx}" y="${y + dy}" text-anchor="${dx < 0 ? 'end' : dx > 0 ? 'start' : 'middle'}" font-family="Barlow Condensed" font-weight="800" font-size="27" letter-spacing="2" fill="#fff" stroke="#12062b" stroke-width="6" paint-order="stroke">${lb}</text></g>`; }).join('');
      return `<div class="wrap">${head(sc, sc.start + .4)}<div class="mapgrid"><div ${A('inLeft mapbox glass', sc.start + .45)}>
        <svg viewBox="0 0 800 780"><defs>${defs}<linearGradient id="ld${sc.idx}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b1d8a"/><stop offset="1" stop-color="#5a2aa8"/></linearGradient><clipPath id="cl${sc.idx}"><path d="${land}"/>${isl}</clipPath></defs>
        <g fill="url(#ld${sc.idx})" stroke="#29e6ff" stroke-width="4" stroke-linejoin="round"><path d="${land}"/>${isl}</g>
        <g clip-path="url(#cl${sc.idx})">${glow}</g>${pins}
        <g font-family="Barlow Condensed" font-weight="800" font-size="24" fill="#fff" opacity=".55" letter-spacing="3"><text x="690" y="48" text-anchor="end">N ↑</text></g></svg>
        <div class="mapnote">Esquema ilustrativo · no es el mapa oficial</div></div>
        <div class="rcards">${sc.regions.map((r, i) => `<div ${A('inRight rc glass', sentT(sc, r.at), `--c:${P[r.id][2]}`)} ${span(sc, r.at, nextAt(sc.regions, i))}><h3><i></i><span data-fit="800">${esc(r.name)}</span></h3><p>${esc(r.desc)}</p></div>`).join('')}</div></div></div>`;
    },
    outro(sc) {
      const t0 = sc.start + .42;
      return `<div class="wrap"><div ${A('pop s1 grad', t0)}>SUSCRÍBETE</div><div ${A('inUp bell', t0 + .4)}>${ic('bell-ring')}<span>ACTIVA LA CAMPANA · ${esc(D.channel)}</span></div>
        <div ${A('inUp next glass', sc.sent.length > 1 ? sentT(sc, 1, .3) : t0 + 1.2)}><div class="ico">${ic('play')}</div><div><small>SIGUIENTE VIDEO</small><b>${esc(sc.next)}</b></div></div></div>`;
    },
  };
  const DIM = { title: 'radial-gradient(ellipse at 50% 45%,rgba(11,6,32,.62),rgba(11,6,32,.18) 70%)', outro: 'radial-gradient(ellipse at 50% 45%,rgba(11,6,32,.7),rgba(11,6,32,.25) 75%)', stat: 'rgba(11,6,32,.58)', quote: 'rgba(11,6,32,.6)' };

  function fitAll(root) {
    root.querySelectorAll('[data-fit]').forEach(el => { const max = +el.dataset.fit; let fs = parseFloat(getComputedStyle(el).fontSize); el.style.flexWrap = 'nowrap';
      let guard = 0; while (el.scrollWidth > max && fs > 40 && guard++ < 200) { fs -= 3; el.style.fontSize = fs + 'px'; } });
    root.querySelectorAll('[data-fitq]').forEach(el => { let fs = parseFloat(getComputedStyle(el).fontSize), guard = 0; while (el.scrollHeight > 340 && fs > 60 && guard++ < 100) { fs -= 4; el.style.fontSize = fs + 'px'; } });
  }

  function hud(d) {
    return `<div id="hud"><div class="logo"><div class="mark">${ic('tree-palm')}</div><span>ZONA <b>LEONIDA</b></span></div>
      <div class="chip"><i>${d.num}</i>${esc(d.chapter)}</div><div id="cap"></div><div id="prog"></div></div><div id="sweep"></div>`;
  }

  window.INIT = async (data, icons) => {
    D = data; ICON = icons; const st = $('#stage');
    let h = ''; for (const k of Object.keys(BG)) h += `<div class="bg" id="bg_${k}">${BG[k]()}</div>`;
    D.scenes.forEach((sc, i) => { sc.idx = i; });
    D.scenes.forEach((sc, i) => { h += `<div class="scene ${sc.type}" id="sc${i}"><div class="dim" style="background:${DIM[sc.type] || 'rgba(11,6,32,.52)'}"></div>${T[sc.type](sc)}</div>`; });
    st.innerHTML = h + hud(D);
    sceneEls = D.scenes.map((_, i) => $('#sc' + i)); Object.keys(BG).forEach(k => bgEls[k] = $('#bg_' + k));
    await document.fonts.ready; await Promise.all(['400 100px Anton', '700 50px "Barlow Condensed"', '800 50px "Barlow Condensed"', '500 50px "Barlow Condensed"'].map(f => document.fonts.load(f, 'ÁÑ¿x')));
    sceneEls.forEach(el => { el.style.display = 'block'; el.style.visibility = 'hidden'; }); fitAll(st); sceneEls.forEach(el => { el.style.display = 'none'; el.style.visibility = ''; });
    counters = [...st.querySelectorAll('[data-count]')].map(el => ({ el, v: +el.dataset.count, c0: +el.dataset.c0 }));
    toggles = [...st.querySelectorAll('[data-s]')].map(el => ({ el, s: +el.dataset.s, e: +el.dataset.e }));
    lits = [...st.querySelectorAll('[data-lit]')].map(el => ({ el, s: +el.dataset.lit, n: el.dataset.now ? +el.dataset.now : null }));
    return true;
  };

  let lastScene = -1;
  window.SEEK = t => {
    let idx = D.scenes.findIndex(s => t >= s.start && t < s.end); if (idx < 0) idx = D.scenes.length - 1;
    if (idx !== lastScene) { sceneEls.forEach((el, i) => el.style.display = i === idx ? 'block' : 'none'); const b = D.scenes[idx].bg; for (const k in bgEls) bgEls[k].style.display = k === b ? 'block' : 'none'; lastScene = idx; }
    const T = t * 1000; document.getAnimations().forEach(a => { a.currentTime = T; });
    for (const c of counters) { const p = Math.min(1, Math.max(0, (t - c.c0) / 1.1)), e = 1 - Math.pow(1 - p, 3); c.el.textContent = Math.round(c.v * e); }
    for (const g of toggles) g.el.classList.toggle('on', t >= g.s && t < g.e);
    for (const l of lits) { l.el.classList.toggle('lit', t >= l.s); if (l.n != null) l.el.classList.toggle('now', t >= l.s && t < l.n); }
    const c = D.caps.find(c => t >= c.s - .02 && t < c.e + .04); $('#cap').innerHTML = c ? `<span>${esc(c.text)}</span>` : '';
    $('#prog').style.width = (t / D.duration * 1920).toFixed(1) + 'px';
    // barrido de transición
    let x = -3800; for (let i = 1; i < D.scenes.length; i++) { const p = (t - (D.scenes[i].start - .26)) / .62; if (p > 0 && p < 1) x = -3800 + p * 6100; }
    $('#sweep').style.transform = `translateX(${x.toFixed(0)}px) skewX(-16deg)`;
  };

  window.THUMB = async (th, icons, bg) => {
    ICON = icons; const st = $('#stage');
    st.innerHTML = `<div class="bg" id="bg_x" style="display:block">${BG[bg]()}</div><div class="dim" style="background:linear-gradient(90deg,rgba(11,6,32,.82),rgba(11,6,32,.45) 60%,rgba(11,6,32,.15))"></div>
      <div class="thumb"><div class="top">${esc(th.top)}</div><div class="bigt grad" id="bt">${esc(th.big)}</div><div class="badge">${esc(th.badge)}</div><div class="ico tico">${ic(th.icon)}</div></div>`;
    await document.fonts.ready; await document.fonts.load('400 100px Anton', 'ÁÑ¿x'); await document.fonts.load('800 50px "Barlow Condensed"', 'ÁÑ¿x');
    const el = $('#bt'), words = th.big.split(' '); let lines = [th.big];
    if (th.big.length > 12 && words.length > 1) { let best = 1e9, bi = 1; for (let i = 1; i < words.length; i++) { const d = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length); if (d < best) { best = d; bi = i; } }
      lines = [words.slice(0, bi).join(' '), words.slice(bi).join(' ')]; }
    el.innerHTML = lines.map(l => `<div>${esc(l)}</div>`).join('');
    let fs = 440, g = 0; el.style.fontSize = fs + 'px';
    while ((el.scrollWidth > 1330 || el.scrollHeight > 590) && fs > 90 && g++ < 300) { fs -= 4; el.style.fontSize = fs + 'px'; }
    el.style.top = (200 + (590 - el.scrollHeight) / 2) + 'px';
    document.getAnimations().forEach(a => { a.currentTime = 1500; });
    return true;
  };
})();
