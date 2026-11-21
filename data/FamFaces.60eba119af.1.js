
/* 🧑‍🤝‍🧑 FAMFACES (✨ Polish chat 24r-b, Aowu 2026-11-21 23:40 "go"; plan `24r Family Faces — plan.md`) — the family's own avatars as game pieces.
   Born split (shared part, no UI of its own): 🍬 Sweet Swap's 24r family pieces made into one kit for every tile game (🫧 Pop Blocks first;
   Sweet Swap moves onto it in 24r-c). Needs AvatarKit (Acting) on the page.
   👨‍👩‍👧 Family = rim colour + initial (★ ×1.25) · 🙂 Faces only = plain card, no colour help (★★ ×1.5).
   Who: the player first, then a new mix of the other players (their saved avatar), 🤖 buddies fill; 👁️ hidden faces = one device list for every
   family-faces game (localStorage sp_ss_famhide, Sweet Swap's list). Two people with the same first letter get 2 letters (Ben → Be, Bo → Bo).
   Moves are DRAWN ONCE per person when a game starts (frames kept in memory only → a changed avatar shows next game), replayed on the game's
   own canvas:  const F = FamFaces.make(K, {fo, me, players, avatarOf, calm});  F.img[k] = the still picture (a canvas) · F.play(x, y, k, pool, {pop, ms,
   delay, loops, rise}) at cell (x, y) · F.paint(g, cellSize, now) once per frame after the board · F.bake() (idle-time drawing) · F.clear().
   Pools: idle · small · big · bomb (high-five) · oops · amazed · wave · party · win — or an act list (e.g. [Acting.sig(av)] = their 🎭 Signature act). */
window.FamFaces = (function(){
  const RIM = ['#FF5A5F', '#F5A300', '#9B5CF6', '#22A86A', '#3B82F6', '#F2711C'], BUD = ['Bo', 'Pip', 'Zuzu', 'Kiki', 'Momo', 'Tiko'], HIDE = 'sp_ss_famhide';
  const POOLS = {
    idle: ['cool', 'gest.peekaboo', 'gest.yawn', 'curious', 'giggle', 'shy'],
    small: ['gest.clap', 'laugh', 'wave', 'excited', 'cheer.hop'],
    big: ['cheer', 'cheer.fist', 'gest.dab', 'flex', 'victory'],
    bomb: ['gest.highfive', 'hug-pair', 'cheer.starjump', 'gest.spin'],
    oops: ['oops', 'shrug', 'confused', 'facepalm'],
    amazed: ['amazed', 'gasp'], wave: ['cheer.starjump', 'cheer.hop'], party: ['gest.dance', 'cheer.disco', 'cheer.floss'], win: ['victory', 'cheer']};
  const MULT = {family: 1.25, faces: 1.5};
  const on = () => !!(window.Acting && Acting.draw && window.FAMFACES_FX !== false);
  const actOk = a => !!(window.Acting && Acting.has && Acting.has('acts', a));
  function hidden(){ try{ return JSON.parse(localStorage.getItem(HIDE) || '[]'); }catch(e){ return []; } }
  function setHidden(list){ try{ localStorage.setItem(HIDE, JSON.stringify(list)); }catch(e){} }
  function toggle(name){ const h = hidden(), at = h.indexOf(name); if(at < 0) h.push(name); else h.splice(at, 1); setHidden(h); return at < 0; }
  function mix(a){ a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const plain = n => String(n || '?').replace(/^\W+/, '') || '?';
  function tags(who){ const first = w => plain(w.name)[0]; who.forEach(w => { w.tag = who.some(o => o !== w && first(o) === first(w)) ? plain(w.name).slice(0, 2) : first(w); }); return who; }
  // the people: me first, then the others (shuffled when shuffle = true), hidden ones skipped, 🤖 buddies fill
  function pick(K, o){
    const hide = hidden(), me = o.me, av = o.avatarOf || (n => window.defaultAvatar ? defaultAvatar(n) : {});
    const names = (o.players || []).map(p => p && (p.Name || p.name || p)).filter(n => n && n !== me && hide.indexOf(n) < 0);
    const list = (me && hide.indexOf(me) < 0 ? [me] : []).concat(o.shuffle ? mix(names) : names);
    const who = list.slice(0, K).map(n => ({name: n, av: av(n)}));
    for(let i = 0; who.length < K; i++){ const b = BUD[i % BUD.length]; who.push({name: b, av: window.defaultAvatar ? defaultAvatar('🤖' + b) : {}, buddy: true}); }
    return tags(who);
  }
  // one person drawn into a tile (S px): rim tile (Family) or plain card (Faces only); popK = bigger frame, the body pops out of the tile
  function draw(q, w, act, t, S, k, fo, popK){
    const Z = Math.round(S * (popK || 1)), ox = (Z - S) / 2, oy = (Z - S) * 0.38, rim = fo ? 'rgba(60,40,80,.22)' : RIM[k % 6];
    let f = {x: 0, y: 0, k: 1}; try{ f = Acting.fit(w, ['idle'], S, S * 1.9, {pad: 2}); }catch(e){}
    if(popK){ q.fillStyle = (fo ? '#7B6B8B' : RIM[k % 6]) + '38'; q.beginPath(); for(let i = 0; i < 24; i++){ const a = i / 24 * 6.283 + t * 1.2, r = Z * (i % 2 ? 0.36 : 0.5); q.lineTo(Z / 2 + Math.cos(a) * r, Z * 0.48 + Math.sin(a) * r); } q.fill(); }
    q.save(); q.beginPath(); q.roundRect(ox + 1, oy + 1, S - 2, S - 2, S * 0.24);
    const gr = q.createLinearGradient(0, oy, 0, oy + S); gr.addColorStop(0, fo ? '#FFFFFF' : rim + '30'); gr.addColorStop(1, fo ? '#ECE8F2' : rim + '70'); q.fillStyle = gr; q.fill();
    if(!popK) q.clip();
    try{ Acting.draw(q, w, ox + f.x, oy + f.y + S * 0.18, f.k * 1.05, act, {t, noPet: true, ride: 'drop'}); }catch(e){}
    q.restore();
    q.lineWidth = Math.max(2, S * 0.07); q.strokeStyle = rim; q.beginPath(); q.roundRect(ox + 1 + q.lineWidth / 2, oy + 1 + q.lineWidth / 2, S - 2 - q.lineWidth, S - 2 - q.lineWidth, S * 0.22); q.stroke();
    if(!fo && !popK){ const tg = w.tag || plain(w.name)[0]; q.fillStyle = rim; q.beginPath(); q.arc(ox + S * 0.84, oy + S * 0.84, S * 0.15, 0, 7); q.fill(); q.fillStyle = '#fff';
      q.font = '800 ' + Math.round(S * (tg.length > 1 ? 0.15 : 0.19)) + 'px Fredoka, Nunito, sans-serif'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(tg, ox + S * 0.84, oy + S * 0.855); }
  }
  function still(w, k, fo, S){ const c = document.createElement('canvas'); c.width = c.height = S; draw(c.getContext('2d'), w, 'idle', 0, S, k, fo); return c; }
  // 🎨 setup chip pictures: the first n faces (not shuffled), small data URLs, cached per look + player + hidden list
  const CHIP = {};
  function chips(n, o){ const key = (o.fo ? 'f' : 'r') + (o.me || '') + '|' + hidden().join(',') + '|' + (o.players || []).length;
    if(!CHIP[key]){ try{ CHIP[key] = pick(n, o).map((w, j) => still(w, j, o.fo, 64).toDataURL('image/png')); }catch(e){ CHIP[key] = []; } } return CHIP[key]; }
  // one game's faces: K people, their still pictures + the moves (a move = 6 frames drawn once per person × act × size, replayed by paint)
  function make(K, o){
    o = o || {}; const fo = !!o.fo, R = o.R || 144, who = pick(K, Object.assign({shuffle: true}, o));
    const F = {who, fo, img: who.map((w, k) => still(w, k, fo, R)), live: [], strips: {}, calm: !!o.calm};
    F.strip = (k, act, pop) => { const id = k + '|' + act + '|' + (pop ? 'p' : 's'); if(F.strips[id]) return F.strips[id]; const w = who[k]; if(!w || !actOk(act)) return null;
      const N = 6, P = pop ? 1.55 : 1, Z = Math.round(R * P), c = document.createElement('canvas'); c.width = Z * N; c.height = Z; const q = c.getContext('2d');
      for(let i = 0; i < N; i++){ q.save(); q.translate(i * Z, 0); draw(q, w, act, i / N, R, k, fo, pop ? P : 0); q.restore(); }
      return (F.strips[id] = {c, N, Z, P}); };
    F.play = (x, y, k, pool, p) => { p = p || {}; if(!on() || k == null || k < 0 || !who[k] || F.live.length >= (p.max || 24)) return false;
      const acts = (typeof pool === 'string' && POOLS[pool] ? POOLS[pool] : [].concat(pool)).filter(actOk); if(!acts.length) return false;
      const st = F.strip(k, acts[Math.floor(Math.random() * acts.length)], !!p.pop); if(!st) return false;
      F.live.push({x, y, st, t0: performance.now() + (p.delay || 0), ms: p.ms || 700, loops: p.loops || 2, rise: p.rise || 0, pop: !!p.pop}); return true; };
    F.paint = (g, s, now) => { if(!F.live.length) return; now = now || performance.now();
      F.live = F.live.filter(L => { const age = now - L.t0; if(age > L.ms) return false; if(age < 0) return true;
        const p = age / L.ms, f = Math.min(L.st.N - 1, Math.floor((p * L.loops % 1) * L.st.N)), D = s * L.st.P * (L.pop ? 1.25 : 1.05), cx = (L.x + 0.5) * s, cy = (L.y + 0.5) * s - L.rise * s * p;
        g.save(); g.globalAlpha = p > 0.8 ? (1 - p) / 0.2 : 1; g.drawImage(L.st.c, f * L.st.Z, 0, L.st.Z, L.st.Z, cx - D / 2, cy - D * (L.pop ? 0.62 : 0.5), D, D); g.restore(); return true; }); };
    F.bake = () => { if(!on()) return; const jobs = [];   // the common moves, drawn while the player looks at the board (the first pop never waits)
      who.forEach((w, k) => { ['small', 'big', 'amazed'].forEach(pl => POOLS[pl].slice(0, 2).forEach(a => jobs.push([k, a, pl === 'big']))); try{ jobs.push([k, Acting.sig(w.av), true]); }catch(e){} });
      const step = () => { if(F.dead) return; const t0 = performance.now(); while(jobs.length && performance.now() - t0 < 12){ const j = jobs.shift(); try{ F.strip(j[0], j[1], j[2]); }catch(e){} } if(jobs.length) (window.requestIdleCallback || (fn => setTimeout(fn, 40)))(step); };
      (window.requestIdleCallback || (fn => setTimeout(fn, 300)))(step); };
    F.clear = () => { F.live = []; };
    F.stop = () => { F.dead = true; F.live = []; };
    return F;
  }
  return {RIM, POOLS, MULT, hidden, setHidden, toggle, pick, tags, draw, chips, make, on};
})();
