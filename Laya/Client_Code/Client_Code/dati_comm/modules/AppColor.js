import * as gcfg from "../../gamecfg"
let ProId = gcfg.ProjectID
// let cfg = gcfg.cfg
let cfg = gcfg


// 设置标题跟标题背景色
function headbg() { 
    wx.setNavigationBarColor({
      frontColor: cfg.NavigationBarFG,
      backgroundColor: cfg.NavigationBarBG
    }) 
}

// 设置标题
function title() {
 
    wx.setNavigationBarTitle({
      title: cfg.title
    }) 

}
// 设置标题
function tabtitle(res) {

  wx.setNavigationBarTitle({
    title: res
  })

}
// 设置背景颜色
function tabheadbg(res) {
  wx.setNavigationBarColor({
    frontColor: cfg.NavigationBarFG,
    backgroundColor: res
  })
}

module.exports = {
  headbg, title, ProId, tabtitle, tabheadbg
}
