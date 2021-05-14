/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-07-30 16:08:30
 * @LastEditTime: 2020-11-09 14:13:16
 * @LastEditors:
 */
export default {
  state: {
    menu: [],
    isExpand: true,
    multi: [],
    currentPath: ''
  },
  mutations: {
    setMenu(state: { menu: any }, menu: any) {
      window.localStorage.setItem('source', JSON.stringify(menu))
      state.menu = menu
    },
    setIsExpand(state: any, data: any) {
      state.isExpand = data
    },
    setMulti(state: { multi: any }, data: any) {
      state.multi.push(data)
    },
    setMultiAll(state: { multi: any }, data: any) {
      state.multi = data
    },
    setCurrentPath(state: { currentPath: string }, data: string) {
      state.currentPath = data
    }
  },
  actions: {
    setMulti({ commit }: any, data: any) {
      commit('setMulti', data)
    },
    setMultiAll({ commit }: any, data: any) {
      commit('setMultiAll', data)
    },
    setMenu({ commit }: any, { data, vue }: any) {
      commit('setMenu', data)
    },
    setIsExpand({ commit }: any, data: any) {
      commit('setIsExpand', data)
    },
    setCurrentPath({ commit }: any, path: any) {
      commit('setCurrentPath', path)
    }
  },
  getters: {
    getMenu: (state: { menu: any }) => {
      return state.menu
    },
    getIsExpand(state: { isExpand: any }) {
      return state.isExpand
    },
    getMulti: (state: { multi: any }) => {
      return state.multi
    },
    getCurrentPath: (state: { currentPath: string }) => {
      return state.currentPath
    }
  }
}
