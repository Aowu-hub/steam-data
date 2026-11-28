
const CURRENT_PLAYER = SP_TV[0]; window.SP_PAGE = SP_TV[1];
const GAME_ID = 'avateer';
UI.applyTheme(UI.cachedTheme(CURRENT_PLAYER), {kitOnly: true});
if(UI.KINDS && !UI.KINDS.avateer) UI.KINDS.avateer = ['🧳', 'Packing your bag', 'bob'];   // 🧳 runtime until the UiKit lane moves it in (Open questions)
if(UI.GAME_HELP && !UI.GAME_HELP.avateer) UI.GAME_HELP.avateer = ['🧳 Travel the floating islands with your own avatar and Pudding the baby elephant.', 'Walk with 👆 tap or the 🕹️ stick, 🦘 jump, 🎭 emote, talk to people with a mark over their head.', 'Lost? The 📖 card at the top says what to do next.'];
UI.navBar(document.getElementById('back-btn'), {});
