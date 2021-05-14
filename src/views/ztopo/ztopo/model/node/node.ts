/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-01 16:03:17
 * @LastEditTime: 2021-04-22 11:43:45
 * @LastEditors:
 */
// import Element from './element'
// import { Editer } from './editer'
// import { DirectionMap } from '../point/point'
// import { uuid } from '../helper/util'
// import Link from '../link/link'

import Surface from '../../core/surface'

// let tempLineId = ''
export default class Node extends Surface {
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
    this.addStroes(setps)
  }
}
