<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2020-07-30 16:08:30
 * @LastEditTime: 2020-11-19 13:14:55
 * @LastEditors:  
-->
<template>
  <el-submenu :index="menu.routerPath || uniqueId">
    <template slot="title">
      <g-icon :name="menu.icon" size="20" class="geye-mr-10"></g-icon>
      <label>{{ menu.name }}</label>
    </template>
    <template v-for="(child, childIndex) in menu.children">
      <menu-item
        v-if="child.children === undefined || child.children.length === 0"
        :menu="child"
        :key="childIndex"
        :indexPath="child.path"
      />
      <menu-sub v-else :menu="child" :key="childIndex" />
    </template>
  </el-submenu>
</template>

<script lang="ts">
import { uniqueId } from 'lodash'
// 组件
import MenuItem from './menuItem.vue'
import { Prop, PropSync, Provide, Vue, Component } from 'vue-property-decorator'

interface Menu {
  type: object
  required: boolean
  default?: () => void
}

@Component({
  components: {
    MenuItem
  }
})
export default class MenuSub extends Vue {
  @Prop(Object) public menu: Menu | undefined
  public uniqueId = uniqueId('menu-empty-')
}
</script>
