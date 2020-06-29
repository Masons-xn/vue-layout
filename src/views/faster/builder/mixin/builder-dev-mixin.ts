/**
 * Created by xining.lao on 6/9/2017.
 */
import { pageInfo } from "../core/baseinfo"
import Drag from "./drag"
import { Fast } from "../core/config"
import _ from "lodash"
import { Component, Vue } from "vue-property-decorator"
import PaneFn from "../core/builder"
@Component({
  mixins: [Drag, PaneFn]
})
export default class DeVDrag extends Vue {
  [x: string]: any
  copys() {
    const input: any = document.getElementById("copyUnitId")
    input.value = this["editingUnitId"]
    input.focus()
    input.select()
    // @ts-ignore
    if (document.execCommand("copy", false, null)) {
      // console.warn("")
      this.$message.success("已经复制至剪切板")
    } else {
      console.warn("复制失败手动拷贝吧：" + this["editingUnitId"])
    }
  }
  goback() {
    this["$router"].back()
  }
  clearMask() {
    this["conMask"]()
  }
  pageStructure(data) {
    const tdata = _.cloneDeep(data)
    const treedata: any[] = []

    for (let i = 0; i < tdata.length; i++) {
      const item = tdata[i]

      item.visible = true
      item.open = true
      item.label = item.unitID
      if (item.unitPid) {
        for (let j = tdata.length - 1; j > -1; j--) {
          const items = tdata[j]
          if (item.unitPid === items.unitID) {
            if (!items.children) {
              items.children = []
            }
            items.children.push(item)
          }
        }
      }
    }
    tdata.map(function (items) {
      if (!items.unitPid) {
        treedata.push(items)
      }
    })
    this["treeData"] = []
    this["treeData"] = treedata
  }
  doswitch(info: { F: { unitID: string; unitIndex: any; containerID: any; unitPid: string }, T: { unitID: string; unitIndex: any; containerID: any, unitPid: string }, P: { unitID: string } }) {
    if (!info) {
      return
    }
    const that = this
    const tempconfig = _.cloneDeep(Fast.Config)
    let parent
    let redraw: any[] = []
    let needredraw = that["getchildUnits"](Fast, Fast.Mapping[info.F.unitID]) || []
    needredraw = needredraw.concat(that["getchildUnits"](Fast, Fast.Mapping[info.T.unitID]))
    tempconfig.map(function (item) {
      if (info.F.unitID === item.unitID) {
        item.unitIndex = info.T.unitIndex
        if (item.containerID) {
          item.containerID = info.F.containerID
        }
      } else if (info.T.unitID === item.unitID) {
        item.unitIndex = info.F.unitIndex
        if (item.containerID) {
          item.containerID = info.T.containerID
        }
      } else if (info.P.unitID === item.unitID) {
        parent = item
      }
      const exit = _.result(_.find(needredraw, function (chr) {
        return chr.unitID === item.unitID
      }), "unitID")
      if (exit) {
        item.unitIndex = Fast.Index++
      }
    })
    Fast.Config = tempconfig
    if (parent) {
      redraw = redraw.concat(that["getchildUnits"](Fast, Fast.Mapping[parent.unitID]))
      redraw.map((removed) => {
        removed.childCom = []
        that["config"] = _.remove(that["config"], (item: any) => {
          return removed.unitID !== item.unitID
        })
      })
      redraw = this["sorteddata"](redraw)
      that["unitsRedraw"](redraw)
    } else {
      that["clearPage"]()
      setTimeout(function () {
        that["config"] = tempconfig
      })
    }
  }
  structPanelClose() {
    this["structShow"] = false
  }
  get panelmaxheight() {
    const style = {},
      height = this["editpanelheight"]

    Object.assign(style, { "max-height": height + "px" })
    return style
  }
  get editingPanelState() {
    return this["editingState"] ? "" : "hide"
  }
  structPanelShow() {
    this["structShow"] = true
  }
  get structPanelstate() {
    return this["structShow"] ? "" : "hide"
  }
  // get elementsAllHolder() {
  //   const style = {},
  //     height = this["holderheight"]
  //
  //   Object.assign(style, { width: "100%", height: height + "px" })
  //   return style
  // }
  mounted() {
    // const action = this["$route"].query.action
    // if (Fast && Fast.Index !== 1) {
    //   Fast.init()
    //   pageInfo.init()
    // }
    // Fast["projectid"] = this["$route"].query.projectid
    // if (action === "update" || action === "search") {
    //   let id
    //   if (JSON.parse(this["$route"].query.param as string).id) {
    //     id = JSON.parse(this["$route"].query.param as string).id
    //   } else if (JSON.parse(this["$route"].query.param as string).path) {
    //     id = Fast.routerInfo[path]
    //   }
    //   this["loadData"](id)
    //   if (action === "search") {
    //     this["loadData"]("pre")
    //   }
    // } else {
    //   pageInfo.id = ""
    //   pageInfo.name = ""
    //   pageInfo.files = ""
    //   pageInfo.initMethods = ""
    //   pageInfo.route = ""
    // }
    // Fast.route = this["$route"]
    // Fast.store = this["$store"]
  }
}
