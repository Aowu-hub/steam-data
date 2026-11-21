
// 🎪 EVENT UI (🧱 b5b) — built into EventUi.html by build_events.py (after EventKit.html, which gives window.Events).
// Events.ui.chip(el, ev, lang)          the Dashboard 🎪 chip (fits like the ⭐ step chip: the host page drops .ec-w / .ec-d words when short)
// Events.ui.newsCards(ev, lang, o)      → pinned 📣 cards {kind:'event', part:'day'|'week', icon, html, look} (counted on the client from the boot payload — no server news)
// Events.ui.paintNews(box)              colours + mini bars on the rendered cards
// Events.ui.sheet({ev, me, lang, players, avatarOf, go, onClose}) → {el, close()}   the 🎪 event sheet: badge · EN/TH(/中文) · 💭 feeling line ·
//                                       🤝 ONE family bar per goal (colour per player = their shirt, family order, never a ranking) · soft day dots · rewards · ▶ play
// Events.ui.badge(cv, key, px)          code-drawn round badge, baked ONCE per key + size (emoji lag rule)
// Events.ui.look(key) · Events.ui.LOG (tests)
(function(E){
  if(!E) return;
  const LOG = [];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  // 🎨 one look per day / week letter: colours a → b, ink, the goal scene, short name (chip) + a goal line in the day's own words
  const LOOK = {
    loykrathong: {a: '#FF6FA5', b: '#4C5BD4', ink: '#B0306A', scene: 'river', short: ['Loy Krathong', 'ลอยกระทง'],
      goal: ['Float 3 krathongs — play 3 different games', 'ลอยกระทง 3 ใบ — เล่น 3 เกมไม่ซ้ำกัน']},
    scienceday: {a: '#2EC4B6', b: '#7A5CFA', ink: '#13756C', short: ['Science Day', 'วันวิทยาศาสตร์']},
    newyear: {a: '#FFB703', b: '#7A5CFA', ink: '#8A4B00', short: ['New Year', 'ปีใหม่']},
    childrenth: {a: '#FF9F1C', b: '#2EC4B6', ink: '#A45A00', short: ["Children's Day", 'วันเด็ก']},
    childrentw: {a: '#FF9F1C', b: '#E5484D', ink: '#A45A00', short: ["Children's Day", 'วันเด็ก']},
    lunarny: {a: '#E5484D', b: '#FFB703', ink: '#A1161C', short: ['Lunar New Year', 'ตรุษจีน']},
    piday: {a: '#C77DFF', b: '#FF9F1C', ink: '#6A2BAF', short: ['Pi Day', 'วันพาย']},
    songkran: {a: '#2CA6DE', b: '#4CB963', ink: '#0E6A95', short: ['Songkran', 'สงกรานต์']},
    earthday: {a: '#4CB963', b: '#2CA6DE', ink: '#2B7A3A', short: ['Earth Day', 'วันคุ้มครองโลก']},
    dragonboat: {a: '#2E9E5B', b: '#E5484D', ink: '#1E6B3D', short: ['Dragon Boat', 'บ๊ะจ่าง']},
    moonday: {a: '#9AA5C4', b: '#4361EE', ink: '#33407A', short: ['Moon Day', 'วันดวงจันทร์']},
    mothersth: {a: '#3D8BFD', b: '#8ECAE6', ink: '#1F4E9E', short: ["Mother's Day", 'วันแม่']},
    midautumn: {a: '#FFB703', b: '#3A2E6E', ink: '#7A5200', short: ['Mid-Autumn', 'ไหว้พระจันทร์']},
    spaceweek: {a: '#4361EE', b: '#C77DFF', ink: '#2D3BA8', short: ['Space Week', 'สัปดาห์อวกาศ']},
    halloween: {a: '#FF7A1A', b: '#7B2CBF', ink: '#A04500', short: ['Halloween', 'ฮาโลวีน']},
    christmas: {a: '#E5484D', b: '#2E9E5B', ink: '#A1161C', short: ['Christmas', 'คริสต์มาส']},
    birthday: {a: '#FF4D8D', b: '#FFC23D', ink: '#B0306A', short: ['Birthday', 'วันเกิด']},
    family: {a: '#FF9F1C', b: '#FF4D8D', ink: '#A45A00', short: ['Family day', 'วันครอบครัว']},
    appbday: {a: '#7A5CFA', b: '#FF4D8D', ink: '#4B32B5', short: ['App birthday', 'วันเกิดแอป']},
    S: {a: '#2EC4B6', b: '#3D8BFD', ink: '#13756C', scene: 'lab', fact: ['Round-bottom flasks spread heat evenly, so liquids boil smoothly.', 'ขวดก้นกลมกระจายความร้อนได้ทั่ว ของเหลวจึงเดือดอย่างนุ่มนวล']},
    T: {a: '#7A5CFA', b: '#2CA6DE', ink: '#4B32B5', fact: ['The first computer "bug" was a real moth stuck inside a machine (1947).', '"บั๊ก" คอมพิวเตอร์ตัวแรกคือแมลงเม่าจริง ๆ ที่ติดอยู่ในเครื่อง (1947)']},
    E: {a: '#FF9F1C', b: '#E5484D', ink: '#A45A00', fact: ['Bridges use triangles because a triangle keeps its shape when you push it.', 'สะพานใช้รูปสามเหลี่ยม เพราะสามเหลี่ยมไม่เสียรูปเมื่อถูกดัน']},
    A: {a: '#FF4D8D', b: '#C77DFF', ink: '#A1215E', fact: ['Mix blue and yellow paint and you get green.', 'ผสมสีน้ำเงินกับสีเหลือง จะได้สีเขียว']},
    M: {a: '#4361EE', b: '#2EC4B6', ink: '#2D3BA8', fact: ['Zero was first used as a real number in India.', 'เลขศูนย์ถูกใช้เป็นตัวเลขจริง ๆ ครั้งแรกในอินเดีย']},
    P: {a: '#4CB963', b: '#FFB703', ink: '#2B7A3A', fact: ['Free-play week: try a game you have never played!', 'สัปดาห์เล่นอิสระ: ลองเกมที่ยังไม่เคยเล่นดูสิ!']}
  };
  const look = k => LOOK[k] || {a: '#FF9F1C', b: '#7A5CFA', ink: '#4B32B5'};
  const TH_DOW = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'], EN_DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const TH_MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'], EN_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const ymd = s => { const a = String(s).split('-').map(Number); return new Date(a[0], a[1] - 1, a[2], 12); };
  const fmt = (s, th, dow) => { const d = ymd(s); return (dow ? (th ? TH_DOW : EN_DOW)[d.getDay()] + ' ' : '') + d.getDate() + ' ' + (th ? TH_MON : EN_MON)[d.getMonth()]; };
  const span = (a, b, th) => { if(a === b) return fmt(a, th, true); const A = ymd(a), B = ymd(b); return (A.getMonth() === B.getMonth() ? (th ? TH_DOW : EN_DOW)[A.getDay()] + ' ' + A.getDate() : fmt(a, th, true)) + ' – ' + fmt(b, th, true); };
  const short = (d, th) => d.id === 'birthday' ? (th ? 'วันเกิด ' : '') + (d.all || [d.who]).join(' & ') + (th ? '' : "'s birthday") : d.id === 'family' ? d.name || look('family').short[0] : (look(d.id).short || [d.en, d.th])[th ? 1 : 0];
  const sized = (txt, need) => need ? String(txt).replace(/\d+/, need) : txt;   // "Run 15 … together" → the family's own number
  const dayGoalLine = (d, th) => { const L = look(d.id); return L.goal ? L.goal[th ? 1 : 0] : (th ? d.goal.th : d.goal.en); };

  // 👕 one colour per player = their shirt (AvatarKit OUTFIT_COLS), family order; a clash or a too-pale shirt takes the next free house colour
  const SPARE = ['#FF4D6D', '#FF9F1C', '#2CA6DE', '#4CB963', '#7B5FE0', '#FF6FA5', '#F2B705', '#4361EE', '#2EC4B6', '#E5484D'];
  function colours(players, avatarOf){
    const out = {}, used = {};
    players.forEach(n => { let c = '';
      try { const av = avatarOf && avatarOf(n); if(av && typeof OUTFIT_COLS !== 'undefined') c = OUTFIT_COLS[av.outfitColor] || ''; } catch(e){}
      if(!c || used[c] || /^#F[0-9A-F]F[0-9A-F]F/i.test(c)) c = SPARE.find(x => !used[x]) || '#7B5FE0';
      used[c] = 1; out[n] = c; });
    return out;
  }
  // pips in family order (who filled them), never sorted by amount
  function pipList(fam, players, cap){
    const out = []; players.forEach(n => { const k = Math.min(fam.by && fam.by[n] || 0, cap || 1e9); for(let i = 0; i < k && out.length < fam.need; i++) out.push(n); });
    while(out.length < fam.need) out.push(''); return out;
  }

  // 🏅 code-drawn badge: scalloped rosette · day colours · emoji (or the STEAM letter) baked once
  const BADGE = {};
  function badge(cv, key, px){
    const dpr = Math.min(3, window.devicePixelRatio || 1), S = Math.round(px * dpr), id = key + '|' + S; cv.width = S; cv.height = S;
    const g = cv.getContext('2d');
    if(BADGE[id]){ g.drawImage(BADGE[id], 0, 0); return; }
    const o = document.createElement('canvas'); o.width = o.height = S; const c = o.getContext('2d'), r = S / 2, L = look(key), isWeek = key.length === 1;
    c.translate(r, r);
    c.beginPath(); for(let i = 0; i <= 64; i++){ const a = i / 64 * Math.PI * 2, rr = r * (0.94 + 0.06 * Math.cos(a * 16)); c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    const gr = c.createLinearGradient(-r, -r, r, r); gr.addColorStop(0, L.a); gr.addColorStop(1, L.b); c.fillStyle = gr; c.fill();
    c.beginPath(); c.arc(0, 0, r * 0.76, 0, Math.PI * 2); const gi = c.createRadialGradient(-r * .25, -r * .3, r * .1, 0, 0, r * .8);
    gi.addColorStop(0, '#FFFFFF'); gi.addColorStop(1, '#FFF1DA'); c.fillStyle = gi; c.fill();
    c.lineWidth = r * 0.05; c.strokeStyle = 'rgba(255,255,255,.9)'; c.stroke();
    c.beginPath(); c.arc(0, 0, r * 0.68, 0, Math.PI * 2); c.lineWidth = r * 0.025; c.setLineDash([r * .05, r * .06]); c.strokeStyle = L.a; c.stroke(); c.setLineDash([]);
    if(key === 'loykrathong'){   // 🌊 a little river inside the badge
      c.save(); c.beginPath(); c.arc(0, 0, r * 0.66, 0, Math.PI * 2); c.clip();
      c.fillStyle = '#C9D4FF'; c.beginPath(); c.moveTo(-r, r * .28); for(let x = -r; x <= r; x += r / 8) c.lineTo(x, r * .28 + Math.sin(x / r * 9) * r * .03); c.lineTo(r, r); c.lineTo(-r, r); c.fill();
      c.fillStyle = '#9FB0F5'; c.beginPath(); c.moveTo(-r, r * .42); for(let x = -r; x <= r; x += r / 8) c.lineTo(x, r * .42 + Math.cos(x / r * 7) * r * .025); c.lineTo(r, r); c.lineTo(-r, r); c.fill(); c.restore();
    }
    if(key === 'S'){ c.save(); c.globalAlpha = .55; [[-.42, .3, .07], [.4, .22, .05], [.3, -.4, .06], [-.3, -.42, .04]].forEach(b => { c.beginPath(); c.arc(b[0] * r, b[1] * r, b[2] * r, 0, Math.PI * 2); c.strokeStyle = L.b; c.lineWidth = r * .03; c.stroke(); }); c.restore(); }
    c.textAlign = 'center'; c.textBaseline = 'middle';
    if(isWeek){
      c.font = '700 ' + Math.round(r * 0.9) + "px 'Fredoka',sans-serif"; c.lineWidth = r * .1; c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineJoin = 'round';
      c.strokeText(key === 'P' ? '▶' : key, -r * .06, r * .06); const gt = c.createLinearGradient(0, -r * .4, 0, r * .4); gt.addColorStop(0, L.a); gt.addColorStop(1, L.b); c.fillStyle = gt; c.fillText(key === 'P' ? '▶' : key, -r * .06, r * .06);
      c.font = Math.round(r * 0.42) + 'px sans-serif'; c.fillText(E.LETTERS[key] ? E.LETTERS[key].icon : '', r * .42, -r * .38);
    } else {
      const d = (E.DAYS || []).find(x => x.id === key); const em = d ? d.icon : key === 'birthday' ? '🎂' : key === 'appbday' ? '🎮' : '🏡';
      c.font = Math.round(r * 0.78) + 'px sans-serif'; c.fillText(em, 0, key === 'loykrathong' ? -r * .06 : r * .04);
    }
    c.fillStyle = '#fff'; [[-.78, -.55], [.8, .5], [.62, -.74]].forEach(p => { c.save(); c.translate(p[0] * r, p[1] * r); c.rotate(.4); c.fillRect(-r * .05, -r * .012, r * .1, r * .024); c.fillRect(-r * .012, -r * .05, r * .024, r * .1); c.restore(); });
    BADGE[id] = o; g.drawImage(o, 0, 0);
  }

  // 🪷 / 🧪 goal scenes — the family's progress as a picture (krathongs on the river · a flask filling in player colours)
  function drawKrathong(c, x, y, s, col, t, ghost){
    c.save(); c.translate(x, y); c.scale(s, s); if(ghost) c.globalAlpha = .55;
    c.fillStyle = 'rgba(255,220,120,.18)'; c.beginPath(); c.ellipse(0, 3, 20, 4, 0, 0, Math.PI * 2); c.fill();   // light on the water
    c.fillStyle = '#3E9B4F'; c.beginPath(); c.moveTo(-16, -2); c.quadraticCurveTo(0, 12, 16, -2); c.closePath(); c.fill();   // 🍃 banana-leaf boat
    c.fillStyle = '#58B868'; for(let i = -3; i <= 3; i++){ c.beginPath(); c.moveTo(i * 4.6 - 2.4, -2); c.lineTo(i * 4.6, -6.5); c.lineTo(i * 4.6 + 2.4, -2); c.fill(); }
    c.fillStyle = col; for(let i = -2; i <= 2; i++){ c.beginPath(); c.ellipse(i * 4.2, -6 - (2 - Math.abs(i)) * 1.4, 2.6, 5, i * .35, 0, Math.PI * 2); c.fill(); }   // 🌸 petals = the player's colour
    c.fillStyle = 'rgba(255,255,255,.55)'; for(let i = -2; i <= 2; i++){ c.beginPath(); c.ellipse(i * 4.2 - .6, -7.4 - (2 - Math.abs(i)) * 1.4, .8, 2, i * .35, 0, Math.PI * 2); c.fill(); }
    if(!ghost){ c.fillStyle = '#FFF6E0'; c.fillRect(-1.1, -17, 2.2, 7);   // 🕯️ candle + flame
      const fl = 1 + Math.sin(t * 13 + x) * .12 + Math.sin(t * 7.3 + y) * .08; const fg = c.createRadialGradient(0, -19, .5, 0, -19, 9 * fl); fg.addColorStop(0, 'rgba(255,230,140,.85)'); fg.addColorStop(1, 'rgba(255,200,80,0)');
      c.fillStyle = fg; c.beginPath(); c.arc(0, -19, 9 * fl, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#FFB703'; c.beginPath(); c.moveTo(0, -24 * fl + 3); c.quadraticCurveTo(2.4, -19, 0, -17); c.quadraticCurveTo(-2.4, -19, 0, -24 * fl + 3); c.fill();
      c.strokeStyle = '#B98B5A'; c.lineWidth = .8; c.beginPath(); c.moveTo(4, -9); c.lineTo(6, -16); c.moveTo(-4, -9); c.lineTo(-6.5, -15); c.stroke(); }   // incense
    c.restore();
  }
  function sceneRiver(c, W, H, t, pips, col, done){
    const sk = c.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#1B1F4B'); sk.addColorStop(.5, '#3A2E6E'); sk.addColorStop(1, '#22306E'); c.fillStyle = sk; c.fillRect(0, 0, W, H);
    for(let i = 0; i < 26; i++){ const x = (i * 97.3) % W, y = (i * 37.1) % (H * .42), a = .35 + .35 * Math.sin(t * 2 + i); c.fillStyle = 'rgba(255,255,255,' + a + ')'; c.fillRect(x, y, 1.6, 1.6); }
    const mx = W - Math.min(70, W * .14), my = H * .26; const mg = c.createRadialGradient(mx, my, 4, mx, my, 34); mg.addColorStop(0, 'rgba(255,246,214,.55)'); mg.addColorStop(1, 'rgba(255,246,214,0)');
    c.fillStyle = mg; c.beginPath(); c.arc(mx, my, 34, 0, Math.PI * 2); c.fill(); c.fillStyle = '#FFF4D2'; c.beginPath(); c.arc(mx, my, 13, 0, Math.PI * 2); c.fill();   // 🌕 full moon
    const wy = H * .5; const wg = c.createLinearGradient(0, wy, 0, H); wg.addColorStop(0, '#2B3F8F'); wg.addColorStop(1, '#16245A'); c.fillStyle = wg; c.fillRect(0, wy, W, H - wy);
    c.fillStyle = 'rgba(255,244,210,.22)'; for(let i = 0; i < 6; i++){ const ww = 26 - i * 3; c.fillRect(mx - ww / 2 + Math.sin(t * 1.5 + i) * 3, wy + 6 + i * 6, ww, 2); }   // moon on the water
    c.strokeStyle = 'rgba(160,190,255,.25)'; c.lineWidth = 1.2; for(let r = 0; r < 3; r++){ c.beginPath(); for(let x = 0; x <= W; x += 8){ const y = wy + 12 + r * 12 + Math.sin(x / 26 + t * 1.2 + r) * 1.6; if(x) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke(); }
    const filled = pips.filter(Boolean), waiting = pips.length - filled.length, n = filled.length, s = Math.max(.72, Math.min(1.15, H / 92)), span = W - 60;
    filled.forEach((p, i) => { const x = 30 + ((i + .5) / Math.max(n, 1) * span * .78 + t * 9 + i * 13) % span, y = wy + 18 + (i % 3) * 10 + Math.sin(t * 1.8 + i * 1.7) * 2;
      drawKrathong(c, x, y, s * (.82 + (i % 3) * .1), col[p] || '#FF6FA5', t, false); });
    const bw = Math.min(W * .3, 40 + waiting * 22 * s);   // 🌿 the near bank: krathongs still waiting to float sit here
    if(waiting){ c.fillStyle = '#1E4D3A'; c.beginPath(); c.moveTo(0, H * .62); c.quadraticCurveTo(bw * .7, H * .6, bw, H); c.lineTo(0, H); c.fill();
      c.fillStyle = '#2E6B4E'; for(let x = 4; x < bw * .8; x += 6){ c.beginPath(); c.moveTo(x, H * .66 + x * .05); c.lineTo(x + 2, H * .56 + Math.sin(t * 2 + x) * 1.5 + x * .05); c.lineTo(x + 4, H * .66 + x * .05); c.fill(); } }
    for(let i = 0; i < waiting; i++) drawKrathong(c, 18 + i * 20 * s, H * .86 - (i % 2) * 4, s * .7, '#FFFFFF', t, true);
    if(done){ c.fillStyle = 'rgba(255,230,140,.9)'; for(let i = 0; i < 18; i++){ const a = t * .7 + i, x = (W / 2) + Math.cos(a * 1.3) * W * .4, y = H * .3 + Math.sin(a * 2.1) * H * .2; c.fillRect(x, y, 2, 2); } }
  }
  function sceneLab(c, W, H, t, pips, col, done){
    const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#E6FBF8'); bg.addColorStop(1, '#D5ECFF'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(61,139,253,.12)'; c.lineWidth = 1; for(let x = 0; x < W; x += 14){ c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for(let y = 0; y < H; y += 14){ c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    c.fillStyle = '#B9DCE8'; c.fillRect(0, H - 9, W, 9); c.fillStyle = '#9CC9D8'; c.fillRect(0, H - 9, W, 2);   // 🧪 the lab bench
    const cx = W / 2, fy = H - 9, R = Math.min(H * .36, 40), neck = R * .42, top = fy - R * 2 - R * .9;
    // side props: test tubes (left) + a beaker (right), wide screens only
    if(W > 260){ for(let i = 0; i < 3; i++){ const x = cx - R * 2.6 - i * 16, h = H * .48; c.fillStyle = ['#FF9F1C', '#7A5CFA', '#4CB963'][i]; c.globalAlpha = .55; c.fillRect(x - 4, fy - h * .55, 8, h * .55); c.globalAlpha = 1;
        c.strokeStyle = '#5F8FA3'; c.lineWidth = 1.6; c.strokeRect(x - 4, fy - h, 8, h); }
      const bx = cx + R * 2.5; c.strokeStyle = '#5F8FA3'; c.lineWidth = 1.8; c.strokeRect(bx, fy - H * .42, R * 1.1, H * .42); c.fillStyle = 'rgba(46,196,182,.35)'; c.fillRect(bx + 1, fy - H * .22, R * 1.1 - 2, H * .22 - 1); }
    // the round-bottom flask: liquid layers = each player's share, bottom → top in family order
    const ga = Math.asin(Math.min(.95, neck / 2 / R)), by = fy - R;
    const flask = () => { c.beginPath(); c.moveTo(cx - neck / 2, top); c.lineTo(cx - neck / 2, by - R * Math.cos(ga)); c.arc(cx, by, R, -Math.PI / 2 - ga, -Math.PI / 2 + ga, true); c.lineTo(cx + neck / 2, top); };
    c.save(); flask(); c.closePath(); c.clip();
    const filled = pips.filter(Boolean), total = pips.length || 1, full = fy - R * 2, lvl = filled.length / total;
    let y0 = fy; filled.forEach((p, i) => { const h = (R * 2) / total; const yy = fy - (i + 1) * h; c.fillStyle = col[p] || '#2EC4B6'; c.globalAlpha = .82; c.fillRect(cx - R - 2, yy + Math.sin(t * 2 + i) * .6, R * 2 + 4, h + 1); y0 = yy; });
    c.globalAlpha = 1; if(filled.length){ c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); for(let x = cx - R; x <= cx + R; x += 4){ const y = y0 + Math.sin(x / 6 + t * 3) * 1.4; if(x === cx - R) c.moveTo(x, y); else c.lineTo(x, y); } c.lineTo(cx + R, y0 + 3); c.lineTo(cx - R, y0 + 3); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,.8)'; for(let i = 0; i < 7; i++){ const k = (t * .45 + i / 7) % 1, x = cx + Math.sin(i * 2.3 + t) * R * .5, y = fy - k * (fy - y0); if(filled.length && y > y0){ c.beginPath(); c.arc(x, y, 1.4 + (i % 3) * .6, 0, Math.PI * 2); c.fill(); } }
    c.restore();
    c.strokeStyle = '#4F7F95'; c.lineWidth = 2.4; c.lineJoin = 'round'; flask(); c.stroke();
    c.fillStyle = '#4F7F95'; c.fillRect(cx - neck / 2 - 3, top - 3, neck + 6, 4);
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(cx - R * .45, fy - R * 1.25, R * .12, R * .32, -.5, 0, Math.PI * 2); c.fill();   // glass shine
    for(let i = 1; i < total; i++){ const yy = fy - i * (R * 2) / total; c.strokeStyle = 'rgba(79,127,149,.55)'; c.lineWidth = 1; c.beginPath(); c.moveTo(cx + R * .55, yy); c.lineTo(cx + R * .78, yy); c.stroke(); }   // marks = the goal
    if(filled.length){ for(let i = 0; i < 4; i++){ const k = (t * .35 + i / 4) % 1; c.fillStyle = 'rgba(255,255,255,' + (0.8 - k * .8) + ')'; c.beginPath(); c.arc(cx + Math.sin(i * 1.9 + t * 1.3) * 5, top - k * 22, 2 + k * 3, 0, Math.PI * 2); c.fill(); } }   // fizz out of the top
    if(done){ for(let i = 0; i < 14; i++){ const a = t * .9 + i * .45; c.fillStyle = ['#FFB703', '#FF4D8D', '#2EC4B6'][i % 3]; c.fillRect(cx + Math.cos(a) * (R + 14 + i), top + 6 + Math.sin(a * 1.4) * 18, 3, 3); } }
  }
  // 🎈 the shared "jar of stars" (b5b Q3 ⭐): every other day / week letter until it gets its own scene — one star per filled pip in that helper's colour
  function star(c, x, y, r, rot){ c.beginPath(); for(let i = 0; i < 10; i++){ const a = rot + i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * .45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }
  function sceneJar(c, W, H, t, pips, col, done, L){
    L = L || {a: '#FF9F1C', b: '#7A5CFA'};
    const bg = c.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#FFF6E5'); bg.addColorStop(1, '#F1EAFF'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.globalAlpha = .18; for(let i = 0; i < 14; i++){ const x = (i * 83.7) % W, y = (i * 41.3) % H; c.fillStyle = i % 2 ? L.a : L.b; star(c, x, y, 3 + (i % 3), t * .2 + i); c.fill(); } c.globalAlpha = 1;   // soft confetti stars
    c.fillStyle = 'rgba(0,0,0,.06)'; c.beginPath(); c.ellipse(W / 2, H - 6, Math.min(W * .22, 70), 4, 0, 0, Math.PI * 2); c.fill();   // shadow
    const jh = Math.min(H - 16, 96), jw = Math.min(jh * .86, W * .42), cx = W / 2, by = H - 7, ty = by - jh, rad = Math.min(16, jw * .2);
    const body = () => { c.beginPath(); c.moveTo(cx - jw * .36, ty + 8); c.lineTo(cx - jw * .36, ty + 14); c.quadraticCurveTo(cx - jw / 2, ty + 18, cx - jw / 2, ty + 30);
      c.lineTo(cx - jw / 2, by - rad); c.quadraticCurveTo(cx - jw / 2, by, cx - jw / 2 + rad, by); c.lineTo(cx + jw / 2 - rad, by); c.quadraticCurveTo(cx + jw / 2, by, cx + jw / 2, by - rad);
      c.lineTo(cx + jw / 2, ty + 30); c.quadraticCurveTo(cx + jw / 2, ty + 18, cx + jw * .36, ty + 14); c.lineTo(cx + jw * .36, ty + 8); c.closePath(); };
    c.fillStyle = 'rgba(255,255,255,.55)'; body(); c.fill();
    // stars pile up from the bottom, family order, each in its helper's colour
    const filled = pips.filter(Boolean), total = Math.max(pips.length, 1), cols = Math.max(3, Math.round(Math.sqrt(total * jw / Math.max(jh - 30, 10)))), rows = Math.ceil(total / cols);
    const sr = Math.max(4, Math.min((jw - 12) / cols / 2, (jh - 30) / (rows * 1.6 + .4)) * .95);
    c.save(); body(); c.clip();
    filled.forEach((p, i) => { const r0 = Math.floor(i / cols), k = i % cols, x = cx - jw / 2 + 6 + sr + k * ((jw - 12 - sr * 2) / Math.max(cols - 1, 1)) + (r0 % 2 ? sr * .35 : 0), y = by - 5 - sr - r0 * sr * 1.6;
      const tw = 1 + Math.sin(t * 3 + i * 1.7) * .06; c.fillStyle = col[p] || L.a; star(c, x, y, sr * tw, (i % 5) * .25); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 1.2; c.stroke(); });
    c.restore();
    for(let i = 1; i < rows; i++){ const yy = by - 5 - i * sr * 1.6 + sr * .1; c.strokeStyle = 'rgba(122,92,250,.35)'; c.lineWidth = 1; c.beginPath(); c.moveTo(cx + jw / 2 - 9, yy); c.lineTo(cx + jw / 2 - 3, yy); c.stroke(); }   // marks = the goal
    c.strokeStyle = '#8C7BB8'; c.lineWidth = 2.2; c.lineJoin = 'round'; body(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(cx - jw * .32, ty + jh * .5, 3, jh * .2, 0, 0, Math.PI * 2); c.fill();   // glass shine
    const lg = c.createLinearGradient(cx - jw * .4, 0, cx + jw * .4, 0); lg.addColorStop(0, L.a); lg.addColorStop(1, L.b); c.fillStyle = lg;
    c.beginPath(); c.roundRect ? c.roundRect(cx - jw * .4, ty, jw * .8, 9, 3) : c.rect(cx - jw * .4, ty, jw * .8, 9); c.fill();   // the lid in the event's colours
    // 🎈 a balloon tied to the lid
    const bx = cx + jw * .5 + 14, byy = ty + 4 + Math.sin(t * 1.6) * 3; c.strokeStyle = 'rgba(90,80,120,.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(cx + jw * .36, ty + 4); c.quadraticCurveTo(bx - 4, byy + 26, bx, byy + 16); c.stroke();
    if(W > 200){ c.fillStyle = L.b; c.beginPath(); c.ellipse(bx, byy, 10, 13, Math.sin(t) * .1, 0, Math.PI * 2); c.fill(); c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(bx - 3.5, byy - 4, 2.5, 4, -.4, 0, Math.PI * 2); c.fill(); }
    if(done){ for(let i = 0; i < 12; i++){ const a = t * 1.1 + i * .52; c.fillStyle = ['#FFB703', '#FF4D8D', '#2EC4B6'][i % 3]; star(c, cx + Math.cos(a) * (jw * .6 + i), ty + 10 + Math.sin(a * 1.3) * 16, 2.6, a); c.fill(); } }
  }
  const SCENES = {river: sceneRiver, lab: sceneLab, jar: sceneJar};

  // 🎪 the chip
  function chip(el, ev, lang){
    if(!el) return; if(!ev || ev.err || !ev.on || !ev.week){ el.classList.add('hidden'); return; }
    const th = lang === 'th', d = ev.day, w = ev.week, Ld = d ? look(d.id) : look(w.letter), Lw = look(w.letter);
    el.classList.remove('hidden'); el.classList.toggle('th', th); el.classList.toggle('solo', !d);
    el.style.setProperty('--ev-a', Ld.a); el.style.setProperty('--ev-b', Lw.b); el.style.setProperty('--ev-ink', Ld.ink); el.style.setProperty('--ev-ink2', Lw.ink);
    el.dataset.day = d ? d.id : ''; el.dataset.week = w.letter; el.dataset.lang = lang;
    el.innerHTML = '<span class="ec-i" aria-hidden="true">' + esc(d ? d.icon : '') + '</span><b class="ec-d">' + esc(d ? short(d, th) : '') + '</b><span class="ec-sep" aria-hidden="true">·</span>' +
      '<span class="ec-wi" aria-hidden="true">' + esc(w.icon) + '</span><span class="ec-w">' + esc(th ? w.th : w.en) + '</span>';
    el.setAttribute('aria-label', (d ? short(d, th) + ' · ' : '') + (th ? w.th : w.en) + (th ? ' — แตะเพื่อดูกิจกรรม' : ' — tap for the family event'));
  }

  // 📣 pinned cards (day first, then the week)
  function newsCards(ev, lang){
    if(!ev || ev.err || !ev.on || !ev.week) return [];
    const th = lang === 'th', out = [], d = ev.day, w = ev.week;   // 🎂 a birthday greets in the big banner — its card shows the party GOAL, never a 2nd greeting
    if(d && d.family){ const f = d.family, L = look(d.id);
      out.push({kind: 'event', part: 'day', id: d.id, icon: d.icon, at: d.from, look: L, need: f.need, have: f.have, done: f.done,
        html: '<b>' + esc(d.id === 'birthday' ? (th ? '🎂 เป้าหมายงานวันเกิดของ ' + (d.all || [d.who]).join(' & ') : '🎂 ' + (d.all || [d.who]).join(' & ') + "'s party goal") : th ? d.th : d.en) + '</b><small>' + esc(dayGoalLine(d, th)) + ' · ' + (f.done ? (th ? 'สำเร็จแล้ว! 🎉' : 'done together! 🎉') : f.have + ' / ' + f.need + (th ? ' ด้วยกัน' : ' together')) + '</small>'}); }
    if(w.family){ const f = w.family, L = look(w.letter), gn = w.gname || w.game;
      out.push({kind: 'event', part: 'week', id: w.id, icon: w.icon, at: w.from, look: L, need: f.need, have: f.have, done: f.done,
        html: '<b>' + esc((th ? w.th : w.en) + ': ' + gn) + '</b><small>' + esc(sized(th ? w.goal.th : w.goal.en, f.need)) + ' · ' + (f.done ? (th ? 'สำเร็จแล้ว! 🎉' : 'done! 🎉') : f.have + ' / ' + f.need) + (th ? ' · ไมล์ ×2 ใน ' : ' · ×2 miles in ') + esc(gn) + '</small>'}); }
    return out;
  }
  function paintNews(box, list){
    (box ? box.querySelectorAll('.news.event') : []).forEach((b, k) => { const n = (list || []).filter(x => x.kind === 'event')[k]; if(!n) return;
      b.style.setProperty('--ev-a', n.look.a); b.style.setProperty('--ev-b', n.look.b);
      const nt = b.querySelector('.nt'); if(nt && !nt.querySelector('.ev-mini')){ const m = document.createElement('span'); m.className = 'ev-mini'; m.setAttribute('aria-hidden', 'true');
        const k2 = Math.min(n.need, 24), f = Math.round(n.have / Math.max(1, n.need) * k2); m.style.setProperty('--c', n.look.a);
        m.innerHTML = Array.from({length: k2}, (_, i) => '<i' + (i < f ? ' class="f"' : '') + '></i>').join(''); nt.appendChild(m); } });
  }

  // 🎪 the sheet
  let OPEN = null;
  function sheet(o){
    o = o || {}; if(OPEN) OPEN.close();
    const ev = o.ev; if(!ev || !ev.week) return null;
    const me = o.me || 'Guest', players = (o.players || []).slice(), col = colours(players, o.avatarOf);
    let lg = o.lang || (window.Motto ? Motto.lang(me) : 'en');
    const d = ev.day, w = ev.week, Ld = d ? look(d.id) : look(w.letter), Lw = look(w.letter);
    const el = document.createElement('div'); el.className = 'ev-sheet'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Family event');
    el.innerHTML = '<div class="ev-card"><div class="ev-head"><canvas class="ev-badge" aria-hidden="true"></canvas><div class="ev-ttl"><h3></h3><span class="ev-alt"></span><div class="ev-when"></div></div>' +
      '<div class="ev-lang"><button data-l="en" data-sound="tap">EN</button><button data-l="th" data-sound="tap">ไทย</button></div><button class="ev-x" aria-label="Close" data-sound="tap">✕</button></div>' +
      '<div class="ev-feel"><i aria-hidden="true">💭</i><p></p></div><div class="ev-goals"></div><div class="ev-foot"></div>' +
      '<span class="ui-modal on" style="display:none!important"></span></div>';   // hides 💬 Tell us while open (same as the 🪜 ladder)
    (o.host || document.body).appendChild(el);
    const $ = s => el.querySelector(s), card = $('.ev-card');
    card.style.setProperty('--ev-a', Ld.a); card.style.setProperty('--ev-b', d ? Ld.b : Lw.b); card.style.setProperty('--ev-ink', Ld.ink);
    badge($('.ev-badge'), d ? d.id : w.letter, 64);
    const scenes = [];
    function dots(from, to, today, th){
      const a = ymd(from), n = Math.round((ymd(to) - a) / 864e5) + 1, out = [];
      for(let i = 0; i < n && i < 7; i++){ const x = new Date(a.getFullYear(), a.getMonth(), a.getDate() + i, 12), s = x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
        out.push('<span class="ev-dot ' + (s < today ? 'past' : s === today ? 'now' : '') + '"><i></i>' + (th ? TH_DOW : EN_DOW)[x.getDay()].slice(0, th ? 3 : 2) + '</span>'); }
      return '<span class="ev-dots" aria-hidden="true">' + out.join('') + '</span>';
    }
    function who(fam, cap, th){
      return '<div class="ev-who">' + players.map(n => { const k = Math.min(fam.by && fam.by[n] || 0, cap || 1e9);
        return '<span class="' + (k ? '' : 'zero') + '" style="--c:' + col[n] + '"><canvas data-av="' + esc(n) + '" width="52" height="52"></canvas>' + esc(n) + (k ? ' ×' + k : ' · ' + (th ? 'มาช่วยได้นะ' : 'can join')) + '</span>'; }).join('') + '</div>';
    }
    function pips(fam, cap, ink){
      const p = pipList(fam, players, cap);
      if(p.length > 30){ const parts = players.map(n => '<i style="--c:' + col[n] + ';width:' + (Math.min(fam.by[n] || 0, cap || 1e9) / fam.need * 100) + '%"></i>').join(''); return '<div class="ev-pips"><div class="ev-bar" style="flex:1">' + parts + '</div><b>' + fam.have + ' / ' + fam.need + '</b></div>'; }
      return '<div class="ev-pips" role="img" aria-label="' + fam.have + ' of ' + fam.need + '">' + p.map((n, i) => '<i class="' + (n ? 'f pop' : '') + '" style="' + (n ? '--c:' + col[n] + ';animation-delay:' + (i * 40) + 'ms' : '') + '"></i>').join('') + '<b>' + fam.have + ' / ' + fam.need + '</b></div>';
    }
    function paint(){
      const th = lg === 'th';
      card.classList.toggle('th', th); el.querySelectorAll('.ev-lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lg));
      $('.ev-ttl h3').textContent = d ? (th ? d.th : d.en) : w.icon + ' ' + (th ? w.th : w.en);
      $('.ev-alt').innerHTML = d ? esc(th ? d.en : d.th) + (d.zh ? '<span class="zh">' + esc(d.zh) + '</span>' : '') : esc(th ? w.en : w.th);
      $('.ev-when').innerHTML = '<span class="wd">' + esc(d ? span(d.from, d.to, th) : span(w.from, w.to, th)) + '</span> ' + (d ? dots(d.from, d.to, ev.today, th) : dots(w.from, w.to, ev.today, th));
      const feel = d && d.feel ? d.feel : {en: 'Science is trying, wondering and trying again — together it is twice the fun.', th: 'วิทยาศาสตร์คือการลอง สงสัย แล้วลองใหม่ — ทำด้วยกันสนุกเป็นสองเท่า'};
      $('.ev-feel p').innerHTML = '<small>' + (th ? '💭 ความรู้สึกของวันนี้' : '💭 TODAY\'S FEELING') + '</small>' + esc(th ? feel.th : feel.en);
      const goals = [];
      if(d && d.family){ const f = d.family;
        goals.push('<section class="ev-goal" data-g="day" style="--g-a:' + Ld.a + ';--g-b:' + Ld.b + ';--g-ink:' + Ld.ink + '"><h4>' + esc(d.icon) + ' ' + esc(th ? 'เป้าหมายของวันนี้' : "Today's family goal") + '<span class="gk">' + esc(span(d.from, d.to, th)) + '</span></h4>' +
          '<p class="gl">' + esc(dayGoalLine(d, th)) + (th ? ' — ทุกคนช่วยกัน' : ' — everyone helps') + '</p>' + ('<canvas class="ev-scene" data-scene="' + (Ld.scene || 'jar') + '" data-g="day" aria-hidden="true"></canvas>') + pips(f, d.goal.n) + who(f, d.goal.n, th) +
          '<div class="ev-row"><span class="ev-gift">' + (f.done ? '<span class="ev-done">' + (th ? '🎉 ทำสำเร็จด้วยกันแล้ว!' : '🎉 Done together!') + '</span> ' : '') + (th ? 'เมื่อสำเร็จ: <b>🛣️ +5 ไมล์</b> ทุกคนที่ช่วย · <b>🎟️ แสตมป์' + esc(short(d, true)) + '</b>' : 'When we finish: <b>🛣️ +5 miles</b> for every helper · <b>🎟️ ' + esc(short(d, false)) + ' stamp</b>') + '</span>' +
          '<button class="ev-play alt" data-go="gameroom" data-sound="nav">▶ ' + (th ? 'เลือกเกม' : 'Pick a game') + '</button></div></section>'); }
      if(w.family){ const f = w.family, gn = w.gname || w.game;
        goals.push('<section class="ev-goal" data-g="week" style="--g-a:' + Lw.a + ';--g-b:' + Lw.b + ';--g-ink:' + Lw.ink + '"><h4>' + (d ? esc(w.icon) + ' ' + esc(th ? w.th : w.en) : '🤝 ' + (th ? 'เป้าหมายครอบครัวสัปดาห์นี้' : "This week's family goal")) + '<span class="gk">' + esc(span(w.from, w.to, th)) + '</span></h4>' +
          '<div class="ev-steam" aria-hidden="true">' + 'STEAMP'.split('').map(L => '<span class="' + (L === w.letter ? 'on' : '') + '">' + (L === 'P' ? '🎮' : L) + '</span>').join('') + '</div>' +
          '<p class="gl">' + esc(w.gicon || '') + ' ' + esc(sized(th ? w.goal.th : w.goal.en, f.need)) + '</p>' + ('<canvas class="ev-scene" data-scene="' + (Lw.scene || 'jar') + '" data-g="week" aria-hidden="true"></canvas>') + pips(f) + who(f, 0, th) +
          '<div class="ev-row"><span class="ev-gift">' + (th ? 'ทั้งสัปดาห์: <b>⚡ ไมล์ ×2</b> ใน ' + esc(gn) + ' · เมื่อสำเร็จ <b>🛣️ +10 ไมล์</b> ทุกคนที่ช่วย · <b>🎟️ แสตมป์สัปดาห์</b>' : 'All week: <b>⚡ ×2 miles</b> in ' + esc(gn) + ' · when we finish <b>🛣️ +10 miles</b> for every helper · <b>🎟️ week stamp</b>') + '</span>' +
          '<button class="ev-play" data-go="' + esc(w.route || w.game) + '" data-id="' + esc(w.game) + '" data-sound="nav">▶ ' + (th ? 'เล่น ' : 'Play ') + esc(gn) + '</button></div></section>'); }
      $('.ev-goals').innerHTML = goals.join('');
      const fact = d ? (th ? (d.factTh || d.fact) : d.fact) : (Lw.fact ? Lw.fact[th ? 1 : 0] : ''), nx = (ev.next || []).slice(0, 2).map(x => x.icon + ' ' + fmt(x.from, th)).join(' · ');
      $('.ev-foot').innerHTML = (fact ? '<span class="fact">🃏 ' + (th ? 'รู้ไหม? ' : 'Did you know? ') + esc(fact) + '</span>' : '<span class="fact"></span>') + (nx ? '<span class="next">' + (th ? 'ต่อไป: ' : 'Next: ') + esc(nx) + '</span>' : '');
      el.querySelectorAll('.ev-who canvas[data-av]').forEach(cv => { const n = cv.dataset.av, g = cv.getContext('2d'); g.clearRect(0, 0, 52, 52);
        try { const k = 52 / 62; drawAvatar(g, {name: '', av: o.avatarOf(n), dir: 1, walkT: 0}, 26, 52 + 38 * k, k, {t: 1, still: true, noShadow: true, pose: {eyes: 'happy'}}); } catch(e){ g.fillStyle = col[n]; g.font = "700 26px 'Fredoka',sans-serif"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(n.charAt(0), 26, 28); } });
      scenes.length = 0; el.querySelectorAll('canvas.ev-scene').forEach(cv => { const fam = cv.dataset.g === 'day' ? d.family : w.family; scenes.push({cv, fn: SCENES[cv.dataset.scene], L: look(cv.dataset.g === 'day' ? d.id : w.letter), pips: pipList(fam, players, cv.dataset.g === 'day' ? d.goal.n : 0), done: fam.done}); });
      fit(); LOG.push('sheet:paint:' + lg);
    }
    function fit(){ card.classList.remove('f1', 'f2', 'f3', 'f4', 'f5'); for(const f of ['f1', 'f2', 'f3', 'f4', 'f5']){ if(card.scrollHeight <= card.clientHeight + 1) break; card.classList.add(f); } }
    const calm = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){ return false; } })();
    let raf = 0;
    function frame(){ if(!el.isConnected) return; if(!calm) raf = requestAnimationFrame(frame); const t = performance.now() / 1000 + (o.t0 || 0), dpr = Math.min(2, window.devicePixelRatio || 1);
      scenes.forEach(s => { if(!s.fn) return; const r = s.cv.getBoundingClientRect(); if(!r.width) return; const W = Math.round(r.width * dpr), H = Math.round(r.height * dpr); if(s.cv.width !== W || s.cv.height !== H){ s.cv.width = W; s.cv.height = H; }
        const g = s.cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); s.fn(g, r.width, r.height, calm ? 2.5 : t, s.pips, col, s.done, s.L); }); }
    el.addEventListener('click', e => { const l = e.target.closest('.ev-lang button'); if(l){ lg = l.dataset.l; if(window.Motto) Motto.setLang(me, lg); paint(); return; }
      const p = e.target.closest('[data-go]'); if(p){ LOG.push('sheet:go:' + p.dataset.go); close(); if(o.go) o.go(p.dataset.go, p.dataset.id || p.dataset.go); return; }
      if(e.target.closest('.ev-x') || !e.target.closest('.ev-card')) close(); });
    const key = e => { if(e.key === 'Escape'){ e.stopPropagation(); close(); } }; document.addEventListener('keydown', key, true);
    const rs = () => fit(); addEventListener('resize', rs);
    function close(){ if(!el.isConnected) return; cancelAnimationFrame(raf); document.removeEventListener('keydown', key, true); removeEventListener('resize', rs); el.remove(); OPEN = null; LOG.push('sheet:close'); if(o.onClose) o.onClose(); }
    paint(); raf = requestAnimationFrame(frame); LOG.push('sheet:open');
    OPEN = {el, close, paint}; return OPEN;
  }
  E.ui = {chip, newsCards, paintNews, sheet, badge, look, colours, LOOK, LOG, VERSION: 'b5b'};
})(window.Events);
