import Vector from '../helper/Vector'

/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-02-02 13:23:03
 * @LastEditTime: 2021-04-22 18:09:46
 * @LastEditors:
 */
let isReady = false
const startTime = new Date().valueOf()
export default class ForceLayout {
  nodes: any[]
  edges: any[]
  nodePoints: Map<string, any>
  initState: boolean
  isInit: boolean
  ctx: {}
  width: any
  height: any
  getElements: () => {}
  constructor(options) {
    this.width = options.width || 800
    this.height = options.height || 800
    this.nodes = []
    this.initState = true
    this.isInit = false
    this.nodePoints = new Map()
    this.getElements = options.getElements || {}
  }
  render() {
    if (!this.isInit) {
      this.isInit = true
    }
    const eles = this.getElements()
    for (const key in eles) {
      if (eles[key].type === 'surface' && !this.nodePoints.get(eles[key].id)) {
        const node = eles[key]
        node.pos = new Vector(Math.random() * this.width, Math.random() * this.height)
        node.max = Math.sqrt((node.width * node.width) / 4 + (node.height * node.height) / 4)
        this.nodes.push(node)
        this.nodePoints.set(eles[key].id, eles[key])
      }
    }
    this.tick()
    const animate = requestAnimationFrame(() => {
      if (!isReady) {
        this.render()
      } else {
        cancelAnimationFrame(animate)
      }
    })
  }
  tick() {
    this.updateCoulombsLaw()
    this.updatePosition()
  }
  updateCoulombsLaw() {
    const springLength = 200
    const springStrength = 0.1
    const repulsionStrength = 1000
    const len = this.nodes.length
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        if (i === j) continue
        const node = this.nodes[i]
        const other = this.nodes[j]
        const apart = other.pos.minus(node.pos)
        const distance = Math.max(1, apart.length)
        let forceSize = -repulsionStrength / (distance * distance)
        if (
          other.pid === node.id ||
          ((node.pid === other.id || node.pid === other.pid) && node !== '')
        ) {
          forceSize += (distance - springLength) * springStrength
          if (Math.abs(forceSize) > 2) {
            isReady = false
          }
        }
        const applied = apart.times(forceSize / parseInt(distance.toString()))
        node.pos = node.pos.plus(applied)
        other.pos = other.pos.minus(applied)
      }
    }
    if (startTime < new Date().valueOf() - 10000) {
      isReady = true
    }
  }
  updatePosition() {
    const len = this.nodes.length
    for (let i = 0; i < len; i++) {
      this.nodes[i].y = this.nodes[i].pos.y
      this.nodes[i].$set('x', this.nodes[i].pos.x)
    }
  }
}
