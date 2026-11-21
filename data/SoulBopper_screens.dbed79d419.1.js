
/* 📱 SCREENS (lk-9b, 📡 Multiplayer chat, Aowu 2026-11-21 — LinkKit plan §55k picks: my card big + the others as faces, 20 pictures / s): 👻💣 Soul Bopper,
   everyone on their OWN screen. The 4th choice on the 📱 sheet (SB_ROOM screens: true). The host's phone runs the unchanged engine AND plays
   (= 🎮 Host + play, no TV); every other phone shows the SAME maze with the game's own play screen + the game's own touch pad:
     host:  sblGo() as today (seats, 📴 drop → 🤖, ⏸, saves for everyone) + Link.screens.host: base = how the match was built (humans in order ·
            bot names · seed · mode · level · world · maze size · teams · bomb skins) · picture 20× a second = the match minus its fixed parts
            (players · bombs · flames · items · warnings · sudden death · zone) + the maze cells (a broken block = 1 changed cell) · events
            (handleEvents' list with the host time) · a NEW picture base every new round / bot that jumps in (the maze is rebuilt) · the end →
            sbs:end (every person's numbers) + sbs:note (each saved person's badges / titles → that person's phone)
     phone: Link.pads.config onScreen → the same match from the base (startMatch with the host's seed + names) → no engine: the NEWEST picture
            whole, only positions glide (players · flying bombs) · events → the game's own handleEvents (sounds · FX · words · 🎬 beats · crowd)
            · draw + hud as usual · MY pad only → Link.screens.pad → pdin / pdbt (the host can't tell it from a 🕹️ phone) · ⭕ + ▼ on my bopper ·
            MY card big, the others as faces · ⚡ / 🌍 pill · 🏁 MY OWN result card (my numbers · my avatar · my save note) · ⏸ for everyone ·
            host gone → back to the cover
   Words on a phone name the person ("💥 Mia got caught!") — a "Caught!" banner is only for MY bopper.
   Top level only DEFINES (od-1 / lk-9a lesson): sbsWire() installs every wrap, called by the link part's sblOpen before sblWire (so the
   link part's own wraps stay outside these). Built into SoulBopper_screens by Test Harness/parts/build_parts.py — loaded with LinkScreens by
   sblOpen. 💀 Hardcore + 🗺️ Stage stay on one device. */
const SBS = {wired: false, H: null, Gs: null, pad: null, d: null, base: null, built: '', me: -1, last: 0, road: null, n: 0, pid: '', baseObj: null, fam: null,
  end: null, notes: {}, endNames: null, endCfg: null, cur: null, lastKeys: null, building: false};
const SBS_MSKIP = {rng: 1, specs: 1, stats: 1, ev: 1, spawns: 1, L: 1, P: 1, grid: 1, hidden: 1, seed: 1, level: 1, mode: 1, theme: 1, teams: 1, stage: 1, need: 1, ghosts: 1, joinNames: 1};
const SBS_PSKIP = {ai: 1, buf: 1, ctrl: 1, path: 1, brain: 1};
const SBS_KEEP = {P: 1, g: 1, bt: 1, pz: 1, t: 1};   // picture keys the phone handles itself
function sbsSkip(k, skip){ return !!skip[k] || k.charAt(0) === '_'; }
function sbsCopy(o, skip){ const out = {}; for(const k in o){ if(sbsSkip(k, skip)) continue; const v = o[k]; if(typeof v !== 'function') out[k] = v; } return out; }
// the moving picture (host): the whole match minus its fixed parts + the maze cells + the 🎬 beat clock + ⏸
function sbsPic(){ const M = G.M; const m = sbsCopy(M, SBS_MSKIP); m.P = M.P.map(p => sbsCopy(p, SBS_PSKIP)); m.g = Array.from(M.grid); m.bt = G.bt || 0; m.pz = G.paused ? 1 : 0; return m; }
function sbsOwnRoom(){ try{ return !!(Link.cover && Link.cover.state && (Link.cover.state() || {}).own); }catch(e){ return false; } }
function sbsGuest(){ return !!(G && G.guest); }
function sbsOn(){ return !!(G && G.link && (G.guest || SBS.H)); }
function sbsMine(){ if(!G || !G.link) return -1; if(G.guest) return SBS.me; const s = (G.link.seats || []).find(x => x.local); return s ? s.g : -1; }
// ======================= HOST =======================
let SBS_SM = null, SBS_PR = null, SBS_PC = null, SBS_HE = null, SBS_FM = null, SBS_PN = null, SBS_LP = null, SBS_BC = null, SBS_TP = null, SBS_BM = null, SBS_DR = null, SBS_BN = null, SBS_TD = null;
function sbsHostStart(){
  if(!G || !G.link || G.guest) return; const M = G.M;
  SBS.pid = SBL.pads ? SBL.pads.id : G.link.id; SBS.n = 0;
  const team = {}; M.P.forEach(p => { if(p.human) team[p.name] = p.team; });
  SBS.baseObj = {pid: SBS.pid, cfg: G.link, host: S.player, seed: M.seed, fam: SBS.fam || [], mode: M.mode, level: M.level, theme: M.theme, teams: !!M.teams,
    size: [M.L.w, M.L.h], humans: M.P.filter(p => p.human).map(p => p.name), team, nb: M.specs.filter(s => !s.human).length, skins: M.P.map(p => p.skin || '')};
  SBS.H = Link.screens.host({id: SBS.pid, base: SBS.baseObj, pic: sbsPic});
}
// a new round / a bot that jumps in rebuilds the maze → a fresh picture base (same match: the phone keeps its copy), sent BEFORE that moment's events
function sbsRebase(){ if(!SBS.H || !SBS.baseObj) return; SBS.n++; SBS.H = Link.screens.host({id: SBS.pid + '.' + SBS.n, base: SBS.baseObj, pic: sbsPic}); }
function sbsHostStop(){ if(SBS.H){ SBS.H.stop(); SBS.H = null; } const el = document.getElementById('sbs-road'); if(el && !sbsGuest()) el.remove(); }
// every engine event list also goes to the phones (the host's own handleEvents is unchanged) · own screens: words name the person
function sbsHandleEvents(list){
  if(SBS.H && G && G.link && !G.guest && list && list.length){
    if(list.some(e => (e.k === 'round' && G.M.round > 1) || e.k === 'join')) sbsRebase();
    SBS.H.event(list);
    return sbsRun(list, SBS_HE, this, arguments);
  }
  return SBS_HE.apply(this, arguments);
}
// one event at a time, so a banner knows whose moment it is (sbsBanner)
function sbsRun(list, fn, self){ let r; list.forEach(e => { SBS.cur = e; try{ r = fn.call(self, [e]); } finally { SBS.cur = null; } }); return r; }
function sbsBanner(text, kind){
  const e = SBS.cur, me = sbsMine();
  if(e && e.i != null && me >= 0 && e.i !== me && G && G.M && sbsOn()){ const P = G.M.P[e.i];
    if(P && P.human){ if(e.k === 'caught') return SBS_BN.call(this, '💥 ' + P.name + ' got caught!', ''); if(e.k === 'pick' || e.k === 'zombified' || e.k === 'respawn') return; } }
  return SBS_BN.apply(this, arguments);
}
// the host remembers how its match was built (the bot names' order) so a phone builds the very same one · a phone never starts a match itself
function sbsStartMatch(){
  if(G && G.guest && !SBS.building) return;
  const sh = window.shuffle; let fam = null;
  window.shuffle = a => { const r = sh(a); if(!fam) fam = r.slice(); return r; };
  try{ return SBS_SM.apply(this, arguments); } finally { window.shuffle = sh; if(!SBS.building) SBS.fam = fam || []; }
}
// 🏁 the end (host): MY card (the host's phone is a player) + every person's numbers → the phones (each phone makes its OWN card) + notes
function sbsFinish(){
  if(G && G.guest) return;   // a phone never ends (or saves) a match itself
  if(!(SBS.H && G && G.link)) return SBS_FM.apply(this, arguments);
  const M = G.M, L0 = G.link, humans = M.P.filter(p => p.human);
  SBS.endNames = humans.map(p => p.name); SBS.endCfg = L0;
  G.link = null; let r;   // the 📡 link's card wrapper puts the WINNER's avatar on the card — the host phone's card is ITS player's
  try{ r = SBS_FM.apply(this, arguments); } finally { if(G) G.link = L0; }
  if(M.mode !== 'stage'){ const wP = M.P[M.winner];
    let icon, title; if(M.mode === 'hold' && M.teams){ icon = '🏳️'; title = (M.winSide ? '🔵 Team Moon' : '🟠 Team Sun') + ' holds the land!'; } else if(!wP){ icon = '🤝'; title = 'Nobody left standing!'; } else if(wP.human){ icon = '🏆'; title = wP.name + ' wins!'; } else { icon = (BOT_KIND[wP.kind] || ['🤖'])[0]; title = wP.name + ' (bot) wins this time'; }
    Link.send('sbs:end', {id: L0.id, winner: M.winner, teams: !!M.teams, mode: M.mode, need: M.need, wins: M.wins.slice(), secs: Math.max(1, Math.round(M.totalT)), icon, title, host: S.player,
      ppl: humans.map(p => ({name: p.name, i: p.i, team: p.team, s: M.stats[p.i], score: BOP.scoreFor(M, p.i)})), saved: SBS.endNames.filter(n => n !== 'Guest')}, {sure: true}); }
  return r; }
function sbsPutNote(i, html){ const r = SBS_PN.apply(this, arguments);
  try{ const nm = SBS.endNames && SBS.endNames[i], cfg = SBS.endCfg; const s = nm && cfg && cfg.seats.find(x => x.name === nm && !x.local); if(s) Link.send('sbs:note', {name: nm, html}, {sure: true, to: s.lseat}); }catch(e){}
  return r; }
// ======================= PHONE =======================
function sbsOnScreen(d){
  if(G && G.guest && SBS.d && SBS.d.id === d.id){ SBS.d = d; return; }   // the same match (a 🔁 rejoin) → carry on, the base comes again
  SBS.d = d;
  if(!SBS.Gs) SBS.Gs = Link.screens.guest({delay: 100, onBase: base => sbsBuild(base), apply: (a, b, u) => sbsApply(a, b, u), onEvents: list => sbsEvents(list)});
}
function sbsBuild(base){
  if(!SBS.d || !base || !base.cfg || base.pid !== SBS.d.id) return;   // the base of THIS match (LinkPads' match id)
  if(G && G.guest && SBS.built === base.pid){ SBS.base = base; SBS.lastKeys = null; return; }   // a fresh base of the same match (new round) → keep my copy
  SBS.base = base; SBS.end = null; SBS.notes = {}; SBS.lastKeys = null;
  const me = SBS.d.g, cfg = Object.assign({}, base.cfg, {seats: base.cfg.seats.map(s => Object.assign({}, s, {local: s.g === me}))});   // my seat = this phone's own pad
  const keep = {mode: SET.mode, level: SET.level, theme: SET.theme, teams: SET.teams};
  const o = {hl: window.humanList, bc: window.botCount, sh: window.shuffle, mz: window.mazeWH, tf: window.teamOf, sp: window.savePrefs}, dn = Date.now;
  Object.assign(SET, {mode: base.mode, level: base.level, theme: base.theme, teams: base.teams});
  window.humanList = () => base.humans.slice(); window.botCount = () => base.nb; window.shuffle = () => (base.fam || []).slice(); window.mazeWH = () => base.size.slice();
  window.teamOf = n => base.team[n] != null ? base.team[n] : 0; window.savePrefs = () => {}; Date.now = () => (base.seed ^ 0x5b) & 0xffffff;   // startMatch's own seed line → the host's seed
  SBS.building = true; SBL.starting = cfg;   // the link part's layout reads it → only MY pad from the first layout
  try{ if(G) cancelAnimationFrame(G.raf); G = null; hideResult(); SBS_SM(); }
  finally { SBS.building = false; SBL.starting = null; Date.now = dn; Object.assign(window, {humanList: o.hl, botCount: o.bc, shuffle: o.sh, mazeWH: o.mz, teamOf: o.tf, savePrefs: o.sp}); Object.assign(SET, keep); }
  if(!G) return; cancelAnimationFrame(G.raf);
  G.M.P.forEach((p, i) => { p.skin = base.skins[i] || ''; });
  SBS.me = me; SBS.built = base.pid; G.guest = {g: me, host: base.host}; G.link = cfg; G.plantDown = {};
  layoutPlay(); sbsRoadPill();
  if(SBS.pad) SBS.pad.stop(); SBS.pad = Link.screens.pad(SBS.d); SBS.last = performance.now();
  const loop = now => { if(!G || !G.guest) return; G.raf = requestAnimationFrame(loop); const dt = Math.min(0.1, Math.max(0, (now - SBS.last) / 1000)); SBS.last = now;
    sbsSendPad(); if(!G.paused){ G.t += dt; stepFx(dt); if(typeof sbpAhead === 'function') sbpAhead(); }
    if(window.Cheer) Cheer.pause(!!G.paused); quality(dt); draw(); hud(); };
  G.raf = requestAnimationFrame(loop);
}
// the NEWEST picture whole (never two pictures mixed key by key — lk-9a2 lesson) · only positions glide: players, flying bombs, the clock
function sbsApply(a, b, u){
  if(!G || !G.guest || !b || !b.P) return; const M = G.M, mix = (x, y) => x + (y - x) * u;
  for(const k in b){ if(SBS_KEEP[k]) continue; M[k] = b[k]; }
  if(SBS.lastKeys) SBS.lastKeys.forEach(k => { if(!(k in b) && !SBS_KEEP[k]) delete M[k]; }); SBS.lastKeys = Object.keys(b);
  M.t = a && typeof a.t === 'number' && a.t <= b.t ? mix(a.t, b.t) : b.t;
  b.P.forEach((src, i) => { let q = M.P[i]; if(!q){ q = M.P[i] = {ai: {path: []}, buf: {}, ctrl: {u: false, d: false, l: false, r: false}}; }
    for(const k in q){ if(!(k in src) && !sbsSkip(k, SBS_PSKIP)) delete q[k]; }
    for(const k in src) q[k] = src[k];
    const pa = a && a.P && a.P[i]; if(pa && Math.abs(pa.x - src.x) + Math.abs(pa.y - src.y) < 1.5){ q.x = mix(pa.x, src.x); q.y = mix(pa.y, src.y); } });
  if(M.P.length > b.P.length) M.P.length = b.P.length;
  if(M.stats && M.stats[0]) while(M.stats.length < M.P.length) M.stats.push(Object.fromEntries(Object.keys(M.stats[0]).map(k => [k, 0])));
  if(Array.isArray(b.bombs)){ const was = new Map(((a && a.bombs) || []).map(x => [x.id, x])); M.bombs = b.bombs.map(x => { const y = Object.assign({}, x), w = was.get(x.id); if(w && Math.abs(w.x - x.x) + Math.abs(w.y - x.y) < 2.5){ y.x = mix(w.x, x.x); y.y = mix(w.y, x.y); } return y; }); }
  const g = b.g; if(g){ if(!M.grid || M.grid.length !== g.length) M.grid = new Uint8Array(g.length); for(let i = 0; i < g.length; i++) M.grid[i] = g[i]; }
  G.bt = a && typeof a.bt === 'number' && a.bt <= b.bt ? mix(a.bt, b.bt) : b.bt;
  if(!!b.pz !== !!G.paused){ G.paused = !!b.pz; UI.pauseIcon($('pause-btn'), G.paused); }
}
// the game's own sounds / FX / words / crowd — without the 📡 link's phone buzz (that is for 🕹️ controllers); the win / the card stay with the host
function sbsEvents(list){ if(!G || !G.guest || !list) return; const L0 = G.link; G.link = null; try{ sbsRun(list, SBS_HE, null); } finally { if(G) G.link = L0; } }
// presses on a phone's copy go to MY pad (the host's engine decides): ✨ = a tap · 💣 = held while the finger is down (sbsSendPad) · 💨 from the stick
function sbsPress(M, seat, k){ if(!(G && G.guest && M === G.M)) return SBS_PR.apply(this, arguments); if(k === 'skill') sbsTap('skill'); else if(k === 'plant' && !(G.plantDown && G.plantDown[SBS.me])) sbsTap('plant'); return false; }
function sbsTap(k){ if(!SBS.pad || !G || G.paused) return; SBS.pad.btn(k, true); setTimeout(() => { if(SBS.pad) SBS.pad.btn(k, false); }, 120); }
function sbsSendPad(){ if(!SBS.pad) return; const t = G.touch[SBS.me];
  const ks = [(KEYS || [])[0], (KEYS || [])[1], {up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', plant: 'Space', skill: 'ShiftLeft'}], has = a => ks.some(K => K && K[a] && G.keys.has(K[a]));   // a tablet with a keyboard
  const d = (t && t.dir) || (has('up') ? 'u' : has('down') ? 'd' : has('left') ? 'l' : has('right') ? 'r' : null);
  SBS.pad.stick(d === 'r' ? 1 : d === 'l' ? -1 : 0, d === 'd' ? 1 : d === 'u' ? -1 : 0, d);
  SBS.pad.btn('plant', !!((G.plantDown && G.plantDown[SBS.me]) || has('plant'))); }
// ⏸ on a phone = ⏸ for everyone (the host decides) · the host's ⏸ shows here
function sbsTogglePause(){ if(G && G.guest){ if(SBS.pad && !G.over) SBS.pad.pause(!G.paused); return; } return SBS_TP.apply(this, arguments); }
function sbsPauseLine(on, by){ if(!G || !G.guest) return; G.paused = on; UI.pauseIcon($('pause-btn'), on); SBS_BN(on ? '⏸ ' + (by || SBS.base.host) + ' paused' : '▶ ' + (by || SBS.base.host) + ' — go!', 'good'); }
// 📱 MY card stays big, the others become small faces (5 cards took half a small phone — the maze gets the room) · host phone too
function sbsLayoutPlay(){ const r = SBS_LP.apply(this, arguments); const sp = document.getElementById('scr-play'); if(sp) sp.classList.toggle('sbs-own', sbsOn()); if(sbsOn()) requestAnimationFrame(sbsChips); return r; }
function sbsBuildChips(){ const r = SBS_BC.apply(this, arguments); if(sbsOn()) sbsChips(); return r; }
function sbsChips(){ if(!G || !G.chipEls || !sbsOn()) return; placeChips(); requestAnimationFrame(() => { try{ resize(); sbsRoadPlace(); }catch(e){} }); }
// the game places the cards every resize (seat by seat, left / right on a phone held sideways) → then MINE goes first: top of the strip, or top of the LEFT panel
function sbsPlaceChips(){ const r = SBS_PC.apply(this, arguments); if(sbsOn()) try{ sbsChipsOrder(); }catch(e){} return r; }
function sbsChipsOrder(){ if(!G || !G.chipEls) return; const mine = sbsMine(), me = G.chipEls[mine];
  Object.keys(G.chipEls).forEach(i => G.chipEls[i].classList.toggle('sbs-me', Number(i) === mine)); if(!me) return;
  const L = G.chipPanel && document.getElementById('sidechips-l'), R = G.chipPanel && document.getElementById('sidechips-r');
  if(L && R){ let mv = false; const rest = G.M.P.map(p => G.chipEls[p.i]).filter(e => e && e !== me);   // the others share the two panels: right, left, right …
    if(L.firstChild !== me){ L.insertBefore(me, L.firstChild); mv = true; } rest.forEach((e, k) => { const to = k % 2 ? L : R; if(e.parentNode !== to){ to.appendChild(e); mv = true; } });
    if(mv) layoutSide(); return; }
  if(me.parentNode && me.parentNode.firstChild !== me) me.parentNode.insertBefore(me, me.parentNode.firstChild); }
// ⭕ + ▼ my bopper, in my seat colour (no words: other phones / a TV say names, never "You")
function sbsDraw(){ const r = SBS_DR.apply(this, arguments); if(sbsOn()) sbsMark(); return r; }
function sbsMark(){ const R = R0, me = sbsMine(), p = G.M.P[me]; if(!R || !R.CS || !p || !(p.alive || p.ghost || p.edge) || G.M.state === 'end') return; const cv = $('cv'), g = cv.getContext('2d'), CS = R.CS;
  g.save(); g.setTransform(DPR, 0, 0, DPR, 0, 0);
  const x = R.OX + (p.x + 0.5) * CS, y = R.OY + (p.y + 0.5) * CS, bob = Math.sin((G.t || 0) * 5) * 2, col = chipCol(p);
  g.strokeStyle = col;
  g.lineWidth = Math.max(2, CS * 0.08);
  g.setLineDash([CS * 0.18, CS * 0.1]); g.beginPath(); g.ellipse(x, y + CS * 0.32, CS * 0.46, CS * 0.18, 0, 0, 7); g.stroke(); g.setLineDash([]);
  const ty = y - CS * 1.05 + bob, k = Math.max(5, CS * 0.16);
  g.fillStyle = col; g.strokeStyle = '#fff'; g.lineWidth = 2; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x - k, ty - k); g.lineTo(x + k, ty - k); g.lineTo(x, ty + k * 0.5); g.closePath(); g.stroke(); g.fill(); g.restore(); }
// ⚡ / 🌍 the road pill — host: every phone · phone: mine + whose game · upright = the maze's top-left corner · sideways = under the cards in the left panel
function sbsRoadPill(){ let el = document.getElementById('sbs-road'); if(!el){ el = document.createElement('div'); el.id = 'sbs-road'; el.className = 'sbs-road'; document.getElementById('scr-play').appendChild(el); }
  const paint = () => { if(!el.isConnected) return; if(!G || !sbsOn() || G.over){ el.style.display = 'none'; return; } el.style.display = '';
    if(G.guest){ const r = Link.screens.road(); el.textContent = r.icon + ' ' + (r.ms != null ? r.ms + ' ms' : r.word) + ' · 📱 ' + (SBS.base ? SBS.base.host : '') + '\'s game'; el.className = 'sbs-road ' + r.k; }
    else { el.textContent = G.link.seats.filter(s => !s.local).map(s => { const r = Link.screens.road(s.lseat); return r.icon + ' ' + s.name + (r.ms != null ? ' ' + r.ms : ''); }).join(' · '); el.className = 'sbs-road host'; }
    sbsRoadPlace(); };
  paint(); clearInterval(SBS.road); SBS.road = setInterval(paint, 1000); }
function sbsRoadPlace(){ const el = document.getElementById('sbs-road'); if(!el || !G) return; const sp = document.getElementById('scr-play'), side = sp && sp.classList.contains('side'), ch = side && document.getElementById('sidechips-l');
  if(ch){ const c = ch.getBoundingClientRect(), pn = ch.closest('.ctl') || ch; const w = pn.getBoundingClientRect(); el.style.top = Math.round(c.bottom + 6) + 'px'; el.style.left = Math.round(w.left + 6) + 'px'; el.style.maxWidth = Math.max(80, Math.round(w.width - 12)) + 'px'; return; }
  const cv = document.getElementById('cv'); if(!cv) return; const c = cv.getBoundingClientRect(); el.style.top = Math.round(c.top + 4) + 'px'; el.style.left = Math.round(c.left + 6) + 'px'; el.style.maxWidth = '92vw'; }
// 🏁 MY OWN result card: my numbers · my avatar · my save note (the host saves for everyone) · ⏳ the host starts the next one · ◀ Room · 🚪 Leave
function sbsEnd(d){
  if(!G || !G.guest || !G.link || !d || d.id !== G.link.id || G.over) return; SBS.end = d; G.over = true; G.shown = true;
  setTimeout(() => { if(G && G.guest && SBS.end === d) sbsCard(d); }, 900);
}
function sbsCard(d){
  if(window.UI && UI.callout) UI.callout.setup(null);
  const me = d.ppl.find(p => p.name === S.player) || d.ppl.find(p => p.i === SBS.me) || {s: {}, i: SBS.me, team: -1}, s = me.s || {}, w = d.winner, wp = d.ppl.find(p => p.i === w);
  const won = w >= 0 && (d.teams ? (wp ? wp.team === me.team : (G.M.P[w] && G.M.P[w].team === me.team)) : w === me.i), none = w < 0;
  UISound.play(won ? 'success' : 'error'); if(won && FX) confetti(['🎉', '💣', '✨', '👻'], 26);
  const saved = (d.saved || []).indexOf(S.player) >= 0;
  const L0 = G.link; G.link = null;   // the 📡 link's card wrapper puts the WINNER on the card — this card is MINE
  try{ GF.result({wrap: $('result'), card: $('result-card'), win: none ? null : won, icon: won ? d.icon : none ? '🤝' : '💪', title: d.title,
    sub: won || none ? '' : '💪 Good game — plant, then walk round a corner!', stars: null, score: me.score,
    stats: (d.mode === 'battle' ? [['⚔️', d.ppl.map(p => p.name + ' ' + (d.wins[p.i] || 0)).join(' · ') + ' rounds']] : []).concat([['🧱', (s.blocks || 0) + ' blocks'], ['💥', ((s.catches || 0) + (s.bots || 0)) + ' caught'], ['🔗', (s.chains || 0) + ' chains']], s.comebacks ? [['👻', s.comebacks + ' comebacks']] : [], [['⏱', fmtS(d.secs)]]),
    save: saved ? '⏳ ' + d.host + ' saves it for you…' : null, buddy: {name: S.player, av: myAvatar(S.player)}, comic: false, confetti: false,
    levels: () => {}, again: () => {}, extra: []}); } finally { if(G) G.link = L0; }
  const row = $('result-card').querySelector('.gf-r-btns');
  if(row){ row.innerHTML = '<button class="btn sp-btn sp-primary" id="sbs-wait" data-sound="none" disabled>⏳ ' + UI.esc(d.host) + ' starts the next one</button><button class="btn soft sp-btn sp-secondary" id="sbs-room" data-sound="none">◀ Room</button><button class="btn soft sp-btn sp-secondary" id="sbs-exit" data-sound="none">🚪 Leave</button>';
    $('sbs-room').onclick = () => { UISound.play('tap'); sbsGuestOff(); hideResult(); backToMenu(); openCover(); if(BopCover) Link.cover.show(BopCover); };
    $('sbs-exit').onclick = () => { UISound.play('tap'); try{ Link.leave(); }catch(e){} sbsGuestOff(); hideResult(); backToMenu(); }; }
  const n = SBS.notes[S.player]; if(n) sbsNote(n);
  try{ cheerFaces(); }catch(e){}
}
function sbsNote(html){ const n = $('save-note'); if(n) n.innerHTML = html; }
function sbsGuestOff(){ if(SBS.pad){ SBS.pad.stop(); SBS.pad = null; } if(G && G.guest){ cancelAnimationFrame(G.raf); G.guest = null; G.link = null; } SBS.d = null; SBS.built = ''; clearInterval(SBS.road); const el = document.getElementById('sbs-road'); if(el) el.remove(); }
// leaving the play screen on a phone = this seat goes quiet (the host's 🤖 plays it) · the host stops sending when its match ends
function sbsBackToMenu(){ if(G && G.guest) sbsGuestOff(); else if(SBS.H){ sbsHostStop(); clearInterval(SBS.road); } const sp = document.getElementById('scr-play'); if(sp) sp.classList.remove('sbs-own'); return SBS_BM.apply(this, arguments); }
function sbsTapDir(seat){ if(G && G.guest) return; return SBS_TD.apply(this, arguments); }   // 💨 double push: the host reads it from my stick
// ---------- wire (once, when the room is opened from the cover) ----------
const SBS_CSS = '#scr-play.sbs-own .pchip:not(.sbs-me){padding:2px;gap:0;flex:0 0 auto!important;width:auto!important}#scr-play.sbs-own .pchip:not(.sbs-me) .tx{display:none}#scr-play.sbs-own .pchip:not(.sbs-me) .por{width:30px;height:35px}#scr-play.sbs-own .pchip.sbs-me{flex:1 1 100%!important}#scr-play.sbs-own .chipstrip{flex-wrap:wrap;gap:4px 5px}#scr-play.sbs-own .sidechips{flex-direction:row;flex-wrap:wrap;align-content:flex-start}#scr-play.sbs-own .sidechips .pchip.sbs-me{width:100%}' +
  '.sbs-road{position:fixed;z-index:6;font:800 11.5px/1 Nunito,sans-serif;padding:5px 10px;border-radius:999px;background:rgba(20,14,36,.72);color:#BFF7CF;border:1.5px solid rgba(124,242,156,.6);pointer-events:none;white-space:nowrap;max-width:92vw;overflow:hidden;text-overflow:ellipsis}.sbs-road.server{color:#BFEAFF;border-color:rgba(159,227,255,.6)}.sbs-road.host{color:#fff;border-color:rgba(255,255,255,.4)}';
function sbsWire(){
  if(SBS.wired || !(window.Link && Link.pads && Link.screens)) return; SBS.wired = true;
  // wraps (installed once, when the room opens — the top level only DEFINES, so the inline page = the site page until then; the link part's own wraps go on top)
  SBS_HE = handleEvents; handleEvents = sbsHandleEvents; SBS_SM = startMatch; startMatch = sbsStartMatch; SBS_FM = finishMatch; finishMatch = sbsFinish; SBS_PN = putNote; putNote = sbsPutNote;
  SBS_LP = layoutPlay; layoutPlay = sbsLayoutPlay; SBS_BC = buildChips; buildChips = sbsBuildChips; SBS_PC = placeChips; placeChips = sbsPlaceChips; SBS_TP = togglePause; togglePause = sbsTogglePause; SBS_BM = backToMenu; backToMenu = sbsBackToMenu;
  SBS_DR = draw; draw = sbsDraw; SBS_BN = banner; banner = sbsBanner; SBS_TD = tapDir; tapDir = sbsTapDir;
  SBS_PR = BOP.press; BOP.press = sbsPress;
  ['setCtrl', 'setHold'].forEach(fn => { const f0 = BOP[fn]; BOP[fn] = function(M){ if(G && G.guest && M === G.M) return false; return f0.apply(this, arguments); }; });   // a phone's copy never steps
  const st = document.createElement('style'); st.id = 'sbs-css'; st.textContent = SBS_CSS; (document.head || document.documentElement).appendChild(st);
  Link.pads.config({onScreen: d => sbsOnScreen(d), onScreenPause: (on, by) => sbsPauseLine(on, by)});   // the phone sees the game's own words — buzz lines are for 🕹️ controllers
  Link.on('sbs:end', d => sbsEnd(d));
  Link.on('sbs:note', d => { if(!d || d.name !== S.player) return; SBS.notes[d.name] = d.html; if(SBS.end) sbsNote(d.html); });
  Link.on('hostleft', () => { if(G && G.guest){ const h = SBS.base ? SBS.base.host : 'The host'; sbsGuestOff(); hideResult(); backToMenu(); openCover(); UI.toast('👋 ' + h + ' ended the game'); } });
  const go0 = sblGo; sblGo = function(){
    const own = sbsOwnRoom(); sbsHostStop();
    const sc = Link.pads.screen; if(own) Link.pads.screen = o => sc(Object.assign({}, o, {screen: true}));
    try{ go0.apply(this, arguments); } finally { Link.pads.screen = sc; }
    if(own && G && G.link){ sbsHostStart(); layoutPlay(); sbsRoadPill(); } };
}
GameParts.loaded('SoulBopper_screens', 'lk-9b');
