import Sprite=Laya.Sprite
import Stage=Laya.Stage
import WebGL=Laya.WebGL

import Node from "./Node"
import myArray from "./myArray"


export default class Map{
    //方块宽高(像素)
    private rectWidth:number=10;
    private rectHeight:number=10;

    //地图宽高（格）
    private mapWidth:number=101;
    private mapHeight:number=100;


    //创建方块
    private DrawRect(xPos:number,yPos:number,rectColor:string):Sprite
    {
        let sp:Sprite=new Sprite();
        Laya.stage.addChild(sp);
        sp.graphics.drawRect(xPos,yPos,this.rectWidth,this.rectHeight,rectColor);
        return sp;
    }

    //创建地图
    public DrawMap():myArray{
        let nodeArr:myArray=new myArray(this.mapWidth,this.mapHeight,null);

        for(let i=0;i<=this.mapWidth-1;i++){
            for(let j=0;j<=this.mapHeight-1;j++){
                let tempNode:Node;//声明一个临时Node类对象
                if(i%2==0||j==0||j==this.mapHeight-1){//墙
                    let tempSprite:Sprite=this.DrawRect(i*this.rectWidth,j*this.rectHeight,"#000000");
                    tempNode=new Node(i,j,true,tempSprite);
                }
                else{//路
                    let tempSprite:Sprite=this.DrawRect(i*this.rectWidth,j*this.rectHeight,"#ffffff");
                    tempNode=new Node(i,j,false,tempSprite);
                }
                nodeArr.setValue(j,i,tempNode);
            }
        }

    //创建门
    for(let i=0;i<this.mapWidth;i++){
        let randomPos:number=Math.floor(Math.random()*this.mapHeight);
        if(randomPos==0)
        {randomPos++;}
        if(randomPos==this.mapHeight-1)
        {randomPos--;}
        nodeArr.getValue(randomPos,i).rectSprite=this.DrawRect(i*this.rectWidth,randomPos*this.rectHeight,"#ffffff");
        nodeArr.getValue(randomPos,i).isBarrier=false;
        
    }


    return nodeArr;
    }
  
}