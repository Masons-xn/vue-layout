/**
 * Created by xining.lao on 6/19/2017.
 */
import { Fast } from "../core/config"
import _ from "lodash"
// import { DataOfUnit } from "@/src/views/faster/builder/core/dataType"
// import bus from "@/src/views/faster/builder/core/eventbus"
export default {
  bind: {
    dialogOpen(that: { dialogOpen: (arg0: any) => void }) {
      return (arg: any) => {
        that.dialogOpen(arg)
      }
    },
    dialogColse(that: { dialogColse: (arg0: any) => void }) {
      return (arg: any) => {
        that.dialogColse(arg)
      }
    }
  },
  method: {
    dialogOpen(id: string) {
      Fast.unitToActive(id)
    },
    dialogColse(unitID: string) {
      const unit = Fast.Mapping[unitID]
      // @ts-ignore
      const childunits = this.getchildUnits(Fast, unit)
      const thisconfig = _.find(Fast.Config, function(ch) {
        return ch.unitID === unit.unitID
      })
      childunits.unshift(thisconfig)
      Fast.unitToDelay(childunits)
      // @ts-ignore
      this.mulitMove(childunits)
    }
  }
}
