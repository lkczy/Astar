import Point from "./Point";

export default class My2DArray{
    private my2DArray : Array<Array<Point>> =  new Array<Array<Point>>();
    public rows :number;
    public columns :number;
 
    /**
     * 初始化数组
     */
    public constructor(rows:number,columns:number,value:Point){
        this.rows = rows;
        this.columns = columns;
        this.initRows(rows);
        this.initColumns(columns,value);
    }

    /**
     * 取数组中的值
     */
    public getValue(rows:number,columns:number):Point{
        if(rows < 0 || columns < 0 || rows >= this.rows || columns >= this.columns){
            return null;
        }
        return this.my2DArray[rows][columns];
    }

    /**
     * 为数组赋值
     */
    public setValue(rows:number,columns:number,value:Point):void{
        if(rows < 0 || columns < 0 || rows >= this.rows || columns >= this.columns){
            return ;
        }
        this.my2DArray[rows][columns] = value;
    }

    /**
     * 初始化行数
     */
    private initRows(rows:number):void{
        if(rows < 1) {
            return;
        }
        for(let i = 0 ; i < rows ; i ++){
            this.my2DArray.push(new Array<Point>());
        }
    }
    
    /**
     * 初始化列数
     */
    private initColumns(columns:number,value:Point):void{
        if(columns < 1){
            return;
        }
        for(let i = 0 ; i < this.my2DArray.length ; i ++){
            for(let j = 0 ; j < columns ; j ++){
                this.my2DArray[i].push(value);
            }
        }
    }
    /**
     * 获取数组
     */
    public getArray():Array<Array<Point>>{
        return this.my2DArray;
    }
}