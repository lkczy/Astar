class Role extends Laya.Sprite{
    private body: Laya.Animation;
    private static cached:boolean;

    // 飞机类型
    private type:string;
    // 阵营 0 我方  1敌方
    public camp:number;
    // 血量
    public hp:number;
    // 飞行速度
    public speed:number;
    // 攻击半径
    public hitRadius:number;

    // 射击类型
    public shootType:number = 0;
    // 射击间隔
    public shootInterval:number = 500;
    // 下次射击时间
    public shootTime:number = Laya.Browser.now() + 2000;
    // 是否子弹
    // public isBullet:boolean = false;
    // 当前动作
    public action:string;

     /**0：普通，1：子弹，2：弹药，3：补给品 */
    public heroType: number = 0;

    // 动画动作
    private static HERO_FLY:string = "hero_fly";
    private static HERO_DOWN:string = "hero_down";
    private static ENEMY1_DOWN:string = "enemy1_down";
    private static ENEMY2_DOWN:string = "enemy2_down";
    private static ENEMY3_DOWN:string = "enemy3_down";
    private static ENEMY1_FLY:string = "enemy1_fly";
    private static ENEMY2_FLY:string = "enemy2_fly";
    private static ENEMY3_FLY:string = "enemy3_fly";
    private static BULLET1_FLY:string = "bullet1_fly";
    private static UFO1_FLY:string = "ufo1_fly";
    private static UFO2_FLY:string = "ufo2_fly";

    private static ENEMY2_HIT:string = "enemy2_hit";
    private static ENEMY3_HIT:string = "enemy3_hit";

    constructor(){
        super();
        // this.init();
    }

    init(type: string, camp: number, hp: number, speed: number, hitRadius: number, heroType: number): void{
        //初始化角色属性
        this.type = type;
        this.camp = camp;
        this.hp = hp;
        this.speed = speed;
        this.hitRadius = hitRadius;
        this.heroType = heroType;

        // 创建动画模板 缓存公共动画模板 减少对象创建开销
        if(!Role.cached) {
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

        if(!this.body){
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
    }

    playAction(action:string): void{
        this.action = action;
         // 记录播放动画的类型
        this.body.play(0,true,this.type + "_" + action);
        var bound: Laya.Rectangle = this.body.getBounds();
        this.body.pos(-bound.width/2, -bound.height/2);
    }
    
    onComplete():void{
        if(this.action == "down") {
            this.body.stop();
            this.visible = false;
        } else if(this.action == "hit"){
            this.playAction("fly");
        }
    }
}