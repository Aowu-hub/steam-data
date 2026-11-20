
/* 📡 LINK (lk-8d): 🥊 Brawl Buddies + 🗺️ Brawenture on own devices — LinkKit plan §55 (📡 Multiplayer chat, after 🐍 lk-8c's recipe §55e).
   Born split: this whole block is the part BrawlBuddies_link (GameParts), with the shared 🕹️ LinkPads part; the main file only holds the door
   (bblNeed / bblOwn + the ?link / 📺 station hooks). 🗺️ Brawenture lives in its own part BrawlBuddies_adv — this part only WRAPS its input +
   end functions (advInputs / advEnd), so the Brawenture file itself does not change. The room lives on the 🎬 cover (Link.cover, pads: true):
     📺 This screen is the game (TV / PC / iPad) — every fighter on a phone · 🎮 Host + play here (tablet: you fight by touch, friends on phones) · 🕹️ Join as a controller.
   ONE device runs the unchanged engines (BB ring · BV Brawenture). Each phone = one more key set:
     🥊 Ring: stick ◀ ▶ walk (→ → dash) · push up = ⤴️ jump · down = ⬇ duck (down + back = sitting block) · 👊 Boop (main; hold = 🛡️ block) · 💥 Bonk (hold = 🔨 breaker)
       · 🌀 Power (rim fills with ⚡) · 💨 Dodge · 🤼 Grab — in 🔁 tag teams 🔁 Swap takes 🤼's petal (grab = 💥 + 🌀 together, the game's own chord)
       1 phone = you vs the 🤖 robot family (the room's level) · 2 = 1 vs 1 · 3–4 = 🔁 tag teams 2 v 2 (🟥 phones 1 + 3 · 🟦 phones 2 + 4; 3 phones = a family buddy fills in)
       — the friend on the bench keeps the phone: 🔁 Tag me in! is the big button
     🗺️ Brawenture: stick = walk the street (up / down = deeper / nearer) · 👊 (hold = 🛡️) · 💥 · 🌀 · ⤴️ Jump · 🤼 Grab — 1–4 heroes, co-op; ⚔️ boss clash: the phone shows MY combo
   Nothing of the arena is sent to the phones — LinkPads sends each phone its own status (❤️ · 🥊 rounds · ⚡ power · ⏱) + buzz moments.
   📴 a phone that drops out → p.auto (ring: the engine's own robot brain, at a kind level) / the hero brain (Brawenture) → back = "👋 … is back!".
   Saves: the screen saves for every person (as 👥 same-device play). 💀 Hardcore stays on one device. */
const BBL = {wired: false, viaCover: false, cfg: null, pads: null, st: null, held: {}, boopT: {}, way: 'ring', diff: 'normal', last: 0};
const BBL_SIDE = ['🟥 Red', '🟦 Blue'];
const BBL_COL = ['#FF4D6D', '#3D8BFD'];
const BBL_HOLD_MS = 260;   // 👊 held this long = 🛡️ block (the same one-thumb rule as the game's own 🌸 ring, pzFan)
function bblPad(way, tag){
  const L = k => ({k, ic: PZ_LOOK[k][0], nm: PZ_LOOK[k][1], rim: PZ_LOOK[k][2]});
  if(way === 'adv') return {stick: 'free', ready: '🗺️ Get ready, hero!', hint: '🕹️ walk the street · hold 👊 = 🛡️ · ⚔️ boss = type your combo', btns: [Object.assign({main: true}, L('boop')), L('bonk'), Object.assign(L('jump'), {rim: '#7CC8FF'}), L('power'), L('grab')]};   // ⤴️ sky-blue here (🤼 keeps the green)
  return {stick: 'free', ready: '🥊 Get ready!', hint: '🕹️ ◀ ▶ walk · ▲ jump · ▼ duck · hold 👊 = 🛡️', btns: [Object.assign({main: true}, L('boop')), L('bonk'), L('power'), L('dodge'), tag ? L('tag') : L('grab')]};
}
function bblLevelOk(i){ return i >= 0 && i <= 4 && canPlay(i); }
function bblNow(){ return BBL.st || {way: BBL.way, level: SET.level, tale: ADV.tale, diff: BBL.diff}; }   // 📺 from the Game Station: the vote (in memory) — SET / ADV = the TV's own picks, never changed
function bblFix(){ if(BBL.st) return; if(!bblLevelOk(SET.level)){ const rec = AGE_START[S.age] || 0; SET.level = bblLevelOk(rec) ? rec : 0; } if(BBL.diff === 'skull' || !(window.BV ? BV.DIFFS[BBL.diff] : 1)) BBL.diff = 'normal'; }
function bblTale(i){ return window.BV && BV.TALES[i]; }
function bblLabel(tv){ const n = bblNow(), T = bblTale(n.tale);
  if(n.way === 'adv') return '🗺️ Brawenture' + (T ? ' · ' + T.icon + ' ' + T.name : '') + (window.BV ? ' · ' + BV.DIFFS[n.diff].icon + ' ' + BV.DIFFS[n.diff].name : '') + (tv ? ' · 📺 on the TV' : '');
  return '🥊 Ring · ' + LEVEL_UI[n.level].emoji + ' ' + BB.LEVELS[n.level].name + (tv ? ' · 📺 on the TV' : ''); }
const BBL_ROOM = {game: 'BrawlBuddies', title: '🥊 Brawl Buddies', page: 'brawlbuddies', kind: GAME_ID, seats: 4, min: 2, pads: true,
  url: WEBAPP_URL + '?page=brawlbuddies', name: () => S.player, av: () => myAvatar(S.player), drawAvatar: (cv, p) => drawPreviewCanvas(cv, myAvatar(p.name), {name: p.name, t: 1}),
  label: tv => bblLabel(tv), bot: () => bblNow().way === 'adv' ? '· 1 = one hero (+ 🤖 family bots on team tales)' : '· 1 = you vs the 🤖 robot family at ' + BB.LEVELS[bblNow().level].name, picks: el => bblPicks(el),
  how: 'Gameroom → 🥊 Brawl Buddies → 📱 Own devices → 🕹️ Join · or scan · 1 = you vs 🤖 · 2 = 1 vs 1 · 3–4 = 🔁 tag teams · 🗺️ Brawenture = 1–4 heroes together',
  onLink: () => { BBL.viaCover = true; bblFix(); }, onStart: () => { BBL.viaCover = true; bblGo(); }};
// the host's picks as chips in the room card — tap = the next one: 🎮 way · 🎚️ level (🥊) / 📖 tale + 🌱 difficulty (🗺️) · 🎨 arena (🥊)
function bblPicks(el){
  bblFix(); const n = bblNow(), T = bblTale(n.tale), adv = n.way === 'adv';
  let h = '<button class="lkc-chip" data-k="way" data-sound="none">' + (adv ? '🗺️ Brawenture' : '🥊 Ring') + '</button>';
  if(adv) h += '<button class="lkc-chip" data-k="tale" data-sound="none">' + (T ? T.icon + ' ' + UI.esc(T.name) : '📖 …') + '</button><button class="lkc-chip" data-k="diff" data-sound="none">' + (window.BV ? BV.DIFFS[n.diff].icon + ' ' + BV.DIFFS[n.diff].name : '🌱 …') + '</button>';
  else { const Th = THEMES[SET.theme] || THEMES.playground; h += '<button class="lkc-chip" data-k="lvl" data-sound="none">' + LEVEL_UI[n.level].emoji + ' ' + UI.esc(BB.LEVELS[n.level].name) + '</button><button class="lkc-chip" data-k="theme" data-sound="none">' + Th.icon + ' ' + UI.esc(Th.name) + '</button>'; }
  el.innerHTML = h;
  if(BBL.st){ el.querySelectorAll('.lkc-chip').forEach(b => { b.disabled = true; }); return; }   // 📺 from the Game Station: the vote decides
  el.querySelectorAll('.lkc-chip').forEach(b => b.onclick = e => { e.stopPropagation(); const nx = (ks, v) => ks[(ks.indexOf(v) + 1) % ks.length], k = b.dataset.k;
    if(k === 'way'){ if(BBL.way === 'ring') return bblAdvNeed(() => { BBL.way = 'adv'; UISound.play('tap'); bblRepick(el); }); BBL.way = 'ring'; }
    else if(k === 'lvl') SET.level = nx([0, 1, 2, 3, 4].filter(bblLevelOk), SET.level);
    else if(k === 'theme') SET.theme = nx(THEME_KEYS, SET.theme);
    else if(k === 'tale'){ ADV.tale = nx(BV.TALES.map((t, i) => i).filter(i => advTaleOpen(i)), ADV.tale); advSavePrefs(); }
    else if(k === 'diff') BBL.diff = nx(BV.DIFF_KEYS.filter(d => d !== 'skull'), BBL.diff);
    if(k === 'lvl' || k === 'theme') savePrefs(); UISound.play('tap'); bblRepick(el); });
}
function bblRepick(el){ bblPicks(el); try{ if(Link.isHost()) Link.setLabel(bblLabel(Link.hostess())); }catch(er){} }
function bblAdvNeed(go){ if(typeof advPartReady === 'function' && advPartReady()) return go(); if(typeof advNeed === 'function') return advNeed(() => { bblAdvWraps(); go(); }); go(); }
function bblOpen(C){ bblWire(); Link.cover(C, BBL_ROOM); }
// ▶ Start on the cover (host) / 🔁 Play again: the linked players → fighters / heroes in seat order (the TV itself is no seat)
function bblGo(){
  bblFix(); const now = bblNow(), tv = !!(Link.hostess && Link.hostess()), me = Link.seat();
  const list = Link.players().filter(p => p.name && (p.on || p.me) && !p.screen).sort((a, b) => a.seat - b.seat).slice(0, 4);
  if(list.length < (tv ? 1 : 2)){ UISound.play('error'); UI.toast(tv ? '📺 Wait for a player to join' : '📡 Wait for a friend to join'); return; }
  if(now.way === 'adv') return bblAdvNeed(() => bblAdvGo(list, tv, me));
  bblStop(); hideResult();
  const n = list.length, duo = n >= 2, tag = n >= 3, names = list.map(p => p.name);
  // 🔁 3–4 phones = tag teams: 🟥 phones 1 + 3 · 🟦 phones 2 + 4 (3 phones → the 🟦 side gets a family buddy, played by phone 2 when tagged in)
  const sides = duo ? [[0], [1]] : [[0]]; if(tag){ sides[0].push(2); if(n > 3) sides[1].push(3); }
  const L = BB.LEVELS[now.level], players = [{name: names[0], human: true}, {name: duo ? names[1] : 'Robo-Buddy', human: duo}];
  const mates = tag && n === 3 ? pickMates(names, 1) : [], teamN = tag ? 2 : duo ? 1 : L.team;
  const m1 = !duo ? pickMates(names, teamN - 1) : [], bots = duo ? [] : pickBots(names.concat(m1), teamN);
  const teams = duo ? [sides[0].map(k => ({name: names[k], human: true})), sides[1].map(k => ({name: names[k], human: true})).concat(mates.map(nm => ({name: nm, human: true})))]
    : [[players[0]].concat(m1.map(nm => ({name: nm, human: true}))), bots];
  if(!duo) players[1].name = bots[0].name;
  BBL.cfg = {id: Date.now().toString(36), tv, way: 'ring', station: !!BBL.st, level: now.level, duo, tag,
    seats: list.map((p, k) => { const side = duo ? k % 2 : 0, slot = duo ? Math.floor(k / 2) : 0; return {lseat: p.seat, g: k, side, slot, name: p.name, local: !tv && p.seat === me}; })};
  // the team-mate a 3-phone 🟦 side borrows is played by phone 2 when it is in the ring
  if(tag && n === 3) BBL.cfg.borrow = {side: 1, slot: 1, by: 1};
  BBL.held = {}; BBL.boopT = {}; BBL.last = performance.now();
  bblStartMatch({level: now.level, duo, players, teams, theme: SET.theme});
  if(!G) return;
  G.link = BBL.cfg; const M = G.M;
  BBL.pads = Link.pads.screen({game: 'BrawlBuddies', title: bblLabel(false), kind: GAME_ID, host: tv ? 'the TV' : S.player, pad: bblPad('ring', tag),
    seats: BBL.cfg.seats.filter(s => !s.local).map(s => ({lseat: s.lseat, gseat: s.g, name: s.name, col: BBL_COL[s.side], cname: duo ? BBL_SIDE[s.side] + (tag ? (s.slot ? ' · 🪑 bench first' : ' · 🥊 first in') : '') : '🥊 vs the 🤖 robot family', where: tag ? '' : s.side ? 'starts right ▶' : '◀ starts left'})),
    onDir: (g, d) => { const s = bblSeat(g), f = s && bblFighter(s); if(!f || !bblActive(s) || f.auto || G.paused || G.M.done) return; if(d === 'u') BB.press(G.M, s.side, 'jump'); },
    onBtn: (g, k, on) => bblBtn(g, k, on),
    onDrop: g => { const s = bblSeat(g); if(!s || !G || !G.link || G.over) return; bblFighters(s).forEach(f => { f.auto = true; f.brain = G.mode === 'robot' ? Math.min(G.level, 1) : 1; }); BBL.held[g] = {}; banner('🤖 A robot fights for ' + s.name + ' until they come back', 'bad', 1800); },
    onBack: g => { const s = bblSeat(g); if(!s || !G || !G.link) return; const fs = bblFighters(s); if(!fs.some(f => f.auto)) return; fs.forEach(f => { f.auto = false; delete f.brain; }); banner('👋 ' + s.name + ' is back!', 'good', 1400); UISound.play('success'); },
    onPause: (on, name) => { if(!G || G.M.done || !!G.paused === on) return; G.paused = on; UI.pauseIcon($('pause-btn'), on); banner(on ? '⏸ ' + name + ' paused' : '▶ ' + name + ' — bonk!', 'good', on ? 600000 : 900); if(!on) G.held.clear(); },
    status: g => bblStatus(g)});
}
// = startMatch() with the fighters from the phones (keep in step with BrawlBuddies.html startMatch — pads-brawl.js compares the G keys)
function bblStartMatch(o){
  if(BrawlCover) BrawlCover.hide();
  const M = BB.newMatch({level: o.level, mode: o.duo ? 'duo' : 'robot', seed: (Date.now() & 0xffffff) ^ 0x2b, players: o.players, teams: o.teams});
  M.sq.forEach(tm => tm.forEach(f => { const robo = !f.human && ROBO_NAMES.indexOf(f.name) >= 0; f.robo = robo; const raw = f.human ? myAvatar(f.name === 'Guest' ? 'Guest' : f.name) : robo ? robotAvatar(o.level) : helmetReady(myAvatar(f.name)); f.avW = raw; f.avF = fightAv(raw);
    const worn = raw.eq && raw.eq.hand && raw.eq.hand.id === 'brawlgear' ? raw.eq.hand.v : null; f.gear = !f.human ? null : worn != null ? worn : S.gear[f.name] != null ? S.gear[f.name] : null; }));
  const raw = [M.sq[0][0].avW, M.sq[1][0].avW];
  GameComic._reset('brawl');
  G = {M, mode: o.duo ? 'duo' : 'robot', level: o.level, theme: o.theme, held: new Set(), tbHold: {}, tbBlk: {}, fx: [], raf: 0, last: 0, acc: 0, paused: false, over: false, endT: 0, shown: false,
    avs: raw.map(fightAv), winAvs: raw, cam: {cx: 0, w: 9}, shake: 0, hitstop: 0, t: 0, startAt: performance.now(), pads: [null, null], dance: null, hpShow: [1, 1], link: BBL.cfg};
  const loc = BBL.cfg.seats.filter(s => s.local);   // 🎮 host + play: only the host's own side answers this keyboard
  M.sq.forEach((tm, i) => tm.forEach(p => { p.seatKeys = loc.some(s => s.side === i) ? [KEYS[0], KEYS[1]] : []; }));
  G.crowd = crowdFor(M); G.faceKey = ['', ''];
  cheerMount(); calloutSetup();
  setNames(); ['pips0', 'pips1'].forEach(id => { $(id).innerHTML = '<i></i>'.repeat(M.need); });
  showScreen('play'); layoutPlay(); hud();
  G.last = performance.now(); G.raf = requestAnimationFrame(frame);
}
function bblSeat(g){ return BBL.cfg && BBL.cfg.seats[g]; }
function bblFighter(s){ return G && G.M && G.M.sq[s.side] && G.M.sq[s.side][s.slot]; }
function bblFighters(s){ const f = bblFighter(s), out = f ? [f] : [], b = BBL.cfg.borrow; if(b && b.by === s.g && G.M.sq[b.side][b.slot]) out.push(G.M.sq[b.side][b.slot]); if(!BBL.cfg.tag && G.M.sq[s.side]) G.M.sq[s.side].forEach(x => { if(out.indexOf(x) < 0 && x.human) out.push(x); }); return out; }   // a 1 v 1 / 2 v 2 🤝 side (family mates of the same phone) moves together
function bblActive(s){ const M = G.M, f = M.f[s.side]; return bblFighters(s).indexOf(f) >= 0; }
function bblBtn(g, k, on){
  if(!G || !G.link) return; const s = bblSeat(g); if(!s) return; const H = BBL.held[g] || (BBL.held[g] = {}); H[k] = on ? performance.now() : 0;
  if(!on || G.paused || G.M.done || G.hold) return;
  const M = G.M, act = bblActive(s), f = M.f[s.side];
  if(k === 'tag'){ if(!act && M.sq[s.side].length > 1) BB.press(M, s.side, 'tag'); else if(act) BB.press(M, s.side, 'tag'); return; }   // 🔁 the bench phone can call the tag too
  if(!act || (f && f.auto)) return;
  if(k === 'boop' || k === 'bonk' || k === 'power' || k === 'dodge' || k === 'grab') BB.press(M, s.side, k);
}
// every frame: the phones' sticks + held buttons → their fighter (the TV's own keyboard read first, for the 🎮 host only)
function bblInputs(){
  const M = G.M, t = performance.now();
  G.link.seats.forEach(s => { if(s.local) return; const f = M.f[s.side]; if(!f || !bblActive(s) || f.auto) return;
    const inp = BBL.pads && BBL.pads.input(s.g); if(!inp || inp.away){ BB.setCtrl(M, s.side, false, false, false); BB.setHold(M, s.side, false); BB.setBlock(M, s.side, false); return; }
    const H = BBL.held[s.g] || {}, l = inp.x < -0.35, r = inp.x > 0.35, d = inp.y > 0.45 && Math.abs(inp.y) > Math.abs(inp.x) * 0.6;
    const blk = !!(H.boop && t - H.boop > BBL_HOLD_MS);
    BB.setCtrl(M, s.side, l && !r, r && !l, d); BB.setHold(M, s.side, !!H.bonk && !blk); BB.setBlock(M, s.side, blk);
  });
}
// what one phone shows: ❤️ · 🥊 rounds · ⚡ power (🌀 rim fills) · ⏱ — and the bench / KO / robot lines
function bblStatus(g){
  if(!G || !G.M || !BBL.cfg) return null; if(BBL.cfg.way === 'adv') return bblAdvStatus(g);
  const M = G.M, s = bblSeat(g); if(!s) return null; const f = bblFighter(s), act = bblActive(s), cur = M.f[s.side]; if(!f) return null;
  const me = act ? cur : f, chips = [['❤️', Math.max(0, Math.round(me.hp / me.maxHp * 100)) + '%'], ['🥊', M.wins[s.side] + '/' + M.need], ['⚡', Math.round(me.power) + '%']];
  if(M.lv && M.lv.time) chips.push(['⏱', String(Math.max(0, Math.ceil(M.clock)))]);
  const cool = {}, glow = {}, btns = {};
  if(me.dodgeCd > 0) cool.dodge = Math.min(1, me.dodgeCd / 1.0);
  if(me.power < 100) cool.power = 1 - me.power / 100; else glow.power = 1;
  if(me.ctrl && me.ctrl.d) btns.power = ['🚀', 'Upper'];
  if(M.sq[s.side].length > 1){ const cd = M.tagCd[s.side] || 0, mx = M.duo ? 10 : (M.lv.tagCd || 10); if(cd > 0) cool.tag = Math.min(1, cd / mx); else if(!act) glow.tag = 1; btns.tag = act ? ['🔁', 'Swap'] : ['🔁', 'Tag me in!']; }
  const opp = M.f[1 - s.side], line = f.auto ? '🤖 The robot fights for you' : !act ? '🪑 On the bench — ' + cur.name + ' is in. 🔁 = tag in!' : M.state === 'intro' ? '🥊 Round ' + M.round + ' — get ready!'
    : me.held ? '🤼 Grabbed — tap buttons to wriggle free!' : me.dizzy > 0 ? '😵 Dizzy — shake it off!' : me.down > 0 ? '⬆️ Up you get!' : opp && opp.open > 0 ? '😱 ' + opp.name + ' is wide open — bonk!' : me.power >= 100 ? '🌀 Power is full!' : '';
  return {chips, btns, cool, glow, line, state: !act && M.sq[s.side].length > 1 ? 'wait' : me.ko ? 'out' : 'play'};
}
// 💥 the engine's moments → a buzz on the right phone(s)
function bblPhoneOf(side){ const M = G.M, f = M.f[side]; const s = BBL.cfg.seats.find(x => x.side === side && bblFighters(x).indexOf(f) >= 0); return s ? s.g : -1; }
function bblBuzz(list){
  const P = BBL.pads; if(!P || !G || !G.link || G.link.way !== 'ring') return; const M = G.M, nm = i => M.f[i] ? M.f[i].name : '';
  list.forEach(e => {
    if(e.k === 'hit'){ const tg = bblPhoneOf(e.to), by = bblPhoneOf(1 - e.to), big = ['bonk', 'jbonk', 'power', 'jpower', 'upper', 'lowbonk', 'dbonk', 'fly', 'gbreak'].indexOf(e.move) >= 0;
      if(tg >= 0 && (big || e.combo >= 3)) P.buzz(tg, 'hit', big ? '💥 Big bonk from ' + nm(1 - e.to) + '!' : '');
      if(by >= 0 && e.combo >= 3 && (e.combo === 3 || e.combo === 5 || e.combo === 8)) P.buzz(by, 'got', '🔥 ' + e.combo + ' hits!'); }
    else if(e.k === 'block'){ const g = bblPhoneOf(e.p); if(g >= 0 && e.timed) P.buzz(g, 'got', '🛡️ PARRY! Now 👊 / 💥 = ⚡ counter!'); }
    else if(e.k === 'counter'){ const g = bblPhoneOf(e.p); if(g >= 0) P.buzz(g, 'got', '⚡ COUNTER' + (e.n > 1 ? ' ×' + e.n : '') + '!'); }
    else if(e.k === 'sky' || e.k === 'gbreak' || e.k === 'perfect'){ const g = bblPhoneOf(e.p); if(g >= 0) P.buzz(g, 'got', e.k === 'sky' ? '🌟 Sky combo!' : e.k === 'gbreak' ? '🔨 Guard break!' : '✨ PERFECT round!'); }
    else if(e.k === 'grab'){ const g = bblPhoneOf(1 - e.p); if(g >= 0) P.buzz(g, 'hit', '🤼 ' + nm(e.p) + ' grabbed you — wriggle!'); }
    else if(e.k === 'tag'){ const g = bblPhoneOf(e.p); if(g >= 0) P.buzz(g, 'go', '🔁 You\'re in — bonk!'); BBL.cfg.seats.forEach(s => { if(s.side === e.p && s.g !== g && M.sq[e.p].length > 1) P.buzz(s.g, 'tick', '🪑 Rest up — you get hearts back'); }); }
    else if(e.k === 'ko'){ const g = bblPhoneOf(e.p), by = e.by >= 0 ? bblPhoneOf(e.by) : -1; if(g >= 0) P.buzz(g, 'out', '💫 Bonked out!'); if(by >= 0) P.buzz(by, 'got', '🎯 You bonked out ' + nm(e.p) + '!'); }
    else if(e.k === 'out'){ BBL.cfg.seats.forEach(s => { if(s.side === e.p && bblFighter(s) && bblFighter(s).name === e.name) P.buzz(s.g, 'out', '💫 You\'re out — cheer your buddy on!'); }); }
    else if(e.k === 'roundEnd' && e.winner >= 0){ BBL.cfg.seats.forEach(s => P.buzz(s.g, s.side === e.winner ? 'round' : 'tick', s.side === e.winner ? '🏆 Round ' + e.n + ' to you!' : '😤 Round ' + e.n + ' to ' + nm(e.winner) + ' — next one!')); }
    else if(e.k === 'fight'){ P.buzzAll('go', M.round === 1 ? '🥊 Bonk!' : '🥊 Round ' + M.round + '!'); }
  });
}
// 🏁 the match is over → every phone gets its own line · the screen's card: 🔁 Play again · ◀ Room · 🚪 End the room
function bblEnd(){
  const P = BBL.pads; if(!P || !G || !G.link) return; const M = G.M, w = M.winner, lines = {}, wins = {}, st = M.stats;
  BBL.cfg.seats.forEach(s => { const won = w === s.side; if(won) wins[s.g] = 1; const x = st[s.side];
    lines[s.g] = (won ? '🏆 You win!' : '💪 Good fight!') + ' · 🥊 ' + M.wins[s.side] + '–' + M.wins[1 - s.side] + ' · 👊 ' + x.hits + ' bonks · 🔥 ' + x.bestCombo; });
  const wn = w >= 0 ? (M.duo && M.sq[w].length > 1 ? M.sq[w].filter(f => f.human).map(f => f.name).join(' + ') : M.f[w].name) : '';
  P.end({icon: w < 0 ? '🤝' : M.f[w].human ? '🏆' : '🤖', title: w < 0 ? 'A draw!' : wn + (M.f[w].human ? ' win' + (M.duo && M.sq[w].length > 1 ? '' : 's') + '!' : ' wins this time'), lines, wins});
  bblCardRow();
}
function bblCardRow(){
  const row = $('result-card') && $('result-card').querySelector('.gf-r-btns'); if(!row) return; const tv = BBL.cfg && BBL.cfg.tv;
  row.innerHTML = '<button class="btn sp-btn sp-primary" id="bbl-again" data-sound="pop">🔁 Play again</button>' + (BBL.viaCover ? '<button class="btn soft sp-btn sp-secondary" id="bbl-room" data-sound="none">◀ Room</button>' : '') +
    '<button class="btn soft sp-btn sp-secondary" id="bbl-exit" data-sound="none">' + (tv ? '🚪 End the room' : '🎚️ Levels') + '</button>';
  $('bbl-again').onclick = () => bblGo(); if($('bbl-room')) $('bbl-room').onclick = () => bblToCover(); $('bbl-exit').onclick = () => bblExit();
}
function bblStop(){ if(BBL.pads) BBL.pads.stop(); BBL.pads = null; }
function bblToCover(){ const adv = BBL.cfg && BBL.cfg.way === 'adv'; bblStop(); BBL.cfg = null; if(adv){ if(typeof advToMenu === 'function' && AV) advToMenu(); } else backToMenu(); openCover(); if(BrawlCover) Link.cover.show(BrawlCover); }
function bblExit(){ try{ if(Link.status() !== 'idle') Link.leave(); }catch(e){} const adv = BBL.cfg && BBL.cfg.way === 'adv'; bblStop(); BBL.cfg = null; BBL.viaCover = false; if(adv && AV) advToMenu(); else backToMenu(); }

/* ---------- 🗺️ Brawenture co-op (1–4 heroes, every hero a phone) — the part BrawlBuddies_adv is only WRAPPED (advInputs · advEnd), never edited ---------- */
function bblAdvGo(list, tv, me){
  const n = bblNow(), T = BV.TALES[n.tale], max = T.players[T.players.length - 1];
  if(list.length > max){ UISound.play('error'); UI.toast('🗺️ ' + T.icon + ' ' + T.name + ' fits ' + max + ' heroes — pick a bigger tale (📖 chip)'); return; }
  bblStop(); bblAdvWraps();
  const heroes = list.map(p => ({name: p.name, human: true})), taken = heroes.map(h => h.name);
  const captive = T.noCaptive ? '' : advPickFamily(taken) || 'Teddy'; const prisoner = T.prisoner ? (advPickFamily(taken.concat([captive])) || 'Buddy') : '';
  const keep = {tale: ADV.tale, diff: ADV.diff}; ADV.tale = n.tale; ADV.diff = n.diff;   // the room's picks for this run (the TV's saved Brawenture picks come back after)
  BBL.cfg = {id: Date.now().toString(36), tv, way: 'adv', station: !!BBL.st, tale: n.tale, diff: n.diff, keep,
    seats: list.map((p, k) => ({lseat: p.seat, g: k, hero: k, name: p.name, local: !tv && p.seat === me}))};
  BBL.held = {}; BBL.boopT = {}; BBL.cfg.starting = true;
  try{ startAdv(heroes, captive, prisoner ? {prisoner} : null); } finally { BBL.cfg.starting = false; }
  if(!AV) return; AV.link = BBL.cfg;
  if(BrawlCover) BrawlCover.hide();
  BBL.pads = Link.pads.screen({game: 'BrawlBuddies', title: bblLabel(false), kind: GAME_ID, host: tv ? 'the TV' : S.player, pad: bblPad('adv'),
    seats: BBL.cfg.seats.filter(s => !s.local).map(s => ({lseat: s.lseat, gseat: s.g, name: s.name, col: ADV_SEAT[s.hero % 4], cname: '🗺️ Hero ' + (s.hero + 1) + ' · ' + T.icon + ' ' + T.name, where: ''})),
    onDir: (g, d) => bblAdvDir(g, d), onBtn: (g, k, on) => bblAdvBtn(g, k, on),
    onDrop: g => { const s = bblSeat(g), h = s && AV && AV.M.heroes[s.hero]; if(!h || AV.over) return; h.human = false; h.linkAuto = true; BBL.held[g] = {}; advBanner('🤖 A family bot plays ' + s.name + ' until they come back', 'bad'); },
    onBack: g => { const s = bblSeat(g), h = s && AV && AV.M.heroes[s.hero]; if(!h || !h.linkAuto) return; h.human = true; h.linkAuto = false; advBanner('👋 ' + s.name + ' is back!', 'good'); UISound.play('success'); },
    onPause: (on, name) => { if(!AV || AV.over || AV.story || !!AV.paused === on) return; AV.paused = on; UI.pauseIcon($('adv-pause'), on); advBanner(on ? '⏸ ' + name + ' paused' : '▶ ' + name + ' — go, heroes!', 'good'); if(!on) AV.held.clear(); },
    status: g => bblAdvStatus(g)});
}
const BBL_CLASH = {l: 'l', r: 'r', u: 'u', d: 'd'};
function bblAdvDir(g, d){ const s = bblSeat(g); if(!s || !AV || !AV.M.clash || !d || !BBL_CLASH[d]) return; const h = AV.M.heroes[s.hero]; if(h && !h.linkAuto) BV.clashKey(AV.M, s.hero, BBL_CLASH[d]); }
function bblAdvBtn(g, k, on){
  const s = bblSeat(g); if(!s || !AV) return; const H = BBL.held[g] || (BBL.held[g] = {}); H[k] = on ? performance.now() : 0;
  const h = AV.M.heroes[s.hero]; if(!on || !h || h.linkAuto || AV.over) return;
  if(AV.story){ const b = $('story-go'); if(b) b.click(); return; }   // 📖 the story card: any phone's button = ▶ Let's go
  if(AV.paused || AV.hold) return;
  if(AV.M.clash){ if(k === 'boop' || k === 'bonk' || k === 'power' || k === 'jump') BV.clashKey(AV.M, s.hero, k); return; }
  if(k === 'boop' || k === 'bonk' || k === 'power' || k === 'jump' || k === 'grab') BV.press(AV.M, s.hero, k);
}
function bblAdvInputs(){
  const M = AV.M, t = performance.now();
  BBL.cfg.seats.forEach(s => { if(s.local) return; const h = M.heroes[s.hero]; if(!h || h.linkAuto) return;
    const inp = BBL.pads && BBL.pads.input(s.g), H = BBL.held[s.g] || {}; if(!inp || inp.away){ BV.setCtrl(M, s.hero, false, false, false, false); BV.setHold(M, s.hero, false, false); return; }
    const l = inp.x < -0.35, r = inp.x > 0.35, u = inp.y < -0.35, d = inp.y > 0.35, blk = !!(H.boop && t - H.boop > BBL_HOLD_MS);
    BV.setHold(M, s.hero, blk, !!H.bonk && !blk); BV.setCtrl(M, s.hero, l && !r, r && !l, u && !d, d && !u); });
}
function bblAdvStatus(g){
  if(!AV || !AV.M) return null; const M = AV.M, s = bblSeat(g), h = s && M.heroes[s.hero]; if(!h) return null;
  const chips = [['❤️', Math.max(0, Math.round(h.hp)) + '%'], ['⚡', Math.round(h.power || 0) + '%'], ['🗺️', (M.mapI + 1) + '/' + M.tale.maps.length], ['🏆', String(M.score || 0)]];
  const cool = {}, glow = {}; if((h.power || 0) < 100) cool.power = 1 - (h.power || 0) / 100; else glow.power = 1;
  const C = M.clash, cp = C && C.per[h.i], ICON = CLASH_ICON;
  const line = h.linkAuto ? '🤖 A family bot plays for you' : AV.story ? '📖 Story time — any button = ▶ Let\'s go!' : cp ? '⚔️ Combo: ' + cp.seq.map((x, j) => j < cp.pos ? '✅' : ICON[x] || x).join(' ')
    : h.ko ? '💫 Knocked down — a friend can help you up!' : M.puzzle && M.puzzle.k ? '🧩 ' + ((typeof ADV_HINT !== 'undefined' && ADV_HINT[M.puzzle.k]) || 'Puzzle time — work together!') : (h.power || 0) >= 100 ? '🌀 Power is full!' : '';
  return {chips, cool, glow, line, state: h.ko ? 'ghost' : 'play'};
}
function bblAdvBuzz(list){
  const P = BBL.pads; if(!P || !AV || !AV.link) return; const phoneOf = seat => { const s = BBL.cfg.seats.find(x => x.hero === seat); return s ? s.g : -1; };
  list.forEach(e => { const g = e.h != null ? phoneOf(e.h) : e.seat != null ? phoneOf(e.seat) : -1;
    if(e.k === 'clash') P.buzzAll('round', '⚔️ Boss clash — type YOUR combo!');
    else if(e.k === 'clashSet' && g >= 0) P.buzz(g, 'got', '💥 COMBO ×' + e.sets + '!');
    else if(e.k === 'clashBad' && g >= 0) P.buzz(g, 'hit', '❌ Oops — start the combo again');
    else if(e.k === 'solved') P.buzzAll('win', '🧩 Puzzle solved!');
    else if(e.k === 'rescue') P.buzzAll('win', '🎉 Rescued!');
    else if(e.k === 'heroKo' && g >= 0) P.buzz(g, 'out', '💫 Knocked down!');
    else if(e.k === 'respawn' && g >= 0) P.buzz(g, 'go', '❤️ Back up — go!');
    else if(e.k === 'pick' && g >= 0) P.buzz(g, 'pick', '🎁 Picked up!');
    else if(e.k === 'mapEnd') P.buzzAll('round', '🗺️ On to the next map!'); });
}
function bblAdvEnd(win){
  const P = BBL.pads; if(!P || !AV) return; const M = AV.M, lines = {}, wins = {};
  BBL.cfg.seats.forEach(s => { const h = M.heroes[s.hero]; if(win) wins[s.g] = 1; lines[s.g] = (win ? '🎉 Rescued together!' : '💪 So close!') + ' · 😈 ' + ((h && h.st && h.st.kos) || 0) + ' bonked · 🏆 ' + (M.score || 0); });
  P.end({icon: win ? '🎉' : '💫', title: win ? (M.tale.noCaptive ? 'The town is saved!' : (M.captive || 'Teddy') + ' is rescued!') : 'Out of comebacks…', lines, wins});
}
function bblAdvWraps(){
  if(window.__bblAdv || typeof advInputs !== 'function') return; window.__bblAdv = true;
  // the phones' heroes answer the phones (the TV's keyboard + touch pads first, for the 🎮 host only)
  const ai = window.advInputs; window.advInputs = function(){ if(!(AV && AV.link)) return ai.apply(this, arguments);
    const rem = AV.link.seats.filter(s => !s.local).map(s => AV.M.heroes[s.hero]).filter(h => h && h.human); rem.forEach(h => { h.human = false; });
    try{ ai.apply(this, arguments); } finally { rem.forEach(h => { h.human = true; }); } try{ bblAdvInputs(); }catch(e){ console.error(e); } };
  const ae = window.advEnd; window.advEnd = function(win){ const L = AV && AV.link; if(L){ AV.M.heroes.forEach(h => { if(h.linkAuto){ h.human = true; h.linkAuto = false; } }); }   // a hero a bot finished still gets the run saved
    const r = ae.apply(this, arguments); try{ if(L){ bblAdvEnd(win); ADV.tale = L.keep.tale; ADV.diff = L.keep.diff; setTimeout(bblAdvCard, win ? 700 : 1000); } }catch(e){ console.error(e); } return r; };
  if(window.advEvents){ const ev = window.advEvents; window.advEvents = function(list){ const pk = (list || []).filter(e => e.k === 'pick' && e.h != null).pop(); BBL.pickBy = pk && AV && AV.M.heroes[pk.h] ? AV.M.heroes[pk.h].name : ''; const r = ev.apply(this, arguments); try{ if(AV && AV.link && list && list.length) bblAdvBuzz(list); }catch(e){ console.error(e); } return r; }; }
  // 📺 the TV says names, never "You": 🧸 "Mia found a lost teddy!"
  if(window.advBanner){ const ab = window.advBanner; window.advBanner = function(t){ if(AV && AV.link && typeof t === 'string' && /^🧸 You found/.test(t)) arguments[0] = t.replace('You found', (BBL.pickBy || 'A hero') + ' found'); return ab.apply(this, arguments); }; }
  // 📺 no touch pads on the screen for the phones' heroes
  const la = window.layoutAdv; window.layoutAdv = function(){ const L = (AV && AV.link) || (BBL.cfg && BBL.cfg.starting && BBL.cfg.way === 'adv' ? BBL.cfg : null); if(!L) return la.apply(this, arguments);
    const loc = L.seats.filter(s => s.local).map(s => s.hero), all = AV.M.heroes, keep = all.map(h => h.human);
    all.forEach((h, k) => { if(h.human && loc.indexOf(k) < 0) h.human = false; });
    try{ return la.apply(this, arguments); } finally { all.forEach((h, k) => { h.human = keep[k]; }); if(!loc.length){ const b = $('adv-bottom'); if(b) b.innerHTML = '<div class="legend bbl-legend"><span>📱 The phones are the controllers</span><span>' + L.seats.map(s => '<b style="color:' + ADV_SEAT[s.hero % 4] + '">● ' + UI.esc(s.name) + '</b>').join(' ') + '</span><span><span class="kk">Esc</span> pause</span></div>'; } } };
}
function bblAdvCard(){ const card = $('result-card'), row = card && card.querySelector('.go-row'); if(!row || !BBL.cfg) return; const tv = BBL.cfg.tv;
  row.innerHTML = '<button class="btn sp-btn sp-primary" id="bbl-again" data-sound="pop">🔁 Play again</button>' + (BBL.viaCover ? '<button class="btn soft sp-btn sp-secondary" id="bbl-room" data-sound="none">◀ Room</button>' : '') + '<button class="btn soft sp-btn sp-secondary" id="bbl-exit" data-sound="none">' + (tv ? '🚪 End the room' : '🗺️ Tales') + '</button>';
  $('bbl-again').onclick = () => { if(AV){ cancelAnimationFrame(AV.raf); } hideResult(); bblGo(); }; if($('bbl-room')) $('bbl-room').onclick = () => bblToCover(); $('bbl-exit').onclick = () => bblExit(); }

// wraps (only while a linked match runs on THIS screen): inputs · pads only for this device's own side · buzz · the 🏁 card · ⏸ for everyone
function bblWraps(){
  if(window.__bblWraps) return; window.__bblWraps = true;
  const ri = window.readInputs; window.readInputs = function(){ if(!(G && G.link)) return ri.apply(this, arguments);
    const rem = []; G.link.seats.forEach(s => { if(!s.local) bblFighters(s).forEach(f => { if(!f.auto){ f.auto = true; rem.push(f); } }); });   // the keyboard reader skips the phones' fighters …
    try{ ri.apply(this, arguments); } finally { rem.forEach(f => { f.auto = false; }); } try{ bblInputs(); }catch(e){ console.error(e); } };   // … then the phones drive them
  const lp = window.layoutPlay; window.layoutPlay = function(){ const r = lp.apply(this, arguments); if(!(G && G.link)) return r;
    const mine = G.link.seats.filter(s => s.local).map(s => s.side);
    if(!mine.length){ document.querySelectorAll('#arena .ctl').forEach(e => e.remove()); $('bottom').innerHTML = '<div class="legend bbl-legend"><span>📱 The phones are the controllers</span><span>' + G.link.seats.map(s => '<b style="color:' + BBL_COL[s.side] + '">● ' + UI.esc(s.name) + '</b>').join(' ') + '</span><span><span class="kk">Esc</span> pause</span></div>'; $('scr-play').classList.remove('side', 'port', 'two', 'tight', 'ovl'); requestAnimationFrame(resize); }
    else document.querySelectorAll('#scr-play .ctl').forEach(c => { if(mine.indexOf(Number(c.dataset.p)) < 0) c.remove(); });
    return r; };
  const he = window.handleEvents; window.handleEvents = function(list){ const r = he.apply(this, arguments); try{ if(G && G.link && list && list.length) bblBuzz(list); }catch(e){ console.error(e); } return r; };
  const fm = window.finishMatch; window.finishMatch = function(){ const r = fm.apply(this, arguments); try{ if(G && G.link) bblEnd(); }catch(e){ console.error(e); } return r; };
  const tp = window.togglePause; window.togglePause = function(){ const r = tp.apply(this, arguments); try{ if(G && G.link && BBL.pads) BBL.pads.paused(!!G.paused); }catch(e){} return r; };
  const pa = window.pauseAdv; if(pa) window.pauseAdv = function(){ const r = pa.apply(this, arguments); try{ if(AV && AV.link && BBL.pads) BBL.pads.paused(!!AV.paused); }catch(e){} return r; };
  // 🏁 the screen's card names the WINNER (the TV's own name is nobody's seat): "Mia bonked the robot!" — never "You …"
  if(window.GF && GF.result && !GF.__bbl){ const gr = GF.result; GF.__bbl = true; GF.result = function(o){ try{ if(G && G.link && o){ const M = G.M, w = M.winner, hw = w >= 0 && M.f[w].human ? M.f[w] : M.f.find(x => x.human);
      if(hw && o.buddy) o.buddy = {name: hw.name, av: myAvatar(hw.name)};
      if(o.title && G.mode === 'robot') o.title = String(o.title).replace(/^You bonked/, M.f[0].name + ' bonked'); } }catch(e){} return gr.apply(this, arguments); }; }
  const bm = window.backToMenu; window.backToMenu = function(){ if(BBL.pads && G && G.link){ BBL.pads.stop(); BBL.pads = null; } return bm.apply(this, arguments); };
  const am = window.advToMenu; if(am) window.advToMenu = function(){ if(BBL.pads && AV && AV.link){ BBL.pads.stop(); BBL.pads = null; } return am.apply(this, arguments); };
  bblAdvWraps();
}
const BBL_CSS = "/* 📡 lk-8d: the TV's line under the arena while phones are the controllers */\n.legend.bbl-legend{flex-wrap:wrap;justify-content:center;gap:6px 16px;font-size:clamp(13px,1.35vw,20px);padding:6px 10px;}\n.legend.bbl-legend b{font-weight:900;text-shadow:0 1px 0 rgba(0,0,0,.45);}";   // added only when a room opens
function bblWire(){
  bblWraps(); if(!document.getElementById('bbl-css')){ const st = document.createElement('style'); st.id = 'bbl-css'; st.textContent = BBL_CSS; (document.head || document.documentElement).appendChild(st); } if(BBL.wired || !window.Link) return; BBL.wired = true;
  Link.pads.config({drawAvatar: (cv, n) => drawPreviewCanvas(cv, myAvatar(n), {name: n, t: 1}), avatar: n => myAvatar(n), onRoom: () => { if(BrawlCover) Link.cover.show(BrawlCover); }, onLeave: () => openCover()});
  Link.on('lk:ask', (d, seat) => { if(!Link.isHost() || !d || d.what !== 'again' || !BBL.cfg || !BBL.cfg.tv) return; const over = BBL.cfg.way === 'adv' ? !!(AV && AV.over) : !!(G && G.over); if(over && Link.captain() === seat){ if(BBL.cfg.way === 'adv' && AV){ cancelAnimationFrame(AV.raf); hideResult(); } bblGo(); } });
  addEventListener('pagehide', () => { try{ if(Link.status() !== 'idle') Link.leave(); }catch(e){} });
}
// 🔗 ?page=brawlbuddies&link=<code> → the cover's 🕹️ Join with the number filled in
function bblUrl(code){ openCover(); if(!BrawlCover) return; bblOpen(BrawlCover); Link.cover.join(code); }
// ---- 📺 the TV Game Station (LinkKit plan §55c) ----
function bblStation(t){
  if(!window.Station) return false;
  if(!Station.on){ if((t | 0) < 60) setTimeout(() => bblStation((t | 0) + 1), 50); return false; }
  if(!Station.tv) return false;
  const way = Station.way === 'adv' ? 'adv' : 'ring', lv = Station.lvl == null ? 0 : Math.max(0, Math.min(4, Station.lvl));
  const go = () => { BBL.st = {way, level: lv, tale: way === 'adv' ? Math.max(0, BV.TALES.map((x, i) => i).filter(i => advTaleOpen(i)).pop() || 0) : ADV.tale, diff: ['easy', 'easy', 'normal', 'normal', 'hard'][lv] || 'normal'};
    openCover(); if(!BrawlCover) return; bblOpen(BrawlCover); Link.cover.tv(BrawlCover, BBL_ROOM); };
  if(way === 'adv') bblAdvNeed(go); else go(); return true;
}
if(window.Station) Station.game({url: WEBAPP_URL, page: 'brawlbuddies', player: () => S.player || CURRENT_PLAYER, start: () => Link.cover.start(), again: () => bblGo(),
  result: () => ((G && G.link && G.shown) || (AV && AV.link && AV.over)) ? $('result-card') : (Link.pads && Link.pads.resultCard ? Link.pads.resultCard() : null), hide: '.gf-r-btns, .go-row, .lp-cb, .lp-wait'});
GameParts.loaded('BrawlBuddies_link', 'lk-8d');
