//本地数据  
import { GameConn } from "./GConn"
import { OOSyncClient } from "../dati_comm/libs/oosync/OOSyncClient"
import * as DataSecurity from "../dati_comm/modules/DataSecurity"


let IsImportDataFinish = false

//全部参数
var ParamName = { 
  PASS_LEVELS: "PassLevels",   //闯关模式 已经通过的总关数
  PASS_LEVELS_JIELONG: "PassLevelsJielong",//接龙模式 已经通过的总关数
  //CURRENT_LEVELS: "CurrentLevels",   //用户选择的当前关卡
  CURRENT_LEVELS_JIELONG: "CurrentLevelsJielong",   //接龙模式，用户选择的当前关卡
  TOTAL_POINT:"TotalPoint",//金币

  LAST_SIGNIN: "LastSignin",//上次签到时间
  TOTAL_SIGNIN_COUNT: "TotalSigninCount",//签到累计次数，每逢6清零

  SHARE_TIME: "ShareTime",//分享时间
  SHARE_COUNT: "ShareCount",//分享次数

  NICK_NAME:"NickName",//用户昵称
  AVATOR_URL: "AvatorUrl",   //用户头像url

  NEW_USER:"NewUser",//是否是新版本，新进入的用户 

  OPERATION_NUM:"OperationNum",//操作号
  UPLOADING:"Uploading",//当前正在上传的增量
  PAY_FINISH :"pay_finish",//是否冲过值

  //接龙分享相关
  JL_SHARE_TIME: "JLShareTime",//接龙分享时间
  JL_SHARE_COUNT: "JLShareCount",//接龙分享次数

  FINGHT_COUNT: "FinghtCount",//战斗次数
  LAST_FINGHT: "LastFinght",//上次战斗获得奖励的时间

  GUANQIA: "guanqia",//对战关卡
  DAAN: "daan", // 对战轮数
 
  //是否已经提示过授权了
  AUTHORIZE:"Authorize",
  AUTHORIZEOK:"AuthorizeOK",

  //是否已经通关
  NUMBER_IS_OK: "NumberIsOk",
  SHOW_NUMBER:"SHOW_NUMBER",
  //期数玩到第几关
  NUMBER_XTH: "NumberXth",
}

//需要同步的数字类型参数,增量模式同步
var SyncNumParam = {
  [ParamName.PASS_LEVELS]:1,
  [ParamName.PASS_LEVELS_JIELONG]:1,
  [ParamName.CURRENT_LEVELS_JIELONG]:1,
  [ParamName.TOTAL_POINT]:1,
}

//需要同步的字符串参数，覆盖模式同步
var SyncStrParam = {
  [ParamName.LAST_SIGNIN]:1,
  [ParamName.TOTAL_SIGNIN_COUNT]:1,
  [ParamName.SHARE_TIME]:1,
  [ParamName.SHARE_COUNT]:1,
  [ParamName.JL_SHARE_TIME]:1,
  [ParamName.JL_SHARE_COUNT]:1,
  [ParamName.PAY_FINISH]:1,
}

//值变化事件，服务器主动推送
function bindEvt(name)
{ 
  OOSyncClient.BindValueChangedEvent(0, "Player", name, (fullPath) => {
    if(!IsImportDataFinish) 
      return//尚未上传老用户数据，数据以本地为准

    //console.log("============================Params changed==============================",name)
    var rootObj = OOSyncClient.RootObj()
    var plyobj = OOSyncClient.GetObject(rootObj.Sid(), "Player")
    var v =  plyobj.GetValue(name)
    if(v) wx.setStorageSync(name, v); //本地的值被服务器同步，增量部分不受影响
  }
  )
}

//绑定值变化事件
for(var k in ParamName)
{
  var n = ParamName[k]
  bindEvt(n)
}



//获取参数
function Get(name) {
  /*
  var re
  if(SyncNumParam[name])  
  {
    re = Number(  wx.getStorageSync(name) )  

    var c = wx.getStorageSync(name+"_changed")
    if(c&&c!="")  re+= Number(c) //增加本地变动

  } else if(SyncStrParam[name])
  {
    re = wx.getStorageSync(name+"_changed") //优先使用本地的变动
    if(!re||re=="") re = wx.getStorageSync(name) 
  } else
    re = wx.getStorageSync(name) 

  return re*/
  return wx.getStorageSync(name) 
}

//获取数字参数
function GetNumber(name) {
  return Number(this.Get(name))
}

//设置参数
function Set(name, v) {
  /*
  console.log("===========Set====",name,v)
  if(SyncNumParam[name])
  {  
    wx.setStorageSync(name + "_changed", v - Number(  wx.getStorageSync(name) ) );//保存增量
  }else if(SyncStrParam[name])
  {
    wx.setStorageSync(name + "_changed", v);//设置值变更标记
  } else
    wx.setStorageSync(name, v);
  */
  wx.setStorageSync(name,"" + v);
}

//初始化参数
function AutoInitParams()
{
  if (wx.getStorageSync(ParamName.TOTAL_POINT) == "") //初始化金币
  { 
    wx.setStorageSync(ParamName.TOTAL_POINT, 300); 
    wx.setStorageSync(ParamName.NEW_USER, 1);//新版本，新进入的用户
    console.log("送金币300")
  }

  if (wx.getStorageSync(ParamName.CURRENT_LEVELS_JIELONG) == "") 
    wx.setStorageSync(ParamName.CURRENT_LEVELS_JIELONG, 1);
  
  if (wx.getStorageSync(ParamName.PASS_LEVELS_JIELONG) == "")
    wx.setStorageSync(ParamName.PASS_LEVELS_JIELONG, 1);
 

  if (wx.getStorageSync(ParamName.PASS_LEVELS) == "")
    wx.setStorageSync(ParamName.PASS_LEVELS, 1);

  if (wx.getStorageSync(ParamName.OPERATION_NUM) == "")
    wx.setStorageSync(ParamName.OPERATION_NUM, 1);

  if (wx.getStorageSync(ParamName.NUMBER_IS_OK) == "") //初始化是否通关
  {
    wx.setStorageSync(ParamName.NUMBER_IS_OK, "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0");
  }
  if (wx.getStorageSync(ParamName.NUMBER_XTH) == "") //初始化玩到第几关
  {
    wx.setStorageSync(ParamName.NUMBER_XTH,   "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1");
 
  }
  if (wx.getStorageSync(ParamName.SHOW_NUMBER) == "") //初始化是否通关
  {
    wx.setStorageSync(ParamName.SHOW_NUMBER, "1");
  }
} 

//自动上传参数
function AutoUploadParams()
{
  /*
  console.log("AutoUploadParams ...")
  if(!getApp().globalData.LoginOK) 
  { 
    console.log("AutoUploadParams 网络处于断开状态!")
    return//没有登录成功，不执行上传任务
  }
  //上传数据方案，考虑了服务器数据和本地不一致情况
  //比如充值，获得金币，或者其它途径服务器自动发金币，会导致服务器客户端数据不一致
  //采用增量数据合并方案，可以解决不一致问题

  var upload_data = this.Get(ParamName.UPLOADING) 
  
  if(upload_data=="")//当前没有需要上传的数据
  { 
    var needUpload = false
    var data = {}
    data.addi = {}
    data.v = {}
    for(var k in ParamName)
    {
      var param = ParamName[k]
      if(SyncNumParam[param]&&Number(wx.getStorageSync(param+"_changed"))!=0)
      { 
        var c = Number(wx.getStorageSync(param+"_changed"))
        if(c) data.addi[param] = c 

        //清除增量
        wx.setStorageSync(param, this.GetNumber(param) );
        wx.setStorageSync(param+"_changed", 0 );
        needUpload = true
      }

      if(SyncStrParam[param]&&wx.getStorageSync(param+"_changed")!="")
      {
        data.v[param] = wx.getStorageSync(param+"_changed")
        //清除增量
        wx.setStorageSync(param, this.Get(param) );
        wx.setStorageSync(param+"_changed", "" );
        needUpload = true
      } 
    }

    if(needUpload)
    {
        //设置操作号
         data.op = this.GetNumber(ParamName.OPERATION_NUM)  
         this.Set(ParamName.OPERATION_NUM, data.op +1)  
        
         //生成操作包
         this.Set(ParamName.UPLOADING,JSON.stringify(data))
         upload_data = this.Get(ParamName.UPLOADING) 
    }
  }
   
  if(upload_data=="") return//不需要上传数据



  var pubKey = getApp().globalData.RsaPubkey
  var nm = {
    n:"updata",
    data:upload_data,
    m: DataSecurity.Sign(pubKey, upload_data)//签名
  }

  var loader = GameConn.CreateLoader(nm)
  loader.OnComplete.On(this,(data)=>{
    if(data.r!=0&&data.r!=1) {
      console.log("上传用户数据失败!")
      return
    }

    if(data.r==1)
    {
      console.log("重复上传!")
    }else
      console.log("上传数据成功!")

    this.Set(ParamName.UPLOADING,"")
  }) */
}

function BindData(isBindFinish,successCallback)
{
   successCallback()
  return

/*
  IsImportDataFinish = isBindFinish
  if(isBindFinish) 
  { 
    console.log("已经绑定过用户数据===============")
    successCallback()
    return
  }
 
  var data = {}
  data.i={}
  data.s={}
  console.log("绑定用户数据===============")
  //if(Number(wx.getStorageSync(ParamName.NEW_USER))!=1)//不是新用户
  { 
    //开始绑定数据
    for(var k in ParamName)
    {
      var param = ParamName[k]
    
      if(SyncNumParam[param]) 
        data.i[param] = Number(wx.getStorageSync(param))
      
      if(SyncStrParam[param])
        data.s[param] =  wx.getStorageSync(param)
      
    }
  }   
   
  var pubKey = getApp().globalData.RsaPubkey
  
  var encStr = JSON.stringify(data)
  var nm = {
    n:"bddata",
    data:encStr,
    m: DataSecurity.Sign(pubKey,encStr)//签名
  }
  var loader = GameConn.CreateLoader(nm)
  loader.OnComplete.On(this,(data)=>{
    if(data.r!=0&&data.r!=1) {
      console.log("绑定用户数据失败!")
      return
    }

    if(data.r==1)
    {
      console.log("重复绑定!")
    }
 
    successCallback();
  })
  */
}
/*
r 0 1

"n:updata,
data:<string>// base64( hex( rsa(str)) ) 内容如下

{
op:<操作号>,
#数值型数据增量
addi:{
<string 参数名>:<string 值增量>,
...
},
#非数值型数据，当前值
v:{
<string 参数名>:<string 值>,
...
}
}
"

 */

export {
   AutoInitParams,
   ParamName,
   Get,
   GetNumber,
   Set,
   AutoUploadParams,
   BindData
}