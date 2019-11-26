const mpsdk = require('../../utils/mpsdk.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gameId: String,
    gamePath: String,
    listType: {
      type: String,
      value: 'detail', //icononly
    },
    iconCount: {
      type: Number,
      value: 4,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    suggestList: [],
    setTimeId: null

  },

  /**
   * 组件生命周期函数，在组件实例进入页面节点树时执行
   */
  ready: function() {
    this.loadData()
  },

  /**
   * 组件的方法列表
   */
  methods: {

    loadData:function(){

      // console.log('请求猜你喜欢的时候',wx.getStorageSync('clickSuggestTime') , Math.floor(+new Date() / (24 * 60 * 60 * 1000)));
      // if (wx.getStorageSync('clickSuggestTime')!=Math.floor(+new Date()/(24*60*60*1000))){

      //   wx.setStorageSync('suggestClickList',[]);
      //   console.log('归零',wx.getStorageSync('suggestClickList'));
      // }
      let original = this.data.listType == 'detail';
      let count = original ? 0 : this.data.iconCount;

      mpsdk.Env.gameId = mpsdk.Env.gameId || this.data.gameId;
      mpsdk.Env.gamePath = mpsdk.Env.gamePath || this.data.gamePath;
      //参数检查
      if (!mpsdk.Env.gameId || !mpsdk.Env.gamePath) {
        console.error('game-id 或 game-path参数不正确');
        return;
      }
      mpsdk.Ad.loadAdData();
     
      mpsdk.Ad.getSuggestList(original, count, getApp().getScore()).then(suggestList => {
        // let suggestClickList = wx.getStorageSync('suggestClickList') || [];
        let suggestClickList = wx.getStorageSync('firstgivegold') || [];
        // let suggestList =
        for (let i = 0; i < suggestClickList.length; i++) {
          for (let j = 0; j < suggestList.length; j++) {
            if (suggestClickList[i] == suggestList[j].aid) {
              suggestList[j].clickeds = true;
              break;
            }
          }
        }
        console.log('++++++++++++++++++++++++++++++++出来的：', suggestList);
        this.setData({
          suggestList: suggestList
        });
        //上报阿拉丁展示日志
        if (getApp().aldstat) {
          for (let appItem of this.data.suggestList) {
            let logTitle = '推荐列表展示' + appItem.title + '(' + appItem.adid + ')';
            if (getApp().aldstat) {
              getApp().aldstat.sendEvent(logTitle);
            }
          }
        }
      });
    },

    tapApp: function(e) {
      let idx = parseInt(e.currentTarget.dataset.idx);
      let appItem = this.data.suggestList[idx];
      let that=this;
      // clearTimeout(this.data.setTimeId);
      // if (wx.getSystemInfoSync().version > '6.7.2') {
      //   this.data.setTimeId = setTimeout(function () {
      //     that.replaceDataOnPath(['suggestList', idx, 'clicked'], true);
      //     that.applyDataUpdates();
      //     that.addSuggestUpdate(appItem, idx);
      //   }, 10000);
      // } else {
      //   that.replaceDataOnPath(['suggestList', idx, 'clicked'], true);
      //   that.applyDataUpdates();
      //   that.addSuggestUpdate(appItem, idx);
      // }

      mpsdk.Ad.click(appItem, 80, true).then((res) => {

        // this.triggerEvent('click', {
        //   isFirst: res,
        //   appInfo: appItem,
        // });

        console.log('改变状态')
        wx.setStorageSync('Jumptime', new Date().getTime())
        wx.setStorageSync('gout', true)
        wx.setStorageSync('JumpAppisFirst', res)
        wx.setStorageSync('appItem', appItem)


        //上报阿拉丁日志
        let logTitle = '推荐列表点击' + appItem.title + '(' + appItem.adid + ')';
        if (getApp().aldstat) {
          getApp().aldstat.sendEvent(logTitle);
        }

      });

    },
    // 添加标识
    addSuggestUpdate(appItem, idx){
      let that=this;
      if (!appItem.clickeds) {
        let suggestClickList = wx.getStorageSync('suggestClickList') || [];
        suggestClickList.push(appItem.adid);
        wx.setStorageSync('suggestClickList', suggestClickList);
        let suggestList = that.data.suggestList;
        suggestList[idx].clickeds = true;
        that.setData({ suggestList });
        wx.setStorage({key:'clickSuggestTime', data:Math.floor(+new Date()/(24*60*60*1000))});
      }
    }
  }
})