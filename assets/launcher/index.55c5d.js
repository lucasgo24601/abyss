System.register("chunks:///_virtual/launcher",["./Launcher.ts"],(function(){return{setters:[null],execute:function(){}}}));

System.register("chunks:///_virtual/Launcher.ts",["./rollupPluginModLoBabelHelpers.js","cc","./BaseLauncher.ts","./AutoPanel.ts","./BetPanel.ts","./BigWinPanel.ts","./EnterFreeGame.ts","./HistoryDetailPanel.ts","./HistoryPanel.ts","./MenuPanel.ts","./RulePanel.ts","./TotalWinPanel.ts","./WalletPanel.ts","./SlotBetManager.ts","./DeviceUtil.ts","./BuyFreaturePanel.ts","./GameConfig.ts"],(function(e){var n,a,t,i,r,l,o,s,u,c,p,f,m,y,h,P,g,L,b,d,z,v;return{setters:[function(e){n=e.inheritsLoose,a=e.asyncToGenerator,t=e.regeneratorRuntime},function(e){i=e.cclegacy,r=e._decorator,l=e.screen,o=e.assetManager},function(e){s=e.BaseLauncher},function(e){u=e.AutoPanel},function(e){c=e.BetPanel},function(e){p=e.BigWinPanel},function(e){f=e.EnterFreeGame},function(e){m=e.HistoryDetailPanel},function(e){y=e.HistoryPanel},function(e){h=e.MenuPanel},function(e){P=e.RulePanel},function(e){g=e.TotalWinPanel},function(e){L=e.WalletPanel},function(e){b=e.SlotBetManager},function(e){d=e.DeviceUtil},function(e){z=e.BuyFeaturePanel},function(e){v=e.GameConfig}],execute:function(){var B;i._RF.push({},"4d774adP0RNZ6kdG3avfTiU","Launcher",void 0);var F=r.ccclass;e("Launcher",F(B=function(e){function i(){for(var n,a=arguments.length,t=new Array(a),i=0;i<a;i++)t[i]=arguments[i];return(n=e.call.apply(e,[this].concat(t))||this).firstFolderNames=["animation","font","prefab","script","texture","shader"],n.secondFolderNames=["sound"],n}n(i,e);var r=i.prototype;return r.callback=function(){window.aaac.onScreenSizeChanged()},r.onLoad=function(){var n=a(t().mark((function n(){return t().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.prototype.onLoad.call(this);case 2:d.isPWA()?(console.log("yes"),l.requestFullScreen()):console.log("no");case 3:case"end":return n.stop()}}),n,this)})));return function(){return n.apply(this,arguments)}}(),r.initialize=function(e){b.initialize(v.AUTO_SPIN,e.gameInfo)},r.initializeLayer=function(){e.prototype.initializeLayer.call(this),u.initialize(this.panelLayer,"common","prefab/panel/auto/autoPanel"),c.initialize(this.panelLayer,"common","prefab/panel/bet/betPanel"),y.initialize(this.panelLayer,"common","prefab/panel/history/historyPanel"),m.initialize(this.panelLayer,"common","prefab/panel/history/historyDetailPanel"),h.initialize(this.panelLayer,"common","prefab/panel/menu/menuPanel"),L.initialize(this.panelLayer,"common","prefab/panel/wallet/walletPanel"),P.initialize(this.panelLayer,"game","prefab/panel/rulePanel"),z.initialize(this.panelLayer,"game","prefab/panel/buyFeaturePanel"),f.initialize(this.panelLayer,"game","prefab/panel/enterFreeGame"),p.initialize(this.panelLayer,"game","prefab/panel/bigWinPanel"),g.initialize(this.panelLayer,"game","prefab/panel/totalWinPanel")},r.customLoading=function(){var e=a(t().mark((function e(){return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e){o.getBundle("game").loadDir("texture/components/symbol",(function(n,a){e()}))})));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),i}(s))||B);i._RF.pop()}}}));

(function(r) {
  r('virtual:///prerequisite-imports/launcher', 'chunks:///_virtual/launcher'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});