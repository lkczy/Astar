(function () {
    'use strict';

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 1600;
    GameConfig.height = 1200;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Node {
        constructor(xIndex, yIndex, isBarrier, rectSprite) {
            this.parentNode = null;
            this.isBarrier = false;
            this.rectSprite = null;
            this.xIndex = xIndex;
            this.yIndex = yIndex;
            this.isBarrier = isBarrier;
            this.rectSprite = rectSprite;
        }
    }

    class myArray {
        constructor(rows, cols, value) {
            this.myArray = new Array();
            this.rows = rows;
            this.cols = cols;
            this.initRows(rows);
            this.initCols(cols, value);
        }
        getValue(rows, cols) {
            if (rows < 0 || cols < 0 || rows > this.rows || cols > this.cols) {
                return null;
            }
            return this.myArray[rows][cols];
        }
        setValue(rows, cols, value) {
            if (rows < 0 || cols < 0 || rows > this.rows || cols > this.cols) {
                return;
            }
            this.myArray[rows][cols] = value;
        }
        getArray() {
            return this.myArray;
        }
        initRows(rows) {
            if (rows < 1) {
                return;
            }
            for (let i = 0; i < rows; i++) {
                this.myArray.push(new Array());
            }
        }
        initCols(cols, value) {
            if (cols < 1) {
                return;
            }
            for (let i = 0; i < this.myArray.length; i++) {
                for (let j = 0; j < cols; j++) {
                    this.myArray[i].push(value);
                }
            }
        }
    }

    var Sprite = Laya.Sprite;
    class Map {
        constructor() {
            this.rectWidth = 10;
            this.rectHeight = 10;
            this.mapWidth = 101;
            this.mapHeight = 100;
        }
        DrawRect(xPos, yPos, rectColor) {
            let sp = new Sprite();
            Laya.stage.addChild(sp);
            sp.graphics.drawRect(xPos, yPos, this.rectWidth, this.rectHeight, rectColor);
            return sp;
        }
        DrawMap() {
            let nodeArr = new myArray(this.mapWidth, this.mapHeight, null);
            for (let i = 0; i <= this.mapWidth - 1; i++) {
                for (let j = 0; j <= this.mapHeight - 1; j++) {
                    let tempNode;
                    if (i % 2 == 0 || j == 0 || j == this.mapHeight - 1) {
                        let tempSprite = this.DrawRect(i * this.rectWidth, j * this.rectHeight, "#000000");
                        tempNode = new Node(i, j, true, tempSprite);
                    }
                    else {
                        let tempSprite = this.DrawRect(i * this.rectWidth, j * this.rectHeight, "#ffffff");
                        tempNode = new Node(i, j, false, tempSprite);
                    }
                    nodeArr.setValue(j, i, tempNode);
                }
            }
            for (let i = 0; i < this.mapWidth; i++) {
                let randomPos = Math.floor(Math.random() * this.mapHeight);
                if (randomPos == 0) {
                    randomPos++;
                }
                if (randomPos == this.mapHeight - 1) {
                    randomPos--;
                }
                nodeArr.getValue(randomPos, i).rectSprite = this.DrawRect(i * this.rectWidth, randomPos * this.rectHeight, "#ffffff");
                nodeArr.getValue(randomPos, i).isBarrier = false;
            }
            return nodeArr;
        }
    }

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.stage.bgColor = "#0fffff";
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            let pointsArr = new Map().DrawMap();
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
