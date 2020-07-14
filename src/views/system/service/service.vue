<!-- 作者 xn-->
<!-- 时间 2019/8/8-->
<template>
  <g-page>
    <div class="resource geye-100"
         flex>
      <!-- <div class="splitter geye-pr-10"
           flex-box="0">
        <el-tree :data="treeData"
                 :props="defaultProps"
                 @node-click="handleNodeClick"
                 :render-content="renderContent"></el-tree>
      </div> -->
      <div class="form"
           flex="dir:top"
           flex-box="1">
        <div flex-box="0"
             flex="main:right">
          <g-button text="初始化"
                    type="primary"
                    @click="initModel()"></g-button>
        </div>
        <div flex-box="0"
             style="height: 5px; border-bottom: 1px solid #ccc;"></div>
        <div flex-box="1">
          <IEcharts ref="chart"
                    :option="option"
                    :resizable="true"></IEcharts>
        </div>
      </div>
    </div>

  </g-page>
</template>

<script lang="tsx">
import { Component, Provide, Vue, Watch } from "vue-property-decorator"
interface NodeType {
  name: string
  value: number
  children: NodeType[]
}
import IEcharts from "vue-echarts-v3/src/full.js"
@Component({
  components: {
    IEcharts
  }
})
export default class Service extends Vue {
  public model = []
  public modelBase = []
  public modelRel = []
  public treeData = []
  public option: any = {}
  public dialogVisible = false
  public editId = ""
  public defaultProps = {
    children: "children",
    label: "label"
  }
  public renderChart(nodes: NodeType[]) {
    this.option = {
      series: [
        {
          name: "option",
          type: "treemap",
          width: "100%",
          height: "100%",
          visibleMin: 300,
          data: nodes,
          label: {
            show: true,
            formatter: "{b}"
          },
          leafDepth: 2,
          itemStyle: {
            borderColor: "#fff"
          },
          levels: [
            {
              itemStyle: {
                borderColor: "#555",
                borderWidth: 4,
                gapWidth: 4
              }
            },
            {
              colorSaturation: [0.3, 0.6],
              itemStyle: {
                borderColorSaturation: 0.7,
                gapWidth: 2,
                borderWidth: 2
              }
            },
            {
              colorSaturation: [0.3, 0.8],
              itemStyle: {
                borderColorSaturation: 0.6,
                gapWidth: 1
              }
            },
            {
              colorSaturation: [0.3, 0.8]
            }
          ]
        }
      ]
    }
  }
  public created() {
    let w: any
    if (typeof Worker !== "undefined") {
      if (typeof w === "undefined") {
        w = new Worker("./data.ts")
      }
      w.onmessage = function(event) {
        // document.getElementById("result").innerHTML = event.data
        console.log(event)
      }
    }
    this.pageLoad()
  }
  public pageLoad() {
    this.$api("getServiceAll").then(res => {
      const data: any = []
      for (const i in res.data) {
        const item: NodeType = {
          name: i,
          value: Math.round(Math.random() * 30) + 100,
          children: []
        }
        for (const j in res.data[i]) {
          item.children.push({
            name: `${i}.${j}`,
            value: Math.round(Math.random() * 30) + 10,
            children: []
          })
        }
        data.push(item) //属性
      }
      this.renderChart(data)
    })
  }
  public initModel() {
    this.$api("initModel").then(res => {
      if (res.data && res.data.code === "200") {
        this.$message("初始化成功！")
      }
    })
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
