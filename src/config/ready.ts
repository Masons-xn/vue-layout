import store from "../store/store"

function setResource(vue: any) {
  return store.dispatch("setResource", vue)
}
function setDictionary(vue: any) {
  return store.dispatch("setDict", vue)
}
// function setRouters(vue) { setRouters(vue)
//   routerAdd(vue)
// }
function setModelService(vue: any) {
  return store.dispatch("modelInit", vue)
}
export default function init(vue: any, callback: (arg0: boolean) => void) {
  Promise.all([setDictionary(vue), setResource(vue), setModelService(vue)])
    .then(() => {
      callback(true)
    })
    .catch(() => {
      callback(false)
    })
}
