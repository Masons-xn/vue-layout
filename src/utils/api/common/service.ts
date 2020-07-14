import request from "../../../config/axios"
function getServiceAll(param = {}): Promise<any> {
  const url = "/model/getServiceAll"

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
  getServiceAll,
}
