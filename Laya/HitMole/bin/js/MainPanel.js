var MainPanel = /** @class */ (function () {
    //各个洞口的地鼠xy坐标
    //  private moletPos:Array<Array<number>> = [[167,198],[353,197],[551,204],[139,289],[354,290],[555,288],[131,385],[355,392],[575,393]];
    function MainPanel() {
        this.moleNum = 9;
        this._view = fairygui.UIPackage.createObject("hitMole", "back").asCom;
        this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        //进度条
        this._progressBar = this._view.getChild("progressBar").asProgress;
        //处理事件
        var hitCallBack = Laya.Handler.create(this, this.setScore, null, false);
        //设置各个洞口的地鼠
        this.moles = new Array();
        for (var i = 0; i < this.moleNum; i++) {
            this._coms = this._view.getChild("Mole" + i).asCom;
            var mole = new Mole(this._coms.getChild("normal").asLoader, this._coms.getChild("hit").asLoader, 24, hitCallBack, this._coms.getChild("score1").asLoader);
            this.moles.push(mole);
        }
        this.hammer = new Hammer(this._view);
        this.hammer.addView();
    }
    MainPanel.prototype.onLoop = function () {
        this._progressBar.value -= 5;
        if (this._progressBar.value <= 0) {
            this.gameOver();
            return;
        }
        var index = Math.floor(Math.random() * this.moleNum);
        this.moles[index].show();
    };
    MainPanel.prototype.addView = function () {
        fairygui.GRoot.inst.addChild(this._view);
    };
    //开始游戏
    MainPanel.prototype.startGame = function () {
        this._progressBar.value = 100;
        this.score = 0;
        this.updateScoreUI();
        this.hammer.start();
        //定时器
        Laya.timer.loop(1000, this, this.onLoop);
    };
    //游戏结束
    MainPanel.prototype.gameOver = function () {
        Laya.timer.clear(this, this.onLoop);
        this.hammer.end();
        if (!GameMain.gameOver) {
            GameMain.gameOver = new GameOver();
        }
        GameMain.gameOver.addView();
        GameMain.gameOver.setScoreUI(this.score);
        console.log("游戏结束");
    };
    //得分
    MainPanel.prototype.setScore = function (type) {
        this.score += (type == 1 ? 100 : -100);
        if (this.score < 0)
            this.score = 0;
        this.updateScoreUI();
    };
    //刷新总分
    MainPanel.prototype.updateScoreUI = function () {
        this._view.getChild("score").text = "" + this.score;
    };
    return MainPanel;
}());
//# sourceMappingURL=MainPanel.js.map