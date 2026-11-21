
window.Events = (function(){
// 📅 EVENT DAYS START (🧱 b5a — built from Test Harness/events/days.js by build_events.py into Events.gs + EventKit.html; edit THERE, never here)
// ONE calendar for the whole app (plan "Events — full plan.md" §3–§4): 🎉 special days + 🔤 STEAM weeks. Pure JS — runs on the server (V8),
// in the browser and in node tests. Dates are local calendar days; a caller passes a Date (server: script time zone, tests: a fixed date).
var EVENT_TABLES = {   // lunar / moon days, checked against 2+ outside calendars (b5a, 2026-11-21)
  lunarny: {2026: '02-17', 2027: '02-06', 2028: '01-26', 2029: '02-13', 2030: '02-03', 2031: '01-23', 2032: '02-11', 2033: '01-31', 2034: '02-19', 2035: '02-08'},
  dragonboat: {2026: '06-19', 2027: '06-09', 2028: '05-28', 2029: '06-16', 2030: '06-05', 2031: '06-24', 2032: '06-12', 2033: '06-01', 2034: '06-20', 2035: '06-10'},
  midautumn: {2026: '09-25', 2027: '09-15', 2028: '10-03', 2029: '09-22', 2030: '09-12', 2031: '10-01', 2032: '09-19', 2033: '09-08', 2034: '09-27', 2035: '09-16'},
  loykrathong: {2025: '11-05', 2026: '11-24', 2027: '11-13', 2028: '11-01', 2029: '11-20', 2030: '11-09', 2031: '10-30', 2032: '11-17', 2033: '11-06', 2034: '11-25', 2035: '11-15'}
};
// rule: md (fixed 'MM-DD', + 'to' for a range) · nth (n-th weekday of a month) · table (EVENT_TABLES, ± 'span' days)
// art = which Welcome Show sky / front layer dresses the day (null = the scene of the day) · flag = th | tw | steam | '' · goal = the day goal
var EVENT_DAYS = [
  {id: 'newyear', icon: '🎆', md: '12-31', to: '01-01', art: 'newyear', flag: '', en: 'Happy New Year! 🎆', th: 'สวัสดีปีใหม่! 🎆',
    feel: ['A fresh start: pick ONE thing you want to get better at this year — tiny steps count.', 'เริ่มต้นใหม่: เลือกหนึ่งอย่างที่อยากเก่งขึ้นปีนี้ ก้าวเล็ก ๆ ก็นับนะ'],
    fact: 'Thailand counts down at midnight with fireworks over the Chao Phraya river.'},
  {id: 'childrenth', icon: '🧒', nth: {month: 1, dow: 6, n: 2}, art: null, flag: 'th', en: 'Happy Children\'s Day! 🧒', th: 'สุขสันต์วันเด็ก! 🧒',
    feel: ['You matter! What is one thing you are proud of today?', 'หนูสำคัญนะ! วันนี้ภูมิใจเรื่องอะไรบ้าง?'],
    fact: 'Thailand\'s Children\'s Day is the second Saturday of January.'},
  {id: 'lunarny', icon: '🧧', table: 'lunarny', span: 1, art: 'newyear', flag: 'tw', en: 'Happy Lunar New Year! 🧧', th: 'สุขสันต์วันตรุษจีน! 🧧', zh: '新年快樂！🧧',
    feel: ['Say sorry for one thing that went wrong, then start fresh — a hug is lucky too.', 'ขอโทษเรื่องที่พลาดไป แล้วเริ่มต้นใหม่ — กอดกันก็โชคดีนะ'],
    fact: 'Red envelopes (hongbao) carry wishes for a happy, healthy year.'},
  {id: 'piday', small: true, icon: '🥧', md: '03-14', art: null, flag: 'steam', en: 'Happy Pi Day! 🥧', th: 'สุขสันต์วันพาย! 🥧',
    feel: ['Stuck on a hard sum? Take a big breath, then try a new way.', 'เจอโจทย์ยาก? หายใจลึก ๆ แล้วลองวิธีใหม่'],
    fact: 'π ≈ 3.14 — every circle\'s way round is a bit more than 3 times its width.'},
  {id: 'childrentw', icon: '🧒', md: '04-04', art: null, flag: 'tw', en: 'Happy Children\'s Day! 🧒', th: 'สุขสันต์วันเด็กไต้หวัน! 🧒', zh: '兒童節快樂！🧒',
    feel: ['Tell someone what made you smile today.', 'เล่าให้ใครสักคนฟังว่าวันนี้อะไรทำให้ยิ้ม'],
    fact: 'Taiwan celebrates Children\'s Day on 4 April.'},
  {id: 'songkran', icon: '💦', md: '04-13', to: '04-15', art: 'songkran', flag: 'th', en: 'Happy Songkran! 💦', th: 'สุขสันต์วันสงกรานต์! 💦',
    feel: ['Pour water gently on an elder\'s hands and say thank you.', 'รดน้ำดำหัวผู้ใหญ่ แล้วบอกขอบคุณนะ'],
    fact: 'Songkran is the Thai New Year — water washes the old year away.'},
  {id: 'earthday', small: true, icon: '🌍', md: '04-22', art: null, flag: 'steam', en: 'Happy Earth Day! 🌍', th: 'สุขสันต์วันคุ้มครองโลก! 🌍',
    feel: ['Worried about the planet? That feeling is OK — one kind act helps.', 'กังวลเรื่องโลกก็ไม่เป็นไรนะ — ทำดีหนึ่งอย่างก็ช่วยได้'],
    fact: 'Trees breathe in the air we breathe out.'},
  {id: 'dragonboat', icon: '🐉', table: 'dragonboat', span: 0, art: null, flag: 'tw', en: 'Happy Dragon Boat Festival! 🐉', th: 'สุขสันต์เทศกาลไหว้บ๊ะจ่าง! 🐉', zh: '端午節快樂！🐉',
    feel: ['A boat goes fast when everyone paddles together — help a teammate today.', 'เรือแล่นเร็วเมื่อทุกคนพายพร้อมกัน — วันนี้ช่วยเพื่อนสักคนนะ'],
    fact: 'Families eat zongzi — sticky rice wrapped in leaves.'},
  {id: 'moonday', small: true, icon: '🌙', md: '07-20', art: null, flag: 'steam', en: 'Happy Moon Day! 🌙', th: 'สุขสันต์วันมนุษย์เหยียบดวงจันทร์! 🌙',
    feel: ['Big dreams can feel scary — brave means trying anyway.', 'ความฝันใหญ่ ๆ อาจน่ากลัว — กล้าหาญคือการลองทำต่อไป'],
    fact: 'People first walked on the Moon on 20 July 1969.'},
  {id: 'mothersth', icon: '💙', md: '08-12', art: null, flag: 'th', en: 'Happy Mother\'s Day! 💙', th: 'สุขสันต์วันแม่! 💙',
    feel: ['Give mum a hug and tell her one thing you love about her.', 'กอดแม่ แล้วบอกแม่ว่ารักอะไรในตัวแม่'],
    fact: 'Thai Mother\'s Day flowers are white jasmine.'},
  {id: 'midautumn', icon: '🥮', table: 'midautumn', span: 0, art: 'loykrathong', flag: 'tw', en: 'Happy Mid-Autumn Festival! 🥮', th: 'สุขสันต์เทศกาลไหว้พระจันทร์! 🥮', zh: '中秋節快樂！🥮',
    feel: ['Missing someone far away? Look at the moon — they can see it too.', 'คิดถึงใครที่อยู่ไกล? มองพระจันทร์สิ — เขาก็เห็นดวงเดียวกัน'],
    fact: 'Mooncakes are round like the full moon — round means together.'},
  {id: 'spaceweek', small: true, icon: '🚀', md: '10-04', to: '10-10', art: null, flag: 'steam', en: 'Happy World Space Week! 🚀', th: 'สัปดาห์อวกาศโลก! 🚀',
    feel: ['Curious about the stars? Asking questions is how every scientist starts.', 'สงสัยเรื่องดวงดาว? นักวิทยาศาสตร์ทุกคนเริ่มจากการตั้งคำถาม'],
    fact: 'The first satellite, Sputnik, went up on 4 October 1957.'},
  {id: 'halloween', icon: '🎃', md: '10-31', art: 'halloween', flag: '', en: 'Happy Halloween! 🎃', th: 'สุขสันต์วันฮาโลวีน! 🎃',
    feel: ['Feeling a bit scared is OK — be brave together and hold a hand.', 'กลัวนิดหน่อยก็ไม่เป็นไร — จับมือกันแล้วกล้าไปด้วยกัน'],
    fact: 'The first jack-o\'-lanterns were carved from turnips.'},
  {id: 'scienceday', small: true, icon: '🔬', md: '11-10', art: null, flag: 'steam', en: 'Happy World Science Day! 🔬', th: 'สุขสันต์วันวิทยาศาสตร์โลก! 🔬',
    feel: ['A mistake is an experiment — what did you find out?', 'ทำพลาดก็คือการทดลอง — ได้เรียนรู้อะไรบ้าง?'],
    fact: 'Scientists test an idea many times before they trust it.'},
  {id: 'loykrathong', icon: '🪷', table: 'loykrathong', span: 1, art: 'loykrathong', flag: 'th', en: 'Happy Loy Krathong! 🪷', th: 'สุขสันต์วันลอยกระทง! 🪷',
    feel: ['Float a worry away: think of one thing that made you sad or cross — let the river take it, then say thank you to the water.', 'ลอยความกังวลไปกับสายน้ำ: นึกถึงเรื่องที่ทำให้เศร้าหรือโกรธ แล้วปล่อยให้แม่น้ำพาไป ขอบคุณแม่น้ำด้วยนะ'],
    fact: 'Krathongs are made from banana leaves, flowers and a candle.'},
  {id: 'christmas', icon: '🎄', md: '12-24', to: '12-25', art: 'christmas', flag: '', en: 'Merry Christmas! 🎄', th: 'สุขสันต์วันคริสต์มาส! 🎄',
    feel: ['The best gift is kindness — share something today.', 'ของขวัญที่ดีที่สุดคือความใจดี — วันนี้แบ่งปันอะไรสักอย่างนะ'],
    fact: 'Some Christmas trees are lit with thousands of tiny lights.'}
];
var EVENT_DAY_GOAL = {k: 'games', n: 3, en: 'Play 3 different games', th: 'เล่น 3 เกมไม่ซ้ำกัน'};   // every day (Loy Krathong: 3 krathongs = 3 games)
var EVENT_APP_BDAY = '09-01';   // 🎮 STEAM Playground's birthday (Settings AppBirthday 'MM-DD' wins; ❓ Aowu P9 — first app files ≈ 2026-09-01)
// 🔤 STEAM weeks: Monday → Sunday, letters loop S · T · E · A · M · 🎮 (P) from EVENT_WEEK_EPOCH (= Mon 2025-12-22, so the week of 2026-11-23 is S);
// the featured game turns each time the letter comes back. ids = the Scores-row game ids that count · k: plays (every row) | clears (rows with ⭐)
var EVENT_WEEK_EPOCH = [2025, 12, 22];
var EVENT_LETTERS = {
  S: {icon: '🔬', en: 'Science week', th: 'สัปดาห์วิทยาศาสตร์'}, T: {icon: '🤖', en: 'Tech week', th: 'สัปดาห์เทคโนโลยี'},
  E: {icon: '⚙️', en: 'Engineering week', th: 'สัปดาห์วิศวกรรม'}, A: {icon: '🎨', en: 'Art + words week', th: 'สัปดาห์ศิลปะและคำ'},
  M: {icon: '➗', en: 'Math week', th: 'สัปดาห์คณิตศาสตร์'}, P: {icon: '🎮', en: 'Free-play week', th: 'สัปดาห์เล่นอิสระ'}
};
var EVENT_WEEKS = {
  S: [{game: 'sciencetory', ids: ['sciencetory'], k: 'plays', n: 15, en: 'Run 15 science tests together', th: 'ทดลองวิทยาศาสตร์ด้วยกัน 15 ครั้ง'},
      {game: 'pokadif', ids: ['pokadif', 'pokadif-arcade', 'pokadif-case'], k: 'clears', n: 15, en: 'Solve 15 Pokadif cases together', th: 'ไขคดี Pokadif ด้วยกัน 15 คดี'},
      {game: 'eyes-brain', ids: ['eyes-brain'], k: 'plays', n: 30, en: 'Play 30 Eyes Brain Riot rounds together', th: 'เล่น Eyes Brain Riot ด้วยกัน 30 รอบ'},
      {game: 'geoscout', ids: ['geoscout'], k: 'clears', n: 25, en: 'Finish 25 GeoScout levels together', th: 'ผ่าน GeoScout ด้วยกัน 25 ด่าน'}],
  T: [{game: 'robot-adventure', ids: ['robot-adventure'], k: 'clears', n: 20, en: 'Finish 20 Code the Robot levels together', th: 'ผ่าน Code the Robot ด้วยกัน 20 ด่าน'},
      {game: 'maze', ids: ['maze'], k: 'clears', n: 30, en: 'Find 30 maze exits together', th: 'หาทางออกเขาวงกตด้วยกัน 30 ครั้ง'},
      {game: 'turbo', ids: ['turbo'], k: 'clears', n: 25, en: 'Finish 25 Turbo Trail races together', th: 'แข่ง Turbo Trail จบด้วยกัน 25 รอบ'},
      {game: 'pinball', ids: ['pinball'], k: 'plays', n: 20, en: 'Play 20 Pinball games together', th: 'เล่นพินบอลด้วยกัน 20 เกม'}],
  E: [{game: 'stacking-sim', ids: ['stacking-sim'], k: 'clears', n: 20, en: 'Finish 20 Stack It! levels together', th: 'ผ่าน Stack It! ด้วยกัน 20 ด่าน'},
      {game: 'tdstories', ids: ['td-draprincess', 'td-farmer'], k: 'clears', n: 10, en: 'Win 10 TD-Stories chapters together', th: 'ชนะ TD-Stories ด้วยกัน 10 บท'},
      {game: 'artifactory', ids: ['artifactory'], k: 'plays', n: 15, en: 'Make 15 Artifactory things together', th: 'สร้างของใน Artifactory ด้วยกัน 15 ชิ้น'},
      {game: 'avatarealm', ids: ['avatarealm'], k: 'clears', n: 8, en: 'Win 8 AvataRealm battles together', th: 'ชนะ AvataRealm ด้วยกัน 8 ครั้ง'}],
  A: [{game: 'beat-corner', ids: ['beat-corner', 'beat-piano', 'beat-drums'], k: 'clears', n: 20, en: 'Play 20 BeatCorner songs together', th: 'เล่นเพลง BeatCorner ด้วยกัน 20 เพลง'},
      {game: 'word-board', ids: ['word-board'], k: 'clears', n: 25, en: 'Finish 25 Lettercraft levels together', th: 'ผ่าน Lettercraft ด้วยกัน 25 ด่าน'},
      {game: 'georead', ids: ['georead'], k: 'clears', n: 15, en: 'Finish 15 GeoRead levels together', th: 'ผ่าน GeoRead ด้วยกัน 15 ด่าน'},
      {game: 'memory', ids: ['memory'], k: 'clears', n: 20, en: 'Finish 20 Memories Match boards together', th: 'จับคู่ Memories Match ด้วยกัน 20 กระดาน'}],
  M: [{game: 'math-quest', ids: ['math-quest'], k: 'clears', n: 30, en: 'Pass 30 Math Quest levels together', th: 'ผ่าน Math Quest ด้วยกัน 30 ด่าน'},
      {game: 'number-board', ids: ['number-board'], k: 'clears', n: 20, en: 'Finish 20 Algebros boards together', th: 'ผ่าน Algebros ด้วยกัน 20 กระดาน'},
      {game: 'number-grid', ids: ['number-grid'], k: 'clears', n: 20, en: 'Finish 20 Digitinct puzzles together', th: 'ผ่าน Digitinct ด้วยกัน 20 ข้อ'},
      {game: 'double-up', ids: ['double-up'], k: 'plays', n: 15, en: 'Play 15 Double Up boards together', th: 'เล่น Double Up ด้วยกัน 15 กระดาน'},
      {game: 'polyplot', ids: ['polyplot'], k: 'clears', n: 12, en: 'Win 12 Polyplot games together', th: 'ชนะ Polyplot ด้วยกัน 12 เกม'}],
  P: [{game: 'sla-brall', ids: ['sla-brall'], k: 'clears', n: 15, en: 'Win 15 SlaBrall matches together', th: 'ชนะ SlaBrall ด้วยกัน 15 แมตช์'},
      {game: 'pyraspike', ids: ['pyraspike'], k: 'clears', n: 12, en: 'Win 12 PyraDive matches together', th: 'ชนะ PyraDive ด้วยกัน 12 แมตช์'},
      {game: 'blasoff', ids: ['blasoff'], k: 'clears', n: 12, en: 'Win 12 BlasOff matches together', th: 'ชนะ BlasOff ด้วยกัน 12 แมตช์'},
      {game: 'brawl-buddies', ids: ['brawl-buddies', 'brawenture'], k: 'clears', n: 15, en: 'Win 15 Brawl Buddies fights together', th: 'ชนะ Brawl Buddies ด้วยกัน 15 ครั้ง'},
      {game: 'soul-bopper', ids: ['soul-bopper'], k: 'clears', n: 12, en: 'Win 12 Soul Bopper games together', th: 'ชนะ Soul Bopper ด้วยกัน 12 เกม'},
      {game: 'snakeast', ids: ['snakeast', 'snakigate', 'snakastle'], k: 'clears', n: 15, en: 'Win 15 Snakize games together', th: 'ชนะ Snakize ด้วยกัน 15 เกม'},
      {game: 'hopper', ids: ['hopper'], k: 'plays', n: 20, en: 'Play 20 Dodgy Hopper runs together', th: 'เล่น Dodgy Hopper ด้วยกัน 20 รอบ'}]
};
function evPad_(n){ return (n < 10 ? '0' : '') + n; }
function evMd_(d){ return evPad_(d.getMonth() + 1) + '-' + evPad_(d.getDate()); }
function evYmd_(d){ return d.getFullYear() + '-' + evMd_(d); }
function evDayNum_(d){ return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
function evDate_(y, m, d){ return new Date(y, m - 1, d, 12); }   // noon: never slides over midnight
function evAdd_(d, n){ return evDate_(d.getFullYear(), d.getMonth() + 1, d.getDate() + n); }
function evOn_(d, mmdd, span){   // d within ±span days of mmdd (this year, last year or next year — windows that cross New Year)
  if(!mmdd) return null;
  var a = mmdd.split('-').map(Number), here = evDayNum_(d);
  for(var y = d.getFullYear() - 1; y <= d.getFullYear() + 1; y++){ var c = evDate_(y, a[0], a[1]); if(Math.abs(evDayNum_(c) - here) <= span) return {from: evAdd_(c, -span), to: evAdd_(c, span)}; }
  return null;
}
function evRange_(d, from, to){   // 'MM-DD' → 'MM-DD' (may cross New Year)
  var here = evDayNum_(d), a = from.split('-').map(Number), b = to.split('-').map(Number);
  for(var y = d.getFullYear() - 1; y <= d.getFullYear(); y++){
    var s = evDate_(y, a[0], a[1]), e = evDate_(b[0] < a[0] ? y + 1 : y, b[0], b[1]);
    if(here >= evDayNum_(s) && here <= evDayNum_(e)) return {from: s, to: e};
  }
  return null;
}
function evNth_(d, r){   // n-th weekday (0 Sun … 6 Sat) of a month
  if(d.getMonth() + 1 !== r.month) return null;
  var first = evDate_(d.getFullYear(), r.month, 1), day = 1 + ((r.dow - first.getDay() + 7) % 7) + 7 * (r.n - 1);
  return d.getDate() === day ? {from: evDate_(d.getFullYear(), r.month, day), to: evDate_(d.getFullYear(), r.month, day)} : null;
}
function evWindow_(day, d){
  if(day.table){ var t = EVENT_TABLES[day.table] || {}, w = null; for(var y = d.getFullYear() - 1; y <= d.getFullYear() + 1 && !w; y++){ if(t[y]){ var a = t[y].split('-').map(Number), c = evDate_(y, a[0], a[1]); if(Math.abs(evDayNum_(c) - evDayNum_(d)) <= (day.span || 0)) w = {from: evAdd_(c, -(day.span || 0)), to: evAdd_(c, day.span || 0)}; } } return w; }
  if(day.nth) return evNth_(d, day.nth);
  if(day.to) return evRange_(d, day.md, day.to);
  return evOn_(d, day.md, 0);
}
function evOut_(day, w, extra){
  var o = {id: day.id, k: day.id, kind: 'day', icon: day.icon, art: day.art || null, flag: day.flag || '', title: day.en, en: day.en, th: day.th, zh: day.zh || '',
    feel: day.feel ? {en: day.feel[0], th: day.feel[1]} : null, fact: day.fact || '', goal: EVENT_DAY_GOAL,
    from: evYmd_(w.from), to: evYmd_(w.to), days: evDayNum_(w.to) - evDayNum_(w.from) + 1};
  for(var x in (extra || {})) o[x] = extra[x];
  return o;
}
// The special day for a date. birthdays = {name: 'MM-DD'} · family = [{md: 'MM-DD', name, icon}] (Settings FamilyDays) · appBday = 'MM-DD' (Settings AppBirthday).
// Order: 🎂 birthday › 🏡 family day › 🎮 app birthday › a festival over a small 🔬 STEAM day (small: true) › the SHORTEST window
// (a day inside Space Week wins over the week; Halloween's 1 day wins over Loy Krathong's 3 — the same as the old Welcome Show).
function eventDayFor(d, birthdays, family, appBday){
  var m = evMd_(d), one = {from: d, to: d};
  var bd = Object.keys(birthdays || {}).filter(function(n){ return String(birthdays[n]).slice(-5) === m; });
  if(bd.length) return evOut_({id: 'birthday', icon: '🎂', art: 'birthday', en: 'Happy birthday, ' + bd.join(' & ') + '! 🎂', th: 'สุขสันต์วันเกิด ' + bd.join(' และ ') + '! 🎂',
    feel: ['Today is a day to feel special — and to say thank you to the people who love you.', 'วันนี้เป็นวันพิเศษของหนู — อย่าลืมขอบคุณคนที่รักหนูนะ']}, one, {who: bd[0], all: bd});
  var fam = (family || []).filter(function(f){ return f && String(f.md).slice(-5) === m && f.name; })[0];
  if(fam) return evOut_({id: 'family', icon: fam.icon || '🏡', art: null, en: (fam.icon || '🏡') + ' ' + fam.name + '!', th: (fam.icon || '🏡') + ' ' + (fam.th || fam.name) + '!',
    feel: ['A family day — tell someone why you are glad they are here.', 'วันของครอบครัว — บอกใครสักคนว่าดีใจที่มีเขาอยู่']}, one, {name: fam.name});
  if((appBday || EVENT_APP_BDAY) === m) return evOut_({id: 'appbday', icon: '🎮', art: 'birthday', en: 'Happy birthday, STEAM Playground! 🎮', th: 'สุขสันต์วันเกิด STEAM Playground! 🎮',
    feel: ['Everything here started with one small idea — what small idea could YOU start?', 'ทุกอย่างที่นี่เริ่มจากไอเดียเล็ก ๆ — หนูอยากเริ่มไอเดียอะไรบ้าง?']}, one);
  var best = null;
  EVENT_DAYS.forEach(function(day){ var w = evWindow_(day, d); if(!w) return; var len = evDayNum_(w.to) - evDayNum_(w.from) + (day.small ? 1000 : 0); if(!best || len < best.len) best = {day: day, w: w, len: len}; });
  return best ? evOut_(best.day, best.w) : null;
}
// The STEAM week a date sits in: letter, featured game + family goal, Monday → Sunday, Weekend Cup = Sat + Sun.
function steamWeekFor(d){
  var e = EVENT_WEEK_EPOCH, idx = Math.floor((evDayNum_(d) - evDayNum_(evDate_(e[0], e[1], e[2]))) / 7);
  var letter = 'STEAMP'.charAt(((idx % 6) + 6) % 6), turn = Math.floor(idx / 6), pool = EVENT_WEEKS[letter], g = pool[((turn % pool.length) + pool.length) % pool.length];
  var mon = evAdd_(evDate_(e[0], e[1], e[2]), idx * 7), L = EVENT_LETTERS[letter];
  return {id: 'w' + evYmd_(mon), kind: 'week', letter: letter, icon: L.icon, en: L.en, th: L.th, index: idx, game: g.game, ids: g.ids.slice(),
    goal: {k: g.k, n: g.n, en: g.en, th: g.th}, from: evYmd_(mon), to: evYmd_(evAdd_(mon, 6)), cup: {from: evYmd_(evAdd_(mon, 5)), to: evYmd_(evAdd_(mon, 6))}};
}
// The next special days AFTER a date (for "coming next" lines; a day already running is not "next"): [{id, icon, title, from}] — calendar days only.
function eventNextDays(d, count){
  var out = [], seen = {};
  for(var i = 1; i <= 400 && out.length < (count || 3); i++){ var x = evAdd_(d, i), day = eventDayFor(x, {}, [], '00-00'); if(day && day.from > evYmd_(d) && !seen[day.id + day.from]){ seen[day.id + day.from] = 1; out.push({id: day.id, icon: day.icon, title: day.en, from: day.from}); } }
  return out;
}
// 📅 EVENT DAYS END
  // 🎪 EVENTKIT API (🧱 b5a — the chip / sheet / ribbon / result row / Event book come in B5b–B5d)
  function evToday_(){ var f = window.WS_DATE; if(f && /^\d{4}-\d{2}-\d{2}$/.test(f)){ var a = f.split('-').map(Number); return evDate_(a[0], a[1], a[2]); } return new Date(); }
  return {
    dayFor: eventDayFor, weekFor: steamWeekFor, nextDays: eventNextDays,
    today: function(birthdays, family, appBday){ return eventDayFor(evToday_(), birthdays || {}, family || [], appBday || ''); },
    now: evToday_, md: evMd_, ymd: evYmd_,
    DAYS: EVENT_DAYS, TABLES: EVENT_TABLES, WEEKS: EVENT_WEEKS, LETTERS: EVENT_LETTERS, DAY_GOAL: EVENT_DAY_GOAL
  };
})();
