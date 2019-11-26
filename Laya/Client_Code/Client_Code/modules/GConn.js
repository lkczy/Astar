import {UIEvent} from '../dati_comm/libs/network/UIEvent';
import {NSLoader} from "../dati_comm/libs/network/NSLoader"; 
import {OOSyncClient} from '../dati_comm/libs/oosync/OOSyncClient'
import * as MsgBox from '../dati_comm/modules/MsgBox'

let connCount = 0
class GConn {
    constructor() {
        this._socketHandle = null
        this._connd = false
        this.onConn = new UIEvent()
        this.onRecv = new UIEvent()
        this.onClose = new UIEvent()
        this._loaders = {}
        this.Route = 1//路由标记
        this.SetHeartbeatTime()

        setInterval(()=>{this.Update("GConn")},1000)
        
       
    }



    SetHeartbeatTime()
    {
        this._lastHeartbeatTime =  Date.parse(new Date()) / 1000//上次心跳时间
    }

    Update(name)
    {
     
      var now = Date.parse(new Date()) / 1000
 
      if(getApp().globalData.LoginOK && this._lastHeartbeatTime+20<now)
      {
        //心跳
        let nm = {n: "hbeat"}
        this._Send(JSON.stringify(nm),  this.Route)
        console.log("=====心跳=====",name)
      }

      
      //console.log("socket Update")
      var needClose = false
      var loaders = this._loaders 
      // console.log('_loaders',this._loaders )
      for (var lid in loaders) 
      { 
          var loader = loaders[lid]
          if (loader.needRequest)  
          { 
            console.log("Update ReRequest")
            if(getApp().globalData.LoginOK)//当前是已经登陆成功的
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
        getApp().globalData.LoginOK = false//当前登录状态设置为登录
      }
    }
    

    //检查链接是否可用
    CheckConn() {
      return this._connd && this._socketHandle
    }

    Conn(url) {

        if(this._socketHandle) this.Close()

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
              console.log('ok',res)
            }
        });

        var handle =  this._socketHandle
        
        connCount++
        console.log("Conn count:",connCount)
        
        this._socketHandle.onOpen((evt) => {
            if(handle !=  this._socketHandle) return
            console.log("NSSocket Onopen",evt)
            this._connd = true 

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

 

    //处理消息接收事件
    OnMessage(data) { 
        //console.log("_socket onmessage",data)
      
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
              var jbody = JSON.parse(body)
            //返回接收成功
             if (!OOSyncClient.DoDispatcher(jbody)) this.onRecv.Emit(jbody)
        } 
    }

  
    //发起一个通知
    Notify(msg, routeFlag = -1) {
        if(routeFlag==-1) routeFlag = this.Route
        this._Send(msg, routeFlag)
    }

    //发起一个请求
    CreateLoader(jsonObj, routeFlag = -1) {
        if(routeFlag==-1) routeFlag = this.Route
        let loader = new NSLoader(this, jsonObj, routeFlag)
        this._loaders[loader._lid] = loader 
        return loader
    }

    Request(jsonObj,onSuccess)
    { 
        if(!getApp().globalData.LoginOK)
        {
            MsgBox.ShowOK("消息","网络连接不通畅，请稍后再试！")
            return
        }

        var loader = this.CreateLoader(jsonObj);
        
        loader.OnComplete.On(this, (data) => {  
            if (onSuccess != null) onSuccess(data) //执行回调
        })
        loader.OnError.On(this, () => {
            wx.showToast({
                title: "网络故障，请稍后再试！",
                icon: 'none',
                duration: 2000
            })
            getApp().globalData.LoginOK = false
        })
        
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
        this._ClearLoaders()

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
          getApp().globalData.LoginOK = false
          return false
        }
        let head = {r: routeFlag}
        if (lid != null) head.l = lid

        let nmstr = JSON.stringify(head) + "#E#" + msg 
        this._socketHandle.send({data:nmstr})
        return true
    }

}

let GameConn = new GConn()
export {GameConn}