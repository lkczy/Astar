import * as Res from "./res/Tips"
import { jscsv } from "../dati_comm/sdata/jscsv"
const SDTips = new jscsv(Res.data);
module.exports = { SDTips }
