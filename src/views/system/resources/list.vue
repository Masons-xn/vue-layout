<!-- 作者 xn-->
<!-- 时间 2019/8/8-->

<template>
  <g-page>
    <div class="resource geye-100"
         flex>
      <div class="splitter geye-pr-10"
           flex-box="0">
        <el-tree :data="treeData"
                 :props="defaultProps"
                 @node-click="handleNodeClick"
                 default-expand-all
                 :render-content="renderContent"
                 v-loading="treeLoading"></el-tree>
      </div>
      <div class="form"
           flex-box="1">
        <div class="action-card"
             @click="addResource"
             v-if="!showForm">
          <span>添加菜单</span>
        </div>
        <div v-show="showForm"
             class="geye-p-10">
          <g-form :rules="rules"
                  :row="row"
                  :model="form"
                  ref="form"></g-form>
          <g-button buttonType="save"
                    @click="save"></g-button>
          <g-button text="重置"
                    v-if="!form.parentId"
                    @click="reset"></g-button>
          <g-button text="关闭"
                    @click="showForm = false"></g-button>
        </div>
      </div>
    </div>
  </g-page>
</template>

<script lang="tsx">
import { Vue, Component, Provide } from "vue-property-decorator"
import Guid from "../../../utils/guid"

import _ from "lodash"

@Component
export default class Resource extends Vue {
  public option = []
  public treeData = []
  public defaultProps = {
    children: "children",
    label: "name"
  }
  public showForm = false
  private rules: any = {}
  private form: any = {}
  private parentName = ""
  private selectIsDisabled = false
  private treeLoading = false
  private type = "1"
  public handleNodeClick(data) {
    return true
  }
  public created() {
    const option: any = []
    this["$trans"]("resourcesType", true).map(item => {
      option.push({
        label: item.value,
        value: item.code
      })
    })
    this.option = option
    this.loadResource()
  }
  get row() {
    const items: any = []
    if (this.form.pid && this.form.parentName) {
      items.push({ label: this.$t("父级名称"), prop: "parentName", disabled: "disabled" })
    }
    items.push({
      label: this.$t("类型"),
      prop: "type",
      type: "select",
      options: this.option,
      disabled: this.selectIsDisabled,
      events: {
        change: this.typeChange
      }
    })
    items.push({ label: this.$t("资源名称"), prop: "name", placeholder: this.$t("输入资源名称") })
    if (this.form.type === "menu") {
      items.push({ label: this.$t("路由"), prop: "routerPath", placeholder: this.$t("路由") })
    }
    items.push({ label: this.$t("地址"), prop: "path", placeholder: this.$t("地址") })
    items.push({ label: this.$t("顺序"), prop: "sequence", placeholder: this.$t("顺序") })
    return items
  }
  public typeChange(val) {
    this.form.code = Guid.newGuid()
    this.type = val
  }
  public loadResource() {
    this.treeLoading = true
    this.$api("queryMenu", { where: {} }).then(res => {
      this.$api("dataOrder", { data: res.result.list, key: "sequence" }).then(data => {
        this.$api("ArrayToHierarchy", data).then(r => {
          this.treeData = r
          this.treeLoading = false
        })
      })
    })
  }

  public addResource(data: any) {
    this.showForm = true
    if (data.id) {
      this.form.parentId = data.id
      if (data.type === "category") {
        this.form.type = "menu"
      } else if (data.type === "menu") {
        this.form.type = "element"
      }
      this.form.parentName = data.name
      this.form.pid = data.id
      this.selectIsDisabled = true
    } else {
      this.reset()
      this.selectIsDisabled = false
    }
  }
  public reset() {
    this.form = {
      name: "",
      parentId: 0,
      type: "",
      path: ""
    }
  }
  public handleEdit(e, data) {
    this.showForm = true
    this.selectIsDisabled = true
    this.form = _.cloneDeep(data)
    this.type = data.category
    e.stopPropagation()
  }
  public handleAdd(e, data) {
    this.form.parentName = data.name
    this.addResource(data)
    e.stopPropagation()
  }
  public handleRemove(e, data) {
    this.$confirm(this.$t("确定删除此资源吗?").toString(), "提示", {
      type: "warning"
    }).then(() => {
      this.$api("delMenu", { id: [data.id] }).then(res => {
        if (res.code === "200") {
          this.$message.success("刪除成功")
          this.reset()
          this.loadResource()
          this.showForm = false
        }
      })
    })
  }
  public renderContent(h, { node, data, store }) {
    return (
      <div class="custom-tree-node geye-100" flex>
        <div flex-box="0" title={node.label} class="tree-node-label">
          {node.label}
        </div>
        <div flex-box="1" flex="main:right">
          <el-tooltip content="添加子节点" placement="top" effect="light" openDelay={300}>
            <g-icon name="RectangleCopy20" size="18" on-press={e => this.handleAdd(e, data)} />
          </el-tooltip>
          <el-tooltip content="编辑" placement="top" effect="light" openDelay={300}>
            <g-icon name="md-color-filter" size="18" on-press={e => this.handleEdit(e, data)} />
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="light" openDelay={300} v-show={!data.children || data.children.length === 0}>
            <g-icon name="Rectangle" size="18" on-press={e => this.handleRemove(e, data)} />
          </el-tooltip>
        </div>
      </div>
    )
  }
  public save() {
    this.$api("addMenu", this.form).then(res => {
      if (res.code === "200") {
        this.$message.success("保存成功")
        this.reset()
        this.loadResource()
        this.showForm = false
      }
    })
  }
}
</script>

<style scoped lang="scss">
.splitter {
  width: 200px;
  border-right: 1px solid #e4e7ed;
  height: 100%;
  overflow: auto;
}
.action-card {
  margin: 20% auto;
  width: 300px;
  height: 100px;
  border: 1px dashed #ccc;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
