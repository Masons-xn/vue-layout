<!-- 作者 xn-->
<!-- 时间 2019/9/5-->

<template>
  <el-select v-model="values" placeholder="请选择" clearable multiple collapse-tags filterable size="mini" @remove-tag="selectChange">
    <el-option value="0" style="display: none"> </el-option>
    <el-tree solt ref="tree" :data="treeData" :check-strictly="checkStrictly" show-checkbox node-key="id" @check="handleCheckChange" :props="defaultProps"> </el-tree>
  </el-select>
</template>
<script lang="ts">
import { Vue, Component, Provide, Prop, Emit } from "vue-property-decorator"
@Component
export default class SelectTree extends Vue {
  get treeData() {
    this.$api("HierarchyToArray", JSON.parse(JSON.stringify(this.data))).then(res => {
      this.arrData = res
      if (this.value) {
        this.setDefault(this.value)
      }
    })
    return JSON.parse(JSON.stringify(this.data))
  }
  @Prop({ default: [] }) public data: any
  @Prop({ default: "" }) public prop: string
  @Prop({
    default: () => {
      return
    }
  })
  public value: any
  public values = []
  @Prop({ default: false }) public checkStrictly: any
  public defaultProps = {
    children: "children",
    label: "label"
  }
  private arrData: any
  public setDefault(value) {
    let arr: any

    if (typeof value === "string") {
      arr = value.split(",")
    } else {
      arr = value
    }
    this.setValue(value)
    this.setCheckedKeys(arr)
  }
  public handleCheckChange() {
    this.setValue((this.$refs.tree as any).getCheckedKeys())
  }
  public setValue(val) {
    this.values = this.arrData
      .filter(item => val.indexOf(item.id) > -1)
      .map(item => {
        return item.label
      })
    // this.setSelectChange(val)
    //@ts-ignore
    this.valueChange( this.arrData.filter(item => val.indexOf(item.id) > -1).map(item => { return item.id }))
    (this.$refs.tree as any).setCheckedKeys(
      this.arrData
        .filter(item => val.indexOf(item.id) > -1)
        .map(item => {
          return item.id
        })
    )
  }
  public selectChange(val) {
    const remove = this.arrData
      .filter(item => val.indexOf(item.label) > -1)
      .map(item => {
        return item.id
      })

    if (this.checkStrictly !== false) {
      const filter = (this.$refs.tree as any).getCheckedKeys().filter(item => item !== remove[0])
      this.setCheckedKeys(filter)
    } else {
      this.$api("HierarchyGetChildren", {
        data: this.data,
        id: remove[0]
      }).then(res => {
        const filter = (this.$refs.tree as any).getCheckedKeys().filter(item => res.concat(remove).indexOf(item) === -1)
        this.setCheckedKeys(filter)
      })
    }
  }

  @Emit("valueChange")
  public valueChange(val) {
    return { prop: this.prop, val }
  }
  public setCheckedKeys(filter) {
    ;(this.$refs.tree as any).setCheckedKeys(filter)
    this.valueChange(filter)
  }
}
</script>

<style scoped lang="scss"></style>
