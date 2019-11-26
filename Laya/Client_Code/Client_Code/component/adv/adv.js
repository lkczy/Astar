const mpsdk = require('../../utils/mpsdk.js');
const forceVideoTime = 9; //视频强制观看时间

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gameId: String,
    gamePath: String,
    advType: {
      type: String,
      value: 'banner', //banner/video
    },
    unitId: String, //默认微信banner广告
    showVideo: {
      type: Boolean,
      value: false, //是否开始播放视频广告
      observer: '_showVideoChange'
    },
    muted: {
      type: Boolean,
      value: true, //是否静音
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    advData: null, //当前广告数据
    timeRemain: 0, //当前视频广告剩余时间
    timeClose: 0, //剩余可关广告时间
  },

  /**
   * 组件生命周期函数，在组件实例进入页面节点树时执行
   */
  ready: function() {
    //参数检查
    if (this.data.advType != 'banner' && this.data.advType != 'video' && this.data.advType != 'icon') {
      console.error('adv组件参数advType不正确');
      return;
    }

    mpsdk.Env.gameId = mpsdk.Env.gameId || this.data.gameId;
    mpsdk.Env.gamePath = mpsdk.Env.gamePath || this.data.gamePath;
    //参数检查
    if (!mpsdk.Env.gameId || !mpsdk.Env.gamePath) {
      console.error('game-id 或 game-path参数不正确');
      return;
    }
    mpsdk.Ad.loadAdData();

    //icon和banner直接初始化
    if (this.data.advType == 'banner' || this.data.advType == 'icon') {
      this.refreshAd();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    refreshAd: function() {
     
      mpsdk.Ad.getRecommendInfo(getApp().getScore()).then(ad => {
        this.setData({
          advData: ad
        });
        //上报阿拉丁展示日志
        if (getApp().aldstat) {
          let logTitle = this.data.advType + '广告展示：' +
            this.data.advData.title +
            '(' + this.data.advData.adid + ')';
          getApp().aldstat.sendEvent(logTitle);
        }
      });
    },

    /**
     * 播放视频广告前进行竞价
     */
    _showVideoChange: function(newVal, oldVal, changedPath) {
      if (newVal && this.data.advList.length) {
        this.refreshAd();
        //视频句柄是在首次播放时创建的，当视频被销毁后需要再次调用play
        if (this.videoContext) {
          this.videoContext.play();
        }
      }
    },
    /**
     * 视频广告：更新播放进度
     */
    timeUpdate: function(e) {
      this.setData({
        timeRemain: parseInt(e.detail.duration - e.detail.currentTime),
        timeClose: Math.max(0, parseInt(forceVideoTime - e.detail.currentTime)),
      });
    },

    /**
     * 全屏状态变化
     */
    fullScreenChange: function(e) {
      if (e.detail.fullScreen) { //全屏时隐藏状态栏
        this.videoContext.hideStatusBar && this.videoContext.hideStatusBar();
      } else { //退出全屏时显示状态栏
        this.videoContext.showStatusBar && this.videoContext.showStatusBar();
      }
    },

    /**
     * 当视频开始播放立即进入全屏
     */
    onVideoPlay: function(e) {
      this.videoContext = wx.createVideoContext('adVideo', this);
      this.videoContext.requestFullScreen();
      //开始播放时让用户可以关闭视频，避免视频卡死的情况
      this.setData({
        timeClose: 0
      });
    },

    /**
     * 发生错误时让用户可以手动关闭广告
     */
    onVideoError: function(e) {
      this.setData({
        timeClose: 0
      });
    },

    onWaiting: function(e) {
      console.log(e);
    },

    /**
     * 静音
     */
    tapSound: function(e) {
      this.setData({
        muted: !this.data.muted
      });
    },

    /**
     * 关闭视频广告
     */
    tapClose: function(e) {
      //时间不到不让关闭广告
      if (this.data.timeClose) {
        return;
      }
      this.videoContext.exitFullScreen();
      this.setData({
        showVideo: false
      });
    },

    /**
     * 点击视频广告
     */
    tapVideo: function(e) {
      //关闭视频广告
      this.videoContext && this.videoContext.exitFullScreen && this.videoContext.exitFullScreen();
      this.setData({
        showVideo: false
      });
      this.adClick(e);
    },

    /**
     * 点击图片广告
     */
    tapBanner: function(e) {
      this.adClick(e);
      this.refreshAd();
    },

    /**
     * 点击浮标广告
     */
    tapIcon: function(e) {
      this.adClick(e);
      this.refreshAd();
    },

    /**
     * 广告点击
     */
    adClick: function(e) {
      //发送事件
      this.triggerEvent('click', {
        advInfo: this.data.advData,
        isFirst: mpsdk.Ad.click(this.data.advData)
      });
      let logTitle = this.data.advType + '广告点击：' +
        this.data.advData.title +
        '(' + this.data.advData.adid + ')';
      //上报阿拉丁点击日志
      if (getApp().aldstat) {
        getApp().aldstat.sendEvent(logTitle);
      }
    },
  }
})