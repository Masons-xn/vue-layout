<template>
  <span :id="renId"> </span>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop } from "vue-property-decorator"
import bus from "../core/eventbus"
@Component({})
export default class Container extends Vue {
  @Prop() public renId: any
  private show = false
  private mounted() {
    bus.trigger("containerReady", this.renId)
  }
}
</script>
<style lang="scss">
.container {
  position: relative;
  display: flex;
}
</style>
