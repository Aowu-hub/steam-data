
/* ⚽ BlasOffFrame (bo-cover, ⚽ BlasOff chat 2026-11-21) — the 🧱 Game Baseline frame for BlasOff, kept OUT of BlasOff.html (414 KB, near the size wall — 📏 born split).
   Built from Test Harness/blasoff-build/frame.js + frame.css by build.py (edit those, never this file). BlasOff.html writes include('BlasOffFrame') after its main script.
   Reads the main script's globals (S · SET · G · $ · GAME_ID · LOOKS · the build*() helpers) and wraps a few of its functions; it adds no game rules.
     🎬 cover: GF.cover + Cover_blasoff art + BlasLogo (logoSrc) + 👥 lineup (1–2 on this device) + 🏆 champions + 📖 how to play
     🧾 ONE setup page in #scr-menu: ① mode ② pitch ③ level (a tap picks) ④ who plays ⑤ options → sticky ▶ Start that names the pick
     🏁 BoFrame.result(R) ← finishMatch / finishDrill: the shared GF.result card (cup / tale code still rewrites its .res-btns row)
   window.BoFrame = {openCover, fillSetup, pickLevel, result, cover(), version} · tests: Test Harness/bocover.js */
(function(){
  'use strict';
  if(typeof GAME_ID === 'undefined' || GAME_ID !== 'blasoff' || !window.GF) return;
  const BO_VERSION = '3.0';
  // 🏷️ the game's own code logo on the cover (BlasLogo, bo-6) until the 🏷️ logo chat moves it into GameLogos — GameFrame logoSrc (b3w5)
  const BLAS_LOGO_SRC = {has: () => typeof BlasLogo !== 'undefined', box: (id, kind) => kind === 'main' ? BlasLogo.BOX.main.slice() : null,
    pic: (id, kind, look, w) => { const d = Math.min(2, window.devicePixelRatio || 1), [bw, bh] = BlasLogo.BOX.main, c = document.createElement('canvas'); c.width = Math.round(w * d); c.height = Math.round(w * d * bh / bw);
      BlasLogo.draw(c.getContext('2d'), 'main', c.width / 2, c.height / 2 + c.width * (w < 260 ? 0.025 : 0.04), c.width, look || 'classic', w); return c; }};
  const HELP = () => [...document.querySelectorAll('#scr-menu details.rules li')].map(li => li.textContent.trim());

  // 🧾 build the ONE setup page once: move the old "Get ready" boxes into the start page, each under its numbered heading
  const menu = $('scr-menu'), sec = (k, n, icon, text) => { const s = document.createElement('div'); s.className = 'bo-sec'; s.dataset.k = k; s.innerHTML = '<div class="bo-h" data-n="' + n + '">' + icon + ' ' + text + '</div><div class="setup"></div>'; return s; };
  const boxOf = id => { const el = $(id); return el ? el.closest('.box') : null; };
  ['who-box', 'look-list', 'ball-list'].forEach(id => { const b = id === 'who-box' ? $(id) : boxOf(id), h = b && b.querySelector('h3'); if(h) h.classList.add('bo-dup'); });   // the section heading says it already
  $('lvl-head').dataset.n = '3';
  const s1 = sec('mode', 1, '🎮', 'Pick a mode'), s2 = sec('pitch', 2, '🏟️', 'Pick a pitch'), s4 = sec('who', 4, '👥', 'Who plays?'), s5 = sec('opts', 5, '⚙️', 'Options');
  const modeList = $('mode-list'); modeList.before(s1); s1.appendChild(modeList); const sub = document.createElement('div'); sub.className = 'bo-sub'; sub.id = 'bo-sub'; s1.appendChild(sub);
  s1.querySelector('.setup').remove(); const drill = $('drill-box'); s1.appendChild(drill); drill.style.marginTop = '10px';
  const lookBox = boxOf('look-list'); { const ps = document.createElement('div'); ps.className = 'chips'; ps.id = 'psize-row'; ps.style.marginBottom = '8px'; lookBox.prepend(ps); }
  s2.querySelector('.setup').appendChild(lookBox); $('lvl-head').before(s2);
  const lvls = $('level-list'); lvls.after(s4); s4.querySelector('.setup').append(boxOf('who-row'), $('form-box')); s4.after(s5);
  s5.querySelector('.setup').appendChild(boxOf('ball-list'));
  const go = document.createElement('div'); go.className = 'bo-gobar'; go.appendChild($('go-btn')); s5.after(go);
  $('scr-setup').querySelector('.title').classList.add('hidden');

  // 🧭 the old "setup" screen is the start page now; the setup's ◀ goes back to the 🎬 cover
  const show0 = window.showScreen; let cur = '', filling = false;
  window.showScreen = function(name){ if(name === 'setup') name = 'menu'; if(filling) return;
    if(name !== 'menu' && name !== 'player' && BoCover) BoCover.hide();
    const y = window.scrollY, same = name === cur; cur = name; show0(name); if(same) window.scrollTo(0, y); };
  NAV_INNER.menu = ['◀ BlasOff', () => openCover()];

  // 🎚️ a level tap PICKS (green ring ✓) — it no longer jumps to another screen
  const rl0 = window.renderLevels;
  window.renderLevels = function(){ rl0();
    if(!canPlay(SET.level)) SET.level = Math.max(0, [0, 1, 2, 3, 4, 5].filter(canPlay).pop() || 0);
    $('level-list').querySelectorAll('.lvl').forEach(b => { const i = +b.dataset.lv, old = b.onclick; b.onclick = e => { if(b.classList.contains('locked')) return old(e); pickLevel(i); }; });
    markPicks(); fillSetup(); };
  function pickLevel(i){ SET.level = i; savePrefs(); fillSetup(); markPicks(); const h = s4.classList.contains('bo-off') ? s5 : s4; if(h && h.scrollIntoView) h.scrollIntoView({behavior: 'smooth', block: 'start'}); }
  function markPicks(){ $('level-list').querySelectorAll('.lvl').forEach(b => { const on = +b.dataset.lv === SET.level; b.classList.toggle('sel', on); if(GF.pick) GF.pick(b, on); }); }

  // the page below follows the mode + level (the old openSetup fills the boxes; it no longer opens a screen)
  const os0 = window.openSetup;
  function fillSetup(){ if(filling || !S.player) return; filling = true;
    try { const y = window.scrollY; os0(SET.level); window.scrollTo(0, y); } finally { filling = false; }
    const KD = SET.kind || 'match';
    s4.classList.toggle('bo-off', KD === 'skills' || CUP_KINDS.includes(KD) || KD === 'tale');
    s2.classList.toggle('bo-off', KD === 'tale');
    sub.textContent = KD === 'tale' ? '📜 6 chapters from the 🦖 jungle to the ☁️ cloud stadium — pick a level, then open the story.' : $('setup-sub').textContent;
    try { document.documentElement.style.setProperty('--bo-pagebg', getComputedStyle(document.body).backgroundColor); } catch(e){}
    goLabel(); }
  window.openSetup = function(lvl){ if(lvl != null) SET.level = lvl; fillSetup(); markPicks(); if(BoCover) BoCover.hide(); showScreen('menu'); };
  function goLabel(){ const b = $('go-btn'), KD = SET.kind || 'match', L = LEVEL_UI[SET.level], lv = L.emoji + ' ' + BO.LEVELS[SET.level].name;
    if(KD === 'tale'){ b.textContent = '📜 Open the story · ' + lv; b.onclick = () => showTale(); return; }
    if(CUP_KINDS.includes(KD)) { if(!/Continue/.test(b.textContent)) b.textContent = b.textContent + ' · ' + lv; return; }
    const what = KD === 'skills' ? BO.DRILLS[SET.drill].name : KD === 'shootout' || KD === 'battle' ? '' : (KD === 'party' ? '🎉 ' : '') + SZ_NAME[SET.size];
    b.textContent = b.textContent.replace(/ ·.*$/, '') + (what ? ' · ' + what : '') + ' · ' + lv; }
  const mm0 = window.markModes; window.markModes = function(){ mm0(); $('lvl-head').textContent = '🎚️ ' + $('lvl-head').textContent; };

  // 🔘 24g: the pitch cards + challenges wear the ONE picked look
  const pickOn = sel => document.querySelectorAll(sel).forEach(b => GF.pick && GF.pick(b, b.classList.contains('on')));
  const ml0 = window.markLooks; window.markLooks = function(){ const r = ml0.apply(this, arguments); pickOn('#look-list > .look'); return r; };
  const bd0 = window.buildDrills; window.buildDrills = function(){ const r = bd0.apply(this, arguments); pickOn('#drill-list > .drill'); return r; };

  // 🏁 the shared result card: finishMatch / finishDrill hand over what happened (R), the card is GameFrame's (🎚️ Levels · 🔄 Again · extras · Next ▶)
  function subLine(){ if(!G) return ''; const K = G.kind || 'match', m = MODES.find(x => x.k === K), what = K === 'match' ? 'Soccer ' + SZ_NAME[G.size] : m ? m.name + (K === 'party' ? ' · ' + SZ_NAME[G.size] : '') : '';
    return [what, LEVEL_UI[G.level].emoji + ' ' + BO.LEVELS[G.level].name, LOOKS[G.theme] ? LOOKS[G.theme].name : ''].filter(Boolean).join(' · '); }
  function result(R){
    if(window.UI && UI.callout) UI.callout.setup(null);
    const card = GF.result({wrap: $('result'), card: $('result-card'), game: GAME_ID, me: S.player, win: R.win, icon: R.icon, title: R.title, sub: R.sub || subLine(), stars: R.stars, score: R.score, best: R.best,
      stats: R.stats, rewards: R.tip ? [{icon: '💡', text: R.tip}] : null, save: R.save || null, buddy: S.player && S.player !== 'Guest' ? {name: S.player, av: myAvatar(S.player)} : null, comic: true, confetti: false,
      levels: () => backToMenu(), again: () => startMatch(), extra: R.extra, next: R.next || null});
    const bk = G && BADGE_OF[G.kind === 'match' ? SZ_ID[G.size] : G.kind], h = bk ? logoImg(bk, 46, 'bo-rbadge', '') : '';   // the mode badge in the card's corner (bo-6)
    if(h) card.el.insertAdjacentHTML('afterbegin', h);
    return card; }

  // 🎬 the cover: who's here (you + 1 more on this device) + 🏆 champions + 📖 how to play; ▶ Play opens the setup page
  let BoCover = null;
  function openCover(){
    if(!window.GF){ showScreen('menu'); return; }
    if(BoCover && BoCover.who !== S.player){ BoCover.destroy(); BoCover = null; }
    if(!BoCover){ BoCover = GF.cover(document.body, {game: GAME_ID, title: 'BlasOff', icon: '⚽', version: BO_VERSION, me: S.player, players: S.players, avatarOf: myAvatar, seats: {min: 1, max: 2},
        acts: ['beat.kick', 'beat.cheer'], backTo: WEBAPP_URL + '?page=gameroom' + sessionQuery(), backKind: 'rooms', logoSrc: BLAS_LOGO_SRC, logo: {kind: 'main', look: SET.theme || 'classic', glow: false}, help: HELP(), own: (window.UI && UI.door && UI.door.now()) ? C => UI.door.open(C) : null,   /* 📡 lk-8f: the own-devices room lives on the cover (BlasOff_link, through the od-1 door) */
        onPlay: line => { BoCover.hide(); lineup(line); renderMenu(); fillSetup(); showScreen('menu'); window.scrollTo(0, 0); if(window.boPrefetch) boPrefetch(); }});   /* 📏 s-bo: ▶ Play (a tap) fetches the play part early */ BoCover.who = S.player; }
    BoCover.show();
  }
  window.openCover = openCover;
  // 👥 the cover's lineup FEEDS the setup's "Who plays?" (never a second picker): 2 people = 👥 against each other (or 🤝 the same team if picked before)
  function lineup(line){ const names = (line || []).map(x => x.name).filter(Boolean);
    if(names.length < 2){ if(SET.who !== 'robot') SET.who = 'robot'; }
    else { if(SET.who !== 'coop') SET.who = 'duo'; SET[SET.who === 'duo' ? 'opp' : 'mate'] = names[1]; }
    savePrefs(); }
  // the first open: the page is filled under the cover, then the cover shows (a ✨ ?mode= link skips the cover)
  const cp0 = window.choosePlayer;
  window.choosePlayer = function(name){ const r = cp0.apply(this, arguments); fillSetup(); markPicks(); if(!(typeof MODE_LINK !== 'undefined' && MODE_LINK)) openCover(); return r; };
  window.BoFrame = {openCover, fillSetup, pickLevel, result, cover: () => BoCover, version: BO_VERSION};
})();
