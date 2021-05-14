/*
 * @Description:
 * @Author: 希宁
 * @Date: 2020-07-30 16:08:30
 * @LastEditTime: 2020-11-14 19:26:17
 * @LastEditors:
 */
let socket: any

const webSocket = (param, callback?) => {
  if (!socket) {
    socket = new WebSocket(`ws://127.0.0.1:4444`)
  }
  socket.onopen = () => {
    socket.createNewServer(param)
    console.log('数据发送中...')
  }
  // socket.onmessage = evt => {
  //   if (callback) {
  //     callback(evt)
  //   }
  //   console.log(evt)
  //   console.log('数据已接收...')
  // }
  socket.myevent = evt => {
    if (callback) {
      callback(evt)
    }
    console.log(evt)
  }
  socket.onclose = () => {
    console.log('连接已关闭...')
  }
}
export default webSocket
