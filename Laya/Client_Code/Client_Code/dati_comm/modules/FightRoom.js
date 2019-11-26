import { GameConn, WorldConn } from "../libs/network/Conns";
import { UIEvent } from "../libs/network/UIEvent.js"
import { Player } from "../../modules/Player.js"
import { txt } from "../sdata/SDataID2"
import { loginLoading } from "../libs/network/loginLoading";
//import { SDatadzface } from "../../sdata/SDatadzface"
//import { SDatadztalk } from "../../sdata/SDatadztalk"
import * as MsgBox from "../modules/MsgBox";
import { ALL_IDIOMS } from "../../utils/util"
//import { SDataUserFrame } from "../sdata/SDataUserFrame";

var op = Math.round(Math.random() * 9999)


let instance

function StopFight() {
  instance.Stop()
  WorldConn.Close()//断开世界链接
  //GameConn.Retry()//重建和游戏服的联系
}



//战斗房间
class FightRoom {
  constructor() {
    WorldConn.OnNotify.On(this, this.OnRecv)

    this.EvtEnterRoom = new UIEvent() //进入房间
    this.EvtDoT = new UIEvent() //战斗倒计时刷新
    this.EvtDoLun = new UIEvent() //一轮正式开始了
    this.EvtDoLun0 = new UIEvent() //一轮即将开始
    this.EvtDoKantiEnd = new UIEvent() //看题结束
    this.EvtDoTexiao = new UIEvent() //执行特效
    this.EvtDoHuidaJG = new UIEvent() //服务器返回了回答结果
    this.EvtDoHuiheEnd = new UIEvent() //一个回合结束
    this.EvtCJ = new UIEvent() //战斗结束，返回了战斗结果
    this.EvtReady = new UIEvent()//进入准备就绪状态
    this.EvtStart = new UIEvent()//进入开始状态 
    this.EvtJoin = new UIEvent() //一个用户加入了战斗
    this.EvtLeave = new UIEvent() //一个用户离开了战斗
    this.EvtUserReady = new UIEvent() //一个用户点击了再来一局
    this.EvtSpk = new UIEvent()//收到了用户聊天信息，包括自己
    this.EvtAJoin = new UIEvent()//匹配已经成功，全部用户进入房间

    this.RoomStep = {
      None: 0,
      Ready: 5,
      Start: 10,
      EnterRoom: 20
    }
    this.Step = this.RoomStep.None

    this._CurrPairWnd = null


    this.Wenti = 1

    this.SpeekList = []
    this.LeftPlys = []
    this.RightPlys = []

    this.LeftJoin = []
    this.RightJoin = []
    this.ReadyUsers = []//战斗结算界面已经准备就绪的玩家

    this.MaxLun = 10//总轮次默认
    this.MaxFen = 1000//总分数默认
  }

  ShowBox(msg, callBack) {
    wx.showModal(
      {
        title: "消息",
        content: msg,
        showCancel: "false",
        cancelText: "",
        confirmText: "确定",
        confirmColor: "#3cc51f",
        complete: (res) => {
          if (callBack)
            callBack()
          else {
            if (this._CurrPairWnd) this._CurrPairWnd.Back();
          }
        }
      }
    )
  }
  //设置回退提示
  /*
  SetBackTip(txt)
  {
    this.BackTip = txt
  }*/

  /*
  //清回退提示
  ClearBackTip()
  {
    this.BackTip = null
  }*/

  //自动显示回退提示
  /*
  AutoShowBackTip()
  {
    if (this.BackTip)
    {
      wx.showModal(
        {
          title: "消息",
          content: this.BackTip,
          showCancel: "false",
          cancelText: "",
          confirmText: "确定",
          confirmColor: "#3cc51f",
          complete: (res) => {}
        }
      )
      this.BackTip = null

    }
}*/

  //当前是否为3v3模式
  get Is3V3() { return this.CurrMode == 4 || this.CurrMode == 9 }

  //当前是否为邀请好友模式
  get IsYaoQing() { return this.CurrMode == 9 || this.CurrMode == 8 }

  //通知服務器客戶端離開房間
  LeaveRoom() {
    //延迟发送，如果是锁屏导致的离开则取消
    this.needSendLeaveNM = true
  }

  CancelLeaveRoom() {
    this.needSendLeaveNM = false
  }

  DoLeaveRoom() {
    if (this.needSendLeaveNM) {
      this.needSendLeaveNM = false
      StopFight()
      this.Fighting = false
      GameConn.Request(
        { n: "exitroom" },
        (data) => { this.AutoShowLostMoney(data) }
      )
    }
  }

  AutoShowLostMoney(data) {
    if (data.money) {
      this.ShowBox(txt(1021).format(data.money), () => { })
    }
  }

  //通知服务器，客户端离开房间，通常用于测试战斗状态
  LeaveRoom2(callback) {
    loginLoading.show("", true);
    this.Fighting = false
    //发起对战
    GameConn.Request(
      { n: "exitroom" },
      (data) => {
        loginLoading.hide()
        callback(data.r)
      }
    )
  }

  LeaveRoom3(callback) {
    this.Fighting = false
    //发起对战
    GameConn.Request(
      { n: "exitroom" },
      (data) => {
        callback(data.r)
      }
    )
  }

    //建立游戏连接
    ConnGame(completeFunc)
    {
        
        if(getApp().globalData.LoginOK) 
        {
            completeFunc(true)
            return
        }

        getApp().globalData.ServerLogin.login()

        //loginLoading.show("请稍后...", true);

        if(this.ConnGameTimer) {clearInterval(this.ConnGameTimer);}

        var count = 0
        //等待登录完成
        this.ConnGameTimer = setInterval(()=>{
            if(getApp().globalData.LoginOK)
            { 
                //loginLoading.hide()
                clearInterval(this.ConnGameTimer);
                this.ConnGameTimer = null
                completeFunc(true)
                return
            }
            count++
            if(count>=100) //超时了
            {
                //loginLoading.hide()
                clearInterval(this.ConnGameTimer);
                this.ConnGameTimer = null
                completeFunc(false)
                return
            }
        },50
        )
        
    }
  


  //显示准备战斗界面
  ShowReadyWnd(IsRePK = false)
  {
    //显示准备战斗界面 
    if (
      IsRePK &&
      getCurrentPages().length > 1//页面路由大于1，证明当前不在主页
    ) getApp().globalData.wnds.Wnd_prepare.TemporaryJumpMode = 3
    getApp().globalData.wnds.Wnd_prepare.Show()

  }
 


  //开始PK
  StartPK(m, s = 0, fl = 0, lz = 0, joinCode = null) {
    if(!getApp().globalData.LoginOK)
    {
      console.log("StartPK 网络故障")
      if (this._CurrPairWnd) this._CurrPairWnd.Back();

      return
    }
    //if (this.IsWorking) return
    StopFight()

    //loginLoading.show("", true);

    this.LeaveRoom3(
      (r)=>
      {
        this._ResetParam()
          //if(this._CurrPairWnd)
          //{
          //  console.log(" this._CurrPairWnd",this._CurrPairWnd)
          //  this._CurrPairWnd.SetMode(m)
          //} 
          //发起对战
          var nm = {
            n: "dz",
            m: m,//模式
            s: s,//子模式
            op: op++,//操作号
            lz: lz,//是否是连续战斗
            fl: fl,//分类id
          }
          if (joinCode) {
            nm.join = joinCode
            this.InviteCode = joinCode
          } else {
            this.InviteCode = Player.InviteCode
          }

          //console.log("StartPK ",nm);
          GameConn.Request(
            nm,
            (data) => { this.ParseDZ(data) }
          )

      }
    )
  
  }
  //重新开战
  RePK() {
    StopFight()

    //loginLoading.show("", true);
    this._ResetParam()
 

    GameConn.Request(
      { n: "refight" },
      (data) => { this.ParseRefight(data) }
    )
  }

  _ResetParam() {
    this.FightIsStop = false 
    this.LeftJoin = []
    this.RightJoin = []
    this.ReadyUsers = []
    this.Fighting = true
    this.Texiao = null//清特效
    this.Daan = null//清答案
    this.Chengji = null
    this.Step = this.RoomStep.None
    this.IsEnterRoom = false
    this.LunZQ = null//本轮正确答案
    this.RightSel = []//右边选择的缓存
    this.IsWorking = true
    this.SpeekList = []//聊天队列
  }


  OnRecv(jDoc) {
    switch (jDoc.n) {
      case "lun0":
        this._Parselun0(jDoc)
        break;
      case "lun":
        this._Parselun(jDoc)
        break;
      case "hdjg":
        this._Parsehdjg(jDoc)
        break;
      case "hhEnd":
        this._ParsehhEnd(jDoc)
        break;
      case "cj":
        this._ParseCJ(jDoc)
        break;
      case "t":
        this._ParseT(jDoc)
        break;
      case "tx":
        this._Parsetx(jDoc)
        break;
      case "ktend":
        this._Parsektend(jDoc)
        break;
      case "ajoin":
        this._Parseajoin(jDoc)
        break;
      case "join":
        this._Parsejoin(jDoc)
        break;
      case "lv":
        this._Parselv(jDoc)
        break;
      case "eready":
        this._Parseeready(jDoc)
        break;
      case "spk":
        this._Parsespk(jDoc)
        break;
    }
  }

  /*
  n:,
uid:<string>,//发言者ID
tp:<int>,//发言类型
id:<int>,//发言id
   */

  _Parsespk(jDoc) {
    console.log("spk", jDoc)

    var uid = jDoc.uid
    var ply = this.LeftPly(uid)
    if (!ply) ply = this.RightPly(uid)
    if (!ply) return//不存在的角色
/*
    var spkObj
    if (jDoc.txt) {
      spkObj = { ply: ply, tp: 2 }
      spkObj.txt = jDoc.txt
    } else {
      spkObj = { ply: ply, tp: jDoc.tp }
      if (jDoc.tp == 1) {
        var row = SDatadzface.GetRow(jDoc.id)
        spkObj.emoticon = Player.ArticleServerUrl() + "/public/uploads/ProblemImg/" + row[SDatadzface.I_Picture]
      } else {
        var row = SDatadztalk.GetRow(jDoc.id)
        spkObj.txt = row[SDatadztalk.I_TextPre]
      }
    }
*/
    //this.SpeekList.push(spkObj)
    //this.EvtSpk.Emit()
  }

  //有角色准备就绪
  _Parseeready(jDoc) {

    var uid = jDoc.u
    for (var i = this.ReadyUsers.length - 1; i >= 0; i--) {
      if (this.ReadyUsers[i].uid == uid) return//重复添加
    }

    var ply = this.LeftPly(uid)
    if (ply) {
      this.ReadyUsers.push(ply)
    } else {
      ply = this.RightPly(uid)
      if (ply) this.ReadyUsers.push(ply)
    }

    this.EvtUserReady.Emit()
  }

  //有角色离开了战斗
  _Parselv(jDoc) {
    console.log("lv", jDoc)

    for (var i = this.LeftJoin.length - 1; i >= 0; i--) {
      if (this.LeftJoin[i].uid == jDoc.uid) this.LeftJoin.splice(i, 1)
    }

    for (var i = this.RightJoin.length - 1; i >= 0; i--) {
      if (this.RightJoin[i].uid == jDoc.uid) this.RightJoin.splice(i, 1)
    }


    for (var i = this.ReadyUsers.length - 1; i >= 0; i--) {
      if (this.ReadyUsers[i].uid == jDoc.uid) this.ReadyUsers.splice(i, 1)
    }

    console.log("========post Leave==========")
    this.EvtLeave.Emit()
  }

  _Parsejoin(jDoc) {
    console.log("join", jDoc)

    jDoc.icon = this.IconUrl(jDoc.icon)
    jDoc.k = this.HeadFrameUrl(jDoc.k)

    if (jDoc.isl == 1)
      this.LeftJoin.push(jDoc)
    else {
      this.RightJoin.push(jDoc)
      console.log("========post join right==========")
    }

    console.log("========post join==========")
    this.EvtJoin.Emit()
  }

  HeadFrameUrl(shopid) {
    /*
    if (!shopid) return null
    var img = SDataUserFrame.GetRow(shopid)[SDataUserFrame.I_Picture]
    return Player.ArticleServerUrl() + "/public/uploads/ProblemImg/" + img
    */
    return null
  }


  _Parseajoin(jDoc) {

    this.EvtAJoin.Emit()

    //console.log("ajoin",jDoc)
    this._roomsid = jDoc.sid + 100000000
    this._SendRoom()

  }

  _SendRoom() {
    if (this.IsEnterRoom) return

    this.IsEnterRoom = true
    //重新绑定世界链接路由
    WorldConn.BindSessionCode(this._roomsid, this._WorldSessioncode)

    //请求获取房间信息
    WorldConn.Request(
      { n: "room" },
      (data) => {
        this.RoomResult(data)
      }
    )
  }

  _ParseT(jDoc) {
    this.SYDatiTime = jDoc.v
    this.EvtDoT.Emit()
  }

  _ClearWtcache() {
    this.LunZQ = null//本轮正确答案
    this.RightSel = []//右边选择的缓存
    this.HuidaJG = null//清回答结果
    this.HuiHeJG = null//清回合结果
    this.SYDatiTime = null//清剩余答题时间
  }

  _Parselun0(jDoc) {
    this._ClearWtcache()
    this.Lun = jDoc.currlun
    this.DatiTime = jDoc.dt //答题时间，秒

    this.EvtDoLun0.Emit()
  }

  _Parselun(jDoc) {
    //解释包信息

    this.WentiImg = jDoc.img //图片地址
    if (this.WentiImg) {
      this.WentiImg = Player.ArticleServerUrl() + "/public/uploads/ProblemImg/" + this.WentiImg
    }
    this.WentiMusic = jDoc.music //音乐地址
    this.Wenti = (jDoc.tm % (ALL_IDIOMS.length - 13)) + 1 //题目

    this.EvtDoLun.Emit()
  }
  _Parsektend(jDoc) {
    console.log("_Parsektend!!!", jDoc)
    this.Daan = jDoc.k //答案数组
    this.EvtDoKantiEnd.Emit()
  }

  _Parsetx(jDoc) {
    this.Texiao = jDoc.tx //特效id 1代表最后一轮双倍 2代表提示分类
    this.TexiaoTime = jDoc.txtime //特效播放的时长/秒
    this.Texiaotxt = jDoc.txt //特效文本
    this.EvtDoTexiao.Emit()
  }

  _Parsehdjg(jDoc) {
    this.HuidaJG = jDoc

    //缓存右边选择的答案
    var rightPly = this.RightPly(jDoc.uid)
    if (rightPly) {
      this.RightSel.push(
        {
          ply: rightPly,
          x: jDoc.x
        }
      )
    }

    if (jDoc.zq) this.LunZQ = jDoc.zq
    this.EvtDoHuidaJG.Emit()//执行回答结果
  }

  _ParsehhEnd(jDoc) {
    this.HuiHeJG = jDoc
    //this.LunZQ = jDoc.zq
    this.EvtDoHuiheEnd.Emit()//执行回合结束
  }

  _ParseCJ(jDoc) {
    this.IsWorking = false
    this.Chengji = jDoc
    this.EvtCJ.Emit()
  }
  get CurrPairWnd() {
    return this._CurrPairWnd
  }


  set CurrPairWnd(wnd) {
    this._CurrPairWnd = wnd
  }

  _AutoRequestDuanWeiInfo() {
    if (this.Is3V3 && !getApp().globalData.wnds.Wnd_Match.dwdata)//自动请求3v3需要的信息
    {
      GameConn.Request(
        { n: "pk3v3" },
        (data) => {
          getApp().globalData.wnds.Wnd_Match.dwdata = data
        }
      )
    }
  }


  ParseRefight(data) {
    //loginLoading.hide()
    this.CurrMode = data.mode//当前战斗模式

    this._AutoRequestDuanWeiInfo()
    console.log("=============ParseRefight============r:", data.r)
    if (data.r != 0)//发生了错误
    {
      this.IsWorking = false
      this.Fighting = false
      switch (data.r) {
        case 1:
          this.ShowBox("房间已解散")
          return
      }


      if (this._CurrPairWnd) this._CurrPairWnd.Back();
      return
    }


    this._PD(data)
  }

  Jump3V3() {
    if (this.JumpSeasonUI()) return//因为赛季结算等原因，已经跳转到了其他界面

    if (getApp().globalData.wnds.Wnd_Match.dwdata) {

      if (getCurrentPages().length > 1)//页面路由大于1，证明当前不在主页
        getApp().globalData.wnds.Wnd_Match.TemporaryJumpMode = 3//采用覆盖方式

      getApp().globalData.wnds.Wnd_Match.Show()
    } else {
      wx.showLoading({
        title: '跳转中...',
        mask: true
      })

      //请求获取段位信息
      GameConn.Request(
        { n: "pk3v3" },
        (data) => {
          wx.hideLoading();
          getApp().globalData.wnds.Wnd_Match.dwdata = data

          if (getCurrentPages().length > 1)//页面路由大于1，证明当前不在主页
            getApp().globalData.wnds.Wnd_Match.TemporaryJumpMode = 3//采用覆盖方式

          getApp().globalData.wnds.Wnd_Match.Show()
        }
      )
    }
  }

  //请求关闭赛季通知
  RequestCloseSNotify() {
    GameConn.Request(
      { n: "CloseSNotify" },
      (data) => {
        if (data.r != 0) return
      }
    )
  }


  //请求结算相关信息
  RequestSJPH(recall) {
    GameConn.Request(
      { n: "SJPH" },
      (data) => {
        if (data.r != 0) return
        this.SJPH = data
        recall();
      }
    )
  }

  JumpSeasonUI() {
    console.log("JumpSeasonUI Player.SeasonJLST", Player.SeasonJLST)
    switch (Player.SeasonJLST) {
      case 10://未领取 
      case 20://已领取奖励，未开始赛季
        //请求获取赛季结算需要的信息
        GameConn.Request(
          { n: "SeasonJS" },
          (data) => {
            this.NM_SeasonJS(data)
          }
        )
        return true
      case 30://结算中
        console.log("-------结算中--------")
        this.ShowBox(txt(2035), () => { })
        return true
      default:
        return false
    }
  }

  NM_SeasonJS(data) {
    this.SeasonJS = data//保存赛季结算相关的信息
    switch (Player.SeasonJLST) {
      case 10://未领取
        if (Player.SeasonNotify == 1)//需要显示赛季通知
        {
          if (getCurrentPages().length > 1)//页面路由大于1，证明当前不在主页
            getApp().globalData.wnds.Wnd_NoticeAccounts.TemporaryJumpMode = 3//采用覆盖方式

          //跳转到赛季结算通知界面
          getApp().globalData.wnds.Wnd_NoticeAccounts.Show()
        } else //直接显示结算界面
        {
          this.RequestSJPH(
            () => {
              if (getCurrentPages().length > 1)//页面路由大于1，证明当前不在主页
                getApp().globalData.wnds.Wnd_MatchJieSuan.TemporaryJumpMode = 3

              getApp().globalData.wnds.Wnd_MatchJieSuan.Show()
            }
          )
        }

        return true
      case 20://已领取，未开始赛季
        if (getCurrentPages().length > 1)//页面路由大于1，证明当前不在主页
          getApp().globalData.wnds.Wnd_StartMatch.TemporaryJumpMode = 3//采用覆盖方式

        //跳转到开始新赛季界面
        getApp().globalData.wnds.Wnd_StartMatch.Show()
        return true
    }
  }

  ParseDZ(data) {
    if (this.FightIsStop) {
      StopFight()
      
      if (this._CurrPairWnd) this._CurrPairWnd.Back();
      return
    }
    //loginLoading.hide()

    console.log("ParseDZ", data)

    this.Menpiao = data.mp

    //设置对战模式
    this.CurrMode = data.mode//当前战斗模式
    this._AutoRequestDuanWeiInfo()
    console.log("=============ParseDZ============r:", data.r)
    if (
      (data.r != 0 && data.r != 2)
    ) //0 成功 1门票不足 2战斗进行中 3重复操作 4房间已解散
    {
      this.IsWorking = false
      this.Fighting = false
      switch (data.r) {
        case 1:
          MsgBox.ShowCZJump()
          break
        case 4:
          this.ShowBox("房间已解散")
          break
        case 5://当前处于赛季结算中
          console.log("ParseDZ_re5", Player.SeasonJLST)
          this.JumpSeasonUI()//根据赛季状态决定行为

          break
        default:
          {

            if (this._CurrPairWnd) this._CurrPairWnd.Back();
          }
          break
      }
      return
    }

    //if (data.money && data.money>0)   this.SetBackTip(txt(1021).format(data.money))

    //临时断开和游戏服的链接
    //GameConn.TemporaryClose()

    //建立和世界服的联系
    this._PD(data)
  }

  ///切换到配对节点，仅在世界连接可用时能正常工作
  ConnPair() {
    console.log("重连到配对节点")
    //重新绑定世界链接路由
    WorldConn.BindSessionCode(100000000 + this._PairSID, this._WorldSessioncode)
  }

  _PD(data) {

    console.log("_PD#1")
    this._WorldUrl = data.url
    this._WorldSessioncode = data.scode
    this._PairSID = data.sid
    WorldConn.ReCreate(this._WorldUrl, 100000000 + this._PairSID, this._WorldSessioncode)


    


    //loginLoading.show("", true);

    console.log("_PD#2")
    this.Peiduiing = true
    //setTimeout(
    //    ()=>{
    //请求配对
    WorldConn.Request(
      { n: "pd" },
      (data) => {
        this.PDResult(data)
      }
    )
    //  },
    //2
    //)
  }

  LoginClear() {
    if (this.Peiduiing)//配对失败了
    {
      FightRoom.Fighting = true//设置正在战斗的标记，其它页面会负责发送退出战斗指令
    } else {
      FightRoom.Fighting = false//清当前正在战斗的标记
    }
  }


  PDResult(data) {
    console.log("PDResult#1")
    if (this.FightIsStop) {
      StopFight()
      console.log("PDResult#2")
      return
    }
    this.Peiduiing = false
    //loginLoading.hide()

    console.log("PDResult", data)
    if (data.r != 0) {
      this.Fighting = false
      this.IsWorking = false
      switch (data.r) {
        case 3:
          this.ShowBox("房间已解散")
          return
        case 5://当前处于赛季结算中
          this.ShowBox(txt(2035))
          break
      }

      if (this._CurrPairWnd) this._CurrPairWnd.Back();
      return
    }

    //已经进入对战了
    if (data.sid) {
      this._roomsid = data.sid + 100000000
      this._SendRoom()
    }
  }



  RoomResult(data) {
    console.log("=============RoomResult============r:", data.r, this.FightIsStop)

    if (this.FightIsStop) {
      StopFight()
      return
    }


    //console.log(data)
    if (data.r != 0) {
      this.IsWorking = false
      if (this._CurrPairWnd) this._CurrPairWnd.Back();
      return
    }


    this.APlys = this._ParsePlayers(data.aply)
    this.BPlys = this._ParsePlayers(data.bply)

    this.MaxLun = data.sumlun//总轮次
    this.MaxFen = data.sumfen//总分数
    this.Lun = data.lun//当前轮
    this.Mode = data.mode//模式
    this.SelfUID = data.uid//自己的uid
    this.IsA = data.isa == 1 //this.APlys[Player.Name()]!=null
    var LeftPlys = this.IsA ? this.APlys : this.BPlys
    var RightPlys = this.IsA ? this.BPlys : this.APlys


    this.LFen = 0// this.IsA ? data.afen : data.bfen//左边积分
    this.RFen = 0//this.IsA ? data.bfen : data.afen//右边积分


    var idx = 0
    this.LeftPlys = []

    //加入左边角色，自己永远在第一个
    for (var key in LeftPlys) {
      var ply = LeftPlys[key]
      if (ply.uid != this.SelfUID) continue
      ply.idx = idx++
      ply.isLeft = true
      this.LeftPlys.push(ply)
      break
    }


    for (var key in LeftPlys) {
      var ply = LeftPlys[key]
      if (ply.uid == this.SelfUID) continue
      ply.idx = idx++
      ply.isLeft = true
      this.LeftPlys.push(ply)
    }
    //加入左边角色，自己永远在第一个end

    var idx = 0
    this.RightPlys = []
    for (var key in RightPlys) {
      var ply = RightPlys[key]
      ply.isLeft = false
      ply.idx = idx++
      this.RightPlys.push(ply)
    }

    this._ClearWtcache()

    //增加角色进入房间的消息
    for (var i = 0; i < this.RightPlys.length; i++) {
      var ply = this.RightPlys[i]
      this._Talk(ply.uid, ply.name + "进入房间")
    }

    for (var i = 0; i < this.LeftPlys.length; i++) {
      var ply = this.LeftPlys[i]
      this._Talk(ply.uid, ply.name + "进入房间")
    }

    this._EmitReady()
  }

  _Talk(uid, txt) {
    this._Parsespk(
      { uid: uid, txt: txt }
    )
  }

  _EmitReady() {
    console.log("_EmitReady")
    //抛出准备事件
    this.Step = this.RoomStep.Ready
    this.EvtReady.Emit()
    this._Timer = setTimeout(() => this._EmitStart(), 1000)
  }

  _EmitStart() {
    console.log("_EmitStart")
    this.Step = this.RoomStep.Start
    this.EvtStart.Emit()
    this._Timer = setTimeout(() => this._EmitEnterRoom(), 1000)
  }

  Stop() {
    if (this._Timer) {
      clearTimeout(this._Timer)
      this._Timer = null
    }

    if(this.ConnGameTimer) {
      clearInterval(this.ConnGameTimer);
      this.ConnGameTimer = null;
    }

    this.IsWorking = false
    this.FightIsStop = true

    this._ResetParam()
  }

  _EmitEnterRoom() {
    console.log("_EmitEnterRoom")

    //if(this.CurrPairWnd!=null) this.CurrPairWnd.Hide()//隐藏匹配界面
    this.Step = this.RoomStep.EnterRoom


    //抛出进入房间事件
    this.EvtEnterRoom.Emit()
  }

  _ParsePlayers(plyDoc) {
    for (var uid in plyDoc) {
      var info = plyDoc[uid]
      info.iconurl = this.IconUrl(info.iconurl)
      info.k = this.HeadFrameUrl(info.k)
      info.uid = uid
    }

    return plyDoc
  }

  LeftPly(uid) {
    var leftList = this.IsA ? this.APlys : this.BPlys
    return leftList[uid]
  }

  RightPly(uid) {
    var rightList = this.IsA ? this.BPlys : this.APlys
    return rightList[uid]
  }

  IconUrl(url) {
    if (url.substr(0, 2) == "01")//npc头像
    {
      return Player.ArticleServerUrl() + "/public/uploads/ProblemImg/" + url.substr(2)
    }
    else
      return url
  }
}


instance = new FightRoom()

export { instance as FightRoom, StopFight }
