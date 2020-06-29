<template>
  <div :id="unitid"
       style="width: 100%;"
       :draggable="this.mode === 'dev' ? true : false"
       @dragstart="unitMove"
       @click="unitSelect"
       @dragover="unitdragmove"
       @dblclick="unitEdit"
       @drop="unitDrop"
       :class="(draggable ? 'unit-developing ' : ' ') + (unitSelected ? 'unitIsSelected ' : ' ')">
    <g-icon name="md-flash"
            class="getDataBymodel"
            :size="24"
            @press="getDataBymodel"
            v-if="mode === 'dev'"></g-icon>
    <div class="geye-100">
      <g-data-table ref="table"
                    :url="url"
                    :delUrl="delUrl"
                    :params="params"
                    :columns="columnsBase"
                    :tableConfig="tableConfig"
                    :lazy="lazy"
                    :mode="mode">
        <template slot="buttons">
          <div :class="(draggable ? 'table_bar container canAdd' : 'table_bar container') + (getChild(ids[0]).length> 0? ' geye-ml-8': '')"
               :nodeparent="unitid"
               :id="ids[0]">
            <container v-for="item of getChild(ids[0])"
                       :renId="item.unitID"
                       :key="item.unitID"> </container>
          </div>
        </template>
        <template slot="operator"
                  slot-scope="{ row }">
          <div class="operator">
            <g-button :name="item.icon"
                      :text="item.label"
                      :key="item.label"
                      v-for="item of rboperation"
                      @click="handlePress(item, row)"></g-button>
          </div>
        </template>
      </g-data-table>
    </div>
  </div>
</template>
<script lang="ts">
import _ from "lodash"
import ElementUI from "element-ui"
import container from "@/views/faster/builder/page/container.vue"
import dev from "@/views/faster/builder/mixin/unitmixin"
import bus from "@/views/faster/builder/core/eventbus"
import getData from "../../builder/unit/getDataFromModel"
import { Component, Vue, Provide, Prop, Watch } from "vue-property-decorator"
import { RenderType, unitDataPath, UnitType } from "@/views/faster/builder/core/decorators"
import Base from "./props"
import Fast from "@/views/faster/builder/core/config"
import { dataOrder } from "@/utils/api/dataFormat"
@Component({
  mixins: [dev],
  components: {
    container,
    "el-table": ElementUI.Table,
    "el-table-column": ElementUI.TableColumn,
    "el-tooltip": ElementUI.Tooltip,
    "el-pagination": ElementUI.Pagination
  }
})
@UnitType("container")
@RenderType("表格")
export default class RbTable extends Vue {
  [x: string]: any

  // @ts-ignore
  @Prop({ default: () => [], dataType: "array", valueBus: [], des: "column", alias: "列", props: Base.columnBase }) private rbcolumns: any[]
  // @ts-ignore
  @Prop({ default: "", dataType: "string", valueBus: [], des: "请求数据的地址", alias: "地址" }) private url: string
  // @ts-ignore
  @Prop({ default: "", dataType: "string", valueBus: [], des: "请求数据的地址", alias: "批量删除地址" }) private batchCascadeDelete: string
  // @ts-ignore
  @Prop({ default: "", dataType: "string", valueBus: [], des: "请求数据的地址", alias: "删除地址" }) private delUrl: string
  // @ts-ignore
  @Prop({ default: "表格标题", dataType: "string", valueBus: [], des: "表格标题", alias: "标题名称" }) private title: string
  // @ts-ignore
  @Prop({ efault: "true", dataType: "string", valueBus: ["false", "true"], des: "是否包含复选框", alias: "是否包含复选框" }) private hascheckbox: string
  // @ts-ignore
  @Prop({ default: "true", dataType: "string", valueBus: ["false", "true"], des: "是否含有分页", alias: "是否含有分页" }) private hasPagination: string
  // // @ts-ignore
  // @Prop({ default: "true", dataType: "string", valueBus: ["false", "true"], des: "渲染是不加载数据", alias: "延时加载" }) private delayload: string
  // @ts-ignore
  @Prop({ default: "", dataType: "string", valueBus: ["false", "true"], des: "显示时间筛选", alias: "时间筛选" }) private dateRange: string
  // @ts-ignore
  @Prop({ default: () => [], dataType: "array", valueBus: ["false", "true"], des: "操作列", alias: "操作", props: Base.operationBase }) private rboperation: any[]
  // @ts-ignore
  private unitBarID = ""
  //params
  get params() {
    return []
  }
  private tableData: any[] = []
  private multipleSelection: any[] = []
  private Models: any[] = []
  private param: any[] = []
  private selection: any[] = []
  private Modelvalue = ""
  private tableheight = ""
  private total = 0
  private pageSize = 10
  private currentPage = 1
  private ids: string[] = ["tableBotton"]
  get barId() {
    return this.unitBarID ? this.unitBarID : this.newContainerId()
  }
  get columnsBase() {
    const rboperation: any[] = []
    if (this.rboperation.length > 0) {
      rboperation.push({
        label: "操作",
        slotName: "operator",
        align: "center",
        width: this.rboperation.length * 80
      })
    }
    let base: any[] = []
    if (this.rbcolumns.length > 0) {
      base = [
        {
          type: "selection"
        },
        {
          type: "index",
          label: "序号"
        }
      ]
    }
    return base.concat(dataOrder({ data: this.rbcolumns, key: "orders" }), rboperation)
  }
  get lazy() {
    return this.mode === "dev" || this.mode === "add"
  }
  get tableConfig() {
    return {
      props: {
        dateRange: this.dateRange === "true"
      }
    }
  }

  public getDataBymodel() {
    getData(this.selectModel)
  }
  loadModel() {
    const that = this
    if (that.mode === "dev") {
      this.$axios.get("/ModelService/query").then(resp => {
        if (resp.data) {
          that.Models = resp.data
        }
      })
    }
  }
  handlePress(item, scope) {
    const data = scope,
      param = { id: "" }
    let urlParam = ""
    const keymap = item.dataKey.split(",")
    keymap.map(function(key) {
      param[key] = data[key]
      urlParam += `&${key}=${data[key]}`
    })
    if (item.method.indexOf("/") === -1) {
      if (item.method === "del") {
        this.$api(this.delUrl, { id: [param.id] }).then(res => {
          if (res.code === "200") {
            ;(this.$refs.table as any).fetch()
            // @ts-ignore
            this.$message({
              message: "删除成功",
              type: "success"
            })
          }
        })
      } else {
        console.log(item.method)
        bus.trigger("Events", {
          name: item.method,
          arg: param
        })
      }
    } else {
      bus.trigger("Events", {
        name: "routerChange",
        arg: `${item.method}?${urlParam.substr(1, urlParam.length - 1)}`
      })
    }
  }
  selectModel(Model) {
    const that = this
    const columns: any = []
    this.config["rbcolumns"] = []
    this.url = `/${Model.stTableName}/query`
    this.batchCascadeDelete = `/${Model.stTableName}/batchCascadeDelete`
    this.delUrl = `del${Model.stTableName}`
    bus.trigger("UnitChangeProps", {
      change: {
        key: "url",
        value: that.url
      },
      unit: that
    })
    bus.trigger("UnitChangeProps", {
      change: {
        key: "batchCascadeDelete",
        value: that.delUrl
      },
      unit: that
    })
    bus.trigger("UnitChangeProps", {
      change: {
        key: "delUrl",
        value: that.delUrl
      },
      unit: that
    })
    Model.basicProperties.map((item, index) => {
      columns.push({
        prop: item.stColumnName,
        label: item.stName,
        orders: index
      })
    })
    bus.trigger("UnitChangeProps", {
      change: {
        key: "rbcolumns",
        value: columns
      },
      unit: that
    })
  }
  // @Watch("rbcolumns", { deep: true })
  // onColumnsChange(val, oldVal) {
  //   const needAdd: any = _.difference(oldVal, val).filter((item: any) => item) || []
  //   needAdd.map((item: { id: string | undefined; dataPath: string | undefined }) => {
  //     item.dataPath = "rbcolumns"
  //     if (item.id) {
  //       Fast.needDel.push(item)
  //     }
  //   })
  // }
  @Watch("mode", { deep: true })
  onModeChange(val) {
    // console.log(val)
    if (!this.lazy && val === "pro") {
      try {
        //@ts-ignore
        this.$refs.table.fetch()
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        //@ts-ignore
        this.$refs.table.clear()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rb-table {
  margin-top: 8px;
  .operator {
    display: flex;
    justify-content: center;
  }
}
.table_bar {
  border-bottom: 0;
  display: flex;
  width: auto;
  &.canAdd {
    padding-right: 100px;
    margin: 0 8px;
    border: 1px dashed #ccc;
    .unit-developing {
      padding: 0;
    }
  }
}
.rb-tip-icon-button {
  width: 34px;
  height: 30px;
  display: inline-block;
  &:hover {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 3px;
  }
  margin: 3px 0px;
}
.rb-tip-icon {
  align-items: center;
  border-radius: 2px;
  color: #747f8d;
  cursor: pointer;
  margin: 3px 5px 0px 5px;
}
.getDataBymodel {
  position: absolute;
  left: 10px;
  top: 20px;
  z-index: 100;
}
</style>




