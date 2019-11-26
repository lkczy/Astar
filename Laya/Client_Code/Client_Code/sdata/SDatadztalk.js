import * as Res from "./res/dztalk"
import { jscsv } from "../dati_comm/sdata/jscsv"

const SDatadztalk = new jscsv(Res.data);
module.exports = { SDatadztalk }
