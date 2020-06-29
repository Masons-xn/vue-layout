<template>
  <div style="flex: auto;display: flex; height: 100%;" :class="(draggable ? 'unit-developing ' : ' ') + (unitSelected ? 'unitIsSelected ' : ' ')" @click="unitSelect" :draggable="draggable" @dragstart="unitMove" @dragover="unitdragmove" @dblclick="unitEdit">
    <div class="rb-page" element-loading-text="拼命加载中">
      <div :class="rbPageHeader" :id="ids[0]" :nodeparent="unitid" @dragover="unitdragmove" @drop="unitDrop">
        <div class="header-toolbar">
          <container v-for="item of getChild(ids[0])" :renId="item.unitID" :key="item.unitID"> </container>
        </div>
      </div>
      <div :class="rbPageContent" :id="ids[1]" :nodeparent="unitid" @dragover="unitdragmove" @drop="unitDrop">
        <container v-for="item of getChild(ids[1])" :renId="item.unitID" :key="item.unitID"> </container>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator"
import container from "../../builder/page/container.vue"
import dev from "../../builder/mixin/unitmixin"
import { UnitType, unitDataPath, RenderType } from "../../builder/core/decorators"

@Component({
  mixins: [dev],
  components: {
    container
  }
})
@UnitType("layout")
@unitDataPath("rbCommonLayout")
@RenderType("页面")
export default class RbCommonLayout extends Vue {
  get rbPageHeader() {
    return "rb-page-header container " + (this.mode === "dev" ? "developing drag_Mask " : "")
  }
  get rbPageContent() {
    return "rb-page-content container " + (this.mode === "dev" ? "developing drag_Mask" : "")
  }
  public unitID = ""
  private childCom: any[] = []
  private mode = "dev"
  private unitSelected: string | undefined
  private loading = false
  private ids: string[] = ["rbPageHeader", "rbPageContent"]
}
</script>

<style lang="scss" scoped>
.rb-page {
  flex: auto;
  display: flex;
  padding: 8px;
  flex-direction: column;
}

.rb-page-header {
  flex: 0;
  display: flex;
  height: 65px;
  justify-content: space-between;
  align-items: flex-start;

  .header-toolbar {
    height: 42px;
    display: flex;
    align-items: flex-start;
  }
}

.rb-page-content {
  flex: auto;
  overflow: hidden;
  overflow-y: auto;
  padding-top: 0px;
  display: flex;
  background: #fff;
}

.rb-page-footer {
  height: 42px;
  flex: none;
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-end;

  .footer-toolbar {
  }
}

.rb-page-sub-header {
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 8px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h4 {
    margin: 0;
    font-size: 14px;
    margin-right: auto;
  }
}

.subHeaderToolbar {
  display: flex;
  align-items: center;
}

.subHeaderToolbar > div {
  margin-left: 8px;
}

.rb-page-header .el-breadcrumb {
  font-size: 14px;
  line-height: 30px;
}
</style>
