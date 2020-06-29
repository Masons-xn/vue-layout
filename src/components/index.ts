import Vue from "vue"
const files = require.context("./", true, /.(ts|tsx|vue)$/).keys()

function switchName(path: string) {
  const a = path.substr(0, path.lastIndexOf("/"))
  const str =
    "g-" + a.substr(a.lastIndexOf("/") + 1, a.length - a.lastIndexOf("/"))
  const reg = /[A-Z]+/
  const arr: string[] = str.split("") || []

  for (let i = 0; i < arr.length; i++) {
    if (reg.test(arr[i])) {
      if (i > 0) {
        arr[i] = `-${arr[i].toLowerCase()}`
      } else {
        arr[i] = arr[i].toLowerCase()
      }
    }
  }
  return arr.join("")
}
for (const item of files) {
  if (item.indexOf("index") > -1 && item !== "./index.ts") {
    import(`${item}`).then(() => {
      Vue.component(switchName(item), resolve => require([`${item}`], resolve))
    })
  }
}
