var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Role = (function (_super) {
    __extends(Role, _super);
    function Role() {
        var _this = _super.call(this) || this;
        // 射击类型
        _this.shootType = 0;
        // 射击间隔
        _this.shootInterval = 500;
        // 下次射击时间
        _this.shootTime = Laya.Browser.now() + 2000;
        /**0：普通，1：子弹，2：弹药，3：补给品 */
        _this.heroType = 0;
        return _this;
        // this.init();
    }
    Role.prototype.init = function (type, camp, hp, speed, hitRadius, heroType) {
        //初始化角色属性
        this.type = type;
        this.camp = camp;
        this.hp = hp;
        this.speed = speed;
        this.hitRadius = hitRadius;
        this.heroType = heroType;
        // 创建动画模板 缓存公共动画模板 减少对象创建开销
        if (!Role.cached) {
            Role.cached = true;
            //缓存动画模板： hero_fly
            Laya.Animation.createFrames(["war/hero_fly1.png", "war/hero_fly2.png"], Role.HERO_FLY);
            //缓存动画模板： hero_down
            Laya.Animation.createFrames(["war/hero_down1.png", "war/hero_down2.png", "war/hero_down3.png", "war/hero_down4.png"], Role.HERO_DOWN);
            //缓存动画模板： enemy1_fly
            Laya.Animation.createFrames(["war/enemy1_fly1.png"], Role.ENEMY1_FLY);
            //缓存enemy1_down动画
            Laya.Animation.createFrames(["war/enemy1_down1.png", "war/enemy1_down2.png", "war/enemy1_down3.png", "war/enemy1_down4.png"], Role.ENEMY1_DOWN);
            //缓存enemy2_fly动画
            Laya.Animation.createFrames(["war/enemy2_fly1.png"], Role.ENEMY2_FLY);
            //缓存enemy2_down动画
            Laya.Animation.createFrames(["war/enemy2_down1.png", "war/enemy2_down2.png", "war/enemy2_down3.png", "war/enemy2_down4.png"], Role.ENEMY2_DOWN);
            //缓存enemy2_hit动画
            Laya.Animation.createFrames(["war/enemy2_hit.png"], Role.ENEMY2_HIT);
            //缓存enemy3_fly动画
            Laya.Animation.createFrames(["war/enemy3_fly1.png", "war/enemy3_fly2.png"], Role.ENEMY3_FLY);
            //缓存enemy3_down动画
            Laya.Animation.createFrames(["war/enemy3_down1.png", "war/enemy3_down2.png", "war/enemy3_down3.png", "war/enemy3_down4.png", "war/enemy3_down5.png", "war/enemy3_down6.png"], Role.ENEMY3_DOWN);
            //缓存enemy3_hit动画
            Laya.Animation.createFrames(["war/enemy3_hit.png"], Role.ENEMY3_HIT);
            // 缓存子弹动画
            Laya.Animation.createFrames(["war/bullet1.png"], Role.BULLET1_FLY);
            //缓存UFO1
            Laya.Animation.createFrames(["war/ufo1.png"], Role.UFO1_FLY);
            //缓存UFO2
            Laya.Animation.createFrames(["war/ufo2.png"], Role.UFO2_FLY);
        }
        if (!this.body) {
            //创建一个动画作为飞机的身体
            this.body = new Laya.Animation();
            // 动画播放间隔
            this.body.interval = 50;
            // 监听动画完成
            this.body.on(Laya.Event.COMPLETE, this, this.onComplete);
            //把机体添加到容器内
            this.addChild(this.body);
        }
        //开始播放动画
        this.playAction("fly");
    };
    Role.prototype.playAction = function (action) {
        this.action = action;
        // 记录播放动画的类型
        this.body.play(0, true, this.type + "_" + action);
        var bound = this.body.getBounds();
        this.body.pos(-bound.width / 2, -bound.height / 2);
    };
    Role.prototype.onComplete = function () {
        if (this.action == "down") {
            this.body.stop();
            this.visible = false;
        }
        else if (this.action == "hit") {
            this.playAction("fly");
        }
    };
    return Role;
}(Laya.Sprite));
// 动画动作
Role.HERO_FLY = "hero_fly";
Role.HERO_DOWN = "hero_down";
Role.ENEMY1_DOWN = "enemy1_down";
Role.ENEMY2_DOWN = "enemy2_down";
Role.ENEMY3_DOWN = "enemy3_down";
Role.ENEMY1_FLY = "enemy1_fly";
Role.ENEMY2_FLY = "enemy2_fly";
Role.ENEMY3_FLY = "enemy3_fly";
Role.BULLET1_FLY = "bullet1_fly";
Role.UFO1_FLY = "ufo1_fly";
Role.UFO2_FLY = "ufo2_fly";
Role.ENEMY2_HIT = "enemy2_hit";
Role.ENEMY3_HIT = "enemy3_hit";
//# sourceMappingURL=role.js.map