/*
 * @Description:
 * @Author: 希宁
 * @Date: 2021-01-12 20:32:31
 * @LastEditTime: 2021-04-22 18:08:08
 * @LastEditors:
 */
import { uuid } from './ztopo/helper/util'

import ZTopo from './ztopo'
const init = (data, dom) => {
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
    name: 'aa',
    force: true
  }
  const scene = (window['scene'] = new ZTopo.Scene(option))
  // 开始解析数据结构
  function analysis(data) {
    if (data.children && data.children.length > 0) {
      const id = uuid()
      scene.add(new ZTopo.Node(Object.assign(data)))
      // const g = new ZTopo.GridGroup(Object.assign(data, { id: id, pid: data.id }))
      // scene.add(g)
      data.children.map(item => {
        scene.add(
          new ZTopo.Link(
            {},
            { id: item.id, pointId: ~~(5 + Math.random() * 3) },
            { id: data.id, pointId: ~~(5 + Math.random() * 3) }
          )
        )
        analysis(Object.assign(item, { pid: data.id }))
      })
    } else {
      scene.add(new ZTopo.Node(data))
    }
  }

  analysis(data)
  // const link = new ZTopo.ArrowsLink(
  //   'b33ef416-0ba7-95a4-af6b-24894dee9454',
  //   'b77a9bb7-64c1-943e-9291-ac9dc698c352',
  //   'text'
  // )
  // scene.add(link)
  // const linka = scene.add(linka)
  // const linkb = new ZTopo.FoldLink(
  //   '8f294d1f-4003-8f5b-8e6a-2fb6248dc982',
  //   '890f244a-6fdd-a764-bc2e-62e1fc4cc8d1',
  //   'text'
  // )
  // scene.add(linkb)
  window.addEventListener(
    'resize',
    e => {
      ;(document.querySelector('#ztopo') as any).setAttribute('width', `${dom.clientWidth}`)
      ;(document.querySelector('#ztopo') as any).setAttribute('height', `${dom.clientHeight}`)
      ;(canvas as any).onresize(e)
    },
    false
  )
}
export default init
