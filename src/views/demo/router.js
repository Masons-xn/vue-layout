/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-11-02 11:09:16
 * @LastEditTime: 2020-11-02 11:29:00
 * @LastEditors:
 */
import Router from 'vue-router'
import Home from './Home888.vue'

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/app2',
      name: 'home',
      component: Home
    }
  ]
})
