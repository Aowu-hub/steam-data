
/* 🪄 CreatureCast — element SPELLS for CreatureKit creatures (🧳 Avateer Development chat, av-naga6 2026-11-21 · Avateer plan §23i–§23l + §23m as built).
   First user: 🐉 Phaya Naga ✦ Elite (3 heads) · ✦✦ Awakened (7) · ✦✦✦ Prime (9) — each elemental head casts its own element (CreatureSea acts castFire …).
   A spell = head acts + a body act + warnings + Motion FX on ONE timeline. Everything is PURE: same ms = same picture (seeded, every effect made with its own t0).
     C = Creatures.cast('phayanaga', 'fire', {form, x, y (water line), size, view, face, t (the creature's clock at ms 0, s), to: [x, y] (target FEET), toH (target px, 90),
                        k (FX scale, toH / 92), seed, calm, day, basic, n (chain length), rings: [[x, y] …] (one per chain cast), t0 (s, for the flash budget),
                        onContact(C, i, hit) → return false = it MISSED (the target left the ring): no status is drawn for that hit})
       → null if this form has not got the heads (Creatures.castable(id, form) lists what it has)
     Creatures.castFrame(C, ms) → draw options {form, view, t, act, ms, heads: {L1: {act, ms, w}}, castEls} · w = own ⇄ trail blend (0 → 1 over 160 ms, → 0 over the settle)
     Creatures.castDraw(g, C, ms, extra) → anchors (= Creatures.draw with castFrame merged in)
     Creatures.castFx(g, C, ms, 'back' | 'front', A?) — 'back' BEFORE the target + creature (warnings, ground FX, pops behind), 'front' after them (shots, gathers, threads)
                        fires C.onContact ONCE per hit (a single spell has ONE hit; a chain = one per head; the game reacts THERE — F10)
     Creatures.castAt(C, ms) → {hits (passed), next, shake {x, y}, done, beat} · C.hits = [{ms, head, el, status}] · C.len
   Moves still play without Motion (castFx draws only the warnings). FX the 🎬 Motion chat has not made yet use stand-ins (📨 asked): 💧 jet = a water fireball ·
   🌱 sprout = ground (nature) · 🌈 thread = drawn here with Motion.fxTools · 🔥 shot styles ember · twin · pearl = drawn here with Motion.fxTools until Motion.FX_STYLES.fireball lists them. */
(function(){ if(!window.Creatures || !Creatures.ACTS){ console.warn('CreatureCast: CreatureKit must load first'); return; }
const CR = window.Creatures, TAU = Math.PI * 2;
const M_ = () => (window.Motion && Motion.fx) ? Motion : null;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, q) => a + (b - a) * q, sm = u => u * u * (3 - 2 * u);
// 🔤 kit element names (fire · water · leaf · rock · wind · bolt) → Motion FX element names
const FXEL = {fire: 'fire', water: 'water', leaf: 'nature', rock: 'stone', wind: 'wind', bolt: 'zap', grey: 'light', light: 'light'};
const ELCOL = {fire: '#FF8A3D', water: '#3A9BFF', leaf: '#4CB13A', rock: '#B08A5E', wind: '#3FC9B8', bolt: '#FFC81A', grey: '#9A9AAA', light: '#FFD43B'};
const STATUS = {fire: 'toasty', water: 'soaked', leaf: 'rooted', rock: 'dizzy', wind: 'pushed', bolt: 'zapped'};
// 🐉 which head holds which element, per form (Prime's grey L4 / R4 = guard bonk heads)
const HEAD_EL = {L1: 'fire', L2: 'water', L3: 'leaf', R1: 'rock', R2: 'wind', R3: 'bolt'};
const FORM_HEADS = {1: ['L1', 'R1'], 2: ['L1', 'L2', 'L3', 'R1', 'R2', 'R3'], 3: ['L1', 'L2', 'L3', 'L4', 'R1', 'R2', 'R3', 'R4']};
function castEls(form){ const o = {}; (FORM_HEADS[form] || []).forEach(id => { if(HEAD_EL[id]) o[id] = HEAD_EL[id]; }); return o; }
const ACT_OF = {fire: 'castFire', water: 'castWater', leaf: 'castLeaf', rock: 'castRock', wind: 'castWind', bolt: 'castZap'};
const actLen = a => CR.ACTS[a].reduce((s, b) => s + b.ms, 0);
const contactAt = a => { let t = 0; for(const b of CR.ACTS[a]){ if(b.contact) return t; t += b.ms; } return 0; };
const BODY_KEEP = 1200;   // ms the body act is still passed after its end
const settleOf = a => { const B = CR.ACTS[a]; return B[B.length - 1].ms; };
// 🔥 the SHOT grows with the form (Aowu 19:22): ✦ ember · ✦✦ twin coil · ✦✦✦ naga pearl
const SHOT = {ember: {k: 0.85, fly: 450, arc: 18, shake: [2, 220]}, twin: {k: 0.95, fly: 500, arc: 26, shake: [3, 220]}, pearl: {k: 1.3, fly: 600, arc: 64, shake: [4, 320]}};
const SHOT_OF = {1: 'ember', 2: 'twin', 3: 'pearl'};

/* ================= 📜 SPELLS (meta — the builders below make the timeline) ================= */
const SPELLS = {
  fire:  {icon: '🔥', name: 'Naga Fireball', el: 'fire', kind: 'cast', heads: ['L1'], forms: [1, 2, 3], warn: 'orange ring', tip: 'Watch the orange ring — step out before the fireball lands!'},
  water: {icon: '💧', name: 'Tide Spout', el: 'water', kind: 'cast', heads: ['L2'], forms: [2, 3], warn: 'ripple rings', tip: 'Ripples on the ground = a water spout is coming.'},
  leaf:  {icon: '🌱', name: 'Lotus Root Snare', el: 'leaf', kind: 'cast', heads: ['L3'], forms: [2, 3], warn: 'green dotted ring + ripple line', tip: 'The green ripple runs to you — hop off the dotted ring!'},
  rock:  {icon: '🪨', name: 'Stair Slam', el: 'rock', kind: 'cast', heads: ['R1'], forms: [1, 2, 3], warn: 'crack line', tip: 'Spikes run along the crack line — move sideways.'},
  wind:  {icon: '🌪️', name: 'Hood Gust', el: 'wind', kind: 'cast', heads: ['R2'], forms: [2, 3], warn: 'chevrons on the row', tip: 'Arrows on your row = a gust will push you one tile.'},
  bolt:  {icon: '⚡', name: 'Sky Crest Bolt', el: 'bolt', kind: 'cast', heads: ['R3'], forms: [2, 3], warn: 'dashed ring + cloud shadow', tip: 'A cloud shadow + dashed ring = lightning. Leave the ring!'},
  bonk:  {icon: '⚪', name: 'Guard Bonk', el: 'grey', kind: 'cast', heads: ['L4', 'R4'], forms: [3], warn: 'red "too close" zone', tip: 'Too close to the big head — the guards bonk you back.'},
  magma: {icon: '🌋', name: 'Magma Stair', el: 'fire', kind: 'combo', heads: ['R1', 'L1'], forms: [1, 2, 3], warn: 'orange ring + crack line', tip: 'Two warnings at once: the spikes run, then the fireball lands ON them.'},
  hoodwave: {icon: '🌊', name: 'Hood Wave', el: 'water', kind: 'chain', heads: ['L3', 'L2', 'L1', 'R1', 'R2', 'R3'], forms: [2, 3], warn: 'one ring per head', tip: 'The big head nods — then each head casts in turn, 180 ms apart.'},
  firewhirl: {icon: '🌀', name: 'Fire Whirl', el: 'fire', kind: 'pair', heads: ['L1', 'R2'], forms: [2, 3], warn: 'orange ring + chevrons', tip: 'The gust carries the embers — a fire whirl spins on the ring.'},
  stormspout: {icon: '⛈️', name: 'Storm Spout', el: 'bolt', kind: 'pair', heads: ['L2', 'R3'], forms: [2, 3], warn: 'ripples + dashed ring', tip: 'Water first, then lightning strikes the puddle — leave the puddle!'},
  stonegarden: {icon: '🪷', name: 'Stone Garden', el: 'rock', kind: 'pair', heads: ['L3', 'R1'], forms: [2, 3], warn: 'crack line across the lane', tip: 'Spikes + roots grow a wall — this lane is blocked, find another way.', defence: true},
  crown: {icon: '🌈', name: 'Rainbow Crown', el: 'light', kind: 'ultimate', heads: ['L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'L4', 'R4'], forms: [3], warn: 'rainbow ring · lotus pads are safe', tip: 'Six colours flow into the crown — stand on a lotus pad before it shines!', once: true},
};
Object.keys(SPELLS).forEach(k => { SPELLS[k].id = k; });

/* ================= 🧱 timeline builders ================= */
// one element head cast, starting at 'at', aimed at ring R (a target feet point) → pushes heads · tele · fx · hits into P
function single(P, el, head, at, R, o){
  const act = el === 'grey' ? 'bonk' : ACT_OF[el], c = at + contactAt(act), i = P.hits.length; P.heads[head] = {act, at};
  const H = {ms: 0, head, el, status: STATUS[el] || null, ring: R};
  if(el === 'fire'){ const st = o.style || SHOT_OF[P.form] || 'ember', S = SHOT[st]; H.ms = c + S.fly;
    P.tele.push({kind: 'ring', el, from: at, to: H.ms, at: R});
    P.fx.push({kind: 'gather', el, head, from: at + 360, to: c, style: st}, {kind: 'shot', el, head, at: c, fly: S.fly, style: st, to: R, hit: H.ms, chest: true});
    P.shake.push([H.ms, S.shake[0], S.shake[1]]); }
  else if(el === 'water'){ H.ms = c + 450;
    P.tele.push({kind: 'ripple', el, from: at, to: H.ms, at: R});
    P.fx.push({kind: 'gather', el, head, from: at + 100, to: c}, {kind: 'jet', el, head, at: c, to: R, hit: H.ms}, {kind: 'splash', at: H.ms, on: R, size: 1.1}); }
  else if(el === 'leaf'){ H.ms = c + 400;
    P.tele.push({kind: 'dotted', el, from: at, to: H.ms, at: R}, {kind: 'rippleLine', el, from: c, to: H.ms, head, at: R});
    P.fx.push({kind: 'splash', at: c, head, chin: true, size: 0.5}, {kind: 'sprout', el, at: H.ms, on: R}); }
  else if(el === 'rock'){ H.ms = c + 360 + 40;
    P.tele.push({kind: 'crack', el, from: at, to: H.ms, head, at: R});
    P.fx.push({kind: 'splash', at: c, head, chin: true, size: 1.1});
    for(let s = 1; s <= 3; s++) P.fx.push({kind: 'quake', at: c + 120 * s, head, line: s / 3, to: R}); }
  else if(el === 'wind'){ H.ms = c + 80;
    P.tele.push({kind: 'chev', el, from: at, to: H.ms, head, at: R});
    P.fx.push({kind: 'gather', el, head, from: at + 100, to: c}, {kind: 'gust', at: c, head, to: R}); }
  else if(el === 'bolt'){ H.ms = c + 220;
    P.tele.push({kind: 'dash', el, from: at, to: H.ms, at: R});
    P.fx.push({kind: 'crackle', head, from: at + 100 + 300, to: c + 160}, {kind: 'bolt', at: c, on: R}); }
  else if(el === 'grey'){ H.ms = c; H.status = null;
    P.tele.push({kind: 'zone', el, from: at, to: H.ms, at: R});
    P.fx.push({kind: 'bonk', at: c, on: R}); }
  if(H.status) P.fx.push({kind: 'status', name: H.status, at: H.ms, on: R, ms: 900});
  P.hits.push(H); return H; }

const BUILD = {
  fire: (P, o) => single(P, 'fire', 'L1', 0, o.to, o), water: (P, o) => single(P, 'water', 'L2', 0, o.to, o), leaf: (P, o) => single(P, 'leaf', 'L3', 0, o.to, o),
  rock: (P, o) => single(P, 'rock', 'R1', 0, o.to, o), wind: (P, o) => single(P, 'wind', 'R2', 0, o.to, o), bolt: (P, o) => single(P, 'bolt', 'R3', 0, o.to, o),
  bonk(P, o){ single(P, 'grey', 'L4', 0, o.to, o); P.heads.R4 = {act: 'bonk', at: 0}; },
  // 🌋 ✦ Elite Magma Stair: R1 slams, spikes run → L1's fireball lands ON them = eruption = the ONE hit (look test v1, approved)
  magma(P, o){ const rc = contactAt('castRock'), fc = contactAt('castFire'), hit = fc + SHOT.ember.fly; P.heads.R1 = {act: 'castRock', at: 0}; P.heads.L1 = {act: 'castFire', at: 0};
    P.tele.push({kind: 'ring', el: 'fire', from: 0, to: hit, at: o.to}, {kind: 'crack', el: 'rock', from: 0, to: rc + 400, head: 'R1', at: o.to});
    P.fx.push({kind: 'splash', at: rc, head: 'R1', chin: true, size: 1.1});
    for(let s = 1; s <= 3; s++) P.fx.push({kind: 'quake', at: rc + 120 * s, head: 'R1', line: s / 3, to: o.to});
    P.fx.push({kind: 'gather', el: 'fire', head: 'L1', from: 360, to: fc, style: 'ember'}, {kind: 'shot', el: 'fire', head: 'L1', at: fc, fly: SHOT.ember.fly, style: 'ember', to: o.to, hit, chest: false},
              {kind: 'eruption', at: hit, on: o.to}, {kind: 'status', name: 'toasty', at: hit, on: o.to, ms: 900});
    P.hits.push({ms: hit, head: 'L1', el: 'fire', status: 'toasty', ring: o.to}); },
  // 🌊 ✦✦ Hood Wave: the main head NODS = go → L3 → L2 → L1 → R1 → R2 → R3, 180 ms apart, each on its own ring (Easy 3 · Hard 6)
  hoodwave(P, o){ const go = contactAt('castNod'), order = SPELLS.hoodwave.heads, n = clamp(o.n || (P.form === 3 ? 6 : 3), 1, 6); P.body = {act: 'castNod', at: 0};
    for(let i = 0; i < n; i++){ const id = order[i], R = (o.rings && o.rings[i]) || ringAt(o, i, n); single(P, HEAD_EL[id], id, go + 180 * i, R, o); } },
  // 🔥🌪️ Fire Whirl: L1 spits embers, R2's gust carries them → a fire vortex spins on the ring (2 s)
  firewhirl(P, o){ const fc = contactAt('castFire'), wc = contactAt('castWind'), hit = fc + SHOT.ember.fly; P.heads.L1 = {act: 'castFire', at: 0}; P.heads.R2 = {act: 'castWind', at: hit - 80 - wc};
    P.tele.push({kind: 'ring', el: 'fire', from: 0, to: hit, at: o.to}, {kind: 'chev', el: 'wind', from: hit - 80 - wc, to: hit, head: 'R2', at: o.to});
    P.fx.push({kind: 'gather', el: 'fire', head: 'L1', from: 360, to: fc, style: 'ember'}, {kind: 'shot', el: 'fire', head: 'L1', at: fc, fly: SHOT.ember.fly, style: 'ember', to: o.to, hit},
              {kind: 'gather', el: 'wind', head: 'R2', from: hit - 80 - wc + 100, to: hit - 80}, {kind: 'gust', at: hit - 80, head: 'R2', to: o.to, el: 'fire'},
              {kind: 'vortex', from: hit, to: hit + 2000, on: o.to}, {kind: 'status', name: 'toasty', at: hit, on: o.to, ms: 900});
    P.hits.push({ms: hit, head: 'L1', el: 'fire', status: 'toasty', ring: o.to}); },
  // 💧⚡ Storm Spout: L2's water makes a puddle on the ring → R3's bolt strikes the puddle 300 ms later → crackle ring = the ONE hit
  stormspout(P, o){ const wc = contactAt('castWater'), zc = contactAt('castZap'), wet = wc + 450, hit = wet + 300; P.heads.L2 = {act: 'castWater', at: 0}; P.heads.R3 = {act: 'castZap', at: hit - 220 - zc};
    P.tele.push({kind: 'ripple', el: 'water', from: 0, to: wet, at: o.to}, {kind: 'dash', el: 'bolt', from: hit - 220 - zc, to: hit, at: o.to});
    P.fx.push({kind: 'gather', el: 'water', head: 'L2', from: 100, to: wc}, {kind: 'jet', el: 'water', head: 'L2', at: wc, to: o.to, hit: wet}, {kind: 'splash', at: wet, on: o.to, size: 1.3},
              {kind: 'status', name: 'soaked', at: wet, on: o.to, ms: 700}, {kind: 'crackle', head: 'R3', from: hit - 220 - zc + 400, to: hit - 60}, {kind: 'bolt', at: hit - 220, on: o.to},
              {kind: 'crackleRing', from: hit, to: hit + 900, on: o.to}, {kind: 'status', name: 'zapped', at: hit, on: o.to, ms: 900});
    P.hits.push({ms: hit, head: 'R3', el: 'bolt', status: 'zapped', ring: o.to}); },
  // 🪨🌱 Stone Garden (defence): R1's spikes run to the lane + L3's roots rise between them = a wall row that blocks the lane
  stonegarden(P, o){ const rc = contactAt('castRock'), lc = contactAt('castLeaf'), wall = rc + 360 + 40; P.heads.R1 = {act: 'castRock', at: 0}; P.heads.L3 = {act: 'castLeaf', at: wall - 400 - lc};
    P.tele.push({kind: 'crack', el: 'rock', from: 0, to: wall, head: 'R1', at: o.to, across: true});
    P.fx.push({kind: 'splash', at: rc, head: 'R1', chin: true, size: 1.1}, {kind: 'splash', at: wall - 400, head: 'L3', chin: true, size: 0.5});
    for(let s = 1; s <= 3; s++) P.fx.push({kind: 'quake', at: rc + 120 * s - (s < 3 ? 0 : 0), head: 'R1', across: s - 2, to: o.to});
    [-1.5, -0.5, 0.5, 1.5].forEach((a, i) => P.fx.push({kind: 'sprout', el: 'leaf', at: wall + 40 * i, across: a, on: o.to}));
    P.hits.push({ms: wall, head: 'R1', el: 'rock', status: null, ring: o.to, wall: true}); },
  // 🌈 ✦✦✦ Rainbow Crown (ultimate, ONE per fight): the 6 element heads send a thread of their colour into the crown (1.2 s = the kid's window,
  //    lotus pads are safe, L4 / R4 guard) → a pillar of light + rainbow ring → 🫧 the dome rises. Calm: no flash.
  crown(P, o){ const go = contactAt('castCrown'); P.body = {act: 'castCrown', at: 0}; ['L1', 'L2', 'L3', 'R1', 'R2', 'R3'].forEach(id => { P.heads[id] = {act: 'castThread', at: 0}; });
    P.tele.push({kind: 'rainbow', from: 0, to: go, at: o.to}, {kind: 'lotus', from: 0, to: go + 600, pads: o.safe || [[o.to[0] - 1.6 * o.toH, o.to[1] + 6], [o.to[0] + 1.6 * o.toH, o.to[1] + 6]]});
    ['L1', 'L2', 'L3', 'R1', 'R2', 'R3'].forEach((id, i) => P.fx.push({kind: 'thread', el: HEAD_EL[id], head: id, from: 600 + 40 * i, to: go, i}));
    P.fx.push({kind: 'crownGlow', from: 600, to: go + 200}, {kind: 'pillar', at: go - 1200, on: o.to}, {kind: 'rainbowRing', at: go, on: o.to}, {kind: 'dome', from: go + 400, to: go + 2600});
    P.shake.push([go, 3, 300]); P.hits.push({ms: go, head: 'M', el: 'light', status: 'dazzled', ring: o.to});
    P.fx.push({kind: 'status', name: 'dazzled', at: go, on: o.to, ms: 700}); },
};
function ringAt(o, i, n){ const sp = o.toH * 0.95; return [o.to[0] + (i - (n - 1) / 2) * sp, o.to[1] + ((i % 2) ? 6 : -4)]; }

/* ================= 🪄 the API ================= */
function castable(id, form){ const d = typeof id === 'string' ? CR.get(id) : id; if(!d || d.fam !== 'serpent' || !(form >= 1)) return [];
  return Object.keys(SPELLS).filter(k => SPELLS[k].forms.indexOf(form) >= 0 && (d.id === 'phayanaga' || d.cast)); }
function cast(id, spell, o){ const d = typeof id === 'string' ? CR.get(id) : id, S = SPELLS[spell]; o = Object.assign({form: 3, x: 0, y: 0, size: 100, t: 0, toH: 90, seed: 7, t0: 0, basic: false, calm: false}, o || {});
  if(!d || !S || castable(d, o.form).indexOf(spell) < 0) return null;
  if(!o.to) o.to = [o.x - o.size * 2.6, o.y + 10]; o.k = o.k || o.toH / 92;
  const P = {id: d.id, def: d, spell, S, form: o.form, heads: {}, body: {act: 'castBody', at: 0}, tele: [], fx: [], hits: [], shake: []};
  BUILD[spell](P, o);
  // 🌱 Basic / calm: the warning shows 1.5 × longer — the whole cast waits that long first (the creature keeps idling)
  const first = Math.min.apply(null, P.hits.map(h => h.ms)), lead = (o.basic || o.calm) ? Math.round(first * 0.5) : 0;
  if(lead){ Object.keys(P.heads).forEach(h => { P.heads[h].at += lead; }); P.body.at += lead; P.tele.forEach(T => { const d = T.to - T.from; T.to += lead; T.from = Math.max(0, T.to - 1.5 * d); });
    P.fx.forEach(F => ['at', 'from', 'to', 'hit'].forEach(k => { if(typeof F[k] === 'number') F[k] += lead; })); P.hits.forEach(h => { h.ms += lead; }); P.shake.forEach(s => { s[0] += lead; }); }
  let end = 0; Object.keys(P.heads).forEach(h => { end = Math.max(end, P.heads[h].at + actLen(P.heads[h].act)); }); end = Math.max(end, P.body.at + actLen(P.body.act) + BODY_KEEP);
  P.fx.forEach(F => { end = Math.max(end, (F.to != null && typeof F.to === 'number' ? F.to : (F.at || 0)) + ({eruption: 1400, shot: 1500, pillar: 2200, quake: 1100, sprout: 1400, splash: 900, bolt: 1100, status: 900, gust: 800, rainbowRing: 900, bonk: 600}[F.kind] || 300)); });
  P.hits.sort((a, b) => a.ms - b.ms);
  // 😵 a status belongs to the hit on its ring — it shows only if that hit LANDED (onContact returning false = a miss, no status)
  P.fx.forEach(F => { if(F.kind === 'status') F.H = P.hits.find(h => h.ring === F.on && h.ms >= F.at) || P.hits.find(h => h.ring === F.on) || null; });
  // 📍 the FIXED moments whose geometry an effect needs (a spit, a slam) — read once each, ahead of time, one per frame (castFx prefetch)
  P.fx.forEach(F => { if(F.kind === 'shot' || F.kind === 'jet' || F.kind === 'gust' || (F.kind === 'splash' && F.chin)) F.g = F.at; else if(F.kind === 'quake' && F.across == null) F.g = F.at - 120 * Math.round(F.line * 3); });
  P.tele.forEach(T => { if(T.kind === 'crack') T.g = T.to - 400; else if(T.kind === 'rippleLine' || T.kind === 'chev') T.g = T.to; });
  const need = {}; P.fx.concat(P.tele).forEach(X => { if(X.g != null) need[X.g] = X.head || 'M'; }); P.need = Object.keys(need).map(Number).sort((a, b) => a - b).map(ms => [ms, need[ms]]);
  return Object.assign(P, {x: o.x, y: o.y, size: o.size, view: o.view, face: o.face, mir: o.view === 'SE' || o.view === 'NE' || o.face === 'right', t: o.t, to: o.to, toH: o.toH, k: o.k, seed: o.seed, calm: !!o.calm, day: !!o.day, basic: !!o.basic, lead, t0: o.t0,
    len: Math.ceil(end + 200), onContact: o.onContact || null, fired: P.hits.map(() => false), E: {}, G: null, els: castEls(o.form)}); }

function castFrame(C, ms){ const heads = {};
  Object.keys(C.heads).forEach(id => { const h = C.heads[id], L = actLen(h.act), t = ms - h.at; if(t <= 0 || t >= L) return;
    const w = Math.min(sm(Math.min(1, t / 160)), sm(Math.min(1, (L - t) / settleOf(h.act)))); if(w > 0) heads[id] = {act: h.act, ms: t, w}; });   // 🔥 own ⇄ trail blend
  const b = C.body, tb = ms - b.at, o = {form: C.form, view: C.view, t: C.t + ms / 1000, heads, castEls: C.els}; if(C.face) o.face = C.face;
  if(tb > 0 && tb < actLen(b.act) + BODY_KEEP){ o.act = b.act; o.ms = tb; } else o.pose = 'idle';   // 🐍 the act keeps running past its end until the heavy tail (it reads the act later, by mass) has settled — a switch to 'idle' earlier popped (probe 2026-11-21)
  return o; }
function castDraw(g, C, ms, extra){ return CR.draw(g, C.id, C.x, C.y, C.size, Object.assign(castFrame(C, ms), extra || {})); }

// 📍 geometry at a moment (a draw on a 1 px scratch canvas, cached per ms → pure)
let SCR = null;
//    two small caches: C.G = the FIXED moments (an effect's start, a slam) — a handful per cast, kept · C.cur = this frame only (kept memory flat: a per-frame cache grew without end → GC stalls)
function geo(C, ms, fixed, head){ if(C.cur && C.cur.ms === ms) return C.cur.A; C.G = C.G || {}; if(C.G[ms]) return C.G[ms];
  if(!SCR){ SCR = document.createElement('canvas'); SCR.width = SCR.height = 1; }
  const A = castDraw(SCR.getContext('2d'), C, ms, {noShadow: true, layer: head || 'M'}); if(fixed) C.G[ms] = A; else C.cur = {ms, A}; return A; }   // one layer paints half as much — the anchors are the same
const W = (C, A, p) => [C.x + (C.mir ? -1 : 1) * p[0] * A.u, C.y + p[1] * A.u];   // 🧭 anchors come in the creature's own (unmirrored) frame — ↘ ↗ and face 'right' are drawn mirrored
function headPt(C, A, id, key){ if(id === 'M') return W(C, A, key === 'crest' ? A.top : A.hand || A.top);
  const N = (A.necks || []).find(n => n.id === id); return N ? W(C, A, N[key || 'mouth']) : W(C, A, A.top); }
const chest = (C, R) => [R[0], R[1] - C.toH * 0.48];
// where a rock line starts: the chin hits the water at its contact
function chinPt(C, F){ const A = geo(C, F.g, true, F.head), m = headPt(C, A, F.head); return [m[0], C.y + 10 * C.k]; }
function lineFrom(C, head, at){ const A = geo(C, at, true, head), m = headPt(C, A, head); return [m[0], C.y + 10 * C.k]; }

/* ================= ⚠️ warnings (drawn under everything — every hit is warned, F10 + plan §23j ④) ================= */
function tele(g, C, T, ms){ if(ms < T.from - 1 || ms > T.to + 220) return; const fadeIn = clamp((ms - T.from) / 250, 0, 1), a = fadeIn * (ms > T.to ? 1 - (ms - T.to) / 220 : 1); if(a <= 0) return;
  const k = C.k, R = T.at, col = ELCOL[T.el] || '#E63946', pulse = 0.88 + 0.12 * Math.sin(ms / 90), left = clamp((ms - T.from) / Math.max(1, T.to - T.from), 0, 1), rx = 46 * k, ry = 13 * k;
  g.save(); g.globalAlpha *= a; g.lineCap = 'round';
  const timeArc = () => { g.setLineDash([]); g.lineWidth = 4 * k; g.strokeStyle = '#E63946'; g.beginPath(); g.ellipse(R[0], R[1], rx * pulse, ry * pulse, 0, -Math.PI / 2, -Math.PI / 2 + left * TAU); g.stroke(); };
  if(T.kind === 'ring' || T.kind === 'zone'){ g.strokeStyle = col; g.lineWidth = 4 * k; g.beginPath(); g.ellipse(R[0], R[1], rx * pulse * (T.kind === 'zone' ? 1.3 : 1), ry * pulse * (T.kind === 'zone' ? 1.3 : 1), 0, 0, TAU); g.stroke();
    if(T.kind === 'zone'){ g.fillStyle = 'rgba(230,57,70,0.16)'; g.fill(); } g.setLineDash([6 * k, 5 * k]); g.lineWidth = 2 * k; g.beginPath(); g.ellipse(R[0], R[1], rx * 0.6, ry * 0.6, 0, 0, TAU); g.stroke(); timeArc(); }
  else if(T.kind === 'ripple'){ for(let i = 0; i < 3; i++){ const q = ((ms / 700) + i / 3) % 1; g.strokeStyle = col; g.globalAlpha = a * (1 - q); g.lineWidth = 3 * k * (1 - q * 0.5); g.beginPath(); g.ellipse(R[0], R[1], rx * (0.35 + q * 0.75), ry * (0.35 + q * 0.75), 0, 0, TAU); g.stroke(); } g.globalAlpha = a; timeArc(); }
  else if(T.kind === 'dotted' || T.kind === 'dash'){ g.strokeStyle = col; g.lineWidth = 4 * k; g.setLineDash(T.kind === 'dotted' ? [1, 9 * k] : [12 * k, 7 * k]); g.lineDashOffset = -ms / 40; g.beginPath(); g.ellipse(R[0], R[1], rx * pulse, ry * pulse, 0, 0, TAU); g.stroke();
    if(T.kind === 'dash'){ g.setLineDash([]); g.fillStyle = 'rgba(40,50,90,' + (0.12 + 0.12 * left) + ')'; g.beginPath(); g.ellipse(R[0], R[1], rx * 1.25, ry * 1.25, 0, 0, TAU); g.fill(); }
    timeArc(); }
  else if(T.kind === 'rippleLine' || T.kind === 'crack' || T.kind === 'chev'){ const A = geo(C, T.g, true, T.head), m = headPt(C, A, T.head), S0 = [m[0], C.y + 10 * k];
    const E0 = T.across ? [R[0], R[1] - 30 * k] : R, E1 = T.across ? [R[0], R[1] + 30 * k] : R, n = 14;
    if(T.kind === 'crack'){ const from = T.across ? E0 : S0, to = T.across ? E1 : E0; g.strokeStyle = '#8A6A44'; g.lineWidth = 3 * k; g.beginPath();
      if(T.across){ g.moveTo(S0[0], S0[1]); for(let i = 1; i <= n; i++){ const u = i / n; g.lineTo(lerp(S0[0], R[0], u), lerp(S0[1], R[1], u) + (i % 2 ? 2 : -2) * k); } }
      for(let i = 0; i <= n; i++){ const u = i / n, x = lerp(from[0], to[0], u) + (T.across ? (i % 2 ? 3 : -3) * k : 0), y = lerp(from[1], to[1], u) + (T.across ? 0 : (i % 2 ? 3 : -2) * k); i || T.across ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    else if(T.kind === 'rippleLine'){ const q = clamp((ms - T.from) / Math.max(1, T.to - T.from), 0, 1); g.strokeStyle = col; g.lineWidth = 2.5 * k; g.setLineDash([2 * k, 6 * k]); g.beginPath(); g.moveTo(S0[0], S0[1]); g.lineTo(R[0], R[1]); g.stroke(); g.setLineDash([]);
      for(let i = 0; i < 2; i++){ const u = clamp(q - i * 0.15, 0, 1); if(u <= 0 || u >= 1) continue; const p = [lerp(S0[0], R[0], u), lerp(S0[1], R[1], u)]; g.beginPath(); g.ellipse(p[0], p[1], 12 * k, 4 * k, 0, 0, TAU); g.stroke(); } }
    else { const dir = Math.sign(R[0] - S0[0]) || -1; g.strokeStyle = col; g.lineWidth = 3.5 * k; for(let i = 0; i < 5; i++){ const u = ((i / 5) + ms / 900) % 1, x = lerp(S0[0], R[0], u), y = lerp(S0[1], R[1], u); g.globalAlpha = a * Math.sin(u * Math.PI);
      g.beginPath(); g.moveTo(x - dir * 6 * k, y - 7 * k); g.lineTo(x + dir * 2 * k, y); g.lineTo(x - dir * 6 * k, y + 7 * k); g.stroke(); } } }
  else if(T.kind === 'rainbow'){ ['#FF5A5A', '#FF9A3D', '#FFD43B', '#5CCB5F', '#3A9BFF', '#8A6BFF'].forEach((c, i) => { g.strokeStyle = c; g.lineWidth = 2.5 * k; g.beginPath(); g.ellipse(R[0], R[1], (rx + i * 6 * k) * 1.6 * pulse, (ry + i * 1.7 * k) * 1.6 * pulse, 0, 0, TAU); g.stroke(); }); timeArc(); }
  else if(T.kind === 'lotus'){ T.pads.forEach((p, i) => { g.fillStyle = '#5CCB5F'; g.strokeStyle = '#2E7A26'; g.lineWidth = 2 * k; g.beginPath(); g.ellipse(p[0], p[1], 30 * k, 9 * k, 0, 0.25, TAU - 0.25); g.lineTo(p[0], p[1]); g.closePath(); g.fill(); g.stroke();
      for(let j = 0; j < 5; j++){ const an = -Math.PI / 2 + (j - 2) * 0.42; g.fillStyle = j % 2 ? '#FFC1DA' : '#FF8FB8'; g.beginPath(); g.ellipse(p[0] + Math.cos(an) * 6 * k, p[1] - 6 * k + Math.sin(an) * 6 * k, 3.4 * k, 7 * k, an + Math.PI / 2, 0, TAU); g.fill(); }
      g.globalAlpha = a * (0.5 + 0.5 * Math.sin(ms / 160 + i)); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2 * k; g.beginPath(); g.ellipse(p[0], p[1], 36 * k, 11 * k, 0, 0, TAU); g.stroke(); g.globalAlpha = a; }); }
  g.restore(); }

/* ================= 🔥 the 3 fireball shots (DRAFT for 🎬 Motion → Motion.fx('fireball', {style}); drawn only with Motion.fxTools — look test v2, approved) ================= */
function shotPath(st, a, b, q, k){ return [lerp(a[0], b[0], q), lerp(a[1], b[1], q) - Math.sin(q * Math.PI) * SHOT[st].arc * k]; }
function shotDir(st, a, b, q, k){ const p = shotPath(st, a, b, Math.max(0, q - 0.01), k), n = shotPath(st, a, b, Math.min(1, q + 0.01), k); return Math.atan2(n[1] - p[1], n[0] - p[0]); }
function flameHead(M, g, x, y, ang, k, t, s){ const T = M.fxTools, E = M.FX_EL.fire; g.save(); g.translate(x, y); g.rotate(ang - Math.PI / 2);
  for(let i = 0; i < 3; i++) T.flameStack(g, (i - 1) * 3 * k, -2 * k, 10 * k, (26 + 6 * T.noise(t, i + s)) * k, T.noise(t * 2, i + s) * 3 * k, E, 1); g.restore();
  T.glow(g, x, y, 16 * k, E.glow, 0.9); g.save(); g.fillStyle = E.ramp[1]; g.beginPath(); g.arc(x, y, 5 * k, 0, TAU); g.fill(); g.restore(); }
// ✦✦✦ the Mekong naga fire-pearl: round, cel bands white → gold → orange (F4: hard bands, soft glow only behind), 3 kranok flame tails, a gold ring + 3 orbiting embers
function pearl(M, g, x, y, ang, k, t, grow){ const T = M.fxTools, E = M.FX_EL.fire, GOLD = '#FFD43B', r = 11 * k * grow;
  g.save(); g.translate(x, y); g.rotate(ang - Math.PI / 2);
  [-0.36, 0, 0.36].forEach((a, i) => { g.save(); g.rotate(a); const h = (38 + 8 * T.noise(t, i)) * k * grow, w = 12 * k * grow, s = T.noise(t * 2, i) * 3 * k, c = (i - 1) * 6 * k * grow;
    T.tongue(g, 0, -r * 0.2, w, h, s, E.ramp[4], c); T.tongue(g, 0, -r * 0.2, w * 0.7, h * 0.78, s, E.ramp[3], c * 0.8); T.tongue(g, 0, -r * 0.2, w * 0.42, h * 0.52, s, GOLD, c * 0.6); g.restore(); });
  g.restore(); T.glow(g, x, y, 44 * k * grow, E.glow, 0.85); T.glow(g, x, y, 20 * k * grow, '#FFFFFF', 0.7);
  g.save(); [[1, '#FF8A2A'], [0.8, '#FFC83D'], [0.56, '#FFE27A'], [0.3, '#FFFFFF']].forEach(([f, c], i) => { g.fillStyle = c; g.beginPath(); g.arc(x - r * 0.12 * i, y - r * 0.14 * i, r * f, 0, TAU); g.fill(); });
  g.strokeStyle = 'rgba(122,42,10,0.55)'; g.lineWidth = 1.2 * k; g.beginPath(); g.arc(x, y, r, 0, TAU); g.stroke(); g.restore();
  g.save(); g.translate(x, y); g.rotate(0.5 + Math.sin(t * 1.5) * 0.25); g.strokeStyle = GOLD; g.globalAlpha *= 0.8; g.lineWidth = 1.6 * k; g.beginPath(); g.ellipse(0, 0, r * 1.65, r * 0.55, 0, 0, TAU); g.stroke();
  for(let i = 0; i < 3; i++){ const a = t * 7 + i * TAU / 3, ex = Math.cos(a) * r * 1.65, ey = Math.sin(a) * r * 0.55, front = Math.sin(a) > 0; g.globalAlpha = front ? 1 : 0.55; g.fillStyle = front ? '#FFFFFF' : E.ramp[2]; g.beginPath(); g.arc(ex, ey, (front ? 2.6 : 1.8) * k, 0, TAU); g.fill(); }
  g.restore(); }
const motionShot = st => { const M = M_(); return !!(M && M.FX_STYLES && M.FX_STYLES.fireball && M.FX_STYLES.fireball.indexOf(st) >= 0); };   // 🎬 when Motion owns the styles, use them

/* ================= 🎆 FX (lazily made ONCE per cast with fixed t0 + seed → pure) ================= */
function fxObj(C, i, mk){ return C.E[i] || (C.E[i] = mk()); }
function drawFX(g, C, F, i, ms, layer){ const M = M_(); if(!M) return; const k = C.k, s = (C.t0 || 0), T = s + ms / 1000, seed = C.seed + i * 13, base = {calm: C.calm, day: C.day, seed};
  const start = F.kind === 'eruption' ? F.at - 120 : F.kind === 'sprout' ? F.at - 80 : F.kind === 'pillar' ? F.at : F.at != null ? F.at : F.from; if(start != null && ms < start) return;   // nothing before it starts (no early geometry reads)
  const mk = (kind, o, t0) => fxObj(C, i, () => M.fx(kind, Object.assign({}, base, o, {t0: s + t0 / 1000})));
  const both = E => { if(!E) return; if(layer === 'back') M.drawFxBack(g, E, T); else M.drawFx(g, E, T); };
  const back = E => { if(E && layer === 'back'){ M.drawFxBack(g, E, T); M.drawFx(g, E, T); } };
  switch(F.kind){
  case 'gather': { if(layer !== 'front' || ms < F.from || ms > F.to) return; const A = geo(C, ms), m = headPt(C, A, F.head), q = (ms - F.from) / (F.to - F.from), t = ms / 1000;
    if(F.el === 'fire'){ const st = F.style || 'ember', kk = SHOT[st].k * 0.8 * k;
      if(st === 'ember'){ const T2 = M.fxTools, E = M.FX_EL.fire; T2.flameStack(g, m[0], m[1] + 4 * kk, (6 + q * 12) * kk * 0.5, (8 + q * 16) * kk, T2.noise(t * 2, 3) * 2 * kk, E, 0.9); T2.glow(g, m[0], m[1], (10 + q * 12) * kk, E.glow, 0.8); T2.embers(g, m[0], m[1], 22 * kk, 26 * kk, 4, t, E, seed, 0.7 * q, 1.4 * kk); }
      else if(st === 'twin'){ for(let j = 0; j < 2; j++){ const a = t * 9 + j * Math.PI, r = 12 * kk * (1.2 - q * 0.5); flameHead(M, g, m[0] + Math.cos(a) * r, m[1] + Math.sin(a) * r * 0.6, a + Math.PI / 2, kk * (0.4 + q * 0.5), t, j * 3); } }
      else { pearl(M, g, m[0], m[1] - 4 * kk, -Math.PI / 2, kk, t, 0.25 + q * 0.75); M.fxTools.embers(g, m[0], m[1], 30 * kk, 40 * kk, 6, t, M.FX_EL.fire, seed, 0.8 * q, 1.6 * kk); } return; }
    // 💧🌪️ the other elements gather bits INTO the mouth (water drops · wind curls drawn in)
    const el = FXEL[F.el], n = C.calm ? 3 : 6; for(let j = 0; j < n; j++){ const u = ((t * 1.6 + j / n) % 1), an = j / n * TAU + t * 2, d = (1 - u) * 34 * k; M.fxTools.bit(g, el, m[0] + Math.cos(an) * d, m[1] + Math.sin(an) * d * 0.7, 3.2 * k * (0.6 + 0.6 * u), 1 - u, j + 3, t); }
    M.fxTools.glow(g, m[0], m[1], (8 + q * 10) * k, (M.FX_EL[el] || M.FX_EL.water).glow, 0.6 * q); return; }
  case 'shot': { const st = F.style || 'ember', S = SHOT[st], kk = S.k * k, t = ms / 1000, aA = geo(C, F.g, true, F.head), a = headPt(C, aA, F.head), b = F.chest === false ? [F.to[0], F.to[1] - 6 * k] : chest(C, F.to);
    if(st === 'ember' || motionShot(st)){ both(mk('fireball', {x: a[0], y: a[1], to: b, k: kk, style: st}, F.at)); return; }   // 🎬 Motion's own fireball (+ its style once Motion lists it)
    const q = (ms - F.at) / F.fly;
    if(layer === 'front' && q >= 0 && q < 1){ const p = shotPath(st, a, b, q, kk), ang = shotDir(st, a, b, q, kk);
      if(st === 'twin'){ const nx = -Math.sin(ang), ny = Math.cos(ang), Am = 16 * kk * (1 - 0.45 * q);
        for(let sd = 0; sd < 2; sd++){ const off = Am * Math.sin(q * 3 * Math.PI + sd * Math.PI);
          for(let j = 6; j >= 1; j--){ const qq = q - j * 0.028; if(qq < 0) continue; const pp = shotPath(st, a, b, qq, kk), oo = Am * Math.sin(qq * 3 * Math.PI + sd * Math.PI); g.save(); g.globalAlpha *= 0.7 * (1 - j / 7); g.fillStyle = M.FX_EL.fire.ramp[1 + Math.min(4, j >> 1)]; g.beginPath(); g.arc(pp[0] + nx * oo, pp[1] + ny * oo, (4.5 - j * 0.5) * kk, 0, TAU); g.fill(); g.restore(); }
          flameHead(M, g, p[0] + nx * off, p[1] + ny * off, ang, kk * 0.8, t, sd * 5); } }
      else { for(let j = 8; j >= 1; j--){ const qq = q - j * 0.022; if(qq < 0) continue; const pp = shotPath(st, a, b, qq, kk); g.save(); g.globalAlpha *= 0.6 * (1 - j / 9); g.fillStyle = j < 3 ? '#FFFFFF' : '#FFD43B'; g.beginPath(); g.arc(pp[0], pp[1], (5 - j * 0.45) * kk, 0, TAU); g.fill(); g.restore(); }
        pearl(M, g, p[0], p[1], ang, kk, t, 1); } }
    if(layer === 'back' && ms >= F.hit){ const e = (ms - F.hit) / 1000;
      if(st === 'twin') [[-9, 0], [9, 70]].forEach(([dx, dt], j) => { const E = fxObj(C, i + '.tw' + j, () => M.fx('fireball', Object.assign({}, base, {x: b[0] + dx * kk, y: b[1], to: [b[0] + dx * kk, b[1]], k: kk * 0.8, seed: seed + j, t0: s + (F.hit + dt) / 1000 - 0.45}))); M.drawFx(g, E, T); });
      if(st === 'pearl'){ const ER = fxObj(C, i + '.er', () => M.fx('eruption', Object.assign({}, base, {x: F.to[0], y: F.to[1], k: 0.95 * k, t0: s + F.hit / 1000 - 0.12}))); M.drawFxBack(g, ER, T); M.drawFx(g, ER, T);
        const PP = fxObj(C, i + '.pp', () => M.fx('fireball', Object.assign({}, base, {x: b[0], y: b[1], to: b, k: kk * 0.95, seed: seed + 2, t0: s + F.hit / 1000 - 0.45}))); M.drawFx(g, PP, T);
        const q2 = Math.min(1, e / 0.7); if(q2 < 1){ g.save(); g.globalAlpha *= 1 - q2; g.strokeStyle = '#FFD43B'; g.lineWidth = 3 * kk * (1 - q2 * 0.6); const R = (20 + 90 * M.fxTools.outQ(q2)) * kk, f = F.to;
          g.beginPath(); g.ellipse(f[0], f[1], R, R * 0.28, 0, 0, TAU); g.stroke(); for(let j = 0; j < 8; j++){ const an = j / 8 * TAU; g.fillStyle = '#FFD43B'; g.beginPath(); g.ellipse(f[0] + Math.cos(an) * R, f[1] + Math.sin(an) * R * 0.28 - 3 * kk, 3.5 * kk, 7 * kk * (1 - q2), 0, 0, TAU); g.fill(); } g.restore(); } } }
    return; }
  case 'jet': { const A = geo(C, F.g, true, F.head), a = headPt(C, A, F.head), b = chest(C, F.to); both(mk('fireball', {x: a[0], y: a[1], to: b, k: 0.8 * k, element: 'water'}, F.at)); return; }   // 💧 stand-in for Motion 'jet' (📨)
  case 'splash': { const p = F.chin ? chinPt(C, F) : [F.on[0], F.on[1]]; back(mk('splash', {x: p[0], y: p[1] - 4 * k, k: 0.8 * k, size: F.size || 1}, F.at)); return; }
  case 'quake': { let p; if(F.across != null){ p = [F.to[0], F.to[1] + F.across * 22 * k]; } else { const S0 = lineFrom(C, F.head, F.g); p = [lerp(S0[0], F.to[0], F.line), lerp(S0[1], F.to[1], F.line)]; }
    back(mk('quake', {x: p[0], y: p[1], k: 0.7 * k}, F.at)); return; }
  case 'sprout': { const p = F.across != null ? [F.on[0], F.on[1] + F.across * 16 * k] : F.on; back(mk('ground', {x: p[0], y: p[1], k: 0.75 * k, element: 'nature'}, F.at - 80)); return; }   // 🌱 stand-in for Motion 'sprout' (📨)
  case 'gust': { const A = geo(C, F.g, true, F.head), m = headPt(C, A, F.head), S0 = [m[0], C.y], p = [lerp(S0[0], F.to[0], 0.62), lerp(S0[1], F.to[1], 0.62) - 20 * k]; both(mk('gust', {x: p[0], y: p[1], k: 0.9 * k, dir: Math.sign(F.to[0] - S0[0]) || -1}, F.at));
    if(F.el === 'fire' && layer === 'front' && ms >= F.at && ms < F.at + 600) M.fxTools.embers(g, p[0], p[1], 60 * k, 40 * k, 6, ms / 1000, M.FX_EL.fire, seed, 0.9 * (1 - (ms - F.at) / 600), 1.6 * k); return; }
  case 'crackle': { if(ms < F.from || ms > F.to + 200) return; const A = geo(C, ms), c = headPt(C, A, F.head, 'crest'); const E = mk('crackle', {x: c[0], y: c[1], k: 0.7 * k, r: 18}, F.from); E.move(c[0], c[1]); if(ms >= F.to) E.stop(s + F.to / 1000); if(layer === 'front') M.drawFx(g, E, T); return; }
  case 'bolt': { const p = F.on; both(mk('bolt', {x: p[0], y: p[1], k: 0.85 * k, top: C.y - 420 * k}, F.at)); return; }
  case 'crackleRing': { if(ms < F.from) return; const E = mk('crackle', {x: F.on[0], y: F.on[1] - 4 * k, k: 0.9 * k, r: 34}, F.from); E.stop(s + F.to / 1000); if(layer === 'back') M.drawFx(g, E, T); return; }
  case 'eruption': back(mk('eruption', {x: F.on[0], y: F.on[1], k: 0.8 * k}, F.at - 120)); return;
  case 'vortex': { if(ms < F.from) return; const E = mk('vortex', {x: F.on[0], y: F.on[1], k: 0.7 * k, r: 50}, F.from); E.stop(s + F.to / 1000); both(E); return; }
  case 'status': { if(layer !== 'front' || ms < F.at || (F.H && F.H.landed === false)) return; const E = fxObj(C, i, () => M.status(F.name, Object.assign({}, base, {x: F.on[0], y: F.on[1], k: C.k * 0.85, ms: F.ms, t0: s + F.at / 1000, face: [F.on[0], F.on[1] - C.toH * 0.78, C.toH * 0.26]})));
    if(E) M.drawFx(g, E, T); return; }
  case 'bonk': { if(layer !== 'front' || !M.hit || !M.drawHitFx) return; const H = fxObj(C, i, () => M.hit({kind: 'blunt', weight: 'medium', seed, calm: C.calm, element: 'light'})), p = chest(C, F.on);
    M.drawHitFx(g, H, ms - F.at, p[0], p[1], k, Math.sign(p[0] - C.x) || -1); return; }
  case 'thread': { if(layer !== 'front' || ms < F.from || ms > F.to + 120) return; const A = geo(C, ms), a = headPt(C, A, F.head), c = crownPt(C, A), q = clamp((ms - F.from) / (F.to - F.from), 0, 1), el = FXEL[F.el], R = (M.FX_EL[el] || M.FX_EL.light).ramp, t = ms / 1000;
    // 🌈 stand-in for Motion 'thread' (📨): a bending ribbon of its colour + motes running INTO the crown
    const mid = [(a[0] + c[0]) / 2 + (a[0] < c[0] ? -1 : 1) * 18 * k, Math.min(a[1], c[1]) - 26 * k], pt = u => [(1 - u) * (1 - u) * a[0] + 2 * u * (1 - u) * mid[0] + u * u * c[0], (1 - u) * (1 - u) * a[1] + 2 * u * (1 - u) * mid[1] + u * u * c[1]];
    const fade = ms > F.to ? 1 - (ms - F.to) / 120 : Math.min(1, q * 4); g.save(); g.globalAlpha *= fade; g.lineCap = 'round';
    [[4.2, R[4]], [2.4, R[2]], [1, R[0]]].forEach(([w, col]) => { g.strokeStyle = col; g.lineWidth = w * k; g.beginPath(); for(let j = 0; j <= 16; j++){ const p = pt(j / 16); const wob = Math.sin(j * 0.9 - t * 8) * 1.5 * k; j ? g.lineTo(p[0], p[1] + wob) : g.moveTo(p[0], p[1]); } g.stroke(); });
    const n = C.calm ? 3 : 5; for(let j = 0; j < n; j++){ const u = (t * 1.3 + j / n) % 1, p = pt(u); M.fxTools.bit(g, el, p[0], p[1], 3.4 * k, 0.2, j + F.i * 7, t); } g.restore(); return; }
  case 'crownGlow': { if(layer !== 'front' || ms < F.from || ms > F.to) return; const A = geo(C, ms), c = crownPt(C, A), q = clamp((ms - F.from) / (F.to - F.from - 200), 0, 1), t = ms / 1000;
    M.fxTools.glow(g, c[0], c[1], (14 + 26 * q) * k, '#FFFFFF', 0.85); ['#FF5A5A', '#FF9A3D', '#FFD43B', '#5CCB5F', '#3A9BFF', '#8A6BFF'].forEach((col, j) => { const an = t * 3 + j / 6 * TAU, r = (10 + 10 * q) * k; g.fillStyle = col; g.beginPath(); g.arc(c[0] + Math.cos(an) * r, c[1] + Math.sin(an) * r * 0.5, (2 + 2 * q) * k, 0, TAU); g.fill(); }); return; }
  case 'pillar': both(mk('pillar', {x: F.on[0], y: F.on[1], to: F.on, k: 0.8 * k, element: 'light', box: null}, F.at)); return;
  case 'rainbowRing': { if(layer !== 'back' || ms < F.at || ms > F.at + 900) return; const q = (ms - F.at) / 900;
    g.save(); ['#FF5A5A', '#FF9A3D', '#FFD43B', '#5CCB5F', '#3A9BFF', '#8A6BFF'].forEach((col, j) => { const qq = clamp(q - j * 0.04, 0, 1), R = (30 + 150 * M.fxTools.outQ(qq)) * k; g.globalAlpha = (1 - qq); g.strokeStyle = col; g.lineWidth = 4 * k * (1 - qq * 0.7);
      g.beginPath(); g.ellipse(F.on[0], F.on[1], R, R * 0.28, 0, 0, TAU); g.stroke(); }); g.restore(); return; }
  case 'dome': { if(ms < F.from) return; const E = mk('dome', {x: C.x, y: C.y, k: k, r: C.size * 1.1 / k}, F.from); if(ms >= F.to) E.stop(s + F.to / 1000); both(E); return; }
  } }
function crownPt(C, A){ const c = W(C, A, A.top); return [c[0], c[1] - 30 * C.k]; }

function castFx(g, C, ms, layer, A){ if(!C) return; layer = layer || 'front'; if(A && A.u) C.cur = {ms, A};   // 🐢 the anchors of THIS frame's castDraw → no extra geometry draw
  if(layer === 'back') C.tele.forEach(T => tele(g, C, T, ms));
  if(layer === 'front') C.hits.forEach((h, i) => { if(!C.fired[i] && ms >= h.ms){ C.fired[i] = true; if(C.onContact) h.landed = C.onContact(C, i, h) !== false; } });   // F10: ONE contact per hit, at the pop — BEFORE the FX, so a miss never paints its status
  C.fx.forEach((F, i) => { try { drawFX(g, C, F, i, ms, layer); } catch(e){ (CR.CAST_ERRORS = CR.CAST_ERRORS || []).push(F.kind + ': ' + e.message); } });
  if(layer === 'front'){ const nx = C.need.find(([m]) => !(C.G && C.G[m]) && m > ms && m - ms < 900); if(nx) geo(C, nx[0], true, nx[1]); }   // 🐢 prefetch ONE fixed moment a frame, before it is needed (same geometry → pure)
 }
function castAt(C, ms){ let sx = 0, sy = 0;
  if(!C.calm) C.shake.forEach(([at, px, dur]) => { const dt = ms - at; if(dt >= 0 && dt < dur){ const q = 1 - dt / dur; sx += Math.sin(dt * 0.09) * px * q; sy += Math.cos(dt * 0.07) * px * q * 0.6; } });
  const M = M_(); if(M) Object.keys(C.E).forEach(key => { const E = C.E[key]; if(E && E.at){ const r = E.at((C.t0 || 0) + ms / 1000); if(r.shake){ sx += r.shake.x; sy += r.shake.y; } } });
  const hits = C.hits.filter(h => ms >= h.ms), next = C.hits.find(h => ms < h.ms) || null; let beat = null;
  Object.keys(C.heads).forEach(id => { const h = C.heads[id], t = ms - h.at; if(t >= 0 && t < actLen(h.act)){ const r = CR.sample(h.act, t); if(!beat || r.contact) beat = (r.contact ? 'contact' : r.beat) + ' · ' + id; } });
  return {hits, next, shake: {x: sx, y: sy}, done: ms >= C.len, beat}; }

Object.assign(CR, {SPELLS, cast, castFrame, castDraw, castFx, castAt, castable, castEls, CAST_HEAD_EL: HEAD_EL, CAST_FXEL: FXEL, CAST_SHOT: SHOT});
CR.CAST = 'av-naga6';
})();
