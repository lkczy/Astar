/**
 * 地鼠
 */
class Mole{
    private _normalState:fairygui.GLoader;  //正常状态图片
    private _hitState:fairygui.GLoader;     //受击状态图片
    private _score:fairygui.GLoader;        //得分图片
    private _downY:number;                  //地鼠显示状态到最高坐标Y值
    private _upY:number;                    //地鼠消失之前到最低坐标Y值
    private _scoreY:number                  //得分图片显示的最高坐标Y值
    private isAction:boolean;               //当前地鼠是否已被激活
    private isShow:boolean;                 //地鼠是否处于显示状态
    private isHit:boolean;                  //地鼠是否处于被击状态
    private type:number;                    //地鼠类型
    private hitCallBack:Laya.Handler;
    
    constructor(normalState:fairygui.GLoader,hitState:fairygui.GLoader,dowmY:number,hitCallBack:Laya.Handler,score:fairygui.GLoader){
        this._normalState = normalState;
        this._hitState = hitState;
        this._score = score;
        this._downY = dowmY;
        this._upY = normalState.y;
        this._scoreY = score.y;
        this.hitCallBack = hitCallBack;
        this.reset();
        this._normalState.on(Laya.Event.MOUSE_DOWN,this,this.hit);
    }

    //重置
    reset():void{
        this._normalState.visible = false;
        this._hitState.visible = false;
        this._score.visible = false;
        this.isAction = false;
        this.isShow = false;
        this.isHit = false;
    }

    //显示
    show():void{
        if(this.isAction)return;
        this.isShow = true;
        this.isAction = true;
        this.type = Math.random()>0.3?1:2;
        this._normalState.url = "img/mouse_normal_" + this.type + ".png";
        this._hitState.url = "img/mouse_hit_" + this.type + ".png";
        this._score.url = "img/score_" + this.type + ".png";
        this._normalState.y = this._downY;
        this._normalState.visible = true;
        //设置缓动对象和缓动效果
        Laya.Tween.to(this._normalState,{y:this._upY},500,Laya.Ease.backOut,Laya.Handler.create(this,this.showComplete));
    }

    //停留
    showComplete():void{
        if(this.isShow && !this.isHit){
            Laya.timer.once(2000,this,this.hide);
        }
    }

    //消失
    hide():void{
        if(this.isShow && !this.isHit){
            this.isShow = false;
            Laya.Tween.to(this._normalState,{y:this._downY},300,Laya.Ease.backIn,Laya.Handler.create(this,this.reset));
        }
    }

    //打击
    hit():void{
        if(this.isShow && !this.isHit){
            this.isHit = true;
            this.isShow = false;
            Laya.timer.clear(this,this.hide);
            this._normalState.visible = false;
            this._hitState.visible = true;
            this.hitCallBack.runWith(this.type);
            Laya.timer.once(500,this,this.reset);
            this.showScore();
        }
    }

    //显示得分飘字
    showScore():void{
        this._score.visible = true;
        this._score.y = this._scoreY + 30;
        this._score.scaleX = 0;
        this._score.scaleY = 0;
        Laya.Tween.to(this._score,{y:this._scoreY,scaleX:1,scaleY:1},300,Laya.Ease.backOut);
    }
}