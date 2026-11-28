
/* 🐾 AvateerPets — window.AvPets (av-pet1, 🧳 Avateer Development chat, 2026-11-28 · plan "Avateer — Island 1 slice plan.md" §🐾 av-pet1 pet1-2 … pet1-6 · look test av-pet1p, Aowu OK 02:39).
   ① 🐾 Main 1b "Three Little Friends": 3 starters hide around Landing (🔥 by the warm stove · 💧 in the well bucket · 🌱 in the rice field) → walk up → 👀 meet card → 🍖 treat → its trick + ❤️ Friends!
      → all 3 play at Noi's yard → Noi draws the 🔥 › 🌱 › 💧 circle → 🔀 choose card → 🏷️ name (optional) → the pet house lights up · the other two stay at the yard (Tara takes the counter after r1).
   ② ❤️ Taming = the friend meter (replaces the 1-in-8 roll): 😌 calm (🕊️ walk slowly into its ring on the map · 💤 tired in a fight) +25 · 🍖 treat +25 / 🥭 favourite +50 · 🎵 Friend Tune good +25 / perfect +50
      · full heart = a friend (100 · ⭐ elite / ✨ rare = a bigger heart 125) · a missed tune = it tilts its head, try again · 🌱 / 💡 help: the treat is used only when it becomes your friend.
   ③ 🎥 Camera = follow + 👀 peek (one-finger drag looks around, the hero stays; 🎥 av-fix2: let go → the camera STAYS (free look, the whole islet) and locks back when the hero moves or you tap the "You ➤" face)
      + 📍 Show me (on the goal pill: glide to the goal, the pin bounces, glide back · 🌱 once by itself per new goal) + 🔒 story lock (talks frame the speaker + you).
   Pure (node-safe, no DOM at load): AvPets.meterNeed · meterFill · tuneBeats · tuneWindows · tuneJudge · FAV · HIDE · YARD.
   UI: meet · choose · nameCard · tame (map + battle) · practice (🎵 with Pudding) · tune — each a Promise; AvPets.last = test handle.
   Page glue: PETS = AvPets.install(api) → {boot, step(dt), frame(), afterTalk(full, r), onStep(r), goal(), showBtn(q), lock(obj), free(), migrate(), yardIds()}.
   Include AFTER AvateerBattle (PETS rows · JOBS) + CreatureKit + AvatarKit. Test: Test Harness/rounds/av-pet1/pet1.test.js.
   🐾 av-pet2 (2026-11-28): friendsKit — 🚶 2 pets + 🐘 Pudding walk with you (🏠 "Pudding stays home" in the 🎒 bag) · 🐘 Ask Pudding at the island's gimmick spots (FR_SPOTS) · 🫧 idle gimmicks (family + signature, FR_FAM / FR_SIG). Test: rounds/av-pet2/pet2.test.js. */
(function(){
'use strict';
if(window.AvPets) return;
const VERSION = 'av-pet1', TAU = Math.PI * 2;
const WORDS = {
  en: {treat: '🍖 Give a treat', friends: 'Friends!', nextOne: 'Find the next one ▶', allFound: 'Back to Grandma Noi ▶', trick: 'Trick', skill: 'First skill', hiding: 'is hiding',
    chooseH: 'Who will travel with you?', chooseS: 'The other two stay at Noi’s yard — visit any time!', circleS: 'each one beats the next', again: '↩ Look again', pick: '✅ {pet}, let’s go!', pickNo: 'Tap a friend', picksYou: '{pet} picks you too! ❤️',
    nameH: 'Give your friend a name', nameS: 'Or keep the name it has', ok: '✅ That’s it!', skip: 'Keep “{pet}”', bad: 'Try another name 🙂',
    heart: 'Friend heart', calm: 'Calm', snack: 'Treat', tune: 'Tune', fav: 'favourite', anyT: 'treat', noSnack: '🤲 No snack', tuneH: '🎵 Friend Tune', tap: 'Tap!', go: 'Start', ready: 'Tap ▶ — then tap on each note', perfect: 'Perfect!', good: 'Good!', miss: 'Oops!',
    tryAgain: '🎵 Try the tune again', later: '↩ Later', tilt: 'It tilts its head… try again — it’s listening!', tired: '💤 tired', calmOk: 'calm', calmNo: 'not calm',
    pickSnack: 'Pick a snack', sneak: '🐢 Walk slowly…', backs: 'It backed away — slower!', learnH: '🎵 Learn the Friend Tune', learnS: 'Tap when the note reaches the circle — Pudding sings along!', learned: 'You know the Friend Tune!',
    peek: '👀 Looking around', peekS: 'walk to come back', you: 'You', showMe: '📍 Show me', newFriend: 'New friend!', yardH: 'Noi’s yard',
    pets: {emberpup: {p: 'Brave + warm', where: 'by the warm stove', trick: 'Spark Sneeze', tr: 'Achoo — tiny sparks!', hi: 'A warm little sneeze — sparks everywhere!'},
           splashell: {p: 'Bubbly + calm', where: 'in the well bucket', trick: 'Bubble Ring', tr: 'Blows a bubble ring', hi: 'It blows you a ring of bubbles!'},
           leaflop: {p: 'Bouncy + kind', where: 'in the rice field', trick: 'Leaf Hop', tr: 'Boing — leaves fly!', hi: 'Boing! Leaves fly everywhere!'}},
    el: {fire: '🔥 Fire', water: '💧 Water', leaf: '🌱 Leaf'}, names: {emberpup: ['Sparky', 'Ember', 'Toasty', 'Blaze', 'Cinder'], splashell: ['Bubbles', 'Puddle', 'Shelly', 'Splash', 'Drip'], leaflop: ['Sprout', 'Clover', 'Hoppy', 'Basil', 'Mint']}},
  th: {treat: '🍖 ให้ขนม', friends: 'เป็นเพื่อนกันแล้ว!', nextOne: 'ไปหาตัวต่อไป ▶', allFound: 'กลับไปหายายน้อย ▶', trick: 'ท่าเด็ด', skill: 'ท่าแรก', hiding: 'แอบอยู่',
    chooseH: 'ใครจะเดินทางไปกับเธอ?', chooseS: 'อีกสองตัวอยู่ที่คอกยายน้อย มาเยี่ยมได้ทุกเมื่อ!', circleS: 'แต่ละตัวชนะตัวถัดไป', again: '↩ ดูอีกที', pick: '✅ {pet} ไปด้วยกันนะ!', pickNo: 'แตะเลือกเพื่อน', picksYou: '{pet} ก็เลือกเธอ! ❤️',
    nameH: 'ตั้งชื่อให้เพื่อนใหม่', nameS: 'หรือใช้ชื่อเดิมก็ได้', ok: '✅ ชื่อนี้แหละ!', skip: 'ใช้ชื่อ “{pet}”', bad: 'ลองชื่ออื่นนะ 🙂',
    heart: 'หัวใจเพื่อน', calm: 'ใจเย็น', snack: 'ขนม', tune: 'เพลง', fav: 'ของโปรด', anyT: 'ขนม', noSnack: '🤲 ไม่มีขนม', tuneH: '🎵 เพลงเพื่อนรัก', tap: 'แตะ!', go: 'เริ่ม', ready: 'แตะ ▶ แล้วแตะตามโน้ตทีละตัว', perfect: 'เป๊ะ!', good: 'ดี!', miss: 'อุ๊ย!',
    tryAgain: '🎵 ร้องอีกที', later: '↩ ไว้ทีหลัง', tilt: 'มันเอียงหัว… ลองอีกทีนะ มันฟังอยู่!', tired: '💤 เหนื่อย', calmOk: 'ใจเย็น', calmNo: 'ยังไม่ใจเย็น',
    pickSnack: 'เลือกขนม', sneak: '🐢 ค่อย ๆ เดิน…', backs: 'มันถอยหนี — ช้าลงอีกนิด!', learnH: '🎵 หัดเพลงเพื่อนรัก', learnS: 'แตะตอนโน้ตมาถึงวงกลม — พุดดิ้งร้องตาม!', learned: 'เธอร้องเพลงเพื่อนรักได้แล้ว!',
    peek: '👀 มองไปรอบ ๆ', peekS: 'เดินเพื่อกลับมา', you: 'เธอ', showMe: '📍 พาไปดู', newFriend: 'เพื่อนใหม่!', yardH: 'คอกยายน้อย',
    pets: {emberpup: {p: 'กล้าและอบอุ่น', where: 'ข้างเตาอุ่น ๆ', trick: 'จามไฟ', tr: 'ฮัดชิ่ว — ประกายไฟเล็ก ๆ!', hi: 'จามอุ่น ๆ ทีเดียว ประกายไฟเต็มเลย!'},
           splashell: {p: 'ฟองฟู่และใจเย็น', where: 'ในถังบ่อน้ำ', trick: 'วงฟอง', tr: 'เป่าฟองเป็นวงกลม', hi: 'มันเป่าฟองเป็นวงให้เธอ!'},
           leaflop: {p: 'กระโดดเก่งและใจดี', where: 'ในนาข้าว', trick: 'กระโดดใบไม้', tr: 'ดึ๋ง — ใบไม้ปลิว!', hi: 'ดึ๋ง! ใบไม้ปลิวเต็มเลย!'}},
    el: {fire: '🔥 ไฟ', water: '💧 น้ำ', leaf: '🌱 ใบไม้'}, names: {emberpup: ['ไฟน้อย', 'ถ่านแดง', 'ปิ้งปิ้ง', 'เปลวไฟ', 'อุ่นอุ่น'], splashell: ['ฟองฟู่', 'จุ๋มจิ๋ม', 'เปลือกใส', 'ซ่าซ่า', 'หยดน้ำ'], leaflop: ['ใบเตย', 'ต้นกล้า', 'ดึ๋งดึ๋ง', 'โหระพา', 'มินต์']}}};
const EL_COL = {fire: ['#FF8A2A', '#FFE0C2', '#C85F12'], water: ['#2EA7E0', '#D4F1FF', '#1B6E99'], leaf: ['#3DBE5C', '#DDF7D6', '#22843A']};
const ORDER = ['emberpup', 'splashell', 'leaflop'];
/* 📍 where they hide (map v2 cells, Landing) + Noi's yard (plan pet1-2) */
const HIDE = {emberpup: {x: 22.15, y: 101.7, face: 'left', near: 'cook station'}, splashell: {x: 22.55, y: 104.85, face: 'right', scale: 0.85, near: 'well'}, leaflop: {x: 3.6, y: 113.4, face: 'right', near: 'rice field'}};
const YARD = {noi: {x: 10.4, y: 99.0}, spots: [{x: 12.2, y: 98.6}, {x: 13.1, y: 99.1}, {x: 12.6, y: 99.9}]};
/* ❤️ the friend meter (plan pet1-3) — pure */
const FAV = {mangobble: 'mango', kaikai: 'rice', paddypinch: 'fish', emberpup: 'meat', splashell: 'fish', leaflop: 'rice'};
const SNACK_ICON = {mango: '🥭', rice: '🌾', fish: '🐟', meat: '🍖'};
function meterNeed(o){ o = o || {}; return o.elite || o.rare ? 125 : 100; }
function meterFill(o){ o = o || {}; const start = Math.min(20, Math.floor((o.charm || 0) / 2));   /* 💖 Charm: +1 % per 2 Charm (cap 20) */
  return start + (o.calm ? 25 : 0) + (o.treat === 'fav' ? 50 : o.treat === 'any' ? 25 : 0) + (o.tune === 'perfect' ? 50 : o.tune === 'good' ? 25 : 0); }
function tuneBeats(help, o){ o = o || {}; const base = {guide: 3, tips: 4, none: 5}[help] || 3; return base + Math.min(2, o.notes || 0) + (o.elite || o.rare ? 1 : 0); }
function tuneWindows(help){ return {guide: {p: 0.14, g: 0.32, gap: 0.8}, tips: {p: 0.11, g: 0.25, gap: 0.68}, none: {p: 0.09, g: 0.2, gap: 0.58}}[help] || {p: 0.14, g: 0.32, gap: 0.8}; }
function tuneJudge(offs, help){ const W = tuneWindows(help); if(!offs || !offs.length || offs.some(d => d == null || d > W.g)) return 'miss';
  return offs.filter(d => d <= W.p).length >= Math.ceil(offs.length * 2 / 3) ? 'perfect' : 'good'; }

let L = 'en'; const w = k => (WORDS[L][k] != null ? WORDS[L][k] : WORDS.en[k]);
const sub = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => o[k] != null ? o[k] : m);
const now = () => window.AP_T != null ? window.AP_T : performance.now() / 1000;
const petName = id => { const N = window.AvBattle && AvBattle.PETS[id]; return N ? (L === 'th' ? N.th : N.names[0]) : creatureName(id); };
const creatureName = id => { const d = window.Creatures && Creatures.get(id); return d ? d.name : id; };
const elOf = id => (window.AvBattle && AvBattle.PETS[id] ? AvBattle.PETS[id].el : ((window.Creatures && Creatures.get(id)) || {}).el || 'leaf');
const fast = () => !!(window.AV_FAST || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
function tone(f, d, o){ try { if(window.UISound && UISound.tone) UISound.tone(f, d, o || {}); } catch(e){} }
function sound(k){ try { if(window.UISound) UISound.play(k); } catch(e){} }

const CSS = [
  '.ap-ov{position:absolute;inset:0;z-index:64;display:flex;align-items:center;justify-content:center;padding:10px;background:rgba(60,110,160,.30);font-family:Fredoka,Nunito,sans-serif;color:#2B2D42;}',
  'body.th .ap-ov,body.th .ap-hud{font-family:Fredoka,var(--th,Sarabun),sans-serif;}',
  '.ap-card{position:relative;width:min(760px,100%);max-height:100%;display:flex;flex-direction:column;gap:10px;padding:14px 16px;overflow:hidden;}',
  '.ap-head{display:flex;align-items:center;gap:10px;} .ap-head h2{margin:0;flex:1;font-family:"Baloo 2",Fredoka,var(--th,Sarabun);font-size:1.45rem;line-height:1.1;} .ap-head small{display:block;font:600 .85rem Fredoka,var(--th,Sarabun);color:#5B6480;}',
  '.ap-dots{display:flex;gap:6px;align-items:center;font-weight:700;font-size:.85rem;color:#5B6480;} .ap-dots i{width:26px;height:26px;border-radius:50%;background:#E3EEF8;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:15px;} .ap-dots i.on{background:#FFE08A;box-shadow:0 0 0 3px #FFC21A;}',
  '.ap-meet{display:flex;gap:14px;align-items:stretch;} .ap-stage{flex:0 0 46%;border-radius:20px;position:relative;overflow:hidden;min-height:230px;} .ap-stage canvas{position:absolute;inset:0;width:100%;height:100%;}',
  '.ap-info{flex:1;display:flex;flex-direction:column;gap:8px;justify-content:center;min-width:0;} .ap-info h3{margin:0;font-family:"Baloo 2",Fredoka,var(--th,Sarabun);font-size:2rem;line-height:1;}',
  '.ap-chips{display:flex;flex-wrap:wrap;gap:6px;} .ap-chip{display:inline-flex;align-items:center;gap:4px;border-radius:12px;padding:3px 10px;font-weight:700;font-size:.9rem;color:#fff;white-space:nowrap;}',
  '.ap-row{display:flex;gap:8px;align-items:center;background:#F4FBFF;border-radius:14px;padding:6px 10px;font-weight:600;font-size:.95rem;} .ap-row b{font-weight:800;} .ap-row .ic{font-size:1.35rem;}',
  '.ap-foot{display:flex;gap:10px;align-items:center;justify-content:flex-end;flex-wrap:wrap;} .ap-foot .grow{flex:1;font-weight:600;font-size:.85rem;color:#5B6480;min-width:0;} .ap-foot .candy{min-height:48px;font-size:1.05rem;}',
  '.ap-pop{position:absolute;left:50%;top:8px;transform:translateX(-50%) rotate(-4deg);background:#fff;border-radius:14px;padding:3px 12px;font:800 1.05rem "Baloo 2",Fredoka,var(--th,Sarabun);color:#E5484D;box-shadow:0 4px 0 rgba(229,72,77,.3);white-space:nowrap;animation:ap-pop .5s ease-out;}',
  '@keyframes ap-pop{0%{transform:translateX(-50%) scale(.3) rotate(-4deg);opacity:0;}70%{transform:translateX(-50%) scale(1.12) rotate(-4deg);opacity:1;}100%{transform:translateX(-50%) scale(1) rotate(-4deg);}}',
  '.ap-pick{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;} .ap-pet{position:relative;border:none;border-radius:20px;background:linear-gradient(180deg,#fff,#EEF7FF);box-shadow:0 5px 0 #B9D3EC;padding:8px 8px 10px;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;font:inherit;color:#2B2D42;min-width:0;transition:transform .15s;}',
  '.ap-pet canvas{width:100%;height:150px;border-radius:16px;} .ap-pet b{font-family:"Baloo 2",Fredoka,var(--th,Sarabun);font-size:1.3rem;line-height:1;} .ap-pet small{font-weight:600;font-size:.82rem;color:#5B6480;text-align:center;line-height:1.15;} .ap-pet .tx{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;}',
  '.ap-pet.sel{background:linear-gradient(180deg,#FFF6D6,#FFE08A);box-shadow:0 5px 0 #D9A520,0 0 0 4px #FFC21A,0 0 26px rgba(255,194,26,.65);transform:translateY(-4px);} .ap-pet.sel::after{content:"✔";position:absolute;right:8px;top:8px;width:28px;height:28px;border-radius:50%;background:#22A867;color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;}',
  '.ap-pet.dim{opacity:.78;filter:saturate(.8);}',
  '.ap-circ{display:flex;align-items:center;gap:10px;justify-content:center;} .ap-circ canvas{width:150px;height:92px;flex:0 0 auto;} .ap-circ span{font-weight:700;font-size:.95rem;color:#5B6480;max-width:200px;line-height:1.3;}',
  '.ap-name{width:min(440px,100%);text-align:center;align-items:center;} .ap-name canvas{width:220px;height:150px;} .ap-name input{width:100%;min-width:0;font:700 1.45rem Fredoka,var(--th,Sarabun);text-align:center;padding:10px 12px;border-radius:16px;border:3px solid #FFC21A;outline:none;background:#FFFBEA;color:#2B2D42;}',
  '.ap-name .ap-in{display:flex;gap:8px;width:100%;} .ap-name .ap-in .candy{font-size:1.3rem;min-width:54px;} .ap-shake{animation:ap-shake .35s;} @keyframes ap-shake{25%{transform:translateX(-6px);}75%{transform:translateX(6px);}}',
  /* ❤️ tame card */
  '.ap-tame{width:min(620px,100%);} .ap-tame .ap-tw{display:flex;gap:12px;align-items:center;} .ap-tame .ap-heart{width:96px;height:88px;flex:0 0 auto;} .ap-tame .ap-mon{flex:1;height:130px;min-width:0;border-radius:18px;}',
  '.ap-steps{display:flex;gap:6px;flex-wrap:wrap;} .ap-steps .s{display:flex;align-items:center;gap:4px;border-radius:11px;padding:3px 9px;font-weight:700;font-size:.85rem;background:#EEF2F7;color:#7A8299;white-space:nowrap;} .ap-steps .s.on{background:#FFE1EC;color:#C2185B;} .ap-steps .s.now{background:#FFF1B8;color:#8A5A00;box-shadow:0 0 0 2px #FFC21A;} .ap-steps .s.no{background:#F1F1F1;color:#9AA0B0;text-decoration:line-through;}',
  '.ap-act{display:flex;gap:10px;align-items:stretch;flex-wrap:wrap;justify-content:center;} .ap-act .candy{min-height:56px;font-size:1.05rem;flex:1 1 150px;} .ap-msg{text-align:center;font-weight:700;font-size:1rem;color:#5B6480;min-height:1.3em;}',
  '.ap-lane{display:flex;gap:10px;align-items:center;} .ap-act > .ap-lane{flex:1 1 100%;width:100%;} .ap-act .ap-lane .candy.go{flex:0 0 auto;} .ap-lane canvas{flex:1;height:78px;min-width:0;} .ap-lane .candy.go{min-width:96px;min-height:70px;font-size:1.25rem;border-radius:22px;line-height:1.05;}',
  '.ap-hud{position:absolute;z-index:31;font-family:Fredoka,Nunito,sans-serif;color:#2B2D42;pointer-events:none;}',
  '.ap-peek{left:50%;transform:translateX(-50%);padding:6px 14px;font-weight:800;font-size:1rem;text-align:center;} .ap-peek small{display:block;font-weight:600;font-size:.78rem;color:#5B6480;}',
  '.ap-edge{pointer-events:auto;cursor:pointer;display:flex;align-items:center;gap:6px;padding:5px 10px 5px 5px;border-radius:999px;background:#fff;box-shadow:0 4px 0 #B9D3EC;font-weight:800;font-size:.9rem;} .ap-edge canvas{width:40px;height:40px;border-radius:50%;background:linear-gradient(#DFF4FF,#BFE6FA);} .ap-edge i{font-style:normal;font-size:1.1rem;color:#FF8A2A;display:inline-block;}',
  '.ap-sneak{left:50%;transform:translateX(-50%);padding:5px 14px;font-weight:800;font-size:.95rem;}',
  '#goal .ap-show{pointer-events:auto;display:inline-flex;align-items:center;margin-left:8px;min-height:30px;padding:2px 10px;font-size:.8rem;border-radius:12px;vertical-align:middle;}',
  '@media (max-width:640px){ .ap-head{flex-wrap:wrap;} .ap-head h2{flex:1 1 100%;font-size:1.2rem;} .ap-circ{flex:1 1 100%;justify-content:flex-start;} .ap-foot .grow:not(:empty){display:none;} .ap-meet{flex-direction:column;} .ap-stage{flex:0 0 auto;min-height:200px;} .ap-info h3{font-size:1.6rem;}',
  '  .ap-pick{grid-template-columns:1fr;gap:8px;} .ap-pet{flex-direction:row;padding:6px 10px;gap:10px;text-align:left;} .ap-pet canvas{width:104px;height:86px;flex:0 0 auto;} .ap-pet .tx{align-items:flex-start;} .ap-pet small{text-align:left;} .ap-pet.sel{transform:none;}',
  '  .ap-circ canvas{width:128px;height:78px;} .ap-circ span{font-size:.78rem;} .ap-foot .candy{min-height:46px;font-size:.95rem;} .ap-lane canvas{height:64px;} .ap-lane .candy.go{min-width:78px;min-height:60px;} .ap-tame .ap-heart{width:72px;height:66px;} .ap-tame .ap-mon{height:104px;} .ap-steps .s{font-size:.76rem;padding:2px 7px;} #goal .ap-show{min-height:26px;padding:1px 8px;font-size:.74rem;} }',
  '@media (max-height:460px){ .ap-card{padding:8px 12px;gap:6px;} .ap-stage{min-height:150px;} .ap-info h3{font-size:1.4rem;} .ap-row{padding:4px 8px;font-size:.85rem;} .ap-pet canvas{height:84px;} .ap-pet b{font-size:1.1rem;} .ap-pet small{font-size:.74rem;} .ap-head h2{font-size:1.15rem;}',
  '  .ap-circ canvas{width:110px;height:66px;} .ap-foot .candy{min-height:42px;} .ap-name canvas{width:170px;height:96px;} .ap-name input{font-size:1.2rem;padding:6px;} .ap-lane canvas{height:54px;} .ap-lane .candy.go{min-height:52px;} .ap-tame .ap-mon{height:84px;} .ap-tame .ap-heart{width:64px;height:58px;} .ap-act .candy{min-height:46px;} }'].join('\n');
function css(){ if(document.getElementById('ap-css')) return; const s = document.createElement('style'); s.id = 'ap-css'; s.textContent = CSS; document.head.appendChild(s); }
function el(tag, cls, html){ const e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; }
function btn(cls, html, fn){ const b = el('button', 'candy ' + (cls || ''), html); b.setAttribute('data-sound', 'tap'); if(fn) b.onclick = e => { e.stopPropagation(); fn(e); }; return b; }
function cv(cssW, cssH){ const c = el('canvas'), d = Math.min(3, window.devicePixelRatio || 1); c.width = Math.round(cssW * d); c.height = Math.round(cssH * d); c._d = d; return c; }
function loop(c, fn){ const run = () => { if(!c.isConnected) return; const r = c.getBoundingClientRect(), d = c._d || 1;
    if(r.width && (Math.abs(c.width - r.width * d) > 2 || Math.abs(c.height - r.height * d) > 2)){ c.width = Math.round(r.width * d); c.height = Math.round(r.height * d); }
    const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height); g.scale(d, d); fn(g, c.width / d, c.height / d, now()); if(window.AP_T == null) requestAnimationFrame(run); }; requestAnimationFrame(run); setTimeout(run, 0); }
function chip(text, col){ const c = el('span', 'ap-chip', text); c.style.background = col; return c; }

/* 🎭 pet poses for the intro (CreatureKit pose objects) */
const POSE = {
  peek: {sy: 0.8, sx: 1.08, y: 5, head: 0.3, lean: 0.12, tail: -0.4, eye: 'open'},
  shy: {sy: 0.86, lean: -0.18, head: 0.34, tail: -0.5, eye: 'shut'},
  happy: {y: -10, sy: 1.06, head: -0.12, jaw: 0.6, tail: 0.6, arm: -1.4, eye: 'happy'},
  sneeze: {sy: 1.1, sx: 0.92, head: -0.32, jaw: 0.9, lean: -0.1, eye: 'shut'},
  blow: {sx: 1.05, head: 0.1, jaw: 0.35, lean: 0.08, eye: 'happy'},
  tilt: {head: 0.42, lean: 0.06, eye: 'open'},
  hop: {y: -26, sy: 1.12, sx: 0.9, fl: -0.6, bl: 0.6, tail: 0.8, head: -0.15, eye: 'happy'}};
function drawPetAt(g, id, x, y, h, o){ o = o || {}; try { (o.painted ? Creatures.drawH : Creatures.drawFor)(g, id, x, y, h, Object.assign({t: now(), face: o.face || 'right', pet: !!(window.AvBattle && AvBattle.PETS[id])}, o, {pose: o.pose ? Creatures.poseOf(Object.assign({}, POSE[o.pose] || o.pose)) : undefined})); } catch(e){} }

/* little drawn things (no emoji on canvases — 🐢 emoji lag rule) */
function heartPath(g, x, y, s){ g.beginPath(); g.moveTo(x, y + s * 0.32); g.bezierCurveTo(x - s * 0.62, y - s * 0.2, x - s * 0.3, y - s * 0.68, x, y - s * 0.3); g.bezierCurveTo(x + s * 0.3, y - s * 0.68, x + s * 0.62, y - s * 0.2, x, y + s * 0.32); g.closePath(); }
function spark(g, x, y, r, col, a){ g.save(); g.globalAlpha = a == null ? 1 : Math.max(0, a); g.fillStyle = col; g.beginPath(); for(let i = 0; i < 8; i++){ const rr = i % 2 ? r * 0.35 : r, an = i * Math.PI / 4 - Math.PI / 2; g.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } g.closePath(); g.fill(); g.restore(); }
function bubble(g, x, y, r, a){ g.save(); g.globalAlpha = a == null ? 0.85 : Math.max(0, a); g.strokeStyle = '#fff'; g.lineWidth = Math.max(1.5, r * 0.18); g.fillStyle = 'rgba(190,235,255,.35)'; g.beginPath(); g.arc(x, y, Math.max(0.5, r), 0, TAU); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, Math.max(0.3, r * 0.22), 0, TAU); g.fill(); g.restore(); }
function leaf(g, x, y, s, rot, col){ g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col || '#5CC24A'; g.beginPath(); g.moveTo(0, -s); g.quadraticCurveTo(s * 0.7, 0, 0, s); g.quadraticCurveTo(-s * 0.7, 0, 0, -s); g.fill(); g.strokeStyle = 'rgba(30,90,30,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, -s * 0.8); g.lineTo(0, s * 0.8); g.stroke(); g.restore(); }
function note(g, x, y, s, col){ g.save(); g.fillStyle = col; g.strokeStyle = col; g.lineWidth = s * 0.16; g.beginPath(); g.ellipse(x, y, s * 0.34, s * 0.26, -0.4, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x + s * 0.3, y - s * 0.05); g.lineTo(x + s * 0.3, y - s * 0.95); g.quadraticCurveTo(x + s * 0.7, y - s * 0.8, x + s * 0.62, y - s * 0.5); g.stroke(); g.restore(); }
function eyesBubble(g, x, y, s, t){ const blink = (t % 2.6) > 2.45; g.save(); g.fillStyle = '#fff'; g.strokeStyle = '#2B2D42'; g.lineWidth = Math.max(2, s * 0.07);
  g.beginPath(); g.ellipse(x, y, s * 0.75, s * 0.52, 0, 0, TAU); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x - s * 0.18, y + s * 0.46); g.lineTo(x - s * 0.34, y + s * 0.8); g.lineTo(x + s * 0.04, y + s * 0.5); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#fff'; g.fillRect(x - s * 0.22, y + s * 0.38, s * 0.3, s * 0.16);
  const look = Math.sin(t * 1.3) * s * 0.08; [-1, 1].forEach(k => { g.fillStyle = '#2B2D42'; g.beginPath(); if(blink) g.fillRect(x + k * s * 0.24 - s * 0.12, y - s * 0.02, s * 0.24, s * 0.05); else g.ellipse(x + k * s * 0.24 + look, y, s * 0.1, s * 0.16, 0, 0, TAU); g.fill();
    if(!blink){ g.fillStyle = '#fff'; g.beginPath(); g.arc(x + k * s * 0.24 + look + s * 0.03, y - s * 0.06, s * 0.035, 0, TAU); g.fill(); } }); g.restore(); }
function hearts(g, x, y, s, t, n){ for(let i = 0; i < (n || 3); i++){ const p = (t * 0.5 + i / (n || 3)) % 1; g.save(); g.globalAlpha = 1 - p; g.fillStyle = '#FF5FA2'; heartPath(g, x + (i - 1) * s * 1.1, y - p * s * 3, s); g.fill(); g.restore(); } }

/* ─── stage backdrops + trick fx (meet card) ─── */
function stageBg(g, W, H, id, t){ const E = EL_COL[elOf(id)] || EL_COL.leaf, gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, E[1]); gr.addColorStop(1, '#FFF8EC'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(W / 2, H * 0.86, W * 0.36, H * 0.07, 0, 0, TAU); g.fill();
  if(id === 'emberpup'){ const x = W * 0.8, y = H * 0.86, r = Math.min(W, H) * 0.12;
    const gl = g.createRadialGradient(x, y - r, 2, x, y - r, r * 3); gl.addColorStop(0, 'rgba(255,160,50,.55)'); gl.addColorStop(1, 'rgba(255,160,50,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
    g.fillStyle = '#B5654A'; g.strokeStyle = '#6E3A26'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x - r, y); g.lineTo(x - r * 1.15, y - r * 1.3); g.lineTo(x + r * 1.15, y - r * 1.3); g.lineTo(x + r, y); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#2B2D42'; g.beginPath(); g.ellipse(x, y - r * 0.55, r * 0.42, r * 0.3, 0, 0, TAU); g.fill(); for(let i = 0; i < 4; i++){ g.fillStyle = i % 2 ? '#FFC21A' : '#FF6A1A'; g.beginPath(); g.arc(x - r * 0.25 + i * r * 0.17, y - r * 0.5 + (i % 2) * 3, r * 0.1, 0, TAU); g.fill(); }
    g.fillStyle = '#5B6480'; g.strokeStyle = '#2B2D42'; g.beginPath(); g.ellipse(x, y - r * 1.35, r * 1.0, r * 0.22, 0, 0, TAU); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x - r * 0.9, y - r * 1.35); g.quadraticCurveTo(x - r * 0.8, y - r * 2.2, x, y - r * 2.2); g.quadraticCurveTo(x + r * 0.8, y - r * 2.2, x + r * 0.9, y - r * 1.35); g.fill(); g.stroke();
    for(let i = 0; i < 3; i++){ const p = (t * 0.4 + i / 3) % 1; g.save(); g.globalAlpha = 0.7 * (1 - p); g.fillStyle = '#fff'; g.beginPath(); g.arc(x + Math.sin(t * 2 + i) * r * 0.3, y - r * (2.4 + p * 1.6), r * (0.22 + p * 0.25), 0, TAU); g.fill(); g.restore(); } }
  if(id === 'splashell'){ const x = W * 0.82, y = H * 0.86, r = Math.min(W, H) * 0.14; g.fillStyle = '#8FA3B5'; g.strokeStyle = '#4E5D6B'; g.lineWidth = 2; g.fillRect(x - r, y - r * 1.2, r * 2, r * 1.2); g.strokeRect(x - r, y - r * 1.2, r * 2, r * 1.2); g.fillStyle = '#4FC6D8'; g.beginPath(); g.ellipse(x, y - r * 1.2, r, r * 0.3, 0, 0, TAU); g.fill(); g.strokeStyle = '#6B4A2E'; g.lineWidth = 4; g.beginPath(); g.moveTo(x - r * 0.9, y - r * 1.25); g.lineTo(x, y - r * 2.6); g.lineTo(x + r * 0.9, y - r * 1.25); g.stroke(); }
  if(id === 'leaflop'){ for(let i = 0; i < 9; i++){ const x = W * (0.06 + i * 0.11), y = H * 0.9; g.strokeStyle = i % 2 ? '#7FCB4F' : '#5CB13C'; g.lineWidth = 3; for(let j = -1; j <= 1; j++){ g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + j * 6, y - H * 0.12, x + j * 12 + Math.sin(t + i) * 3, y - H * 0.2); g.stroke(); } } } }
function trickFx(g, W, H, id, t, px, py, h){ const p = (t % 2) / 2;
  if(id === 'emberpup') for(let i = 0; i < 9; i++){ const a = -Math.PI * 0.15 - i * 0.12, d = h * (0.25 + p * 0.9), x = px + 10 + Math.cos(a) * d * (1 + i * 0.04), y = py - h * 0.62 + Math.sin(a) * d * 0.6 - i * 2; spark(g, x, y, 7 * (1 - p * 0.6), i % 2 ? '#FFC21A' : '#FF8A2A', 1 - p * 0.8); }
  if(id === 'splashell'){ const cx = px + h * 0.55, cy = py - h * 0.62, R = h * (0.22 + p * 0.3); for(let i = 0; i < 10; i++){ const a = i / 10 * TAU + t; bubble(g, cx + Math.cos(a) * R, cy + Math.sin(a) * R * 0.75, 5 + (i % 3) * 2, 1 - p * 0.6); } }
  if(id === 'leaflop') for(let i = 0; i < 8; i++){ const a = i / 8 * TAU, d = h * (0.2 + p * 0.55); leaf(g, px + Math.cos(a) * d, py - h * 0.1 + Math.sin(a) * d * 0.45 - p * h * 0.2, 7, a + t * 3, i % 2 ? '#7FD35A' : '#3DBE5C'); } }

/* ─── ① 👀 meet card: 🍖 treat → trick → ❤️ Friends! (Promise resolves when you tap ▶) ─── */
function meet(box, id, o){ css(); o = o || {}; L = o.lang === 'th' ? 'th' : 'en'; const N = AvBattle.PETS[id], P = WORDS[L].pets[id], E = EL_COL[N.el];
  const ov = el('div', 'ap-ov'), card = el('div', 'puff ap-card'); ov.appendChild(card); let friend = !!o.friend, got = (o.found || []).slice();
  return new Promise(res => {
    function render(){ card.innerHTML = ''; const head = el('div', 'ap-head'); head.appendChild(el('h2', '', (friend ? '🐾 ' : '👀 ') + petName(id) + '<small>' + (friend ? P.hi : P.where) + '</small>'));
      const dots = el('div', 'ap-dots'); ORDER.forEach(k => { const i = el('i', got.indexOf(k) >= 0 ? 'on' : ''); i.textContent = got.indexOf(k) >= 0 ? ['🔥', '💧', '🌱'][ORDER.indexOf(k)] : '?'; dots.appendChild(i); }); dots.appendChild(el('span', '', got.length + ' / 3')); head.appendChild(dots); card.appendChild(head);
      const row = el('div', 'ap-meet'), stage = el('div', 'ap-stage'), c = cv(340, 240); stage.appendChild(c); row.appendChild(stage);
      if(friend) stage.appendChild(el('div', 'ap-pop', '❤️ ' + w('friends')));
      const t0 = now(); loop(c, (g, W, H, t) => { stageBg(g, W, H, id, t); const hh = Math.min(H * 1.05, W * 0.8), px = W * 0.4, py = H * 0.88;
        if(friend){ const ph = ((t - t0) % 2) / 2, pose = id === 'emberpup' ? (ph < 0.45 ? 'sneeze' : 'happy') : id === 'splashell' ? 'blow' : (ph < 0.5 ? 'hop' : 'happy'); drawPetAt(g, id, px, py - (pose === 'hop' ? Math.sin(ph * 2 * Math.PI) * 18 : 0), hh, {pose, face: 'right'}); trickFx(g, W, H, id, t, px, py, hh); hearts(g, px - hh * 0.1, py - hh * 1.05, 14, t); }
        else { drawPetAt(g, id, px, py, hh, {pose: 'shy', face: 'right'}); g.save(); g.fillStyle = '#C98B4A'; g.strokeStyle = '#6E3A26'; g.lineWidth = 2; g.beginPath(); g.ellipse(W * 0.75, py - 6, 16, 9, -0.3, 0, TAU); g.fill(); g.stroke(); g.fillStyle = '#F6E2C0'; g.beginPath(); g.arc(W * 0.75 + 14, py - 12, 6, 0, TAU); g.fill(); g.restore(); } });
      const info = el('div', 'ap-info'); info.appendChild(el('h3', '', petName(id)));
      const chips = el('div', 'ap-chips'); chips.appendChild(chip(WORDS[L].el[N.el], E[0])); chips.appendChild(chip(P.p, '#9B5DE5')); info.appendChild(chips);
      info.appendChild(el('div', 'ap-row', '<span class="ic">✨</span><span><b>' + w('trick') + ':</b> ' + P.trick + ' — ' + P.tr + '</span>'));
      info.appendChild(el('div', 'ap-row', '<span class="ic">' + N.hit.icon + '</span><span><b>' + w('skill') + ':</b> ' + (L === 'th' ? N.hit.th : N.hit.en) + '</span>'));
      row.appendChild(info); card.appendChild(row);
      const foot = el('div', 'ap-foot'); foot.appendChild(el('div', 'grow', friend ? '' : '🍖 ×' + Math.max(0, o.treats == null ? 1 : o.treats)));
      const go = btn(friend ? 'go' : 'on', friend ? (got.length >= 3 ? w('allFound') : w('nextOne')) : w('treat'), () => {
        if(!friend){ friend = true; if(got.indexOf(id) < 0) got.push(id); sound('win'); tone(659, 0.12, {type: 'sine', gain: 0.08}); setTimeout(() => tone(988, 0.16, {type: 'sine', gain: 0.08}), 120); if(o.onTreat) o.onTreat(); render(); return; }
        ov.remove(); res({id, found: got}); });
      go.id = 'ap-go'; foot.appendChild(go); card.appendChild(foot); }
    render(); box.appendChild(ov); AvPets.last = {kind: 'meet', ov, next: () => { const b = ov.querySelector('#ap-go'); if(b) b.click(); }}; }); }

/* ─── ② 🔀 choose: 3 pets + the element circle (Promise → id) ─── */
function circle(g, W, H, t){ const pts = {fire: [W * 0.5, H * 0.2], leaf: [W * 0.82, H * 0.8], water: [W * 0.18, H * 0.8]}, r = Math.min(W, H) * 0.17, ord = ['fire', 'leaf', 'water'];
  ord.forEach((a, i) => { const b = ord[(i + 1) % 3], A = pts[a], B = pts[b], dx = B[0] - A[0], dy = B[1] - A[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d, x1 = A[0] + ux * r * 1.25, y1 = A[1] + uy * r * 1.25, x2 = B[0] - ux * r * 1.35, y2 = B[1] - uy * r * 1.35;
    g.strokeStyle = EL_COL[a][0]; g.fillStyle = EL_COL[a][0]; g.lineWidth = 3.5; g.setLineDash([6, 4]); g.lineDashOffset = -t * 18; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.setLineDash([]);
    g.beginPath(); g.moveTo(x2 + ux * 4, y2 + uy * 4); g.lineTo(x2 - ux * 9 - uy * 6, y2 - uy * 9 + ux * 6); g.lineTo(x2 - ux * 9 + uy * 6, y2 - uy * 9 - ux * 6); g.closePath(); g.fill(); });
  const icon = (k, x, y) => { g.fillStyle = EL_COL[k][1]; g.strokeStyle = EL_COL[k][0]; g.lineWidth = 3; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.stroke();
    if(k === 'fire'){ g.fillStyle = '#FF8A2A'; g.beginPath(); g.moveTo(x, y - r * 0.7); g.quadraticCurveTo(x + r * 0.7, y, x, y + r * 0.6); g.quadraticCurveTo(x - r * 0.7, y, x, y - r * 0.7); g.fill(); g.fillStyle = '#FFC21A'; g.beginPath(); g.moveTo(x, y - r * 0.15); g.quadraticCurveTo(x + r * 0.32, y + r * 0.2, x, y + r * 0.5); g.quadraticCurveTo(x - r * 0.32, y + r * 0.2, x, y - r * 0.15); g.fill(); }
    if(k === 'water'){ g.fillStyle = '#2EA7E0'; g.beginPath(); g.moveTo(x, y - r * 0.7); g.quadraticCurveTo(x + r * 0.62, y + r * 0.05, x, y + r * 0.6); g.quadraticCurveTo(x - r * 0.62, y + r * 0.05, x, y - r * 0.7); g.fill(); }
    if(k === 'leaf') leaf(g, x, y, r * 0.62, 0.6, '#3DBE5C'); };
  ord.forEach(k => icon(k, pts[k][0], pts[k][1])); }
function choose(box, o){ css(); o = o || {}; L = o.lang === 'th' ? 'th' : 'en'; let sel = o.sel || null;
  const ov = el('div', 'ap-ov'), card = el('div', 'puff ap-card'); card.style.width = 'min(880px,100%)'; ov.appendChild(card);
  return new Promise(res => {
    function render(){ card.innerHTML = ''; const head = el('div', 'ap-head'); head.appendChild(el('h2', '', '🐾 ' + w('chooseH') + '<small>' + w('chooseS') + '</small>'));
      const ci = el('div', 'ap-circ'), cc = cv(150, 92); ci.appendChild(cc); ci.appendChild(el('span', '', ['fire', 'leaf', 'water', 'fire'].map(k => WORDS[L].el[k].split(' ')[0]).join(' › ') + '<br>' + w('circleS'))); head.appendChild(ci); loop(cc, (g, W, H, t) => circle(g, W, H, t)); card.appendChild(head);
      const grid = el('div', 'ap-pick'); ORDER.forEach(id => { const N = AvBattle.PETS[id], P = WORDS[L].pets[id], E = EL_COL[N.el], on = sel === id;
        const b = el('button', 'ap-pet' + (on ? ' sel' : sel ? ' dim' : '')); b.dataset.k = id; b.setAttribute('data-sound', 'tap'); const c = cv(240, 150); b.appendChild(c); const tx = el('div', 'tx');
        tx.appendChild(el('b', '', petName(id))); const ch = el('div', 'ap-chips'); ch.appendChild(chip(WORDS[L].el[N.el], E[0])); tx.appendChild(ch);
        tx.appendChild(el('small', '', P.p + ' · ' + N.hit.icon + ' ' + (L === 'th' ? N.hit.th : N.hit.en))); b.appendChild(tx); grid.appendChild(b);
        b.onclick = () => { if(sel !== id){ sel = id; sound('pop'); tone(784, 0.1, {type: 'sine', gain: 0.07}); render(); } };
        loop(c, (g, W, H, t) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, on ? '#FFF1C2' : E[1]); gr.addColorStop(1, '#FFFFFF'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
          g.fillStyle = 'rgba(0,0,0,.07)'; g.beginPath(); g.ellipse(W / 2, H * 0.88, W * 0.25, H * 0.06, 0, 0, TAU); g.fill();
          const hh = Math.min(H * 1.05, W * 0.85), pose = on ? 'happy' : {y: -Math.abs(Math.sin(t * 2.4 + ORDER.indexOf(id))) * 6, eye: 'open', tail: Math.sin(t * 4) * 0.4};
          drawPetAt(g, id, W / 2, H * 0.88, hh, {pose, face: 'right'}); if(on) hearts(g, W / 2, H * 0.3, 13, t); }); });
      card.appendChild(grid);
      const foot = el('div', 'ap-foot'); const ag = btn('', w('again'), () => { sel = null; render(); }); ag.id = 'ap-again'; if(!sel) ag.style.visibility = 'hidden'; foot.appendChild(ag);
      foot.appendChild(el('div', 'grow', sel ? sub(w('picksYou'), {pet: petName(sel)}) : ''));
      const go = btn('go', sel ? sub(w('pick'), {pet: petName(sel)}) : w('pickNo'), () => { if(!sel) return; ov.remove(); sound('win'); res(sel); }); go.id = 'ap-go'; if(!sel){ go.disabled = true; go.style.opacity = 0.5; } foot.appendChild(go); card.appendChild(foot); }
    render(); box.appendChild(ov); AvPets.last = {kind: 'choose', ov, pick: id => { const b = ov.querySelector('.ap-pet[data-k="' + id + '"]'); if(b) b.click(); }, next: () => { const b = ov.querySelector('#ap-go'); if(b) b.click(); }}; }); }

/* ─── ③ 🏷️ name your friend (optional · ≤ 10 letters · the traveller-name rules) — Promise → name ─── */
function nameCard(box, id, o){ css(); o = o || {}; L = o.lang === 'th' ? 'th' : 'en'; const clean = o.clean || (s => String(s || '').trim().slice(0, 10)), okN = o.ok || (s => !!s);
  const ov = el('div', 'ap-ov'), card = el('div', 'puff ap-card ap-name'); ov.appendChild(card);
  card.appendChild(el('div', 'ap-head', '<h2>🏷️ ' + w('nameH') + '<small>' + w('nameS') + '</small></h2>'));
  const c = cv(220, 150); card.appendChild(c); loop(c, (g, W, H, t) => { g.fillStyle = 'rgba(0,0,0,.08)'; g.beginPath(); g.ellipse(W / 2, H * 0.92, W * 0.34, H * 0.05, 0, 0, TAU); g.fill();
    try { if(o.av) drawAvatar(g, {av: o.av, name: o.me || '', dir: 1}, W * 0.33, H * 0.94, H / 92, {t, still: true, pose: {face: 'happy'}}); } catch(e){}
    drawPetAt(g, id, W * 0.7, H * 0.94 - Math.abs(Math.sin(t * 3)) * 6, H * 0.95, {pose: 'happy', face: 'left'}); hearts(g, W * 0.52, H * 0.34, 12, t, 2); });
  const row = el('div', 'ap-in'), inp = el('input'); inp.id = 'ap-name-in'; inp.value = o.value || petName(id); inp.maxLength = 12; inp.setAttribute('aria-label', w('nameH')); row.appendChild(inp);
  let k = 0; const dice = btn('', '🎲', () => { const L2 = WORDS[L].names[id] || []; inp.value = L2[k++ % L2.length]; sound('pop'); }); dice.id = 'ap-dice'; row.appendChild(dice); card.appendChild(row);
  return new Promise(res => {
    const done = v => { ov.remove(); res(v); };
    const foot = el('div', 'ap-foot'); foot.style.width = '100%'; const sk = btn('', sub(w('skip'), {pet: petName(id)}), () => done(petName(id))); sk.id = 'ap-skip'; foot.appendChild(sk); foot.appendChild(el('div', 'grow', ''));
    const go = btn('go', w('ok'), () => { const v = clean(inp.value); if(!okN(v)){ card.classList.remove('ap-shake'); void card.offsetWidth; card.classList.add('ap-shake'); inp.value = ''; inp.placeholder = w('bad'); sound('nope'); return; } done(v || petName(id)); });
    go.id = 'ap-go'; foot.appendChild(go); card.appendChild(foot); inp.addEventListener('keydown', e => { if(e.key === 'Enter') go.click(); });
    box.appendChild(ov); AvPets.last = {kind: 'name', ov, input: inp, next: () => go.click(), skip: () => sk.click()}; }); }

/* ─── 🎵 the Friend Tune — notes slide into the circle, tap on time (Promise → {res, offs}) ─── */
function tune(host, o){ o = o || {}; const help = o.help || 'guide', W0 = tuneWindows(help), n = o.beats || tuneBeats(help, o), gap = W0.gap, lead = 1.4;
  const lane = el('div', 'ap-lane'), c = cv(420, 78); lane.appendChild(c); const tap = btn('go', '🎵<br>' + w('tap')); tap.id = 'ap-tap'; lane.appendChild(tap); host.appendChild(lane);
  const hits = new Array(n).fill(null), judged = new Array(n).fill(''), times = Array.from({length: n}, (_, i) => lead + i * gap); let t0 = 0, started = false, over = false, played = -1, wob = 0, fin;
  const T = () => started ? performance.now() / 1000 - t0 : -lead;   /* the song waits for your first tap (▶ start) — nobody misses a note while reading */
  tap.innerHTML = '▶<br>' + w('go');
  const pitch = [523, 587, 659, 784, 880, 988, 1047];
  function start(){ if(started) return; started = true; t0 = performance.now() / 1000; tap.innerHTML = '🎵<br>' + w('tap'); tone(392, 0.12, {type: 'sine', gain: 0.06}); }
  function press(){ if(over) return; if(!started){ start(); return; } const t = T(); let bi = -1, bd = 9; times.forEach((x, i) => { if(hits[i] == null && Math.abs(t - x) < bd){ bd = Math.abs(t - x); bi = i; } });
    if(bi >= 0 && bd <= W0.g){ hits[bi] = bd; judged[bi] = bd <= W0.p ? 'p' : 'g'; tone(pitch[bi % pitch.length], 0.16, {type: 'triangle', gain: 0.09}); if(o.onHit) o.onHit(judged[bi]); } else { wob = 0.3; tone(220, 0.06, {type: 'square', gain: 0.03}); } }
  tap.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); press(); });
  const key = e => { if(e.code === 'Space' || e.code === 'Enter'){ e.preventDefault(); press(); } }; addEventListener('keydown', key);
  loop(c, (g, W, H) => { const t = T(), y = H / 2, hx = Math.min(64, W * 0.16), span = W - hx, v = span / (gap * 3.2);
    if(!over && played < n - 1 && t >= times[played + 1] - 0.02){ played++; tone(pitch[played % pitch.length] / 2, 0.1, {type: 'sine', gain: 0.05}); }
    g.fillStyle = '#EEF6FF'; g.beginPath(); g.roundRect(0, y - H * 0.32, W, H * 0.64, H * 0.32); g.fill();
    for(let i = 0; i < 12; i++){ g.fillStyle = 'rgba(155,93,229,.12)'; g.beginPath(); g.arc(hx + 30 + i * span / 12, y, 2.5, 0, TAU); g.fill(); }
    if(wob > 0) wob -= 1 / 60; g.strokeStyle = '#9B5DE5'; g.lineWidth = 4; g.beginPath(); g.arc(hx + Math.sin(wob * 40) * 3 * (wob > 0), y, H * 0.3, 0, TAU); g.stroke(); g.fillStyle = 'rgba(155,93,229,.15)'; g.fill();
    for(let i = 0; i < n; i++){ if(judged[i]){ const age = t - times[i]; if(age < 0.9){ g.save(); g.globalAlpha = 1 - age / 0.9; g.fillStyle = judged[i] === 'p' ? '#22A867' : '#E0A000'; g.font = '800 ' + Math.round(H * 0.24) + 'px Fredoka, Sarabun, sans-serif'; g.textAlign = 'center'; g.fillText(judged[i] === 'p' ? w('perfect') : w('good'), hx, y - H * 0.36 - age * 10); g.restore(); } continue; }
      const x = hx + (times[i] - t) * v; if(x > W + 24 || x < -30) continue; const col = ['#9B5DE5', '#FF5FA2', '#2EA7E0', '#FF8A2A', '#3DBE5C', '#E5484D', '#FFB21A'][i % 7];
      g.fillStyle = '#fff'; g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.arc(x, y, H * 0.24, 0, TAU); g.fill(); g.stroke(); note(g, x - 2, y + H * 0.1, H * 0.3, col); }
    for(let i = 0; i < n; i++){ g.fillStyle = judged[i] ? (judged[i] === 'p' ? '#22A867' : '#FFC21A') : (t > times[i] + W0.g ? '#E5484D' : '#D6E2EE'); g.beginPath(); g.arc(W - 12 - (n - 1 - i) * 14, H * 0.12, 4.5, 0, TAU); g.fill(); }
    if(!started){ g.save(); g.fillStyle = '#5B6480'; g.font = '700 ' + Math.round(H * 0.2) + 'px Fredoka, Sarabun, sans-serif'; g.textAlign = 'center'; g.fillText(w('ready'), (hx + W) / 2, H * 0.95); g.restore(); }
    if(!over && started && t > times[n - 1] + W0.g + 0.35) finish(); });
  function finish(){ if(over) return; over = true; removeEventListener('keydown', key); const res = tuneJudge(hits, help); setTimeout(() => { lane.remove(); fin({res, offs: hits.slice()}); }, fast() ? 60 : 420); }
  const P = new Promise(r => { fin = r; });
  P.api = {press, start, auto(q){ start(); for(let i = 0; i < n; i++){ hits[i] = q === 'miss' && i === n - 1 ? null : q === 'good' ? W0.g * 0.9 : 0.02; judged[i] = hits[i] == null ? '' : hits[i] <= W0.p ? 'p' : 'g'; } finish(); }, n, times, start: () => t0};
  return P; }

/* ─── ❤️ the friend meter card (map + battle) — Promise → {res: 'tamed'|'later', snack: 'fav'|'any'|null, tune} ─── */
function heartCv(c, get){ loop(c, (g, W, H, t) => { const f = Math.min(1, get()), s = Math.min(W, H) * 0.98; g.save(); g.fillStyle = '#FFE6EE'; g.strokeStyle = '#FF5FA2'; g.lineWidth = 3; heartPath(g, W / 2, H * 0.5, s); g.fill(); g.save(); g.clip();
    const top = H * 0.5 + s * 0.32 - (s * 0.98) * f, gr = g.createLinearGradient(0, top, 0, H); gr.addColorStop(0, '#FF7BB8'); gr.addColorStop(1, '#E5306E'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, top + Math.sin(t * 4) * 2); for(let x = 0; x <= W; x += 4) g.lineTo(x, top + Math.sin(t * 4 + x * 0.2) * 2); g.lineTo(W, H); g.lineTo(0, H); g.fill(); g.restore();
    heartPath(g, W / 2, H * 0.5, s); g.stroke(); g.fillStyle = '#fff'; g.font = '800 ' + Math.round(H * 0.22) + 'px Fredoka, sans-serif'; g.textAlign = 'center'; g.strokeStyle = 'rgba(160,20,80,.6)'; g.lineWidth = 3; const tx = Math.round(get() * 100) + '%'; g.strokeText(tx, W / 2, H * 0.52); g.fillText(tx, W / 2, H * 0.52); g.restore(); }); }
function tame(box, o){ css(); o = o || {}; L = o.lang === 'th' ? 'th' : 'en'; const id = o.id, help = o.help || 'guide', need = meterNeed(o), fav = FAV[id], snacks = o.snacks || {}, treats = o.treats || 0;
  const st = {calm: !!o.calm, treat: null, tune: null}; let shown = 0, phase = 'snack', tries = 0;
  const fillNow = () => meterFill(Object.assign({}, st, {charm: o.charm})) / need;
  const ov = el('div', 'ap-ov'), card = el('div', 'puff ap-card ap-tame'); ov.appendChild(card); if(o.inBattle) ov.style.zIndex = 80;
  const head = el('div', 'ap-head'); head.appendChild(el('h2', '', '❤️ ' + w('heart') + '<small>' + (o.name || creatureName(id)) + (o.elite ? ' · ⭐' : '') + (o.rare ? ' · ✨' : '') + '</small>')); card.appendChild(head);
  const tw = el('div', 'ap-tw'), hc = cv(96, 88); hc.className = 'ap-heart'; tw.appendChild(hc); const mc = cv(300, 130); mc.className = 'ap-mon'; tw.appendChild(mc); card.appendChild(tw);
  const steps = el('div', 'ap-steps'); card.appendChild(steps); const msg = el('div', 'ap-msg', ''); card.appendChild(msg); const act = el('div', 'ap-act'); card.appendChild(act);
  heartCv(hc, () => { shown += (fillNow() - shown) * 0.12; return shown; });
  let mood = 'shy'; loop(mc, (g, W, H, t) => { const E = EL_COL[elOf(id)] || EL_COL.leaf, gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, E[1]); gr.addColorStop(1, '#FFF8EC'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const hh = Math.min(H * 0.92, W * 0.6); drawPetAt(g, id, W / 2, H * 0.94 - (mood === 'happy' ? Math.abs(Math.sin(t * 5)) * 8 : 0), hh, {painted: true, pose: mood === 'tilt' ? 'tilt' : mood === 'happy' ? 'happy' : mood === 'sway' ? {head: Math.sin(t * 3) * 0.25, tail: Math.sin(t * 6) * 0.5, eye: 'happy'} : 'shy', face: 'left'});
    if(mood === 'sway' || mood === 'happy') hearts(g, W / 2, H * 0.3, 11, t); if(mood === 'tilt'){ g.save(); g.fillStyle = '#2B2D42'; g.font = '800 26px Fredoka, sans-serif'; g.textAlign = 'center'; g.fillText('?', W / 2 + hh * 0.3, H * 0.3 + Math.sin(t * 4) * 3); g.restore(); } });
  function drawSteps(){ steps.innerHTML = ''; const S = [['😌', w('calm') + (o.inBattle ? ' · ' + (st.calm ? w('tired') : w('calmNo')) : ''), st.calm ? 1 : -1, '+25'],
      [st.treat === 'fav' ? SNACK_ICON[fav] || '🍖' : '🍖', w('snack'), st.treat ? 1 : phase === 'snack' ? 2 : 0, st.treat === 'fav' ? '+50' : st.treat === 'any' ? '+25' : '+25–50'],
      ['🎵', w('tune'), st.tune === 'perfect' || st.tune === 'good' ? 1 : phase === 'tune' ? 2 : 0, st.tune === 'perfect' ? '+50' : st.tune === 'good' ? '+25' : '+25–50']];
    S.forEach(s => steps.appendChild(el('span', 's' + (s[2] === 1 ? ' on' : s[2] === 2 ? ' now' : s[2] === -1 ? ' no' : ''), s[0] + ' ' + s[1] + (s[2] === 1 ? ' ✓ ' + s[3] : s[2] === -1 ? '' : ' ' + s[3])))); }
  return new Promise(res => {
    const end = r => { ov.remove(); res(Object.assign({snack: st.treat, tune: st.tune, fill: fillNow()}, r)); };
    function snackPhase(){ phase = 'snack'; drawSteps(); act.innerHTML = ''; msg.textContent = w('pickSnack');
      const hasFav = fav && (snacks[fav] || 0) > 0;
      if(hasFav){ const b = btn('on', (SNACK_ICON[fav] || '🍖') + ' ' + w('fav') + ' +50', () => { st.treat = 'fav'; mood = 'sway'; sound('pop'); tunePhase(); }); b.id = 'ap-fav'; act.appendChild(b); }
      if(treats > 0){ const b = btn(hasFav ? '' : 'on', '🍖 ' + w('anyT') + ' ×' + treats + ' +25', () => { st.treat = 'any'; mood = 'sway'; sound('pop'); tunePhase(); }); b.id = 'ap-any'; act.appendChild(b); }
      if(!hasFav && treats <= 0){ const b = btn('', w('noSnack'), () => { st.treat = null; tunePhase(); }); b.id = 'ap-none'; act.appendChild(b); }
      const lt = btn('', w('later'), () => end({res: 'later'})); lt.id = 'ap-later'; act.appendChild(lt); }
    function tunePhase(){ phase = 'tune'; drawSteps(); act.innerHTML = ''; msg.textContent = w('tuneH') + ' — ' + w('tap');
      const p = tune(act, {help, elite: o.elite, rare: o.rare, notes: o.notes, onHit: () => { mood = 'sway'; }}); AvPets.last.tune = p.api;
      p.then(r => { tries++; const best = st.tune === 'perfect' ? 'perfect' : r.res === 'perfect' ? 'perfect' : (r.res === 'good' || st.tune === 'good') ? 'good' : null; st.tune = best; drawSteps();
        if(fillNow() >= 1){ mood = 'happy'; msg.textContent = '💖 ' + w('newFriend'); sound('win'); act.innerHTML = ''; setTimeout(() => end({res: 'tamed'}), fast() ? 150 : 1300); return; }
        mood = 'tilt'; msg.textContent = r.res === 'miss' ? w('tilt') : w('tilt'); act.innerHTML = '';
        const again = btn('on', w('tryAgain'), () => tunePhase()); again.id = 'ap-again'; act.appendChild(again); const lt = btn('', w('later'), () => end({res: 'later'})); lt.id = 'ap-later'; act.appendChild(lt); }); }
    box.appendChild(ov); AvPets.last = {kind: 'tame', ov, st, fill: fillNow, need, snack: k => { const b = ov.querySelector(k === 'fav' ? '#ap-fav' : k === 'any' ? '#ap-any' : '#ap-none'); if(b) b.click(); }, tune: null,
      again: () => { const b = ov.querySelector('#ap-again'); if(b) b.click(); }, later: () => { const b = ov.querySelector('#ap-later'); if(b) b.click(); }};
    snackPhase(); }); }

/* ─── 🎵 learn the tune with Pudding (i3 ①) — Promise → 'good'|'perfect' (retries until you have it) ─── */
function practice(box, o){ css(); o = o || {}; L = o.lang === 'th' ? 'th' : 'en'; const ov = el('div', 'ap-ov'), card = el('div', 'puff ap-card ap-tame'); ov.appendChild(card);
  card.appendChild(el('div', 'ap-head', '<h2>' + w('learnH') + '<small>' + w('learnS') + '</small></h2>'));
  const mc = cv(420, 140); mc.className = 'ap-mon'; card.appendChild(mc); const msg = el('div', 'ap-msg', ''); card.appendChild(msg); const act = el('div', 'ap-act'); card.appendChild(act); let mood = 'sway';
  loop(mc, (g, W, H, t) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#E9E1FF'); gr.addColorStop(1, '#FFF8EC'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    try { Creatures.drawFor(g, 'pudding', W * 0.34, H * 0.94, H * 0.62, {t, face: 'right', pose: Creatures.poseOf({head: Math.sin(t * 3) * 0.22, tail: Math.sin(t * 5) * 0.4, lean: Math.sin(t * 1.5) * 0.08, eye: mood === 'tilt' ? 'open' : 'happy'})}); } catch(e){}
    try { if(o.av) drawAvatar(g, {av: o.av, name: '', dir: -1}, W * 0.68, H * 0.94, H / 100, {t, still: true, pose: {face: 'happy'}}); } catch(e){}
    for(let i = 0; i < 3; i++){ const p = (t * 0.6 + i / 3) % 1; g.save(); g.globalAlpha = 1 - p; note(g, W * 0.5 + (i - 1) * 22 + Math.sin(t * 2 + i) * 8, H * (0.55 - p * 0.45), 18, ['#9B5DE5', '#FF5FA2', '#2EA7E0'][i]); g.restore(); } });
  return new Promise(res => { function go(){ act.innerHTML = ''; msg.textContent = ''; const p = tune(act, {help: o.help, beats: tuneBeats(o.help) }); AvPets.last.tune = p.api;
      p.then(r => { if(r.res !== 'miss'){ msg.textContent = '🎵 ' + w('learned'); sound('win'); setTimeout(() => { ov.remove(); res(r.res); }, fast() ? 120 : 1100); return; }
        mood = 'tilt'; msg.textContent = w('tilt'); const a = btn('on', w('tryAgain'), () => { mood = 'sway'; go(); }); a.id = 'ap-again'; act.appendChild(a); }); }
    box.appendChild(ov); AvPets.last = {kind: 'practice', ov, tune: null, again: () => { const b = ov.querySelector('#ap-again'); if(b) b.click(); }}; go(); }); }

/* ─── 🗺️ map items: hiding pet · pin · ring · friend at the yard · pet-house light ─── */
function hideItem(G, id, at, o){ o = o || {}; const AK = 0.62 * 1.55;
  const it = {x: at.x, y: at.y, z: G.W.M.heightAt(Math.floor(at.x), Math.floor(at.y)), apHide: id, draw(g, sx, sy, k){ const t = now(), h = 88 * k * AK * 0.62 * (o.scale || 0.9), bob = Math.abs(Math.sin(t * 2.2)) * 3 * k;
      drawPetAt(g, id, sx, sy - bob, h, {pose: 'peek', face: o.face || 'left', noShadow: true});
      if(id === 'emberpup') for(let i = 0; i < 3; i++){ const p = (t * 0.8 + i / 3) % 1; spark(g, sx + Math.sin(i * 2.1 + t * 3) * 10 * k, sy - h * (0.7 + p * 0.7), 4 * k * (1 - p), '#FFB547', 1 - p); }
      if(id === 'splashell') for(let i = 0; i < 3; i++){ const p = (t * 0.6 + i / 3) % 1; bubble(g, sx + Math.sin(i * 2 + t) * 12 * k, sy - h * (0.6 + p * 0.8), 4.5 * k * (0.6 + p * 0.5), 1 - p); }
      if(id === 'leaflop') for(let i = 0; i < 2; i++){ const p = (t * 0.5 + i / 2) % 1; leaf(g, sx + (i ? 14 : -12) * k, sy - h * (0.5 + p * 0.6), 5 * k, t * 2 + i, '#7FD35A'); }
      eyesBubble(g, sx + 6 * k, sy - h * 0.92 - 14 * k - bob, 17 * k, t); }};
  return it; }
function pinItem(G, at, col){ return {x: at.x, y: at.y, z: G.W.M.heightAt(Math.floor(at.x), Math.floor(at.y)), apPin: 1, draw(g, sx, sy, k){ const b = Math.abs(Math.sin(now() * 4)) * 8 * k, y = sy - 70 * k - b;
    g.save(); g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(sx, sy, 12 * k, 5 * k, 0, 0, TAU); g.fill();
    g.fillStyle = col || '#FF5FA2'; g.strokeStyle = '#fff'; g.lineWidth = 3 * k; g.beginPath(); g.arc(sx, y, 13 * k, Math.PI * 0.85, Math.PI * 2.15); g.lineTo(sx, y + 26 * k); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(sx, y, 5 * k, 0, TAU); g.fill(); g.restore(); }}; }
function ringItem(G, m, o){ o = o || {}; return {x: m.x, y: m.y, z: G.W.M.heightAt(Math.floor(m.x), Math.floor(m.y)) - 0.01, ground: true, apRing: 1, draw(g, sx, sy, k){ const t = now(), lvl = o.alert ? o.alert() : 0;
    const R = (o.r || 2.4) * 32 * k, col = lvl < 0.34 ? '#3DBE5C' : lvl < 0.67 ? '#FFC21A' : '#E5484D';
    g.save(); g.globalAlpha = 0.22 + 0.08 * Math.sin(t * 3); g.fillStyle = col; g.beginPath(); g.ellipse(sx, sy, R, R * 0.5, 0, 0, TAU); g.fill(); g.globalAlpha = 0.9; g.strokeStyle = col; g.lineWidth = 3 * k; g.setLineDash([10 * k, 7 * k]); g.lineDashOffset = -t * 20;
    g.beginPath(); g.ellipse(sx, sy, R, R * 0.5, 0, 0, TAU); g.stroke(); g.restore(); }}; }
function friendItem(G, id, at, o){ o = o || {}; const AK = 0.62 * 1.55; const it = {x: at.x, y: at.y, z: G.W.M.heightAt(Math.floor(at.x), Math.floor(at.y)), apFriend: id, draw(g, sx, sy, k){ const t = now() + (o.ph || 0), h = 88 * k * AK * 0.62, hop = Math.max(0, Math.sin(t * 2.6)) * 6 * k;
    drawPetAt(g, id, sx, sy - hop, h, {pose: {head: -0.1 + Math.sin(t * 2) * 0.12, tail: Math.sin(t * 4) * 0.4, eye: 'happy'}, face: Math.sin(t * 0.7) > 0 ? 'left' : 'right'});
    if(o.hearts) hearts(g, sx, sy - h * 1.1, 6 * k, t, 2); }}; return it; }
function houseItem(G, at){ return {x: at.x, y: at.y, z: G.W.M.heightAt(Math.floor(at.x), Math.floor(at.y)), apHouse: 1, draw(g, sx, sy, k){ const t = now();
    g.save(); g.globalCompositeOperation = 'lighter'; const r = 46 * k, gr = g.createRadialGradient(sx, sy - 30 * k, 2, sx, sy - 30 * k, r); gr.addColorStop(0, 'rgba(255,214,120,' + (0.42 + 0.08 * Math.sin(t * 2)) + ')'); gr.addColorStop(1, 'rgba(255,190,80,0)'); g.fillStyle = gr; g.beginPath(); g.arc(sx, sy - 30 * k, r, 0, TAU); g.fill(); g.restore();
    g.save(); g.fillStyle = '#FFE48A'; g.strokeStyle = '#8A5A00'; g.lineWidth = 1.5 * k; g.beginPath(); g.ellipse(sx + 2 * k, sy - 58 * k + Math.sin(t * 2) * 1.5 * k, 5 * k, 6.5 * k, 0, 0, TAU); g.fill(); g.stroke(); g.restore(); hearts(g, sx, sy - 72 * k, 5 * k, t, 2); }}; }

/* ─── 🎥 camera HUD: peek chip + "You ➤" edge face ─── */
function peekHud(box, G){ css(); const chipEl = el('div', 'ap-hud ap-peek puff', w('peek') + '<small>' + w('peekS') + '</small>'), edge = el('div', 'ap-hud ap-edge'), fc = cv(40, 40); edge.appendChild(fc);
  loop(fc, (g, Wc, Hc, t) => { try { drawAvatar(g, {av: G.heroAv, name: '', dir: 1}, Wc / 2, Hc * 1.55, Hc / 52, {t, still: true, pose: {face: 'happy'}}); } catch(e){} });
  edge.appendChild(el('span', '', w('you'))); const ar = el('i', '', '➤'); edge.appendChild(ar); box.appendChild(chipEl); box.appendChild(edge); edge.setAttribute('role', 'button'); edge.dataset.k = 'you';   /* 🎥 av-fix2: tap the face = back to you */
  return {chipEl, edge, place(top){ chipEl.style.top = Math.round(top) + 'px'; const p = G.V.toScreen(G.H.x, G.H.y, G.H.z), W = innerWidth, H = innerHeight, cx = W / 2, cy = H / 2, dx = p.x - cx, dy = p.y - 40 - cy;
      const m = 52, s = Math.min((W / 2 - m) / Math.abs(dx || 1), (H / 2 - m - 60) / Math.abs(dy || 1), 1), ang = Math.atan2(dy, dx); ar.style.transform = 'rotate(' + ang.toFixed(2) + 'rad)';
      const ex = cx + dx * s, ey = cy + dy * s, er = edge.getBoundingClientRect(); edge.style.left = Math.round(Math.max(8, Math.min(W - (er.width || 110) - 8, ex - (er.width || 110) / 2))) + 'px'; edge.style.top = Math.round(Math.max(top + 44, Math.min(H - 60, ey - 25))) + 'px'; },
    remove(){ chipEl.remove(); edge.remove(); }}; }

/* ═══════════ 🐾 av-pet2 · walk-along friends + 🐘 Pudding (🧳 Avateer Development chat, 2026-11-28 · slice plan §🐾 av-pet2p, Aowu "go" 17:20 = P1–P6 ⭐) ═══════════
   ① 🚶 your 2 pets walk with you (save.pet · save.pet2 = the 2 friends that will battle — av-party1) and 🐘 Pudding walks as a 3rd friend unless 🏠 "Pudding stays home" (save.pudHome, the 🎒 bag switch).
      Pudding is never a fighter: he is the story-pacing friend + each island's gimmick path-clearer. At home he waits at Noi's yard; a story step that needs him (FR_NEED) calls him in
      (he trots over), and once it is done he waves and trots home again. The switch exists once Main 2 is done (before that he is always with you — the story is about him).
   ② 🐘 Ask Pudding (P3 ⭐): FR_SPOTS[island] = the island's gimmick spots. ✋ shows "🐘 Ask Pudding" in reach → he walks up, faces it, plays his act and clears it on the CONTACT beat:
      il1 = 🔥 hot coals by the cook station (💦 splash → steam, the 3 × 3 ring of cells opens, the 🎁 inside can be picked up) · 🪨 a cracked boulder in Mango Grove (🦶 stamp → Props.touch earth → split, a 🎁 rolls out)
            · 🌱 a dry seed bed by the bath pond (💦 splash → Props.touch water → full, flowers + a 🎁). If he is at home the ✋ word is "🐘 Call Pudding" — he runs in, does it, goes home.
      Before Pudding follows you for good (Main 2) the spot says 🔍 Look ("maybe Pudding can help later"). Cleared + collected = flags pud.<id> / pud.<id>.gift (saved).
   ③ 🫧 idle gimmicks (P5 ⭐): after 4 s standing still, one move every 6–10 s, never two at once, never in talks / battles: each pet = its FAMILY set (moments from 🎬 Creatures.ALIVE.MOM, mo-10)
      + ONE signature of its own kind (FR_SIG: Emberpup spark sneeze · Splashell bubble ring · Leaflop flower pop · Mangobble seed juggle · Toucanoo fruit catch …), drawn on top of 🎬 Creatures.alive
      (breathing · blinking · weight shift · gait — the follower's walk now uses alive's gait). 🐘 Pudding: sniff · ear flap · toot · lean on you (hug when you stand next to him) + he copies your 👋 wave.
   Page glue: FR = friendsKit(P, {lang, S, q}) inside install → api.step / targets / boot call it · drawPetOf → PETS.petLook(Q, id, o) + PETS.petFx(…) · groundFx / airFx → PETS.groundFx / airFx.
   Test handle: AvPets.page.fr (info · spots · ask · setHome · need). Test: Test Harness/rounds/av-pet2/pet2.test.js. */
const FR_NEED = {open: ['il1.m3'], live: ['il1.m1', 'il1.m2', 'il1.m3', 'il1.i4', 'il1.i5', 'il1.s5', 'il1.d3']};   /* quests Pudding takes part in (giver / goal / tree shake / bath) — + i3 step 0 (the tune) */
const FR_SPOTS = {il1: [
  {id: 'coals', kind: 'spray', act: 'splash', i: 22, j: 98, isle: 'landing', reward: {coins: 15, xp: 10, snack: 'mango', n: 2}},
  {id: 'boulder', kind: 'stamp', act: 'stamp', prop: 'touch_boulder', i: 22, j: 59, isle: 'mango', el: 'earth', reward: {coins: 20, xp: 12, treats: 2}},
  {id: 'seedbed', kind: 'water', act: 'splash', prop: 'touch_seedbed', i: 30, j: 63, isle: 'mango', el: 'water', reward: {coins: 10, xp: 10, snack: 'rice', n: 2}}]};
const FR_FAM = {beast: ['wag', 'playBow', 'scratch', 'shakeOff', 'sniff'], reptile: ['wag', 'tailFlick', 'sniff', 'lookUp'], slime: ['jiggle', 'bubble', 'meltPeek', 'hopHop'],
  bird: ['preen', 'wingStretch', 'hopHop', 'shakeOff'], plant: ['sunReach', 'drink', 'leafShake'], bug: ['legTap', 'rearUp', 'sniff'], spirit: ['loop', 'swirl'], construct: ['scan', 'selfCheck', 'vent'], reptileX: []};
/* ✨ one signature per kind: pose keys in the 🎬 alive pose code (ms|deltas; h head · j jaw · l lean · t tail · y lift · X / Y squash · e: eyes) + its own little FX (contact = the big beat) */
const FR_SIG = {
  emberpup: {n: 'Spark Sneeze', th: 'จามประกายไฟ', keys: '0|;260|h-.32 j.15 Y.05 e:shut;420|h-.36 j.2 Y.07 e:shut;500|h.3 j.85 l.12 Y-.08;760|h.12 j.3;1100|', hit: 500, fx: 'sparks'},
  splashell: {n: 'Bubble Ring', th: 'วงฟองสบู่', keys: '0|;300|Y.07 X-.03 j0;520|Y.08 j.1;600|Y-.04 j.65 h-.1;1400|j.4 h-.08;1700|', hit: 600, fx: 'ring'},
  leaflop: {n: 'Flower Pop', th: 'ดอกไม้ผุด', keys: '0|;220|Y-.07 y2;380|y-7 Y.08 h-.2 e:happy;560|Y-.06;900|h-.1 e:happy;1300|', hit: 380, fx: 'flower'},
  mangobble: {n: 'Seed Juggle', th: 'โยนเมล็ด', keys: '0|;220|Y-.1 X.07;380|Y.12 y-5;640|Y.08 y-4 X-.03;900|Y-.05;1150|', hit: 380, fx: 'seed'},
  toucanoo: {n: 'Fruit Catch', th: 'งับผลไม้', keys: '0|;350|h-.42 j.75 l-.1;600|h-.42 j.8;680|h.1 j0 Y.05;1000|h0 e:happy;1300|', hit: 680, fx: 'fruit'},
  kaikai: {n: 'Feather Fluff', th: 'ฟูขน', keys: '0|;200|Y-.06;300|X.08 Y.08 w.6;800|X.06 Y.06 w.5;1050|', hit: 300, fx: 'puff'},
  paddypinch: {n: 'Claw Click', th: 'หนีบกิ๊ก', keys: '0|;200|a-1 j.3;300|a.4 j0;420|a-1 j.3;520|a.4;800|', hit: 300, fx: 'click'},
  _beast: {n: 'Tail Chase', th: 'ไล่หางตัวเอง', keys: '0|;200|l.1 t.7;450|r.12 t.9 X.04;700|r-.12 t-.5;950|r.1 t.6;1200|', hit: 450, fx: 'dust'},
  _slime: {n: 'Wobble Pop', th: 'เด้งดึ๋ง', keys: '0|;200|Y-.14 X.1;360|Y.12 y-5;600|Y-.05;800|', hit: 360, fx: 'sparkle'},
  _bird: {n: 'Hop Spin', th: 'หมุนกระโดด', keys: '0|;150|Y-.08;300|y-6 r.15 w.9;520|y-6 r-.15 w.9;700|Y-.06;900|', hit: 300, fx: 'puff'},
  _any: {n: 'Happy Hop', th: 'กระโดดดีใจ', keys: '0|;150|Y-.08;300|y-6 Y.07 e:happy;460|Y-.06;700|', hit: 300, fx: 'heart'}};
const FR_PUD = ['sniff', 'flap', 'toot', 'flap', 'sniff'];   /* 🐘 Pudding's idle set (+ 'hug' = lean on you when you stand next to him) */
const FR_W = {
  en: {ask: 'Ask Pudding', call: 'Call Pudding', coals: 'Hot coals', boulder: 'Cracked boulder', seedbed: 'Dry seed bed', hot: '🔥 Too hot to walk on!', hotLater: '🔥 Too hot! Maybe Pudding can help one day…',
    rock: '🪨 A big cracked rock. Something is under it!', rockLater: '🪨 Too heavy to move… Pudding is strong, though!', dry: '🌱 So dry… it needs water!', dryLater: '🌱 So dry… Pudding loves water — later!',
    cleared: '✨ Pudding cleared the way!', bloom: '🌼 It blooms!', gift: '🎁 A present!', comes: '🐘 Pudding trots over!', runsIn: '🐘 Pudding runs in to help!', goesHome: '🏠 Pudding goes home to Noi’s yard', bye: '👋',
    stays: '🏠 Pudding stays home', walks: '🚶 Pudding walks with you', homeNo: '🐘 Pudding is needed for this step — he stays!', askHint: '🐘 Ask Pudding!'},
  th: {ask: 'ขอพุดดิ้งช่วย', call: 'เรียกพุดดิ้ง', coals: 'ถ่านร้อน', boulder: 'ก้อนหินร้าว', seedbed: 'แปลงเมล็ดแห้ง', hot: '🔥 ร้อนเกินไป เดินไม่ได้!', hotLater: '🔥 ร้อนมาก! วันหนึ่งพุดดิ้งอาจช่วยได้…',
    rock: '🪨 หินก้อนใหญ่ร้าว ข้างใต้มีอะไรอยู่!', rockLater: '🪨 หนักเกินไป… แต่พุดดิ้งแข็งแรงนะ!', dry: '🌱 แห้งมาก… ต้องการน้ำ!', dryLater: '🌱 แห้งมาก… พุดดิ้งชอบน้ำ — ไว้ทีหลัง!',
    cleared: '✨ พุดดิ้งเปิดทางให้แล้ว!', bloom: '🌼 ดอกไม้บาน!', gift: '🎁 ของขวัญ!', comes: '🐘 พุดดิ้งวิ่งเหยาะ ๆ มาหา!', runsIn: '🐘 พุดดิ้งวิ่งมาช่วย!', goesHome: '🏠 พุดดิ้งกลับบ้านที่ลานยาย', bye: '👋',
    stays: '🏠 พุดดิ้งอยู่บ้าน', walks: '🚶 พุดดิ้งเดินไปด้วย', homeNo: '🐘 ขั้นนี้ต้องมีพุดดิ้ง — อยู่ด้วยกันก่อนนะ!', askHint: '🐘 ขอพุดดิ้งช่วยสิ!'}};
/* 🫧 the alive pose-code (same format as 🎬 MotionCreature): '0|;260|h-.3 j.2 e:shut' → [{ms, p}] — read once */
const FR_CK = {l: 'lean', h: 'head', j: 'jaw', f: 'fl', b: 'bl', a: 'arm', t: 'tail', w: 'wing', s: 'shift', r: 'rot', y: 'y', X: 'sx', Y: 'sy', k: 'wrist'};
function frKeys(src){ return src.split(';').filter(Boolean).map(k => { const i = k.indexOf('|'), p = {}; k.slice(i + 1).split(' ').forEach(x => { if(!x) return; if(x.indexOf('e:') === 0){ p.eye = x.slice(2); return; } const f = FR_CK[x[0]]; if(f) p[f] = +x.slice(1); }); return {ms: +k.slice(0, i), p}; }); }
function frAt(K, ms){ if(!K.length) return {}; let a = K[0], b = K[K.length - 1]; for(let i = 0; i < K.length - 1; i++){ if(ms >= K[i].ms && ms <= K[i + 1].ms){ a = K[i]; b = K[i + 1]; break; } }
  const u = b.ms > a.ms ? Math.max(0, Math.min(1, (ms - a.ms) / (b.ms - a.ms))) : 1, e = u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u), o = {};
  Object.keys(Object.assign({}, a.p, b.p)).forEach(k => { if(k === 'eye'){ o.eye = (u < 0.5 ? a.p.eye : b.p.eye) || null; return; } o[k] = (a.p[k] || 0) + ((b.p[k] || 0) - (a.p[k] || 0)) * e; }); return o; }
const FR_SIGK = {}; Object.keys(FR_SIG).forEach(k => { FR_SIGK[k] = frKeys(FR_SIG[k].keys); FR_SIG[k].dur = FR_SIGK[k][FR_SIGK[k].length - 1].ms; });

function friendsKit(P, o){ const G = P.G, W = G.W, M = W.M, lang = o.lang, S = o.S, q = o.q;
  const w = k => (FR_W[lang()] || FR_W.en)[k] || FR_W.en[k] || k;
  const fr = {mode: 'with', t: 0, why: null, job: null, home: null, idleT: 4, stillT: 0, spots: [], busyUntil: 0, lastHint: -99, pudIdle: true};
  const rnd = () => Math.random();
  const homeSpot = () => fr.home || (fr.home = W.freeNear(YARD.noi.x + 1.4, YARD.noi.y - 1.3, 2.5) || W.spot('pudding'));
  /* ① 🏠 home / away */
  const canHome = () => !!G.ST && S('il1.m2') === 'done';
  function need(){ if(!G.ST) return 'story'; if(!canHome()) return 'story'; if(fr.job || G.t - (fr.lastJob || -99) < 2.5) return 'job';
    if(FR_NEED.open.some(id => S(id) === 'open')) return 'story'; if(FR_NEED.live.some(id => { const s = S(id); return s === 'active' || s === 'turnin'; })) return 'story';
    if(q('il1.i3') === 0) return 'story'; return null; }
  const wantHome = () => !!(G.save && G.save.pudHome) && !need();
  function placeHome(){ const h = homeSpot(); G.P.on = false; G.P.wait = null; G.P.route = null; G.P.x = G.P.px = h.x; G.P.y = G.P.py = h.y; G.P.z = M.heightAt(Math.floor(h.x), Math.floor(h.y)); G.P.dir = 1; G.P.moving = false; fr.mode = 'home'; }
  function comeIn(why){ const H = G.H; let at = null; for(let k = 0; k < 10 && !at; k++){ const a = k * 0.7 + 2.2, r = 4.2, x = H.x + Math.cos(a) * r, y = H.y + Math.sin(a) * r; if(M.inside(Math.floor(x), Math.floor(y)) && M.walk(Math.floor(x), Math.floor(y)) && W.zoneAt(x, y) === W.zoneAt(H.x, H.y)) at = {x: Math.floor(x) + 0.5, y: Math.floor(y) + 0.5}; }
    at = at || W.freeNear(H.x - 0.7, H.y + 0.5, 2); G.P.x = G.P.px = at.x; G.P.y = G.P.py = at.y; G.P.z = M.heightAt(Math.floor(at.x), Math.floor(at.y)); G.P.wait = null; G.P.route = null; G.P.on = true; G.P.hold = false; fr.mode = 'come'; fr.t = 0;
    if(why !== 'quiet') P.toast(w(why === 'job' ? 'runsIn' : 'comes'), 2200); }
  function goHome(quiet){ if(fr.mode === 'home' || fr.mode === 'leave') return; const H = G.H, h = homeSpot(), dx = h.x - H.x, dy = h.y - H.y, L = Math.hypot(dx, dy) || 1;
    const away = W.freeNear(G.P.x + dx / L * 4, G.P.y + dy / L * 4, 2) || W.freeNear(G.P.x + 3, G.P.y, 2); fr.mode = 'leave'; fr.t = 0; if(G.pact == null) P.pAct('cheer', {again: true});
    if(!quiet){ P.toast(w('goesHome'), 2200); try { const p = G.V.toScreen(G.P.it.x, G.P.it.y, G.P.it.z); P.sticker(p.x, p.y - 70 * G.V.zoom, w('bye')); } catch(e){} }
    setTimeout(() => { if(fr.mode === 'leave'){ G.P.on = true; G.P.wait = away; } }, 450); }
  function setHome(v){ if(!G.save) return false; G.save.pudHome = !!v; const n = need(); if(v && n && n !== 'job'){ P.toast(w('homeNo'), 2600); } else P.toast(w(v ? 'stays' : 'walks'), 1800); P.saveLocal(); return true; }
  function stepHome(dt){ if(!G.P || !G.save) return; fr.t += dt; const H = G.H;
    if(!canHome()){ fr.mode = 'with'; return; }   /* before Main 2 is done the story places him (page code) */
    const home = wantHome();
    if(fr.mode === 'with' || fr.mode === 'come'){ if(home && !G.talking) goHome(false); else if(fr.mode === 'come' && (Math.hypot(G.P.x - H.x, G.P.y - H.y) < 1.6 || fr.t > 4)) fr.mode = 'with'; return; }
    if(fr.mode === 'leave'){ const far = Math.hypot(G.P.x - H.x, G.P.y - H.y), off = (() => { try { const p = G.V.toScreen(G.P.x, G.P.y, G.P.z); return p.x < -60 || p.y < -60 || p.x > innerWidth + 60 || p.y > innerHeight + 60; } catch(e){ return true; } })();
      if(!home){ G.P.wait = null; fr.mode = 'with'; return; } if(fr.t > 1.8 || far > 6 || off) placeHome(); return; }
    if(fr.mode === 'home'){ if(!home){ const n = need(); comeIn(n === 'job' ? 'job' : n ? 'story' : 'walk'); return; }   /* the switch went back on, or a story step needs him */
      const h = homeSpot(); if(G.P.on || Math.hypot(G.P.x - h.x, G.P.y - h.y) > 0.6) placeHome(); } }
  /* ② 🐘 gimmick spots */
  function cellsOf(sp){ if(!sp.prop){ const out = []; for(let b = -1; b <= 1; b++) for(let a = -1; a <= 1; a++) if(a || b) out.push([sp.i + a, sp.j + b]); return out; } return sp.it ? sp.it.cells.map(c => [c[0], c[1]]) : [[sp.i, sp.j]]; }
  function buildSpots(){ const L = FR_SPOTS[W.id || 'il1'] || FR_SPOTS.il1; fr.spots = L.map(d => { const sp = Object.assign({}, d, {cool: 0, done: !!G.flags['pud.' + d.id], got: !!G.flags['pud.' + d.id + '.gift'], cells: [], gift: null});
      if(sp.prop && Props.DEFS[sp.prop]){ const it = Props.place(M, sp.prop, sp.i, sp.j, {look: 'jungle'}); if(it){ sp.it = it; if(sp.done) Props.setState(it, sp.kind === 'stamp' ? 'split' : 'full', M); G.items.push(it); } }
      if(!sp.prop){ cellsOf(sp).forEach(([a, b]) => { if(M.inside(a, b) && M.walk(a, b)){ sp.cells.push([a, b]); if(!sp.done) M.set(a, b, {block: 1}); } }); sp.cool = sp.done ? 1 : 0; }
      sp.x = sp.it ? sp.it.x + (sp.it.w || 1) / 2 : sp.i + 0.5; sp.y = sp.it ? sp.it.y + (sp.it.d || 1) / 2 : sp.j + 0.5;
      if(sp.done && !sp.got) giftOut(sp, true); return sp; }); }
  function giftAt(sp){ if(!sp.prop) return {x: sp.i + 0.5, y: sp.j + 0.5}; const H = G.H; let best = null, bd = -1;   /* 🎁 rolls out to a free cell beside it, on the side away from you (so you walk over to pick it up) */
    for(let a = 0; a < 16; a++){ const an = a / 16 * Math.PI * 2, r = a % 2 ? 1.6 : 1.15, x = sp.x + Math.cos(an) * r, y = sp.y + Math.sin(an) * r, i = Math.floor(x), j = Math.floor(y); if(!M.inside(i, j) || !M.walk(i, j)) continue; const d = Math.hypot(i + 0.5 - H.x, j + 0.5 - H.y); if(d > bd){ bd = d; best = {x: i + 0.5, y: j + 0.5}; } }
    return best || W.freeNear(sp.x, sp.y + 1.2, 2); }
  function giftOut(sp, quiet){ const at = giftAt(sp); if(!at) return; const it = {x: at.x, y: at.y, z: M.heightAt(Math.floor(at.x), Math.floor(at.y)), gift: sp.id, t0: G.t, draw(g, sx, sy, k){ drawGift(g, sx, sy, k, G.t - it.t0); }};
    sp.gift = it; G.items.push(it); if(!quiet) setTimeout(() => { if(!sp.gift) return; try { const p = G.V.toScreen(at.x, at.y, it.z); P.sticker(p.x, p.y - 50 * G.V.zoom, w('gift')); } catch(e){} }, 1100); }   /* after Pudding's ✨ line, never on top of it */
  function drawGift(g, x, y, k, age){ const s = 9 * k, pop = Math.min(1, age / 0.35), b = Math.sin(G.t * 3) * 2 * k, sc = 0.5 + 0.5 * (pop < 1 ? 1 - Math.pow(1 - pop, 3) * Math.cos(pop * 6) * 0.2 : 1);
    g.save(); g.globalAlpha = 0.45 + 0.25 * Math.sin(G.t * 4); g.fillStyle = '#FFE14D'; g.beginPath(); g.ellipse(x, y - 1, s * 2.1, s * 0.75, 0, 0, 7); g.fill(); g.restore();
    g.save(); g.translate(x, y - s * 1.2 + b); g.scale(sc, sc); g.lineWidth = 2 * k; g.strokeStyle = '#2A1C14'; g.fillStyle = '#E2508F'; g.beginPath(); g.rect(-s, -s, 2 * s, 2 * s); g.fill(); g.stroke();
    g.fillStyle = '#FFD23F'; g.fillRect(-s * 0.22, -s, s * 0.44, 2 * s); g.fillRect(-s, -s * 0.22, 2 * s, s * 0.44); g.strokeRect(-s, -s, 2 * s, 2 * s);
    g.beginPath(); g.ellipse(-s * 0.4, -s * 1.15, s * 0.42, s * 0.26, -0.5, 0, 7); g.ellipse(s * 0.4, -s * 1.15, s * 0.42, s * 0.26, 0.5, 0, 7); g.fill(); g.stroke(); g.restore(); }
  function pickGifts(){ const H = G.H; fr.spots.forEach(sp => { const it = sp.gift; if(!it || Math.hypot(it.x - H.x, it.y - H.y) > 0.85) return; G.items = G.items.filter(x => x !== it); sp.gift = null; sp.got = true; G.flags['pud.' + sp.id + '.gift'] = 1;
      const r = sp.reward || {}, s = G.save; if(r.snack){ s.snacks = s.snacks || {}; s.snacks[r.snack] = (s.snacks[r.snack] || 0) + (r.n || 1); } if(r.treats) s.treats = (s.treats || 0) + r.treats; P.gainXp(r.xp || 0, r.coins || 0); P.drawLv();
      const ic = (r.coins ? '🪙 +' + r.coins : '') + (r.snack ? ' · ' + (SNACK_ICON[r.snack] || '🍬') + ' ×' + (r.n || 1) : '') + (r.treats ? ' · 🍖 ×' + r.treats : '');
      try { const p = G.V.toScreen(it.x, it.y, it.z); P.sticker(p.x, p.y - 40 * G.V.zoom, ic); } catch(e){} sound('win'); P.saveLocal(); }); }
  function look(sp){ const ok = canHome(), k = sp.kind === 'spray' ? (ok ? 'hot' : 'hotLater') : sp.kind === 'stamp' ? (ok ? 'rock' : 'rockLater') : (ok ? 'dry' : 'dryLater'); P.toast(w(k), 2600); sound('tap'); }
  async function ask(sp){ if(!sp || sp.done || fr.job || G.talking || G.battle) return false; fr.job = sp; const H = G.H; H.stop();
    if(fr.mode === 'home' || fr.mode === 'leave'){ comeIn('job'); }
    const wait = ms => new Promise(r => setTimeout(r, ms)), until = async (f, ms) => { const t0 = performance.now(); while(!f() && performance.now() - t0 < ms) await wait(60); };
    await until(() => Math.hypot(G.P.x - H.x, G.P.y - H.y) < 2.2, 3200);
    const dx = G.P.x - sp.x, dy = G.P.y - sp.y, L = Math.hypot(dx, dy) || 1, R = sp.prop ? 1.3 : 2.0, stand = W.freeNear(sp.x + dx / L * R, sp.y + dy / L * R, 1.6) || {x: G.P.x, y: G.P.y};
    G.P.on = true; G.P.hold = false; G.P.wait = stand; await until(() => Math.hypot(G.P.x - stand.x, G.P.y - stand.y) < 0.3, 3000);
    G.P.hold = true; const sdx = (sp.x - G.P.x) - (sp.y - G.P.y); G.P.dir = sdx >= 0 ? 1 : -1; G.P.view = (sp.y - G.P.y) - (sp.x - G.P.x) > 0.1 && (sp.x - G.P.x) + (sp.y - G.P.y) < -0.1 ? 'NW' : 'SW';
    await new Promise(res => { P.pAct(sp.act, {again: true, on: () => { hit(sp); res(); }}); setTimeout(res, 2600); });
    await wait(sp.kind === 'spray' ? 1500 : 700); G.P.hold = false; G.P.wait = null; fr.job = null; fr.lastJob = G.t; P.saveLocal(); P.updateGoal(); return true; }
  function hit(sp){ if(sp.done) return; sp.done = true; sp.hitT = G.t; G.flags['pud.' + sp.id] = 1;
    if(sp.kind === 'spray'){ sp.spray = {t0: G.t}; P.tone(520, 0.08, {type: 'triangle', gain: 0.05, slide: 880}); setTimeout(() => { sp.cells.forEach(([a, b]) => M.set(a, b, {block: 0})); giftOut(sp); done(sp); }, 1300); }
    else if(sp.kind === 'stamp'){ sp.dust = {t0: G.t}; try { if(G.V.shake) G.V.shake(5); } catch(e){} P.tone(90, 0.2, {type: 'sawtooth', gain: 0.09}); if(sp.it) Props.touch(sp.it, 'earth', M, {t0: G.t}); setTimeout(() => { giftOut(sp); done(sp); }, 900); }
    else { sp.spray = {t0: G.t}; if(sp.it) setTimeout(() => { Props.touch(sp.it, 'water', M, {t0: G.t}); sound('pop'); }, 450); setTimeout(() => { giftOut(sp); done(sp, 'bloom'); }, 1300); } }
  function done(sp, word){ try { const p = G.V.toScreen(G.P.it.x, G.P.it.y, G.P.it.z); P.sticker(p.x, p.y - 80 * G.V.zoom, w(word || 'cleared')); } catch(e){} sound('win'); P.pAct('cheer', {again: true}); P.saveLocal(); }
  function targets(){ if(!G.ST || G.talking || G.battle || fr.job) return []; const H = G.H, out = [];
    fr.spots.forEach(sp => { if(sp.done) return; const d = Math.hypot(sp.x - H.x, sp.y - H.y); if(d > 3.2) return; const nm = w(sp.id);
      if(!canHome()) out.push({at: {x: sp.x, y: sp.y}, k: 'look', name: nm, pri: 1, r: 2.6, run: () => look(sp)});
      else out.push({at: {x: sp.x, y: sp.y}, k: fr.mode === 'home' || fr.mode === 'leave' ? 'call' : 'pud', name: nm, pri: 5, r: 2.6, run: () => ask(sp)}); });
    if(fr.mode === 'home' && G.P && Math.hypot(G.P.x - H.x, G.P.y - H.y) < 1.8) out.push({at: G.P, k: 'pet', name: lang() === 'th' ? 'พุดดิ้ง' : 'Pudding', pri: 0, r: 1.8, run: () => { P.pAct('hug', {again: true}); sound('pop'); }});
    return out; }
  function bumpHint(){ const H = G.H; if(!H.moving || G.t - fr.lastHint < 7) return; const sp = fr.spots.find(s => !s.done && Math.hypot(s.x - H.x, s.y - H.y) < (s.prop ? 1.5 : 2.0)); if(!sp) return; fr.lastHint = G.t;
    if(canHome()) P.toast((sp.kind === 'spray' ? w('hot') : sp.kind === 'stamp' ? w('rock') : w('dry')) + ' ' + w('askHint'), 2400); }
  /* ③ 🫧 idle gimmicks */
  const famOf = id => { try { return (Creatures.LIST[id] || {}).fam || 'beast'; } catch(e){ return 'beast'; } };
  function sigOf(id){ if(FR_SIG[id]) return id; const f = famOf(id); return FR_SIG['_' + f] ? '_' + f : '_any'; }
  function famList(id){ const MK = Creatures.ALIVE && Creatures.ALIVE.MK; return (FR_FAM[famOf(id)] || FR_FAM.beast).filter(n => MK && MK.has(n)); }
  function petLook(Q, id, base){ if(!Q || !id || !window.Creatures || !Creatures.alive) return base; const t = G.t;
    if(!Q.__A || Q.__Aid !== id){ try { Q.__A = Creatures.alive(id, {place: 'map', pet: true, seed: id + (Q === G.Q2 ? ':2' : ':1'), t0: t}); } catch(e){ Q.__A = null; } Q.__Aid = id; Q.__mv = null; Q.__still = t; Q.gim = null; Q.gimT = t + 4 + rnd() * 3; }
    const A = Q.__A; if(!A) return base; const mv = Q.moving ? (Math.hypot(Q.x - Q.px, Q.y - Q.py) > 0.07 ? 'run' : 'walk') : false;
    if(!!mv !== !!Q.__mv){ A.moving(mv, t); Q.__mv = mv; Q.__still = mv ? null : t; if(mv) Q.gim = null; }
    if(G.talking || G.battle || G.reveal){ Q.gim = null; if(!Q.__pk || t - Q.__pk > 0.6){ A.poke(t); Q.__pk = t; } Q.__still = t; }
    let f; try { f = A.at(t); } catch(e){ return base; } const o = Object.assign({}, base, f); o.pose = Object.assign({}, f.pose); delete o._fr;
    /* pick the next gimmick: still ≥ 4 s, one every 6–10 s, never two friends at once */
    if(!Q.gim && Q.__still != null && t - Q.__still >= 4 && t >= Q.gimT && t >= fr.busyUntil){ const fam = famList(id), sig = sigOf(id), useSig = !Q.__sigDone || rnd() < 0.35 || !fam.length;
      const k = useSig ? sig : fam[Math.floor(rnd() * fam.length)]; const dur = useSig ? FR_SIG[k].dur : ((Creatures.ALIVE.MK.get(k) || {}).dur || 1000);
      Q.gim = {k, sig: useSig, t0: t, dur: dur / 1000}; if(useSig) Q.__sigDone = 1; Q.gimT = t + Q.gim.dur + 6 + rnd() * 4; fr.busyUntil = t + Q.gim.dur + 0.4; A.poke(t); Q.played = (Q.played || []).concat(k).slice(-12); }
    if(Q.gim){ const ms = (t - Q.gim.t0) * 1000; if(ms > Q.gim.dur * 1000){ Q.gim = null; } else {
        const X = Q.gim.sig ? frAt(FR_SIGK[Q.gim.k], ms) : (Creatures.ALIVE.keyAt(Creatures.ALIVE.MK.get(Q.gim.k).K, ms) || {});
        Object.keys(X).forEach(k => { if(k === 'eye' || k === 'mk'){ return; } if(typeof X[k] === 'number' && typeof o.pose[k] === 'number') o.pose[k] += X[k]; });
        if(X.eye) o.pose.eye = X.eye; if(X.mk || Q.gim.sig){ o._ca = Object.assign({}, f._ca || {}, {mk: X.mk || null, stage: 'f', moment: Q.gim.k}); } o._fr = {k: Q.gim.k, sig: Q.gim.sig, ms}; } }
    return o; }
  function petFx(g, Q, id, anchors, o, x, y, size){ const F = o && o._fr; try { if(anchors && Creatures.aliveMarks && o && o._ca && o._ca.mk) Creatures.aliveMarks(g, anchors, o, x, y, o.face === 'right' ? -1 : 1, size); } catch(e){}
    if(!F || !F.sig) return; const S0 = FR_SIG[F.k], hit = S0.hit, u = (F.ms - hit) / 600, dir = o.face === 'right' ? 1 : -1, hx = x + dir * size * 0.32, hy = y - size * 0.72; if(u < 0 || u > 1) return;
    const k = size / 60, a = 1 - u; g.save(); g.globalAlpha = Math.max(0, Math.min(1, a * 1.4));
    if(S0.fx === 'sparks'){ for(let i = 0; i < 9; i++){ const an = -0.9 + i * 0.22 + (dir < 0 ? Math.PI : 0) * 0, r = (6 + 26 * u) * k * (0.6 + (i % 3) * 0.25), px = hx + Math.cos(an) * r * dir, py = hy + Math.sin(an) * r * 0.7 - 6 * k * u; g.fillStyle = i % 2 ? '#FFD23F' : '#FF7A2A'; g.beginPath(); g.arc(px, py, (2.6 - 1.6 * u) * k, 0, 7); g.fill(); } }
    else if(S0.fx === 'ring'){ const r = (6 + 18 * u) * k, cy = hy - 14 * k * u; g.strokeStyle = 'rgba(120,200,255,.9)'; g.lineWidth = 2.2 * k; g.beginPath(); g.ellipse(hx, cy, r, r * 0.55, 0, 0, 7); g.stroke(); for(let i = 0; i < 6; i++){ const an = i / 6 * 6.283; g.fillStyle = 'rgba(200,240,255,.95)'; g.beginPath(); g.arc(hx + Math.cos(an) * r, cy + Math.sin(an) * r * 0.55, 2.2 * k, 0, 7); g.fill(); } }
    else if(S0.fx === 'flower'){ const fx = x + dir * size * 0.08, fy = y - size * 1.02 - 4 * k * Math.sin(Math.min(1, u * 3) * 3.14), s = Math.min(1, u * 4) * 6 * k; g.globalAlpha = u > 0.8 ? (1 - u) * 5 : 1; for(let i = 0; i < 5; i++){ const an = i / 5 * 6.283 + u; g.fillStyle = '#FFB7E0'; g.beginPath(); g.arc(fx + Math.cos(an) * s * 0.8, fy + Math.sin(an) * s * 0.8, s * 0.55, 0, 7); g.fill(); } g.fillStyle = '#FFD23F'; g.beginPath(); g.arc(fx, fy, s * 0.45, 0, 7); g.fill(); }
    else if(S0.fx === 'seed' || S0.fx === 'fruit'){ const arc = Math.sin(u * Math.PI), px = hx + dir * (S0.fx === 'fruit' ? -10 + 10 * u : 4) * k, py = hy - (S0.fx === 'fruit' ? (1 - u) * 34 : arc * 30) * k; g.fillStyle = S0.fx === 'fruit' ? '#FF7A2A' : '#8A5A2B'; g.strokeStyle = '#2A1C14'; g.lineWidth = 1.4 * k; g.beginPath(); g.ellipse(px, py, 3.6 * k, 2.8 * k, u * 4, 0, 7); g.fill(); g.stroke(); }
    else if(S0.fx === 'click'){ g.fillStyle = '#2A1C14'; g.font = 'bold ' + Math.round(10 * k) + 'px sans-serif'; g.fillText('✦', hx + dir * 8 * k, hy - 10 * k * u); }
    else { const n = S0.fx === 'heart' ? 1 : 5; for(let i = 0; i < n; i++){ const px = x + (i - (n - 1) / 2) * 8 * k, py = y - (S0.fx === 'heart' ? size * 1.0 + 12 * k * u : 4 * k + 6 * k * u); g.fillStyle = S0.fx === 'heart' ? '#FF5C8A' : S0.fx === 'sparkle' ? '#FFE14D' : 'rgba(255,255,255,.85)';
        if(S0.fx === 'heart'){ g.font = Math.round(12 * k) + 'px sans-serif'; g.fillText('♥', px - 4 * k, py); } else { g.beginPath(); g.arc(px, py, (3 + 2 * u) * k, 0, 7); g.fill(); } } }
    g.restore(); }
  function stepPudIdle(dt){ if(!G.P || G.talking || G.battle || fr.job || G.reveal) { fr.stillT = 0; return; } const H = G.H, P0 = G.P, still = !P0.moving && (fr.mode === 'home' || !H.moving);
    fr.stillT = still ? fr.stillT + dt : 0; fr.idleT -= dt; if(fr.stillT < 4 || fr.idleT > 0 || G.pact || fr.mode === 'leave' || fr.mode === 'come') return; if(!P0.on && fr.mode !== 'home') return;
    const lean = fr.mode !== 'home' && Math.hypot(P0.x - H.x, P0.y - H.y) < 1.3, k = lean && rnd() < 0.5 ? 'hug' : FR_PUD[Math.floor(rnd() * FR_PUD.length)];
    fr.idleT = 6 + rnd() * 4; fr.pudPlayed = (fr.pudPlayed || []).concat(k).slice(-12);
    P.pAct(k, {again: true, on: k === 'toot' ? () => { P.tone(196, 0.09, {type: 'sawtooth', gain: 0.08, slide: 330}); setTimeout(() => P.tone(330, 0.16, {type: 'triangle', gain: 0.1, slide: 262}), 90); } : null}); }
  /* 🎨 FX: coals (ground) · steam / spray / dust (air) */
  function diamond(g, V, a, b, z){ const p = [V.toScreen(a, b, z), V.toScreen(a + 1, b, z), V.toScreen(a + 1, b + 1, z), V.toScreen(a, b + 1, z)]; g.beginPath(); g.moveTo(p[0].x, p[0].y); for(let i = 1; i < 4; i++) g.lineTo(p[i].x, p[i].y); g.closePath(); return p; }
  function groundFx(g, V){ fr.spots.forEach(sp => { if(sp.prop || !sp.cells.length) return; const cool = sp.spray ? Math.min(1, (G.t - sp.spray.t0 - 0.25) / 1.1) : sp.done ? 1 : 0; if(cool >= 1 && sp.done && G.t - (sp.hitT || -99) > 8) return;
      const fade = sp.done && sp.hitT ? Math.max(0, 1 - (G.t - sp.hitT - 2) / 6) : 1; if(fade <= 0) return;
      sp.cells.forEach(([a, b], n) => { const z = M.heightAt(a, b), fl = 0.75 + 0.25 * Math.sin(G.t * 5 + n * 1.7); g.save(); g.globalAlpha = fade; diamond(g, V, a + 0.06, b + 0.06, z);
        g.fillStyle = cool > 0 ? 'rgba(' + Math.round(70 + 60 * cool) + ',' + Math.round(55 + 70 * cool) + ',' + Math.round(50 + 75 * cool) + ',.92)' : '#3A2A22'; g.fill();
        if(cool < 1){ const c = V.toScreen(a + 0.5, b + 0.5, z), r = 10 * V.zoom; g.globalAlpha = fade * (1 - cool) * fl; const gr = g.createRadialGradient(c.x, c.y, 0, c.x, c.y, r * 2.2); gr.addColorStop(0, 'rgba(255,190,60,.95)'); gr.addColorStop(0.5, 'rgba(255,90,30,.55)'); gr.addColorStop(1, 'rgba(255,60,20,0)'); g.fillStyle = gr; diamond(g, V, a + 0.06, b + 0.06, z); g.fill();
          g.strokeStyle = 'rgba(255,210,90,' + (0.9 * fl).toFixed(2) + ')'; g.lineWidth = 1.6 * V.zoom; g.beginPath(); g.moveTo(c.x - r, c.y); g.lineTo(c.x - r * 0.2, c.y + r * 0.25); g.lineTo(c.x + r * 0.5, c.y - r * 0.2); g.moveTo(c.x - r * 0.1, c.y - r * 0.35); g.lineTo(c.x + r * 0.2, c.y + r * 0.3); g.stroke(); }
        g.restore(); }); }); }
  function airFx(g, V){ fr.spots.forEach(sp => { const zc = M.heightAt(Math.floor(sp.x), Math.floor(sp.y)), c = V.toScreen(sp.x, sp.y, zc), k = V.zoom;
      if(!sp.prop && !sp.done && !calmMo()){ for(let i = 0; i < 7; i++){ const ph = (G.t * 0.55 + i * 0.37) % 1, cell = sp.cells[(i * 3) % Math.max(1, sp.cells.length)], cc = cell ? V.toScreen(cell[0] + 0.5, cell[1] + 0.5, zc) : c;
          g.save(); g.globalAlpha = (1 - ph) * 0.9; g.fillStyle = i % 2 ? '#FFB12A' : '#FF6A2A'; g.beginPath(); g.arc(cc.x + Math.sin(G.t * 2 + i) * 6 * k, cc.y - ph * 46 * k, (2.4 - ph * 1.4) * k, 0, 7); g.fill(); g.restore(); } }
      if(sp.spray){ const age = G.t - sp.spray.t0; if(age > 2.6){ sp.spray = null; return; } const pp = G.P && G.P.it ? V.toScreen(G.P.it.x, G.P.it.y, G.P.it.z) : c, tip = {x: pp.x + (G.P.dir > 0 ? 1 : -1) * 26 * k, y: pp.y - 52 * k};
        if(age < 0.8){ for(let i = 0; i < 14; i++){ const u = Math.min(1, (age / 0.6) - i * 0.035); if(u <= 0) continue; const mx = (tip.x + c.x) / 2, my = Math.min(tip.y, c.y) - 60 * k, x = (1 - u) * (1 - u) * tip.x + 2 * u * (1 - u) * mx + u * u * c.x + Math.sin(i * 2.1) * 8 * k * u, y = (1 - u) * (1 - u) * tip.y + 2 * u * (1 - u) * my + u * u * c.y;
            g.save(); g.fillStyle = 'rgba(120,200,255,.92)'; g.beginPath(); g.ellipse(x, y, 3.2 * k, 4.2 * k, 0.4, 0, 7); g.fill(); g.restore(); } }
        if(!sp.prop) for(let i = 0; i < 8; i++){ const ph = Math.min(1, Math.max(0, (age - 0.35 - i * 0.12) / 1.4)); if(ph <= 0 || ph >= 1) continue; const cell = sp.cells[i % sp.cells.length], cc = V.toScreen(cell[0] + 0.5, cell[1] + 0.5, zc);
            g.save(); g.globalAlpha = (1 - ph) * 0.75; g.fillStyle = '#F4F7FA'; g.beginPath(); g.arc(cc.x + Math.sin(i) * 5 * k, cc.y - ph * 52 * k, (6 + 14 * ph) * k, 0, 7); g.fill(); g.restore(); } }
      if(sp.dust){ const age = G.t - sp.dust.t0; if(age > 1.1){ sp.dust = null; return; } const r = (14 + 70 * age) * k; g.save(); g.globalAlpha = Math.max(0, 0.8 - age * 0.75); g.strokeStyle = '#C9A879'; g.lineWidth = 4 * k * (1 - age * 0.7); g.beginPath(); g.ellipse(c.x, c.y, r, r * 0.45, 0, 0, 7); g.stroke();
        for(let i = 0; i < 8; i++){ const an = i / 8 * 6.283, d = r * 0.9; g.fillStyle = '#B08A5A'; g.beginPath(); g.arc(c.x + Math.cos(an) * d, c.y + Math.sin(an) * d * 0.45 - 10 * k * Math.sin(age * 3), 3 * k, 0, 7); g.fill(); } g.restore(); }
      if(sp.it && sp.it.touchFx){ const p = (G.t - sp.it.touchFx.t0) / (Props.TOUCH_MS / 1000); if(!Props.touchFx(g, V, sp.it, p)) sp.it.touchFx = null; } }); }
  const calmMo = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){ return false; } };
  function step(dt){ if(!G.ST || G.battle) return; stepHome(dt); stepPudIdle(dt); if(!G.talking){ pickGifts(); bumpHint(); } }
  function boot(){ buildSpots(); if(canHome() && wantHome()) placeHome(); }
  function info(){ return {mode: fr.mode, home: !!(G.save && G.save.pudHome), need: need(), canHome: canHome(), job: fr.job ? fr.job.id : null, pudPlayed: (fr.pudPlayed || []).slice(), spots: fr.spots.map(s => ({id: s.id, kind: s.kind, x: s.x, y: s.y, done: s.done, got: s.got, gift: !!s.gift, cells: s.cells.length, blocked: s.cells.filter(([a, b]) => !M.walk(a, b)).length}))}; }
  return {fr, boot, step, targets, petLook, petFx, groundFx, airFx, setHome, info, ask: id => ask(fr.spots.find(s => s.id === id)), need, canHome, homeSpot, sigOf, famList, placeHome, comeIn}; }

/* ═══════════ page glue ═══════════ */
function install(P){ css(); const G = P.G, W = G.W, box = document.getElementById('scr-play'), cvs = document.getElementById('iso');
  const me = {hides: [], friends: [], house: null, ring: null, alert: 0, drop: null, cam: null, peek: null, down: null, peekAt: null, shown: {}, busy: false, sneak: null, lockOn: false};
  const lang = () => G.lang === 'th' ? 'th' : 'en';
  const S = id => G.ST.status(id), q = id => P.qStep(id), help = () => (G.save && G.save.help) || 'guide';
  const noiYard = () => G.ST && (S('il1.m1') === 'done');
  /* 👥 Noi lives at her yard once Main 1 is done — W.spot('noi') follows her (old code + tests keep working) */
  const sp0 = W.spot.bind(W); W.spot = k => (k === 'noi' && noiYard() && q('il1.m2') !== 4) ? {x: YARD.noi.x, y: YARD.noi.y} : sp0(k);
  const add = it => { G.items.push(it); return it; }, drop = it => { if(it) G.items = G.items.filter(x => x !== it); };
  /* 🐾 old saves: a pet from the old creation screen → Main 1b done once Main 1 is (no quest, no lost pet) */
  function migrate(){ const s = G.save, d = G.ST.data; if(s.pet && S('il1.m1') === 'done' && (S('il1.m1b') === 'open' || S('il1.m1b') === 'hidden')){   /* never once you started it (your new pet is set before the hand-in) */   /* only once Main 1 is done (else Main 2 would jump in front of Main 1's own talks) */ delete d.q['il1.m1b']; if(d.done.indexOf('il1.m1b') < 0) d.done.push('il1.m1b'); if(d.track === 'il1.m1b') d.track = null;
      G.flags['il1.m1b'] = 1; G.flags['pet.got'] = 1; if(!s.yard || !s.yard.length) s.yard = ORDER.filter(k => k !== s.pet); s.petName = s.petName || ''; return true; } return false; }
  function yardIds(){ const s = G.save, k = q('il1.m1b'); let L2 = [];
    if(G.flags['pet.got']) L2 = (s.yard || []).slice();                 /* after the choice: the other two live at the yard */
    else if(k >= 1) L2 = ORDER.slice();                                 /* all 3 play in front of the yard while Noi draws the circle */
    else if(k === 0) L2 = (me.found || []).slice();                     /* each one you find runs to the yard */
    if(G.flags['rival.il1.r1'] && G.flags['tara.pet']) L2 = L2.filter(x => x !== G.flags['tara.pet']);   /* Tara took the counter (r1) */
    return L2; }
  function syncYard(){ const want = yardIds(); me.friends = me.friends.filter(f => { if(want.indexOf(f.apFriend) < 0){ drop(f); return false; } return true; });
    want.forEach((id, i) => { if(!me.friends.some(f => f.apFriend === id)){ const s = W.freeNear(YARD.spots[i].x, YARD.spots[i].y, 2) || YARD.spots[i]; me.friends.push(add(friendItem(G, id, s, {ph: i * 1.3, hearts: q('il1.m1b') >= 1}))); } }); }
  function syncHides(){ const on = q('il1.m1b') === 0, a = on ? G.ST.data.q['il1.m1b'] : null;
    if(!on){ me.hides.forEach(h => drop(h)); me.hides = []; return; }
    me.found = ORDER.filter((id, k) => (a[2] >> k) & 1);
    ORDER.forEach((id, k) => { const has = me.hides.find(h => h.apHide === id), found = (a[2] >> k) & 1; if(found && has){ drop(has); me.hides = me.hides.filter(h => h !== has); } if(!found && !has) me.hides.push(add(hideItem(G, id, HIDE[id], HIDE[id]))); }); }
  function syncHouse(){ if(G.flags['pet.got'] && !me.house){ const s = sp0('pethouse'); me.house = add(houseItem(G, {x: s.x + 0.55, y: s.y + 0.55})); } }
  function sync(){ migrate(); syncHides(); syncYard(); syncHouse(); syncI3(); }
  /* ①: walk up to a hiding pet → 👀 meet card */
  async function meetOne(id){ if(G.talking || G.battle) return; G.talking = true; document.body.classList.add('talking'); G.H.stop(); const H0 = HIDE[id]; lock({x: (H0.x + G.H.x) / 2, y: (H0.y + G.H.y) / 2});
    const a = G.ST.data.q['il1.m1b'], found = ORDER.filter((k, j) => (a[2] >> j) & 1);
    await meet(box, id, {lang: lang(), found, treats: G.save.treats, onTreat: () => { if(G.save.treats > 0) G.save.treats--; P.drawLv(); }});
    G.talking = false; document.body.classList.remove('talking'); free(); G.ST.event({do: 'tame', what: 'starter', at: [H0.x, H0.y]}); sound('pop'); sync(); P.drawTracker(); P.updateGoal(); P.saveLocal(); }
  /* ③–⑥: the circle talk is done → 🔀 choose → 🏷️ name → the end talk + the pet house lights up */
  async function chooseFlow(){ if(G.battle) return; G.talking = true; document.body.classList.add('talking'); G.H.stop();
    const id = await choose(box, {lang: lang()}); const nm = await nameCard(box, id, {lang: lang(), av: G.heroAv, me: G.save.name, clean: P.cleanName, ok: P.okName});
    const s = G.save; s.pet = id; s.petName = nm === petName(id) ? '' : nm; s.yard = ORDER.filter(k => k !== id); G.flags['pet.got'] = 1; Story.vars({pet: nm});
    G.talking = false; document.body.classList.remove('talking'); P.petFollow(); syncHouse(); G.ST.event({do: 'puzzle', what: 'petpick'}); sync(); P.saveLocal(); P.saveServer('pet');
    setTimeout(() => P.talkTo('noi'), 350); }
  function afterTalk(full, r){ const Q = r.quest;
    if(Q === 'il1.m1b' && r.mode === 'start' && r.go === 'accept'){ G.save.treats += 3; P.drawLv(); P.toast('🍖 ×3 — ' + (lang() === 'th' ? 'ขนมจากยายน้อย' : 'treats from Grandma Noi'), 2400); sync(); }
    if(Q === 'il1.m1b' && r.mode === 'step') setTimeout(chooseFlow, 300);
    if(Q === 'il1.m1b' && r.mode === 'end' && r.result){ G.flags['il1.m1b'] = 1; const rw = r.result.reward || {}; P.gainXp(rw.xp || 0, rw.coins || 0); sync(); P.saveLocal(); P.saveServer('m1b'); }   /* Story.meet already showed the QUEST DONE card */
    if(Q === 'il1.i3' && r.mode === 'start' && r.go === 'accept') setTimeout(practiceFlow, 300);
    sync(); }
  function onStep(r){ if(r.id === 'il1.m1b' && r.stepDone && r.step === 0){ P.toast('🐾 ' + (lang() === 'th' ? 'เจอครบ 3 ตัวแล้ว! กลับไปหายายน้อย' : 'All 3 found! Back to Grandma Noi'), 2600); sync(); }
    if(r.id === 'il1.i3') sync(); }
  /* 🎵 i3 ①: learn the tune with Pudding */
  async function practiceFlow(){ if(G.talking || G.battle || q('il1.i3') !== 0) return; G.talking = true; document.body.classList.add('talking'); G.H.stop(); P.pAct && P.pAct('cheer', {again: true});
    await practice(box, {lang: lang(), help: help(), av: G.heroAv}); G.talking = false; document.body.classList.remove('talking'); G.flags['tune.learned'] = 1; G.ST.event({do: 'puzzle', what: 'tune'}); sync(); P.drawTracker(); P.updateGoal(); P.saveLocal(); }
  /* 🥭 i3 ②: a ripe mango by the grove's quiet spot · ③: the gentle Mangobble's ring */
  function syncI3(){ const s3 = q('il1.i3');
    if(s3 === 1 && !me.drop){ const t = sp0('tamemob'), p = W.freeNear(t.x - 2, t.y + 1.5, 2) || t; me.drop = add(Object.assign(P.mangoItem(p, 0), {apMango: 1})); } if(s3 !== 1 && me.drop){ drop(me.drop); me.drop = null; }
    const m = G.mobs.find(x => x.tag === 'T'); if(s3 === 2 && m && !me.ring){ me.ring = add(ringItem(G, m, {r: 2.4, alert: () => me.alert})); me.ringMob = m; } if((s3 !== 2 || !m) && me.ring){ drop(me.ring); me.ring = null; sneak(false); } }
  function sneak(on){ L = lang(); if(on && !me.sneak){ me.sneak = el('div', 'ap-hud ap-sneak puff', w('sneak')); box.appendChild(me.sneak); me.spd0 = G.H.spd; G.H.spd = me.spd0 * 0.45; }
    if(!on && me.sneak){ me.sneak.remove(); me.sneak = null; if(me.spd0) G.H.spd = me.spd0; } if(me.sneak){ const g = document.getElementById('goal'), top = g && !g.classList.contains('hidden') ? g.getBoundingClientRect().bottom + 6 : 70; me.sneak.style.top = Math.round(top) + 'px'; } }
  async function tameMap(m){ if(G.talking || G.battle || me.busy) return; me.busy = true; G.talking = true; document.body.classList.add('talking'); G.H.stop(); sneak(false); lock({x: (m.x + G.H.x) / 2, y: (m.y + G.H.y) / 2});
    const s = G.save, r = await tame(box, {lang: lang(), id: m.id, name: (lang() === 'th' ? 'แมงโกบเบิล' : 'Mangobble'), calm: true, help: help(), snacks: s.snacks || {}, treats: s.treats, charm: s.charm || 0, elite: (m.list || [])[0] && m.list[0].elite});
    G.talking = false; document.body.classList.remove('talking'); free(); me.busy = false; me.alert = 0;
    if(r.res === 'tamed'){ const used = r.snack === 'fav' ? 'fav' : r.snack; s.snacks = s.snacks || {}; if(used === 'fav') s.snacks.mango = Math.max(0, (s.snacks.mango || 0) - 1); else if(used === 'any') s.treats = Math.max(0, s.treats - 1); P.drawLv();
      P.dropTag('T'); s.pets.push({id: m.id, lv: s.lv}); G.ST.event({do: 'tame', what: m.id}); const p = G.V.toScreen(G.H.it.x, G.H.it.y, G.H.it.z); P.sticker(p.x, p.y - 80 * G.V.zoom, '💖 ' + w('newFriend')); P.sound('win'); }
    else { if(help() === 'none' && r.snack === 'any') s.treats = Math.max(0, s.treats - 1); me.backoff = G.t + 2.5; }   /* 🚀 no help: the treat is used on the try */
    sync(); P.drawTracker(); P.updateGoal(); P.saveLocal(); }
  /* 🎥 camera: 🔒 story lock · 📍 show me · 👀 peek */
  function lock(at){ if(!at) return; endPeek(false); me.lockOn = true; G.V.follow({x: at.x, y: at.y, z: G.W.M.heightAt(Math.floor(at.x), Math.floor(at.y))}); }
  function free(){ if(!me.lockOn) return; me.lockOn = false; if(!me.cam && !me.peek) G.V.follow(G.H.it); }
  function showMe(target, auto){ if(!target || G.talking || G.battle || me.cam) return false; const tx = target.x, ty = target.y; me.cam = {pin: add(pinItem(G, {x: tx, y: ty}, '#FF5FA2'))};
    G.V.follow({x: tx, y: ty, z: G.W.M.heightAt(Math.floor(tx), Math.floor(ty))}); sound('pop'); const hold = fast() ? 500 : 1700;
    setTimeout(() => { if(!me.peek && !me.lockOn) G.V.follow(G.H.it); setTimeout(() => { if(me.cam){ drop(me.cam.pin); me.cam = null; } }, fast() ? 200 : 900); }, hold); return true; }
  function showBtn(qq){ L = lang(); return qq && qq.target ? '<button class="candy on ap-show" data-sound="tap">' + w('showMe') + '</button>' : ''; }
  /* 🎥 av-fix2 free look: the HUD stays after you let go; endPeek(true) = the camera glides back to the hero */
  function endPeek(back){ if(!me.peek) return; me.peek.remove(); me.peek = null; me.peekAt = null; if(back && !me.cam && !(me.lockOn && G.talking)){ me.lockOn = false; G.V.vel.x = G.V.vel.y = 0; G.V.follow(G.H.it); } }   /* a story lock left over after a talk never blocks the way back */
  if(cvs){ let down = null; cvs.addEventListener('pointerdown', e => { if(G.V._ptr && G.V._ptr.size > 1){ down = me.down = null; return; } down = me.down = {x: e.clientX, y: e.clientY, id: e.pointerId}; }, true);
    cvs.addEventListener('pointermove', e => { if(!down || e.pointerId !== down.id || G.talking || G.battle) return; L = lang(); if(G.V._ptr && G.V._ptr.size > 1) return; if(!me.peek && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 12){ me.peek = peekHud(box, G); me.peekAt = {x: G.H.x, y: G.H.y}; me.peek.edge.addEventListener('click', ev => { ev.stopPropagation(); endPeek(true); }); G.V.follow(null); } });
    const up = e => { if(!down || e.pointerId !== down.id) return; down = me.down = null; if(me.peek){ /* 🎥 av-fix2: stay where they looked (the glide keeps going) */ } else if(!G.V.followObj && !me.cam && !me.lockOn && !G.talking && !G.reveal && !G.intro) G.V.follow(G.H.it); };
    cvs.addEventListener('pointerup', up); cvs.addEventListener('pointercancel', up); }
  const goalEl = document.getElementById('goal'); if(goalEl) goalEl.addEventListener('click', e => { if(e.target.closest && e.target.closest('.ap-show')){ e.stopPropagation(); showMe(G.hint && G.hint.target); } });
  /* 🎯 goals for m1b + i3 (undefined = not mine) */
  function goal(){ const m = S('il1.m1b');
    if(m === 'open') return {text: (lang() === 'th' ? '💬 ยายน้อยอยู่ที่คอกช้าง' : '💬 Grandma Noi is at her elephant yard'), target: G.people.find(p => p.id === 'noi')};
    if(m === 'active'){ const a = G.ST.data.q['il1.m1b'], k = a[0];
      if(k === 0){ const n = ORDER.filter((id, j) => (a[2] >> j) & 1).length, nx = me.hides.slice().sort((x, y) => Math.hypot(x.x - G.H.x, x.y - G.H.y) - Math.hypot(y.x - G.H.x, y.y - G.H.y))[0]; return {text: '🐾 ' + (lang() === 'th' ? 'ตามหาเจ้าตัวเล็ก' : 'Find the 3 little ones'), n, of: 3, target: nx}; }
      return {text: lang() === 'th' ? '💬 กลับไปหายายน้อย' : '💬 Back to Grandma Noi', target: G.people.find(p => p.id === 'noi')}; }
    if(m === 'turnin') return {text: lang() === 'th' ? '💬 คุยกับยายน้อย' : '💬 Talk to Grandma Noi', target: G.people.find(p => p.id === 'noi')};
    const s3 = q('il1.i3');
    if(s3 === 0) return {text: lang() === 'th' ? '🎵 หัดเพลงเพื่อนรักกับพุดดิ้ง' : '🎵 Learn the Friend Tune with Pudding', target: {x: G.P.x, y: G.P.y}};
    if(s3 === 1) return {text: lang() === 'th' ? '🥭 เก็บมะม่วงสุก — ของโปรดของมัน' : '🥭 Pick a ripe mango — its favourite', target: me.drop};
    if(s3 === 2){ const m2 = G.mobs.find(x => x.tag === 'T'); return {text: lang() === 'th' ? '🕊️ ค่อย ๆ เดินเข้าวงของแมงโกบเบิล' : '🕊️ Walk slowly into the Mangobble’s circle', target: m2}; }
    return undefined; }
  /* ⏱️ each tick */
  function step(dt){ if(me.peek && (G.talking || G.reveal || G.battle || G.arr)) endPeek(false);
    if(me.peek && !me.down && me.peekAt && Math.hypot(G.H.x - me.peekAt.x, G.H.y - me.peekAt.y) > 0.05) endPeek(true);   /* 🎥 av-fix2: the hero moved → lock back */
    if(!G.ST || G.battle) return; const H = G.H;
    if(q('il1.i3') === 2 && !me.ring) syncI3();   /* the page adds the gentle Mangobble after onStep — pick up its ring on the next tick */
    /* ✋ av-int1: a hiding little one (🔍 Look) + Pudding's 🎵 Friend Tune (💬 Talk) wait for ✋ — targets() */
    if(!G.talking && q('il1.i3') === 1 && me.drop && Math.hypot(me.drop.x - H.x, me.drop.y - H.y) < 0.95){ const d = me.drop; drop(d); me.drop = null; G.save.snacks = G.save.snacks || {}; G.save.snacks.mango = (G.save.snacks.mango || 0) + 1; const p = G.V.toScreen(d.x, d.y, d.z); P.sticker(p.x, p.y - 30 * G.V.zoom, '🥭'); sound('pop'); G.ST.event({do: 'collect', what: 'mango'}); return; }
    const m = me.ring && me.ringMob; if(m && !G.talking){ const d = Math.hypot(m.x - H.x, m.y - H.y), inside = d < 2.4, rate = {guide: 0.22, tips: 0.32, none: 0.45}[help()] || 0.22;
      sneak(inside); if(inside){ me.alert += (H.moving ? rate : -0.45) * dt; me.alert = Math.max(0, Math.min(1, me.alert));
        if(me.alert >= 1){ const ax = m.x - H.x, ay = m.y - H.y, L2 = Math.hypot(ax, ay) || 1, nx = m.x + ax / L2 * 1.6, ny = m.y + ay / L2 * 1.6; if(W.M.walk(Math.floor(nx), Math.floor(ny))){ m.x = m.home.x = nx; m.y = m.home.y = ny; m.it.x = nx; m.it.y = ny; me.ring.x = nx; me.ring.y = ny; }
          me.alert = 0.35; const p = G.V.toScreen(m.it.x, m.it.y, m.it.z); P.sticker(p.x, p.y - 60 * G.V.zoom, '❗ ' + w('backs')); sound('nope'); }
        /* ✋ av-int1: close + calm = the 🐾 Pet target (targets) — you choose the moment */ }
      else me.alert = Math.max(0, me.alert - 0.45 * dt); }
    else if(me.sneak) sneak(false);
  }   /* 🎥 av-fix2: no peek radius any more — IsoKit keeps the camera on the islet */
  /* ✋ av-int1 (Aowu 16:40 · Q9 ⭐ A): what ✋ can do — the page picks the nearest in reach */
  function targets(){ if(!G.ST || G.talking || G.battle) return []; const H = G.H, out = [], th = lang() === 'th';
    if(q('il1.m1b') === 0) me.hides.forEach(h => out.push({at: h, k: 'look', name: th ? 'มีอะไรแอบอยู่?' : 'Something hiding?', pri: 3, r: 1.6, run: () => meetOne(h.apHide)}));
    if(q('il1.i3') === 0 && !me.busy && G.P) out.push({at: {x: G.P.x, y: G.P.y, it: G.P.it}, k: 'talk', name: th ? 'พุดดิ้ง' : 'Pudding', pri: 3, r: 2.0, run: () => { me.practiceT = G.t; practiceFlow(); }});
    const m = me.ring && me.ringMob; if(m && !(G.t < (me.backoff || 0)) && Math.hypot(m.x - H.x, m.y - H.y) < 2.4) out.push({at: m, k: 'pet', name: th ? 'แมงโกบเบิลขี้อาย' : 'Shy Mangobble', pri: 4, r: 1.6, run: () => tameMap(m)});
    return out; }
  AvPets.peekState = () => ({on: !!me.peek, follow: !!G.V.followObj});
  function frame(){ if(me.peek){ const g = document.getElementById('goal'), t = document.getElementById('trk'), top = Math.max(g && !g.classList.contains('hidden') ? g.getBoundingClientRect().bottom : 0, t ? t.getBoundingClientRect().bottom : 0, 60) + 8; me.peek.place(top); } }
  /* 🌱 Basic: Show me once by itself for each new goal (never while a test runs fast, unless it asks) */
  function autoShow(qq){ if(!qq || !qq.target || help() !== 'guide' || G.talking || G.battle || (window.AV_FAST && !window.AV_SHOWME)) return; const key = qq.text; if(me.shown[key]) return; me.shown[key] = 1;
    const d = Math.hypot(qq.target.x - G.H.x, qq.target.y - G.H.y); if(d > 6) setTimeout(() => showMe(qq.target, true), 400); }
  function boot(){ migrate(); if(G.flags['pet.got'] && G.save.petName) Story.vars({pet: G.save.petName}); else if(G.save.pet) Story.vars({pet: petName(G.save.pet)}); sync(); }
  const FR = friendsKit(P, {lang, S, q});   /* 🐾 av-pet2: walk-along friends + 🐘 Pudding home / Ask Pudding / idle gimmicks */
  const api = {VERSION, me, boot: () => { boot(); FR.boot(); }, step: dt => { step(dt); FR.step(dt); }, targets: () => targets().concat(FR.targets()), frame, afterTalk, onStep, goal, showBtn, showMe, autoShow, lock, free, migrate, sync, yardIds, meetOne, chooseFlow, tameMap, practiceFlow,
    fr: FR, petLook: FR.petLook, petFx: FR.petFx, groundFx: FR.groundFx, airFx: FR.airFx, pudHome: FR.setHome, pudInfo: FR.info, pudCan: FR.canHome};
  AvPets.page = api; return api; }

const AvPets = {VERSION, WORDS, POSE, ORDER, HIDE, YARD, FAV, SNACK_ICON, EL_COL, meterNeed, meterFill, tuneBeats, tuneWindows, tuneJudge,
  css, drawPetAt, circle, meet, choose, nameCard, tune, tame, practice, hideItem, pinItem, ringItem, friendItem, houseItem, peekHud, install, last: null, page: null, peekState: null,
  FRIENDS: 'av-pet2', FR_SPOTS, FR_SIG, FR_FAM, FR_NEED, FR_PUD, frKeys, frAt};
window.AvPets = AvPets;
})();
