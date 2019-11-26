var Loader = laya.net.Loader;
var Handler = laya.utils.Handler;
// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        Laya.init(800, 600, Laya.WebGL);
        laya.utils.Stat.show(0, 0);
        //设置适配模式
        Laya.stage.scaleMode = "showall";
        Laya.stage.alignH = "center";
        Laya.stage.alignV = "center";
        //设置横竖屏
        Laya.stage.screenMode = "horizontal";
        Laya.loader.load([{ url: "res/hitMole@atlas0.png", type: Loader.IMAGE },
            { url: "res/hitMole.fui", type: Loader.BUFFER }
        ], Handler.create(this, this.onLoaded));
    }
    GameMain.prototype.onLoaded = function () {
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        fairygui.UIPackage.addPackage("res/hitMole");
        GameMain.gameStart = new GameStart();
        GameMain.gameStart.addView();
    };
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=GameMain.js.map