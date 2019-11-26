var GameStart = /** @class */ (function () {
    function GameStart() {
        this._view = fairygui.UIPackage.createObject("hitMole", "GameStart").asCom;
        this._view.getChild("startBtn").asButton.on(Laya.Event.CLICK, this, this.startGame);
    }
    //加载界面
    GameStart.prototype.addView = function () {
        fairygui.GRoot.inst.addChild(this._view);
    };
    //开始游戏
    GameStart.prototype.startGame = function () {
        fairygui.GRoot.inst.removeChildren();
        if (!GameMain.mainPanel) {
            GameMain.mainPanel = new MainPanel();
        }
        GameMain.mainPanel.addView();
        GameMain.mainPanel.startGame();
    };
    return GameStart;
}());
//# sourceMappingURL=GameStart.js.map