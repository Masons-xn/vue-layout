<!-- 作者 xn-->
<!-- 时间 2019/8/6-->

<template>
  <div class="page">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"

@Component
export default class Page extends Vue {}
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  width: 100%;
  padding: 8px 8px;
}
</style>
