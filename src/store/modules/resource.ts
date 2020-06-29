import store from "../store"
import addRouters from "../../router/addRouters"
interface OperationNodes {
  code: string
  flag: boolean
  id: string
  menuId: string
  method: string
  name: string
  parentId: string
  remarks: string
  status: string
  type: string
  uri: string
}

interface TreeNodes {
  flag: boolean
  icon: string
  id: string
  label: string
  leaf: boolean
  level: boolean
  name: string
  parentCode: boolean
  parentId: string
  path: string
  children: TreeNodes[]
}

interface Menu {
  operationNodes: OperationNodes[]
  treeNodes: TreeNodes[]
}

export default {
  state: {
    operation: {},
    isSidebarOpen: false
  },
  mutations: {
    setOperation(state, operation) {
      const op = {}

      operation.map(item => {
        op[item.code] = true
      })
      state.operation = op
    }
  },
  actions: {
    setResource({ commit, dispatch }, vue) {
      return vue.$api("queryMenu").then((res: any) => {
        // const result: Menu[] = res.result.list || []
        // vue.$api('ArrayToHierarchy', res.result.list.filter((item) => item.category === 'element')).then((data) => {
        //   commit('setOperation', data)
        // })
        // console.log(res.result.list)
        return vue
          .$api("dataOrder", {
            data: res.result.list.filter(
              item => item.type === "menu" || item.type === "category"
            ),
            key: "sequence"
          })
          .then((orderData: any) => {
            return vue.$api("ArrayToHierarchy", orderData).then(data => {
              store.dispatch("setMenu", { data, vue })
              return addRouters(vue.$router, data)
            })
          })
      })
    },
    setOperation({ commit }, operation) {
      commit("setOperation", operation)
    }
  },
  getters: {
    getOperation: state => {
      return state.operation
    }
  }
}
