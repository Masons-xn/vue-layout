<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2021-03-30 13:25:11
 * @LastEditTime: 2021-04-12 14:03:19
 * @LastEditors:  
-->
<template>
  <div class="geye-100" flex>
    <div class="compose geye-100" flex="dir:top">
      <div class="divider-title">
        接口编排
        <g-button text="保存" @click="sub()" style="float:right; margin-left:10px;"></g-button>
        <g-button text="增加" @click="add()" style="float:right; margin-left:10px;"></g-button>
        <g-button
          text="选取"
          :disabled="bdisabled"
          @click="selectService(index)"
          style="float:right; margin-left:10px;"
        ></g-button>
        <g-button
          text="删除"
          :disabled="bdisabled"
          @click="delService()"
          style="float:right; margin-left:10px;"
        ></g-button>
      </div>
      <div
        class="params form"
        flex-box="0"
        flex="dir:top"
        @click="e => selectNode(-1, -1, e, true)"
      >
        <div>
          <g-form :rules="rules" :row="row" :model="form" ref="form"></g-form>
        </div>
      </div>
      <div flex-box="1" flex class="overflow" @click="e => selectNode(-1, -1, e, true)">
        <div
          v-for="(level, index) in serviceList"
          class="relList"
          :key="index + '-' + level"
          flex="dir:top"
          flex-box="1"
        >
          <div class="addButton">
            <g-button
              text="增加"
              @click="addData(index)"
              style="float:right; margin-left:10px;"
            ></g-button>
          </div>
          <div flex="dir:top" flex-box="1" class="holder">
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
    <el-dialog title="选取接口" :visible.sync="dialogVisible" :before-close="handleClose">
      <el-select v-model="selectUrl" size="mini" placeholder="请选择" @change="select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
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
export default class Compose extends Vue {
  services = new Map()
  serviceList: any = []
  dialogVisible = false
  bdisabled = true
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

  selectNode(i, j, _e, select) {
    const temp = this.serviceList
    temp.forEach(item => {
      ;(item || []).forEach(x => {
        x.select = false
      })
    })
    if (i > -1 && j > -1) {
      temp[i][j].select = !select
    }
    this.bdisabled = !!select
    temp.forEach((item, m) => {
      this.$set(this.serviceList, m, item)
    })
    // if()
    this.edit.i = i
    this.edit.j = j
    _e.stopPropagation()
  }
  delService() {
    if (this.edit.i > -1 && this.edit.j > -1) {
      const temp = this.serviceList[this.edit.i]
      temp.splice(this.edit.j, 1)
      this.$set(this.serviceList, this.edit.i, temp)
    }
  }
  selectService() {
    this.dialogVisible = true
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
      this.serviceList[this.edit.i][this.edit.j].services = e
      this.serviceList[this.edit.i][this.edit.j].des = this.services.get(e).des
      this.serviceList[this.edit.i][this.edit.j].alias = this.services.get(e).alias
    }
  }
  close() {
    this.model = ''
  }
  sub() {
    const { verify }: any = this.$refs.form
    verify(valid => {
      if (valid && this.serviceList.length > 1) {
        const name = this.randomString(~~(Math.random() * 30))
        const sourceParams: any = []
        const destParams: any = []
        const rel: any = []
        this.serviceList.forEach((level, i) => {
          level.forEach((item, j) => {
            rel.push({
              id: item.id,
              steps: i,
              stepsIndex: j,
              services: item.services
            })
          })
        })
        const data = {
          id: this.form.id,
          url: this.form.url,
          des: this.form.des,
          bffServiceRel: rel
        }
        this.$api('batchCascadeAddBffBackForFront', {
          data: {
            datas: [data]
          }
        }).then(() => {
          this.$message.success('保存成功！')
        })
      } else {
        this.$message.error('接口需大于两个才能进行配置')
      }
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
      path: ['bffServiceRel', 'bffServiceMapping.bffService']
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
  }
  renderArrow() {
    const nodes = document.querySelectorAll('.service')
    const nodeA: Element = nodes[0]
    const nodeB = nodes[1]
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
.relList {
  border-right: 1px solid #e4e4e4;
  position: relative;
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
  padding: 20px;
  border-bottom: 1px solid #ccc;
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
</style>
<style>
.arrow {
  width: 10px;
  height: 10px;
  background: #0f0;
}
</style>
