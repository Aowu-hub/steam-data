
/* 🔥 PyraDiveMotion (pdmo, 🔥 PyraDive chat 2026-11-21) — the shared 🎬 Motion engine inside 🔥 PyraDive, kept OUT of PyraDive.html + PyraDive_play (📏 born split).
   Built from Test Harness/parts/PyraDive/motion.js by parts/build_parts.py (edit that, never PyraDiveMotion.html). Code.gs INCLUDE_ALSO_ PyraDiveParts → PyraDiveMotion.
   LOOKS ONLY (plan § pdmo-p v2, Aowu 23:0x "build as shown"): the engine PD is never touched — every move, touch time, ball path, score and replay stays the same
   (engine hash ON = OFF, pdmo.js). It WRAPS page functions only (bRun · drawPlayer · avSprite · airRing · spark · handleEvents · draw · drawSpiritFx · startMatch)
   and CALLS only shared engine calls:
     1 💥 dunk · 🚀 serve · drive   contact beat 💨 smear 'light' on a runtime act copy `<act>~mo…` (same beat times — no weight, nothing re-timed) + Motion.hit at the BALL
     2 🦶 kick · roll · 🚲 bicycle    the same + {from: 'footR' | 'footL'} (the kicking leg, read from the contact pose) · roll / bicycle = heavy
     3 ⚡ SPARK SMASH                heavy smear {from: 'head'} + zap pop (½ avatar, capped — never face-sized)
     4 🔥 Pyra / 🔥🔥 Spirit          heavy smear + fire / candy trail + hot pop · Spirit Dive impact: NO whole-screen white (F12) → candy pop + 💥 stomp ring
     5 🏐 hold to serve (a person)  Motion.charge on the serve copy, FULL = the game's own 0.9 s (p.charge) · glow on the hitting hand, face cut (F11)
     6 🦘 landings                   Motion.ground land: sand (🦖 jungle · 🪐 moon) = puff + dent · hall floors quiet · the 🔥 ember ring stays the page's
     7 🤿 dive slide                 G.fire('drag') = a furrow in the sand (loose ground only; hall floors stay quiet)
     8 💨 / 🔨 windows               the body is drawn LIVE (≤ 3 at once) only while its smear / charge plays — with TODAY's pose + face (Q4 `faces: false`)
                                   🧣 Motion.hang hair WAITS for the 🎬 Motion fix of the long-hair flap (Aowu Q2) — not used here
     9 🫁 robots waiting             Motion.aliveLoop breath curve on PyraDive's own ready pose (6 cached pictures a player)
    10 ⚡ robot big move (🌱 / 🐣)   {glow: true} wind-up glow — beat times NOT changed (`side: 'enemy'` would re-time)
   pdmo-check (📱 device check, 2026-11-22): 💪 a live body's ARMS follow the FX run (the swing is seen, the smear trails the real hand) · 🏖️ sand / moon dust puffs out AROUND
   the shoes (shoes cut out of the air layer, 85 %) · ⚡ a head-smash pop sits 0.09 s along the ball's way out, off the face.
   🌱 Basic + reduced motion = {calm: true}. window.PdMotion = {on, version, stats(), off(), install()} · tests: Test Harness/pdmo.js. */
(function(){
'use strict';
if(window.PdMotion) return;
const VERSION = 'pdmo-check';
const PM = {on: true, live: true, faces: false, installed: false, hits: [], G: null, Gfor: null, Mref: null, fr: 0, gfr: -1, nLive: 0, err: '',
  st: {live: 0, hits: 0, lands: 0, stomps: 0, drag: 0, maxLive: 0, charge: 0, glow: 0, smear: 0}};
const T = () => (typeof G !== 'undefined' && G && G.M ? G.M.t : 0);   // the game clock (s) — every Motion call is pure on it (F16)
const calmOf = M => !!(M && M.level === 0) || !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const lowLvl = M => !!(M && M.level <= 1);
const person = p => !!(p && typeof PD !== 'undefined' && PD.isPerson(p));

// ---------- 0 · a new match = fresh FX state (the game clock starts again at 0) ----------
let LOOPS = new Map();
function freshFor(M){ if(PM.Mref === M) return; PM.Mref = M; PM.hits = []; PM.G = null; PM.Gfor = null; LOOPS = new Map(); }

// ---------- 1 · 💨 act copies: ONLY smear + element on the contact beat (beat times identical — no `weight`, so nothing is re-timed) ----------
const MO = {'pyradive.spike': {sm: 'light', w: 'medium'}, 'pyradive.serve': {sm: 'light', w: 'light'}, 'pyradive.drive': {sm: 'light', w: 'light'},
  'pyradive.kserve': {sm: 'light', limb: 'auto', w: 'medium'}, 'pyradive.kroll': {sm: 'heavy', limb: 'auto', w: 'heavy'}, 'pyradive.bicycle': {sm: 'heavy', limb: 'auto', w: 'heavy'},
  'pyradive.ssmash': {sm: 'heavy', limb: 'head', el: 'zap', w: 'heavy'}};
const LIMB = {}, FX_LEAD = 0.16, HEAD_LEAD = 0.09;   // HEAD_LEAD (pdmo-check): s along the ball path for a ⚡ head-smash pop   // s: the FX run starts this much before a from-contact touch (the strike's travel for the smear)
function limbOf(key){ const s = MO[key]; if(!s || !s.limb) return null; if(s.limb !== 'auto') return s.limb; if(LIMB[key]) return LIMB[key];
  const A = Acting.T.acts[key], c = A.beats.find(b => b.contact), P = Object.assign({}, c && (typeof c.pose === 'string' ? Acting.pose(c.pose) : c.pose) || {});
  return (LIMB[key] = Math.abs(P.legR || 0) + Math.abs(P.kneeR || 0) * 0.3 >= Math.abs(P.legL || 0) + Math.abs(P.kneeL || 0) * 0.3 ? 'footR' : 'footL'); }
function copyOf(key, el, heavy){ const s = MO[key]; if(!s || !Acting.T.acts[key]) return null; const k2 = key + '~mo' + (el ? '.' + el : '') + (heavy ? 'H' : '');
  if(!Acting.T.acts[k2]){ const A = Acting.T.acts[key]; Acting.add({acts: {[k2]: Object.assign({}, A, {element: el || undefined, beats: A.beats.map(b => b.contact ? Object.assign({}, b, {smear: heavy ? 'heavy' : s.sm}) : b)})}}); }
  return k2; }
function hotOf(M, p, atContact){ const b = M.ball; if(atContact && b && b.lastP === p.id && (b.spirit || b.pyra)) return b.spirit ? 'candy' : 'fire';
  return p.spiritArm ? 'candy' : p.pyraArm && p.meter >= (PD.PYRA_COST || 50) ? 'fire' : ''; }

// ---------- 2 · 💥 hits at the ball (FX only, the ball keeps its own path) ----------
function hitAt(M, x, y, z, o){ if(!PM.on) return; freshFor(M); const H = Motion.hit(Object.assign({kind: 'fist', seed: (PM.st.hits * 7919 + Math.round(x * 97 + z * 31)) & 0x7fffffff, calm: calmOf(M), fx: !!o.element}, o));
  PM.hits.push({H, x, y, z, t0: T(), dir: o.dir || 1, w: o.weight, el: o.element || '', ev: o.ev || ''}); if(PM.hits.length > 6) PM.hits.shift(); PM.st.hits++; }
function drawHits(g, M){ const now = T(); PM.hits = PM.hits.filter(h => (now - h.t0) < 0.7 && now >= h.t0);
  PM.hits.forEach(h => { const [x, y, s] = P(h.x, h.y, h.z), k = Math.min(1.1, 1.55 * V.k * s / 70) * 0.6;   /* F7: a ball touch = a small / medium effect (≈ 0.5 × the avatar), capped so ⚡ Spark's big players never get a face-sized burst */
    try{ Motion.drawHitFx(g, h.H, (now - h.t0) * 1000, x, y, k, h.dir); }catch(e){ PM.err = String(e && e.stack || e); } }); }

// ---------- 3 · 🗺️ the ground (Motion.ground on PyraDive's own camera: metres → screen) ----------
const ARENA_MAT = {classic: 'room', fair: 'room', jungle: 'loose', coral: 'room', neon: 'room', robot: 'hard', moon: 'loose', olympus: 'hard'};
function matOf(M){ return M.sp && M.sp.sand ? 'loose' : ARENA_MAT[arenaKey(M)] || 'room'; }
function groundFor(M){ freshFor(M); if(PM.Gfor === M && PM.G) return PM.G; const ak = arenaKey(M), LK = arenaLook(M), mat = matOf(M);
  const col = ak === 'moon' ? '#A9A9B4' : mat === 'loose' && ak !== 'coral' ? '#E9C98A' : (LK.floor || '#B9B5AC');
  const R = {kind: 'pd', at: () => ({mat, tile: mat === 'loose' ? 'sand' : 'floor', h: 0, col}), clear(){},
    scr: (v, x, y, z) => { const q = P(x, y, (z || 0) / 45); return {x: q[0], y: q[1]}; }, kpx: () => 1.55 * V.k / 70,
    offW: (v, dx, dy) => [dx / V.k, dy / (V.k * 0.4)], dirS: (dx, dy) => [dx * V.k, dy * V.k * 0.4]};
  PM.G = Motion.ground(R, {calm: calmOf(M), seed: 11}); PM.Gfor = M; return PM.G; }

// 🏖️ pdmo-check (device check 2026-11-22): on sand / moon dust the landing puffs sat ON the shoes as solid lumps (the air layer is drawn over the bodies).
//    Now the shoes of every player near the floor are cut out of the air layer (an even-odd clip) and the dust is a bit see-through → it puffs out AROUND the feet.
//    (Drawn under the bodies it vanished under the page's own player rings.) Hall floors keep the plain air layer (nothing loud there).
const AIR_ALPHA = 0.85, SHOE = {w: 7, up: 13, down: 2};   // shoe box in avatar units (k = the player's avatar scale)
function airAround(g, M, G0){ g.save(); g.globalAlpha *= AIR_ALPHA; g.beginPath(); g.rect(-1e4, -1e4, 2e4, 2e4);
  M.players.forEach(p => { const [fx, fy, s] = P(p.x, p.y, 0), k = 1.55 * V.k * s / 70, lift = airZ(M, p) * 45 * k; if(lift > (SHOE.up + 6) * k) return;   // the box rides with the feet (same lift as the body), gone once they are well above the dust
    g.rect(fx - SHOE.w * k, fy - lift - SHOE.up * k, 2 * SHOE.w * k, (SHOE.up + SHOE.down) * k); });
  g.clip('evenodd'); try{ G0.drawAir(g, V, T()); } finally{ g.restore(); } }

// ---------- 4 · 💨 / 🔨 live bodies: TODAY's pose + face, plus the engine's smear / glow / charge ----------
const EMPTY = {c: document.createElement('canvas'), W: 0, H: 0, ax: 0, foot: 0}; EMPTY.c.width = EMPTY.c.height = 1;
const NOSH = {ride: 1, back: 1, legs: 1, hairback: 1, armL: 1, body: 1, off: 1, head: 1, armR: 1, fx: 1};   // every AvatarKit part but its own shadow (PyraDive paints the ground shadow)
// 💨 the FX run (p.bt.mo.run) is OUR own Acting.play of the act copy — the page's run, pose, beat events + B.key stay exactly today's.
//    A real touch plays FROM contact (no travel = no smear), so the FX run starts FX_LEAD earlier with the same contact moment → the smear draws the strike's path (M18).
//    A robot's held wind-up (🌱 / 🐣) gets an FX run too, for the ⚡ glow only — frozen just before contact until the real touch comes (or the page lets go).
function moWindow(p){ const B = p.bt, mo = B && B.mo; if(!mo) return false; if(mo.hold && B.key !== mo.key) return false; const el = (T() - mo.t0) * 1000; return el >= -50 && el <= (mo.run.contactMs || 0) + (mo.hold ? 0 : 520); }
const CH = new WeakMap();
const ARMS = ['armL', 'armR', 'elbowL', 'elbowR', 'handL', 'handR', 'shrugL', 'shrugR'];   // pdmo-check: the pose fields the FX run lends a live body
function chargeOn(M, p){ return person(p) && M.phase === 'serve' && !!M.ball && M.ball.held === p.id && p.charge >= 0 && !p.jumpServe && !p.feed && !!Acting.T.acts['pyradive.serve']; }
// 🔨 hold to serve (a person): Motion.charge on the serve copy — FULL = the game's own 0.9 s (p.charge counts it), the glow + motes sit on the hitting hand
function chargeFrame(M, p){ if(!chargeOn(M, p)){ CH.delete(p); return null; }
  let C = CH.get(p); const t0 = T() - p.charge;
  if(!C || (p.charge < 0.85 && Math.abs(C.t0 - t0) > 0.08)){ const k2 = 'pyradive.serve~mo.chg'; if(!Acting.T.acts[k2]){ const A = Acting.T.acts['pyradive.serve'], ci = A.beats.findIndex(b => b.contact);
      const ant = A.beats.slice(0, ci).reduce((s, b) => s + (b.ms || 120), 0); Acting.add({acts: {[k2]: Object.assign({}, A, {charge: {full: Math.max(200, 900 - ant)}, beats: A.beats.map(b => b.contact ? Object.assign({}, b, {smear: 'light'}) : b)})}}); }
    C = Motion.charge({name: p.name, av: p.av}, k2, {t0, calm: calmOf(M), side: 'player', fx: !!(p.pyraArm || p.spiritArm), element: p.spiritArm ? 'candy' : p.pyraArm ? 'fire' : undefined}); C.t0 = t0; CH.set(p, C); PM.st.charge++; }
  return C.at(T()); }
function liveOn(M, p){ return PM.live && !!p.av && (moWindow(p) || chargeOn(M, p)) && PM.nLive < 3; }
// the frame to draw: smear / glow / charge from the engine, the BODY = today's pose (the page's own beat pose, same time step) so faces + bodies look like today
function liveFrame(M, p, pose){
  const cf = chargeFrame(M, p); if(cf){ const f = Object.assign({}, cf, {pose: Object.assign({}, pose || {}, cf.pose)}); if(!PM.faces) f.face = null; return f; }   // the coil creeps (the charge's own pose over today's)
  const mo = p.bt && p.bt.mo; if(!mo || !moWindow(p)) return {id: 'pd-live', act: {}, pose: pose || {}, face: null, marks: [], tricks: [], ride: 'keep', hold: 'keep'};   // the move just ended inside this frame: today's body, no smear
  const now = T(), f = Object.assign({}, mo.run.at(mo.hold ? Math.min(now, mo.c - 0.03) : now));   // the engine frame at the real game time (the smear lives on the contact frames; the body keeps today's stepped pose)
  if(pose){ const rp = f.pose || {}; f.pose = Object.assign({}, pose); if(!mo.hold) ARMS.forEach(n => { if(rp[n] != null) f.pose[n] = rp[n]; }); }   // 💪 pdmo-check: the ARMS follow the FX run (the swing is seen + the smear trails the real hand); legs · body · face stay today's
  if(!PM.faces) f.face = null;
  if(mo.limb){ if(f.smear) f.smear = Object.assign({}, f.smear, {from: mo.limb}); if(f.glow != null || f.charge) f.from = mo.limb; }
  if(f.smear) PM.st.smear++; if(f.glow) PM.st.glow++;
  return f; }
function paintLive(g, M, p, pose, T0){
  const [fx, fy, s] = P(p.x, p.y, 0), kAv = 1.55 * V.k * s / 70, lift = airZ(M, p) * 45 * kAv, who = {name: p.name, av: p.av, dir: p.dir < 0 ? -1 : 1};
  const DA = PM.DA, D0 = window.drawAvatar; let f; try{ f = liveFrame(M, p, pose); }catch(e){ PM.err = String(e && e.stack || e); return false; }   // false = the page paints today's body instead
  g.save(); if(T0) g.setTransform(T0); let ok = true;
  window.drawAvatar = (G2, a, X, Y, k, o) => DA(G2, a, X, Y, k, Object.assign({}, o, {parts: NOSH}));
  try{ Acting.draw(g, who, fx, fy - lift, kAv, f, {t: T(), dir: who.dir, calm: calmOf(M)}); }catch(e){ PM.err = String(e && e.stack || e); ok = false; }
  finally{ window.drawAvatar = D0; g.restore(); }
  if(ok) PM.st.live++; return ok; }

// ---------- 5 · 🫁 cached bodies breathe (Motion.aliveLoop's breath curve on PyraDive's own ready pose, 6 pictures a player) ----------
function breathe(M, p, pose){ if(!pose || p.z > 0 || p.walkT || p.act || (p.bt && p.bt.run)) return pose;
  let L = LOOPS.get(p); if(!L){ L = Motion.aliveLoop({name: p.name, av: p.av}, {secs: 3 + (p.id % 4) * 0.35, seed: p.name + p.id, frames: 6}); LOOPS.set(p, L); }
  const b = L.at(T() / L.secs).breath || 0; if(!b) return pose; const Q = Object.assign({}, pose);
  Q.dy = (Q.dy || 0) - 0.7 * b; Q.shrugL = Math.min(1, (Q.shrugL || 0) + 0.1 * b); Q.shrugR = Math.min(1, (Q.shrugR || 0) + 0.1 * b); Q.armL = (Q.armL || 0) + 0.035 * b; Q.armR = (Q.armR || 0) + 0.035 * b; return Q; }

// ---------- 6 · install (after the 🎮 play part is in: at once offline / in tests, on GameParts.loaded('PyraDive_play') online) ----------
function install(){
  if(PM.installed) return true;
  if(typeof bRun !== 'function' || typeof drawPlayer !== 'function' || typeof drawSpiritFx !== 'function' || !window.Acting || !window.Motion || !Motion.ground) return false;
  PM.installed = true; PM.DA = window.drawAvatar;
  const bRun0 = window.bRun, drawPlayer0 = window.drawPlayer, airRing0 = window.airRing, spark0 = window.spark, handle0 = window.handleEvents, draw0 = window.draw, spirit0 = window.drawSpiritFx;
  // 💨 a move starts: the act copy with smear (+ fire / candy / zap) is played under the SAME key (beat events, B.key and every check of the page stay the same);
  //    ⚡ a robot's big move glows on 🌱 / 🐣
  window.bRun = function(M, p, key, t0, contactAt){
    const run = bRun0.apply(this, arguments);   // today's run — untouched (pose, beat times, 📣 / 💥 beat events, B.key)
    if(!PM.on || !MO[key] || !window.Acting || !p.bt) return run;
    try{ const c = contactAt != null ? contactAt : t0, hold = c - t0 > 0.1, glow = !person(p) && lowLvl(M) && MO[key].w !== 'light';
      if(hold && !glow) return run;   // a wind-up with nothing to show (people · light moves · Intermediate up) stays a cached picture
      const atC = Math.abs(c - M.t) < 0.06, hot = hotOf(M, p, atC), el = hot || MO[key].el || '', heavy = !!hot || MO[key].sm === 'heavy', k2 = copyOf(key, el, heavy), f0 = hold ? t0 : c - FX_LEAD;
      const o = {t0: f0, contactAt: c, fx: !!el, element: el || undefined, calm: calmOf(M)}; if(hold) o.glow = true;
      p.bt.mo = {run: Acting.play({name: p.name, av: p.av}, k2 || key, o), key, t0: f0, c, hold, limb: limbOf(key), el, w: heavy ? 'heavy' : MO[key].w};
    }catch(e){ PM.err = String(e && e.stack || e); }
    return run; };
  // 🗺️ marks under every body (before the first body of the frame) · 🫁 cached bodies breathe · 💨 / 🔨 bodies drawn live through the page's drawPlayer
  window.drawPlayer = function(g, M, p, t, o){
    if(!PM.on || !o || !o.live || !window.Acting) return drawPlayer0.apply(this, arguments);
    if(PM.fr !== PM.gfr){ PM.gfr = PM.fr; try{ groundFor(M).drawGround(g, V, T()); }catch(e){ PM.err = String(e && e.stack || e); } }
    if(!liveOn(M, p)){ const S0 = window.avSprite; window.avSprite = (q, a, pose, kq, key) => S0(q, a, breathe(M, q, pose), kq); try{ return drawPlayer0.apply(this, arguments); } finally{ window.avSprite = S0; } }
    PM.nLive++; const T0 = g.getTransform(), S0 = window.avSprite, D0 = window.drawAvatar; let done = false;
    const once = pose => { if(done) return true; done = true; return paintLive(g, M, p, pose, T0); };
    window.avSprite = function(q, a, pose){ return once(pose) ? EMPTY : S0.apply(this, arguments); };
    window.drawAvatar = function(G2, a, X, Y, k, oo){ if(!once(oo && oo.pose)) return D0.apply(this, arguments); };
    try{ return drawPlayer0.apply(this, arguments); } finally{ window.avSprite = S0; window.drawAvatar = D0; } };
  // 🦘 landings: the ground answers (sand puffs + a dent / dust on the moon / nothing loud on a hall floor) — the 🔥 ember ring stays the page's
  window.airRing = function(p, L){ if(!PM.on || typeof G === 'undefined' || !G || !G.M) return airRing0.apply(this, arguments);
    try{ groundFor(G.M).fire('land', {unit: p, x: p.x, y: p.y, t: T(), weight: L.name === 'pyra' ? 'medium' : 'light', power: L.name === 'pyra' ? 1.25 : 1}); PM.st.lands++; }catch(e){ PM.err = String(e); }
    if(L.ring === 'ember') return airRing0.apply(this, arguments); };
  // 💥 contact: Motion.hit at the ball replaces the white / orange dots (words, sounds, shake stay)
  window.spark = function(x, y, z, col, n){ if(PM.on && PM.mute) return; return spark0.apply(this, arguments); };
  const REPL = {dunk: 1, drive: 1, serve: 1, edge: 1, hoop: 1, pyra: 1};
  window.handleEvents = function(list){
    if(!PM.on || typeof G === 'undefined' || !G || !G.M) return handle0.apply(this, arguments); const M = G.M; freshFor(M);
    (list || []).forEach(e => { const p = e.p != null ? M.players[e.p] : null, b = M.ball, dir = p ? (p.dir < 0 ? -1 : 1) : 1;
      if(REPL[e.k] && e.k !== 'pyra' || e.k === 'stuff'){
        const hot = b.spirit ? 'candy' : b.pyra || e.pyra ? 'fire' : PD.isSpark(M) && e.k === 'dunk' ? 'zap' : '', w = e.k === 'dunk' || e.k === 'stuff' || e.k === 'edge' || e.k === 'hoop' || (e.k === 'serve' && e.kind === 'jump') ? 'medium' : 'light';
        const lead = PD.isSpark(M) && e.k === 'dunk' ? HEAD_LEAD : 0.03;   // ⚡ pdmo-check: a head smash pops off the face, on the ball's way out
        hitAt(M, b.x + (b.vx || 0) * lead, b.y + (b.vy || 0) * (lead - 0.03), b.z + (b.vz || 0) * (lead - 0.03), {weight: w, element: hot || undefined, dir, ev: e.k}); }
      PM.mute = !!REPL[e.k]; try{ handle0.call(this, [e]); } finally{ PM.mute = false; } }); };
  // 🔥🔥 Spirit Dive impact: no whole-screen white (F12) → a medium candy hit + a 💥 stomp ring under it (the dark dim + the creature stay)
  window.drawSpiritFx = function(g, M){ if(!PM.on) return spirit0.apply(this, arguments); const f = SPFX[0], was = f && f.hit, fr = g.fillRect;
    g.fillRect = function(x, y, w, h){ if(x === 0 && y === 0 && w >= V.W && h >= V.H && /^rgba\(255,\s*255,\s*255/.test(String(this.fillStyle))) return; return fr.apply(this, arguments); };
    try{ spirit0.apply(this, arguments); } finally{ g.fillRect = fr; }
    if(f && !was && f.hit){ hitAt(M, f.hx, f.hy, f.hz, {weight: 'medium', element: 'candy', ev: 'spirit'}); try{ groundFor(M).fire('stomp', {x: f.hx, y: f.hy, t: T(), weight: 'big', power: 2}); PM.st.stomps++; }catch(e){} } };
  // 🎞️ one frame: count, the page draws, then 🤿 dive furrows + the air bits + hit FX on top
  window.draw = function(dt){ PM.fr++; PM.nLive = 0; const r = draw0.apply(this, arguments);
    if(PM.on && typeof G !== 'undefined' && G && G.M && V){ const g = $('court').getContext('2d'), M = G.M; freshFor(M);
      if(matOf(M) === 'loose') M.players.forEach(p => { if(p.dive && p.z <= 0.05 && Math.hypot(p.vx || 0, p.vy || 0) > 0.4){ try{ if(groundFor(M).fire('drag', {unit: p, x: p.x, y: p.y, t: T(), weight: 'medium'})) PM.st.drag++; }catch(e){} } });
      try{ if(matOf(M) === 'loose') airAround(g, M, groundFor(M)); else groundFor(M).drawAir(g, V, T()); }catch(e){} drawHits(g, M); PM.st.maxLive = Math.max(PM.st.maxLive, PM.nLive); }
    return r; };
  return true; }

window.PdMotion = {version: VERSION, install, get on(){ return PM.on; }, set on(v){ PM.on = !!v; }, off(){ PM.on = false; },
  get live(){ return PM.live; }, set live(v){ PM.live = !!v; }, get faces(){ return PM.faces; }, set faces(v){ PM.faces = !!v; },
  stats: () => Object.assign({}, PM.st, {installed: PM.installed, err: PM.err || null, hitsNow: PM.hits.length, ground: PM.G ? PM.G.stats() : null}),
  _PM: PM, MO, _drawHits: drawHits, _airAround: airAround, ARMS, HEAD_LEAD};   // _drawHits: the face test paints the hit FX alone · _airAround / ARMS / HEAD_LEAD: pdmocheck.js
// the 🎮 play part comes later online (GameParts) → install the moment it reports in; offline + tests have it inline already
if(!install() && window.GameParts && typeof GameParts.loaded === 'function'){ const L0 = GameParts.loaded;
  GameParts.loaded = function(name){ if(name === 'PyraDive_play'){ try{ install(); }catch(e){ PM.err = String(e && e.stack || e); } } return L0.apply(this, arguments); }; }
})();
GameParts.loaded('PyraDiveMotion', 'pdmo-check');
