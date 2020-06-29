<template>
  <div :draggable="draggable"
       @dragstart="unitMove"
       :class="formClass"
       @click="unitSelect"
       @dragover="unitdragmove"
       @dblclick="unitEdit"
       @drop="unitDrop"
       v-loading='loadingData'>
    <div class="tableConfig"
         v-if="mode === 'dev'">
      <g-icon name="md-flash"
              class="getDataBymodel"
              :size="24"
              @press="getDataByModel"
              v-if="mode === 'dev'" />
    </div>
    <el-form ref="form"
             :labelWidth="labelWidth"
             :class="rbForm"
             :id="id"
             :nodeparent="unitid"
             v-for="id of getIds"
             :key="id">
      <div v-for="item of childCom"
           :class="item.unitID"
           :key="item.unitID">
        <el-form-item :label="item.formLabel"
                      :class="(item.isrequire ? 'is-required ' : ' ') + (item.validateFail ? 'is-error ' : ' ')">
          <container :renId="item.unitID"> </container>
          <div class="el-form-item__error"
               v-if="item.validateFail">
            {{ item.errMsg ? item.errMsg : rule[item.isrequire].msg }}
          </div>
        </el-form-item>
        <!--        <container :renId="item.unitID" v-if="isDividerTitle(item)">-->
        <!--        </container>-->
      </div>
    </el-form>
  </div>
</template>
<script lang="ts">
import rule from "../../builder/config/verifivationRule"
import ElementUI from "element-ui"
import container from "../../builder/page/container.vue"
import dev from "../../builder/mixin/unitmixin"
import bus from "../../builder/core/eventbus"
import { Component, Vue, Provide, Prop, Watch } from "vue-property-decorator"
import { RenderType, unitDataPath, UnitType } from "../../builder/core/decorators"
import _ from "lodash"
import getData from "../../builder/unit/getDataFromModel"
import Fast from "../../builder/core/config"

@Component({
  mixins: [dev],
  components: {
    "el-form": ElementUI.Form,
    "el-form-item": ElementUI.FormItem,
    container
  }
})
@UnitType("container")
@unitDataPath("rbForm")
@RenderType("表单")
export default class RbForm extends Vue {
  [x: string]: any
  @Prop({
    default: "100px",
    dataType: "string",
    valueBus: ["150px"],
    des: "label的宽度",
    alias: "左侧宽度"
  } as any)
  private labelWidth: string

  @Prop({
    default: "",
    dataType: "string",
    des: "服务端接口",
    valueBus: [],
    alias: "保存地址"
  } as any)
  private addUrl: string

  @Prop({
    default: "",
    dataType: "string",
    des: "查看详细SU",
    valueBus: [],
    alias: "查看地址"
  } as any)
  private detailUrl: string
  private rule: any = rule
  id = ""
  dataid = ""
  loadingData = false
  @Prop({ default: "" }) private ids: string[] = []
  get rbForm() {
    return (this.mode === "dev" ? "developing" : "") + " rb-form-inner"
  }
  get formClass() {
    return (this.draggable ? "unit-developing " : " ") + (this.unitSelected ? "unitIsSelected " : " ") + "rb-form"
  }
  get getIds() {
    const ids = this.ids.length > 0 ? this.ids : [this.newContainerId()]
    const that = this
    bus.trigger("UnitChangeProps", {
      unit: that,
      change: {
        key: "ids",
        value: ids
      }
    })
    return ids
  }
  private setGetChildProp(child: any) {
    if (this.childCom) {
      child = child || _.cloneDeep(this.childCom)
      this.childCom = []
      this.childCom = child
    }
  }
  private isDividerTitle(unit: { unitName: string }) {
    return unit.unitName === "rb-dividertitle"
  }
  public loadDetial(id) {
    this.loadingData = true
    this.dataid = id
    this.$api(this.detailUrl, { id }).then(data => {
      this.childCom.map(item => {
        for (const key in data) {
          if (key === item.dataKey) {
            Fast.Mapping[item.unitID].value = data[key]
          }
        }
      })
      this.loadingData = false
    })
  }
  private getDataByModel() {
    getData(this.selectModel)
  }
  private selectModel(Model: { basicProperties: any; name: any; stTableName: string }) {
    const Properties = Model.basicProperties
    const that = this
    _.cloneDeep(this.childCom || []).map((item: any) => {
      bus.trigger("unitDelete", item)
    })
    const pid = this.unitid
    Properties.map((item: { name: string; stName: any; stColumnName: any }) => {
      if (item.name !== "id") {
        bus.trigger("UnitAdd", {
          unitPid: pid,
          unitName: "rbinput",
          config: {
            formLabel: item.stName,
            dataKey: item.stColumnName
          }
        })
      }
    })
    const modelName = Model.stTableName.replace(Model.stTableName[0], Model.stTableName[0].toUpperCase())
    that.addUrl = `save${modelName.toUpperCase()}`
    that.detailUrl = `get${Model.stTableName.toUpperCase()}`
    setTimeout(() => {
      bus.trigger("UnitChangeProps", {
        change: {
          key: "addUrl",
          value: that.addUrl
        },
        unit: that
      })
      bus.trigger("UnitChangeProps", {
        change: {
          key: "detailUrl",
          value: that.detailUrl
        },
        unit: that
      })
      bus.trigger("UnitChangeProps", {
        change: {
          key: "updateUrl",
          value: that.updateUrl
        },
        unit: that
      })
    }, 100)
  }
  private mounted() {
    if (this.mode !== "dev") {
      bus.trigger("pageInit", {
        event: { name: "formInit", arg: this.router.query }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.rb-form {
  width: 100%;
  position: relative;
  .rb-form-inner {
    width: 100%;
    min-height: 100%;
    padding: 8px 8px 0 8px;
  }
  .getDataBymodel {
    position: absolute;
    left: 10px;
    top: 20px;
    z-index: 100;
  }
}
</style>
