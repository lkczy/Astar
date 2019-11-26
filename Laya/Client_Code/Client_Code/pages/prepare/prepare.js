// pages/ready/readyPage.js
import { Player } from "../../modules/Player"
import { FightRoom } from "../../dati_comm/modules/FightRoom"
import { GameConn, WorldConn } from "../../dati_comm/libs/network/Conns";
import { share } from "../../dati_comm/modules/share";
import { AutoJump } from "../../dati_comm/modules/LoginJump"
import { buttonDisabler } from "../../dati_comm/modules/buttonDisabler";
import { txt } from "../../dati_comm/sdata/SDataID2.js"

import * as AppColor from "../../dati_comm/modules/AppColor.js"

let timer
let offlineCount = 0
let timer2;
let dot_num = 0;

//import { SDTips } from "../../sdata/SDTips";
let datas = {
  wndname: "prepare",//窗体名称
  display: false,//block none
  //Tween 属性
  wndAlpha: 1,
  wndPosX: 0,
  items: [],
  waittxtv: false,//准备挑战
  fangqiv: false,//放弃data
  startv: false,//挑战开始
  yqhaoyou: false,//邀请好友
  showStart: false,//是否显示开战
  readytxtv: false,//准备挑战
  PlyCount: 1,//单边角色总数

  //绑定数据
  leftPly: [
    {
      v: true,
      icon: null,//图标
      name: "",//名字
    },
    {
      v: true,
      icon: null,//图标
      name: "",//名字
    },
    {
      v: true,
      icon: null,//图标
      name: "",//名字
    },
  ],
  rightPly: [
    { v: true, icon: null, name: "" },
    { v: true, icon: null, name: "" },
    { v: true, icon: null, name: "" },
  ],

  //绑定数据end
  q_type: {
    w: 314, h: 78, split: [52, 52, 0], img: [
      "../../imgs/fight/q_d_3.png",
      "../../imgs/fight/q_d_2.png",
      "../../imgs/fight/q_d_1.png",
    ]
  },
  //图片地址
  srcArr: ['../../imgs/fight/wait_1.png', '../../imgs/fight/wait_2.png', '../../imgs/fight/wait_3.png', '../../imgs/fight/wait_4.png'],
  waiteHeater: [
    '../../imgs/fight/h_1.png',
    '../../imgs/fight/h_2.png',
    '../../imgs/fight/h_3.png',
    '../../imgs/fight/h_4.png',
    '../../imgs/fight/h_5.png',
    '../../imgs/fight/h_6.png',
  ],
  an_1: null
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // animationData: {},
    animation: "",//转圈动画
    data: datas
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this._SetEmptyPly(datas.rightPly[0])
    this.setData({ ['data.dengdaidh']: 'dengdaidh' })
    this.setData({ ['data.headframe']: Player.HeadFrame })
   
    //动画
    setTimeout(() => {
      this.setData({
        ['data.top_VS']: 'top_VS'
      })
    }, 500)

    //检查链接状态
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

    AutoJump("prepare")
    this.NeedExitFight = true
    this._BindEvts()
    this.OnShowDone()
    this.OnJoin()
    this.OnLeave()
    this.OnStart()
    this.OnFightReady()
    this.OnEnterRoom()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._SetEmptyPly(datas.rightPly[0])
    AutoJump("prepare", options)
    for (var i = 0; i < 3; i++) {
      datas.leftPly[i].v = false
      datas.rightPly[i].v = false
    }
    this._UpdatePlys()
    //this.ontips()
  },

  offEvts: function () {
    FightRoom.EvtReady.Off(this.OnFightReady)
    FightRoom.EvtStart.Off(this.OnStart)
    FightRoom.EvtAJoin.Off(this.OnAJoin)
    FightRoom.EvtJoin.Off(this.OnJoin)
    FightRoom.EvtLeave.Off(this.OnLeave)
    FightRoom.EvtEnterRoom.Off(this.OnEnterRoom)
  },

  onUnload: function () {
    this.onHide()
  },

  onHide() {
    this._SetEmptyPly(datas.rightPly[0])
    if(timer) {clearInterval(timer);timer=null}
    if(timer2) { clearInterval(timer2); timer2 = null }
     
    this.offEvts()
    for (var i = 0; i < 3; i++) {
      datas.leftPly[i].v = false
      datas.rightPly[i].v = false
    }
    this._UpdatePlys();

    if (this.NeedExitFight) {
      FightRoom.LeaveRoom()
    }

    //重置
    datas = {
      wndname: "ready",//窗体名称
      display: false,//block none
      //Tween 属性
      wndAlpha: 1,
      wndPosX: 0,

      waittxtv: false,//准备挑战
      fangqiv: false,//放弃data
      startv: false,//挑战开始
      yqhaoyou: false,//邀请好友
      readytxtv: false,//准备挑战
      PlyCount: 1,//单边角色总数

      //绑定数据
      leftPly: [
        {
          v: true,
          icon: null,//图标
          name: "",//名字
        },
        {
          v: true,
          icon: null,//图标
          name: "",//名字
        },
        {
          v: true,
          icon: null,//图标
          name: "",//名字
        },
      ],
      rightPly: [
        { v: true, icon: null, name: "" },
        { v: true, icon: null, name: "" },
        { v: true, icon: null, name: "" },
      ],

      //绑定数据end
      q_type: {
        w: 314, h: 78, split: [52, 52, 0], img: [
          "../../imgs/fight/q_d_3.png",
          "../../imgs/fight/q_d_2.png",
          "../../imgs/fight/q_d_1.png",
        ]
      },

      //图片地址
      srcArr: ['../../imgs/fight/wait_1.png', '../../imgs/fight/wait_2.png', '../../imgs/fight/wait_3.png', '../../imgs/fight/wait_4.png'],
      waiteHeater: [
        '../../imgs/fight/h_1.png',
        '../../imgs/fight/h_2.png',
        '../../imgs/fight/h_3.png',
        '../../imgs/fight/h_4.png',
        '../../imgs/fight/h_5.png',
        '../../imgs/fight/h_6.png',
      ],
      an_1: null
    };
  },

  /**
   * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    this.NeedExitFight = false
    if (FightRoom.CurrMode == 9)//3v3模式
      return share.getTeamShareMessage(FightRoom.InviteCode)
    else//1v1模式
      return share.getPKShareMessage(FightRoom.InviteCode);
  },

  _SetEmptyPly(ply) {
    ply.v = true
    ply.icon = null
    ply.name = "???"
    ply.uid = ""
  },

  
  OnShowDone() {
    dot_num = 0;
    console.log(txt(2044))
    this.setData({ zzpp: txt(2044) })
    this.setData({ ppwc: txt(2046) })
    this.setData({ zzpp_a: true })
    this.setData({ ppwc_b: false }) 
    // 寻找对手中动画
    clearInterval(timer2);
    timer2 = setInterval(function () {
      dot_num++;
      if (dot_num > 3) {dot_num = 0;}
      var suff = "";
      for (var i=0;i<dot_num;i++) {
        suff += ".";
      }
      this.setData({ zzpp: txt(2044)+suff });
    }.bind(this), 500)


    FightRoom.CurrPairWnd = this;
    var pagetitle = ""
    switch (FightRoom.CurrMode) {
      case 4:
        pagetitle = "组队赛-个人"
        break
      case 6:
        pagetitle = "综合题"
        break
      case 7:
        pagetitle = ""//row[SDataQuestion.I_Tag]
        break
      case 8:
        pagetitle = "好友对战"
        break
      case 9:
        pagetitle = "组队赛-好友"
        break
    }
    // wx.setNavigationBarTitle({ title: pagetitle })

    //显示我方图标
    datas.leftPly[0].v = true
    datas.leftPly[0].icon = Player.IconUrl()
    datas.leftPly[0].name = Player.Name()
    datas.leftPly[0].hf = Player.IsVip
    datas.leftPly[0].k = Player.HeadFrame
 
    //显示对方图标
    this._SetEmptyPly(datas.rightPly[0])
    this.setData({ ["data.PlyCount"]: FightRoom.Is3V3 ? 3 : 1 })

    if (FightRoom.Is3V3) {
      for (var i = 1; i < 3; i++) {
        this._SetEmptyPly(datas.leftPly[i])
        this._SetEmptyPly(datas.rightPly[i])
      }
    } else {
      for (var i = 1; i < 3; i++) {
        datas.leftPly[i].v = false
        datas.rightPly[i].v = false
      }
    }

    for (var i = 0; i < 3; i++) {
      datas.leftPly[i].gifwait = !FightRoom.IsYaoQing
      datas.rightPly[i].gifwait = true
    }

    this._UpdatePlys()
    this._HideAllST()
    setTimeout(() => {
      this.setData({ ["data.waittxtv"]: true })
    }, 500)
    this.setData({ ["data.fangqiv"]: true })

    // this.setData({ [" data.dengdaia"]: false })
    //根据模式确定需要显示的界面
    this.setData({ ["data.yqhaoyou"]: FightRoom.IsYaoQing })  //邀请好友
    this.setData({ ["data.showStart"]: false }) //隐藏开始战斗按钮
  },

  _UpdatePlys() {

    // 头像跟名字
    // this.setData({
    //   nickname: Player.Name(),
    //   avatarUrl: Player.IconUrl(),
    //   nickname_right: FightRoom.RightPlys[0].name,
    //   avatarUrl_right: FightRoom.RightPlys[0].iconurl,
    // }) 
    this.setData({ ["data.leftPly"]: datas.leftPly })
    this.setData({ ["data.rightPly"]: datas.rightPly })
  },

  _HideAllST() {
    this.setData({ ["data.waittxtv"]: false })
    this.setData({ ["data.fangqiv"]: false })
    this.setData({ ["data.readytxtv"]: false })
  },

  _BindEvts() {
    this.offEvts()
    FightRoom.EvtReady.On(this, this.OnFightReady)
    FightRoom.EvtStart.On(this, this.OnStart)
    FightRoom.EvtAJoin.On(this, this.OnAJoin)
    FightRoom.EvtJoin.On(this, this.OnJoin)
    FightRoom.EvtLeave.On(this, this.OnLeave)
    FightRoom.EvtEnterRoom.On(this, this.OnEnterRoom)
  },

  _JoinPly(plyList, ply, isLeft) {
    var uid = ply.uid
    var name = ply.name
    for (var i = 0; i < plyList.length; i++) {
      if (
        plyList[i].uid == uid ||
        plyList[i].name == name
      ) return//重复添加
    }

    for (var i = 0; i < plyList.length; i++) {
      if (plyList[i].icon == null) {
        plyList[i].name = ply.name
        plyList[i].icon = ply.icon
        plyList[i].uid = ply.uid
        plyList[i].hf = ply.hf
        plyList[i].k = ply.k
        return
      }
    }
  },
  OnFightReady() {
    console.log("进入OnFightReady！！！")

 
    //头像框
    if (FightRoom.Step < FightRoom.RoomStep.Ready) return
    //设置双方头像
    for (var i = 0; i < FightRoom.LeftPlys.length; i++) {
      var ply = FightRoom.LeftPlys[i]
      this._JoinPly(datas.leftPly, { uid: ply.uid, name: ply.name, icon: ply.iconurl, hf: ply.hf, k: ply.k }, true)
    }

    this._UpdateRightPlys()
    this._HideAllST()
    this.setData({ ["data.readytxtv"]: true })
  },

  _UpdateRightPlys() {

    let index = 0
    let arr = []
    let len = FightRoom.RightPlys.length
    setTimeout(_ => {
      var ply = FightRoom.RightPlys[index]
 
      this._JoinPly(datas.rightPly, { uid: ply.uid, name: ply.name, icon: ply.iconurl, hf: ply.hf, k: ply.k }, false)
      this._UpdatePlys()
      var plyAnim1 = wx.createAnimation({
        duration: 300,
        timingFunction: 'linear',
      });
      plyAnim1.translateX(-50).step()
      this.setData({ ["data.ra1"]: plyAnim1.export() })
      ++index
      // 等待消失
      this.setData({ ["data.dengdaia"]: false })
      // VSd动画
      setTimeout(_ => {
        this.setData({ ["data.startv"]: true })
      }, 300);

      if (index >= len) {
        return
      }
      setTimeout(_ => {
        var ply = FightRoom.RightPlys[index]
        this._JoinPly(datas.rightPly, { uid: ply.uid, name: ply.name, icon: ply.iconurl, hf: ply.hf, k: ply.k }, false)
        this._UpdatePlys()
        var plyAnim2 = wx.createAnimation({
          duration: 300,
          timingFunction: 'linear',
          delay: 100,
        });
        plyAnim2.translateX(-50).step()
        this.setData({ ["data.ra2"]: plyAnim2.export() })
        ++index

        if (index >= len) {
          return
        }
        setTimeout(_ => {
          var ply = FightRoom.RightPlys[index]
          this._JoinPly(datas.rightPly, { uid: ply.uid, name: ply.name, icon: ply.iconurl, hf: ply.hf, k: ply.k }, false)
          this._UpdatePlys()
          var plyAnim3 = wx.createAnimation({
            duration: 300,
            timingFunction: 'linear',
            delay: 100,
          });
          plyAnim3.translateX(-50).step()
          this.setData({ ["data.ra3"]: plyAnim3.export() })
          // this.setData({["data.readytxtv"]: true})

        }, 200)
      }, 200)
    }, 100)
  },

  OnJoin() {
    var leftJoin = FightRoom.LeftJoin
    var rightJoin = FightRoom.RightJoin

    for (var i = 0; i < leftJoin.length; i++) {
      this._JoinPly(datas.leftPly, leftJoin[i], true)
    }

    for (var i = 0; i < rightJoin.length; i++) {
      this._JoinPly(datas.rightPly, rightJoin[i], false)
    }

    var count = 0
    for (var i = 0; i < datas.leftPly.length; i++) {
      var ply = datas.leftPly[i]
      if (ply.v && ply.icon) count++
    }
    this.setData({ ["data.showStart"]: (count == 2 && FightRoom.CurrMode == 9) })
    this.setData({ ["data.yqhaoyou"]: FightRoom.IsYaoQing && count < 3 })  //邀请好友






    this._UpdatePlys()
  },

  OnEnterRoom() {
    console.log("进入战斗页面", FightRoom.Step < FightRoom.RoomStep.EnterRoom)
    
    if (
      FightRoom.Step < FightRoom.RoomStep.EnterRoom ||
      getCurrentPages().length < 2//修正战斗页面覆盖主页bug
    ) return
    this.NeedExitFight = false

    //显示战斗界面
    getApp().globalData.wnds.Wnd_Fight.Show()
    
  },

  OnLeave() {
    var leftJoin = FightRoom.LeftJoin
    var rightJoin = FightRoom.RightJoin
    for (var i = 1; i < datas.leftPly.length; i++) {
      if (datas.leftPly[i].v) {
        var isfind = false
        var uid = datas.leftPly[i].uid
        for (var k = 0; k < leftJoin.length; k++) {
          if (leftJoin[k].uid == uid) {
            isfind = true
            break
          }
        }
        if (!isfind) this._SetEmptyPly(datas.leftPly[i])
      }
    }

    for (var i = 0; i < datas.rightPly.length; i++) {
      if (datas.rightPly[i].v) {
        var isfind = false
        var uid = datas.rightPly[i].uid
        for (var k = 0; k < rightJoin.length; k++) {
          if (rightJoin[k].uid == uid) {
            isfind = true
            break
          }
        }
        if (!isfind) this._SetEmptyPly(datas.rightPly[i])
      }
    }
    this.OnJoin()
  },

  OnStart() {
    if (FightRoom.Step < FightRoom.RoomStep.Start) return
    this._HideAllST()
  },

  //提供给FightRoom调用的返回接口
  Back() {
    WorldConn.Close()//关闭世界链接

    if( getCurrentPages().length > 1)
      wx.navigateBack({ delta: 1 })
  },

  OnAJoin() {
    this.setData({ zzpp_a: false})
    this.setData({ ppwc_b:  true})  
        //配对已经完成，全部用户进入房间
    clearInterval(timer2);
  },

  OnStartClick(event) {
    if (!buttonDisabler.canClick()) return;
    this.setData({ ["data.showStart"]: false })
    WorldConn.Request(
      { n: "start" },
      (data) => {
        this.ParseStartResult(data)
      })
  },

  ParseStartResult(data) {
    var r = data.r
    this.setData({ ["data.showStart"]: (r == 2) })
  },

  ontips() {
    var items = []
    let dw = Player.Level1;
    dw = parseInt(dw) + 1 + ''
    SDTips.Foreach((id, row) => {
      var item = {
        Id: row[SDTips.I_ID]//ID
      }
      var a = item.Id.toString()
      if (a[0] == "1") {
        item = {
          Notes: row[SDTips.I_Notes]//名称
        }
        items.push(item)
      } else if (a[0] == dw) {
        item = {
          Notes: row[SDTips.I_Notes]//名称
        }
        items.push(item)
      }
    })
    let r = Math.floor(Math.random() * items.length)
    this.setData({ ["data.items"]: items[r] })
  },

  //放弃被点击
  OnFangqiClick(evt) {
    if (!buttonDisabler.canClick()) return;
    this.Back()
  }
})
