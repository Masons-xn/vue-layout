/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-11-09 14:49:35
 * @LastEditTime: 2021-04-12 09:25:54
 * @LastEditors:
 */
/**
 * Created by xining.lao on 6/27/2017.
 */
import router from './index'
import Index from '@/views/Index.vue'
import notFound from '@/views/404.vue'
import { HierarchyToArray } from '@/utils/api/dataFormat'
import Home from '@/views/Home.vue'
import { resetRouter } from './index'
import app from '@/views/faster/app.vue'
let times = 0
let common: any[] = []

export default function(v?: any, data?: any) {
  let menu = []

  if (!data) {
    //@ts-ignore
    menu = JSON.parse(window.localStorage.getItem('source'))
  } else {
    menu = JSON.parse(JSON.stringify(data || []))
  }

  const routerInfo = HierarchyToArray(menu).filter(
    item => item && (item.routerPath || item.pid === '0')
  )

  function setRouter() {
    if (common.length > 0) {
      resetRouter()
    }
    const home = [
        {
          path: '/',
          component: Home,
          meta: {
            label: '首页',
            name: '首页'
          }
        }
      ],
      notFind = [
        {
          path: '*',
          component: notFound
        }
      ]

    common = common.filter(item => item.path).concat(notFind)
    router.addRoutes([
      {
        path: '/',
        component: Index,
        meta: {
          label: '首页',
          name: '首页'
        },
        children: home.concat(common)
      }
    ])
  }
  function collectRouter(item: { path?: any; routerPath?: any; name?: string }, name?: undefined) {
    times += 1
    if (item.path) {
      common.push({
        path: item.routerPath,
        name,
        meta: {
          label: item.name,
          name: item.name
        },
        component: (resolve: (...modules: any[]) => void) =>
          require([`../views/${item.path}.vue`], resolve)
      })
    }
    if (times === routerInfo.length) {
      setRouter()
    }
  }
  routerInfo.map(item => {
    if (item.path) {
      import(`../views/${item.path}.vue`)
        .then(() => {
          collectRouter(item, item.path.replace(/\//g, ''))
        })
        .catch(() => {
          console.warn(`[Router] PATH : ${item.path} is not available！`)
          collectRouter({})
        })
    } else {
      common.push({
        path: item.routerPath,
        component: app,
        label: item.name
      })
      collectRouter({})
    }
  })
}
