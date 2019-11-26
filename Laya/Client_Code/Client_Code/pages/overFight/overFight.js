// pages/overFight/overFight.js


import { Player } from "../../modules/Player"
import { GameConn, WorldConn } from "../../dati_comm/libs/network/Conns";
import { buttonDisabler } from "../../dati_comm/modules/buttonDisabler";
import { FightRoom, StopFight} from "../../dati_comm/modules/FightRoom"
//import { SDataKeyValue } from "../../sdata/SDataKeyValue"

import * as LCData from "../../modules/LocalData"
import * as DataSecurity from "../../dati_comm/modules/DataSecurity"
import { share } from "../../dati_comm/modules/share"
const mpsdk = require('../../utils/mpsdk.js');
let cj = null;
let datas = {
  seconds: 100
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: datas
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 给头像名字赋值
    this.setData({
      left_name: Player.Name(),
      left_Url: Player.IconUrl(),
      right_name: FightRoom.RightPlys[0].name,
      right_Url: FightRoom.RightPlys[0].iconurl,
      opa: 0
    })
    this.OnShowDone()

  },

  OnShowDone() {

    cj = FightRoom.Chengji
    if (!cj) return
    console.log("cjcjcjcjc", cj)
    var zuo = FightRoom.IsA ? cj.afen : cj.bfen;
    var you = FightRoom.IsA ? cj.bfen : cj.afen;

    var ld_left = FightRoom.IsA ? cj.anum : cj.bnum;
    var ld_right = FightRoom.IsA ? cj.bnum : cj.anum;
    // 赋值分数
    this.setData({
      left_fen: zuo,
      right_fen: you,
      left_dadui: ld_left,
      right_dadui: ld_right

    })

    // 左方是否胜利
    var leftIsWin = FightRoom.IsA ? (cj.win == 1) : (cj.win != 1)
    if (leftIsWin) {
      this.finghtjl()
    }
    this.setData({
      win_sf: leftIsWin,
      opa: 1
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (app.onShareJudge(this.shareOthers)) {
    //   // this.shareManage(this.shareOthers.serial, this.shareOthers.shareInfo, '');
    //   this.shareManage(this.shareOthers.level);
    // }
    this.shareOthers = {};
  },
  onHide() {
    this.shareOthers.share1 = true;
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that=this;
    var cur_level = LCData.GetNumber(LCData.ParamName.PASS_LEVELS)
    getApp().globalData.isFromCheckShare = true
    if (wx.getSystemInfoSync().version > '6.7.2') {
      console.log('高版本');
      this.shareOthers.share = true;
      this.shareOthers.time = +new Date();
      this.shareOthers.level = cur_level;
    }
    // if (this.shareOthers.shar){return;}
    // return {
    //   title: '成语猜猜看出对战模式啦，来与我战！',
    //   path: '/pages/index/index',
    //   success: function (res) {
    //     if (!this.shareOthers.shar){
    //       that.shareManage(cur_level);
    //     }
    //   },
    //   fail: function (res) {
    //     // 转发失败
    //   }
    // }
    let shareInfo = {
      serial: 1,
      scoreValue: getApp().getScore()
    };
    return mpsdk.Share.commonShare(shareInfo, null, null, this);
  },
  shareManage(cur_level){
    let that=this;
    //获取分享次数
    var curTime = parseInt((new Date()).getTime() / 86400000)
    var lastTime = LCData.GetNumber(LCData.ParamName.SHARE_TIME)
    var count = LCData.GetNumber(LCData.ParamName.SHARE_COUNT)
    if (curTime == lastTime) {
      count = count + 1
    } else {
      count = 1
    }

    LCData.Set(LCData.ParamName.SHARE_TIME, curTime)
    LCData.Set(LCData.ParamName.SHARE_COUNT, count)


    if (cur_level < 200) {
      console.log("onshare success1")
      if (count > 10) {
        if (wx.getStorageSync("ShowTipsPre100") == "") {
          wx.setStorage({
            key: "ShowTipsPre100",
            data: "show",
          })

          wx.showModal({
            title: "提示",
            content: "您一天只能获取十次奖励哦！！！",
            showCancel: false
          })
        }
        return
      }
    } else if (cur_level < 400) {
      console.log("onshare success2")
      if (count > 8) {
        if (wx.getStorageSync("ShowTipsPre200") == "") {
          wx.setStorage({
            key: "ShowTipsPre200",
            data: "show",
          })

          wx.showModal({
            title: "提示",
            content: "您一天只能获取八次奖励哦！！！",
            showCancel: false
          })
        }
        return
      }
    } else if (cur_level < 600) {
      console.log("onshare success3")
      if (count > 6) {
        if (wx.getStorageSync("ShowTipsPre300") == "") {
          wx.setStorage({
            key: "ShowTipsPre300",
            data: "show",
          })

          wx.showModal({
            title: "提示",
            content: "您一天只能获取六次奖励哦！！！",
            showCancel: false
          })
        }
        return
      }
    } else if (cur_level < 800) {
      console.log("onshare success3")
      if (count > 4) {
        if (wx.getStorageSync("ShowTipsPre400") == "") {
          wx.setStorage({
            key: "ShowTipsPre400",
            data: "show",
          })

          wx.showModal({
            title: "提示",
            content: "您一天只能获取四次奖励哦！！！",
            showCancel: false
          })
        }
        return
      }
    } else {
      console.log("onshare success3")
      if (count > 2) {
        if (wx.getStorageSync("ShowTipsPreOther") == "") {
          wx.setStorage({
            key: "ShowTipsPreOther",
            data: "show",
          })

          wx.showModal({
            title: "提示",
            content: "您一天只能获取两次奖励哦！！！",
            showCancel: false
          })
        }
        return
      }
    }



    var point = LCData.GetNumber(LCData.ParamName.TOTAL_POINT)
    point += 30
    LCData.Set(LCData.ParamName.TOTAL_POINT, point)

    that.setData({ total_point: point })

    // wx.showToast({
    //   title: '获得30金币',
    //   icon: 'success',
    //   duration: 2000
    // })
  },
  zlyj() {
    if (!buttonDisabler.canClick(2000)) return;
    // this.NeedExitFight = false
    StopFight()

    //再来一局 
    FightRoom.ShowReadyWnd(true)
    FightRoom.ConnGame(
      (r)=>{
        if(r){
          FightRoom.RePK()
        }else
        {
           console.log('mark222222')
          wx.showToast({
            title: "网络故障，请稍后再试...",
            icon: 'none',
            duration: 2000
          })

          if( getCurrentPages().length > 1)  wx.navigateBack({ delta: 1 })  
        }
      }//end  (r)=>{
    ) 

    

  }
  // 战斗奖励
  , finghtjl() {

    // 获取当前时间
    var Daysa = parseInt((new Date()).getTime() / 86400000);

    // 获取上次获得奖励的时间
    var Daysb = parseInt(LCData.GetNumber(LCData.ParamName.LAST_FINGHT) / 86400000)
    console.log("Daysb", Daysb)
    // 如果没有上次战斗时间，就设置当前时间为上次战斗时间
    if (Daysb == 0 || Daysb == "0") {
      Daysa = Daysa - 1
      LCData.Set(LCData.ParamName.LAST_FINGHT, (new Date()).getTime())
    }
    console.log("Daysa", Daysa)
    console.log("Daysb", Daysb)
    // 如果离上次战斗大于一天，清空战斗奖励次数
    if (Daysa - Daysb >= 1) {
      LCData.Set(LCData.ParamName.FINGHT_COUNT, 0)

    } else {
    }

    // 获取战斗胜利次数
    var par = parseInt(LCData.GetNumber(LCData.ParamName.FINGHT_COUNT))
    // 战斗次数不大于3次，就增加20金币
    if (par < 3) {
      par += 1
      LCData.Set(LCData.ParamName.TOTAL_POINT, LCData.GetNumber(LCData.ParamName.TOTAL_POINT) + 20)
      LCData.Set(LCData.ParamName.FINGHT_COUNT, par)
      wx.showToast({
        title: '每日对战获胜+20金币(' + par + '/3)',
        icon: 'none',
        duration: 2000
      })
      // 记录获取奖励时间
      var Days = parseInt(LCData.GetNumber(LCData.ParamName.LAST_FINGHT))
      LCData.Set(LCData.ParamName.LAST_FINGHT, (new Date()).getTime())
    } else if (par == 3) {
      par += 1
    }

  }
})