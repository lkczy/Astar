export default class Point 
{    
    public xIndex:number;//行数
    public yIndex:number;//列数

    public F:number=0;
    public G:number=0;
    public H:number=0;

    public parentPoint:Point=null;//父节点
    public isObstacle:boolean=false;

    public sprite:Laya.Sprite=null;

    public constructor(xIndex:number, yIndex:number, sprite:Laya.Sprite,isObstacle:boolean) 
    {  
        this.xIndex=xIndex;
        this.yIndex=yIndex;
        this.sprite=sprite;
        this.isObstacle=isObstacle;
    }
}