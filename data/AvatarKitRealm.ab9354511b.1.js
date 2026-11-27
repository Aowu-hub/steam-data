
/* ================= 👑 AvatarKitRealm (ar-r2-6b, 🏰⚔️ AvataRealm chat, plan §18z) — Realm Leaders worn EVERYWHERE =================
   Costume line `realmlead` (v 0 🦖 Rex King · 1 🤖 Robo Boss · 2 🍳 Head Chef · 3 🍽️ Grand Gourmand). AvatarKit drawAvatar line 1 calls AKRealm.dress(a):
   a COPY of the avatar gets page wear (cw head · hand · suit · back, td) → the chained AK_WEAR draws the leader pieces, so they ride the rig in every pose.
   Trims = the player's OUTFIT colour. The saved avatar never changes. Page wear already on the avatar (AvataRealm battle heroes, TD-Stories outfits) wins.
   ONE copy of the pieces: AvataRealmLooks reads AKRealm.PIECES for its battle heroes + the roles that share pieces. Built from Test Harness/avatarealm/r2/realm_wear.js. */
(function(){
'use strict';
const D = (function(){ const TAU = Math.PI * 2;   // the AVD drawing helpers the pieces use (copied from avatarealm/src/01_draw.js — same pixels)
function rgb(h){ const n = parseInt(String(h).replace('#', ''), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgba(h, a){ const c = rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
function piece(g, parts, rim, rw){
  g.save(); g.lineJoin = 'round'; g.lineCap = 'round';
  if(rw > 0){ g.strokeStyle = rim; g.lineWidth = rw * 2; parts.forEach(p => { if(p.noRim) return; g.beginPath(); p.path(g); g.stroke(); if(p.closedFill !== false){ g.fillStyle = rim; g.fill(); } }); }
  parts.forEach(p => { g.beginPath(); p.path(g); if(p.fill){ g.fillStyle = typeof p.fill === 'function' ? p.fill(g) : p.fill; g.fill(); } if(p.after) p.after(g); });
  g.restore();
}
function lin(g, x0, y0, x1, y1, stops){ const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(Array.isArray(c) ? c[0] : i / Math.max(1, stops.length - 1), Array.isArray(c) ? c[1] : c)); return gr; }
function rad(g, x, y, r0, r1, stops){ const gr = g.createRadialGradient(x, y, r0, x, y, r1); stops.forEach((c, i) => gr.addColorStop(Array.isArray(c) ? c[0] : i / Math.max(1, stops.length - 1), Array.isArray(c) ? c[1] : c)); return gr; }
function glow(g, x, y, r, col, a){ g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = rad(g, x, y, 0, r, [[0, rgba(col, a == null ? 0.55 : a)], [1, rgba(col, 0)]]); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.restore(); }
function star(g, x, y, r1, r2, n, rot){ n = n || 5; rot = rot == null ? -Math.PI / 2 : rot; for(let i = 0; i < n * 2; i++){ const r = i % 2 ? r2 : r1, a = rot + i * Math.PI / n; i ? g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : g.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.closePath(); }
function rr(g, x, y, w, h, r){ r = Math.min(r, w / 2, h / 2); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function ell(g, x, y, rx, ry, rot){ g.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot || 0, 0, TAU); }
return {rgb, rgba, piece, lin, rad, glow, star, rr, ell}; })(), RIM = '#2A1C14', P = (g, parts, k) => D.piece(g, parts, RIM, 1.25 * k);
const GOLD = ['#FFF6C2', '#FFD64A', '#E09A00'], SILVER = ['#FFFFFF', '#D9DEE7', '#8E97A6'], STEEL = ['#E6EAF0', '#A9B3C2', '#6E7889'], WOOD = ['#E2B07A', '#B97A45', '#7E4E25'], STONE = ['#D9D2C5', '#A59C8C', '#736A5C'];
const lin = (g, a, b, cols) => D.lin(g, a, 0, b, 0, cols), vlin = (g, a, b, cols) => D.lin(g, 0, a, 0, b, cols);
function checks(g, k, pathFn, a, b, n){ g.save(); g.beginPath(); pathFn(g); g.clip(); const s = n * k; for(let y = -110 * k; y < 30 * k; y += s) for(let x = -50 * k; x < 50 * k; x += s){ g.fillStyle = ((Math.round(x / s) + Math.round(y / s)) & 1) ? a : b; g.fillRect(x, y, s + 0.5, s + 0.5); } g.restore(); }
const dome = (k, y, w, h, top) => q => { q.moveTo(-w * k, y - (top || 6) * k); q.quadraticCurveTo(-w * k, y - h * k, 0, y - h * k); q.quadraticCurveTo(w * k, y - h * k, w * k, y - (top || 6) * k); q.closePath(); };
const band = (g, k, y, T, at, w) => { g.fillStyle = T.c; g.fillRect(-(w || 14) * k, y - (at || 12) * k, 2 * (w || 14) * k, 3 * k); };
const stick = (k, len, w) => q => q.rect(-(w || 1.6) * k, -len * k, 2 * (w || 1.6) * k, (len + 6) * k);

/* ---------- 🧢 leader HEADS ---------- */
const HEAD = {
  rexhood(g, k, y, T){ P(g, [{path: q => { q.moveTo(-17 * k, y + 2 * k); q.quadraticCurveTo(-19 * k, y - 30 * k, 2 * k, y - 32 * k); q.quadraticCurveTo(26 * k, y - 32 * k, 24 * k, y - 14 * k); q.lineTo(14 * k, y - 10 * k); q.quadraticCurveTo(0, y - 14 * k, -10 * k, y - 6 * k); q.lineTo(-11 * k, y + 2 * k); q.closePath(); }, fill: g => lin(g, -17 * k, 24 * k, ['#7FB24A', '#3E7D3A'])}], k);
    g.fillStyle = '#FFFFFF'; [8, 12, 16, 20].forEach(x => { g.beginPath(); g.moveTo(x * k, y - 12 * k); g.lineTo((x + 1.6) * k, y - 8 * k); g.lineTo((x + 3.2) * k, y - 12 * k); g.fill(); }); g.fillStyle = '#FFE070'; g.beginPath(); D.ell(g, 12 * k, y - 23 * k, 2.6 * k, 2.6 * k); g.fill(); g.fillStyle = RIM; g.beginPath(); D.ell(g, 12.6 * k, y - 23 * k, 1 * k, 1.6 * k); g.fill(); band(g, k, y, T, 7, 10); },
  rexcrown(g, k, y, T){ HEAD.rexhood(g, k, y, T); P(g, [{path: q => { q.moveTo(-10 * k, y - 28 * k); q.lineTo(-12 * k, y - 40 * k); q.lineTo(-5 * k, y - 33 * k); q.lineTo(0, y - 43 * k); q.lineTo(5 * k, y - 33 * k); q.lineTo(12 * k, y - 40 * k); q.lineTo(10 * k, y - 28 * k); q.closePath(); }, fill: g => vlin(g, y - 43 * k, y - 28 * k, ['#FFFDF2', '#E9D6A8'])}], k);
    g.fillStyle = '#FFA500'; g.beginPath(); D.ell(g, 0, y - 32 * k, 2.4 * k, 2.4 * k); g.fill(); },
  // 🤖 Bolt Works,
  robovisor(g, k, y, T){ P(g, [{path: dome(k, y, 15, 27, 4), fill: g => lin(g, -15 * k, 15 * k, ['#5B6480', '#2B2D42'])}, {path: q => D.rr(q, -14 * k, y - 17 * k, 28 * k, 7 * k, 3.5 * k), fill: g => lin(g, -14 * k, 14 * k, ['#FF7A90', '#E5484D'])}], k);
    g.fillStyle = '#FFFFFF'; g.fillRect(-10 * k, y - 15 * k, 6 * k, 2 * k); g.fillStyle = T.c; g.fillRect(-2 * k, y - 27 * k, 4 * k, 9 * k); },
  antcrown(g, k, y, T){ HEAD.robovisor(g, k, y, T); P(g, [{path: q => { q.moveTo(-13 * k, y - 22 * k); q.lineTo(-14 * k, y - 34 * k); q.lineTo(-7 * k, y - 28 * k); q.lineTo(0, y - 38 * k); q.lineTo(7 * k, y - 28 * k); q.lineTo(14 * k, y - 34 * k); q.lineTo(13 * k, y - 22 * k); q.closePath(); }, fill: g => vlin(g, y - 38 * k, y - 22 * k, GOLD)}], k);
    [[-14, -34], [0, -38], [14, -34]].forEach(p => { g.fillStyle = '#9FE6FF'; g.beginPath(); g.arc(p[0] * k, y + p[1] * k, 2.4 * k, 0, 7); g.fill(); }); D.glow(g, 0, y - 38 * k, 10 * k, '#9FE6FF', 0.5); },
  chefgold(g, k, y, T){ const path = q => { q.moveTo(-13 * k, y - 10 * k); q.lineTo(-13 * k, y - 26 * k); q.arc(-9 * k, y - 34 * k, 9 * k, Math.PI * 0.75, Math.PI * 1.6); q.arc(0, y - 44 * k, 10 * k, Math.PI * 1.05, Math.PI * 1.95); q.arc(9 * k, y - 34 * k, 9 * k, Math.PI * 1.4, Math.PI * 0.25); q.lineTo(13 * k, y - 10 * k); q.closePath(); };
    P(g, [{path, fill: g => lin(g, -13 * k, 13 * k, GOLD)}], k);
    g.save(); g.strokeStyle = 'rgba(160,100,0,0.35)'; g.lineWidth = 1.2 * k; [[-4, -24, -6, -38], [4, -24, 5, -40]].forEach(l => { g.beginPath(); g.moveTo(l[0] * k, y + l[1] * k); g.quadraticCurveTo(l[0] * 1.6 * k, y + (l[1] - 8) * k, l[2] * k, y + l[3] * k); g.stroke(); }); g.restore();
    P(g, [{path: q => D.rr(q, -14 * k, y - 16 * k, 28 * k, 7 * k, 2.5 * k), fill: T.c}], k); g.fillStyle = '#FFFFFF'; g.beginPath(); D.star(g, 0, y - 12.5 * k, 3.4 * k, 1.5 * k, 5); g.fill(); D.glow(g, 0, y - 40 * k, 16 * k, '#FFE98A', 0.35); },
  forkcrown(g, k, y, T){ const tine = (x, h) => q => { q.moveTo(x - 2.6 * k, y - 14 * k); q.lineTo(x - 2.6 * k, y - h * k); q.lineTo(x - 1.4 * k, y - h * k); q.lineTo(x - 1.4 * k, y - (h - 6) * k); q.lineTo(x - 0.5 * k, y - (h - 6) * k); q.lineTo(x - 0.5 * k, y - h * k); q.lineTo(x + 0.5 * k, y - h * k); q.lineTo(x + 0.5 * k, y - (h - 6) * k); q.lineTo(x + 1.4 * k, y - (h - 6) * k); q.lineTo(x + 1.4 * k, y - h * k); q.lineTo(x + 2.6 * k, y - h * k); q.lineTo(x + 2.6 * k, y - 14 * k); q.closePath(); };
    const knife = q => { q.moveTo(-2.4 * k, y - 14 * k); q.lineTo(-2.4 * k, y - 34 * k); q.quadraticCurveTo(0, y - 42 * k, 3 * k, y - 36 * k); q.lineTo(2.4 * k, y - 14 * k); q.closePath(); };
    P(g, [{path: tine(-9, 30), fill: g => lin(g, -12 * k, -6 * k, SILVER)}, {path: tine(9, 30), fill: g => lin(g, 6 * k, 12 * k, SILVER)}, {path: knife, fill: g => lin(g, -3 * k, 3 * k, SILVER)},
      {path: q => { q.moveTo(-14 * k, y - 9 * k); q.lineTo(-15 * k, y - 18 * k); q.quadraticCurveTo(0, y - 22 * k, 15 * k, y - 18 * k); q.lineTo(14 * k, y - 9 * k); q.quadraticCurveTo(0, y - 6 * k, -14 * k, y - 9 * k); }, fill: g => vlin(g, y - 22 * k, y - 6 * k, GOLD)}], k);
    g.fillStyle = '#E5484D'; g.beginPath(); D.ell(g, 0, y - 13.5 * k, 3 * k, 3 * k); g.fill(); g.fillStyle = T.c; [-8, 8].forEach(x => { g.beginPath(); D.ell(g, x * k, y - 13 * k, 2 * k, 2 * k); g.fill(); }); },
};
/* ---------- ✋ leader HANDS ---------- */
const HAND = {
  ladle(g, k, T){ P(g, [{path: stick(k, 30, 1.7), fill: g => lin(g, -2 * k, 2 * k, GOLD)}, {path: q => { q.moveTo(-8 * k, -32 * k); q.quadraticCurveTo(-8 * k, -22 * k, 0, -22 * k); q.quadraticCurveTo(8 * k, -22 * k, 8 * k, -32 * k); q.closePath(); }, fill: g => lin(g, -8 * k, 8 * k, GOLD)}], k);
    g.fillStyle = '#FF8A3D'; g.beginPath(); D.ell(g, 0, -31.5 * k, 6.6 * k, 2 * k); g.fill(); D.glow(g, 0, -34 * k, 12 * k, '#FFD45C', 0.4);
    g.save(); g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 1.2 * k; [-3, 2].forEach((x, i) => { g.beginPath(); g.moveTo(x * k, -36 * k); g.quadraticCurveTo((x + 2) * k, -40 * k, x * k, -44 * k - i * 2 * k); g.stroke(); }); g.restore(); },
  bigfork(g, k, T){ P(g, [{path: stick(k, 24, 1.8), fill: g => lin(g, -2 * k, 2 * k, SILVER)},
      {path: q => { q.moveTo(-7 * k, -24 * k); q.lineTo(-7 * k, -44 * k); q.lineTo(-5 * k, -44 * k); q.lineTo(-5 * k, -30 * k); q.lineTo(-1 * k, -30 * k); q.lineTo(-1 * k, -46 * k); q.lineTo(1 * k, -46 * k); q.lineTo(1 * k, -30 * k); q.lineTo(5 * k, -30 * k); q.lineTo(5 * k, -44 * k); q.lineTo(7 * k, -44 * k); q.lineTo(7 * k, -24 * k); q.quadraticCurveTo(0, -20 * k, -7 * k, -24 * k); }, fill: g => lin(g, -7 * k, 7 * k, SILVER)}], k); g.fillStyle = T.c; g.fillRect(-2.6 * k, 0, 5.2 * k, 6 * k); },
  club(g, k, T){ P(g, [{path: q => { q.moveTo(-2 * k, 6 * k); q.lineTo(-3 * k, -18 * k); q.quadraticCurveTo(-9 * k, -32 * k, 0, -38 * k); q.quadraticCurveTo(9 * k, -32 * k, 3 * k, -18 * k); q.lineTo(2 * k, 6 * k); q.closePath(); }, fill: g => lin(g, -8 * k, 8 * k, STONE)}], k);
    g.fillStyle = 'rgba(0,0,0,0.15)'; [[-3, -26], [2, -31]].forEach(p => { g.beginPath(); g.arc(p[0] * k, p[1] * k, 1.6 * k, 0, 7); g.fill(); }); g.fillStyle = T.c; g.fillRect(-2.6 * k, -2 * k, 5.2 * k, 3 * k); },
  magnet(g, k, T){ g.save(); g.lineCap = 'butt'; const u = q => { q.beginPath(); q.arc(0, -26 * k, 9 * k, Math.PI, 0); }; u(g); g.strokeStyle = RIM; g.lineWidth = 9 * k; g.stroke(); u(g); g.strokeStyle = '#E5484D'; g.lineWidth = 6.4 * k; g.stroke(); g.restore();
    P(g, [{path: q => q.rect(-12.2 * k, -26 * k, 6.4 * k, 7 * k), fill: '#D9DEE7'}, {path: q => q.rect(5.8 * k, -26 * k, 6.4 * k, 7 * k), fill: '#D9DEE7'}, {path: stick(k, 17, 1.6), fill: '#5B6480'}], k);
    g.save(); g.strokeStyle = 'rgba(159,230,255,0.9)'; g.lineWidth = 1.2 * k; [12, 16].forEach(r => { g.beginPath(); g.arc(0, -20 * k, r * k, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); }); g.restore(); },
};
HAND.magscep = function(g, k, T){ P(g, [{path: stick(k, 28, 1.6), fill: g => lin(g, -2 * k, 2 * k, GOLD)}], k); g.save(); g.translate(0, -14 * k); g.scale(0.75, 0.75); HAND.magnet(g, k, T); g.restore(); };
HAND.goldladle = HAND.ladle;
/* ---------- 🧥 SUITS ---------- */
const BODY = {
  menushield(g, k, T){ const x = -14 * k, y = -32 * k; P(g, [{path: q => D.rr(q, x - 10 * k, y - 15 * k, 20 * k, 28 * k, 4 * k), fill: g => vlin(g, y - 15 * k, y + 13 * k, ['#E5484D', '#B3202F'])}], k);
    g.strokeStyle = '#FFD64A'; g.lineWidth = 1.4 * k; g.strokeRect(x - 7.5 * k, y - 12.5 * k, 15 * k, 23 * k); g.fillStyle = '#FFE98A'; [-6, -1, 4].forEach((dy, i) => g.fillRect(x - (i ? 4 : 5.5) * k, y + dy * k, (i ? 8 : 11) * k, 1.6 * k));
    g.fillStyle = T.c; g.beginPath(); D.star(g, x, y + 8.5 * k, 2.6 * k, 1.1 * k, 5); g.fill(); },
  chestplate(g, k, T){ P(g, [{path: q => D.rr(q, -11 * k, -42 * k, 22 * k, 20 * k, 6 * k), fill: g => lin(g, -11 * k, 11 * k, STEEL)}], k); g.fillStyle = 'rgba(159,230,255,0.95)'; g.beginPath(); D.ell(g, 0, -33 * k, 4 * k, 4 * k); g.fill(); D.glow(g, 0, -33 * k, 9 * k, '#9FE6FF', 0.6); g.fillStyle = T.c; g.fillRect(-11 * k, -25 * k, 22 * k, 2.4 * k); },
};
/* ---------- 🎒 BACKS ---------- */
const BACK = {
  chefcape(g, k, T){ const path = q => { q.moveTo(-11 * k, -46 * k); q.lineTo(11 * k, -46 * k); q.quadraticCurveTo(21 * k, -20 * k, 18 * k, -4 * k); q.lineTo(-18 * k, -4 * k); q.quadraticCurveTo(-21 * k, -20 * k, -11 * k, -46 * k); };
    P(g, [{path, fill: g => vlin(g, -46 * k, -4 * k, ['#FFFFFF', '#EEF2F8'])}], k); g.save(); g.beginPath(); path(g); g.clip(); g.fillStyle = T.c; g.fillRect(-22 * k, -10 * k, 44 * k, 6 * k);
    for(let x = -22; x < 22; x += 4){ g.fillStyle = (x / 4) & 1 ? '#FFFFFF' : T.d; g.fillRect(x * k, -10 * k, 4 * k, 3 * k); } g.restore(); },
  bibcape(g, k, T){ const path = q => { q.moveTo(-11 * k, -46 * k); q.lineTo(11 * k, -46 * k); q.quadraticCurveTo(22 * k, -22 * k, 19 * k, -4 * k); q.lineTo(9 * k, -9 * k); q.lineTo(0, -3 * k); q.lineTo(-9 * k, -9 * k); q.lineTo(-19 * k, -4 * k); q.quadraticCurveTo(-22 * k, -22 * k, -11 * k, -46 * k); };
    P(g, [{path, fill: '#FFFFFF'}], k); checks(g, k, path, T.c, '#FFFFFF', 5); },
  leafcape(g, k, T){ const path = q => { q.moveTo(-11 * k, -46 * k); q.lineTo(11 * k, -46 * k); q.quadraticCurveTo(22 * k, -22 * k, 18 * k, -4 * k); q.lineTo(-18 * k, -4 * k); q.quadraticCurveTo(-22 * k, -22 * k, -11 * k, -46 * k); };
    P(g, [{path, fill: g => vlin(g, -46 * k, -4 * k, ['#8FD16A', '#3E8B33'])}], k); g.save(); g.beginPath(); path(g); g.clip(); g.fillStyle = '#2D6B2A'; for(let x = -18; x < 19; x += 6){ g.beginPath(); g.moveTo(x * k, -4 * k); g.lineTo((x + 3) * k, -12 * k); g.lineTo((x + 6) * k, -4 * k); g.fill(); } g.fillStyle = T.c; g.fillRect(-11 * k, -46 * k, 22 * k, 3 * k); g.restore(); },
  jetpack(g, k, T){ [-1, 1].forEach(s => P(g, [{path: q => D.rr(q, s * 4 * k - (s < 0 ? 9 : 0) * k, -46 * k, 9 * k, 26 * k, 4 * k), fill: g => lin(g, -14 * k, 14 * k, GOLD)}], k));
    [-8.5, 8.5].forEach(x => { g.fillStyle = '#FF8A3D'; g.beginPath(); g.moveTo((x - 3) * k, -20 * k); g.lineTo(x * k, -10 * k); g.lineTo((x + 3) * k, -20 * k); g.fill(); }); g.fillStyle = T.c; g.fillRect(-13 * k, -40 * k, 26 * k, 2.6 * k); },
};
/* ---------- 🧥 Wardrobe suits (ar-r2-6b look test ✅ Aowu 10:24) — (g, k, T, back) · back view = plain cloth, no front details ---------- */
BODY.leaftunic = function(g, k, T, back){   // 🦖 one-shoulder spotted hide · leaf hem (one leaf in your colour) · belt in your colour + amber buckle · tooth necklace
  const hide = back ? (q => D.rr(q, -12 * k, -45 * k, 24 * k, 27 * k, 5 * k)) : q => { q.moveTo(-11 * k, -40 * k); q.lineTo(-3 * k, -46 * k); q.lineTo(4 * k, -45 * k); q.lineTo(11.5 * k, -36 * k); q.lineTo(12.5 * k, -19 * k); q.lineTo(-12.5 * k, -19 * k); q.closePath(); };
  P(g, [{path: hide, fill: g => vlin(g, -46 * k, -19 * k, ['#E8C48A', '#C9965A', '#A8743E'])}], k);
  g.save(); g.beginPath(); hide(g); g.clip(); g.fillStyle = 'rgba(90,52,20,0.55)';
  [[-6, -34, 2.2, 1.5], [4, -30, 2.6, 1.6], [-2, -25, 1.8, 1.2], [8, -24, 1.6, 1.2], [-8, -26, 1.4, 1]].forEach(s => { g.beginPath(); g.ellipse(s[0] * k, s[1] * k, s[2] * k, s[3] * k, 0.4, 0, 7); g.fill(); });
  g.restore();
  for(let n = 0; n < 6; n++){ const x = -11 + n * 4.4, c = n === 2 ? T.c : (n % 2 ? '#6FC24E' : '#4E9E3F');
    P(g, [{path: q => { q.moveTo((x - 2.4) * k, -20 * k); q.quadraticCurveTo((x - 2.8) * k, -13 * k, x * k, -9 * k); q.quadraticCurveTo((x + 2.8) * k, -13 * k, (x + 2.4) * k, -20 * k); q.closePath(); }, fill: c}], k);
    g.strokeStyle = 'rgba(30,60,20,0.45)'; g.lineWidth = 0.7 * k; g.beginPath(); g.moveTo(x * k, -19 * k); g.lineTo(x * k, -11 * k); g.stroke(); }
  P(g, [{path: q => q.rect(-12.5 * k, -22.5 * k, 25 * k, 3.6 * k), fill: g => vlin(g, -22.5 * k, -19 * k, [T.l, T.c, T.d])}], k);
  if(back) return;
  P(g, [{path: q => D.ell(q, 3 * k, -20.7 * k, 3 * k, 2.6 * k), fill: g => D.rad(g, 2 * k, -21.5 * k, 0.5, 3 * k, ['#FFF1B0', '#FFB21E', '#B8620A'])}], k);
  g.strokeStyle = '#5A3A1A'; g.lineWidth = 0.9 * k; g.beginPath(); g.moveTo(-6 * k, -45 * k); g.quadraticCurveTo(0, -38.5 * k, 6 * k, -45 * k); g.stroke();
  [-3.6, 0, 3.6].forEach((x, i) => P(g, [{path: q => { const y = (i === 1 ? -40 : -41.2) * k; q.moveTo((x - 1.3) * k, y); q.lineTo((x + 1.3) * k, y); q.lineTo(x * k, y + (i === 1 ? 4.4 : 3.4) * k); q.closePath(); }, fill: '#FFF8E6'}], k * 0.6)); };
BODY.chefcoat = function(g, k, T, back){   // 🍳 white double-breasted coat · band collar + neckerchief + 2 × 3 buttons in your colour · gold Head Chef star · hem stripe
  const coat = q => { q.moveTo(-11 * k, -45.5 * k); q.lineTo(11 * k, -45.5 * k); q.lineTo(12 * k, -22 * k); q.lineTo(14 * k, -12 * k); q.lineTo(-14 * k, -12 * k); q.lineTo(-12 * k, -22 * k); q.closePath(); };
  P(g, [{path: coat, fill: g => lin(g, -14 * k, 14 * k, ['#FFFFFF', '#F4F7FB', '#DCE3EC'])}], k);
  const collar = () => P(g, [{path: q => D.rr(q, -7 * k, -47.5 * k, 14 * k, 3.4 * k, 1.4 * k), fill: g => lin(g, -7 * k, 7 * k, [T.l, T.c, T.d])}], k);
  const hem = () => { g.save(); g.beginPath(); coat(g); g.clip(); g.fillStyle = T.c; g.fillRect(-15 * k, -14.6 * k, 30 * k, 1.6 * k); g.restore(); };
  if(back){ collar(); hem(); return; }
  g.strokeStyle = 'rgba(120,135,155,0.55)'; g.lineWidth = 0.9 * k; g.beginPath(); g.moveTo(4 * k, -43 * k); g.lineTo(4 * k, -12.5 * k); g.stroke();
  g.strokeStyle = 'rgba(150,165,185,0.45)'; g.beginPath(); g.moveTo(-8 * k, -20 * k); g.lineTo(-9.5 * k, -12.5 * k); g.moveTo(9 * k, -20 * k); g.lineTo(10.5 * k, -12.5 * k); g.stroke();
  [-28, -22.5, -17].forEach(y => [-1, 9].forEach(x => P(g, [{path: q => D.ell(q, x * k, y * k, 1.35 * k, 1.35 * k), fill: g => D.rad(g, (x - 0.4) * k, (y - 0.4) * k, 0.3, 1.4 * k, [T.l, T.c, T.d])}], k * 0.7)));
  collar();
  P(g, [{path: q => { q.moveTo(-3.4 * k, -44.6 * k); q.lineTo(3.4 * k, -44.6 * k); q.lineTo(0, -38.4 * k); q.closePath(); }, fill: g => vlin(g, -44.6 * k, -38.4 * k, [T.c, T.d])}], k);
  P(g, [{path: q => D.star(q, -6.5 * k, -36.5 * k, 3 * k, 1.3 * k, 5), fill: g => D.rad(g, -7 * k, -37.5 * k, 0.4, 3 * k, GOLD)}], k * 0.8);
  hem(); };
BODY.robosuit = function(g, k, T, back){   // 🤖 Robo Boss: the battle chest-plate + bolted shoulder pads + an LED belt in your colour (back view: a battery pack)
  if(back){ P(g, [{path: q => D.rr(q, -8 * k, -42 * k, 16 * k, 18 * k, 4 * k), fill: g => lin(g, -8 * k, 8 * k, STEEL)}], k); g.fillStyle = T.c; [-37, -32, -27].forEach(y => g.fillRect(-4 * k, y * k, 8 * k, 2.2 * k)); return; }
  [-1, 1].forEach(s => P(g, [{path: q => D.ell(q, s * 10.5 * k, -44 * k, 5 * k, 3.4 * k), fill: g => lin(g, (s * 10.5 - 5) * k, (s * 10.5 + 5) * k, STEEL)}], k));
  BODY.chestplate(g, k, T);
  P(g, [{path: q => q.rect(-12 * k, -21.5 * k, 24 * k, 3.4 * k), fill: '#3A4152'}], k);
  [-8, -3, 2, 7].forEach((x, i) => { g.fillStyle = i % 2 ? T.l : T.c; g.beginPath(); D.ell(g, (x + 1) * k, -19.8 * k, 1.2 * k, 1.2 * k); g.fill(); });
  [-1, 1].forEach(s => { g.fillStyle = '#6E7889'; g.beginPath(); D.ell(g, s * 10.5 * k, -44 * k, 0.9 * k, 0.9 * k); g.fill(); }); };
BODY.gourmand = function(g, k, T, back){   // 🍽️ Grand Gourmand: a white bib (checks in your colour) under the battle MENU shield (back view: the bib ties)
  const bib = q => { q.moveTo(-9 * k, -45 * k); q.lineTo(9 * k, -45 * k); q.lineTo(11 * k, -24 * k); q.quadraticCurveTo(0, -17 * k, -11 * k, -24 * k); q.closePath(); };
  if(back){ g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.6 * k; g.beginPath(); g.moveTo(-8 * k, -45 * k); g.lineTo(-2 * k, -41 * k); g.lineTo(2 * k, -45 * k); g.lineTo(5 * k, -40 * k); g.stroke(); return; }
  P(g, [{path: bib, fill: '#FFFFFF'}], k); checks(g, k, bib, T.c, '#FFFFFF', 3.4);
  P(g, [{path: q => D.ell(q, 0, -44.2 * k, 3 * k, 2 * k), fill: T.d}], k * 0.9);
  BODY.menushield(g, k, T); };

/* ---------- 👑 the 4 leaders (step v of the costume line) ---------- */
const SIDES = ['raptor', 'bolt', 'kitchen', 'horde'], HAND_TILT = 0.34;
const LEAD = {
  raptor: {name: 'Rex King', icon: '🦖', head: 'rexcrown', hand: 'club', suit: 'leaftunic', back: 'leafcape', body: {outfit: 1}},
  bolt: {name: 'Robo Boss', icon: '🤖', head: 'antcrown', hand: 'magscep', suit: 'robosuit', back: 'jetpack', body: {outfit: 0, outfitColor: 8, oc2: 12}},
  kitchen: {name: 'Head Chef', icon: '🍳', head: 'chefgold', hand: 'ladle', suit: 'chefcoat', back: 'chefcape', body: {outfit: 0, outfitColor: 9, oc2: 12}},
  horde: {name: 'Grand Gourmand', icon: '🍽️', head: 'forkcrown', hand: 'bigfork', suit: 'gourmand', back: 'bibcape'}};
// trims from the player's outfit colour (or the costume's 🎨 My colours main colour) (a scheme → gold · white → soft steel so trims still read on a white coat)
const OK_HEX = c => /^#[0-9a-f]{6}$/i.test(c || '');
function trims(av){ const OC = typeof OUTFIT_COLS !== 'undefined' ? OUTFIT_COLS : [], SH = typeof shade === 'function' ? shade : (c => c), e = av && av.eq && av.eq.costume, cc = e && e.c && OK_HEX(e.c.a) ? e.c.a : null;   // 🎨 My colours (Wardrobe) win
  let c = cc || OC[(av && av.outfitColor) | 0];
  if(!OK_HEX(c)) c = '#FFC21A'; if(c.toUpperCase() === '#F4F4F4') c = '#9AA6B2';
  return {c, d: SH(c, 0.7), l: SH(c, 1.45), n: 'You'}; }
const hasPageWear = av => !!(av.cw && Object.keys(av.cw).some(s => av.cw[s] && av.cw[s].td));
// dress: costume 'realmlead' → a COPY with page wear (the saved avatar never changes) · your own ✋ / 🪽 picks win · page wear already there wins (battle heroes)
const MEMO = typeof WeakMap === 'function' ? new WeakMap() : null;
function dress(a){
  const av = a && a.av, e = av && av.eq && av.eq.costume;
  if(!e || e.id !== 'realmlead' || hasPageWear(av)) return a;
  const eq = av.eq, sig = (e.v | 0) + '|' + (e.c ? e.c.a + e.c.b : '') + '|' + av.outfitColor + '|' + av.outfit + '|' + (eq.hand ? eq.hand.id + eq.hand.v : '') + '|' + (eq.back ? eq.back.id + eq.back.v : '') + '|' + (av.cw ? Object.keys(av.cw).join() : '');
  let m = MEMO && MEMO.get(av);
  if(!m || m.sig !== sig){ const side = SIDES[Math.max(0, Math.min(SIDES.length - 1, e.v | 0))], L = LEAD[side], T = trims(av);
    const b = Object.assign({}, av, L.body || {}); b.cw = Object.assign({}, av.cw || {});
    const W = (slot, key) => { b.cw[slot] = {td: 1, rk: key, side, T}; };
    W('head', L.head); if(!eq.hand) W('hand', L.hand); W('suit', L.suit); if(!eq.back) W('back', L.back);
    b.acc = 0; b.eq = Object.assign({}, eq); delete b.eq.costume;
    m = {sig, b}; if(MEMO) MEMO.set(av, m); }
  return Object.assign({}, a, {av: m.b}); }
// the wear hook (chained like AvataRealmLooks / AvatarWear) — only items with `rk` are ours
const prevWear = window.AK_WEAR;
window.AK_WEAR = function(g, slot, it, o){
  if(it && it.rk){ const T = it.T || trims(o.av), k = o.k, back = !!(o.P && o.P.back);
    if(slot === 'head' && HEAD[it.rk]) return HEAD[it.rk](g, k, o.hy, T);
    if(slot === 'hand' && HAND[it.rk]){ g.save(); g.rotate(HAND_TILT); HAND[it.rk](g, k, T); g.restore(); return; }   // tilted out: the face stays free (battle heroes stay upright)
    if(slot === 'suit' && BODY[it.rk]) return BODY[it.rk](g, k, T, back);
    if(slot === 'back' && BACK[it.rk]) return BACK[it.rk](g, k, T, o);
    return; }
  if(prevWear) return prevWear(g, slot, it, o); };
window.AKRealm = {PIECES: {HEAD, HAND, BODY, BACK}, LEAD, SIDES, dress, trims, v: 'ar-r2-6b'};
})();

