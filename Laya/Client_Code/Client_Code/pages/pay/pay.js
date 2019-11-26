import * as LCData from "../../modules/LocalData"

// pages/sub_pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    one:2,
    two:6,
    one_point:'500',
    two_point:'1800'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (wx.getStorageSync("pay_finish") == "1"){
      this.setData({
        one:6,
        two:8,
        one_point: '1800',
        two_point: '2500'
      })
    }

    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: 'https://xcx-cycck-tiku.raink.com.cn/weapp/openid',
            data:{
              code:res.code
            },
            success: function (res) {
              that.setData({
                openid: res.data.data
              })
              console.log(res.data)
            },
            fail: function () {

            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    
  
  },
  clickItem:function(res){
    var lastTime = 0;
    if (wx.getStorageSync("payLastTime") == "") {

    } else {
      lastTime = Number(wx.getStorageSync("payLastTime"));
    }

    if (parseInt((new Date()).getTime() / 1000) > lastTime + 1) {

    } else {
      wx.showModal({
        title: '提示',
        content: '赞赏太过频繁哦，请稍后再试',
        cancelText: '',
        success: function (res) {
        
        }
      })
      return
    }

    var num  = res.currentTarget.dataset.item

    this.pay(num)

  },
  RandomNum:function(n){
    var rnd = "";
    for (var i = 0; i < n; i++)
      rnd += Math.floor(Math.random() * 10);
    return rnd;
  },
  pay: function (num) {
    wx.showLoading({
      title: '加载中...',
    })

    var that = this
    var openid1 = this.data.openid

    var orderid = (new Date()).getTime() + this.RandomNum(5)

    wx.request({
      url: 'https://xcx-cycck-tiku.raink.com.cn/weapp/wxpay/prepay',
      data: {
        openid: openid1,
        body: "成语猜猜看赏金",
        order_sn: orderid,
        total_fee: num
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        console.log("prepayL::::" + res.data.data.data.prepay_id)

        wx.request({
          url: 'https://xcx-cycck-tiku.raink.com.cn/weapp/wxpay/pay',
          data: {
            prepay_id: res.data.data.data.prepay_id,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res1) {
            wx.hideLoading()
            console.log(res1.data.data.data)
            var appId = res1.data.data.data.appId;
            var timeStamp = res1.data.data.data.timeStamp + ""
            var pkg = res1.data.data.data.package
            var nonceStr = res1.data.data.data.nonceStr;
            var paySign = res1.data.data.data.paySign

            console.log(pkg);
            wx.requestPayment({
              'timeStamp': timeStamp,
              'nonceStr': nonceStr,
              'package': pkg,
              'signType': 'MD5',
              'paySign': paySign,
              'total_fee': num,
              'success': function (res) {
                wx.setStorage({
                  key: 'payLastTime',
                  data: parseInt((new Date()).getTime() / 1000),
                })


                var point = LCData.GetNumber(LCData.ParamName.TOTAL_POINT);

                var addpoint = 0;
                if (num == 2) {
                  addpoint = 500
                } else if (num == 6) {
                  addpoint = 1800
                } else if (num == 8) {
                  addpoint = 2500
                } else if (num == 10) {
                  addpoint = 3600
                } else if (num == 12) {
                  addpoint = 4500
                } else if (num == 15) {
                  addpoint = 5500
                } else if (num == 20){
                  addpoint = 8000
                } else {
                  addpoint = 30000
                }
                point = point + addpoint;

                try {
                  LCData.Set(LCData.ParamName.TOTAL_POINT,point)
                  wx.setStorageSync("pay_finish", "1")
                } catch (e) {
                  LCData.Set(LCData.ParamName.TOTAL_POINT,point)

                  wx.setStorage({
                    key: "pay_finish",
                    data: "1",
                  })
                }

                that.setData({
                  one: 6,
                  two: 8,
                  one_point: '1800',
                  two_point: '2500'
                })

                wx.showToast({
                  title: '获得' + addpoint + "金币",
                  icon: 'success',
                  duration: 2000
                })
              },
              "fail": function (res) {
                console.log('fail');
                wx.showToast({
                  title: '支付失败',
                  icon: 'success',
                  duration: 2000
                })
              }
            });
          }
        })

      },
      fail: function () {

      }
    })
  }

})