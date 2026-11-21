
/* ================= ☀️ MotionTop 17a (mo-18, 🎬 Motion chat, 2026-11-21) — the ☀️ Sky God package + 7 region motifs =================
   Rules: `FX Bible.md` (F1 · F2 · F4 · F5 · F11 · F15 · F16) · `Motion rules.md` §54–56 · Avateer plan §17h-2 / §17h-3. BORN SPLIT: its own file MotionTop.html,
   NOT loaded with AvatarKit — a page asks for it: include('MotionTop') (Apps Script) or Motion.need('top', cb) (lazy, Code.gs INCLUDE_LAZY_ AvatarKit → Motion.sources).
   Registers only through Motion.fxAdd / elAdd / popAdd → a page that never loads it stays byte- and pixel-identical.
   E = Motion.fx(kind, {x, y, k, motif, calm, day, seed, t0, …}) → Motion.drawFxBack(g, E, t) before a body + Motion.drawFx(g, E, t) after it
     💠 'skycore'   loop · cel gem + sun crest on the chest / belly, pulse ring → dots · {charge} 0..1 = the ultimate bar (beat 1.25 → 0.7 s, glow ×1.6)
     ☁️ 'skyorbit'  loop · a cel cloud on a tilted ring round the head / crown · back half behind (drawFxBack), front half over · {face: [x, y, r]} clip (F11)
     🪽 'skywings'  loop · 2 mini wings × 3 feathers on the back · quick flap → long glide (M23) · back layer
     🎀 'skyribbon' loop · 3 cel bands, a wave runs root → tip, the tip sheds sparkles / motif bits · {a} hang angle · {pts} = lay it along a spine (creatures)
     ☀️ 'sunray'    hit 600 ms, contact 50 · white sun pop → sun disc + 8 rays + ring → rays to dashes, ring to dots, gold → sky blue (+ the motif ring + 6 bits)
     🌅 'skypillar' = its OWN file MotionPillar.html (born split, needs this one first) — Motion.need('pillar', cb) loads both
   {motif}: 'temple' · 'cherry' · 'sundisc' · 'aurora' · 'ember' · 'pearl' · 'star' (Motion.motifAdd(key, {name, acc, bit, ring}) adds one more)
   S = Motion.sky({parts, motif, charge, calm, day}) · S.wear(avatar) (rides AvatarKit's wear slots + the 🧊 turn) · S.place(Motion.topRig(who, frame, x, y, k)) + S.back / S.front
   S.paint(g, part, 'back' | 'front', t, {x, y, k}) for a wear painter (🧳 AvatarWear) · S.setCharge(v) · S.tick(t, speed) · Motion.hit({fx: true, element: 'sky'}) = a small sun pop */
(function () {
  const M = window.Motion; if (!M || !M.fxAdd || !M.fxTools || M.TOP) return;
  const T = M.fxTools, TAU = Math.PI * 2, rng = T.rng, outBack = T.outBack, outQ = T.outQ, inQ = T.inQ, rgba = T.rgba, rampAt = T.rampAt;
  const cl = (v, a, b) => v < a ? a : v > b ? b : v, bell = q => q <= 0 || q >= 1 ? 0 : Math.sin(Math.PI * q);
  const SKY = {ramp: ['#FFFFFF', '#FFF8DC', '#FFE58A', '#FFC21A', '#F29E1F', '#B86A1E', '#6A3F1C'], glow: '#FFE066', smoke: '#BFE6F7'};
  M.elAdd('sky', SKY);
  const BLUE = ['#FFFFFF', '#E6F7FF', '#BDE9FB', '#8FD6F5', '#5BB8E6', '#3A86C4', '#24508A'];
  const INK = '#5A3A14';

  // ---------- 🎨 region motifs: accent ramp + a bit painter bit(g, x, y, s, a, u) (u = age 0..1) + an optional hit extra ----------
  const MOT = {};
  function motifAdd(key, d) { MOT[key] = d; }
  function petal(g, x, y, s, a, c1, c2) { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(0, s); g.bezierCurveTo(s * 0.9, s * 0.4, s * 0.7, -s * 0.8, s * 0.18, -s); g.lineTo(0, -s * 0.72); g.lineTo(-s * 0.18, -s); g.bezierCurveTo(-s * 0.7, -s * 0.8, -s * 0.9, s * 0.4, 0, s); g.fillStyle = c1; g.fill(); g.strokeStyle = c2; g.lineWidth = Math.max(0.8, s * 0.16); g.stroke(); g.restore(); }
  function star5(g, x, y, s, a, c, n, w) { n = n || 5; g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); for (let i = 0; i < n * 2; i++) { const r = i % 2 ? s * (w || 0.45) : s, an = i * Math.PI / n - Math.PI / 2; g.lineTo(Math.cos(an) * r, Math.sin(an) * r); } g.closePath(); g.fillStyle = c; g.fill(); g.restore(); }
  motifAdd('temple', {name: '🇹🇭 Temple Sky · kranok flame curls', acc: ['#FFFFFF', '#FFF1C2', '#FFD45C', '#E9A41C', '#C2410C', '#8A1E12', '#4A120C'],
    bit(g, x, y, s, a, u, A) {   // kranok = a flame tongue whose tip curls back into a spiral
      g.save(); g.translate(x, y); g.rotate(a); g.lineJoin = 'round';
      const sh = () => { g.beginPath(); g.moveTo(-s * 0.55, s * 0.6); g.quadraticCurveTo(-s * 0.7, -s * 0.2, -s * 0.05, -s * 0.95); g.quadraticCurveTo(s * 0.55, -s * 1.25, s * 0.55, -s * 0.7); g.quadraticCurveTo(s * 0.5, -s * 0.3, s * 0.12, -s * 0.42); g.quadraticCurveTo(s * 0.35, s * 0.1, s * 0.55, s * 0.6); g.closePath(); };
      sh(); g.fillStyle = A[3]; g.fill(); g.strokeStyle = A[5]; g.lineWidth = Math.max(0.8, s * 0.14); g.stroke();
      g.save(); g.scale(0.55, 0.62); g.translate(0, s * 0.18); sh(); g.fillStyle = A[2]; g.fill(); g.restore();
      g.beginPath(); g.arc(s * 0.3, -s * 0.72, s * 0.12, 0, TAU); g.fillStyle = A[0]; g.fill(); g.restore(); },
    ring(g, x, y, r, q, A, k) {   // a ring of small flame scallops
      const n = 10; for (let i = 0; i < n; i++) { const an = i / n * TAU + q * 0.6; this.bit(g, x + Math.cos(an) * r, y + Math.sin(an) * r * 0.9, 3.4 * k * (1 - q * 0.6), an + Math.PI / 2, q, A); } }});
  motifAdd('cherry', {name: '🗾 Cherry Sky · sakura petals + thunder ring', acc: ['#FFFFFF', '#FFF0F6', '#FFC9DD', '#FF8FB8', '#E8578C', '#9B2F68', '#4B1838'],
    bit(g, x, y, s, a, u, A) { petal(g, x, y, s * 0.9, a, A[2], A[4]); g.beginPath(); g.arc(x, y, s * 0.18, 0, TAU); g.fillStyle = A[0]; g.fill(); },
    ring(g, x, y, r, q, A, k) {   // thunder ring = a zig-zag circle (re-jag stepped, F12)
      const st = Math.floor(q * 8), R = rng(91 + st), n = 22; g.beginPath(); for (let i = 0; i <= n; i++) { const an = i / n * TAU, rr = r * (i % 2 ? 0.86 : 1.06) + (R() - 0.5) * 2 * k; g.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.9); }
      g.strokeStyle = rgba('#7B5CFF', 0.9 * (1 - q)); g.lineWidth = 2.6 * k; g.stroke(); g.strokeStyle = rgba('#FFFFFF', 1 - q); g.lineWidth = 1.1 * k; g.stroke(); }});
  motifAdd('sundisc', {name: '🏜️ Sun-Disc Sky · sun disc + lapis rings', acc: ['#FFFFFF', '#FFF4CC', '#FFD95A', '#F2B21C', '#2E5FD1', '#1E3A8A', '#14234F'],
    bit(g, x, y, s, a, u, A) { g.beginPath(); g.arc(x, y, s * 0.62, 0, TAU); g.fillStyle = A[3]; g.fill(); g.lineWidth = Math.max(1, s * 0.3); g.strokeStyle = A[4]; g.stroke(); g.beginPath(); g.arc(x - s * 0.15, y - s * 0.15, s * 0.22, 0, TAU); g.fillStyle = A[1]; g.fill(); },
    ring(g, x, y, r, q, A, k) { [1, 0.78].forEach((f, j) => { const rr = r * f * (0.8 + 0.3 * outQ(q)); g.beginPath(); g.ellipse(x, y, rr, rr * 0.9, 0, 0, TAU); g.strokeStyle = rgba(j ? A[3] : A[4], 1 - q); g.lineWidth = (j ? 1.6 : 3) * k * (1 - q * 0.5); g.setLineDash(q > 0.45 ? [4 * k, 3 * k] : []); g.stroke(); g.setLineDash([]); }); }});
  motifAdd('aurora', {name: '❄️ Aurora Sky · aurora ribbons + snow stars', acc: ['#FFFFFF', '#E8FFF6', '#A6F5D6', '#4FE0B0', '#3FA9F5', '#8B5CF6', '#2B2363'],
    bit(g, x, y, s, a, u, A) { g.save(); g.translate(x, y); g.rotate(a); g.strokeStyle = A[0]; g.lineWidth = Math.max(0.8, s * 0.2); g.lineCap = 'round';
      for (let i = 0; i < 3; i++) { g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(-s, 0); g.lineTo(s, 0); g.moveTo(s * 0.55, -s * 0.28); g.lineTo(s * 0.75, 0); g.lineTo(s * 0.55, s * 0.28); g.moveTo(-s * 0.55, -s * 0.28); g.lineTo(-s * 0.75, 0); g.lineTo(-s * 0.55, s * 0.28); g.stroke(); }
      g.restore(); },
    ring(g, x, y, r, q, A, k) {   // 3 aurora bands wave round the hit (green → blue → violet)
      [A[3], A[4], A[5]].forEach((c, j) => { g.beginPath(); for (let i = 0; i <= 28; i++) { const an = -Math.PI * 0.95 + i / 28 * Math.PI * 0.9, rr = r * (0.9 + j * 0.14) + Math.sin(i * 0.7 + q * 9 + j) * 2.2 * k; g.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.8); }
        g.strokeStyle = rgba(c, 0.85 * (1 - q)); g.lineWidth = 3 * k * (1 - q * 0.6); g.lineCap = 'round'; g.stroke(); }); }});
  motifAdd('ember', {name: '🌋 Ember Sky · embers + obsidian shards', acc: ['#FFFFFF', '#FFE9B0', '#FFB347', '#FF6A2A', '#C2264A', '#3B1F3F', '#1E1226'],
    bit(g, x, y, s, a, u, A) { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(0, -s); g.lineTo(s * 0.5, s * 0.1); g.lineTo(0.1 * s, s); g.lineTo(-s * 0.45, s * 0.2); g.closePath(); g.fillStyle = A[5]; g.fill(); g.beginPath(); g.moveTo(0, -s); g.lineTo(s * 0.5, s * 0.1); g.lineTo(0, s * 0.05); g.closePath(); g.fillStyle = '#5E3A6E'; g.fill();
      g.strokeStyle = A[3]; g.lineWidth = Math.max(0.8, s * 0.16); g.beginPath(); g.moveTo(0, -s); g.lineTo(s * 0.5, s * 0.1); g.stroke(); g.restore();
      g.beginPath(); g.arc(x + s * 0.9, y - s * 0.6, s * 0.22, 0, TAU); g.fillStyle = A[2]; g.fill(); },
    ring(g, x, y, r, q, A, k) { const R = rng(33); for (let i = 0; i < 12; i++) { const an = R() * TAU, d = r * (0.6 + 0.6 * outQ(q)) + R() * 4 * k, ds = (1.2 + R() * 1.4) * k * (1 - q); if (ds < 0.2) continue; g.beginPath(); g.arc(x + Math.cos(an) * d, y + Math.sin(an) * d * 0.9 - q * 10 * k, ds, 0, TAU); g.fillStyle = rampAt(A, 0.2 + q * 0.6); g.fill(); } }});
  motifAdd('pearl', {name: '🌊 Pearl Sky · pearls + bubble rings', acc: ['#FFFFFF', '#FFF7F2', '#FFE3E8', '#F7B8C8', '#5CC8E8', '#2A7FB8', '#1B3F6B'],
    bit(g, x, y, s, a, u, A) { g.beginPath(); g.arc(x, y, s * 0.6, 0, TAU); g.fillStyle = A[2]; g.fill(); g.lineWidth = Math.max(0.8, s * 0.14); g.strokeStyle = A[3]; g.stroke(); g.beginPath(); g.arc(x - s * 0.2, y - s * 0.22, s * 0.2, 0, TAU); g.fillStyle = A[0]; g.fill(); },
    ring(g, x, y, r, q, A, k) { const n = 9; for (let i = 0; i < n; i++) { const an = i / n * TAU + 0.3, d = r * (0.85 + 0.4 * outQ(q)), br = (2.2 + (i % 3)) * k * (1 - q * 0.5); g.beginPath(); g.arc(x + Math.cos(an) * d, y + Math.sin(an) * d * 0.9 - q * 6 * k, br, 0, TAU); g.strokeStyle = rgba(A[4], 1 - q); g.lineWidth = 1.2 * k; g.stroke(); g.beginPath(); g.arc(x + Math.cos(an) * d - br * 0.35, y + Math.sin(an) * d * 0.9 - q * 6 * k - br * 0.35, br * 0.25, 0, TAU); g.fillStyle = rgba('#FFFFFF', 1 - q); g.fill(); } }});
  motifAdd('star', {name: '🚀 Star Sky · star dust + comet tail', acc: ['#FFFFFF', '#F1F0FF', '#C8C4FF', '#8F86FF', '#5B4FE0', '#2E2A8A', '#16154A'],
    bit(g, x, y, s, a, u, A) { star5(g, x, y, s * 0.9, a, A[1], 4, 0.32); star5(g, x, y, s * 0.42, a, A[0], 4, 0.4); },
    ring(g, x, y, r, q, A, k) {   // a comet sweeps a half circle round the hit
      const an = -Math.PI + outQ(q) * Math.PI * 1.1, hx = x + Math.cos(an) * r, hy = y + Math.sin(an) * r * 0.85;
      g.lineCap = 'round'; for (let i = 0; i < 6; i++) { const b = an - (i + 1) * 0.12; g.beginPath(); g.moveTo(x + Math.cos(b + 0.12) * r, y + Math.sin(b + 0.12) * r * 0.85); g.lineTo(x + Math.cos(b) * r, y + Math.sin(b) * r * 0.85); g.strokeStyle = rgba(A[3 - Math.min(2, i >> 1)], (1 - i / 6) * (1 - q * 0.6)); g.lineWidth = (4 - i * 0.55) * k; g.stroke(); }
      g.beginPath(); g.arc(hx, hy, 2.6 * k, 0, TAU); g.fillStyle = A[0]; g.fill(); }});
  const motOf = P => MOT[P.motif] || null;

  // ---------- 1 · 💠 SKY CORE (loop) — a cel gem that pulses; brighter as {charge} 0..1 fills ----------
  function gem(g, x, y, s, R, rim) { const sh = () => { g.beginPath(); g.moveTo(x, y - s); g.lineTo(x + s * 0.78, y - s * 0.2); g.lineTo(x, y + s); g.lineTo(x - s * 0.78, y - s * 0.2); g.closePath(); };
    sh(); g.fillStyle = R[3]; g.fill(); if (rim) { g.strokeStyle = rim; g.lineWidth = Math.max(1, s * 0.16); g.lineJoin = 'round'; g.stroke(); }
    g.beginPath(); g.moveTo(x, y - s); g.lineTo(x + s * 0.78, y - s * 0.2); g.lineTo(x, y); g.lineTo(x - s * 0.78, y - s * 0.2); g.closePath(); g.fillStyle = R[2]; g.fill();
    g.beginPath(); g.moveTo(x - s * 0.3, y - s * 0.45); g.lineTo(x, y - s * 0.78); g.lineTo(x + s * 0.18, y - s * 0.5); g.closePath(); g.fillStyle = R[0]; g.fill(); }
  M.fxAdd('skycore', {el: 'sky', life: 1, loop: true, draw(g, P, t) {
    const k = P.k, x = P.x, y = P.y, s = (P.r || 5) * k, ch = cl(P.charge || 0, 0, 1), R = SKY.ramp, per = 1.25 - 0.55 * ch;
    const ph = (t % per) / per, beat = ph < 0.18 ? outQ(ph / 0.18) : 1 - inQ((ph - 0.18) / 0.82);
    T.glow(g, x, y, s * (2.6 + 1.6 * ch + beat * 0.8), SKY.glow, 0.45 + 0.4 * ch, 1);
    // 6 sun-crest rays behind the gem (grow with charge)
    g.save(); g.translate(x, y); for (let i = 0; i < 8; i++) { const an = i / 8 * TAU + t * 0.35, L = s * (1.35 + 0.5 * ch + 0.18 * beat) * (i % 2 ? 0.75 : 1);
      g.beginPath(); g.moveTo(Math.cos(an - 0.16) * s * 0.7, Math.sin(an - 0.16) * s * 0.7); g.lineTo(Math.cos(an) * L, Math.sin(an) * L); g.lineTo(Math.cos(an + 0.16) * s * 0.7, Math.sin(an + 0.16) * s * 0.7); g.closePath(); g.fillStyle = i % 2 ? R[2] : R[3]; g.fill(); } g.restore();
    gem(g, x, y, s * (1 + 0.08 * beat), R, P.day ? INK : R[5]);
    // pulse ring: grows → thins → breaks into dots (F5)
    const q = ph / 0.75; if (q < 1) { const rr = s * (1.2 + 1.3 * outQ(q)); if (q < 0.55) T.ellipse(g, x, y, rr, rr, rgba(R[1], 1 - q), 1.6 * k * (1 - q));
      else for (let i = 0; i < 10; i++) { const an = i / 10 * TAU; g.beginPath(); g.arc(x + Math.cos(an) * rr, y + Math.sin(an) * rr, 0.9 * k * (1 - q), 0, TAU); g.fillStyle = R[2]; g.fill(); } }
    const A = motOf(P); if (A && ch > 0.5) A.bit(g, x + s * 1.9, y - s * 1.4, s * 0.55, t * 0.8, 0, A.acc); }});

  // ---------- 2 · ☁️ ORBIT CLOUD (loop, back + front halves) — a tiny cel cloud on a tilted ring round the anchor ----------
  function cloud(g, x, y, s, day, alpha) { g.save(); g.globalAlpha *= alpha; const B = [[-0.55, 0.1, 0.42], [0, -0.18, 0.55], [0.55, 0.08, 0.4], [0.2, 0.22, 0.38], [-0.25, 0.25, 0.36]];
    g.beginPath(); B.forEach(([a, b, r]) => { g.moveTo(x + a * s + r * s, y + b * s); g.arc(x + a * s, y + b * s, r * s, 0, TAU); }); g.fillStyle = BLUE[3]; g.fill(); if (day) { g.strokeStyle = BLUE[6]; g.lineWidth = Math.max(0.8, s * 0.08); g.stroke(); }
    g.beginPath(); B.forEach(([a, b, r]) => { g.moveTo(x + a * s + r * s * 0.9, y + (b - 0.08) * s); g.arc(x + a * s, y + (b - 0.08) * s, r * s * 0.9, 0, TAU); }); g.fillStyle = BLUE[1]; g.fill();
    g.beginPath(); g.arc(x - 0.1 * s, y - 0.32 * s, 0.18 * s, 0, TAU); g.fillStyle = '#FFFFFF'; g.fill(); g.restore(); }
  function orbitAt(P, t) { const k = P.k, r = (P.r || 20) * k, per = 2.6, an = (t / per) * TAU + (P.seed % 7); return {an, x: P.x + Math.cos(an) * r, y: P.y + Math.sin(an) * r * 0.32 - Math.sin(t * 2.1) * 1.2 * k, front: Math.sin(an) > 0, r}; }
  function orbitPaint(g, P, t, wantFront) {
    const o = orbitAt(P, t), k = P.k; if (o.front !== wantFront) return;
    // sparkle trail behind the cloud along the ring (breaks into dots)
    for (let i = 1; i <= 5; i++) { const an = o.an - i * 0.22, sx = P.x + Math.cos(an) * o.r, sy = P.y + Math.sin(an) * o.r * 0.32; if ((Math.sin(an) > 0) !== wantFront) continue; g.beginPath(); g.arc(sx, sy, (1.4 - i * 0.22) * k, 0, TAU); g.fillStyle = rgba(SKY.ramp[2], 1 - i / 6); g.fill(); }
    cloud(g, o.x, o.y, 8 * k * (o.front ? 1 : 0.86), P.day, o.front ? 1 : 0.8);
    const A = motOf(P); if (A && o.front) A.bit(g, o.x + 6.5 * k, o.y - 4.5 * k, 2.4 * k, t, 0, A.acc); }
  M.fxAdd('skyorbit', {el: 'sky', life: 1, loop: true, back(g, P, t) { orbitPaint(g, P, t, false); }, draw(g, P, t) { orbitPaint(g, P, t, true); }});

  // ---------- 3 · 🪽 MINI WINGS (loop, back layer) — 2 small cel wings of 3 feathers, flutter with uneven timing (M23) ----------
  function wing(g, x, y, s, side, open, R, day) {   // side −1 left / +1 right
    g.save(); g.translate(x, y); g.scale(side, 1); g.rotate(-0.25 - open * 0.55);
    for (let i = 2; i >= 0; i--) { const L = s * (1.25 - i * 0.22), w = s * 0.34, an = -0.35 + i * 0.42;
      g.save(); g.rotate(an); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(L * 0.5, -w, L, -w * 0.25); g.quadraticCurveTo(L * 0.6, w * 0.45, 0, 0); g.closePath();
      g.fillStyle = i === 0 ? R[1] : i === 1 ? '#FFFFFF' : R[2]; g.fill(); g.strokeStyle = day ? INK : R[4]; g.lineWidth = Math.max(0.8, s * 0.07); g.stroke(); g.restore(); }
    g.beginPath(); g.arc(0, 0, s * 0.2, 0, TAU); g.fillStyle = R[3]; g.fill(); g.restore(); }
  M.fxAdd('skywings', {el: 'sky', life: 1, loop: true, back(g, P, t) {
    const k = P.k, s = (P.r || 9) * k, per = 1.1, ph = ((t + (P.seed % 5) * 0.13) % per) / per;
    const open = ph < 0.22 ? outQ(ph / 0.22) : ph < 0.4 ? 1 - outQ((ph - 0.22) / 0.18) * 0.85 : 0.15 + 0.06 * Math.sin(ph * 20);   // quick flap, then a long glide (never a perfect sine)
    const sp = (P.w || 7) * k; T.glow(g, P.x, P.y, s * 1.8, SKY.glow, 0.35, 0.7);
    wing(g, P.x - sp * 0.5, P.y, s, -1, open, SKY.ramp, P.day); wing(g, P.x + sp * 0.5, P.y, s, 1, open, SKY.ramp, P.day);
    if (ph > 0.18 && ph < 0.5) { const u = (ph - 0.18) / 0.32; for (let j = 0; j < 3; j++) { const sx = P.x + (j - 1) * s * 1.2, sy = P.y + s * (0.4 + u * 1.3); g.beginPath(); g.arc(sx, sy, 1.1 * k * (1 - u), 0, TAU); g.fillStyle = SKY.ramp[1]; g.fill(); } } }, draw() {}});

  // ---------- 4 · 🎀 GOLD RIBBON (loop, back layer) — tapered 2-sided ribbon, a wave runs root → tip (M12+), streams with {vx} ----------
  function ribbonPts(P, t) { const k = P.k, L = (P.len || 34) * k, n = 14, pts = [], vx = P.vx || 0, base = P.a != null ? P.a : Math.PI * 0.62 - vx * 0.5;
    for (let i = 0; i <= n; i++) { const u = i / n, wave = Math.sin(t * 4.6 - u * 6.2) * 0.95 * u + Math.sin(t * 2.3 - u * 3) * 0.3 * u, an = base + wave;
      const p = i ? pts[i - 1] : [P.x, P.y]; pts.push(i ? [p[0] + Math.cos(an) * L / n * (P.dir || 1) * -1, p[1] + Math.sin(an) * L / n] : [P.x, P.y]); }
    return pts; }
  M.fxAdd('skyribbon', {el: 'sky', life: 1, loop: true, back(g, P, t) {
    const k = P.k, pts = P.pts ? P.pts : ribbonPts(P, t), n = pts.length - 1, W = (P.w || 3.2) * k, R = SKY.ramp;
    if (P.day) { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.strokeStyle = rgba(INK, 0.75); g.lineWidth = W * 2.25; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); }
    for (let i = 0; i < n; i++) { const a = pts[i], b = pts[i + 1], u = i / n, w = W * (1 - u * 0.75), tw = Math.sin(t * 5.2 - u * 5.5 + 1.2);
      const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d * w, ny = dx / d * w;
      g.beginPath(); g.moveTo(a[0] + nx, a[1] + ny); g.lineTo(b[0] + nx * 0.92, b[1] + ny * 0.92); g.lineTo(b[0] - nx * 0.92, b[1] - ny * 0.92); g.lineTo(a[0] - nx, a[1] - ny); g.closePath();
      g.fillStyle = tw > 0.35 ? R[2] : tw < -0.35 ? R[5] : R[3]; g.fill(); }   // cel 3 bands: front · mid · the back side when it twists
    g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.strokeStyle = rgba('#FFFFFF', 0.85); g.lineWidth = Math.max(0.6, 0.7 * k); g.stroke();
    // the tip sheds bits (break, F5): sparkles or the region motif
    const A = motOf(P), tip = pts[n]; for (let j = 0; j < 3; j++) { const u = ((t * 1.4 + j / 3) % 1), sx = tip[0] - (P.dir || 1) * u * 10 * k, sy = tip[1] + u * 6 * k - Math.sin(u * 6 + j) * 2 * k, s = 2.2 * k * (1 - u);
      if (s < 0.3) continue; if (A) A.bit(g, sx, sy, s, u * 3 + j, u, A.acc); else { g.beginPath(); g.arc(sx, sy, s * 0.45, 0, TAU); g.fillStyle = R[1]; g.fill(); } } }, draw() {}});

  // ---------- 5 · ☀️ SUN-RAY HIT (one-shot, medium, 600 ms) — white sun pop → sun disc + 8 tapered rays + ring → rays break into dashes, ring into dots, cools gold → sky ----------
  function sunray(g, P, t) {
    const k = P.k, x = P.x, y = P.y, r = (P.r || 15) * k, R = SKY.ramp, A = motOf(P), day = P.day, rim = day ? INK : null;
    if (t < 0.05) { if (!P.calm) { g.beginPath(); g.arc(x, y, r * 0.95, 0, TAU); g.fillStyle = '#FFFFFF'; g.fill(); for (let i = 0; i < 8; i++) { const an = i / 8 * TAU; g.beginPath(); g.moveTo(x + Math.cos(an - 0.18) * r * 0.8, y + Math.sin(an - 0.18) * r * 0.8); g.lineTo(x + Math.cos(an) * r * 1.9, y + Math.sin(an) * r * 1.9); g.lineTo(x + Math.cos(an + 0.18) * r * 0.8, y + Math.sin(an + 0.18) * r * 0.8); g.fill(); } } return; }   // F2
    const q = cl((t - 0.05) / 0.55, 0, 1), peak = t < 0.13, cool = q;
    T.glow(g, x, y, r * (2.6 - q), SKY.glow, 0.9 * (1 - q), 1);
    // rays: biggest on the peak, then each breaks into 2 dashes that fly out + shrink (F5)
    for (let i = 0; i < 8; i++) { const an = i / 8 * TAU + 0.2, Lr = r * (i % 2 ? 1.55 : 2.1);
      if (peak) { g.beginPath(); g.moveTo(x + Math.cos(an - 0.2) * r * 0.75, y + Math.sin(an - 0.2) * r * 0.75); g.lineTo(x + Math.cos(an) * Lr, y + Math.sin(an) * Lr); g.lineTo(x + Math.cos(an + 0.2) * r * 0.75, y + Math.sin(an + 0.2) * r * 0.75); g.closePath(); g.fillStyle = rampAt(R, 0.35); g.fill(); if (rim) { g.strokeStyle = rim; g.lineWidth = 1 * k; g.stroke(); } }
      else { const u = cl((t - 0.13) / 0.42, 0, 1); for (let j = 0; j < 2; j++) { const d0 = r * (0.9 + j * 0.7 + 1.4 * outQ(u)), L = r * 0.5 * (1 - u), w = 1.8 * k * (1 - u); if (w < 0.25) continue;
        g.beginPath(); g.moveTo(x + Math.cos(an) * d0, y + Math.sin(an) * d0); g.lineTo(x + Math.cos(an) * (d0 + L), y + Math.sin(an) * (d0 + L)); g.strokeStyle = rampAt(day ? R.slice(2) : R, 0.25 + u * 0.6); g.lineWidth = w; g.lineCap = 'round'; g.stroke(); } } }
    // sun disc: 3 cel bands, shrinks after the peak
    const dr = r * (peak ? 0.95 : 0.95 * (1 - outQ(cl((t - 0.13) / 0.25, 0, 1)))); if (dr > 0.4) { g.beginPath(); g.arc(x, y, dr, 0, TAU); g.fillStyle = R[3]; g.fill(); if (rim) { g.strokeStyle = rim; g.lineWidth = 1.2 * k; g.stroke(); } g.beginPath(); g.arc(x, y, dr * 0.7, 0, TAU); g.fillStyle = R[2]; g.fill(); g.beginPath(); g.arc(x - dr * 0.15, y - dr * 0.15, dr * 0.36, 0, TAU); g.fillStyle = R[0]; g.fill(); }
    // ring: grows + thins → dashed → dots, cools gold → sky blue (F3)
    const rq = cl((t - 0.06) / 0.5, 0, 1), rr = r * (1.1 + 1.8 * outQ(rq)), rc = rampAt([R[2], R[3], BLUE[3], BLUE[4]], rq);
    if (rq < 0.5) T.ellipse(g, x, y, rr, rr * 0.92, rc, 2.4 * k * (1 - rq)); else if (rq < 1) for (let i = 0; i < 14; i++) { const an = i / 14 * TAU; g.beginPath(); g.arc(x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.92, 1.3 * k * (1 - rq), 0, TAU); g.fillStyle = rc; g.fill(); }
    // region motif: its own ring + 6 bits thrown out (calm 3)
    if (A) { const mq = cl((t - 0.06) / 0.5, 0, 1); if (A.ring && mq < 1) A.ring(g, x, y, r * 1.35, mq, A.acc, k);
      const Rn = rng(P.seed), nb = P.calm ? 3 : 6; for (let i = 0; i < nb; i++) { const an = Rn() * TAU, v = 1.3 + Rn() * 1.1, u = cl((t - 0.08) / 0.5, 0, 1), d = r * (0.6 + v * outQ(u)), s = 3.4 * k * (1 - inQ(u)); if (s < 0.4 || t < 0.08) continue;
        A.bit(g, x + Math.cos(an) * d, y + Math.sin(an) * d + u * u * 8 * k, s, an + u * 3, u, A.acc); } } }
  M.fxAdd('sunray', {el: 'sky', life: 0.6, contact: 0.05, draw: sunray});


  function glint4(g, x, y, s, a, c, core) { g.save(); g.translate(x, y); g.rotate(a); g.beginPath();
    for (let i = 0; i < 8; i++) { const r = i % 2 ? s * 0.22 : s, an = i * Math.PI / 4; g.lineTo(Math.cos(an) * r, Math.sin(an) * r); } g.closePath(); g.fillStyle = c; g.fill();
    if (core) { g.beginPath(); g.arc(0, 0, s * 0.22, 0, TAU); g.fillStyle = '#FFFFFF'; g.fill(); } g.restore(); }
  // ===================== 🔌 API — the sky as ONE object · 5 rig names for avatars AND creatures · it rides AvatarKit's own wear slots + the 🧊 turn hooks =====================
  const LOOPS = {core: 'skycore', orbit: 'skyorbit', wings: 'skywings', ribbon: 'skyribbon'}, PARTS = Object.keys(LOOPS), REG = {}; let REGN = 0;
  const isCre = w => typeof w === 'string' || !!(w && w.fam);
  // 🦴 Motion.topRig(who | creature, frame, x, y, k | size) → {top, core, back, spine[10], feet, face | faces, k} in screen px
  //    creatures = Creatures.rigAll (mo-17, exact) · avatars = Motion.rigAll on the frame's pose (mo-11; exact riding on a drawn avatar = S.wear, the hooks)
  function topRig(who, frame, x, y, k) {
    x = x || 0; y = y || 0; k = k || 1; const C = window.Creatures, R = {k}, P2 = p => p ? [x + p.x, y + p.y] : null;
    if (isCre(who)) { if (!C || !C.rigAll) return null; const A = C.rigAll(who, frame || {}, k), id = typeof who === 'string' ? who : who.id;
      R.k = k / 60; R.top = P2(A.top || A.head); R.core = P2(A.belly || A.chest || A.back); R.back = P2(A.back || A.seat || A.top); const fF = A.footF, fB = A.footB;
      R.feet = fF && fB ? [x + (fF.x + fB.x) / 2, y + Math.max(fF.y, fB.y)] : A.ground ? P2(A.ground) : [x, y];
      R.spine = A.s0 ? Array.from({length: 10}, (_, i) => P2(A['s' + i])) : (A.back && A.tail ? Array.from({length: 10}, (_, i) => [x + A.back.x + (A.tail.x - A.back.x) * i / 9, y + A.back.y + (A.tail.y - A.back.y) * i / 9]) : null);
      R.faces = Object.keys(A).filter(n => n === 'head' || /^[LR]\d$/.test(n)).map(n => [x + A[n].x, y + A[n].y, k * 0.13]); R.id = id; return R; }
    const f = frame || {}, P = f.pose || f, dir = f.dir || (who && who.dir) || 1, Q = M.rigAll ? M.rigAll(P, k, {}) : {};
    const at = (p, dx, dy) => p ? [x + dir * p.x + dir * (dx || 0) * k, y + p.y + (dy || 0) * k] : null, head = Q.head || {x: 0, y: -60 * k};
    R.top = at(head, 0, -18); R.core = at(Q.chest || {x: 0, y: -38 * k}); R.back = at(Q.back || {x: -11 * k, y: -40 * k}); R.feet = [x, y];
    R.spine = Array.from({length: 10}, (_, i) => [x, y + head.y + 14 * k + (-20 * k - head.y - 14 * k) * i / 9]); R.face = [x + dir * head.x, y + head.y, 21 * k]; return R; }
  // ☀️ S = Motion.sky({parts, motif, charge, calm, day, seed, t0}) — the 4 loops as one object
  function sky(o) {
    o = o || {}; const parts = (o.parts || PARTS).filter(p => LOOPS[p]), S = {id: ++REGN, o, parts, E: {}, charge: cl(o.charge || 0, 0, 1), speed: 0, t: null};
    parts.forEach((p, i) => { S.E[p] = M.fx(LOOPS[p], {x: 0, y: 0, k: 1, t0: o.t0 || 0, motif: o.motif, calm: o.calm, day: o.day, seed: (o.seed | 0) + 7 + i * 13,
      r: p === 'orbit' ? 23 : p === 'wings' ? 13 : undefined, w: p === 'wings' ? 16 : p === 'ribbon' ? 4.6 : undefined, len: p === 'ribbon' ? 46 : undefined}); });
    S.set = (p, a) => { const E = S.E[p]; if (E) Object.assign(E.P, a); return S; };
    S.setCharge = v => { S.charge = cl(+v || 0, 0, 1); return S; };
    S.tick = (t, speed) => { S.t = t; if (speed != null) S.speed = cl(speed, 0, 1); return S; };
    // place every part on a topRig → then S.back(g, t) before the body, S.front(g, t) after it (pages that draw the body themselves: creatures · cards · menus)
    S.place = (R, opt) => { if (!R) return S; opt = opt || {}; const k = R.k || 1, sp = opt.spine && R.spine;
      S.set('core', {x: R.core[0], y: R.core[1], k, charge: S.charge}); S.set('orbit', {x: R.top[0], y: R.top[1], k, face: R.face || null});
      S.set('wings', {x: R.back[0], y: R.back[1], k}); S.set('ribbon', sp ? {x: sp[0][0], y: sp[0][1], k, pts: sp.map(q => [q[0], q[1] - 3 * k])} : {x: R.back[0], y: R.back[1], k, pts: null, a: Math.PI * (0.38 - 0.28 * S.speed)}); return S; };
    S.back = (g, t) => { parts.forEach(p => M.drawFxBack(g, S.E[p], t)); return S; };
    S.front = (g, t) => { if (S.E.core) S.E.core.P.charge = S.charge; parts.forEach(p => M.drawFx(g, S.E[p], t)); return S; };
    S.paint = (g, p, layer, t, a) => { const E = S.E[p]; if (!E) return S; if (a) Object.assign(E.P, a); if (p === 'core') E.P.charge = S.charge; (layer === 'back' ? M.drawFxBack : M.drawFx)(g, E, t); return S; };
    S.wear = who => wear(who, S); S.unwear = who => unwear(who, S);
    REG[S.id] = S; return S; }
  // 🧥 S.wear(who): the sky rides a DRAWN avatar at the right depth — AvatarKit's own page-wear slots (flat: back = behind the body · neck = over the chest · head = round the head)
  //    and Motion.turnHook (🧊 turned: back · front · top). Only EMPTY slots are taken ({td: true, sky: id} — never saved); a slot that holds real wear = 🧳 AvatarWear calls S.paint itself.
  //    window.AK_WEAR is CHAINED (the page's own hook still runs for its own wear), never replaced.
  let prevWear = null, turnOn = false;
  function wearHook(q, slot, it, o) {
    const S = it && it.sky != null ? REG[it.sky] : null; if (!S) return prevWear ? prevWear.apply(this, arguments) : undefined;
    if (M.TURN && M.TURN.painting) return; const k = o.k, t = S.t != null ? S.t : (o.t || 0);
    if (slot === 'back') { S.paint(q, 'wings', 'back', t, {x: -8 * k, y: -41 * k, k}); S.paint(q, 'ribbon', 'back', t, {x: -9 * k, y: -43 * k, k, pts: null, a: Math.PI * (0.38 - 0.28 * S.speed)}); }
    if (slot === 'neck') S.paint(q, 'core', 'front', t, {x: 2 * k, y: -36 * k, k});
    if (slot === 'head') { const a = {x: 0, y: o.hy - 23 * k, k, face: [0, o.hy, 21 * k]}; S.paint(q, 'orbit', 'back', t, a); S.paint(q, 'orbit', 'front', t, a); } }
  function hookTurn() { if (turnOn || !M.turnHook) return; turnOn = true;
    M.turnHook(function (st, X) { const av = X.av, cw = av && av.cw, it = cw && (cw.back || cw.neck || cw.head), S = it && it.sky != null ? REG[it.sky] : null; if (!S) return;
      const q = X.g, k = X.k, t = S.t != null ? S.t : (X.t || 0);
      if (st === 'back') { const b = X.pt3([0, -41, -7], 'chest'); S.paint(q, 'wings', 'back', t, {x: b[0], y: b[1], k}); S.paint(q, 'ribbon', 'back', t, {x: b[0], y: b[1] - 2 * k, k, pts: null, a: Math.PI * (0.38 - 0.28 * S.speed)}); }
      if (st === 'front') { const c = X.pt3([0, -36, 7], 'chest'); S.paint(q, 'core', 'front', t, {x: c[0], y: c[1], k}); }
      if (st === 'top') { const h = X.pt3([0, -60, 0], 'chest'), a = {x: h[0], y: h[1] - 23 * k, k, face: [h[0], h[1], 21 * k]}; S.paint(q, 'orbit', 'back', t, a); S.paint(q, 'orbit', 'front', t, a); } }); }
  function wear(who, S) { const av = who && who.av ? who.av : who; if (!av) return S;
    if (typeof window !== 'undefined' && window.AK_WEAR !== wearHook) { prevWear = window.AK_WEAR || null; window.AK_WEAR = wearHook; } hookTurn();
    av.cw = av.cw || {}; ['back', 'neck', 'head'].forEach(s => { if (!av.cw[s]) av.cw[s] = {td: true, k: 'sky', sky: S.id}; }); return S; }
  function unwear(who, S) { const av = who && who.av ? who.av : who; if (av && av.cw) ['back', 'neck', 'head'].forEach(s => { const it = av.cw[s]; if (it && it.td && it.sky === S.id) delete av.cw[s]; }); return S; }
  // 💥 Motion.hit({fx: true, element: 'sky', motif}) → a small sun-ray pop + gold glint bits (elAdd / popAdd, like the mo-8 element pops)
  M.elAdd('sky', SKY, {bit(g, x, y, s, q, i) { if (q >= 1 || s <= 0.2) return; glint4(g, x, y, s * 1.1 * (1 - q), q * 0.8 + i, q < 0.3 ? '#FFFFFF' : rampAt(SKY.ramp, 0.2 + q * 0.5), q < 0.5); }});
  M.popAdd('sky', (g, H, tms, x, y, k) => { const t = tms / 1000; if (t < 0 || t > 0.6) return; sunray(g, {x, y, k, r: 10 * ((H.size || 20) / 20), seed: 5, motif: H.o && H.o.motif, calm: H.o && H.o.calm, day: H.o && H.o.day}, t); });
  M.motifAdd = motifAdd; M.MOTIFS = MOT; M.topRig = topRig; M.sky = sky;
  M.TOP = {VERSION: 'mo-18', kinds: ['skycore', 'skyorbit', 'skywings', 'skyribbon', 'sunray'], parts: PARTS, SKY, BLUE, INK, motifs: () => Object.keys(MOT), REG, wearHook, glint4};
  if (M.needLoaded) M.needLoaded('top');
})();
