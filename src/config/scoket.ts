let socket: any
const webSocket = (path, param, callback?) => {
  if (!socket) {
    socket = new WebSocket(`ws://127.0.0.1:4005`)
  }
  socket.onopen = () => {
    socket.send(param)
    console.log('数据发送中...')
  }
  socket.onmessage = (evt) => {
    if (callback) {
      callback(evt)
    }
    console.log(evt)
    console.log('数据已接收...')
  }
  socket.onclose = () => {
    console.log('连接已关闭...')
  }
}
export default webSocket
