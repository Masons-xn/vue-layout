/**
 * Created by xining.lao on 6/9/2017.
 */
import rebornUI from "../../components"
import { Fast } from "./config"
import { Component, Vue } from "vue-property-decorator"
import _ from "lodash"

import { DataOfUnit } from "./dataType"
function setModel(value: any) {
  // @ts-ignore
  this.mode = value
}
function modeChange() {
  // @ts-ignore
  const mode = this.mode
  _.forIn(Fast.Mapping, value => {
    value.mode = mode
  })
  Fast.mode = mode
}
function unitDragstart(unitName: string, renderType: any, e: Event | undefined) {
  // @ts-ignore
  if (this.mode !== "dev") {
    return
  }
  if (document.querySelector(".drag_image")) {
    (document.querySelector(".drag_image") as Element).innerHTML = ""
  }
  // @ts-ignore
  this.containerstate = false
  // @ts-ignore
  this.editingstate = false
  const dragCopy = document.createElement("div")

  dragCopy.setAttribute("id", "dragCopyTemp")
  // @ts-ignore
  this.baseData.addUnit = {
    unitName: unitName.toLowerCase()
  }
  if (unitName === "rb-dialog") {
    return
  }
  (document.querySelector(".drag_image") as Element).appendChild(dragCopy)
  const unit = new Vue(rebornUI[unitName.toLowerCase()])
  const event = e || window.event

  unit.$mount("#dragCopyTemp")
  // @ts-ignore
  event.dataTransfer.setDragImage(document.querySelector(".drag_image"), 0, 0)
}
function initDialogInfo() {
  // @ts-ignore
  const that = this
  const allUnit = Fast.Config.concat(Fast.delayUnit)
  allUnit.map((items: { unitName: string; title: string }) => {
    if (items.unitName === "rb-dialog") {
      if (!items.title) {
        items.title = "窗口"
      }
      that.dialogAdd(items)
    }
  })
}
function UnitAdd(obj: DataOfUnit) {
  // @ts-ignore
  const that = this
  let needAdd: DataOfUnit
  if (obj && obj.unitName) {
    needAdd = obj
  } else if (initDialogInfo && that.baseData && that.baseData.addUnit && that.baseData.addUnit.unitName) {
    needAdd = that.baseData.addUnit
  } else {
    return
  }
  if (needAdd.unitName) {
    const name = needAdd.unitName
    if (name.indexOf('dialog') > -1 && obj.unitPid.indexOf('dialog') > -1) {
      return
    }
    if (name.indexOf('dialog') > -1) {
      obj.unitPid = ''
    }
    const cname = name + "-" + that.randomString(5)
    let config = {
      childCom: []
    }

    if (needAdd.config) {
      config = needAdd.config
    }
    that.config.push({
      unitID: cname,
      unitPid: obj.unitPid,
      childCom: [],
      unitName: rebornUI[name].name,
      unitType: new Vue(rebornUI[name])["unitType"],
      renderedType: needAdd.renderType,
      config,
      containerID: obj.containerID,
      unitIndex: Fast.Index++
    })
    that.addUnit = {}
  }
}
function editSelect(unit: { unitSelected: boolean }) {
  _.forIn(Fast.Mapping, value => {
    value.unitSelected = false
  })
  unit.unitSelected = true
}
function UnitEdit(unit: { unitID: string; $props: any }, unitID: any) {
  // @ts-ignore
  const that = this
  const isAdd = false
  that.editingState = true
  const temp = unit.unitID.split("-")
  that.editingUnitId = unit.unitID
  const unitName = temp[0]
  that.editConfig.unitName = rebornUI[unitName].name
  that.editConfig.unitConfigString = []
  that.editConfig.unitConfigArray = []
  const unitProps: { [x: string]: any } = unit.$props
  const props = rebornUI[unitName].options.props
  const vueUnit = Fast.Mapping[that.editingUnitId]
  _.forIn(props, (value, key) => {
    if (unitProps[key] !== undefined) {
      if (value.dataType === "string" || value.dataType === "boolean") {
        that.editConfig.unitConfigString.push({
          key,
          value: vueUnit[key] ? vueUnit[key] : value.default,
          dataType: value.dataType,
          des: value.des,
          readonly: value.readonly,
          valueBus: value.valueBus,
          alias: value.alias,
          busShow: false
        })
      } else if (value.dataType === "array") {
        that.editConfig.unitConfigArray.push({
          key,
          value: vueUnit[key] ? vueUnit[key] : value.default(),
          readonly: value.readonly,
          des: value.des,
          props: value.props,
          alias: value.alias,
          listState: false,
          edit: []
        })
      }
    }
  })
  function setValueExit(key: string, value: any) {
    const unitConfig = _.find(that.editConfig.unitConfigString, item => {
      return item.key === key
    })

    if (unitConfig) {
      unitConfig.value = value
    }
  }
  if (!isAdd) {
    const config = that.getThisUnit({ unitID: that.editingUnitId }).config
    _.forIn(config, (value, key) => {
      if (key !== "id" && key !== "childCom" && value) {
        setValueExit(key, value)
      }
    })
  }
}

function unitMove(obj: { targetnode: any; unitPid: any; containerID: any }) {
  // @ts-ignore
  const that = this
  let redraw = []
  let current

  if (that.unitMoveing) {
    current = _.cloneDeep(
      _.find(that.config, item => {
        return item.unitID === that.unitMoveing.unitID
      })
    )
  }
  if (obj.targetnode) {
    const currentNode = Fast.Mapping[current.unitID].$el
    if (currentNode.contains(obj.targetnode)) {
      return false
    }
  }
  const isNotParent = (pid: string) => {
    const parents: string[] = []
    const getPartents = (id: string) => {
      parents.push(id)
      if (Fast.Mapping[id].unitPid) {
        getPartents(Fast.Mapping[id].unitPid)
      }
    }
    getPartents(pid)
    return parents.indexOf(current.unitID) > -1
  }
  if (current && obj.containerID && !(current.unitPid === obj.unitPid && current.containerID === obj.containerID) && current.unitID !== obj.unitPid && !isNotParent(obj.unitPid)) {
    current.unitPid = obj.unitPid
    current.containerID = obj.containerID
    // @ts-ignore
    redraw.push(current)
    redraw = redraw.concat(that.getchildUnits(Fast, that.unitMoveing))
    redraw.map(removed => {
      that.config = _.remove(that.config, (item: DataOfUnit) => {
        // @ts-ignore
        return removed.unitID !== item.unitID
      })
    })
    that.unitsRedraw(redraw)
  }
}
function unitsRedraw(units: any[]) {
  // @ts-ignore
  const that = this
  units.map(removed => {
    if (Fast.Mapping[removed.unitID]) {
      const props = Fast.Mapping[removed.unitID].$props
      const data = Fast.Mapping[removed.unitID].$data
      if (props) {
        for (const key in props) {
          if (props[key] && key !== 'childCom') {
            removed[key] = props[key]
          }
        }
      }
      if (data) {
        for (const key in data) {
          if (data[key]) {
            removed[key] = data[key]
          }
        }
      }
    }
    that.unitDelete(Fast.Mapping[removed.unitID])
  })
  if (units.length === 1) {
    units = units[0]
  }
  that.config = that.config.concat(units)
  that.unitMoveing = ""
}
function mulitMove(units: any[]) {
  units.map(item => {
    // @ts-ignore
    this.unitDelete(Fast.Mapping[item.unitID])
  })
}
function dialogAdd() {
  // const that = this
  // let isIn = false
  // that.dialogs.map((item) => {
  //   if (units.unitID === item.unitID) {
  //     item.title = units.title
  //     isIn = true
  //   }
  // })
  // if (!isIn) {
  //   that.dialogs.push({unitID: units.unitID, title: units.title})
  // }
}
function toElement(id: string) {
  const top = (document.querySelector("#" + id) as any)["offsetTop"] - 120
  // @ts-ignore
  this.holderheight = (document.querySelector(".elements-all") as any).clientHeight - 80
  setTimeout(() => {
    (document.querySelector(".elements-all") as any).scrollTop = top
  }, 100)
}
function dialogSelected(unit: { dialogVisible: boolean }) {
  unit.dialogVisible = true
}

@Component({})
export default class PaneFn extends Vue {
  public setModel = setModel
  public modeChange = modeChange
  public unitDragstart = unitDragstart
  public UnitAdd = UnitAdd
  public UnitEdit = UnitEdit
  public editSelect = editSelect
  public unitMove = unitMove
  public mulitMove = mulitMove
  public unitsRedraw = unitsRedraw
  public dialogAdd = dialogAdd
  public dialogSelected = dialogSelected
  public initDialogInfo = initDialogInfo
  public toElement = toElement
}
