import Point from "./Point";
import My2DArray from "./My2DArray";

export default class AStar  
{
    private mapArr:My2DArray;
    private startPoint:Point;
    private endPoint:Point;

    private dirArr:number[][]=[[1,0],[0,-1],[-1,0],[0,1]];
    private openList:Array<Point>;
    private closedList:Array<Point>;

    public constructor(startPoint:Point,endPoint:Point, mapArr: My2DArray)
    {
        this.startPoint=startPoint;
        this.endPoint=endPoint;
        this.mapArr=mapArr;
    } 

    /**
     * 查找路径
     */
    public FindPath():Point
    {
        this.openList=new Array<Point>();
        this.closedList=new Array<Point>();

        this.openList.push(this.startPoint);

        while(this.openList.length>0)
        {
            //得到当前点
            let curPoint: Point =this.openList[0];          
            let curPointIndex=0;  
            for(let i=0;i<this.openList.length;i++)
            {
                if(curPoint.F>this.openList[i].F)
                {
                    curPoint=this.openList[i];
                    curPointIndex=i;
                }
            }

            this.openList.splice(curPointIndex,1);
            this.closedList.push(curPoint);

            //查找结束
            if(curPoint==this.endPoint)
            {
                return curPoint;
            }           

            //得到周围4个点
            let aroundPoints=this.GetAroundPoints(curPoint);
            for(let i=0;i<aroundPoints.length;i++)
            {
                //障碍或在closedList情况
                if(aroundPoints[i].isObstacle||this.Contain(this.closedList,aroundPoints[i]))
                {
                    continue;
                }
                else
                {
                    let gCost=this.CalDistance(curPoint,aroundPoints[i])+curPoint.G;
                    //在openList里或不在
                    if(!this.Contain(this.openList,aroundPoints[i]) || gCost<aroundPoints[i].G)
                    {
                        aroundPoints[i].G=gCost;
                        aroundPoints[i].H=this.CalDistance(aroundPoints[i],this.endPoint);;
                        aroundPoints[i].F=gCost+aroundPoints[i].H;
                        aroundPoints[i].parentPoint=curPoint;

                        if(!this.Contain(this.openList,aroundPoints[i]))
                        {
                            this.openList.push(aroundPoints[i]);
                        }
                    }
                }
            }

        }
        return null;
    }

    /**
     * 得到周围4个点
     * @param curPoint 
     */
    private GetAroundPoints(curPoint: Point):Array<Point>
    {
        let aroundPoints:Array<Point>=new Array<Point>();
        for(let i=0;i<this.dirArr.length;i++)
        {
            let x=curPoint.xIndex + this.dirArr[i][0];
            let y=curPoint.yIndex + this.dirArr[i][1];
            if(x>=0 && x<this.mapArr.columns && y>=0 && y<this.mapArr.rows)
            {
                aroundPoints.push(this.mapArr.getValue(y,x));
            }          
        }
        return aroundPoints;
    }

    /**
     * 数组是否包含元素
     */
    private Contain(arr: Array<Point>,target:Point):boolean
    {
        for(let i=0;i<arr.length;i++)
        {
            if(arr[i]==target)
            {
                return true;
            }
        }
        return false;
    }

    /**
     * 得到两个点的距离
     */
    private CalDistance(point_1:Point,point_2:Point):number
    {
        return Math.abs(point_2.xIndex-point_1.xIndex)+Math.abs(point_2.yIndex-point_1.yIndex);
    }    
}