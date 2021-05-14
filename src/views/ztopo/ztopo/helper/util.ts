import Vector from './Vector'

export const Util = {
  drawStart(ctx) {
    ctx.save()
    ctx.beginPath()
  },
  drawEnd(ctx) {
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  },
  getDistance(p1, p2) {
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    return Math.sqrt(dx * dx + dy * dy)
  },
  mouseCoords(event) {
    if (event.pageX || event.pageY) {
      return { x: event.pageX, y: event.pageY }
    }
    return {
      x: event.clientX + document.body.scrollLeft - document.body.clientLeft,
      y: event.clientY + document.body.scrollTop - document.body.clientTop
    }
  },
  pointInRect(point: Vector, vertices: Vector[]): boolean {
    if (vertices.length < 3) {
      return false
    }
    let isIn = false

    let last = vertices[vertices.length - 1]
    for (const item of vertices) {
      if ((item.y < point.y && last.y >= point.y) || (item.y >= point.y && last.y < point.y)) {
        if (item.x + ((point.y - item.y) * (last.x - item.x)) / (last.y - item.y) > point.x) {
          isIn = !isIn
        }
      }

      last = item
    }

    return isIn
  },
  pointInLine(point: Vector, from: Vector, to: Vector): boolean {
    const points: Vector[] = [
      new Vector(from.x - 8, from.y - 8),
      new Vector(to.x - 8, to.y - 8),
      new Vector(to.x + 8, to.y + 8),
      new Vector(from.x + 8, from.y + 8)
    ]

    return this.pointInRect(point, points)
  },
  getXY(box, event) {
    event = event || this.mouseCoords(window.event)
    const x = document.body.scrollLeft + (event.x || event.layerX)
    const y = document.body.scrollTop + (event.y || event.layerY)
    return { x: x - box.offset.left, y: y - box.offset.top }
  },
  rotatePoint(bx, by, x, y, angle) {
    const dx = x - bx
    const dy = y - by
    const r = Math.sqrt(dx * dx + dy * dy)
    const a = Math.atan2(dy, dx) + angle
    return {
      x: bx + Math.cos(a) * r,
      y: by + Math.sin(a) * r
    }
  },
  rotatePoints(target, points, angle) {
    const result: any = []
    for (let i = 0; i < points.length; i++) {
      const p = this.rotatePoint(target.x, target.y, points[i].x, points[i].y, angle)
      result.push(p)
    }
    return result
  },
  Drawing() {
    let mask: any = document.querySelector('#loadingMask')
    if (!mask) {
      mask = document.createElement('div')
      mask.id = 'loadingMask'
      ;(document.querySelector('#ztopo') as Element).append(mask)
    }
    mask
      .setAttribute(
        'style',
        'width:100%;height:100%;position:fixed;left:0;top:0;background:#ccc; z-index:2000;opacity:0.1'
      )(document.querySelector('#ztopo') as Element)
      .setAttribute('style', 'opacity:0')
  },
  DrawOver() {
    const mask = document.querySelector('#loadingMask')
    if (mask) {
      mask.remove()
    }
    ;(document.querySelector('#ztopo') as Element).setAttribute('style', 'opacity:1')
  }
}
export const throttle = (func, wait) => {
  let previous = 0
  return function() {
    const now = Date.now()
    //@ts-ignore
    const context = this
    //@ts-ignore
    const args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}

export const debounce = (fn, delay) => {
  let timer
  return function() {
    //@ts-ignore
    const context = this
    //@ts-ignore
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
  }
}

export const uuid = () => {
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() //use high-precision timer if available
  }
  const uuid = 'yxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

export const randomChineseWord = (len?: number) => {
  const randomWord = () => {
    const _rsl = ''
    const _randomUniCode = Math.floor(Math.random() * (40870 - 19968) + 19968).toString(16)
    eval('_rsl=' + '"\\u' + _randomUniCode + '"')
    return _rsl
  }
  if (!len) {
    len = 1
  }
  let i = 0
  let word = ''
  while (i < len) {
    i++
    word += randomWord()
  }
  return word
}
export const getRandomColor = () => {
  return (
    'rgb(' +
    Math.floor(Math.random() * 256) +
    ',' +
    Math.floor(Math.random() * 256) +
    ',' +
    Math.floor(Math.random() * 256) +
    ')'
  )
}
export const getObjType = obj => {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}
export const deepClone = data => {
  const type = getObjType(data)
  let obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    //不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (const key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}
