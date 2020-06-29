import request from "../../../config/axios"

function getDataTest(param: any): Promise<any | never> {
  const url = "/dep/query"

  return request(url, "post", param).then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

export { getDataTest }
