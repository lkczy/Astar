
/*
这个文件用来存放用户相关的数据
*/


/* 用户信息说明 
nickName	  String	  用户昵称
avatarUrl	  String	  用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
gender	    String	  用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
city	      String	  用户所在城市
province	  String	  用户所在省份
country	    String	  用户所在国家
language	  String	  用户的语言，简体中文为zh_CN
*/
//export let UserInfo = []
import { wxAccount } from '../dati_comm/libs/network/wxAccount';  
import { ServerList } from "../dati_comm/libs/network/NSServerList";
import { I32BoolValue } from "../dati_comm/libs/core/I32BoolValue";
import { _Backpack } from "../dati_comm/modules/Backpack";
import { OOSyncClient } from "../dati_comm/libs/oosync/OOSyncClient"
import * as gcfg from "../gamecfg"
import * as LCData from "./LocalData"


//import { SDataUserFrame } from "../dati_comm/sdata/SDataUserFrame";
 

class _Player { 
  //获取用户性别
  Sex() { return this.SyncObj==null?1:this.SyncObj.GetValue("Sex") }
  
  //获取用户昵称
  Name() {
    //return !this._wxUserInfoValid()?"张三七个字很长": wxAccount.userInfo.userInfo.nickName
    //return this.SyncObj==null ? "???" : this.SyncObj.GetValue("Name")
    return LCData.Get(LCData.ParamName.NICK_NAME)
    //LCData.Set(LCData.ParamName.AVATOR_URL, info.userInfo.avatarUrl)  
 }//this.SyncObj.GetValue("Name")


  _wxUserInfoValid()
  {
    return wxAccount.userInfo != null && wxAccount.userInfo.userInfo != null
  }

  //在线人数
  Online(){
    return this.SyncObj ? this.SyncObj.GetValue("ol") :"???"
  }

  //获取金币数量
  Money() { 
     return this.SyncObj?parseInt( this.SyncObj.GetValue("Money")):0;
  }

  get IsDebug() {
    return this.SyncObj == null ? false : (parseInt(this.SyncObj.GetValue("dbg")) == 1)
  }


  Xuefen() {
    if(this.SyncObj == null)   return 0
    var xfstr = this.SyncObj.GetChild("Params",false).GetValue(gcfg.subtype_jifen)
    if(xfstr==null) return 0
     return    parseInt(xfstr ) 
  }
  
  // 当天时间区间内 已经 成功分享的次数（初始为 0）
  SharedTimes(){
    return this.SyncObj == null ? 1 : parseInt(this.SyncObj.GetValue("Sharecount") )
  }  

  get Sharelimit()
  {
    return this.SyncObj == null ? 1 : parseInt(this.SyncObj.GetValue("Sharelimit")) 
  }

  //获取用户图标
  IconUrl() {
    /*
    if (this._wxUserInfoValid())
      return wxAccount.userInfo.userInfo.avatarUrl 
    else
      return "../../imgs/comm/coin.png"
      */
    return LCData.Get(LCData.ParamName.AVATOR_URL)
  }//this.SyncObj.GetValue("Iconurl")

  //文章服务器的地址
  ArticleServerUrl() { 
    if (ServerList.ArticleSvrList != null && ServerList.ArticleSvrList.length>0)
      return ServerList.ArticleSvrList[0].url
    else
      return "https://wz1.quwenyx.com/"
  }

  //赛季奖励状态
  get SeasonJLST() {
    return this.SyncObj == null ? 1 : parseInt(  this.SyncObj.GetValue("SeasonJLST") )
  }

  //是否需要显示赛季通知 0不需要 1需要
  get SeasonNotify(){
    return this.SyncObj == null ? 1 : parseInt(  this.SyncObj.GetValue("SeasonNotify") )
  }
  
  //最佳段位
  get BestLevel1() {
    return this.SyncObj == null ? 1 : this.SyncObj.GetValue("BestLevel1")
  }

  //当前赛季序号 -1表示赛季关闭
  get SeasonNum(){
    return this.SyncObj == null ? -1 : parseInt(this.SyncObj.GetValue("SeasonNum"))
  }

  //赛季开始时间 例 20180910
  get SeasonStart(){
    return this.SyncObj == null ? 0 : parseInt(this.SyncObj.GetValue("SeasonStart"))
  }

  //赛季结束时间 例 20180910
  get SeasonEnd(){
    return this.SyncObj == null ? 0 : parseInt(this.SyncObj.GetValue("SeasonEnd"))
  }

  //是否需要显示赛季通知按钮 0不需要 1需要
  get SeasonBtn(){
    return this.SyncObj == null ? 0 : parseInt(this.SyncObj.GetValue("SeasonBtn"))
  }
  

  //段位
  get Level1()
  {
    return this.SyncObj == null ? 1 : this.SyncObj.GetValue("Level1") 
  }

  //段位等级
  get Level2() {
    return this.SyncObj == null ? 1 : this.SyncObj.GetValue("Level2")
  }
  
  //段位星
  get Level3() {
    return this.SyncObj == null ? 1 : this.SyncObj.GetValue("Level3")
  }

  get InviteCode(){
    return this.SyncObj == null ? "" : this.SyncObj.GetValue("InviteCode")
  }
  
  //是否已经导入了本地数据到服务器
  get ImportDataFinish(){ 
    return this.SyncObj == null ? false : (Number( this.SyncObj.GetValue("ImportDataFinish"))==1)
  }

  GetParam(name)
  {
      if(this.SyncObj == null) return null
      return this.SyncObj.GetValue(name)
  }

  get HeadFrame() {
    if (!this.Backpack) return null
    var hfGoods = this.Backpack.GetFirstGoods(11)
    if (hfGoods == null) return null

    var img = ""//SDataUserFrame.GetRow(hfGoods.ShopId)[SDataUserFrame.I_Picture]
    return this.ArticleServerUrl() + "/public/uploads/ProblemImg/" + img
  }

  get IsVip() {
    if(!this.Backpack) return false
    return this.Backpack.IsVip?1:0
  }
  
  //vip特权过期时间 
  get VipEnd() {
    if (!this.Backpack) return "2008-10-10"
    var gd = this.Backpack.VipGoods
    if (!gd) return "2008-10-10"
    var date = gd.InvalidDate

    return "{0}-{1}-{2}".format(date.getFullYear(), date.getMonth() + 1, date.getDate())
  }

  get TimuJiange() { return this.SyncObj == null ? 0 : parseInt(this.SyncObj.GetValue("cgjg"))}

  get CZIDS(){
    if(this.SyncObj == null) return [];
    var array = this.SyncObj.GetValue("CZIDS").split(",")
    for(var i=0;i<array.length;i++) array[i] = parseInt(array[i])
    return array
  }

  //分享可获得的金币数
  get FXMoney() {return this.SyncObj == null ? 0 : this.SyncObj.GetValue("FXMoney")  }

  //绑定同步对象
  _BindSync(obj) { 
    this.SyncObj = obj
    this.Backpack = new _Backpack()
    this.Backpack._BindSync(obj)
  }
}

let Player = new _Player()

module.exports = { Player }