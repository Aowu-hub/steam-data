
/* ================= ① CONFIG — 🧩 the ONE block a new game edits first (new_game.py fills it) ================= */
const GAME_ID = 'gopalm';            // GameID (Games tab · LEVEL_GAMES · boards · UI.KINDS · GameCovers block · 🎭 block)
const GAME_NAME = 'GOpalm';
const GAME_ICON = '⚫⚪';
const GAME_VERSION = '0.1';           // shown on the cover footer — bump with each round of your game
const GAME_GOAL = 'Surround stones to win land!';   // one line kids read (cover story + setup)
const GAME_STEPS = ['plan', 'rules', 'understand', 'adapt'];   // 🌟 b6b: the Steps of Creation this game trains (pitch §1)
const MOOD_FAMILY = 'board';          // 🎵 calm thinking (pitch §5) until the 🎵 lane gives GOpalm its own music-box recipe
const DEMO = GAME_ID === 'starter';
if(window.UI && UI.KINDS && !UI.KINDS[GAME_ID]) UI.KINDS[GAME_ID] = [GAME_ICON, 'Getting GOpalm ready', 'a-bounce'];
if(window.UI && UI.GAME_HELP && !UI.GAME_HELP[GAME_ID]) UI.GAME_HELP[GAME_ID] = ['Surround stones to win land! Real Go with a magician\'s glove.',
  'Tap a point to show your stone, tap it again to place it (🌱 Basic: one tap). A stone or group with no empty points next to it is palmed away. Two ✋ passes in a row end the game: stones + land win.',
  'Watch the breathing holes — a group with only 1 left blinks red. Save it, or take theirs first!'];

const WEBAPP_URL = SP_TV[0];
const CURRENT_PLAYER = SP_TV[1]; window.SP_PAGE = SP_TV[2];
const MODE_LINK = SP_TV[3];
UI.applyTheme(UI.cachedTheme(CURRENT_PLAYER), {kitOnly: true});
const SESSION_START = Number(SP_TV[4]) || null;
const DURATION_MIN = Number(SP_TV[5]) || null;
const $ = id => document.getElementById(id);
const stClamp = (v, a, b) => Math.max(a, Math.min(b, v));
const S = {players: [], progress: {}, settings: {}, avatars: {}, player: '', age: ''};
let G = null, rafId = 0, lockHandle = null;
['t-icon'].forEach(id => { const e = $(id); if(e) e.textContent = GAME_ICON; }); ['t-name', 'm-name'].forEach(id => { const e = $(id); if(e) e.textContent = GAME_NAME; }); $('m-goal').textContent = GAME_GOAL;

/* ================= ② LEVELS + MAPS + MODES ================= */
// 6 levels: the 🤖 Cawdini bot grows (0 sleepy · 1 sees danger · 2+ thinks ahead with playouts); helps fade (pitch §2). n = the level's own board.
const LEVELS = [
  {name: 'Basic', emoji: '🌱', n: 5, bot: 0, botNoCapture: true, goal: 1, hints: 99, undo: true, oneTap: true, guided: true, blurb: 'Cawdini is sleepy — all help on'},
  {name: 'Junior', emoji: '🐣', n: 7, bot: 1, goal: 3, hints: 3, undo: true, blurb: 'Cawdini sees danger · 3 hints'},
  {name: 'Intermediate', emoji: '🔦', n: 9, bot: 2, goal: 5, hints: 1, blurb: 'Cawdini thinks ahead · 1 hint'},
  {name: 'Hard', emoji: '⚡', n: 9, bot: 3, goal: 5, hints: 0, blurb: 'A stronger Cawdini · no help'},
  {name: 'Extreme', emoji: '🌋', n: 13, bot: 4, goal: 7, hints: 0, blurb: 'Cawdini\'s best tricks'},
  {name: 'Hardcore', emoji: '💀', n: 13, bot: 5, goal: 7, hints: 0, noHelp: true, hardcore: true, mult: 3, blurb: 'No undo · no hints · points ×3'}
];
// 🗺️ board size first (P3e rule), "Level size" keeps records comparable; points × size. 19×19 needs a big screen (phones: turn sideways).
const MAP_SIZES = [
  {k: 'std', icon: '🎚️', name: 'Level size', sub: 'The level\'s own board'},
  {k: '5', icon: '🌱', name: '5 × 5', n: 5, sub: 'Tiny · ×1'},
  {k: '7', icon: '🌿', name: '7 × 7', n: 7, sub: 'Small · ×1.25'},
  {k: '9', icon: '🌳', name: '9 × 9', n: 9, sub: 'Kids\' classic · ×1.5'},
  {k: '13', icon: '🌲', name: '13 × 13', n: 13, sub: 'Big · ×2'},
  {k: '19', icon: '🏔️', name: '19 × 19', n: 19, sub: 'The real one · ×3'}
];
const MULT_OF_N = {5: 1, 7: 1.25, 9: 1.5, 13: 2, 19: 3};
const smallUpright = () => Math.min(innerWidth, innerHeight) < 520 && innerHeight > innerWidth;
function levelFor(i, sizeKey){
  const L = Object.assign({}, LEVELS[i]), M = MAP_SIZES.find(m => m.k === sizeKey) || MAP_SIZES[0], std = M.k === 'std';
  L.n = std ? L.n : M.n; L.size = std ? 'std' : M.k; L.std = std; L.sizeMult = MULT_OF_N[L.n] || 1;
  L.theme = L.n + '×' + L.n; return L;   // the board goes in the Archive Theme column ("9×9")
}
const MODE_GROUPS = [{k: 'classic', icon: '🏛️', en: 'Classic Go', th: 'โกะแบบดั้งเดิม', c: '#2A2233'}];
const MODES = [
  {k: 'capture', g: 'classic', icon: '🎯', name: 'Capture Go', type: 'The kid starter', sub: 'First to palm the goal number of stones wins'},
  {k: 'classic', g: 'classic', icon: '⚫', name: 'Classic Go', type: 'Real rules', sub: 'Surround land — stones + land win (komi 7.5)'}
];
window.MODE_TYPE = {capture: 'The kid starter', classic: 'Real rules'};
const PART_OF = mode => null;   // 🌱 born split: a big new mode (🧩 Magic Tricks book) is born as GOpalm_<part> (Test Harness/parts/README.md)
function partReady(mode){ const f = PART_OF(mode); return !f || (typeof GameParts !== 'undefined' && GameParts.has(f)); }
function partPrefetch(mode){ const f = PART_OF(mode); if(f && typeof GameParts !== 'undefined' && !GameParts.has(f)) GameParts.need(f); }
function partNeed(mode, go){ const f = PART_OF(mode); if(!f) return go();
  if(typeof GameParts === 'undefined' || !GameParts.need){ UI.toast('📡 This way to play is missing its part file', 'err'); return; }
  if(GameParts.has(f)) return go();
  UI.loading(GAME_ID); GameParts.need(f, ok => { UI.loaded(); if(ok) return go(); UI.toast('📡 This way to play did not load — check the internet, then tap ▶ Start again', 'err'); });
}
const RIVAL = {name: 'Cawdini', icon: '🐦‍⬛'};   // the cheeky crow magician (his own art comes with the 🎩 act pack)

/* ================= ③ ENGINE — DOM-free (node tests load it: // ENGINE START … END) ================= */
// ENGINE START
const ENG = (function(){
  /* ⚫⚪ GOpalm rules engine (gp-r0) — DOM-free, seeded, fixed 120 Hz clock (the clock only times the 🎬 beats; the game itself is turn-based).
     Real Go: place · capture (a group with no breathing holes = liberties is taken) · no suicide · ko (simple, one-stone recapture) · two passes end ·
     ⭐ area scoring (stones + land, komi to white). Capture Go: the first to take `goal` stones wins. Board 1 = black (goes first), 2 = white. */
  const DT = 1 / 120, THINK = 0.55, FLY = 0.2;
  const rng = seed => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const NB = {}, MK = {};
  function nbs(n){ if(NB[n]) return NB[n]; const a = []; for(let i = 0; i < n * n; i++){ const x = i % n, y = (i / n) | 0, l = []; if(x > 0) l.push(i - 1); if(x < n - 1) l.push(i + 1); if(y > 0) l.push(i - n); if(y < n - 1) l.push(i + n); a.push(l); } return NB[n] = a; }
  function marks(n){ return MK[n] || (MK[n] = {s: new Int32Array(n * n), l: new Int32Array(n * n), st: 0}); }
  // one group: its stones + how many breathing holes (liberties) + one of them
  function grp(B, n, i){
    const N = nbs(n), m = marks(n), c = B[i], st = ++m.st, stack = [i], stones = []; let libs = 0, lib = -1; m.s[i] = st;
    while(stack.length){ const p = stack.pop(); stones.push(p);
      for(const q of N[p]){ const v = B[q];
        if(v === 0){ if(m.l[q] !== st){ m.l[q] = st; libs++; lib = q; } }
        else if(v === c && m.s[q] !== st){ m.s[q] = st; stack.push(q); } } }
    return {stones, libs, lib, c};
  }
  // put a stone (mutates B) → null when illegal (taken point · ko · suicide), else {cap: [points], ko, libs, size}
  function place(B, n, i, c, ko){
    if(B[i] || i === ko) return null; const N = nbs(n), o = 3 - c, cap = []; B[i] = c;
    for(const q of N[i]) if(B[q] === o){ const g = grp(B, n, q); if(g.libs === 0) g.stones.forEach(s => { B[s] = 0; cap.push(s); }); }
    const me = grp(B, n, i);
    if(me.libs === 0){ B[i] = 0; return null; }
    return {cap, ko: cap.length === 1 && me.stones.length === 1 && me.libs === 1 ? cap[0] : -1, libs: me.libs, size: me.stones.length};
  }
  function legal(B, n, i, c, ko){ if(B[i] || i === ko) return false; const T = B.slice(); return !!place(T, n, i, c, ko); }
  function isEye(B, n, i, c){
    if(B[i]) return false; const N = nbs(n); for(const q of N[i]) if(B[q] !== c) return false;
    const x = i % n, y = (i / n) | 0; let bad = 0, edge = x === 0 || y === 0 || x === n - 1 || y === n - 1;
    for(const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]){ const X = x + dx, Y = y + dy; if(X < 0 || Y < 0 || X >= n || Y >= n) continue; if(B[Y * n + X] === 3 - c) bad++; }
    return edge ? bad === 0 : bad <= 1;
  }
  // ⭐ area scoring: stones + empty land touching only one colour; owner map 1 / 2 / 0 (shared)
  function score(B, n, komi){
    const N = nbs(n), own = new Int8Array(n * n), seen = new Uint8Array(n * n), land = [0, 0, 0], stones = [0, 0, 0];
    for(let i = 0; i < n * n; i++){ if(B[i]){ stones[B[i]]++; own[i] = B[i]; continue; } if(seen[i]) continue;
      const reg = [], st = [i]; let touch = 0; seen[i] = 1;
      while(st.length){ const p = st.pop(); reg.push(p); for(const q of N[p]){ const v = B[q]; if(v) touch |= v; else if(!seen[q]){ seen[q] = 1; st.push(q); } } }
      const w = touch === 1 ? 1 : touch === 2 ? 2 : 0; if(w){ land[w] += reg.length; reg.forEach(p => { own[p] = w; }); } }
    const black = stones[1] + land[1], white = stones[2] + land[2] + komi;
    return {land, stones, own, black, white, winner: black > white ? 1 : 2, margin: Math.abs(black - white)};
  }
  // 🎲 quick random game to the end (Monte-Carlo playout) → the winner
  function playout(B, n, c, ko, R, mode, caps, goal, komi){
    let pass = 0, moves = 0; const max = n * n * 2, empt = []; caps = caps.slice();
    while(pass < 2 && moves < max){
      empt.length = 0; for(let i = 0; i < n * n; i++) if(!B[i]) empt.push(i);
      let done = false;
      for(let k = empt.length; k > 0; k--){ const j = (R() * k) | 0, i = empt[j]; empt[j] = empt[k - 1];
        if(isEye(B, n, i, c)) continue; const r = place(B, n, i, c, ko); if(!r) continue;
        ko = r.ko; caps[c] += r.cap.length; done = true; break; }
      if(mode === 'capture' && caps[c] >= goal) return c;
      pass = done ? 0 : pass + 1; c = 3 - c; moves++; if(!done) ko = -1;
    }
    if(mode === 'capture' && caps[1] !== caps[2]) return caps[1] > caps[2] ? 1 : 2;
    return score(B, n, komi).winner;
  }
  // 🧠 how good a move looks (no search): take stones · save mine · threaten · stay safe · stay near the play
  function judge(M, B, i, c){
    const n = M.n, T = B.slice(), r = place(T, n, i, c, M.ko); if(!r) return null; const N = nbs(n), o = 3 - c; let s = 0;
    s += r.cap.length * (M.mode === 'capture' ? 30 : 12);
    for(const q of N[i]) if(B[q] === c){ const g = grp(B, n, q); if(g.libs === 1 && r.libs >= 2) s += 9 + g.stones.length * 2; }   // a save
    for(const q of N[i]) if(T[q] === o){ const g = grp(T, n, q); if(g.libs === 1) s += M.mode === 'capture' ? 8 : 4; }   // atari on them
    if(r.libs === 1 && !r.cap.length) s -= 14 + r.size * 2;   // walks into atari
    if(r.libs === 2 && M.mode === 'capture') s -= 2;
    if(isEye(B, n, i, c)) s -= 20;
    const x = i % n, y = (i / n) | 0, edge = Math.min(x, y, n - 1 - x, n - 1 - y);
    if(M.moves < n && n >= 7) s += edge === 2 || (n >= 13 && edge === 3) ? 3 : edge === 0 ? -4 : 0;
    let near = 0; for(const q of N[i]) if(B[q]) near++; if(M.moves > 2) s += near ? 1.5 : edge === 0 ? -1.5 : 0;
    return {s, r, T};
  }
  // empty points still worth playing: not settled land (land of one colour with nothing to take or save there)
  function open(M, c){
    const n = M.n, B = M.B, sc = score(B, n, 0), out = [];
    for(let i = 0; i < n * n; i++){ if(B[i] || i === M.ko) continue;
      if(isEye(B, n, i, c)) continue;
      let hot = false; for(const q of nbs(n)[i]) if(B[q] && grp(B, n, q).libs <= 2){ hot = true; break; }
      if(sc.own[i] && !hot && M.moves > n) continue;   // settled land: leave it
      out.push(i); }
    return out;
  }
  // 🤖 a move for colour c at strength lvl (0 sleepy · 1 sees danger · 2+ thinks with playouts) → index, or -1 = pass
  const PLAYOUTS = [0, 0, 48, 120, 240, 300];
  function choose(M, c, lvl){
    const n = M.n, R = M.R, cand = [];
    for(const i of open(M, c)){ const j = judge(M, M.B, i, c); if(j) cand.push({i, s: j.s + R() * (lvl <= 1 ? 6 : 1.5), cap: j.r.cap.length}); }
    if(!cand.length) return -1;
    if(lvl <= 0){ const calm = M.L && M.L.botNoCapture ? cand.filter(x => !x.cap) : cand, pool = (calm.length ? calm : cand).filter(x => x.s > -10); const p = pool.length ? pool : cand; return p[(R() * p.length) | 0].i; }
    cand.sort((a, b) => b.s - a.s);
    if(lvl === 1 || cand[0].s >= 25) return cand[0].i;
    // the opponent just passed and I'm ahead → pass too (the game ends)
    if(M.passes && M.mode !== 'capture'){ const sc = score(M.B, n, M.komi); if(sc.winner === c) return -1; }
    const K = Math.min(cand.length, lvl >= 4 ? 14 : 10), top = cand.slice(0, K), P = Math.max(4, Math.round(PLAYOUTS[Math.min(5, lvl)] * 81 / (n * n) / K));
    let best = null;
    for(const x of top){ let w = 0; for(let k = 0; k < P; k++){ const T = M.B.slice(), r = place(T, n, x.i, c, M.ko), caps = M.caps.slice(); caps[c] += r.cap.length;
        if(playout(T, n, 3 - c, r.ko, R, M.mode, caps, M.goal, M.komi) === c) w++; }
      const v = w / P + x.s * 0.004; if(!best || v > best.v) best = {i: x.i, v}; }
    return best.i;
  }
  // ---------------- a match ----------------
  function newMatch(cfg){
    const L = cfg.L, n = cfg.n || L.n, mode = cfg.mode || 'classic', me = cfg.me || 1, vs = cfg.vs || 'bot';
    const M = {n, B: new Int8Array(n * n), turn: 1, me, vs, mode, L, goal: L.goal || 1, komi: mode === 'capture' ? 0 : (cfg.komi != null ? cfg.komi : 7.5),
      caps: [0, 0, 0], ko: -1, passes: 0, over: false, cleared: false, winner: 0, why: '', t: 0, ev: [], hist: [], moves: 0, pending: null, botAt: -1,
      R: rng((cfg.seed >>> 0) || 1), last: -1, bigCap: 0, maxMoves: n * n * 3, undos: 0, hints: 0, score: null};
    return M;
  }
  const whoOf = (M, c) => c === M.me ? 'me' : M.vs === 'bot' ? 'bot' : 'p2';
  const botTurn = M => M.vs === 'bot' && M.turn !== M.me;
  const snap = t => Math.ceil(t / DT - 1e-6) * DT;
  function canPlace(M, i){ return !M.over && !M.pending && !M.wantPass && !botTurn(M) && i >= 0 && legal(M.B, M.n, i, M.turn, M.ko); }
  // the player (or the auto-player / the bot) picks a point: the stone lands on CONTACT, FLY seconds later (an 'aim' event starts the act)
  function queue(M, i, delay){ if(M.over || M.pending || M.wantPass || !legal(M.B, M.n, i, M.turn, M.ko)) return false;
    const at = snap(M.t + (delay == null ? FLY : delay)); M.pending = {i, c: M.turn, at}; M.ev.push({type: 'aim', who: whoOf(M, M.turn), c: M.turn, i, at, t: M.t}); return true; }
  function pass(M){ if(M.over || M.pending) return false; M.wantPass = true; return true; }   // the pass happens inside the next tick
  function doPass(M){ M.wantPass = false; if(M.over || M.pending) return false; const c = M.turn; M.hist.push(state(M)); M.passes++; M.turn = 3 - c; M.ko = -1; M.botAt = -1; M.moves++;
    M.ev.push({type: 'pass', who: whoOf(M, c), c, t: M.t}); if(M.passes >= 2) end(M, 'passes'); return true; }
  function state(M){ return {B: M.B.slice(), turn: M.turn, caps: M.caps.slice(), ko: M.ko, passes: M.passes, moves: M.moves, last: M.last}; }
  function undo(M){   // back to before the player's last move (and the bot's answer)
    if(M.over || M.pending || !M.hist.length) return false; let s = null;
    while(M.hist.length){ s = M.hist.pop(); if(s.turn === M.me) break; }
    if(!s || s.turn !== M.me) return false; Object.assign(M, {B: s.B, turn: s.turn, caps: s.caps, ko: s.ko, passes: s.passes, moves: s.moves, last: s.last, botAt: -1}); M.undos++;
    M.ev.push({type: 'undo', who: 'me', t: M.t}); return true; }
  function apply(M, p){
    const n = M.n, c = p.c; M.hist.push(state(M)); const r = place(M.B, n, p.i, c, M.ko); M.pending = null;
    if(!r){ M.hist.pop(); M.ev.push({type: 'illegal', who: whoOf(M, c), i: p.i, t: M.t}); return; }
    M.ko = r.ko; M.passes = 0; M.moves++; M.last = p.i; M.caps[c] += r.cap.length; M.turn = 3 - c; M.botAt = -1;
    M.ev.push({type: 'move', who: whoOf(M, c), c, i: p.i, cap: r.cap.length, t: M.t});
    if(r.cap.length){ if(c === M.me) M.bigCap = Math.max(M.bigCap, r.cap.length); M.ev.push({type: 'capture', who: whoOf(M, c), victim: whoOf(M, 3 - c), c, list: r.cap, n: r.cap.length, at: p.i, t: M.t}); }
    const N = nbs(n), seen = {};
    for(const q of N[p.i]) if(M.B[q] === 3 - c && !seen[q]){ const g = grp(M.B, n, q); g.stones.forEach(s => { seen[s] = 1; }); if(g.libs === 1) M.ev.push({type: 'atari', who: whoOf(M, 3 - c), c: 3 - c, i: g.lib, size: g.stones.length, t: M.t}); }
    if(M.mode === 'capture' && M.caps[c] >= M.goal) return end(M, 'goal', c);
    if(M.moves >= M.maxMoves) end(M, 'long');
  }
  function end(M, why, win){
    const sc = score(M.B, M.n, M.komi); M.score = sc; M.why = why;
    M.winner = win || (M.mode === 'capture' && M.caps[1] !== M.caps[2] ? (M.caps[1] > M.caps[2] ? 1 : 2) : sc.winner);
    M.over = true; M.cleared = M.winner === M.me; M.pending = null; M.ev.push({type: 'end', who: whoOf(M, M.winner), why, t: M.t});
  }
  function tick(M, dt){
    if(M.over) return; M.t += dt;
    if(M.wantPass){ doPass(M); return; }
    if(M.pending){ if(M.t >= M.pending.at - 1e-9) apply(M, M.pending); return; }
    if(botTurn(M)){ if(M.botAt < 0) M.botAt = M.t + THINK; else if(M.t >= M.botAt){ const i = choose(M, M.turn, M.L.bot || 0); if(i < 0) doPass(M); else queue(M, i); } }
  }
  function takeEvents(M){ const e = M.ev; M.ev = []; return e; }
  // 🧪 the careful auto-player (tests + ST_AUTO): plays the player's side
  function autoPlay(M, lvl){ if(M.over || M.pending || M.wantPass || botTurn(M)) return; if(M.vs !== 'bot' && M.turn !== M.me) return autoSide(M, lvl);
    const i = choose(M, M.turn, lvl == null ? 2 : lvl); if(i < 0) pass(M); else queue(M, i); }
  function autoSide(M, lvl){ const i = choose(M, M.turn, lvl == null ? 1 : lvl); if(i < 0) pass(M); else queue(M, i); }
  function hint(M){ return choose(Object.assign({}, M, {R: rng(M.moves * 977 + 13), passes: 0}), M.turn, 2); }
  function simulate(cfg, maxSec){ const M = newMatch(cfg); while(!M.over && M.t < (maxSec || 3000)){ autoPlay(M, cfg.auto); for(let i = 0; i < 6; i++) tick(M, DT); takeEvents(M); } return M; }
  return {DT, THINK, FLY, rng, nbs, grp, place, legal, isEye, score, choose, judge, newMatch, canPlace, queue, pass, undo, tick, takeEvents, autoPlay, hint, simulate, whoOf, botTurn};
})();
// ENGINE END

/* ================= ④ SETUP PAGE — cover first, then ONE page; a tap PICKS, ▶ Start names the picks ================= */
var NAV_INNER = {menu: ['◀ ' + GAME_NAME, () => openCover()]};
UI.navBar($('back-btn'), {onclick: false});
const pickKey = k => 'sp_' + GAME_ID + '_' + k + ':' + (S.player || '');
const ls = {get: k => { try{ return localStorage.getItem(pickKey(k)); }catch(e){ return null; } }, set: (k, v) => { try{ localStorage.setItem(pickKey(k), String(v)); }catch(e){} }};
const gfPick = (el, on) => { if(window.GF && GF.pick) GF.pick(el, on); };
const PICK = {mode: 'capture', size: 'std', lvl: 0, opp: 'bot', col: 1, holes: true, twoTap: true};
function myAvatar(name){ const a = S.avatars[name || S.player]; return a ? fixAv(a) : defaultAvatar(name || S.player || GAME_ID); }
function showScreen(name){
  ['player', 'menu', 'play'].forEach(s => $('scr-' + s).classList.toggle('hidden', s !== name));
  $('back-btn').classList.toggle('hidden', name === 'play'); UI.navScreen($('back-btn'), name, NAV_INNER); window.scrollTo(0, 0);
}
function progressOf(name){ return S.progress[name] || {unlocked: 0, tokens: [], best: []}; }
function canPlay(i){ const u = progressOf(S.player).unlocked || 0; return i === 5 ? u >= 5 : i <= u; }
function renderPlayers(){
  const box = $('player-list'); box.innerHTML = '';
  if(!S.players.length){ box.innerHTML = '<div class="empty">No players yet — add one on the Dashboard first.</div>'; return; }
  S.players.forEach(p => { const b = document.createElement('button'); b.className = 'pick'; b.setAttribute('data-sound', 'pop');
    const c = document.createElement('canvas'); c.width = 144; c.height = 168; b.appendChild(c);
    b.insertAdjacentHTML('beforeend', '<div class="nm">' + UI.esc(p.Name) + '</div><div class="sub">' + UI.esc(p.Age ? p.Age + ' yrs' : '') + '</div>');
    drawPreviewCanvas(c, myAvatar(p.Name), {name: p.Name, t: 1}); b.onclick = () => choosePlayer(p.Name); box.appendChild(b); });
}
function choosePlayer(name){
  UI.rememberTheme(name, UI.applyTheme(UI.themeFor(S.settings, name), {kitOnly: true}));
  const p = S.players.find(x => x.Name === name); S.player = name; S.age = p ? p.Age : '';
  PICK.mode = MODES.some(m => m.k === ls.get('mode')) ? ls.get('mode') : 'capture'; PICK.size = MAP_SIZES.some(m => m.k === ls.get('size')) ? ls.get('size') : 'std';
  PICK.lvl = Number(ls.get('lvl')) || 0; if(!canPlay(PICK.lvl)) PICK.lvl = 0;
  PICK.opp = ls.get('opp') && (ls.get('opp') === 'bot' || S.players.some(x => x.Name === ls.get('opp') && x.Name !== name)) ? ls.get('opp') : 'bot';
  PICK.col = ls.get('col') === '2' ? 2 : 1; PICK.holes = ls.get('holes') !== '0'; PICK.twoTap = ls.get('twoTap') !== '0';
  if(MODE_LINK && MODES.some(m => m.k === MODE_LINK)) PICK.mode = MODE_LINK;
  $('who-name').textContent = name; renderSetup(); showScreen('menu');
  if(MODE_LINK) startSetup(); else openCover();
  if(UI.guideOnce) UI.guideOnce(GAME_ID, [{icon: GAME_ICON, title: GAME_NAME, text: GAME_GOAL}], {btn: '.gf-cover:not(.gf-hide) .gf-help'});
}
function changePlayer(){ renderPlayers(); showScreen('player'); }
let Cover = null;
function openCover(){
  if(!window.GF){ showScreen('menu'); return; }
  if(Cover && Cover.who !== S.player){ Cover.destroy(); Cover = null; }
  if(!Cover){ Cover = GF.cover(document.body, {game: GAME_ID, title: GAME_NAME, icon: GAME_ICON, version: GAME_VERSION, story: GAME_GOAL, me: S.player, players: S.players, avatarOf: myAvatar,
      seats: {min: 1, max: 1}, steps: GAME_STEPS, acts: [GAME_ID + '.place', GAME_ID + '.palm', GAME_ID + '.cheer'], backTo: WEBAPP_URL + '?page=gameroom' + sessionQuery(), backKind: 'rooms',
      onPlay: () => { Cover.hide(); showScreen('menu'); } }); Cover.who = S.player; }
  Cover.show();
}
function chip(box, id, text, on, fn){ const b = document.createElement('button'); b.className = 'sp-btn sp-secondary chip'; if(id) b.dataset.k = id; b.setAttribute('data-sound', 'pop'); b.textContent = text; b.onclick = fn; box.appendChild(b); gfPick(b, on); return b; }
function renderSetup(){
  UI.modeGroups($('mode-box'), MODE_GROUPS, MODES.map(m => Object.assign({}, m, {on: m.k === PICK.mode})), {onPick: k => { PICK.mode = k; ls.set('mode', k); partPrefetch(k); renderSetup(); return false; }});
  const mb = $('map-list'); mb.innerHTML = '';
  MAP_SIZES.forEach(m => { const b = document.createElement('button'); b.className = 'pick card map'; b.dataset.k = m.k; b.setAttribute('data-sound', 'pop');
    const L = levelFor(PICK.lvl, m.k), big = m.k === '19' && smallUpright();
    b.innerHTML = '<div class="big">' + m.icon + '</div><div class="nm">' + m.name + '</div><div class="sub">' + (m.k === 'std' ? L.n + ' × ' + L.n + ' · ×' + L.sizeMult : big ? '📱 turn sideways' : m.sub) + '</div>';
    if(big) b.classList.add('locked');
    b.onclick = () => { if(m.k === '19' && smallUpright()){ UISound.play('error'); UI.toast('🏔️ 19 × 19 needs a big screen — turn your phone sideways 📱↔️'); return; } PICK.size = m.k; ls.set('size', m.k); markPicks(); }; mb.appendChild(b); });
  const lb = $('level-list'); lb.innerHTML = ''; const pr = progressOf(S.player);
  LEVELS.forEach((L, i) => { const open = canPlay(i), done = (pr.unlocked || 0) > i, b = document.createElement('button');
    b.className = 'pick card lvl' + (open ? '' : ' locked') + (L.hardcore ? ' hardcore' : ''); b.dataset.i = i; b.setAttribute('data-sound', open ? 'pop' : 'none');
    b.innerHTML = '<span class="num">' + (i + 1) + '</span>' + (done ? '<span class="badge">🏅</span>' : open ? '' : '<span class="badge">🔒</span>') +
      '<div class="big">' + L.emoji + '</div><div class="nm">' + L.name + '</div><div class="goal">' + (PICK.mode === 'capture' ? '🎯 Palm ' + L.goal + ' first' : '⚫ Most land wins') + '</div><div class="sub">' + (L.hardcore && !open ? 'Beat Extreme to open 💀' : L.blurb) + '</div>';
    b.onclick = () => { if(!open){ UISound.play('error'); UI.toast(i === 5 ? 'Beat Extreme to open 💀 Hardcore!' : 'Win the level before to unlock it 🔓'); return; } PICK.lvl = i; ls.set('lvl', i); renderSetup(); };
    lb.appendChild(b); });
  // 👥 4. who you play: 🐦‍⬛ Cawdini (the bot) or someone on THIS device (take turns) · and your colour
  const pb = $('players-box'); pb.innerHTML = '';
  chip(pb, 'bot', RIVAL.icon + ' ' + RIVAL.name + ' (robot)', PICK.opp === 'bot', () => { PICK.opp = 'bot'; ls.set('opp', 'bot'); markPicks(); });
  S.players.filter(p => p.Name !== S.player).forEach(p => chip(pb, p.Name, '👥 ' + p.Name + ' (this device)', PICK.opp === p.Name, () => { PICK.opp = p.Name; ls.set('opp', p.Name); markPicks(); }));
  const cb = $('color-box'); cb.innerHTML = '';
  chip(cb, '1', '⚫ I start (black)', PICK.col === 1, () => { PICK.col = 1; ls.set('col', 1); markPicks(); });
  chip(cb, '2', '⚪ I go second (white)', PICK.col === 2, () => { PICK.col = 2; ls.set('col', 2); markPicks(); });
  const ob = $('opt-list'); ob.innerHTML = '';
  chip(ob, '', '', false, () => { PICK.holes = !PICK.holes; ls.set('holes', PICK.holes ? 1 : 0); markPicks(); }).id = 'opt-holes';
  chip(ob, '', '', false, () => { PICK.twoTap = !PICK.twoTap; ls.set('twoTap', PICK.twoTap ? 1 : 0); markPicks(); }).id = 'opt-tap';
  markPicks();
}
function markPicks(){
  document.querySelectorAll('#map-list .map').forEach(b => gfPick(b, b.dataset.k === PICK.size));
  document.querySelectorAll('#level-list .lvl').forEach(b => gfPick(b, Number(b.dataset.i) === PICK.lvl));
  document.querySelectorAll('#players-box .chip').forEach(b => gfPick(b, b.dataset.k === PICK.opp));
  document.querySelectorAll('#color-box .chip').forEach(b => gfPick(b, Number(b.dataset.k) === PICK.col));
  const L = levelFor(PICK.lvl, PICK.size), M = MODES.find(m => m.k === PICK.mode), hc = L.noHelp;
  const h = $('opt-holes'); if(h) h.textContent = '🫧 Breathing holes: ' + (PICK.holes && !hc ? 'On' : 'Off') + (hc ? ' (💀)' : '');
  const t = $('opt-tap'); if(t) t.textContent = '👆 Tap twice to place: ' + (L.oneTap ? 'Off in 🌱 Basic' : PICK.twoTap ? 'On' : 'Off');
  $('btn-start').textContent = '▶ Start · ' + M.icon + ' ' + M.name + ' · ' + L.emoji + ' ' + L.name + ' · ' + L.n + '×' + L.n + (PICK.opp === 'bot' ? '' : ' · 👥 ' + PICK.opp);
}
function startSetup(){ if(!canPlay(PICK.lvl)){ UISound.play('error'); UI.toast('Pick a level that is open 🔓'); return; }
  if(PICK.size === '19' && smallUpright()){ PICK.size = 'std'; } startGame(PICK.lvl); }

/* ================= ⑤ PLAY SCREEN — the shared bar, the board canvas, the 🌸 decision ring ================= */
const BAR = UI.gameBar($('gbar'), {game: GAME_ID, icon: GAME_ICON, name: GAME_NAME, levelId: 'hud-level',
  levels: () => leavePlay(), playing: () => !!(G && !G.M.over), onLeave: () => stopMood(),
  pause: {pause: () => setPaused(true, 'bar'), resume: () => setPaused(false, 'bar')}, pauseButton: true, onFit: () => layout()});
const cv = $('cv'), g = cv.getContext('2d');
const V = {w: 0, h: 0, dpr: 1, n: 5, cell: 40, ox: 0, oy: 0, bs: 200, me: {x: 0, y: 0, k: 1}, op: {x: 0, y: 0, k: 1}, upright: true};
function layout(){
  if(!G) return; const r = $('stage').getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  V.w = Math.max(1, Math.round(r.width)); V.h = Math.max(1, Math.round(r.height)); V.dpr = dpr; cv.width = Math.round(V.w * dpr); cv.height = Math.round(V.h * dpr);
  const upright = V.h > V.w * 1.05; V.upright = upright;
  if(window.UI && UI.pad && UI.pad.arcAll) UI.pad.arcAll($('pads'));   // lay the 🌸 ring out, then MEASURE the thumb's real footprint
  const pr = [...document.querySelectorAll('#pads button')].map(b => b.getBoundingClientRect()).filter(q => q.width > 0), gap = 8;
  const band = pr.length && upright ? r.bottom - Math.min(...pr.map(q => q.top)) + gap : 0, side = pr.length && !upright ? r.right - Math.min(...pr.map(q => q.left)) + gap : 12;
  const n = G.M.n; V.n = n;
  if(upright){
    const strip = stClamp(V.h * 0.12, 58, 118), aw = V.w - 12, ah = V.h - band - strip * 2 - 8, bs = Math.max(60, Math.min(aw, ah));
    V.bs = bs; V.ox = Math.round((V.w - bs) / 2); V.oy = Math.round(strip + 4 + Math.max(0, (ah - bs) / 2));
    const k = strip * 0.82 / 105; V.op = {x: Math.max(V.ox, 8) + strip * 0.45, y: V.oy - 4, k}; V.me = {x: Math.max(V.ox, 8) + strip * 0.45, y: V.oy + bs + strip - 2, k};
  } else {
    const sw = stClamp(V.w * 0.17, 76, 190), aw = V.w - sw - side - 12, ah = V.h - 12, bs = Math.max(60, Math.min(aw, ah));
    V.bs = bs; V.ox = Math.round(sw + 6 + Math.max(0, (aw - bs) / 2)); V.oy = Math.round((V.h - bs) / 2);
    const k = Math.min(sw * 0.9, V.h * 0.36) / 105; V.op = {x: sw * 0.5, y: V.h * 0.47, k}; V.me = {x: sw * 0.5, y: V.h - 8, k};
  }
  V.cell = V.bs / n; stoneCache = {};
}
const PX = i => V.ox + (i % V.n + 0.5) * V.cell, PY = i => V.oy + (((i / V.n) | 0) + 0.5) * V.cell;
function pointAt(cx, cy){ const r = cv.getBoundingClientRect(), x = (cx - r.left - V.ox) / V.cell - 0.5, y = (cy - r.top - V.oy) / V.cell - 0.5;
  const ix = Math.round(x), iy = Math.round(y); if(ix < 0 || iy < 0 || ix >= V.n || iy >= V.n || Math.hypot(x - ix, y - iy) > 0.62) return -1; return iy * V.n + ix; }
function setPaused(on, why){ if(!G) return; G.pz[why] = on; G.paused = Object.values(G.pz).some(Boolean); if(G.mood && G.mood.pause) G.mood.pause(G.paused); }
const myTurn = () => G && !G.M.over && !G.M.pending && !G.M.wantPass && !G.paused && (G.M.vs === 'bot' ? G.M.turn === G.M.me : true);
const sideName = c => c === G.M.me ? S.player : G.M.vs === 'bot' ? RIVAL.name : G.opName;
// input: tap a point (ghost → tap again = place; 🌱 Basic one tap) · keys ← → ↑ ↓ + Enter / Space · P pass · H hint · U undo · the 🌸 ring
cv.addEventListener('pointerdown', e => { if(!G || G.M.over) return; e.preventDefault(); const i = pointAt(e.clientX, e.clientY); if(i < 0) return; tapPoint(i); });
function tapPoint(i){
  if(!myTurn()){ if(G.M.pending || ENG.botTurn(G.M)) say(RIVAL.icon + ' ' + RIVAL.name + ' is thinking…', 'small'); return; }
  G.cur = i;
  if(!ENG.legal(G.M.B, G.M.n, i, G.M.turn, G.M.ko)){ UISound.play('error'); G.ghost = -1; say(G.M.B[i] ? 'A stone is there already' : i === G.M.ko ? '🔒 Ko! Play somewhere else first' : 'No breathing holes there!', 'small'); return; }
  const oneTap = G.L.oneTap || !PICK.twoTap;
  if(oneTap || G.ghost === i) placeAt(i); else { G.ghost = i; UISound.play('tick'); }
}
function placeAt(i){ if(!myTurn() || !ENG.queue(G.M, i)) return; G.ghost = -1; G.hintI = -1; G.keyed = true; }
function doPass(){ if(!myTurn()) return; G.ghost = -1; ENG.pass(G.M); }
function doHint(){ if(!myTurn()) return; if(G.hintsLeft <= 0){ UISound.play('error'); say(G.L.noHelp ? '💀 No hints in Hardcore' : 'No hints left 🪄', 'small'); return; }
  const i = ENG.hint(G.M); if(i < 0){ say('🪄 Nothing good left — try ✋ Pass', 'small'); return; } G.hintI = i; G.hintsLeft--; G.M.hints++; UISound.play('success'); hud(); }
function doUndo(){ if(!G || !G.L.undo || G.L.noHelp){ UISound.play('error'); say('↩️ Undo is for 🌱 Basic and 🐣 Junior', 'small'); return; }
  if(ENG.undo(G.M)){ G.ghost = -1; G.me.act = G.op.act = null; UISound.play('pop'); } else UISound.play('error'); }
addEventListener('keydown', e => { if(!G || G.M.over) return; const k = e.code, n = G.M.n; let c = G.cur < 0 ? Math.floor(n * n / 2) : G.cur;
  const mv = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -n, ArrowDown: n}[k];
  if(mv){ const x = c % n, nx = mv === -1 ? x - 1 : mv === 1 ? x + 1 : x, ny = ((c / n) | 0) + (mv === -n ? -1 : mv === n ? 1 : 0); if(nx >= 0 && nx < n && ny >= 0 && ny < n) c = ny * n + nx; G.cur = c; G.ghost = c; e.preventDefault(); }
  else if(k === 'Enter' || k === 'Space'){ if(!e.repeat) tapPoint(c); e.preventDefault(); }
  else if(k === 'KeyP' && !e.repeat) doPass(); else if(k === 'KeyH' && !e.repeat) doHint(); else if(k === 'KeyU' && !e.repeat) doUndo(); else return; G.keyed = true; });
if(UI.pad){ UI.pad.dress($('btn-place'), '✅', 'Place', '#FFC845', true); UI.pad.dress($('btn-pass'), '✋', 'Pass', '#9BD7FF'); UI.pad.dress($('btn-hint'), '🪄', 'Hint', '#C9A7FF'); UI.pad.dress($('btn-undo'), '↩️', 'Undo', '#A8E6B0');
  UI.pad.fan($('pad-r'), $('btn-place'), [$('btn-pass'), $('btn-hint'), $('btn-undo')]); }
$('btn-place').addEventListener('pointerdown', e => { e.preventDefault(); if(G && G.ghost >= 0) placeAt(G.ghost); else if(G && myTurn()) say('👆 Tap a point on the board first', 'small'); });
$('btn-pass').addEventListener('pointerdown', e => { e.preventDefault(); doPass(); }); $('btn-hint').addEventListener('pointerdown', e => { e.preventDefault(); doHint(); });
$('btn-undo').addEventListener('pointerdown', e => { e.preventDefault(); doUndo(); });
addEventListener('touchstart', () => { if(!document.body.classList.contains('touchy')){ document.body.classList.add('touchy'); if(G) layout(); } }, {passive: true});
if(window.matchMedia && matchMedia('(pointer: coarse)').matches) document.body.classList.add('touchy');
if(window.ResizeObserver) new ResizeObserver(() => { if(G) layout(); }).observe($('stage')); addEventListener('resize', () => { if(G) layout(); });

/* ================= ⑥ BEATS — every avatar ACTION = 3–5 beats; the stone lands on CONTACT (the engine applies the move in that same tick) ================= */
// place = 🎩 palm trick stand-in (palm up → close → FLICK = the stone snaps on its point → flourish → settle) · palm = a capture's victim? no:
// the CAPTURER's place contact is the capture; the victim plays oops from contact · pass = tip the hat · cheer = the winner. (🎬 Motion's real
// palm trick / vanish-reappear swap in by name when they are LIVE — 📨 gp-0.) Acts = AvatarActs 🎭 BLOCK `gopalm`.
const SCB_HAS = typeof Acting !== 'undefined' && typeof Acting.play === 'function';
const SCB_ACTS = {place: GAME_ID + '.place', palm: GAME_ID + '.palm', oops: GAME_ID + '.oops', pass: GAME_ID + '.pass', cheer: GAME_ID + '.cheer'};
window.SCB_LOG = [];
function scStart(A, kind, atT, from){
  if(!SCB_HAS || !A || !Acting.act(SCB_ACTS[kind])) return false;
  const prev = A.act && A.act.run.last, t = G.M.t;
  const run = Acting.play(A.who, SCB_ACTS[kind], {t0: t, contactAt: atT, from: from || prev || undefined,
    onContact: r => { window.SCB_LOG.push({who: A.key, kind, t: G.M.t, at: r.contactT}); if(window.SCB_LOG.length > 300) window.SCB_LOG.shift(); }});
  A.act = {kind, run}; run.at(t); return true;
}
function scNow(A, kind){ const t = G.M.t, keep = A.act && A.act.kind === kind && A.act.run.last; scStart(A, kind, t, keep || undefined); if(A.act) A.act.run.at(Math.max(t, A.act.run.contactT || t) + 1e-6); }
function palmTick(){   // queued acts start only once the actor's own stone has landed (never cut a contact still to come)
  const busy = A => A.act && A.act.run && A.act.run.contactT != null && A.act.run.contactT > G.M.t + 1e-9;
  const q = G.palmQ; if(q && G.M.t >= q.start && !busy(q.A)){ G.palmQ = null; scStart(q.A, 'palm', q.at > G.M.t ? q.at : G.M.t + 0.2); }
  const c = G.cheerQ; if(c && G.M.t >= c.start && !busy(c.A)){ G.cheerQ = null; scStart(c.A, 'cheer', G.M.t + 0.12); } }
function scTick(A){ if(!A || !A.act) return; const f = A.act.run.at(G.M.t + 1e-7); if(f.done) A.act = null; }
const actorOf = who => who === 'me' ? G.me : G.op;
function scEvent(e){
  if(e.type === 'aim'){ const A = actorOf(e.who); scStart(A, 'place', e.at); G.fly = {i: e.i, c: e.c, t0: G.M.t, at: e.at, from: handOf(A)}; }
  if(e.type === 'capture'){ scNow(actorOf(e.victim), 'oops'); G.palmQ = {A: actorOf(e.who), start: G.M.t + 0.3, at: Math.ceil((G.M.t + 0.8) / ENG.DT) * ENG.DT}; }   // 🪙 the stones reach the capturer's palm 0.8 s later
  if(e.type === 'pass') scNow(actorOf(e.who), 'pass');
  if(e.type === 'end' && G.M.winner) G.cheerQ = {A: G.M.winner === G.M.me ? G.me : G.op, start: G.M.t + 0.3};   // after the last stone's contact + follow-through
}
function handOf(A){ const P = A === G.me ? V.me : V.op; return {x: P.x + 26 * P.k, y: P.y - 62 * P.k}; }
function drawActor(A, P, turn){
  const k = P.k, x = P.x, feet = P.y;
  if(turn){ const rg = g.createRadialGradient(x, feet - 2, 0, x, feet - 2, 52 * k); rg.addColorStop(0, 'rgba(255,214,90,.55)'); rg.addColorStop(1, 'rgba(255,214,90,0)'); g.fillStyle = rg; g.beginPath(); g.ellipse(x, feet - 2, 52 * k, 14 * k, 0, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(x, feet - 1, 30 * k, 7 * k, 0, 0, 7); g.fill();
  const F = A.act && A.act.run.last;
  try { if(F && !F.done) Acting.draw(g, A.who, x, feet, k, F, {t: G.M.t, keep: true}); else drawAvatar(g, A.who, x, feet, k, {t: G.M.t}); }
  catch(e){ try{ drawAvatar(g, A.who, x, feet, k, {t: G.M.t}); }catch(e2){} }
  if(A.rival && typeof emo === 'function') emo(g, RIVAL.icon, x + 30 * k, feet - 118 * k, Math.round(Math.max(14, 30 * k)));
}

/* ================= the game loop ================= */
function startGame(lvl){
  if(!partReady(PICK.mode)) return partNeed(PICK.mode, () => startGame(lvl));
  cancelAnimationFrame(rafId); hideResult(); if(Cover) Cover.hide();
  const L = levelFor(lvl, PICK.size), mode = PICK.mode, vs = PICK.opp === 'bot' ? 'bot' : 'two';
  const M = ENG.newMatch({L, mode, me: PICK.col, vs, seed: (Date.now() >>> 0) ^ 0x60a1});
  const opName = vs === 'bot' ? RIVAL.name : PICK.opp;
  G = {lvl, M, L, mode, acc: 0, last: performance.now(), pz: {}, paused: false, fx: [], puffs: [], palms: [], fly: null, keyed: false, ended: false,
    ghost: -1, cur: -1, hintI: -1, hintsLeft: L.noHelp ? 0 : L.hints, holes: PICK.holes && !L.noHelp, opName, atari: [],
    me: {key: 'me', who: {name: S.player, av: myAvatar()}, act: null}, op: {key: vs === 'bot' ? 'bot' : 'p2', who: {name: opName, av: vs === 'bot' ? defaultAvatar('Cawdini') : myAvatar(opName)}, act: null, rival: vs === 'bot'}};
  BAR.level(L.emoji + ' ' + L.name + ' · ' + L.n + '×' + L.n, L.hardcore ? 'hc' : ''); BAR.score(0); hud();
  ['btn-hint', 'btn-undo'].forEach(id => $(id).classList.toggle('pz-off', id === 'btn-hint' ? !G.hintsLeft : !(L.undo && !L.noHelp)));
  showScreen('play'); BAR.fit(); layout();
  G.mood = startMood(); calloutSetup();
  UI.banner && UI.banner(mode === 'capture' ? '🎯 Palm ' + L.goal + ' stone' + (L.goal > 1 ? 's' : '') + ' first to win!' + (L.guided ? ' Tap the glowing point 👆' : '') : '⚫ Surround land — the most stones + land wins!', {icon: GAME_ICON});
  G.last = performance.now(); rafId = requestAnimationFrame(loop);
}
function loop(now){
  if(!G) return; const dt = Math.min(0.05, (now - G.last) / 1000); G.last = now;
  if(!G.paused && !G.M.over){
    if(window.ST_AUTO) ENG.autoPlay(G.M);
    if(G.L.guided && myTurn() && G.hintI < 0 && G.M.vs === 'bot') G.hintI = ENG.hint(G.M);   // 🌱 Basic: the glow shows a good point every turn
    G.acc += dt; let n = 0;
    while(G.acc >= ENG.DT && n < 30 && !G.M.over){   // ONE engine tick at a time → the act's contact lands in the SAME tick as the move
      ENG.tick(G.M, ENG.DT); G.acc -= ENG.DT; n++;
      ENG.takeEvents(G.M).forEach(onEvent); scTick(G.me); scTick(G.op); palmTick();
    }
    hud(); moodTick();
  }
  if(G.M.over && !G.ended){ G.ended = true; ENG.takeEvents(G.M).forEach(onEvent); setTimeout(() => finishGame(), 1300); }
  if(G.M.over){ G.M.t += dt; scTick(G.me); scTick(G.op); palmTick(); }
  drawBoard(now / 1000); rafId = requestAnimationFrame(loop);
}
function onEvent(e){
  scEvent(e);
  if(e.type === 'move'){ G.fly = null; UISound.play('pop'); sparkle(PX(e.i), PY(e.i), e.c === 1 ? '#FFE9A8' : '#FFFFFF', 7); refreshAtari(); }
  if(e.type === 'capture'){
    const to = handOf(actorOf(e.who)); e.list.forEach((p, k) => { G.puffs.push({x: PX(p), y: PY(p), t: 0, d: k * 0.04}); G.palms.push({c: 3 - e.c, x0: PX(p), y0: PY(p), to, t: -0.25 - k * 0.04}); });
    UISound.play('success'); if(G.mood && G.mood.lift) G.mood.lift();
    if(e.who === 'me') say(e.n >= 4 ? '🎩 Big palm — ' + e.n + ' stones!' : '🎩 Palmed ' + e.n + '!', e.n >= 4 ? 'big' : 'good'); else say(sideName(e.c) + ' palmed ' + e.n + ' 😮', 'small');
  }
  if(e.type === 'atari' && G.holes){ if(e.who === 'me' || G.M.vs !== 'bot') say('😰 Atari! 1 breathing hole left', 'good'); }
  if(e.type === 'pass'){ UISound.play('tick'); say('✋ ' + sideName(e.c) + ' passes' + (G.M.passes === 1 && !G.M.over ? ' — pass too to end the game' : ''), 'small'); }
  if(e.type === 'undo'){ G.fly = null; refreshAtari(); }
  if(e.type === 'end'){ UISound.play(G.M.cleared || G.M.vs !== 'bot' ? 'success' : 'error'); }
}
function refreshAtari(){ const M = G.M, n = M.n, seen = new Uint8Array(n * n); G.atari = [];
  for(let i = 0; i < n * n; i++) if(M.B[i] && !seen[i]){ const gr = ENG.grp(M.B, n, i); gr.stones.forEach(s => { seen[s] = 1; }); if(gr.libs === 1) G.atari.push({lib: gr.lib, c: gr.c, stones: gr.stones}); } }
function say(text, rank){ try{ if(UI.callout) UI.callout(text, {who: 'me', rank: rank || 'small'}); }catch(e){} }
function hud(){ const M = G.M, o = 3 - M.me; BAR.score(pointsOf(M));
  BAR.count('caps', '🎩', M.caps[M.me] + ' : ' + M.caps[o], 'Palmed — ' + S.player + ' : ' + G.opName);
  const h = $('btn-hint'); if(h) h.classList.toggle('pz-off', !G.hintsLeft); }
function pointsOf(M){ const mult = (G.L.sizeMult || 1) * (G.L.mult || 1); let land = 0; if(M.score) land = M.score.land[M.me] + M.score.stones[M.me];
  return Math.round((M.caps[M.me] * 20 + land * 5 + (M.over && M.cleared ? 500 : 0)) * mult); }
function sparkle(x, y, col, n){ for(let i = 0; i < n; i++){ const a = Math.random() * Math.PI * 2, s = 30 + Math.random() * 50; G.fx.push({x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: 0, col}); } }
// 🪨 stones: drawn once per size into small sprites (361 stones stay fast — 🐢 rule)
let stoneCache = {};
function stoneSprite(c, r){ const key = c + ':' + Math.round(r * 4); if(stoneCache[key]) return stoneCache[key];
  const d = Math.ceil(r * 2 + 6) * V.dpr, cvs = document.createElement('canvas'); cvs.width = cvs.height = d; const q = cvs.getContext('2d'); q.scale(V.dpr, V.dpr); const m = d / V.dpr / 2;
  q.fillStyle = 'rgba(0,0,0,.35)'; q.beginPath(); q.arc(m + r * 0.08, m + r * 0.12, r, 0, 7); q.fill();
  const gr = q.createRadialGradient(m - r * 0.35, m - r * 0.4, r * 0.05, m, m, r);
  if(c === 1){ gr.addColorStop(0, '#6B6B78'); gr.addColorStop(0.35, '#2A2A33'); gr.addColorStop(1, '#0B0B10'); } else { gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(0.6, '#EFEDE6'); gr.addColorStop(1, '#C9C4B8'); }
  q.fillStyle = gr; q.beginPath(); q.arc(m, m, r, 0, 7); q.fill(); q.strokeStyle = c === 1 ? 'rgba(0,0,0,.6)' : 'rgba(120,110,90,.55)'; q.lineWidth = Math.max(1, r * 0.06); q.stroke();
  q.fillStyle = c === 1 ? 'rgba(255,255,255,.28)' : 'rgba(255,255,255,.9)'; q.beginPath(); q.ellipse(m - r * 0.32, m - r * 0.38, r * 0.3, r * 0.17, -0.6, 0, 7); q.fill();
  return stoneCache[key] = cvs; }
function stone(c, x, y, r, a){ const s = stoneSprite(c, r), d = s.width / V.dpr; if(a != null) g.globalAlpha = a; g.drawImage(s, x - d / 2, y - d / 2, d, d); g.globalAlpha = 1; }
const HOSHI = {5: [[2, 2]], 7: [[2, 2], [4, 2], [2, 4], [4, 4], [3, 3]], 9: [[2, 2], [6, 2], [2, 6], [6, 6], [4, 4]], 13: [[3, 3], [9, 3], [3, 9], [9, 9], [6, 6]], 19: [[3, 3], [9, 3], [15, 3], [3, 9], [9, 9], [15, 9], [3, 15], [9, 15], [15, 15]]};
function drawBoard(t){
  if(!G) return; const M = G.M, n = M.n, c = V.cell, r = c * 0.47; g.setTransform(V.dpr, 0, 0, V.dpr, 0, 0);
  let gr = g.createLinearGradient(0, 0, 0, V.h); gr.addColorStop(0, '#1E1830'); gr.addColorStop(1, '#3A2546'); g.fillStyle = gr; g.fillRect(0, 0, V.w, V.h);
  // 🎭 red stage curtains at the sides
  g.fillStyle = '#7A1626'; [0, 1].forEach(s => { const x0 = s ? V.w : 0, dir = s ? -1 : 1, cw = Math.min(V.w * 0.07, 60); g.beginPath(); g.moveTo(x0, 0); g.lineTo(x0 + dir * cw * 1.6, 0); g.quadraticCurveTo(x0 + dir * cw * 0.5, V.h * 0.5, x0 + dir * cw, V.h); g.lineTo(x0, V.h); g.fill(); });
  // the wooden board
  const pad = c * 0.12; g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(V.ox - pad + 5, V.oy - pad + 7, V.bs + pad * 2, V.bs + pad * 2);
  gr = g.createLinearGradient(V.ox, V.oy, V.ox + V.bs, V.oy + V.bs); gr.addColorStop(0, '#E2B373'); gr.addColorStop(1, '#C98A4B'); g.fillStyle = gr; g.fillRect(V.ox - pad, V.oy - pad, V.bs + pad * 2, V.bs + pad * 2);
  g.strokeStyle = 'rgba(120,70,20,.12)'; g.lineWidth = 1; for(let k = 0; k < 14; k++){ const y = V.oy - pad + (k + 0.5) * (V.bs + pad * 2) / 14; g.beginPath(); g.moveTo(V.ox - pad, y); g.bezierCurveTo(V.ox + V.bs * 0.3, y + 4, V.ox + V.bs * 0.7, y - 4, V.ox + V.bs + pad, y); g.stroke(); }
  // 🏝️ land glow at the end (who owns which empty point)
  if(M.over && M.score && M.mode === 'classic') for(let i = 0; i < n * n; i++){ const o = M.score.own[i]; if(!o || M.B[i]) continue; g.fillStyle = o === 1 ? 'rgba(20,20,30,.38)' : 'rgba(255,255,255,.55)'; g.fillRect(PX(i) - c * 0.3, PY(i) - c * 0.3, c * 0.6, c * 0.6); }
  g.strokeStyle = '#4A2E12'; g.lineWidth = Math.max(1, c * 0.035);
  for(let k = 0; k < n; k++){ const a = V.ox + (k + 0.5) * c, b0 = V.oy + c * 0.5, b1 = V.oy + V.bs - c * 0.5; g.beginPath(); g.moveTo(a, b0); g.lineTo(a, b1); g.stroke(); const y = V.oy + (k + 0.5) * c; g.beginPath(); g.moveTo(V.ox + c * 0.5, y); g.lineTo(V.ox + V.bs - c * 0.5, y); g.stroke(); }
  g.fillStyle = '#4A2E12'; (HOSHI[n] || []).forEach(([x, y]) => { g.beginPath(); g.arc(V.ox + (x + 0.5) * c, V.oy + (y + 0.5) * c, Math.max(2, c * 0.08), 0, 7); g.fill(); });
  // 🪄 hint glow + 👆 (🌱 Basic) and the 🔒 ko point
  if(G.hintI >= 0 && myTurn()){ const x = PX(G.hintI), y = PY(G.hintI), p = 0.5 + 0.5 * Math.sin(t * 5); const rg = g.createRadialGradient(x, y, 0, x, y, c * 0.9); rg.addColorStop(0, 'rgba(255,220,90,' + (0.55 + 0.3 * p) + ')'); rg.addColorStop(1, 'rgba(255,220,90,0)'); g.fillStyle = rg; g.beginPath(); g.arc(x, y, c * 0.9, 0, 7); g.fill();
    if(G.L.guided && M.moves < 4 && typeof emo === 'function') emo(g, '👆', x + c * 0.25, y + c * 0.55 + Math.abs(Math.sin(t * 4)) * c * 0.2, Math.round(Math.max(18, c * 0.6))); }
  if(M.ko >= 0 && !M.over && typeof emo === 'function') emo(g, '🔒', PX(M.ko), PY(M.ko), Math.round(Math.max(12, c * 0.42)));
  // stones (+ 😰 atari: the last breathing hole blinks red)
  for(let i = 0; i < n * n; i++) if(M.B[i]) stone(M.B[i], PX(i), PY(i), r);
  if(M.last >= 0 && M.B[M.last]){ g.strokeStyle = M.B[M.last] === 1 ? 'rgba(255,255,255,.8)' : 'rgba(0,0,0,.7)'; g.lineWidth = Math.max(1.5, c * 0.06); g.beginPath(); g.arc(PX(M.last), PY(M.last), r * 0.42, 0, 7); g.stroke(); }
  if(G.holes && !M.over) G.atari.forEach(a => { const on = Math.sin(t * 8) > -0.2; if(!on) return; g.fillStyle = 'rgba(229,72,77,.9)'; g.beginPath(); g.arc(PX(a.lib), PY(a.lib), Math.max(3, c * 0.14), 0, 7); g.fill(); });
  // ghost stone (tap again to place)
  if(G.ghost >= 0 && myTurn() && !M.B[G.ghost]){ stone(M.turn, PX(G.ghost), PY(G.ghost), r, 0.45 + 0.15 * Math.sin(t * 6)); }
  // the stone in the air: from the hand, a small arc, snaps on the point at CONTACT
  if(G.fly && M.pending){ const f = G.fly, k = stClamp((M.t - f.t0) / Math.max(0.01, f.at - f.t0), 0, 1), e = k * k, x = f.from.x + (PX(f.i) - f.from.x) * e, y = f.from.y + (PY(f.i) - f.from.y) * e - Math.sin(k * Math.PI) * c * 1.2; stone(f.c, x, y, r * (0.55 + 0.45 * k)); }
  // 💨 capture puffs + 🎩 palmed stones flying to the capturer's hand
  G.puffs = G.puffs.filter(p => (p.t += 1 / 60) < 0.6 + p.d); G.puffs.forEach(p => { const k = stClamp((p.t - p.d) / 0.6, 0, 1); if(k <= 0) return; g.fillStyle = 'rgba(220,215,235,' + (0.55 * (1 - k)) + ')'; for(let j = 0; j < 4; j++){ const a = j * 1.57 + k; g.beginPath(); g.arc(p.x + Math.cos(a) * c * 0.25 * k, p.y + Math.sin(a) * c * 0.25 * k - k * c * 0.3, r * (0.45 + 0.5 * k), 0, 7); g.fill(); } });
  G.palms = G.palms.filter(p => (p.t += 1 / 60) < 0.55); G.palms.forEach(p => { if(p.t < 0) return; const k = p.t / 0.55, e = k * k; stone(p.c, p.x0 + (p.to.x - p.x0) * e, p.y0 + (p.to.y - p.y0) * e - Math.sin(k * Math.PI) * c, r * (1 - 0.6 * k), 1 - k * 0.3); });
  // the players
  drawActor(G.op, V.op, !M.over && M.turn !== M.me); drawActor(G.me, V.me, !M.over && M.turn === M.me);
  // names + palmed count (plain text — no emoji fillText in the frame loop, 🐢 rule; the colour = a small stone sprite)
  const fs = Math.round(stClamp(13 * V.me.k * 1.5, 11, 17)); g.font = '700 ' + fs + 'px Fredoka, sans-serif'; g.fillStyle = '#FFE9C2';
  [[V.op, G.opName, 3 - M.me], [V.me, S.player, M.me]].forEach(([P, nm, col]) => {
    const x = V.upright ? P.x + 48 * P.k + 14 : P.x, y = V.upright ? P.y - 34 * P.k : P.y - 126 * P.k - 6; g.textAlign = V.upright ? 'left' : 'center';
    const txt = nm + ' · ' + M.caps[col] + ' palmed', w = g.measureText(txt).width, sx = V.upright ? x - fs * 0.7 : x - w / 2 - fs * 0.7;
    stone(col, sx, y - fs * 0.35, fs * 0.45); g.fillText(txt, x, y); });
  g.textAlign = 'center';
  G.fx = G.fx.filter(p => (p.t += 1 / 60) < 0.6); G.fx.forEach(p => { p.x += p.vx / 60; p.y += p.vy / 60; g.globalAlpha = 1 - p.t / 0.6; g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, Math.max(1.5, c * 0.05), 0, 7); g.fill(); }); g.globalAlpha = 1;
}
function startMood(){ try{ if(!(window.UISound && UISound.mood)) return null; const known = UISound.MOODS && Object.prototype.hasOwnProperty.call(UISound.MOODS, GAME_ID);
  return UISound.mood(known ? GAME_ID : {fam: MOOD_FAMILY, id: GAME_ID}); }catch(e){ return null; } }
function moodTick(){ const M = G.M; if(!G.mood || !G.mood.tension) return; G.mood.tension(stClamp(G.atari.length * 0.25 + M.moves / (M.n * M.n * 1.2), 0, 1)); }
function stopMood(){ if(G && G.mood && G.mood.stop){ try{ G.mood.stop(); }catch(e){} G.mood = null; } }
function calloutSetup(){ try{ if(!(UI.callout && UI.callout.setup)) return; const box = () => cv.getBoundingClientRect();
  UI.callout.setup({keep: () => { const r = box(); return [{l: r.left + V.ox, t: r.top + V.oy, r: r.left + V.ox + V.bs, b: r.top + V.oy + V.bs}]; },
    inside: (x, y) => { const r = box(); return x > r.left + V.ox && x < r.left + V.ox + V.bs && y > r.top + V.oy && y < r.top + V.oy + V.bs; },
    at: () => { const r = box(); return {x: r.left + V.me.x, y: r.top + V.me.y - 120 * V.me.k}; }, side: () => 0, crowd: () => null, me: S.player}); }catch(e){} }

/* ================= ⑦ END + SAVE — the shared 🏁 card, saveLevelResult (+ pending queue) ================= */
function leavePlay(){
  if(!G || G.M.over){ backToMenu(); return; }
  setPaused(true, 'leave');
  UI.confirm({icon: '◀', title: 'Leave this game?', body: 'The board is not kept yet (⏩ Continue comes in a later round).', okText: 'Leave', cancelText: 'Keep playing'}).then(ok => { if(!G) return; setPaused(false, 'leave'); if(ok){ finishGame(true); backToMenu(); } });
}
function backToMenu(){ stopMood(); try{ UI.callout && UI.callout.setup && UI.callout.setup(null); }catch(e){} cancelAnimationFrame(rafId); G = null; hideResult(); renderSetup(); showScreen('menu'); }
function pauseGame(){ setPaused(true, 'lock'); }
function finishGame(quiet){
  if(!G || G.done) return; G.done = true; const thisGame = G, M = G.M, L = G.L, me = M.me, o = 3 - me, cleared = M.over && M.cleared, bot = M.vs === 'bot';
  const sc = M.score || ENG.score(M.B, M.n, M.komi), mine = sc.stones[me] + sc.land[me], theirs = sc.stones[o] + sc.land[o] + (o === 2 ? M.komi : 0);
  const clean = !M.undos && !M.hints, stars = !cleared ? 0 : clean ? 3 : (M.mode === 'capture' ? M.caps[o] === 0 : sc.margin >= 10) ? 2 : 1;
  const firstClear = cleared && ((S.progress[S.player] || {}).unlocked || 0) <= G.lvl;
  stopMood(); try{ UI.callout && UI.callout.setup && UI.callout.setup(null); }catch(e){}
  const secs = Math.max(1, Math.round(M.t));
  if(bot && M.moves >= 2) saveWin(G.lvl, {timeSec: secs, stars, score: pointsOf(M), theme: L.theme, cleared,
    stats: {captured: M.caps[me], bigCapture: M.bigCap, land: mine, wins: cleared ? 1 : 0, games: 1}});
  if(quiet) return;
  const hasNext = bot && cleared && G.lvl < LEVELS.length - 1, oppN = sideName(o), winN = sideName(M.winner);
  const title = !bot ? '🏆 ' + winN + ' wins!' : cleared ? (M.mode === 'capture' ? '🎩 You palmed ' + M.caps[me] + ' first!' : 'You won the land!') : RIVAL.icon + ' ' + RIVAL.name + ' wins this time';
  const sub = M.mode === 'capture' ? 'Palmed — you ' + M.caps[me] + ' · ' + oppN + ' ' + M.caps[o] : 'Stones + land — you ' + mine + ' · ' + oppN + ' ' + theirs + (o === 2 ? ' (with komi ' + M.komi + ')' : '');
  setTimeout(() => {
    if(G !== thisGame) return;
    GF.result({wrap: $('result'), card: $('result-card'), win: cleared || !bot, icon: cleared ? '🏆' : GAME_ICON, title, sub, stars: cleared ? stars : null,
      steps: GAME_STEPS, misses: M.undos, first: firstClear,
      score: pointsOf(M), stats: [['🎩', M.caps[me] + ' palmed'], ['🏝️', sc.land[me] + ' land'], ['⚫', sc.stones[me] + ' stones'], ['🔢', M.moves + ' moves']],
      save: bot ? 'Saving your score…' : '👥 Friendly game — not saved', buddy: {name: S.player, av: myAvatar()},
      levels: () => backToMenu(), again: () => startGame(G.lvl),
      next: hasNext ? () => { hideResult(); if(canPlay(G.lvl + 1)){ PICK.lvl = G.lvl + 1; ls.set('lvl', PICK.lvl); startGame(PICK.lvl); } else backToMenu(); } : null,
      nextText: G.lvl === 4 ? '💀 Try Hardcore ▶' : 'Next level ▶'});
  }, 200);
}
const PENDING_KEY = 'sp_' + GAME_ID + '_pending';
function readPending(){ try{ return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); }catch(e){ return []; } }
function writePending(list){ try{ localStorage.setItem(PENDING_KEY, JSON.stringify(list.slice(-20))); }catch(e){} }
function flushPending(){ const list = readPending(); if(!list.length) return; writePending([]); list.forEach(w => google.script.run.withFailureHandler(() => writePending(readPending().concat([w]))).saveLevelResult(GAME_ID, w.name, w.lvl, w.extra)); }
function saveWin(lvlIdx, extra, tries){
  tries = tries || 0; const name = S.player;
  const p = S.progress[name] || (S.progress[name] = {unlocked: 0, tokens: [], best: []}); if(extra.cleared) p.unlocked = Math.max(p.unlocked, lvlIdx + 1);
  google.script.run.withSuccessHandler(res => {
      const best = (p.best || []).slice(); if(res.best) best[lvlIdx] = res.best; S.progress[name] = {unlocked: res.unlocked, tokens: res.tokens, best}; flushPending();
      const put = () => { const n2 = $('save-note'); if(n2) n2.innerHTML = saveText(res); }; if(!$('save-note')) setTimeout(put, 1500); else put();
    }).withFailureHandler(err => {
      if(tries < 1){ setTimeout(() => saveWin(lvlIdx, extra, tries + 1), 1200); return; }
      writePending(readPending().concat([{name, lvl: lvlIdx, extra}]));
      const put = () => { const n2 = $('save-note'); if(n2) n2.innerHTML = '⚠️ Could not save yet — it will be sent again next time.'; }; if(!$('save-note')) setTimeout(put, 1500); else put();
    }).saveLevelResult(GAME_ID, name, lvlIdx, extra);
}
function saveText(res){
  let h = res.newBadge ? '🏅 New badge: ' + UI.esc(res.newBadge) : res.newHighScore && !res.firstTime ? '🎉 New high score!' : res.best && res.best.score ? 'Your best: 🏆 ' + Number(res.best.score).toLocaleString() : '✅ Score saved';
  const fe = res.feats; if(fe){ (fe.newTitles || []).forEach(t => { h += '<br>🏷️ New title: ' + t.icon + ' ' + UI.esc(t.name); }); (fe.newBadges || []).forEach(b => { h += '<br>' + b.medal + ' ' + b.icon + ' ' + UI.esc(b.name) + ' · ' + b.tierName; }); }
  return h;
}
function hideResult(){ $('result').classList.add('hidden'); }
function sessionQuery(){ let q = ''; if(S.player || CURRENT_PLAYER) q += '&player=' + encodeURIComponent(S.player || CURRENT_PLAYER); if(SESSION_START) q += '&sessionStart=' + SESSION_START; if(DURATION_MIN) q += '&durationMin=' + DURATION_MIN; return q; }
function goGameroom(){ UI.back(WEBAPP_URL + '?page=gameroom' + sessionQuery(), 'rooms'); }

/* ================= ⑧ BOOT — one server call, then the cover ================= */
function boot(){
  UI.loading(GAME_ID);
  google.script.run.withSuccessHandler(d => {
      UI.loaded();
      S.players = d.players || []; S.progress = d.progress || {}; S.settings = d.settings || {}; S.avatars = d.avatars || {};
      UISound.applySettings(S.settings);
      const lockOn = !(S.settings.ScreenTimeLockEnabled === 'FALSE' || S.settings.ScreenTimeLockEnabled === false);
      lockHandle = UI.screenTimeLock({sessionStart: SESSION_START, durationMin: DURATION_MIN, enabled: lockOn, homeUrl: WEBAPP_URL + '?page=home', onLock: pauseGame});
      flushPending();
      if(CURRENT_PLAYER && S.players.some(p => p.Name === CURRENT_PLAYER)) choosePlayer(CURRENT_PLAYER); else { renderPlayers(); showScreen('player'); }
    }).withFailureHandler(() => { UI.loaded(); UI.toast('Could not load players — check the connection', 'err'); renderPlayers(); showScreen('player'); })
    .getLevelGameData(GAME_ID, CURRENT_PLAYER);
}
boot();
