
/* ================= 🔬 MotionFuse (mo-20, 🎬 Motion chat, 2026-11-27) — element FUSIONS part 1: engine + shared fusion shapes + ♨️ steam · 🌋 magma · 🔥🌪️ firestorm · 🌲 fire seeds · ☀️ plasma · 🌸 bloom =================
   17c: 15 + 1 element FUSIONS = real science (Avateer §17h-4) + the 4 Island 3 boss FX (lore 3 §36h + 🐉 naga asks).
   Rules: FX Bible F1–F16 · §2.2b "two elements in one effect" → a fusion is a NEW thing with its OWN ramp + shapes (both parents show in it).
   API (draft): Motion.fuse('fire', 'water') → 'steam' (order-free) · Motion.FUSE = {pair: {id, kind, field, sci}} ·
   E = Motion.fx('fuse.steam', {x, y, k, to, pts, r, calm, day, onContact}) one-shot burst · F = Motion.fx('fuse.steam.field', {…}) loop until F.stop(t).
   Pure on t (seeded), plain canvas + the cached glow sprite. */
(function () {
  const M = window.Motion; if (!M || !M.fxAdd || !M.fxTools || M.FUSE) return;
  const T = M.fxTools, TAU = Math.PI * 2, rng = T.rng, outBack = T.outBack, outQ = T.outQ, inQ = T.inQ, rgba = T.rgba, rampAt = T.rampAt;
  const cl = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, q) => a + (b - a) * q, bell = q => q <= 0 || q >= 1 ? 0 : Math.sin(Math.PI * q);
  const seg = (t, a, b) => cl((t - a) / (b - a), 0, 1);
  const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)), mix = (a, b, q) => { if (q <= 0) return a; if (q >= 1) return b; const A = hx(a), B = hx(b); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * q)).join(',') + ')'; };
  const lite = (g, P) => { g.globalCompositeOperation = P.day ? 'source-over' : 'lighter'; };
  const RAMP = {   // index 0 = white core → 6 = darkest edge (FX Bible §2.2a) — every fusion owns one
    fire:   ['#FFFFFF', '#FFF4B8', '#FFC83D', '#FF8A3D', '#F0502A', '#B8322A', '#5E2340'],
    zap:    ['#FFFFFF', '#EAF8FF', '#A8E8FF', '#5CC8FF', '#3A86FF', '#4B3FC4', '#22205E'],
    water:  ['#FFFFFF', '#DDF6FF', '#8EE3F5', '#3BC9DB', '#1C9AD6', '#1A5FA8', '#1B2F6B'],
    nature: ['#FFFFFF', '#F1FFD9', '#C6F27A', '#7ED957', '#2FB86B', '#1F8A5B', '#1B4D3E'],
    stone:  ['#FFFFFF', '#F3E9D8', '#D9C3A0', '#B08A5E', '#8A6A44', '#5E4A34', '#3A2E26'],
    wind:   ['#FFFFFF', '#EFFFF8', '#C9F5E6', '#8FE3CC', '#52C7AE', '#2E9C8C', '#1F5E5E'],
    light:  ['#FFFFFF', '#FFFBE0', '#FFEE99', '#FFD43B', '#FFB020', '#E08A1E', '#8A5A20'],
    shadow: ['#FFFFFF', '#EEE6FF', '#C9B3FF', '#9B7BFF', '#7048E8', '#4B2A9E', '#24154F'],
    steam:  ['#FFFFFF', '#F5FBFF', '#DDEFF8', '#BCDCEB', '#93BFD6', '#6E93B0', '#4A5F7E'],
    magma:  ['#FFFFFF', '#FFF0A8', '#FFB13B', '#FF6A1F', '#D9381E', '#8A1F2A', '#3A1A2E'],
    obsid:  ['#F4EEFF', '#C9BCF0', '#8D7FC0', '#5E5480', '#3E3760', '#2A2444', '#17142A'],
    plasma: ['#FFFFFF', '#FFF1FB', '#FFC2F0', '#FF7AD9', '#C45CFF', '#6A3FD8', '#2A1E6B'],
    bloom:  ['#FFFFFF', '#FFF0F8', '#FFC9E3', '#FF8CC6', '#F06595', '#C2408A', '#6B2358'],
    mud:    ['#FFFFFF', '#EADBC4', '#C9A77E', '#9C7650', '#73533A', '#4E3828', '#2E2018'],
    cloud:  ['#FFFFFF', '#EEF3FA', '#CED9E8', '#A9B8CF', '#7F91AE', '#5C6C8C', '#3C4766'],
    wood:   ['#FFFFFF', '#FFF0D2', '#E7C48E', '#B98A55', '#8A5E36', '#5E3E24', '#3B2617'],
    sand:   ['#FFFFFF', '#FFF2D6', '#F2D79E', '#D9B26F', '#B88A4E', '#8A633A', '#5A4028'],
    ash:    ['#FFFFFF', '#F2EEE8', '#D8D0C6', '#B3A89B', '#8C8279', '#655D57', '#433D3B'],
    magN:   ['#FFFFFF', '#FFE3E6', '#FFA3AE', '#FF5A6E', '#D93650', '#8E2238', '#4A1424'],
    magS:   ['#FFFFFF', '#E3EEFF', '#A8C6FF', '#4D8BFF', '#2F5FD9', '#22398E', '#141E4A'],
  };
  const GLOW = {steam: '#CFEFFF', magma: '#FF7A2E', plasma: '#FF7AD9', bloom: '#FF8CC6', mud: '#C9A77E', cloud: '#9FC8F0', wood: '#7ED957', sand: '#F2D79E', zap: '#59C3FF', water: '#3BC9DB',
    nature: '#7ED957', fire: '#FF7A2E', light: '#FFE066', shadow: '#9B7BFF', wind: '#8FE3CC', obsid: '#9C8FC8', ash: '#D8D0C6', magN: '#FF5A6E', magS: '#4D8BFF', stone: '#D9C3A0'};

  // ======================= shared shape tools (FX Bible §2.3) =======================
  const S = {};
  S.white = (g, path) => { g.save(); g.globalCompositeOperation = 'source-over'; g.fillStyle = '#FFFFFF'; path(); g.fill(); g.restore(); };          // F2 white pop silhouette
  S.ring = (g, x, y, rx, col, w, a, sy, rim) => { if (a <= 0 || rx <= 0.2) return; g.save(); g.globalAlpha *= cl(a, 0, 1);
    if (rim) { g.strokeStyle = rim; g.lineWidth = w + 1.6; g.beginPath(); g.ellipse(x, y, rx, rx * (sy || 0.34), 0, 0, TAU); g.stroke(); }
    g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.ellipse(x, y, rx, rx * (sy || 0.34), 0, 0, TAU); g.stroke(); g.restore(); };
  S.dashRing = (g, x, y, rx, col, w, a, sy, broke, seed) => { if (a <= 0) return; const R = rng(seed || 5); g.save(); g.globalAlpha *= cl(a, 0, 1); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round';
    for (let j = 0; j < 20; j++) { if (R() < broke) continue; const a0 = j / 20 * TAU; g.beginPath(); g.ellipse(x, y, rx, rx * (sy || 0.34), 0, a0, a0 + TAU / 20 * (1 - 0.6 * broke)); g.stroke(); } g.restore(); };
  // 💨 lumpy cel puff (3 tones: light top · main · dark bottom) — clouds, steam, dust (F4 · F6)
  // tones = [highlight, light, main, shade, (rim)] — shade shows as the underside band, rim = the day outline (F14)
  S.puff = (g, x, y, r, R3, a, seed, day) => { if (r <= 0.3 || a <= 0) return; const Rn = rng(seed); g.save(); g.globalAlpha *= cl(a, 0, 1);
    const lumps = []; for (let i = 0; i < 5; i++) { const an = -Math.PI / 2 + (i - 2) * 0.62 + (Rn() - 0.5) * 0.3; lumps.push([x + Math.cos(an) * r * 0.55, y + Math.sin(an) * r * 0.42, r * (0.48 + Rn() * 0.22)]); }
    lumps.push([x, y + r * 0.1, r * 0.72]);
    const all = (dx, dy, s) => { g.beginPath(); lumps.forEach(L => { g.moveTo(L[0] + dx + L[2] * s, L[1] + dy); g.arc(L[0] + dx, L[1] + dy, L[2] * s, 0, TAU); }); };
    if (day) { all(0, 0, 1.1); g.fillStyle = R3[4] || R3[3]; g.fill(); }
    all(0, 0, 1); g.fillStyle = R3[3]; g.fill(); all(-r * 0.03, -r * 0.1, 0.93); g.fillStyle = R3[2]; g.fill(); all(-r * 0.1, -r * 0.2, 0.68); g.fillStyle = R3[1]; g.fill(); all(-r * 0.16, -r * 0.27, 0.34); g.fillStyle = R3[0]; g.fill(); g.restore(); };
  // 💧 teardrop along the velocity
  S.drop = (g, x, y, vx, vy, s, cols) => { const a = Math.atan2(vy, vx); g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(s * 1.9, 0); g.quadraticCurveTo(0, -s, -s * 0.2, 0); g.quadraticCurveTo(0, s, s * 1.9, 0);
    g.arc(0, 0, s * 0.9, 0, TAU); g.fillStyle = cols[0]; g.fill(); g.fillStyle = cols[1]; g.beginPath(); g.arc(-s * 0.25, -s * 0.3, s * 0.32, 0, TAU); g.fill(); g.restore(); };
  // 🌿 almond leaf with a mid line
  S.leaf = (g, x, y, s, a, cols) => { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(-s, 0); g.quadraticCurveTo(0, -s * 0.62, s, 0); g.quadraticCurveTo(0, s * 0.62, -s, 0); g.fillStyle = cols[0]; g.fill();
    g.strokeStyle = cols[1]; g.lineWidth = Math.max(0.6, s * 0.12); g.beginPath(); g.moveTo(-s * 0.8, 0); g.lineTo(s * 0.8, 0); g.stroke(); g.restore(); };
  // 🌸 5-petal flower, open 0…1
  S.flower = (g, x, y, s, open, R, a) => { if (s <= 0.3) return; g.save(); g.translate(x, y); g.rotate(a || 0); const o = 0.35 + 0.65 * open;
    for (let i = 0; i < 5; i++) { g.save(); g.rotate(i * TAU / 5); g.beginPath(); g.ellipse(0, -s * 0.55 * o, s * 0.34, s * 0.55 * o, 0, 0, TAU); g.fillStyle = R[3]; g.fill(); g.beginPath(); g.ellipse(0, -s * 0.5 * o, s * 0.2, s * 0.38 * o, 0, 0, TAU); g.fillStyle = R[2]; g.fill(); g.restore(); }
    g.beginPath(); g.arc(0, 0, s * 0.26, 0, TAU); g.fillStyle = '#FFE066'; g.fill(); g.beginPath(); g.arc(-s * 0.06, -s * 0.06, s * 0.1, 0, TAU); g.fillStyle = '#FFFFFF'; g.fill(); g.restore(); };
  // ✦ 4-point glint
  S.star = (g, x, y, s, a, cols) => { if (s <= 0.3) return; g.save(); g.translate(x, y); g.rotate(a || 0); const sh = (r, w) => { g.beginPath(); for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * w : r, an = i * Math.PI / 4 - Math.PI / 2; g.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } g.closePath(); };
    sh(s, 0.24); g.fillStyle = cols[0]; g.fill(); sh(s * 0.6, 0.24); g.fillStyle = cols[1]; g.fill(); sh(s * 0.28, 0.3); g.fillStyle = cols[2] || '#FFFFFF'; g.fill(); g.restore(); };
  // ⚡ a jag line (midpoint displacement) drawn in 3 passes
  S.jag = (ax, ay, bx, by, rough, depth, R) => { const pts = [[ax, ay], [bx, by]]; for (let d = 0; d < depth; d++) for (let i = pts.length - 1; i > 0; i--) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], L = Math.hypot(x1 - x0, y1 - y0) || 1, off = (R() - 0.5) * L * rough;
      pts.splice(i, 0, [(x0 + x1) / 2 - (y1 - y0) / L * off, (y0 + y1) / 2 + (x1 - x0) / L * off]); } return pts; };
  S.bolt = (g, pts, w, Rp, a, P) => { if (a <= 0) return; g.save(); g.lineCap = 'round'; g.lineJoin = 'round'; lite(g, P); const line = () => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); };
    line(); if (P.day) { g.strokeStyle = rgba(Rp[6], 0.85 * a); g.lineWidth = w * 2.6 + 1.5; g.stroke(); } g.strokeStyle = rgba(Rp[4], 0.35 * a); g.lineWidth = w * 3.2; g.stroke();
    g.strokeStyle = rgba(Rp[3], 0.9 * a); g.lineWidth = w * 1.5; g.stroke(); g.strokeStyle = rgba(Rp[0], a); g.lineWidth = Math.max(0.8, w * 0.55); g.stroke(); g.restore(); };
  // 🔥 tongue (FX Bible fire shape) in 4 cel bands
  S.flame = (g, x, y, w, h, s, Rp, a, cool) => { if (h <= 0.5 || a <= 0) return; const c0 = cool || 0; g.save(); g.globalAlpha *= a; const tg = (ww, hh, ss, col) => { g.beginPath(); g.moveTo(x - ww / 2, y);
      g.bezierCurveTo(x - ww * 0.6, y - hh * 0.35, x - ww * 0.15 + ss * 0.4, y - hh * 0.62, x + ss, y - hh); g.bezierCurveTo(x + ww * 0.2 + ss * 0.5, y - hh * 0.55, x + ww * 0.62, y - hh * 0.3, x + ww / 2, y); g.quadraticCurveTo(x, y + ww * 0.18, x - ww / 2, y); g.fillStyle = col; g.fill(); };
    tg(w, h, s, Rp[Math.min(6, 4 + c0)]); tg(w * 0.78, h * 0.82, s * 0.9, Rp[Math.min(6, 3 + c0)]); tg(w * 0.55, h * 0.6, s * 0.75, Rp[Math.min(6, 2 + c0)]); tg(w * 0.3, h * 0.36, s * 0.5, Rp[Math.min(6, c0)]); g.restore(); };
  // 🌪️ unrolling curl line
  S.curl = (g, x, y, r, a0, turn, w, col, a) => { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath();
    for (let i = 0; i <= 18; i++) { const q = i / 18, an = a0 + q * turn, rr = r * (1 - q * 0.75); const X = x + Math.cos(an) * rr, Y = y + Math.sin(an) * rr * 0.6; i ? g.lineTo(X, Y) : g.moveTo(X, Y); } g.stroke(); g.restore(); };
  // 🪨 faceted pebble
  S.pebble = (g, x, y, s, a, Rp) => { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(-s, -s * 0.2); g.lineTo(-s * 0.4, -s * 0.8); g.lineTo(s * 0.6, -s * 0.6); g.lineTo(s, s * 0.1); g.lineTo(s * 0.3, s * 0.75); g.lineTo(-s * 0.7, s * 0.5); g.closePath();
    g.fillStyle = Rp[4]; g.fill(); g.beginPath(); g.moveTo(-s, -s * 0.2); g.lineTo(-s * 0.4, -s * 0.8); g.lineTo(s * 0.6, -s * 0.6); g.lineTo(s * 0.2, -s * 0.05); g.closePath(); g.fillStyle = Rp[2]; g.fill(); g.restore(); };
  // 💥 seeded spark dashes from a point (white → ramp, gravity, F3)
  S.sparks = (g, x, y, n, q, Rp, k, seed, spread, up, P) => { const Rn = rng(seed); g.save(); lite(g, P); g.lineCap = 'round';
    for (let i = 0; i < n; i++) { const an = -Math.PI / 2 * (up ? 1 : 0) + (Rn() - 0.5) * (spread || TAU), v = (60 + Rn() * 120) * k, life = 0.5 + Rn() * 0.5, u = q / life; if (u >= 1) continue;
      const tt = u * life, X = x + Math.cos(an) * v * tt, Y = y + Math.sin(an) * v * tt + 210 * k * tt * tt, vx = Math.cos(an) * v, vy = Math.sin(an) * v + 420 * k * tt, L = 0.03;
      g.strokeStyle = rampAt(Rp, 0.05 + u * 0.75); g.lineWidth = Math.max(0.6, 2 * k * (1 - u)); g.beginPath(); g.moveTo(X, Y); g.lineTo(X - vx * L, Y - vy * L); g.stroke(); } g.restore(); };
  // ⚪ white pop (F2) — 1–2 frames, calm = none, in the burst's OWN shape: 'star' (impact) · 'crown' (a splash) · 'flower' · 'ring'
  S.popPath = (g, x, y, r, shape) => { g.beginPath();
    if (shape === 'ring') { g.arc(x, y, r, 0, TAU); g.arc(x, y, r * 0.62, 0, TAU, true); return; }
    if (shape === 'flower') { for (let i = 0; i < 5; i++) { const an = i / 5 * TAU - Math.PI / 2; g.moveTo(x, y); g.ellipse(x + Math.cos(an) * r * 0.5, y + Math.sin(an) * r * 0.5, r * 0.5, r * 0.3, an, 0, TAU); } g.moveTo(x + r * 0.35, y); g.arc(x, y, r * 0.35, 0, TAU); return; }
    if (shape === 'crown') { const n = 7; g.moveTo(x - r, y + r * 0.25); for (let i = 0; i <= n; i++) { const q = i / n, px = x - r + q * r * 2, tall = r * (0.55 + 0.5 * Math.sin(q * Math.PI)) * (i % 2 ? 0.55 : 1.1); g.lineTo(px, y - tall); if (i < n) g.lineTo(px + r / n, y - tall * 0.35); } g.lineTo(x + r, y + r * 0.25); g.quadraticCurveTo(x, y + r * 0.5, x - r, y + r * 0.25); return; }
    const n = 8; for (let i = 0; i <= n * 2; i++) { const an = i / (n * 2) * TAU - Math.PI / 2, rr = i % 2 ? r * 0.42 : r * (i % 4 ? 0.8 : 1); i ? g.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr) : g.moveTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } g.closePath(); };
  S.pop = (g, P, x, y, r, t, at, shape) => { if (P.calm || t < at || t > at + 0.05 || r <= 0) return false; S.white(g, () => S.popPath(g, x, y, r, shape)); return true; };
  const endK = (t, life, d) => 1 - inQ(seg(t, life - (d || 0.3), life));        // F5 hand-over: the cast's lingering part shrinks away while its .field grows in
  // 🏷️ fusion science line (EN) — the 🔬 card itself is 🧳 / StoryKit's; Motion only hands the id
  const FUSE = {}, PAIRS = {};
  function add(a, b, id, info) { const key = [a, b].sort().join('+'); FUSE[key] = Object.assign({id, kind: 'fuse.' + id, pair: [a, b]}, info); PAIRS[id] = FUSE[key]; }
  M.fuse = (a, b) => { const f = FUSE[[a, b].sort().join('+')]; return f ? f.id : null; };
  M.FUSE = FUSE; M.FUSE_OF = PAIRS; M.FUSE_TOOLS = {S, RAMP, GLOW, lite, seg, bell, cl, lerp, mix};
  M._fuseAdd = add;
  // ⛈️ 🌼 multi-target casts fire ONE onContact (F10) at the first hop / landing — Motion.hopAt(E, i) = the absolute time of hop / landing i (0-based) for the game's own per-target hits
  M.hopAt = (E, i) => { const k = E && E.kind; i = i || 0; return E.t0 + (k === 'fuse.storm' ? 0.2 + i * 0.11 : k === 'fuse.drift' ? 0.85 + i * 0.04 : (E.contact || 0)); };

  // ======================= ♨️ STEAM (fire + water) — big 1.25 s, ONE contact 220 ms = the push =======================
  // 🧠 real steam: water hits heat → boils → the vapour takes ~1,700× the space, so it BURSTS out + up, hot first (warm glow, F3) then cool white,
  //    then the cloud thins by breaking into wisps (F5). Shape: lumpy cel puffs (F4) in a dome; both parents show: 🔥 orange under-glow + 💧 hot droplets.
  //    gather 0–220 (a flame + a drop spiral in, squash before they touch) → ⚪ pop 220 (the cloud's own silhouette, 1 frame, calm none)
  //    → burst 255–550 (outBack, push ring + speed lines) → linger 550–900 (rise, boil) → break 900–1250 (each puff splits in 3, shrinks to curls)
  add('fire', 'water', 'steam', {field: true, sci: 'water boils at 100 °C — steam takes ~1,700× more space'});
  const HOT = ['#FFFFFF', '#FFF6E0', '#FFD9A8', '#FFB07A', '#F08A6A', '#B8604E', '#6E3A40'];
  const mixR = (A, B, q) => A.map((c, i) => mix(c, B[i], q));
  function steamPuffs(P, cx, cy, t, n) {                 // pure on t: the puff list of the cloud (also used for the ⚪ silhouette)
    const k = P.k, Rn = rng(P.seed + 77), out = [], u = seg(t, 0.255, 1.25), grow = outBack(seg(t, 0.2, 0.52)), brk = seg(t, 0.86, 1.25);
    for (let i = 0; i < n; i++) {
      const side = (i / (n - 1) - 0.5) * 2, an = -Math.PI / 2 + side * 1.35 + (Rn() - 0.5) * 0.25, far = 0.55 + Rn() * 0.5, ring = i % 3 === 0 ? 0.55 : 1;
      const D = (14 + 44 * grow * far * ring) * k + 12 * k * outQ(seg(t, 0.5, 1.25)) * Math.abs(side);
      const boil = 1 + 0.07 * Math.sin(t * 9 + i * 2.1), rise = (6 + 26 * Rn()) * k * outQ(seg(t, 0.35, 1.25));
      const r = (11 + 11 * Rn()) * k * (0.35 + 0.65 * grow) * boil * (1 - 0.25 * Math.abs(side) * (1 - ring)) * (i % 4 === 1 ? 1.3 : 1);
      out.push({x: cx + Math.cos(an) * D * 1.3, y: cy + Math.sin(an) * D * 0.72 - rise, r, i, side, seed: P.seed + i * 13, brk}); }
    return out; }
  function drawSteamPuff(g, P, p, t, tones, hot) {
    const k = P.k;
    if (p.brk <= 0) { S.puff(g, p.x, p.y, p.r, tones, 1, p.seed, P.day); return; }
    const b = p.brk, Rn = rng(p.seed + 5);                                                                                // F5: split in 3, drift apart, shrink → wisps
    for (let j = 0; j < 3; j++) { const an = -Math.PI / 2 + (j - 1) * 1.4 + (Rn() - 0.5) * 0.6, d = p.r * (0.2 + 0.9 * outQ(b)), rr = p.r * (0.66 - 0.1 * j) * (1 - b * b * 0.85);
      const wx = p.x + Math.cos(an) * d, wy = p.y + Math.sin(an) * d * 0.7 - 12 * k * b; if (b < 0.8) S.puff(g, wx, wy, rr, tones, 1, p.seed + j, P.day);
      if (b > 0.5 && j === 1 && p.i % 2 === 0) S.curl(g, wx, wy - 4 * k * b, (6 + 7 * b) * k, -1.2 + b * 2.5, 4.2, 2 * k * (1 - b * 0.5), tones[1], seg(b, 0.5, 0.7) * (1 - seg(b, 0.82, 1))); } }
  M.fxAdd('fuse.steam', {el: 'water', life: 1.25, contact: 0.22, flashAt: 0.22, shake: [0.22, 2, 140], draw(g, P, t) {
    const k = P.k, x = P.x, cy = P.y - 30 * k, dir = P.dir || 1, Rs = RAMP.steam, Rf = RAMP.fire, Rw = RAMP.water, n = P.calm ? 7 : 12;
    if (t < 0.22) {                                                                                                   // ① gather: flame + drop spiral in, squash right before they meet
      const q = t / 0.22, e = inQ(q), sq = 1 - 0.35 * seg(q, 0.7, 1);
      for (let s2 = -1; s2 <= 1; s2 += 2) { const an = (s2 < 0 ? Math.PI : 0) + s2 * (1 - e) * 0.9, d = 44 * k * (1 - e), px = x + Math.cos(an) * d * dir, py = cy + Math.sin(an) * d * 0.5;
        const tr = d > 2 ? 3 : 0; for (let j = tr; j > 0; j--) { const e2 = inQ(Math.max(0, q - j * 0.06)), an2 = (s2 < 0 ? Math.PI : 0) + s2 * (1 - e2) * 0.9, d2 = 44 * k * (1 - e2);   // short trail = the path
          g.fillStyle = rgba(s2 < 0 ? Rf[3] : Rw[3], 0.35 / j); g.beginPath(); g.arc(x + Math.cos(an2) * d2 * dir, cy + Math.sin(an2) * d2 * 0.5, 3 * k, 0, TAU); g.fill(); }
        if (s2 < 0) { g.save(); g.translate(px, py); g.scale(1 / sq, sq); S.flame(g, 0, 7 * k, 11 * k, 20 * k, 2 * k * Math.sin(t * 30), Rf, 1); g.restore(); }
        else { g.save(); g.translate(px, py); g.scale(1 / sq, sq); S.drop(g, 0, 0, -dir, 0.15, 6 * k, [Rw[3], Rw[0]]); g.restore(); } }
      T.glow(g, x, cy, 34 * k * e, GLOW.steam, 0.65 * e);
      if (!P.calm) for (let i = 0; i < 3; i++) S.curl(g, x + (i - 1) * 10 * k, cy - 10 * k - 14 * k * q, 6 * k, t * 12 + i, 3.4, 1.2 * k, Rs[2], 0.7 * q);   // hiss wisps
      return; }
    const puffs = steamPuffs(P, x, cy, t, n);
    if (!P.calm && t < 0.255) { S.white(g, () => { g.beginPath(); puffs.forEach(p => { g.moveTo(p.x + p.r * 1.15, p.y); g.arc(p.x, p.y, p.r * 1.15, 0, TAU); }); }); return; }   // ② ⚪ the cloud's own silhouette
    const u = seg(t, 0.255, 1.25), hot = 1 - seg(t, 0.255, 0.6), tones = mixR(Rs, HOT, hot);
    T.glow(g, x, cy, 64 * k * (1 - u * 0.5), hot > 0.2 ? '#FFB07A' : GLOW.steam, 0.5 * (1 - u));
    const pr = outQ(seg(t, 0.22, 0.75));                                                                              // ③ the PUSH: ground ring + speed lines outward (both sides)
    S.ring(g, x, P.y, (20 + 86 * pr) * k, Rs[1], 3.2 * k * (1 - pr), 1 - pr, 0.34, P.day ? Rs[6] : null);
    S.dashRing(g, x, P.y, (12 + 62 * outQ(seg(t, 0.26, 0.8))) * k, Rs[2], 2 * k, 1 - seg(t, 0.26, 0.8), 0.34, seg(t, 0.4, 0.8), P.seed);
    if (!P.calm) { g.save(); lite(g, P); g.lineCap = 'round'; for (let i = 0; i < 10; i++) { const an = Math.PI + (i / 9) * Math.PI + 0.15 * Math.sin(i * 3), sp = seg(t, 0.24 + (i % 3) * 0.02, 0.62), r0 = (30 + 70 * outQ(sp)) * k, L = 20 * k * (1 - sp);
      if (sp <= 0 || sp >= 1) continue; g.strokeStyle = rgba(P.day ? Rs[5] : Rs[1], 0.9 * (1 - sp)); g.lineWidth = 2.2 * k * (1 - sp * 0.5); g.beginPath(); g.moveTo(x + Math.cos(an) * r0, cy + Math.sin(an) * r0 * 0.55); g.lineTo(x + Math.cos(an) * (r0 + L), cy + Math.sin(an) * (r0 + L) * 0.55); g.stroke(); } g.restore(); }
    puffs.forEach(p => { if (hot > 0) T.glow(g, p.x, p.y + p.r * 0.5, p.r * 1.3, '#FF9A4A', 0.55 * hot); });                       // 🔥 parent: the warm under-glow cools first (F3)
    puffs.sort((a, b) => a.y - b.y).forEach(p => drawSteamPuff(g, P, p, t, [tones[0], tones[1], tones[2], tones[4], tones[6]], hot));
    const Rn = rng(P.seed + 3); for (let i = 0; i < (P.calm ? 4 : 9); i++) {                                                  // 💧 parent: hot droplets arc out + fall (cool as they go)
      const an = -Math.PI / 2 + (Rn() - 0.5) * 2.8, v = (80 + 90 * Rn()) * k, tt = (t - 0.24) * (0.8 + Rn() * 0.4); if (tt <= 0 || tt > 0.55) continue;
      const px = x + Math.cos(an) * v * tt, py = cy + Math.sin(an) * v * tt + 300 * k * tt * tt; S.drop(g, px, py, Math.cos(an), Math.sin(an) + tt * 6, 2.4 * k * (1 - tt / 0.55 * 0.5), [mix(Rw[3], '#FFB07A', hot), Rw[0]]); }
  }});
  // ♨️ field = the steam VEIL that hides the party (Avateer: "hide 1 turn") — a rolling bank at the feet (back row behind the bodies, low front row in front, F11: never over a face) + wisps
  function veilRow(g, P, x, y, W, t, n, rr, tones, seed, a, grow) { const Rn = rng(seed), k = P.k;
    for (let i = 0; i < n; i++) { const q = n > 1 ? i / (n - 1) : 0.5, roll = Math.sin(t * 0.9 + i * 1.7) * 5 * k, px = x - W + q * W * 2 + roll, r = rr * k * (0.75 + 0.4 * Rn()) * (1 + 0.06 * Math.sin(t * 2.2 + i)) * grow;
      S.puff(g, px, y - r * 0.35 - Math.abs(Math.sin(t * 0.7 + i)) * 3 * k, r, tones, a, seed + i * 7, P.day); } }
  M.fxAdd('fuse.steam.field', {el: 'water', life: 1.6, loop: true, contact: 0.2, back(g, P, t) {
    const k = P.k, W = (P.r || 70) * k, grow = outBack(seg(t, 0, 0.5)); veilRow(g, P, P.x, P.y - 10 * k, W, t, P.calm ? 4 : 7, 19, [RAMP.steam[1], RAMP.steam[2], RAMP.steam[3], RAMP.steam[4], RAMP.steam[6]], P.seed, 0.95, grow); },
    draw(g, P, t) { const k = P.k, W = (P.r || 70) * k, grow = outBack(seg(t, 0.1, 0.6)), Rs = RAMP.steam, Rn = rng(P.seed + 9);
      veilRow(g, P, P.x + 12 * k, P.y + 4 * k, W * 1.05, t + 3, P.calm ? 4 : 7, 12, [Rs[0], Rs[1], Rs[2], Rs[4], Rs[6]], P.seed + 50, 1, grow);
      for (let i = 0; i < (P.calm ? 3 : 6); i++) { const life = 1.8 + Rn(), q = ((t + Rn() * life) % life) / life, wx = P.x + (Rn() - 0.5) * W * 1.8 + Math.sin(t + i) * 6 * k;   // wisps rise from the bank and curl away
        S.curl(g, wx, P.y - 12 * k - q * 46 * k, (5 + 5 * q) * k, i + t * 1.5, 4, 1.6 * k * (1 - q * 0.5), Rs[1], bell(q) * 0.9 * grow); } }});

  // ======================= 🌋 MAGMA (fire + stone) — big 1.3 s, contact 140 =======================
  // the ground cracks glow → ⚪ pop → magma blobs ERUPT + fall → a pool spreads on the ground ellipse · field = the pool (bubbles · crust plates) · 'fuse.magma.wall' = it cools to an obsidian wall
  add('fire', 'stone', 'magma', {field: true, wall: 'fuse.magma.wall', sci: 'rock melts at ~700–1,200 °C; lava that cools fast becomes glassy obsidian'});
  function pool(g, P, x, y, rx, t, a, crust) { const k = P.k, Rm = RAMP.magma, ry = rx * 0.34, Rn = rng(P.seed + 9); if (rx <= 1) return; g.save(); g.globalAlpha *= a;
    const blob = (s) => { g.beginPath(); for (let i = 0; i <= 24; i++) { const an = i / 24 * TAU, w = 1 + 0.08 * Math.sin(an * 3 + P.seed) + 0.05 * Math.sin(an * 5 + t * 1.5); g.lineTo(x + Math.cos(an) * rx * s * w, y + Math.sin(an) * ry * s * w); } g.closePath(); };
    blob(1.06); g.fillStyle = Rm[6]; g.fill(); blob(1); g.fillStyle = Rm[4]; g.fill(); blob(0.78); g.fillStyle = Rm[3]; g.fill(); blob(0.5); g.fillStyle = Rm[2]; g.fill();
    T.glow(g, x, y, rx * 1.3, GLOW.magma, 0.55 * a, 0.45);
    g.fillStyle = rgba(Rm[6], 0.85 * crust); for (let i = 0; i < 6; i++) { const an = Rn() * TAU, d = Rn() * 0.7, px = x + Math.cos(an) * rx * d + Math.sin(t * 0.4 + i) * 2 * k, py = y + Math.sin(an) * ry * d, s = (5 + 5 * Rn()) * k;   // crust plates drift
      g.beginPath(); g.moveTo(px - s, py); g.lineTo(px - s * 0.3, py - s * 0.35); g.lineTo(px + s, py - s * 0.15); g.lineTo(px + s * 0.4, py + s * 0.3); g.closePath(); g.fill(); }
    for (let i = 0; i < 4; i++) { const life = 0.9 + Rn() * 0.6, ph = Rn() * life, q = ((t + ph) % life) / life, an = Rn() * TAU, d = Rn() * 0.6, bx = x + Math.cos(an) * rx * d, by = y + Math.sin(an) * ry * d;   // bubbles swell + POP
      const r = (2 + 4 * q) * k; if (q < 0.85) { g.fillStyle = Rm[2]; g.beginPath(); g.arc(bx, by - r * 0.5, r, Math.PI, TAU); g.fill(); g.fillStyle = Rm[0]; g.beginPath(); g.arc(bx - r * 0.3, by - r * 0.9, r * 0.3, 0, TAU); g.fill(); }
      else S.ring(g, bx, by, r * 1.6, Rm[1], 1.2 * k, (1 - q) / 0.15, 0.4); }
    g.restore(); }
  M.fxAdd('fuse.magma', {el: 'fire', life: 1.3, contact: 0.14, flashAt: 0.14, shake: [0.14, 3, 200], draw(g, P, t) {
    const k = P.k, x = P.x, y = P.y, Rm = RAMP.magma, Rs = RAMP.stone, Rn = rng(P.seed);
    if (t < 0.14) { const q = t / 0.14; g.save(); g.strokeStyle = Rm[2]; g.lineWidth = 2.2 * k; g.lineCap = 'round'; for (let i = 0; i < 5; i++) { const an = i / 5 * TAU + 0.3, L = 30 * k * outQ(q); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an) * L, y + Math.sin(an) * L * 0.34); g.stroke(); } g.restore();
      T.glow(g, x, y, 34 * k * q, GLOW.magma, 0.7 * q, 0.5); return; }
    if (S.pop(g, P, x, y - 10 * k, 30 * k, t, 0.14, 'crown')) return;
    const u = seg(t, 0.14, 1.3); pool(g, P, x, y, (18 + 42 * outBack(seg(u, 0, 0.45))) * k * (0.6 + 0.4 * endK(t, 1.3)), t, endK(t, 1.3), seg(u, 0.5, 1));
    const n = P.calm ? 5 : 10; for (let i = 0; i < n; i++) { const an = -Math.PI / 2 + (Rn() - 0.5) * 1.6, v = (90 + 90 * Rn()) * k, life = 0.55 + Rn() * 0.35, q = (t - 0.14) / life; if (q >= 1 || q < 0) continue;   // blobs arc up + fall back in
      const tt = q * life, bx = x + Math.cos(an) * v * tt * 0.6, by = y - 12 * k + Math.sin(an) * v * tt + 300 * k * tt * tt, s = (4 + 4 * Rn()) * k * (1 - q * 0.4);
      g.fillStyle = Rm[5]; g.beginPath(); g.arc(bx, by, s * 1.15, 0, TAU); g.fill(); g.fillStyle = rampAt(Rm, 0.35 + q * 0.4); g.beginPath(); g.arc(bx, by, s, 0, TAU); g.fill(); g.fillStyle = Rm[1]; g.beginPath(); g.arc(bx - s * 0.3, by - s * 0.3, s * 0.35, 0, TAU); g.fill(); }
    for (let i = 0; i < (P.calm ? 2 : 4); i++) S.pebble(g, x + (Rn() - 0.5) * 60 * k, y - 10 * k - 40 * k * bell(seg(u, 0, 0.6)) * (0.5 + Rn()), 4 * k, t * 6 + i, Rs);   // rock chunks (stone parent)
    T.embers(g, x, y - 10 * k, 50 * k, 70 * k, P.calm ? 4 : 9, t, {ramp: Rm}, P.seed + 1, 1 - u, 2 * k);
  }});
  M.fxAdd('fuse.magma.field', {el: 'fire', life: 1, loop: true, contact: 0, draw(g, P, t) { pool(g, P, P.x, P.y, (P.r || 60) * P.k * outBack(seg(t, 0, 0.35)), t, 1, 1); T.embers(g, P.x, P.y, (P.r || 60) * P.k, 50 * P.k, P.calm ? 2 : 5, t, {ramp: RAMP.magma}, P.seed, 0.8, 1.8 * P.k); }});
  M.fxAdd('fuse.magma.wall', {el: 'stone', life: 1.1, contact: 0.32, draw(g, P, t) {                                                    // cools: the pool darkens → obsidian shards SNAP up in a row (ice-like, no overshoot) → a shine slides
    const k = P.k, x = P.x, y = P.y, Ro = RAMP.obsid, W = (P.r || 60) * k, u = seg(t, 0, 0.32), n = P.calm ? 5 : 7, Rn = rng(P.seed);
    pool(g, P, x, y, W * (1 - 0.2 * u), t, 1 - seg(t, 0.2, 0.5), 1);
    for (let i = 0; i < n; i++) { const fx = (i / (n - 1) - 0.5) * 2, sx = x + fx * W * 0.9, h = (34 + 26 * Rn()) * k * (1 - Math.abs(fx) * 0.4) * (1 - (1 - seg(t, 0.12 + i * 0.03, 0.32 + i * 0.03)) ** 4), w = (10 + 6 * Rn()) * k;
      if (h <= 1) continue; g.beginPath(); g.moveTo(sx - w, y); g.lineTo(sx - w * 0.2, y - h); g.lineTo(sx + w * 0.4, y - h * 0.82); g.lineTo(sx + w, y); g.closePath(); g.fillStyle = Ro[4]; g.fill();
      g.beginPath(); g.moveTo(sx - w, y); g.lineTo(sx - w * 0.2, y - h); g.lineTo(sx, y); g.closePath(); g.fillStyle = Ro[2]; g.fill(); g.strokeStyle = Ro[6]; g.lineWidth = 1.2 * k; g.beginPath(); g.moveTo(sx - w, y); g.lineTo(sx - w * 0.2, y - h); g.lineTo(sx + w * 0.4, y - h * 0.82); g.lineTo(sx + w, y); g.stroke();
      const sh = seg(t, 0.5 + i * 0.05, 0.75 + i * 0.05); if (sh > 0 && sh < 1) { g.save(); g.globalAlpha *= bell(sh); g.strokeStyle = Ro[0]; g.lineWidth = 2 * k; g.beginPath(); g.moveTo(sx - w * 0.6, y - h * 0.2 - h * 0.6 * sh); g.lineTo(sx - w * 0.3, y - h * 0.35 - h * 0.6 * sh); g.stroke(); g.restore(); } }
    if (t > 0.32 && t < 0.7) S.sparks(g, x, y - 20 * k, P.calm ? 3 : 6, t - 0.32, RAMP.magma, k, P.seed + 2, Math.PI, true, P);
  }});

  // ======================= 🔥🌪️ FIRESTORM (fire + wind) — big 1.4 s, travels to {to}, contact on arrival 0.75 =======================
  add('fire', 'wind', 'firestorm', {sci: 'fire needs heat + fuel + OXYGEN — wind brings more oxygen, so fire grows'});
  function twister(g, P, x, y, h, t, a, grow) { const k = P.k, Rf = RAMP.fire, Rw = RAMP.wind, n = P.calm ? 6 : 10; if (h <= 2) return; g.save(); g.globalAlpha *= a;
    T.glow(g, x, y - h * 0.5, h * 0.7, GLOW.fire, 0.55, 1.2);
    for (let i = 0; i < n; i++) { const q = i / (n - 1), w = (10 + 34 * q) * k * grow, yy = y - q * h, ph = t * 9 + i * 0.9, sway = Math.sin(t * 3 + q * 4) * 8 * k * q;   // stacked spiral bands = TONGUES drawn sideways (wind curls made of fire)
      const front = Math.sin(ph) > 0, col = front ? rampAt(Rf, 0.2 + q * 0.35) : rampAt(Rf, 0.55 + q * 0.3);
      g.save(); g.translate(x + sway, yy); g.scale(1, 0.34); g.beginPath(); g.arc(0, 0, w, ph % TAU, ph % TAU + 2.2); g.strokeStyle = col; g.lineWidth = (5 + 4 * (1 - q)) * k; g.lineCap = 'round'; g.stroke(); g.restore(); }
    S.flame(g, x + Math.sin(t * 3) * 6 * k, y - h * 0.86, 18 * k * grow, h * 0.35, Math.sin(t * 11) * 4 * k, Rf, 0.9);
    for (let i = 0; i < 3; i++) S.curl(g, x + (i - 1) * 26 * k, y - h * (0.3 + i * 0.2), 16 * k, t * 6 + i * 2, 4.2, 1.8 * k, Rw[2], 0.7);            // wind curls round it (wind parent)
    g.restore(); }
  M.fxAdd('fuse.firestorm', {el: 'fire', life: 1.4, contact: 0.75, draw(g, P, t) {
    const k = P.k, to = P.to || [P.x + 140 * k, P.y], u = seg(t, 0.1, 0.75), px = lerp(P.x, to[0], outQ(u)), py = lerp(P.y, to[1], outQ(u)) - 30 * k * bell(u);
    const grow = outBack(seg(t, 0, 0.25)), end = seg(t, 0.95, 1.4); twister(g, P, px, py, 90 * k * grow * (1 - end * 0.6), t, 1 - end, grow * (1 + end * 0.5));
    S.ring(g, px, py, 30 * k * grow, RAMP.fire[3], 2.5 * k, 0.7 * (1 - end), 0.34);
    if (t > 0.75) { const q = seg(t, 0.75, 1.4); S.sparks(g, to[0], to[1] - 30 * k, P.calm ? 6 : 12, t - 0.75, RAMP.fire, k, P.seed, Math.PI * 1.2, true, P); T.embers(g, to[0], to[1], 50 * k, 90 * k, P.calm ? 4 : 10, t, {ramp: RAMP.fire}, P.seed + 4, 1 - q, 2.2 * k); }
    if (S.pop(g, P, to[0], to[1] - 30 * k, 28 * k, t, 0.75, 'star')) return;
  }});

  // ======================= 🌲 FIRE SEEDS (fire + nature) — big 1.6 s, contact 0.9 (the seeds are ready) =======================
  add('fire', 'nature', 'seeds', {field: true, sci: 'some pine cones only open in a fire’s heat — the forest grows back from the ash'});
  function sapling(g, P, x, y, s, t, i, Rn2) { const Rn = RAMP.nature, k = P.k; if (s <= 0.05) return; const h = 22 * k * s, sw = Math.sin(t * 2.4 + i) * 2 * k * s;
    g.save(); g.strokeStyle = P.day ? RAMP.wood[6] : RAMP.wood[4]; g.lineWidth = (P.day ? 2.6 : 2) * k * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + sw * 0.3, y - h * 0.6, x + sw, y - h); g.stroke();
    S.leaf(g, x + sw - 5 * k * s, y - h * 0.75, 6 * k * s, -0.5, [Rn[3], Rn[5]]); S.leaf(g, x + sw + 5 * k * s, y - h * 0.9, 6 * k * s, 0.5 + Math.PI, [Rn[2], Rn[5]]);
    S.star(g, x + sw, y - h - 3 * k, 3.6 * k * s * (0.7 + 0.3 * Math.sin(t * 5 + i)), t * 0.8, [Rn[2], Rn[1], '#FFFFFF']); g.restore(); }
  M.fxAdd('fuse.seeds', {el: 'nature', life: 1.6, contact: 0.9, draw(g, P, t) {
    const k = P.k, x = P.x, y = P.y, Rf = RAMP.fire, Ra = RAMP.ash, n = P.calm ? 3 : 5, Rn = rng(P.seed);
    const f = 1 - seg(t, 0.2, 0.6); if (f > 0) { for (let i = 0; i < 3; i++) S.flame(g, x + (i - 1) * 16 * k, y, 16 * k, (30 + 10 * i % 2) * k * outBack(seg(t, 0, 0.15)) * f, Math.sin(t * 10 + i) * 4 * k, Rf, f); T.glow(g, x, y - 20 * k, 50 * k, GLOW.fire, 0.6 * f); }
    const ash = seg(t, 0.3, 0.9); if (ash > 0) { g.save(); g.fillStyle = rgba(Ra[5], 0.42 * (1 - seg(t, 1.2, 1.6))); g.beginPath(); g.ellipse(x, y, 46 * k * outQ(ash), 15 * k * outQ(ash), 0, 0, TAU); g.fill(); g.fillStyle = rgba(Ra[3], 0.45); g.beginPath(); g.ellipse(x - 4 * k, y - 2 * k, 30 * k * outQ(ash), 9 * k * outQ(ash), 0, 0, TAU); g.fill(); if (P.day) S.ring(g, x, y, 46 * k * outQ(ash), Ra[6], 1.2 * k, 0.6, 15 / 46); g.restore();
      for (let i = 0; i < (P.calm ? 5 : 10); i++) { const fx = x + (Rn() - 0.5) * 80 * k + Math.sin(t * 3 + i) * 5 * k, fy = y - 70 * k * (1 - ash) - Rn() * 20 * k; if (ash < 1) { g.fillStyle = Ra[2]; g.beginPath(); g.arc(fx, fy, 1.6 * k, 0, TAU); g.fill(); } } }
    if (t > 0.6) { const Rr = rng(P.seed + 5); for (let i = 0; i < n; i++) { const sx = x + (i / (n - 1) - 0.5) * 70 * k + (Rr() - 0.5) * 8 * k, s = outBack(seg(t, 0.6 + i * 0.06, 0.95 + i * 0.06)); sapling(g, P, sx, y + (Rr() - 0.5) * 6 * k, s * endK(t, 1.6), t, i); } }   // cones POP open → saplings spring up
    if (S.pop(g, P, x, y - 14 * k, 20 * k, t, 0.9, 'star')) return;
    if (t > 0.9) { const q = seg(t, 0.9, 1.6); for (let i = 0; i < (P.calm ? 3 : 6); i++) { const an = i / 6 * TAU, d = 30 * k * outQ(q); S.star(g, x + Math.cos(an) * d, y - 20 * k - 30 * k * q + Math.sin(an) * d * 0.4, 4 * k * (1 - q), q * 3, [RAMP.nature[2], RAMP.nature[1], '#FFFFFF']); } }
  }});
  M.fxAdd('fuse.seeds.field', {el: 'nature', life: 1, loop: true, contact: 0, draw(g, P, t) { const Rn = rng(P.seed), k = P.k, n = P.calm ? 3 : 5; for (let i = 0; i < n; i++) sapling(g, P, P.x + (i / (n - 1) - 0.5) * (P.r || 40) * 1.8 * k + (Rn() - 0.5) * 6 * k, P.y, outBack(seg(t, i * 0.05, 0.4 + i * 0.05)), t, i); }});

  // ======================= ☀️ PLASMA (fire + zap) — big 1.1 s, a piercing beam along a line, contact 0.3 =======================
  add('fire', 'zap', 'plasma', {sci: 'gas heated hot enough becomes plasma — lightning and the Sun are plasma'});
  M.fxAdd('fuse.plasma', {el: 'zap', life: 1.1, contact: 0.3, flashAt: 0.3, draw(g, P, t) {
    const k = P.k, x = P.x + (P.dir || 1) * 14 * k, y = P.y - (P.h || 36) * k, to = P.to || [P.x + 260 * k, y], Rp = RAMP.plasma, Rf = RAMP.fire, ang = Math.atan2(to[1] - y, to[0] - x), L = Math.hypot(to[0] - x, to[1] - y);
    if (t < 0.3) { const q = t / 0.3, Rn = rng(P.seed); T.glow(g, x, y, 34 * k * q, GLOW.plasma, 0.8 * q);                                   // gather: fire + zap motes spiral IN to a plasma ball
      for (let i = 0; i < (P.calm ? 5 : 10); i++) { const an = Rn() * TAU + q * 4, d = 44 * k * (1 - q) * (0.6 + Rn() * 0.6); g.fillStyle = i % 2 ? Rf[2] : RAMP.zap[2]; g.beginPath(); g.arc(x + Math.cos(an) * d, y + Math.sin(an) * d, 1.8 * k, 0, TAU); g.fill(); }
      g.fillStyle = Rp[3]; g.beginPath(); g.arc(x, y, 9 * k * outBack(q), 0, TAU); g.fill(); g.fillStyle = Rp[1]; g.beginPath(); g.arc(x, y, 5 * k * outBack(q), 0, TAU); g.fill(); return; }
    const u = seg(t, 0.3, 1.1), w = 14 * k * (1 - inQ(seg(u, 0.4, 1))) * (t < 0.35 ? 1.4 : 1);
    if (!P.calm && t < 0.35) { S.white(g, () => { g.save(); g.translate(x, y); g.rotate(ang); g.beginPath(); g.rect(0, -w * 0.9, L, w * 1.8); g.restore(); }); return; }
    g.save(); g.translate(x, y); g.rotate(ang); lite(g, P);
    if (w > 0.4) { const band = (ww, col) => { g.beginPath(); g.moveTo(0, -ww); g.lineTo(L, -ww * 0.7); g.arc(L, 0, ww * 0.7, -Math.PI / 2, Math.PI / 2); g.lineTo(0, ww); g.arc(0, 0, ww, Math.PI / 2, -Math.PI / 2); g.fillStyle = col; g.fill(); };
      if (P.day) band(w * 1.15, Rp[6]); band(w, rgba(Rp[4], 0.85)); band(w * 0.68, Rp[3]); band(w * 0.38, Rp[1]); band(w * 0.16, '#FFFFFF');
      const Rn = rng(P.seed + Math.floor(t / 0.06)); for (let s2 = -1; s2 <= 1; s2 += 2) { const pts = S.jag(0, s2 * w * 0.9, L, s2 * w * 0.6, 0.12, 4, Rn); S.bolt(g, pts, 1.4 * k, RAMP.zap, 1 - u, P); } }   // crackle rims (zap parent)
    const Rn2 = rng(P.seed + 7); for (let i = 0; i < (P.calm ? 6 : 12); i++) { const d = Rn2() * L, q = seg(u, 0.3, 1), off = (Rn2() - 0.5) * 2 * w * 2 * q; if (q <= 0) continue; g.fillStyle = rampAt(Rf, 0.1 + q * 0.7); g.fillRect(d, off - 1 * k, 7 * k * (1 - q), 2 * k); }   // breaks into dashes (F5) that cool orange
    g.restore();
    S.ring(g, to[0], to[1], 18 * k + 40 * k * outQ(u), Rp[2], 2.4 * k, 1 - u, 1);
    T.glow(g, to[0], to[1], 30 * k * (1 - u), GLOW.plasma, 0.7);
  }});

  // ======================= 🌸 BLOOM (water + nature) — big 1.5 s, contact 0.55 (the garden opens) =======================
  add('water', 'nature', 'bloom', {field: true, sci: 'plants make food from water + sunlight + air (photosynthesis)'});
  function garden(g, P, x, y, r, t, grow, a) { const k = P.k, Rb = RAMP.bloom, Rn = RAMP.nature, n = P.calm ? 5 : 9, Rr = rng(P.seed + 11); g.save(); g.globalAlpha *= a;
    g.fillStyle = rgba(Rn[4], 0.35); g.beginPath(); g.ellipse(x, y, r * grow, r * 0.34 * grow, 0, 0, TAU); g.fill(); S.ring(g, x, y, r * grow, Rn[2], 1.6 * k, 0.8, 0.34, P.day ? Rn[6] : null);
    for (let i = 0; i < n; i++) { const an = Rr() * TAU, d = Math.sqrt(Rr()) * 0.85, fx = x + Math.cos(an) * r * d, fy = y + Math.sin(an) * r * 0.34 * d, s = (5 + 3 * Rr()) * k, op = outBack(seg(grow, 0.3 + Rr() * 0.4, 1));
      const sw = Math.sin(t * 2 + i) * 1.5 * k; g.strokeStyle = Rn[5]; g.lineWidth = 1.4 * k; g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx + sw, fy - 9 * k * op); g.stroke();
      S.leaf(g, fx + sw * 0.5 - 3 * k, fy - 4 * k * op, 3.5 * k * op, -0.6, [Rn[3], Rn[5]]); S.flower(g, fx + sw, fy - 10 * k * op, s * op, op, i % 3 ? Rb : RAMP.light, t * 0.3 + i); }
    for (let i = 0; i < (P.calm ? 3 : 6); i++) { const life = 1.2, q = ((t + i * 0.37) % life) / life, mx = x + (Rr() - 0.5) * r * 1.6, my = y - q * 50 * k; g.fillStyle = rgba(Rn[1], bell(q)); g.beginPath(); g.arc(mx, my, 2 * k, 0, TAU); g.fill(); }  // heal motes rise
    g.restore(); }
  M.fxAdd('fuse.bloom', {el: 'nature', life: 1.5, contact: 0.55, draw(g, P, t) {
    const k = P.k, x = P.x, y = P.y, Rw = RAMP.water, r = (P.r || 56) * k, Rn = rng(P.seed);
    for (let i = 0; i < (P.calm ? 6 : 12); i++) { const st = Rn() * 0.35, q = seg(t, st, st + 0.25), dx = (Rn() - 0.5) * r * 1.6; if (q <= 0 || q >= 1) { if (q >= 1 && t < st + 0.6) S.ring(g, x + dx, y + (Rn() - 0.5) * r * 0.5, 6 * k * seg(t, st + 0.25, st + 0.6), Rw[2], 1.4 * k, 1 - seg(t, st + 0.25, st + 0.6), 0.34); continue; }
      S.drop(g, x + dx, y - 90 * k * (1 - q), 0.1, 1, 3 * k, [Rw[3], Rw[0]]); }                                                              // gentle rain (water parent) waters the ground
    if (S.pop(g, P, x, y - 10 * k, r * 0.5, t, 0.55, 'flower')) return;
    if (t > 0.55) { const u = seg(t, 0.55, 1.5); garden(g, P, x, y, r, t, outQ(u) * endK(t, 1.5), endK(t, 1.5)); S.ring(g, x, y, r * (0.4 + 0.9 * outQ(u)), RAMP.bloom[2], 2.2 * k * (1 - u), 1 - u, 0.34);
      for (let i = 0; i < (P.calm ? 4 : 8); i++) { const an = i / 8 * TAU + 0.3, d = r * 0.4 + 60 * k * outQ(u); g.save(); g.translate(x + Math.cos(an) * d, y - 16 * k - 40 * k * u + Math.sin(an) * d * 0.4); g.rotate(u * 6 + i); g.fillStyle = RAMP.bloom[2]; g.beginPath(); g.ellipse(0, 0, 4 * k * (1 - u), 2 * k, 0, 0, TAU); g.fill(); g.restore(); } }
  }});
  M.fxAdd('fuse.bloom.field', {el: 'nature', life: 1, loop: true, contact: 0, draw(g, P, t) { garden(g, P, P.x, P.y, (P.r || 56) * P.k, t, outQ(seg(t, 0, 0.5)), 1); }});

})();
