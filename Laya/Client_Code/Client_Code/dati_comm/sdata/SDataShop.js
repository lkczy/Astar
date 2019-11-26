import * as Res from "../../sdata/res/Shop"
import { jscsv} from "./jscsv"

let SDataShop = new jscsv(Res.data) 
module.exports = { SDataShop }