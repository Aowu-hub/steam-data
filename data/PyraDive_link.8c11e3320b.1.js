
/* 📡 LINK (lk-8g): 🔥 PyraDive on own devices — LinkKit plan §55v (📡 Multiplayer chat, the ⚽ lk-8f model §55u, recipe §55c, door §55-door).
   Born split: this whole block is the part PyraDive_link (GameParts, loader PyraDiveParts, with the shared 🕹️ LinkPads part; LinkKit rides eager in the same list).
   0 bytes of game code in PyraDive.html: the 📱 Own devices chip + ?link + 📺 Station come from UiKitPlay's UI.door (od-1); the room lives on the 🎬 cover
   (PyraDive's cover `own: UI.door.now() ? C => UI.door.open(C) : null` → PyraDiveLink.own(C)). Top level only DEFINES; every wrap is put on in pylWire().
   ONE device runs the unchanged match (📺 This screen is the game · 🎮 Host + play here); every phone = ONE player's controller:
     free stick + the game's own 🌸 ring: 💥 Dunk (main, hold = power) · 🤚 Touch · ⬆️ Jump · 🤸 Dive · 🪶 Dink · 🔥 Pyra (names follow the sport:
     🦶 Strike = 🦵 Trap · 🦶 Tip · 💥 Strike · ⚡ Spark = 🦵 Trap · 🤸 Lunge · ⚡ Drive).
   1 phone = you + robots (🎮 Ball control: you move whoever plays the ball next) · 2 = ⚔️ against each other or 🤝 one team vs the robots (room chip) ·
   3–4 = 2 v 2 (🟧 phones 1 + 3 · 🟦 2 + 4; 3 = 2 v 1 + robots) · 1v1 sports (🦶 Strike 1v1 · ⚡ Spark 1v1 · 🌀 Party) max 2.
   📴 a phone that drops out → its body (and its own seat) go `auto` = the robot brain plays (engine isPerson) → back = "👋 … is back!".
   Saves: the screen saves for every person (G.locals = the phones' people, as 👥 same-device play); robots save nothing.
   ⭕ Hoop · 🎯 Drills · 🏆 Cups · 💀 Hardcore stay on one device. */
const PYL = {cfg: null, pads: null, st: null, C: null, wired: false, away: {}, team: 'duo', mode: '', prev: {}};
const PYL_MODES = ['beach', 'small', 'full', 'strikesolo', 'strikeduo', 'strikeregu', 'sparksolo', 'sparkduo', 'party'];
const PYL_RIM = {drive: '#FF6B1A', touch: '#2FD27A', jump: '#FFC845', dive: '#7CC8FF', dink: '#C9A8FF', pyra: '#FF3D3D'};
const PYL_SIDE = ['🟧', '🟦'], PYL_TEAM = ['Orange team', 'Blue team'], PYL_H = 11;   // a phone's person = human 11 + g (no key set, no touch pad on the screen)
function pylMode(){ const k = PYL.mode || SET.mode; return PYL_MODES.includes(k) ? k : 'beach'; }
function pylSolo(k){ return PD.MODES[k || pylMode()].n === 1; }
function pylMax(){ return pylSolo() ? 2 : 4; }
function pylBtnList(k){ const sp = PD.MODES[k].sport; return sp === 'strike' ? BTN_STRIKE : sp === 'spark' ? BTN_SPARK : BTN_SPIKE; }
// the phone pad = the game's own button list for the sport, 💥 main first, the same petals as the game's own 🌸 ring
function pylPad(k){
  const L = pylBtnList(k), get = a => L.find(b => b[0] === a), B = a => { const b = get(a); return b ? Object.assign({k: a, ic: b[1], nm: b[2], rim: PYL_RIM[a]}, a === 'drive' ? {main: true} : {}) : null; };
  const sp = PD.MODES[k].sport, what = sp === 'strike' ? 'kick' : sp === 'spark' ? 'trap' : 'bump';
  return {stick: 'free', ready: PD.MODES[k].icon + ' Get ready — first serve!', hint: '🕹️ run to the 🎯 ring · ' + get('touch')[1] + ' ' + what + ' · ' + get('drive')[1] + ' hold = power · 🔥 half flame = a Pyra move',
    btns: ['drive', 'touch', 'jump', 'dive', 'dink', 'pyra'].map(B).filter(Boolean)};
}
function pylLevelOk(i){ return i >= 0 && i <= 4 && canPlay(i); }
function pylNow(){ return PYL.st || {level: SET.level, arena: SET.arena, mode: pylMode()}; }
function pylFix(){ if(PYL.st) return; if(!pylLevelOk(SET.level)) SET.level = 0; if(!PYL.mode) PYL.mode = pylMode(); }
function pylArena(k){ return ARENAS.find(a => a.k === k) || ARENAS[0]; }
function pylLabel(tv){ const n = pylNow(), m = PD.MODES[n.mode], A = pylArena(n.arena);
  return m.icon + ' ' + m.name + ' · ' + LEVEL_UI[n.level].emoji + ' ' + PD.LEVELS[n.level].name + ' · ' + A.icon + ' ' + A.name + (tv ? ' · 📺 on the TV' : ''); }
const PYL_ROOM = {game: 'PyraDive', title: '🔥 PyraDive', page: 'pyradive', kind: 'pyradive', seats: 4, min: 1, pads: true,
  url: WEBAPP_URL + '?page=pyradive', name: () => S.player, av: () => myAvatar(S.player), drawAvatar: (cv, p) => drawPreviewCanvas(cv, myAvatar(p.name), {name: p.name, t: 1}),
  label: tv => pylLabel(tv), bot: () => '· 1 = you + the robots', picks: el => pylPicks(el),
  how: 'Gameroom → 🔥 PyraDive → 📱 Own devices → 🕹️ Join · or scan · 1 = you + the robots · 2 = ⚔️ or 🤝 · 3–4 = 2 v 2',
  onLink: () => { pylFix(); }, onStart: () => pylGo()};
// the host's picks as chips in the room card — tap = the next one: 🏐 game · 🎚️ level · 🏟️ arena · ⚔️ / 🤝 (2 phones, team sports)
function pylPicks(el){
  pylFix(); const n = pylNow(), m = PD.MODES[n.mode], A = pylArena(n.arena);
  el.innerHTML = '<button class="lkc-chip" data-k="mode" data-sound="none">' + m.icon + ' ' + UI.esc(m.name) + '</button>' +
    '<button class="lkc-chip" data-k="lvl" data-sound="none">' + LEVEL_UI[n.level].emoji + ' ' + UI.esc(PD.LEVELS[n.level].name) + '</button>' +
    '<button class="lkc-chip" data-k="arena" data-sound="none">' + A.icon + ' ' + UI.esc(A.name) + '</button>' +
    (pylSolo(n.mode) ? '' : '<button class="lkc-chip" data-k="team" data-sound="none">' + (PYL.team === 'coop' ? '🤝 2 = one team' : '⚔️ 2 = each other') + '</button>');
  if(PYL.st){ el.querySelectorAll('.lkc-chip').forEach(b => { b.disabled = true; }); return; }
  el.querySelectorAll('.lkc-chip').forEach(b => b.onclick = e => { e.stopPropagation(); const nx = (ks, v) => ks[(ks.indexOf(v) + 1) % ks.length];
    if(b.dataset.k === 'mode') PYL.mode = nx(PYL_MODES, n.mode);
    else if(b.dataset.k === 'lvl') SET.level = nx([0, 1, 2, 3, 4].filter(pylLevelOk), SET.level);
    else if(b.dataset.k === 'arena') SET.arena = nx(ARENAS.map(a => a.k), SET.arena);
    else PYL.team = PYL.team === 'coop' ? 'duo' : 'coop';
    savePrefs(); UISound.play('tap'); pylPicks(el); try{ if(Link.isHost()) Link.setLabel(pylLabel(Link.hostess())); }catch(er){} });
}
// 🟧 / 🟦 sides for the phones in seat order: 1 = you + robots · 2 = ⚔️ (one each) or 🤝 (both 🟧) · 3 = 🟧🟦🟧 · 4 = 🟧🟦🟧🟦
function pylSides(n){ if(n === 1) return [0]; if(n === 2) return PYL.team === 'coop' && !pylSolo() ? [0, 0] : [0, 1]; return [0, 1, 0, 1].slice(0, n); }
function pylOpen(C){ pylWire(); pylStationReg(); PYL.C = C; const then = PYL.then; PYL.then = null;
  if(PYL.wantTv){ PYL.wantTv = false; Link.cover.tv(C, PYL_ROOM); } else Link.cover(C, PYL_ROOM); if(then) then(); }
// open the cover and press its 📱 Own devices (→ UI.door.open(C) → PyraDiveLink.own(C)); then() runs once the room is open
function pylCover(then){ openCover(); const b = document.querySelector('.gf-cover .gf-own'); if(!b || b.hidden) return false; PYL.then = then || null; b.click(); return true; }
// ▶ Start on the cover (host) / 🔁 Play again: the linked players → people in seat order (the TV itself is no seat)
function pylGo(){
  if(!pdPartReady('play')) return pdNeed('play', pylGo);
  pylWire(); pylFix(); const now = pylNow(), tv = !!(Link.hostess && Link.hostess()), me = Link.seat();
  const list = Link.players().filter(p => p.name && (p.on || p.me) && !p.screen).sort((a, b) => a.seat - b.seat).slice(0, pylMax());
  if(list.length < 1){ UISound.play('error'); UI.toast(tv ? '📺 Wait for a player to join' : '📡 Wait for a friend to join'); return; }
  pylStop(); hideResult();
  const sides = pylSides(list.length), id = Date.now().toString(36);
  PYL.cfg = {id, tv, station: !!PYL.st, mode: now.mode, level: now.level, arena: now.arena,
    seats: list.map((p, k) => ({lseat: p.seat, g: k, name: p.name, side: sides[k], local: !tv && p.seat === me}))};
  PYL.away = {}; PYL.prev = {};
  // the match = the game's own startMatch with the phones as its people (human 11 + g = no keys / no touch pad on the screen, except 🎮 the host's own = human 1)
  const H = PYL.cfg.seats.map(s => ({name: s.name, side: s.side, h: s.local ? 1 : PYL_H + s.g}));
  const two = H.some(h => h.side === 1) && H.some(h => h.side === 0);
  const keep = {mode: SET.mode, level: SET.level, arena: SET.arena, who: SET.who, cfg: SET.cfg, control: SET.control, cup: SET.cup, cupState: SET.cupState};
  const teams = [[], []]; H.forEach(h => teams[h.side].push({name: h.name, av: playAv(myAvatar(h.name)), human: h.h, pins: pinsOf(h.name)}));
  Object.assign(SET, {mode: now.mode, level: now.level, arena: now.arena, cup: '', cupState: null, control: 'ball', who: two ? 'duo' : H.length > 1 ? 'team' : 'robot', cfg: teams});
  try{ startMatch(); } finally { Object.assign(SET, {cfg: null, who: keep.who, control: keep.control, cup: keep.cup, cupState: keep.cupState}); if(PYL.st) Object.assign(SET, {mode: keep.mode, level: keep.level, arena: keep.arena}); }
  if(!G) return;
  G.link = PYL.cfg; G.who = two ? 'duo' : 'team';
  const play = $('scr-play'); play.classList.add('pyl-on'); buildPads(); pylLegend();
  PYL.pads = Link.pads.screen({game: 'PyraDive', title: pylLabel(false), kind: 'pyradive', host: tv ? 'the TV' : S.player, pad: pylPad(now.mode),
    seats: PYL.cfg.seats.filter(s => !s.local).map(s => ({lseat: s.lseat, gseat: s.g, name: s.name, col: TEAM_COL[s.side], cname: PYL_SIDE[s.side] + ' ' + PYL_TEAM[s.side],
      where: two ? '⚔️ vs ' + teamName(1 - s.side) : H.length > 1 ? '🤝 with ' + H.filter(h => h.name !== s.name).map(h => h.name).join(' + ') + ' vs the robots' : PD.MODES[now.mode].icon + ' you + the robots'})),
    onBtn: (g, k, on) => pylBtn(g, k, on),
    onDrop: g => pylDrop(g), onBack: g => pylBack(g),
    onPause: (on, name) => { if(!G || G.over || !!G.paused === on) return; setPaused(on); banner(on ? '⏸ ' + name + ' paused' : '▶ ' + name + ' — play on!', on ? 'gold' : 'go'); },
    status: g => pylStatus(g)});
}
function pylSeat(g){ return PYL.cfg && PYL.cfg.seats[g]; }
function pylOwn(g){ const s = pylSeat(g); if(!s || !G) return null; const h = s.local ? 1 : PYL_H + s.g; return G.M.players.find(p => p.own === h) || null; }   // the person's OWN seat (the page speaks for it)
function pylBody(g){ const o = pylOwn(g); return o ? PD.bodyOf(G.M, o) : null; }   // 🎮 the body that person drives now
function pylOf(p){ if(!p || !p.human || p.human < PYL_H) return -1; return p.human - PYL_H; }   // a body → its phone (or -1)
function pylLegend(){ const st = $('stage'); let el = $('pyl-legend'); if(!el){ el = document.createElement('div'); el.id = 'pyl-legend'; el.className = 'pyl-legend'; st.appendChild(el); }
  const lo = PYL.cfg.seats.find(s => s.local); el.innerHTML = '<span>' + (lo ? '🎮 ' + UI.esc(lo.name) + ' plays here · 📱 friends on their phones' : '📱 The phones are the controllers') + '</span>' + PYL.cfg.seats.map(s => '<b><i style="background:' + TEAM_COL[s.side] + '"></i>' + UI.esc(s.name) + (PYL.away[s.g] ? ' 🤖' : '') + '</b>').join(' ') + '<span><span class="kk">Esc</span> pause</span>'; }
// a phone's button → the same PD.press / PD.release the game's own touch pad uses (🤸 Dive reads the stick first, like the pad)
function pylBtn(g, k, on){
  if(!G || !G.link || G.paused || G.held || G.over || PYL.away[g]) return; const o = pylOwn(g); if(!o) return;
  if(on){ if(k === 'dive') pylInputs(); PD.press(G.M, o.id, k); if(typeof flashBtn === 'function') flashBtn(o.id, k); }
  else if(k === 'drive' || k === 'touch') PD.release(G.M, o.id, k);
}
// every frame, after the game read its own keys: the phones' sticks → their person (screen directions; an upright TV turns the court like the game's own stick)
function pylInputs(){
  const C = PYL.cfg; if(!C || !G || !G.link || !PYL.pads) return; const M = G.M, rot = typeof V !== 'undefined' && V && V.rot;
  C.seats.forEach(s => { if(s.local) return; const o = pylOwn(s.g); if(!o) return;
    if(PYL.away[s.g]){ PD.input(M, o.id, 0, 0); return; }
    const inp = PYL.pads.input(s.g); if(!inp || inp.away){ PD.input(M, o.id, 0, 0); return; }
    let sx = inp.x || 0, sy = inp.y || 0; if(Math.hypot(sx, sy) < 0.14){ sx = 0; sy = 0; }
    if(rot) PD.input(M, o.id, -sy, sx); else PD.input(M, o.id, sx, sy); });
}
// 📴 / 👋 a dropped phone: its own seat + the body it drives go `auto` (the robot brain plays them; Ball control stays put) — back = yours again
function pylAuto(g, on){ const s = pylSeat(g); if(!s || !G) return; const h = s.local ? 1 : PYL_H + s.g; G.M.players.forEach(p => { if(p.own === h || p.human === h){ p.auto = on; if(on){ p.input = {x: 0, y: 0}; p.charge = -1; } } }); }
function pylDrop(g){ const s = pylSeat(g); if(!s || !G || !G.link || G.over) return; PYL.away[g] = 1; pylAuto(g, true); pylLegend(); banner('🤖 A robot plays for ' + s.name + ' until they come back', 'bad', 2200); }
function pylBack(g){ const s = pylSeat(g); if(!s || !G || !G.link || !PYL.away[g]) return; delete PYL.away[g]; pylAuto(g, false); pylLegend(); banner('👋 ' + s.name + ' is back!', 'go'); UISound.play('success'); }
// the game's own moments (the events list each frame, after the page) → buzz on the phones whose person it was
function pylEvents(list){
  if(!PYL.pads || !G || !G.link) return; const M = G.M, mine = e => e.p != null ? pylOf(M.players[e.p]) : -1, side = t => PYL.cfg.seats.filter(x => x.side === t && !x.local).map(x => x.g);
  (list || []).forEach(e => { const g = mine(e);
    if(e.k === 'point'){ side(e.team).forEach(x => pylBuzz(x, 'win', '🔥 Point for your team! ' + e.score[e.team] + ' – ' + e.score[1 - e.team])); side(1 - e.team).forEach(x => pylBuzz(x, 'hit', '😮 Their point · ' + e.score[1 - e.team] + ' – ' + e.score[e.team])); }
    else if(e.k === 'ace' && g >= 0) pylBuzz(g, 'got', '🚀 ACE! Straight from your serve!');
    else if(e.k === 'kill' && g >= 0) pylBuzz(g, 'got', '💥 KILL! Your point!');
    else if(e.k === 'stuff' && g >= 0) pylBuzz(g, 'got', '🧱 STUFF block!');
    else if(e.k === 'pyra' && g >= 0) pylBuzz(g, 'power', '🔥 ' + e.name + '!');
    else if(e.k === 'spirit' && g >= 0) pylBuzz(g, 'power', '🔥🔥 Spirit Dive : ' + (e.cname || e.name || '') + '!');
    else if(e.k === 'meterHalf' && g >= 0) pylBuzz(g, 'power', '🔥 Half flame — tap 🔥 Pyra before your next hit!');
    else if(e.k === 'meterFull' && g >= 0) pylBuzz(g, 'power', '🔥🔥 Full flame — 🔥 Pyra = a SPIRIT DIVE!');
    else if(e.k === 'edge' && g >= 0) pylBuzz(g, 'got', '💥 EDGE ball!');
    else if(e.k === 'setWon') PYL.pads.buzzAll('tick', '🏁 Set to ' + teamName(e.team) + '!');
    else if(e.k === 'matchPoint') side(e.team).forEach(x => pylBuzz(x, 'tick', '⚡ Match point — one more!'));
  });
}
function pylBuzz(g, k, t){ const s = pylSeat(g); if(PYL.pads && s && !s.local && !PYL.away[g]) PYL.pads.buzz(g, k, t); }
// MY status 4× a second: 🔥 score (+ sets) · 🔥 flame · ①②③ touches on my side · button names by the sport · the 🌱 guide line + the button to press glows
function pylStatus(g){
  const s = pylSeat(g); if(!s || !G) return {state: 'wait'}; const M = G.M, b = pylBody(g); if(!b) return {state: 'wait'};
  const T = s.side, sc = M.teams.map(t => t.score), chips = [['🏐', sc[T] + ' – ' + sc[1 - T]]];
  if(M.setsTo > 1) chips.push(['🏁', M.teams[T].sets + ' – ' + M.teams[1 - T].sets]);
  chips.push(['🔥', Math.round(b.meter) + '%']);
  if(M.phase === 'rally' && M.side === T && M.n > 0) chips.push(['👆', ['①', '②', '③'][Math.min(2, M.n - 1)]]);
  const half = b.meter >= PD.PYRA_COST, full = b.meter >= PD.SPIRIT_COST, glow = {}, btns = {};
  if(b.pyraArm) btns.pyra = [full || b.spiritArm ? '🔥🔥' : '🔥', b.spiritArm ? 'Spirit!' : 'Armed'];
  else if(full) btns.pyra = ['🔥🔥', 'Spirit'];
  else if(!half) btns.pyra = ['🔥', 'Pyra', 1];   // grey until half a flame (the game's own crescent only shows when the meter can pay)
  const gd = M.guide && M.guide.p === b.id ? M.guide : null, help = M.lv.assist.slowmo === 1 || M.guidedLeft > 0;
  let line = PYL.away[g] ? '🤖 A robot plays for you' : '';
  if(!line && gd && (help || gd.why === 'serve' || gd.why === 'toss')){ const GL = PD.isSpark(M) ? GOAL_SPARK : PD.isStrike(M) ? GOAL_STRIKE : GOAL, w = GL[gd.why] || GL.bump; line = w ? w[0] : ''; glow[gd.key] = 1; }
  if(!line && M.phase === 'serve' && M.ball.held === b.id) line = PD.MODES[M.mode].icon + ' Your serve! Hold ' + pylBtnList(M.mode).find(x => x[0] === 'drive')[1] + ' for power';
  if(!line && M.phase === 'point') line = '';
  if(half && !b.pyraArm) glow.pyra = 1;
  return {chips, cool: {pyra: half ? 0 : 1 - b.meter / PD.PYRA_COST}, glow, btns, state: G.over ? 'wait' : PYL.away[g] ? 'out' : 'play', line};
}
const pylWins = n => n + (/ \+ /.test(n) || n === 'Robots' ? ' win!' : ' wins!');
function pylEnd(){
  if(!PYL.pads || !G) return; const M = G.M, w = M.winner, lines = {}, wins = {}, sums = [0, 1].map(t => G.setScores.reduce((a, x) => a + x[t], 0));
  PYL.cfg.seats.forEach(s => { const won = w === s.side; wins[s.g] = won ? 1 : 0; lines[s.g] = (won ? '🏆 You win · ' : '💪 So close · ') + (M.setsTo > 1 ? 'sets ' + M.teams[s.side].sets + ' – ' + M.teams[1 - s.side].sets : sums[s.side] + ' – ' + sums[1 - s.side]); });
  PYL.pads.end({icon: '🏆', title: pylWins(teamName(w)), lines, wins});
}
// the TV / host card: 🔁 Play again (the same people) · ◀ Room · 🚪 End the room (the game's own Levels / Again / Next would leave the room)
function pylCardRow(){
  const row = $('result-card') && $('result-card').querySelector('.gf-r-btns'); if(!row || !PYL.cfg) return; const tv = PYL.cfg.tv;
  row.innerHTML = '<button class="btn sp-btn sp-primary" id="pyl-again" data-sound="pop">🔁 Play again</button><button class="btn soft sp-btn sp-secondary" id="pyl-room" data-sound="none">◀ Room</button>' +
    '<button class="btn soft sp-btn sp-secondary" id="pyl-exit" data-sound="none">' + (tv ? '🚪 End the room' : '🎚️ Levels') + '</button>';
  $('pyl-again').onclick = () => pylGo(); $('pyl-room').onclick = () => pylToCover(); $('pyl-exit').onclick = () => pylExit();
}
function pylToCover(){ pylStop(); PYL.cfg = null; leavePlay(); openCover(); if(PYL.C) Link.cover.show(PYL.C); }
function pylStop(){ if(PYL.pads) PYL.pads.stop(); PYL.pads = null; const pl = $('scr-play'); if(pl) pl.classList.remove('pyl-on'); const lg = $('pyl-legend'); if(lg) lg.remove(); }
function pylExit(){ try{ if(Link.status() !== 'idle') Link.leave(); }catch(e){} pylStop(); PYL.cfg = null; leavePlay(); }
// the wraps (once, after the play part is here): no keys / touch pad on the screen for a phone's person · the phones' sticks · moments · the end → every phone · names, never "You", on the TV
function pylWraps(){
  if(PYL.wrapped || typeof readInput !== 'function') return; PYL.wrapped = true;
  const linked = () => !!(G && G.link), host = () => G.locals.find(p => p.own === 1) || null;
  const sp0 = window.seatPlayer; window.seatPlayer = function(s){ return linked() ? (s === 0 ? host() : null) : sp0.apply(this, arguments); };
  const ri0 = window.readInput; window.readInput = function(){ if(!linked()) return ri0.apply(this, arguments); const keep = G.locals; G.locals = keep.filter(p => p.own === 1); let r; try{ r = ri0.apply(this, arguments); } finally { G.locals = keep; } try{ pylInputs(); }catch(e){} return r; };
  const bp0 = window.buildPads; window.buildPads = function(){ if(!linked()) return bp0.apply(this, arguments); const keep = G.locals; G.locals = keep.filter(p => p.own === 1); try{ return bp0.apply(this, arguments); } finally { G.locals = keep; } };
  const he0 = window.handleEvents; window.handleEvents = function(list){ const r = he0.apply(this, arguments); try{ pylEvents(list); }catch(e){} return r; };
  const bn0 = window.banner; window.banner = function(t){ if(linked() && /^🚀 Your turn to serve/.test(t || '')){ const p = G.locals[0]; arguments[0] = '🚀 ' + (p ? p.name : '') + '\'s turn to serve!'; } return bn0.apply(this, arguments); };
  const cp0 = window.ctlPill; if(typeof cp0 === 'function') window.ctlPill = function(g, x, y, ic, txt){ if(linked() && txt === 'You' && G.locals[0]) arguments[4] = G.locals[0].name; return cp0.apply(this, arguments); };
  const pc0 = window.pdCard; window.pdCard = function(o){ if(linked() && o){ const w = G.M.winner, p = G.locals.find(q => q.team === w) || G.locals[0]; if(p) Object.assign(o, {me: p.name, buddy: {name: p.name, av: myAvatar(p.name)}}); } return pc0.apply(this, arguments); };   // the card's buddy = the winning person, never the TV's own name
  const fm0 = window.finishMatch; window.finishMatch = function(){ const at = linked() && UI.alsoTry; if(at) UI.alsoTry = null; let r; try{ r = fm0.apply(this, arguments); } finally { if(at) UI.alsoTry = at; }   // no ✨ Also try on a room's card
    try{ if(linked() && !G.M.drill){ const w = G.M.winner, h2 = document.querySelector('#result-card .gf-r-head h2'); if(h2 && w != null) h2.textContent = '🏆 ' + pylWins(teamName(w)); pylEnd(); pylCardRow(); } }catch(e){} return r; };
  if(fm0.__gmood) window.finishMatch.__gmood = 1;
  const lp0 = window.leavePlay; window.leavePlay = function(){ if(PYL.cfg && linked()) pylStop(); return lp0.apply(this, arguments); };
}
function pylWire(){
  if(!PYL.wired){ PYL.wired = true;
    if(!document.getElementById('pyl-css')){ const st = document.createElement('style'); st.id = 'pyl-css'; st.textContent = PYL_CSS; document.head.appendChild(st); }
    Link.pads.config({drawAvatar: (cv, n) => drawPreviewCanvas(cv, myAvatar(n), {name: n, t: 1}), avatar: n => myAvatar(n), onRoom: () => { if(PYL.C) Link.cover.show(PYL.C); }, onLeave: () => openCover()});
    Link.on('lk:ask', (d, seat) => { if(!Link.isHost() || !d || d.what !== 'again' || !PYL.cfg || !PYL.cfg.tv) return; if(G && G.over && Link.captain() === seat) pylGo(); });
    addEventListener('pagehide', () => { try{ if(Link.status() !== 'idle') Link.leave(); }catch(e){} }); }
  if(pdPartReady('play')) pylWraps(); else pdNeed('play', () => pylWraps());
}
var PYL_CSS = '#scr-play.pyl-on #hand, #scr-play.pyl-on #goal-line, #scr-play.pyl-on #keylegend{display:none !important}' +
  '.pyl-legend{position:absolute;left:50%;top:calc(var(--gb-h,56px) + 6px);transform:translateX(-50%);display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;max-width:94%;padding:5px 12px;border-radius:14px;background:rgba(10,14,30,.62);color:#fff;font:700 13px/1.2 system-ui,sans-serif;z-index:6;pointer-events:none}' +
  '.pyl-legend b{display:inline-flex;gap:5px;align-items:center}.pyl-legend i{width:11px;height:11px;border-radius:50%;display:inline-block;box-shadow:0 0 0 2px #fff}.pyl-legend .kk{border:1px solid #fff8;border-radius:5px;padding:0 4px}';
// ---- 📺 the TV Game Station: the vote picks the level + the ✋ way (a sport / court size) ----
function pylStationReg(){
  if(PYL.stReg || !window.Station) return; PYL.stReg = true;
  Station.game({url: WEBAPP_URL, page: 'pyradive', player: () => S.player || CURRENT_PLAYER, start: () => Link.cover.start(), again: () => pylGo(),
    result: () => (G && G.link && G.over && !$('result').classList.contains('hidden')) ? $('result-card') : (Link.pads && Link.pads.resultCard ? Link.pads.resultCard() : null), hide: '.gf-r-btns, .lp-cb, .lp-wait'});
}
function pylStation(t){
  pylStationReg();
  if(!Station.on){ if((t | 0) < 60) setTimeout(() => pylStation((t | 0) + 1), 50); return false; }
  if(!Station.tv) return false;
  const lv = Station.lvl == null ? 0 : Math.max(0, Math.min(4, Station.lvl)), way = PYL_MODES.includes(Station.way) ? Station.way : 'beach';
  PYL.st = {level: lv, arena: SET.arena, mode: way}; PYL.wantTv = true;
  if(!pylCover()){ PYL.wantTv = false; return false; } return true;
}
// ---- the od-1 door API: 🎬 cover 📱 Own devices (own) · setup chip (open) · ?link=<code> (url) · 📺 Station (station) ----
window.PyraDiveLink = {
  own: C => pylOpen(C),
  open: () => pylCover(),
  url: code => { pylStationReg(); pylCover(() => setTimeout(() => Link.cover.join(code), 0)); },
  station: () => pylStation(0)
};
GameParts.loaded('PyraDive_link', 'lk-8g');
