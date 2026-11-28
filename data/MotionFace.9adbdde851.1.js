
/* 😠 MotionFace (🎬 Motion chat, mo-37, 2026-11-28 — Aowu 17:14 + 17:39 "ok go" = Motion rules §112 P1–P4) — a FACE POOL per act / beat: each time an act PLAYS it picks one face from the pool
   ("5 random outputs so one action can be several gestures, so the player is not angry all the time").
   Opt-in: a beat (or a one-pose act) gets `faces: [keys]` or `faces: 'strike'` (a named pool) BESIDE its normal `face` — no `faces` = the old picture, pixel-identical,
   and every old reader (beatFrames · covers · comics) keeps drawing `face` (the fallback), never an array.
   The pick = a pure function of (who.name, act, play number n): the same on every 📡 device that plays the same moments, never the same face twice in a row.
   n = o.n from the game (e.g. its moment counter — use it on linked devices), else this kit counts the plays of that person + act itself.
   Acting.draw(g, who, x, y, k, 'act', {n}) draws the face play n would show (no n = the last play of that person + act, or play 0) → draw and play agree.
   USE (data, in the block that owns the act):  'beat.punch': {beats: [{…}, {pose: 'b.punch-cock', face: 'fierce', faces: 'strike', ms: 140}, …]}  ·  punch: {pose: 'punch', face: 'focused', faces: 'strike'}
       a linked game: run = Acting.play(who, act, {t0, n: moment.i})   ·   Acting.FACES.pick(name, act, n) → the pool index · Acting.FACES.POOLS (add a named pool: POOLS.cheer = [...])
   Loads WITH include('AvatarKit') right after MotionWalk (Code.gs INCLUDE_ALSO_). AvatarActing's own readers (resolve · beatFrames · frameR) never see `faces`: they draw `face`. Rules: Motion rules.md §112–114. */
(function () {
const A = window.Acting; if (!A || !A.play || A.FACES) return;
const POOLS = {strike: ['focused', 'cheeky', 'effort', 'angry', 'cool']};
const hash = s => { let x = 2166136261; for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 16777619);
  x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return x >>> 0; };   // FNV-1a + the murmur3 finish (well mixed: play 7 and play 8 differ)
const poolOf = f => !f ? null : Array.isArray(f) ? (f.length ? f : null) : (POOLS[f] || null);
const SEQ = {}, COUNT = {}, LAST = {};
function pickIx(name, act, n, L) { if (L < 2) return 0; const key = name + '|' + act + '|' + L, m = SEQ[key] || (SEQ[key] = []);
  while (m.length <= n) { const i = m.length, r = hash(key + '#' + i); m.push(i === 0 ? r % L : (m[i - 1] + 1 + r % (L - 1)) % L); } return m[n]; }
function poolsOf(act) { if (!act) return null; const out = act.beats ? act.beats.map((b, i) => poolOf(b.faces)) : [poolOf(act.faces)];
  if (act.beats && act.faces) { const ci = act.beats.findIndex(b => b.contact), c = ci >= 0 ? ci : Math.min(2, act.beats.length - 1); if (!out[c]) out[c] = poolOf(act.faces); }   // act-level pool = its contact beat
  return out.some(Boolean) ? out : null; }
const Lmax = P => Math.max.apply(null, P.map(p => p ? p.length : 1));
function nFor(name, act, o, count) { const k = name + '|' + act; if (o && o.n != null) return (LAST[k] = Math.max(0, Math.floor(o.n)));
  if (count) return (LAST[k] = COUNT[k] = (COUNT[k] != null ? COUNT[k] + 1 : 0)); return LAST[k] != null ? LAST[k] : 0; }
const play0 = A.play;
A.play = function (who, actKey, o) { const run = play0.apply(this, arguments), act = A.act(actKey), P = poolsOf(act); if (!P) return run;
  const name = (who && who.name) || '', n = nFor(name, actKey, o, true), ix = pickIx(name, actKey, n, Lmax(P));
  const one = !act.beats, faceAt = i => { const p = one ? P[0] : P[i]; return p ? p[ix % p.length] : null; };
  run.face = {n, ix, of: P};
  const at0 = run.at; run.at = function (t) { const f = at0.call(run, t), i = f.i, q = f.q, b = faceAt(i), pb = i > 0 ? faceAt(i - 1) : b;
    if (one) { if (b) f.face = b; } else if (b || pb) { const B0 = run.beats[i], PB = i > 0 ? run.beats[i - 1] : B0, fb = b || B0.face, fpb = pb || PB.face; f.face = (q < 0.5 ? fpb : fb) || fb || fpb || f.face; }
    return f; };
  return run; };
const draw0 = A.draw;
A.draw = function (g, who, x, y, k, actKey, opt) { if (typeof actKey !== 'string') return draw0.apply(this, arguments);
  const T = A.T, act = T.acts[actKey], P = poolsOf(act); if (!P) return draw0.apply(this, arguments);
  const name = (who && who.name) || '', n = nFor(name, actKey, opt, false), ix = pickIx(name, actKey, n, Lmax(P)), tmp = Object.assign({}, act);
  if (!act.beats) tmp.face = P[0][ix % P[0].length];
  else { const ci = act.beats.findIndex(b => b.contact), c = ci >= 0 ? ci : Math.min(2, act.beats.length - 1); tmp.beats = act.beats.slice(); if (P[c]) tmp.beats[c] = Object.assign({}, act.beats[c], {face: P[c][ix % P[c].length]}); }
  T.acts[actKey] = tmp; try { return draw0.apply(this, arguments); } finally { T.acts[actKey] = act; } };
A.FACES = {POOLS, pick: (name, act, n) => { const P = poolsOf(A.act(act)); return P ? pickIx(name || '', act, n, Lmax(P)) : null; }, reset: () => { [SEQ, COUNT, LAST].forEach(o => Object.keys(o).forEach(k => delete o[k])); }, VERSION: 'mo-37'};
})();
