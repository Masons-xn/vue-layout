<template>
  <div :id="unitid">
    <div @click="unitSelect"
         @dblclick="unitEdit"
         draggable="true"
         @dragstart="unitMove"
         @dragleave="unitRemove"
         :class="(draggable ? 'unit-developing ' : ' ') + (unitSelected ? 'unitIsSelected ' : ' ')">
      <el-select v-model="value"
                 placeholder="请选择"
                 v-if="draggable"
                 value="">
        <el-option v-for="item in option"
                   :key="item.value"
                   :label="formtter(item, 'optionlabel')"
                   :value="formtter(item, 'optionvalue')"> </el-option>
      </el-select>
      <el-select v-model="value"
                 :disabled="disabled"
                 placeholder="请选择"
                 v-if="!draggable"
                 value="">
        <el-option v-for="item in option"
                   :key="item.value"
                   :label="formtter(item, 'optionLabel')"
                   :value="formtter(item, 'optionValue')"> </el-option>
      </el-select>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Provide, Vue, Watch } from "vue-property-decorator"
import { RenderType, unitDataPath, UnitType } from "../../builder/core/decorators"
import dev from "../../builder/mixin/unitmixin"
import bus from "../../builder/core/eventbus"
@Component({
  mixins: [dev]
})
@UnitType("element")
@unitDataPath("rbSelect")
@RenderType("下拉框")
export default class RbSelect extends Vue {
  [x: string]: any
  @Prop({ default: "文字", dataType: "string", valueBus: [], des: "左侧label", alias: "文字" } as any) private formLabel: string
  @Prop({ default: "", dataType: "string", valueBus: [], des: '含有"/"请求数据的地址,单独的string 是字典', alias: "数据源" } as any) private DataUrl: string
  @Prop({ default: "id", dataType: "string", valueBus: [], des: "展示值", alias: "自定义显示值数据键" } as any) private optionValue: string
  @Prop({ default: "label", dataType: "string", valueBus: [], des: "展示key", alias: "自定义显示文字" } as any) private optionLabel: string
  @Prop({ default: "id", dataType: "string", valueBus: [], des: "存储key", alias: "数据键" } as any) private dataKey: string
  @Prop({ default: "", dataType: "string", valueBus: [], des: "存储值", alias: "存储值" } as any) private value: string
  @Prop({ default: false, dataType: "boolean", readonly: "readonly", valueBus: [true, false], des: "禁用", alias: "是否禁用" } as any) private disabled: boolean
  @Prop({ default: false, dataType: "boolean", readonly: "readonly", valueBus: [true, false], des: "隐藏", alias: "是否隐藏" } as any) private isvisible: boolean
  option: any[] = []
  loadData() {
    const _this = this
    if (_this.mode !== "pro") {
      this.option = []
      this.value = ""
      return
    }
    if (_this.DataUrl.indexOf("/") > -1) {
      // this.$api(_this.DataUrl.replace("/", "")).then(resp => {
      //   if (resp.result && resp.result.list) {
      //     _this.option = resp.result.list
      //   } else {
      //     console.error("option data source is error!")
      //   }
      // })
      // console.log(this.$trans(_this.DataUrl, true, _this.DataUrl))
      const data = this.$trans(_this.DataUrl, true, _this.DataUrl)
      if (!!data && (typeof data === "object" || typeof data === "function") && typeof data.then === "function") {
        data.then(res => {
          this.option = res
        })
      } else {
        this.option = data
      }
    } else {
      this.option = this.$trans(_this.DataUrl, true)
    }
  }
  formtter(item, type) {
    return item[this[type]]
  }
  setprop() {
    bus.trigger("formItemSetLabel", this)
  }
  created() {
    // const _this = this,
    // select = this.$options.components["el-select"],
    // option = this.$options.components["el-option"]
    // select.mixins.push({
    //   created: function () {
    //     let parent = this
    //     option.computed.parent = function (argument) {
    //       return parent
    //     }
    //   }
    // })
    // this.unitInit(['loadData']);
  }
  mounted() {
    const _this = this
    if (!(_this.unitPid && _this.unitPid.indexOf("rbform") > -1)) {
      delete this.$props.formlabel
    } else {
      bus.trigger("formItemSetLabel", this)
    }
  }
  beforeDestroy() {
    bus.trigger("formItemremoveLabel", this)
  }
  @Watch("formLabel")
  onFormLabelChange() {
    this.setprop()
  }

  @Watch("mode")
  onModelChange() {
    this.unitInit(["loadData"])
  }
}
</script>

<style lang="less" scoped></style>
