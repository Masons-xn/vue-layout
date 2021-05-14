/*
 * @Description:
 * @Author: 希宁
 * @Date: 2019-09-04 09:59:01
 * @LastEditTime: 2020-11-09 14:47:47
 * @LastEditors:
 */
import store from '../../../store/store'
import router from '../../../router/index'
let Instance: any

export function multiAdd(route: any): void {
  const tabs = store.getters.getMulti.filter((item: { path: any }) => item.path === route.path)
  // debugger
  if (tabs.length === 0) {
    route.meta.keepAlive = true
    store.dispatch('setMulti', route)
    storeMulit()
  }
  store.dispatch('setCurrentPath', route.path)
}
function getComponentInstance(instance: any) {
  const child = instance.$root.$children[0].$children[0].$children.filter(
    item => item.$vnode && item.$vnode.parent && item.$vnode.parent.componentInstance
  )
  Instance = child[0].$vnode.parent.componentInstance
  return Instance
}
export function removeFromCache(path, instance) {
  let componentInstance: any
  if (Instance) {
    componentInstance = Instance
  } else {
    componentInstance = getComponentInstance(instance)
  }
  const key = componentInstance.keys.indexOf(path)
  const keys = componentInstance.keys
  const cache = componentInstance.cache
  keys.splice(key, 1)
  delete cache[path]
}

export function multiClose(path: string, isDisplay: boolean, instance: any) {
  const tabs = store.getters.getMulti
  const index = tabs.findIndex((item: { path: string }) => item.path === path)
  removeFromCache(path, instance)
  tabs.splice(index, 1)
  let newPath = ''
  if (isDisplay) {
    if (index < tabs.length) {
      newPath = tabs[index].fullPath
    } else {
      newPath = tabs[tabs.length - 1].fullPath
    }
    router.push(newPath)
  }
  storeMulit()
}

export function multiSwitch(tab: any): void {
  const path = store.getters.getMulti.find((item: { path: any }) => item.path === tab.name)
  router.push(path.fullPath)
  store.dispatch('setCurrentPath', path.path)
}

// export function getInclude(): any[] {
//   const include: any = []
//   store.getters.getMulti.forEach((item: {
//     name: string;
//     path: { replace: (arg0: RegExp, arg1: string) => void; }; }) => {
//     if (item.path && item.path !== '*' && item.name) {
//         include.push(item.name)
//       }
//     })
//   return include
// }

function storeMulit() {
  const localeMulti: any = []
  store.getters.getMulti.map((item: { name: any; meta: any; path: any; fullPath: any }) => {
    localeMulti.push({
      meta: item.meta,
      path: item.path,
      name: item.name,
      // name:route.matched[route.matched.length-1].components.default.name,
      fullPath: item.fullPath
    })
  })
  window.localStorage.setItem('setMulti', JSON.stringify(localeMulti))
}
export function getDirection(from, to): string {
  // 比较下 index 可以加其他的效果
  return 'el-fade-in-linear'
}

export function modifyRoute(route) {
  // route.meta.time = store.state.globalTime.current
}
