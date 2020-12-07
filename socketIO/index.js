module.exports = function(server) {
  const io = require('socket.io')(server)
  const chatModel = require('../model/chatModel')
  // 监听客户端连接
  io.on('connection', (socket) => {
    console.log('服务器 --- 客户端连接服务器')
    // 监听客户端发送的消息
    socket.on('sendMsg', ({from_id, to_id, content}) => {
      console.log('接收客户端消息')
      const chat_id = [from_id, to_id].sort().join('_')
      new chatModel({from_id, to_id, content, chat_id}).save((err, chatMsg) => {
        if(!err) {
          io.emit('receiveMsg', chatMsg)
        }
      })
    })
  })
}