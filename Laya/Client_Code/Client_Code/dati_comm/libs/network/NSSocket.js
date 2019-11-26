import {UIEvent} from './UIEvent';
import {NSLoader} from "./NSLoader"; 
import {OOSyncClient} from '../oosync/OOSyncClient'

let connCount = 0
class NSSocket {
    constructor(sid = null, sessionCode = null) {
        this._socketHandle = null
        this._connd = false
        this.onConn = new UIEvent()
        this.onRecv = new UIEvent()
        this.onClose = new UIEvent()
        this._loaders = {}
        this._sessionCode = sessionCode//客户端唯一标识符
        this._sid = sid//默认通信的服务器节点
        this.SetHeartbeatTime()
    }

    SetHeartbeatTime()
    {
        this._lastHeartbeatTime =  Date.parse(new Date()) / 1000//上次心跳时间
    }

    Update(name)
    {
      var now = Date.parse(new Date()) / 1000

      if(this._lastHeartbeatTime+20<now)
      {
        //心跳
        let nm = {n: "hbeat"}
        this._Send(JSON.stringify(nm), this._sid)
        console.log("=====心跳=====",name)
      }

      
      //console.log("socket Update")
      var needClose = false
      var loaders = this._loaders 
      for (var lid in loaders) 
      { 
          var loader = loaders[lid]
          if (loader.needRequest)  
          { 
            console.log("Update ReRequest")
              loader.ReRequest()
          }


          if(
            loader.requestTime&&
            loader.requestTime + 10 < now
          )//请求超时
          {
            needClose = true
            console.log("请求超时", name) 
          }
      }

      if(needClose)
      {
        this.Close()
        this._loaders = {}
        console.log("_showLoginBox#10", name) 
        getApp().globalData.ServerLogin.ShowGoHomeBox()
      }
    }
    

    //检查链接是否可用
    CheckConn() {
      return this._connd && this._socketHandle
    }

    Conn(url) {
        console.log('nssocket 的 Conn',url)
        this._url = url
        this._socketHandle = wx.connectSocket({
          url: url,
            fail:err=>{
              //console.log('err',this._url)
              this._Close()
              console.log(err)

              //this._Close()
            },
            success:res=>{
              //console.log('ok',res)
            }
        });
        
        var handle =  this._socketHandle
        

        connCount++
        console.log("Conn count:",connCount)
        
        this._socketHandle.onOpen((evt) => {
             if(handle !=  this._socketHandle) return
            console.log("NSSocket Onopen",evt)
            this._connd = true

            //绑定sessionCode
            this.BindSessionCode(this._sid, this._sessionCode)

            //抛出连线成功
            this.onConn.Emit()
        });
        this._socketHandle.onClose((evt) => {
             if(handle !=  this._socketHandle) return
            //console.log("NSSocket Onclose",evt)
            this._Close()
        });
        this._socketHandle.onMessage((evt) => { 
             if(handle !=  this._socketHandle) return
            this.OnMessage(evt.data)
        });
        this._socketHandle.onError((evt) => { 
             if(handle !=  this._socketHandle) return
            console.log("NSSocket onError",evt)
            this._Close()
        });
    }

    BindSessionCode(sid, sessionCode) {
        this._sid = sid
        this._sessionCode = sessionCode
        console.log("###BindSessionCode####")
        if (this._sessionCode != null) {
            console.log("###send bdsc####")
            let nm = {n: "bdsc", code: this._sessionCode}
            this._Send(JSON.stringify(nm), this._sid)
        }
    }

    //处理消息接收事件
    OnMessage(data) { 
        //console.log("_socket onmessage",data)
        //console.log(data)
        //解码
        //let jsonDoc = JSON.parse(data)
        let idx = data.indexOf("#E#")
        let idx2 = data.indexOf("#E#", idx + 3)

        let head = JSON.parse(data.substr(0, idx))
        let body, result

        if (idx2 < 0)//不包含loader返回结果
        {
            body = data.substr(idx + 3); 
        } else //包含loader返回的结果
        {
            result = Number(data.substr(idx + 3, idx2 - (idx + 3)));
            body = data.substr(idx2 + 3); 
        } 
        let lid = head.l
        let routeFlag = head.r

        if (lid != null && lid != "")//loader返回
        { 
            let loader = this._loaders[Number(lid)]
            if (loader != null) { 
                delete this._loaders[Number(lid)]
                loader._setResult(body, result)
            }
        } else { 
            
            //返回接收成功 
            let bodyDoc = this._parseNotify(body)
            //返回接收成功  
            let jsonstr = "$" + bodyDoc.lid; 

            this.Notify(jsonstr, 100000000 + bodyDoc.sid);//大于10亿的编号，认为是去指定的sid

            //抛出用户事件
            //console.log("bodyDoc.data", bodyDoc.data)
            let userDoc = JSON.parse(bodyDoc.data)
            //console.log("_socket onRecv",userDoc)

             if (!OOSyncClient.DoDispatcher(userDoc)) this.onRecv.Emit(userDoc)
        } 
    }

    _parseNotify(body) {
        let idx = body.indexOf("#N#")
        let idx2 = body.indexOf("#N#", idx + 3)

        let sid = Number(body.substr(0, idx))
        let lid = body.substr(idx + 3, idx2 - (idx + 3))
        let data = body.substr(idx2 + 3)
        return {sid: sid, lid: lid, data: data}
    }

    //发起一个通知
    Notify(msg, routeFlag = 0) {
        this._Send(msg, routeFlag)
    }

    //发起一个请求
    Request(jsonObj, routeFlag = 0) {
        let loader = new NSLoader(this, jsonObj, routeFlag)
        this._loaders[loader._lid] = loader 
        return loader
    }

    _Close() {
        let connd = this._connd
        //设置连接断开标记
        this._connd = false

        if (this._socketHandle != null) {  
            connCount--
            console.log("DConn count:",connCount)
            this._socketHandle.close() 
            this._socketHandle = null

            //抛出掉线事件
            this.onClose.Emit()
        }

        

        //清空loader,并通知失败
        this._ClearLoaders()
    }

    _ClearLoaders()
    {
      let loaders = this._loaders
      this._loaders = {}
      for (let lid in loaders) loaders[lid]._setError()
    }

    //关闭连接
    Close() {
        if (this._socketHandle) { 
            connCount--
            console.log("DConn count:",connCount)
        
          this._socketHandle.close()
          this._socketHandle = null
        }
    }

    _Send(msg, routeFlag, lid = null) {
        this.SetHeartbeatTime()
        if (!this.CheckConn()) 
        {  
          console.log("##_Send CheckConn ret##")
          return false
        }
        let head = {r: routeFlag}
        if (lid != null) head.l = lid

        let nmstr = JSON.stringify(head) + "#E#" + msg
        
        this._socketHandle.send({data:nmstr})
        return true
    }

}

export {NSSocket}