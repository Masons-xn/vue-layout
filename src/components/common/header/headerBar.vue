<!-- 作者 xn-->
<!-- 时间 2019/8/8-->

<template>
  <div flex="main:right">
    <div class="item geye-pr-10 geye-ml-10 username">
      {{ userName }}
    </div>
    <div class="line"></div>
    <div class="item geye-pr-10 geye-ml-10" @click="loginOut">
      注销
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide } from "vue-property-decorator"
@Component({
  components: {}
})
export default class HeaderBar extends Vue {
  public userName: string = localStorage.getItem("username") ||''
  public loginOut() {
    this.$confirm(this.$t("确定注销当前用户？").toString(), "提示", {
      type: "warning"
    }).then(() => {
      this.$api("doLogin")
    })
  }
}
</script>

<style scoped lang="scss">
.item {
  color: $color-text-link;
  cursor: pointer;
}
.line {
  /*&:before {*/
  /*  content: "|";*/
  /*}*/
}
.username {
  text-transform: uppercase;
}
</style>
