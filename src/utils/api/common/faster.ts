import request from "../../../config/axios"

function fasterSavePage(param: any): Promise<any> {
  return request("/page/savePage", param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

function fasterQueryPage(param = {}): Promise<any> {
  const url = "/page/query"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function fasterDelPage(param = {}): Promise<any> {
  const url = "/rbpage/batchCascadeDelete"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
export { fasterSavePage, fasterQueryPage, fasterDelPage }
