<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2020-12-25 10:28:34
 初始化的时候 选择的属性需要回写
 * @LastEditTime: 2020-12-30 08:55:00
 * @LastEditors:  
-->
<!-- 作者 xn-->
<!-- 时间 2019/8/9-->
<template>
  <div flex="dir:top" v-loading="loading">
    <div>角色名称:{{ roleName }}</div>
    <div flex class="pwoer">
      <div flex-box="0" style="width:400px">
        <div class="divider-title">
          受限模型
          <g-button @click="addPowers" text="新增" type="primary" style="float:right"></g-button>
        </div>
        <el-table :data="modelSelected" height="400px">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column label="模型名称">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.mid"
                @change="
                  val => {
                    modelChange(scope.row, val)
                  }
                "
              >
                <el-option
                  v-for="item in modelSelect"
                  v-bind:key="item.value"
                  :label="item.stName"
                  :value="item.id"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="展示某列数据">
            <template slot-scope="scope">
              <el-select v-model="scope.row.baseSelected" multiple>
                <el-option
                  v-for="item in scope.row.baseSelection"
                  v-bind:key="item.value"
                  :label="item.stName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <g-button type="text" text="查看" @click="seeDetial(scope.row)"></g-button>
              <el-divider direction="vertical"></el-divider>
              <el-button @click="selectReomve(scope)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div flex-box="1" class="powerData" style="height:400px">
        <div class="divider-title">
          受限数据
          <g-button
            style="float:right"
            type="primary"
            text="初始化"
            @click="authorizeInit()"
          ></g-button>
          <el-switch
            style="float:right"
            @change="PowerChange"
            v-model="isPowerd"
            active-text="已授权"
            inactive-text="未授权"
          >
          </el-switch>
        </div>
        <g-data-table
          height="400px"
          ref="table"
          :url="method"
          :params="params"
          :columns="columns"
          :tableConfig="tableConfig"
        >
          <template slot="operator" slot-scope="{ row }">
            <g-button
              type="text"
              v-if="isPowerd"
              text="取消授权"
              @click="cancelAuthorize(row)"
            ></g-button>
            <g-button type="text" v-else text="授权" @click="authorize(row)"></g-button>
          </template>
        </g-data-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { saveModel } from '@/utils/api/common/model'
import _ from 'lodash'
import { Component, Provide, Vue, Prop, Watch, Emit } from 'vue-property-decorator'
@Component
export default class UserAdd extends Vue {
  currentEdit: any = {}
  roleName = ''
  isPowerd = true
  loading = true
  model: any[] = []
  modelSelected: any[] = []
  method = ''
  columns = []
  queryModelName = ''
  get params() {
    return {
      modelName: this.queryModelName,
      roleId: this.user.id,
      isPowerd: this.isPowerd
    }
  }
  get tableConfig() {
    return {
      props: {
        dateRange: false
      }
    }
  }
  baseSelect = []
  modelBase = []
  option = []
  @Prop({ default: null }) user: any
  @Emit('reload')
  public reload() {
    return true
  }
  get modelSelect() {
    const all = this.model.filter((mode: { id: string }) => {
      return this.modelSelected.findIndex(sl => sl.id === mode.id) === -1
    })
    return all
  }
  pageLoad() {
    Promise.all([this.loadModel(), this.loadModelBase(), this.loadlPowerModel()]).then(() => {
      this.loading = false
      this.method = ``
      ;(this.$refs['table'] as any).clear()
    })
  }
  public loadlPowerModel() {
    return this.$api('queryPower', {
      where: [
        {
          and: [
            {
              field: 'roleId',
              operator: 7,
              type: 'String',
              value: this.user.id
            }
          ]
        }
      ]
    }).then(res => {
      if (res?.result?.list) {
        this.modelSelected = []
        res.result.list.map(item => {
          const baseSelection = this.modelBase.filter((base: { stModelId: '' }) => {
            return base.stModelId === item.model
          })
          this.modelSelected.push({
            id: item.id,
            mid: item.model,
            baseSelection: baseSelection,
            baseSelected: item.ids.split(',')
          })
          this.modelSelectDisable(item.model)
        })
      }
    })
  }
  public loadModel() {
    return this.$api('getModel').then(res => {
      this.$set(
        this,
        'model',
        res.result.list.filter(item => item.isPowered === 1)
      )
    })
  }
  public loadModelBase() {
    return this.$api('getModelBase').then(res => {
      this.modelBase = res.result.list
    })
  }
  authorize(scope) {
    const insertData = {
      id: this.currentEdit.id,
      model: this.currentEdit.mid,
      ids: this.currentEdit.baseSelected,
      modelDatas: [
        {
          id: scope.id,
          roleId: this.user.id
        }
      ],
      roleId: this.user.id,
      modelName: this.currentEdit.modelName
    }
    this.$api('dataAuthorize', insertData).then(res => {
      if (res.code === '200') {
        this.$message.success(this.isPowerd ? '已经取消授权！' : '授权成功')
        if (!this.currentEdit.id) {
          this.pageLoad()
        }
        ;(this.$refs['table'] as any).fetch()
      } else {
        this.$message.error(res.msg)
      }
    })
  }
  PowerChange() {
    ;(this.$refs['table'] as any).fetch()
  }
  authorizeInit() {
    this.$api('initAuthorize').then(res => {
      if (res.code === '200') {
        this.$message.success('初始化成功！')
      } else {
        this.$message.error(res.msg)
      }
    })
  }
  cancelAuthorize(scope) {
    const insertData = {
      id: this.currentEdit.id,
      model: this.currentEdit.mid,
      ids: this.currentEdit.baseSelected,
      modelDatas: [
        {
          id: scope.id,
          roleId: this.user.id
        }
      ],
      roleId: this.user.id,
      modelName: this.currentEdit.modelName
    }
    this.$api('cancelAuthorize', insertData).then(res => {
      if (res.code === '200') {
        this.$message.success(this.isPowerd ? '已经取消授权！' : '授权成功')
        if (!this.currentEdit.id) {
          this.pageLoad()
        }
        ;(this.$refs['table'] as any).fetch()
      } else {
        this.$message.error(res.msg)
      }
    })
  }
  seeDetial(v) {
    this.currentEdit = v
    const props = v.baseSelection
      .filter((base: { id: string }) => {
        return v.baseSelected.indexOf(base.id) > -1
      })
      .map(i => {
        return {
          label: i.stName,
          prop: i.stColumnName
        }
      })
    const modelName = this.model.find((item: { id: string }) => item.id === v.mid).stTableName
    this.currentEdit.modelName = modelName
    const name = modelName.replace(modelName[0], modelName[0].toUpperCase())
    this.method = `queryModelDatas`
    // this.queryModelDatas
    this.queryModelName = modelName
    this.$set(
      this,
      'columns',
      props.concat([
        {
          label: '操作',
          slotName: 'operator',
          align: 'center',
          width: 100
        }
      ])
    )
    setTimeout(() => {
      ;(this.$refs['table'] as any).fetch()
    }, 500)
  }
  private addPowers() {
    this.modelSelected.push({
      mid: '',
      baseSelection: [],
      baseSelected: []
    })
  }
  modelChange(model, val) {
    this.modelSelected.map(item => {
      if (item.mid === model.mid) {
        item.baseSelection = this.modelBase.filter((base: { stModelId: '' }) => {
          return base.stModelId === model.mid
        })
        item.baseSelected = []
      }
    })
    this.modelSelectDisable(model.mid)
  }
  modelSelectDisable(mid) {
    this.model.map(item => {
      if (item.id === mid) {
        item.disabled = 'disabled'
      }
    })
  }
  modelSelectDisableRemove(mid) {
    this.model.map(item => {
      if (item.id === mid) {
        delete item.disabled
      }
    })
  }
  private selectReomve(data: { row: { [x: string]: any }; $index: number }) {
    this.$confirm(this.$t('确定删除此选项吗?').toString(), '提示', {
      type: 'warning'
    }).then(() => {
      if (!data.row.id) {
        this.modelSelected.splice(data.$index, 1)
      } else {
        this.$api('delPower', {
          id: [data.row.id]
        }).then((res): void => {
          this.modelSelected.splice(data.$index, 1)
          if (res.code === '200') {
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
      if (data.row.mid) {
        this.modelSelectDisableRemove(data.row.mid)
      }
    })
  }
  @Watch('user', { immediate: true, deep: true })
  onUserChange(val) {
    if (val.id) {
      this.roleName = val.name
    }
    this.pageLoad()
  }
}
</script>

<style scoped lang="scss">
.pwoer {
  .powerData {
    padding-left: 30px;
    height: 510px;
  }
  .divider-title {
    padding: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e4e4e4;
    .el-select {
      display: inline-flex;
      width: 240px;
    }
  }
}
</style>
