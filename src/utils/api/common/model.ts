import request from "../../../config/axios"

// function getDictionary(param: any): Promise<any> {
//   const url = '/dictionary/query'
//   return  request(url, param, 'post').then((res) => {
//     return Promise.resolve(res)
//   },                              (err) => {
//     return Promise.reject(err)
//   })
// }
//
function saveModel(param: any): Promise<any> {
  return request("/model/save", param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

function getModel(param = {}): Promise<any> {
  const url = "/model/query"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function getModelBase(param = {}): Promise<any> {
  const url = "/model/queryBase"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function getModelRel(param = {}): Promise<any> {
  const url = "/model/queryRel"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function delModel(param = {}): Promise<any> {
  const url = "/model/delModel"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function initModel(param = {}): Promise<any> {
  const url = "/model/initModel"

  return request(url, param, "post").then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

export {
  getModel,
  getModelBase,
  getModelRel,
  saveModel,
  delModel,
  initModel
  // getDictionary,
  // addDictionary,
  // delDictionary,
}
