<!-- 作者 xn-->
<!-- 时间 2019/8/9-->
<template>
  <g-page flex="dir:top" style="overflow-y: auto">
    <div flex-box="0">
      <g-form :rules="rules" :row="row" :model="form" ref="form"></g-form>
      <g-upload :list="form.pathId" ref="upload" ></g-upload>
    </div>
    <g-vue-ueditor v-model="form.des" flex-box="1"></g-vue-ueditor>
    <div class="button_area" flex-box="0"  flex="main:right">
      <g-button button-type="cancel" @click="goback"></g-button>
      <g-button button-type="ok" @click="submit"></g-button>
    </div>
  </g-page>
</template>

<script lang="ts">
import { Component, Provide, Vue, Prop } from "vue-property-decorator"
interface DataForm {
  id: string
  des: string
  title: string
}
@Component
export default class UserAdd extends Vue {
  get rules() {
    return {}
  }
  get model() {
    return {}
  }
  get row() {
    return [
      { label: this.$t('标题'), prop: "name", placeholder: '标题' },
    ]
  }
  public msg = ""

  public form: DataForm = {
    id: '',
    des: '',
    title: '',
  }
  private isChange = false
  @Prop({ default: null }) private user: any
  public created() {
    if (this.$route.query && this.$route.query.id) {
      this.$api("getDataById", this.$route.query.id).then(res => {
        this.form = res
        // this.form.menuIds = res.menuId.split(",")
      })
    }
  }
  public goback() {
    this.$router.back()
  }
  public submit() {
    return void
    this.$api("addData", Object.assign(this.form, { type: "news" })).then(
      (res): void => {
        if (res.code === "200") {
          if (this.user) {
            this.$message.success("修改成功！")
          } else {
            this.$message.success("添加成功！")
          }
          this.$router.go(-1)
        } else {
          this.$message.error(res.msg)
        }
      }
    )
  }
  private Init() {
    if (this.user) {
      this.form = this.user
    } else {
      this.form = {
        id: '',
        des: '',
        title: ''
      }
    }
    this.$diff(this.form, "isChange")
  }
}
</script>

<style scoped lang="scss"></style>
