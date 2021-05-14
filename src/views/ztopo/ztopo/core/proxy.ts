/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-07 14:25:13
 * @LastEditTime: 2021-04-20 09:31:38
 * @LastEditors:
 */
export const proxy = obj => {
  return new Proxy(obj, {
    get(target, key) {
      return target[key]
    },
    set(target, key, value) {
      if (key !== 'needUpdate' && target[key] !== value) {
        target.needUpdate = true
      }
      return (target[key] = value) || true
    }
  })
}
