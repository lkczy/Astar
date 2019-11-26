import {NSSocket} from './NSSocket'

let connList = []
let initd = false
class NSSocketPool {

    //异步创建连接
    CreateConn(routeFlag, sessionCode,reCall)
    {
        if(!initd)
        {
            initd = true
            setInterval(()=>this.Update(),3000)
        }
        
        connList.push(
            {
                routeFlag:routeFlag,
                sessionCode:sessionCode,
                reCall:reCall
            }
        ) 
    }

    Update()
    {
        if(connList.length==0) return 
        var info = connList[0]
        connList.splice(0,1)
        info.reCall(  new NSSocket(info.routeFlag,info.sessionCode) )
    } 
}

let instance = new NSSocketPool()
module.exports = {NSSocketPool:instance}
