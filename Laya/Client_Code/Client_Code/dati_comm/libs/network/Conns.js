import {UIEvent} from 'UIEvent';
import {NSSocketPool} from './NSSocketPool'
import { NSSocket } from './NSSocket'
import {loginLoading} from "./loginLoading";
import {txt} from "../../sdata/SDataID2"
import {GameConn} from "../../../modules/GConn"

class NSConn {
    constructor(name) {
        this.OnNotify = new UIEvent()
        this.name = name
        setInterval(
          ()=>{
            this.Update()
          },
          1000
        )
        //this._ReLogin = reLogin
    }

    Update()
    {
      if (this._Socket&&this._Socket.CheckConn()) 
      { 
        this._Socket.Update(this.name)
      }
      
    }

    //重建链接
    ReCreate(url, logicSid, sessionCode, callClose = true) {
      console.log(this.name+" ReCreate")
        this._url = url
        this._routeFlag = logicSid //路由标记
        this._sessionCode = sessionCode

        this._cacheRequests = []
        this._errorNum = 0//统计请求的错误数量

        if (callClose) {
            this._rertyCount = 0
            this.Close()
        }
        this._isClosed = false

        this.OnCreateSkt(new NSSocket(logicSid, sessionCode))

        // NSSocketPool.CreateConn(logicSid, sessionCode,(skt)=>{
        //     this.OnCreateSkt(skt)
        // })
    }

    OnCreateSkt(skt)
    {
         console.log(this.name,"connSkt")
          if (this._isClosed) {
              console.log(this.name,"connSkt_close")
              skt.Close()
              return
          }
          var bkLoaders = this._Socket?  this._Socket._loaders:{}

          this._Socket =skt
          this._Socket.onConn.On(this, this._OnConn)
          this._Socket.onClose.On(this, this._OnClose)
          this._Socket.onRecv.On(this, this._OnRecv)
          this._Socket.Conn(this._url)

          //if(this.connTimeout){ clearTimeout(this.connTimeout);this.connTimeout=null}
          //this.connTimeout = setTimeout(
          //    ()=>{
          //           this._Socket       
          //    },
          //    5000
          //)

          for (var lid in bkLoaders) bkLoaders[lid]._setError()
    }

     ReBindSocket(url, logicSid, sessionCode,skt,needclose=true) {
      console.log(this.name+" ReBindSocket",'webSocket数据：++++++++',url)
      //  url ='192.168.5.82:8087';
        this._url = url
        this._routeFlag = logicSid //路由标记
        this._sessionCode = sessionCode

        this._cacheRequests = []
        this._errorNum = 0//统计请求的错误数量
 
        this._rertyCount = 0

        if(needclose) this.Close() 

        this._isClosed = false
        var bkLoaders = this._Socket?  this._Socket._loaders:{}

        this._Socket = skt

        this._Socket.onConn.Off( this._OnConn)
        this._Socket.onClose.Off( this._OnClose)
        this._Socket.onRecv.Off( this._OnRecv)

        this._Socket.onConn.On(this, this._OnConn)
        this._Socket.onClose.On(this, this._OnClose)
        this._Socket.onRecv.On(this, this._OnRecv)
        
        for (var lid in bkLoaders) bkLoaders[lid]._setError()



        this.BindSessionCode(logicSid,sessionCode)


        //因为绑定的是一个已经连接好的套接字，因此立即抛出conn事件
        this._OnConn()
    }

    BindSessionCode(sid, sessionCode) {
        this._routeFlag = sid
        this._Socket.BindSessionCode(sid, sessionCode)
    }

    //发起一个请求
    Request(jsonObj, onSuccess = null, routeFlag = null) {
        //this.Retry()

        if (!this.Connected()) { 
            if (this._cacheRequests == null) return
 
            //缓存
            this._cacheRequests.push(
                {
                    data: jsonObj,
                    onSuccess: onSuccess,
                    routeFlag: routeFlag
                }
            )
            return
        }
 
        var loader = this._Socket.Request(jsonObj, routeFlag == null ? this._routeFlag : routeFlag)
        loader.OnComplete.On(this, (data) => { 
            this._errorNum = 0//清错误次数
            console.log(this.name,"clear errorNum", this._errorNum)
            if (onSuccess != null) onSuccess(data) //执行回调
        })
        loader.OnError.On(this, () => {
            this._errorNum++
            console.log("==================Conns  loader.OnError================")
            if(this.ErrorNum()>50)
            { 
              getApp().globalData.ServerLogin.ShowGoHomeBox()

            }else

            //console.log(this.name,"_errorNum", this._errorNum)
            loader.ReRequest()
        })
    }

    //获取请求错误的次数
    ErrorNum() {
        return this._errorNum
    }

    //主动关闭连接
    Close() {
      console.log(this.name,"close")
        if(this._Socket) {
          this._Socket.Close()
        }
        this._isClosed = true
    }

    //用于检查当前连接是否可用
    Connected() {
        return !this._isClosed &&!this._isTemporaryClose && this._Socket && this._Socket.CheckConn()
    }

    _OnConn() {
        if(this.reTryTimeout) {clearTimeout(this.reTryTimeout);this.reTryTimeout=null}
      console.log(this.name,"Conns onconn", this._cacheRequests.length)
        this._isClosed = false
        this._isTemporaryClose = false
        this._rertyCount = 0;
        loginLoading.hide();
        //发起缓存的请求
        if (this._cacheRequests.length > 0) {
            var list = this._cacheRequests
            this._cacheRequests = []
            for (var i = 0; i < list.length; i++) {
                var request = list[i]
                this.Request(request.data, request.onSuccess, request.routeFlag)
            }
        }
    }

    _OnClose() {
      console.log(this.name,"NSConns Onclose")
      if(this.reTryTimeout) {clearTimeout(this.reTryTimeout);this.reTryTimeout=null}
        loginLoading.hide();
        {
            if (
                this._isClosed ||//用户手动关闭了链接
                this._rertyCount > 3//重试次数
            ) {
                console.log(this.name,"NSConns clear loaders")
                this._cacheRequests = []//清空缓存的请求

                this._Socket.Close()
                this._Socket = null


                //不是手动关闭的
                if (!this._isClosed) { 
                    console.log(this.name,"显示gohome消息框")
                    getApp().globalData.ServerLogin.ShowGoHomeBox()
                }
            } else {
                console.log(this.name,"retry conn...")
                if(!this._isTemporaryClose)
                {
                    loginLoading.show(txt(1019), false);
                    this._Retry()

                
                    this.reTryTimeout = setTimeout( 
                        () =>{
                         console.log("重连超时")
                         this._rertyCount = 1000
                         this._OnClose()
                        }, 
                        15000
                    );
                }
            }
        }
    }
    

    _Retry()
    {
        this._rertyCount++
        this._Socket.Close()
        this.ReCreate(this._url, this._routeFlag, this._sessionCode, false)
    }

    _OnRecv(jsonDoc) {
        console.log("_conn OnRecv====================",jsonDoc)
       if(this._isClosed) 
       {
        console.log("==================_OnRecv isClosed================",this.name ) 
        return
       }

/*
        if (jsonDoc.n =="bdscerror")
        {
            console.log("==================_showLoginBox#3================",this.name )
          getApp().globalData.ServerLogin._showLoginBox()
          this.Close()
          return
        }*/
        //console.log(this.name,"_OnRecv", jsonDoc)
        this.OnNotify.Emit(jsonDoc)
    }
}
 
let WorldConn = new NSConn("pk");

export {GameConn, WorldConn}
