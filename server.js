// 引入 express 框架
const express = require('express')
const http = require('http')

const db = require('./db')
const cookieParser = require('cookie-parser')

const userRouter = require('./router/userRouter')
const chatRouter = require('./router/chatRouter')

// 创建app服务对象
let app = express()
let server = http.Server(app)
require('./socketIO/index')(server)

db.then(() => {
  // 中间件
  app.use(express.static('public'))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(express.json({limit: '5mb'}))
  app.use(userRouter)
  app.use(chatRouter)

}).catch(err => {
  console.log(err)
})

// 绑定窗口监听
server.listen('5000', err => {
  if (!err) console.log('服务器连接成功')
  else console.log(err)
})
