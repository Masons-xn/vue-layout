/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-12-24 21:22:01
 * @LastEditTime: 2020-12-29 13:28:56
 * @LastEditors:
 */

import request from '../../../config/axios'
function dataAuthorize(param = {}): Promise<any> {
  const url = '/authorize/submit'
  return request(url, { datas: param }, 'post').then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function cancelAuthorize(param = {}): Promise<any> {
  const url = '/authorize/cancel'
  return request(url, { datas: param }, 'post').then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function queryModelDatas(param = {}): Promise<any> {
  const url = '/authorize/queryModelDatas'
  return request(url, { datas: param }, 'post').then(
    res => {
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}
function initAuthorize(param = {}): Promise<any> {
  const url = '/authorize/init'
  return request(url, { datas: param }, 'post').then(
    res => {
      console.log(res)
      return Promise.resolve(res)
    },
    err => {
      return Promise.reject(err)
    }
  )
}

export { dataAuthorize, queryModelDatas, cancelAuthorize, initAuthorize }
