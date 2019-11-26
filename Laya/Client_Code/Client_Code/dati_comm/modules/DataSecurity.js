//数据安全
import { MD5} from "./md5"

//签名 key,数据1，数据2,...
function Sign()
{
  var args = arguments;
  
  var str = ""
  for(var i=0;i<args.length;i++) 
    str+=args[i].toString()

  var str2 = "" 
  for (var i = 0; i < str.length; i++) {
    var tmp = str.charCodeAt(i) ^ 2
    if (tmp < 16) tmp+=16
    if(tmp>255) tmp=255
    var code = tmp.toString(16)
    str2+=code
  }
  var re = MD5(str2) 
  return re
}

module.exports = { Sign }
