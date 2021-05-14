<!-- 作者 xn-->
<!-- 时间 2019/8/8-->
<template>
  <g-page>
    <div class="resource geye-100" flex>
      <div class="splitter geye-pr-10" flex-box="0">
        <el-input v-model="word" />
        <el-tree
          :data="fillterData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :render-content="renderContent"
        ></el-tree>
      </div>
      <div class="form" flex="dir:top" flex-box="1">
        <div flex-box="0" flex="main:right">
          <g-button text="新增模型" type="primary" @click="addModel()"></g-button>
          <g-button text="初始化" type="primary" @click="initModel()"></g-button>
        </div>
        <div flex-box="0" style="height: 5px; border-bottom: 1px solid #ccc;"></div>
        <div flex-box="1">
          <IEcharts ref="chart" v-if="option.legend" :option="option" :resizable="true"></IEcharts>
        </div>
      </div>
    </div>
    <el-dialog :title="tips" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
      <div>
        <model-add :id="editId" ref="add" :models="model" v-on:pageLoad="pageLoad"></model-add>
      </div>
    </el-dialog>
  </g-page>
</template>

<script lang="tsx">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator'
import IEcharts from 'vue-echarts-v3/src/full.js'
import modelAdd from './modelAdd.vue'
@Component({
  components: {
    IEcharts,
    modelAdd
  }
})
export default class Dictionary extends Vue {
  public model = []
  public modelBase = []
  public modelRel = []
  public treeData = []
  public option: any = {}
  public dialogVisible = false
  public editId = ''
  word = ''
  public defaultProps = {
    children: 'children',
    label: 'label'
  }
  public renderChart(nodes: any[], links: any, hasCategory: boolean) {
    this.option = {
      legend: {
        show: hasCategory,
        data: nodes.map(n => n.name),
        backgroundColor: '#e1e1e1'
      },
      animation: false,
      series: [
        {
          type: 'graph',
          layout: 'force',
          animation: true,
          data: nodes,
          links,
          // categories: nodes,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [2, 10],
          roam: true,
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          },
          force: {
            repulsion: 500,
            edgeLength: 60
          }
        }
      ]
    }
  }
  get fillterData() {
    return this.treeData.filter((item: { label: string }) => item.label.indexOf(this.word) > -1)
  }
  public handleNodeClick(data: any) {
    return data
  }
  handleClose(done: () => void) {
    this.$confirm('确定要关闭？').then(() => {
      done()
    })
  }
  public addModel() {
    this.editId = ''
    this.toggleDialog()
  }
  public toggleDialog() {
    this.dialogVisible = !this.dialogVisible
  }
  public created() {
    this.pageLoad()
  }
  public pageLoad() {
    Promise.all([this.loadModel(), this.loadModelBase(), this.loadModelRel()]).then(() => {
      this.dialogVisible = false
      this.loadTree()
    })
  }
  public initModel() {
    this.$api('initModel').then(res => {
      if (res.data && res.data.code === '200') {
        this.$message('初始化成功！')
      }
    })
  }
  public loadTree() {
    this.model.map(
      (model: { type: string; label: string; stName: string; stTableName: string }) => {
        model.type = 'model'
        model.label = `${model.stName}-${model.stTableName}`
      }
    )
    this.modelBase.map(
      (base: {
        stModelId: string
        type: string
        label: string
        stName: string
        stColumnName: string
      }) => {
        const model: any = this.model.filter(
          (mo: { id: string; label: string; stName: string; stTableName: string }) =>
            mo.id === base.stModelId
        )[0] || { children: [] }
        base.type = 'base'
        base.label = `${base.stColumnName}(${base.stName})`
        if (model) {
          model.children && model.children.length
            ? model.children.push(base)
            : (model.children = [base])
        }
      }
    )
    this.modelRel.map((rel: any) => {
      rel.type = 'rel'
      const model: { children: any[] } = this.model.filter(
        (mo: { id: string; label: string; stName: string; stTableName: string }) =>
          mo.id === rel.stSouModelID
      )[0] || { children: [] }
      rel.alias = rel.stName
      rel.label =
        (rel.inRelation === 1 ? '(n)' : '(1)') +
        (this.model.filter((mo: any) => mo.id === rel.stDestModelID)[0] as any).stName
      if (model) {
        model.children && model.children.length
          ? model.children.push(rel)
          : (model.children = [rel])
      }
    })
    this.treeData = this.model
    const nodes: never[] = []
    const links: any[] = []
    this.getRel(nodes, links)
  }
  public getRel(nodes: any[], links: any[]) {
    const getRandomColor = () => {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }

    this.model.map((model: { id: string; stTableName: string }) => {
      nodes.push({
        id: model.id,
        name: model.stTableName,
        itemStyle: {
          normal: {
            color: getRandomColor()
          }
        },
        symbolSize: 20
      })
    })
    this.modelRel.map(
      (rel: { id: string; stSouModelID: string; stDestModelID: string; inRelation: number }) => {
        links.push({
          id: rel.id,
          source: rel.stSouModelID,
          target: rel.stDestModelID,
          lineStyle: {
            normal: {
              curveness: 0.2,
              type: rel.inRelation === 0 ? 'dashed' : 'solid'
            }
          }
        })
      }
    )
    console.log(JSON.stringify(nodes))
    console.log(JSON.stringify(links))
    this.renderChart(nodes, links, false)
  }
  public loadModel() {
    return this.$api('getModel').then(res => {
      this.model = res.result.list
    })
  }
  public loadModelBase() {
    return this.$api('getModelBase').then(res => {
      this.modelBase = res.result.list
    })
  }
  public loadModelRel() {
    return this.$api('getModelRel').then(res => {
      this.modelRel = res.result.list
    })
  }
  public handleEdit(e: { stopPropagation: () => void }, data: { id: string }) {
    this.editId = data.id
    this.toggleDialog()
    e.stopPropagation()
  }
  public handleRemove(e: { stopPropagation: () => void }, data: { id: any }) {
    this.$confirm('确定删除次模型吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$api('delModel', { id: data.id }).then(res => {
        if (res && res.code === '200') {
          this.$message.success('删除成功')
          this.pageLoad()
        }
      })
    })
    e.stopPropagation()
  }
  get tips() {
    return this.editId === '' ? '新增模型' : '编辑模型'
  }
  @Watch('dialogVisible', { immediate: true })
  private onDialogChange(val: any) {
    if (!val) {
      this.editId = ''
    }
  }
  public renderContent(h: any, { node, data }: any) {
    return (
      <div class="custom-tree-node geye-100" flex>
        <div flex-box="1" title={node.label} class="tree-node-label">
          {node.label}
        </div>
        <div flex-box="0" flex="main:right" v-show={node.level === 1}>
          <el-tooltip content="编辑" placement="top" effect="light" openDelay={300}>
            <g-icon
              name="md-color-filter"
              size="18"
              on-press={(e: { stopPropagation: () => void }) => this.handleEdit(e, data)}
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="light" openDelay={300}>
            <g-icon
              name="Rectangle"
              size="18"
              on-press={(e: { stopPropagation: () => void }) => this.handleRemove(e, data)}
            />
          </el-tooltip>
        </div>
      </div>
    )
  }
}
</script>

<style scoped lang="scss">
.splitter {
  width: 250px;
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
