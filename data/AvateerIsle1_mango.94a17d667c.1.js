
/* 🎨 AvateerIsle1_mango — the LOOK of Island 1 islet 🥭 Mango Grove (adventure) for the 🦴 shell AvateerIsle1 (il1-shell 2026-11-28, 🧳 Avateer Development chat — then this islet's 🏝️ chat).
   An islet chat edits ONLY this file (Test Harness/avateer/il1/look_mango.js → build_il1.py): district ground (areas) · extra ground tiles that never block · DECOR rows (no id) ·
   the look of named props (named: {id: {v, cond}} — never their place or turn) · 🎵 mood. Never a spot · named prop · path · lock · link · hook · spawn (📨 the 🧳 chat). Contract test: node il1/islet.test.js mango. */
AvWorld.data('il1.mango', function(){
AvWorld.look('il1', 'mango', {
  mood: null,   // 🎵 the islet's mood key — the islet chat picks it at its R1
  named: {},
  props: [
    ["mango", 20, 77], ["mango", 30, 80, {"v":1}], ["mango", 17, 68], ["mango", 29, 57, {"v":1}], ["mango", 20, 59],
    ["mango", 33, 68], ["mango", 14, 74, {"v":1}], ["mango", 26, 53], ["bamboo", 15, 62], ["bamboo", 35, 54],
    ["bamboo", 21, 83], ["banana", 32, 84], ["banana", 14, 66, {"v":1}], ["banana", 35, 78, {"v":2}], ["bush", 18, 72],
    ["rock", 27, 72], ["log", 23, 68], ["flowers", 29, 75], ["flowers", 21, 63], ["mango", 45, 69],
    ["mango", 47, 59, {"v":1}], ["bush", 44, 74], ["banana", 48, 63], ["mango", 30, 52], ["mango", 20, 56],
    ["mango", 24, 56], ["mango", 32, 56], ["mango", 26, 60, {"v":1}], ["banana", 34, 60], ["mango", 42, 60],
    ["mango", 30, 68, {"v":1}], ["mango", 42, 68, {"v":1}], ["bush", 23, 53], ["bamboo", 17, 76], ["bamboo", 23, 81],
    ["bamboo", 45, 58], ["bush", 42, 54], ["bamboo", 21, 80], ["bamboo", 43, 56], ["bamboo", 46, 75],
    ["bamboo", 48, 67], ["bamboo", 15, 71], ["bush", 42, 80], ["bamboo", 32, 51], ["bush", 37, 82],
    ["bush", 16, 60], ["bamboo", 29, 83], ["bamboo", 35, 83], ["bush", 47, 72], ["bush", 44, 78],
    ["bamboo", 21, 54], ["bush", 18, 57], ["bush", 37, 52], ["bush", 16, 73], ["bush", 27, 51],
    ["bush", 35, 51], ["bamboo", 46, 61]
  ]
});
});
