<template>
  <div :class="buttonClass" :draggable="draggable" @dragstart="unitMove" @dragover="unitdragmove" @dblclick="unitEdit" @drop="unitDrop" @click="unitSelect">
    <el-button :type="type" size="mini" @click="etrigger" :disabled="disabled">
      {{ label }}
    </el-button>
  </div>
</template>
<script lang="ts">
import dev from "../../builder/mixin/unitmixin"
import bus from "../../builder/core/eventbus"
import { Component, Vue, Prop } from "vue-property-decorator"
import { RenderType, unitDataPath, UnitType } from "../../builder/core/decorators"
@Component({
  mixins: [dev]
})
@UnitType("element")
@RenderType("按钮")
@unitDataPath("rbbutton")
export default class RbButton extends Vue {
  [x: string]: any
  @Prop({ default: "100%" }) private width = "100%"
  @Prop({
    default: "按钮",
    dataType: "string",
    valueBus: ["新增", "删除", "保存"],
    des: "按钮文字",
    alias: "按钮文字"
  } as any)
  private label: string

  @Prop({
    default: "primary",
    dataType: "string",
    valueBus: ["no", "primary", "danger", "warn", "success"],
    des: "强调",
    alias: "显示颜色",
    readonly: "readonly"
  } as any)
  private type: string

  @Prop({
    default: "",
    dataType: "string",
    valueBus: ['saveAndReload','saveAndBack'],
    des: '点击事件 以"/"开头默认是路由',
    alias: "事件"
  } as any)
  private eclick: string

  @Prop({
    default: false,
    dataType: "boolean",
    valueBus: [false, true],
    des: "禁用",
    alias: "禁用"
  } as any)
  private disabled: boolean

  get buttonClass() {
    let calssname = "rb-button"

    calssname = calssname + " "
    if (this.draggable) {
      calssname = calssname + " unit-developing"
    }
    if (this.unitSelected) {
      calssname = calssname + " unitIsSelected"
    }
    return calssname
  }
  etrigger() {
    if (this.mode !== "dev") {
      if (this.eclick.indexOf("/") === -1) {
        if (this.eclick === 'saveAndReload') {
          bus.trigger("saveAndReload",{})
        }else if(this.eclick === 'saveAndBack'){
          bus.trigger("saveAndBack",{})
        }
        else {
          bus.trigger("Events", {
            name: this.eclick,
            arg: "aaa"
          })
        }
      }else {
        bus.trigger("Events", {
          name: "routerChange",
          arg: this.eclick
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rb-button {
  max-height: 55px;
  width: auto;
  + .rb-button {
    margin-left: 10px;
  }
}
</style>
