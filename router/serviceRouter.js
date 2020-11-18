// 服务路由

const { Router } = require('express')
const md5 = require('blueimp-md5')

const userModel = require('../model/userModel')

let router = Router()

// 登录
router.post('/login', async (request, response) => {
  // 获取用户输入
  let { username, password } = request.body
  // 校验
  const nickNameReg = /[A-Za-z0-9_\-\u4e00-\u9fa5]+/
  const passwordReg = /^[0-9a-zA-Z_#]{6,16}$/
  if (!nickNameReg.test(username)) {
    response.send({ code: 2, msg: '用户名格式不正确' })
    return
  } else if (!passwordReg.test(password)) {
    response.send({ code: 2, msg: '密码格式不正确' })
    return
  }
  try {
    let findRes = await userModel.findOne({ username, password: md5(password) })
    if (findRes) {
      response.send({ code: 0, data: findRes })
    } else {
      response.send({ code: 1, msg: '用户名或密码不正确' })
    }
  } catch (error) {
    console.log(error)
  }
})

// 注册
router.post('/register', async (request, response) => {
  // 获取用户输入
  let { username, password, password2, type } = request.body
  // 校验
  const passwordReg = /^[0-9a-zA-Z_#]{6,16}$/
  const usernameReg = /[A-Za-z0-9_\-\u4e00-\u9fa5]+/

  if (!usernameReg.test(username)) {
    response.send({ code: 1, msg: '昵称格式不正确' })
    return
  } else if (!passwordReg.test(password)) {
    response.send({ code: 1, mag: '密码格式不正确' })
    return
  } else if (password !== password2) {
    response.send({ code: 1, msg: '两次密码不一致' })
    return
  }
  // 数据库操作
  try {
    let findRes = await userModel.findOne({ username })
    if (findRes) {
      response.send({code: 1, msg: '用户已经被注册'})
      return
    } else {
      let createRes = await userModel.create({ username, type, password: md5(password) })
      if (createRes) {
        response.send({code: 0, data: {username, type, userId: createRes._id}})
      }
    }
  } catch (error) {
    console.log(error)
    response.send({code: 1, msg: '网络不稳定，请稍后重试'})
  }
})

module.exports = router