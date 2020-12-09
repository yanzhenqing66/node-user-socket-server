const mongoose = require('mongoose')

// 引入约束
const Schema = mongoose.Schema

// 创建约束规则
const chatSchema = new Schema({
  from_id: {
    type: String,
    required: true
  },
  to_id: {
    type: String,
    required: true
  },
  chat_id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  create_time: {
    type: Number,
    default: Date.now()
  },
  enable_flag: {
    type: String,
    default: 'Y'
  }
})

// 生成数据模型
module.exports = mongoose.model('chat', chatSchema)