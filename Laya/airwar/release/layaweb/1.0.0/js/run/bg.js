var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bg = (function (_super) {
    __extends(Bg, _super);
    function Bg() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Bg.prototype.init = function () {
        //  this.box = new Laya.Sprite();
        this.bg1 = new Laya.Sprite();
        this.bg1.loadImage("res/background.png");
        this.bg2 = new Laya.Sprite();
        this.bg2.loadImage("res/background.png");
        this.bg2.pos(0, -852);
        this.addChild(this.bg1);
        this.addChild(this.bg2);
        Laya.timer.frameLoop(1, this, this.onLoop);
    };
    Bg.prototype.onLoop = function () {
        this.y += 1;
        if (this.bg1.y + this.y >= 852) {
            this.bg1.y -= 852 * 2;
        }
        if (this.bg2.y + this.y >= 852) {
            this.bg2.y -= 852 * 2;
        }
    };
    return Bg;
}(Laya.Sprite));
//# sourceMappingURL=bg.js.map