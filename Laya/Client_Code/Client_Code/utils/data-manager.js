var report = require('mpsdk.js');
const gameid = 1;

/**
 * 存储当前金币总量
 * @gold: 金币总量
 */
function setGoldNum(gold) {
  return;
  wx.request({
    url: 'https://xyxcck-auth.raink.com.cn/MiniGame/data/saveData.action',
    data: {
      gameId: gameid,
      openId: report.Account.getAccount().openid,
      dataKey: 'gold',
      dataValue: gold
    },
    success: res => {
      console.log('保存金币', res.data);
    }
  })
}

/**
 * 存储当前所通过的关卡
 * @level: 当前关卡
 */
function setPassLevel(level) {
  return;
  wx.request({
    url: 'https://xyxcck-auth.raink.com.cn/MiniGame/data/saveData.action',
    data: {
      gameId: gameid,
      openId: report.Account.getAccount().openid,
      dataKey: 'level',
      dataValue: level
    },
    success: res => {
      console.log('保存关卡', res.data);
      console.log(res.data);
    }
  })
}

/**
 * 存储签到时间
 * @time: 签到时间
 */
function setLastTime(time) {
  return;
  wx.request({
    url: 'https://xyxcck-auth.raink.com.cn/MiniGame/data/saveData.action',
    data: {
      gameId: gameid,
      openId: report.Account.getAccount().openid,
      dataKey: 'lastTime',
      dataValue: time
    },
    success: res => {
      console.log('保存签到时间', res.data);
      console.log(res.data);
    }
  })
}

/**
 * 获取最近签到时间
 * @cb callBack
 */
function getLastTime(cb) {
  wx.request({
    url: 'https://xyxcck-auth.raink.com.cn/MiniGame/data/getData.action',
    data: {
      gameId: gameid,
      openId: report.Account.getAccount().openid,
      dataKey: 'lastTime',
    },
    success: res => {
      if (!res.data.error) {
        var time = parseInt(res.data.value);
        var localTime = wx.getStorageSync(getApp().globalData.LAST_SIGNIN);
        var recentTime = time > localTime ? time : localTime;
        cb(recentTime);
      } else if (res.data.error == 1003) {
        cb(wx.getStorageSync(getApp().globalData.LAST_SIGNIN));
      }
    },
    fail: res => {
      cb(wx.getStorageSync(getApp().globalData.LAST_SIGNIN));
    }
  })
}

/**
 * 初始化数据
 */
function initData() {
  return;
  //获取当前金币
  // wx.request({
  //   url: 'https://xyxcck-auth.raink.com.cn/MiniGame/data/getData.action',
  //   data: {
  //     gameId: gameid,
  //     openId: report.Account.getAccount().openid,
  //     dataKey: 'gold',
  //   },
  //   success: res => {
  //     console.log('金币数量:', res.data);
  //     console.log('本地金币数量', wx.getStorageSync(getApp().globalData.TOTAL_POINT));
  //     if (!res.data.error) {
  //       var gold = parseInt(res.data.value);
  //       var localGold = wx.getStorageSync(getApp().globalData.TOTAL_POINT);
  //       //设置金币
  //       if (gold != localGold) {
  //         var recentGold = gold > localGold ? gold : localGold
  //         wx.setStorageSync(getApp().globalData.TOTAL_POINT, recentGold);
  //         setGoldNum(recentGold);
  //       }
  //     } else if (res.data.error == 1003) {
  //       setGoldNum(wx.getStorageSync(getApp().globalData.TOTAL_POINT));
  //     }
  //   }
  // })

  //获取当前关卡
  wx.request({
    url: 'https://xyxcck-auth.raink.com.cn/MiniGame/data/getData.action',
    data: {
      gameId: gameid,
      openId: report.Account.getAccount().openid,
      dataKey: 'level',
    },
    success: res => {
      console.log('通关关卡:', res.data);
      console.log('本地通关关卡', wx.getStorageSync(getApp().globalData.PASS_LEVELS_NJJZW))
      if (!res.data.error) {
        var level = parseInt(res.data.value);
        var localLevel = wx.getStorageSync(getApp().globalData.PASS_LEVELS_NJJZW);
        //设置关卡
        if (level != localLevel) {
          var recentLevel = level > localLevel ? level : localLevel
          wx.setStorageSync(getApp().globalData.PASS_LEVELS_NJJZW, recentLevel);
          setPassLevel(recentLevel);
        }
      } else if (res.data.error == 1003) {
        setPassLevel(wx.getStorageSync(getApp().globalData.PASS_LEVELS_NJJZW));
      }
    }
  })

  //获取当前签到时间
  // wx.request({
  //   url: 'https://xyxcck-auth.raink.com.cn/MiniGame/data/getData.action',
  //   data: {
  //     gameId: gameid,
  //     openId: report.Account.getAccount().openid,
  //     dataKey: 'lastTime',
  //   },
  //   success: res => {
  //     console.log('签到时间:', res.data);
  //     console.log('本地签到时间', wx.getStorageSync(getApp().globalData.LAST_SIGNIN))
  //     if (!res.data.error) {
  //       var time = parseInt(res.data.value);
  //       var localTime = wx.getStorageSync(getApp().globalData.LAST_SIGNIN);
  //       if (time != localTime) {
  //         var recentTime = time > localTime ? time : localTime
  //         wx.setStorageSync(getApp().globalData.LAST_SIGNIN, recentTime);
  //         setLastTime(recentTime);
  //       }
  //     } else if (res.data.error == 1003) {
  //       setLastTime(wx.getStorageSync(getApp().globalData.LAST_SIGNIN));
  //     }
  //   }
  // })
}

module.exports = {
  setGoldNum: setGoldNum,
  setPassLevel: setPassLevel,
  setLastTime: setLastTime,
  getLastTime: getLastTime,
  initData: initData
}