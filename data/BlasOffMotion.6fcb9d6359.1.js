
/* ⚽ BlasOffMotion (bo-mo, ⚽ BlasOff chat 2026-11-21) — the shared 🎬 Motion engine inside BlasOff, kept OUT of BlasOff.html (413 KB — 📏 born split).
   Built from Test Harness/blasoff-build/motion.js by build.py (edit this, never BlasOffMotion.html). Code.gs INCLUDE_ALSO_ BlasOffFrame → BlasOffMotion (0 bytes in BlasOff.html).
   LOOKS ONLY (plan §41 golden rule): the engine BO keeps every beat time, position, the ball and the robot balance — this part only draws differently.
   It wraps a few page functions (drawPlayer · actFrame · playerKey · sprite · drawTrail · drawFrame · handleEvents) and calls ONLY shared engine calls:
     💥 tackled            Motion.hit blunt (slide = heavy) → 🤍 flash + burst + a tiny freeze of THAT body, never on the face
     🤕 the fall           Motion.knock hop (× 0.6) + dust — the engine keeps the spot
     🦘 landings           Motion.landInfo by the real jump height → squash + hold + recover, a ground puff (+ ring ≥ 2 m)
     🧤 keeper             Motion.hit fist pop at the ball (catch = small) — FX only
     🌀 roulette           🧊 MotionTurn yaw sweep (head leads, chest, hips last) → front → ¾ → BACK → ¾ → front, 8 pictures
     🧭 run + stand views  🧊 MotionTurn: running AWAY = back (↗ 135°), toward / across = front (↘ 45°) · acts keep today's picture
     🫁 waiting players    Motion.aliveLoop: one calm breath + one blink, 6 cached pictures a player, never in sync
     🧣 YOUR player        drawn LIVE (≤ 2 ms): Motion.hang hair / capes trail · 🔨 Motion.charge glow at the KICKING FOOT while J / K is held
     💨 kicks              the kick acts get weight + 💨 smear from the kicking foot ({from: 'footL'}) · robots {side: 'enemy'} = ⚡ wind-up glow (a tell)
     🌿 the ground         Motion.ground on the pitch look (grass · moon dust · metal · arena floor): steps, slides, skids, landings
   🎬 bo-mo2 (Aowu 00:17 "go"): KICKS turned like running — away = back ↗ 135°, toward / across = front ↘ 45° · small foot TRICKS turned only toward you (away = side picture) · bicycle · flip · roulette keep their own spin
   🦶 bo-mo2: YOUR player leaves light prints when running (grass 1.5 s · moon dust 4 s · metal / arena floor none) — never the robots, never bits
   🎬 bo-mo3 (Aowu 00:42 "A then B" · 00:55 "go"): HEADERS turned both ways · chest / thigh / sole TRAPS turned only toward you (from behind a trap reads as standing) · 🧤 the KEEPER's punt / throw / roll + goal kick turned too (dives + diving header keep their own flight)
   🌙 bo-mo4 (Aowu 00:42 "A then B"): NIGHT match — YOUR prints glow (cool blue-white, 2 s, added light) instead of the grass print — robots / friends never, none in 🌱 calm (Aowu 01:19 "go": no light circle — the floodlit pitch stays bright, your yellow ring already shows you)
   🌱 Basic + reduced motion = {calm: true}. window.BoMotion = {on, version, stats(), off()} · tests: Test Harness/bomo.js */
(function boMotion(){
  'use strict';
  if(typeof GAME_ID === 'undefined' || GAME_ID !== 'blasoff' || !window.Motion || !window.Acting) return;
  if(typeof drawPlayer !== 'function'){   /* 📏 s-bo: online the painter comes with BlasOff_play — a waiting BoMotion now, the main page's boLate() installs the real one then */
    window.BoMotion = {version: 'bo-mo', pending: true, on: true, install: boMotion, off(){ this.on = false; }, clock(){}, stats: () => ({pending: true})}; return; }
  const VERSION = 'bo-mo4';
  const U = 74 / 1.75;                     // avatar units per metre (a player is 1.75 m = 74 units, page.js k = s × 1.75 / 74)
  const TAU = Math.PI * 2, cl = (v, a, b) => v < a ? a : v > b ? b : v;
  const reduced = (() => { try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } })();
  const BM = {turnActs: true, prints: true, glow: true, on: true, version: VERSION, st: new Map(), fx: [], bakes: 0, frameT: -1, ms: [], liveMs: 0};
  const calm = () => reduced || !!(G && G.level === 0);
  const now = () => BM.clock ? BM.clock() : performance.now() / 1000;   // tests / look tests may set BoMotion.clock(fn)
  const S = p => { let s = BM.st.get(p); if(!s){ s = {z: 0, zMax: 0, view: 'SE', hang: null, live: null, loop: null, ph: 0}; BM.st.set(p, s); } return s; };
  const seedOf = str => { let h = 7; for(let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100003; return h; };

  // 😊 where the head sits in a sprite (avatar units above the feet) — measured once from AvatarKit, so FX never sit on a face
  let HEAD = null;
  function headY(){
    if(HEAD) return HEAD; HEAD = {y: 60, r: 22};
    try{ const c = document.createElement('canvas'); c.width = 120; c.height = 140; const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 60, 130);
      drawAvatar(g, {name: 'x', av: defaultAvatar('x'), dir: 1, walkT: 0}, 0, 0, 1, {t: 0, still: true});
      const h = window.AK && AK.head; if(h && h.m){ const p = new DOMMatrix([1, 0, 0, 1, 60, 130]).inverse().multiply(h.m).transformPoint({x: 0, y: h.hy}); HEAD = {y: -p.y, r: 22 * (h.k || 1)}; } }catch(e){}
    return HEAD;
  }

  /* ---------- 💨 the kick acts: weight + smear from the kicking foot (legL = the front / kicking leg in 🎭 BLOCK blasoff) · robots ⚡ glow ---------- */
  const KICKS = {shot: 'medium', blast: 'heavy', volley: 'medium', bicycle: 'heavy', curl: 'medium', chip: 'light', loft: 'medium', pass: 'light', rabona: 'medium', gkpunt: 'medium'};
  /* 🎬 bo-mo2: kicks + tricks get the same 2.5D turn as running (key '^NE' / '^SE', the yaw added to the act's own pose) */
  const TURN_ACTS = {shot: 1, blast: 1, volley: 1, curl: 1, chip: 1, loft: 1, pass: 1, rabona: 1, nutmeg: 1, stepover: 1, elastico: 1, rainbow: 1, heel: 1, nolook: 1,
    header: 1, trapc: 1, trapt: 1, traps: 1, gkpunt: 1, gkthrow: 1, gkroll: 1};   /* 🎬 bo-mo3: headers · traps · keeper distribution (dheader · gkdive · gkhigh keep the page's own flight) */
  const TOWARD_ONLY = {nutmeg: 1, stepover: 1, elastico: 1, rainbow: 1, heel: 1, nolook: 1, trapc: 1, trapt: 1, traps: 1};   // 🫳 bo-mo3 Aowu Q2 (00:55 "go"): the traps too — from behind a trap reads as standing · 🕺 Aowu Q2 (00:17): small foot tricks turn only when coming TOWARD you — from behind the feet hide, so AWAY keeps the side picture
  const GK_TURN = {gkpunt: 1, gkthrow: 1, gkroll: 1, pass: 1, loft: 1};   // 🧤 bo-mo3: the keeper turns only when it plays the ball out (punt · throw · roll · goal kick) — saves stay side-on
  function turnOf(p, act){ if(!BM.turnActs || !act || !TURN_ACTS[act] || (p.gk && !GK_TURN[act])) return null; const v = S(p).view; if(v === 'NE' && TOWARD_ONLY[act]) return null; return v === 'NE' || v === 'SE' ? v : null; }
  const FACE_TURN = {fierce: 'focused', effort: 'focused'};   // the teeth faces smear on a turned head (look test bo-mo2) → a clear face; side pictures keep theirs
  function yawed(f, v){ if(!f) return f; const T = Motion.turnView(v, 1); if(!T) return f; const pose = Object.assign({}, f.pose);
    ['hipYaw', 'chestYaw', 'headYaw'].forEach(k => { pose[k] = (pose[k] || 0) + T[k]; }); const o = Object.assign({}, f, {pose}); if(FACE_TURN[o.face]) o.face = FACE_TURN[o.face]; return o; }
  const MO_ACT = {};   // 'shot' → 'blasoff.shot~mo' (a copy with weight + smear on the contact beat, registered once)
  function moAct(key){
    if(MO_ACT[key] !== undefined) return MO_ACT[key];
    let out = null; try{ const A = Acting.get && Acting.get('acts', 'blasoff.' + key); if(A && KICKS[key]){ const A2 = JSON.parse(JSON.stringify(A)); delete A2.by; delete A2.block;
      A2.weight = KICKS[key]; A2.drag = false; A2.lag = false; A2.reach = 26; const cb = (A2.beats || []).find(b => b.contact); if(cb) cb.smear = KICKS[key] === 'heavy' ? 'heavy' : KICKS[key] === 'light' ? 'light' : true;
      if(key === 'blast') A2.element = 'fire';
      Acting.add({acts: {['blasoff.' + key + '~mo']: A2}}, {by: '⚽ BlasOff chat', block: 'blasoff'}); out = 'blasoff.' + key + '~mo'; } }catch(e){ out = null; }
    return (MO_ACT[key] = out);
  }
  const RUN2 = {};
  function moRun(key, enemy){
    const id = key + (enemy ? '~e' : '~p'); if(RUN2[id] !== undefined) return RUN2[id]; let r = null;
    try{ const k2 = moAct(key); if(k2) r = Acting.play({name: ''}, k2, {t0: 0, from: 'footL', side: enemy ? 'enemy' : 'player', calm: calm(), fx: key === 'blast', element: key === 'blast' ? 'fire' : undefined}); }catch(e){ r = null; }
    return (RUN2[id] = r);
  }
  const isRobot = p => p && G && p.ctrl < 0 && !G.M.ctrls.some(c => c.side === p.side);
  const af0 = window.actFrame;
  window.actFrame = function(p, o){
    if(!BM.on) return af0.apply(this, arguments);
    const act = o ? o.act : p.act;
    if(act === 'roulette~3d' && !o){   // 🌀 a TRUE turn: 8 pictures across the spin beat (yaw sweep, the head leads)
      const ANG = [0, 50, 130, 180, 230, 310, 360], q = cl(p.bq || 0, 0, 1) * 360, q8 = ANG.reduce((a, b) => Math.abs(b - q) < Math.abs(a - q) ? b : a) / 360, key = 'A:roulette~yaw:' + q8;   // 6 pictures, never the paper-thin 90° side if(G.spr[p.i][key]) return {key};
      const R = actRun('roulette'); if(!R) return af0.apply(this, arguments); const f = R.at((R.start[3] + R.D[3].ms * q8) / 1000), a = q8 * TAU;
      f.pose = Object.assign({}, f.pose, {hipYaw: a, chestYaw: a + 0.18 * Math.sin(Math.PI * q8), headYaw: a + 0.42 * Math.sin(Math.PI * q8), sx: 1}); return {key, f};
    }
    const v = turnOf(p, act), suf = v ? '^' + v : '';
    if(act && KICKS[act] && !(o && o.bi === 1 && BM.live === p)){
      const en = isRobot(p), R = moRun(act, en);
      if(R){ const i = Math.min(o ? o.bi : (p.bi || 0), R.beats.length - 1), q = Math.round(cl(o ? o.bq : (p.bq || 0), 0, 1) * 4) / 4, key = 'A:' + act + (en ? '~e:' : '~p:') + i + ':' + q + suf;
        if(G.spr[p.i][key]) return {key}; const f = R.at((R.start[i] + R.D[i].ms * q) / 1000); return {key, f: suf ? yawed(f, v) : f}; }
    }
    if(!suf) return af0.apply(this, arguments);
    { const R = actRun(act); if(!R) return null;   // 🎬 the page's own act, turned (same beat + quarter steps as the page)
      const i = Math.min(o ? o.bi : (p.bi || 0), R.beats.length - 1), q = Math.round(cl(o ? o.bq : (p.bq || 0), 0, 1) * 4) / 4, key = 'A:' + act + ':' + i + ':' + q + suf;
      if(G.spr[p.i][key]) return {key}; return {key, f: yawed(R.at((R.start[i] + R.D[i].ms * q) / 1000), v)}; }
  };

  /* ---------- 🧭 views + 🫁 alive: run / stand pictures get a view (and a breath step) in their key ---------- */
  const BACK = {N: 1, NE: 1, NW: 1};
  const pk0 = window.playerKey;
  window.playerKey = function(p){
    const key = pk0.apply(this, arguments); if(!BM.on || !G || !V) return key;
    const run = /^run\d$/.test(key), stand = key === 'stand'; if(!run && !stand) return key;
    const s = S(p), back = s.view === 'NE';
    if(stand && !p.gk){ const L = s.loop || (s.loop = Motion.aliveLoop({name: p.name, av: G.avs[p.i]}, {secs: 3.2, frames: 6, seed: p.name + ':' + p.i})); const u = ((now() + (seedOf(p.name + p.i) % 97) / 30) / L.secs) % 1;
      return 'stand' + (back ? '@NE' : '@SE') + '~a' + Math.round(u * 6) % 6; }
    return key + (back ? '@NE' : '@SE');
  };
  const sp0 = window.sprite;
  let bakesThisFrame = 0;
  window.sprite = function(i, key, fr){
    const box = G.spr[i]; if(box[key] || key.indexOf('@') < 0) return sp0.apply(this, arguments);
    // a turned picture costs ≈ 6 ms to bake → at most 2 a frame; until then today's picture shows (no hitch)
    const base = key.split('@')[0]; if(bakesThisFrame >= 2) return sp0.call(this, i, base === 'stand' ? 'stand' : base, fr); bakesThisFrame++; BM.bakes++;
    const Q = G.sq, c = document.createElement('canvas'); c.width = Math.round(SPR_W * Q); c.height = Math.round(SPR_H * Q); const g = c.getContext('2d'); g.scale(Q, Q);
    const p = G.M.players[i], view = key.split('@')[1].slice(0, 2), T = Motion.turnView(view, 1), who = {name: p.name, av: G.avs[i], dir: 1, walkT: 0};
    try{
      if(base === 'stand'){ const L = S(p).loop, n = +key.split('~a')[1] || 0, f = L ? L.at(n / 6) : {pose: {}, act: {}, id: 'st'}; f.pose = Object.assign({}, f.pose, T); Acting.draw(g, who, SPR_FX, SPR_FY, 1, f, {t: 0, dir: 1}); }
      else { who.walkT = 0.01 + (+base.slice(3)) * (Math.PI * 2 / 11) / 4; drawAvatar(g, who, SPR_FX, SPR_FY, 1, {t: 0, still: true, pose: Object.assign({}, T)}); }
    }catch(e){ BM.err = String(e && e.message || e); try{ drawAvatar(g, who, SPR_FX, SPR_FY, 1, {t: 0, still: true}); }catch(e2){} }
    SPR_LRU.push([i, key]); while(SPR_LRU.length > SPR_CAP){ const [j, kk] = SPR_LRU.shift(); if(G.spr[j]) delete G.spr[j][kk]; }
    box[key] = c; return c;
  };

  /* ---------- 🧣 YOUR player drawn live: hang + 🔨 charge (the page's sprite() is asked for a picture → we paint it fresh, never cached) ---------- */
  const LIVE = {c: null};
  function liveCanvas(){ const Q = G.sq, w = Math.round(SPR_W * Q), h = Math.round(SPR_H * Q); if(!LIVE.c || LIVE.c.width !== w || LIVE.c.height !== h){ LIVE.c = document.createElement('canvas'); LIVE.c.width = w; LIVE.c.height = h; } return LIVE.c; }
  function paintLive(p, key, fr, t){
    const s = S(p), c = liveCanvas(), g = c.getContext('2d'), Q = G.sq; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height); g.scale(Q, Q);
    const who = {name: p.name, av: G.avs[p.i], dir: 1, walkT: 0}, T = /@/.test(key) ? Motion.turnView(key.split('@')[1].slice(0, 2), 1) : null, o = {t, hang: s.hang, dir: 1};
    try{
      if(s.charge){ const cf = s.charge.at(t), v = turnOf(p, s.chargeKey); Acting.draw(g, who, SPR_FX, SPR_FY, 1, v ? yawed(cf, v) : cf, o); return c; }
      if(fr){ Acting.draw(g, who, SPR_FX, SPR_FY, 1, fr, o); return c; }
      const base = key.split('@')[0];
      if(base === 'stand'){ const L = s.loop, n = +key.split('~a')[1] || 0, f = L ? L.at(n / 6) : {pose: {}, act: {}, id: 'st'}; if(T) f.pose = Object.assign({}, f.pose, T); Acting.draw(g, who, SPR_FX, SPR_FY, 1, f, o); return c; }
      if(/^run\d$/.test(base)) who.walkT = 0.01 + (+base.slice(3)) * (Math.PI * 2 / 11) / 4;
      drawAvatar(g, who, SPR_FX, SPR_FY, 1, {t, still: true, hang: s.hang, pose: T ? Object.assign({}, T) : undefined});
    }catch(e){ BM.err = String(e && e.message || e); return null; }
    return c;
  }
  const sp1 = window.sprite;
  window.sprite = function(i, key, fr){
    const p = BM.live; if(BM.on && p && p.i === i){ const t0 = performance.now(), c = paintLive(p, key, fr, now()); BM.liveMs = Math.max(BM.liveMs * 0.9, performance.now() - t0); if(c) return c; }
    return sp1.apply(this, arguments);
  };
  // 🔨 hold J / K = the charge glow at the KICKING foot (the engine's back-lift time is the clock: release = the kick)
  function chargeOf(p, t){
    const s = S(p), c = G.M.ctrls.find(x => x.pi === p.i), M = G.M;
    const holding = c && M.ball.owner === p.i && M.phase === 'play' && !p.act && (c.kAt >= 0 || c.jAt >= 0);
    if(holding && !s.charge){ const shoot = c.kAt >= 0, key = shoot ? (c.star >= 1 ? 'blast' : 'shot') : 'pass', k2 = moAct(key) || 'blasoff.' + key;
      try{ s.charge = Motion.charge({name: p.name, av: G.avs[p.i]}, k2, {t0: t, from: 'footL', calm: calm(), fx: key === 'blast', element: key === 'blast' ? 'fire' : undefined}); s.chargeKey = key; }catch(e){ s.charge = null; } }
    if(!holding && s.charge){ try{ s.charge.release(t); }catch(e){} s.charge = null; }
  }

  /* ---------- 🌿 the ground: Motion.ground with a reader on BlasOff's own camera (world metres → avatar units) ---------- */
  const MATS = {classic: 'soft', jungle: 'soft', underwater: 'soft', olympus: 'soft', neon: 'room', robot: 'hard', moon: 'loose'};
  let GR = null, GRkey = '';
  function groundFor(){
    const key = G.theme + (G.Sz.court ? ':court' : ''); if(GR && GRkey === key) return GR; GRkey = key;
    const Lk = LOOKS[G.theme] || LOOKS.classic, mat = G.Sz.court ? (G.theme === 'classic' ? 'room' : 'hard') : (MATS[G.theme] || 'soft'), col = (G.Sz.court ? Lk.court : Lk.grass)[0];
    const R = {kind: 'blas', at: () => ({mat, tile: mat, h: 0, col}), clear(){},
      scr: (v, x, y, z) => { const q = V && V.P(x / U, y / U, (z || 0) / U); return q ? {x: q[0], y: q[1]} : {x: -9999, y: -9999}; },
      kpx: () => BM.kpx || 0.6,
      offW: (v, dx, dy) => [dx / (BM.kpx || 0.6), dy / (BM.kpx || 0.6) * 2],
      dirS: (dx, dy) => { if(!V) return [dx, dy * 0.35]; const a = V.P(0, 0, 0), b = V.P(dx / U, dy / U, 0); return a && b ? [b[0] - a[0], (b[1] - a[1]) * 0.35] : [dx, dy * 0.35]; }};   // the ground is seen flat (prints lie down)
    GR = Motion.ground(R, {calm: calm(), reduced, near: 4, k: 0.6, seed: 11}); GR.__reader = R;
    return GR;
  }

  /* ---------- the events: who is hit, who falls, who saves ---------- */
  const he0 = window.handleEvents;
  window.handleEvents = function(evs){
    const r = he0.apply(this, arguments); if(!BM.on || !G || !evs || !evs.length) return r;
    const M = G.M, t = now(), P = i => M.players[i];
    evs.forEach(e => {
      if(e.k === 'tackle' && e.ok && P(e.from)){ const by = P(e.by), slide = !!e.slide, s = S(P(e.from));
        s.hit = {H: Motion.hit({kind: 'blunt', weight: slide ? 'medium' : 'light', calm: calm(), seed: seedOf(P(e.from).name) + Math.round(M.t * 10), day: !G.night}), t0: t};
        s.knock = {K: Motion.knock({weight: slide ? 'medium' : 'light'}), t0: t, dir: by ? Math.sign((P(e.from).x - by.x) || 1) : 1};
        { const v = P(e.from); try{ groundFor().fire('slide', {unit: v, x: v.x * U, y: v.y * U, t, weight: slide ? 'medium' : 'light', dir: [Math.sign(v.x - (by ? by.x : v.x)) || 1, 0]}); }catch(err){} }
        if(slide && by){ try{ groundFor().fire('slide', {unit: by, x: by.x * U, y: by.y * U, t, weight: 'medium', dir: [by.fx || 1, by.fy || 0]}); }catch(err){} } }
      if(e.k === 'slide' && P(e.by)){ const by = P(e.by); try{ groundFor().fire('slide', {unit: by, x: by.x * U, y: by.y * U, t, weight: 'medium', dir: [by.fx || 1, by.fy || 0]}); }catch(err){} }
      if(e.k === 'save' && !e.pen){ const b = M.ball; BM.fx.push({kind: 'pop', H: Motion.hit({kind: 'fist', weight: 'light', calm: calm(), seed: 9 + Math.round(M.t * 10)}), t0: t, x: b.x, y: b.y, z: b.z + 0.24, size: e.kind === 'catch' ? 0.6 : 1}); }
    });
    return r;
  };

  /* ---------- drawing ---------- */
  if(he0.__gmood) window.handleEvents.__gmood = 1;   /* 📏 s-bo: carry the 🎵 MOOD flag outward, so the main page's late wrap (boLate) never wraps twice */
  const dt0 = window.drawTrail;
  window.drawTrail = function(g){
    const r = dt0.apply(this, arguments); if(!BM.on || !G || !V || G.M.battle) return r;
    // once a frame, before any body: the ground marks (prints, grooves, rings) under the players
    const t = now(); bakesThisFrame = 0; BM.frameT = t; const b = G.M.ball; BM.kpx = V.sc(b.x, b.y, 0) / U;
    // 🌿 no marks for every step (the pitch stays clean and readable) — the ground answers the BIG moments only: slides, falls, landings
    try{ const GG = groundFor(); GG.drawGround(g, V, t); if(GP) GP.drawGround(g, V, t); drawNight(g, V, t); }catch(e){ BM.err = String(e && e.message || e); }
    return r;
  };
  /* 🦶 bo-mo2: YOUR player's light prints — one per foot plant of the run picture (frames 0 · 2), left / right, prints only (cap 1 = no bits, no puff) */
  function prints(p, s, T){
    if(!BM.prints || calm() || p.z > 0.05 || (p.st && p.st !== 'ok') || p.act){ s.pFr = -1; return; }
    const sp = Math.hypot(p.vx, p.vy); if(sp < 0.6){ s.pFr = -1; return; }
    const fr = Math.floor(p.run * 1.7) % 4; if(fr === s.pFr) return; s.pFr = fr; if(fr % 2) return;
    s.foot = (s.foot || 0) ^ 1; const d = [p.vx / sp, p.vy / sp], side = s.foot ? 1 : -1, off = 0.09;
    if(night()){ GLOWP.push({x: p.x - d[1] * off * side, y: p.y + d[0] * off * side, t: T, d, side}); if(GLOWP.length > 24) GLOWP.shift(); BM.steps = (BM.steps || 0) + 1; BM.glows = (BM.glows || 0) + 1; return; }
    try{ printsFor().fire('step', {unit: p, x: (p.x - d[1] * off * side) * U, y: (p.y + d[0] * off * side) * U, t: T, weight: 0.32, gait: 'run', dir: d}); BM.steps = (BM.steps || 0) + 1; }catch(e){}
  }
  /* 🌙 bo-mo4: the night layer — YOUR glowing prints (drawn under the bodies, added light = 'lighter') */
  const GLOWP = [], GLOW_LIFE = 2.0;
  const night = () => !!(BM.glow && G && G.night && !G.Sz.court);
  function drawNight(g, V, t){
    if(!night()) { GLOWP.length = 0; return; }
    g.save(); g.globalCompositeOperation = 'lighter';
    for(let i = GLOWP.length - 1; i >= 0; i--){ const P = GLOWP[i], age = t - P.t; if(age > GLOW_LIFE || age < -0.05){ GLOWP.splice(i, 1); continue; }
      const c = V.P(P.x, P.y, 0), q = V.P(P.x + P.d[0] * 0.3, P.y + P.d[1] * 0.3, 0); if(!c || !q) continue; const sc = V.sc(P.x, P.y, 0), u = age / GLOW_LIFE, a = (age < 0.08 ? 0.6 + 5 * age : 1) * Math.pow(1 - u, 1.6);
      const ang = Math.atan2(q[1] - c[1], q[0] - c[0]), L = 0.17 * sc, W = 0.075 * sc, sy = Math.max(0.35, Math.min(1, Math.abs(q[1] - c[1]) / Math.max(1, Math.hypot(q[0] - c[0], q[1] - c[1])) * 0.6 + 0.45));
      g.save(); g.translate(c[0], c[1]); g.scale(1, sy); g.rotate(ang);
      const halo = g.createRadialGradient(0, 0, 0, 0, 0, L * 1.9); halo.addColorStop(0, 'rgba(120,220,255,' + (0.42 * a).toFixed(3) + ')'); halo.addColorStop(1, 'rgba(120,220,255,0)');
      g.fillStyle = halo; g.beginPath(); g.ellipse(0, 0, L * 1.9, W * 2.6, 0, 0, TAU); g.fill();
      g.fillStyle = 'rgba(214,248,255,' + (0.85 * a).toFixed(3) + ')'; g.beginPath(); g.ellipse(L * 0.18, 0, L * 0.62, W, 0, 0, TAU); g.fill();   // sole
      g.beginPath(); g.ellipse(-L * 0.62, 0, L * 0.3, W * 0.85, 0, 0, TAU); g.fill();   // heel
      g.restore(); }
    g.restore();
  }
  let GP = null, GPkey = '';   // the prints' own ground (same reader, a foot-sized print: × PRINT_K) — the shared kit draws every print 5 u wide, ≈ 6 px at match zoom = invisible
  const PRINT_K = 2.2;
  function printsFor(){   /* 🌿 pressed grass = a LIGHTER print (the kit mixes a print toward the darker grass, lost on a green pitch) */
    const key = G.theme + (G.Sz.court ? ':court' : ''); if(GP && GPkey === key) return GP; GPkey = key; const R0 = groundFor().__reader;
    const R = Object.assign({}, R0, {kpx: () => (BM.kpx || 0.6) * PRINT_K, at: (x, y) => { const a = R0.at(x, y); return a.mat === 'soft' ? Object.assign({}, a, {col: '#F4FFE6'}) : a; }});
    GP = Motion.ground(R, {calm: calm(), reduced, near: 4, k: 0.6, seed: 17}); return GP; }
  const dp0 = window.drawPlayer;
  window.drawPlayer = function(g, p, t){
    if(!BM.on || !G || !V || G.M.battle) return dp0.apply(this, arguments);
    const s = S(p), T = now(), py = p.y + (p.gk && p.vo ? p.vo : 0), f = V.P(p.x, py, 0); if(!f) return dp0.apply(this, arguments);
    const sc = V.sc(p.x, p.y, 0), k = sc * 1.75 / 74, far = sc * 1.75 < FAR_PX;
    // 🧭 the facing as the camera sees it → back view when running away
    const q = V.P(p.x + (p.fx || 0), py + (p.fy || 0), 0); if(q){ const dx = q[0] - f[0], dy = q[1] - f[1]; if(Math.hypot(dx, dy) > 0.5){ const v8 = Motion.view8(dx, dy, s.view8); s.view8 = v8; s.view = BACK[v8] ? 'NE' : 'SE'; } }
    // 🦘 landing: the real height of the jump (looks only)
    if(p.z > 0.05){ s.zMax = Math.max(s.zMax, p.z); s.air = true; }
    else if(s.air){ s.air = false; if(s.zMax > 0.25 && p.st !== 'dive' && p.act !== 'gkdive' && p.act !== 'dheader'){ const I = Motion.landInfo({height: s.zMax}); s.land = {I, t0: T};
      try{ groundFor().fire('land', {unit: p, x: p.x * U, y: p.y * U, t: T, weight: 'light', levels: Math.min(3, Math.round(s.zMax))}); }catch(e){} } s.zMax = 0; }
    // 🧣 your player: live (hang + charge), only near enough to see it
    const mine = p.ctrl >= 0 && !far && !G.M.battle;
    if(mine){ if(!s.hang) try{ s.hang = Motion.hang({name: p.name, av: G.avs[p.i]}); }catch(e){} const dir = (q && q[0] < f[0] - 0.5) ? -1 : 1;
      if(s.hang) try{ s.hang.feed(dir * f[0] / k, (f[1] - p.z * sc) / k, T, 1); }catch(e){} chargeOf(p, T); BM.live = p; prints(p, s, T); } else BM.live = null;
    // 💥 hit · 🤕 knock · 🦘 squash
    const H = s.hit && (T - s.hit.t0) * 1000 < s.hit.H.end + 60 ? s.hit : (s.hit = null), K = s.knock && (T - s.knock.t0) * 1000 < s.knock.K.end ? s.knock : (s.knock = null);
    const L = s.land && (T - s.land.t0) * 1000 < s.land.I.hold + 260 ? s.land : (s.land = null);
    let pp = p; if(H){ const a = H.H.at((T - H.t0) * 1000); if(a.freeze){ if(!H.snap) H.snap = {act: p.act, bi: p.bi, bq: p.bq, st: p.st, run: p.run, kickT: p.kickT, z: p.z, vx: p.vx, vy: p.vy}; pp = Object.assign(Object.create(p), H.snap); } }
    if(p.act === 'roulette' && p.bi === 3) pp = Object.assign(Object.create(pp), {act: 'roulette~3d'});   // 🌀 our true-turn pictures — the page's thin squeeze stays off
    const lift = K ? K.K.at((T - K.t0) * 1000).lift * 0.6 * k : 0;
    let sqy = 1, sqx = 1; if(L){ const m = (T - L.t0) * 1000, I = L.I, a = m < 40 ? m / 40 : m < 40 + I.hold ? 1 : Math.max(0, 1 - (m - 40 - I.hold) / 200), sq = I.squash / 100 * a * (calm() ? 0.5 : 1); sqy = 1 - sq; sqx = 1 + sq * 0.6; }
    const paint = gg => { gg.save(); if(lift || sqy !== 1){ gg.translate(f[0], f[1] - lift); gg.scale(sqx, sqy); gg.translate(-f[0], -f[1]); } dp0.call(this, gg, pp, t); gg.restore(); };
    if(H){ const ms = (T - H.t0) * 1000, a = H.H.at(ms), hh = headY(), hb = 80 * k;
      Motion.flash(g, paint, a.flash, [f[0] - hb * 0.9, f[1] - lift - hb * 1.25, hb * 1.8, hb * 1.4]);
      g.save(); g.beginPath(); g.rect(-1e5, -1e5, 2e5, 2e5); g.arc(f[0], f[1] - lift - hh.y * k, hh.r * k * 1.15, 0, TAU, true); g.clip('evenodd');   // 😊 never on the face
      Motion.drawHitFx(g, H.H, ms, f[0], f[1] - lift - 34 * k, k, -(K ? K.dir : 1)); g.restore(); }
    else paint(g);
    if(K) try{ Motion.drawKnockFx(g, K.K, (T - K.t0) * 1000, f[0], f[1], k, K.dir); }catch(e){}
    BM.live = null;
  };
  const df0 = window.drawFrame;
  window.drawFrame = function(t){
    const t0 = performance.now(), r = df0.apply(this, arguments); if(!BM.on || !G || !V || G.M.battle) return r;
    const cv = $('pitch'), g = cv.getContext('2d'), T = now(); g.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    try{ groundFor().drawAir(g, V, T); }catch(e){}
    BM.fx = BM.fx.filter(F => { const ms = (T - F.t0) * 1000; if(ms > F.H.end + 60) return false; const c = V.P(F.x, F.y, F.z); if(!c) return true; const kk = V.sc(F.x, F.y, F.z) * 1.75 / 74 * F.size; try{ Motion.drawHitFx(g, F.H, ms, c[0], c[1], kk, 1); }catch(e){} return true; });
    BM.ms.push(performance.now() - t0); if(BM.ms.length > 120) BM.ms.shift();
    return r;
  };
  // a new match = fresh state (no FX from the last one)
  const sm0 = window.startMatch;
  if(sm0) window.startMatch = function(){ BM.st = new Map(); BM.fx = []; GR = null; GRkey = ''; GP = null; GPkey = ''; GLOWP.length = 0; return sm0.apply(this, arguments); };
  { const B0 = window.BoMotion; if(B0 && B0.install && B0.on === false) BM.on = false; }   /* 📏 s-bo: an off() said while it waited still counts */
  window.BoMotion = {version: VERSION, clock: fn => { BM.clock = fn || null; }, get on(){ return BM.on; }, set on(v){ BM.on = !!v; }, off(){ BM.on = false; },
    stats: () => ({bakes: BM.bakes, live: +BM.liveMs.toFixed(2), frame: BM.ms.length ? +(BM.ms.reduce((a, b) => a + b, 0) / BM.ms.length).toFixed(2) : 0, fx: BM.fx.length, err: BM.err || null, ground: GR ? GR.stats() : null, glowPrints: GLOWP.length, night: night(), prints: GP ? GP.stats().prints : 0, printUnits: GP ? GP.stats().units : 0}),
    get turnActs(){ return BM.turnActs; }, set turnActs(v){ BM.turnActs = !!v; }, get prints(){ return BM.prints; }, set prints(v){ BM.prints = !!v; }, get glow(){ return BM.glow; }, set glow(v){ BM.glow = !!v; },
    _st: p => S(p), _BM: BM};
})();
