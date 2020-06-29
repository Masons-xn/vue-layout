/**
 * Created by xining.lao on 6/15/2017.
 */
import rebornUI from "../../components"
import { pageInfo } from "./baseinfo"
import { Fast } from "./config"
import { Component, Provide, Vue } from "vue-property-decorator"
import _ from "lodash"
function setPageInfo() {
  // @ts-ignore
  const that = this
  that.editPageName = true
  that.pageName = pageInfo.name
  that.pageid = pageInfo.id
  that.mongoid = pageInfo._id
  that.projectid = pageInfo.projectid
  that.files = pageInfo.files
  that.initMethods = pageInfo.initMethods
  that.routerPath = pageInfo.route
}
function submit() {
  // 保存
  // @ts-ignore
  const that: any = this
  that.isSubmitIng = true
  that.pageconfig = {}
  that.pageconfig.Rblayout = []
  that.pageconfig.Element = []
  const tempConfig = _.cloneDeep(that.config)
  const delay = Fast.delayUnit
  if (delay.length > 0) {
    delay.map(function (item: { config: { isAsyn: string } }) {
      item.config.isAsyn = "1"
    })
  }
  const config = tempConfig.concat(delay)
  function jsonStructure(config: any[]) {
    config.map(function (item) {
      item.childCom ? delete item.childCom : ""
      delete item.config.childCom
      _.forIn(item.config, (value, key) => {
        item[key] = value
      })
      if ((item.unitType === "layout" || item.unitType === "container") && !item.notSave) {
        that.pageconfig.Rblayout.push(item)
      } else if (item.unitType === "element" && !item.notSave) {
        that.pageconfig.Element.push(item)
      }
    })
  }
  jsonStructure(config)
  if (pageInfo.rbelement && pageInfo.rbelement[0]) {
    const element = {}
    for (const key in pageInfo.rbelement[0]) {
      if (typeof pageInfo.rbelement[0][key] === "string") {
        element[key] = pageInfo.rbelement[0][key]
      }
    }
    that.pageconfig.rbelement = [element]
  }
  if (pageInfo.rbcontainer && pageInfo.rbcontainer[0]) {
    const rbcontainer = {}
    for (const key in pageInfo.rbcontainer[0]) {
      if (typeof pageInfo.rbcontainer[0][key] === "string") {
        rbcontainer[key] = pageInfo.rbcontainer[0][key]
      }
    }
    that.pageconfig.rbcontainer = [rbcontainer]
  }
  const base = _.cloneDeep(that.pageconfig),
    containerType: any[] = [],
    elementType: any[] = []
  if (!base.rbcontainer) {
    base.rbcontainer = [{}]
  }
  if (!base.rbelement) {
    base.rbelement = [{}]
  }

  if (base.Rblayout && base.Rblayout.length > 0) {
    base.Rblayout.map((item: { unitName: string }) => {
      const layoutType = item.unitName.toLowerCase()
      const layoutPath = new rebornUI[layoutType]().unitDataPath
      if (!base.rbcontainer[0][layoutType]) {
        base.rbcontainer[0][layoutType] = []
      }
      if (_.indexOf(containerType, layoutPath) === -1) {
        containerType.push(layoutPath)
      }
      base.rbcontainer[0][layoutType].push(item)
    })
  }
  if (base.Element && base.Element.length > 0) {
    base.Element.map(function (item) {
      const layoutType = item.unitName.toLowerCase()
      const layoutPath = new rebornUI[layoutType]().unitDataPath

      if (!base.rbelement[0][layoutType]) {
        base.rbelement[0][layoutType] = []
      }
      if (_.indexOf(elementType, layoutPath) === -1) {
        elementType.push(layoutPath)
      }
      base.rbelement[0][layoutType].push(item)
    })
  }
  delete base.Rblayout
  delete base.Element
  base.id = that.pageid
  base._id = that.mongoid
  base.name = that.pageName
  base.initMethods = that.initMethods
  base.files = that.files
  base.path = that.routerPath
  let needDel: any[] = []
  Fast.needDel.map((item: any) => {
    needDel.push({
      id: item.id,
      unitID: item.unitID,
      path: item.dataPath ? item.dataPath : item.unitID.substr(0, item.unitID.length - 6)
    })
  })
  needDel = _.remove(needDel, ch => {
    return !_.find(Fast.Config.concat(Fast.delayUnit), item => {
      return item.unitID === ch.unitID
    })
  })
  that.$api("fasterSavePage", { base, needDel }).then(res => {
    if (res.code === "200") {
      that.$message.success("保存成功！")
      that.$router.push('/')
    } else {
      that.$message.error(res.msg)
    }
  })
}
function removePage(item) {
  // @ts-ignore
  const that = this
  that.$confirm('确定删除页面："' + item.name + '"吗?', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    that.$axios.delete("/RbPageService/batchCascadeDelete", { data: [[item.id]] })
      .then(() => {
        that.loading = false
        that.$message({
          message: "删除成功！",
          type: "success"
        })
      })
  })
}
function submitCancle() {
  // @ts-ignore
  this.editPageName = false
}
@Component({})
export default class PageEdit extends Vue {
  public setPageInfo = setPageInfo
  public submit = submit
  public removePage = removePage
  public submitCancle = submitCancle
  public editPageName = false
  public isTemplate = false
  public isSubmitIng = false
}
