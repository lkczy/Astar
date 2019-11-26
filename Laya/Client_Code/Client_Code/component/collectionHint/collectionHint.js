// component/collectionHint/collectionHint.js
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
    show:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    collectionTap(){
      this.setData({ show: true});
    },
    cancelTap(){
      this.setData({ show: false });
    }
  }
})
