/*
import Vector from '../../force/Vector';
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-04 17:40:56
 * @LastEditTime: 2021-04-22 17:27:56
 * @LastEditors:  
 */

import Element from '../core/element'
import Vector from '../helper/Vector'

export enum Direction {
  LeftUp = 1,
  LeftBottom,
  rightUp,
  rightBottom,
  Up,
  Bottom,
  Left,
  Right
}
const DirectionMap = new Map()
DirectionMap.set(Direction.LeftUp, { dir: 'nw-resize', vec: new Vector(-1, -1) })
DirectionMap.set(Direction.LeftBottom, { dir: 'sw-resize', vec: new Vector(-1, 1) })
DirectionMap.set(Direction.rightUp, { dir: 'ne-resize', vec: new Vector(1, -1) })
DirectionMap.set(Direction.rightBottom, { dir: 'se-resize', vec: new Vector(1, 1) })
export { DirectionMap }
export enum PointType {
  Edge,
  Link,
  Trans
}

export class Point extends Element {
  pointType
  x: any
  y: any
  id: string
  isSelect: boolean
  direction: string
  constructor(x, y, direction) {
    super()
    this.x = x
    this.y = y
    this.id = direction
    this.isSelect = false
    this.type = 'point'
    this.direction = direction
  }
  draw(_ctx) {
    // console.log(_ctx)
  }
  checkisIn(e) {
    return true
  }
  setSelect() {
    this.isSelect = true
  }
  updateView(ctx) {
    this.clearStroke()
    this.draw(ctx)
  }
  onMouseover({ e, event }) {
    // console.log(_ctx)
  }
}
