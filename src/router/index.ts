import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../views/Login.vue"
import Home from "../views/Home.vue"
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push

// @ts-ignore
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  // @ts-ignore
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "about" */ "../views/Index.vue")
  },
  {
    path: "/builder",
    name: "builder",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/faster/builder/page/builder.vue"
      )
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
  next()
})
