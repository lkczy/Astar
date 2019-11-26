    // "wxaa97c78338cb12e1"
var aldstat = require("./utils/ald-stat.js");
const mpsdk = require("./utils/mpsdk.js");
let that
import {
  Ticker
} from "./dati_comm/libs/core/Ticker";
import TWEEN from "./dati_comm/libs/core/Tween";
import {
  FightRoom,
  StopFight
} from './dati_comm/modules/FightRoom'
import PageWrap from './dati_comm/modules/PageWrap'
import {
  UIEvent
} from "./dati_comm/libs/network/UIEvent.js"
import {
  BindAppUpdateEvt
} from "./dati_comm/modules/AppUpgrade"
import * as LCData from "./modules/LocalData"
import "./utils/StringEX"
import * as gcfg from "./gamecfg.js"
import {
  ToastPannel
} from './component/CusToast/CusToast'
import {
  ServerLogin
} from "./modules/ServerLogin.js"
const md5 = require('./utils/md5.js').md5;
const ver = '7.90'
Ticker.start(30);
Ticker.register(null, _mainLoop);

function _mainLoop(deltaTime) {
  TWEEN.update(); // 注意 TWEEN.update 接受总时间，因此不能直接注册到 Ticker（deltaTime）
}
//require('./dati_comm/libs/network/checkLogin');
let _util = require('./utils/util.js');
let isInit = false
let updatenum = 0
//引入工具包
let animParams = {
  wnd: {
    duration: 0.3, //tween 时长
    outerPosX: 1000, //窗口在屏幕外的位置
    alphaEaseType: TWEEN.Easing.Linear.None,
    posXEaseType: TWEEN.Easing.Linear.None,
    upperOutPosX: 750, // 上层页面滑出屏幕的位置
    lowerOutPosX: -200, // 下层页面被挤出的位置
    slideSeqDuration: 0.5,
  }
};
App({
  ToastPannel,
  onLaunch: function(options) {
    console.log(options)
    // if (options.query.wxsource == 'wx' && options.query.wxposition == 'menu') {
    //   console.log('我从公众号进入了')
    //   this.globalData.daygifttype = 1
    // } else {
    //   console.log('我没从公众号进入了')
    // }

    //默认有视频广告
    wx.setStorageSync('havevideo', true)

    if (!wx.getStorageSync('pdduserId')) {
      wx.setStorageSync('isnewuser', true)
      setTimeout(() => {
        mpsdk.Report.reportEvent(21)
      }, 500)
    }
    that = this

    wx.setStorageSync('startload', new Date().getTime())
    this.globalData.startload = new Date().getTime()
    wx.request({
      url: 'https://xcx-cycck-tiku.raink.com.cn/weapp/demo2',
      success: (res) => {
        //测试
        // res.data.data.number = 36
        let xthStr = wx.getStorageSync(LCData.ParamName.NUMBER_XTH)
        let xthStr_isok = wx.getStorageSync(LCData.ParamName.NUMBER_IS_OK)
        let xth = xthStr.split(",");
        if (xth.length < parseInt(res.data.data.number)) {
          //更新期数长度
          let temp_xth = ''
          let tempa_xthStr_isok = ''
          for (let i = 0; i < parseInt(res.data.data.number) - xth.length; i++) {
            temp_xth += ',1'
            tempa_xthStr_isok += ',0'
          }
          xthStr += temp_xth
          xthStr_isok += tempa_xthStr_isok
          wx.setStorageSync(LCData.ParamName.NUMBER_XTH, xthStr)
          wx.setStorageSync(LCData.ParamName.NUMBER_IS_OK, xthStr_isok)
        }
      }
    })
    this.updateData();
    mpsdk.Account.getAccountSafe().then(account => {
      console.log('查看openid:', account);
      if (account.openid) {
        wx.setStorageSync('pdduserId', account.openid);
      }
      // if (account.unionid) {

      //   wx.setStorageSync('unionid', account.unionid);
      //   wx.request({
      //     url: 'https://mainland-xyxzsdl-wx.raink.com.cn/v2/index/award',
      //     data: {
      //       unionid: account.unionid
      //     },
      //     success: (res) => {

      //       if (res.data.errcode == 415) {
      //         that.globalData.gzhgift = 0
      //       } else {
      //         that.globalData.gzhgift = res.data.errcode
      //       }
      //       console.log('gzhgift', that.globalData.gzhgift)
      //     },
      //     fail: () => {
      //       that.globalData.gzhgift = 0
      //     }
      //   })


      //   wx.request({
      //     url: 'https://mainland-xyxzsdl-wx.raink.com.cn/v2/everyday/award',
      //     data: {
      //       unionid: account.unionid,
      //       gameid: 1
      //     },
      //     success: (res) => {
      //       that.globalData.daygift = res.data.errcode
      //       console.log('daygift', that.globalData.gzhgift)
      //     },
      //     fail: () => {
      //       console.log('初始化每日礼包错误')
      //       that.globalData.gzhgift = 0
      //     }
      //   })


      // } else {
      //   console.log('用户未授权 无法获取uniid')
      // }


      // that.setData({
      //   userid: account.openid
      // });
    })


    this.globalData.launchOptions = options; //启动参数存到全局变量方便使用
    this.globalData.ServerLogin = ServerLogin;
    this.globalData.getOpenLevel = mpsdk.getOpenLevel(ver, 1);
    if (wx.getStorageSync(this.globalData.CURRENT_LEVELS) == "") {
      wx.setStorageSync(this.globalData.CURRENT_LEVELS, 1);
    }
    if (wx.getStorageSync('lucyBagLv') === "") {
      wx.setStorageSync('lucyBagLv', 0)
    }

    if (wx.getStorageSync('gzhday') === "") {
      wx.setStorageSync('gzhday', 0)
    }
    if (wx.getStorageSync('gzhlqday') === "") {
      wx.setStorageSync('gzhlqday', 0)
    }
    if (wx.getStorageSync('lucyBagTime') === "") {
      wx.setStorageSync('lucyBagTime', 0)
    }
    //猜你喜欢奖励状态
    wx.setStorageSync('gout', false)
    if (wx.getStorageSync('firstgivegold') === "") {
      wx.setStorageSync('firstgivegold', []);
    }
    BindAppUpdateEvt()
    LCData.AutoInitParams()
    console.log(options);
    this.globalData.isFromShare = options.query.share === 'true';
    //零点刷新
    wx.request({
      url: 'https://xyxcck-auth.raink.com.cn/MiniGame/data/getTime.action',
      success: (res) => {
        // let now = res.data.time
        let now = +new Date()
        if (wx.getStorageSync("Lastpass") && parseInt((now + 28800000) / 86400000) - parseInt(Number(wx.getStorageSync("Lastpass"))) >= 1) {
          wx.setStorageSync('lucyBagLv', 0)
          wx.setStorageSync('lucyBagTime', 0)
          wx.setStorageSync('isnewuser', false)
          wx.setStorageSync('gzhlqday', 0)
        }
        wx.setStorageSync("Lastpass", parseInt((now + 28800000) / 86400000));
        wx.setStorageSync("today", parseInt((now + 28800000) / 86400000));
      }
    })
    mpsdk.init(1, 'cck', options).then(myOpenid => {


      //添加好友
      if (options.query.userid) {
        wx.request({
          url: 'https://xyxcck-friend.raink.com.cn/MiniFriend/data/addFriend.action',
          data: {
            gameId: 1,
            openId1: myOpenid,
            openId2: options.query.userid
          },
          success: function(res) {
            // 转发成功
            console.log('添加好友成功')
          },
          fail: function(res) {
            // 转发失败
            console.log('添加好友失败')
          }
        })
      }
      //记录登陆时间
      wx.request({
        url: 'https://xyxcck-friend.raink.com.cn/MiniFriend/data/setData.action',
        data: {
          gameId: 1,
          openId: myOpenid,
          show: wx.getStorageSync("USER_INFO"),
          dataKey: 'loginTime',
          dataValue: new Date().getTime()
        },
        success: function(res) {
          console.log(wx.getStorageSync("USER_INFO"))
          // 转发成功
          console.log('setdata成功')
        },
        fail: function(res) {
          // 转发失败
          console.log('setdata失败')
        }
      })
      //初始化数据
      // dataManager.initData();
    });

    // 初始化强烈变用户 并且判断版本库是否支持激励视频
    let systeminfo = wx.getSystemInfoSync()
    wx.setStorageSync('isStrong', mpsdk.Hack.isStrongFission())
    wx.setStorageSync('isNewSdk', systeminfo.SDKVersion >= '2.6.0')
    this.getShareOrVideo()

  },
  getStorageData(data) {
    let storageTitleData = wx.getStorageSync('leveldata');
    data.LEVEL_NAMES = storageTitleData['LEVEL_NAMES'] || data['LEVEL_NAMES'];
    data.ALL_IDIOMS = storageTitleData['ALL_IDIOMS'] || data['ALL_IDIOMS'];
    data.EXPLAIN = storageTitleData['EXPLAIN'] || data['EXPLAIN'];
    data.PIC = storageTitleData['PIC'] || data['PIC'];
    data.JIELONG_INIT = storageTitleData['JIELONG_INIT'] || data['JIELONG_INIT'];
    data.JIELONG_FINISH = storageTitleData['JIELONG_FINISH'] || data['JIELONG_FINISH'];
    data.JIELONG_ANS = storageTitleData['JIELONG_ANS'] || data['JIELONG_ANS'];
    let forData = storageTitleData || data;
    let npers = {};
    for (let key in forData) {
      if (key.indexOf('NUMBER_') != -1) {
        npers[key] = forData[key];
      }
    }
    data.npers = npers;
  },
  updateData() {
    let that = this;
    console.log('更新数据');
    // 'http://bailu.cross.echosite.cn/getUpdate?game=cck',
    // 'https://xyxcck-auth.raink.com.cn/MiniGame/data/getAppVersion.action?gameId=1',
    wx.request({
      url: 'https://xyxcck-auth.raink.com.cn/MiniGame/data/getAppVersion.action?gameId=1',
      success(res) {
        console.log(res);
        if (res.data.app && res.data.app.gameOpen) {
          console.log(res.data.app.gameOpen);
          let gameOpen = JSON.parse(res.data.app.gameOpen);
          let storageMd5 = wx.getStorageSync('md5') || '';
          that.globalData.sharetime = gameOpen.sharetime * 1000 || 2500;
          that.globalData.secondsharechance1 = gameOpen.secondsharechance1 || 50;
          that.globalData.secondsharechance2 = gameOpen.secondsharechance2 || 70;
          that.globalData.bannerrefresh = gameOpen.bannerrefresh || 0;
          that.globalData.hongbaofresh = gameOpen.hongbaofresh || 3;
          that.globalData.hongbaonum = gameOpen.hongbaonum || 3;
          that.globalData.hongbaoShare = gameOpen.hongbaoShare || 0;
          that.globalData.changeadtime = gameOpen.changeadtime || 1;
          that.globalData.changeadgl = gameOpen.changeadgl || 30;
          that.globalData.cytzstate = Number(gameOpen.cytzstate) || 0;
          that.globalData.Sharepoint_Help = gameOpen.Sharepoint_Help || '3:20,2:40,1:40';
          that.globalData.InterstitialAdNum = gameOpen.InterstitialAdNum || 5;
          that.globalData.firstvideostate = gameOpen.firstvideostate || 1;
          that.globalData.gzhstate = Number(gameOpen.gzhstate) || 0;
          // that.globalData.gzhstate = 1

          //如果之前没有做过随机
          if (wx.getStorageSync('shareplan') === "") {
            console.log('开始初始化分享策略')
            //初始化分享视频转化策略
            let planarray = gameOpen.Sharepoint_Help.split(',')
            //取0-100随机数
            let randomnum = Math.ceil(Math.random() * 100)
            let probabilitynum = 0
            let res = 'nu'
            for (var i = 0; i < planarray.length; i++) {
              let plan = planarray[i];
              let item = plan.split(':')
              probabilitynum += parseInt(item[1])
              //如果随机概率小钰概率和 则取当前
              if (randomnum <= probabilitynum) {
                wx.setStorageSync('shareplan', parseInt(item[0]))
                console.log('已初始化分享策略', parseInt(item[0]))
                res = parseInt(item[0])
                break;
              }
            }
            if (res == 'nu') {
              console.log('未找到刷新分享策略 失败 取第一种', parseInt(planarray[0].split(':')[0]))
              wx.setStorageSync('shareplan', parseInt(planarray[0].split(':')[0]))
            }

          }
          if (ver != gameOpen.codeVer || gameOpen.cnxhstate != 0) {
            that.globalData.cnxhstate = true
          } else {
            that.globalData.cnxhstate = false
          }
          console.log('cnxhstate', that.globalData.cnxhstate)
          if (ver == gameOpen.codeVer && gameOpen.status == 0) {
            that.globalData.state = gameOpen.status
          }

          //强烈变判断
          if (!mpsdk.Hack.isStrongFission()) {
            console.log('强烈变用户')
            that.globalData.cnxhstate = false
            that.globalData.gzhstate = 0
            that.globalData.cytzstate = 0
            that.globalData.hongbaoShare = 0
            that.globalData.state = 0
          }
          console.log('hongbaoShare', that.globalData.hongbaoShare)
          // 测试
          // gameOpen.md5 = '2272063aba63a8e1f40ea8d29feaac7c';//gameOpen.md5 || '20cec8e1a706ee32e5c748ed3d00cce8'
          if (gameOpen.md5) {
            if (gameOpen.md5 == storageMd5) {
              console.log('没有更新本地取');
              that.globalData.updateStatus = '1';
            } else {
              console.log('已更新，重新获取');
              wx.request({
                url: gameOpen.path,
                success(res1) {
                  console.log('请求到的解析后的数据', res1);
                  let leveldata = res1.data;
                  console.log(leveldata);
                  let md5Data = md5(JSON.stringify(leveldata));
                  console.log(leveldata, md5Data);
                  if (md5Data == gameOpen.md5) {
                    console.log(+new Date());
                    wx.setStorage({
                      key: 'leveldata',
                      data: leveldata,
                      success() {
                        console.log('数据缓存完成');
                        wx.setStorageSync('md5', gameOpen.md5)
                        console.log('热更结束', +new Date());
                        that.globalData.updateStatus = '1';
                        // resolve('1');
                      }
                    })
                  } else {
                    updatenum++
                    if (updatenum >= 3) {
                      wx.showModal({
                        title: '提示',
                        content: '题库更新失败！',
                      })
                    } else {
                      that.updateData();
                    }

                  }
                }
              })
            }
          } else {
            console.log('后台没有md5');
          }
        } else {
          console.log('请求的后台数据有问题');
        }
      }
    })
    // })
  },
  //判断两小时周期
  getperiod() {
    let dailyFirstShare = wx.getStorageSync('dailyFirstShare')
    let now = +new Date()
    if (!dailyFirstShare || now - dailyFirstShare > 2 * 60 * 60 * 1000) {
      return true
    }
    return false
  },
  // 分享判断
  onShareJudge(shareOthers, showfail = true) {
    console.log('进入了')
    let hitString = ['发到群可邀请更多好友来协助你', '请不要频繁分享到同一个地方'];
    console.log(getApp().globalData.sharetime, shareOthers);
    if (shareOthers.share && shareOthers.share1) {
      console.log('进入了share判断');
      //如果时间大于三秒
      if (+new Date() - shareOthers.time >= getApp().globalData.sharetime) {
        console.log('时间过了' + getApp().globalData.sharetime + '秒左右，看看真实时间', +new Date(), shareOthers.time, getApp().globalData.sharetime);
        //上次分享的时间
        let dailyFirstShare = wx.getStorageSync('dailyFirstShare')
        let now = +new Date()

        //如果超过两小时了
        if (!dailyFirstShare || now - dailyFirstShare > 2 * 60 * 60 * 1000) {
          // 重置时间和次数
          wx.setStorageSync('dailyFirstShare', +new Date());
          wx.setStorageSync('dailyShareNum', 0);
          wx.setStorageSync('dailyFirstSharemark', false);
          //分享失败
          if (showfail) {
            wx.showModal({
              title: '提示',
              content: '分享失败,请勿打扰同一个群',
              showCancel: false
            })
          }
          //第一次失败
          console.log('第一次分享')
          return false;
        } else {
          let dailyShareNum = wx.getStorageSync('dailyShareNum')


          if (!wx.getStorageSync('dailyFirstSharemark')) {
            // 周期内第一次
            if (showfail) {
              wx.showModal({
                title: '提示',
                content: '分享失败,请勿打扰同一个群',
                showCancel: false
              })
            }
            wx.setStorageSync('dailyFirstSharemark', true);
            // wx.setStorageSync('dailyShareNum', wx.getStorageSync('dailyShareNum') + 1);
            return false
          }
          // 今天不是第一次了 
          else if (dailyShareNum < 10) { //50
            if (Math.ceil(Math.random() * 100) <= getApp().globalData.secondsharechance1) {
              //成功了就加一次
              wx.setStorageSync('dailyShareNum', wx.getStorageSync('dailyShareNum') + 1);
              return true;
            } else {
              //分享失败
              if (showfail) {
                wx.showModal({
                  title: '提示',
                  content: '分享失败,请勿打扰同一个群',
                  showCancel: false
                })
              }

              return false;
            }
          } else {
            //分享失败
            if (showfail) {
              wx.showModal({
                title: '提示',
                content: '分享失败,请勿打扰同一个群',
                showCancel: false
              })
            }
            return false;
          }
        }
      } else {
        if (showfail) {
          // 时间不够，算失败
          wx.showModal({
            title: '提示',
            content: '分享失败,请勿打扰同一个群',
            showCancel: false
          })
        }
        //刷新分享时间 次数+1

        return false;
      }
    }
  },
  // 1 显示视频广告 2使用分享 3都不使用
  getShareOrVideo() {
    //审核状态
    if (this.globalData.state != 0) {
      //不是审核状态

      if (wx.getStorageSync('isNewSdk')) {
        //当版本库支持播放广告 

        if (wx.getStorageSync('isStrong')) {
          //当前用户是强烈变用户
          let dailyFirstShare = wx.getStorageSync('dailyFirstShare')
          let now = +new Date()

          if (!dailyFirstShare || now - dailyFirstShare > 2 * 60 * 60 * 1000) {
            //如果超过两小时了 或者是一次访问 重新随机测略
            wx.setStorageSync('firstvideoState', 1)
            console.log('开始刷新分享策略')
            //初始化分享视频转化策略
            let planarray = this.globalData.Sharepoint_Help.split(',')
            //取0-100随机数
            let randomnum = Math.ceil(Math.random() * 100)
            let probabilitynum = 0
            let res = 'nu'
            for (var i = 0; i < planarray.length; i++) {
              let plan = planarray[i];
              let item = plan.split(':')
              probabilitynum += parseInt(item[1])
              //如果随机概率小钰概率和 则取当前
              if (randomnum <= probabilitynum) {
                wx.setStorageSync('shareplan', parseInt(item[0]))
                console.log('已初刷新分享策略', item)
                res = parseInt(item[0])
                break;
              }
            }
            if (res == 'nu') {
              console.log('未找到刷新分享策略 失败 取第一种', parseInt(planarray[0].split(':')[0]))
              wx.setStorageSync('shareplan', parseInt(planarray[0].split(':')[0]))
            }
            console.log('ShareOrVideo', '非审核状态 支持视频 是强烈变 周期以过 刷新状态')
            this.globalData.ShareOrVideo = 2
            // 初始化上次分享时间
            wx.setStorageSync('dailyFirstShare', +new Date());
            wx.setStorageSync('dailyShareNum', 0);


          } else {
            //正常情况
            if (wx.getStorageSync('dailyShareNum') < wx.getStorageSync('shareplan')) {
              console.log('ShareOrVideo', '非审核状态 支持视频 是强烈变 周期没过 分享次数没过上线')
              this.globalData.ShareOrVideo = 2
            } else {
              console.log('ShareOrVideo', '非审核状态  支持视频 是强烈变 周期没过 分享次数过上线')
              this.globalData.ShareOrVideo = 1
            }
          }

          if (this.globalData.firstvideostate == 1 && wx.getStorageSync('firstvideoState') == 1) {
            console.log('ShareOrVideo', '非审核状态  支持视频 是强烈变 第一次播放视频')
            this.globalData.ShareOrVideo = 1
          }

        } else {
          //当前用户不是强烈变用户
          console.log('ShareOrVideo', '非审核状态 但是视频 不是强烈变 周期没过')
          this.globalData.ShareOrVideo = 1
        }

      } else {
        console.log('版本库小于2.6.0 不支持播放视频')

        if (wx.getStorageSync('isStrong')) {
          //不支持 用户又是强烈变 转换为分享
          console.log('ShareOrVideo', '非审核状态 不支持视频 是强烈变 ')
          this.globalData.ShareOrVideo = 2
        } else {
          //不支持视频 用户是非强烈变用户    关闭分享 提示看不了视频
          console.log('ShareOrVideo', '非审核状态 不支持视频 不是强烈变 ')
          this.globalData.ShareOrVideo = 3
        }
      }

    } else {

      if (wx.getStorageSync('isNewSdk')) {
        //审核状态  ShareOrVideo 关闭分享 提示看不了视频
        console.log('ShareOrVideo', '审核状态 但是支持视频')
      } else {
        //如果在审核状态 又不支持视频 
        this.globalData.ShareOrVideo = 3
        console.log('ShareOrVideo', '审核状态 不支持视频')
      }
    }

    //  if (wx.getStorageSync('isNewSdk')) {
    //    this.globalData.ShareOrVideo = 1
    //  } else {
    //    this.globalData.ShareOrVideo = 3
    //  }

    //  wx.setStorageSync('TotalPoint', 50000)

  },
  getchangeadgl() {
    console.log('当前切换概率:', getApp().globalData.changeadgl, '切换时间:', getApp().globalData.changeadtime)
    if (Math.ceil(Math.random() * 100) <= getApp().globalData.changeadgl) {
      console.log('确认切换')
      return true;
    } else {
      console.log('确认不切换')
      return false;
    }
  },
  getScore() {
    let numberXth = wx.getStorageSync('NumberXth');
    numberXth = numberXth.split(',');
    let maxPass = 0;
    for (let i = 0; i < numberXth.length; i++) {
      if (numberXth[i] > maxPass) {
        maxPass = numberXth[i];
      }
    };
    let passLevel = wx.getStorageSync('PassLevels');
    let score = passLevel > maxPass ? passLevel : maxPass;
    return score;
  },
  onShow: function(options) {
    console.log(options);
    this.globalData.isFromShare = options.query.share === 'true';
    let s = this.globalData.isFromCheckShare
    //let j = this.globalData.isJumpOther
    let h = getCurrentPages().length === 1
    console.log('!!!!!!!!!!', s);
    if (this.globalData.wnds.Wnd_Home && !s && //不是分享完后的显示
      //!j && 
      isInit && //不是第一次显示
      !h //当前存在可返回的页
    ) {
      /*
        setTimeout(_ =>{
            this.globalData.wnds.Wnd_Home.Show()
        }, 500)
        */
    } else {
      this.globalData.isFromCheckShare = false
      //this.globalData.isJumpOther = false
    }
    isInit = true

    //测试

  },
  onHide: function() {
    console.log("==============App Hide================");
    FightRoom.CancelLeaveRoom()
  },
  globalData: {
    CURRENT_LEVELS: "CurrentLevels", //当前所选的关卡
    userInfo: null,
    wh: _util.getPhoneInfor().windowHeight, //窗口高度
    ww: _util.getPhoneInfor().windowWidth, //窗口宽度
    anims: animParams,
    wnds: {}, //全部窗体
    LoginOK: false, //当前是否已经成功登录
    isFromShare: false, // 是否从别人的分享或邀请启动
    RsaPubkey: "", //Rsa加密算法公钥
    sharetime: '', //分享时间
    secondsharechance1: '', //第一次分享概率
    secondsharechance2: '', //第二次分享概率2
    bannerrefresh: '', //广告刷新频率
    hongbaofresh: 3,
    hongbaonum: 3,
    hongbaoShare: 1, //红包是否需要分享才能获得
    //页面定义
    pages: {
      Shopping: "dati_comm/pages/shopping/shoppingpage", //商城
      Ranking: "pages/ranking/rankingPage", //排行
      Classify: "pages/classify/classifyPage", //话题王分类
      FightOver: "pages/fightOver/fightOverPage", //战斗结算
      //Home: "pages/home/homePage",//主页
      Home: "pages/index/index", //主页
    },
    dailylucybag: [1, 3, 6, 9],
    cnxhstate: false,
    state: 3,
    changeadtime: 1,
    changeadgl: 30,
    cytzstate: 0,
    Sharepoint_Help: '3:20,2:40,1:40',
    ShareOrVideo: 1,
    gzhgift: 0, //0未授权不显示 400 未关注 200 可领取 401 领取过 
    daygift: 0, //0未授权不显示 405 不是公众号进入游戏 400 未关注 200 可领取 401 领取过
    InterstitialAdNum: 5,
    daygifttype: 0, //0不是从公众号进入 1是
    firstvideostate: 1,
    gzhstate: 0
  }
})
// getApp().globalData.g_event = new UIEvent()
//登录
//首页 
getApp().globalData.wnds.Wnd_Home = new PageWrap("/pages/index/index", 2)
//闯关
getApp().globalData.wnds.Wnd_Play = new PageWrap("/pages/play/play?types=1", 1)
//对战
getApp().globalData.wnds.Wnd_Fight = new PageWrap("/pages/fight/fight", 3)
//结束对战
getApp().globalData.wnds.Wnd_overFight = new PageWrap("/pages/overFight/overFight", 3)
//准备对战
getApp().globalData.wnds.Wnd_prepare = new PageWrap("/pages/prepare/prepare", 1)
//成语接龙
getApp().globalData.wnds.Wnd_Jiecy = new PageWrap("/pages/jiecy/jiecy", 1)
//选择关卡
getApp().globalData.wnds.Wnd_Sel = new PageWrap("/pages/sel/sel", 1)
//历史成就
getApp().globalData.wnds.Wnd_Level = new PageWrap("/pages/level/level", 1)
//往期题库
getApp().globalData.wnds.Wnd_Number = new PageWrap("/pages/number/number", 1)
//签到
getApp().globalData.wnds.Wnd_Signin = new PageWrap("/pages/signin/signin", 1)
//充值
// getApp().globalData.wnds.Wnd_Pay = new PageWrap("/pages/pay/pay", 1)