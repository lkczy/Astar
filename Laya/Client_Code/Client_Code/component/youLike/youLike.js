// component/youLike/youLike.js
let util = require('../../utils/util.js');
let mpsdk = require('../../utils/mpsdk.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    suggestList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadData: function () {
      // let original = this.data.listType == 'detail';
      // let count = original ? 0 : this.data.iconCount;
      let that = this;
      
      mpsdk.Ad.getSuggestList(false, 4, getApp().getScore()).then(suggestList => {
        console.log('推荐列表', suggestList);
        that.setData({
          suggestList: suggestList
        });
        
      });
    },
    adClick: function (e) {
        console.log(e.currentTarget.dataset.item);
        this.data.advData = e.currentTarget.dataset.item;

      mpsdk.Ad.click(e.currentTarget.dataset.item)

        let logTitle = this.data.advType + '广告点击：' +
          this.data.advData.title +
          '(' + this.data.advData.adid + ')';
        //上报阿拉丁点击日志
        if (getApp().aldstat) {
          getApp().aldstat.sendEvent(logTitle);
        }
      },
  },
  ready(){
    this.loadData();
  }
})
