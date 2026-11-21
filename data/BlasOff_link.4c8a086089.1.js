
/* 📡 LINK (lk-8f): ⚽ BlasOff on own devices — LinkKit plan §55t (📡 Multiplayer chat, recipe §55c + §55g, door §55-door, Aowu 00:39 "go" = all ⭐).
   Born split: this whole block is the part BlasOff_link (GameParts, loader BlasOffParts, with the shared 🕹️ LinkPads part; LinkKit rides eager in the same list).
   0 bytes in BlasOff.html: the 📱 Own devices chip + ?link + 📺 Station come from UiKitPlay's UI.door (od-1); the room lives on the 🎬 cover
   (BlasOffFrame `own: UI.door.now() ? C => UI.door.open(C)` → BlasOffLink.own(C)). Top level only DEFINES; every wrap is put on in bolWire().
   ONE device runs the unchanged match (📺 This screen is the game · 🎮 Host + play here); every phone = ONE player's controller:
     free stick (push far = 💨 sprint) + the game's own 🌸 ring: 💥 Shoot (main, hold = power) · ⚽ Pass · 🌀 Trick · 🦘 Jump · 🔄 Switch
     — without the ball the same buttons are 🦶 Tackle · 🛷 Slide · 🙋 Press (the phone renames them live) · 📣 a shot at your goal → ⬅️ / ➡️ shout row on the phone.
   1 phone = you vs the robots · 2 = 🆚 against each other or 🤝 one team vs the robots (room chip) · 3–4 = 2 v 2 (🟦 phones 1 + 3 · 🟥 2 + 4; 3 = 2 v 1).
   📴 a phone that drops out → its player goes back to the team's robot brain (the engine plays every player nobody controls) → back = "👋 … is back!"
   and the phone takes the player nearest the ball. Saves: the screen saves for every person (G.humans, as 👥 same-device play); robots save nothing.
   🎯 Skills · 🏆 Cups · 📜 Kick Tale · 🎤 Tricks Battle · 💀 Hardcore stay on one device. */
const BOL = {cfg: null, pads: null, st: null, C: null, wired: false, away: {}, bt: {}, li: 0, team: 'duo', kind: '', shout: {}, prev: {}};
const BOL_KINDS = ['fours', 'sevens', 'elevens', 'futsal', 'street', 'party', 'shootout'];
const BOL_RIM = {shoot: '#FF6B3D', pass: '#2FD27A', trick: '#7CC8FF', jump: '#FFC845', sw: '#C9A8FF'};
const BOL_SIDE = ['🟦', '🟥'];
function bolKind(){ const k = BOL.kind || (SET.kind === 'match' ? SZ_ID[SET.size] : SET.kind); return BOL_KINDS.includes(k) ? k : 'fours'; }
function bolMax(){ const k = bolKind(); return k === 'street' || k === 'shootout' ? 2 : 4; }
function bolPad(k){
  const B = (key, ic, nm, main) => Object.assign({k: key, ic, nm, rim: BOL_RIM[key]}, main ? {main: true} : {});
  if(k === 'shootout') return {stick: 'free', ready: '🥅 Get ready — penalties!', hint: '🕹️ aim · 💥 kick on the 🎯 · in goal: stick ⬅️ ➡️ + 🦘 dive',
    btns: [B('shoot', '💥', 'Kick', true), B('jump', '🦘', 'Dive')]};
  const btns = [B('shoot', '💥', 'Shoot', true), B('pass', '⚽', 'Pass'), B('trick', '🌀', 'Trick'), B('jump', '🦘', 'Jump')];
  if(k !== 'street') btns.push(B('sw', '🔄', 'Switch'));
  return {stick: 'free', ready: '⚽ Get ready — kick-off!', hint: '🕹️ run · push far = 💨 sprint · hold 💥 = power · 🌀 then ⚽ / 💥 = a trick pass / shot', btns};
}
function bolLevelOk(i){ return i >= 0 && i <= 4 && canPlay(i); }
function bolNow(){ return BOL.st || {level: SET.level, theme: SET.theme, kind: bolKind()}; }
function bolFix(){ if(BOL.st) return; if(!bolLevelOk(SET.level)) SET.level = 0; if(!BOL.kind) BOL.kind = bolKind(); }
function bolLabel(tv){ const n = bolNow(), M0 = MODES.find(m => m.k === n.kind) || MODES[0], Lk = LOOKS[n.theme] || LOOKS.classic;
  return M0.icon + ' ' + M0.name + ' · ' + LEVEL_UI[n.level].emoji + ' ' + BO.LEVELS[n.level].name + ' · ' + Lk.icon + ' ' + Lk.name + (tv ? ' · 📺 on the TV' : ''); }
const BOL_ROOM = {game: 'BlasOff', title: '⚽ BlasOff', page: 'blasoff', kind: GAME_ID, seats: 4, min: 1, pads: true,
  url: WEBAPP_URL + '?page=blasoff', name: () => S.player, av: () => myAvatar(S.player), drawAvatar: (cv, p) => drawPreviewCanvas(cv, myAvatar(p.name), {name: p.name, t: 1}),
  label: tv => bolLabel(tv), bot: () => '· 1 = you vs the robots', picks: el => bolPicks(el),
  how: 'Gameroom → ⚽ BlasOff → 📱 Own devices → 🕹️ Join · or scan · 1 = you vs the robots · 2 = 🆚 or 🤝 · 3–4 = 2 v 2',
  onLink: () => { bolFix(); }, onStart: () => bolGo()};
// the host's picks as chips in the room card — tap = the next one: ⚽ mode · 🎚️ level · 🏟️ pitch · 🆚 / 🤝 (2 phones)
function bolPicks(el){
  bolFix(); const n = bolNow(), M0 = MODES.find(m => m.k === n.kind) || MODES[0], Lk = LOOKS[n.theme] || LOOKS.classic;
  el.innerHTML = '<button class="lkc-chip" data-k="kind" data-sound="none">' + M0.icon + ' ' + UI.esc(M0.name) + '</button>' +
    '<button class="lkc-chip" data-k="lvl" data-sound="none">' + LEVEL_UI[n.level].emoji + ' ' + UI.esc(BO.LEVELS[n.level].name) + '</button>' +
    '<button class="lkc-chip" data-k="look" data-sound="none">' + Lk.icon + ' ' + UI.esc(Lk.name) + '</button>' +
    (n.kind === 'street' || n.kind === 'shootout' ? '' : '<button class="lkc-chip" data-k="team" data-sound="none">' + (BOL.team === 'coop' ? '🤝 2 = one team' : '🆚 2 = each other') + '</button>');
  if(BOL.st){ el.querySelectorAll('.lkc-chip').forEach(b => { b.disabled = true; }); return; }
  el.querySelectorAll('.lkc-chip').forEach(b => b.onclick = e => { e.stopPropagation(); const nx = (ks, v) => ks[(ks.indexOf(v) + 1) % ks.length];
    if(b.dataset.k === 'kind') BOL.kind = nx(BOL_KINDS, n.kind);
    else if(b.dataset.k === 'lvl') SET.level = nx([0, 1, 2, 3, 4].filter(bolLevelOk), SET.level);
    else if(b.dataset.k === 'look') SET.theme = nx(LOOK_KEYS, SET.theme);
    else BOL.team = BOL.team === 'coop' ? 'duo' : 'coop';
    savePrefs(); UISound.play('tap'); bolPicks(el); try{ if(Link.isHost()) Link.setLabel(bolLabel(Link.hostess())); }catch(er){} });
}
// 🟦 / 🟥 sides for the phones in seat order: 1 = vs robots · 2 = 🆚 (one each) or 🤝 (both 🟦) · 3 = 🟦🟥🟦 · 4 = 🟦🟥🟦🟥
function bolSides(n){ if(n === 1) return [0]; if(n === 2) return BOL.team === 'coop' && !['street', 'shootout'].includes(bolKind()) ? [0, 0] : [0, 1]; return [0, 1, 0, 1].slice(0, n); }
function bolOpen(C){ bolWire(); bolStationReg(); BOL.C = C; const then = BOL.then; BOL.then = null;
  if(BOL.wantTv){ BOL.wantTv = false; Link.cover.tv(C, BOL_ROOM); } else Link.cover(C, BOL_ROOM); if(then) then(); }
// open the cover and press its 📱 Own devices (→ UI.door.open(C) → BlasOffLink.own(C)); then() runs once the room is open
function bolCover(then){ openCover(); const b = document.querySelector('.gf-cover .gf-own'); if(!b || b.hidden) return false; BOL.then = then || null; b.click(); return true; }
// ▶ Start on the cover (host) / 🔁 Play again: the linked players → people in seat order (the TV itself is no seat)
function bolGo(){
  if(!boPartReady('play')) return boNeed('play', bolGo);
  bolWire(); bolFix(); const now = bolNow(), tv = !!(Link.hostess && Link.hostess()), me = Link.seat();
  const list = Link.players().filter(p => p.name && (p.on || p.me) && !p.screen).sort((a, b) => a.seat - b.seat).slice(0, bolMax());
  if(list.length < 1){ UISound.play('error'); UI.toast(tv ? '📺 Wait for a player to join' : '📡 Wait for a friend to join'); return; }
  bolStop(); hideResult();
  const sides = bolSides(list.length), id = Date.now().toString(36);
  BOL.cfg = {id, tv, station: !!BOL.st, kind: now.kind, level: now.level, theme: now.theme,
    seats: list.map((p, k) => ({lseat: p.seat, g: k, name: p.name, side: sides[k], local: !tv && p.seat === me}))};
  BOL.away = {}; BOL.bt = {}; BOL.shout = {}; BOL.prev = {};
  // the match = the game's own startMatch with the phones as its people (seat 10 + g = no keys / no touch pad on the screen, except 🎮 the host's own)
  const H = BOL.cfg.seats.map(s => ({name: s.name, side: s.side, seat: s.local ? 0 : 10 + s.g}));
  const keep = {kind: SET.kind, size: SET.size, level: SET.level, theme: SET.theme, who: SET.who}, nm = BO.newMatch;
  setKind(now.kind); SET.level = now.level; SET.theme = now.theme; SET.who = H.some(h => h.side === 1) ? 'duo' : H.length > 1 ? 'coop' : 'robot';   // the game's own camera rule: 🆚 two teams of people = ↔️ side view
  BO.newMatch = function(o){ const Sz = BO.SIZES[o.size] || BO.SIZES[4], per = [0, 0];
    H.forEach(h => { const idx = Sz.nokeeper ? Sz.n - 1 - per[h.side] : Sz.n - per[h.side]; if(o.names[h.side] && idx >= 0) o.names[h.side][idx] = h.name; per[h.side]++; });
    o.humans = H; if(H.some(h => h.side === 1)) o.form1 = Sz.formOrder[0]; return nm.call(this, o); };
  try{ startMatch(); } finally { BO.newMatch = nm; SET.who = keep.who; if(BOL.st) Object.assign(SET, {theme: keep.theme}); }
  if(!G) return;
  const M = G.M, two = H.some(h => h.side === 1);
  G.humans = H; G.mode = two ? 'duo' : 'robot'; G.link = BOL.cfg; BOL.li = M.log.length;
  G.tn = [0, 1].map(s => { const hs = H.filter(h => h.side === s).map(h => h.name); return hs.length ? hs.join(' + ') : ROBO_TEAMS[G.level]; });
  G.avs = M.players.map(p => { const h = H.find(x => x.name === p.name && x.side === p.side); return kitAv(h ? myAvatar(h.name) : defaultAvatar(p.name + '·robo' + p.side), p.side, p.gk); });
  G.spr = M.players.map(() => ({}));
  BAR.players([0, 1].map(i => ({k: i, av: (Array.from(G.tn[i] || '?')[0] || '?').toUpperCase(), name: G.tn[i], score: 0, col: TEAM_COL[i]})));
  buildPads(); const play = $('scr-play'); play.classList.add('bol-on'); bolLegend();
  BOL.pads = Link.pads.screen({game: 'BlasOff', title: bolLabel(false), kind: GAME_ID, host: tv ? 'the TV' : S.player, pad: bolPad(now.kind),
    seats: BOL.cfg.seats.filter(s => !s.local).map(s => ({lseat: s.lseat, gseat: s.g, name: s.name, col: TEAM_COL[s.side], cname: BOL_SIDE[s.side] + (s.side ? ' Red team' : ' Blue team'),
      where: two ? '🆚 ' + G.tn[1 - s.side] : H.length > 1 ? '🤝 with ' + H.filter(h => h.name !== s.name).map(h => h.name).join(' + ') + ' vs the robots' : '⚽ you vs the robots'})),
    onBtn: (g, k, on) => bolBtn(g, k, on),
    onPick: (g, i) => bolShout(g, i),
    onDrop: g => bolDrop(g), onBack: g => bolBack(g),
    onPause: (on, name) => { if(!G || G.over || !!G.paused === on) return; G.paused = on; UI.pauseIcon($('pause-btn'), on); banner(on ? '⏸ ' + name + ' paused' : '▶ ' + name + ' — play on!', on ? 'gold' : 'go'); },
    status: g => bolStatus(g)});
}
function bolSeat(g){ return BOL.cfg && BOL.cfg.seats[g]; }
function bolCi(g){ const s = bolSeat(g); if(!s || !G) return -1; const c = G.M.ctrls.find(c => c.seat === (s.local ? 0 : 10 + s.g)); return c ? c.ci : -1; }
function bolLegend(){ const st = $('stage'); let el = $('bol-legend'); if(!el){ el = document.createElement('div'); el.id = 'bol-legend'; el.className = 'bol-legend'; st.appendChild(el); }
  el.innerHTML = '<span>📱 The phones are the controllers</span>' + BOL.cfg.seats.map(s => '<b><i style="background:' + TEAM_COL[s.side] + '"></i>' + UI.esc(s.name) + (BOL.away[s.g] ? ' 🤖' : '') + '</b>').join(' ') + '<span><span class="kk">Esc</span> pause</span>'; }
// a phone's button → the same logic the game's own touch pad uses (🌀 then ⚽ / 💥 within 0.5 s = a trick pass / shot · 🌀 alone after 0.33 s)
function bolBtn(g, k, on){
  if(!G || !G.link || G.paused || G.over || BOL.away[g]) return; const ci = bolCi(g); if(ci < 0) return;
  const M = G.M, c = M.ctrls[ci], B = BOL.bt[g] || (BOL.bt[g] = {trickAt: -1, timer: 0, comboL: false}), p = M.players[c.pi], has = p && M.ball.owner === p.i;
  if(k === 'pass' || k === 'shoot'){ const L = k === 'pass' ? 'J' : 'K';
    if(on){ if(B.timer && performance.now() - B.trickAt < 500){ clearTimeout(B.timer); B.timer = 0; BO.key(M, ci, 'L', true); B.comboL = true; } BO.key(M, ci, L, true); }
    else { BO.key(M, ci, L, false); if(B.comboL){ BO.key(M, ci, 'L', false); B.comboL = false; } } }
  else if(k === 'trick' && on){ if(!has){ BO.key(M, ci, 'L', true); BO.key(M, ci, 'L', false); return; }
    B.trickAt = performance.now(); clearTimeout(B.timer); B.timer = setTimeout(() => { B.timer = 0; if(G && G.M === M){ BO.key(M, ci, 'L', true); BO.key(M, ci, 'L', false); } }, 330); }
  else if(k === 'jump') BO.key(M, ci, 'SP', on);
  else if(k === 'sw' && on) BO.key(M, ci, 'C', true);
}
// 📣 the shout row on a defending phone (⬅️ / ➡️ in the TV's own screen directions, like the game's 📣 arrows)
function bolShout(g, i){ const ci = bolCi(g); if(ci < 0 || !G || G.over) return; BO.shout(G.M, ci, shoutWorld(i ? 1 : -1)); BOL.shout[g] = 'done'; UISound.play('tap'); }
// every frame, after the game read its own keys: the phones' sticks → their player (screen directions → the pitch through the camera)
function bolInputs(){
  const C = BOL.cfg; if(!C || !G || !G.link || !BOL.pads) return; const M = G.M;
  C.seats.forEach(s => { if(BOL.away[s.g]){ const c = M.ctrls[bolCi(s.g)]; if(c && c.pi >= 0) bolRelease(s.g); return; } if(s.local) return; const ci = bolCi(s.g); if(ci < 0) return;   // 📴 kick-offs / passes may hand a dropped seat a player — let go every frame
    const inp = BOL.pads.input(s.g); if(!inp || inp.away){ BO.input(M, ci, 0, 0, false); return; }
    let sx = inp.x || 0, sy = inp.y || 0; const m = Math.hypot(sx, sy); if(m < 0.14){ sx = 0; sy = 0; }
    const w = V ? V.k2w(sx, sy) : {x: sx, y: sy}; BO.input(M, ci, w.x, w.y, m > 0.96); });
  bolEvents(); bolShouts();
}
// 📴 / 👋 a dropped phone's player goes back to the team brain (ctrl lets go; kick-offs would hand it back, so it is let go every frame)
function bolRelease(g){ const ci = bolCi(g); if(ci < 0 || !G) return; const M = G.M, c = M.ctrls[ci], p = M.players[c.pi]; if(p && p.ctrl === ci) p.ctrl = -1; c.pi = -1; BO.input(M, ci, 0, 0, false); }
function bolDrop(g){ const s = bolSeat(g); if(!s || !G || !G.link || G.over) return; BOL.away[g] = 1; bolRelease(g); bolLegend(); banner('🤖 The robots play for ' + s.name + ' until they come back', 'bad'); }
function bolBack(g){ const s = bolSeat(g); if(!s || !G || !G.link || !BOL.away[g]) return; delete BOL.away[g]; const ci = bolCi(g), M = G.M, b = M.ball;
  let best = null, bd = 1e9; M.players.forEach(q => { if(q.side !== s.side || q.gk || q.ctrl >= 0) return; const d = Math.hypot(q.x - b.x, q.y - b.y); if(d < bd){ bd = d; best = q; } });
  if(best){ best.ctrl = ci; M.ctrls[ci].pi = best.i; }
  bolLegend(); banner('👋 ' + s.name + ' is back!', 'go'); UISound.play('success'); }
// 📣 a shot is coming at a phone's goal → the ⬅️ / ➡️ shout row on THAT phone (not in the street cage: no keepers)
function bolShouts(){
  if(G.Sz.nokeeper || !G.shoutShow) return; const t = G.M.t, lab = shoutLabels();
  BOL.cfg.seats.forEach(s => { if(s.local || BOL.away[s.g]) return; const on = G.shoutShow[s.side] > performance.now() / 1000 || G.shoutShow[s.side] > t;
    if(on && !BOL.shout[s.g]){ BOL.shout[s.g] = 'open'; BOL.pads.pick(s.g, {t: '📣 Shout to your keeper!', opts: [[lab[0].split(' ')[0], lab[0].split(' ').slice(1).join(' ')], [lab[1].split(' ')[0], lab[1].split(' ').slice(1).join(' ')]], ms: 1400}); }
    else if(!on && BOL.shout[s.g]){ if(BOL.shout[s.g] === 'open') BOL.pads.pick(s.g, null); delete BOL.shout[s.g]; } });
}
// the game's own moments (M.log, nothing wrapped) → buzz on the phones whose player it was
function bolEvents(){
  const M = G.M, L = M.log; for(; BOL.li < L.length; BOL.li++){ const e = L[BOL.li], P = e.by >= 0 ? M.players[e.by] : null, gOf = p => { if(!p || p.ctrl < 0) return -1; const c = M.ctrls[p.ctrl]; return c && c.seat >= 10 ? c.seat - 10 : -1; };
    const g = gOf(P), side = s => BOL.cfg.seats.filter(x => x.side === s && !x.local).map(x => x.g);
    if(e.k === 'goal'){ side(e.side).forEach(x => bolBuzz(x, x === g ? 'got' : 'win', x === g ? '⚽ GOAL! You scored!' : '⚽ GOAL for your team!')); side(1 - e.side).forEach(x => bolBuzz(x, 'hit', '😮 They scored — kick-off!')); }
    else if(e.k === 'perfect' && g >= 0) bolBuzz(g, 'got', '⚡ PERFECT timing!');
    else if(e.k === 'starfull'){ const c = M.ctrls[e.ci]; if(c && c.seat >= 10) bolBuzz(c.seat - 10, 'power', '🔥 Star meter full — next 💥 = BLAST!'); }
    else if(e.k === 'trick' && g >= 0) bolBuzz(g, 'got', e.label || '🌀 Trick!');
    else if(e.k === 'nutmeg' && g >= 0) bolBuzz(g, 'got', '🥜 Nutmeg!');
    else if(e.k === 'tackle' && e.ok !== false && g >= 0) bolBuzz(g, 'got', '🦶 Ball won!');
    else if(e.k === 'card'){ const v = gOf(P); if(v >= 0) bolBuzz(v, 'hit', '🟨 Yellow card — careful!'); }
    else if(e.k === 'save' && e.shout && e.right) side(e.side).forEach(x => bolBuzz(x, 'got', '📣 Your shout helped the keeper!'));
    else if(e.k === 'half') BOL.pads.buzzAll('tick', '⏱ Half time — switch ends!');
  }
}
function bolBuzz(g, k, t){ const s = bolSeat(g); if(BOL.pads && s && !s.local && !BOL.away[g]) BOL.pads.buzz(g, k, t); }
// MY status 4× a second: ⚽ score · ⏱ clock · 🥅 my goals · 💨 stamina · 🔥 star ring on 💥 · button names with / without the ball · ⚡ moments glow
function bolStatus(g){
  const s = bolSeat(g); if(!s || !G) return {state: 'wait'}; const M = G.M, ci = bolCi(g), c = ci >= 0 ? M.ctrls[ci] : null, p = c ? M.players[c.pi] : null;
  const my = M.score[s.side], their = M.score[1 - s.side], left = Math.max(0, M.halfLen * (M.S.oneHalf ? 1 : 2) - M.clock), have = p && M.ball.owner === p.i;
  const chips = [['⚽', my + ' – ' + their], ['⏱', fmt(M.golden ? 0 : left - (M.half === 1 && !M.S.oneHalf ? M.halfLen : 0))]];
  const me = M.players.find(q => q.name === s.name && q.side === s.side); if(me) chips.push(['🥅', (me.g.goals || 0) + '']);
  if(M.L.stamina && p) chips.push(['💨', Math.round((p.stamina || 0) * 100) + '%']);
  const btns = have || !p ? {} : {pass: ['🦶', 'Tackle'], shoot: ['🛷', M.L.slide === false ? 'Tackle' : 'Slide'], trick: ['🙋', 'Press']};
  const glow = {}; if(c && c.mo) glow[{L: 'trick', K: 'shoot'}[c.mo.key] || 'shoot'] = 1;
  const line = BOL.shout[g] === 'open' ? '' : BOL.away[g] ? '🤖 The robots play for you' : c && c.mo ? ({beat: '⚡ 🌀 Trick past them!', air: '⚡ 💥 Volley it!', oneone: '⚡ 💥 Finish it!'}[c.mo.kind] || '') :
    bolGuide(M, s, p, have) || (M.phase === 'goal' ? '⚽ Goal!' : M.phase === 'half' ? '⏱ Half time' : M.phase === 'restart' && M.rs && p && M.rs.taker === p.i ? '🎯 Your kick — ⚽ pass · 💥 shoot · 🌀 bend' : M.golden ? '⚡ Golden goal — next goal wins!' : '');
  return {chips, cool: {shoot: c ? Math.min(1, c.star || 0) : 0}, glow, btns, state: G.over ? 'wait' : BOL.away[g] ? 'out' : 'play', line};
}
// 🌱 guided Basic + 🐣 Junior: the TV's own goal-line hint (it names keyboard keys) is hidden — the phone says it with its own buttons
function bolGuide(M, s, p, have){
  if(!(G.help >= 1) || M.score[0] + M.score[1] > 0 || M.phase !== 'play' || !p) return '';
  const vm = G.view.mode, d = BO.dirOf(s.side, M), where = vm === 'behind' ? (d > 0 ? '▲ up' : '▼ down') : d > 0 ? 'right ▶' : '◀ left';
  return BOL.shout[s.g] === 'open' ? '' : have ? '💥 Shoot — their 🥅 is ' + where : '🦶 Run at the ball · tap 🦶 Tackle';   // short: one line on a sideways phone
}
const bolWins = n => n + (/ \+ /.test(n) || /^Robo /.test(n) ? ' win!' : ' wins!');
function bolEnd(){
  if(!BOL.pads || !G) return; const M = G.M, w = M.winner, lines = {}, wins = {};
  BOL.cfg.seats.forEach(s => { const won = w === s.side; wins[s.g] = won ? 1 : 0; lines[s.g] = (w < 0 ? '🤝 A draw · ' : won ? '🏆 You win · ' : '💪 So close · ') + M.score[s.side] + ' – ' + M.score[1 - s.side]; });
  BOL.pads.end({icon: w < 0 ? '🤝' : '🏆', title: w < 0 ? 'A draw!' : bolWins(G.tn[w]), lines, wins});
}
// the TV / host card: 🔁 Play again (the same people) · ◀ Room · 🚪 End the room (the game's own Levels / Again would leave the room)
function bolCardRow(){
  const row = $('result-card') && $('result-card').querySelector('.gf-r-btns'); if(!row || !BOL.cfg) return; const tv = BOL.cfg.tv;
  row.innerHTML = '<button class="btn sp-btn sp-primary" id="bol-again" data-sound="pop">🔁 Play again</button><button class="btn soft sp-btn sp-secondary" id="bol-room" data-sound="none">◀ Room</button>' +
    '<button class="btn soft sp-btn sp-secondary" id="bol-exit" data-sound="none">' + (tv ? '🚪 End the room' : '🎚️ Levels') + '</button>';
  $('bol-again').onclick = () => bolGo(); $('bol-room').onclick = () => bolToCover(); $('bol-exit').onclick = () => bolExit();
}
function bolToCover(){ bolStop(); BOL.cfg = null; backToMenu(); openCover(); if(BOL.C) Link.cover.show(BOL.C); }
function bolStop(){ if(BOL.pads) BOL.pads.stop(); BOL.pads = null; const pl = $('scr-play'); if(pl) pl.classList.remove('bol-on'); const lg = $('bol-legend'); if(lg) lg.remove(); }
function bolExit(){ try{ if(Link.status() !== 'idle') Link.leave(); }catch(e){} bolStop(); BOL.cfg = null; backToMenu(); }
// the wraps (once, after the play part is here): no keys / touch pad on the screen for a phone's player · the phones' sticks · the end → every phone
function bolWraps(){
  if(BOL.wrapped || typeof readInputs !== 'function') return; BOL.wrapped = true;
  const ks0 = window.keySetsOf; window.keySetsOf = function(c){ return c && c.seat >= 10 ? [] : ks0.apply(this, arguments); };
  const ri0 = window.readInputs; window.readInputs = function(){ const r = ri0.apply(this, arguments); try{ bolInputs(); }catch(e){} return r; };
  const fm0 = window.finishMatch; window.finishMatch = function(){ const r = fm0.apply(this, arguments); try{ if(G && G.link){ const w = G.M.winner, h2 = document.querySelector('.gf-r-head h2'); if(h2 && w >= 0 && G.mode === 'duo' && h2.textContent.indexOf(G.tn[w] + ' win') === 0) h2.textContent = h2.textContent.replace(G.tn[w] + ' win', bolWins(G.tn[w]).replace('!', '')); bolEnd(); bolCardRow(); } }catch(e){} return r; };
  if(fm0.__gmood) window.finishMatch.__gmood = 1;
  const bm0 = window.backToMenu; window.backToMenu = function(){ if(BOL.cfg && G && G.link) bolStop(); return bm0.apply(this, arguments); };
}
function bolWire(){
  if(!BOL.wired){ BOL.wired = true;
    if(!document.getElementById('bol-css')){ const st = document.createElement('style'); st.id = 'bol-css'; st.textContent = BOL_CSS; document.head.appendChild(st); }
    Link.pads.config({drawAvatar: (cv, n) => drawPreviewCanvas(cv, myAvatar(n), {name: n, t: 1}), avatar: n => myAvatar(n), onRoom: () => { if(BOL.C) Link.cover.show(BOL.C); }, onLeave: () => openCover()});
    Link.on('lk:ask', (d, seat) => { if(!Link.isHost() || !d || d.what !== 'again' || !BOL.cfg || !BOL.cfg.tv) return; if(G && G.over && Link.captain() === seat) bolGo(); });
    addEventListener('pagehide', () => { try{ if(Link.status() !== 'idle') Link.leave(); }catch(e){} }); }
  if(boPartReady('play')) bolWraps(); else boNeed('play', () => bolWraps());
}
var BOL_CSS = '#scr-play.bol-on #pads .stick:not(.solo), #scr-play.bol-on #pads .btnpad:not(.solo), #scr-play.bol-on #goal-line, #scr-play.bol-on #kb-hint, #scr-play.bol-on #shout-kb{display:none !important}' +
  '.bol-legend{position:absolute;left:50%;bottom:calc(var(--safe-b,18px) + 4px);transform:translateX(-50%);display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;max-width:94%;padding:5px 12px;border-radius:14px;background:rgba(10,14,30,.62);color:#fff;font:700 13px/1.2 system-ui,sans-serif;z-index:6;pointer-events:none}' +
  '.bol-legend b{display:inline-flex;gap:5px;align-items:center}.bol-legend i{width:11px;height:11px;border-radius:50%;display:inline-block;box-shadow:0 0 0 2px #fff}.bol-legend .kk{border:1px solid #fff8;border-radius:5px;padding:0 4px}';
// ---- 📺 the TV Game Station: the vote picks the level + the ✋ way (a match size / 🥅) ----
function bolStationReg(){
  if(BOL.stReg || !window.Station) return; BOL.stReg = true;
  Station.game({url: WEBAPP_URL, page: 'blasoff', player: () => S.player || CURRENT_PLAYER, start: () => Link.cover.start(), again: () => bolGo(),
    result: () => (G && G.link && G.over && !$('result').classList.contains('hidden')) ? $('result-card') : (Link.pads && Link.pads.resultCard ? Link.pads.resultCard() : null), hide: '.gf-r-btns, .lp-cb, .lp-wait'});
}
function bolStation(t){
  bolStationReg();
  if(!Station.on){ if((t | 0) < 60) setTimeout(() => bolStation((t | 0) + 1), 50); return false; }
  if(!Station.tv) return false;
  const lv = Station.lvl == null ? 0 : Math.max(0, Math.min(4, Station.lvl)), way = BOL_KINDS.includes(Station.way) ? Station.way : 'fours';
  BOL.st = {level: lv, theme: SET.theme, kind: way}; BOL.wantTv = true;
  if(!bolCover()){ BOL.wantTv = false; return false; } return true;
}
// ---- the od-1 door API: 🎬 cover 📱 Own devices (own) · setup chip (open) · ?link=<code> (url) · 📺 Station (station) ----
window.BlasOffLink = {
  own: C => bolOpen(C),
  open: () => bolCover(),
  url: code => { bolStationReg(); bolCover(() => setTimeout(() => Link.cover.join(code), 0)); },
  station: () => bolStation(0)
};
GameParts.loaded('BlasOff_link', 'lk-8f');
