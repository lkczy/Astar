//play.js
//获取应用实例
var common = require("../../utils/util.js")
import * as LCData from "../../modules/LocalData"
import {
  share
} from "../../dati_comm/modules/share"
const mpsdk = require('../../utils/mpsdk.js');
var app = getApp()
let showloadingstate = true
let videoAd
let that
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
    level_id: 1,
    idom_arr: [],
    explain_arr: [],
    xth: [],
    isShowWx: true,
    userid: mpsdk.Account.getAccount().openid,
    openLevel: 0,
    cnxhstate: false,
    cytzstate: 0,
    ShareOrVideo: 1
  },
  onLoad: function(option) {

    that = this
    //同步审核状态
    getApp().globalData.getOpenLevel.then(data => {
      this.setData({
        openLevel: data.level
      });
    });

    // if (option && option.types) {
    //   console.log('从外面进来的');
    this.setData({
      isShowWx: true,
      userid: wx.getStorageSync('pdduserId') || mpsdk.Account.getAccount().openid
    });
    wx.setStorageSync('isShowWX', true)
    // } else {
    //   console.log('旧的进来后................', wx.getStorageSync('isShowWX'));
    //   this.setData({
    //     isShowWx: wx.getStorageSync('isShowWX')
    //   });
    // }
    getApp().getStorageData(common);
    var id;
    if (option && option.id) {
      id = option.id
    } else {
      id = this.data.level_id
    }
    this.data.level_id = id


    var total_point_temp = LCData.GetNumber(LCData.ParamName.TOTAL_POINT)

    if (this.data.cur_level < 1) {
      this.data.cur_level = 1;
    }
    var xthStr = wx.getStorageSync(LCData.ParamName.NUMBER_XTH)
    this.data.xth = xthStr.split(",");

    if (wx.getStorageSync("NUMBER_LEVEL") != "") {
      this.data.cur_level = Number(wx.getStorageSync("NUMBER_LEVEL"))
    } else {
      this.data.cur_level = this.data.xth[this.data.level_id - 1]
    }

    // if(this.data.level_id == 1){
    //   this.data.idom_arr = common.NUMBER_1
    //   this.data.explain_arr = common.NUMBER_1_EXP
    // }
    console.log(this.data.level_id)
    this.data.idom_arr = common.npers["NUMBER_" + this.data.level_id]
    this.data.explain_arr = common.npers["NUMBER_" + this.data.level_id + "_EXP"]


    //获取级别和主图片
    var main_img_temp = "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number_res/" + id + "_" + this.data.cur_level + ".png";
    if (parseInt(this.data.level_id) >= 12) {
      main_img_temp = 'http://cdn-xyx.raink.com.cn/cck/level/' + id + "_" + this.data.cur_level + ".png";
    }

    console.log("main_img_temp" + main_img_temp)


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
    if (this.data.cur_level < 3) {
      pointAddTemp = false;
    }
    if (this.data.cur_level < 2 || wx.getStorageSync("pay_finish") == "1") {
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
      total_point: total_point_temp,
      pointAdd: pointAddTemp,
      showAd: showAdTemp
    })



  },
  shareOthers: {},
  onShow: function() {
    let that = this
    var total_point_temp = LCData.GetNumber(LCData.ParamName.TOTAL_POINT)
    var showAdTemp = this.data.showAd;


    setTimeout(() => {
      that.setData({
        cnxhstate: app.globalData.cnxhstate,
        state: app.globalData.state,
        cytzstate: app.globalData.cytzstate
      })
    }, 1000)

    if (wx.getStorageSync("pay_finish") == "1") {
      showAdTemp = false
    }


    this.setData({
      total_point: total_point_temp,
      showAd: showAdTemp
    })
    if (app.onShareJudge(this.shareOthers)) {
      console.log('可以分享了');
      this.shareManage(this.shareOthers.serial, this.shareOthers.res);

    }else{
      console.log('分享返回的false')
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

  },
  onHide() {
    this.shareOthers.share1 = true;
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
    if (this.data.openLevel == '2') {
      wx.showToast({
        title: '分享可获金币哦！',
        icon: 'success',
        duration: 2000
      })
      return;
    }
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
        } else {

        }
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

    var tipsContent = this.data.idom_arr[this.data.cur_level - 1].substr(emptyIndex, 1)
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
    if (res.from == 'button' && res.target && res.target && res.target.id == 'showtips') {
      console.log('提示分享')
      serial = 5;
    }

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

    } else {

      if (res.from == 'button' && res.target && res.target && res.target.id == 'showtips') {
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
      // return share.getCGShareContent(this, this.data.cur_level, this.shareOthers)
    }

  },
  shareManage(serial, res) {
    console.log('触发了新的机制', res);
    if (res.from == 'button' && res.target && res.target && res.target.id == 'showtips') {

      console.log('进入了提示逻辑')

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

      var tipsContent = that.data.idom_arr[that.data.cur_level - 1].substr(emptyIndex, 1)
      console.log("===" + tipsContent)
      for (var i = 0; i < 24; i++) {
        if (tipsContent == that.data.array[i]) {
          that.updateData(i, emptyIndex)
          break;
        }
      }

    }

  },
  onReady: function() {
    this.dialog = this.selectComponent('#dialog');
    this.hongBao = this.selectComponent('#hongBao');
    var level_temp
    for (level_temp = 1; level_temp < 17; level_temp++) {
      if (this.data.cur_level < (2 * level_temp + 1) * (2 * level_temp + 1)) {
        break;
      }
    }

    var level = this.data.cur_level
    console.log('查看刷新后的数据：', this.data.level_id);
    wx.setNavigationBarTitle({
      title: "【第" + this.data.level_id + "期】"
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

    if (ansStr == this.data.idom_arr[this.data.cur_level - 1]) {
      mpsdk.Report.reportEvent(6, this.data.cur_level)
      if (this.data.cur_level < 50) {
        this.data.cur_level = Number(this.data.cur_level) + 1


        // var xthStr = wx.getStorageSync(LCData.ParamName.NUMBER_XTH)
        // console.log(xthStr)
        // var xth = xthStr.split(",");

        if (this.data.cur_level > this.data.xth[this.data.level_id - 1]) {
          this.data.xth[this.data.level_id - 1] = Number(this.data.xth[this.data.level_id - 1]) + 1
          xthStr = this.data.xth.join(",")
          console.log("=====::::==" + xthStr)

          LCData.Set(LCData.ParamName.NUMBER_XTH, xthStr)
        }


      } else {
        var xthStr = wx.getStorageSync(LCData.ParamName.NUMBER_IS_OK)
        var xth = xthStr.split(",");
        xth[this.data.level_id - 1] = "1"

        xthStr = xth.join(",")
        console.log(xthStr)

        LCData.Set(LCData.ParamName.NUMBER_IS_OK, xthStr)

        wx.showModal({
          title: '通关提示',
          content: '恭喜您已通关，敬请期待下一期！',
          confirmText: '好的',
          success: function(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 3
              })
            }
          }
        })

        return
      }

      //  getApp().globalData.wnds.Wnd_Play.CurrLevel  =  this.data.cur_level


      // if (this.data.cur_level > LCData.GetNumber(LCData.ParamName.PASS_LEVELS)) { 
      // LCData.Set(LCData.ParamName.PASS_LEVELS, this.data.cur_level)
      this.data.total_point = this.data.total_point + 5;
      LCData.Set(LCData.ParamName.TOTAL_POINT, this.data.total_point)
      // }
      console.log("==========::" + this.data.cur_level)

      wx.setStorageSync("NUMBER_LEVEL", this.data.cur_level)

      // var temp = this.data.cur_level - 2
      // let that=this;
      // this.dialog.setData({
      //   dialogShow: true,
      //   title: this.data.idom_arr[temp],
      //   content: '【解释】：' + this.data.explain_arr[temp] + "\n\n金币 +5"
      // });
      // wx.showModal({
      //   title: this.data.idom_arr[temp],
      //   content: '【解释】：' + this.data.explain_arr[temp] + "\n\n金币 +5",
      //   showCancel: false,
      //   success(){

      //   }
      // })
      this.tongguanShowFn();
    } else {
      wx.showToast({
        title: '存在错误哦',
        icon: 'success',
        image: '../../imgs/comm/warn.png',
        duration: 2000
      })
    }
  },

  tongguanShowFn() {
    if (this.hongBao.hongbaoShowJude()) {
      this.hongBao.loadData();
    } else {
      var temp = this.data.cur_level - 2
      let that = this;
      this.dialog.setData({
        dialogShow: true,
        title: this.data.idom_arr[temp],
        content: '【解释】：' + this.data.explain_arr[temp] + "\n\n金币 +5"
      });
    }
  },
  // 广告加载
  adLoad(e) {
    console.log('广告加载成功：', e);
  },
  adErr(e) {
    console.log('广告加载失败：', e);
  },
  dialogConfirmTap() {
    let that = this;
    this.dialog.setData({
      dialogShow: false
    });
    if (that.tiaoNum < app.globalData.bannerrefresh) {
      console.log('跳转前的数据：', that.data.level_id);
      that.onLoad();
      that.onShow();
      that.onReady();
      that.tiaoNum++;

    } else {
      wx.setStorageSync('isShowWX', this.data.isShowWx ? false : true);
      wx.redirectTo({
        url: 'numberPlay?id=' + that.data.level_id
      })
    }
  },
  //刷新次数
  tiaoNum: 1,
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
    console.log("===" + this.data.idom_arr)
    for (var i = 1; i < 11; i++) {
      console.log("===" + this.data.idom_arr[(this.data.cur_level - 1) + i])
      ten_idioms = ten_idioms + this.data.idom_arr[(this.data.cur_level - 1) + i];
    }
    ten_idioms = this.data.idom_arr[this.data.cur_level - 1] + ten_idioms;

    var arr_index = []
    for (var i = 0; i < 100; i++) {
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
    console.log(arr)

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
    wx.showToast({
      title: '获得200金币',
      duration: 2000
    })


    wx.reportAnalytics("click_ad" + wx.getStorageSync("SHOW_APP_ID"), {
      count: 1
    })

    var page = ''
    if (wx.getStorageSync("SHOW_PAGE") == "") {

    } else {
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
  tocytz: function() {

    mpsdk.Ad.loadFilterData()
      .then(function(_a) {
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
        console.log('进入了提示逻辑')

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

        var tipsContent = that.data.idom_arr[that.data.cur_level - 1].substr(emptyIndex, 1)
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
  }

})