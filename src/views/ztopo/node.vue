<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2021-01-08 11:25:43
 * @LastEditTime: 2021-04-22 18:35:56
 * @LastEditors:  
-->
<template>
  <div class="home" flex>
    <div class="node" flex-box="0">
      <div>
        组件
        <el-collapse v-model="activeNames">
          <el-collapse-item v-for="item in group" :key="item.label" :title="item.label">
            <div flex class="node-group">
              <div
                class="node-list"
                v-for="(icon, index) in item.children"
                :key="index"
                draggable="true"
                @dragstart="dragstart(icon)"
              >
                <span :class="'iconfont ' + icon"></span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div flex-box="1" flex class="canvas">
      <div id="canvas"></div>
    </div>
    <div class="node-config" flex-box="0">
      <div class="node-config-item" flex>
        <div class="node-config-item-label">
          选择.png 或者.svg
        </div>
        <div class="node-config-item-value" flex-box="1">
          <zz-upload :list="form.path" v-on:success="success"></zz-upload>
        </div>
      </div>
      <div class="node-config-item" flex>
        <div class="node-config-item-label">
          输入名称
        </div>
        <div class="node-config-item-value" flex-box="1">
          <el-input size="mini" v-model="form.name" />
        </div>
      </div>
      <div class="node-config-item" flex>
        <div class="node-config-item-label">
          输入code
        </div>
        <div class="node-config-item-value" flex-box="1">
          <el-input size="mini" v-model="form.code" />
        </div>
      </div>
      <div class="node-config-item" flex>
        <div class="node-config-item-label">
          增加连接点
        </div>
        <div class="node-config-item-value" flex-box="1">
          <el-button type="primary" size="mini" @click="addNodeLinkPont">增加</el-button>
          <div></div>
        </div>
      </div>
      <div class="node-config-item" flex>
        <div class="node-config-item-value" flex-box="1">
          <el-button size="mini" @click="reset">重置</el-button>
          <el-button type="primary" size="mini" @click="saveNode">保存</el-button>
          <div></div>
        </div>
      </div>
    </div>
    <!-- <Performance></Performance> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import resizeEvent from 'element-resize-event'
import { group } from './ztopo/tools/datas'
import init from './edit'
import { uuid } from './ztopo/helper/util'
import zzUpload from '@/components/upload/index.vue'
@Component({
  components: { zzUpload }
})
export default class Home extends Vue {
  group = group
  activeNames = []
  operation: any
  id = ''
  input = '123'
  form: { [x: string]: any } = {
    id: '',
    path: [],
    name: '',
    code: ''
  }
  mounted() {
    this.operation = init(document.querySelector('#canvas'))
    this.id = uuid()
  }
  success(item) {
    this.form.path.push(item)
    this.operation.addNode(
      {
        id: this.id,
        x: 40,
        y: 40,
        icon: item.url
      },
      'defineNode'
    )
  }
  addNodeLinkPont() {
    this.operation.addLinkPointToNode(this.id)
  }
  reset() {
    this.$router.go(0)
  }
  saveNode() {
    if (!this.form.name && this.form.path[0] && this.form.code) {
      this.$message.warning('请输入对应的 名称和code!')
      return
    }
    const point: any = []
    const nodes: Map<string, any> = this.operation.scene.elementMap
    for (const item in nodes) {
      if (nodes[item].type === 'point') {
        point.push({
          x: nodes[item].x,
          y: nodes[item].y,
          direction: nodes[item].direction
        })
      }
    }
    const postData: any = {
      id: this.form.id,
      path: this.form.path[0].url,
      name: this.form.name,
      code: this.form.code,
      point: point
    }
    this.$api('batchCascadeAddNode', { data: { datas: [postData] } }).then((res: any) => {
      console.log(res)
    })
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  padding: 10px;
  width: 100%;
  .node {
    width: 200px;
    border-right: 1px solid #ccc;
    .node-group {
      color: rgb(0, 102, 255);
      flex-wrap: wrap;
    }
    .node-list {
      margin: 5px;
      &:hover {
        color: #0f0;
        cursor: pointer;
      }
    }
  }
  .canvas {
    align-items: center;
    justify-content: center;
    background: #ccc;
    div {
      background: #fff;
      width: 80px;
      height: 80px;
    }
  }
  .node-config {
    width: 400px;
    border-left: 1px solid #ccc;
    padding: 10px;
    .node-config-item {
      text-align: left;
      margin: 10px 0;
      .node-config-item-label {
        width: 100px;
        line-height: 30px;
      }
    }
  }
}
</style>
