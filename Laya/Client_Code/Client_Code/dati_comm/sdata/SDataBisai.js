import { jscsv } from "./jscsv"
import * as Res from "../../sdata/res/Bisai"

class SDataBisai extends jscsv {
  constructor() {
    super(Res.data)

/*
 ZiyouTiaozhan = 1,//自由挑战  
    ZiyouBisai = 2,//自由赛 
    Jingbiao = 3,//锦标赛
    ZiyouBisai3 = 4,//3v3自由赛 
    Cuangguan = 5,//闯关模式
    Zonghe1v1 = 6,//1v1综合话题  
    Fenlei1v1 = 7,//1v1分类话题
    Yaoqing1v1 = 8,//1v1邀请好友
 */
//"ID","BisaiType","SubBisaiType","Menpiao","RightMoney","LianduiMoney","Win","WinGold","Lose"
    
    this.Foreach(
      (id,row)=>{
        var tp = row[this.I_BisaiType]
        switch(tp) 
        {
          case 6://1v1综合
            this.Zonghe1v1 = row
            break
          case 7://1v1分类
            this.Fenlei1v1 = row
            break;
          case 5://闯关
            this.Chuangguan = row
            break;
        }
      }
    ) 
  }
}

//SDataBisai.Chuangguan[SDataBisai.I_ZhangGold]

let _SDataBisai = new SDataBisai()
module.exports = { SDataBisai: _SDataBisai }