
/* 📡 LK-6 COVER ROOM (lk-6a, 📡 puzzle chat, Aowu 2026-11-17 "go") — the room lives on the game's 🎬 cover instead of a separate lobby page.
   Game: cover option own: C => Link.cover(C, {game, title, page, seats, min, url, name(), av(), label(tv), bot() | false, onStart(), onLink(), onJoined(), picks(el)})   (lk-6b: onJoined · bot: false · picks)
     ④ 📱 Own devices → a sheet ON the cover: 🎮 Host and play · 📺 Room hostess · 🔗 Join a friend
     ① host: a room card (number + QR + ✕) above the 👥 line; each linked phone walks into the line (cover.add / remove); ▶ = "▶ Start · N players"
     ② TV: cover.room({code, hostess: true}) (tv-1) + the big number + QR on the art; 1 player → "▶ Start vs 🤖 …"
     ③ guest: the host's line (host 👑 seat 0), ▶ = "⏳ <host> starts the game" (the captain of a 📺 room: ▶ Start → asks the TV)
   ▶ on the cover → Link.start() + opt.onStart() (host) · the room stays open after a match: the game calls Link.cover.show(C) to come back.
   Link.cover.active(C) · Link.cover.close() · Link.cover.state() (tests) · lk-pp1b: Link.cover.tv(C, o) (📺 station: straight to the hostess room) · Link.cover.start(). Uses GameFrame's own hooks; when GameFrame offers cover.card(node) /
   cover.playText(text, {disabled}) (asked of the 🧱 chat) they are used, else the card goes into .gf-panel and the ▶ text is set here. */
(function () {
  const L = window.Link; if (!L) return;
  let K = null;   // {C, o, mode: null | 'pick' | 'host' | 'tv' | 'join' | 'guest', card, big, sheet, lobby, sig, err}
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const snd = k => { try { if (window.UISound) UISound.play(k); } catch (e) { /* */ } };
  const live = () => !!(K && K.mode && K.mode !== 'pick' && K.mode !== 'join');
  const nm = () => { const o = K.o; return typeof o.name === 'function' ? o.name() : (o.name || ''); };
  const avOf = () => { try { return K.o.av ? K.o.av() : null; } catch (e) { return null; } };
  const digits = () => (L.emoji() || []).map(String);
  const tiles = () => '<div class="lkc-tiles" aria-label="room number">' + digits().map(d => '<div class="lkc-t lkc-n' + (/^\d$/.test(d) ? d : 0) + '">' + esc(d) + '</div>').join('') + '</div>';
  const panel = () => K.C.el.querySelector('.gf-panel');
  const playBtn = () => K.C.el.querySelector('.gf-play');

  function qr(cv) {
    if (!cv || typeof qrcode !== 'function' || !K.o.url) return;
    const q = qrcode(0, 'L'); q.addData(K.o.url + (K.o.url.indexOf('?') < 0 ? '?' : '&') + 'link=' + L.code()); q.make();
    const n = q.getModuleCount(), g = cv.getContext('2d'); cv.width = cv.height = n * 4;
    g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = '#000';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) g.fillRect(c * 4, r * 4, 4, 4);
  }
  // ---------- the pieces on the cover ----------
  function mountCard() {
    if (!K.card) { K.card = document.createElement('div'); K.card.className = 'lkc-card'; K.card.dataset.lkc = '1'; }
    const C = K.C;
    if (typeof C.card === 'function') C.card(K.card);   // 🧱 GameFrame slot (when it exists)
    else if (!K.card.isConnected) { const p = panel(), line = p && p.querySelector('.gf-line'); if (p) p.insertBefore(K.card, line || p.firstChild); }
    C.el.classList.add('lkc-on');
    return K.card;
  }
  function unmountCard() {
    if (K.card) { if (typeof K.C.card === 'function') K.C.card(null); K.card.remove(); K.card = null; }
    if (K.big) { K.big.remove(); K.big = null; }
    K.C.el.classList.remove('lkc-on');
  }
  function closeSheet() { if (K.lobby && K.lobby.close) K.lobby.close(); K.lobby = null; if (K.sheet) { K.sheet.remove(); K.sheet = null; } }
  function sheet(title) {
    closeSheet();
    const s = document.createElement('div'); s.className = 'lkc-sheet';
    s.innerHTML = '<div class="lkc-hd"><span>' + esc(title) + '</span><button class="lkc-close" data-sound="tap" aria-label="Close">✕</button></div><div class="lkc-body"></div>';
    s.querySelector('.lkc-close').onclick = () => { snd('tap'); cancel(); };
    K.C.el.appendChild(s); K.sheet = s;
    return s.querySelector('.lkc-body');
  }
  function cancel() {   // ✕ on the pick / join sheet → back to playing on this device
    closeSheet();
    if (L.status() !== 'idle' && !live()) { try { L.leave(); } catch (e) { /* */ } }
    if (!live()) { K.mode = null; K.C.setMode('solo'); }
  }
  function pick() {
    K.mode = 'pick'; K.own = false;   /* 📱 lk-9 own screens */
    const b = sheet('📱 ' + (K.o.title || 'Play') + ' · own devices');
    if (K.o.pads) {   /* 🕹️ lk-8a: action games — one screen runs the game, phones are the controllers (LinkPads), same Wi-Fi only */
      b.innerHTML = '<div class="lkc-sub">' + (K.o.screens ? '📺 One screen + 🕹️ controllers · or 📱 everyone sees the game on their own phone' : 'One screen shows the game · every phone is a 🕹️ controller · same Wi-Fi') + '</div><div class="lkc-pick">' +
        '<button class="sp-btn sp-primary lkc-tv" data-sound="pop">📺 This screen is the game<small>TV · computer · iPad — everyone plays on a phone</small></button>' +
        '<button class="sp-btn sp-primary lkc-host" data-sound="pop">🎮 Host + play here<small>you play on this screen, friends on their phones</small></button>' +
        (K.o.screens ? '<button class="sp-btn sp-primary lkc-own" data-sound="pop">📱 Everyone on own screen<small>no TV · this phone runs the game and plays · friends see it on theirs</small></button>' +
          '<button class="sp-btn sp-secondary lkc-join" data-sound="pop">🔗 Join a room<small>type the 4 numbers you see on the host\'s screen</small></button></div>'
        : '<button class="sp-btn sp-secondary lkc-join" data-sound="pop">🕹️ Join as a controller<small>type the 4 numbers on the big screen</small></button></div>');   /* 📱 lk-9 own screens */
      b.querySelector('.lkc-host').onclick = () => openRoom(false); b.querySelector('.lkc-tv').onclick = () => openRoom(true); b.querySelector('.lkc-join').onclick = () => join();
      if (K.o.screens) b.querySelector('.lkc-own').onclick = () => openRoom(false, true);
      return;
    }
    b.innerHTML = '<div class="lkc-sub">Each player on their own phone, tablet or computer — same Wi-Fi or 🌍 anywhere</div><div class="lkc-pick">' +
      (ownScreen() ? '<button class="sp-btn sp-primary lkc-host lkc-own" data-sound="pop">📱 Everyone on own screen<small>this phone hosts and plays · friends see the game on theirs</small></button>' : '<button class="sp-btn sp-primary lkc-host" data-sound="pop">🎮 Host and play<small>this device plays too</small></button>') +
      '<button class="sp-btn sp-primary lkc-tv" data-sound="pop">📺 Room hostess<small>this screen = the TV · everyone plays on their own device</small></button>' +
      '<button class="sp-btn sp-secondary lkc-join" data-sound="pop">🔗 Join a friend<small>type the 4 numbers on their screen</small></button></div>';
    b.querySelector('.lkc-host').onclick = () => openRoom(false, ownScreen());
    b.querySelector('.lkc-tv').onclick = () => openRoom(true);
    b.querySelector('.lkc-join').onclick = () => join();
  }
  const OWN_SCREEN_GAMES = {SlaBrall: 1};   // 📱 lk-9: real-time games that already draw the match on every device (🏓 lk-1b)
  function ownScreen() { return !!(K && K.o && (K.o.ownScreen || OWN_SCREEN_GAMES[K.o.game])); }
  async function openRoom(tv, own) {
    closeSheet(); K.mode = tv ? 'tv' : 'host'; K.err = ''; K.sig = ''; K.own = !!own && !tv;   /* 📱 lk-9 own screens */
    const c = mountCard(); c.className = 'lkc-card lkc-wait'; c.innerHTML = '<span class="ui-spin a-bob">' + (tv ? '📺' : '📡') + '</span> Opening the room<span class="lk-dots"></span>';
    if (K.o.onLink) try { K.o.onLink(); } catch (e) { /* */ }
    try { await L.host({game: K.o.game, name: nm(), av: avOf(), seats: K.o.seats || 2, hostess: !!tv, page: K.o.page, label: (K.o.label ? K.o.label(!!tv) : K.o.title) + (K.own ? ' · 📱 own screens' : '')}); }
    catch (e) {
      if (!K || K.mode !== (tv ? 'tv' : 'host')) return;
      snd('error'); K.err = (e && e.message) || 'Could not open the room';
      c.className = 'lkc-card lkc-wait'; c.innerHTML = '<span class="lkc-err">😕 ' + esc(K.err) + '</span> <button class="lkc-btn" data-sound="tap">🔁 Try again</button>';
      c.querySelector('button').onclick = () => openRoom(tv, own); return;
    }
    if (!K || K.mode !== (tv ? 'tv' : 'host')) { try { L.leave(); } catch (e) { /* */ } return; }
    if (tv) K.C.room({code: digits().join(''), hostess: true});
    snd('success'); sync(true);
  }
  function join(code) {
    K.mode = 'join'; if (K.o.onLink) try { K.o.onLink(); } catch (e) { /* */ }
    const b = sheet(K.o.pads ? (K.o.screens ? '🔗 Join a room' : '🕹️ Join as a controller') : '🔗 Join a friend'); const box = document.createElement('div'); b.appendChild(box);   /* 🕹️ lk-8a */
    K.lobby = L.lobby(box, {title: K.o.title, name: nm(), av: avOf(), drawAvatar: K.o.drawAvatar, soloBot: true, code: code || undefined, kind: K.o.kind,
      onJoined: () => { snd('success'); closeSheet(); K.mode = 'guest'; K.sig = ''; if (K.o.onJoined) try { K.o.onJoined(); } catch (e) { /* */ } sync(true); }});   /* lk-6b: + onJoined */
  }
  // ---------- keep the line + card + ▶ in step with the room ----------
  function seatsNow() { return (L.players() || []).filter(p => p.name && (p.on || p.me) && !p.screen); }
  function want() {
    const list = seatsNow(), mine = L.seat();
    if (K.mode === 'tv') return list.filter(p => p.seat > 0).map(p => ({seat: p.seat, name: p.name, av: p.av || undefined, where: 'device'}));
    if (K.mode === 'host') return list.filter(p => p.seat > 0).map(p => ({seat: p.seat, name: p.name, av: p.av || undefined, where: 'device'}));
    if (L.hostess()) return list.filter(p => p.seat > 0).map(p => ({seat: p.seat, name: p.name, av: p.av || undefined, where: 'device'}));   // 📺 room: the TV is spot 1
    return list.map(p => ({seat: p.seat, name: p.name, av: p.av || undefined, where: 'device', host: p.seat === 0}));
  }
  function syncLine(force) {
    const C = K.C, w = want(), sig = w.map(s => s.seat + ':' + s.name + ':' + s.where).join('|');
    if (!force && sig === K.sig) return; K.sig = sig;
    if (K.mode === 'tv' || (K.mode === 'guest' && L.hostess())) {   // tv-1 keeps the LinkKit seats as they are
      if (!C.isHostess) C.room({code: digits().join(''), hostess: true});
      C.lineup.filter(s => !w.some(x => x.seat === s.seat && x.name === s.name)).forEach(s => C.remove(s.seat));
      w.forEach(s => { if (!C.lineup.some(x => x.seat === s.seat && x.name === s.name)) C.add(s); });
      return;
    }
    if (K.mode === 'host') {
      const dev = C.lineup.filter(s => s.where === 'device'), gone = dev.some(s => !w.some(x => x.seat === s.seat && x.name === s.name));
      if (gone) { let s; while ((s = C.lineup.find(x => x.where === 'device'))) C.remove(s.seat); }   // a leave renumbers the line → rebuild it
      w.forEach(s => { if (!C.lineup.some(x => x.seat === s.seat && x.name === s.name)) C.add(s); });
      if (C.lineup[0]) C.lineup[0].host = true;
      return;
    }
    // guest: the host's line — the host on spot 1, you where your seat is
    const host = w.find(s => s.host); if (host) C.add(host);
    let s; while ((s = C.lineup.find(x => x.seat > 0 && !w.some(y => y.seat === x.seat && y.name === x.name)))) C.remove(s.seat);
    w.filter(x => !x.host).forEach(x => { if (!C.lineup.some(y => y.seat === x.seat && y.name === x.name)) C.add(x); });
  }
  function need() { return K.mode === 'tv' ? 1 : (K.o.min || 2); }
  function players() { return seatsNow().filter(p => !(K.mode === 'tv' && p.seat === 0)).length; }
  function hostName() { const h = (L.players() || []).find(p => p.seat === 0); return h && h.name ? h.name : 'the host'; }
  // 🌍 lk-aw: far players on the cover — a line in the room card + 🌍 on their spot (GameFrame paints 📱; we swap the mark)
  function farText() {
    const f = (L.farNames && L.farNames()) || []; if (!f.length) return '';
    const meFar = L.road && L.road() === 'server' && !L.isHost();
    if (meFar) { const o = f.filter(n => n !== nm()); return '🌍 You play from another house' + (o.length ? ' · ' + o.join(', ') + ' too' : '') + ' · a move takes 2–5 s'; }
    return '🌍 ' + (f.length > 2 ? f.length + ' players play' : f.join(' + ') + (f.length > 1 ? ' play' : ' plays')) + ' from another house';
  }
  function markFar() {
    if (!K || !K.C || !K.C.el || !live()) return;
    const f = new Set((L.farNames && L.farNames()) || []);
    K.C.el.querySelectorAll('.gf-spot:not(.gf-add):not(.gf-tv)').forEach(b => {
      const s = (K.C.lineup || []).find(x => String(x.seat) === b.dataset.seat), far = !!(s && f.has(s.name));
      let mk = b.querySelector('.gf-mk'); b.classList.toggle('lkc-farspot', far);
      if (far) { if (!mk) { mk = document.createElement('span'); mk.className = 'gf-mk'; b.appendChild(mk); } if (!mk.dataset.lkcWas) mk.dataset.lkcWas = mk.textContent; mk.textContent = (s.host ? '👑' : '') + '🌍'; b.title = s.name + ' plays from another house'; }
      else if (mk && mk.dataset.lkcWas != null) { mk.textContent = mk.dataset.lkcWas; delete mk.dataset.lkcWas; b.removeAttribute('title'); }
    });
  }
  // 📱 lk-9: each player's road — ⚡ direct (same Wi-Fi, or phone ↔ phone on 5G) · 🌍 the family server (another house) — host: every phone · guest: mine
  function roads() {
    if (!K.own) return '';
    const ps = seatsNow().filter(p => p.seat > 0 && (L.isHost() || p.seat === L.seat())); if (!ps.length) return '';
    return '<div class="lkc-roads">' + ps.map(p => { const r = L.roadOf(L.isHost() ? p.seat : null); return '<span class="lkc-road lkc-' + r.k + '">' + r.icon + ' ' + esc(p.name) + (r.ms != null ? ' · ' + r.ms + ' ms' : ' · ' + r.word) + '</span>'; }).join('') + '</div>';
  }
  /* ⚙️ lk-9a3 (📡 Multiplayer chat, Aowu 2026-11-22 12:59 "game setting should be more clear to choose" → 14:23 "go"): the room card's ⚙️ Game settings box.
     Every setting has its NAME (🎮 Game · 🎚️ Level · 🏟️ Place …) + its value + ▾ → tap = a sheet with EVERY choice as a card (icon · name · one line · ✓ now · 🔒 not unlocked) →
     tap = picked, the card + the label + every phone update. Guests see the same box read-only ("⚙️ Mia picks the game", lk:picks). 📺 Station rooms: "📺 The vote picks".
     The rows of each linked game live HERE (ROWS[room.game]) — they read the game's own settings, so the games' files keep 0 bytes; a game with no rows keeps its old chips. */
  const lksEsc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const lvRows = (names, ok, ui, sub) => [0, 1, 2, 3, 4].filter(i => names[i] != null).map(i => ({v: i, ic: (ui && ui[i] && (ui[i].emoji || ui[i].icon)) || ['🌱', '🐣', '🔥', '⚡', '🌋'][i], name: names[i], sub: (sub && sub[i]) || (ui && ui[i] && ui[i].blurb) || '', lock: ok ? !ok(i) : false}));
  const themeRows = (T, keys) => keys.map(k => ({v: k, ic: T[k].icon || '', name: T[k].name, sub: (T[k].far || []).slice(0, 4).join(' ')}));
  /* eslint-disable no-undef */
  const ROWS = {
    BrawlBuddies: () => { bblFix(); const n = bblNow(), adv = n.way === 'adv', r = [{k: 'way', icon: '🎮', label: 'Game', cur: adv ? 'adv' : 'ring', opts: [{v: 'ring', ic: '🥊', name: 'Ring', sub: '1 v 1 · 3–4 = 🔁 tag teams'}, {v: 'adv', ic: '🗺️', name: 'Brawenture', sub: 'Team up down the street — a story'}],
        pick: (v, done) => { if(v === 'adv') return bblAdvNeed(() => { BBL.way = 'adv'; done(); }); BBL.way = 'ring'; done(); }}];
      if(adv && window.BV){ r.push({k: 'tale', icon: '📖', label: 'Story', cur: ADV.tale, opts: BV.TALES.map((t, i) => ({v: i, ic: t.icon, name: t.name, sub: t.sub || t.about || '', lock: !advTaleOpen(i)})), pick: (v, done) => { ADV.tale = v; advSavePrefs(); done(); }});
        r.push({k: 'diff', icon: '🎚️', label: 'Level', title: 'How hard is the street?', cur: BBL.diff, opts: BV.DIFF_KEYS.filter(d => d !== 'skull').map(d => ({v: d, ic: BV.DIFFS[d].icon, name: BV.DIFFS[d].name, sub: BV.DIFFS[d].sub || ''})), pick: (v, done) => { BBL.diff = v; done(); }}); }
      else { r.push({k: 'lvl', icon: '🎚️', label: 'Level', cur: n.level, opts: lvRows(BB.LEVELS.map(L => L.name), bblLevelOk, LEVEL_UI), pick: (v, done) => { SET.level = v; savePrefs(); done(); }});
        r.push({k: 'theme', icon: '🏟️', label: 'Place', cur: SET.theme, opts: themeRows(THEMES, THEME_KEYS), pick: (v, done) => { SET.theme = v; savePrefs(); done(); }}); }
      return {rows: r, locked: !!BBL.st}; },
    SoulBopper: () => { sblFix(); const n = sblNow(); return {locked: !!SBL.st, rows: [
      {k: 'mode', icon: '🎮', label: 'Game', cur: n.mode, opts: SBL_MODES.map(k => ({v: k, ic: MODES[k].icon, name: MODES[k].name, sub: MODES[k].sub})), pick: (v, done) => { SET.mode = v; savePrefs(); done(); }},
      {k: 'lvl', icon: '🎚️', label: 'Bots', title: 'How good are the bots?', cur: n.level, opts: lvRows(BOP.LEVELS.map(L => L.name), sblLevelOk), pick: (v, done) => { SET.level = v; savePrefs(); done(); }},
      {k: 'theme', icon: '🗺️', label: 'World', cur: SET.theme, opts: themeRows(THEMES, THEME_KEYS), pick: (v, done) => { SET.theme = v; savePrefs(); done(); }}]}; },
    Snakize: () => { snlFix(); const n = snlNow(); return {locked: !!SNL.st, rows: [
      {k: 'mode', icon: '🎮', label: 'Game', cur: n.mode, opts: SNL_MODES.map(k => ({v: k, ic: MODES[k].icon, name: MODES[k].name, sub: MODES[k].sub})), pick: (v, done) => { SET.mode = v; SET.endless = false; if(!snlLevelOk(SET.mode, SET.level)) SET.level = 0; savePrefs(); done(); }},
      {k: 'lvl', icon: '🎚️', label: 'Level', cur: n.level, opts: lvRows(SN.LEVEL_NAMES, i => snlLevelOk(SET.mode, i)), pick: (v, done) => { SET.level = v; savePrefs(); done(); }},
      {k: 'theme', icon: '🗺️', label: 'World', cur: SET.theme, opts: themeRows(THEMES, THEME_KEYS), pick: (v, done) => { SET.theme = v; savePrefs(); done(); }}]}; },
    Turbo: () => { tblFix(); const n = tblNow(); return {locked: !!TBL.st, rows: [
      {k: 'lvl', icon: '🎚️', label: 'Level', cur: n.level, opts: lvRows(LEVELS.map(L => L.name), tblLevelOk, LEVELS), pick: (v, done) => { pendingLvl = v; try{ localStorage.setItem(setupKey('lv'), String(v)); }catch(er){} done(); }},
      {k: 'world', icon: '🗺️', label: 'Road', title: 'Pick the road', cur: n.theme, opts: themeRows(THEMES, THEME_KEYS), pick: (v, done) => { theme = v; savePrefs(); done(); }}]}; },
    BlasOff: () => { bolFix(); const n = bolNow(), r = [
      {k: 'kind', icon: '🎮', label: 'Game', cur: n.kind, opts: BOL_KINDS.map(k => { const m = MODES.find(x => x.k === k) || {}; return {v: k, ic: m.icon, name: m.name, sub: m.sub}; }), pick: (v, done) => { BOL.kind = v; savePrefs(); done(); }},
      {k: 'lvl', icon: '🎚️', label: 'Level', cur: n.level, opts: lvRows(BO.LEVELS.map(L => L.name), bolLevelOk, LEVEL_UI), pick: (v, done) => { SET.level = v; savePrefs(); done(); }},
      {k: 'look', icon: '🏟️', label: 'Pitch', cur: n.theme, opts: themeRows(LOOKS, LOOK_KEYS), pick: (v, done) => { SET.theme = v; savePrefs(); done(); }}];
      if(n.kind !== 'street' && n.kind !== 'shootout') r.push({k: 'team', icon: '👥', label: '2 players', title: 'With 2 phones…', cur: BOL.team === 'coop' ? 'coop' : 'duo', opts: [{v: 'duo', ic: '🆚', name: 'Each other', sub: '1 v 1 — your team vs theirs'}, {v: 'coop', ic: '🤝', name: 'One team', sub: 'Together vs the robots'}], pick: (v, done) => { BOL.team = v; done(); }});
      return {rows: r, locked: !!BOL.st}; },
    PyraDive: () => { pylFix(); const n = pylNow(), r = [
      {k: 'mode', icon: '🎮', label: 'Game', cur: n.mode, opts: PYL_MODES.map(k => ({v: k, ic: PD.MODES[k].icon, name: PD.MODES[k].name, sub: PD.MODES[k].sub || PD.MODES[k].tag || ''})), pick: (v, done) => { PYL.mode = v; savePrefs(); done(); }},
      {k: 'lvl', icon: '🎚️', label: 'Level', cur: n.level, opts: lvRows(PD.LEVELS.map(L => L.name), pylLevelOk, LEVEL_UI), pick: (v, done) => { SET.level = v; savePrefs(); done(); }},
      {k: 'arena', icon: '🏟️', label: 'Arena', cur: n.arena, opts: ARENAS.map(a => ({v: a.k, ic: a.icon, name: a.name, sub: ''})), pick: (v, done) => { SET.arena = v; savePrefs(); done(); }}];
      if(!pylSolo(n.mode)) r.push({k: 'team', icon: '👥', label: '2 players', title: 'With 2 phones…', cur: PYL.team === 'coop' ? 'coop' : 'duo', opts: [{v: 'duo', ic: '⚔️', name: 'Each other', sub: '1 v 1 — 🟧 vs 🟦'}, {v: 'coop', ic: '🤝', name: 'One team', sub: 'Together vs the robots'}], pick: (v, done) => { PYL.team = v; done(); }});
      return {rows: r, locked: !!PYL.st}; },
    Polyplot: () => { const m = plMode(), r = [
      {k: 'mode', icon: '🎮', label: 'Game', cur: m, opts: MODE_KEYS.map(k => ({v: k, ic: MODES[k].icon, name: MODES[k].name, sub: MODES[k].sub})), pick: (v, done) => { plSet('mode', v); if(v === 'coop') UI.toast('🛡️ Co-op: everyone defends one base together'); done(); }},
      {k: 'level', icon: '🎚️', label: 'Level', cur: plLevel(), opts: lvRows(PP.LEVELS.map(L => L.name), null, LEVEL_UI), pick: (v, done) => { plSet('level', v); done(); }}];
      if(m !== 'fort' && m !== 'coop') r.push({k: 'shape', icon: '🗺️', label: 'Board', cur: plShape(), opts: PP.SHAPES.filter(x => x !== 'letter').map(s => ({v: s, ic: PP.SHAPE_INFO[s][0], name: PP.SHAPE_INFO[s][1], sub: PP.SHAPE_INFO[s][2] || ''})), pick: (v, done) => { plSet('shape', v); done(); }});
      r.push({k: 'theme', icon: '🎨', label: 'Look', cur: plTheme(), opts: themeRows(THEMES, THEME_KEYS), pick: (v, done) => { plSet('theme', v); done(); }});
      if(m !== 'coop') r.push({k: 'teams', icon: '👥', label: 'Teams', cur: plTeams() ? '1' : '0', opts: [{v: '0', ic: '👤', name: 'Solo', sub: 'Everyone for themselves · 2–4 players'}, {v: '1', ic: '🤝', name: '2 vs 2', sub: '4 players, two teams'}], pick: (v, done) => { plSet('teams', v); done(); }});
      return {rows: r, locked: !!PPL.st}; },
    WisDeck: () => { if(WBL.st) return {locked: true, rows: [{k: 'game', icon: '🎮', label: 'Game', cur: WBL.st.game, opts: [{v: WBL.st.game, ic: '', name: WB_GAMES[WBL.st.game]}], pick: () => {}}, {k: 'lv', icon: '🎚️', label: 'Level', cur: 0, opts: [{v: 0, ic: '', name: WBL.st.lvText}], pick: () => {}}]};
      const g = WBL.game || 'buzz', far = wbFar(), r = [{k: 'game', icon: '🎮', label: 'Game', cur: g, opts: [{v: 'buzz', ic: '🔔', name: 'WisBuzz', sub: far ? '📶 same Wi-Fi only' : 'Buzz first, say the answer', lock: far}, {v: 'count', ic: '🔢', name: 'WisCount', sub: 'Count the cards'}, {v: 'jack', ic: '🂡', name: 'WisJack', sub: 'Get close to the target'}],
        pick: (v, done) => { WBL.game = v; done(); try{ if(WdCover) Link.cover(WdCover, WB_ROOM); }catch(er){} }}];
      if(g !== 'buzz'){ r.push({k: 'tlevel', icon: '🎚️', label: 'Level', cur: TM.lv, opts: WD.LEVELS.map((L, i) => ({v: i, ic: L.icon, name: L.name, sub: L.sub || ''})), pick: (v, done) => { TM.lv = v; done(); try{ if(WdCover) Link.cover(WdCover, WB_ROOM); }catch(er){} }});
        if(g === 'jack') r.push({k: 'target', icon: '🎯', label: 'Target', cur: TM.target, opts: [20, 21].map(t => ({v: t, ic: '🎯', name: String(t), sub: ''})), pick: (v, done) => { TM.target = v; done(); }}); }
      else { const shelf = WC.SHELVES.find(s => s.k === BZ.shelf) || WC.SHELVES[0], cats = WC.catsOf(shelf.k), cat = WC.CAT[BZ.cat] && WC.CAT[BZ.cat].shelf === shelf.k ? WC.CAT[BZ.cat] : cats[0]; BZ.shelf = shelf.k; BZ.cat = cat.k;
        r.push({k: 'shelf', icon: '📚', label: 'Shelf', cur: shelf.k, opts: WC.SHELVES.map(s => ({v: s.k, ic: s.icon, name: s.en, sub: ''})), pick: (v, done) => { BZ.shelf = v; BZ.cat = WC.catsOf(v)[0].k; done(); }});
        r.push({k: 'cat', icon: '🗂️', label: 'Cards', cur: cat.k, opts: cats.map(c => ({v: c.k, ic: c.icon, name: c.en, sub: ''})), pick: (v, done) => { BZ.cat = v; done(); }});
        r.push({k: 'level', icon: '🎚️', label: 'Level', cur: Math.min(2, BZ.lv), opts: WD.LEVELS.slice(0, 3).map((L, i) => ({v: i, ic: L.icon, name: L.name, sub: L.sub || ''})), pick: (v, done) => { BZ.lv = v; done(); }}); }
      return {rows: r}; },
    Alignext: () => { const m = lxMode(), z = lxSizes(m), r = [
      {k: 'mode', icon: '🎮', label: 'Game', cur: m, opts: Object.keys(LX_MODES).map(k => { const t = LX_MODES[k], i = t.indexOf(' '); return {v: k, ic: t.slice(0, i), name: t.slice(i + 1), sub: k === 'drop' ? '2–4 players' : '2 players (📺 1 = you vs 🤖)'}; }), pick: (v, done) => { lsSet('lx_mode', v); done(); }},
      {k: 'board', icon: '🗺️', label: 'Board', cur: lxBoardKey(m), opts: z.map(x => ({v: x.k, ic: '🔲', name: x.W + '×' + x.H, sub: x.line + ' in a row'})), pick: (v, done) => { lsSet(m === 'drop' ? 'lx_board' : 'lx_board_omni', v); done(); }}];
      if(m !== 'stack') r.push({k: 'cards', icon: '🃏', label: 'Cards', cur: lxCardsOn() ? '1' : '0', opts: [{v: '0', ic: '🚫', name: 'Off', sub: 'Just the board'}, {v: '1', ic: '🃏', name: 'On', sub: 'Power cards to play'}], pick: (v, done) => { lsSet('lx_cards', v); done(); }});
      r.push({k: 'look', icon: '🎨', label: 'Look', cur: theme, opts: themeRows(THEMES, Object.keys(THEMES)), pick: (v, done) => { theme = v; lsSet('theme', v); done(); }});
      return {rows: r, locked: !!LX.st}; },
    Algebros: () => { if(!TOGETHER[together.diff]) together.diff = 'easy'; const sh = typeof show === 'function' ? show : (x => x); return {rows: [
      {k: 'diff', icon: '➗', label: 'Signs', title: 'Which signs?', cur: together.diff, opts: Object.keys(TOGETHER).map(k => ({v: k, ic: '➗', name: TOGETHER[k].name + ' ' + TOGETHER[k].ops.map(sh).join(' '), sub: 'numbers to ' + TOGETHER[k].nums})), pick: (v, done) => { together.diff = v; savePrefs(); done(); }},
      {k: 'size', icon: '🔲', label: 'Board', cur: together.size === 15 ? 15 : 11, opts: [11, 15].map(n => ({v: n, ic: '🔲', name: n + ' × ' + n, sub: n === 11 ? 'quick game' : 'big board'})), pick: (v, done) => { together.size = v; savePrefs(); done(); }},
      {k: 'rounds', icon: '🔁', label: 'Rounds', cur: together.rounds, opts: [5, 8, 12].map(n => ({v: n, ic: '🔁', name: n + ' rounds', sub: ''})), pick: (v, done) => { together.rounds = v; savePrefs(); done(); }}]}; },
    Lettercraft: () => { if(!TOGETHER[together.diff]) together.diff = 'easy'; return {rows: [
      {k: 'diff', icon: '🔤', label: 'Words', title: 'Which words?', cur: together.diff, opts: Object.keys(TOGETHER).map(k => ({v: k, ic: '🔤', name: TOGETHER[k].name + ' words', sub: TOGETHER[k].sub || ''})), pick: (v, done) => { together.diff = v; savePrefs(); done(); }},
      {k: 'size', icon: '🔲', label: 'Board', cur: together.size === 15 ? 15 : 11, opts: [11, 15].map(n => ({v: n, ic: '🔲', name: n + ' × ' + n, sub: n === 11 ? 'quick game' : 'big board'})), pick: (v, done) => { together.size = v; savePrefs(); done(); }},
      {k: 'rounds', icon: '🔁', label: 'Rounds', cur: together.rounds, opts: [5, 8, 12].map(n => ({v: n, ic: '🔁', name: n + ' rounds', sub: ''})), pick: (v, done) => { together.rounds = v; savePrefs(); done(); }}]}; },
    'Memories Match': () => { const stM = PICK.mode === 'steam', ok = typeof mapOk === 'function' ? mapOk : () => true; return {rows: [
      {k: 'mode', icon: '🎮', label: 'Game', cur: stM ? 'steam' : 'classic', opts: [{v: 'classic', ic: '🃏', name: 'Classic', sub: 'Find the matching pairs'}, {v: 'steam', ic: '🔗', name: 'STEAM', sub: 'Pairs that go together'}], pick: (v, done) => { PICK.mode = v; savePrefs(); done(); }},
      {k: 'map', icon: '🗺️', label: 'Board', cur: PICK.map, opts: MAPS.map(m => ({v: m.k, ic: m.icon || '🔲', name: m.name, sub: '', lock: !ok(m)})), pick: (v, done) => { PICK.map = v; savePrefs(); done(); }},
      {k: 'lvl', icon: '🎚️', label: 'Level', cur: PICK.lvl, opts: LEVELS.slice(0, 6).map((L, i) => ({v: i, ic: L.emoji, name: L.name, sub: L.sub || L.blurb || '', lock: !canPlay(i)})), pick: (v, done) => { PICK.lvl = v; savePrefs(); done(); }},
      {k: 'deck', icon: '🃏', label: 'Cards', cur: stM ? PICK.sdeck : PICK.deck, opts: (stM ? ST_KEYS.map(k => [k, ST_DECKS[k]]) : DECK_KEYS.map(k => [k, DECKS[k]])).map(([k, D]) => ({v: k, ic: D.icon, name: D.name, sub: ''})), pick: (v, done) => { if(PICK.mode === 'steam') PICK.sdeck = v; else PICK.deck = v; savePrefs(); done(); }}]}; },
    SlaBrall: () => { if(!lkLevelOk(SET.level)) SET.level = 0; return {rows: [
      {k: 'sport', icon: '🏓', label: 'Sport', cur: SET.sport, opts: SB.SPORT_ORDER.map(k => ({v: k, ic: SB.SPORTS[k].icon, name: SB.SPORTS[k].name, sub: (typeof SPORT_TAG !== 'undefined' && SPORT_TAG[k]) || ''})), pick: (v, done) => { SET.sport = v; savePrefs(); done(); }},
      {k: 'lvl', icon: '🎚️', label: 'Level', cur: SET.level, opts: SB.LEVELS.map((L, i) => ({v: i, ic: LEVEL_UI[i].emoji, name: L.name, sub: LEVEL_UI[i].blurb || '', lock: !lkLevelOk(i)})), pick: (v, done) => { SET.level = v; savePrefs(); done(); }}]}; }
  };
  /* eslint-enable no-undef */
  let LKS_PK = null;   // guest: the host's last picks
  const lksVal = r => r.opts.find(o => o.v === r.cur) || r.opts[0] || {ic: '', name: ''};
  const lksShort = () => innerHeight < 520;   // phones held sideways: the room card sits in a short side panel → ONE summary line, the sheet holds the names
  function lksBox(rows, ro, head) {
    if (lksShort()) return '<button class="lks-sum' + (ro ? ' ro' : '') + '" data-i="all" data-sound="none"' + (ro ? ' tabindex="-1"' : '') + '><span class="lks-l">⚙️ ' + lksEsc(ro ? head : 'Game settings') + '</span><span class="lks-v">' +
      lksEsc(rows.map(r => { const v = r.v || lksVal(r); return (v.ic ? v.ic + ' ' : '') + v.name; }).join(' · ')) + '</span></button>';
    return '<div class="lks-h">⚙️ ' + (ro ? lksEsc(head) : 'Game settings <small>· tap one to change it</small>') + '</div><div class="lks-g">' +
      rows.map((r, i) => { const v = r.v || lksVal(r); return '<button class="lks-b" data-i="' + i + '" data-sound="none"' + (ro ? ' tabindex="-1"' : '') + '><span class="lks-l">' + lksEsc(r.icon + ' ' + r.label) + '</span><span class="lks-v">' + lksEsc((v.ic ? v.ic + ' ' : '') + v.name) + '</span></button>'; }).join('') + '</div>'; }
  function lksFit(el) { requestAnimationFrame(() => el.querySelectorAll('.lks-v').forEach(v => { let f = 13.5; v.style.fontSize = ''; while (v.scrollWidth > v.clientWidth + 1 && f > 9.5) { f -= 0.5; v.style.fontSize = f + 'px'; } if (v.scrollWidth > v.clientWidth + 1 && !v.closest('.lks-sum')) { v.style.whiteSpace = 'normal'; v.style.fontSize = '11px'; } })); }
  function lksSheet(r, done) {
    const sh = document.createElement('div'); sh.className = 'lks-sheet';
    sh.innerHTML = '<div class="lks-in"><h3>' + lksEsc(r.icon) + ' ' + lksEsc(r.title || 'Pick the ' + String(r.label).toLowerCase()) + '</h3><div class="lks-os">' +
      r.opts.map((o, i) => '<button class="lks-o' + (o.v === r.cur ? ' on' : '') + (o.lock ? ' lock' : '') + '" data-i="' + i + '" data-sound="none"><span class="ic">' + lksEsc(o.ic) + '</span><b>' + lksEsc(o.name) + '</b><i>' + lksEsc(o.lock ? '🔒 Win the one before it first' : o.sub || '') + '</i></button>').join('') +
      '</div><button class="lks-x" data-sound="none">✕ Keep ' + lksEsc(lksVal(r).name) + '</button></div>';
    const close = () => sh.remove();
    sh.addEventListener('click', e => { if (e.target === sh) close(); });
    sh.querySelector('.lks-x').onclick = () => { snd('tap'); close(); };
    sh.querySelectorAll('.lks-o').forEach(b => b.onclick = e => { e.stopPropagation(); const o = r.opts[+b.dataset.i]; if (o.lock) { snd('error'); return; } snd('pop'); close(); if (o.v !== r.cur) done(o.v); });
    (document.querySelector('.gf-cover:not(.gf-hide)') || document.body).appendChild(sh); snd('tap'); }
  function lksSheetAll(R, done) {
    const sh = document.createElement('div'); sh.className = 'lks-sheet';
    const list = () => { sh.innerHTML = '<div class="lks-in"><h3>⚙️ Game settings</h3><div class="lks-rows">' + R.rows.map((r, i) => { const v = lksVal(r); return '<button class="lks-row" data-i="' + i + '" data-sound="none"><span class="lks-l">' + lksEsc(r.icon + ' ' + r.label) + '</span><b>' + lksEsc((v.ic ? v.ic + ' ' : '') + v.name) + '</b><i>▸</i></button>'; }).join('') +
        '</div><button class="lks-x" data-sound="none">✓ Done</button></div>';
      sh.querySelector('.lks-x').onclick = () => { snd('tap'); sh.remove(); };
      sh.querySelectorAll('.lks-row').forEach(b => b.onclick = e => { e.stopPropagation(); snd('tap'); one(R.rows[+b.dataset.i]); }); };
    const one = r => { sh.innerHTML = '<div class="lks-in"><h3>' + lksEsc(r.icon) + ' ' + lksEsc(r.title || 'Pick the ' + String(r.label).toLowerCase()) + '</h3><div class="lks-os">' +
        r.opts.map((o, i) => '<button class="lks-o' + (o.v === r.cur ? ' on' : '') + (o.lock ? ' lock' : '') + '" data-i="' + i + '" data-sound="none"><span class="ic">' + lksEsc(o.ic) + '</span><b>' + lksEsc(o.name) + '</b><i>' + lksEsc(o.lock ? '🔒 Win the one before it first' : o.sub || '') + '</i></button>').join('') +
        '</div><button class="lks-x" data-sound="none">◀ All settings</button></div>';
      sh.querySelector('.lks-x').onclick = () => { snd('tap'); list(); };
      sh.querySelectorAll('.lks-o').forEach(b => b.onclick = e => { e.stopPropagation(); const o = r.opts[+b.dataset.i]; if (o.lock) { snd('error'); return; } snd('pop'); sh.remove(); if (o.v !== r.cur) done(r, o.v); }); };
    sh.addEventListener('click', e => { if (e.target === sh) sh.remove(); });
    list(); (document.querySelector('.gf-cover:not(.gf-hide)') || document.body).appendChild(sh); snd('tap'); }
  // host / 📺: the rows of this game (null = keep the game's own chips)
  function lksRows(c) {
    const fn = K && K.o && ROWS[K.o.game]; if (!fn || K.mode === 'guest') return false; let R;
    try { R = fn(); } catch (e) { console.warn('Link.cover rows', K.o.game, e); return false; }
    if (!R || !R.rows || !R.rows.length) return false;
    let el = c.querySelector('.lkc-set'); if (!el) { el = document.createElement('div'); c.appendChild(el); } el.className = 'lkc-set' + (R.locked ? ' ro' : ''); c.classList.add('lkc-hasset');
    el.innerHTML = lksBox(R.rows, !!R.locked, '📺 The vote picks the game'); lksFit(el);
    const after = () => { try { if (L.isHost() && K.o.label) L.setLabel(K.o.label(!!L.hostess()) + (K.own ? ' · 📱 own screens' : '')); } catch (er) {} paintCard(); paintPlay(); };
    if (!R.locked) { el.querySelectorAll('.lks-b').forEach(b => b.onclick = e => { e.stopPropagation(); const r = R.rows[+b.dataset.i]; lksSheet(r, v => r.pick(v, after)); });
      const sum = el.querySelector('.lks-sum'); if (sum) sum.onclick = e => { e.stopPropagation(); lksSheetAll(R, (r, v) => r.pick(v, after)); }; }
    K.lksShort = lksShort();
    const sum = R.rows.map(r => { const v = lksVal(r); return {icon: r.icon, label: r.label, v: {ic: v.ic || '', name: v.name}}; }), key = JSON.stringify(sum) + '|' + players() + '|' + !!R.locked;
    if (K.pkSent !== key) { K.pkSent = key; try { L.send('lk:picks', {rows: sum, locked: !!R.locked}, {sure: true}); } catch (e) {} }
    return true; }
  // guest: the host's settings, read-only, in MY room card
  function lksGuest(c) { if (!LKS_PK || !LKS_PK.rows) return; let el = c.querySelector('.lkc-set'); if (!el) { el = document.createElement('div'); c.appendChild(el); }
    el.className = 'lkc-set ro'; c.classList.add('lkc-hasset'); el.innerHTML = lksBox(LKS_PK.rows, true, LKS_PK.locked ? '📺 The vote picks the game' : hostName() + ' picks the game'); lksFit(el); K.lksShort = lksShort(); }
  addEventListener('resize', () => { if (K && live() && K.card && K.lksShort !== undefined && K.lksShort !== lksShort()) { K.lksShort = lksShort(); paintCard(); } });
  L.on('lk:picks', d => { if (!d || !d.rows) return; LKS_PK = d; if (K && K.mode === 'guest' && live()) paintCard(); });
  // 🧪 for tests + tools: the settings as text · pick one · the next one (what a tap on an old chip did)
  function lksNow() { const fn = K && K.o && ROWS[K.o.game]; if (!fn) return null; try { return fn(); } catch (e) { return null; } }
  function lksApi() {   // called right after L.cover = cover
  L.cover.settings = () => { if (K && K.mode === 'guest') return LKS_PK ? LKS_PK.rows.map(r => ({k: '', label: r.label, text: ((r.v.ic ? r.v.ic + ' ' : '') + r.v.name), locked: true})) : [];
    const R = lksNow(); return R ? R.rows.map(r => { const v = lksVal(r); return {k: r.k, label: r.label, text: (v.ic ? v.ic + ' ' : '') + v.name, cur: r.cur, opts: r.opts.map(o => ({v: o.v, name: o.name, lock: !!o.lock})), locked: !!R.locked}; }) : []; };
  L.cover.pickSetting = (k, v) => new Promise(res => { const R = lksNow(), r = R && R.rows.find(x => x.k === k); if (!r || R.locked) return res(false); const o = r.opts.find(x => x.v === v); if (!o || o.lock) return res(false);
    r.pick(v, () => { try { if (L.isHost() && K.o.label) L.setLabel(K.o.label(!!L.hostess()) + (K.own ? ' · 📱 own screens' : '')); } catch (er) {} if (live()) { paintCard(); paintPlay(); } res(true); }); });
  L.cover.nextSetting = k => { const R = lksNow(), r = R && R.rows.find(x => x.k === k); if (!r) return Promise.resolve(false); const open = r.opts.filter(o => !o.lock); if (!open.length) return Promise.resolve(false);
    const i = open.findIndex(o => o.v === r.cur); return L.cover.pickSetting(k, open[(i + 1) % open.length].v); };
  }
  function paintCard() {
    if (!live()) return; const c = mountCard();
    const st = L.status(), linking = (L._test && L._test.state && Object.values(L._test.state().peers || {}).filter(q => !q.linked).length) || 0;
    if (K.mode === 'guest') {
      c.className = 'lkc-card';
      c.innerHTML = '<div class="lkc-l"><div>🔗 Linked to <b>' + esc(hostName()) + '</b>\'s room</div>' + tiles() +
        '<div class="lkc-st">' + (st === 'reconnecting' ? '🔁 Linking again<span class="lk-dots"></span>' : L.hostess() ? '📺 The game shows on the TV' : K.own ? '📱 Everyone on own screen — the game shows on this phone' : '') + '</div>' + roads() + (farText() ? '<div class="lkc-far">' + esc(farText()) + '</div>' : '') + '</div><button class="lkc-x" data-sound="tap">🚪 Leave</button>';   /* 🌍 lk-aw */
    } else {
      c.className = 'lkc-card';
      c.innerHTML = '<div class="lkc-l"><div class="lkc-lb">' + (K.mode === 'tv' ? '📺 Room hostess — join on your own phone' : K.own ? '📱 Everyone on own screen — type it on the other phones' : '📱 Room — type it on the other phones') + '</div>' + tiles() +
        '<div class="lkc-st">' + (linking ? '📨 ' + linking + ' device' + (linking > 1 ? 's' : '') + ' linking<span class="lk-dots"></span>' : players() < need() ? '📲 Waiting for ' + (need() - players()) + ' more player' + (need() - players() > 1 ? 's' : '') : '✅ Ready!') + '</div>' + roads() + (farText() ? '<div class="lkc-far">' + esc(farText()) + '</div>' : '') + '</div>' +   /* 🌍 lk-aw */
        (K.mode === 'host' ? '<canvas class="lkc-qr"></canvas>' : '') + '<button class="lkc-x" data-sound="tap">✕ close</button>';
      qr(c.querySelector('.lkc-qr'));
      if (K.mode === 'tv') {
        if (!K.big) { K.big = document.createElement('div'); K.big.className = 'lkc-big'; const art = K.C.el.querySelector('.gf-art'); if (art) art.appendChild(K.big); }
        K.big.innerHTML = '<div><div>📺 Join on your own phone</div>' + tiles() + '<div class="lkc-how">' + esc(K.o.how || ('Gameroom → ' + (K.o.title || '') + ' → 📱 Own devices → 🔗 Join · or scan')) + '</div></div><canvas class="lkc-qr"></canvas>';
        qr(K.big.querySelector('.lkc-qr'));
      }
    }
    if (K.mode === 'guest') lksGuest(c);   /* ⚙️ lk-9a3 */
    else if (!lksRows(c) && K.o.picks) { const l = c.querySelector('.lkc-l'), pk = document.createElement('div'); pk.className = 'lkc-picks'; if (l) l.appendChild(pk); try { K.o.picks(pk); } catch (e) { console.error('Link.cover picks', e); } }   /* lk-6b */
    c.querySelector('.lkc-x').onclick = () => { snd('tap'); close(true); };
  }
  function paintPlay() {
    if (!K || !K.mode) return; const b = playBtn(); if (!b) return;
    let text = '▶ Play', off = false;
    if (K.mode === 'pick' || K.mode === 'join') { text = '▶ Play'; off = true; }
    else if (K.mode === 'guest') {
      const cap = L.hostess() && L.captain() === L.seat() && !L.started();
      if (cap) text = players() < 1 ? '▶ Start' : '▶ Start';
      else { text = '⏳ ' + (L.hostess() ? 'The TV' : hostName()) + ' starts the game'; off = true; }
    } else {
      const n = players(); off = n < need();
      text = K.mode === 'tv' && n === 1 && K.o.bot !== false ? '▶ Start vs 🤖' + (typeof K.o.bot === 'function' ? ' ' + K.o.bot() : '') : '▶ Start · ' + n + ' player' + (n === 1 ? '' : 's');
    }
    if (typeof K.C.playText === 'function') K.C.playText(text, {disabled: off});
    else { b.textContent = text; b.disabled = off; }
  }
  function sync(force) {
    if (!K || !K.mode) return;
    const st = L.status();
    if (live() && (st === 'idle' || st === 'closed')) { gone(st === 'closed' && K.mode === 'guest' ? '👋 ' + (K.hostName || 'The host') + ' closed the room' : ''); return; }
    if (live()) { if (K.mode === 'guest') K.hostName = hostName(); syncLine(force); paintCard(); markFar(); }   // 🌍 lk-aw: markFar
    paintPlay();
  }
  function gone(msg) {   // the room is gone (closed here, by the host, or the link is lost) → back to playing on this device
    closeSheet(); const C = K.C, was = K.mode; K.mode = null; K.own = false; unmountCard();
    if (was === 'tv' || C.isHostess) C.hostess(false); else { C.room(null); C.setMode('solo'); }
    if (!C.lineup.some(s => s.seat === 0)) C.add({seat: 0, name: nm(), av: avOf() || undefined, where: 'here'});   // a guest's line held only the host's devices → you again
    const b = playBtn(); if (b) { b.disabled = false; b.textContent = '▶ Play'; }
    if (msg && window.UI && UI.toast) UI.toast(msg);
  }
  function close(ask) {
    if (!K || !K.mode) return;
    const go = () => { const was = K.mode; try { if (L.status() !== 'idle') L.leave(); } catch (e) { /* */ } gone(was === 'guest' ? '' : '📡 Room closed'); };
    const n = (L.players() || []).filter(p => p.name && p.on && !p.me && !p.screen).length;
    if (ask && n && (K.mode === 'host' || K.mode === 'tv') && window.UI && UI.confirm) UI.confirm({icon: '📡', title: 'Close your room?', body: 'The ' + n + ' player' + (n > 1 ? 's' : '') + ' on other devices will be sent out.', okText: 'Close room', cancelText: 'Stay'}).then(ok => { if (ok) go(); });
    else go();
  }
  function play() {
    if (!K || !live()) return;
    if (K.mode === 'guest') {
      if (L.hostess() && L.captain() === L.seat()) { snd('pop'); const b = playBtn(); if (window.UI && UI.busy && b) UI.busy(b, K.o.kind || 'link', 'Starting…'); L.ask('start'); }
      return;
    }
    if (players() < need()) { snd('error'); return; }
    if (!why()) snd('pop'); go();   // 🌍 lk-aw: a refused start only buzzes
  }
  function why() { try { return K.o.canStart ? K.o.canStart() || '' : ''; } catch (e) { return ''; } }   // 🌍 lk-aw
  function go() { const no = why(); if (no) { snd('error'); if (window.UI && UI.toast) UI.toast(no); return false; } L.start(); try { if (K.o.onStart) K.o.onStart(); } catch (e) { console.error('Link.cover onStart', e); } return true; }   // 🌍 lk-aw: canStart
  // ---------- once ----------
  ['players', 'status', 'start', 'join', 'leave', 'rejoin', 'hostleft'].forEach(ev => L.on(ev, () => { if (K && K.mode) sync(); }));
  ['join', 'rejoin'].forEach(ev => L.on(ev, w => { if (K && K.own && L.isHost() && w && w.seat != null) L.send('lk:own', {on: 1}, {sure: true, to: w.seat}); }));   /* 📱 lk-9 own screens */
  L.on('lk:own', d => { if (K) { K.own = !!(d && d.on); if (K.mode) sync(true); } });
  setInterval(() => { if (!(K && K.own && live() && K.card && K.card.isConnected) || K.C.el.classList.contains('gf-hide') || document.hidden) return;   // only while the cover shows (never during a match)
    const r = K.card.querySelector('.lkc-roads'), h = roads(); if (r && h && r.outerHTML !== h) r.outerHTML = h; else if (!r !== !h) paintCard(); }, 2000);   // the ms change: swap the chips in place
  L.on('lk:ask', (d, seat) => {   // 📺 the first player's ▶ Start on their phone reaches the TV
    if (!K || K.mode !== 'tv' || !d || d.what !== 'start' || !L.isHost() || seat !== L.captain() || K.C.el.classList.contains('gf-hide')) return;
    if (players() >= need()) go();
  });
  function cover(C, o) {
    if (K && K.C !== C) { if (live()) close(false); K = null; }
    if (!K) {
      K = {C, o, mode: null, card: null, big: null, sheet: null, lobby: null, sig: ''};
      C.el.addEventListener('click', e => {   // ▶ on the cover while a room is open → start the room (GameFrame's own ▶ does not run)
        if (!K || K.C !== C || !K.mode || !e.target.closest('.gf-play')) return;
        e.stopPropagation(); e.preventDefault(); play();
      }, true);
      C.onChange((line, mode) => {
        if (!K || K.C !== C || !K.mode) return;
        markFar();   // 🌍 lk-aw: GameFrame just painted the line again
        if (mode !== 'own' && live()) { close(false); return; }   // 👥 Same device while a room is open = close the room
        if (mode !== 'own' && K.mode === 'pick') { closeSheet(); K.mode = null; return; }
        paintPlay();
      });
    }
    K.o = o || K.o;
    if (live() && L.status() !== 'idle') { sync(true); return K; }   // back from a match: the room is still open
    pick(); return K;
  }
  L.cover = cover;
  lksApi();   /* ⚙️ lk-9a3 */
  L.cover.active = C => !!(K && (!C || K.C === C) && live() && L.status() !== 'idle' && L.status() !== 'closed');
  L.cover.show = C => { if (!K || K.C !== C) return false; K.C.show(); if (live()) { if ((K.mode === 'tv' || (K.mode === 'guest' && L.hostess())) && !K.C.isHostess) K.C.room({code: digits().join(''), hostess: true}); else if (K.mode !== 'tv' && !L.hostess() && K.C.mode !== 'own') K.C.setMode('own'); sync(true); } return true; };
  L.cover.close = () => close(false);
  // 📺 lk-pp1b: from the 📺 Game Station — open the cover room straight as the Room hostess (no pick sheet) · start it (Station's start / again)
  L.cover.tv = (C, o) => { try { if (C.mode !== 'own' && C.setMode) C.setMode('own'); } catch (e) { /* */ } cover(C, o); if (K.mode === 'tv' && live()) return K; openRoom(true); return K; };
  L.cover.start = () => { if (!K || !live() || (K.mode !== 'tv' && K.mode !== 'host') || players() < need()) return false; if (why()) return go(); snd('pop'); return go(); };   // 🌍 lk-aw: go() can refuse
  L.cover.join = code => { if (K) join(code); };
  L.cover.state = () => K ? {mode: K.mode, own: !!K.own, sig: K.sig, card: !!(K.card && K.card.isConnected), big: !!(K.big && K.big.isConnected), sheet: !!(K.sheet && K.sheet.isConnected)} : null;
})();
