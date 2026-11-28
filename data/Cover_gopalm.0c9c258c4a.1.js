
/* 🎬 Cover_gopalm — 📏 b6a: the "gopalm" cover, born as its own file by 🧱 new_game.py (gp-r0), art: ⚫⚪ GOpalm chat.
   It runs after GameCovers on GameCovers._K (the kit's helpers) and keeps its own Z (the cover logo's spot, 🏷️ 24j-e):
   the kit hands it over before every still / live / spots call, away() measures against it. */
(function(K){
  'use strict';
  if(!K) return;
  const {clamp, lerp, rng, hx, mix, shade, poly, sparkle, cloud, persp, pick3, root} = K;
  let Z = null;
  const away = (x, y, w, h, W, H, opt) => K.awayIn(Z, x, y, w, h, W, H, opt);
  const add = (id, def) => K.add(id, def, z => { Z = z; });
  // 🎬 COVER gopalm START — ⚫⚪ GOpalm (gp-r0): a little magic stage — red curtains, a spotlight, a wooden Go board on a round table, a top hat
  // with 🐰 Hopdini's ears popping out, and the main piece: a white magician's glove with a black + a pearly stone floating above the palm
  // (sparkles + a curl of magic smoke). The 🏆 champions stand on the stage floor in front.
  (function(){
    const geo = (W, H) => ({fy: H * (W > H ? 0.7 : 0.74)});
    function curtain(g, W, H, side){
      const cw = W * 0.17, x0 = side ? W : 0, d = side ? -1 : 1;
      let gr = g.createLinearGradient(x0, 0, x0 + d * cw, 0); gr.addColorStop(0, '#5E0E1C'); gr.addColorStop(1, '#A3192E'); g.fillStyle = gr;
      g.beginPath(); g.moveTo(x0, 0); g.lineTo(x0 + d * cw * 1.25, 0); g.quadraticCurveTo(x0 + d * cw * 0.55, H * 0.42, x0 + d * cw * 0.35, H * 0.55); g.quadraticCurveTo(x0 + d * cw * 0.75, H * 0.78, x0 + d * cw * 0.9, H); g.lineTo(x0, H); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = Math.max(1, W * 0.004);
      for(let k = 1; k < 4; k++){ const fx = x0 + d * cw * k * 0.22; g.beginPath(); g.moveTo(fx, 0); g.quadraticCurveTo(fx + d * cw * 0.05, H * 0.3, x0 + d * cw * 0.3 * k * 0.4, H * 0.55); g.stroke(); }
      g.fillStyle = '#F2C14E'; g.beginPath(); g.arc(x0 + d * cw * 0.36, H * 0.55, Math.max(3, W * 0.008), 0, 7); g.fill();   // the gold tie
    }
    function valance(g, W, H){ g.fillStyle = '#8E1426'; g.fillRect(0, 0, W, H * 0.07); const n = 9; for(let i = 0; i < n; i++){ const x = (i + 0.5) * W / n; g.beginPath(); g.arc(x, H * 0.07, W / n / 2, 0, Math.PI); g.fill(); }
      g.fillStyle = '#F2C14E'; for(let i = 0; i < n; i++) { g.beginPath(); g.arc((i + 0.5) * W / n, H * 0.07 + W / n / 2, Math.max(2, W * 0.005), 0, 7); g.fill(); } }
    function board(g, cx, cy, w){   // a wooden 9 × 9 board seen at a slant, a few stones on it
      const h = w * 0.42, P = (u, v) => [cx + (u - 0.5) * w * (1 - v * 0.18) , cy - h / 2 + v * h];
      g.fillStyle = '#7A4A1E'; g.beginPath(); const c = [P(0, 1), P(1, 1)]; g.moveTo(c[0][0], c[0][1]); g.lineTo(c[1][0], c[1][1]); g.lineTo(c[1][0], c[1][1] + w * 0.07); g.lineTo(c[0][0], c[0][1] + w * 0.07); g.fill();
      let gr = g.createLinearGradient(0, cy - h / 2, 0, cy + h / 2); gr.addColorStop(0, '#E8BE80'); gr.addColorStop(1, '#C98A4B'); g.fillStyle = gr;
      g.beginPath(); [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(([u, v], i) => { const [x, y] = P(u, v); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(74,46,18,.75)'; g.lineWidth = Math.max(0.6, w * 0.004);
      for(let k = 0; k < 9; k++){ const t = (k + 0.5) / 9; let [x1, y1] = P(t, 0.05), [x2, y2] = P(t, 0.95); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); [x1, y1] = P(0.05, t); [x2, y2] = P(0.95, t); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
      [[2, 2, 1], [3, 2, 2], [4, 3, 1], [3, 4, 2], [5, 5, 1], [6, 3, 2], [2, 6, 2], [6, 6, 1]].forEach(([i, j, col]) => { const [x, y] = P((i + 0.5) / 9, (j + 0.5) / 9); stoneAt(g, x, y, w * 0.032 * (0.9 + j / 30), col, 0.62); });
    }
    function stoneAt(g, x, y, r, col, sy){ g.save(); g.translate(x, y); g.scale(1, sy || 1); g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.arc(r * 0.12, r * 0.2, r, 0, 7); g.fill();
      const gr = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.05, 0, 0, r); if(col === 1){ gr.addColorStop(0, '#6B6B78'); gr.addColorStop(0.4, '#25252E'); gr.addColorStop(1, '#0A0A0F'); } else { gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(0.55, '#F4F0FF'); gr.addColorStop(0.8, '#E7DDF5'); gr.addColorStop(1, '#BFB6CC'); }
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.fillStyle = col === 1 ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.95)'; g.beginPath(); g.ellipse(-r * 0.32, -r * 0.38, r * 0.3, r * 0.16, -0.6, 0, 7); g.fill(); g.restore(); }
    function table(g, cx, top, w){ g.fillStyle = '#3B1F12'; g.fillRect(cx - w * 0.05, top, w * 0.1, w * 0.42); g.beginPath(); g.ellipse(cx, top + w * 0.42, w * 0.22, w * 0.05, 0, 0, 7); g.fill();
      g.fillStyle = '#7E1A2C'; g.beginPath(); g.ellipse(cx, top, w * 0.62, w * 0.16, 0, 0, 7); g.fill(); g.fillStyle = '#A82A3E'; g.beginPath(); g.ellipse(cx, top - w * 0.02, w * 0.6, w * 0.14, 0, 0, 7); g.fill();
      g.fillStyle = '#F2C14E'; for(let k = 0; k < 11; k++){ const a = Math.PI * (k / 10); g.beginPath(); g.arc(cx - Math.cos(a) * w * 0.6, top + Math.sin(a) * w * 0.15 + w * 0.02, Math.max(1.5, w * 0.012), 0, 7); g.fill(); } }
    function hat(g, x, y, s){ g.fillStyle = '#15131C'; g.beginPath(); g.ellipse(x, y, s * 0.62, s * 0.14, 0, 0, 7); g.fill(); g.fillRect(x - s * 0.36, y - s * 0.72, s * 0.72, s * 0.7);
      g.fillStyle = '#B0182E'; g.fillRect(x - s * 0.36, y - s * 0.2, s * 0.72, s * 0.1); g.fillStyle = '#2B2836'; g.beginPath(); g.ellipse(x, y - s * 0.72, s * 0.36, s * 0.09, 0, 0, 7); g.fill(); }
    function ears(g, x, y, s, up){ if(up <= 0) return; g.fillStyle = '#FFFFFF'; g.strokeStyle = 'rgba(60,40,60,.5)'; g.lineWidth = Math.max(1, s * 0.03);
      [-1, 1].forEach(d => { g.save(); g.translate(x + d * s * 0.1, y - s * 0.74); g.rotate(d * 0.18); g.beginPath(); g.ellipse(0, -s * 0.32 * up, s * 0.09, s * 0.32 * up, 0, 0, 7); g.fill(); g.stroke();
        g.fillStyle = '#FFB8D2'; g.beginPath(); g.ellipse(0, -s * 0.32 * up, s * 0.045, s * 0.22 * up, 0, 0, 7); g.fill(); g.fillStyle = '#FFFFFF'; g.restore(); }); }
    function glove(g, x, y, s){   // an open white glove, palm up, fingers spread
      g.save(); g.translate(x, y); g.lineJoin = 'round'; g.strokeStyle = '#2A2233'; g.lineWidth = Math.max(1.5, s * 0.035);
      g.fillStyle = '#E8E4F2'; g.beginPath(); g.ellipse(-s * 0.55, s * 0.18, s * 0.3, s * 0.2, -0.25, 0, 7); g.fill(); g.stroke();   // the cuff
      g.fillStyle = '#FFFFFF'; g.beginPath(); g.ellipse(0, 0, s * 0.5, s * 0.24, -0.05, 0, 7); g.fill(); g.stroke();
      [[-0.32, -0.62, -0.5], [-0.05, -0.72, -0.15], [0.22, -0.66, 0.18], [0.44, -0.48, 0.5], [0.6, 0.02, 1.2]].forEach(([fx, fy, rot], i) => { g.save(); g.translate(s * fx * 0.72, s * (fy * 0.32 + 0.02)); g.rotate(rot); g.beginPath(); g.ellipse(0, -s * 0.16, s * 0.085, s * (i === 4 ? 0.15 : 0.2), 0, 0, 7); g.fill(); g.stroke(); g.restore(); });
      g.strokeStyle = 'rgba(42,34,51,.35)'; g.beginPath(); g.moveTo(-s * 0.2, s * 0.02); g.quadraticCurveTo(0, s * 0.1, s * 0.22, s * 0.02); g.stroke(); g.restore(); }
    function smoke(g, x, y, s, t){ g.strokeStyle = 'rgba(230,225,245,.55)'; g.lineWidth = Math.max(2, s * 0.05); g.lineCap = 'round'; g.beginPath();
      for(let k = 0; k <= 24; k++){ const u = k / 24, a = u * 9 + t * 1.5, rr = s * (0.05 + u * 0.22); const px = x + Math.cos(a) * rr + u * s * 0.25, py = y - u * s * 0.9 + Math.sin(a) * rr * 0.5; k ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); }
    add('gopalm', {
      still(g, W, H){
        const {fy} = geo(W, H), m = Math.min(W, H);
        let gr = g.createRadialGradient(W * 0.5, H * 0.35, m * 0.05, W * 0.5, H * 0.4, Math.max(W, H) * 0.75); gr.addColorStop(0, '#4A2F58'); gr.addColorStop(1, '#140F1E'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
        // the stage floor (planks)
        gr = g.createLinearGradient(0, fy, 0, H); gr.addColorStop(0, '#7A4A22'); gr.addColorStop(1, '#3E2412'); g.fillStyle = gr; g.fillRect(0, fy, W, H - fy);
        g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 1; for(let k = -8; k <= 8; k++){ g.beginPath(); g.moveTo(W / 2 + k * W * 0.04, fy); g.lineTo(W / 2 + k * W * 0.16, H); g.stroke(); }
        g.fillStyle = 'rgba(242,193,78,.35)'; g.fillRect(0, fy - 2, W, 3);
        // the spotlight pool
        gr = g.createRadialGradient(W * 0.5, fy + (H - fy) * 0.2, 0, W * 0.5, fy + (H - fy) * 0.2, W * 0.42); gr.addColorStop(0, 'rgba(255,240,200,.35)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gr; g.fillRect(0, fy - H * 0.1, W, H);
        // the table + board (left of centre), the top hat (right)
        const tw = Math.min(W * 0.34, H * 0.55), tx = W * 0.33, ttop = fy - tw * 0.3;
        table(g, tx, ttop, tw); board(g, tx, ttop - tw * 0.06, tw * 0.82);
        hat(g, W * 0.72, fy + (H - fy) * 0.08, Math.min(W, H) * 0.14);
        curtain(g, W, H, 0); curtain(g, W, H, 1); valance(g, W, H);
      },
      live(g, W, H, t){
        const {fy} = geo(W, H), m = Math.min(W, H);
        // spotlight cone shimmer
        g.fillStyle = 'rgba(255,245,215,' + (0.06 + 0.02 * Math.sin(t * 1.3)) + ')'; g.beginPath(); g.moveTo(W * 0.46, 0); g.lineTo(W * 0.54, 0); g.lineTo(W * 0.78, fy + (H - fy) * 0.4); g.lineTo(W * 0.22, fy + (H - fy) * 0.4); g.fill();
        // 🐰 Hopdini's ears pop out of the hat (up · wiggle · down)
        const hs = m * 0.14, hx = W * 0.72, hy = fy + (H - fy) * 0.08, ph = (t * 0.28) % 1, up = ph < 0.15 ? ph / 0.15 : ph < 0.55 ? 1 : ph < 0.65 ? 1 - (ph - 0.55) / 0.1 : 0;
        if(up > 0){ g.save(); g.beginPath(); g.rect(0, 0, W, hy - hs * 0.72); g.clip(); ears(g, hx + Math.sin(t * 6) * hs * 0.02 * up, hy, hs, up); g.restore(); }
        // the main piece: the glove, palm up, a black + a pearly stone floating above it (kept clear of the logo)
        const gs = m * 0.2, a = away(W * 0.5, H * 0.16, gs * 2.2, gs * 2.2, W, H), gx = a.x + gs * 1.1 * a.s, gy = a.y + gs * 1.55 * a.s, s = gs * a.s;
        glove(g, gx, gy, s);
        const b1 = Math.sin(t * 2.1) * s * 0.06, b2 = Math.sin(t * 2.1 + 1.6) * s * 0.06;
        stoneAt(g, gx - s * 0.18, gy - s * 0.62 + b1, s * 0.15, 1); stoneAt(g, gx + s * 0.2, gy - s * 0.86 + b2, s * 0.15, 2);
        smoke(g, gx + s * 0.45, gy - s * 0.35, s, t);
        for(let i = 0; i < 6; i++){ const q = (t * 0.5 + i / 6) % 1, ang = i * 1.05 + t * 0.4; sparkle(g, gx + Math.cos(ang) * s * (0.5 + q * 0.4), gy - s * 0.7 + Math.sin(ang) * s * 0.4 - q * s * 0.3, 2 + s * 0.04 * (1 - q), 0.75 * (1 - q), '#FFF1B8'); }
      },
      spots(W, H){
        const {fy} = geo(W, H), cands = [];
        for(let i = 0; i <= 20; i++){ const x = W * (0.12 + i / 20 * 0.76); for(let j = 0; j < 3; j++) cands.push({x, y: fy + (H - fy) * (0.45 + j * 0.2), s: 1}); }
        return pick3(cands, W, H, () => clamp(Math.min(H, W * 1.15) / 470, 0.4, 0.95));
      }
    });
  })();
  // 🎬 COVER gopalm END
  K.loaded('gopalm', 'gp-r0');
})(window.GameCovers && window.GameCovers._K);
