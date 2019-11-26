import { Player } from "../../modules/Player"
import { GameConn, WorldConn } from "../../dati_comm/libs/network/Conns";
import { FightRoom } from "../../dati_comm/modules/FightRoom"
//import { SDataKeyValue } from "../../sdata/SDataKeyValue"
import { txt } from "../../dati_comm/sdata/SDataID2.js"
import { data } from "../../dati_comm/sdata/KeyValue.js"

import * as DataSecurity from "../../dati_comm/modules/DataSecurity"
import * as LCData from "../../modules/LocalData"

// pages/play/play.js
let common = require("../../utils/util.js");
import Guessing from "./fn.js";
let _isshowDone
let timer
let offlineCount = 0
let timer2;
let tip_time = 20;
let refresh = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur_turn_level: 1,//当前关卡,
    main_img_url: "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/pic/obj_" + 1 + ".jpg",//图片
    total_point: '12',
    array_show: [],
    array: [],
    ans: [24, 24, 24, 24],
    show_tip_btn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().getStorageData(common);
    refresh = true
    this.setData({ shuzhi: 0 })
    this.setData({ fenshu_left: 0 })
    this.setData({ fenshu_right: 0 })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("fight ready###########")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("fight show###########")
    _isshowDone = true

    offlineCount = 0
    if (timer) clearInterval(timer)
    timer = setInterval(
      () => {
        //console.log("检查世界服链接状态",WorldConn.Connected())
        if (!WorldConn.Connected()) {
          offlineCount++
          if(offlineCount>3)
          { 
              clearInterval(timer);
              timer = null
              getApp().globalData.ServerLogin.ShowGoHomeBox()
          }
        }else
          offlineCount = 0
      },
      3000
    )

    this._BindEvts()
    this.OnEnterRoom()
    this.OnDoLun0()

    this.OnDoKantiEnd()
    //this.OnDoTexiao() 修正了锁屏切回时，回答问题区域不显示bug
    this.OnDoLun()
    this.OnDoHuidaJG()
    this.OnCJ()
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    refresh = false
    _isshowDone = false
    if (timer) { clearInterval(timer); timer = null }
    if (timer2) { clearInterval(timer2); timer2 = null }
    this.offEvts()
  },

  offEvts: function () {
    console.log("！！！！！！！！！！！！！！！！！！注销事件")
    FightRoom.EvtEnterRoom.Off(this.OnEnterRoom)
    FightRoom.EvtDoLun0.Off(this.OnDoLun0)
    FightRoom.EvtDoLun.Off(this.OnDoLun)
    FightRoom.EvtDoKantiEnd.Off(this.OnDoKantiEnd)
    FightRoom.EvtDoTexiao.Off(this.OnDoTexiao)
    FightRoom.EvtDoHuidaJG.Off(this.OnDoHuidaJG)
    FightRoom.EvtCJ.Off(this.OnCJ)
  },

  _BindEvts() {
    console.log("！！！！！！！！！！！！！！！！！！绑定事件")
    this.offEvts()
    FightRoom.EvtEnterRoom.On(this, this.OnEnterRoom)
    FightRoom.EvtDoLun0.On(this, this.OnDoLun0)
    FightRoom.EvtDoLun.On(this, this.OnDoLun)
    FightRoom.EvtDoKantiEnd.On(this, this.OnDoKantiEnd)
    FightRoom.EvtDoTexiao.On(this, this.OnDoTexiao)
    FightRoom.EvtDoHuidaJG.On(this, this.OnDoHuidaJG)
    FightRoom.EvtCJ.On(this, this.OnCJ)
  },

  OnCJ() {
    if (!_isshowDone || !FightRoom.Chengji) return
    getApp().globalData.wnds.Wnd_overFight.Show();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.onHide()
  },

  OnEnterRoom() {
    if (!_isshowDone) return

    //隐藏答案
    this.setData({
      show_daan: null,
      qizi_left: false,
      qizi_right: false
    })
    //隐藏答案     
    if (refresh) {
      this.setData({
        array_show: null,
      })
    }
    if (FightRoom.LFen == 0) {
    } else {
      this.setData({ fenshu_left: FightRoom.LFen })
    }

    if (FightRoom.RFen == 0) {
    } else {
      this.setData({ fenshu_right: FightRoom.RFen })
    }


    // 头像跟名字
    this.setData({
      nickname: Player.Name(),
      avatarUrl: Player.IconUrl(),
      nickname_right: FightRoom.RightPlys[0].name,
      avatarUrl_right: FightRoom.RightPlys[0].iconurl
    })
  },

  OnDoLun0() {
    if (!_isshowDone) return
    if (refresh) {
      this.startTipBtnTime();
    }
    //隐藏答案
    this.setData({
      show_daan: null,//胜利后显示的答案
      menban: false,//蒙版
      qizi_left: false,
      qizi_right: false
    })

    if (!_isshowDone) return

    // this.data.ans = [24, 24, 24, 24]

    // 关卡数
    var guanqia = FightRoom.Lun
    if (LCData.Get(LCData.ParamName.GUANQIA) != guanqia) {
      LCData.Set(LCData.ParamName.GUANQIA, guanqia)
      this.data.ans = [24, 24, 24, 24]
      this.setData({
        ans: this.data.ans
      })
    }

    this.setData({
      cur_turn_level: guanqia,
      gqs: FightRoom.MaxLun,
    })

  },

  // 重置并开始提示按钮出现计时
  startTipBtnTime() {
    clearInterval(timer2);
    // var n = data.body["1"][data.head.indexOf("AutoTipsTime")] || 20;
    tip_time = 10;
    this.setData({
      show_tip_btn: false,
    });
    timer2 = setInterval(function () {
      tip_time--;
      if (tip_time == 0) {
        clearInterval(timer2);
        this.setData({
          show_tip_btn : true,
        });
      }
    }.bind(this),1000);
  },

  // 开始一个题目
  OnDoLun() {
 
    if (!_isshowDone) return

    console.log("FightRoom.Wenti:::" + FightRoom.Wenti)

    var main_img_temp = "http://xcxcy.oss-cn-hangzhou.aliyuncs.com/cycck/pic/obj_" + FightRoom.Wenti + ".jpg"
    if (FightRoom.Wenti > 501) {
      main_img_temp = "http://cyktc.oss-cn-beijing.aliyuncs.com/cyimg_rename/" + common.PIC[FightRoom.Wenti - 502];
    }
    console.log("图片", FightRoom.Wenti)
    this.setData({
      main_img_url: main_img_temp
    })
    
    this.setData({
      daan_img: false,
      shuzhi: 1
    })

  },


  OnDoKantiEnd() {
 
    if (!_isshowDone || !FightRoom.Daan) return

    // 进行切换后台，不刷新
    if (LCData.Get(LCData.ParamName.DAAN) != FightRoom.Wenti) {
      LCData.Set(LCData.ParamName.DAAN, FightRoom.Wenti)
      var array_show = []
      this.guess = new Guessing({
        cur_turn_level: FightRoom.Wenti,//当前轮
        ALL_IDIOMS: common.ALL_IDIOMS
      })
      for (let i = 0; i < 32; i++) {
        array_show.push(true)
      }
      this.setData({
        array: this.guess.random_da_an
      })
      this.setData({
        array_show: array_show
      })
      this.setData({
        daan_xs: true
      })
    }

 
    // this.startTipBtnTime();
  }, 
  OnDoTexiao() {
    refresh = true
    console.log("进入次数！！！", FightRoom.Texiao)
    if (FightRoom.Texiao!=null){
      switch (FightRoom.Texiao) {
        case 1://最后一轮双倍
          {

            this.setData({
              show_daan: false,
              daan_img: true,
              qizi_left: false,
              qizi_right: false,
              data_xyt: txt(2051),
              daan_xs: false
            })

          }
          break
        case 2://下一题提示
          {
            this.setData({
              show_daan: false,
              qizi_left: false,
              qizi_right: false,
              daan_img: true,
              data_xyt: txt(2050),
              daan_xs: false
            })
          }
          break
      }
    }
  },

  OnDoHuidaJG() {
    if (!_isshowDone || !FightRoom.HuidaJG) return
    var hdjg = FightRoom.HuidaJG

    this.setData({
      show_daan: this.guess.currentGussint,
      menban: true
    })

    if (hdjg.uid == FightRoom.LeftPlys[0].uid){
      this.setData({
        fenshu_left: hdjg.f,
        qizi_left: true
      })
      refresh = true 
    }else{
      this.setData({
        fenshu_right: hdjg.f,
        qizi_right: true
      })
      refresh = true
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //选择答案
  clickItem({ currentTarget }) {
    var selectDaAn = this.data.ans;

    if (!selectDaAn.includes(24)) {
      wx.showToast({
        title: '先删除错误答案',
        icon: 'success',
        image: '../../imgs/comm/warn.png',
        duration: 2000
      })
      return
    }
    //获取点击的答案
    let { item } = currentTarget.dataset;
    console.log(currentTarget);

    for (let i = 0; i < selectDaAn.length; i++) {
      if (selectDaAn[i] == 24) {
        selectDaAn.splice(i, 1, item)
        break
      }
    }

    this.setData({
      [`array_show[${item}]`]: false,
      ans: selectDaAn
    })


    var user_da_an = '';
    for (let i = 0; i < selectDaAn.length; i++) {
      user_da_an += this.data.array[selectDaAn[i]]
    }

    console.log('选择的答案：', user_da_an)
    console.log('正确答案：', this.guess.currentGussint)
    //判断答案是否正确
    if (this.guess.currentGussint == user_da_an && user_da_an.length == 4) {
      // 关卡数
      var guanqia = FightRoom.Lun
      // 答案
      var daan = user_da_an
      // 签名
      var pubKey = FightRoom.Daan
      //  协议
      var nm = { n: "hd", x: daan, lun: guanqia, s: DataSecurity.Sign(pubKey, daan, guanqia) }
      //显示答案
      this.setData({
        show_daan: daan,
        menban: true
        })


      //发送协议  
      WorldConn.Request(nm, (data) => {
        console.log("回答返回 ", data.r)
      })

    }
    else if (user_da_an.length == 4) {
      wx.showToast({
        title: '存在错误哦',
        icon: 'success',
        image: '../../imgs/comm/warn.png',
        duration: 2000
      })
    }
    console.log(parseInt(item))
  },
  //取消答案
  clickAns({ currentTarget }) {
    let { item } = currentTarget.dataset;
    let selectDaAn = this.data.ans;
    console.log(selectDaAn[item])
    this.setData({
      [`array_show[${selectDaAn[item]}]`]: true
    })
    for (let i = 0; i < selectDaAn.length; i++) {
      if (selectDaAn[i] == selectDaAn[item]) {
        selectDaAn.splice(i, 1, 24)
        break
      }
    }
    this.setData({
      ans: selectDaAn
    })

  },
  //提示
  showTips() {
    //获取用户当前选择的答案
    let user_da_an = this.data.ans;

    for (let i = 0; i < user_da_an.length; i++) {
      if (user_da_an[i] == 24) {
        // user_da_an[i] = this.guess.Da_An_Index_Arr[i]// this.guess.tipDaAn(this.guess.currentGussint[i])
        // this.setData({
        //   ans: user_da_an,
        //   [`array_show[${user_da_an[i]}]`]: false
        // })
        // //用户提示
        // tip.bind(this)(getChenYu.bind(this)(user_da_an));

        var obj = {};
        obj.currentTarget = {};
        obj.currentTarget.dataset = { item: this.guess.Da_An_Index_Arr[i] };
        this.clickItem(obj)
        this.setData({ show_tip_btn : false });
        this.startTipBtnTime();
        return;
      }
    }

    wx.showToast({
      title: '先删除错误答案',
      icon: 'success',
      image: '../../imgs/comm/warn.png',
      duration: 2000
    })
    console.log(this.guess.tipDaAn('因'))

  }
})
//用户选择答案提示
function tip(user_da_an) {
  //判断答案是否正确
  if (this.guess.currentGussint == user_da_an && user_da_an.length == 4) {
    console.log('答案正确')//cur_turn_level 
    wx.redirectTo({
      url: 'fight'
    })

    //成语解析
    wx.showModal({
      title: common.ALL_IDIOMS[currentGK - 1],
      content: '【解释】：' + common.EXPLAIN[currentGK - 1] + "\n\n金币 +5",
      showCancel: false
    })

  }
  else if (user_da_an.length == 4) {
    wx.showToast({
      title: '存在错误哦',
      icon: 'success',
      image: '../../imgs/comm/warn.png',
      duration: 2000
    })
  }
}
//返回用户正确答案
function getChenYu(ans) {
  let user_da_an = '';
  for (let i = 0; i < ans.length; i++) {
    user_da_an += this.data.array[ans[i]]
  }
  return user_da_an
}
