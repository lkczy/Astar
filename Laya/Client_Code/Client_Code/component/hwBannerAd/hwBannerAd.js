// component/hwBannerAd/hwBannerAd.js
var that;

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    adId: {
      type: String,
      value: '', //icononly
    },
    status: {
      type: Number,
      value: 0
    },
    isShowWx: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    

    goShop: function () {
      wx.request({
        url: 'https://xyxcck-log.raink.com.cn/MiniGameLog/log/event.action',
        data: {
          gameid: 8,
          eventid: 30002,
          param1: '主要玩法界面',
          userid: wx.getStorageSync('PDD_USERID')
        },
        header: {
          header: 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        success: function(res) {
          console.log('\\\\\\\\\\\\\拼多多商场事件上报成功:30002');
        },
        fail: function(res) {
          console.log('\\\\\\\\\\\\\拼多多商场事件上报失败:30002');
        },
        complete: function(res) {},
      })
      wx.navigateTo({
        url: '/pages/sub_pages/hwShop/hwShop',
      })
    }
  },
})
