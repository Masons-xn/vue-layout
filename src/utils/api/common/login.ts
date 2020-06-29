import request from "../../../config/axios"
import router from "../../../router/index"
import md5 from "md5"
import Vue from "vue"

async function login(param: any): Promise<any | never> {
  const url = "/login/in"

  try {
    const getData = request(
      url,
      { username: param.username, password: md5(param.password) },
      "post"
    )

    await getData.then(res => {
      if (res && res.code === "200") {
        router.push("/")
        window.localStorage.setItem("token", res.token)
        window.localStorage.setItem("username", param.username)
      } else {
        new Vue().$message.error(res.message)
        return Promise.resolve(res)
      }
    })
  } catch (err) {
    return await Promise.resolve(err)
  }
}
function doLogin(str?): void {
  if (str) {
    new Vue().$message.error(str)
  }
  window.localStorage.removeItem("token")
  window.localStorage.removeItem("username")
  router.push("/login")
}
function isLogin(): any {
  return window.localStorage.getItem("token")
}
export { login, doLogin, isLogin }
