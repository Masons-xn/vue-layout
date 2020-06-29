/**
 * Created by xining.lao on 6/9/2017.
 */

import { Fast } from "../core/config"
import { Component, Vue, Prop, Provide } from "vue-property-decorator"
import Drag from "./drag"
import bus from "../core/eventbus"
import exportMethods from "../core/exportMethods"
const extendMethods = {}
function methodsCommon(obj: { [x: string]: { bind: (arg0: any) => any } }) {
  if (obj) {
    exportMethods.map(methodName => {
      if (obj[methodName]) {
        // @ts-ignore
        extendMethods[methodName] = obj[methodName].bind(this)
      }
    })
  }
}
function unitByid(id) {
  if (Fast.Mapping[id]) {
    return Fast.Mapping[id]
  }
  // console.warn("不存在id 为：" + id + "的组件")
  return ""
}
@Component({
  mixins: [Drag]
})
export default class UintMixin extends Vue {
  [x: string]: any
  @Prop({ default: Fast.mode }) public mode = ""
  @Prop({ default: false }) public unitSelected = false
  @Prop({
    default: () => {
      return []
    }
  })

  public childCom: any[]
  public unitID: any
  public unitInit(arg: any[]) {
    const that = this
    let mountedId
    if (that.$el) {
      mountedId = that.$el.id
      if (mountedId) {
        arg.map(function (item) {
          that[item]()
        })
      }
    }
  }
  public newContainerId() {
    return "container" + this.randomString(10)
  }

  public getChild(id: any) {
    const Child: any[] = []
    if (this.childCom && this.childCom.length > 0) {
      this.childCom.map(item => {
        if (item.containerID === id) {
          Child.push(item)
        }
      })
    }
    return Child
  }
  get unitid() {
    return this.unitID ? this.unitID : this.unitID
  }
  get draggable() {
    return this.mode === "dev"
  }
  public mounted() {
    this.mode = Fast.mode
    bus.trigger("pageReady", this.unitid)
    methodsCommon(this)
    // try{}
    if (Fast.evetns[this.unitID.replace("-", '')]) {
      Fast.evetns[this.unitID.replace("-", '')](unitByid, extendMethods, this)
    }

  }
  public beforeDestroy() {
    if (this.$el) {
      this.$el.remove()
    }
  }
}
