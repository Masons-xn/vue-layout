export default {
  state: {
    dictionary: {},
    list: {}
  },
  mutations: {
    dictAdd(state, data) {
      const code = data.code
      const datas = state.list && state.list.length > 0 ? state.list.filter(item => item.code === code) : []
      if (datas.length > 0) {
        state.list.map(item => {
          if (item.code === code) {
            item.data = data.data
          }
        })
      } else if (state.list.length > 0) {
        state.list.push(data)
      }
    },
    setDict(state, data) {
      state.dictionary = data
    },
    setHierarchyDict(state, data) {
      state.list = data
    }
  },
  actions: {
    setDict({ commit, dispatch }, vue) {
      return vue.$api("queryDictionary").then(res => {
        const data = {}
        if (res && res.result.list) {
          const dictdata = res.result.list
          dictdata.map(item => {
            if (data[item.code]) {
              console.warn(`[Dictionary] ${item.code} : ${item.value} is Duplicate!`)
            }
            data[item.code] = item.value
          })
          commit("setDict", data)
          commit("setHierarchyDict", dictdata)
        }
      })
    },
    dictAdd({ commit }, data) {
      commit("dictAdd", data)
    }
  },
  getters: {
    getDict: state => {
      return state.dictionary
    },
    getCategory: state => {
      return state.list
    }
  }
}
