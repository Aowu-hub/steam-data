
/* 📚 Books — the shelf list for the 🎴 Gameroom strip + the 📚 Books Corner (BooksCorner.html, lazy).
   Who can read a book: a Storytime book opens for the WHOLE family once anyone finishes that chapter in 🧳 Avateer
   (server: Settings BooksOpen = family list, written by bookOpen(id)) — or a grown-up's ⚙️ switch opens every book
   for reading time (Settings BooksAll). ✨ new = an open book this player has not opened yet (Settings BooksSeen_<Name>).
     Books.state(d)          ← the getGameroomData answer (d.books, or d.settings for an old cached answer)
     Books.strip(el)         paints the 🎴 Gameroom strip (mini shelf · ✨ N new · Open ▶)
     Books.open()            loads BooksCorner (+ a 📚 loader) and opens it
     Books.LIST · SHELVES · byId(id) · isOpen(id) · newIds() · lang() / setLang('en'|'th') */
(function(){
  if(window.Books) return;
  const SHELVES = [
    {id: 'story', icon: '📖', en: 'Storytime', th: 'นิทาน'},
    {id: 'island', icon: '📗', en: 'Island Stories', th: 'เรื่องเล่าบนเกาะ'},
    {id: 'comics', icon: '💥', en: 'Comics', th: 'การ์ตูน'},
    {id: 'science', icon: '🔬', en: 'Science & Field', th: 'วิทย์และการสำรวจ'},
    {id: 'art', icon: '🎨', en: 'Art Books', th: 'สมุดภาพศิลปะ'},
    {id: 'game', icon: '🎮', en: 'Game Tales', th: 'เรื่องจากเกม'}];
  // ready = the book's Book_<id> part file exists (gr-15a: none yet — Aowu 13:3x: the pages are redrawn with the game's kits first, gr-15b)
  // ready = the book's part file exists · soon = a dashed 🔜 spine (paint = pictures being painted · comics / art = that chat makes it · next = a later 🎴 round)
  const LIST = [
    {id: 'st1', shelf: 'story', ch: 1, isle: '🐘', isleEn: 'Island 1 · Elephant Jungle', isleTh: 'เกาะที่ 1', en: 'The Sleeping Temples', th: 'วัดหลับใหล', sEn: 'Temples', sTh: 'วัดหลับใหล', c1: '#2E9E6A', c2: '#FFC845', soon: 'paint'},
    {id: 'st2', shelf: 'story', ch: 2, isle: '🌸', isleEn: 'Island 2 · Cherry Mountain', isleTh: 'เกาะที่ 2', en: 'The Sleeping Drum', th: 'กลองหลับใหล', sEn: 'Drum', sTh: 'กลอง', c1: '#D6538E', c2: '#FFD1E3', soon: 'paint'},
    {id: 'st3', shelf: 'story', ch: 3, isle: '🏜️', isleEn: 'Island 3 · Pyramid Sands', isleTh: 'เกาะที่ 3 · ทะเลทรายพีระมิด', en: 'The Silent Dunes', th: 'เนินทรายเงียบเสียง', sEn: 'Dunes', sTh: 'เนินทราย', c1: '#C9772F', c2: '#FFE1A6', soon: 'paint'},
    {id: 'st4', shelf: 'story', ch: 4, isle: '❄️', isleEn: 'Island 4 · Aurora North', isleTh: 'เกาะที่ 4 · แดนแสงเหนือ', en: 'The Wall Nobody Paid For', th: 'กำแพงที่ไม่มีใครตอบแทน', sEn: 'The Wall', sTh: 'กำแพง', c1: '#3B6FD0', c2: '#9EE6E0', soon: 'paint'},
    {id: 'st5', shelf: 'story', ch: 5, isle: '🌋', isleEn: 'Island 5 · Lava Isles', isleTh: 'เกาะที่ 5 · หมู่เกาะลาวา', en: 'The Mountain’s Lullaby', th: 'เพลงกล่อมของภูเขา', sEn: 'Lullaby', sTh: 'เพลงกล่อม', c1: '#B8322A', c2: '#FF9A3C', soon: 'paint'},
    {id: 'st6', shelf: 'story', ch: 6, isle: '🪸', isleEn: 'Island 6 · Coral Coast', isleTh: 'เกาะที่ 6 · ชายฝั่งปะการัง', en: 'When the Tide Forgot', th: 'เมื่อน้ำลืมขึ้นลง', sEn: 'Tide', sTh: 'น้ำขึ้นลง', c1: '#0E8F82', c2: '#7FD3F7', soon: 'paint'},
    {id: 'is1', shelf: 'island', isle: '🔨', en: 'The Smith’s Song', th: 'The Smith’s Song', sEn: 'Smith', sTh: 'ช่างตีเหล็ก', c1: '#7A4A2A', c2: '#FFB45E', soon: 'next'},
    {id: 'cx1', shelf: 'comics', isle: '💥', en: 'Avateer Comics', th: 'การ์ตูน Avateer', sEn: 'Comics', sTh: 'การ์ตูน', c1: '#E5484D', c2: '#FFD23F', soon: 'comics'},
    {id: 'sc1', shelf: 'science', isle: '🔬', en: 'STEAM Cards', th: 'การ์ดสตีม', sEn: 'STEAM', sTh: 'สตีม', c1: '#3D7DD8', c2: '#B8E3FF', soon: 'next'},
    {id: 'ar1', shelf: 'art', isle: '🎨', en: 'Art Books', th: 'สมุดภาพศิลปะ', sEn: 'Art', sTh: 'ศิลปะ', c1: '#8E5BD8', c2: '#FFD1F0', soon: 'art'},
    {id: 'gt1', shelf: 'game', isle: '🐉', en: 'Dra-Princess Diary', th: 'บันทึกเจ้าหญิงมังกร', sEn: 'Diary', sTh: 'บันทึก', c1: '#6A35C7', c2: '#FF7EB6', game: 'tdstories', gameEn: 'opens in 🏰 TD-Stories', gameTh: 'เปิดในเกม 🏰 TD-Stories'},
    {id: 'gt2', shelf: 'game', isle: '🎮', en: 'More game tales', th: 'เรื่องจากเกมอีก', sEn: 'More', sTh: 'อีก', c1: '#5B4B8A', c2: '#C9B8FF', soon: 'next'}];
  const byId = id => LIST.find(b => b.id === id) || null;
  let S = {open: [], all: false, seen: [], lang: ''};
  const LS = () => 'sp_books_lang:' + (window.CURRENT_PLAYER || (typeof CURRENT_PLAYER !== 'undefined' ? CURRENT_PLAYER : '') || '-');
  function parse(v, d){ try{ const x = JSON.parse(v); return x == null ? d : x; }catch(e){ return d; } }
  function state(d){
    if(!d) return S;
    const b = d.books, st = d.settings || {}, me = typeof CURRENT_PLAYER !== 'undefined' ? CURRENT_PLAYER : '';
    if(b) S = {open: Array.isArray(b.open) ? b.open : [], all: !!b.all, seen: Array.isArray(b.seen) ? b.seen : [], lang: b.lang || S.lang || ''};
    else S = {open: parse(st.BooksOpen, []), all: st.BooksAll === true || String(st.BooksAll).toUpperCase() === 'TRUE', seen: parse(st['BooksSeen_' + me], []), lang: st['BooksLang_' + me] || S.lang || ''};
    return S;
  }
  // 🙈 the corner shows in the Gameroom only once a book is ready (Aowu 2026-11-28: never an empty shelf) — ?books=1 = device preview
  const live = () => LIST.some(b => b.ready) || /[?&]books=1/.test(location.search || '');
  const isOpen = id => { const b = byId(id); return !!(b && b.ready && (S.all || S.open.indexOf(id) >= 0)); };
  const newIds = () => LIST.filter(b => isOpen(b.id) && S.seen.indexOf(b.id) < 0).map(b => b.id);
  function lang(){ let l = ''; try{ l = localStorage.getItem(LS()) || ''; }catch(e){} return l === 'th' || l === 'en' ? l : (S.lang === 'th' ? 'th' : 'en'); }
  function setLang(l){ l = l === 'th' ? 'th' : 'en'; S.lang = l; try{ localStorage.setItem(LS(), l); }catch(e){}
    try{ const me = typeof CURRENT_PLAYER !== 'undefined' ? CURRENT_PLAYER : ''; if(me && window.google && google.script) google.script.run.withFailureHandler(() => {}).setBookLang(me, l); }catch(e){} return l; }
  function seen(id){ if(S.seen.indexOf(id) >= 0) return; S.seen = S.seen.concat([id]);
    try{ const me = typeof CURRENT_PLAYER !== 'undefined' ? CURRENT_PLAYER : ''; if(me && window.google && google.script) google.script.run.withFailureHandler(() => {}).markBooksSeen(me, [id]); }catch(e){}
    const el = document.getElementById('books-strip'); if(el) strip(el); }
  // 🎴 the Gameroom strip: a mini shelf (open spines in their island colour, locked grey + 🔒, 🔜 dashed) · ✨ N new · Open ▶
  function strip(el){
    if(!el) return; el.classList.toggle('hidden', !live()); if(!live()) return;
    const L = lang(), n = newIds().length;
    const spines = LIST.filter(b => b.shelf === 'story').map(b => { const open = isOpen(b.id), cls = open ? (newIds().indexOf(b.id) >= 0 ? 'o nw' : 'o') : (b.ready ? 'l' : 's');
      return '<i class="' + cls + '" style="--c1:' + b.c1 + ';--c2:' + b.c2 + '" title="' + (L === 'th' ? b.th : b.en).replace(/"/g, '') + '"></i>'; }).join('');
    const mini = el.querySelector('.bk-mini'), pill = el.querySelector('.bk-new');
    if(mini) mini.innerHTML = spines + '<b class="bk-lean" aria-hidden="true"></b>';
    if(pill){ pill.textContent = '✨ ' + n + (L === 'th' ? ' เล่มใหม่' : ' new'); pill.classList.toggle('hidden', !n); }
    const t = el.querySelector('.bk-t b'), s = el.querySelector('.bk-t small');
    if(t) t.textContent = L === 'th' ? '📚 มุมหนังสือ' : '📚 Books Corner';
    if(s) s.textContent = L === 'th' ? 'นิทานไว้อ่านด้วยกัน' : 'Stories to read together';
    el.classList.toggle('has-new', !!n);
  }
  function open(at){
    if(!live()) return;
    try{ UI.loading('books', lang() === 'th' ? 'กำลังเปิดมุมหนังสือ' : 'Opening the Books Corner'); }catch(e){}
    GameParts.need('BooksCorner', ok => {
      try{ UI.loaded(); }catch(e){}
      if(!ok || !window.BooksCorner){ try{ UISound.play('error'); UI.toast('📚 The Books Corner did not load — check the internet, then tap Open ▶ again', 'err'); }catch(e){} return; }
      BooksCorner.open(at);
    });
  }
  window.Books = {SHELVES, LIST, byId, state, live, isOpen, newIds, lang, setLang, seen, strip, open, get S(){ return S; }, version: 'gr-15a'};
  try{ if(window.UI && UI.KINDS){ if(!UI.KINDS.books) UI.KINDS.books = ['📚', 'Opening the Books Corner', 'bob']; if(!UI.KINDS.book) UI.KINDS.book = ['📖', 'Opening the book', 'turn']; } }catch(e){}   // 📚 gr-15a: loaders (UiKit is the ✨ lane's — move these there when it has a minute, 📨)
})();
