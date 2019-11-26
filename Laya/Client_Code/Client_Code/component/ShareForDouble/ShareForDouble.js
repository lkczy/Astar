// component/ShareForDouble/ShareForDouble.js
const report = require('../../utils/mpsdk.js');
var dataManager = require("../../utils/data-manager");
// 防止手抖点击两次领取
var isLoading = false;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
    coin: {
      type: Number,
      value: 0
    },
    giftType: {
      type: String,
      value: 'coin'
    },
    times: {
      type: Number,
      value: 2
    },
    shareType: {
      type: String,
      value: ''
    },
    shareTimes: {
      type: Number,
      value: 5
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
  },

  /**
   * 组件生命周期函数，在组件实例进入页面节点树时执行
   */
  attached: function() {
    //状态码 0、审核中 1、普通状态
    var status = wx.getStorageSync("CHECK_STATUS");
    this.setData({
      status: status
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickToGiveUp: function() {
      this.setData({
        isShow: false
      })
    },

    clickToGetCoin: function() {
      this.setData({
        isShow: false
      })
      var point = Number(wx.getStorageSync(getApp().globalData.TOTAL_POINT));
      point = point + this.data.coin;
      report.Report.reportGold(this.data.coin, point, '放弃双倍礼包', 10);
      wx.setStorageSync(getApp().globalData.TOTAL_POINT, point);
      dataManager.setGoldNum(point);
      wx.showToast({
        title: '获得' + this.data.coin + '金币',
        image: '../../images/coin.png',
        duration: 2500
      })
      //发送事件
      this.triggerEvent('click');
    },

    clickToGetLottery: function() {
      var num = this.data.coin;
      var that = this;

      if (isLoading) {
        return;
      }
      isLoading = true;
      wx.showLoading({
        title: '获取中',
      })
      wx.request({
        url: 'https://xyxcck-friend.raink.com.cn/MiniFriend/data/addLotteryTimes.action',
        // url: 'http://192.168.5.38:8080/MiniFriend/data/addLotteryTimes.action',
        data: {
          gameId: 8,
          openId: report.Account.getAccount().openid,
          dataKey: 1,
          times: num
        },
        success: function() {
          console.log("添加次数成功了!")
          wx.showToast({
            title: '获得' + num + '次抽奖',
            image: '../../images/cjzp.png',
            duration: 2500
          })
          //发送事件
          that.triggerEvent('click');
        },
        fail: function() {
          console.log("添加次数失败了!")
          wx.showToast({
            title: '获得抽奖失败,请确保您的网络畅通',
            icon: 'none',
            duration: 2500
          })
        },
        complete: function() {
          isLoading = false;
          that.setData({
            isShow: false
          })
        }
      })
    }
  },
})