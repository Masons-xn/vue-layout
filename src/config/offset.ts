import store from "../store/store"
function setOffset(vue: any) {
  return store.dispatch("setOffset", vue)
}
export default function offset(vue: any, callback: (arg0: boolean) => void) {
  Promise.all([setOffset(vue)])
    .then(() => {
      callback(true)
    })
    .catch(() => {
      callback(false)
    })
}
