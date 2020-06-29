import Vue from "vue"
import { sampleSize } from 'lodash'
import store from '@/store/store'
function trans(this: any, key: string, category?: boolean, source?: string, porp?: { codeKey: string, valueKey: string }) {
  const storeData = (this as any).$store.getters.getCategory || []
  if (storeData.length > 0) {
    if (source && source.indexOf("/") > -1) {
      const data = storeData.filter(item => item.code === source)[0]
      if (data && data.data) {
        const dataProp = porp || { codeKey: "code", valueKey: "value" }
        if (category) {
          return data.data
        } else {
          if (data.data.length > 0) {
            return data.data.filter(item => item[dataProp.codeKey] === key)[0] ? data.data.filter(item => item[dataProp.codeKey] === key)[0][dataProp.valueKey] : "Error config!"
          } else {
            return '获取中...'
          }
        }
      } else {
        store.dispatch("dictAdd", { code: source, data: [] })
        return this.$api(source.replace('/', "")).then(res => {
          store.dispatch("dictAdd", { code: source, data: res.result.list })
          return res.result.list
        })
      }
    } else {
      if (category) {
        const store = (this as any).$store.getters.getCategory || []
        if (store.length > 0) {
          if (store.filter(item => item.code === key)[0] && store.filter(item => item.code === key)[0].id) {
            return store.filter(dic => dic.pid === store.filter(item => item.code === key)[0].id.toString())
          } else {
            return [`[Tarns] check the code ${key} is available!`]
          }
        } else {
          return []
        }

      }
      return (this as any).$store.getters.getDict[key] || `code ${key} is available!`
    }
  } else {
    return []
  }
}
const install = () => {
  Vue.prototype.$trans = function (key: string, category?: boolean, source?: string, porp?: { codeKey: string, valueKey: string }) {
    return trans.call(this, key, category, source, porp)
  }
}
const Trans = { install }

declare module "vue/types/vue" {
  interface Vue {
    $trans: typeof trans
  }
}
export default Trans
