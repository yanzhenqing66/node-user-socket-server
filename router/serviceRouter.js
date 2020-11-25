// 服务路由

const { Router, response, request } = require('express')
const md5 = require('blueimp-md5')

const userModel = require('../model/userModel')

let router = Router()

const filter = {password: 0, __v: 0, enable_flag: 0}

// 登录
router.post('/login', async (request, response) => {
  // 获取用户输入
  let { username, password } = request.body
  // 校验
  const usernameReg = /[A-Za-z0-9_\-\u4e00-\u9fa5]+/
  const passwordReg = /^[0-9a-zA-Z_#]{6,16}$/
  if (!usernameReg.test(username)) {
    response.send({ code: 2, msg: '用户名格式不正确' })
    return
  } else if (!passwordReg.test(password)) {
    response.send({ code: 2, msg: '密码格式不正确' })
    return
  }
  try {
    let findRes = await userModel.findOne({ username, password: md5(password) }, filter)
    if (findRes) {
      const {_id} = findRes
      response.cookie('token', _id, {maxAge: 1000*60*60*24})
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
  const { username, password, password2, user_type } = request.body
  // 校验
  const passwordReg = /^[0-9a-zA-Z_#]{6,16}$/
  const usernameReg = /[A-Za-z0-9_\-\u4e00-\u9fa5]+/

  if (!usernameReg.test(username)) {
    response.send({ code: 1, msg: '昵称格式不正确' })
    return
  } else if (!passwordReg.test(password)) {
    response.send({ code: 1, msg: '密码格式不正确' })
    return
  } else if (password !== password2) {
    response.send({ code: 1, msg: '两次密码不一致' })
    return
  }
  // 数据库操作
  try {
    let findRes = await userModel.findOne({ username })
    if (findRes) {
      response.send({ code: 1, msg: '用户已经被注册' })
      return
    } else {
      let createRes = await userModel.create({ username, user_type, password: md5('123456') })
      if (createRes) {
        const {_id} = createRes
        response.cookie('token', _id, {maxAge: 1000*60*60*24})
        response.send({ code: 0, data: { username, user_type, userId: _id } })
      }
    }
  } catch (error) {
    console.log(error)
    response.send({ code: 1, msg: '网络不稳定，请稍后重试' })
  }
})

// 更新用户信息
router.post('/userUpdate', async (request, response) => {
  let token = request.cookies.token
  if(!token) {
    return response.send({code: 1, msg: '请先登录'})
  }
  const { header } = request.body
  if (!header) {
    return response.send({ code: 1, msg: '请选择头像' })
  }
  try {
    userModel.findByIdAndUpdate({ _id: token }, request.body, filter, (err, oldUser) => {
      const {username, user_type, _id} = oldUser
      if(!oldUser) {
        response.clearCookie('token')
        response.send({code: 1, msg: '请先登录'})
      } else {
        let data = Object.assign(request.body, {username, user_type, _id})
        response.send({code: 0, data })
      }
    })
  } catch (error) {
    response.send({ code: 1, msg: '网络不稳定，请稍后重试' })
  }
})

// 获取用户信息
router.get('/user', async (request, response) => {
  const token = request.cookies.token
  if(!token) {
    return response.send({code: 1, msg: '请先登录'})
  }
  try {
    const findRes = await userModel.findOne({_id: token}, filter)
    if(findRes) {
      response.send({code: 0, data: findRes})
    }
  } catch (error) {
    console.log(error)
    response.send({code: 0, msg: '网络不稳定，请重新登录'})
  }
})

// 根据类型，获取用户列表
router.get('/userlist', async (request, response) => {
  const {user_type} = request.query
  try {
    const findRes = await userModel.find({user_type}, filter)
    if(findRes) {
      response.send({code: 0, data: findRes})
    }
  } catch (error) {
    console.log(error)
    response.send({code: 1, msg: error})
  }
})

module.exports = router