

 


class Goods{
    constructor(id,attr) {
        this.Id = parseInt(  id )
        this.attr = attr
    }

    get Num()
    {
        return parseInt(  this.attr.GetValue("Num") )
    }

    get ShopId()
    {
         return parseInt(  this.attr.GetValue("ShopId") )
    }

    get SubType()
    {
         return parseInt(  this.attr.GetValue("SubType") )
    }

    //有效期 -1表示永久有效
    get InvalidTime()
    {
         return  this.attr.GetValue("itime")
    }

    
    get InvalidDate()
    {
        var iTime = this.InvalidTime
        var ss = (parseInt(iTime%100));iTime/=100;

        var mm = (parseInt(iTime%100));iTime/=100;

        var hh = (parseInt(iTime%100));iTime/=100;
 
        var day = (parseInt(iTime%100));iTime/=100;

        var month = (parseInt(iTime%100));iTime/=100;
 
        var year = (parseInt(iTime) );

        var dateStr = '{0}/{1}/{2} {3}:{4}:{5}'.format(
            year,month,day,
            hh,mm,ss
        )
        var dt=new Date(dateStr) 
        return dt
    }
    
    //有效期 小时
    get InvalidHours()
    {
        var now = new Date()
       
        return parseInt(Math.abs(this.InvalidDate-now)/1000/60/60)// /24
    }
}

 

class _Backpack
{
    //绑定同步对象
    _BindSync(obj) { this.SyncObj = obj }

    get _BackpackList()
    {
        return this.SyncObj.GetChild("Goods",false)
    }

    get IsVip(){ 
        var gd = this.VipGoods 
        return gd?true:false
    }

    //点击过的广告id队列
    get AD() {
      if (this.SyncObj == null) return [];
      var strArray = this.SyncObj.GetValue("AD").split(';')
      var re = []
      for(var i=0;i<strArray.length;i++)
      {
        re.push(  parseInt(strArray[i]) )
      }
      return re
    }

    //广告点击总数
    get ADClick(){
      return this.SyncObj == null ? 0 : parseInt(this.SyncObj.GetValue("ADClick")) 
    }

    get VipGoods() { return this.GetGoods(13,1) }

    //获取参数
    GetParam(subType)
    {
      var paramNode = this.SyncObj.GetChild("Params", false)
      if(paramNode==null) return null
      return paramNode.GetValue(subType)
    }

    //分享给个人的次数
    get ShareGerenNum()
    { 
      return parseInt(this.GetParam(201))
    }

    //分享给个人的次数
    get ShareQunNum() {
      return parseInt(this.GetParam(202))
    }


    //返回同指定类型的所有道具
    GetGoodsList(subType)
    {
        var re = []
        if(!this._BackpackList) return null//没有任何道具    

        var now=new Date()
        this._BackpackList.Foreach(
            (id,attr)=>{

                console.log("GetGoodsList subtype",attr.GetValue("SubType"))

                if(
                parseInt(attr.GetValue("SubType"))==subType
                )
                {
                    
                    var gd = new Goods(id,attr)
                    if(now<gd.InvalidDate) re.push(gd)
                }
            }
        )
        return re 
    }

    //返回指定类型的第一个道具
    GetFirstGoods(subType)
    {
        var gdList = this.GetGoodsList(subType)
        if (!gdList||gdList.length<1) return null

        return gdList[0]
    }

    GetGoods(subType,shopId)
    {
      if(!this._BackpackList) return null//没有任何道具  
      var re = null
      this._BackpackList.Foreach(
        (id,attr)=>{
            if(
             re==null&&
             parseInt(attr.GetValue("SubType"))==subType&&
             parseInt(attr.GetValue("ShopId"))==shopId
            )
            {
                re = new Goods(id,attr)
            }
        }
      )
 
      //判断道具是否已经过期
      if(re&&re.InvalidTime>0)
      { 
          var now=new Date()
          if(now>re.InvalidDate) 
          {  
              re = null;//道具已经过期了
          }
      }

      // console.log("GetGoods",subType,shopId,re)

      return re
    }

    Foreach(jsFun)
    {
      if(!this._BackpackList) return//没有任何道具
      
      this._BackpackList.Foreach(
        (id,attr)=>{
            jsFun(new Goods(id,attr))
        }
      )
    }  
}




module.exports = { _Backpack }