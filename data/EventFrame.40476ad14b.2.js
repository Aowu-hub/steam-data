
// 🎪 EVENT FRAME (🧱 b5c) — events on every game's 🎬 cover + 🏁 result card. Plan "Events — full plan.md" §17.
//   Events.frame.cover(C, ev, {game, me, players, avatarOf, el})  ← GameFrame, when the cover's ONE getGameLeaders answer lands (ev = answer.events)
//       🎗️ ribbon on the panel's "👋 Hi" line: featured game = "🔬 Science week · ⚡ ×2" · a day = "🎄 Counts for Christmas" (only when THIS play
//       would count) · both = two badges · never over the logo / ▶ / champions / lineup (it sits on the hi line, shrinks: words → short → badges)
//       tap = the same 🎪 sheet as the Dashboard · a finished goal not claimed yet → claimed quietly + 🎟️ pops out of the ribbon
//   Events.frame.row(card, o)  ← GameFrame result(): ONE event row "🔬 +1 Science week · 7 / 11 together" (+ mini pip bar, ⚡ ×2 chip)
//       → returns {saved(ok)}; the claim waits for the save (save note ✅ / card.saved / 6 s), the server counts again, then 🎟️ stamp slam
// Rules: E1 never ranks (pips in family order, shirt colours) · E3 no countdowns · E7 0 extra reads (data rides the leaders call) · E12 badges baked once
(function(root){
  const E = root.Events; if(!E || E.frame) return;
  const LOG = [], U = () => E.ui || {};
  let CUR = null;   // the last cover: {ev, game, me, players, avatarOf, col}
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const lang = me => { try { return root.Motto ? Motto.lang(me) : 'en'; } catch(e){ return 'en'; } };
  const look = k => (U().look ? U().look(k) : null) || {a: '#FF9F1C', b: '#7A5CFA', ink: '#4B32B5', short: [k, k]};
  const calm = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){ return false; } };
  const sfx = k => { try { if(root.UISound && UISound.play) UISound.play(k); } catch(e){} };

  // which of today's goals THIS play adds to (k: 'day' | 'week')
  function counts(ev, game, me, res){
    const out = []; if(!ev || ev.err || ev.on === false || !ev.week) return out;
    const mine = ev.mine || {games: []}, d = ev.day, w = ev.week;
    if(d && d.family){ const n = d.goal.n, have = (d.family.by && d.family.by[me]) || 0, isNew = (mine.games || []).indexOf(game) < 0;
      if(isNew && have < n) out.push({k: 'day', key: d.id, icon: d.icon, L: look(d.id), fam: d.family, cap: n, id: 'day:' + d.id + ':' + d.from, en: (look(d.id).short || [])[0] || d.en, th: (look(d.id).short || [])[1] || d.th}); }
    if(w.family && (w.ids || []).indexOf(game) >= 0){ const L = look(w.letter);
      const ok = !res || w.family.k === 'plays' || (res.stars > 0) || res.win === true;
      if(ok) out.push({k: 'week', key: w.letter, icon: w.icon, L, fam: w.family, cap: 0, x2: true, id: 'week:' + w.from, en: w.en, th: w.th}); }
    return out;
  }
  function colours(){ if(!CUR) return {}; if(!CUR.col) CUR.col = U().colours ? U().colours(CUR.players, CUR.avatarOf) : {}; return CUR.col; }

  // ---- 🎗️ cover ribbon ----
  function cover(C, ev, o){
    o = o || {}; const el = o.el || (C && C.el); if(!el) return null;
    CUR = {ev, game: o.game, me: o.me || 'Guest', players: (o.players || []).map(p => p && (p.Name || p.name) || p).filter(Boolean), avatarOf: o.avatarOf, C};
    if(CUR.players.indexOf(CUR.me) < 0 && CUR.me !== 'Guest') CUR.players.push(CUR.me);
    const old = el.querySelector('.evf-rib'); if(old) old.remove();
    const hi = el.querySelector('.gf-hi'); if(!hi || !ev || ev.err || ev.on === false || (C && C.tv) || !o.me || o.me === 'Guest') { LOG.push('cover:none'); return null; }   // guests save nothing → nothing counts
    const list = counts(ev, o.game, CUR.me), can = (ev.mine && ev.mine.can) || [];
    if(!list.length && !can.length){ LOG.push('cover:none'); return null; }
    const th = lang(CUR.me) === 'th', b = document.createElement('button');
    b.className = 'evf-rib'; b.type = 'button'; b.setAttribute('data-sound', 'tap');
    const main = list[0] || {L: look(ev.day ? ev.day.id : ev.week.letter), key: ev.day ? ev.day.id : ev.week.letter};
    b.style.setProperty('--ev-a', main.L.a); b.style.setProperty('--ev-b', (list[1] || main).L.b); b.style.setProperty('--ev-ink', main.L.ink);
    const wk = list.find(x => x.k === 'week'), dy = list.find(x => x.k === 'day');
    const words = wk && dy ? (th ? dy.th + ' + ' + wk.th : dy.en + ' + ' + wk.en) : wk ? (th ? wk.th : wk.en) : dy ? (th ? 'นับให้' + dy.th : 'Counts for ' + dy.en) : (th ? 'แสตมป์ของคุณ!' : 'Your stamp!');
    b.innerHTML = '<span class="evf-bs">' + list.map(x => '<canvas class="evf-b" data-k="' + esc(x.key) + '" aria-hidden="true"></canvas>').join('') + '</span>' +
      '<span class="evf-w">' + esc(words) + '</span>' + (wk ? '<span class="evf-x2">⚡×2</span>' : dy ? '<span class="evf-x2 c">+1</span>' : '') + '<i class="evf-tail" aria-hidden="true"></i>';
    b.setAttribute('aria-label', (wk ? (th ? wk.th + ' — ไมล์ ×2 ในเกมนี้' : wk.en + ' — ×2 miles in this game') : '') + (dy ? (wk ? ' · ' : '') + (th ? 'เกมนี้นับให้' + dy.th : 'this game counts for ' + dy.en) : ''));
    b.dataset.kinds = list.map(x => x.k).join(',') || 'stamp';
    hi.appendChild(b);
    b.querySelectorAll('canvas.evf-b').forEach(cv => { try { U().badge(cv, cv.dataset.k, 26); } catch(e){} });
    b.onclick = e => { e.stopPropagation(); LOG.push('cover:tap'); open(); };
    fitRib(b); addEventListener('resize', () => b.isConnected && fitRib(b));
    LOG.push('cover:' + b.dataset.kinds);
    if(can.length) setTimeout(() => claimAll(can, {rib: b}), 900);   // a goal finished while I was away → my stamp now
    return b;
  }
  // words → short → badges only, until the ribbon clears the "👋 Hi …" words (never a 2nd line, never over anything)
  function fitRib(b){
    const hi = b.parentNode; if(!hi) return; b.classList.remove('s1', 's2', 's3'); hi.querySelectorAll('.evf-cut').forEach(x => { x.classList.remove('evf-cut'); x.style.maxWidth = ''; });
    { const pn = hi.closest('.gf-panel'), e = pn ? Math.max(0, Math.round(pn.getBoundingClientRect().right - hi.getBoundingClientRect().right)) : 0; b.style.setProperty('--evf-edge', e + 'px'); }   // the ribbon wraps round the panel's edge
    const clear = () => { const r = b.getBoundingClientRect(), hr = hi.getBoundingClientRect(); let ok = r.left >= hr.left - 1;
      hi.querySelectorAll(':scope > span, :scope > em').forEach(s => { const q = s.getBoundingClientRect(); if(q.width && q.right > r.left - 6 && q.top < r.bottom && q.bottom > r.top) ok = false; }); return ok; };
    if(clear()) return; b.classList.add('s1'); if(clear()) return; b.classList.remove('s1'); b.classList.add('s2'); if(clear()) return;
    const em = hi.querySelector(':scope > em'), hr = hi.getBoundingClientRect();
    if(em && em.getBoundingClientRect().top - hr.top < 4){   // one full line: the 🥇 medal words end in "…" just before the badges
      em.classList.add('evf-cut'); em.style.maxWidth = Math.max(40, Math.round(b.getBoundingClientRect().left - em.getBoundingClientRect().left - 8)) + 'px'; if(clear()) return; }
    b.classList.add('s3');   // the hi line wrapped (a long 🥇 medal line): the badges sit on its FIRST line, beside "👋 Hi …"
  }
  function open(){
    if(!CUR || !U().sheet) return null;
    return U().sheet({ev: CUR.ev, me: CUR.me, players: CUR.players, avatarOf: CUR.avatarOf, go: (route, id) => {
      LOG.push('sheet:go:' + id);
      if(id === CUR.game || route === CUR.game) return;            // ▶ Play this game → back to its own cover
      try { if(root.UI && UI.go) return UI.go('?page=' + encodeURIComponent(route) + '&player=' + encodeURIComponent(CUR.me)); } catch(e){}
    }});
  }

  // ---- 🏁 result row ----
  function row(card, o){
    o = o || {}; const none = {saved(){}, el: null};
    if(!CUR || !card || o.events === false) return none;
    const game = o.game || CUR.game, list = counts(CUR.ev, game, CUR.me, o);
    if(!list.length || o.win === null && o.stars == null && !o.save) return none;
    const th = lang(CUR.me) === 'th', col = colours(), me = CUR.me;
    const el = document.createElement('div'); el.className = 'evf-row'; el.dataset.kinds = list.map(x => x.k).join(',');
    el.style.setProperty('--ev-a', list[0].L.a); el.style.setProperty('--ev-b', (list[1] || list[0]).L.b); el.style.setProperty('--ev-ink', list[0].L.ink);
    list.forEach(x => { x.have0 = x.fam.have; x.have1 = Math.min(x.fam.need, x.fam.have + 1); x.done = x.have1 >= x.fam.need; });
    el.innerHTML = list.map(x => {
      const pips = pipsOf(x, col, me), line = x.k === 'day'
        ? (th ? '+1 เกมวันนี้ · ' + x.th : '+1 game for ' + x.en)
        : (th ? '+1 ' + x.th : '+1 for ' + x.en);
      return '<div class="evf-g" data-k="' + x.k + '" style="--g-a:' + x.L.a + ';--g-b:' + x.L.b + ';--g-ink:' + x.L.ink + '"><canvas class="evf-b" data-k="' + esc(x.key) + '" aria-hidden="true"></canvas>' +
        '<div class="evf-t"><b>' + esc(line) + '</b><span class="evf-p" role="img" aria-label="' + x.have1 + ' / ' + x.fam.need + '">' + pips + '</span>' +
        '<small>' + x.have1 + ' / ' + x.fam.need + (th ? ' ช่วยกัน' : ' together') + (x.done ? (th ? ' · 🎉 สำเร็จ!' : ' · 🎉 done!') : '') + '</small></div>' +
        (x.x2 ? '<span class="evf-x2">⚡ ' + (th ? 'ไมล์ ×2' : '×2 miles') + '</span>' : '') + '</div>';
    }).join('');
    const base = Math.max(0, card.scrollHeight - card.clientHeight);   // some cards already scroll a few px (button shadows) — only OUR growth counts
    const before = card.querySelector('.gf-r-save') || card.querySelector('.gf-r-comic') || card.querySelector('.gf-r-btns');
    if(before) before.parentNode.insertBefore(el, before); else card.appendChild(el);
    el.querySelectorAll('canvas.evf-b').forEach(cv => { try { U().badge(cv, cv.dataset.k, 30); } catch(e){} });
    fitRow(card, el, base); el.dataset.base = base; LOG.push('row:' + el.dataset.kinds + ':' + list.map(x => x.have1 + '/' + x.fam.need).join(','));
    // the claim waits for the save: save note loses its spinner / says Saved → card.saved(true) → or 6 s
    let fired = false; const goals = list.filter(x => x.done).map(x => x.id).concat(((CUR.ev.mine || {}).can || []));
    const fire = () => { if(fired) return; fired = true; if(goals.length) claimAll(goals, {row: el, list}); };
    const note = card.querySelector('.save-note, #save-note');
    if(note){ const re = new MutationObserver(() => requestAnimationFrame(() => el.isConnected && fitRow(card, el, base))); re.observe(note, {childList: true, subtree: true, characterData: true}); }   // "✅ Saved!" is a little taller than the spinner line
    if(note && goals.length){ const mo = new MutationObserver(() => { if(!note.querySelector('.ui-spin') || /Saved|บันทึก/.test(note.textContent)){ mo.disconnect(); setTimeout(fire, 250); } }); mo.observe(note, {childList: true, subtree: true, characterData: true}); }
    if(goals.length) setTimeout(fire, 6000);
    // after a claim the cover's numbers move on (Again → same page, the row starts from the new count)
    list.forEach(x => { x.fam.have = x.have1; if(x.fam.by) x.fam.by[me] = (x.fam.by[me] || 0) + 1; if(x.k === 'day' && CUR.ev.mine) (CUR.ev.mine.games = CUR.ev.mine.games || []).push(game); });
    return {el, saved(ok){ if(ok) setTimeout(fire, 250); }};
  }
  function pipsOf(x, col, me){
    const fam = x.fam, P = CUR.players, need = fam.need, by = Object.assign({}, fam.by || {});
    if(need > 15){ const w = n => Math.min(by[n] || 0, x.cap || 1e9) / need * 100;
      return '<span class="evf-bar">' + P.map(n => '<i style="--c:' + col[n] + ';width:' + w(n) + '%"></i>').join('') + '<i class="new" style="--c:' + col[me] + ';width:' + (100 / need) + '%"></i></span>'; }
    const out = []; P.forEach(n => { const k = Math.min(by[n] || 0, x.cap || 1e9); for(let i = 0; i < k && out.length < need; i++) out.push(n); });
    // the new pip goes right after MY pips (family order kept, never sorted)
    let at = -1; if(out.length < need){ let seen = 0; at = out.length; for(const n of P){ seen += Math.min(by[n] || 0, x.cap || 1e9); if(n === me){ at = Math.min(seen, out.length); break; } } out.splice(at, 0, '*' + me); }
    while(out.length < need) out.push('');
    return out.slice(0, need).map((n, i) => n ? '<i class="f' + (i === at ? ' new' : '') + '" style="--c:' + (col[n.replace(/^\*/, '')] || '#7B5FE0') + '"></i>' : '<i></i>').join('');
  }
  // phones: two goals or a short card → one line each (pips hide, the numbers stay); never push the buttons off the card
  function fitRow(card, el, base){
    el.classList.remove('c1', 'c2'); const wrap = card.parentNode, over = () => { const r = card.getBoundingClientRect();
      return card.scrollHeight - card.clientHeight > base + 1 || r.bottom > innerHeight + 1 || (wrap && r.height >= wrap.clientHeight - 2 && card.scrollHeight > card.clientHeight + 1); };
    if(!over()) return; el.classList.add('c1'); if(!over()) return; el.classList.add('c2'); if(!over()) return; el.classList.add('c3');   // c3: two goals side by side on ONE line
  }

  // ---- 🎟️ claim + stamp ----
  function claimAll(ids, at){
    ids = ids.filter((x, i) => ids.indexOf(x) === i); if(!ids.length || !CUR) return;
    const me = CUR.me; if(!root.google || !google.script || !google.script.run) return;
    ids.forEach(id => { LOG.push('claim:' + id);
      google.script.run.withSuccessHandler(r => { LOG.push('claimed:' + id + ':' + (r && (r.ok ? (r.already ? 'already' : 'new') : r.why)));
        if(!r || !r.ok || r.already) return; const mine = CUR.ev.mine; if(mine){ mine.can = (mine.can || []).filter(x => x !== id); mine.got = (mine.got || []).concat([id]); }
        stamp(r, at); }).withFailureHandler(e => LOG.push('claim:fail:' + (e && e.message))).claimEvent(me, id); });
  }
  const STAMPS = {};
  function bakeStamp(r, px){
    const k = (r.id || '') + '|' + px; if(STAMPS[k]) return STAMPS[k];
    const id = String(r.id || ''), key = id.indexOf('week:') === 0 ? (CUR.ev.week && CUR.ev.week.letter) : id.split(':')[1], L = look(key), th = lang(CUR.me) === 'th';
    const dpr = Math.min(3, root.devicePixelRatio || 1), W = Math.round(px * 2.45), H = Math.round(px), c = document.createElement('canvas'); c.width = W * dpr; c.height = H * dpr;
    const g = c.getContext('2d'); g.scale(dpr, dpr);
    const notch = H * 0.16, path = () => { g.beginPath(); g.moveTo(6, 2); g.lineTo(W - 6, 2); g.quadraticCurveTo(W - 2, 2, W - 2, 6);
      g.lineTo(W - 2, H / 2 - notch); g.arc(W - 2, H / 2, notch, -Math.PI / 2, Math.PI / 2, true); g.lineTo(W - 2, H - 6); g.quadraticCurveTo(W - 2, H - 2, W - 6, H - 2);
      g.lineTo(6, H - 2); g.quadraticCurveTo(2, H - 2, 2, H - 6); g.lineTo(2, H / 2 + notch); g.arc(2, H / 2, notch, Math.PI / 2, -Math.PI / 2, true); g.lineTo(2, 6); g.quadraticCurveTo(2, 2, 6, 2); g.closePath(); };
    path(); const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, L.a); gr.addColorStop(1, L.b); g.fillStyle = gr; g.fill();
    g.lineWidth = 2.2; g.strokeStyle = 'rgba(255,255,255,.95)'; g.stroke();
    g.save(); path(); g.clip(); g.globalAlpha = .16; g.fillStyle = '#fff'; for(let x = -H; x < W; x += 9){ g.beginPath(); g.moveTo(x, H); g.lineTo(x + H, 0); g.lineTo(x + H + 3, 0); g.lineTo(x + 3, H); g.fill(); } g.restore();
    g.setLineDash([3, 4]); g.lineWidth = 1.4; g.strokeStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.moveTo(H * 0.98, 7); g.lineTo(H * 0.98, H - 7); g.stroke(); g.setLineDash([]);
    try { const b = document.createElement('canvas'); U().badge(b, key, H * 0.72 / dpr * dpr); g.drawImage(b, H * 0.13, H * 0.14, H * 0.72, H * 0.72); } catch(e){}
    const st = r.stamp || {}, ttl = (th ? (st.th || '') : (st.en || '')).replace(/[!！].*$/, '').replace(/^(Happy |สุขสันต์)/, '');
    g.textAlign = 'left'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    const tx = H * 1.08, fit = (t, f, max) => { let s = f; g.font = '800 ' + s + "px 'Fredoka',sans-serif"; while(g.measureText(t).width > max && s > 8){ s -= 1; g.font = '800 ' + s + "px 'Fredoka',sans-serif"; } };
    const top = (ttl || (CUR.ev.week && CUR.ev.week.en) || 'Event').toUpperCase(); fit(top, Math.round(H * 0.22), W - tx - 8);
    g.lineWidth = 3; g.strokeStyle = L.ink; g.strokeText(top, tx, H * 0.32); g.fillStyle = '#fff'; g.fillText(top, tx, H * 0.32);
    const sub = (th ? 'แสตมป์ครอบครัว ' : 'FAMILY STAMP ') + String(st.at || '').slice(0, 4); g.font = '800 ' + Math.round(H * 0.15) + "px 'Nunito',sans-serif";
    { let f = Math.round(H * 0.15); while(g.measureText(sub).width > W - tx - 10 && f > 7){ f--; g.font = '800 ' + f + "px 'Nunito',sans-serif"; } }
    g.fillStyle = 'rgba(255,255,255,.95)'; g.fillText(sub, tx, H * 0.55);
    const m = '+' + (r.miles || 0) + ' 🛣️'; g.font = '800 ' + Math.round(H * 0.2) + "px 'Fredoka',sans-serif"; g.lineWidth = 3; g.strokeStyle = L.ink; g.strokeText(m, tx, H * 0.78); g.fillStyle = '#FFF4B8'; g.fillText(m, tx, H * 0.78);
    return (STAMPS[k] = c);
  }
  // 🎬 beats: ready → lift + tilt (anticipation) → SLAM (contact: ink ring · card nudge · pop) → overshoot → settle
  function stamp(r, at){
    at = at || {}; const kind = String(r.id).indexOf('week:') === 0 ? 'week' : 'day';
    const host = (at.row && (at.row.querySelector('.evf-g[data-k="' + kind + '"]') || at.row)) || (at.rib && at.rib.parentNode) || document.body, th = lang(CUR.me) === 'th';
    const px = at.row ? 64 : 50, src = bakeStamp(r, px), w = document.createElement('div'); w.className = 'evf-stamp' + (at.row ? '' : ' on-cover'); w.dataset.id = r.id;
    const cv = document.createElement('canvas'); cv.width = src.width; cv.height = src.height; cv.style.width = (src.width / Math.min(3, root.devicePixelRatio || 1)) + 'px'; cv.getContext('2d').drawImage(src, 0, 0);
    w.appendChild(cv); const ink = document.createElement('i'); ink.className = 'evf-ink'; w.appendChild(ink);
    host.appendChild(w); if(calm()) w.classList.add('calm');
    setTimeout(() => { sfx('pop'); const c = host.closest && host.closest('.gf-rcard, .gf-rc'); if(c && !calm()){ c.classList.add('evf-nudge'); setTimeout(() => c.classList.remove('evf-nudge'), 260); } }, calm() ? 0 : 330);
    if(at.row){ const g = at.row.querySelector('.evf-g[data-k="' + kind + '"] small'); host.classList.add('stamped');
      if(g) setTimeout(() => { g.innerHTML = (th ? '🎟️ ได้แสตมป์แล้ว! <b>+' + r.miles + ' 🛣️</b> ทุกคนที่ช่วย' : '🎟️ Stamp! <b>+' + r.miles + ' 🛣️</b> for every helper'); g.classList.add('won'); const cd = at.row.closest('.gf-rcard, .gf-rc'); if(cd) fitRow(cd, at.row, +at.row.dataset.base || 0); }, 420); }
    else setTimeout(() => { w.classList.add('away'); setTimeout(() => w.remove(), 600); }, 3600);
    LOG.push('stamp:' + r.id);
    return w;
  }
  E.frame = {cover, row, open, fit: fitRib, counts, claimAll, stamp, LOG, get cur(){ return CUR; }, VERSION: 'b5c'};
})(window);
