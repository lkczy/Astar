// pages/comm/waite-img/waite-img.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width:{
      type: Number,
      value: 249,
      observer: function (newVal, oldVal) {
        this.setData({
          width:newVal
        })
      }
    },
    height: {
      type: Number,
      value: 94,
      observer: function (newVal, oldVal) {
        this.setData({
          height: newVal
        })
      }
    },
    srcArr: {
      type: Array,
      value:[],
      observer: function (newVal, oldVal) {
        this.setData({
          srcArr: newVal
        })
      }
    },
    time:{
      type: Number,
      value: 400,
      observer: function (newVal, oldVal) {
        this.setData({
          time: newVal
        })
      }
    },
    show:{
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal) {
        console.log('show')
        this.setData({
          show: newVal
        })
        this.stop()
     
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    width:249,
    height:94,
    srcArr:[],
    time: 400,
    show:true
  },
  ready:function(){
    this.setData({
      src:this.data.srcArr[0]
    })
   // this.changeImg()()
    console.log(this.data)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    stop:function(){
      clearInterval(this.timmer);
      this.times=0;
    },
    changeImg:function(){
      this.timmer = null;
      this.times = 0;
    
      return () => {
        let len = this.data.srcArr.length;
        if (!len) return

        this.timmer = setInterval(() => {
          if (this.times > this.data.srcArr.length) {
            //this.times = 0;
          } 
          this.setData({
            src: this.data.srcArr[this.times % len]
          })
          console.log(this.times % len)
          this.times++;

        }, this.data.time)
      }
    }
  }
})
