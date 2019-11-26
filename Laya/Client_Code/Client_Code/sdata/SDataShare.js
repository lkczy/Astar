import * as Res from "./res/Share"
import {jscsv} from "../dati_comm/sdata/jscsv"

//const shareData = new jscsv(Res.data);

const SDataShare = new jscsv(Res.data);
module.exports = { SDataShare }