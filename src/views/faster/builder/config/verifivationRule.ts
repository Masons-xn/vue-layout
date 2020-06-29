/**
 * Created by xining.lao on 6/21/2017.
 */
const rules = {
  isNull: {
    reg: /\S/,
    msg: "此值不能为空",
    des: ""
  },
  isNumber: {
    reg: /^\d+$/,
    msg: "请您输入纯数字",
    des: ""
  },
  isEmail: {
    reg: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
    msg: "请您输入正确的邮箱地址",
    des: ""
  },
  isMobil: {
    reg: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
    msg: "请您输入正确的号码",
    des: ""
  }
}

export default rules
