
/* 📏 s-bo tale#1 */
const TALE = [
  {id: 'jungle', icon: '🦖', name: 'Jungle Street', theme: 'jungle', coach: ['🦜', 'Kiki the parrot'], reward: ['🌿', 'Vine kit'], about: 'No ball, no team — just a coconut and a dino.',
    steps: [{kind: 'skills', drill: 'juggle', coconut: true, need: 1, title: 'Coconut keepy-ups', line: 'No ball in the jungle… but this coconut bounces! Keep it up — kick it before it lands.'},
      {kind: 'street', size: 1, coconut: true, opp: 'Rex the dino', title: 'Street 1v1 vs Rex', line: 'Rex the dino guards the clearing. Beat him in the vine cage and he joins your team!'},
      {kind: 'match', size: 4, coconut: true, opp: 'Banana Bandits', title: 'Your first team', line: 'You, Rex and two jungle friends — your very first team! The Banana Bandits want the clearing.'}]},
  {id: 'school', icon: '🐙', name: 'School Team', theme: 'underwater', coach: ['🐙', 'Coach Octo'], reward: ['🐙', 'Octo kit'], about: 'The school team under the sea learns to pass.',
    steps: [{kind: 'skills', drill: 'target', need: 1, title: 'Shooting class', line: 'Eight arms, eight targets! Hit the corners — a keeper can\'t reach those.'},
      {kind: 'skills', drill: 'long', need: 1, title: 'Passing class', line: 'A good pass finds a friend who is RUNNING. Pass in front of them!'},
      {kind: 'match', size: 7, opp: 'Coral Crabs', title: 'School match 7v7', line: 'Match day against the Coral Crabs! Pass, pass, then shoot.'}]},
  {id: 'city', icon: '🪩', name: 'City Tricks', theme: 'neon', coach: ['🎧', 'DJ Spin'], reward: ['🪩', 'Disco kit'], about: 'Tricks on the beat under the city lights.',
    steps: [{kind: 'skills', drill: 'cones', need: 1, title: 'Neon dribble', line: 'Weave through the neon cones — fast feet, ball close!'},
      {kind: 'battle', opp: 'The City Crew', title: 'Tricks Battle', line: 'The City Crew says nobody out-tricks them. Show them on the beat — two thumbs, big combos!'},
      {kind: 'match', size: 5, opp: 'Rooftop Rockets', title: 'Rooftop futsal', line: 'A futsal game on the rooftop court. Heavy ball, quick passes!'}]},
  {id: 'robot', icon: '🤖', name: 'Robot Training', theme: 'robot', coach: ['🤖', 'Coach Bolt'], reward: ['⚙️', 'Robo kit'], about: 'Train against robot defenders that never get tired.',
    steps: [{kind: 'skills', drill: 'fk', need: 1, title: 'Bend it round the wall', line: 'Robot walls! Bend it round or lift it over — the keeper is a robot too.'},
      {kind: 'skills', drill: 'bar', need: 1, title: 'Crossbar challenge', line: 'Precision test: hit the crossbar. Clank = beep-boop happy robots.'},
      {kind: 'match', size: 7, opp: 'Robo Defenders', title: 'vs the Robo Defenders', line: 'The Robo Defenders block everything. Trick past them and pass round them!'}]},
  {id: 'moon', icon: '🪐', name: 'Moon Away Game', theme: 'moon', coach: ['👩‍🚀', 'Captain Luna'], reward: ['🚀', 'Astro kit'], about: 'Low gravity: the ball floats, headers fly!',
    steps: [{kind: 'skills', drill: 'volley', need: 1, title: 'Floaty volleys', line: 'On the moon the crosses float. Wait for it… and volley!'},
      {kind: 'match', size: 7, twist: true, opp: 'Lunar Leapers', title: 'Low-gravity match', line: 'Away game on the moon! The ball floats and bounces high — jump for headers.'},
      {kind: 'shootout', opp: 'Lunar Leapers', title: 'Moon penalties', line: 'It went to penalties! Aim with the 🎯 — and dive for theirs.'}]},
  {id: 'cloud', icon: '☁️', name: 'Cloud Final', theme: 'olympus', coach: ['🦅', 'Sky Eagle'], reward: ['🏆', 'Champion kit'], about: 'The final, high in the cloud stadium.',
    steps: [{kind: 'skills', drill: 'target', need: 2, title: 'Warm-up in the clouds', line: 'Big crowd up here! Two stars on the targets to calm the nerves.'},
      {kind: 'match', size: 11, opp: 'Thunder Titans', title: 'The Cloud Final', line: 'The Thunder Titans, 11 a side, in the cloud stadium. Everyone you met is cheering. This is it!'}]}
];
/* 📏 s-bo tale#2 */
function taleSave(d){ ls(taleKey(), JSON.stringify(d)); }
const stepId = (ci, si) => TALE[ci].id + ':' + si;
function chDone(d, ci){ return TALE[ci].steps.every((_, si) => d.done[stepId(ci, si)]); }
function chOpen(d, ci){ return ci === 0 || chDone(d, ci - 1); }
function nextStep(d, ci){ return TALE[ci].steps.findIndex((_, si) => !d.done[stepId(ci, si)]); }
function stepIcon(st){ return st.kind === 'skills' ? (BO.DRILLS[st.drill].name.split(' ')[0]) : st.kind === 'battle' ? '🎤' : st.kind === 'shootout' ? '🥅' : st.kind === 'street' ? '🏙️' : SZ_LOGO[st.size] || '⚽'; }
/* 📏 s-bo tale#3 */
function taleStory(ci, si){   // the coach's line before a step (the 👆 goal is in it), then ▶ Let's go
  const ch = TALE[ci], st = ch.steps[si], box = $('tale-story');
  box.innerHTML = '<div class="tale-card"><div class="tale-coach">' + ch.coach[0] + '</div><div class="tale-bub"><b>' + UI.esc(ch.coach[1]) + '</b><p>' + UI.esc(st.line) + '</p><small>' + stepIcon(st) + ' ' + UI.esc(st.title) + (st.kind === 'skills' ? ' · goal: ' + '⭐'.repeat(st.need || 1) : ' · goal: win') + '</small></div>' +
    '<div class="go-row"><button class="btn soft sp-btn sp-secondary" data-sound="tap" id="tale-x">Not now</button><button class="btn sp-btn sp-primary sp-lg" data-sound="pop" id="tale-go">▶ Let\'s go!</button></div></div>';
  box.classList.remove('hidden'); $('tale-x').onclick = () => box.classList.add('hidden'); $('tale-go').onclick = () => taleStart(ci, si);
}
function taleStart(ci, si){
  const ch = TALE[ci], st = ch.steps[si];
  SET.theme = ch.theme; SET.who = 'robot';
  if(st.kind === 'skills'){ SET.kind = 'skills'; SET.drill = st.drill; }
  else if(st.kind === 'battle' || st.kind === 'shootout'){ SET.kind = st.kind; SET.size = 4; }
  else { SET.kind = 'match'; SET.size = st.size || 4; }
  fixForm(); TALERUN = {ch, st, ci, si, armed: true}; startMatch();
}
function taleAfter(ok, stars){
  const T = G.tale, d = taleLoad(), id = stepId(T.ci, T.si), first = ok && !d.done[id]; let chNow = false;
  if(ok){ d.done[id] = true; if(chDone(d, T.ci) && d.kits.indexOf(T.ch.id) < 0){ d.kits.push(T.ch.id); chNow = true; } taleSave(d);
    if(first && S.player !== 'Guest') saveFeatsOnly(S.player, {taleSteps: Object.keys(d.done).length, taleChapters: TALE.filter((_, ci) => chDone(d, ci)).length}, 3); }   // 📜 R4c: badges + the 📜 Kick Tale Hero title
  G.taleBack = {ch: T.ci, reward: chNow};
  if(ok) GameComic._feed([{k: 'talestep', chapter: T.ch.id, n: T.ci + 1, step: T.st.title, chapterDone: chNow, all: chNow && T.ci === 5}]);   // 💥 📣 R4d
  const rb = document.querySelector('#result-card .res-btns');
  if(rb) rb.innerHTML = '<button class="btn soft sp-btn sp-secondary" data-sound="tap" onclick="taleRetry()">🔁 Try again</button><button class="btn sp-btn sp-primary" id="btn-tale" data-sound="pop" onclick="taleBack()">📜 Back to the story</button>';
  const rc = $('result-card'); if(rc){ const n = document.createElement('div'); n.className = 'tale-note' + (ok ? ' ok' : ''); n.innerHTML = ok ? (chNow ? '🎉 Chapter ' + (T.ci + 1) + ' done! ' + T.ch.reward[0] + ' <b>' + T.ch.reward[1] + '</b> unlocked (👕 pick it on the setup page)' + (T.ci < 5 ? ' · 📜 chapter ' + (T.ci + 2) + ' is open!' : ' · 🏆 you finished Kick Tale!') : first ? '✅ Story step done!' : '✅ Done again!') : T.ch.coach[0] + ' ' + (T.st.kind === 'skills' ? 'You need ' + '⭐'.repeat(T.st.need || 1) + ' — try again!' : 'So close — try again, you can do it!'); rc.insertBefore(n, rc.querySelector('.res-btns')); }
}
function taleBack(){ const f = G && G.taleBack; if(G) cancelAnimationFrame(G.raf); G = null; V = null; SET.kind = 'tale'; showTale(f); }
function taleRetry(){ const T = G && G.tale; if(!T) return; if(G) cancelAnimationFrame(G.raf); G = null; V = null; hideResult(); taleStart(T.ci, T.si); }
GameParts.loaded('BlasOff_tale', 's-bo');
