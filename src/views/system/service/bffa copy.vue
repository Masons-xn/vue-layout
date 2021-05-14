<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2021-03-30 13:25:11
 * @LastEditTime: 2021-04-12 14:12:56
 * @LastEditors:  
-->
<template>
  <div class="geye-100" flex>
    <div class="compose" flex="dir:top">
      <div class="divider-title">
        接口编排
        <g-button text="增加" @click="add()" style="float:right; margin-left:10px;"></g-button>
        <g-button
          text="选取"
          :disabled="bdisabled"
          @click="addData(index)"
          style="float:right; margin-left:10px;"
        ></g-button>
        <g-button
          text="删除"
          :disabled="bdisabled"
          @click="addData(index)"
          style="float:right; margin-left:10px;"
        ></g-button>
      </div>
      <div flex-box="1" flex="dir:top" class="overflow">
        <div v-for="(level, index) in serviceList" :key="index" flex flex-box="1">
          <div>
            <g-button
              text="增加"
              @click="addData(index)"
              style="float:right; margin-left:10px;"
            ></g-button>
          </div>
          <div flex flex-box="1" class="holder">
            <div
              v-for="(service, cindex) in level"
              :key="cindex"
              flex
              flex-box="1"
              @click="e => selectNode(index, cindex, e, service.select)"
              class="serviceHolder"
            >
              <el-popover
                :title="service.alias"
                width="200"
                trigger="hover"
                :content="service.url"
                :class="'service ' + 'level' + index + (service.select ? ' selected' : '')"
              >
                <div slot="reference" flex-box="1">{{ service.alias }}</div>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="params form" flex-box="0" flex="dir:top">
      <div>
        <g-form :rules="rules" :row="row" :model="form" ref="form"></g-form>
        <g-button
          @click="saveConfig()"
          text="参数配置"
          type="primary"
          style="float:right"
        ></g-button>
      </div>
      <div class="mappingList">
        <div v-for="(item, index) in bffServiceRel" :key="index" flex>
          <div flex-box="1">
            {{ getUrlById(item.sour.bffServiceId) }} ------->
            {{ getUrlById(item.dest.bffServiceId) }}
          </div>
          <div>
            <g-button @click="saveConfig()" type="text" text="编辑"></g-button>
            <g-button type="text" text="删除"></g-button>
          </div>
        </div>
        <!-- 接口转换列表 -->
      </div>
    </div>
    <div class="params" flex-box="1">
      参数描述
    </div>
    <el-dialog
      title="选取接口"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :width="model === 'sub' ? '90%' : ''"
    >
      <el-select
        v-model="selectUrl"
        size="mini"
        placeholder="请选择"
        @change="select"
        v-if="model !== 'sub'"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <div v-else class="diaParams" flex-box="1" flex="dir:top">
        <div class="divider-title">
          配置参数映射
          <el-select v-model="sourUrl" size="mini" placeholder="请选择" @change="sourchange">
            <el-option
              v-for="item in optionFilter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-switch v-model="selectIsSour" active-text="入参" inactive-text="出参"> </el-switch>
          至
          <el-select v-model="destUrl" size="mini" placeholder="请选择" @change="destchange">
            <el-option
              v-for="item in optionFilter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-switch v-model="selectISour" active-text="入参" inactive-text="出参"> </el-switch>
          <g-button @click="sub()" text="保存" type="primary" style="float:right"></g-button>
        </div>
        <div flex-box="1" flex>
          <div flex class="box" flex-box="1">
            <div flex-box="1" class="code">
              <div class="divider-title">
                输入参数
                <g-button
                  text="新增"
                  @click="addDataParams('source')"
                  style="float:right; margin-left:10px;"
                ></g-button>
              </div>

              <div flex-box="1" flex>
                <div flex-box="1">
                  <json-viewer
                    :value="sourJSON"
                    :expand-depth="5"
                    theme="my-awesome-json-theme"
                  ></json-viewer>
                </div>
                <vuedraggable class="wrapper" v-model="sourFliter">
                  <div v-for="(item, index) in sourFliter" :key="index" class="item drag" flex>
                    <div class="del " v-if="item.dir === 'dest'" @click="delItem('sour', index)">
                      ×
                    </div>
                    <div flex-box="1">
                      {{ item.keyMap }}
                      <!-- <el-input
                        size="mini"
                        class="inline-input"
                        @change="change"
                        @focus="doSwitch('source')"
                        v-model="item.keyMap"
                        placeholder="请输入内容"
                      ></el-input> -->
                    </div>
                    <div>{{ index + 1 }}.</div>
                  </div>
                </vuedraggable>
              </div>
            </div>
            <div class="icon">
              <div v-for="(item, index) in sourFliter" :key="index" class="holderIcon">
                >>
              </div>
            </div>
            <div flex-box="1" class="code">
              <div class="divider-title">
                返回参数
                <g-button
                  text="新增"
                  @click="addDataParams('dest')"
                  style="float:right; margin-left:10px;"
                ></g-button>
              </div>
              <div flex-box="1" flex>
                <vuedraggable class="wrapper" v-model="destFliter">
                  <div v-for="(item, index) in destFliter" :key="index" class="item drag" flex>
                    <div>{{ index + 1 }}.</div>
                    <div flex-box="1">
                      {{ item.keyMap }}
                      <!-- <el-input
                        size="mini"
                        class="inline-input"
                        @focus="doSwitch('dest')"
                        v-model="item.keyMap"
                        placeholder="请输入内容"
                      ></el-input> -->
                    </div>
                    <div class="del" v-if="item.dir === 'dest'" @click="delItem('dest', index)">
                      ×
                    </div>
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
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Watch } from 'vue-property-decorator'
import vuedraggable from 'vuedraggable'
import JsonViewer from 'vue-json-viewer'
import { pile } from '@/utils/adaper'
@Component({
  components: { vuedraggable, JsonViewer }
})
export default class Composea extends Vue {
  services = new Map()
  serviceList: any = []
  dialogVisible = false
  selectIsSour = true
  selectISour = true
  bdisabled = 'disabled'
  options: any = []
  edit = { i: -1, j: -1 }
  sourUrl = ''
  destUrl = ''
  selectUrl = ''
  bffServiceRel: any = []
  value = ''
  //
  form = {
    id: '',
    url: '',
    des: '',
    alias: ''
  }
  jsonData = ''
  sourJSON = {}
  destJSON = {}
  isSour = true
  source: any = []
  dest: any = []
  destFliter: any = []
  sourFliter: any = []
  model = ''
  get row() {
    return [
      { label: this.$t('接口地址'), prop: 'url', placeholder: this.$t('接口地址') },
      { label: this.$t('描述'), prop: 'des', placeholder: this.$t('描述') },
      { label: this.$t('别名'), prop: 'alias', placeholder: this.$t('别名') }
    ]
  }
  get optionFilter() {
    const rel: any = []
    this.serviceList.forEach((level, i) => {
      level.forEach((item, j) => {
        rel.push({
          value: item.bffServiceId + ',' + i + ',' + j,
          label: item.url
        })
      })
    })

    return rel
  }
  get serviceMapStep() {
    const rel: any = []
    this.serviceList.forEach((level, i) => {
      level.forEach((item, j) => {
        rel.push({
          steps: i,
          stepsIndex: j,
          value: item.id,
          url: item.id
        })
      })
    })

    return rel
  }
  get rules() {
    return {
      url: [{ required: true, message: this.$t('接口地址不能为空'), trigger: 'blur' }]
    }
  }
  // get sourceFliter() {
  //   return this.source.filter(i => i.dir === (!this.selectIsSour ? 'dest' : 'sour'))
  // }
  // get destFliter() {
  //   return this.dest.filter(i => i.dir === (!this.selectISour ? 'dest' : 'sour'))
  // }
  get option() {
    return this.options.filter(i => i.value !== this.sourUrl)
  }
  mounted() {
    this.$nextTick(() => {
      this.draw()
    })
  }
  handleClose(done: () => void) {
    this.$confirm('确定要关闭？').then(() => {
      done()
      this.model = ''
      this.edit.i = -1
      this.edit.j = -1
    })
  }
  add() {
    this.serviceList.push([
      {
        alias: '',
        url: '',
        select: false,
        id: '',
        des: ''
      }
    ])
  }
  randomString(len: number) {
    len = len || ~~(Math.random() * 32)
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789'
    const maxPos = $chars.length
    let str = ''

    for (let i = 0; i < len; i++) {
      str += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return str
  }
  addDataParams(t) {
    if (t === 'dest') {
      this.dest.push({
        keyMap: '',
        dir: !this.selectISour ? 'dest' : 'sour'
      })
    } else {
      this.source.push({
        keyMap: '',
        dir: !this.selectIsSour ? 'dest' : 'sour'
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
  addData(i) {
    const data = this.serviceList[i]
    data.push({
      alias: '',
      url: '',
      id: '',
      select: false,
      des: ''
    })
    this.$set(this.serviceList, i, data)
  }
  saveConfig() {
    const { verify }: any = this.$refs.form
    verify(valid => {
      if (valid && this.serviceList.length > 1) {
        this.model = 'sub'
        this.dialogVisible = true
      } else {
        this.$message.error('接口需大于两个才能进行配置')
      }
    })
  }
  doSwitch(t) {
    if (t === 'dest') {
      this.isSour = false
    } else {
      this.isSour = true
    }
  }
  selectNode(i, j, _e, select) {
    this.serviceList[i][j].select = !!select
    this.dialogVisible = true
    this.edit.i = i
    this.edit.j = j
  }
  destchange(e) {
    const id = e.split(',')[0]
    this.dest = this.services.get(id).bffParams
    this.destFliter = this.dest.filter(i => i.dir === (!this.selectISour ? 'dest' : 'sour'))
  }
  sourchange(e) {
    const id = e.split(',')[0]
    this.source = this.services.get(id).bffParams
    this.destFliter = this.source.filter(i => i.dir === (!this.selectIsSour ? 'dest' : 'sour'))
    // this.source.forEach(element => {
    //   // delete element.id
    // })
    // const
  }
  getUrlById(e) {
    return this.services.get(e).url
  }
  change(e) {
    //
  }
  select(e) {
    this.dialogVisible = false
    if (this.edit.i > -1 && this.edit.j > -1) {
      this.serviceList[this.edit.i][this.edit.j].url = this.services.get(e).url
      this.serviceList[this.edit.i][this.edit.j].bffServiceId = e
      this.serviceList[this.edit.i][this.edit.j].des = this.services.get(e).des
      this.serviceList[this.edit.i][this.edit.j].alias = this.services.get(e).alias
    }
  }
  close() {
    this.model = ''
  }
  sub() {
    const name = this.randomString(~~(Math.random() * 30))
    const sourceParams: any = []
    const destParams: any = []

    const sourceInfo = this.services.get(this.sourUrl.split(',')[0])
    sourceInfo.steps = this.sourUrl.split(',')[1]
    sourceInfo.stepsIndex = this.sourUrl.split(',')[2]
    const destInfo = this.services.get(this.destUrl.split(',')[0])
    destInfo.steps = this.destUrl.split(',')[1]
    destInfo.stepsIndex = this.destUrl.split(',')[2]
    const bffServiceMapping: any = []
    let bffParamsMapping: any = []

    // const bFFServiceParamsMapping: any = {
    //   source: sourceInfo,
    //   dest: destInfo
    // }
    const rel: any = []
    this.serviceList.forEach((level, i) => {
      level.forEach((item, j) => {
        rel.push({
          id: item.relId,
          steps: i,
          stepsIndex: j,
          services: item.id
        })
      })
    })
    this.sourFliter.forEach((item: any, index) => {
      bffParamsMapping = []
      sourceInfo.bffParams.forEach(i => {
        if (item.id === i.id) {
          i.seq = index
          // ParamsMapping.push(item)
          bffParamsMapping.push({ bffParamsId: item.id, seq: index, dir: item.dir })
        }
      })
    })

    bffServiceMapping.push({
      bffParamsMapping,
      bffServiceId: sourceInfo.id,
      dir: 'sour',
      steps: sourceInfo.steps,
      sing: name,
      stepsIndex: sourceInfo.stepsIndex
    })
    this.destFliter.forEach((item: any, index) => {
      bffParamsMapping = []
      destInfo.bffParams.forEach(i => {
        if (item.id === i.id) {
          bffParamsMapping.push({ bffParamsId: item.id, seq: index, dir: item.dir })
        }
      })
    })
    bffServiceMapping.push({
      bffServiceId: destInfo.id,
      steps: destInfo.steps,
      dir: 'dest',
      stepsIndex: destInfo.stepsIndex,
      bffParamsMapping,
      sing: name
    })
    const data = {
      id: this.form.id,
      url: this.form.url,
      des: this.form.des,
      bffServiceRel: rel,
      sing: name,
      bffServiceMapping,
      bffParamsMapping
    }
    this.$api('batchCascadeAddBffBackForFront', {
      data: {
        datas: [data]
      }
    }).then(() => {
      this.$router.go(0)
    })
  }
  draw() {
    this.renderArrow()
  }
  created() {
    this.$api('queryBffService', {
      path: ['bffParams']
    }).then(res => {
      res?.result?.list.forEach((item: any) => {
        this.options.push({
          value: item.id,
          label: item.url
        })
        this.services.set(item.id, item)
      })
      if (this.$route.query.id) {
        this.loadData(this.$route.query.id)
      }
    })
  }
  loadData(val) {
    this.$api('queryBffBackForFront', {
      where: [{ and: [{ field: 'id', operator: 7, value: val }] }],
      path: [
        'bffServiceRel',
        'bffServiceMapping.bffParamsMapping.bffParams',
        'bffServiceMapping.bffService'
      ]
    }).then(res => {
      if (res?.result?.list?.length > 0) {
        const data = res.result.list[0]
        this.form = {
          alias: data.alias,
          id: data.id,
          url: data.url,
          des: data.des
        }
        this.initRel(data.bffServiceRel)
        const rel = data.bffServiceMapping
        const a = new Map()
        rel.map(i => {
          if (a.get(i.sing)) {
            const e = a.get(i.sing)
            if (i.dir === 'dest') {
              e.dest = i
            } else {
              e.sour = i
            }
            a.set(i.sing, e)
          } else {
            if (i.dir === 'dest') {
              a.set(i.sing, { dest: i })
            } else {
              a.set(i.sing, { sour: i })
            }
          }
        })
        this.bffServiceRel = []
        // this.bffServiceRel = data.bffServiceMapping
        // console.log(data.bffServiceMapping)
        // console.log(a.get('1'))
        // const b = []
        for (const [key, value] of a.entries()) {
          this.bffServiceRel.push(value)
        }
        // this.source = data.bffParams.filter(item => item.dir === 'sour')
        // this.dest = data.bffParams.filter(item => item.dir === 'dest')
      }
    })
  }
  initRel(data) {
    data.forEach(i => {
      const services = this.services.get(i.services)
      services.relId = i.id
      const steps = Number(i.steps)
      const stepsIndex = Number(i.stepsIndex)
      if (!this.serviceList[steps]) {
        this.serviceList[steps] = []
      }
      this.serviceList[steps][stepsIndex] = services
    })
  }
  renderArrow() {
    const nodes = document.querySelectorAll('.service')
    const nodeA: Element = nodes[0]
    const nodeB = nodes[1]
  }
  @Watch('sourFliter', { immediate: true, deep: true })
  private onSourChange(val) {
    if (val) {
      this.sourJSON = pile(val)
    }
  }
  @Watch('destFilter', { immediate: true, deep: true })
  private onDestChange(val) {
    if (val) {
      this.destJSON = pile(val)
    }
  }
  @Watch('$route.query.id', { immediate: false })
  private onChange(val: string) {
    if (val) {
      this.loadData(val)
    } else {
      // this.clearData()
    }
  }
}
</script>

<style scoped lang="scss">
.compose {
  width: 400px;
  border-right: 1px solid #ccc;
}
.divider-title {
  padding: 10px;
  height: 50px;
  border-bottom: 1px solid #e4e4e4;
}
.diaParams {
  height: 600px;
  overflow-y: auto;
}
.mappingList {
  > div {
    line-height: 40px;
  }
}
.holder {
  border-bottom: 1px solid #e4e4e4;
  position: relative;
}
.form {
  width: 500px;
  padding: 20px;
  border-right: 1px solid #ccc;
}
.serviceHolder {
  align-items: center;
  justify-content: center;
  position: relative;
  .service {
    display: block;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid #ccc;
    line-height: 100px;
    text-align: center;
    &.selected {
      border: 2px solid #0f0;
    }
  }
}
.overflow {
  overflow-y: auto;
}
.divider-title {
  padding: 10px;
}
.wrapper {
  width: 300px;
  color: #000;
  padding: 0 10px;
  line-height: 33px;
  overflow-y: auto;
}
.box {
  & > .code {
    width: 50%;
  }
  .icon {
    margin-top: 50px;
    line-height: 33px;
    width: 30px;
    text-align: center;
  }
}
.item {
  width: 280px;
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
<style>
.arrow {
  width: 10px;
  height: 10px;
  background: #0f0;
}
</style>
