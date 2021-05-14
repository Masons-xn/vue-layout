<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2020-07-30 16:08:30
 * @LastEditTime: 2020-11-19 14:33:38
 * @LastEditors:  
-->
<template lang="html">
  <div class="main" v-loading="loading" element-loading-text="系统准备中">
    <div v-if="isReady" flex="dir:top" class="geye-100">
      <div flex flex-box="1">
        <div class="side">
          <g-menu-side></g-menu-side>
        </div>
        <div class="container" flex-box="1" flex="dir:top">
          <g-header></g-header>
          <div class="container-main-header" flex-box="0">
            <g-tabs />
          </div>
          <div class="container-main-body" flex-box="1" ref="wrapper">
            <!--            <transition :name="ransitionName">-->
            <keep-alive>
              <router-view :key="$route.path" v-if="routerAlive" />
            </keep-alive>
            <!--            </transition>-->
          </div>
        </div>
      </div>
    </div>
    <div class="error" v-else-if="isReady && loading === false">
      系统准备失败 尝试刷新解决问题
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator'
import offset from '@/config/offset'
import init from '@/config/ready'
@Component({
  components: {}
})
export default class Index extends Vue {
  get isCollapse() {
    return !this.$store.getters.getIsExpand
  }
  routerAlive = true
  @Provide('reloadPath') public reloadPath = ''
  private loading = true
  private isReady = false
  public created() {
    this.loading = true
    init(this, this.callback)
    offset(this, this.callOffset)
  }
  public callOffset() {
    // console.log('ready')
  }
  public callback(result) {
    this.loading = false
    this.isReady = result
  }
}
</script>
<style scoped lang="scss">
@import '../assets/style/theme/register';
</style>
<style>
.container-main-body {
  height: 0;
}
</style>
