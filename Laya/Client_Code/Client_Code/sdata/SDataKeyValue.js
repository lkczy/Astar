import * as Res from "./res/KeyValue"
import { jscsv } from "../dati_comm/sdata/jscsv"

const SDataKeyValue = new jscsv(Res.data);
module.exports = { SDataKeyValue }
