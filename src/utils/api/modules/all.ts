import request from "../../../config/axios"

function getData(param: any): Promise<any | never> {
  const url = "/data/query"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function getDataById(param: string): Promise<any | never> {
  const url = "/data/get?id=" + param

  return request(url).then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function addData(param: any): Promise<any | never> {
  let url = "/data/add"

  if (param.guid) {
    url = "/data/update"
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
function delData(param: any): Promise<any | never> {
  const url = "/data/del"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

export { getData, addData, delData, getDataById }
