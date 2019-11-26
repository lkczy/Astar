class GameInfo extends ui.GameInfoUI {
    constructor(){
        super();

        this.pauseBtn.on(Laya.Event.CLICK, this, this.onPause);
        this.reset();
    }

    public reset(): void{
        this.infoLabel.text = "";
        this.hp(5);
        this.level(0);
        this.score(0);
    }

    onPause(e : Laya.Event): void{
        e.stopPropagation();
        this.infoLabel.text = "游戏暂停, 点击开始";
        gameObj.resume();
    }

    //显示血量
  public hp(value: number): void {
    this.hpLabel.text = "HP:" + value;
  }
   
  //显示关卡级别
  public level(value: number): void {
    this.levelLabel.text = "Level:" + value;
  }
   
  //显示积分
  public score(value: number): void {
    this.scoreLabel.text = "Score:" + value;
  }
}