// pages/sub_pages/hwShopDetail/hwShopDetail.js
var id;
var that;

var pddPath;
var position = '';  

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: null,
    imgUrls: [],
    position: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    id = options.id;
    position = options.position;
    var isHongbao = options.isHongbao;

    if (position) {
      that.setData({
        position: position
      })
    }

    if (!isHongbao) {
      if (id) {
        wx.request({
          url: 'https://xyx-pdd-api.raink.com.cn/v1/pdd/hot?goods_id=' + id,
          success: (res) => {
            console.log('\\\\\\\\\\\\\上报点进商品详情的数据', res.data);
          }
        })
      }
    }

    wx.request({
      url: 'https://xyx-pdd-api.raink.com.cn/v1/pdd/goodsclick',
      data: {
        openid: wx.getStorageSync('PDD_USERID') || wx.getStorageSync('pdduserId'),
        goods_id: id
      },
      success() {
        console.log('上报商品详情点击事件成功');
      } 
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.request({
      url: 'https://xyx-pdd-api.raink.com.cn/v1/pdd/generate',
      data: {
        goods_id: id,
        custom_parameters: wx.getStorageSync('PDD_GAME_ID')+'|' + wx.getStorageSync('pdduserId')
      },
      success: (res) => {
        that.setData({
          goodsInfo: res.data.data[0].goods_detail,
          imgUrls: res.data.data[0].goods_detail.goods_gallery_urls
        });
        pddPath = res.data.data[0].we_app_info.page_path
      }
    })

    wx.request({
      url: 'https://xyxcck-log.raink.com.cn/MiniGameLog/log/event.action',
      data: {
        gameid: wx.getStorageSync('PDD_GAME_ID'),
        eventid: 30004,
        param1: position,
        param2: id,
        userid: wx.getStorageSync('PDD_USERID')||wx.getStorageSync('pdduserId')
      },
      header: {
        header: 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function (res) {
        console.log('\\\\\\\\\\\\\拼多多商场事件上报成功:30004');
      },
      fail: function (res) {
        console.log('\\\\\\\\\\\\\拼多多商场事件上报失败:30004');
      },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
  onShareAppMessage: function () {

  },

  /**
   * 前往拼多多
   */
  toPdd: function () {
    wx.request({
      url: 'https://xyxcck-log.raink.com.cn/MiniGameLog/log/event.action',
      data: {
        gameid: wx.getStorageSync('PDD_GAME_ID'),
        eventid: 30005,
        param1: that.data.goodsInfo.coupon_discount,
        param2: id,
        userid: wx.getStorageSync('PDD_USERID')||wx.getStorageSync('pdduserId')
      },
      header: {
        header: 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function (res) {
        console.log('\\\\\\\\\\\\\拼多多商场事件上报成功:30005');
      },
      fail: function (res) {
        console.log('\\\\\\\\\\\\\拼多多商场事件上报失败:30005');
      },
      complete: function (res) { },
    })
    
    wx.showLoading({
      title: '请稍后....'
    })

    wx.navigateToMiniProgram({
      appId: 'wx32540bd863b27570',
      path: pddPath,
      success(res) {
        // 打开成功
        wx.request({
          url: 'https://xyxcck-log.raink.com.cn/MiniGameLog/log/event.action',
          data: {
            gameid: wx.getStorageSync('PDD_GAME_ID'),
            eventid: 30014,
            param1: '',
            param2: '',
            userid: wx.getStorageSync('PDD_USERID') || wx.getStorageSync('pdduserId')
          },
          header: {
            header: 'application/x-www-form-urlencoded'
          },
          method: 'GET',
          success: function (res) {
            console.log('\\\\\\\\\\\\\拼多多商场事件上报成功:30014');
          },
          fail: function (res) {
            console.log('\\\\\\\\\\\\\拼多多商场事件上报失败:30014');
          },
          complete: function (res) { 
            wx.hideLoading()

          },
        })
      }
    })
  }
})