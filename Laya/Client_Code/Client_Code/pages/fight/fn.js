
export default class Guessing
{
  constructor(options){
   let param={}
   param = Object.assign(param,options)
   //获取当前关卡
   this.cur_turn_level = param.cur_turn_level;
   //获取成语
   this.ALL_IDIOMS = param.ALL_IDIOMS;
   //当前要猜的成语
   this.currentGussint = this.ALL_IDIOMS[this.cur_turn_level-1];
   //正确答案下标数组
   this.Da_An_Index_Arr = [];
   this.getTenChenYu(this.cur_turn_level )
    
  }
  //获取当前关卡数后的10个成语
  getTenChenYu(leve){
    let tenCY = this.ALL_IDIOMS.slice(leve - 1, 10 + leve - 1).join(''); 
    //获取随机数
    let arr = this.getRandomArr(tenCY.length-1);
    // arr = this.getRandomArr(tenCY.length - 1); 
    //获取随机答案列表
    let Da_An_Arr=[];
    arr.forEach((item,index)=>{
      Da_An_Arr.push(tenCY[item])
    })
    //获取随机答案
    this.random_da_an = this.getDaAn(Da_An_Arr)
  

    this.currentGussint.split('').forEach((item, index)=>{
      this.Da_An_Index_Arr.push(this.random_da_an.indexOf(item))
    })
    
    this.random_da_an.push(''); 

  }
  //获取随机0-40的数
  getRandom(num){
    var r = Math.random() * (num);
    var re = Math.round(r);
    re = Math.max(Math.min(re, num), 0)
    return re;
  }
  getRandomArr(n){
    let arr=[];
    let flag=true
    while (flag)
    {
      let num = this.getRandom(n);
      if (!arr.includes(num))
      {
        arr.push(num);
        if(arr.length==n+1)
        {
          flag=false;
        }
        
      }
     
    }
    
    return arr
  }
  //获取32个答案
  getDaAn(daan){
    let flag=true;
    let Arr=[];
    for(let i=0;i<16;i++)
    {
      let item = daan.shift();
     
      if (this.currentGussint.includes(item)) { 
        daan.push(item);
        i--
      }
    }
    let random = this.getRandomArr(32);
    random.forEach((item, index) => {
      
      Arr.push(daan[item])
    })
    // Arr.forEach((item,index)=>{
    //   if (!this.Da_An_Index_Arr.includes(item) && this.currentGussint.includes(item)) {
    //     this.Da_An_Index_Arr.push(index)
    //   }
    // })
    daan.sort(function () {
      return (0.5 - Math.random());
    })
  

    return daan
  }
  //获取答案提示下标
  tipDaAn(da){
   
    for (let i = 0; i < this.random_da_an.length;i++){
      if (this.random_da_an[i]==da)
      {
        return i
      }
    }

  }
  //修正答案下标
  updateDAANIndex(){
   let flag=true;
   let index=0;
   let index_1=0;
   let Arr=[];
   let indexArr = this.Da_An_Index_Arr
   while(flag){
     let yushu = index % 4
     if (this.currentGussint[index_1] == this.random_da_an[indexArr[yushu]]){
       Arr.push(indexArr[yushu])
       index_1++
       if (index_1 == indexArr.length) {
         flag = false;
       }
     }
     
     
     index++
   }
   return Arr
  }
}