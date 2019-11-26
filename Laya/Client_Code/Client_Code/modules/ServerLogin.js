import {wxAccount} from '../dati_comm/libs/network/wxAccount';
import {NSLoginSys} from './NSLoginSys';
import { WorldConn} from "../dati_comm/libs/network/Conns";
import {GameConn} from "./GConn";

import {OOSyncClient} from "../dati_comm/libs/oosync/OOSyncClient"
import * as AudioPool from "../dati_comm/libs/core/AudioPool"
import {Player} from "./Player" 
import {FightRoom} from '../dati_comm/modules/FightRoom.js'
import {loginLoading} from "../dati_comm/libs/network/loginLoading";
import {txt} from "../dati_comm/sdata/SDataID2" 
import { ServerList } from "../dati_comm/libs/network/NSServerList";
//import { PubConfig } from "../dati_comm/modules/PubConfig";
import * as LCData from "./LocalData"

let loginTimeout = null
let longin_silent = true//采用静默模式登录



class serverLogin {
    constructor() {
        NSLoginSys.OnLoginSuccess.On(this, this._onNSLoginSuccess);
        NSLoginSys.OnLoginFail.On(this, this._onNSLoginFail);
        NSLoginSys.OnStep.On(this, this._onNSStep);

        // 用户信息更新事件
        wxAccount.getUserInfoSucceededEvent.On(this, (info) => {
            
            var wxData = {
                code: wxAccount.code,
                encryptedData: info.encryptedData,
                iv: info.iv,
                userInfo:JSON.parse( info.rawData)
            };

            //保存用户头像和昵称
            LCData.Set(LCData.ParamName.NICK_NAME, wxData.userInfo.nickName) 
            LCData.Set(LCData.ParamName.AVATOR_URL, wxData.userInfo.avatarUrl) 
            
            console.log("serverLogin.getUserInfoSucceededEventOn");
            //开始登陆NS系统
            NSLoginSys.Begin(wxData);
        });

        wxAccount.loginToWxFailedEvent.On(this, () => {

            console.log(`loginToWxFailedEvent`);
           /* if(!this.GoHome())
            {
                //if(!longin_silent)
                //getApp().globalData.ServerLogin._showLoginBox();
        }*/
        });

        wxAccount.getUserInfoFailedEvent.On(this, () => {
            console.log(`getUserInfoFailedEvent`);
            /*if(!this.GoHome())
            {
                //if(!longin_silent)
                //getApp().globalData.ServerLogin._showLoginBox();
            }*/
        });

        wxAccount.authorizeEvent.On(this,()=>{
            console.log(`authorizeEvent stop timer`);
            if(loginTimeout) {clearTimeout(loginTimeout);loginTimeout=null}
        })


        //自动重新登录
        /*
        setInterval(()=>{
            if(!getApp().globalData.LoginOK)
            {
                console.log("-----------------重新登录----------------")
                this._reLogin()
            }        
        },15000)
        */
        /*
        //自动上传数据
        setInterval(()=>{
             LCData.AutoUploadParams()        
        },5000)
        */
    }

  
    GoHome()
    {
        //进入单机模式必要的信息
        //var name = LCData.Get(LCData.ParamName.NICK_NAME) 
        //var icon = LCData.Get(LCData.ParamName.AVATOR_URL)
        //if(!name||!icon||name==""||icon=="") return false

        loginLoading.hide();
        longin_silent = true//切换为静默模式
        getApp().globalData.wnds.Wnd_Home.Show()//显示主界面
        return true
    }

    login() {
      
        //显示登录界面
//        getApp().globalData.wnds.Wnd_Login.Show()
        //执行登录逻辑
        this._reLogin();
    }

    _hide() {
        //隐藏登录界面
        //getApp().globalData.wnds.Wnd_Home.Show() 
        loginLoading.hide();

    }

    //显示重新登录框
    _showLoginBox(msg = "已和服务器失去联系！") {
        this._hide();
        wx.showModal(
            {
                title: "消息",
                content: msg,
                showCancel: "false",
                cancelText: "",
                confirmText: "重新登录",
                confirmColor: "#3cc51f",
                complete: (res) => {
                    //console.log("_showLoginBox ",res)
                    //res.confirm
                   //longin_silent = false 屏蔽静默
                    this._reLogin();
                }
            }
        )
    }

    ShowGoHomeBox(msg = "已和服务器失去联系！") {
      this._hide();
      wx.showModal(
        {
          title: "消息",
          content: msg,
          showCancel: "false",
          cancelText: "",
          confirmText: "返回主页",
          confirmColor: "#3cc51f",
          complete: (res) => {
            //wx.navigateBack({ delta: 1 })
            this.GoHome()
          }
        }
      )
    }

    //重新开始登陆
    _reLogin() { 
         
        getApp().globalData.LoginOK = false

        if(!longin_silent) loginLoading.show(txt(1020), true);
        GameConn.Close()
        

        //WorldConn.Close()

        ServerList.ReLoad()
        //PubConfig.ReLoad()
        wxAccount.login();

        if(loginTimeout) {clearTimeout(loginTimeout);loginTimeout=null}
        /*
        loginTimeout = setTimeout(()=>{
            this._showLoginBox()
        },15000);
        */
    }

    _onNSLoginSuccess(res) {
       
        //设定路由标记
        GameConn.Route = 100000000 + res.logicSid

        getApp().globalData.RsaPubkey = res.pubkey
         console.log("_onNSLoginSuccess#1", getApp().globalData.RsaPubkey)

        let timeID = 0;
        timeID = setInterval(() => {
            //console.log("_onNSLoginSuccess..") 

            /*
            var existData = false
            if(OOSyncClient.RootObj() != null)
            { 
                existData = true
            }*/
              var existData = true

            if (existData) {
                  console.log("_onNSLoginSuccess#3")
                clearInterval(timeID); //关闭定时器
                
                //关闭登录超时定时器
                if(loginTimeout) {clearTimeout(loginTimeout);loginTimeout=null}

                loginLoading.hide(); 

                /*
                //绑定同步对象
                var rootObj = OOSyncClient.RootObj()
                var obj = OOSyncClient.GetObject(rootObj.Sid(), "Player")
                Player._BindSync(obj);

                if(Player.ImportDataFinish) //服务器上存在有效的数据
                {
                    for(var pname in LCData.ParamName)
                    { 
                        var name = LCData.ParamName[pname]
                        var svr_v = Player.GetParam(name)
                        if(svr_v) wx.setStorageSync(name, svr_v );
                    }
                }*/

                LCData.BindData(
                    Player.ImportDataFinish,
                    ()=>{
                        
                         getApp().globalData.LoginOK = true
                        
                        console.log("成功获取了用户信息");  
                        FightRoom.LoginClear()//清战斗相关信息
                        FightRoom.LoginFighting = res.fighting    
                        /*
                        if(!longin_silent)//不是静默模式
                        {
                            this.GoHome()
                        } 
                        */
                    }
                )
                 

                


            } 
        }, 100)

    }

    _onNSLoginFail(res) {
        console.log(res.msg)
        /*
        if(!this.GoHome())
        {
            //if(!longin_silent) getApp().globalData.ServerLogin._showLoginBox(res.msg)
        }*/
    }

    _onNSStep(msg) {
        console.log("step " + msg);
    }
}

let instance = new serverLogin();
export {instance as ServerLogin}