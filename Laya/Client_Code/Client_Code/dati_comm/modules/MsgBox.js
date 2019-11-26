

//显示只有一个按钮的消息框
function ShowOK(title,content,btnTxt = "确定",callBack)
{
    wx.showModal(
      {
        title: title, 
        content:  content ,
        confirmText: btnTxt,
         showCancel: "false",
          cancelText: "",
        confirmColor: "#3cc51f",
        complete: (res) => { 
          if (callBack) callBack()
          /*
          if (res.confirm) { 
          } else if (res.cancel) {
            
          }*/
        }
      }
    )
}

//充值跳转消息框
function ShowCZJump()
{
     wx.showModal(
        {
            title: "金币不足",
            content: "所持金币不足，无法参加匹配\r\n是否前往充值？",
            showCancel: "true",
            cancelText: "否",
            confirmText: "是",
            confirmColor: "#3cc51f",
            success: (res) => {
                if (res.confirm) //用户点击确定
                {
                    getApp().globalData.wnds.Wnd_Shopping.Show(null, "Istz=" + true);
                } else if (res.cancel) //用户点击取消
                {
                    
                }
            }//end success
        }
    )
}



export {
    ShowOK,    
    ShowCZJump
};