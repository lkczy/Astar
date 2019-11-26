// pages/sub_pages/welfare/welfare.js
var report = require('../../utils/mpsdk.js');
// var dataManager = require("../../utils/data-manager");
var shareUtil = require("../../utils/share-util.js");
var that;
var shareMessage;
let app=getApp();
//被点击的玩家信息
var clickItem;
var idx;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    names: ["沙沙粒小",
      "七七",
      "傻逼既视感",
      "你的背包",
      "意中人",
      "万劫不复",
      "梓梦",
      "愛殇璃",
      "小傻瓜",
      "凤舞天涯",
      "小兔几",
      "天煞孤星",
      "遗失的美好",
      "十二",
      "浅浅淡淡",
      "最好是你",
      "伊面",
      "洋洋洒洒",
      "魔",
      "紫轩蝶泪",
      "蛮可爱",
      "最笨的告白",
      "喪",
      "后来的我们",
      "童话",
      "似梦非梦",
      "高冷爸爸",
      "南城旧梦",
      "别理我",
      "诺曦",
      "悲欢浪女",
      "一枫情书",
      "尹雨沫",
      "呆橘",
      "困倦",
      "玉环",
      "青柠芒果",
      "来日方长",
      "痞味浪人",
      "旧城空念",
      "世界和平",
      "二货你真萌",
      "老子叫无熙",
      "唐婉",
      "骄傲",
      "冰火雁神",
      "慈悲佛祖",
      "孤蝉",
      "尴尬癌患者",
      "身边",
      "所谓喜欢",
      "南笙",
      "失而复得",
      "转身以后",
      "勿忘心安",
      "神回复",
      "江湖彼岸",
      "段念尘",
      "饭团",
      "你的笑",
      "蓦然回首",
      "北恋",
      "白日梦",
      "美羊羊",
      "罗罗贝儿",
      "小红帽",
      "灯下孤影",
      "爱冒险",
      "水中月",
      "过气美图社",
      "陈独秀",
      "陈甜",
      "柒七",
      "遗忘曾经",
      "娇纵",
      "不顾",
      "情话墙",
      "南风起",
      "我的奇迹",
      "浅忆",
      "油焖大侠",
      "半夏半凉",
      "玩物",
      "吖咩",
      "猫七",
      "可可",
      "墨柒柚.?",
      "囧兔兔",
      "这是你对象.",
      "迷人的小祖宗",
      "HB",
      "久往我心",
      "上善若水",
      "软甜少女い°",
      "茶",
      "季清妤.",
      "尘沙飞扬",
      "木木言",
      "樱花雨梦",
      "妖颜浪女ギ",
      "梦ζ梓归ヾ",
      "芒果",
      "林念·",
      "撒野.",
      "丁三岁",
      "微痞女孩〃°",
      "汐辞木木",
      "如旧.",
      "冷颜夕",
      "红颜",
      "萌萌小公主",
      "旧言虐心",
      "北茵",
      "洁白口香糖",
      "久念",
      "爱你一万年",
      "oohjyyy",
      "张聪明?",
      "眉眼如初i",
      "陌儿X.",
      "秦",
      "樱Ψ雪",
      "容奕",
      "墨尘",
      "卡多希",
      "处",
      "Think`他",
      "念",
      "西葫芦鱼",
      "差劲.",
      "安于命゜",
      "a'ゞ无眠兔",
      "初夏的樱花",
      "砾毒",
      "可儿图文﹏",
      "祁染?",
      "酸涩",
      "Dear.十二.",
      "裸女",
      "誓信﹀贓",
      "嘤嘤妹",
      "仰起头",
      "春风吹",
      "世中仙",
      "一生所求",
      "几分喜欢",
      "超喜欢你",
      "少女心事",
      "方寸月光",
      "甜味超标",
      "你是猪吧",
      "安于喜欢",
      "治愈少女",
      "*小猪侠*",
      "尐米蟲∞",
      "文姬蔺彩辰",
      "艺妓蔺蓉",
      "卷发蔺胤龙",
      "故人",
      "张筵筠",
      "张少珍",
      "张世芬",
      "张筵惠",
      "冯玉诚",
      "冯文福",
      "冯文富",
      "冯瑞明",
      "冯文均",
      "冯瑞民",
      "冯文佳",
      "冯文隆",
      "伊甸园",
      "夜色撩人",
      "闺蜜",
      "客乐小吃",
      "完美女人",
      "婉居房产",
      "天天美曰化",
      "佳格食品店",
      "三味真火",
      "BOBO宠物轩",
      "女王当铺",
      "七彩皇后",
      "CODE男装店",
      "缘来饰你",
      "潮童领地",
      "爱尚许嘉欣",
      "唯美许雪菲",
      "凹凸许菲菲",
      "乐淘淘",
      "风印女装",
      "名媛汇美甲",
      "俏佳人",
      "尤尚",
      "简尚男装",
      "吃不腻",
      "女主角",
      "百衣百顺",
      "CY潮流站",
      "早点来",
      "炫潮男装",
      "又见萌宠",
      "链家郑锐杰",
      "金郑春勇",
      "一步登天",
      "决战天亮",
      "丽人轩",
      "丽舍私语",
      "丽都大酒店",
      "新都里无二",
      "吉瑞福",
      "沙星咖啡吧",
      "佰威奇孙馨",
      "童龄坊孙羽",
      "我形你SHOW",
      "尚颖",
      "衣酷男孩",
      "街头先锋",
      "品格男装店",
      "旭东食品店",
      "吉范尼斯",
      "幻彩炫光",
      "摩登BABY",
      "艾妮美甲",
      "莲花池",
      "星域娱乐城",
      "美艺",
      "爱尚美妆",
      "舞动指尖",
      "天意园林",
      "麦田坊",
      "UOA女装店",
      "君浩男装",
      "妙指",
      "安婷内衣店",
      "喜洋洋面馆",
      "天景食品店",
      "绕指柔",
      "伯克巴瑞",
      "农家乐",
      "含羞草",
      "奇勋",
      "男依阁",
      "尚世",
      "丽珍美甲",
      "俏美人美妆",
      "格尚",
      "二度春",
      "牛仔之家",
      "衣妆",
      "蔺天语",
      "蔺恬语",
      "蔺恬一",
      "蔺焰",
      "蔺俊丽",
      "蔺志慧",
      "蔺万香",
      "蔺曾盛",
      "蔺曾烽",
      "蔺曾彪",
      "蔺子轩",
      "蔺云峰",
      "蔺在",
      "蔺域骉",
      "孙耀",
      "孙叶叶",
      "孙雪倩",
      "孙婕婷",
      "孙博",
      "孙晗菲",
      "孙卫华",
      "孙十五",
      "孙怡雅",
      "孙金明",
      "孙明华",
      "孙田",
      "孙统波",
      "郑锐珉",
      "郑锐鸣",
      "郑锐敏",
      "郑珉锐",
      "郑杰锐",
      "郑吉锐",
      "郑丽梅",
      "郑琦锐",
      "郑文广",
      "郑文镪",
      "郑镪",
      "郑文铨",
      "郑玉红",
      "郑铨",
      "郑一冉",
      "郑紫文",
      "许菲雪",
      "许盈婕",
      "许莹婕",
      "许淑茜",
      "许开开",
      "许竞今",
      "许淑婷",
      "许木子",
      "许伊晨",
      "许玲娟",
      "许鑫"
    ],
    friendList: [{
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
      {
        userinfo: ''
      },
    ],

    coin: [{
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
        "coin": "60",
      },
      {
         "coin": "60",
      },
      {
         "coin": "60",
      },
      {
         "coin": "60",
      },
      {
         "coin": "60",
      },
      {
         "coin": "60",
      },
      {
         "coin": "60",
      },
      {
         "coin": "60",
      },
      {
         "coin": "60",
      },
      {
         "coin": "60",
      },

    ],
    onLineListLength: 0,
    showInfoBox: false,
    isiPhoneX: getApp().globalData.isiPhoneX,
    isShowShare: false,
    getCoin: 0,
    giftType: 'coin',
    cnxhstate:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;

    setTimeout(()=>{
      this.setData({
        cnxhstate:getApp().globalData.cnxhstate
      })
    },1000)

    //状态码 
    shareUtil.auditing(that);

    wx.showShareMenu({
      withShareTicket: true,
    })

    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    //获取毫秒时间戳
    var timeStamp = date.getTime();
    //当前日期
    console.log('当前日期的时间戳', timeStamp);

    var curDayTimestamp = wx.getStorageSync('CURRENT_DAY_TIMESTAMP');
    if (curDayTimestamp && curDayTimestamp != timeStamp) {
      //删除领取过的列表
      wx.removeStorageSync('GET_COIN_LIST');
    }
    wx.setStorageSync('CURRENT_DAY_TIMESTAMP', timeStamp);

    //获取已经领取过的列表
    console.log('获取已经领取过的列表', wx.getStorageSync('GET_COIN_LIST'));
    var getCoinList = wx.getStorageSync('GET_COIN_LIST');

    wx.request({
      url: 'https://xyxcck-friend.raink.com.cn/MiniFriend/data/getFriend.action',
      data: {
        gameId: 1,
        openId: report.Account.getAccount().openid,
        dataKey: 'loginTime',
      },
      success: res => {
        if (res.data.error) {
          return;
        }
        if (res.data.friends && res.data.friends.length > 0) {
          var friends = res.data.friends;
          //排序
          friends.sort(that.compare("dataValue"));

          var length = (res.data.friends.length > 30 ? 30 : res.data.friends.length);
          for (var i = 0; i < length; i++) {
            if (friends[i].show) {
              friends[i].show = JSON.parse(friends[i].show);
            }
            friends[i]['isOnline'] = (friends[i].dataValue > timeStamp);
            if (friends[i].isOnline) {
              that.data.onLineListLength++;
            }
            //判断是否已经领取过金币了
            if (getCoinList && getCoinList.length > 0) {
              for (var j = 0; j < getCoinList.length; j++) {
                if (getCoinList[j].openId == friends[i].openId) {
                  friends[i]['isGet'] = true;
                  getCoinList[j].show = friends[i].show ? friends[i].show : getCoinList[j].show
                }
              }
            } else {
              that.data.friendList[i] = friends[i];
              that.setData({
                friendList: that.data.friendList
              })
            }
          }
          //设置在线人数
          that.setData({
            onLineListLength: that.data.onLineListLength
          })
          //删除已经领取过得用户并放到最前面
          if (getCoinList && getCoinList.length > 0) {
            for (var i = friends.length - 1; i >= 0; i--) {
              if (friends[i].isGet) {
                friends.splice(i, 1);
              }
            }
            getCoinList = getCoinList.concat(friends);
            for (var i = 0; i < getCoinList.length; i++) {
              that.data.friendList[i] = getCoinList[i];
            }
            console.log('好友列表', that.data.friendList);
            that.setData({
              friendList: that.data.friendList
            })
          }
        }
      }
    })

    //生成分享文本
    wx.getStorage({
      key: 'USER_INFO',
      success: function(res) {
        var info = JSON.parse(res.data);
        shareMessage = info.nickName + '邀你玩不一样的套路！'
      },
      fail: () => {
        var index = Math.floor(Math.random() * 30);
        shareMessage = that.data.names[index] + '邀你玩不一样的套路！'
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  shareOthers:{},
  onShow: function() {
    if (app.onShareJudge(this.shareOthers),false) {
      this.shareManage(this.shareOthers.serial, {});
    }
    this.shareOthers = {};
  },
  onHide() {
    console.log('页面消失');
    this.shareOthers.share1 = true;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let that=this;
    var shareType = 4;
    if (res.target) {
      shareType = res.target.dataset.type;
    }
    // let shareType = 14;
    var shareObj = {
      serial: shareType,
      scoreValue: getApp().getScore()
    };
    // var shareObj = report.Share.getShareInfo();
    if (wx.getSystemInfoSync().version > '6.7.2') {
      console.log('高版本');
      this.shareOthers.share = true;
      this.shareOthers.time = +new Date();
      this.shareOthers.shareInfo = shareObj;
      this.shareOthers.serial = shareType;
      // this.shareOthers.shareBtnType = shareForLottery;
    }
    // return {
    //   title: shareObj.text,
    //   path: report.Share.getShareLink(10, '/pages/index/index', 'openid=' + report.Account.getAccount().openid, shareObj.id),
    //   imageUrl: shareObj.image,
    //   success: function(res) {
    //     if(!that.shareOthers.share){
    //      that.shareManage(shareType, shareObj, res);
    //     }
    //   },
    //   fail: function(res) {
    //     // 转发失败
    //     console.log('添加好友失败')
    //   }
    // }
    const success = function (res) {
      if (!this.shareOthers.share) {
        console.log('走的老版分享', shareType, res);
        
         that.shareManage(shareType,  res);
        
      }
    }
    return report.Share.commonShare(shareObj, success, '', this);
  },
  shareManage(shareType,res){
    let that=this;
    // report.Share.reportShareOut(10, shareObj.id, res.shareTickets);
    // 转发成功
    if (shareType) {
      shareUtil.shareForReward(res, shareType, parseInt(that.data.getCoin), function () {
        report.Report.reportEvent(31);
        that.setData({
          isShowShare: false
        })
        that.clickTohandleFriend();
      });
    } else {
      console.log('添加好友成功')
      shareUtil.shareSuc(res, that);
    }
  },
  getCoin: function(e) {
    idx = e.currentTarget.dataset.idx;
    var coin = that.data.coin[idx];
    clickItem = that.data.friendList[idx];
    console.log('进入了加金币')
    var point = Number(wx.getStorageSync('TotalPoint'));
        point = point + Number(coin.coin);

        wx.setStorageSync('TotalPoint', point);
        wx.showToast({
          title: '获得' + coin.coin + '金币',
          image: '../../images/jingbi.png',
          duration: 2500
        });
        that.clickTohandleFriend();
    // if (that.data.status == "0") {
    //   if (coin.coin) {
    //     var point = Number(wx.getStorageSync(getApp().globalData.TOTAL_POINT));
    //     point = point + Number(coin.coin);
    //     report.Report.reportGold(coin.coin, point, '放弃双倍礼包', 10);
    //     wx.setStorageSync(getApp().globalData.TOTAL_POINT, point);
    //     wx.showToast({
    //       title: '获得' + coin.coin + '金币',
    //       image: '../../images/coin.png',
    //       duration: 2500
    //     });
    //     that.clickTohandleFriend();
    //   } else {
    //     wx.request({
    //       url: 'https://xyxcck-friend.raink.com.cn/MiniFriend/data/addLotteryTimes.action',
    //       // url: 'http://192.168.5.38:8080/MiniFriend/data/addLotteryTimes.action',
    //       data: {
    //         gameId: 1,
    //         openId: report.Account.getAccount().openid,
    //         dataKey: 1,
    //         times: coin.lottery
    //       },
    //       success: function() {
    //         console.log("添加次数成功了!")
    //         wx.showToast({
    //           title: '获得' + coin.lottery + '次抽奖',
    //           image: '../../images/cjzp.png',
    //           duration: 2500
    //         })
    //         //发送事件
    //         that.clickTohandleFriend();
    //       },
    //       fail: function() {
    //         console.log("添加次数失败了!")
    //         wx.showToast({
    //           title: '获得抽奖失败,请确保您的网络畅通',
    //           icon: 'none',
    //           duration: 2500
    //         })
    //       }
    //     })
    //   }
    // } else {
      // that.setData({
      //   isShowShare: true,
      //   getCoin: coin.coin ? coin.coin : 1,
      //   giftType: coin.coin ? 'coin' : 'lottery',
      // })
    // }


  },

  clickTohandleFriend: function() {
    that.data.friendList[idx]['isGet'] = true;
    that.setData({
      friendList: that.data.friendList,
    })

    var getCoinList = [];
    if (wx.getStorageSync('GET_COIN_LIST')) {
      getCoinList = wx.getStorageSync('GET_COIN_LIST');
    }
    getCoinList.push(clickItem);
    wx.setStorageSync('GET_COIN_LIST', getCoinList);
  },

  //排序
  compare: function(prop) {
    return function(obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (val1 < val2) {
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
    }
  },

  showTips: function() {
    that.setData({
      showInfoBox: true
    })
  },

  unshowInfo: function() {
    that.setData({
      showInfoBox: false
    })
  }
})