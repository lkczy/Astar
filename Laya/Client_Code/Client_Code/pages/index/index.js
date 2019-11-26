import {
  Player
} from "../../modules/Player"
import * as LCData from "../../modules/LocalData"
import {
  buttonDisabler
} from "../../dati_comm/modules/buttonDisabler";
import {
  FightRoom,
  StopFight
} from "../../dati_comm/modules/FightRoom"
import * as MsgBox from "../../dati_comm/modules/MsgBox"
import * as Authorize from "../../dati_comm/modules/Authorize"
import {
  ServerLogin
} from "../../modules/ServerLogin"
import {
  txt
} from "../../dati_comm/sdata/SDataID2"
//index.js
//获取应用实例
var app = getApp()
var that
let time
let timeing
let videoAd
const mpsdk = require('../../utils/mpsdk.js');
Page({
  data: {
    text: "开始",
    avatarUrl: "",
    nickname: "",
    showAd: false,
    banner_sts: false,
    cyxxk_tips: "领200金币",
    mx_tips: "领200金币",
    game_data_list: [],
    showModal: true,
    numbers: "1",
    isNew: true,
    openLevel: '0',
    platform: wx.getSystemInfoSync().platform,
    liveTime: 0,
    remainingTime: '',
    userid: mpsdk.Account.getAccount().openid,
    cnxhstate: false,
    lucyBagLv: 5,
    state: 0,
    cytzstate: 0,
    showShareButton: false,
    // gzhgiftstate: 0, //0未授权不显示 400 未关注 200 可领取 401 领取过 
    // daygiftstate: 0, //0未授权不显示 405 不是公众号进入游戏 400 未关注 200 可领取 401 领取过
    daygifttype: 0, //0不是从公众号进入 1是
    gzhstate: 1, //0 新用户显示关注奖励 1已关注显示每日奖励
    gzhlqday: 1,
    gzhshowstate:0
  },

  //开始猜成语
  start: function() {
    var temp = LCData.GetNumber(LCData.ParamName.PASS_LEVELS)
    console.log('载入关卡', temp)
    getApp().globalData.wnds.Wnd_Play.CurrLevel = temp
    getApp().globalData.wnds.Wnd_Play.Show()
    if (!wx.getStorageSync('pdduserId')) {
      mpsdk.Report.reportEvent(23)
    }

  },
  //保存用户头像等信息，如果成功获取了头像则关闭非强制授权提醒
  SaveUserInfo(res, alwaysCloseNotify = true) {
    //关闭非强制授权的授权提醒
    var closeAuthorizeNotify = () => {
      this.setData({
        authorize: false
      })
      LCData.Set(LCData.ParamName.AUTHORIZE, 1)
    }
    // getApp().globalData.wnds.Wnd_Home.Show()


    var userInfo = Authorize.GetUserInfo(res)
    if (userInfo != null) {
      LCData.Set(LCData.ParamName.NICK_NAME, userInfo.nickName)
      LCData.Set(LCData.ParamName.AVATOR_URL, userInfo.avatarUrl)
      LCData.Set(LCData.ParamName.AUTHORIZEOK, 1)
      this.setData({
        authorizeok: true
      })

      wx.setStorageSync('USER_INFO', res.detail.rawData)

      this.UpdateUserInfo()
      closeAuthorizeNotify()
    } else {
      if (alwaysCloseNotify) closeAuthorizeNotify()
    }
  },

  //开始猜成语，授权模式
  authorizeStart: function(res) {
    console.log(res)
    mpsdk.Report.reportEvent(26, res.detail.rawData ? 1 : 0)
    this.SaveUserInfo(res)
    this.start()
  },
  authorizeStartNumber: function(res) {
    this.SaveUserInfo(res)
    this.startNumber()
  },
  //成语接龙
  jielong: function() {
    wx.navigateToMiniProgram({
      appId: 'wx192d0eb286a81096'
    });
    // getApp().globalData.wnds.Wnd_Jiecy.Show()
  },
  //成语接龙，授权模式
  authorizeJielong: function(res) {
    this.SaveUserInfo(res)
    this.jielong()
  },
  // 对战联机
  authorizeDuizhan: function(res) {
    if (!buttonDisabler.canClick(2000)) return;
    if (Authorize.GetUserInfo(res) == null) {
      if (LCData.GetNumber(LCData.ParamName.AUTHORIZEOK) != 1)
        wx.showToast({
          title: txt(2052), //2052 需要授权才能进行联机对战哦
          icon: 'none',
          duration: 2000
        })
      else {
        console.log('mark111111')
        wx.showToast({
          title: "网络故障，请稍后再试..",
          icon: 'none',
          duration: 2000
        })
        //执行登录
        getApp().globalData.LoginOK = false
      }

      return
    }
    this.SaveUserInfo(res, false)
    this.duizhan()
  },
  duizhan: function() {
    // 对战功能已迁移至小游戏版中 是否前往？

    wx.showModal({
        title: '提示',
  content: '对战功能已迁移至小游戏版中 是否前往？',
  success (res) {
    if (res.confirm) {
      wx.navigateToMiniProgram({
        appId: 'wx234ee01d3f70d7d8',
      })

    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  }
    })

    // StopFight()
    // //跳转到匹配页面
    // FightRoom.ShowReadyWnd()
    // console.log('登录状态:', getApp().globalData)

    // FightRoom.ConnGame(
    //   (r) => {
    //     if (r) {
    //       FightRoom.StartPK(1)
    //     } else {
    //       console.log('mark000000')
    //       wx.showToast({
    //         title: "网络故障，请稍后再试..",
    //         icon: 'none',
    //         duration: 2000
    //       })
    //       //执行登录
    //       getApp().globalData.LoginOK = false

    //       // if( getCurrentPages().length > 1)
    //       // {
    //       //   wx.navigateBack({ delta: 1 }) 
    //       // }

    //     }
    //   }
    // )
  },
  //历史成就
  sel: function() {
    getApp().globalData.wnds.Wnd_Level.Show()
  },
  //往期题库
  numbers: function() {
    getApp().globalData.wnds.Wnd_Number.Show()
  },
  //事件处理函数
  help: function() {
    wx.navigateTo({
      url: '../sub_pages/help/help'
    })
  },
  more_cyxxk: function() {
    if (wx.getStorageSync("CYXXK_POINT") == "") {
      wx.setStorageSync("CYXXK_POINT", "ok")
      // var total_point_temp = Number(wx.getStorageSync(getApp().globalData.TOTAL_POINT))

      // total_point_temp = total_point_temp + 200

      // wx.setStorageSync(getApp().globalData.TOTAL_POINT, total_point_temp)

      LCData.Set(LCData.ParamName.TOTAL_POINT, LCData.GetNumber(LCData.ParamName.TOTAL_POINT) + 200)

      // wx.showToast({
      //   title: '获得200金币',
      //   icon: 'success',
      //   duration: 2000
      // })

      this.setData({
        cyxxk_tips: "换个玩法"
      })
    }

    if (wx.navigateToMiniProgram) {
      wx.navigateToMiniProgram({
        appId: 'wxd9048cf562fece3d',
        path: 'pages/index/index',
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
  },
  more_mx: function() {
    if (wx.getStorageSync("MX_POINT") == "") {
      wx.setStorageSync("MX_POINT", "ok")
      // var total_point_temp = Number(wx.getStorageSync(getApp().globalData.TOTAL_POINT))

      // total_point_temp = total_point_temp + 200

      // wx.setStorageSync(getApp().globalData.TOTAL_POINT, total_point_temp)

      LCData.Set(LCData.ParamName.TOTAL_POINT, LCData.GetNumber(LCData.ParamName.TOTAL_POINT) + 200)

      // wx.showToast({
      //   title: '获得200金币',
      //   icon: 'success',
      //   duration: 2000
      // })

      this.setData({
        mx_tips: "换个玩法"
      })
    }

    if (wx.navigateToMiniProgram) {
      wx.navigateToMiniProgram({
        appId: 'wx0766991ca46efbe7',
        path: 'pages/index/index',
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
  },
  AutoShowSignin() {
    //if(!getApp().globalData.LoginOK) return//没有登录成功，不执行签到，用本地数据签到可能会导致刷金币（签完到，删端，继续签到...）
    let today = new Date().toLocaleDateString();
    let regDay = wx.getStorageSync('regDay');
    let lastSign = LCData.GetNumber(LCData.ParamName.LAST_SIGNIN);
    //从没签过则认为是新用户，记录首次进入日期
    if (!lastSign && !regDay) {
      wx.setStorageSync('regDay', today);
      regDay = today;
    }
    //新用户当天不显示签到（老用户的regDay永远是空的）
    if (today == regDay) {
      return;
    }

    var curTotalDays = parseInt((new Date()).getTime() / 86400000);
    var lasTotalDays = parseInt(lastSign / 86400000)

    if (curTotalDays - lasTotalDays == 0) {
      //
    } else {
      getApp().globalData.wnds.Wnd_Signin.Show()
    }
  },
  UpdateUserInfo() {
    this.setData({
      nickname: Player.Name(),
      avatarUrl: Player.IconUrl()
    })
  },
  onLoad: function(options) {
    that = this

    console.log('onloadscene', wx.getLaunchOptionsSync())
      //1035
    if (wx.getLaunchOptionsSync().scene == 1035) {
        console.log('我从公众号菜单进入了')
        that.setData({
          daygifttype: 1
        })
      } else {
        console.log('我没从公众号菜单进入了')
      }

      if (wx.getStorageSync('gzhday') <= 0) {
        that.setData({
          gzhstate: 0
        })
      } else {
        that.setData({
          gzhstate: 1
        })
      }

      that.setData({
        gzhlqday: wx.getStorageSync('gzhlqday')
      })

      setTimeout(() => {
        that.setData({
          gzhshowstate: app.globalData.gzhstate
        })
      }, 1000)


   
    setTimeout(() => {
      that.setData({
        cnxhstate: app.globalData.cnxhstate,
        state: app.globalData.state,
        cytzstate: app.globalData.cytzstate
      })
    }, 1000)

    this.options = options;
    this.UpdateUserInfo()
    // this.setData({
    //   saveApp: wx.getSystemInfoSync().platform == 'ios' ? '添加到我的小程序' : '添加到桌面'
    // });
    //同步审核状态
    getApp().globalData.getOpenLevel.then(data => {
      this.setData({
        openLevel: data.level
      });
    });

    that = this
    //读取缓存
    wx.getStorage({
      key: 'GAME_DATA_LIST',
      success: function(res) {
        var length = res.data.length;
        for (var i = 0; i < length; i++) {
          if (wx.getStorageSync(res.data[i].title) == "") {
            res.data[i]['isClicked'] = false;
          } else {
            res.data[i]['isClicked'] = true;
          }
        }
        that.setData({
          game_data_list: res.data
        })
        console.log('GAME_DATA_LIST', that.data.game_data_list);
      }
    })
    //缓存推荐列表
    that.setGameDataList();

    this.setData({
      authorize: LCData.GetNumber(LCData.ParamName.AUTHORIZE) != 1,
      authorizeok: LCData.GetNumber(LCData.ParamName.AUTHORIZEOK) == 1
    })

    LCData.AutoUploadParams()

    try {
      var res = wx.getSystemInfoSync()

      console.log(res.model)
      var str = res.model;

      if (str.search("iPhone") != -1) {
        wx.setStorageSync("PHONE_MODEL", "1") // 1表示iPhone
      } else {
        wx.setStorageSync("PHONE_MODEL", "2") //  2表示Android
      }
    } catch (e) {
      // Do something when catch error
    }



    var temp = LCData.GetNumber(LCData.ParamName.PASS_LEVELS)
    if (temp > 20) {
      this.setData({
        showAd: true
      })
    }

    if (wx.getStorageSync("CYXXK_POINT") != "") {
      this.setData({
        cyxxk_tips: "换个玩法"
      })
    }
    if (wx.getStorageSync("MX_POINT") != "") {
      this.setData({
        mx_tips: "换个玩法"
      })
    }


    var lastTime = 0;
    if (wx.getStorageSync("lastTime") == "") {

    } else {
      lastTime = Number(wx.getStorageSync("lastTime"));
    }
    if (wx.getStorageSync("Click_Number") == "Y") {
      this.setData({
        isNew: false
      })
    }


    var host = 'https://xcx-cycck-tiku.raink.com.cn/weapp/demo2'
    var that = this

    wx.request({
      url: host,
      success: function(res) {
        console.log(res)

        if (wx.getStorageSync("SHOW_NUMBER") != res.data.data.number) {
          wx.setStorage({
            key: 'Click_Number',
            data: 'N',
          })
          that.setData({
            isNew: true
          })
        }
        // 测试
        // res.data.data.number = 36;
        // wx.setStorageSync('TotalPoint', 2000000);

        try {
          wx.setStorageSync("SHOW_NUMBER", res.data.data.number)
          wx.setStorageSync("SHOW_AD", res.data.data.ad)
          wx.setStorageSync("SHOW_APP_ID", res.data.data.appid)
          wx.setStorageSync("SHOW_PAGE", res.data.data.page)
          wx.setStorageSync("SHOW_MANY", res.data.data.many)
          wx.setStorageSync("SHOW_UP", res.data.data.up)
          wx.setStorageSync("SHOW_GENDER", res.data.data.gender)
          wx.setStorageSync("SHOW_REPEAT", res.data.data.repeat)
          wx.setStorageSync("SHOW_MODEL", res.data.data.model)
        } catch (e) {

          wx.setStorage({
            key: "SHOW_NUMBER",
            data: res.data.data.number,
          })
          wx.setStorage({
            key: "SHOW_AD",
            data: res.data.data.ad,
          })
          wx.setStorage({
            key: "SHOW_APP_ID",
            data: res.data.data.appid,
          })
          wx.setStorage({
            key: "SHOW_PAGE",
            data: res.data.data.page,
          })
          wx.setStorage({
            key: "SHOW_MANY",
            data: res.data.data.many,
          })
          wx.setStorage({
            key: "SHOW_UP",
            data: res.data.data.up,
          })
          wx.setStorage({
            key: "SHOW_GENDER",
            data: res.data.data.gender,
          })
          wx.setStorage({
            key: "SHOW_REPEAT",
            data: res.data.data.repeat,
          })
          wx.setStorage({
            key: "SHOW_MODEL",
            data: res.data.data.model,
          })
        }
        that.setData({
          numbers: res.data.data.number
        })
        console.log("gender:2::" + res.data.data.gender)

        if (wx.getStorageSync("LOCAL_GENDER") != res.data.data.gender) {
          var repeat = Number(res.data.data.repeat)
          var lastTime = Number(wx.getStorageSync("JUMP_LAST_TIME"))

          console.log("click:::::111::::" + wx.getStorageSync("CLICK_USER" + res.data.data.appid))

          if (res.data.data.ad == "2" && (wx.getStorageSync("CLICK_USER" + res.data.data.appid) == "" || (new Date()).getTime() > lastTime + repeat * 86400000)) {
            if (wx.getStorageSync("PHONE_MODEL") == res.data.data.model || res.data.data.model == "0") {

            } else {
              return;
            }

            var many = Number(res.data.data.many)

            if (((new Date()).getTime() % 10) < many) {
              that.setData({
                banner_sts: true
              })
            }
          }
        }
      },
      fail: function() {

      }
    })
    // mpsdk.init(1, 'cck', getApp().globalData.launchOptions).then(openid => {
    //   console.log('获得openid', openid);
    //   //上报活跃日志，方法详细说明请查询API文档
    //   // mpsdk.Report.reportLogin(1, 1000, 0);
    //   let gold = LCData.GetNumber(LCData.ParamName.TOTAL_POINT);
    //   let level_kt = LCData.GetNumber(LCData.ParamName.PASS_LEVELS);
    //   let level_jl = LCData.GetNumber(LCData.ParamName.PASS_LEVELS_JIELONG);
    //   mpsdk.Report.reportLogin(gold, level_kt, level_jl);
    // });

    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            url: 'https://xcx-cycck-tiku.raink.com.cn/weapp/openid',
            data: {
              code: res.code
            },
            success: function(res) {
              //SDK初始化
              mpsdk.initWithAccount(1, 'cck', {
                openid: res.data.data
              }, getApp().globalData.launchOptions);
              //上报活跃日志
              let gold = LCData.GetNumber(LCData.ParamName.TOTAL_POINT);
              let level_kt = LCData.GetNumber(LCData.ParamName.PASS_LEVELS);
              let level_jl = LCData.GetNumber(LCData.ParamName.PASS_LEVELS_JIELONG);
              mpsdk.Report.reportLogin(gold, level_kt, level_jl);
            },
            fail: function() {

            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })


    console.log('应该采用这种：', getApp().globalData.ShareOrVideo)

    // this.flushgzhgift()

  },
  flushgzhgift: function() {
    setTimeout(() => {
      that.setData({
        gzhgiftstate: app.globalData.gzhgift,
        daygiftstate: app.globalData.daygift,
        daygifttype: app.globalData.daygifttype
      })
    }, 1000)
  },

  onShow: function(e) {

    this.hongBao = this.selectComponent('#hongBao');
    this.suggestion = this.selectComponent('#suggestion')
    console.log("suggestion", this.suggestion)
    console.log('firstgivegold', wx.getStorageSync('firstgivegold'))
    console.log('gout', wx.getStorageSync('gout'))

    try {
      //判断时间
      if (wx.getStorageSync('gout') && wx.getStorageSync('firstgivegold').indexOf(wx.getStorageSync('appItem').aid) < 0) {
        console.log('跳出时间为', wx.getStorageSync('Jumptime'))
        console.log('当前时间为', new Date().getTime())
        if (((new Date().getTime()) - wx.getStorageSync('Jumptime')) < 10000) {
          wx.showToast({
            title: '请体验十秒后才能领取奖励!',
            icon: 'none'
          })
        } else {

          console.log('走的老版本')
          let coins = Number(wx.getStorageSync('TotalPoint'))
          coins += wx.getStorageSync('appItem').coins
          mpsdk.Report.reportGold(wx.getStorageSync('appItem').coins, coins, wx.getStorageSync('appItem').aid, 6);
          wx.setStorage({
            key: 'TotalPoint',
            data: coins
          })
          this.setData({
            total_point: coins
          });
          // wx.showToast({
          //   title: '获得' + wx.getStorageSync('appItem').coins + '金币',
          //   icon: 'success',
          //   duration: 2000
          // });
          console.log('跳转app：', wx.getStorageSync('appItem'))

          let firstgivegold = wx.getStorageSync('firstgivegold')
          firstgivegold.push(wx.getStorageSync('appItem').aid)
          wx.setStorageSync('firstgivegold', firstgivegold)
          console.log("suggestion")
          this.suggestion.loadData()
        }

      } else {
        console.log('跳转app不是第一次点击或者不是从跳转处返回')
      }
    } catch (e) {

      //初始化参数
      wx.setStorageSync('gout', false)
      wx.setStorageSync('Jumptime', 0)
      wx.setStorageSync('JumpAppisFirst', false)
      wx.setStorageSync('appItem', {})
    }

    wx.setStorageSync('gout', false)
    wx.setStorageSync('Jumptime', 0)
    wx.setStorageSync('JumpAppisFirst', false)
    wx.setStorageSync('appItem', {})


    this.setData({
      level: LCData.GetNumber(LCData.ParamName.PASS_LEVELS)
    })

    this.setData({
      liveTime: wx.getStorageSync('lucyBagTime'),
      lucyBagLv: wx.getStorageSync('lucyBagLv')
    })


    var curTotalDays = parseInt((new Date()).getTime() / 86400000);
    var lasTotalDays = parseInt(LCData.GetNumber(LCData.ParamName.LAST_SIGNIN) / 86400000)
    // console.log("当前时间", (new Date()).getTime())
    // console.log("签到时间",LCData.GetNumber(LCData.ParamName.LAST_SIGNIN))
    // console.log("签到时间:" + lasTotalDays + "   当前时间:" + curTotalDays)

    //断开和pk服务器的链接，解决从准备战斗界面返回时世界服链接仍然处于链接状态问题
    StopFight()

    this.AutoShowSignin()

    console.log('shareOthers', this.shareOthers.serial, this.shareOthers.res)

    if (app.onShareJudge(this.shareOthers)) {

      console.log(12313123123456)
      this.shareManage(this.shareOthers.serial, this.shareOthers.res);
    }
    this.shareOthers = {};

    if (!wx.getStorageSync('pdduserId')) {
      //加载完毕打点
      mpsdk.Report.reportEvent(22, (new Date().getTime() - app.globalData.startload) / 1000)
    }

    //初始化公众号入口参数
    // console.log('onshowoption',wx.getLaunchOptionsSync())

    // wx.onAppShow((e)=>{
    //   setTimeout(()=>{
    //     console.log('onAppShow', e)
    //     //1035
    //     if (e.scene == 1035) {
    //       console.log('我从公众号菜单进入了')
    //       that.setData({
    //         daygifttype: 1
    //       })
    //     } else {
    //       console.log('我没从公众号菜单进入了')
    //     }

    //     if (wx.getStorageSync('gzhday') <= 0) {
    //       that.setData({
    //         gzhstate: 0
    //       })
    //     } else {
    //       that.setData({
    //         gzhstate: 1
    //       })
    //     }

    //     that.setData({
    //       gzhlqday: wx.getStorageSync('gzhlqday')
    //     })

    //   },1000)



    // })


    setTimeout(() => {
      that.setData({
        gzhshowstate: app.globalData.gzhstate
      })
    }, 1000)
 

    
  },
  onReady: function(res) {
    that = this

    time = app.globalData.dailylucybag[wx.getStorageSync('lucyBagLv')] * 60 - wx.getStorageSync('lucyBagTime')
    time = time <= 0 ? 0 : time

    let date = new Date(time * 1000)
    let minute = '0' + date.getMinutes()
    let sec = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
    that.setData({

      remainingTime: '00:' + minute + ':' + sec
    })



    timeing = setInterval(() => {
      if (wx.getStorageSync('lucyBagLv') <= 3) {
        // time = app.globalData.dailylucybag[wx.getStorageSync('lucyBagLv')] * 60 - (that.data.liveTime + 1)
        time = app.globalData.dailylucybag[wx.getStorageSync('lucyBagLv')] * 60 - (wx.getStorageSync('lucyBagTime') + 1)
        time = time <= 0 ? 0 : time

        let date = new Date(time * 1000)
        let minute = '0' + date.getMinutes()
        let sec = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
        that.setData({
          liveTime: wx.getStorageSync('lucyBagTime') + 1,
          remainingTime: '00:' + minute + ':' + sec
        })
        if (time >= 0) {
          wx.setStorageSync('lucyBagTime', wx.getStorageSync('lucyBagTime') + 1)
        }
      }
    }, 1000)
  },
  onHide: function() {
    this.shareOthers.share1 = true;
  },
  shareOthers: {},

  onShareAppMessage: function(res) {

    let serial;
    if (res.target && res.target.id == 'hongbao') {
      serial = 15;
    } else if (res.from == 'button' && res.target && res.target && res.target.id == 'newUserGift') {
      serial = 2
    } else if (res.from == 'button' && res.target && res.target && res.target.id == 'dayUserGift') {
      serial = 3;
    } else {
      serial = 4;
    }

    console.log(serial)


    if (wx.getSystemInfoSync().version > '6.7.2') {
      console.log('高版本');
      this.shareOthers.share = true;
      this.shareOthers.time = +new Date();
      this.shareOthers.res = res;
      this.shareOthers.serial = serial;
      let shareInfo = {
        serial: serial,
        scoreValue: getApp().getScore()
      };
      this.shareOthers.shareInfo = shareInfo;

      console.log('查看本地', wx.getStorageSync('mpsdk_shareInfoList'));
      console.log('进入了新的分享');
      return mpsdk.Share.commonShare(shareInfo, null, null, this);
      // }


      // return {
      //   title: shareInfo.text || ('我已经闯过' + this.data.cur_level + "关，谁与我战？"),
      //   path: mpsdk.Share.getShareLink(serial, '/pages/index/index', '', shareInfo.id || ''),
      //   imageUrl: shareInfo.image
      // }
    } else {


      //新手礼包
      if (res.from == 'button' && res.target && res.target.id == 'newUserGift') {
        let shareInfo = {
          serial: 2,
          scoreValue: getApp().getScore()
        };

        let success = function(res) {
          if (this.data.openLevel == '2' && !res.shareTickets) { //强制分享到群
            wx.showToast({
              title: '分享到群可获得5倍奖励',
              icon: 'none'
            });
            return;
          }
          this.setData({
            newUserGiftShare: res.shareTickets ? true : false, //如果分享到群里了则可以领取多倍
          });
          this.newUserGiftReward();
        }
        return mpsdk.Share.commonShare(shareInfo, success, null, this);
      }
      //日常礼包
      else if (res.from == 'button' && res.target && res.target.id == 'dayUserGift') {
        let shareInfo = {
          serial: 3,
          scoreValue: getApp().getScore()
        };
        let success = function(res) {
          if (this.data.openLevel == '2' && !res.shareTickets) { //强制分享到群
            wx.showToast({
              title: '分享到群可获得5倍奖励',
              icon: 'none'
            });
            return;
          }
          this.setData({
            dayUserGiftShare: res.shareTickets ? true : false
          });
          this.dayUserGiftReward();
        }
        return mpsdk.Share.commonShare(shareInfo, success, null, this);
      } else if (res.from == 'button' && res.target && res.target.id == 'hongbao') {
        console.log('不给奖励分享');
        let shareInfo = {
          serial: 15,
          scoreValue: getApp().getScore()
        };
        let that = this;
        return mpsdk.Share.commonShare(shareInfo, () => {
          console.log('12313123323')
          that.hongBao.openReward(true);
        });
      }
      //分享不给奖励
      else {
        console.log('不给奖励分享');
        let shareInfo = {
          serial: 4,
          scoreValue: getApp().getScore()
        };
        return mpsdk.Share.commonShare(shareInfo);
      }
      //普通分享
      // else {
      //   console.log('普通分享');
      //   return share.getCGShareContent(this, this.data.cur_level, this.shareOthers);
      //   // share.getCGShareContent(this, this.data.cur_level, this.shareOthers)
      // }
    }
  },
  shareManage(serial, res) {
    console.log('diaoyongle shareManage')
    // console.log('触发了新的机制', res);
    // if (res.from == 'button' && res.target && res.target.id && res.target.id == 'hongbao') {
    //   let shareInfo = {
    //     serial: 15,
    //     scoreValue: getApp().getScore()
    //   };
    //   console.log('进入了红包分享');
    //   let success = null;
    //   this.hongBao.openReward(true);

    // }

    // //分享不给奖励
    // else{
    //   console.log('普通分享');
    //   return share.getCGShareContent(this, this.data.cur_level, this.shareOthers);
    //   // share.getCGShareContent(this, this.data.cur_level, this.shareOthers)
    // }

    if (serial == 15) {
      console.log('这里是红包分享');
      this.hongBao.openReward(true);
    }

  },

  complaint: function() {
    wx.navigateTo({
      url: '../complaint/complaint',
    })
  },
  setTimeId: null,
  suggestReward: function(e) {

    console.log(e)
    if (e.detail.isFirst) { //判断是否第一次点击
      let that = this;
      clearTimeout(this.setTimeId);
      if (wx.getSystemInfoSync().version > '6.7.2') {
        this.setTimeId = setTimeout(function() {
          let coins = Number(wx.getStorageSync(LCData.ParamName.TOTAL_POINT));
          coins += e.detail.appInfo.coins; //发放指定数量的金币奖励
          wx.setStorage({
            key: LCData.ParamName.TOTAL_POINT,
            data: coins
          });
          // wx.showToast({
          //   title: '获得' + e.detail.appInfo.coins + '金币',
          //   icon: 'success',
          //   duration: 2000
          // });
        }, 10000);
      } else {
        let coins = Number(wx.getStorageSync(LCData.ParamName.TOTAL_POINT));
        coins += e.detail.appInfo.coins; //发放指定数量的金币奖励
        wx.setStorage({
          key: LCData.ParamName.TOTAL_POINT,
          data: coins
        });
        // wx.showToast({
        //   title: '获得' + e.detail.appInfo.coins + '金币',
        //   icon: 'success',
        //   duration: 2000
        // });
      }
    }
  },

  //跳转到其他游戏
  toOther: function(e) {
    var that = this
    var idx = parseInt(e.currentTarget.id);
    var title = that.data.game_data_list[idx].title;
    var point = that.data.game_data_list[idx].coins;

    console.log("=======1")

    //首次点击加金币
    if (wx.getStorageSync(title) == "") {
      //记录点击
      wx.setStorageSync(title, "ok");
      // that.data.game_data_list[idx].isClicked = true;
      // that.setData({ game_data_list: that.data.game_data_list });

      console.log("=======2")
      //加金币
      // var total_point_temp = Number(wx.getStorageSync(getApp().globalData.TOTAL_POINT));
      // total_point_temp = total_point_temp + point;
      // wx.setStorageSync(getApp().globalData.TOTAL_POINT, total_point_temp);
      var total_point_temp = LCData.GetNumber(LCData.ParamName.TOTAL_POINT) + point

      LCData.Set(LCData.ParamName.TOTAL_POINT, LCData.GetNumber(LCData.ParamName.TOTAL_POINT) + point)

      //提示
      // wx.showToast({
      //   title: '获得' + point + '金币',
      //   icon: 'success',
      //   duration: 2000
      // })
    }
  },
  //设置推荐列表
  setGameDataList: function() {
    var that = this
    wx.request({
      url: 'https://cdn-xyx.raink.com.cn/ad/cck/version.json',
      success: function(res) {
        console.log('game_data_version', res.data);
        if (wx.getStorageSync("VERSION_CODE").ver != res.data.ver) {
          wx.setStorageSync("VERSION_CODE", res.data);
          wx.request({
            url: 'https://cdn-xyx.raink.com.cn/ad/cck/' + res.data.ver,
            success: function(res) {
              var length = res.data.length;
              for (var i = 0; i < length; i++) {
                if (wx.getStorageSync(res.data[i].title) == "") {
                  res.data[i]['isClicked'] = false;
                } else {
                  res.data[i]['isClicked'] = true;
                }
              }
              that.setData({
                game_data_list: res.data,
              })
              console.log('game_data_list', res.data);
              wx.setStorage({
                key: 'GAME_DATA_LIST',
                data: res.data,
              })
            }
          })
        }
      }
    })
  },
  startNumber: function() {
    wx.setStorage({
      key: "Click_Number",
      data: "Y"
    })
    this.setData({
      isNew: false
    })

    wx.setStorageSync("NUMBER_LEVEL", "")

    //跳转到游戏页面
    wx.navigateTo({
      url: '../numberPlay/numberPlay?id=' + wx.getStorageSync("SHOW_NUMBER") + "&types=index"
    })

  },
  toBox: function() {
    wx.navigateToMiniProgram({
      appId: "wx5d807e82b055f420",
      path: "/pages/index/index",
    })
  },

  submitNotice: function(e) {
    mpsdk.Platform.instance.subscribe(1, e.detail.formId);
  },

  jump: function() {
    wx.setStorageSync("JUMP_LAST_TIME", (new Date()).getTime())

    wx.reportAnalytics("click_ad" + wx.getStorageSync("SHOW_APP_ID"), {
      count: 1
    })

    var page = ''
    if (wx.getStorageSync("SHOW_PAGE") == "") {

    } else {
      page = wx.getStorageSync("SHOW_PAGE")
    }

    if (wx.navigateToMiniProgram) {
      this.setData({
        banner_sts: false
      })
      wx.navigateToMiniProgram({
        appId: wx.getStorageSync("SHOW_APP_ID"),
        path: page,
        success(res) {
          // 打开成功
          if (wx.getStorageSync("CLICK_USER" + wx.getStorageSync("SHOW_APP_ID")) == "") {
            wx.setStorage({
              key: 'CLICK_USER' + wx.getStorageSync("SHOW_APP_ID"),
              data: "0",
            })
            wx.reportAnalytics("click_success" + wx.getStorageSync("SHOW_APP_ID"), {
              success_count: 1
            })

            //提交
            var up = Number(wx.getStorageSync("SHOW_UP"))
            if (((new Date()).getTime()) % up == 0) {
              wx.reportAnalytics("click_ad" + wx.getStorageSync("SHOW_APP_ID"), {
                count: 1
              })
            }

          }
        }
      })
    } else {
      wx.showToast({
        title: '微信版本过低',
        duration: 2000
      })
    }
  }, //end jump
  openhongbao: function() {
    if (this.data.remainingTime == '00:00:00') {
      this.hongBao.loadData(false)
      mpsdk.Report.reportEvent(201)
      let lucyBagLvTemp = wx.getStorageSync('lucyBagLv')
      wx.setStorageSync('lucyBagLv', lucyBagLvTemp + 1)
      this.setData({
        lucyBagLv: lucyBagLvTemp + 1,
        liveTime: 0
      })
      wx.setStorageSync('lucyBagTime', 0)
    }
  },
  tofuli: function() {
    wx.navigateTo({
      url: '/pages/welfare/welfare',
    })
  },
  tocytz: function() {

    mpsdk.Ad.loadFilterData()
      .then(function(_a) {
        var filterData = _a;
        console.log('filterData', filterData)
        let gamelist = mpsdk.Ad.dataFixPip(wx.getStorageSync('mpsdk_suggestList'), filterData.gender, filterData.userValue)
        let cytz = gamelist.filter(item => item.appid == 'wx776f8e75a5858a0a')
        console.log('cytz', cytz)
        if (cytz.length == 0) {
          console.log('未找到成语中状元appitem 请检查配置')
          return
        }
        mpsdk.Ad.click(cytz[0], 1)
      }).catch(() => {
        let gamelist = mpsdk.Ad.dataFixPip(wx.getStorageSync('mpsdk_suggestList'), '', '')
        let cytz = gamelist.filter(item => item.appid == 'wx776f8e75a5858a0a')
        console.log('cytz', cytz)
        if (cytz.length == 0) {
          console.log('未找到成语中状元appitem 请检查配置')
          return
        }
        mpsdk.Ad.click(cytz[0], 1)
      })

  }
})