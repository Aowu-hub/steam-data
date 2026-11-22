// 🏷️ LOGO blasoff START — ⚽ BlasOff: BlasLogo (bo-6, Aowu 2026-11-15 12:33 OK) moved word for word from Test Harness/blasoff-build/logo.js
// by rounds/gl-r25/gen_blasoff_logo.py (gl-r25, 📡 lk-8f Station card) · kinds main · wide 🆕 · badge 🆕 · mode badges match · futsal · street · trick · cup · looks = the 7 pitch looks
GameLogos.add('blasoff', (function () {
  const MODE = {
    match:  {key: 'match',  name: 'Match',  ac: '#FFB020', scene: 'goal',  pose: 'bicycle'},   // ⚽ Matches (4v4 · 7v7 · 11v11 · 🎉 Party)
    futsal: {key: 'futsal', name: 'Futsal', ac: '#38C8FF', scene: 'court', pose: 'kick'},      // 🏙️ Small games box + 🥅 Futsal card
    street: {key: 'street', name: 'Street', ac: '#7CF7A0', scene: 'cage',  pose: 'volley'},    // 🏙️ Street 1v1 card (Aowu 09:44)
    trick:  {key: 'trick',  name: 'Trick',  ac: '#FF5AD2', scene: 'swirl', pose: 'flick'},     // 🕺 Tricks + skills (🎤 battle · 🎯 skills · 🥅 shootout)
    cup:    {key: 'cup',    name: 'Cup',    ac: '#FFD23F', scene: 'cup',   pose: null}         // 🏆 R4 (Cup · League · 👑 Family cup)
  };
  const THEME = {   // glow · rim (2 metal stops) · back (centre, edge) · fire (tip, mid, base) · space (star fill)
    classic:    {glow: '#FF7A1A', rim: ['#FFFFFF', '#8A93A6'], back: ['#2A1A10', '#08060A'], fire: ['#FFF3A0', '#FF8A1E', '#D2280A'], space: ['#1C2A5A', '#070A18']},
    jungle:     {glow: '#9BE15D', rim: ['#F6E7A0', '#7A6A2A'], back: ['#1E2A10', '#070A04'], fire: ['#FFF3A0', '#FF9A2A', '#C2380A'], space: ['#22401C', '#060E05']},
    underwater: {glow: '#3BE0D0', rim: ['#E8FBFF', '#3A8AA0'], back: ['#06324A', '#020C14'], fire: ['#E8FFFF', '#3BE0D0', '#1C8FB0'], space: ['#0A4A6A', '#020C14']},
    neon:       {glow: '#FF2BD6', rim: ['#B8F3FF', '#3C5CFF'], back: ['#1A0A3C', '#05020E'], fire: ['#FFFFFF', '#3CF2FF', '#FF2BD6'], space: ['#2A0E5A', '#05020E']},
    robot:      {glow: '#5CC8FF', rim: ['#E6ECF2', '#5A6676'], back: ['#232B36', '#0A0D12'], fire: ['#FFF7C0', '#FFD23F', '#E0601A'], space: ['#2E3A4E', '#0A0D12']},
    moon:       {glow: '#B8C6FF', rim: ['#FFFFFF', '#7A7C90'], back: ['#151933', '#010208'], fire: ['#FFFFFF', '#B8C6FF', '#5B4EFF'], space: ['#151933', '#010208']},
    olympus:    {glow: '#FFC94A', rim: ['#FFF4C8', '#C9962A'], back: ['#2C5A8C', '#0E2440'], fire: ['#FFFFFF', '#FFD86A', '#E08A1A'], space: ['#3A72B0', '#0E2440']}
  };
  const FONT = (w, px) => w + ' ' + px + 'px Fredoka, Nunito, "Arial Rounded MT Bold", sans-serif';
  const cache = {}; let SC = 1;   // SC = current scale (shadow blur is not scaled by the canvas transform)
  const lin = (g, x0, y0, x1, y1, st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((c, i) => q.addColorStop(i / (st.length - 1), c)); return q; };
  const rad = (g, x, y, r, st) => { const q = g.createRadialGradient(x, y - r * 0.35, r * 0.05, x, y, r); st.forEach((c, i) => q.addColorStop(i / (st.length - 1), c)); return q; };

  function shield(g){   // unit shield: 200 wide, 240 tall, centre (0,0) — flat top with two notches like the sheet
    g.beginPath(); g.moveTo(-100, -108); g.lineTo(-40, -108); g.lineTo(-30, -96); g.lineTo(30, -96); g.lineTo(40, -108); g.lineTo(100, -108);
    g.lineTo(100, 10); g.quadraticCurveTo(94, 82, 0, 120); g.quadraticCurveTo(-94, 82, -100, 10); g.closePath();
  }
  function star(g, R, r){ g.beginPath(); for(let i = 0; i < 12; i++){ const a = -Math.PI / 2 + i * Math.PI / 6, q = i % 2 ? r : R; g.lineTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); }   // 6-point star
  function sparks(g, T, n, R, seed){ g.save(); g.fillStyle = T.fire[1]; for(let i = 0; i < n; i++){ const a = i * 2.39996 + seed, d = R * (0.55 + 0.45 * ((i * 37 % 11) / 11)), s = 1.4 + (i % 3); g.globalAlpha = 0.5 + 0.5 * ((i * 13 % 7) / 7); g.beginPath(); g.arc(Math.cos(a) * d, Math.sin(a) * d * 0.8, s, 0, 7); g.fill(); } g.restore(); }
  function rays(g, T, r, n){ g.save(); g.globalAlpha = 0.13; g.fillStyle = T.glow; for(let i = 0; i < n; i++){ const a = i * Math.PI * 2 / n; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, a, a + Math.PI / n * 0.5); g.closePath(); g.fill(); } g.restore(); }
  function trail(g, T, x, y, r, ang){   // fire trail behind a flying ball (ang = direction the trail points to)
    g.save(); g.translate(x, y); g.rotate(ang);
    [[2.8, 1, T.fire[2]], [2.2, 0.78, T.fire[1]], [1.5, 0.5, T.fire[0]]].forEach(([L, W, c]) => {
      g.fillStyle = c; g.beginPath(); g.moveTo(0, -r * W);
      g.quadraticCurveTo(r * L * 0.5, -r * W * 1.2, r * L, -r * 0.2); g.quadraticCurveTo(r * L * 0.7, 0, r * L * 1.05, r * 0.35);
      g.quadraticCurveTo(r * L * 0.5, r * W * 1.2, 0, r * W); g.closePath(); g.fill();
    });
    g.restore();
  }
  function ball(g, x, y, r, spin){   // classic black + white football (pentagons), our own drawing
    g.save(); g.translate(x, y); g.rotate(spin || 0);
    g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = rad(g, 0, 0, r, ['#FFFFFF', '#F2F2F2', '#B9BEC8']); g.fill();
    g.save(); g.clip(); g.fillStyle = '#16181E';
    const pent = (cx, cy, s, rot) => { g.beginPath(); for(let i = 0; i < 5; i++){ const a = rot + i * Math.PI * 2 / 5; g.lineTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s); } g.closePath(); g.fill(); };
    pent(0, 0, r * 0.36, -Math.PI / 2); for(let i = 0; i < 5; i++){ const a = -Math.PI / 2 + i * Math.PI * 2 / 5 + Math.PI / 5; pent(Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98, r * 0.32, a + Math.PI / 2); }
    g.strokeStyle = '#16181E'; g.lineWidth = r * 0.05; for(let i = 0; i < 5; i++){ const a = -Math.PI / 2 + i * Math.PI * 2 / 5; g.beginPath(); g.moveTo(Math.cos(a) * r * 0.36, Math.sin(a) * r * 0.36); g.lineTo(Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.72); g.stroke(); }
    g.restore();
    g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(-r * 0.35, -r * 0.45, r * 0.24, r * 0.13, -0.6, 0, 7); g.fill();   // shine
    g.lineWidth = r * 0.07; g.strokeStyle = 'rgba(10,12,20,.85)'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
    g.restore();
  }
  function rocket(g, T, x, y, r, ang){   // the BlasOff rocket-ball: football + 3 fins + exhaust flame
    g.save(); g.translate(x, y); g.rotate(ang);   // nose points along +x
    trail(g, T, -r * 0.9, 0, r * 0.75, Math.PI);
    g.fillStyle = lin(g, -r, -r, -r, r, [T.rim[0], T.rim[1]]); g.strokeStyle = 'rgba(10,12,20,.8)'; g.lineWidth = r * 0.06;
    [[-1], [1]].forEach(([s]) => { g.beginPath(); g.moveTo(-r * 0.2, s * r * 0.75); g.lineTo(-r * 1.25, s * r * 1.25); g.lineTo(-r * 0.95, s * r * 0.35); g.closePath(); g.fill(); g.stroke(); });
    g.beginPath(); g.moveTo(-r * 0.6, -r * 0.18); g.lineTo(-r * 1.35, 0); g.lineTo(-r * 0.6, r * 0.18); g.closePath(); g.fill(); g.stroke();
    ball(g, 0, 0, r, 0.3);
    g.restore();
  }
  /* 🏃 solid player silhouettes (Aowu 09:44: like the sheet, not stick figures) — side view, facing right.
     Pose = absolute segment angles (0 = straight down, + = toward +x): torso (hip → shoulder), neck, legs [thigh, shin, foot], arms [upper, fore].
     Each segment = a tapered capsule; the whole body is filled once in the look's fire colours, with a dark rim + glow behind. */
  const POSES = {
    kick:    {torso: Math.PI - 0.28, neck: Math.PI - 0.15, legs: [[0.18, 0.02, 1.57], [-0.75, -2.05, -1.2]], arms: [[1.95, 2.35], [-1.55, -1.15]], kickLeg: 1, plantLeg: 0},
    bicycle: {torso: -1.25, neck: -1.45, legs: [[2.85, 2.55, 1.7], [1.55, 1.05, 1.35]], arms: [[-0.25, 0.15], [-2.1, -2.5]], kickLeg: 0},
    flick:   {torso: Math.PI - 0.12, neck: Math.PI - 0.05, legs: [[0.06, -0.02, 1.57], [-0.45, -2.6, -2.2]], arms: [[2.05, 2.4], [-2.05, -2.4]], kickLeg: 1},
    volley:  {torso: Math.PI + 0.75, neck: Math.PI + 0.55, legs: [[1.95, 1.85, 1.65], [0.45, -0.55, 1.1]], arms: [[3.65, 3.3], [1.35, 1.15]], kickLeg: 0}
  };
  const SEG = {thigh: [0.24, 0.072, 0.05], shin: [0.23, 0.048, 0.032], foot: [0.1, 0.034, 0.026], upper: [0.16, 0.042, 0.034], fore: [0.15, 0.032, 0.026], torso: [0.3, 0.078, 0.098], neck: [0.06, 0.034, 0.034]};
  function figure(g, T, pose, x, y, h){
    const P = POSES[pose]; if(!P) return null;
    const dir = a => [Math.sin(a), Math.cos(a)], caps = [];
    const seg = (p, a, k) => { const [L, r1, r2] = SEG[k], d = dir(a), q = [p[0] + d[0] * L, p[1] + d[1] * L]; caps.push([p, q, r1, r2]); return q; };
    const hip = [0, 0], sh = seg(hip, P.torso, 'torso'), nk = seg(sh, P.neck, 'neck'), hd = dir(P.neck), head = [nk[0] + hd[0] * 0.07, nk[1] + hd[1] * 0.07];
    const toes = P.legs.map(([a, b, c]) => { const knee = seg([hip[0], hip[1]], a, 'thigh'), ank = seg(knee, b, 'shin'); return seg(ank, c, 'foot'); });
    P.arms.forEach(([a, b]) => { const el = seg([sh[0] - dir(P.torso)[0] * 0.03, sh[1] - dir(P.torso)[1] * 0.03], a, 'upper'); const hand = seg(el, b, 'fore'); caps.push([hand, hand, 0.034, 0.034]); });
    const W = (p) => [x + p[0] * h, y + p[1] * h];
    const path = (grow) => { g.beginPath();
      caps.forEach(([p, q, r1, r2]) => { const a = W(p), b = W(q), R1 = (r1 + grow) * h, R2 = (r2 + grow) * h, dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy);
        if(m < 0.01){ g.moveTo(a[0] + R1, a[1]); g.arc(a[0], a[1], R1, 0, 7); return; }
        const t = Math.atan2(dy, dx); g.moveTo(a[0] + Math.cos(t + Math.PI / 2) * R1, a[1] + Math.sin(t + Math.PI / 2) * R1);
        g.arc(a[0], a[1], R1, t + Math.PI / 2, t - Math.PI / 2); g.arc(b[0], b[1], R2, t - Math.PI / 2, t + Math.PI / 2); g.closePath(); });
      const c = W(head); g.moveTo(c[0] + (0.085 + grow) * h, c[1]); g.arc(c[0], c[1], (0.085 + grow) * h, 0, 7); };
    g.save(); g.shadowColor = T.glow; g.shadowBlur = 14 * SC; g.fillStyle = '#0B0D14'; path(0.022); g.fill('nonzero'); g.restore();   // dark rim + glow
    g.fillStyle = lin(g, x, y - h * 0.55, x, y + h * 0.5, [T.fire[0], T.fire[1], T.fire[2]]); path(0); g.fill('nonzero');
    g.save(); g.globalAlpha = 0.35; g.fillStyle = '#FFFFFF'; const hc = W(head); g.beginPath(); g.arc(hc[0] - 0.025 * h, hc[1] - 0.03 * h, 0.035 * h, 0, 7); g.fill(); g.restore();   // head shine
    return {toe: W(toes[P.kickLeg]), plant: W(toes[P.plantLeg == null ? 1 - P.kickLeg : P.plantLeg]), head: W(head)};
  }
  function swoosh(g, T, x, y, r, a0, a1){ g.save(); g.lineCap = 'round'; [[1, 5, T.fire[1]], [1.22, 3, T.glow], [1.42, 2, '#FFFFFF']].forEach(([k, w, c], i) => { g.globalAlpha = 0.85 - i * 0.2; g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.arc(x, y, r * k, a0, a1); g.stroke(); }); g.restore(); }
  function scene(g, T, kind){
    g.save();
    if(kind === 'goal'){   // goal frame + net, top-left
      g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1.4;
      for(let x = -86; x <= -6; x += 9){ g.beginPath(); g.moveTo(x, -84); g.lineTo(x + 14, -20); g.stroke(); }
      for(let y = -84; y <= -20; y += 9){ g.beginPath(); g.moveTo(-86 + (y + 84) * 0.22, y); g.lineTo(-6 + (y + 84) * 0.22, y); g.stroke(); }
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 5; g.beginPath(); g.moveTo(-86, -20); g.lineTo(-86, -84); g.lineTo(-6, -84); g.lineTo(-6, -20); g.stroke();
    } else if(kind === 'court'){   // futsal court lines: halfway line + centre circle + small goal
      g.fillStyle = lin(g, 0, -10, 0, 120, ['rgba(56,200,255,.18)', 'rgba(56,200,255,.38)']); g.fillRect(-100, -10, 200, 130);
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(-100, 40); g.lineTo(100, 40); g.stroke(); g.beginPath(); g.ellipse(0, 40, 46, 18, 0, 0, 7); g.stroke();
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 4; g.beginPath(); g.moveTo(-38, -10); g.lineTo(-38, -58); g.lineTo(38, -58); g.lineTo(38, -10); g.stroke();
      g.lineWidth = 1.2; g.strokeStyle = 'rgba(255,255,255,.45)'; for(let x = -30; x <= 30; x += 8){ g.beginPath(); g.moveTo(x, -56); g.lineTo(x, -12); g.stroke(); }
    } else if(kind === 'swirl'){   // trick rings around the ball
      g.lineCap = 'round';
      [[64, 22, 0.35, T.glow], [52, 16, -0.4, '#FFFFFF']].forEach(([rx, ry, rot, c], i) => { g.strokeStyle = c; g.globalAlpha = i ? 0.8 : 1; g.lineWidth = i ? 3 : 6; g.beginPath(); g.ellipse(0, -30, rx, ry, rot, 0.2, Math.PI * 1.7); g.stroke(); });
      g.globalAlpha = 1;
    } else if(kind === 'cage'){   // 🏙️ street cage: wall + painted goal + wire fence + graffiti star
      g.fillStyle = lin(g, 0, -110, 0, 120, ['#3A3F4C', '#20232C']); g.fillRect(-100, -110, 200, 230);
      g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.2; for(let y = -100; y < 60; y += 16){ g.beginPath(); g.moveTo(-100, y); g.lineTo(100, y); g.stroke(); for(let x = -100 + (y / 16 % 2 ? 0 : 16); x < 100; x += 32){ g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 16); g.stroke(); } }
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 5; g.beginPath(); g.moveTo(-60, 40); g.lineTo(-60, -40); g.lineTo(60, -40); g.lineTo(60, 40); g.stroke();
      g.save(); g.translate(-62, -76); g.rotate(-0.25); g.fillStyle = T.glow; g.globalAlpha = 0.9; star(g, 18, 8); g.fill(); g.restore();
      g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(-100, 40, 200, 80);
      g.strokeStyle = 'rgba(200,210,230,.45)'; g.lineWidth = 1.3; for(let k = -260; k < 260; k += 18){ g.beginPath(); g.moveTo(k, -110); g.lineTo(k + 230, 120); g.stroke(); g.beginPath(); g.moveTo(k, 120); g.lineTo(k + 230, -110); g.stroke(); }
    } else if(kind === 'cup'){   // trophy (R4)
      g.fillStyle = lin(g, -40, -90, 40, 40, ['#FFF4C8', '#FFD23F', '#B8861A']); g.strokeStyle = '#3A2A06'; g.lineWidth = 4;
      g.beginPath(); g.moveTo(-42, -84); g.lineTo(42, -84); g.quadraticCurveTo(40, -20, 8, -8); g.lineTo(8, 18); g.lineTo(26, 30); g.lineTo(-26, 30); g.lineTo(-8, 18); g.lineTo(-8, -8); g.quadraticCurveTo(-40, -20, -42, -84); g.closePath(); g.fill(); g.stroke();
      g.lineWidth = 7; g.strokeStyle = '#D9A82A'; [[-1], [1]].forEach(([s]) => { g.beginPath(); g.arc(s * 46, -60, 16, s > 0 ? -1.4 : 1.4 - Math.PI * 2, s > 0 ? 1.4 : Math.PI * 2 - 1.4 + Math.PI * 2, s < 0); g.stroke(); });
      g.fillStyle = '#5A3A10'; g.fillRect(-34, 30, 68, 16);
    }
    g.restore();
  }
  function word(g, x, y, px, a, b, fillA, fillB, ink){   // "Blas" + "Off", one word, two fills
    g.font = FONT('900 italic', px); g.textBaseline = 'middle'; g.lineJoin = 'round';
    const wa = g.measureText(a).width, wb = g.measureText(b).width, x0 = x - (wa + wb) / 2;
    g.lineWidth = px * 0.24; g.strokeStyle = ink; g.strokeText(a, x0, y); g.strokeText(b, x0 + wa, y);
    g.fillStyle = fillA; g.fillText(a, x0, y); g.fillStyle = fillB; g.fillText(b, x0 + wa, y);
    return wa + wb;
  }

  function badge(g, T, md, small){   // drawn in the unit box (≈ 220 × 260); small = icon only (the mode box shows the name)
    g.save(); g.shadowColor = T.glow; g.shadowBlur = 26 * SC; shield(g); g.lineWidth = 10; g.strokeStyle = T.glow; g.stroke(); g.restore();
    shield(g); g.fillStyle = rad(g, 0, -10, 150, [T.back[0], T.back[1]]); g.fill();
    g.save(); shield(g); g.clip();
    rays(g, T, 170, 22); sparks(g, T, 18, 110, 1);
    scene(g, T, md.scene);
    if(md.scene === 'cup'){ ball(g, 0, -40, small ? 24 : 18, 0.2); }
    else if(small){ const by = md.scene === 'swirl' ? -30 : -24; if(md.scene !== 'swirl') trail(g, T, 4, by, 42, -2.6); ball(g, 4, by, 42, 0.5); }
    else {
      const F = {match: [-2, 2, 124], futsal: [-34, -14, 124], trick: [8, 6, 124], street: [-16, 0, 128]}[md.key] || [0, 0, 124];
      const f = figure(g, T, md.pose, F[0], F[1], F[2]);
      if(md.pose === 'flick'){ ball(g, f.head[0] + 6, f.head[1] - 34, 18, 0.5); }
      else if(md.pose === 'kick'){ const bx = f.plant[0] + 30, by = f.plant[1] - 12; swoosh(g, T, f.toe[0] + 10, f.toe[1] + 6, 26, 2.2, 3.9); trail(g, T, bx, by, 15, -2.9); ball(g, bx, by, 15, 0.4); }
      else { const bx = f.toe[0] + 14, by = f.toe[1] - 10; swoosh(g, T, f.toe[0] - 16, f.toe[1] + 10, 30, md.pose === 'bicycle' ? 3.6 : 2.4, md.pose === 'bicycle' ? 5.4 : 4.2); trail(g, T, bx, by, 16, md.pose === 'bicycle' ? 2.3 : -2.7); ball(g, bx, by, 16, 0.6); }
    }
    g.restore();
    shield(g); g.lineWidth = 6; g.strokeStyle = lin(g, 0, -120, 0, 120, [T.rim[0], T.rim[1], T.rim[0], T.rim[1]]); g.stroke();
    if(small) return;
    g.save(); g.fillStyle = lin(g, 0, 62, 0, 100, ['#1A1206', '#08060A']);   // ribbon with the name
    g.beginPath(); g.moveTo(-112, 66); g.lineTo(112, 66); g.lineTo(104, 82); g.lineTo(112, 98); g.lineTo(-112, 98); g.lineTo(-104, 82); g.closePath(); g.fill();
    g.lineWidth = 3; g.strokeStyle = T.rim[0]; g.stroke(); g.restore();
    const px = 36; g.font = FONT('900 italic', px); const w = g.measureText(md.name).width, sc = Math.min(1, 190 / w);
    g.save(); g.translate(0, 82); g.scale(sc, sc); g.textAlign = 'left';
    word(g, 0, 1, px, '', md.name, '#FFFFFF', lin(g, 0, -18, 0, 18, ['#FFFFFF', md.ac, md.ac]), '#120A02'); g.restore();
  }

  function main(g, T, small){   // drawn in the unit box (≈ 480 × 360): star + rocket ball + "BlasOff" + tagline
    g.save(); g.translate(0, -36);
    g.save(); star(g, 150, 84); g.fillStyle = rad(g, 0, 0, 160, [T.space[0], T.space[1]]); g.fill(); g.clip();
    rays(g, T, 180, 26); sparks(g, T, 30, 130, 2);
    g.fillStyle = '#FFFFFF'; for(let i = 0; i < 14; i++){ const a = i * 2.1, d = 30 + (i * 53 % 90); g.globalAlpha = 0.6; g.beginPath(); g.arc(Math.cos(a) * d, Math.sin(a) * d, 1.4, 0, 7); g.fill(); } g.globalAlpha = 1;
    g.restore();
    g.save(); g.shadowColor = T.glow; g.shadowBlur = 30 * SC; g.lineJoin = 'round'; g.lineWidth = 12;
    g.strokeStyle = lin(g, -150, -150, 150, 150, [T.rim[0], T.glow, T.rim[1]]); star(g, 150, 84); g.stroke(); g.restore();
    g.lineWidth = 4; g.strokeStyle = T.rim[0]; star(g, 150, 84); g.stroke();
    // twin rocket flames left + right (from the sheet)
    [[-1], [1]].forEach(([s]) => { g.save(); g.translate(s * 118, 60); g.rotate(s * 0.35); trail(g, T, 0, 0, 16, Math.PI / 2); g.restore(); });
    rocket(g, T, 24, -42, 44, -0.95);
    g.restore();
    const ink = '#120A02', chrome = lin(g, 0, 70, 0, 128, ['#FFFFFF', '#E3E7EF', '#9AA3B5', '#F4F6FA']), fire = lin(g, 0, 70, 0, 128, [T.fire[0], T.fire[1], T.fire[2]]);
    g.save(); g.shadowColor = T.glow; g.shadowBlur = 18 * SC; word(g, 0, 102, 84, 'Blas', 'Off', chrome, fire, ink); g.restore();
    holes(g, 0, 102, 84, 'Blas', 'Off', ink);   // gl-r25 (🏷️ logo chat, Aowu Q1): no glow dot inside a / O
    word(g, 0, 102, 84, 'Blas', 'Off', chrome, fire, ink);
    if(small) return;   // tagline only where it can be read
    const tag = 'THE ULTIMATE KICK + GOAL GAME'; g.font = FONT('800', 20); const tw = g.measureText(tag).width + 34;
    g.fillStyle = 'rgba(8,6,10,.85)'; g.beginPath(); g.moveTo(-tw / 2, 138); g.lineTo(tw / 2, 138); g.lineTo(tw / 2 - 10, 162); g.lineTo(-tw / 2 + 10, 162); g.closePath(); g.fill();
    g.lineWidth = 2; g.strokeStyle = T.glow; g.stroke();
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#FFFFFF'; g.fillText(tag, 0, 151); g.textAlign = 'start';
  }


  /* 🆕 gl-r25 (🏷️ logo chat): the slim title row + the icon shield — built from the same parts (star · rocket-ball · two-fill word).
     SC stays 1 in the kit: GameLogos scales shadowBlur by itself. */
  function starPlate(g, T, x, y, R, r){   // the main's 6-point star, small: space fill + rays + stars + glowing chrome rim
    g.save(); g.translate(x, y);
    g.save(); star(g, R, r); g.fillStyle = rad(g, 0, 0, R * 1.07, [T.space[0], T.space[1]]); g.fill(); g.clip();
    rays(g, T, R * 1.2, 22); sparks(g, T, 16, R * 0.85, 2);
    g.fillStyle = '#FFFFFF'; for(let i = 0; i < 9; i++){ const q = i * 2.1, d = R * 0.2 + (i * 53 % 60) * R / 100; g.globalAlpha = 0.6; g.beginPath(); g.arc(Math.cos(q) * d, Math.sin(q) * d, R / 90, 0, 7); g.fill(); } g.globalAlpha = 1;
    g.restore();
    g.save(); g.shadowColor = T.glow; g.shadowBlur = R * 0.2 * SC; g.lineJoin = 'round'; g.lineWidth = R * 0.08;
    g.strokeStyle = lin(g, -R, -R, R, R, [T.rim[0], T.glow, T.rim[1]]); star(g, R, r); g.stroke(); g.restore();
    g.lineWidth = R * 0.027; g.strokeStyle = T.rim[0]; star(g, R, r); g.stroke();
    g.restore();
  }
  function holes(g, x, y, px, a, b, ink){   // gl-r25: paints ONLY the letters' closed holes (a · O) dark, so the glow pass can't show as a dot inside them
    const m = g.getTransform(), k = Math.max(1, Math.hypot(m.a, m.b)); g.save(); g.font = FONT('900 italic', px);
    const wa = g.measureText(a).width, wb = g.measureText(b).width, pad = px * 0.35, Wu = wa + wb + pad * 2, Hu = px * 1.8, W = Math.ceil(Wu * k), H = Math.ceil(Hu * k);
    const c = document.createElement('canvas'); c.width = W; c.height = H; const q = c.getContext('2d'); q.scale(k, k);
    q.font = g.font; q.textBaseline = 'middle'; q.lineJoin = 'round'; q.lineWidth = px * 0.24; q.strokeStyle = q.fillStyle = '#000';
    q.strokeText(a, pad, Hu / 2); q.strokeText(b, pad + wa, Hu / 2); q.fillText(a, pad, Hu / 2); q.fillText(b, pad + wa, Hu / 2);
    const d = q.getImageData(0, 0, W, H), A = d.data, out = new Uint8Array(W * H), st = [];   // flood the outside from the border; what stays clear is a hole
    for(let i = 0; i < W; i++){ st.push(i, (H - 1) * W + i); } for(let j = 0; j < H; j++){ st.push(j * W, j * W + W - 1); }
    while(st.length){ const p = st.pop(); if(out[p] || A[p * 4 + 3] > 96) continue; out[p] = 1; const px0 = p % W; if(px0 > 0) st.push(p - 1); if(px0 < W - 1) st.push(p + 1); if(p >= W) st.push(p - W); if(p < W * (H - 1)) st.push(p + W); }
    const n = parseInt(ink.slice(1), 16);
    const H0 = new Uint8Array(W * H); for(let p = 0; p < W * H; p++) H0[p] = !out[p] && A[p * 4 + 3] <= 96 ? 1 : 0;
    const R = Math.max(1, Math.round(k * 1.5)), HD = new Uint8Array(W * H);   // grow each hole a little so its soft edge is covered too
    for(let p = 0; p < W * H; p++) if(H0[p]){ const x1 = p % W, y1 = (p / W) | 0; for(let dy = -R; dy <= R; dy++) for(let dx = -R; dx <= R; dx++){ const xx = x1 + dx, yy = y1 + dy; if(xx >= 0 && yy >= 0 && xx < W && yy < H) HD[yy * W + xx] = 1; } }
    for(let p = 0; p < W * H; p++){ const hole = HD[p]; A[p * 4] = n >> 16; A[p * 4 + 1] = (n >> 8) & 255; A[p * 4 + 2] = n & 255; A[p * 4 + 3] = hole ? 255 : 0; }
    q.putImageData(d, 0, 0);
    g.drawImage(c, x - (wa + wb) / 2 - pad, y - Hu / 2, Wu, Hu); g.restore();
  }
  function wide(g, T, small){   // 760 × 190: star + rocket-ball on the left, "BlasOff" on the right, a fire swoosh under the word
    g.save(); g.lineCap = 'round';   // fire swoosh
    [[0, 9, T.fire[1], 0.9], [1, 4, T.glow, 0.8], [2, 2, '#FFFFFF', 0.7]].forEach(([i, w, c, al]) => { g.globalAlpha = al; g.strokeStyle = c; g.lineWidth = w;
      g.beginPath(); g.ellipse(462, 26 - i * 6, 300, 140 + i * 6, 0, Math.PI * 0.2, Math.PI * 0.8); g.stroke(); });
    g.restore();
    starPlate(g, T, 104, 95, 82, 46);
    [[-1], [1]].forEach(([s]) => { g.save(); g.translate(104 + s * 58, 150); g.rotate(s * 0.35); trail(g, T, 0, 0, 9, Math.PI / 2); g.restore(); });   // twin flames
    rocket(g, T, 118, 80, 30, -0.95);
    if(!small){ g.save(); g.translate(104, 95); sparks(g, T, 10, 120, 5); g.restore(); }
    const ink = '#120A02', chrome = lin(g, 0, -42, 0, 40, ['#FFFFFF', '#E3E7EF', '#9AA3B5', '#F4F6FA']), fire = lin(g, 0, -42, 0, 40, [T.fire[0], T.fire[1], T.fire[2]]);   // gradients in the word's own frame (main: 70…128 round y 102)
    g.save(); g.translate(472, 96);
    g.font = FONT('900 italic', 120); const w = g.measureText('BlasOff').width, sc = Math.min(1, 500 / w); g.scale(sc, sc);   // never wider than its row (never squeezed: one even scale)
    g.save(); g.shadowColor = T.glow; g.shadowBlur = 22 * SC; word(g, 0, 0, 120, 'Blas', 'Off', chrome, fire, ink); g.restore();
    holes(g, 0, 0, 120, 'Blas', 'Off', ink);
    word(g, 0, 0, 120, 'Blas', 'Off', chrome, fire, ink);
    g.restore();
  }
  function icon(g, T, small){   // 272 × 300 icon: the shield with the star + rocket-ball inside; the "BlasOff" ribbon from 110 px up
    g.save(); g.shadowColor = T.glow; g.shadowBlur = 26 * SC; shield(g); g.lineWidth = 10; g.strokeStyle = T.glow; g.stroke(); g.restore();
    shield(g); g.fillStyle = rad(g, 0, -10, 150, [T.back[0], T.back[1]]); g.fill();
    g.save(); shield(g); g.clip();
    rays(g, T, 170, 22); sparks(g, T, 18, 110, 1);
    const k = small ? 1.18 : 0.96, cy = small ? -2 : -20;
    g.save(); g.translate(0, cy); g.scale(k, k);
    [[-1], [1]].forEach(([s]) => { g.save(); g.translate(s * 50, 52); g.rotate(s * 0.35); trail(g, T, 0, 0, 10, Math.PI / 2); g.restore(); });
    starPlate(g, T, 0, 0, 78, 44);
    rocket(g, T, 10, -10, 32, -0.95);
    g.restore();
    g.restore();
    shield(g); g.lineWidth = 6; g.strokeStyle = lin(g, 0, -120, 0, 120, [T.rim[0], T.rim[1], T.rim[0], T.rim[1]]); g.stroke();
    if(small) return;
    g.save(); g.fillStyle = lin(g, 0, 62, 0, 100, ['#1A1206', '#08060A']);   // ribbon with the name (like the mode badges)
    g.beginPath(); g.moveTo(-112, 66); g.lineTo(112, 66); g.lineTo(104, 82); g.lineTo(112, 98); g.lineTo(-112, 98); g.lineTo(-104, 82); g.closePath(); g.fill();
    g.lineWidth = 3; g.strokeStyle = T.rim[0]; g.stroke(); g.restore();
    const px = 40; g.font = FONT('900 italic', px); const w = g.measureText('BlasOff').width, sc = Math.min(1, 196 / w);
    g.save(); g.translate(0, 82); g.scale(sc, sc);
    word(g, 0, 1, px, 'Blas', 'Off', lin(g, 0, -18, 0, 18, ['#FFFFFF', '#E3E7EF', '#9AA3B5', '#F4F6FA']), lin(g, 0, -18, 0, 18, [T.fire[0], T.fire[1], T.fire[2]]), '#120A02'); g.restore();
  }
  const BOX = {main: [520, 430], wide: [760, 190], badge: [272, 300], match: [272, 300], futsal: [272, 300], street: [272, 300], trick: [272, 300], cup: [272, 300]};
  return {BOX: BOX, LOOK: THEME, paint: function (g, kind, T, px) {   // px = CSS width → the same size steps as BlasLogo (tagline ≥ 260 · ribbon ≥ 110)
    SC = 1; const [bw, bh] = BOX[kind]; g.save(); g.textAlign = 'start';
    if(kind === 'main'){ const sm = px < 260; if(sm){ g.translate(bw / 2, bh / 2 + 28); g.scale(1.17, 1.17); } else g.translate(bw / 2, bh / 2 + 21); main(g, T, sm); }   // small (Station cards, < 260 px) = no tagline → star + word centred and 1.17× bigger, so it fills its card like the others
    else if(kind === 'wide'){ wide(g, T, px < 320); }
    else { g.translate(bw / 2, bh / 2); kind === 'badge' ? icon(g, T, px < 110) : badge(g, T, MODE[kind], px < 110); }
    g.restore();
  }};
})());
// 🏷️ LOGO blasoff END
