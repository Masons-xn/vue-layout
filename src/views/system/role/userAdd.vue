<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2020-12-25 10:28:34
 * @LastEditTime: 2020-12-25 15:51:07
 * @LastEditors:  
-->
<!-- 作者 xn-->
<!-- 时间 2019/8/9-->

<template>
  <div>
    <g-form :rules="rules" :row="row" :model="form" ref="form" />
    <span slot="footer" class="dialog-footer">
      <g-button button-type="cancel" @click="cancel" />
      <g-button button-type="ok" @click="submit" />
    </span>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { Component, Provide, Vue, Prop, Watch, Emit } from 'vue-property-decorator'
@Component
export default class UserAdd extends Vue {
  get rules() {
    const that = this
    return {
      name: [{ required: true, message: this.$t('用户组名称'), trigger: 'blur' }]
    }
  }
  get model() {
    return {}
  }
  get row() {
    return [
      {
        label: this.$t('角色名称'),
        prop: 'name',
        placeholder: this.$t('输入用户名')
      }
    ]
  }
  public form: object = {
    groupName: ''
  }
  @Prop({ default: null }) user: any
  @Emit('reload')
  public reload() {
    return true
  }

  public submit(e: any) {
    const { verify }: any = this.$refs.form
    verify(valid => {
      if (valid) {
        if (this.user.id) {
          this.$api('updateRole', this.form).then((res): void => {
            if (res.code === '200') {
              this.$message.success(res.message)
              this.reload()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$api('addRole', this.form).then((res): void => {
            if (res.code === '200') {
              this.$message.success(res.message)
              this.reload()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      }
    })
  }
  cancel() {
    this.reload()
  }

  @Watch('user', { immediate: true, deep: true })
  onUserChange(val) {
    if (val.id) {
      this.form = _.cloneDeep(this.user)
    } else {
      this.form = {
        groupName: ''
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
