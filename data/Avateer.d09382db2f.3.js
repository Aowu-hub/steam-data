
/* 🧳 Avateer — the game shell (av-s1a): screens · loop · HUD · input · talk · save. World + walkers + 🦘 gates = AvateerWorld · talk rows = AvateerStory_il1 · Pudding = CreatureElephant. */
(function(){
'use strict';
const $ = id => document.getElementById(id);
const SAVE_KEY = 'sp_avateer_s1:' + (CURRENT_PLAYER || 'guest'), AK = 0.62 * 1.55;   // avatar draw scale per zoom (the R0a2 sheet size)
const calm = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
/* 🌐 page words (StoryKit has its own) — ONE language at a time */
const WORDS = {
  en: {load: 'Packing for Elephant Jungle…', loadW: 'Building the islets…', loadT: 'Learning the island\'s stories…', jump: 'Jump', emote: 'Emote', swing: 'Swing',
    nameH: 'Name your traveller', nameP: 'Up to 10 letters — Grandma Noi will call you this!', nameGo: '✅ Let\'s go!', nameBad: 'Try another name 🙂',
    hop: '🦘 Hop over the puddles', hopStone: '🦘 Hop the stones', tapJump: 'Tap 🦘 to hop!', wave: '👋 Wave to Grandma Noi', talkNoi: '💬 Talk to Grandma Noi', inn: '🚶 Go to the inn',
    mango: '🥭 Follow the sand bar to Mango Grove', saved: '💾 Your journey is saved!', soon: '⚔️ Battles come next — soon!', soonGap: '🌉 The bridge to the camps opens soon!',
    slip: '💦 Whoops — slippery! Back to the start.', tooDeep: 'Too deep!', toot: 'pfrrt-TOOT!', zzz: 'zzz…', yay: 'Yay!', bag: 'Bag', w_wave: 'Wave', w_dance: 'Dance', w_breathe: 'Breathe', w_splash: 'Splash',
    breathe: '🫁 In… and out.', chest: '🥭 A hidden mango chest! (S1c opens it)', back: 'Back', pond: 'Pudding\'s Bath'},
  th: {load: 'กำลังเก็บกระเป๋าไปป่าช้าง…', loadW: 'กำลังสร้างเกาะ…', loadT: 'กำลังเรียนรู้เรื่องราวของเกาะ…', jump: 'กระโดด', emote: 'ท่าทาง', swing: 'ฟัน',
    nameH: 'ตั้งชื่อนักเดินทาง', nameP: 'ไม่เกิน 10 ตัวอักษร — ยายน้อยจะเรียกเธอแบบนี้!', nameGo: '✅ ไปกันเลย!', nameBad: 'ลองชื่ออื่นนะ 🙂',
    hop: '🦘 กระโดดข้ามแอ่งน้ำ', hopStone: '🦘 กระโดดข้ามก้อนหิน', tapJump: 'แตะ 🦘 เพื่อกระโดด!', wave: '👋 โบกมือให้ยายน้อย', talkNoi: '💬 คุยกับยายน้อย', inn: '🚶 ไปที่โรงเตี๊ยม',
    mango: '🥭 เดินตามสันทรายไปสวนมะม่วง', saved: '💾 บันทึกการเดินทางแล้ว!', soon: '⚔️ การต่อสู้มาเร็ว ๆ นี้!', soonGap: '🌉 สะพานไปค่ายเปิดเร็ว ๆ นี้!',
    slip: '💦 อุ๊ย ลื่น! กลับไปเริ่มใหม่นะ', tooDeep: 'ลึกไป!', toot: 'ปู๊ด-ตู๊ด!', zzz: 'คร่อก…', yay: 'เย้!', bag: 'กระเป๋า', w_wave: 'โบกมือ', w_dance: 'เต้น', w_breathe: 'หายใจ', w_splash: 'สาดน้ำ',
    breathe: '🫁 หายใจเข้า… ออก', chest: '🥭 หีบมะม่วงลับ! (เปิดได้ใน S1c)', back: 'กลับ', pond: 'บ่ออาบน้ำพุดดิ้ง'}};
const G = {lang: 'en', t: 0, ready: false, talking: false, save: null, W: null, V: null, H: null, P: null, J: null, ST: null, items: [], people: [], loop: null, lastTalk: {}, pending: null, act: null, pact: null,
  hint: null, played: [], foot: null, footT: 0, tootT: 8 + Math.random() * 8, saveT: 0, playSec: 0, flags: {}, intro: false, near: {}};
const w = k => (WORDS[G.lang] && WORDS[G.lang][k]) || WORDS.en[k] || k;
function toast(s, ms){ const el = $('toast'); el.textContent = s; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), ms || 2200); }
function sticker(x, y, text, col){ const el = document.createElement('div'); el.className = 'stk'; el.textContent = text; if(col) el.style.color = col; el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px'; $('scr-play').appendChild(el); setTimeout(() => el.remove(), 1500); }
function sound(k){ try { if(window.UISound) UISound.play(k); } catch(e){} }
function tone(f, d, o){ try { if(window.UISound && UISound.tone) UISound.tone(f, d, o || {}); } catch(e){} }
function tootSound(){ tone(196, 0.09, {type: 'sawtooth', gain: 0.08, slide: 330}); setTimeout(() => tone(330, 0.16, {type: 'triangle', gain: 0.1, slide: 262}), 90); }

/* ---------- 💾 save (device copy at once · the server file at the inn + when you leave; a newer copy wins) ---------- */
function blank(){ return {v: 1, name: '', lang: (navigator.language || '').toLowerCase().indexOf('th') === 0 ? 'th' : 'en', pos: null, story: null, flags: {}, moves: ['jump'], at: 0, playSec: 0}; }
function loadLocal(){ try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if(s && s.v === 1) return Object.assign(blank(), s); } catch(e){} return null; }
function snapshot(){ const s = G.save; s.lang = G.lang; s.flags = G.flags; s.playSec = Math.round(G.playSec); if(G.H) s.pos = {x: +G.H.x.toFixed(2), y: +G.H.y.toFixed(2)}; if(G.ST) s.story = G.ST.toJSON(); s.at = Date.now(); return s; }
function saveLocal(){ if(!G.save) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot())); } catch(e){} }
function saveServer(why){ if(!G.save || !CURRENT_PLAYER || !window.google || !google.script || !google.script.run) return; const s = snapshot();
  const file = {meta: {title: '🇹🇭 Elephant Jungle', chapter: 1, level: 1, name: s.name, playSec: s.playSec, quest: (G.ST && G.ST.tracked()) || '', why: why || ''}, data: s, at: s.at};
  try { google.script.run.withSuccessHandler(() => {}).withFailureHandler(() => {}).saveGameFile(CURRENT_PLAYER, GAME_ID, 1, JSON.stringify(file)); } catch(e){} }
function pullServer(){ return new Promise(res => { if(!CURRENT_PLAYER || !window.google || !google.script || !google.script.run) return res(null); let done = false; const end = v => { if(!done){ done = true; res(v); } }; setTimeout(() => end(null), 6000);
  try { google.script.run.withSuccessHandler(f => end(f && f.data && f.data.v === 1 ? f.data : null)).withFailureHandler(() => end(null)).loadGameFile(CURRENT_PLAYER, GAME_ID, 1); } catch(e){ end(null); } }); }

/* ---------- 🏷️ name your traveller (≤ 10 letters, kid-safe; the login name to start) ---------- */
const BAD = ['poop', 'butt', 'stupid', 'idiot', 'kill', 'dead', 'hate', 'sex', 'fuck', 'shit', 'damn', 'ควย', 'เหี้ย', 'สัส', 'มึง', 'โง่', 'ตาย', 'ฆ่า'];
function cleanName(s){ s = String(s || '').replace(/[^\p{L}\p{M}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim(); const a = Array.from(s); return a.slice(0, 10).join('').trim(); }
function okName(s){ const l = s.toLowerCase(); return s.length > 0 && !BAD.some(b => l.indexOf(b) >= 0); }
function askName(){ return new Promise(res => { const box = $('nm'), inp = $('nm-in'); $('nm-h').textContent = w('nameH'); $('nm-p').textContent = w('nameP'); $('nm-go').textContent = w('nameGo'); $('nm-bad').textContent = '';
  inp.value = cleanName(G.save.name || CURRENT_PLAYER || ''); box.classList.remove('hidden');
  const c = $('nm-av'), g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height); try { drawAvatar(g, {av: G.heroBase, name: inp.value || 'You', dir: 1}, 96, 206, 2.3, {t: 1, still: true, pose: {face: 'happy'}}); } catch(e){}
  const go = () => { const n = cleanName(inp.value); if(!okName(n)){ $('nm-bad').textContent = w('nameBad'); sound('nope'); return; } box.classList.add('hidden'); sound('tap'); res(n); };
  $('nm-go').onclick = go; inp.onkeydown = e => { if(e.key === 'Enter') go(); }; setTimeout(() => { try { inp.focus(); inp.select(); } catch(e){} }, 60); }); }

/* ---------- 🌐 language ---------- */
function setLang(l){ G.lang = l === 'th' ? 'th' : 'en'; Story.lang(G.lang); document.body.classList.toggle('th', G.lang === 'th'); document.documentElement.lang = G.lang;
  $('b-lang').innerHTML = G.lang === 'th' ? '<b>ไทย</b><span>EN</span>' : '<span>ไทย</span><b>EN</b>'; const bl = $('back-btn').querySelector('.bl'); if(bl) bl.textContent = w('back');
  if(G.padReady){ dressPads(); layoutPads(); } drawTracker(); updateGoal(true); }   /* the pad dress resets the petal ring → lay it out again */

/* ---------- 🧑 the hero, 🐘 Pudding, the villagers ---------- */
function baseAv(){ let av = null; try { const s = JSON.parse(localStorage.getItem('sp_av:' + CURRENT_PLAYER) || 'null'); if(s) av = s; } catch(e){} return av || defaultAvatar(CURRENT_PLAYER || 'Traveller'); }
function who(){ return {av: G.heroAv, name: G.save.name || 'You', dir: G.H.dir}; }
function drawHero(g, sx, sy, k){ const H = G.H, J = G.J, sc = k * AK, air = J && J.on ? J.air : (H.hop >= 0 ? Math.sin(Math.min(1, H.hop / 0.5) * Math.PI) : 0);
  if(air > 0.02){ g.fillStyle = 'rgba(30,40,20,.18)'; g.beginPath(); g.ellipse(sx, sy, 16 * k * (1 - air * 0.4), 6 * k * (1 - air * 0.4), 0, 0, 7); g.fill(); }
  const lift = air * 34 * k;
  if(G.act && !G.act.run.done){ Acting.draw(g, who(), sx, sy - lift, sc, G.act.run.at(G.t), {t: G.t}); if(G.act.key === 'avateer.breathe') balloon(g, sx + H.dir * 15 * k, sy - 50 * k, k, (G.t - G.act.t0) * 1000); return; }
  if(G.act && G.act.run.done) G.act = null;
  const crouch = J && J.on ? J.crouch : 0, land = J && J.on ? J.land : 0;
  let pose = null; if(air > 0.02) pose = {face: 'joy', armL: 2.2, armR: 2.4, kneeL: 0.9, kneeR: 0.5, legL: -0.4, legR: 0.3}; else if(crouch > 0.05 || land > 0.05){ const c = Math.max(crouch, land * 0.8); pose = {face: 'focused', kneeL: c * 0.9, kneeR: c * 0.9, bend: c * 0.18, armL: -0.4 * c, armR: -0.4 * c, dy: c * 3}; }
  drawAvatar(g, {av: G.heroAv, name: G.save.name, dir: H.dir, walkT: H.moving && !(J && J.on) ? H.walkT : 0}, sx, sy - lift, sc, pose ? {t: G.t, still: true, pose} : {t: G.t}); }
function balloon(g, x, y, k, ms){ const r = ms < 80 ? 0 : ms < 1280 ? 4 + 14 * (ms - 80) / 1200 : ms < 1680 ? 18 : ms < 2880 ? 18 - 15 * (ms - 1680) / 1200 : 0; if(r < 1) return;
  g.save(); g.fillStyle = '#FFB7C9'; g.strokeStyle = '#2A1C14'; g.lineWidth = 2 * k; g.beginPath(); g.arc(x, y, r * k, 0, 7); g.fill(); g.stroke(); g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.ellipse(x - r * k * 0.35, y - r * k * 0.35, r * k * 0.22, r * k * 0.14, -0.6, 0, 7); g.fill(); g.restore(); }
function pudView(P){ const away = P.view === 'NW'; return P.dir > 0 ? (away ? 'NE' : 'SE') : (away ? 'NW' : 'SW'); }
function drawPudding(g, sx, sy, k){ const P = G.P, o = {view: pudView(P), t: G.t};
  if(G.pact){ const ms = (G.t - G.pact.t0) * 1000, tot = Creatures.ELEPHANT.total(G.pact.k); if(ms > tot && !G.pact.hold) G.pact = null; else { o.eact = G.pact.k; o.ems = ms; if(!G.pact.fired && ms >= Creatures.ELEPHANT.contactAt(G.pact.k)){ G.pact.fired = true; if(G.pact.on) G.pact.on(); } } }
  if(!o.eact && P.moving) o.walk = P.walkT;
  Creatures.draw(g, 'pudding', sx, sy, 62 * k * AK, o); }
function pAct(k, o){ o = o || {}; if(G.pact && G.pact.k === k && !o.again) return; G.pact = {k, t0: G.t, fired: false, hold: !!o.hold, on: o.on || null}; }
function pudSays(text){ const p = G.V.toScreen(G.P.it.x, G.P.it.y, G.P.it.z); sticker(p.x, p.y - 70 * G.V.zoom * AK, text); }
function heroAct(key, o){ o = o || {}; if(!Acting.get('act', key) && !(Acting.T && Acting.T.acts[key])) return false; const run = Acting.play(who(), key, {t0: G.t, onContact: o.onContact}); G.act = {key, run, t0: G.t}; G.played.push(key); if(G.played.length > 20) G.played.shift(); return true; }
function personItem(id, at){ const p = Story.person(id) || {}, av = Object.assign({}, defaultAvatar(p.av || p.name || id), p.look || {}); const full = Story.rid(id);
  const top = Story.headTop('av1:' + full, (q, x, y) => drawAvatar(q, {av, name: p.av || id, dir: -1}, x, y, 1, {t: 0, still: true}), 120);   /* 📏 the mark follows the real head (av-r0e4b) */
  const it = {x: at.x, y: at.y, z: G.W.M.heightAt(Math.floor(at.x), Math.floor(at.y)), pid: full, id, dir: -1, face: 'happy',
    draw(g, sx, sy, k){ const sc = k * AK; drawAvatar(g, {av, name: p.av || id, dir: it.dir}, sx, sy, sc, {t: G.t, still: true, pose: {face: it.face}}); const m = G.ST.markerFor(full); if(m) Story.markerOver(g, sx, sy, top * sc, Story.sizes(80 * sc).marker, m, G.t); }};
  return it; }

/* ---------- 🗺️ boot: kits → islets → story → save → name → play ---------- */
async function boot(){ const lb = (p, txt) => { $('load-bar').style.width = Math.round(p * 100) + '%'; if(txt) $('load-text').textContent = txt; };
  G.save = loadLocal() || blank(); G.lang = G.save.lang || 'en'; Story.lang(G.lang); document.body.classList.toggle('th', G.lang === 'th'); lb(0.05, w('load'));
  const I = AvWorld.ISL.il1; await Props.need(I.needs || []); lb(0.25, w('loadT'));
  await AvWorld.need('story_il1'); lb(0.4, w('loadW'));
  const srv = await pullServer(); if(srv && Number(srv.at || 0) > Number(G.save.at || 0)) G.save = Object.assign(blank(), srv);
  G.flags = Object.assign({}, G.save.flags || {}); G.playSec = G.save.playSec || 0;
  G.W = AvWorld.build('il1', {moves: G.save.moves || ['jump']}); lb(0.55);
  G.ST = Story.state(G.save.story || {}, {lv: 1, ch: 1}); G.ST.onStep = onStep;
  G.heroBase = baseAv(); G.heroAv = G.heroBase;
  const st = G.save.pos && G.W.M.walk(Math.floor(G.save.pos.x), Math.floor(G.save.pos.y)) ? G.save.pos : G.W.spot('start');
  G.H = AvWorld.walker(G.W, {x: st.x, y: st.y, dir: -1}); G.H.hop = -1; G.H.it = {x: G.H.x, y: G.H.y, z: G.H.z, draw: drawHero};
  const pAt = G.ST.status('il1.m1') === 'open' ? G.W.spot('pudding') : G.W.freeNear(st.x - 0.7, st.y + 0.5, 2);
  G.P = AvWorld.follower(G.W, G.H, {x: pAt.x, y: pAt.y, gap: 0.85, on: G.ST.status('il1.m1') !== 'open'}); G.P.it = {x: G.P.x, y: G.P.y, z: G.P.z, draw: drawPudding};
  G.J = AvWorld.hopper(G.W, G.H, {onLand, onDone: () => { G.P.wait = null; updateGoal(); }, onSlip});
  G.people = Object.keys(I.people || {}).map(k => personItem(I.people[k], G.W.spot(k)));
  G.items = G.W.items.concat(G.people, [G.P.it, G.H.it]);
  G.V = Iso.view($('iso'), G.W.M, {bg: 'none', shadow: true, min: 0.45, max: 2.6, pad: {t: 70, b: 40}}); G.V.resize(); lb(0.7);
  const tall = G.V.H > G.V.W * 1.2, d = G.V.dpr || 1; G.V.zoom = Iso.stepFor((tall ? 1 : G.V.W > 1000 ? 1.5 : 1) * d) / d; G.V.follow(G.H.it); G.V.centerOn(G.H.x, G.H.y);
  controls(); lwStart(); setLang(G.lang);
  const pics = G.W.items.map(p => p.pic).filter(Boolean); await Iso.warm(pics, G.V, {onProgress: f => lb(0.7 + f * 0.3)});
  $('loading').style.opacity = 0; setTimeout(() => $('loading').classList.add('hidden'), 350);
  G.ready = true; G.loop = Iso.loop({update: step, render});
  if(!G.save.name){ const n = await askName(); G.save.name = n; saveLocal(); }
  Story.vars({name: G.save.name});
  if(G.ST.status('il1.m1') === 'open') intro(); else { drawTracker(); updateGoal(); }
}
/* 🛶 the boat lands → Noi + Pudding peeking → Main 1 starts */
function intro(){ G.intro = true; const b = G.W.spot('boat'); G.V.follow(null); G.V.centerOn(b.x, b.y); pAct('peek', {hold: false});
  setTimeout(() => { G.V.follow(G.H.it); tone(523, 0.12, {type: 'sine', gain: 0.08}); setTimeout(() => talkTo('noi', true), 700); }, calm ? 200 : 1300); }

/* ---------- 💬 talk ---------- */
function talkTo(id, force){ if(G.talking) return Promise.resolve(null); const full = Story.rid(id), p = G.people.find(x => x.pid === full);
  G.talking = true; document.body.classList.add('talking'); G.H.stop(); G.H.lock = true; closeEmotes(); if(p) p.dir = G.H.x < p.x ? -1 : 1;
  return Story.meet($('scr-play'), full, G.ST, {me: G.save.name, meAv: G.heroAv, basic: false, onLine}).then(r => { G.talking = false; G.H.lock = false; document.body.classList.remove('talking'); G.lastTalk[full] = G.t;
    if(p) p.face = 'happy'; afterTalk(full, r || {}); drawTracker(); updateGoal(); saveLocal(); return r; }); }
function onLine(n){ const p = G.people.find(x => x.pid === n.who); if(p && n.face) p.face = n.face;
  if(n.who === 'avateer.pudding' && n.act){ if(/toot/.test(n.act)) pAct('toot', {again: true, on: tootSound}); else if(/peek/.test(n.act)) pAct('peek', {again: true}); else if(/hug|trunk round/.test(n.act)) pAct('hug', {again: true}); else if(/doz|sleep|zzz/i.test(n.act)) pAct('sleep', {hold: true}); }
  if(n.who === 'avateer.pudding' && !n.act && n.face) { const f = Creatures.ELEPHANT.FACE[n.face]; if(f) pAct(f[0], {again: true}); } }
function afterTalk(full, r){ const q = r.quest;
  if(q === 'il1.m1' && r.mode === 'start' && r.go === 'accept'){ G.P.on = true; G.P.x = G.W.spot('pudding').x; G.pact = null; setTimeout(() => { if(G.ST.trackerInfo() && G.ST.status('il1.m1') === 'active') talkTo('noi'); }, 500); }
  if(r.go && String(r.go).indexOf('gest:') === 0){ const k = r.go.slice(5); setTimeout(() => doEmote(k, true), 250); }
}
function onStep(r){ if(r.id !== 'il1.m1') return; const a = G.ST.data.q['il1.m1'], k = a ? a[0] : 5;
  if(r.stepDone && r.step === 1){ setTimeout(() => talkLine('t.il1.m1.step2'), 650); }
  if(r.ready){ setTimeout(innEnd, 300); }
  drawTracker(); updateGoal(); saveLocal(); }
function talkLine(id){ if(G.talking) return; G.talking = true; document.body.classList.add('talking'); G.H.stop();
  Story.talk($('scr-play'), id, {state: G.ST, who: 'avateer.noi', me: G.save.name, meAv: G.heroAv, onLine}).then(() => { G.people.forEach(p => p.face = 'happy'); G.talking = false; document.body.classList.remove('talking'); drawTracker(); updateGoal(); }); }
/* 🛏️ step ⑤ at the inn: Tum's welcome = 💾 the first save · the ⭐-clip photo · Pudding falls asleep → QUEST DONE */
function innEnd(){ if(G.talking) return setTimeout(innEnd, 400); G.talking = true; document.body.classList.add('talking'); G.H.stop();
  Story.talk($('scr-play'), 't.il1.m1.end', {state: G.ST, who: 'avateer.noi', me: G.save.name, meAv: G.heroAv, label: '📖 ' + Story.qtitle(Story.get('il1.m1')), quest: 'il1.m1', onLine: n => { onLine(n); if(n.who === 'avateer.tum' && /save/.test(n.act || '')){ G.flags['seen.save'] = 1; saveLocal(); saveServer('inn'); toast(w('saved')); sound('win'); } if(/photo/.test(n.act || '')) G.flags['seen.taraPhoto'] = 1; }})
    .then(() => { const res = G.ST.turnIn('il1.m1'); G.flags['il1.m1'] = 1; G.flags['map.half'] = 1; G.flags['emote.breathe'] = 1; saveLocal(); saveServer('m1');
      return res ? Story.done($('scr-play'), 'il1.m1', {reward: res.reward}) : null; })
    .then(() => { G.talking = false; document.body.classList.remove('talking'); pAct('sleep', {hold: true}); G.P.hold = true; setTimeout(() => { G.P.hold = false; G.pact = null; pAct('cheer'); }, 3500); drawTracker(); updateGoal(); }); }

/* ---------- 🦘 hops ---------- */
function onLand(k, it, J){ sound('pop'); const def = Props.DEFS[it.prop] || {}, target = it.prop === 'gate_jump_puddles' ? 'puddle' : it.prop === 'gate_jump_stones' ? 'stone' : it.prop === 'gate_jump_gap' ? 'gap' : 'stone';
  const res = G.ST.event({do: 'move', move: 'jump', target}); if(Math.hypot(G.P.x - G.H.x, G.P.y - G.H.y) < 4) pAct('cheer', {again: true, on: () => tone(660, 0.06, {type: 'triangle', gain: 0.06})});
  if(def.wet && it.prop === 'gate_jump_stones' && k === J.hops.length - 1 && !G.flags['seen.mangochest']){ G.flags['seen.mangochest'] = 1; setTimeout(() => toast(w('chest'), 3000), 400); }
  if(!res.length){ updateGoal(); } }
function onSlip(it){ sound('nope'); const p = G.V.toScreen(G.H.it.x, G.H.it.y, G.H.it.z); sticker(p.x, p.y - 60 * G.V.zoom, '💦'); toast(w('slip')); pAct('toot', {again: true, on: tootSound}); }
function jumpPress(){ if(G.talking) return; const J = G.J; if(J.on){ if(J.busy){ G.pending = 'hop'; return; } J.press(); return; }   /* a press while a hop is still landing is kept for the next hop (kids press early) */
  const g = AvWorld.gateNear(G.W, G.H, 1.25); if(g){ J.start(g); G.pending = 'hop'; if(G.P && Math.hypot(G.P.x - G.H.x, G.P.y - G.H.y) < 5){ const s = g.hops[g.n]; G.P.wait = G.W.freeNear(s.x - (g.dir > 0 ? 0.6 : -0.6), s.y + 0.5, 1.5); } return; }
  const grey = G.W.gates.find(it => it.state === 'grey' && Props.hops(it).length && Math.hypot(Props.hops(it)[0].x - G.H.x, Props.hops(it)[0].y - G.H.y) < 1.6); if(grey){ toast(w('soonGap')); return; }
  if(G.H.hop < 0){ G.H.hop = 0; sound('pop'); } }

/* ---------- 🎭 emotes ---------- */
const EMOTE_ACT = {wave: 'beat.wave', dance: 'dance', breathe: 'avateer.breathe', splash: 'avateer.splash'};
function emoteList(){ const L = ['wave', 'dance']; if(G.flags['emote.breathe'] || stepIs(3)) L.push('breathe'); if(nearPond()) L.push('splash'); return L; }
function openEmotes(){ const box = $('emotes'); if(!box.classList.contains('hidden')) return closeEmotes(); box.innerHTML = '';
  const IC = {wave: '👋', dance: '💃', breathe: '🫁', splash: '💦'}; emoteList().forEach(k => { const b = document.createElement('button'); b.className = 'candy'; b.setAttribute('data-sound', 'tap'); b.dataset.k = k; b.innerHTML = IC[k] + '<small>' + w('w_' + k) + '</small>'; b.onclick = e => { e.stopPropagation(); closeEmotes(); doEmote(k); }; box.appendChild(b); });
  box.classList.remove('hidden'); const r = $('b-emote').getBoundingClientRect(), bw = box.getBoundingClientRect(); box.style.left = Math.max(8, Math.min(innerWidth - bw.width - 8, r.left + r.width / 2 - bw.width / 2)) + 'px'; box.style.top = Math.max(60, r.top - bw.height - 10) + 'px'; }
function closeEmotes(){ $('emotes').classList.add('hidden'); }
function doEmote(k, fromTalk){ if(!heroAct(EMOTE_ACT[k])) return; G.H.stop(); sound('tap');
  const noi = G.people.find(p => p.id === 'noi'), d = noi ? Math.hypot(noi.x - G.H.x, noi.y - G.H.y) : 99;
  if(k === 'wave' && d < 4.5){ if(noi) noi.dir = G.H.x < noi.x ? -1 : 1; G.ST.event({do: 'gesture', what: 'wave', who: 'noi'}); }
  if(k === 'breathe'){ G.flags['emote.breathe'] = 1; toast(w('breathe'), 2600); if(Math.hypot(G.P.x - G.H.x, G.P.y - G.H.y) < 4) setTimeout(() => pAct('breathe', {again: true}), 300); }
  if(k === 'splash'){ G.flags['seen.splash'] = 1; pAct('splash', {again: true}); }
  if(k === 'dance' && Math.hypot(G.P.x - G.H.x, G.P.y - G.H.y) < 4) pAct('cheer', {again: true});
  G.ST.event({do: 'gesture', what: k}); drawTracker(); updateGoal(); }
const nearPond = () => { const s = G.W.spot('pond'); return s && Math.hypot(s.x - G.H.x, s.y - G.H.y) < 3; };

/* ---------- 📖 tracker · goal pill · the 🌱 Basic guide ---------- */
function stepIs(k){ const a = G.ST && G.ST.data.q['il1.m1']; return !!a && a[0] === k; }
function drawTracker(){ if(!G.ST) return; const host = $('trk'); Story.tracker(host, G.ST, {slim: innerHeight < 460}); placeGoal(); }
function goalNow(){ if(!G.ST) return null; const m1 = G.ST.status('il1.m1'); if(m1 === 'open' || m1 === 'hidden') return null;
  if(m1 === 'done'){ const z = G.W.zoneAt(G.H.x, G.H.y); return z === 'landing' && !G.flags['seen.mango'] ? {text: w('mango'), target: G.W.spot('mango')} : null; }
  const a = G.ST.data.q['il1.m1']; if(!a) return null; const s = a[0], noi = G.W.spot('noi');
  if(s === 0) return {text: w('talkNoi'), target: noi};
  if(s === 1){ const g = G.W.gate('g.puddles'); return {text: w('hop'), n: a[1], of: 3, target: Props.hops(g)[0], gate: g}; }
  if(s === 2) return {text: w('wave'), target: noi, emote: true};
  if(s === 3) return {text: w('talkNoi'), target: noi};
  if(s === 4) return {text: w('inn'), target: G.W.spot('inn')};
  return null; }
function updateGoal(force){ const el = $('goal'), q = goalNow(); G.hint = q; if(!q){ el.classList.add('hidden'); return; }
  const html = q.text + (q.of ? '<i>' + q.n + ' / ' + q.of + '</i>' : ''); if(force || el.innerHTML !== html) el.innerHTML = html; el.classList.remove('hidden'); placeGoal(); }
function placeGoal(){ const el = $('goal'), t = $('top').getBoundingClientRect(), tr = $('trk').getBoundingClientRect(), nav = $('back-btn-nav'), nb = nav ? nav.getBoundingClientRect().bottom : 0; el.style.top = Math.round(Math.max(t.bottom, tr.bottom, nb) + 8) + 'px'; }
function guide(){ const q = G.hint, hand = $('hand'); let show = false;
  if(q && q.gate && !G.talking){ const J = G.J, near = J.on || AvWorld.gateNear(G.W, G.H, 1.25); if(near && !(J.on && J.busy)){ const r = $('b-jump').getBoundingClientRect(); hand.style.left = (r.left - 30) + 'px'; hand.style.top = (r.top + r.height * 0.35) + 'px'; hand.style.transform = 'rotate(70deg)'; show = true; } }
  if(q && q.emote && !G.talking && $('emotes').classList.contains('hidden')){ const noi = G.W.spot('noi'); if(Math.hypot(noi.x - G.H.x, noi.y - G.H.y) < 4.5){ const r = $('b-emote').getBoundingClientRect(); hand.style.left = (r.left - 30) + 'px'; hand.style.top = (r.top + r.height * 0.3) + 'px'; hand.style.transform = 'rotate(70deg)'; show = true; } }
  if(q && q.emote && !$('emotes').classList.contains('hidden')){ const b = $('emotes').querySelector('[data-k="wave"]'); if(b){ const r = b.getBoundingClientRect(); hand.style.left = (r.left + r.width * 0.45) + 'px'; hand.style.top = (r.bottom - 6) + 'px'; hand.style.transform = 'rotate(0deg)'; show = true; } }
  hand.classList.toggle('hidden', !show); $('b-jump').classList.toggle('pz-glow', !!(q && q.gate) && show); }
/* 👣 footsteps to the goal (recomputed twice a second, never every frame) */
function footsteps(){ const q = G.hint; if(!q || !q.target || G.talking){ G.foot = null; return; } const d = Math.hypot(q.target.x - G.H.x, q.target.y - G.H.y); if(d < 2.2 || G.J.on){ G.foot = null; return; }
  const p = Iso.path(G.W.M, {x: G.H.x, y: G.H.y}, G.W.freeNear(q.target.x, q.target.y, 2)); G.foot = p && p.length > 2 ? p.slice(1, 14) : null; }

/* ---------- ⏱️ loop ---------- */
function step(dt){ if(!G.ready) return; G.playSec += dt; G.H.step(dt); G.J.step(dt); if(G.pending === 'hop' && G.J.on && !G.J.busy){ G.pending = null; G.J.press(); }
  if(G.H.hop >= 0){ G.H.hop += dt; if(G.H.hop > 0.5) G.H.hop = -1; }
  G.P.step(dt); if(G.act && G.act.run.done) G.act = null;
  G.footT -= dt; if(G.footT <= 0){ G.footT = 0.5; footsteps(); }
  watch(dt); }
function watch(dt){ if(G.talking || !G.ST) return; const H = G.H, z = G.W.zoneAt(H.x, H.y);
  /* auto-talk: a person with a NEW quest or a talk step, when you stop next to them */
  G.people.forEach(p => { const d = Math.hypot(p.x - H.x, p.y - H.y), m = G.ST.markerFor(p.pid); if(d < 1.5 && !H.moving && !G.J.on && m && (m.state === 'open' || m.state === 'turnin') && G.t - (G.lastTalk[p.pid] || -99) > 2.5) talkTo(p.id); });
  /* step ⑤ go inn */
  if(stepIs(4)){ const s = G.W.spot('inn'); if(Math.hypot(s.x - H.x, s.y - H.y) < 1.3) G.ST.event({do: 'go', what: 'inn'}); }
  /* 🥭 islets */
  if(z === 'mango' && !G.flags['seen.mango']){ G.flags['seen.mango'] = 1; pAct('cheer', {again: true}); setTimeout(() => pudSays(w('yay')), 200); updateGoal(); saveLocal(); }
  const pond = G.W.spot('pond'), stream = G.W.spot('stream');
  if(pond && Math.hypot(pond.x - G.P.x, pond.y - G.P.y) < 2.4 && !G.near.pond){ G.near.pond = 1; pAct('splash', {again: true}); } else if(pond && Math.hypot(pond.x - G.P.x, pond.y - G.P.y) > 4) G.near.pond = 0;
  if(stream && Math.hypot(stream.x - G.P.x, stream.y - G.P.y) < 2.6 && !G.near.stream){ G.near.stream = 1; pAct('scared', {again: true}); setTimeout(() => pudSays(w('tooDeep')), 250); } else if(stream && Math.hypot(stream.x - G.P.x, stream.y - G.P.y) > 5) G.near.stream = 0;
  /* 🐘 she toots now and then (off-key — it makes everyone laugh) */
  G.tootT -= dt; if(G.tootT <= 0){ G.tootT = 14 + Math.random() * 12; if(G.P.on && !G.pact && !G.P.moving) pAct('toot', {on: () => { tootSound(); pudSays(w('toot')); }}); }
  /* a device copy every 20 s of play */
  G.saveT += dt; if(G.saveT > 20){ G.saveT = 0; saveLocal(); } }
function render(alpha, t){ G.t = t; const H = G.H, P = G.P, lerp = (a, b) => a + (b - a) * alpha;
  H.it.x = lerp(H.px, H.x); H.it.y = lerp(H.py, H.y); H.it.z = H.z; P.it.x = lerp(P.px, P.x); P.it.y = lerp(P.py, P.y); P.it.z = P.z;
  try { Props.tick(G.W.items, t); Props.seeThrough(G.V, G.W.items, [H.it, P.it]); } catch(e){}
  Iso.frame(G.V, {items: G.items, t, groundFx: groundFx, airFx: airFx});
  guide(); }
function groundFx(g, V){ if(G.foot && Iso.footsteps) try { Iso.footsteps(g, [{x: G.H.x, y: G.H.y}].concat(G.foot), (x, y) => V.toScreen(x, y, G.W.M.heightAt(Math.floor(x), Math.floor(y))), {t: G.t, col: 'rgba(255,178,26,.9)', pulse: !calm, size: 3.6 * V.zoom}); } catch(e){} }
function airFx(g, V){ const q = G.hint, J = G.J;
  G.W.gates.forEach(it => { if(it.touchFx){ const p = (G.t - it.touchFx.t0) / (Props.TOUCH_MS / 1000); if(!Props.touchFx(g, V, it, p)) it.touchFx = null; } });
  if(q && q.gate){ const n = J.on && J.on === q.gate ? J.next() : 1; if(n > 0) Props.hopHint(g, V, q.gate, n, G.t); }
  else if(J.on){ const n = J.next(); if(n >= 0 && n < J.hops.length) Props.hopHint(g, V, J.on, J.dir > 0 ? n : n + 1, G.t); } }

/* ---------- 🕹️ controls ---------- */
function controls(){
  G.V.onTap = cell => { if(!cell || G.talking) return; closeEmotes(); const x = cell.i + 0.5, y = cell.j + 0.5, p = G.people.find(q => Math.hypot(q.x - x, q.y - y) < 1.2);
    if(p){ const s = G.W.freeNear(p.x + (G.H.x < p.x ? -0.9 : 0.9), p.y + 0.3, 2); G.H.to(s.x, s.y).then(ok => { if(ok || Math.hypot(p.x - G.H.x, p.y - G.H.y) < 2) talkTo(p.id); }); return; }
    G.H.to(x, y); };
  const st = $('stick'), kn = st.querySelector('.knob'), T = UI.stickTracker(st, {player: CURRENT_PLAYER}); let on = null;
  const move = v => { const m = Math.min(1, v.m); kn.style.transform = 'translate(' + (v.fx * 30) + '%,' + (v.fy * 30) + '%)';
    if(m < 0.2){ G.H.vx = G.H.vy = 0; return; } const sx = v.x / (v.m || 1), sy = v.y / (v.m || 1), wx = sx / 2 + sy, wy = sy - sx / 2, L = Math.hypot(wx, wy) || 1; G.H.vx = wx / L * m; G.H.vy = wy / L * m; };
  st.addEventListener('pointerdown', e => { if(G.talking) return; closeEmotes(); on = e.pointerId; st.setPointerCapture(e.pointerId); move(T.start(e)); e.preventDefault(); });
  UI.onFastMove(st, e => { if(e.pointerId === on) move(T.at(e)); });
  const up = e => { if(e.pointerId !== on) return; on = null; G.H.vx = G.H.vy = 0; kn.style.transform = ''; }; st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  const press = (b, fn) => b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if(!G.talking) fn(); });
  press($('b-jump'), jumpPress); press($('b-emote'), openEmotes); press($('b-swing'), () => { toast(w('soon')); sound('nope'); });
  $('b-lang').onclick = () => { setLang(G.lang === 'th' ? 'en' : 'th'); saveLocal(); };
  addEventListener('keydown', e => { if(G.talking || e.repeat || e.target.tagName === 'INPUT') return; if(e.code === 'Space'){ jumpPress(); e.preventDefault(); } if(e.code === 'KeyE') openEmotes(); });
  const keys = {}; const kv = () => { const x = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0), y = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0);
    if(!x && !y){ if(on == null){ G.H.vx = G.H.vy = 0; } return; } const wx = x / 2 + y, wy = y - x / 2, L = Math.hypot(wx, wy); G.H.vx = wx / L; G.H.vy = wy / L; };
  addEventListener('keydown', e => { if(e.target.tagName === 'INPUT') return; if(/^(Arrow|Key[WASD])/.test(e.code)){ keys[e.code] = 1; if(!G.talking) kv(); } }); addEventListener('keyup', e => { if(keys[e.code]){ delete keys[e.code]; kv(); } });
  addEventListener('pagehide', () => { saveLocal(); saveServer('leave'); }); document.addEventListener('visibilitychange', () => { if(document.hidden){ saveLocal(); saveServer('hide'); } });
  dressPads(); G.padReady = true; layoutPads(); addEventListener('resize', () => requestAnimationFrame(() => { layoutPads(); drawTracker(); placeGoal(); }));
}
function dressPads(){ UI.pad.dress($('b-jump'), '🦘', w('jump'), '#22A867', true); UI.pad.dress($('b-emote'), '🎭', w('emote'), '#9B5DE5'); UI.pad.dress($('b-swing'), '⚔️', w('swing'), '#AEB6C2'); }
function layoutPads(){ const top = $('top'), nav = $('back-btn-nav'); top.style.paddingLeft = '';   /* the 🧭 nav group (UI.navBar) sits out of the flow — the 📖 tracker starts after it */
  if(nav && getComputedStyle(nav).position !== 'static'){ const nr = nav.getBoundingClientRect(); if(nr.width) top.style.paddingLeft = Math.max(0, Math.round(nr.right - top.getBoundingClientRect().left + 8)) + 'px'; }
  /* 📖 the tracker gets its own row under the top buttons when the row is too tight (phones upright) */
  const trk = $('trk'); trk.classList.remove('row2'); const rr = $('right').getBoundingClientRect(), tl = top.getBoundingClientRect().left + (parseFloat(top.style.paddingLeft) || 0);
  if(rr.left - tl - 16 < 220){ trk.classList.add('row2'); trk.style.top = Math.round(Math.max(rr.bottom, nav ? nav.getBoundingClientRect().bottom : 0) + 6) + 'px'; } else trk.style.top = '';
  const box = $('btns'); UI.pad.petals(box, $('b-jump'), [$('b-emote'), $('b-swing')], {fit: true});
  const st = $('stick'); st.style.width = st.style.height = ''; const sr = st.getBoundingClientRect(), left = Math.min(...[...box.querySelectorAll('button')].filter(x => x.offsetParent).map(x => x.getBoundingClientRect().left));
  if(left - sr.left - 18 < sr.width) st.style.width = st.style.height = Math.max(104, Math.round(left - sr.left - 18)) + 'px';
  $('toast').style.bottom = Math.round(innerHeight - Math.min(st.getBoundingClientRect().top, box.getBoundingClientRect().top) + 10) + 'px';
  if(G.V){ const t = Math.max($('top').getBoundingClientRect().bottom, trk.getBoundingClientRect().bottom) + 6, b = innerHeight - Math.min(st.getBoundingClientRect().top, box.getBoundingClientRect().top) + 6; G.V.setPad({t: Math.round(t), b: Math.round(Math.min(b, innerHeight * 0.4))}); } }

/* ---------- 🎒 bag + 👗 my look (LootKit + AvatarWear + LootWear, av-wear4) — the bag + look live in the save's device copy for S1 ---------- */
const LW = (window.LootWear && window.Loot) ? {bag: null, look: {}} : null;
function lwKey(k){ return 'sp_avateer_' + k + ':' + (CURRENT_PLAYER || 'guest'); }
function lwSave(){ try { localStorage.setItem(lwKey('bag'), JSON.stringify(LW.bag.toJSON())); localStorage.setItem(lwKey('look'), JSON.stringify(LW.look)); } catch(e){} }
function lwStart(){ if(!LW){ $('b-bag').classList.add('hidden'); return; } let s = null, l = null; try { s = JSON.parse(localStorage.getItem(lwKey('bag')) || 'null'); l = JSON.parse(localStorage.getItem(lwKey('look')) || 'null'); } catch(e){}
  LW.bag = Loot.bag(s || {}); LW.look = l || {};
  if(!s){ ['head', 'body', 'feet'].forEach((sl, i) => { LW.bag.add({base: 'wear.isl.jungle.' + sl, tier: 0, lv: 1, seed: 11 + i, sock: 0, runes: []}); LW.bag.wear(LW.bag.g.length - 1, sl); }); lwSave(); }
  const dress = () => { try { G.heroAv = LootWear.dressFor(G.heroBase, LW.bag, LW.look); } catch(e){ G.heroAv = G.heroBase; } }; dress();
  $('b-bag').onclick = () => { if(G.talking) return; if(Loot.react) Loot.react(); document.body.classList.add('lw-open');
    LootWear.bagSheet($('scr-play'), LW.bag, {av: G.heroBase, look: LW.look, jobs: {}, theme: 'gold', basic: true,
      onLook: l => { LW.look = l; dress(); lwSave(); }, onChange: () => { dress(); lwSave(); }, onClose: () => document.body.classList.remove('lw-open')}); }; }

window.AVATEER = {G, WORDS, setLang, talkTo, jumpPress, doEmote, openEmotes, cleanName, okName, saveLocal, saveServer, snapshot, goalNow, stepIs};
boot().catch(e => { if(window.console) console.error(e); $('load-text').textContent = '⚠️ ' + (e && e.message || e); });
})();
