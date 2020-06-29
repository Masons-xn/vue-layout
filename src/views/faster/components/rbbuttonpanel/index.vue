<template>
  <div :class="(draggable ? 'unit-developing ' : ' ') + (unitSelected ? 'unitIsSelected ' : ' ') + ' rb-button-panel'" @click="unitSelect">
    <div draggable="true" @dragstart="unitMove" @dragover="unitdragmove" @drop="unitDrop" @dblclick="unitEdit" v-if="mode === 'dev'">
      <div :class="buttonpaneinner" v-for="id of getIds" :id="id" :nodeparent="unitid">
        <container v-for="item of childCom" :renId="item.unitID" :key="item.unitID"> </container>
      </div>
    </div>
    <div v-if="mode != 'dev'">
      <div :class="buttonpaneinner" v-for="id of getIds" :id="id" :nodeparent="unitid">
        <container v-for="item of childCom" :renId="item.unitID" :key="item.unitID"> </container>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import container from "../../builder/page/container.vue"
import dev from "../../builder/mixin/unitmixin"
import { UnitType, unitDataPath, RenderType } from "../../builder/core/decorators"
import bus from "../../builder/core/eventbus"
@Component({
  mixins: [dev],
  components: {
    container
  }
})
@UnitType("layout")
@unitDataPath("rbbuttonpanel")
@RenderType("按钮容器")
export default class RbButtonPanel extends Vue {
  [x: string]: any

  @Prop({
    default: "righttoleft",
    dataType: "string",
    valueBus: ["lefttoright", "righttoleft"],
    readonly: "readonly",
    des: "排列方向",
    alias: "排列方向"
  } as any)
  private direction: string
  @Prop({ default: "" }) private ids: string[]
  get buttonpaneinner() {
    const calssname = "container rb-button-panel-inner" + " " + this.direction + " " + (this.mode === "dev" ? "developing drag_Mask" : "")

    return calssname
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
}
</script>

<style lang="scss" scoped>
.rb-button-panel {
  width: 100%;
  padding: 1px;
  &:not(.unit-developing) {
    .rb-button-panel-inner {
      margin: 8px 0;
      min-height:40px;
      &.preview {
        border-bottom: 1px solid #e4e4e4;
      }
      display: flex;
      &.lefttoright {
        justify-content: flex-start;
      }
      &.righttoleft {
        justify-content: flex-end;
      }
    }
  }
  &.unit-developing{
    >div{
    }
    .rb-button-panel-inner {
      margin: 0;
      min-height:40px;
      &.preview {
        border-bottom: 1px solid #e4e4e4;
      }
      display: flex;
      &.lefttoright {
        justify-content: flex-start;
      }

      &.righttoleft {
        justify-content: flex-end;
      }
    }
  }
  .rb-button-panel-inner {
    &.preview {
      border-bottom: 1px solid #e4e4e4;
    }
    display: flex;
    &.lefttoright {
      justify-content: flex-start;
    }
    &.righttoleft {
      justify-content: flex-end;
    }
  }
  
}
</style>
