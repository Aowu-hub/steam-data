
/* 🎨 AvateerIsle1_temple — the LOOK of Island 1 islet 🛕 River Temple (sacred) for the 🦴 shell AvateerIsle1 (il1-shell 2026-11-28, 🧳 Avateer Development chat — then this islet's 🏝️ chat).
   An islet chat edits ONLY this file (Test Harness/avateer/il1/look_temple.js → build_il1.py): district ground (areas) · extra ground tiles that never block · DECOR rows (no id) ·
   the look of named props (named: {id: {v, cond}} — never their place or turn) · 🎵 mood. Never a spot · named prop · path · lock · link · hook · spawn (📨 the 🧳 chat). Contract test: node il1/islet.test.js temple. */
AvWorld.data('il1.temple', function(){
AvWorld.look('il1', 'temple', {
  mood: null,   // 🎵 the islet's mood key — the islet chat picks it at its R1
  areas: [{"x0":60,"x1":106,"y0":43,"y1":91,"t":"stone","t2":"grass","every":4}],
  tiles: [{"t":"stone","disc":[83,67,5.6]},{"t":"stone","at":[[82,57],[83,57],[82,58],[83,58],[82,59],[83,59],[82,60],[83,60],[82,61],[83,61],[82,62],[83,62]]}],
  named: {},
  props: [
  ]
});
});
