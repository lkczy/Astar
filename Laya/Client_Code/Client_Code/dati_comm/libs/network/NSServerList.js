import * as XML from '../xmldom/dom-parser'
import * as gamecfg from "../../../gamecfg"

class NSServerList {
  constructor() {
    this._ExistError = false
    this._ExistList = false
  }


  //检查服务列表是否存在
  get ExistList() {
    return this._ExistList
  }

  get ExistError() {
    return this._ExistError
  }

  ReLoad() {
    this._ExistError = false
    this._ExistList = false
    this._RetryCount = 0
    this._ReLoad()
  }

  _ReLoad() {
    console.log("======================重新装载服务器列表======================")
    wx.request({

      // url: gamecfg.ServerListUrl,
      url: 'https://xcx-cycck-list.raink.com.cn/Config1_0_0.xml',
      data: {
        _: (new Date()).getTime()　 //加个随机参数
      },
      method: 'get',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        this.OnLoadServerListSuccess(res.data);
      },
      fail: () => {
        if (this._RetryCount++ < 3) {
          this._ReLoad()
        } else {
          this._ExistError = true
          console.log("======================服务器列表装载错误!======================")
        }
      }
    })
  }

  get JumpQMCG() {
    var info = this.Func["JumpQMCG"]
    if (!info) {
      return {
        v: false
      } //隐藏
    } else {
      return {
        v: true,
        appId: info.getAttribute('appId'),
        path: info.getAttribute('path'),
        Quanzhong: info.getAttribute('Quanzhong'),
        Picture: info.getAttribute('Picture')
      } //隐藏
    }
  }

  // get JumpQMCGtwo() {
  //   var info = this.Func["JumpQMCGtwo"]
  //   if (!info) {
  //     return { v: false }//隐藏
  //   } else {
  //     return {
  //       v: true,
  //       appId: info.getAttribute('appId'),
  //       path: info.getAttribute('path'),
  //       Quanzhong: info.getAttribute('Quanzhong'),
  //       Picture: info.getAttribute('Picture')
  //     }//隐藏
  //   }
  // }
  OnLoadServerListSuccess(xmldata) {
    this._ExistList = true
    console.log("======================获取服务器列表成功======================")
    this.AccountSvrList = [];
    this.WorldSvrList = [];
    this.GameSvrList = [];
    this.ArticleSvrList = [];

    let xmlParser = new XML.DOMParser();
    console.log('xmlParser:', xmlParser)
    let xmlDoc = xmlParser.parseFromString(xmldata);

    let gameSvrEl = xmlDoc.getElementsByTagName('GameServer')[0];
    if (gameSvrEl == null) //错误的配置
    {
      console.log("======================错误的配置======================")
      return
    }

    //let onlineEl = xmlDoc.getElementsByTagName('Online')[0];
    //this.Online = onlineEl.getAttribute('v');
    //this.XOnline = onlineEl.getAttribute('x');

    this.Func = {}
    let noticeEl = xmlDoc.getElementsByTagName('Notice')[0];
    this.Notice = noticeEl.getAttribute('txt');

    let funcEl = xmlDoc.getElementsByTagName('Func')[0];
    var funcs = funcEl.getElementsByTagName('a');
    for (let i = 0; i < funcs.length; i++) {
      var info = funcs[i]
      this.Func[info.getAttribute('name')] = info
    }



    // let accountSvrEl = xmlDoc.getElementsByTagName('AccountServer')[0];
    //let worldSvrEl = xmlDoc.getElementsByTagName('WorldServer')[0];
    // let gameSvrEl = xmlDoc.getElementsByTagName('GameServer')[0];

    // let Funcl = xmlDoc.getElementsByTagName('Func')[0];

    // console.log("Funcl" + Funcl)
    let articleSvrEl = xmlDoc.getElementsByTagName('ArticleServer')[0];
    /*
            let accSvrs = accountSvrEl.getElementsByTagName('a');
            for (let i = 0; i < accSvrs.length; i++) {
                var info = accSvrs[i]
                this.AccountSvrList.push(
                    {
                        url: info.getAttribute('url')
                    }
                )
        }*/
    /*
            let worldSvrs = worldSvrEl.getElementsByTagName('a');
            for (let i = 0; i < worldSvrs.length; i++) {
                let info = worldSvrs[i];
                this.WorldSvrList.push(
                    {
                        url: info.getAttribute('url'),
                        id: info.getAttribute('id')
                    }
                )
            }*/

    let gameSvrs = gameSvrEl.getElementsByTagName('a');
    for (let i = 0; i < gameSvrs.length; i++) {
      var info = gameSvrs[i];
      this.GameSvrList.push({
        url: info.getAttribute('url'),
        id: info.getAttribute('id')
      })
    } //end for  

    let articleSvrs = articleSvrEl.getElementsByTagName('a');
    for (let i = 0; i < articleSvrs.length; i++) {
      var info = articleSvrs[i];
      this.ArticleSvrList.push({
        url: info.getAttribute('url')
      })
    } //end for  

    //列表打乱顺序
    //this._UpseArray(this.WorldSvrList);
    //this._UpseArray(this.GameSvrList);
    //this._UpseArray(this.AccountSvrList);
    this._UpseArray(this.ArticleSvrList);
    //console.log("JumpQMCG",this.JumpQMCG)
  }


  //打乱数组
  _UpseArray(a) {
    let rlen = a.length - 1;
    for (let i = 0; i < a.length; i++) {
      let ii = this._RandomNum(0, rlen);
      let z = a[i];
      a[i] = a[ii];
      a[ii] = z;
    }
  }


  //获取随机数 [Min,Max]
  _RandomNum(Min, Max) {
    let Range = Max - Min;
    let Rand = Math.random();
    return Min + Math.round(Rand * Range);
  }
}

let instance = new NSServerList()
export {
  instance as ServerList
}