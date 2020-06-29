/**
 * Created by xining.lao on 6/15/2017.
 */
import bus from "./eventbus"
import rebornUI from "../../components"
import { pageInfo } from "./baseinfo"
import { unitsbind, unitsmothods } from "../unit/index"
import exportMethods from "./exportMethods"
import eventInit from "./eventsinit"
import { Fast } from "./config"
import { Component, Vue } from "vue-property-decorator"
import _ from "lodash"
import { DataOfUnit } from "./dataType"
bus.bind("pageReady", pageReady)
let file
let VueInstance
let autoBus = []
const extendMethods = {}
let base: {
  mode: string
  config: string | any[]
  unitEventBus: (arg0: string) => void
}
let isReady: boolean

function setProps(item, unitID) {
  // @ts-ignore
  const that = this
  if (!unitID) {
    unitID = that.editingUnitId
  }
  const fastUnit = that.getThisUnit({ unitID })
  if (unitID && fastUnit) {
    that.getThisUnit({ unitID }).config[item.key] = item.value
    if (Fast.Mapping[unitID]) {
      if (typeof item.value === "object") {
        fastUnit['config'][item.key] = item.value
        Fast.Mapping[unitID][item.key] = item.value
      } else {
        fastUnit['config'][item.key] = item.value
        Fast.Mapping[unitID][item.key] = item.value
      }
    }
  }
}
function busEventsOn(events) {
  _.forIn(events, (value, key) => {
    bus.bind(key, value)
  })
}

function clearList() {
  // @ts-ignore
  const that = this
  that.elements[0].arr = []
  that.elements[1].arr = []
  that.elements[2].arr = []
}
function mulUnitDraw(units) {
  // @ts-ignore
  const that = this
  const temp = that.config.concat(units)

  that.config = []
  setTimeout(() => {
    that.config = temp
  })
}
function loadData(id, notClear, pid) {
  // @ts-ignore
  if (this.editPageName) {
    // @ts-ignore
    this.editPageName = false
  }
  // @ts-ignore
  const that = this
  let configTemp = []
  let requestType = ["container", "element"]
  // @ts-ignore
  base = this
  that.pageloading = true
  // @ts-ignore
  Fast.route = this.$route
  // @ts-ignore
  Fast.store = this.$store
  // if (!notClear) {
  that.clearPage()
  // }
  const pageFilter = that.axiosfilter({ path: id })
  // @ts-ignore
  this.$api("fasterQueryPage", { path: id }).then(resp => {
    const page = resp.result
    if (page) {
      if (!notClear) {
        pageInfo.initMethods = page.initMethods
        pageInfo.name = page.name
        pageInfo.files = page.files
        pageInfo.route = page.path
        pageInfo.id = page.id
        pageInfo._id = page._id
        pageInfo.rbcontainer = page.rbcontainer
        pageInfo.rbelement = page.rbelement
      }
      file = page.files
      buildConfig(page.rbcontainer[0], "container")
      buildConfig(page.rbelement[0], "element")
    } else {
      // @ts-ignore
      this.$router.push("404")
    }
  })
  function buildConfig(unit, types) {
    requestType = _.remove(requestType, item => {
      return item !== types
    })
    for (const type in unit) {
      if (type.indexOf("rb") === 0 && Array.isArray(unit[type])) {
        const unitCommon = []
        unit[type].map(item => {
          if (!item.unitPid) {
            item.unitPid = pid
          }
          // item.notSave = !pid
          item.unityype = item.unitID.substr(0, item.unitID.length - 6)
          item.unitType = new rebornUI[item.unityype]().unitType
          item.unitName = rebornUI[item.unityype].name
          item.config = {}
          item.unitIndex = parseInt(item.unitIndex, 0)
          _.forIn(item, (value, key) => {
            if (!(key.indexOf("unit") > -1 || key === "config" || key === "containerID" || key === "id")) {
              item.config[key] = value
            }
          })
          item.childCom = []
          if (item.isAsyn) {
            Fast.delayUnit.push(item)
            if (that.delayUnit) {
              that.delayUnit.push(item)
            }
          } else {
            // @ts-ignore
            unitCommon.push(item)
          }
        })
        configTemp = configTemp.concat(unitCommon)
      }
    }
    if (requestType.length === 0) {
      that.config = that.config.concat(_.cloneDeep(configTemp))
      that.containerstate = false
      that.files = file
      if (file) {
        require.ensure([], () => {
          that.pageInit({
            method: require("../../../../methods/" + file + ".js")
          })
        })
      } else {
        that.pageInit()
      }
      if (that.pageloading) {
        that.pageloading = !that.pageloading
      }
      if (that.initDialogInfo) {
        that.initDialogInfo()
      }
    }
  }
}
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
function pageReady(id?: undefined) {
  if (id) {
    // @ts-ignore
    unitBus.push(id)
  }
  function checkReady() {
    if (base && base.mode === "pro" && isReady) {
      if (unitBus.length === base.config.length) {
        if (pageInfo.initMethods) {
          base.unitEventBus(pageInfo.initMethods)
        }
        doInit()
      }
    }
  }
  checkReady()
}

function pageInit(obj) {
  // @ts-ignore
  const that = this
  if (obj && obj.event) {
    // @ts-ignore
    autoBus.push({ name: obj.event.name, arg: obj.event.arg })
  }
  pageBuilding()
  function pageBuilding() {
    if (obj && obj.method) {
      _.forIn(obj.method, (value, key) => {
        Fast.evetns[key] = value
      })
      if (pageInfo.initMethods) {
        base.unitEventBus(pageInfo.initMethods)
      }
    }
    methodsCommon(that)
    isReady = true
    pageReady()
  }
}
let unitBus = []
function doInit() {
  if (autoBus.length > 0) {
    const eve = autoBus[0]
    autoBus = _.remove(autoBus, str => {
      eve !== str
    })
    // @ts-ignore
    const event = eve.name
    // @ts-ignore
    bus.trigger(event, eve.arg)
    doInit()
  }
}

function unitByid(id) {
  if (Fast.Mapping[id]) {
    return Fast.Mapping[id]
  }
  // console.warn("不存在id 为：" + id + "的组件")
  return ""
}

function unitEventBus(name, arg?) {
  // @ts-ignore
  let that = this
  if (!that) {
    that = VueInstance
  }
  if (Fast.mode !== "pro") {
    // console.warn('正在 ' + Fast.mode + ' 模式')
    return
  }
  if (name === "routerChange") {
    that.$router.push(arg).then()
    return
  }
  if (Fast.evetns[name]) {
    Fast.evetns[name](unitByid, extendMethods, arg)
  }
}
function routerTo(path: any) {
  unitEventBus("routerChange", path)
}
function getThisParent(pid: any) {
  // @ts-ignore
  const that = this
  pid = pid ? pid.unitPid : that.unitPId
  return Fast.Mapping[pid]
}

function getThisUnit(id: { unitID: any }) {
  // @ts-ignore
  const that = this
  id = id ? id.unitID : that.unitID
  return _.find(Fast.Config, item => {
    return item.unitID === id
  })
}
function clearPage(mode?: string) {
  // @ts-ignore
  const that = this
  Fast.delayUnit = []
  // Fast.needDel = []
  if (mode === "dev") {
    Fast.mode = mode
    that.setModel(mode)
  }
  if (unitBus.length > 0) {
    unitBus = []
  }
  let com: any[] = []

  _.forIn(Fast.Mapping, value => {
    com.push(value)
  })
  // @ts-ignore
  com = this.sorteddata(com)
  const len = com.length - 1

  function removeByIndex(lens: number) {
    if (lens >= 0) {
      const unit = com[lens]
      that.unitDelete(unit)
      lens--
      removeByIndex(lens)
    }
  }

  removeByIndex(len)
  if (!pageInfo.id) {
    pageInfo.id = ""
    pageInfo.name = ""
    pageInfo.files = ""
    pageInfo.initMethods = ""
    pageInfo.route = ""
    pageInfo.projectid = ""
  }
}
function isAsyn(id: any) {
  const test = _.find(Fast.delayUnit, ch => {
    return ch.unitID === id
  })

  return Boolean(test)
}
function unitDelete(unit: { unitID: string | number; unitPid: string }) {
  // @ts-ignore
  const that = this
  // console.log(unit.unitPid)
  const unitRemoveInner = (units: { unitID: any; inAsyn?: any; id?: any; $el?: any; $destroy?: any; $children?: any, unitPid?: string }) => {
    that.config = _.remove(that.config, (item: DataOfUnit) => {
      return item.unitID !== units.unitID
    })
    // if (units.inAsyn !== "1" && units.id) {
    //   if (!_.find(Fast.needDel, item => { return item.unitID === units.unitID })) {
    //     Fast.needDel.push(units)
    //   }
    // }
    if (units.$el) {
      units.$destroy()
    } else if (Fast.Mapping[units.unitID] && Fast.Mapping[units.unitID].$el) {
      Fast.Mapping[units.unitID].$destroy()
    }
    delete Fast.Mapping[units.unitID]
    if (unit && unit.unitPid && Fast.Mapping[unit.unitPid]) {
      Fast.Mapping[unit.unitPid].childCom = _.remove(Fast.Mapping[unit.unitPid].childCom, (item: DataOfUnit) => item.unitID !== unit.unitID)
    }
    units.$children = []
  }

  if (unit) {
    const childUnits = that.getchildUnits(Fast, unit)
    unitRemoveInner(unit)
    childUnits.map((item: { unitID: any; inAsyn?: any; id?: any; $el?: any; $destroy?: any; $children?: any }) => {
      unitRemoveInner(item)
    })
  }
  // let
}
function ajaxAddUnits() {
  // @ts-ignore
  this.loadData()
  // that.loadData(earg.id,true,earg.pid)
}
function EventsOn(mode: string) {
  // @ts-ignore
  const that = this
  const binds = {}
  const builderBind = eventInit(mode)
  _.forIn(unitsbind, (value, key) => {
    // @ts-ignore
    binds[key] = value(that)
  })
  _.forIn(builderBind, (value, key) => {
    binds[key] = value.bind(that)
  })
  const events = binds

  busEventsOn(events)
}
@Component({})
export default class Core extends Vue {
  public EventsOn = EventsOn
  public setProps = setProps
  public mulUnitDraw = mulUnitDraw
  public clearPage = clearPage
  public unitDelete = unitDelete
  public loadData = loadData
  public clearList = clearList
  public pageInit = pageInit
  public unitEventBus = unitEventBus
  public getThisParent = getThisParent
  public getThisUnit = getThisUnit
  public isAsyn = isAsyn
  public ajaxAddUnits = ajaxAddUnits
  public routerTo = routerTo
  beforeCreate(): void {
    _.forIn(unitsmothods(), (value, key) => {
      // @ts-ignore
      this[key] = value.bind(this)
    })
    VueInstance = this
  }
}
