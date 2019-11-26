// component/gzhgift/gzhgift.js
let that
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gzhgiftstate: {
      type: Number,
      value: 0
    },
    daygiftstate:{
      type: Number,
      value: 0
    },
    daygifttype:{
      type: Number,
      value: 0
    },
    // gzhstate:{
    //   type:Number,
    //   value:0
    // },
    gzhlqday:{
      type:Number,
      value:1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showgzhmodel: false,
    showgzhinfomodel: false,
    showdaymodel: false,
    showdayinfomodel: false,
    gzhday:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showgzhmodel: function() {
      this.setData({
        showgzhmodel: true
      })
    },
    closegzhmodel: function() {
      this.setData({
        showgzhmodel: false
      })
    },
    closeshowgzhinfomodel: function() {
      this.setData({
        showgzhinfomodel: false
      })
    },

    showdaymodel: function () {
      this.setData({
        showdaymodel: true
      })
    },
    closeshowdaymodel: function () {
      this.setData({
        showdaymodel: false
      })
    },
    closeshowdayinfomodel: function () {
      this.setData({
        showdayinfomodel: false
      })
    },
    lqgzhjl: function(e) {
      if (this.data.gzhlqday == 0 && this.data.daygifttype == 1 && this.data.gzhday==0) {
        let TotalPoint_temp = wx.getStorageSync('TotalPoint')
        TotalPoint_temp += 300;
        wx.setStorageSync('TotalPoint', TotalPoint_temp)
        wx.showToast({
          title: '获得300金币',
        })
        that.setData({
          showgzhmodel: false,
          showgzhinfomodel: false,
          gzhlqday:1
        })
        wx.setStorageSync('gzhlqday',1)
        let gzhday = wx.getStorageSync('gzhday')
        wx.setStorageSync('gzhday', gzhday+1)
        
      } else {
        this.setData({
          showgzhinfomodel: true
        })
        wx.showToast({
          title: '请从公众号进入!',
          icon: 'none'
        })
      }

    }
    ,empty:function(){

    },
    lqdayjl: function (e) {
      if (this.data.gzhday>0 && this.data.daygifttype == 1 && this.data.gzhlqday == 0) {
        let TotalPoint_temp = wx.getStorageSync('TotalPoint')
        TotalPoint_temp += 100;
        wx.setStorageSync('TotalPoint', TotalPoint_temp)
        wx.showToast({
          title: '获得100金币',
        })
        that.setData({
          showdaymodel: false,
          showdayinfomodel: false,
          gzhlqday: 1
        })

        wx.setStorageSync('gzhlqday', 1)
        let gzhday = wx.getStorageSync('gzhday')
        wx.setStorageSync('gzhday', gzhday + 1)
      } else {
        this.setData({
          showdayinfomodel: true
        })
        wx.showToast({
          title: '请从公众号进入!',
          icon:'none'
        })
      }

    }
  },
  lifetimes: {
    attached() {
      that = this;
      this.setData({
        gzhday: wx.getStorageSync('gzhday')
      })
    }
  }

})