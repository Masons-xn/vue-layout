<template>
  <header class="header">
    <div class="logo-area">
      <!--      {{ $store.state.test }}-->
    </div>
    <div class="bar">
      <span @click="goBack()">
        <g-icon name="md-undo" :size="24"></g-icon>
      </span>
      <span @click="structPanelShow()">
        <g-icon name="RectangleCopy58" :size="24"></g-icon>
      </span>
      <div
        class="dialogManage"
        v-if="dialogs.length > 0"
        @click="dialogManageshow = !dialogManageshow"
      >
        <span>
          <el-tooltip
            effect="light"
            content="窗口管理d"
            placement="bottom"
            :open-delay="500"
          >
            <g-icon name="s-shop" :size="24" style=""></g-icon>
          </el-tooltip>
        </span>
        <ul v-if="dialogManageshow" class="dialog_list">
          <li v-for="item of dialogs" @click="dialogOpen(item.unitID)">
            {{ item.title }}
          </li>
        </ul>
      </div>
      <span @click="clearPage('dev')">
        <g-icon name="clean" :size="24"></g-icon>
      </span>
      <span @click="setModel('dev')">
        <g-icon name="kaifa1" :size="24"></g-icon>
      </span>
      <span @click="setModel('pre')">
        <g-icon name="yulan" :size="24"></g-icon>
      </span>
      <span @click="setPageInfo()">
        <g-icon name="md-save" :size="24"></g-icon>
      </span>
    </div>
  </header>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { DevBuilderMix } from "../../core/bt"
@Component({
  mixins: [DevBuilderMix]
})
export default class Header extends Vue {
  public goBack() {
    this.$router.back()
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1b1b1b;
  height: 56px;
  width: 100%;
  z-index: 2000;
  .logo-area {
    width: 270px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bar {
    color: #fff;
    span {
      margin: 0 5px;
    }
  }
}
</style>
