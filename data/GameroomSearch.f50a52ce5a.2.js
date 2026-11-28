
// ENGINE START — 🔍 gr-16 matcher (no DOM)
var GSearch = (function(){
  'use strict';
  // Hidden also-known-as words per GameID: {en: [...], th: [...]}. Real product names (Wordle, Battleship …) are fine HERE as search words, never as display names.
  var AKA = {
    'color-match': {en: ['colour', 'color', 'colours', 'colors', 'shapes', 'match colours'], th: ['สี', 'จับคู่สี', 'รูปทรง']},
    'count-match': {en: ['count', 'counting', 'numbers', 'fruit', 'how many', '123'], th: ['นับเลข', 'นับผลไม้', 'ตัวเลข']},
    'code-robot': {en: ['coding', 'code', 'arrows', 'robot', 'program', 'directions'], th: ['เขียนโค้ด', 'หุ่นยนต์', 'ลูกศร']},
    'trash-pointer': {en: ['recycle', 'recycling', 'rubbish', 'garbage', 'trash', 'sort the trash', 'environment', 'bin'], th: ['แยกขยะ', 'ขยะ', 'รีไซเคิล', 'สิ่งแวดล้อม']},
    'stacking-sim': {en: ['stack', 'stacking', 'boxes', 'tower', 'balance', 'jenga', 'physics'], th: ['ซ้อนกล่อง', 'กล่อง', 'ตึก', 'สมดุล']},
    'tdstories': {en: ['tower defense', 'tower defence', 'td', 'towers', 'dragon', 'princess', 'castle', 'farmer', 'story book', 'defend'], th: ['หอคอย', 'ป้องกันปราสาท', 'มังกร', 'เจ้าหญิง', 'ชาวนา', 'นิทาน']},
    'artifactory': {en: ['maker', 'make', 'craft', 'lathe', 'trophy', 'cups', 'design', 'build', 'forge', 'engineering'], th: ['ประดิษฐ์', 'สร้าง', 'ถ้วยรางวัล', 'ออกแบบ', 'งานช่าง']},
    'georead': {en: ['reading', 'read', 'phonics', 'abc', 'letters', 'alphabet', 'spelling', 'sounds', 'english'], th: ['อ่าน', 'โฟนิกส์', 'ตัวอักษร', 'สะกดคำ', 'ภาษาอังกฤษ']},
    'geoscout': {en: ['math', 'maths', 'numbers', 'number blocks', 'numberblocks', 'counting', 'adding', 'plus', 'minus', 'times', 'shapes'], th: ['คณิตศาสตร์', 'ตัวเลข', 'บวก', 'ลบ', 'คูณ', 'หาร', 'นับเลข']},
    'wisdeck': {en: ['cards', 'card game', 'quiz', 'trivia', 'flags', 'countries', 'world', 'history', 'animals', 'space', 'facts'], th: ['การ์ด', 'ตอบคำถาม', 'ธงชาติ', 'ประเทศ', 'ประวัติศาสตร์', 'สัตว์', 'อวกาศ', 'ความรู้']},
    'eyes-brain': {en: ['memory', 'remember numbers', 'number memory', 'brain', 'focus', 'recall'], th: ['ความจำ', 'จำตัวเลข', 'สมอง']},
    'polyplot': {en: ['dots and boxes', 'dots', 'lines', 'boxes', 'shapes', 'polygons', 'hexagon', 'geometry', 'pen and paper'], th: ['จุด', 'เส้น', 'ต่อจุด', 'รูปหลายเหลี่ยม', 'เรขาคณิต']},
    'maze': {en: ['maze', 'labyrinth', 'find the way', 'path', 'explore'], th: ['เขาวงกต', 'หาทางออก']},
    'robot-adventure': {en: ['coding', 'code', 'program', 'robot', 'blocks', 'scratch', 'logic'], th: ['เขียนโค้ด', 'หุ่นยนต์', 'โปรแกรม']},
    'checkers': {en: ['draughts', 'checkers', 'board game', 'jump'], th: ['หมากฮอส', 'เกมกระดาน']},
    'chess': {en: ['chess', 'king', 'queen', 'knight', 'checkmate', 'board game'], th: ['หมากรุก', 'เกมกระดาน']},
    'pinball': {en: ['pinball', 'flipper', 'ball', 'arcade'], th: ['พินบอล', 'ลูกบอล']},
    'hopper': {en: ['crossy road', 'frogger', 'hop', 'jump', 'road', 'cross the road', 'river'], th: ['กระโดด', 'ข้ามถนน']},
    'turbo': {en: ['racing', 'race', 'car', 'cars', 'driving', 'kart', 'drift'], th: ['แข่งรถ', 'รถ', 'ขับรถ']},
    'memory': {en: ['memory', 'pairs', 'matching', 'flip cards', 'concentration', 'match'], th: ['จับคู่', 'เกมความจำ', 'เปิดไพ่']},
    'math-quest': {en: ['math', 'maths', 'sums', 'plus', 'minus', 'times tables', 'multiply', 'divide', 'add', 'subtract'], th: ['คณิตศาสตร์', 'บวก', 'ลบ', 'คูณ', 'หาร', 'สูตรคูณ']},
    'double-up': {en: ['2048', 'slide', 'merge', 'tiles', 'numbers', 'doubles'], th: ['ตัวเลข', 'เลื่อน']},
    'block-drop': {en: ['tetris', 'blocks', 'falling blocks', 'rows', 'puzzle'], th: ['ตัวต่อ', 'บล็อก', 'เตตริส']},
    'pop-blocks': {en: ['collapse', 'pop', 'blocks', 'same colour', 'bubble'], th: ['ป๊อป', 'บล็อก']},
    'number-grid': {en: ['sudoku', 'grid', 'pictures', 'logic'], th: ['ซูโดกุ', 'ตาราง']},
    'number-board': {en: ['math crossword', 'number crossword', 'equations', 'sums', 'scrabble numbers'], th: ['ครอสเวิร์ดตัวเลข', 'สมการ', 'คณิต']},
    'word-board': {en: ['crossword', 'scrabble', 'word board', 'spelling', 'words', 'letters', 'word game'], th: ['ครอสเวิร์ด', 'ต่อคำ', 'สะกดคำ', 'คำศัพท์']},
    'sweet-swap': {en: ['match 3', 'match three', 'candy crush', 'candy', 'sweets', 'swap'], th: ['จับคู่สาม', 'ลูกอม', 'ขนม']},
    'beat-corner': {en: ['music', 'rhythm', 'beats', 'songs', 'drums', 'piano', 'dance', 'guitar hero'], th: ['ดนตรี', 'จังหวะ', 'เพลง', 'กลอง', 'เปียโน']},
    'pyraspike': {en: ['volleyball', 'volley', 'spike', 'beach', 'ball', 'net', 'team sport'], th: ['วอลเลย์บอล', 'ลูกบอล']},
    'pokadif': {en: ['spot the difference', 'find the difference', 'detective', 'observe', 'odd one out', 'hidden'], th: ['จับผิดภาพ', 'หาความต่าง', 'นักสืบ']},
    'sciencetory': {en: ['science', 'lab', 'experiment', 'test', 'chemistry', 'physics', 'materials'], th: ['วิทยาศาสตร์', 'ห้องแล็บ', 'ทดลอง', 'เคมี', 'ฟิสิกส์']},
    'sla-brall': {en: ['tennis', 'table tennis', 'ping pong', 'badminton', 'pickleball', 'squash', 'air hockey', 'racket', 'ball'], th: ['เทนนิส', 'ปิงปอง', 'แบดมินตัน', 'ฮอกกี้']},
    'blasoff': {en: ['soccer', 'football', 'futsal', 'goal', 'kick', 'ball', 'team sport'], th: ['ฟุตบอล', 'ฟุตซอล', 'ยิงประตู']},
    'pose-party': {en: ['dance', 'poses', 'camera', 'move', 'exercise', 'yoga', 'body', 'just dance'], th: ['ท่าโพส', 'เต้น', 'ออกกำลังกาย', 'โยคะ', 'กล้อง']},
    'brawl-buddies': {en: ['fighting', 'fight', 'battle', 'boxing', 'wrestling', 'smash', 'beat em up'], th: ['ต่อสู้', 'ชกมวย', 'มวยปล้ำ']},
    'alignext': {en: ['connect 4', 'connect four', 'four in a row', 'tic tac toe', 'noughts and crosses', 'xo', 'gomoku', 'five in a row'], th: ['เอ็กซ์โอ', 'โอเอ็กซ์', 'เรียงสี่', 'หมากห้า']},
    'snakeast': {en: ['snake', 'slither', 'snake io', 'apple', 'worm', 'paper io'], th: ['งู']},
    'soul-bopper': {en: ['bomberman', 'bombs', 'bomb', 'maze', 'boom', 'explode'], th: ['ระเบิด']},
    'workshop': {en: ['furniture', 'design', 'build', 'room', 'bed', 'chair', 'lamp', 'decorate', 'craft'], th: ['เฟอร์นิเจอร์', 'ออกแบบ', 'ห้อง', 'ตกแต่ง']},
    'avatarealm': {en: ['town', 'kingdom', 'army', 'strategy', 'castle', 'build', 'clash of clans', 'war', 'rts'], th: ['เมือง', 'อาณาจักร', 'กองทัพ', 'วางแผน', 'สงคราม']},
    'avateer': {en: ['adventure', 'rpg', 'story', 'islands', 'elephant', 'pudding', 'explore', 'quest', 'pet'], th: ['ผจญภัย', 'เกาะ', 'ช้าง', 'พุดดิ้ง', 'เรื่องราว', 'สัตว์เลี้ยง']},
    // 🆕 the 6 new games (🆕 Game Plan chat lists, new-games-6-plan §5b) — used once their cards land in the Gameroom
    'gopalm': {en: ['go', 'weiqi', 'baduk', 'igo', '圍棋', '围棋', 'stones', 'black white', 'board game', 'strategy', 'magic'], th: ['โกะ', 'หมากล้อม', 'เกมกระดาน']},
    'imaword': {en: ['4 pics 1 word', 'picture word', 'rebus', 'compound word', 'emoji word', 'guess the word', 'spelling'], th: ['ทายคำ', 'ภาพปริศนา']},
    'crackaword': {en: ['wordle', 'guess the word', '5 letters', 'word code', 'safe', 'letters', 'spelling'], th: ['ทายคำ', 'เดาคำ']},
    'closecret': {en: ['contexto', 'hot cold', 'warmer colder', 'meaning', 'secret word', 'guess the word'], th: ['คำลับ', 'ทายคำ']},
    'spellspin': {en: ['wordscapes', 'crossword', 'letter wheel', 'swipe words', 'anagram', 'spelling'], th: ['ครอสเวิร์ด', 'สะกดคำ']},
    'paintpult': {en: ['battleship', 'sea battle', 'catapult', 'paintball', 'island', 'hide and seek', 'board game'], th: ['เรือรบ', 'ยิงเรือ', 'เกมกระดาน']}
  };
  // Thai words for the 🗂️ kinds (Gameroom TYPE_INFO keys)
  var KIND_TH = {math: ['คณิตศาสตร์', 'คณิต'], numbers: ['ตัวเลข'], counting: ['นับเลข', 'นับ'], words: ['คำศัพท์', 'คำ'], reading: ['อ่าน'], colours: ['สี'], sorting: ['จัดกลุ่ม', 'แยก'],
    logic: ['ตรรกะ'], strategy: ['วางแผน'], puzzle: ['ปริศนา'], coding: ['เขียนโค้ด'], reflex: ['ความไว', 'ไว'], sport: ['กีฬา'], move: ['ขยับร่างกาย', 'ออกกำลังกาย'],
    memory: ['ความจำ'], music: ['ดนตรี'], science: ['วิทยาศาสตร์'], story: ['เรื่องราว', 'ผจญภัย']};
  var KIND_EN = {colours: ['colors', 'color', 'colour'], reflex: ['reflex', 'fast', 'action'], puzzle: ['puzzles'], story: ['adventure', 'stories'], sport: ['sports'], math: ['maths']};
  // field weights · loose = typos + inside-the-word matches allowed (strict fields: whole word or start of a word only)
  var FIELDS = {name: {w: 100, loose: true}, aka: {w: 85, loose: true}, kind: {w: 60, loose: true}, mode: {w: 55, loose: false}, tag: {w: 45, loose: false}, desc: {w: 30, loose: false}};
  var MIN = 20;
  var THAI = /[฀-๿]/;
  function norm(s){
    s = String(s == null ? '' : s);
    try{ s = s.normalize('NFKD').replace(/[̀-ͯ]/g, ''); }catch(e){}
    return s.toLowerCase().replace(/&/g, ' and ').replace(/['’`]/g, '').replace(/[^\p{L}\p{N}฀-๿一-鿿]+/gu, ' ').replace(/\s+/g, ' ').trim();
  }
  function compact(s){ return s.replace(/ /g, ''); }
  // Damerau–Levenshtein (adjacent swaps count 1), stops early past max
  function dist(a, b, max){
    if(Math.abs(a.length - b.length) > max) return max + 1;
    var p2 = [], p = [], c, i, j;
    for(j = 0; j <= b.length; j++) p[j] = j;
    for(i = 1; i <= a.length; i++){
      c = [i]; var low = i;
      for(j = 1; j <= b.length; j++){
        var v = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if(i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, p2[j - 2] + 1);
        c[j] = v; if(v < low) low = v;
      }
      if(low > max) return max + 1;
      p2 = p; p = c;
    }
    return p[b.length];
  }
  // how well one query piece (already normed) fits one term (already normed): 0 … 1
  function fit(q, t, loose){
    var qc = compact(q), tc = compact(t);
    if(!qc || !tc) return 0;
    if(qc === tc) return 1;
    var thai = THAI.test(qc);
    if(tc.indexOf(qc) === 0 && (loose || qc.length >= 2)) return 0.92;
    var words = t.split(' '), k;
    for(k = 0; k < words.length; k++){ if(words[k] === qc) return 0.95; }
    for(k = 0; k < words.length; k++){ if(words[k].indexOf(qc) === 0 && (loose ? qc.length >= 1 : qc.length >= 3)) return 0.85; }
    if(thai && qc.length >= 2 && tc.indexOf(qc) >= 0) return loose ? 0.8 : 0.7;
    if(!loose) return 0;
    if(qc.length >= 3 && tc.indexOf(qc) >= 0) return 0.6;
    if(qc.length >= 5 && !thai){   // short words (ball · card · math) never typo-match (ball ≠ fall, card ≠ cars, math ≠ match)
      var max = qc.length >= 8 ? 2 : 1;
      if(dist(qc, tc, max) <= max) return 0.7;
      if(tc.length > qc.length && dist(qc, tc.slice(0, qc.length), max) <= max) return 0.62;
      for(k = 0; k < words.length; k++){
        var w = words[k]; if(w.length < 3) continue;
        if(dist(qc, w, max) <= max) return 0.65;
        if(w.length > qc.length && dist(qc, w.slice(0, qc.length), max) <= max) return 0.6;
      }
    }
    return 0;
  }
  // one game's search words, normed: doc({id, names, aka, kinds, modes, tags, desc}) — the page fills names / kinds / modes / tags / desc
  function doc(o){
    var a = AKA[o.id] || {};
    var f = function(list){ var out = []; (list || []).forEach(function(x){ var n = norm(x); if(n && out.indexOf(n) < 0) out.push(n); }); return out; };
    var kinds = [];
    (o.kinds || []).forEach(function(k){ kinds.push(k); (KIND_TH[k] || []).forEach(function(x){ kinds.push(x); }); (KIND_EN[k] || []).forEach(function(x){ kinds.push(x); }); });
    return {id: o.id, name: f(o.names), aka: f((a.en || []).concat(a.th || []).concat(o.aka || [])), kind: f(kinds.concat(o.kindWords || [])), mode: f(o.modes), tag: f(o.tags), desc: f([].concat(o.desc || []))};
  }
  function best(d, q){
    var top = 0, why = '';
    for(var key in FIELDS){
      var F = FIELDS[key], list = d[key] || [];
      for(var i = 0; i < list.length; i++){
        var s = fit(q, list[i], F.loose) * F.w;
        if(s > top){ top = s; why = key; }
      }
    }
    return {s: top, why: why};
  }
  // score of one doc for a query (0 = no match): whole query (spaces ignored) vs every word must fit somewhere
  function score(d, query){
    var q = norm(query); if(!q) return {s: 0, why: ''};
    var whole = best(d, q), words = q.split(' ');
    if(words.length < 2) return whole;
    var sum = 0, why = '';
    for(var i = 0; i < words.length; i++){ var b = best(d, words[i]); if(!b.s){ sum = 0; break; } sum += b.s; if(!why) why = b.why; }
    var each = sum ? sum / words.length * 0.95 : 0;
    return each > whole.s ? {s: each, why: why} : whole;
  }
  // [{id, s, why}] best first (ties keep the docs' order)
  function find(docs, query){
    var out = [];
    docs.forEach(function(d, i){ var r = score(d, query); if(r.s >= MIN) out.push({id: d.id, s: Math.round(r.s * 10) / 10, why: r.why, i: i}); });
    out.sort(function(a, b){ return (b.s - a.s) || (a.i - b.i); });
    return out;
  }
  return {AKA: AKA, KIND_TH: KIND_TH, FIELDS: FIELDS, MIN: MIN, norm: norm, compact: compact, dist: dist, fit: fit, doc: doc, score: score, find: find, version: 'gr-16'};
})();
// ENGINE END
// 🔍 bar: GSearch.bar(host, {onChange(q)}) → {input, value(), clear(silent), count(n)}
(function(){
  if(typeof window === 'undefined') return;
  window.GSearch = GSearch;
  GSearch.bar = function(host, opt){
    opt = opt || {};
    host.innerHTML = '<div class="gs-bar" role="search"><span class="gs-ic" aria-hidden="true">🔍</span>'
      + '<input type="search" id="gs-in" placeholder="Find a game… · ค้นหาเกม" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" aria-label="Find a game by any word">'
      + '<span class="gs-n" hidden></span><button type="button" class="gs-x" aria-label="Clear the search" title="Clear" data-sound="pop" hidden>✕</button></div>';
    var input = host.querySelector('input'), x = host.querySelector('.gs-x'), n = host.querySelector('.gs-n'), timer = 0, last = '';
    function fire(){ clearTimeout(timer); var v = input.value; x.hidden = !v; if(v.trim() === last) return; last = v.trim(); if(opt.onChange) opt.onChange(last); }
    input.addEventListener('input', function(){ x.hidden = !input.value; clearTimeout(timer); timer = setTimeout(fire, 140); });
    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){ e.preventDefault(); fire(); input.blur(); }
      else if(e.key === 'Escape'){ e.preventDefault(); api.clear(); }
    });
    x.addEventListener('click', function(){ api.clear(); try{ input.focus({preventScroll: true}); }catch(e){} });
    var api = {
      input: input,
      value: function(){ return last; },
      clear: function(silent){ clearTimeout(timer); input.value = ''; x.hidden = true; n.hidden = true; if(!last) return; last = ''; if(!silent && opt.onChange) opt.onChange(''); },
      count: function(k){ if(k == null || !last){ n.hidden = true; return; } n.hidden = false; n.textContent = k + (k === 1 ? ' game' : ' games'); }
    };
    return api;
  };
  // nothing found → the wish card (💬 Tell us opens Feedback as a 🎮 New game wish with the word typed in)
  GSearch.noneHtml = function(q){
    return '<div class="gs-none"><span class="big">🔍</span><div>No game like “' + UI.esc(q) + '” yet</div><div class="gs-th">ยังไม่มีเกมแบบนี้</div>'
      + '<button type="button" class="sp-btn sp-primary gs-tell" data-sound="pop">💬 Tell us you want it</button></div>';
  };
  GSearch.wish = function(q){
    if(!window.UI || !UI.feedback) return;
    UI.feedback({kind: 'wish'});
    var ta = document.querySelector('.ui-fb textarea');
    if(ta && !ta.value) ta.value = 'I searched the Gameroom for "' + q + '" — please make a game like that!';
  };
})();
