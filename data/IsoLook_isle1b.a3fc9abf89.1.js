
/* 🌍 IsoLook_isle1b — 🇹🇭 isle1b — 🧳 Avateer ISLAND 1 part 2 = slice S2 "Eggs vs Engines" (ip-10, born split; needs isle1): 💧 Jewel Spring (💧 gauge) · 🦖 Raptor Ridge (horn tower · hatchery · trail stones · 🐟 fishing steps · 🪢 vine swing rep gate · 🍲 Sorry Stew) · 🤖 Bolt Works (water wheel · breeze tower · ♻️ scrap yard · 🧪 filter tower · 🛗 cog lift rep gate · leaking pipe) · ⚖️ border (job board · talking log · Nest-safe Workshop · Snack Club · 🌳 saplings · drill fence) — a LOOK file of 🌳 IsoProps (ip-4a: the engine + one file per look).
   Load it with Props.need(['isle1b'], start) (the 📲 offline app + tests have it inline already). Runs after IsoProps with Props._K (the kit's insides).
   Built from Test Harness/isoprops/kit/looks/isle1b.js by build_isoprops.py — never edit by hand. Same 14 rules as IsoProps (see the top of IsoProps.html). */
(function(K){
'use strict';
if(!K){ console.warn('IsoLook_isle1b: include IsoProps first'); return; }
if(!K.DEFS.il1_bathpond){ console.warn('IsoLook_isle1b: load IsoLook_isle1 first (Props.need does it)'); return; }
const {HTW, LOOKS, DEFS, MAT, PD, add, lit, sideOf, sh, rnd, addLook, addSet, organic, bareTree, FONT, T} = K;
/* 🇹🇭 IsoLook_isle1b — 🧳 Avateer ISLAND 1 "Elephant Jungle" set pieces, part 2 = slice S2 "Eggs vs Engines" (🌳 IsoProps chat, ip-10, build pack
   `Avateer — Island 1 build pack.md` §6 camps · §11 per islet · §15 S2): the joined islet 🦖 Raptor Ridge + 🤖 Bolt Works, the ⚖️ border between them,
   (the 🛕 River Temple shore + ferry = IsoLook_isle1c). Born split from IsoLook_isle1 (that file = S1, 90 KB): same set 'isle1' (one 🐘 tab in the lab), and
   Props.need(['isle1']) brings isle1b + isle1c along (Props.ALSO) — no game code changes. Sits on the 🌴 jungle look. Props never draw people / creatures:
   it.stand = where CreatureKit / AvatarKit stands them. Thai things stay respectful (R1: no working temple halls, no Buddha images).
   ip-10p look test: 💧 Jewel Spring (the ⚖️ Valley Balance 💧 gauge you can SEE, 6 states). */
const D = PD, M = MAT, TAU = Math.PI * 2, ph = (t, p) => ((t || 0) / p) * TAU;
const BAMBOO = '#CDB868', BAMBOO_D = '#A8923E', NODE = 'rgba(90,70,20,0.45)';
const path = (g, pts) => { g.beginPath(); pts.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); };
const blob = (P, cx, cy, rx, ry, z, n, seed, amp) => { const pts = []; for(let i = 0; i < n; i++){ const a = i / n * TAU, w = 1 + amp * Math.sin(a * 3 + seed) + amp * 0.5 * Math.cos(a * 5 + seed * 2); pts.push(P(cx + Math.cos(a) * rx * w, cy + Math.sin(a) * ry * w, z)); } return pts; };
const twinkle = (g, x, y, r, a, col) => { if(a <= 0.02) return; g.save(); g.globalAlpha = a; g.fillStyle = col || '#FFFFFF'; g.beginPath(); D.star(g, x, y, r, r * 0.28, 4, 0); g.fill(); g.restore(); };
const mix = (a, b, f) => { const p = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)), A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * f).toString(16).padStart(2, '0')).join(''); };
// a lumpy river ROCK (billboard): a darker base, a lit top-left, an optional moss cap · r = half width in px at zoom 1
function rock(g, x, y, k, r, h, seed, col, moss, cracked){ const R = D.rnd(seed), pts = []; for(let i = 0; i <= 10; i++){ const a = Math.PI + i / 10 * Math.PI, w = 0.86 + R() * 0.22; pts.push([x + Math.cos(a) * r * w * k, y - Math.sin(-a) * 0 + Math.sin(a) * h * w * k]); }
  g.fillStyle = D.sh(col, -0.22); g.beginPath(); g.moveTo(x - r * k, y); pts.forEach(q => g.lineTo(q[0], q[1])); g.lineTo(x + r * k, y); g.quadraticCurveTo(x, y + r * 0.42 * k, x - r * k, y); g.fill();
  g.fillStyle = col; g.beginPath(); g.moveTo(x - r * 0.9 * k, y - h * 0.15 * k); pts.slice(1, 8).forEach(q => g.lineTo(q[0] + 0.6 * k, q[1] + 0.8 * k)); g.quadraticCurveTo(x, y - h * 0.32 * k, x - r * 0.9 * k, y - h * 0.15 * k); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.22)'; g.beginPath(); g.ellipse(x - r * 0.32 * k, y - h * 0.66 * k, r * 0.34 * k, h * 0.16 * k, -0.3, 0, TAU); g.fill();
  if(moss){ g.fillStyle = moss; g.beginPath(); g.ellipse(x - r * 0.1 * k, y - h * 0.84 * k, r * 0.62 * k, h * 0.2 * k, 0.1, Math.PI, TAU); g.fill(); g.beginPath(); g.ellipse(x + r * 0.45 * k, y - h * 0.62 * k, r * 0.22 * k, h * 0.12 * k, 0.4, Math.PI, TAU); g.fill(); }
  if(cracked){ g.strokeStyle = 'rgba(42,28,20,0.55)'; g.lineWidth = 0.8 * k; g.beginPath(); g.moveTo(x + r * 0.1 * k, y - h * 0.95 * k); g.lineTo(x - r * 0.12 * k, y - h * 0.55 * k); g.lineTo(x + r * 0.18 * k, y - h * 0.3 * k); g.stroke(); } }
// a fern clump (billboard, sways in the live layer)
function fern(g, x, y, k, a, col, dry){ g.lineCap = 'round'; for(let n = 0; n < 6; n++){ const an = -Math.PI / 2 + (n - 2.5) * 0.42 + (Math.sin(a + n) * 0.05 + Math.cos(a * 2 + n) * 0.03), L = (dry ? 8 : 13) + (n % 3) * 2.5, tx = x + Math.cos(an) * L * k, ty = y + Math.sin(an) * L * k * 0.9;
    g.strokeStyle = dry ? '#A88A4A' : n % 2 ? col : D.sh(col, 0.12); g.lineWidth = 1.4 * k; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo((x + tx) / 2 + Math.cos(an + 1.2) * 2.5 * k, (y + ty) / 2, tx, ty); g.stroke();
    if(!dry){ g.lineWidth = 0.8 * k; for(let s = 1; s < 5; s++){ const f = s / 5, px = x + (tx - x) * f, py = y + (ty - y) * f, l = (1 - f) * 3.2 * k; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(an - 1.1) * l, py + Math.sin(an - 1.1) * l); g.moveTo(px, py); g.lineTo(px + Math.cos(an + 1.1) * l, py + Math.sin(an + 1.1) * l); g.stroke(); } } } }

/* ───────────── ⚖️ 💧 JEWEL SPRING (3 × 3, `il1_jewelspring`, the border of the joined islet, lore §27l-5 · the Valley Balance 💧 water gauge §6) ─────────────
   ONE spring, TWO camps: a round basin in a ring of mossy river rocks, the big JEWEL crystal at the back where the water wells up, the creek leaving at the front
   (south, to Mango Grove). 🦖 west bank = a fern clump + 3 raptor claw marks on a rock (+ three-toed footprints trampled in the mud while the gauge is low) ·
   🤖 east bank = Bolt Works' iron intake pipe with a valve wheel (drips oil while the gauge is low · a mesh filter sock from w3). The FRONT slab = the 📊 gauge
   you can SEE without words: 5 sockets, one fills with a blue glass drop per gauge dot (rule 7, no numbers).
   states = the 💧 gauge, only goes UP (§6 "kid-safe, no chores"): w0 pea-green + scum + a can + a bottle · w1 the bottle is gone · w2 the can + oil sheen gone ·
   w3 teal, reeds sprout, the filter sock · w4 clear: pebbles + a fish shadow · w5 crystal clear, a lotus opens, the jewel shines, a fish jumps (🌈 when ALL 4 gauges are
   full the 🧳 chat plays the Spring Festival — this prop just shines). Each state its own live gimmick (6 frames / 2.4 s): w0 glub bubble · w1 one clean ring at the jewel ·
   w2 welling rings + a drifting leaf · w3 a water strider skates · w4 the fish shadow circles · w5 the fish jumps + jewel sparkles + a mist bow.
   it.stand = the front slab (where you fill the flask for 🧪 c6) · touchAt = the jewel. 🍂 dry = a shrunk murky puddle, cracked mud · 🏚️ ruined = an empty cracked basin,
   the jewel snapped (its tip lies on the rocks), the pipe broken off. Game: Props.setState(it, 'w' + realm.balance.il1.w, map) (0–5). */
(function(){ const ST = ['w0', 'w1', 'w2', 'w3', 'w4', 'w5'];
  const def = add('isle1', 'il1_jewelspring', {name: 'Jewel Spring', foot: [3, 3], h: 62, kind: 'landmark', block: true, variants: 2, noRubble: true,
    states: ST, state: 'w0', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.5, 2.62, 3], touchAt: [1.25, 0.62, 30], shadowA: 0.04, tags: ['water', 'spring', 'island1', 'camps', 'balance'],
    diffs: [{by: 'state', a: 'w0', b: 'w5', level: 'bold', name: 'green spring / crystal clear'}, {by: 'state', a: 'w3', b: 'w4', level: 'small', name: 'one more gauge drop + the fish'}]});
  // water colour per gauge dot (opaque mix — lesson ip-7b ①: no see-through bodies over the rim)
  const WTOP = ['#7C9A3E', '#79A046', '#68A66A', '#4EAE98', '#3FB9CE', '#52CDEA'], WBOT = ['#5E7A2C', '#5E8434', '#4E8C58', '#3A9484', '#2FA0B8', '#3AB6DA'];
  const ROCKS = [[0.42, 0.55, 9, 7], [0.85, 0.2, 8, 6], [1.9, 0.18, 9, 7], [2.45, 0.42, 8, 6], [2.78, 1.0, 7, 6], [2.72, 1.75, 9, 7], [2.3, 2.42, 8, 6],
    [0.7, 2.42, 8, 6], [0.28, 1.78, 9, 7], [0.22, 1.12, 7, 6]];
  def.build = (B, v, L) => { const c = L.cond, st = L.state || 'w0', n = Math.max(0, ST.indexOf(st)), dry = !!(c && c.key === 'dry'), ruined = !!(c && c.broken), still = !!(c && c.still), sd = 1.3 + v * 2.1;
    const R = ruined ? 0 : dry ? 0.5 : 1, wt = dry ? '#8C8A52' : WTOP[n], wb = dry ? '#6E6C3E' : WBOT[n], low = n <= 1, clear = n >= 4;
    const jewelC = ruined || dry ? '#9AA6A0' : v ? ['#8E9A86', '#93A092', '#9AAEB0', '#A6C2D8', '#B8CEF4', '#D4DCFF'][n] : ['#8E9A7A', '#93A486', '#98B0A0', '#9ACCC6', '#A8E2E6', '#C8F6F8'][n];
    // the ground: grass lip → the trampled mud on the 🦖 west bank (only while the gauge is low) → the basin bottom → the water over it · + the creek lip at the front
    B.custom(1.5, 1.5, (g, P, k) => { path(g, blob(P, 1.5, 1.45, 1.52, 1.42, 0, 30, sd, 0.04)); g.fillStyle = ruined ? '#8E8A62' : dry ? '#9CA65E' : '#7CC15A'; g.fill();
      if((low || dry) && !ruined){ path(g, blob(P, 0.55, 1.5, 0.5, 0.75, 0, 16, sd + 2, 0.08)); g.fillStyle = '#8E6A44'; g.fill();
        g.fillStyle = 'rgba(60,40,24,0.55)'; [[0.42, 1.2], [0.62, 1.62], [0.4, 1.95]].forEach(([x, y]) => { const q = P(x, y, 0); for(let s = -1; s <= 1; s++){ g.beginPath(); g.ellipse(q[0] + s * 2.4 * k, q[1] - Math.abs(s) * 1.6 * k, 0.9 * k, 2.4 * k, s * 0.5, 0, TAU); g.fill(); } g.beginPath(); g.ellipse(q[0], q[1] + 1.8 * k, 1.6 * k, 1.1 * k, 0, 0, TAU); g.fill(); }); }
      // the creek mouth at the front (the outflow notch between the 2 front rocks, leaving south)
      const cr = [P(1.2, 2.25, 0), P(1.8, 2.25, 0), P(1.86, 2.5, 0), P(1.78, 2.75, 0), P(1.92, 3.0, 0), P(1.08, 3.0, 0), P(1.2, 2.78, 0), P(1.12, 2.5, 0)]; path(g, cr); g.fillStyle = ruined ? '#9A8462' : dry ? '#8A8452' : wb; g.fill();
      path(g, blob(P, 1.5, 1.28, 1.12, 1.0, -2, 28, sd + 0.6, 0.05)); const m = P(1.5, 1.28, -2); g.fillStyle = D.lin(g, m[0], m[1] - 18 * k, m[0], m[1] + 18 * k, ruined ? ['#9A8462', '#B8A27C'] : ['#6E6444', '#8E8058']); g.fill();
      if(ruined || dry){ g.strokeStyle = 'rgba(70,50,30,0.55)'; g.lineWidth = 0.9 * k; for(let i = 0; i < 12; i++){ const a = i / 12 * TAU + v, q0 = P(1.5 + Math.cos(a) * 0.2, 1.28 + Math.sin(a) * 0.18, -2), q1 = P(1.5 + Math.cos(a + 0.25) * 1.0, 1.28 + Math.sin(a + 0.25) * 0.9, -2);
          g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo((q0[0] + q1[0]) / 2 + 2 * k, (q0[1] + q1[1]) / 2 - 1 * k); g.lineTo(q1[0], q1[1]); g.stroke(); } }
      if(R > 0){ const W = blob(P, 1.5, 1.3, 1.06 * R + 0.02, 0.94 * R + 0.02, 0, 28, sd + 0.6, 0.05), w = P(1.5, 1.3, 0); path(g, W); g.fillStyle = D.lin(g, w[0], w[1] - 18 * k, w[0], w[1] + 18 * k, [wt, wb]); g.fill();
        // clear water: you SEE the bottom (pebbles + light ripples) · low: scum blobs float · w0–w1 an oil sheen swirl near the pipe
        if(clear && !dry){ const Rn = D.rnd(31 + v); for(let i = 0; i < 18; i++){ const q = P(0.7 + Rn() * 1.6, 0.6 + Rn() * 1.4, 0); g.fillStyle = i % 3 ? 'rgba(232,214,170,0.55)' : 'rgba(150,130,96,0.5)'; g.beginPath(); g.ellipse(q[0], q[1], (1 + Rn() * 1.5) * k, (0.6 + Rn() * 0.6) * k, 0, 0, TAU); g.fill(); }
          g.strokeStyle = 'rgba(255,255,255,0.3)'; g.lineWidth = 0.8 * k; for(let i = 0; i < 4; i++){ const q = P(0.9 + i * 0.4, 1.0 + (i % 2) * 0.5, 0); g.beginPath(); g.ellipse(q[0], q[1], 7 * k, 2.4 * k, 0.2, 0.3, 2.6); g.stroke(); } }
        if(n <= 2 && !dry){ const Rs = D.rnd(7 + v); g.fillStyle = n === 2 ? 'rgba(170,190,110,0.5)' : 'rgba(150,176,70,0.85)'; for(let i = 0; i < (n === 2 ? 3 : 9 - n * 2); i++){ const q = P(0.7 + Rs() * 1.6, 0.7 + Rs() * 1.2, 0); path(g, blob(P, 0.7 + Rs() * 1.6, 0.7 + Rs() * 1.2, 0.09 + Rs() * 0.1, 0.07 + Rs() * 0.07, 0, 9, i, 0.2)); g.fill(); } }
        if(n <= 1 && !dry){ const q = P(2.25, 1.15, 0); ['rgba(255,90,140,0.45)', 'rgba(255,220,70,0.45)', 'rgba(80,200,255,0.45)'].forEach((col, i) => { g.strokeStyle = col; g.lineWidth = 1.3 * k; g.beginPath(); g.ellipse(q[0] - i * 1.4 * k, q[1] + i * 0.6 * k, (9 - i * 2) * k, (3.4 - i * 0.7) * k, 0.25, 0.4, 5.2); g.stroke(); }); }
        g.strokeStyle = 'rgba(255,255,255,' + (clear ? 0.7 : 0.35) + ')'; g.lineWidth = 1 * k; path(g, W); g.stroke(); }
      // the creek water leaving at the front (same colour as the gauge) + a little foam where it tips over the lip
      if(R > 0){ path(g, [P(1.27, 2.25, 0.2), P(1.73, 2.25, 0.2), P(1.79, 2.5, 0.2), P(1.7, 2.76, 0.2), P(1.84, 3.0, 0.2), P(1.16, 3.0, 0.2), P(1.28, 2.78, 0.2), P(1.2, 2.5, 0.2)]); g.fillStyle = D.lin(g, 0, P(1.5, 2.25, 0)[1], 0, P(1.5, 3, 0)[1], [wt, wb]); g.fill();
        g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 1 * k; [2.4, 2.65].forEach(y => { const a = P(1.33, y, 0.3), b = P(1.68, y, 0.3); g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 1.6 * k, b[0], b[1]); g.stroke(); }); } }, {layer: -2});
    // 🤖 the intake pipe (east bank, comes in from the right edge, dips into the basin) — iron boxes = rule-1 corners + light, the valve wheel on top
    if(ruined){ B.box(2.7, 1.32, 0, 0.3, 0.16, 5, M.iron); B.custom(2.6, 1.4, (g, P, k) => { const q = P(2.58, 1.4, 1); g.fillStyle = '#6A6E78'; g.beginPath(); g.ellipse(q[0], q[1], 4.4 * k, 2 * k, 0.5, 0, TAU); g.fill(); }, {layer: 1}); }
    else { B.box(2.48, 1.32, 5, 0.52, 0.16, 5, M.iron); B.box(2.32, 1.3, 1, 0.16, 0.2, 9, M.iron); B.box(2.93, 1.28, 0, 0.07, 0.24, 11, M.dark);
      B.custom(2.62, 1.4, (g, P, k, t) => { const a = still ? 0 : ph(t, 2.4), q = P(2.62, 1.4, 14.5); g.strokeStyle = '#C8402E'; g.lineWidth = 1.6 * k; g.beginPath(); g.ellipse(q[0], q[1], 4 * k, 2 * k, 0, 0, TAU); g.stroke();
        for(let s = 0; s < 4; s++){ const an = s / 4 * Math.PI + (low ? 0 : 0.4); g.beginPath(); g.moveTo(q[0] - Math.cos(an) * 4 * k, q[1] - Math.sin(an) * 2 * k); g.lineTo(q[0] + Math.cos(an) * 4 * k, q[1] + Math.sin(an) * 2 * k); g.stroke(); }
        g.fillStyle = '#E8E0D0'; g.beginPath(); g.arc(q[0], q[1], 0.9 * k, 0, TAU); g.fill();
        const o = P(2.32, 1.4, 1.5); if(n >= 3 && !dry){ g.fillStyle = 'rgba(245,245,240,0.95)'; g.beginPath(); g.ellipse(o[0], o[1] - 2.5 * k, 3.4 * k, 4.4 * k, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(120,130,140,0.6)'; g.lineWidth = 0.5 * k;
          for(let s = -2; s <= 2; s++){ g.beginPath(); g.moveTo(o[0] + s * 1.3 * k, o[1] - 6.6 * k); g.lineTo(o[0] + s * 1.3 * k, o[1] + 1.6 * k); g.stroke(); } for(let s = 0; s < 4; s++){ g.beginPath(); g.moveTo(o[0] - 3.2 * k, o[1] - 5.5 * k + s * 2 * k); g.lineTo(o[0] + 3.2 * k, o[1] - 5.5 * k + s * 2 * k); g.stroke(); } }
        if(low && !dry){ const f = still ? 0.3 : ((t || 0) / 2.4 * 2) % 1; g.fillStyle = '#3A2E26'; g.beginPath(); g.ellipse(o[0] - 0.5 * k, o[1] + f * 6 * k, 1.1 * k, 1.6 * k, 0, 0, TAU); g.fill(); } }, {layer: 3}); }
    // the ring of mossy river rocks (billboards: each its own depth, so they overlap right at every turn) — the west 🦖 rock carries 3 claw marks
    ROCKS.forEach(([x, y, r, h], i) => { if(ruined && (i === 3 || i === 7)) return; B.bill(x, y, 0, (g, X, Y, k) => { rock(g, X, Y, k, r + (i % 2) * v, h, 11 + i * 3 + v * 7, ruined ? '#9A9488' : dry ? '#A8A08A' : '#8E928A', ruined || dry ? null : (low ? '#6E8E3A' : '#5DAE4A'), ruined && i % 3 === 0);
      if(i === 8 && !ruined){ g.strokeStyle = 'rgba(42,28,20,0.6)'; g.lineWidth = 1.1 * k; g.lineCap = 'round'; for(let s = 0; s < 3; s++){ g.beginPath(); g.moveTo(X - 3 * k + s * 2.6 * k, Y - h * 0.82 * k); g.lineTo(X - 4.6 * k + s * 2.6 * k, Y - h * 0.3 * k); g.stroke(); } } }, {layer: 1}); });
    if(ruined) [[2.2, 0.75], [0.9, 2.05]].forEach(([x, y], i) => B.bill(x, y, 0, (g, X, Y, k) => rock(g, X, Y, k, 6, 4, 70 + i, '#9A9488', null, true), {layer: 1}));
    // 🦖 the fern clump on the west bank (sways) · brown when dry / ruined
    B.bill(0.18, 0.55, 0, (g, X, Y, k, t) => fern(g, X, Y, k, still ? 0 : ph(t, 2.4), '#3E9A3A', dry || ruined), {layer: 2});
    // reeds at the back-right — sprout from w3 (the water is getting better)
    if(n >= 3 && !ruined) B.bill(2.15, 0.62, 0, (g, X, Y, k, t) => { const a = still ? 0 : ph(t, 2.4); g.lineCap = 'round'; for(let s = 0; s < 5; s++){ const sw = (Math.sin(a + s) * 1.1 + Math.cos(a * 2 + s) * 0.5) * k, hh = ((dry ? 9 : n === 3 ? 10 : 16) + (s % 3) * 3) * k, bx = X + (s - 2) * 2 * k;
        g.strokeStyle = dry ? '#B39A52' : s % 2 ? '#4E9E3A' : '#62B248'; g.lineWidth = 1.3 * k; g.beginPath(); g.moveTo(bx, Y); g.quadraticCurveTo(bx + sw * 0.5, Y - hh * 0.6, bx + sw, Y - hh); g.stroke();
        if(n >= 4 && s === 1 && !dry){ g.fillStyle = '#7A5230'; g.beginPath(); g.ellipse(bx + sw, Y - hh - 2 * k, 1.1 * k, 2.6 * k, 0, 0, TAU); g.fill(); } } }, {layer: 2});
    // floating litter while the gauge is low: w0 a bottle + a can · w1 only the can (drawn, no brand)
    if(n <= 1 && !dry && !ruined) B.custom(1.5, 1.4, (g, P, k, t) => { const a = still ? 0 : ph(t, 2.4), b = 0.6 * Math.sin(a) + 0.3 * Math.cos(a * 2);
      const cn = P(1.85, 1.75, 0); g.save(); g.translate(cn[0], cn[1] + b * k); g.rotate(0.5); g.fillStyle = '#B8BEC8'; g.fillRect(-3.4 * k, -1.8 * k, 6.8 * k, 3.6 * k); g.fillStyle = '#D85A4A'; g.fillRect(-1.8 * k, -1.8 * k, 3 * k, 3.6 * k); g.fillStyle = '#8E949E'; g.beginPath(); g.ellipse(3.4 * k, 0, 0.9 * k, 1.8 * k, 0, 0, TAU); g.fill(); g.restore();
      if(n === 0){ const bt = P(1.05, 1.0, 0); g.save(); g.translate(bt[0], bt[1] - b * k); g.rotate(-0.35); g.fillStyle = 'rgba(190,232,214,0.95)'; g.beginPath(); g.roundRect(-4.6 * k, -1.7 * k, 7 * k, 3.4 * k, 1.4 * k); g.fill(); g.fillRect(2.2 * k, -0.9 * k, 2.2 * k, 1.8 * k);
        g.fillStyle = '#3E8EF0'; g.fillRect(4.2 * k, -1.1 * k, 1.1 * k, 2.2 * k); g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(-3.6 * k, -1.3 * k, 4.4 * k, 0.7 * k); g.restore(); } }, {layer: 2});
    // the JEWEL: a big clear crystal cluster at the back, rising out of the rocks — dull + slimy while the gauge is low, clear + bright at w5 · ruined = snapped (its tip lies on a rock)
    B.bill(1.25, 0.5, 0, (g, X, Y, k) => { const lit = mix(jewelC, '#FFFFFF', 0.38), drk = D.sh(jewelC, -0.3), H = ruined ? 16 : 40 + v * 4;
      const prism = (cx, by, w, hh, tilt, col) => { const top = [cx + tilt * k, by - hh * k], tip = [top[0], top[1] - w * 0.9 * k];
        g.fillStyle = D.sh(col, -0.18); g.beginPath(); g.moveTo(cx, by); g.lineTo(cx + w * k, by - 2 * k); g.lineTo(top[0] + w * k, top[1] - 2 * k); g.lineTo(tip[0], tip[1]); g.lineTo(top[0], top[1]); g.closePath(); g.fill();
        g.fillStyle = mix(col, '#FFFFFF', 0.2); g.beginPath(); g.moveTo(cx, by); g.lineTo(cx - w * k, by - 2 * k); g.lineTo(top[0] - w * k, top[1] - 2 * k); g.lineTo(tip[0], tip[1]); g.lineTo(top[0], top[1]); g.closePath(); g.fill();
        g.fillStyle = 'rgba(255,255,255,' + (clear ? 0.55 : 0.25) + ')'; g.beginPath(); g.moveTo(top[0] - w * 0.55 * k, top[1] + 1 * k); g.lineTo(tip[0] - 0.4 * k, tip[1] + 2 * k); g.lineTo(top[0] - w * 0.2 * k, top[1] + 4 * k); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(42,28,20,0.22)'; g.lineWidth = 0.7 * k; g.beginPath(); g.moveTo(top[0], top[1]); g.lineTo(cx, by); g.stroke(); };
      g.fillStyle = 'rgba(42,28,20,0.18)'; g.beginPath(); g.ellipse(X, Y, 13 * k, 5 * k, 0, 0, TAU); g.fill();
      if(ruined){ prism(X - 1 * k, Y, 6, 12, 0, jewelC); prism(X + 7 * k, Y + 1 * k, 4, 8, 1.5, jewelC); g.fillStyle = '#C8CED0'; g.beginPath(); g.moveTo(X - 6 * k, Y - 12 * k); g.lineTo(X + 3 * k, Y - 14 * k); g.lineTo(X + 1 * k, Y - 10 * k); g.closePath(); g.fill();
        const tp = [X + 16 * k, Y + 2 * k]; g.save(); g.translate(tp[0], tp[1]); g.rotate(1.2); prism(0, 0, 4, 9, 0, jewelC); g.restore(); return; }
      prism(X - 8 * k, Y + 1 * k, 4.5, H * 0.48, -2, jewelC); prism(X + 8 * k, Y + 1.5 * k, 4, H * 0.4, 2.5, v ? jewelC : drk); prism(X, Y, 7, H * 0.78, 0.5, jewelC);
      if(low && !dry){ g.fillStyle = 'rgba(110,140,50,0.75)'; [[-7, -4, 5], [3, -2, 6], [-1, -12, 3]].forEach(([dx, dy, r]) => { g.beginPath(); g.ellipse(X + dx * k, Y + dy * k, r * k, r * 0.45 * k, 0, 0, TAU); g.fill(); }); }
      // the jewel's 5 water rings carved at its foot are the hint of the meter: nothing drawn here (the meter = the front slab)
      g.fillStyle = lit; g.beginPath(); g.arc(X - 2 * k, Y - H * 0.62 * k, 1.2 * k, 0, TAU); g.fill(); }, {layer: 2});
    // 📊 the FRONT slab = the gauge you can see: a flat laterite stone at the creek lip with 5 round sockets — one blue glass drop per gauge dot (the kid's flask spot too)
    B.custom(1.5, 2.62, (g, P, k) => { const T = blob(P, 1.5, 2.66, 0.42, 0.22, 3, 14, 3 + v, 0.06), Bt = blob(P, 1.5, 2.66, 0.42, 0.22, 0.4, 14, 3 + v, 0.06);
      path(g, Bt); g.fillStyle = ruined ? '#8A6A52' : '#8E5634'; g.fill(); path(g, T); g.fillStyle = ruined ? '#A88A6A' : '#C98552'; g.fill(); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.8 * k; g.stroke();
      for(let s = 0; s < 5; s++){ const q = P(1.5 + (s - 2) * 0.14, 2.62 + Math.abs(s - 2) * 0.035, 3), on = !ruined && s < n;
        g.fillStyle = 'rgba(70,40,20,0.55)'; g.beginPath(); g.ellipse(q[0], q[1], 2.6 * k, 1.5 * k, 0, 0, TAU); g.fill();
        if(on){ g.fillStyle = dry ? '#7AA0A8' : '#3EB8E8'; g.beginPath(); g.ellipse(q[0], q[1] - 0.6 * k, 2.2 * k, 1.5 * k, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(q[0] - 0.8 * k, q[1] - 1.1 * k, 0.6 * k, 0, TAU); g.fill(); } }
      if(ruined){ g.strokeStyle = 'rgba(42,28,20,0.6)'; g.lineWidth = 0.9 * k; const a = P(1.25, 2.6, 3), b = P(1.75, 2.72, 3); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 2 * k); g.lineTo(b[0], b[1]); g.stroke(); } }, {layer: 3});
    // w5: a lotus opens by the jewel (pink) · w4–w5 lily pads
    if(n >= 4 && !dry && !ruined) B.custom(1.5, 1.4, (g, P, k, t) => { const a = still ? 0 : ph(t, 2.4); [[0.85, 1.55, 0.16], [2.05, 1.85, 0.13]].forEach(([x, y, r], i) => { const q = P(x, y, 0.4 + 0.5 * Math.sin(a + i * 2) + 0.2 * Math.cos(a * 2 + i)), rx = r * 40 * k;
        g.fillStyle = i ? '#4FAE4A' : '#5DBE52'; g.beginPath(); g.moveTo(q[0], q[1]); g.ellipse(q[0], q[1], rx, rx * 0.5, 0, 0.4 + i, TAU - 0.05 + i); g.closePath(); g.fill(); });
      if(n === 5){ const q = P(0.85, 1.55, 2); for(let p = 0; p < 6; p++){ const an = -Math.PI / 2 + (p - 2.5) * 0.5; g.fillStyle = p % 2 ? '#F38FB4' : '#FFB8D0'; g.beginPath(); g.ellipse(q[0] + Math.cos(an) * 2.6 * k, q[1] - 2 * k + Math.sin(an) * 2.2 * k, 1.6 * k, 3.4 * k, an + Math.PI / 2, 0, TAU); g.fill(); }
        g.fillStyle = '#FFD84A'; g.beginPath(); g.arc(q[0], q[1] - 2.4 * k, 1.3 * k, 0, TAU); g.fill(); } }, {layer: 2});
    // fx (after the rim): each gauge step its own gimmick — glub · first ring · welling rings + a leaf · a water strider · the fish shadow · the fish jumps + the jewel shines
    if(ruined || dry) return;
    B.custom(1.5, 1.3, (g, P, k, t) => { const a = still ? 0 : ph(t, 2.4), u = still ? 0 : ((t || 0) / 2.4) % 1, wl = P(1.28, 0.78, 0);
      if(n === 0){ const q = P(1.6, 1.4, 0), f = u, r0 = (1 + f * 4.5) * k; if(f < 0.8){ g.fillStyle = 'rgba(150,180,80,0.9)'; g.beginPath(); g.ellipse(q[0], q[1] - r0 * 0.3, r0, r0 * 0.7, 0, Math.PI, TAU); g.fill(); g.strokeStyle = 'rgba(220,240,170,0.8)'; g.lineWidth = 0.8 * k; g.stroke(); }
        else { const s = (f - 0.8) / 0.2; g.strokeStyle = 'rgba(200,220,140,' + (1 - s).toFixed(3) + ')'; g.lineWidth = 1 * k; g.beginPath(); g.ellipse(q[0], q[1], (5 + s * 7) * k, (2.4 + s * 3) * k, 0, 0, TAU); g.stroke(); for(let d = 0; d < 4; d++){ g.fillStyle = 'rgba(170,200,100,' + (1 - s).toFixed(3) + ')'; g.beginPath(); g.arc(q[0] + Math.cos(d * 1.6) * (3 + s * 6) * k, q[1] - s * 5 * k - Math.sin(d * 1.6) * 2 * k, 0.9 * k, 0, TAU); g.fill(); } }
        const s2 = P(2.15, 1.2, 0); g.strokeStyle = 'rgba(255,120,190,0.35)'; g.lineWidth = 1 * k; g.beginPath(); g.ellipse(s2[0] + Math.cos(a) * 1.5 * k, s2[1] + Math.sin(a) * 0.8 * k, 5 * k, 2 * k, a * 0.3, 0, 4); g.stroke(); return; }
      const rings = n === 1 ? 1 : 2; for(let r = 0; r < rings; r++){ const f = (u + r / rings) % 1; g.strokeStyle = 'rgba(255,255,255,' + ((1 - f) * (n === 1 ? 0.55 : 0.8)).toFixed(3) + ')'; g.lineWidth = 1.2 * k; g.beginPath(); g.ellipse(wl[0], wl[1] + 4 * k, (4 + f * 18) * k, (2 + f * 8) * k, 0, 0, TAU); g.stroke(); }
      if(n === 2){ const q = P(1.5 + Math.cos(a) * 0.55, 1.4 + Math.sin(a) * 0.45, 0); g.save(); g.translate(q[0], q[1]); g.rotate(a + Math.sin(a * 2) * 0.4); g.fillStyle = '#E8A23A'; g.beginPath(); g.ellipse(0, 0, 3.4 * k, 1.5 * k, 0, 0, TAU); g.fill(); g.strokeStyle = '#A8661A'; g.lineWidth = 0.5 * k; g.beginPath(); g.moveTo(-3 * k, 0); g.lineTo(3.4 * k, 0); g.stroke(); g.restore(); }
      if(n === 3){ const dx = Math.sin(a) * 0.5 + Math.sin(a * 2) * 0.12, dy = Math.cos(a) * 0.35, q = P(1.6 + dx, 1.5 + dy, 0.5); g.strokeStyle = '#3A2E26'; g.lineWidth = 0.6 * k; for(let l = -1; l <= 1; l += 2) for(let s = -1; s <= 1; s++){ g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(q[0] + l * 4.5 * k, q[1] + s * 2.2 * k); g.stroke(); }
        g.fillStyle = '#3A2E26'; g.beginPath(); g.ellipse(q[0], q[1], 1.6 * k, 0.8 * k, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 0.6 * k; [[-4.5, -2.2], [4.5, 2.2], [-4.5, 2.2], [4.5, -2.2]].forEach(([x, y]) => { g.beginPath(); g.ellipse(q[0] + x * k, q[1] + y * k, 1.4 * k, 0.6 * k, 0, 0, TAU); g.stroke(); }); }
      if(n >= 4){ for(let s = 0; s < 3; s++){ const f = (u + s / 3) % 1, q = P(0.95 + s * 0.5, 1.05 + (s % 2) * 0.55, 0), al = Math.sin(Math.PI * f); twinkle(g, q[0] + Math.cos(a + s) * 2 * k, q[1], (1.2 + 2 * al) * k, al * 0.85, '#FFFFFF'); } }
      if(n === 4){ const q = P(1.5 + Math.cos(a) * 0.42, 1.45 + Math.sin(a) * 0.36, 0); g.save(); g.translate(q[0], q[1]); g.rotate(a + Math.PI / 2); g.fillStyle = 'rgba(30,70,90,0.45)'; g.beginPath(); g.ellipse(0, 0, 6 * k, 2.2 * k, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-5.5 * k, 0); g.lineTo(-9 * k, -2.4 * k); g.lineTo(-9 * k, 2.4 * k); g.closePath(); g.fill(); g.restore(); }
      if(n === 5){ const f = u, q0 = P(1.95, 1.65, 0), q1 = P(1.15, 1.35, 0), x = q0[0] + (q1[0] - q0[0]) * f, y = q0[1] + (q1[1] - q0[1]) * f - Math.sin(Math.PI * f) * 20 * k, an = Math.atan2(q1[1] - q0[1] - Math.cos(Math.PI * f) * 20 * k * Math.PI, q1[0] - q0[0]);
        if(f > 0.08 && f < 0.92){ g.save(); g.translate(x, y); g.rotate(an); g.fillStyle = '#F2A23A'; g.beginPath(); g.ellipse(0, 0, 4.6 * k, 2 * k, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-4 * k, 0); g.lineTo(-7.4 * k, -2.4 * k); g.lineTo(-7.4 * k, 2.4 * k); g.closePath(); g.fill(); g.fillStyle = '#2A1C14'; g.beginPath(); g.arc(2.6 * k, -0.4 * k, 0.6 * k, 0, TAU); g.fill(); g.restore(); }
        [q0, q1].forEach((q, i) => { const s = i ? f : 1 - f; if(s < 0.25){ const e = s / 0.25; g.strokeStyle = 'rgba(255,255,255,' + (1 - e).toFixed(3) + ')'; g.lineWidth = 1.1 * k; g.beginPath(); g.ellipse(q[0], q[1], (3 + e * 8) * k, (1.4 + e * 3) * k, 0, 0, TAU); g.stroke(); } });
        const jt = P(1.25, 0.5, 34); twinkle(g, jt[0] - 3 * k, jt[1] - 6 * k, (3 + 3 * (0.5 + 0.5 * Math.sin(a))) * k, 0.95, '#FFFFFF'); twinkle(g, jt[0] + 6 * k, jt[1] + 6 * k, (2 + 2 * (0.5 + 0.5 * Math.cos(a))) * k, 0.85, '#E6FBFF');
        g.save(); g.globalAlpha = 0.28 + 0.08 * Math.sin(a); ['#FF7A7A', '#FFD25A', '#7AE07A', '#6AC8FF', '#B28AFF'].forEach((col, i) => { g.strokeStyle = col; g.lineWidth = 1.3 * k; g.beginPath(); g.arc(wl[0] + 2 * k, wl[1] + 2 * k, (16 + i * 1.4) * k, Math.PI * 1.08, Math.PI * 1.92); g.stroke(); }); g.restore();
        const gl = g.createRadialGradient(jt[0], jt[1], 0, jt[0], jt[1], 22 * k); gl.addColorStop(0, 'rgba(210,250,255,0.45)'); gl.addColorStop(1, 'rgba(210,250,255,0)'); g.fillStyle = gl; g.beginPath(); g.arc(jt[0], jt[1], 22 * k, 0, TAU); g.fill(); } }, {fx: true, layer: 9});
  }; })();


/* ══════════ ip-10p2 (🌳 IsoProps chat, 2026-11-27, Aowu "go" = §54 T1–T8 ⭐): the S2 roll-out pins 1–17 at the ip-10p polish ══════════
   🦖 Ridge (pins 1–6) · 🤖 Works (pins 7–11) · ⚖️ border (pins 12–17) — every prop: own states + a live gimmick per state, 4 turns rebuilt, v0 / v1, 🍂 dry / 🏚️ ruined, def.diffs,
   no words in the art. The 3 other ⚖️ Balance gauges each get their own map prop like the 💧 spring (T5): 🐟 il1_fishsteps · 🗑️ il1_scrapyard · 🌳 il1_saplings (states 0 → 5,
   only up, a meter you SEE). Rep gates (🪢 vine swing · 🛗 cog lift) = def.gate 'rep:ridge' / 'rep:works' + walkStates ['ready'] (like the ✨ firefly arch — the prop draws its own cue). */
const BONE = '#F4EAD2', BONED = '#CDBE98', FERNC = '#4CB13A', FERN2 = '#2E8B3A', AMB = '#FF9A2E', BARK = '#8A5A34', SPOT = '#3FB8A8', EGGC = '#F8EFD9', LATER = '#C98552', LATER_D = '#8E5634';
const HULL = '#EEF1F6', METAL = '#9AA2B4', DARKM = '#4A5266', YEL = '#FFD23F', CYAN = '#5FE8FF', ORG = '#FF7A3A', BLK = '#2E3240', RUST = '#B8643A', COPPER = '#D8864A';
const ln = (g, a, b) => { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); };
const cyc = (t, p) => ((((t || 0) / p) % 1) + 1) % 1;
const dot = (g, x, y, r, col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); };
const oval = (g, x, y, rx, ry, rot, col) => { g.fillStyle = col; g.beginPath(); g.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot || 0, 0, TAU); g.fill(); };
const flags = c => ({ruined: !!(c && c.broken), dry: !!(c && c.key === 'dry'), still: !!(c && c.still)});
// a bone between two screen points (two knobs at each end)
function boneS(g, a, b, w, col){ col = col || BONE; g.lineCap = 'round'; g.strokeStyle = col; g.lineWidth = w; ln(g, a, b); const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L * w * 0.42, ny = dx / L * w * 0.42;
  [a, b].forEach(p => { dot(g, p[0] + nx, p[1] + ny, w * 0.6, col); dot(g, p[0] - nx, p[1] - ny, w * 0.6, col); }); g.strokeStyle = 'rgba(42,28,20,0.2)'; g.lineWidth = Math.max(0.5, w * 0.16); ln(g, [a[0] - nx * 0.5, a[1] - ny * 0.5], [b[0] - nx * 0.5, b[1] - ny * 0.5]); }
// the 🦖 Ridge emblem (a three-toe print) · the 🤖 Works emblem (a lightning bolt)
function claw3(g, x, y, r, col){ g.fillStyle = col; g.beginPath(); g.ellipse(x, y + r * 0.35, r * 0.48, r * 0.42, 0, 0, TAU); g.fill(); [[-0.62, -0.42, -0.5], [0, -0.72, 0], [0.62, -0.42, 0.5]].forEach(([dx, dy, a]) => { g.beginPath(); g.ellipse(x + dx * r, y + dy * r, r * 0.2, r * 0.36, a, 0, TAU); g.fill(); }); }
function zap(g, x, y, r, col){ g.fillStyle = col; g.beginPath(); g.moveTo(x + r * 0.25, y - r); g.lineTo(x - r * 0.55, y + r * 0.12); g.lineTo(x - r * 0.02, y + r * 0.12); g.lineTo(x - r * 0.3, y + r); g.lineTo(x + r * 0.58, y - r * 0.18); g.lineTo(x + r * 0.06, y - r * 0.18); g.closePath(); g.fill(); }
// a gear (screen space) · sy < 1 squashes it flat onto the ground
function gearS(g, x, y, r, n, rot, col, sy, hole){ g.save(); g.translate(x, y); g.scale(1, sy || 1); g.fillStyle = col; g.beginPath();
  for(let i = 0; i < n; i++){ const a = rot + i / n * TAU, s = Math.PI / n; [[a - s * 0.5, r * 0.8], [a - s * 0.32, r], [a + s * 0.32, r], [a + s * 0.5, r * 0.8], [a + s, r * 0.8]].forEach(([an, rr], j) => (i || j) ? g.lineTo(Math.cos(an) * rr, Math.sin(an) * rr) : g.moveTo(Math.cos(an) * rr, Math.sin(an) * rr)); }
  g.closePath(); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.4)'; g.lineWidth = Math.max(0.6, r * 0.07); g.stroke(); dot(g, 0, 0, r * 0.3, hole || 'rgba(42,28,20,0.6)'); g.restore(); }
// a JEWEL EGG (billboard): cream shell, teal (v1 amber) spots, a little gem set in its side that glints
function eggS(g, x, y, k, s, wob, spot, glint){ g.save(); oval(g, x, y, 5 * s * k, 2 * s * k, 0, 'rgba(42,28,20,0.22)'); g.translate(x, y); g.rotate(wob); const w = 4.6 * s * k, h = 6.6 * s * k;
  const gr = g.createLinearGradient(-w, -h * 2, w, 0); gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(0.5, EGGC); gr.addColorStop(1, '#E2D2AE'); g.fillStyle = gr; g.beginPath(); g.ellipse(0, -h, w, h, 0, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.7 * k; g.stroke(); [[-2, -9, 1.1], [1.8, -5, 1.4], [-1.2, -3.2, 0.8], [2.4, -10.5, 0.7]].forEach(([dx, dy, r]) => dot(g, dx * s * k, dy * s * k, r * s * k, spot));
  const gx = -1.4 * s * k, gy = -6.4 * s * k, gs = 1.8 * s * k; g.fillStyle = '#3FD6C2'; g.beginPath(); g.moveTo(gx, gy - gs); g.lineTo(gx + gs * 0.8, gy); g.lineTo(gx, gy + gs); g.lineTo(gx - gs * 0.8, gy); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.85)'; g.beginPath(); g.moveTo(gx, gy - gs); g.lineTo(gx + gs * 0.4, gy - gs * 0.1); g.lineTo(gx - gs * 0.2, gy); g.closePath(); g.fill();
  if(glint > 0.02) twinkle(g, gx + gs, gy - gs, (1 + 2.6 * glint) * k, glint, '#FFFFFF'); g.restore(); }
const puff = (g, x, y, r, a) => { if(a <= 0.02) return; g.fillStyle = 'rgba(255,255,255,' + Math.min(0.9, a).toFixed(3) + ')'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.arc(x + r * 0.8, y + r * 0.2, r * 0.7, 0, TAU); g.arc(x - r * 0.7, y + r * 0.3, r * 0.6, 0, TAU); g.fill(); };
const heartS = (g, x, y, s, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x, y + s * 0.9); g.bezierCurveTo(x - s * 1.4, y - s * 0.1, x - s * 0.7, y - s * 1.2, x, y - s * 0.45); g.bezierCurveTo(x + s * 0.7, y - s * 1.2, x + s * 1.4, y - s * 0.1, x, y + s * 0.9); g.fill(); };
// a falling / drifting leaf (screen space)
const leafS = (g, x, y, k, rot, col) => { g.save(); g.translate(x, y); g.rotate(rot); oval(g, 0, 0, 3 * k, 1.4 * k, 0, col); g.strokeStyle = 'rgba(42,28,20,0.35)'; g.lineWidth = 0.4 * k; ln(g, [-3 * k, 0], [3 * k, 0]); g.restore(); };
// a butterfly (screen space) · f = wing beat 0..1
const butterfly = (g, x, y, k, f, col) => { const w = 0.35 + 0.65 * Math.abs(Math.cos(f * TAU)); g.save(); g.translate(x, y); [-1, 1].forEach(s => { oval(g, s * 2.4 * w * k, -1 * k, 2.4 * w * k, 2 * k, s * 0.4, col); oval(g, s * 1.8 * w * k, 1.4 * k, 1.6 * w * k, 1.3 * k, -s * 0.3, D.sh(col, -0.15)); }); g.fillStyle = '#2A1C14'; g.fillRect(-0.4 * k, -2.4 * k, 0.8 * k, 4.6 * k); g.restore(); };
// a three-toe raptor footprint pressed in mud (ground, screen space)
const print3 = (g, x, y, k, rot, a) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(1, 0.55); g.fillStyle = 'rgba(60,40,24,' + (a || 0.5) + ')'; [-1, 0, 1].forEach(s => { g.beginPath(); g.ellipse(s * 2.2 * k, -Math.abs(s) * 0.6 * k - 2.2 * k, 0.8 * k, 2.4 * k, s * 0.45, 0, TAU); g.fill(); }); g.beginPath(); g.ellipse(0, 1.2 * k, 1.5 * k, 1.1 * k, 0, 0, TAU); g.fill(); g.restore(); };
// sound rings out of a mouth at (x, y) toward the angle `an` · f = 0..1 how far out
const soundRings = (g, x, y, k, an, f, col) => { for(let r = 0; r < 3; r++){ const u = (f + r / 3) % 1, rr = (6 + u * 26) * k, a = (1 - u) * 0.9; g.strokeStyle = (col || 'rgba(255,214,120,') + a.toFixed(3) + ')'; g.lineWidth = (2.2 - u * 1.2) * k; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, rr, an - 0.6, an + 0.6); g.stroke(); } };
// a little bulb (screen space) · on = lit
const bulbS = (g, x, y, k, on, col) => { g.strokeStyle = '#3A3A44'; g.lineWidth = 0.6 * k; ln(g, [x, y - 3 * k], [x, y - 1.4 * k]); dot(g, x, y, 1.7 * k, on ? (col || '#FFE27A') : '#B8B4A8'); dot(g, x - 0.5 * k, y - 0.5 * k, 0.6 * k, 'rgba(255,255,255,' + (on ? 0.9 : 0.5) + ')'); };
// a woven bamboo FISH TRAP (ไซ, billboard): a long cone of strips with a round mouth · ang = tilt
function trapS(g, x, y, k, s, ang, col, wet){ g.save(); g.translate(x, y); g.rotate(ang); const L = 16 * s * k, R = 5 * s * k; g.fillStyle = col; g.beginPath(); g.moveTo(-L / 2, -R); g.quadraticCurveTo(L * 0.2, -R * 1.15, L / 2, -R * 0.25); g.lineTo(L / 2, R * 0.25); g.quadraticCurveTo(L * 0.2, R * 1.15, -L / 2, R); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(90,60,20,0.55)'; g.lineWidth = 0.6 * k; for(let i = 1; i < 6; i++){ const u = -L / 2 + L * i / 6; g.beginPath(); g.moveTo(u, -R * (1 - i / 9)); g.lineTo(u, R * (1 - i / 9)); g.stroke(); } ln(g, [-L / 2, 0], [L / 2, 0]);
  oval(g, -L / 2, 0, R * 0.42, R, 0, wet ? 'rgba(30,50,40,0.7)' : '#5A3A1E'); g.strokeStyle = D.sh(col, -0.25); g.lineWidth = 1 * k; g.beginPath(); g.ellipse(-L / 2, 0, R * 0.42, R, 0, 0, TAU); g.stroke(); g.restore(); }

/* ───────────── 🦖 RIDGE ① 🦴 BONE-HORN TOWER (2 × 2, `il1_bonehorn`, the north end of the 🦖 west half · c2 "The Bone Horn") ─────────────
   A lashed-log lookout of the raptors: 4 bark posts with rope X-braces, a rope ladder on the front with two bone tusks at its foot, a plank deck with a bone rail, a fern-thatch hip
   roof with a bone finial + the claw pennant. On the deck the BIG HORN: a long curved bone horn with amber bands, its bell out over the front-right edge.
   silent (default — a 🌑 Hushling holds the horn's note): the horn lies low, lashed down with 2 rope loops, a cobweb in its bell, the pennant hangs limp, the 🗓️ rest-day stone at the foot
   has 7 plain notches · ✨ a leaf drifts down off the roof, the cobweb + the pennant barely sway.
   sounds (c2 done): the horn is raised + polished, sound rings roll out of the bell (fx), the pennant streams, leaves shake off the roof, the rest-day stone's 7th notch holds a fresh
   leaf + glows (the 🗓️ calendar opens). it.stand = the ladder foot · touchAt = the horn bell. 🍂 dry = straw roof, brown ferns · 🏚️ ruined = no roof, 2 posts snapped, the horn
   fallen + broken in two on the ground, the stone tipped. Game: Props.setState(it, 'sounds', map). */
(function(){ const ST = ['silent', 'sounds'];
  const def = add('isle1', 'il1_bonehorn', {name: 'Bone-horn tower', foot: [2, 2], h: 130, kind: 'landmark', block: true, variants: 2, noRubble: true,
    states: ST, state: 'silent', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [0.95, 1.94, 0], touchAt: [2.0, 1.06, 104], shadowA: 0.1, tags: ['ridge', 'raptor', 'horn', 'rest day', 'island1', 'camps'],
    diffs: [{by: 'state', a: 'silent', b: 'sounds', level: 'bold', name: 'horn tied down + silent / raised + sounding'}]});
  // the horn as a tapered curve through 3 MODEL points (turns with the prop) → {pts, L, R, w}
  const hornPath = (P, k, A, C, E) => { const N = 16, pts = [], L = [], R = [], W = []; for(let i = 0; i <= N; i++){ const u = i / N, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; pts.push(P(A[0] * a + C[0] * b + E[0] * c, A[1] * a + C[1] * b + E[1] * c, A[2] * a + C[2] * b + E[2] * c)); }
    pts.forEach((q, i) => { const p0 = pts[Math.max(0, i - 1)], p1 = pts[Math.min(N, i + 1)], dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy) || 1, w = (1.5 + 6.6 * Math.pow(i / N, 2.1)) * k; W.push(w); L.push([q[0] - dy / l * w, q[1] + dx / l * w]); R.push([q[0] + dy / l * w, q[1] - dx / l * w]); });
    return {pts, L, R, W, N}; };
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), on = (L.state || 'silent') === 'sounds', live = !still && !ruined;
    const LOG = v ? '#9A6A3E' : BARK, ROOF = dry || ruined ? '#B8A05A' : v ? '#E3BE6A' : '#58B444', HORN = ruined ? '#CFC6B0' : on ? '#FFF2D6' : '#E2D6B8', BAND = v ? '#3FB8A8' : AMB;
    // the ground: packed earth + a ring of bone-white pebbles
    B.custom(1, 1, (g, P, k) => { path(g, blob(P, 1, 1, 0.98, 0.98, 0, 24, 2 + v, 0.04)); g.fillStyle = ruined ? '#A8946A' : dry ? '#C8A872' : '#C9A46E'; g.fill();
      for(let i = 0; i < 18; i++){ const a = i / 18 * TAU + v, q = P(1 + Math.cos(a) * 0.9, 1 + Math.sin(a) * 0.9, 0); oval(g, q[0], q[1], 2.3 * k, 1.3 * k, 0, i % 2 ? BONE : BONED); }
      if(!ruined) [[0.45, 1.6, 0.3], [1.5, 0.35, 2.2]].forEach(([x, y, r]) => { const q = P(x, y, 0); print3(g, q[0], q[1], k, r, 0.35); }); }, {layer: -2});
    // 4 bark posts (2 snapped when ruined) + rope X-braces on every side (each its own depth)
    const PO = [[0.36, 0.36], [1.5, 0.36], [0.36, 1.5], [1.5, 1.5]], PH = ruined ? [80, 44, 80, 30] : [80, 80, 80, 80];
    PO.forEach(([x, y], i) => B.box(x, y, 0, 0.15, 0.15, PH[i], LOG, {trim: 13}));
    const brace = (a, b, side) => B.custom((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (g, P, k) => { g.strokeStyle = ruined ? '#9A8A6A' : '#D8C08A'; g.lineWidth = 1.3 * k; g.lineCap = 'round';
      [[8, 40], [44, 76]].forEach(([z0, z1], n) => { if(ruined && side === 3 && n === 1) return; ln(g, P(a[0], a[1], z0), P(b[0], b[1], z1)); ln(g, P(a[0], a[1], z1), P(b[0], b[1], z0)); }); }, {layer: 0});
    brace([0.44, 0.43], [1.58, 0.43], 0); brace([0.43, 0.44], [0.43, 1.58], 1); brace([1.6, 0.44], [1.6, 1.58], 2); brace([0.44, 1.62], [1.58, 1.62], 3);
    // the rope ladder up the front + 2 bone tusks at its foot
    B.custom(0.98, 1.7, (g, P, k) => { if(ruined) return; const a0 = P(0.82, 1.68, 0), a1 = P(0.82, 1.68, 84), b0 = P(1.14, 1.68, 0), b1 = P(1.14, 1.68, 84); g.strokeStyle = '#C8A86A'; g.lineWidth = 1.2 * k; ln(g, a0, a1); ln(g, b0, b1);
      g.strokeStyle = '#B98A4A'; g.lineWidth = 1.8 * k; for(let z = 8; z < 84; z += 9){ ln(g, P(0.82, 1.68, z), P(1.14, 1.68, z)); } }, {layer: 2});
    B.custom(0.98, 1.84, (g, P, k) => { [[0.68, -1], [1.28, 1]].forEach(([x, s]) => { const a = P(x, 1.84, 0); g.fillStyle = ruined ? '#C8BEA6' : BONE; g.beginPath(); g.moveTo(a[0] - 2.6 * k, a[1]); g.quadraticCurveTo(a[0] - 3 * k + s * 2 * k, a[1] - 18 * k, a[0] + s * 7 * k, a[1] - 30 * k);
      g.quadraticCurveTo(a[0] + s * 1 * k, a[1] - 16 * k, a[0] + 2.6 * k, a[1]); g.closePath(); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.7 * k; g.stroke(); oval(g, a[0], a[1], 4 * k, 1.6 * k, 0, 'rgba(42,28,20,0.25)'); }); }, {layer: 3});
    // the deck (+ a bone rail) and, when not ruined, the roof posts + the fern hip roof + the bone finial
    B.box(0.3, 0.3, 80, 1.42, 1.42, 5, v ? '#D8A86A' : M.plank, {trim: 0, keep: ruined ? false : true});
    if(!ruined){ [[0.3, 0.3, 1.42, 0.05], [0.3, 0.3, 0.05, 1.42]].forEach(([x, y, w, d]) => B.box(x, y, 85, w, d, 8, BONED, {trim: 0}));
      B.custom(1.0, 1.72, (g, P, k) => { for(let i = 0; i < 6; i++){ const x = 0.36 + i * 0.26; boneS(g, P(x, 1.7, 86), P(x + 0.18, 1.7, 86), 2 * k, BONE); } }, {layer: 3});
      B.custom(1.72, 1.0, (g, P, k) => { for(let i = 0; i < 6; i++){ const y = 0.36 + i * 0.26; boneS(g, P(1.7, y, 86), P(1.7, y + 0.18, 86), 2 * k, BONE); } }, {layer: 3});
      [[0.36, 0.36], [1.52, 0.36]].forEach(([x, y]) => B.box(x, y, 85, 0.1, 0.1, 30, LOG, {layer: 1})); [[0.36, 0.86], [1.52, 0.86]].forEach(([x, y]) => B.box(x, y, 85, 0.08, 0.08, 30, LOG, {layer: 1}));
      B.roof(0.28, 0.3, 115, 1.46, 0.7, 14, ROOF, {ridge: 'x', ov: 0.18, stripes: 7, layer: 2, gable: dry ? '#A8904A' : v ? '#C9A050' : '#3E9A36'});
      // the bone finial + the claw pennant on its pole (limp when silent · streams when it sounds)
      B.custom(1.0, 0.65, (g, P, k, t) => { const a = live ? ph(t, 2.4) : 0.4, top = P(1.0, 0.65, 129), pt = [top[0], top[1] - 22 * k]; boneS(g, [top[0] - 5 * k, top[1] + 1 * k], [top[0] + 5 * k, top[1] - 1 * k], 2.4 * k, BONE); g.strokeStyle = '#5A3418'; g.lineWidth = 1.4 * k; ln(g, top, pt);
        const sw = on ? 1 : 0.22, fl = (s) => Math.sin(a * (on ? 2 : 1) + s) * 2.4 * k * sw + Math.cos(a + s * 1.7) * 1.2 * k * sw; const ex = on ? 20 : 5, drop = on ? 2 : 13;
        g.fillStyle = dry ? '#C88A4A' : v ? '#3FB8A8' : '#E2502E'; g.beginPath(); g.moveTo(pt[0], pt[1]); g.quadraticCurveTo(pt[0] + ex * 0.5 * k, pt[1] + (2 + drop * 0.4) * k + fl(0), pt[0] + ex * k, pt[1] + (drop * 0.9 + 3) * k + fl(1)); g.lineTo(pt[0] + (ex * 0.4) * k, pt[1] + (drop * 0.6 + 6) * k + fl(2)); g.lineTo(pt[0], pt[1] + 9 * k); g.closePath(); g.fill();
        claw3(g, pt[0] + ex * 0.32 * k, pt[1] + (drop * 0.4 + 4.6) * k + fl(1) * 0.5, 2.2 * k, BONE); }, {layer: 4}); }
    // the HORN: lashed low (silent) · raised (sounds) · broken on the ground (ruined)
    B.custom(1.25, 1.25, (g, P, k, t) => { const a = live ? ph(t, 2.4) : 0.3;
      const draw = (H, col, cut) => { const {L: Lf, R: Rf, pts, W, N} = H, n = cut || N; g.fillStyle = col; g.beginPath(); for(let i = 0; i <= n; i++) i ? g.lineTo(Lf[i][0], Lf[i][1]) : g.moveTo(Lf[0][0], Lf[0][1]); for(let i = n; i >= 0; i--) g.lineTo(Rf[i][0], Rf[i][1]); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(42,28,20,0.32)'; g.lineWidth = 0.8 * k; g.stroke(); g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); for(let i = 2; i <= n - 1; i++){ const q = [(pts[i][0] * 2 + Lf[i][0]) / 3, (pts[i][1] * 2 + Lf[i][1]) / 3]; i > 2 ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } for(let i = n - 1; i >= 2; i--) g.lineTo(Lf[i][0] * 0.85 + pts[i][0] * 0.15, Lf[i][1] * 0.85 + pts[i][1] * 0.15); g.closePath(); g.fill();
        [4, 8, 12].forEach(i => { if(i > n - 1) return; g.strokeStyle = ruined ? 'rgba(120,100,70,0.6)' : BAND; g.lineWidth = 2 * k; ln(g, Lf[i], Rf[i]); });
        if(!cut){ const q = pts[N], p = pts[N - 1], an = Math.atan2(q[1] - p[1], q[0] - p[0]); g.save(); g.translate(q[0], q[1]); g.rotate(an); oval(g, 0, 0, W[N] * 0.42, W[N] * 1.05, 0, BONED); oval(g, 0.6 * k, 0, W[N] * 0.3, W[N] * 0.82, 0, '#4A3426');
          if(!on && !ruined){ g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 0.5 * k; const sw = Math.sin(a) * 0.6 * k; for(let s = 0; s < 4; s++){ const an2 = s / 4 * Math.PI - Math.PI / 2; ln(g, [0.6 * k, 0], [0.6 * k + Math.cos(an2) * W[N] * 0.3, Math.sin(an2) * W[N] * 0.8 + sw]); } g.beginPath(); g.ellipse(0.6 * k, sw * 0.5, W[N] * 0.16, W[N] * 0.42, 0, 0, TAU); g.stroke(); }
          g.restore(); return an; } };
      if(ruined){ draw(hornPath(P, k, [0.1, 1.15, 2], [0.42, 1.5, 6], [0.9, 1.72, 2]), HORN, 9); const H2 = hornPath(P, k, [1.1, 1.62, 2], [1.4, 1.9, 4], [1.88, 1.82, 3]); draw(H2, HORN); return; }
      const H = on ? hornPath(P, k, [0.42, 1.36, 90], [1.0, 0.98, 120], [2.0, 1.06, 106]) : hornPath(P, k, [0.42, 1.36, 88], [1.05, 1.3, 97], [1.98, 1.1, 92]);
      // the cradle (2 forked sticks) under the horn
      [[0.78, 1.3], [1.45, 1.2]].forEach(([x, y]) => { const b = P(x, y, 85), tp = P(x, y, on ? 104 : 93); g.strokeStyle = '#6E4524'; g.lineWidth = 2 * k; ln(g, b, tp); ln(g, tp, [tp[0] - 3 * k, tp[1] - 4 * k]); ln(g, tp, [tp[0] + 3 * k, tp[1] - 4 * k]); });
      draw(H, HORN);
      if(!on){ g.strokeStyle = '#B9905A'; g.lineWidth = 1.3 * k; [5, 11].forEach(i => { const q = H.pts[i], d = P(i < 8 ? 0.95 : 1.5, i < 8 ? 0.9 : 1.32, 85); g.beginPath(); g.ellipse(q[0], q[1], H.W[i] * 1.05, H.W[i] * 0.55, 0.6, 0, TAU); g.stroke(); ln(g, [q[0], q[1] + H.W[i] * 0.5], d); }); } }, {layer: 2});
    // 🗓️ the rest-day stone at the foot (front-left): a round standing stone with 7 notches; sounds = a fresh leaf in the 7th + a glow (fx)
    B.bill(0.34, 1.72, 0, (g, X, Y, k, t) => { g.save(); if(ruined){ g.translate(X, Y); g.rotate(-1.1); g.translate(-X, -Y + 4 * k); } oval(g, X, Y, 10 * k, 3.6 * k, 0, 'rgba(42,28,20,0.22)');
      const cy = Y - 10 * k; oval(g, X + 1 * k, cy + 0.8 * k, 9.6 * k, 10 * k, 0, '#7E786C'); oval(g, X, cy, 9.4 * k, 9.8 * k, 0, ruined ? '#A8A092' : '#B9B2A2'); oval(g, X - 3 * k, cy - 4 * k, 3.4 * k, 2 * k, -0.4, 'rgba(255,255,255,0.3)');
      for(let s = 0; s < 7; s++){ const an = -Math.PI / 2 + s / 7 * TAU, q = [X + Math.cos(an) * 6.6 * k, cy + Math.sin(an) * 6.8 * k]; dot(g, q[0], q[1], 1.2 * k, 'rgba(60,50,40,0.6)'); }
      claw3(g, X, cy + 1 * k, 2.6 * k, 'rgba(60,50,40,0.55)');
      if(ruined){ g.strokeStyle = 'rgba(42,28,20,0.6)'; g.lineWidth = 0.9 * k; ln(g, [X - 2 * k, cy - 9 * k], [X + 1 * k, cy - 2 * k]); ln(g, [X + 1 * k, cy - 2 * k], [X - 1 * k, cy + 6 * k]); }
      if(on){ const an = -Math.PI / 2 + 6 / 7 * TAU, q = [X + Math.cos(an) * 6.6 * k, cy + Math.sin(an) * 6.8 * k]; leafS(g, q[0] - 2 * k, q[1] - 1.6 * k, k * 1.3, -0.7 + (live ? Math.sin(ph(t, 2.4)) * 0.15 : 0), dry ? '#B8A04A' : '#5DBE48'); }
      g.restore(); }, {layer: 3});
    // fx: sounds = rings out of the bell + the rest-day notch glows + leaves shake off · silent = one leaf drifts down
    if(ruined) return;
    B.custom(1.0, 1.0, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.35, a = live ? ph(t, 2.4) : 0.3;
      if(on){ const H = hornPath(P, k, [0.42, 1.36, 90], [1.0, 0.98, 120], [2.0, 1.06, 106]), q = H.pts[H.N], p = H.pts[H.N - 1]; soundRings(g, q[0], q[1], k, Math.atan2(q[1] - p[1], q[0] - p[0]), u);
        const st = P(0.34, 1.72, 0), an = -Math.PI / 2 + 6 / 7 * TAU; D.glow(g, st[0] + Math.cos(an) * 6.6 * k, st[1] - 10 * k + Math.sin(an) * 6.8 * k, 9 * k, '#FFD86A', 0.55 + 0.25 * Math.sin(a));
        for(let i = 0; i < 3; i++){ const f = (u + i / 3) % 1, s0 = P(0.5 + i * 0.5, 1.15, 114); leafS(g, s0[0] + Math.sin(a + i * 2) * 5 * k, s0[1] + f * 60 * k, k, a * 2 + i, dry ? '#B8A04A' : i % 2 ? '#4CAE3E' : '#7AC44E'); } }
      else { const s0 = P(1.9, 0.7, 114); leafS(g, s0[0] + Math.sin(a) * 7 * k + Math.cos(a * 2) * 2 * k, s0[1] + u * 70 * k, k, a + u * 3, dry ? '#B8A04A' : '#6AB84A'); } }, {fx: true, layer: 9});
  }; })();

/* ───────────── 🦖 RIDGE ② 🪺 NEST RINGS + 🥚 HATCHERY (3 × 2, `il1_hatchery`, the Ridge's heart · M4b "save the nests" + c10 Phuwi's Seed Walk) ─────────────
   A warm sand bed under a fern-thatched sala (Old Siamo guards it — CreatureKit stands him on it.stand2 · props never draw creatures), 3 woven NEST RINGS of twigs lined with ferns, each in
   a ring of sun-warm stones, and a little egg-stone post at the front-left (the hatchery's sign, no words).
   states e0 · e1 · e2 · e3 = how many 🥚 jewel eggs are home (LootKit drops them, the nests SHOW them) · hatched = cracked shells in every nest + a trail of tiny three-toe tracks leading
   out, little sprouts where the tracks go (baby Phuwi's seed walk starts here, c10). Live: e0 a feather drifts down · e1–e3 the eggs wobble in turn, a tiny heart pops from the wobbling one,
   the warm stones glow (fx) · hatched = a shell half rocks + a butterfly. it.stand = the front of the bed (where you set an egg down) · it.stand2 = Old Siamo's mat under the sala.
   🍂 dry = brown lining, pale sand · 🏚️ ruined = the sala fallen, 2 nests flattened, no eggs. Game: Props.setState(it, eggs >= 4 ? 'hatched' : 'e' + eggs, map). */
(function(){ const ST = ['e0', 'e1', 'e2', 'e3', 'hatched'], NEST = [[0.62, 1.3], [1.52, 1.5], [2.42, 1.26]];
  const def = add('isle1', 'il1_hatchery', {name: 'Nest rings + Hatchery', foot: [3, 2], h: 60, kind: 'building', block: true, variants: 2,
    states: ST, state: 'e0', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.5, 1.95, 0], stand2: [0.62, 0.44, 0], touchAt: [1.52, 1.5, 10], shadowA: 0.06, tags: ['ridge', 'raptor', 'nest', 'egg', 'hatchery', 'island1', 'camps'],
    diffs: [{by: 'state', a: 'e0', b: 'e3', level: 'bold', name: 'empty nests / 3 jewel eggs'}, {by: 'state', a: 'e3', b: 'hatched', level: 'bold', name: 'eggs / hatched shells + tracks'}, {by: 'state', a: 'e1', b: 'e2', level: 'small', name: 'one more egg'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), st = L.state || 'e0', hatched = st === 'hatched', n = hatched ? 3 : Math.max(0, ST.indexOf(st)), live = !still && !ruined;
    const SPOTC = v ? '#E8862E' : SPOT, LINE = dry || ruined ? '#B39A52' : v ? '#6AB84A' : '#4CAE3E';
    // the warm sand bed (raked lines) + the shade's mat
    B.custom(1.5, 1, (g, P, k) => { path(g, blob(P, 1.5, 1.0, 1.48, 0.98, 0, 30, 4 + v, 0.03)); g.fillStyle = ruined ? '#C8B488' : dry ? '#EADCB0' : '#EED39A'; g.fill();
      g.strokeStyle = 'rgba(160,120,60,0.25)'; g.lineWidth = 0.8 * k; for(let i = 0; i < 6; i++){ const y = 1.1 + i * 0.14; ln(g, P(0.15, y, 0), P(2.85, y + 0.02, 0)); }
      if(!ruined){ path(g, [P(0.24, 0.2, 0.5), P(1.02, 0.2, 0.5), P(1.02, 0.66, 0.5), P(0.24, 0.66, 0.5)]); g.fillStyle = v ? '#D8A86A' : '#C9A060'; g.fill(); g.strokeStyle = 'rgba(120,80,30,0.45)'; g.lineWidth = 0.7 * k;
        for(let i = 1; i < 6; i++){ ln(g, P(0.24 + i * 0.13, 0.2, 0.5), P(0.24 + i * 0.13, 0.66, 0.5)); ln(g, P(0.24, 0.2 + i * 0.077, 0.5), P(1.02, 0.2 + i * 0.077, 0.5)); } }
      if(hatched){ const R = D.rnd(9 + v); NEST.forEach(([x, y], i) => { for(let s = 0; s < 4; s++){ const q = P(x + (R() - 0.5) * 0.3 + (i - 1) * 0.08 * s, y + 0.25 + s * 0.14, 0); print3(g, q[0], q[1], k * 0.55, 0.2 * (i - 1), 0.42); } });
        [[0.8, 1.95], [1.55, 1.98], [2.3, 1.94]].forEach(([x, y]) => { const q = P(x, y, 0); g.strokeStyle = '#4CAE3E'; g.lineWidth = 1 * k; ln(g, q, [q[0], q[1] - 3 * k]); oval(g, q[0] - 1.6 * k, q[1] - 3.4 * k, 1.6 * k, 0.8 * k, -0.4, '#5DBE48'); oval(g, q[0] + 1.6 * k, q[1] - 3.8 * k, 1.6 * k, 0.8 * k, 0.4, '#7AC44E'); }); } }, {layer: -2});
    // the sala: 4 posts + a fern-thatch gable roof over the back (fallen when ruined)
    const SP = [[0.12, 0.1], [1.06, 0.1], [0.12, 0.72], [1.06, 0.72]]; SP.forEach(([x, y], i) => B.box(x, y, 0, 0.1, 0.1, ruined ? (i % 2 ? 12 : 20) : 34, v ? '#9A6A3E' : BARK, {trim: 0}));
    if(!ruined) B.roof(0.06, 0.04, 34, 1.16, 0.84, 16, dry ? '#C8AE62' : v ? '#5DBE48' : '#E3BE6A', {ridge: 'x', ov: 0.14, stripes: 6, gable: v ? '#3E9A36' : '#C9A050'});
    else B.custom(0.6, 0.45, (g, P, k) => { path(g, [P(0.1, 0.1, 2), P(1.1, 0.2, 12), P(1.15, 0.8, 5), P(0.15, 0.78, 1)]); g.fillStyle = '#B8A05A'; g.fill(); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.8 * k; g.stroke();
      g.strokeStyle = 'rgba(120,90,40,0.5)'; for(let i = 1; i < 6; i++){ ln(g, P(0.1 + i * 0.17, 0.12 + i * 0.016, 2 + i * 1.6), P(0.15 + i * 0.17, 0.79, 1 + i * 0.7)); } }, {layer: 1});
    // the back-right: a pile of sun-warm stones + a fern clump + the bone arch (two tusks) of the Hatchery
    [[1.75, 0.3, 7, 6], [2.05, 0.22, 6, 5], [1.92, 0.5, 5, 4]].forEach(([x, y, r, h], i) => B.bill(x, y, 0, (g, X, Y, k) => rock(g, X, Y, k, r, h, 40 + i * 3, ruined ? '#9A9488' : '#A8A092', null, ruined), {layer: 1}));
    B.bill(2.75, 0.24, 0, (g, X, Y, k, t) => fern(g, X, Y, k * 1.15, !still && !ruined ? ph(t, 2.4) : 0, v ? '#3E9A36' : '#4CAE3E', dry || ruined), {layer: 1});
    if(!ruined) B.custom(2.4, 0.3, (g, P, k) => { [[2.08, -1], [2.76, 1]].forEach(([x, s]) => { const a = P(x, 0.34, 0); g.fillStyle = BONE; g.beginPath(); g.moveTo(a[0] - 3 * k, a[1]); g.quadraticCurveTo(a[0] + s * 2 * k, a[1] - 28 * k, a[0] - s * 10 * k, a[1] - 40 * k);
        g.quadraticCurveTo(a[0] + s * 2 * k, a[1] - 24 * k, a[0] + 3 * k, a[1]); g.closePath(); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.7 * k; g.stroke(); [10, 20].forEach(z => { g.strokeStyle = AMB; g.lineWidth = 1.6 * k; ln(g, [a[0] - 2.6 * k + s * z * -0.05 * k, a[1] - z * k], [a[0] + 2.6 * k + s * z * -0.05 * k, a[1] - z * k]); }); });
      const m = P(2.42, 0.34, 0); eggS(g, m[0], m[1] - 41 * k, k, 0.62, 0, v ? '#E8862E' : SPOT, 0); }, {layer: 2});
    // 3 nest rings: woven twigs + a fern lining, a ring of sun-warm stones (flattened when ruined)
    NEST.forEach(([x, y], i) => B.custom(x, y, (g, P, k) => { const c = P(x, y, 0), flat = ruined && i !== 1, R = D.rnd(21 + i * 7 + v);
      for(let s = 0; s < 7; s++){ const an = s / 7 * TAU + i, q = [c[0] + Math.cos(an) * 15 * k, c[1] + Math.sin(an) * 7.6 * k]; oval(g, q[0], q[1] + 0.8 * k, 3 * k, 1.8 * k, 0, '#7E786C'); oval(g, q[0], q[1], 2.8 * k, 1.7 * k, 0, '#A8A092'); }
      g.save(); g.translate(c[0], c[1]); g.scale(1.3, 1.3); g.translate(-c[0], -c[1]); oval(g, c[0], c[1], 11 * k, 5.6 * k, 0, flat ? 'rgba(120,90,50,0.6)' : '#7A5230'); if(flat){ g.strokeStyle = '#8A6A3A'; g.lineWidth = 1 * k; for(let s = 0; s < 8; s++){ const a2 = R() * TAU; ln(g, [c[0] + Math.cos(a2) * 4 * k, c[1] + Math.sin(a2) * 2 * k], [c[0] + Math.cos(a2) * 13 * k, c[1] + Math.sin(a2) * 6 * k]); } g.restore(); return; }
      g.save(); g.beginPath(); g.ellipse(c[0], c[1] - 3 * k, 11 * k, 6 * k, 0, 0, TAU); g.ellipse(c[0], c[1] - 3 * k, 7.4 * k, 3.6 * k, 0, 0, TAU); g.fillStyle = v ? '#A8723E' : '#9A6A3A'; g.fill('evenodd'); g.restore();
      g.strokeStyle = 'rgba(70,44,20,0.7)'; g.lineWidth = 0.8 * k; for(let s = 0; s < 22; s++){ const an = s / 22 * TAU, r0 = 8 + R() * 2, r1 = r0 + 2.4; g.beginPath(); g.moveTo(c[0] + Math.cos(an) * r0 * k, c[1] - 3 * k + Math.sin(an) * r0 * 0.5 * k); g.lineTo(c[0] + Math.cos(an + 0.4) * r1 * k, c[1] - 3 * k + Math.sin(an + 0.4) * r1 * 0.5 * k); g.stroke(); }
      oval(g, c[0], c[1] - 2.4 * k, 7.2 * k, 3.4 * k, 0, LINE); g.strokeStyle = D.sh(LINE, -0.2); g.lineWidth = 0.7 * k; for(let s = 0; s < 6; s++){ const an = s / 6 * TAU; ln(g, [c[0], c[1] - 2.4 * k], [c[0] + Math.cos(an) * 6 * k, c[1] - 2.4 * k + Math.sin(an) * 2.8 * k]); } g.restore(); }, {layer: 1}));
    // the eggs (billboards, wobble in turn) · hatched = 2 cracked shell halves in each nest
    if(!ruined) NEST.forEach(([x, y], i) => { if(!hatched && i >= n) return; B.bill(x, y, 3, (g, X, Y, k, t) => { const u = live ? cyc(t, 2.4) : 0, me = live && !hatched && Math.floor(u * n) === i, f = me ? (u * n) % 1 : 0;
      if(hatched){ const rk = i === Math.floor(u * 3) ? Math.sin(f * TAU * 0 + (u * 3 % 1) * TAU) * 0.35 : 0.05; [[-3.4, -0.5, 1], [3, 0.4, -1]].forEach(([dx, rot, s], j) => { g.save(); g.translate(X + dx * 1.3 * k, Y - 1 * k); g.scale(1.3, 1.3); g.rotate(rot * 0.6 + (j ? rk : -rk * 0.6));
          g.fillStyle = EGGC; g.beginPath(); g.moveTo(-4 * k, 0); g.quadraticCurveTo(-4 * k, 4 * k, 0, 4.2 * k); g.quadraticCurveTo(4 * k, 4 * k, 4 * k, 0); for(let z = 0; z <= 6; z++) g.lineTo(4 * k - z * 8 / 6 * k, (z % 2 ? -2 : 0.4) * k); g.closePath(); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.35)'; g.lineWidth = 0.6 * k; g.stroke();
          dot(g, -1 * k, 2 * k, 0.9 * k, SPOTC); g.restore(); }); return; }
      eggS(g, X, Y, k, 1.35, me ? Math.sin(f * TAU) * 0.22 + Math.sin(f * TAU * 2) * 0.08 : 0, SPOTC, 0); }, {layer: 2}); });
    // the egg-stone post at the front-left (the hatchery's sign): a short bark post with a carved stone egg on top
    B.box(0.06, 1.78, 0, 0.12, 0.12, ruined ? 10 : 20, v ? '#9A6A3E' : BARK, {layer: 1});
    if(!ruined) B.bill(0.12, 1.84, 20, (g, X, Y, k) => { oval(g, X, Y - 6 * k, 4.6 * k, 6.4 * k, 0, '#B9B2A2'); oval(g, X - 1.4 * k, Y - 8 * k, 1.6 * k, 2.2 * k, -0.3, 'rgba(255,255,255,0.35)'); claw3(g, X, Y - 5 * k, 2 * k, 'rgba(70,60,50,0.55)'); }, {layer: 3});
    // fx: e0 a feather drifts · e1–e3 a tiny heart from the wobbling egg + the warm stones glow · hatched = a butterfly over the tracks
    if(ruined) return;
    B.custom(1.5, 1.4, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3;
      if(hatched){ const q = P(0.9 + u * 1.3, 1.7 - Math.sin(u * Math.PI) * 0.3, 14 + Math.sin(a * 2) * 4); butterfly(g, q[0], q[1], k, u * 4, v ? '#FF9A2E' : '#FFD23F'); return; }
      if(!n){ const q = P(1.2 + Math.sin(a) * 0.15, 1.2, 34 - u * 30); g.save(); g.translate(q[0] + Math.sin(a * 2) * 3 * k, q[1]); g.rotate(Math.sin(a) * 0.6); oval(g, 0, 0, 1.4 * k, 4 * k, 0.3, '#FFFFFF'); g.strokeStyle = '#C8BEA6'; g.lineWidth = 0.4 * k; ln(g, [0.6 * k, 3.6 * k], [-0.6 * k, -3.6 * k]); g.restore(); return; }
      for(let i = 0; i < n; i++){ const c = P(NEST[i][0], NEST[i][1], 0); D.glow(g, c[0], c[1] - 2 * k, 16 * k, '#FFB45A', 0.28 + 0.1 * Math.sin(a + i)); }
      const i = Math.floor(u * n), f = (u * n) % 1, c = P(NEST[i][0], NEST[i][1], 14 + f * 16); g.save(); g.globalAlpha = Math.sin(Math.PI * f); heartS(g, c[0] + 2 * k, c[1], 2.6 * k, '#FF7A9A'); g.restore(); }, {fx: true, layer: 9});
  }; })();

/* ───────────── 🦖 RIDGE ③ 🪨 TRAIL STONES (3 × 1, `il1_trailstones`, the Ridge bank path · c3 "Trail Stones": place 5 so feet stop trampling the banks) ─────────────
   A path along the bank: trampled mud full of three-toe footprints, squashed ferns on both edges, 5 dashed SOCKETS where the stones go. Each stone placed = a flat laterite step with the
   carved claw; the mud shrinks, fewer prints, the ferns stand up again — s5 = every stone in, the edges green + flowers. block false (it IS the path).
   states s0 … s5 (only up). Live: s0–s4 the next empty socket pulses (the 🌱 guide, fx) · s5 two butterflies flutter over the stones. it.stand = the middle socket.
   🍂 dry = cracked mud, brown ferns · 🏚️ ruined = weeds, cracked + tipped stones. Game: Props.setState(it, 's' + placed, map). */
(function(){ const ST = ['s0', 's1', 's2', 's3', 's4', 's5'], SOCK = [[0.34, 0.52], [0.92, 0.44], [1.5, 0.56], [2.08, 0.45], [2.66, 0.53]];
  const def = add('isle1', 'il1_trailstones', {name: 'Trail stones', foot: [3, 1], h: 22, kind: 'thing', block: false, variants: 2,
    states: ST, state: 's0', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.5, 0.56, 0], touchAt: [1.5, 0.5, 4], shadowA: 0, tags: ['ridge', 'raptor', 'path', 'build', 'island1', 'camps'],
    diffs: [{by: 'state', a: 's0', b: 's5', level: 'bold', name: 'trampled mud / 5 stones + green edges'}, {by: 'state', a: 's2', b: 's3', level: 'small', name: 'one more stone'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), n = Math.max(0, ST.indexOf(L.state || 's0')), live = !still && !ruined, STONE = v ? '#A8A092' : LATER;
    B.custom(1.5, 0.5, (g, P, k) => { const wd = 0.42 - n * 0.045; path(g, blob(P, 1.5, 0.5, 1.5, 0.48, 0, 30, 8 + v, 0.04)); g.fillStyle = ruined ? '#9AA06A' : dry ? '#B8B070' : '#86C45E'; g.fill(); path(g, blob(P, 1.5, 0.5, 1.46, wd, 0, 30, 3 + v, 0.05)); g.fillStyle = dry || ruined ? '#B08A5E' : n >= 4 ? '#C8A274' : '#9A6E44'; g.fill();
      if(n < 5){ const R = D.rnd(13 + v); for(let i = 0; i < (5 - n) * 3; i++){ const q = P(0.2 + R() * 2.6, 0.5 + (R() - 0.5) * wd * 1.4, 0); print3(g, q[0], q[1], k * 0.8, (R() - 0.5) * 1.2, 0.45); } }
      if(dry || ruined){ g.strokeStyle = 'rgba(80,56,30,0.5)'; g.lineWidth = 0.8 * k; for(let i = 0; i < 9; i++){ const a = P(0.2 + i * 0.32, 0.38, 0), b = P(0.32 + i * 0.32, 0.6, 0); ln(g, a, [(a[0] + b[0]) / 2 + 2 * k, (a[1] + b[1]) / 2]); ln(g, [(a[0] + b[0]) / 2 + 2 * k, (a[1] + b[1]) / 2], b); } }
      // the sockets: dashed rings where a stone still goes · placed = a flat stone with the carved claw
      SOCK.forEach(([x, y], i) => { const q = P(x, y, 0); if(i >= n){ g.save(); g.setLineDash([2.4 * k, 2 * k]); g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 1.1 * k; g.beginPath(); g.ellipse(q[0], q[1], 9 * k, 4.4 * k, 0, 0, TAU); g.stroke(); g.restore(); return; }
        const tilt = ruined && i % 2 ? 0.25 : 0; g.save(); g.translate(q[0], q[1]); g.rotate(tilt); oval(g, 0, 1.6 * k, 9.4 * k, 4.6 * k, 0, D.sh(STONE, -0.32)); oval(g, 0, 0, 9.2 * k, 4.4 * k, 0, STONE); oval(g, -2.6 * k, -1.2 * k, 3.6 * k, 1.4 * k, -0.2, 'rgba(255,255,255,0.28)');
        g.save(); g.scale(1, 0.5); claw3(g, 0.6 * k, 0.6 * k, 3.2 * k, 'rgba(60,40,24,0.45)'); g.restore(); if(ruined && i % 2 === 0){ g.strokeStyle = 'rgba(42,28,20,0.6)'; g.lineWidth = 0.8 * k; ln(g, [-6 * k, -1 * k], [1 * k, 1 * k]); ln(g, [1 * k, 1 * k], [5 * k, -2 * k]); } g.restore(); }); }, {layer: -2});
    // the fern edges: squashed flat while trampled (n ≤ 2), standing again from s3, flowers at s5
    [[0.22, 0.08], [1.2, 0.05], [2.25, 0.08], [0.7, 0.94], [1.8, 0.96], [2.82, 0.92]].forEach(([x, y], i) => B.bill(x, y, 0, (g, X, Y, k, t) => { const a = live ? ph(t, 2.4) : 0; if(n <= 2 && !ruined){ g.save(); g.translate(X, Y); g.scale(1.2, 0.42); fern(g, 0, 0, k, 0, '#5A8A3A', true); g.restore(); return; }
      fern(g, X, Y, k * (0.8 + 0.06 * n), a + i, v ? '#3E9A36' : '#4CAE3E', dry || ruined); if(n === 5 && !dry && !ruined){ [[-4, -9], [5, -11]].forEach(([dx, dy], j) => { for(let p = 0; p < 5; p++){ const an = p / 5 * TAU; oval(g, X + dx * k + Math.cos(an) * 1.6 * k, Y + dy * k + Math.sin(an) * 1.6 * k, 1.2 * k, 1.2 * k, 0, j ? '#FFFFFF' : '#FFB8D0'); } dot(g, X + dx * k, Y + dy * k, 0.9 * k, '#FFD84A'); }); } }, {layer: 1}));
    if(ruined) B.bill(1.2, 0.5, 0, (g, X, Y, k) => { g.strokeStyle = '#8A9A4A'; g.lineWidth = 1 * k; for(let s = 0; s < 7; s++){ const an = -Math.PI / 2 + (s - 3) * 0.3; ln(g, [X + (s - 3) * 1.2 * k, Y], [X + Math.cos(an) * 8 * k, Y + Math.sin(an) * 8 * k]); } }, {layer: 2});
    // fx: the 🌱 guide pulse on the next socket (s0–s4) · butterflies (s5)
    if(ruined) return;
    B.custom(1.5, 0.5, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3;
      if(n < 5){ const q = P(SOCK[n][0], SOCK[n][1], 0); for(let r = 0; r < 2; r++){ const f = (u + r / 2) % 1; g.strokeStyle = 'rgba(255,240,150,' + ((1 - f) * 0.9).toFixed(3) + ')'; g.lineWidth = 1.6 * k; g.beginPath(); g.ellipse(q[0], q[1], (8 + f * 9) * k, (4 + f * 4.5) * k, 0, 0, TAU); g.stroke(); }
        const tip = [q[0], q[1] - (12 + 3 * Math.sin(a) + 1.2 * Math.cos(a)) * k]; g.fillStyle = 'rgba(255,240,150,0.95)'; g.beginPath(); g.moveTo(tip[0], tip[1] + 5 * k); g.lineTo(tip[0] - 3 * k, tip[1]); g.lineTo(tip[0] + 3 * k, tip[1]); g.closePath(); g.fill(); return; }
      [[0, '#FFD23F'], [0.5, '#7AD0FF']].forEach(([o, col]) => { const f = (u + o) % 1, q = P(0.4 + f * 2.2, 0.5 + Math.sin(f * TAU + o * 3) * 0.3, 10 + Math.sin(a * 2 + o * 5) * 4 + Math.cos(a + o) * 2); butterfly(g, q[0], q[1], k, f * 5, col); }); }, {fx: true, layer: 9});
  }; })();

/* ───────────── 🦖 RIDGE ④ 🐟 FISHING STEPS (3 × 2, `il1_fishsteps`, the fern valley · the ⚖️ Valley Balance 🐟 FISH gauge, like the 💧 spring) ─────────────
   The back row = the bank: 3 laterite steps down to the water, a bamboo rack where the woven fish traps (ไซ) rest, and the 📊 meter you SEE = 5 wooden fish hanging on a rail —
   one turns bright orange per gauge dot. The front row = the stream (def.wet: may stand over the map's river; it draws its own water too).
   states f0 … f5 (only up): f0 murky, 3 traps + a tangled net sunk in the stream, no fish · each dot a trap comes OUT of the water onto the rack (the raptors' rest day) and the water
   clears · f2 a fish shadow · f3 two · f4 a little school glints · f5 a fish JUMPS. Live: f0 the net floats bob + a bubble · f1 a trap bobs · f2–f5 the fish. it.stand = the bottom step.
   🍂 dry = the stream drops to a muddy trickle · 🏚️ ruined = the rack collapsed, cracked steps, murky water. Game: Props.setState(it, 'f' + realm.balance.il1.f, map). */
(function(){ const ST = ['f0', 'f1', 'f2', 'f3', 'f4', 'f5'];
  const def = add('isle1', 'il1_fishsteps', {name: 'Fishing steps', foot: [3, 2], h: 46, kind: 'thing', block: true, wet: true, variants: 2,
    states: ST, state: 'f0', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [0.78, 1.28, 3], touchAt: [1.6, 1.5, 0], shadowA: 0.04, tags: ['ridge', 'raptor', 'fish', 'water', 'balance', 'island1', 'camps'],
    diffs: [{by: 'state', a: 'f0', b: 'f5', level: 'bold', name: 'traps in a murky stream / clear + a jumping fish'}, {by: 'state', a: 'f3', b: 'f4', level: 'small', name: 'one more fish token lit'}]});
  const WT = ['#7A8A4E', '#6E9460', '#5C9E7A', '#4AA69A', '#3EB2C8', '#46C2E6'], WB = ['#5E6C3A', '#566E46', '#46785E', '#367E7A', '#2C8AA8', '#3098C8'];
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), n = Math.max(0, ST.indexOf(L.state || 'f0')), live = !still && !ruined, inW = ruined ? 0 : [3, 2, 1, 0, 0, 0][n], wt = ruined ? '#6E7448' : dry ? '#8C8A52' : WT[n], wb = ruined ? '#545A36' : dry ? '#6E6C3E' : WB[n];
    // the bank (back row) + the stream (front row) with flow streaks · dry = a narrow trickle between mud flats
    B.custom(1.5, 1, (g, P, k, t) => { const bk = []; for(let i = 0; i <= 12; i++) bk.push(P(i / 4, 0.1 + 0.08 * Math.sin(i * 1.9 + v) + (i === 0 || i === 12 ? -0.1 : 0), 0)); path(g, bk.concat([P(3, 1.02, 0), P(0, 1.02, 0)])); g.fillStyle = ruined ? '#9AA06A' : dry ? '#B8B070' : '#7CC15A'; g.fill();
      const edge = []; for(let i = 0; i <= 12; i++) edge.push(P(i / 4, 0.98 + Math.sin(i * 1.3 + v) * 0.04, 0)); path(g, edge.concat([P(3, 2, 0), P(0, 2, 0)])); g.fillStyle = dry || ruined ? '#9A7A52' : '#8A6A44'; g.fill();
      const y0 = dry ? 1.45 : 1.08, y1 = dry ? 1.75 : 2; path(g, [P(0, y0, 0), P(3, y0, 0), P(3, y1, 0), P(0, y1, 0)]); g.fillStyle = D.lin(g, 0, P(1.5, y0, 0)[1], 0, P(1.5, y1, 0)[1], [wt, wb]); g.fill();
      const u = live ? cyc(t, 2.4) : 0.2; g.strokeStyle = 'rgba(255,255,255,' + (n >= 4 && !dry ? 0.55 : 0.3) + ')'; g.lineWidth = 1 * k; g.lineCap = 'round';
      for(let i = 0; i < 6; i++){ const x = ((i * 0.53 + u * 3 * 0.5) % 3), y = y0 + 0.15 + (i % 3) * (y1 - y0 - 0.3) / 2; ln(g, P(x, y, 0), P(Math.min(3, x + 0.3), y, 0)); }
      if(n >= 4 && !dry && !ruined){ const R = D.rnd(3 + v); for(let i = 0; i < 12; i++){ const q = P(R() * 3, y0 + 0.1 + R() * (y1 - y0 - 0.2), 0); oval(g, q[0], q[1], (1 + R()) * k, 0.6 * k, 0, 'rgba(232,214,170,0.45)'); } } }, {layer: -2});
    // 3 laterite steps down into the water (front-left)
    [[0.62, 12], [0.88, 7], [1.12, 3]].forEach(([y, h], i) => B.box(0.42, y, 0, 0.74, 0.27, h, v ? '#B9B2A2' : LATER, {trim: 0, topFill: i === 2 && !dry ? D.sh(v ? '#B9B2A2' : LATER, -0.1) : undefined}));
    // the bamboo rack (back-right) — traps out of the water rest on it · ruined = it collapsed
    if(!ruined){ [[1.62, 0.22], [2.72, 0.22]].forEach(([x, y]) => B.box(x, y, 0, 0.08, 0.08, 34, BAMBOO, {topFill: BAMBOO_D}));
      B.custom(2.2, 0.26, (g, P, k) => { g.strokeStyle = BAMBOO; g.lineWidth = 2.2 * k; g.lineCap = 'round'; ln(g, P(1.64, 0.26, 32), P(2.78, 0.26, 32)); ln(g, P(1.64, 0.26, 18), P(2.78, 0.26, 18));
        for(let i = 0; i < 3 - inW; i++){ const q = P(1.9 + i * 0.32, 0.26, 25); trapS(g, q[0], q[1] + 4 * k, k, 0.82, 1.45, v ? '#D8C07A' : '#E2C67A', false); } }, {layer: 1}); }
    else B.custom(2.2, 0.4, (g, P, k) => { g.strokeStyle = BAMBOO; g.lineWidth = 2.2 * k; ln(g, P(1.6, 0.3, 0), P(2.7, 0.55, 4)); ln(g, P(1.7, 0.2, 0), P(2.4, 0.7, 0)); const q = P(2.2, 0.5, 2); trapS(g, q[0], q[1], k, 0.8, 0.3, '#B8A05A', false); }, {layer: 1});
    // 📊 the fish tokens: a bamboo rail on 2 posts at the top of the steps, 5 wooden fish hanging — lit orange per gauge dot (no numbers)
    [[0.2, 0.2], [1.3, 0.2]].forEach(([x, y]) => B.box(x, y, 0, 0.07, 0.07, ruined ? 14 : 28, BAMBOO, {topFill: BAMBOO_D}));
    B.custom(0.78, 0.24, (g, P, k, t) => { if(ruined){ for(let i = 0; i < 3; i++){ const q = P(0.4 + i * 0.3, 0.45, 0); oval(g, q[0], q[1], 4 * k, 1.6 * k, 0.3, '#A89A80'); } return; } const a = live ? ph(t, 2.4) : 0; g.strokeStyle = BAMBOO; g.lineWidth = 2 * k; g.lineCap = 'round'; ln(g, P(0.22, 0.24, 27), P(1.34, 0.24, 27));
      for(let i = 0; i < 5; i++){ const top = P(0.38 + i * 0.22, 0.24, 27), on = i < n, sw = live ? Math.sin(a + i * 1.1) * 0.12 * (i === n - 1 ? 2 : 1) : 0; g.strokeStyle = '#6E4524'; g.lineWidth = 0.6 * k; ln(g, top, [top[0] + sw * 4 * k, top[1] + 4 * k]);
        g.save(); g.translate(top[0] + sw * 4 * k, top[1] + 9 * k); g.rotate(Math.PI / 2 + sw); const col = on ? (dry ? '#C8904A' : v ? '#3FB8A8' : '#FF8A2E') : '#C9B896'; oval(g, 0, 0, 4.6 * k, 2.2 * k, 0, col);
        g.fillStyle = col; g.beginPath(); g.moveTo(-4 * k, 0); g.lineTo(-7 * k, -2.2 * k); g.lineTo(-7 * k, 2.2 * k); g.closePath(); g.fill(); dot(g, 2.4 * k, -0.5 * k, 0.6 * k, '#2A1C14'); g.restore(); } }, {layer: 2});
    // traps + the net still IN the water (f0–f2) — bob with the flow
    if(!dry) B.custom(1.9, 1.5, (g, P, k, t) => { const a = live ? ph(t, 2.4) : 0;
      for(let i = 0; i < inW; i++){ const q = P(1.55 + i * 0.5, 1.45 + (i % 2) * 0.22, 0), b = Math.sin(a + i * 2) * 1.2 * k + Math.cos(a * 2 + i) * 0.4 * k; g.save(); g.beginPath(); g.rect(q[0] - 20 * k, q[1] - 20 * k, 40 * k, 20 * k + 1 * k); g.clip(); trapS(g, q[0], q[1] + 2 * k + b, k, 0.9, 0.25 + i * 0.2, '#B8A05A', true); g.restore();
        g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 0.8 * k; g.beginPath(); g.ellipse(q[0], q[1] + 1 * k, 8 * k, 2.2 * k, 0, 0, TAU); g.stroke(); dot(g, q[0] + 6 * k, q[1] - 1 * k + b, 1.4 * k, i % 2 ? '#FFFFFF' : '#E2502E'); }
      if(n === 0){ const q = P(2.6, 1.75, 0); g.strokeStyle = 'rgba(230,220,190,0.75)'; g.lineWidth = 0.6 * k; for(let i = -3; i <= 3; i++){ ln(g, [q[0] + i * 2.4 * k, q[1] - 4 * k + Math.sin(a + i) * 0.6 * k], [q[0] + i * 2.4 * k + 4 * k, q[1] + 3 * k]); ln(g, [q[0] - 8 * k, q[1] + i * 1.2 * k], [q[0] + 9 * k, q[1] + i * 1.2 * k + Math.cos(a + i) * 0.5 * k]); } } }, {layer: 3});
    // fx: f0 a bubble · f1 a trap bobs (above) + one ring · f2 / f3 fish shadows · f4 a school glints · f5 a fish jumps
    if(ruined || dry) return;
    B.custom(1.5, 1.5, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3;
      if(n <= 1){ const q = P(0.6 + n * 0.4, 1.6, 0), r = (1 + u * 3) * k; g.strokeStyle = 'rgba(220,230,180,' + (1 - u).toFixed(3) + ')'; g.lineWidth = 0.9 * k; g.beginPath(); g.ellipse(q[0], q[1], r * 2, r * 0.8, 0, 0, TAU); g.stroke(); dot(g, q[0], q[1] - u * 4 * k, 1.1 * k * (1 - u), 'rgba(220,240,200,0.9)'); return; }
      const fish = (x, y, an, s, al) => { const q = P(x, y, 0); g.save(); g.translate(q[0], q[1]); g.rotate(an); g.fillStyle = 'rgba(20,50,60,' + al + ')'; g.beginPath(); g.ellipse(0, 0, 6 * s * k, 2 * s * k, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-5 * s * k, 0); g.lineTo(-9 * s * k, -2.2 * s * k); g.lineTo(-9 * s * k, 2.2 * s * k); g.closePath(); g.fill(); g.restore(); };
      if(n === 2 || n === 3){ for(let i = 0; i < n - 1; i++){ const f = (u + i * 0.5) % 1; fish(0.4 + f * 2.2, 1.45 + i * 0.3 + Math.sin(a + i) * 0.05, 0.25 * Math.sin(a + i), 1, 0.4); } }
      if(n >= 4){ for(let i = 0; i < 5; i++){ const f = (u * (i % 2 ? 1 : 1.0) + i * 0.17) % 1, x = 0.5 + f * 2.0, y = 1.5 + Math.sin(i * 1.7) * 0.18; fish(x, y, 0.1, 0.55, 0.35); twinkle(g, P(x, y, 1)[0], P(x, y, 1)[1], (1 + 1.6 * Math.sin(Math.PI * f)) * k, 0.7 * Math.sin(Math.PI * f), '#FFFFFF'); } }
      if(n === 5){ const q0 = P(2.5, 1.65, 0), q1 = P(1.7, 1.3, 0), x = q0[0] + (q1[0] - q0[0]) * u, y = q0[1] + (q1[1] - q0[1]) * u - Math.sin(Math.PI * u) * 22 * k;
        if(u > 0.08 && u < 0.92){ g.save(); g.translate(x, y); g.rotate(-Math.cos(Math.PI * u) * 0.9 + Math.PI); g.fillStyle = v ? '#3FB8A8' : '#F2A23A'; g.beginPath(); g.ellipse(0, 0, 5 * k, 2.1 * k, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(4.4 * k, 0); g.lineTo(8 * k, -2.4 * k); g.lineTo(8 * k, 2.4 * k); g.closePath(); g.fill(); dot(g, -2.8 * k, -0.5 * k, 0.6 * k, '#2A1C14'); g.restore(); }
        [q0, q1].forEach((q, i) => { const s = i ? u : 1 - u; if(s < 0.25){ const e = s / 0.25; g.strokeStyle = 'rgba(255,255,255,' + (1 - e).toFixed(3) + ')'; g.lineWidth = 1.1 * k; g.beginPath(); g.ellipse(q[0], q[1], (3 + e * 8) * k, (1.4 + e * 3) * k, 0, 0, TAU); g.stroke(); } }); } }, {fx: true, layer: 9});
  }; })();

/* ───────────── 🦖 RIDGE ⑤ 🪢 VINE-SWING LANDING (2 × 2 gate, `il1_vineswing`, the south end of the 🦖 half, from Mango Grove · a REP gate) ─────────────
   A big strangler fig at the back-left with a long branch over a low log landing deck; a thick liana vine hangs from the branch — you swing in from Mango Grove and land on the deck.
   def.gate 'rep:ridge' + walkStates ['ready'] (like the ✨ firefly arch: Props.gates(map, 'rep:ridge') · Props.setGate(it, rep >= 0, map) → the ✨ moment). The prop draws its own cue:
   grey (😠 Upset — the scout "blocks" it): the vine is pulled back + tied to the trunk with a red cloth, two crossed sticks bar the deck, a red claw flag flutters · ready (😐 and up):
   the vine hangs free and SWINGS (a bamboo seat knot at its end), the sticks lean on the tree, a fern garland on the deck posts, the flag turns amber. Leaves drift down in both.
   it.stand = the deck front (where you land). 🍂 dry = brown canopy · 🏚️ ruined = the branch snapped (the vine lies on the deck), the deck broken. */
(function(){ const def = add('isle1', 'il1_vineswing', {noRubble: true, name: 'Vine-swing landing', foot: [2, 2], h: 120, kind: 'gate', block: true, gate: 'rep:ridge', walkStates: ['ready'], variants: 2,
    states: ['grey', 'ready'], state: 'grey', liveStates: ['grey', 'ready'], live: {period: 2.4, frames: 6}, stand: [0.6, 1.86, 9], touchAt: [0.66, 1.3, 60], shadowA: 0.1, tags: ['gate', 'rep', 'ridge', 'raptor', 'swing', 'island1', 'camps'],
    diffs: [{by: 'state', a: 'grey', b: 'ready', level: 'bold', name: 'vine tied back + sticks / vine swinging'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), on = (L.state || 'grey') === 'ready', live = !still && !ruined, leaf = dry || ruined ? ['#9A8A3A', '#B8A04A', '#C8AE62'] : v ? ['#2E7A3A', '#4E9E44', '#6AB84A'] : ['#2A6E3A', '#46943E', '#5DBE48'];
    B.custom(1, 1, (g, P, k) => { path(g, blob(P, 1, 1, 0.98, 0.98, 0, 22, 5 + v, 0.04)); g.fillStyle = dry || ruined ? '#A8A062' : '#6EB64E'; g.fill(); path(g, [P(0.35, 1.4, 0), P(0.95, 1.4, 0), P(1.05, 2, 0), P(0.25, 2, 0)]); g.fillStyle = '#C9A46E'; g.fill(); }, {layer: -2});
    // the low log deck (front-right) on 4 stubby stilts + 2 front posts
    [[0.12, 0.92], [1.08, 0.92], [0.12, 1.72], [1.08, 1.72]].forEach(([x, y]) => B.box(x, y, 0, 0.12, 0.12, 6, v ? '#9A6A3E' : BARK));
    B.box(0.1, 0.9, 6, 1.1, 0.94, 4, v ? '#D8A86A' : M.plank, {trim: 0, keep: !ruined});
    B.custom(0.65, 1.36, (g, P, k) => { g.strokeStyle = 'rgba(90,60,30,0.4)'; g.lineWidth = 0.8 * k; for(let i = 1; i < 6; i++) ln(g, P(0.1 + i * 0.183, 0.9, 10), P(0.1 + i * 0.183, 1.84, 10)); if(ruined){ path(g, [P(0.55, 1.2, 10), P(0.9, 1.2, 10), P(0.9, 1.6, 10), P(0.55, 1.6, 10)]); g.fillStyle = '#3A2A20'; g.fill(); } }, {layer: 1});
    [[0.16, 1.76], [1.04, 1.76]].forEach(([x, y]) => B.box(x, y, 10, 0.09, 0.09, ruined ? 6 : 20, v ? '#9A6A3E' : BARK, {layer: 1}));
    // the strangler fig (billboard): buttress roots, a thick trunk wrapped in roots, a heavy canopy
    B.bill(1.6, 0.4, 0, (g, X, Y, k, t) => { const a = live ? ph(t, 2.4) : 0; oval(g, X, Y, 22 * k, 9 * k, 0, 'rgba(42,28,20,0.22)');
      g.fillStyle = '#7A5636'; [[-16, 0, -6, -24], [14, 2, 5, -26], [-6, 5, -2, -20], [8, 6, 3, -18]].forEach(([x0, y0, x1, y1]) => { g.beginPath(); g.moveTo(X + x0 * k, Y + y0 * k); g.quadraticCurveTo(X + x1 * k * 2, Y + y0 * k, X + x1 * k, Y + y1 * k); g.lineTo(X, Y - 20 * k); g.closePath(); g.fill(); });
      const H = ruined ? 70 : 92; g.fillStyle = '#8A6440'; g.beginPath(); g.moveTo(X - 8 * k, Y); g.lineTo(X - 6 * k, Y - H * k); g.lineTo(X + 7 * k, Y - H * k); g.lineTo(X + 9 * k, Y); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(X - 6 * k, Y - H * k, 4 * k, H * k);
      g.strokeStyle = '#6A4A2C'; g.lineWidth = 1.6 * k; for(let i = 0; i < 5; i++){ g.beginPath(); g.moveTo(X - 7 * k, Y - (8 + i * 16) * k); g.quadraticCurveTo(X, Y - (14 + i * 16) * k, X + 8 * k, Y - (6 + i * 17) * k); g.stroke(); }
      if(ruined){ g.fillStyle = '#6A4A2C'; g.beginPath(); g.moveTo(X - 6 * k, Y - H * k); g.lineTo(X - 2 * k, Y - (H + 8) * k); g.lineTo(X + 2 * k, Y - (H - 2) * k); g.lineTo(X + 7 * k, Y - (H + 6) * k); g.lineTo(X + 7 * k, Y - H * k); g.closePath(); g.fill(); }
      const cl = ruined ? [[-12, -76, 14], [10, -80, 12]] : [[-20, -96, 20], [18, -100, 19], [0, -112, 22], [-8, -84, 16], [14, -86, 15], [30, -94, 13]]; cl.forEach(([dx, dy, r], i) => { const sw = Math.sin(a + i) * 0.8 * k; oval(g, X + dx * k + sw, Y + dy * k + 2 * k, r * k, r * 0.78 * k, 0, leaf[0]); oval(g, X + dx * k + sw - 2 * k, Y + dy * k - 1 * k, r * 0.82 * k, r * 0.66 * k, 0, leaf[1]); oval(g, X + dx * k + sw - 5 * k, Y + dy * k - 4 * k, r * 0.4 * k, r * 0.3 * k, 0, leaf[2]); }); }, {layer: 2});
    // the long branch over the deck (world space → turns) + the VINE: swings (ready) · tied back with a red cloth (grey) · lying on the deck (ruined)
    const A = [0.66, 1.22, 104];
    B.custom(0.9, 1.2, (g, P, k, t) => { const a = live ? ph(t, 2.4) : 0.3, t0 = P(1.56, 0.46, 88), an = P(A[0], A[1], A[2]);
      if(ruined){ g.strokeStyle = '#7A5636'; g.lineWidth = 5 * k; g.lineCap = 'round'; ln(g, P(0.2, 1.0, 10), P(1.0, 1.5, 12)); g.strokeStyle = '#4E8A3A'; g.lineWidth = 2.4 * k; g.beginPath(); const s = P(0.25, 1.2, 10); g.moveTo(s[0], s[1]); for(let i = 1; i <= 6; i++){ const q = P(0.25 + i * 0.13, 1.2 + Math.sin(i) * 0.12, 10); g.lineTo(q[0], q[1]); } g.stroke(); return; }
      g.strokeStyle = '#7A5636'; g.lineCap = 'round'; g.lineWidth = 6 * k; g.beginPath(); g.moveTo(t0[0], t0[1]); g.quadraticCurveTo((t0[0] + an[0]) / 2, Math.min(t0[1], an[1]) - 12 * k, an[0] - 10 * k, an[1] + 2 * k); g.stroke();
      [[0.3, -8], [0.55, -6], [0.8, -7]].forEach(([u, r], i) => { const q = [t0[0] + (an[0] - t0[0]) * u, t0[1] + (an[1] - t0[1]) * u - 9 * k]; oval(g, q[0], q[1], 9 * k, 6 * k, 0, leaf[i % 2]); oval(g, q[0] - 2 * k, q[1] - 2 * k, 5 * k, 3.4 * k, 0, leaf[2]); });
      const vine = (pts) => { g.strokeStyle = '#4E7A2E'; g.lineWidth = 2.6 * k; g.beginPath(); pts.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.stroke(); g.strokeStyle = '#6AA03A'; g.lineWidth = 1 * k; g.stroke();
        pts.forEach((q, i) => { if(i % 2) oval(g, q[0] + (i % 4 ? 2 : -2) * k, q[1], 2.4 * k, 1.2 * k, i % 4 ? 0.6 : -0.6, leaf[1]); }); };
      if(on){ const th = 0.42 * Math.sin(a) + 0.12 * Math.cos(a * 2), Ln = 72 * k, pts = []; for(let i = 0; i <= 10; i++){ const s = i / 10, bend = Math.sin(s * Math.PI) * 4 * k * Math.cos(a); pts.push([an[0] + Math.sin(th) * Ln * s + bend, an[1] + Math.cos(th) * Ln * s]); } vine(pts);
        const e = pts[10]; g.strokeStyle = '#6E4524'; g.lineWidth = 2.2 * k; dot(g, e[0], e[1], 2.6 * k, '#6A9A3A'); g.save(); g.translate(e[0], e[1] + 3 * k); g.rotate(th * 0.6); g.fillStyle = BAMBOO; g.fillRect(-7 * k, -1.2 * k, 14 * k, 2.4 * k); g.fillStyle = NODE; g.fillRect(-2 * k, -1.2 * k, 0.8 * k, 2.4 * k); g.restore(); }
      else { const tie = P(1.5, 0.56, 40), pts = []; for(let i = 0; i <= 10; i++){ const s = i / 10; pts.push([an[0] + (tie[0] - an[0]) * s + Math.sin(s * Math.PI) * 10 * k, an[1] + (tie[1] - an[1]) * s + Math.sin(s * Math.PI) * 14 * k]); } vine(pts);
        const fl = Math.sin(a) * 1.4 * k + Math.cos(a * 2) * 0.6 * k; g.fillStyle = '#E2353A'; g.beginPath(); g.ellipse(tie[0] - 2 * k, tie[1], 3.4 * k, 2 * k, 0.3, 0, TAU); g.ellipse(tie[0] + 3 * k, tie[1] + 0.4 * k, 3.2 * k, 1.8 * k, -0.3, 0, TAU); g.fill();
        g.beginPath(); g.moveTo(tie[0], tie[1]); g.lineTo(tie[0] + 3 * k + fl, tie[1] + 10 * k); g.lineTo(tie[0] + 6 * k + fl, tie[1] + 9 * k); g.closePath(); g.fill(); } }, {layer: 3});
    // the crossed sticks across the deck front (grey) · leaned on the tree (ready) + the fern garland
    B.custom(0.6, 1.82, (g, P, k, t) => { if(ruined) return; g.strokeStyle = '#8A5A34'; g.lineWidth = 2.2 * k; g.lineCap = 'round';
      if(!on){ ln(g, P(0.2, 1.8, 10), P(1.05, 1.8, 34)); ln(g, P(0.2, 1.8, 34), P(1.05, 1.8, 10)); return; } [[1.4, 0.7], [1.46, 0.64]].forEach(([x, y]) => ln(g, P(x, y, 0), P(x + 0.12, y - 0.1, 40)));
      const a = live ? ph(t, 2.4) : 0; for(let i = 0; i < 12; i++){ const u = i / 11, q = P(0.2 + u * 0.86, 1.8, 30 - Math.sin(u * Math.PI) * 8 + Math.sin(a + u * 3) * 0.6); oval(g, q[0], q[1], 2.4 * k, 1.3 * k, (i % 2 ? 0.6 : -0.6), i % 2 ? leaf[1] : leaf[2]); } }, {layer: 4});
    // the claw flag on the front-right post: red (grey) · amber (ready) — the rep cue, no words
    if(!ruined) B.custom(1.08, 1.8, (g, P, k, t) => { const a = live ? ph(t, 2.4) : 0.4, top = P(1.085, 1.805, 30), pt = [top[0], top[1] - 16 * k], fl = s => Math.sin(a * 2 + s) * 1.8 * k + Math.cos(a + s * 1.6) * 0.8 * k;
      g.strokeStyle = '#5A3418'; g.lineWidth = 1.3 * k; ln(g, top, pt); g.fillStyle = on ? (v ? '#3FB8A8' : AMB) : '#D8342E'; g.beginPath(); g.moveTo(pt[0], pt[1]); g.quadraticCurveTo(pt[0] + 8 * k, pt[1] + 1 * k + fl(0), pt[0] + 15 * k, pt[1] + 3 * k + fl(1)); g.lineTo(pt[0] + 13 * k, pt[1] + 10 * k + fl(2)); g.lineTo(pt[0], pt[1] + 10 * k); g.closePath(); g.fill();
      claw3(g, pt[0] + 6.5 * k, pt[1] + 5.4 * k + fl(1) * 0.5, 2.4 * k, BONE); if(!on){ g.strokeStyle = BONE; g.lineWidth = 1.1 * k; ln(g, [pt[0] + 2.6 * k, pt[1] + 1.6 * k], [pt[0] + 10.6 * k, pt[1] + 9 * k + fl(1) * 0.5]); } }, {layer: 5});
    // fx: leaves drift down from the canopy (both states)
    if(ruined) return;
    B.custom(0.8, 0.8, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3; for(let i = 0; i < 2; i++){ const f = (u + i * 0.5) % 1, s0 = P(0.8 + i * 0.6, 0.7 + i * 0.3, 110); leafS(g, s0[0] + Math.sin(a * 2 + i * 3) * 6 * k, s0[1] + f * 90 * k, k, a + f * 4 + i, leaf[1 + i % 2]); } }, {fx: true, layer: 9});
  }; })();

/* ───────────── 🦖 RIDGE ⑥ 🍲 SORRY STEW POT (2 × 1, `il1_sorrystew`, Mama Saura's fire · c4 "Sorry Stew": 1 thing from EACH camp → share it at the 🪵 log) ─────────────
   A big round clay pot on 3 hearth stones over a fire pit, Mama Saura's long wooden paddle leaning on it. Left: a stump with a fern-leaf mat (where the 🦖 gift goes) · right: a little
   iron stand (where the 🤖 gift goes).
   cold (default): lid on, grey ash, both gift spots empty · ✨ a dry leaf tumbles across the ash · half: the 🦖 gift is here (a leaf bundle tied with vine + 2 mushrooms), embers glow,
   one thin wisp · ✨ the embers breathe · cooking: the 🤖 gift too (a spice tin with a gear + a bolt), lid off, the stew bubbles, flames, steam — one puff in four is a little heart.
   it.stand = in front of the pot. 🍂 dry = no flame, pale ash · 🏚️ ruined = the pot cracked, the stones scattered, no gifts. Game: Props.setState(it, …) after each gift. */
(function(){ const ST = ['cold', 'half', 'cooking'];
  const def = add('isle1', 'il1_sorrystew', {name: 'Sorry Stew pot', foot: [2, 1], h: 50, kind: 'thing', block: true, variants: 2,
    states: ST, state: 'cold', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.0, 0.98, 0], touchAt: [1.0, 0.5, 26], shadowA: 0.05, tags: ['ridge', 'raptor', 'cook', 'peace', 'island1', 'camps'],
    diffs: [{by: 'state', a: 'cold', b: 'cooking', level: 'bold', name: 'cold pot / stew bubbling'}, {by: 'state', a: 'cold', b: 'half', level: 'small', name: 'one gift arrived'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), n = Math.max(0, ST.indexOf(L.state || 'cold')), live = !still && !ruined, POT = v ? '#8E5634' : '#C8603A';
    // packed earth + the fire pit ring + ash
    B.custom(1, 0.5, (g, P, k) => { path(g, blob(P, 1, 0.5, 0.98, 0.48, 0, 22, 6 + v, 0.04)); g.fillStyle = ruined ? '#A8946A' : '#C9A46E'; g.fill(); const c = P(1, 0.5, 0);
      oval(g, c[0], c[1], 15 * k, 7.4 * k, 0, ruined || dry || n === 0 ? '#8E8A82' : '#5A4A40'); g.strokeStyle = '#4A3A30'; g.lineWidth = 1.6 * k; for(let i = 0; i < 4; i++){ const an = i / 4 * Math.PI + 0.3; ln(g, [c[0] - Math.cos(an) * 9 * k, c[1] - Math.sin(an) * 3.4 * k], [c[0] + Math.cos(an) * 9 * k, c[1] + Math.sin(an) * 3.4 * k]); }
      for(let i = 0; i < 9; i++){ const an = i / 9 * TAU, q = [c[0] + Math.cos(an) * 17 * k, c[1] + Math.sin(an) * 8.4 * k]; if(ruined && i % 3 === 0) continue; oval(g, q[0], q[1] + 0.6 * k, 3.2 * k, 1.8 * k, 0, '#7E786C'); oval(g, q[0], q[1], 3 * k, 1.7 * k, 0, '#A8A092'); } }, {layer: -2});
    // the pot: a fat clay drum + a rim, on 3 hearth stones · lid (cold / half) · stew surface (cooking) · ruined = cracked, tipped on its side
    if(ruined) B.bill(1.0, 0.5, 0, (g, X, Y, k) => { g.save(); g.translate(X + 4 * k, Y - 6 * k); g.rotate(1.3); oval(g, 0, 0, 10 * k, 12 * k, 0, D.sh(POT, -0.2)); oval(g, 0, -9 * k, 8 * k, 3.4 * k, 0, '#3A2A20'); g.restore(); g.strokeStyle = 'rgba(42,28,20,0.6)'; g.lineWidth = 1 * k; ln(g, [X - 2 * k, Y - 14 * k], [X + 6 * k, Y - 4 * k]); }, {layer: 2});
    else { [[0.78, 0.36], [1.22, 0.36], [1.0, 0.68]].forEach(([x, y]) => B.bill(x, y, 0, (g, X, Y, k) => rock(g, X, Y, k, 4.4, 5, 3 + x * 7, '#8E928A', null, false), {layer: 1}));
      // the fire under the pot (normal layer, behind the belly): embers (half) · flames (cooking)
      if(n >= 1 && !dry) B.bill(1.0, 0.5, 0, (g, X, Y, k, t) => { const a = live ? ph(t, 2.4) : 0.4; for(let i = 0; i < 6; i++){ const an = i / 6 * TAU + 0.3; dot(g, X + Math.cos(an) * 9 * k, Y + Math.sin(an) * 3.6 * k, (1.2 + 0.5 * Math.sin(a + i)) * k, i % 2 ? '#FFB43A' : '#FF6A2A'); }
        if(n < 2) return; for(let i = 0; i < 6; i++){ const ff = 0.5 + 0.5 * Math.sin(a * 2 + i * 1.7) * Math.cos(a + i), x = X + (i - 2.5) * 5.2 * k, hh = (Math.abs(i - 2.5) > 2 ? 9 : 13) + ff * 6;
          g.fillStyle = i % 2 ? '#FFB43A' : '#FF6A2A'; g.beginPath(); g.moveTo(x - 2.8 * k, Y + 1 * k); g.quadraticCurveTo(x - 1.4 * k, Y - hh * 0.6 * k, x + Math.sin(a + i) * 1.6 * k, Y - hh * k); g.quadraticCurveTo(x + 1.6 * k, Y - hh * 0.4 * k, x + 2.8 * k, Y + 1 * k); g.closePath(); g.fill();
          g.fillStyle = '#FFE27A'; g.beginPath(); g.moveTo(x - 1.2 * k, Y + 1 * k); g.quadraticCurveTo(x, Y - hh * 0.4 * k, x + 1.2 * k, Y + 1 * k); g.closePath(); g.fill(); } }, {layer: 1});
      // the POT (billboard — round from every side): a fat clay belly, a dotted band, 2 handles, a rolled rim · lid (cold / half) · the stew (cooking)
      B.bill(1.0, 0.52, 4, (g, X, Y, k, t) => { const a = live ? ph(t, 2.4) : 0, W = 17 * k, H = 26 * k, cy = Y - H * 0.42, mY = Y - H * 0.84;
        [[-1], [1]].forEach(([s]) => { g.strokeStyle = sh(POT, -0.25); g.lineWidth = 2.2 * k; g.beginPath(); g.ellipse(X + s * W * 0.98, cy - 3 * k, 3.2 * k, 3.6 * k, 0, s > 0 ? -1.4 : Math.PI - 1.7, s > 0 ? 1.7 : Math.PI + 1.4); g.stroke(); });
        const gr = g.createLinearGradient(X - W, 0, X + W, 0); gr.addColorStop(0, sh(POT, 0.14)); gr.addColorStop(0.42, sh(POT, 0.04)); gr.addColorStop(1, sh(POT, -0.22)); g.fillStyle = gr; g.beginPath(); g.ellipse(X, cy, W, H * 0.44, 0, 0, TAU); g.fill();
        g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.8 * k; g.stroke(); g.fillStyle = 'rgba(255,255,255,0.22)'; g.beginPath(); g.ellipse(X - W * 0.45, cy - H * 0.14, W * 0.22, H * 0.16, -0.3, 0, TAU); g.fill();
        g.strokeStyle = sh(POT, 0.3); g.lineWidth = 1.2 * k; g.beginPath(); g.ellipse(X, cy - H * 0.08, W * 0.98, H * 0.16, 0, 0.15, Math.PI - 0.15); g.stroke(); for(let i = 0; i < 9; i++){ const an = 0.25 + i / 8 * (Math.PI - 0.5); dot(g, X + Math.cos(an) * W * 0.96, cy - H * 0.08 + Math.sin(an) * H * 0.16 + 2.6 * k, 0.9 * k, sh(POT, 0.35)); }
        g.fillStyle = sh(POT, -0.1); g.beginPath(); g.ellipse(X, mY + 3 * k, W * 0.66, H * 0.18, 0, 0, Math.PI); g.lineTo(X - W * 0.66, mY); g.ellipse(X, mY, W * 0.66, H * 0.14, 0, Math.PI, 0, true); g.closePath(); g.fill();
        oval(g, X, mY, W * 0.7, H * 0.15, 0, sh(POT, 0.28)); const ins = n === 2 ? (v ? '#C98A3A' : '#E0A23A') : '#4A3426'; oval(g, X, mY + 0.4 * k, W * 0.56, H * 0.11, 0, ins);
        if(n < 2){ oval(g, X, mY - 1.4 * k, W * 0.62, H * 0.14, 0, v ? '#B98A4A' : '#C9A060'); g.strokeStyle = 'rgba(120,80,30,0.5)'; g.lineWidth = 0.7 * k; for(let i = -3; i <= 3; i++){ const hh = Math.sqrt(1 - (i / 4) * (i / 4)) * H * 0.13; ln(g, [X + i * W * 0.15, mY - 1.4 * k - hh], [X + i * W * 0.15, mY - 1.4 * k + hh]); }
          oval(g, X, mY - 3 * k, 2.6 * k, 1.6 * k, 0, '#6E4524'); return; }
        const R = D.rnd(4); [[-6, -0.5, '#E8473A'], [4, 0.8, '#4FB848'], [-1, 1.2, '#FFD84A'], [6.5, -0.8, '#E8862E'], [-8.5, 0.6, '#FFFFFF']].forEach(([dx, dy, col]) => oval(g, X + dx * k, mY + 0.4 * k + dy * k, 2.2 * k, 1.1 * k, R(), col));
        for(let i = 0; i < 3; i++){ const f = (cyc(t, 2.4) + i / 3) % 1, q = [X + (i - 1) * 6 * k, mY + Math.sin(i * 2.4) * 1.2 * k]; g.strokeStyle = 'rgba(255,240,200,' + (0.9 * Math.sin(Math.PI * f)).toFixed(3) + ')'; g.lineWidth = 0.9 * k; g.beginPath(); g.ellipse(q[0], q[1] - f * 1.6 * k, (1 + f * 2.2) * k, (0.6 + f * 1) * k, 0, 0, TAU); g.stroke(); }
        g.strokeStyle = '#8A5A34'; g.lineWidth = 2.4 * k; g.lineCap = 'round'; ln(g, [X + 3 * k, mY], [X + 14 * k, mY - 20 * k]); oval(g, X + 2 * k, mY + 0.6 * k, 3 * k, 1.4 * k, 0.5, '#8A5A34'); }, {layer: 2}); }
    // Mama Saura's paddle leaning on the pot (front-left) — a raptor tooth on its handle end
    if(!ruined) B.custom(0.62, 0.72, (g, P, k) => { const b = P(0.64, 0.8, 0), tp = P(0.84, 0.56, 40); g.strokeStyle = '#A86A3A'; g.lineWidth = 2.2 * k; g.lineCap = 'round'; ln(g, b, tp); g.save(); g.translate(b[0], b[1] - 4 * k); g.rotate(Math.atan2(tp[1] - b[1], tp[0] - b[0]) + Math.PI / 2); oval(g, 0, 0, 3.2 * k, 6 * k, 0, '#C08A56'); g.restore();
      g.fillStyle = BONE; g.beginPath(); g.moveTo(tp[0] - 1.6 * k, tp[1]); g.lineTo(tp[0] + 1.6 * k, tp[1]); g.lineTo(tp[0] + 0.8 * k, tp[1] - 6 * k); g.closePath(); g.fill(); }, {layer: 4});
    // the 🦖 gift stump (left) + the 🤖 gift stand (right)
    B.drum(0.2, 0.5, 0, 0.13, 10, v ? '#A87A4A' : BARK, {layer: 1, topFill: '#D8B27A'}); B.custom(0.2, 0.5, (g, P, k) => { const c = P(0.2, 0.5, 10); oval(g, c[0], c[1], 6 * k, 3 * k, 0.2, dry ? '#A8A05A' : '#4CAE3E'); g.strokeStyle = 'rgba(30,80,30,0.5)'; g.lineWidth = 0.6 * k; ln(g, [c[0] - 6 * k, c[1]], [c[0] + 6 * k, c[1]]); }, {layer: 2});
    B.box(1.74, 0.42, 0, 0.16, 0.16, 12, M.iron, {layer: 1}); B.box(1.7, 0.38, 12, 0.24, 0.24, 2, DARKM, {layer: 1});
    if(n >= 1 && !ruined) B.bill(0.2, 0.5, 11, (g, X, Y, k0) => { const k = k0 * 1.35; oval(g, X, Y - 4 * k, 5.6 * k, 4.4 * k, 0, dry ? '#A8A05A' : '#5DBE48'); g.strokeStyle = '#3E7A2E'; g.lineWidth = 0.8 * k; g.beginPath(); g.ellipse(X, Y - 4 * k, 5.6 * k, 4.4 * k, 0, 0, TAU); g.stroke(); ln(g, [X - 5 * k, Y - 5 * k], [X + 5 * k, Y - 3 * k]);
      g.strokeStyle = '#8A6A2A'; g.lineWidth = 0.9 * k; ln(g, [X, Y - 8.4 * k], [X, Y + 0.4 * k]); [[7, -1, '#E8E0C8'], [-7, 0, '#D8342E']].forEach(([dx, dy, cap]) => { g.fillStyle = '#F4EAD2'; g.fillRect(X + dx * k - 0.8 * k, Y + dy * k - 3 * k, 1.6 * k, 3 * k); oval(g, X + dx * k, Y + dy * k - 3.4 * k, 2.6 * k, 1.6 * k, 0, cap); if(cap !== '#E8E0C8'){ dot(g, X + dx * k - 0.8 * k, Y + dy * k - 3.8 * k, 0.5 * k, '#FFFFFF'); } }); }, {layer: 3});
    if(n >= 2 && !ruined) B.bill(1.82, 0.5, 14, (g, X, Y, k0) => { const k = k0 * 1.3, w = 4 * k, h = 7 * k; g.fillStyle = '#B8C0CE'; g.fillRect(X - w, Y - h, w * 2, h); oval(g, X, Y - h, w, w * 0.45, 0, '#DDE3EE'); oval(g, X, Y, w, w * 0.45, 0, '#9AA2B4'); g.fillStyle = YEL; g.fillRect(X - w, Y - h * 0.68, w * 2, h * 0.4);
      gearS(g, X, Y - h * 0.48, 2 * k, 8, 0.2, DARKM, 1, YEL); g.save(); g.translate(X + 7 * k, Y - 1 * k); g.rotate(0.3); g.fillStyle = '#8E8A82'; g.fillRect(-0.8 * k, -4 * k, 1.6 * k, 4 * k); g.fillRect(-2 * k, -5 * k, 4 * k, 1.6 * k); g.restore(); }, {layer: 3});
    // fx: cold = a dry leaf tumbles across the ash · half = embers breathe + a thin wisp · cooking = flames + steam puffs (1 in 4 = a heart)
    if(ruined) return;
    B.custom(1.0, 0.5, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3, c = P(1.0, 0.5, 0), top = P(1.0, 0.52, 30);
      if(n === 0){ const q = P(0.3 + u * 1.4, 0.85 - Math.sin(u * Math.PI) * 0.1, Math.abs(Math.sin(u * Math.PI * 3)) * 5); leafS(g, q[0], q[1], k * 1.2, u * 9, '#C8903A'); return; }
      if(!dry) D.glow(g, c[0], c[1] - 4 * k, 20 * k, '#FF8A2E', (n === 1 ? 0.3 : 0.5) + 0.15 * Math.sin(a * 2) + 0.05 * Math.cos(a));
      if(n === 2 && !dry){ for(let i = 0; i < 4; i++){ const f = (u + i / 4) % 1, x = top[0] + Math.sin(f * 5 + i) * 6 * k, y = top[1] - f * 30 * k; if(i === 0){ g.save(); g.globalAlpha = Math.sin(Math.PI * f) * 0.9; heartS(g, x, y, 3 * k, '#FFC8D8'); g.restore(); } else puff(g, x, y, (2.4 + f * 3) * k, Math.sin(Math.PI * f) * 0.75); } return; }
      const f = u, x = top[0] + Math.sin(f * 6) * 3 * k, y = top[1] - 4 * k - f * 26 * k; g.strokeStyle = 'rgba(255,255,255,' + (0.6 * Math.sin(Math.PI * f)).toFixed(3) + ')'; g.lineWidth = 1.4 * k; g.beginPath(); g.moveTo(top[0], top[1] - 4 * k); g.quadraticCurveTo(top[0] + 6 * k, (top[1] + y) / 2, x, y); g.stroke(); }, {fx: true, layer: 9});
  }; })();

/* ───────────── 🤖 WORKS ⑦ ⚙️ WATER WHEEL + DYNAMO (2 × 2, `il1_waterwheel`, on the spring's outflow · Old Ohm's dynamo 🔬 card · 🌪️ Boss Clash ties) ─────────────
   A plank flume carries the creek across the front; a big wooden WATER WHEEL stands in it (8 paddles, iron hub), a belt runs from its axle to the DYNAMO shed at the back (a Bolt Works
   hull box with a copper coil drum on its side, a lamp on a pole).
   still (default): a branch is jammed in the paddles, the water piles up white against it, the lamp is dark · ✨ a leaf circles in the eddy · spins: the wheel turns, the belt runs,
   sparks at the coil (fx), the lamp is lit · wind (🌬️ after the 👹 sky wins the Clash, §6): a 3-blade wind rotor turns on the shed roof too + a wind sock streams.
   it.stand = the shed door · touchAt = the hub. 🍂 dry = an empty flume, the wheel still · 🏚️ ruined = 3 paddles gone, the belt snapped, the lamp broken.
   Game: Props.setState(it, 'spins' | 'wind', map). */
(function(){ const ST = ['still', 'spins', 'wind'];
  const def = add('isle1', 'il1_waterwheel', {name: 'Water wheel + dynamo', foot: [2, 2], h: 96, kind: 'building', block: true, door: [1.3, 1.0], variants: 2,
    states: ST, state: 'still', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.3, 1.08, 0], touchAt: [0.75, 1.55, 30], shadowA: 0.08, tags: ['works', 'bolt', 'water', 'power', 'dynamo', 'island1', 'camps'],
    diffs: [{by: 'state', a: 'still', b: 'spins', level: 'bold', name: 'wheel jammed + lamp dark / turning + lamp lit'}, {by: 'state', a: 'spins', b: 'wind', level: 'small', name: 'a wind rotor on the roof'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), st = L.state || 'still', on = st !== 'still' && !ruined, wind = st === 'wind', live = !still && !ruined, WOOD = v ? '#B9864E' : M.wood, SHED = v ? '#DDE3EE' : HULL;
    const S = 36, CX = 0.75, CY = 1.55, CZ = 30, RW = 28;
    // the ground + the plank flume (front row) with water running along x
    B.custom(1, 1, (g, P, k, t) => { path(g, blob(P, 1, 0.75, 0.98, 0.72, 0, 22, 9 + v, 0.04)); g.fillStyle = ruined ? '#A8946A' : '#B9A27A'; g.fill();
      path(g, [P(0, 1.3, 0), P(2, 1.3, 0), P(2, 1.82, 0), P(0, 1.82, 0)]); g.fillStyle = '#7A5636'; g.fill();
      if(!dry){ const u = live ? cyc(t, 2.4) : 0.3; path(g, [P(0, 1.36, 6), P(2, 1.36, 6), P(2, 1.76, 6), P(0, 1.76, 6)]); g.fillStyle = D.lin(g, 0, P(1, 1.36, 6)[1], 0, P(1, 1.76, 6)[1], ruined ? ['#6E7448', '#545A36'] : ['#5EC3EA', '#3E9EC8']); g.fill();
        g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 1 * k; g.lineCap = 'round'; const sp = on ? 1 : 0.35; for(let i = 0; i < 6; i++){ const x = ((i * 0.37 + u * 2 * sp * 0.5) % 2), y = 1.45 + (i % 3) * 0.12; if(!on && x > 0.55 && x < 0.95) continue; ln(g, P(x, y, 6), P(Math.min(2, x + 0.22), y, 6)); } } }, {layer: -2});
    [[1.26, 1.78]].forEach(([y0, y1]) => { B.box(0, 1.26, 0, 2, 0.08, 9, WOOD, {trim: 0}); B.box(0, 1.78, 0, 2, 0.08, 9, WOOD, {trim: 0, layer: 3}); });
    // the dynamo shed (back) + a copper coil drum + the lamp pole
    const shed = B.box(0.95, 0.2, 0, 0.85, 0.7, 34, SHED, {trim: 0}); B.door(shed, 'front', 1.18, 0.3, 26); B.decal(shed, 'front', 1.56, 0.16, 18, 8, YEL, {});
    B.box(0.9, 0.15, 34, 0.95, 0.8, 4, DARKM, {trim: 0}); B.drum(0.84, 0.55, 8, 0.12, 20, COPPER, {rings: 5, layer: 1});
    if(!ruined){ B.box(1.66, 0.28, 38, 0.06, 0.06, 22, DARKM, {layer: 2}); B.custom(1.69, 0.31, (g, P, k) => { const q = P(1.69, 0.31, 61); g.strokeStyle = DARKM; g.lineWidth = 1.4 * k; ln(g, P(1.69, 0.31, 58), [q[0] - 5 * k, q[1] - 1 * k]); bulbS(g, q[0] - 5 * k, q[1] + 3 * k, k * 1.4, on); }, {layer: 3}); }
    // 🌬️ wind: a 3-blade rotor on a mast on the shed roof + a wind sock
    if(wind && !ruined){ B.box(1.3, 0.5, 38, 0.06, 0.06, 26, DARKM, {layer: 2});
      B.custom(1.33, 0.53, (g, P, k, t) => { const hub = P(1.33, 0.53, 66), a = live ? cyc(t, 2.4) * TAU / 3 : 0.4; for(let i = 0; i < 3; i++){ const an = a + i / 3 * TAU; g.save(); g.translate(hub[0], hub[1]); g.rotate(an); g.fillStyle = i ? HULL : '#E2502E'; g.beginPath(); g.moveTo(0, -1.4 * k); g.quadraticCurveTo(10 * k, -3 * k, 17 * k, -0.6 * k); g.lineTo(17 * k, 0.6 * k); g.quadraticCurveTo(8 * k, 2 * k, 0, 1.4 * k); g.closePath(); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.6 * k; g.stroke(); g.restore(); } dot(g, hub[0], hub[1], 2.2 * k, YEL);
        const sk = P(0.98, 0.25, 50), fl = live ? Math.sin(ph(t, 2.4) * 2) * 1.6 * k + Math.cos(ph(t, 2.4)) * 0.8 * k : 0; g.strokeStyle = DARKM; g.lineWidth = 1 * k; ln(g, P(0.98, 0.25, 38), sk); g.fillStyle = ORG; g.beginPath(); g.moveTo(sk[0], sk[1] - 1 * k); g.lineTo(sk[0] + 12 * k, sk[1] + 1 * k + fl); g.lineTo(sk[0] + 12 * k, sk[1] + 3 * k + fl); g.lineTo(sk[0], sk[1] + 4 * k); g.closePath(); g.fill(); g.fillStyle = '#FFFFFF'; g.fillRect(sk[0] + 4 * k, sk[1] - 0.2 * k + fl * 0.4, 2.4 * k, 4 * k); }, {layer: 4}); }
    // the axle posts + the WHEEL (world space: its plane = x–z at y = CY, so it turns with the prop) · the belt to the dynamo
    [[CY - 0.24], [CY + 0.24]].forEach(([y]) => B.box(CX - 0.05, y - 0.04, 0, 0.1, 0.08, CZ + 2, DARKM, {layer: y > CY ? 4 : 1}));
    B.custom(CX, CY, (g, P, k, t) => { const rot = on ? (live ? cyc(t, 2.4) * TAU / 8 : 0.2) : 0.12, W = (a, r, dy) => P(CX + Math.cos(a) * r / S, CY + dy, CZ + Math.sin(a) * r);
      const ring = (dy, col, wdt) => { g.strokeStyle = col; g.lineWidth = wdt * k; g.beginPath(); for(let i = 0; i <= 32; i++){ const q = W(i / 32 * TAU, RW, dy); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } g.stroke(); };
      ring(-0.14, D.sh(WOOD, -0.25), 2.6); for(let i = 0; i < 8; i++){ if(ruined && (i === 2 || i === 3 || i === 6)) continue; const a = rot + i / 8 * TAU, p0 = W(a, RW - 2, -0.14), p1 = W(a, RW - 2, 0.14), p2 = W(a, RW + 5, 0.14), p3 = W(a, RW + 5, -0.14);
        path(g, [p0, p1, p2, p3]); g.fillStyle = Math.sin(a) > 0 ? D.sh(WOOD, 0.1) : D.sh(WOOD, -0.12); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.35)'; g.lineWidth = 0.7 * k; g.stroke(); }
      for(let i = 0; i < 8; i++){ const a = rot + i / 8 * TAU + Math.PI / 8; g.strokeStyle = D.sh(WOOD, -0.18); g.lineWidth = 1.8 * k; ln(g, W(a, 4, 0.1), W(a, RW - 1, 0.1)); }
      ring(0.14, WOOD, 3); const hub = W(0, 0, 0.16); dot(g, hub[0], hub[1], 4.4 * k, DARKM); dot(g, hub[0], hub[1], 1.8 * k, YEL);
      if(!ruined){ const pul = P(0.84, 0.55, 22); g.strokeStyle = '#3A3A44'; g.lineWidth = 1.4 * k; ln(g, [hub[0], hub[1] - 4 * k], [pul[0], pul[1] - 3 * k]); ln(g, [hub[0], hub[1] + 4 * k], [pul[0], pul[1] + 3 * k]);
        if(on && live){ const u = cyc(t, 2.4); for(let i = 0; i < 3; i++){ const f = (u + i / 3) % 1; dot(g, hub[0] + (pul[0] - hub[0]) * f, hub[1] - 4 * k + (pul[1] - hub[1] + 1 * k) * f, 0.9 * k, YEL); } } }
      else { const pul = P(0.84, 0.55, 22); g.strokeStyle = '#3A3A44'; g.lineWidth = 1.4 * k; ln(g, [pul[0], pul[1] + 3 * k], [pul[0] + 4 * k, pul[1] + 16 * k]); }
      // still: the jammed branch across the paddles + the white water piled against it + a circling leaf
      if(!on && !ruined){ const a0 = W(rot + 0.2, RW + 9, 0.3), a1 = W(rot + Math.PI * 0.55, RW - 4, -0.3); g.strokeStyle = '#6E4A2C'; g.lineWidth = 2.6 * k; g.lineCap = 'round'; ln(g, P(CX + 0.75, CY - 0.1, 7), a1);
        [[0.3, -4], [0.55, 3], [0.75, -3]].forEach(([u, d], i) => { const q = P(CX + 0.75 - u * 0.5, CY - 0.1, 7 + u * 20); oval(g, q[0] + d * k, q[1], 3 * k, 1.4 * k, 0.4 * (i - 1), '#5DBE48'); });
        if(!dry){ const fo = P(CX + 0.62, CY, 7); for(let i = 0; i < 5; i++) dot(g, fo[0] + (i - 2) * 3 * k, fo[1] + Math.abs(i - 2) * 0.8 * k, (2 - Math.abs(i - 2) * 0.4) * k, 'rgba(255,255,255,0.85)');
          const a = live ? ph(t, 2.4) : 0.4, lq = P(CX + 0.5 + Math.cos(a) * 0.12, CY + Math.sin(a) * 0.1, 7); leafS(g, lq[0], lq[1], k, a, '#E8A23A'); } }
      if(on && !dry){ const sp = W(-Math.PI / 2 + 0.2, RW + 4, 0); for(let i = 0; i < 4; i++){ const u = live ? (cyc(t, 2.4) * 2 + i / 4) % 1 : i / 4; dot(g, sp[0] + 6 * k + u * 8 * k, sp[1] - 2 * k + u * u * 10 * k - Math.sin(u * Math.PI) * 6 * k, 1.1 * k, 'rgba(255,255,255,0.85)'); } } }, {layer: 3});
    // fx: sparks at the coil + the lamp glow (spins / wind)
    if(!on) return;
    B.custom(0.84, 0.55, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3, c = P(0.84, 0.55, 18), lp = P(1.69, 0.31, 61);
      D.glow(g, lp[0] - 5 * k, lp[1] + 3 * k, 12 * k, '#FFE27A', 0.55 + 0.15 * Math.sin(a * 2)); D.glow(g, c[0], c[1], 10 * k, CYAN, 0.25 + 0.15 * Math.sin(a * 3) * Math.cos(a));
      for(let i = 0; i < 2; i++){ const f = (u * 2 + i * 0.5) % 1, an = i * 2.4 + a; g.strokeStyle = 'rgba(160,240,255,' + (1 - f).toFixed(3) + ')'; g.lineWidth = 1 * k; g.beginPath(); g.moveTo(c[0], c[1]); g.lineTo(c[0] + Math.cos(an) * 4 * k, c[1] + Math.sin(an) * 3 * k - 2 * k); g.lineTo(c[0] + Math.cos(an + 0.5) * 8 * k * (0.5 + f), c[1] + Math.sin(an + 0.5) * 5 * k - 4 * k * f); g.stroke(); } }, {fx: true, layer: 9});
  }; })();

/* ───────────── 🤖 WORKS ⑧ 🌬️ BREEZE TOWER + STORM-SHIELD PYLON (2 × 2, `il1_breezetower`, the 🤖 east half) ─────────────
   A tapering iron lattice tower with a nacelle + a 3-blade rotor on top, a little control box with a lever at its foot, and beside it the STORM-SHIELD PYLON: a tall pole with 4 copper rings
   and a ball on top. off (default): the rotor stands still, a little bird sits on the nacelle and bobs · spin: the rotor turns, the nacelle light blinks · shield: it spins AND the pylon's
   rings glow, an arc crackles up to the ball and a soft shield dome shimmers over the foot (fx — the storm comes, the camp is safe).
   it.stand = the lever · touchAt = the ball. 🍂 dry = dusty, still · 🏚️ ruined = a blade broken off, braces missing, the pylon snapped. */
(function(){ const ST = ['off', 'spin', 'shield'];
  const def = add('isle1', 'il1_breezetower', {name: 'Breeze tower + storm pylon', foot: [2, 2], h: 140, kind: 'landmark', block: true, variants: 2, noRubble: true,
    states: ST, state: 'off', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [0.6, 1.86, 0], touchAt: [1.74, 0.36, 104], shadowA: 0.1, tags: ['works', 'bolt', 'wind', 'power', 'storm', 'island1', 'camps'],
    diffs: [{by: 'state', a: 'off', b: 'spin', level: 'bold', name: 'rotor still + a bird / spinning'}, {by: 'state', a: 'spin', b: 'shield', level: 'bold', name: 'the storm shield is up'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), st = L.state || 'off', on = st !== 'off' && !ruined, shield = st === 'shield' && !ruined, live = !still && !ruined, IRON = v ? '#C8503A' : METAL, IRON2 = v ? '#F4EFE4' : DARKM;
    B.box(0.12, 0.12, 0, 1.4, 1.4, 3, '#B8B4A8', {trim: 0, layer: -1}); B.custom(1, 1, (g, P, k) => { path(g, blob(P, 1, 1, 0.98, 0.98, 0, 22, 12 + v, 0.03)); g.fillStyle = ruined ? '#A8946A' : dry ? '#C8B488' : '#B9A27A'; g.fill(); }, {layer: -2});
    // the lattice: 4 legs from the pad corners up to a small top square, cross braces between · each side its own depth (turns right)
    const BOT = [[0.22, 0.22], [1.42, 0.22], [1.42, 1.42], [0.22, 1.42]], TOP = [[0.66, 0.66], [0.98, 0.66], [0.98, 0.98], [0.66, 0.98]], ZT = 108;
    const side = (i, layer) => B.custom((BOT[i][0] + BOT[(i + 1) % 4][0]) / 2, (BOT[i][1] + BOT[(i + 1) % 4][1]) / 2, (g, P, k) => { const a = BOT[i], b = BOT[(i + 1) % 4], ta = TOP[i], tb = TOP[(i + 1) % 4], L2 = (p, q, f) => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f];
      const at = (f, z) => { const p = L2(a, ta, z / ZT), q = L2(b, tb, z / ZT); return [p, q]; }; g.strokeStyle = IRON; g.lineCap = 'round'; g.lineWidth = 1.4 * k; const lv = [6, 34, 60, 84, 104];
      for(let j = 0; j < lv.length - 1; j++){ if(ruined && i === 2 && j >= 2) continue; const [p0, q0] = at(0, lv[j]), [p1, q1] = at(0, lv[j + 1]); const A0 = L2(a, ta, lv[j] / ZT), B0 = L2(b, tb, lv[j] / ZT), A1 = L2(a, ta, lv[j + 1] / ZT), B1 = L2(b, tb, lv[j + 1] / ZT);
        ln(g, P(A0[0], A0[1], lv[j]), P(B1[0], B1[1], lv[j + 1])); ln(g, P(B0[0], B0[1], lv[j]), P(A1[0], A1[1], lv[j + 1])); ln(g, P(A1[0], A1[1], lv[j + 1]), P(B1[0], B1[1], lv[j + 1])); } }, {layer});
    side(0, 0); side(3, 0); const leg = (i, layer) => B.custom(BOT[i][0], BOT[i][1], (g, P, k) => { const a = P(BOT[i][0], BOT[i][1], 3), b = P(TOP[i][0], TOP[i][1], ZT); g.strokeStyle = D.sh(IRON, -0.15); g.lineWidth = 3 * k; g.lineCap = 'round'; ln(g, a, b); g.strokeStyle = D.sh(IRON, 0.15); g.lineWidth = 1.2 * k; ln(g, [a[0] - 0.8 * k, a[1]], [b[0] - 0.8 * k, b[1]]); }, {layer});
    leg(0, 1); leg(1, 1); leg(3, 1); side(1, 2); side(2, 2); leg(2, 3);
    // the nacelle box on top + a little ladder cage + the blinking light
    B.box(0.62, 0.62, ZT, 0.4, 0.44, 12, HULL, {trim: 0, layer: 4}); B.box(0.58, 0.58, ZT - 2, 0.48, 0.52, 2, IRON2, {layer: 4});
    // the ROTOR: a billboard hub on the nacelle's front, 3 blades (one broken when ruined)
    B.bill(0.82, 1.06, ZT + 6, (g, X, Y, k, t) => { const a = on ? (live ? cyc(t, 2.4) * TAU / 3 : 0.4) : 0.35; for(let i = 0; i < 3; i++){ if(ruined && i === 1) continue; const an = a + i / 3 * TAU - Math.PI / 2, Lb = ruined && i === 2 ? 16 : 30; g.save(); g.translate(X, Y); g.rotate(an);
        g.fillStyle = i === 0 ? (v ? '#E2502E' : YEL) : HULL; g.beginPath(); g.moveTo(0, -1.8 * k); g.quadraticCurveTo(Lb * 0.55 * k, -4.6 * k, Lb * k, -0.8 * k); g.lineTo(Lb * k, 0.8 * k); g.quadraticCurveTo(Lb * 0.5 * k, 3 * k, 0, 1.8 * k); g.closePath(); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.35)'; g.lineWidth = 0.7 * k; g.stroke(); g.restore(); }
      dot(g, X, Y, 3.6 * k, IRON2); dot(g, X - 1 * k, Y - 1 * k, 1.2 * k, 'rgba(255,255,255,0.6)'); }, {layer: 5});
    // the control box + lever at the foot (front-left)
    const cb = B.box(0.36, 1.6, 0, 0.3, 0.22, 16, YEL, {layer: 2, trim: 0}); B.decal(cb, 'front', 0.4, 0.16, 7, 6, BLK, {});
    B.custom(0.5, 1.7, (g, P, k) => { const b = P(0.6, 1.7, 16), tp = on ? P(0.66, 1.78, 26) : P(0.52, 1.74, 26); g.strokeStyle = DARKM; g.lineWidth = 1.6 * k; ln(g, b, tp); dot(g, tp[0], tp[1], 2.2 * k, on ? '#4FB848' : '#E2353A'); }, {layer: 3});
    // the STORM-SHIELD PYLON (front-right): a pole + 4 copper rings + a ball · ruined = snapped half-way
    B.drum(1.74, 0.36, 0, 0.07, ruined ? 46 : 96, DARKM, {layer: 2}); if(!ruined){ [30, 48, 66, 84].forEach(z => B.drum(1.74, 0.36, z, 0.13, 5, COPPER, {layer: 3})); B.bill(1.74, 0.36, 100, (g, X, Y, k) => { const gr = g.createRadialGradient(X - 2 * k, Y - 3 * k, 1 * k, X, Y, 7 * k); gr.addColorStop(0, '#FFE6C8'); gr.addColorStop(1, shield ? '#7AE8FF' : COPPER); g.fillStyle = gr; g.beginPath(); g.arc(X, Y - 1 * k, 6.4 * k, 0, TAU); g.fill(); }, {layer: 4}); }
    else B.bill(1.74, 0.36, 46, (g, X, Y, k) => { g.fillStyle = DARKM; g.beginPath(); g.moveTo(X - 3 * k, Y); g.lineTo(X - 1 * k, Y - 6 * k); g.lineTo(X + 1 * k, Y - 2 * k); g.lineTo(X + 3 * k, Y - 7 * k); g.lineTo(X + 3 * k, Y); g.closePath(); g.fill(); }, {layer: 4});
    // off: the little bird on the nacelle (bobs) · ruined: the broken blade lies at the foot
    if(st === 'off' && !ruined) B.custom(0.8, 0.7, (g, P, k, t) => { const a = live ? ph(t, 2.4) : 0, q = P(0.7, 0.66, ZT + 12 + (0.5 + 0.5 * Math.sin(a)) * 1.5), f = Math.cos(a) > 0.3 ? -1 : 1; g.save(); g.translate(q[0], q[1]); g.scale(f * k, k);
      g.fillStyle = '#3A6EA8'; g.beginPath(); g.ellipse(0, -3, 3.2, 2.5, -0.2, 0, TAU); g.fill(); g.beginPath(); g.arc(2.4, -5.6 + Math.cos(a) * 0.6, 2, 0, TAU); g.fill(); g.fillStyle = '#F2C230'; g.beginPath(); g.moveTo(4.2, -5.8); g.lineTo(6.2, -5.4); g.lineTo(4.2, -5); g.fill(); dot(g, 2.8, -6.2, 0.6, '#FFFFFF'); g.restore(); }, {layer: 6});
    if(ruined) B.bill(1.0, 1.7, 0, (g, X, Y, k) => { g.save(); g.translate(X, Y - 2 * k); g.rotate(0.25); g.fillStyle = '#C8C8C0'; g.beginPath(); g.moveTo(-14 * k, -1.4 * k); g.quadraticCurveTo(0, -4 * k, 14 * k, -0.6 * k); g.lineTo(14 * k, 0.8 * k); g.lineTo(-14 * k, 1.6 * k); g.closePath(); g.fill(); g.restore(); }, {layer: 2});
    // fx: the nacelle light blinks (spin + shield) · shield = the rings glow + an arc up to the ball + a soft dome over the foot
    if(!on) return;
    B.custom(1, 1, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3, nl = P(0.82, 0.64, ZT + 14); D.glow(g, nl[0], nl[1], 7 * k, '#FF5A4A', 0.35 + 0.55 * Math.max(0, Math.sin(a * 2)));
      if(!shield) return; [30, 48, 66, 84].forEach((z, i) => { const c = P(1.74, 0.36, z + 2); D.glow(g, c[0], c[1], 9 * k, CYAN, 0.25 + 0.2 * Math.sin(a * 2 + i)); });
      const top = P(1.74, 0.36, 100), bot = P(1.74, 0.36, 30); g.strokeStyle = 'rgba(200,250,255,0.9)'; g.lineWidth = 1.2 * k; g.beginPath(); g.moveTo(bot[0], bot[1]); for(let i = 1; i <= 6; i++){ const f = i / 6, jx = Math.sin(a * 3 + i * 2.1) * 4 * k * (i < 6 ? 1 : 0); g.lineTo(bot[0] + jx, bot[1] + (top[1] - bot[1]) * f); } g.stroke();
      const c = P(1, 1, 0); g.save(); g.globalAlpha = 0.22 + 0.08 * Math.sin(a); g.strokeStyle = '#9AF0FF'; g.lineWidth = 2 * k; g.beginPath(); g.ellipse(c[0], c[1] - 8 * k, 58 * k, 70 * k, 0, Math.PI, TAU); g.stroke(); g.globalAlpha = 0.08; g.fillStyle = '#9AF0FF'; g.beginPath(); g.ellipse(c[0], c[1] - 8 * k, 58 * k, 70 * k, 0, Math.PI, TAU); g.fill(); g.restore();
      for(let i = 0; i < 4; i++){ const f = (u + i / 4) % 1, an = Math.PI + f * Math.PI; twinkle(g, c[0] + Math.cos(an) * 58 * k, c[1] - 8 * k + Math.sin(an) * 70 * k, (1 + 2 * Math.sin(Math.PI * f)) * k, 0.8 * Math.sin(Math.PI * f), '#E6FBFF'); } }, {fx: true, layer: 9});
  }; })();

/* ───────────── 🤖 WORKS ⑨ ♻️ SCRAP YARD → RECYCLING YARD (3 × 2, `il1_scrapyard`, the ⚖️ Valley Balance 🗑️ WASTE gauge, like the 💧 spring · fewer waste = more dots) ─────────────
   x0: three messy scrap piles (gears · bent pipes · cans · a tyre · a broken robot arm), an oil puddle, flies circling. Each gauge dot = one pile less AND one sorted RECYCLING BIN more along
   the back (5 bins, each its own colour + a drawn icon: paper · bottle · jar · gear · leaf — no words) — the bins ARE the meter you see. x5: swept ground, 5 bins in a row, a little flower bed,
   the round ♻️ arrows sign (drawn). Live: x0 flies + the oil sheen swirls · x1–x4 the newest bin's lid flips open + shut, a can rolls · x5 the lids glint + a butterfly.
   it.stand = the front of the yard. 🍂 dry = dusty · 🏚️ ruined = bins tipped over, rust. Game: Props.setState(it, 'x' + realm.balance.il1.x, map). */
(function(){ const ST = ['x0', 'x1', 'x2', 'x3', 'x4', 'x5'], BIN = [['#3E8EF0', 'paper'], ['#FFD23F', 'bottle'], ['#4FB848', 'jar'], ['#9AA2B4', 'gear'], ['#A86A3A', 'leaf']];
  const def = add('isle1', 'il1_scrapyard', {name: 'Scrap yard → recycling', foot: [3, 2], h: 46, kind: 'thing', block: true, variants: 2,
    states: ST, state: 'x0', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.5, 1.95, 0], touchAt: [1.5, 1.1, 14], shadowA: 0.04, tags: ['works', 'bolt', 'waste', 'recycle', 'balance', 'island1', 'camps'],
    diffs: [{by: 'state', a: 'x0', b: 'x5', level: 'bold', name: 'scrap piles / 5 recycling bins'}, {by: 'state', a: 'x2', b: 'x3', level: 'small', name: 'one more bin, one pile less'}]});
  // a recycling bin (billboard): a rounded box, a hinged lid, a drawn icon on its face
  const bin = (g, X, Y, k, col, icon, lid, tip) => { g.save(); g.translate(X, Y); if(tip) g.rotate(tip); const w = 6.4 * k, h = 13 * k; oval(g, 0, 0, w * 1.2, 2.4 * k, 0, 'rgba(42,28,20,0.22)');
    g.fillStyle = D.sh(col, -0.18); g.beginPath(); g.roundRect(-w, -h, w * 2, h, 1.6 * k); g.fill(); g.fillStyle = col; g.beginPath(); g.roundRect(-w, -h, w * 1.3, h, 1.6 * k); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.35)'; g.lineWidth = 0.7 * k; g.strokeRect(-w, -h, w * 2, h);
    g.save(); g.translate(-w, -h); g.rotate(-lid); g.fillStyle = D.sh(col, 0.12); g.fillRect(-0.6 * k, -2.4 * k, w * 2 + 1.2 * k, 2.6 * k); g.restore(); oval(g, 0, -h * 0.5, 3.6 * k, 3.6 * k, 0, 'rgba(255,255,255,0.88)'); const ix = 0, iy = -h * 0.5, ic = D.sh(col, -0.35);
    if(icon === 'paper'){ g.fillStyle = ic; g.fillRect(ix - 1.6 * k, iy - 2.2 * k, 3.2 * k, 4.4 * k); g.fillStyle = '#FFFFFF'; [-1, 0, 1].forEach(r => g.fillRect(ix - 1 * k, iy + r * 1.2 * k - 0.2 * k, 2 * k, 0.4 * k)); }
    if(icon === 'bottle'){ g.fillStyle = ic; g.beginPath(); g.roundRect(ix - 1.3 * k, iy - 1 * k, 2.6 * k, 3.4 * k, 0.8 * k); g.fill(); g.fillRect(ix - 0.6 * k, iy - 2.6 * k, 1.2 * k, 1.8 * k); }
    if(icon === 'jar'){ g.fillStyle = ic; g.beginPath(); g.roundRect(ix - 1.7 * k, iy - 1.6 * k, 3.4 * k, 3.8 * k, 1 * k); g.fill(); g.fillRect(ix - 1.9 * k, iy - 2.6 * k, 3.8 * k, 1 * k); }
    if(icon === 'gear') gearS(g, ix, iy, 2.4 * k, 7, 0.2, ic, 1, '#FFFFFF');
    if(icon === 'leaf'){ oval(g, ix, iy, 2.4 * k, 1.4 * k, -0.6, ic); g.strokeStyle = '#FFFFFF'; g.lineWidth = 0.4 * k; ln(g, [ix - 2 * k, iy + 1.2 * k], [ix + 2 * k, iy - 1.2 * k]); }
    g.restore(); };
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), n = Math.max(0, ST.indexOf(L.state || 'x0')), live = !still && !ruined, order = v ? [2, 0, 4, 1, 3] : [0, 1, 2, 3, 4];
    B.custom(1.5, 1, (g, P, k, t) => { path(g, blob(P, 1.5, 1.0, 1.48, 0.98, 0, 30, 14 + v, 0.03)); g.fillStyle = ruined ? '#9A8A6A' : dry ? '#C8B488' : n >= 4 ? '#B9B49A' : '#A89A7A'; g.fill();
      if(n >= 3){ g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 0.8 * k; for(let i = 0; i < 5; i++) ln(g, P(0.3, 1.2 + i * 0.12, 0), P(2.7, 1.2 + i * 0.12, 0)); }
      if(n <= 2 && !ruined){ const c = P(1.9, 1.5, 0), r = (3 - n) / 3; path(g, blob(P, 1.9, 1.5, 0.4 * r + 0.1, 0.26 * r + 0.06, 0, 16, 2, 0.12)); g.fillStyle = '#2E2A30'; g.fill();
        if(!dry){ const a = live ? ph(t, 2.4) : 0; ['rgba(255,90,140,0.45)', 'rgba(255,220,70,0.45)', 'rgba(80,200,255,0.45)'].forEach((col, i) => { g.strokeStyle = col; g.lineWidth = 1.2 * k; g.beginPath(); g.ellipse(c[0] + Math.cos(a + i) * 2 * k, c[1] + Math.sin(a + i) * 0.8 * k, (8 - i * 2) * r * k + 2 * k, (3 - i * 0.6) * r * k + 1 * k, 0.2, 0.5 + a * 0.3, 5 + a * 0.3); g.stroke(); }); } }
      if(n === 5 && !dry && !ruined){ path(g, blob(P, 0.55, 1.6, 0.36, 0.24, 0, 14, 4, 0.06)); g.fillStyle = '#7A5636'; g.fill(); const R = D.rnd(5); for(let i = 0; i < 9; i++){ const q = P(0.3 + R() * 0.5, 1.45 + R() * 0.3, 1); g.strokeStyle = '#4CAE3E'; g.lineWidth = 0.9 * k; ln(g, q, [q[0], q[1] - 4 * k]); dot(g, q[0], q[1] - 5 * k, 1.4 * k, ['#FF7A9A', '#FFD23F', '#FFFFFF'][i % 3]); } } }, {layer: -2});
    // the bins along the back (one per gauge dot) — tipped over when ruined
    for(let i = 0; i < 5; i++){ const b = BIN[order[i]], x = 0.4 + i * 0.55; if(i >= n && !(ruined && i < 2)) continue; B.bill(x, 0.35, 0, (g, X, Y, k, t) => { const a = live ? ph(t, 2.4) : 0, newest = i === n - 1 && n < 5, lid = ruined ? 0.9 : newest ? Math.max(0, Math.sin(a)) * 1.1 : n === 5 ? 0.05 + 0.05 * Math.sin(a + i) : 0;
      bin(g, X, Y, k * 1.15, ruined ? D.sh(b[0], -0.3) : b[0], b[1], lid, ruined ? (i ? 1.3 : -1.2) : 0); }, {layer: 1}); }
    // the scrap piles (5 → 0 groups as the gauge fills): gears · pipes · cans · a tyre · the robot arm
    const PILE = [[0.75, 1.05], [1.55, 0.95], [2.35, 1.1], [1.1, 1.52], [2.35, 1.6]];
    PILE.forEach(([x, y], i) => { if(i < n) return; B.bill(x, y, 0, (g, X, Y, k0) => { const k = k0 * (i < 3 ? 1.55 : 1.3), R = D.rnd(31 + i * 7 + v); oval(g, X, Y, 15 * k, 5.4 * k, 0, 'rgba(42,28,20,0.22)'); g.fillStyle = ruined ? '#6E5A48' : '#7A6E66'; g.beginPath(); g.ellipse(X, Y - 3 * k, 14 * k, 9 * k, 0, Math.PI, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,0.1)'; g.beginPath(); g.ellipse(X - 3 * k, Y - 7 * k, 8 * k, 4 * k, -0.2, Math.PI, TAU); g.fill();
      const kind = i % 5; if(kind === 0 || kind === 3){ gearS(g, X - 5 * k, Y - 7 * k, 5 * k, 8, R() * 2, RUST, 1); gearS(g, X + 4 * k, Y - 5 * k, 3.6 * k, 7, R() * 2, METAL, 1); }
      g.strokeStyle = METAL; g.lineWidth = 3 * k; g.lineCap = 'round'; ln(g, [X - 10 * k, Y - 4 * k], [X + 6 * k, Y - 12 * k]); g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 0.8 * k; ln(g, [X - 10 * k, Y - 5 * k], [X + 6 * k, Y - 13 * k]);
      if(kind === 1 || kind === 4){ g.strokeStyle = '#2E3240'; g.lineWidth = 3.4 * k; g.beginPath(); g.ellipse(X + 3 * k, Y - 6 * k, 6 * k, 4.4 * k, 0.3, 0, TAU); g.stroke(); dot(g, X + 3 * k, Y - 6 * k, 1.6 * k, '#55596A'); }
      [[-8, -3, 0.4], [9, -2, -0.3], [1, -1, 1.2]].forEach(([dx, dy, r], j) => { g.save(); g.translate(X + dx * k, Y + dy * k); g.rotate(r); g.fillStyle = j % 2 ? '#B8BEC8' : '#D85A4A'; g.fillRect(-2.6 * k, -1.4 * k, 5.2 * k, 2.8 * k); g.fillStyle = '#8E949E'; g.beginPath(); g.ellipse(2.6 * k, 0, 0.7 * k, 1.4 * k, 0, 0, TAU); g.fill(); g.restore(); });
      if(kind === 2){ g.strokeStyle = HULL; g.lineWidth = 2.6 * k; ln(g, [X - 2 * k, Y - 6 * k], [X + 6 * k, Y - 16 * k]); ln(g, [X + 6 * k, Y - 16 * k], [X + 12 * k, Y - 13 * k]); dot(g, X + 6 * k, Y - 16 * k, 2 * k, DARKM); g.strokeStyle = DARKM; g.lineWidth = 1.2 * k; ln(g, [X + 12 * k, Y - 13 * k], [X + 14 * k, Y - 10 * k]); ln(g, [X + 12 * k, Y - 13 * k], [X + 15 * k, Y - 14 * k]); } }, {layer: 2}); });
    // x5: the ♻️ arrows sign on a post (3 chasing arrows, drawn)
    if(n === 5 && !ruined){ B.box(2.78, 1.7, 0, 0.06, 0.06, 22, DARKM, {layer: 2}); B.bill(2.81, 1.73, 22, (g, X, Y, k) => { oval(g, X, Y - 6 * k, 7.6 * k, 7.6 * k, 0, '#FFFFFF'); g.strokeStyle = 'rgba(42,28,20,0.4)'; g.lineWidth = 0.8 * k; g.beginPath(); g.arc(X, Y - 6 * k, 7.6 * k, 0, TAU); g.stroke();
      for(let i = 0; i < 3; i++){ const a0 = i / 3 * TAU - Math.PI / 2 + 0.25, a1 = a0 + TAU / 3 - 0.55; g.strokeStyle = '#2E9A4A'; g.lineWidth = 1.8 * k; g.beginPath(); g.arc(X, Y - 6 * k, 4.4 * k, a0, a1); g.stroke(); const e = [X + Math.cos(a1) * 4.4 * k, Y - 6 * k + Math.sin(a1) * 4.4 * k], d = a1 + Math.PI / 2; g.fillStyle = '#2E9A4A'; g.beginPath(); g.moveTo(e[0] + Math.cos(d) * 2.6 * k, e[1] + Math.sin(d) * 2.6 * k); g.lineTo(e[0] + Math.cos(d + 2.2) * 2.2 * k, e[1] + Math.sin(d + 2.2) * 2.2 * k); g.lineTo(e[0] + Math.cos(d - 2.2) * 2.2 * k, e[1] + Math.sin(d - 2.2) * 2.2 * k); g.closePath(); g.fill(); } }, {layer: 3}); }
    // fx: x0 flies circle the piles · x1–x4 a can rolls toward the bins · x5 the lids glint + a butterfly
    if(ruined) return;
    B.custom(1.5, 1, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3;
      if(n === 0){ PILE.slice(0, 3).forEach(([x, y], i) => { const c = P(x, y, 22); for(let f = 0; f < 2; f++){ const an = a * (f ? -1 : 1) + i * 2 + f * 3; dot(g, c[0] + Math.cos(an) * 9 * k, c[1] + Math.sin(an) * 4 * k - Math.sin(an * 2) * 2 * k, 1 * k, '#2A2630'); g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.ellipse(c[0] + Math.cos(an) * 9 * k + 0.8 * k, c[1] + Math.sin(an) * 4 * k - Math.sin(an * 2) * 2 * k - 1 * k, 0.9 * k, 0.5 * k, 0.5, 0, TAU); g.fill(); } }); return; }
      if(n < 5){ const q = P(1.0 + u * 0.9, 1.75 - u * 0.2, 2); g.save(); g.translate(q[0], q[1]); g.rotate(u * TAU * 2); g.fillStyle = '#B8BEC8'; g.fillRect(-2.6 * k, -1.4 * k, 5.2 * k, 2.8 * k); g.fillStyle = '#D85A4A'; g.fillRect(-0.8 * k, -1.4 * k, 1.6 * k, 2.8 * k); g.restore(); return; }
      for(let i = 0; i < 5; i++){ const f = (u + i / 5) % 1, q = P(0.4 + i * 0.55, 0.35, 16); twinkle(g, q[0] - 6 * k, q[1] - 2 * k, (1 + 2 * Math.sin(Math.PI * f)) * k, 0.8 * Math.sin(Math.PI * f), '#FFFFFF'); }
      const q = P(0.5 + u * 2, 1.4 + Math.sin(u * TAU) * 0.2, 14 + Math.sin(a * 2) * 3); butterfly(g, q[0], q[1], k, u * 5, '#FF9A2E'); }, {fx: true, layer: 9});
  }; })();

/* ───────────── 🤖 WORKS ⑩ 🧪 FILTER TOWER (2 × 1, `il1_filtertower`, c6 "Clear-Water Filter" 🔬 STEAM card + the safety line) ─────────────
   A wooden stand holds a tall glass column; a pipe feeds murky spring water into the funnel on top, a tap at the bottom drips into a jar on a little table. Beside it: 3 sacks with what
   still has to go in (the sacks empty as the layers are stacked = the meter). Layers stack the real way, bottom up: charcoal (black) · sand (tan) · gravel (grey) — a white cotton pad is
   always at the very bottom. states l0 … l3: the jar's water goes green → teal → clear → sparkling. A little slate on the stand shows the layer picture (no words).
   Live: the drip falls + the jar ripples in every state · l3 the jar sparkles. it.stand = in front of the jar (fill the flask 🧪). 🍂 dry = no drip, an empty jar · 🏚️ ruined = cracked glass,
   the layers spilled. Game: Props.setState(it, 'l' + layers, map). */
(function(){ const ST = ['l0', 'l1', 'l2', 'l3'], JAR = ['#7C9A3E', '#5EA06A', '#4EB4B0', '#6AD8F2'];
  const def = add('isle1', 'il1_filtertower', {name: 'Filter tower', foot: [2, 1], h: 92, kind: 'building', block: true, variants: 2,
    states: ST, state: 'l0', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.42, 0.96, 0], touchAt: [0.8, 0.5, 70], shadowA: 0.06, tags: ['works', 'bolt', 'water', 'filter', 'science', 'island1', 'camps'],
    diffs: [{by: 'state', a: 'l0', b: 'l3', level: 'bold', name: 'empty column + green jar / 3 layers + clear jar'}, {by: 'state', a: 'l1', b: 'l2', level: 'small', name: 'one more layer'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), n = Math.max(0, ST.indexOf(L.state || 'l0')), live = !still && !ruined, FR = v ? '#A86A3A' : M.wood;
    B.custom(1, 0.5, (g, P, k) => { path(g, blob(P, 1, 0.5, 0.98, 0.48, 0, 20, 15 + v, 0.04)); g.fillStyle = ruined ? '#A8946A' : '#B9A27A'; g.fill(); if(ruined){ [['#3A3A3A', 0.6, 0.7], ['#D8BE8A', 0.9, 0.78], ['#A8A092', 1.1, 0.68]].forEach(([c, x, y]) => { path(g, blob(P, x, y, 0.16, 0.1, 0, 10, x * 9, 0.2)); g.fillStyle = c; g.fill(); }); } }, {layer: -2});
    // the stand: 4 posts + 2 shelves, the column in the middle
    [[0.5, 0.25], [1.02, 0.25], [0.5, 0.72], [1.02, 0.72]].forEach(([x, y]) => B.box(x, y, 0, 0.07, 0.07, 70, FR, {trim: 0}));
    B.box(0.48, 0.23, 18, 0.62, 0.57, 3, FR, {trim: 0, layer: 0});
    // the GLASS COLUMN (billboard, round): cotton + charcoal + sand + gravel bands, a water line, glints · cracked when ruined
    B.bill(0.79, 0.52, 21, (g, X, Y, k, t) => { const w = 9 * k, H = 48 * k, a = live ? ph(t, 2.4) : 0; oval(g, X, Y, w, 3.6 * k, 0, '#5E8E9A'); g.fillStyle = '#CDEFF4'; g.fillRect(X - w, Y - H, w * 2, H);
      const band = (z0, h, col, grain) => { g.fillStyle = col; g.fillRect(X - w + 1 * k, Y - (z0 + h) * k, w * 2 - 2 * k, h * k); if(grain){ const R = D.rnd(z0 + 3); for(let i = 0; i < 14; i++) dot(g, X - w + 2 * k + R() * (w * 2 - 4 * k), Y - (z0 + R() * h) * k, (grain * (0.5 + R() * 0.6)) * k, D.sh(col, R() < 0.5 ? 0.2 : -0.2)); } };
      band(0, 3, '#FFFFFF', 0); if(n >= 1 && !ruined) band(3, 9, '#3A3A40', 0.7); if(n >= 2 && !ruined) band(12, 9, '#E0C48A', 0.5); if(n >= 3 && !ruined) band(21, 9, '#A8A498', 1.4);
      const wl = 3 + n * 9 + 6; if(!dry && !ruined){ g.fillStyle = n === 3 ? 'rgba(150,200,90,0.75)' : 'rgba(130,170,70,0.7)'; g.fillRect(X - w + 1 * k, Y - (wl + 6) * k, w * 2 - 2 * k, 6 * k); g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 0.8 * k; g.beginPath(); g.ellipse(X, Y - (wl + 6) * k, w - 1 * k, 1.6 * k, 0, 0, TAU); g.stroke();
        for(let i = 0; i < 3; i++){ const f = (cyc(t, 2.4) * 1 + i / 3) % 1; dot(g, X - 4 * k + i * 4 * k, Y - (wl + 6 - f * (wl + 3)) * k, 0.8 * k, 'rgba(150,190,80,' + (0.8 * (1 - f)).toFixed(3) + ')'); } }
      g.fillStyle = 'rgba(255,255,255,0.45)'; g.fillRect(X - w + 2 * k, Y - H + 3 * k, 2.4 * k, H - 6 * k); g.strokeStyle = '#5E8E9A'; g.lineWidth = 1 * k; g.strokeRect(X - w, Y - H, w * 2, H); oval(g, X, Y - H, w, 3.6 * k, 0, '#E6F8FA'); g.strokeStyle = '#5E8E9A'; g.beginPath(); g.ellipse(X, Y - H, w, 3.6 * k, 0, 0, TAU); g.stroke();
      [12, 24, 36].forEach(z => { g.strokeStyle = 'rgba(94,142,154,0.6)'; g.lineWidth = 0.6 * k; ln(g, [X + w - 3 * k, Y - z * k], [X + w, Y - z * k]); });
      if(ruined){ g.strokeStyle = 'rgba(42,28,20,0.7)'; g.lineWidth = 0.9 * k; g.beginPath(); g.moveTo(X - 4 * k, Y - 40 * k); g.lineTo(X + 1 * k, Y - 28 * k); g.lineTo(X - 3 * k, Y - 20 * k); g.lineTo(X + 4 * k, Y - 8 * k); g.stroke(); }
      // the funnel on top + the feed pipe from the left
      g.fillStyle = METAL; g.beginPath(); g.moveTo(X - 11 * k, Y - H - 9 * k); g.lineTo(X + 11 * k, Y - H - 9 * k); g.lineTo(X + 3 * k, Y - H); g.lineTo(X - 3 * k, Y - H); g.closePath(); g.fill(); oval(g, X, Y - H - 9 * k, 11 * k, 3.4 * k, 0, D.sh(METAL, 0.2)); oval(g, X, Y - H - 9 * k, 8.6 * k, 2.4 * k, 0, ruined || dry ? '#5A5A5A' : '#6E8A3A');
      g.strokeStyle = DARKM; g.lineWidth = 3 * k; g.lineCap = 'round'; g.beginPath(); g.moveTo(X - 26 * k, Y - 30 * k); g.lineTo(X - 26 * k, Y - H - 16 * k); g.lineTo(X - 6 * k, Y - H - 16 * k); g.lineTo(X - 4 * k, Y - H - 11 * k); g.stroke();
      if(!dry && !ruined){ const f = cyc(t, 2.4) * 3 % 1; dot(g, X - 4 * k, Y - H - (11 - f * 4) * k, 1.2 * k, '#6E8A3A'); }
      // the tap at the bottom (toward the jar side)
      g.strokeStyle = DARKM; g.lineWidth = 2.4 * k; ln(g, [X + w, Y - 3 * k], [X + w + 7 * k, Y - 3 * k]); ln(g, [X + w + 7 * k, Y - 3 * k], [X + w + 7 * k, Y + 1 * k]); dot(g, X + w + 4 * k, Y - 5.4 * k, 1.6 * k, '#E2353A'); }, {layer: 2});
    // the slate with the layer picture (on the left post) — no words
    B.bill(0.45, 0.78, 34, (g, X, Y, k) => { g.fillStyle = '#3A4048'; g.fillRect(X - 7 * k, Y - 12 * k, 14 * k, 12 * k); g.strokeStyle = FR; g.lineWidth = 1.4 * k; g.strokeRect(X - 7 * k, Y - 12 * k, 14 * k, 12 * k);
      [['#FFFFFF', 0], ['#7A7A80', 1], ['#E0C48A', 2], ['#A8A498', 3]].forEach(([c, i]) => { g.fillStyle = c; g.fillRect(X - 3 * k, Y - (3 + i * 2) * k, 6 * k, 1.6 * k); }); g.strokeStyle = '#8AD0FF'; g.lineWidth = 0.8 * k; ln(g, [X, Y - 11 * k], [X, Y - 10 * k]); ln(g, [X + 4.4 * k, Y - 3 * k], [X + 5.6 * k, Y - 1.6 * k]); }, {layer: 3});
    // the little table + the JAR (its water = how clean it comes out)
    B.box(1.28, 0.34, 0, 0.36, 0.34, 10, FR, {trim: 0, layer: 1});
    B.bill(1.46, 0.5, 10, (g, X, Y, k0, t) => { const k = k0 * 1.35, w = 5 * k, h = 11 * k; oval(g, X, Y, w * 1.1, 2 * k, 0, 'rgba(42,28,20,0.2)'); g.fillStyle = '#E6F8FA'; g.beginPath(); g.roundRect(X - w, Y - h, w * 2, h, 2 * k); g.fill();
      if(!dry && !ruined){ const lv = h * (0.45 + n * 0.08); g.fillStyle = JAR[n]; g.beginPath(); g.roundRect(X - w + 0.8 * k, Y - lv, w * 2 - 1.6 * k, lv - 0.6 * k, 1.6 * k); g.fill(); const r = live ? cyc(t, 2.4) : 0.4; g.strokeStyle = 'rgba(255,255,255,' + (0.8 * (1 - r)).toFixed(3) + ')'; g.lineWidth = 0.7 * k; g.beginPath(); g.ellipse(X, Y - lv, (1 + r * 3) * k, (0.5 + r * 0.8) * k, 0, 0, TAU); g.stroke(); }
      g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(X - w + 1.2 * k, Y - h + 2 * k, 1.4 * k, h - 4 * k); g.strokeStyle = '#6E9AA8'; g.lineWidth = 0.8 * k; g.beginPath(); g.roundRect(X - w, Y - h, w * 2, h, 2 * k); g.stroke(); oval(g, X, Y - h, w * 0.9, 1.4 * k, 0, '#B8D4DA'); }, {layer: 2});
    // the 3 sacks of what still has to go in (charcoal · sand · gravel) — the stacked ones are gone
    [['#3A3A40', 0.18, 0.4], ['#E0C48A', 0.2, 0.78], ['#A8A498', 1.82, 0.78]].forEach(([c, x, y], i) => { if(i < n && !ruined) return; B.bill(x, y, 0, (g, X, Y, k) => { oval(g, X, Y, 7 * k, 2.6 * k, 0, 'rgba(42,28,20,0.2)'); g.fillStyle = '#C9A46E'; g.beginPath(); g.moveTo(X - 6 * k, Y); g.quadraticCurveTo(X - 7.6 * k, Y - 8 * k, X - 3 * k, Y - 11 * k); g.lineTo(X + 3 * k, Y - 11 * k); g.quadraticCurveTo(X + 7.6 * k, Y - 8 * k, X + 6 * k, Y); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(120,80,30,0.5)'; g.lineWidth = 0.7 * k; g.stroke(); oval(g, X, Y - 11 * k, 4 * k, 1.8 * k, 0, c); const R = D.rnd(i + 2); for(let s = 0; s < 6; s++) dot(g, X + (R() - 0.5) * 6 * k, Y - 11 * k + (R() - 0.5) * 2 * k, 0.7 * k, D.sh(c, 0.25)); g.strokeStyle = '#8A6A3A'; g.lineWidth = 1 * k; ln(g, [X - 3.4 * k, Y - 9.6 * k], [X + 3.4 * k, Y - 9.6 * k]); }, {layer: 1}); });
    // fx: the drip from the tap into the jar (every state) · l3 the jar sparkles
    if(ruined || dry) return;
    B.custom(1.2, 0.5, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, tap = P(0.79, 0.52, 21), jar = P(1.46, 0.5, 10), x0 = tap[0] + 16 * k, y0 = tap[1] + 1 * k; for(let i = 0; i < 2; i++){ const f = (u * 2 + i * 0.5) % 1; dot(g, x0 + (jar[0] - x0) * f * 0.9, y0 + (jar[1] - 6 * k - y0) * f * f, 1.1 * k, JAR[n]); }
      if(n === 3){ for(let i = 0; i < 2; i++){ const f = (u + i / 2) % 1; twinkle(g, jar[0] + (i ? 3 : -2) * k, jar[1] - (8 + i * 2) * k, (1 + 2.4 * Math.sin(Math.PI * f)) * k, 0.9 * Math.sin(Math.PI * f), '#FFFFFF'); } } }, {fx: true, layer: 9});
  }; })();

/* ───────────── 🤖 WORKS ⑪a 🛗 COG-LIFT LANDING (2 × 2 gate, `il1_coglift`, the south end of the 🤖 half · a REP gate) ─────────────
   An iron landing deck at the foot of a tall toothed RACK MAST; a big cog wheel at the top, a counterweight, and the lift CAGE riding the rack. def.gate 'rep:works' + walkStates ['ready'].
   grey (😠 Upset — "broken" for you): the cage is parked at the TOP, a red tag with a crossed-out wrench (drawn) hangs on the call box, the lamp blinks red · ready: the cage is DOWN at
   the landing, its gate open, the lamp green, the cogs tick round, a puff of steam from the valve. it.stand = the cage door. 🍂 dry = rusty · 🏚️ ruined = the mast bent, the cage fallen. */
(function(){ const def = add('isle1', 'il1_coglift', {noRubble: true, name: 'Cog-lift landing', foot: [2, 2], h: 136, kind: 'gate', block: true, gate: 'rep:works', walkStates: ['ready'], variants: 2,
    states: ['grey', 'ready'], state: 'grey', liveStates: ['grey', 'ready'], live: {period: 2.4, frames: 6}, stand: [0.9, 1.86, 4], touchAt: [1.8, 1.04, 30], shadowA: 0.1, tags: ['gate', 'rep', 'works', 'bolt', 'lift', 'island1', 'camps'],
    diffs: [{by: 'state', a: 'grey', b: 'ready', level: 'bold', name: 'cage up + red tag / cage down + gate open'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), on = (L.state || 'grey') === 'ready', live = !still && !ruined, IRON = dry ? '#A88A6A' : v ? '#5A6A8A' : DARKM, CAGE = v ? '#FFD23F' : ORG, MZ = 124;
    B.custom(1, 1, (g, P, k) => { path(g, blob(P, 1, 1, 0.98, 0.98, 0, 22, 16 + v, 0.03)); g.fillStyle = ruined ? '#A8946A' : '#B9A27A'; g.fill(); }, {layer: -2});
    // the landing deck (iron plate + yellow-black edge) + 2 rails
    const dk = B.box(0.3, 0.9, 0, 1.3, 0.96, 4, METAL, {trim: 0}); B.custom(0.95, 1.86, (g, P, k) => { for(let i = 0; i < 10; i++){ const a = P(0.3 + i * 0.13, 1.86, 4), b = P(0.36 + i * 0.13, 1.86, 4); g.strokeStyle = i % 2 ? YEL : BLK; g.lineWidth = 2 * k; ln(g, a, b); } }, {layer: 1});
    // the rack MAST (2 iron rails + teeth) on the back-left of the deck, up to the top cog · ruined = bent + shorter
    B.box(0.42, 0.42, 0, 0.12, 0.12, ruined ? 70 : MZ, IRON, {trim: 16}); B.box(0.8, 0.42, 0, 0.12, 0.12, ruined ? 54 : MZ, IRON, {trim: 16});
    B.custom(0.67, 0.5, (g, P, k) => { const top = ruined ? 54 : MZ - 4; for(let z = 6; z < top; z += 5){ const a = P(0.56, 0.5, z), b = P(0.78, 0.5, z); g.strokeStyle = 'rgba(42,28,20,0.55)'; g.lineWidth = 1.4 * k; ln(g, a, b); } }, {layer: 0});
    if(!ruined){ B.box(0.36, 0.36, MZ, 0.62, 0.22, 6, IRON, {trim: 0});
      B.custom(0.67, 0.47, (g, P, k, t) => { const a = on && live ? cyc(t, 2.4) * TAU / 10 : 0.2, c = P(0.67, 0.47, MZ + 18); gearS(g, c[0], c[1], 15 * k, 10, a, dry ? '#B88A5A' : v ? '#9AA2B4' : YEL, 1, DARKM); gearS(g, c[0] + 16 * k, c[1] + 6 * k, 7 * k, 7, -a * 1.6 + 0.3, METAL, 1, DARKM);
        g.strokeStyle = '#3A3A44'; g.lineWidth = 1 * k; ln(g, [c[0] - 12 * k, c[1] + 6 * k], [c[0] - 12 * k, c[1] + (on ? 70 : 30) * k]); g.fillStyle = '#55596A'; g.fillRect(c[0] - 15 * k, c[1] + (on ? 70 : 30) * k, 6 * k, 9 * k); }, {layer: 5}); }
    // the CAGE: a yellow / orange box frame on the rack — at the top (grey) or down at the landing (ready) · ruined = tipped on the deck
    const cz = ruined ? 4 : on ? 4 : MZ - 44;
    if(ruined) B.custom(1.1, 1.3, (g, P, k) => { const pts = [P(0.7, 1.0, 4), P(1.4, 1.2, 4), P(1.45, 1.5, 22), P(0.75, 1.3, 22)]; path(g, pts); g.fillStyle = D.sh(CAGE, -0.3); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.5)'; g.lineWidth = 1 * k; g.stroke(); for(let i = 1; i < 5; i++){ ln(g, [pts[0][0] + (pts[1][0] - pts[0][0]) * i / 5, pts[0][1] + (pts[1][1] - pts[0][1]) * i / 5], [pts[3][0] + (pts[2][0] - pts[3][0]) * i / 5, pts[3][1] + (pts[2][1] - pts[3][1]) * i / 5]); } }, {layer: 2});
    else { B.box(0.48, 0.62, cz, 0.7, 0.66, 3, CAGE, {trim: 0, layer: 2}); B.box(0.48, 0.62, cz + 38, 0.7, 0.66, 3, CAGE, {trim: 0, layer: 2});
      B.custom(0.83, 0.95, (g, P, k, t) => { const bob = on && live ? Math.sin(ph(t, 2.4)) * 0.6 : 0, z0 = cz + 3 + bob, z1 = cz + 38 + bob, C = [[0.48, 0.62], [1.18, 0.62], [1.18, 1.28], [0.48, 1.28]]; g.strokeStyle = D.sh(CAGE, -0.2); g.lineWidth = 1.8 * k;
        C.forEach(([x, y]) => ln(g, P(x, y, z0), P(x, y, z1))); g.strokeStyle = 'rgba(80,60,20,0.55)'; g.lineWidth = 0.8 * k; for(let i = 1; i < 6; i++){ ln(g, P(1.18, 0.62 + i * 0.11, z0), P(1.18, 0.62 + i * 0.11, z1)); }
        if(!on){ for(let i = 1; i < 6; i++) ln(g, P(0.48 + i * 0.117, 1.28, z0), P(0.48 + i * 0.117, 1.28, z1)); }
        else { const sl = P(0.5, 1.28, z0); g.strokeStyle = D.sh(CAGE, -0.2); g.lineWidth = 1 * k; for(let i = 0; i < 3; i++){ ln(g, P(0.5 + i * 0.05, 1.3 + i * 0.02, z0), P(0.5 + i * 0.05, 1.3 + i * 0.02, z1)); } } }, {layer: 3}); }
    // the call box + lamp on a post (front-right) · grey: the red tag with a crossed wrench swings
    B.box(1.76, 1.0, 0, 0.1, 0.1, 30, IRON, {layer: 2}); const cb = B.box(1.7, 0.94, 22, 0.22, 0.18, 14, YEL, {trim: 0, layer: 3}); B.decal(cb, 'front', 1.76, 0.1, 4, 6, BLK, {});
    B.custom(1.81, 1.04, (g, P, k, t) => { const a = live ? ph(t, 2.4) : 0.3, lp = P(1.81, 1.04, 40); dot(g, lp[0], lp[1], 3 * k, ruined ? '#55596A' : on ? '#4FB848' : (0.5 + 0.5 * Math.sin(a * 2) > 0.45 ? '#E2353A' : '#8A2A28')); dot(g, lp[0] - 1 * k, lp[1] - 1 * k, 1 * k, 'rgba(255,255,255,0.6)');
      if(on || ruined) return; const h = P(1.81, 1.12, 24), sw = Math.sin(a) * 0.25 + Math.cos(a) * 0.1; g.save(); g.translate(h[0], h[1]); g.rotate(sw); g.strokeStyle = '#3A3A44'; g.lineWidth = 0.6 * k; ln(g, [0, 0], [0, 4 * k]); g.fillStyle = '#E2353A'; g.beginPath(); g.roundRect(-4.6 * k, 4 * k, 9.2 * k, 7 * k, 1.4 * k); g.fill();
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.2 * k; g.lineCap = 'round'; ln(g, [-2.4 * k, 9.4 * k], [2.2 * k, 5.6 * k]); dot(g, 2.4 * k, 5.4 * k, 1.2 * k, '#FFFFFF'); ln(g, [-3.4 * k, 5 * k], [3.4 * k, 10.4 * k]); g.restore(); }, {layer: 4});
    // fx: ready = a steam puff from the valve + the lamp glow · grey = the red lamp glow
    if(ruined) return;
    B.custom(1.8, 1.04, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3, lp = P(1.81, 1.04, 40); D.glow(g, lp[0], lp[1], 9 * k, on ? '#7AF07A' : '#FF5A4A', on ? 0.5 : 0.25 + 0.45 * Math.max(0, Math.sin(a * 2)));
      if(on){ const v0 = P(0.86, 0.5, 14); for(let i = 0; i < 2; i++){ const f = (u + i / 2) % 1; puff(g, v0[0] + 6 * k + f * 8 * k, v0[1] - f * 16 * k, (1.6 + f * 3) * k, Math.sin(Math.PI * f) * 0.7); } } }, {fx: true, layer: 9});
  }; })();

/* ───────────── 🤖 WORKS ⑪b 🕵️ THE LEAKING PIPE (3 × 1, `il1_leakpipe`, c7 "Midnight Dumping": follow the oil at night 🥷 → it's a leaking pipe, not a villain → patch it) ─────────────
   A long iron pipe on 3 little stands, a joint in the middle with a pressure gauge, and a ditch along the front that runs to the creek. leak (default): black oil drips from the joint,
   a dark trail runs down the ditch with a rainbow sheen, the grass beside it is brown · ✨ drops fall, the sheen swirls, the gauge needle shivers in the red · patched: a bright clamp band +
   a drip tray under the joint, clean water in the ditch, the grass green again · ✨ the needle rests in the green, a glint on the clamp, a little frog hops in the ditch.
   it.stand = in front of the joint. 🍂 dry = an empty ditch · 🏚️ ruined = the pipe burst in two. Game: Props.setState(it, 'patched', map). */
(function(){ const ST = ['leak', 'patched'];
  const def = add('isle1', 'il1_leakpipe', {name: 'Leaking pipe', foot: [3, 1], h: 34, kind: 'thing', block: true, variants: 2,
    states: ST, state: 'leak', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.5, 0.98, 0], touchAt: [1.5, 0.42, 16], shadowA: 0.04, tags: ['works', 'bolt', 'pipe', 'oil', 'sneak', 'night', 'island1', 'camps'],
    diffs: [{by: 'state', a: 'leak', b: 'patched', level: 'bold', name: 'oil trail / clamp + clean ditch'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), fix = (L.state || 'leak') === 'patched', live = !still && !ruined, PIPE = v ? RUST : METAL;
    B.custom(1.5, 0.5, (g, P, k, t) => { path(g, blob(P, 1.5, 0.5, 1.5, 0.48, 0, 28, 17 + v, 0.04)); g.fillStyle = ruined ? '#9AA06A' : !fix ? '#A8A062' : '#7CC15A'; g.fill();
      const d = []; for(let i = 0; i <= 12; i++) d.push(P(i / 4, 0.74 + Math.sin(i + v) * 0.03, 0)); path(g, d.concat([P(3, 0.94, 0), P(0, 0.94, 0)])); g.fillStyle = '#8A6A44'; g.fill();
      if(!dry){ const w = []; for(let i = 0; i <= 12; i++) w.push(P(i / 4, 0.79 + Math.sin(i + v) * 0.03, 0)); path(g, w.concat([P(3, 0.9, 0), P(0, 0.9, 0)])); g.fillStyle = fix ? '#5EC3EA' : '#3A3A44'; g.fill();
        if(!fix && !ruined){ const a = live ? ph(t, 2.4) : 0; ['rgba(255,90,140,0.5)', 'rgba(255,220,70,0.5)', 'rgba(80,200,255,0.5)'].forEach((col, i) => { g.strokeStyle = col; g.lineWidth = 1.1 * k; const q = P(1.0 + i * 0.5 + Math.sin(a + i) * 0.08, 0.84, 0); g.beginPath(); g.ellipse(q[0], q[1], 7 * k, 1.6 * k, 0.45, a * 0.5, a * 0.5 + 4.6); g.stroke(); }); }
        if(fix){ g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 0.8 * k; const u = live ? cyc(t, 2.4) : 0.3; for(let i = 0; i < 4; i++){ const x = (i * 0.8 + u * 0.8) % 3; ln(g, P(x, 0.84, 0), P(Math.min(3, x + 0.25), 0.84, 0)); } } }
      if(!fix && !ruined){ path(g, blob(P, 1.5, 0.6, 0.24, 0.16, 0, 12, 3, 0.15)); g.fillStyle = '#2E2A30'; g.fill(); path(g, [P(1.42, 0.62, 0), P(1.58, 0.62, 0), P(1.55, 0.8, 0), P(1.45, 0.8, 0)]); g.fill(); } }, {layer: -2});
    // brown / green grass tufts along the ditch
    [[0.4, 0.62], [1.1, 0.66], [2.0, 0.64], [2.7, 0.6]].forEach(([x, y], i) => B.bill(x, y, 0, (g, X, Y, k, t) => { const a = live ? ph(t, 2.4) : 0; g.lineCap = 'round'; for(let s = 0; s < 6; s++){ const an = -Math.PI / 2 + (s - 2.5) * 0.3 + Math.sin(a + s + i) * 0.05; g.strokeStyle = fix && !dry ? (s % 2 ? '#4CAE3E' : '#6AC04E') : '#A8904A'; g.lineWidth = 1.1 * k; ln(g, [X + (s - 2.5) * 1.4 * k, Y], [X + Math.cos(an) * (fix ? 9 : 6) * k, Y + Math.sin(an) * (fix ? 9 : 6) * k]); } }, {layer: 1}));
    // 3 stands + the pipe (two long boxes) + the joint flange · ruined = burst (a gap, torn ends)
    [0.3, 1.5, 2.7].forEach(x => B.box(x - 0.06, 0.32, 0, 0.12, 0.2, 10, DARKM, {trim: 0}));
    if(ruined){ B.box(0, 0.34, 10, 1.3, 0.16, 7, PIPE, {trim: 0}); B.box(1.72, 0.34, 10, 1.28, 0.16, 7, PIPE, {trim: 0}); B.custom(1.5, 0.42, (g, P, k) => { [1.3, 1.72].forEach((x, i) => { const q = P(x, 0.42, 13); g.fillStyle = '#2E2A30'; g.beginPath(); g.ellipse(q[0], q[1], 3 * k, 4 * k, 0, 0, TAU); g.fill(); g.fillStyle = PIPE; for(let s = 0; s < 3; s++){ g.beginPath(); g.moveTo(q[0], q[1] - 4 * k + s * 3 * k); g.lineTo(q[0] + (i ? -1 : 1) * 4 * k, q[1] - 3 * k + s * 3 * k); g.lineTo(q[0], q[1] - 2 * k + s * 3 * k); g.fill(); } }); }, {layer: 2}); }
    else { B.box(0, 0.34, 10, 3, 0.16, 7, PIPE, {trim: 0}); B.box(1.42, 0.3, 8, 0.16, 0.24, 11, D.sh(PIPE, -0.1), {trim: 0, layer: 1});
      if(fix) B.box(1.38, 0.28, 7, 0.24, 0.28, 13, YEL, {trim: 0, layer: 2});
      // the drip tray (patched)
      if(fix) B.box(1.32, 0.58, 0, 0.36, 0.22, 3, METAL, {trim: 0, layer: 1});
      // the pressure gauge on top of the joint: needle in the red (leak, shivers) · green (patched, rests)
      B.box(1.47, 0.36, 19, 0.06, 0.06, 6, DARKM, {layer: 3}); B.bill(1.5, 0.39, 25, (g, X, Y, k, t) => { const a = live ? ph(t, 2.4) : 0.3; oval(g, X, Y - 5 * k, 6 * k, 6 * k, 0, '#F4EFE4'); g.strokeStyle = DARKM; g.lineWidth = 1.2 * k; g.beginPath(); g.arc(X, Y - 5 * k, 6 * k, 0, TAU); g.stroke();
        [['#4FB848', Math.PI, Math.PI * 1.45], ['#FFD23F', Math.PI * 1.45, Math.PI * 1.7], ['#E2353A', Math.PI * 1.7, TAU]].forEach(([c, a0, a1]) => { g.strokeStyle = c; g.lineWidth = 1.6 * k; g.beginPath(); g.arc(X, Y - 5 * k, 4.4 * k, a0, a1); g.stroke(); });
        const an = fix ? Math.PI * 1.22 + Math.sin(a) * 0.03 : Math.PI * 1.86 + Math.sin(a * 3) * 0.07 + Math.cos(a) * 0.04; g.strokeStyle = '#2A1C14'; g.lineWidth = 1 * k; ln(g, [X, Y - 5 * k], [X + Math.cos(an) * 4.6 * k, Y - 5 * k + Math.sin(an) * 4.6 * k]); dot(g, X, Y - 5 * k, 0.9 * k, '#2A1C14'); }, {layer: 4}); }
    // fx: leak = oil drops fall from the joint · patched = a glint on the clamp + a little frog hops along the ditch
    if(ruined) return;
    B.custom(1.5, 0.6, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3;
      if(!fix){ const j = P(1.5, 0.46, 9); for(let i = 0; i < 2; i++){ const f = (u * 2 + i * 0.5) % 1; g.fillStyle = '#1E1A20'; g.beginPath(); g.ellipse(j[0], j[1] + f * 10 * k, 1 * k * (1 - f * 0.3), 1.6 * k, 0, 0, TAU); g.fill(); } const r = (u * 2) % 1, q = P(1.5, 0.62, 0); g.strokeStyle = 'rgba(120,110,130,' + (1 - r).toFixed(3) + ')'; g.lineWidth = 0.7 * k; g.beginPath(); g.ellipse(q[0], q[1], (1 + r * 4) * k, (0.5 + r * 1.6) * k, 0, 0, TAU); g.stroke(); return; }
      const cl = P(1.5, 0.42, 20); twinkle(g, cl[0] - 4 * k, cl[1] - 1 * k, (1 + 2.6 * Math.sin(Math.PI * u)) * k, 0.9 * Math.sin(Math.PI * u), '#FFFFFF');
      if(!dry){ const x = 0.4 + u * 2.2, hop = Math.abs(Math.sin(u * Math.PI * 4)), q = P(x, 0.84, hop * 6); g.save(); g.translate(q[0], q[1]); g.scale(k, k); oval(g, 0, -2, 3, 2.2, 0, '#5DBE48'); dot(g, -1.4, -3.8, 1, '#5DBE48'); dot(g, 1.4, -3.8, 1, '#5DBE48'); dot(g, -1.4, -4, 0.5, '#2A1C14'); dot(g, 1.4, -4, 0.5, '#2A1C14'); g.restore(); } }, {fx: true, layer: 9});
  }; })();

/* ───────────── ⚖️ BORDER ⑫ 📋 JOB BOARD (2 × 1, `il1_jobboard`, by the 💧 spring · 🕊️ "both" opens it at once, §6) ─────────────
   ONE board for both camps: the left post is a 🦖 bone with a fern tie, the right post is a 🤖 iron pipe with a bolt; a little thatch-and-tin roof on top (half fern thatch, half tin
   sheet). closed (default): two plank shutters are shut and tied with a vine, a fern grows over the corner · ✨ the vine tie sways, a leaf drifts · open: the shutters swing out, 4 job notes
   are pinned up (drawn icons, no words: 🥚 egg · ⚙️ gear · 🌳 tree · 🐟 fish), a small brass bell hangs from the eave · ✨ the notes flutter one by one, the bell sways.
   it.stand = in front of the board. 🍂 dry = brown fern · 🏚️ ruined = a shutter fallen off, notes torn. Game: Props.setState(it, 'open', map). */
(function(){ const ST = ['closed', 'open'];
  const def = add('isle1', 'il1_jobboard', {name: 'Job board', foot: [2, 1], h: 72, kind: 'building', block: true, variants: 2,
    states: ST, state: 'closed', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.0, 0.96, 0], touchAt: [1.0, 0.5, 40], shadowA: 0.06, tags: ['border', 'camps', 'quests', 'board', 'island1'],
    diffs: [{by: 'state', a: 'closed', b: 'open', level: 'bold', name: 'shutters tied shut / open with job notes'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), on = (L.state || 'closed') === 'open', live = !still && !ruined, PL = v ? '#B98A52' : M.plank;
    B.custom(1, 0.5, (g, P, k) => { path(g, blob(P, 1, 0.5, 0.96, 0.46, 0, 20, 18 + v, 0.04)); g.fillStyle = ruined ? '#A8946A' : '#C9A46E'; g.fill(); }, {layer: -2});
    // the 2 posts: a 🦖 bone (left) · a 🤖 pipe (right) — custom so they stay round, then the board box between them
    B.custom(0.32, 0.5, (g, P, k) => { const b = P(0.32, 0.5, 0), tp = P(0.32, 0.5, 60); boneS(g, [b[0], b[1] - 2 * k], [tp[0], tp[1]], 5 * k, ruined ? '#C8BEA6' : BONE); g.strokeStyle = dry ? '#A8904A' : FERN2; g.lineWidth = 1.4 * k; [24, 30].forEach(z => { const q = P(0.32, 0.5, z); g.beginPath(); g.ellipse(q[0], q[1], 3.4 * k, 1.4 * k, 0, 0, TAU); g.stroke(); }); }, {layer: 0});
    B.custom(1.68, 0.5, (g, P, k) => { const b = P(1.68, 0.5, 0), tp = P(1.68, 0.5, 60); g.strokeStyle = DARKM; g.lineWidth = 5 * k; g.lineCap = 'butt'; ln(g, b, tp); g.strokeStyle = 'rgba(255,255,255,0.3)'; g.lineWidth = 1.2 * k; ln(g, [b[0] - 1.4 * k, b[1]], [tp[0] - 1.4 * k, tp[1]]); [8, 56].forEach(z => { const q = P(1.68, 0.5, z); g.fillStyle = METAL; g.fillRect(q[0] - 3.6 * k, q[1] - 1.6 * k, 7.2 * k, 3.2 * k); }); const bq = P(1.68, 0.5, 30); dot(g, bq[0] + 3 * k, bq[1], 1.6 * k, YEL); }, {layer: 0});
    const bd = B.box(0.38, 0.44, 16, 1.24, 0.1, 40, '#8A5A34', {trim: 0, layer: 1});
    B.decal(bd, 'front', 0.44, 1.12, 3, 34, on || ruined ? '#C9A46E' : PL, {paint: (g, Q, k, side) => { g.strokeStyle = 'rgba(90,60,30,0.35)'; g.lineWidth = 0.7 * k; for(let i = 1; i < 6; i++) ln(g, Q(i / 6, 0), Q(i / 6, 34));
        if(!on && !ruined){ g.strokeStyle = 'rgba(90,60,30,0.6)'; g.lineWidth = 1 * k; ln(g, Q(0.5, 0), Q(0.5, 34)); } }});
    // the little roof: half fern thatch (🦖 side) + half tin (🤖 side)
    B.roof(0.3, 0.34, 56, 0.7, 0.3, 10, dry || ruined ? '#B8A05A' : v ? '#E3BE6A' : '#58B444', {ridge: 'x', ov: 0.1, stripes: 4, layer: 2}); B.roof(1.0, 0.34, 56, 0.7, 0.3, 10, v ? '#C8CED8' : METAL, {ridge: 'x', ov: 0.1, stripes: 5, layer: 2});
    // closed: the 2 shutters + the vine tie · open: the shutters swung out + 4 notes + the bell
    B.custom(1.0, 0.56, (g, P, k, t, T) => { const a = live ? ph(t, 2.4) : 0.3, y = 0.56; if(!sideOf(T.nrm(0, 1))) return;
      if(!on){ if(ruined){ path(g, [P(0.44, y, 19), P(1.0, y, 19), P(1.0, y, 53), P(0.44, y, 53)]); g.fillStyle = D.sh(PL, -0.25); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.8 * k; g.stroke(); return; }
        [[0.44, 1.0], [1.0, 1.56]].forEach(([x0, x1]) => { path(g, [P(x0, y, 19), P(x1, y, 19), P(x1, y, 53), P(x0, y, 53)]); g.fillStyle = PL; g.fill(); g.strokeStyle = 'rgba(42,28,20,0.32)'; g.lineWidth = 0.8 * k; g.stroke(); g.strokeStyle = 'rgba(90,60,30,0.45)'; [26, 46].forEach(z => ln(g, P(x0 + 0.04, y, z), P(x1 - 0.04, y, z))); ln(g, P(x0 + 0.06, y, 26), P(x1 - 0.06, y, 46)); });
        const c = P(1.0, y, 36), sw = Math.sin(a) * 1.2 * k + Math.cos(a * 2) * 0.4 * k; [P(0.94, y, 38), P(1.06, y, 38)].forEach(h => dot(g, h[0], h[1], 1.3 * k, '#6E4524')); g.strokeStyle = dry ? '#A8904A' : '#3E7A2E'; g.lineWidth = 1.4 * k; [-1, 1].forEach(sd => { g.beginPath(); g.ellipse(c[0] + sd * 2.2 * k, c[1] - 1.6 * k, 2.4 * k, 1.6 * k, 0, 0, TAU); g.stroke(); }); g.lineWidth = 1.1 * k; g.beginPath(); g.moveTo(c[0], c[1] - 0.6 * k); g.quadraticCurveTo(c[0] + 2 * k + sw, c[1] + 4 * k, c[0] + sw, c[1] + 9 * k); g.stroke();
        oval(g, c[0] + sw + 1 * k, c[1] + 9 * k, 2.4 * k, 1.2 * k, 0.6, dry ? '#B8A04A' : '#5DBE48'); return; }
      // open: shutters swung out to the sides
      [[0.44, -1], [1.56, 1]].forEach(([x, s]) => { if(ruined && s > 0) return; const e = x + s * 0.02; path(g, [P(x, y, 19), P(e + s * 0.46, y + 0.26, 19), P(e + s * 0.46, y + 0.26, 53), P(x, y, 53)]); g.fillStyle = D.sh(PL, -0.1); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.32)'; g.lineWidth = 0.8 * k; g.stroke(); });
      if(ruined){ const q = P(1.6, 0.86, 0); g.save(); g.translate(q[0], q[1]); g.rotate(0.4); g.fillStyle = D.sh(PL, -0.2); g.fillRect(-10 * k, -3 * k, 20 * k, 6 * k); g.restore(); }
      const NOTES = [[0.62, 44, '#FFF6DC', 'egg'], [0.94, 40, '#E6F0FF', 'gear'], [1.24, 45, '#E8F6E0', 'tree'], [0.82, 28, '#FFF0E0', 'fish']], u = live ? cyc(t, 2.4) : 0;
      NOTES.forEach(([x, z, col, ic], i) => { const q = P(x, y, z), fl = live && Math.floor(u * 4) === i ? Math.sin((u * 4 % 1) * TAU) * 0.25 : 0, torn = ruined && i % 2; g.save(); g.translate(q[0], q[1]); g.rotate(fl * 0.4 - 0.05 + i * 0.04); g.fillStyle = col; g.beginPath(); g.moveTo(-6 * k, -1 * k); g.lineTo(6 * k, -1 * k); g.lineTo(6 * k, 10 * k + fl * 6 * k); g.lineTo(torn ? 0 : -6 * k, torn ? 6 * k : 10 * k); if(torn) g.lineTo(-6 * k, 8 * k); g.closePath(); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.6 * k; g.stroke();
        dot(g, 0, 0.4 * k, 1.1 * k, '#E2353A'); const cx = 0, cy = 5 * k; if(ic === 'egg'){ oval(g, cx, cy, 2.6 * k, 3.4 * k, 0, '#F4EAD2'); g.strokeStyle = '#B9905A'; g.lineWidth = 0.6 * k; g.beginPath(); g.ellipse(cx, cy, 2.6 * k, 3.4 * k, 0, 0, TAU); g.stroke(); dot(g, cx + 1 * k, cy - 1 * k, 0.6 * k, SPOT); }
        if(ic === 'gear') gearS(g, cx, cy, 3.2 * k, 8, 0.3, '#7A8294', 1, col); if(ic === 'tree'){ g.fillStyle = '#7A5636'; g.fillRect(cx - 0.6 * k, cy, 1.2 * k, 3.4 * k); oval(g, cx, cy - 0.6 * k, 3 * k, 2.6 * k, 0, '#4CAE3E'); }
        if(ic === 'fish'){ oval(g, cx + 0.6 * k, cy, 3 * k, 1.5 * k, 0, '#F2A23A'); g.fillStyle = '#F2A23A'; g.beginPath(); g.moveTo(cx - 2 * k, cy); g.lineTo(cx - 4 * k, cy - 1.6 * k); g.lineTo(cx - 4 * k, cy + 1.6 * k); g.closePath(); g.fill(); } g.restore(); });
      if(!ruined){ const h = P(1.6, 0.62, 56), sw = live ? Math.sin(a) * 0.3 + Math.cos(a * 2) * 0.08 : 0.05; g.strokeStyle = '#6E4524'; g.lineWidth = 0.8 * k; ln(g, h, [h[0], h[1] + 3 * k]); g.save(); g.translate(h[0], h[1] + 3 * k); g.rotate(sw); g.fillStyle = '#E8B23A'; g.beginPath(); g.moveTo(-3 * k, 6 * k); g.quadraticCurveTo(-3 * k, 0, 0, 0); g.quadraticCurveTo(3 * k, 0, 3 * k, 6 * k); g.closePath(); g.fill(); dot(g, 0, 6.4 * k, 1 * k, '#8A5A1A'); g.restore(); } }, {layer: 3});
    // a fern grows over the left corner (sways)
    B.bill(0.16, 0.7, 0, (g, X, Y, k, t) => fern(g, X, Y, k * 1.1, live ? ph(t, 2.4) : 0, v ? '#3E9A36' : '#4CAE3E', dry || ruined), {layer: 2});
    // fx: closed = a leaf drifts down past the board
    if(ruined || on) return;
    B.custom(1.0, 0.7, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3, s0 = P(1.3, 0.7, 70); leafS(g, s0[0] + Math.sin(a * 2) * 5 * k, s0[1] + u * 60 * k, k, a + u * 4, dry ? '#B8A04A' : '#6AB84A'); }, {fx: true, layer: 9});
  }; })();

/* ───────────── ⚖️ BORDER ⑬ 🪵 TALKING LOG (3 × 2, `il1_talkinglog`, the meeting place · 🗣️ Talk first · 👂 Listen next — c4 Sorry Stew is shared here · the 🌈 Spring Festival feast) ─────────────
   A big mossy fallen log as a bench along the back, two stump seats facing it, a flat stone in the middle and the TALKING STICK on its stand (a stick with a fern leaf AND a little gear
   tied on — whoever holds it talks, everyone else listens). talk (default): ✨ the talking stick's tassel sways, a ladybird walks the log · stew: the Sorry Stew pot sits on the stone,
   4 bowls on the log, steam rises (one puff a heart) · feast: a banana-leaf runner along the log full of fruit + rice, a string of lights between two poles — 🦖 bone lanterns and 🤖 bulbs
   taking turns — they twinkle, bunting in both camps' colours flutters. it.stand = the middle stone. 🍂 dry = brown moss · 🏚️ ruined = the log split, a stump gone.
   Game: Props.setState(it, 'stew' | 'feast', map). */
(function(){ const ST = ['talk', 'stew', 'feast'];
  const def = add('isle1', 'il1_talkinglog', {name: 'Talking log', foot: [3, 2], h: 64, kind: 'landmark', block: true, variants: 2,
    states: ST, state: 'talk', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.5, 1.2, 0], touchAt: [1.5, 1.2, 12], shadowA: 0.06, tags: ['border', 'camps', 'meeting', 'peace', 'feast', 'island1'],
    diffs: [{by: 'state', a: 'talk', b: 'feast', level: 'bold', name: 'quiet log / feast with lights'}, {by: 'state', a: 'talk', b: 'stew', level: 'small', name: 'the stew pot + bowls'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), st = L.state || 'talk', live = !still && !ruined, LOGC = v ? '#9A6A3E' : '#8A5A34', MOSS = dry || ruined ? '#A8A05A' : '#6AB04A';
    B.custom(1.5, 1, (g, P, k) => { path(g, blob(P, 1.5, 1.0, 1.48, 0.96, 0, 30, 19 + v, 0.03)); g.fillStyle = ruined ? '#A8A06A' : dry ? '#C8B488' : '#9ACB6A'; g.fill(); path(g, blob(P, 1.5, 1.2, 0.8, 0.5, 0, 22, 4 + v, 0.06)); g.fillStyle = '#D8BE8A'; g.fill(); }, {layer: -2});
    // the fallen LOG along the back (world space → turns): a fat rounded body, bark lines, a cut end with rings, moss on top · ruined = split in two
    B.custom(1.5, 0.45, (g, P, k) => { const log = (x0, x1, y, r, cut) => { const a = P(x0, y, r * 0.5), b = P(x1, y, r * 0.5), R = r * k; g.fillStyle = D.sh(LOGC, -0.12); g.beginPath(); g.moveTo(a[0], a[1] - R); g.lineTo(b[0], b[1] - R); g.lineTo(b[0], b[1] + R * 0.6); g.lineTo(a[0], a[1] + R * 0.6); g.closePath(); g.fill();
        g.fillStyle = LOGC; g.beginPath(); g.moveTo(a[0], a[1] - R); g.lineTo(b[0], b[1] - R); g.lineTo(b[0], b[1] - R * 0.1); g.lineTo(a[0], a[1] - R * 0.1); g.closePath(); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.8 * k; for(let i = 1; i < 9; i++){ const u = i / 9; ln(g, [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - R * 0.8], [a[0] + (b[0] - a[0]) * u + 3 * k, a[1] + (b[1] - a[1]) * u + R * 0.3]); }
        [a, b].forEach((e, i) => { if(i === 0 && !cut) return; oval(g, e[0], e[1] - R * 0.2, R * 0.42, R * 0.8, 0, '#E2B07A'); g.strokeStyle = 'rgba(140,90,40,0.6)'; g.lineWidth = 0.6 * k; [0.55, 0.3].forEach(f => { g.beginPath(); g.ellipse(e[0], e[1] - R * 0.2, R * 0.42 * f, R * 0.8 * f, 0, 0, TAU); g.stroke(); }); });
        for(let i = 0; i < 6; i++){ const u = 0.1 + i * 0.15, q = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - R * 0.95]; oval(g, q[0], q[1], (5 + (i % 2) * 2) * k, 2.2 * k, 0, MOSS); } };
      if(ruined){ log(0.15, 1.35, 0.42, 12, true); log(1.6, 2.85, 0.5, 12, true); } else log(0.15, 2.85, 0.45, 12, false); }, {layer: 1});
    // 2 stump seats (front-left + front-right)
    [[0.45, 1.55], [2.55, 1.55]].forEach(([x, y], i) => { if(ruined && i === 1) return; B.drum(x, y, 0, 0.16, 12, LOGC, {layer: 2, topFill: '#E2B07A'}); });
    // the flat middle stone
    B.bill(1.5, 1.2, 0, (g, X, Y, k) => { oval(g, X, Y + 1.4 * k, 14 * k, 6 * k, 0, '#7E786C'); oval(g, X, Y, 14 * k, 6 * k, 0, '#B9B2A2'); oval(g, X - 4 * k, Y - 1.4 * k, 5 * k, 1.8 * k, -0.2, 'rgba(255,255,255,0.3)'); }, {layer: 2});
    // the TALKING STICK on a forked stand (left of the stone): a stick with a fern leaf + a little gear tied on, a tassel that sways
    if(!ruined) B.custom(1.0, 1.0, (g, P, k, t) => { const a = live ? ph(t, 2.4) : 0.3, b = P(1.0, 1.0, 0), tp = P(1.0, 1.0, 34); g.strokeStyle = '#6E4524'; g.lineWidth = 1.6 * k; ln(g, b, [b[0], b[1] - 20 * k]); ln(g, [b[0], b[1] - 20 * k], [b[0] - 3 * k, b[1] - 24 * k]); ln(g, [b[0], b[1] - 20 * k], [b[0] + 3 * k, b[1] - 24 * k]);
      g.strokeStyle = '#B9864E'; g.lineWidth = 2.2 * k; ln(g, [b[0] - 9 * k, b[1] - 22 * k], [b[0] + 11 * k, b[1] - 25 * k]); oval(g, b[0] + 10 * k, b[1] - 28 * k, 4 * k, 1.8 * k, -0.5, dry ? '#B8A04A' : '#4CAE3E'); gearS(g, b[0] - 8 * k, b[1] - 24 * k, 3 * k, 7, 0.3, YEL, 1, DARKM);
      const sw = Math.sin(a) * 2 * k + Math.cos(a * 2) * 0.6 * k; g.strokeStyle = '#E2502E'; g.lineWidth = 1 * k; for(let i = -1; i <= 1; i++) ln(g, [b[0] + 2 * k, b[1] - 23.4 * k], [b[0] + 2 * k + i * 1.2 * k + sw, b[1] - 15 * k]); }, {layer: 3});
    // stew: the pot on the stone + 4 bowls on the log · feast: the banana-leaf runner with fruit + rice, the light string, bunting
    if(st === 'stew' && !ruined){ B.bill(1.5, 1.2, 4, (g, X, Y, k) => { const W = 9 * k, H = 13 * k, cy = Y - H * 0.42; g.fillStyle = '#C8603A'; g.beginPath(); g.ellipse(X, cy, W, H * 0.44, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.7 * k; g.stroke(); oval(g, X, Y - H * 0.84, W * 0.7, H * 0.16, 0, '#E0A23A'); oval(g, X - 2 * k, Y - H * 0.86, 1.6 * k, 0.8 * k, 0, '#4FB848'); oval(g, X + 2 * k, Y - H * 0.82, 1.6 * k, 0.8 * k, 0, '#E8473A'); }, {layer: 3});
      B.custom(1.5, 0.5, (g, P, k) => { [0.5, 1.1, 1.9, 2.5].forEach((x, i) => { const q = P(x, 0.45, 22); oval(g, q[0], q[1], 5 * k, 2 * k, 0, '#F4EFE4'); g.fillStyle = '#F4EFE4'; g.beginPath(); g.ellipse(q[0], q[1], 5 * k, 3.4 * k, 0, 0, Math.PI); g.fill(); oval(g, q[0], q[1] - 0.2 * k, 4 * k, 1.4 * k, 0, '#E0A23A'); g.fillStyle = i % 2 ? '#3FB8A8' : AMB; g.fillRect(q[0] - 4.6 * k, q[1] + 1.2 * k, 9.2 * k, 0.9 * k); }); }, {layer: 3}); }
    if(st === 'feast' && !ruined){ B.custom(1.5, 0.5, (g, P, k) => { const a = P(0.3, 0.45, 23), b = P(2.7, 0.45, 23); g.strokeStyle = '#3E9A36'; g.lineWidth = 7 * k; g.lineCap = 'butt'; ln(g, a, b); g.strokeStyle = '#5DBE48'; g.lineWidth = 5 * k; ln(g, a, b);
        const F = [['#F2C230', 0.1, 'ban'], ['#FFFFFF', 0.25, 'rice'], ['#E8473A', 0.4, 'fruit'], ['#FF9A2E', 0.55, 'mango'], ['#FFFFFF', 0.7, 'rice'], ['#8A4A7A', 0.85, 'fruit']]; F.forEach(([c, u, kind]) => { const q = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - 2 * k];
          if(kind === 'rice'){ g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(q[0], q[1], 3.4 * k, Math.PI, TAU); g.fill(); oval(g, q[0], q[1], 3.6 * k, 1.2 * k, 0, '#E6E0D0'); } else if(kind === 'ban'){ for(let n = 0; n < 4; n++) oval(g, q[0] + (n - 1.5) * 1.6 * k, q[1] - 2 * k, 1 * k, 3 * k, 0.4, n % 2 ? '#F2C230' : '#FFD84A'); }
          else if(kind === 'mango'){ oval(g, q[0], q[1] - 2 * k, 3.4 * k, 2.4 * k, 0.3, c); oval(g, q[0] + 2 * k, q[1] - 1 * k, 3 * k, 2.2 * k, -0.3, '#FFB43A'); } else { for(let n = 0; n < 3; n++) dot(g, q[0] + (n - 1) * 2.4 * k, q[1] - 2 * k - (n % 2) * 1.6 * k, 1.8 * k, c); } }); }, {layer: 3});
      [[0.12, 0.9], [2.88, 0.9]].forEach(([x, y]) => B.box(x - 0.04, y - 0.04, 0, 0.08, 0.08, 52, BAMBOO, {layer: 2})); }
    // fx: talk = a ladybird walks the log · stew = steam (one puff a heart) · feast = the light string twinkles (bone lanterns + bulbs) + the bunting flutters
    if(ruined) return;
    B.custom(1.5, 1.0, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3;
      if(st === 'talk'){ const q = P(0.4 + u * 2.2, 0.45, 23.5); g.save(); g.translate(q[0], q[1]); oval(g, 0, 0, 2.2 * k, 1.6 * k, 0, '#E2353A'); dot(g, 1.8 * k, 0, 0.9 * k, '#2A1C14'); dot(g, -0.6 * k, -0.6 * k, 0.5 * k, '#2A1C14'); dot(g, 0.4 * k, 0.6 * k, 0.5 * k, '#2A1C14'); g.restore(); return; }
      if(st === 'stew'){ const top = P(1.5, 1.2, 18); for(let i = 0; i < 3; i++){ const f = (u + i / 3) % 1, x = top[0] + Math.sin(f * 5 + i) * 4 * k, y = top[1] - f * 24 * k; if(i === 0){ g.save(); g.globalAlpha = Math.sin(Math.PI * f) * 0.9; heartS(g, x, y, 2.6 * k, '#FFC8D8'); g.restore(); } else puff(g, x, y, (2 + f * 2.4) * k, Math.sin(Math.PI * f) * 0.7); } return; }
      const a0 = P(0.12, 0.9, 50), b0 = P(2.88, 0.9, 50); g.strokeStyle = '#3A3A44'; g.lineWidth = 0.7 * k; g.beginPath(); g.moveTo(a0[0], a0[1]); g.quadraticCurveTo((a0[0] + b0[0]) / 2, (a0[1] + b0[1]) / 2 + 16 * k, b0[0], b0[1]); g.stroke();
      for(let i = 1; i < 10; i++){ const f = i / 10, x = a0[0] + (b0[0] - a0[0]) * f, y = a0[1] + (b0[1] - a0[1]) * f + Math.sin(f * Math.PI) * 8 * k, on = 0.5 + 0.5 * Math.sin(a * 2 + i * 1.3); if(i % 2){ D.glow(g, x, y + 3 * k, 6 * k, '#FFE27A', 0.25 + 0.35 * on); bulbS(g, x, y + 3 * k, k, on > 0.3); }
        else { D.glow(g, x, y + 4 * k, 6 * k, '#FFB45A', 0.25 + 0.35 * on); g.fillStyle = BONE; g.beginPath(); g.ellipse(x, y + 4 * k, 2.2 * k, 3 * k, 0, 0, TAU); g.fill(); dot(g, x, y + 4 * k, 1.1 * k, on > 0.3 ? '#FFB45A' : '#C8A070'); } }
      for(let i = 0; i < 8; i++){ const f = (i + 0.5) / 8, x = a0[0] + (b0[0] - a0[0]) * f, y = a0[1] + (b0[1] - a0[1]) * f + Math.sin(f * Math.PI) * 8 * k + 1 * k, fl = Math.sin(a * 2 + i) * 1.2 * k + Math.cos(a + i) * 0.6 * k; g.fillStyle = i % 2 ? (v ? '#3FB8A8' : AMB) : YEL; g.beginPath(); g.moveTo(x - 2.4 * k, y); g.lineTo(x + 2.4 * k, y); g.lineTo(x + fl * 0.5, y + 5 * k + fl); g.closePath(); g.fill(); } }, {fx: true, layer: 9});
  }; })();

/* ───────────── ⚖️ BORDER ⑭ 🏭 NEST-SAFE WORKSHOP PLOT (3 × 3, `il1_nestworkshop`, the 🕊️ "both" ending of M4b · lore §27l-6) ─────────────
   empty (default): a cleared plot pegged out with stakes + string, a little sign-board with the picture of a nest on a gear (no words), a pile of planks + a stack of iron sheets under a
   tarp — ✨ the string flutters, a butterfly. built: the workshop BOTH camps build — a Bolt Works iron frame + glass windows downstairs, a raptor fern-thatch roof on top with a real
   NEST on the ridge (a jewel egg in it, kept safe and warm), a gear wheel in the gable, a chimney · ✨ the gable gear turns, the egg's warm glow (fx), a little smoke ring rises.
   it.stand = the door. 🍂 dry = brown thatch · 🏚️ ruined = a roof hole, a window boarded. Game: Props.setState(it, 'built', map) (+ Props.morphFx). */
(function(){ const ST = ['empty', 'built'];
  const def = add('isle1', 'il1_nestworkshop', {name: 'Nest-safe Workshop', foot: [3, 3], h: 110, kind: 'building', block: true, door: [1.5, 2.4], variants: 2,
    states: ST, state: 'empty', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.5, 2.8, 0], touchAt: [1.5, 1.4, 60], shadowA: 0.1, tags: ['border', 'camps', 'workshop', 'nest', 'both', 'island1'],
    diffs: [{by: 'state', a: 'empty', b: 'built', level: 'bold', name: 'pegged plot / the workshop with a nest roof'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), built = (L.state || 'empty') === 'built', live = !still && !ruined, THATCH = dry ? '#C8AE62' : v ? '#E3BE6A' : '#58B444';
    B.custom(1.5, 1.5, (g, P, k, t) => { path(g, blob(P, 1.5, 1.5, 1.48, 1.48, 0, 30, 21 + v, 0.03)); g.fillStyle = ruined ? '#A8946A' : '#C9A46E'; g.fill();
      if(!built){ const C = [[0.4, 0.4], [2.6, 0.4], [2.6, 2.3], [0.4, 2.3]], a = live ? ph(t, 2.4) : 0; g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 0.8 * k; for(let i = 0; i < 4; i++){ const p = P(C[i][0], C[i][1], 6), q = P(C[(i + 1) % 4][0], C[(i + 1) % 4][1], 6), sag = Math.sin(a + i) * 1.2 * k + Math.cos(a * 2 + i) * 0.4 * k; g.beginPath(); g.moveTo(p[0], p[1]); g.quadraticCurveTo((p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + 2 * k + sag, q[0], q[1]); g.stroke(); }
        C.forEach(([x, y]) => { const b = P(x, y, 0), tp = P(x, y, 8); g.strokeStyle = '#A86A3A'; g.lineWidth = 1.6 * k; ln(g, b, tp); }); g.save(); g.setLineDash([2 * k, 2 * k]); g.strokeStyle = 'rgba(90,60,30,0.35)'; g.lineWidth = 0.8 * k; ln(g, P(1.5, 0.4, 0), P(1.5, 2.3, 0)); g.restore(); } }, {layer: -2});
    if(!built){ // the sign-board: a nest on a gear (no words)
      B.box(0.18, 2.62, 0, 0.06, 0.06, 26, '#8A5A34', {layer: 1}); B.bill(0.21, 2.65, 26, (g, X, Y, k) => { g.fillStyle = '#E2B07A'; g.fillRect(X - 10 * k, Y - 12 * k, 20 * k, 12 * k); g.strokeStyle = '#8A5A34'; g.lineWidth = 1.2 * k; g.strokeRect(X - 10 * k, Y - 12 * k, 20 * k, 12 * k); gearS(g, X, Y - 5 * k, 4.6 * k, 9, 0.2, '#7A8294', 1, '#E2B07A');
        g.fillStyle = '#9A6A3A'; g.beginPath(); g.ellipse(X, Y - 8 * k, 5 * k, 2.4 * k, 0, 0, Math.PI); g.fill(); oval(g, X, Y - 9 * k, 1.8 * k, 2.2 * k, 0, '#F4EAD2'); }, {layer: 2});
      // planks + iron sheets under a tarp (back-right)
      [0, 4, 8].forEach((z, i) => B.box(1.9, 0.5 + i * 0.03, z, 0.8, 0.3, 4, i % 2 ? M.plank : M.wood, {trim: 0, layer: 1})); B.box(0.6, 0.5, 0, 0.6, 0.45, 9, METAL, {trim: 3, layer: 1});
      B.custom(0.9, 0.72, (g, P, k) => { path(g, [P(0.56, 0.46, 10), P(1.24, 0.46, 10), P(1.28, 1.0, 2), P(0.52, 1.0, 2)]); g.fillStyle = v ? '#3E8EF0' : '#3FB8A8'; g.fill(); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.8 * k; g.stroke(); dot(g, P(0.56, 0.46, 10)[0], P(0.56, 0.46, 10)[1], 1 * k, '#FFFFFF'); }, {layer: 2});
      if(!ruined) B.custom(1.5, 1.5, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3, q = P(0.7 + u * 1.6, 1.5 + Math.sin(u * TAU) * 0.5, 14 + Math.sin(a * 2) * 4); butterfly(g, q[0], q[1], k, u * 5, '#FFD23F'); }, {fx: true, layer: 9}); return; }
    // built: iron frame + glass downstairs, plank walls, the fern-thatch roof with the NEST on the ridge
    const W = B.box(0.4, 0.5, 0, 2.2, 1.9, 46, v ? '#DDE3EE' : HULL, {trim: 0}); B.win(W, 'front', 0.52, 0.34, 16, 16); B.win(W, 'front', 2.14, 0.34, 16, 16); B.win(W, 'right', 0.72, 0.5, 16, 16); B.win(W, 'right', 1.72, 0.5, 16, 16);
    [0.96, 2.0].forEach(a => B.decal(W, 'front', a, 0.07, 0, 46, DARKM, {})); [1.4].forEach(a => B.decal(W, 'right', a, 0.07, 0, 46, DARKM, {}));
    // the wide roll-up workshop door (slats) with a hazard header + a gear-and-claw plaque over it
    B.decal(W, 'front', 1.12, 0.76, 0, 32, '#7A8294', {k: 'door', paint: (g, Q, k) => { g.strokeStyle = 'rgba(42,28,20,0.35)'; g.lineWidth = 0.8 * k; for(let z = 4; z < 32; z += 4) ln(g, Q(0.02, z), Q(0.98, z)); g.fillStyle = 'rgba(255,255,255,0.18)'; const a = Q(0, 0), b = Q(0.1, 0), c = Q(0.1, 32), d = Q(0, 32); path(g, [a, b, c, d]); g.fill(); }});
    B.decal(W, 'front', 1.08, 0.84, 32, 4, YEL, {paint: (g, Q, k) => { g.fillStyle = BLK; for(let u = 0; u < 1; u += 0.12){ path(g, [Q(u, 0), Q(u + 0.06, 0), Q(u + 0.1, 4), Q(u + 0.04, 4)]); g.fill(); } }});
    B.decal(W, 'front', 1.34, 0.32, 37, 8, '#E2B07A', {paint: (g, Q, k) => { const c = Q(0.3, 4), d = Q(0.72, 4); gearS(g, c[0], c[1], 3.2 * k, 8, 0.2, DARKM, 1, '#E2B07A'); claw3(g, d[0], d[1] + 0.6 * k, 2.6 * k, AMB); }});
    B.decal(W, 'front', 0.4, 2.2, 0, 5, DARKM, {}); B.decal(W, 'right', 0.5, 1.9, 0, 5, DARKM, {}); B.decal(W, 'front', 0.4, 2.2, 42, 4, YEL, {}); B.decal(W, 'right', 0.5, 1.9, 42, 4, YEL, {});
    B.custom(1.5, 2.44, (g, P, k, t, T) => { if(!sideOf(T.nrm(0, 1)) || ruined) return; [[1.06, -1], [1.94, 1]].forEach(([x, s2]) => { const a = P(x, 2.44, 0); g.fillStyle = BONE; g.beginPath(); g.moveTo(a[0] - 2.4 * k, a[1]); g.quadraticCurveTo(a[0] - s2 * 1 * k, a[1] - 22 * k, a[0] - s2 * 8 * k, a[1] - 34 * k); g.quadraticCurveTo(a[0] + s2 * 2 * k, a[1] - 20 * k, a[0] + 2.4 * k, a[1]); g.closePath(); g.fill(); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.7 * k; g.stroke(); g.strokeStyle = AMB; g.lineWidth = 1.4 * k; ln(g, [a[0] - 2.2 * k, a[1] - 12 * k], [a[0] + 2.2 * k, a[1] - 12 * k]); }); }, {layer: 3});
    B.box(0.36, 0.46, 46, 2.28, 1.98, 4, '#8A5A34', {trim: 0}); B.roof(0.36, 0.46, 50, 2.28, 1.98, 34, THATCH, {ridge: 'x', ov: 0.2, stripes: 12, gable: v ? '#C9A050' : '#3E9A36'});
    B.box(2.1, 0.7, 60, 0.22, 0.22, 34, '#7A7484', {trim: 0, layer: 1});
    // the gear in the gable (turns) — drawn on the visible gable end
    B.custom(2.7, 1.45, (g, P, k, t, T) => { const a = live ? cyc(t, 2.4) * TAU / 9 : 0.2, side = sideOf(T.nrm(1, 0)) ? 2.66 : sideOf(T.nrm(-1, 0)) ? 0.34 : null; if(side == null) return; const c = P(side, 1.45, 62); gearS(g, c[0], c[1], 7 * k, 9, a, YEL, 1, DARKM); }, {layer: 3});
    // the NEST on the ridge with a jewel egg in it
    if(!ruined) B.custom(1.5, 1.45, (g, P, k) => { const c = P(1.3, 1.45, 84); oval(g, c[0], c[1] + 1 * k, 12 * k, 4.6 * k, 0, '#7A5230'); g.save(); g.beginPath(); g.ellipse(c[0], c[1] - 1 * k, 12 * k, 6 * k, 0, 0, TAU); g.ellipse(c[0], c[1] - 1 * k, 8 * k, 3.6 * k, 0, 0, TAU); g.fillStyle = '#9A6A3A'; g.fill('evenodd'); g.restore();
      g.strokeStyle = 'rgba(70,44,20,0.7)'; g.lineWidth = 0.8 * k; for(let s = 0; s < 18; s++){ const an = s / 18 * TAU; ln(g, [c[0] + Math.cos(an) * 8.4 * k, c[1] - 1 * k + Math.sin(an) * 4 * k], [c[0] + Math.cos(an + 0.4) * 11.4 * k, c[1] - 1 * k + Math.sin(an + 0.4) * 5.6 * k]); }
      oval(g, c[0], c[1] - 0.6 * k, 7.4 * k, 3.2 * k, 0, '#6AB04A'); eggS(g, c[0], c[1], k, 1.1, 0, v ? '#E8862E' : SPOT, 0); }, {layer: 4});
    // fx: the egg's warm glow + a smoke ring from the chimney
    if(ruined) return;
    B.custom(1.5, 1.4, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3, c = P(1.3, 1.45, 90), ch = P(2.21, 0.81, 96); D.glow(g, c[0], c[1], 14 * k, '#FFB45A', 0.3 + 0.12 * Math.sin(a));
      for(let i = 0; i < 2; i++){ const f = (u + i / 2) % 1; g.strokeStyle = 'rgba(255,255,255,' + (0.7 * Math.sin(Math.PI * f)).toFixed(3) + ')'; g.lineWidth = 1.6 * k; g.beginPath(); g.ellipse(ch[0] + Math.sin(f * 4) * 3 * k, ch[1] - f * 30 * k, (2 + f * 4) * k, (1 + f * 2) * k, 0, 0, TAU); g.stroke(); } }, {fx: true, layer: 9});
  }; })();

/* ───────────── ⚖️ BORDER ⑮ 💛 SECRET SNACK CLUB HIDEOUT (2 × 2, `il1_snackclub`, c11 — Nibbles 🦖 + Sprocket 🤖, the 2 kids' secret) ─────────────
   Tucked under a giant fern + a big boulder on the border: a den with a patched blanket roof on sticks, a crate table, 2 cushions (a green leaf one, an orange one with a bolt), a snack tin,
   a cup each, and a drawing pinned up of a raptor + a robot holding hands (drawn, no words). hidden (default): a curtain of hanging leaves + vines covers the front — only a peek of
   the cushion shows · ✨ the leaves rustle, a cookie crumb trail leads in · found: the curtain is tied back, a string of little lights (bone beads + tiny bulbs) twinkles, cocoa steams.
   it.stand = the entrance. 🍂 dry = brown leaves · 🏚️ ruined = the blanket roof fallen. Game: Props.setState(it, 'found', map). */
(function(){ const ST = ['hidden', 'found'];
  const def = add('isle1', 'il1_snackclub', {name: 'Secret Snack Club hideout', foot: [2, 2], h: 70, kind: 'building', block: true, variants: 2,
    states: ST, state: 'hidden', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.1, 1.6, 0], touchAt: [1.0, 1.0, 14], shadowA: 0.08, tags: ['border', 'camps', 'kids', 'secret', 'friends', 'island1'],
    diffs: [{by: 'state', a: 'hidden', b: 'found', level: 'bold', name: 'leaf curtain closed / open with lights'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), found = (L.state || 'hidden') === 'found', live = !still && !ruined, leaf = dry || ruined ? ['#9A8A3A', '#B8A04A'] : v ? ['#2E7A3A', '#4E9E44'] : ['#2A6E3A', '#46943E'];
    const BLANKET = v ? ['#7AB8F0', '#FFD23F', '#F2A0B8'] : ['#F2A0B8', '#7AD0B8', '#FFD23F'];
    B.custom(1, 1, (g, P, k) => { path(g, blob(P, 1, 1, 0.98, 0.98, 0, 22, 23 + v, 0.05)); g.fillStyle = dry || ruined ? '#A8A062' : '#6EB64E'; g.fill(); path(g, blob(P, 1.0, 1.1, 0.62, 0.52, 0, 18, 2 + v, 0.05)); g.fillStyle = '#C9A46E'; g.fill();
      if(!found && !ruined){ g.fillStyle = '#B9864E'; [[1.2, 1.95], [1.15, 1.75], [1.08, 1.55], [1.02, 1.36]].forEach(([x, y]) => { const q = P(x, y, 0); dot(g, q[0], q[1], 1 * k, '#C8904A'); }); } }, {layer: -2});
    // the big boulder at the back-left + the giant fern over the back-right
    B.bill(0.3, 0.35, 0, (g, X, Y, k) => rock(g, X, Y, k, 24, 46, 7 + v, ruined ? '#9A9488' : '#A8A092', dry || ruined ? null : '#6E9E3A', ruined), {layer: 1});
    B.bill(1.6, 0.4, 0, (g, X, Y, k, t) => { const a = live ? ph(t, 2.4) : 0; g.save(); g.translate(X, Y); g.scale(2.4, 2.6); fern(g, 0, 0, k, a, leaf[1], dry || ruined); g.restore(); }, {layer: 1});
    // the den: 4 sticks + a patched blanket roof (squares of 3 colours) · ruined = fallen on the ground
    [[0.55, 0.58], [1.45, 0.58], [0.55, 1.12], [1.45, 1.12]].forEach(([x, y], i) => B.box(x, y, 0, 0.06, 0.06, ruined ? 10 : (y < 1 ? 40 : 28), '#8A5A34', {layer: 1}));
    B.custom(1.0, 1.1, (g, P, k) => { const z0 = ruined ? 3 : 41, z1 = ruined ? 2 : 29, y0 = ruined ? 0.75 : 0.55, y1 = ruined ? 1.6 : 1.18, A = P(0.5, y0, z0), Bq = P(1.55, y0, z0), C = P(1.55, y1, z1), Dq = P(0.5, y1, z1); path(g, [A, Bq, C, Dq]); g.fillStyle = BLANKET[0]; g.fill();
      for(let i = 0; i < 4; i++) for(let j = 0; j < 4; j++){ if((i + j) % 2) continue; const q = (u, w) => P(0.5 + 1.05 * u, y0 + (y1 - y0) * w, z0 + (z1 - z0) * w); path(g, [q(i / 4, j / 4), q((i + 1) / 4, j / 4), q((i + 1) / 4, (j + 1) / 4), q(i / 4, (j + 1) / 4)]); g.fillStyle = BLANKET[1 + (i % 2)]; g.fill(); }
      g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.8 * k; path(g, [A, Bq, C, Dq]); g.stroke(); g.save(); g.setLineDash([1.6 * k, 1.4 * k]); g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 0.6 * k; for(let i = 1; i < 4; i++){ ln(g, P(0.5 + 1.05 * i / 4, y0, z0), P(0.5 + 1.05 * i / 4, y1, z1)); } g.restore(); }, {layer: 3});
    // inside: the crate table + 2 cushions + snack tin + cups + the drawing on the back stick
    B.box(0.84, 0.66, 0, 0.32, 0.26, 10, '#C9A46E', {trim: 5, layer: 1});
    B.custom(1.0, 1.1, (g, P, k) => { const c1 = P(0.72, 1.0, 1), c2 = P(1.3, 1.0, 1); oval(g, c1[0], c1[1], 7 * k, 3.4 * k, 0, dry ? '#A8A05A' : '#5DBE48'); g.strokeStyle = '#3E7A2E'; g.lineWidth = 0.6 * k; ln(g, [c1[0] - 5 * k, c1[1]], [c1[0] + 5 * k, c1[1]]); oval(g, c2[0], c2[1], 7 * k, 3.4 * k, 0, ORG); zap(g, c2[0], c2[1] - 0.4 * k, 2 * k, YEL);
      const tb = P(1.0, 0.79, 10); g.fillStyle = '#E2353A'; g.fillRect(tb[0] - 3.4 * k, tb[1] - 4 * k, 6.8 * k, 4 * k); oval(g, tb[0], tb[1] - 4 * k, 3.4 * k, 1.4 * k, 0, '#FFD23F'); [[-5, 0, '#4CAE3E'], [5, -1, '#9AA2B4']].forEach(([dx, dy, c]) => { g.fillStyle = c; g.fillRect(tb[0] + dx * k - 1.4 * k, tb[1] + dy * k - 3 * k, 2.8 * k, 3 * k); oval(g, tb[0] + dx * k, tb[1] + dy * k - 3 * k, 1.4 * k, 0.6 * k, 0, '#6E4524'); });
      const dr = P(0.6, 0.62, 9); g.fillStyle = '#FFFFFF'; g.fillRect(dr[0] - 6 * k, dr[1] - 6 * k, 12 * k, 9 * k); g.strokeStyle = 'rgba(42,28,20,0.3)'; g.lineWidth = 0.5 * k; g.strokeRect(dr[0] - 6 * k, dr[1] - 6 * k, 12 * k, 9 * k); oval(g, dr[0] - 2.6 * k, dr[1] - 1.4 * k, 1.8 * k, 2.4 * k, 0, '#4CAE3E'); g.fillStyle = '#9AA2B4'; g.fillRect(dr[0] + 1 * k, dr[1] - 3.6 * k, 3.4 * k, 4.4 * k); g.strokeStyle = '#E2353A'; g.lineWidth = 0.7 * k; ln(g, [dr[0] - 1 * k, dr[1] - 1 * k], [dr[0] + 1.2 * k, dr[1] - 1 * k]); heartS(g, dr[0], dr[1] - 4.4 * k, 1 * k, '#E2353A'); }, {layer: 2});
    // hidden: the leaf curtain over the front (rustles) · found: tied back to the front sticks
    if(!ruined) B.custom(1.0, 1.2, (g, P, k, t) => { const a = live ? ph(t, 2.4) : 0.3;
      for(let i = 0; i < 12; i++){ const u = i / 11, top = P(0.5 + u * 1.05, 1.2, 28), side = u < 0.5 ? -1 : 1, open = found ? Math.min(1, Math.abs(u - 0.5) < 0.42 ? 1 : 0.2) : 0; const dx = found ? side * (0.5 - Math.abs(u - 0.5)) * 34 * k : 0, L2 = found ? 12 : 27, sw = Math.sin(a + i * 0.8) * 1.4 * k * (found ? 0.4 : 1);
        g.strokeStyle = '#3E7A2E'; g.lineWidth = 1 * k; g.beginPath(); g.moveTo(top[0], top[1]); g.quadraticCurveTo(top[0] + dx * 0.4 + sw, top[1] + L2 * 0.6 * k, top[0] + dx + sw, top[1] + L2 * k); g.stroke();
        for(let s = 0; s < 4; s++){ const f = (s + 1) / 5, x = top[0] + (dx + sw) * f, y = top[1] + L2 * k * f; oval(g, x + (s % 2 ? 2 : -2) * k, y, 2.4 * k, 1.3 * k, s % 2 ? 0.5 : -0.5, leaf[(i + s) % 2]); } }
      if(found){ [[0.55, 1.2], [1.45, 1.2]].forEach(([x, y]) => { const q = P(x, y, 18); g.strokeStyle = '#E2353A'; g.lineWidth = 1.2 * k; g.beginPath(); g.ellipse(q[0], q[1], 2.4 * k, 1.4 * k, 0, 0, TAU); g.stroke(); }); } }, {layer: 4});
    // fx: found = the light string (bone beads + tiny bulbs) twinkles + cocoa steam · hidden = a little peek glint of the cushion
    if(ruined) return;
    B.custom(1.0, 1.1, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3;
      if(!found){ const q = P(1.0, 1.2, 6); twinkle(g, q[0] + Math.sin(a) * 3 * k, q[1], (1 + 1.6 * Math.sin(Math.PI * u)) * k, 0.7 * Math.sin(Math.PI * u), '#FFE6A0'); return; }
      for(let i = 0; i < 9; i++){ const f = i / 8, q = P(0.55 + f * 0.9, 1.19, 27 - Math.sin(f * Math.PI) * 4), on = 0.5 + 0.5 * Math.sin(a * 2 + i * 1.4); D.glow(g, q[0], q[1], 5 * k, i % 2 ? '#FFE27A' : '#FFB45A', 0.2 + 0.35 * on); if(i % 2) bulbS(g, q[0], q[1] + 2 * k, k * 0.8, on > 0.3); else dot(g, q[0], q[1] + 1.6 * k, 1.3 * k, BONE); }
      [[-5, 0], [5, -1]].forEach(([dx, dy], i) => { const tb = P(1.0, 0.79, 10), f = (u + i * 0.5) % 1; puff(g, tb[0] + dx * k + Math.sin(f * 5) * 1.4 * k, tb[1] + dy * k - 4 * k - f * 12 * k, (0.8 + f * 1.6) * k, Math.sin(Math.PI * f) * 0.6); }); }, {fx: true, layer: 9});
  }; })();

/* ───────────── ⚖️ BORDER ⑯ 🌳 STUMPS → SAPLINGS (3 × 2, `il1_saplings`, the ⚖️ Valley Balance 🌳 TREES gauge, like the 💧 spring · c9 Plant 2 for 1 · c10 Phuwi's seeds) ─────────────
   t0: 5 cut stumps on bare ground, sawdust, an axe-cut log. Each gauge dot = one stump gets a SAPLING beside it (a ring of dark compost, a bamboo stake tied with a strip of cloth,
   2–3 leaves) — the saplings ARE the meter you see; the bare ground turns green bit by bit. A compost bin (woven 🦖 + a tin lid 🤖) sits at the back-left. t5: 5 saplings, flowers, a bird.
   Live: t0 sawdust blows · t1–t4 the newest sapling's leaves bob + a watering-can sparkle drips on it · t5 a little bird hops between the saplings.
   it.stand = the front. 🍂 dry = droopy brown saplings · 🏚️ ruined = trampled, stakes snapped. Game: Props.setState(it, 't' + realm.balance.il1.t, map). */
(function(){ const ST = ['t0', 't1', 't2', 't3', 't4', 't5'], SP = [[0.45, 1.2], [1.05, 0.62], [1.6, 1.25], [2.15, 0.66], [2.55, 1.25]], OFF = [[0.22, 0.2], [0.22, 0.24], [0.22, 0.22], [0.24, 0.24], [0.2, 0.18]];
  const def = add('isle1', 'il1_saplings', {name: 'Stumps → saplings', foot: [3, 2], h: 48, kind: 'thing', block: true, variants: 2,
    states: ST, state: 't0', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.5, 1.95, 0], touchAt: [1.6, 1.4, 10], shadowA: 0.04, tags: ['border', 'camps', 'trees', 'plant', 'balance', 'island1'],
    diffs: [{by: 'state', a: 't0', b: 't5', level: 'bold', name: 'bare stumps / 5 saplings + flowers'}, {by: 'state', a: 't2', b: 't3', level: 'small', name: 'one more sapling'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), n = Math.max(0, ST.indexOf(L.state || 't0')), live = !still && !ruined;
    B.custom(1.5, 1, (g, P, k, t) => { path(g, blob(P, 1.5, 1.0, 1.48, 0.98, 0, 30, 25 + v, 0.03)); g.fillStyle = ruined ? '#A8946A' : '#B9946A'; g.fill();
      // green comes back around each sapling
      SP.forEach(([x, y], i) => { if(i >= n || dry) return; path(g, blob(P, x + 0.1, y + 0.1, 0.4, 0.32, 0, 14, i + v, 0.12)); g.fillStyle = ruined ? '#8A9A5A' : '#7CC15A'; g.fill(); });
      if(n === 5 && !dry && !ruined){ path(g, blob(P, 1.5, 1.0, 1.2, 0.7, 0, 22, 2, 0.1)); g.fillStyle = 'rgba(124,193,90,0.8)'; g.fill(); }
      const R = D.rnd(3 + v); if(n < 3) for(let i = 0; i < 30 - n * 10; i++){ const q = P(0.3 + R() * 2.4, 0.3 + R() * 1.4, 0); oval(g, q[0], q[1], 1.2 * k, 0.6 * k, R() * 3, '#E2C68A'); } }, {layer: -2});
    // the compost bin (back-left): a woven basket + a tin lid
    B.drum(0.32, 0.32, 0, 0.2, 14, '#B98A4A', {rings: 4, layer: 1, topFill: '#5A4030'}); B.custom(0.32, 0.32, (g, P, k) => { const c = P(0.32, 0.32, 15); g.fillStyle = METAL; g.beginPath(); g.ellipse(c[0] + 3 * k, c[1] - 1 * k, 8 * k, 3.6 * k, 0.15, 0, TAU); g.fill(); dot(g, c[0] + 3 * k, c[1] - 2.4 * k, 1.4 * k, DARKM); }, {layer: 2});
    // 5 stumps + their saplings
    SP.forEach(([x, y], i) => { B.drum(x, y, 0, 0.16, 8 + (i % 2) * 3, v ? '#9A6A3E' : '#8A5A34', {layer: 1, topFill: '#E2B07A'});
      if(i >= n) return; B.bill(x + OFF[i][0], y + OFF[i][1], 0, (g, X, Y, k0, t) => { const k = k0 * 1.45; const a = live ? ph(t, 2.4) : 0, newest = i === n - 1 && n < 5, bob = newest ? Math.sin(a * 2) * 0.12 + Math.cos(a) * 0.05 : Math.sin(a + i) * 0.04, droop = dry ? 0.5 : 0, H = 14 + (5 - i) * 0 + (n - i) * 1.4;
        oval(g, X, Y, 7 * k, 3 * k, 0, '#5A4030'); oval(g, X - 2 * k, Y - 0.6 * k, 2 * k, 0.8 * k, 0, '#7A5A40'); if(ruined){ g.strokeStyle = BAMBOO; g.lineWidth = 1.4 * k; ln(g, [X + 3 * k, Y], [X + 9 * k, Y - 3 * k]); return; }
        g.strokeStyle = BAMBOO; g.lineWidth = 1.4 * k; ln(g, [X + 3 * k, Y], [X + 3 * k, Y - (H + 4) * k]); g.strokeStyle = v ? '#E2502E' : '#3E8EF0'; g.lineWidth = 1.2 * k; ln(g, [X + 3 * k, Y - H * 0.6 * k], [X + 0.6 * k, Y - H * 0.6 * k]);
        g.strokeStyle = '#6E5A2A'; g.lineWidth = 1.3 * k; g.beginPath(); g.moveTo(X, Y); g.quadraticCurveTo(X - 1 * k, Y - H * 0.5 * k, X + bob * 6 * k, Y - H * k); g.stroke();
        const tip = [X + bob * 6 * k, Y - H * k]; [[-1, 0.5], [1, 0.4], [0, 0]].forEach(([s, f], j) => { const q = [tip[0] + s * 3 * k, tip[1] + f * H * 0.3 * k]; oval(g, q[0], q[1] + droop * 3 * k, 4 * k, 2 * k, s * (0.6 + droop) + bob, dry ? '#B8A04A' : j ? '#4CAE3E' : '#6AC04E'); }); }, {layer: 2}); });
    // t5: flower clumps between the saplings
    if(n === 5 && !dry && !ruined) [[0.8, 1.7], [1.35, 1.05], [2.4, 1.15], [1.9, 1.75]].forEach(([x, y], i) => B.bill(x, y, 0, (g, X, Y, k) => { for(let f = 0; f < 3; f++){ const fx = X + (f - 1) * 3.4 * k, fy = Y - 4 * k - (f % 2) * 2 * k; g.strokeStyle = '#4CAE3E'; g.lineWidth = 0.8 * k; ln(g, [fx, Y], [fx, fy]); for(let p = 0; p < 5; p++){ const an = p / 5 * TAU; dot(g, fx + Math.cos(an) * 1.4 * k, fy + Math.sin(an) * 1.4 * k, 1 * k, ['#FF7A9A', '#FFFFFF', '#FFD23F', '#B28AFF'][(i + f) % 4]); } dot(g, fx, fy, 0.7 * k, '#FFB43A'); } }, {layer: 2}));
    // fx: t0 sawdust blows · t1–t4 a watering sparkle on the newest sapling · t5 a bird hops between them
    if(ruined) return;
    B.custom(1.5, 1, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3;
      if(n === 0){ for(let i = 0; i < 4; i++){ const f = (u + i / 4) % 1, q = P(0.4 + f * 2.2, 1.0 + Math.sin(i * 2) * 0.4, 2 + Math.sin(f * Math.PI) * 8); dot(g, q[0], q[1], 1 * k, 'rgba(226,198,138,' + (Math.sin(Math.PI * f) * 0.9).toFixed(3) + ')'); } return; }
      if(n < 5){ const [x, y] = SP[n - 1], q = P(x + OFF[n - 1][0], y + OFF[n - 1][1], 34); for(let i = 0; i < 3; i++){ const f = (u * 1.5 + i / 3) % 1; dot(g, q[0] - 2 * k + i * 2 * k, q[1] + f * 18 * k, 1 * k, 'rgba(120,200,255,' + (1 - f).toFixed(3) + ')'); } twinkle(g, q[0] + 4 * k, q[1] + 6 * k, (1 + 2 * Math.sin(Math.PI * u)) * k, 0.8 * Math.sin(Math.PI * u), '#E6FBFF'); return; }
      const seg = Math.floor(u * 4), f = (u * 4) % 1, A0 = SP[seg], A1 = SP[seg + 1], q = P(A0[0] + 0.22 + (A1[0] - A0[0]) * f, A0[1] + 0.3 + (A1[1] - A0[1]) * f, Math.sin(f * Math.PI) * 10), dir = A1[0] > A0[0] ? 1 : -1; g.save(); g.translate(q[0], q[1]); g.scale(dir * k, k);
      oval(g, 0, -3, 3, 2.4, -0.2, '#8A5A3A'); dot(g, 2.4, -5.4, 1.9, '#8A5A3A'); oval(g, 0.4, -2.6, 1.6, 1.2, 0, '#F2C2A0'); g.fillStyle = '#F2C230'; g.beginPath(); g.moveTo(4.2, -5.6); g.lineTo(6, -5.2); g.lineTo(4.2, -4.8); g.fill(); dot(g, 2.9, -6, 0.5, '#FFFFFF'); g.restore(); }, {fx: true, layer: 9});
  }; })();

/* ───────────── ⚖️ BORDER ⑰ 🧰 DRILL-BROKEN FENCE → PATCHED (3 × 1, `il1_drillfence`, c8 "Patch the Fence" — 🤖 fixes what the ⚙️ Mega Drill broke, with a 🦖 raptor's help) ─────────────
   The border fence: bamboo posts + rails. broken (default): a big round HOLE drilled through the middle — splintered rail ends, a spiral of drill grooves in the ground, the drill's
   broken tip left behind, 2 warning sticks with a yellow-black ribbon · ✨ a loose rail swings + creaks, the ribbon flutters · patched: new rails fill the hole, tied with BOTH camps'
   knots — a raptor vine lashing + a bolted iron bracket — and a flower grows where the grooves were · ✨ a little ribbon bow on the patched post flutters, a glint on the bolt.
   it.stand = in front of the hole. 🍂 dry = pale bamboo · 🏚️ ruined = most rails down. Game: Props.setState(it, 'patched', map). */
(function(){ const ST = ['broken', 'patched'];
  const def = add('isle1', 'il1_drillfence', {name: 'Drill-broken fence', foot: [3, 1], h: 36, kind: 'fence', block: true, variants: 2,
    states: ST, state: 'broken', liveStates: ST, live: {period: 2.4, frames: 6}, stand: [1.5, 0.95, 0], touchAt: [1.5, 0.5, 16], shadowA: 0.03, tags: ['border', 'camps', 'fence', 'drill', 'peace', 'island1'],
    diffs: [{by: 'state', a: 'broken', b: 'patched', level: 'bold', name: 'drilled hole / patched with both knots'}]});
  def.build = (B, v, L) => { const {ruined, dry, still} = flags(L.cond), fix = (L.state || 'broken') === 'patched', live = !still && !ruined, BAM = dry ? '#D8C890' : v ? '#B8C860' : BAMBOO, Y0 = 0.5;
    B.custom(1.5, 0.5, (g, P, k) => { path(g, blob(P, 1.5, 0.5, 1.5, 0.46, 0, 26, 27 + v, 0.04)); g.fillStyle = ruined ? '#A8A06A' : '#8CC460'; g.fill();
      if(!fix){ const c = P(1.5, 0.62, 0); g.fillStyle = '#8A6A44'; g.beginPath(); g.ellipse(c[0], c[1], 18 * k, 8 * k, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(60,40,24,0.55)'; g.lineWidth = 1 * k; g.beginPath(); for(let i = 0; i <= 60; i++){ const an = i / 60 * TAU * 3, r = 2 + i / 60 * 15; i ? g.lineTo(c[0] + Math.cos(an) * r * k, c[1] + Math.sin(an) * r * 0.45 * k) : g.moveTo(c[0], c[1]); } g.stroke(); }
      else { const c = P(1.5, 0.62, 0); g.fillStyle = '#7A5A3A'; g.beginPath(); g.ellipse(c[0], c[1], 10 * k, 4.4 * k, 0, 0, TAU); g.fill(); } }, {layer: -2});
    // posts (one per tile edge + 2 by the hole) · ruined = 2 down
    [[0.06], [0.98], [2.02], [2.94]].forEach(([x], i) => B.box(x - 0.05, Y0 - 0.05, 0, 0.1, 0.1, ruined && i === 2 ? 14 : 32, BAM, {topFill: BAMBOO_D, layer: 1}));
    // rails: 2 runs left + right of the hole · patched: new rails across (a fresher green) · broken: splintered ends + one loose rail swinging
    B.custom(1.5, Y0, (g, P, k, t) => { const a = live ? ph(t, 2.4) : 0.3, rail = (x0, x1, z, col) => { g.strokeStyle = col; g.lineWidth = 2.6 * k; g.lineCap = 'round'; ln(g, P(x0, Y0, z), P(x1, Y0, z)); g.strokeStyle = NODE; g.lineWidth = 2.6 * k; g.lineCap = 'butt'; for(let x = x0 + 0.3; x < x1 - 0.1; x += 0.45){ ln(g, P(x, Y0, z), P(x + 0.02, Y0, z)); } };
      [12, 24].forEach(z => { rail(0.06, ruined ? 0.6 : 1.12, z, BAM); rail(ruined ? 2.4 : 1.88, 2.94, z, BAM); });
      if(fix){ [12, 24].forEach(z => rail(1.0, 2.0, z, dry ? '#C8C080' : '#A8D060')); return; }
      if(ruined) return;
      [[1.12, 12, 1], [1.12, 24, 1], [1.88, 12, -1], [1.88, 24, -1]].forEach(([x, z, s]) => { const e = P(x, Y0, z); g.fillStyle = BAM; for(let i = 0; i < 3; i++){ g.beginPath(); g.moveTo(e[0], e[1] - 1.4 * k + i * 1.4 * k); g.lineTo(e[0] + s * (4 + i * 1.6) * k, e[1] - 2 * k + i * 1.8 * k); g.lineTo(e[0], e[1] - 0.6 * k + i * 1.4 * k); g.closePath(); g.fill(); } });
      const piv = P(1.12, Y0, 24), sw = 0.5 + Math.sin(a) * 0.18 + Math.cos(a * 2) * 0.06; g.save(); g.translate(piv[0], piv[1]); g.rotate(sw); g.strokeStyle = BAM; g.lineWidth = 2.6 * k; g.lineCap = 'round'; ln(g, [0, 0], [16 * k, 0]); g.restore(); }, {layer: 2});
    // broken: the drill's snapped tip in the grooves + 2 warning sticks with a yellow-black ribbon
    if(!fix && !ruined){ B.bill(1.62, 0.72, 0, (g, X, Y, k) => { g.save(); g.translate(X, Y - 3 * k); g.rotate(-0.5); const L2 = 13 * k; g.fillStyle = '#8E949E'; g.beginPath(); g.moveTo(-L2, -3.6 * k); g.lineTo(0, -3 * k); g.lineTo(L2 * 0.6, 0); g.lineTo(0, 3 * k); g.lineTo(-L2, 3.6 * k); g.closePath(); g.fill();
        g.strokeStyle = '#55596A'; g.lineWidth = 1 * k; for(let i = 0; i < 5; i++){ const x = -L2 + i * 4 * k; ln(g, [x, -3.4 * k], [x + 3 * k, 3.4 * k]); } g.fillStyle = '#C8CED8'; g.beginPath(); g.moveTo(-L2, -3.6 * k); g.lineTo(-L2 - 2 * k, -1 * k); g.lineTo(-L2 + 1 * k, 0); g.lineTo(-L2 - 2 * k, 2 * k); g.lineTo(-L2, 3.6 * k); g.closePath(); g.fill(); g.restore(); }, {layer: 2});
      B.custom(1.5, 0.82, (g, P, k, t) => { const a = live ? ph(t, 2.4) : 0.3, s1 = P(1.1, 0.86, 0), s2 = P(1.9, 0.86, 0); [s1, s2].forEach(s => { g.strokeStyle = '#8A5A34'; g.lineWidth = 1.6 * k; ln(g, s, [s[0], s[1] - 22 * k]); });
        const pts = []; for(let i = 0; i <= 12; i++){ const f = i / 12, fl = Math.sin(a * 2 + i * 0.8) * 1.2 * k + Math.cos(a + i) * 0.5 * k; pts.push([s1[0] + (s2[0] - s1[0]) * f, s1[1] - 18 * k + (s2[1] - s1[1]) * f + Math.sin(f * Math.PI) * 4 * k + fl]); }
        for(let i = 0; i < 12; i++){ g.strokeStyle = i % 2 ? YEL : BLK; g.lineWidth = 2.4 * k; ln(g, pts[i], pts[i + 1]); } }, {layer: 3}); }
    // patched: the vine lashing (🦖) on the left post + the bolted iron bracket (🤖) on the right + a flower in the grooves
    if(fix && !ruined){ B.custom(1.0, Y0, (g, P, k) => { [12, 24].forEach(z => { const q = P(1.0, Y0, z); g.strokeStyle = dry ? '#A8904A' : '#3E7A2E'; g.lineWidth = 1.4 * k; for(let i = -1; i <= 1; i++){ g.beginPath(); g.ellipse(q[0] + i * 1.4 * k, q[1], 2 * k, 3.4 * k, 0.4, 0, TAU); g.stroke(); } oval(g, q[0] + 4 * k, q[1] + 3 * k, 2.4 * k, 1.2 * k, 0.6, '#5DBE48'); }); claw3(g, P(1.0, Y0, 30)[0], P(1.0, Y0, 30)[1], 2.2 * k, AMB); }, {layer: 3});
      B.custom(2.0, Y0, (g, P, k) => { [12, 24].forEach(z => { const q = P(2.0, Y0, z); g.fillStyle = METAL; g.fillRect(q[0] - 4 * k, q[1] - 2.6 * k, 8 * k, 5.2 * k); g.strokeStyle = 'rgba(42,28,20,0.35)'; g.lineWidth = 0.6 * k; g.strokeRect(q[0] - 4 * k, q[1] - 2.6 * k, 8 * k, 5.2 * k); [-2.4, 2.4].forEach(d => dot(g, q[0] + d * k, q[1], 1 * k, DARKM)); }); zap(g, P(2.0, Y0, 30)[0], P(2.0, Y0, 30)[1], 2.4 * k, YEL); }, {layer: 3});
      B.bill(1.5, 0.66, 0, (g, X, Y, k) => { g.strokeStyle = '#4CAE3E'; g.lineWidth = 1 * k; ln(g, [X, Y], [X, Y - 8 * k]); oval(g, X - 2 * k, Y - 4 * k, 2 * k, 1 * k, -0.5, '#5DBE48'); for(let p = 0; p < 6; p++){ const an = p / 6 * TAU; dot(g, X + Math.cos(an) * 2 * k, Y - 9 * k + Math.sin(an) * 2 * k, 1.4 * k, v ? '#B28AFF' : '#FF7A9A'); } dot(g, X, Y - 9 * k, 1 * k, '#FFD23F'); }, {layer: 2}); }
    // fx: patched = a ribbon bow on the middle of the new rail flutters + a glint on the bolt
    if(ruined || !fix) return;
    B.custom(1.5, Y0, (g, P, k, t) => { const u = live ? cyc(t, 2.4) : 0.3, a = live ? ph(t, 2.4) : 0.3, q = P(1.5, Y0, 24), fl = Math.sin(a * 2) * 1.4 * k + Math.cos(a) * 0.6 * k; g.fillStyle = v ? '#3FB8A8' : AMB; g.beginPath(); g.ellipse(q[0] - 2.6 * k, q[1], 2.6 * k, 1.6 * k, 0.4, 0, TAU); g.ellipse(q[0] + 2.6 * k, q[1], 2.6 * k, 1.6 * k, -0.4, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(q[0] - 2 * k + fl, q[1] + 7 * k); g.lineTo(q[0] - 0.4 * k + fl, q[1] + 6 * k); g.closePath(); g.fill(); g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(q[0] + 2.4 * k + fl, q[1] + 7 * k); g.lineTo(q[0] + 0.8 * k + fl, q[1] + 6 * k); g.closePath(); g.fill();
      const b = P(2.0, Y0, 24); twinkle(g, b[0] + 2.4 * k, b[1] - 1 * k, (1 + 2.2 * Math.sin(Math.PI * u)) * k, 0.9 * Math.sin(Math.PI * u), '#FFFFFF'); }, {fx: true, layer: 9});
  }; })();
K.loaded('isle1b', 'ip-10');
})(window.Props && window.Props._K);
