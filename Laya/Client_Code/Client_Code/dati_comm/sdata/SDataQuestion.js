import { jscsv } from "./jscsv"
import * as Res from "../../sdata/res/Question"

class SDataQuestion extends jscsv {
  constructor() {
    super(Res.data)
    this.RootQuest = []
    this.Foreach(
      (id,row)=>{
        var parentID = row[this.I_Parent]
        if (parentID>=0)//存在父亲
        {
          var parentRow = this.GetRow(parentID)
          if (parentRow.subs == null) parentRow.subs = []
          parentRow.subs.push(row)
        }else //这是一个根
        {
          this.RootQuest.push(row)
        }
      }
    )
  }
}

let _SDataQuestion = new SDataQuestion()
module.exports = { SDataQuestion: _SDataQuestion }