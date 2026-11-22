
/* 📱 SCREENS (lk-9a, 📡 Multiplayer chat, Aowu 2026-11-21 16:02 "ok go" — LinkKit plan §55j + §55k): 🥊 Brawl Buddies, everyone on their OWN screen.
   The 4th choice on the 📱 sheet (BBL_ROOM screens: true). The host's phone runs the unchanged engine AND plays (= 🎮 Host + play, no TV);
   every other phone shows the SAME ring with the game's own play screen + the game's own touch pad:
     host:  bblGo() as today (seats, 📴 drop → 🤖, ⏸, saves for everyone) + Link.screens.host: base = how the match was built (level · theme ·
            seed · teams · bot styles · seats) · picture 20× a second (the 2 fighters in the ring minus fixed parts + clock / round / wins / tag slots
            + every bench buddy's ❤️) · events (handleEvents' list with the host time) · the end → bbs:end (each side's numbers) + bbs:note (each
            saved person's badges / titles, to that person's phone)
     guest: Link.pads.config onScreen → the same match from the base (bblStartMatch with the host's seed) → no engine: pictures → G.M (0.1 s behind,
            smoothed) · events → the game's own handleEvents (sounds · FX · crowd · words · 🎬 beats) · draw + hud as usual · MY pad only →
            Link.screens.pad → pdin / pdbt (the host can't tell it from a 🕹️ phone) · ▼ over my fighter · ⚡ / 🌍 pill · 🪑 bench line ·
            🏁 MY OWN result card (my side won / lost · my side's numbers · my avatar · my save notes) · ⏸ for everyone · host gone → back to the cover
   Built into BrawlBuddies_screens by Test Harness/parts/build_parts.py (+ LinkScreens) — loaded by the link part's bblOpen. 💀 Hardcore stays on one
   device. 🗺️ Brawenture own screens = bvs* below (lk-9a2, LinkKit plan §55m). */
const BBS = {on: false, H: null, Gs: null, pad: null, d: null, base: null, mine: null, last: 0, road: null, inLayout: 0, endHumans: null, end: null, notes: {}};
const BBS_SNAP = {act: 1, face: 1, ko: 1, launched: 1, st: 1, on: 1, r: 1, w: 1, actId: 1, guard: 1, done: 1, winner: 1, held: 1, grab: 1, dodge: 1, dash: 1, ctr: 1, lastTap: 1, auto: 1, combo: 1, pz: 1};
const BBS_SKIP = {avF: 1, avW: 1, ai: 1, buf: 1, seatKeys: 1, gear: 1, name: 1, robo: 1, style: 1, human: 1, robot: 1, av: 1, side: 1, i: 1, slot: 1, maxHp: 1, brain: 1};
function bbsFighter(f){ const o = {}; for(const k in f){ if(BBS_SKIP[k]) continue; const v = f[k]; if(typeof v !== 'function') o[k] = v; } return o; }
// the moving picture (host)
function bbsPic(){ const M = G.M;
  return {t: M.t, st: M.state, sT: M.stateT, r: M.round, w: M.wins.slice(), c: M.clock, cd: M.tagCd.slice(), on: [M.f[0].slot, M.f[1].slot], done: M.done, winner: M.winner,
    f: M.f.map(bbsFighter), b: M.sq.map(tm => tm.map(q => [q.hp, q.ko ? 1 : 0])), pz: G.paused ? 1 : 0}; }
function bbsOwnRoom(){ try{ return !!(Link.cover && Link.cover.state && (Link.cover.state() || {}).own); }catch(e){ return false; } }
// ======================= HOST =======================
function bbsHostStart(){
  if(!G || !G.link || G.link.way !== 'ring') return; const M = G.M; bvsHostStop();
  BBS.H = Link.screens.host({id: BBL.pads ? BBL.pads.id : G.link.id, base: {pid: BBL.pads ? BBL.pads.id : '', cfg: G.link, level: G.level, theme: G.theme, seed: M.seed0, duo: M.duo, host: S.player,
      players: M.sq.map(tm => tm.map(q => ({name: q.name, human: q.human, style: q.style || null, robo: !!q.robo})))}, pic: bbsPic});
  BBS.on = true;
}
function bbsHostStop(){ if(BBS.H){ BBS.H.stop(); BBS.H = null; } BBS.on = false; }
// every engine event list also goes to the phones (the host's own handleEvents is unchanged)
let BBS_HE = null;   // the game's own handleEvents (wrapped in bbsWire)
// the host's seed travels in the base so a phone builds the very same match (BB.newMatch picks the bot styles with it)

// 🏁 the end: each side's numbers → every phone (each phone makes its OWN card) · each saved person's notes → that person's phone
let BBS_FM = null, BBS_PN = null, BBS_LP = null, BBS_TP = null, BBS_BM = null;
function bbsFinish(){
  if(G && G.guest) return;   // a phone never ends (or saves) a match itself
  const own = !!(BBS.H && G && G.link), M = G && G.M; if(!own) return BBS_FM.apply(this, arguments);
  BBS.endHumans = M.f.filter(p => p.human).map(p => p.name);
  // the host's phone is a player too → ITS own card: my side won / lost, my avatar (the 📺 TV card names the winner instead)
  const L0 = G.link, me = L0.seats.find(s => s.local) || {side: 0}, gr = GF.result, names = [0, 1].map(s => M.sq[s].filter(f => f.human).map(f => f.name));
  GF.result = function(o){ try{ const w = M.winner, won = w === me.side, team = names[me.side].length > 1;
      o.win = won; o.icon = won ? '🏆' : w < 0 ? '🤝' : '💪'; o.title = won ? (team ? 'Your team wins!' : 'You win!') : w < 0 ? 'A draw!' : (names[w].length > 1 ? names[w].join(' + ') + ' win!' : M.f[w].name + ' wins!');
      o.buddy = {name: S.player, av: myAvatar(S.player)}; }catch(e){} return gr.apply(this, arguments); };
  G.link = null; let r;
  try{ r = BBS_FM.apply(this, arguments); } finally { G.link = L0; GF.result = gr; }
  // 🔁 tag teams: the friends on the bench at the end get their match too (wins · matches — the side's hit numbers stay with the 2 in the ring)
  const won = M.winner;
  L0.seats.forEach(s => { if(BBS.endHumans.indexOf(s.name) >= 0 || s.name === 'Guest') return; const i = BBS.endHumans.length; BBS.endHumans.push(s.name);
    saveFeatsOnly(s.name, {wins: won === s.side ? 1 : 0, matches: 1, duoWins: M.duo && won === s.side ? 1 : 0}, i); });
  { const secs = Math.max(1, Math.round((performance.now() - G.startAt) / 1000));
    Link.send('bbs:end', {id: L0.id, winner: M.winner, wins: M.wins.slice(), need: M.need, stats: M.stats, secs, names: [0, 1].map(s => M.sq[s].filter(f => f.human).map(f => f.name)), cur: [M.f[0].name, M.f[1].name], saved: BBS.endHumans, host: S.player}, {sure: true}); }
  return r; }
function bbsPutNote(i, html){ const r = BBS_PN.apply(this, arguments);
  try{ const nm = BBS.endHumans && BBS.endHumans[i]; const s = nm && G && G.link && G.link.seats.find(x => x.name === nm && !x.local); if(s) Link.send('bbs:note', {name: nm, html}, {sure: true, to: s.lseat}); }catch(e){}
  return r; }
// ======================= GUEST =======================
function bbsOnScreen(d){
  if(G && G.guest && BBS.d && BBS.d.id === d.id){ BBS.d = d; return; }   // the same match (a 🔁 rejoin) → carry on, the base comes again
  BBS.d = d;
  if(!BBS.Gs) BBS.Gs = Link.screens.guest({delay: 100, onBase: base => bbsBuild(base), apply: (a, b, u, lerp) => bbsApply(a, b, u, lerp), onEvents: list => bbsEvents(list)});
}
function bbsBuild(base){
  if(base && base.adv) return bvsBuild(base);
  bvsGuestOff();
  if(!BBS.d || !base || !base.cfg || base.pid !== BBS.d.id) return;   // the base of THIS match (LinkPads' match id)
  if(G && G.guest && G.link && G.link.id === base.cfg.id) return;   // already built (a resent base)
  BBS.base = base; BBS.end = null; BBS.notes = {};
  const cfg = Object.assign({}, base.cfg, {seats: base.cfg.seats.map(s => Object.assign({}, s, {local: s.g === BBS.d.g}))});   // my seat = this phone's own pad (the 🎮 host + play path)
  BBL.cfg = cfg; BBS.mine = cfg.seats.find(s => s.g === BBS.d.g);
  const teams = base.players.map(tm => tm.map(q => ({name: q.name, human: q.human})));
  const dn = Date.now; Date.now = () => (base.seed ^ 0x2b) & 0xffffff;   // bblStartMatch's own seed line → the host's seed
  try{ if(G) cancelAnimationFrame(G.raf); hideResult(); bblStartMatch({level: base.level, duo: base.duo, players: [teams[0][0], teams[1][0]], teams, theme: base.theme}); } finally { Date.now = dn; }
  if(!G) return; cancelAnimationFrame(G.raf);
  G.M.sq.forEach((tm, i) => tm.forEach((q, j) => { const b = base.players[i][j]; if(b){ q.style = b.style; q.robo = b.robo; } }));
  G.guest = {g: BBS.d.g, side: BBS.mine.side, slot: BBS.mine.slot, host: base.host}; G.link = cfg;
  layoutPlay(); bbsRoadPill();
  if(BBS.pad) BBS.pad.stop(); BBS.pad = Link.screens.pad(BBS.d); BBS.last = performance.now();
  const loop = now => { if(!G || !G.guest) return; const dt = Math.min(0.05, Math.max(0, (now - BBS.last) / 1000)); BBS.last = now;
    bbsSendPad(); if(!G.paused){ G.t += dt; stepFx(dt); if(G.hitstop > 0) G.hitstop -= dt; }
    draw(); bbsMark(); hud(); G.raf = requestAnimationFrame(loop); };
  G.raf = requestAnimationFrame(loop);
}
function bbsApply(a, b, u, lerp){
  if(a && a.m) return bvsApply(a, b, u, lerp);
  if(!G || !G.guest) return; const M = G.M, P = lerp(a, b, u, BBS_SNAP);
  M.t = P.t; M.state = P.st; M.stateT = P.sT; M.round = P.r; M.wins = P.w; M.clock = P.c; M.tagCd = P.cd; M.done = !!P.done; M.winner = P.winner;
  [0, 1].forEach(s => { const q = M.sq[s][P.on[s]] || M.sq[s][0]; M.f[s] = q; const src = P.f[s]; for(const k in src) q[k] = src[k]; });
  (P.b || []).forEach((tm, s) => tm.forEach((x, j) => { const q = M.sq[s][j]; if(q && q !== M.f[s]){ q.hp = x[0]; q.ko = !!x[1]; } }));
  if(!!P.pz !== !!G.paused){ G.paused = !!P.pz; UI.pauseIcon($('pause-btn'), G.paused); }
}
// the game's own sounds / FX / crowd / words — without the 📡 link's phone buzz (that is for 🕹️ controllers)
function bbsEvents(list){ if(bvsGuest()) return bvsGuestEvents(list); if(!G || !G.guest) return; const L0 = G.link; G.link = null; try{ BBS_HE(list); } finally { if(G) G.link = L0; } }
// only MY pad on this phone (the game builds one pad as player 1 → it becomes MY side's pad; the link part keeps only this device's side)
function bbsLayout(){ const M = G.M, keep = M.f.map(p => p.human), mine = BBS.mine && G.guest ? BBS.mine : (G.link.seats || []).find(s => s.local); if(!mine) return BBS_LP();
  const side = mine.side; M.f.forEach(p => { p.human = p.i === side; }); mine.side = 0;
  try{ BBS_LP(); } finally { M.f.forEach((p, i) => { p.human = keep[i]; }); mine.side = side; }
  document.querySelectorAll('#scr-play .ctl, #scr-play .ctl [data-p]').forEach(e => { e.dataset.p = side; });
  if(G.guest) document.querySelectorAll('#scr-play .tb').forEach(btn => { const k = btn.dataset.a === 'block' ? 'boop' : btn.dataset.a;
    btn.addEventListener('pointerdown', () => { if(BBS.pad && G && G.guest && !G.paused) BBS.pad.btn(k, true); }, true);
    ['pointerup', 'pointercancel'].forEach(t => btn.addEventListener(t, () => { if(BBS.pad) BBS.pad.btn(k, false); }, true)); });
  requestAnimationFrame(bbsFit);
}
function bbsLayoutPlay(){ if(G && G.link && (G.guest || BBS.on) && !BBS.inLayout){ BBS.inLayout = 1; try{ return bbsLayout(); } finally { BBS.inLayout = 0; } } return BBS_LP.apply(this, arguments); }
// the 🌸 ring with 🔁 Swap (6 petals) is wider than a 360 px phone (the lk-9p look test) — it scales down from its corner until it fits
function bbsFit(){ const W = innerWidth, Hh = innerHeight; document.querySelectorAll('#scr-play .tbtns.pz-fan').forEach(fan => { fan.style.transform = ''; const r = fan.getBoundingClientRect(); let k = 1;
  fan.querySelectorAll('.tb').forEach(b => { const q = b.getBoundingClientRect(); if(q.right > W - 4) k = Math.min(k, (W - 4 - r.left) / Math.max(1, q.right - r.left)); if(q.bottom > Hh - 2) k = Math.min(k, (Hh - 2 - r.top) / Math.max(1, q.bottom - r.top)); });
  if(k < 1){ fan.style.transformOrigin = '0 0'; fan.style.transform = 'scale(' + Math.max(0.7, k).toFixed(3) + ')'; } }); }
// presses on the shadow match go nowhere (the host's engine decides)

function bbsSendPad(){ const st = G.pads[0] || G.pads[1]; if(!BBS.pad || !st) return; const x = st.r ? 1 : st.l ? -1 : 0, y = st.d ? 1 : st.u ? -1 : 0;
  BBS.pad.stick(x, y, st.u ? 'u' : st.d ? 'd' : st.l ? 'l' : st.r ? 'r' : null); BBS.pad.btn('bonk', !!(G.tbHold[0] || G.tbHold[1])); }
// ⏸ on a phone = ⏸ for everyone (the host decides) · the host's ⏸ shows here
function bbsTogglePause(){ if(G && G.guest){ if(BBS.pad && !G.M.done) BBS.pad.pause(!G.paused); return; } return BBS_TP.apply(this, arguments); }
function bbsPauseLine(on, by){ if(bvsGuest()){ advBanner(on ? '⏸ ' + (by || BVS.base.host) + ' paused' : '▶ ' + (by || BVS.base.host) + ' — go, heroes!', 'good'); return; } if(!G || !G.guest) return; G.paused = on; UI.pauseIcon($('pause-btn'), on); banner(on ? '⏸ ' + (by || BBS.base.host) + ' paused' : '▶ ' + (by || BBS.base.host) + ' — bonk!', 'good'); }
// ▼ my fighter (my side's colour) — the other phones / the host say names, never "You"
function bbsMark(){ const V = G.V, me = BBS.mine; if(!V || !me || G.M.done) return; const f = G.M.f[me.side]; if(bbsBench()) return;
  const cv = $('cv'), g = cv.getContext('2d'); g.save(); g.setTransform(DPR, 0, 0, DPR, 0, 0);
  const x = V.X(f.x), bob = Math.sin((G.t || 0) * 5) * 3, y = V.Y(Math.max(0, f.y) + 2.25) - 26 + bob, k = Math.max(7, Math.min(11, V.s * 0.11));
  g.fillStyle = BBL_COL[me.side]; g.strokeStyle = '#fff'; g.lineWidth = 2.5; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x - k, y - k * 1.1); g.lineTo(x + k, y - k * 1.1); g.lineTo(x, y + k * 0.4); g.closePath(); g.stroke(); g.fill(); g.restore(); }
function bbsBench(){ const me = BBS.mine, M = G && G.M; if(!me || !M) return false; const f = M.f[me.side], b = BBL.cfg && BBL.cfg.borrow;
  return M.sq[me.side][me.slot] !== f && !(b && b.by === me.g && M.sq[b.side][b.slot] === f); }
// ⚡ / 🌍 the road pill (top-left of the ring) — host: every phone · phone: mine + 🪑 bench
function bbsRoadPill(){ let el = document.getElementById('bbs-road'); if(!el){ el = document.createElement('div'); el.id = 'bbs-road'; el.className = 'bbs-road'; document.getElementById('scr-play').appendChild(el); }
  const paint = () => { if(!el.isConnected) return; if(!G || !G.link || !(G.guest || BBS.on) || G.over){ el.style.display = 'none'; return; } el.style.display = '';
    const st = document.getElementById('stage'); if(st){ const r = st.getBoundingClientRect(); el.style.top = Math.round(r.top + 6) + 'px'; el.style.left = Math.round(r.left + 8 + (G.sideL || 0)) + 'px'; }
    if(G.guest){ const r = Link.screens.road(), bench = bbsBench(), f = G.M.f[BBS.mine.side];
      el.textContent = r.icon + ' ' + (r.ms != null ? r.ms + ' ms' : r.word) + (bench ? ' · 🪑 ' + f.name + ' is in — 🔁 Swap = tag in!' : ' · 📱 ' + BBS.base.host + '\'s game'); el.className = 'bbs-road ' + r.k + (bench ? ' bench' : ''); }
    else { el.textContent = G.link.seats.filter(s => !s.local).map(s => { const r = Link.screens.road(s.lseat); return r.icon + ' ' + s.name + (r.ms != null ? ' ' + r.ms : ''); }).join(' · '); el.className = 'bbs-road host'; } };
  paint(); clearInterval(BBS.road); BBS.road = setInterval(paint, 1000); }
// 🏁 MY OWN result card: my side won / lost · my side's numbers · my avatar · my save notes (the host saves for everyone)
function bbsEnd(d){
  if(!G || !G.guest || !G.link || d.id !== G.link.id || G.over) return; BBS.end = d; G.over = true; G.shown = true;
  setTimeout(() => { if(G && G.guest && BBS.end === d) bbsCard(d); }, 900);
}
function bbsCard(d){
  if(window.UI && UI.callout) UI.callout.setup(null);
  const me = BBS.mine, s = me.side, w = d.winner, won = w === s, draw = w < 0, x = d.stats[s] || {}, team = (d.names[s] || []).length > 1;
  const wn = w >= 0 ? ((d.names[w] || []).length > 1 ? d.names[w].join(' + ') : d.cur[w]) : '';
  UISound.play(won ? 'success' : 'error');
  const saved = (d.saved || []).indexOf(S.player) >= 0;
  const L0 = G.link; G.link = null;   // the 📡 link's card wrapper names the WINNER — this card is MINE
  try{ GF.result({wrap: $('result'), card: $('result-card'), win: won, icon: won ? '🏆' : draw ? '🤝' : '💪', title: won ? (team ? 'Your team wins!' : 'You win!') : draw ? 'A draw!' : wn + ' win' + ((d.names[w] || []).length > 1 ? '' : 's') + '!',
    sub: won ? '' : '💪 Good fight — ' + (team ? 'tag in more often and keep the 🔥 combos going' : 'boop first, then bonk'), stars: null, score: null,
    stats: [['🥊', d.wins[s] + ' – ' + d.wins[1 - s] + ' rounds'], ['👊', (x.hits || 0) + ' bonks'], ['🔥', 'best combo ' + (x.bestCombo || 0)], ['🌟', (x.juggle || 0) + ' bounces'], ['🚀', (x.uppers || 0) + ' uppercuts'], ['🛡️', (x.blocks || 0) + ' blocks'], ['⏱', fmtS(d.secs)]],
    save: saved ? '⏳ ' + d.host + ' saves it for you…' : null, buddy: {name: S.player, av: myAvatar(S.player)}, comic: false, confetti: won,
    levels: () => {}, again: () => {}, extra: []}); } finally { G.link = L0; }
  const row = $('result-card').querySelector('.gf-r-btns');
  if(row){ row.innerHTML = '<button class="btn sp-btn sp-primary" id="bbs-wait" data-sound="none" disabled>⏳ ' + UI.esc(d.host) + ' starts the next one</button><button class="btn soft sp-btn sp-secondary" id="bbs-room" data-sound="none">◀ Room</button><button class="btn soft sp-btn sp-secondary" id="bbs-exit" data-sound="none">🚪 Leave</button>';
    $('bbs-room').onclick = () => { UISound.play('tap'); bbsGuestOff(); hideResult(); backToMenu(); openCover(); if(BrawlCover) Link.cover.show(BrawlCover); };
    $('bbs-exit').onclick = () => { UISound.play('tap'); try{ Link.leave(); }catch(e){} bbsGuestOff(); hideResult(); backToMenu(); }; }
  const n = BBS.notes[S.player]; if(n) bbsNote(n);
  try{ cheerFaces(); }catch(e){}
}
function bbsNote(html){ const n = $('save-note'); if(n) n.innerHTML = html; }
function bbsGuestOff(){ if(BBS.pad){ BBS.pad.stop(); BBS.pad = null; } if(G && G.guest){ cancelAnimationFrame(G.raf); G.guest = null; G.link = null; } BBS.d = null; clearInterval(BBS.road); const el = document.getElementById('bbs-road'); if(el) el.remove(); }
// leaving the play screen on a phone = this seat goes quiet (the host's 🤖 plays it) · the host stops sending when its match ends
function bbsBackToMenu(){ if(G && G.guest) bbsGuestOff(); else if(BBS.H){ bbsHostStop(); const el = document.getElementById('bbs-road'); if(el) el.remove(); } return BBS_BM.apply(this, arguments); }
// ---------- wire (once, when the room is opened from the cover) ----------
const BBS_CSS = '.bbs-road{position:fixed;z-index:6;font:800 11.5px/1 Nunito,sans-serif;padding:5px 10px;border-radius:999px;background:rgba(20,14,36,.72);color:#BFF7CF;border:1.5px solid rgba(124,242,156,.6);pointer-events:none;white-space:nowrap;max-width:92vw;overflow:hidden;text-overflow:ellipsis}.bbs-road.server{color:#BFEAFF;border-color:rgba(159,227,255,.6)}.bbs-road.bench{color:#FFE7A3;border-color:rgba(255,200,69,.75)}.bbs-road.host{color:#fff;border-color:rgba(255,255,255,.4)}';
function bbsWire(){
  if(BBS.wired || !(window.Link && Link.pads && Link.screens)) return; BBS.wired = true;
  bbmWire();   // 🪞 lk-9a3: every phone = the left fighter
  // wraps (installed once, when the room opens — the top level only DEFINES, so the inline page = the site page until then)
  BBS_HE = handleEvents; handleEvents = function(list){ if(BBS.H && G && G.link && !G.guest && list && list.length) BBS.H.event(list); return BBS_HE.apply(this, arguments); };
  const nm = BB.newMatch; BB.newMatch = function(o){ const M = nm.apply(this, arguments); M.seed0 = o.seed; return M; };   // the host's seed travels in the base
  BBS_FM = finishMatch; finishMatch = bbsFinish; BBS_PN = putNote; putNote = bbsPutNote; BBS_LP = layoutPlay; layoutPlay = bbsLayoutPlay;
  BBS_TP = togglePause; togglePause = bbsTogglePause; BBS_BM = backToMenu; backToMenu = bbsBackToMenu;
  ['press', 'setCtrl', 'setHold', 'setBlock'].forEach(fn => { const f0 = BB[fn]; BB[fn] = function(M){ if(G && G.guest && M === G.M) return false; return f0.apply(this, arguments); }; });   // presses on a phone's copy go nowhere
  const st = document.createElement('style'); st.id = 'bbs-css'; st.textContent = BBS_CSS; (document.head || document.documentElement).appendChild(st);
  Link.pads.config({onScreen: d => bbsOnScreen(d), onScreenPause: (on, by) => bbsPauseLine(on, by)});   // the phone sees the game's own words — buzz lines are for 🕹️ controllers
  Link.on('bbs:end', d => bbsEnd(d));
  Link.on('bbs:note', d => { if(!d || d.name !== S.player) return; BBS.notes[d.name] = d.html; if(BBS.end) bbsNote(d.html); });
  bvsWire();
  Link.on('hostleft', () => { if(G && G.guest){ const h = BBS.base ? BBS.base.host : 'The host'; bbsGuestOff(); hideResult(); backToMenu(); openCover(); UI.toast('👋 ' + h + ' ended the game'); } });
  const go0 = bblGo; bblGo = function(){
    const own = bbsOwnRoom(); bbsHostStop();
    const sc = Link.pads.screen; if(own) Link.pads.screen = o => sc(Object.assign({}, o, {screen: true}));
    try{ go0.apply(this, arguments); } finally { Link.pads.screen = sc; }
    if(own && G && G.link && G.link.way === 'ring'){ bbsHostStart(); layoutPlay(); bbsRoadPill(); } };
}
/* ======================= 🗺️ BRAWENTURE on own screens (lk-9a2, Aowu 2026-11-21 19:15 "ok" = all ⭐ — LinkKit plan §55m) =======================
   The ring's recipe on the street: the host's phone runs the unchanged Brawenture part (BrawlBuddies_adv, only wrapped) AND plays; every phone
   builds the SAME run from the host's seed (startAdv) and never steps BV — pictures overwrite the moving parts, events go through advEvents.
   NEW for the street: one picture base per MAP (a new LinkScreens host id <run>.<map>, events sent after it) · bodies matched by the host's id ·
   📷 each phone its OWN camera on its own hero inside the run's 11 m window (the TV's) + ◀ friend tags + ▼ over me · 📖 / 🍹 / 💍 cards on every
   phone, a tap goes to the host (bvs:ui) · 🏁 each phone its OWN card (bvs:end + bvs:note). The lk-8d room (seats, 📴 drop → 🤖, ⏸, saves) is unchanged. */
const BVS = {H: null, run: null, mine: null, pad: null, last: 0, byId: new Map(), cam: null, own: true, mi: -1, end: null, base: null, notes: {}, restKey: '', wired: false, advWired: false};
const BVS_SKIP = {tale: 1, map: 1, D: 1, rng: 1, ev: 1, stats: 1, avF: 1, ring: 1, glove: 1, ai: 1, buf: 1, hero: 1, seat: 1, maxHp: 1, st: 1, tap: 1, joined: 1, name: 1, human: 1,
  F: 1, ctrl: 1, hold: 1, pend: 1, lastTap: 1, blockTap: 1, kbx: 1, brain: 1, linkAuto: 1, seed0: 1};
const BVS_LOCAL = {avF: 1, ring: 1, glove: 1, name: 1, human: 1, F: 1, maxHp: 1, hero: 1, seat: 1, st: 1, foe: 1};
function bvsGuest(){ return typeof AV !== 'undefined' && !!AV && !!AV.guest; }
function bvsR2(v){ return Math.round(v * 100) / 100; }
function bvsSlim(v, seen){
  if(typeof v === 'function') return undefined; if(typeof v === 'number') return bvsR2(v); if(v === null || typeof v !== 'object') return v;
  if(seen.has(v)) return {ref: v.i}; seen.add(v);
  let o; if(Array.isArray(v)) o = v.map(x => bvsSlim(x, seen)); else { o = {}; for(const k in v){ if(BVS_SKIP[k]) continue; const c = bvsSlim(v[k], seen); if(c !== undefined) o[k] = c; } }
  seen.delete(v); return o; }
// ---------- HOST ----------
function bvsPic(){ const M = AV.M, bf = M.bossF;
  return {a: {st: AV.story ? 1 : 0, pz: AV.paused ? 1 : 0, ov: AV.over ? 1 : 0, tr: AV.trans > 0 ? bvsR2(AV.trans) : 0, hold: AV.hold ? 1 : 0},
    m: bvsSlim(Object.assign({}, M, {bossF: bf ? {ref: bf.i} : null, bosses: (M.bosses || []).map(b => ({ref: b.i}))}), new WeakSet())}; }
function bvsHostStart(){
  bbsHostStop(); bvsHostStop(); if(typeof AV === 'undefined' || !AV || !AV.link || !BBL.pads) return; const M = AV.M, T = M.tale;
  M.view = BV.VIEW;   // 📷 the run's window = the TV's 11 m, whatever the host phone holds (each phone draws its own part of it)
  BBS.endHumans = null;
  BVS.base = {pid: BBL.pads.id, adv: 1, run: AV.link.id, cfg: AV.link, tale: M.ti, diff: M.diff, seed: M.seed0, heroes: M.heroes.map(h => ({name: h.name, human: h.human || !!h.linkAuto})),
    captive: AV.capName || M.captive, prisoner: T.prisoner ? M.prisoner : '', host: S.player, view: M.view};
  BVS.mi = M.mapI; BVS.H = Link.screens.host({id: AV.link.id + '.' + M.mapI, base: BVS.base, pic: bvsPic});
  bvsRoadPill(); }
function bvsHostStop(){ if(BVS.H){ const h = BVS.H; BVS.H = null; if(Link.screens.hostOn()) h.stop(); } const el = document.getElementById('bvs-road'); if(el && !bvsGuest()) el.remove(); }
// a new map = a new picture base: start the new host id FIRST, then its events (a fresh base empties a phone's event list)
function bvsHostEvents(list){ if(!BVS.H || !list || !list.length || bvsGuest()) return;
  if(list.some(e => e.k === 'map') && AV.M.mapI !== BVS.mi){ BVS.mi = AV.M.mapI; BVS.H = Link.screens.host({id: AV.link.id + '.' + AV.M.mapI, base: BVS.base, pic: bvsPic}); }
  BVS.H.event(list); }
// each saved hero's notes → that hero's phone
function bvsNoteTo(seat, html){ try{ const s = BVS.H && AV && AV.link && AV.link.seats.find(x => x.hero === seat && !x.local); if(s) Link.send('bvs:note', {name: s.name, html}, {sure: true, to: s.lseat}); }catch(e){} }
function bvsHostEnd(win){ const M = AV.M;
  Link.send('bvs:end', {run: AV.link.id, win, score: M.score, kos: M.kos, found: M.found, secs: Math.round(M.t), stars: BV.starsFor(M), captive: M.captive, noCap: !!M.tale.noCaptive, ending: M.ending || '', host: S.player,
    heroes: M.heroes.map(h => ({name: h.name, kos: (h.st && h.st.kos) || 0, hits: (h.st && h.st.hits) || 0, clash: (h.st && h.st.clash) || 0}))}, {sure: true}); }
// a phone's tap on a 🍹 / 💍 card → the host's engine (first tap wins; the picture shows everyone)
function bvsUi(d){ if(!BVS.H || typeof AV === 'undefined' || !AV || !d || ['buyCard', 'restReady', 'chooseEnding'].indexOf(d.fn) < 0) return;
  BV[d.fn](AV.M, d.v); advEvents(BV.takeEvents(AV.M)); if(d.fn === 'restReady') advRestHide(); else if($('adv-rest')) advRestShow(); }
// ---------- PHONE ----------
function bvsBuild(base){
  if(!BBS.d || !base || base.pid !== BBS.d.id) return;
  if(bvsGuest() && BVS.run === base.run) return;   // a new map = a new picture base for the same run
  if(typeof advPartReady === 'function' && !advPartReady()) return advNeed(() => bvsBuild(base));   // 🗺️ the Brawenture part comes on demand
  bvsWireAdv(); if(G && G.guest) bbsGuestOff();
  const mine = base.cfg.seats.find(s => s.g === BBS.d.g); if(!mine) return;
  BVS.run = base.run; BVS.byId.clear(); BVS.end = null; BVS.cam = null; BVS.base = base; BVS.mine = mine; BVS.notes = {}; BVS.restKey = '';
  const cfg = Object.assign({}, base.cfg, {seats: base.cfg.seats.map(s => Object.assign({}, s, {local: s.g === BBS.d.g}))}); BBL.cfg = cfg; cfg.starting = true;
  const keep = {tale: ADV.tale, diff: ADV.diff}; ADV.tale = base.tale; ADV.diff = base.diff;
  const dn = Date.now; Date.now = () => (base.seed ^ 0x51) & 0xffffff;   // startAdv's own seed line → the host's seed → the very same street
  try{ if(AV) cancelAnimationFrame(AV.raf); hideResult(); if(BrawlCover) BrawlCover.hide(); startAdv(base.heroes.map(h => ({name: h.name, human: h.human})), base.captive, base.prisoner ? {prisoner: base.prisoner} : null); }
  finally { Date.now = dn; cfg.starting = false; ADV.tale = keep.tale; ADV.diff = keep.diff; }
  if(!AV) return; cancelAnimationFrame(AV.raf);
  AV.link = cfg; AV.guest = {g: BBS.d.g, hero: mine.hero, host: base.host};
  layoutAdv(); AV.M.view = base.view;
  const go = $('story-go'); if(go) go.onclick = () => { bvsTap('boop'); go.disabled = true; go.textContent = '⏳ ' + base.host + ' starts…'; };
  if(BVS.pad) BVS.pad.stop(); BVS.pad = Link.screens.pad(BBS.d); BVS.last = performance.now(); bvsRoadPill();
  const loop = now => { if(!bvsGuest()) return; const dt = Math.min(0.05, Math.max(0, (now - BVS.last) / 1000)); BVS.last = now;
    bvsSendPad(); if(!AV.paused){ AV.t += dt; advStepFx(dt); } advDraw(); advHud(); AV.raf = requestAnimationFrame(loop); };
  AV.raf = requestAnimationFrame(loop); }
function bvsTap(k){ if(!BVS.pad) return; BVS.pad.btn(k, true); setTimeout(() => { if(BVS.pad) BVS.pad.btn(k, false); }, 120); }
function bvsSendPad(){ const st = AV.pads[0] || {}, H = AV.held, K = (typeof KEYS !== 'undefined' ? KEYS : []).slice(0, 2), on = k => K.some(x => H.has(x[k]));
  const l = st.l || on('left'), r = st.r || on('right'), u = st.u || on('jump'), d = st.d || on('duck');
  if(BVS.pad) BVS.pad.stick(r ? 1 : l ? -1 : 0, d ? 1 : u ? -1 : 0, u ? 'u' : d ? 'd' : l ? 'l' : r ? 'r' : null); }
function bvsKey(e, on){ if(!bvsGuest() || !BVS.pad || e.repeat) return; const K = (typeof KEYS !== 'undefined' ? KEYS : []).slice(0, 2);
  [['boop', 'boop'], ['bonk', 'bonk'], ['power', 'power'], ['dodge', 'jump']].forEach(([key, a]) => { if(K.some(x => x[key] === e.code)) BVS.pad.btn(a, on); }); }
function bvsBody(src){ let o = BVS.byId.get(src.i); if(!o){ o = {}; BVS.byId.set(src.i, o); }
  for(const k in o) if(!(k in src) && !BVS_LOCAL[k]) delete o[k]; Object.assign(o, src); if(o.type && BV.FOES[o.type]){ o.F = BV.FOES[o.type]; o.foe = true; } return o; }
function bvsToMap(i){ const M = AV.M; M.mapI = i; M.map = M.tale.maps[i]; M.len = M.map.len; BVS.byId.clear(); BVS.cam = null; }
function bvsApply(a, b, u, lerp){
  if(!bvsGuest()) return; const M = AV.M, P = bvsMix(a, b, u), m = P.m;
  if(m.mapI !== M.mapI) bvsToMap(m.mapI);
  for(const k in m){ if(k === 'heroes' || k === 'foes' || k === 'bosses' || k === 'bossF' || k === 'mapI') continue; M[k] = m[k]; }
  (m.heroes || []).forEach((src, k) => { const h = M.heroes[k]; if(h) for(const q in src) h[q] = src[q]; });
  M.foes = (m.foes || []).map(bvsBody);
  M.bosses = (m.bosses || []).map(r => BVS.byId.get(r.ref)).filter(Boolean); M.bossF = m.bossF ? BVS.byId.get(m.bossF.ref) || null : null;
  const A = P.a; AV.trans = A.tr; AV.hold = !!A.hold;
  if(!A.st && AV.story){ const d = $('adv-story'); if(d) d.remove(); AV.story = false; advBanner('🗺️ ' + M.map.name + ' — go right ➡️', 'good'); }
  if(!!A.pz !== !!AV.paused && !AV.story){ AV.paused = !!A.pz; UI.pauseIcon($('adv-pause'), AV.paused); }
  const Pz = M.puzzle, rest = !!(Pz && Pz.k === 'outbreak' && Pz.state === 'rest');
  if(!rest && $('adv-rest')){ advRestHide(); BVS.restKey = ''; } else if(rest){ const key = Pz.wave + '|' + Pz.bought + '|' + M.coins; if(key !== BVS.restKey){ BVS.restKey = key; advRestShow(); } } }
// the NEWEST picture whole (a puzzle / boss / map that just started never mixes with the old one) · only positions glide between the two
function bvsMix(a, b, u){ const ma = a.m || {}, mb = b.m, L = (x, y) => typeof x === 'number' && typeof y === 'number' ? x + (y - x) * u : y;
  const glide = (p, q) => q ? Object.assign({}, p, {x: L(q.x, p.x), y: L(q.y, p.y), z: L(q.z, p.z)}) : p, byI = {}; (ma.foes || []).forEach(f => { byI[f.i] = f; });
  return {a: b.a, m: Object.assign({}, mb, {t: L(ma.t, mb.t), cam: L(ma.cam, mb.cam), heroes: (mb.heroes || []).map((h, k) => glide(h, (ma.heroes || [])[k])), foes: (mb.foes || []).map(f => glide(f, byI[f.i]))})}; }
function bvsGuestEvents(list){ (list || []).forEach(e => { if(e.k === 'map' && e.i !== AV.M.mapI) bvsToMap(e.i); });   // the new map's name / HUD before its banner
  const L = (list || []).filter(e => e.k !== 'win' && e.k !== 'lose'); return L.length ? advEvents(L) : undefined; }   // the end = the host's bvs:end → MY card (a phone never ends or saves a run)
function bvsGuestOff(){ if(BVS.pad){ BVS.pad.stop(); BVS.pad = null; } if(bvsGuest()){ cancelAnimationFrame(AV.raf); AV.guest = null; } BVS.run = null; const el = document.getElementById('bvs-road'); if(el) el.remove(); }
// 📷 own camera: each phone shows ITS width of the run's window, following its own hero (the host phone too) · ◀ friends at the edge · ▼ over me
function bvsMe(){ if(bvsGuest()) return AV.guest.hero; const s = BVS.H && AV.link && AV.link.seats.find(x => x.local); return s ? s.hero : -1; }
function bvsDraw(fn){
  const M = AV.M, k = bvsMe(), me = k >= 0 ? M.heroes[k] : null; if(!me || !BVS.own) return fn();
  const hv = M.view, hc = M.cam, v = Math.min(hv, advViewW());
  if(v >= hv - 0.05){ fn(); bvsEdges(v, k); return; }
  const lo = hc - hv / 2 + v / 2, hi = hc + hv / 2 - v / 2, want = Math.max(lo, Math.min(hi, me.x + me.face * 0.8));
  BVS.cam = BVS.cam == null ? want : BVS.cam + (want - BVS.cam) * 0.12; BVS.cam = Math.max(lo, Math.min(hi, BVS.cam));
  M.view = v; M.cam = BVS.cam; try{ fn(); bvsEdges(v, k); } finally { M.view = hv; M.cam = hc; } }
function bvsEdges(v, me){
  const M = AV.M, cv = $('acv'); if(!cv) return; const g = cv.getContext('2d'), W = cv.width / DPR, H = cv.height / DPR, lo = M.cam - v / 2, hi = M.cam + v / 2;
  g.save(); g.setTransform(DPR, 0, 0, DPR, 0, 0); g.font = '800 12px Nunito, sans-serif'; g.textBaseline = 'middle';
  M.heroes.forEach((h, k) => { if(h.x >= lo - 0.2 && h.x <= hi + 0.2) return; const L = h.x < lo, txt = (L ? '◀ ' : '') + h.name + (h.ko ? ' 💫' : '') + (L ? '' : ' ▶'), w = g.measureText(txt).width + 16, y = H * 0.42 + k * 22, x = L ? 6 : W - 6 - w;
    g.fillStyle = 'rgba(20,14,36,.78)'; g.strokeStyle = ADV_SEAT[k % 4]; g.lineWidth = 2; g.beginPath(); if(g.roundRect) g.roundRect(x, y - 10, w, 20, 10); else g.rect(x, y - 10, w, 20); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.fillText(txt, x + 8, y); });
  const h = M.heroes[me], V = advView(cv.width, cv.height);
  if(h && !h.ko && !AV.over){ const s = 8, x = V.sx(h.x) / DPR, y = Math.max(s + 6, (V.gy(h.z) - (h.y + 2.3) * V.s * V.ks(h.z)) / DPR + Math.sin(AV.t * 5) * 3);
    g.fillStyle = ADV_SEAT[me % 4]; g.strokeStyle = '#fff'; g.lineWidth = 2.5; g.lineJoin = 'round'; g.beginPath(); g.moveTo(x - s, y - s); g.lineTo(x + s, y - s); g.lineTo(x, y + s * 0.5); g.closePath(); g.stroke(); g.fill(); }
  g.restore(); }
// 🌸 the ring's petals stay on a 360 px phone (the 🥊 ring's bbsFit rule)
function bvsFit(){ const W = innerWidth, Hh = innerHeight; document.querySelectorAll('#scr-advplay .tbtns.pz-fan').forEach(fan => { fan.style.transform = ''; const r = fan.getBoundingClientRect(); let k = 1;
  fan.querySelectorAll('.tb').forEach(b => { const q = b.getBoundingClientRect(); if(q.right > W - 4) k = Math.min(k, (W - 4 - r.left) / Math.max(1, q.right - r.left)); if(q.bottom > Hh - 2) k = Math.min(k, (Hh - 2 - r.top) / Math.max(1, q.bottom - r.top)); });
  if(k < 1){ fan.style.transformOrigin = '0 0'; fan.style.transform = 'scale(' + Math.max(0.7, k).toFixed(3) + ')'; } }); }
// ⚡ / 🌍 the road pill (top-left of the street) — host: every phone · phone: mine
function bvsRoadPill(){ let el = document.getElementById('bvs-road'); const scr = document.getElementById('scr-advplay'); if(!scr) return;
  if(!el){ el = document.createElement('div'); el.id = 'bvs-road'; el.className = 'bbs-road'; scr.appendChild(el); }
  const paint = () => { if(!el.isConnected) return clearInterval(BVS.road); const on = bvsGuest() || (BVS.H && AV && AV.link); if(!on || AV.over){ el.style.display = 'none'; return; } el.style.display = '';
    const st = document.getElementById('adv-stage'); if(st){ const r = st.getBoundingClientRect(); el.style.top = Math.round(r.top + 6) + 'px'; el.style.left = Math.round(r.left + 8) + 'px'; }
    if(bvsGuest()){ const r = Link.screens.road(); el.textContent = r.icon + ' ' + (r.ms != null ? r.ms + ' ms' : r.word) + ' · 📱 ' + BVS.base.host + '\'s game'; el.className = 'bbs-road ' + r.k; }
    else { el.textContent = AV.link.seats.filter(s => !s.local).map(s => { const r = Link.screens.road(s.lseat); return r.icon + ' ' + s.name + (r.ms != null ? ' ' + r.ms : ''); }).join(' · '); el.className = 'bbs-road host'; } };
  paint(); clearInterval(BVS.road); BVS.road = setInterval(paint, 1000); }
// 🏁 MY card: the game's own result look + MY line (my bonked · my hits · my combos) · ⏳ the host saves + starts the next one
function bvsEnd(d){ if(!bvsGuest() || d.run !== BVS.run || BVS.end) return; BVS.end = d; AV.over = true; setTimeout(() => { if(bvsGuest() && BVS.end === d) bvsCard(d); }, d.win ? 700 : 1000); }
function bvsCard(d){
  const M = AV.M, me = d.heroes[AV.guest.hero] || {}, k = AV.guest.hero, st = ADV_STORIES[M.ti] || ADV_STORIES[0], who = UI.esc(d.captive || 'Teddy');
  const line = d.win ? (d.ending && st[d.ending] ? st[d.ending] : st.win).replace('{who}', d.captive).replace('{royal}', M.royal ? BV.FOES[M.royal].name : '') : '';
  const note = BVS.notes[S.player] || '⏳ ' + UI.esc(d.host) + ' saves it for you…';
  UISound.play(d.win ? 'success' : 'error');
  showResult((d.win ? '<div class="big">🎉</div><h2 class="cheer">' + (d.noCap ? 'The town is saved!' : who + ' is rescued!') + '</h2><div class="note bvs-story">' + UI.esc(line) + '</div><div style="font-size:1.6rem;margin:4px 0">' + '⭐'.repeat(d.stars) + '<span style="opacity:.25">' + '⭐'.repeat(3 - d.stars) + '</span></div>'
      : '<div class="big">💫</div><h2>Out of comebacks…</h2><div class="note">So close — try again together!</div>') +
    '<div class="note bvs-me"><b style="color:' + ADV_SEAT[k % 4] + '">● ' + UI.esc(BVS.mine.name) + '</b> · 😈 ' + me.kos + ' bonked · 👊 ' + me.hits + ' hits' + (me.clash ? ' · ⚔️ ' + me.clash + ' combos' : '') + '</div>' +
    '<div class="note">🧑‍🤝‍🧑 Team · 🏆 ' + Number(d.score || 0).toLocaleString() + ' · 🧸 ' + d.found + ' / 3 · ⏱️ ' + Math.floor(d.secs / 60) + ':' + String(d.secs % 60).padStart(2, '0') + '</div>' +
    '<div class="go-row bvs-row" style="margin:8px 0"><button class="btn sp-btn sp-primary" id="bvs-wait" data-sound="none" disabled>⏳ ' + UI.esc(d.host) + ' starts next</button>' +
    '<button class="btn soft sp-btn sp-secondary" id="bvs-room" data-sound="none">◀ Room</button><button class="btn soft sp-btn sp-secondary" id="bvs-exit" data-sound="none">🚪 Leave</button></div>' +
    '<div class="note" id="save-note">' + note + '</div>');   // the buttons sit above the save note: a phone held sideways never hides them under the badges
  $('bvs-room').onclick = () => { UISound.play('tap'); bvsGuestOff(); advToMenu(); openCover(); if(BrawlCover) Link.cover.show(BrawlCover); };
  $('bvs-exit').onclick = () => { UISound.play('tap'); try{ Link.leave(); }catch(e){} bvsGuestOff(); advToMenu(); }; }
const BVS_CSS = '.bvs-row{gap:6px}.bvs-row .btn{padding-left:12px;padding-right:12px;white-space:nowrap}@media (max-width:540px){#bvs-wait{flex:1 1 100%}}@media (max-height:460px){#result-card .bvs-story{display:none}#result-card .big{font-size:2rem}#result-card .bvs-me~.note{margin:2px 0}}';
// ---------- wire: the room part at room open (bbsWire) · the Brawenture part once it is here ----------
function bvsWire(){
  if(BVS.wired) return; BVS.wired = true;
  const st = document.createElement('style'); st.id = 'bvs-css'; st.textContent = BVS_CSS; (document.head || document.documentElement).appendChild(st);
  const ag = bblAdvGo; bblAdvGo = function(){ bvsWireAdv(); bvsHostStop(); const r = ag.apply(this, arguments); if(bbsOwnRoom() && typeof AV !== 'undefined' && AV && AV.link) bvsHostStart(); return r; };
  const pn = putNote; putNote = function(i, html){ const r = pn.apply(this, arguments); if(BVS.H && !bvsGuest()) bvsNoteTo(i, html); return r; };
  Link.on('bvs:ui', d => bvsUi(d));
  Link.on('bvs:end', d => bvsEnd(d));
  Link.on('bvs:note', d => { if(!d || d.name !== S.player) return; BVS.notes[d.name] = d.html; if(BVS.end){ const n = $('save-note'); if(n) n.innerHTML = d.html; } });
  Link.on('hostleft', () => { if(bvsGuest()){ const h = BVS.base ? BVS.base.host : 'The host'; bvsGuestOff(); advToMenu(); openCover(); UI.toast('👋 ' + h + ' ended the game'); } });
  document.addEventListener('keydown', e => bvsKey(e, true)); document.addEventListener('keyup', e => bvsKey(e, false));
}
function bvsWireAdv(){
  if(BVS.advWired || typeof BV === 'undefined' || typeof advDraw !== 'function') return; BVS.advWired = true;
  const nr = BV.newRun; BV.newRun = function(o){ const M = nr.apply(this, arguments); M.seed0 = o.seed; return M; };   // the host's seed travels in the base
  ['press', 'setCtrl', 'setHold', 'clashKey'].forEach(fn => { const f0 = BV[fn]; BV[fn] = function(M){ if(bvsGuest() && M === AV.M) return false; return f0.apply(this, arguments); }; });   // a phone's copy never moves itself
  ['chooseEnding', 'buyCard', 'restReady'].forEach(fn => { const f0 = BV[fn]; BV[fn] = function(M, v){ if(bvsGuest() && M === AV.M){ Link.send('bvs:ui', {fn, v}, {sure: true}); return false; } return f0.apply(this, arguments); }; });
  const ad = advDraw; advDraw = function(){ if(bvsGuest() || (BVS.H && AV && AV.link)) return bvsDraw(() => ad.apply(this, arguments)); return ad.apply(this, arguments); };
  const ae = advEnd; advEnd = function(win){ if(bvsGuest()){ AV.over = true; return; } const r = ae.apply(this, arguments); if(BVS.H && AV && AV.link) try{ bvsHostEnd(win); }catch(e){ console.error(e); } return r; };
  const ev = advEvents; advEvents = function(list){ try{ bvsHostEvents(list); }catch(e){ console.error(e); } return ev.apply(this, arguments); };
  const pa = pauseAdv; pauseAdv = function(){ if(bvsGuest()){ if(BVS.pad && !AV.over && !AV.story) BVS.pad.pause(!AV.paused); return; } return pa.apply(this, arguments); };
  const hi = advHumanIdx; advHumanIdx = function(rank){ const k = bvsMe(); if(k >= 0) return k; return hi.apply(this, arguments); };
  const lay = layoutAdv; layoutAdv = function(){ const r = lay.apply(this, arguments);
    if(typeof AV !== 'undefined' && AV && (bvsGuest() || BVS.H)){ AV.M.view = BVS.H ? BV.VIEW : BVS.base.view; requestAnimationFrame(bvsFit); }
    if(bvsGuest()) document.querySelectorAll('#scr-advplay .tb').forEach(btn => { if(btn.__bvs) return; btn.__bvs = 1; const k = btn.dataset.a === 'block' ? 'boop' : btn.dataset.a;
      btn.addEventListener('pointerdown', () => { if(BVS.pad && bvsGuest() && !AV.paused) BVS.pad.btn(k, true); }, true);
      ['pointerup', 'pointercancel'].forEach(t => btn.addEventListener(t, () => { if(BVS.pad) BVS.pad.btn(k, false); }, true)); });
    return r; };
  const am = advToMenu; advToMenu = function(){ if(bvsGuest()) bvsGuestOff(); else if(BVS.H) bvsHostStop(); return am.apply(this, arguments); };
}
// ======================= 🪞 lk-9a3: every phone = the LEFT fighter (like playing alone) =======================
// a 🔵 (side 1) phone turns the ring round on ITS screen only: the 2 fighters' x · speed · knock-back · facing + the x of every moment ·
// the top bar swaps (MY bar on the left, each bar keeps its 🔴 / 🔵 colour) · MY stick turns back · host engine / TV / other phones unchanged.
// 🗺️ Brawenture (one team, the street goes right) is not turned. BBM.off = true → the TV's sides again.
const BBM = {on: false, hud: false, off: false, wired: false};
function bbmWant(){ return !!(G && G.guest && BBS.mine && BBS.mine.side === 1 && G.M && G.M.f && !BBM.off && !bvsGuest()); }
function bbmFlip(){ const M = G.M; [0, 1].forEach(s => { const f = M.f[s]; if(!f) return; ['x', 'vx', 'kbx'].forEach(k => { if(typeof f[k] === 'number') f[k] = -f[k]; }); if(typeof f.face === 'number') f.face = -f.face; }); }
const BBM_CSS = '#fhud.bbm .fbar.r{flex-direction:row}#fhud.bbm .fbar.r .row,#fhud.bbm .fbar.r .row2,#fhud.bbm .fbar.r .team{flex-direction:row}' +
  '#fhud.bbm .fbar.r .hp b,#fhud.bbm .fbar.r .hp em,#fhud.bbm .fbar.r .pw b{left:0;right:auto}#fhud.bbm .fbar.r .hp{clip-path:polygon(0 0,100% 0,calc(100% - 9px) 100%,0 100%)}#fhud.bbm .fbar.r .hp b{background:linear-gradient(90deg,#3D8BFD,#6EE7F9)}' +
  '#fhud.bbm .fbar.l{flex-direction:row-reverse}#fhud.bbm .fbar.l .row,#fhud.bbm .fbar.l .row2,#fhud.bbm .fbar.l .team{flex-direction:row-reverse}' +
  '#fhud.bbm .fbar.l .hp b,#fhud.bbm .fbar.l .hp em,#fhud.bbm .fbar.l .pw b{left:auto;right:0}#fhud.bbm .fbar.l .hp{clip-path:polygon(0 0,100% 0,100% 100%,9px 100%)}#fhud.bbm .fbar.l .hp b{background:linear-gradient(270deg,#FF4D6D,#FF9F43)}';
function bbmHud(on){ const fh = $('fhud'), b0 = $('face0') && $('face0').closest('.fbar'), b1 = $('face1') && $('face1').closest('.fbar'), ck = $('clock'); if(!fh || !b0 || !b1 || !ck || BBM.hud === on) return; BBM.hud = on;
  if(!document.getElementById('bbm-css')){ const st = document.createElement('style'); st.id = 'bbm-css'; st.textContent = BBM_CSS; document.head.appendChild(st); }
  fh.classList.toggle('bbm', on); if(on){ fh.insertBefore(b1, ck); fh.insertBefore(b0, ck.nextSibling); } else { fh.insertBefore(b0, ck); fh.insertBefore(b1, ck.nextSibling); } }
function bbmWire(){
  if(BBM.wired) return; BBM.wired = true;
  const ap0 = bbsApply; bbsApply = function(a, b, u, lerp){ const r = ap0.apply(this, arguments); const w = !(a && a.m) && bbmWant(); if(w) bbmFlip(); BBM.on = w; if(BBM.hud !== w) try{ bbmHud(w); }catch(e){} return r; };
  const ev0 = bbsEvents; bbsEvents = function(list){ if(bbmWant() && list) list = list.map(e => e && typeof e.x === 'number' ? Object.assign({}, e, {x: -e.x}) : e); return ev0.call(this, list); };
  const sp0 = bbsSendPad; bbsSendPad = function(){ const st = G && G.pads && (G.pads[0] || G.pads[1]); if(!bbmWant() || !st) return sp0.apply(this, arguments);
    const l = st.l, r = st.r; st.l = r; st.r = l; try{ return sp0.apply(this, arguments); } finally { st.l = l; st.r = r; } };
  const bu0 = bbsBuild; bbsBuild = function(base){ const r = bu0.apply(this, arguments); try{ bbmHud(bbmWant()); }catch(e){} return r; };
  const go0 = bbsGuestOff; bbsGuestOff = function(){ try{ bbmHud(false); }catch(e){} BBM.on = false; return go0.apply(this, arguments); };
}
GameParts.loaded('BrawlBuddies_screens', 'lk-9a3');
