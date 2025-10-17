window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  configurationProperties: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d4475fuRDhNSK9WgAd08LiX", "configurationProperties");
    "use strict";
    window.configurationProperties = [ {
      key: "generalConfiguration",
      type: 1
    }, {
      key: "gameAttributes",
      type: 1
    }, {
      key: "reelAttributes",
      type: 1
    }, {
      key: "reelRandomizerAttributes",
      type: 1
    }, {
      key: "audioDuckerProperty",
      type: 1
    }, {
      key: "dynamicConfiguration",
      type: 1
    }, {
      key: "layoutScreenChangeAttributes",
      type: 1
    }, {
      key: "deferredConfiguration",
      type: 1
    } ];
    cc._RF.pop();
  }, {} ],
  debugConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cad4eeJCjdIF7nYn4ImEx+E", "debugConfig");
    "use strict";
    cc._RF.pop();
  }, {} ],
  preloadConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "732b2J5l5NIyJRqGbgoxepx", "preloadConfig");
    "use strict";
    window.preloadConfig = {
      screenOrientation: 1
    };
    cc._RF.pop();
  }, {} ],
  resourcesAttributes: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fca4ajPyLtD3IcJi7qZZx8s", "resourcesAttributes");
    "use strict";
    window.resourcesURL = {
      locationOfResources: "PBG",
      loadAllLanguage: false
    };
    window.resourceAttributes = {
      sharedResourceKeys: [ "popup-atlas", "popup-atlas-png", "ingameui_vertical", "ingameui_vertical-png", "ingameui_horizontal", "ingameui_horizontal-png", "Prebuild_Button_GenClick", "Prebuild_Scroll_Button_SFX", "Prebuild_Start_Button", "Prebuild_Panel_Coin_Loop", "Prebuild_Total_Win_Panel_SFX", "Prebuild_Win_Panel_SFX_lvl_1", "Prebuild_Win_Panel_SFX_lvl_2", "calibri", "calibrib", "Helvetica Rounded Bold", "history-png", "history", "ingamesui-png", "ingamesui", "All_win-atlas", "All_win-json", "All_win-png", "All_win_effect-atlas", "All_win_effect-json", "All_win_effect-png", "better_luck-atlas", "better_luck-json", "better_luck-png", "you_won-atlas", "you_won-json", "you_won-png", "you_won_effect-atlas", "you_won_effect-json", "you_won_effect-png", "BigText_BigWin", "BigText_MegaWin", "BigText_UltraWin", "BigText_BetterLuck", "BigText_BonusGame", "BigText_FreeGame", "BigText_Retrigger", "BigText_YouWon", "BigText_CoinCounter", "BigText_CoinCounter_Finish", "STD_button_AutoSpin_Off", "STD_button_AutoSpin_On", "STD_button_GenClick", "STD_button_QuickSpin_OnOff", "STD_Button_Spin", "STD_Button_Stop", "STD_button_TotalBet_Down", "STD_button_TotalBet_Up", "STD_CoinCounter" ],
      languageResourceKeys: [ "locale-en-us", "locale-zh-cn", "locale-th-th", "locale-vi-vn", "locale-my-mm", "locale-km-kh", "locale-ml-my", "locale-id-id", "locale-fil-ph", "locale-bn-bl", "locale-ne-ne", "locale-hi-in", "locale-ko-kr", "locale-lo-la", "locale-ur-pk", "locale-ar-sa", "locale-ca-es", "locale-zh-tw", "locale-zh-hk", "locale-hr-hr", "locale-cs-cz", "locale-da-dk", "locale-nl-nl", "locale-en-gb", "locale-en-au", "locale-en-ca", "locale-en-in", "locale-en-ie", "locale-en-sg", "locale-en-za", "locale-en-nz", "locale-fi-fl", "locale-en-gb", "locale-fr-fr", "locale-fr-ca", "locale-de-de", "locale-el-gr", "locale-he-il", "locale-hu-hu", "locale-it-it", "locale-ja-jp", "locale-nb-no", "locale-pl-pl", "locale-pt-pt", "locale-pt-br", "locale-ro-ro", "locale-ru-ru", "locale-sk-sk", "locale-es-es", "locale-es-la", "locale-es-mx", "locale-sv-se", "locale-tr-tr", "locale-uk-ua", "locale-mt-mt", "locale-ga-ie", "locale-si-sl" ]
    };
    cc._RF.pop();
  }, {} ]
}, {}, [ "configurationProperties", "debugConfig", "preloadConfig", "resourcesAttributes" ]);