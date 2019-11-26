var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AStar = /** @class */ (function () {
    function AStar(startPoint, endPoint, mapArr) {
        this.dirArr = [[1, 0], [0, -1], [-1, 0], [0, 1]];
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.mapArr = mapArr;
    }
    /**
     * 查找路径
     */
    AStar.prototype.FindPath = function () {
        this.openList = new Array();
        this.closedList = new Array();
        this.openList.push(this.startPoint);
        while (this.openList.length > 0) {
            //得到当前点
            var curPoint = this.openList[0];
            var curPointIndex = 0;
            for (var i = 0; i < this.openList.length; i++) {
                if (curPoint.F > this.openList[i].F) {
                    curPoint = this.openList[i];
                    curPointIndex = i;
                }
            }
            this.openList.splice(curPointIndex, 1);
            this.closedList.push(curPoint);
            //查找结束
            if (curPoint == this.endPoint) {
                return curPoint;
            }
            //得到周围4个点
            var aroundPoints = this.GetAroundPoints(curPoint);
            for (var i = 0; i < aroundPoints.length; i++) {
                //障碍或在closedList情况
                if (!aroundPoints[i].isObstacle && !this.Contain(this.closedList, aroundPoints[i])) {
                    var gCost = this.CalDistance(curPoint, aroundPoints[i]) + curPoint.G;
                    //不在openList里
                    if (!this.Contain(this.openList, aroundPoints[i]) || gCost < aroundPoints[i].G) {
                        aroundPoints[i].G = gCost;
                        aroundPoints[i].H = this.CalDistance(aroundPoints[i], this.endPoint);
                        ;
                        aroundPoints[i].F = gCost + aroundPoints[i].H;
                        aroundPoints[i].parentPoint = curPoint;
                        if (!this.Contain(this.openList, aroundPoints[i])) {
                            this.openList.push(aroundPoints[i]);
                        }
                    }
                }
            }
        }
        return null;
    };
    /**
     * 得到周围4个点
     * @param curPoint
     */
    AStar.prototype.GetAroundPoints = function (curPoint) {
        var aroundPoints = new Array();
        for (var i = 0; i < this.dirArr.length; i++) {
            var x = curPoint.xIndex + this.dirArr[i][0];
            var y = curPoint.yIndex + this.dirArr[i][1];
            if (x >= 0 && x < this.mapArr.columns && y >= 0 && y < this.mapArr.rows) {
                aroundPoints.push(this.mapArr.getValue(y, x));
            }
        }
        return aroundPoints;
    };
    /**
     * 数组是否包含元素
     */
    AStar.prototype.Contain = function (arr, target) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return true;
            }
        }
        return false;
    };
    /**
     * 得到两个点的距离
     */
    AStar.prototype.CalDistance = function (point_1, point_2) {
        return Math.abs(point_2.xIndex - point_1.xIndex) + Math.abs(point_2.yIndex - point_1.yIndex);
    };
    return AStar;
}());
exports.default = AStar;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sprite = Laya.Sprite;
var Point_1 = require("./Point");
var My2DArray_1 = require("./My2DArray");
var CreateMap = /** @class */ (function () {
    function CreateMap() {
        //矩形宽高(像素)
        this.rectWidth = 10;
        this.rectHeight = 10;
        //地图宽高(格数)
        this.mapWidth = 101;
        this.mapHeight = 100;
    }
    /**
     * 画矩形
     */
    CreateMap.prototype.DrawRect = function (xPos, yPos, rectColor) {
        var sp = new Sprite();
        Laya.stage.addChild(sp);
        sp.graphics.drawRect(xPos, yPos, this.rectWidth, this.rectHeight, rectColor);
        return sp;
    };
    /**
     * 创建地图
     */
    CreateMap.prototype.DrawMap = function () {
        var pointsArr = new My2DArray_1.default(this.mapHeight, this.mapWidth, null);
        for (var i = 0; i <= this.mapWidth - 1; i++) {
            for (var j = 0; j <= this.mapHeight - 1; j++) {
                var tempPoint = void 0;
                if (i % 2 == 0 || j == 0 || j == this.mapHeight - 1) { //墙         
                    var tempSprite = this.DrawRect(i * this.rectWidth, j * this.rectHeight, "#000000");
                    tempPoint = new Point_1.default(i, j, tempSprite, true);
                }
                else {
                    //路
                    var tempSprite = this.DrawRect(i * this.rectWidth, j * this.rectHeight, "#FFFFFF");
                    tempPoint = new Point_1.default(i, j, tempSprite, false);
                }
                pointsArr.setValue(j, i, tempPoint);
            }
        }
        //门
        for (var i = 0; i < this.mapWidth; i++) {
            var randomCount = void 0;
            if (i % 2 == 0) {
                randomCount = Math.ceil(Math.random() * 10);
                //for(let j=0;j<randomCount;j++)
                //{
                var randomPos = Math.floor(Math.random() * this.mapHeight);
                if (randomPos == 0) {
                    randomPos++;
                }
                if (randomPos == this.mapHeight - 1) {
                    randomPos--;
                }
                pointsArr.getValue(randomPos, i).sprite = this.DrawRect(i * this.rectWidth, randomPos * this.rectHeight, "#FFFFFF");
                pointsArr.getValue(randomPos, i).isObstacle = false;
                //}  
            }
        }
        return pointsArr;
    };
    return CreateMap;
}());
exports.default = CreateMap;
},{"./My2DArray":5,"./Point":6}],3:[function(require,module,exports){
"use strict";
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
Object.defineProperty(exports, "__esModule", { value: true });
/*
* 游戏初始化配置;
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    GameConfig.init = function () {
        var reg = Laya.ClassUtils.regClass;
    };
    GameConfig.width = 1200;
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
    return GameConfig;
}());
exports.default = GameConfig;
GameConfig.init();
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameConfig_1 = require("./GameConfig");
var CreateMap_1 = require("./CreateMap");
var AStar_1 = require("./AStar");
var Sprite = Laya.Sprite;
var Main = /** @class */ (function () {
    function Main() {
        //根据IDE设置初始化引擎		
        if (window["Laya3D"])
            Laya3D.init(GameConfig_1.default.width, GameConfig_1.default.height);
        else
            Laya.init(GameConfig_1.default.width, GameConfig_1.default.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = GameConfig_1.default.scaleMode;
        Laya.stage.screenMode = GameConfig_1.default.screenMode;
        Laya.stage.alignV = GameConfig_1.default.alignV;
        Laya.stage.alignH = GameConfig_1.default.alignH;
        Laya.stage.bgColor = "#C6E2FF";
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig_1.default.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig_1.default.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (GameConfig_1.default.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (GameConfig_1.default.stat)
            Laya.Stat.show();
        Laya.alertGlobalError = true;
        //创建地图
        var pointsArr = new CreateMap_1.default().DrawMap();
        //路径查找
        var starPoint;
        var endPoint;
        for (var i = 0; i < pointsArr.rows; i++) //找起点
         {
            if (pointsArr.getValue(i, 0).isObstacle == false) {
                starPoint = pointsArr.getValue(i, 0);
                break;
            }
        }
        for (var i = 0; i < pointsArr.rows; i++) //找终点
         {
            if (pointsArr.getValue(i, pointsArr.columns - 1).isObstacle == false) {
                endPoint = pointsArr.getValue(i, pointsArr.columns - 1);
                break;
            }
        }
        var aStar = new AStar_1.default(starPoint, endPoint, pointsArr);
        var resPoint = aStar.FindPath();
        while (resPoint != null) {
            this.DrawRect(resPoint.xIndex * 10, resPoint.yIndex * 10, "#FF4500");
            resPoint = resPoint.parentPoint;
        }
    }
    /**
     * 画矩形
     */
    Main.prototype.DrawRect = function (xPos, yPos, rectColor) {
        var sp = new Sprite();
        Laya.stage.addChild(sp);
        sp.graphics.drawRect(xPos, yPos, 10, 10, rectColor);
        return sp;
    };
    return Main;
}());
//激活启动类
new Main();
},{"./AStar":1,"./CreateMap":2,"./GameConfig":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var My2DArray = /** @class */ (function () {
    /**
     * 初始化数组
     */
    function My2DArray(rows, columns, value) {
        this.my2DArray = new Array();
        this.rows = rows;
        this.columns = columns;
        this.initRows(rows);
        this.initColumns(columns, value);
    }
    /**
     * 取数组中的值
     */
    My2DArray.prototype.getValue = function (rows, columns) {
        if (rows < 0 || columns < 0 || rows >= this.rows || columns >= this.columns) {
            return null;
        }
        return this.my2DArray[rows][columns];
    };
    /**
     * 为数组赋值
     */
    My2DArray.prototype.setValue = function (rows, columns, value) {
        if (rows < 0 || columns < 0 || rows >= this.rows || columns >= this.columns) {
            return;
        }
        this.my2DArray[rows][columns] = value;
    };
    /**
     * 初始化行数
     */
    My2DArray.prototype.initRows = function (rows) {
        if (rows < 1) {
            return;
        }
        for (var i = 0; i < rows; i++) {
            this.my2DArray.push(new Array());
        }
    };
    /**
     * 初始化列数
     */
    My2DArray.prototype.initColumns = function (columns, value) {
        if (columns < 1) {
            return;
        }
        for (var i = 0; i < this.my2DArray.length; i++) {
            for (var j = 0; j < columns; j++) {
                this.my2DArray[i].push(value);
            }
        }
    };
    /**
     * 获取数组
     */
    My2DArray.prototype.getArray = function () {
        return this.my2DArray;
    };
    return My2DArray;
}());
exports.default = My2DArray;
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point = /** @class */ (function () {
    function Point(xIndex, yIndex, sprite, isObstacle) {
        this.F = 0;
        this.G = 0;
        this.H = 0;
        this.parentPoint = null; //父节点
        this.isObstacle = false;
        this.sprite = null;
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.sprite = sprite;
        this.isObstacle = isObstacle;
    }
    return Point;
}());
exports.default = Point;
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL0FkbWluaXN0cmF0b3IvRG93bmxvYWRzL0xheWFBaXJJREUgMi4xLjEvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0FTdGFyLnRzIiwic3JjL0NyZWF0ZU1hcC50cyIsInNyYy9HYW1lQ29uZmlnLnRzIiwic3JjL01haW4udHMiLCJzcmMvTXkyREFycmF5LnRzIiwic3JjL1BvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1BBO0lBVUksZUFBbUIsVUFBZ0IsRUFBQyxRQUFjLEVBQUUsTUFBaUI7UUFKN0QsV0FBTSxHQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFNbEQsSUFBSSxDQUFDLFVBQVUsR0FBQyxVQUFVLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBQyxRQUFRLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksd0JBQVEsR0FBZjtRQUVJLElBQUksQ0FBQyxRQUFRLEdBQUMsSUFBSSxLQUFLLEVBQVMsQ0FBQztRQUNqQyxJQUFJLENBQUMsVUFBVSxHQUFDLElBQUksS0FBSyxFQUFTLENBQUM7UUFFbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXBDLE9BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUM1QjtZQUNJLE9BQU87WUFDUCxJQUFJLFFBQVEsR0FBUyxJQUFJLENBQUMs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QyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFHLENBQUMsRUFBRyxFQUFDO1lBQzdDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFHLENBQUMsR0FBRyxPQUFPLEVBQUcsQ0FBQyxFQUFHLEVBQUM7Z0JBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2pDO1NBQ0o7SUFDTCxDQUFDO0lBQ0Q7O09BRUc7SUFDSSw0QkFBUSxHQUFmO1FBQ0ksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFDTCxnQkFBQztBQUFELENBbEVBLEFBa0VDLElBQUE7Ozs7O0FDcEVEO0lBY0ksZUFBbUIsTUFBYSxFQUFFLE1BQWEsRUFBRSxNQUFrQixFQUFDLFVBQWtCO1FBVC9FLE1BQUMsR0FBUSxDQUFDLENBQUM7UUFDWCxNQUFDLEdBQVEsQ0FBQyxDQUFDO1FBQ1gsTUFBQyxHQUFRLENBQUMsQ0FBQztRQUVYLGdCQUFXLEdBQU8sSUFBSSxDQUFDLENBQUEsS0FBSztRQUM1QixlQUFVLEdBQVMsS0FBSyxDQUFDO1FBRXpCLFdBQU0sR0FBYSxJQUFJLENBQUM7UUFJM0IsSUFBSSxDQUFDLE1BQU0sR0FBQyxNQUFNLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBQyxNQUFNLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBQyxNQUFNLENBQUM7UUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBQyxVQUFVLENBQUM7SUFDL0IsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQXJCQSxBQXFCQyxJQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBQb2ludCBmcm9tIFwiLi9Qb2ludFwiO1xyXG5pbXBvcnQgTXkyREFycmF5IGZyb20gXCIuL015MkRBcnJheVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVN0YXIgIFxyXG57XHJcbiAgICBwcml2YXRlIG1hcEFycjpNeTJEQXJyYXk7XHJcbiAgICBwcml2YXRlIHN0YXJ0UG9pbnQ6UG9pbnQ7XHJcbiAgICBwcml2YXRlIGVuZFBvaW50OlBvaW50O1xyXG5cclxuICAgIHByaXZhdGUgZGlyQXJyOm51bWJlcltdW109W1sxLDBdLFswLC0xXSxbLTEsMF0sWzAsMV1dO1xyXG4gICAgcHJpdmF0ZSBvcGVuTGlzdDpBcnJheTxQb2ludD47XHJcbiAgICBwcml2YXRlIGNsb3NlZExpc3Q6QXJyYXk8UG9pbnQ+O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzdGFydFBvaW50OlBvaW50LGVuZFBvaW50OlBvaW50LCBtYXBBcnI6IE15MkRBcnJheSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLnN0YXJ0UG9pbnQ9c3RhcnRQb2ludDtcclxuICAgICAgICB0aGlzLmVuZFBvaW50PWVuZFBvaW50O1xyXG4gICAgICAgIHRoaXMubWFwQXJyPW1hcEFycjtcclxuICAgIH0gXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmn6Xmib7ot6/lvoRcclxuICAgICAqL1xyXG4gICAgcHVibGljIEZpbmRQYXRoKCk6UG9pbnRcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wZW5MaXN0PW5ldyBBcnJheTxQb2ludD4oKTtcclxuICAgICAgICB0aGlzLmNsb3NlZExpc3Q9bmV3IEFycmF5PFBvaW50PigpO1xyXG5cclxuICAgICAgICB0aGlzLm9wZW5MaXN0LnB1c2godGhpcy5zdGFydFBvaW50KTtcclxuXHJcbiAgICAgICAgd2hpbGUodGhpcy5vcGVuTGlzdC5sZW5ndGg+MClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8v5b6X5Yiw5b2T5YmN54K5XHJcbiAgICAgICAgICAgIGxldCBjdXJQb2ludDogUG9pbnQgPXRoaXMub3Blbkxpc3RbMF07ICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgY3VyUG9pbnRJbmRleD0wOyAgXHJcbiAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5vcGVuTGlzdC5sZW5ndGg7aSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihjdXJQb2ludC5GPnRoaXMub3Blbkxpc3RbaV0uRilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJQb2ludD10aGlzLm9wZW5MaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1clBvaW50SW5kZXg9aTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5vcGVuTGlzdC5zcGxpY2UoY3VyUG9pbnRJbmRleCwxKTtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZWRMaXN0LnB1c2goY3VyUG9pbnQpO1xyXG5cclxuICAgICAgICAgICAgLy/mn6Xmib7nu5PmnZ9cclxuICAgICAgICAgICAgaWYoY3VyUG9pbnQ9PXRoaXMuZW5kUG9pbnQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJQb2ludDtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAvL+W+l+WIsOWRqOWbtDTkuKrngrlcclxuICAgICAgICAgICAgbGV0IGFyb3VuZFBvaW50cz10aGlzLkdldEFyb3VuZFBvaW50cyhjdXJQb2ludCk7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8YXJvdW5kUG9pbnRzLmxlbmd0aDtpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8v6Zqc56KN5oiW5ZyoY2xvc2VkTGlzdOaDheWGtVxyXG4gICAgICAgICAgICAgICAgaWYoIWFyb3VuZFBvaW50c1tpXS5pc09ic3RhY2xlJiYhdGhpcy5Db250YWluKHRoaXMuY2xvc2VkTGlzdCxhcm91bmRQb2ludHNbaV0pKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICBsZXQgZ0Nvc3Q9dGhpcy5DYWxEaXN0YW5jZShjdXJQb2ludCxhcm91bmRQb2ludHNbaV0pK2N1clBvaW50Lkc7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/kuI3lnKhvcGVuTGlzdOmHjFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLkNvbnRhaW4odGhpcy5vcGVuTGlzdCxhcm91bmRQb2ludHNbaV0pIHx8IGdDb3N0PGFyb3VuZFBvaW50c1tpXS5HKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJvdW5kUG9pbnRzW2ldLkc9Z0Nvc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyb3VuZFBvaW50c1tpXS5IPXRoaXMuQ2FsRGlzdGFuY2UoYXJvdW5kUG9pbnRzW2ldLHRoaXMuZW5kUG9pbnQpOztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJvdW5kUG9pbnRzW2ldLkY9Z0Nvc3QrYXJvdW5kUG9pbnRzW2ldLkg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyb3VuZFBvaW50c1tpXS5wYXJlbnRQb2ludD1jdXJQb2ludDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLkNvbnRhaW4odGhpcy5vcGVuTGlzdCxhcm91bmRQb2ludHNbaV0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5MaXN0LnB1c2goYXJvdW5kUG9pbnRzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b6X5Yiw5ZGo5Zu0NOS4queCuVxyXG4gICAgICogQHBhcmFtIGN1clBvaW50IFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIEdldEFyb3VuZFBvaW50cyhjdXJQb2ludDogUG9pbnQpOkFycmF5PFBvaW50PlxyXG4gICAge1xyXG4gICAgICAgIGxldCBhcm91bmRQb2ludHM6QXJyYXk8UG9pbnQ+PW5ldyBBcnJheTxQb2ludD4oKTtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuZGlyQXJyLmxlbmd0aDtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgeD1jdXJQb2ludC54SW5kZXggKyB0aGlzLmRpckFycltpXVswXTtcclxuICAgICAgICAgICAgbGV0IHk9Y3VyUG9pbnQueUluZGV4ICsgdGhpcy5kaXJBcnJbaV1bMV07XHJcbiAgICAgICAgICAgIGlmKHg+PTAgJiYgeDx0aGlzLm1hcEFyci5jb2x1bW5zICYmIHk+PTAgJiYgeTx0aGlzLm1hcEFyci5yb3dzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhcm91bmRQb2ludHMucHVzaCh0aGlzLm1hcEFyci5nZXRWYWx1ZSh5LHgpKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFyb3VuZFBvaW50cztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaVsOe7hOaYr+WQpuWMheWQq+WFg+e0oFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIENvbnRhaW4oYXJyOiBBcnJheTxQb2ludD4sdGFyZ2V0OlBvaW50KTpib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxhcnIubGVuZ3RoO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKGFycltpXT09dGFyZ2V0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvpfliLDkuKTkuKrngrnnmoTot53nprtcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBDYWxEaXN0YW5jZShwb2ludF8xOlBvaW50LHBvaW50XzI6UG9pbnQpOm51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyhwb2ludF8yLnhJbmRleC1wb2ludF8xLnhJbmRleCkrTWF0aC5hYnMocG9pbnRfMi55SW5kZXgtcG9pbnRfMS55SW5kZXgpO1xyXG4gICAgfSAgICBcclxufSIsImltcG9ydCBTcHJpdGUgPSBMYXlhLlNwcml0ZTtcclxuaW1wb3J0IFN0YWdlID0gTGF5YS5TdGFnZTtcclxuaW1wb3J0IFdlYkdMID0gTGF5YS5XZWJHTDtcclxuXHJcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9Qb2ludFwiO1xyXG5pbXBvcnQgTXkyREFycmF5IGZyb20gXCIuL015MkRBcnJheVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlTWFwIHtcclxuICAgIC8v55+p5b2i5a696auYKOWDj+e0oClcclxuICAgIHByaXZhdGUgcmVjdFdpZHRoOm51bWJlcj0xMDtcclxuICAgIHByaXZhdGUgcmVjdEhlaWdodDpudW1iZXI9MTA7XHJcblxyXG4gICAgLy/lnLDlm77lrr3pq5go5qC85pWwKVxyXG4gICAgcHJpdmF0ZSBtYXBXaWR0aDpudW1iZXI9MTAxO1xyXG4gICAgcHJpdmF0ZSBtYXBIZWlnaHQ6bnVtYmVyPTEwMDtcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG4gXHJcbiAgICAvKipcclxuICAgICAqIOeUu+efqeW9oiBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBEcmF3UmVjdCh4UG9zOiBudW1iZXIseVBvczogbnVtYmVyLHJlY3RDb2xvcjpzdHJpbmcpOiBTcHJpdGUgXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHNwOiBTcHJpdGUgPSBuZXcgU3ByaXRlKCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChzcCk7XHJcbiAgICAgICAgc3AuZ3JhcGhpY3MuZHJhd1JlY3QoeFBvcywgeVBvcywgdGhpcy5yZWN0V2lkdGgsdGhpcy5yZWN0SGVpZ2h0LCByZWN0Q29sb3IpOyAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzcDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuWcsOWbvlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgRHJhd01hcCgpOiBNeTJEQXJyYXlcclxuICAgIHtcclxuICAgICAgICBsZXQgcG9pbnRzQXJyOiBNeTJEQXJyYXk9bmV3IE15MkRBcnJheSh0aGlzLm1hcEhlaWdodCx0aGlzLm1hcFdpZHRoLG51bGwpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8PXRoaXMubWFwV2lkdGgtMTtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDtqPD10aGlzLm1hcEhlaWdodC0xO2orKylcclxuICAgICAgICAgICAgeyAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBQb2ludDpQb2ludDsgICAgICAgICBcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZihpJTI9PTB8fGo9PTB8fGo9PXRoaXMubWFwSGVpZ2h0LTEpXHJcbiAgICAgICAgICAgICAgICB7ICAgLy/lopkgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcFNwcml0ZTogU3ByaXRlID0gdGhpcy5EcmF3UmVjdChpKnRoaXMucmVjdFdpZHRoLGoqdGhpcy5yZWN0SGVpZ2h0LFwiIzAwMDAwMFwiKTsgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBQb2ludD1uZXcgUG9pbnQoaSxqLHRlbXBTcHJpdGUsdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIC8v6LevXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBTcHJpdGU6IFNwcml0ZSA9IHRoaXMuRHJhd1JlY3QoaSp0aGlzLnJlY3RXaWR0aCxqKnRoaXMucmVjdEhlaWdodCxcIiNGRkZGRkZcIik7ICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wUG9pbnQ9bmV3IFBvaW50KGksaix0ZW1wU3ByaXRlLGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBvaW50c0Fyci5zZXRWYWx1ZShqLGksdGVtcFBvaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/pl6hcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMubWFwV2lkdGg7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHJhbmRvbUNvdW50Om51bWJlcjsgXHJcbiAgICAgICAgICAgIGlmKGklMj09MCl7XHJcbiAgICAgICAgICAgICAgICByYW5kb21Db3VudD1NYXRoLmNlaWwoTWF0aC5yYW5kb20oKSoxMCk7XHJcbiAgICAgICAgICAgICAgICAvL2ZvcihsZXQgaj0wO2o8cmFuZG9tQ291bnQ7aisrKVxyXG4gICAgICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJhbmRvbVBvczpudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqdGhpcy5tYXBIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJhbmRvbVBvcz09MClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmRvbVBvcysrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihyYW5kb21Qb3M9PXRoaXMubWFwSGVpZ2h0LTEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5kb21Qb3MtLTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzQXJyLmdldFZhbHVlKHJhbmRvbVBvcyxpKS5zcHJpdGU9dGhpcy5EcmF3UmVjdChpKnRoaXMucmVjdFdpZHRoLCByYW5kb21Qb3MqdGhpcy5yZWN0SGVpZ2h0LCBcIiNGRkZGRkZcIik7ICAgICBcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHNBcnIuZ2V0VmFsdWUocmFuZG9tUG9zLGkpLmlzT2JzdGFjbGU9ZmFsc2U7IFxyXG4gICAgICAgICAgICAgICAgLy99ICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBvaW50c0FycjtcclxuICAgIH1cclxufSIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xyXG5cclxuLypcclxuKiDmuLjmiI/liJ3lp4vljJbphY3nva47XHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDb25maWd7XHJcbiAgICBzdGF0aWMgd2lkdGg6bnVtYmVyPTEyMDA7XHJcbiAgICBzdGF0aWMgaGVpZ2h0Om51bWJlcj0xMjAwO1xyXG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZHdpZHRoXCI7XHJcbiAgICBzdGF0aWMgc2NyZWVuTW9kZTpzdHJpbmc9XCJub25lXCI7XHJcbiAgICBzdGF0aWMgYWxpZ25WOnN0cmluZz1cInRvcFwiO1xyXG4gICAgc3RhdGljIGFsaWduSDpzdHJpbmc9XCJsZWZ0XCI7XHJcbiAgICBzdGF0aWMgc3RhcnRTY2VuZTphbnk9XCJcIjtcclxuICAgIHN0YXRpYyBzY2VuZVJvb3Q6c3RyaW5nPVwiXCI7XHJcbiAgICBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBzdGF0OmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgcGh5c2ljc0RlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xyXG4gICAgY29uc3RydWN0b3IoKXt9XHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIHZhciByZWc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xyXG5cclxuICAgIH1cclxufVxyXG5HYW1lQ29uZmlnLmluaXQoKTsiLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCBNeTJEQXJyYXkgZnJvbSBcIi4vTXkyREFycmF5XCI7XHJcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9Qb2ludFwiO1xyXG5pbXBvcnQgQ3JlYXRlTWFwIGZyb20gXCIuL0NyZWF0ZU1hcFwiO1xyXG5pbXBvcnQgQVN0YXIgZnJvbSBcIi4vQVN0YXJcIjtcclxuaW1wb3J0IFNwcml0ZSA9IExheWEuU3ByaXRlO1xyXG5cclxuY2xhc3MgTWFpbiB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHQvL+agueaNrklEReiuvue9ruWIneWni+WMluW8leaTjlx0XHRcclxuXHRcdGlmICh3aW5kb3dbXCJMYXlhM0RcIl0pIExheWEzRC5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0KTtcclxuXHRcdGVsc2UgTGF5YS5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0LCBMYXlhW1wiV2ViR0xcIl0pO1xyXG5cdFx0TGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhW1wiRGVidWdQYW5lbFwiXSAmJiBMYXlhW1wiRGVidWdQYW5lbFwiXS5lbmFibGUoKTtcclxuXHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gR2FtZUNvbmZpZy5zY2FsZU1vZGU7XHJcblx0XHRMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBHYW1lQ29uZmlnLnNjcmVlbk1vZGU7XHJcblx0XHRMYXlhLnN0YWdlLmFsaWduViA9IEdhbWVDb25maWcuYWxpZ25WO1xyXG5cdFx0TGF5YS5zdGFnZS5hbGlnbkggPSBHYW1lQ29uZmlnLmFsaWduSDtcclxuXHRcdExheWEuc3RhZ2UuYmdDb2xvcj1cIiNDNkUyRkZcIjtcclxuXHRcdC8v5YW85a655b6u5L+h5LiN5pSv5oyB5Yqg6L29c2NlbmXlkI7nvIDlnLrmma9cclxuXHRcdExheWEuVVJMLmV4cG9ydFNjZW5lVG9Kc29uID0gR2FtZUNvbmZpZy5leHBvcnRTY2VuZVRvSnNvbjtcclxuXHJcblx0XHQvL+aJk+W8gOiwg+ivlemdouadv++8iOmAmui/h0lEReiuvue9ruiwg+ivleaooeW8j++8jOaIluiAhXVybOWcsOWdgOWinuWKoGRlYnVnPXRydWXlj4LmlbDvvIzlnYflj6/miZPlvIDosIPor5XpnaLmnb/vvIlcclxuXHRcdGlmIChHYW1lQ29uZmlnLmRlYnVnIHx8IExheWEuVXRpbHMuZ2V0UXVlcnlTdHJpbmcoXCJkZWJ1Z1wiKSA9PSBcInRydWVcIikgTGF5YS5lbmFibGVEZWJ1Z1BhbmVsKCk7XHJcblx0XHRpZiAoR2FtZUNvbmZpZy5waHlzaWNzRGVidWcgJiYgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0pIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdLmVuYWJsZSgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcuc3RhdCkgTGF5YS5TdGF0LnNob3coKTtcclxuXHRcdExheWEuYWxlcnRHbG9iYWxFcnJvciA9IHRydWU7XHJcblxyXG5cdFx0Ly/liJvlu7rlnLDlm75cclxuXHRcdGxldCBwb2ludHNBcnI6IE15MkRBcnJheSA9bmV3IENyZWF0ZU1hcCgpLkRyYXdNYXAoKTtcclxuXHRcdFxyXG5cdFx0Ly/ot6/lvoTmn6Xmib5cclxuXHRcdGxldCBzdGFyUG9pbnQ6IFBvaW50O1xyXG5cdFx0bGV0IGVuZFBvaW50OiBQb2ludDtcclxuXHJcblx0XHRmb3IobGV0IGk9MDtpPHBvaW50c0Fyci5yb3dzO2krKykvL+aJvui1t+eCuVxyXG5cdFx0e1xyXG5cdFx0XHRpZihwb2ludHNBcnIuZ2V0VmFsdWUoaSwwKS5pc09ic3RhY2xlPT1mYWxzZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHN0YXJQb2ludD1wb2ludHNBcnIuZ2V0VmFsdWUoaSwwKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvcihsZXQgaT0wO2k8cG9pbnRzQXJyLnJvd3M7aSsrKS8v5om+57uI54K5XHJcblx0XHR7XHJcblx0XHRcdGlmKHBvaW50c0Fyci5nZXRWYWx1ZShpLHBvaW50c0Fyci5jb2x1bW5zLTEpLmlzT2JzdGFjbGU9PWZhbHNlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZW5kUG9pbnQ9cG9pbnRzQXJyLmdldFZhbHVlKGkscG9pbnRzQXJyLmNvbHVtbnMtMSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgYVN0YXI6QVN0YXI9bmV3IEFTdGFyKHN0YXJQb2ludCxlbmRQb2ludCxwb2ludHNBcnIpO1xyXG5cdFx0bGV0IHJlc1BvaW50PWFTdGFyLkZpbmRQYXRoKCk7XHJcblxyXG5cdFx0d2hpbGUocmVzUG9pbnQhPW51bGwpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuRHJhd1JlY3QocmVzUG9pbnQueEluZGV4KjEwLHJlc1BvaW50LnlJbmRleCoxMCxcIiNGRjQ1MDBcIilcclxuXHRcdFx0cmVzUG9pbnQ9cmVzUG9pbnQucGFyZW50UG9pbnQ7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuICAgICAqIOeUu+efqeW9oiBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBEcmF3UmVjdCh4UG9zOiBudW1iZXIseVBvczogbnVtYmVyLHJlY3RDb2xvcjpzdHJpbmcpOiBTcHJpdGUgXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHNwOiBTcHJpdGUgPSBuZXcgU3ByaXRlKCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChzcCk7XHJcbiAgICAgICAgc3AuZ3JhcGhpY3MuZHJhd1JlY3QoeFBvcywgeVBvcywgMTAsMTAsIHJlY3RDb2xvcik7ICAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHNwO1xyXG4gICAgfVxyXG59XHJcblxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCJpbXBvcnQgUG9pbnQgZnJvbSBcIi4vUG9pbnRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE15MkRBcnJheXtcclxuICAgIHByaXZhdGUgbXkyREFycmF5IDogQXJyYXk8QXJyYXk8UG9pbnQ+PiA9ICBuZXcgQXJyYXk8QXJyYXk8UG9pbnQ+PigpO1xyXG4gICAgcHVibGljIHJvd3MgOm51bWJlcjtcclxuICAgIHB1YmxpYyBjb2x1bW5zIDpudW1iZXI7XHJcbiBcclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyW5pWw57uEXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihyb3dzOm51bWJlcixjb2x1bW5zOm51bWJlcix2YWx1ZTpQb2ludCl7XHJcbiAgICAgICAgdGhpcy5yb3dzID0gcm93cztcclxuICAgICAgICB0aGlzLmNvbHVtbnMgPSBjb2x1bW5zO1xyXG4gICAgICAgIHRoaXMuaW5pdFJvd3Mocm93cyk7XHJcbiAgICAgICAgdGhpcy5pbml0Q29sdW1ucyhjb2x1bW5zLHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWPluaVsOe7hOS4reeahOWAvFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0VmFsdWUocm93czpudW1iZXIsY29sdW1uczpudW1iZXIpOlBvaW50e1xyXG4gICAgICAgIGlmKHJvd3MgPCAwIHx8IGNvbHVtbnMgPCAwIHx8IHJvd3MgPj0gdGhpcy5yb3dzIHx8IGNvbHVtbnMgPj0gdGhpcy5jb2x1bW5zKXtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm15MkRBcnJheVtyb3dzXVtjb2x1bW5zXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS4uuaVsOe7hOi1i+WAvFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0VmFsdWUocm93czpudW1iZXIsY29sdW1uczpudW1iZXIsdmFsdWU6UG9pbnQpOnZvaWR7XHJcbiAgICAgICAgaWYocm93cyA8IDAgfHwgY29sdW1ucyA8IDAgfHwgcm93cyA+PSB0aGlzLnJvd3MgfHwgY29sdW1ucyA+PSB0aGlzLmNvbHVtbnMpe1xyXG4gICAgICAgICAgICByZXR1cm4gO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm15MkRBcnJheVtyb3dzXVtjb2x1bW5zXSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyW6KGM5pWwXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdFJvd3Mocm93czpudW1iZXIpOnZvaWR7XHJcbiAgICAgICAgaWYocm93cyA8IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGkgPSAwIDsgaSA8IHJvd3MgOyBpICsrKXtcclxuICAgICAgICAgICAgdGhpcy5teTJEQXJyYXkucHVzaChuZXcgQXJyYXk8UG9pbnQ+KCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbliJfmlbBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0Q29sdW1ucyhjb2x1bW5zOm51bWJlcix2YWx1ZTpQb2ludCk6dm9pZHtcclxuICAgICAgICBpZihjb2x1bW5zIDwgMSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpID0gMCA7IGkgPCB0aGlzLm15MkRBcnJheS5sZW5ndGggOyBpICsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMCA7IGogPCBjb2x1bW5zIDsgaiArKyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm15MkRBcnJheVtpXS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5pWw57uEXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRBcnJheSgpOkFycmF5PEFycmF5PFBvaW50Pj57XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubXkyREFycmF5O1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9pbnQgXHJcbnsgICAgXHJcbiAgICBwdWJsaWMgeEluZGV4Om51bWJlcjsvL+ihjOaVsFxyXG4gICAgcHVibGljIHlJbmRleDpudW1iZXI7Ly/liJfmlbBcclxuXHJcbiAgICBwdWJsaWMgRjpudW1iZXI9MDtcclxuICAgIHB1YmxpYyBHOm51bWJlcj0wO1xyXG4gICAgcHVibGljIEg6bnVtYmVyPTA7XHJcblxyXG4gICAgcHVibGljIHBhcmVudFBvaW50OlBvaW50PW51bGw7Ly/niLboioLngrlcclxuICAgIHB1YmxpYyBpc09ic3RhY2xlOmJvb2xlYW49ZmFsc2U7XHJcblxyXG4gICAgcHVibGljIHNwcml0ZTpMYXlhLlNwcml0ZT1udWxsO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcih4SW5kZXg6bnVtYmVyLCB5SW5kZXg6bnVtYmVyLCBzcHJpdGU6TGF5YS5TcHJpdGUsaXNPYnN0YWNsZTpib29sZWFuKSBcclxuICAgIHsgIFxyXG4gICAgICAgIHRoaXMueEluZGV4PXhJbmRleDtcclxuICAgICAgICB0aGlzLnlJbmRleD15SW5kZXg7XHJcbiAgICAgICAgdGhpcy5zcHJpdGU9c3ByaXRlO1xyXG4gICAgICAgIHRoaXMuaXNPYnN0YWNsZT1pc09ic3RhY2xlO1xyXG4gICAgfVxyXG59Il19
