<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2020-11-09 14:03:46
 * @LastEditTime: 2020-11-14 13:16:26
 * @LastEditors:  
-->
<template>
  <div class="multiple-page-control-group" flex-box="1">
    <el-tabs
      class="multiple-page-control"
      :value="path"
      type="card"
      @tab-click="handleClick"
      @edit="handleTabsEdit"
      @contextmenu.native="handleContextmenu"
    >
      <el-tab-pane
        v-for="page in opened"
        :closable="canClose(page)"
        :key="page.fullPath"
        :label="page.meta.label"
        :name="page.path"
      />
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator'
import { multiClose, multiSwitch } from '@/components/common/tabs/tabs'

@Component({})
export default class MultiTabs extends Vue {
  public tagName = ''
  get path() {
    return this.$store.getters.getCurrentPath
  }
  get opened() {
    return this.$store.getters.getMulti
  }
  public handleContextmenu(event: {
    target: any
    preventDefault: () => void
    stopPropagation: () => void
  }) {
    event.preventDefault()
    event.stopPropagation()
  }
  public handleClick(tab: { name: any }) {
    multiSwitch(tab)
  }
  public handleTabsEdit(tagName: any, action: string) {
    if (action === 'remove') {
      multiClose(tagName, this.$route.path === tagName, this)
    }
  }
  public canClose(page: any): boolean {
    return page.path !== '/'
  }
  // 监听路由变化
  // @Watch ('$route', { immediate: true, deep: true })
  // public onaRouteChanged() {
  // }
}
</script>
