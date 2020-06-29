import request from "../../../config/axios"
function queryDictionary(param: any): Promise<any> {
  const url = "/dictionary/query"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

function addDictionarys(param: any): Promise<any> {
  let url = "/dictionary/add"
  if (param.id) {
    url = "/dictionary/update"
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
function delDictionary(param: any): Promise<any> {
  const url = "/dictionary/del"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

function getOffset(): Promise<any> {
  const url = "/Offset/get"

  return request(url, "", "get").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

export { getOffset, queryDictionary, addDictionarys, delDictionary }
