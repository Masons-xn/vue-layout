<!-- 作者 xn-->
<!-- 时间 2019/8/8-->
<template>
  <g-page v-loading="loading">
    <g-form :rules="rules" :row="row" :model="form" ref="form"></g-form>
    <div class="base_info">
      <div class="divider-title">
        基本属性
        <g-button
          @click="addNewProperty"
          text="新增"
          style="float:right"
        ></g-button>
      </div>
      <el-table :data="basicProperties">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.stType">
              <el-option
                v-for="item in typeOption"
                v-bind:key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="列名">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stColumnName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="长度">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stlength"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="deletePropertyData(scope)"
              type="text"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="base_info">
      <div class="divider-title">
        关系属性
        <g-button @click="addNewRef" text="新增" style="float:right"></g-button>
      </div>
      <el-table :data="refs">
        <!--        <el-table-column label="关联属性名">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-input v-model="scope.row.stName"  :disabled="scope.row.inRelation === '0'"></el-input>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="关联类型">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.inRelation"
              :disabled="scope.row.inRelation === '0'"
            >
              <el-option
                v-for="item in refTypeOption"
                :label="item.label"
                v-bind:key="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="关联模型名称">
          <template slot-scope="scope">
            <el-autocomplete
              :disabled="scope.row.inRelation === '0'"
              v-model="scope.row.modelName"
              :fetch-suggestions="querySearchAsync"
              @select="refTypeModelName(scope)"
            ></el-autocomplete>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="deleteRefData(scope)"
              :disabled="scope.row.inRelation === '0'"
              type="text"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="divider-title" flex="dir:right">
      <g-button @click="saveModel()" text="保存" type="primary"></g-button>
    </div>
  </g-page>
</template>

<script lang="tsx">
import {
  Component,
  Provide,
  Vue,
  Prop,
  Watch,
  Emit
} from "vue-property-decorator"
import _ from "lodash"
interface DataForm {
  stName: string
  stTableName: string
  des: string
}
interface Base {
  stName: string
  stType: string
  stColumnName: string
  stlength: string
}
interface Refs {
  stDestModelID: any
  id: any
  stName: string
  inRelation: string
  modelName: string
  stDestName: string
}
@Component
export default class ModelAdd extends Vue {
  @Prop({ default: null }) public id
  @Prop({ default: [] }) public models: any[]
  public basicProperties: Base[] = []
  public refs: Refs[] = []
  public loading = true
  public needDelRels: Refs[] = []
  public needDelPros: string[] = []
  public refTypeOption: any = [
    { label: "一对多", value: "1" },
    { label: "多对一", value: "0" }
  ]
  public form: DataForm = {
    stName: "",
    stTableName: "",
    des: ""
  }
  public typeOption: any = [
    { label: "String", value: "varchar" },
    { label: "Integer", value: "Integer" },
    { label: "Boolean", value: "Boolean" },
    { label: "Date", value: "Date" },
    { label: "text", value: "text" },
    { label: "Double", value: "Double" }
  ]
  get row() {
    return [
      { label: this.$t("名称"), prop: "stName", placeholder: this.$t("名称") },
      {
        label: this.$t("表名"),
        prop: "stTableName",
        placeholder: this.$t("表名")
      }
    ]
  }
  get rules() {
    return {
      name: [
        { required: true, message: this.$t("用户名不能为空"), trigger: "blur" }
      ],
      pass: [
        { required: true, message: this.$t("密码不能为空"), trigger: "blur" }
      ]
    }
  }
  @Emit("pageLoad")
  public pageLoad() {
    return true
  }
  private querySearchAsync(quertyStr: any, cb: (arg0: any[]) => void) {
    let model = _.cloneDeep(this.models)

    if (quertyStr) {
      model = this.models.filter(item => item.label.indexOf(quertyStr) > -1)
    }
    model.map(item => {
      item.value = item.label
    })
    cb(model)
  }
  private saveModel() {
    this.$api("saveModel", {
      data: {
        id: this.id,
        stName: this.form.stName,
        stTableName: this.form.stTableName,
        rels: this.refs,
        bases: this.basicProperties,
        needDelRels: this.needDelRels,
        needDelPros: this.needDelPros
      }
    }).then(() => {
      this.pageLoad()
    })
  }
  private loadData() {
    // eslint-disable-next-line no-undef
    Promise.all([
      this.getModel(),
      this.getModelBase(),
      this.getModelRel()
    ]).then(() => {
      this.loading = false
    })
  }
  private refTypeModelName(scope: {
    row: { stDestModelID: any; modelName: any; stName: any; stDestName: string }
  }) {
    scope.row.stDestModelID = this.models.filter(
      item => item.label === scope.row.modelName
    )[0].id
    scope.row.stName = this.models.filter(
      item => item.label === scope.row.modelName
    )[0].stTableName
    scope.row.stDestName = this.form.stTableName
  }
  private clearData() {
    this.basicProperties.length = 0
    this.refs.length = 0
    this.loading = false
    this.form = {
      stName: "",
      stTableName: "",
      des: ""
    }
  }
  private getModel() {
    this.$api("getModel", { where: [{ and: [{ modelId: this.id }] }] }).then(
      res => {
        this.form = res.result.list[0]
      }
    )
  }
  private getModelBase() {
    this.$api("getModelBase", {
      where: [{ and: [{ modelId: this.id }] }]
    }).then(res => {
      this.basicProperties = res && res.result && res.result.list
    })
  }
  private getModelRel() {
    this.$api("getModelRel", { where: [{ and: [{ modelId: this.id }] }] }).then(
      (res:any) => {
        const data = res && res.result && res.result.list
        data.map((mo: Refs) => {
          mo.modelName = this.getModelName(mo)
          mo.inRelation = String(mo.inRelation)
        })
        this.refs = data
      }
    )
  }
  private getModelName(model:Refs) {
    return this.models.filter(item => item.id === model.stDestModelID)[0].stName
  }
  private addNewProperty() {
    this.basicProperties.push({
      stName: "",
      stType: "varchar",
      stColumnName: "",
      stlength: "32"
    })
  }
  private deletePropertyData(data: { row: { id: string }; $index: number }) {
    if (data.row.id) {
      this.needDelPros.push(data.row.id)
    }
    this.basicProperties = _.remove(
      this.basicProperties,
      (item, index) => index !== data.$index
    )
  }
  private deleteRefData(data: { row: Refs; $index: number }) {
    if (data.row.id) {
      this.needDelRels.push(data.row)
    }
    this.refs = _.remove(this.refs, (item, index) => index !== data.$index)
  }
  private addNewRef() {
    this.refs.push({
      id: "",
      stName: "",
      inRelation: "1",
      modelName: "",
      stDestName: "",
      stDestModelID:''
    })
  }
  @Watch("id", { immediate: true })
  private onChange(val: string) {
    if (val) {
      this.loadData()
    } else {
      this.clearData()
    }
  }
}
</script>

<style scoped lang="scss">
.divider-title {
  padding: 10px;
  margin-bottom: 20px;
  background: #fbfbfb;
  border-bottom: 1px solid #e4e4e4;
  .el-select {
    display: inline-flex;
    width: 240px;
  }
}
</style>
