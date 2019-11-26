import {UIEvent} from "../libs/network/UIEvent.js"
 

let PageEvents = {
    //顶层窗体发生改变时
    OnTopWndChanged: new UIEvent()
}

let CurrVisiblePage = null

//页包装
export default class PageWrap {
    //1常规 2主页 3覆盖
    constructor(url,jumpMode=1) { 
        this.url = url
        this.jumpMode = jumpMode
    }

    set TemporaryJumpMode(v)
    {
      this._TemporaryJumpMode = v
    }

    Show(param=null,jump=null) {
        if (CurrVisiblePage === this && this.url === '/pages/fightOver/fightOverPage') {
            return;
        }
        CurrVisiblePage = this
        PageEvents.OnTopWndChanged.Emit(this) 

        var url = this.url

       
        if (param)
        {
          var pstr = ""
          for (var n in param)
          {
            var v = (param[n]+"").replace('=', '%3D');
            console.log(v)
              

            var kv = n + "=" + v
            if (pstr == "") 
              pstr = kv 
            else  
              pstr += "&" + kv 
          }

          url += "?" + pstr
          if (jump) {
            url += '&' + jump
          }  

          console.log("PageShow#1 ",url)
        }else
        { 
          if (jump) {
            url += '?' + jump
          }  
          console.log("PageShow#2 ", url)
        }
        
          console.log("PageShow ", url)
        var mode = this._TemporaryJumpMode ? this._TemporaryJumpMode : this.jumpMode
        this._TemporaryJumpMode = null

        //将窗体显示出来
        switch (mode)
        { 
          case 2:
          { 
              wx.reLaunch({ url: url }) 
          }
          break
          case 1:
          { 
              wx.navigateTo({ url: url }) 
          }
          break
          case 3:
          {
              wx.redirectTo({ url: url})
          }
          break
        } 
    }

/*
    static Back(delta=1)
    {
      wx.navigateBack({ delta: delta  })
    }
*/
    IsVisible() { return CurrVisiblePage == this  } 
}
 

export {PageEvents};