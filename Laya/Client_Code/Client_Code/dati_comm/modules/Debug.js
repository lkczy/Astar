import { Player } from "../../modules/Player.js"
import { GameConn, WorldConn } from "../libs/network/Conns";
import * as MsgBox from "./MsgBox"

function RequestDbg(func)
{ 
  var nm = {n:"Dbg",func:func}
  GameConn.Request(
    nm,
    (data) => { 
      MsgBox.ShowOK("消息", data.msg )
    }
  )
}
function ShowMenu(hookFunc)
{ 
  if (!Player.IsDebug) //服务器没有开启调试模式
  {
    hookFunc()
    return
  }
  wx.showActionSheet({
    itemList: ['原功能','加金币', '加学分'],
    success: function (res) {
      console.log(res.tapIndex)
      switch (res.tapIndex)
      {
        case 0:
          hookFunc()
          break
        case 1:
          RequestDbg(1)
          console.log("加金币")
          break
        case 2:
          RequestDbg(2)
          console.log("加学分")
          break
      }
    },
    fail: function (res) {
      console.log(res.errMsg)
    }
  })
}


export { ShowMenu }
