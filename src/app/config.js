// 1. 引入 dotenv,作用是读取环境变量
const dotenv = require('dotenv');

// 2. 使用
dotenv.config();

// 3. 取出环境变量，并导出
module.exports = {
  APP_HOST,
  APP_PORT,
  MYSQL_HOST,
  MYSQL_DATABASE,
  MYSQL_ROOT,
  MYSQL_PASSWORD
} = process.env;


// console.log(process.env.APP_PORT);