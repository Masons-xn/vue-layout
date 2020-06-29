<template>
  <div class="modelpanel">
    <div class="modelpanelbox">
      <el-select
        class="model_select"
        v-model="modelValue"
        filterable
        placeholder="请选择"
        @change="selectModel"
      >
        <el-option
          v-for="item in Models"
          :key="item.id"
          :label="item.stName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide, Prop } from "vue-property-decorator"
import ElementUI from "element-ui"
import { Fast } from "../../core/config"
import _ from "lodash"
import request from "../../../../../config/axios"
@Component({
  components: {
    "el-select": ElementUI.Select,
    "el-option": ElementUI.Option
  }
})
export default class ModelPanel extends Vue {
  @Prop({
    default: () => {
      return null
    }
  })
  private selected: (arg0: any) => void
  private modelValue = ""
  private Models: any[] = []
  private mode: string = Fast.mode
  private created() {
    this.loadModel()
  }
  private selectModel(val: any) {
    const model = _.find(this.Models, item => {
      return item.id === val
    })
    this.$api("getModelBase", {
      where: [{ and: [{ modelId: model.id }] }]
    }).then(res => {
      model.basicProperties = res && res.result && res.result.list
      this.selected(model)
      this.$destroy()
    })
  }
  private loadModel() {
    const environment = Fast.environment
    if (environment === "builder") {
      request("/model/query").then(resp => {
        if (resp.code === "200") {
          this.Models = resp.result.list
        }
      })
    }
  }
  private beforeDestroy() {
    if (this.$el) {
      this.$el.remove()
    }
  }
}
</script>
<style scoped lang="scss">
.modelpanel {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #ccc;
  z-index: 2002;

  .modelpanelbox {
    width: 200px;
    position: absolute;
    top: 200px;
    left: -100px;
    margin-left: 50%;
  }

  .model_select {
  }
}
</style>
