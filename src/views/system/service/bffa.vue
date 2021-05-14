<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2021-03-30 13:25:11
 * @LastEditTime: 2021-04-15 10:31:27
 * @LastEditors:  
-->
<template>
  <div class="geye-100" flex>
    <div class="compose" flex="dir:top">
      <div class="divider-title">
        {{ form.url + '-' + form.des + '-' + form.alias }}
      </div>
      <div flex-box="1" flex="dir:top" class="overflow">
        <div v-for="(level, index) in serviceList" :key="index" flex flex-box="1">
          <div flex flex-box="1" class="holder">
            <div
              v-for="(service, cindex) in level"
              :key="cindex"
              flex
              flex-box="1"
              class="serviceHolder"
            >
              <el-popover
                :title="service.alias"
                width="200"
                trigger="hover"
                :content="service.url"
                class="service"
              >
                <div slot="reference" flex-box="1">{{ service.alias }}</div>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="params form" flex-box="0" flex="dir:top">
      <div class="divider-title">
        <!-- <g-button
          type="primary"
          text="保存"
          @click="sub()"
          style="float:right; margin-left:10px;"
        ></g-button> -->
        <g-button @click="saveConfig()" text="参数配置" style="float:right"></g-button>
      </div>
      <div class="mappingList">
        <div v-for="(item, index) in bffServiceRel" :key="index" flex>
          <div flex-box="1" class="mappingLists" @click="showDetial(item)">
            {{ getUrlById(item.sour.bffServiceId) }}--->
            {{ getUrlById(item.dest.bffServiceId) }}
          </div>
          <div>
            <!-- <g-button @click="saveConfig()" type="text" text="编辑"></g-button> -->
            <g-button type="text" text="删除"></g-button>
          </div>
        </div>
      </div>
    </div>
    <div class="paramsList" flex-box="1" flex v-if="paramsList.sour">
      <div flex-box="1">
        <div class="">
          {{ getUrlById(paramsList.sour.bffServiceId) }}
        </div>
        <div>
          <div v-for="(l, i) of paramsList.sour.bffParamsMapping" :key="i">
            {{ l.bffParams.keyMap }}
          </div>
        </div>
      </div>
      <div flex-box="0">
        <div class="">
          对应
        </div>
        <div>
          <div v-for="(l, i) of paramsList.sour.bffParamsMapping" :key="i + l.bffParams.keyMap">
            =>
          </div>
        </div>
      </div>
      <div flex-box="1">
        <div class="">
          {{ getUrlById(paramsList.dest.bffServiceId) }}
        </div>
        <div>
          <div v-for="(l, i) of paramsList.dest.bffParamsMapping" :key="i">
            {{ l.bffParams.keyMap }}
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="参数配置"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="90%"
    >
      <div class="diaParams" flex-box="1" flex="dir:top">
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
          <el-switch
            v-model="selectIsSour"
            @change="doSwitch('sour')"
            active-text="入参"
            inactive-text="出参"
          >
          </el-switch>
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
          <el-switch
            v-model="selectISour"
            active-text="入参"
            inactive-text="出参"
            @change="doSwitch('dest')"
          >
          </el-switch>
          <g-button @click="sub()" text="保存" type="primary" style="float:right"></g-button>
        </div>
        <div flex-box="1" flex>
          <div flex class="box" flex-box="1">
            <div flex-box="1" class="code">
              <div class="divider-title">
                输入参数
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
                    <div class="del " v-if="item.dir === 'dest'" @click="delItem('sour', item)">
                      ×
                    </div>
                    <div flex-box="1">
                      {{ item.keyMap }}
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
              </div>
              <div flex-box="1" flex>
                <vuedraggable class="wrapper" v-model="destFliter">
                  <div v-for="(item, index) in destFliter" :key="index" class="item drag" flex>
                    <div>{{ index + 1 }}.</div>
                    <div flex-box="1">
                      {{ item.keyMap }}
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
  paramsList = {}
  serviceList: any = []
  dialogVisible = false
  selectIsSour = true
  selectISour = true
  options: any = []
  edit = { i: -1, j: -1 }
  sourUrl = ''
  destUrl = ''
  selectUrl = ''
  bffServiceRel: any = []
  value = ''
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
  get optionFilter() {
    const rel: any = []
    this.serviceList.forEach((level, i) => {
      level.forEach((item, j) => {
        rel.push({
          value: item.services + ',' + i + ',' + j,
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
  delItem(t, item) {
    if (t === 'dest') {
      // this.dest.splice(index, 1)
      item.isDel = true
      this.destchange()
    } else {
      // this.source.splice(index, 1)
      item.isDel = true
      this.sourchange()
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
    this.dialogVisible = true
  }
  doSwitch(t) {
    if (t === 'dest') {
      this.isSour = false
      this.destFliter = this.dest.filter(i => i.dir === (!this.selectISour ? 'dest' : 'sour'))
    } else {
      this.isSour = true
      this.sourFliter = this.source.filter(i => i.dir === (!this.selectIsSour ? 'dest' : 'sour'))
    }
  }
  destchange(e?) {
    if (e) {
      const id = e.split(',')[0]
      this.dest = this.services.get(id).bffParams
    }
    this.destFliter = this.dest.filter(
      i => i.dir === (!this.selectISour ? 'dest' : 'sour') && !i.isDel
    )
  }
  sourchange(e?) {
    if (e) {
      const id = e.split(',')[0]
      this.source = this.services.get(id).bffParams
    }
    this.sourFliter = this.source.filter(
      i => i.dir === (!this.selectIsSour ? 'dest' : 'sour') && !i.isDel
    )
  }
  getUrlById(e) {
    return this.services.get(e).url
  }
  change(e) {
    //
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
    bffParamsMapping = []
    this.sourFliter.forEach((item: any, index) => {
      sourceInfo.bffParams.forEach(i => {
        if (item.id === i.id) {
          i.seq = index
          bffParamsMapping.push({ bffParamsId: item.id, seq: index, dir: item.dir })
        }
      })
    })

    bffServiceMapping.push({
      bffParamsMapping,
      bffServiceId: sourceInfo.services,
      dir: 'sour',
      steps: sourceInfo.steps,
      sing: name,
      stepsIndex: sourceInfo.stepsIndex
    })
    bffParamsMapping = []
    this.destFliter.forEach((item: any, index) => {
      destInfo.bffParams.forEach(i => {
        if (item.id === i.id) {
          bffParamsMapping.push({ bffParamsId: item.id, seq: index, dir: item.dir })
        }
      })
    })
    bffServiceMapping.push({
      bffServiceId: destInfo.services,
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
      bffServiceMapping
    }
    this.$api('batchCascadeAddBffBackForFront', {
      data: {
        datas: [data]
      }
    }).then(() => {
      // this.$router.go(0)
      this.dialogVisible = false
      this.loadData(this.$route.query.id)
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
  showDetial(item) {
    this.paramsList = item
  }
  loadData(val) {
    this.$api('queryBffBackForFront', {
      where: [{ and: [{ field: 'id', operator: 7, value: val }] }],
      path: [
        'bffServiceRel',
        'bffServiceMapping.bffParamsMapping.bffParams',
        'bffServiceMapping.bffService'
      ],
      order: [{ field: 'bffServiceMapping.bffParamsMapping.seq', action: 'asc' }]
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
        for (const [key, value] of a.entries()) {
          this.bffServiceRel.push(value)
        }
      }
    })
  }
  initRel(data) {
    data.forEach(i => {
      const services = this.services.get(i.services)
      services.id = i.id
      services.services = i.services
      const steps = Number(i.steps)
      const stepsIndex = Number(i.stepsIndex)
      if (!this.serviceList[steps]) {
        this.serviceList[steps] = []
      }
      this.serviceList[steps][stepsIndex] = services
    })
    this.serviceList.forEach((item, index) => {
      this.$set(this.serviceList, index, item)
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
.mappingLists {
  cursor: pointer;
}
.diaParams {
  min-height: 500px;
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
  width: 300px;
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
.paramsList {
  div {
    line-height: 30px;
    border-bottom: 1px solid #ccc;
  }
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
