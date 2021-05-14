/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-07-30 16:08:30
 * @LastEditTime: 2020-11-09 14:15:28
 * @LastEditors:
 */
import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'
import dict from './modules/dictionary'
import userInfo from './modules/userInfo'
import model from './modules/model'
import resource from './modules/resource'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    offset: 0
  },
  mutations: {
    setTimeOffset(state, offset) {
      state.offset = offset
    }
  },
  actions: {
    setOffset({ commit, dispatch }, vue) {
      return vue.$api('getOffset').then(res => {
        if (res && res.data.timestamp) {
          commit('setTimeOffset', Math.round(Number(new Date()) / 1000) - res.data.timestamp)
        }
      })
    }
  },
  modules: {
    userInfo,
    menu,
    dict,
    resource,
    model
  }
})

export default store
const route = JSON.parse(window.localStorage.getItem('setMulti') || '[]') || []
const home = route.find(item => item.path === '/')
const index = route.findIndex((item: { path: string }) => item.path === '/')
route.splice(index, 1)
route.unshift(home)
store.dispatch(
  'setMultiAll',
  route.filter((item: { path: any }) => item && item.path)
)
