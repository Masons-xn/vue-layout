/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-01 16:03:17
 * @LastEditTime: 2021-04-22 15:57:22
 * @LastEditors:
 */

import Surface from '../../core/surface'
import { CirclePoint } from '../../point/circlePoint'
import { EditerDefineNode } from '../../core/editerDefineNode'

export default class NodeDedine extends Surface {
  name: any
  style: { fillStyle: string; font: string }
  type: any
  alpha: number
  scala: number
  ImageCache: any
  text: any
  icon: string
  isOnMousedrag: boolean
  points: any
  direction: number
  constructor(option) {
    super(option)
    this.icon = option.icon || `./images/upload.png`
    const points = []
    this.type = 'nodeDefine'
    this.editerPointer = points
  }
  addLinkPoints() {
    const p5 = new CirclePoint(this.x, this.y - this.height / 2 + 5, 10) // 上
    this.editerPointer.push(p5)
    this.$set('needUpdate', true)
  }
  draw(_ctx) {
    const setps = ctx => {
      ctx.save()
      ctx.translate(this.x, this.y)
      if (this.icon) {
        if (this.ImageCache) {
          ctx.drawImage(this.ImageCache, -this.width / 2, -this.height / 2, this.width, this.height)
          ctx.strokeStyle = '#ccc'
        } else {
          const img = new Image()
          img.src = this.icon
          img.onload = e => {
            setTimeout(() => {
              this.effect([this.id, this.pid])
            })
            this.ImageCache = e['path'][0]
          }
        }
      } else {
        ctx.beginPath()
        ctx.fillStyle = this.style.fillStyle
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height)
        ctx.fill()
        ctx.closePath()
      }
      ctx.restore()
    }
    this.drawEdit(_ctx)
    this.addStroes(setps)
  }
  drawEdit(_ctx) {
    this.addStroes(ctx => {
      this.points = new EditerDefineNode(this).points
      this.points.forEach(s => {
        // if (this.isSelected() || this.isFocus()) {
        s.draw(ctx)
        // }
        this.pointsMap.set(s.id, s)
      })
    })
  }
  onMouseover({ e, event }) {
    // this.canRange(e)
  }
  // canRange(e) {
  //   this.direction = this.points.map(p => p.checkisIn(e)).filter(item => item)[0] || -1
  //   return this.direction
  // }
}
