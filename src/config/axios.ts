import Vue from "vue"
import Axios, { AxiosResponse } from "axios"
import { doLogin, isLogin } from "../utils/api/common/login"
import _ from "lodash"
import md5 from "md5"
import store from "../store/store"
// @ts-ignore
import code from "./code.json"

const axios = Axios.create({
  baseURL: process.env.VUE_APP_URL,
})

export function encodeGETParams(url, params = {}) {
  const keys = Object.keys(params)

  if (keys.length > 0) {
    const tempArr: string[] = []

    keys.forEach(k => {
      let v = params[k] || ""

      if (typeof v === "object") {
        v = JSON.stringify(v)
      }
      tempArr.push(`${k}=${v}`)
    })
    const part2 = tempArr.join("&")

    return `${url}?${part2}`
  }
  return url
}
const msg = "登录信息过期需要重新登录"
const needLogin = _.debounce(() => {
  doLogin(msg)
}, 500)

function interceptors() {
  const vue = new Vue()

  axios.interceptors.request.use(
    config => {
      if (isLogin()) {
        config.headers.token = isLogin()
      }
      config.headers.keeloq = md5(
        String(Math.round(Number(new Date()) / 1000) - store.state.offset) +
          "timestamps"
      )
      if (config.data) {
        if (config.method === "get" || config.method === "delete") {
          config.url = encodeGETParams(config.url, config.data)
        }
      }
      return config
    },
    (error: any) => {
      return Promise.reject(error)
    }
  )
  // 截获返回数据，对请求状态进行统一处理
  axios.interceptors.response.use(
    response => {
      if (response.data.login_error === "500001" || response.data.login_error === "invalid token") {
        // const msg = vue.$t('登录信息过期需要重新登录')
        needLogin()
        return Promise.reject()
      } else if(response.data.code === '500') {
        vue.$message.error(response.data.msg)
      }
      return response.data
    },
    (error: { config: { url: any }; response: { status: any } }) => {
      // console.error(`the API: ${error.config.url} is error`)
      vue["$message"].error(code[error.response.status])
      return Promise.reject()
    }
  )
}
axios.defaults.timeout = 60000
interceptors()
interface ResponseOptions extends AxiosResponse {
  message: string
  result: any
  token: any
  code?: string
  data: any
  msg?: string
}

class Request {
  public url: string
  private param: string
  private readonly method: string | undefined

  constructor(url: string, param?: any, method?: string) {
    this.url = url
    this.method = method
    this.param = param
  }
  // @ts-ignore
  public getData(): Promise<ResponseOptions> {
    let methods = this.method

    if (!methods) {
      methods = "get"
    }
    switch (methods.toLowerCase()) {
    case "post":
      return axios.post('/api' + this.url, this.param).then(
        (res: any) => {
          return Promise.resolve(res)
        },
        (err: any) => {
          return Promise.reject(err)
        }
      )
    case "get":
      return axios.get('/api' + this.url, { data: this.param }).then(
        (res: any) => {
          return Promise.resolve(res)
        },
        (err: any) => {
          return Promise.reject(err)
        }
      )
    }
  }
}

export default (url: string, param?: any, method?: string | undefined) => {
  return Promise.resolve(new Request(url, param, method).getData()).then(
    res => {
      return res
    }
  )
}
