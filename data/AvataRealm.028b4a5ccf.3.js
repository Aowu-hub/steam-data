
/* 🎵 MOOD (24u-ar) START — ⚔️ Realm march, the ✨ Polish chat's music block (plan Ambient Moods §12h, Aowu 2026-11-27 17:46 "go" = all ⭐).
   Reads the page only from outside (window.AVATAREALM + the AR engine object) — no line inside the game changes:
   AR.step is wrapped to count the hits of each step (M.hits, before soundTick empties it) · AR.takeEvents is wrapped to see the moments.
   tension: 🏗️ build 0.08 (House Lv 2+ 0.18) · 🚩 a squad 8+ tiles from home 0.36 · 💥 hits near you / on screen (last 3 s) 0.5 → 0.75 ·
   🏠 rival fighters near your House 0.8 → 0.9 · House hurt > 30 % 0.9 — rises 0.25 / s, falls 0.04 / s (battle music lingers ~10 s).
   🎉 lift (one every 3 s): ⭐ shrine yours · 🏚️ a rival building gone · 🏠 House up · 🌌 your wonder power · 🏆 win. 🗼 Song Spire = 🎵 rally for its secs.
   🤫 hush: 🐢 Turn mode while you plan · 🧾 formation sheet. Stop: match over · back to the setup / cover. Side tint = your side, rival = team 1's side. */
(function(){ 'use strict';
  const A = window.AVATAREALM, U = window.UISound;
  if(!A || !A.S || !U || !U.mood || typeof AR === 'undefined') return;
  const S = A.S, SPD = {0.7: .94, 1: 1, 1.5: 1.06};
  const MS = window.AR_MOOD = {H: null, M: null, cur: .08, target: .08, hits: [], liftT: -9, won: false, overT: 0, last: performance.now()};
  const now = () => performance.now() / 1000;
  // 💥 every engine step: count the hits that matter (near your House / on screen / by you)
  const step0 = AR.step;
  AR.step = function(M, dt){ const r = step0.apply(this, arguments);
    try{ if(M && M === S.M && M.hits && M.hits.length){ const t = now(), H = home(M);
      for(const h of M.hits) if(h[0] === 0 || near(h[2], h[3], H, 9) || onScreen(h[2], h[3])) MS.hits.push(t);
      if(MS.hits.length > 400) MS.hits.splice(0, MS.hits.length - 400); } }catch(e){}
    return r; };
  // 🎉 moments
  const take0 = AR.takeEvents;
  AR.takeEvents = function(M){ const ev = take0.apply(this, arguments);
    try{ if(M && M === S.M && ev && ev.length) ev.forEach(moment); }catch(e){}
    return ev; };
  function moment(e){ const H = MS.H; if(!H || !H.live) return;
    if(e.k === 'wonder.burst' && e.team === 0 && e.p === 'rally' && H.R){ H.R.rally = Date.now() + (e.secs || 45) * 1000; lift(true); return; }
    if((e.k === 'shrine.taken' && e.team === 0) || (e.k === 'house.up' && e.team === 0) || (e.k === 'wonder.burst' && e.team === 0)
      || (e.k === 'bld.gone' && e.team !== 0 && !e.undo)) lift();
    if(e.k === 'match.win'){ MS.won = e.team === 0; if(MS.won) lift(true); } }
  function lift(force){ const t = now(); if(!force && t - MS.liftT < 3) return; MS.liftT = t; try{ MS.H.lift(); }catch(e){} }
  function home(M){ return (M.blds || []).find(b => b.team === 0 && b.slot === 'house' && !b.gone) || null; }
  function near(x, y, H, r){ return !!H && Math.hypot(x - (H.i + H.w / 2), y - (H.j + H.d / 2)) < r; }
  function onScreen(x, y){ const V = S.V; if(!V || !V.toScreen) return false; const p = V.toScreen(x, y, 0); return p.x > -40 && p.y > -60 && p.x < V.W + 40 && p.y < V.H + 40; }
  // 🎵 start / stop
  function start(){ const C = S.cfg || {}; let rival = null; try{ rival = A.sideFor ? A.sideFor(C, 1) : null; }catch(e){}
    MS.H = U.mood('avatarealm', {tint: C.side, rival: rival}); MS.M = S.M; MS.cur = MS.target = .08; MS.hits.length = 0; MS.won = false; MS.overT = 0;
    if(MS.H && MS.H.R){ const f = C.turn ? 1 : (SPD[S.speed] || 1); MS.H.R.bpm = Math.round(MS.H.R.bpm * f); }
    if(MS.H) MS.H.tension(MS.cur); }
  function stop(){ if(MS.H){ try{ MS.H.stop(); }catch(e){} } MS.H = null; MS.M = null; }
  function target(M){ const H = home(M), t = now(); MS.hits = MS.hits.filter(x => t - x < 3);
    let T = H && (H.lv || 1) >= 2 ? .18 : .08;
    const mine = M.units.filter(u => u.team === 0 && !u.dead && u.role !== 'worker');
    if(H && mine.some(u => !near(u.x, u.y, H, 8))) T = Math.max(T, .36);
    const fight = Math.min(1, MS.hits.length / 12); if(fight > 0) T = Math.max(T, .5 + .25 * fight);
    if(H){ const foes = M.units.filter(u => u.team !== 0 && !u.dead && u.role !== 'worker' && near(u.x, u.y, H, 8)).length;
      if(foes) T = Math.max(T, .8 + .1 * Math.min(1, foes / 6));
      if(H.max > 0 && H.hp < H.max * .7) T = Math.max(T, .9); }
    return T; }
  function tick(){ const t1 = performance.now(), dt = Math.min(.5, (t1 - MS.last) / 1000); MS.last = t1;
    const M = S.M, playing = !!(M && S.ready && S.loop && !M.over && !S.over);
    if(MS.H && (!MS.H.live || MS.M !== M)) stop();
    if(!playing){ if(MS.H && (M && (M.over || S.over))){ if(!MS.overT) MS.overT = t1; if(t1 - MS.overT > 1200) stop(); } else if(MS.H && !M) stop(); return; }
    if(!MS.H) start(); const H = MS.H; if(!H) return;
    MS.target = target(M);
    MS.cur = MS.cur < MS.target ? Math.min(MS.target, MS.cur + .25 * dt) : Math.max(MS.target, MS.cur - .04 * dt);
    H.tension(MS.cur);
    H.hush(!!((M.turn && M.turn.phase === 'plan') || S.form)); }
  setInterval(tick, 250);
})();
/* 🎵 MOOD (24u-ar) END */
