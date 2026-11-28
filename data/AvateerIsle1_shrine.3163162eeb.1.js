
/* 🎨 AvateerIsle1_shrine — the LOOK of Island 1 islet 🔔 Sky Shrine (climax) for the 🦴 shell AvateerIsle1 (il1-shell 2026-11-28, 🧳 Avateer Development chat — then this islet's 🏝️ chat).
   An islet chat edits ONLY this file (Test Harness/avateer/il1/look_shrine.js → build_il1.py): district ground (areas) · extra ground tiles that never block · DECOR rows (no id) ·
   the look of named props (named: {id: {v, cond}} — never their place or turn) · 🎵 mood. Never a spot · named prop · path · lock · link · hook · spawn (📨 the 🧳 chat). Contract test: node il1/islet.test.js shrine. */
AvWorld.data('il1.shrine', function(){
AvWorld.look('il1', 'shrine', {
  mood: null,   // 🎵 the islet's mood key — the islet chat picks it at its R1
  areas: [{"x0":74,"x1":100,"t":"stone","t2":"flower","every":9}],
  named: {},
  props: [
  ]
});
});
