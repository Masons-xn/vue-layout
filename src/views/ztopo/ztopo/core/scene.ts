import { Util, uuid } from '../helper/util'
import ForceLayout from '../layout/forceLayout'
import Element from './element'
import { Link } from '../model/link'
// import { Link } from '../point/ind'
import Vector from '../helper/Vector'
import Surface from './surface'
export default class Scene {
  name: any
  canvas: any
  ctx: any
  width: any
  center: any
  height: any
  image: HTMLImageElement
  linkTemp: string // 增加线1
  isForce: boolean // 力向自动布局
  sceneMove: boolean // 整体移动
  mutliSelect: boolean // 多选
  cenrerPointX: number
  cenrerPointY: number
  scale: number
  isScale: any
  maxScale: number
  minScale: number
  contextMenu: any
  startDragMouseX: number
  startDragMouseY: number
  mouseX: number
  mouseY: number
  offset: any
  isRangeSelectable: boolean
  elements: any[]
  layout: any
  nodes: Surface[]
  links: Link[]
  point: any[]
  elementMap: {}
  selectedElements: any[]
  isMousedown: boolean
  currElement: any
  isOnMouseDown: boolean
  constructor(option) {
    this.name = option.name || ''
    this.canvas = option.canvas
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.cenrerPointX = this.width / 2
    this.cenrerPointY = this.height / 2
    this.image = new Image()
    this.image.src = option.imageSrc || ''
    this.scale = 1
    this.isForce = option.force || false
    this.isScale = option.isScale || true
    this.maxScale = 10
    this.minScale = 0.1
    this.center = {
      x: 0,
      y: 0
    }
    if (this.isForce) {
      this.layout = new ForceLayout({
        width: this.width,
        height: this.height,
        getElements: () => {
          return this.getElements()
        }
      })
    }
    this.init()
    this.bindEvent()
  }

  init() {
    this.ctx.shadowBlur = 5
    this.ctx.shadowColor = 'rgba(0,0,0,0.5)'
    this.ctx.shadowOffsetX = 3
    this.ctx.shadowOffsetY = 6
    this.startDragMouseX = 0
    this.startDragMouseY = 0
    this.offset = this.canvas.getBoundingClientRect()
    this.isRangeSelectable = true
    this.nodes = []
    this.links = []
    this.point = []
    this.elementMap = {}
    this.selectedElements = []
    this.canvas.addEventListener(
      'keydown',
      e => {
        this.keydown(e)
        e.preventDefault()
      },
      true
    )
    window.addEventListener(
      'keyup',
      e => {
        this.keyup(e)
        e.preventDefault()
      },
      true
    )
    this.offset = this.canvas.getBoundingClientRect()
    this.updateView()
  }
  add(e) {
    if (this.elementMap[e.id]) {
      return
    }
    if (!e.id) e.id = uuid()
    if (e.type === 'node') {
      this.nodes.push(e)
      e.addLink = e => {
        return this.addLink(e)
      }
    } else if (e.type === 'point') {
      this.point.push(e)
    } else {
      this.links.push(e)
    }
    this.elementMap[e.id] = e

    e.getElementByuid = uid => {
      return this.getElementByuid(uid)
    }
    e.getNodes = e => {
      return this.nodes
    }
    e.getLinks = e => {
      return this.links
    }
    e.getElements = e => {
      return this.getElements()
    }
    e.addElement = e => {
      return this.addElement(e)
    }
  }
  getElementByuid(id) {
    return this.elementMap[id]
  }
  clear() {
    this.elementMap = {}
  }
  drop() {
    this.elementMap = {}
    for (const key in this.elementMap) {
      this.elementMap[key] = null
    }
    this.updateView = () => {
      console.log('drop')
    }
  }
  getNodesBound(nodes) {
    const bound = { x: 10000000, y: 1000000, width: 0, height: 0 }
    if (nodes.length > 0) {
      let minX = 10000000
      let maxX = -10000000
      let minY = 10000000
      let maxY = -10000000
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i]
        if (item.x <= minX) {
          minX = item.x
        }
        if (item.x >= maxX) {
          maxX = item.x + item.width
        }
        if (item.y <= minY) {
          minY = item.y
        }
        if (item.y + item.height / 2 >= maxY) {
          maxY = item.y + item.height / 2
        }
      }
      bound.x = (maxX - minX) / 2
      bound.y = (maxY - minY) / 2
      bound.width = maxX - minX
      bound.height = maxY - minY // 文字占20px
      return bound
    }
    return null
  }

  getElements() {
    return this.elementMap
  }
  // 更新视图
  updateView() {
    const needUpdate: any = []
    if (this.layout && !this.layout.isInit) {
      this.layout.render()
    }
    for (const key in this.elementMap) {
      if (this.elementMap[key].needUpdate) {
        needUpdate.push(this.elementMap[key])
      }
    }
    if (needUpdate.length > 0) {
      needUpdate.concat(this.links).map(item => {
        item.update()
      })
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      let all: Element[] = []
      all = all.concat(this.nodes)
      all = all.concat(this.links)
      all = all.concat(this.point)
      all.forEach(item => {
        const steps = item.strokes
        if (steps && steps.length > 0) {
          steps.forEach(step => {
            step(this.ctx)
          })
        }
      })
    }
    requestAnimationFrame(() => {
      this.updateView()
    })
  }

  attachMousewheel() {
    this.canvas.onmousewheel = event => {
      event = event || window.event
      this.mousewheel(event)
      event.preventDefault()
    }
    // this.isScale = true
  }

  cancleMousewheel() {
    this.canvas.onmousewheel = null
    this.isScale = false
  }

  getElementByXY(x, y) {
    let e: any
    let all: Element[] = []
    all = all.concat(this.nodes)
    all = all.concat(this.links)
    all = all.concat(this.point)
    all.some((item: Element) => {
      if (item.checkisIn(new Vector(x, y))) {
        e = item
        return
      }
    })
    return e
  }
  getLineByXY(x, y) {
    let e: any
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const node = this.nodes[i]
      if (
        x > node.x - node.width / 2 &&
        x < node.x + node.width / 2 &&
        y > node.y - node.height / 2 &&
        y < node.y + node.height / 2
      ) {
        e = node
        break
      }
    }
    return e
  }

  cancleAllSelected() {
    this.selectedElements.forEach(item => item.cancleSelected())
    this.selectedElements = []
  }
  bindEvent() {
    window.onbeforeunload = event => {
      this.drop()
    }
    this.canvas.onresize = () => {
      this.ctx = this.canvas.getContext('2d')
      for (const key in this.elementMap) {
        this.elementMap[key].needUpdate = true
      }
    }
    this.canvas.onmousedown = event => {
      this.isMousedown = true
      this.mousedown(event)
      event.preventDefault()
    }
    this.canvas.ondblclick = event => {
      console.log('双击666')
    }
    this.canvas.onmousemove = event => {
      this.mousemove(event)
    }
    this.canvas.onmouseup = event => {
      this.isMousedown = false
      this.mouseup(event)
    }
    if (this.isScale) {
      this.canvas.onmousewheel = event => {
        event = event || window.event
        this.mousewheel(event)
        event.preventDefault()
        this.updateView()
      }
    }
    this.canvas.oncontextmenu = event => {
      event = event || window.event
      this.contextmenu(event)
      event.preventDefault()
      return false
    }
  }
  /**
   *	鼠标滚轮滚动， 缩放
   * @param {Event} event
   */
  mousewheel(event) {
    let scale = 1
    if (event.wheelDelta > 0) {
      scale = 1.1
    } else {
      scale = 0.9
    }
    const temp = this.scale * scale
    if (temp >= this.minScale && temp <= this.maxScale) {
      this.scale *= scale
      const xy = Util.getXY(this, event)
      const nodes: any = []
      for (const key in this.elementMap) {
        nodes.push(this.elementMap[key])
      }
      nodes.forEach(node => {
        node.width *= scale
        node.height *= scale
        node.proxy.x = xy.x + (node.x - xy.x) * scale
        node.proxy.y = xy.y + (node.y - xy.y) * scale
      })
    }
  }

  mousedown(event) {
    const xy = Util.getXY(this, event)
    const x = xy.x
    const y = xy.y
    const nodes = []
    this.startDragMouseX = x
    this.startDragMouseY = y
    if (!this.mutliSelect) {
      this.cancleAllSelected()
    }
    if (this.sceneMove) {
      this.nodes.forEach(node => {
        node.isOnMousedrag = true
        node.setDragable(false)
        node.onMouseselected()
      })
      return
    }
    const selectedNode: Element | null = this.getElementByXY(x, y)
    if (selectedNode && selectedNode !== null) {
      ;(selectedNode as Element).mousedown({ e: { x: x, y: y, context: this }, event })
      this.currElement = selectedNode
    }
    if (this.currElement) {
      if (this.selectedElements.indexOf(this.currElement) === -1) {
        this.selectedElements.push(this.currElement)
      }
    }
    for (let i = 0; i < this.selectedElements.length; i++) {
      const node = this.selectedElements[i]
      node.isOnMousedrag = true
      node.selectedLocation = {
        x: node.x,
        y: node.y,
        width: node.getWidth(),
        height: node.getHeight()
      }
    }
    // if (!this.currElement || this.currElement === null) {
    //   nodes.forEach(
    //     node =>
    //       (node.selectedLocation = {
    //         x: node.getX(),
    //         y: node.getY(),
    //         width: node.getWidth(),
    //         height: node.getHeight()
    //       })
    //   )
    // }
    this.isOnMouseDown = true
  }
  mousemove(event) {
    const xy = Util.getXY(this, event)
    this.mouseX = xy.x
    this.mouseY = xy.y
    const x = xy.x
    const y = xy.y
    const dx = x - this.startDragMouseX
    const dy = y - this.startDragMouseY
    if (this.sceneMove) {
      this.nodes.forEach(node =>
        node.mousedrag({ e: { x: x, y: y, dx: dx, dy: dy, context: this }, event })
      )
      return
    }

    if (this.linkTemp) {
      this.elementMap[this.linkTemp].$set('end', {
        x: this.mouseX,
        y: this.mouseY
      })
    }
    let all: Element[] = []
    all = all.concat(this.nodes)
    all = all.concat(this.links)
    all = all.concat(this.point)
    for (let i = all.length - 1; i >= 0; i--) {
      const node = all[i]
      if (node.x + node.width < 0 || node.x > this.canvas.width) continue
      if (node.checkisIn(new Vector(x, y))) {
        node.mouseover({ e: { x: x, y: y, dx: dx, dy: dy, context: this }, event })
      } else {
        node.mouseout({ e: { x: x, y: y, dx: dx, dy: dy, context: this }, event })
      }
    }
    if (this.currElement && this.isOnMouseDown && this.currElement.isDragable()) {
      this.selectedElements.forEach(node =>
        node.mousedrag({ e: { x: x, y: y, dx: dx, dy: dy }, event })
      )
    } else if (this.isOnMouseDown && this.isScale) {
      this.nodes.forEach(node =>
        node.mousedrag({ e: { x: x, y: y, dx: dx, dy: dy, context: this }, event })
      )
    }
  }

  mouseup(event) {
    const xy = Util.getXY(this, event)
    const x = xy.x
    const y = xy.y
    const dx = x - this.startDragMouseX
    const dy = y - this.startDragMouseY
    this.nodes.forEach(node => {
      node.mouseup({ e: { x: x, y: y, dx: dx, dy: dy, context: this }, event })
      node.setDragable(true)
    })
    this.currElement = null
    if (this.linkTemp && !this.elementMap[this.linkTemp]['nodeEnd']) {
      this.remove(this.linkTemp)
    }
    this.linkTemp = ''
    this.startDragMouseX = 0
    this.isOnMouseDown = false
  }

  keydown(e) {
    const keyID: number = e.keyCode ? e.keyCode : e.which
    this.nodes.forEach(node => node.keydown(keyID))

    // switch (keyID) {
    //   case 8: // delete
    //     this.selectedElements.forEach(item => {
    //       this.remove(item.id)
    //     })
    //     break
    //   case 16:
    //     // Shift
    //     break
    //   case 17:
    //     // Ctrl
    //     this.mutliSelect = true
    //     break
    //   case 18:
    //     // Alt
    //     break
    //   case 27:
    //     // Esc
    //     break
    //   case 32:
    //     // Space
    //     this.sceneMove = true
    //     break
    // }
  }

  keyup(e) {
    const keyID = e.keyCode ? e.keyCode : e.which
    this.nodes.forEach(node => node.keyup(keyID))
    this.sceneMove = false
    this.mutliSelect = false
  }
  contextmenu(event) {
    event.preventDefault()
    this.selectedElements.forEach(node => node.contextmenu({ event }))
  }
  remove(id) {
    const ele = this.elementMap[id]
    const delLinks: any[] = []
    if (ele.type === 'link') {
      this.links.splice(
        this.links.findIndex(item => item.id === id),
        1
      )
    } else if (ele.type === 'point') {
      this.point.splice(
        this.point.findIndex(item => item.id === id),
        1
      )
    } else {
      this.links.forEach(item => {
        // console.log(item.id, item.nodeStart.id === id || item.nodeEnd.id === id)
        if (
          item.nodeStart &&
          item.nodeEnd &&
          (item.nodeStart.id === id || item.nodeEnd.id === id)
        ) {
          delLinks.push(item.id)
          // delete this.elementMap[item.id]
        }
      })
      this.nodes.splice(
        this.nodes.findIndex(item => item.id === id),
        1
      )
    }
    delete this.elementMap[id]
    // delLinks.forEach(i => {})
    for (const key in this.elementMap) {
      this.elementMap[key].needUpdate = true
    }
    return true
  }
  addElement(e) {
    return this.add(e)
  }
  addLink(node) {
    if (!this.linkTemp) {
      this.linkTemp = uuid()
      this.addElement(new Link({ id: this.linkTemp }, { id: node.id, pointId: node.pointId }))
      this.elementMap[this.linkTemp].$set('end', {
        x: this.mouseX,
        y: this.mouseY
      })
    }
  }
}
