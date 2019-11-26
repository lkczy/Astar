import * as MsgBox from "./MsgBox"
import { txt} from "../sdata/SDataID2"


function BindAppUpdateEvt()
{ 
  console.log("BindAppUpdateEvt*******************************")
  var updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    console.log("updateManager*******************************",res.hasUpdate)
  })

  updateManager.onUpdateReady(function () {
    MsgBox.ShowOK(
      txt(1072),//'更新提示',
      txt(1073),// '新版本已经准备好，点击确定重启应用。',
    '确定',
      ()=>{
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    )
  })

  updateManager.onUpdateFailed(function () {
    // 新的版本下载失败
    MsgBox.ShowOK(
      txt(1072),//'更新提示', 
      txt(1074)//'游戏版本已更新，请退出微信和小程序，重新进入即可体验。'
    )
  })
}
module.exports = { BindAppUpdateEvt }