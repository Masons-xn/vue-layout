import { proxy } from './proxy'
import Vector from '../helper/Vector'

export default abstract class Element {
  private proxy: any
  needUpdate: boolean
  updateTime: number
  strokes: any
  selectedLocation: any
  // 模式  预览 p、场景定义ds、surface定义de
  id: string
  pid: string
  x: number
  y: number
  angle: number
  width: any
  height: any
  isCtrl: boolean
  private dragable: any
  private selected: any
  private focus: any
  style: any
  type: string
  isOnMousedrag: any
  isOnMousOver: boolean
  $set: Function
  getNodes: () => []
  getLinks: () => []
  getElements: () => {}
  constructor() {
    this.selectedLocation = null
    this.proxy = proxy(this)
    this.$set = (key, value) => {
      this.proxy[key] = value
    }
    this.needUpdate = true
    this.dragable = true
    this.strokes = []
    this.angle = 0
    this.isCtrl = false
    this.selected = false
    this.style = {
      font:
        'normal bold 12px Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol'
    }
  }
  update(canvas) {
    if (this.needUpdate) {
      this.needUpdate = false
    }
    this.updateView(canvas)
  }
  add(e) {}
  updateView(_e) {}
  getElementByuid(id: string): Element | null {
    return null
  }
  getParent(): Element | null {
    return this.getElementByuid(this.pid)
  }
  effect(ids) {
    ids
      .filter(i => i)
      .map(id => {
        const instance = this.getElementByuid(id) as any
        //  避免多次重复调用 draw 3帧  帧数太低可能会出现问题
        if (instance && this.updateTime + 60 * 5 > instance.updateTime) {
          instance.proxy.needUpdate = true
        }
      })
  }
  addStroes(step) {
    this.strokes.push(step)
    this.updateTime = new Date().valueOf()
  }
  clearStroke() {
    return (this.strokes = [])
  }
  getId() {
    return this.id
  }
  setId(i) {
    this.id = i
  }
  setX(x) {
    this.x = x
    return this
  }
  setY(y) {
    this.y = y
    return this
  }
  getX() {
    return this.x
  }
  getY() {
    return this.y
  }
  getLocation(x, y) {
    return { x: this.getX(), y: this.getY(), width: this.getWidth(), height: this.getHeight() }
  }
  setLocation(x, y) {
    this.setX(x)
    this.setY(y)
    this.effect([this.id])
  }
  getWidth() {
    return this.width
  }
  setWidth(width) {
    this.width = width
    return this
  }
  getHeight() {
    return this.height
  }
  setHeight(height) {
    this.height = height
    return this
  }
  getSize() {
    return { width: this.getWidth(), height: this.getHeight() }
  }
  setSize(width, height) {
    this.setWidth(width)
    this.setHeight(height)
    return this
  }
  setBound(x, y, width, height) {
    this.setLocation(x, y)
    this.setSize(width, height)
    return this
  }
  getBound() {
    return {
      left: this.getX(),
      top: this.getY(),
      right: this.getX() + this.getWidth(),
      bottom: this.getY() + this.getHeight()
    }
  }

  isDragable() {
    return this.dragable
  }

  setDragable(d) {
    this.dragable = d
    return this
  }
  isSelected() {
    return this.selected
  }
  setSelected(s) {
    this.proxy.selected = s
    return this
  }
  isFocus() {
    return this.focus
  }
  setFocus(f) {
    this.proxy.focus = f
    return this
  }
  onFocus() {
    this.setFocus(true)
    return this
  }

  keydown(keyCode) {
    if (keyCode === 17) {
      this.isCtrl = true
    }
  }
  keyup(_keyCode) {
    this.isCtrl = false
  }
  mousedown({ e, event }) {
    this.setSelected(true)
    this.selectedLocation = {
      x: this.getX(),
      y: this.getY(),
      width: this.getWidth(),
      height: this.getHeight()
    }
    this.onMousedown({ e, event })
  }

  onMouseselected() {
    this.selectedLocation = {
      x: this.getX(),
      y: this.getY(),
      width: this.getWidth(),
      height: this.getHeight()
    }
  }

  mouseselected() {
    this.setSelected(true)
    this.selectedLocation = {
      x: this.getX(),
      y: this.getY(),
      width: this.getWidth(),
      height: this.getHeight()
    }
    this.onMouseselected()
  }

  // ingroup(group: any): boolean {
  //   if (group && this.parentNode['uuid'] === group.uuid) {
  //     return true
  //   }
  //   return false
  // }
  mouseup({ e, event }) {
    // if (this.outgroup && this) {
    //   for (let j = 0; j < box.groups.length; j++) {
    //     const c = box.groups[j]
    //     if (this.parentgroup !== c) continue
    //     if (
    //       this.x + this.width < c.x ||
    //       this.x > c.x + c.width ||
    //       this.y + this.height < c.y ||
    //       this.y > c.y + c.height
    //     ) {
    //       this.parentgroup.remove(this)
    //       break
    //     }
    //   }
    // }
    // if (this.isOnMousedrag) {
    //   for (let j = 0; j < box.groups.length; j++) {
    //     const group = box.groups[j]
    // if (!this.ingroup(group)) continue
    // if (x > group.x && x < group.x + group.width && y > group.y && y < group.y + group.height) {
    //   if (this.parentgroup) {
    //     this.parentgroup.remove(this)
    //   }
    //   group.add(this)
    //   break
    // }
    // }
    // }
    this.onMouseup({ e, event })
    this.isOnMousedrag = false
    event.target.style.cursor = 'default'
  }

  cancleSelected() {
    this.setSelected(false)
    this.selectedLocation = null
  }
  onMousedown(event) {}
  onMouseup(event) {}
  onMouseover({ e, event }) {
    // if (
    //   this.x - this.width / 2 < e.x &&
    //   this.x + this.width / 2 > e.x &&
    //   this.y - this.height / 2 < e.y &&
    //   this.y + this.height / 2 > e.y
    // ) {
    //   this.setFocus(true)
    // } else {
    //   this.setFocus(false)
    // }
  }
  onMouseout(event) {
    this.setFocus(false)
  }
  onMousedrag(event) {}
  onContextmenu(event) {}
  contextmenu({ event }) {
    this.onContextmenu(event)
  }
  mouseover({ e, event }) {
    if (!this.isOnMousOver) {
      this.isOnMousOver = true
      this.setFocus(true)
    }
    this.onMouseover({ e, event })
  }
  mouseout({ e, event }) {
    if (this.isOnMousOver && !this.isOnMousedrag) {
      this.isOnMousOver = false
      this.onMouseout(event)
      event.target.style.cursor = 'default'
    }
    this.setFocus(false)
  }
  mousedrag({ e, event }) {
    // this.isOnMousedrag = true
    // const dx = e.dx
    // const dy = e.dy
    // const x = e.x
    // const y = e.y
    // const newX = this.selectedLocation.x + dx
    // const newY = this.selectedLocation.y + dy
    // this.setLocation(newX, newY)
    // const box = e.context
    // this.onMousedrag(event)
  }
  addElement(_node) {}
  checkisIn(point: Vector): boolean {
    return false
  }
}
