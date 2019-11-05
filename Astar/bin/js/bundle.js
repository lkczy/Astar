(function () {
    'use strict';

    var laya;
    (function (laya) {
        var Sprite = Laya.Sprite;
        class DrawMaps {
            constructor() {
                Laya.init(1000, 1000);
                Laya.stage.bgColor = "#0fffff";
                this.drawSomething();
            }
            drawSomething() {
                this.sp = new Sprite();
                Laya.stage.addChild(this.sp);
                var randomNum = 0;
                for (var i = 0; i <= 99; i = ++i) {
                    randomNum = 10 * Math.round(1 + 97 * Math.random());
                    if (i == 0 || i % 2 == 0) {
                        this.sp.graphics.drawRect(10 * i, 0, 10, randomNum, "#000000");
                        this.sp.graphics.drawRect(10 * i, randomNum + 10, 10, 990 - randomNum, "#000000");
                    }
                    else {
                        this.sp.graphics.drawRect(10 * i, 0, 10, 10, "#000000");
                        this.sp.graphics.drawRect(10 * i, 990, 10, 10, "#000000");
                    }
                }
            }
        }
        laya.DrawMaps = DrawMaps;
    })(laya || (laya = {}));
    new laya.DrawMaps();

}());
