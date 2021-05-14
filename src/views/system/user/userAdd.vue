<!-- 作者 xn-->
<!-- 时间 2019/8/9-->

<template>
  <div>
    <g-form :rules="rules" :row="row" :model="form" ref="form" />
    <span slot="footer" class="dialog-footer">
      <g-button button-type="cancel" @click="dialogVisible = false" />
      <g-button button-type="ok" @click="submit" />
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Prop, Watch, Emit } from 'vue-property-decorator'
import { initPassword, isEmail } from '@/utils/validate'
import md5 from 'md5'
import _ from 'lodash'
@Component
export default class UserAdd extends Vue {
  get rules() {
    const that = this
    return {
      username: [{ required: true, message: this.$t('用户名不能为空'), trigger: 'blur' }],
      nickname: [{ required: true, message: this.$t('用户名不能为空'), trigger: 'blur' }],
      pwd: [
        { required: true, message: this.$t('密码不能为空！'), trigger: 'blur' },
        {
          validator: (rules, val, callback) => {
            !initPassword(val) ? callback(this.$t('密码格式不正确！')) : callback()
          }
        }
      ],
      userrepeatpwd: [
        {
          required: true,
          message: this.$t('确认密码不能为空！'),
          trigger: 'blur'
        }
      ]
    }
  }
  get model() {
    return {}
  }
  get row() {
    return [
      {
        label: this.$t('用户名'),
        prop: 'username',
        placeholder: this.$t('输入用户名')
      },
      {
        label: this.$t('昵称'),
        prop: 'nickname',
        placeholder: this.$t('昵称')
      },
      {
        label: this.$t('密码'),
        type: 'text,password',
        prop: 'pwd',
        placeholder: this.$t('字母，数字，特殊字符的组合 长度至少为4')
      },
      {
        label: this.$t('确认密码'),
        type: 'text,password',
        prop: 'userpassword',
        placeholder: this.$t('字母，数字，特殊字符的组合 长度至少为4')
      },
      {
        label: this.$t('用户组'),
        prop: 'userGroups',
        type: 'select',
        options: this.option,
        // multiple: 'multiple',
        events: {
          change: this.optionChange
        }
      }
    ]
  }
  public option: any = []
  public form = {
    username: '',
    password: '',
    pwd: '',
    userGroupId: ''
  }
  @Prop({ default: null }) user: any
  public created() {
    this.$api('queryUserGroup').then(res => {
      if (res?.result?.list) {
        res.result.list.map(item => {
          item.label = item.groupName
          item.value = item.id
        })
        this.option = res.result.list
      }
    })
  }
  @Emit('reload')
  public reload() {
    return true
  }

  public optionChange(value) {
    this.$set(this.form, 'userGroupId', value)
  }
  public submit(e: any) {
    const { verify }: any = this.$refs.form
    verify(valid => {
      this.form.password = md5(md5(this.form.pwd))
      if (valid) {
        if (valid) {
          if (this.user.id) {
            this.$api('updateUser', this.form).then((res): void => {
              if (res.code === '200') {
                this.$message.success(res.message)
                this.reload()
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            this.$api('addUser', this.form).then((res): void => {
              if (res.code === '200') {
                this.$message.success(res.message)
                this.reload()
              } else {
                this.$message.error(res.message)
              }
            })
          }
        }
      }
    })
  }

  @Watch('user', { immediate: true, deep: true })
  onUserChange(val) {
    if (val.id) {
      this.form = _.cloneDeep(this.user)
    } else {
      this.form = {
        username: '',
        password: '',
        pwd: '',
        userGroupId: ''
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
