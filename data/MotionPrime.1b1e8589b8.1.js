
/* ================= ✦ MotionPrime 17b (mo-19, 🎬 Motion chat, 2026-11-22) — the ✦ Sky Prime package: 9 layers + 🌟 Prime Echo + 👻 Motion.ghost =================
   Rules: `FX Bible.md` (F1 · F2 · F4 · F5 · F7 · F11 · F12 · F15 · F16) · `Motion rules.md` §58–59 · Avateer plan §17h-3 (9 layers) · lore 27g-3 W4 (Echo moves).
   ☀️ Sky God = unique (shared sky package, MotionTop) · ✦ Sky Prime = unique AND epic — it carries its BOSS, never "a Sky God piece with more glow".
   BORN SPLIT: this file = the SHARED engine (needs MotionTop). Each island's Prime cards = their own file (🇹🇭 MotionPrime_thai = #1 Wing-Song + #2 Nakkharat).
   Loads: Motion.need('prime.thai', cb) (brings 'top' → 'prime' → 'prime.thai') · or include('MotionTop') (Code.gs INCLUDE_ALSO_ brings MotionPrime + packs).
   Registers only through Motion.fxAdd / elAdd → a page that never asks stays byte- and pixel-identical (golden rule).

   P = Motion.prime(id, {form: 'sig' | 'weapon' | 'guard', stance: 'strike' | 'guard' | 'boost', calm, day, seed})
     P.place(R) — R = Motion.primeRig(who | creatureId, frame, x, y, k) (top · core · back · feet · hand · handB · tip · face, dir, k)
     P.back(g, t) before the body · P.front(g, t) after it — 🌅 wake + 🫁 idle + 🎚️ stance rim + 🔀 morph cocoon (face-clipped, F11)
     P.wake(t) 🌅 · P.stance(s, t) 🎚️ (0.3 s pop) · P.morph(form, t) 🔀 (1.2 s, the form switches at 0.6) · P.trail(g, tips, t, a) 💨 (tips = smear tips, newest last)
     P.hit({x, y, k, dir, t0, onContact}) 💥 → E · P.mark({x, y, k, h, t0}) → E (1.2 s on the target) · P.trait({x, y, k, dir, to, w, t0, onContact}) ✦ → E (big)
     P.echo({x, y, k, dir, from, to, heroFace, at | t0, short, onContact}) 🌟 → E (≈ 1.7 s, ONE contact at 550 ms — `at` = your ultimate's contact time) · E.skip(t) · {short: true} = 0.6 s
     P.map(g, x, y, k, t, {seed}) 🗺️ (a tiny trace every 4–7 s) · P.on('sting' | 'stance' | 'morph' | 'contact', fn) 🔊 (✨ UISound plays) · P.warm() bakes the ghost poses
     every E: Motion.drawFxBack(g, E, t) before the bodies + Motion.drawFx(g, E, t) after them (the Echo ghost lives in the back layer)
   Motion.primeAdd(id, card) — one card per Prime (island packs) · Motion.ghost(g, {key, paint, box, x, y, s, a, look, glow, t, calm}) — ANY real art as a friendly spirit
   Kid-safe: calmed, never killed · ≤ 1 soft area flash an Echo (F12, calm none) · nothing over a face (F11) · 🌱 calm = half bits, the Echo still plays · pure on t (F16). */
(function () {
  const M = window.Motion; if (!M || !M.fxAdd || !M.fxTools || !M.TOP || M.PRIME) return;
  const T = M.fxTools, TAU = Math.PI * 2, rng = T.rng, outBack = T.outBack, outQ = T.outQ, inQ = T.inQ, rgba = T.rgba, rampAt = T.rampAt, glow = T.glow, glint4 = M.TOP.glint4;
  const cl = (v, a, b) => v < a ? a : v > b ? b : v, bell = q => q <= 0 || q >= 1 ? 0 : Math.sin(Math.PI * q), seg = (e, a, b) => cl((e - a) / (b - a), 0, 1), lerp = (a, b, q) => a + (b - a) * q;
  const ioQ = q => (q = cl(q, 0, 1)) < 0.5 ? 2 * q * q : 1 - (-2 * q + 2) ** 2 / 2;
  // ---------- ✦ colours: the prism ramp (Echo + Prime glints) · 7 rim hues · the 3 shared stance rims (FX Bible §2.2c) ----------
  const PRISM = {ramp: ['#FFFFFF', '#FBF7FF', '#E9DDFF', '#C8B4FF', '#9C86F0', '#6E56C8', '#3A2A78'], glow: '#D9C8FF', smoke: '#B8A8E8'};
  const HUES = ['#FF7A7A', '#FFB84A', '#FFF07A', '#7CF0A0', '#6FD3FF', '#A98BFF', '#FF8AD8'];
  const RIM = {strike: {ramp: ['#FFFFFF', '#FFF2C8', '#FFC94A', '#FF8A3D', '#E0502A', '#9A2A1E', '#4A1410'], glow: '#FF9A3D', name: '⚔️ red-gold'},
               guard: {ramp: ['#FFFFFF', '#E6FFF3', '#A8F5D2', '#4FD8A6', '#24A880', '#16705A', '#0C3A30'], glow: '#5EE0B0', name: '🛡️ jade'},
               boost: {ramp: ['#FFFFFF', '#FFFFFF', '#F4F0FF', '#E2F4FF', '#FFF4D8', '#D8C8FF', '#8A7AC8'], glow: '#FFFFFF', name: '✨ rainbow-white', rainbow: true}};
  const NATURAL = {sig: 'boost', weapon: 'strike', guard: 'guard'};
  M.elAdd('prism', PRISM, {bit(g, x, y, s, q, i) { if (q >= 1 || s <= 0.2) return; glint4(g, x, y, s * 1.15 * (1 - q), q * 0.9 + i, q < 0.25 ? '#FFFFFF' : HUES[i % 7], q < 0.5); }});

  // ---------- 🧰 small painters the cards share ----------
  function star4(g, x, y, s, a, c) { g.save(); g.translate(x, y); g.rotate(a || 0); g.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? s * 0.2 : s, an = i * Math.PI / 4 - Math.PI / 2; g.lineTo(Math.cos(an) * r, Math.sin(an) * r); } g.closePath(); g.fillStyle = c; g.fill(); g.restore(); }
  function ringE(g, x, y, rx, ry, col, w, a, a0, a1) { if (a <= 0 || rx <= 0.2) return; g.save(); g.globalAlpha *= cl(a, 0, 1); g.beginPath(); g.ellipse(x, y, rx, Math.max(0.1, ry), 0, a0 || 0, a1 == null ? TAU : a1); g.strokeStyle = col; g.lineWidth = Math.max(0.5, w); g.stroke(); g.restore(); }
  function dotsE(g, x, y, rx, ry, n, s, col, a, rot) { if (a <= 0) return; g.save(); g.globalAlpha *= cl(a, 0, 1); g.fillStyle = col; for (let i = 0; i < n; i++) { const an = i / n * TAU + (rot || 0); g.beginPath(); g.arc(x + Math.cos(an) * rx, y + Math.sin(an) * ry, s, 0, TAU); g.fill(); } g.restore(); }
  // 🪶 a cel feather: vane (2 halves light / shade) + a quill line, tip at +len along angle a
  function feather(g, x, y, len, w, a, c1, c2, ink) { if (len <= 0.5) return; g.save(); g.translate(x, y); g.rotate(a); g.lineJoin = 'round';
    g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(len * 0.35, -w, len, 0); g.quadraticCurveTo(len * 0.35, w * 0.2, 0, 0); g.fillStyle = c1; g.fill();
    g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(len * 0.35, w * 0.2, len, 0); g.quadraticCurveTo(len * 0.4, w, len * 0.06, w * 0.25); g.closePath(); g.fillStyle = c2; g.fill();
    g.beginPath(); g.moveTo(-len * 0.12, 0); g.lineTo(len * 0.96, 0); g.strokeStyle = ink || 'rgba(255,255,255,0.85)'; g.lineWidth = Math.max(0.6, w * 0.16); g.stroke(); g.restore(); }
  // 🐉 a cel naga scale (rounded shield)
  function scale(g, x, y, s, a, c, rim) { g.save(); g.translate(x, y); g.rotate(a || 0); g.beginPath(); g.moveTo(0, -s); g.bezierCurveTo(s * 0.95, -s * 0.8, s * 0.85, s * 0.45, 0, s); g.bezierCurveTo(-s * 0.85, s * 0.45, -s * 0.95, -s * 0.8, 0, -s); g.fillStyle = c; g.fill();
    if (rim) { g.strokeStyle = rim; g.lineWidth = Math.max(0.6, s * 0.18); g.stroke(); } g.beginPath(); g.ellipse(-s * 0.25, -s * 0.3, s * 0.22, s * 0.35, -0.4, 0, TAU); g.fillStyle = 'rgba(255,255,255,0.55)'; g.fill(); g.restore(); }
  // 🔔 a bronze gong ring (ellipse, lit rim + shade + a few dots)
  function gong(g, x, y, r, a, k, sq, cols) { if (a <= 0 || r <= 0.3) return; sq = sq || 0.42; cols = cols || ['#FFFFFF', '#FFE9A8', '#EDB54E', '#A86A22']; glow(g, x, y, r * 1.1, '#FFD27A', a * 0.25, sq);
    ringE(g, x, y + r * sq * 0.12, r, r * sq, cols[3], 4.2 * k, a * 0.55); ringE(g, x, y, r, r * sq, cols[2], 3.4 * k, a); ringE(g, x, y - 0.6 * k, r, r * sq, cols[1], 1.8 * k, a, Math.PI * 1.05, Math.PI * 1.95); ringE(g, x, y, r * 0.98, r * sq * 0.98, cols[0], 0.9 * k, a * 0.9, Math.PI * 1.2, Math.PI * 1.6); }
  // 〰️ a braid: n strands twisting along a path from A to B (bowed up by `bow`), drawn up to u (0..1)
  function braid(g, A, B, u, cols, w, t, o) { o = o || {}; const n = cols.length, bow = o.bow == null ? 0.28 : o.bow, tw = o.twist || 3.2, amp = (o.amp || 5) * (o.k || 1), u0 = o.u0 || 0;
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), nx = -(B[1] - A[1]) / (L || 1), ny = (B[0] - A[0]) / (L || 1), steps = 26;
    const at = q => [A[0] + (B[0] - A[0]) * q + nx * Math.sin(q * Math.PI) * L * bow * (o.side || -1), A[1] + (B[1] - A[1]) * q + ny * Math.sin(q * Math.PI) * L * bow * (o.side || -1)];
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
    for (let s = 0; s < n; s++) for (const pass of [2, 0, 1]) { g.beginPath(); let st = false;
      for (let i = 0; i <= steps; i++) { const q = lerp(u0, u, i / steps); if (q < 0) continue; const p = at(q), ph = q * tw * TAU - t * 9 + s * TAU / n, off = Math.sin(ph) * amp * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, q * 1.4)));
        const x = p[0] + nx * off, y = p[1] + ny * off; if (!st) { g.moveTo(x, y); st = true; } else g.lineTo(x, y); }
      if (pass === 2) { g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba(cols[s], 0.28); g.lineWidth = w * 3.2; g.stroke(); g.restore(); continue; }
      g.strokeStyle = pass ? rgba('#FFFFFF', 0.85) : cols[s]; g.lineWidth = pass ? w * 0.36 : w; g.stroke(); }
    const tip = at(u); if (u > u0 && u < 1 && !o.noHead) { glow(g, tip[0], tip[1], w * 4.5, cols[0], 0.9); g.save(); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(tip[0], tip[1], w * 0.75, 0, TAU); g.fill(); g.restore(); }
    g.restore(); return tip; }
  // 🪷 lotus: n petals round (x, y)
  function lotus(g, x, y, r, n, a, cols, sq) { sq = sq || 1; g.save(); g.translate(x, y); g.scale(1, sq); for (let i = 0; i < n; i++) { g.save(); g.rotate(i / n * TAU + (a || 0)); g.beginPath(); g.moveTo(0, -r * 0.25);
    g.bezierCurveTo(r * 0.42, -r * 0.45, r * 0.3, -r * 0.9, 0, -r); g.bezierCurveTo(-r * 0.3, -r * 0.9, -r * 0.42, -r * 0.45, 0, -r * 0.25); g.fillStyle = cols[i % cols.length]; g.fill(); g.restore(); } g.restore(); }
  // 🐍 a light naga head glyph (teardrop head + crest flame), facing angle a
  function nagaHead(g, x, y, s, a, col, crest) { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(s * 1.1, 0); g.quadraticCurveTo(s * 0.4, -s * 0.75, -s * 0.55, -s * 0.45); g.quadraticCurveTo(-s * 0.85, 0, -s * 0.55, s * 0.45); g.quadraticCurveTo(s * 0.4, s * 0.75, s * 1.1, 0); g.fillStyle = col; g.fill();
    g.beginPath(); g.moveTo(-s * 0.4, -s * 0.4); g.quadraticCurveTo(-s * 0.5, -s * 1.3, s * 0.1, -s * 1.45); g.quadraticCurveTo(-s * 0.05, -s * 0.9, s * 0.15, -s * 0.5); g.fillStyle = crest || '#FFE58A'; g.fill();
    g.beginPath(); g.arc(s * 0.35, -s * 0.12, s * 0.14, 0, TAU); g.fillStyle = '#FFFFFF'; g.fill(); g.restore(); }
  function pop(g, x, y, r, a, k) { if (a <= 0) return; glow(g, x, y, r * 1.6, '#FFFFFF', a * 0.9); g.save(); g.globalAlpha *= cl(a, 0, 1); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(x, y, r * 0.55, 0, TAU); g.fill(); g.restore(); for (let i = 0; i < 4; i++) star4(g, x, y, r * (0.9 + (i % 2) * 0.5), i * Math.PI / 4, rgba('#FFFFFF', a)); }
  // 💥 epic impact parts (v2, Aowu 01:10 "more epic and flashy"): light rays · shockwave · spark streaks · a full impact
  function rays(g, x, y, r0, r1, n, a, rot, cols, w, sq) { if (a <= 0 || r1 <= r0) return; g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha *= cl(a, 0, 1); sq = sq || 1;
    for (let i = 0; i < n; i++) { const an = i / n * TAU + (rot || 0), L = (i % 2 ? 0.7 : 1), c = Math.cos(an), s2 = Math.sin(an) * sq, wd = (w || 3) * (i % 2 ? 0.6 : 1);
      g.beginPath(); g.moveTo(x + c * r0 - s2 * wd * 0.15, y + s2 * r0 + c * wd * 0.15); g.lineTo(x + c * (r0 + (r1 - r0) * L), y + s2 * (r0 + (r1 - r0) * L)); g.lineTo(x + c * r0 + s2 * wd * 0.15, y + s2 * r0 - c * wd * 0.15);
      g.lineTo(x + c * r0 - s2 * wd, y + s2 * r0 + c * wd); g.closePath(); g.fillStyle = Array.isArray(cols) ? cols[i % cols.length] : cols; g.fill(); } g.restore(); }
  function shock(g, x, y, r, sq, a, k, col) { if (a <= 0 || r <= 0.5) return; g.save(); g.globalCompositeOperation = 'lighter'; ringE(g, x, y, r, r * sq, col || '#FFE9A8', 7 * k * a, a * 0.45); ringE(g, x, y, r, r * sq, '#FFFFFF', 2 * k, a); g.restore(); }
  function sparks(g, x, y, n, q, seed, k, cols, spread) { if (q <= 0 || q >= 1) return; const R = rng(seed || 3); g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
    for (let i = 0; i < n; i++) { const an = R() * TAU, sp = (0.6 + R() * 0.8) * (spread || 60) * k, d0 = sp * outQ(q), d1 = sp * outQ(Math.max(0, q - 0.12)), c = cols[i % cols.length];
      g.strokeStyle = c; g.globalAlpha = (1 - q) * 0.95; g.lineWidth = (1.2 + R() * 1.6) * k * (1 - q * 0.6); g.beginPath(); g.moveTo(x + Math.cos(an) * d1, y + Math.sin(an) * d1 * 0.8 + q * q * 14 * k); g.lineTo(x + Math.cos(an) * d0, y + Math.sin(an) * d0 * 0.8 + q * q * 18 * k); g.stroke(); } g.restore(); }
  // the full IMPACT: white core pop (F2, calm none) → rays shoot out → 2 shockwaves → spark streaks · u = 0..1 over its own life
  function impact(g, x, y, k, u, o) { o = o || {}; const cols = o.cols || ['#FFFFFF', '#FFE58A', '#FFC21A'], big = o.big || 1, calm = !!o.calm;
    if (u <= 0 || u >= 1) return; glow(g, x, y, 46 * k * big * (1 - u * 0.4), o.glow || cols[1], 0.85 * (1 - u));
    if (!calm && u < 0.12) pop(g, x, y, 20 * k * big, 1 - u / 0.12, k);
    rays(g, x, y, 6 * k * big, (18 + 70 * outQ(u / 0.55)) * k * big, o.n || 12, (1 - seg(u, 0.25, 0.7)), o.rot || 0, cols, 3.6 * k * big, o.sq || 0.8);
    for (let r = 0; r < (calm ? 1 : 2); r++) { const q = seg(u, r * 0.12, 0.75 + r * 0.15); shock(g, x, y + (o.ground ? 0 : 0), (10 + 64 * outQ(q)) * k * big, o.ringSq || 0.42, 1 - q, k, cols[1]); }
    sparks(g, x, y, calm ? 7 : 16, seg(u, 0.02, 0.8), o.seed || 9, k, cols, 58 * big); }
  const TOOLS = {rays, shock, sparks, impact, star4, ringE, dotsE, feather, scale, gong, braid, lotus, nagaHead, pop, glint4, glow, rng, outBack, outQ, inQ, ioQ, rgba, rampAt, cl, bell, seg, lerp, HUES, PRISM, RIM};

  // ---------- 👻 Motion.ghost — any real art (a boss draw) as a friendly light spirit · baked ONCE per pose key (F15) ----------
  const GH = new Map(), GH_MAX = 48;
  function cv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
  function trim(c) { const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data, W = c.width, H = c.height; let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4 + 3] > 6) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null; x0 = Math.max(0, x0 - 2); y0 = Math.max(0, y0 - 2); x1 = Math.min(W - 1, x1 + 2); y1 = Math.min(H - 1, y1 + 2); return [x0, y0, x1 - x0 + 1, y1 - y0 + 1]; }
  function tint(src, col, a) { const c = cv(src.width, src.height), g = c.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.globalAlpha = a == null ? 1 : a; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); return c; }
  function bake(key, o) {   // o = {paint(g) with the anchor at (ax, ay), box: [w, h, ax, ay], glow, rim}
    if (GH.has(key)) { const v = GH.get(key); GH.delete(key); GH.set(key, v); return v; }
    const b = o.box || [400, 400, 200, 300], raw = cv(b[0], b[1]), rg = raw.getContext('2d');
    try { o.paint(rg); } catch (e) { (M._primeErr = M._primeErr || []).push(String(e && e.message || e)); }
    const bx = trim(raw); if (!bx) { GH.set(key, null); return null; }
    const PAD = 34, src = cv(bx[2] + PAD * 2, bx[3] + PAD * 2), sg = src.getContext('2d'); sg.drawImage(raw, bx[0], bx[1], bx[2], bx[3], PAD, PAD, bx[2], bx[3]);
    const sil = tint(src, '#FFFFFF');
    // light body = the art washed toward white-gold (no ctx.filter — iPad Safari safe)
    const light = cv(src.width, src.height), lg = light.getContext('2d'); lg.drawImage(src, 0, 0); lg.globalCompositeOperation = 'source-atop'; lg.globalAlpha = 0.58; lg.fillStyle = '#FFFFFF'; lg.fillRect(0, 0, light.width, light.height);
    const gr = lg.createLinearGradient(0, 0, 0, light.height); gr.addColorStop(0, 'rgba(255,255,255,0.5)'); gr.addColorStop(0.55, 'rgba(255,238,170,0.55)'); gr.addColorStop(1, 'rgba(255,196,96,0.5)'); lg.globalAlpha = 0.6; lg.fillStyle = gr; lg.fillRect(0, 0, light.width, light.height);
    // own-colour body = the art lifted + a cool sheen
    const own = cv(src.width, src.height), og = own.getContext('2d'); og.drawImage(src, 0, 0); og.globalCompositeOperation = 'source-atop'; og.globalAlpha = 0.22; og.fillStyle = '#E8FBFF'; og.fillRect(0, 0, own.width, own.height);
    // soft glow = the silhouette smeared in 2 rings (no blur filter)
    const gw = cv(src.width, src.height), gg = gw.getContext('2d'), gs = tint(src, o.glow || '#FFE58A'); gg.globalAlpha = 0.09;
    for (const r of [4, 8, 12]) for (let i = 0; i < 10; i++) { const an = i / 10 * TAU; gg.drawImage(gs, Math.cos(an) * r, Math.sin(an) * r); }
    // ✦ prism rim = 7 tinted copies round the silhouette, the silhouette cut out
    const rim = cv(src.width, src.height), rmg = rim.getContext('2d'); HUES.forEach((h, i) => { const an = i / 7 * TAU, t2 = tint(src, h); rmg.drawImage(t2, Math.cos(an) * 2.3, Math.sin(an) * 2.3); });
    rmg.globalCompositeOperation = 'destination-out'; rmg.drawImage(sil, 0, 0);
    // ✏️ v2 the IMPACT outline: a bright inner line hugging the silhouette + a coloured outer band + a wide aura (all from dilated silhouettes)
    const dil = (r, col) => { const c = cv(src.width, src.height), q = c.getContext('2d'), t2 = tint(src, col); for (let i = 0; i < 16; i++) { const an = i / 16 * TAU; q.drawImage(t2, Math.cos(an) * r, Math.sin(an) * r); q.drawImage(t2, Math.cos(an) * r * 0.5, Math.sin(an) * r * 0.5); } return c; };
    const line = dil(2.2, '#FFFFFF'), lg2 = line.getContext('2d'); lg2.globalCompositeOperation = 'destination-out'; lg2.drawImage(sil, 0, 0);
    const band = dil(5.5, o.glow || '#FFD966'), bg2 = band.getContext('2d'); bg2.globalCompositeOperation = 'destination-out'; bg2.drawImage(dil(2.2, '#FFFFFF'), 0, 0);
    const aura = cv(src.width, src.height), ag = aura.getContext('2d'), wide = dil(6, o.glow || '#FFD966'); ag.globalAlpha = 0.11; for (const r of [0, 3, 6, 9]) for (let i = 0; i < 12; i++) { const an = i / 12 * TAU + r; ag.drawImage(wide, Math.cos(an) * r, Math.sin(an) * r); }
    ag.globalAlpha = 1; ag.globalCompositeOperation = 'destination-out'; ag.drawImage(sil, 0, 0);   // the aura lives OUTSIDE the body — the spirit stays see-through
    const v = {line, band, aura, key, w: src.width, h: src.height, ax: b[2] - bx[0] + PAD, ay: b[3] - bx[1] + PAD, ox: bx[0] - PAD, oy: bx[1] - PAD, sil, light, own, glow: gw, rim};
    GH.set(key, v); if (GH.size > GH_MAX) GH.delete(GH.keys().next().value); return v; }
  let SCR = null;
  function ghost(g, o) {   // o = {key, paint, box, x, y (where the anchor lands), s, a, look: 'light' | 'own', glow, t, calm, flip}
    const v = bake(o.key, o); if (!v || !(o.a > 0)) return v; const s = o.s || 1, a = cl(o.a, 0, 1), t = o.t || 0, W = v.w * s, H = v.h * s, X = o.x - v.ax * s, Y = o.y - v.ay * s;
    const cut = cl(o.cut || 0, 0, 1), yc = Y + H * (1 - cut);   // {cut} 0..1 = the spirit turns to light from the feet up (never fades to grey smoke)
    g.save(); if (o.flip) { g.translate(o.x * 2, 0); g.scale(-1, 1); }
    const pulse = 0.85 + 0.15 * Math.sin(t * 5.2), lit = !o.day, body = o.look === 'own' ? v.own : v.light;
    // 🔥 aura: flickering layers licking UP off the silhouette (added light, outside the body; fades as the spirit dissolves)
    if (cut > 0) { g.beginPath(); g.rect(X - 40, Y - 40, W + 80, H * (1 - cut) + 40 - H * 0.02); g.clip(); }
    g.save(); if (lit) g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < (o.calm ? 1 : 2); i++) { const ph = t * (3.1 + i * 1.7) + i * 2.1, up = (1.5 + 4 * i + 2 * Math.sin(ph)) * s, sx = 1 + 0.012 * i + 0.008 * Math.sin(ph * 1.3), sy = 1 + 0.03 * i + 0.015 * Math.sin(ph);
      g.globalAlpha = a * (0.55 - i * 0.2) * pulse; g.drawImage(v.aura, o.x - (o.x - X) * sx, Y + H - H * sy - up, W * sx, H * sy); }
    g.restore();
    if (o.edgeOnly) { g.globalCompositeOperation = lit ? 'lighter' : 'source-over'; g.globalAlpha = a * 0.8; g.drawImage(v.band, X, Y, W, H); g.globalAlpha = a; g.drawImage(v.line, X, Y, W, H); g.restore(); return v; }   // after-images: the line only
    // 👻 the body: see-through (the world shows through the spirit)
    g.globalAlpha = (o.look === 'own' ? 0.45 : 0.38) * (lit ? a * a : a);
    if (!o.calm) { if (!SCR) SCR = cv(8, 8); if (SCR.width < v.w || SCR.height < v.h) { SCR.width = Math.max(SCR.width, v.w); SCR.height = Math.max(SCR.height, v.h); }
      const q = SCR.getContext('2d'); q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, v.w, v.h); q.drawImage(body, 0, 0); q.globalCompositeOperation = 'source-atop';
      for (let i = 0; i < 3; i++) { const yy = v.h - ((i / 3 + t * 0.55) % 1) * v.h * 1.2; q.fillStyle = 'rgba(255,255,255,0.28)'; q.fillRect(0, yy, v.w, v.h * 0.06); }
      g.drawImage(SCR, 0, 0, v.w, v.h, X, Y, W, H); } else g.drawImage(body, X, Y, W, H);
    if (lit) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = a * 0.2; g.drawImage(body, X, Y, W, H); }
    // ✏️ the impact line: coloured outer band + a bright white line hugging the silhouette
    g.globalAlpha = a * 0.85 * pulse; g.drawImage(v.band, X, Y, W, H); g.globalAlpha = Math.min(1, a * 1.15); g.drawImage(v.line, X, Y, W, H); g.globalCompositeOperation = 'source-over';
    g.globalAlpha = a * (0.55 + 0.25 * Math.sin(t * 3.1 + 1)); g.drawImage(v.rim, X, Y, W, H);
    // ✨ motes rising off the spirit
    if (!o.calm) { const R = rng(31); g.globalCompositeOperation = lit ? 'lighter' : 'source-over'; for (let i = 0; i < 12; i++) { const fx = R(), sp = 0.35 + R() * 0.5, u = (t * sp + R()) % 1, px = X + W * (0.18 + fx * 0.64) + Math.sin(u * 7 + i) * 4 * s, py = Y + H * (0.92 - u * 1.05);
        g.globalAlpha = a * bell(u) * 0.9; g.fillStyle = i % 3 ? '#FFFFFF' : (o.glow || '#FFD966'); g.beginPath(); g.arc(px, py, (1 + R() * 1.6) * Math.max(0.8, s), 0, TAU); g.fill(); } g.globalCompositeOperation = 'source-over'; }
    g.restore();
    if (cut > 0 && cut < 1) { const cx = o.x + (o.flip ? -1 : 1) * (X + W / 2 - o.x), R = rng(77 + Math.floor(t * 20)), w = W * 0.32 * bell(Math.min(1, cut * 1.3));
      glow(g, cx, yc, w, '#FFF4C8', a * 0.9, 0.22); g.save(); g.globalAlpha = a; for (let i = 0; i < (o.calm ? 4 : 9); i++) { const sx = cx + (R() - 0.5) * w * 1.8, sy = yc - R() * 14 * s * 2;
        g.fillStyle = i % 3 ? '#FFFFFF' : HUES[i % 7]; g.beginPath(); g.arc(sx, sy, (1.2 + R() * 1.6) * Math.max(1, s), 0, TAU); g.fill(); } g.restore(); }
    v.cutY = yc; return v; }
  // a baked pose's rig point (art px relative to the anchor) → canvas px
  function ghostPt(v, o, px, py) { const s = o.s || 1; return [o.x + (o.flip ? -1 : 1) * px * s, o.y + py * s]; }

  // ---------- 🦴 Motion.primeRig — topRig + the hands + the weapon tip (avatars) ----------
  function primeRig(who, frame, x, y, k) {
    const R = M.topRig(who, frame, x, y, k); if (!R) return null; R.k = R.k || k || 1; R.dir = (frame && frame.dir) || (who && who.dir) || 1;
    if (typeof who === 'string' || (who && who.fam)) { R.hand = R.core; R.tip = R.top; R.handB = R.back; return R; }
    const f = frame || {}, P = f.pose || f, d = R.dir, Q = M.rigAll ? M.rigAll(P, k, {}) : {}, at = p => p ? [x + d * p.x, y + p.y] : null;
    R.hand = at(Q.handR) || R.core; R.handB = at(Q.handL) || R.core;     R.tip = [R.hand[0] + d * 7 * k, R.hand[1] - 30 * k];   // a held staff / wand points up from the front hand (a page that knows its weapon's tip passes its own R.tip)
    R.head = R.face ? [R.face[0], R.face[1]] : R.top; return R; }

  // ---------- 📇 the cards ----------
  const CARDS = {}, ECHO = {full: {rise: [0.25, 0.55], c: 0.55, move: [0.55, 1.1], thanks: [1.1, 1.4], home: [1.4, 1.7], life: 1.7},
                             short: {rise: [0.0, 0.22], c: 0.25, move: [0.25, 0.45], thanks: [0.45, 0.45], home: [0.45, 0.6], life: 0.6}};
  const warnOnce = {}; function warn(m) { if (warnOnce[m]) return; warnOnce[m] = 1; try { console.warn('✦ Motion.prime: ' + m); } catch (e) {} }
  function ctxOf(S, t) { const R = S.R || {k: 1, dir: 1, top: [0, -78], core: [0, -38], back: [-11, -40], feet: [0, 0], hand: [12, -30], tip: [12, -64], handB: [-12, -30]};
    return {R, k: R.k || 1, dir: R.dir || 1, t, calm: !!S.calm, day: !!S.day, form: formAt(S, t), stance: S.stance, seed: S.seed, T: TOOLS}; }
  function formAt(S, t) { return S.mT != null && t < S.mT + 0.6 ? S.mFrom : S.form; }
  // 💥 / ✦ / 🌟 effects of a card become Motion.fx kinds 'prime.<id>.hit' · '.mark' · '.trait' · '.echo' · '.echo.short'
  function primeAdd(id, card) {
    const C = CARDS[id] = Object.assign({id, home: 'sig', forms: {sig: 'back', weapon: 'hand', guard: 'core'}}, card);
    const wrap = (kind, part, D) => { if (!part) return; M.fxAdd('prime.' + id + '.' + kind, Object.assign({el: 'prism', life: part.life || 0.8, contact: part.contact != null ? part.contact : null,
      back: part.back ? (g, P, e) => part.back(g, P, e, TOOLS) : null, draw: (g, P, e) => part.draw(g, P, e, TOOLS)}, D || {})); };
    wrap('hit', C.hit); wrap('mark', C.mark); wrap('trait', C.trait, C.trait && C.trait.flash ? {flashAt: C.trait.contact} : null);
    for (const sh of ['full', 'short']) { const PH = ECHO[sh];
      M.fxAdd('prime.' + id + '.echo' + (sh === 'short' ? '.short' : ''), {el: 'prism', life: PH.life, contact: PH.c, flashAt: sh === 'full' ? PH.c : null, shake: sh === 'full' ? [PH.c + (C.echoShakeAt || 0), 4, 260] : null,
        back: (g, P, e) => echoDraw(C, g, P, skipE(P, e), PH, 'back'), draw: (g, P, e) => echoDraw(C, g, P, skipE(P, e), PH, 'front')}); }
    return C; }
  const skipE = (P, e) => e;
  // 🌟 the Echo timeline (shared) — the card paints its boss + its move; the engine paints the call, the motes home, the soft flash, the fades
  function phases(PH, e) { return {call: seg(e, 0, Math.max(0.12, PH.rise[0] + 0.05)), rise: seg(e, PH.rise[0], PH.rise[1]), move: seg(e, PH.move[0], PH.move[1]),
    thanks: PH.thanks[1] > PH.thanks[0] ? seg(e, PH.thanks[0], PH.thanks[1]) : (e >= PH.thanks[0] ? 1 : 0), home: seg(e, PH.home[0], PH.home[1]), c: PH.c, life: PH.life, e, short: PH.life < 1}; }
  function echoDraw(C, g, P, e, PH, layer) {
    let fade = 1; if (P.skipT != null) { if (e > P.skipT + 0.15) return; if (e > P.skipT) fade = 1 - (e - P.skipT) / 0.15; }
    const ph = phases(PH, e), k = P.k || 1, from = P.from || [P.x + (P.dir || 1) * 12 * k, P.y - 64 * k], calm = !!P.calm;
    g.save(); g.globalAlpha *= fade;
    try {
      if (layer === 'back') { if (C.echo && C.echo.back) C.echo.back(g, P, e, ph, TOOLS); }
      else {
        if (P.heroFace) { g.beginPath(); g.rect(-1e5, -1e5, 2e5, 2e5); g.arc(P.heroFace[0], P.heroFace[1], (P.heroFace[2] || 21 * k) * 1.15, 0, TAU, true); g.clip('evenodd'); }   // F11: nothing of the Echo crosses your face
        // ① call — a ✦ 4-point prism star opens at the weapon + 2 echo rings
        if (ph.call > 0 && ph.call < 1) { const q = ph.call, s = (14 + 10 * outBack(q)) * k * (1 - q * 0.4); glow(g, from[0], from[1], s * 2.2, PRISM.glow, 0.7 * bell(q));
          star4(g, from[0], from[1], s, q * 1.2, rgba('#FFFFFF', bell(q))); for (let i = 0; i < 2; i++) { const qq = cl(q * 1.3 - i * 0.25, 0, 1); ringE(g, from[0], from[1], (8 + 26 * outQ(qq)) * k, (8 + 26 * outQ(qq)) * k * 0.45, HUES[i * 3 + 1], 1.6 * k, 1 - qq); } }
        if (C.echo && C.echo.front) C.echo.front(g, P, e, ph, TOOLS);
        // ③ ONE soft flash at the contact (granted by the engine, F12 · calm none)
        if (P._flash && !calm && e >= ph.c && e < ph.c + 0.09) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 0.26 * (1 - (e - ph.c) / 0.09) * fade; g.fillStyle = '#FFF8E6'; g.fillRect(0, 0, g.canvas.width, g.canvas.height); g.restore(); }
        // ⑥ home — motes stream into the weapon
        if (ph.home > 0 && ph.home < 1) { const R = rng(P.seed || 5), n = calm ? 7 : 14, src = P._homeFrom || [P.x - (P.dir || 1) * 26 * k, P.y - 70 * k];
          for (let i = 0; i < n; i++) { const d0 = R() * 0.35, q = seg(ph.home, d0, d0 + 0.65); if (q <= 0 || q >= 1) continue; const sx = src[0] + (R() - 0.5) * 70 * k, sy = src[1] + (R() - 0.5) * 80 * k, cx = lerp(sx, from[0], inQ(q)) + Math.sin(q * 6 + i) * 6 * k * (1 - q), cy = lerp(sy, from[1], inQ(q)) - Math.sin(q * Math.PI) * 14 * k;
            glow(g, cx, cy, 6 * k, i % 2 ? PRISM.glow : '#FFE58A', 0.6 * (1 - q * 0.5)); g.fillStyle = i % 3 ? '#FFFFFF' : HUES[i % 7]; g.beginPath(); g.arc(cx, cy, (1.4 + R() * 1.2) * k, 0, TAU); g.fill(); }
          if (ph.home > 0.82) star4(g, from[0], from[1], 10 * k * bell((ph.home - 0.82) / 0.18), ph.home * 3, '#FFFFFF'); }
      }
    } finally { g.restore(); }
  }

  // ---------- ✦ the controller ----------
  function prime(id, o) {
    const C = CARDS[id]; if (!C) { warn('no card "' + id + '" — load its island pack (Motion.need(\'prime.thai\'))'); return null; }
    o = o || {}; const form = o.form || C.home || 'sig';
    const S = {id, C, form, stance: o.stance || NATURAL[form] || 'boost', calm: !!o.calm, day: !!o.day, seed: o.seed || 7, R: null, wakeT: null, stT: -9, stFrom: null, mT: null, mFrom: null, mTo: null, ev: {}};
    const emit = (n, d) => (S.ev[n] || []).forEach(fn => { try { fn(Object.assign({prime: id, sound: C.sound && C.sound[n]}, d || {})); } catch (e) {} });
    const P = {id, card: C, S,
      place(R) { S.R = R; return P; },
      on(n, fn) { (S.ev[n] = S.ev[n] || []).push(fn); return P; },
      wake(t) { S.wakeT = t; emit('sting', {t}); return P; },
      stance(s, t) { if (!RIM[s] || s === S.stance) return P; S.stFrom = S.stance; S.stance = s; S.stT = t; emit('stance', {t, stance: s}); return P; },
      morph(f, t) { if (!C.forms[f] || f === formAt(S, t)) return P; S.mFrom = formAt(S, t); S.mTo = f; S.form = f; S.mT = t; S.stFrom = S.stance; S.stance = NATURAL[f]; S.stT = t + 0.6; emit('morph', {t, form: f}); return P; },
      form: t => formAt(S, t == null ? 1e9 : t),
      back(g, t) { layer(g, t, 'back'); return P; }, front(g, t) { layer(g, t, 'front'); return P; },
      trail(g, tips, t, a) { if (!C.trail || !tips || tips.length < 2) return; g.save(); g.globalAlpha *= a == null ? 1 : a; try { C.trail(g, tips, ctxOf(S, t), TOOLS); } finally { g.restore(); } },
      hit(q) { return fxOf('hit', q); }, mark(q) { return fxOf('mark', Object.assign({h: 60}, q)); }, trait(q) { return fxOf('trait', q); },
      echo(q) { q = Object.assign({}, q); const sh = q.short ? '.short' : '', PH = ECHO[q.short ? 'short' : 'full']; if (q.at != null) q.t0 = q.at - PH.c;
        const E = fxOf('echo' + sh, q); if (!E) return E; E.skip = t => { if (E.P.skipT == null) { E.P.skipT = Math.max(0, t - E.t0); if (!E.fired && E.contact != null) { E.fired = true; if (E.onContact) E.onContact(E); } } return E; };
        const end0 = E.end; E.end = () => E.P.skipT != null ? Math.min(end0(), E.t0 + E.P.skipT + 0.15) : end0(); return E; },
      map(g, x, y, k, t, mo) { if (!C.map) return; mo = mo || {}; const R = rng((mo.seed || S.seed) * 131 + 17), per = 4 + R() * 3, off = R() * per, n = Math.floor((t + off) / per), u = ((t + off) - n * per) / 1.4; if (u > 1) return;
        g.save(); try { C.map(g, x, y, k || 1, u, {calm: S.calm, day: S.day, n, t}, TOOLS); } finally { g.restore(); } },
      warm() { if (C.warm) C.warm(TOOLS); return P; }};
    function fxOf(kind, q) { q = Object.assign({calm: S.calm, day: S.day, k: (S.R && S.R.k) || 1, dir: (S.R && S.R.dir) || 1, stance: S.stance, form: S.form}, q || {}); const oc = q.onContact;
      q.onContact = E => { emit('contact', {kind, t: E.t0 + (E.contact || 0)}); if (oc) oc(E); }; return M.fx('prime.' + id + '.' + kind, q); }
    function layer(g, t, L) { const c = ctxOf(S, t), R = c.R, k = c.k;
      g.save(); try {
        if (L === 'front' && R.face) { g.beginPath(); g.rect(-1e5, -1e5, 2e5, 2e5); g.arc(R.face[0], R.face[1], R.face[2] || 21 * k, 0, TAU, true); g.clip('evenodd'); }   // F11
        // 🌅 wake 0.6 s — the boss's silhouette flashes behind you (35 %) + the card's own touch
        if (S.wakeT != null && t >= S.wakeT && t < S.wakeT + 0.6) { const q = (t - S.wakeT) / 0.6;
          if (L === 'back' && C.ghost) { const gp = C.ghost('wake', q, c); if (gp) ghost(g, Object.assign({x: R.feet[0] - c.dir * 14 * k, y: R.feet[1] + 2 * k, a: 0.35 * bell(q) * (c.calm ? 0.7 : 1), t, calm: true, flip: c.dir < 0}, gp, {s: (gp.s || 1) * k})); }
          if (C.wake) C.wake(g, c, q, L, TOOLS); }
        // 🎚️ stance — shared rim colour + the boss's own SHAPE (pops 0.3 s, the old one fades 0.2 s)
        if (C.stanceShape) { const q = cl((t - S.stT) / 0.3, 0, 1), qo = cl((t - S.stT) / 0.2, 0, 1);
          if (S.stFrom && qo < 1) C.stanceShape(g, c, S.stFrom, 1, L, RIM[S.stFrom], 1 - qo, TOOLS);
          if (t >= S.stT) C.stanceShape(g, c, S.stance, outBack(q), L, RIM[S.stance], 1, TOOLS); }
        // 🫁 idle — its boss's OWN idle (nothing shared)
        if (C.idle) C.idle(g, c, L, TOOLS);
        // 🔀 morph 1.2 s — a light cocoon on the slot, pop at 0.6 (calm no pop), the card's own transition
        if (S.mT != null && t >= S.mT && t < S.mT + 1.2) { const q = (t - S.mT) / 1.2, at = R[C.forms[q < 0.5 ? S.mFrom : S.mTo]] || R.core;
          if (L === 'front') { const sw = q < 0.5 ? outQ(q * 2) : 1 - outQ((q - 0.5) * 2); glow(g, at[0], at[1], 26 * k * (0.4 + sw), PRISM.glow, 0.8 * sw);
            g.save(); g.globalAlpha *= sw; g.beginPath(); g.ellipse(at[0], at[1], 10 * k * (0.5 + sw), 15 * k * (0.5 + sw), 0, 0, TAU); g.fillStyle = 'rgba(255,255,255,0.75)'; g.fill(); g.restore();
            ringE(g, at[0], at[1], 12 * k * (0.5 + sw), 17 * k * (0.5 + sw), HUES[Math.floor(t * 14) % 7], 1.6 * k, sw);
            if (!c.calm && q >= 0.5 && q < 0.58) pop(g, at[0], at[1], 16 * k, 1 - (q - 0.5) / 0.08, k); }
          if (C.morph) C.morph(g, c, q, S.mFrom, S.mTo, L, TOOLS); }
      } finally { g.restore(); } }
    return P;
  }
  M.prime = prime; M.primeAdd = primeAdd; M.primeRig = primeRig; M.ghost = ghost;
  M.PRIME = {VERSION: 'mo-19', CARDS, ECHO, RIM, PRISM, HUES, NATURAL, tools: TOOLS, ghostPt, bake, ids: () => Object.keys(CARDS)};
  if (M.needLoaded) M.needLoaded('prime');
})();
