  /// <summary>
  /// 同步对象
  /// </summary>
  export default class OOSyncObj {
    Init(sid)
    {
      this._sid = sid
      this._name = ""
      this._Parent = null;
      this._key_values = {}
      this._childs = {}
    }

    Init(sid,parent,name)
    {
      this._sid = sid
      this._name = name
      this._Parent = parent
      this._key_values = {}
      this._childs = {}
    }

    GetValue(attrName){ return this._key_values[attrName]  } 
         
    ChildCount() { return Object.getOwnPropertyNames(this._childs).length }


    SetValue(attrName,value) {  
       this._key_values[attrName] = value 
    }

    GetChild(name, autoCreate = true)
    {
      if (this.HasChild(name)) return this._childs[name];
      if (!autoCreate) return null;//不允许自动创建，只能返回null

      var obj = new OOSyncObj()
      obj.Init(this._sid, this, name)
      this._childs[name] = obj
      return obj
    }

    Delete()  { this._Parent.RemoveChild(this) }

    RemoveChild(obj)
    {
      var n = obj._name;
      if (!this.HasChild(n) || this._childs[n] != obj) return;
      this.RemoveChildN(n);
    }

    RemoveChildN(name) { this._childs.Remove(name); }

    HasChild(name) { return this._childs[name]!=null }

    Path()
    { 
      //处理根对象
      if (this._Parent == null) return ""
      var p = this._Parent.Path();
      return p == null ? null : (p == "" ? this.Name() : p + "/" + this.Name()); 
    }

    Parent() { return _Parent } 
 
    Name() { return this._name}

    Sid() {return this._sid}
 
    Foreach(jsFun)
    {
      if (jsFun == null) {
        Log("OOSyncObj Foreach jsFun is null");
        return;
      }

      for (var key in this._childs) jsFun(key , this._childs[key])
    } 
}

    