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
                if (aroundPoints[i].isObstacle || this.Contain(this.closedList, aroundPoints[i])) {
                    continue;
                }
                else {
                    var gCost = this.CalDistance(curPoint, aroundPoints[i]) + curPoint.G;
                    //在openList里或不在
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
            this.DrawRect(resPoint.xIndex * 10, resPoint.yIndex * 10, "#EE2C2C");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL0FkbWluaXN0cmF0b3IvRG93bmxvYWRzL0xheWFBaXJJREUvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0FTdGFyLnRzIiwic3JjL0NyZWF0ZU1hcC50cyIsInNyYy9HYW1lQ29uZmlnLnRzIiwic3JjL01haW4udHMiLCJzcmMvTXkyREFycmF5LnRzIiwic3JjL1BvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1BBO0lBVUksZUFBbUIsVUFBZ0IsRUFBQyxRQUFjLEVBQUUsTUFBaUI7UUFKN0QsV0FBTSxHQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFNbEQsSUFBSSxDQUFDLFVBQVUsR0FBQyxVQUFVLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBQyxRQUFRLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksd0JBQVEsR0FBZjtRQUVJLElBQUksQ0FBQyxRQUFRLEdBQUMsSUFBSSxLQUFLLEVBQVMsQ0FBQztRQUNqQyxJQUFJLENBQUMsVUFBVSxHQUFDLElBQUksS0FBSyxFQUFTLENBQUM7UUFFbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXBDLE9BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUM1QjtZQUNJLE9BQU87WUFDUCxJQUFJLFFBQVEsR0FBUyxJQUFJLENBQUMsUUFBUSxD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QUFHLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRyxDQUFDLEVBQUcsRUFBQztZQUM3QyxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRyxDQUFDLEdBQUcsT0FBTyxFQUFHLENBQUMsRUFBRyxFQUFDO2dCQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNqQztTQUNKO0lBQ0wsQ0FBQztJQUNEOztPQUVHO0lBQ0ksNEJBQVEsR0FBZjtRQUNJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQWxFQSxBQWtFQyxJQUFBOzs7OztBQ3BFRDtJQWNJLGVBQW1CLE1BQWEsRUFBRSxNQUFhLEVBQUUsTUFBa0IsRUFBQyxVQUFrQjtRQVQvRSxNQUFDLEdBQVEsQ0FBQyxDQUFDO1FBQ1gsTUFBQyxHQUFRLENBQUMsQ0FBQztRQUNYLE1BQUMsR0FBUSxDQUFDLENBQUM7UUFFWCxnQkFBVyxHQUFPLElBQUksQ0FBQyxDQUFBLEtBQUs7UUFDNUIsZUFBVSxHQUFTLEtBQUssQ0FBQztRQUV6QixXQUFNLEdBQWEsSUFBSSxDQUFDO1FBSTNCLElBQUksQ0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDO1FBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUMsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FyQkEsQUFxQkMsSUFBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgUG9pbnQgZnJvbSBcIi4vUG9pbnRcIjtcclxuaW1wb3J0IE15MkRBcnJheSBmcm9tIFwiLi9NeTJEQXJyYXlcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFTdGFyICBcclxue1xyXG4gICAgcHJpdmF0ZSBtYXBBcnI6TXkyREFycmF5O1xyXG4gICAgcHJpdmF0ZSBzdGFydFBvaW50OlBvaW50O1xyXG4gICAgcHJpdmF0ZSBlbmRQb2ludDpQb2ludDtcclxuXHJcbiAgICBwcml2YXRlIGRpckFycjpudW1iZXJbXVtdPVtbMSwwXSxbMCwtMV0sWy0xLDBdLFswLDFdXTtcclxuICAgIHByaXZhdGUgb3Blbkxpc3Q6QXJyYXk8UG9pbnQ+O1xyXG4gICAgcHJpdmF0ZSBjbG9zZWRMaXN0OkFycmF5PFBvaW50PjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3Ioc3RhcnRQb2ludDpQb2ludCxlbmRQb2ludDpQb2ludCwgbWFwQXJyOiBNeTJEQXJyYXkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zdGFydFBvaW50PXN0YXJ0UG9pbnQ7XHJcbiAgICAgICAgdGhpcy5lbmRQb2ludD1lbmRQb2ludDtcclxuICAgICAgICB0aGlzLm1hcEFycj1tYXBBcnI7XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5p+l5om+6Lev5b6EXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBGaW5kUGF0aCgpOlBvaW50XHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5vcGVuTGlzdD1uZXcgQXJyYXk8UG9pbnQ+KCk7XHJcbiAgICAgICAgdGhpcy5jbG9zZWRMaXN0PW5ldyBBcnJheTxQb2ludD4oKTtcclxuXHJcbiAgICAgICAgdGhpcy5vcGVuTGlzdC5wdXNoKHRoaXMuc3RhcnRQb2ludCk7XHJcblxyXG4gICAgICAgIHdoaWxlKHRoaXMub3Blbkxpc3QubGVuZ3RoPjApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL+W+l+WIsOW9k+WJjeeCuVxyXG4gICAgICAgICAgICBsZXQgY3VyUG9pbnQ6IFBvaW50ID10aGlzLm9wZW5MaXN0WzBdOyAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGN1clBvaW50SW5kZXg9MDsgIFxyXG4gICAgICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMub3Blbkxpc3QubGVuZ3RoO2krKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoY3VyUG9pbnQuRj50aGlzLm9wZW5MaXN0W2ldLkYpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VyUG9pbnQ9dGhpcy5vcGVuTGlzdFtpXTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJQb2ludEluZGV4PWk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMub3Blbkxpc3Quc3BsaWNlKGN1clBvaW50SW5kZXgsMSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2VkTGlzdC5wdXNoKGN1clBvaW50KTtcclxuXHJcbiAgICAgICAgICAgIC8v5p+l5om+57uT5p2fXHJcbiAgICAgICAgICAgIGlmKGN1clBvaW50PT10aGlzLmVuZFBvaW50KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VyUG9pbnQ7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgLy/lvpfliLDlkajlm7Q05Liq54K5XHJcbiAgICAgICAgICAgIGxldCBhcm91bmRQb2ludHM9dGhpcy5HZXRBcm91bmRQb2ludHMoY3VyUG9pbnQpO1xyXG4gICAgICAgICAgICBmb3IobGV0IGk9MDtpPGFyb3VuZFBvaW50cy5sZW5ndGg7aSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL+manOeijeaIluWcqGNsb3NlZExpc3Tmg4XlhrVcclxuICAgICAgICAgICAgICAgIGlmKGFyb3VuZFBvaW50c1tpXS5pc09ic3RhY2xlfHx0aGlzLkNvbnRhaW4odGhpcy5jbG9zZWRMaXN0LGFyb3VuZFBvaW50c1tpXSkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGdDb3N0PXRoaXMuQ2FsRGlzdGFuY2UoY3VyUG9pbnQsYXJvdW5kUG9pbnRzW2ldKStjdXJQb2ludC5HO1xyXG4gICAgICAgICAgICAgICAgICAgIC8v5Zyob3Blbkxpc3Tph4zmiJbkuI3lnKhcclxuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5Db250YWluKHRoaXMub3Blbkxpc3QsYXJvdW5kUG9pbnRzW2ldKSB8fCBnQ29zdDxhcm91bmRQb2ludHNbaV0uRylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyb3VuZFBvaW50c1tpXS5HPWdDb3N0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcm91bmRQb2ludHNbaV0uSD10aGlzLkNhbERpc3RhbmNlKGFyb3VuZFBvaW50c1tpXSx0aGlzLmVuZFBvaW50KTs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyb3VuZFBvaW50c1tpXS5GPWdDb3N0K2Fyb3VuZFBvaW50c1tpXS5IO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcm91bmRQb2ludHNbaV0ucGFyZW50UG9pbnQ9Y3VyUG9pbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5Db250YWluKHRoaXMub3Blbkxpc3QsYXJvdW5kUG9pbnRzW2ldKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuTGlzdC5wdXNoKGFyb3VuZFBvaW50c1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b6X5Yiw5ZGo5Zu0NOS4queCuVxyXG4gICAgICogQHBhcmFtIGN1clBvaW50IFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIEdldEFyb3VuZFBvaW50cyhjdXJQb2ludDogUG9pbnQpOkFycmF5PFBvaW50PlxyXG4gICAge1xyXG4gICAgICAgIGxldCBhcm91bmRQb2ludHM6QXJyYXk8UG9pbnQ+PW5ldyBBcnJheTxQb2ludD4oKTtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuZGlyQXJyLmxlbmd0aDtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgeD1jdXJQb2ludC54SW5kZXggKyB0aGlzLmRpckFycltpXVswXTtcclxuICAgICAgICAgICAgbGV0IHk9Y3VyUG9pbnQueUluZGV4ICsgdGhpcy5kaXJBcnJbaV1bMV07XHJcbiAgICAgICAgICAgIGlmKHg+PTAgJiYgeDx0aGlzLm1hcEFyci5jb2x1bW5zICYmIHk+PTAgJiYgeTx0aGlzLm1hcEFyci5yb3dzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhcm91bmRQb2ludHMucHVzaCh0aGlzLm1hcEFyci5nZXRWYWx1ZSh5LHgpKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFyb3VuZFBvaW50cztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaVsOe7hOaYr+WQpuWMheWQq+WFg+e0oFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIENvbnRhaW4oYXJyOiBBcnJheTxQb2ludD4sdGFyZ2V0OlBvaW50KTpib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxhcnIubGVuZ3RoO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKGFycltpXT09dGFyZ2V0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvpfliLDkuKTkuKrngrnnmoTot53nprtcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBDYWxEaXN0YW5jZShwb2ludF8xOlBvaW50LHBvaW50XzI6UG9pbnQpOm51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyhwb2ludF8yLnhJbmRleC1wb2ludF8xLnhJbmRleCkrTWF0aC5hYnMocG9pbnRfMi55SW5kZXgtcG9pbnRfMS55SW5kZXgpO1xyXG4gICAgfSAgICBcclxufSIsImltcG9ydCBTcHJpdGUgPSBMYXlhLlNwcml0ZTtcclxuaW1wb3J0IFN0YWdlID0gTGF5YS5TdGFnZTtcclxuaW1wb3J0IFdlYkdMID0gTGF5YS5XZWJHTDtcclxuXHJcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9Qb2ludFwiO1xyXG5pbXBvcnQgTXkyREFycmF5IGZyb20gXCIuL015MkRBcnJheVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlTWFwIHtcclxuICAgIC8v55+p5b2i5a696auYKOWDj+e0oClcclxuICAgIHByaXZhdGUgcmVjdFdpZHRoOm51bWJlcj0xMDtcclxuICAgIHByaXZhdGUgcmVjdEhlaWdodDpudW1iZXI9MTA7XHJcblxyXG4gICAgLy/lnLDlm77lrr3pq5go5qC85pWwKVxyXG4gICAgcHJpdmF0ZSBtYXBXaWR0aDpudW1iZXI9MTAxO1xyXG4gICAgcHJpdmF0ZSBtYXBIZWlnaHQ6bnVtYmVyPTEwMDtcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG4gXHJcbiAgICAvKipcclxuICAgICAqIOeUu+efqeW9oiBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBEcmF3UmVjdCh4UG9zOiBudW1iZXIseVBvczogbnVtYmVyLHJlY3RDb2xvcjpzdHJpbmcpOiBTcHJpdGUgXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHNwOiBTcHJpdGUgPSBuZXcgU3ByaXRlKCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChzcCk7XHJcbiAgICAgICAgc3AuZ3JhcGhpY3MuZHJhd1JlY3QoeFBvcywgeVBvcywgdGhpcy5yZWN0V2lkdGgsdGhpcy5yZWN0SGVpZ2h0LCByZWN0Q29sb3IpOyAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzcDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuWcsOWbvlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgRHJhd01hcCgpOiBNeTJEQXJyYXlcclxuICAgIHtcclxuICAgICAgICBsZXQgcG9pbnRzQXJyOiBNeTJEQXJyYXk9bmV3IE15MkRBcnJheSh0aGlzLm1hcEhlaWdodCx0aGlzLm1hcFdpZHRoLG51bGwpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8PXRoaXMubWFwV2lkdGgtMTtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDtqPD10aGlzLm1hcEhlaWdodC0xO2orKylcclxuICAgICAgICAgICAgeyAgICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBQb2ludDpQb2ludDsgICAgICAgICBcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZihpJTI9PTB8fGo9PTB8fGo9PXRoaXMubWFwSGVpZ2h0LTEpXHJcbiAgICAgICAgICAgICAgICB7ICAgLy/lopkgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcFNwcml0ZTogU3ByaXRlID0gdGhpcy5EcmF3UmVjdChpKnRoaXMucmVjdFdpZHRoLGoqdGhpcy5yZWN0SGVpZ2h0LFwiIzAwMDAwMFwiKTsgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBQb2ludD1uZXcgUG9pbnQoaSxqLHRlbXBTcHJpdGUsdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIC8v6LevXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBTcHJpdGU6IFNwcml0ZSA9IHRoaXMuRHJhd1JlY3QoaSp0aGlzLnJlY3RXaWR0aCxqKnRoaXMucmVjdEhlaWdodCxcIiNGRkZGRkZcIik7ICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wUG9pbnQ9bmV3IFBvaW50KGksaix0ZW1wU3ByaXRlLGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBvaW50c0Fyci5zZXRWYWx1ZShqLGksdGVtcFBvaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/pl6hcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMubWFwV2lkdGg7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHJhbmRvbUNvdW50Om51bWJlcjsgXHJcbiAgICAgICAgICAgIGlmKGklMj09MCl7XHJcbiAgICAgICAgICAgICAgICByYW5kb21Db3VudD1NYXRoLmNlaWwoTWF0aC5yYW5kb20oKSoxMCk7XHJcbiAgICAgICAgICAgICAgICAvL2ZvcihsZXQgaj0wO2o8cmFuZG9tQ291bnQ7aisrKVxyXG4gICAgICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJhbmRvbVBvczpudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqdGhpcy5tYXBIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJhbmRvbVBvcz09MClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmRvbVBvcysrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihyYW5kb21Qb3M9PXRoaXMubWFwSGVpZ2h0LTEpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5kb21Qb3MtLTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzQXJyLmdldFZhbHVlKHJhbmRvbVBvcyxpKS5zcHJpdGU9dGhpcy5EcmF3UmVjdChpKnRoaXMucmVjdFdpZHRoLHJhbmRvbVBvcyp0aGlzLnJlY3RIZWlnaHQsXCIjRkZGRkZGXCIpOyAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzQXJyLmdldFZhbHVlKHJhbmRvbVBvcyxpKS5pc09ic3RhY2xlPWZhbHNlOyBcclxuICAgICAgICAgICAgICAgIC8vfSAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwb2ludHNBcnI7XHJcbiAgICB9XHJcbn0iLCIvKipUaGlzIGNsYXNzIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IExheWFBaXJJREUsIHBsZWFzZSBkbyBub3QgbWFrZSBhbnkgbW9kaWZpY2F0aW9ucy4gKi9cclxuXHJcbi8qXHJcbiog5ri45oiP5Yid5aeL5YyW6YWN572uO1xyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgc3RhdGljIHdpZHRoOm51bWJlcj0xNjAwO1xyXG4gICAgc3RhdGljIGhlaWdodDpudW1iZXI9MTIwMDtcclxuICAgIHN0YXRpYyBzY2FsZU1vZGU6c3RyaW5nPVwiZml4ZWR3aWR0aFwiO1xyXG4gICAgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiO1xyXG4gICAgc3RhdGljIGFsaWduVjpzdHJpbmc9XCJ0b3BcIjtcclxuICAgIHN0YXRpYyBhbGlnbkg6c3RyaW5nPVwibGVmdFwiO1xyXG4gICAgc3RhdGljIHN0YXJ0U2NlbmU6YW55PVwiXCI7XHJcbiAgICBzdGF0aWMgc2NlbmVSb290OnN0cmluZz1cIlwiO1xyXG4gICAgc3RhdGljIGRlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgc3RhdDpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHBoeXNpY3NEZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIGV4cG9ydFNjZW5lVG9Kc29uOmJvb2xlYW49dHJ1ZTtcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgICAgICB2YXIgcmVnOiBGdW5jdGlvbiA9IExheWEuQ2xhc3NVdGlscy5yZWdDbGFzcztcclxuXHJcbiAgICB9XHJcbn1cclxuR2FtZUNvbmZpZy5pbml0KCk7IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgTXkyREFycmF5IGZyb20gXCIuL015MkRBcnJheVwiO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vUG9pbnRcIjtcclxuaW1wb3J0IENyZWF0ZU1hcCBmcm9tIFwiLi9DcmVhdGVNYXBcIjtcclxuaW1wb3J0IEFTdGFyIGZyb20gXCIuL0FTdGFyXCI7XHJcbmltcG9ydCBTcHJpdGUgPSBMYXlhLlNwcml0ZTtcclxuXHJcbmNsYXNzIE1haW4ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Ly/moLnmja5JREXorr7nva7liJ3lp4vljJblvJXmk45cdFx0XHJcblx0XHRpZiAod2luZG93W1wiTGF5YTNEXCJdKSBMYXlhM0QuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCk7XHJcblx0XHRlbHNlIExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdhbWVDb25maWcuc2NhbGVNb2RlO1xyXG5cdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2FtZUNvbmZpZy5zY3JlZW5Nb2RlO1xyXG5cdFx0TGF5YS5zdGFnZS5hbGlnblYgPSBHYW1lQ29uZmlnLmFsaWduVjtcclxuXHRcdExheWEuc3RhZ2UuYWxpZ25IID0gR2FtZUNvbmZpZy5hbGlnbkg7XHJcblx0XHRMYXlhLnN0YWdlLmJnQ29sb3I9XCIjQzZFMkZGXCI7XHJcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcblx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XHJcblxyXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcblx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cclxuXHRcdC8v5Yib5bu65Zyw5Zu+XHJcblx0XHRsZXQgcG9pbnRzQXJyOiBNeTJEQXJyYXkgPW5ldyBDcmVhdGVNYXAoKS5EcmF3TWFwKCk7XHJcblx0XHRcclxuXHRcdC8v6Lev5b6E5p+l5om+XHJcblx0XHRsZXQgc3RhclBvaW50OiBQb2ludDtcclxuXHRcdGxldCBlbmRQb2ludDogUG9pbnQ7XHJcblxyXG5cdFx0Zm9yKGxldCBpPTA7aTxwb2ludHNBcnIucm93cztpKyspLy/mib7otbfngrlcclxuXHRcdHtcclxuXHRcdFx0aWYocG9pbnRzQXJyLmdldFZhbHVlKGksMCkuaXNPYnN0YWNsZT09ZmFsc2UpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzdGFyUG9pbnQ9cG9pbnRzQXJyLmdldFZhbHVlKGksMCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IobGV0IGk9MDtpPHBvaW50c0Fyci5yb3dzO2krKykvL+aJvue7iOeCuVxyXG5cdFx0e1xyXG5cdFx0XHRpZihwb2ludHNBcnIuZ2V0VmFsdWUoaSxwb2ludHNBcnIuY29sdW1ucy0xKS5pc09ic3RhY2xlPT1mYWxzZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGVuZFBvaW50PXBvaW50c0Fyci5nZXRWYWx1ZShpLHBvaW50c0Fyci5jb2x1bW5zLTEpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGFTdGFyOkFTdGFyPW5ldyBBU3RhcihzdGFyUG9pbnQsZW5kUG9pbnQscG9pbnRzQXJyKTtcclxuXHRcdGxldCByZXNQb2ludD1hU3Rhci5GaW5kUGF0aCgpO1xyXG5cclxuXHRcdHdoaWxlKHJlc1BvaW50IT1udWxsKVxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLkRyYXdSZWN0KHJlc1BvaW50LnhJbmRleCoxMCxyZXNQb2ludC55SW5kZXgqMTAsXCIjRUUyQzJDXCIpXHJcblx0XHRcdHJlc1BvaW50PXJlc1BvaW50LnBhcmVudFBvaW50O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcbiAgICAgKiDnlLvnn6nlvaIgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgRHJhd1JlY3QoeFBvczogbnVtYmVyLHlQb3M6IG51bWJlcixyZWN0Q29sb3I6c3RyaW5nKTogU3ByaXRlIFxyXG4gICAge1xyXG4gICAgICAgIGxldCBzcDogU3ByaXRlID0gbmV3IFNwcml0ZSgpO1xyXG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoc3ApO1xyXG4gICAgICAgIHNwLmdyYXBoaWNzLmRyYXdSZWN0KHhQb3MsIHlQb3MsIDEwLDEwLCByZWN0Q29sb3IpOyAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzcDtcclxuICAgIH1cclxufVxyXG5cclxuLy/mv4DmtLvlkK/liqjnsbtcclxubmV3IE1haW4oKTtcclxuIiwiaW1wb3J0IFBvaW50IGZyb20gXCIuL1BvaW50XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNeTJEQXJyYXl7XHJcbiAgICBwcml2YXRlIG15MkRBcnJheSA6IEFycmF5PEFycmF5PFBvaW50Pj4gPSAgbmV3IEFycmF5PEFycmF5PFBvaW50Pj4oKTtcclxuICAgIHB1YmxpYyByb3dzIDpudW1iZXI7XHJcbiAgICBwdWJsaWMgY29sdW1ucyA6bnVtYmVyO1xyXG4gXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMluaVsOe7hFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3Iocm93czpudW1iZXIsY29sdW1uczpudW1iZXIsdmFsdWU6UG9pbnQpe1xyXG4gICAgICAgIHRoaXMucm93cyA9IHJvd3M7XHJcbiAgICAgICAgdGhpcy5jb2x1bW5zID0gY29sdW1ucztcclxuICAgICAgICB0aGlzLmluaXRSb3dzKHJvd3MpO1xyXG4gICAgICAgIHRoaXMuaW5pdENvbHVtbnMoY29sdW1ucyx2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlj5bmlbDnu4TkuK3nmoTlgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFZhbHVlKHJvd3M6bnVtYmVyLGNvbHVtbnM6bnVtYmVyKTpQb2ludHtcclxuICAgICAgICBpZihyb3dzIDwgMCB8fCBjb2x1bW5zIDwgMCB8fCByb3dzID49IHRoaXMucm93cyB8fCBjb2x1bW5zID49IHRoaXMuY29sdW1ucyl7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5teTJEQXJyYXlbcm93c11bY29sdW1uc107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuLrmlbDnu4TotYvlgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFZhbHVlKHJvd3M6bnVtYmVyLGNvbHVtbnM6bnVtYmVyLHZhbHVlOlBvaW50KTp2b2lke1xyXG4gICAgICAgIGlmKHJvd3MgPCAwIHx8IGNvbHVtbnMgPCAwIHx8IHJvd3MgPj0gdGhpcy5yb3dzIHx8IGNvbHVtbnMgPj0gdGhpcy5jb2x1bW5zKXtcclxuICAgICAgICAgICAgcmV0dXJuIDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5teTJEQXJyYXlbcm93c11bY29sdW1uc10gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMluihjOaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluaXRSb3dzKHJvd3M6bnVtYmVyKTp2b2lke1xyXG4gICAgICAgIGlmKHJvd3MgPCAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpID0gMCA7IGkgPCByb3dzIDsgaSArKyl7XHJcbiAgICAgICAgICAgIHRoaXMubXkyREFycmF5LnB1c2gobmV3IEFycmF5PFBvaW50PigpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyW5YiX5pWwXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdENvbHVtbnMoY29sdW1uczpudW1iZXIsdmFsdWU6UG9pbnQpOnZvaWR7XHJcbiAgICAgICAgaWYoY29sdW1ucyA8IDEpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaSA9IDAgOyBpIDwgdGhpcy5teTJEQXJyYXkubGVuZ3RoIDsgaSArKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDAgOyBqIDwgY29sdW1ucyA7IGogKyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5teTJEQXJyYXlbaV0ucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaVsOe7hFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0QXJyYXkoKTpBcnJheTxBcnJheTxQb2ludD4+e1xyXG4gICAgICAgIHJldHVybiB0aGlzLm15MkRBcnJheTtcclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvaW50IFxyXG57ICAgIFxyXG4gICAgcHVibGljIHhJbmRleDpudW1iZXI7Ly/ooYzmlbBcclxuICAgIHB1YmxpYyB5SW5kZXg6bnVtYmVyOy8v5YiX5pWwXHJcblxyXG4gICAgcHVibGljIEY6bnVtYmVyPTA7XHJcbiAgICBwdWJsaWMgRzpudW1iZXI9MDtcclxuICAgIHB1YmxpYyBIOm51bWJlcj0wO1xyXG5cclxuICAgIHB1YmxpYyBwYXJlbnRQb2ludDpQb2ludD1udWxsOy8v54i26IqC54K5XHJcbiAgICBwdWJsaWMgaXNPYnN0YWNsZTpib29sZWFuPWZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBzcHJpdGU6TGF5YS5TcHJpdGU9bnVsbDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoeEluZGV4Om51bWJlciwgeUluZGV4Om51bWJlciwgc3ByaXRlOkxheWEuU3ByaXRlLGlzT2JzdGFjbGU6Ym9vbGVhbikgXHJcbiAgICB7ICBcclxuICAgICAgICB0aGlzLnhJbmRleD14SW5kZXg7XHJcbiAgICAgICAgdGhpcy55SW5kZXg9eUluZGV4O1xyXG4gICAgICAgIHRoaXMuc3ByaXRlPXNwcml0ZTtcclxuICAgICAgICB0aGlzLmlzT2JzdGFjbGU9aXNPYnN0YWNsZTtcclxuICAgIH1cclxufSJdfQ==
