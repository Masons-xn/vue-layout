<!-- 作者 xn-->
<!-- 时间 2019/8/6-->
<template>
  <div v-loading="loading"
       :element-loading-text="'加载中 '"
       class="data-table"
       flex="dir:top">
    <div class="table"
         :id="id"
         style="overflow-y:hidden;">
      <div class="selection_area"
           flex
           style="flex-wrap: wrap"
           v-if="selection.length > 0 || hasDate">
        <div v-for="item in selection"
             class="select_item"
             flex
             :key="item.label">
          <div class="select_label">{{ item.label }}：</div>
          <div class="select_area">
            <el-input size="mini"
                      v-if="item.type === 'input' || item.type === undefined"
                      v-model="searchModel[item.prop]"
                      :placeholder="item.placeholder" />
            <el-select size="mini"
                       v-if="item.type === 'select'"
                       v-model="searchModel[item.prop]"
                       value="">
              <el-option size="mini"
                         v-for="option in item.option"
                         :key="option.value"
                         :label="option.label"
                         :value="option.value"> </el-option>
            </el-select>
            <g-select-tree @valueChange="valueChange"
                           :prop="item.prop"
                           :data="item.option"
                           v-if="item.type === 'selectTree'"
                           v-model="searchModel[item.prop]" />
          </div>
        </div>
        <div class="select_item"
             flex
             v-if="hasDate">
          <div class="select_label">
            起始时间：
          </div>
          <div class="select_area">
            <el-date-picker :picker-options="pickerOptionsStart"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="起始时间"
                            size="mini"
                            type="datetime"
                            v-model="dateForm.startTime.value"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </div>
        </div>
        <div class="select_item"
             flex
             v-show="hasDate">
          <div class="select_label">
            结束时间：
          </div>
          <div class="select_area">
            <el-date-picker :picker-options="pickerOptionsEnd"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="结束时间"
                            size="mini"
                            type="datetime"
                            v-model="dateForm.endTime.value"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </div>
        </div>
      </div>
      <div class="data-table-bar"
           flex
           v-show="selection.length > 0 || hasDate">
        <div flex-box="0"
             v-show="title !== ''">
          {{ title || "" }}
        </div>
        <div flex-box="1"
             flex="main:right"
             class="data-table-bar-buttons"
             v-show="selection.length > 0 || hasDate">
          <g-button button-type="search"
                    @click="select" />
          <g-button button-type="clear"
                    @click="clearSelect" />
          <g-button button-type="del"
                    text="批量删除"
                    @click="batchCascadeDelete"
                    plain
                    :disabled="UserSelection.length === 0"
                    v-if="this.delUrl"></g-button>
          <slot name="buttons"> </slot>
        </div>
      </div>
      <BaseTable ref="table"
                 :columns="tableColumns"
                 :data="data"
                 v-bind="tableConfig.props"
                 v-on="tableConfigEvents"
                 :hasPagination="hasPagination">
        <slot name="operator" />
      </BaseTable>
    </div>
    <div v-show="paginationVisible"
         class="pagination"
         flex-box="0"
         v-if="total > -1 && paging">
      <ElPagination v-bind="paginationBinds"
                    :current-page.sync="page.page"
                    :total="total"
                    v-on="paginationConfig.events"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    layout="total, sizes, prev, pager, next, jumper" />
    </div>
  </div>
</template>

<script lang="tsx">
import request from "@/config/axios"
import { Component, Prop, Provide, Vue, Watch } from "vue-property-decorator"

import BaseTable from "./BaseTable"
import HeaderFilter from "./headerFilter.vue"
import _, { uniqueId } from "lodash"
import fa from "element-ui/src/locale/lang/fa"
// 分页组件默认值
const PAGINATION_DEFAULT = {
  background: true,
  "page-sizes": [10, 20, 50],
  layout: "prev, pager, next, ->, sizes, total"
}
const OPERATION_DEFAULT = 7

@Component({
  components: {
    BaseTable,
    HeaderFilter
  }
})
export default class DataTable extends Vue {
  @Prop({ default: null }) public delUrl: string
  @Prop({ default: null }) public url: string
  @Prop({ default: false }) public lazy: boolean
  @Prop({ default: false }) public hideTitleBar: boolean
  @Prop({ default: false }) public fuzzySearch: any
  @Prop({ default: () => ({}) }) public params: any
  @Prop({ default: "" }) public title: string | undefined
  @Prop({ default: true }) public paging: boolean | undefined
  @Prop({
    default() {
      return []
    }
  })
  public columns: any
  @Prop({ default: 300 }) public loadingDelay: number | undefined
  @Prop({ default: () => ({ props: {}, events: {} }) }) public tableConfig: { props: any; events: any }
  @Prop({ default: () => ({ props: PAGINATION_DEFAULT, events: {} }) })
  public paginationConfig: object | undefined
  @Prop({ default: "" }) public mode: "" | undefined
  public data: any = []
  public UserSelection: any = []
  public page: any = {
    page: 1,
    pageSize: 10
  }
  public searchModel: any = {}
  public orderModel: any = {}
  public filterModel: any = {}
  public orderClass = ""
  public loading = false
  public responseComplete = false
  public total = 0
  public id: string = uniqueId("data-table")
  protected hasDate = false
  private hasSelecting = false
  private isSelecting = false
  get paginationBinds() {
    return _.assign({}, PAGINATION_DEFAULT, this.paginationConfig)
  }
  get tableConfigEvents() {
    return _.assign({}, { "selection-change": this.handleSelectionChange }, this.tableConfig.events)
  }
  get paginationVisible() {
    return this.data.length
  }
  get hasPagination() {
    if (this.$refs.table) {
      ;(this.$refs.table as any).resizeTableHeight()
    }
    return _.cloneDeep(this.total) > -1 && this.paging
  }
  get selection() {
    const arr: any = []
    const columns = _.cloneDeep(this.columns)
    const searchModel = {}
    // if (this.fuzzySearch !== false) {
    //   arr.push({
    //     label: '模糊搜素',
    //     prop: this.fuzzySearch.key ? this.fuzzySearch.key : 'search_input',
    //     type: 'input',
    //     placeholder: this.fuzzySearch.placeholder,
    //   })
    // }
    function buildData(column, data) {
      const datas = JSON.parse(JSON.stringify(data))
      if (column.codeKey && column.valueKey) {
        datas.map(item => {
          item.label = item[column.valueKey]
          item.value = item[column.codeKey]
        })
      } else {
        datas.map(item => {
          item.label = item.value
          item.value = item.code
        })
      }

      return datas
    }
    for (const [index, column] of columns.entries()) {
      if (column.selection) {
        if (column.selection && (column.trans || column.code)) {
          const data = this.$trans(column.trans || column.code, true, column.trans || column.code) || []
          if (!!data && (typeof data === "object" || typeof data === "function") && typeof data.then === "function") {
            column.selection = {
              type: "select",
              option: data,
              value: ""
            }
            data.then(res => {
              column.selection.option = buildData(column, res)
              arr.push(Object.assign({ prop: column.prop, label: column.label }, column.selection))
              this.$forceUpdate()
            })
          } else {
            column.selection = {
              type: "select",
              option: buildData(column, data),
              value: ""
            }
            arr.push(Object.assign({ prop: column.prop, label: column.label }, column.selection))
          }
        } else if (typeof column.selection === "string" && column.selection === "true") {
          column.selection = {
            type: "input",
            value: ""
          }
          arr.push(Object.assign({ prop: column.prop, label: column.label }, column.selection))
        }
      }
      // if (column.selection.value) {
      //   searchModel[column.prop] = _.cloneDeep(column.selection.value)
      // }
    }
    this.searchModel = _.cloneDeep(searchModel)
    return arr
  }
  get tableColumns() {
    const columns = _.cloneDeep(this.columns)
    columns.map((column: { trans: any; code: any; codeKey: string; valueKey: string; formatter: (row: any, col: any, cellValue: any, index: any) => any }) => {
      if (column.trans || column.code) {
        column.formatter = (row, col, cellValue, index) => {
          return cellValue ? this.$trans(cellValue, false, column.code, { codeKey: column.codeKey, valueKey: column.valueKey }) : ""
        }
      }
    })
    if (!this.isSelecting && this.fuzzySearch !== false) {
      this.isSelecting = true
      this.hasSelecting = true
    }
    return columns
  }
  get pickerOptionsStart() {
    return {
      disabledDate: (time: { getTime: () => number }) => {
        const endDateVal = this.dateForm.endTime.value
        if (endDateVal) {
          return time.getTime() > new Date(endDateVal).getTime()
        }
      }
    }
  }
  get pickerOptionsEnd() {
    return {
      disabledDate: (time: { getTime: () => number }) => {
        const endDateVal = this.dateForm.startTime.value

        if (endDateVal) {
          return time.getTime() < new Date(endDateVal).getTime()
        }
      }
    }
  }
  public dateForm = {
    startTime: {
      field: "createTime",
      value: "",
      type: "String",
      operator: 3
    },
    endTime: {
      field: "createTime",
      value: "",
      type: "String",
      operator: 5
    }
  }

  public created() {
    this.doInit()
  }
  public handleSelectionChange(selection) {
    this.UserSelection = selection.map(item => item.id)
  }
  public doInit() {
    for (const column of this.columns) {
      if (column.selection) {
        this.hasSelecting = true
      }
      if (column.selection && column.selection.value && column.selection.value.length > 0) {
        this.isSelecting = true
        break
      }
    }
    if (!this.isSelecting && this.fuzzySearch !== false) {
      this.isSelecting = true
      this.hasSelecting = true
    }

    if (this.tableConfig && this.tableConfig.props && this.tableConfig.props.dateRange) {
      this.hasDate = true

      const dateRange = this.tableConfig.props.dateRange

      if (dateRange.start && dateRange.start.key) {
        this.dateForm.startTime.field = dateRange.start.key
      }
      if (dateRange.start && dateRange.start.key) {
        this.dateForm.startTime.value = dateRange.start.value
      }
      if (dateRange.end && dateRange.end.key) {
        this.dateForm.endTime.field = dateRange.end.key
      }
      if (dateRange.end && dateRange.end.key) {
        this.dateForm.endTime.value = dateRange.end.value
      }
    }
    if (!this.lazy) {
      this.fetch()
    }
  }
  public clearSelect() {
    this.searchModel = {}
    this.selection.map(item => {
      if (item.type === "selectTree") {
        this.$refs[item.prop][0].setValue([])
      }
    })
  }

  public valueChange(row) {
    this.searchModel[row.prop] = `("${row.val.join('","')}")`
  }
  public getParams() {
    const base = {
        where: []
      },
      where = {
        and: []
      },
      params = _.cloneDeep(this.params),
      search = this.aggregationConditions().conditions
    const order = _.cloneDeep(this.orderModel)
    const filter = _.cloneDeep(this.filterModel)

    where.and = where.and.concat(params)
    where.and = where.and.concat(search)
    // for ( const key of Object.keys(search)) {
    //   if (key && search[key] instanceof Array) {
    //     search[key] = search[key].join(',')
    //   }
    //   if ( search[key].length === 0) {
    //     delete search[key]
    //   }
    // }
    // for ( const key of Object.keys(filter)) {
    //   if (key && filter[key] instanceof Array) {
    //     filter[key] = filter[key].join(',')
    //   }
    //   if ( filter[key].length === 0) {
    //     delete filter[key]
    //   }
    // }
    // @ts-ignore
    base.where[0] = _.cloneDeep(where)
    if (this.paging) {
      return _.assign(base, this.page)
    }
    return base
  }
  public select() {
    this._fetch()
  }
  // events
  public handleCurrentChange(page) {
    this.page.page = page
    this._fetch()
  }
  public handleSizeChange(size) {
    this.page.limit = size
    this._fetch()
  }
  public fetch() {
    this.$nextTick(() => {
      this.page.page = 1
      this._fetch()
    })
  }
  public clear() {
    this.data = []
  }
  // loading about
  public showLoading() {
    this.responseComplete = false
    setTimeout(() => {
      if (!this.responseComplete) {
        this.loading = true
      }
    }, this.loadingDelay)
  }
  public hideLoading() {
    this.loading = false
    this.responseComplete = true
  }
  @Watch("isSelecting")
  public onChange(val) {
    this.$nextTick(() => {
      ;(this.$refs.table as any).resizeTableHeight()
    })
  }
  private aggregationConditions() {
    const conditions: any = []
    this.columns.map(col => {
      if (col.selection && this.searchModel[col.prop]) {
        conditions.push({ field: col.selection.field ? col.selection.field : col.prop, value: _.cloneDeep(this.searchModel[col.prop]), type: "String", operator: col.selection.operator ? col.selection.operator : OPERATION_DEFAULT })
      }
    })
    if (this.hasDate) {
      if (this.dateForm.startTime.value) {
        conditions.push(this.dateForm.startTime)
      }
      if (this.dateForm.endTime.value) {
        conditions.push(this.dateForm.endTime)
      }
    }
    return { conditions }
  }
  private batchCascadeDelete() {
    if (!this.delUrl) {
      return
    }
    this.$confirm("级联批量删除请慎用？", "提示", {
      type: "warning"
    }).then(() => {
      if (this.delUrl.indexOf("/") === -1) {
        this.showLoading()
        this.$api(this.delUrl, this.UserSelection)
          .then(resp => {
            if (resp && resp.code === "200") {
              this.$message.success(resp.message)
              this._fetch()
            } else {
              this.$message.error(resp.message)
            }
            ;(this.$refs.table as any).resizeTableHeight()
          })
          .catch(err => {
            console.error("[Base table is error]")
          })
          .finally(() => {
            this.hideLoading()
          })
      } else {
        request(this.delUrl, { data: this.UserSelection }, "post")
          .then(resp => {
            if (resp && resp.code === "200") {
              this.$message({
                message: "删除成功！",
                type: "success"
              })
              this._fetch()
            } else {
              this.$message.error(resp.message)
            }
            ;(this.$refs.table as any).resizeTableHeight()
          })
          .finally(() => {
            this.hideLoading()
          })
      }
    })
  }
  private _fetch() {
    if (!this.url) {
      return
    }
    this.showLoading()
    if (this.url.indexOf("/") === -1) {
      this.$api(this.url, this.getParams())
        .then(resp => {
          if (resp && resp.result && resp.result.list) {
            this.total = resp.result.total || 0
            this.data = (resp.result && resp.result.list) || []
          } else {
            this.data = resp.data || []
            this.total = -1
          }
          ;(this.$refs.table as any).resizeTableHeight()
        })
        .catch(err => {
          console.error("[Base table is error]")
        })
        .finally(() => {
          this.hideLoading()
        })
    } else {
      request(this.url, this.getParams(), "post")
        .then(resp => {
          if (resp && resp.result && resp.result.list) {
            this.total = resp.result.total || 0
            this.data = (resp.result && resp.result.list) || []
          } else {
            this.data = resp.data || []
            this.total = -1
          }
          ;(this.$refs.table as any).resizeTableHeight()
        })
        .finally(() => {
          this.hideLoading()
        })
    }
  }
}
</script>

<style scoped lang="scss">
.data-table {
  padding: 8px;
  .selection_area {
    padding: 8px 0;
    border-left: 1px solid #ebeef5;
    border-top: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    .select_label {
      font-weight: 700;
      line-height: 28px;
    }
    .select_item {
      padding: 4px 8px;
    }
  }
}
</style>
