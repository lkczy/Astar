
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class GameInfoUI extends View {
		public pauseBtn:Laya.Button;
		public levelLabel:Laya.Label;
		public scoreLabel:Laya.Label;
		public hpLabel:Laya.Label;
		public infoLabel:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":480,"height":852},"child":[{"type":"Button","props":{"y":10,"x":403,"var":"pauseBtn","stateNum":1,"skin":"war/btn_pause.png"}},{"type":"Label","props":{"y":24,"x":107,"width":91,"var":"levelLabel","text":"Level:50","height":25,"fontSize":20,"color":"#f3e9e9"}},{"type":"Label","props":{"y":24,"x":210,"width":154,"var":"scoreLabel","text":"Score:100","height":25,"fontSize":20,"color":"#f8dd18"}},{"type":"Label","props":{"y":24,"x":24,"width":74,"var":"hpLabel","text":"Hp:10","height":25,"fontSize":20,"color":"#62f81c"}},{"type":"Label","props":{"y":408,"x":44,"wordWrap":true,"width":392,"var":"infoLabel","text":"战斗结束","height":102,"fontSize":30,"color":"#ffffff","align":"center"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.GameInfoUI.uiView);
        }
    }
}
