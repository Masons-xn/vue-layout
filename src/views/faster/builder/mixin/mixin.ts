/**
 * Created by xining.lao on 6/9/2017.
 */
import Drag from "./drag"
import Fast from "../core/config"
import _ from "lodash"
import { Component, Prop, Provide, Vue } from "vue-property-decorator"

@Component({
  mixins: [Drag]
})
export default class Devmix extends Vue {
  @Prop({
    default: () => {
      return []
    }
  })
  public childCom: any[]
  private mode = ""
  private unitID = ""
  private config: any = []
  private pageStructure: any
  private unitType: any
  public getchildUnits(Fast: { Config: any }, id: { unitID: any }) {
    let child: any[] = []
    id = id ? id.unitID : this.unitID
    function getchildrens(id: { unitID: any }) {
      const exit = _.filter(Fast.Config, { unitPid: id })
      if (exit.length > 0) {
        child = child.concat(exit)
        exit.map(items => {
          getchildrens(items.unitID)
        })
      }
    }
    getchildrens(id)
    return child
  }

  public sorteddata(data: any[]) {
    function compare(property: string) {
      return function(a: { [x: string]: any }, b: { [x: string]: any }) {
        const value1 = a[property]
        const value2 = b[property]
        return value1 - value2
      }
    }
    return data.sort(compare("unitIndex"))
  }
  public axiosfilter(obj: any) {
    const filter = {
      where: [
        {
          and: []
        }
      ]
    }
    _.forIn(obj, function(value, key) {
      // @ts-ignore
      filter.where[0].and.push({ field: key, operator: 1,type: "String",  value: value })
    })
    return filter
  }

  get sortconfig() {
    Fast["Config"] = this.sorteddata(this.config)
    if (Fast["Config"][Fast["Config"].length - 1]) {
      Fast["Index"] = Fast["Config"][Fast["Config"].length - 1].unitIndex + 1
    }
    if (this.pageStructure) {
      const config = this.sorteddata(this.config)

      this.pageStructure(config)
    }
    return Fast["Config"]
  }

  public getcom(id: string) {
    return Fast["Mapping"][id]
  }
}
