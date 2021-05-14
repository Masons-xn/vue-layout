/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-07-30 16:08:30
 * @LastEditTime: 2020-12-25 10:56:12
 * @LastEditors:
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import { multiAdd } from '../components/common/tabs/tabs'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push

// @ts-ignore
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  // @ts-ignore
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'Home',
    meta: {
      label: '首页'
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/Index.vue')
  },
  {
    path: '/builder',
    name: 'builder',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/faster/builder/page/builder.vue')
  }
]
const createRouter = () =>
  new VueRouter({
    routes
  })
const router = createRouter()

export default router
export function resetRouter() {
  const newRouter = createRouter()
  // @ts-ignore
  router.matcher = newRouter.matcher // the relevant part
}
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && (to.path === '/login' || to.path.indexOf('builder') === -1)) {
    multiAdd(to)
  }
  next()
})
