<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2020-07-30 16:08:30
 * @LastEditTime: 2020-11-09 15:22:41
 * @LastEditors:  
-->
<template>
  <div flex-box="0" flex="dir:left" class="head">
    <div class="header_bar" flex="dir:left" flex-box="1">
      <div flex-box="0" flex="dir:left">
        <div @click="sideBarSwitch" class="geye-mr-10">
          <g-icon :name="menuIsExpend === 'logo' ? 'zhankai' : 'shousuo'" size="20" />
        </div>
      </div>
      <div flex-box="1">
        <header-bar />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator'
import headerBar from './headerBar.vue'
@Component({
  components: {
    headerBar
  }
})
export default class HeaderBar extends Vue {
  get menuIsExpend(): string {
    return this.$store.getters.getIsExpand ? 'logo is-expend' : 'logo'
  }
  public sideBarSwitch() {
    this.$store.dispatch('setIsExpand', !this.$store.getters.getIsExpand)
  }
}
</script>

<style scoped lang="scss">
.head {
  .logo {
    width: 64px;
    font-size: 0;
    background-color: $sidebar-background;
    &.is-expend {
      width: 200px;
    }
    .logo-img {
      width: 32px;
      height: 32px;
      margin: 9px auto;
      display: block;
    }
  }
  .header_bar {
    /*box-shadow: 0 1px 4px rgba(0,21,41,.08);*/
    height: 50px;
    padding: 10px 18px 0;
    line-height: 30px;
    .time-picker {
      margin-top: 1px;
    }
  }
}
</style>
