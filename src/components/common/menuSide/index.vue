<template>
  <div :class="menuIsExpend">
    <el-menu :collapse="isCollapse" :unique-opened="true" :default-active="active" ref="menu" @select="handleMenuSelect">
      <template v-for="(menu, menuIndex) in aside">
        <menu-item v-if="menu.children === undefined" :menu="menu" :key="menuIndex" :indexPath="menu.path" />
        <menu-sub v-else :menu="menu" :key="menuIndex" />
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from "vue-property-decorator"
import MenuSub from "./menuSub.vue"
import MenuItem from "./menuItem.vue"

@Component({
  components: {
    MenuItem,
    MenuSub
  }
})
export default class MenuSide extends Vue {
  public BS: any
  public aside: any = []
  private state = ""
  public $mount = (elementOrSelector?: Element | string, hydrating?: boolean): this => this
  public created() {
    // this.aside = [
    //   { label: '系统设置', name: '系统设置',  router: '/sys', children: [
    //       {
    //         label: '菜单设置', name: '菜单设置',  router: '/resources',
    //       },
    //       {
    //         label: '字典配置', name: '字典配置',  router: '/dictionary',
    //       },
    //       {
    //         label: '模型管理', name: '模型管理',  router: '/model',
    //       },
    //       {
    //         label: '页面管理', name: '页面管理',  router: '/page',
    //       },
    //     ],
    //   },
    //   {
    //     label: '新闻', name: '新闻', children: [
    //       {
    //         label: '新闻列表', name: '新闻',  router: '/newList',
    //       },
    //     ],
    //   },
    // ];
    this.aside = this.$store.getters.getMenu
  }
  get active(): string {
    return this.$store.getters.getCurrentPath
  }
  get menuIsExpend(): string {
    return this.$store.getters.getIsExpand ? "side-menu is-expend" : "side-menu"
  }
  get isCollapse() {
    return !this.$store.getters.getIsExpand
  }

  public handleMenuSelect(index: string | undefined, indexPath: any) {
    this.$router.push({
      path: index
    })
  }
}
</script>
