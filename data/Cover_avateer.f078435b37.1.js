
/* 🎬 Cover_avateer — 🧳 Avateer (🧳 Avateer Development chat, av-s1c 2026-11-27): 🇹🇭 Island 1's Landing islet, baked from the REAL IsoKit map by the page
   (Avateer.html coverShot), with Pudding tooting in the corner. The page hands it over as window.AV_COVER = {still, live, spots} before it opens the cover;
   this block only passes them on (+ a sky fallback) so GameCovers stays small — the same pattern as Cover_avatarealm. */
(function(K){
  'use strict';
  if(!K) return;
  const {clamp, cloud, root} = K;
  let Z = null;
  const add = (id, def) => K.add(id, def, z => { Z = z; });
  // 🎬 COVER avateer START
  add('avateer', {
    still(g, W, H, o){ const A = root.AV_COVER; if(A && A.still) return A.still(g, W, H, o);
      const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#7CCBFF'); sky.addColorStop(0.62, '#D6F0FF'); sky.addColorStop(1, '#FFE8C2'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
      cloud(g, W * 0.14, H * 0.24, Math.max(0.6, W / 1100), 0.9); cloud(g, W * 0.8, H * 0.16, Math.max(0.7, W / 900), 0.9); },
    live(g, W, H, t, o){ const A = root.AV_COVER; if(A && A.live) A.live(g, W, H, t, o); },
    spots(W, H){ const A = root.AV_COVER; if(A && A.spots) return A.spots(W, H); const k = clamp(H / 1000, 0.4, 0.8);
      return [{x: W * 0.5, y: H * 0.86, k}, {x: W * 0.62, y: H * 0.9, k: k * 0.95, from: 1, dir: -1}, {x: W * 0.74, y: H * 0.88, k: k * 0.9, from: 1, dir: -1}]; }
  });
  // 🎬 COVER avateer END
  K.loaded('avateer', 'av-s1c');
})(window.GameCovers && window.GameCovers._K);
