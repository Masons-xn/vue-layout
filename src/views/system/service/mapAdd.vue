<!-- 作者 xn-->
<!-- 时间 2019/8/8-->
<template>
  <g-page v-loading="loading">
    <div flex="dir:top" class="page">
      <g-form :rules="rules" :row="row" :model="form" ref="form" flex-box="0"></g-form>
      <div flex-box="1" flex="dir:top" class="base_info my-awesome-json-theme">
        <div class="divider-title" flex-box="0">
          参数定义

          <g-button @click="saveConfig()" text="保存" type="primary" style="float:right"></g-button>
          <el-switch
            v-model="selectISour"
            active-text="真实"
            inactive-text="虚拟接口"
            style="float:right"
          >
          </el-switch>
        </div>
        <div flex="dir:top" flex-box="1" class="box">
          <div flex-box="1" class="code">
            <div class="divider-title">
              输入参数
              <g-button
                text="导入"
                @click="indata('source')"
                style="float:right; margin-left:10px;"
              ></g-button>
              <g-button
                text="新增"
                @click="addData('source')"
                style="float:right; margin-left:10px;"
              ></g-button>
            </div>

            <div flex-box="1" flex>
              <vuedraggable class="wrapper" v-model="source">
                <div v-for="(item, index) in source" :key="index" class="item drag" flex>
                  <div class="del " @click="delItem('sour', index)">×</div>
                  <!-- <div>{{ item.index + 1 }}.</div> -->
                  <div>
                    <el-autocomplete
                      size="mini"
                      class="inline-input"
                      @change="change"
                      @focus="doSwitch('source')"
                      v-model="item.keyMap"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入内容"
                      @select="change"
                    ></el-autocomplete>
                    <span v-if="item.value && item.value !== 'undefined'"
                      >默认值:{{ item.value }}</span
                    >
                  </div>
                </div>
              </vuedraggable>
              <div flex-box="1">
                <json-viewer
                  :value="sourJSON"
                  :expand-depth="5"
                  theme="my-awesome-json-theme"
                ></json-viewer>
              </div>
            </div>
          </div>
          <div flex-box="1" class="code">
            <div class="divider-title">
              返回参数
              <g-button
                text="导入"
                @click="indata('dest')"
                style="float:right; margin-left:10px;"
              ></g-button>
              <g-button
                text="新增"
                @click="addData('dest')"
                style="float:right; margin-left:10px;"
              ></g-button>
            </div>
            <div flex-box="1" flex>
              <vuedraggable class="wrapper" v-model="dest">
                <div v-for="(item, index) in dest" :key="index" class="item drag" flex>
                  <div class="del" @click="delItem('dest', index)">×</div>
                  <div flex-box="1">
                    <el-autocomplete
                      size="mini"
                      class="inline-input"
                      @change="change"
                      @focus="doSwitch('dest')"
                      v-model="item.keyMap"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入内容"
                      @select="change"
                    ></el-autocomplete>
                    <span v-if="item.value && item.value !== 'undefined'"
                      >默认值:{{ item.value }}</span
                    >
                  </div>

                  <div v-if="item.value && item.value !== 'undefined'">{{ item.value }}</div>
                </div>
              </vuedraggable>
              <div flex-box="1">
                <json-viewer
                  :value="destJSON"
                  :expand-depth="5"
                  theme="my-awesome-json-theme"
                ></json-viewer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="输入json"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-input type="textarea" v-model="jsonData" class="jsonArea" :rows="20"></el-input>
      <div class="divider-title" flex="dir:right">
        <g-button @click="sub()" text="确定" type="primary"></g-button>
      </div>
    </el-dialog>
  </g-page>
</template>

<script lang="tsx">
import { Component, Provide, Vue, Prop, Watch, Emit } from 'vue-property-decorator'
import vuedraggable from 'vuedraggable'
import _ from 'lodash'
import JsonViewer from 'vue-json-viewer'
import { clap, pile } from '@/utils/adaper'
import { config } from 'vue/types/umd'
@Component({
  components: {
    vuedraggable,
    JsonViewer
  }
})
export default class ModelAdd extends Vue {
  @Prop({ default: null }) public id
  public loading = true
  jsonData = ''
  sourJSON = {}
  destJSON = {}
  selectISour = false
  sourcePool = []
  destPool = []
  isSour = true
  source: any = []
  dest: any = []
  public form = {
    id: '',
    url: '',
    des: '',
    alias: ''
  }
  querySearch(queryString, cb) {
    let restaurants = this.sourcePool
    if (this.isSour) {
      restaurants = this.destPool
    }
    const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
    cb(results)
  }
  createFilter(queryString) {
    return restaurant => {
      return restaurant.value.indexOf(queryString) === 0
    }
  }
  dialogVisible = false
  get row() {
    return [
      { label: this.$t('接口地址'), prop: 'url', placeholder: this.$t('接口地址') },
      { label: this.$t('描述'), prop: 'des', placeholder: this.$t('描述') },
      { label: this.$t('别名'), prop: 'alias', placeholder: this.$t('别名') }
    ]
  }
  get rules() {
    return {
      url: [{ required: true, message: this.$t('接口地址不能为空'), trigger: 'blur' }]
    }
  }
  @Emit('pageLoad')
  public pageLoad() {
    return true
  }
  sub() {
    const jsonData = JSON.parse(this.jsonData.replace(/\s+/g, ''))
    const pools: any = []
    for (const [key, value] of clap(jsonData).entries()) {
      pools.push({ keyMap: key, value: value })
    }
    if (this.isSour) {
      this.sourcePool = pools
      // if (this.source.length === 0) {
      this.source = pools.map(item => {
        return {
          keyMap: item.keyMap,
          value: item.value
        }
      })
      // }
    } else {
      // if (this.dest.length === 0) {
      this.dest = pools.map(item => {
        return {
          keyMap: item.keyMap,
          value: item.value
        }
      })
      // }
      this.destPool = pools
    }
    this.dialogVisible = false
  }
  addData(t) {
    if (t === 'dest') {
      this.dest.push({
        keyMap: ''
      })
    } else {
      this.source.push({
        keyMap: ''
      })
    }
  }
  delItem(t, index) {
    if (t === 'dest') {
      this.dest.splice(index, 1)
    } else {
      this.source.splice(index, 1)
    }
  }
  doSwitch(t) {
    if (t === 'dest') {
      this.isSour = false
    } else {
      this.isSour = true
    }
  }
  indata(t) {
    if (t === 'dest') {
      this.isSour = false
      this.jsonData = JSON.stringify(this.destJSON)
    } else {
      this.isSour = true
      this.jsonData = JSON.stringify(this.sourJSON)
    }
    this.dialogVisible = true
  }
  change(e) {
    console.log(e)
  }
  handleClose(done: () => void) {
    this.$confirm('确定要关闭？').then(() => {
      done()
    })
  }
  private saveConfig() {
    const config: any = []
    this.source.forEach((item: any, index) => {
      config.push({ sequence: index, dir: 'sour', keyMap: item.keyMap, value: item.value })
    })
    this.dest.forEach((item: any, index) => {
      config.push({ sequence: index, dir: 'dest', keyMap: item.keyMap, value: item.value })
    })
    this.$api('batchCascadeAddBffService', {
      data: {
        datas: [
          {
            id: this.form.id,
            url: this.form.url,
            des: this.form.des,
            alias: this.form.alias,
            bffParams: config,
            isService: this.selectISour ? '1' : 0
          }
        ]
      }
    }).then(() => {
      this.pageLoad()
    })
  }
  private loadData(v) {
    this.getModel(v)
  }
  private clearData() {
    this.loading = false
    this.form = {
      alias: '',
      id: '',
      url: '',
      des: ''
    }
  }
  private getModel(val) {
    this.$api('queryBffService', {
      where: [{ and: [{ field: 'id', operator: 7, value: val }] }],
      path: ['bffParams'],
      order: [{ field: 'bffParams.sequence', action: 'asc' }]
    }).then(res => {
      if (res?.result?.list?.length > 0) {
        const data = res.result.list[0]
        this.form = {
          alias: data.alias,
          id: data.id,
          url: data.url,
          des: data.des
        }
        this.selectISour = data.isService === '1'
        this.source = data.bffParams.filter(item => item.dir === 'sour')
        this.dest = data.bffParams.filter(item => item.dir === 'dest')
      }
    })
    this.loading = false
  }
  @Watch('source', { immediate: true, deep: true })
  private onSourChange(val) {
    this.sourJSON = pile(val)
    console.log(this.sourJSON)
  }
  @Watch('dest', { immediate: true, deep: true })
  private onDestChange(val) {
    this.destJSON = pile(val)
  }
  @Watch('$route.query.id', { immediate: true })
  private onChange(val: string) {
    if (val) {
      this.loadData(val)
    } else {
      this.clearData()
    }
  }
}
</script>

<style scoped lang="scss">
.divider-title {
  padding: 10px;
}
.wrapper {
  color: #000;
  line-height: 33px;
  .el-input__inner {
    width: 400px;
  }
}
.box {
  overflow-y: auto;
  height: 0;
  & > .code {
    width: 100%;
  }
}
.item {
  height: 28px;
  margin: 5px 0;
}
.drag {
  .del {
    width: 20px;
    color: #000;
    line-height: 30px;
    font-size: 16px;
    cursor: pointer;
  }
}
.divider-title {
  padding: 10px;
  height: 50px;
  border-bottom: 1px solid #e4e4e4;
  .el-select {
    display: inline-flex;
    width: 240px;
  }
}
.my-awesome-json-theme {
  background: #fff;
  white-space: nowrap;
  color: #525252;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button {
    color: #49b3ff;
  }
  .jv-key {
    color: #111111;
  }
  .jv-item {
    &.jv-array {
      color: #111111;
    }
    &.jv-boolean {
      color: #fc1e70;
    }
    &.jv-function {
      color: #067bca;
    }
    &.jv-number {
      color: #fc1e70;
    }
    &.jv-object {
      color: #111111;
    }
    &.jv-undefined {
      color: #e08331;
    }
    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    .jv-toggle {
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}
</style>
