import * as LCData from "../../modules/LocalData"
let commons = require('../../utils/util.js');
//help.js
Page({
    data: {
      level_url:[],
      level:1
    },

    onLoad: function () {
      let storageLevelData = wx.getStorageSync('leveldata');
      commons.LEVEL_NAMES = storageLevelData['LEVEL_NAMES'] || commons.LEVEL_NAMES;
      console.log(commons.LEVEL_NAMES);
      var level = LCData.GetNumber(LCData.ParamName.PASS_LEVELS)
      var level_temp
      for (level_temp = 1; level_temp < commons.LEVEL_NAMES.length+1; level_temp++) {
        if (level < (2 * level_temp + 1) * (2 * level_temp + 1)) {
          break;
        }
      }
      this.data.level = level_temp

      var level_url_temp = []
      for (var i = 1; i <=commons.LEVEL_NAMES.length; i++){
        if (i <= level_temp){
          level_url_temp[i - 1] = "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/level/nor_" + i +".png"
        } else {
          level_url_temp[i - 1] = "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/level/sel_" + i + ".png"
        }
      }

      this.setData({
        level_url:level_url_temp,
      })
    },
    clickItem: function (event){
      var cur_item = event.currentTarget.dataset.item;

      if(this.data.level < cur_item){
        wx.showToast({
          title: '请先完成激活',
          icon: 'success',
          duration: 2000,
        })
        return
      }
      wx.navigateTo({
        url: '../sel/sel?id=' + cur_item
      })
    }
})