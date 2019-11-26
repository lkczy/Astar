// component/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cancelText: {
      type: String,
      value: '取消',//image/normal
    },
    confirmText: {
      type: String,
      value: '确定'
    },
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    cancelShow: {
      type: String,
      value: 'show'
    },
    confirmShow: {
      type: String,
      value: 'show'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dialogShow:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancelTap(){
      this.triggerEvent('cancel', {});
    },
    confirmTap(){
      this.triggerEvent('confirm', {});
    }
  }
})
