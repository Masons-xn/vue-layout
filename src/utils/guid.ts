function Guid() {
  // @ts-ignore
  const that = this
  that.date = new Date() /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
  if (typeof that.newGuid !== "function") {
    /* 生成Guid码 */
    Guid.prototype.newGuid = () => {
      that.date = new Date()
      let GuidStr = ""
      const sexadecimalDate = that.hexadecimal(that.getGuidDate(), 16)
      const sexadecimalTime = that.hexadecimal(that.getGuidTime(), 16)
      for (let i = 0; i < 9; i++) {
        GuidStr += Math.floor(Math.random() * 16).toString(16)
      }
      GuidStr += sexadecimalDate
      GuidStr += sexadecimalTime
      while (GuidStr.length < 32) {
        GuidStr += Math.floor(Math.random() * 16).toString(16)
      }
      return that.formatGuid(GuidStr)
    }
    /* * 功能：获取当前日期的Guid格式，即8位数的日期：19700101 *
    返回值：返回Guid日期格式的字条串 */
    Guid.prototype.getGuidDate = () => {
      return (
        that.date.getFullYear() +
        that.addZero(that.date.getMonth() + 1) +
        that.addZero(that.date.getDay())
      )
    }
    /* * 功能：获取当前时间的Guid格式，即8位数的时间，包括毫秒，毫秒为2位数
    ：12300933 * 返回值：返回Guid日期格式的字条串 */
    Guid.prototype.getGuidTime = function() {
      return (
        that.addZero(that.date.getHours()) +
        that.addZero(that.date.getMinutes()) +
        that.addZero(that.date.getSeconds()) +
        that.addZero(parseInt(String(that.date.getMilliseconds() / 10), 0))
      )
    }
    /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 *
     参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值:
      如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
    Guid.prototype.addZero = num => {
      if (Number(num).toString() !== "NaN" && num >= 0 && num < 10) {
        return "0" + Math.floor(num)
      }
      return num.toString()
    }
    /*  * 功能：将y进制的数值，转换为x进制的数值 *
    参数：第1个参数表示欲转换的数值；
    第2个参数表示欲转换的进制；
    第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */
    Guid.prototype.hexadecimal = (num, x, y) => {
      if (y !== undefined) {
        return parseInt(num.toString(), y).toString(x)
      }
      return parseInt(num.toString(), 0).toString(x)
    }
    /* * 功能：格式化32位的字符串为Guid模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准Guid格式的字符串 */
    Guid.prototype.formatGuid = GuidStr => {
      // let str1 = GuidStr.slice(0, 8) + '-', str2 = GuidStr.slice(8, 12) + '-',
      // str3 = GuidStr.slice(12, 16) + '-', str4 = GuidStr.slice(16, 20) + '-', str5 = GuidStr.slice(20);
      // return str1 + str2 + str3 + str4 + str5;
      return GuidStr
    }
  }
}
export default new Guid()
