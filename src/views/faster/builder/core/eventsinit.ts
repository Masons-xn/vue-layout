/**
 * Created by xining.lao on 7/24/2017.
 */

import { Fast } from "./config"
import bus from "./eventbus"
import { DataOfUnit } from "./dataType"
import _ from "lodash"

interface DataOfUnitEdit {
  config: any
  unit: DataOfUnit
}
const common = {
    UnitAdd(key: any[]) {
      if (key[1]) {
        this.UnitAdd(key[0])
      } else {
        this.UnitAdd(key)
      }
    },
    UnitMove(key: any) {
      // @ts-ignore
      this.unitMove(key)
    },
    unitDelete(key: any) {
      // @ts-ignore
      let unitMoveing = this.unitMoveing
      if (Object.keys(key).length > 0) {
        unitMoveing = key
      }
      // @ts-ignore
      this.unitDelete(unitMoveing)
    },
    addUnit(arg: { id: string | number; vue: any }) {
      Fast.Mapping[arg.id] = arg.vue
    },
    unitRender(id: string) {
      if (Fast.Mapping[id] && !Fast.Mapping[id].$el) {
        Fast.Mapping[id].$mount("#" + id)
      }
    },
    pushIntoParent(unit: { unitPid: string | number; unitID: any }) {
      const parent = Fast["Mapping"][unit.unitPid]
      if (parent) {
        // const temp = _.find(parent.childCom, ch => {
        //   return ch.unitID === unit.unitID
        // })
        if (!parent.childCom) {
          parent.childCom = []
        }
        setTimeout(() => {
          parent.childCom.push(unit)
        }, 10)
      }
    },
    mulUnitDraw(unit: any) {
      this.mulUnitDraw(unit)
    },
    UnitChangeProps(unit: { change: any; unit: { unitID: any } }) {
      if (unit.unit.unitID){
        // @ts-ignore
        this.setProps(unit.change, unit.unit.unitID)
      }
    },
    Events(arg: any) {
      // @ts-ignore
      this.unitEventBus(arg.name, arg.arg)
    },
    pageInit(arg: any) {
      this.pageInit(arg)
    },
    ajaxAddUnits(arg: any) {
      // @ts-ignore
      this.loadData(arg.id, arg.notclear, arg.pid)
    }
  },
  buildermore = {
    "node-click"(node: { unitID: string | number }) {
      const selected = Fast.Mapping[node.unitID]
      bus.trigger("editSelect", selected)
    },
    "node-switch"(info: any) {
      // @ts-ignore
      this.doswitch(info)
    },
    MoveUnit(key: any) {
      // @ts-ignore
      this.editingstate = false
      // @ts-ignore
      this.unitMoveing = key
    },
    editSelect(unit: any) {
      this.editSelect(unit)
    },
    editUint(unit: any) {
      // @ts-ignore
      this.UnitEdit(unit, "", true)
    },
    dialogManage(unit: any) {
      // @ts-ignore
      this.dialogAdd(unit)
    }
  },
  builderbind = (mode: string) => {
    if (mode === "pro") {
      return common
    }
    const builder = _.cloneDeep(common)

    _.forIn(buildermore, function(value, key) {
      builder[key] = value
    })
    return builder
  }

export default builderbind
