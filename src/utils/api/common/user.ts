/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-12-24 21:22:01
 * @LastEditTime: 2020-12-25 13:48:44
 * @LastEditors:
 */

import request from '../../../config/axios'
function queryUsers(param = {}): Promise<any> {
  const url = '/user/query'
  const params = Object.assign(param, { path: ['userGroup'] })
  return request(url, params, 'post').then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function queryGroups(param = {}): Promise<any> {
  const url = '/userGroup/query'
  const params = Object.assign(param, { path: ['roleGroup.role'] })
  return request(url, params, 'post').then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

export { queryUsers, queryGroups }
