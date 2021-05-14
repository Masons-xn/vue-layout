<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2021-01-08 11:25:43
 * @LastEditTime: 2021-04-22 18:10:05
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
      <div>
        容器
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
    <div class="canvas" id="canvas" flex-box="1" @drop="drop" @dragover="allowDrop($event)"></div>
    <Performance></Performance>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import resizeEvent from 'element-resize-event'
import { group } from './ztopo/tools/datas'
import Performance from '@/components/performance.vue'
import init from './edit'
import { uuid } from './ztopo/helper/util'
@Component({
  components: { Performance }
})
export default class Home extends Vue {
  group = group
  activeNames = []
  opeation: any
  mounted() {
    this.opeation = init(document.querySelector('#canvas'))
    const id1 = '1'
    const id2 = '2'
    const id3 = '3'
    // this.opeation.addNode({ id: id1, x: 200, y: 300 }, 'icon')
    // this.opeation.addNode({ id: id2, x: 400, y: 300 }, 'icon')
    // this.opeation.addNode({ id: id3, x: 800, y: 300 }, 'svg')
    for (let i = 0; i < 10; i++) {
      this.opeation.addNode(
        {
          id: uuid(),
          x: ~~(Math.random() * 100) + ~~(Math.random() * 800),
          y: ~~(Math.random() * 100) + ~~(Math.random() * 500)
        },
        'icon'
      )
    }
    // this.opeation.addLine({}, { id: id1, pointId: 5 }, { id: id2, pointId: 7 })
  }
  dragstart(icon) {
    console.log(icon)
  }
  allowDrop(event) {
    event.preventDefault()
  }
  drop(e) {
    e.preventDefault()
    this.addNode({ x: e.offsetX, y: e.offsetY })
  }
  addNode(data) {
    this.opeation.addNode(data)
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
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
}
</style>
