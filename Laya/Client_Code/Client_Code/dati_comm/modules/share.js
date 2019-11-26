import {
  SDataShare
} from "../../sdata/SDataShare";
import {
  Player
} from "../../modules/Player";
import {
  GameConn
} from "../libs/network/Conns";
import * as gcfg from "../../gamecfg"
import * as LCData from "../../modules/LocalData"
const mpsdk = require('../../utils/mpsdk.js')

let share = {
  getShareInfo(tp) {
    getApp().globalData.isFromCheckShare = true
    var row = SDataShare.GetRow(tp)
    var icon = row[SDataShare.I_Icon]
    var useName = row[SDataShare.I_UserName]
    var note = row[SDataShare.I_Note]

    if (useName == 1) note = note.format(Player.Name())
 
    var re = {
      Note: note,
      Icon: `${Player.ArticleServerUrl()}/public/uploads/ProblemImg/${icon}`
    }
    return re
  },

  // 转发普通分享的参数数据
  getCommonShareContent(options, useScreenImg = false) {

    var info = this.getShareInfo(1)

    var parms = {
      title: info.Note,
      path: "pages/index/index?share=true",
      success: this.sharenewquna,
      fail: this._onShareFail,
    };
    console.log("parmsparmsparmsparmsparmsparmsparmsparmsparmsparms", parms)
    parms.imageUrl = info.Icon

    // 如果按钮指定了页面则设置
    /*
    if (options.target && options.target.dataset) {
        let dataset = options.target.dataset;
        if (dataset.page) {
            parms.path = dataset.page;
        }
    } */
    return parms;
  },

  getCGShareContent(that, cur_level, shareOthers) {
    console.log('刚进入的时候的数据：',shareOthers);
    getApp().globalData.isFromCheckShare = true
    let self=this;
    let serial = shareOthers.serial || 4;
    let shareInfo = { serial: serial, scoreValue: getApp().getScore() };
    
    if (shareOthers.share){
      console.log('进入了新分享这个封装的分享里', shareOthers, shareInfo, serial);
      this.shareMeg(that, cur_level, serial,'');
      return;
    }
    let success = function (res) {
      if (!this.shareOthers || !this.shareOthers.share) {
        console.log('走的老版分享', serial, res, shareInfo);
        this.shareMeg(that, cur_level, serial, shareInfo, res);
      }
    }
    return mpsdk.Share.commonShare(shareInfo, success, '', this);
    // return {
    //   title: shareInfo.text || ('我已经闯过' + cur_level + "关，谁与我战？"),
    //   path: mpsdk.Share.getShareLink(serial, '/pages/index/index', '', shareInfo.id || ''),
    //   imageUrl: shareInfo.image,
    //   success: function(res) {
    //     if (!shareOthers.share){
    //       self.shareMeg(that,cur_level,serial, shareInfo, res);
    //     }
    //   },
    //   fail: function(res) {
    //     // 转发失败
    //   }
    // }
  },
  shareMeg(that,cur_level,serial,res){
    // let that=this;
    // mpsdk.Share.reportShareOut(serial, shareInfo.id, res.shareTickets ? res.shareTickets[0] : '');
    //获取分享次数
    var curTime = parseInt((new Date()).getTime() / 86400000)
    var lastTime = LCData.GetNumber(LCData.ParamName.SHARE_TIME)
    var count = LCData.GetNumber(LCData.ParamName.SHARE_COUNT)
    if (curTime == lastTime) {
      count = count + 1
    } else {
      count = 1
    }

    LCData.Set(LCData.ParamName.SHARE_TIME, curTime)
    LCData.Set(LCData.ParamName.SHARE_COUNT, count)


    if (cur_level < 200) {
      console.log("onshare success1")
      if (count > 10) {
        if (wx.getStorageSync("ShowTipsPre100") == "") {
          wx.setStorage({
            key: "ShowTipsPre100",
            data: "show",
          })

          wx.showModal({
            title: "提示",
            content: "您一天只能获取十次奖励哦！！！",
            showCancel: false
          })
        }
        return
      }
    } else if (cur_level < 400) {
      console.log("onshare success2")
      if (count > 8) {
        if (wx.getStorageSync("ShowTipsPre200") == "") {
          wx.setStorage({
            key: "ShowTipsPre200",
            data: "show",
          })

          wx.showModal({
            title: "提示",
            content: "您一天只能获取八次奖励哦！！！",
            showCancel: false
          })
        }
        return
      }
    } else if (cur_level < 600) {
      console.log("onshare success3")
      if (count > 6) {
        if (wx.getStorageSync("ShowTipsPre300") == "") {
          wx.setStorage({
            key: "ShowTipsPre300",
            data: "show",
          })

          wx.showModal({
            title: "提示",
            content: "您一天只能获取六次奖励哦！！！",
            showCancel: false
          })
        }
        return
      }
    } else if (cur_level < 800) {
      console.log("onshare success3")
      if (count > 4) {
        if (wx.getStorageSync("ShowTipsPre400") == "") {
          wx.setStorage({
            key: "ShowTipsPre400",
            data: "show",
          })

          wx.showModal({
            title: "提示",
            content: "您一天只能获取四次奖励哦！！！",
            showCancel: false
          })
        }
        return
      }
    } else {
      console.log("onshare success3")
      if (count > 2) {
        if (wx.getStorageSync("ShowTipsPreOther") == "") {
          wx.setStorage({
            key: "ShowTipsPreOther",
            data: "show",
          })

          wx.showModal({
            title: "提示",
            content: "您一天只能获取两次奖励哦！！！",
            showCancel: false
          })
        }
        return
      }
    }


  //分享获得金币
    // var point = LCData.GetNumber(LCData.ParamName.TOTAL_POINT)
    // point += 30
    // LCData.Set(LCData.ParamName.TOTAL_POINT, point)

    // that.setData({
    //   total_point: point
    // })

    // wx.showToast({
    //   title: '获得30金币',
    //   icon: 'success',
    //   duration: 2000
    // })
  },

  // 根据入口类型转发
  getShareContent(options, tp) {

    var info = this.getShareInfo(tp)

    var parms = {
      title: info.Note,
      path: "pages/index/index?share=true",
      success: this.sharenewquna,
      fail: this._onShareFail,
    };

    parms.imageUrl = info.Icon

    // 如果按钮指定了页面则设置
    /*
    if (options.target && options.target.dataset) {
        let dataset = options.target.dataset;
        if (dataset.page) {
            parms.path = dataset.page;
        }
    }*/

    return parms;
  },

  // 转发挑战分享的参数数据
  getPKShareMessage(joinCode) {
    var info = this.getShareInfo(3)
    let parms = {
      title: info.Note,
      path: "pages/index/index?share=true&m8=" + joinCode,
      imageUrl: info.Icon,
      success: this._onShareSuccess,
      fail: this._onShareFail,
    };
    console.log(parms);

    return parms;
  },
  // 转发组队分享的参数数据
  getTeamShareMessage(joinCode) {
    var info = this.getShareInfo(3)
    let parms = {
      title: info.Note,
      path: "pages/index/index?share=true&m9=" + joinCode,
      imageUrl: info.Icon,
      //success: this._onShareSuccess,
      //fail: this._onShareFail,
    };
    console.log(parms);

    return parms;
  },

  getCheckLockShareMessage(scallback, fcallback) {
    var info = this.getShareInfo(8)
    let parms = {
      title: info.Note,
      path: "pages/index/index?share=true",
      imageUrl: info.Icon,
      success: res => {
        console.log("成功", scallback)
        if (scallback) {
          scallback(res)
        }
      },
      fail: res => {
        console.log("失败", scallback)
        if (fcallback) {
          fcallback(res)
        }
      },
    };
    return parms;
  },

  getCheckGiveShareMessage(scallback, fcallback) {
    var info = this.getShareInfo(9)
    var parms = {
      title: info.Note,
      path: "pages/index/index?share=true",
      success: res => {
        GameConn.Request({
          n: "ssc"
        }, data => {
          if (scallback) {
            scallback(data)
          }
        })
      },
      fail: res => {
        if (fcallback) {
          fcallback()
        }
      },
    };
    parms.imageUrl = info.Icon
    return parms;
  },
  // 
  getoverShareMessage(scallback, fcallback) {
    var info = this.getShareInfo(4)
    var parms = {
      title: info.Note,
      path: "pages/index/index?share=true",
      success: res => {
        if (scallback) {
          scallback(res)
        }

      },
      fail: res => {
        if (fcallback) {
          fcallback()
        }
      },
    };
    parms.imageUrl = info.Icon
    return parms;
  },
  hasShareReward() {
    var sharedTimes = Player.Backpack.ShareGerenNum //分享给个人的次数
    return sharedTimes < Player.Sharelimit;
    // Player.SharedTimes()
  },

  _onShareSuccess(res) {
    console.log("#_onShareSuccess#", res)
    GameConn.Request({
        n: "ssc"
      },
      (data) => {
        console.log("炫耀成功，获得金币", data.jb);
        console.log(`今天第 ${data.cs} 次分享成功！`);
        // this.times = parseInt(data.cs);
      }
    );
  },

  _onShareFail() {
    console.log('Share failed!!!')
  },
  // 分享到群————通用
  sharenewqun(res) {
    console.log("进入群分享", res)

    wx.getShareInfo({
      shareTicket: res[0],
      success: (res) => {
        var ediv = {}
        ediv.ed = res.encryptedData
        ediv.iv = res.iv;

        console.log("获取到ediv", ediv)
        GameConn.Request({
          n: 'sqsc',
          m: 1,
          wxg: ediv
        }, data => {
          if (data.r == 0) {
            return data.jb

          } else if (data.r == 1) {

            // wx.showModal({
            //   title: '分享提醒',
            //   content: '这个群已经分享，请换个群分享',
            //   showCancel: false,
            //   confirmText: '确定',
            //   success: function(res) {
            //     return
            //   }
            // })
          } else {
            wx.showModal({
              title: '分享失败',
              content: '未知错误',
              showCancel: false,
              confirmText: '确定',
              success: function(res) {
                return
              }
            })
          }
        })
      }
    })
  },
  // 分享到群————通用
  sharenewquna(res) {
    console.log("进入群分享", res)

    wx.getShareInfo({
      shareTicket: res.shareTickets[0],
      success: (res) => {
        var ediv = {}
        ediv.ed = res.encryptedData
        ediv.iv = res.iv;

        console.log("获取到ediv", ediv)
        GameConn.Request({
          n: 'sqsc',
          m: 1,
          wxg: ediv
        }, data => {
          if (data.r == 0) {

          } else if (data.r == 1) {

            // wx.showModal({
            //   title: '分享提醒',
            //   content: '这个群已经分享，请换个群分享',
            //   showCancel: false,
            //   confirmText: '确定',
            //   success: function(res) {}
            // })
          } else {
            wx.showModal({
              title: '分享失败',
              content: '未知错误',
              showCancel: false,
              confirmText: '确定',
              success: function(res) {}
            })
          }
        })
      }
    })
  },
  // 商城群分享
  shareshopqun(res) {
    wx.getShareInfo({
      shareTicket: res[0],
      success: (res) => {
        var ediv = {}
        ediv.ed = res.encryptedData;
        ediv.iv = res.iv;
        GameConn.Request({
          n: 'sqsc',
          m: 2,
          wxg: ediv
        }, data => {
          if (data.r == 0) {

          } else if (data.r == 1) {

            // wx.showModal({
            //   title: '分享提醒',
            //   content: '这个群已经分享，请换个群分享',
            //   showCancel: false,
            //   confirmText: '确定',
            //   success: function(res) {}
            // })
          } else {
            wx.showModal({
              title: '分享失败',
              content: '未知错误',
              showCancel: false,
              confirmText: '确定',
              success: function(res) {}
            })
          }
        })
      }
    })
  },
  // 闯关群分享
  sharequn(res) {
    wx.getShareInfo({
      shareTicket: res[0],
      success: (res) => {
        var ediv = {}
        ediv.ed = res.encryptedData
        ediv.iv = res.iv;
        GameConn.Request({
          n: 'sqsc',
          m: 1,
          wxg: ediv
        }, data => {
          if (data.r == 0) {
            GameConn.Request({
              n: 'cg',
              fl: gcfg.xieyi
            }, data => {
              GameConn.Request({
                n: 'cgplay'
              }, data => {})
            })
          } else if (data.r == 1) {

            // wx.showModal({
            //   title: '分享提醒',
            //   content: '这个群已经分享，请换个群分享',
            //   showCancel: false,
            //   confirmText: '确定',
            //   success: function(res) {
            //     GameConn.Request({
            //       n: 'cg',
            //       fl: gcfg.xieyi
            //     }, data => {
            //       GameConn.Request({
            //         n: 'cgplay'
            //       }, data => {})
            //     })
            //   }
            // })
          } else {
            wx.showModal({
              title: '分享失败',
              content: '未知错误',
              showCancel: false,
              confirmText: '确定',
              success: function(res) {
                GameConn.Request({
                  n: 'cg',
                  fl: gcfg.xieyi
                }, data => {
                  GameConn.Request({
                    n: 'cgplay'
                  }, data => {})
                })
              }
            })
          }
        })
      }
    })
  },
  // 闯关分享到个人
  sharegeren() {
    GameConn.Request({
      n: 'ssc'
    }, data => {
      if (data.r == 0) {
        GameConn.Request({
          n: 'cg',
          fl: gcfg.xieyi
        }, data => {
          GameConn.Request({
            n: 'cgplay'
          }, data => {})
        })
      } else {
        wx.showModal({
          title: '分享失败',
          content: '未知错误',
          showCancel: false,
          confirmText: '确定',
          success: function(res) {
            GameConn.Request({
              n: 'cg',
              fl: gcfg.xieyi
            }, data => {
              GameConn.Request({
                n: 'cgplay'
              }, data => {})
            })
          }
        })
      }
    })
  },

  sharenewqun(res, data, geren, qun) {
    var than = this
    var shareTickets = res.shareTickets
    if (!shareTickets) {
      wx.showModal({
        title: '分享提醒',
        content: '需要分享到微信群',
        showCancel: false,
        confirmText: '确定',
        success: function(res) {
          GameConn.Request({
            n: 'ssc'
          }, data => {
            if (data.r == 0) {
              var shareMoneya = Player.Money()
              shareMoneya += data.jb
              than.setData({
                [data]: parseInt(shareMoneya)
              })
              geren = geren + 1
              than.fenxiang(qun, geren)
              GameConn.Request({
                n: 'cg',
                fl: gcfg.xieyi
              }, data => {
                GameConn.Request({
                  n: 'cgplay'
                }, data => {})
              })
            } else {
              wx.showModal({
                title: '分享失败',
                content: '未知错误',
                showCancel: false,
                confirmText: '确定',
                success: function(res) {}
              })
            }
          })
        }
      })
    } else {
      wx.getShareInfo({
        shareTicket: shareTickets[0],
        success: (res) => {
          var ediv = {}
          ediv.ed = res.encryptedData
          ediv.iv = res.iv;
          GameConn.Request({
            n: 'sqsc',
            m: 1,
            wxg: ediv
          }, data => {
            if (data.r == 0) {
              var shareMoneya = Player.Money()
              shareMoneya += data.jb
              this.setData({
                [data]: parseInt(shareMoneya)
              })
              qun = parseInt(qun + 1)
              this.fenxiang(qun, geren)
              GameConn.Request({
                n: 'cg',
                fl: gcfg.xieyi
              }, data => {
                GameConn.Request({
                  n: 'cgplay'
                }, data => {})
              })
            } else if (data.r == 1) {
              // wx.showModal({
              //   title: '分享提醒',
              //   content: '这个群已经分享，请换个群分享',
              //   showCancel: false,
              //   confirmText: '确定',
              //   success: function(res) {}
              // })
            } else {
              wx.showModal({
                title: '分享失败',
                content: '未知错误',
                showCancel: false,
                confirmText: '确定',
                success: function(res) {}
              })
            }
          })
        }
      })
    }

  },
  // 分享到个人————通用
  sharenewgeren() {
    GameConn.Request({
      n: 'ssc'
    }, data => {
      if (data.r == 0) {
        return data.jb
      } else {
        wx.showModal({
          title: '分享失败',
          content: '未知错误',
          showCancel: false,
          confirmText: '确定',
          success: function(res) {}
        })
      }
    })
  }
};

export {
  share
};