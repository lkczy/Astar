import * as Res from "./res/dzface"
import { jscsv } from "../dati_comm/sdata/jscsv"


const SDatadzface = new jscsv(Res.data);

module.exports = { SDatadzface }