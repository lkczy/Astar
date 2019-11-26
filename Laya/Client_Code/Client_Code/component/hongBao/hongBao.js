// component/hongBao/hongBao.js
const mpsdk = require('../../utils/mpsdk.js');
var that
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gameid: {
      type: String,
      value: '', //icononly
    },
    userid: {
      type: Number,
      value: 0
    },
    ShareOrVideo:{
       type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:false,
    rewardShow:false,
    goodsData:{},
    hongbaoNum:getApp().globalData.hongbaonum,
    isShare:getApp().globalData.hongbaoShare,
    goodsList: [],
    page: 0,
    callback:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    playvideo:function(){
      if(this.data.ShareOrVideo==1){
        that.triggerEvent('playvideo','hongBao');
        
      }else{
        log('既不分享也不视频,状态:',this.data.ShareOrVideo)
        wx.showToast({
          title: '暂无视频',
        })
      }
    },
    loadData: function (callback = true) {
      let show = false,
        that = this;
      wx.showLoading({
        title: '加载中...',
      });
      this.setData({
        callback: callback
      })

      mpsdk.ext.PDD.getGoodsList().then(data => {
        
        console.log('代金券', data);
        if (data && data.length > 0) {
          show = true;
          that.setData({
            goodsData: data
          })
          that.setGoodsData();
        } else {
          show = false;
        }

        wx.hideLoading();
        if (show) {
          let dailyHongbao = wx.getStorageSync('dailyHongbao') || {};
          dailyHongbao.openNum++;
          wx.setStorageSync('dailyHongbao', dailyHongbao);
          console.log('成功获取到商品数据', that.data.goodsData);
          that.reportEvent('30006');
        } else {
          if(this.data.callback){
            that.triggerEvent('getpdddataerr');
          }
        }
        that.setData({ show });
      }).catch((e)=>{
        
        console.log('获取商品信息失败',e)
        wx.hideLoading();
        if (this.data.callback) {
        that.triggerEvent('getpdddataerr');
        }
        that.setData({ show: false });
      })

    },
    openReward(shareIf=false){
      console.log('可以打开奖励');
      if(this.data.isShare!=1||shareIf){
        console.log('打开了奖励');
        this.setData({ rewardShow:true});
        // 红包奖励界面显示，表示已经点击了开按钮.
        // this.reportEvent('30008');
      }
    },
    // 保存已经或取过的数据
    saveMake(item){
      let data=wx.getStorageSync('pddMakeGoodsId')||[];
      data.push(item);
      wx.setStorageSync('pddMakeGoodsId',data);
    },
    // 上报事件
    reportEvent(eventid, param1 = null, param2 = null) {
      wx.request({
        url: 'https://xyxcck-log.raink.com.cn/MiniGameLog/log/event.action',
        data: {
          gameid: this.data.gameid,
          eventid: eventid,
          param1: param1,
          param2: param2,
          userid: wx.getStorageSync('PDD_USERID') || wx.getStorageSync('pdduserId')
        },
        header: {
          header: 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        success: function (res) {
          console.log('\\\\\\\\\\\\\拼多多红包事件上报成功:' + eventid);
        },
        fail: function (res) {
          console.log('\\\\\\\\\\\\\拼多多红包事件上报失败:' + eventid);
        },
        complete: function (res) { },
      })
    },
    gotoPddShop(e) {
      console.log('gotoPddShop')
      var item = e.currentTarget.dataset.goods;
      console.log('goodsinfo:' + item);
      this.reportEvent('30011', item.coupon_discount, item.goods_id);
      // this.clearTap(false);
 
      // this.setData({show:false});
    },
    clearTap(t = true) {
      
      this.setData({ show: false });
      // 关闭红包弹窗
      if (t) {
        this.reportEvent('30007');
      }

      this.setData({ rewardShow: false });
      if (this.data.callback) {
      this.triggerEvent('getpdddataerr');
      }else{
        mpsdk.Report.reportEvent(202)
      }
    },
    clearTap2() {
      this.setData({ show: false });
      var goodsIdList = '';
      if (that.data.goodsData && that.data.goodsData.length > 0) {
        for (var i = 0; i < that.data.goodsData.length; i++) {
          if (i == 0) {
            goodsIdList = that.data.goodsData[i].goods_id
          } else {
            goodsIdList += '_' + that.data.goodsData[i].goods_id;
          }
        }
      }
      this.reportEvent('30012', null, goodsIdList);
      this.setData({ rewardShow: false });
      if (this.data.callback) {
      this.triggerEvent('getpdddataerr');
      }else{
        mpsdk.Report.reportEvent(202)
      }
    },
    // 红包显示判断
    hongbaoShowJude(){
      let dailyHongbao = wx.getStorageSync('dailyHongbao')||{};
      if (dailyHongbao && dailyHongbao.date && dailyHongbao.date == Math.floor(+new Date() / (24 * 60 * 60 * 1000)) &&  dailyHongbao.num && dailyHongbao.openNum<getApp().globalData.hongbaonum) {
        dailyHongbao.num++;
        wx.setStorageSync('dailyHongbao', dailyHongbao);
        if (dailyHongbao.num%getApp().globalData.hongbaofresh==0){
          // 可以显示了
          // this.hongBao.loadData();
          console.log('+++++++++++++++显示红包+++++++++++++++');
          return true;
          
        }else{
          // this.tongGuanShowFn();
          return false;
        }
      } else if ( !dailyHongbao.date || dailyHongbao.date != Math.floor(+new Date() / (24 * 60 * 60 * 1000))){
        dailyHongbao.date = Math.floor(+new Date() / (24 * 60 * 60 * 1000));
        dailyHongbao.openNum = 0;
        dailyHongbao.num=1;
        wx.setStorageSync('dailyHongbao', dailyHongbao);
        
        // this.tongGuanShowFn();
        return false;

      } else if (!dailyHongbao.openNum || dailyHongbao.openNum >=3){
        // this.tongGuanShowFn();
        return false;
      }
    },
    //设置每页商品数据
    setGoodsData() {
      
      console.log(that)
      var page = that.data.page * 3;
      var n = 0;
      for (var i = page; i < page + 3; i++) {
        that.data.goodsList[n] = that.data.goodsData[i];
        n++;
      }
      that.setData({
        goodsList: that.data.goodsList
      })
    },
    //切换商品
    changePage() {
      var page = that.data.page;
      if (page < 3) {
        page++
      } else {
        page = 0
      }
      that.setData({
        page: page
      })
      that.setGoodsData();

      var goodsIdList = '';
      if (that.data.goodsData && that.data.goodsData.length > 0) {
        for (var i = 0; i < that.data.goodsData.length; i++) {
          if (i == 0) {
            goodsIdList = that.data.goodsData[i].goods_id
          } else {
            goodsIdList += '_' + that.data.goodsData[i].goods_id;
          }
        }
      }
      this.reportEvent('30013', null, goodsIdList);
    },
    //赌轮盘算法
    randomCoupon() {

    }
  },
  
  lifetimes: {
    attached() {
      that = this;
      // console.log('红包界面');
      // this.loadData();
      console.log("isShare", getApp().globalData.hongbaoShare)
      setTimeout(()=>{
        that.setData({
          isShare: getApp().globalData.hongbaoShare
        })
      },1000)
   
      wx.setStorageSync('PDD_GAME_ID', this.properties.gameid)


     
    }
  },

  attached() {
    // console.log('红包界面');
    // this.loadData();
  }
})
