/*
### 五、关于浮标和按钮跳转逻辑的说明
  * 友链组件初始化时自动读取线上配置，配置的内容决定点击后跳转的目标；
* 配置分为专用配置和通用配置；
* 使用组件时设置了id属性，则以此id读取专用配置；
* 如果不设置id属性或设置了id属性但线上没有为此app配置专用数据，则自动切换使用通用配置。
*/
const app = getApp();

let _userid = '';

/**
 * 获取用户ID（最大程度兼容）
 */
function getUserId() {
  if (_userid) {
    return _userid;
  }
  _userid = wx.getStorageSync('userid') || wx.getStorageSync('miniapp_user_account').openid || wx.getStorageSync('miniapp_user_idfa');
  if (!_userid) {
    _userid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0;
      let v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    wx.setStorage({
      key: 'miniapp_user_idfa',
      data: _userid,
    });
  }
  return _userid;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnType: {
      type: String,
      value: 'normal', //image/normal
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    friend: {},
  },

  /**
   * 组件生命周期函数，在组件实例进入页面节点树时执行
   */
  attached: function() {
    //数据处理函数
    let initData = data => {
      if (!data) {
        return;
      }

      let publicData = [],
        privateData = [],
        publicTable = 0,
        privateTable = 0;
      for (let item of data) {
        //过滤
        if (this.data.btnType == 'image' && item.category !== 0) {
          continue;
        } else if (this.data.btnType == 'normal' && item.category !== 1) {
          continue;
        }
        //分拣
        if (!item.self_id) {
          publicData.push(item);
          publicTable += item.table;
        } else if (this.id && this.id == item.self_id) {
          privateData.push(item);
          privateTable += item.table;
        }
      }

      //优先使用专用配置
      let finalData = privateData.length ? privateData : publicData;
      let finalTable = privateData.length ? privateTable : publicTable;
      if (!finalData.length) {
        return;
      }

      //圆桌分配
      let random = Math.random(); //大于等于0.0小于1.0
      let startPostion = 0;
      for (let item of finalData) {
        if (startPostion <= random && random < startPostion + item.table / finalTable) {
          this.setData({
            friend: item
          });
          break;
        }
        startPostion += item.table / finalTable;
      }
      // console.log('链接类型', this.data.btnType);
      // console.log('通用配置分拣结果', publicData);
      // console.log('专用配置分拣结果', privateData);
      // console.log('桌面大小：' + finalTable, '随机数：' + random, '被选权重：' + this.data.friend.table);
      // console.log('决策结果：', this.data.friend);
    }

    //取缓存
    const storageKey = 'zsdlFriendLinkData';
    initData(wx.getStorageSync(storageKey));
    //更新数据
    wx.request({
      url: 'https://cdn-xyx.raink.com.cn/ad/box/friendlinks.json',
      success: res => {
        initData(res.data);
        //存缓存
        wx.setStorage({
          key: storageKey,
          data: res.data
        });
      },
    })

  },

  /**
   * 组件的方法列表
   */
  methods: {

    tapApp: function(e) {

      let eventName = this.data.btnType == 'image' ? '点击浮标：' + this.data.friend.title : '点击更多：' + this.data.friend.title;

      //上报阿拉丁日志
      if (app.aldstat) {
        app.aldstat.sendEvent(eventName, {
          'APP名称': this.data.friend.title,
          'APP_ID': this.data.friend.appid,
        });
      }
      //上报自己日志
      wx.request({
        url: 'https://xyxcck-log.raink.com.cn/MiniGameLog/log/linkEvent.action',
        data: {
          gameid: this.id,
          userid: getUserId(),
          link_to_game_id: this.data.friend.aid, //连接跳转到游戏id
          link_ad_id: 0, //广告id(没有填0)
          param1: this.data.friend.title
        },
        success: (res) => {
          console.log(eventName);
        }
      });

      //低版本跳转兼容
      wx.getSystemInfo({
        success: res => {
          if (res.SDKVersion < '2.0.7') {
            wx.navigateToMiniProgram({
              appId: this.data.friend.appid,
              path: this.data.friend.page + '?type=link&adid=0',
            });
          }
        }
      });

      //发送事件
      this.triggerEvent('click', {
        appInfo: this.data.friend
      });
    },

  }
})