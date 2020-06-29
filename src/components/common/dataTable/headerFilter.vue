<!-- 作者 xn-->
<!-- 时间 2019/9/10-->
<template lang="html">
  <div class="diy_header_filter">
    <el-popover
      placement="bottom"
      v-model="isShow"
      width="200"
      trigger="manual"
      content="200"
    >
      <div>
        <div class="filter_tree">
          <el-tree
            solt
            ref="tree"
            :data="data"
            show-checkbox
            node-key="id"
            :props="defaultProps"
          >
          </el-tree>
        </div>
        <div>
          <g-button button-type="search" @click="select" />
          <g-button button-type="clear" @click="clear" />
        </div>
      </div>
      <div
        @click="e => show(e)"
        slot="reference"
        :class="values.length > 0 ? 'filter_button filtering' : 'filter_button'"
      >
        <g-icon name="filter" />
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from "vue-property-decorator"

@Component
export default class HeaderFilter extends Vue {
  @Prop({ default: () => [] }) public data: any
  @Prop() public col: any
  @Prop({
    default: () => {
      return
    }
  })
  public change: any
  @Prop({
    default: () => {
      return
    }
  })
  public stateChange: any
  public values: any = []
  public isShow = false
  public defaultProps = {
    children: "children",
    label: "label"
  }
  public checked: any = []
  public select() {
    this.values = (this.$refs.tree as any).getCheckedKeys()
    this.change(this.col, this.values)
    this.show()
  }
  public clear() {
    if (this.values.length > 0) {
      (this.$refs.tree as any).setCheckedKeys([])
      this.values = []
      this.change(this.col, this.values)
    }
    this.show()
  }
  public show(e?: { stopPropagation: () => void } | undefined) {
    this.isShow = !this.isShow
    if (this.isShow) {
      this.stateChange(this.col.prop)
    }
    if (e) {
      e.stopPropagation()
    }
  }
}
</script>

<style scoped lang="scss"></style>
