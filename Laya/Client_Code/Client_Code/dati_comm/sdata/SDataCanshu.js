import * as Res from "../../sdata/res/CanshuData"
import { jscsv} from "./jscsv"

let SDataCanshu = new jscsv(Res.data) 
module.exports = { SDataCanshu }