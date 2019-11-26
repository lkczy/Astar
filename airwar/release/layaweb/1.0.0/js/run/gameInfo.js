var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameInfo = (function (_super) {
    __extends(GameInfo, _super);
    function GameInfo() {
        var _this = _super.call(this) || this;
        _this.pauseBtn.on(Laya.Event.CLICK, _this, _this.onPause);
        _this.reset();
        return _this;
    }
    GameInfo.prototype.reset = function () {
        this.infoLabel.text = "";
        this.hp(5);
        this.level(0);
        this.score(0);
    };
    GameInfo.prototype.onPause = function (e) {
        e.stopPropagation();
        this.infoLabel.text = "游戏暂停, 点击开始";
        gameObj.resume();
    };
    //显示血量
    GameInfo.prototype.hp = function (value) {
        this.hpLabel.text = "HP:" + value;
    };
    //显示关卡级别
    GameInfo.prototype.level = function (value) {
        this.levelLabel.text = "Level:" + value;
    };
    //显示积分
    GameInfo.prototype.score = function (value) {
        this.scoreLabel.text = "Score:" + value;
    };
    return GameInfo;
}(ui.GameInfoUI));
//# sourceMappingURL=gameInfo.js.map