import GameConfig from "./GameConfig";
import My2DArray from "./My2DArray";
import Point from "./Point";
import CreateMap from "./CreateMap";
import AStar from "./AStar";
import Sprite = Laya.Sprite;

class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		Laya.stage.bgColor="#C6E2FF";
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		//创建地图
		let pointsArr: My2DArray =new CreateMap().DrawMap();
		
		//路径查找
		let starPoint: Point;
		let endPoint: Point;

		for(let i=0;i<pointsArr.rows;i++)//找起点
		{
			if(pointsArr.getValue(i,0).isObstacle==false)
			{
				starPoint=pointsArr.getValue(i,0);
				break;
			}
		}

		for(let i=0;i<pointsArr.rows;i++)//找终点
		{
			if(pointsArr.getValue(i,pointsArr.columns-1).isObstacle==false)
			{
				endPoint=pointsArr.getValue(i,pointsArr.columns-1);
				break;
			}
		}

		let aStar:AStar=new AStar(starPoint,endPoint,pointsArr);
		let resPoint=aStar.FindPath();

		while(resPoint!=null)
		{
			this.DrawRect(resPoint.xIndex*10,resPoint.yIndex*10,"#EE2C2C")
			resPoint=resPoint.parentPoint;
		}
	}

	/**
     * 画矩形 
     */
    private DrawRect(xPos: number,yPos: number,rectColor:string): Sprite 
    {
        let sp: Sprite = new Sprite();
        Laya.stage.addChild(sp);
        sp.graphics.drawRect(xPos, yPos, 10,10, rectColor);         
        return sp;
    }
}

//激活启动类
new Main();
