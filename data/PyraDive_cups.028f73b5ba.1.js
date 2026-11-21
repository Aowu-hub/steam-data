
/* 📏 pd-s cups#1 */
/* ================= 🏆 CUPS (pd-4b) ================= */
function cupRoundName(C){ return CUP_ROUND[C.alive.length / 2] || 'Round'; }
function cupTeamHtml(t, lost){ return '<span class="cup-team' + (t.me ? ' me' : '') + (lost ? ' out' : '') + '">' + t.icon + ' ' + UI.esc(t.name) + '</span>'; }
function openCupSetup(lvl){
  const C = CUPS[SET.cup], L = PD.LEVELS[lvl]; SET.level = lvl;
  if(LEVEL_UI[lvl].hardcore || SET.who === 'duo') SET.who = 'robot';
  if(!SET.p2 || !others().includes(SET.p2)) SET.p2 = others()[0] || '';
  $('setup-logo').textContent = C.icon; $('setup-title').textContent = C.name + ' · ' + L.name;
  $('setup-sub').textContent = C.n + ' teams, knock-out: lose once and you are out · every match is one set, first to ' + CUP_TARGET[lvl] + (C.family ? ' · family members captain the other teams' : '') + ' · ' + LEVEL_UI[lvl].blurb.replace(/ (First to|Best of) [^.]*\./, '');
  const row = $('who-row'), sp = CUP_SPORTS.includes(SET.cupSport) ? SET.cupSport : 'beach';
  row.innerHTML = '<span class="cup-lbl">🏆 Cup:</span>' + CUP_ORDER.map(k => '<button class="chip' + (k === SET.cup ? ' on' : '') + '" data-ck="' + k + '" data-sound="tap">' + CUPS[k].icon + ' ' + CUPS[k].name + '</button>').join('') + '<span class="cup-br"></span><span class="cup-lbl">🏅 Sport:</span>' + CUP_SPORTS.map(k => '<button class="chip' + (k === sp ? ' on' : '') + '" data-sp="' + k + '" data-sound="tap">' + PD.MODES[k].icon + ' ' + PD.MODES[k].name + '</button>').join('')
    + (PD.MODES[sp].n > 1 && others().length && !LEVEL_UI[lvl].hardcore ? '<button class="chip' + (SET.who === 'team' ? ' on' : '') + '" data-tm="1" data-sound="tap">🤝 + ' + UI.esc(SET.p2) + '</button>' : '');
  row.querySelectorAll('[data-ck]').forEach(b => b.onclick = () => { SET.cup = SET.cupKind = b.dataset.ck; savePrefs(); openCupSetup(lvl); });
  row.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => { SET.cupSport = b.dataset.sp; if(PD.MODES[SET.cupSport].n === 1) SET.who = 'robot'; savePrefs(); openCupSetup(lvl); });
  const tm = row.querySelector('[data-tm]'); if(tm) tm.onclick = () => { SET.who = SET.who === 'team' ? 'robot' : 'team'; savePrefs(); openCupSetup(lvl); };
  SET.cupSport = sp; SET.mode = sp; SET.cupTeams = cupTeams(C);
  $('team-box').innerHTML = '<div class="cup-pre"><div class="team-h">' + C.icon + ' ' + C.n + ' teams</div><div class="cup-grid">' + SET.cupTeams.map(t => '<div class="cup-seed' + (t.me ? ' me' : '') + '"><canvas width="72" height="84" data-cav="' + UI.esc(t.cap) + '"></canvas><b>' + t.icon + ' ' + UI.esc(t.name) + '</b><small>' + (t.me ? 'your team' : t.family ? '👑 captain ' + UI.esc(t.cap) : '🤖 robots') + '</small></div>').join('') + '</div></div>';
  $('team-box').querySelectorAll('canvas[data-cav]').forEach(c => { const t = SET.cupTeams.find(x => x.cap === c.dataset.cav); drawPreviewCanvas(c, t.av, {name: t.cap, t: 1}); });
  buildArenas();
  const mc = () => { $('aim-chip').textContent = '🎯 Landing marker: ' + (SET.marker ? 'on' : 'off'); $('aim-chip').classList.toggle('on', SET.marker); };
  mc(); $('aim-chip').onclick = () => { SET.marker = !SET.marker; savePrefs(); mc(); };
  $('go-btn').onclick = () => startCup();
  showScreen('setup');
}
function cupTeams(C){
  const fam = C.family ? others().slice().sort(() => Math.random() - 0.5) : [], pool = CUP_TEAMS.slice().sort(() => Math.random() - 0.5), teams = [];
  teams.push({name: 'Team ' + S.player, icon: '🔥', cap: S.player, av: playAv(myAvatar(S.player)), me: true});
  for(let i = 1; i < C.n; i++){ const f = fam[i - 1], c = pool[i - 1];
    teams.push(f ? {name: 'Team ' + f, icon: '👑', cap: f, av: playAv(myAvatar(f)), family: true} : {name: c[1], icon: c[0], cap: c[1] + ' captain', av: playAv(defaultAvatar(c[1].toLowerCase())), robot: true}); }
  return teams;
}
function startCup(){
  const C = CUPS[SET.cup], teams = (SET.cupTeams || cupTeams(C)).map((t, i) => Object.assign({}, t, {i}));
  const order = [0].concat(teams.slice(1).map(t => t.i).sort(() => Math.random() - 0.5));   // you play the first match of the bracket
  SET.cupState = {k: C.k, level: SET.level, sport: SET.cupSport, sportBack: SET.mode, teams, alive: order, results: [], round: 0, done: false, place: ''};
  showCupCard();
}
function cupPairs(Cs){ const a = Cs.alive, pr = []; for(let i = 0; i < a.length; i += 2) pr.push([a[i], a[i + 1]]); return pr; }
function cupMeTeamCfg(Cs, opp){
  const n = PD.MODES[Cs.sport].n, t = Cs.teams[opp], fam = others().filter(x => x !== SET.p2 && x !== t.cap).sort(() => Math.random() - 0.5);
  const t0 = [{name: S.player, av: playAv(myAvatar(S.player)), human: 1, pins: pinsOf(S.player)}];
  if(SET.who === 'team' && SET.p2 && n > 1) t0.push({name: SET.p2, av: playAv(myAvatar(SET.p2)), human: 2, pins: pinsOf(SET.p2)});
  let fi = 0; while(t0.length < n){ const nm = fam[fi++]; t0.push(nm ? {name: nm, av: playAv(myAvatar(nm)), robot: true} : {name: 'Robo-' + t0.length, av: playAv(defaultAvatar('robo' + t0.length)), robot: true}); }
  const t1 = [{name: t.robot ? t.name : t.cap, av: t.av, robot: true}]; while(t1.length < n) t1.push({name: t.name + ' ' + (t1.length + 1), av: playAv(defaultAvatar(t.name + t1.length)), robot: true});
  return [t0, t1];
}
function cupSimulate(Cs, a, b){   // a robot-vs-robot match of the bracket (a real quick match of the engine)
  const r = PD.simulate({mode: Cs.sport, level: Cs.level, seed: (Date.now() + a * 7 + b * 13) % 100000 + 1, oneSet: true, target: CUP_TARGET[Cs.level], teams: [[{name: 'A'}], [{name: 'B'}]]}, 900);
  const w = r.winner === 1 ? 1 : 0; return {a, b, w: w === 0 ? a : b, score: r.score};
}
function showCupCard(last){
  const Cs = SET.cupState, C = CUPS[Cs.k], champ = Cs.done && Cs.place === 'champion';
  const rounds = []; let n = Cs.teams.length; while(n >= 2){ rounds.push(n); n /= 2; }
  const resHtml = Cs.results.map(r => '<div class="cup-res' + (r.a === 0 || r.b === 0 ? ' mine' : '') + '">' + cupTeamHtml(Cs.teams[r.a], r.w !== r.a) + '<b>' + r.score.join(' – ') + '</b>' + cupTeamHtml(Cs.teams[r.b], r.w !== r.b) + '<i>' + (r.w === r.a ? '◀' : '▶') + '</i></div>').join('');
  const next = !Cs.done ? cupPairs(Cs).find(p => p[0] === 0 || p[1] === 0) : null, opp = next ? (next[0] === 0 ? next[1] : next[0]) : -1;
  let h = '<div class="big">' + (champ ? '🏆' : Cs.done ? '🏅' : C.icon) + '</div><h2 class="' + (champ ? 'cheer' : '') + '">' + (champ ? 'You won the ' + C.name + '!' : Cs.done ? (Cs.place === 'final' ? '🥈 Runner-up!' : Cs.place === 'semi' ? '🥉 Semi-finalist!' : 'Out in the quarter-final') : C.name + ' · ' + cupRoundName(Cs)) + '</h2>'
    + '<div class="note">' + PD.MODES[Cs.sport].icon + ' ' + PD.MODES[Cs.sport].name + ' · ' + PD.LEVELS[Cs.level].name + ' · first to ' + CUP_TARGET[Cs.level] + '</div>';
  if(last) h += '<div class="cup-last">' + last + '</div>';
  if(resHtml) h += '<div class="cup-results">' + resHtml + '</div>';
  if(next) h += '<div class="cup-next">Next: ' + cupTeamHtml(Cs.teams[0]) + ' <b>vs</b> ' + cupTeamHtml(Cs.teams[opp]) + '</div>';
  else if(!Cs.done) h += '<div class="cup-next">' + Cs.alive.map(i => cupTeamHtml(Cs.teams[i])).join(' · ') + '</div>';
  h += '<div class="save-note" id="save-note"></div><div class="res-btns" id="res-btns"><button class="sp-btn sp-secondary" id="res-levels" data-sound="tap">🎚️ Levels</button>'
    + (Cs.done ? '<button class="sp-btn sp-primary" id="cup-new" data-sound="pop">🔁 New cup</button>' : '<button class="sp-btn sp-primary" id="cup-play" data-sound="pop">▶ Play the ' + cupRoundName(Cs).toLowerCase() + '</button>') + '</div><div class="comics-slot" id="comic-strip-slot"></div>';
  showResult(h);
  $('res-levels').onclick = () => { hideResult(); leavePlay(); };
  if($('cup-play')) $('cup-play').onclick = () => { hideResult(); SET.mode = Cs.sport; SET.cfg = cupMeTeamCfg(Cs, opp); Cs.opp = opp; startMatch(); };
  if($('cup-new')) $('cup-new').onclick = () => { const lv = Cs.level; hideResult(); leavePlay(); openSetup(lv); };
  if(champ && FX) confetti(['🏆', '🔥', '⭐', '🎉', '👑'], 34);
}
function finishCupMatch(){
  if(G && G.M) PD.ctlHome(G.M);   /* 🎮 pd-8a */
  stopLoop(); const M = G.M, Cs = SET.cupState, me = G.locals[0], won = M.winner === me.team, opp = Cs.opp;
  $('hand').classList.add('hidden'); $('goal-line').classList.add('off'); NOTES.length = 0;
  // feats for every person of this match (kills, saves, spirits …); the cup itself is saved when it ends
  const nh = PD.noHands(M), st = p => ({games: 1, wins: M.winner === p.team ? 1 : 0, hoops: p.st.hoops || 0, edges: p.st.edges || 0, spirits: p.st.spirits || 0, duos: p.st.duos || 0, trios: p.st.trios || 0, aces: p.st.aces, kills: p.st.kills, assists: p.st.assists, digs: p.st.digs + p.st.dives, dives: p.st.dives, blocks: p.st.blocks, stuffs: p.st.stuffs,
    traps: (p.st.traps || 0) + (nh && !PD.isSpark(M) ? p.st.bumps : 0), pops: p.st.pops || 0, feeds: p.st.feeds || 0, beasts: window.SpiritBestiary ? SpiritBestiary.count(p.name) : 0, sets: p.st.sets, bumps: nh ? 0 : p.st.bumps, pyras: p.st.pyras, rally: M.rallyMax});
  G.locals.forEach((p, i) => { if(p.name !== 'Guest') saveFeatsOnly(p.name, st(p), i); });
  const mine = {a: 0, b: opp, w: won ? 0 : opp, score: [M.teams[0].score, M.teams[1].score]}, roundOf = Cs.alive.length;
  Cs.results.push(mine);
  cupPairs(Cs).forEach(pr => { if(pr[0] === 0 || pr[1] === 0) return; Cs.results.push(cupSimulate(Cs, pr[0], pr[1])); });
  const winners = cupPairs(Cs).map(pr => { const r = Cs.results.slice().reverse().find(x => (x.a === pr[0] && x.b === pr[1]) || (x.a === pr[1] && x.b === pr[0])); return r.w; });
  Cs.teams.forEach((t, i) => { if(Cs.alive.includes(i) && !winners.includes(i)) t.out = true; });
  Cs.alive = winners;
  const last = (won ? '🎉 You beat ' : '😅 ' + UI.esc(Cs.teams[opp].name) + ' beat you ') + (won ? Cs.teams[opp].icon + ' ' + UI.esc(Cs.teams[opp].name) + ' ' : '') + mine.score.join(' – ');
  if(!won || Cs.alive.length === 1){
    Cs.done = true; Cs.place = won ? 'champion' : roundOf === 2 ? 'final' : roundOf === 4 ? 'semi' : 'quarter';
    const C = CUPS[Cs.k], champ = Cs.place === 'champion', stars = champ ? 3 : Cs.place === 'final' ? 2 : Cs.place === 'semi' ? 1 : 0;
    if(champ) cheerChamp(); /* 📣 cs-pd */
    const pts = Math.round((champ ? 3000 : Cs.place === 'final' ? 1800 : Cs.place === 'semi' ? 900 : 300) * (C.n === 8 ? 1.5 : 1) * (1 + Cs.level * 0.25) * (LEVEL_UI[Cs.level].hardcore ? 3 : 1));
    showCupCard(last);
    G.locals.forEach((p, i) => { if(p.name === 'Guest') return;
      saveWin(p.name, Cs.level, {score: pts, stars, cleared: champ, cup: Cs.place, timeSec: Math.round((Date.now() - G.t0) / 1000), theme: C.icon + ' ' + C.name + ' · ' + PD.MODES[Cs.sport].icon + ' ' + PD.MODES[Cs.sport].name,
        stats: {games: 0, cups: champ ? 1 : 0, familyCups: champ && C.family ? 1 : 0, ['m_' + C.k]: 1}}, i + 2); });
  } else showCupCard(last);
  G.resultShown = true;
}
function paintPodium(cv, M){
  if(!cv) return; const g = cv.getContext('2d'), w = M.winner, ppl = M.players.filter(p => p.team === w).slice(0, 3), k = 1.25;
  g.fillStyle = w === 0 ? '#FFE3C4' : '#D6E6FF'; rr(g, 0, 0, cv.width, cv.height, 22); g.fill();
  ppl.forEach((p, i) => { const x = cv.width * (ppl.length === 1 ? 0.5 : 0.2 + 0.6 * i / (ppl.length - 1)), y = cv.height - 22;
    drawAvatar(g, {name: p.name, av: p.av || defaultAvatar(p.name), dir: 1, walkT: 0, gest: {g: GESTURES.find(x2 => x2.k === 'cheer') || GESTURES[0], t: 0.4 + i * 0.2}}, x, y, k * 1.6, {t: 1 + i, noPet: true});
    g.font = '800 18px Nunito, sans-serif'; g.textAlign = 'center'; g.fillStyle = '#2A1A10'; g.fillText(p.name.slice(0, 10), x, cv.height - 4); });
  emo(g, '🏆', cv.width - 34, 34, 40);
}
GameParts.loaded('PyraDive_cups', 'pd-s');
