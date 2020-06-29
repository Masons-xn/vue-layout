/**
 * Created by xining.lao on 6/16/2017.
 */
import form from "./form"
import dialog from "./dialog"
import table from "./table"
import _ from "lodash"

const mothods = {}
const unitsbind = {}

function unitsmothods() {
  return mothods
}
function unitfactory(unit: any[]) {
  unit.map((a: { [x: string]: any }) => {
    _.forIn(a["method"], function (value, key) {
      if (mothods[key]) {
        console.log("组件间方法: " + key + "重复声明")
      }
      mothods[key] = value
    })
    _.forIn(a["bind"], function (value, key) {
      if (unitsbind[key]) {
        console.log("组件间方法: " + key + "已经被注册")
      }
      unitsbind[key] = value
    })
  })
}
unitfactory([form, dialog, table])
export { unitsbind, unitsmothods }
