export default class Node{//节点

    public xIndex:number;
    public yIndex:number;//行与列
    public F:number;
    public G:number;
    public H:number;

    public parentNode:Node=null;//父节点
    public isBarrier:boolean=false;//是否是障碍，false为可通行
    public rectSprite:Laya.Sprite=null;//对应的方块

    
    public constructor(xIndex:number,yIndex:number,isBarrier:boolean,rectSprite:Laya.Sprite){
        this.xIndex=xIndex;
        this.yIndex=yIndex;
        this.isBarrier=isBarrier;
        this.rectSprite=rectSprite;
    }
}