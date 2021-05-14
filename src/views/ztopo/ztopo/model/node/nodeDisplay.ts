/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-01 16:03:17
 * @LastEditTime: 2021-04-22 13:41:55
 * @LastEditors:
 */

import Surface from '../../core/surface'
// import { CirclePoint } from '../../point/circlePoint'

export default class NodeDisplay extends Surface {
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
    // const p5 = new CirclePoint(this.x, this.y - this.height / 2 + 5, 10) // 上
    // const p6 = new CirclePoint(this.x - this.width / 2 + 5, this.y, 11) // 左
    // points.push(p5)
    // points.push(p6)
    this.editerPointer = points
  }
  // onMousedown({ e, event }) {
  //   // this.canRange(e)
  //   if (this.mode !== 'de') {
  //     if (this.isCtrl) {
  //       // 旋转
  //       this.direction = -2
  //     } else if (this.direction > 4) {
  //       // 连线
  //       this.pointId = this.direction
  //       this.$set('needUpdate', true)
  //       this.addLink(this)
  //     } else if (this.direction > 0) {
  //       // 放大缩小
  //       this.pointId = this.direction
  //       event.target.style.cursor = DirectionMap.get(this.direction).dir
  //       this.isOnRecting = true
  //     } else {
  //       // 移动
  //       this.pointId = -1
  //       event.target.style.cursor = 'move'
  //       this.isOnMousedrag = true
  //       this.$set('needUpdate', true)
  //     }
  //   }
  // }
  // onMouseup({ e, event }) {
  //   if (this.isFocus() && this.direction > 4) {
  //     const link = this.getLinks().find((i: Link) => !i.end || !i.end.id) as Link
  //     if (link) {
  //       link.$set('nodeEnd', { id: this.id, pointId: this.direction })
  //     }
  //   }
  //   this.direction = -1
  //   this.isOnMousedrag = false
  //   this.isOnRecting = false
  // }
  // onMouseover({ e, event }) {
  //   this.pointId = this.direction
  //   if (this.mode !== 'de') {
  //     this.$set('needUpdate', true)
  //     if (this.isFocus() && !this.isOnMousedrag) {
  //       this.canRange(e)
  //       if (this.direction > 0) {
  //         if (this.direction > 4) {
  //           event.target.style.cursor = 'crosshair'
  //         } else {
  //           event.target.style.cursor = DirectionMap.get(this.direction).dir
  //         }
  //       } else {
  //         event.target.style.cursor = 'default'
  //       }
  //     }
  //   }
  // }
  // drawSelectedRect(ctx) {
  //   const w = this.width
  //   ctx.save()
  //   ctx.beginPath()
  //   ctx.translate(this.x, this.y)
  //   ctx.strokeStyle = 'rgba(168,202,255, 0.9)'
  //   ctx.fillStyle = 'rgba(168,202,236,0)'
  //   ctx.rect(-w / 2, -this.height / 2, w, this.height)
  //   ctx.fill()
  //   ctx.stroke()
  //   ctx.closePath()
  //   ctx.restore()
  // }
  //  overwrite
  // mousedrag({ e, event }) {
  //   const dx = e.dx
  //   const dy = e.dy
  //   if (this.mode !== 'de') {
  //     if (this.isOnMousedrag) {
  //       if (this.direction > 0 && this.direction <= 4 && this.isDragable()) {
  //         const vec = DirectionMap.get(this.direction).vec
  //         if (
  //           this.selectedLocation.width + dx * vec.x > 20 &&
  //           this.selectedLocation.height + dy * vec.y > 20
  //         ) {
  //           this.width = this.selectedLocation.width + dx * vec.x
  //           this.height = this.selectedLocation.height + dy * vec.y
  //           this.x = this.selectedLocation.x + dx / 2
  //           this.y = this.selectedLocation.y + dy / 2
  //           this.$set('needUpdate', true)
  //         }
  //       } else if (this.direction > 0 && this.isDragable()) {
  //         this.addLink(this)
  //       } else {
  //         const newX = this.selectedLocation.x + dx
  //         const newY = this.selectedLocation.y + dy
  //         this.setLocation(newX, newY)
  //       }
  //     }
  //   }
  // }
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
    this.addStroes(setps)
  }
}
