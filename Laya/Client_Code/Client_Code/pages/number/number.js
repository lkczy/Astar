import * as LCData from "../../modules/LocalData"
let util=require('../../utils/util.js');
//help.js
Page({
  data: {
    level_url: [
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",

      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
      "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png",
    ],
    row_num:0,
    level_color: [
      "#777777",
      "#777777",
      "#777777",
      "#777777",
      "#777777",
      "#777777",
      "#777777",
      "#777777",
      "#777777",
      "#777777",

      "#777777",
      "#777777",
      "#777777",
      "#777777",
      "#777777",
    ],
    text_number: [
      "6月8号开放",
      "6月15号开放",
      "6月22号开放",
      "6月29号开放",
      "7月6号开放",
      "7月13号开放",
      "7月20号开放",
      "7月27号开放",
      "8月3号开放",
      "8月10号开放",
      "8月17号开放",
      "8月24号开放",
      "9月7号开放",
      "9月14号开放",
      "9月21号开放",
    ],
    text_color: [
      "#ff0000",
      "#ff0000",
      "#ff0000",
      "#ff0000",
      "#ff0000",
      "#ff0000",
      "#ff0000",
      "#ff0000",
      "#ff0000",
      "#ff0000",
    ],

    numbers: 1,
    level:0
  },

  onLoad: function() {
    console.log(util);
    let storageData = wx.getStorageSync('leveldata');
    util.TITLE_NPER = storageData['TITLE_NPER'] || util.TITLE_NPER;
    util.OPEN_TIME = storageData['OPEN_TIME'] || util.OPEN_TIME;
    
    var level = LCData.GetNumber("SHOW_NUMBER")

    var isOkStr = wx.getStorageSync(LCData.ParamName.NUMBER_IS_OK)
    var xthStr = wx.getStorageSync(LCData.ParamName.NUMBER_XTH)
    var isOk = isOkStr.split(",");
    var xth = xthStr.split(",");

    var level_url_temp = []
    var text_number_temp = []
    var text_color_temp = []
    var level_color_temp = []
    console.log(util.TITLE_NPER);
    for (var i = 1; i <= util.TITLE_NPER; i++) {
      if (i <= level) { //已开放
        level_color_temp[i - 1] = "#e77749"
        if (isOk[i - 1] == "0") {
          level_url_temp[i - 1] = "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_sel.png"
          text_number_temp[i - 1] = (Number(xth[i - 1]) * 2 - 2) + "%"
          text_color_temp[i - 1] = "#00ff00"
        } else {
          level_url_temp[i - 1] = "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_sel_ok.png"
          text_number_temp[i - 1] = ""
          text_color_temp[i - 1] = "#00ff00"
        }
      } else { //未开放
        level_color_temp[i - 1] = "#777777"
        level_url_temp[i - 1] = "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png"
        text_number_temp[i - 1] = this.data.text_number[i - 1]
        text_color_temp[i - 1] = this.data.text_color[i - 1]
      }
    }

    this.setData({
      level_url: level_url_temp,
      text_number: text_number_temp,
      text_color: text_color_temp,
      level_color: level_color_temp,
      // row_num: Math.ceil(util.TITLE_NPER / 3),
      title_nper: util.TITLE_NPER,
      text_number:util.OPEN_TIME
    })
  },
  clickItem: function(event) {
    var level = LCData.GetNumber("SHOW_NUMBER")
    var cur_item = event.currentTarget.dataset.item;

    if (level < cur_item) {
      wx.showToast({
        title: '敬请期待！',
        icon: 'success',
        duration: 2000,
      })
      return
    }
    wx.navigateTo({
      url: '../numberSel/numberSel?id=' + cur_item
    })
  },
  cyjl: function() {
    wx.showToast({
      title: '敬请期待！',
      icon: 'success',
      duration: 2000,
    })
  },
  onShow: function() {
    var level = LCData.GetNumber("SHOW_NUMBER")

    var isOkStr = wx.getStorageSync(LCData.ParamName.NUMBER_IS_OK)
    var xthStr = wx.getStorageSync(LCData.ParamName.NUMBER_XTH)
    var isOk = isOkStr.split(",");
    var xth = xthStr.split(",");

    var level_url_temp = []
    var text_number_temp = []
    var text_color_temp = []
    var level_color_temp = []

    for (var i = 1; i <= util.TITLE_NPER; i++) {
      if (i <= level) {
        level_color_temp[i - 1] = "#e77749"
        if (isOk[i - 1] == "0") {
          level_url_temp[i - 1] = "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_sel.png"
          text_number_temp[i - 1] = (Number(xth[i - 1]) * 2 - 2) + "%"
          text_color_temp[i - 1] = "#00ff00"
        } else {
          level_url_temp[i - 1] = "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_sel_ok.png"
          text_number_temp[i - 1] = ""
          text_color_temp[i - 1] = "#00ff00"
        }
      } else {
        level_color_temp[i - 1] = "#777777"
        level_url_temp[i - 1] = "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/number/tiku_nor.png"
        text_number_temp[i - 1] = this.data.text_number[i - 1]
        text_color_temp[i - 1] = this.data.text_color[i - 1]
      }
    }

    this.setData({
      level_url: level_url_temp,
      text_number: text_number_temp,
      text_color: text_color_temp,
      level_color: level_color_temp
    })
  }
})