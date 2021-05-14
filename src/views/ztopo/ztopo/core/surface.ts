/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-01 16:03:17
 * @LastEditTime: 2021-04-22 13:45:21
 * @LastEditors:
 */
import Element from './element'
import { DirectionMap } from '../point/point'
import { Util } from '../helper/util'
import Vector from '../helper/Vector'
import Link from '../model/link/link'
export default class Surface extends Element {
  name: any
  style: { fillStyle: string; font: string }
  type: any
  alpha: number
  scala: number
  icon: string
  isOnMousedrag: boolean
  direction: number
  isOnRecting: boolean
  editerPointer: any[]
  points: any
  pointsMap: Map<number, { x: number; y: number }>
  pointId: number
  constructor(option) {
    super()
    this.x = option.x || 0
    this.y = option.y || 0
    this.id = option.id
    this.isOnMousedrag = false
    this.width = option.width || 60
    this.height = option.height || 60
    this.type = 'surface'
    this.pointsMap = new Map()
    this.points = []
    this.editerPointer = option.editerPointer || undefined
    this.direction = -1
    this.pointId = -1
    this.pid = option.pid || ''
  }

  addLink(node) {}
  updateView(ctx) {
    this.clearStroke()
    this.draw(ctx)
    // this.drawEdit(ctx)
  }

  draw(_ctx) {}
  checkisIn(point: Vector): boolean {
    const vectors = [
      new Vector(this.x - this.width / 2, this.y - this.height / 2),
      new Vector(this.x + this.width / 2, this.y - this.height / 2),
      new Vector(this.x + this.width / 2, this.y + this.height / 2),
      new Vector(this.x - this.width / 2, this.y + this.height / 2)
    ]
    return Util.pointInRect(point, vectors)
  }
  // onMouseover({ e, event }) {
  //   console.log('point222')
  //   this.onMouseover
  // }
}
