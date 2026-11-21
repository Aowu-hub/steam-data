
/* 📡 LINK (lk-8e): 🏎️ Turbo Trail on own devices — LinkKit plan §55 (📡 Multiplayer chat, after 🥊 lk-8d's recipe §55g).
   Born split: this whole block is the part Turbo_link (GameParts, loader TurboParts), with the shared 🕹️ LinkPads part; the main file only holds
   the door (tblNeed / tblOwn + the ?link / 📺 station hooks). The room lives on the 🎬 cover (Link.cover, pads: true):
     📺 This screen is the game (TV / PC / iPad) — both drivers on phones · 🎮 Host + play here (tablet: you drive by touch, a friend on a phone) · 🕹️ Join as a controller.
   ONE device runs the unchanged race in its 👥 duo view (two roads side by side on a wide TV, top / bottom on a tall one). Each phone = one driver:
     stick ◀ ▶ steer · ▲ faster · ▼ slow down (the game's own 🕹️ joystick) · 🦘 Jump (main) · 🌀 Drift (hold while steering)
     — or the 🅱 pedals pad: stick ◀ ▶ only + ⬆️ Go · ⬇️ Slow · 🦘 · 🌀 buttons (TBL.padKind, Aowu picks in the look test)
     1 phone = you vs the 🤖 Robo-Racer (the duo view, robot on the second road) · 2 phones = 2 drivers (Aowu Q4 lk-8p: 2 drivers now, 3–4 later).
   Nothing of the road is sent to the phones — LinkPads sends each phone its own status (🥇 place · ⏱ clock · 🏁 % · 🚀 speed) + buzz moments.
   📴 a phone that drops out → the NEW 🤖 rival-style driver (tblBot: picks the clear lane, brakes for red barriers, hops what it can't dodge)
   drives that car → back = "👋 … is back!". Saves: the screen saves for every person (as 👥 same-device play); the 🤖 saves nothing.
   👻 Ghost race + 💀 Hardcore stay on one device. */
const TBL = {wired: false, viaCover: false, cfg: null, pads: null, st: null, auto: {}, bt: {}, lead: -1, leadT: 0, wasCount: 0, padKind: 'stick', starting: false};
const TBL_BOT = 'Robo-Racer';
const TBL_RIM = {jump: '#FFC845', drift: '#7CC8FF', go: '#2FD27A', slow: '#FF8A5B'};
function tblPad(kind){
  const B = (k, ic, nm, main) => Object.assign({k, ic, nm, rim: TBL_RIM[k]}, main ? {main: true} : {});
  if(kind === 'pedals') return {stick: 'lr', ready: '🏎️ Get ready to race!', hint: '🕹️ ◀ ▶ steer · hold ⬆️ = faster · ⬇️ = slow down · hold 🌀 while steering = drift',
    btns: [B('go', '⬆️', 'Go', true), B('slow', '⬇️', 'Slow'), B('jump', '🦘', 'Jump'), B('drift', '🌀', 'Drift')]};
  return {stick: 'free', ready: '🏎️ Get ready to race!', hint: '🕹️ ◀ ▶ steer · ▲ faster · ▼ slow down · hold 🌀 while steering = drift', btns: [B('jump', '🦘', 'Jump', true), B('drift', '🌀', 'Drift')]};
}
function tblLevelOk(i){ return i >= 0 && i <= 4 && canPlay(i); }
function tblNow(){ return TBL.st || {level: pendingLvl, theme}; }   // 📺 from the Game Station: the vote (in memory) — pendingLvl / theme = the TV's own picks, never changed
function tblFix(){ if(TBL.st) return; if(!tblLevelOk(pendingLvl)){ const rec = AGE_START[S.age] || 0; pendingLvl = tblLevelOk(rec) ? rec : 0; } }
function tblLabel(tv){ const n = tblNow(), L = LEVELS[n.level], T = THEMES[n.theme] || THEMES.roadtrip; return '🏎️ ' + L.emoji + ' ' + L.name + ' · ' + T.icon + ' ' + T.name + (tv ? ' · 📺 on the TV' : ''); }
const TBL_ROOM = {game: 'Turbo', title: '🏎️ Turbo Trail', page: 'turbo', kind: GAME_ID, seats: 2, min: 2, pads: true,
  url: WEBAPP_URL + '?page=turbo', name: () => S.player, av: () => myAvatar(S.player), drawAvatar: (cv, p) => drawPreviewCanvas(cv, myAvatar(p.name), {name: p.name, t: 1}),
  label: tv => tblLabel(tv), bot: () => '· 1 = you vs the 🤖 ' + TBL_BOT, picks: el => tblPicks(el),
  how: 'Gameroom → 🏎️ Turbo Trail → 📱 Own devices → 🕹️ Join · or scan · 1 = you vs the 🤖 Robo-Racer · 2 = race each other on two roads',
  onLink: () => { TBL.viaCover = true; tblFix(); }, onStart: () => { TBL.viaCover = true; tblGo(); }};
// the host's picks as chips in the room card — tap = the next one: 🎚️ race · 🌍 world
function tblPicks(el){
  tblFix(); const n = tblNow(), L = LEVELS[n.level], T = THEMES[n.theme] || THEMES.roadtrip;
  el.innerHTML = '<button class="lkc-chip" data-k="lvl" data-sound="none">' + L.emoji + ' ' + UI.esc(L.name) + '</button><button class="lkc-chip" data-k="world" data-sound="none">' + T.icon + ' ' + UI.esc(T.name) + '</button>';
  if(TBL.st){ el.querySelectorAll('.lkc-chip').forEach(b => { b.disabled = true; }); return; }   // 📺 from the Game Station: the vote decides
  el.querySelectorAll('.lkc-chip').forEach(b => b.onclick = e => { e.stopPropagation(); const nx = (ks, v) => ks[(ks.indexOf(v) + 1) % ks.length];
    if(b.dataset.k === 'lvl'){ pendingLvl = nx([0, 1, 2, 3, 4].filter(tblLevelOk), pendingLvl); try{ localStorage.setItem(setupKey('lv'), String(pendingLvl)); }catch(er){} }
    else { theme = nx(THEME_KEYS, theme); savePrefs(); }
    UISound.play('tap'); tblPicks(el); try{ if(Link.isHost()) Link.setLabel(tblLabel(Link.hostess())); }catch(er){} });
}
function tblOpen(C){ tblWire(); Link.cover(C, TBL_ROOM); }
// ▶ Start on the cover (host) / 🔁 Race again: the linked players → drivers in seat order (the TV itself is no seat)
function tblGo(){
  tblFix(); const now = tblNow(), tv = !!(Link.hostess && Link.hostess()), me = Link.seat();
  const list = Link.players().filter(p => p.name && (p.on || p.me) && !p.screen).sort((a, b) => a.seat - b.seat).slice(0, 2);
  if(list.length < (tv ? 1 : 2)){ UISound.play('error'); UI.toast(tv ? '📺 Wait for a driver to join' : '📡 Wait for a friend to join'); return; }
  tblStop(); hideResult();
  const names = list.map(p => p.name), bot = names.length < 2;
  TBL.cfg = {id: Date.now().toString(36), tv, station: !!TBL.st, level: now.level, theme: now.theme, bot, names: bot ? [names[0], TBL_BOT] : names,
    seats: list.map((p, k) => ({lseat: p.seat, g: k, name: p.name, local: !tv && p.seat === me}))};
  TBL.auto = bot ? {1: 'bot'} : {}; TBL.bt = {}; TBL.lead = -1; TBL.leadT = 0; TBL.wasCount = 9;
  const keepT = theme; theme = now.theme;   // 📺 a Station vote races its own world; the TV's saved world comes back after
  TBL.starting = true; try{ startGame(now.level, {duo: TBL.cfg.names[1], link: TBL.cfg.id}); } finally { TBL.starting = false; if(TBL.st) theme = keepT; }
  if(!G || !G.duo) return;
  G.link = TBL.cfg; const play = $('scr-play'); play.classList.add('tbl-on'); play.classList.toggle('tbl-local', TBL.cfg.seats.some(s => s.local)); tblLegend();
  const side = !V.full || V.full.side;
  TBL.pads = Link.pads.screen({game: 'Turbo', title: tblLabel(false), kind: GAME_ID, host: tv ? 'the TV' : S.player, pad: tblPad(TBL.padKind),
    seats: TBL.cfg.seats.filter(s => !s.local).map(s => ({lseat: s.lseat, gseat: s.g, name: s.name, col: COLORS[G.duo[s.g].look.col], cname: bot ? '🏎️ vs the 🤖 ' + TBL_BOT : '🏎️ Driver ' + (s.g + 1),
      where: side ? (s.g ? 'your road: right ▶' : '◀ your road: left') : (s.g ? 'your road: bottom ▼' : 'your road: top ▲')})),
    onBtn: (g, k, on) => tblBtn(g, k, on),
    onDrop: g => { const s = tblSeat(g); if(!s || !G || !G.link || G.over) return; TBL.auto[g] = 'drop'; G.duo[g].p.held = {}; showBanner('🤖 A robot drives for ' + s.name + ' until they come back', 'bad'); },
    onBack: g => { const s = tblSeat(g); if(!s || !G || !G.link || TBL.auto[g] !== 'drop') return; delete TBL.auto[g]; G.duo[g].p.held = {}; showBanner('👋 ' + s.name + ' is back!'); UISound.play('success'); },
    onPause: (on, name) => { if(!G || G.over || !!G.paused === on) return; TBL.quiet = true; try{ if(on) pauseGame(); else resume(); } finally { TBL.quiet = false; } showBanner(on ? '⏸ ' + name + ' paused' : '▶ ' + name + ' — go go go!', on ? 'gold' : ''); },
    status: g => tblStatus(g)});
}
function tblSeat(g){ return TBL.cfg && TBL.cfg.seats[g]; }
function tblLegend(){ const st = $('stage'); let el = $('tbl-legend'); if(!el){ el = document.createElement('div'); el.id = 'tbl-legend'; el.className = 'tbl-legend'; st.appendChild(el); }
  const loc = TBL.cfg.seats.some(s => s.local); el.innerHTML = '<span>' + (loc ? '📱 + 👆' : '📱 The phones are the controllers') + '</span>' + G.duo.map(P => '<b><i style="background:' + COLORS[P.look.col] + '"></i>' + UI.esc(P.who) + (P.who === TBL_BOT ? ' 🤖' : '') + '</b>').join(' ') + '<span><span class="kk">Esc</span> pause</span>'; }
function tblBtn(g, k, on){
  if(!G || !G.link || !on || k !== 'jump' || G.paused || G.over || TBL.auto[g]) return;
  press2(g, 'jump', true);   // 🦘 the game's own jump for that driver (withPlayer → doJump)
}
// every frame, before the race moves: the phones' sticks + held buttons → their car · the 🤖 drives a robot / dropped seat
function tblInputs(dt){
  const C = TBL.cfg; if(!C) return;
  for(let i = 0; i < 2; i++){ const P = G.duo[i], s = tblSeat(i);
    if(TBL.auto[i]){ tblBot(i); continue; }
    if(!s || s.local) continue;   // 🎮 the host's own car answers its touch pad / keys
    const inp = TBL.pads && TBL.pads.input(i); if(!inp || inp.away){ P.p.held = {}; continue; }
    const H = inp.held || {}, ped = TBL.padKind === 'pedals', h = P.p.held;
    h.left = inp.x < -0.35; h.right = inp.x > 0.35; h.up = ped ? !!H.go : inp.y < -0.35; h.down = ped ? !!H.slow : inp.y > 0.45; h.drift = !!H.drift;
  }
  // 🟢 GO buzz + 🏎️ who leads (a pass between the drivers buzzes both phones, at most every 1.5 s)
  if(TBL.wasCount > 0 && G.count <= 0 && TBL.pads) TBL.pads.buzzAll('go', '🟢 GO GO GO!'); TBL.wasCount = G.count;
  if(G.count <= 0 && !G.duo.some(P => P.finished)){ const lead = G.duo[0].p.d >= G.duo[1].p.d ? 0 : 1, t = performance.now();
    if(TBL.lead >= 0 && lead !== TBL.lead && t - TBL.leadT > 1500 && Math.abs(G.duo[0].p.d - G.duo[1].p.d) > CAR_L){ TBL.leadT = t; tblBuzz(lead, 'got', '🏎️ You passed ' + G.duo[1 - lead].who + '!'); tblBuzz(1 - lead, 'tick', '😤 ' + G.duo[lead].who + ' passed you — catch up!'); }
    if(TBL.lead < 0 || t - TBL.leadT > 1500) TBL.lead = lead; }
}
function tblBuzz(g, k, t){ const s = tblSeat(g); if(TBL.pads && s && !s.local && !TBL.auto[g]) TBL.pads.buzz(g, k, t); }
/* 🤖 the rival-style driver (NEW, lk-8e) — drives a duo car like the game's own rivals (updateRival): looks down every lane, takes the clearest,
   brakes for a red barrier, hops a block it can't dodge, grabs ⚡ pads / ramps when the road is clear. Drop-out = full pace (it keeps your place);
   the 1-phone 🤖 Robo-Racer = the race's own rival pace (the level's lrand 0.86–0.95 band, a little kinder on 🌱). It only sets held keys + the jump. */
const TBL_OK = {coin: 1, boost: 1, ramp: 1, gate: 1, amb: 1, tunnel: 1, secret: 1, stars: 1, treat: 1};   // anything else on the road with an x = a thing to steer round (cars · blocks · 🛢️ · cones · 🏗️ cranes · 🧊 …)
function tblBot(i){
  withPlayer(i, () => {
    const p = G.p, L = G.L, h = p.held = {}; if(G.count > 0 || G.finished || p.spin > 0) return;
    const my = rel(), look = Math.max(20, p.v * 1.7), lanes = []; for(let k = 0; k < L.lanes; k++) lanes.push(laneX(L, k));
    const hit = (x, from, to) => { let best = 99;
      for(const o of G.objs){ if(TBL_OK[o.kind] || typeof o.x !== 'number' || o.hit || o.used) continue; const od = o.d - p.d; if(od < from || od > to) continue; if(o.kind === 'car' && o.v > p.v + 2 && od > 6) continue;
        const W = (o.w || 1.6) / 2 + CAR_W / 2 + 0.35; if(Math.abs(o.x - x) < W || (o.tx != null && Math.abs(o.tx - x) < W)) best = Math.min(best, od); }   // a car changing lanes blocks both
      for(const w of G.warns){ const od = w.d - p.d; if(!w.done && od > from && od < to && Math.abs(w.x - x) < 2.4) best = Math.min(best, od); }
      return best; };
    // every lane gets a score: how far it is clear (a lane we must cross into also checks the cars beside us), a little less the further it is
    const sc = x => (Math.abs(x - my) > 1 ? Math.min(hit(x, -4.6, look), hit((x + my) / 2, -4.6, look)) : hit(x, -1, look)) - Math.abs(x - my) * 0.4;   // the way across counts too
    let tx = TBL.bt[i] != null ? TBL.bt[i] : my, best = tx, bs = sc(tx);
    lanes.forEach(x => { if(Math.abs(x - my) > LANE_W + 0.6) return; const v = sc(x); if(v > bs + 3){ bs = v; best = x; } }); tx = best;   // one lane at a time (never cut across a car) · + 3 = stick to the chosen lane (no wobble)
    const cur = hit(my, -1, look), danger = Math.max(9, p.v * 0.55);
    if(cur < look && bs >= look - 2){ /* a clear lane → steer there */ }
    else if(cur >= look){ const goody = G.objs.find(o => (o.kind === 'boost' || o.kind === 'ramp' || (o.kind === 'coin' && !o.air)) && !o.used && !o.got && o.d - p.d > 5 && o.d - p.d < 30 && hit(o.x, -4.6, o.d - p.d + 4) > o.d - p.d + 2);
      if(goody) tx = goody.x; else if(Math.abs(tx) > roadW(L) / 2 - 0.6) tx = lanes[Math.floor(L.lanes / 2)]; }
    const brake = cur < danger && hit(tx, -1, danger) < danger;   // boxed in → slow down behind it (like the game's own rivals)
    if(brake && cur < 7 && p.jumpCool <= 0 && p.z <= 0.05 && p.v > 9) doJump();
    TBL.bt[i] = tx; const dx = tx - my; h.left = dx < -0.3; h.right = dx > 0.3;
    const gate = G.objs.find(o => o.kind === 'gate' && o.state === 'red' && o.d - p.d > -0.5 && o.d - p.d < 30);
    const pace = TBL.auto[i] === 'bot' ? Math.min(0.97, 0.86 + G.lvl * 0.025) : 1;
    if(gate) h.down = gate.d - p.d < 16 || p.v > 9; else if(brake) h.down = true; else h.up = !p.offroad && p.v < L.vmax * pace;
  });
}
// what one phone shows: 🥇 place · ⏱ clock · 🏁 % · 🚀 speed — and the line (countdown · barrier · spun · off-road · robot · finished)
function tblStatus(g){
  if(!G || !G.duo || !TBL.cfg) return null; const P = G.duo[g], o = G.duo[1 - g], s = tblSeat(g); if(!P || !s) return null; const p = P.p;
  const pl = P.finished && P.cleared ? P.place : (o.finished && o.cleared) || (!o.finished && o.p.d > p.d) ? 2 : 1, tl = Math.max(0, Math.ceil(P.timeLeft));
  const chips = [[pl === 1 ? '🥇' : '🥈', pl === 1 ? '1st' : '2nd'], ['⏱', String(tl)], ['🏁', Math.round(clamp(p.d / G.L.length, 0, 1) * 100) + '%'], ['🚀', Math.round(p.v * 3.6) + '']];
  const cool = {}, glow = {}; if(p.jumpCool > 0) cool.jump = Math.min(1, p.jumpCool / 2.2); if(p.v > 16 && p.z < 0.1 && !p.drift) glow.drift = 1;
  const gate = G.objs.some(x => x.kind === 'gate' && x.state === 'red' && x.d - p.d > -0.5 && x.d - p.d < 60);
  const line = TBL.auto[g] === 'drop' ? '🤖 The robot drives for you — come back!' : G.count > 0 ? '🚦 Get ready… ' + Math.max(1, Math.ceil(G.count - 0.4))
    : P.finished ? (P.cleared ? '🏁 You finished — ' + (P.place === 1 ? '🥇 1st!' : '🥈 2nd!') + (o.finished ? '' : ' Cheer for ' + o.who + '!') : '⏰ Out of time — cheer for ' + o.who + '!')
    : gate ? '🔴 Barrier ahead — slow down and wait!' : p.spin > 0 ? '💫 Spun out — steer back on!' : p.offroad ? '🌾 Off the road — steer back!' : p.boost > 0 ? '⚡ TURBO!' : tl <= 10 ? '⏰ Hurry — reach the next 🏁!' : p.drift ? '🌀 Drifting — points!' : '';
  return {chips, cool, glow, line, state: P.finished ? 'wait' : 'play'};
}
// 💥 the game's own moments (🎬 b3b3 tbbHit fires inside withPlayer → G.cur is that driver) → a buzz on that phone
const TBL_HIT = {crash: ['hit', '💥 Bonk!'], skid: ['hit', '🌀 Whoa — slippery!'], bump: ['hit', '😵 Bumpy!'], boost: ['got', '⚡ Turbo boost!'], check: ['got', '🏁 Checkpoint! +time'], win: ['win', '🏁 You crossed the finish!']};
// 🏁 the race is over → every phone gets its own line · the screen's card: 🔁 Race again · ◀ Room · 🚪 End the room
function tblEnd(){
  const P = TBL.pads; if(!P || !G || !G.link) return; const rows = G.duo.map((D, i) => ({i, D, rank: D.cleared ? D.place : 3, dist: Math.min(D.p.d, G.L.length)})).sort((a, b) => a.rank - b.rank || b.dist - a.dist);
  const win = rows[0].D.cleared || rows[0].dist > rows[1].dist + 1 ? rows[0] : null, lines = {}, wins = {};
  TBL.cfg.seats.forEach(s => { const D = G.duo[s.g], won = win && win.i === s.g; if(won) wins[s.g] = 1;
    lines[s.g] = (won ? '🏆 You win!' : D.cleared ? '🏁 You finished!' : '💪 Good race!') + ' · ' + (D.cleared ? '⏱ ' + fmt(Math.round(D.raceTime) * 1000) : '🏁 ' + Math.round(Math.min(D.p.d, G.L.length)) + ' m') + ' · 🏆 ' + Math.round(D.score).toLocaleString() + ' · 🪙 ' + D.coins; });
  P.end({icon: !win ? '🤝' : win.D.who === TBL_BOT ? '🤖' : '🏆', title: win ? win.D.who + ' wins!' : 'A tie!', lines, wins});
}
function tblCardRow(){
  const row = $('result-card') && $('result-card').querySelector('.gf-r-btns'); if(!row || !TBL.cfg) return; const tv = TBL.cfg.tv;
  row.innerHTML = '<button class="btn sp-btn sp-primary" id="tbl-again" data-sound="pop">🔁 Race again</button>' + (TBL.viaCover ? '<button class="btn soft sp-btn sp-secondary" id="tbl-room" data-sound="none">◀ Room</button>' : '') +
    '<button class="btn soft sp-btn sp-secondary" id="tbl-exit" data-sound="none">' + (tv ? '🚪 End the room' : '🎚️ Races') + '</button>';
  $('tbl-again').onclick = () => tblGo(); if($('tbl-room')) $('tbl-room').onclick = () => tblToCover(); $('tbl-exit').onclick = () => tblExit();
}
function tblStop(){ if(TBL.pads) TBL.pads.stop(); TBL.pads = null; const pl = $('scr-play'); if(pl) pl.classList.remove('tbl-on', 'tbl-local'); const lg = $('tbl-legend'); if(lg) lg.remove(); }
function tblToCover(){ tblStop(); TBL.cfg = null; backToMenu(); openCover(); if(TurboCover) Link.cover.show(TurboCover); }
function tblExit(){ try{ if(Link.status() !== 'idle') Link.leave(); }catch(e){} tblStop(); TBL.cfg = null; TBL.viaCover = false; backToMenu(); }

// wraps (only while a linked race runs on THIS screen): names on the duo · inputs + 🤖 · buzz · saves · the 🏁 card · ⏸ for everyone · touch for the 🎮 host
function tblWraps(){
  if(window.__tblWraps) return; window.__tblWraps = true;
  // 👥 the duo's two drivers = the phones' names (the game's own setupDuo puts the TV's player first)
  const sd = window.setupDuo; window.setupDuo = function(mate){ const r = sd.apply(this, arguments); if(!(TBL.starting && TBL.cfg)) return r;
    const n = TBL.cfg.names, P1 = G.duo[0], P2 = G.duo[1], l1 = lookOf(n[0]), l2 = lookOf(n[1]);
    const BRIGHT = [1, 6, 3, 5, 0, 2, 7, 4];   // 📺 never the dark-steel car (it vanishes on the grey road on a TV across the room) · never both the same
    if(l1.col === 9) l1.col = 6; if(n[1] === TBL_BOT){ l2.col = 8; l2.decal = 1; }   // 🤖 the Robo-Racer = a white car
    else if(l2.col === 9 || l2.col === l1.col) l2.col = BRIGHT.find(c => c !== l1.col);
    P1.who = G.who = n[0]; P1.look = G.look = l1; P2.who = n[1]; P2.look = l2; return r; };
  const ud = window.updateDuo; window.updateDuo = function(dt){ if(G && G.link && !G.paused){ try{ tblInputs(dt); }catch(e){ console.error(e); } } return ud.apply(this, arguments); };
  const th = window.tbbHit; if(th) window.tbbHit = function(kind){ const r = th.apply(this, arguments); try{ if(G && G.link && G.duo && TBL_HIT[kind]){ const g = G.cur, b = TBL_HIT[kind];
      tblBuzz(g, b[0], kind === 'check' ? '🏁 Checkpoint! +' + G.L.cpTime + ' s' : kind === 'win' ? (G.duo.some((D, j) => j !== g && D.finished && D.cleared) ? '🏁 You finished 2nd — great race!' : '🥇 You win the race!') : b[1]); } }catch(e){} return r; };
  const sw = window.saveWin; window.saveWin = function(lvl, extra, tries, who){ if(G && G.link && who === TBL_BOT) return; return sw.apply(this, arguments); };   // 🤖 saves nothing
  const fd = window.finishDuo; window.finishDuo = function(quiet){ const L = G && G.link, was = G && G.over; const r = fd.apply(this, arguments);
    try{ if(L && !quiet && !was){ tblEnd(); setTimeout(tblCardRow, 520); setTimeout(tblCardRow, 900); } }catch(e){ console.error(e); } return r; };
  const pg = window.pauseGame, rs = window.resume;
  window.pauseGame = function(){ const r = pg.apply(this, arguments); try{ if(G && G.link && TBL.pads && !TBL.quiet) TBL.pads.paused(!!G.paused); }catch(e){} return r; };
  window.resume = function(){ const r = rs.apply(this, arguments); try{ if(G && G.link && TBL.pads && !TBL.quiet) TBL.pads.paused(!!G.paused); }catch(e){} return r; };
  // 🎮 Host + play: the tablet's own 🕹️ joystick / keys drive the host's car (press() moves G.p, which in the duo is whichever car was loaded last)
  const pr = window.press; window.press = function(act, on){ if(!(G && G.link && G.duo)) return pr.apply(this, arguments); const s = TBL.cfg.seats.find(x => x.local); if(!s || G.over) return;
    if(act === 'jump'){ if(on && !G.paused) press2(s.g, 'jump', true); return; } G.duo[s.g].p.held[act] = on; };
  const bm = window.backToMenu; window.backToMenu = function(){ if(TBL.pads && G && G.link){ TBL.pads.stop(); TBL.pads = null; } tblStop(); return bm.apply(this, arguments); };
  // 🏁 the screen's card names the WINNER (the TV's own player is nobody's seat) — finishDuo already says "<name> wins!"; keep its buddy = the winner
}
const TBL_CSS = "/* 📡 lk-8e: the TV's line under the two roads while phones are the controllers · 🎮 host + play keeps its own touch pad */\n#scr-play.duo.tbl-local .ctl{display:flex !important;}\n.tbl-legend{position:absolute;left:50%;bottom:calc(var(--safe-b, 0px) + 8px);transform:translateX(-50%);z-index:12;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:4px 14px;max-width:92%;padding:5px 14px;border-radius:999px;background:rgba(14,16,28,.72);color:#fff;font-weight:800;font-size:clamp(12px,1.25vw,19px);pointer-events:none;}\n.tbl-legend b{font-weight:900;text-shadow:0 1px 0 rgba(0,0,0,.5);display:inline-flex;align-items:center;gap:6px;}\n.tbl-legend b i{display:inline-block;width:.95em;height:.95em;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.4);}\n#scr-play.tbl-on .banner{top:58px;}\n#scr-play.tbl-on:not(.tbl-local) #pz-util{display:none;}\n.tbl-legend .kk{display:inline-block;padding:0 6px;border-radius:6px;background:rgba(255,255,255,.18);font-size:.85em;}\n#scr-play.tbl-local .tbl-legend{bottom:auto;top:calc(var(--safe-t, 0px) + 54px);}";   // added only when a room opens
function tblWire(){
  tblWraps(); if(!document.getElementById('tbl-css')){ const st = document.createElement('style'); st.id = 'tbl-css'; st.textContent = TBL_CSS; (document.head || document.documentElement).appendChild(st); } if(TBL.wired || !window.Link) return; TBL.wired = true;
  Link.pads.config({drawAvatar: (cv, n) => drawPreviewCanvas(cv, myAvatar(n), {name: n, t: 1}), avatar: n => myAvatar(n), onRoom: () => { if(TurboCover) Link.cover.show(TurboCover); }, onLeave: () => openCover()});
  Link.on('lk:ask', (d, seat) => { if(!Link.isHost() || !d || d.what !== 'again' || !TBL.cfg || !TBL.cfg.tv) return; if(G && G.over && Link.captain() === seat) tblGo(); });
  addEventListener('pagehide', () => { try{ if(Link.status() !== 'idle') Link.leave(); }catch(e){} });
}
// 🔗 ?page=turbo&link=<code> → the cover's 🕹️ Join with the number filled in
function tblUrl(code){ openCover(); if(!TurboCover) return; tblOpen(TurboCover); Link.cover.join(code); }
// ---- 📺 the TV Game Station (LinkKit plan §55c) ----
function tblStation(t){
  if(!window.Station) return false;
  if(!Station.on){ if((t | 0) < 60) setTimeout(() => tblStation((t | 0) + 1), 50); return false; }
  if(!Station.tv) return false;
  const lv = Station.lvl == null ? 0 : Math.max(0, Math.min(4, Station.lvl));
  TBL.st = {level: lv, theme}; openCover(); if(!TurboCover) return false; tblOpen(TurboCover); Link.cover.tv(TurboCover, TBL_ROOM); return true;
}
if(window.Station) Station.game({url: WEBAPP_URL, page: 'turbo', player: () => S.player || CURRENT_PLAYER, start: () => Link.cover.start(), again: () => tblGo(),
  result: () => (G && G.link && G.over && !$('result').classList.contains('hidden')) ? $('result-card') : (Link.pads && Link.pads.resultCard ? Link.pads.resultCard() : null), hide: '.gf-r-btns, .lp-cb, .lp-wait'});
GameParts.loaded('Turbo_link', 'lk-8e');
