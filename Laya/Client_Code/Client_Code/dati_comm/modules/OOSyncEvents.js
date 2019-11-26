//用于分发同步事件

import { OOSyncClient } from "../libs/oosync/OOSyncClient"
import {UIEvent} from '../libs/network/UIEvent'
import * as gcfg from "../../gamecfg"

//金币变化
let OnMoneyChanged = new UIEvent()

//积分变化
let OnJifenChanged = new UIEvent()

//背包道具变化
let OnBackpackChanged = new UIEvent()

let goodsEvtTimer = null

//参数改变
OOSyncClient.BindValueChangedEvent(0, "Player/Params", "*", (fullPath) => {
  // console.log("============================Params changed==============================",fullPath)
  //Player/Params@1
  var path_id = fullPath.split('@')
  if(path_id.length!=2) return
  var paramid = parseInt(path_id[1])
  if(paramid==gcfg.subtype_money)
  {
      console.log("==========金币改变==========")
      OnMoneyChanged.Emit()
  }else if(paramid==gcfg.subtype_jifen)
  {
      console.log("==========积分改变==========")
      OnJifenChanged.Emit()
  } 
}
)

//道具改变
OOSyncClient.BindValueChangedEvent(0, "Player/Goods", "*", (fullPath) => {
  // console.log("============================Goods changed==============================",fullPath)
  //var isObj = fullPath.indexOf("Player/Goods/@")
  
  //Player/Goods/786432@Num 改变参数
  //Player/Goods/@786432 创建道具
  /*
  if(isObj)
  {
      var path_id = fullPath.split('@')
      if(path_id.length!=2) return
      var paramid = parseInt(path_id[1])
  }
  */

  //防止过于频繁的刷新，多次连续的变化会被过滤掉
  if(goodsEvtTimer) clearTimeout(goodsEvtTimer)
  goodsEvtTimer = setTimeout(()=>{
      goodsEvtTimer = null
      console.log("==========背包改变==========")
      OnBackpackChanged.Emit()
  },
  50
  )
})



module.exports = { 
    OnMoneyChanged,
    OnJifenChanged,
    OnBackpackChanged
}


 