<template>
  <el-menu-item :index="menu.routerPath || uniqueId">
    <g-icon :name="menu.icon" size="20" class="geye-mr-10"></g-icon>
    <label slot="title">{{ menu.name }}</label>
  </el-menu-item>
</template>

<script lang="ts">
import { uniqueId } from "lodash"
import { Prop, PropSync, Provide, Vue, Component } from "vue-property-decorator"
interface Menu {
  type: object
  required: boolean
  default?: () => void
}
@Component
export default class MenuItem extends Vue {
  @Prop(Object) public menu: Menu
  public uniqueId = uniqueId("")
}
</script>
