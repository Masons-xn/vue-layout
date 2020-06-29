/**
 * Created by xining.lao on 2/20/2017.
 */

import _ from "lodash"
import Vue from "vue"

function different(object, states) {
  const diffObj = _.cloneDeep(object)
  //@ts-ignore
  const that = this
  that[states] = new Vue({
    data: {
      diffObj: object,
      isdiff: false
    },
    methods: {
      doDiff() {
        that[states] = !equalsObj(diffObj, this.diffObj)
      }
    },
    watch: {
      diffObj: {
        handler() {
          this.doDiff()
        },
        deep: true,
        immediate: true
      }
    }
  }).isdiff
}
function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]"
}
function isArray(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]"
}
function equalsObj(oldData, newData) {
  if (oldData === newData) {
    return true
  }
  if (
    isObject(oldData) &&
    isObject(newData) &&
    Object.keys(oldData).length === Object.keys(newData).length
  ) {
    for (const key in oldData) {
      if (Object.prototype.hasOwnProperty.call(oldData, key)) {
        if (!equalsObj(oldData[key], newData[key])) {
          return false
        }
      }
    }
  } else if (
    isArray(oldData) &&
    isArray(oldData) &&
    oldData.length === newData.length
  ) {
    for (let i = 0, length = oldData.length; i < length; i++) {
      if (!equalsObj(oldData[i], newData[i])) {
        return false
      }
    }
  } else {
    return false
  }
  return true
}

const install = (Vue: any) => {
  Vue.prototype.$diff = function(object: any, states: string) {
    return different.call(this, object, states)
  }
}

const Diff = { install }

declare module "vue/types/vue" {
  interface Vue {
    $diff: typeof different
  }
}
export default Diff
