
//模拟c#的字符串格式化
String.prototype.format = function () {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g,
    function (m, i) {
      return args[i];
    });
}

//var I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
  
//字符串哈希值
String.prototype.hash = function(){
  var hash = 5381;
  var i = this.length - 1;
   
  for (; i > -1; i--)   hash += (hash << 5) + this.charCodeAt(i);
 
 var value = hash & 0x7FFFFFFF;
 /*
 var retValue = '';
 do{
  retValue += I64BIT_TABLE[value & 0x3F];
 }while(value >>= 6);
  
 return retValue;*/
 return value;
}

 