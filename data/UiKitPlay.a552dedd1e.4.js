
(function(){
  /* 🎨 24ink INK GUARD (✨ Polish chat, 2026-11-28): a dark look (🌃 Cyberpunk · 🔮 Hologram · 📐 Architect) makes --ink near-white; a game's own
     LIGHT card / chip / sticker inside a themed screen then shows white words on white. Any element whose own background comes out light
     while its words come out light gets .t-ink = the classic dark ink for it and everything inside (a chip filled with --ink turns dark with
     white words). Re-measured every pass (a card that turns dark loses it). Classic / light looks: never touched. */
  function inkRgb(c){ const m = String(c).match(/rgba?\(([^)]+)\)/); if(!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
  function inkLum(c){ const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); }
  function inkRatio(color, bg){   /* contrast of the words (their own see-through laid over bg) against bg */
    const f = inkRgb(color); if(!f) return 21; const a = f[3], m = [f[0] * a + bg[0] * (1 - a), f[1] * a + bg[1] * (1 - a), f[2] * a + bg[2] * (1 - a)];
    const x = inkLum(m), y = inkLum(bg); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function inkOwnBg(cs){   /* own fill (colour, or the average of a gradient's colours); null = see-through / a picture */
    let c = inkRgb(cs.backgroundColor);
    if(cs.backgroundImage && cs.backgroundImage !== 'none'){ if(!/gradient/.test(cs.backgroundImage)) return null; const g = (cs.backgroundImage.match(/rgba?\([^)]+\)/g) || []).map(inkRgb).filter(Boolean); if(g.length){ const a = g.reduce((s, x) => s.map((v, i) => v + x[i]), [0, 0, 0, 0]).map(v => v / g.length); if(a[3] > 0.5) c = a; } }
    return c && c[3] > 0.02 ? c : null;
  }
  function inkBgOf(e, cs){   /* what the words really sit on: the own fill (it must have one) laid over the parents' fills down to the first solid one */
    const own = inkOwnBg(cs); if(!own) return null;
    const st = [own]; let x = e.parentElement;
    while(own[3] < 0.95 && x && st[st.length - 1][3] < 0.95){ const c2 = getComputedStyle(x); if(c2.backgroundImage && c2.backgroundImage !== 'none' && !/gradient/.test(c2.backgroundImage)) return null; const f = inkOwnBg(c2); if(f) st.push(f); x = x.parentElement; }
    let base = [255, 255, 255, 1]; for(let i = st.length - 1; i >= 0; i--){ const t = st[i], a = t[3]; base = [t[0] * a + base[0] * (1 - a), t[1] * a + base[1] * (1 - a), t[2] * a + base[2] * (1 - a), 1]; }
    return base;
  }
  UI.inkGuard = function(on, key){   /* called by UiKit tagMenus (core) each pass; key = the look */
    document.querySelectorAll('.t-ink').forEach(e => e.classList.remove('t-ink'));
    document.querySelectorAll('[data-ink-c]').forEach(e => { e.style.removeProperty('color'); e.removeAttribute('data-ink-c'); });
    if(!on || !/^(architect|hologram|cyberpunk)$/.test(key || '')) return;
    document.querySelectorAll('section.screen:not(.hidden), .top-btn').forEach(sc => {
      [sc].concat([...sc.querySelectorAll('button, div, label, span, a, li, p, input, textarea, select, details, summary, h2, h3, h4')]).forEach(e => {
        if(e.closest('canvas, svg')) return;
        const cs = getComputedStyle(e), bg = inkBgOf(e, cs); if(!bg) return;
        if(!(e.parentElement && e.parentElement.closest('.t-ink')) && inkLum(bg) >= 0.45 && inkRatio(cs.color, bg) < 2.5) e.classList.add('t-ink');
        const c2 = e.classList.contains('t-ink') ? getComputedStyle(e) : cs, b2 = c2 === cs ? bg : inkBgOf(e, c2);
        /* still hard to read (color: inherit · a see-through --card · a kit rule with !important) → a plain ink that fits the fill, inline so it always wins */
        if(b2 && inkRatio(c2.color, b2) < 1.6){ e.style.setProperty('color', inkLum(b2) >= 0.45 ? '#2B2D42' : '#FFFFFF', 'important'); e.setAttribute('data-ink-c', '1'); }
      });
    });
  };
  /* UiKit may have themed the page before this file ran: one pass now */
  try{ const sc = document.querySelector('section.screen[data-theme]'); if(sc) UI.inkGuard(true, sc.getAttribute('data-theme')); }catch(e){}
})();
