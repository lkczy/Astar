import * as LCData from "../../modules/LocalData"

//获取应用实例
var app = getApp()
Page({
  clickItem: function (event) {
    //传回当前按的是哪一关
    var cur_level = event.currentTarget.dataset.item;
    if (cur_level > this.data.level) {     //如果点击还没激活的关卡，给出提示
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '关卡还没激活哦！'
      })
      return;
    }
    console.log(event.currentTarget.dataset.item)

    wx.setStorageSync("NUMBER_LEVEL", cur_level)

    //跳转到游戏页面
    wx.navigateTo({
      url: '../numberPlay/numberPlay?id=' + this.data.level_id+'&types=sel'
    })
  },
  onLoad: function (option) {
    var id = option.id
    this.data.level_id = id

    var xthStr = wx.getStorageSync(LCData.ParamName.NUMBER_XTH)
    var xth = xthStr.split(",");
    var level_temp = xth[this.data.level_id - 1]

    var id_count = 50

    var hangNum = parseInt(id_count / 7) + 1
    var array_temp = []
    for (var i = 1; i <= hangNum; i++) {
      var seven_temp = []
      for (var j = 0; j < 7; j++) {
        seven_temp[j] = (i - 1) * 7 + j + 1
      }
      array_temp[i - 1] = seven_temp
    }
    this.setData({
      count: id_count,
      array: array_temp,
      level: level_temp
    })

  },
  onShow:function(){

    var xthStr = wx.getStorageSync(LCData.ParamName.NUMBER_XTH)
    var xth = xthStr.split(",");
    var level_temp = xth[this.data.level_id - 1]

    this.setData({
      level: level_temp
    })
  },
  data: {
    level_id:0,
    level: 3,
    count:1,
    array: [[1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42],
    [43, 44, 45, 46, 47, 48, 49],
    [50, 51, 52, 53, 54, 55, 56]],
    nor: "#fff5a3",
    unlock: "#d1cec1"
  }
})
