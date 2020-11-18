// 创建用户模型

let mongoose = require('mongoose')

// 操作数据库
// 1. 引入约束
let Schema = mongoose.Schema

// 2. 制定规则，创建一个约束对象实例
let userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    unique: true
  },
  header: { // 头像名称
    type: String
  },
  post: { // 职位
    type: String
  },
  info: { // 个人或职位简介
    type: String
  },
  company: { // 公司名称
    type: String
  },
  salary: { // 工资
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  },
  enable_flag: {
    type: String,
    default: 'Y'
  }
})

// 生成数据模模型，可以进行增删改查操作
// 第一个参数数据库名称，第二个参数约束对象的实例
module.exports = mongoose.model('user', userSchema)