export default {
  state: {
    menu: [],
    isExpand: true
  },
  mutations: {
    setMenu(state: { menu: any }, menu: any) {
      window.localStorage.setItem("source", JSON.stringify(menu))
      state.menu = menu
    },
    setIsExpand(state: any, data: any) {
      state.isExpand = data
    }
  },
  actions: {
    setIsExpand({ commit }: any, data: any) {
      commit("setIsExpand", data)
    },
    setMenu({ commit }: any, { data, vue }: any) {
      commit("setMenu", JSON.parse(JSON.stringify(data)))
    }
  },
  getters: {
    getIsExpand(state: { isExpand: any }) {
      return state.isExpand
    },
    getMenu: (state: { menu: any }) => {
      return state.menu
    }
  }
}
