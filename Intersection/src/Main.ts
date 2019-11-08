import GameConfig from "./GameConfig";
class Main {

	private tempArr: Array<number>;

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
		Laya.stage.bgColor = "#000000";

		//生成数组
		let arr1: Array<number> = new Array<number>();
		let arr2: Array<number> = new Array<number>();

		//将生成的随机数push进两个数组
		this.tempArr = this.summonNumArr();
		arr1 = this.createRandomNum(this.tempArr);

		this.tempArr = this.summonNumArr();
		arr2 = this.createRandomNum(this.tempArr);


		let arr3: Array<number> = this.getIntersection(arr1, arr2);

		//打印到屏幕
		let printTxt: Laya.Text = new Laya.Text();
		Laya.stage.addChild(printTxt);
		printTxt.pos(50, 10);
		printTxt.fontSize = 25;
		printTxt.color = "#0fffff";

		let count: number = 0;
		let maxDisplayCountForRow = 12;
		for (let element of arr3) {
			if (count < maxDisplayCountForRow) {
				printTxt.text += element.toString() + " ";
				count++;
			}
			else {
				count = 0;
				printTxt.text += element.toString() + "\n";

			}
		}
	}


	//生成一个有10000个数的数组
	private summonNumArr(): Array<number> {
		let numArr = new Array<number>();
		let numArrLength = 10000;
		for (let i = 0; i < numArrLength; i++) {
			numArr.push(i);
		}
		return numArr;
	}

	//洗牌算法
	private createRandomNum(numArr: Array<number>): Array<number> {
		for (let i = numArr.length - 1; i > 0; i--) {//打乱导入数组的顺序
			let j: number = Math.floor(Math.random() * (i + 1));
			let temp = numArr[i];
			numArr[i] = numArr[j];
			numArr[j] = temp;
		}

		let returnArrLength = 1000;
		let randomArr = new Array<number>();
		for (let i = 0; i < returnArrLength; i++) {
			randomArr[i] = numArr[i];
		}
		return randomArr;
	}


	//对比两个数组
	private getIntersection(arr1: Array<number>, arr2: Array<number>): Array<number> {
		let arr3: Array<number> = new Array<number>();
		let queryData = new Array<number>(10000);
		let map: { [key: number]: number } = {};
		for (let i = 0; i < arr1.length; i++) {
			map[arr1[i]] = 1;
			queryData[i] = 1;
		}
		for (let i = 0; i < arr2.length; i++) {
			if (map[arr2[i]] > 0) {
				map[arr2[i]] = 0;
				arr3.push(arr2[i]);
			}
		}
		return arr3;
	}
}
//激活启动类
new Main();
