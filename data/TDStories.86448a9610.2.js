
const WEBAPP_URL = SP_TV[0];
const CURRENT_PLAYER = SP_TV[1]; window.SP_PAGE = SP_TV[2];
UI.applyTheme(UI.cachedTheme(CURRENT_PLAYER), {kitOnly: true});   // loader + menus in the player's look before the server answers
const SESSION_START = Number(SP_TV[3]) || null;
const DURATION_MIN = Number(SP_TV[4]) || null;
const MODE_LINK = SP_TV[5];   // ✨ ?mode=draprincess opens that book once, after the player pick
const GAME_ID = 'tdstories';
// 🏰 own loader + how-to (UiKit is the ✨ polish lane — registered here at runtime; the 2-line UiKit anchor is asked under Open questions)
if(UI.KINDS && !UI.KINDS.tdstories) UI.KINDS.tdstories = ['🏰', 'Opening the story books', 'bob'];
if(UI.GAME_HELP && !UI.GAME_HELP.tdstories) UI.GAME_HELP.tdstories = ['Story books where you defend a tower: keep the enemies away until the last wave.',
  'Before each wave every hero levels up — pick ONE skill card. Tap the round coloured buttons to use skills (they also go off by themselves on easy levels).',
  'One skill of each colour 🔴🔵🟤🟢🟣, up to Lv 3. Tier 5 = ⭐ evolve, tier 10 = ⭐ ULTIMATE!'];
window.FX = window.FX == null ? 1 : window.FX;   // tests set 0: no long animations
// 🎛️ the shared top bar (UiKit UI.gameBar): ◀ where you came from · 🎚️ Levels · 🏠 | 🏰 TD-Stories · level | ❤️ · 🔁 wave · ⭐ | ⏸ ❓ ⏩ ⚙️
const BAR = UI.gameBar(document.getElementById('gbar'), {game: GAME_ID, icon: '🏰', name: 'TD-Stories', levelId: 'hud-level',
  levels: () => leavePlay(), playing: () => !!(G && G.state !== 'won' && G.state !== 'lost'), onLeave: () => stopLoop(),
  pause: {pause: () => { if(G && !G.paused){ G.paused = true; G.barPz = 1; } }, resume: () => { if(G && G.barPz){ G.barPz = 0; G.paused = false; last = 0; } }}, pauseButton: true,
  onFit: () => layout(), scoreMin: '6ch',
  extras: [{id: 'speed-btn', icon: '⏩', label: 'Speed ×2', onClick: () => toggleSpeed(), keep: true}]});
var NAV_INNER = {levels: ['◀ TD-Stories', () => openShelf()], diary: ['◀ Dra-Princess Diary', () => openBook(S.book)]};
UI.navBar(document.getElementById('back-btn'), {onclick: false});
const $ = id => document.getElementById(id);
const COLS = SkillKit.COLS, COLORS = SkillKit.COLORS;
const AGE_START = {'4-5': 0, '6-7': 1, '8-9': 2, '10+': 3};
let LEVELS = [];   // 📏 s-td: the 6 house levels — set by tdBookLevels() once a book file is in (🐉 TD's table whenever it is in, as before)
const TD_MID = 8;   // 📏 s-td: the island centre in world units — 🐉 TD.CX = TD.CY = 👨‍🌾 FD.CX = FD.CY = 8; the shared painters read this so either book plays alone

/* ================= 📚 the books (page side: covers, diary pages, lesson cards) ================= */
const SHELF = [
  {id: 'draprincess', title: 'Dra-Princess Diary', icon: '🐉👑', sub: 'A princess, a dragon and far too many suitors', b1: '#FF5C9A', b2: '#7B4FE0'},
  {id: 'farmer', title: 'Farmer Delusion', icon: '👨‍🌾🍄', sub: 'Trick the money collector with a mushroom maze', b1: '#7CC25A', b2: '#C27A2E'},   // 👨‍🌾 fd-1: open
  {id: 'coral', title: 'Coral Keeper', icon: '🐙🪸', sub: 'A little octopus guards the last reef', b1: '#2EC4E6', b2: '#2F5BD8', soon: true},
  {id: 'night', title: 'Night Market Guardian', icon: '🐱🏮', sub: 'A street cat vs. hungry snack ghosts', b1: '#FF9F43', b2: '#5B2A86', soon: true},
];
const DIARY = {
  draprincess: {
    1: {intro: 'Dear Diary,\nAnother knight came today with ANOTHER bouquet. 💐 I do not want a knight.\nThen a little dragon landed on my window. He sneezed sparks and made me laugh. 🐉✨\nNow the knights are coming back… with squires and BARDS. Help!',
        outro: 'Dear Diary,\nSir Bouquet slipped on his own flowers and rolled into the pond! 💦\nThe little dragon is called Ember now. He is not so little any more…',
        lessons: [['🏰', 'Round towers', 'Many castle towers were ROUND. A round wall has no corners, so it is stronger and harder to climb.'],
                  ['🌊', 'Moats', 'A moat is a ditch full of water around a castle. Visitors had to cross a bridge — and the bridge could be pulled up!']]},
    2: {intro: 'Dear Diary,\nEmber sleeps under my window every night. 🌙\nNow PRINCES come too, singing terrible songs. 🎻 And a cupid keeps shooting love arrows at my books!\nThe dragon says: "Leave it to me." 🔥',
        outro: 'Dear Diary,\nSir Shiny polished his armour SO much that he dazzled himself and walked into the moat. ✨💦\nEmber gave me one of his warm scales. I think… I love this dragon. ❤️',
        lessons: [['🐉', 'Dragons around the world', 'Dragon stories are told everywhere. In China dragons bring rain and good luck; in old European tales they guard treasure.'],
                  ['🦎', 'A real dragon', 'Komodo dragons are real lizards from Indonesia — the biggest lizards on Earth, as long as a sofa!']]},
    3: {intro: 'Dear Diary,\nWord got out that I said NO to two knights. Now EVERY prince in the land wants to try. 🤴🤴🤴\nThey come down the north road too, with roses, poems and a cupid who never stops shooting.\nEmber is practising his scariest roar. It sounds like a hiccup. 🔥',
        outro: 'Dear Diary,\nPrince Charmless sang for one whole hour. Then Ember hiccupped a ring of fire and the prince\'s wig flew into the moat. 👑💦\nThe princes went home to write sad songs. Ember fell asleep on my balcony. 💤',
        lessons: [['🤴', 'Real princes', 'A prince is the son of a king or queen. Long ago princes learned riding, sword-fighting… and dancing!'],
                  ['🌹', 'Rose thorns', 'Rose "thorns" are really prickles. They grow on the skin of the stem, so they snap off easily — and they stop animals from eating the plant.']]},
    4: {intro: 'Dear Diary,\nA wizard called Archmage Crush wants to marry me with a LOVE POTION. 🧪\nHis wizards can charm my castle mice so they walk to THEIR side! 🐭💘 And gift carts full of chocolate keep my helpers busy eating.\nTonight Ember gave me a warm little stone that beats like a heart. ❤️‍🔥 A piece of his Dragon Heart.',
        outro: 'Dear Diary,\nThe Archmage drank his own potion by mistake and fell in love… with a mop. 🧹💕\nI hold the Dragon Heart and I can feel magic in my fingers. ✨ Ember is bigger now — his scales glow pink when he is happy.',
        lessons: [['🧙', 'Wizards and alchemists', 'Merlin is the most famous story wizard. Real people long ago called "alchemists" mixed potions trying to turn metal into gold — and found new science instead!'],
                  ['❤️', 'Your own heart', 'Your heart beats about 100,000 times a day. A tiny hummingbird\'s heart beats very fast; a huge whale\'s beats very slowly.']]},
    5: {intro: 'Dear Diary,\nKINGS. Real kings, with crowns and gold and a whole army. 👑💰\nKing Goldbeard says he will BUY the tower. It is NOT for sale!\nWhen a king reads his Royal Decree, all the suitors run faster. Four roads now… Ember and I need a plan.',
        outro: 'Dear Diary,\nKing Goldbeard\'s beard got stuck in his own treasure chest. 🧔💰 His army carried him home like a sofa.\nMy magic is strong now. Ember calls me "Sage". I like it. 🔮',
        lessons: [['👑', 'Heavy crowns', 'Crowns are heavy! The St Edward\'s Crown in London weighs over 2 kg — about as much as a big bag of rice.'],
                  ['💰', 'Gold never rusts', 'Gold does not rust. Gold coins from shipwrecks hundreds of years old can still shine after a little cleaning.']]},
    6: {intro: 'Dear Diary,\nThe biggest suitor of all is coming: Emperor Heartthrob — with EVERY knight, prince, wizard and king behind him. 💘\nEmber and I are not scared. We are a team. 🐉👑\nThis is the last page before the big day…',
        outro: 'Dear Diary,\nEmperor Heartthrob slipped on 1,000 rose petals and slid all the way back to his empire. 🌹💨\nNobody else is coming. The roads are quiet. Ember looked at me and said: "Shall we fly?"',
        lessons: [['🏴', 'A dragon on a flag', 'The flag of Wales has a big red dragon on it. The red dragon has been a sign of Wales for well over a thousand years.'],
                  ['🎆', 'Fireworks', 'Fireworks were first made in China more than 1,000 years ago. Today the colours come from metals: copper makes blue, strontium makes red.']],
        ending: 'Dear Diary,\nThis is my very last page.\nEmber built us a castle on the mountain, all of warm red stone. 🏯🐉\nThe suitors? They come for tea on Sundays. They are much nicer now. 🫖\nDragon and me, forever. ❤️\n— THE END —',
        endingLesson: ['📖', 'Keep a diary!', 'Writing a few lines every day helps you remember. Try it tonight: what was the funniest thing that happened today?']},
    jail: {intro: 'Dear Diary (it\'s Ember writing — the Princess can\'t!),\nThe suitors got into the tower and carried her off to a WEDDING. 💍😱\nThey locked me in the dungeon with a pink ribbon round my wings. A ribbon. Really.\nThe wedding starts after 5 bells. Time to break out! 🔥⛓️',
        outro: 'Dear Diary,\nThe chapel doors flew open. Ember stood there, ribbons burning, and ROARED:\n"I OBJECT!!" 🐉🔥\nThe groom fell face-first into the wedding cake. 🎂 We flew home over the moat. 💖\nNow — back to the tower. This time we hold it!',
        lessons: [['⛓️', 'Dungeons', 'The word "dungeon" comes from "donjon" — the French name for a castle\'s strongest tower, the keep. Later it meant the prison underneath.'],
                  ['🔔', 'Bells', 'Before phones, bells told a whole town the news: a wedding, a fire, or time to come home for dinner.']]},
  },
};
const SCENES = {meadow: {g1: '#A8E07F', g2: '#7CC95E', path: '#F3D9A4', edge: '#D9B26F', deco: ['🌸', '🌼', '🌷', '🌳', '🍄']},
                sunset: {g1: '#9FD27A', g2: '#6FB35A', path: '#F2CFA0', edge: '#D3A065', deco: ['🌻', '🌹', '🌳', '🪨', '🌾'], tint: 'rgba(255,140,90,.16)'}};

/* ================= STATE ================= */
let S = {players: [], progress: {}, settings: {}, avatars: {}, player: '', age: '', book: 'draprincess', chapter: 1, level: 0, jail: null};
let G = null, lockHandle = null, raf = 0, last = 0, FT = [], BG = null, VIEW = {s: 20, px: 320, dpr: 1}, guideUsed = 0, pickOpen = false, HAND = null, autoOn = false, speedOn = false;
function myAvatar(name){ const a = S.avatars[name || S.player]; return a ? fixAv(a) : defaultAvatar(name || S.player || 'reader'); }
function saveRow(name, book){ try{ return JSON.parse(S.settings['SkillTree_td-' + (book || S.book) + '_' + (name || S.player)] || '{}') || {}; }catch(e){ return {}; } }   // fd-1: per book
function chaptersDone(name, book){ const r = saveRow(name, book), p = progressOf(name || S.player, book); return Math.max(Number(r.ch) || 0, 0) || (p.unlocked > 0 && !r.ch ? 1 : 0); }
function progMap(book){ return (book || S.book) === 'farmer' ? (S.progressFarmer || (S.progressFarmer = {})) : S.progress; }   // 👨‍🌾 fd-1: each book has its own board
function progressOf(name, book){ return progMap(book)[name] || {unlocked: 0, tokens: [], best: []}; }
function canPlay(i){ const p = progressOf(S.player); if(i === 5) return p.unlocked >= 5; if(i === 4) return p.unlocked >= 4; return i <= Math.max(p.unlocked, AGE_START[S.age] || 0); }
function sessionQuery(){ let q = ''; if(S.player || CURRENT_PLAYER) q += '&player=' + encodeURIComponent(S.player || CURRENT_PLAYER); if(SESSION_START) q += '&sessionStart=' + SESSION_START; if(DURATION_MIN) q += '&durationMin=' + DURATION_MIN; return q; }
function goBack(){ UI.back(WEBAPP_URL + '?page=gameroom' + sessionQuery(), 'rooms'); }   // 🧭 ◀ = where you came from (Gameroom if we don't know)

/* ================= MENUS ================= */
function showScreen(name){
  ['player', 'menu', 'levels', 'diary', 'play'].forEach(s => $('scr-' + s).classList.toggle('hidden', s !== name));
  $('back-btn').classList.toggle('hidden', name === 'play'); UI.navScreen($('back-btn'), name, NAV_INNER);
  if(name !== 'play') hideHand();
  window.scrollTo(0, 0);
}
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
  $('who-name').textContent = name;
  try{ autoOn = localStorage.getItem('sp_td_auto:' + name) === '1'; }catch(e){}
  const id = UI.modeLink ? UI.modeLink(MODE_LINK) : '';
  if(id === 'draprincess' || id === 'farmer') openBook(id); else openShelf();
}
function changePlayer(){ renderPlayers(); showScreen('player'); }
function openShelf(){
  const box = $('shelf'); box.innerHTML = '';
  SHELF.forEach(b => { const el = document.createElement('button'); el.className = 'book' + (b.soon ? ' soon' : ''); el.dataset.book = b.id; el.setAttribute('data-sound', b.soon ? 'none' : 'pop');
    el.style.setProperty('--b1', b.b1); el.style.setProperty('--b2', b.b2);
    const done = b.soon ? 0 : chaptersDone(S.player, b.id);
    el.innerHTML = (b.soon ? '<span class="rib">🔜 Coming soon</span>' : (done ? '<span class="rib">📖 ' + done + ' / 6</span>' : '<span class="rib">✨ NEW</span>')) +
      (b.soon ? '<span class="bi">' + b.icon + '</span>' : '<canvas class="bcv" width="400" height="320" aria-hidden="true"></canvas>') + '<span class="bt">' + UI.esc(b.title) + '</span><span class="bs">' + UI.esc(b.sub) + '</span>' +
      (!b.soon && saveRow(S.player, b.id).last ? '<span class="bb">' + SkillKit.barHtml(lastBar(b.id)) + '</span>' : '');
    el.onclick = () => { if(b.soon){ UISound.play('error'); el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); UI.toast('📖 ' + b.title + ' is still being written — Dra-Princess Diary first!'); return; } openBook(b.id); };
    box.appendChild(el);
    const cv = el.querySelector('.bcv'); if(cv) try{ let row = {}; try{ row = JSON.parse(S.settings['SkillTree_td-' + b.id + '_' + S.player] || '{}') || {}; }catch(e){} tdCover(cv, b, row); }catch(e){ cv.outerHTML = '<span class="bi">' + b.icon + '</span>'; } });   // 🎬 td-scenes: your heroes on the cover
  showScreen('menu');
}
function lastBar(book){ const r = saveRow(null, book); if(!r.last) return []; return Object.keys(r.last).reduce((a, k) => a.concat(String((r.last[k] || {}).p || '').split(',')), []).map(x => x.split(':')[0]).filter(c => COLS.includes(c)); }   // fd-1: any book's heroes
/* ================= 📏 s-td — each book lives in its own file (🏰 TD-Stories chat 2026-11-28, plan §16t) =================
   🐉👑 Dra-Princess Diary → TDBook_dragon (its engine + play) · 👨‍🌾 Farmer Delusion → TDBook_farmer (its engine + farm page), built by
   Test Harness/parts/build_parts.py from parts/TDStories/<book>.js — edit those. A book opens once its file is in (GameParts.need + the 🏰 loader);
   📲 offline app + tests: both books inline (Code.gs INCLUDE_ALSO_ TDStoriesParts) → there at once. The shelf, menus and shared play stay HERE. */
const TD_BOOK_FILE = id => 'TDBook_' + (id === 'farmer' ? 'farmer' : 'dragon');
function tdBookHas(id){ return typeof GameParts !== 'undefined' && GameParts.has(TD_BOOK_FILE(id)); }
function tdBookLevels(){ LEVELS = typeof TD !== 'undefined' ? TD.LEVELS : typeof FD !== 'undefined' ? FD.LEVELS : LEVELS; }   // both tables share name · emoji · guide · hardcore · mult
function tdBookNeed(id, go){
  if(typeof GameParts === 'undefined') return setTimeout(() => tdBookNeed(id, go), 40);   // the loader comes right after this script
  if(tdBookHas(id)){ tdBookLevels(); return go(); }
  const cover = SHELF.find(b => b.id === id) || {}; UI.loading('tdstories', (cover.icon || '🏰') + ' Opening ' + (cover.title || 'the book') + '…');
  GameParts.need(TD_BOOK_FILE(id), ok => { UI.loaded(); if(ok){ tdBookLevels(); return go(); } UISound.play('error'); UI.toast('📡 This book did not load — check the internet, then tap it again', 'err'); }); }
// 🖼️ a shelf cover: drawn live when the book's file is in (and kept as a small picture for next time), else the picture kept from last time, else the big icon.
//    Kept per book for the LAST player on this device (WebP keeps the see-through sky; a browser without WebP gives PNG) — so it never fills the device's storage.
function tdCover(cv, b, row){ const key = 'sp_td_cov:' + b.id;
  if(tdBookHas(b.id)){ (b.id === 'farmer' ? fdCover : scCover)(cv, row); try{ localStorage.setItem(key, JSON.stringify({who: S.player, url: cv.toDataURL('image/webp', 0.85)})); }catch(e){} return; }
  let kept = null; try{ kept = JSON.parse(localStorage.getItem(key) || 'null'); }catch(e){}
  if(!kept || kept.who !== S.player || !kept.url) throw new Error('no cover picture yet');   // → the book's big icon (the caller's catch)
  const im = new Image(); im.onload = () => { try{ const g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height); g.drawImage(im, 0, 0, cv.width, cv.height); }catch(e){} }; im.src = kept.url; }
/* ================= 📏 END s-td ================= */
const BOOK = id => (typeof TD !== 'undefined' && TD.BOOKS[id]) || FD.BOOKS[id];   // 📏 s-td: one book's engine may be all that is in
const bossName = C => UI.esc(((C.gates ? FD.FOES : TD.SUITORS)[C.boss] || {}).name || '');
function openBook(id){
  if(!tdBookHas(id)) return tdBookNeed(id, () => openBook(id)); tdBookLevels();   // 📏 s-td: the book's own file first
  S.book = id; const B = BOOK(id), cover = SHELF.find(b => b.id === id);
  $('book-icon').textContent = cover.icon; $('book-title').textContent = cover.title; $('book-sub').textContent = cover.sub;
  NAV_INNER.diary[0] = '◀ ' + cover.title;
  const done = chaptersDone();
  if(S.chapter > done + 1 || !B.chapters[S.chapter - 1] || B.chapters[S.chapter - 1].soon) S.chapter = Math.min(done + 1, B.chapters.filter(C => !C.soon).length);
  const cb = $('chapters'); cb.innerHTML = '';
  B.chapters.forEach(C => { const locked = !C.soon && C.n > done + 1, el = document.createElement('button');
    el.className = 'chap' + (C.soon ? ' soon' : locked ? ' locked' : '') + (C.n === S.chapter ? ' on' : ''); el.dataset.ch = C.n; el.setAttribute('data-sound', C.soon || locked ? 'none' : 'tap');
    el.innerHTML = '<span class="cn">Chapter ' + C.n + (C.n <= done ? ' · ✅' : '') + '</span><span class="ct">' + UI.esc(C.title) + '</span><span class="cb">' +
      (C.soon ? '🔜 next round' : locked ? '🔒 finish chapter ' + (C.n - 1) + ' first' : '👑 Boss: ' + bossName(C) + ' · ' + (C.gates ? C.gates.length + ' gates' : C.paths.length + ' paths')) + '</span>';
    el.onclick = () => { if(C.soon){ UI.toast('🔜 Chapter ' + C.n + ' comes in the next round!'); return; } if(locked){ UISound.play('error'); UI.toast('🔒 Finish chapter ' + (C.n - 1) + ' first'); return; }
      S.chapter = C.n; cb.querySelectorAll('.chap').forEach(x => x.classList.toggle('on', Number(x.dataset.ch) === C.n)); renderLevels(); };
    cb.appendChild(el); });
  $('chap-hint').textContent = done >= 6 ? '— 📖 the whole diary is done! 🎉' : '— ' + done + ' of 6 done';
  renderLevels();
  const r = saveRow(), bb = $('buildbox');
  bb.innerHTML = r.last ? '🧬 Your last build: ' + SkillKit.barHtml(lastBar(), {big: true}) + ' <span style="color:var(--ink-soft)">' + UI.esc(r.lastForms || '') + '</span>' :
    '🧬 Skill colours: ' + COLS.map(c => '<span style="color:' + COLORS[c].hex + '">' + COLORS[c].dot + ' ' + COLORS[c].en + '</span>').join(' · ');
  if(UI.leaders) UI.leaders($('leaders'), B.board, S.player);
  showScreen('levels');
}
function bestHtml(p, i){ const b = (p.best || [])[i]; if(!b || !b.score) return '<div class="best" style="opacity:.6">No score yet</div>'; return '<div class="best">🏆 ' + Number(b.score).toLocaleString() + ' ' + '⭐'.repeat(b.stars || 0) + '</div>'; }
function renderLevels(){
  const box = $('level-list'); box.innerHTML = ''; const p = progressOf(S.player), rec = AGE_START[S.age];
  LEVELS.forEach((L, i) => {
    const open = canPlay(i), done = p.unlocked > i, b = document.createElement('button');
    b.className = 'lvl' + (open ? '' : ' locked') + (i === rec && open ? ' recommended' : '') + (L.hardcore ? ' hardcore' : ''); b.dataset.lvl = i; b.setAttribute('data-sound', open ? 'pop' : 'none');
    b.innerHTML = '<span class="num">' + (i + 1) + '</span>' + (done ? '<span class="badge">🏅</span>' : open ? '' : '<span class="badge">🔒</span>') +
      '<div class="big">' + L.emoji + '</div><div class="nm">' + L.name + '</div><div class="hp">' + (S.book === 'farmer' ? '🎃 ' + FD.LEVELS[i].hearts + ' · 🌰 ' + FD.LEVELS[i].seeds + ' seeds' : '❤️ ' + L.hearts + ' · 🃏 ' + L.cards + ' cards') + '</div><div class="sub">' + (L.hardcore && !open ? 'Beat Extreme to open 💀 Hardcore' : S.book === 'farmer' ? FD.LEVELS[i].blurb : L.blurb) + '</div>' + bestHtml(p, i);
    b.onclick = () => { if(!open){ UISound.play('error'); UI.toast(i === 5 ? 'Beat Extreme to open 💀 Hardcore!' : i === 4 ? 'Win on Hard to unlock Extreme!' : 'Win the level before to unlock it'); return; } S.level = i; openDiary(S.chapter, i, 'intro'); };
    box.appendChild(b);
  });
}
function openDiary(ch, lvl, when){
  // ch = 1–6, or 'jail' (💍 Jailbreak pages: 'intro' before it, 'outro' = "I OBJECT!!"); when = 'intro' | 'outro' | 'ending' (after chapter 6)
  const jail = ch === 'jail', D = DIARY[S.book][ch], C = jail ? BOOK(S.book).jail : BOOK(S.book).chapters[ch - 1], soonNext = ch < 6 && (!BOOK(S.book).chapters[ch] || BOOK(S.book).chapters[ch].soon || !DIARY[S.book][ch + 1]);
  const ls = when === 'ending' ? D.endingLesson : D.lessons[when === 'intro' ? 0 : 1];
  const head = jail ? (when === 'intro' ? '💍 Jailbreak! — the Dragon breaks out' : '💍 "I OBJECT!!"') : when === 'ending' ? '📖 The very last page' : when === 'intro' ? 'Chapter ' + ch + ': ' + UI.esc(C.title) : 'The end of chapter ' + ch;
  $('diary').innerHTML = '<div class="dh' + (jail ? ' jail' : when === 'ending' ? ' ending' : '') + '">📔 ' + head + '</div><canvas id="diary-cv" width="840" height="300"></canvas><div class="dt">' + UI.esc(when === 'ending' ? D.ending : D[when]) + '</div>';
  $('lesson').innerHTML = '<span class="li">' + ls[0] + '</span><div><div class="lh">💡 Did you know? · ' + UI.esc(ls[1]) + '</div><div class="lt">' + UI.esc(ls[2]) + '</div></div>';
  const from = S.jail || {ch: S.chapter, lvl}, B = [];
  if(jail && when === 'intro') B.push('<button class="sp-btn sp-secondary" id="diary-lv" data-sound="tap">🎚️ Levels</button>', '<button class="sp-btn sp-primary sp-lg" id="diary-go" data-sound="pop">🐉 Break out! ▶</button>');
  else if(jail) B.push('<button class="sp-btn sp-secondary" id="diary-lv" data-sound="tap">🎚️ Levels</button>', '<button class="sp-btn sp-primary sp-lg" id="diary-retry" data-sound="pop">🏰 Chapter ' + from.ch + ' again · +' + JAIL_BONUS + ' ❤️ ▶</button>');
  else if(when === 'intro') B.push('<button class="sp-btn sp-primary sp-lg" id="diary-go" data-sound="pop">▶ Start chapter ' + ch + '</button>');
  else if(when === 'ending') B.push('<button class="sp-btn sp-secondary" id="diary-lv" data-sound="tap">🎚️ Levels</button>', '<button class="sp-btn sp-primary sp-lg" id="diary-shelf" data-sound="pop">📚 Back to the shelf</button>');
  else B.push('<button class="sp-btn sp-secondary" id="diary-lv" data-sound="tap">🎚️ Levels</button>', ch < 6 && !soonNext ? '<button class="sp-btn sp-primary sp-lg" id="diary-next" data-sound="pop">Chapter ' + (ch + 1) + ' ▶</button>' : ch < 6 ? '<button class="sp-btn sp-primary sp-lg" id="diary-shelf" data-sound="pop">📚 Chapter ' + (ch + 1) + ' is coming soon — back to the shelf</button>' : '<button class="sp-btn sp-primary sp-lg" id="diary-end" data-sound="pop">📖 The ending ▶</button>');
  $('diary-btns').innerHTML = B.join('');
  if($('diary-go')) $('diary-go').onclick = () => jail ? startGame(from.ch, from.lvl, {jail: true}) : startGame(ch, lvl);
  if($('diary-retry')) $('diary-retry').onclick = () => startGame(from.ch, from.lvl, {bonus: JAIL_BONUS});
  if($('diary-lv')) $('diary-lv').onclick = () => { S.jail = null; openBook(S.book); };
  if($('diary-shelf')) $('diary-shelf').onclick = () => openShelf();
  if($('diary-end')) $('diary-end').onclick = () => openDiary(6, lvl, 'ending');
  if($('diary-next')) $('diary-next').onclick = () => { S.chapter = ch + 1; openDiary(ch + 1, lvl, 'intro'); };
  showScreen('diary'); drawDiaryPicture($('diary-cv'), ch, when);
}
const JAIL_BONUS = 3;   // 💍 after a won Jailbreak the lost chapter starts with +3 ❤️
// 🖼️ a little picture on every diary page (tower, princess, dragon, suitors — and the reader's avatar)
const DIARY_SKY = {1: ['#CDEBFF', '#FFF3D9'], 2: ['#FFC6A8', '#FFF3D9'], 3: ['#FFD3E4', '#FFF5EC'], 4: ['#2C2F6B', '#8A7FC8'], 5: ['#FFD98A', '#FFF6E0'], 6: ['#C9B8FF', '#FFE3F1'], jail: ['#7E7A92', '#CFCBDB'], ending: ['#FF9E7A', '#FFE0B8']};
const DIARY_CAST = {1: ['kn', 'sq'], 2: ['kn', 'pr'], 3: ['pr', 'pr'], 4: ['wz', 'gc'], 5: ['kg', 'kn'], 6: ['boss6', 'pr']};
const DIARY_OOPS = {1: ['boss1', '💦'], 2: ['boss2', '✨'], 3: ['boss3', '💦'], 4: ['boss4', '🧹'], 5: ['boss5', '💰'], 6: ['boss6', '🌹']};
function diaryChar(type, v, w, h){ return atScale(60, () => charSet('s:' + type + ':' + v, {name: 'Suitor ' + type + v, av: suitorAv(type, v)}, w || 84, h || 108)); }
/* 📏 s-td dragon#1 → TDBook_dragon.html */
// 🏝️ a floating storybook island (grass top, earth underside fading into the sky, little roots) — the same island the chapters are played on
function scIsland(g, cx, top, rx, ry, grass, edge){
  const ug = g.createLinearGradient(0, top, 0, top + ry * 3.6); ug.addColorStop(0, '#9A6A44'); ug.addColorStop(0.55, 'rgba(122,82,52,.75)'); ug.addColorStop(1, 'rgba(122,82,52,0)');
  g.fillStyle = ug; g.beginPath(); g.moveTo(cx - rx, top); g.bezierCurveTo(cx - rx * 0.85, top + ry * 2.1, cx - rx * 0.3, top + ry * 3.3, cx, top + ry * 3.6); g.bezierCurveTo(cx + rx * 0.3, top + ry * 3.3, cx + rx * 0.85, top + ry * 2.1, cx + rx, top); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(90,60,35,.35)'; g.lineWidth = 2; for(let i = 0; i < 7; i++){ const x = cx - rx * 0.7 + i * rx * 0.23; g.beginPath(); g.moveTo(x, top + ry * 0.8); g.quadraticCurveTo(x + 6, top + ry * (1.6 + (i % 3) * 0.3), x - 4, top + ry * (2.1 + (i % 2) * 0.5)); g.stroke(); }
  g.fillStyle = edge || '#6FAE55'; g.beginPath(); g.ellipse(cx, top + 5, rx, ry, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = grass || '#9AD47C'; g.beginPath(); g.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.ellipse(cx - rx * 0.25, top - ry * 0.3, rx * 0.5, ry * 0.35, 0, 0, Math.PI * 2); g.fill(); }
function scCloud(g, x, y, r, a){ g.fillStyle = 'rgba(255,255,255,' + (a || 0.85) + ')'; [[0, 0, 1], [-0.9, 0.25, 0.7], [0.9, 0.25, 0.75], [0.35, -0.35, 0.7]].forEach(([dx, dy, rr]) => { g.beginPath(); g.arc(x + dx * r, y + dy * r, rr * r, 0, Math.PI * 2); g.fill(); }); }
function scSky(g, W, H, top, bot, night, t){
  const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, top); sky.addColorStop(1, bot); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  if(night){ for(let i = 0; i < 46; i++){ g.fillStyle = 'rgba(255,255,255,' + (0.35 + 0.5 * Math.abs(Math.sin(t * 0.7 + i))) + ')'; g.fillRect((i * 97) % W, (i * 53) % (H * 0.55), 2, 2); }
    g.fillStyle = '#FFF6C8'; g.beginPath(); g.arc(W - 90, 58, 24, 0, Math.PI * 2); g.fill(); g.fillStyle = top; g.beginPath(); g.arc(W - 80, 52, 21, 0, Math.PI * 2); g.fill(); }
  else { const sg = g.createRadialGradient(W - 110, 60, 4, W - 110, 60, 70); sg.addColorStop(0, 'rgba(255,250,210,.95)'); sg.addColorStop(1, 'rgba(255,250,210,0)'); g.fillStyle = sg; g.beginPath(); g.arc(W - 110, 60, 70, 0, Math.PI * 2); g.fill();
    scCloud(g, W * 0.18, 52, 18, 0.8); scCloud(g, W * 0.52, 34, 14, 0.7); scCloud(g, W * 0.86, 120, 16, 0.6); }
  g.fillStyle = night ? 'rgba(60,60,110,.45)' : 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(0, H * 0.72); for(let x = 0; x <= W; x += W / 8) g.lineTo(x, H * 0.72 - 18 - Math.sin(x * 0.013) * 16); g.lineTo(W, H); g.lineTo(0, H); g.fill();   // hazy far hills
  [[0.08, 0.6, 26], [0.93, 0.5, 20]].forEach(([fx, fy, r]) => { scIsland(g, W * fx, H * fy, r, r * 0.3, night ? '#5E7A8A' : '#BFE3B0', night ? '#4C6576' : '#9CCB8C'); });   // little far islands
}
/* 📏 s-td dragon#2 → TDBook_dragon.html */

// 📔 the diary picture (840 × 300): replaces the old ride-on dragon + plain-dress princess
function drawDiaryPicture(cv, ch, when){
  if(S.book === 'farmer') return fdDiaryPic(cv, ch, when);   // 👨‍🌾 fd-1
  const g = cv.getContext('2d'), W = cv.width, H = cv.height, t = performance.now() / 1000, jail = ch === 'jail', key = jail ? 'jail' : when === 'ending' ? 'ending' : ch;
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  const sk = DIARY_SKY[jail && when === 'outro' ? 6 : key] || DIARY_SKY[1];
  try{
    const Rd = atScale(60, () => readerSet());
    // 💍 Jailbreak + "I OBJECT!!" + the ending use the SAME page layout as the chapters: sky · far islands · floating island · centre tower with the Princess on top · Dragon on the right · cast left · reader right
    if(jail && when === 'intro'){   // ⛓️ dusk: the tower has turned into the 💒 wedding tower (the Princess on top, shy), the Dragon (your stage) sulks in a cage on the island, the groom + a guard march in
      const H0 = scHeroes(S.jail ? S.jail.ch : 1, 'built');
      scSky(g, W, H, '#7E7A92', '#E3D6EA', true, t); scCastleIsland(g, 212, 116, 0.3, t, true); scIsland(g, W / 2, H - 22, W * 0.47, 36, '#A9C79A', '#86A878');
      scHeroGroup(g, {x: W / 2 - 10, feet: H - 12, s: 46, pk: 1.2, pS: H0.pS || 1, pC: H0.pC, t, pAct: 'shy', jail: true});
      emo(g, '🔔', W / 2 - 92, 62, 34); emo(g, '🔔', W / 2 + 76, 62, 34);
      const cx = W / 2 + 200, cb = 252, cw = 150, ch2 = 150;   // 🐉 the cage
      g.fillStyle = 'rgba(46,42,58,.35)'; g.beginPath(); g.ellipse(cx, cb, cw * 0.55, 12, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgba(80,72,100,.25)'; g.fillRect(cx - cw / 2, cb - ch2, cw, ch2);
      const out = scDragon(g, {dS: H0.dS, dC: H0.dC, x: cx, feet: cb - 6, k: SC_DK[H0.dS] * 0.9, t, dir: -1, noShadow: true, pose: {hy: 5, ha: 0.5, lean: 0.12, wing: 0.55, ws: -0.1, tail: -0.1, shake: Math.sin(t * 1.3) > 0.85 ? 0.8 : 0, rise: -((TDDragon.STAGES[H0.dS] || {}).fly || 0) * 14}});
      g.fillStyle = '#2E2A3A'; for(let x = cx - cw / 2; x <= cx + cw / 2 + 1; x += cw / 6) g.fillRect(x - 4, cb - ch2, 8, ch2);
      g.fillRect(cx - cw / 2 - 8, cb - ch2 - 8, cw + 16, 12); g.fillRect(cx - cw / 2 - 8, cb - 6, cw + 16, 12);
      g.beginPath(); g.moveTo(cx - cw / 2 - 8, cb - ch2 - 6); g.quadraticCurveTo(cx, cb - ch2 - 46, cx + cw / 2 + 8, cb - ch2 - 6); g.lineWidth = 8; g.strokeStyle = '#2E2A3A'; g.stroke(); g.fillRect(cx - 3, cb - ch2 - 60, 6, 30);
      emo(g, '🎀', cx - 34, cb - 60, 34); emo(g, '😤', cx - 30, cb - ch2 + 30, 32); emo(g, '🔒', cx + cw / 2 - 4, cb - 70, 30); emo(g, '🔑', cx + 120, 286, 28);
      const Gr = diaryChar('groom', 0), K = diaryChar('kn', 1); paintChar(g, Gr, Gr.walk[Math.floor(t * 14) % 8], 120, 290, 120, false); emo(g, '💍', 152, 236, 30);
      paintChar(g, K, K.walk[Math.floor(t * 14 + 3) % 8], 215, 292, 110, false);
      paintChar(g, Rd, Rd.act('cheer')[Math.floor(t * 6) % 6], W - 46, 290, 104, true); return; }
    if(jail){   // 💥 "I OBJECT!!" — same layout, but the wedding happens in a 🏰 CASTLE: the Dragon (your stage) breathes REAL fire at the castle gate, the gate bursts, the Princess cheers from the balcony, the groom flies into the cake
      const H0 = scHeroes(S.jail ? S.jail.ch : 1, 'built');
      scSky(g, W, H, '#FFC6E0', '#FFF0F6', false, t); scTowerIsland(g, W - 80, 96, 9, H0.pS || 1, H0.pC, t); scIsland(g, W / 2, H - 22, W * 0.47, 36);
      const bal = scCastle(g, W / 2 - 10, H - 14, 1, t);
      TDPrincess.draw(g, H0.pS || 1, H0.pC, bal.x, bal.y, (H0.pS >= 5 ? 0.88 : 1) * 1.05, t, {act: 'cheer'});
      g.drawImage(bal.front, 0, 0);
      const out = scDragon(g, {dS: H0.dS, dC: H0.dC, x: W / 2 + 228, feet: 214, k: SC_DK[H0.dS] * 0.92, t, dir: -1, pose: scDPose('breath', 0.345, 1)});
      scFlame(g, out, [bal.gx + 8, bal.gy - 22], 46, H0.dS >= 3 ? H0.dC : 'A', 0.22, t); emo(g, '💥', bal.gx, bal.gy - 26, 62);
      g.fillStyle = '#5A3418'; g.save(); g.translate(bal.gx - 34, bal.gy + 4); g.rotate(-0.8); g.fillRect(-22, -42, 20, 42); g.restore(); g.save(); g.translate(bal.gx + 34, bal.gy + 4); g.rotate(0.8); g.fillRect(2, -42, 20, 42); g.restore();   // the gate doors fly off
      emo(g, '🧱', bal.gx + 50, bal.gy - 78, 20); emo(g, '🧱', bal.gx - 52, bal.gy - 70, 16); emo(g, '💫', 205, 205, 30);
      const Gr = diaryChar('groom', 0); paintChar(g, Gr, Gr.act('dizzy')[Math.floor(t * 6) % 6], 120, 286, 112, false); emo(g, '🎂', 120, 276, 58);
      g.save(); g.font = '900 48px Fredoka, Nunito, sans-serif'; g.textAlign = 'center'; g.lineJoin = 'round'; g.translate(150, 64); g.rotate(-0.07 + Math.sin(t * 6) * 0.02);
      g.lineWidth = 10; g.strokeStyle = '#2A1E3A'; g.strokeText('I OBJECT!!', 0, 0); g.fillStyle = '#FFD84D'; g.fillText('I OBJECT!!', 0, 0); g.restore();
      paintChar(g, Rd, Rd.act('cheer')[Math.floor(t * 6) % 6], W - 46, 290, 104, true); return; }
    if(when === 'ending'){   // 🏯 same layout, happily ever after: the crystal stage tower with the Sage on top, the Heart Dragon beside her (your colours), the dragon castle on a far island, tea with the suitors
      const H0 = scHeroes('ending', 'best');
      scSky(g, W, H, '#FF9E7A', '#FFE0B8', false, t);
      scCastleIsland(g, 170, 150, 0.5, t); emo(g, '💗', 170, 40, 26);   // 🏰 the same castle island — now the suitors come over for tea
      scIsland(g, W / 2, H - 22, W * 0.47, 36);
      scHeroGroup(g, {x: W / 2 - 10, feet: H - 12, s: 46, pk: 1.2, pS: H0.pS, pC: H0.pC, t, pAct: 'cheer', form: 2});
      scDragon(g, {dS: H0.dS, dC: H0.dC, x: W / 2 + 205, feet: 218, k: SC_DK[H0.dS] * 0.95, t, dir: -1, pose: scDPose('wing', t, 1.6)});
      emo(g, '❤️', W / 2 + 70, 40, 34);
      const K = diaryChar('kn', 0), Q = diaryChar('pr', 1); paintChar(g, K, K.still, 110, 290, 110, false); paintChar(g, Q, Q.still, 215, 292, 110, true);
      emo(g, '🫖', 163, 270, 34); emo(g, '☕', 125, 222, 22); emo(g, '☕', 200, 222, 22);
      paintChar(g, Rd, Rd.act('cheer')[Math.floor(t * 6) % 6], W - 46, 290, 104, true); return; }
    // 🏰 a normal chapter page: the floating island, the stage tower with the Princess on top, the Dragon beside it, this chapter's suitors (intro) or the boss in trouble (outro)
    const night = ch === 4, H0 = scHeroes(ch, when === 'outro' ? 'built' : 'story');
    scSky(g, W, H, sk[0], sk[1], night, t); scCastleIsland(g, 212, 116, 0.3, t, night); scIsland(g, W / 2, H - 22, W * 0.47, 36, ch === 5 ? '#C9D97A' : '#9AD47C', ch === 5 ? '#A9B95A' : '#6FAE55');
    scHeroGroup(g, {x: W / 2 - 10, feet: H - 12, s: 46, pk: 1.2, pS: H0.pS, pC: H0.pC, t, pAct: when === 'outro' ? 'cheer' : null});
    const dx = W / 2 + 200, dFeet = when === 'outro' ? 232 : 224;
    scDragon(g, {dS: H0.dS, dC: H0.dC, x: dx, feet: dFeet, k: SC_DK[H0.dS] * 0.95, t, dir: -1, pose: when === 'outro' ? scDPose('roar', 0.55, 2) : scDPose('wing', t, 1.4)});
    if(when === 'outro' && H0.dS >= 1) emo(g, '❤️', W / 2 + 60, 40, 34);
    if(when === 'intro'){ const [a, b] = DIARY_CAST[ch] || DIARY_CAST[1], K = diaryChar(a, 0, a.startsWith('boss') ? 100 : 84, a.startsWith('boss') ? 128 : 108), Q = diaryChar(b, 1);
      paintChar(g, K, K.walk[Math.floor(t * 14) % 8], 120, 290, a.startsWith('boss') ? 140 : 120, false); emo(g, TD.SUITORS[a].prop || '💐', 152, 232, 30);
      paintChar(g, Q, Q.walk[Math.floor(t * 14 + 3) % 8], 215, 292, 110, false); if(TD.SUITORS[b].front) emo(g, TD.SUITORS[b].front, 262, 278, 40);
      if(ch === 2 || ch === 3) emo(g, '👼', 70, 150, 46); if(ch === 4) emo(g, '🐭', 300, 280, 30); if(ch === 5) emo(g, '👑', 60, 140, 40); if(ch === 6) emo(g, '💘', 60, 140, 46); }
    else { const [bt, oops] = DIARY_OOPS[ch] || DIARY_OOPS[1], K = diaryChar(bt, 0, 100, 128); emo(g, '💫', 120, 150, 40); paintChar(g, K, K.act('dizzy')[Math.floor(t * 6) % 6], 120, 255, 120, false); emo(g, oops, 190, 220, 44); }
    paintChar(g, Rd, Rd.act('cheer')[Math.floor(t * 6) % 6], W - 80, 288, 112, true);
  }catch(e){ console.warn(e); }
}
/* 📏 s-td dragon#3 → TDBook_dragon.html */
/* 🎬 TD SCENES (td-scenes) END */
/* ================= 🎮 PLAY ================= */
function startGame(ch, lvl, opt){
  if(S.book === 'farmer') return fdStart(ch, lvl, opt); fdLeave();   // 👨‍🌾 fd-1
  opt = opt || {}; S.chapter = ch; S.level = lvl; stopLoop(); hideResult(); S.jail = opt.jail ? {ch, lvl} : null;
  G = TD.newMatch({book: S.book, chapter: ch, level: lvl, auto: autoOn, jail: !!opt.jail, bonusHearts: opt.bonus || 0});
  FDR.spin = null; fdSetRot(fdRotSaved() * Math.PI / 2); FDR.k = fdK();   // 🔄 td-turn: book 1 opens in its own saved view
  act2Reset(); if(window.ActionFX) ActionFX.opts.shake = lvl > 0;   // 🎬 act-2 (🌱 Basic: no shake)
  G.breakLen = lvl === 0 ? 4 : 2.6; FT = []; guideUsed = 0; pickOpen = false; speedOn = false; G.speed = 1;
  if(UI.modeTried) UI.modeTried(S.player, GAME_ID, S.book);
  const L = LEVELS[lvl]; BAR.level(L.emoji + ' ' + L.name + ' · ' + (G.jail ? '💍 Jailbreak' : 'Ch ' + ch), L.hardcore ? 'hc' : '');
  paintAuto();
  $('speed-btn').textContent = '⏩'; $('goal').style.opacity = 1;
  $('goal').textContent = G.jail ? '💍 Hold off the guards until the bells stop — then crash the wedding!' : opt.bonus ? '💖 Second chance: +' + opt.bonus + ' ❤️ — keep the suitors away!' : '🏰 Keep the suitors away from the tower!';
  showScreen('play'); BAR.fit(); renderPanel(); layout(); BAR.fit(); fdZoomButtons(); fdRotBadge(); hudTick(true);   // fd-1a2: 🤏 zoom in book 1 too
  last = 0; raf = requestAnimationFrame(loop);
  setTimeout(nextPick, FX ? 450 : 0);
}
function stopLoop(){ cancelAnimationFrame(raf); raf = 0; }
function leavePlay(){ stopLoop(); hideHand(); fdLeave(); goStop(); const s = document.querySelector('#scr-play .skk-sheet'); if(s) s.remove(); pickOpen = false; G = null; hideResult(); openBook(S.book); }
function toggleSpeed(){ if(!G) return; speedOn = !speedOn; G.speed = speedOn ? 2 : 1; $('speed-btn').textContent = speedOn ? '⏩×2' : '⏩'; $('speed-btn').classList.toggle('on', speedOn); UI.toast(speedOn ? '⏩ Double speed' : '▶ Normal speed'); }
/* 📏 s-td dragon#4 → TDBook_dragon.html */
function paintAuto(){ const b = $('auto-btn'); if(!b) return; b.textContent = autoOn ? '🤖 Auto ✅' : '🤖 Auto'; b.title = 'Auto skills: ' + (autoOn ? 'on' : 'off'); b.classList.toggle('on', autoOn); }
/* 🔔 fd-1e: goNow() lives in the GO BUTTONS block (the tap plays the hit, the wave starts on CONTACT) */

/* ---------- 📐 layout: stage square + hero panel; nothing ever scrolls ---------- */
function layout(){
  const sp = $('scr-play'); if(!sp || sp.classList.contains('hidden')) return;
  if(G && fdLayout()) return;   // 👨‍🌾 fd-1a2: phone layouts, both books (sideways: [plants left] · map · hero 3×2 / pet 3×2 right)
  const A = $('arena'), st = $('stage'), P = $('panel');
  const W = A.clientWidth - 16, H = A.clientHeight - 6 - (parseFloat(getComputedStyle(A).paddingBottom) || 18);
  const big = Math.min(W, H) > 560, bs = big ? 56 : (Math.min(W, H) < 340 ? 40 : 46), gap = big ? 9 : 7;
  sp.style.setProperty('--skk-bs', bs + 'px'); sp.style.setProperty('--bgap', gap + 'px'); sp.style.setProperty('--hf', big ? '2.2rem' : '1.6rem');
  const heroW = 6 * bs + 5 * gap + 18;
  // side panel when the screen is wide enough (the map may give up 20 % for it); else the panel goes under the map
  const row = W - H >= heroW + 8 || (W > H && W - heroW - 8 >= H * 0.8);
  let size;
  A.classList.toggle('col', !row);
  isoFit(A.clientWidth, A.clientHeight); const AR = V25.AR, MAXW = 1240;   // 🏝️ iso-2: phones held upright see the island's middle bigger   // 2.5D: the stage is wider than tall (width = size, height = size × AR)
  if(row){ P.style.flexDirection = 'column'; P.style.width = heroW + 'px'; size = Math.min(H / AR, W - heroW - 8, MAXW); }
  else { const side = (W - 8) / 2 >= heroW; P.style.flexDirection = side ? 'row' : 'column'; P.style.width = (side ? Math.min(W, Math.max(2 * heroW + 8, Math.min(W, 980))) : Math.min(W, Math.max(heroW, 600))) + 'px';
    let ph = P.getBoundingClientRect().height || (side ? 120 : 240); size = Math.min(W, (H - ph - 8) / AR, MAXW);
    const spare = H - ph - 8 - size * AR, pw = parseFloat(P.style.width) / (side ? 2 : 1);
    if(spare > 30 && size >= W - 1){ const bs2 = Math.floor(Math.min(64, (pw - 18 - 5 * gap) / 6, bs + spare / (side ? 2 : 4)));   // 📱 tall phones: spare height → bigger skill buttons
      if(bs2 > bs){ sp.style.setProperty('--skk-bs', bs2 + 'px'); ph = P.getBoundingClientRect().height; size = Math.min(W, (H - ph - 8) / AR, MAXW); } } }
  size = Math.max(240, Math.floor(size)); const sh = Math.round(size * AR);
  st.style.width = size + 'px'; st.style.height = sh + 'px';
  const dpr = Math.min(2, window.devicePixelRatio || 1), cv = $('cv');
  if(VIEW.px !== size || VIEW.dpr !== dpr || !BG || VIEW.ch !== S.chapter){ VIEW = {s: size / V25.W, px: size, ph: sh, dpr, ch: S.chapter}; setIso(); cv.width = Math.round(size * dpr); cv.height = Math.round(sh * dpr); BG = null; }
  if(G) fdZoomApply();   // 👨‍🌾 fd-1a2: 🤏 zoom / pan on every size, both books
  if(pickOpen) placeHandOnGlow();
}
/* 📏 s-td dragon#5 → TDBook_dragon.html */

/* ---------- 🦸 hero panel (5 colour slots + ⭐) ---------- */
let BTN = [];
/* 📏 s-td dragon#6 → TDBook_dragon.html */

/* ---------- 🃏 picks (the game waits — nothing moves while the cards are open) ---------- */
function nextPick(){
  if(G && G.fd) return fdNextPick();   // 👨‍🌾 fd-1
  if(!G || G.state !== 'pick'){ afterPicks(); return; }
  const o = TD.offer(G); if(!o){ afterPicks(); return; }
  const h = G.queue[0], T = G.trees[h], H = TD.HEROES[h];
  const title = o.kind === 'evolve' ? '⭐ ' + H.icon + ' ' + H.name + ' is EVOLVING! Pick your main colour' : o.kind === 'ultimate' ? '⭐ ' + H.icon + ' Final form! Here is your ULTIMATE' : H.icon + ' ' + T.formName() + ' levels up! Tier ' + o.tier + ' — pick ONE';
  const sub = o.kind === 'pick' ? (G.lvl === 0 ? '👆 The glowing card is a good pick' : 'Your build: ') : o.kind === 'evolve' ? 'The main colour shows up more often from now on' : 'Tap it to make it yours!';
  pickOpen = true;
  const pr = SkillKit.pickSheet($('arena'), o, {title, sub: sub, fast: !FX});
  const sh = document.querySelector('#arena .skk-sheet:last-child'); if(sh && o.kind === 'pick' && G.lvl !== 0) sh.querySelector('.h2').innerHTML = T.bar().length ? 'Your build: ' + SkillKit.barHtml(T.bar()) + (T.main ? ' · main ' + COLORS[T.main].dot : '') : '✨ Your very first skill — every colour does something different!';
  if(LEVELS[G.lvl].guide || (G.glowLeft > 0 && T.glow)) setTimeout(placeHandOnGlow, FX ? 520 : 0);
  pr.then(card => {
    pickOpen = false; hideHand(); if(!G) return;
    TD.take(G, card); UISound.play(card.type === 'evolve' || card.type === 'ultimate' ? 'success' : 'unlock');
    renderPanel();
    if(card.type === 'evolve' || card.type === 'ultimate'){ const f = $('hf-' + h); if(f){ f.classList.add('evo'); } banner(card.type === 'evolve' ? '⭐ ' + H.name + ' → ' + T.formName() + '!' : '⭐ ' + T.formName() + '! ULTIMATE ready', 'gold'); if(FX) confetti(['⭐', '✨', COLORS[card.col].dot]); }
    else floatText(h === 'dragon' ? G.heroes.dragon.x : TD.CX, (h === 'dragon' ? G.heroes.dragon.y : TD.CY) - 1.2, (card.type === 'up' ? '⬆️ ' : '✨ ') + card.name, COLORS[card.col].hex, 1.6);
    setTimeout(nextPick, FX ? 260 : 0);
  });
}
/* 📏 s-td dragon#7 → TDBook_dragon.html */

/* ---------- 👆 the guide hand (🌱 Basic) ---------- */
function showHandAt(el){ if(!el) return; const r = el.getBoundingClientRect(); if(!r.width) return; const h = $('hand'); h.classList.remove('hidden'); h.style.left = (r.left + r.width * 0.5 - 12) + 'px'; h.style.top = Math.min(innerHeight - 44, r.bottom - 14) + 'px'; HAND = el; }
function hideHand(){ $('hand').classList.add('hidden'); HAND = null; }
function placeHandOnGlow(){ const g = document.querySelector('#scr-play .skk-sheet .skk-card.glow'); if(g) showHandAt(g); }
/* 📏 s-td dragon#8 → TDBook_dragon.html */

/* ---------- ⏱️ loop ---------- */
function loop(now){
  raf = requestAnimationFrame(loop); if(!G) return;
  if(G.fd) return fdLoop(now);   // 👨‍🌾 fd-1
  const dt = last ? Math.min(0.1, Math.max(0, (now - last) / 1000)) : 0; last = now;
  const was = G.state; goAuto(); TD.step(G, dt);   /* 🔔 fd-1e: CONTACT starts the wave in this tick */
  if(was === 'break' && G.state === 'wave'){ goHide(); if(HAND === $('go-btn')) hideHand(); }
  handleEvents(TD.takeEvents(G));
  FT = FT.filter(f => (f.t += dt) < f.dur);
  fdSpinStep(now); paintFrame(now / 1000); panelTick(); hudTick(); guideTick();   // 🔄 td-turn: the spin steps in book 1 too
  if(G && (G.state === 'won' || G.state === 'lost') && !G.ended){ G.ended = 1; setTimeout(() => finish(), FX ? 1300 : 0); }
}
/* 📏 s-td dragon#9 → TDBook_dragon.html */
function floatText(x, y, txt, col, dur){ FT.push({x, y, txt, col, t: 0, dur: dur || 1}); if(FT.length > 40) FT.shift(); }
let bannerT = 0;
function banner(txt, kind){ const b = $('banner'); b.textContent = txt; b.className = 'banner on' + (kind ? ' ' + kind : ''); clearTimeout(bannerT); bannerT = setTimeout(() => b.classList.remove('on'), kind ? 2400 : 1700); }
function confetti(list, n){ for(let i = 0; i < (n || 24); i++){ const e = document.createElement('div'); e.className = 'confetti'; e.textContent = list[Math.floor(Math.random() * list.length)]; e.style.left = Math.random() * 100 + 'vw'; e.style.animationDuration = (1.6 + Math.random() * 1.6) + 's'; e.style.animationDelay = (Math.random() * .5) + 's'; document.body.appendChild(e); setTimeout(() => e.remove(), 3800); } }
/* 📏 s-td dragon#10 → TDBook_dragon.html */


/* ---------- 🧑 characters = real avatars (td-1b) ----------
   Suitors + the Princess are AvatarKit avatars in costumes; the Dragon is the AvatarKit 🐉 ride-on beast without a rider.
   Every look is painted ONCE into small pictures (walk cycle, dizzy, love, bow …) at the map's size → the game only draws images. */
const CHAR = {sets: {}, s: 0};
/* 📏 s-td dragon#11 → TDBook_dragon.html */
const WALK_N = 8, WALK_P = Math.PI * 2 / 11;
function measurePaint(paint){
  const N = 420, O = 260, M = document.createElement('canvas'); M.width = N; M.height = N; const mg = M.getContext('2d'); mg.translate(N / 2, O); paint(mg);
  const px = mg.getImageData(0, 0, N, N).data; let x0 = N, y0 = N, x1 = 0, y1 = 0;
  for(let y = 0; y < N; y += 2) for(let x = 0; x < N; x += 2) if(px[(y * N + x) * 4 + 3] > 12){ if(x < x0) x0 = x; if(x > x1) x1 = x; if(y < y0) y0 = y; if(y > y1) y1 = y; }
  if(x1 <= x0) return {x0: -20, x1: 20, y0: -70, y1: 2};
  return {x0: x0 - N / 2, x1: x1 - N / 2 + 2, y0: y0 - O, y1: y1 - O + 2};
}
// one cached set per look: {walk: [8 canvases], still, dizzy: [6], love: [6], bow: [6], w, h} (CSS px)
function charSet(key, who, w, h){
  key += '@' + w + 'x' + h + '@' + (VIEW.dpr || 1); if(CHAR.sets[key]) return CHAR.sets[key];
  if(Object.keys(CHAR.sets).length > 160) CHAR.sets = {};
  const dpr = VIEW.dpr || 1, B = measurePaint(g => { drawAvatar(g, {name: who.name, av: who.av, dir: 1}, 0, 0, 1, {t: 0.3}); drawAvatar(g, {name: who.name, av: who.av, dir: 1, walkT: WALK_P / 4}, 0, 0, 1, {t: 0.5}); });
  const k = Math.min((w - 4) / (B.x1 - B.x0), (h - 4) / (B.y1 - B.y0)) * 0.9, fx = Math.round(w / 2 - (B.x0 + B.x1) / 2 * k), fy = Math.round(h - 2 - Math.max(0, B.y1) * k), e = {top: B.y0};
  const mk = paint => { const c = document.createElement('canvas'); c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); const g = c.getContext('2d'); g.scale(dpr, dpr); paint(g); return c; };
  const set = {k, who, w, h, fx, fy, head: Math.max(10, -e.top * k), walk: [], acts: {}};
  for(let i = 0; i < WALK_N; i++) set.walk.push(mk(g => drawAvatar(g, {name: who.name, av: who.av, dir: 1, walkT: 0.001 + i / WALK_N * WALK_P}, fx, fy, k, {t: i / WALK_N})));
  set.still = mk(g => drawAvatar(g, {name: who.name, av: who.av, dir: 1}, fx, fy, k, {t: 0.3}));
  set.act = act => { if(set.acts[act]) return set.acts[act]; const out = [];
    if(window.Acting && Acting.has && Acting.has('acts', act)) for(let i = 0; i < 6; i++) out.push(mk(g => Acting.draw(g, who, fx, fy, k, act, {t: i / 6})));
    return (set.acts[act] = out.length ? out : [set.still]); };
  return (CHAR.sets[key] = set);
}
/* 📏 s-td dragon#12 → TDBook_dragon.html */
function drawPic(g, c, x, yFeet, w, h, flip, rot, alpha, set){
  g.save(); g.translate(x, yFeet); if(rot) g.rotate(rot); if(flip) g.scale(-1, 1); if(alpha != null) g.globalAlpha = alpha;
  const sc = set ? w / set.w : 1; if(set) g.drawImage(c, -set.fx * sc, -set.fy * sc, w, h); else g.drawImage(c, -w / 2, -h, w, h); g.restore();
}
/* 📏 s-td dragon#13 → TDBook_dragon.html */

/* ---------- 🎨 2.5D storybook painter (td-1b) ----------
   The map is tilted like a diorama: the ground is drawn squashed (K), everything that stands (tower, suitors, trees, dragon)
   is drawn upright at its foot point, far things first (depth = world y). One painter for play + previews.
   P(x, y, z) → screen: x·s, TOP + y·s·K − z·s·Z.  Emoji only through the AvatarKit sprite cache (emo).          */
const V25 = {K: 0.5, Z: 0.9, TOP: 3.6, BOT: 0.6, R: 12.2, W: 25};   // 🏝️ iso-2: diamond (IsoKit) projection, island ≈ 25 tiles wide — IX / IY / groundTf in the iso-2 block below
/* 📏 s-td dragon#14 → TDBook_dragon.html */
function isoFit(w, h){ const nw = w < 640 && h > w * 1.15 ? 19.5 : 25; if(nw !== V25.W){ V25.W = nw; V25.AR = (V25.TOP + V25.R + V25.BOT) / V25.W; BG = null; } }   // narrow upright screens: crop the misty sides, bigger board
/* 📏 s-td dragon#15 → TDBook_dragon.html */
const EL_OF = {fire: 'fire', lava: 'fire', ice: 'ice', storm: 'zap', nature: 'nature', thorn: 'nature', blossom: 'nature', honey: 'light', holy: 'light', sun: 'light', gold: 'light', star: 'light',
  shadow: 'shadow', ghost: 'shadow', dream: 'shadow', cosmic: 'shadow', moon: 'shadow', love: 'candy', candy: 'candy', rose: 'candy', paper: 'light', water: 'water', bubble: 'water', crystal: 'ice', music: 'candy', goo: 'nature', rainbow: 'candy', wind: 'water', rock: 'fire', steel: 'light'};
const HACT = {dragon: null, princess: null}, SACT = {}, DM = {}, PZ = {x: 0, y: 0, k: 1};
function act2Reset(){ motReset(); HACT.dragon = HACT.princess = null; Object.keys(SACT).forEach(k => delete SACT[k]); if(window.ActionFX) ActionFX.clear(); }
/* 📏 s-td dragon#16 → TDBook_dragon.html */
/* ================= 🎬 mo-td — the shared 🎬 Motion engine in BOTH books (🏰 TD-Stories chat, 2026-11-20, plan §16r) =================
   Page only (AvatarMotion comes with include('AvatarKit')): 🫁 Motion.idle on the tower / porch · ⚔️ motion.slash.light auto attacks
   💥 Motion.hit on the cached suitor / collector pictures (kind + element from what hit it, only on hits the game already shows: 📖 1 dmg ≥ 2)
   🤕 Motion.knock on a push: the picture slides from the old spot to the new one + hops + dust (the ENGINE still decides where)
   ⚡ suitor tricks {side:'enemy'} = wind-up glow (same 360 ms) · 🐉 hatchling hop squash (Motion.landInfo) · 🌱 Basic = {calm:true} · FX off = today */
const MOT = {g: null, hit: {}, kn: {}, last: {}, farmer: null, atkT: null, fw: null, pw: null, land: null};
const motOn = () => !!(window.Motion && Motion.hit && Motion.knock && FX);
const motCalm = () => !!(G && G.lvl === 0);
function motReset(){ MOT.hit = {}; MOT.kn = {}; MOT.last = {}; MOT.farmer = null; MOT.atkT = null; MOT.g = G; }
// 💥 what hit it → the hit's kind + element (📖 1: M._src {hero, key} / {hero} · 📖 2: 'plant' · 'skill' · 'hero')
function motHitOf(by){ const h = by && typeof by === 'object' ? by.hero : null; let el = null;
  if(h && by.key){ try{ el = EL_OF[skillLook({hero: h, key: by.key}, 'swat').key] || null; }catch(err){ el = null; } }
  return h === 'dragon' ? {kind: 'blunt', element: el || 'fire'} : h === 'princess' ? {kind: 'slash', element: el} : {kind: 'blunt', element: el}; }
// every frame, per foe: start a hit / a knock when the engine shows one happened (x, y = where it stands, before any slide)
function motWatch(e, x, y, fd){ if(!motOn() || !G) return; if(MOT.g !== G) motReset();
  const L = MOT.last[e.id] || (MOT.last[e.id] = {}), calm = motCalm(), hv = (fd ? e.hit : e.hitT) || 0;
  if(L.hv != null && hv > L.hv + 1e-6 && !e.gone){ const o = motHitOf(e.hitBy);
    MOT.hit[e.id] = {H: Motion.hit({kind: o.kind, weight: e.boss ? 'medium' : 'light', element: o.element || undefined, fx: !!o.element && !calm, calm, seed: e.id}), t0: G.t}; }
  const pushed = fd ? (e.backN || 0) > (L.bn || 0) : L.d != null && e.d < L.d - 0.12;
  if(pushed && !e.gone && !e.boss){ const big = fd ? e.backN >= 3 : L.d - e.d > 0.9;
    MOT.kn[e.id] = {K: Motion.knock({weight: big ? 'medium' : 'light', calm}), t0: G.t, fx: fd ? null : L.x, fy: fd ? null : L.y}; }
  L.hv = hv; L.bn = e.backN || 0; L.d = e.d; L.x = x; L.y = y; }
// 🤕 a pushed foe: {dx, dy} = slide left to go · lift (px) · rot · its dust (ms, K) — null when none
function motKnock(e, x, y, k){ const N = MOT.kn[e.id]; if(!N) return null; const ms = (G.t - N.t0) * 1000, s = N.K.at(ms);
  if(s.done || ms > 1600){ delete MOT.kn[e.id]; return null; }
  if(N.end == null) N.end = Math.max(1, Math.abs(N.K.at(99999).dx || 0));
  const p = N.fx == null ? 1 : Math.min(1, Math.abs(s.dx || 0) / N.end), lift = Math.max(0, s.lift || 0) * k;
  return {dx: N.fx == null ? 0 : (N.fx - x) * (1 - p), dy: N.fx == null ? 0 : (N.fy - y) * (1 - p), lift, rot: lift > 2 * k ? 0.26 : 0, ms, K: N.K}; }
// 💥 paint a foe through its hit (flash + freeze + FX) — false when it has none
function motHitDraw(g, e, paint, x, y, k, dir){ const A = MOT.hit[e.id]; if(!A) return false; const ms = (G.t - A.t0) * 1000;
  if(ms > 1000 || A.H.at(ms).done){ delete MOT.hit[e.id]; return false; } Motion.drawHit(g, A.H, ms, paint, {x, y, k, dir}); return true; }
/* 📏 s-td dragon#17 → TDBook_dragon.html */
/* 📏 s-td farmer#1 → TDBook_farmer.html */
/* 📏 s-td dragon#18 → TDBook_dragon.html */
/* ================= 🏝️ iso-2 (iso2-b): TD-Stories on the IsoKit island (🏰 TD-Stories chat, 2026-11-17, plan §iso-2) =================
   Diamond projection (same as IsoKit): IX(x, y) / IY(x, y, z) · ground things in world units through groundTf (an affine map) ·
   the island = an IsoKit map (void outside, fading edge cells) baked into the background once per chapter + time of day ·
   🌄 own sky (gradient · sun / moon · hazy hills · far castle · clouds · birds · valley mist) · 🌅 storybook day: morning → dusk (halfway) → night (last wave) ·
   🏮 lanterns along the roads light up at dusk, fireflies at night · 🎭 the tower has a round STAGE on top · 🐉 TDDragon + 👸 TDPrincess: 5 SHAPE stages
   on tiers 1 · 3 · 5 · 7 · 10, coloured by the main skill colour from tier 5, ✨ 1.2 s morph moment when a stage changes (🌱 Basic: 0.6 s, no flash). */
const ISO = {A: 10, B: 5, OX: 0, OY: 0, zi: 0.3, O: 5, N: 26, key: '', M: null, lanterns: [], fly: [], rq: 0, rc: 1, rs: 0, rcx: 0, rcy: 0};   // 🔄 fd-1d: rq = the view is turned (rc / rs = cos / sin round rcx, rcy)
function setIso(){ const s = VIEW.s; ISO.A = s / Math.SQRT2; ISO.B = ISO.A / 2; ISO.zi = ISO.A / 32; ISO.OX = VIEW.px / 2; ISO.OY = (V25.TOP + V25.R / 2) * s - (TD_MID + TD_MID) * ISO.B; }
const IX = (x, y) => ISO.rq ? ISO.OX + ((ISO.rc - ISO.rs) * (x - ISO.rcx) - (ISO.rs + ISO.rc) * (y - ISO.rcy)) * ISO.A : ISO.OX + (x - y) * ISO.A,
  IY = (x, y, z) => (ISO.rq ? ISO.OY + (ISO.rcx + ISO.rcy + (ISO.rc + ISO.rs) * (x - ISO.rcx) + (ISO.rc - ISO.rs) * (y - ISO.rcy)) * ISO.B : ISO.OY + (x + y) * ISO.B) - (z || 0) * V25.Z * VIEW.s;   // 🔄 fd-1d
function groundTf(g, sx, sy){ const d = VIEW.dpr; if(ISO.rq){ const c = ISO.rc, n = ISO.rs, a = ISO.A * (c - n), b = ISO.B * (c + n), cc = -ISO.A * (n + c), dd = ISO.B * (c - n);   // 🔄 fd-1d
    g.setTransform(d * a, d * b, d * cc, d * dd, d * (ISO.OX + (sx || 0) - a * ISO.rcx - cc * ISO.rcy), d * (ISO.OY + (sy || 0) + ISO.B * (ISO.rcx + ISO.rcy) - b * ISO.rcx - dd * ISO.rcy)); return; }
  g.setTransform(d * ISO.A, d * ISO.B, -d * ISO.A, d * ISO.B, d * (ISO.OX + (sx || 0)), d * (ISO.OY + (sy || 0))); }   // draw in world units on the ground
/* 📏 s-td dragon#19 → TDBook_dragon.html */
const ISO_ZLV = () => 16 * ISO.zi / (V25.Z * VIEW.s);   // one IsoKit height level in game z units
function isoGroundZ(x, y){ const M = ISO.M; if(!M) return 0; const i = Math.floor(x + ISO.O), j = Math.floor(y + ISO.O); return M.inside(i, j) && !M.isVoid(i, j) ? M.hgt[j * M.w + i] * ISO_ZLV() : 0; }
// 🌅 time of day: 0 morning · 1 dusk · 2 night (moon chapters are always night)
const TOD = {v: 0, want: 0, bgs: [null, null, null], at: 0};
function todWant(){ if(!G) return 0; if(scenePal().night) return 2; const n = G.C.waves.length, w = G.wave; if(w >= n - 1 && w >= 0) return 2; return w + 1 >= Math.ceil(n / 2) ? 1 : 0; }
const TOD_SKY = [null, {sky1: '#FF8E6E', sky2: '#FFD2A6', hill1: '#B98BC9', hill2: '#8E6FB3', sun: '#FFE08A'}, {sky1: '#1E2154', sky2: '#4B4590', hill1: '#3E3C7A', hill2: '#2C2B5E', night: true, sun: '#FFF6C8'}];
function drawSky(g, P, W, H, R){
  let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, P.sky1); gr.addColorStop(0.55, P.sky2); gr.addColorStop(1, P.sky2); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const sx = W * 0.82, sy = H * 0.15, sr = Math.min(W, H) * 0.065;
  if(P.night){ for(let i = 0; i < 90; i++){ g.fillStyle = 'rgba(255,255,255,' + (0.35 + R() * 0.6) + ')'; g.beginPath(); g.arc(R() * W, R() * H * 0.6, 0.6 + R() * 1.5, 0, 7); g.fill(); }
    g.fillStyle = '#FFF6C8'; g.beginPath(); g.arc(sx, sy, sr, 0, 7); g.fill(); g.fillStyle = P.sky1; g.beginPath(); g.arc(sx + sr * 0.42, sy - sr * 0.2, sr * 0.86, 0, 7); g.fill(); }
  else { const sg = g.createRadialGradient(sx, sy, 0, sx, sy, sr * 5); sg.addColorStop(0, 'rgba(255,250,215,.95)'); sg.addColorStop(0.18, 'rgba(255,245,200,.5)'); sg.addColorStop(1, 'rgba(255,245,200,0)'); g.fillStyle = sg; g.fillRect(0, 0, W, H);
    g.save(); g.translate(sx, sy); for(let i = 0; i < 12; i++){ g.rotate(Math.PI / 6); g.fillStyle = 'rgba(255,248,210,.09)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(sr * 7, -sr * 0.5); g.lineTo(sr * 7, sr * 0.5); g.closePath(); g.fill(); } g.restore();
    g.fillStyle = P.sun || '#FFF3B0'; g.beginPath(); g.arc(sx, sy, sr, 0, 7); g.fill(); }
  const mix = (c, a) => { const n = parseInt(c.slice(1), 16), s2 = parseInt(P.sky2.slice(1), 16), m = k => Math.round(((n >> k) & 255) * (1 - a) + ((s2 >> k) & 255) * a); return 'rgb(' + m(16) + ',' + m(8) + ',' + m(0) + ')'; };
  const hill = (y0, amp, col, f, ph) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, H); for(let x = 0; x <= W + 8; x += 8) g.lineTo(x, y0 - amp * (0.5 + 0.5 * Math.sin(x / W * Math.PI * f + ph)) - amp * 0.3 * Math.sin(x / W * Math.PI * f * 2.7 + ph * 2)); g.lineTo(W, H); g.closePath(); g.fill(); };
  hill(H * 0.36, H * 0.09, mix(P.hill2, 0.62), 2.2, 0.6); hill(H * 0.41, H * 0.075, mix(P.hill1, 0.45), 3.1, 2.1);
  g.fillStyle = mix(P.hill2, 0.35); const cx = W * 0.14, cy = H * 0.3; [[-0.022, 0.026], [0, 0.04], [0.022, 0.03]].forEach(([dx, h]) => { const x = cx + dx * W, hh = h * W; g.fillRect(x - W * 0.006, cy - hh, W * 0.012, hh + H * 0.06); g.beginPath(); g.moveTo(x - W * 0.009, cy - hh); g.lineTo(x, cy - hh - W * 0.016); g.lineTo(x + W * 0.009, cy - hh); g.fill(); }); g.fillRect(cx - W * 0.024, cy - W * 0.014, W * 0.048, H * 0.07);
  if(G.jail) emo(g, '⛓️', cx, cy - W * 0.05, W * 0.025, 0.6);
  hill(H * 0.47, H * 0.055, mix(P.hill1, 0.25), 4.3, 4.0);
  for(let i = 0; i < 26; i++){ const x = R() * W, y = H * (0.43 + R() * 0.05), r = W * (0.004 + R() * 0.005); g.fillStyle = mix(P.hill2, 0.3 + R() * 0.15); g.beginPath(); g.arc(x, y - r, r, 0, 7); g.fill(); g.fillRect(x - 1, y - r, 2, r + 3); }
  gr = g.createLinearGradient(0, H * 0.46, 0, H); gr.addColorStop(0, mix(P.hill1, 0.25)); gr.addColorStop(0.35, mix(P.hill1, 0.7)); gr.addColorStop(1, P.night ? P.sky1 : '#FFFFFF'); g.fillStyle = gr; g.fillRect(0, H * 0.48, W, H * 0.52);   // 🌫️ valley mist below the island
  if(!P.night) for(let i = 0; i < 7; i++){ const x = R() * W, y = H * (0.64 + R() * 0.32), k = W / 900 * (1 + R() * 1.4); g.fillStyle = 'rgba(255,255,255,.55)'; [[0, 0, 30], [30, 6, 22], [-30, 8, 20], [56, 12, 14], [-56, 12, 14]].forEach(([dx, dy, r]) => { g.beginPath(); g.ellipse(x + dx * k, y + dy * k, r * k * 1.4, r * k * 0.6, 0, 0, 7); g.fill(); }); }
  if(!P.night) for(let i = 0; i < 5; i++){ const x = R() * W, y = H * (0.05 + R() * 0.22), k = W / 1000 * (0.7 + R() * 0.8); g.fillStyle = 'rgba(255,255,255,' + (0.55 + R() * 0.3) + ')'; [[0, 0, 26], [24, 6, 20], [-24, 6, 18], [46, 12, 14], [-44, 12, 12], [8, 12, 20]].forEach(([dx, dy, r]) => { g.beginPath(); g.arc(x + dx * k, y + dy * k, r * k, 0, 7); g.fill(); }); }
  g.strokeStyle = P.night ? 'rgba(255,255,255,.5)' : 'rgba(70,60,90,.45)'; g.lineWidth = 1.4; for(let i = 0; i < 6; i++){ const x = W * (0.3 + R() * 0.45), y = H * (0.07 + R() * 0.16), k = W * (0.005 + R() * 0.004); g.beginPath(); g.moveTo(x - k, y - k * 0.4); g.quadraticCurveTo(x - k * 0.4, y - k * 0.6, x, y); g.quadraticCurveTo(x + k * 0.4, y - k * 0.6, x + k, y - k * 0.4); g.stroke(); }
}
/* 📏 s-td dragon#20 → TDBook_dragon.html */
// 🏮 dusk / night lights (cheap, every frame): lantern glow + light pools, fireflies at night, butterflies by day
function paintLights(g, t){
  const s = VIEW.s, n = Math.max(0, Math.min(1, TOD.v - 0.4)), night = Math.max(0, TOD.v - 1);
  if(n > 0.01){ g.save(); g.globalCompositeOperation = 'lighter';
    ISO.lanterns.forEach((L, i) => { const on = Math.max(0, Math.min(1, n * 2.2 - i * 0.06)); if(on <= 0) return; const z = isoGroundZ(L.x, L.y), px = IX(L.x, L.y), py = IY(L.x, L.y, z), r = s * 0.9;
      const gl = g.createRadialGradient(px, py - s * 0.73, 0, px, py - s * 0.73, r); gl.addColorStop(0, 'rgba(255,200,90,' + (0.75 * on) + ')'); gl.addColorStop(0.3, 'rgba(255,170,60,' + (0.3 * on) + ')'); gl.addColorStop(1, 'rgba(255,150,40,0)'); g.fillStyle = gl; g.beginPath(); g.arc(px, py - s * 0.73, r, 0, 7); g.fill();
      const pl = g.createRadialGradient(px, py, 0, px, py, r * 1.3); pl.addColorStop(0, 'rgba(255,190,90,' + (0.22 * on) + ')'); pl.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = pl; g.beginPath(); g.ellipse(px, py, r * 1.3, r * 0.65, 0, 0, 7); g.fill(); });
    const tx = IX(TD_MID, TD_MID), ty = IY(TD_MID, TD_MID, 3.2), sg = g.createRadialGradient(tx, ty, 0, tx, ty, s * 2.2); sg.addColorStop(0, 'rgba(255,220,240,' + (0.35 * n) + ')'); sg.addColorStop(1, 'rgba(255,220,240,0)'); g.fillStyle = sg; g.beginPath(); g.arc(tx, ty, s * 2.2, 0, 7); g.fill();
    if(night > 0.01 && FX) for(let i = 0; i < 26; i++){ const a = i * 2.39996, wx = TD_MID + Math.cos(a) * (2.5 + (i * 0.37) % 6) + Math.sin(t * 0.7 + i) * 0.4, wy = TD_MID + Math.sin(a) * (2.5 + (i * 0.37) % 6) + Math.cos(t * 0.6 + i * 1.3) * 0.4, z = 0.4 + 0.3 * Math.sin(t * 1.3 + i), px = IX(wx, wy), py = IY(wx, wy, z), r = s * 0.16, on = night * (0.5 + 0.5 * Math.sin(t * 3 + i * 1.7));
      const ff = g.createRadialGradient(px, py, 0, px, py, r); ff.addColorStop(0, 'rgba(220,255,140,' + on + ')'); ff.addColorStop(1, 'rgba(220,255,140,0)'); g.fillStyle = ff; g.beginPath(); g.arc(px, py, r, 0, 7); g.fill(); }
    g.restore(); }
  if(TOD.v < 0.9 && FX) for(let i = 0; i < 4; i++){ const a = t * 0.25 + i * 1.6, wx = TD_MID + Math.cos(a) * (4 + i), wy = TD_MID + Math.sin(a * 1.3) * (4 + i * 0.6), z = 1.2 + 0.3 * Math.sin(t * 5 + i); emo(g, '🦋', IX(wx, wy), IY(wx, wy, z), s * 0.32, 1 - TOD.v); }
}
/* 📏 s-td dragon#21 → TDBook_dragon.html */
function screenTf(g){ const d = VIEW.dpr; g.setTransform(d, 0, 0, d, 0, 0); }
/* 📏 s-td dragon#22 → TDBook_dragon.html */
const SCENE_PAL = {
  sunset: {sky1: '#FF9E7A', sky2: '#FFD9B3', hill1: '#B98BC9', hill2: '#8E6FB3', g1: '#A8D57A', g2: '#79B85A', g3: '#5E9A48', path: '#F0CFA0', edge: '#C89A62', stone: '#E3BC8A', tint: 'rgba(255,140,90,.10)', sun: '#FFE08A'},
  roses: {sky1: '#FFB3CF', sky2: '#FFE9F1', hill1: '#E7A1C4', hill2: '#C97AA8', g1: '#B9E58F', g2: '#90CF6E', g3: '#6EB352', path: '#F6DCC8', edge: '#DDA98C', stone: '#EDC7AE', tint: 'rgba(255,120,170,.07)', sun: '#FFF0F6'},
  moon: {sky1: '#1F2257', sky2: '#5B4E9A', hill1: '#3D3F7A', hill2: '#2B2D5E', g1: '#6E9E77', g2: '#4F8060', g3: '#3D6A4C', path: '#CFC2A0', edge: '#9C8C6A', stone: '#B7A983', tint: 'rgba(40,40,130,.2)', sun: '#FFF6C8', night: true},
  gold: {sky1: '#FFC870', sky2: '#FFEFC9', hill1: '#D9A45C', hill2: '#B9853E', g1: '#CADB7E', g2: '#A9BE58', g3: '#8AA040', path: '#F2D79A', edge: '#C99A4F', stone: '#E4C27E', tint: 'rgba(255,170,60,.08)', sun: '#FFF3B0'},
  festival: {sky1: '#B9A6FF', sky2: '#FFE0F0', hill1: '#E39BD0', hill2: '#A88BE8', g1: '#B2E48A', g2: '#86CC66', g3: '#68B04C', path: '#FBE2B8', edge: '#E3B26F', stone: '#F0CB93', tint: null, sun: '#FFF3B0'},
  chapel: {sky1: '#BFE3FF', sky2: '#FFF4FA', hill1: '#C9E2B5', hill2: '#A6CC91', g1: '#D2EDB8', g2: '#ADD893', g3: '#8DBF74', path: '#F6EEE4', edge: '#D9C9B0', stone: '#EADFCF', tint: 'rgba(255,255,255,.08)', sun: '#FFFFFF'},
};
function scenePal(){ return G && SCENE_PAL[G.C.scene] ||
  {sky1: '#8FD3FF', sky2: '#DDF3FF', hill1: '#9FD39A', hill2: '#78B87A', g1: '#B5E58A', g2: '#8CCB64', g3: '#6DAE4E', path: '#F4DDAA', edge: '#CFA868', stone: '#E8C994', tint: null, sun: '#FFF3B0'}; }
/* 📏 s-td dragon#23 → TDBook_dragon.html */
function shadow(g, x, y, r, a){ g.fillStyle = 'rgba(30,40,20,' + (a == null ? 0.22 : a) + ')'; g.beginPath(); g.ellipse(IX(x, y) + r * VIEW.s * 0.15, IY(x, y), r * VIEW.s, r * VIEW.s * V25.K * 0.75, 0, 0, Math.PI * 2); g.fill(); }
/* 📏 s-td dragon#24 → TDBook_dragon.html */

/* ---------- the frame ---------- */
let SHAKE = 0;
/* 📏 s-td dragon#25 → TDBook_dragon.html */
let PARTS = [];
function burst(x, y, z, icons, n){ if(!FX) return; for(let i = 0; i < (n || 6); i++){ const a = Math.random() * Math.PI * 2, v = 0.6 + Math.random() * 1.1; PARTS.push({x, y, z: z || 0.6, vx: Math.cos(a) * v, vy: -Math.abs(Math.sin(a)) * v * 1.4, ic: icons[i % icons.length], sz: 0.28 + Math.random() * 0.18, t: 0, dur: 0.7 + Math.random() * 0.3}); } if(PARTS.length > 120) PARTS.splice(0, PARTS.length - 120); }
function drawTxt(g, txt, x, y, fs, col){
  const parts = splitEmoji(txt); let w = 0; const ws = parts.map(p => p.e ? fs * 1.05 : g.measureText(p.t).width); w = ws.reduce((a, b) => a + b, 0);
  let cx = x - w / 2; parts.forEach((p, i) => { if(p.e) emo(g, p.t, cx + ws[i] / 2, y, fs); else { g.textAlign = 'left'; g.strokeText(p.t, cx, y); g.fillStyle = col; g.fillText(p.t, cx, y); } cx += ws[i]; }); g.textAlign = 'center';
}
const SPLIT_CACHE = new Map();
function splitEmoji(txt){ let r = SPLIT_CACHE.get(txt); if(r) return r; r = [];
  const seg = (window.Intl && Intl.Segmenter) ? Array.from(new Intl.Segmenter(undefined, {granularity: 'grapheme'}).segment(txt), x => x.segment) : Array.from(txt);
  seg.forEach(ch => { const e = /\p{Extended_Pictographic}/u.test(ch); const lastP = r[r.length - 1]; if(!e && lastP && !lastP.e) lastP.t += ch; else r.push({t: ch, e}); });
  if(SPLIT_CACHE.size > 300) SPLIT_CACHE.clear(); SPLIT_CACHE.set(txt, r); return r; }
function dots(g, x, y, n, col, s){ n = Math.min(8, n); for(let i = 0; i < n; i++){ g.fillStyle = col; g.beginPath(); g.arc(x + (i - (n - 1) / 2) * s * 0.16, y, s * 0.055, 0, Math.PI * 2); g.fill(); } }
function bar(g, x, y, w, f, col){ const h = Math.max(4, VIEW.s * 0.11); g.fillStyle = 'rgba(40,20,60,.35)'; rrect(g, x - w / 2 - 1.5, y - h / 2 - 1.5, w + 3, h + 3, h); g.fill(); g.fillStyle = 'rgba(255,255,255,.9)'; rrect(g, x - w / 2, y - h / 2, w, h, h / 2); g.fill();
  g.fillStyle = col; if(f > 0){ rrect(g, x - w / 2, y - h / 2, Math.max(h, w * Math.min(1, f)), h, h / 2); g.fill(); } }
/* 📏 s-td dragon#26 → TDBook_dragon.html */
/* ---------- 🎨 skills drawn with SkillKit LOOKS (sk-2) ----------
   Every effect a cast makes carries f.sk = {hero, key} → that skill's look (fire, honey hair, paper birds, bubble …).
   Effects without a skill (auto attacks, tower roses, suitors) get a look by kind (K_LOOK). Ground ones paint under the
   characters, air ones on top — all in screen pixels, squashed by V25.K so circles lie flat on the tilted map. */
const K_LOOK = {fireball: 'fire', bolt: 'star', rose: 'rose', bird: 'paper', swat: 'honey', zap: 'storm', cone: 'fire', boom: 'fire', coins: 'gold', crit: 'star', ting: 'holy', trap: 'rock', build: 'star', poof: 'ghost', shine: 'star',
  potion: 'candy', decree: 'gold', choc: 'honey', serenade: 'music', kiss: 'love', ring: 'gold', blink: 'cosmic',
  push: 'wind', pull: 'cosmic', daze: 'love', sleep: 'dream', fear: 'shadow', confuse: 'candy', slow: 'ice', haste: 'wind', heal: 'nature', shield: 'holy', dome: 'bubble', mirror: 'crystal', whip: 'honey', beam: 'sun'};
function skillLook(src, k){ try{ if(src && src.key){ const h = src.hero || src.h, P = TD.PACKS[h]; const e = P && P.get(src.key); if(e && e.look) return SkillKit.lookOf(e); } }catch(e){} return SkillKit.LOOKS[K_LOOK[k]] || SkillKit.LOOKS.star; }
/* 📏 s-td dragon#27 → TDBook_dragon.html */

/* ---------- 🏁 the end of a chapter ---------- */
function finish(){
  if(!G) return; if(G.fd) return fdFinish(); if(G.jail) return finishJail(); stopLoop(); hideHand(); const won = G.state === 'won', L = LEVELS[G.lvl], ch = G.C.n, lvl = G.lvl;
  const stars = won ? (G.hearts >= G.heartsMax * 0.75 ? 3 : G.hearts >= G.heartsMax * 0.4 ? 2 : 1) : 0;
  const stats = {games: 1, bonks: G.stats.bonks, waves: G.stats.waves, evolves: G.stats.evolves, ultimates: G.stats.ultimates, combos: G.stats.combos, perfect: G.stats.perfect, casts: G.stats.casts};
  if(won) stats.chapters = ch;
  const theme = '📖 Ch ' + ch + ' · ' + G.C.title;
  const extra = {score: G.score, stars, cleared: won, theme, stats, timeSec: Math.round(G.t)};
  const dT = G.trees.dragon, pT = G.trees.princess;
  const row = saveRow(); row.ch = Math.max(Number(row.ch) || 0, won ? ch : 0); row.last = {dragon: dT.save(), princess: pT.save()}; row.lastForms = dT.formName() + ' + ' + pT.formName();
  S.settings['SkillTree_td-' + S.book + '_' + S.player] = JSON.stringify(row);
  if(won) saveWin(lvl, extra); else saveWin(lvl, extra);
  saveTree(row);
  const head = won ? '<div class="rh">🏆</div><h2>Chapter ' + ch + ' done!</h2><div class="rs">' + UI.esc(G.C.title) + ' · ' + L.emoji + ' ' + L.name + '</div><div class="stars">' + '⭐'.repeat(stars) + '☆'.repeat(3 - stars) + '</div>' :
    '<div class="rh">💍</div><h2>Oh no — wedding bells!</h2><div class="rs">The suitors got into the tower on wave ' + (G.wave + 1) + '. The Princess is being carried off to a wedding…<br>🐉 But the Dragon has a plan: <b>break out of jail</b> and shout "I OBJECT!!"</div>';
  showResult(head + '<canvas id="res-cv" width="240" height="240"></canvas><div class="score">⭐ <span id="score-count">0</span></div>' +
    '<div class="builds"><span>🐉 ' + UI.esc(dT.formName()) + ' ' + SkillKit.barHtml(dT.bar(), {star: !!dT.ult}) + '</span><span>👸 ' + UI.esc(pT.formName()) + ' ' + SkillKit.barHtml(pT.bar(), {star: !!pT.ult}) + '</span>' +
    '<span style="color:var(--ink-soft)">💫 ' + G.stats.bonks + ' bonked · ❤️ ' + G.hearts + ' left · 🌊 ' + G.stats.waves + ' waves</span></div>' +
    '<div class="save-note" id="save-note"><span class="ui-spin a-pop">✅</span> Saving your score…</div>' +
    '<div class="res-btns"><button class="sp-btn sp-secondary" id="b-menu">🎚️ Levels</button><button class="sp-btn sp-secondary" id="b-again">🔁 Play again</button>' +
    (won ? '<button class="sp-btn sp-primary" id="b-diary">📔 Read the diary ▶</button>' : '<button class="sp-btn sp-primary" id="b-jail">🐉 Jailbreak! ▶</button>') + '</div>');
  countUp($('score-count'), G.score, 1100);
  try{ scResult($('res-cv'), {won, dS: TDDragon.stageOf(dT.tier), dC: dT.main || null, pS: TDPrincess.stageOf(pT.tier), pC: pT.main || null}); }catch(e){}   // 🎬 td-scenes: the heroes you really built
  $('b-again').onclick = () => startGame(ch, lvl);
  $('b-menu').onclick = () => { hideResult(); G = null; openBook(S.book); };
  if($('b-diary')) $('b-diary').onclick = () => { hideResult(); G = null; openDiary(ch, lvl, 'outro'); };
  if($('b-jail')) $('b-jail').onclick = () => { hideResult(); G = null; S.jail = {ch, lvl}; openDiary('jail', lvl, 'intro'); };
}
/* 📏 s-td dragon#28 → TDBook_dragon.html */
function countUp(el, to, ms){ if(!el) return; const t0 = performance.now(); (function tick(now){ const p = Math.max(0, Math.min(1, (now - t0) / ms)); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString(); if(p < 1) requestAnimationFrame(tick); })(t0); }
function showResult(html){ $('result-card').innerHTML = html; $('result').classList.remove('hidden'); }
function hideResult(){ $('result').classList.add('hidden'); }
const PENDING_KEY = 'sp_tdstories_pending';
function readPending(){ try{ return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); }catch(e){ return []; } }
function writePending(list){ try{ localStorage.setItem(PENDING_KEY, JSON.stringify(list.slice(-20))); }catch(e){} }
function boardId(){ return BOOK(S.book).board; }   // fd-1: td-farmer for book 2
function flushPending(){ const list = readPending(); if(!list.length) return; writePending([]); list.forEach(w => google.script.run.withFailureHandler(() => writePending(readPending().concat([w]))).saveLevelResult(w.board || 'td-draprincess', w.name, w.lvl, w.extra)); }
function saveWin(lvlIdx, extra, tries){
  tries = tries || 0; const name = S.player, board = boardId();
  const PM = progMap(), p = PM[name] || (PM[name] = {unlocked: 0, tokens: [], best: []});
  if(extra.cleared) p.unlocked = Math.max(p.unlocked, lvlIdx + 1);
  google.script.run.withSuccessHandler(res => {
      const best = (p.best || []).slice(); if(res.best) best[lvlIdx] = res.best;
      PM[name] = {unlocked: res.unlocked, tokens: res.tokens, best}; flushPending();
      const n2 = $('save-note'); if(n2) n2.innerHTML = saveText(res);
    }).withFailureHandler(err => {
      if(tries < 1){ setTimeout(() => saveWin(lvlIdx, extra, tries + 1), 1200); return; }
      writePending(readPending().concat([{board, name, lvl: lvlIdx, extra}]));
      const n2 = $('save-note'); if(n2) n2.innerHTML = '⚠️ Could not save yet — it will be sent again next time.';
    }).saveLevelResult(board, name, lvlIdx, extra);
}
function saveTree(row){ try{ google.script.run.withFailureHandler(() => {}).saveSkillTree(S.player, boardId(), JSON.stringify(row)); }catch(e){} }
function saveText(res){
  let h = res.newBadge ? '🏅 New badge: ' + UI.esc(res.newBadge) : res.newHighScore && !res.firstTime ? '🎉 New high score!' : res.best && res.best.score ? 'Your best: 🏆 ' + Number(res.best.score).toLocaleString() : '✅ Score saved';
  const fe = res.feats; if(fe){ (fe.newTitles || []).forEach(t => { h += '<br>🏷️ New title: ' + t.icon + ' ' + UI.esc(t.name); }); (fe.newBadges || []).forEach(b => { h += '<br>' + b.medal + ' ' + b.icon + ' ' + UI.esc(b.name) + ' · ' + b.tierName; }); }
  return h;
}
/* 📏 s-td dragon#29 → TDBook_dragon.html */
function pauseGame(){ if(G) G.paused = true; }
/* 📏 s-td farmer#2 → TDBook_farmer.html */
const FDP = {sel: 'mush', pick: null, mode: 'plant', moveId: 0, hint: [], ghosts: [], pics: new Map(), bgs: [null, null, null], bgKey: '', tod: 0, morph: {farmer: null, goat: null}, seen: {farmer: 1, goat: 1}, toldSeal: 0, used: 0, card: 0, rain: []};
const isFarm = () => !!(G && G.fd);
/* 📏 s-td farmer#3 → TDBook_farmer.html */
const fdK2 = k => FD.kindOf(k) || FD.PLANTS.mush;   // 🌊 fd-2b: a plant or a build tool
(function(){ const st = document.createElement('style'); st.id = 'fd-css'; st.textContent = [
  '.fd-build{display:flex;align-items:center;gap:var(--bgap,7px);flex-wrap:wrap;justify-content:center;background:rgba(255,255,255,.55);border-radius:16px;padding:4px 8px;box-shadow:0 2px 0 rgba(0,0,0,.08)}',
  '.fd-plant{position:relative;width:var(--skk-bs,46px);height:var(--skk-bs,46px);border-radius:14px;border:2.5px solid #fff;background:linear-gradient(180deg,#FFF8E6,#F3DDB0);box-shadow:0 3px 0 #C9A46A,0 0 0 2px var(--pc,#8BC34A);font-size:calc(var(--skk-bs,46px)*.5);line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;transition:transform .12s}',
  '.fd-plant .pr{position:absolute;right:-5px;bottom:-6px;background:#5C3B1E;color:#fff;font:800 11px/1 Fredoka,Nunito,sans-serif;padding:2px 4px;border-radius:8px;border:1.5px solid #fff}',
  '.fd-plant.on{transform:translateY(-3px) scale(1.06);box-shadow:0 3px 0 #C9A46A,0 0 0 3px #FFC93C,0 0 14px #FFC93C;background:linear-gradient(180deg,#FFFDF2,#FFE7A6)}',
  '.fd-plant.poor{filter:grayscale(.6) brightness(.95)} .fd-plant.poor .pr{background:#B23B3B}',
  '.fd-plant.lock{filter:grayscale(1);opacity:.55} .fd-plant.lock .pr{background:#777}',
  '.fd-plant.tool{background:linear-gradient(180deg,#EAF6FF,#BFE3FF);box-shadow:0 3px 0 #6FA8D6,0 0 0 2px var(--pc,#3A86FF)} .fd-plant.tool.on{background:linear-gradient(180deg,#F4FBFF,#CFEBFF)}',   /* 🌊 fd-2b */
  '.fd-seeds{font:800 clamp(.9rem,1.6vmin + .5rem,1.25rem) Fredoka,Nunito,sans-serif;color:#5C3B1E;white-space:nowrap;padding:0 4px}',
  '.fd-steps{position:absolute;left:8px;bottom:8px;z-index:6;background:rgba(255,255,255,.9);border-radius:12px;padding:3px 9px;font:800 clamp(.72rem,1.2vmin + .45rem,1rem) Fredoka,Nunito,sans-serif;color:#5C3B1E;box-shadow:0 2px 0 rgba(0,0,0,.12);pointer-events:none;max-width:70%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
  '.fd-steps b{color:#22A867}',
  '.fd-card{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:30;background:#FFF9EC;border:3px solid #fff;border-radius:18px;box-shadow:0 6px 0 rgba(90,60,30,.25),0 10px 30px rgba(0,0,0,.25);padding:10px 12px;display:flex;flex-direction:column;gap:8px;width:min(92%,420px);animation:fdIn .22s ease-out both}',
  '@keyframes fdIn{from{transform:translateX(-50%) translateY(20px) scale(.9);opacity:0}to{transform:translateX(-50%);opacity:1}}',
  '.fd-card .hd{display:flex;align-items:center;gap:8px;font:800 1.05rem Fredoka,Nunito,sans-serif;color:#5C3B1E} .fd-card .hd .ic{font-size:1.7rem} .fd-card .hd small{display:block;font:600 .8rem Nunito,sans-serif;color:#8A6A48}',
  '.fd-card .st{display:flex;gap:4px} .fd-card .st i{width:16px;height:8px;border-radius:4px;background:#E8D9BE} .fd-card .st i.on{background:#7CC25A}',
  '.fd-card .row{display:flex;gap:6px;flex-wrap:wrap} .fd-card .row .sp-btn{flex:1 1 40%;min-height:44px;font-size:.9rem}',
  '.fd-card .hd .ic .fd-pp{display:block} .fd-card .fd-gp{flex-direction:column;gap:2px} .fd-card .fd-gp .fd-pp{display:block;flex:0 0 auto;pointer-events:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.25))} .fd-card .fd-gp br{display:none}',
  '.fd-card .x{position:absolute;right:6px;top:4px;border:0;background:none;font-size:1.2rem;cursor:pointer;width:36px;height:36px}',
  '.fd-story{position:absolute;inset:0;z-index:35;display:flex;align-items:center;justify-content:center;background:rgba(40,25,10,.45)}',
  '.fd-story .pg{background:#FFF6E2;border:4px solid #fff;border-radius:20px;max-width:min(92%,460px);padding:14px 16px;text-align:center;font:600 1rem Nunito,sans-serif;color:#4A3420;box-shadow:0 8px 30px rgba(0,0,0,.3);animation:fdPop .3s ease-out both}',
  '.fd-story .pg h3{font:800 1.25rem Fredoka,Nunito,sans-serif;margin:0 0 6px} .fd-story .pg .big{font-size:2.2rem}',
  '@keyframes fdPop{from{transform:scale(.7);opacity:0}to{transform:none;opacity:1}}',
  '.book.soon .bi{margin-top:clamp(10px,2.2vw,24px)}',   /* 🔜 the ribbon never sits on a coming-soon book\'s emoji */
].join('\n'); document.head.appendChild(st); })();
/* 📏 s-td farmer#4 → TDBook_farmer.html */
function fdLeave(){ FDR.spin = null; fdSetRot(0); ISO.rq = 0; fdCloseCard(); fdCloseStory(); const s = $('fd-steps'); if(s) s.classList.add('hidden'); const zb = $('fd-zoom'); if(zb) zb.classList.add('hidden'); const sp = $('scr-play'); sp.classList.remove('fd', 'tl', 'tl-land', 'fd-port'); { const bb = $('fd-build'); if(bb) bb.remove(); } FDZ.z = 1; FDZ.ox = FDZ.oy = 0; if(typeof VIEW !== 'undefined' && VIEW.base){ VIEW.s = VIEW.base; VIEW.base = null; VIEW.px = -1; } BAR.hide('pump'); BAR.hide('seeds'); BAR.hide('coll'); }
/* 📏 s-td farmer#5 → TDBook_farmer.html */
function fdAfterPicks(){
  if(!G || !G.fd) return; layout();
  if(G.state === 'break'){ const n = G.wave + 2, boss = G.C.waves[n - 1].some(g => FD.FOES[g[0]].boss), rain = G.C.rain && G.C.rain.includes(n - 1);
    banner(boss ? '👑 BOSS WAVE: ' + FD.FOES[G.C.boss].name + '!' : (rain ? '🌧️ ' : '🌊 ') + 'Wave ' + n + ' of ' + G.C.waves.length + ' — plant your maze, then ▶ Go!', boss ? 'bad' : '');
    goShow(); fdHints();   // 🔔 fd-1e
    if(LEVELS[G.lvl].guide && G.wave < 0) setTimeout(() => fdHandOnSpot(), FX ? 300 : 0); }
}
// 👆 / 👻 the best spots glow (🌱 Basic + 🐣 Junior, and while a "new route" break is open)
function fdHints(){ if(!isFarm()) return; FDP.hint = (G.lvl <= 1 || G.freeMoveT > 0) && !LEVELS[G.lvl].hardcore ? FD.bestSpots(G, G.lvl === 0 ? 1 : 3) : []; }
/* 📏 s-td farmer#6 → TDBook_farmer.html */

/* ---------- 👆 tapping the map: plant (tap twice) · open a plant · move ---------- */
function fdCellAt(px, py){ const p = fdWorldAt(px, py), x = p.x, y = p.y; return {i: Math.floor(x + FD.O), j: Math.floor(y + FD.O)}; }
function fdWorldAt(px, py){ const a = (px - ISO.OX) / ISO.A, b = (py - ISO.OY) / ISO.B, x1 = (a + b) / 2, y1 = (b - a) / 2; if(!ISO.rq) return {x: x1, y: y1};   // 🔄 undo the turn (🧱 IsoKit iso-turn core)
  return Iso.turnBack(x1, y1, FDR.th, ISO.rcx, ISO.rcy, {}); }
function fdTap(e){
  if(FDR.spin) return;   // 🔄 no planting mid-spin
  if(!isFarm() || pickOpen || G.paused || G.state === 'won' || G.state === 'lost' || G.state === 'pick') return;
  const r = $('cv').getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, c = fdCellAt(px, py);
  let P = FD.plantAt(G, c.i, c.j); if(FDP.mode !== 'move'){ const H = fdPlantHit(px, py); if(H && (!P || fdDep(H.x, H.y) > fdDep(P.x, P.y))){ fdOpenCard(H); return; } }   // 👆 fd-1d: the top of a tall plant IN FRONT wins (it is what you see there)
  if(P && FDP.mode !== 'move'){ fdOpenCard(P); return; }
  if(FDP.mode !== 'move' && fdPondTap(c)) return;   // 🌊 fd-2b
  if(FDP.mode === 'move'){ const mp = G.plants.find(q => q.id === FDP.moveId); if(!mp){ FDP.mode = 'plant'; return; }
    if(P && P.id === mp.id){ FDP.mode = 'plant'; FDP.moveId = 0; banner('🚚 Move cancelled'); return; }
    if(FD.move(G, mp.id, c.i, c.j)){ UISound.play('pop'); FDP.mode = 'plant'; FDP.moveId = 0; FDP.pick = null; fdHints(); } return; }
  fdCloseCard();
  if(FDP.pick && FDP.pick.i === c.i && FDP.pick.j === c.j){ const P2 = FD.plant(G, c.i, c.j, FDP.sel); FDP.pick = null; if(P2){ UISound.play('pop'); FDP.used++; fdHints(); } return; }
  if(FDP.sel === 'bridge'){ FDP.pick = null; banner('🌉 Bridges go on a canal — dig one first with 🌊', 'bad'); UISound.play('bump'); return; }   // 🌊 fd-2b
  const can = FD.canPlant(G, c.i, c.j, FDP.sel); if(!FD.buildable(G, c.i, c.j)){ FDP.pick = null; return; }
  FDP.pick = {i: c.i, j: c.j, can, pre: can.ok || can.why === 'seeds' ? FD.previewSteps(G, c.i, c.j) : null, t: performance.now()};
  UISound.play('tap');
  if(!can.ok) fdWhy(can.why, c);
  else { const K = fdK2(FDP.sel), cost = FD.costOf(G, FDP.sel, c.i, c.j); banner(K.icon + ' Tap again to ' + (FDP.sel === 'canal' ? 'dig' : 'plant') + ' · ' + cost + ' 🌰' + (cost < K.cost ? ' 💧' : '') + (FDP.pick.pre.gain > 0 ? ' · +' + FDP.pick.pre.gain + ' steps!' : '')); }
}
function fdWhy(why, c){ const K = fdK2(FDP.sel);
  if(why === 'seal'){ banner('🚫 They need a way in! Leave a path open', 'bad'); UISound.play('error'); FDP.shake = {i: c.i, j: c.j, t: performance.now()}; }
  else if(why === 'seeds') banner('🌰 Not enough seeds — ' + K.icon + ' costs ' + K.cost + '. Collectors who give up drop seeds!', 'bad');
  else if(why === 'busy') banner('🚶 Someone is walking there — wait a moment');
  else if(why === 'locked') banner('🔒 ' + K.name + ' opens in chapter ' + K.ch);
  else if(why === 'nocanal') banner('🌉 Bridges go on a canal — dig one first with 🌊', 'bad'); }
function fdOpenCard(P){
  fdCloseCard(); FDP.pick = null; const sp = FD.plantSpec(P), K = FD.PLANTS[P.kind], box = document.createElement('div'); box.className = 'fd-card'; box.id = 'fd-card';
  const cost = FD.growCost(P, G), wet = FD.nearWater(G, P.i, P.j), mv = FD.moveCost(G), next = P.st === 3 ? null : P.st < 5 ? (P.st >= 4 ? K.b[P.br].name : K.name) : null;
  let grow = '';
  if(P.st === 3) grow = K.b.map((b, i) => '<button class="sp-btn sp-primary" data-g="' + i + '" style="background:' + COLORS[b.col].hex + '">' + ['①', '②'][i] + ' ' + b.icon + ' ' + UI.esc(b.name) + ' · ' + cost + '🌰' + (wet ? ' 💧' : '') + '<br><small>' + UI.esc(b.does) + '</small></button>').join('');
  else if(P.st < 5) grow = '<button class="sp-btn sp-primary" data-g="x">🌱 Grow → stage ' + (P.st + 1) + (P.st + 1 === 5 ? ' ⭐' : '') + ' · ' + cost + '🌰' + (wet ? ' 💧' : '') + '<br><small>' + UI.esc(next) + ' gets bigger + stronger</small></button>';
  else grow = '<div style="text-align:center;font-weight:800;color:#22A867">⭐ Fully grown!</div>';
  box.innerHTML = '<button class="x" data-sound="tap" aria-label="Close">✖</button><div class="hd"><span class="ic">' + sp.icon + '</span><div>' + UI.esc(sp.name) + ' · stage ' + P.st + '<small>' + UI.esc(sp.does) + '</small></div></div>' +
    '<div class="st">' + [1, 2, 3, 4, 5].map(n => '<i class="' + (n <= P.st ? 'on' : '') + '"></i>').join('') + '</div><div class="row">' + grow + '</div>' +
    '<div class="row"><button class="sp-btn sp-secondary" data-a="move">🚚 Move · ' + (mv ? mv + '🌰' : 'FREE') + '</button><button class="sp-btn sp-secondary" data-a="pull">♻️ Pull up · +' + Math.floor(P.spent / 2) + '🌰</button></div>';
  $('arena').appendChild(box); FDP.card = P.id; FDP.selP = P.id;
  if(fdHasProps()){ const ic = box.querySelector('.hd .ic'); if(ic){ ic.textContent = ''; ic.appendChild(fdPlantCanvas(P.kind, P.st, P.br, 46)); }   // 🌱 fd-1c: the plant now
    box.querySelectorAll('[data-g]').forEach(b => { const br = b.dataset.g === 'x' ? P.br : Number(b.dataset.g); b.prepend(fdPlantCanvas(P.kind, P.st + 1, br, 40)); b.classList.add('fd-gp'); }); }   // + what it becomes
  box.querySelector('.x').onclick = () => fdCloseCard();
  box.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { const br = b.dataset.g === 'x' ? undefined : Number(b.dataset.g); if(FD.grow(G, P.id, br)){ UISound.play('unlock'); fdOpenCard(P); } else UISound.play('error'); });
  box.querySelector('[data-a="pull"]').onclick = () => { FD.pull(G, P.id); UISound.play('pop'); fdCloseCard(); fdHints(); };
  box.querySelector('[data-a="move"]').onclick = () => { if(G.seeds < FD.moveCost(G)){ UISound.play('error'); banner('🌰 Moving costs 1 seed', 'bad'); return; } FDP.mode = 'move'; FDP.moveId = P.id; fdCloseCard(); banner('🚚 Tap an empty spot to move the ' + sp.name + ' (it keeps its stage)'); };
}
/* 🌊 ✦ fd-2b the pond chapter's taps: a bridge lifts / lowers at once (timing is the fun), the lever swaps the corn gates, a canal opens its card */
function fdPondTap(c){ if(!G.C.pond) return false;
  const B = FD.bridgeAt(G, c.i, c.j); if(B){ fdCloseCard(); FDP.pick = null; const r = FD.toggleBridge(G, B.id); fdPondSay(r, B.up ? '🌉 Bridge UP — they must go round!' : '🌉 Bridge down — they can cross'); return true; }
  const S = FD.switchAt(G, c.i, c.j); if(S){ fdCloseCard(); FDP.pick = null; const r = FD.flip(G, S.id); fdPondSay(r, '🌽 Corn gates swapped — the walk changes lanes!'); return true; }
  const C = FD.canalAt(G, c.i, c.j); if(C){ FDP.pick = null; if(FDP.sel === 'bridge'){ if(FD.buildBridge(G, c.i, c.j)){ UISound.play('pop'); fdCloseCard(); } return true; } fdOpenCanal(C); return true; }
  return false; }
function fdPondSay(r, okTxt){ if(r.ok){ UISound.play('whoosh'); banner(okTxt); fdHints(); return; } UISound.play('bump');
  banner(r.why === 'rest' ? '⏳ Wait ' + Math.ceil(r.left) + ' s — it needs a little rest' : r.why === 'busy' ? '🚶 Someone is on it — wait a moment' : r.why === 'seal' ? '🚫 They need a way in! That would close the last way' : '🤔 Not now', r.why === 'seal' ? 'bad' : ''); }
function fdOpenCanal(C){ fdCloseCard(); const B = FD.bridgeAt(G, C.i, C.j), box = document.createElement('div'); box.className = 'fd-card'; box.id = 'fd-card';
  box.innerHTML = '<button class="x" data-sound="tap" aria-label="Close">✖</button><div class="hd"><span class="ic">🌊</span><div>Canal<small>A water wall — nobody walks through it. Plants beside water cost less 💧</small></div></div>' +
    '<div class="row">' + (B ? '' : '<button class="sp-btn sp-primary" data-a="bridge">🌉 Build a lift bridge · ' + FD.TOOLS.bridge.cost + '🌰<br><small>tap it later: up = blocked · down = they cross</small></button>') +
    '<button class="sp-btn sp-secondary" data-a="fill">♻️ Fill it back · +' + (B ? 2 : 1) + '🌰</button></div>';
  $('arena').appendChild(box); box.querySelector('.x').onclick = () => fdCloseCard();
  const bb = box.querySelector('[data-a="bridge"]'); if(bb) bb.onclick = () => { if(FD.buildBridge(G, C.i, C.j)){ UISound.play('unlock'); fdCloseCard(); } else UISound.play('error'); };
  box.querySelector('[data-a="fill"]').onclick = () => { FD.fill(G, C.i, C.j); UISound.play('pop'); fdCloseCard(); fdHints(); }; }
function fdCloseCard(){ const c = $('fd-card'); if(c) c.remove(); FDP.card = 0; FDP.selP = 0; }
/* 📏 s-td farmer#7 → TDBook_farmer.html */
function fdCloseStory(){ const d = $('fd-story'); if(d) d.remove(); }
/* 📏 s-td farmer#8 → TDBook_farmer.html */
function fdBgTop(g, base, tod, W, H){ g.setTransform(VIEW.dpr, 0, 0, VIEW.dpr, 0, 0);
  if(base.tint){ g.fillStyle = base.tint; g.fillRect(0, 0, W, H); }
  if(tod){ g.globalCompositeOperation = 'source-atop'; g.fillStyle = tod === 2 ? 'rgba(30,30,110,.40)' : 'rgba(255,120,60,.15)'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; }
  const vg = g.createRadialGradient(W / 2, H * 0.55, Math.min(W, H) * 0.4, W / 2, H * 0.55, Math.max(W, H) * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(40,20,60,.2)'); g.fillStyle = vg; g.fillRect(0, 0, W, H); }
/* 📏 s-td farmer#9 → TDBook_farmer.html */
/* 🌳 fd-1b: 🌾 IsoProps farm props instead of the stand-ins — 🏡 farmhouse (👨‍🌾 on its porch roof = it.stand) · 🚪 farm gates (the chapter's 🚧 new back gate = state 'new') ·
   🎃 pumpkin pile by the door = your pumpkins (1–12) · 🌾 hay bales · 🧑‍🌾 scarecrows · 🕳️ mud pits · 🪨 rocks · 🌳 the misty edge ring (mango · tree · mushroom tree ·
   corn · sunflower · hay · pumpkins · bush). Drawn through Iso.drawPic with a little view that speaks TD-Stories' own projection (IX / IY); without IsoProps
   the old painters stay (fallback). */
const FDPR = {it: new Map()};
const fdHasProps = () => typeof Props !== 'undefined' && !!Props.item && !!Iso.drawPic;
/* 📏 s-td farmer#10 → TDBook_farmer.html */
// one item per key (cached; a new state / look = a new item, pictures come from IsoProps' own cache)
function fdItem(key, prop, i, j, o){ const k = key + '|' + prop + '|' + i + ',' + j + '|' + JSON.stringify(o || {}); let it = FDPR.it.get(k); if(it) return it;
  if(FDPR.it.size > 600) FDPR.it.clear(); try{ it = Props.item(prop, i, j, Object.assign({look: 'farm'}, o || {})); if(it){ it._prop = prop; it._o = o || {}; } }catch(e){ it = null; } FDPR.it.set(k, it); return it; }
/* 📏 s-td farmer#11 → TDBook_farmer.html */
/* 🔄 fd-1d: the view turns (Aowu 21:26 · his Home Layout app = the guide): only the CAMERA turns — maze, paths, saves never change. ⟲ ⟳ (Q / E) spin 90°
   in 0.42 s round the island (zoomed in: round the spot in the middle of the screen); the ground spins smoothly (the baked island drawn through
   one affine matrix), things standing on it slide with the spin and switch to their turned picture half way (IsoProps rebuilds a turned MODEL, never
   a mirror). The angle is kept per player (localStorage). 🔄 td-turn: BOTH books turn (book 1 bakes its own turned island — b1Isl — and keeps
   its view per player AND per book); ISO.rq = 0 = the old formulas in view 0. */
const FDR = {k: 0, th: 0, spin: null};
// 🔄 iso-turn: the turn math is IsoKit's core (Iso.turnCS / turnPt / turnBack / turnK / turnEase / turnMap / faceTrack / turnLeft); TD keeps its own camera (IX / IY / groundTf)
function fdSetRot(th){ const cs = Iso.turnCS(th); ISO.rc = cs[0]; ISO.rs = cs[1]; ISO.rcx = ISO.rcy = TD_MID; ISO.rq = cs[0] === 1 && cs[1] === 0 ? 0 : 1; FDR.th = th; }
const fdK = () => Iso.turnK(FDR.th);
// a world point (x, y) in the turned view's own frame
const FDQ = {x: 0, y: 0};
function fdRot(x, y){ if(!ISO.rq) return [x, y]; Iso.turnPt(x, y, FDR.th, ISO.rcx, ISO.rcy, FDQ); return [FDQ.x, FDQ.y]; }
const fdDep = (x, y) => { const r = fdRot(x, y); return r[0] + r[1]; };   // far → near in the turned view
/* 📏 s-td farmer#12 → TDBook_farmer.html */
/* 🌱 fd-1c: the plants ARE IsoProps growing props (ip-3c) — one line per kind, the state IS the stage: 1 seed · 2 sprout · 3 young · 4a / 5a branch ① ·
   4b / 5b branch ② (each a new SHAPE, branch = its SkillKit colour). Every grow plays the 🐣 morph moment (Props.morphFx: 1.2 s, 🌱 Basic 0.6 s, no flash);
   the grow card shows the plant now + what each button turns it into. Without IsoProps the FG draft painters stay. */
const FD_PLINE = {mush: 'growmush', corn: 'growcorn', sun: 'growsun', pepper: 'growpepper', pump: 'growpump'};
const fdBr = br => br === 1 ? 'b' : 'a';
function fdPlantIt(P, st, br){ const line = FD_PLINE[P.kind]; return line ? fdItem('plant', line, P.i, P.j, {stage: st || P.st, branch: fdBr(br != null ? br : P.br)}) : null; }
// a small picture of a plant (kind · stage · branch) for the grow card: the prop's own canvas, fitted into px × px
function fdPlantCanvas(kind, st, br, px){ const c = document.createElement('canvas'), d = Math.min(3, devicePixelRatio || 1); c.width = c.height = Math.round(px * d); c.style.width = c.style.height = px + 'px'; c.className = 'fd-pp';
  try{ const src = Props.canvas(FD_PLINE[kind], {look: 'farm', stage: st, branch: fdBr(br), k: 1.5, s: d}), b = fdTrim(src), f = Math.min(c.width / b.w, c.height / b.h);
    c.getContext('2d').drawImage(src, b.x, b.y, b.w, b.h, (c.width - b.w * f) / 2, c.height - b.h * f, b.w * f, b.h * f); }catch(e){} return c; }
// the painted box of a picture (a prop canvas has room round it for the rim + live layer) — measured once
const FD_TRIM = new WeakMap();
function fdTrim(src){ let b = FD_TRIM.get(src); if(b) return b; b = {x: 0, y: 0, w: src.width, h: src.height};
  try{ const W = src.width, H = src.height, a = src.getContext('2d').getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for(let y = 0; y < H; y++) for(let x = 0; x < W; x++) if(a[(y * W + x) * 4 + 3] > 12){ if(x < x0) x0 = x; if(x > x1) x1 = x; if(y < y0) y0 = y; if(y > y1) y1 = y; }
    if(x1 >= x0) b = {x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1}; }catch(e){} FD_TRIM.set(src, b); return b; }
/* 📏 s-td farmer#13 → TDBook_farmer.html */
const FD_PSC = [1, 1.6, 1.45, 1.3, 1.2, 1.15];   // fd-1d (Aowu 21:26): plants ~1.3× (seeds 1.6×) — easy to see + tap; giants grow less so the maze stays readable
/* 📏 s-td farmer#14 → TDBook_farmer.html */
// how tall a plant stands on screen (its prop height × the size boost)
function fdPlantH(P){ let h = 40; try{ const it = fdPlantIt(P); const gh = it && it.grow && it.grow.h; h = (gh && (typeof gh === 'object' ? gh[it.state] : gh)) || 40; }catch(e){} return h * ISO.zi * (FD_PSC[P.st] || 1) + ISO.B * 0.6; }
// 👆 a tap on the TOP part of a tall plant picks that plant (not the hidden square behind it); frontmost first
function fdPlantHit(px, py){ let best = null, bd = -1e9; G.plants.forEach(P => { const x = IX(P.x, P.y), y = IY(P.x, P.y, 0), h = fdPlantH(P);
    if(Math.abs(px - x) < ISO.A * 0.55 && py < y - ISO.B * 0.9 && py > y - h){ const d = fdDep(P.x, P.y); if(d > bd){ bd = d; best = P; } } }); return best; }
/* 📏 s-td farmer#15 → TDBook_farmer.html */
/* ================= 📱 fd-1a2 phone layouts + 🤏 pinch zoom (Aowu 17:49 · 17:57: both books — 🐉 Dragon Princess too) =================
   sideways phone: ONE bar row (◀ folds Gameroom · Levels · 🏠 into its ▾ menu, score + ⏸ on the same row) · 🌱 plants in a column on the LEFT ·
   map in the middle, filling it · skills on the RIGHT: 👨‍🌾 hero 3 × 2 on top, 🐐 pet 3 × 2 below (Aowu 17:57) ·
   upright phone: map as tall as it can be, plants + skills compact under it · every size: pinch / wheel zoom + drag to pan (a tap still plants) */
const FDZ = {z: 1, ox: 0, oy: 0, min: 1, max: 2.6, pts: new Map(), g: null};
const inPlay = () => !!G && !$('scr-play').classList.contains('hidden');
function fdMode(){ const w = innerWidth, h = innerHeight; if(h < 520 && w > h) return 'land'; if(w < 640 && h > w) return 'port'; return 'wide'; }
(function(){ const st = document.createElement('style'); st.id = 'fd-css2'; st.textContent = [
  '#scr-play.tl .banner{top:auto;bottom:auto;top:44px;transform:translateX(-50%);font-size:clamp(.78rem,1.4vmin + .5rem,1.15rem);padding:6px 14px;max-width:86%;border-radius:14px}',
  '#scr-play.tl .banner.on{transform:translateX(-50%)}',
  '#scr-play.tl-land .banner{font-size:.85rem;padding:4px 12px;top:40px}',
  '#scr-play.tl #cv{touch-action:none;transform-origin:0 0}',
  /* sideways phone: one bar row */
  '#scr-play.tl-land .gb-back .gt,#scr-play.tl-land .gb-lvb,#scr-play.tl-land .gb-home,#scr-play.tl-land .gb-title,#scr-play.tl-land .gb-lvg,#scr-play.tl-land .gb-br{display:none !important}',
  '#scr-play.tl-land .gb-fx{display:inline}#scr-play.tl-land .gb-back{padding:0 9px}',
  '#scr-play.tl-land .arena{flex-direction:row !important;align-items:stretch;justify-content:center;gap:6px;padding-left:max(6px,env(safe-area-inset-left));padding-right:max(6px,env(safe-area-inset-right))}',
  '#fd-left{display:none}#fd-left:empty{display:none !important}#scr-play.tl-land #fd-left{display:flex;flex-direction:column;justify-content:center;flex:0 0 auto}',
  '#scr-play.tl-land #fd-left .fd-build{flex-direction:column;flex-wrap:nowrap;padding:6px 4px;gap:var(--bgap,6px)}',
  '#scr-play.tl-land #fd-left .fd-seeds{font-size:.95rem;padding:0}',
  '#fd-build .fd-seeds{min-width:3.3em;text-align:center}',
  '#scr-play.tl-land #fd-left .fd-build.two{display:grid;grid-template-columns:repeat(2,var(--skk-bs,46px));justify-items:center;align-items:center} #scr-play.tl-land #fd-left .fd-build.two .fd-seeds{grid-column:1 / -1;text-align:center}',   /* 🌊 fd-2b */
  '#scr-play.tl-land #panel{width:auto !important;flex:0 0 auto;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px}',
  /* Aowu 17:57: right side = 3 × 2 for the hero on top, 3 × 2 for the pet below */
  '#scr-play.tl-land .hero{width:auto;padding:4px 6px 6px;margin:0}',
  '#scr-play.tl-land .hero .hn{display:none}#scr-play.tl-land .hero .hh{justify-content:center;margin:0 0 3px;min-height:0}',
  '#scr-play.tl-land .hero .hf{width:26px;height:26px;font-size:1rem}#scr-play.tl-land .hero .hf canvas{width:26px;height:26px}',
  '#scr-play.tl-land .hero .btns{display:grid !important;grid-template-columns:repeat(3,var(--skk-bs,46px));gap:var(--bgap,6px);justify-content:center}',
  '#scr-play.tl-land .hero .btns .skk-btn{margin:0}',
  /* upright phone: compact hero rows (face + buttons on one line) */
  '#scr-play.fd-port .hero{display:flex;align-items:center;gap:6px;padding:4px 6px}',
  '#scr-play.fd-port .hero .hh{flex:0 0 auto;margin:0}#scr-play.fd-port .hero .hn{display:none}',
  '#scr-play.fd-port .hero .btns{flex:1;display:flex;justify-content:space-between;gap:4px}',
  '#scr-play.fd-port .fd-build{padding:3px 6px}#scr-play.fd-port #panel{gap:4px}',
  '.fd-zoom{position:absolute;right:8px;bottom:8px;z-index:6;display:flex;flex-direction:column;gap:4px}',
  '.fd-zoom button{width:36px;height:36px;border-radius:50%;border:2px solid #fff;background:rgba(255,255,255,.9);font:800 1.1rem Fredoka,sans-serif;color:#5C3B1E;box-shadow:0 2px 0 rgba(0,0,0,.15);padding:0}',
].join('\n'); document.head.appendChild(st); })();
// returns true when the phone layout took over (book 1's layout() then stops)
function fdLayout(){
  const sp = $('scr-play'), mode = fdMode(), fd = !!G.fd; sp.classList.add('tl'); sp.classList.toggle('fd', fd); sp.classList.toggle('tl-land', mode === 'land'); sp.classList.toggle('fd-port', fd && mode === 'port');
  if(FDP.lmode !== mode){ const was = FDP.lmode; FDP.lmode = mode; if(was && G && G.trees) (fd ? fdRenderPanel : renderPanel)(); }   // turned the phone → the panel changes shape
  if(fd) fdPlaceBuild(mode); if(mode === 'wide') return false;   // 🐉 book 1 uses the same phone layouts (no plant column)
  const A = $('arena'), st = $('stage'), P = $('panel'), L = fd ? $('fd-left') : null; A.classList.toggle('col', mode === 'port'); if(mode === 'land'){ P.style.width = ''; P.style.flexDirection = ''; }
  const pad = parseFloat(getComputedStyle(A).paddingBottom) || 18, W = A.clientWidth - 12, H = A.clientHeight - 6 - pad;
  let bs, gap = 6, sw, sh;
  if(mode === 'land'){
    bs = Math.max(36, Math.min(54, Math.floor((H - 30 - 6 * gap) / 6), Math.floor((H - 2 * 44 - 4 * gap - 8) / 4)));   // left: seeds + 5 plants · right: 2 heroes × 2 rows (+ a small face each)
    sp.style.setProperty('--skk-bs', bs + 'px'); sp.style.setProperty('--bgap', gap + 'px'); sp.style.setProperty('--hf', '1.4rem');
    const lw = L && L.childElementCount ? L.getBoundingClientRect().width || bs + 12 : 0, pw = P.getBoundingClientRect().width || 3 * bs + 2 * gap + 12;
    sw = Math.max(240, Math.floor(W - lw - pw - 12)); sh = Math.max(200, Math.floor(H));   // the sky above the island is cut (the map is the point here)
  } else {
    sp.style.setProperty('--bgap', gap + 'px'); sp.style.setProperty('--hf', '1.4rem');
    bs = Math.max(38, Math.min(52, Math.floor((W - 64 - 5 * 4) / 6))); sp.style.setProperty('--skk-bs', bs + 'px');
    A.classList.add('col'); P.style.flexDirection = 'column'; P.style.width = Math.min(W, 600) + 'px';
    const ph = P.getBoundingClientRect().height || 3 * (bs + 14); sw = Math.floor(W); sh = Math.max(240, Math.floor(H - ph - 8));
  }
  st.style.width = sw + 'px'; st.style.height = sh + 'px';
  const dpr = Math.min(2, window.devicePixelRatio || 1), cv = $('cv');
  // the island fits the stage (upright phones crop the misty sides a little); the stage may be wider / taller than the island → it stays centred
  isoFit(A.clientWidth, A.clientHeight);
  const s = Math.min(sw / V25.W, sh / (mode === 'land' ? V25.R + V25.BOT + 1.6 : V25.TOP + V25.R + V25.BOT));
  if(VIEW.px !== sw || VIEW.ph !== sh || VIEW.dpr !== dpr || VIEW.base !== s || VIEW.ch !== S.chapter){ VIEW = {s, base: s, baseKey: sw + 'x' + sh, px: sw, ph: sh, dpr, ch: S.chapter}; cv.width = Math.round(sw * dpr); cv.height = Math.round(sh * dpr); BG = null; FDZ.ox = FDZ.oy = 0; FDP.bgKey = ''; }
  fdZoomApply(); if(pickOpen) placeHandOnGlow();
  return true;
}
// 🌊 fd-2b: 7 build buttons (5 plants + 🌊 + 🌉) — sideways phone: a 2-column plant column · otherwise ONE row of smaller buttons
function fdBuildSize(mode){ const bb = $('fd-build'); if(!bb) return; const n = bb.querySelectorAll('.fd-plant').length; mode = mode || fdMode();
  bb.classList.toggle('two', n > 5 && mode === 'land'); if(n <= 5 || mode === 'land'){ bb.style.removeProperty('--skk-bs'); return; }
  const pw = ((bb.parentNode || {}).clientWidth || 360) - 18, sd = bb.querySelector('.fd-seeds'), sw = Math.max(58, sd ? sd.getBoundingClientRect().width + 6 : 58);   // the 🌰 count may grow to 3 digits
  let gap = 7, bs = Math.floor((pw - sw - n * gap) / n); if(bs < 40){ gap = 4; bs = Math.floor((pw - sw - n * gap) / n); }
  bb.style.setProperty('--bgap', gap + 'px'); bb.style.setProperty('--skk-bs', Math.max(36, Math.min(52, bs)) + 'px'); }
function fdPlaceBuild(mode){ const A = $('arena'); let L = $('fd-left'); if(!L){ L = document.createElement('div'); L.id = 'fd-left'; A.insertBefore(L, A.firstChild); }
  const bb = $('fd-build'); if(!bb) return; if(mode === 'land'){ if(bb.parentNode !== L) L.appendChild(bb); } else if(bb.parentNode !== $('panel')) $('panel').insertBefore(bb, $('panel').firstChild); fdBuildSize(mode); }
// 🤏 zoom: VIEW.s = base × z, the island's centre offset (ox, oy) keeps the pinched spot under the fingers
function fdZoomApply(){
  if(VIEW.base == null || VIEW.baseKey !== VIEW.px + 'x' + VIEW.ph){ VIEW.base = VIEW.s; VIEW.baseKey = VIEW.px + 'x' + VIEW.ph; }
  VIEW.s = VIEW.base * FDZ.z; setIso();
  const padY = (VIEW.ph - (V25.TOP + V25.R + V25.BOT) * VIEW.base) / 2; ISO.OY += padY;   // a taller stage: island in the middle · a shorter one (sideways phone): the sky is cut   // a taller stage: the island sits in the middle
  if(FDZ.z <= 1.001){ FDZ.ox = FDZ.oy = 0; }
  const cx0 = ISO.OX, cy0 = ISO.OY + (TD_MID + TD_MID) * ISO.B;   // the farm's screen spot before the offset
  FDZ.ox = Math.max(-cx0 + VIEW.px * 0.12, Math.min(VIEW.px * 0.88 - cx0, FDZ.ox)); FDZ.oy = Math.max(-cy0 + VIEW.ph * 0.12, Math.min(VIEW.ph * 0.88 - cy0, FDZ.oy));
  ISO.OX += FDZ.ox; ISO.OY += FDZ.oy;
}
function fdZoomTo(z, mx, my){   // zoom round the screen point (mx, my)
  z = Math.max(FDZ.min, Math.min(FDZ.max, z)); if(Math.abs(z - FDZ.z) < 0.001) return; const k = z / FDZ.z, OX0 = ISO.OX, OY0 = ISO.OY;
  const OX1 = mx - (mx - OX0) * k, OY1 = my - (my - OY0) * k; FDZ.z = z;
  FDZ.ox = 0; FDZ.oy = 0; fdZoomApply(); FDZ.ox = OX1 - (ISO.OX); FDZ.oy = OY1 - (ISO.OY); fdZoomApply(); FDP.pics.clear(); FDP.bgKey = ''; if(!G.fd) BG = null;
}
function fdPanBy(dx, dy){ if(FDZ.z <= 1.001) return; FDZ.ox += dx; FDZ.oy += dy; fdZoomApply(); FDP.bgKey = ''; if(!G.fd) BG = null; }
function fdPointer(e){
  if(!inPlay() || e.target.id !== 'cv') return; const cv = $('cv'), r = cv.getBoundingClientRect(), P = FDZ.pts;
  if(e.type === 'pointerdown'){ try{ cv.setPointerCapture(e.pointerId); }catch(_){} P.set(e.pointerId, {x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY});
    if(P.size === 2){ const [a, b] = [...P.values()]; FDZ.g = {kind: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2 - r.left, my: (a.y + b.y) / 2 - r.top, k: 1, tx: 0, ty: 0}; }
    else if(P.size === 1) FDZ.g = {kind: 'tap', moved: 0, tx: 0, ty: 0}; return; }
  const q = P.get(e.pointerId); if(!q) return;
  if(e.type === 'pointermove'){ q.x = e.clientX; q.y = e.clientY; const G2 = FDZ.g; if(!G2) return;
    if(G2.kind === 'pinch' && P.size >= 2){ const [a, b] = [...P.values()]; G2.k = Math.max(FDZ.min / FDZ.z, Math.min(FDZ.max / FDZ.z, Math.hypot(a.x - b.x, a.y - b.y) / G2.d0)); const mx = (a.x + b.x) / 2 - r.left, my = (a.y + b.y) / 2 - r.top; G2.tx = mx - G2.mx * G2.k; G2.ty = my - G2.my * G2.k; G2.mx2 = mx; G2.my2 = my;
      cv.style.transform = 'translate(' + G2.tx + 'px,' + G2.ty + 'px) scale(' + G2.k + ')'; return; }
    if(G2.kind === 'tap'){ const dx = q.x - q.x0, dy = q.y - q.y0; if(Math.hypot(dx, dy) > 10 && FDZ.z > 1.001){ G2.kind = 'pan'; } }
    if(G2.kind === 'pan'){ G2.tx = q.x - q.x0; G2.ty = q.y - q.y0; cv.style.transform = 'translate(' + G2.tx + 'px,' + G2.ty + 'px)'; } return; }
  // up / cancel
  P.delete(e.pointerId); const G2 = FDZ.g;
  if(G2 && G2.kind === 'pinch'){ cv.style.transform = ''; const mx0 = G2.mx, my0 = G2.my;   // the first finger up commits the pinch; the other finger does nothing more
      fdZoomTo(FDZ.z * G2.k, mx0, my0); fdPanBy((G2.mx2 != null ? G2.mx2 : mx0) - mx0, (G2.my2 != null ? G2.my2 : my0) - my0); FDZ.g = P.size ? {kind: 'wait'} : null; return; }
  if(G2 && G2.kind === 'pan'){ cv.style.transform = ''; fdPanBy(G2.tx, G2.ty); FDZ.g = null; return; }
  if(G2 && G2.kind === 'tap' && e.type === 'pointerup' && P.size === 0){ FDZ.g = null; if(G.fd) fdTap(e); return; }
  if(P.size === 0) FDZ.g = null;
}
['pointerdown', 'pointermove', 'pointerup', 'pointercancel'].forEach(t => document.addEventListener(t, fdPointer, {passive: true}));
document.addEventListener('pointermove', e => { if(e.pointerType !== 'mouse' || !isFarm() || !inPlay()) return; if(e.target.id !== 'cv'){ FDP.hover = null; return; } const r = $('cv').getBoundingClientRect(), c = fdCellAt(e.clientX - r.left, e.clientY - r.top); FDP.hover = FD.buildable(G, c.i, c.j) ? c : null; }, {passive: true});   // 🖱️ fd-1d
document.addEventListener('wheel', e => { if(!inPlay() || e.target.id !== 'cv') return; e.preventDefault(); const r = $('cv').getBoundingClientRect(); fdZoomTo(FDZ.z * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX - r.left, e.clientY - r.top); }, {passive: false});
function fdZoomButtons(){ let z = $('fd-zoom'); if(!z){ z = document.createElement('div'); z.className = 'fd-zoom'; z.id = 'fd-zoom'; z.innerHTML = '<button type="button" data-z="1" data-sound="tap" aria-label="Zoom in">＋</button><button type="button" data-z="-1" data-sound="tap" aria-label="Zoom out">－</button>'; $('stage').appendChild(z); fdRotButtons(z);
    z.querySelectorAll('button[data-z]').forEach(b => b.onclick = () => { fdZoomTo(FDZ.z * (b.dataset.z === '1' ? 1.3 : 1 / 1.3), VIEW.px / 2, VIEW.ph / 2); }); } z.classList.remove('hidden'); }
// ◀ on a sideways phone: the bar's own folded menu (Gameroom · Levels · Dashboard) instead of leaving at once
document.addEventListener('click', e => { if(!inPlay() || !$('scr-play').classList.contains('tl-land')) return; const b = e.target.closest && e.target.closest('#gbar .gb-back'); if(!b) return;
  e.stopPropagation(); e.preventDefault(); const fm = document.querySelector('#gbar .gb-fmenu'); if(!fm) return; const hd = fm.querySelector('.gb-fhd'), lv = $('hud-level');
  if(hd){ hd.textContent = lv ? (lv.dataset.full || lv.textContent) : ''; hd.style.display = hd.textContent ? '' : 'none'; } fm.classList.toggle('hidden'); }, true);
/* 🔄 fd-1d turning the view — like Aowu's Home Layout (turnPlan): 90° steps, 0.42 s cubic in-out, round the spot in the middle of the screen, Q / E keys,
   remembered per player, a short note after turning. ⟲ 🧭 ⟳ sit on top of ＋ －; 🧭 = back to the book's own view. */
const fdRotKey = () => S.book === 'farmer' ? 'sp_fd_rot:' + (S.player || '') : 'sp_td_rot:' + (S.book || '') + ':' + (S.player || '');   // 🔄 td-turn: per player AND per book (the farm keeps its old key)
function fdRotSaved(){ try{ const v = parseInt(localStorage.getItem(fdRotKey()), 10); return v >= 0 && v < 4 ? v : 0; }catch(e){ return 0; } }
function fdTurn(dir, to){ if(!G || FDR.spin) return false; const farm = isFarm(), k0 = fdK(), k1 = to != null ? to : (((k0 + dir) % 4) + 4) % 4; if(k1 === k0) return false;
  let step = k1 - k0; if(step > 2) step -= 4; if(step < -2) step += 4;   // the short way round (🧭 from 3 → 0 = one step ⟳)
  if(farm){ fdCloseCard(); FDP.pick = null; } const from = FDR.th, toTh = from + step * Math.PI / 2;
  // the spot in the middle of the screen stays put when zoomed in (at zoom 1 the island turns round its own middle)
  const W0 = FDZ.z > 1.001 ? fdWorldAt(VIEW.px / 2, VIEW.ph / 2) : null;
  const L0 = farm ? fdIsl(k0) : b1Isl(k0), L1 = farm ? fdIsl(k1) : b1Isl(k1); if(farm) fdWarm(k1);   // 🔄 td-turn: book 1 = its own turned island layers
  if(!FX){ fdSetRot(toTh); fdTurnEnd(W0); return true; }
  FDR.spin = {from, to: toTh, t0: performance.now(), dur: Iso.TURN_MS, q: 0, L0, L1, W0}; UISound.play('whoosh'); return true; }
function fdSpinStep(now){ const sp = FDR.spin; if(!sp) return; const t = Math.min(1, (now - sp.t0) / sp.dur), e = Iso.turnEase(t);
  sp.q = t; if(t >= 1){ fdSetRot(sp.to); FDR.spin = null; fdTurnEnd(sp.W0, sp); return; }
  fdSetRot(sp.from + (sp.to - sp.from) * e); if(sp.W0) fdKeep(sp.W0); }
function fdKeep(W0){ const px = IX(W0.x, W0.y), py = IY(W0.x, W0.y, 0); FDZ.ox += VIEW.px / 2 - px; FDZ.oy += VIEW.ph / 2 - py; fdZoomApply(); }
function fdTurnEnd(W0, sp){ const k = fdK(); fdSetRot(k * Math.PI / 2); FDR.k = k; if(W0) fdKeep(W0); FDP.bgKey = ''; FDP.pics.clear(); if(!isFarm()) b1TurnEnd(sp);   // 🔄 td-turn
  try{ localStorage.setItem(fdRotKey(), String(k)); }catch(e){}
  fdRotBadge(); banner(k ? '🔄 Map turned — tap 🧭 to turn it back' : '🧭 Back to the book\'s own view'); fdHints(); }
// bake the turned pictures before the spin needs them (the switch half way must not stall a frame)
function fdWarm(k){ if(!fdHasProps()) return; const step = Iso.stepFor(ISO.zi * (VIEW.dpr || 1)), list = [fdHouseIt()].concat(G.gates.map(fdGateIt), (G.rocks || []).map(r => fdItem('rock', 'rock', r.i, r.j, {v: r.v})));
  list.forEach(it => { if(!it) return; try{ const R = fdRotItem(it, {}, k); if(R.it && R.it.pic) R.it.pic.bake(step); }catch(e){} }); }
function fdRotButtons(z){ if(z.querySelector('.fd-rot')) return; const r = document.createElement('div'); r.className = 'fd-rot';
  r.innerHTML = '<button type="button" data-r="-1" data-sound="tap" aria-label="Turn the map left" title="Turn left (Q)">⟲</button><button type="button" data-r="0" data-sound="tap" aria-label="Back to the first view" title="Back to the first view" class="fd-compass"><i>🧭</i></button><button type="button" data-r="1" data-sound="tap" aria-label="Turn the map right" title="Turn right (E)">⟳</button>';
  z.prepend(r); r.querySelectorAll('button').forEach(b => b.onclick = ev => { ev.stopPropagation(); const d = +b.dataset.r; if(d) fdTurn(d); else fdTurn(0, 0); }); fdRotBadge(); }
function fdRotBadge(){ const c = document.querySelector('#fd-zoom .fd-compass'); if(!c) return; const k = FDR.spin ? null : fdK(); c.classList.toggle('on', !!k); const i = c.querySelector('i'); if(i) i.style.transform = 'rotate(' + (-(k || 0) * 90) + 'deg)';
  const f = isFarm(); document.querySelectorAll('#fd-zoom .fd-rot [data-r]').forEach(b => { const d = +b.dataset.r; if(d) b.title = (d < 0 ? 'Turn left (' : 'Turn right (') + (f ? (d < 0 ? 'Q' : 'E') : (d < 0 ? '[' : ']')) + ')'; }); }   // 🔄 td-turn: book 1's keys are [ ]
// which way someone faces in a turned view: by where they moved ON SCREEN
const fdFaceL = (o, x) => Iso.faceTrack(o, x, (o.face || 1) < 0);
(function(){ const st = document.createElement('style'); st.id = 'fd-css-rot'; st.textContent = [
  '.fd-zoom .fd-rot{display:flex;gap:4px;margin-bottom:2px}',
  '.fd-zoom .fd-rot button{font-size:1.25rem;line-height:1}',
  '.fd-zoom .fd-compass i{display:inline-block;font-style:normal;font-size:1rem;transition:transform .42s cubic-bezier(.65,0,.35,1)}',
  '.fd-zoom .fd-compass.on{background:#FFF3C4;border-color:#FFC93C}',
  '.fd-zoom{align-items:flex-end}',
  // a sideways phone: ONE row along the bottom (the cloud band) so the buttons never sit on the island
  '#scr-play.tl-land .fd-zoom{flex-direction:row;align-items:center;bottom:6px} #scr-play.tl-land .fd-zoom .fd-rot{margin:0}'].join('\n'); document.head.appendChild(st); })();
/* 👨‍🌾 FARMER DELUSION — page END */
/* ================= 🔔 GO BUTTONS (fd-1e) — a themed Go! per map (Aowu 2026-11-17 22:03 / 22:15) =================
   The tap plays 5 beats: ready → anticipation (wind-up) → CONTACT (the wave starts HERE, inside the game loop tick) → follow-through → settle.
   🔔 farm ch 1 bell + 🐓 rooster · 🌧️ ch 2 rain roof (drips before rain waves) + 🚧 back gate plank once the new route is open ·
   📯 Dra-Princess herald horn + 🐉 roar · 🐚 / 🏮 for the later books. The timer running out plays the SAME hit (never a silent start).
   Ring round the button = time left in the break. Painters: Test Harness/farmer-draft/gobtn_draft.js (one dark rim, no emoji). */
(function(){
  const RIM = '#2A1C14';
  const G = {};
  function rr(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function ink(g, w){ g.lineWidth = w || 2.2; g.strokeStyle = RIM; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); }
  function swingOf(beat, q, t){   // bell / horn angle (radians) per beat
    if(beat === 'idle') return Math.sin(t * 2.2) * 0.06;
    if(beat === 'anticipation') return -0.55 * Math.sin(q * Math.PI / 2);          // pulled back
    if(beat === 'contact') return 0.42;                                              // struck, held
    if(beat === 'follow') return 0.42 * Math.cos(q * Math.PI * 1.6) * (1 - q);       // overshoot + settle
    return 0;
  }
  /* ---------- 🔔 farm bell on a post + 🐓 rooster ---------- */
  function post(g, rain){
    g.fillStyle = '#8B5A2B'; rr(g, 26, 26, 8, 74, 2); g.fill(); ink(g);            // post
    g.fillStyle = '#A06A35'; rr(g, 26, 24, 54, 8, 3); g.fill(); ink(g);            // beam
    g.fillStyle = '#6E9E4A'; g.beginPath(); g.ellipse(36, 101, 26, 5, 0, 0, 7); g.fill(); ink(g, 1.6);   // grass tuft
    if(rain){   // little tin rain roof over the beam
      g.fillStyle = '#7FA7C9'; g.beginPath(); g.moveTo(16, 24); g.lineTo(52, 8); g.lineTo(88, 24); g.lineTo(84, 28); g.lineTo(52, 14); g.lineTo(20, 28); g.closePath(); g.fill(); ink(g);
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1.2; for(let i = 0; i < 4; i++){ g.beginPath(); g.moveTo(26 + i * 8, 22 - i * 3.4); g.lineTo(28 + i * 8, 25 - i * 3.4); g.stroke(); }
    }
  }
  function bell(g, ang, gold){
    g.save(); g.translate(64, 32); g.rotate(ang);
    g.fillStyle = gold ? '#F2C14E' : '#D9A23A';
    g.beginPath(); g.moveTo(-5, 2); g.quadraticCurveTo(-7, 8, -9, 20); g.quadraticCurveTo(-15, 30, -17, 34); g.lineTo(17, 34); g.quadraticCurveTo(15, 30, 9, 20); g.quadraticCurveTo(7, 8, 5, 2); g.closePath(); g.fill(); ink(g);
    g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.ellipse(-6, 18, 2.4, 8, 0.25, 0, 7); g.fill();
    g.fillStyle = '#7A4E1E'; g.beginPath(); g.arc(0, 36, 3.6, 0, 7); g.fill(); ink(g, 1.6);           // clapper
    g.fillStyle = '#C0392B'; rr(g, -3, -2, 6, 6, 2); g.fill(); ink(g, 1.6);                           // red rope knot
    g.restore();
  }
  function rooster(g, beat, q, t){   // one-piece: body + tail + head; leans back on anticipation, crows on contact
    let lean = 0, open = 0, puff = 1;
    if(beat === 'idle') lean = Math.sin(t * 1.4) * 0.04;
    if(beat === 'anticipation'){ lean = -0.32 * q; puff = 1 + 0.12 * q; }
    if(beat === 'contact'){ lean = 0.22; open = 1; puff = 1.12; }
    if(beat === 'follow'){ lean = 0.22 * (1 - q); open = 1 - q * 0.6; puff = 1.12 - 0.12 * q; }
    g.save(); g.translate(46, 24); g.rotate(lean);
    g.fillStyle = '#2F6E3A'; g.beginPath(); g.moveTo(-6, -6); g.quadraticCurveTo(-20, -24, -12, -30); g.quadraticCurveTo(-8, -18, -2, -12); g.closePath(); g.fill(); ink(g, 1.8);   // tail
    g.fillStyle = '#E8833A'; g.beginPath(); g.ellipse(0, -9, 10 * puff, 8 * puff, 0, 0, 7); g.fill(); ink(g, 1.8);                  // body
    g.fillStyle = '#F6B26B'; g.beginPath(); g.ellipse(-1, -8, 5, 4, 0.3, 0, 7); g.fill();                                           // wing light
    g.fillStyle = '#F4E3C3'; g.beginPath(); g.arc(8, -20, 6, 0, 7); g.fill(); ink(g, 1.8);                                         // head
    g.fillStyle = '#D93A2B'; g.beginPath(); g.moveTo(4, -25); g.quadraticCurveTo(6, -31, 8, -26); g.quadraticCurveTo(10, -32, 12, -25); g.closePath(); g.fill(); ink(g, 1.4);   // comb
    g.fillStyle = '#F2B233'; g.beginPath(); g.moveTo(13, -21 - open * 2); g.lineTo(19 + open * 2, -20); g.lineTo(13, -18 + open * 2); g.closePath(); g.fill(); ink(g, 1.4);   // beak
    g.fillStyle = RIM; g.beginPath(); g.arc(9.5, -21.5, 1.2, 0, 7); g.fill();
    g.restore();
    if(open > 0.3){   // crow lines (no words in the picture)
      g.strokeStyle = 'rgba(42,28,20,' + (0.8 * open) + ')'; g.lineWidth = 1.8;
      for(let i = 0; i < 3; i++){ g.beginPath(); g.arc(66, 2, 6 + i * 5, -0.9, 0.2); g.stroke(); }
    }
  }
  function backGate(g){   // 🚧 the back gate plank leaning on the post (ch 2, after Mr. Umbrella's new route)
    g.save(); g.translate(86, 96); g.rotate(-0.18);
    for(let i = 0; i < 2; i++){ g.fillStyle = '#FFFFFF'; rr(g, -14, -24 + i * 12, 28, 7, 2); g.fill(); ink(g, 1.6);
      g.save(); rr(g, -14, -24 + i * 12, 28, 7, 2); g.clip(); g.fillStyle = '#D93A2B'; for(let s = -14; s < 16; s += 8){ g.beginPath(); g.moveTo(s, -24 + i * 12); g.lineTo(s + 4, -24 + i * 12); g.lineTo(s + 1, -17 + i * 12); g.lineTo(s - 3, -17 + i * 12); g.fill(); } g.restore(); }
    g.fillStyle = '#8B5A2B'; rr(g, -12, -26, 4, 26, 1); g.fill(); ink(g, 1.4); rr(g, 8, -26, 4, 26, 1); g.fill(); ink(g, 1.4);
    g.restore();
  }
  function rings(g, x, y, q, col){   // sound rings at contact / follow
    for(let i = 0; i < 3; i++){ const r = 10 + (q * 30) + i * 9, a = Math.max(0, 0.85 - q - i * 0.18); if(a <= 0) continue;
      g.strokeStyle = col.replace('A', a.toFixed(2)); g.lineWidth = 3 - i * 0.6; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); }
  }
  function drops(g, t){ g.fillStyle = '#5B8DB8'; for(let i = 0; i < 3; i++){ const y = 30 + ((t * 40 + i * 13) % 26); g.beginPath(); g.ellipse(22 + i * 30, y, 1.4, 2.6, 0, 0, 7); g.fill(); } }
  G.bell = function(g, beat, q, t, o){ post(g, false); bell(g, swingOf(beat, q, t)); rooster(g, beat, q, t); if(beat === 'contact' || beat === 'follow') rings(g, 64, 62, beat === 'contact' ? 0 : q, 'rgba(255,214,90,A)'); };
  G.bellRain = function(g, beat, q, t, o){ if(o && o.raining) drops(g, t); post(g, true); bell(g, swingOf(beat, q, t)); rooster(g, beat, q, t); if(o && o.backGate) backGate(g); if(beat === 'contact' || beat === 'follow') rings(g, 64, 62, beat === 'contact' ? 0 : q, 'rgba(255,214,90,A)'); };
  /* ---------- 📯 Dra-Princess: herald horn on a banner pole + 🐉 dragon roar ---------- */
  G.horn = function(g, beat, q, t){
    // banner pole
    g.fillStyle = '#7A5A3A'; rr(g, 84, 22, 6, 80, 2); g.fill(); ink(g);
    const wave = Math.sin(t * 3) * 3;
    g.fillStyle = '#8E44AD'; g.beginPath(); g.moveTo(90, 24); g.quadraticCurveTo(104, 28 + wave, 112, 26); g.lineTo(106, 38); g.lineTo(112, 50); g.quadraticCurveTo(102, 48 - wave, 90, 50); g.closePath(); g.fill(); ink(g);
    g.fillStyle = '#F2C14E'; g.beginPath(); g.arc(100, 37, 4, 0, 7); g.fill();          // crown dot
    // 🐉 dragon head + neck (one piece), inhales on anticipation, ROARS on contact
    let inh = 0, open = 0.15;
    if(beat === 'anticipation'){ inh = q; open = 0.05; }
    if(beat === 'contact'){ inh = -0.3; open = 1; }
    if(beat === 'follow'){ inh = -0.3 * (1 - q); open = 1 - q * 0.7; }
    if(beat === 'idle') inh = Math.sin(t * 1.6) * 0.15;
    g.save(); g.translate(28, 92); g.rotate(-0.15 - inh * 0.25);
    g.fillStyle = '#4CAF6E';
    g.beginPath(); g.moveTo(-10, 8); g.quadraticCurveTo(-14, -30, 4, -44 - inh * 4); g.lineTo(22, -46 - inh * 4);
    g.lineTo(36, -40 - open * 6); g.lineTo(26, -34); g.lineTo(36, -26 + open * 8); g.lineTo(18, -26); g.quadraticCurveTo(6, -14, 10, 8); g.closePath(); g.fill(); ink(g);
    g.fillStyle = '#9BE3A9'; g.beginPath(); g.ellipse(-2, -12, 5 + inh * 2, 14, 0.1, 0, 7); g.fill();     // belly puffs
    g.fillStyle = '#F2C14E'; g.beginPath(); g.moveTo(6, -46); g.lineTo(2, -56); g.lineTo(12, -48); g.closePath(); g.fill(); ink(g, 1.5);   // horn
    g.fillStyle = RIM; g.beginPath(); g.arc(16, -40, 1.6, 0, 7); g.fill();
    if(open > 0.5){ g.fillStyle = 'rgba(255,140,60,' + (open * 0.8) + ')'; g.beginPath(); g.moveTo(34, -32); g.lineTo(52, -42); g.lineTo(50, -24); g.closePath(); g.fill(); }
    g.restore();
    // 📯 herald horn (princess's), lifted on anticipation, TOOT on contact
    const lift = beat === 'anticipation' ? q : (beat === 'contact' ? 1 : beat === 'follow' ? 1 - q * 0.5 : 0);
    g.save(); g.translate(62, 64 - lift * 8); g.rotate(-0.35 - lift * 0.25 + (beat === 'idle' ? Math.sin(t * 2) * 0.04 : 0));
    g.fillStyle = '#F2C14E'; g.beginPath(); g.moveTo(-22, -2); g.lineTo(6, -3); g.quadraticCurveTo(16, -12, 22, -14); g.lineTo(22, 14); g.quadraticCurveTo(16, 12, 6, 3); g.lineTo(-22, 2); g.closePath(); g.fill(); ink(g);
    g.fillStyle = '#C0392B'; g.beginPath(); g.moveTo(-8, 3); g.lineTo(2, 3); g.lineTo(0, 16); g.lineTo(-4, 12); g.lineTo(-8, 16); g.closePath(); g.fill(); ink(g, 1.5);   // pennant
    g.restore();
    if(beat === 'contact' || beat === 'follow') rings(g, 90, 46, beat === 'contact' ? 0 : q, 'rgba(255,214,90,A)');
  };
  /* ---------- later books (placeholders for the theme table) ---------- */
  G.conch = function(g, beat, q, t){ g.save(); g.translate(60, 60); g.rotate(swingOf(beat, q, t) * 0.5);
    g.fillStyle = '#F7B7A3'; g.beginPath(); g.moveTo(-28, 10); g.quadraticCurveTo(-10, -30, 26, -16); g.quadraticCurveTo(30, 0, 20, 14); g.quadraticCurveTo(0, 22, -28, 10); g.closePath(); g.fill(); ink(g);
    g.strokeStyle = '#D9826B'; g.lineWidth = 2; for(let i = 0; i < 3; i++){ g.beginPath(); g.arc(8, -2, 6 + i * 6, 2.4, 4.6); g.stroke(); } g.restore();
    if(beat === 'contact' || beat === 'follow') rings(g, 30, 64, beat === 'contact' ? 0 : q, 'rgba(120,220,255,A)'); };
  G.lantern = function(g, beat, q, t){ g.save(); g.translate(60, 26); g.rotate(swingOf(beat, q, t) * 0.6);
    g.strokeStyle = RIM; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -10); g.lineTo(0, 6); g.stroke();
    g.fillStyle = '#E2453A'; g.beginPath(); g.ellipse(0, 30, 22, 26, 0, 0, 7); g.fill(); ink(g);
    g.fillStyle = '#F2C14E'; rr(g, -12, 2, 24, 6, 2); g.fill(); ink(g, 1.5); rr(g, -12, 52, 24, 6, 2); g.fill(); ink(g, 1.5);
    const glow = beat === 'contact' ? 1 : beat === 'follow' ? 1 - q : 0.25; g.fillStyle = 'rgba(255,230,140,' + glow * 0.8 + ')'; g.beginPath(); g.ellipse(0, 30, 10, 16, 0, 0, 7); g.fill(); g.restore(); };
  /* ---------- the button face: medallion + countdown ring + label ---------- */
  const SKIN = {bell: {a: '#7CC25A', b: '#3E8E3A', ring: '#FFD23F'}, bellRain: {a: '#8DB8D8', b: '#4F7FA8', ring: '#FFD23F'},
    horn: {a: '#B07CD8', b: '#6B3FA0', ring: '#FFD23F'}, conch: {a: '#5FC8D8', b: '#257E96', ring: '#FFE7A0'}, lantern: {a: '#E2604F', b: '#8E2A22', ring: '#FFD23F'}};
  G.face = function(g, theme, beat, q, t, o){
    o = o || {}; const S = SKIN[theme];
    const press = beat === 'anticipation' ? 1 - 0.06 * q : beat === 'contact' ? 1.08 : beat === 'follow' ? 1.08 - 0.08 * q : 1 + Math.sin(t * 3.4) * 0.02;
    g.save(); g.translate(60, 60); g.scale(press, press); g.translate(-60, -60);
    const gr = g.createRadialGradient(52, 44, 6, 60, 60, 58); gr.addColorStop(0, S.a); gr.addColorStop(1, S.b);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.arc(60, 64, 56, 0, 7); g.fill();
    g.fillStyle = gr; g.beginPath(); g.arc(60, 60, 56, 0, 7); g.fill(); ink(g, 3);
    if(o.left != null && o.of){ g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 6; g.beginPath(); g.arc(60, 60, 51, 0, 7); g.stroke();
      g.strokeStyle = S.ring; g.lineWidth = 6; g.beginPath(); g.arc(60, 60, 51, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (o.left / o.of)); g.stroke(); }
    g.save(); g.beginPath(); g.arc(60, 60, 48, 0, 7); g.clip(); const farm = theme === 'bell' || theme === 'bellRain'; if(farm){ g.translate(12, 22); g.scale(0.78, 0.78); } else { g.translate(8, 2); g.scale(0.88, 0.88); }
    G[theme](g, beat, q, t, o); g.restore();
    g.restore();
  };
  G.BEATS = [{k: 'ready', ms: 60, ease: 'sineInOut'}, {k: 'anticipation', ms: 180, ease: 'cubicOut'}, {k: 'contact', ms: 90, ease: 'quartOut', contact: true, stop: 60},
    {k: 'follow', ms: 240, ease: 'backOut'}, {k: 'settle', ms: 140, ease: 'sineInOut'}];
  (typeof window !== 'undefined' ? window : globalThis).GOB = G;
})();
const GO_LEAD = 0.24, GO_TOTAL = 0.71;   // ready 60 + anticipation 180 ms → contact; + contact 90 + follow 240 + settle 140
const GOX = {run: null, raf: 0, size: 0, n: 0, log: []};
window.GO_LOG = GOX.log;
function goEl(){ return $('go-btn'); }
function goTheme(){ if(G && G.fd) return G.C && G.C.n >= 2 ? 'bellRain' : 'bell'; return ({draprincess: 'horn', coral: 'conch', market: 'lantern'})[S.book] || 'horn'; }
function goLimit(){ if(!G) return 0; const bl = G.goHold != null ? G.goHold : G.breakLen;
  return G.fd ? (bl > 0 ? bl + (G.freeMoveT > 0 ? 10 : 0) : 0) : (bl != null ? bl : 2.6); }
function goOpts(){ const o = {}; if(G && G.fd && G.C){ o.raining = !!(G.C.rain && G.C.rain.includes(G.wave + 1)); o.backGate = !!(G.C.newGate && G.routeDone); }
  const lim = goLimit(); if(lim > 0 && G && G.state === 'break' && !GOX.run){ o.of = lim; o.left = Math.max(0, lim - G.wt); } return o; }
function goLabel(){ const b = goEl(); if(!b || !G) return; const lim = goLimit(), left = lim > 0 && G.state === 'break' && !GOX.run ? Math.max(0, Math.ceil(lim - G.wt)) : 0,
  t = left ? '▶ Go! · ' + left : '▶ Go!', lb = b.querySelector('.gob-lb'); if(lb && lb.textContent !== t) lb.textContent = t; }
function goShow(){ const b = goEl(); if(!b) return; if(GOX.run && (GOX.run.g !== G || GOX.run.fired)) GOX.run = null;   // a new break: an old hit's follow-through never hides the new button
  b.dataset.theme = goTheme(); b.classList.remove('hidden', 'gob-hit'); GOX.size = 0; goLabel(); goPlace(); if(!GOX.raf) GOX.raf = requestAnimationFrame(goFrame); }
// 👣 on the farm the steps line sits bottom-left: lift the button above it when they would touch (phones held upright, tablets)
function goPlace(){ const b = goEl(), st = $('stage'), sp = $('fd-steps'); if(!b || !st) return; const was = b.style.bottom; b.style.bottom = '';
  if(G && G.fd && sp && !sp.classList.contains('hidden') && getComputedStyle(sp).display !== 'none'){ const r = b.getBoundingClientRect(), q = sp.getBoundingClientRect(), R = st.getBoundingClientRect();
    if(q.width && r.left < q.right + 4 && r.right > q.left - 4 && r.bottom > q.top - 4) b.style.bottom = Math.round(R.bottom - q.top + 4) + 'px'; }
  if(b.style.bottom !== was) GOX.size = 0; }
function goHide(){ const b = goEl(); if(!b) return; if(GOX.run && !GOX.run.done){ GOX.run.hideAfter = true; return; } b.classList.add('hidden'); b.classList.remove('gob-hit'); }
function goStop(){ GOX.run = null; const b = goEl(); if(b){ b.classList.add('hidden'); b.classList.remove('gob-hit'); } if(GOX.raf){ cancelAnimationFrame(GOX.raf); GOX.raf = 0; } }
// called by the game loops BEFORE they step: CONTACT starts the wave in the same tick; the break timer starts the hit 0.24 s early
function goAuto(){ if(!G) return; const r = GOX.run;
  if(r){ if(r.due && !r.fired && !G.paused) goContact(); return; }
  if(G.state !== 'break' || G.paused) return; const b = goEl(); if(!b || b.classList.contains('hidden')) return;
  const lim = goLimit(); if(lim > 0 && G.wt + GO_LEAD * (G.speed || 1) >= lim) goHit(true); }
function goNow(){ if(G && G.state === 'break') goHit(false); }
function goHit(auto){
  if(!G || G.state !== 'break' || GOX.run) return;
  const g = G; if(g.goHold == null){ g.goHold = g.breakLen; g.breakLen = 1e9; }   // the hit owns the start: the engine's own timer waits for CONTACT
  GOX.n++; GOX.run = {g, t: 0, last: performance.now(), auto: !!auto, due: false, fired: false, done: false, crow: GOX.n % 3};
  GOX.log.push({k: 'tap', auto: !!auto, at: performance.now(), wave: g.wave, theme: goTheme()}); goSound('wind');
  if(!window.FX){ GOX.run.due = true; goContact(); return; }   // tests with FX 0: at once
  if(!GOX.raf) GOX.raf = requestAnimationFrame(goFrame);
}
function goContact(){ const r = GOX.run; if(!r || r.fired) return; r.fired = true; const g = r.g;
  if(g.goHold != null){ g.breakLen = g.goHold; g.goHold = null; }
  if(g !== G || g.state !== 'break'){ goEnd(); return; }
  (g.fd ? FD : TD).startWave(g);
  GOX.log.push({k: 'contact', at: performance.now(), beatT: r.t, wave: g.wave, state: g.state, theme: goTheme(), crow: r.crow});
  goSound('hit'); const b = goEl(); if(b) b.classList.add('gob-hit'); if(HAND === b) hideHand();
  if(!window.FX) goEnd();
}
function goEnd(){ const r = GOX.run; if(r) r.done = true; GOX.run = null; const b = goEl(); if(!b) return; b.classList.remove('gob-hit');
  if(!G || G.state !== 'break' || (r && r.hideAfter)) b.classList.add('hidden'); else goLabel(); }
// beat at time t (s) → [painter beat, q]
function goBeat(r){ if(!r) return ['idle', 0]; let t = r.t; if(!r.fired) t = Math.min(t, GO_LEAD + 0.03);
  if(t < 0.06) return ['idle', 0]; if(t < GO_LEAD) return ['anticipation', (t - 0.06) / 0.18];
  if(t < GO_LEAD + 0.09 || !r.fired) return ['contact', 0]; if(t < GO_LEAD + 0.33) return ['follow', (t - GO_LEAD - 0.09) / 0.24]; return ['follow', 1]; }
function goFrame(now){
  GOX.raf = 0; const b = goEl(); if(!b) return; const r = GOX.run;
  if(r){ const dt = Math.min(0.1, Math.max(0, (now - r.last) / 1000)); r.last = now; if(!(G && G.paused) || r.fired) r.t += dt;   // ⏸ holds the wind-up, never the follow-through
    if(!r.fired && r.t >= GO_LEAD) r.due = true;
    if(r.fired && r.t >= GO_TOTAL) goEnd(); }
  if(b.classList.contains('hidden') && !GOX.run) return;   // hidden → stop drawing
  goPaint(now / 1000); if(!GOX.run){ goLabel(); if((GOX.f = (GOX.f || 0) + 1) % 15 === 0) goPlace(); }
  GOX.raf = requestAnimationFrame(goFrame);
}
function goPaint(t){
  const b = goEl(), c = b && b.querySelector('canvas'); if(!c || typeof GOB === 'undefined') return;
  const px = Math.round(c.getBoundingClientRect().width) || 0; if(!px) return; const d = Math.min(3, window.devicePixelRatio || 1), W = Math.round(px * d);
  if(c.width !== W){ c.width = c.height = W; }
  const g = c.getContext('2d'), bt = goBeat(GOX.run), o = goOpts(); if(GOX.run) o.crow = GOX.run.crow;
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, W); g.setTransform(W / 128, 0, 0, W / 128, 4 * W / 128, 4 * W / 128);
  try{ GOB.face(g, b.dataset.theme || goTheme(), bt[0], Math.max(0, Math.min(1, bt[1])), t, o); }catch(e){}
}
// 🔊 shared tone maker only (UISound) — 🔇 silences it like every other sound
function goSound(k){ const U = window.UISound; if(!U || !U.isOn || !U.isOn()) return; const th = goTheme();
  try{
    if(k === 'wind'){ U.noise(0.18, {gain: 0.1, from: 300, to: 1400}); return; }
    if(th === 'bell' || th === 'bellRain'){ U.note('E6', 1.4, {instrument: 'bell', gain: 0.32}); U.note('B5', 1.1, {instrument: 'bell', gain: 0.18, delay: 0.02});
      const v = GOX.run ? GOX.run.crow : 0, f = [520, 600, 460][v];   // 🐓 3 different crows
      U.tone(f, 0.12, {type: 'sawtooth', gain: 0.06, slide: f * 1.5, delay: 0.14}); U.tone(f * 1.5, [0.38, 0.3, 0.5][v], {type: 'sawtooth', gain: 0.05, slide: f * [1.1, 1.3, 0.9][v], delay: 0.26}); }
    else if(th === 'horn'){ U.note('G4', 0.42, {instrument: 'flute', gain: 0.3}); U.note('D5', 0.5, {instrument: 'flute', gain: 0.24, delay: 0.18});
      U.noise(0.7, {gain: 0.24, from: 900, to: 120, delay: 0.1}); U.tone(110, 0.6, {type: 'sawtooth', gain: 0.07, slide: 70, delay: 0.1}); }
    else if(th === 'conch') U.tone(196, 0.8, {type: 'triangle', gain: 0.2, slide: 220});
    else U.note('C5', 1, {instrument: 'bell', gain: 0.3});
  }catch(e){}
}
/* 🔔 GO BUTTONS END */
/* ================= BOOT ================= */
function boot(){
  UI.loading('tdstories');
  google.script.run.withSuccessHandler(d => {
      UI.loaded();
      S.players = d.players || []; S.progress = d.progress || {}; S.progressFarmer = d.progressFarmer || {}; S.settings = d.settings || {}; S.avatars = d.avatars || {};
      UISound.applySettings(S.settings);
      const lockOn = !(S.settings.ScreenTimeLockEnabled === 'FALSE' || S.settings.ScreenTimeLockEnabled === false);
      lockHandle = UI.screenTimeLock({sessionStart: SESSION_START, durationMin: DURATION_MIN, enabled: lockOn, homeUrl: WEBAPP_URL + '?page=home', onLock: pauseGame});
      flushPending();
      if(CURRENT_PLAYER && S.players.some(p => p.Name === CURRENT_PLAYER)) choosePlayer(CURRENT_PLAYER); else { renderPlayers(); showScreen('player'); }
    }).withFailureHandler(() => { UI.loaded(); UI.toast('Could not load players — check the connection', 'err'); renderPlayers(); showScreen('player'); })
    .getLevelGameData('td-draprincess', CURRENT_PLAYER);
}
boot();   // 📏 s-td: window.TD = TD now comes with TDBook_dragon
