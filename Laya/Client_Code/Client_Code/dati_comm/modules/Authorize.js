//检查授权
function CheckAuthorize(completeFunc)
{
    wx.getSetting({
    success: res => {
        console.log('###############getSetting success...');
        var scope =  'scope.userInfo' 
        if(completeFunc) completeFunc(res.authSetting[scope]?true:false)
    },
    fail:()=>{
        console.log('###############getSetting fail...');
         if(completeFunc) completeFunc(false)
    }
    })
}

//<button bindgetuserinfo='OnAuthorize' open-type="getUserInfo" ></button>
//执行授权
function GetUserInfo(res)
{ 
    if(
      !res.detail||
      !res.detail.errMsg||
      res.detail.errMsg!="getUserInfo:ok"
    )
      return null
    
    //nickName avatarUrl
    return JSON.parse(res.detail.rawData)
}

module.exports = { 
    CheckAuthorize,
    GetUserInfo
}