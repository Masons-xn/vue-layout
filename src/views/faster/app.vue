<template>
  <custom-page
    :config="sortconfig"
    v-loading="pageloading"
    element-loading-text="拼命加载中"
  >
  </custom-page>
</template>
<script lang="ts">
import { Component, Vue, Provide, Watch } from "vue-property-decorator"
import devmix from "./builder/mixin/mixin"
import { DevBuilderMix } from "./builder/core/bt"
import { Fast } from "./builder/core/config"
import customPage from "./builder/page/custompage.vue"
@Component({
  components: {
    customPage
  },
  mixins: [devmix, DevBuilderMix]
})
export default class App extends Vue {
  public config: string[] = []
  public pageloading = true
  public mounted() {
    if (this["$route"].path) {
      this["loadData"](this["$route"].path)
    }
  }
  public created() {
    this["EventsOn"]("pro")
    Fast.mode = "pro"
    Fast.environment = "app"
    Fast.init()
  }
  public beforeDestroy() {
    this["clearPage"]()
  }
  @Watch("$route")
  public routerChange() {
    const path = this["$route"].path
    this["loadData"](path)
    // 参数
    // action 行为add detial update list
    // param json 自动拼装到url 上
  }
}
</script>
<style lang="scss"></style>
