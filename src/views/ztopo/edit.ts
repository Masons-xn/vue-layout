/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-01-12 20:32:31
 * @LastEditTime: 2021-04-22 18:08:42
 * @LastEditors:
 */
import { uuid } from './ztopo/helper/util'

import ZTopo from './ztopo'
const init = dom => {
  const canvas = document.createElement('canvas')
  const container: Element | null = dom
  canvas.id = 'ztopo'
  canvas.width = dom.clientWidth
  canvas.height = dom.clientHeight
  if (container !== null) {
    container.appendChild(canvas)
  }
  const option = {
    canvas: canvas,
    isScale: false,
    imageSrc: './images/c.png',
    name: 'aa'
  }
  const scene = (window['scene'] = new ZTopo.Scene(option))
  // 开始解析数据结构
  window.addEventListener(
    'resize',
    e => {
      ;(document.querySelector('#ztopo') as any).setAttribute('width', `${dom.clientWidth}`)
      ;(document.querySelector('#ztopo') as any).setAttribute('height', `${dom.clientHeight}`)
      ;(canvas as any).onresize(e)
    },
    false
  )
  return {
    scene,
    addNode: (data, type = 'icon') => {
      if (!data.id) {
        data.id = uuid()
      }
      if (type === 'icon') {
        scene.add(new ZTopo.Node(data))
      } else if (type === 'defineNode') {
        scene.add(new ZTopo.NodeDefine(data))
      }

      return data.id
    },
    addLine: (option, start, end) => {
      scene.add(new ZTopo.Link(option, start, end))
    },
    addLinkPointToNode: () => {
      scene.add(new ZTopo.CirclePoint(10, 10, uuid()))
      console.log(scene.elementMap)
    },
    setNodePath: (id, path) => {
      scene.elementMap[id].$set('path', path.url)
      console.log(path)
    }
    // : id => {
    //   scene.elementMap[id].addLinkPoints()
    //   console.log(scene.elementMap)
    // }
  }
}
export default init
