/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-01-21 16:03:17
 * @LastEditTime: 2021-02-22 09:51:55
 * @LastEditors:
 */
import Element from '../../core/element'
import { Util } from '../../helper/util'
import Surface from '../../core/surface'
import Vector from '../../helper/Vector'

export default class Link extends Element {
  nodeStart: { id: string; pointId: number }
  nodeEnd: { id: string; pointId: number }
  start: any
  end: any
  font: string
  text: string
  style: { strokeStyle: string; alpha: number; lineWidth: number; fillStyle: string }
  constructor(config: any, nodeA?, nodeB?) {
    super()
    this.nodeStart = nodeA
    this.nodeEnd = nodeB
    this.text = config.text
    this.id = config.id
    this.style = { strokeStyle: '116, 166, 250', alpha: 1, lineWidth: 2, fillStyle: '' }
    this.type = 'link'
    this.start = {
      x: 0,
      y: 0
    }
    this.end = {
      x: 0,
      y: 0
    }
  }
  getlinkNodes() {
    if (this.nodeStart && (this.getElements()[this.nodeStart.id] as Surface)) {
      this.start = (this.getElements()[this.nodeStart.id] as Surface).pointsMap.get(
        this.nodeStart.pointId
      )
    }
    if (this.nodeEnd && (this.getElements()[this.nodeEnd.id] as Surface)) {
      this.end = (this.getElements()[this.nodeEnd.id] as Surface).pointsMap.get(
        this.nodeEnd.pointId
      )
    }
  }
  updateView(_ctx) {
    this.clearStroke()
    const setps = ctx => {
      this.getlinkNodes()
      ctx.save()
      ctx.beginPath()
      if (this.isSelected() || this.isFocus()) {
        ctx.strokeStyle = 'rgba(0,191,205,' + this.style.alpha + ')'
      } else {
        ctx.strokeStyle = 'rgba(' + this.style.strokeStyle + ',' + this.style.alpha + ')'
      }
      ctx.lineWidth = this.style.lineWidth
      ctx.moveTo(this.start.x, this.start.y)
      ctx.lineTo(this.end.x, this.end.y)
      ctx.stroke()
      ctx.closePath()
      ctx.restore()
      if (this.text) {
        this.drawText(ctx)
      }
    }
    this.addStroes(setps)
  }
  getLength() {
    return Util.getDistance(this.end, this.start)
  }
  onMouseover({ e, event }) {
    // console.log('hover')
  }
  drawText(ctx) {
    ctx.save()
    ctx.beginPath()
    ctx.translate((this.start.x + +this.end.x) / 2, (this.start.y + this.end.y) / 2)
    ctx.fillStyle = 'black'
    ctx.fillStyle = 'rgba(1, 33, 0, 1)'
    ctx.fillText(this.text, 0, 15)
    ctx.closePath()
    ctx.restore()
  }
  checkisIn(point: Vector) {
    return Util.pointInLine(point, this.start, this.end)
  }
}
