import {UIEvent} from 'UIEvent';

let _lidseed = 1

class NSLoader {
    constructor(ownerSocket, jsonObj, routeFlag) {
        this._socket = ownerSocket
        this._lid = _lidseed++
        this.OnComplete = new UIEvent()
        this.OnError = new UIEvent()
        this.jsonObj = jsonObj
        this.routeFlag = routeFlag
        this._existResult = false
        this.needRequest = false

        this.ReRequest()
    }

    //重新发起请求
    ReRequest() {
        if (this._existResult)
        { 
          return//非法的重复请求 
        }
        
        this.requestTime = Date.parse(new Date())/1000
        //console.log("当前时间戳" + this.requestTime)
        this.needRequest = !this._socket._Send(JSON.stringify(this.jsonObj), this.routeFlag, this._lid)
        this._socket._loaders[this._lid] = this
    }

    //服务器返回了结果
    _setResult(data, result) {
        if (result === 1) //成功执行了loader
        { 
            this._existResult = true
            this.OnComplete.Emit(JSON.parse(data))
        }
        else
            this._setError()//服务器执行时遇到了异常    
    }

    //网络等原因导致了异常
    _setError() {
        this.OnError.Emit()
    }
}

export {NSLoader}