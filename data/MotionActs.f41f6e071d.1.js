
/* 🧑 MotionActs (🎬 Motion chat, mo-24, 2026-11-27) — §67 A the PLAYER ACT PACK: 32 shared acts `motion.<act>` for every game, comic and crowd.
   Island 1 wai · coverEars · breathe (⏸ hold) + breathe.out · the old Room gestures as 3–5-beat acts sit · wave · bow · dance · still ·
   Island 2 eat · glide (⏸) + glide.land (😄 hay flop) · dawnDance · drum.don · drum.ka · mirrorAim · Island 3 shiver · warmHands (hands OUT, never in) ·
   raftRide · wiggleSlow · dig · Island 5 grapple (throw) + grapple.swing (⏸) + grapple.land · phew · offerHand (⏸) + offerHand.back · listen (👂 ear mark) · hum · pullApart ·
   breatheOut · holdNoPull. Plan picture `Claude outputs/mo-24p/mo24-plan.png` · Motion rules §72–74.
   USE   Motion.need('acts', () => Acting.draw(g, who, x, y, k, 'motion.wai', {t}))   — or run = Acting.play(who, 'motion.grapple', {t0, onContact}) → run.at(t)
         ⏸ holds (hold: 'keep'): the LAST pose stays while the game holds the act; let go with its partner (breathe.out · glide.land · grapple.swing → grapple.land · offerHand.back)
         🔁 loops (loop: true): the last beat = the first — restart the act when run.done
         🔗 every act names its `lead` chain; `overlap` makes the followers lag 30 / 45 / 60 ms; drum.don + dig = card 'twoHand', grapple = card 'throw' (Motion.JOINT_CARDS)
   Facing right: armR + = forward · armL − = forward (far arm) · legR − / legL + = forward · elbows + fold (0 … 2.6) · knees + fold back.
   Born checked: every pose flat + turned and every 20 ms of every act (flat + SW) through motion/jointlint.js (R1–R2 + R7). Adds poses mp.* · acts motion.* · mark `ear`.
   Lazy: online = Code.gs INCLUDE_LAZY_ AvatarKit (MotionActs → 'acts'); offline app + harness = inline (instant). Old acts + AvatarKit GESTURES are untouched. */
(function () {
const M = window.Motion; if (typeof Acting === 'undefined' || !Acting.add) return;   // (typeof: the node lint runs this file with its own Acting)
if (M && M.ACTS) return;   // asked twice = once
Acting.add({poses: {
  // 🙏 wai — palms together at the chest, a small bow with fingertips at the nose
  'mp.wai-up':    {armR: 0.8, elbowR: 1.7, armL: -0.8, elbowL: 1.7, handR: 'open', handL: 'open', nod: -0.08, sy: 1.01},
  'mp.wai-bow':   {armR: 1.05, elbowR: 1.85, armL: -1.05, elbowL: 1.85, handR: 'open', handL: 'open', bend: 0.32, nod: 0.25, shift: -1.5, kneeL: 0.1, kneeR: 0.1},
  'mp.wai-rise':  {armR: 0.75, elbowR: 1.65, armL: -0.75, elbowL: 1.65, handR: 'open', handL: 'open', bend: 0.04, nod: 0.05},
  // 🙉 cover ears — flinch, hands clap over the ears, shoulders up, knees soft
  'mp.ears-flinch': {shrugL: 0.5, shrugR: 0.5, armR: 0.5, elbowR: 0.6, armL: 0.5, elbowL: 0.6, bend: -0.06, dy: 1, kneeL: 0.15, kneeR: 0.15},
  'mp.ears-on':     {armR: 2.5, elbowR: 2.5, armL: 2.5, elbowL: 2.5, shrugL: 0.8, shrugR: 0.8, bend: 0.12, nod: 0.12, kneeL: 0.35, kneeR: 0.35, legL: 0.12, legR: -0.05, dy: 3, handR: 'open', handL: 'open'},
  'mp.ears-peek':   {armR: 2.45, elbowR: 2.3, armL: 2.5, elbowL: 2.5, shrugL: 0.6, shrugR: 0.4, bend: 0.06, neckTilt: 0.15, kneeL: 0.2, kneeR: 0.2, dy: 2, handR: 'open', handL: 'open'},
  // 🫁 breathe — plant the feet (knees bend), breathe in (chest up, arms float out), hold · out = arms float down, a soft sag
  'mp.br-plant':  {kneeL: 0.3, kneeR: 0.3, legL: 0.12, legR: -0.12, dy: 2, armR: 0.25, armL: 0.25, nod: 0.08},
  'mp.br-in':     {kneeL: 0.22, kneeR: 0.22, legL: 0.12, legR: -0.12, dy: 1, armR: 0.65, elbowR: 0.2, armL: 0.65, elbowL: 0.2, shrugL: 0.45, shrugR: 0.45, nod: -0.14, sy: 1.04, bend: -0.06, handR: 'open', handL: 'open'},
  'mp.br-out':    {kneeL: 0.3, kneeR: 0.3, legL: 0.12, legR: -0.12, dy: 2, armR: 0.18, armL: 0.18, nod: 0.18, sy: 0.97, bend: 0.1},
  // 🪁 glide — crouch, jump to the bar (hands overhead), lift on the updraft, legs dangle · land: legs reach, squash, then the hay flop
  'mp.gl-crouch': {kneeL: 0.9, kneeR: 0.9, legL: 0.45, legR: -0.45, dy: 7, bend: 0.25, armR: -0.6, armL: 0.6},
  'mp.gl-open':   {armR: 2.95, elbowR: 0.25, armL: -2.95, elbowL: 0.25, legL: 0.35, legR: -0.1, kneeL: 1.1, kneeR: 0.9, dy: -14, handR: 'grip', handL: 'grip', nod: -0.1},
  'mp.gl-lift':   {armR: 3.05, elbowR: 0.15, armL: -3.05, elbowL: 0.15, legL: 0.15, legR: 0.05, kneeL: 0.5, kneeR: 0.35, dy: -24, handR: 'grip', handL: 'grip', nod: -0.05},
  'mp.gl-dangle': {armR: 3.0, elbowR: 0.2, armL: -3.0, elbowL: 0.2, legL: 0.2, legR: 0.1, kneeL: 0.3, kneeR: 0.45, dy: -20, handR: 'grip', handL: 'grip'},
  'mp.gl-reach':  {armR: 2.6, elbowR: 0.3, armL: -2.6, elbowL: 0.3, legL: 0.3, legR: -0.25, kneeL: 0.2, kneeR: 0.15, dy: -8, footL: 0.3, footR: 0.3},
  'mp.gl-squash': {armR: 1.2, elbowR: 0.4, armL: -1.2, elbowL: 0.4, legL: 0.35, legR: -0.35, kneeL: 1.2, kneeR: 1.2, dy: 9, sy: 0.9, sx: 1.06, bend: 0.3},
  'mp.gl-flop':   {rotFull: -1.35, dy: 22, armR: 2.6, elbowR: 0.2, armL: 2.6, elbowL: 0.2, legL: 0.9, legR: -0.6, kneeL: 0.3, kneeR: 0.5, handR: 'open', handL: 'open'},
  // 🌅 dawn dance — the silly festival dance: step-hop, one arm up, the other on the hip, swap
  'mp.dd-a':      {armR: 2.9, elbowR: 0.5, armL: 0.4, elbowL: 1.9, legL: 0.5, kneeL: 1.2, legR: 0, dy: -4, rot: -0.08, twist: 0.15, handR: 'open'},
  'mp.dd-b':      {armR: 0.4, elbowR: 1.9, armL: 2.9, elbowL: 0.5, legR: -0.5, kneeR: 1.2, legL: 0, dy: -4, rot: 0.08, twist: -0.15, handL: 'open'},
  'mp.dd-low':    {armR: 1.5, elbowR: 0.9, armL: 1.5, elbowL: 0.9, kneeL: 0.5, kneeR: 0.5, legL: 0.15, legR: -0.15, dy: 4},
  // 🥁 drum — don (middle, both sticks down) · ka (rim, a light side tap)
  'mp.dr-ready':  {armR: 1.0, elbowR: 1.3, armL: -1.0, elbowL: 1.3, legL: 0.2, legR: -0.2, kneeL: 0.3, kneeR: 0.3, dy: 2, handR: 'grip', handL: 'grip'},
  'mp.dr-up':     {armR: 2.6, elbowR: 0.9, armL: -2.6, elbowL: 0.9, legL: 0.2, legR: -0.2, kneeL: 0.3, kneeR: 0.3, dy: 2, bend: -0.12, handR: 'grip', handL: 'grip', nod: -0.1},
  'mp.dr-don':    {armR: 1.2, elbowR: 0.6, armL: -1.2, elbowL: 0.6, legL: 0.2, legR: -0.2, kneeL: 0.3, kneeR: 0.3, dy: 4, bend: 0.18, handR: 'grip', handL: 'grip', nod: 0.1},
  'mp.dr-kaup':   {armR: 1.6, elbowR: 1.4, armL: -1.0, elbowL: 1.3, twist: 0.12, legL: 0.2, legR: -0.2, kneeL: 0.3, kneeR: 0.3, dy: 2, handR: 'grip', handL: 'grip'},
  'mp.dr-ka':     {armR: 0.75, elbowR: 0.9, armL: -1.0, elbowL: 1.3, twist: -0.08, legL: 0.2, legR: -0.2, kneeL: 0.32, kneeR: 0.32, dy: 2, handR: 'grip', handL: 'grip'},
  // 🪞 mirror aim — both hands hold the mirror up in front, tilt it with the wrists
  'mp.mi-hold':   {armR: 1.3, elbowR: 1.1, armL: -1.3, elbowL: 1.1, handR: 'grip', handL: 'grip', legL: 0.15, legR: -0.15},
  'mp.mi-up':     {armR: 1.9, elbowR: 0.9, armL: -1.9, elbowL: 0.9, handR: 'grip', handL: 'grip', legL: 0.25, legR: -0.15, kneeL: 0.15, bend: -0.08, nod: -0.12, neckTilt: 0.12},
  'mp.mi-aim':    {armR: 1.7, elbowR: 0.6, armL: -1.7, elbowL: 0.6, wristR: 0.35, wristL: 0.35, handR: 'grip', handL: 'grip', legL: 0.3, legR: -0.15, kneeL: 0.2, bend: 0.04, nod: -0.05, neckTilt: 0.18},
  // 🥶 shiver — hug yourself, shoulders up, knees in, small fast shakes
  'mp.sh-hug':    {armR: 0.55, elbowR: 2.5, armL: -0.55, elbowL: 2.5, shrugR: 0.9, shrugL: 0.9, kneeL: 0.25, kneeR: 0.25, legL: -0.06, legR: 0.06, dy: 2, nod: 0.15, bend: 0.06},
  'mp.sh-l':      {armR: 0.6, elbowR: 2.45, armL: -0.5, elbowL: 2.5, shrugR: 0.95, shrugL: 0.85, kneeL: 0.27, kneeR: 0.25, legL: -0.06, legR: 0.06, dy: 2, nod: 0.15, bend: 0.06, rot: -0.03, shift: -0.6},
  'mp.sh-r':      {armR: 0.5, elbowR: 2.5, armL: -0.6, elbowL: 2.45, shrugR: 0.85, shrugL: 0.95, kneeL: 0.25, kneeR: 0.27, legL: -0.06, legR: 0.06, dy: 2, nod: 0.15, bend: 0.06, rot: 0.03, shift: 0.6},
  // 🔥 warm hands — hands OUT to the fire, palms open (never in), a little lean
  'mp.wh-rub':    {armR: 0.8, elbowR: 1.7, armL: -0.8, elbowL: 1.7, handR: 'open', handL: 'open', shrugR: 0.4, shrugL: 0.4, kneeL: 0.15, kneeR: 0.15},
  'mp.wh-out':    {armR: 1.3, elbowR: 0.45, armL: -1.15, elbowL: 0.5, handR: 'open', handL: 'open', bend: 0.1, legL: 0.25, legR: -0.05, kneeL: 0.2, kneeR: 0.1, shift: 1},
  'mp.wh-out2':   {armR: 1.35, elbowR: 0.35, armL: -1.2, elbowL: 0.4, handR: 'open', handL: 'open', bend: 0.12, legL: 0.25, legR: -0.05, kneeL: 0.2, kneeR: 0.1, shift: 1.5},
  // 🏄 raft ride — knees bent, arms out wide for balance, a slow sway
  'mp.rf-mid':    {kneeL: 0.6, kneeR: 0.6, legL: 0.35, legR: -0.35, dy: 4, armR: 1.6, elbowR: 0.3, armL: 1.6, elbowL: 0.3, bend: 0.12, handR: 'open', handL: 'open'},
  'mp.rf-l':      {kneeL: 0.75, kneeR: 0.5, legL: 0.35, legR: -0.35, dy: 4, armR: 1.85, elbowR: 0.25, armL: 1.35, elbowL: 0.35, bend: 0.12, rot: -0.07, shift: -1.5, handR: 'open', handL: 'open'},
  'mp.rf-r':      {kneeL: 0.5, kneeR: 0.75, legL: 0.35, legR: -0.35, dy: 4, armR: 1.35, elbowR: 0.35, armL: 1.85, elbowL: 0.25, bend: 0.12, rot: 0.07, shift: 1.5, handR: 'open', handL: 'open'},
  // 🫠 wiggle slow (knee-deep) — a high slow knee, plant, the other; arms paddle for balance
  'mp.wg-r':      {legR: -1.1, kneeR: 1.6, legL: 0.05, kneeL: 0.2, armR: -0.4, elbowR: 0.6, armL: -0.8, elbowL: 0.6, bend: 0.0, dy: 1, rot: -0.02},
  'mp.wg-mid':    {legR: -0.3, kneeR: 0.4, legL: -0.15, kneeL: 0.35, armR: 0.3, elbowR: 0.4, armL: 0.3, elbowL: 0.4, bend: 0.05, dy: 2},
  'mp.wg-l':      {legL: 1.1, kneeL: 1.6, legR: -0.05, kneeR: 0.2, armR: 0.8, elbowR: 0.6, armL: 0.4, elbowL: 0.6, bend: 0.0, dy: 1, rot: 0.02},
  // 🪝 grapple — wind the hook arm back, throw up-forward, hang from the line · land: squash, a soot-puff bounce, stand
  'mp.gp-wind':   {armR: -1.1, elbowR: 1.1, armL: -0.9, elbowL: 0.6, bend: -0.1, kneeL: 0.35, kneeR: 0.3, legL: 0.3, legR: -0.08, dy: 3, twist: -0.25, handR: 'grip'},
  'mp.gp-throw':  {armR: 2.35, elbowR: 0.08, armL: 0.6, elbowL: 0.5, bend: 0.05, kneeL: 0.35, kneeR: 0.3, legL: 0.3, legR: -0.08, dy: 3, twist: 0.2, handR: 'open', nod: -0.12},
  'mp.gp-follow': {armR: 2.2, elbowR: 0.2, armL: 0.75, elbowL: 0.45, bend: 0.1, rot: 0.05, kneeL: 0.35, kneeR: 0.3, legL: 0.3, legR: -0.08, dy: 3, twist: 0.24, handR: 'open', nod: -0.1},
  'mp.gp-hang':   {armR: 2.9, elbowR: 0.15, armL: -2.9, elbowL: 0.25, legL: -0.35, legR: -0.4, kneeL: 0.5, kneeR: 0.4, dy: -16, rot: 0.08, handR: 'grip', handL: 'grip'},
  'mp.gp-swing':  {armR: 3.05, elbowR: 0.1, armL: -3.05, elbowL: 0.15, legL: 0.3, legR: 0.25, kneeL: 0.9, kneeR: 0.8, dy: -18, rot: -0.12, handR: 'grip', handL: 'grip'},
  'mp.gp-squash': {armR: 1.0, elbowR: 0.6, armL: 0.9, elbowL: 0.6, kneeL: 1.25, kneeR: 1.25, legL: 0.4, legR: -0.4, dy: 10, sy: 0.88, sx: 1.07, bend: 0.32},
  'mp.gp-bounce': {armR: 2.0, elbowR: 0.4, armL: 2.0, elbowL: 0.4, kneeL: 0.3, kneeR: 0.3, legL: 0.15, legR: -0.15, dy: -6, sy: 1.05, handR: 'open', handL: 'open'},
  // 😮‍💨 phew — sink to sit on the heat bar, wipe the brow, hands on the knees
  'mp.ph-sink':   {kneeL: 1.0, kneeR: 1.0, legL: 0.6, legR: -0.6, dy: 7, bend: 0.2, armR: 0.6, armL: 0.6},
  'mp.sit':       {legL: 1.45, legR: -1.45, kneeL: 0.35, kneeR: 0.35, dy: 17, bend: 0.12, armR: 0.5, elbowR: 0.5, armL: -0.5, elbowL: 0.5},   // on the floor, legs out
  'mp.ph-sit':    {legL: 1.55, legR: -1.55, kneeL: 1.5, kneeR: 1.5, dy: 11, bend: 0.06, armR: 0.5, elbowR: 0.5, armL: -0.5, elbowL: 0.5},   // on the heat bar (a low seat)
  'mp.ph-wipe':   {legL: 1.55, legR: -1.55, kneeL: 1.5, kneeR: 1.5, dy: 11, bend: -0.1, armR: 2.55, elbowR: 2.4, armL: -0.5, elbowL: 0.5, nod: -0.1, handR: 'open'},
  'mp.ph-rest':   {legL: 1.55, legR: -1.55, kneeL: 1.5, kneeR: 1.5, dy: 11, bend: 0.18, armR: 0.9, elbowR: 0.4, armL: -0.9, elbowL: 0.4, nod: 0.15, sy: 0.98, handR: 'open', handL: 'open'},
  // 🤲 offer a hand — a small step in, the near hand out, palm up · back = the hand comes home to the chest (it's OK)
  'mp.of-step':   {armR: 0.5, elbowR: 1.0, legL: 0.3, legR: -0.1, kneeL: 0.2, bend: 0.04, nod: 0.05},
  'mp.of-out':    {armR: 1.45, elbowR: 0.18, wristR: -0.3, armL: -0.25, elbowL: 0.35, legL: 0.35, legR: -0.1, kneeL: 0.25, kneeR: 0.05, bend: 0.1, shift: 1.5, handR: 'open', nod: 0.05},
  'mp.of-home':   {armR: 0.55, elbowR: 2.2, armL: 0.1, legL: 0.15, legR: -0.05, nod: 0.12, neckTilt: 0.12, handR: 'open'},
  // 👂 listen — lean in, cup the near hand behind the ear, head tilts
  'mp.ls-lean':   {armR: 2.3, elbowR: 2.45, bend: 0.12, neckTilt: -0.18, nod: 0.06, legL: 0.25, legR: -0.05, kneeL: 0.15, shift: 1, handR: 'open'},
  'mp.ls-in':     {armR: 2.4, elbowR: 2.5, bend: 0.16, neckTilt: -0.24, nod: 0.1, legL: 0.3, legR: -0.05, kneeL: 0.2, shift: 1.5, handR: 'open', neckTurn: -0.15},
  // 🎵 hum — eyes closed, a small sway side to side, the chest rises with the note
  'mp.hm-l':      {rot: -0.05, neckTilt: -0.14, armR: 0.25, armL: 0.25, shift: -0.8, nod: 0.05, sy: 1.01, legL: 0.08, legR: -0.08},
  'mp.hm-r':      {rot: 0.05, neckTilt: 0.14, armR: 0.25, armL: 0.25, shift: 0.8, nod: 0.05, sy: 1.01, legL: 0.08, legR: -0.08},
  'mp.hm-in':     {rot: 0, neckTilt: 0, armR: 0.3, armL: 0.3, nod: -0.08, sy: 1.03, shrugL: 0.25, shrugR: 0.25, legL: 0.08, legR: -0.08},
  // 🤲↔ pull apart — palms together at the chest, then push both hands out wide
  'mp.pa-in':     {armR: 0.85, elbowR: 1.75, armL: -0.85, elbowL: 1.75, handR: 'open', handL: 'open', kneeL: 0.3, kneeR: 0.3, legL: 0.2, legR: -0.2, dy: 2, shrugL: 0.3, shrugR: 0.3},
  'mp.pa-out':    {armR: 1.75, elbowR: 0.12, armL: 1.75, elbowL: 0.12, handR: 'open', handL: 'open', kneeL: 0.4, kneeR: 0.4, legL: 0.35, legR: -0.35, dy: 3, bend: -0.04},
  'mp.pa-hold':   {armR: 1.65, elbowR: 0.25, armL: 1.65, elbowL: 0.25, handR: 'open', handL: 'open', kneeL: 0.3, kneeR: 0.3, legL: 0.35, legR: -0.35, dy: 2},
  // 🫁💨 breathe out (one go) — in, then a long soft out leaning forward a little
  'mp.bo-out':    {kneeL: 0.2, kneeR: 0.2, armR: 0.2, armL: 0.2, bend: 0.16, nod: 0.12, sy: 0.97, shift: 0.5},
  // 🗡️ hold, no pull — both hands on the Rootblade low in front, knees soft, still
  'mp.hn-reach':  {armR: 0.9, elbowR: 0.5, armL: -0.9, elbowL: 0.5, bend: 0.25, kneeL: 0.45, kneeR: 0.45, legL: 0.3, legR: -0.1, dy: 3, handR: 'open', handL: 'open'},
  'mp.hn-grip':   {armR: 0.6, elbowR: 0.4, armL: -0.6, elbowL: 0.4, bend: 0.3, kneeL: 0.6, kneeR: 0.6, legL: 0.35, legR: -0.1, dy: 5, handR: 'grip', handL: 'grip', nod: 0.1},
  'mp.hn-calm':   {armR: 0.6, elbowR: 0.45, armL: -0.6, elbowL: 0.45, bend: 0.26, kneeL: 0.55, kneeR: 0.55, legL: 0.35, legR: -0.1, dy: 4.5, handR: 'grip', handL: 'grip', nod: 0.16, sy: 1.01},
  // 👋 wave · 🙇 bow · 🧘 still · 🍙 eat · ⛏️ dig — the old Room gestures as 3–5-beat acts (GESTURES stay as they are)
  'mp.wv-dip':    {armR: 0.6, elbowR: 0.8, shrugR: 0.3, kneeL: 0.12, kneeR: 0.12, dy: 1},
  'mp.wv-up':     {armR: 2.75, elbowR: 0.55, wristR: -0.25, handR: 'open', shrugR: 0.35, neckTilt: 0.08, legL: 0.08},
  'mp.wv-in':     {armR: 2.45, elbowR: 0.95, wristR: 0.35, handR: 'open', shrugR: 0.3, neckTilt: 0.12, legL: 0.08},
  'mp.bw-tall':   {armR: 0.1, armL: 0.1, nod: -0.08, sy: 1.02},
  'mp.bw-down':   {armR: 0.25, armL: 0.25, bend: 0.62, nod: 0.25, shift: -2, kneeL: 0.08, kneeR: 0.08},
  'mp.st-in':     {armR: 0.3, armL: 0.3, nod: -0.06, sy: 1.02, shrugL: 0.2, shrugR: 0.2},
  'mp.st-still':  {armR: 0.12, armL: 0.12, nod: 0.08, sy: 1.0, kneeL: 0.08, kneeR: 0.08, handR: 'open', handL: 'open'},
  'mp.ea-up':     {armR: 1.6, elbowR: 2.2, armL: 0.25, nod: -0.05, handR: 'grip'},
  'mp.ea-bite':   {armR: 1.4, elbowR: 2.55, armL: 0.25, nod: 0.08, bend: 0.06, handR: 'grip'},
  'mp.ea-chew':   {armR: 0.9, elbowR: 2.0, armL: 0.25, nod: -0.04, handR: 'grip', sy: 1.01},
  'mp.dg-up':     {armR: 2.2, elbowR: 0.9, armL: -2.0, elbowL: 0.9, handR: 'grip', handL: 'grip', bend: -0.1, kneeL: 0.45, kneeR: 0.45, legL: 0.35, legR: -0.15, dy: 2},
  'mp.dg-in':     {armR: 0.55, elbowR: 0.25, armL: -0.65, elbowL: 0.35, handR: 'grip', handL: 'grip', bend: 0.45, kneeL: 0.45, kneeR: 0.45, legL: 0.35, legR: -0.15, dy: 5},
  'mp.dg-scoop':  {armR: 1.1, elbowR: 0.5, armL: -1.0, elbowL: 0.6, handR: 'grip', handL: 'grip', bend: 0.18, kneeL: 0.45, kneeR: 0.45, legL: 0.35, legR: -0.15, dy: 3, twist: -0.15},
  'mp.dc-a':      {armR: 2.6, elbowR: 0.8, armL: 1.2, elbowL: 1.2, legL: 0.35, kneeL: 0.6, dy: -3, rot: -0.07, handR: 'open'},
  'mp.dc-b':      {armR: 1.2, elbowR: 1.2, armL: 2.6, elbowL: 0.8, legR: -0.35, kneeR: 0.6, dy: -3, rot: 0.07, handL: 'open'},
  'mp.dc-low':    {armR: 1.4, elbowR: 1.0, armL: 1.4, elbowL: 1.0, kneeL: 0.4, kneeR: 0.4, legL: 0.12, legR: -0.12, dy: 3},
}, marks: {
  // 👂 a small ear glyph beside the head with two sound arcs (the game fills its own meter) — shapes only (emoji lag rule)
  ear(g, hy, k, t){ const x = 17 * k, y = hy - 4 * k, p = 0.5 + 0.5 * Math.sin(t * 5); g.save(); g.lineCap = 'round'; g.fillStyle = '#FFD9B8'; g.strokeStyle = '#2B2D42'; g.lineWidth = 1.1 * k;
    g.beginPath(); g.ellipse(x, y, 3.2 * k, 4.6 * k, 0.15, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(x + 0.4 * k, y + 0.2 * k, 1.6 * k, -1.2, 1.6); g.stroke();
    g.strokeStyle = '#3A86FF'; [0, 1].forEach(i => { g.globalAlpha = 0.35 + 0.65 * (i ? p : 1 - p); g.lineWidth = 1.4 * k; g.beginPath(); g.arc(x - 1 * k, y, (7 + i * 3.5) * k, -0.7, 0.7); g.stroke(); }); g.restore(); },
}, acts: {
  // ——— 🏝️ Island 1 ———
  'motion.wai':       {tags: ['gesture', 'greet', 'thanks', 'calm', 'player'], share: true, weight: 'light', overlap: {nod: 60, bend: 30}, lead: 'hands → head (nod 60 ms) → hips back · counter: hips back · support: both feet', about: '🙏 Wai: palms together at the chest, a small bow, rise',
    beats: [{pose: 'idle', face: 'content', ms: 80}, {pose: 'mp.wai-up', face: 'content', ms: 260, ease: 'cubicOut'}, {pose: 'mp.wai-bow', face: 'grateful', ms: 140, contact: true, stop: 320, ease: 'sineInOut'},
      {pose: 'mp.wai-rise', face: 'happy', ms: 260}, {pose: 'idle', face: 'happy', ms: 220}]},
  'motion.coverEars': {tags: ['gesture', 'loud', 'fear', 'player'], share: true, weight: 'light', marks: ['shiver'], lead: 'shoulders (shrug) → hands → knees · support: both feet', about: '🙉 Cover ears: flinch, hands clap over the ears, peek',
    beats: [{pose: 'idle', face: 'shock', ms: 60}, {pose: 'mp.ears-flinch', face: 'shock', ms: 120}, {pose: 'mp.ears-on', face: 'oops', marks: ['shiver'], ms: 80, contact: true, stop: 260},
      {pose: 'mp.ears-peek', face: 'nervous', marks: ['shiver'], ms: 280}, {pose: 'mp.ears-on', face: 'oops', marks: ['shiver'], ms: 200}]},
  'motion.breathe':   {tags: ['gesture', 'breathe', 'calm', 'hold', 'player'], share: true, weight: 'light', hold: 'keep', lead: 'chest → arms float → head · support: planted feet', about: '🫁 Breathe (HOLD): plant the feet, breathe in, hold — the last pose stays while the button is held; then motion.breathe.out',
    beats: [{pose: 'idle', face: 'content', ms: 80}, {pose: 'mp.br-plant', face: 'content', ms: 260, ease: 'sineInOut'}, {pose: 'mp.br-in', face: 'relieved', ms: 900, contact: true, ease: 'sineInOut', tr: 900}]},
  'motion.breathe.out': {tags: ['gesture', 'breathe', 'calm', 'player'], share: true, weight: 'light', from: 'mp.br-in', lead: 'chest → arms → head', about: '🫁 Breathe out after the hold: arms float down, a soft sag, stand',
    beats: [{pose: 'mp.br-in', face: 'relieved', ms: 60}, {pose: Object.assign({}, {kneeL: 0.22, kneeR: 0.22, legL: 0.12, legR: -0.12, dy: 0.5, armR: 0.75, elbowR: 0.15, armL: 0.75, elbowL: 0.15, shrugL: 0.55, shrugR: 0.55, nod: -0.18, sy: 1.05, bend: -0.08, handR: 'open', handL: 'open'}), face: 'relieved', ms: 160, ease: 'sineOut'},
      {pose: 'mp.br-out', face: 'content', ms: 900, contact: true, tr: 900, ease: 'sineInOut'}, {pose: 'idle', face: 'happy', ms: 300}]},
  'motion.sit':       {tags: ['gesture', 'sit', 'rest', 'player'], share: true, weight: 'medium', balance: false, hold: 'keep', lead: 'hips → knees → arms · support: the floor', about: '🪑 Sit (beat act): look down, bend, sit, settle — holds sitting',
    beats: [{pose: 'idle', face: 'content', ms: 80}, {pose: 'mp.ph-sink', face: 'content', ms: 240, ease: 'sineInOut'}, {pose: 'mp.sit', face: 'content', ms: 120, contact: true, ease: 'quadIn'},
      {pose: Object.assign({}, {legL: 1.45, legR: -1.45, kneeL: 0.35, kneeR: 0.35, dy: 18, bend: 0.16, armR: 0.5, elbowR: 0.5, armL: -0.5, elbowL: 0.5, sy: 0.97}), face: 'happy', ms: 120}, {pose: 'mp.sit', face: 'happy', ms: 200}]},
  'motion.wave':      {tags: ['gesture', 'greet', 'hello', 'player'], share: true, weight: 'light', overlap: {wristR: 40}, lead: 'hand → wrist (40 ms) · counter: free arm still', about: '👋 Wave (beat act): a dip, hand up, wave in, down',
    beats: [{pose: 'idle', face: 'happy', ms: 60}, {pose: 'mp.wv-dip', face: 'happy', ms: 120}, {pose: 'mp.wv-up', face: 'joy', ms: 90, contact: true},
      {pose: 'mp.wv-in', face: 'joy', ms: 200}, {pose: 'mp.wv-up', face: 'happy', ms: 200}]},
  'motion.bow':       {tags: ['gesture', 'bow', 'thanks', 'player'], share: true, weight: 'medium', overlap: {nod: 60}, lead: 'hips → chest → head (nod 60 ms) · counter: hips back', about: '🙇 Bow (beat act): stand tall, bow from the hips (hips go back), hold, rise',
    beats: [{pose: 'idle', face: 'content', ms: 80}, {pose: 'mp.bw-tall', face: 'content', ms: 200}, {pose: 'mp.bw-down', face: 'grateful', ms: 240, contact: true, stop: 300, ease: 'sineInOut', tr: 240},
      {pose: 'mp.bw-tall', face: 'happy', ms: 260}, {pose: 'idle', face: 'happy', ms: 200}]},
  'motion.dance':     {tags: ['gesture', 'dance', 'happy', 'loop', 'player'], share: true, weight: 'light', loop: true, lead: 'hips (hop) → arms', about: '💃 Dance (beat loop): dip, one arm up + step, swap, dip — loops back to its start',
    beats: [{pose: 'mp.dc-low', face: 'joy', ms: 140}, {pose: 'mp.dc-a', face: 'joy', ms: 200}, {pose: 'mp.dc-low', face: 'joy', ms: 140, contact: true}, {pose: 'mp.dc-b', face: 'joy', ms: 200}, {pose: 'mp.dc-low', face: 'joy', ms: 140}]},
  'motion.still':     {tags: ['gesture', 'calm', 'still', 'hold', 'player'], share: true, weight: 'light', hold: 'keep', lead: 'chest → shoulders down', about: '🧘 Still (Reflecting Pool): breathe in, let the body go quiet, hold',
    beats: [{pose: 'idle', face: 'content', ms: 80}, {pose: 'mp.st-in', face: 'content', ms: 500, ease: 'sineInOut'}, {pose: 'mp.st-still', face: 'content', ms: 700, contact: true, tr: 700, ease: 'sineInOut'}]},
  // ——— 🏝️ Island 2 ———
  'motion.eat':       {tags: ['gesture', 'eat', 'happy', 'player'], share: true, weight: 'light', lead: 'hand → head', about: '🍙 Eat (beat act): food up, bite, chew happy, down',
    beats: [{pose: 'idle', face: 'happy', ms: 60}, {pose: 'mp.ea-up', face: 'delighted', ms: 200}, {pose: 'mp.ea-bite', face: 'excited', ms: 80, contact: true, stop: 80},
      {pose: 'mp.ea-chew', face: 'content', ms: 300}, {pose: 'idle', face: 'happy', ms: 200}]},
  'motion.glide':     {tags: ['move', 'glide', 'air', 'player'], share: true, weight: 'medium', balance: false, hold: 'keep', lead: 'legs push → arms up → body lifts', about: '🪁 Glide: crouch, jump to the bar, lift on the updraft, dangle — the game moves the body; the last pose holds',
    beats: [{pose: 'idle', face: 'excited', ms: 60}, {pose: 'mp.gl-crouch', face: 'determined', ms: 200}, {pose: 'mp.gl-open', face: 'excited', ms: 100, contact: true},
      {pose: 'mp.gl-lift', face: 'delighted', ms: 300}, {pose: 'mp.gl-dangle', face: 'happy', ms: 300}]},
  'motion.glide.land': {tags: ['move', 'glide', 'land', 'funny', 'player'], share: true, weight: 'medium', balance: false, lead: 'feet → knees squash → body flops', about: '🪁 Glide land + 😄 the hay flop: legs reach, squash, flop back into the hay',
    beats: [{pose: 'mp.gl-dangle', face: 'happy', ms: 60}, {pose: 'mp.gl-reach', face: 'focused', ms: 160}, {pose: 'mp.gl-squash', face: 'oops', ms: 70, contact: true, stop: 60},
      {pose: 'mp.gl-flop', face: 'silly', ms: 300, ease: 'quadIn'}, {pose: 'mp.gl-flop', face: 'giggle', ms: 300}]},
  'motion.dawnDance': {tags: ['gesture', 'dance', 'festival', 'funny', 'loop', 'player'], share: true, weight: 'light', loop: true, lead: 'hop leg → arm up → head', about: '🌅 Dawn dance (silly festival dance, loops): low, step-hop arm up, low, swap',
    beats: [{pose: 'mp.dd-low', face: 'silly', ms: 150}, {pose: 'mp.dd-a', face: 'joy', ms: 220, ease: 'backOut'}, {pose: 'mp.dd-low', face: 'silly', ms: 150, contact: true}, {pose: 'mp.dd-b', face: 'joy', ms: 220, ease: 'backOut'}, {pose: 'mp.dd-low', face: 'silly', ms: 150}]},
  'motion.drum.don':  {tags: ['gesture', 'drum', 'beat', 'player'], share: true, card: 'twoHand', weight: 'medium', overlap: {bend: 45, nod: 60, dy: 90}, lead: 'both hands → elbows (30 ms) → knees dip · card 🆕 twoHand', about: '🥁 don (middle of the skin): both sticks up, strike down, bounce back',
    beats: [{pose: 'mp.dr-ready', face: 'focused', ms: 60}, {pose: 'mp.dr-up', face: 'determined', ms: 200, ease: 'cubicOut'}, {pose: 'mp.dr-don', face: 'determined', ms: 70, contact: true, stop: 40},
      {pose: 'mp.dr-ready', face: 'happy', ms: 160}, {pose: 'mp.dr-ready', face: 'focused', ms: 100}]},
  'motion.drum.ka':   {tags: ['gesture', 'drum', 'beat', 'player'], share: true, weight: 'light', lead: 'hand → chest twist', about: '🥁 ka (the rim): a small lift, a light side tap',
    beats: [{pose: 'mp.dr-ready', face: 'focused', ms: 40}, {pose: 'mp.dr-kaup', face: 'focused', ms: 100}, {pose: 'mp.dr-ka', face: 'happy', ms: 50, contact: true}, {pose: 'mp.dr-ready', face: 'focused', ms: 120}]},
  'motion.mirrorAim': {tags: ['gesture', 'aim', 'puzzle', 'hold', 'player'], share: true, weight: 'light', hold: 'keep', overlap: {wristR: 40, wristL: 40}, lead: 'hands → wrists (40 ms)', about: '🪞 Mirror aim: lift the mirror in both hands, tilt it to aim the light — holds',
    beats: [{pose: 'mp.mi-hold', face: 'curious', ms: 80}, {pose: 'mp.mi-up', face: 'focused', ms: 240}, {pose: 'mp.mi-aim', face: 'focused', ms: 120, contact: true, stop: 120}, {pose: 'mp.mi-aim', face: 'determined', ms: 200}]},
  // ——— 🏝️ Island 3 ———
  'motion.shiver':    {tags: ['gesture', 'cold', 'shiver', 'loop', 'player'], share: true, weight: 'light', loop: true, marks: ['shiver'], lead: 'shoulders → hands', about: '🥶 Shiver (loops): hug yourself, shoulders up, small fast shakes',
    beats: [{pose: 'mp.sh-hug', face: 'nervous', marks: ['shiver'], ms: 120}, {pose: 'mp.sh-l', face: 'nervous', marks: ['shiver'], ms: 70}, {pose: 'mp.sh-r', face: 'worried', marks: ['shiver'], ms: 70, contact: true}, {pose: 'mp.sh-l', face: 'nervous', marks: ['shiver'], ms: 70}, {pose: 'mp.sh-hug', face: 'nervous', marks: ['shiver'], ms: 120}]},
  'motion.warmHands': {tags: ['gesture', 'warm', 'fire', 'calm', 'hold', 'player'], share: true, weight: 'light', hold: 'keep', lead: 'hands out → lean in', about: '🔥 Warm hands: rub, then hands OUT to the fire, palms open (never in) — holds, a small rub-wiggle',
    beats: [{pose: 'idle', face: 'nervous', marks: ['steam'], ms: 60}, {pose: 'mp.wh-rub', face: 'nervous', marks: ['steam'], ms: 260}, {pose: 'mp.wh-out', face: 'relieved', marks: ['steam'], ms: 220, contact: true, ease: 'sineInOut', tr: 220},
      {pose: 'mp.wh-out2', face: 'content', marks: ['steam'], ms: 400, ease: 'sineInOut'}, {pose: 'mp.wh-out', face: 'content', marks: ['steam'], ms: 400, ease: 'sineInOut'}]},
  'motion.raftRide':  {tags: ['move', 'ride', 'balance', 'loop', 'player'], share: true, weight: 'medium', loop: true, lead: 'hips sway → arms counter', about: '🏄 Raft ride (loops): knees bent, arms wide, a slow sway',
    beats: [{pose: 'mp.rf-mid', face: 'excited', ms: 300, ease: 'sineInOut'}, {pose: 'mp.rf-l', face: 'excited', ms: 400, ease: 'sineInOut'}, {pose: 'mp.rf-mid', face: 'delighted', ms: 300, contact: true, ease: 'sineInOut', tr: 300},
      {pose: 'mp.rf-r', face: 'excited', ms: 400, ease: 'sineInOut'}, {pose: 'mp.rf-mid', face: 'excited', ms: 300, ease: 'sineInOut'}]},
  'motion.wiggleSlow': {tags: ['move', 'wade', 'water', 'loop', 'player'], share: true, weight: 'heavy', loop: true, lead: 'knee → foot → arms paddle', about: '🫠 Wiggle slow (knee-deep, loops): a high slow knee, plant, the other',
    beats: [{pose: 'mp.wg-mid', face: 'silly', ms: 220, ease: 'sineInOut'}, {pose: 'mp.wg-r', face: 'effort', ms: 380, ease: 'sineInOut'}, {pose: 'mp.wg-mid', face: 'determined', ms: 220, contact: true, ease: 'sineInOut', tr: 220},
      {pose: 'mp.wg-l', face: 'effort', ms: 380, ease: 'sineInOut'}, {pose: 'mp.wg-mid', face: 'effort', ms: 220, ease: 'sineInOut'}]},
  'motion.dig':       {tags: ['gesture', 'dig', 'work', 'player'], share: true, card: 'twoHand', weight: 'medium', overlap: {bend: 45, dy: 90}, lead: 'both hands → bend (30 ms) → knees · card 🆕 twoHand', about: '⛏️ Dig (beat act): spade up, drive it in, scoop, settle',
    beats: [{pose: 'idle', face: 'determined', ms: 60}, {pose: 'mp.dg-up', face: 'determined', ms: 260}, {pose: 'mp.dg-in', face: 'effort', ms: 90, contact: true, stop: 60},
      {pose: 'mp.dg-scoop', face: 'happy', ms: 260}, {pose: 'idle', face: 'happy', ms: 200}]},
  // ——— 🏝️ Island 5 ———
  'motion.grapple':   {tags: ['move', 'grapple', 'throw', 'player'], share: true, card: 'throw', weight: 'medium', overlap: {twist: 30, bend: 30, nod: 60, rot: 75}, lead: 'hand → chest (30 ms) → hips lean in (75 ms) · counter: the free arm swings back · support: front foot', about: '🪝 Grapple throw: wind the hook back, throw up and out (contact = the hook flies), follow through — feet stay down; when the hook catches play motion.grapple.swing',
    beats: [{pose: 'idle', face: 'determined', ms: 60}, {pose: 'mp.gp-wind', face: 'determined', ms: 240}, {pose: 'mp.gp-throw', face: 'determined', ms: 80, contact: true},
      {pose: 'mp.gp-follow', face: 'excited', ms: 220}, {pose: 'mp.gp-follow', face: 'excited', ms: 160}]},
  'motion.grapple.swing': {tags: ['move', 'grapple', 'air', 'hold', 'player'], share: true, weight: 'medium', balance: false, hold: 'keep', overlap: {legL: 60, legR: 60, kneeL: 90, kneeR: 90}, lead: 'arms take the pull → body lifts → legs swing last', about: '🪝 Grapple swing (the hook caught): pulled up, hang, swing — the game moves the body along the line; the last pose holds, then motion.grapple.land',
    beats: [{pose: 'mp.gp-follow', face: 'excited', ms: 60}, {pose: 'mp.gp-hang', face: 'excited', ms: 200}, {pose: 'mp.gp-swing', face: 'delighted', ms: 260, contact: true, ease: 'sineInOut', tr: 260},
      {pose: 'mp.gp-hang', face: 'excited', ms: 300, ease: 'sineInOut'}, {pose: 'mp.gp-swing', face: 'delighted', ms: 300, ease: 'sineInOut'}]},
  'motion.grapple.land': {tags: ['move', 'grapple', 'land', 'player'], share: true, weight: 'medium', balance: false, lead: 'feet → knees → arms up', about: '🪝 Grapple land: squash, a soot-puff bounce, stand (the game adds Motion.fx(\'puff\') at contact)',
    beats: [{pose: 'mp.gp-swing', face: 'focused', ms: 60}, {pose: 'mp.gl-reach', face: 'focused', ms: 140}, {pose: 'mp.gp-squash', face: 'oops', ms: 70, contact: true, stop: 50},
      {pose: 'mp.gp-bounce', face: 'joy', ms: 220, ease: 'backOut'}, {pose: 'idle', face: 'happy', ms: 220}]},
  'motion.phew':      {tags: ['gesture', 'rest', 'hot', 'relief', 'player'], share: true, weight: 'medium', balance: false, hold: 'keep', marks: ['sweat'], lead: 'hips → knees → hand wipes', about: '😮‍💨 Phew (heat-bar sit): sink, sit, wipe the brow, rest — holds sitting',
    beats: [{pose: 'idle', face: 'tired', ms: 60}, {pose: 'mp.ph-sink', face: 'tired', ms: 240}, {pose: 'mp.ph-sit', face: 'tired', marks: ['sweat'], ms: 110, contact: true, ease: 'quadIn'},
      {pose: 'mp.ph-wipe', face: 'relieved', marks: ['sweat'], ms: 380}, {pose: 'mp.ph-rest', face: 'relieved', marks: ['sweat'], ms: 300}]},
  'motion.offerHand': {tags: ['gesture', 'help', 'kind', 'hold', 'player'], share: true, weight: 'light', hold: 'keep', overlap: {elbowR: 40, wristR: 60}, lead: 'hand → elbow (40) → wrist (60) → step', about: '🤲 Offer a hand: a small step in, the hand out palm up — holds while the partner decides',
    beats: [{pose: 'idle', face: 'hopeful', ms: 60}, {pose: 'mp.of-step', face: 'hopeful', ms: 220}, {pose: 'mp.of-out', face: 'hopeful', ms: 200, contact: true, ease: 'sineInOut', tr: 200}, {pose: 'mp.of-out', face: 'content', ms: 300}]},
  'motion.offerHand.back': {tags: ['gesture', 'help', 'kind', 'calm', 'player'], share: true, weight: 'light', lead: 'hand home → head nod', about: '🤲 "Not yet" is OK: the hand comes home to the chest, a small nod, a smile',
    beats: [{pose: 'mp.of-out', face: 'content', ms: 60}, {pose: Object.assign({}, {armR: 1.35, elbowR: 0.35, wristR: 0.1, armL: -0.2, elbowL: 0.3, legL: 0.3, legR: -0.1, kneeL: 0.2, bend: 0.06, nod: 0.2, handR: 'open'}), face: 'content', ms: 200},
      {pose: 'mp.of-home', face: 'content', ms: 300, contact: true, tr: 300, ease: 'sineInOut'}, {pose: 'idle', face: 'happy', ms: 300, ease: 'sineOut'}]},
  'motion.listen':    {tags: ['gesture', 'listen', 'calm', 'hold', 'player'], share: true, weight: 'light', hold: 'keep', marks: ['ear'], lead: 'head tilt → hand to ear → lean', about: '👂 Listen: lean in, cup the ear, head tilts — holds (the ear mark fills in the game)',
    beats: [{pose: 'idle', face: 'curious', ms: 60}, {pose: 'mp.ls-lean', face: 'curious', marks: ['ear'], ms: 280}, {pose: 'mp.ls-in', face: 'focused', marks: ['ear'], ms: 300, contact: true, ease: 'sineInOut', tr: 300}]},
  'motion.hum':       {tags: ['gesture', 'hum', 'music', 'calm', 'loop', 'player'], share: true, weight: 'light', loop: true, marks: ['notes'], lead: 'chest → sway → head', about: '🎵 Hum (loops): eyes closed, a small sway, the chest lifts with the note',
    beats: [{pose: 'mp.hm-in', face: 'content', marks: ['notes'], ms: 300, ease: 'sineInOut'}, {pose: 'mp.hm-l', face: 'content', marks: ['notes'], ms: 420, ease: 'sineInOut'}, {pose: 'mp.hm-in', face: 'content', marks: ['notes'], ms: 300, contact: true, ease: 'sineInOut', tr: 300},
      {pose: 'mp.hm-r', face: 'content', marks: ['notes'], ms: 420, ease: 'sineInOut'}, {pose: 'mp.hm-in', face: 'content', marks: ['notes'], ms: 300, ease: 'sineInOut'}]},
  'motion.pullApart': {tags: ['gesture', 'push', 'magic', 'player'], share: true, weight: 'medium', overlap: {elbowR: 40, elbowL: 40}, lead: 'both hands → elbows (40 ms) → knees', about: '🤲↔ Pull apart: palms together at the chest, push both hands out wide, hold',
    beats: [{pose: 'idle', face: 'focused', ms: 60}, {pose: 'mp.pa-in', face: 'focused', ms: 260}, {pose: 'mp.pa-out', face: 'determined', ms: 110, contact: true, stop: 120},
      {pose: 'mp.pa-hold', face: 'determined', ms: 300}, {pose: 'idle', face: 'happy', ms: 240}]},
  'motion.breatheOut': {tags: ['gesture', 'breathe', 'calm', 'player'], share: true, weight: 'light', lead: 'chest → arms → head', about: '🫁💨 Breathe out (with Pudding at the vent): breathe in, then a long soft out, leaning in a little',
    beats: [{pose: 'idle', face: 'content', ms: 60}, {pose: 'mp.br-in', face: 'relieved', ms: 600, ease: 'sineInOut'}, {pose: 'mp.bo-out', face: 'content', ms: 900, contact: true, tr: 900, ease: 'sineInOut'},
      {pose: 'idle', face: 'happy', ms: 300}]},
  'motion.holdNoPull': {tags: ['gesture', 'hold', 'calm', 'sword', 'player'], share: true, weight: 'medium', hold: 'keep', lead: 'hands → knees soft → still', about: '🗡️ Hold, no pull: both hands on the Rootblade low in front, knees soft, still — holds (never a tug)',
    beats: [{pose: 'idle', face: 'content', ms: 60}, {pose: 'mp.hn-reach', face: 'focused', ms: 300}, {pose: 'mp.hn-grip', face: 'content', ms: 160, contact: true, stop: 120}, {pose: 'mp.hn-calm', face: 'content', ms: 600, ease: 'sineInOut'}]},
}}, {by: '🎬 Motion chat', block: 'motion', game: '', date: '2026-11-27', file: 'MotionActs'});

if (M && Acting.T) {
  const A = Acting.T.acts, KEYS = Object.keys(A).filter(k => /^motion\.(wai|coverEars|breathe|sit|wave|bow|dance|still|eat|glide|dawnDance|drum|mirrorAim|shiver|warmHands|raftRide|wiggleSlow|dig|grapple|phew|offerHand|listen|hum|pullApart|breatheOut|holdNoPull)\b/.test(k));
  const PAIRS = {'motion.breathe': 'motion.breathe.out', 'motion.glide': 'motion.glide.land', 'motion.grapple': 'motion.grapple.swing', 'motion.grapple.swing': 'motion.grapple.land', 'motion.offerHand': 'motion.offerHand.back'};
  M.ACTS = {VERSION: 'mo-24', keys: KEYS, pairs: PAIRS, holds: KEYS.filter(k => A[k].hold === 'keep'), loops: KEYS.filter(k => A[k].loop)};
  if (M.needDef) M.needDef('acts', {has: () => !!M.ACTS});
}
})();
