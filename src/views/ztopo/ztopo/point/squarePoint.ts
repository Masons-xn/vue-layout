/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-04 17:40:56
 * @LastEditTime: 2021-04-22 11:37:20
 * @LastEditors:
 */

import { Point } from './point'

export class SquarePoint extends Point {
  constructor(x, y, direction) {
    super(x, y, direction)
  }
  draw(ctx) {
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(1,102,205, 0.9)'
    if (this.isSelect) {
      ctx.fillStyle = 'rgba(168,202,236,1)'
    } else {
      ctx.fillStyle = 'rgba(168,202,236,0.1)'
    }
    ctx.rect(this.x - 5, this.y - 5, 10, 10)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }
  // checkisIn(e) {
  //   return this.x - 5 < e.x && this.x + 5 > e.x && this.y - 5 < e.y && this.y + 5 > e.y
  //     ? this.direction
  //     : false
  // }
}
