import GameConfig from "./GameConfig";
class Main {

	private tempArr:Array<number>;

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
		Laya.stage.bgColor="#000000";

		//生成数组
		let arr1:Array<number>=new Array<number>(1000);
		let arr2:Array<number>=new Array<number>(1000);

		//将生成的随机数push进两个数组
		this.tempArr=new Array<number>(10001);
		for(let i=0;i<1000;i++){
			arr1[i]=this.createrRandomNumber();
		}
		this.tempArr=new Array<number>(10001);
		for(let i=0;i<1000;i++){
			arr2[i]=this.createrRandomNumber();
		}

		let arr3:Array<number>=this.getIntersection(arr1,arr2);		

		//打印到屏幕
		let printTxt:Laya.Text=new Laya.Text();
		Laya.stage.addChild(printTxt);
		printTxt.pos(50,10);
		printTxt.fontSize=25;




	}

	
	//生成随机数
	private createrRandomNumber():number{
		let randomNum:number;
		while(true){
			randomNum=Math.round(Math.random()*10000);
			if(this.tempArr[randomNum]==undefined){
				this.tempArr[randomNum]=randomNum;
				break;
			}
		}
		return randomNum;
	}
	

	//对比两个数组
	private getIntersection(arr1:Array<number>,arr2:Array<number>):Array<number>{
		let arr3:Array<number>=new Array<number>();
		let map:{[key:number]:number}={};
		for(let i=0;i<arr1.length;i++){
			map[arr1[i]]=1;
		}
		for(let i=0;i<arr2.length;i++){
			if(map[arr2[i]]>0){
				map[arr2[i]]=0;
				arr3.push(arr2[i]);
			}
		}
		return	arr3;
	}



}
//激活启动类
new Main();
