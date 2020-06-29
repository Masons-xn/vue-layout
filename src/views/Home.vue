<!-- 作者 xn-->
<!-- 时间 2019/8/8-->

<template>
  <g-page>
    <div v-for="(item, index) in list" :key="index">
      {{ item.title }}
    </div>
    <div @click="start">跑跑跑</div>
  </g-page>
</template>

<script lang="tsx">
import { Vue, Component, Provide } from "vue-property-decorator"
interface D {
  title: string
  id: number
  review: number
}
@Component
export default class Resource extends Vue {
  list: Array<D> = []
  public start() {
    this.$api("run").then(res => {
      console.log(res)
    })
  }
  public created() {
    console.log("created")
  }
}
</script>

<style scoped lang="scss"></style>
