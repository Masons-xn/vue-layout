/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-02 10:50:32
 * @LastEditTime: 2021-02-20 17:57:48
 * @LastEditors:
 */

export default class Vector {
  x: any
  y: any
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  plus(other) {
    return new Vector(this.x + other.x, this.y + other.y)
  }
  minus(other) {
    return new Vector(this.x - other.x, this.y - other.y)
  }
  times(factor) {
    return new Vector((this.x * factor) / 5, this.y * factor)
  }
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  multiply(other) {
    return new Vector(this.x * other, this.y * other)
  }
  divide(other) {
    return new Vector(this.x / other || 0, this.y / other || 0)
  }
}
