// components/safeimg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    IsAspectFit: {
      type: Boolean,
      value:false,
    },  
    src:{
      type: String,
      value: '',
    },
    width: {
      type: String,
      value: '',
    },
    height: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    retryNum:0,
  },



  /**
   * 组件的方法列表
   */
  methods: {
    OnLoad:function(e){
      this.data.retryNum = 0
      console.log("OnLoad",e)
    },
    OnError: function (e) {
      this.data.retryNum++
      if(this.data.retryNum<100)
      { 
        var a =e.detail.errMsg.split(' ') 
        var url = a[1] 
        
        this.setData({src:''})
        this.setData({src:url})
      }
    }
    /*,
    Load:function(){
       this.data.retryNum = 0
       this.setData({ src: '' })
       this.setData({ src: this.properties.src })
       this.setData({ IsAspectFit: this.properties.IsAspectFit })
    }*/
  }
})
 