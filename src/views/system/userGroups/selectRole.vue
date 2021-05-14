<!--
 * @Description: 
 * @Author: 希宁
 * @Date: 2020-12-25 10:28:34
 * @LastEditTime: 2020-12-28 17:07:56
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
  option = []
  roleGroups: string[] = []
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
        label: this.$t('用户名'),
        prop: 'groupName',
        placeholder: this.$t('输入用户名'),
        disabled: 'disabled'
      },
      {
        label: this.$t('角色'),
        prop: 'roleIds',
        type: 'select',
        options: this.option,
        value: this.roleGroups,
        multiple: 'multiple',
        events: {
          change: this.optionChange
        }
      }
    ]
  }
  public form = {
    id: '',
    groupName: '',
    roleGroup: []
  }
  @Prop({ default: null }) user: any
  @Emit('reload')
  public reload() {
    return true
  }
  created() {
    this.$api('queryRole').then(res => {
      if (res?.result?.list) {
        res.result.list.map(item => {
          item.label = item.name
          item.value = item.id
        })
        this.option = res.result.list
      }
    })
  }
  public optionChange(value) {
    // this.$set(this, 'roleId', value)
    this.roleGroups = value
  }
  public submit(e: any) {
    const { verify }: any = this.$refs.form
    verify(valid => {
      if (valid) {
        const org = this.user.roleGroup || []
        const needAdd: any[] = []
        const needdel: string[] = []
        org.map((item: { roleId: ''; id: '' }) => {
          if (item && item.roleId && this.roleGroups.indexOf(item.roleId) === -1) {
            needdel.push(item.id)
          }
        })
        this.roleGroups.map(item => {
          const index = org.findIndex((i: { roleId: '' }) => i.roleId && i.roleId === item)
          if (index === -1) {
            needAdd.push({
              userGroupId: this.form.id,
              roleId: item
            })
          }
        })
        if (needAdd.length > 0) {
          this.$api('batchCascadeAddRoleGroup', { data: { datas: needAdd } })
        }
        if (needdel.length > 0) {
          this.$api('delRoleGroup', {
            id: needdel
          })
        }
        setTimeout(() => {
          this.$message.success(this.user.id ? '更新成功！' : '新增成功！')
          this.reload()
        }, 2000)
      }
    })
  }
  cancel() {
    this.reload()
  }
  @Watch('user', { immediate: true, deep: true })
  onUserChange(val) {
    if (val.id) {
      this.roleGroups = []
      this.form = _.cloneDeep(this.user)
      this.form.roleGroup.map((item: { roleId: string }) => {
        this.roleGroups.push(item.roleId)
      })
    } else {
      this.form = {
        id: '',
        groupName: '',
        roleGroup: []
      }
      this.roleGroups = []
    }
  }
}
</script>

<style scoped lang="scss"></style>
