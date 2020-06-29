import store from "../store"
import request from "@/config/axios"
import { addToPool } from '@/utils/api/index'
export default {
  state: {
    model: [],
    modelService: {}
  },
  mutations: {
    setModelService(state, arg) {
      const service = {}

      const serviceAdd = (url) => {
        return (param: any = {}): Promise<any> => {
          return request(url, param, "post").then(
            res => {
              return Promise.resolve(res)
            },
            err => {
              return Promise.reject(err)
            }
          )
        }
      }
      arg.list.map(item => {
        const modelName = item.stTableName.replace(item.stTableName[0], item.stTableName[0].toUpperCase())
        service[`add${modelName}`] = serviceAdd(`/${item.stTableName}/add`)
        service[`update${modelName}`] = serviceAdd(`/${item.stTableName}/update`)
        service[`del${modelName}`] = serviceAdd(`/${item.stTableName}/del`)
        service[`batchCascadeAdd${modelName}`] = serviceAdd(`/${item.stTableName}/batchCascadeAdd`)
        service[`save${modelName}`] = serviceAdd(`/${item.stTableName}/save`)
        service[`get${modelName}`] = serviceAdd(`/${item.stTableName}/get`)
        service[`query${modelName}`] = serviceAdd(`/${item.stTableName}/query`)
        service[`query${modelName}All`] = serviceAdd(`/${item.stTableName}/queryAll`)
        service[`batchCascadeDelete${modelName}`] = serviceAdd(`/${item.stTableName}/batchCascadeDelete`)
      })
      addToPool(service)
      state.modelService = service
      state.model = arg.list
    }
  },
  actions: {
    modelInit({ commit, dispatch }, vue) {
      return vue.$api("getModel").then((res: any) => {
        if (res.result && res.result.list && res.result.list.length > 0) {
          return commit('setModelService', { list: res.result.list, vue: vue })
        }
        else {
          return true
        }
      })
    },
  },
  getters: {
    getModelService: state => {
      return state.model
    }
  }
}
