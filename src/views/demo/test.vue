<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2020-08-19 16:45:59
 * @LastEditTime: 2020-11-14 13:16:34
 * @LastEditors:  
-->
<template>
  <div id="app">
    <el-button type="primary" size="mini" @click="add">添加</el-button>
    <div class="" id="id"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'
import error4 from '@/views/404.vue'
// import singleSpa from 'single-spa'
import { get } from 'lodash'
@Component({
  components: {}
})
export default class Test extends Vue {
  //   created{
  // singleSpa.registerApplication("navbar",() => System.import("navbar"), (location) => true);
  //   }
  created() {
    // singleSpa.registerApplication('navbar')
    // singleSpa.start()
  }
  add() {
    this.$api('loadServer').then(res => console.log(res))
  }
}
</script>
