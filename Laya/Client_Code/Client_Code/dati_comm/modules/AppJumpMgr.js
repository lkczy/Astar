//应用跳转管理器
import { PubConfig } from "../modules/PubConfig"
import { Player } from "../../modules/Player"
import { Long } from "../libs/long"
import * as gcfg from "../../gamecfg"
import { GameConn, WorldConn } from "../libs/network/Conns";
import { UIEvent } from "../libs/network/UIEvent.js"
import { ServerList } from "../libs/network/NSServerList";


//已经跳转过的存档位
let JumpSuccessSaveids = {}



//广告层
class ADLayer {
  //moshi 本层绑定的模式
  //wzNode 广告位xml节点
  //clickMask 背包中存放的点击状态掩码
  constructor(moshi, wzNode, clickMask) {
    this.moshi = moshi
    this.adList = []
    var adList = wzNode.getElementsByTagName('a');
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< "+adList+" >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    for (var i = 0; i < adList.length; i++) {
      var info = adList[i]
      var _moshi = parseInt(info.getAttribute('moshi'))
      if (moshi != _moshi) continue

      var saveid = 0

      if (moshi == 1)//点击需要消失的广告
      {
        saveid = parseInt(info.getAttribute('saveid'))

        //检查是否已经被点击过
        var maskIdx = parseInt((saveid - 1) / 64)
        var mask = clickMask[maskIdx]//获得一个包含64个点击位的掩码
        var bitIdx = (saveid - 1) % 64//比特位
        var btIdx = parseInt(bitIdx / 8)//获得8位的索引编号
        var bt = mask[7 - btIdx] >>> 0
        var btIdx = bitIdx % 8
        var checkBt = 1 >>> 0 << btIdx//用于位检查

        //console.log("mask===============",mask,bt)
        if (
          (bt & checkBt) != 0 ||//背包中检查被点击过了
          JumpSuccessSaveids[saveid]//本地缓存检查被点击过了
        )
          continue
      }

      var item = {
        saveid: saveid,
        qz: parseInt(info.getAttribute('qz')),
        path: info.getAttribute('path'),
        appId: info.getAttribute('appId'),
        picture: Player.ArticleServerUrl() + "/public/uploads/ProblemImg/" + info.getAttribute('pic'),
        viphide: parseInt(info.getAttribute('viphide')),
      }

      //加入到随机队列
      this.adList.push(item);
      console.log("AppJumpMgr==================#1", item)
    }//end for(var i=0
  }

  //随机产生一个广告，返回null表示无法产生
  Random() {
    if (this.adList.length < 1) return null;

    console.log("AppJumpMgr==================#2")
    //保底模式
    if (this.moshi == 3) return this.adList[0];

    //根据权重随机  
    var tqz = 0//总权重

    //计算总权重和随机对象
    var list = []
    for (var i = 0; i < this.adList.length; i++) {
      var jumpObj = this.adList[i]
      if (jumpObj.viphide == 1 && Player.IsVip == 1) continue;//处理vip隐藏广告
      list.push(jumpObj);
      tqz += jumpObj.qz
    }
    console.log("AppJumpMgr==================#3")
    if (tqz > 0)//存在可点击的app
    {
      var r = Math.floor(Math.random() * tqz); //0~(总权重-1)
      var sumqz = 0
      for (var i = 0; i < list.length; i++) {
        var curr = list[i];
        sumqz += curr.qz
        if (r < sumqz) {

          return curr
        }
      }
    }

    return null
  }
}


//跳转成功事件
let OnJumpAppSuccess = new UIEvent()

//根据广告位置索引的当前跳转
let g_CurrJump = {}

let ClickNum = 0 //点击次数统计

//Player.Backpack.ADClick


function GetClickNum()
{
  if (ClickNum != Player.Backpack.ADClick + 1) //无效的预增加，一般是因为凌晨5点服务器刷新了点击计数
    ClickNum = Player.Backpack.ADClick
  return Math.max(   ClickNum, Player.Backpack.ADClick )
}

//重新随机
//wz 广告位置id
function Random(wz) {
  //清当前跳转信息
  g_CurrJump[wz] = null

  console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", PubConfig)
  if (!PubConfig.AD) return
  var wzNode = PubConfig.AD.getElementsByTagName("wz" + wz)
  if (wzNode == null || wzNode.length < 1) return//不存在这个广告位



  var clickMask = []
  //生成点击状态掩码
  for (var i = 9001; i <= 9005; i++) {
    var v = Player.Backpack.GetParam(i)
    if (v == null)
      clickMask.push(Long.fromString("0").toBytesBE())
    else
      clickMask.push(Long.fromString(v).toBytesBE())
  }


  var wzDom = wzNode[0]

  for (var i = 1; i <= 3; i++) {
    var layer = new ADLayer(i, wzDom, clickMask)
    var jumpObj = layer.Random()
    if (jumpObj) {
      //console.log("AppJumpMgr==================#5",jumpObj)
      g_CurrJump[wz] = jumpObj;
      break
    }
  }
}

//获取当前跳转
//wz 广告位置id
function Curr(wz) {
  var re = g_CurrJump[wz]
  //console.log("AppJumpCurr=========",re,wz,g_CurrJump)
  return re
}

//执行跳转行为
function Jump(wz) {

  console.log(g_CurrJump[wz])
  if (!g_CurrJump[wz]) return//不存在跳转
  console.log("进入跳转")
  var jumpObj = g_CurrJump[wz]

  var jumpID = jumpObj.saveid

  console.log("jumpID", jumpID)
  wx.navigateToMiniProgram({
    appId: jumpObj.appId,
    path: jumpObj.path,
    envVersion: 'release',//develop（开发版），trial（体验版），release（正式版）
    success: (res) => {
      // 打开成功
      console.log("跳转app成功：", res)

      if (jumpID > 0)//这是一个需要记录点击状态的跳转
      {
        ClickNum = Player.Backpack.ADClick + 1//服务器返回点击次数有延迟，本地预增加

        //向服务器发送打开成功 
        var nm = { n: "jumpApp", id: jumpID, m: 1 } // m: 2
        GameConn.Request(nm, (data) => {
          //console.log("datadatadatadatadata", data)
        })
        //本地缓存点击过的id
        JumpSuccessSaveids[jumpID] = true
      }else
        ClickNum = Player.Backpack.ADClick//刷新ClickNum

      //抛出点击成功事件
      OnJumpAppSuccess.Emit(wz)
    },
    fail: (res) => {
      console.log("打开失败：" + res)
    }
  })
}

//跳转最强答题
function Jumpdati() {
  if (!ServerList.Func) return
  var apps = ServerList.Func["JumpAppsdt"]
  if (!apps) return
  var jumpobjList = []
  var jumps = apps.getElementsByTagName('a');
  for (var i = 0; i < jumps.length; i++) {
    var info = jumps[i]
    var jumpObj = {
      path: info.getAttribute('path'),
      appId: info.getAttribute('appId')
    }
    jumpobjList.push(jumpObj)
  }
  wx.navigateToMiniProgram({
    appId: jumpObj.appId,
    path: jumpObj.path,
    envVersion: 'release',//develop（开发版），trial（体验版），release（正式版）
    success(res) {
      // 打开成功
      console.log("打开成功：" + res)

    }
    , fail(res) {
      console.log("打开失败：" + res)
    }
  })
}




module.exports = { Random, Curr, Jump, Jumpdati, OnJumpAppSuccess, GetClickNum }