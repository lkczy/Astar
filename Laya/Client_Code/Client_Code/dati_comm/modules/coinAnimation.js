
/*************************************** */
class CoinAnima{
  constructor(fp, tp, self, i,res){
    this.i = i;
    this.res=res;
    this.fp=fp;
    this.tp=tp;
    this.self=self;

    this.move()
    return this;
  }
  //创建动画
  createAni(option){
    let param = {
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: option.ease,
      delay: 0
    }
    var animation = wx.createAnimation(param);

    return animation
  }
  //获取坐标
  getPos(id) {
    let option = {
      left: 0,
      top: 0
    }
    let promise = new Promise((resolve, err) => {
      wx.createSelectorQuery().select(id).boundingClientRect(function (rect) {
        if (rect) {
          option.left = rect.left;
          option.top = rect.top;
          resolve(option)
        }
        else {
          err(false)
        }

      }).exec()
    })
    return promise
  }
  //开始动画
  move(){
    Promise.all([this.getPos(this.fp), this.getPos(this.tp)]).then(res=>{
      console.log(res)
      // console.log('tp->',res[1])
      // console.log('fp->', res[0])
      let endP={
        endLeft:res[0].left,
        endTop:res[0].top,
        // fromLeft: res[1].left,//起始位置
        // fromTop: res[1].top,//起始位置
        fromLeft: this.res.left,
        fromTop: this.res.top
      }
      let points = this.createMovePoint();
     
      points=Object.assign(points,endP);
      console.log('-->',points)
      let endA = this.createAni(points)

      this.self.setData({
        ['anbox.ax_' + this.i]: endA.left(this.res.left).top(this.res.top).step().opacity(1).step({ duration:1}).export()
      })

      setTimeout(()=>{
        this.self.setData({
          ['anbox.ax_' + this.i]: endA
            .left(points.left)
            .top(points.top)
            .rotateY(180)
            .scale(1.2)
            .step()
            .left(points.endLeft)
            .top(points.endTop)
            .rotateY(0)
            .scale(1)
            .step().export()
        })
      },1000)

    

      setTimeout(()=>{
        this.self.setData({
          ['anbox.ax_' + this.i]: endA.opacity(0).step().export(),
        })    
      },2000)
      setTimeout(() => {
        this.self.setData({
          ['anbox.ax_' + this.i]: endA.left(res[1].left).top(res[1].top).step().export(),

        })
      }, 3000)

    }).catch(err=>{
      console.log(err)
    })



   
  }
  //创建随机数点
  createMovePoint(){
    /*
    linear	动画从头到尾的速度是相同的
    ease	动画以低速开始，然后加快，在结束前变慢
    ease-in	动画以低速开始
    ease-in-out	动画以低速开始和结束
    ease-out	动画以低速结束
    step-start	动画第一帧就跳至结束状态直到结束
    step-end	动画一直保持开始状态，最后一帧跳到结束状态
    */
    let ease = ['linear', 'ease', 'ease-in', 'ease-in-out', 'ease-out']
    let left = Math.floor(Math.random() * (300 - 30) + 30)
    let top = Math.floor(Math.random() * (350 - 10) + 10)

    
    return {
      ease: ease[this.createRandom([0, ease.length])],
      left: left,
      top: top
    }

    
  }
  createRandom(arr=[max,min]){
  
    return Math.floor(Math.random() * (arr[0] - arr[1]) + arr[1])
    
  }

}
//金币动画
function upCoinPos(seleClass,index,that)
{
  //设置金币数量
  let coinNum=[
    15,25,35,45
  ]
  that.setData({
    ['data.arr']:new Array(coinNum[index])
  })
  wx.createSelectorQuery().selectAll(seleClass).boundingClientRect(function (rect) {
    if(rect.length)
    {

      let res = { left: rect[index].left, top: rect[index].top }
      for (let i = 0; i < coinNum[index]; i++) {
        var a = new CoinAnima('#coin_img', '#coin_f_' + i, that, i, res)
      }
    }
    else
    {

    }
  }).exec()

}

export default upCoinPos
