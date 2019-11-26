//游戏登录相关
import {ServerLogin} from "../../modules/ServerLogin.js"

let isJumped = false;//是否已经跳转过了

function _DoAuthorize() {
  /*
  setTimeout(
    ()=>{
      getApp().globalData.wnds.Wnd_Home.Show()
    },
    50
  )*/
  
  ServerLogin.login(); 
}

function AutoJump(name, options = null) {
//return false
    let gData = getApp().globalData;
    console.log("gDatagDatagDatagDatagDatagData",gData)
    if (gData.isFromShare) {
        gData.isFromShare = false; // 之后进入任何页都不是从分享直接来

        isJumped = true;
        getApp().globalData.IndexPageOptions = options;
        getApp().globalData.ServerLogin = ServerLogin;
        _DoAuthorize();
        return true;
    }

    // 直接启动小程序而来
    if (!isJumped || name === 'index') {
      console.log("执行跳转 ", isJumped, name)
      getApp().globalData.IndexPageOptions = options;
      getApp().globalData.ServerLogin = ServerLogin;

      if (isJumped)
      {
        console.log("跳转首页...")
        setTimeout(() => { getApp().globalData.wnds.Wnd_Home.Show()},50)
        
      }else
      {
        console.log("执行登录逻辑...")
        isJumped = true;
        _DoAuthorize();
      }
      
      return true;
    }

    // 从其他页面来
    return false;
}

export {AutoJump}