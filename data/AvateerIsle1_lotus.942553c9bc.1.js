
/* 🎨 AvateerIsle1_lotus — the LOOK of Island 1 islet 🪷 Lotus Garden (secret) for the 🦴 shell AvateerIsle1 (il1-shell 2026-11-28, 🧳 Avateer Development chat — then this islet's 🏝️ chat).
   An islet chat edits ONLY this file (Test Harness/avateer/il1/look_lotus.js → build_il1.py): district ground (areas) · extra ground tiles that never block · DECOR rows (no id) ·
   the look of named props (named: {id: {v, cond}} — never their place or turn) · 🎵 mood. Never a spot · named prop · path · lock · link · hook · spawn (📨 the 🧳 chat). Contract test: node il1/islet.test.js lotus. */
AvWorld.data('il1.lotus', function(){
AvWorld.look('il1', 'lotus', {
  mood: null,   // 🎵 the islet's mood key — the islet chat picks it at its R1
  named: {},
  props: [
  ]
});
});
