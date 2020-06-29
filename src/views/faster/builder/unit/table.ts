/**
 * Created by xining.lao on 6/19/2017.
 */
import { Fast } from "../core/config"
import _ from "lodash"
// import { DataOfUnit } from "@/src/views/faster/builder/core/dataType"
// import bus from "@/src/views/faster/builder/core/eventbus"
export default {
  bind: {
    delTableItem(that: { delTableItem: (arg0: any) => void }) {
      return (arg: any) => {
        that.delTableItem(arg)
      }
    }
  },
  method: {
    delTableItem(unitID: string) {
      console.log(unitID)

    }
  }
}
