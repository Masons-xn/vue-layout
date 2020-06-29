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
                 :render-content="renderContent"></el-tree>
      </div>
      <div class="form"
           flex-box="1">
        <div class="action-card"
             @click="addDictionary"
             v-if="!showForm">
          <span>添加翻译</span>
        </div>
        <div v-show="showForm"
             class="geye-p-10">
          <g-form :rules="rules"
                  :row="row"
                  :model="form"
                  ref="form" />
          <g-button buttonType="save"
                    @click="save"></g-button>
          <g-button text="重置"
                    v-if="!form.pid"
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
import _ from "lodash"

@Component
export default class Dictionary extends Vue {
  public treeData = []
  public defaultProps = {
    children: "children",
    label: "value"
  }
  public showForm = true
  private rules: any = {}
  private form: any = {
    pid: 0
  }
  private selectIsDisabled = false
  private type = "category"
  public handleNodeClick(data) {
    return data
  }
  public created() {
    this.loadDictionary()
  }
  get row() {
    if (this.form.pid && this.form.parentName) {
      return [
        {
          label: this.$t("父级名称"),
          prop: "parentName",
          disabled: "disabled"
        },
        {
          label: this.$t("code"),
          prop: "code",
          placeholder: this.$t("要翻译的内容")
        },
        {
          label: this.$t("值"),
          prop: "value",
          placeholder: this.$t("翻译后的内容")
        }
      ]
    }
    return [
      {
        label: this.$t("code"),
        prop: "code",
        placeholder: this.$t("要翻译的内容")
      },
      {
        label: this.$t("值"),
        prop: "value",
        placeholder: this.$t("翻译后的内容")
      }
    ]
  }
  public loadDictionary() {
    this.$api("queryDictionary", this.form).then(res => {
      this.$api("dataOrder", { data: res.result.list, key: "sequence" }).then(data => {
        this.$api("ArrayToHierarchy", data).then(r => {
          this.treeData = r
        })
      })
    })
  }
  public addDictionary(parentId?: any) {
    this.showForm = true
    this.reset()
    if (parentId) {
      this.form.pid = parentId
    }
  }
  public reset() {
    this.form = {
      name: "",
      path: "",
      code: "",
      parentName: ""
    }
  }
  public handleEdit(e: { stopPropagation: () => void }, data: { category: string }) {
    this.showForm = true
    this.selectIsDisabled = false
    this.form = _.cloneDeep(data)
    this.type = data.category
    e.stopPropagation()
  }
  public handleAdd(e: { stopPropagation: () => void }, data: { id: any; value: any }) {
    this.addDictionary(data.id)
    this.form.parentName = data.value
    e.stopPropagation()
  }
  public handleRemove(e: { stopPropagation: () => void }, data: { id: any }) {
    e.stopPropagation()
    this.$api("delDictionary", { id: [data.id] }).then(res => {
      if (res.code === "200") {
        this.$message.success(res.message)
        this.reset()
        this.loadDictionary()
        this.showForm = false
      }
    })
  }
  public renderContent(h, { node, data }) {
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
    this.$api("addDictionarys", this.form).then(res => {
      if (res.code === "200") {
        this.$message.success(res.message)
        this.reset()
        this.loadDictionary()
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
