/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-12-09 10:20:02
 * @LastEditTime: 2021-04-22 18:16:12
 * @LastEditors:
 */
let pool: any = {}
const files = require.context('./', true, /.(ts|js)$/).keys()
for (const item of files) {
  if (item !== './index.ts') {
    pool = Object.assign(require(`${item}`), pool)
  }
}
const addToPool = (obj: any) => {
  pool = Object.assign(pool, obj)
}
const Call = (method: string, param?: any) => {
  if (pool[method]) {
    try {
      return Promise.resolve(pool[method](param))
    } catch (e) {
      return Promise.resolve(new Error(e))
    }
  } else {
    console.log(`The Api ${method} is not defined`)
    return Promise.resolve(new Error(`The Api ${method} is not defined`))
  }
}
const install = (Vue: any) => {
  Vue.prototype.$api = (method: string, param?: any) => {
    return Call(method, param)
  }
  Vue.prototype.toJSON = (a: any) => {
    console.log(a)
  }
}

declare interface Call {
  method: string
  param: any
}

const Api = { install }

declare module 'vue/types/vue' {
  interface Vue {
    $api: typeof Call
  }
}

export { Api, addToPool }
