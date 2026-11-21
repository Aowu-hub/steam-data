
const WEBAPP_URL = SP_TV[0];
const CURRENT_PLAYER = SP_TV[1]; window.SP_PAGE = SP_TV[2];
const MODE_LINK = SP_TV[3];   // ✨ ?mode=<id> (Code.gs MODES_) — opened once, after the player pick
UI.applyTheme(UI.cachedTheme(CURRENT_PLAYER), {kitOnly: true});
const SESSION_START = Number(SP_TV[4]) || null;
const DURATION_MIN = Number(SP_TV[5]) || null;
const GAME_ID = 'pyraspike';   // 🏐 PyraSpike board (R2 adds 'pyrastrike', R3 'pyraspark' on this same page)
// UiKit lists (loader + ❓ card) are registered here, so UiKit itself is not touched (polish lane)
if(UI.KINDS){ UI.KINDS.pyraspike = UI.KINDS.pyraspike || ['🔥', 'Lighting the Pyra flame', 'bump']; UI.KINDS.pyradive = UI.KINDS.pyradive || UI.KINDS.pyraspike; }
if(UI.GAME_HELP && !UI.GAME_HELP.pyraspike) UI.GAME_HELP.pyraspike = ['Volleyball with your avatar! Each side gets 3 touches: 🤚 bump it up, 🪶 set it high, 💥 dunk it over the net. The ball landing in their court = your point.',
  'W A S D move · J 🤚 touch · K 💥 drive / dunk (hold on a serve) · L 🪶 dink · Space ⬆️ jump / block · Shift 🤸 dive · F 🔥 Pyra. On a tablet: the stick + the round buttons.',
  '🦶 PyraStrike = sepak takraw (ตะกร้อ): feet, knees and head only — 🦵 Trap (J), 🙆 head set, 💥 roll strike / 🚲 bicycle (K), 🦶 heel tip (L). One player may use all 3 touches. Serve: your buddy tosses, you kick.',
  '⚡ PyraSpark = a net-TABLE game: let it bounce ONCE on your half (twice on 🌱 Basic), then up to 3 touches — 🦵 Trap (J), ⚡ Drive / smash (K), 🪶 Dink (L), 💥 Edge = L + K together. Duo: pass to your partner before it goes back (🐣 Junior up). 2 serve tries; the serve changes every 4 points.',
  '🔥🔥×2 / ×3: when 2 or 3 players of a team have a FULL flame, one tap of 🔥 arms them TOGETHER — a Spirit Duo Dive (Dunk, Dink or Block) or a Spirit Trio Dive (dig → set → spike Combo = the point counts double, or a Block). 📖 Every creature you call goes into your Spirit Bestiary.',
  '🔥🔥 A FULL flame + 🔥 = a SPIRIT DIVE: your next Dunk, Dink, Serve, Block or Save calls a creature (🐉 Dragon, 🦁 Singha, 🗿 Golem, 🐘 Gajasiha, 🐦‍🔥 Phoenix, 🦢 Hongsa, 🦊 Kitsune, 🧚 Kinnaree, 🐍 Naga, 🐊 Makara) — almost nobody can stop it.',
  'Serve 3 ways: 💥 K = float serve (hold for power) · ⬆️ Space = 🦘 jump serve (fast + steep) · 🪶 L = 🤏 pinch serve (drops just over the net).',
  'Good touches fill your 🔥 flame. Half full → tap 🔥 and your next move is a Pyra… move!'];
const HELP_R4 = ['🎯 Training: 🎯 Zone Hits (the 🧑‍🏫 Coach feeds you — hit the glowing zone) · 🔗 Body Combo (Trap → Pop → ⚡ Smash = 5) · 🏃 Rally Run (the Coach sends everything back, faster and faster) · 🤹 Juggle (keepy-up alone — switch foot · knee · head for bonus).',
  '🌀 Spark Party: a bouncy ball + 2–3 extra balls on the table at once — every ball you send back onto their half counts!',
  '🏆 Cups: Cup of 4 · Cup of 8 · 👑 Family Cup (family members captain the other teams) — knock-out, lose once and you are out; pick the sport in the setup. ⭐ In the 📖 Spirit Bestiary, pin a favourite creature per move — from 🔥 Intermediate it comes every time.'];
if(UI.GAME_HELP && UI.GAME_HELP.pyraspike && !UI.GAME_HELP.pyraspike.some(l => String(l).indexOf('🎯 Training') === 0)) UI.GAME_HELP.pyraspike.push(...HELP_R4);   // pd-4a (UiKit lane: same lines)
const BAR = UI.gameBar(document.getElementById('gbar'), {game: GAME_ID, icon: '🔥', name: 'PyraDive', levelId: 'hud-level',
  levels: () => leavePlay(), playing: () => !!(G && !G.over), onLeave: () => { stopLoop(); },
  pause: {pause: () => setPaused(true), resume: () => setPaused(false)}, pauseButton: true,
  scoreMin: '4ch', fold: 'short', onFit: () => { if(G) resize(); }});   /* 📱 pd-10: a phone on its side folds ◀ · Levels · 🏠 into ◀▾ → score in the same row, one bar row */
var NAV_INNER = {setup: ['◀ PyraDive', () => showScreen('menu')]};
UI.navBar(document.getElementById('back-btn'), {onclick: false});
const $ = id => document.getElementById(id);
let FX = 1;   // the harness sets 0 (no big words / confetti / shake)
function pdPick(a){ return a[Math.floor(Math.random() * a.length)]; }
function isTouch(){ return (navigator.maxTouchPoints || 0) > 0 || 'ontouchstart' in window && matchMedia('(pointer:coarse)').matches; }

/* ================= DATA ================= */
const LEVEL_UI = [
  {emoji: '🌱', blurb: 'The ball waits for you — press the glowing button. First to 7.'},
  {emoji: '🐣', blurb: 'A bit faster. Hints for your first touches, then you\'re on your own.'},
  {emoji: '🔥', blurb: 'Normal speed. Touching the net, a double touch or a 4th touch = their point.'},
  {emoji: '⚡', blurb: 'Roles rotate after every side-out. Robots block now. First to 21.'},
  {emoji: '🌋', blurb: 'Fast ball, no aim help. Best of 3 sets.'},
  {emoji: '💀', blurb: 'Fastest ball, sharpest robots, best of 3 sets. ×3 points.', hardcore: true}
];
const AGE_START = {'4-5': 0, '6-7': 0, '8-9': 1, '10+': 2};
/* 🗂️ MODE GROUPS (mg-1) — fixed order; R2 adds 🦶 PyraStrike, R3 ⚡ PyraSpark, R4 🎯 Training · 🎪 Fun · 🏆 Cups */
const MODE_GROUPS = [{k: 'spike', icon: '🏐', en: 'PyraSpike', th: 'วอลเลย์บอล', c: '#FF6B1A'}, {k: 'strike', icon: '🦶', en: 'PyraStrike', th: 'ตะกร้อ', c: '#2FBF71'}, {k: 'spark', icon: '⚡', en: 'PyraSpark', th: 'บอลข้ามโต๊ะ', c: '#2F7BEA'}, {k: 'train', icon: '🎯', en: 'Training + Cups', th: 'ฝึกซ้อม + ถ้วย', c: '#9B5DE5'}];   // pd-4b: 🌀 Spark Party sits in ⚡ PyraSpark, 🏆 Cups with 🎯 Training (two rows of boxes on phones)   // pd-4a: 🎯 Training + 🎪 Fun · pd-4b: + 🏆 cups in the same box   // pd-3a: ⚡ PyraSpark   // pd-2b: one box per sport (R3 adds ⚡ PyraSpark)   // R1: two 🏐 PyraSpike boxes by court type; R2 folds them into one 🏐 PyraSpike box next to 🦶 PyraStrike
const MODE_CARDS = {
  beach: {type: 'A beach volleyball game', sub: '2 a side on the sand · you dunk, your buddy sets'},
  small: {type: 'A small-court volleyball game', sub: '3 a side · one 🚀 Driver, one 🪶 Dinker, one 💥 Dunker'},
  full: {type: 'A full volleyball game', sub: '6 a side in the big arena · front row blocks'},
  strikesolo: {type: 'A sepak takraw game (feet only!)', sub: '1 a side · trap, head it up, strike it — all yourself'},
  strikeduo: {type: 'A 2-a-side sepak takraw game', sub: 'Kick, knee, head — never hands · roll strike over the low net'},
  strikeregu: {type: 'A team (regu) sepak takraw game', sub: '3 a side · 🚀 kicker, 🪶 feeder, 💥 striker · bicycle kicks!'},
  hoop: {type: 'Hoop takraw (ตะกร้อลอดห่วง)', sub: 'Keep it up in a circle — kick it THROUGH the hanging hoop · heel + bicycle score most'},
  sparksolo: {type: 'A net-table game, 1 against 1', sub: 'Let it bounce once on your half · trap, pop, send it back · 💥 EDGE balls count'},
  sparkduo: {type: 'A net-table game, 2 against 2', sub: 'Pass to your partner before it goes back over · no hands, ever'},
  zonehits: {type: 'A training drill on the ⚡ table', sub: 'The 🧑‍🏫 Coach feeds you — hit the glowing zone for 3 points'},
  combo: {type: 'A training drill: Trap → Pop → Smash', sub: 'Use all 3 touches and finish with a ⚡ smash = 5 points'},
  rallyrun: {type: 'A training drill: the long rally', sub: 'The 🧑‍🏫 Coach sends everything back — faster and faster'},
  juggle: {type: 'A training drill: keepy-up', sub: 'Keep it up alone — switch foot, knee, head for bonus points'},
  party: {type: 'A fun mode: Spark Party', sub: 'A bouncy ball + extra balls at once — send them ALL back!'}
};
window.MODE_TYPE = {}; for(const k in MODE_CARDS) window.MODE_TYPE[k] = MODE_CARDS[k].type;
function groupOf(m){ return m.drill ? 'train' : m.party ? 'spark' : m.sport === 'hoop' ? 'strike' : m.sport; }
/* 🏆 pd-4b CUPS: a knock-out bracket around normal matches (one set each). The cup is picked like a mode (SET.cup), the sport inside it in the setup (SET.cupSport). */
const CUPS = {
  cupfour: {k: 'cupfour', icon: '🏆', name: 'Cup of 4', n: 4, type: 'A knock-out cup — 4 teams', sub: 'Win the semi-final and the final to lift the 🏆'},
  cupeight: {k: 'cupeight', icon: '🎖️', name: 'Cup of 8', n: 8, type: 'A knock-out cup — 8 teams', sub: 'Quarter-final → semi-final → final'},
  familycup: {k: 'familycup', icon: '👑', name: 'Family Cup', n: 4, family: true, type: 'A cup against your family', sub: 'Family members captain the other teams — win it to be 👑 Captain Flame'}
};
const CUP_ORDER = ['cupfour', 'cupeight', 'familycup'], CUP_SPORTS = ['beach', 'strikesolo', 'sparksolo'];
const CUP_TEAMS = [['🔥', 'Blaze'], ['🌊', 'Waves'], ['⚡', 'Volts'], ['🌪️', 'Twisters'], ['🐯', 'Tigers'], ['❄️', 'Frost'], ['🌋', 'Lava'], ['🦅', 'Hawks'], ['🐙', 'Squids'], ['🌵', 'Cactus']];
const CUP_ROUND = {1: 'Final', 2: 'Semi-final', 4: 'Quarter-final'}, CUP_TARGET = [7, 9, 11, 11, 11, 11];
const CUP_CARD = {k: 'cups', icon: '🏆', name: 'Cups', type: 'Knock-out cups', sub: 'Cup of 4 · Cup of 8 · 👑 Family Cup — lose once and you are out'};   // ONE card (the phone menu must fit); the cup kind is picked in the setup
function curMode(){ return SET.cup ? 'cups' : SET.mode; }
function modeInfo(k){ return k === 'cups' ? CUP_CARD : PD.MODES[k] || CUPS[k] || null; }
function pickMode(k){ if(k === 'cups') SET.cup = CUPS[SET.cupKind] ? SET.cupKind : 'cupfour'; else if(CUPS[k]){ SET.cup = k; SET.cupKind = k; } else if(PD.MODES[k]){ SET.cup = ''; SET.mode = k; } savePrefs(); markModes(); renderLevels(); }   // the level cards show the mode's own goal (⏱️ / ❤️ / ⭐ / cup)
function mgList(){ return PD.MODE_ORDER.map(k => ({k, g: groupOf(PD.MODES[k]), icon: PD.MODES[k].icon, name: PD.MODES[k].name, type: MODE_CARDS[k].type, sub: MODE_CARDS[k].sub, next: '👇 then pick a level'})).concat([{k: 'cups', g: 'train', icon: CUP_CARD.icon, name: CUP_CARD.name, type: CUP_CARD.type, sub: CUP_CARD.sub, next: '👇 then pick a level'}]); }
/* 🗂️ END MODE GROUPS */
/* 🏷️ PyraLogo (pd-7): the PyraDive logo + 🏐 Spike · 🦶 Strike · ⚡ Spark badges, drawn in code (Aowu 2026-11-15) */
/* 🔥 PyraLogo (pd-7 draft) — the PyraDive logo + the 3 sport badges, drawn in code (no picture files).
   PyraLogo.pic(kind, arena, px) → cached canvas · PyraLogo.url(kind, arena, px) → data URL for <img> · PyraLogo.draw(g, kind, x, y, px, arena)
   kind: 'main' | 'wide' (title-row wordmark) | 'spike' | 'strike' | 'spark' · arena: PyraDive arena key (recolours glow + rim), unknown → classic. */
const PyraLogo = (() => {
  const SPORT = {
    spike: {name: 'Spike', ac: '#FF6A1A', ball: 'volley', court: 'net'},
    strike: {name: 'Strike', ac: '#FFC21A', ball: 'takraw', court: 'net'},
    spark: {name: 'Spark', ac: '#3CC8FF', ball: 'spark', court: 'table'}
  };
  const THEME = {   // glow · rim (2 metal stops) · back (centre, edge) · fire (tip, mid, base)
    classic: {glow: '#FF7A1A', rim: ['#FFE08A', '#B8741E'], back: ['#2A1208', '#07040A'], fire: ['#FFF3A0', '#FF8A1E', '#C2180A']},
    fair:    {glow: '#FFB347', rim: ['#FFE7B0', '#9C5A2A'], back: ['#3A1A30', '#120612'], fire: ['#FFF3A0', '#FF9A3C', '#B8301A']},
    jungle:  {glow: '#9BE15D', rim: ['#F6E7A0', '#7A6A2A'], back: ['#1E2A10', '#070A04'], fire: ['#FFF3A0', '#FF9A2A', '#C2380A']},
    coral:   {glow: '#3BE0D0', rim: ['#E8FBFF', '#3A8AA0'], back: ['#06324A', '#020C14'], fire: ['#E8FFFF', '#3BE0D0', '#E9707A']},
    neon:    {glow: '#FF2BD6', rim: ['#B8F3FF', '#3C5CFF'], back: ['#1A0A3C', '#05020E'], fire: ['#FFFFFF', '#3CF2FF', '#FF2BD6']},
    robot:   {glow: '#FFD23F', rim: ['#E6ECF2', '#5A6676'], back: ['#232B36', '#0A0D12'], fire: ['#FFF7C0', '#FFD23F', '#E0601A']},
    moon:    {glow: '#B8C6FF', rim: ['#FFFFFF', '#7A7C90'], back: ['#151933', '#010208'], fire: ['#FFFFFF', '#B8C6FF', '#5B4EFF']},
    olympus: {glow: '#FFC94A', rim: ['#FFF4C8', '#C9962A'], back: ['#2C5A8C', '#0E2440'], fire: ['#FFFFFF', '#FFD86A', '#E08A1A']}
  };
  const FONT = (w, px) => w + ' ' + px + 'px Fredoka, Nunito, "Arial Rounded MT Bold", sans-serif';
  const cache = {}; let SC = 1;   // SC = current scale (shadow blur is not scaled by the canvas transform)
  const lin = (g, x0, y0, x1, y1, st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((c, i) => q.addColorStop(i / (st.length - 1), c)); return q; };
  const rad = (g, x, y, r, st) => { const q = g.createRadialGradient(x, y - r * 0.35, r * 0.05, x, y, r); st.forEach((c, i) => q.addColorStop(i / (st.length - 1), c)); return q; };

  function shield(g){   // unit shield: 200 wide, 240 tall, centre (0,0)
    g.beginPath(); g.moveTo(-100, -104); g.lineTo(-28, -104); g.quadraticCurveTo(0, -122, 28, -104); g.lineTo(100, -104);
    g.lineTo(100, 4); g.quadraticCurveTo(96, 80, 0, 120); g.quadraticCurveTo(-96, 80, -100, 4); g.closePath();
  }
  function flames(g, T, y0, w, h, n, seed){   // a row of flame tongues standing on y0
    g.fillStyle = lin(g, 0, y0 - h, 0, y0, [T.fire[0], T.fire[1], T.fire[2]]);
    g.beginPath(); g.moveTo(-w / 2, y0);
    for(let i = 0; i < n; i++){
      const a = -w / 2 + w * i / n, b = a + w / n, m = (a + b) / 2, hh = h * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7 + seed))), lean = (i % 2 ? 1 : -1) * w / n * 0.35;
      g.quadraticCurveTo(a, y0 - hh * 0.5, m + lean, y0 - hh); g.quadraticCurveTo(b, y0 - hh * 0.45, b, y0);
    }
    g.closePath(); g.fill();
  }
  function rays(g, T, r, n){ g.save(); g.globalAlpha = 0.13; g.fillStyle = T.glow; for(let i = 0; i < n; i++){ const a = i * Math.PI * 2 / n; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, a, a + Math.PI / n * 0.5); g.closePath(); g.fill(); } g.restore(); }
  function trail(g, T, x, y, r){   // fire trail behind a flying ball (up-left)
    g.save(); g.translate(x, y); g.rotate(-2.4);
    [[2.6, 1, T.fire[2]], [2.1, 0.78, T.fire[1]], [1.5, 0.5, T.fire[0]]].forEach(([L, W, c]) => {
      g.fillStyle = c; g.beginPath(); g.moveTo(0, -r * W);
      g.quadraticCurveTo(r * L * 0.5, -r * W * 1.2, r * L, -r * 0.2); g.quadraticCurveTo(r * L * 0.7, 0, r * L * 1.05, r * 0.35);
      g.quadraticCurveTo(r * L * 0.5, r * W * 1.2, 0, r * W); g.closePath(); g.fill();
    });
    g.restore();
  }
  function ball(g, kind, x, y, r){
    g.save(); g.translate(x, y);
    g.beginPath(); g.arc(0, 0, r, 0, 7); g.save(); g.clip();
    if(kind === 'volley'){
      g.fillStyle = rad(g, 0, 0, r, ['#FFFFFF', '#FFF2D0', '#E8C27A']); g.fillRect(-r, -r, 2 * r, 2 * r);
      g.fillStyle = '#FF8A1E'; g.beginPath(); g.moveTo(-r, -r * 0.1); g.quadraticCurveTo(0, -r * 0.05, r * 0.25, -r); g.lineTo(-r, -r); g.closePath(); g.fill();
      g.fillStyle = '#2C6BFF'; g.beginPath(); g.moveTo(r, r * 0.05); g.quadraticCurveTo(r * 0.05, r * 0.05, -r * 0.2, r); g.lineTo(r, r); g.closePath(); g.fill();
      g.strokeStyle = '#5A3A1A'; g.lineWidth = r * 0.07; g.lineCap = 'round';
      [[-r, -r * 0.1, 0, -r * 0.05, r * 0.25, -r], [r, r * 0.05, r * 0.05, r * 0.05, -r * 0.2, r], [-r * 0.15, -r * 0.08, r * 0.1, r * 0.4, r * 0.75, r * 0.7]].forEach(([a, b, c, d, e, f]) => { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo(c, d, e, f); g.stroke(); });
    } else if(kind === 'takraw'){   // woven rattan: a lattice of 5-sided holes
      g.fillStyle = rad(g, 0, 0, r, ['#FFE3A0', '#E8A94A', '#9C5A1A']); g.fillRect(-r, -r, 2 * r, 2 * r);
      g.fillStyle = 'rgba(70,32,6,.85)'; const s = r * 0.42;
      for(let j = -3; j <= 3; j++) for(let i = -3; i <= 3; i++){
        const cx = i * s + (j % 2 ? s / 2 : 0), cy = j * s * 0.87, d = Math.hypot(cx, cy) / r; if(d > 1.05) continue;
        const k = 1 - d * d * 0.55, hr = s * 0.3 * k;   // holes shrink toward the edge (round look)
        g.beginPath(); for(let q = 0; q < 5; q++){ const a = q * Math.PI * 2 / 5 - Math.PI / 2; g.lineTo(cx * (0.92 + 0.08 * k) + Math.cos(a) * hr, cy * (0.92 + 0.08 * k) + Math.sin(a) * hr); } g.fill();
      }
    } else if(kind === 'spark'){   // white with blue lightning bands
      g.fillStyle = rad(g, 0, 0, r, ['#FFFFFF', '#F2F7FF', '#B8CCE8']); g.fillRect(-r, -r, 2 * r, 2 * r);
      g.strokeStyle = '#1E6BFF'; g.lineWidth = r * 0.16; g.lineJoin = 'miter';
      [-0.42, 0.38].forEach((oy, n) => { g.beginPath(); for(let q = 0; q <= 6; q++){ const px = -r + q * r / 3, py = r * oy + (q % 2 ? -1 : 1) * r * 0.16 + (n ? r * 0.1 : 0); q ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); });
      g.strokeStyle = '#9FE8FF'; g.lineWidth = r * 0.05; g.stroke();
    } else {   // 'fire' — the PyraDive fireball
      g.fillStyle = rad(g, 0, 0, r, ['#FFFFFF', '#FFF07A', '#FF9A1E', '#D2280A']); g.fillRect(-r, -r, 2 * r, 2 * r);
      g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(-r * 0.3, -r * 0.35, r * 0.28, 0, 7); g.fill();
    }
    g.restore();
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(-r * 0.35, -r * 0.45, r * 0.22, r * 0.12, -0.6, 0, 7); g.fill();   // shine
    g.lineWidth = r * 0.06; g.strokeStyle = 'rgba(40,16,4,.8)'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
    g.restore();
  }
  function court(g, T, kind){
    g.save();
    if(kind === 'net'){   // net band across the shield with a white tape on top
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1.6;
      for(let x = -100; x <= 100; x += 9){ g.beginPath(); g.moveTo(x, 16); g.lineTo(x, 50); g.stroke(); }
      for(let y = 16; y <= 50; y += 8.5){ g.beginPath(); g.moveTo(-100, y); g.lineTo(100, y); g.stroke(); }
      g.fillStyle = '#FFFFFF'; g.fillRect(-100, 11, 200, 6);
    } else {   // curved net-table (top view from the side): an arch with a low net
      g.fillStyle = lin(g, 0, 22, 0, 54, ['#2C6BFF', '#123A9C']); g.beginPath(); g.moveTo(-86, 52); g.quadraticCurveTo(0, 6, 86, 52); g.lineTo(86, 58); g.quadraticCurveTo(0, 14, -86, 58); g.closePath(); g.fill();
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-86, 52); g.quadraticCurveTo(0, 6, 86, 52); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(-2, 18, 4, 14);
    }
    g.restore();
  }
  function word(g, x, y, px, a, b, acFill, ink, align){   // "Pyra" + name, one word, two colours
    g.font = FONT('900 italic', px); g.textBaseline = 'middle'; g.lineJoin = 'round';
    const wa = g.measureText(a).width, wb = g.measureText(b).width, x0 = align === 'left' ? x : x - (wa + wb) / 2;
    g.lineWidth = px * 0.26; g.strokeStyle = ink; g.strokeText(a, x0, y); g.strokeText(b, x0 + wa, y);
    g.fillStyle = '#FFFFFF'; g.fillText(a, x0, y); g.fillStyle = acFill; g.fillText(b, x0 + wa, y);
    return wa + wb;
  }

  function badge(g, T, sp, small){   // small = icon only (name sits next to it), bigger ball   // drawn in the unit box (≈ 220 × 260)
    g.save(); g.shadowColor = T.glow; g.shadowBlur = 26 * SC; shield(g); g.lineWidth = 10; g.strokeStyle = T.glow; g.stroke(); g.restore();
    shield(g); g.fillStyle = rad(g, 0, -10, 150, [T.back[0], T.back[1]]); g.fill();
    g.save(); shield(g); g.clip();
    rays(g, T, 170, 22);
    g.globalAlpha = 0.9; flames(g, T, 124, 220, 92, 9, 1); g.globalAlpha = 1;
    court(g, T, sp.court);
    const by = small ? -14 : -42, br = small ? 54 : 40; trail(g, T, 6, by, br); ball(g, sp.ball, 6, by, br);
    g.restore();
    shield(g); g.lineWidth = 6; g.strokeStyle = lin(g, 0, -120, 0, 120, [T.rim[0], T.rim[1], T.rim[0], T.rim[1]]); g.stroke();
    if(small) return;
    // ribbon with the name
    g.save(); g.fillStyle = lin(g, 0, 62, 0, 100, ['#2A0E06', '#100404']);
    g.beginPath(); g.moveTo(-112, 66); g.lineTo(112, 66); g.lineTo(104, 82); g.lineTo(112, 98); g.lineTo(-112, 98); g.lineTo(-104, 82); g.closePath(); g.fill();
    g.lineWidth = 3; g.strokeStyle = T.rim[0]; g.stroke(); g.restore();
    const px = 34; g.font = FONT('900 italic', px); const w = g.measureText('Pyra' + sp.name).width, sc = Math.min(1, 196 / w);
    g.save(); g.translate(0, 82); g.scale(sc, sc); word(g, 0, 1, px, 'Pyra', sp.name, lin(g, 0, -16, 0, 16, ['#FFFFFF', sp.ac, sp.ac]), '#1A0602'); g.restore();
  }

  function tri(g, T){   // the pyramid + fireball, centred near (0, -14): top -112, base 84
    g.save(); g.beginPath(); g.moveTo(0, -112); g.lineTo(120, 84); g.lineTo(-120, 84); g.closePath(); g.fillStyle = rad(g, 0, 20, 140, [T.back[0], T.back[1]]); g.fill(); g.clip();
    rays(g, T, 180, 26); flames(g, T, 88, 260, 110, 9, 2); g.restore();
    g.save(); g.shadowColor = T.glow; g.shadowBlur = 30 * SC; g.lineJoin = 'round'; g.lineWidth = 12;
    g.strokeStyle = lin(g, -120, -112, 120, 84, [T.rim[0], T.glow, T.rim[1]]); g.beginPath(); g.moveTo(0, -112); g.lineTo(120, 84); g.lineTo(-120, 84); g.closePath(); g.stroke(); g.restore();
    [[-120, 84], [120, 84], [0, -112]].forEach(([x, y]) => { g.fillStyle = T.rim[0]; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); });
    trail(g, T, 0, 16, 44); ball(g, 'fire', 0, 16, 44);
  }
  const fireWord = (g, T, y0, y1) => lin(g, 0, y0, 0, y1, [T.fire[0], T.fire[1], T.fire[2]]);
  function wide(g, T){   // the title-row wordmark (≈ 760 × 190): pyramid left, "PyraDive" right
    g.save(); g.translate(-268, 4); g.scale(0.7, 0.7); tri(g, T); g.restore();
    const px = 112; g.font = FONT('900 italic', px); const w = g.measureText('PyraDive').width, sc = Math.min(1, 530 / w);
    g.save(); g.translate(-180, 6); g.scale(sc, sc);
    g.save(); g.shadowColor = T.glow; g.shadowBlur = 18 * SC; word(g, 0, 0, px, 'Pyra', 'Dive', fireWord(g, T, -40, 40), '#1A0602', 'left'); g.restore();
    word(g, 0, 0, px, 'Pyra', 'Dive', fireWord(g, T, -40, 40), '#1A0602', 'left');
    g.restore();
  }
  function main(g, T, small){   // drawn in the unit box (≈ 480 × 360): pyramid + fireball + "PyraDive" + tagline
    g.save(); g.translate(0, -40); tri(g, T); g.restore();
    const ink = '#1A0602';
    g.save(); g.shadowColor = T.glow; g.shadowBlur = 18 * SC; word(g, 0, 98, 78, 'Pyra', 'Dive', lin(g, 0, 70, 0, 128, [T.fire[0], T.fire[1], T.fire[2]]), ink); g.restore();
    word(g, 0, 98, 78, 'Pyra', 'Dive', lin(g, 0, 70, 0, 128, [T.fire[0], T.fire[1], T.fire[2]]), ink);
    if(small) return;   // tagline only where it can be read
    g.font = FONT('800', 22); const parts = [['volley', 'SPIKE'], ['takraw', 'STRIKE'], ['spark', 'SPARK']], gap = 26;
    const ws = parts.map(([, t]) => g.measureText(t).width), tot = ws.reduce((a, b) => a + b, 0) + parts.length * 26 + gap * (parts.length - 1);
    let x = -tot / 2; g.textBaseline = 'middle';
    parts.forEach(([b, t], i) => { ball(g, b, x + 10, 146, 10); g.lineWidth = 5; g.strokeStyle = ink; g.strokeText(t, x + 24, 147); g.fillStyle = '#FFFFFF'; g.fillText(t, x + 24, 147); x += 26 + ws[i] + gap; });
  }

  const BOX = {main: [480, 360], wide: [760, 190], spike: [272, 300], strike: [272, 300], spark: [272, 300]};   // room for the glow
  function draw(g, kind, x, y, px, arena){   // px = width on screen
    const T = THEME[arena] || THEME.classic, [bw] = BOX[kind] || BOX.spike, s = px / bw; SC = s;
    g.save(); g.translate(x, y); g.scale(s, s);
    kind === 'main' ? main(g, T, px < 260) : kind === 'wide' ? wide(g, T) : badge(g, T, SPORT[kind] || SPORT.spike, px < 110);
    g.restore();
  }
  function pic(kind, arena, px){
    const key = kind + ':' + (arena || 'classic') + ':' + px; if(cache[key]) return cache[key];
    const [bw, bh] = BOX[kind] || BOX.spike, c = document.createElement('canvas'); c.width = px; c.height = Math.round(px * bh / bw);
    draw(c.getContext('2d'), kind, px / 2, c.height / 2 + (kind === 'main' && px < 260 ? px * 0.06 : 0), px, arena);
    return (cache[key] = c);
  }
  const url = (kind, arena, px) => pic(kind, arena, px).toDataURL('image/png');
  const clear = () => { for(const k in cache) delete cache[k]; };   // after the web fonts arrive
  return {draw, pic, url, clear, SPORT, THEME, BOX};
})();
if(typeof window !== 'undefined') window.PyraLogo = PyraLogo;
/* 🏷️ pd-7 page helpers: every logo follows the picked arena (SET.arena; a match uses arenaKey(M)) */
const PD_LOGO_GROUPS = ['spike', 'strike', 'spark'];
function pdLogoCanvas(kind, arena, cssH, cls){   // a fresh <canvas> copy of the cached picture (one cached picture can't sit in two places)
  const B = PyraLogo.BOX[kind], dpr = Math.min(3, window.devicePixelRatio || 1), w = Math.round(cssH * B[0] / B[1] * dpr);
  const pic = PyraLogo.pic(kind, arena, w), c = document.createElement('canvas');
  c.width = pic.width; c.height = pic.height; c.getContext('2d').drawImage(pic, 0, 0);
  c.className = cls; c.dataset.pdlogo = kind; c.dataset.arena = arena; c.setAttribute('role', 'img');
  c.setAttribute('aria-label', kind === 'wide' || kind === 'main' ? 'PyraDive' : 'Pyra' + PyraLogo.SPORT[kind].name);
  return c;
}
function pdLogoSwap(old, kind, arena, cssH, cls){ const c = pdLogoCanvas(kind, arena, cssH, cls); old.replaceWith(c); return c; }
function pdLogos(){   // title rows (player + menu) + mode-box headers, in the picked arena's colours
  try{
    const ar = SET.arena || 'classic';
    ['scr-player', 'scr-menu'].forEach(id => { const t = document.querySelector('#' + id + ' .title'); if(!t) return;
      const old = t.querySelector('.pd-wordmark');
      if(old && old.dataset.arena === ar) return;
      const c = pdLogoCanvas('wide', ar, 80, 'pd-wordmark');
      old ? old.replaceWith(c) : t.insertBefore(c, t.querySelector('h1')); t.classList.add('has-logo'); });
    PD_LOGO_GROUPS.forEach(g => { const h = document.querySelector('#mode-list .ui-mgroup[data-g="' + g + '"] .ui-mg-h'); if(!h) return;
      const old = h.querySelector('.pd-badge');
      if(old){ if(old.dataset.arena !== ar) pdLogoSwap(old, g, ar, 40, 'pd-badge'); return; }
      const c = pdLogoCanvas(g, ar, 40, 'pd-badge'), tn = h.firstChild;   // draw first: if it fails the emoji stays
      if(tn && tn.nodeType === 3) tn.textContent = tn.textContent.replace(/^\s*\S+\s+/, ' ');   // drop the emoji, keep "PyraSpike"
      h.insertBefore(c, h.firstChild); });
  }catch(e){ console.warn('🏷️ logo', e); }   // the emoji title + icons stay
}
function pdSetupBadge(){   // the sport badge as the setup screen's logo (🏆 cups + 🎯 drills keep their emoji)
  try{
    const box = $('setup-logo'), m = PD.MODES[SET.mode], g = m && !SET.cup ? groupOf(m) : '';
    if(!PD_LOGO_GROUPS.includes(g)) return;
    const ar = m.sport === 'hoop' && (SET.arena || 'classic') === 'classic' ? 'fair' : SET.arena || 'classic';
    const c = pdLogoCanvas(g, ar, 80, 'pd-badge'); box.textContent = ''; box.appendChild(c);   // draw first: if it fails the emoji stays
  }catch(e){ console.warn('🏷️ logo', e); }
}
function pdResultBadge(){   // the sport badge in the result card's corner (match or cup)
  try{
    const card = $('result-card'), cs = SET.cupState, mid = cs && SET.cup ? cs.sport : (G && G.M ? G.M.mode : SET.mode), m = PD.MODES[mid], g = m ? groupOf(m) : '';
    if(!PD_LOGO_GROUPS.includes(g) || !card) return;
    const ar = G && G.M ? arenaKey(G.M) : SET.arena || 'classic';
    card.insertBefore(pdLogoCanvas(g, ar, 64, 'pd-rbadge'), card.firstChild);
  }catch(e){ console.warn('🏷️ logo', e); }
}
if(document.fonts && document.fonts.ready) document.fonts.ready.then(() => {   // redraw once Fredoka has arrived
  try{ PyraLogo.clear(); document.querySelectorAll('canvas[data-pdlogo]').forEach(c => { c.dataset.arena = ''; }); pdLogos(); if(!$('scr-setup').classList.contains('hidden')) pdSetupBadge(); }catch(e){}
});
/* 🏷️ END PyraLogo (pd-7) */
// 🏟️ arenas (pd-4c: all 7 open). 🏖️ Beach mode is always on sand; ⭕ Hoop in the Classic arena = a 🛕 Thai temple-fair square; 🪐 the moon court is floaty (engine ARENA_GRAV)
const ARENAS = [{k: 'classic', icon: '🏟️', name: 'Classic arena'}, {k: 'jungle', icon: '🦖', name: 'Jungle beach'}, {k: 'coral', icon: '🐙', name: 'Coral court'}, {k: 'neon', icon: '🪩', name: 'Neon arena'}, {k: 'robot', icon: '🤖', name: 'Robot gym'}, {k: 'moon', icon: '🪐', name: 'Moon court'}, {k: 'olympus', icon: '☁️', name: 'Olympus'}];
// sky (3 stops) · stands (2) · crowd dot strength · floor / court / takraw court / ⚡ play zone / line colours (missing = the classic colour) · spot = light beams · deco = scenery painter
const ARENA_LOOK = {
  classic: {sky: ['#0A0F26', '#18214A', '#0F1530'], stand: ['#141C44', '#232F66'], crowd: 0.32, spot: 'white'},
  fair: {sky: ['#2A1446', '#6B2D5C', '#E07A3C'], stand: ['#4A2418', '#6E3A22'], crowd: 0.3, spot: '', deco: 'fair', tk: ['#B5774A', '#A86B40'], floor: '#8C5A36', line: '#FFE7B0'},
  jungle: {sky: ['#FF8A5B', '#FFC46B', '#9FD8A6'], stand: ['#4E3A1E', '#6B5230'], crowd: 0.22, spot: '', deco: 'jungle', floor: '#D9BE84', court: ['#A39C88', '#958E7B'], tk: ['#8A9A6A', '#7F8E61'], zone: '#C7A86E', line: '#FFFFFF'},
  coral: {sky: ['#03263B', '#0B4D6E', '#11718D'], stand: ['#0C3A50', '#125269'], crowd: 0.2, spot: 'rays', deco: 'coral', floor: '#1D6A84', court: ['#E9907A', '#DD8270'], tk: ['#3BB3A0', '#33A493'], zone: '#165C75', line: '#E8FBFF'},
  neon: {sky: ['#090320', '#1A0A3C', '#080316'], stand: ['#150934', '#28105C'], crowd: 0.42, spot: 'neon', deco: 'neon', floor: '#0F0A2A', court: ['#2A1660', '#23124F'], tk: ['#1E1458', '#19104A'], zone: '#120C34', line: '#3CF2FF'},
  robot: {sky: ['#1B222D', '#2D3745', '#1F252E'], stand: ['#2A323E', '#394351'], crowd: 0.26, spot: 'white', deco: 'robot', floor: '#4A5563', court: ['#6B7686', '#626C7B'], tk: ['#5F7A6E', '#567064'], zone: '#3E4855', line: '#FFD23F'},
  moon: {sky: ['#010208', '#0A0D20', '#151933'], stand: ['#2A2C3A', '#3B3E52'], crowd: 0.18, spot: '', deco: 'moon', floor: '#85858F', court: ['#B6B6BF', '#ABABB5'], tk: ['#9C9CA8', '#93939F'], zone: '#6C6D7D', line: '#FFFFFF'},
  olympus: {light: true, sky: ['#6FC0FF', '#B2E0FF', '#EAF6FF'], stand: ['#D9D2C2', '#EDE7D9'], crowd: 0.26, spot: 'sun', deco: 'olympus', floor: '#E6E0D2', court: ['#F5EFDD', '#EEE6D0'], tk: ['#D3E5C2', '#C8DCB5'], zone: '#D3CAB4', line: '#D9A93A'}
};
function arenaKey(M){ const k = (M && M.arena) || 'classic'; return k === 'classic' && M && PD.MODES[M.mode] && PD.MODES[M.mode].sport === 'hoop' ? 'fair' : ARENA_LOOK[k] ? k : 'classic'; }
function arenaLook(M){ return ARENA_LOOK[arenaKey(M)]; }
const ACTIONS = [['up', '⬆️ Up'], ['down', '⬇️ Down'], ['left', '⬅️ Left'], ['right', '➡️ Right'], ['touch', '🤚 Touch'], ['drive', '💥 Drive / Dunk'], ['dink', '🪶 Dink'], ['jump', '⬆️ Jump / Block'], ['dive', '🤸 Dive'], ['pyra', '🔥 Pyra']];
const DEFAULT_KEYS = [
  {up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', touch: 'KeyJ', drive: 'KeyK', dink: 'KeyL', jump: 'Space', dive: 'ShiftLeft', pyra: 'KeyF'},
  {up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', touch: 'Numpad1', drive: 'Numpad2', dink: 'Numpad3', jump: 'Numpad0', dive: 'NumpadDecimal', pyra: 'NumpadAdd'}
];
const BTN_SPIKE = [['pyra', '🔥', 'Pyra'], ['jump', '⬆️', 'Jump'], ['dink', '🪶', 'Dink'], ['dive', '🤸', 'Dive'], ['touch', '🤚', 'Touch'], ['drive', '💥', 'Dunk']];
const BTN_STRIKE = [['pyra', '🔥', 'Pyra'], ['jump', '⬆️', 'Jump'], ['dink', '🦶', 'Tip'], ['dive', '🤸', 'Dive'], ['touch', '🦵', 'Trap'], ['drive', '💥', 'Strike']];   // 🦶 PyraStrike: no hands · 📱 pd-5b: Strike, not Spike (Aowu)
const BTN_HOOP = [['pyra', '🔥', 'Pyra'], ['jump', '⬆️', 'Jump'], ['dink', '🦶', 'Heel'], ['dive', '🤸', 'Lunge'], ['touch', '🦵', 'Pass'], ['drive', '⭕', 'Shoot']];   // ⭕ hoop takraw
const BTN_JUGGLE = [['jump', '⬆️', 'Jump'], ['dive', '🤸', 'Lunge'], ['touch', '🦵', 'Keep up']];   // 🤹 keepy-up: every key keeps it up
const BTN_SPARK = [['pyra', '🔥', 'Pyra'], ['jump', '⬆️', 'Jump'], ['dink', '🪶', 'Dink'], ['dive', '🤸', 'Lunge'], ['touch', '🦵', 'Trap'], ['drive', '⚡', 'Drive']];   // ⚡ PyraSpark (L + K = 💥 Edge)
let BTN = BTN_SPIKE;
const TEAM_COL = ['#FF6B1A', '#2F7BEA'];
const WORDS = {bump: '🤚 Bump', set: '🙌 Set!', dig: '🛡️ Dig!', dive: '🤸 Dive!', dunk: '💥 DUNK!', dink: '🪶 Dink', drive: '🚀 Drive!'};
const WORDS_STRIKE = {bump: '🦵 Trap', set: '🙆 Head set!', dig: '🦶 Toe save!', dive: '🤸 Dive!', dunk: '🌀 ROLL STRIKE!', bicycle: '🚲 BICYCLE!', dink: '🦶 Heel tip', drive: '🦶 Kick!'};
function isHoop(M){ return !!(M && M.sp.sport === 'hoop'); }
const GOAL_HOOP = {jkeep: ['🤹 Keep it up! Foot · knee · head — switch for bonus points', 'J'], htoss: ['⭕ Tap 🦵 to toss the ball up', 'J'], hpass: ['🦵 Keep it up — pass it to a friend!', 'J'], hshoot: ['⭕ Kick it THROUGH the hoop! (or 🦵 pass)', 'K']};
const WORDS_SPARK = {bump: '🦵 Trap', set: '⬆️ Pop!', dig: '🦶 Dig!', dive: '🤸 Dive!', dunk: '⚡ SPARK SMASH!', dink: '🪶 Dink', drive: '⚡ Drive!', edge: '💥 Edge shot!'};
const DRILL_WHY = ['zaim', 'ctrap', 'cpop', 'csmash', 'jkeep'];
const GOAL_SPARK = {zaim: ['🎯 Send it into the glowing zone!', 'K'], ctrap: ['🔗 1 · Trap it — tap 🦵', 'J'], cpop: ['🔗 2 · Pop it up — tap 🦵 again', 'J'], csmash: ['🔗 3 · SMASH it — tap ⚡ while it is high!', 'K'], serve: ['⚡ Your serve! Tap ⚡ — land it on THEIR half', 'K'], sbounce: ['⏳ Let it bounce on your half of the table…', ''], strap: ['🦵 Trap it up!', 'J'], ssend: ['⚡ Send it back onto their half!', 'K']};
function wordOf(M, e){ if(PD.isSpark(M)) return e.edgeTry ? WORDS_SPARK.edge : WORDS_SPARK[e.k]; return PD.isStrike(M) ? (e.style === 'bicycle' ? WORDS_STRIKE.bicycle : WORDS_STRIKE[e.k]) : WORDS[e.k]; }
const WHY = {four: '4 touches! Only 3 a side', double: 'Double touch! The same player twice', net: 'Touched the net!', out: 'Out!', drop: 'It dropped!', in: 'In!', kill: 'Kill!', ace: 'Ace!', stuff: 'Stuff block!'};
const GOAL_STRIKE = {block: ['🧱 They strike — Jump to BLOCK it!', 'Space'], toss: ['🧺 You toss! Tap 🦵 — throw it up to your server', 'J'], serve: ['🦶 Your serve! Tap 💥 — your buddy tosses, you kick', 'K'], bump: ['🦵 Trap it up with your thigh!', 'J'], set: ['🙆 Head it up high!', 'J'], dig: ['🦶 Toe save! Get a foot under it', 'J'], dunk: ['💥 Jump and STRIKE it over!', 'K']};
const GOAL = {block: ['🧱 They spike — Jump to BLOCK it!', 'Space'], serve: ['🚀 Your serve! Tap 💥', 'K'], serveAll: ['🚀 Serve:'], bump: ['🤚 Bump it up to your setter!', 'J'], set: ['🙌 Set it up high!', 'J'], dig: ['🛡️ Dig! Save the low ball', 'J'], dunk: ['💥 Jump and DUNK it over the net!', 'K']};

/* ================= STATE ================= */
let S = {players: [], progress: {}, settings: {}, avatars: {}, player: '', age: ''};
let SET = {control: 'ball', mode: 'beach', level: 0, who: 'robot', p2: '', arena: 'classic', marker: true, cup: '', cupSport: 'beach', cupState: null};
let G = null, lockHandle = null, KEYS = null, RAF = 0;
const GC_LISTEN = [], GC_LOG = [];
function store(k){ return 'sp_pyradive_' + k + ':' + (S.player || ''); }
function ls(k, v){ try{ if(v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(e){ return null; } }
function loadPrefs(){ try{ const p = JSON.parse(ls(store('prefs')) || '{}'); if(PD.MODES[p.mode]) SET.mode = p.mode; if(ARENAS.some(a => a.k === p.arena)) SET.arena = p.arena; SET.cup = CUPS[p.cup] ? p.cup : ''; SET.cupKind = CUPS[p.cupKind] ? p.cupKind : SET.cup || 'cupfour'; if(CUP_SPORTS.includes(p.cupSport)) SET.cupSport = p.cupSport; if(['robot', 'team', 'duo'].includes(p.who)) SET.who = p.who; if(p.marker === false) SET.marker = false; if(p.control === 'one') SET.control = 'one'; if(p.p2) SET.p2 = p.p2; }catch(e){} }
function savePrefs(){ ls(store('prefs'), JSON.stringify({control: SET.control, mode: SET.mode, arena: SET.arena, who: SET.who, marker: SET.marker, p2: SET.p2, cup: SET.cup || '', cupKind: SET.cupKind || '', cupSport: SET.cupSport || ''})); }
function myAvatar(name){ const a = S.avatars[name]; return a ? fixAv(a) : defaultAvatar(name || 'player'); }
// 🏐 on court nobody rides a ride-on or holds an item (Aowu 2026-11-14 "remove ride on when play"); pets + trails stay home too
function playAv(av){ const a = JSON.parse(JSON.stringify(av || {})); a.eq = Object.assign({}, a.eq || {}); delete a.eq.ride; delete a.eq.hand; delete a.eq.pet; delete a.eq.trail; return a; }

/* ================= 💥 COMICS + 📣 CROWD HOOKS (for the 💥 Comics chat and the 📣 Cheer chat — the game draws no comics itself) =================
   GameComic.listen(fn) → fn('pyraspike', event, M) for EVERY engine event (names: plan §18) · .log() = this match's events
   .hold(true|false) freezes the live loop quietly (drawing goes on) · .area() = #stage · .mode() = 'pyraspike' | null
   Slots: #comics-slot-menu (level page) · #comics-slot-setup (setup ⚙️ Extras) · #comic-strip-slot (result card). */
window.GameComic = {
  listen(fn){ GC_LISTEN.push(fn); return () => { const i = GC_LISTEN.indexOf(fn); if(i >= 0) GC_LISTEN.splice(i, 1); }; },
  log(){ return GC_LOG.slice(); },
  hold(on){ if(G) G.held = !!on; },
  area(){ return $('stage'); },
  mode(){ return G && !G.over ? GAME_ID : null; },
  state(){ return G ? G.M : null; }
};

/* ================= MENUS ================= */
function showScreen(name){
  ['player', 'menu', 'setup', 'play'].forEach(s => $('scr-' + s).classList.toggle('hidden', s !== name));
  $('back-btn').classList.toggle('hidden', name === 'play'); UI.navScreen($('back-btn'), name, NAV_INNER); window.scrollTo(0, 0);
}
function progressOf(name){ return S.progress[name] || {unlocked: 0, tokens: [], best: []}; }
function canPlay(i){ const p = progressOf(S.player); if(i === 5) return p.unlocked >= 5; if(i === 4) return p.unlocked >= 4; return i <= Math.max(p.unlocked, AGE_START[S.age] || 0); }
function renderPlayers(){
  pdLogos();   // 🏷️ pd-7
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
  loadPrefs(); KEYS = loadKeys(); $('who-name').textContent = name; if(window.Cheer){ Cheer.chip($('cheer-chip'), name); Cheer.langChip($('cheer-lang'), name); } /* 📣 cs-pd */
  bestiaryCount(); if(window.SpiritBestiary) SpiritBestiary.load(name).then(bestiaryCount);   // 📖 found creatures (this device + the server)
  if(S.looksSrv && !S.looksSrv[name] && ['ball', 'table', 'bomb'].some(k => ls(lookKey(k, name)) != null)) saveLooks();   // 🎨 pd-4e: picks made before pd-4e go up once
  const ml = UI.modeLink ? UI.modeLink(MODE_LINK) : '';
  if(ml && modeInfo(ml)) pickMode(ml);
  renderMenu(); showScreen('menu'); msAlso();
  if(ml && modeInfo(ml)){ UI.toast(modeInfo(ml).icon + ' ' + modeInfo(ml).name + ' — now pick a level'); if(UI.modePoint) UI.modePoint($('level-list')); }
}
/* ✨ MODE SPOTLIGHT (built in, pd-1): ?mode=<id> opens that mode ONCE (UI.modeLink, in choosePlayer) · ✨ Also try banner under the
   title · UI.modeTried when a match starts (startMatch). MODES_ rows in Code.gs: pyraspike beach / small / full. */
function msNow(){ return curMode(); }
function msOpen(id){ if(!modeInfo(id)) return; pickMode(id); if(UI.modePoint) UI.modePoint($('level-list')); }
function msAlso(){ if(UI.alsoTry) UI.alsoTry({player: S.player, game: GAME_ID, at: () => document.querySelector('#scr-menu .title'), current: msNow, noDrop: true, open: msOpen}); }
function changePlayer(){ renderPlayers(); showScreen('player'); }
function bestHtml(p, i){ const b = (p.best || [])[i]; if(!b || !b.score) return '<div class="best none">No win yet</div>'; return '<div class="best"><span>🏆 ' + Number(b.score).toLocaleString() + '</span><span>' + '⭐'.repeat(b.stars || 0) + '</span></div>'; }
function renderMenu(){
  const ml = $('mode-list');
  if(!ml.children.length) UI.modeGroups(ml, MODE_GROUPS, mgList(), {next: () => $('level-head'), onPick: k => { pickMode(k); return false; }});
  markModes(); renderLevels(); pdLogos();   // 🏷️ pd-7
  pdLeaders($('leaders'), S.player);
}
/* 🏆 pd-3c (Aowu 2026-11-14): ONE PyraDive leaderboard, a column per sport — 🏐 Spike · 🦶 Strike · ⭕ Hoop · ⚡ Spark.
   Same rows + Leader points as UI.leaders (server getGameLeaders); each player's best per sport comes from `ways`
   (best score per Theme head = mode icon + name). 👑 = the family's best in that sport. Tap a sport header to rank by it. */
const SPORT_COLS = [{k: 'spike', icon: '🏐', name: 'Spike'}, {k: 'strike', icon: '🦶', name: 'Strike'}, {k: 'hoop', icon: '⭕', name: 'Hoop'}, {k: 'spark', icon: '⚡', name: 'Spark'}, {k: 'train', icon: '🎯', name: 'Drills'}, {k: 'fun', icon: '🏆', name: 'Cups'}];   // pd-4a: + 🎯 drills · pd-4b: 🏆 cups + 🌀 party
function colOf(m){ return m.drill ? 'train' : m.party ? 'fun' : m.sport; }
const LB = {data: null, sort: ''};
function sportOfHead(h){ h = String(h || '').trim(); for(const k in CUPS) if(h === CUPS[k].icon + ' ' + CUPS[k].name) return {party: true, cup: true}; for(const k in PD.MODES){ const m = PD.MODES[k]; if(h === m.icon + ' ' + m.name) return m; } return null; }
function sportBests(m){ const out = {}; SPORT_COLS.forEach(c => { out[c.k] = {best: 0, plays: 0, modes: []}; });
  Object.keys(m.ways || {}).forEach(h => { const md = sportOfHead(h), w = m.ways[h]; if(!md || !out[colOf(md)]) return; const o = out[colOf(md)];
    o.plays += w.plays || 0; if((w.best || 0) > o.best) o.best = w.best || 0; o.modes.push(h + (w.best ? ' 🏆 ' + Number(w.best).toLocaleString() : '') + ' (' + (w.plays || 0) + ')'); });
  return out; }
function pdLeaders(el, me){
  if(!el) return;
  if(!window.google || !google.script || !google.script.run){ if(window.UI && UI.leaders) UI.leaders(el, GAME_ID, me); return; }
  if(!el.innerHTML) el.innerHTML = '<div class="uil-card"><div class="uil-h">🏆 Who played PyraDive</div><div class="uil-load"><span class="ui-spin a-bounce">🏐</span> Counting the champions…</div></div>';
  google.script.run.withSuccessHandler(d => { LB.data = d; LB.me = me; drawLeaders(el); }).withFailureHandler(() => { if(window.UI && UI.leaders) UI.leaders(el, GAME_ID, me); else el.innerHTML = ''; }).getGameLeaders(GAME_ID);
}
function drawLeaders(el){
  const d = LB.data, me = LB.me, esc = UI.esc || (x => String(x));
  const list = ((d && d.players) || []).map(m => Object.assign({}, m, {sp: sportBests(m)}));
  if(!list.length){ el.innerHTML = '<div class="uil-card"><div class="uil-h">🏆 Who played PyraDive</div><div class="uil-none">Nobody yet — be the first champion! 🚀</div></div>'; return; }
  const top = {}; SPORT_COLS.forEach(c => { top[c.k] = Math.max(0, ...list.map(m => m.sp[c.k].best)); });
  const rows = list.slice(), rankByPts = list.map(m => m.name);
  if(LB.sort) rows.sort((a, b) => b.sp[LB.sort].best - a.sp[LB.sort].best || b.total - a.total);
  const head = '<div class="pdl-row pdl-head"><span></span><span></span><span class="pdl-hn">' + (LB.sort ? 'Ranked by ' + SPORT_COLS.find(c => c.k === LB.sort).icon + ' best' : 'Ranked by points') + '</span><span class="pdl-cols">'
    + SPORT_COLS.map(c => '<button class="pdl-hc' + (LB.sort === c.k ? ' on' : '') + '" data-k="' + c.k + '" data-sound="pop" title="Rank by ' + c.name + '"><b>' + c.icon + '</b>' + c.name + '</button>').join('') + '</span><span class="pdl-hp">points</span></div>';
  const row = (m, i) => { const pi = rankByPts.indexOf(m.name), medal = LB.sort ? (i + 1) + '.' : (['🥇', '🥈', '🥉'][i] || (i + 1) + '.'), lv = '●'.repeat(Math.min(5, m.levels)) + '○'.repeat(Math.max(0, 5 - m.levels)) + (m.hardcore ? ' 💀' : '');
    const cells = SPORT_COLS.map(c => { const o = m.sp[c.k], king = o.best > 0 && o.best === top[c.k];
      return '<span class="pdl-c' + (o.plays ? '' : ' none') + (king ? ' king' : '') + '" data-sport="' + c.k + '" title="' + esc(c.icon + ' ' + c.name + (o.modes.length ? ': ' + o.modes.join(' · ') : ': not played yet')) + '"><b>' + c.icon + '</b>'
        + (o.best ? Number(o.best).toLocaleString() : o.plays ? '0' : '—') + (king ? '<i>👑</i>' : '') + '</span>'; }).join('');
    return '<div class="pdl-row uil-row' + (m.name === me ? ' me' : '') + (pi === 0 ? ' lead' : '') + '"><span class="uil-rank">' + medal + '</span><canvas class="uil-av" width="72" height="72" data-n="' + esc(m.name) + '"></canvas>'
      + '<span class="uil-nm">' + esc(m.name) + (pi === 0 ? ' <b class="uil-crown">👑 Leader</b>' : '') + '<small>' + lv + ' · ' + m.plays + ' game' + (m.plays === 1 ? '' : 's') + '</small></span>'
      + '<span class="pdl-cols">' + cells + '</span><span class="uil-pts"><b>' + Number(m.total).toLocaleString() + '</b><small>points</small></span></div>'; };
  el.innerHTML = '<div class="uil-card pdl-card"><div class="uil-h">🏆 Who played PyraDive <small>One board for every sport · 👑 = best in that sport · tap a sport to rank by it</small></div>' + head + rows.map(row).join('') + '</div>';
  el.querySelectorAll('.pdl-hc').forEach(b => b.onclick = () => { LB.sort = LB.sort === b.dataset.k ? '' : b.dataset.k; drawLeaders(el); });
  el.querySelectorAll('canvas.uil-av').forEach(c => { const m = list.find(x => x.name === c.dataset.n), g = c.getContext('2d');
    try { if(typeof drawPreviewCanvas === 'function' && typeof fixAv === 'function'){ const big = document.createElement('canvas'); big.width = 120; big.height = 140; drawPreviewCanvas(big, m.avatar ? Object.assign(fixAv(m.avatar), {eq: {}}) : defaultAvatar(m.name), {name: m.name, t: 1}); g.drawImage(big, 28, 14, 64, 64, 0, 0, 72, 72); return; } } catch(e){}
    g.fillStyle = '#FF8FB1'; g.beginPath(); g.arc(36, 36, 34, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '700 34px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(m.name.charAt(0).toUpperCase(), 36, 38); });
}
function markModes(){ const k = curMode(), m = modeInfo(k); $('mode-list').querySelectorAll('.ui-mbtn').forEach(b => b.classList.toggle('on', b.dataset.k === k)); $('level-head').textContent = 'Pick a level — ' + m.icon + ' ' + m.name; }
/* 🎯 pd-4a: level cards + setup lines for the drills and 🌀 Spark Party */
const DRILL_BLURB = ['The ball waits for you — press the glowing button.', 'A bit faster. Lots of aim help.', 'Normal speed. A little aim help.', 'Fast — aim it yourself.', 'Faster, smaller zones.', 'Fastest. ×3 points.'];
const DRILL_GOAL = {zone: '🎯 Hit the glowing zone = 3 · any hit on their half = 1', combo: '🔗 Trap → Pop → ⚡ Smash = 5 · 3 touches = 2 · any return = 1', run: '🏃 Every return = 1 · the ball gets faster · a miss costs a ❤️', juggle: '🤹 Every touch = 1 · switch foot / knee / head = +1 · every 10 in a row = +5 · hold 🦵 on a low ball = 🦶 sole stall +3'};
function levelGoal(mode, i){ if(mode === 'cups') mode = SET.cup || 'cupfour'; if(CUPS[mode]) return CUPS[mode].n + ' teams · ' + Math.log2(CUPS[mode].n) + ' wins = 🏆 · first to ' + CUP_TARGET[i]; const m = PD.MODES[mode], L = PD.LEVELS[i]; if(m.drill){ const D = PD.DRILL[m.drill]; return [D.time ? '⏱️ ' + D.time[i] + ' s' : '', D.lives ? '❤️ ' + D.lives[i] : '', '⭐ ' + D.stars[i].join(' / ')].filter(Boolean).join(' · '); }
  if(m.party) return 'first to ' + PD.PARTY.target[i] + ' · ' + PD.PARTY.balls[i] + ' extra balls'; return L.sets === 3 ? 'best of 3 sets to ' + L.target : 'first to ' + L.target; }
function levelBlurb(mode, i){ if(CUPS[mode] || mode === 'cups') return LEVEL_UI[i].blurb.replace(/ (First to|Best of) [^.]*\./, ''); const m = PD.MODES[mode]; return m.drill ? DRILL_BLURB[i] : LEVEL_UI[i].blurb; }
function renderLevels(){
  const box = $('level-list'); box.innerHTML = ''; const p = progressOf(S.player), rec = AGE_START[S.age];
  PD.LEVELS.forEach((L, i) => {
    const U = LEVEL_UI[i], open = canPlay(i), done = p.unlocked > i, b = document.createElement('button');
    b.className = 'pick lvl' + (open ? '' : ' locked') + (i === rec && open ? ' recommended' : '') + (U.hardcore ? ' hardcore' : ''); b.setAttribute('data-sound', open ? 'pop' : 'none'); b.dataset.lv = i;
    b.innerHTML = '<span class="num">' + (i + 1) + '</span>' + (done ? '<span class="badge">🏅</span>' : open ? '' : '<span class="badge">🔒</span>') +
      '<div class="big">' + U.emoji + '</div><div class="nm">' + L.name + '</div><div class="learn">' + levelGoal(curMode(), i) + '</div><div class="sub">' + (U.hardcore && !open ? '🔒 Beat Extreme to open 💀 Hardcore' : levelBlurb(curMode(), i)) + '</div>' + bestHtml(p, i);
    b.onclick = () => { if(!open){ UISound.play('error'); UI.toast(i === 5 ? 'Beat Extreme to open 💀 Hardcore' : i === 4 ? 'Win on Hard to unlock Extreme!' : 'Win the level before to unlock it'); return; } openSetup(i); };
    box.appendChild(b);
  });
}

/* ================= SETUP ================= */
function others(){ return S.players.map(p => p.Name).filter(n => n !== S.player); }
/* ================= 📏 PD-S PARTS — play + 🏆 cups load on demand (🔥 PyraDive chat pd-s, rule "📏 Born split + split your own") =================
   PyraDive_play.html = what only a running match uses (events → sounds / words / 🐉 spirit FX · input + pads · the court painter: views,
   players, beats, ball) · PyraDive_cups.html = the 🏆 cups (cup setup · bracket · robot-vs-robot matches · podium). Built by
   Test Harness/parts/build_parts.py from parts/PyraDive/<part>.js — edit those. startMatch() + a 🏆 cup setup wait for their part
   (GameParts.need, with the game's own loader); the menus, setup page, 🎨 looks sheet, logo and engine stay HERE. The play part is fetched
   when the kid opens the setup page (pdPrefetch, after a tap — nothing at boot) so ▶ Play is instant; the 🏟️ arena previews paint when it is in.
   📲 offline app + tests: both parts are inline (Code.gs INCLUDE_ALSO_ PyraDiveParts) → there at once, everything as before. */
function pdPartReady(k){ return typeof GameParts !== 'undefined' && GameParts.has('PyraDive_' + k); }
const PD_ARENA_Q = [];
function pdArenaPaint(cv, k){ if(pdPartReady('play')) return paintArenaPreview(cv, k); PD_ARENA_Q.push([cv, k]); pdPrefetch(); }
function pdArenaFlush(){ if(!pdPartReady('play')) return; PD_ARENA_Q.splice(0).forEach(([cv, k]) => { if(cv.isConnected) paintArenaPreview(cv, k); }); }
function pdPrefetch(){ if(typeof GameParts !== 'undefined' && !pdPartReady('play')) GameParts.need('PyraDive_play', ok => { if(ok) pdArenaFlush(); }); }   /* online: the setup page opened (a tap) → fetch the play part now */
function pdNeed(k, go){
  if(typeof GameParts === 'undefined') return setTimeout(() => pdNeed(k, go), 40);   // the loader comes right after this script
  if(pdPartReady(k)){ if(k === 'play') pdArenaFlush(); return go(); }
  UI.loading('pyradive', k === 'cups' ? '🏆 Getting the cup ready…' : '🔥 Lighting the Pyra flame…');
  GameParts.need('PyraDive_' + k, ok => { UI.loaded(); if(ok){ if(k === 'play') pdArenaFlush(); return go(); } UISound.play('error'); UI.toast('📡 PyraDive did not load — check the internet, then tap again', 'err'); }); }
/* ================= 📏 END PD-S PARTS ================= */
function openSetup(lvl){
  pdPrefetch();   /* 📏 pd-s */
  if(SET.cup){ if(!pdPartReady('cups')) return pdNeed('cups', () => openSetup(lvl)); return openCupSetup(lvl); }   /* 📏 pd-s: the 🏆 cups part */
  SET.level = lvl; const sp = PD.MODES[SET.mode], L = PD.LEVELS[lvl];
  if(LEVEL_UI[lvl].hardcore) SET.who = 'robot';
  if(SET.who !== 'robot' && !others().length) SET.who = 'robot';
  if(!SET.p2 || !others().includes(SET.p2)) SET.p2 = others()[0] || '';
  $('setup-logo').textContent = sp.icon; $('setup-title').textContent = sp.name + ' · ' + L.name; pdSetupBadge();   // 🏷️ pd-7
  $('setup-sub').textContent = sp.drill ? DRILL_GOAL[sp.drill] + ' · ' + levelGoal(SET.mode, lvl) : sp.party ? '🌀 ' + levelGoal(SET.mode, lvl) + ' · every ball that lands on their half counts · ' + LEVEL_UI[lvl].blurb : (L.sets === 3 ? 'Best of 3 sets to ' + L.target : 'First to ' + L.target) + ' points · 3 touches a side · ' + LEVEL_UI[lvl].blurb;
  buildWho(); buildCtl(); buildTeams(); buildArenas();
  const mc = () => { $('aim-chip').textContent = '🎯 Landing marker: ' + (SET.marker ? 'on' : 'off'); $('aim-chip').classList.toggle('on', SET.marker); };
  mc(); $('aim-chip').onclick = () => { SET.marker = !SET.marker; savePrefs(); mc(); };
  $('go-btn').onclick = () => startMatch();
  showScreen('setup');
}
function buildWho(){
  const hc = !!LEVEL_UI[SET.level].hardcore, row = $('who-row'), none = !others().length;
  const solo = PD.MODES[SET.mode].n === 1; if(solo && SET.who === 'team') SET.who = 'robot';   // 🦶 1v1: one seat a side
  if(PD.MODES[SET.mode].drill){ SET.who = 'robot'; row.innerHTML = '<button class="chip on" data-k="robot" data-sound="tap">🧑‍🏫 Me + the Coach</button>'; return; }   // 🎯 drills: you train alone
  const list = [['robot', solo ? '🤖 Me vs a robot' : '🤖 Me + robots'], ['team', '🤝 2 players, same team'], ['duo', '⚔️ 2 players, against each other']];
  row.innerHTML = list.map(([k, n]) => '<button class="chip' + (SET.who === k ? ' on' : '') + ((hc || none || (solo && k === 'team')) && k !== 'robot' ? ' lock' : '') + '" data-k="' + k + '" data-sound="tap">' + n + '</button>').join('');
  row.querySelectorAll('.chip').forEach(b => b.onclick = () => { const k = b.dataset.k;
    if(k === 'team' && PD.MODES[SET.mode].n === 1){ UISound.play('error'); UI.toast('🦶 1v1 has one player a side — pick ⚔️ against each other'); return; }
    if(k !== 'robot' && (hc || none)){ UISound.play('error'); UI.toast(hc ? '💀 Hardcore is you against the robots' : 'Add a second player on the Dashboard first'); return; }
    SET.who = k; savePrefs(); row.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); buildCtl(); buildTeams(); });
}
// 🎮 pd-8a: how you play a team match — 🎮 Ball control (default: you move whoever plays the ball next) · 🧍 One player (one seat, serve turns go round)
function ctlShown(){ const sp = PD.MODES[SET.mode]; return !!(sp && PD.CTL_SPORT[sp.sport] && sp.n >= 2 && !sp.drill && !sp.party && SET.who !== 'team'); }
function buildCtl(){
  const row = $('ctl-row'), note = $('ctl-note'); if(!row) return;
  if(!ctlShown()){ row.innerHTML = ''; row.classList.add('hidden'); note.classList.add('hidden'); return; }
  row.classList.remove('hidden'); note.classList.remove('hidden');
  const list = [['ball', '🎮 Ball control'], ['one', '🧍 One player']];
  row.innerHTML = list.map(([k, n]) => '<button class="chip' + (SET.control === k ? ' on' : '') + '" data-k="' + k + '" data-sound="tap">' + n + '</button>').join('');
  const sport = (PD.MODES[SET.mode] || {}).sport, NOTE = {   /* 🎮 pd-8b: what each way means in this sport */
    spike: ['🎮 You move whoever plays the ball next — serve, bump, set, spike · robots move the rest', '🧍 You stay one player · everybody takes turns to serve'],
    strike: ['🎮 You move whoever plays the ball next — you kick the serve (a robot tosses), then trap, set, strike', '🧍 You stay one player · everybody takes turns to serve'],
    hoop: ['🎮 You move whoever plays the ball next — point your stick at the friend who gets your pass', '🧍 You stay one player · your robot friends pass to you too'],
    spark: ['🎮 You move whoever plays the ball next — then your partner for the 2nd touch', '🧍 You stay one player · partners take turns to serve'] }[sport] || [];
  const say = () => { note.textContent = (SET.control === 'one' ? NOTE[1] : NOTE[0]) || ''; };
  say();
  row.querySelectorAll('.chip').forEach(b => b.onclick = () => { SET.control = b.dataset.k; savePrefs(); row.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); say(); });
}
function pinsOf(name){ try{ return window.SpiritBestiary && SpiritBestiary.pins ? SpiritBestiary.pins(name) : null; }catch(e){ return null; } }   // ⭐ pd-4b favourite creatures
function teamsCfg(){
  const n = PD.MODES[SET.mode].n, fam = others().filter(x => x !== SET.p2).sort(() => Math.random() - 0.5);
  let fi = 0; const bot = i => { const nm = fam[fi++]; return nm ? {name: nm, av: playAv(myAvatar(nm)), robot: true} : {name: 'Robo-' + (i + 1), av: playAv(defaultAvatar('robo' + i)), robot: true}; };
  const t0 = [{name: S.player, av: playAv(myAvatar(S.player)), human: 1, pins: pinsOf(S.player)}], t1 = [];
  if(PD.MODES[SET.mode].drill) return [t0, [{name: 'Coach', av: playAv(defaultAvatar('coach')), robot: true}]];   // 🧑‍🏫 the Coach feeds you
  if(SET.who === 'team' && SET.p2) t0.push({name: SET.p2, av: playAv(myAvatar(SET.p2)), human: 2, pins: pinsOf(SET.p2)});
  if(SET.who === 'duo' && SET.p2) t1.push({name: SET.p2, av: playAv(myAvatar(SET.p2)), human: 2, pins: pinsOf(SET.p2)});
  let i = 0; while(t0.length < n) t0.push(bot(i++)); while(t1.length < n) t1.push(bot(i++));
  return [t0, t1];
}
function buildTeams(){
  const box = $('team-box'); SET.cfg = teamsCfg();
  const M = PD.newMatch({mode: SET.mode, level: SET.level, seed: 1, teams: SET.cfg});
  const seat = p => '<div class="seat' + (p.human === 1 ? ' me' : p.human === 2 ? ' p2' : ' bot') + '"' + (p.human === 2 ? ' data-p2="1" title="Tap to change"' : '') + '><canvas width="96" height="112" data-av="' + UI.esc(p.name) + '"></canvas><div class="nm">' + (p.human ? '' : '🤖 ') + UI.esc(p.name) + '</div><div class="rl">' + p.roles.map(r => PD.ROLE_ICON[r]).join('') + '</div></div>';
  const tm = t => '<div class="team t' + t + '"><div class="team-h">' + (t === 0 ? (PD.MODES[SET.mode].drill ? '🎯 You' : '🔥 Your team') : PD.MODES[SET.mode].drill ? '🧑‍🏫 Coach' : SET.who === 'duo' ? '⚔️ ' + UI.esc(SET.p2) + '\'s team' : '🤖 Robots') + '</div>' + M.players.filter(p => p.team === t).map(seat).join('') + '</div>';
  box.innerHTML = '<div class="teams">' + tm(0) + '<div class="vs">' + (PD.MODES[SET.mode].drill ? '🎯' : 'VS') + '</div>' + tm(1) + '</div>' + (LEVEL_UI[SET.level].hardcore ? '<div class="hc-note">💀 Hardcore: the fastest ball and the sharpest robots. ×3 points.</div>' : '')
    + (SET.who !== 'robot' ? '<div class="note" style="margin-top:8px">⌨️ ' + UI.esc(S.player) + ': W A S D + J K L · ' + UI.esc(SET.p2) + ': arrows + numpad 1 2 3 · tap ' + UI.esc(SET.p2) + ' to change</div>' : '');
  box.querySelectorAll('canvas[data-av]').forEach(c => { const p = M.players.find(q => q.name === c.dataset.av); drawPreviewCanvas(c, p ? p.av || myAvatar(p.name) : defaultAvatar('x'), {name: c.dataset.av, t: 1}); });
  const p2 = box.querySelector('[data-p2]'); if(p2) p2.onclick = () => { const o = others(); SET.p2 = o[(o.indexOf(SET.p2) + 1) % o.length]; savePrefs(); buildTeams(); };
}
function buildArenas(){
  const box = $('arena-list');
  box.innerHTML = ARENAS.map(a => '<button class="arena' + (a.k === SET.arena ? ' on' : '') + (a.soon ? ' soon' : '') + '" data-k="' + a.k + '" data-sound="tap"><canvas width="300" height="225"></canvas><div class="nm">' + a.icon + ' ' + a.name + '</div></button>').join('');
  box.querySelectorAll('.arena').forEach(b => { const a = ARENAS.find(x => x.k === b.dataset.k); pdArenaPaint(b.querySelector('canvas'), a.k);   /* 📏 pd-s */
    b.onclick = () => { SET.arena = a.k; savePrefs(); pdSetupBadge(); pdLogos(); /* 🏷️ pd-7 */ box.querySelectorAll('.arena').forEach(x => x.classList.toggle('on', x === b)); if(a.k === 'moon') UI.toast('🪐 Moon court: the ball floats — slow and high!'); }; });
  buildLooks();
}

/* ================= 🎨 LOOKS (pd-4c): 🎱 ball · 🏓 table · 💣 party balls — picked per player on this device ================= */
// ball = BallSkins (Collection 🎱 line, shared with Pinball / SlaBrall / BlasOff) · table = 🆕 TableSkins (Collection 🏓 line) · party balls = BombSkins (your 💣 Soul Bopper bombs)
// 🏭 Artifactory crafts count too (balls, boards / stands / signs / frames, bowls / lanterns …) — the family shares crafts.
const LOOKS = {ball: '', table: 'classic', bomb: ''};
function lookKey(kind, name){ return 'sp_pyradive_' + kind + ':' + (name || S.player); }
function ownBalls(name){ const n = Math.min((typeof BallSkins !== 'undefined') ? BallSkins.count : 0, Number((S.ballSkins || {})[name]) || 0), out = ['']; for(let i = 0; i < n; i++) out.push(String(i)); if((typeof BallSkins !== 'undefined') && BallSkins.artList) BallSkins.artList().forEach(a => out.push('art:' + a.id)); return out; }
function ownTables(name){ return (typeof TableSkins !== 'undefined') ? TableSkins.owned(Number((S.tableSkins || {})[name]) || 0) : ['classic']; }
function ownBombs(name){ if(!(typeof BombSkins !== 'undefined')) return ['']; const b = (S.bombs || {})[name] || {}; return [''].concat(BombSkins.owned({themes: b.themes || {}, extras: b.extras || []})); }
function lookOwned(kind, name){ return kind === 'ball' ? ownBalls(name) : kind === 'table' ? ownTables(name) : ownBombs(name); }
function lookGet(kind, name){ name = name || S.player; const own = lookOwned(kind, name), v = ls(lookKey(kind, name)); const def = kind === 'table' ? 'classic' : ''; return v != null && own.indexOf(v) >= 0 ? v : def; }
function lookSet(kind, v){ ls(lookKey(kind, S.player), v); LOOKS[kind] = v; saveLooks(); }
// 🎨 pd-4e: looks follow the PLAYER (Aowu 2026-11-14) — the server row PyraLooks_<Name> wins at start; every pick is saved to it. This device keeps a copy (offline + instant).
function seedLooks(all){ S.looksSrv = all || {}; Object.keys(S.looksSrv).forEach(n => { const o = S.looksSrv[n] || {}; ['ball', 'table', 'bomb'].forEach(k => { if(typeof o[k] === 'string') ls(lookKey(k, n), o[k]); }); }); }
function saveLooks(){ const n = S.player; if(!n || !window.google || !google.script || !google.script.run) return; const o = {ball: ls(lookKey('ball', n)) || '', table: ls(lookKey('table', n)) || 'classic', bomb: ls(lookKey('bomb', n)) || ''}; (S.looksSrv || (S.looksSrv = {}))[n] = o; google.script.run.withFailureHandler(() => {}).savePyraLooks(n, o); }
function loadLooks(){ ['ball', 'table', 'bomb'].forEach(k => { LOOKS[k] = lookGet(k); }); }
function ballV(v){ return v === '' || v == null ? null : /^\d+$/.test(v) ? Number(v) : v; }
function lookName(kind, v){
  if(kind === 'ball'){ const b = ballV(v); if(b == null) return 'Classic'; if(typeof b === 'number') return (BallSkins.NAMES || [])[b] || 'Skin ' + (b + 1); const a = BallSkins.artOf ? BallSkins.artOf(b) : null; return a ? (a.n || 'Crafted ball').replace(/^✨ /, '') : 'Crafted ball'; }
  if(kind === 'table') return TableSkins.nameOf(v);
  return v ? BombSkins.nameOf(v) : 'Star balls';
}
function paintLook(c, kind, v){
  const g = c.getContext('2d'), W = c.width, H = c.height; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  if(kind === 'table'){ TableSkins.preview(c, v); return; }
  if(kind === 'ball'){ const b = ballV(v); if(b == null){ const spr = PD.isStrike({sp: PD.MODES[SET.mode]}) ? takrawSprite(W * 0.7) : PD.MODES[SET.mode].sport === 'spark' ? sparkSprite(W * 0.7) : ballSprite(W * 0.7); g.drawImage(spr, (W - spr.width) / 2, (H - spr.height) / 2); } else BallSkins.draw(g, b, W / 2, H / 2, W * 0.36, 1); return; }
  if(!v){ const spr = partySprite(W * 0.7, 0); g.drawImage(spr, (W - spr.width) / 2, (H - spr.height) / 2); return; }
  BombSkins.draw(g, v, W / 2, H / 2, W * 0.8, 1);
}
const LOOK_KINDS = {ball: ['🎱', 'Ball', 'Your 🎱 ball skins from Pinball, SlaBrall, BlasOff + balls you crafted. Everyone in the match plays with it.'],
  table: ['🏓', 'Table', 'Play ⚡ PyraSpark to unlock 🏓 table looks (🎒 Collection). Every board, stand, sign or frame you craft in 🏭 Artifactory becomes a table top!'],
  bomb: ['💣', 'Party balls', 'The extra balls in 🌀 Spark Party wear your 💣 Soul Bopper bombs.']};
function buildLooks(){
  const row = $('look-row'); if(!row) return; loadLooks();
  const sp = PD.MODES[SET.mode] || {}, kinds = ['ball'].concat(sp.sport === 'spark' ? ['table'] : []).concat(SET.mode === 'party' ? ['bomb'] : []);
  row.innerHTML = kinds.map(k => '<button class="pdk-chip" data-look="' + k + '" data-sound="pop"><canvas width="60" height="60"></canvas>' + LOOK_KINDS[k][0] + ' ' + UI.esc(lookName(k, LOOKS[k])) + '</button>').join('');
  row.querySelectorAll('[data-look]').forEach(b => { paintLook(b.querySelector('canvas'), b.dataset.look, LOOKS[b.dataset.look]); b.onclick = () => openLooks(b.dataset.look); });
}
let LOOK_OPEN = '';
function openLooks(kind){
  LOOK_OPEN = kind; const K = LOOK_KINDS[kind], own = lookOwned(kind, S.player), cur = LOOKS[kind];
  $('look-title').textContent = K[0] + ' ' + K[1] + ' — ' + S.player; $('look-note').textContent = K[2];
  const grid = $('look-grid');
  grid.innerHTML = own.map(v => '<button class="pdk-opt' + (v === cur ? ' on' : '') + '" data-v="' + UI.esc(v) + '" data-sound="tap"><canvas width="96" height="96"></canvas>' + UI.esc(lookName(kind, v)) + '</button>').join('')
    + (kind !== 'bomb' ? '<button class="pdk-opt craft" data-craft="1" data-sound="pop">✨ Craft one in 🏭 Artifactory</button>' : '');
  grid.querySelectorAll('[data-v]').forEach(b => { paintLook(b.querySelector('canvas'), kind, b.dataset.v); b.onclick = () => { lookSet(kind, b.dataset.v); grid.querySelectorAll('.pdk-opt').forEach(x => x.classList.toggle('on', x === b)); buildLooks(); }; });
  const cr = grid.querySelector('[data-craft]'); if(cr) cr.onclick = () => kind === 'table' ? TableSkins.craftLink() : BallSkins.craftLink('lathe');
  $('look-sheet').classList.remove('hidden');
}
function closeLooks(){ LOOK_OPEN = ''; $('look-sheet').classList.add('hidden'); }

/* ================= KEYS (per player, per device) ================= */
function loadKeys(){ try{ const k = JSON.parse(ls('sp_pyradive_keys:' + S.player) || 'null'); if(Array.isArray(k) && k.length === 2) return k.map((s, i) => Object.assign({}, DEFAULT_KEYS[i], s)); }catch(e){} return DEFAULT_KEYS.map(k => Object.assign({}, k)); }
function saveKeys(){ ls('sp_pyradive_keys:' + S.player, JSON.stringify(KEYS)); }
function keyName(c){ return !c ? '—' : c === 'Space' ? 'Space' : c.startsWith('Key') ? c.slice(3) : c.startsWith('Digit') ? c.slice(5) : c.startsWith('Numpad') ? 'Num' + c.slice(6).replace('Decimal', '.').replace('Add', '+') : c.startsWith('Arrow') ? {ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→'}[c] : c.replace('Left', ' L').replace('Right', ' R'); }
let KEY_WAIT = null;
function openKeys(){ renderKeys(); $('keys-sheet').classList.remove('hidden'); }
function closeKeys(){ KEY_WAIT = null; $('keys-sheet').classList.add('hidden'); }
function resetKeys(){ KEYS = DEFAULT_KEYS.map(k => Object.assign({}, k)); saveKeys(); renderKeys(); }
function renderKeys(){
  $('keys-table').innerHTML = '<div class="krow"><span></span><span>Player 1</span><span>Player 2</span></div>' + ACTIONS.map(([a, n]) => '<div class="krow"><span>' + n + '</span>' + [0, 1].map(s => '<button class="keybtn' + (KEY_WAIT && KEY_WAIT.s === s && KEY_WAIT.a === a ? ' wait' : '') + '" data-s="' + s + '" data-a="' + a + '">' + (KEY_WAIT && KEY_WAIT.s === s && KEY_WAIT.a === a ? 'press…' : UI.esc(keyName(KEYS[s][a]))) + '</button>').join('') + '</div>').join('');
  $('keys-table').querySelectorAll('.keybtn').forEach(b => b.onclick = () => { KEY_WAIT = {s: +b.dataset.s, a: b.dataset.a}; renderKeys(); });
}
function keyCatch(e){
  if(!KEY_WAIT) return false; e.preventDefault(); const {s, a} = KEY_WAIT, code = e.code;
  for(let t = 0; t < 2; t++) for(const k in KEYS[t]) if(KEYS[t][k] === code){ KEYS[t][k] = KEYS[s][a]; }   // swap on a clash
  KEYS[s][a] = code; KEY_WAIT = null; saveKeys(); renderKeys(); return true;
}

/* ================= MATCH ================= */
function startMatch(){ if(!pdPartReady('play')) return pdNeed('play', startMatch);   /* 📏 pd-s */
  hideResult();
  const cfg = SET.cfg || teamsCfg();
  const cupOn = !!(SET.cupState && !SET.cupState.done), M = PD.newMatch({mode: SET.mode, level: SET.level, arena: SET.arena, control: SET.control, seed: (Date.now() % 100000) + 7, teams: cfg, oneSet: cupOn || undefined, target: cupOn ? CUP_TARGET[SET.level] : undefined});
  G = {M, cup: cupOn, level: SET.level, mode: SET.mode, who: SET.who, over: false, paused: false, held: false, t0: Date.now(), fx: [], words: [], cam: null, shake: 0, setScores: [], q: 1, ema: 16, last: 0, sticks: new Map(), keysDown: new Set(), seen: {}};
  G.locals = M.players.filter(p => p.own);   // people on this device (P1 = own 1) — 🎮 pd-8a: their OWN seats (the body they drive = PD.bodyOf)
  loadLooks(); G.look = {ball: ballV(LOOKS.ball), table: LOOKS.table || 'classic', bomb: LOOKS.bomb || ''};   // 🎨 pd-4c
  BTN = M.drill && isHoop(M) ? BTN_JUGGLE : isHoop(M) ? BTN_HOOP : PD.isSpark(M) ? BTN_SPARK : PD.isStrike(M) ? BTN_STRIKE : BTN_SPIKE;
  GC_LOG.length = 0;
  if(UI.modeTried) UI.modeTried(S.player, GAME_ID, cupOn ? 'cups' : SET.mode);
  showScreen('play'); BAR.fit();
  BAR.level(PD.LEVELS[SET.level].name + (LEVEL_UI[SET.level].hardcore ? ' 💀' : ''));
  resize(); buildPads(); barScore(); updateGuideUi(); freeSprites(); queueWarm(M);
  if(isTouch() && innerHeight > innerWidth * 1.05 && !ls('sp_pyradive_turn')){ ls('sp_pyradive_turn', '1'); banner('↻ Turn sideways for a bigger court', 'good', 2600); }
  else if(cupOn) banner(CUPS[SET.cupState.k].icon + ' ' + cupRoundName(SET.cupState) + ' · ' + PD.MODES[SET.mode].icon + ' first to ' + M.target, 'gold', 2400);
  else banner(PD.MODES[SET.mode].icon + ' ' + PD.MODES[SET.mode].name + ' · ' + (M.drill ? levelGoal(SET.mode, SET.level).split(' · ⭐')[0] + ' · ' + DRILL_GOAL[M.drill.k].split(' · ')[0] : M.setsTo > 1 ? 'best of 3 sets to ' + M.target : 'first to ' + M.target), 'good', 2400);
  cheerMount(); /* 📣 cs-pd */
  calloutSetup(); /* 💬 pd-9a */
  startLoop();
}
function startLoop(){ stopLoop(); G.last = performance.now(); const f = ts => { RAF = requestAnimationFrame(f); frame(ts); }; RAF = requestAnimationFrame(f); }
function stopLoop(){ if(RAF) cancelAnimationFrame(RAF); RAF = 0; }
function setPaused(on){ if(!G || G.over) return; G.paused = !!on; if(window.Cheer) Cheer.pause(G.paused); /* 📣 cs-pd */ if(!on) G.last = performance.now(); }
function pauseGame(){ setPaused(true); }
function leavePlay(){ if(window.Cheer) Cheer.unmount(); /* 💬 pd-9a off */ calloutOff(); stopLoop(); if(G) G.over = true; G = null; if(SET.cupState && SET.cup){ SET.mode = SET.cupState.sportBack || SET.mode; } SET.cupState = null; freeSprites(); hideResult(); $('pads').innerHTML = ''; renderMenu(); showScreen('menu'); }
function frame(ts){
  if(!G) return;
  let dt = Math.min(0.1, Math.max(0, (ts - G.last) / 1000)); G.last = ts;
  if(G.slow > 0){ G.slow -= dt; dt *= 0.35; }   // 🔥🔥 Spirit Dive slow motion
  G.ema = G.ema * 0.95 + dt * 1000 * 0.05;
  if(G.ema > 26 && G.q > 0.62){ G.q = Math.max(0.62, G.q * 0.85); G.ema = 16; resize(); }   // auto quality: lower the canvas pixels on slow devices
  if(!G.paused && !G.held && !G.over){
    readInput();
    PD.step(G.M, dt);
    handleEvents(PD.takeEvents(G.M));
  }
  updateGuideUi(); updatePads();
  draw(dt);
  warmStep(G.ema > 22 ? 1 : 2);
}
/* 📏 pd-s play#1 → PyraDive_play.html */
function bestiaryCount(){ const el = $('bestiary-n'); if(el && window.SpiritBestiary && S.player) el.textContent = SpiritBestiary.count(S.player) + ' / ' + SpiritBestiary.C.length; }
/* 📏 pd-s play#2 → PyraDive_play.html */
function rr(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
/* 📏 pd-s play#3 → PyraDive_play.html */
let BALL_SPR = {};
function takrawSprite(px){   // 🦶 a woven rattan ball: golden ring weave with round holes
  px = Math.max(8, Math.round(px / 2) * 2); const key = 't' + px; if(BALL_SPR[key]) return BALL_SPR[key];
  const c = document.createElement('canvas'), r = px / 2; c.width = c.height = px + 4; const g = c.getContext('2d'); g.translate(r + 2, r + 2);
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.35, 1, 0, 0, r); gr.addColorStop(0, '#FFE6A3'); gr.addColorStop(0.6, '#D9A441'); gr.addColorStop(1, '#9C6A1C');
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
  g.save(); g.beginPath(); g.arc(0, 0, r, 0, 7); g.clip(); g.fillStyle = 'rgba(70,40,5,0.75)';
  [[0, 0], [0.55, 0], [-0.55, 0], [0.28, 0.48], [-0.28, 0.48], [0.28, -0.48], [-0.28, -0.48]].forEach(([u, v]) => { g.beginPath(); g.arc(u * r, v * r, r * 0.17, 0, 7); g.fill(); });
  g.strokeStyle = 'rgba(255,240,200,0.55)'; g.lineWidth = Math.max(1, px * 0.05);
  for(let i = 0; i < 3; i++){ g.beginPath(); g.ellipse(0, 0, r * 0.95, r * 0.42, i * Math.PI / 3, 0, 7); g.stroke(); }
  g.restore(); g.strokeStyle = 'rgba(60,35,5,0.5)'; g.lineWidth = Math.max(1, px * 0.06); g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
  return (BALL_SPR[key] = c);
}
function sparkSprite(px){   // ⚡ the spark ball: white with blue lightning bands
  px = Math.max(8, Math.round(px / 2) * 2); const key = 's' + px; if(BALL_SPR[key]) return BALL_SPR[key];
  const c = document.createElement('canvas'), r = px / 2; c.width = c.height = px + 4; const g = c.getContext('2d'); g.translate(r + 2, r + 2);
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.35, 1, 0, 0, r); gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(0.7, '#E8F1FF'); gr.addColorStop(1, '#9BB6E0');
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.save(); g.beginPath(); g.arc(0, 0, r, 0, 7); g.clip();
  g.strokeStyle = '#2F7BEA'; g.lineWidth = Math.max(1.2, px * 0.11); g.lineJoin = 'round';
  [-0.35, 0.35].forEach(o => { g.beginPath(); g.moveTo(-r, o * r); g.lineTo(-r * 0.3, o * r - r * 0.25); g.lineTo(r * 0.1, o * r + r * 0.15); g.lineTo(r, o * r - r * 0.1); g.stroke(); });
  g.fillStyle = '#FFE14A'; g.beginPath(); g.moveTo(r * 0.05, -r * 0.5); g.lineTo(-r * 0.2, r * 0.05); g.lineTo(r * 0.02, r * 0.05); g.lineTo(-r * 0.08, r * 0.5); g.lineTo(r * 0.25, -r * 0.08); g.lineTo(r * 0.03, -r * 0.08); g.closePath(); g.fill();
  g.restore(); g.strokeStyle = 'rgba(20,40,90,0.45)'; g.lineWidth = Math.max(1, px * 0.06); g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
  return (BALL_SPR[key] = c);
}
function ballSprite(px){
  px = Math.max(8, Math.round(px / 2) * 2); if(BALL_SPR[px]) return BALL_SPR[px];
  const c = document.createElement('canvas'), r = px / 2; c.width = c.height = px + 4; const g = c.getContext('2d'); g.translate(r + 2, r + 2);
  g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
  g.save(); g.beginPath(); g.arc(0, 0, r, 0, 7); g.clip();
  [['#FF6B1A', 0], ['#2F7BEA', 2.1], ['#FFC845', 4.2]].forEach(([col, a]) => { g.fillStyle = col; g.beginPath(); g.ellipse(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.95, r * 0.36, a + 0.9, 0, 7); g.fill(); });
  g.restore(); g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = Math.max(1, px * 0.06); g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
  const hl = g.createRadialGradient(-r * 0.35, -r * 0.4, 1, 0, 0, r); hl.addColorStop(0, 'rgba(255,255,255,0.7)'); hl.addColorStop(0.5, 'rgba(255,255,255,0)'); g.fillStyle = hl; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
  if(Object.keys(BALL_SPR).length > 30) BALL_SPR = {};
  return (BALL_SPR[px] = c);
}
const PARTY_COL = ['#FF4D8D', '#9B5DE5', '#2FBF71'];
function partySprite(px, i){   // 🌀 a bouncy party ball: bright with a white star
  px = Math.max(8, Math.round(px / 2) * 2); const key = 'p' + i + ':' + px; if(BALL_SPR[key]) return BALL_SPR[key];
  const c = document.createElement('canvas'), r = px / 2, col = PARTY_COL[i % 3]; c.width = c.height = px + 4; const g = c.getContext('2d'); g.translate(r + 2, r + 2);
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.35, 1, 0, 0, r); gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(0.35, col); gr.addColorStop(1, col); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
  g.fillStyle = '#FFFFFF'; g.beginPath(); for(let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, rr2 = k % 2 ? r * 0.22 : r * 0.5; g.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } g.closePath(); g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = Math.max(1, px * 0.06); g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
  return (BALL_SPR[key] = c);
}
/* 📏 pd-s play#4 → PyraDive_play.html */

/* ================= RESULT + SAVES ================= */
function finishSoon(){ if(!G || G.over) return; G.over = true; setTimeout(() => { if(G && G.over) finishMatch(); }, FX ? 1500 : 30); }
function finishMatch(){
  if(G && G.M) PD.ctlHome(G.M);   /* 🎮 pd-8a: stats + meter back on your own seat */
  if(G.M.drill) return finishDrill();
  if(G.cup) return finishCupMatch();
  stopLoop(); const M = G.M, secs = Math.round((Date.now() - G.t0) / 1000), hc = !!LEVEL_UI[G.level].hardcore;
  $('hand').classList.add('hidden'); $('goal-line').classList.add('off');
  const sums = [0, 1].map(t => G.setScores.reduce((a, s) => a + s[t], 0));
  const people = G.locals, duo = G.who === 'duo';
  const me = people[0], won = M.winner === me.team, margin = sums[me.team] - sums[1 - me.team];
  const stars = won ? 1 + (margin >= 4 ? 1 : 0) + ((M.setsTo > 1 && M.teams[1 - me.team].sets === 0) || margin >= 7 ? 1 : 0) : 0;
  const nh = PD.noHands(M), statsOf = p => ({games: 1, wins: M.winner === p.team ? 1 : 0, hoops: p.st.hoops || 0, edges: p.st.edges || 0, spirits: p.st.spirits || 0, duos: p.st.duos || 0, trios: p.st.trios || 0, aces: p.st.aces, kills: p.st.kills, assists: p.st.assists, digs: p.st.digs + p.st.dives, dives: p.st.dives, blocks: p.st.blocks, stuffs: p.st.stuffs,
    traps: (p.st.traps || 0) + (nh && !PD.isSpark(M) ? p.st.bumps : 0), pops: p.st.pops || 0, feeds: p.st.feeds || 0, beasts: window.SpiritBestiary && p.human ? SpiritBestiary.count(p.name) : 0,
    sets: p.st.sets, bumps: nh ? 0 : p.st.bumps, dinks: p.st.dinks, dunks: p.st.dunks, drives: p.st.drives, pyras: p.st.pyras, rally: M.rallyMax, ['m_' + G.mode]: M.winner === p.team ? 1 : 0});
  const scoreOf = p => Math.round(((p.st.hoopPts || 0) * 30 + (p.st.passes || 0) * 2 + sums[p.team] * (isHoop(M) ? 10 : 50) + (M.winner === p.team ? 1000 : 0) + p.st.kills * 40 + p.st.aces * 60 + p.st.stuffs * 60 + (p.st.digs + p.st.dives) * 15 + p.st.pyras * 30 + M.rallyMax * 10) * (1 + G.level * 0.25) * (hc ? 3 : 1));
  const score = scoreOf(me), mode = PD.MODES[G.mode];
  NOTES.length = 0;
  const cardTxt = duo ? '⚔️ ' + UI.esc(teamName(M.winner)) + ' wins!' : won ? 'You won!' : 'So close!';
  const st = me.st;
  let h = '<div class="big">' + (won || duo ? '🏆' : '😅') + '</div><h2 class="' + (won || duo ? 'cheer' : '') + '">' + cardTxt + '</h2>'
    + '<canvas class="podium" id="res-podium" width="440" height="260"></canvas>'
    + '<div class="note">' + mode.icon + ' ' + mode.name + ' · ' + PD.LEVELS[G.level].name + ' · ' + (G.setScores.length > 1 ? 'sets ' + M.teams[0].sets + '–' + M.teams[1].sets + ' (' + G.setScores.map(s => s.join('–')).join(', ') + ')' : (G.setScores[0] || [0, 0]).join(' – ')) + '</div>';
  if(!duo) h += '<div class="rating">' + [1, 2, 3].map(i => '<span class="st' + (i <= stars ? '' : ' off') + '">⭐</span>').join('') + '</div><div class="score-big">🏆 ' + score.toLocaleString() + '</div>';
  const pl = (n, w, ws) => n + ' ' + (n === 1 ? w : ws || w + 's');
  if(isHoop(M)) h += '<div class="stats"><span>⭕ ' + pl(st.hoops || 0, 'hoop') + '</span><span>🏆 ' + (st.hoopPts || 0) + ' points</span><span>🦵 ' + pl(st.passes || 0, 'pass', 'passes') + '</span><span>🔥 ' + pl(st.pyras, 'Pyra move') + '</span></div>';
  else if(PD.isSpark(M)) h += '<div class="stats"><span>🚀 ' + pl(st.aces, 'ace') + '</span><span>💥 ' + pl(st.kills, 'point winner') + '</span><span>⚡ ' + pl(st.edges || 0, 'edge ball') + '</span><span>🔥 ' + pl(st.pyras, 'Pyra move') + '</span></div>';
  else h += '<div class="stats"><span>🚀 ' + pl(st.aces, 'ace') + '</span><span>💥 ' + pl(st.kills, 'kill') + '</span><span>🪶 ' + pl(st.assists, 'assist') + '</span><span>🛡️ ' + pl(st.digs + st.dives, 'save') + '</span><span>🧱 ' + pl(st.stuffs, 'stuff') + '</span><span>🔥 ' + pl(st.pyras, 'Pyra move') + '</span><span>🔁 rally ' + M.rallyMax + '</span></div>';
  if(!won && !duo) h += '<div class="note">💡 ' + pdPick(['Watch the 🎯 ring — be there before the ball comes down.', 'Use all 3 touches: bump → set → dunk.', 'Half a flame? Tap 🔥 before your dunk for a Pyra…Dunk!', 'A 🪶 dink drops softly behind their block.', 'Jump (Space) at the net when they dunk = a block!']) + '</div>';
  h += '<div class="save-note" id="save-note">' + (people.some(p => p.name !== 'Guest') ? '💾 Saving…' : '') + '</div>';
  h += '<div class="res-btns" id="res-btns"><button class="sp-btn sp-secondary" id="res-levels" data-sound="tap">🎚️ Levels</button><button class="sp-btn sp-secondary" id="res-again" data-sound="pop">🔁 Play again</button>'
    + (won && G.level < 5 && !duo ? '<button class="sp-btn sp-primary" id="res-next" data-sound="pop">Next level ▶</button>' : '') + '</div><div class="comics-slot" id="comic-strip-slot"></div>';
  showResult(h);
  paintPodium($('res-podium'), M);
  $('res-levels').onclick = () => leavePlay();
  $('res-again').onclick = () => { SET.cfg = null; startMatch(); };
  if($('res-next')) $('res-next').onclick = () => { leavePlay(); openSetup(G ? G.level + 1 : Math.min(5, SET.level + 1)); };
  if((won || duo) && FX) confetti(['🔥', '🏐', '⭐', '🎉'], 26);
  // saves: vs robots = a level result for every person on the team · ⚔️ 2 players = feats only (like the other games)
  people.forEach((p, i) => {
    if(p.name === 'Guest') return;
    if(duo) saveFeatsOnly(p.name, statsOf(p), i);
    else saveWin(p.name, G.level, {score: scoreOf(p), stars: M.winner === p.team ? stars : 0, cleared: M.winner === p.team, timeSec: secs, theme: mode.icon + ' ' + mode.name + ' · 🏟️ Classic', stats: statsOf(p)}, i);
  });
  if(UI.alsoTry) UI.alsoTry({player: S.player, game: GAME_ID, at: () => $('res-btns'), current: G.mode, open: id => { leavePlay(); msOpen(id); }});
  G.resultShown = true;
}
function finishDrill(){   // 🎯 pd-4a: a drill result — score, ⭐ by the level's targets, saved as a score (never unlocks a level)
  stopLoop(); const M = G.M, D = M.drill, secs = Math.round((Date.now() - G.t0) / 1000), hc = !!LEVEL_UI[G.level].hardcore, me = G.locals[0], mode = PD.MODES[G.mode];
  $('hand').classList.add('hidden'); $('goal-line').classList.add('off'); NOTES.length = 0;
  const pts = Math.round(D.score * 20 * (1 + G.level * 0.25) * (hc ? 3 : 1)), stars = D.stars;
  const stats = {games: 1, ['m_' + G.mode]: 1, ['drill_' + D.k]: D.score, ['streak_' + D.k]: D.bestStreak, pyras: me.st.pyras || 0};
  const line = D.k === 'zone' ? '🎯 ' + D.zoneHits + ' zone hit' + (D.zoneHits === 1 ? '' : 's') + ' · ✅ ' + D.hits + ' on the table' : D.k === 'combo' ? '🔗 ' + D.combos + ' combo' + (D.combos === 1 ? '' : 's') + ' · ✅ ' + D.hits + ' returns' : D.k === 'run' ? '🏃 ' + D.hits + ' returns · fastest ×' + D.spd.toFixed(2) : '🤹 ' + D.hits + ' touches';
  let h = '<div class="big">' + (stars ? '🏆' : '💪') + '</div><h2 class="' + (stars ? 'cheer' : '') + '">' + (stars === 3 ? 'Super training!' : stars ? 'Great training!' : 'Keep practising!') + '</h2>'
    + '<div class="note">' + mode.icon + ' ' + mode.name + ' · ' + PD.LEVELS[G.level].name + '</div>'
    + '<div class="rating">' + [1, 2, 3].map(i => '<span class="st' + (i <= stars ? '' : ' off') + '">⭐</span>').join('') + '</div><div class="score-big">' + D.score + ' <small>points</small></div>'
    + '<div class="stats"><span>' + line + '</span><span>🔁 best ' + D.bestStreak + ' in a row</span><span>🏆 ' + pts.toLocaleString() + '</span></div>'
    + '<div class="note">⭐ ' + D.targets[0] + ' · ⭐⭐ ' + D.targets[1] + ' · ⭐⭐⭐ ' + D.targets[2] + '</div>';
  if(stars < 3) h += '<div class="note">💡 ' + ({zone: 'Push the stick towards the zone before you hit — up = far, down = near.', combo: 'Tap 🦵 twice, then ⚡ while the ball is still HIGH.', run: 'Stay in the middle behind the table — the Coach aims everywhere.', juggle: 'Let it drop to your knee or foot, then head it — switching scores more.'})[D.k] + '</div>';
  h += '<div class="save-note" id="save-note">' + (me.name !== 'Guest' ? '💾 Saving…' : '') + '</div>';
  h += '<div class="res-btns" id="res-btns"><button class="sp-btn sp-secondary" id="res-levels" data-sound="tap">🎚️ Levels</button><button class="sp-btn sp-secondary" id="res-again" data-sound="pop">🔁 Again</button>'
    + (stars && G.level < 5 && canPlay(G.level + 1) ? '<button class="sp-btn sp-primary" id="res-next" data-sound="pop">Next level ▶</button>' : '') + '</div><div class="comics-slot" id="comic-strip-slot"></div>';
  showResult(h);
  $('res-levels').onclick = () => leavePlay();
  $('res-again').onclick = () => { SET.cfg = null; startMatch(); };
  if($('res-next')) $('res-next').onclick = () => { const nx = G ? G.level + 1 : Math.min(5, SET.level + 1); leavePlay(); openSetup(nx); };
  if(stars && FX) confetti(['🎯', '⭐', '🔥', '🎉'], 20);
  if(me.name !== 'Guest') saveWin(me.name, G.level, {score: pts, stars, cleared: false, drill: true, timeSec: secs, theme: mode.icon + ' ' + mode.name + ' · 🏟️ Classic', stats}, 0);
  if(UI.alsoTry) UI.alsoTry({player: S.player, game: GAME_ID, at: () => $('res-btns'), current: G.mode, open: id => { leavePlay(); msOpen(id); }});
  G.resultShown = true;
}
/* 📏 pd-s cups#1 → PyraDive_cups.html */
const PENDING_KEY = 'sp_pyradive_pending';
const NOTES = [];
function readPending(){ try{ return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); }catch(e){ return []; } }
function writePending(list){ try{ localStorage.setItem(PENDING_KEY, JSON.stringify(list.slice(-20))); }catch(e){} }
function flushPending(){ const list = readPending(); if(!list.length) return; writePending([]); list.forEach(w => { const r = google.script.run.withFailureHandler(() => writePending(readPending().concat([w]))); if(w.feats) r.saveFeats(w.name, GAME_ID, w.stats); else r.saveLevelResult(GAME_ID, w.name, w.lvl, w.extra); }); }
function putNote(i, html){ NOTES[i] = html; const n = $('save-note'); if(n) n.innerHTML = NOTES.filter(Boolean).join('<br>'); }
function saveWin(name, lvl, extra, seat, tries){
  tries = tries || 0; const p = S.progress[name] || (S.progress[name] = {unlocked: 0, tokens: [], best: []});
  const who = G && G.locals.length > 1 ? UI.esc(name) + ': ' : '';
  google.script.run.withSuccessHandler(res => {
      const best = (p.best || []).slice(); if(res && res.best) best[lvl] = res.best;
      S.progress[name] = {unlocked: res ? res.unlocked : p.unlocked, tokens: res ? res.tokens : p.tokens, best}; flushPending(); putNote(seat, who + saveText(res || {}, extra.cleared, extra.drill, extra.cup));
    }).withFailureHandler(() => {
      if(tries < 1){ setTimeout(() => saveWin(name, lvl, extra, seat, tries + 1), 1200); return; }
      writePending(readPending().concat([{name, lvl, extra}])); putNote(seat, who + '⚠️ Could not save yet — it will be sent again next time.');
    }).saveLevelResult(GAME_ID, name, lvl, extra);
}
function saveFeatsOnly(name, stats, seat){
  google.script.run.withSuccessHandler(res => putNote(seat, UI.esc(name) + ': ' + featText(res, '✅ Feats saved')))
    .withFailureHandler(() => { writePending(readPending().concat([{name, feats: true, stats}])); putNote(seat, UI.esc(name) + ': ⚠️ Will be sent next time.'); }).saveFeats(name, GAME_ID, stats);
}
function featText(fe, base){ let h = base || ''; if(fe){ (fe.newTitles || []).forEach(t => { h += '<br><span class="title-new">🏷️ New title: ' + t.icon + ' ' + UI.esc(t.name) + '</span>'; }); (fe.newBadges || []).forEach(b => { h += '<br><span class="feat-new">' + b.medal + ' ' + b.icon + ' ' + UI.esc(b.name) + ' · ' + b.tierName + '</span>'; }); } return h; }
function saveText(res, cleared, drill, cup){
  if(cup) return featText(res.feats, (cup === 'champion' ? '🏆 Cup win saved!' : '✅ Cup result saved') + (res.newHighScore && !res.firstTime ? ' · 🎉 New best!' : '') + (res.newBadge ? '<br><span class="new-badge">🏅 New badge: ' + UI.esc(res.newBadge) + '</span>' : ''));
  if(drill) return featText(res.feats, res.newHighScore && !res.firstTime ? '🎉 New training best!' : '✅ Training saved');
  const h = res.newBadge ? '<span class="new-badge">🏅 New badge: ' + UI.esc(res.newBadge) + '</span>' : res.newHighScore && !res.firstTime ? '🎉 New high score!' : cleared ? (res.best && res.best.score ? 'Best: 🏆 ' + Number(res.best.score).toLocaleString() : '✅ Saved') : '✅ Feats saved — win to unlock the next level';
  return featText(res.feats, h);
}
/* 📣 CHEERSQUAD (cs-pd) START — the live crowd in front of the painted stands (CheerSquad.html, 📣 Cheer chat). Don't remove: the Cheer chat re-applies it. */
// sides: 0 = left / orange (the people) · 1 = right / blue (robots, or a 2nd person). Fans = family members not on court (robots may carry family names: those stay out too).
function cheerMount(){
  if(!window.Cheer || !G || !G.M) return; Cheer.unmount(); const M = G.M, on = new Set(M.players.map(p => p.name)), hum = t => M.players.some(p => p.team === t && p.human);
  const nm = t => { const p = M.players.find(q => q.team === t && q.human) || M.players.find(q => q.team === t); return p ? p.name : ['Orange', 'Blue'][t]; };
  Cheer.mount($('stage'), {game: 'pyraspike', players: [{name: nm(0), side: 0, human: hum(0) || !hum(1)}, {name: nm(1), side: 1, human: hum(1)}], me: {name: S.player},
    family: (S.players || []).map(p => p.Name).filter(n => !on.has(n)), avatars: S.avatars || {}, mode: 'scene', ref: $('court'),
    avoid: () => Array.from(document.querySelectorAll('#gbar, .top-btn, #pads > *, #keylegend:not(.hidden)')), clear: () => true});   /* the court, net and players paint over the crowd anyway */
}
// the stands band: 2 staggered rows (front row on the band's bottom edge, back row smaller + higher, half a step over), gaps where the game draws its own things
function cheerScene(g, M, W, H, farY, top){
  if(!window.Cheer || !G || G.M !== M || !Cheer.active()) return; const bh = farY - top; if(bh < 18) return;   /* phones upright: the band is too thin (never shrink the court) */
  const k1 = Math.min(1.05, bh * 0.92 / 100) * (Cheer.stats().size === 'party' ? 1 : 0.92), k2 = k1 * 0.86, two = bh > 46, step = Math.max(26, 46 * k1), gaps = [];
  if(!isHoop(M) && !PD.isSpark(M)){ const r = Math.max(7, Math.min(16, V.k * 0.26)); gaps.push([P(0, -M.W / 2 - 0.45, 0)[0], 14 + 16 * k1]); [0, 1].forEach(t => gaps.push([V.short ? W * (t ? 0.82 : 0.18) : Math.max(r * 4, Math.min(W - r * 4, P(PD.sgn(t) * M.L * 0.5, -M.W / 2 - FEX(), 0)[0])), r * 4.6]));   /* 📱 pd-5b: the counters' spot */
  }
  if(isHoop(M)) gaps.push([P(0, 0, 0)[0], V.k * 1.1 + 20]);   /* the hoop + its ropes */
  if(PD.isSpark(M)) gaps.push([W / 2, Math.min(W * 0.12, V.k * 0.9) + 16]);   /* the table's net posts */
  const shot = top > 150 ? Math.min(220, W * 0.3) / 2 + 14 : 0;   /* the big score screen above the stands */
  const free = (x, back) => !gaps.some(([gx, gw]) => Math.abs(x - gx) < gw) && !(back && shot && Math.abs(x - W / 2) < shot);
  const key = [Math.round(W), Math.round(farY), Math.round(top), two, Cheer.stats().size].join('|');
  if(G.cheerKey !== key){ G.cheerKey = key; const c = [];
    for(let x = step * 0.6; x < W - step * 0.4; x += step) if(free(x, false)) c.push({id: 'f' + Math.round(x), x, y: farY - 2 - 5 * k1, k: k1, half: x < W / 2 ? 0 : 1});
    if(two) for(let x = step * 1.1; x < W - step * 0.4; x += step) if(free(x, true)) c.push({id: 'b' + Math.round(x), x, y: farY - bh * 0.42, k: k2, half: x < W / 2 ? 0 : 1});
    c.sort((a, b) => (a.id[0] === b.id[0] ? 0 : a.id[0] === 'f' ? -1 : 1) || Math.abs(a.x - W / 2) - Math.abs(b.x - W / 2));   /* front row first, near the middle first */
    G.cheerOrder = c; }
  Cheer.place(g, G.cheerOrder, {key: 'stands', w: W, h: H});
}
// small wins get a 1.2 s breather (a fast rally isn't a wall of cheers); big ones, misses and the ends always play
function cheerSay(kind, side){ if(!kind || !window.Cheer || !Cheer.active() || !G) return; const now = performance.now();
  if(kind === 'goal' && (G.cheerAt || 0) > now - 1200) return; if(kind === 'big' && (G.cheerBig || 0) > now - 700) return;
  if(kind === 'goal') G.cheerAt = now; if(kind === 'big'){ G.cheerBig = now; G.cheerAt = now; } Cheer.react(kind, {side: side == null ? 0 : side}); }
function cheerEvent(e, M){ if(!window.Cheer || !Cheer.active() || !G) return; const tm = e.team != null ? e.team : e.p != null && M.players[e.p] ? M.players[e.p].team : 0;
  switch(e.k){
    case 'serveReady': case 'serveToss': Cheer.hush(true); break;   /* 🤫 quiet for the serve */
    case 'serve': Cheer.hush(false); break;
    case 'kill': cheerSay(e.pyra || e.spirit ? 'big' : 'goal', tm); break;
    case 'ace': case 'stuff': cheerSay('big', tm); break;
    case 'pyra': cheerSay('big', tm); break;
    case 'spirit': case 'teamSpirit': cheerSay('big', -1); break;   /* everyone stands for a creature */
    case 'edge': Cheer.react('close', {side: -1}); setTimeout(() => cheerSay('goal', tm), 700); break;
    case 'longRally': if(e.n >= 10 && e.n % 5 === 0) Cheer.react('close', {side: -1}); break;
    case 'fault': case 'out': case 'serveMiss': Cheer.hush(false); Cheer.react('miss', {side: tm}); break;
    case 'point': Cheer.hush(false); if(e.why === 'in' || e.why === 'drop') cheerSay('goal', tm); break;
    case 'setPoint': case 'matchPoint': Cheer.react('close', {side: tm}); break;
    case 'comeback': Cheer.react('comeback', {side: tm}); break;
    case 'hoop': case 'partyPoint': cheerSay('goal', tm); break;
    case 'drillHit': if(e.streak === 5 || e.streak === 10) cheerSay(e.streak >= 10 ? 'big' : 'goal', 0); break;
    case 'drillEnd': Cheer.hush(false); Cheer.react(e.stars >= 3 ? 'win' : e.stars ? 'goal' : 'lose', {side: 0}); break;
    case 'match': { Cheer.hush(false); const w = e.winner, duo = M.players.some(p => p.team === 1 && p.human) && M.players.some(p => p.team === 0 && p.human);
      if(w == null || w < 0) Cheer.react('goal', {side: -1}); else if(duo || w === 0) Cheer.react('win', {side: w}); else Cheer.react('lose', {side: 0}); break; }
  } }
function cheerChamp(){ if(window.Cheer && Cheer.active()){ Cheer.react('win', {side: 0}); setTimeout(() => { if(window.Cheer && Cheer.active()) Cheer.react('big', {side: -1}); }, 1600); } }   /* 🏆 the biggest win */
function cheerFaces(){ setTimeout(() => { const card = $('result-card'); if(!card || !window.Cheer || !Cheer.active() || card.querySelector('.cs-faces') || $('result').classList.contains('hidden')) return;
  const c = Cheer.faces(5, {h: 54}); if(!c) return; const cap = document.createElement('div'); cap.className = 'cs-faces-cap'; cap.textContent = '📣 Your cheer squad';
  const at = card.querySelector('.res-btns'); if(at) { at.parentNode.insertBefore(c, at); at.parentNode.insertBefore(cap, at); } else { card.appendChild(cap); card.appendChild(c); } }, 900); }
/* 📣 CHEERSQUAD END */
function showResult(html){ /* 💬 pd-9a result */ calloutOff(); $('result-card').innerHTML = html; pdResultBadge(); /* 🏷️ pd-7 */ $('result').classList.remove('hidden'); cheerFaces(); /* 📣 cs-pd */ }
function hideResult(){ $('result').classList.add('hidden'); }
function confetti(list, count){ for(let i = 0; i < (count || 24); i++){ const e = document.createElement('div'); e.className = 'confetti'; e.textContent = pdPick(list); e.style.left = Math.random() * 100 + 'vw'; e.style.animationDuration = (1.6 + Math.random() * 1.6) + 's'; e.style.animationDelay = (Math.random() * .5) + 's'; document.body.appendChild(e); setTimeout(() => e.remove(), 3800); } }
function sessionQuery(){ let q = ''; if(S.player || CURRENT_PLAYER) q += '&player=' + encodeURIComponent(S.player || CURRENT_PLAYER); if(SESSION_START) q += '&sessionStart=' + SESSION_START; if(DURATION_MIN) q += '&durationMin=' + DURATION_MIN; return q; }
function goBack(){ UI.back(WEBAPP_URL + '?page=gameroom' + sessionQuery(), 'rooms'); }
window.feedbackContext = () => ({page: 'PyraDive', game: GAME_ID, level: G ? G.level : SET.level, mode: SET.mode});
window.addEventListener('resize', () => { if(G && !$('scr-play').classList.contains('hidden')){ resize(); buildPads(); } });
(function(){   // 📱 ls-1b OWN SIDEWAYS GUARD (pd-5f, from ✨ polish ls-1b): iPhone sideways can skip the last 'resize' → watch the play box itself
  if(!window.ResizeObserver) return;
  const box = id => { const e = document.getElementById(id); return e ? e.clientWidth + 'x' + e.clientHeight : '-'; };
  const watch = (scr, boxes, ok, run) => { let last = null, n = 0, t0 = 0, later = 0;
    const check = () => { const s = document.getElementById(scr);
      if(!s || s.classList.contains('hidden') || !ok()){ last = null; return; }          // only while that screen is open
      const k = [scr].concat(boxes).map(box).join('|'); if(k === last) return;                          // same size → nothing (no loops)
      const now = Date.now(); if(now - t0 > 1000){ t0 = now; n = 0; }
      if(++n > 4){ if(!later) later = setTimeout(() => { later = 0; check(); }, 1000); return; }   // safety net: ≤ 4 runs a second
      last = k; const R = window.LS1B_RUNS || (window.LS1B_RUNS = {}); R[scr] = (R[scr] || 0) + 1;   // run count per screen (tests + device checks)
      try{ run(); }catch(e){ if(window.console) console.warn('ls-1b', scr, e); } };
    const ro = new ResizeObserver(check); [scr].concat(boxes).forEach(id => { const e = document.getElementById(id); if(e) ro.observe(e); }); };
  watch('scr-play', [], () => !!G, () => { resize(); buildPads(); });
})();   // 📱 ls-1b END

/* ================= BOOT ================= */
function boot(){
  UI.loading('pyraspike');
  google.script.run.withSuccessHandler(d => {
      UI.loaded();
      S.players = d.players || []; S.progress = d.progress || {}; S.settings = d.settings || {}; S.avatars = d.avatars || {}; S.ballSkins = d.ballSkins || {}; S.tableSkins = d.tableSkins || {}; S.bombs = d.bombs || {}; seedLooks(d.looks || {}); if(window.SpiritBestiary) S.players.forEach(p => { if(p.Name !== CURRENT_PLAYER) SpiritBestiary.load(p.Name); });   /* 🎨 ⭐ pd-4e: looks + pins of every family player */
      UISound.applySettings(S.settings);
      const lockOn = !(S.settings.ScreenTimeLockEnabled === 'FALSE' || S.settings.ScreenTimeLockEnabled === false);
      lockHandle = UI.screenTimeLock({sessionStart: SESSION_START, durationMin: DURATION_MIN, enabled: lockOn, homeUrl: WEBAPP_URL + '?page=home', onLock: pauseGame});
      flushPending();
      if(CURRENT_PLAYER && S.players.some(p => p.Name === CURRENT_PLAYER)) choosePlayer(CURRENT_PLAYER); else { renderPlayers(); showScreen('player'); }
      if(UI.guideOnce) UI.guideOnce('pyradive', [UI.gameHelp(GAME_ID, 'PyraDive', '🔥')].filter(Boolean));
    }).withFailureHandler(() => { UI.loaded(); UI.toast('Could not load players — check the connection', 'err'); renderPlayers(); showScreen('player'); })
    .getLevelGameData(GAME_ID, CURRENT_PLAYER);
}
boot();
