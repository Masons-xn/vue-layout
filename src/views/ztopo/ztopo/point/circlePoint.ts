/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-04 17:40:56
 * @LastEditTime: 2021-04-22 14:54:03
 * @LastEditors:
 */

import { Point } from './point'
export class CirclePoint extends Point {
  constructor(x, y, direction) {
    super(x, y, direction)
  }
  draw(ctx) {
    const setps = ctx => {
      ctx.save()
      ctx.beginPath()
      if (this.isSelect) {
        ctx.strokeStyle = 'rgba(204, 51, 51, 0.9)'
        ctx.arc(this.x, this.y, 5, Math.PI * 2, 0, true)
        ctx.fillStyle = 'rgba(204, 51, 51, 0.9)'
        ctx.fill()
      } else {
        ctx.strokeStyle = 'rgba(204, 51, 51, 0.9)'
        ctx.arc(this.x, this.y, 5, Math.PI * 2, 0, true)
      }
      ctx.stroke()
    }
    this.addStroes(setps)
  }
  checkisIn(e): boolean {
    return Math.sqrt((e.x - this.x) * (e.x - this.x) + (e.y - this.y) * (e.y - this.y)) <= 10
  }
  onMousedown({ e, event }) {
    event.target.style.cursor = 'move'
  }
  mousedrag({ e, event }) {
    const dx = e.dx
    const dy = e.dy
    if (this.isOnMousedrag) {
      const newX = this.selectedLocation.x + dx
      const newY = this.selectedLocation.y + dy
      this.setLocation(newX, newY)
    }
  }
  onMouseup({ e, event }) {
    event.target.style.cursor = 'default'
  }
  drawSelectedRect(ctx) {
    this.isSelect = true
    this.$set('needUpdate', true)
    // const w = this.width
    // ctx.save()
    // ctx.beginPath()
    // ctx.translate(this.x, this.y)
    // ctx.strokeStyle = 'rgba(168,202,255, 0.9)'
    // ctx.fillStyle = 'rgba(168,202,236,0)'
    // ctx.rect(-w / 2, -this.height / 2, w, this.height)
    // ctx.fill()
    // ctx.stroke()
    // ctx.closePath()
    // ctx.restore()
  }
}
