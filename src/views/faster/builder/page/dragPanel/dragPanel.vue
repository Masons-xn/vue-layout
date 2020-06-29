<template>
  <div class="dragable_area" :style="panelPosition" @mousemove="eDragStart" @dragstart="eDragStart" @dragend="eDragEnd" :draggable="ismove">
    <div class="dragablepanel" ref="panel" @mousemove="notDrag">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide, Prop } from "vue-property-decorator"
import drag from "../../mixin/drag"
@Component
export default class DragPanel extends Vue {
  private position: any = { x: 600, y: 70 }
  private dragstart: any = { x: 0, y: 0 }
  @Prop({default:false}) private center:boolean
  private width = ""
  private height = ""
  private ismove = false
  private firstLoad = false
  get panelPosition() {
    const body = document.body
    const style = {}
    let left = this.position.x
    let top = this.position.y
    const leftMax = body.offsetWidth
    const topMax = body.offsetHeight
    let innerHeight = 0
    let innerWidth = 0
    const key = "panel"
    if (this.$refs && this.$refs[key]) {
      innerWidth = (this.$refs[key] as any).offsetWidth
      innerHeight = (this.$refs[key] as any).offsetHeight
     
    }
    left = left > leftMax - innerWidth ? leftMax - innerWidth : left
    top = top > topMax - innerHeight ? topMax - innerHeight : top
    if(this.center && this.firstLoad){
      left = (leftMax - innerWidth) /2
      this.position.x = left
    }
    Object.assign(style, { left: left + "px", top: top + "px" })
    return style
  }
  private eDragStart(e: { pageX: any; pageY: any; stopPropagation: () => void }) {
    this.dragstart.x = e.pageX
    this.dragstart.y = e.pageY
    this.ismove = true
    new drag().modeChange("panelmove")
    e.stopPropagation()
  }
  private eDragEnd(e: { pageX: number; pageY: number; stopPropagation: () => void }) {
    if (!this.ismove) {
      return
    }
    this.firstLoad = false
    this.position.x = this.position.x + (e.pageX - this.dragstart.x) < 0 ? 0 : this.position.x + (e.pageX - this.dragstart.x)
    this.position.y = this.position.y + (e.pageY - this.dragstart.y) < 70 ? 70 : this.position.y + (e.pageY - this.dragstart.y)
    new drag().modeChange("add")
    e.stopPropagation()
    return
  }
  private notDrag(e: { stopPropagation: () => void }) {
    this.ismove = false
    e.stopPropagation()
  }
  created(): void {
    this.$nextTick(function () {
      // 此时已经渲染完成
      this.firstLoad = true
      // console.log((this.$refs['panel'] as any).offsetWidth)
    })
  }
}
</script>
<style scoped lang="scss">
.dragable_area {
  position: fixed;
  padding: 20px;
  z-index: 2001;
  cursor: move;
  border: 1px solid #bbb;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2) !important;
  background: #fdfdfd;
}
.resize-right {
  top: 0px;
  position: absolute;
  width: 5px;
  right: 0px;
  cursor: col-resize;
  height: 100%;
}
.resize-bottom {
  bottom: 0px;
  position: absolute;
  height: 5px;
  left: 0px;
  cursor: row-resize;
  width: 100%;
}
.dragablepanel_close {
  position: absolute;
  right: 0px;
}
.dragablepanel {
  resize: both;
  /*overflow:auto;*/
  cursor: default;
}
</style>
