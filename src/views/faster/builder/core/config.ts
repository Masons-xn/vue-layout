/**
 * Created by xining.lao on 7/28/2017.
 */
import bus from "./eventbus"
import _ from "lodash"
import { DataOfFast, DataOfUnit } from "./dataType"

/**
 * Mapping  组件的实例集合
 * Config   builder 配置集合
 * Index  组件的索引
 */

export const Fast: DataOfFast = {
  Mapping: {},
  Config: [],
  Index: 1,
  store: "",
  needDel: [],
  axios: "",
  route: "",
  evetns: {},
  mode: "dev",
  environment: "",
  routerMatch: [],
  delayUnit: [],
  routerInfo: {},
  init: () => {
    // @ts-ignore
    if (this) {
      // @ts-ignore
      const that = this
      that.Mapping = {}
      that.Config = []
      that.needDel = []
      that.Index = 1
      that.axios = {}
      that.route = {}
      that.evetns = {}
      that.mode = "dev"
      that.environment = ""
      that.delayUnit = []
      that.routerInfo = {}
    }
  },
  Vuebus: {},
  unitToDelay: (unit: { notSave: any; unitID: string; isAsyn: string }[]) => {
    unit.map((item: { notSave: any; unitID: string; isAsyn: string }) => {
      if (!item.notSave) {
        const exit = _.find(Fast.delayUnit, (ch: DataOfUnit) => {
          return ch.unitID === item.unitID
        })

        if (!exit) {
          item.isAsyn = "1"
          Fast.delayUnit.push(item)
        }
      }
    })
  },
  unitToActive: id => {
    const ids = [id]
    const temp: any[] = []
    function getactives() {
      let newadd = true
      Fast.delayUnit = _.remove(Fast.delayUnit, (ch: DataOfUnit) => {
        let isfalse = false
        if (_.indexOf(ids, ch.unitID) > -1) {
          ids.push(ch.unitID)
          temp.push(ch)
          isfalse = true
        } else if (_.indexOf(ids, ch.unitPid) > -1) {
          ids.push(ch.unitID)
          temp.push(ch)
          isfalse = true
        }
        return !isfalse
      })
      for (const { unitID, unitPid } of Fast.delayUnit){
        if (_.indexOf(ids, unitID) > -1 || _.indexOf(ids, unitPid) > -1){
          newadd =false
          break
        }
      }
      if (!newadd) {
        getactives()
      }
    }
    getactives()
    bus.trigger("mulUnitDraw", temp)
    if (temp.length === 1 && temp[0].path) {
      // @ts-ignore
      const id = Fast.routerInfo[temp[0].path]

      bus.trigger("ajaxAddUnits", { id, pid: temp[0].unitID })
    }
  }
}
window["builder"] = Fast
export default Fast
