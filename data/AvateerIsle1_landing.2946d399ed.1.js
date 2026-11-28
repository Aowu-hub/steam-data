
/* 🎨 AvateerIsle1_landing — the LOOK of Island 1 islet 🛶 Landing Village (home) for the 🦴 shell AvateerIsle1 (il1-shell 2026-11-28, 🧳 Avateer Development chat — then this islet's 🏝️ chat).
   An islet chat edits ONLY this file (Test Harness/avateer/il1/look_landing.js → build_il1.py): district ground (areas) · extra ground tiles that never block · DECOR rows (no id) ·
   the look of named props (named: {id: {v, cond}} — never their place or turn) · 🎵 mood. Never a spot · named prop · path · lock · link · hook · spawn (📨 the 🧳 chat). Contract test: node il1/islet.test.js landing. */
AvWorld.data('il1.landing', function(){
AvWorld.look('il1', 'landing', {
  mood: null,   // 🎵 the islet's mood key — the islet chat picks it at its R1
  named: {},
  props: [
    ["il1_ricefield", 3, 114, {"state":"young"}], ["il1_ricefield", 6, 119, {"state":"gold","v":1}], ["well_thai", 23, 104], ["lantern_thai", 17, 116], ["lantern_thai", 26, 105],
    ["lantern_thai", 29, 116], ["palm", 5, 104], ["palm", 11, 125, {"v":1}], ["banana", 12, 126, {"v":2}], ["palm", 32, 95],
    ["palm", 38, 102, {"v":1}], ["banana", 41, 107], ["palm", 24, 128], ["palm", 18, 129, {"v":2}], ["banana", 2, 108],
    ["jtree", 11, 102], ["bush", 26, 95, {"v":1}], ["jtree", 5, 101], ["bush", 17, 95], ["jtree", 33, 107, {"v":1}],
    ["crates", 33, 117], ["flowers", 12, 117], ["flowers", 24, 114], ["rock", 9, 122], ["palm", 16, 126, {"v":0}],
    ["palm", 34, 99, {"v":2}], ["palm", 36, 105, {"v":1}], ["palm", 37, 108], ["banana", 13, 95], ["palm", 6, 107],
    ["palm", 5, 111, {"v":0}], ["banana", 29, 95, {"v":0}], ["palm", 8, 102], ["palm", 39, 110, {"v":1}], ["palm", 19, 126],
    ["banana", 21, 128, {"v":2}], ["palm", 35, 102], ["bush", 15, 121], ["bush", 24, 120], ["flowers", 18, 119],
    ["bush", 17, 99], ["flowers", 15, 102], ["bush", 19, 104], ["flowers", 20, 114], ["bush", 21, 121],
    ["flowers", 27, 112], ["flowers", 24, 100], ["bush", 29, 107], ["flowers", 18, 122], ["bush", 12, 121],
    ["bush", 14, 110], ["bush", 11, 105], ["flowers", 9, 116], ["bush", 25, 109]
  ]
});
});
