/**
 /**
 * Created by xining.lao on 5/5/2017.
 */
import { Component, Provide, Vue } from "vue-property-decorator"
import bus from "../core/eventbus"
import * as _ from "lodash"

const drag = {
  mode: "add",
  modeChange(value: string) {
    this.mode = value
  }
}

@Component
export default class Drag extends Vue {
  public mode = "add"
  private unitType = ""
  private unitID = ""
  public modeChange(value: string) {
    this.mode = value
  }
  public conMask(elemnet?: any) {
    if (elemnet) {
      const container = document.getElementsByClassName("drag_Mask")
      _.forIn(container, function(val) {
        if (typeof val === "object") {
          if (val.className.indexOf("drag_Add_Mask") === -1) {
            val.className = val.className + " drag_Add_Mask"
          }
          if (val.className.indexOf("moveTo") > -1) {
            val.className = val.className.replace("moveTo", "")
          }
        }
      })
      const name = elemnet.className + " moveTo"
      elemnet.className = name
    } else {
      const container = document.getElementsByClassName("drag_Mask")

      _.forIn(container, function(val) {
        if (typeof val === "object") {
          let classname = val.className
          classname = classname.replace("drag_Add_Mask", "")
          classname = classname.replace("moveTo", "")
          val.className = classname
        }
      })
    }
  }
  public unitdragmove(event: { preventDefault: () => void; target: { className: string | string[] } }) {
    event.preventDefault()
    if (drag.mode === "panelmove") {
      return false
    }
    if (event.target.className && event.target.className.indexOf("drag_Mask") > -1 && event.target.className.indexOf("moveTo") === -1) {
      this.conMask(event.target)
    }
    return true
  }
  public unitMove(event: { stopPropagation: () => void }) {
    drag.modeChange("edit")
    if (this.mode === "dev") {
      const that = this

      bus.trigger("MoveUnit", that)
      event.stopPropagation()
      return true
    }
  }
  public unitRemove(event: { stopPropagation: () => void }) {
    event.stopPropagation()
    return true
  }
  public unitEdit(event: { stopPropagation: () => void }) {
    if (this.mode === "dev") {
      bus.trigger("editUint", this)
      event.stopPropagation()
    }
  }
  public unitSelect(event: { stopPropagation: () => void }) {
    if (this.mode === "dev") {
      bus.trigger("editSelect", this)
      event.stopPropagation()
    }
  }
  public unitDrop(event: { target: any; stopPropagation: () => void }) {
    event.stopPropagation()
    if (drag.mode === "panelmove") {
      return false
    }
    this.conMask()
    if (document.querySelector(".drag_image")) {
      (document.querySelector(".drag_image") as any).innerHTML = ""
    }
    if (this.unitType && this.unitType === "element") {
      return false
    }
    if (this.unitID || event.target.className === "custonmpage" || event.target.className.indexOf("container") > -1) {
      if (drag.mode === "add") {
        if (event.target.className.indexOf("container") > -1 && event.target.className.indexOf("dragable_area") === -1) {
          bus.trigger("UnitAdd", {
            unitPid: event.target.attributes.nodeparent.nodeValue,
            containerID: event.target.id
          })
        } else {
          bus.trigger("UnitAdd", { unitPid: this.unitID })
        }
      } else {
        if (event.target.className.indexOf("container") > -1 && event.target.attributes.nodeparent) {
          bus.trigger("UnitMove", {
            unitPid: event.target.attributes.nodeparent.nodeValue,
            containerID: event.target.id
          })
        } else {
          bus.trigger("UnitMove", {
            unitPid: this.unitID,
            targetnode: event.target
          })
        }
        drag.modeChange("add")
      }
    }
    if (event.target.parentNode.className === "rubbish") {
      drag.modeChange("add")
      bus.trigger("unitDelete", {} )
    }

  }
  public randomString(len: number) {
    len = len || 10
    const $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789"
    const maxPos = $chars.length
    let str = ""

    for (let i = 0; i < len; i++) {
      str += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return str
  }
}
