/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-07-30 16:08:30
 * @LastEditTime: 2020-11-02 09:26:01
 * @LastEditors:
 */
import request from '../../../config/axios'

function getDataTest(param: any): Promise<any | never> {
  const url = '/dep/query'

  return request(url, 'post', param).then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function loadServer(param: any): Promise<any | never> {
  const url = '/home/'

  return request(url, 'get', param).then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

export { getDataTest, loadServer }
