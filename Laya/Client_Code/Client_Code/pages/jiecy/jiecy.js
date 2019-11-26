//jiecy.js
//获取应用实例
var commons = require("../../utils/util.js")
import * as LCData from "../../modules/LocalData"

var app = getApp()

Page({
  clickItem:function(event){
    //传回当前按的是哪个按钮
    var cur_item = event.currentTarget.dataset.item;

    var level = this.data.cur_level - 1
    //如果按的是空的，则直接返回
    if (commons.JIELONG_INIT[level][cur_item] != "2"){
        return;
    } 

    //更新当前的所选情况
    var array_url_temp = []
    var array_temp = []
    for (var i = 0; i < 100; i++) {
      array_url_temp[i] = this.data.array_url[i]
      array_temp[i] = this.data.array[i]
    }

    array_temp[cur_item] = ""
    array_url_temp[this.data.cur_char] = this.data.NOR_BG
    this.data.cur_char = cur_item
    array_url_temp[cur_item] = this.data.SEL_BG

    this.setData({
      array_url: array_url_temp,
      array: array_temp,
    })

    if (this.data.array_index[cur_item] == -1){
      
    } else {
      var array_show_temp = []
      for(var i = 0; i < 40; i++){
        array_show_temp[i] = this.data.array_show[i]
      }

      array_show_temp[this.data.array_index[cur_item]] = true
      this.data.array_index[cur_item] = -1
      this.setData({
        array_show: array_show_temp
      })
    }
    this.check()
  },
  clickAns: function (event) {
    //传回当前按的是哪个按钮
    var cur_item = event.currentTarget.dataset.item;

    this.ans(cur_item)
    this.check()

  },
  showTips: function () {
    
    var point_temp = LCData.GetNumber(LCData.ParamName.TOTAL_POINT)

    var cusPoint = 0;
    if (this.data.cur_level < 50){
      cusPoint = 30;
    } else if(this.data.cur_level < 100){
      cusPoint = 30;
    } else {
      cusPoint = 50;
    }

    if (point_temp < cusPoint){
      try {
        var res = wx.getSystemInfoSync()

        console.log(res.model)
        var str = res.model;

        if (str.search("iPhone") != -1) {
          wx.showToast({
            title: '金币不够哦！',
            icon: 'success',
            image: '../../imgs/comm/warn.png',
            duration: 2000
          })
          return
        } else {

        }
      } catch (e) {
        // Do something when catch error
      }
      wx.showToast({
        title: '金币不足',
        icon:'none'
      })
      // wx.showModal({
      //   title: '提示',
      //   content: '金币不足咯，获取更多金币？',
      //   cancelText: '返回',
      //   confirmText: '好的',
      //   success: function (res) {
      //     if (res.confirm) {
      //       wx.navigateTo({
      //         url: '../pay/pay'
      //       })
      //     }
      //   }
      // })

      return;
    }
    
    var ans_index = Number(this.data.cur_char)
    var ans_index_1 = ans_index +1
    var level = this.data.cur_level - 1
    var char = commons.JIELONG_FINISH[level].substring(ans_index, ans_index_1)

    var item = -1
    for(var i = 0; i < this.data.cur_sel_array.length;i++){
      if (this.data.array_show[i] && char == this.data.cur_sel_array[i]){
        item = i
        break
      }
    }
    console.log("char::" + char + "item:::  "+item )

    if(item == -1){
      wx.showToast({
        title: '答案已被选',
        duration:2500
      })
      return;
    }

    point_temp = point_temp - cusPoint
    LCData.Set(LCData.ParamName.TOTAL_POINT, point_temp)

    this.setData({
      total_point: point_temp
    })

    this.ans(item)
    this.check()
  },
  help: function(){
  },
  onShareAppMessage: function (res) {
    getApp().globalData.isFromCheckShare = true
    var that = this
    return {
      title: '我已经闯过' + this.data.cur_level + "关，谁与我战？",
      path: '/pages/index/index',
      success: function (res) {
        console.log("onshare success") 

        var curTime = parseInt((new Date()).getTime() / 86400000)
        var lastTime = LCData.GetNumber(LCData.ParamName.JL_SHARE_TIME) 
        var count = LCData.GetNumber(LCData.ParamName.JL_SHARE_COUNT)  
        if(curTime == lastTime)
          count = count + 1
        else 
          count = 1

        LCData.Set(LCData.ParamName.JL_SHARE_TIME, curTime) 
        LCData.Set(LCData.ParamName.JL_SHARE_COUNT, count)  



        if (that.data.cur_level < 50) {
          console.log("onshare success1")
          if (count > 10) {
            if (wx.getStorageSync("ShowTipsPre30") == "") {
              wx.setStorage({
                key: "ShowTipsPre30",
                data: "show",
              })

              wx.showModal({
                title: "提示",
                content: "您一天只能获取十次分享奖励哦！！！",
                showCancel: false
              })
            }
            return
          }
        } else if (that.data.cur_level < 100) {
          console.log("onshare success2")
          if (count > 6) {
            if (wx.getStorageSync("ShowTipsPre60") == "") {
              wx.setStorage({
                key: "ShowTipsPre60",
                data: "show",
              })

              wx.showModal({
                title: "提示",
                content: "您一天只能获取六次分享奖励哦！！！",
                showCancel: false
              })
            }
            return
          }
        } else {
          console.log("onshare success3")
          if (count > 3) {
            if (wx.getStorageSync("ShowTips") == "") {
              wx.setStorage({
                key: "ShowTips",
                data: "show",
              })

              wx.showModal({
                title: "提示",
                content: "您一天只能获取三次分享奖励哦！！！",
                showCancel: false
              })
            }
            return
          }
        }

        var point_tem = LCData.GetNumber(LCData.ParamName.TOTAL_POINT)
        point_tem = point_tem + 20;

        LCData.Set(LCData.ParamName.TOTAL_POINT, point_tem) 
        that.setData({
          total_point:point_tem
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function () {
    getApp().getStorageData(commons);
    var level = LCData.GetNumber(LCData.ParamName.CURRENT_LEVELS_JIELONG)
    var point_temp = LCData.GetNumber(LCData.ParamName.TOTAL_POINT) 


    if (level < 1) {
      level = 1
    }

    this.data.cur_level = level

    level = level -1;

    console.log("point:temp::::" + point_temp)

    //上半部分
    var array_url_temp =[]
    var array_cur_temp = []
    for (var i = 0; i < commons.JIELONG_INIT[level].length; i++){
      var iTemp = i +1
      var char_temp = commons.JIELONG_INIT[level].substring(i, iTemp)
      console.log("====" + commons.JIELONG_INIT[level])

      if (char_temp == "1"){
        array_url_temp[i] = this.data.EMPTY_BG
      } else {
        array_url_temp[i] = this.data.NOR_BG
      }
      if (this.data.cur_char == -1 && char_temp == "2"){
        this.data.cur_char = i
      }

      if (char_temp == "1" || char_temp == "2"){
        array_cur_temp[i] = ""
      } else {
        array_cur_temp[i] = char_temp
      }
      this.data.array_index[i]=-1
    }
    array_url_temp[this.data.cur_char] = this.data.SEL_BG

    //下半部分
    var cur_sel_array_temp = []
    var array_show_temp = []
    for(var i = 0; i < 40; i++){
      var iTemp = i + 1

      if (i < commons.JIELONG_ANS[level].length){
        array_show_temp[i] = true
        cur_sel_array_temp[i] = commons.JIELONG_ANS[level].substring(i, iTemp)
      } else {
        array_show_temp[i] = false
        cur_sel_array_temp[i] = ""
      }
      
    }


    this.setData({
      array:array_cur_temp,
      array_url:array_url_temp,
      total_point: point_temp,
      cur_sel_array: cur_sel_array_temp,
      array_show: array_show_temp
    })
  
  },
  onShow: function () {
    var total_point_temp = LCData.GetNumber(LCData.ParamName.TOTAL_POINT) 
    
    this.setData({
      total_point: total_point_temp
    })
  },
  onReady: function () {

    wx.setNavigationBarTitle({
      title: "【接龙 " + this.data.cur_level + "/100】"
    });
  },
  ans:function(cur_item){
    if (!this.data.array_show[cur_item]) {
      return;
    }

    var array_show_temp = []
    for (var i = 0; i < 40; i++) {
      array_show_temp[i] = this.data.array_show[i]
    }

    array_show_temp[cur_item] = false
    this.setData({
      array_show: array_show_temp
    })

    //更新当前的所选情况
    var array_url_temp = []
    var array_temp = []
    for (var i = 0; i < 100; i++) {
      array_url_temp[i] = this.data.array_url[i]
      array_temp[i] = this.data.array[i]
    }

    array_temp[this.data.cur_char] = this.data.cur_sel_array[cur_item]

    array_url_temp[this.data.cur_char] = this.data.NOR_BG

    this.data.array_index[this.data.cur_char] = cur_item

    //判断是否显示绿色


    //判断是否成功
    var strc = ""
    for (var i = 0; i < 100; i++) {
      if (array_temp[i] == "") {
        strc = strc + "1"
      } else {
        strc = strc + array_temp[i]
      }
    }

    var level = this.data.cur_level - 1
    

    if (strc == commons.JIELONG_FINISH[level]) {
      
      if(this.data.cur_level < 100){
        this.data.cur_level += 1;
      } else {
        wx.showModal({
          title: '提示',
          content: '跳转短语接龙，玩更多接龙关卡？',
          cancelText: '取消',
          confirmText: '好的',
          success: function (res) {
            if (res.confirm) {
              if (wx.navigateToMiniProgram) {
                wx.navigateToMiniProgram({
                  appId: 'wx192d0eb286a81096',
                  path: 'pages/sub_pages/play/play',
                  success(res) {
                    // 打开成功
                  }
                })
              } else {
                wx.showToast({
                  title: '微信版本过低',
                  duration: 2000,
                })
              }
            }
          }
        })
      }

      LCData.Set(LCData.ParamName.CURRENT_LEVELS_JIELONG, this.data.cur_level)  

      if (this.data.cur_level > LCData.GetNumber(LCData.ParamName.PASS_LEVELS_JIELONG) ) { 
        LCData.Set(LCData.ParamName.PASS_LEVELS_JIELONG, this.data.cur_level)  

        this.data.total_point = this.data.total_point + 50; 
        LCData.Set(LCData.ParamName.TOTAL_POINT, this.data.total_point)  

      }



      wx.redirectTo({
        url: 'jiecy'
      })
      var temp = this.data.cur_level - 1

      wx.showModal({
        title: "恭喜过关",
        content: '恭喜您通过成语接龙第' + temp + "关" + "\n\n                金币 +50",
        showCancel: false,
      })

      // this.data.cur_char = -1
      // this.data.array_url = []
      // this.data.array = []
      // this.data.array_index = []
      // this.data.array_show = []
      // this.data.cur_sel_array = []

      // this.onLoad()
      // this.onReady()

      return
    }

    //查找下一个焦点
    console.log()
    var index1 = Number(this.data.cur_char) + 1;
    var index2 = index1 + 1
    var index10 = Number(this.data.cur_char) + 10
    var index11 = index10 + 1;



    if (index1 < 100 && commons.JIELONG_INIT[level].substring(index1, index2) == "2" && array_temp[index1] == "") {
      this.data.cur_char = index1
      array_url_temp[this.data.cur_char] = this.data.SEL_BG
    } else if (index10 < 100 && commons.JIELONG_INIT[level].substring(index10, index11) == "2" && array_temp[index10] == "") {
      this.data.cur_char = index10
      array_url_temp[this.data.cur_char] = this.data.SEL_BG
    } else {
      for (var i = 0; i < 100; i++) {
        var i_1 = i +1
        if (commons.JIELONG_INIT[level].substring(i, i_1) == "2" && array_temp[i] == "") {
          this.data.cur_char = i
          array_url_temp[i] = this.data.SEL_BG
          break;
        }
      }
    }
    //this.data.cur_char = cur_item
    // array_url_temp[cur_item] = this.data.SEL_BG

    this.setData({
      array_url: array_url_temp,
      array: array_temp,
    })
  },

  check: function () {
    var array_url_temp = []
    for (var i = 0; i < 100; i++) {
      array_url_temp[i] = this.data.array_url[i]
    }

    var level = this.data.cur_level - 1
    for(var i = 0; i < 100; i++){
      var iPlus = i +1


      if (this.data.array[i] == "" || this.data.array[i] != commons.JIELONG_FINISH[level].substring(i, iPlus)){
        continue
      } 

      var tempi = i%10
      var count_left = 0
      var count_right = 0
      var wrong_left = false
      var wrong_right = false

      for(var j = 0; j <= tempi; j++){
        var i_j = i - j;
        var iPj = i - j + 1
        if (this.data.array[i_j] != "" && this.data.array[i_j] == commons.JIELONG_FINISH[level].substring(i_j, iPj)){
          count_left++
        } else if (this.data.array[i_j] == "" && commons.JIELONG_INIT[level].substring(i_j, iPj) !="2"){
          break;
        } else {
          wrong_left = true
          break;
        }
      }

      for (var j = 1; j < 10 - tempi; j++) {
        var i_j = i + j;
        var iPj = i + j + 1

        if (this.data.array[i_j] != "" && this.data.array[i_j] == commons.JIELONG_FINISH[level].substring(i_j, iPj)) {
          count_right++
        } else if (this.data.array[i_j] == "" && commons.JIELONG_INIT[level].substring(i_j, iPj) != "2") {
          break;
        } else {
          wrong_right = true
          break;
        }
      }

      if (wrong_left || wrong_right){
        
      } else {
        if(count_left + count_right >= 3){

          // for(var k = count_left-1; k > 0; k--){
          //   array_url_temp[i - k] = this.data.SUC_BG
          // }
          array_url_temp[i] = this.data.SUC_BG
          // for(var k = 1; k <= count_right; k++){
          //   array_url_temp[i + k] = this.data.SUC_BG
          // }
        }
      }

      var tempj = i / 10
      var count_top = 0
      var count_bottom = 0
      var wrong_top = false
      var wrong_bottom = false

      for (var j = 1; j <= tempj; j++) {

        var i_j = i - 10 * j;
        var iPj = i - 10 * j+ 1

        if (this.data.array[i_j] != "" && this.data.array[i_j] == commons.JIELONG_FINISH[level].substring(i_j, iPj)) {
          count_top++
        } else if (this.data.array[i_j] == "" && commons.JIELONG_INIT[level].substring(i_j, iPj) != "2") {
          break;
        } else {
          wrong_top = true
          break;
        }
      }

      for (var j = 1; j < 10 - tempj; j++) {
        var i_j = i + 10 * j;
        var iPj = i + 10 * j + 1

        if (this.data.array[i_j] != "" && this.data.array[i_j] == commons.JIELONG_FINISH[level].substring(i_j, iPj)) {
          count_bottom++
        } else if (this.data.array[i_j] == "" && commons.JIELONG_INIT[level].substring(i_j, iPj) != "2") {
          break;
        } else {
          wrong_bottom = true
          break;
        }
      }

      if (wrong_bottom || wrong_top) {

      } else {
        if (count_bottom + count_top >= 3) {
          array_url_temp[i] = this.data.SUC_BG
        }

      }

      this.setData({
        array_url: array_url_temp
      })

    }
  },
  tofuli:function(){
    wx.navigateTo({
      url: '/pages/welfare/welfare',
    })
  },

  data: {
    cur_level:1,

    idiom_explain:false,
    banner_sts:false,
    width:0.33,

    SEL_BG:"#bf9b82",
    NOR_BG: "#f6ce9b", 
    EMPTY_BG:"",
    array_sel_item:[],  //

    userid:10000,

    point_chg:0,
    total_point:200,

    array_cur_level_idioms:["不不不不"],//当前关卡的的10个成语
    array_cur_level_explain_brif: [],


    EMPTY_BG:"#b2c4c6",
    NOR_BG: "#ffffff",
    SEL_BG: "#893f00",

    SUC_BG: "#00FF00",
      
    array_url: [], 

    array: [],
    array_index:[],

    cur_char:-1,


    array_show:[],
    cur_sel_array: [],


    
  },
  
})
