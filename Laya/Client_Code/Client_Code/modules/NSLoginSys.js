import * as XML from '../dati_comm/libs/xmldom/dom-parser'
import {UIEvent} from '../dati_comm/libs/network/UIEvent';
import {NSSocket} from "../dati_comm/libs/network/NSSocket";
import { WorldConn } from "../dati_comm/libs/network/Conns";
import { ServerList } from "../dati_comm/libs/network/NSServerList";
//import { PubConfig } from "../dati_comm/modules/PubConfig";
import { txt } from "../dati_comm/sdata/SDataID2"
import * as gcfg from "../gamecfg"
import { GameConn } from "./GConn"


let retryCount = 0
let retryTimer
let timer = null

class NSLoginSys {
    constructor() {
        this.OnLoginSuccess = new UIEvent(); //登录成功事件
        this.OnLoginFail = new UIEvent(); //登录失败事件
        this.OnStep = new UIEvent(); //步进，主要用于调试
        this._Step = 0; //登录步骤 


        GameConn.onConn.On(this,this.OnGameConn)
        GameConn.onClose.On(this, this.OnGameClose)
    }

    //链接游戏服失败
    OnGameClose() {
      if (this.connGameStep == this._Step) return
      this._PostErrorMsg("链接服务器失败！");
    }

    //成功连上了游戏服
    OnGameConn()
    {
        this._NextStep("OnGameConn")

        console.log("请求登录 "+this.wxData.code)
        this.connGameStep = this._Step
        GameConn.Route = 1//恢复默认路由
        let loader = GameConn.CreateLoader(
            {
                n: 'ck',
                tp: 'wxg',
                wxg: {
                    c: this.wxData.code,
                    ed: this.wxData.encryptedData,
                    iv: this.wxData.iv
                }
            }
        );

        //loader.OnComplete.On(this, this.OnAccCheckOK);
        //loader.OnError.On(this, this.OnAccCheckError);

        loader.OnComplete.On(this, this.OnLoginCheckOK);
        loader.OnError.On(this, this.OnLoginCheckError);
    }

    //开始登陆
    Begin(wxData) {

        //if (this._Step !== 0) return; //正在登陆中
        if(timer) {
            clearTimeout(timer)
            timer = null
        }
        this._Step = 0

        this.wxData = wxData;

        this._NextStep('Begin');

        //this.WaitPubConfig()
        this.WaitServerList()
    }

    WaitServerList()
    {
        timer = setTimeout(
            ()=>{
              console.log("WaitServerList Begin")
                if(ServerList.ExistError)
                {
                    this._PostErrorMsg("获取网关地址失败！");
                }else if(ServerList._ExistList)
                {
                    this.LoadServerListOK()
                }else
                    this.WaitServerList()
                console.log("WaitServerList End")
            },
            50
        )
    } 
    WaitPubConfig()
    {
      timer = setTimeout(
        () => {
          console.log("WaitPubConfig Begin")
          if (PubConfig.ExistError) {
            this._PostErrorMsg("获取配置信息失败！");
          } else if (PubConfig._ExistList) {
            //this.LoadServerListOK()
            //等待服务器列表加载成功
            this.WaitServerList()
          } else
            this.WaitPubConfig()
          console.log("WaitPubConfig End")
        },
        50
      )
    }
 
    LoadServerListOK()
    { 
        this._RequestCK() 
    }

    

    _RequestCK()
    { 
        this._NextStep("_RequestCK")
        retryCount = 0 
        var hashCode = this.wxData.userInfo.nickName.hash()

        if (ServerList.GameSvrList.length > 0) {
          var gsInfo = ServerList.GameSvrList[hashCode % ServerList.GameSvrList.length]
          this.SeldGameSvrInfo = gsInfo

          console.log("gameurl", gsInfo.url)

          GameConn.Conn(gsInfo.url)
        } else {
          console.log("不存在有效的服务器！")
          this._PostErrorMsg("获取游戏服务器地址失败！");
        }
 
    }
 
 


    _NextStep(msg) {
        this._Step++;
        this.OnStep.Emit(msg);
    }
 
 /*
    OnAccCheckOK(data) {
        clearTimeout(retryTimer)

        this._NextStep('OnAccCheckOK');
        if (data.r !== 0) {
            this._PostErrorMsg("账号或密码错误！");
            return
        }

        this._LoginConnStep = this._Step;

        this.aconn.Close();

        this.loginConn = new NSSocket(); //登录游戏服务器用的连接

        this.loginConn.onConn.On(this, () => this.OnLoginConn(data.tk, Number(data.rid)));
        this.loginConn.onClose.On(this, this.OnLoginClose);

        var gsInfo
        for (var i = 0; i < ServerList.GameSvrList.length;i++)
        {
          gsInfo = ServerList.GameSvrList[i]
          if (gsInfo.id == data.fq) break
        }
        

        this.SeldGameSvrInfo = gsInfo
        console.log("gameurl", gsInfo.url, "zone", data.fq)
        this.loginConn.Conn(gsInfo.url);
}*/
/*
    OnLoginClose() {
        if (this._LoginConnStep === this._Step) {
            this._PostErrorMsg("与游戏登录服务器断开连接！");
        }
    }
*/
/*
    _RequestLG(token, sid)
    {
        let nm = {n: "lg", t: token, rid: sid};
        let loader = this.loginConn.Request(nm, 1); //向游戏服的登录节点请求验证
        loader.OnComplete.On(this, this.OnLoginCheckOK);
        loader.OnError.On(this, this.OnLoginCheckError);
}*/
/*
    OnLoginConn(token, sid) {
        this._NextStep("OnLoginConn");

        retryCount = 0
        this.TrackLG(token, sid)
    }
    */
/*
    TrackLG(token, sid)
    {
        this._RequestLG(token, sid) 
}*/

    OnLoginCheckOK(data) {
        this._NextStep("OnLoginCheckOK");
        clearTimeout(retryTimer)
        if (data.r !== 0 ) {//&& data.r !== 2
            this._PostErrorMsg("登录失败");
            return
        }

        //清理事件
        //this.loginConn.onConn.Clear()
        //this.loginConn.onClose.Clear()

        
        //this.loginConn.Close();
        this.OnLoginSuccess.Emit({
            pubkey: data.k, //用户在服务器上的会话标识
            logicSid: data.lgsid, //逻辑服id
            //fighting: (data.r === 2), //当前是否处于战斗状态
            url: this.SeldGameSvrInfo.url, //服务器的地址 
            //loginConn:this.loginConn
        });
        this._Step = 0;
    }

    OnLoginCheckError() {
        //this.loginConn.Close();
        GameConn.Close()
        this._PostErrorMsg("账户验证超时！");
    }

/*
    OnAccCheckError() {
        this.aconn.Close();
        this._PostErrorMsg("连接账号服失败！");
}*/

    _PostErrorMsg(msg) {
        this._NextStep("_PostErrorMsg");
        let step = this._Step;
        this._Step = 0;
        this.OnLoginFail.Emit({step: step, msg: msg});
    }

   


}

let loginSysInstance = new NSLoginSys();

export {loginSysInstance as NSLoginSys};
 