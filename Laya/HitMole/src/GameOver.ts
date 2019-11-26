class GameOver{
    private _view:fairygui.GComponent;
    constructor(){
        this._view = fairygui.UIPackage.createObject("hitMole","GameOver").asCom;
        this._view.getChild("restartBtn").on(Laya.Event.CLICK,this,this.restartGame);
        this._view.setXY(140,168);
    }
    addView():void{
        fairygui.GRoot.inst.addChild(this._view);
    }
    restartGame():void{
        fairygui.GRoot.inst.removeChildren();
        GameMain.gameStart.addView();
    }
    setScoreUI(score:number):void{
        this._view.getChild("score").text = "" + score;
    }
}