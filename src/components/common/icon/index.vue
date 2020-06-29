<template>
  <span
    :class="`iconfont fast-${name}`"
    :style="style"
    @click="handlePress"
  ></span>
</template>

<script lang="ts">
import Vue from "vue"
import { Component, Prop, Provide } from "vue-property-decorator"

@Component
export default class Icon extends Vue {
  @Prop({ default: "home" }) public name: string
  @Prop({ default: 16 }) public size: number
  @Prop({ default: 16 }) public click: any
  get style() {
    return {
      "font-size": `${this.size}px`,
      width: `${this.size}px`,
      height: `${this.size}px`
    }
  }
  public handlePress(e) {
    this.$emit("press", e)
  }
}
</script>
