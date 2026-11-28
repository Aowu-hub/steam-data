
/* 🎨 AvateerIsle1_camps — the LOOK of Island 1 islet 🦖🤖 Raptor Ridge + Bolt Works (adventure + town) for the 🦴 shell AvateerIsle1 (il1-shell 2026-11-28, 🧳 Avateer Development chat — then this islet's 🏝️ chat).
   An islet chat edits ONLY this file (Test Harness/avateer/il1/look_camps.js → build_il1.py): district ground (areas) · extra ground tiles that never block · DECOR rows (no id) ·
   the look of named props (named: {id: {v, cond}} — never their place or turn) · 🎵 mood. Never a spot · named prop · path · lock · link · hook · spawn (📨 the 🧳 chat). Contract test: node il1/islet.test.js camps. */
AvWorld.data('il1.camps', function(){
AvWorld.look('il1', 'camps', {
  mood: null,   // 🎵 the islet's mood key — the islet chat picks it at its R1
  areas: [{"x0":35.6,"t":"stone","t2":"path","every":11}],
  tiles: [{"t":"sand","pts":[[31.5,12.2],[31.6,15.6]],"w":9}],
  named: {},
  props: [
    ["crates", 42, 19], ["crates", 38, 26], ["rock", 48, 22], ["rock", 37, 34], ["bamboo", 21, 25],
    ["jtree", 22, 25], ["bush", 21, 26], ["bush", 21, 31], ["bamboo", 22, 31], ["bamboo", 21, 32],
    ["bush", 26, 36], ["bamboo", 27, 36], ["bamboo", 26, 37], ["bush", 18, 21], ["bamboo", 19, 21],
    ["bamboo", 18, 22], ["crates", 42, 28], ["rock", 43, 28], ["crates", 42, 29], ["crates", 42, 33],
    ["rock", 43, 33], ["crates", 42, 34]
  ]
});
});
