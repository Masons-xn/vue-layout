<template>
  <div class="login-container">
    <div class="subContainer">
      <div class="frontCover"></div>
      <div class="loginFormContainer">
        <el-form autocomplete="on"
                 :model="formLogin"
                 ref="loginForm"
                 label-position="left"
                 style="margin-top:80px">
          <div class="btnContainer">
            <div class="avatar_box">
              <img src="../assets/logo.png"
                   alt="">
            </div>
            <el-form-item prop="username">
              <input name="username"
                     type="text"
                     v-model="formLogin.username"
                     autocomplete="on"
                     placeholder="用户名admin 密码：123"
                     style="border: 1px solid #ccc;height: 40px; width: 80%; padding-left: 20px" />
            </el-form-item>
            <el-form-item prop="password">
              <input name="password"
                     type="password"
                     @keyup.enter="submit"
                     v-model="formLogin.password"
                     autocomplete="on"
                     placeholder="password"
                     style="border: 1px solid #ccc;height: 40px;width: 80%; padding-left: 20px" />
            </el-form-item>
            <el-button type="primary"
                       style="text-align:center;
                       width:50%;
              margin-top: 20px"
                       :loading="loading"
                       @click.native.prevent="submit">{{ $t("登录") }}
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator"
import { Form } from "element-ui"
import offset from "../config/offset"
@Component
export default class Login extends Vue {
  get rules() {
    return {
      username: [{ required: true, message: this.$t("用户名不能为空"), trigger: "blur" }],
      pass: [{ required: true, message: this.$t("密码不能为空"), trigger: "blur" }]
    }
  }
  public formLogin: object = {
    username: "admin",
    password: "123"
  }
  private loading = false
  public created() {
    this.loading = true
    offset(this, this.callback)
  }
  public callback() {
    this.loading = false
  }
  protected submit() {
    ;(this.$refs.loginForm as Form).validate(valid => {
      if (valid) {
        this.loading = true
        this.$api("login", this.formLogin).then(() => {
          this.loading = false
        })
      }
    })
  }
}
</script>

<style lang="scss">
@import "../assets/style/login/login";
</style>
