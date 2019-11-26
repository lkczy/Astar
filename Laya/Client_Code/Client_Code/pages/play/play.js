//play.js
//获取应用实例
var common = require("../../utils/util.js")
import * as LCData from "../../modules/LocalData"
import {
  share
} from "../../dati_comm/modules/share"
const mpsdk = require('../../utils/mpsdk.js');
var app = getApp();
var that
let time
let timeing
let change
let videoAd
let showloadingstate = true
let InterstitialAd
Page({
  data: {
    cur_level: 1,
    level_icon_url: "",
    main_img_url: "",
    array_sel_item: [], //
    array: [], //候选list的字    24个字
    array_show: [], //候选list的字是否显示
    ans: [], //选中的list的字   4个字对应的array的index
    ansBg: [],
    pointAdd: false,
    total_point: 0,
    cur_turn_level: 1,
    showAd: false,
    banner_sts: false,
    openLevel: '0',
    isShowWx: true,
    userid: mpsdk.Account.getAccount().openid,
    cnxhstate: false,
    liveTime: 0,
    remainingTime: '',
    lucyBagLv: 5,
    state: 0,
    nextbottom: 880,
    adtop: 950,
    showhwPddYouLike: true,
    marginbottom: 160,
    cytzstate: 0,
    ShareOrVideo: 1,
    // dayUserGift:true

  },
  onLoad: function(option) {
    that = this
    this.setData({
      liveTime: wx.getStorageSync('lucyBagTime'),
      lucyBagLv: wx.getStorageSync('lucyBagLv'),
    })
    //插屏广告
    if (wx.getStorageSync('isNewSdk')) {
      InterstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-06d18a6c6a95786e'
      })

    } else {
      console.log('不支持插屏')
    }

    setTimeout(() => {
      that.setData({
        cnxhstate: app.globalData.cnxhstate,
        state: app.globalData.state,
        cytzstate: app.globalData.cytzstate
      })
    }, 1000)
    // console.log(option);
    // if (option && option.types) {
    //   console.log('从外面进来的');
    this.setData({
      isShowWx: true,
      userid: wx.getStorageSync('pdduserId') || mpsdk.Account.getAccount().openid
    });
    //   wx.setStorageSync('isShowWX', true)
    // } else {
    //   console.log('旧的进来后................', wx.getStorageSync('isShowWX'));
    //   this.setData({
    //     isShowWx: wx.getStorageSync('isShowWX')
    //   });
    // }
    getApp().getStorageData(common);
    // this.setData({
    //   saveApp: wx.getSystemInfoSync().platform == 'ios' ? '添加到我的小程序' : '添加到桌面'
    // });
    //同步审核状态
    getApp().globalData.getOpenLevel.then(data => {
      this.setData({
        openLevel: data.level
      });
    });
    wx.updateShareMenu({
      withShareTicket: true
    });
    this.data.cur_level = getApp().globalData.wnds.Wnd_Play.CurrLevel
    var total_point_temp = LCData.GetNumber(LCData.ParamName.TOTAL_POINT)
    if (this.data.cur_level < 1) {
      this.data.cur_level = 1;
    }
    //获取级别和主图片
    var main_img_temp = "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/pic/obj_" + this.data.cur_level + ".jpg";
    if (this.data.cur_level > 501) {
      main_img_temp = "http://cyktc.oss-cn-beijing.aliyuncs.com/cyimg_rename/" + common.PIC[this.data.cur_level - 502];
    }
    var level_temp
    for (level_temp = 1; level_temp < 17; level_temp++) {
      if (this.data.cur_level < (2 * level_temp + 1) * (2 * level_temp + 1)) {
        break;
      }
    }
    var level_icon_temp = "http://cyktc.oss-cn-beijing.aliyuncs.com/level/level_" + level_temp + ".png"
    //生成40个（0-09）乱序不重复的数
    this.getRandomArr();
    var ansTemp = []
    for (var i = 0; i < 4; i++) {
      ansTemp[i] = 24;
    }
    var array_show_temp = []
    for (var i = 0; i < 24; i++) {
      array_show_temp[i] = true;
    }
    var pointAddTemp = false;
    var showAdTemp = true;
    try {
      var res = wx.getSystemInfoSync()
      console.log(res.model)
      var str = res.model;
      if (str.search("iPhone") != -1) {
        showAdTemp = true
      } else {
        pointAddTemp = true;
      }
    } catch (e) {
      // Do something when catch error
    }
    if (this.data.cur_level < 15) {
      pointAddTemp = false;
    }
    if (this.data.cur_level < 10 || wx.getStorageSync("pay_finish") == "1") {
      showAdTemp = false;
    }
    // if (wx.getStorageSync("CLICK_USER") == ""){
    //   showAdTemp = true
    // }
    // 调用应用实例的方法获取全局数据
    let app = getApp();
    // toast组件实例
    new app.ToastPannel();
    console.log("showadtemp")
    if (showAdTemp) {
      console.log("showadtemp")
      if (wx.getStorageSync("LOCAL_GENDER") != wx.getStorageSync("SHOW_GENDER")) {
        var repeat = Number(wx.getStorageSync("SHOW_REPEAT"))
        var lastTime = Number(wx.getStorageSync("JUMP_LAST_TIME"))
        if (wx.getStorageSync("SHOW_AD") == "2" && (wx.getStorageSync("CLICK_USER" + wx.getStorageSync("SHOW_APP_ID")) == "" || (new Date()).getTime() > lastTime + repeat * 86400000)) {
          if (wx.getStorageSync("PHONE_MODEL") == wx.getStorageSync("SHOW_MODEL") || wx.getStorageSync("SHOW_MODEL") == "0") {
            var many = Number(wx.getStorageSync("SHOW_MANY"))
            if (((new Date()).getTime() % 10) < many) {
              if ((new Date()).getTime() % 3 == 0) {
                this.show("点击底部广告条，即可获得200金币哦", 2000)
              }
              this.setData({
                banner_sts: true
              })
            }
          }
        }
      }
    }
    //pointAddTemp = true
    this.setData({
      ans: ansTemp,
      array_show: array_show_temp,
      main_img_url: main_img_temp,
      level_icon_url: level_icon_temp,
      total_point: total_point_temp,
      pointAdd: pointAddTemp,
      showAd: showAdTemp
    })


  },
  shareOthers: {},
  onShow: function() {
    this.hongBao = this.selectComponent('#hongBao');
    // this.hongBao.loadData()
    // this.hongBao.openReward(true);
    var total_point_temp = LCData.GetNumber(LCData.ParamName.TOTAL_POINT)
    var showAdTemp = this.data.showAd;
    this.setData({
      liveTime: wx.getStorageSync('lucyBagTime'),
      lucyBagLv: wx.getStorageSync('lucyBagLv')
    })
    time = app.globalData.dailylucybag[wx.getStorageSync('lucyBagLv')] * 60 - wx.getStorageSync('lucyBagTime')
    time = time <= 0 ? 0 : time
    let date = new Date(time * 1000)
    let minute = '0' + date.getMinutes()
    let sec = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
    that.setData({
      remainingTime: '00:' + minute + ':' + sec
    })
    timeing = setInterval(() => {
      if (wx.getStorageSync('lucyBagLv') <= 3) {
        time = app.globalData.dailylucybag[wx.getStorageSync('lucyBagLv')] * 60 - wx.getStorageSync('lucyBagTime')
        time = time <= 0 ? 0 : time
        let date = new Date(time * 1000)
        let minute = '0' + date.getMinutes()
        let sec = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
        that.setData({
          remainingTime: '00:' + minute + ':' + sec
        })
      }
    }, 1000)
    if (wx.getStorageSync("pay_finish") == "1") {
      showAdTemp = false
    }
    this.setData({
      total_point: total_point_temp,
      showAd: showAdTemp
    })
    console.log(this.shareOthers.serial, this.shareOthers.res)
    if (app.onShareJudge(this.shareOthers)) {
      // this.shareManage(this.shareOthers.serial, this.shareOthers.shareInfo, '');
      console.log(12313123123456)
      this.shareManage(this.shareOthers.serial, this.shareOthers.res);
    }
    this.shareOthers = {};
    if (wx.getStorageSync('havevideo')){
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
  playvideo: function(type) {
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
        wx.setStorageSync('havevideo',false)
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

      if (type.detail == 'newUserGift') {
        that.setData({
          newUserGiftShare: true //如果分享到群里了则可以领取多倍
        });
        setTimeout(() => {
          that.newUserGiftReward()
        }, 500)
      } else if (type.detail == 'hongBao') {
        that.hongBao.openReward(true);
      } else if (type.detail == 'dayUserGift') {
        that.setData({
          dayUserGiftShare: true
        });
        setTimeout(() => {
          that.dayUserGiftReward();
        }, 500)

      } else {
        var emptyIndex = that.getEmptyItem()
        if (emptyIndex == -1) { //如果没有空的
          wx.showToast({
            title: '先删除错误答案',
            icon: 'success',
            image: '../../imgs/comm/warn.png',
            duration: 2000
          })
          return;
        }
        var tipsContent = common.ALL_IDIOMS[that.data.cur_level - 1].substr(emptyIndex, 1)
        console.log("===" + tipsContent)
        for (var i = 0; i < 24; i++) {
          if (tipsContent == that.data.array[i]) {
            that.updateData(i, emptyIndex)
            break;
          }
        }
      }

    } else {
      wx.showToast({
        title: '请看完视频哦~',
        icon: 'none'
      })
    }
    videoAd.offClose(that.callback)
  },
  onHide() {
    this.shareOthers.share1 = true;
    clearInterval(timeing)
  },
  addPoint: function() {
    // getApp().globalData.wnds.Wnd_Pay.Show()
  },
  //单击答案按钮
  clickAns: function(event) {
    //传回当前按的是哪个按钮
    var cur_item = event.currentTarget.dataset.item;
    if (this.data.ans[cur_item] == 24) {
      return;
    }
    var ansTemp = []
    for (var i = 0; i < 4; i++) {
      ansTemp[i] = this.data.ans[i]
    }
    var array_show_temp = []
    for (var i = 0; i < 24; i++) {
      array_show_temp[i] = this.data.array_show[i]
    }
    array_show_temp[ansTemp[cur_item]] = true
    ansTemp[cur_item] = 24
    this.setData({
      ans: ansTemp,
      array_show: array_show_temp
    })
  },
  //单击列表按钮
  clickItem: function(event) {
    //传回当前按的是哪个按钮
    var cur_item = event.currentTarget.dataset.item;
    var emptyIndex = -1;
    for (var i = 0; i < 4; i++) {
      if (this.data.ans[i] == 24) {
        if (emptyIndex == -1) {
          emptyIndex = i
        }
      } else if (cur_item == this.data.ans[i]) { //已经点过了
        return;
      }
    }
    if (emptyIndex == -1) { //如果没有空的
      wx.showToast({
        title: '先删除错误答案',
        icon: 'success',
        image: '../../imgs/comm/warn.png',
        duration: 2000
      })
      return;
    }
    this.updateData(cur_item, emptyIndex)
  },
  clickFree: function(event) {
    console.log("===")
  },
  getPoint: function() {
    // if(this.data.openLevel!='0'){
    //   wx.showToast({
    //     title: '分享可获金币哦！',
    //     icon: 'success',
    //     duration: 2000
    //   })
    //   return;
    // }
  },
  //提示======================================
  showTips: function(event) {
    var emptyIndex = this.getEmptyItem()
    if (emptyIndex == -1) { //如果没有空的
      wx.showToast({
        title: '先删除错误答案',
        icon: 'success',
        image: '../../imgs/comm/warn.png',
        duration: 2000
      })
      return;
    }
    var cusPoint = 0;
    if (this.data.cur_level < 350) {
      cusPoint = 30;
    } else if (this.data.cur_level < 700) {
      cusPoint = 50;
    } else {
      cusPoint = 70;
    }
    if (this.data.total_point < cusPoint) {
      // wx.showToast({
      //   title: '金币不够哦！',
      //   icon: 'success',
      //   image: '../../imgs/comm/warn.png',
      //   duration: 2000
      // })
      try {
        var res = wx.getSystemInfoSync()
        console.log(res.model)
        var str = res.model;
        if (str.search("iPhone") != -1) {
          wx.showToast({
            title: '金币不够哦！',
            icon: 'success',
            image: '../../imgs/comm/warn.png',
            duration: 2000
          })
          return
        } else {}
      } catch (e) {
        // Do something when catch error
      }
      wx.showToast({
        title: '金币不足',
        icon: 'none'
      })
      // wx.showModal({
      //   title: '提示',
      //   content: '金币不足咯，获取更多金币？',
      //   cancelText: '返回',
      //   confirmText: '好的',
      //   success: function(res) {
      //     if (res.confirm) {
      //       wx.navigateTo({
      //         url: '../pay/pay'
      //       })
      //     }
      //   }
      // })
      return;
    } else {
      var total_point_temp = this.data.total_point - cusPoint
      LCData.Set(LCData.ParamName.TOTAL_POINT, total_point_temp)
      this.setData({
        total_point: total_point_temp
      })
    }
    var tipsContent = common.ALL_IDIOMS[this.data.cur_level - 1].substr(emptyIndex, 1)
    console.log("===" + tipsContent)
    for (var i = 0; i < 24; i++) {
      if (tipsContent == this.data.array[i]) {
        this.updateData(i, emptyIndex)
        break;
      }
    }
  },
  help: function() {},
  onShareAppMessage: function(res) {
    let serial = 0;
    if (res.target && res.target.id == 'hongbao') {
      serial = 15;
    } else if (res.from == 'button' && res.target && res.target && res.target.id == 'newUserGift') {
      serial = 2
    } else if (res.from == 'button' && res.target && res.target && res.target.id == 'dayUserGift') {
      serial = 3;
    } else if (res.from == 'button' && res.target && res.target && res.target.id == 'showtips') {
      console.log('提示分享')
      serial = 5;
    } else {
      serial = 4;
    }
    console.log(serial)
    if (wx.getSystemInfoSync().version > '6.7.2') {
      console.log('高版本');
      this.shareOthers.share = true;
      this.shareOthers.time = +new Date();
      this.shareOthers.res = res;
      this.shareOthers.serial = serial;
      let shareInfo = {
        serial: serial,
        scoreValue: getApp().getScore()
      };
      this.shareOthers.shareInfo = shareInfo;
      console.log('查看本地', wx.getStorageSync('mpsdk_shareInfoList'));
      console.log('进入了新的分享');
      return mpsdk.Share.commonShare(shareInfo, null, null, this);
      // }
      // return {
      //   title: shareInfo.text || ('我已经闯过' + this.data.cur_level + "关，谁与我战？"),
      //   path: mpsdk.Share.getShareLink(serial, '/pages/index/index', '', shareInfo.id || ''),
      //   imageUrl: shareInfo.image
      // }
    } else {
      //新手礼包
      if (res.from == 'button' && res.target && res.target.id == 'newUserGift') {
        let shareInfo = {
          serial: 2,
          scoreValue: getApp().getScore()
        };
        let success = function(res) {
          if (this.data.openLevel == '2' && !res.shareTickets) { //强制分享到群
            wx.showToast({
              title: '分享到群可获得5倍奖励',
              icon: 'none'
            });
            return;
          }
          this.setData({
            newUserGiftShare: res.shareTickets ? true : false, //如果分享到群里了则可以领取多倍
          });
          this.newUserGiftReward();
        }
        return mpsdk.Share.commonShare(shareInfo, success, null, this);
      }
      //日常礼包
      else if (res.from == 'button' && res.target && res.target.id == 'dayUserGift') {
        let shareInfo = {
          serial: 3,
          scoreValue: getApp().getScore()
        };
        let success = function(res) {
          if (this.data.openLevel == '2' && !res.shareTickets) { //强制分享到群
            wx.showToast({
              title: '分享到群可获得5倍奖励',
              icon: 'none'
            });
            return;
          }
          this.setData({
            dayUserGiftShare: res.shareTickets ? true : false
          });
          this.dayUserGiftReward();
        }
        return mpsdk.Share.commonShare(shareInfo, success, null, this);
      } else if (res.from == 'button' && res.target && res.target.id == 'hongbao') {
        console.log('不给奖励分享');
        let shareInfo = {
          serial: 15,
          scoreValue: getApp().getScore()
        };
        let that = this;
        return mpsdk.Share.commonShare(shareInfo, () => {
          console.log('12313123323')
          that.hongBao.openReward(true);
        });
      } else if (res.from == 'button' && res.target && res.target && res.target.id == 'showtips') {
        let shareInfo = {
          serial: 5,
          scoreValue: getApp().getScore()
        };
        let success = function(res) {
          //给提示
          var emptyIndex = this.getEmptyItem()
          if (emptyIndex == -1) { //如果没有空的
            wx.showToast({
              title: '先删除错误答案',
              icon: 'success',
              image: '../../imgs/comm/warn.png',
              duration: 2000
            })
            return;
          }
          var tipsContent = common.ALL_IDIOMS[this.data.cur_level - 1].substr(emptyIndex, 1)
          console.log("===" + tipsContent)
          for (var i = 0; i < 24; i++) {
            if (tipsContent == this.data.array[i]) {
              this.updateData(i, emptyIndex)
              break;
            }
          }
        }
        return mpsdk.Share.commonShare(shareInfo, success, null, this);
      }
      //分享不给奖励
      else {
        console.log('不给奖励分享');
        let shareInfo = {
          serial: 4,
          scoreValue: getApp().getScore()
        };
        return mpsdk.Share.commonShare(shareInfo);
      }
    }
  },
  shareManage(serial, res) {
    console.log('触发了新的机制', res);
    //新手礼包
    if (res.from == 'button' && res.target && res.target.id && res.target.id == 'newUserGift') {
      let shareInfo = {
        serial: 2,
        scoreValue: getApp().getScore()
      };
      console.log('进入了新手礼包');
      let success = null;
      // function (res) {
      // if (this.data.openLevel == '2' && !res.shareTickets) { //强制分享到群
      //   wx.showToast({
      //     title: '分享到群可获得5倍奖励',
      //     icon: 'none'
      //   });
      //   return;
      // }
      this.setData({
        newUserGiftShare: true //如果分享到群里了则可以领取多倍
      });

      this.newUserGiftReward();
      // }
      // return mpsdk.Share.commonShare(shareInfo, success, null, this);
    }
    //日常礼包
    else if (res.from == 'button' && res.target && res.target.id && res.target.id == 'dayUserGift') {
      let shareInfo = {
        serial: 3,
        scoreValue: getApp().getScore()
      };
      console.log('进入了日常礼包');
      let success = null;
      // function (res) {
      // if (this.data.openLevel == '2' && !res.shareTickets) { //强制分享到群
      //   wx.showToast({
      //     title: '分享到群可获得5倍奖励',
      //     icon: 'none'
      //   });
      //   return;
      // }
      this.setData({
        dayUserGiftShare: true
      });
      this.dayUserGiftReward();
      // }
      // return mpsdk.Share.commonShare(shareInfo, success, null, this);
    } else if (res.from == 'button' && res.target && res.target.id && res.target.id == 'hongbao') {
      let shareInfo = {
        serial: 15,
        scoreValue: getApp().getScore()
      };
      console.log('进入了红包分享');
      let success = null;
      this.hongBao.openReward(true);
      // function (res) {
      // if (this.data.openLevel == '2' && !res.shareTickets) { //强制分享到群
      //   wx.showToast({
      //     title: '分享到群可获得5倍奖励',
      //     icon: 'none'
      //   });
      //   return;
      // }
      // this.setData({
      //   dayUserGiftShare:  true 
      // });
      // this.dayUserGiftReward();
      // }
      // return mpsdk.Share.commonShare(shareInfo, success, null, this);
    } else if (res.from == 'button' && res.target && res.target && res.target.id == 'showtips') {
      //给提示
      var emptyIndex = this.getEmptyItem()
      if (emptyIndex == -1) { //如果没有空的
        wx.showToast({
          title: '先删除错误答案',
          icon: 'success',
          image: '../../imgs/comm/warn.png',
          duration: 2000
        })
        return;
      }
      var tipsContent = common.ALL_IDIOMS[this.data.cur_level - 1].substr(emptyIndex, 1)
      console.log("===" + tipsContent)
      for (var i = 0; i < 24; i++) {
        if (tipsContent == this.data.array[i]) {
          this.updateData(i, emptyIndex)
          break;
        }
      }
    }
    //分享不给奖励
    else
    //  if (this.data.openLevel == '0') {
    //   console.log('不给奖励分享');
    //   let shareInfo = {
    //     serial: 4,
    //     scoreValue: getApp().getScore()
    //   };
    //   // return mpsdk.Share.commonShare(shareInfo);
    // }
    //普通分享
    // else 
    {
      console.log('普通分享');
      return share.getCGShareContent(this, this.data.cur_level, this.shareOthers);
      // share.getCGShareContent(this, this.data.cur_level, this.shareOthers)
    }
    // if (serial == 2 || serial == 3 || serial==4){
    //   mpsdk.Share.reportShareOut(serial, shareInfo.id, res.shareTickets || '');
    // }
    // //新手礼包
    // if (serial==2){
    //   if (this.data.openLevel == '2' ) { //强制分享到群
    //     wx.showToast({
    //       title: '分享到群可获得5倍奖励',
    //       icon: 'none'
    //     });
    //     return;
    //   }
    //   this.setData({
    //     newUserGiftShare: true //如果分享到群里了则可以领取多倍
    //   });
    //   this.newUserGiftReward();
    // }else if(serial==3){//日常
    //   if (this.data.openLevel == '2' ) { //强制分享到群
    //     wx.showToast({
    //       title: '分享到群可获得5倍奖励',
    //       icon: 'none'
    //     });
    //     return;
    //   }
    //   this.setData({
    //     dayUserGiftShare:  true 
    //   });
    //   this.dayUserGiftReward();
    // }else if(serial==4){//分享不给奖励
    //   console.log('不给奖励分享');
    // }else{//普通分享
    //   console.log('普通分享');
    //   return share.getCGShareContent(this, this.data.cur_level, this.shareOthers);
    // }
    // if (serial == 15) {
    //   console.log('这里是红包分享');
    //   this.hongBao.openReward(true);
    // }
  },
  onReady: function() {
    this.dialog = this.selectComponent('#dialog');
    var level_temp
    for (level_temp = 1; level_temp < 17; level_temp++) {
      if (this.data.cur_level < (2 * level_temp + 1) * (2 * level_temp + 1)) {
        break;
      }
    }
    var level = 1
    if (level_temp == 1) {
      level = this.data.cur_level
    } else {
      level = this.data.cur_level - (2 * level_temp - 1) * (2 * level_temp - 1) + 1
    }
    wx.setNavigationBarTitle({
      title: "【" + common.LEVEL_NAMES[level_temp - 1] + "】"
    });
    this.setData({
      cur_turn_level: level
    })
  },
  //对第curItem个字进行选中操作
  updateData: function(cur_item, emptyIndex) {
    var ansTemp = []
    for (var i = 0; i < 4; i++) {
      ansTemp[i] = this.data.ans[i]
    }
    ansTemp[emptyIndex] = cur_item
    var array_show_temp = []
    for (var i = 0; i < 24; i++) {
      array_show_temp[i] = this.data.array_show[i]
    }
    for (var i = 0; i < 4; i++) {
      if (ansTemp[i] != 24) {
        array_show_temp[ansTemp[i]] = false;
      }
    }
    this.setData({
      ans: ansTemp,
      array_show: array_show_temp
    })
    var ansStr = ""
    for (var i = 0; i < 4; i++) {
      if (ansTemp[i] == 24) {
        return;
      } else {
        ansStr = ansStr + this.data.array[ansTemp[i]]
      }
    }
    //答案错误
    if (ansStr != common.ALL_IDIOMS[this.data.cur_level - 1]) {
      wx.showToast({
        title: '存在错误哦',
        icon: 'success',
        image: '../../imgs/comm/warn.png',
        duration: 2000
      });
      return;
    }
    //通关.length
    if (this.data.cur_level >= common.EXPLAIN.length) {
      wx.showModal({
        title: '通关啦',
        content: '您太厉害啦！试试挑战分期题库？',
        cancelText: '取消',
        confirmText: '好的',
        success: function(res) {
          if (!res.confirm) {
            return;
          }
          if (wx.navigateToMiniProgram) {
            wx.redirectTo({
              url: '../number/number',
            })
          } else {
            wx.showToast({
              title: '微信版本过低',
              duration: 2000,
            })
          }
        }
      })
      return;
    }
    mpsdk.Report.reportEvent(5, this.data.cur_level)
    this.data.cur_level += 1;
    getApp().globalData.wnds.Wnd_Play.CurrLevel = this.data.cur_level
    //破纪录
    if (this.data.cur_level > LCData.GetNumber(LCData.ParamName.PASS_LEVELS)) {
      LCData.Set(LCData.ParamName.PASS_LEVELS, this.data.cur_level)
      this.data.total_point = this.data.total_point + 5;
      LCData.Set(LCData.ParamName.TOTAL_POINT, this.data.total_point)
      this.dayUserGiftRecord(this.data.cur_level);
    }
    //报日志
    if (this.data.cur_level == 100 && wx.getStorageSync("UPLOAD_100") == "") {
      wx.setStorageSync("UPLOAD_100", 1)
      wx.reportAnalytics("pass_level_100", {
        handrad: 1
      })
    }
    if (this.data.cur_level == 200 && wx.getStorageSync("UPLOAD_200") == "") {
      wx.setStorageSync("UPLOAD_200", 1)
      wx.reportAnalytics("pass_level_200", {
        two_handrad: 1
      })
    }
    if (this.data.cur_level == 300 && wx.getStorageSync("UPLOAD_300") == "") {
      wx.setStorageSync("UPLOAD_300", 1)
      wx.reportAnalytics("pass_level_300", {
        three_handrad: 1
      })
    }
    //如果新手大礼包或日常礼包都不能领取则直接显示过关界面
    if (this.data.openLevel == '0' || (!this.newUserGift() && !this.dayUserGift())) {
      this.showLevelComplete();
    }
  },
  // 记录刷新次数
  tiaoNum: 1,
  /**
   * 显示过关界面
   */
  showLevelComplete: function() {
    if (this.hongBao.hongbaoShowJude()) {
      this.hongBao.loadData();
    } else {
      let that = this;
      var levelIndex = this.data.cur_level - 2
      this.dialog.setData({
        dialogShow: true,
        title: common.ALL_IDIOMS[levelIndex],
        content: '【解释】：' + common.EXPLAIN[levelIndex] + "\n\n金币 +5"
      });
      //每五关显示一次插屏

      console.log('插屏广告', this.data.cur_level - 1)
      if (InterstitialAd && (this.data.cur_level - 1) % Number(app.globalData.InterstitialAdNum) == 0) {
        console.log('插屏广告')
        InterstitialAd.show()
      } else {
        console.log('不插屏广告')
      }
      //判断条件 大于10的偶数关 并且概率切换 概率误点
      // if (this.data.cur_level - 1 > 10 && this.data.cur_level % 2 != 0 && app.getchangeadgl()){
      //     console.log('切换生效了')
      //     this.setData({
      //       showhwPddYouLike:false,
      //       nextbottom: 880
      //     })
      //   change = setTimeout(() => {
      //         that.setData({
      //           nextbottom:880,
      //           showhwPddYouLike: true
      //         })
      //   }, app.globalData.changeadtime*1000)
      // }
      this.setData({
        shownext: true
      });
      console.log('获取弹窗信息', this.dialog);
    }
    // wx.showModal({
    //   title: common.ALL_IDIOMS[levelIndex],
    //   content: '【解释】：' + common.EXPLAIN[levelIndex] + "\n\n金币 +5",
    //   showCancel: false,
    //   success: function() {
    //   }
    // });
  },
  tongguanShowFn() {
    let that = this;
    var levelIndex = this.data.cur_level - 2
    this.dialog.setData({
      dialogShow: true,
      title: common.ALL_IDIOMS[levelIndex],
      content: '【解释】：' + common.EXPLAIN[levelIndex] + "\n\n金币 +5"
    });
    // //判断条件 大于10的偶数关 并且概率切换
    // if (this.data.cur_level - 1 > 10 && this.data.cur_level % 2 != 0 && app.getchangeadgl()) {
    //   console.log('切换生效了')
    //   this.setData({
    //     showhwPddYouLike: false,
    //     nextbottom: 880
    //   })
    //   change = setTimeout(() => {
    //     that.setData({
    //       nextbottom: 880,
    //       showhwPddYouLike: true
    //     })
    //   }, app.globalData.changeadtime * 1000)
    // }
    this.setData({
      shownext: true
    });
    console.log('获取弹窗信息', this.dialog);
  },
  dialogConfirmTap() {
    let that = this;
    this.dialog.setData({
      dialogShow: false
    });
    clearTimeout(change)
    this.setData({
      shownext: false
    });
    // this.setData({
    //   nextbottom:880,
    //   showhwPddYouLike: true
    // })
    if (that.tiaoNum < app.globalData.bannerrefresh) {
      that.onLoad();
      that.onShow();
      that.onReady();
      that.tiaoNum++;
    } else {
      wx.setStorageSync('isShowWX', this.data.isShowWx ? false : true);
      wx.redirectTo({
        url: 'play'
      });
    }
  },
  //初始化=============================================================================
  //获取随机数
  getRandom: function(num) {
    var r = Math.random() * (num);
    var re = Math.round(r);
    re = Math.max(Math.min(re, num), 0)
    return re;
  },
  //生成40个（0-39）乱序不重复的数
  getRandomArr: function() {
    //当前关卡后的10个成语
    var ten_idioms = ""
    for (var i = 1; i < 11; i++) {
      console.log("===" + common.ALL_IDIOMS[(this.data.cur_level - 1) + i])
      ten_idioms = ten_idioms + common.ALL_IDIOMS[(this.data.cur_level - 1) + i];
    }
    ten_idioms = common.ALL_IDIOMS[this.data.cur_level - 1] + ten_idioms;
    var arr_index = []
    for (var i = 0; i < 120; i++) {
      var temp = this.getRandom(40)
      if (temp == 40) {
        temp = 0;
      }
      if (-1 == arr_index.indexOf(temp)) {
        arr_index[arr_index.length] = temp;
      }
    }
    if (arr_index.length < 40) {
      var change = true;
      for (var j = arr_index.length; j < 40; j++) {
        if (change) {
          change = false;
          for (var i = 0; i < 40; i++) {
            if (arr_index.indexOf(i) == -1) {
              arr_index[j] = i;
            }
          }
        } else {
          change = true;
          for (var i = 39; i >= 0; i--) {
            if (arr_index.indexOf(i) == -1) {
              arr_index[j] = i;
            }
          }
        }
      }
    }
    for (var i = 0; i < 4; i++) {
      if (arr_index.indexOf(i) < 24) {
        continue;
      } else {
        while (true) {
          var temp = this.getRandom(23);
          if (arr_index[temp] < 4) {} else {
            arr_index[temp] = i;
            break;
          }
        }
      }
    }
    var arr = [];
    for (var i = 0; i < 24; i++) {
      arr[i] = ten_idioms.substr(arr_index[i], 1);
    }
    arr[24] = ""
    this.setData({
      array: arr
    })
  },
  //获取空的答案想，用于提示
  getEmptyItem: function() {
    var index = -1
    var time = (new Date()).getTime()
    if (time % 3 == 2) {
      if (this.data.ans[1] == 24) {
        index = 1;
      } else if (this.data.ans[3] == 24) {
        index = 3;
      } else if (this.data.ans[2] == 24) {
        index = 2;
      } else if (this.data.ans[0] == 24) {
        index = 0;
      } else {
        index = -1;
      }
    } else if (time % 3 == 1) {
      if (this.data.ans[3] == 24) {
        index = 3;
      } else if (this.data.ans[1] == 24) {
        index = 1;
      } else if (this.data.ans[2] == 24) {
        index = 2;
      } else if (this.data.ans[0] == 24) {
        index = 0;
      } else {
        index = -1;
      }
    } else {
      if (this.data.ans[2] == 24) {
        index = 2;
      } else if (this.data.ans[1] == 24) {
        index = 1;
      } else if (this.data.ans[3] == 24) {
        index = 3;
      } else if (this.data.ans[0] == 24) {
        index = 0;
      } else {
        index = -1;
      }
    }
    return index;
  },
  jump: function() {
    wx.setStorageSync("JUMP_LAST_TIME", (new Date()).getTime())
    var point_temp = this.data.total_point + 200;
    LCData.Set(LCData.ParamName.TOTAL_POINT, point_temp)
    this.setData({
      total_point: point_temp
    })
    // wx.showToast({
    //   title: '获得200金币',
    //   duration: 2000
    // })
    wx.reportAnalytics("click_ad" + wx.getStorageSync("SHOW_APP_ID"), {
      count: 1
    })
    var page = ''
    if (wx.getStorageSync("SHOW_PAGE") == "") {} else {
      page = wx.getStorageSync("SHOW_PAGE")
    }
    if (wx.navigateToMiniProgram) {
      this.setData({
        banner_sts: false
      })
      wx.navigateToMiniProgram({
        appId: wx.getStorageSync("SHOW_APP_ID"),
        path: page,
        success(res) {
          // 打开成功
          if (wx.getStorageSync("CLICK_USER" + wx.getStorageSync("SHOW_APP_ID")) == "") {
            wx.setStorage({
              key: 'CLICK_USER' + wx.getStorageSync("SHOW_APP_ID"),
              data: "0",
            })
            wx.setStorageSync("CLICK_USER" + wx.getStorageSync("SHOW_APP_ID"), "0")
            wx.reportAnalytics("click_success" + wx.getStorageSync("SHOW_APP_ID"), {
              success_count: 1
            })
          }
          //提交
          var up = Number(wx.getStorageSync("SHOW_UP"))
          if (((new Date()).getTime()) % up == 0) {
            console.log("log===========")
            wx.reportAnalytics("click_ad" + wx.getStorageSync("SHOW_APP_ID"), {
              count: 1
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '微信版本过低',
        duration: 2000
      })
    }
  },
  /**
   * 显示新手礼包
   * @return 满足领取条件时返回true，否则返回false
   */
  newUserGift: function() {
    let level = this.data.cur_level - 1;
    //只有特定关卡可以领取新手礼包
    if ([3, 10, 20, 35, 50].indexOf(level) == -1) {
      return false;
    }
    //因为新用户首日是不能签到的，能签到的话会强制签到，所以只要签过到的用户都不能领取新手礼包
    let lastSign = LCData.GetNumber(LCData.ParamName.LAST_SIGNIN);
    if (lastSign) {
      return false;
    }
    //已经领取过的话那肯定是不能重复领取的
    if (wx.getStorageSync('newUserGift' + level)) {
      return false;
    }
    //显示新手礼包
    this.setData({
      newUserGift: true,
      newUserGiftCoinNum: 30
    });
    return true;
  },
  /**
   * 领取新手礼包
   */
  newUserGiftReward: function() {
    var that = this;
    //已经领取过的话那肯定是不能重复领取的
    let level = this.data.cur_level;
    if (wx.getStorageSync('newUserGift' + level)) {
      setTimeout(() => {
        //关闭对话框
        that.setData({
          newUserGift: false
        });
        that.showLevelComplete();
      }, 1550);
      return;
    }
    //写入领取记录
    wx.setStorageSync('newUserGift' + level, 1);
    //计算应得金币
    let coins = 30;
    if (this.data.newUserGiftShare) {
      coins *= 5;
    }
    //发放金币
    this.setData({
      total_point: this.data.total_point + coins
    });
    LCData.Set(LCData.ParamName.TOTAL_POINT, this.data.total_point);
    //提示
    // wx.showToast({
    //   title: '获得' + coins + '金币',
    //   duration: 1500,
    // });

    setTimeout(() => {
      //关闭对话框
      that.setData({
        newUserGift: false
      });
      that.showLevelComplete();
    }, 1550);
  },
  /**
   * 显示日常礼包
   * @return 满足领取条件时返回true，否则返回false
   */
  dayUserGift: function() {
    //签过到的都是老用户，只有老用户有日常礼包
    let lastSign = LCData.GetNumber(LCData.ParamName.LAST_SIGNIN);
    if (!lastSign) {
      return false;
    }
    let dayUserGiftData = this.dayUserGiftRecord();
    //当天打满规定关卡数才能领取，已领取过不能重复领取
    let rewardKey = 'reward' + dayUserGiftData.levels.length;
    if (dayUserGiftData[rewardKey] !== false) {
      return false;
    }
    //显示日常礼包
    this.setData({
      dayUserGift: true,
      dayUserGiftCoinNum: 30
    });
    // //判断条件 大于10的偶数关 并且概率切换
    // if (this.data.cur_level - 1 > 10  && app.getchangeadgl()) {
    //   console.log('切换生效了')
    //   this.setData({
    //     showhwPddYouLike: false,
    //     marginbottom: 160
    //   })
    //   change = setTimeout(() => {
    //     that.setData({
    //       marginbottom: 160,
    //       showhwPddYouLike: true
    //     })
    //   }, app.globalData.changeadtime * 1000)
    // }
    return true;
  },
  /**
   * 日常礼包数据记录
   */
  dayUserGiftRecord: function(level) {
    let date = new Date().toLocaleDateString();
    //初始化数据
    let data = wx.getStorageSync('dayUserGift');
    if (!data || data.date != date) {
      data = {
        date: date,
        levels: [],
        reward5: false,
        reward15: false,
        reward30: false,
        // reward1: false,
        // reward2: false,
        // reward3: false,
      }
      wx.setStorageSync('dayUserGift', data);
    }
    //返回数据
    if (!level || isNaN(level)) {
      return data;
    }
    //通关记录
    level = parseInt(level);
    if (data.levels.indexOf(level) == -1) {
      data.levels.push(level);
      wx.setStorageSync('dayUserGift', data);
    }
  },
  /**
   * 领取日常礼包
   */
  dayUserGiftReward: function() {
    let dayUserGiftData = this.dayUserGiftRecord();
    //当天打满规定关卡数才能领取，已领取过不能重复领取
    let rewardKey = 'reward' + dayUserGiftData.levels.length;
    if (dayUserGiftData[rewardKey] !== false) {
      console.log('当天打满规定关卡数才能领取，已领取过不能重复领取');
      return;
    }
    //写入领取记录
    dayUserGiftData[rewardKey] = true;
    wx.setStorageSync('dayUserGift', dayUserGiftData);
    //计算应得金币
    let coins = 30;
    if (this.data.dayUserGiftShare) {
      coins *= 5;
    }
    //发放金币
    this.setData({
      total_point: this.data.total_point + coins
    });
    LCData.Set(LCData.ParamName.TOTAL_POINT, this.data.total_point);
    //提示
    // wx.showToast({
    //   title: '获得' + coins + '金币',
    //   duration: 1500
    // });
    let that = this;
    setTimeout(() => {
      //关闭对话框
      that.setData({
        dayUserGift: false
      });
      that.showLevelComplete();
      // that.setData({
      //   marginbottom: 160,
      //   showhwPddYouLike:true
      // })
    }, 1550);
  },
  openhongbao: function() {
    if (this.data.remainingTime == '00:00:00') {
      this.hongBao.loadData(false)
      let lucyBagLvTemp = wx.getStorageSync('lucyBagLv')
      wx.setStorageSync('lucyBagLv', lucyBagLvTemp + 1)
      this.setData({
        lucyBagLv: lucyBagLvTemp + 1,
        liveTime: 0
      })
      wx.setStorageSync('lucyBagTime', 0)
    }
  },
  tofuli: function() {
    wx.navigateTo({
      url: '/pages/welfare/welfare',
    })
  },
  tocytz: function() {
    mpsdk.Ad.loadFilterData().then(function(_a) {
      var filterData = _a;
      console.log('filterData', filterData)
      let gamelist = mpsdk.Ad.dataFixPip(wx.getStorageSync('mpsdk_suggestList'), filterData.gender, filterData.userValue)
      let cytz = gamelist.filter(item => item.appid == 'wx776f8e75a5858a0a')
      console.log('cytz', cytz)
      if (cytz.length == 0) {
        console.log('未找到成语中状元appitem 请检查配置')
        return
      }
      mpsdk.Ad.click(cytz[0], 1)
    }).catch(() => {
      let gamelist = mpsdk.Ad.dataFixPip(wx.getStorageSync('mpsdk_suggestList'), '', '')
      let cytz = gamelist.filter(item => item.appid == 'wx776f8e75a5858a0a')
      console.log('cytz', cytz)
      if (cytz.length == 0) {
        console.log('未找到成语中状元appitem 请检查配置')
        return
      }
      mpsdk.Ad.click(cytz[0], 1)
    })
  }
})