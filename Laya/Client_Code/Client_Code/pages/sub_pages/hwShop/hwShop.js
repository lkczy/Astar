// pages/sub_pages/hwShop/hwShop.js
var that;
var position = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    position: '商城'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    position = options.position;
    if (position) {
      that.setData({
        position: position
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx,wx.request({
      url: 'https://xyx-pdd-api.raink.com.cn/v1/pdd/store',
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
        if (res.data.msg === 'success') {
          that.setData({
            goodsList: res.data.data.goods_list
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.request({
      url: 'https://xyxcck-log.raink.com.cn/MiniGameLog/log/event.action',
      data: {
        gameid: wx.getStorageSync('PDD_GAME_ID'),
        eventid: 30003,
        param1: position,
        userid: wx.getStorageSync('PDD_USERID')||wx.getStorageSync('pdduserId')
      },
      header: {
        header: 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function (res) {
        console.log('\\\\\\\\\\\\\拼多多商场事件上报成功:30003');
      },
      fail: function (res) {
        console.log('\\\\\\\\\\\\\拼多多商场事件上报失败:30003');
      },
      complete: function (res) { },
    })
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

  }
})