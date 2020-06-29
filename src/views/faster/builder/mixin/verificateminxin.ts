/**
 * Created by xining.lao on 6/22/2017.
 */
import rule from "../config/verifivationRule"
import { Component, Vue, Provide, Prop, Watch } from "vue-property-decorator"
import _ from "lodash"
const rules = [false]

_.forIn(rule, (value, key) => {
  // @ts-ignore
  rules.push(key)
})
@Component
export default class Verificateminxin extends Vue {
  [x: string]: any
  @Prop({
    default: "",
    dataType: "string",
    valueBus: rules,
    des: "",
    alias: "是否需要验证"
  } as any)
  private isrequire: string

  @Prop({
    default: "",
    dataType: "string",
    valueBus: [],
    des: "错误信息提示,不填写时默认信息",
    alias: "验证规则"
  } as any)
  private errMsg: string

  private validateFail = false

  @Watch("validateFail", { deep: true })
  onvalidateFail() {
    this.setprop()
  }

  @Watch("isrequire", { deep: true })
  onIsRequireChange() {
    this.setprop()
  }
}
