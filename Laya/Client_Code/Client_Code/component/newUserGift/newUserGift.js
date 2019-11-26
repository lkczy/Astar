Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coin: {
      type: Number,
      value: 0
    },
    marginbottom:{
      type: Number,
      value: 0
    },
    ShareOrVideo: {
      type: Number,
      value: 1
    }
  },

  data: {
    openLevel: '0'
  },

  ready: function () {
    getApp().globalData.getOpenLevel.then(data => {
      this.setData({
        openLevel: data.level
      });
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    newUserGift: function() {
      this.triggerEvent('newusergift');
    },
    playvideo: function () {
      if (this.data.ShareOrVideo == 1) {
        this.triggerEvent('playvideo','newUserGift');

      } else {
        log('既不分享也不视频,状态:', this.data.ShareOrVideo)
        wx.showToast({
          title: '暂无视频',
        })
      }
    },
  },
})