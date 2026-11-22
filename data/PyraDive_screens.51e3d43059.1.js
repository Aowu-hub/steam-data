
/* 📱 SCREENS (lk-9d, 📡 Multiplayer chat, Aowu 2026-11-22 17:4x "every ⭐" — LinkKit plan §55x look test → §56 as built): 🔥 PyraDive, everyone on their OWN screen.
   Born split: this part = PyraDive_screens (GameParts, loader PyraDiveParts) — comes with the room (PyraDive_link's pylOpen loads it + the shared LinkScreens;
   a failed load = the room without the 📱 choice) · the 4th choice on the 📱 sheet (PYL_ROOM.screens). Top level only DEFINES; pysWire() installs every wrap.
     host:  pylGo() as today (seats · 🎮 Ball control · 📴 drop → 🤖 · ⏸ · saves) + Link.screens.host:
            base = mode · level · arena · seed · both teams (names · looks · pins · who is a person) · team names
            picture 20× a second = the match minus its fixed parts (bodies · ball, no trail · score / sets / phase / serve · flames)
            events = the engine's own list (handleEvents) → every phone plays the same sounds / words / beats / 🔥 spirits at that time
     phone: the same match from the base (PD.newMatch with the host's seed + teams) → never steps: the NEWEST picture whole, positions glide,
            the ball's trail is made here · the game's own court (sideways = side view · upright = turned, MY side at the bottom) ·
            MY 6-petal pad: stick → the COURT direction from MY view (the host never turns it with ITS view) · petals → the host ·
            ▼ over the body I drive · ⚡ / 🌍 pill · 🏁 MY card (my aces · kills · saves …) · ⏳ the host starts the next one
     lk-9d adds: 🪞 a 🟦 phone also turns the ①②③ touch counters + every word offset round (PD.sgn(team) answers for the turned court) and the
            events' own x · words: MY moments only on my phone ("🚀 Your turn to serve!" · 🔥 Pyra ready · DIVE SAVE …), a friend's kill / point
            by name · 🌀 Party balls ride in the picture · 🔥🔥 Spirit Dive slow motion on every phone (its own words / effects slow down too) */
const PYS = {wired: false, H: null, Gs: null, pad: null, d: null, base: null, mine: null, last: 0, road: null, end: null, notes: {}, raw: {}, own: -1, sgn0: null};
const PYS_PSKIP = {bt: 1, id: 1, team: 1, slot: 1, name: 1, av: 1, pins: 1, human: 1, own: 1, bot: 1, roles: 1, st: 1, input: 1, willMiss: 1, missFor: 1, aimF: 1, aimS: 1};
const PYS_MSKIP = {arena: 1, grav: 1, mode: 1, sp: 1, level: 1, lv: 1, rnd: 1, L: 1, W: 1, netH: 1, players: 1, events: 1, log: 1, ball: 1, acc: 1, setsTo: 1, target: 1, seed0: 1, teams0: 1, guide: 1};
function pysR(v){ return Math.round(v * 100) / 100; }
function pysVal(v, d){ if(typeof v === 'number') return pysR(v); if(Array.isArray(v)) return d > 3 ? null : v.map(x => pysVal(x, d + 1)); if(v && typeof v === 'object'){ if(d > 3) return null; const o = {}; for(const k in v) if(typeof v[k] !== 'function' && k.charAt(0) !== '_') o[k] = pysVal(v[k], d + 1); return o; } return v; }
function pysCopy(o, skip){ const out = {}; for(const k in o){ if(skip[k] || k.charAt(0) === '_') continue; const v = o[k]; if(typeof v === 'function' || v === undefined) continue; out[k] = pysVal(v, 0); } return out; }
function pysPic(){ const M = G.M, m = pysCopy(M, PYS_MSKIP);
  m.p = M.players.map(p => Object.assign(pysCopy(p, PYS_PSKIP), {hh: p.human || 0}));   /* 🎮 lk-9d: hh = who drives this body now (Ball control moves it) */ m.b = pysCopy(M.ball, {trail: 1}); m.pz = G.paused || G.held ? 1 : 0; return m; }
function pysOwnRoom(){ try{ return !!(Link.cover && Link.cover.state && (Link.cover.state() || {}).own); }catch(e){ return false; } }
// ======================= HOST =======================
function pysHostStart(){
  if(!G || !G.link || G.guest) return; const M = G.M;
  PYS.H = Link.screens.host({id: PYL.pads ? PYL.pads.id : G.link.id, base: {pid: PYL.pads ? PYL.pads.id : '', cfg: G.link, mode: G.mode, level: G.level, arena: M.arena, seed: M.seed0, control: 'ball',
      teams: M.teams0, who: G.who, host: S.player}, pic: pysPic});
  const me = M.players.find(p => p.own === 1); PYS.own = me ? me.id : -1; PYS.mir = false;
}
function pysHostStop(){ if(PYS.H){ PYS.H.stop(); PYS.H = null; } }
function pysSendEnd(){ const M = G.M; PD.ctlHome(M);
  const ppl = M.players.filter(p => p.human && !p.bot).map(p => ({name: p.name, team: p.team, st: p.st}));
  Link.send('pys:end', {id: G.link.id, winner: M.winner, sets: M.teams.map(t => t.sets), setScores: G.setScores.slice(), setsTo: M.setsTo, rally: M.rallyMax, ppl, names: [0, 1].map(t => teamName(t)),
    secs: Math.round((Date.now() - G.t0) / 1000), host: S.player, mode: G.mode, level: G.level}, {sure: true}); }
// the host's phone is a player too → ITS title (the 📺 TV card names the winner) · 🚪 Leave on the card row
function pysHostCard(){ const M = G.M, me = (G.link.seats || []).find(s => s.local), h2 = document.querySelector('#result-card .gf-r-head h2'); if(!me || !h2) return;
  const team = G.link.seats.filter(s => s.side === me.side).length > 1; if(M.winner === me.side) h2.textContent = '🏆 ' + (team ? 'Your team wins!' : 'You win!');
  const x = $('pyl-exit'); if(x){ x.textContent = '🚪 Leave'; x.onclick = () => pylExit(); } }
// ======================= PHONE =======================
function pysOnScreen(d){
  if(G && G.guest && PYS.d && PYS.d.id === d.id){ PYS.d = d; return; }
  PYS.d = d;
  if(!PYS.Gs) PYS.Gs = Link.screens.guest({delay: 100, onBase: base => pysBuild(base), apply: (a, b, u, lerp) => pysApply(a, b, u, lerp), onEvents: list => pysEvents(list)});
}
function pysBuild(base){
  if(!PYS.d || !base || !base.cfg || base.pid !== PYS.d.id) return;
  if(G && G.guest && G.link && G.link.id === base.cfg.id) return;
  if(!pdPartReady('play')) return pdNeed('play', () => pysBuild(base));
  PYS.base = base; PYS.end = null; PYS.notes = {};
  const cfg = Object.assign({}, base.cfg, {seats: base.cfg.seats.map(s => Object.assign({}, s, {local: s.g === PYS.d.g}))});
  PYS.mine = cfg.seats.find(s => s.local); const myH = PYL_H + PYS.d.g;   // a phone is never the host: its person = human 11 + g on the host
  // the teams as on the host — MY person = human 1 (the game builds MY touch pad), everyone else a person with no pad
  const hm = h => h === myH ? 1 : (h === 1 ? 90 : h); PYS.hmap = h => h ? hm(h) : 0;   // the host's person numbers → this phone's (me = 1)
  const teams = base.teams.map(tm => tm.map(w => Object.assign({}, w, w.human ? {human: hm(w.human)} : {})));
  const keep = {mode: SET.mode, level: SET.level, arena: SET.arena, who: SET.who, cfg: SET.cfg, control: SET.control, cup: SET.cup, cupState: SET.cupState}, nm = PD.newMatch;
  Object.assign(SET, {mode: base.mode, level: base.level, arena: base.arena, cup: '', cupState: null, control: 'ball', who: base.who, cfg: teams});
  PD.newMatch = function(o){ o.seed = base.seed; o.teams = teams; return nm.call(this, o); };
  try{ if(G) stopLoop(); hideResult(); startMatch(); } finally { PD.newMatch = nm; Object.assign(SET, keep); }
  if(!G) return; stopLoop(); PYS.mir = PYS.MIRROR !== false && PYS.mine.side === 1;
  G.guest = {g: PYS.d.g, side: PYS.mine.side, host: base.host}; G.link = cfg; G.who = base.who;
  const me = G.M.players.find(p => p.own === 1); PYS.own = me ? me.id : -1; G.locals = me ? [me] : [];
  $('scr-play').classList.add('pys-own', 'pys-guest'); buildPads(); pysRoadPill();
  if(PYS.pad) PYS.pad.stop(); PYS.pad = Link.screens.pad(PYS.d); PYS.last = performance.now();
  pysTurnSgn(PYS.mir); if(PYS.mir) try{ barScore(); }catch(e){}   // the bar was drawn before the turn — draw it again turned
  const loop = ts => { if(!G || !G.guest) return; RAF = requestAnimationFrame(loop); let dt = Math.min(0.1, Math.max(0, (ts - PYS.last) / 1000)); PYS.last = ts; G.last = ts;
    if(G.slow > 0){ G.slow -= dt; dt *= 0.35; }   // 🔥🔥 lk-9d: Spirit Dive slow motion here too (the host's pictures slow down by themselves)
    if(!G.paused && !G.over) readInput();   // the game's own touch pad → PD.input / press on MY person → the host (wraps below)
    updateGuideUi(); updatePads(); draw(dt); warmStep(1); };
  RAF = requestAnimationFrame(loop);
}
function pysApply(a, b, u, lerp){
  if(!G || !G.guest) return; const M = G.M;
  const P = lerp(a, b, u, {phase: 1, serveTeam: 1, side: 1, n: 1, teams: 1, ctl: 1, winner: 1, over: 1, setNo: 1, pz: 1, feeder: 1, recv: 1, cp: 1, spiker: 1, setter: 1, phaseT: 1});   /* lk-9d: phaseT jumps to 0 when the phase changes — never blend it */
  for(const k in b){ if(k === 'p' || k === 'b' || k === 'pz') continue; const v = b[k]; M[k] = (typeof v === 'number' && typeof P[k] === 'number') ? P[k] : v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; }   // lk-9d: a copy — the 🪞 turn must never touch the kept picture
  b.p.forEach((src, i) => { const q = M.players[i], A = a.p[i] || src; if(!q) return; for(const k in src) if(k !== 'hh') q[k] = src[k]; if('hh' in src) q.human = PYS.hmap(src.hh);
    ['x', 'y', 'z'].forEach(k => { if(typeof A[k] === 'number' && Math.abs(src[k] - A[k]) < 4) q[k] = A[k] + (src[k] - A[k]) * u; }); });
  { const B = M.ball, A = a.b || b.b, tr = B.trail || []; for(const k in b.b) B[k] = b.b[k];
    ['x', 'y', 'z'].forEach(k => { if(typeof A[k] === 'number' && Math.abs(b.b[k] - A[k]) < 5) B[k] = A[k] + (b.b[k] - A[k]) * u; });
    B.trail = tr; if(!G.paused){ tr.push({x: B.x, y: B.y, z: B.z}); if(tr.length > 14) tr.shift(); } }
  if(PYS.mir) pysMirror(M);
  if(!!b.pz !== !!G.paused){ G.paused = !!b.pz; }
}
// 🪞 a phone on the 🟦 side sees the court turned round: MY team on the left (sideways) / at the bottom (upright) — the court is the same both ways,
//    so only the picture's x flips (bodies · ball · landing / cover spots · party balls); my stick flips back before it goes to the host
function pysMirror(M){ const fx = o => { if(o && typeof o.x === 'number'){ o.x = -o.x; if(typeof o.vx === 'number') o.vx = -o.vx; } };
  M.players.forEach(p => { fx(p); if(typeof p.dir === 'number') p.dir = -p.dir; if(p.approach) fx(p.approach); if(p.want) fx(p.want); }); fx(M.ball); const tr = M.ball.trail; if(tr && tr.length && !G.paused) tr[tr.length - 1].x = -tr[tr.length - 1].x; fx(M.landing); (M.cp || []).forEach(fx); (M.extras || []).forEach(fx); }
// 🪞 lk-9d: the page's own side sign answers for the TURNED court on a 🟦 phone (①②③ counters · "🔄 Rotate!" · word offsets) — the engine keeps its own
function pysTurnSgn(on){ if(on && !PYS.sgn0){ PYS.sgn0 = PD.sgn; PD.sgn = t => -PYS.sgn0(t); } else if(!on && PYS.sgn0){ PD.sgn = PYS.sgn0; PYS.sgn0 = null; } }
function pysEvents(list){ if(!G || !G.guest || !list) return;
  const l2 = list.filter(e => e.k !== 'match').map(e => PYS.mir && typeof e.x === 'number' ? Object.assign({}, e, {x: -e.x}) : e);   // 🪞 an event's own spot (bounce · edge · party point)
  try{ pysWords(l2, () => PYS.raw.handleEvents(l2)); }catch(e){ console.error('pys events', e); } }
// 💬 lk-9d words on an own screen: MY moments are mine (my body or the robot body I drive) · a friend's dig / dive stays small · a friend's KILL names them
function pysOwnOn(){ return !!(G && G.link && !G.link.tv && (G.guest || PYS.H)); }
function pysIsMe(id){ const q = G && G.M && G.M.players[id]; if(!q) return false; const o = ownerOf(q); return !!(o && o.own === 1); }
function pysWords(list, run){
  const bw0 = bigWord; bigWord = function(text, cls, sub, who){ if((text === 'DIVE SAVE!' || text === 'GREAT DIG!') && who && who.id != null && !pysIsMe(who.id)) return; return bw0.apply(this, arguments); };
  try{ run(); } finally { bigWord = bw0; }
  list.forEach(e => { const p = e.p != null ? G.M.players[e.p] : null, o = p && ownerOf(p);
    if(e.k === 'kill' && o && o.own && !pysIsMe(e.p)) bigWord('KILL!', '', nameOf(e.p), e.p, 'good');   // a friend's kill — by name
    if(G.locals.length !== 1 && p && pysIsMe(e.p)){   // the host's phone: G.locals holds every person, the game's "only me" checks say no — say them here
      if(e.k === 'serveTurn') banner('🚀 Your turn to serve!', 'good', 1600);
      if(e.k === 'dig' || e.k === 'dive') bigWord(e.k === 'dive' ? 'DIVE SAVE!' : 'GREAT DIG!', '', '', p, 'good'); } }); }
// ▼ over the body I drive now (🎮 Ball control moves me)
function pysMark(){ if(!V || !G || !G.M || PYS.own < 0) return; const M = G.M, o = M.players[PYS.own], p = o && (PD.bodyOf ? PD.bodyOf(M, o) : o) || o; if(!p) return;
  const f = P(p.x, p.y, (p.z || 0) + 2.35), cv = $('court'), g = cv.getContext('2d'), k = G.dpr || 1, s = Math.max(7, Math.min(12, V.k * 0.32)), col = TEAM_COL[p.team];
  g.save(); g.setTransform(k, 0, 0, k, 0, 0); g.fillStyle = col; g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.moveTo(f[0] - s, f[1] - s * 1.3); g.lineTo(f[0] + s, f[1] - s * 1.3); g.lineTo(f[0], f[1]); g.closePath(); g.fill(); g.stroke();
  g.restore(); }
function pysRoadPill(){ let el = document.getElementById('pys-road'); if(!el){ el = document.createElement('div'); el.id = 'pys-road'; el.className = 'pys-road'; $('stage').appendChild(el); }
  const upd = () => { try{ const r = Link.screens.road(G && G.guest ? Link.seat() : null); el.textContent = r.icon + ' ' + (r.ms != null ? r.ms + ' ms' : r.word); el.classList.toggle('server', r.k === 'server'); }catch(e){} };
  upd(); clearInterval(PYS.road); PYS.road = setInterval(upd, 1000); }
function pysEnd(d){ if(!G || !G.guest || !G.link || d.id !== G.link.id) return; PYS.end = d; G.over = true; setTimeout(() => { if(G && G.guest && PYS.end === d) pysCard(d); }, 1300); }
function pysCard(d){
  const s = PYS.mine.side, won = d.winner === s, x = d.ppl.find(p => p.name === S.player) || {st: {}}, st = x.st || {}, team = d.ppl.filter(p => p.team === s).length > 1, mode = PD.MODES[d.mode];
  const pl = (n, w, ws) => (n || 0) + ' ' + ((n || 0) === 1 ? w : ws || w + 's'), sums = [0, 1].map(t => d.setScores.reduce((a, q) => a + q[t], 0));
  UISound.play(won ? 'success' : 'error'); if(FX && won) confetti(['🔥', '🏐', '⭐', '🎉'], 26);
  const L0 = G.link; G.link = null;
  try{ pdCard({win: won, icon: won ? '🏆' : '💪', title: won ? (team ? 'Your team wins!' : 'You win!') : d.names[d.winner] + (/ \+ /.test(d.names[d.winner]) ? ' win!' : ' wins!'),
      sub: mode.icon + ' ' + mode.name + ' · ' + PD.LEVELS[d.level].name + ' · ' + (d.setScores.length > 1 ? 'sets ' + d.sets[s] + '–' + d.sets[1 - s] : (d.setScores[0] || [0, 0])[s] + ' – ' + (d.setScores[0] || [0, 0])[1 - s]),
      stars: null, score: null, stats: [['🚀', pl(st.aces, 'ace')], ['💥', pl(st.kills, 'kill')], ['🪶', pl(st.assists, 'assist')], ['🛡️', pl((st.digs || 0) + (st.dives || 0), 'save')], ['🧱', pl(st.stuffs, 'stuff')], ['🔥', pl(st.pyras, 'Pyra move')], ['🔁', 'rally ' + d.rally]],
      save: '⏳ ' + d.host + ' saves it for you…', levels: () => {}, again: () => {}, next: null}); } finally { G.link = L0; }
  const row = $('result-card').querySelector('.gf-r-btns');
  if(row){ row.innerHTML = '<button class="btn sp-btn sp-primary" id="pys-wait" data-sound="none" disabled>⏳ ' + UI.esc(d.host) + ' starts the next one</button><button class="btn soft sp-btn sp-secondary" id="pys-room" data-sound="none">◀ Room</button><button class="btn soft sp-btn sp-secondary" id="pys-exit" data-sound="none">🚪 Leave</button>';
    $('pys-room').onclick = () => { UISound.play('tap'); pysGuestOff(); hideResult(); leavePlay(); openCover(); if(PYL.C) Link.cover.show(PYL.C); };
    $('pys-exit').onclick = () => { UISound.play('tap'); try{ Link.leave(); }catch(e){} pysGuestOff(); hideResult(); leavePlay(); }; }
  const n = PYS.notes[S.player]; if(n){ const el = $('save-note'); if(el) el.innerHTML = n; }
}
function pysGuestOff(){ if(PYS.pad){ PYS.pad.stop(); PYS.pad = null; } pysTurnSgn(false); if(G && G.guest){ stopLoop(); G.guest = null; G.link = null; } PYS.d = null; clearInterval(PYS.road);
  const el = document.getElementById('pys-road'); if(el) el.remove(); const sp = $('scr-play'); if(sp) sp.classList.remove('pys-own', 'pys-guest'); }
const PYS_CSS = '.pys-road{position:absolute;left:50%;transform:translateX(-50%);top:calc(var(--safe-t,0px) + 46px);z-index:7;font:800 11.5px/1 Nunito,sans-serif;padding:5px 10px;border-radius:999px;background:rgba(10,14,30,.72);color:#BFF7CF;border:1.5px solid rgba(124,242,156,.6);pointer-events:none;white-space:nowrap}.pys-road.server{color:#BFEAFF;border-color:rgba(159,227,255,.6)}' +
  '#scr-play.pys-own .pyl-legend{display:none !important}';
function pysWire(){
  if(PYS.wired || !(window.Link && Link.pads && Link.screens)) return; PYS.wired = true; PYL_ROOM.screens = true;
  const st = document.createElement('style'); st.id = 'pys-css'; st.textContent = PYS_CSS; (document.head || document.documentElement).appendChild(st);
  const nm = PD.newMatch; PD.newMatch = function(o){ const M = nm.apply(this, arguments); M.seed0 = o.seed; M.teams0 = (o.teams || [[], []]).map(tm => tm.map(w => ({name: w.name, av: w.av || null, pins: w.pins || null, human: w.human || 0}))); return M; };
  // a phone's copy never steps — MY person's stick + petals go to the host
  ['input', 'press', 'release'].forEach(fn => { const f0 = PD[fn]; PD[fn] = function(M, id, a, b){
    if(G && G.guest && M === G.M){ if(id !== PYS.own || !PYS.pad) return;
      if(fn === 'input') PYS.pad.stick(PYS.mir ? -a : a, b, null);
      else if(fn === 'press'){ PYS.pad.btn(a, true); if(a !== 'drive' && a !== 'touch') setTimeout(() => PYS.pad && PYS.pad.btn(a, false), 60); }
      else PYS.pad.btn(a, false);
      return; }
    return f0.apply(this, arguments); }; });
  if(pdPartReady('play')) pysWirePlay(); else pdNeed('play', () => pysWirePlay());
  Link.pads.config({onScreen: d => pysOnScreen(d), onScreenPause: (on, by) => { if(G && G.guest){ G.paused = on; banner(on ? '⏸ ' + (by || PYS.base.host) + ' paused' : '▶ ' + (by || PYS.base.host) + ' — play on!', on ? 'gold' : 'good'); } }});
  Link.on('pys:end', d => pysEnd(d));
  Link.on('pys:note', d => { if(!d || d.name !== S.player) return; PYS.notes[d.name] = d.html; if(PYS.end){ const el = $('save-note'); if(el) el.innerHTML = d.html; } });
  Link.on('hostleft', () => { if(G && G.guest){ const h = PYS.base ? PYS.base.host : 'The host'; pysGuestOff(); hideResult(); leavePlay(); openCover(); UI.toast('👋 ' + h + ' ended the game'); } });
  const go0 = pylGo; pylGo = function(){
    const own = pysOwnRoom(); pysHostStop();
    const sc = Link.pads.screen; if(own) Link.pads.screen = o => sc(Object.assign({}, o, {screen: true}));
    try{ go0.apply(this, arguments); } finally { Link.pads.screen = sc; }
    if(own && G && G.link && !G.link.tv){ pysHostStart(); $('scr-play').classList.add('pys-own'); pysRoadPill(); } };
  // an own-screen phone sends COURT directions (its own view) → the host never turns them with ITS view
  const in0 = pylInputs; pylInputs = function(){ if(!PYS.H || !V) return in0.apply(this, arguments); const r0 = V.rot; V.rot = false; try{ return in0.apply(this, arguments); } finally { if(V) V.rot = r0; } };
}
function pysWirePlay(){
  if(PYS.playWired) return; PYS.playWired = true;
  PYS.raw.handleEvents = handleEvents; handleEvents = function(list){ if(PYS.H && G && G.link && !G.guest && list && list.length){ PYS.H.event(list); const a = arguments; return pysWords(list, () => PYS.raw.handleEvents.apply(this, a)); } return PYS.raw.handleEvents.apply(this, arguments); };
  // 💬 lk-9d: on an own screen "a local person" = ME (🔥 Pyra ready · 🚀 Your serve · 💨 · KILL!) — the 📺 TV keeps every person
  const il0 = isLocal; isLocal = function(id){ if(pysOwnOn()) return pysIsMe(id); return il0.apply(this, arguments); };
  const fm0 = finishMatch; finishMatch = function(){ if(G && G.guest) return; const own = !!PYS.H; if(own) pysSendEnd(); const r = fm0.apply(this, arguments);
    if(own){ pysHostStop(); setTimeout(() => { try{ pysHostCard(); }catch(e){} }, 0); } return r; };   // after PyraDive_link's own card row
  const pn0 = putNote; putNote = function(i, html){ const r = pn0.apply(this, arguments); try{ const p = G && G.link && !G.guest ? G.locals[i] : null, s = p && G.link.seats.find(x => x.name === p.name && !x.local); if(s) Link.send('pys:note', {name: p.name, html}, {sure: true, to: s.lseat}); }catch(e){} return r; };
  // 🪞 lk-9d: a short sideways phone puts the ①②③ counters by team number (🟧 left · 🟦 right) — on a turned court they swap sides
  // 📖 lk-9d: a Spirit Dive fills the callers' Spirit Bestiary ONCE — on the host (a phone that saved it too = 4 saves of the same creature)
  const ba0 = bestiaryAdd; bestiaryAdd = function(){ if(G && G.guest) return false; return ba0.apply(this, arguments); };
  // 🪞 lk-9d: the score bar on a turned phone — MY team's chip on the left (the chips keep their place, their contents swap, so the "vs" stays in the middle)
  const bs0 = barScore; barScore = function(){ if(!(G && G.guest && PYS.mir && typeof BAR !== 'undefined' && BAR && BAR.players)) return bs0.apply(this, arguments);   /* BAR is a page const, not window.BAR */
    const p0 = BAR.players; BAR.players = function(l){ return p0.call(this, l && l.length === 2 ? [Object.assign({}, l[1], {k: 0}), Object.assign({}, l[0], {k: 1})] : l); };
    try{ return bs0.apply(this, arguments); } finally { BAR.players = p0; } };
  const dc0 = drawCounters; drawCounters = function(g, M){ if(!(G && G.guest && PYS.mir && V && V.short)) return dc0.apply(this, arguments);
    const c0 = TEAM_COL[0], c1 = TEAM_COL[1], M2 = Object.create(M); M2.side = M.side === 0 || M.side === 1 ? 1 - M.side : M.side; TEAM_COL[0] = c1; TEAM_COL[1] = c0;
    try{ return dc0.call(this, g, M2); } finally { TEAM_COL[0] = c0; TEAM_COL[1] = c1; const a = PD_CNTS[0]; PD_CNTS[0] = PD_CNTS[1]; PD_CNTS[1] = a; } };
  const dw0 = draw; draw = function(){ const r = dw0.apply(this, arguments); if(G && (G.guest || PYS.H)) pysMark(); return r; };   // ▼ me — on the host's phone too
  const sp0 = setPaused; setPaused = function(on){ if(G && G.guest){ if(PYS.pad && !G.over) PYS.pad.pause(!!on); return; } return sp0.apply(this, arguments); };
  const lp0 = leavePlay; leavePlay = function(){ if(G && G.guest) pysGuestOff(); else pysHostStop(); clearInterval(PYS.road); const el = document.getElementById('pys-road'); if(el) el.remove(); const sp = $('scr-play'); if(sp) sp.classList.remove('pys-own', 'pys-guest'); return lp0.apply(this, arguments); };
}
GameParts.loaded('PyraDive_screens', 'lk-9d');
