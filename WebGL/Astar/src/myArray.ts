import Node from "./Node"

export default class myArray{
    private myArray:Array<Array<Node>>=new Array<Array<Node>>();//new一个二维数组
    public rows:number;
    public cols:number;

    //数组初始化
    public constructor(rows:number,cols:number,value:Node){
        this.rows=rows;
        this.cols=cols;
        this.initRows(rows);
        this.initCols(cols,value);
    }

    //取数组中的值
    public getValue(rows:number,cols:number):Node{
        if(rows<0||cols<0||rows>this.rows||cols>this.cols){
            return null;
        }
        return this.myArray[rows][cols];
    }

    //数组赋值
    public setValue(rows:number,cols:number,value:Node):void{
        if(rows<0||cols<0||rows>this.rows||cols>this.cols){
            return;
        }
        this.myArray[rows][cols]=value;
    }

    //获取数组
    public getArray():Array<Array<Node>>{
        return this.myArray;
    }

    //行初始化
    public initRows(rows:number):void{   
        if(rows<1){
            return;
        }
        for(let i=0;i<rows;i++){
            this.myArray.push(new Array<Node>());
        }
    }

    //列初始化
    public initCols(cols:number,value:Node):void{
        if(cols<1){
            return;
        }
        for(let i=0;i<this.myArray.length;i++){
            for(let j=0;j<cols;j++){
                this.myArray[i].push(value);
            }
        }
    }



}