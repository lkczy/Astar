/**
 * 小锤子
 */
class Hammer {
    private _view:fairygui.GComponent;
    private _com:fairygui.GComponent;
    constructor(view:fairygui.GComponent){
        this._com = fairygui.UIPackage.createObject("hitMole","hammer").asCom;
        this._view = view;  
    }
    //把锤子组件添加到主视图上
    addView():void{
        this._view.addChild(this._com);
    }
    //使用
    start():void{
        //鼠标隐藏
        Laya.Mouse.hide();
        //锤子图片显示
        this._com.getChild("n0").asImage.visible = true;
        //添加舞台监听事件,监听鼠标按下
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        //添加舞台监听事件,监听鼠标移动
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
    }
    //结束使用
    end():void{
        //鼠标显示
        Laya.Mouse.show();
        //锤子图片隐藏
        this._com.getChild("n0").asImage.visible = false;
        //关闭舞台监听事件
        Laya.stage.off(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
    }
    //鼠标点击，锤子锤下
    onMouseDown():void{
        //播放锤子动效
        this._com.getTransition("t0").play();
    }
    //锤子跟着鼠标移动
    onMouseMove():void{
        //设置组件跟随鼠标移动的位置
        this._com.setXY(Laya.stage.mouseX-this._com.width/2,Laya.stage.mouseY-this._com.height/2);
    }
}