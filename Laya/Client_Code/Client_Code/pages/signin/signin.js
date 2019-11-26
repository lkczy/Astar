import * as LCData from "../../modules/LocalData"
const mpsdk = require('../../utils/mpsdk.js');
let app=getApp();
let that
let videoAd;
let showloadingstate = true
Page({
  data: {
    ITEM_BG_NOR: "#720638",
    ITEM_BG_SEL: "#676262",

    NUM_BG_NOR: "#bf0d5f",
    NUM_BG_SEL: "#988d8d",

    FONT_COLOR_NOR: "#f6e75f",
    FONT_COLOR_SEL: "#9c9c9c",

    signinCount: 0,

    item_bg: [],
    num_bg: [],
    font_color: [],
    openLevel: '0',
    ShareOrVideo: 1
  },
  onLoad: function() {
    //同步审核状态
    getApp().globalData.getOpenLevel.then(data => {
      if (!wx.getStorageSync('isStrong'))
      return
      this.setData({
        openLevel: data.level
      });
    });

    that = this
    wx.updateShareMenu({
      withShareTicket: true
    });

    var curTotalDays = parseInt((new Date()).getTime() / 86400000);
    var lasTotalDays = parseInt(LCData.GetNumber(LCData.ParamName.LAST_SIGNIN) / 86400000)

    console.log("lasTotalDays::" + lasTotalDays + "   curTotalDays::" + curTotalDays)

    var item_bg_temp = []
    var num_bg_temp = []
    var font_color_temp = []
    if (curTotalDays - lasTotalDays == 1) {
      this.data.signinCount = LCData.GetNumber(LCData.ParamName.TOTAL_SIGNIN_COUNT)

      console.log("signinCount::" + lasTotalDays + "   curTotalDays::" + curTotalDays)

      for (var i = 0; i < 7; i++) {
        if (i <= this.data.signinCount) {
          item_bg_temp[i] = this.data.ITEM_BG_NOR
          num_bg_temp[i] = this.data.NUM_BG_NOR
          font_color_temp = this.data.FONT_COLOR_NOR
        } else {
          item_bg_temp[i] = this.data.ITEM_BG_SEL
          num_bg_temp[i] = this.data.NUM_BG_SEL
          font_color_temp = this.data.FONT_COLOR_SEL
        }
      }
    } else {
      LCData.Set(LCData.ParamName.TOTAL_SIGNIN_COUNT, 0)
      for (var i = 0; i < 7; i++) {
        if (i <= 0) {
          item_bg_temp[i] = this.data.ITEM_BG_NOR
          num_bg_temp[i] = this.data.NUM_BG_NOR
          font_color_temp = this.data.FONT_COLOR_NOR
        } else {
          item_bg_temp[i] = this.data.ITEM_BG_SEL
          num_bg_temp[i] = this.data.NUM_BG_SEL
          font_color_temp = this.data.FONT_COLOR_SEL
        }
      }
    }

    this.setData({
      item_bg: item_bg_temp,
      num_bg: num_bg_temp,
      font_color: font_color_temp,
    })


    
  },
  onShow(){
    if (app.onShareJudge(this.shareOthers)) {
      // this.shareManage(this.shareOthers.serial, this.shareOthers.shareInfo, '');
      console.log('返回为true，执行新版分享');
      this.shareManage();
    }
    this.shareOthers = {};
    
    if (wx.getStorageSync('havevideo')) {
      getApp().getShareOrVideo();
    }
    this.setData({
      ShareOrVideo: getApp().globalData.ShareOrVideo
    })

    if (getApp().globalData.ShareOrVideo == 1) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-4fc46bce15dcbe36'
      })

      videoAd.onError((res) => {
        console.log(' 暂无视频 adload错误', res)
        getApp().globalData.ShareOrVideo = 2
        wx.setStorageSync('havevideo', false)
      })

      videoAd.onLoad((res) => {
        console.log(' 加载视频成功 onload', res)

      })


    } else {
      console.log('不支持视频')
    }




    console.log('应该采用这种：', getApp().globalData.ShareOrVideo)
  },
  onHide(){
    this.shareOthers.share1 = true;
  },
  shareOthers:{},
  onShareAppMessage: function(options) {
    if (wx.getSystemInfoSync().version > '6.7.2') {
      console.log('高版本');
      this.shareOthers.share = true;
      this.shareOthers.time = +new Date();
      // let shareInfo = mpsdk.Share.getShareInfo();
      // this.shareOthers.shareInfo = shareInfo;
      // this.shareOthers.serial = serial;
    }
    let shareInfo = {
      serial: 1,
      scoreValue: getApp().getScore()
    };
    let success=null;
    if (!this.shareOthers.share){
      console.log('进入原版分享');
      // success =  this.shareManage(true);
     success = function (res) {
       console.log('查看res++++++++++', res, this.data.openLevel);
        if (this.data.openLevel == '2' && !res.shareTickets) { //强制分享到群
          console.log('进入第一个判断');
          wx.showToast({
            title: '邀请更多群友可获得双倍奖励',
            icon: 'none'
          });
          return;
        } else if (this.data.openLevel == '1') { //不强制分享到群
          console.log('进入第二个判断');
          this.setData({
            double: res.shareTickets ? true : false
          });
          console.log(this.data.double);
        }else{
          console.log('进入第三个判断');
          this.setData({
            double:  true
          });
        }
        wx.navigateBack();
      }
      
    }
    return mpsdk.Share.commonShare(shareInfo, success, null, this);
    
  },
  shareManage() {
    
    // let success ;
    // if (shareIf){
      
    // }else{
      // success=null;
      this.setData({
        double: true
      });
    wx.navigateBack();
    // }
    // return success;
   
  },
  /**
   * 领取单倍奖励
   */
  onKnow: function() {
    wx.navigateBack();
  },

  onUnload: function() {
    var point = LCData.GetNumber(LCData.ParamName.TOTAL_POINT)
    var count = LCData.GetNumber(LCData.ParamName.TOTAL_SIGNIN_COUNT)

    var sign = 20;
    if (count == 6) {
      count = 0
      sign = 140;
    } else {
      count++
      sign = count * 20;
    }

    //双倍奖励
    if (this.data.double) {
      sign *= 2;
    }

    point += sign;

    try {
      LCData.Set(LCData.ParamName.TOTAL_SIGNIN_COUNT, count)
      LCData.Set(LCData.ParamName.TOTAL_POINT, point)

      LCData.Set(LCData.ParamName.LAST_SIGNIN, (new Date()).getTime())
    } catch (e) {
      LCData.Set(LCData.ParamName.TOTAL_SIGNIN_COUNT, count)
      LCData.Set(LCData.ParamName.TOTAL_POINT, point)
      LCData.Set(LCData.ParamName.LAST_SIGNIN, (new Date()).getTime())
    }

    // wx.showToast({
    //   title: '获得' + sign + '金币',
    //   icon: 'none'
    // });
  },
  playvideo: function (type) {
    if (showloadingstate) {
      this.tupe_temp = type
      wx.showLoading({
        title: '请稍后',
        mask: true
      })
      showloadingstate = false
      console.log('视频入口:', type)
      if (getApp().globalData.ShareOrVideo == 3) {
        wx.hideLoading()
        showloadingstate = true
        wx.showToast({
          title: '暂无视频',
          icon: 'none'
        })
        return
      }

      let that = this
      videoAd.load().then(() => {
        videoAd.show().then((res) => {
          console.log('开始播放', res)
          wx.hideLoading()
        })

      }).catch(err => {
        showloadingstate = true
        wx.hideLoading()
        wx.showToast({
          title: '暂无视频',
          icon: 'none'
        })
        getApp().globalData.ShareOrVideo = 2
        wx.setStorageSync('havevideo', false)
      })

      videoAd.onClose(that.callback)

    }
  }, 
  tupe_temp: {},
  callback: (res) => {
    let type = that.tupe_temp
    console.log('放完了:', res)
    wx.hideLoading()
    showloadingstate = true
    wx.setStorageSync('firstvideoState', 0)
    getApp().getShareOrVideo();
    that.setData({
      ShareOrVideo: getApp().globalData.ShareOrVideo
    })
    if (res.isEnded) {

      this.setData({
        double: true
      });
      wx.navigateBack();

    } else {
      wx.showToast({
        title: '请看完视频哦~',
        icon: 'none'
      })
    }
    videoAd.offClose(that.callback)
  },

})