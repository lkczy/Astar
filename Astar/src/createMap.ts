module laya {
    import Sprite = Laya.Sprite;
    import Stage = Laya.Stage;
    export class Sprite_DrawMaps {
        private sp: Sprite;
        constructor()
        {
            Laya.init(110, 110);
            Laya.stage.bgColor="#0fffff";
            this.drawSomething();
        }

        private drawSomething(): void {
            this.sp = new Sprite();
            Laya.stage.addChild(this.sp);

           var randomNum:number=0;

            for(var i:number=0;i<=10;i=++i){
                randomNum=10*Math.round(1+9*Math.random());
                if(i==0||i%2==0){
                    this.sp.graphics.drawRect(10*i, 0, 10, randomNum, "#000000"); 
                    this.sp.graphics.drawRect(10*i, randomNum+10, 10, 100-randomNum, "#000000"); 
                }
                else{
                    this.sp.graphics.drawRect(10*i, 0, 10, 10, "#000000");
                    this.sp.graphics.drawRect(10*i, 100, 10, 10, "#000000");
                }
            }
        }
    }
}
new laya.Sprite_DrawMaps();