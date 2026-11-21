
/* 📏 s-bo cups#1 */
const CUP_TEAMS = [['🦖', 'Dino Kickers'], ['🐙', 'Octo United'], ['🤖', 'Robo Rovers'], ['🪐', 'Moon Rockets'], ['☁️', 'Cloud City'], ['🌋', 'Lava Lions'], ['🐝', 'Buzz FC'], ['🦈', 'Shark Bay'], ['🦄', 'Unicorn Stars'], ['🐸', 'Hop Town'], ['🦉', 'Owl Athletic'], ['🍕', 'Pizza Pals']];
const CUP_COLS = ['#2F80ED', '#E5484D', '#2DBE6C', '#FF8A1F', '#7A5CFA', '#1FA9D6', '#FFB020', '#E0457B', '#5B6CFF', '#1DB98A', '#B5651D', '#8E44AD'];
/* 📏 s-bo cups#2 */
function cupSave(T){ ls(cupKey(T.kind), JSON.stringify(T)); }
function cupClear(kind){ try{ localStorage.removeItem(cupKey(kind)); }catch(e){} }
function shuffle(a){ a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// teams: you (+ for 👑 the family captains) and robot teams with a strength around the level
function cupNew(kind, size, level){
  const me = {id: 0, name: kind === 'family' ? S.player + "'s team" : 'Team ' + S.player, icon: '⭐', col: TEAM_COL[0], me: true, str: level, captain: kind === 'family' ? S.player : null};
  const teams = [me], fam = kind === 'family' ? others().slice(0, 7) : [];
  fam.forEach((n, i) => teams.push({id: teams.length, name: n + "'s team", icon: '👑', col: CUP_COLS[(i + 2) % CUP_COLS.length], captain: n, str: level + (Math.random() - 0.5) * 0.6}));
  const want = kind === 'league' ? 4 : kind === 'family' ? (teams.length <= 4 ? 4 : 8) : 8, pool = shuffle(CUP_TEAMS);
  while(teams.length < want){ const [ic, nm] = pool.pop(); teams.push({id: teams.length, name: nm, icon: ic, col: CUP_COLS[teams.length % CUP_COLS.length], str: level + (Math.random() - 0.5) * 1.2 + (teams.length === want - 1 ? 0.35 : 0)}); }
  const T = {v: 1, kind, size, level, theme: SET.theme, teams, done: false, champ: -1, made: Date.now()};
  if(kind === 'league'){   // round robin, 3 matchdays: (0-1, 2-3) (0-2, 1-3) (0-3, 1-2) — you play every matchday
    const ids = shuffle([1, 2, 3]); T.days = [[[0, ids[0]], [ids[1], ids[2]]], [[0, ids[1]], [ids[0], ids[2]]], [[0, ids[2]], [ids[0], ids[1]]]].map(d => d.map(([a, b]) => ({a, b, ga: null, gb: null})));
    T.day = 0;
  } else { const order = shuffle(teams.map(t => t.id)); T.rounds = [[]]; for(let i = 0; i < order.length; i += 2) T.rounds[0].push({a: order[i], b: order[i + 1], ga: null, gb: null, pens: null}); T.round = 0; }
  return T;
}
// 🎲 the quick score roll for a match you don't play: stronger team scores a bit more often
function poisson(l){ let k = 0, p = Math.exp(-l), t = Math.random(); let c = p; while(t > c && k < 8){ k++; p *= l / k; c += p; } return k; }
function cupRoll(T, fx, knock){
  const A = T.teams[fx.a], B = T.teams[fx.b], d = (A.str - B.str) * 0.28;
  fx.ga = poisson(Math.max(0.35, 1.35 + d)); fx.gb = poisson(Math.max(0.35, 1.35 - d));
  if(knock && fx.ga === fx.gb){ const pa = 0.5 + Math.max(-0.2, Math.min(0.2, d * 0.5)); let a = 3 + (Math.random() < pa ? 1 : 0), b = 3 + (Math.random() < 1 - pa ? 1 : 0); if(a === b) a += Math.random() < pa ? 1 : -1; fx.pens = [Math.max(0, a), Math.max(0, b)]; }
}
function fxWinner(fx){ if(fx.ga == null) return -1; if(fx.ga !== fx.gb) return fx.ga > fx.gb ? fx.a : fx.b; return fx.pens ? (fx.pens[0] > fx.pens[1] ? fx.a : fx.b) : -1; }
function leagueTable(T){
  const R = T.teams.map(t => ({id: t.id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0}));
  (T.days || []).forEach(day => day.forEach(f => { if(f.ga == null) return; const A = R[f.a], B = R[f.b]; A.p++; B.p++; A.gf += f.ga; A.ga += f.gb; B.gf += f.gb; B.ga += f.ga;
    if(f.ga > f.gb){ A.w++; B.l++; A.pts += 3; } else if(f.ga < f.gb){ B.w++; A.l++; B.pts += 3; } else { A.d++; B.d++; A.pts++; B.pts++; } }));
  return R.sort((x, y) => y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf || x.id - y.id);
}
// the match YOU play next (null = the cup is over for you)
function cupMyFixture(T){
  if(T.done) return null;
  if(T.kind === 'league'){ const day = T.days[T.day]; return day ? day.find(f => (f.a === 0 || f.b === 0) && f.ga == null) || null : null; }
  const r = T.rounds[T.round]; return r ? r.find(f => (f.a === 0 || f.b === 0) && f.ga == null) || null : null;
}
// after your match: roll the others in this round, then build the next round (or crown the champion)
function cupAdvance(T){
  if(T.kind === 'league'){
    const day = T.days[T.day]; day.forEach(f => { if(f.ga == null) cupRoll(T, f, false); });
    T.day++; if(T.day >= T.days.length){ T.done = true; T.champ = leagueTable(T)[0].id; }
    return;
  }
  const r = T.rounds[T.round]; r.forEach(f => { if(f.ga == null) cupRoll(T, f, true); });
  const win = r.map(fxWinner);
  if(win.length === 1){ T.done = true; T.champ = win[0]; return; }
  const nx = []; for(let i = 0; i < win.length; i += 2) nx.push({a: win[i], b: win[i + 1], ga: null, gb: null, pens: null});
  T.rounds.push(nx); T.round++;
  if(!cupMyFixture(T)) cupAdvance(T);   // you're out → the rest of the cup is played out at once
}
/* 📏 s-bo cups#3 */
function teamTag(T, id, cls){ const t = T.teams[id]; return '<span class="cup-team' + (t.me ? ' me' : '') + (cls ? ' ' + cls : '') + '" style="--tc:' + t.col + '"><i>' + t.icon + '</i>' + UI.esc(t.name) + '</span>'; }
function fxHtml(T, f, i){
  const w = fxWinner(f), sc = f.ga == null ? '<b class="vs">vs</b>' : '<b class="sc">' + f.ga + ' – ' + f.gb + (f.pens ? '<small>pens ' + f.pens[0] + '–' + f.pens[1] + '</small>' : '') + '</b>';
  return '<div class="cup-fx' + (f.a === 0 || f.b === 0 ? ' mine' : '') + '" style="--d:' + (i * 0.06) + 's">' + teamTag(T, f.a, w === f.a ? 'won' : w >= 0 ? 'lost' : '') + sc + teamTag(T, f.b, w === f.b ? 'won' : w >= 0 ? 'lost' : '') + '</div>';
}
/* 📏 s-bo cups#4 */
function showCup(T){
  CUPRUN = null; hideResult(); $('pads').innerHTML = '';
  const box = $('cup-box'), mine = cupMyFixture(T), name = MODES.find(m => m.k === T.kind).name, icon = MODES.find(m => m.k === T.kind).icon;
  let h = '<div class="title"><div class="logo" id="cup-logo">' + icon + '</div><h1>' + name + '</h1><p>' + SZ_NAME[T.size] + ' · ' + LEVEL_UI[T.level].emoji + ' ' + BO.LEVELS[T.level].name + (T.done ? '' : ' · ' + cupRoundName(T)) + '</p></div>';
  if(T.done){ const c = T.teams[T.champ], meWon = c.me;
    h += '<div class="cup-champ' + (meWon ? ' me' : '') + '"><canvas id="cup-lift" width="220" height="230"></canvas><div><div class="big">🏆</div><h2 class="' + (meWon ? 'cheer' : '') + '">' + (meWon ? 'Champions! ' + UI.esc(c.name) + ' lift the cup!' : c.icon + ' ' + UI.esc(c.name) + ' win the ' + (T.kind === 'league' ? 'league' : 'cup') + '!') + '</h2>' +
      (meWon ? '' : '<p class="note">' + cupHowFar(T) + '</p>') + '</div></div>';
  }
  if(T.kind === 'league'){ const tab = leagueTable(T);
    h += '<table class="cup-table"><tr><th></th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr>' + tab.map((r, i) => '<tr' + (T.teams[r.id].me ? ' class="me"' : '') + '><td>' + (i + 1) + '</td><td>' + teamTag(T, r.id) + '</td><td>' + r.p + '</td><td>' + r.w + '</td><td>' + r.d + '</td><td>' + r.l + '</td><td>' + (r.gf - r.ga > 0 ? '+' : '') + (r.gf - r.ga) + '</td><td><b>' + r.pts + '</b></td></tr>').join('') + '</table>';
    h += '<div class="cup-rounds">' + T.days.map((d, i) => '<div class="cup-round' + (i === T.day && !T.done ? ' now' : '') + '"><h3>Matchday ' + (i + 1) + '</h3>' + d.map(fxHtml.bind(null, T)).join('') + '</div>').join('') + '</div>';
  } else {
    const names = CUP_ROUND[T.rounds[0].length * 2] || [];
    h += '<div class="cup-rounds">' + names.map((nm, i) => { const r = T.rounds[i]; return '<div class="cup-round' + (i === T.round && !T.done ? ' now' : '') + '"><h3>' + nm + '</h3>' + (r ? r.map(fxHtml.bind(null, T)).join('') : '<div class="cup-fx tbd">🔒 winners meet here</div>') + '</div>'; }).join('') + '</div>';
  }
  h += '<div class="go-row">' + (mine ? '<button class="btn sp-btn sp-primary sp-lg" id="cup-play" data-sound="pop">⚽ Play: ' + UI.esc(T.teams[mine.a === 0 ? mine.b : mine.a].name) + '</button>' : '') +
    (T.done || !mine ? '<button class="btn sp-btn sp-primary sp-lg" id="cup-new" data-sound="pop">🆕 New ' + (T.kind === 'league' ? 'league' : 'cup') + '</button>' : '') + '</div>';
  box.innerHTML = h; showScreen('cup');
  try{ const lg = logoImg('cup', phoneLand() ? 52 : 74, 'bo-sbadge', ''); if(lg) $('cup-logo').innerHTML = lg; }catch(e){}
  if($('cup-play')) $('cup-play').onclick = () => cupPlay(T);
  if($('cup-new')) $('cup-new').onclick = () => { const T2 = cupNew(T.kind, T.size, T.level); cupSave(T2); showCup(T2); };
  if(T.done){ const c = T.teams[T.champ]; cupLift($('cup-lift'), c); if(c.me && FX) confetti(['🏆', '⭐', '🎉', '⚽'], 40); }
}
function cupHowFar(T){
  if(T.kind === 'league'){ const pos = leagueTable(T).findIndex(r => T.teams[r.id].me) + 1; return 'You finished ' + ['', '1st', '2nd', '3rd', '4th'][pos] + ' — one more go?'; }
  const out = T.rounds.findIndex(r => r.some(f => (f.a === 0 || f.b === 0) && fxWinner(f) !== 0 && fxWinner(f) >= 0)), names = CUP_ROUND[T.rounds[0].length * 2] || [];
  return out >= 0 ? 'You were knocked out in the ' + (names[out] || 'cup').toLowerCase() + ' — one more go?' : '';
}
// 🏆 the winner lifts the cup: a captain's own avatar (or a robot in its team colour) does a star jump with a trophy above the head
function cupLift(c, team){
  if(!c || !window.Acting) return; const g = c.getContext('2d'), av = team.captain ? myAvatar(team.captain) : team.me ? myAvatar(S.player) : defaultAvatar(team.name), t0 = performance.now();
  const R = actRun('celjump'), loop = () => { if(!c.isConnected) return; const t = (performance.now() - t0) / 1000, tot = R ? (R.start[4] + R.D[4].ms) / 1000 + 0.6 : 2, f = R ? R.at(Math.min(t % tot, tot - 0.6)) : null;
    g.clearRect(0, 0, c.width, c.height); g.save(); try{ Acting.draw(g, {name: team.name, av}, c.width / 2, c.height - 18, 1.25, f || 'happy', {t}); }catch(e){} g.restore();
    const up = f && f.pose ? -(f.pose.dy || 0) * 1.25 : 0; g.font = '54px serif'; g.textAlign = 'center'; g.fillText('🏆', c.width / 2, 70 + Math.min(0, -up * 0.5)); requestAnimationFrame(loop); };
  loop();
}
function cupPlay(T){
  const f = cupMyFixture(T); if(!f) return; const oppId = f.a === 0 ? f.b : f.a;
  SET.kind = T.kind; SET.size = T.size; SET.level = T.level; if(T.theme) SET.theme = T.theme;
  CUPRUN = {T, fx: f, me: T.teams[0], opp: T.teams[oppId], meIsA: f.a === 0}; startMatch();
}
function cupAfterMatch(M, mySide){
  const C = G.cup, T = C.T, f = C.fx, my = M.score[mySide], their = M.score[1 - mySide];
  if(C.meIsA){ f.ga = my; f.gb = their; } else { f.ga = their; f.gb = my; }
  if(M.pens && T.kind !== 'league'){ const pm = M.pens.g[mySide], po = M.pens.g[1 - mySide]; f.pens = C.meIsA ? [pm, po] : [po, pm]; }
  if(T.kind !== 'league' && f.ga === f.gb && !f.pens){ const w = M.winner === mySide; f.pens = C.meIsA ? (w ? [1, 0] : [0, 1]) : (w ? [0, 1] : [1, 0]); }   // a golden goal decided it
  cupAdvance(T); cupSave(T); G.cupDone = T;
  if(T.done && T.teams[T.champ]) GameComic._feed([{k: 'cupend', kind: T.kind, champ: T.teams[T.champ].name, me: !!T.teams[T.champ].me, captain: T.teams[T.champ].captain || null}]);   // 💥 📣 R4d: a trophy page / crowd
  if(T.done && T.teams[T.champ] && T.teams[T.champ].me){ const w = cupWins(); w[T.kind] = (w[T.kind] || 0) + 1; ls(store('cupwins'), JSON.stringify(w)); }   // 👕 R4c: a won cup unlocks its kit
  if(T.done && T.kind === 'family' && !T.fcSent){ const c = T.teams[T.champ]; if(c && c.captain){ T.fcSent = 1; cupSave(T); try{ google.script.run.withSuccessHandler(r => { window.FC_SAVED = r; }).withFailureHandler(() => {}).saveFamilyCup(S.player, {captain: c.captain, team: c.name, size: T.size, level: T.level}); }catch(e){} } }   /* 👑 bo-10b: the winning captain lifts the 🏆 on the Dashboard for a day */
  const rb = document.querySelector('#result-card .res-btns'); if(rb) rb.innerHTML = '<button class="btn soft sp-btn sp-secondary" id="btn-levels" data-sound="none" onclick="backToMenu()">🎚️ Levels</button><button class="btn sp-btn sp-primary" id="btn-cup" data-sound="pop" onclick="cupBack()">' + (T.done ? '🏆 See the winner' : '🏆 Back to the ' + (T.kind === 'league' ? 'table' : 'cup')) + '</button>';
}
function cupBack(){ const T = G && G.cupDone; if(G) cancelAnimationFrame(G.raf); G = null; V = null; if(T) showCup(T); else backToMenu(); }
GameParts.loaded('BlasOff_cups', 's-bo');
