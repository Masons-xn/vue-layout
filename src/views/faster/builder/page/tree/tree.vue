<template>
  <div class="halo-tree">
    <tree-node
      :treeData="treeData"
      :options="options"
      @handleCheckedChange="handleCheckedChange"
    ></tree-node>
  </div>
</template>
<script lang="ts">
import TreeNode from "./tree-node.vue"
import { Component, Vue, Provide, Prop } from "vue-property-decorator"
@Component({
  components: {
    TreeNode
  }
})
export default class Tree extends Vue {
  @Prop({ default: () => [] }) private treeData: any[]
  @Prop({ default: () => [] }) private options: object[]
  private search = ""
  private store: object = {
    root: [],
    last: null
  }
  private handleCheckedChange(node: any) {
    this.$emit("handleCheckedChange", node)
  }
  private getSelectedNodeIds() {
    //@ts-ignore
    const allNodes = this.store.datas
    const selectedNodeIds:any = []
    for (const node of allNodes) {
      if (node.checked) {
        selectedNodeIds.push(node.id)
      }
    }
    return selectedNodeIds
  }
}
</script>
<style scoped></style>
