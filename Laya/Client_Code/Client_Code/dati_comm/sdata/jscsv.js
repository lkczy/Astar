var keytype = {
  int: 1,
  str: 2
}

//js表模拟的 csv 格式读取类
class jscsv {
  constructor(data) { 
    this.mFieldName2Index = {}
    this.mData = data
    this.mIndexToFieldName = { } 
    //建立字段名到字段的索引
    var head = this.mData.head
    for (var index = 0; index < head.length;index++)
    {
        var fname = head[index]
        this.mFieldName2Index[fname] = index 
        this.mIndexToFieldName[index] = fname
        this["I_" + fname] = index
    } 

    this.keytype = data.info.keytype == "str" ? keytype.str : keytype.int
  }

/*
  GKey(key)
  { 
    if(self.keytype==keytype.int) then
      return "i"..key
    else
      return key
    end 
  }
*/
    //将字段名转换为索引号
    Name2I(name){  return this.mFieldName2Index[name] }

    //获取字段值
    GetFieldV(cloumName, key) {  return this.mData.body[key][this.Name2I(cloumName)]  }


    //获取字段值,根据列索引
    GetV(cloumIdx, key) { return this.mData.body[key][cloumIdx]  }

    //获取整行数据
    GetRow(key){ return this.mData.body[key] }

    
    //获取行数
    GetCount()
    {
      var Count = 0
      for (var x in this.mData.body) Count++
      return Count
    } 

    //检查指定的Key是否存在
    Contain(_key)
    {  
      return this.mData.body[_key]!=null
    }

    //func(key,row)
    Foreach(func)
    { 
      var body = this.mData.body
      for (var key in body) func(key, body[key])
    }
}
module.exports = { jscsv } 