// component/hwPddYouLike/hwPddYouLike.js
var goodsData;
var that;
let mpsdk = require('../../utils/mpsdk.js');
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
    },
    userid: {
      type: String,
      value: ''
    },
    position: {
      type: String,
      value: ''
    },
    gameid: {
      type: Number,
      value: 0
    },
    cnxhstate:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsAd: [{
        imgsUrl: []
      },
      {
        imgsUrl: []
      }
    ],
    userid: '',
    wxBannerShow:true,
    suggestList:[],
    userid: '',
    goodsList: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadData: function() {
      wx.request({
        url: 'https://xyx-pdd-api.raink.com.cn/v1/pdd/goods',
        header: {
          header: 'application/x-www-form-urlencoded'
        },
        data: {
          with_coupon: true
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          console.log('\\\\\\\\\\商场数据', res.data);
          if (res.data.msg === 'success') {
            goodsData = res.data.data.goods_list
            if (res.data.data.goods_list) {
              that.setData({
                goodsList: goodsData
              })
            }
            for (var i = 0; i < 8; i++) {
              var j = parseInt(i / 4);
              that.data.goodsAd[j].imgsUrl.push(goodsData[i]);
            }
            that.setData({
              goodsAd: that.data.goodsAd
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    },

    log: function(e) {
      this.triggerEvent('clickGoods', e.currentTarget.dataset.goods);
    },

    toShop: function() {
      wx.request({
        url: 'https://xyxcck-log.raink.com.cn/MiniGameLog/log/event.action',
        data: {
          gameid: that.properties.gameid,
          eventid: 30002,
          param1: '主要玩法界面',
          userid: that.properties.userid
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
        url: '/pages/sub_pages/hwShop/hwShop?position=' + that.properties.position,
      })
    },

    bannerLoad(){
      console.log('广告加载成功');
      this.setData({
        wxBannerShow: true
      });
    },

    bannerErr(){
      console.log('广告加载失败');
      this.loadData1();
      this.setData({
        wxBannerShow:false
      });
    },
    

    loadData1: function () {
      // let original = this.data.listType == 'detail';
      // let count = original ? 0 : this.data.iconCount;
      let that = this;
      mpsdk.Ad.getSuggestList(false, 4, getApp().getScore()).then(suggestList => {
        console.log('推荐列表', suggestList);
        that.setData({
          suggestList: suggestList
        });

      });
    },
    adClick: function (e) {
      console.log(e.currentTarget.dataset.item);
      this.data.advData = e.currentTarget.dataset.item;
      //发送事件
      // this.triggerEvent('click', {
      //   advInfo: this.data.advData,
      //   isFirst: 
      mpsdk.Ad.click(this.data.advData)
      // });
      let logTitle = this.data.advType + '广告点击：' +
        this.data.advData.title +
        '(' + this.data.advData.adid + ')';
      //上报阿拉丁点击日志
      if (getApp().aldstat) {
        getApp().aldstat.sendEvent(logTitle);
      }
    },
  },

  lifetimes: {
    attached() {
      console.log('进入节点数+++++++++++++++++++++++++++++++++++++');
      that = this;
      this.loadData();
      this.loadData1()
      that.setData({
        userid: that.properties.userid,
        wxBannerShow: true
      })
      wx.setStorageSync('PDD_USERID', that.data.userid);
      wx.setStorageSync('PDD_GAME_ID', that.properties.gameid);

      console.log('PDD_GAME_ID', wx.getStorageSync('PDD_GAME_ID'));

      wx.request({
        url: 'https://xyxcck-log.raink.com.cn/MiniGameLog/log/event.action',
        data: {
          gameid: wx.getStorageSync('PDD_GAME_ID'),
          eventid: 30001,
          param1: '主要玩法界面',
          userid: that.properties.userid
        },
        header: {
          header: 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        success: function(res) {
          console.log('\\\\\\\\\\\\\拼多多商场事件上报成功:30001');
        },
        fail: function(res) {
          console.log('\\\\\\\\\\\\\拼多多商场事件上报失败:30001');
        },
        complete: function(res) {},
      })
    },
    detached() {

    },
  },

  /**
   * 适配老版本
   */
  attached() {
    that = this;
    console.log('进入节点数2222222222222222222222222222+++++++++++++++++++++++++++++++++++++');
    this.loadData();
    
    that.setData({
      userid: that.properties.userid,
      wxBannerShow: true
    })
    wx.setStorageSync('PDD_USERID', that.data.userid);
    wx.setStorageSync('PDD_GAME_ID', that.properties.gameid);

    wx.request({
      url: 'https://xyxcck-log.raink.com.cn/MiniGameLog/log/event.action',
      data: {
        gameid: wx.getStorageSync('PDD_GAME_ID'),
        eventid: 30001,
        param1: '主要玩法界面',
        userid: wx.getStorageSync('PDD_USERID')
      },
      header: {
        header: 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function(res) {
        console.log('\\\\\\\\\\\\\拼多多商场事件上报成功:30001');
      },
      fail: function(res) {
        console.log('\\\\\\\\\\\\\拼多多商场事件上报失败:30001');
      },
      complete: function(res) {},
    })
  },
  detached() {

  },
})