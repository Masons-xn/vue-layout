/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-04 17:40:56
 * @LastEditTime: 2021-04-22 11:14:57
 * @LastEditors:
 */

import Element from './element'

export class EditerDefineNode extends Element {
  points: any
  constructor(node) {
    super()
    const width = node.width
    const height = node.height
    const x = node.x
    const y = node.y
    this.points = []
    if (node.editerPointer) {
      this.points = this.points.concat(node.editerPointer)
    }
    this.points.forEach(item => {
      if (item.direction === node.pointId) {
        item.setSelect()
      }
    })
  }
  onMouseover({ e, event }) {
    console.log('point')
  }
}
