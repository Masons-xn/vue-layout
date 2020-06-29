<template>
  <div @dblclick="unitEdit"
       v-if="dialogVisible"
       :id="unitid">
    <dragpanel center="center">
      <div class="el-dialog__header">
        <span class="el-dialog__title">{{ title }}</span>
        <i class="el-dialog__headerbtn icon el-icon-close"
           @click="handleClose"></i>
      </div>
      <div class="rb-dialog__body"
           :style="getStyle">
        <div :class="dialogclass"
             @dragover="unitdragmove"
             @drop="unitDrop"
             :id="id"
             :nodeparent="unitid"
             v-for="(id,index) of getIds"
             :key="index">
          <container v-for="item of childCom"
                     :renId="item.unitID"
                     :key="item.unitID"> </container>
        </div>
      </div>
    </dragpanel>
  </div>
</template>
<script lang="ts">
import container from "../../builder/page/container.vue"
import dev from "../../builder/mixin/unitmixin"
import bus from "../../builder/core/eventbus"
import Dragpanel from "../../builder/page/dragPanel/dragPanel.vue"
import { Component, Vue, Provide, Prop, Watch } from "vue-property-decorator"
import { RenderType, unitDataPath, UnitType } from "../../builder/core/decorators"
@Component({
  mixins: [dev],
  components: {
    container,
    Dragpanel
  }
})
@UnitType("container")
@unitDataPath("rbDialog")
@RenderType("对话框")
export default class RbDialog extends Vue {
  [x: string]: any
  @Prop({ default: "窗口", dataType: "string", valueBus: [], des: "title", alias: "窗口标题" } as any) private title: string
  // @Prop({ default: "", dataType: "string", valueBus: [], des: "文件地址", alias: "文件地址" } as any) private path: string
  @Prop({ default: "600px", dataType: "string", valueBus: [], des: "窗口高度", alias: "窗口高度" } as any) private height: string
  @Prop({ default: "800px", dataType: "string", valueBus: [], des: "窗口宽度", alias: "窗口宽度" } as any) private width: string
  @Prop({ default: "", dataType: "string", valueBus: [], readonly: "readonly", des: "不用填写", alias: "不用填写" } as any) private ids = ""
  dialogVisible = true
  private childCom: any[]
  get dialogclass() {
    return "rb-dialog-content container " + (this.mode === "dev" ? "developing" : "") + " "
  }
  get getStyle() {
    return Object.assign({ height: this.height }, { width: this.width })
  }
  get getIds() {
    const ids = this.ids.length > 0 ? [this.ids] : [this.newContainerId()]
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
  public handleClose() {
    bus.trigger("dialogColse", this.unitid)
    // this.dialogVisible = false
  }
  public loadpage() {
    const _this = this
  }
  @Watch("title")
  onTitleChange() {
    bus.trigger("dialogmanage", { unitId: this.unitid, title: this.title })
  }
  // @Watch("path", { immediate: true })
  // onPathChange() {
  //   this.loadpage()
  // }
  @Watch("mode")
  onModeChange() {
    this.unitInit(["loadpage"])
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__title {
  font-size: 16px;
}
.rb-dialog__body {
  display: flex;
  .rb-dialog-content {
    width: 100%;
  }
}
</style>
