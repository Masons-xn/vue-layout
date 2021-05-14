<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2021-02-05 09:08:58
 * @LastEditTime: 2021-04-22 18:01:48
 * @LastEditors:  
-->

<template>
  <div class="performance">
    <div class="performance-list" flex v-for="item in performance" :key="item.label">
      <div class="performance-label">{{ item.label }}</div>
      :
      <div class="performance-value">{{ item.value }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import moment from 'moment'
const start = new Date().valueOf()

@Component
export default class Performance extends Vue {
  performance: any[] = []
  mounted() {
    // performance = []
    this.doWatch()
  }
  doWatch() {
    this.performance = []
    const performance = window.performance as any
    const memory = performance.memory
    let seconds: string | number = moment(new Date().valueOf()).diff(moment(start), 's')
    if (seconds > 60) {
      seconds = (seconds / 60).toFixed() + '分' + (seconds % 60)
    }
    // const time =moment(new Date().valueOf()).diff(moment(start), 's')>60?moment(new Date().valueOf()).diff(moment(start), 's')
    this.performance.push({
      label: '运行时间',
      value: seconds + '秒'
    })
    this.performance.push({
      label: '内存限制',
      value: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + 'M'
    })
    this.performance.push({
      label: '已分配内存',
      value: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + 'M'
    })
    this.performance.push({
      label: '活跃段内存',
      value: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'M'
    })
    requestAnimationFrame(() => {
      this.doWatch()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.performance {
  width: 200px;
  height: 100px;
  position: fixed;
  left: 0px;
  bottom: 0px;
  background: #000000;
  color: #fff;
  padding: 5px;
  opacity: 1;
}
</style>
