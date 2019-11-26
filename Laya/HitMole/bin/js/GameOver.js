var GameOver = /** @class */ (function () {
    function GameOver() {
        this._view = fairygui.UIPackage.createObject("hitMole", "GameOver").asCom;
        this._view.getChild("restartBtn").on(Laya.Event.CLICK, this, this.restartGame);
        this._view.setXY(140, 168);
    }
    GameOver.prototype.addView = function () {
        fairygui.GRoot.inst.addChild(this._view);
    };
    GameOver.prototype.restartGame = function () {
        fairygui.GRoot.inst.removeChildren();
        GameMain.gameStart.addView();
    };
    GameOver.prototype.setScoreUI = function (score) {
        this._view.getChild("score").text = "" + score;
    };
    return GameOver;
}());
//# sourceMappingURL=GameOver.js.map