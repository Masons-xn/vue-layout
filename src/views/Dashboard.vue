<template>
  <div class="p-3">
    admin dashboard
    <div class="mt-48"></div>
    <div ref="container" class="relative" v-resize="onResize">
      <div class="w-full text-right h-48 flex justify-center items-center">
        <span ref="a" class="p-2 bg-red-200 border-4 block w-12 h-12 rounded-full text-center">
          A
        </span>
      </div>
      <div style="height: 150px;">
        <div>
          <div ref="b" class="p-2 bg-blue-200 border-2 block w-8">
            B
          </div>
        </div>
      </div>
      <div class="w-full" style="height: 500px;">
        <div class="text-right pt-48" style="width: 700px;">
          <div style="width: 400px;">
            <el-button ref="c">C</el-button>
          </div>
        </div>
      </div>
      <div ref="canvas" class="absolute bg-pink-50" style="z-index: -1;"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class Dashboard extends Vue {
  created() {
    console.log('admin dashboard created')
    console.log('search', location.search, 'pathname', location.pathname, 'hash', location.hash)
  }

  mounted() {
    this.draw()
  }

  draw() {
    const container = this.$refs.container
    const a = this.$refs.a
    const b = this.$refs.b
    const c = (this.$refs.c as any).$el as Element
    const canvas = this.$refs.canvas as any

    // 设置画布位置尺寸
    const points = this.getCanvasRect(container, a, b, c) as any
    canvas.style.left = `${points[0].x}px`
    canvas.style.top = `${points[0].y}px`
    canvas.style.width = `${points[1].x - points[0].x}px`
    canvas.style.height = `${points[1].y - points[0].y}px`
    canvas.width = points[1].x - points[0].x
    canvas.height = points[1].y - points[0].y
    while (canvas.hasChildNodes()) {
      canvas.removeChild(canvas.firstChild)
    }

    // 连线
    this.drawLine(canvas, a, b)
    this.drawLine(canvas, a, c)
    this.drawLine(canvas, b, c)
  }

  /**
   * 获取包含多个元素的最小画布的 左上角与右下角
   * @param container 基准容器dom元素
   * @param els dom元素
   * @return [左上坐标, 右下坐标]
   */
  getCanvasRect(container, ...els) {
    if (!container || !els || els.length === 0) {
      return null
    }
    const base = { x: container.getBoundingClientRect().x, y: container.getBoundingClientRect().y }
    const x = Math.min(...els.map(el => el.getBoundingClientRect().left)) - base.x
    const y = Math.min(...els.map(el => el.getBoundingClientRect().top)) - base.y
    const xMax =
      Math.max(
        ...els.map(el => el.getBoundingClientRect().left + el.getBoundingClientRect().width)
      ) - base.x
    const yMax =
      Math.max(
        ...els.map(el => el.getBoundingClientRect().top + el.getBoundingClientRect().height)
      ) - base.y
    return [
      { x, y },
      { x: xMax, y: yMax }
    ]
  }
  /**
   * 获取相对于容器的元素中心点坐标
   * @param container 基准容器元素
   * @param el 元素
   */
  getCenterPosition(container, el) {
    if (!container || !el) {
      return { x: 0, y: 0 }
    }
    const base = { x: container.getBoundingClientRect().x, y: container.getBoundingClientRect().y }
    return {
      x: el.getBoundingClientRect().x + el.getBoundingClientRect().width / 2 - base.x,
      y: el.getBoundingClientRect().y + el.getBoundingClientRect().height / 2 - base.y
    }
  }

  /**
   * 在canvas上绘制两个元素的连线
   * @param canvas 画布元素
   * @param el1 元素1
   * @param el2 元素2
   */
  drawLine(canvas, el1, el2) {
    const p1 = this.getCenterPosition(canvas, el1)
    const p2 = this.getCenterPosition(canvas, el2)

    // div模式
    const line = document.createElement('div')
    const length = Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2))
    const deg = -(Math.atan((p1.y - p2.y) / (p2.x - p1.x)) * 180) / Math.PI
    let start
    if (p1.x < p2.x) {
      start = p1
    } else {
      start = p2
    }

    line.setAttribute(
      'style',
      `height: 1px;border-bottom: 1px solid;display: box;width: ${length}px;transform: rotate(${deg}deg); transform-origin: 0 0;position:absolute;left: ${start.x}px;top: ${start.y}px;`
    )
    canvas.appendChild(line)

    // // canvas模式
    // // 初始化
    // const context = canvas.getContext('2d')
    // context.lineWidth = 2
    // context.strokeStyle = '#2c3e50'
    //
    // // 绘制
    // context.beginPath()
    // context.moveTo(p1.x, p1.y)
    // context.lineTo(p2.x, p2.y)
    // context.closePath()
    // context.stroke()
  }

  onResize() {
    console.log('onResize')
    this.draw()
  }
}
</script>

<style scoped lang="scss"></style>
