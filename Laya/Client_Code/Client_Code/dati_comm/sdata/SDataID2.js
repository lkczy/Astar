import * as Res from "../../sdata/res/Id2String"
import * as Res2 from "../../sdata/res/Id2StringPub"

import { jscsv} from "./jscsv"

 
//合并数据
var res2body = Res2.data.body
var resbody =  Res.data.body
for(var k in res2body) resbody[k] = res2body[k]  

//构建实例
let SDataID2 = new jscsv(Res.data) 

//txt(id)
//txt(id,{0},{1},...)
function txt() {
    var args = arguments;
    var id = args[0]
    var re = SDataID2.GetRow(id)[SDataID2.I_String]
    re = re.replace(/\<br \/\>/g, "\r\n")

    
    if(args.length>1)//格式化参数
    {
        //return args[1]+""
        var fmtarg = []
        for(var j=1;j<args.length;j++)
            fmtarg.push(  args[j] )
        
        return re.replace(
            /\{(\d+)\}/g,
            (m, i)=> {
                //var k = parseInt(  i+1 )
                return fmtarg[i];
            }
        );
    }else//仅转ID
        return re
}
 
module.exports = { txt }