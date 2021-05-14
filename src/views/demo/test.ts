/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-11-02 10:56:00
 * @LastEditTime: 2020-11-02 11:27:20
 * @LastEditors:
 */
import singleSpaVue from 'single-spa-vue'
import Vue from 'vue'
import router from './router'
import Home from './Home.vue'
const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    render: h => h(Home),
    router
  }
})
export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount
