
/* 📱 SCREENS (lk-9c, 📡 Multiplayer chat — LinkKit plan §55p look test → §55q as built): 🏎️ Turbo Trail, everyone on their OWN screen = each phone its OWN road.
   Born split: this part (Turbo_screens) + the shared LinkScreens come with the room (Turbo_link's tblOpen) · the 4th choice on the 📱 sheet (TBL_ROOM.screens).
   The host's phone runs the unchanged 👥 duo race AND drives (= 🎮 Host + play, no TV); the other phone shows the SAME race from its own car:
   one full road (the solo look), the friend's car on it as the one rival, the game's own touch pad.
     host:  tblGo() as today (seats · 📴 drop → 🤖 · ⏸ · saves for both) + Link.screens.host: base = level · world · seed · names · looks · lanes ·
            picture 20× a second = the race minus its fixed parts: both cars · the road things near the cars (each with an id, 1 cm) · warnings ·
            text pops · clock / countdown · events (sounds · banners · 🎬 driver beats · crowd) with WHOSE car (G.cur) + the host time ·
            ONE road on its own screen (its car) · the friend's moments = named lines only ("💥 Ben crashed!" · "🏎️ You passed Ben!") ·
            🏁 ITS player's card (my numbers · my avatar · a small 🥇 🥈 row · 🔁 Race again · ◀ Room · 🚪 Leave) · tbs:end (both rows) →
            each phone its OWN card · it saves for both (as 👥 same-device play) and sends each person's save note to their phone (tbs:note)
     phone: the same race from the base (startGame with the host's seed) → never steps: the NEWEST picture whole, only positions glide
            (cars · road things by id) · scenery from the same seeded dice (never sent) · trails / dust / drift marks made here · draw = MY road
            (withPlayer(me) + the friend as the one rival) · MY pad → Link.screens.pad (stick ◀ ▶ ▲ ▼ + 🦘 + 🌀 = the 🅰 pad lines, a tablet keyboard too) ·
            ⚡ / 🌍 pill · 🏁 MY card (my numbers · my avatar · my save note · ⏳ the host starts the next race · ◀ Room · 🚪 Leave) ·
            🔁 the host's next race rebuilds here · host gone → back to the cover
   Top level only DEFINES (od-1 / lk-9a): tbsWire() installs every wrap, from tblOpen (after Turbo_link's own wraps, so these sit on top). */
const TBS = {wired: false, H: null, Gs: null, pad: null, d: null, base: null, lastBase: null, built: '', me: -1, last: 0, road: null, rec: null, ids: new WeakMap(), nid: 0,
  held: {}, end: null, keepTheme: null, ownHost: false, notes: {}, endCfg: null, inUpd: false, cnt0: false, loc: null, raw: null};
const TBS_GSKIP = {L: 1, T: 1, opts: 1, rT: 1, rD: 1, rL: 1, ghosts: 1, rec: 1, objs: 1, deco: 1, fx: 1, marks: 1, warns: 1, rivals: 1, duo: 1, link: 1, curve: 1, seed: 1, lvl: 1,
  ghostRace: 1, last: 1, t0: 1, pausedAt: 1, pausedTotal: 1, next: 1, nextDeco: 1, cur: 1, wx: 1, stormRate: 1, guest: 1, over: 1, endAt: 1, paused: 1};
const TBS_CSKIP = {look: 1, who: 1, p: 1, warns: 1, lastBeep: 1, nextDis: 1};
const TBS_PSKIP = {tbb: 1, held: 1, tbbCoin: 1};
const TBS_OSKIP = {crossers: 1};
function tbsR2(v){ return Math.round(v * 100) / 100; }
function tbsVal(v){ if(typeof v === 'number') return tbsR2(v); if(Array.isArray(v)) return v.map(tbsVal); if(v && typeof v === 'object'){ const o = {}; for(const k in v) if(typeof v[k] !== 'function') o[k] = tbsVal(v[k]); return o; } return v; }
function tbsCopy(o, skip){ const out = {}; for(const k in o){ if(skip[k] || k.charAt(0) === '_' || (skip === TBS_GSKIP && DUO_SW.indexOf(k) >= 0)) continue; const v = o[k]; if(typeof v === 'function' || v === undefined) continue; out[k] = tbsVal(v); } return out; }
function tbsId(o){ let i = TBS.ids.get(o); if(i == null){ i = ++TBS.nid; TBS.ids.set(o, i); } return i; }
// the moving picture (host): G minus its fixed parts · both cars · the road things the two cars can see (behind 14 m … ahead 70 m)
function tbsPic(){
  if(G.duo) duoSave(G.cur);
  const m = tbsCopy(G, TBS_GSKIP), lo = duoBack() - 14, hi = Math.max(G.duo[0].p.d, G.duo[1].p.d) + 70;
  m.c = G.duo.map(P => { const c = tbsCopy(P, TBS_CSKIP); c.p = tbsCopy(P.p, TBS_PSKIP); c.w = (P.warns || []).map(w => tbsCopy(w, {})); return c; });
  m.o = G.objs.filter(o => o.kind === 'amb' || (o.d + (o.len || 0) > lo && o.d < hi)).map(o => { const c = tbsCopy(o, TBS_OSKIP); c.i = tbsId(o); return c; });
  m.fx = G.fx.filter(f => !f.trail && !f.dust && f.ch !== '💧').map(f => tbsCopy(f, {}));
  m.pz = G.paused ? 1 : 0; return m; }
function tbsOwnRoom(){ try{ return !!(Link.cover && Link.cover.state && (Link.cover.state() || {}).own); }catch(e){ return false; } }
function tbsOn(){ return !!(G && G.duo && G.link && (G.guest || TBS.H)); }
function tbsMine(){ if(!G || !G.link) return -1; if(G.guest) return TBS.me; const s = (G.link.seats || []).find(x => x.local); return s ? s.g : -1; }
// ======================= MOMENTS (both sides) =======================
// every sound / banner / beat / crowd word inside the race step is recorded with WHOSE car it was (G.cur) · g = the countdown (both cars) ·
// o = outside a car's step (the end of the race: the cards say it, so phones skip it)
const TBS_EV = ['showBanner', 'party', 'tbbHit', 'cheerSay', 'confetti', 'say'];
function tbsWorld(){ return !!(TBS.cnt0 && G && G.cur === 0); }
function tbsRec(k, a){ if(TBS.rec && G && G.duo) TBS.rec.push({k, a: Array.from(a).map(x => typeof x === 'number' ? tbsR2(x) : x), i: G.cur, g: tbsWorld() ? 1 : 0, o: TBS.inUpd ? 0 : 1}); }
// the FRIEND's car on my road (Q2): only its 🎬 beat + a few named lines — "💥 Ben crashed!" · "⏰ Ben ran out of time!" · the shared road's barrier
function tbsFriendLine(i, a){ const t = String(a[0] || ''), who = G.duo[i] ? G.duo[i].who : '';
  if(/ran out of time/.test(t)) return ['⏰ ' + who + ' ran out of time!', 'bad'];
  if(a[1] === 'bad' && /crash|bonk|spun|💥/i.test(t)) return ['💥 ' + who + ' crashed!', 'bad'];
  if(/ahead — slow down/.test(t)) return [t, a[1]];
  return null; }
// host: the friend's moments inside its step → skipped (or one named line) · its own car + the countdown as always · beats always run (they hold the hit-stop)
function tbsHostSkip(k, a){
  if(!TBS.H || !TBS.inUpd || !G || !G.duo || G.guest) return false; const me = tbsMine(); if(me < 0 || G.cur === me || tbsWorld()) return false;
  if(k === 'showBanner'){ const l = tbsFriendLine(G.cur, a); if(l) TBS.raw.showBanner(l[0], l[1]); return true; }
  return k === 'party' || k === 'confetti' || k === 'say' || k === 'snd'; }
function tbsMyText(t){ return typeof t === 'string' && G && G.duo && G.duo[tbsMine()] ? t.replace(G.duo[tbsMine()].who + ': ', '') : t; }
// ======================= HOST =======================
function tbsHostStart(){
  if(!G || !G.link || G.guest || !G.duo) return;
  const C = TBL.cfg; TBS.nid = 0; TBS.ids = new WeakMap(); TBS.notes = {}; TBS.endCfg = null;
  TBS.base = {pid: TBL.pads ? TBL.pads.id : C.id, cfg: C, host: S.player, seed: G.seed, level: G.lvl, theme, names: C.names.slice(), looks: G.duo.map(P => Object.assign({}, P.look)), lanes: G.duo.map(P => tbsR2(P.p.ax))};
  TBS.H = Link.screens.host({id: TBS.base.pid, base: TBS.base, pic: tbsPic});
}
function tbsHostStop(){ if(TBS.H){ TBS.H.stop(); TBS.H = null; } }
// 🏁 the end (host): every row → the phones (each phone makes its OWN card) · then ITS player's card here
function tbsRows(){
  duoSave(G.cur); const L = G.L;
  return G.duo.map((P, i) => { const cleared = !!P.cleared, place = cleared ? P.place : 3, won = cleared && place === 1;
    return {i, who: P.who, col: P.look ? P.look.col : 0, cleared, place, secs: Math.max(1, Math.round(P.raceTime)), dist: Math.round(Math.min(P.p.d, L.length)), score: Math.round(P.score), coins: P.coins, crashes: P.crashes,
      stars: !cleared ? 0 : (won && P.crashes <= 1) ? 3 : P.crashes <= 3 ? 2 : 1}; }); }
function tbsWinner(rows){ const s = rows.slice().sort((a, b) => a.place - b.place || b.dist - a.dist || b.score - a.score); return s[0].cleared || s[0].dist > s[1].dist ? s[0].i : -1; }
function tbsSendEnd(rows, win){
  if(!TBS.H || !G || !G.duo) return;
  Link.send('tbs:end', {id: TBS.base.pid, rows, win, title: win >= 0 ? rows[win].who + ' wins!' : 'A tie!', host: S.player, saved: rows.filter(r => r.dist > 20 && r.who !== TBL_BOT).map(r => r.who)}, {sure: true});
}
function tbsHostCard(rows, win){
  if(!G || !G.duo || G.guest || !$('result-card')) return; const me = tbsMine(), r = rows[me]; if(!r) return;
  tbsCard({rows, win, title: win >= 0 ? rows[win].who + ' wins!' : 'A tie!'}, me, null);
  TBS.ownHost = true;
}
// one card maker for both sides: MY numbers · MY avatar · the winner named (never "You") · a small 🥇 🥈 row · my save note
function tbsCard(d, me, host){
  const r = d.rows[me], won = d.win === me, none = d.win < 0;
  const L0 = G.link; G.link = null;   // the 📡 link's card wrapper puts the WINNER on the card — this card is MINE
  try{ GF.result({wrap: $('result'), card: $('result-card'), win: none ? null : won, icon: won ? '🏆' : none ? '🤝' : '💪', title: d.title, stars: r.stars,
    sub: won || none ? '' : r.cleared ? '🏁 You finished 2nd — great race!' : '💪 Good race — ' + r.dist + ' m!', score: r.score,
    stats: [['🏁', r.cleared ? fmt(r.secs * 1000) : r.dist + ' m'], ['🪙', r.coins + ' coins'], ['💥', r.crashes + ' bumps']],
    save: host ? (d.saved && d.saved.indexOf(S.player) < 0 ? null : '⏳ ' + host + ' saves it for you…') : 'Saving your score…',
    buddy: {name: S.player, av: myAvatar(S.player)}, comic: false, confetti: false,
    levels: host ? null : () => backToMenu(), levelsText: '🎚️ Races', again: host ? null : () => tblGo(), againText: '🔁 Race again'}); } finally { if(G) G.link = L0; }
  const order = d.rows.slice().sort((a, b) => (b.i === d.win) - (a.i === d.win) || a.place - b.place || b.dist - a.dist);
  const pod = '<div class="tbs-pod">' + order.map((x, k) => '<span style="--pc:' + COLORS[x.col] + '">' + (k ? '🥈' : '🥇') + ' ' + UI.esc(x.who) + ' · ' + (x.cleared ? '🏁 ' + fmt(x.secs * 1000) : x.dist + ' m') + '</span>').join('') + '</div>';
  const sn = $('save-note'), st = $('result-card').querySelector('.gf-r-stats'); if(sn) sn.insertAdjacentHTML('beforebegin', pod); else if(st) st.insertAdjacentHTML('afterend', pod);
  const n = TBS.notes[S.player]; if(n) tbsNote(n);
}
function tbsNote(html){ const n = $('save-note'); if(n) n.innerHTML = html; }
// saves (host): the same server call as the game's own saveWin — each person's note goes to THEIR phone (mine stays here)
function tbsSave(lvl, extra, tries, who){
  if(!TBS.H || !G || !G.link || !who || who === TBL_BOT) return TBS.raw.saveWin.apply(this, arguments);
  tries = tries || 0; const cfg = TBS.endCfg = TBS.endCfg || G.link;
  const p = S.progress[who] || (S.progress[who] = {unlocked: 0, tokens: [], best: []}); if(extra.cleared) p.unlocked = Math.max(p.unlocked, lvl + 1);
  google.script.run.withSuccessHandler(res => {
      const best = (p.best || [null, null, null, null, null]).slice(); if(res && res.best) best[lvl] = res.best;
      S.progress[who] = {unlocked: res.unlocked, tokens: res.tokens, best}; flushPending(); tbsNoteFor(who, '<b>' + UI.esc(who) + ':</b> ' + saveText(res || {}), cfg);
    }).withFailureHandler(err => {
      if(tries < 1){ setTimeout(() => tbsSave(lvl, extra, tries + 1, who), 1200); return; }
      writePending(readPending().concat([{name: who, lvl, extra}])); tbsNoteFor(who, '⚠️ Could not save yet — it will be sent again next time.', cfg);
    }).saveLevelResult(GAME_ID, who, lvl, extra);
}
function tbsNoteFor(name, html, cfg){
  TBS.notes[name] = html; if(name === S.player){ tbsNote(html); return; }
  const s = cfg && cfg.seats.find(x => x.name === name && !x.local); if(s) try{ Link.send('tbs:note', {id: cfg.id, name, html}, {sure: true, to: s.lseat}); }catch(e){}
}
// ======================= PHONE =======================
function tbsOnScreen(d){
  if(G && G.guest && TBS.d && TBS.d.id === d.id){ TBS.d = d; return; }   // the same race (a 🔁 rejoin) → carry on, the base comes again
  TBS.d = d;
  if(!TBS.Gs) TBS.Gs = Link.screens.guest({delay: 100, onBase: base => { TBS.lastBase = base; tbsBuild(base); }, apply: (a, b, u) => tbsApply(a, b, u), onEvents: list => tbsEvents(list)});
  else if(TBS.lastBase && TBS.lastBase.pid === d.id) tbsBuild(TBS.lastBase);   // 🔁 the next race's base came before its seat line
}
function tbsBuild(base){
  if(!TBS.d || !base || !base.cfg || base.pid !== TBS.d.id) return;   // the base of THIS race (LinkPads' race id)
  if(G && G.guest && TBS.built === base.pid){ TBS.base = base; return; }
  TBS.base = base; TBS.end = null; TBS.notes = {};
  const me = TBS.d.g, cfg = Object.assign({}, base.cfg, {seats: base.cfg.seats.map(s => Object.assign({}, s, {local: s.g === me}))});   // my seat = this phone's own pad
  if(TBS.keepTheme == null) TBS.keepTheme = theme; const rnd = Math.random; let first = true;
  theme = base.theme; Math.random = () => { if(first){ first = false; return base.seed / 4294967296; } return rnd(); };   // startGame's own seed line → the host's seed
  TBL.cfg = cfg; TBL.starting = true;
  try{ if(G) cancelAnimationFrame(rafId); G = null; hideResult(); startGame(base.level, {duo: base.names[1], link: cfg.id}); }
  finally { Math.random = rnd; TBL.starting = false; }   // the host's world stays while I race (the busy road reads it) — mine comes back when I leave
  cancelAnimationFrame(rafId); if(!G || !G.duo) return;
  G.duo.forEach((P, i) => { P.who = base.names[i]; P.look = Object.assign({}, base.looks[i]); P.p.ax = base.lanes[i]; P.camX = base.lanes[i]; });
  duoLoad(me); TBS.me = me; TBS.built = base.pid; G.guest = {g: me, host: base.host}; G.link = cfg; TBS.held = {}; TBS.loc = [];
  const play = $('scr-play'); play.classList.add('tbl-on', 'tbl-local', 'tbs-own', 'tbs-guest'); layout(); tbsPadFit(); tbsRoadPill();
  if(TBS.pad) TBS.pad.stop(); TBS.pad = Link.screens.pad(TBS.d); TBS.last = performance.now();
  const g0 = G, loop = now => { if(!G || G !== g0 || !G.guest) return; rafId = requestAnimationFrame(loop); const dt = Math.min(0.05, Math.max(0, (now - TBS.last) / 1000)); TBS.last = now;
    if(!G.paused && !G.over) tbsLocal(dt);
    if(window.Cheer) Cheer.pause(!!G.paused); drawFrame(now / 1000); duoHud(); };
  rafId = requestAnimationFrame(loop);
}
// scenery comes from the same seeded dice (never sent) · trails, dust, splashes, drift marks are made on the phone
function tbsLocal(dt){
  const lead = Math.max(G.duo[0].p.d, G.duo[1].p.d), back = duoBack();
  while(G.nextDeco < lead + 160){ const side = DR() < 0.5 ? -1 : 1; G.deco.push({d: G.nextDeco, x: side * (roadW(G.L) / 2 + drand(2.5, 9)), ch: dpick(G.T.deco), s: drand(1.6, 2.6)}); G.nextDeco += drand(4, 9); }
  G.deco = G.deco.filter(o => o.d > back - 30);
  TBS.loc = (TBS.loc || []).filter(f => (f.t += dt) < f.life);
  G.duo.forEach(P => { const p = P.p, px = p.ax - roadCx(p.d);
    if(p.v > 12 && Math.random() < dt * (p.boost > 0 ? 40 : 14)){ const tr = TRAILS[(P.look || LOOK).trail][0]; TBS.loc.push(Object.assign(trailPart(tr, 0, 0, 0.7), {d: p.d - 2.4, x: px + rand(-0.4, 0.4), trail: true, t: 0})); }
    if(p.offroad && p.v > 5 && Math.random() < dt * 14) TBS.loc.push({dust: true, d: p.d - 2, x: px + rand(-1, 1), t: 0, life: 0.6, vy: 0, s: 1});
    if(p.drift && Math.random() < dt * 30) G.marks.push({d: p.d - 1.4, x: px - 0.7}, {d: p.d - 1.4, x: px + 0.7}); });
  G.marks = G.marks.filter(m => m.d > back - 30); if(G.marks.length > 300) G.marks.splice(0, G.marks.length - 300);
}
// the NEWEST picture whole · only positions glide (cars + road things by id)
function tbsApply(a, b, u){
  if(!G || !G.guest || G.over || !b || !b.c) return; const mix = (x, y) => x + (y - x) * u;
  for(const k in b){ if(k === 'c' || k === 'o' || k === 'fx' || k === 'pz') continue; G[k] = b[k]; }
  b.c.forEach((src, i) => { const P = G.duo[i]; if(!P) return; const pa = a && a.c && a.c[i];
    for(const k in src){ if(k === 'p' || k === 'w') continue; P[k] = src[k]; }
    const keep = {tbb: P.p.tbb, held: P.p.held, tbbCoin: P.p.tbbCoin}; for(const k in P.p) if(!(k in src.p) && !TBS_PSKIP[k]) delete P.p[k];
    Object.assign(P.p, src.p, keep); if(pa && Math.abs(pa.p.d - src.p.d) < 12){ P.p.d = mix(pa.p.d, src.p.d); P.p.ax = mix(pa.p.ax, src.p.ax); P.p.z = mix(pa.p.z, src.p.z); P.camX = mix(pa.camX, src.camX); }
    P.warns = src.w || []; });
  const was = new Map(((a && a.o) || []).map(o => [o.i, o]));
  G.objs = b.o.map(o => { const y = Object.assign({}, o), w = was.get(o.i); if(w && typeof w.d === 'number' && Math.abs(w.d - o.d) < 8){ y.d = mix(w.d, o.d); if(typeof o.x === 'number') y.x = mix(w.x, o.x); } return y; });
  G.fx = b.fx.concat(TBS.loc || []);
  if(!!b.pz !== !!G.paused) G.paused = !!b.pz;
  duoLoad(TBS.me);
}
// the race's own moments: MY car + the countdown = the game's own banner / sound / beat / pop (my name stripped from "Ben: …") ·
// the friend's car = its 🎬 beat (seen on my road) + a few named lines · the end of the race = my card says it
function tbsEvents(list){
  if(!G || !G.guest || !list) return; const me = TBS.me;
  list.forEach(e => { if(e.o) return; const mine = e.i === me || e.g;
    try{
      if(e.k === 'tbbHit'){ withPlayer(e.i, () => TBS.raw.tbbHit.apply(null, e.a)); return; }
      if(e.k === 'cheerSay'){ if(mine) withPlayer(e.i, () => TBS.raw.cheerSay.apply(null, e.a)); return; }
      if(e.k === 'snd'){ if(mine) TBS.raw.snd.apply(UISound, e.a); return; }
      if(!mine){ if(e.k === 'showBanner'){ const l = tbsFriendLine(e.i, e.a); if(l) TBS.raw.showBanner(l[0], l[1]); } return; }
      const a = e.a.slice(); if(e.k === 'showBanner') a[0] = tbsMyText(a[0]);
      TBS.raw[e.k].apply(null, a);
    }catch(er){} });
}
// presses on a phone's copy → MY pad (the host's engine decides) — stick from ◀ ▶ ▲ ▼ held · 🦘 a tap · 🌀 held
function tbsPress(act, on){
  if(!(G && G.guest)) return TBS.raw.press.apply(this, arguments);
  if(G.over || !TBS.pad) return; if(act === 'jump'){ if(on && !G.paused){ TBS.pad.btn('jump', true); setTimeout(() => TBS.pad && TBS.pad.btn('jump', false), 120); } return; }
  TBS.held[act] = !!on; G.duo[TBS.me].p.held[act] = !!on; tbsSendPad(); }
function tbsSendPad(){ if(!TBS.pad) return; const h = TBS.held, x = (h.right ? 1 : 0) - (h.left ? 1 : 0), y = (h.down ? 1 : 0) - (h.up ? 1 : 0);
  TBS.pad.stick(x, y, x > 0 ? 'r' : x < 0 ? 'l' : y > 0 ? 'd' : y < 0 ? 'u' : null); TBS.pad.btn('drift', !!h.drift); }
// ⚡ / 🌍 the road pill — host: the friend's road · phone: mine + whose race
function tbsRoadPill(){ let el = document.getElementById('tbs-road'); if(!el){ el = document.createElement('div'); el.id = 'tbs-road'; el.className = 'tbs-road'; $('stage').appendChild(el); }
  const paint = () => { if(!el.isConnected) return; if(!G || !tbsOn() || G.over){ el.style.display = 'none'; return; } el.style.display = '';
    if(G.guest){ const r = Link.screens.road(); el.textContent = r.icon + ' ' + (r.ms != null ? r.ms + ' ms' : r.word) + ' · 📱 ' + TBS.base.host + '\'s race'; el.className = 'tbs-road ' + r.k; }
    else { el.textContent = G.link.seats.filter(s => !s.local).map(s => { const r = Link.screens.road(s.lseat); return r.icon + ' ' + s.name + (r.ms != null ? ' ' + r.ms + ' ms' : ''); }).join(' · '); el.className = 'tbs-road host'; } };
  paint(); clearInterval(TBS.road); TBS.road = setInterval(paint, 1000); }
// 📱 one road per phone: MY car's view, full size (the duo's two views are for one shared screen) · the two cards top-left, MINE first (bigger)
function tbsLayout(){ const r = TBS.raw.layout.apply(this, arguments); if(tbsOn()){ V.views = null; tbsCards(); } return r; }
function tbsCards(){ const me = tbsMine(); [0, 1].forEach(i => { const el = $('dh-' + i); if(!el) return; el.style.left = '0px'; el.style.maxWidth = 'calc(100% - 12px)'; el.style.top = (i === me ? 0 : 34) + 'px'; el.classList.toggle('tbs-me', i === me); }); }
function tbsDrawFrame(t){
  if(!tbsOn()) return TBS.raw.drawFrame.apply(this, arguments);
  const me = tbsMine(); withPlayer(me, () => { const o = G.duo[1 - me], keep = G.rivals;
    G.rivals = [{name: o.who, col: COLORS[o.look.col], d: o.p.d, x: o.p.ax - roadCx(o.p.d), z: o.p.z, decal: DECALS[o.look.decal][0]}]; try{ draw(t); } finally { G.rivals = keep; } });
}
// 🏁 MY OWN result card on a phone
function tbsEnd(d){
  if(!G || !G.guest || !TBS.base || !d || d.id !== TBS.base.pid || G.over) return; G.over = true; TBS.end = d;
  setTimeout(() => { if(!G || !G.guest || TBS.end !== d) return; const won = d.win === TBS.me;
    UISound.play(won ? 'success' : 'pop'); if(won) confetti(['🏁', '🏆', '🎉', G.T.icon], 30);
    if(window.UI && UI.callout) UI.callout.setup(null);
    tbsCard(d, TBS.me, d.host);
    const row = $('result-card').querySelector('.gf-r-btns');
    if(row){ row.innerHTML = '<button class="btn sp-btn sp-primary" id="tbs-wait" data-sound="none" disabled>⏳ ' + UI.esc(d.host) + ' starts the next race</button><button class="btn soft sp-btn sp-secondary" id="tbs-room" data-sound="none">◀ Room</button><button class="btn soft sp-btn sp-secondary" id="tbs-exit" data-sound="none">🚪 Leave</button>';
      $('tbs-room').onclick = () => { UISound.play('tap'); tbsGuestOff(); hideResult(); backToMenu(); openCover(); if(TurboCover) Link.cover.show(TurboCover); };
      $('tbs-exit').onclick = () => { UISound.play('tap'); try{ Link.leave(); }catch(e){} tbsGuestOff(); hideResult(); backToMenu(); }; }
  }, 1200);
}
function tbsGuestOff(){ if(TBS.pad){ TBS.pad.stop(); TBS.pad = null; } if(G && G.guest){ cancelAnimationFrame(rafId); G.guest = null; G.link = null; } TBS.d = null; TBS.built = ''; TBS.end = null; if(TBS.keepTheme != null){ theme = TBS.keepTheme; TBS.keepTheme = null; } clearInterval(TBS.road); const el = document.getElementById('tbs-road'); if(el) el.remove();
  const sp = $('scr-play'); if(sp) sp.classList.remove('tbs-own', 'tbs-guest'); }
// the game's own pad fit ran while the duo hid the pads → fit again now they show (and next frame, once the CSS has applied)
function tbsPadFit(){ try{ applyPadMode(); }catch(e){} requestAnimationFrame(() => { try{ applyPadMode(); if(window.UI && UI.pad) UI.pad.arcAll(document); }catch(e){} }); }
// ---------- wire (once, when the room opens) ----------
const TBS_CSS = '#scr-play.tbs-own .dh:not(.tbs-me){font-size:.72rem;opacity:.92}#scr-play.tbs-own .tbl-legend{display:none}#scr-play.tbs-own .ctl{display:flex !important}#scr-play.tbs-guest button[onclick="endEarly()"]{display:none !important}#scr-play.tbs-own .banner{top:100px}' +
  '.tbs-road{position:absolute;left:6px;top:70px;z-index:12;font:800 11.5px/1 Nunito,sans-serif;padding:5px 10px;border-radius:999px;background:rgba(20,14,36,.72);color:#BFF7CF;border:1.5px solid rgba(124,242,156,.6);pointer-events:none;white-space:nowrap;max-width:70%;overflow:hidden;text-overflow:ellipsis}.tbs-road.server{color:#BFEAFF;border-color:rgba(159,227,255,.6)}.tbs-road.host{color:#fff;border-color:rgba(255,255,255,.4)}' +
  '.tbs-pod{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 8px;margin:4px 0;font-weight:800;font-size:.82rem}.tbs-pod span{padding:3px 9px;border-radius:999px;background:var(--panel);border-left:5px solid var(--pc)}';
function tbsWire(){
  if(TBS.wired || !(window.Link && Link.pads && Link.screens)) return; TBS.wired = true;
  TBS.raw = {layout, drawFrame, press, press2, update, snd: UISound.play, tbbHit, cheerSay, showBanner, party, confetti, say, updateDuo, finishDuo, backToMenu, saveWin, tblBuzz, tblCardRow};
  layout = tbsLayout; drawFrame = tbsDrawFrame; press = tbsPress; saveWin = tbsSave;
  press2 = function(i, act, on){ if(G && G.guest){ if(i === TBS.me) return tbsPress(act, on); return; } return TBS.raw.press2.apply(this, arguments); };
  update = function(){ const was = TBS.inUpd; TBS.inUpd = true; try{ return TBS.raw.update.apply(this, arguments); } finally { TBS.inUpd = was; } };
  TBS_EV.forEach(k => { const f0 = window[k]; window[k] = function(){ tbsRec(k, arguments); if(k !== 'tbbHit' && k !== 'cheerSay' && tbsHostSkip(k, arguments)) return; if(k === 'showBanner' && TBS.H && TBS.inUpd && arguments.length) arguments[0] = tbsMyText(arguments[0]); return f0.apply(this, arguments); }; });
  UISound.play = function(){ if(TBS.rec) TBS.rec.push({k: 'snd', a: Array.from(arguments), i: G ? G.cur : -1, g: tbsWorld() ? 1 : 0, o: TBS.inUpd ? 0 : 1}); if(tbsHostSkip('snd', arguments)) return; return TBS.raw.snd.apply(this, arguments); };
  updateDuo = function(dt){ if(G && G.guest) return; if(!TBS.H) return TBS.raw.updateDuo.apply(this, arguments); TBS.rec = []; TBS.cnt0 = !!(G && G.count > 0);
    try{ return TBS.raw.updateDuo.apply(this, arguments); } finally { const l = TBS.rec; TBS.rec = null; TBS.cnt0 = false; if(l.length && TBS.H) TBS.H.event(l); } };
  finishDuo = function(quiet){
    if(G && G.guest) return;   // a phone never ends (or saves) a race itself
    const own = !!TBS.H, was = G && G.over; if(own && G) TBS.endCfg = G.link;
    const r = TBS.raw.finishDuo.apply(this, arguments);
    if(own && !quiet && !was && G && G.duo){ const rows = tbsRows(), win = tbsWinner(rows), g0 = G; tbsSendEnd(rows, win); tbsHostStop(); setTimeout(() => { if(G === g0) tbsHostCard(rows, win); }, 440); }
    return r; };
  // the host's 🔁 card row (Turbo_link) → 🚪 Leave in an own-screens room · "🏎️ You passed Ben!" on the host's own road too
  tblCardRow = function(){ const r = TBS.raw.tblCardRow.apply(this, arguments); const x = $('tbl-exit'); if(TBS.ownHost && x && G && G.link && !G.link.tv) x.textContent = '🚪 Leave'; return r; };
  tblBuzz = function(g, k, t){ const s = tblSeat(g); if(s && s.local && TBS.H && /passed/.test(t || '')) TBS.raw.showBanner(t, k === 'got' ? 'gold' : ''); return TBS.raw.tblBuzz.apply(this, arguments); };
  backToMenu = function(){ if(G && G.guest) tbsGuestOff(); else tbsHostStop(); TBS.ownHost = false; clearInterval(TBS.road); const sp = $('scr-play'); if(sp) sp.classList.remove('tbs-own', 'tbs-guest'); return TBS.raw.backToMenu.apply(this, arguments); };
  const st = document.createElement('style'); st.id = 'tbs-css'; st.textContent = TBS_CSS; (document.head || document.documentElement).appendChild(st);
  Link.pads.config({onScreen: d => tbsOnScreen(d), onScreenPause: (on, by) => { if(G && G.guest){ G.paused = on; TBS.raw.showBanner(on ? '⏸ ' + (by || TBS.base.host) + ' paused' : '▶ ' + (by || TBS.base.host) + ' — go go go!', on ? 'gold' : ''); } },
    onScreenBuzz: (k, t) => { if(G && G.guest && t && /passed/.test(t)) TBS.raw.showBanner(t, k === 'got' ? 'gold' : ''); }});
  Link.on('tbs:end', d => tbsEnd(d));
  Link.on('tbs:note', d => { if(!d || d.name !== S.player) return; TBS.notes[d.name] = d.html; if(TBS.end) tbsNote(d.html); });
  Link.on('hostleft', () => { if(G && G.guest){ const h = TBS.base ? TBS.base.host : 'The host'; tbsGuestOff(); hideResult(); backToMenu(); openCover(); UI.toast('👋 ' + h + ' ended the game'); } });
  const go0 = tblGo; tblGo = function(){
    const own = tbsOwnRoom(); tbsHostStop(); TBS.ownHost = false;
    const sc = Link.pads.screen; if(own) Link.pads.screen = o => sc(Object.assign({}, o, {screen: true}));
    try{ go0.apply(this, arguments); } finally { Link.pads.screen = sc; }
    if(own && G && G.link){ tbsHostStart(); $('scr-play').classList.add('tbs-own'); layout(); tbsPadFit(); tbsRoadPill(); } };
}
GameParts.loaded('Turbo_screens', 'lk-9c');
