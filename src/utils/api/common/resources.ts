import request from "../../../config/axios"

function queryMenu(param: any): Promise<any | never> {
  const url = "/resources/query"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function addMenu(param: any): Promise<any | never> {
  let url = "/resources/add"

  if (param.id) {
    url = "/resources/update"
  }
  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function delMenu(param: any): Promise<any | never> {
  const url = "/resources/del"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

export { queryMenu, addMenu, delMenu }
