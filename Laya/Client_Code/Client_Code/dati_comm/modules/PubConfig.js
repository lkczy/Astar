import * as XML from '../libs/xmldom/dom-parser'
import * as gamecfg from "../../gamecfg"

class PubConfig {
    constructor() {
        this._ExistError = false
        this._ExistList = false
    }


    //检查服务列表是否存在
    get ExistList() { return this._ExistList }

    get ExistError() { return this._ExistError }

    ReLoad()
    {
        this._ExistError = false
        this._ExistList = false
        this._RetryCount = 0    
        this._ReLoad()    
    }

    _ReLoad()
    {
        console.log("======================重新装载公共配置======================")
        wx.request({
          url: gamecfg.PubConfigUrl,
            data: {
                _: (new Date()).getTime() 　//加个随机参数
            },
            method: 'get',
            header: {'Content-Type': 'application/json'},
            success: (res) => { 
                this.OnLoadSuccess(res.data);
            },
            fail: () => {
                if(this._RetryCount++<3)
                {
                    this._ReLoad()
                }else
                { 
                    this._ExistError = true
                    console.log("======================公共配置装载错误!======================")
                }
            }
        })
    }
  
    OnLoadSuccess(xmldata) {
        this._ExistList = true
        console.log("======================获取公共配置成功======================") 

        let xmlParser = new XML.DOMParser();
        let xmlDoc = xmlParser.parseFromString(xmldata);
 
        /*
        this.Func = {}
       
        let funcEl = xmlDoc.getElementsByTagName('Func')[0];
        var funcs = funcEl.getElementsByTagName('a');
        for (let i = 0; i < funcs.length; i++) {
            var info = funcs[i] 
            this.Func[info.getAttribute('name')] = info
        }*/

        var adList = xmlDoc.getElementsByTagName('AD')
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaa", adList[0])
        if(adList&&adList.length>0) this.AD = adList[0];



        //this.Func["JumpApps"]

        //列表打乱顺序 
        //this._UpseArray(this.ArticleSvrList);
        //console.log("JumpQMCG",this.JumpQMCG)
    }

/*
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
*/
}

let instance = new PubConfig()
export { instance as PubConfig }
