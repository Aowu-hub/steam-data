
/* 📱 SCREENS (lk-9d, 📡 Multiplayer chat, Aowu 2026-11-22 17:4x "every ⭐" — LinkKit plan §55x look test → §56 as built): ⚽ BlasOff, everyone on their OWN screen.
   Born split: this part = BlasOff_screens (GameParts, loader BlasOffParts) — comes with the room (BlasOff_link's bolOpen loads it + the shared LinkScreens;
   a failed load = the room without the 📱 choice) · the 4th choice on the 📱 sheet (BOL_ROOM.screens). Top level only DEFINES; bosWire() installs every wrap.
     host:  bolGo() as today (seats · 📴 drop → 🤖 · ⏸ · saves for every person) + Link.screens.host:
            base = kind · size · level · pitch · seed · the 22 names · both formations · the people in seat order · team names
            picture 20× a second = the match minus its fixed parts: every player's moving fields · the ball · clock / score / phase · ctrl stars
            events = the engine's own list (handleEvents) → every phone plays the same sounds / words / beats at that time
            its own camera = BEHIND ITS TEAM (each phone attacks up the screen) · its own 🌸 pad
     phone: the same match from the base (BO.newMatch with the host's seed + names + forms) → never steps: the NEWEST picture whole,
            positions glide · MY camera (behind MY team) · MY 🌸 pad: stick → the PITCH direction from MY camera (the host never turns it
            with ITS camera) · 💥 ⚽ 🌀 🦘 🔄 = the game's own keys (K J L SP C) → the host · 📣 shout = the world side from MY camera ·
            ▼ over my player · ⚡ / 🌍 pill · 🏁 MY card (my goals · assists · tricks …) · ⏳ the host starts the next one
     lk-9d adds: 🙌 throw-in tap on a phone ('throw:<i>' → BO.throwTo on the host) · words: MY moments say "You" ("⚽ You score!"), a friend's
            goal names them · 🟦 / 🟥 colours = MY side on every phone · 🥅 Penalties on own screens (💥 kick = 'key:K' · in goal ⬅️ / ➡️ = 📣 shout)
            · slim pictures: brain-only fields (role · tx / ty · aiT …) stay on the host */
const BOS = {wired: false, H: null, Gs: null, pad: null, d: null, base: null, mine: null, last: 0, road: null, end: null, notes: {}, raw: {}, ci: -1};
const BOS_PSKIP = {i: 1, side: 1, slot: 1, gk: 1, name: 1, g: 1, aiT: 1, tx: 1, ty: 1, pressT: 1, cd: 1, run: 1, trickName: 1, role: 1};   // lk-9d: + role (the robot brain's job — never drawn)
const BOS_MSKIP = {S: 1, L: 1, rnd: 1, events: 1, log: 1, players: 1, ctrls: 1, ball: 1, stats: 1, forms: 1, size: 1, level: 1, theme: 1, fast: 1, guided: 1, noOffside: 1, noPens: 1,
  pensOnly: 1, noGolden: 1, halfLen: 1, party: 1, twist: 1, seed0: 1, names0: 1, battle: 1, drill: 1};
function bosR(v){ return Math.round(v * 100) / 100; }
function bosVal(v, d){ if(typeof v === 'number') return bosR(v); if(Array.isArray(v)) return d > 3 ? null : v.map(x => bosVal(x, d + 1)); if(v && typeof v === 'object'){ if(d > 3) return null; const o = {}; for(const k in v) if(typeof v[k] !== 'function' && k.charAt(0) !== '_') o[k] = bosVal(v[k], d + 1); return o; } return v; }
function bosCopy(o, skip){ const out = {}; for(const k in o){ if(skip[k] || k.charAt(0) === '_') continue; const v = o[k]; if(typeof v === 'function' || v === undefined) continue; out[k] = bosVal(v, 0); } return out; }
// the moving picture (host)
function bosPic(){ const M = G.M, m = bosCopy(M, BOS_MSKIP);
  m.p = M.players.map(p => bosCopy(p, BOS_PSKIP)); m.b = bosCopy(M.ball, {}); m.c = M.ctrls.map(c => ({pi: c.pi, st: bosR(c.star || 0), mo: c.mo ? {key: c.mo.key, kind: c.mo.kind} : null}));
  m.pz = G.paused ? 1 : 0; m.sh = (G.shoutShow || [0, 0]).map(bosR); return m; }
function bosOwnRoom(){ try{ return !!(Link.cover && Link.cover.state && (Link.cover.state() || {}).own); }catch(e){ return false; } }
function bosMine(){ const L0 = G && G.link; return L0 ? (L0.seats || []).find(s => s.local) : null; }
// 📷 each phone: behind ITS team (the game's own 'behind' camera, side = mine) — in 🆚 both phones attack up the screen
function bosView(){ const me = bosMine(); return {mode: SET.view && SET.view !== 'auto' && SET.view !== 'behind' ? SET.view : 'behind', side: me ? me.side : 0}; }
// ======================= HOST =======================
function bosHostStart(){
  if(!G || !G.link || G.guest) return; const M = G.M;
  BOS.H = Link.screens.host({id: BOL.pads ? BOL.pads.id : G.link.id, base: {pid: BOL.pads ? BOL.pads.id : '', cfg: G.link, kind: G.kind, size: G.size, level: G.level, theme: G.theme, night: !!G.night,
      seed: M.seed0, names: M.names0, forms: M.forms.slice(), tn: G.tn.slice(), host: S.player, humans: G.humans.map(h => ({name: h.name, side: h.side, seat: h.seat}))}, pic: bosPic});
  G.view = bosView(); G.cam = null; buildPads(); BOS.ci = M.ctrls.findIndex(c => c.seat === 0);
}
function bosHostStop(){ if(BOS.H){ BOS.H.stop(); BOS.H = null; } }
// a phone's line: stick = the PITCH direction (its own camera) · 'key:K' = the game's own keys · 'sh+' / 'sh-' = 📣 the world side
function bosHostBtn(g, k, on){
  if(!BOS.H || !G || !G.link || G.paused || G.over || BOL.away[g]) return false; if(!/^(key:|sh|throw:)/.test(k)) return false; const ci = bolCi(g); if(ci < 0) return true;
  if(k.indexOf('key:') === 0) BO.key(G.M, ci, k.slice(4), on);
  else if(k.indexOf('throw:') === 0){ if(on) BO.throwTo(G.M, ci, +k.slice(6) | 0); }   // 🙌 lk-9d: the phone tapped a teammate for its throw-in
  else if(on){ BO.shout(G.M, ci, k === 'sh+' ? 1 : -1); BOL.shout[g] = 'done'; }
  return true; }
// 🏁 the end: every person's numbers → every phone (each phone makes its OWN card) · each saved person's note → their phone
function bosSendEnd(){ const M = G.M, secs = Math.max(1, Math.round((performance.now() - G.startAt) / 1000));
  const ppl = G.humans.map(h => { const p = M.players.find(q => q.name === h.name && q.side === h.side) || {g: {}}, c = p.ctrl >= 0 ? M.ctrls[p.ctrl] : null;
    return {name: h.name, side: h.side, g: p.g || {}, perfects: c ? c.perfects : 0, blasts: c ? c.blasts : 0}; });
  Link.send('bos:end', {id: G.link.id, winner: M.winner, score: M.score.slice(), pens: M.pens ? M.pens.g.slice() : null, tn: G.tn.slice(), ppl, secs, host: S.player, nokeeper: !!G.Sz.nokeeper}, {sure: true}); }
// the host's phone is a player too → ITS title (my side won / lost — the 📺 TV card names the winner) · 🚪 Leave instead of 🎚️ Levels
function bosHostCard(){ const M = G.M, me = bosMine(), w = M.winner, h2 = document.querySelector('#result-card .gf-r-head h2'); if(!me || !h2) return;
  const team = G.humans.filter(h => h.side === me.side).length > 1; h2.textContent = w === me.side ? (team ? 'Your team wins!' : 'You win!') : w < 0 ? 'A draw!' : h2.textContent;
  const x = $('bol-exit'); if(x){ x.textContent = '🚪 Leave'; x.onclick = () => bolExit(); } }
// 💬 lk-9d words: on an own screen a PERSON's moment names the person (the player they drive may be a robot-named teammate) — mine = "You"
function bosMyPi(){ if(!G || !G.M) return -1; const c = G.M.ctrls[BOS.ci >= 0 ? BOS.ci : 0]; return c && c.seat === 0 ? c.pi : -1; }
function bosOwnOn(){ return !!(G && G.link && !G.link.tv && (G.guest || BOS.H)); }
function bosWho(pi){ if(!G || !G.M || pi == null || pi < 0) return null; const c = G.M.ctrls.find(x => x.pi === pi); if(!c) return null;
  if(c.seat === 0) return 'You'; const h = G.humans.find(x => x.seat === c.seat); return h ? h.name : null; }
function bosYou(list, run){
  const sub = [], P = i => (G.M.players[i] || {}).name;
  list.forEach(e => { [['by', ' scores', ' score'], ['by', ' nutmegs', ' nutmeg'], ['assist', 'pass: ', 'pass: ']].forEach(([f, w, wy]) => { const pi = e[f], who = bosWho(pi), nm = P(pi); if(!who || !nm) return;
    if(f === 'assist') sub.push(['pass: ' + nm, 'pass: ' + (who === 'You' ? 'you' : who)]); else sub.push([nm + w, who === 'You' ? 'You' + wy : who + w]); }); });
  if(!sub.length) return run();
  const b0 = banner, fix = t => typeof t === 'string' ? sub.reduce((s, [a, b]) => s.split(a).join(b), t) : t;
  banner = function(t){ return b0.apply(this, [fix(t)].concat([].slice.call(arguments, 1))); };
  try{ return run(); } finally { banner = b0; } }
// ======================= PHONE =======================
function bosOnScreen(d){
  if(G && G.guest && BOS.d && BOS.d.id === d.id){ BOS.d = d; return; }
  BOS.d = d;
  if(!BOS.Gs) BOS.Gs = Link.screens.guest({delay: 100, onBase: base => bosBuild(base), apply: (a, b, u, lerp) => bosApply(a, b, u, lerp), onEvents: list => bosEvents(list)});
}
function bosBuild(base){
  if(!BOS.d || !base || !base.cfg || base.pid !== BOS.d.id) return;
  if(G && G.guest && G.link && G.link.id === base.cfg.id) return;
  if(!boPartReady('play')) return boNeed('play', () => bosBuild(base));
  BOS.base = base; BOS.end = null; BOS.notes = {};
  const cfg = Object.assign({}, base.cfg, {seats: base.cfg.seats.map(s => Object.assign({}, s, {local: s.g === BOS.d.g}))});
  BOS.mine = cfg.seats.find(s => s.local);
  // the people: me = seat 0 (the game builds MY touch pad), the others = 10 + g (no keys, no pad) — the same order as on the host
  const H = cfg.seats.map(s => ({name: s.name, side: s.side, seat: s.local ? 0 : 10 + s.g}));
  const keep = {kind: SET.kind, size: SET.size, level: SET.level, theme: SET.theme, who: SET.who}, nm = BO.newMatch;
  setKind(base.cfg.kind); SET.size = base.size; SET.level = base.level; SET.theme = base.theme;   /* lk-9d: the host's pitch size, never this phone's own last pick */ SET.who = H.some(h => h.side === 1) ? 'duo' : H.length > 1 ? 'coop' : 'robot';
  BO.newMatch = function(o){ o.seed = base.seed; o.names = base.names; o.form0 = base.forms[0]; o.form1 = base.forms[1]; o.humans = H; return nm.call(this, o); };
  try{ if(G) cancelAnimationFrame(G.raf); hideResult(); startMatch(); } finally { BO.newMatch = nm; Object.assign(SET, keep); }
  if(!G) return; cancelAnimationFrame(G.raf);
  G.guest = {g: BOS.d.g, side: BOS.mine.side, host: base.host}; G.link = cfg; G.humans = [H.find(h => h.seat === 0)].concat(H.filter(h => h.seat !== 0)); G.mode = H.some(h => h.side === 1) && H.some(h => h.side === 0) ? 'duo' : 'robot';
  G.tn = base.tn.slice(); G.view = bosView(); G.cam = null; buildPads(); checkTurn(); BOS.ci = G.M.ctrls.findIndex(c => c.seat === 0);
  $('scr-play').classList.add('bos-own', 'bos-guest'); bosRoadPill();
  if(BOS.pad) BOS.pad.stop(); BOS.pad = Link.screens.pad(BOS.d); BOS.last = performance.now();
  const loop = now => { if(!G || !G.guest) return; const dt = Math.min(0.05, Math.max(0, (now - BOS.last) / 1000)); BOS.last = now; G.last = now;
    if(!G.paused && !G.turnPause) readInputs();   // the game's own touch pad → BO.input / BO.key on MY ctrl → the host (wraps below)
    updateCam(dt); drawFrame(now / 1000); drawRadar(); hud(now); G.raf = requestAnimationFrame(loop); };
  G.raf = requestAnimationFrame(loop);
}
function bosApply(a, b, u, lerp){
  if(!G || !G.guest) return; const M = G.M;
  const P = lerp(a, b, u, {phase: 1, half: 1, score: 1, done: 1, winner: 1, golden: 1, kickSide: 1, rs: 1, pens: 1, nut: 1, shout: 1, cards: 1, tw: 1, pz: 1, c: 1, phaseT: 1});   /* lk-9d: phaseT jumps to 0 when the phase changes — never blend it */
  for(const k in b){ if(k === 'p' || k === 'b' || k === 'c' || k === 'pz' || k === 'sh') continue; M[k] = (typeof b[k] === 'number' && typeof P[k] === 'number') ? P[k] : b[k]; }
  // players + ball: the NEWEST picture whole, positions glide (a restart teleport jumps)
  b.p.forEach((src, i) => { const q = M.players[i], A = a.p[i] || src; if(!q) return; for(const k in src) q[k] = src[k];
    ['x', 'y', 'z'].forEach(k => { if(typeof A[k] === 'number' && Math.abs(src[k] - A[k]) < 6) q[k] = A[k] + (src[k] - A[k]) * u; }); });
  { const B = M.ball, A = a.b || b.b; for(const k in b.b) B[k] = b.b[k]; ['x', 'y', 'z'].forEach(k => { if(typeof A[k] === 'number' && Math.abs(b.b[k] - A[k]) < 8) B[k] = A[k] + (b.b[k] - A[k]) * u; }); }
  (b.c || []).forEach((c, i) => { const q = M.ctrls[i]; if(!q) return; q.pi = c.pi; q.star = c.st; q.mo = c.mo; });
  if(b.sh) G.shoutShow = b.sh.slice();
  if(!!b.pz !== !!G.paused){ G.paused = !!b.pz; try{ UI.pauseIcon($('pause-btn'), G.paused); }catch(e){} }
}
// the game's own sounds / words / beats (the host's engine events) — a phone never ends a match itself
function bosEvents(list){ if(!G || !G.guest || !list) return; const l2 = list.filter(e => e.k !== 'end'); try{ bosYou(l2, () => BOS.raw.handleEvents(l2)); }catch(e){ console.error('bos events', e); } }
// ▼ over MY player (my colour), drawn after the game's own frame
function bosMark(){ if(!V || !G || !G.M) return; const M = G.M, c = M.ctrls[BOS.ci >= 0 ? BOS.ci : 0], p = c && M.players[c.pi]; if(!p) return;
  const f = V.P(p.x, p.y, 2.55); if(!f) return; const cv = $('pitch'), g = cv.getContext('2d'), k = G.dpr || 1, s = Math.max(7, Math.min(13, V.sc(p.x, p.y, 2) * 0.3)), col = TEAM_COL[p.side];
  g.save(); g.setTransform(k, 0, 0, k, 0, 0); g.fillStyle = col; g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.moveTo(f[0] - s, f[1] - s * 1.3); g.lineTo(f[0] + s, f[1] - s * 1.3); g.lineTo(f[0], f[1]); g.closePath(); g.fill(); g.stroke();
  g.restore(); }
function bosRoadPill(){ let el = document.getElementById('bos-road'); if(!el){ el = document.createElement('div'); el.id = 'bos-road'; el.className = 'bos-road'; $('stage').appendChild(el); }
  const upd = () => { try{ const me = G && G.guest ? Link.seat() : null, r = Link.screens.road(me); el.textContent = r.icon + ' ' + (r.ms != null ? r.ms + ' ms' : r.word); el.classList.toggle('server', r.k === 'server'); }catch(e){} };
  upd(); clearInterval(BOS.road); BOS.road = setInterval(upd, 1000); }
function bosEnd(d){ if(!G || !G.guest || !G.link || d.id !== G.link.id || G.over) return; BOS.end = d; G.over = true; setTimeout(() => { if(G && G.guest && BOS.end === d) bosCard(d); }, 1200); }
function bosCard(d){
  const me = BOS.mine, s = me.side, w = d.winner, won = w === s, draw = w < 0, x = (d.ppl.find(p => p.name === S.player) || {g: {}}), g = x.g || {};
  const team = d.ppl.filter(p => p.side === s).length > 1, wn = w >= 0 ? d.tn[w] : '';
  UISound.play(won ? 'success' : draw ? 'pop' : 'error'); if(FX && won) confetti(['⚽', '🏆', '⭐', '🚀', '🎉'], 34);
  const L0 = G.link; G.link = null;
  try{ BoFrame.result({win: draw ? null : won, icon: won ? '🏆' : draw ? '🤝' : '💪', title: won ? (team ? 'Your team wins!' : 'You win!') : draw ? 'A draw!' : wn + (/ \+ /.test(wn) || /^Robo /.test(wn) ? ' win!' : ' wins!'),
    stars: null, score: null, stats: [['⚽', d.score[s] + ' – ' + d.score[1 - s] + (d.pens ? ' (pens ' + d.pens[s] + '–' + d.pens[1 - s] + ')' : '')], ['🥅', (g.goals || 0) + ' goals'], ['🅰️', (g.assists || 0) + ' assists'], ['🌀', (g.tricks || 0) + ' tricks'],
      d.nokeeper ? ['🥜', (g.nutmegs || 0) + ' nutmegs'] : ['📣', (g.shoutSaves || 0) + ' shout saves'], ['⚡', (x.perfects || 0) + ' perfect'], ['⏱', fmt(d.secs)]],
    tip: won ? '' : pickOne(COACH), save: '⏳ ' + d.host + ' saves it for you…'}); } finally { G.link = L0; }
  const row = $('result-card').querySelector('.gf-r-btns');
  if(row){ row.innerHTML = '<button class="btn sp-btn sp-primary" id="bos-wait" data-sound="none" disabled>⏳ ' + UI.esc(d.host) + ' starts the next one</button><button class="btn soft sp-btn sp-secondary" id="bos-room" data-sound="none">◀ Room</button><button class="btn soft sp-btn sp-secondary" id="bos-exit" data-sound="none">🚪 Leave</button>';
    $('bos-room').onclick = () => { UISound.play('tap'); bosGuestOff(); hideResult(); backToMenu(); openCover(); if(BOL.C) Link.cover.show(BOL.C); };
    $('bos-exit').onclick = () => { UISound.play('tap'); try{ Link.leave(); }catch(e){} bosGuestOff(); hideResult(); backToMenu(); }; }
  const n = BOS.notes[S.player]; if(n){ const el = $('save-note'); if(el) el.innerHTML = n; }
}
function bosGuestOff(){ if(BOS.pad){ BOS.pad.stop(); BOS.pad = null; } if(G && G.guest){ cancelAnimationFrame(G.raf); G.guest = null; G.link = null; } BOS.d = null; clearInterval(BOS.road);
  const el = document.getElementById('bos-road'); if(el) el.remove(); const sp = $('scr-play'); if(sp) sp.classList.remove('bos-own', 'bos-guest'); }
const BOS_CSS = '.bos-road{position:absolute;left:8px;bottom:calc(var(--safe-b,10px) + 4px);z-index:7;font:800 11.5px/1 Nunito,sans-serif;padding:5px 10px;border-radius:999px;background:rgba(10,14,30,.72);color:#BFF7CF;border:1.5px solid rgba(124,242,156,.6);pointer-events:none;white-space:nowrap}.bos-road.server{color:#BFEAFF;border-color:rgba(159,227,255,.6)}' +
  '#scr-play.bos-own .bol-legend{display:none !important}#scr-play.bos-own #pads .stick ~ .bos-road{display:none}';
// ---------- wire (once, from bolOpen) ----------
function bosWire(){
  if(BOS.wired || !(window.Link && Link.pads && Link.screens)) return; BOS.wired = true; BOL_ROOM.screens = true;
  const st = document.createElement('style'); st.id = 'bos-css'; st.textContent = BOS_CSS; (document.head || document.documentElement).appendChild(st);
  const nm = BO.newMatch; BO.newMatch = function(o){ const M = nm.apply(this, arguments); M.seed0 = o.seed; M.names0 = (o.names || [[], []]).map(a => a.slice()); return M; };   // the host's seed + names travel in the base
  // a phone's copy never steps — its touch pad goes to the host instead (MY ctrl only)
  ['input', 'key', 'shout', 'throwTo'].forEach(fn => { const f0 = BO[fn]; BO[fn] = function(M, ci, a, b, c){
    if(G && G.guest && M === G.M){ if(ci !== BOS.ci || !BOS.pad) return false;
      if(fn === 'throwTo'){ const k = 'throw:' + a; BOS.pad.btn(k, true); setTimeout(() => BOS.pad && BOS.pad.btn(k, false), 150); return true; }   // 🙌 lk-9d → the host throws it
      if(fn === 'input'){ const m = Math.hypot(a, b); BOS.pad.stick(c ? a / (m || 1) : a * Math.min(0.95, m) / (m || 1), c ? b / (m || 1) : b * Math.min(0.95, m) / (m || 1), c ? 'far' : null); }
      else if(fn === 'key') BOS.pad.btn('key:' + a, b);
      else { BOS.pad.btn(a > 0 ? 'sh+' : 'sh-', true); setTimeout(() => BOS.pad && BOS.pad.btn(a > 0 ? 'sh+' : 'sh-', false), 120); }
      return; }
    return f0.apply(this, arguments); }; });
  if(boPartReady('play')) bosWirePlay(); else boNeed('play', () => bosWirePlay());
  Link.pads.config({onScreen: d => bosOnScreen(d), onScreenPause: (on, by) => { if(G && G.guest){ G.paused = on; banner(on ? '⏸ ' + (by || BOS.base.host) + ' paused' : '▶ ' + (by || BOS.base.host) + ' — play on!', on ? 'gold' : 'good'); } }});
  Link.on('bos:end', d => bosEnd(d));
  Link.on('bos:note', d => { if(!d || d.name !== S.player) return; BOS.notes[d.name] = d.html; if(BOS.end){ const el = $('save-note'); if(el) el.innerHTML = d.html; } });
  Link.on('hostleft', () => { if(G && G.guest){ const h = BOS.base ? BOS.base.host : 'The host'; bosGuestOff(); hideResult(); backToMenu(); openCover(); UI.toast('👋 ' + h + ' ended the game'); } });
  // host: bolGo as today + 📱 screen pads + the pictures
  const go0 = bolGo; bolGo = function(){
    const own = bosOwnRoom(); bosHostStop();
    const sc = Link.pads.screen; if(own) Link.pads.screen = o => sc(Object.assign({}, o, {screen: true}));
    try{ go0.apply(this, arguments); } finally { Link.pads.screen = sc; }
    if(own && G && G.link && !G.link.tv){ bosHostStart(); $('scr-play').classList.add('bos-own'); bosRoadPill(); } };
  const bt0 = bolBtn; bolBtn = function(g, k, on){ if(bosHostBtn(g, k, on)) return; return bt0.apply(this, arguments); };
  // an own-screen phone sends PITCH directions (its own camera) → the host never turns them with ITS camera
  const in0 = bolInputs; bolInputs = function(){ if(!BOS.H || !V) return in0.apply(this, arguments); const k0 = V.k2w; V.k2w = (x, y) => ({x, y}); try{ return in0.apply(this, arguments); } finally { if(V) V.k2w = k0; } };
}
function bosWirePlay(){
  if(BOS.playWired) return; BOS.playWired = true;
  BOS.raw.handleEvents = handleEvents; handleEvents = function(list){ if(BOS.H && G && G.link && !G.guest && list && list.length){ BOS.H.event(list); const a = arguments; return bosYou(list, () => BOS.raw.handleEvents.apply(this, a)); } return BOS.raw.handleEvents.apply(this, arguments); };
  // 🟦 / 🟥 lk-9d: on an own screen "mine" = MY side (gold banners · confetti · the 📣 hint) — the 📺 TV keeps every person's side
  const im0 = isMine; isMine = function(side){ if(bosOwnOn()){ const me = G.guest ? BOS.mine : bosMine(); if(me) return side === me.side; } return im0.apply(this, arguments); };
  const fm0 = finishMatch; finishMatch = function(){ if(G && G.guest) return; const own = !!BOS.H; if(own) bosSendEnd(); const r = fm0.apply(this, arguments);
    if(own){ bosHostStop(); setTimeout(() => { try{ bosHostCard(); }catch(e){} }, 0); } return r; };   // after BlasOff_link's own card row
  const pn0 = putNote; putNote = function(i, html){ const r = pn0.apply(this, arguments); try{ const h = BOS.H || (G && G.link && !G.guest) ? G.humans[i] : null, s = h && G.link.seats.find(x => x.name === h.name && !x.local); if(s) Link.send('bos:note', {name: h.name, html}, {sure: true, to: s.lseat}); }catch(e){} return r; };
  const tp0 = togglePause; togglePause = function(){ if(G && G.guest){ if(BOS.pad && !G.over) BOS.pad.pause(!G.paused); return; } return tp0.apply(this, arguments); };
  const bm0 = backToMenu; backToMenu = function(){ if(G && G.guest) bosGuestOff(); else bosHostStop(); clearInterval(BOS.road); const el = document.getElementById('bos-road'); if(el) el.remove(); const sp = $('scr-play'); if(sp) sp.classList.remove('bos-own', 'bos-guest'); return bm0.apply(this, arguments); };
  const dr0 = drawRadar; drawRadar = function(){ const r = dr0.apply(this, arguments); if(G && (G.guest || BOS.H)) bosMark(); return r; };   // ▼ me — on the host's phone too
  const vm0 = viewMode; viewMode = function(){ if(G && G.link && !G.link.tv && (G.guest || BOS.H || bosOwnRoom())) return bosView(); return vm0.apply(this, arguments); };
}
GameParts.loaded('BlasOff_screens', 'lk-9d');
