<template>
  <div :id="unitid" :draggable="draggable" @dragstart="unitMove" @dragover="unitdragmove" @dblclick="unitEdit" :class="(draggable ? 'unit-developing ' : ' ') + (unitSelected ? 'unitIsSelected ' : ' ')" @click="unitSelect">
    <el-input v-model="value" :type="inputType" :placeholder="placeholder" :disabled="disabled" v-if="draggable"></el-input>
    <el-input
      v-model="value"
      :style="inputstyle"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="disabled"
      v-btverification="{
        rule: isrequire,
        value: value,
        id: unitid,
        msg: errMsg
      }"
      v-if="!draggable"
    ></el-input>
  </div>
</template>
<script lang="ts">
import ElementUI from "element-ui"
import dev from "../../builder/mixin/unitmixin"
import verifiCateminxin from "../../builder/mixin/verificateminxin"
import bus from "../../builder/core/eventbus"
import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import { RenderType, unitDataPath, UnitType } from "../../builder/core/decorators"
@Component({
  mixins: [dev, verifiCateminxin],
  components: {
    "el-input": ElementUI.Input
  }
})
@UnitType("element")
@unitDataPath("rbInput")
@RenderType("输入框")
export default class RbInput extends Vue {
  [x: string]: any

  @Prop({ default: "文字",
    dataType: "string",
    valueBus: [],
    des: "左侧label",
    alias: "文字"
  } as any)
  private formLabel: string

  @Prop({
    default: "",
    dataType: "string",
    valueBus: [],
    des: "输入框的值",
    alias: "值"
  } as any)
  private value: string

  @Prop({
    default: "请输入内容",
    dataType: "string",
    valueBus: [],
    des: "string",
    alias: "占位符"
  } as any)
  private placeholder: string

  @Prop({
    default: "",
    dataType: "string",
    valueBus: [],
    des: "key",
    alias: "数据键"
  } as any)
  private dataKey: string

  @Prop({
    default: "",
    dataType: "string",
    readonly: "readonly",
    valueBus: ["text", "textarea"],
    des: "类型",
    alias: "类型"
  } as any)
  private inputType: string

  @Prop({
    default: false,
    dataType: "boolean",
    readonly: "readonly",
    valueBus: [true, false],
    des: "禁用",
    alias: "是否禁用"
  } as any)
  private disabled: boolean

  @Prop({
    default: false,
    dataType: "boolean",
    readonly: "readonly",
    valueBus: [true, false],
    des: "隐藏",
    alias: "是否隐藏"
  } as any)
  private isvisible: boolean
  // ...props
  get inputstyle() {
    const style = {}

    Object.assign(style, { display: this.isvisible ? "none" : "" })
    return style
  }
  setprop() {
    if (!this.ishide) {
      bus.trigger("formItemSetLabel", this)
    }
  }
  mounted() {
    // console.log(this.unitPid)
    //   if (!(this.unitPid && this.unitPid.indexOf("rbform") > -1)) {
    //       delete this.$props.formLabel
    //   } else {
    bus.trigger("formItemSetLabel", this)
    // }
  }
  beforeDestroy(): void {
    bus.trigger("formItemremoveLabel", this)
  }
  @Watch("formLabel")
  onformLabelChange() {
    this.setprop()
  }
}
</script>
