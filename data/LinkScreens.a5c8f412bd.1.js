
/* 📱 LINK SCREENS (lk-9a, 📡 Multiplayer chat, Aowu 2026-11-21 16:02 "ok go" — LinkKit plan §55j + §55k) — own devices, own screens for ACTION games.
   ONE device (the host's phone / tablet) runs the unchanged engine AND plays; every other phone draws the SAME match on its own screen
   with the game's own play screen + the game's own touch pad. The 🏓 SlaBrall recipe (§15), made shared:
     host → all    scb {id, base}          the match start (sure): what the guest needs to build its own copy (seed, players, level, theme …)
                   scp {id, q, t, p}       the picture (fast, 20× a second): only what moved — numbers rounded, values equal to the
                                           match-start picture left out (pack / unpack)
                   sce {id, t, e}          engine events with the host time (sure) → every phone plays the same sounds / FX / words at that time
     guest → host  pdin / pdbt / pdps      = 🕹️ LinkPads (the host side does not change: seats, 📴 drop → 🤖 → 👋 back, ⏸ for all, status)
   Guests draw 0.1 s behind the host, smoothed between two pictures (lerp), and never run the engine.
   ⚡ / 🌍 road: each seat shows how its line runs — ⚡ direct (same Wi-Fi or phone ↔ phone on 5G) · 🌍 family server (another house, later 🛰️ relay lk-8r).
   API  host:  H = Link.screens.host({id, base, pic: () => obj, every}) → H.event(list) · H.stats() · H.rebase(seat) · H.stop()
        guest: Link.screens.guest({onBase(base), apply(a, b, u, lerp), onEvents(list), delay}) → {stop, stats, behind()}
        both:  Link.screens.pack(o, base) · unpack(d, base) · lerp(a, b, u, snap) · road(seat) → {icon, word, ms} */
(function () {
  const L = window.Link; if (!L || L.screens) return;
  const T = window.LINK_TIMING || {};
  const EVERY = T.scEvery || 50, DELAY = T.scDelay || 100, KEEP = 12;
  const now = () => performance.now();
  const r3 = v => Math.round(v * 1000) / 1000;
  const isObj = v => v !== null && typeof v === 'object';
  const NONE = '~';   // a key that is gone now (was in the base)
  // ---------- pack: only what differs from the base, numbers rounded (1 mm on a 10 m arena) ----------
  function pack(o, base) {
    if (typeof o === 'number') return r3(o);
    if (!isObj(o)) return o;
    if (Array.isArray(o)) { if (!Array.isArray(base) || base.length !== o.length) return o.map(x => pack(x, null)); const out = {}; let n = 0; o.forEach((x, i) => { const d = diff(x, base[i]); if (d !== undefined) { out[i] = d; n++; } }); return n ? {'#': o.length, d: out} : undefined; }
    const out = {}; let n = 0;
    for (const k in o) { if (typeof o[k] === 'function') continue; const d = diff(o[k], base ? base[k] : undefined); if (d !== undefined) { out[k] = d; n++; } }
    if (base && isObj(base)) for (const k in base) if (!(k in o)) { out[k] = NONE; n++; }
    return base ? (n ? out : undefined) : out;
  }
  function diff(v, b) {
    if (typeof v === 'number') { v = r3(v); return typeof b === 'number' && r3(b) === v ? undefined : v; }
    if (!isObj(v)) return v === b ? undefined : (v === undefined ? NONE : v);
    if (!isObj(b) || Array.isArray(v) !== Array.isArray(b)) return pack(v, null);
    return pack(v, b);
  }
  function unpack(d, base) {
    if (d === undefined) return clone(base);
    if (d === NONE) return undefined;
    if (!isObj(d)) return d;
    if (d['#'] != null && isObj(d.d) && Array.isArray(base)) { const out = []; for (let i = 0; i < d['#']; i++) out.push(i in d.d ? unpack(d.d[i], base[i]) : clone(base[i])); return out; }
    if (Array.isArray(d)) return d.map(x => unpack(x, undefined));
    const out = isObj(base) && !Array.isArray(base) ? clone(base) : {};
    for (const k in d) { const v = unpack(d[k], out[k]); if (v === undefined) delete out[k]; else out[k] = v; }
    return out;
  }
  function clone(v) { return isObj(v) ? JSON.parse(JSON.stringify(v)) : v; }
  // ---------- lerp: numbers move smoothly; snap keys (ids, counts, states) jump ----------
  function lerp(a, b, u, snap) {
    if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * u;
    if (!isObj(a) || !isObj(b)) return u < 0.5 ? a : b;
    if (Array.isArray(a)) return (Array.isArray(b) && a.length === b.length) ? a.map((x, i) => lerp(x, b[i], u, snap)) : b;
    const out = {};
    for (const k in b) out[k] = snap && snap[k] ? b[k] : (k in a ? lerp(a[k], b[k], u, snap) : b[k]);
    return out;
  }
  // ---------- ⚡ / 🌍 the road a seat's line runs on ----------
  function road(seat) { if (L.roadOf) return L.roadOf(seat); const srv = L.road && L.road() === 'server'; return srv ? {icon: '🌍', word: 'family server', ms: null, k: 'server'} : {icon: '⚡', word: 'direct', ms: null, k: 'direct'}; }   // LinkKit owns it (lk-9a)
  // ======================= HOST =======================
  let HS = null;
  function host(o) {
    stopHost();
    HS = {o, id: o.id || Date.now().toString(36), q: 0, t0: now(), base: o.base, pic0: null, timer: null, bytes: 0, n: 0, big: 0, evN: 0};
    HS.pic0 = clone(o.pic());
    const sendBase = to => L.send('scb', {id: HS.id, base: HS.base, pic0: HS.pic0}, {sure: true, to: to == null ? 'all' : to});
    sendBase();
    HS.onRe = L.on('rejoin', w => { if (HS && w && w.seat != null) sendBase(w.seat); });
    HS.timer = setInterval(() => {
      if (!HS) return; let p; try { p = o.pic(); } catch (e) { return; }
      const d = {id: HS.id, q: ++HS.q, t: Math.round(now() - HS.t0), p: pack(p, HS.pic0) || {}};
      const s = JSON.stringify(d); HS.bytes += s.length; HS.n++; HS.big = Math.max(HS.big, s.length);
      L.send('scp', d);
    }, o.every || EVERY);
    return {
      id: HS.id,
      event: list => { if (!HS || !list || !list.length) return; HS.evN += list.length; L.send('sce', {id: HS.id, t: Math.round(now() - HS.t0), e: list}, {sure: true}); },
      rebase: seat => sendBase(seat), t: () => HS ? now() - HS.t0 : 0,
      stats: () => HS ? {pics: HS.n, avg: Math.round(HS.bytes / Math.max(1, HS.n)), max: HS.big, perSec: Math.round(HS.bytes / Math.max(0.001, (now() - HS.t0) / 1000)), events: HS.evN} : null,
      stop: () => stopHost()
    };
  }
  function stopHost() { if (!HS) return; clearInterval(HS.timer); if (HS.onRe) L.off('rejoin', HS.onRe); HS = null; }
  // ======================= GUEST =======================
  let GS = null;
  function guest(o) {
    stopGuest();
    GS = {o, id: null, base: null, pic0: null, buf: [], ev: [], off: null, lastQ: 0, raf: 0, got: 0, late: 0, gap: [], arr: 0};
    GS.h1 = L.on('scb', d => { if (!GS) return; const fresh = GS.id !== d.id; GS.id = d.id; GS.base = d.base; GS.pic0 = d.pic0; if (fresh) { GS.buf = []; GS.ev = []; GS.lastQ = 0; GS.off = null; } try { o.onBase && o.onBase(d.base, fresh); } catch (e) { console.error('LinkScreens base', e); } });
    GS.h2 = L.on('scp', d => {
      if (!GS || d.id !== GS.id || d.q <= GS.lastQ) { if (GS) GS.late++; return; }
      const t = now(); if (GS.arr) { GS.gap.push(t - GS.arr); if (GS.gap.length > 60) GS.gap.shift(); } GS.arr = t;
      GS.lastQ = d.q; GS.got++;
      const off = t - d.t; GS.off = GS.off == null ? off : Math.min(GS.off + 0.5, off);   // host clock → my clock (the fastest trip wins, slowly forgets)
      GS.buf.push({t: d.t, p: unpack(d.p, GS.pic0)}); if (GS.buf.length > KEEP) GS.buf.shift();
    });
    GS.h3 = L.on('sce', d => { if (!GS || d.id !== GS.id) return; GS.ev.push(d); });
    const step = () => {
      if (!GS) return; GS.raf = requestAnimationFrame(step);
      if (GS.off == null || !GS.buf.length) return;
      const ht = now() - GS.off - (o.delay || DELAY);           // the host time this phone shows now
      // events that are due (sounds, FX, words) — never later than 0.4 s
      while (GS.ev.length && GS.ev[0].t <= ht + 5) { const d = GS.ev.shift(); try { o.onEvents && o.onEvents(d.e, ht - d.t); } catch (e) { console.error('LinkScreens events', e); } }
      const B = GS.buf; let i = B.length - 1; while (i > 0 && B[i - 1].t > ht) i--;
      const a = B[Math.max(0, i - 1)], b = B[i]; const u = b.t > a.t ? Math.max(0, Math.min(1, (ht - a.t) / (b.t - a.t))) : 1;
      try { o.apply(a.p, b.p, u, lerp); } catch (e) { console.error('LinkScreens apply', e); }
    };
    GS.raf = requestAnimationFrame(step);
    return {stop: () => stopGuest(), stats: () => GS ? {got: GS.got, late: GS.late, gap: GS.gap.length ? Math.round(GS.gap.reduce((s, x) => s + x, 0) / GS.gap.length) : null, buf: GS.buf.length} : null};
  }
  function stopGuest() { if (!GS) return; cancelAnimationFrame(GS.raf); L.off('scb', GS.h1); L.off('scp', GS.h2); L.off('sce', GS.h3); GS = null; }
  // ======================= 📱 MY PAD on an own-screen phone (no pad page: the game's own touch pad feeds this) =======================
  // = the 🕹️ LinkPads phone line without its page: pdin keep-alive every 200 ms (so the host's 📴 drop rule works the same) + pdbt presses
  let PD = null, PQ = 0;   // PQ: the line count goes on across pads (the host drops an older count)
  function pad(d) {
    stopPad();
    PD = {d, x: 0, y: 0, dir: null, held: {}, keep: null, lock: null};
    const send = () => { if (!PD) return; PQ++; L.send('pdin', {id: PD.d.id, q: PQ, x: Math.round(PD.x * 100) / 100, y: Math.round(PD.y * 100) / 100, d: PD.dir, h: Object.assign({}, PD.held)}); };
    PD.keep = setInterval(send, T.padKeep || 200); send();
    try { if (navigator.wakeLock && navigator.wakeLock.request) navigator.wakeLock.request('screen').then(l => { if (PD) PD.lock = l; }).catch(() => {}); } catch (e) { /* */ }
    return {
      stick: (x, y, dir) => { if (!PD) return; const ch = dir !== PD.dir || Math.abs(x - PD.x) > 0.2 || Math.abs(y - PD.y) > 0.2; PD.x = x; PD.y = y; PD.dir = dir || null; if (ch) send(); },
      btn: (k, on) => { if (!PD || !!PD.held[k] === !!on) return; PD.held[k] = on ? 1 : 0; L.send('pdbt', {k, on: !!on}, {sure: true}); },
      pause: on => L.send('pdps', {on: !!on}, {sure: true}),
      id: () => PD && PD.d.id, stop: () => stopPad()
    };
  }
  function stopPad() { if (!PD) return; clearInterval(PD.keep); try { if (PD.lock) PD.lock.release(); } catch (e) { /* */ } PD = null; }
  L.screens = {pad, stopPad, host, guest, pack, unpack, lerp, road, clone, stopHost, stopGuest, hostOn: () => !!HS, guestOn: () => !!GS};
})();
GameParts.loaded('LinkScreens', 'lk-9a');
