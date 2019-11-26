var log = require('mpsdk.js');
var dataManager = require('data-manager');

function shareSuc(res, that, coinPath = '../../images/coin.png', shareType) {
  if (shareType != 16 && shareType != 17 && shareType != 18 && shareType != 2 && shareType != 5) {
    console.log('不给你奖励(～￣▽￣)～');
    return;
  }

  if (that.data.isShowShareEver) {
    that.setData({
      isShowShareEver: false
    })
  }

  //获取分享次数
  var curTime = parseInt((new Date()).getTime() / 86400000)
  var lastTime = Number(wx.getStorageSync(getApp().globalData.SHARE_TIME));
  var count = Number(wx.getStorageSync(getApp().globalData.SHARE_COUNT));

  if (curTime == lastTime) {
    count = count + 1
  } else {
    count = 1
  }

  wx.setStorageSync(getApp().globalData.SHARE_TIME, curTime)
  wx.setStorageSync(getApp().globalData.SHARE_COUNT, count)
  var point = Number(wx.getStorageSync(getApp().globalData.TOTAL_POINT));
  var changeMoney = 0;
  var shareType = '';

  // if (res.shareTickets) {
    changeMoney = 60;
    shareType = "群";
  // } else {
  //   changeMoney = 30;
  //   shareType = "个人";
  // }

  if (count > 10) {
    let shifenxiang=wx.getStorageSync('shicifenxiang');
    if (shifenxiang != Math.floor(+new Date() / (60 * 60 * 1000 * 24))){
      wx.showToast({
        title: '您一天只能获取十次奖励哦！！！',
        icon: 'none',
      })
      wx.setStorageSync('shicifenxiang', Math.floor(+new Date() / (60 * 60 * 1000 * 24)));
    }
   
    return
  } else {
    var localCodeVersion = wx.getStorageSync('CODE_VERSION');
    var newstCodeVersion = getApp().globalData.CodeVersion;
    var status = wx.getStorageSync("CHECK_STATUS");

    // if (status == "0") {
    //   console.log('审核中。。。。。。。。。。。。。');
    // } else {
      point = point + changeMoney;
      log.Report.reportGold(changeMoney, point, '2', 2);
      wx.setStorageSync(getApp().globalData.TOTAL_POINT, point)
      dataManager.setGoldNum(point);

      if (changeMoney == 60) {
        // if (status != "2") {
          // wx.showToast({
          //   title: '获得' + changeMoney + '金币',
          //   image: coinPath,
          //   duration: 2000
          // })
        // } else if (status == "2") {
        //   wx.showToast({
        //     title: '试试邀请更多群友来玩',
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
      } else {
        // wx.showToast({
        //   title: '获得' + changeMoney + '金币',
        //   image: coinPath,
        //   duration: 2000
        // })
      }

      that.setData({
        money: point,
        isShowShareBtn: false,
      })
      setTimeout(() => {
        that.setData({
          isShowShareBtn: true,
        })
      }, 2500)
    // }
  }
}

function shareForReward(res, shareType, num, callback, multiple = 2) {
  var status = wx.getStorageSync("CHECK_STATUS");
  // if (res.shareTickets) {
    num = num * multiple;
  // }
  //分享获得双倍金币
  if (shareType == 'coin') {
    var point = Number(wx.getStorageSync(getApp().globalData.TOTAL_POINT));
    point = point + num;
    log.Report.reportGold(num, point, '好友上线领取', 10);
    wx.setStorageSync(getApp().globalData.TOTAL_POINT, point);
    dataManager.setGoldNum(point);
    // if (!res.shareTickets) {
    //   if (status == "1") {
    //     wx.showToast({
    //       title: '获得' + num + '金币',
    //       image: '../../images/coin.png',
    //       duration: 2500
    //     })
    //   } else if (status == "2") {
    //     wx.showToast({
    //       title: '试试邀请更多群友来玩',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   }
    // } else {
      // wx.showToast({
      //   title: '获得' + num + '金币',
      //   image: '../../images/coin.png',
      //   duration: 2500
      // })
    // }
    callback();
    //分享获得双倍金币
  } else if (shareType == 'lottery') {
    wx.showLoading({
      title: '获取中',
    })
    wx.request({
      url: 'https://xyxcck-friend.raink.com.cn/MiniFriend/data/addLotteryTimes.action',
      // url: 'http://192.168.5.38:8080/MiniFriend/data/addLotteryTimes.action',
      data: {
        gameId: 8,
        openId: log.Account.getAccount().openid,
        dataKey: 1,
        times: num
      },
      success: function() {
        console.log("添加次数成功了!")
        if (!res.shareTickets) {
          if (status == "1") {
            wx.showToast({
              title: '获得' + num + '次抽奖',
              image: '../../images/cjzp.png',
              duration: 2500
            })
          } else if (status == "2") {
            wx.showToast({
              title: '试试邀请更多群友来玩',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '获得' + num + '次抽奖',
            image: '../../images/cjzp.png',
            duration: 2500
          })
        }
        callback();
      },
      fail: function() {
        console.log("添加次数失败了!");
        wx.showToast({
          title: '获得抽奖失败,请确保您的网络畅通',
          icon: 'none',
          duration: 2500
        })
      },
    })
  }
}

function auditing(that) {
  //状态码 0、高级限制保护 = 最低开放程度 1、中级限制保护 = 中等开放程度 2、低级限制保护 = 完全开放程度
  var status = wx.getStorageSync("CHECK_STATUS");
  that.setData({
    status: status
  })
}

module.exports = {
  shareSuc: shareSuc,
  auditing: auditing,
  shareForReward: shareForReward
}