// IP校验
export const isIp = (value: any) => {
  const regexp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  const valid = regexp.test(value)

  if (!valid) {
    // 首先必须是 xxx.xxx.xxx.xxx 类型的数字，如果不是，返回false
    return false
  }
  // '114.114.114.114'
  return value.split(".").every((num: string) => {
    // 切割开来，每个都做对比，可以为0，可以小于等于255，但是不可以0开头的俩位数
    // 只要有一个不符合就返回false
    if (value.split(".")[0] > 255) {
      // 第一位大于254时，返回false
      return false
    } else if (num.length > 1 && num.charAt(0) === "0") {
      // 大于1位的，开头都不可以是‘0’
      return false
    } else if (parseInt(num, 10) > 255) {
      // 大于255的不能通过
      return false
    }
    return true
  })
}

export const verifyIpv4 = () => {
  //@ts-ignore
  this.props.form.validateFields(
    ["ipv4ip", "ipv4subnetmask", "ipv4gateway", "ipv4dns"],
    (err, values) => {
      if (
        values.ipv4ip &&
        values.ipv4subnetmask &&
        values.ipv4gateway &&
        values.ipv4dns
      ) {
        return true
      }
      return false
    }
  )
}

// IPV6校验
export const isIpv6 = value => {
  const regexp = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/

  return regexp.test(value)
}

// IPV6 CIDR校验
export const isIpv6Cidr = (value: any) => {
  const regexp = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*\/(1[01][0-9]|12[0-8]|[0-9]{1,2})$/

  return regexp.test(value)
}

// 时间校验 1990-01-12 12:12:12
export const isTime = (value: string) => {
  const reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/

  return reg.test(value)
}

// 初始化的密码
export const initPassword = (value: any) => {
  const str = value

  if (str === null || str.length < 4) {
    return false
  }
  const reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)

  return reg.test(str)
}

export function isInteger(obj: number) {
  return obj % 1 === 0
}

// 网段校验
export function isCidr(str: string) {
  return (
    str === "0.0.0.0/0" ||
    /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([1-9]|[1-2]\d|3[0-2])$/.test(
      str
    )
  )
}

export function IPnetwork(ip) {
  if (ip.indexOf("/") > -1) {
    let ipArray = []

    ipArray = ip.split("/")
    const re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/ // 正则前部分ip

    if (ipArray.length === 2) {
      if (isInteger(ipArray[1]) && ipArray[1] <= 32 && ipArray[1] >= 0) {
        if (re.test(ipArray[0])) {
          // @ts-ignore
          if ( ((RegExp.$1 > 0) as any) &&   ((RegExp.$1 < 224) as any) &&  ((RegExp.$2 < 256) as any) && ((RegExp.$3 < 256) as any) && ((RegExp.$4 < 256) as any)) {
            return (((ipArray[1] >= 0) as any) <= 32) as any
          }
          return false
        }
        return false
      }
      return false
    }
    return false
  }
  return false
}

// 邮箱校验
export const isEmail = value => {
  const reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

  return reg.test(value)
}

export const geyeCheckMobileRegex = /^1\d{10}$/

// 手机号码校验
export const geyeCheckMobile = value => {
  return geyeCheckMobileRegex.test(value)
}

// 工号检验
export const geyeWorkerNumber = value => {
  const reg = /^([a-zA-Z]*([0-9])+){0,30}$/

  return reg.test(value)
}

// 经度校验(整数部分为0-180小数部分为0到6位)
export const isLongitude = value => {
  const reg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/

  return reg.test(value)
}

// 纬度,整数部分为0-90小数部分为0到6位
export const isLatitude = value => {
  const reg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/

  return reg.test(value)
}
