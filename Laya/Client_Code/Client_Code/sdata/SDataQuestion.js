import * as Res from "./res/Question_Solitaire"
import { jscsv } from "../dati_comm/sdata/jscsv"

const SDataQuestion = new jscsv(Res.data);
module.exports = { SDataQuestion }
