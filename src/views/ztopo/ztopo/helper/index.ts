/*

 * @Description:
 * @Author: 希宁
 * @Date: 2021-01-25 09:37:25
 * @LastEditTime: 2021-02-07 14:31:45
 * @LastEditors:  
 */
import Element from '../core/element'
export default class Helper extends Element {
  private instance: Element
  constructor(config: Element) {
    super()
    this.instance = config
    // console.log(this.instance)
  }
  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.instance.x, this.instance.y, 3, Math.PI * 2, 0, true)
    ctx.restore()
    // const grid = 50
    // const canvasHeight = ctx.canvas.height //计算canvas画布的高度
    // const canvasWidth = ctx.canvas.width //获取画布的宽度
    // const xLineNumber = Math.floor(canvasWidth / grid) //计算需要几条横线
    // const yLineNumber = Math.floor(canvasHeight / grid) //计算需要几条竖线
    // ctx.strokeStyle = '#black'
    // for (let i = 0; i < xLineNumber; i++) {
    //   //循环来画线
    //   ctx.beginPath()

    //   ctx.moveTo(i * grid, 0)
    //   ctx.lineTo(i * grid, canvasHeight)
    //   ctx.stroke()
    // }
    // for (let i = 0; i < yLineNumber; i++) {
    //   ctx.beginPath()
    //   ctx.moveTo(0, i * grid)
    //   ctx.lineTo(canvasWidth, i * grid)
    //   ctx.stroke()
    // }
    //绘制坐标轴

    // const spance = 0
    // const arrowSize = 0
    // ctx.beginPath()
    // ctx.moveTo(spance, spance)
    // ctx.lineTo(spance, canvasHeight - spance)
    // ctx.strokeStyle = 'black'
    // ctx.stroke()
    // //2.绘制X轴
    // ctx.beginPath()
    // ctx.moveTo(spance, canvasHeight - spance)
    // ctx.lineTo(canvasWidth - spance, canvasHeight - spance)
    // ctx.stroke()
    // //3.绘制X轴的箭头
    // ctx.moveTo(canvasWidth - spance, canvasHeight - spance - 5)
    // ctx.lineTo(canvasWidth - spance, canvasHeight - spance + 5)
    // ctx.lineTo(canvasWidth - spance + 10, canvasHeight - spance)
    // ctx.closePath()
    // ctx.fill()
    // //绘制Y轴箭头
    // ctx.moveTo(spance - 5, spance)
    // ctx.lineTo(spance + 5, spance)
    // ctx.lineTo(spance, spance - 10)
    // ctx.closePath()
    // ctx.fill()

    ctx.stroke()
  }
}
