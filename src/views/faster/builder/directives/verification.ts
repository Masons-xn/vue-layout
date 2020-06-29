/**
 * 表单验证
 */
import { Fast } from "../core/config"
import rules from "../config/verifivationRule"

const Verification = {
  install: (Vue: {
    directive: (
      arg0: string,
      arg1: {
        componentUpdated: (
          el: any,
          binding: any,
          vnode: any,
          oldVnode: any
        ) => void
      }
    ) => void
  }) => {
    Vue.directive("btverification", {
      componentUpdated: function(el, binding) {
        const value = binding.value.value,
          rule = binding.value.rule,
          id = binding.value.id
        if (rule) {
          Fast.Mapping[id].validateFail = !(
            rules[rule].reg.test(value) && value.length > 0
          )
        }
      }
    })
  }
}

export { Verification }
