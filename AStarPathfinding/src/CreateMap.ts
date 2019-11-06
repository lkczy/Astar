import Sprite = Laya.Sprite;
import Stage = Laya.Stage;
import WebGL = Laya.WebGL;

import Point from "./Point";
import My2DArray from "./My2DArray";

export default class CreateMap {
    //矩形宽高(像素)
    private rectWidth:number=10;
    private rectHeight:number=10;

    //地图宽高(格数)
    private mapWidth:number=101;
    private mapHeight:number=100;
    constructor(){}
 
    /**
     * 画矩形 
     */
    private DrawRect(xPos: number,yPos: number,rectColor:string): Sprite 
    {
        let sp: Sprite = new Sprite();
        Laya.stage.addChild(sp);
        sp.graphics.drawRect(xPos, yPos, this.rectWidth,this.rectHeight, rectColor);         
        return sp;
    }

    /**
     * 创建地图
     */
    public DrawMap(): My2DArray
    {
        let pointsArr: My2DArray=new My2DArray(this.mapHeight,this.mapWidth,null);
        for(let i=0;i<=this.mapWidth-1;i++)
        {
            for(let j=0;j<=this.mapHeight-1;j++)
            {      
                let tempPoint:Point;         
               
                if(i%2==0||j==0||j==this.mapHeight-1)
                {   //墙         
                    let tempSprite: Sprite = this.DrawRect(i*this.rectWidth,j*this.rectHeight,"#000000");     
                    tempPoint=new Point(i,j,tempSprite,true);
                }
                else{
                    //路
                    let tempSprite: Sprite = this.DrawRect(i*this.rectWidth,j*this.rectHeight,"#FFFFFF");     
                    tempPoint=new Point(i,j,tempSprite,false);
                }
                pointsArr.setValue(j,i,tempPoint);
            }
        }

        //门
        for(let i=0;i<this.mapWidth;i++)
        {
            let randomCount:number; 
            if(i%2==0){
                randomCount=Math.ceil(Math.random()*10);
                //for(let j=0;j<randomCount;j++)
                //{
                    let randomPos:number = Math.floor(Math.random()*this.mapHeight);
                    if(randomPos==0)
                    {
                        randomPos++;
                    }
                    if(randomPos==this.mapHeight-1)
                    {
                        randomPos--;
                    }
                    pointsArr.getValue(randomPos,i).sprite=this.DrawRect(i*this.rectWidth,randomPos*this.rectHeight,"#FFFFFF");     
                    pointsArr.getValue(randomPos,i).isObstacle=false; 
                //}  
            }
        }

        return pointsArr;
    }
}