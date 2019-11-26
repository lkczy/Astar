import OOSyncObj from "./OOSyncObj"

let OOSyncClient  

class SvrNodeData {
  constructor(sid) {
      this._rootObj = null
      this._sid = sid
      this.Reset();
  }

  RootObj(){return this._rootObj} 

  Sid(){return this._sid}

  Reset(){  
    this._rootObj = new OOSyncObj()
    this._rootObj.Init(this._sid)
  } 
}


class _OOSyncClient {
  constructor() {
    this._valueChangedEvents = {}
    this._objs = {}
  }

  /// 执行封包分发
  DoDispatcher(doc)
  { 
    if (null == doc) return false;
    if ("_Sync" != doc["n"]) return false;//这不是一个同步包

    console.log(doc)
   
    var sid = 0
    var tm = doc["tm"];
    if (tm == null) return false; 

    if (this._objs[sid]==null) this._objs[sid] = new SvrNodeData(sid);

    var paths = doc["o"];
    if (paths == null) return false;//不是正确的同步消息

    for (var path in paths)
    {
      var objs = paths[path];
      if (objs == null) continue;//错误的协议 

      //获取本路径对应的对象
      var pathObj = this.GetObject(sid, path, true);

      for(var key in objs) 
      { 
        var objInfo = objs[key]
        if (objInfo == null) return false;

        //取得对象id 
        var name = objInfo["n"]
        var currObj = pathObj.GetChild(name);

        if (objInfo["d"] != null) //本对象被删除 
          pathObj.RemoveChild(name);
        else //变更属性
        {
          var mNode = objInfo["m"];
          if (mNode != null) //存在属性
          {
            var PostEventList = [];
            for (var attName in mNode) 
            {  
              var attValue = mNode[attName];
              if (attValue == null) continue;  
              currObj.SetValue(attName, attValue); 
              PostEventList.push(attName); 
            }

            for (var i = 0; i < PostEventList.length;i++) 
            {
              var currEvent = PostEventList[i]
              //抛出事件
              OOSyncClient.PostEvent(currObj, currEvent);
            }
          }
        }//end else
      }//end  for(var key in objs) 
    }//end  for (var path in paths)  
    return true;
  }

  PostEvent(obj,attrName)
  {
    //var path = obj.Path()
    //console.log("PostSyncEvent##", path, attrName)
    //精确绑定的事件
    {
      var evt = this.GetValueChangedEvent(obj.Sid(), obj.Path(), attrName);
      if (evt != null) evt(attrName);//.Emit
    }

    //模糊绑定的事件
    {
      var evts = this.GetValueChangedEvents(obj.Sid(), obj.Path());
      if (evts != null)
      { 
        for (var kvAttrName in evts) 
        { 
          var evt = evts[kvAttrName]
          if (kvAttrName == "" && evt != null) evt(attrName);//.Emit
        }
      }
    }

    //同时监听子对象的事件
    {
      var fullPath = obj.Path() + "@" + attrName;
      var path = obj.Path();
      do {
        var evts = this.GetValueChangedEvents(obj.Sid(), path);
        if (evts != null)
        { 
          for (var kvAttrName in evts)
          { 
            var evt = evts[kvAttrName];
            if (kvAttrName == "*" && evt != null) evt(fullPath);//.Emit
          }
        }

        if (path == "")
          path = null;
        else {
          var idx = path.lastIndexOf('/');
          if (idx < 0)
            path = "";
          else
            path = path.substr(0, idx);
        }
      } while (path != null);
    }
  }




  GetObject(sid, objPath, autoCreate = false)
  {
    if (this._objs[sid]==null) return null;
    var pathObj = this._objs[sid].RootObj();
    if (objPath != "") {
      var pNames = objPath.split('/');
      for (var i = 0; i < pNames.length; i++)
      {
        pathObj = pathObj.GetChild(pNames[i], autoCreate);
        if (pathObj == null) return null;
      }
    }
    return pathObj;
  }

  RootObj() { 
    for (var key in this._objs) return this._objs[key]
    return null
  }


  /// 绑定值改变事件 
  /// attrName 支持通配符 *
  /// objPath支持相对路径，可以从某个子路径开始表达
  BindValueChangedEvent(sid, objPath, attrName, evt)
  {
    if (this._valueChangedEvents[sid]==null) this._valueChangedEvents[sid] = {}

    var l1 = this._valueChangedEvents[sid];
    if (l1[objPath]==null) l1[objPath] = {}

    var l2 = l1[objPath];
    if (l2[attrName] == null) l2[attrName] = evt
  }
/*
  RemoveValueChangedEvent(sid,objPath,attrName)
  {
    if (this._valueChangedEvents[sid]==null) return;

    var l1 = this._valueChangedEvents[sid];
    if (l1[objPath]==null) return;

    var l2 = l1[objPath];
    if (l2[attrName]==null) return;

    delete l2[attrName]
  }

      //清除某属性绑定的所有事件
    RemoveValueChangedEvent(sid, objPath)
  {
    if (this._valueChangedEvents[sid]==null) return;

    var l1 = this._valueChangedEvents[sid]
    if (l1[objPath]==null) return;
    delete l1[objPath]
    var l1Count = Object.getOwnPropertyNames(l1).length 
    if (l1Count < 1) delete this._valueChangedEvents[sid]
}*/

  GetValueChangedEvent(sid, objPath, attrName)
  {
    if (this._valueChangedEvents[sid]==null) return null;

    var l1 = this._valueChangedEvents[sid];
    if (l1[objPath]==null) return null;

    var l2 = l1[objPath];
    if (l2[attrName]==null) return null;

    return l2[attrName]
  }

  GetValueChangedEvents(sid,objPath)
  {
    if (this._valueChangedEvents[sid]==null) return null;

    var l1 = this._valueChangedEvents[sid]
    if (l1[objPath]==null) return null;

    return l1[objPath]
  }

  Clean()
  {
    this._valueChangedEvents = {}
    this._objs = {}
  }
}
OOSyncClient = new _OOSyncClient() 
module.exports = { OOSyncClient }