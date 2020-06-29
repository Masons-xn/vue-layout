<!-- 作者 xn-->
<!-- 时间 2019/8/6-->

<template>
  <ElButton
    v-bind="$attrs"
    :type="btype"
    :round="round"
    :size="size"
    :style="bstyle"
    v-on="$listeners"
  >
    {{ buttomText }}
    <slot name="buttons"> </slot>
  </ElButton>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"

@Component
export default class GButton extends Vue {
  @Prop() public buttonType: string | undefined
  @Prop({ default: "mini" }) public size: string | undefined
  @Prop({ default: "" }) public type: string | undefined
  @Prop() public styleSet: string | undefined
  @Prop() public text: string | undefined
  @Prop({ default: false }) public round: boolean | undefined
  get buttonTypes() {
    return {
      add: {
        type: "primary",
        label: this.labelTrans("新增")
      },
      edit: {
        type: "text",
        label: this.labelTrans("编辑")
      },
      view: {
        type: "text",
        label: this.labelTrans("查看")
      },
      save: {
        type: "primary",
        label: this.labelTrans("保存")
      },
      search: {
        type: "primary",
        label: this.labelTrans("搜索")
      },
      // 按钮类删除
      del: {
        type: "danger",
        label: this.labelTrans("删除")
      },
      // 文字类删除
      delete: {
        type: "text",
        label: this.labelTrans("删除"),
        style: "color: red"
      },
      cancel: {
        type: "",
        label: this.labelTrans("取消")
      },
      ok: {
        type: "primary",
        label: this.labelTrans("确定")
      },
      open: {
        type: "primary",
        label: this.labelTrans("开启")
      },
      close: {
        type: "danger",
        label: this.labelTrans("关闭")
      },
      select: {
        type: "",
        label: this.labelTrans("筛选")
      },
      clear: {
        type: "",
        label: this.labelTrans("清空")
      }
    }
  }
  labelTrans(label) {
    // if(this.$t){
    //   return this.$t(label)
    // }
    return label
  }
  get btype(): string | any {
    if (
      this.buttonType &&
      this.buttonTypes[this.buttonType] &&
      this.buttonTypes[this.buttonType].type
    ) {
      return this.buttonTypes[this.buttonType].type
    }
    if (this.type) {
      return this.type
    }
    return null
  }
  get buttomText(): string | any {
    if (this.text) {
      return this.text
    }
    if (
      this.buttonType &&
      this.buttonTypes[this.buttonType] &&
      this.buttonTypes[this.buttonType].label
    ) {
      return this.buttonTypes[this.buttonType].label
    }
    return null

    // console.error('[g-button] Props text or buttonType is not null!')
  }
  get bstyle(): string | any {
    if (this.styleSet) {
      return this.styleSet
    }
    if (
      this.buttonType &&
      this.buttonTypes[this.buttonType] &&
      this.buttonTypes[this.buttonType].style
    ) {
      return this.buttonTypes[this.buttonType].style
    }
    return null
  }
}
</script>

<style scoped lang="scss"></style>
