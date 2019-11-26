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

    cur_level = cur_level + (2 * this.data.level_id - 1) * (2 * this.data.level_id - 1) - 1;

    //跳转到游戏页面
    getApp().globalData.wnds.Wnd_Play.CurrLevel = cur_level
    getApp().globalData.wnds.Wnd_Play.Show()
  },
  onLoad: function (option) {
    var id = option.id
    this.data.level_id = id
    let leveldata = wx.getStorageSync('leveldata');
    let levelLen = leveldata['LEVEL_NAMES'].length;
    // var id_count = (2 * id + 1) * (2 * id + 1) - (2 * id - 1) * (2 * id - 1) - ((2 * id + 1) * (2 * id + 1)-wx.getStorageSync('leveldata').EXPLAIN.length-1)
    var id_count = (2 * id + 1) * (2 * id + 1) - (2 * id - 1) * (2 * id - 1)
    if (id == levelLen){
      let zt=0;
      for (let i = 0; i <= levelLen;i++){
        zt+=i;
      }
      zt*=8;
      id_count = id_count-(zt-leveldata['EXPLAIN'].length);
    }
    var level_temp = LCData.GetNumber(LCData.ParamName.PASS_LEVELS) - (2 * id - 1) * (2 * id - 1) + 1

    if(level_temp < 0){
      level_temp = 0
    }

    var hangNum = parseInt(id_count/7) + 1
    var array_temp = []
    for (var i = 1; i <= hangNum; i++) {
      var seven_temp = []
      for(var j = 0; j < 7; j++){
        seven_temp[j] = (i-1) * 7 +j +1
      }
      array_temp[i - 1] = seven_temp
    }
    this.setData({
      count:id_count,
      array: array_temp,
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
    [50, 51, 52, 53, 54, 55, 56],
    [57, 58, 59, 60, 61, 62, 63],
    [64, 65, 66, 67, 68, 69, 70],
    [71, 72, 73, 74, 75, 76, 77],
    [78, 79, 80, 81, 82, 83, 84],
    [85, 86, 87, 88, 89, 90, 91],
    [92, 93, 94, 95, 96, 97, 98],
    [99, 100, 101, 102, 103, 104, 105],
    [106, 107, 108, 109, 110, 111, 112],
    [113, 114, 115, 116, 117, 118, 119],
    [120, 121, 122, 123, 124, 125, 126]],
    nor: "#fff5a3",
    unlock: "#d1cec1"
  }
})
