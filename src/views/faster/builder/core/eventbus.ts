/**
 * Created by xining.lao on 6/15/2017.
 */
import { Vue } from "vue-property-decorator"
import { Fast } from "./config"
const vue = new Vue()
// @ts-ignore
const events = vue._events
const bus = {
  trigger: (name: string, arg: any) => {
    vue.$emit(name, arg)
  },
  unbind: (name: string) => {
    delete Fast.Vuebus[name]
    vue.$off(name)
  },
  bind: (name: string, fn: Function) => {
    if (events[name]) {
      bus.unbind(name)
    }
    Fast.Vuebus[name] = fn
    vue.$on(name, fn)
  }
}

export default bus
