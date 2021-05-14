/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-04 17:40:56
 * @LastEditTime: 2021-04-22 11:00:20
 * @LastEditors:
 */

import { Direction } from '../point/point'
import { CirclePoint } from '../point/circlePoint'
import { SquarePoint } from '../point/squarePoint'

export class Editer {
  points: any
  constructor(node) {
    const width = node.width
    const height = node.height
    const x = node.x
    const y = node.y
    const p1 = new SquarePoint(x - width / 2 + 6, y - height / 2 + 6, Direction.LeftUp) // 左上
    const p2 = new SquarePoint(x - width / 2 + 6, y + height / 2 - 6, Direction.LeftBottom) // 左下
    const p3 = new SquarePoint(x + width / 2 - 6, y + height / 2 - 6, Direction.rightBottom) // 右下
    const p4 = new SquarePoint(x + width / 2 - 6, y - height / 2 + 6, Direction.rightUp) // 右上
    this.points = []
    this.points.push(p1)
    this.points.push(p2)
    this.points.push(p3)
    this.points.push(p4)
    if (node.editerPointer) {
      this.points = this.points.concat(node.editerPointer)
    } else {
      // 默认4个点
      const p5 = new CirclePoint(x, y - height / 2 + 5, Direction.Up) // 上
      const p6 = new CirclePoint(x - width / 2 + 5, y, Direction.Left) // 左
      const p7 = new CirclePoint(x + width / 2 - 5, y, Direction.Right) // 右
      const p8 = new CirclePoint(x, y + height / 2 - 5, Direction.Bottom) // 下
      this.points.push(p5)
      this.points.push(p7)
      this.points.push(p8)
      this.points.push(p6)
    }
    this.points.forEach(item => {
      if (item.direction === node.pointId) {
        item.setSelect()
      }
    })
  }
}
