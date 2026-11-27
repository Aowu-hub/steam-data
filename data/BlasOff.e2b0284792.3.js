
const WEBAPP_URL = SP_TV[0];
const CURRENT_PLAYER = SP_TV[1]; window.SP_PAGE = SP_TV[2];
const MODE_LINK = SP_TV[3];   // ✨ ?mode=fours | sevens (Code.gs MODES_) — opened once, after the player pick
UI.applyTheme(UI.cachedTheme(CURRENT_PLAYER), {kitOnly: true});
const SESSION_START = Number(SP_TV[4]) || null;
const DURATION_MIN = Number(SP_TV[5]) || null;
const GAME_ID = 'blasoff';
/* bo-1: the UiKit lane belongs to ✨ p6 — this game registers its own loader kind + ❓ help card at runtime (a 2-line UiKit anchor is asked for under Open questions) */
if(UI.KINDS && !UI.KINDS.blasoff) UI.KINDS.blasoff = ['⚽', 'Blasting onto the pitch', 'launch'];
if(UI.GAME_HELP && !UI.GAME_HELP.blasoff) UI.GAME_HELP.blasoff = ['Soccer with your avatar — score more goals than the other team!', 'Run with W A S D or the 🕹️ stick. J pass · K shoot · L trick · Space jump (twice = flick it up, then K = volley!).', 'When they shoot at your goal, shout Q or E — your robot keeper dives that way.'];
const BAR = UI.gameBar(document.getElementById('gbar'), {game: GAME_ID, icon: '⚽', name: 'BlasOff', levelId: 'hud-level', scoreMin: '4ch',
  levels: () => leavePlay(), playing: () => !!(G && !G.over), onLeave: () => { try{ speechSynthesis.cancel(); }catch(e){} },
  pause: {pause: () => pauseGame(), resume: () => { if(G && G.paused && !G.over) togglePause(); }},
  onFit: () => { if(G){ resize(); buildPads(); } },
  extras: [{id: 'view-btn', icon: '📷', label: 'Camera: behind · side · above (V)', onClick: () => cycleView(), keep: true}, {id: 'zoom-btn', icon: '🔍', label: 'Zoom in / out (Z)', onClick: () => toggleZoom(), keep: true}, {id: 'pause-btn', html: '<span class="gb-pzi" aria-hidden="true"><i></i><i></i></span>', label: 'Pause (P)', onClick: () => togglePause(), keep: true}]});
var NAV_INNER = {setup: ['◀ BlasOff', () => showScreen('menu')], cup: ['◀ BlasOff', () => backToMenu()], tale: ['◀ BlasOff', () => backToMenu()]};   // 🏆 R4a: the cup screen goes back to the start page too   // 🧭 the setup screen's top button goes back to the BlasOff start page
UI.navBar(document.getElementById('back-btn'), {onclick: false});
const $ = id => document.getElementById(id);
let FX = 1;   // harness sets 0 (no big words / confetti / voice)
function fmt(s){ s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
function say(text){ try{ if(!FX || !UISound.get().enabled || !window.speechSynthesis) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = 1.05; u.pitch = 1.1; speechSynthesis.speak(u); }catch(e){} }
function pickOne(a){ return a[Math.floor(Math.random() * a.length)]; }
function lim(v, a, b){ return v < a ? a : v > b ? b : v; }

/* ================= DATA ================= */
const LEVEL_UI = [
  {emoji: '🌱', blurb: 'Slow robots + big aim help. The next pass glows, an arrow shows the goal.'},
  {emoji: '🐣', blurb: 'Robots pass and run. Try a trick with L!'},
  {emoji: '🔥', blurb: 'Robots mark + tackle. Slide tackles and fouls are on.'},
  {emoji: '⚡', blurb: 'Offside, stamina, a penalty shootout if it ends level.'},
  {emoji: '🌋', blurb: 'Smart robots, yellow cards — and no aim help.'},
  {emoji: '💀', blurb: 'The strongest robots. 4 goals behind = game over · ×3 points.', hardcore: true}
];
const AGE_START = {'4-5': 0, '6-7': 0, '8-9': 1, '10+': 2};
const TEAM_COL = ['#2F80ED', '#E5484D'], TEAM_KIT = [5, 0], KEEPER_KIT = [2, 3], SEAT_COL = ['#FFD23F', '#FF6FD8'];
const ROBO_TEAMS = ['Robo Rookies', 'Robo Runners', 'Robo Rovers', 'Robo Rockets', 'Robo Titans', 'Robo Legends'];
const ROBO_NAMES = ['Bolt', 'Gizmo', 'Sprocket', 'Beep', 'Widget', 'Rusty', 'Nova', 'Chip', 'Pixel', 'Zap', 'Cog', 'Dot', 'Echo', 'Flux'];
// 🏟️ Classic first, then the 6 house looks (look only in R1 — the pitch twists come in R3)
const LOOKS = {
  classic: {name: 'Classic stadium', icon: '🏟️', court: ['#2F6FD6', '#2A64C2'], courtOut: '#E8813A', cage: ['#4A4F5C', '#444955'], fence: '#B9C2D0', sky: ['#5AA9FF', '#CFE8FF'], skyN: ['#050B24', '#1A2E66'], grass: ['#36B05A', '#2E9E50'], out: '#2B8A47', line: '#FFFFFF', stand: '#2B3A67', crowd: ['#FF5A1F', '#FFD23F', '#FFFFFF', '#3D7BFF', '#E5484D', '#2DBE6C'], boards: ['#FF5A1F', '#3D7BFF', '#13254A'], lamps: true, deco: []},
  jungle: {name: 'Jungle', icon: '🦖', court: ['#B07A45', '#A36F3D'], courtOut: '#6B4E2E', cage: ['#6B8E3A', '#628534'], fence: '#8D6E63', sky: ['#7BD389', '#E7F7C9'], grass: ['#5BAA3A', '#4E9A31'], out: '#6B4E2E', line: '#FFF8D6', stand: '#5C3D1E', crowd: ['#8BC34A', '#FFB300', '#6D4C41'], boards: ['#2E7D32', '#8D6E63', '#33691E'], deco: [['🌋', 0, 70, 18, 22], ['🌴', -40, 30, 4, 10], ['🌴', 45, 30, 4, 10], ['🦕', 18, 40, 3, 6]], crowdEmo: ['🦖', '🦕']},
  underwater: {name: 'Underwater', icon: '🐙', court: ['#1C8FB0', '#1882A0'], courtOut: '#0E6E8C', cage: ['#D9C089', '#CEB57E'], fence: '#7CF7FF', sky: ['#0A4C8C', '#3FA9D9'], grass: ['#1FA79A', '#178F84'], out: '#E6C98F', line: '#E9FFFB', stand: '#0E6E8C', crowd: ['#FF7EB6', '#FFD23F', '#7CF7FF'], boards: ['#FF6B6B', '#1FA79A', '#0E4C7A'], deco: [['🪸', -30, 34, 1, 5], ['🪸', 30, 34, 1, 5], ['🐠', 0, 60, 10, 5], ['🐙', -16, 55, 6, 7]], tint: 'rgba(30,120,200,0.10)', bubbles: true},
  neon: {name: 'Neon arena', icon: '🪩', court: ['#1A0B33', '#220E42'], courtOut: '#0A0418', cage: ['#0E0820', '#150B2E'], fence: '#FF2EC4', sky: ['#120326', '#3A0B5C'], grass: ['#160B2E', '#1F1040'], out: '#0A0418', line: '#3DF2FF', stand: '#24104A', crowd: ['#FF2EC4', '#3DF2FF', '#FFE83D', '#8CFF3D'], boards: ['#FF2EC4', '#3DF2FF', '#7A2EFF'], deco: [['🪩', 0, 40, 16, 7]], glow: true},
  robot: {name: 'Robot stadium', icon: '🤖', court: ['#5E6B7E', '#566275'], courtOut: '#3A4458', cage: ['#3A4252', '#343B4A'], fence: '#5CC8FF', sky: ['#7D8BA1', '#D7DEE8'], grass: ['#8996A8', '#7A879A'], out: '#4B5568', line: '#FFE45C', stand: '#3A4458', crowd: ['#BFC8D6', '#5CC8FF', '#FFE45C'], boards: ['#5CC8FF', '#FFE45C', '#3A4458'], deco: [['🛸', -20, 30, 12, 5], ['🛸', 25, 36, 14, 5]], drones: true},
  moon: {name: 'Moon crater', icon: '🪐', court: ['#8C8DA0', '#838497'], courtOut: '#4A4B57', cage: ['#6E6F7C', '#666774'], fence: '#D7D9E6', sky: ['#020412', '#1B1F3A'], grass: ['#A9AAB5', '#9B9CA8'], out: '#6E6F7C', line: '#FFFFFF', stand: '#4A4B57', crowd: ['#D7D9E6', '#8E93B8', '#FFFFFF'], boards: ['#3D7BFF', '#9B9CA8', '#1B1F3A'], deco: [['🌍', 30, 90, 30, 14], ['🚀', -40, 60, 18, 6]], stars: true, craters: true},
  olympus: {name: 'Olympus clouds', icon: '☁️', court: ['#F1E6C8', '#E8DCBB'], courtOut: '#C9A227', cage: ['#DCD3BE', '#D2C8B2'], fence: '#FFD23F', sky: ['#8EC9FF', '#FFF6DE'], grass: ['#7FD08A', '#6FC27B'], out: '#FFFFFF', line: '#FFD23F', stand: '#F2EEE3', crowd: ['#FFD23F', '#FFFFFF', '#9FD3FF'], boards: ['#FFD23F', '#FFFFFF', '#C9A227'], deco: [['🏛️', 0, 52, 2, 9], ['☁️', -30, 45, 14, 9], ['☁️', 34, 50, 18, 9], ['⚡', 12, 70, 22, 5]], clouds: true}
};
const LOOK_KEYS = Object.keys(LOOKS);
const ADS = ['SlaBrall', 'Turbo Trail', 'Snakize', 'Pinball', 'BeatCorner', 'WisDeck', 'Soul Bopper', 'GeoScout', 'Brawl Buddies', 'Artifactory'];
const ACTIONS = [['up', '⬆️ Up'], ['down', '⬇️ Down'], ['left', '⬅️ Left'], ['right', '➡️ Right'], ['pass', '⚽ Pass / tackle'], ['thru', '🏃 Pass ahead (hold = over the top)'], ['shoot', '💥 Shoot / slide'], ['trick', '🌀 Trick / call'], ['jump', '🦘 Jump (2× = flick up)'], ['sprint', '💨 Sprint'], ['sw', '🔄 Switch player'], ['shoutL', '📣 Shout ⬅️'], ['shoutR', '📣 Shout ➡️']];
const DEFAULT_KEYS = [
  {up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', pass: 'KeyJ', thru: 'KeyU', shoot: 'KeyK', trick: 'KeyL', jump: 'Space', sprint: 'ShiftLeft', sw: 'KeyC', shoutL: 'KeyQ', shoutR: 'KeyE'},
  {up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', pass: 'Numpad1', thru: 'Numpad5', shoot: 'Numpad2', trick: 'Numpad3', jump: 'Numpad0', sprint: 'ShiftRight', sw: 'NumpadEnter', shoutL: 'Numpad4', shoutR: 'Numpad6'}
];
const LOGIC = {pass: 'J', thru: 'T', shoot: 'K', trick: 'L', jump: 'SP'};   /* 🏃 bo-pass: T = pass ahead */

/* 🗂️ MODE GROUPS (mg-1) + 🃏 mode cards (R1 = ⚽ Soccer 4v4 + 7v7; the 🔜 box shows what the next rounds add) */
const MODE_GROUPS = [
  {k: 'match', icon: '⚽', en: 'Matches', th: 'แข่งฟุตบอล', c: '#2DBE6C'},
  {k: 'small', icon: '🏙️', en: 'Futsal + Street', th: 'ฟุตซอล · สตรีท', c: '#FF8A1F'},
  {k: 'skill', icon: '🕺', en: 'Tricks + skills', th: 'ลีลา · ทักษะ', c: '#1FA9D6'},
  {k: 'cup', icon: '🏆', en: 'Cups + story', th: 'ถ้วย · เนื้อเรื่อง', c: '#7A5CFA'}
];
const MODES = [
  {k: 'fours', g: 'match', icon: '⚽', name: 'Soccer 4v4', type: 'A small-pitch soccer game', sub: '4 + a robot keeper a side · close camera', next: '👇 then pick a level'},
  {k: 'sevens', g: 'match', icon: '🏟️', name: 'Soccer 7v7', type: 'A bigger soccer match', sub: '7 a side · bigger pitch, more passing', next: '👇 then pick a level'},
  {k: 'elevens', g: 'match', icon: '🌍', name: 'Soccer 11v11', type: 'A full-size soccer match', sub: '11 a side · wide camera, 🔍 zoom, radar', next: '👇 then pick a level'},
  {k: 'party', g: 'match', icon: '🎉', name: 'Party ball', type: 'A match with a wild ball', sub: 'Crazy-bouncy bomb ball · goals pop into confetti', next: '👇 then pick a level'},
  {k: 'futsal', g: 'small', icon: '🥅', name: 'Futsal 5v5', type: 'Fast soccer on a court', sub: '5 a side · heavy ball, kick-ins, no offside', next: '👇 then pick a level'},
  {k: 'street', g: 'small', icon: '🏙️', name: 'Street 1v1', type: 'You vs one in a cage', sub: '🥜 nutmeg = a point · first to 5', next: '👇 then pick a level'},
  {k: 'battle', g: 'skill', icon: '🎤', name: 'Tricks Battle', type: 'Best of 3 · on the beat', sub: 'Tricks on the beat · 3 judges hold up cards', next: '👇 then pick a level'},
  {k: 'skills', g: 'skill', icon: '🎯', name: 'Skill challenges', type: '7 drills · ⭐⭐⭐ each', sub: 'Targets, crossbar, cones, keepy-ups, free kicks…', next: '👇 then pick a level'},
  {k: 'shootout', g: 'skill', icon: '🥅', name: 'Penalty shootout', type: '5 kicks each', sub: 'Kick on the 🎯 · dive in goal on theirs', next: '👇 then pick a level'},
  {k: 'cup', g: 'cup', icon: '🏆', name: 'Knockout Cup', type: '8 teams · win or go home', sub: 'Quarter-final → semi → final · draws go to 🥅 pens', next: '👇 then pick a level'},
  {k: 'league', g: 'cup', icon: '📊', name: 'League', type: '4 teams · a table', sub: 'Play everyone once · win 3 pts, draw 1 · top wins', next: '👇 then pick a level'},
  {k: 'family', g: 'cup', icon: '👑', name: 'Family cup', type: 'Family captains', sub: 'Each family member captains a team · you play yours', next: '👇 then pick a level'},
  {k: 'tale', g: 'cup', icon: '📜', name: 'Kick Tale', type: 'A story in 6 chapters', sub: 'From the 🦖 jungle to the ☁️ cloud stadium', next: '👇 then pick a level'}   // 📜 R4b
];
window.MODE_TYPE = {tale: 'A story in 6 chapters', cup: '8 teams · win or go home', league: '4 teams · a table', family: 'Family captains', party: 'A match with a wild ball', battle: 'Best of 3 · on the beat', skills: '7 drills · ⭐⭐⭐ each', shootout: '5 kicks each', fours: 'A small-pitch soccer game', sevens: 'A bigger soccer match', elevens: 'A full-size soccer match', futsal: 'Fast soccer on a court', street: 'You vs one in a cage'};
const SZ_ID = {4: 'fours', 7: 'sevens', 11: 'elevens', 5: 'futsal', 1: 'street'}, ID_SZ = {fours: 4, sevens: 7, elevens: 11, futsal: 5, street: 1};
const SZ_NAME = {4: '4v4', 7: '7v7', 11: '11v11', 5: 'Futsal 5v5', 1: 'Street 1v1'}, SZ_LOGO = {4: '⚽', 7: '🏟️', 11: '🌍', 5: '🥅', 1: '🏙️'};

/* ================= STATE ================= */
let S = {players: [], progress: {}, settings: {}, avatars: {}, ballSkins: {}, player: '', age: ''};
let SET = {twist: true, kind: 'match', drill: 'target', size: 4, level: 0, who: 'robot', opp: '', mate: '', theme: 'classic', night: false, view: 'auto', form: '121', ball: -1};
let G = null, lockHandle = null, KEYS = null, V = null;
function ls(k, v){ try{ if(v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(e){ return null; } }
function store(k){ return 'sp_blasoff_' + k + ':' + (S.player || ''); }
function loadPrefs(){ try{ const p = JSON.parse(ls(store('prefs')) || 'null'); if(p) Object.assign(SET, {kit: p.kit || 'classic', kind: ['match', 'skills', 'shootout', 'battle', 'party', 'cup', 'league', 'family', 'tale'].includes(p.kind) ? p.kind : 'match', twist: p.twist !== false, drill: BO.DRILLS[p.drill] ? p.drill : 'target', size: BO.SIZES[p.size] ? +p.size : 4, theme: LOOKS[p.theme] ? p.theme : 'classic', night: !!p.night, view: p.view || 'auto', form: p.form || '121', who: p.who || 'robot'}); }catch(e){} SET.ball = sharedBall(); fixForm(); }
function savePrefs(){ ls(store('prefs'), JSON.stringify({kit: SET.kit, twist: SET.twist, kind: SET.kind, drill: SET.drill, size: SET.size, theme: SET.theme, night: SET.night, view: SET.view, form: SET.form, who: SET.who})); }
function fixForm(){ const Sz = BO.SIZES[SET.size]; if(!Sz.forms[SET.form]) SET.form = Sz.formOrder[0]; }
function ownedBalls(name){ return Math.min(BallSkins.count, Number((S.ballSkins || {})[name || S.player]) || 0); }
function sharedBall(){ const raw = ls('sp_ball:' + S.player); if(raw == null || raw === '') return -1; const v = Number(raw); return Number.isFinite(v) && v >= 0 && v < ownedBalls() ? v : -1; }
function myAvatar(name){ const a = S.avatars[name]; return a ? fixAv(a) : defaultAvatar(name || 'player'); }
function showScreen(name){
  ['player', 'menu', 'setup', 'play', 'cup', 'tale'].forEach(s => $('scr-' + s).classList.toggle('hidden', s !== name));
  $('back-btn').classList.toggle('hidden', name === 'play'); UI.navScreen($('back-btn'), name, NAV_INNER); window.scrollTo(0, 0);
  if(name !== 'play') try{ paintLogos(); }catch(e){}   // 🏷️ bo-6
}
function progressOf(name){ return S.progress[name] || {unlocked: 0, tokens: [], best: []}; }
function canPlay(i){ const p = progressOf(S.player); if(i === 5) return p.unlocked >= 5; if(i === 4) return p.unlocked >= 4; return i <= Math.max(p.unlocked, AGE_START[S.age] || 0); }

/* ================= PLAYER PICK + START PAGE ================= */
function renderPlayers(){
  const box = $('player-list'); box.innerHTML = '';
  if(!S.players.length){ box.innerHTML = '<div class="empty">No players yet — add one on the Dashboard first.</div>'; return; }
  S.players.forEach(p => { const b = document.createElement('button'); b.className = 'pick'; b.setAttribute('data-sound', 'pop');
    const c = document.createElement('canvas'); c.width = 144; c.height = 168; b.appendChild(c);
    b.insertAdjacentHTML('beforeend', '<div class="nm">' + UI.esc(p.Name) + '</div><div class="sub">' + UI.esc(p.Age ? p.Age + ' yrs' : '') + '</div>');
    drawPreviewCanvas(c, myAvatar(p.Name), {name: p.Name, t: 1});
    b.onclick = () => choosePlayer(p.Name); box.appendChild(b); });
}
function choosePlayer(name){
  UI.rememberTheme(name, UI.applyTheme(UI.themeFor(S.settings, name), {kitOnly: true}));
  const p = S.players.find(x => x.Name === name); S.player = name; S.age = p ? p.Age : '';
  loadPrefs(); KEYS = loadKeys(); $('who-name').textContent = name; renderMenu(); showScreen('menu');
}
function changePlayer(){ renderPlayers(); showScreen('player'); }
function bestHtml(p, i){ const b = (p.best || [])[i]; if(!b || !b.score) return '<div class="best none">No win yet</div>'; return '<div class="best"><span>🏆 ' + Number(b.score).toLocaleString() + '</span><span>' + '⭐'.repeat(b.stars || 0) + '</span></div>'; }
/* 🏷️ bo-6: logos + badges drawn by BlasLogo in the picked pitch look (emoji stay if a canvas fails) */
const LOGO_URL = {}, BADGE_OF = {fours: 'match', sevens: 'match', elevens: 'match', party: 'match', futsal: 'futsal', street: 'street', battle: 'trick', skills: 'trick', shootout: 'trick', cup: 'cup', league: 'cup', family: 'cup', tale: 'cup'}, GROUP_BADGE = {match: 'match', small: 'futsal', skill: 'trick', cup: 'cup'};
function logoUrl(kind, px){ const dpr = Math.min(2, window.devicePixelRatio || 1), w = Math.round(px * dpr), k = kind + ':' + SET.theme + ':' + w; if(LOGO_URL[k]) return LOGO_URL[k]; try{ return (LOGO_URL[k] = BlasLogo.url(kind, SET.theme, w, px)); }catch(e){ return ''; } }
function logoImg(kind, px, cls, alt){ const u = logoUrl(kind, px); return u ? '<img class="' + cls + '" src="' + u + '" width="' + px + '" alt="' + alt + '" draggable="false">' : ''; }
function paintLogos(){
  const big = phoneLand() ? 170 : innerWidth < 640 ? 118 : 240;   /* 📜 R4b: a bit smaller so all 4 mode boxes stay on the first screen */   // phones held upright: small logo so every mode box stays on the first screen
  document.querySelectorAll('#scr-player .title, #scr-menu .title').forEach(t => { const lg = t.querySelector('.logo'), h = logoImg('main', big, 'bo-mainlogo', 'BlasOff'); if(!lg || !h) return; lg.innerHTML = h; t.classList.add('has-logo'); });
  document.querySelectorAll('#mode-list .ui-mgroup').forEach(gr => { const hd = gr.querySelector('.ui-mg-h'), G = MODE_GROUPS.find(x => x.k === gr.dataset.g), bk = G && GROUP_BADGE[G.k]; if(!hd || !bk) return;
    const h = logoImg(bk, phoneLand() || innerWidth < 640 ? 24 : 28, 'bo-gbadge', ''); if(!h) return; const old = hd.querySelector('.bo-gbadge'); if(old) old.remove(); else if(hd.firstChild && hd.firstChild.nodeType === 3) hd.firstChild.textContent = hd.firstChild.textContent.replace(G.icon + ' ', ''); hd.insertAdjacentHTML('afterbegin', h); });
  document.querySelectorAll('#mode-list .ui-mbtn[data-k="futsal"] .mi, #mode-list .ui-mbtn[data-k="street"] .mi').forEach(mi => { const h = logoImg(mi.closest('.ui-mbtn').dataset.k, phoneLand() || innerWidth < 640 ? 30 : 34, 'bo-mbadge', ''); if(h) mi.innerHTML = h; });
  const sl = $('setup-logo'), bk = BADGE_OF[modeId()]; if(sl && bk && !$('scr-setup').classList.contains('hidden')){ const h = logoImg(bk, phoneLand() ? 52 : 74, 'bo-sbadge', ''); if(h) sl.innerHTML = h; }
}
function renderMenu(){
  const box = $('mode-list');
  if(!box.children.length){
    UI.modeGroups(box, MODE_GROUPS, MODES.map(m => Object.assign({}, m)), {next: () => $('lvl-head'), moreText: '👇 Pick a level below',
      onPick: k => { const m = MODES.find(x => x.k === k); if(m && m.soon){ UISound.play('error'); UI.toast('🔜 ' + m.name + ' comes in BlasOff ' + m.type.toLowerCase() + '!'); return 'stop'; }
        setKind(k); savePrefs(); markModes(); renderLevels(); boPrefetch(); return false; }});   /* 📏 s-bo: a mode tap fetches its part early */
    box.querySelectorAll('.ui-mbtn').forEach(b => { if(MODES.find(m => m.k === b.dataset.k && m.soon)) b.classList.add('soon'); });
  }
  markModes(); renderLevels(); renderRulesTable(); paintLogos();
  if(UI.leaders) UI.leaders($('leaders'), GAME_ID, S.player);
}
const KINDS = ['skills', 'shootout', 'battle', 'party', 'cup', 'league', 'family', 'tale'], CUP_KINDS = ['cup', 'league', 'family'], CUP_SIZES = [4, 7, 5];
const PARTY_SIZES = [4, 7, 11, 5], THEME_WORLD = {classic: '', jungle: 'dino', underwater: 'sea', neon: 'dance', robot: 'robot', moon: 'space', olympus: 'sky'};
function partySkin(M){   // 🎉 the pitch's own bomb (Classic = a surprise world); the 🥚 egg pitch gets another so the ball never looks like the rolling egg
  let w = THEME_WORLD[M.theme]; if(!w || (M.twist === 'jungle' && w === 'dino')) w = pickOne(BombSkins.WORLD_KEYS.filter(k => k !== 'dino')); return w + ':0'; }
function modeId(){ return KINDS.includes(SET.kind) ? SET.kind : SZ_ID[SET.size]; }
function markModes(){ $('mode-list').querySelectorAll('.ui-mbtn').forEach(b => b.classList.toggle('on', b.dataset.k === modeId())); $('lvl-head').textContent = 'Pick a level · ' + (SET.kind === 'skills' ? '🎯 Skill challenges' : SET.kind === 'shootout' ? '🥅 Penalty shootout' : SET.kind === 'battle' ? '🎤 Tricks Battle' : SET.kind === 'party' ? '🎉 Party ball · ' + SZ_NAME[SET.size] : SZ_NAME[SET.size]); }
function setKind(k){ if(KINDS.includes(k)){ SET.kind = k; const ok = k === 'party' ? PARTY_SIZES : CUP_KINDS.includes(k) ? CUP_SIZES : [4, 7, 11]; if(!ok.includes(SET.size)) SET.size = k === 'party' || CUP_KINDS.includes(k) ? 4 : 7; } else { SET.kind = 'match'; SET.size = ID_SZ[k] || 4; } fixForm(); }
function halfTxt(h){ return h % 60 ? Math.floor(h / 60) + ':' + String(h % 60).padStart(2, '0') : (h / 60) + ' min'; }   // 90 → '1:30' · 120 → '2 min'
function rulesOf(i){ const L = BO.LEVELS[i], r = [], Sz = BO.SIZES[SET.size] || BO.SIZES[4]; if(Sz.firstTo) r.push('🥇 first to ' + Sz.firstTo); if(L.offside && !Sz.noOffside) r.push('🚩 offside'); if(L.fouls) r.push('🟢 fouls'); if(L.cards) r.push('🟨 cards'); if(L.stamina) r.push('💨 stamina'); r.push(['🎯 no aim help', '🎯 light aim', '🎯 medium aim', '🎯 big aim help'][L.aim]); r.push(Sz.oneHalf ? '⏱ ' + halfTxt(L.half) + '' : '⏱ 2 × ' + halfTxt(L.half) + ''); return r.join(' · '); }
function renderLevels(){
  const box = $('level-list'); box.innerHTML = ''; const p = progressOf(S.player), rec = AGE_START[S.age];
  BO.LEVELS.forEach((L, i) => {
    const U = LEVEL_UI[i], open = canPlay(i), done = p.unlocked > i, b = document.createElement('button');
    b.className = 'pick lvl' + (open ? '' : ' locked') + (i === rec && open ? ' recommended' : '') + (U.hardcore ? ' hardcore' : ''); b.setAttribute('data-sound', open ? 'pop' : 'none'); b.dataset.lv = i;
    b.innerHTML = '<span class="num">' + (i + 1) + '</span>' + (done ? '<span class="badge">🏅</span>' : open ? '' : '<span class="badge">🔒</span>') +
      '<div class="big">' + U.emoji + '</div><div class="nm">' + L.name + '</div><div class="sub">' + (U.hardcore && !open ? '🔒 Win on Extreme to open 💀 Hardcore' : U.blurb) + '</div><div class="rules-l">' + rulesOf(i) + '</div>' + bestHtml(p, i);
    b.onclick = () => { if(!open){ UISound.play('error'); UI.toast(i === 5 ? 'Win on Extreme to open 💀 Hardcore' : i === 4 ? 'Win on Hard to unlock Extreme!' : 'Win the level before to unlock it'); return; } if(SET.kind === 'tale'){ SET.level = i; savePrefs(); showTale(); return; } openSetup(i); };
    box.appendChild(b);
  });
}
function renderRulesTable(){
  const t = $('rules-table'), row = (h, f) => '<tr><td>' + h + '</td>' + BO.LEVELS.map((L, i) => '<td>' + f(L, i) + '</td>').join('') + '</tr>';
  t.innerHTML = '<tr><th>👮 Rules</th>' + BO.LEVELS.map((L, i) => '<th>' + LEVEL_UI[i].emoji + '</th>').join('') + '</tr>' +
    row('Offside', L => ['❌', 'simple', '✅'][L.offside]) + row('Fouls', L => L.fouls ? '✅' : '❌') + row('🟨 Cards', L => L.cards ? '✅' : '❌') + row('Stamina', L => L.stamina ? '✅' : '❌') +
    row('Aim help', L => ['❌', 'light', 'medium', 'strong'][L.aim]) + row('Draw', L => L.draw === 'pens' ? '🥅 pens' : '⚡ golden goal');
}

/* ================= 🏆 CUPS (R4a: Knockout Cup · League · 👑 Family cup) =================
   One cup at a time per player + kind, kept on this device (localStorage) so you can stop and come back.
   You play YOUR team's matches (a normal match at the cup's level + size); every other match is played out by a quick score roll. */
let CUPRUN = null;   // {T, fx, me, opp} while a cup match is on
/* 📏 s-bo cups#1 → BlasOff_cups.html */
const CUP_ROUND = {8: ['Quarter-final', 'Semi-final', 'Final'], 4: ['Semi-final', 'Final'], 2: ['Final']};
function cupKey(kind){ return store('cup:' + kind); }
function cupLoad(kind){ try{ const T = JSON.parse(ls(cupKey(kind)) || 'null'); return T && T.v === 1 ? T : null; }catch(e){ return null; } }
/* 📏 s-bo cups#2 → BlasOff_cups.html */
function cupRoundName(T){ if(T.kind === 'league') return 'Matchday ' + Math.min(T.day + 1, 3) + ' of 3'; const n = CUP_ROUND[T.rounds[0].length * 2] || []; return n[T.round] || 'Final'; }
/* 📏 s-bo cups#3 → BlasOff_cups.html */
function cupSetup(){
  const KD = SET.kind, T = cupLoad(KD), name = MODES.find(m => m.k === KD).name, icon = MODES.find(m => m.k === KD).icon;
  $('setup-logo').textContent = icon; $('setup-title').textContent = icon + ' ' + name + ' · ' + SZ_NAME[SET.size] + ' · ' + BO.LEVELS[SET.level].name;
  $('setup-sub').textContent = KD === 'league' ? '4 teams, you play each one once. Win = 3 points, draw = 1. Top of the table lifts the 🏆!' : KD === 'family' ? '👑 Every family member captains a team (their avatar wears the armband). You play your team\'s matches — the other captains\' matches are played out for you. Win the final to lift the trophy!'
    : '8 teams, knockout: quarter-final → semi-final → final. A draw goes to 🥅 penalties (or a golden goal on the easy levels). Lose and you\'re out!';
  const cont = T && !T.done && T.size === SET.size && T.level === SET.level;
  $('go-btn').textContent = cont ? '▶ Continue: ' + cupRoundName(T) : icon + ' Start the ' + (KD === 'league' ? 'league' : 'cup');
  $('go-btn').onclick = () => boNeed('cups', () => { let T2 = cupLoad(KD); if(!(T2 && !T2.done && T2.size === SET.size && T2.level === SET.level)){ T2 = cupNew(KD, SET.size, SET.level); cupSave(T2); } showCup(T2); });   /* 📏 s-bo: waits for the 🏆 cups part */
}
/* 📏 s-bo cups#4 → BlasOff_cups.html */

/* ================= 📜 KICK TALE (R4b: 6 chapters, 3 steps each, a kit reward per chapter) =================
   Each step = an existing mode with its own story line + pitch (a match, the street cage, a skill drill, the tricks battle, penalties).
   Progress per player on this device; the level you pick on the level list is the story's difficulty. A chapter opens when the one before is done. */
let TALERUN = null;   // {ch, st, ci, si, armed}
/* 📏 s-bo tale#1 → BlasOff_tale.html */
function taleKey(){ return store('tale'); }
function taleLoad(){ try{ const d = JSON.parse(ls(taleKey()) || 'null'); return d && d.v === 1 ? d : {v: 1, done: {}, kits: []}; }catch(e){ return {v: 1, done: {}, kits: []}; } }
/* 📏 s-bo tale#2 → BlasOff_tale.html */
function showTale(focus){ if(!boPartReady('tale')) return boNeed('tale', () => showTale(focus));   /* 📏 s-bo */
  TALERUN = null; hideResult(); $('pads').innerHTML = '';
  const d = taleLoad(), cur = TALE.findIndex((_, ci) => chOpen(d, ci) && !chDone(d, ci)), all = TALE.every((_, ci) => chDone(d, ci));
  let h = '<div class="title"><div class="logo">📜</div><h1>Kick Tale</h1><p>' + LEVEL_UI[SET.level].emoji + ' ' + BO.LEVELS[SET.level].name + ' · ' + TALE.filter((_, ci) => chDone(d, ci)).length + ' / 6 chapters' + (all ? ' · 🏆 the whole story!' : '') + '</p></div><div class="tale-grid">';
  TALE.forEach((ch, ci) => { const open = chOpen(d, ci), done = chDone(d, ci), nx = nextStep(d, ci);
    h += '<div class="tale-ch' + (done ? ' done' : open ? ' open' : ' locked') + (ci === cur ? ' now' : '') + '" style="--d:' + (ci * 0.05) + 's"><div class="tale-h"><span class="tale-ic">' + (open ? ch.icon : '🔒') + '</span><div><b>' + (ci + 1) + '. ' + ch.name + '</b><i>' + (open ? ch.about : 'Finish chapter ' + ci + ' to open') + '</i></div></div>';
    if(open) h += '<div class="tale-steps">' + ch.steps.map((st, si) => { const ok = d.done[stepId(ci, si)], next = si === nx;
      return '<button class="tale-step' + (ok ? ' ok' : next ? ' next' : ' wait') + '" data-c="' + ci + '" data-s="' + si + '" data-sound="' + (ok || next ? 'pop' : 'none') + '"><span>' + (ok ? '✅' : next ? stepIcon(st) : '·') + '</span>' + UI.esc(st.title) + '</button>'; }).join('') + '</div>';
    h += '<div class="tale-rw' + (done ? ' got' : '') + '">' + ch.reward[0] + ' ' + ch.reward[1] + (done ? ' ✓' : '') + '</div></div>'; });
  h += '</div><div class="tale-story hidden" id="tale-story"></div>';
  $('tale-box').innerHTML = h; showScreen('tale');
  $('tale-box').querySelectorAll('.tale-step').forEach(b => b.onclick = () => { const ci = +b.dataset.c, si = +b.dataset.s; if(b.classList.contains('wait')){ UISound.play('error'); UI.toast('👉 Do the steps in order — the glowing one is next'); return; } taleStory(ci, si); });
  if(focus && focus.ch != null){ const el = $('tale-box').querySelectorAll('.tale-ch')[focus.ch]; if(el){ el.classList.add('pop'); if(focus.reward && FX) confetti([TALE[focus.ch].reward[0], '⭐', '🎉'], 30); } }
}
/* 📏 s-bo tale#3 → BlasOff_tale.html */
function drawCoconut(g, x, y, r, roll){   // 🥥 brown, hairy, three eyes
  g.save(); g.translate(x, y); g.rotate(roll * 0.4); const gr = g.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r); gr.addColorStop(0, '#A9744A'); gr.addColorStop(1, '#5A3517');
  g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, r * 1.05, r * 0.95, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(40,20,5,0.55)'; g.lineWidth = Math.max(1, r * 0.08);
  for(let i = 0; i < 7; i++){ const a = i * 0.9; g.beginPath(); g.moveTo(Math.cos(a) * r * 0.2, Math.sin(a) * r * 0.2); g.lineTo(Math.cos(a + 0.3) * r * 0.95, Math.sin(a + 0.3) * r * 0.9); g.stroke(); }
  g.fillStyle = '#2B1608'; [[-0.28, -0.22], [0.12, -0.3], [-0.06, 0.05]].forEach(([a, b]) => { g.beginPath(); g.arc(a * r, b * r, r * 0.11, 0, 7); g.fill(); }); g.restore();
}

/* ================= 👕 KITS (R4c): your team's shirt — Classic + one per Kick Tale chapter + one per cup kind won =================
   Kept on this device (unlocked from the story / cups you won here); the badges + titles for them are on the server. */
const KITS = [
  {id: 'classic', icon: '🔵', name: 'Classic blue', c: 5},
  {id: 'vine', icon: '🌿', name: 'Vine kit', c: 15, tale: 'jungle', how: 'Finish 🦖 Jungle Street in 📜 Kick Tale'},
  {id: 'octo', icon: '🐙', name: 'Octo kit', c: 4, tale: 'school', how: 'Finish 🐙 School Team in 📜 Kick Tale'},
  {id: 'disco', icon: '🪩', name: 'Disco kit', c: 6, tale: 'city', how: 'Finish 🪩 City Tricks in 📜 Kick Tale'},
  {id: 'robo', icon: '⚙️', name: 'Robo kit', c: 8, tale: 'robot', how: 'Finish 🤖 Robot Training in 📜 Kick Tale'},
  {id: 'astro', icon: '🚀', name: 'Astro kit', c: 9, tale: 'moon', how: 'Finish 🪐 Moon Away Game in 📜 Kick Tale'},
  {id: 'champion', icon: '🏆', name: 'Champion kit', c: 16, tale: 'cloud', how: 'Win the ☁️ Cloud Final in 📜 Kick Tale'},
  {id: 'cupgold', icon: '🥇', name: 'Cup gold', c: 2, win: 'cup', how: 'Win a 🏆 Knockout Cup'},
  {id: 'league', icon: '📊', name: 'League purple', c: 11, win: 'league', how: 'Win a 📊 League'},
  {id: 'royal', icon: '👑', name: 'Captain orange', c: 1, win: 'family', how: 'Win a 👑 Family cup'}
];
function cupWins(){ try{ return JSON.parse(ls(store('cupwins')) || '{}') || {}; }catch(e){ return {}; } }
function kitOpen(K){ if(!K.tale && !K.win) return true; if(K.tale) return taleLoad().kits.indexOf(K.tale) >= 0; return (cupWins()[K.win] || 0) > 0; }
function myKit(){ const K = KITS.find(k => k.id === SET.kit) || KITS[0]; return K.id !== 'classic' && kitOpen(K) ? K : null; }
function buildKits(){
  let box = $('kit-box'); if(!box){ box = document.createElement('div'); box.className = 'box'; box.id = 'kit-box'; box.innerHTML = '<h3>👕 Your kit</h3><div class="chips" id="kit-row"></div>'; $('form-box').after(box); }
  if(!kitOpen(KITS.find(k => k.id === SET.kit) || KITS[0])) SET.kit = 'classic';
  $('kit-row').innerHTML = KITS.map(K => { const open = kitOpen(K); return '<button class="chip kit' + (SET.kit === K.id ? ' on' : '') + (open ? '' : ' locked') + '" data-k="' + K.id + '" data-sound="' + (open ? 'tap' : 'none') + '" style="--kc:' + OUTFIT_COLS[K.c] + '"><i></i>' + (open ? K.icon + ' ' + K.name : '🔒 ' + K.name) + '</button>'; }).join('');
  $('kit-row').querySelectorAll('.chip').forEach(b => b.onclick = () => { const K = KITS.find(k => k.id === b.dataset.k); if(!kitOpen(K)){ UISound.play('error'); UI.toast('🔒 ' + K.how); return; } SET.kit = K.id; savePrefs(); buildKits(); });
}

/* ================= SETUP ================= */
/* ================= 📏 S-BO PARTS — play + 🏆 cups + 📜 Kick Tale load on demand (⚽ BlasOff chat s-bo, rule "📏 Born split + split your own") =================
   BlasOff_play.html = what only a running match uses (sounds · camera · the pitch painter: players, ball, beats, 🎤 battle, 🎯 drills, set pieces ·
   radar · loop · HUD · input + pads · events → sounds / words) · BlasOff_cups.html = the 🏆 cups (bracket · table · robot matches · lift) ·
   BlasOff_tale.html = 📜 Kick Tale (chapters · steps · the story screen). Built by Test Harness/parts/build_parts.py from parts/BlasOff/<part>.js —
   edit those. The engine (BO), the cover + setup page (incl. the 🏟️ pitch-look previews and their painter), saves + result card stay HERE.
   startMatch() / showTale() / a cup's ▶ Start wait for their part (GameParts.need, with the game's own loader). The play part (+ the picked mode's
   part) is fetched after a tap — the cover's ▶ Play or a mode pick (boPrefetch) — never at boot.
   ⚠️ Late wraps (boLate): 🎵 MOOD wraps handleEvents and 🎬 BlasOffMotion wraps the painter (drawPlayer · sprite · actFrame …) ONCE at load —
   online the play part arrives later, so boLate re-applies the same 🎵 wrap (same __gmood flag) and installs the real 🎬 BoMotion (a waiting BoMotion {pending, install} stood in).
   📲 offline app + tests: every part is inline (Code.gs INCLUDE_ALSO_ BlasOffParts) → there at once, wrapped at load as before, boLate does nothing. */
function boPartReady(k){ return typeof GameParts !== 'undefined' && GameParts.has('BlasOff_' + k); }
function boLate(){
  if(!boPartReady('play')) return;
  const wrapBefore = (n, flag, before) => { const f = window[n]; if(typeof f !== 'function' || f[flag]) return;   /* the 🎵 MOOD block's own wrap: same rule + same flag */
    const w = function(){ try{ before.apply(this, arguments); }catch(e){} return f.apply(this, arguments); }; w[flag] = 1; window[n] = w; };
  if(typeof GMOOD !== 'undefined') wrapBefore('handleEvents', '__gmood', evs => { if((evs || []).some(e => (e.k === 'goal' && !e.own && isMine(e.side)) || (e.k === 'save' && e.shoutSave && isMine(e.side)) || (e.k === 'pengoal' && isMine(e.side)))) GMOOD.lift(); });
  try{ const B = window.BoMotion; if(B && B.pending && typeof B.install === 'function'){ B.pending = false; B.install(); } }catch(e){}   /* 🎬 BlasOffMotion waited for the painter */
}
function boPrefetch(){   /* online: after a tap (cover ▶ Play · a mode pick) → fetch the play part + the picked mode's part now */
  if(typeof GameParts === 'undefined') return; const KD = SET.kind || 'match';
  const want = ['play'].concat(CUP_KINDS.includes(KD) ? ['cups'] : KD === 'tale' ? ['tale'] : []).filter(k => !boPartReady(k));
  want.forEach(k => GameParts.need('BlasOff_' + k, ok => { if(ok && k === 'play') boLate(); }));
}
function boNeed(k, go){
  if(typeof GameParts === 'undefined') return setTimeout(() => boNeed(k, go), 40);   // the loader comes right after this script
  if(boPartReady(k)){ boLate(); return go(); }
  UI.loading('blasoff', k === 'cups' ? '🏆 Getting the cup ready…' : k === 'tale' ? '📜 Opening the Kick Tale…' : '⚽ Blasting onto the pitch…');
  GameParts.need('BlasOff_' + k, ok => { UI.loaded(); if(ok){ boLate(); return go(); } UISound.play('error'); UI.toast('📡 BlasOff did not load — check the internet, then tap again', 'err'); });
}
window.boPrefetch = boPrefetch;
/* ================= 📏 END S-BO PARTS ================= */
function openSetup(lvl){
  SET.level = lvl; const L = BO.LEVELS[lvl], Sz = BO.SIZES[SET.size];
  if(LEVEL_UI[lvl].hardcore) SET.who = 'robot';
  $('setup-logo').textContent = SZ_LOGO[SET.size] || '⚽'; $('setup-title').textContent = (SET.size === 5 || SET.size === 1 ? '' : 'Soccer ') + SZ_NAME[SET.size] + ' · ' + L.name;
  $('setup-sub').textContent = Sz.nokeeper ? 'Just you and one robot in a street cage — no keepers, the ball bounces off the fence. 🥜 Nutmeg them (ball through the legs: L when they stand right in front) = a point! First to ' + Sz.firstTo + ' wins · ' + halfTxt(L.half) + ' · a draw = ⚡ next point wins.'
    : (Sz.n + ' players + a 🧤 robot keeper a side. ') + (Sz.court === 'futsal' ? 'Indoor court: the heavy ball stays low · out at the side = a 🦶 kick-in · no offside. ' : '') + (SET.size === 11 ? 'Wide camera — 🔍 zoom in with Z · radar in the corner. ' : '') + '2 halves of ' + halfTxt(L.half) + ' · ' + (L.draw === 'pens' ? 'a draw = 🥅 penalty shootout.' : 'a draw = ⚡ golden goal.');
  const KD = SET.kind || 'match'; $('drill-box').classList.toggle('hidden', KD !== 'skills'); $('form-box').classList.toggle('hidden', KD !== 'match' && KD !== 'party' && !CUP_KINDS.includes(KD)); buildPartySizes(); $('who-box').classList.toggle('hidden', KD === 'skills' || CUP_KINDS.includes(KD));
  $('go-btn').textContent = KD === 'skills' ? '🎯 Start the challenge' : KD === 'shootout' ? '🥅 Start the shootout' : '⚽ Kick off!';
  if(KD === 'skills'){ SET.who = 'robot'; buildDrills(); $('setup-logo').textContent = '🎯'; $('setup-title').textContent = '🎯 Skill challenges · ' + L.name; }
  if(KD === 'battle'){ $('setup-logo').textContent = '🎤'; $('setup-title').textContent = '🎤 Tricks Battle · ' + L.name; $('setup-sub').textContent = 'Your turn: 20 s of tricks ON the beat (the ring closes on you = now!) — J 🦶 stepover · K 🌈 rainbow · L 🌀 around the world · Space 🦵 knee · J + K 🧢 neck stall. 🎮 Left thumb (arrows / WASD): ⬆️ hop · ⬇️ drop · 🔄 spin · 😎 show-off — press one WITH a trick on the same beat = a COMBO (16 of them, big points). A different trick each time builds the combo. 3 judges score 🎵 timing · 🌈 variety · ✨ style — best of 3 rounds. ' + BO.BPM[lvl] + ' beats a minute.'; $('go-btn').textContent = '🎤 Start the battle'; }
  if(KD === 'party'){ $('setup-logo').textContent = '🎉'; $('setup-title').textContent = '🎉 Party ball · ' + SZ_NAME[SET.size] + ' · ' + L.name; $('setup-sub').textContent = '🎉 A wild bomb ball: it bounces like crazy (anything can happen!) and a goal pops it into confetti. ' + $('setup-sub').textContent; }
  if(KD === 'shootout'){ $('setup-logo').textContent = '🥅'; $('setup-title').textContent = '🥅 Penalty shootout · ' + L.name; $('setup-sub').textContent = '5 kicks each, then sudden death. Your kick: shoot (K / 💥) when the sliding 🎯 is where you want. Their kick: dive with Q / E (or ⬅️ ➡️) — or stay in the middle!'; }
  buildWho(); buildForms(); buildLooks(); buildBalls(); buildKits();
  const VIEW_TXT = {auto: '📷 View: Auto', behind: '📷 View: Behind your team', side: '📷 View: From the side', top: '📷 View: From above'};
  const vc = () => { $('view-chip').textContent = VIEW_TXT[SET.view] || VIEW_TXT.auto; $('view-chip').classList.toggle('on', SET.view !== 'auto'); };
  vc(); $('view-chip').onclick = () => { const o = ['auto', 'behind', 'side', 'top']; SET.view = o[(o.indexOf(SET.view) + 1) % 4]; savePrefs(); vc(); UI.toast(SET.view === 'auto' ? '📷 Behind your team when one team has people · from the side for 2 teams' : VIEW_TXT[SET.view].replace('📷 View: ', '📷 ')); };
  if(CUP_KINDS.includes(KD)) cupSetup();   // 🏆 R4a
  else $('go-btn').onclick = () => startMatch();
  showScreen('setup');
}
function drillBest(id, lvl){ try{ return JSON.parse(localStorage.getItem(store('drill:' + id + ':' + lvl)) || 'null'); }catch(e){ return null; } }
function buildDrills(){
  const ids = Object.keys(BO.DRILLS); if(!ids.includes(SET.drill)) SET.drill = ids[0];
  $('drill-list').innerHTML = ids.map(id => { const D = BO.DRILLS[id], b = drillBest(id, SET.level), st = b ? b.stars : 0;
    return '<button class="drill' + (SET.drill === id ? ' on' : '') + '" data-d="' + id + '" data-sound="tap"><b>' + D.name + '</b><i>' + D.about + '</i><span class="st">' + '⭐'.repeat(st) + '<span style="opacity:.3">' + '⭐'.repeat(3 - st) + '</span>' + (b && b.time ? ' · ' + b.time + ' s' : b && b.score ? ' · ' + b.score : '') + '</span></button>'; }).join('');
  $('drill-list').querySelectorAll('.drill').forEach(b => b.onclick = () => { SET.drill = b.dataset.d; savePrefs(); buildDrills(); $('setup-sub').textContent = BO.DRILLS[SET.drill].about + (SET.drill === 'cones' ? ' · ⭐ ' + BO.CONE_STARS[SET.level].join(' / ') + ' s' : ''); });
  $('setup-sub').textContent = BO.DRILLS[SET.drill].about + (SET.drill === 'cones' ? ' · ⭐ ' + BO.CONE_STARS[SET.level].join(' / ') + ' s' : '');
}
function others(){ return S.players.map(p => p.Name).filter(n => n !== S.player); }
function buildWho(){
  const hc = !!BO.LEVELS[SET.level].hardcore, list = [['robot', '🤖 Me vs robots'], ['duo', '👥 2 players · against each other'], ['coop', '🤝 2 players · same team']].filter(([k]) => !(SET.kind === 'battle' && k === 'coop'));
  if(SET.kind === 'battle' && SET.who === 'coop') SET.who = 'robot';
  $('who-row').innerHTML = list.map(([k, n]) => '<button class="chip' + (SET.who === k ? ' on' : '') + '" data-k="' + k + '" data-sound="tap"' + (hc && k !== 'robot' ? ' disabled style="opacity:.45"' : '') + '>' + n + '</button>').join('');
  $('who-row').querySelectorAll('.chip').forEach(b => b.onclick = () => { if(b.disabled){ UI.toast('💀 Hardcore is you vs the robots'); return; } SET.who = b.dataset.k; savePrefs(); buildWho(); });
  const ob = $('opp-box'); if(SET.who === 'robot'){ ob.innerHTML = '<div class="note" style="margin-top:8px">⌨️ W A S D or the arrows · J pass · K shoot · L trick · Space jump · Q / E shout to your keeper</div>'; return; }
  const key = SET.who === 'duo' ? 'opp' : 'mate', names = others().concat(['Guest']); if(!names.includes(SET[key])) SET[key] = names[0];
  ob.innerHTML = '<div class="opp-row"><span class="note">' + (SET.who === 'duo' ? '🔴 Other team:' : '🔵 Your teammate:') + '</span>' + names.map(n => '<button class="chip' + (SET[key] === n ? ' on' : '') + '" data-n="' + UI.esc(n) + '" data-sound="tap">' + (n === 'Guest' ? '🙂 Guest' : UI.esc(n)) + '</button>').join('') + '</div>' +
    '<div class="note" style="margin-top:6px">⌨️ 2nd player: arrows + number pad (1 pass · 2 shoot · 3 trick · 0 jump · Enter switch · 4 / 6 shout) — or each takes a side of the tablet.</div>';
  ob.querySelectorAll('.chip').forEach(b => b.onclick = () => { SET[key] = b.dataset.n; buildWho(); });
}
function buildForms(){
  const Sz = BO.SIZES[SET.size];
  $('form-row').innerHTML = Sz.formOrder.map(f => '<button class="chip' + (SET.form === f ? ' on' : '') + '" data-f="' + f + '" data-sound="tap">' + formIcon(f) + ' ' + Sz.formName[f] + '</button>').join('');
  $('form-row').querySelectorAll('.chip').forEach(b => b.onclick = () => { SET.form = b.dataset.f; savePrefs(); buildForms(); });
}
function buildPartySizes(){   // 🎉 party ball + 🏆 cups: pick the match size here
  let row = $('psize-row'); if(!row){ row = document.createElement('div'); row.className = 'chips'; row.id = 'psize-row'; row.style.marginBottom = '8px'; $('form-row').before(row); }
  if(SET.kind !== 'party' && !CUP_KINDS.includes(SET.kind)){ row.innerHTML = ''; row.classList.add('hidden'); return; } row.classList.remove('hidden');
  row.innerHTML = (SET.kind === 'party' ? PARTY_SIZES : CUP_SIZES).map(z => '<button class="chip' + (SET.size === z ? ' on' : '') + '" data-z="' + z + '" data-sound="tap">' + SZ_LOGO[z] + ' ' + SZ_NAME[z] + '</button>').join('');
  row.querySelectorAll('.chip').forEach(b => b.onclick = () => { SET.size = +b.dataset.z; fixForm(); savePrefs(); openSetup(SET.level); });
}
function buildTwist(){   // 🎪 fun pitch twists: 🔥 Intermediate up, switch on / off
  let row = $('twist-row'); if(!row){ row = document.createElement('div'); row.className = 'chips'; row.id = 'twist-row'; row.style.marginTop = '8px'; $('night-row').after(row); }
  const T = BO.TWISTS[SET.theme]; if(!T){ row.innerHTML = ''; return; }
  if(SET.level < 2){ row.innerHTML = '<span class="note">🎪 ' + T.icon + ' ' + T.name + ' — the fun pitch twist starts at 🔥 Intermediate</span>'; return; }
  row.innerHTML = '<button class="chip' + (SET.twist ? ' on' : '') + '" data-t="1" data-sound="tap">🎪 Fun pitch: ' + T.icon + ' ' + T.name + '</button><button class="chip' + (!SET.twist ? ' on' : '') + '" data-t="0" data-sound="tap">⚽ Plain pitch</button><span class="note" style="flex-basis:100%">' + T.about + '</span>';
  row.querySelectorAll('.chip').forEach(b => b.onclick = () => { SET.twist = b.dataset.t === '1'; savePrefs(); buildTwist(); });
}
function formIcon(f){ return {'121': '🔷', '22': '🟦', '31': '📌', '1': '🧍', '231': '🔺', '321': '🛡️', '442': '🧱', '433': '⚔️', '352': '🎯'}[f] || '📋'; }
function buildLooks(){
  const box = $('look-list');
  if(!box.children.length){
    LOOK_KEYS.forEach(k => { const b = document.createElement('button'); b.className = 'look'; b.dataset.k = k; b.setAttribute('data-sound', 'tap');
      const c = document.createElement('canvas'); c.width = 200; c.height = 150; b.appendChild(c); b.insertAdjacentHTML('beforeend', '<div class="nm">' + LOOKS[k].icon + ' ' + LOOKS[k].name + '</div>');
      b.onclick = () => { SET.theme = k; savePrefs(); markLooks(); }; box.appendChild(b); });
  }
  box.querySelectorAll('.look').forEach(b => drawLookPreview(b.querySelector('canvas'), b.dataset.k));
  markLooks();
}
function markLooks(){
  try{ paintLogos(); }catch(e){}
  $('look-list').querySelectorAll('.look').forEach(b => b.classList.toggle('on', b.dataset.k === SET.theme));
  buildTwist(); const nr = $('night-row'); if(SET.theme !== 'classic'){ nr.innerHTML = ''; return; }
  nr.innerHTML = '<button class="chip' + (!SET.night ? ' on' : '') + '" data-n="0" data-sound="tap">☀️ Day match</button><button class="chip' + (SET.night ? ' on' : '') + '" data-n="1" data-sound="tap">🌙 Night match</button>';
  nr.querySelectorAll('.chip').forEach(b => b.onclick = () => { SET.night = b.dataset.n === '1'; savePrefs(); markLooks(); drawLookPreview($('look-list').querySelector('.look[data-k="classic"] canvas'), 'classic'); });
}
function buildBalls(){
  const box = $('ball-list'), have = ownedBalls(); box.innerHTML = '';
  const add = (v, nm) => { const b = document.createElement('button'); b.className = 'ballc' + (SET.ball === v ? ' on' : ''); b.setAttribute('data-sound', 'tap');
    const c = document.createElement('canvas'); c.width = c.height = 80; b.appendChild(c); b.insertAdjacentHTML('beforeend', '<span>' + UI.esc(nm) + '</span>');
    const g = c.getContext('2d'); if(v < 0) drawSoccerBall(g, 40, 40, 28, 0.6); else BallSkins.draw(g, v, 40, 40, 28, 1);
    b.onclick = () => { SET.ball = v; ls('sp_ball:' + S.player, String(v)); buildBalls(); }; box.appendChild(b); };
  add(-1, 'Classic'); for(let i = 0; i < have; i++) add(i, (BallSkins.NAMES || [])[i] || 'Skin ' + (i + 1));
  if(!have) box.insertAdjacentHTML('beforeend', '<div class="note" style="align-self:center">🎁 More balls: earn ball skins in the Collection</div>');
}
/* ⌨️ keys per device (swap on clash), saved per player */
function keyName(code){ if(!code) return '—'; return code.replace(/^Key/, '').replace(/^Digit/, '').replace(/^Numpad/, 'Num ').replace('Arrow', '').replace('ShiftLeft', 'L-Shift').replace('ShiftRight', 'R-Shift').replace('Space', 'Space').replace('Enter', '⏎'); }
function loadKeys(){ let k = null; try{ k = JSON.parse(ls(store('keys')) || 'null'); }catch(e){} return DEFAULT_KEYS.map((d, i) => Object.assign({}, d, (k && k[i]) || {})); }
function saveKeys(){ ls(store('keys'), JSON.stringify(KEYS)); }
let keyWait = null;
function openKeys(){ renderKeys(); $('keys-sheet').classList.remove('hidden'); }
function closeKeys(){ keyWait = null; $('keys-sheet').classList.add('hidden'); }
function resetKeys(){ KEYS = DEFAULT_KEYS.map(d => Object.assign({}, d)); saveKeys(); renderKeys(); }
function renderKeys(){
  $('keys-table').innerHTML = '<div class="krow"><span></span><span>🔵 Player 1</span><span>🟣 Player 2</span></div>' + ACTIONS.map(([a, n]) => '<div class="krow"><span>' + n + '</span>' + [0, 1].map(s => '<button class="keybtn' + (keyWait && keyWait.s === s && keyWait.a === a ? ' wait' : '') + '" data-s="' + s + '" data-a="' + a + '">' + (keyWait && keyWait.s === s && keyWait.a === a ? 'press…' : UI.esc(keyName(KEYS[s][a]))) + '</button>').join('') + '</div>').join('');
  $('keys-table').querySelectorAll('.keybtn').forEach(b => b.onclick = () => { keyWait = {s: +b.dataset.s, a: b.dataset.a}; renderKeys(); });
}
function takeKey(e){
  if(!keyWait) return false; e.preventDefault(); if(e.code === 'Escape'){ keyWait = null; renderKeys(); return true; }
  const {s, a} = keyWait, old = KEYS[s][a];
  KEYS.forEach((K, si) => Object.keys(K).forEach(k => { if(K[k] === e.code && !(si === s && k === a)) K[k] = old; }));   // swap on clash
  KEYS[s][a] = e.code; keyWait = null; saveKeys(); renderKeys(); UISound.play('pop'); return true;
}
/* 📏 s-bo play#1 → BlasOff_play.html */
function startMatch(){ if(!boPartReady('play')) return boNeed('play', startMatch);   /* 📏 s-bo */
  hideResult(); savePrefs();
  const kind0 = SET.kind || 'match', kind = CUP_KINDS.includes(kind0) ? 'match' : kind0; if(kind === 'skills' || (kind === 'battle' && SET.who === 'coop') || kind0 !== kind) SET.who = 'robot';
  if(!CUP_KINDS.includes(kind0)) CUPRUN = null;
  const taleRun = TALERUN && TALERUN.armed ? TALERUN : null; if(TALERUN) TALERUN.armed = false; if(!taleRun) TALERUN = null;   // 📜 R4b
  const size = SET.size, lv = SET.level, Sz = BO.SIZES[size], L = BO.LEVELS[lv], humans = [{name: S.player, side: 0, seat: 0}];
  if(SET.who === 'duo') humans.push({name: SET.opp || 'Guest', side: 1, seat: 1});
  if(SET.who === 'coop') humans.push({name: SET.mate || 'Guest', side: 0, seat: 1});
  const names = [[], []], bots = ROBO_NAMES.slice().sort(() => Math.random() - 0.5);
  for(let s = 0; s < 2; s++){ names[s].push(s ? 'Robo Keeper' : 'Keeper'); for(let i = 0; i < Sz.n; i++) names[s].push(bots[(s * Sz.n + i) % bots.length]); }
  // people play the forward(s) (the engine gives each person the last free outfield player of their side)
  const perSide = [0, 0]; humans.forEach(h => { const idx = Sz.n - perSide[h.side]; names[h.side][idx] = h.name; perSide[h.side]++; });
  const robotForm = Sz.formOrder[Math.floor(Math.random() * Sz.formOrder.length)];
  const M = BO.newMatch({size, level: lv, seed: (Date.now() & 0xffffff) ^ 0xb0, form0: SET.form, form1: SET.who === 'duo' ? Sz.formOrder[0] : robotForm, theme: SET.theme, names, humans, fast: !!window.BO_FAST, half: window.BO_HALF || 0, pensOnly: kind === 'shootout', party: kind === 'party', twist: taleRun ? !!taleRun.st.twist : SET.twist, forceTwist: !!(taleRun && taleRun.st.twist), league: !!(CUPRUN && CUPRUN.T.kind === 'league')});
  if(kind === 'skills') BO.drill(M, SET.drill);
  if(kind === 'battle') BO.battleStart(M);
  const teamName = s => { const hs = humans.filter(h => h.side === s).map(h => h.name); return hs.length ? hs.join(' + ') : ROBO_TEAMS[lv]; };
  G = {party: kind === 'party' ? partySkin(M) : null, M, L, Sz, size, level: lv, kind, drill: kind === 'skills' ? SET.drill : null, theme: SET.theme, night: SET.theme === 'classic' && SET.night, ball: SET.ball, humans, mode: SET.who, tn: CUPRUN ? [CUPRUN.me.name, CUPRUN.opp.name] : taleRun && taleRun.st.opp ? [teamName(0), taleRun.st.opp] : [teamName(0), teamName(1)], tale: taleRun, coconut: !!(taleRun && taleRun.st.coconut), cup: CUPRUN, captain: CUPRUN && CUPRUN.T.kind === 'family' ? S.player : null,
    avs: M.players.map(p => { const h = humans.find(x => x.name === p.name && x.side === p.side); return kitAv(h ? myAvatar(h.name === 'Guest' ? 'Guest' : h.name) : defaultAvatar(p.name + '·robo' + p.side), p.side, p.gk); }),
    spr: M.players.map(() => ({})), t0: performance.now(), last: performance.now(), acc: 0, paused: false, over: false, raf: 0, held: new Set(), sticks: new Map(), btn: new Map(),
    cam: null, anim: 0, sq: size === 11 ? 1.0 : size === 1 ? 1.6 : 1.3,   /* 🎤 the battle dancers are drawn live (bo-5c) — sharp without big pictures */ zoom: ls(store('zoom' + size)) === '1', startAt: performance.now(), shoutShow: [0, 0], guideHand: true, lastScore: '', endAt: 0, help: L.guided, floatQ: []};
  G.view = viewMode();
  GameComic._reset();
  G.lvFull = (kind === 'skills' ? BO.DRILLS[SET.drill].name : kind === 'shootout' ? '🥅 Penalties' : kind === 'battle' ? '🎤 Tricks Battle' : kind === 'party' ? '🎉 Party ' + SZ_NAME[size] : (SZ_LOGO[size] || '⚽') + ' ' + SZ_NAME[size]) + ' · ' + LEVEL_UI[lv].emoji + ' ' + L.name;
  G.lvShort = (kind === 'skills' ? [...BO.DRILLS[SET.drill].name][0] : kind === 'shootout' ? '🥅' : kind === 'battle' ? '🎤' : kind === 'party' ? '🎉' : (SZ_LOGO[size] || '⚽')) + ' ' + LEVEL_UI[lv].emoji;
  if(CUPRUN){ G.lvFull = '🏆 ' + cupRoundName(CUPRUN.T) + ' · ' + G.lvFull; G.lvShort = '🏆 ' + G.lvShort; }
  if(G.tale){ G.lvFull = '📜 ' + G.tale.ch.icon + ' ' + G.tale.st.title + ' · ' + LEVEL_UI[lv].emoji; G.lvShort = '📜 ' + G.tale.ch.icon; }   // 🏆 R4a: the bar names the cup round
  barLevel();
  BAR.players([0, 1].map(i => ({k: i, av: (Array.from(G.tn[i] || '?')[0] || '?').toUpperCase(), name: G.tn[i], score: 0, col: TEAM_COL[i]})));
  BAR.time(fmt(M.halfLen)); BAR.round(1, Sz.oneHalf ? 1 : 2); if(L.stamina) BAR.meter('sta', '💨', 1, 'Stamina — sprinting uses it up');
  showScreen('play'); BAR.fit(); resize(); buildPads(); checkTurn(); if(kind === 'battle') battlePads();
  calloutSetup();   /* 💬 bo-10 */
  if(M.twist && FX) setTimeout(() => { if(G && G.M === M) banner('🎪 ' + BO.TWISTS[M.twist].icon + ' ' + BO.TWISTS[M.twist].name + ' — ' + BO.TWISTS[M.twist].about, 'gold'); }, 2400);
  if(kind === 'party') banner('🎉 Party ball! It bounces like crazy — score to pop it!', 'gold'); else if(kind !== 'match') ; else banner(Sz.nokeeper ? '🏙️ First to ' + Sz.firstTo + '! Score in the little 🥅 — or 🥜 nutmeg them (L)' : '⚽ Kick off! ' + (L.guided ? 'Run to the ball and score in the 🥅!' : 'First half — ' + fmt(M.halfLen)), 'good');
  sfx('whistle'); say('Blas off! Kick off!');
  G.raf = requestAnimationFrame(frame);
}
/* 📏 s-bo play#2 → BlasOff_play.html */
function phoneLand(){ return innerHeight < 520 && innerWidth > innerHeight; }
/* 📏 s-bo play#3 → BlasOff_play.html */
const NEAR = 0.4;
function makeView(W, H, box, eye, look, fovMode){
  const iw = Math.max(40, W - box.l - box.r), ih = Math.max(40, H - box.t - box.b), cx = box.l + iw / 2, cy = box.t + ih / 2;
  let fx = look[0] - eye[0], fy = look[1] - eye[1], fz = look[2] - eye[2]; const fm = Math.hypot(fx, fy, fz); fx /= fm; fy /= fm; fz /= fm;
  let rx = fy, ry = -fx, rz = 0; const rm = Math.hypot(rx, ry) || 1; rx /= rm; ry /= rm;   // right = forward × up(z)
  const ux = ry * fz - rz * fy, uy = rz * fx - rx * fz, uz = rx * fy - ry * fx;
  const portrait = ih > iw * 1.05, F = portrait ? (iw / 2) / Math.tan(0.62) : (ih / 2) / Math.tan(fovMode === 'top' ? 0.5 : 0.44);
  const toC = (x, y, z) => { const dx = x - eye[0], dy = y - eye[1], dz = (z || 0) - eye[2]; return [dx * rx + dy * ry + dz * rz, dx * ux + dy * uy + dz * uz, dx * fx + dy * fy + dz * fz]; };
  const proj = c => [cx + F * c[0] / c[2], cy - F * c[1] / c[2], c[2]];
  const P = (x, y, z) => { const c = toC(x, y, z); return c[2] > NEAR ? proj(c) : null; };
  const sc = (x, y, z) => { const c = toC(x, y, z); return c[2] > NEAR ? F / c[2] : 0; };
  // a screen direction (keys / stick) → the world direction that looks like it on screen (round the ground point the camera looks at)
  const k2w = (sx, sy) => { const m = Math.hypot(sx, sy); if(m < 1e-6) return {x: 0, y: 0}; const o = P(look[0], look[1], 0), a = P(look[0] + 1, look[1], 0), b = P(look[0], look[1] + 1, 0); if(!o || !a || !b) return {x: sx, y: sy};
    const j11 = a[0] - o[0], j21 = a[1] - o[1], j12 = b[0] - o[0], j22 = b[1] - o[1], det = j11 * j22 - j12 * j21 || 1e-6; let wx = (j22 * sx - j12 * sy) / det, wy = (-j21 * sx + j11 * sy) / det; const wm = Math.hypot(wx, wy) || 1; return {x: wx / wm * m, y: wy / wm * m}; };
  return {W, H, box, F, cx, cy, eye, look, toC, proj, P, sc, k2w, portrait, rv: [rx, ry, rz], uv: [ux, uy, uz], fv: [fx, fy, fz]};   // bo-7: camera axes (the 3D rolling ball)
}
/* 📏 s-bo play#4 → BlasOff_play.html */

/* ---------- 🎨 drawing ---------- */
function clipPoly(V, pts){   // world polygon → screen polygon, cut at the camera's near plane
  const C = pts.map(p => V.toC(p[0], p[1], p[2] || 0)), out = [];
  for(let i = 0; i < C.length; i++){ const a = C[i], b = C[(i + 1) % C.length], ai = a[2] > NEAR, bi = b[2] > NEAR;
    if(ai) out.push(V.proj(a)); if(ai !== bi){ const t = (NEAR - a[2]) / (b[2] - a[2]); out.push(V.proj([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR])); } }
  return out;
}
function fillPoly(g, V, pts, col){ const q = clipPoly(V, pts); if(q.length < 3) return; g.beginPath(); g.moveTo(q[0][0], q[0][1]); for(let i = 1; i < q.length; i++) g.lineTo(q[i][0], q[i][1]); g.closePath(); g.fillStyle = col; g.fill(); }
function segW(g, V, a, b){ let A = V.toC(a[0], a[1], a[2] || 0), B = V.toC(b[0], b[1], b[2] || 0); if(A[2] <= NEAR && B[2] <= NEAR) return; if(A[2] <= NEAR){ const t = (NEAR - A[2]) / (B[2] - A[2]); A = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, NEAR]; } else if(B[2] <= NEAR){ const t = (NEAR - B[2]) / (A[2] - B[2]); B = [B[0] + (A[0] - B[0]) * t, B[1] + (A[1] - B[1]) * t, NEAR]; }
  const p = V.proj(A), q = V.proj(B); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); }
function polyline(g, V, pts){ for(let i = 0; i < pts.length - 1; i++) segW(g, V, pts[i], pts[i + 1]); }
function arcPts(cx, cy, r, a0, a1, n){ const o = []; for(let i = 0; i <= n; i++){ const a = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0]); } return o; }
function gEll(V, x, y, R){ const c = V.P(x, y, 0); if(!c) return null; const s = V.sc(x, y, 0); const a = V.P(x + R, y, 0), b = V.P(x, y + R, 0); if(!a || !b) return [c[0], c[1], R * s, R * s * 0.4]; return [c[0], c[1], Math.max(1, Math.hypot(a[0] - c[0], b[0] - c[0])), Math.max(0.6, Math.hypot(a[1] - c[1], b[1] - c[1]))]; }
// the world: sky, ground, stands + crowd, ad boards, pitch, lines (players + ball + goals are drawn by depth after this)
function drawWorld(g, V, Lk, Sz, t, night){
  const W = V.W, H = V.H, Lh = Sz.Lh, Wh = Sz.Wh;
  const sky = night && Lk.skyN ? Lk.skyN : Lk.sky, gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, sky[0]); gr.addColorStop(1, sky[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  if(Lk.stars || night){ g.fillStyle = 'rgba(255,255,255,0.8)'; for(let i = 0; i < 40; i++){ const x = (i * 97.3) % W, y = (i * 53.7) % (H * 0.45); g.fillRect(x, y, 1.6, 1.6); } }
  // deco far away (volcano, Earth, temple…)
  (Lk.deco || []).forEach(([ch, x, y, z, s], i) => { const dx = Lk.drones ? Math.sin(t * 0.6 + i) * 6 : Lk.clouds ? Math.sin(t * 0.2 + i) * 4 : 0; const p = V.P(x + dx, y + Wh, z + (Lk.drones ? Math.sin(t * 1.3 + i) : 0)); if(p) emo(g, ch, p[0], p[1], Math.max(10, V.sc(x, y + Wh, z) * s), 0.95); });
  fillPoly(g, V, [[-Lh - 140, -Wh - 140], [Lh + 140, -Wh - 140], [Lh + 140, Wh + 140], [-Lh - 140, Wh + 140]], night ? shadeHex(Lk.out, -0.35) : Lk.out);
  const CT = Sz.court, CAGE = CT === 'cage', FUT = CT === 'futsal';
  if(CAGE){   // 🏙️ the street: asphalt all round + blocks of flats behind the fence
    fillPoly(g, V, [[-Lh - 140, -Wh - 140], [Lh + 140, -Wh - 140], [Lh + 140, Wh + 140], [-Lh - 140, Wh + 140]], shadeHex(Lk.cage[0], night ? -0.5 : -0.25));
    const wall = shadeHex(Lk.stand, night ? -0.25 : 0.05), win = night ? '#FFE27A' : 'rgba(255,255,255,0.55)', R = [[0, 1, Lh + 10, Wh + 9], [0, -1, Lh + 10, Wh + 9], [1, 0, Wh + 10, Lh + 9], [-1, 0, Wh + 10, Lh + 9]];
    R.forEach(([ax, ay, half, dist], si) => { for(let u = -half, k = 0; u < half; k++){ const w = 4 + ((k * 7 + si * 3) % 4), h = 7 + ((k * 5 + si) % 6) * 2.2, u1 = Math.min(half, u + w);
      const P0 = ax ? [ax * dist, u] : [u, ay * dist], P1 = ax ? [ax * dist, u1] : [u1, ay * dist];
      fillPoly(g, V, [[P0[0], P0[1], 0], [P1[0], P1[1], 0], [P1[0], P1[1], h], [P0[0], P0[1], h]], (k + si) % 3 ? wall : shadeHex(wall, -0.15));
      for(let z = 2; z < h - 1; z += 2.6) for(let q = 0.25; q < 0.9; q += 0.33){ const A = [P0[0] + (P1[0] - P0[0]) * q, P0[1] + (P1[1] - P0[1]) * q], Bq = q + 0.16, B = [P0[0] + (P1[0] - P0[0]) * Bq, P0[1] + (P1[1] - P0[1]) * Bq];
        if((k * 3 + Math.round(z) + Math.round(q * 9)) % 4) fillPoly(g, V, [[A[0], A[1], z], [B[0], B[1], z], [B[0], B[1], z + 1.2], [A[0], A[1], z + 1.2]], win); }
      u = u1 + 0.6; } });
  }
  if(FUT) fillPoly(g, V, [[-Lh - 3, -Wh - 2.4], [Lh + 3, -Wh - 2.4], [Lh + 3, Wh + 2.4], [-Lh - 3, Wh + 2.4]], night ? shadeHex(Lk.courtOut, -0.3) : Lk.courtOut);
  // stands (4 sides) with a crowd — the futsal hall's are close to the court, the street cage has none
  const st = night ? shadeHex(Lk.stand, -0.2) : Lk.stand, ex = Lh + (FUT ? 4 : 7), ey = Wh + (FUT ? 3.4 : 5);
  if(!CAGE){
  [[[-ex, ey, 0], [ex, ey, 0], [ex, ey + 12, 8], [-ex, ey + 12, 8]], [[-ex, -ey, 0], [ex, -ey, 0], [ex, -ey - 12, 8], [-ex, -ey - 12, 8]],
   [[ex, -ey, 0], [ex, ey, 0], [ex + 12, ey, 8], [ex + 12, -ey, 8]], [[-ex, -ey, 0], [-ex, ey, 0], [-ex - 12, ey, 8], [-ex - 12, -ey, 8]]].forEach(q => fillPoly(g, V, q, st));
  crowd(g, V, Lk, Sz, t, night); }
  // floodlights
  if(Lk.lamps && !CT){ [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const a = V.P(sx * (ex + 6), sy * (ey + 8), 0), b = V.P(sx * (ex + 6), sy * (ey + 8), 18); if(!a || !b) return; g.strokeStyle = '#8A93A8'; g.lineWidth = Math.max(1, V.sc(sx * ex, sy * ey, 9) * 0.35); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    const r = Math.max(6, V.sc(sx * ex, sy * ey, 18) * (night ? 6 : 2.2)), rg = g.createRadialGradient(b[0], b[1], 1, b[0], b[1], r); rg.addColorStop(0, night ? 'rgba(255,250,220,0.95)' : 'rgba(255,255,255,0.9)'); rg.addColorStop(1, 'rgba(255,250,220,0)'); g.fillStyle = rg; g.beginPath(); g.arc(b[0], b[1], r, 0, 7); g.fill(); }); }
  // ad boards with the Playground's game names
  const by = Wh + (FUT ? 1.6 : 2.2), segL = FUT ? 6 : 8;
  if(!CAGE) for(const side of [-1, 1]) for(let x = -Lh - 4, i = 0; x < Lh + 4; x += segL, i++){
    fillPoly(g, V, [[x, side * by, 0], [x + segL - 0.3, side * by, 0], [x + segL - 0.3, side * by, 0.9], [x, side * by, 0.9]], Lk.boards[(i + (side > 0 ? 1 : 0)) % Lk.boards.length]);
    const c = V.P(x + segL / 2, side * by, 0.45); if(c && c[2] < 70){ const s = V.sc(x + segL / 2, side * by, 0.45); if(s > 3 && s < 34){ g.fillStyle = '#fff'; g.font = '700 ' + Math.round(s * 0.55) + 'px Fredoka, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ADS[(i * 3 + (side > 0 ? 1 : 0)) % ADS.length], c[0], c[1]); } }
  }
  // the pitch: stripes, then the lines
  const n = FUT ? 20 : CAGE ? 8 : 12, dx = 2 * Lh / n, floor = FUT ? Lk.court : CAGE ? Lk.cage : Lk.grass;
  if(FUT) for(let i = 0; i < n; i++) fillPoly(g, V, [[-Lh - 0.01, -Wh + i * Wh / 10], [Lh, -Wh + i * Wh / 10], [Lh, -Wh + (i + 1) * Wh / 10], [-Lh - 0.01, -Wh + (i + 1) * Wh / 10]], night ? shadeHex(floor[i % 2], -0.12) : floor[i % 2]);   // 🪵 floor planks along the court
  else for(let i = 0; i < n; i++) fillPoly(g, V, [[-Lh + i * dx, -Wh], [-Lh + (i + 1) * dx, -Wh], [-Lh + (i + 1) * dx, Wh], [-Lh + i * dx, Wh]], night ? shadeHex(floor[i % 2], -0.12) : floor[i % 2]);
  if(Lk.craters && !CT) [[-8, 5, 2.2], [9, -6, 1.6], [14, 7, 1.2], [-15, -8, 1.8]].forEach(([x, y, r]) => { const e = gEll(V, x * Sz.Lh / 21, y * Sz.Wh / 13.5, r); if(e){ g.fillStyle = 'rgba(70,70,90,0.28)'; g.beginPath(); g.ellipse(e[0], e[1], e[2], e[3], 0, 0, 7); g.fill(); } });
  const LK = LOOK_KEYS.find(k => LOOKS[k] === Lk) || 'classic';   // the look's key (also in the setup previews, where there is no G)
  pitchPattern(g, V, Lk, Lh, Wh, FUT ? 'futsal' : CAGE ? 'cage' : PITCH_PATTERN[LK] || 'checks', night);   // 🌱 bo-7b (Aowu 12:41): every stadium has its own mowing pattern, across AND along — depth from every camera
  pitchLogo(g, V, Sz, FUT ? 3 : CAGE ? 1.6 : Sz.boxW * 0.42, night, LK);   // 🏷️ bo-7 (Aowu 12:09): the BlasOff logo on the pitch, in the centre circle
  if(Lk.tint){ g.fillStyle = Lk.tint; g.fillRect(0, 0, W, H); }
  const lw = Math.max(1, Math.min(V.sc(V.look[0], V.look[1], 0) * 0.12, 7));   /* bo-2c: width from the point the camera looks at (the centre spot can be right under the camera) */
  const lines = () => { g.beginPath();
    if(CT){ courtLines(g, V, Sz); g.stroke(); return; }
    polyline(g, V, [[-Lh, -Wh], [Lh, -Wh], [Lh, Wh], [-Lh, Wh], [-Lh, -Wh]]); segW(g, V, [0, -Wh], [0, Wh]); polyline(g, V, arcPts(0, 0, Sz.boxW * 0.42, 0, Math.PI * 2, 40));
    for(const s of [-1, 1]){ const x0 = s * Lh, x1 = s * (Lh - Sz.boxL); polyline(g, V, [[x0, -Sz.boxW], [x1, -Sz.boxW], [x1, Sz.boxW], [x0, Sz.boxW]]); polyline(g, V, [[x0, -Sz.goalW - 1.5], [s * (Lh - 2.2), -Sz.goalW - 1.5], [s * (Lh - 2.2), Sz.goalW + 1.5], [x0, Sz.goalW + 1.5]]);
      polyline(g, V, arcPts(s * (Lh - Sz.spot), 0, Sz.boxW * 0.32, s > 0 ? Math.PI * 0.68 : -Math.PI * 0.32, s > 0 ? Math.PI * 1.32 : Math.PI * 0.32, 14)); }
    for(const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) polyline(g, V, arcPts(sx * Lh, sy * Wh, 0.9, Math.atan2(-sy, 0), Math.atan2(0, -sx), 6));
    g.stroke(); };
  g.lineCap = 'round';
  if(Lk.glow){ g.strokeStyle = Lk.line; g.globalAlpha = 0.25; g.lineWidth = lw * 4; lines(); g.globalAlpha = 1; }
  g.strokeStyle = night ? 'rgba(255,255,255,0.92)' : Lk.line; g.lineWidth = lw; lines();
  if(CAGE) drawFence(g, V, Sz, Lk, night, 'far');
  (FUT ? [[0, 0], [-(Lh - Sz.spot), 0], [Lh - Sz.spot, 0], [-(Lh - 10), 0], [Lh - 10, 0]] : CAGE ? [[0, 0]] : [[0, 0], [-(Lh - Sz.spot), 0], [Lh - Sz.spot, 0]]).forEach(([x, y]) => { const e = gEll(V, x, y, 0.18); if(e){ g.fillStyle = Lk.line; g.beginPath(); g.ellipse(e[0], e[1], e[2], e[3], 0, 0, 7); g.fill(); } });
}
// 🌱 bo-7b: the mowing pattern of each stadium (like real grounds: every one is cut a little differently). The base stripes run ACROSS the pitch;
// each pattern adds a second direction so the depth reads from the back, side and top cameras. Soft overlays only — the lines stay the stars.
const PITCH_PATTERN = {classic: 'checks', jungle: 'argyle', underwater: 'ripples', neon: 'tiles', robot: 'plaid', moon: 'bigchecks', olympus: 'sunburst'};
function clipRectW(pts, Lh, Wh){   // Sutherland–Hodgman: a ground polygon cut to the pitch
  let out = pts; for(const [ax, sg, lim] of [[0, 1, Lh], [0, -1, Lh], [1, 1, Wh], [1, -1, Wh]]){ const inp = out; out = []; if(!inp.length) break;
    for(let i = 0; i < inp.length; i++){ const A = inp[i], B = inp[(i + 1) % inp.length], ina = sg * A[ax] <= lim, inb = sg * B[ax] <= lim;
      if(ina) out.push(A); if(ina !== inb){ const t = (lim * sg - A[ax]) / (B[ax] - A[ax]); out.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, 0]); } } }
  return out;
}
function pitchPattern(g, V, Lk, Lh, Wh, kind, night){
  const k = night ? 0.7 : 1, L = 'rgba(255,255,255,', D = 'rgba(0,0,0,';
  const fillAll = (polys, col) => { g.beginPath(); let n = 0; polys.forEach(pp => { const q = clipPoly(V, pp); if(q.length < 3) return; g.moveTo(q[0][0], q[0][1]); for(let i = 1; i < q.length; i++) g.lineTo(q[i][0], q[i][1]); g.closePath(); n++; }); if(n){ g.fillStyle = col; g.fill(); } };
  const rect = (x0, y0, x1, y1) => [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]];
  const along = (m, a, every) => { const P = []; for(let j = 0; j < m; j++) if(j % 2 === (every || 1) % 2) P.push(rect(-Lh, -Wh + j * 2 * Wh / m, Lh, -Wh + (j + 1) * 2 * Wh / m)); fillAll(P, D + (a * k).toFixed(3) + ')'); };
  const strokeGrid = (step, col, a, both) => { g.save(); g.strokeStyle = col; g.globalAlpha = a * k; g.lineWidth = Math.max(1, V.sc(V.look[0], V.look[1], 0) * 0.03); g.beginPath();
    for(let x = -Lh + step; x < Lh - 0.01; x += step) segW(g, V, [x, -Wh], [x, Wh]); if(both !== false) for(let y = -Wh + step; y < Wh - 0.01; y += step) segW(g, V, [-Lh, y], [Lh, y]); g.stroke(); g.restore(); };
  if(kind === 'checks') along(6, 0.075);   // 🏟️ the classic chessboard cut
  else if(kind === 'bigchecks') along(4, 0.085);   // 🪐 big moon squares
  else if(kind === 'argyle'){   // 🦖 diamonds: two sets of diagonal bands
    for(const d of [1, -1]){ const P = [], w = Wh * 0.5; for(let c = -Lh - Wh * 2; c < Lh + Wh * 2; c += w * 2){ const y0 = -Wh - 1, y1 = Wh + 1; P.push(clipRectW([[c - d * y0, y0, 0], [c + w - d * y0, y0, 0], [c + w - d * y1, y1, 0], [c - d * y1, y1, 0]], Lh, Wh)); } fillAll(P, d > 0 ? L + (0.06 * k).toFixed(3) + ')' : D + (0.06 * k).toFixed(3) + ')'); } }
  else if(kind === 'ripples'){   // 🐙 rings spreading from the centre spot
    const P = [], step = Math.max(2.4, Wh * 0.3), R = Math.hypot(Lh, Wh), N = 40; for(let r = step; r < R; r += step * 2) for(let i = 0; i < N; i++){ const a0 = i * Math.PI * 2 / N, a1 = (i + 1) * Math.PI * 2 / N, r1 = r + step;
      const q = clipRectW([[Math.cos(a0) * r, Math.sin(a0) * r, 0], [Math.cos(a1) * r, Math.sin(a1) * r, 0], [Math.cos(a1) * r1, Math.sin(a1) * r1, 0], [Math.cos(a0) * r1, Math.sin(a0) * r1, 0]], Lh, Wh); if(q.length > 2) P.push(q); }
    fillAll(P, L + (0.1 * k).toFixed(3) + ')'); }
  else if(kind === 'tiles'){ along(8, 0.12); strokeGrid(Math.max(2, Wh / 4), Lk.line, 0.16); }   // 🪩 a dance floor of glowing tiles
  else if(kind === 'plaid'){   // 🤖 circuit plaid: narrow dark bands along + thin light lines both ways
    const P = [], m = 10; for(let j = 1; j < m; j += 2){ const y = -Wh + j * 2 * Wh / m; P.push(rect(-Lh, y - Wh * 0.05, Lh, y + Wh * 0.05)); } fillAll(P, D + (0.1 * k).toFixed(3) + ')'); strokeGrid(Lh / 6, '#FFFFFF', 0.1); }
  else if(kind === 'sunburst'){   // ☁️ golden rays from the centre circle
    const P = [], R = Math.hypot(Lh, Wh) + 2, N = 28; for(let i = 0; i < N; i += 2){ const a0 = i * Math.PI * 2 / N, a1 = (i + 1) * Math.PI * 2 / N; P.push(clipRectW([[0, 0, 0], [Math.cos(a0) * R, Math.sin(a0) * R, 0], [Math.cos(a1) * R, Math.sin(a1) * R, 0]], Lh, Wh)); }
    fillAll(P, L + (0.08 * k).toFixed(3) + ')'); }
  else if(kind === 'futsal') strokeGrid(Math.max(1.6, Lh / 10), '#000000', 0.14, false);   // 🪵 plank joints across the planks
  else if(kind === 'cage') strokeGrid(2, '#FFFFFF', 0.1);   // 🏙️ concrete slabs
}
// 🏷️ bo-7: the BlasOff logo painted flat on the pitch (a 4 × 4 grid of small pictures follows the perspective), facing the camera's main direction
function pitchLogo(g, V, Sz, R, night, lk){
  if(!window.BlasLogo || !V.fv) return; const pic = BlasLogo.pic('main', LOGO_LOOK[lk] ? lk : 'classic', 256, 200); if(!pic || !pic.width) return;
  let fx = V.fv[0], fy = V.fv[1]; if(Math.abs(fx) >= Math.abs(fy)){ fx = Math.sign(fx) || 1; fy = 0; } else { fy = Math.sign(fy); fx = 0; }   // snap: the logo reads from the camera's side
  const rx = fy, ry = -fx, w = R * 1.75, h = w * pic.height / pic.width, N = 4, cw = pic.width / N, ch = pic.height / N, T0 = g.getTransform(), d = T0.a || 1;
  const at = (u, v) => V.P(rx * (u - 0.5) * w + fx * (0.5 - v) * h, ry * (u - 0.5) * w + fy * (0.5 - v) * h, 0);
  g.save(); g.globalAlpha = night ? 0.42 : 0.5;
  for(let i = 0; i < N; i++) for(let j = 0; j < N; j++){ const a = at(i / N, j / N), b = at((i + 1) / N, j / N), c = at(i / N, (j + 1) / N); if(!a || !b || !c) continue;
    g.setTransform(d * (b[0] - a[0]) / cw, d * (b[1] - a[1]) / cw, d * (c[0] - a[0]) / ch, d * (c[1] - a[1]) / ch, d * a[0], d * a[1]);
    g.drawImage(pic, i * cw, j * ch, Math.min(cw + 1, pic.width - i * cw), Math.min(ch + 1, pic.height - j * ch), 0, 0, Math.min(cw + 1, pic.width - i * cw), Math.min(ch + 1, pic.height - j * ch)); }
  g.restore(); g.setTransform(T0);
}
const LOGO_LOOK = {classic: 1, jungle: 1, underwater: 1, neon: 1, robot: 1, moon: 1, olympus: 1};
// 🏟️ futsal: halfway line, 3 m circle, the D-shaped 6 m area round each goal · 🏙️ cage: halfway line + a small circle + a little box
function courtLines(g, V, Sz){
  const Lh = Sz.Lh, Wh = Sz.Wh;
  polyline(g, V, [[-Lh, -Wh], [Lh, -Wh], [Lh, Wh], [-Lh, Wh], [-Lh, -Wh]]); segW(g, V, [0, -Wh], [0, Wh]);
  if(Sz.court === 'cage'){ polyline(g, V, arcPts(0, 0, 1.6, 0, Math.PI * 2, 28)); for(const s of [-1, 1]){ const x0 = s * Lh, x1 = s * (Lh - Sz.boxL); polyline(g, V, [[x0, -Sz.boxW], [x1, -Sz.boxW], [x1, Sz.boxW], [x0, Sz.boxW]]); } return; }
  polyline(g, V, arcPts(0, 0, 3, 0, Math.PI * 2, 36));
  for(const s of [-1, 1]){ const x0 = s * Lh, r = Sz.boxL, gw = Sz.goalW;   // goalW = half the goal mouth: a 6 m quarter circle round each post
    const a = arcPts(x0, -gw, r, s > 0 ? Math.PI : 0, s > 0 ? Math.PI * 1.5 : -Math.PI * 0.5, 12), b = arcPts(x0, gw, r, Math.PI * 0.5, s > 0 ? Math.PI : 0, 12);
    polyline(g, V, a.reverse().concat(b.reverse())); }
  for(const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) polyline(g, V, arcPts(sx * Lh, sy * Wh, 0.25, Math.atan2(-sy, 0), Math.atan2(0, -sx), 4));
}
// 🏙️ the street cage: posts + wire fence (far half first, the near half after the players, see-through)
function drawFence(g, V, Sz, Lk, night, half){
  const Lh = Sz.Lh + 0.15, Wh = Sz.Wh + 0.15, H = 3, col = night ? shadeHex(Lk.fence, -0.3) : Lk.fence, cam = V.eye;
  const sides = [[[-Lh, -Wh], [Lh, -Wh]], [[Lh, -Wh], [Lh, Wh]], [[Lh, Wh], [-Lh, Wh]], [[-Lh, Wh], [-Lh, -Wh]]];
  sides.forEach(([a, b]) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, far = (mx - cam[0]) * mx + (my - cam[1]) * my > 0;   // the camera looks at it from inside
    if((half === 'far') !== far) return;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.round(len / 1.2));
    fillPoly(g, V, [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], 0.5], [a[0], a[1], 0.5]], half === 'far' ? shadeHex(col, -0.45) : 'rgba(40,44,56,0.55)');   // kick board
    g.strokeStyle = col; g.globalAlpha = half === 'far' ? 0.5 : 0.22; g.lineWidth = 1; g.beginPath();
    for(let i = 0; i <= n; i++){ const t = i / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; segW(g, V, [x, y, 0.5], [x, y, H]); }
    for(let j = 1; j <= 4; j++){ const z = 0.5 + (H - 0.5) * j / 4; segW(g, V, [a[0], a[1], z], [b[0], b[1], z]); }
    g.stroke(); g.globalAlpha = 1;
    g.strokeStyle = shadeHex(col, -0.2); g.lineWidth = Math.max(1.5, V.sc(mx, my, 1.5) * 0.08); g.beginPath();
    for(let i = 0; i <= n; i += 2){ const t = i / n; segW(g, V, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0], [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, H]); }
    segW(g, V, [a[0], a[1], H], [b[0], b[1], H]); g.stroke();
  });
}
function shadeHex(h, k){ const n = parseInt(h.slice(1), 16), f = c => Math.max(0, Math.min(255, Math.round(c + (k < 0 ? c * k : (255 - c) * k)))); return '#' + [n >> 16 & 255, n >> 8 & 255, n & 255].map(c => f(c).toString(16).padStart(2, '0')).join(''); }
function crowd(g, V, Lk, Sz, t, night){
  const Lh = Sz.Lh + 6, ey = Sz.Wh + 5, cols = Lk.crowd, emoList = Lk.crowdEmo;
  for(const side of [-1, 1]) for(let r = 0; r < 5; r++){
    const y = side * (ey + 1.4 + r * 2.2), z0 = 0.95 + r * 1.45;
    for(let x = -Lh, i = 0; x <= Lh; x += Sz.Lh > 40 ? 2 : 1.25, i++){
      const wave = Math.max(0, Math.sin(t * 2.6 - x * 0.22 - (side > 0 ? 0 : 2))) * 0.55, c = V.P(x, y, z0 + wave); if(!c) continue;
      const s = V.sc(x, y, z0); if(s < 1.2) continue;
      const h = (i * 7 + r * 13 + (side > 0 ? 5 : 0)) % 17;
      if(emoList && h === 3 && s > 4){ emo(g, emoList[(i + r) % emoList.length], c[0], c[1] - s * 0.3, s * 1.4, 1); continue; }
      g.fillStyle = cols[h % cols.length]; g.fillRect(c[0] - s * 0.32, c[1] - s * 0.55, s * 0.64, s * 0.62);
      g.fillStyle = night ? '#C9A27A' : '#F2C29B'; g.fillRect(c[0] - s * 0.2, c[1] - s * 0.9, s * 0.4, s * 0.36);
    }
  }
  // the stands behind the goals
  const ex = Sz.Lh + 7, Wy = Sz.Wh + 4;
  for(const side of [-1, 1]) for(let r = 0; r < 5; r++){
    const x = side * (ex + 1.4 + r * 2.2), z0 = 0.95 + r * 1.45;
    for(let y = -Wy, i = 0; y <= Wy; y += Sz.Lh > 40 ? 2 : 1.25, i++){
      const wave = Math.max(0, Math.sin(t * 2.6 - y * 0.22 + (side > 0 ? 1 : 3))) * 0.55, c = V.P(x, y, z0 + wave); if(!c) continue;
      const s = V.sc(x, y, z0); if(s < 1.2) continue;
      const h = (i * 11 + r * 7 + (side > 0 ? 3 : 0)) % 17;
      if(emoList && h === 5 && s > 4){ emo(g, emoList[(i + r) % emoList.length], c[0], c[1] - s * 0.3, s * 1.4, 1); continue; }
      g.fillStyle = cols[h % cols.length]; g.fillRect(c[0] - s * 0.32, c[1] - s * 0.55, s * 0.64, s * 0.62);
      g.fillStyle = night ? '#C9A27A' : '#F2C29B'; g.fillRect(c[0] - s * 0.2, c[1] - s * 0.9, s * 0.4, s * 0.36);
    }
  }
}
function drawGoal(g, V, Sz, s, Lk){
  const x = s * Sz.Lh, xb = s * (Sz.Lh + (Sz.cage ? 0.6 : Sz.court ? 1.0 : 1.25)), w = Sz.goalW, h = Sz.goalH;
  g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = Math.max(0.6, V.sc(x, 0, 1) * 0.03); g.beginPath();
  for(let i = 0; i <= 10; i++){ const y = -w + 2 * w * i / 10; segW(g, V, [x, y, h], [xb, y, h * 0.75]); segW(g, V, [xb, y, h * 0.75], [xb, y, 0]); }
  for(let j = 1; j <= 4; j++){ const z = h * 0.75 * j / 5; segW(g, V, [xb, -w, z], [xb, w, z]); }
  for(const sy of [-1, 1]) for(let j = 0; j <= 3; j++){ const z = h * j / 4; segW(g, V, [x, sy * w, z], [xb, sy * w, z * 0.75]); }
  g.stroke();
  g.strokeStyle = Lk.goalCol || '#FFFFFF'; g.lineWidth = Math.max(2, V.sc(x, 0, 1) * 0.12); g.lineCap = 'round'; g.beginPath();
  segW(g, V, [x, -w, 0], [x, -w, h]); segW(g, V, [x, w, 0], [x, w, h]); segW(g, V, [x, -w, h], [x, w, h]); g.stroke();
}
/* 📏 s-bo play#5 → BlasOff_play.html */
function drawSoccerBall(g, x, y, r, spin){
  g.save(); g.translate(x, y); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.clip();
  g.rotate(spin || 0); g.fillStyle = '#1B1F2E';
  const pent = (cx, cy, rr) => { g.beginPath(); for(let i = 0; i < 5; i++){ const a = -Math.PI / 2 + i * Math.PI * 2 / 5; g[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.closePath(); g.fill(); };
  pent(0, 0, r * 0.36); for(let i = 0; i < 5; i++){ const a = -Math.PI / 2 + i * Math.PI * 2 / 5 + Math.PI / 5; pent(Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95, r * 0.3); }
  g.restore(); g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = Math.max(0.8, r * 0.08); g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
  const hl = g.createRadialGradient(x - r * 0.35, y - r * 0.4, 0, x - r * 0.35, y - r * 0.4, r); hl.addColorStop(0, 'rgba(255,255,255,0.5)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = hl; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
}
function drawLookPreview(c, k){
  if(!c) return; const g = c.getContext('2d'), Sz = BO.SIZES[SET.size || 4], W = c.width, H = c.height;
  const Vp = makeView(W, H, {l: 0, r: 0, t: 0, b: 0}, [-Sz.Lh * 0.15 - 12, 0, 11], [Sz.Lh * 0.3, 0, 0], 'behind');
  g.save(); drawWorld(g, Vp, LOOKS[k], Sz, 1.2, k === 'classic' && SET.night); drawGoal(g, Vp, Sz, 1, LOOKS[k]); const b = Vp.P(Sz.Lh * 0.1, 0, 0.2); if(b) drawSoccerBall(g, b[0], b[1], Math.max(3, Vp.sc(0, 0, 0) * 0.3), 0.4); g.restore();
}
/* 📏 s-bo play#6 → BlasOff_play.html */
/* 🎬 bo-5a real actions: the engine's beat (p.act · p.bi · p.bq) → the pose of 🎭 BLOCK blasoff (AvatarActing) at that moment.
   One timeline per act (the engine is the clock, the timeline only gives the pose); pictures cached per (player, act, beat, ¼ step), ≤ 600, oldest out. */
const ACT_RUN = {}, SPR_LRU = [], SPR_CAP = 600, GK_POSE = {gkr0: 'bo.gk-ready', gkr1: 'bo.gk-shuffle', prep: 'bo.trap-open', shield: 'bo.shield', touch: 'bo.dribble-touch', hsnap: 'bo.head-snap', tload: 'bo.trick-load', gkhold: 'bo.gk-hold', tihold: 'bo.ti-hold'};   /* still poses (bo-5a/b) */
function actRun(key){
  if(ACT_RUN[key] !== undefined) return ACT_RUN[key]; let r = null;
  try{ if(window.Acting && Acting.act && Acting.act('blasoff.' + key)) r = Acting.play({name: ''}, 'blasoff.' + key, {t0: 0}); }catch(e){ r = null; }
  return (ACT_RUN[key] = r);
}
/* 📏 s-bo play#7 → BlasOff_play.html */
function pauseGame(){ if(G && !G.paused && !G.over){ G.paused = true; UI.pauseIcon($('pause-btn'), true); } }
/* 📏 s-bo play#8 → BlasOff_play.html */
function backToMenu(){ /* 💬 bo-10 off */ if(window.UI && UI.callout) UI.callout.setup(null); if(G) cancelAnimationFrame(G.raf); G = null; V = null; hideResult(); $('pads').innerHTML = ''; ['goal-line', 'kb-hint', 'shout-kb', 'moment', 'sp-hint'].forEach(id => $(id).classList.add('hidden')); renderMenu(); showScreen('menu'); }
/* 📏 s-bo play#9 → BlasOff_play.html */
document.addEventListener('keydown', e => {
  if(takeKey(e)) return;
  if(!G || $('scr-play').classList.contains('hidden')) return;
  if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].indexOf(e.code) >= 0) e.preventDefault();
  if(e.code === 'Escape' || e.code === 'KeyP'){ if(!e.repeat) togglePause(); return; }
  if(e.code === 'KeyZ' && !keySetsOf(G.M.ctrls[0]).some(K => Object.values(K).includes('KeyZ'))){ if(!e.repeat) toggleZoom(); return; }
  if(e.code === 'KeyV' && !keySetsOf(G.M.ctrls[0]).some(K => Object.values(K).includes('KeyV'))){ if(!e.repeat) cycleView(); return; }
  if(e.repeat) return;
  G.held.add(e.code); $('pads').classList.add('kbd');
  if(G.paused || G.over || G.turnPause) return;
  G.M.ctrls.forEach(c => keySetsOf(c).forEach(K => {
    Object.keys(LOGIC).forEach(a => { if(K[a] === e.code) BO.key(G.M, c.ci, LOGIC[a], true); });
    if(K.sw === e.code) BO.key(G.M, c.ci, 'C', true);
    if(G.M.battle){ const bk = BODY_KEY.find(([d]) => K[d] === e.code); if(bk) BO.key(G.M, c.ci, bk[1], true); }   // 🎮 battle: the move keys = body moves
    if(K.shoutL === e.code) BO.shout(G.M, c.ci, shoutWorld(-1));
    if(K.shoutR === e.code) BO.shout(G.M, c.ci, shoutWorld(1));
  }));
});
/* 📏 s-bo play#10 → BlasOff_play.html */
function confetti(list, count){ for(let i = 0; i < (count || 24); i++){ const e = document.createElement('div'); e.className = 'confetti'; e.textContent = pickOne(list); e.style.left = Math.random() * 100 + 'vw'; e.style.animationDuration = (1.6 + Math.random() * 1.6) + 's'; e.style.animationDelay = (Math.random() * .5) + 's'; document.body.appendChild(e); setTimeout(() => e.remove(), 3800); } }

/* ---------- result + saving ---------- */
function finishMatch(){
  if(G.M.drill){ finishDrill(); return; }
  const M = G.M; G.over = true; ['goal-line', 'kb-hint', 'shout-kb', 'moment', 'sp-hint'].forEach(id => $(id).classList.add('hidden'));
  const secs = Math.max(1, Math.round((performance.now() - G.startAt) / 1000)), win = M.winner, vsRobot = G.mode !== 'duo';
  const mySide = G.humans[0].side, myWin = win === mySide, draw = win < 0, gd = M.score[mySide] - M.score[1 - mySide];
  const pensTxt = M.pens ? ' (pens ' + M.pens.g[0] + '–' + M.pens.g[1] + ')' : '';
  const stars = myWin ? (gd >= 3 ? 3 : gd >= 2 ? 2 : 1) : 0;
  const statsOf = side => { const ps = M.players.filter(p => p.side === side); const sum = k => ps.reduce((a, p) => a + (p.g[k] || 0), 0); return {goals: M.score[side], tricks: sum('tricks'), volleys: sum('volleys'), tackles: sum('tackles'), headers: sum('headers')}; };
  const scoreFor = h => { if(M.battle){ const B = M.battle; return B.hist.reduce((a, r) => a + r.score[h.side] * 100 + r.pts[h.side], 0) + (win === h.side ? 500 : 0); } const p = M.players.find(q => q.name === h.name && q.side === h.side) || {g: {}}, won = win === h.side, d = M.score[h.side] - M.score[1 - h.side];
    return Math.round(((p.g.goals || 0) * 400 + (p.g.assists || 0) * 150 + (p.g.tricks || 0) * 40 + (p.g.volleys || 0) * 120 + (p.g.shoutSaves || 0) * 150 + (p.g.tackles || 0) * 30 + (p.g.nutmegs || 0) * 150 + (p.ctrl >= 0 && M.ctrls[p.ctrl] ? M.ctrls[p.ctrl].perfects * 80 + M.ctrls[p.ctrl].blasts * 120 : 0) + M.score[h.side] * 100 + (won ? 1000 : 0) + Math.max(0, d) * 250) * (M.L.hardcore ? 3 : 1)); };
  if(FX && myWin) confetti(['⚽', '🏆', '⭐', '🚀', '🎉'], 34);
  UISound.play(myWin ? 'success' : draw ? 'pop' : 'error');
  /* 🏁 bo-cover: the shared result card (BlasOffFrame → GF.result) */
  const title = G.mode === 'duo' ? (draw ? 'A draw!' : G.tn[win] + ' win' + pensTxt + '!') : myWin ? 'You beat the ' + G.tn[1 - mySide] + '!' + pensTxt : draw ? 'A draw — so close!' : M.hcLost ? (M.L.hcBy || 3) + ' goals behind — game over' : 'The robots win this time' + pensTxt;
  const me = M.players.find(p => p.name === G.humans[0].name && p.side === mySide) || {g: {}}, myScore = scoreFor(G.humans[0]), cc = me.ctrl >= 0 && M.ctrls[me.ctrl];
  const next = myWin && G.level < 5 && G.mode !== 'duo';   // nextLevel() checks the unlock itself (the save may still be on its way)
  BoFrame.result({win: G.mode === 'duo' || draw ? null : myWin, icon: G.mode === 'duo' ? (draw ? '🤝' : '👑') : myWin ? '🏆' : draw ? '🤝' : M.hcLost ? '💀' : '🤖', title, stars: vsRobot && myWin ? stars : null, score: myScore,
    stats: [['⚽', M.score[0] + ' – ' + M.score[1]], ['🥅', (me.g.goals || 0) + ' goals'], ['🅰️', (me.g.assists || 0) + ' assists'], ['🌀', (me.g.tricks || 0) + ' tricks'], ['🎯', (me.g.volleys || 0) + ' volleys'],
      G.Sz.nokeeper ? ['🥜', (me.g.nutmegs || 0) + ' nutmegs'] : ['📣', (me.g.shoutSaves || 0) + ' shout saves']].concat(cc ? [['⚡', cc.perfects + ' perfect'], ['🔥', cc.blasts + ' blasts']] : []).concat([['⏱', fmt(secs)]]),
    tip: myWin ? '' : pickOne(COACH), save: G.humans.some(h => h.name !== 'Guest') ? 'Saving…' : null, next: next ? () => nextLevel() : null});
  if(G.cup) cupAfterMatch(M, mySide);
  if(G.tale) taleAfter(myWin, 0);   // 📜 R4b   // 🏆 R4a: record it, play out the round, the card gets "🏆 Back to the cup"
  NOTES.length = 0;
  G.humans.forEach((h, seat) => {
    if(h.name === 'Guest') return;
    const p = M.players.find(q => q.name === h.name && q.side === h.side) || {g: {}}, won = win === h.side, conceded = M.score[1 - h.side];
    const stats = {matches: 1, wins: won ? 1 : 0, goals: p.g.goals || 0, assists: p.g.assists || 0, tricks: p.g.tricks || 0, volleys: p.g.volleys || 0, tackles: p.g.tackles || 0, shoutSaves: p.g.shoutSaves || 0, headers: p.g.headers || 0, nutmegs: p.g.nutmegs || 0, perfects: p.ctrl >= 0 && M.ctrls[p.ctrl] ? M.ctrls[p.ctrl].perfects : 0, blasts: p.ctrl >= 0 && M.ctrls[p.ctrl] ? M.ctrls[p.ctrl].blasts : 0, cleanSheets: conceded === 0 && (won || win < 0) ? 1 : 0, bestGoals: p.g.goals || 0};
    if(G.cup && seat === 0){ const T = G.cup.T; stats[T.kind + 'Plays'] = 1; if(T.done && T.teams[T.champ] && T.teams[T.champ].me) stats[{cup: 'cups', league: 'leagues', family: 'familyCups'}[T.kind]] = 1; }   // 🏆 R4c
    if(G.kind === 'party') stats.win_party = won ? 1 : 0; else if(G.kind === 'shootout') stats.win_pens = won ? 1 : 0; else if(G.kind === 'battle') stats.win_battle = won ? 1 : 0; else stats['win_' + G.size + 'v' + G.size] = won ? 1 : 0;
    if(vsRobot) saveWin(h.name, G.level, {score: scoreFor(h), stars: won ? (h.side === mySide ? stars : 1) : 0, cleared: won, timeSec: secs, theme: (G.kind === 'party' ? 'Party ball' : G.kind === 'shootout' ? 'Penalty shootout' : G.kind === 'battle' ? 'Tricks Battle' : SZ_NAME[G.size]) + ' · ' + LOOKS[G.theme].name, stats}, seat);
    else saveFeatsOnly(h.name, stats, seat);
  });
}
// 🎯 a skill challenge ends: ⭐ by score (or time on the cones), best kept per drill + level on this device, feats to the server
function finishDrill(){
  const M = G.M, d = M.drill, D = BO.DRILLS[d.id], st = d.stars || 0; G.over = true; ['goal-line', 'kb-hint', 'shout-kb', 'moment', 'sp-hint'].forEach(id => $(id).classList.add('hidden'));
  const old = drillBest(d.id, G.level), better = !old || st > old.stars || (st === old.stars && (D.time ? d.time != null && (!old.time || d.time < old.time) : d.score > (old.score || 0)));
  if(better) try{ localStorage.setItem(store('drill:' + d.id + ':' + G.level), JSON.stringify({stars: st, score: d.score, time: d.time || 0})); }catch(e){}
  if(FX && st) confetti(['⭐', '🎯', '✨'], 12 + st * 8); UISound.play(st ? 'success' : 'error');
  const val = D.time ? (d.time != null ? d.time + ' s' : '⏱ out of time') : d.score + (D.balls ? ' / ' + D.balls : '');
  /* 🏁 bo-cover: the shared result card */
  BoFrame.result({win: st > 0, icon: st === 3 ? '🏆' : st ? '🎯' : '💪', title: D.name + (st === 3 ? ' — perfect!' : st ? ' — well done!' : ' — try again!'), stars: st, best: better && st && old ? 'New best!' : null,
    stats: [['🎯', val], old && !(better && st) ? ['🏅', 'best ' + '⭐'.repeat(old.stars) + (old.time ? ' · ' + old.time + ' s' : '')] : ['🆕', old ? 'new best' : 'first try'], D.time ? ['⭐', BO.CONE_STARS[G.level].join(' / ') + ' s'] : ['⭐', D.stars.join(' / ')]],
    extra: [{text: '🎯 Other challenge', id: 'btn-drills', fn: () => { hideResult(); if(G) cancelAnimationFrame(G.raf); G = null; openSetup(SET.level); }}]});
  NOTES.length = 0;
  if(G.tale) taleAfter(st >= (G.tale.st.need || 1), st);   // 📜 R4b
  if(S.player !== 'Guest') saveFeatsOnly(S.player, {skills: 1, skillStars: better && old ? Math.max(0, st - old.stars) : better ? st : 0, juggles: d.id === 'juggle' ? d.score : 0}, 0);
}
function nextLevel(){ const n = Math.min(5, G ? G.level + 1 : SET.level + 1); if(!canPlay(n)){ backToMenu(); return; } hideResult(); if(G) cancelAnimationFrame(G.raf); G = null; openSetup(n); }
const PENDING_KEY = 'sp_blasoff_pending';
const NOTES = [];
function readPending(){ try{ return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); }catch(e){ return []; } }
function writePending(list){ try{ localStorage.setItem(PENDING_KEY, JSON.stringify(list.slice(-20))); }catch(e){} }
function flushPending(){ const list = readPending(); if(!list.length) return; writePending([]); list.forEach(w => { const r = google.script.run.withFailureHandler(() => writePending(readPending().concat([w]))); if(w.feats) r.saveFeats(w.name, GAME_ID, w.stats); else r.saveLevelResult(GAME_ID, w.name, w.lvl, w.extra); }); }
function putNote(i, html){ NOTES[i] = html; const n = $('save-note'); if(n) n.innerHTML = NOTES.filter(Boolean).join('<br>'); }
function saveWin(name, lvlIdx, extra, seat, tries){
  tries = tries || 0; const p = S.progress[name] || (S.progress[name] = {unlocked: 0, tokens: [], best: []});
  const who = G && G.humans.length > 1 ? UI.esc(name) + ': ' : '';
  google.script.run.withSuccessHandler(res => {
      const best = (p.best || []).slice(); if(res.best) best[lvlIdx] = res.best;
      S.progress[name] = {unlocked: res.unlocked, tokens: res.tokens, best}; flushPending(); putNote(seat, who + saveText(res, extra.cleared));
      if(G && G.over){ const nb = $('btn-next'); if(nb && !canPlay(Math.min(5, lvlIdx + 1))) nb.remove(); }
    }).withFailureHandler(() => {
      if(tries < 1){ setTimeout(() => saveWin(name, lvlIdx, extra, seat, tries + 1), 1200); return; }
      writePending(readPending().concat([{name, lvl: lvlIdx, extra}])); putNote(seat, who + '⚠️ Could not save yet — it will be sent again next time.');
    }).saveLevelResult(GAME_ID, name, lvlIdx, extra);
}
function saveFeatsOnly(name, stats, seat){
  const who = UI.esc(name) + ': ';
  google.script.run.withSuccessHandler(res => putNote(seat, who + featText(res, '✅ Feats saved')))
    .withFailureHandler(() => { writePending(readPending().concat([{name, feats: true, stats}])); putNote(seat, who + '⚠️ Will be sent next time.'); }).saveFeats(name, GAME_ID, stats);
}
function featText(fe, base){ let h = base || ''; if(fe){ (fe.newTitles || []).forEach(t => { h += '<br><span class="title-new">🏷️ New title: ' + t.icon + ' ' + UI.esc(t.name) + '</span>'; }); (fe.newBadges || []).forEach(b => { h += '<br><span class="feat-new">' + b.medal + ' ' + b.icon + ' ' + UI.esc(b.name) + ' · ' + b.tierName + '</span>'; }); } return h; }
function saveText(res, cleared){
  const h = res.newBadge ? '<span class="new-badge">🏅 New badge: ' + UI.esc(res.newBadge) + '</span>' : res.newHighScore && !res.firstTime ? '🎉 New high score!' : cleared ? (res.best && res.best.score ? 'Best: 🏆 ' + Number(res.best.score).toLocaleString() : '✅ Saved') : '✅ Feats saved — win to unlock the next level';
  return featText(res.feats, h);
}
function showResult(html){ /* 💬 bo-10 result */ if(window.UI && UI.callout) UI.callout.setup(null); const bk = G && BADGE_OF[G.kind === 'match' ? SZ_ID[G.size] : G.kind]; $('result-card').innerHTML = (bk ? logoImg(bk, 46, 'bo-rbadge', '') : '') + html; $('result').classList.remove('hidden'); }
function hideResult(){ $('result').classList.add('hidden'); }
function sessionQuery(){ let q = ''; if(S.player || CURRENT_PLAYER) q += '&player=' + encodeURIComponent(S.player || CURRENT_PLAYER); if(SESSION_START) q += '&sessionStart=' + SESSION_START; if(DURATION_MIN) q += '&durationMin=' + DURATION_MIN; return q; }
function goGameroom(){ UI.back(WEBAPP_URL + '?page=gameroom' + sessionQuery(), 'rooms'); }
window.feedbackContext = () => ({page: 'BlasOff', game: GAME_ID, level: G ? G.level : SET.level});

/* 💥📣 ROOM FOR COMICS + THE CROWD (bo-1) — the 💥 Comics chat / 📣 Cheer chat wire their kits here; this game draws no comics / crowd itself.
   GameComic.mode()        → 'fours' (4v4) | 'sevens' (7v7) | ''  (the live match)
   GameComic.hold(on)      → quietly freeze / unfreeze the match (no pause card; drawing goes on)
   GameComic.listen(fn)    → fn(mode, event, M) for every engine event (BO.takeEvents → handleEvents) — names in plan §19:
                             kickoff · pass {by, to, kind ground|long|heel|nolook} · shot {by, kind shot|chip|rabona|bicycle|header, power, volley} · trick {by, name, label} · trickfail ·
                             tackle {by, from, ok, slide, dodged} · slide · header · lift · volley · jump · dive {by keeper, side, dir, shout, right} · shout {side, s} · save {by, side, kind catch|parry, shout, right, shoutSave} ·
                             post {bar} · goal {side, by, assist, own, kind, score, golden} · foul · card · offside · throwin · corner · goalkick · free · claim · win · control · switch · call ·
                             half {score} · goldengoal · pens · pen {side, scored, g} · pengoal · penmiss · end {winner, score, pens, hcLost}
   GameComic.log()         → this match's events [{t, k, …}] (last 600) — strips come from what really happened
   GameComic.area()        → the play-area element (#stage) · GameComic.free() → the parts of the stage with no controls / bar (for side strips / the crowd)
   GameComic.view()        → the live camera: {P(x, y, z) → [px, py], sc(x, y, z), mode} — to draw on the pitch (fans sit on the stands: y = ±(Wh + 6 … 16), z 1 … 8)
   slots: #comics-slot-setup, #cheer-slot-setup (setup ⚙️ Extras row) · #comic-strip-slot (result card) */
const GameComic = {
  _fns: [], _log: [],
  mode(){ return G && !G.over ? (G.kind !== 'match' ? G.kind : SZ_ID[G.size]) : ''; },
  hold(on){ if(!G || G.over) return false; G.hold = !!on; if(!on) G.last = performance.now(); return true; },
  listen(fn){ this._fns.push(fn); return () => { this._fns = this._fns.filter(f => f !== fn); }; },
  log(){ return this._log.slice(); },
  area(){ return $('stage'); },
  context(){ return G ? {cup: G.cup ? {kind: G.cup.T.kind, round: cupRoundName(G.cup.T), opp: G.cup.opp.name, captain: G.captain} : null, tale: G.tale ? {chapter: G.tale.ch.id, n: G.tale.ci + 1, step: G.tale.st.title, coach: G.tale.ch.coach} : null, kit: SET.kit || 'classic'} : null; },   // 🏆 📜 R4d: which cup round / story step this match is
  view(){ return V ? {P: V.P, sc: V.sc, mode: G && G.view.mode} : null; },
  free(){ const st = $('stage').getBoundingClientRect(), taken = [...document.querySelectorAll('#pads .stick, #pads .btnpad, #pads .swbtn, #pads .bodypad')].map(e => e.getBoundingClientRect()).filter(r => r.width);
    const rows = [{left: st.left, top: st.top, right: st.right, bottom: st.top + st.height * 0.3}]; return rows.map(r => { taken.forEach(t => { if(t.top < r.bottom && t.bottom > r.top && t.left < r.right && t.right > r.left){ if(t.left - r.left > r.right - t.right) r.right = t.left - 4; else r.left = t.right + 4; } }); return {left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.right - r.left), height: Math.round(r.bottom - r.top)}; }).filter(r => r.width >= 60 && r.height >= 40); },
  _reset(){ this._log = []; },
  _feed(list){ if(!list || !list.length || !G) return; const M = G.M, md = SZ_ID[G.size]; list.forEach(e => { this._log.push(e); this._fns.forEach(f => { try{ f(md, e, M); }catch(err){} }); }); if(this._log.length > 600) this._log.splice(0, this._log.length - 600); }
};
window.GameComic = GameComic;

/* ================= BOOT ================= */
function boot(){
  UI.loading('blasoff');
  google.script.run.withSuccessHandler(d => {
      UI.loaded();
      S.players = d.players || []; S.progress = d.progress || {}; S.settings = d.settings || {}; S.avatars = d.avatars || {}; S.ballSkins = d.ballSkins || {};
      UISound.applySettings(S.settings);
      const lockOn = !(S.settings.ScreenTimeLockEnabled === 'FALSE' || S.settings.ScreenTimeLockEnabled === false);
      lockHandle = UI.screenTimeLock({sessionStart: SESSION_START, durationMin: DURATION_MIN, enabled: lockOn, homeUrl: WEBAPP_URL + '?page=home', onLock: pauseGame});
      flushPending();
      if(CURRENT_PLAYER && S.players.some(p => p.Name === CURRENT_PLAYER)) choosePlayer(CURRENT_PLAYER); else { renderPlayers(); showScreen('player'); }
    }).withFailureHandler(() => { UI.loaded(); UI.toast('Could not load players — check the connection', 'err'); renderPlayers(); showScreen('player'); })
    .getLevelGameData(GAME_ID, CURRENT_PLAYER);
}
boot();
/* ✨ MODE SPOTLIGHT: ?mode=<id> opens this game straight in that mode after the player pick · "✨ Also try" on the start page · started modes → UI.modeTried */
const MS_GAME = 'blasoff';
function msOpen(id){ if(!ID_SZ[id] && !KINDS.includes(id)) return; setKind(id); savePrefs(); markModes(); renderLevels(); const b = document.querySelector('#mode-list .ui-mbtn.on'); if(b && b.scrollIntoView) b.scrollIntoView({block: 'nearest'}); }
function msNow(){ return modeId(); }
function msWrap(fn, idOf){ const f = window[fn]; if(typeof f !== 'function') return; window[fn] = function(){ try{ const id = idOf.apply(this, arguments); if(id && UI.modeTried) UI.modeTried(S.player || CURRENT_PLAYER, MS_GAME, id); }catch(e){} return f.apply(this, arguments); }; }
function msAfter(fn, after){ const f = window[fn]; if(typeof f !== 'function') return; window[fn] = function(){ const r = f.apply(this, arguments); try{ after.apply(this, arguments); }catch(e){} return r; }; }
msWrap('startMatch', () => TALERUN && TALERUN.armed ? 'tale' : modeId());   // 📜 a story step counts as Kick Tale
msAfter('choosePlayer', name => {
  if(!window.UI || !UI.modeLink) return;
  const id = UI.modeLink(MODE_LINK); if(id) msOpen(id);
  UI.alsoTry({game: MS_GAME, player: name, current: msNow, at: () => document.querySelector('#scr-menu .title'), open: msOpen});
});
/* ✨ END MODE SPOTLIGHT */
