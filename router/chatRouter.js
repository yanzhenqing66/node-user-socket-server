// 聊天服务路由

const { Router } = require('express')
const md5 = require('blueimp-md5')

const userModel = require('../model/userModel')
const chatModel = require('../model/chatModel')

let router = Router()
const filter = { enable_flag: 0, __v: 0, password: 0 }

// 获取当前用户所有聊天消息
router.get('/msglist', async (req, res) => {
  const token = req.cookies.token
  try {
    let findRes = await userModel.find()
    if (findRes) {
      let users = findRes.reduce((users, user) => {
        users[user._id] = { username: user.username, header: user.header }
        return users
      }, {})

      chatModel.find({ '$or': [{ from_id: token }, { to_id: token }] }, filter, (err, chatMsgs) => {
        if (!err) res.send({ code: 0, data: { users, chatMsgs } })
      })
    }
  } catch (error) {
    res.send({code: 1, msg: error})
  }

})

// 修改未读消息为已读
router.post('/updread', async (req, res) => {
  const from_id = req.body.from_id
  const to_id = req.cookies.token
  try {
    chatModel.update({ from_id, to_id, read: false }, { read: true }, { multi: true }, (err, doc) => {
      if (!err) res.send({ code: 0, data: doc.nModified })  // 返回更新的数量
    })
  } catch (error) {
    res.send({code: 1, msg: error})
  }
})

module.exports = router