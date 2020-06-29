<script lang="tsx">
import { Component, Vue, Provide, Prop } from "vue-property-decorator"
import _ from "lodash"
import bus from "../core/eventbus"
import rebornUI from "../../components"
import { Fast } from "../core/config"
import container from "./container.vue"
import { DataOfUnit } from "../core/dataType"
@Component({
  components: {
    container
  }
})
export default class CustomPage extends Vue {
  @Prop({ default: {} }) private config: DataOfUnit[] | []
  private renderBus: any[] = []
  private render() {
    const pageconfig = _.cloneDeep(this.structureConfig) || []
    // @ts-ignore
    let structures = <div class="custonmpage"></div>
    function buildstructure(structures: any, config: any) {
      for (const item of config) {
        if (item && !item.unitPid && item.unitID.indexOf("dialog") === -1) {
          const id = item.unitID
          const cname = id.substr(id.length - 5, 5)
          // @ts-ignore
          const thatStructure: any = (<container len={pageconfig.length} renId={id} conname={cname}  ></container>)
          if (!structures.children) {
            structures.children = []
          }
          structures.children.push(thatStructure)
          thatStructure.children = []
        }
      }
      return structures
    }
    function buildDialog(structures: any, config: any) {
      for (const item of config) {
        if (item && item.unitID.indexOf("dialog") > -1) {
          const id = item.unitID
          const cname = id.substr(id.length - 5, 5)
          // @ts-ignore
          const thatStructure: any = (<container class="dialog" renId={id} conname={cname}></container>)
          if (!structures.children) {
            structures.children = []
          }
          structures.children.push(thatStructure)
          thatStructure.children = []
        }
      }
      return structures
    }
    structures = buildstructure(structures, pageconfig)
    structures = buildDialog(structures, pageconfig)
    return structures
  }

  private created() {
    bus.bind("containerReady", id => {
      bus.trigger("unitRender", id)
    })
  }

  private renderDiff() {
    const that = this
    const temp = _.cloneDeep(this.config) || []
   
    that.renderBus = []
    // @ts-ignore
    temp.map((item: DataOfUnit) => {
      if (
        !(that.$parent as any).getcom(item.unitID) &&
        !(that.$parent as any).isAsyn(item.unitID)
      ) {
        that.renderBus.push(item)
      }
    })
    if (that.renderBus.length > 0) {
      that.rederUint()
    }
  }

  private rederUint() {
    const that = this
    const item = that.renderBus[0]
    let Unit = item.unitID
    const Unitname = Unit.substr(0, Unit.indexOf("-"))
    const unitID = item.unitID

    Unit = new Vue(rebornUI[Unitname])
    Unit.unitID = unitID
    if (Unitname === "rbdialog") {
      Unit.unitPid = ""
    }
    _.forIn(item, (value, keyItem) => {
      if (value) {
        Unit[keyItem] = value
      }
      if (keyItem === "config") {
        _.forIn(value, (values, keys) => {
          if (values) {
            Unit[keys] = values
          }
        })
      }
    })
    Unit.$store = Fast.store
    Unit.$axios = Fast.axios
    Unit.router = Fast.route
    bus.trigger("editSelect", Unit)
    if (item.unitPid) {
      bus.trigger("pushIntoParent", item)
    } else {
      Unit.$mount("#" + unitID)
    }
    const key = "unitID"

    Unit[key] = unitID
    if (Unitname === "rbdialog") {
      bus.trigger("dialogManage", { unitID, title: "窗口" })
    }
    bus.trigger("addUnit", { id: unitID, vue: Unit })
    that.renderDiff()
  }
  get structureConfig() {
    const temp: DataOfUnit[] = _.cloneDeep(this.config) || []

    return _.remove(temp, items => {
      return items.unitPid === undefined || items.unitPid === ""
    })
  }
  private updated() {
    this.renderDiff()
  }
}
</script>
<style lang="scss">
.custonmpage {
  width: 100%;
  height: 100%;
  flex: auto;
  position: relative;
  display: flex;
}
</style>
