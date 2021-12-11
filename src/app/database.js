const mysql = require('mysql2');
const {
  MYSQL_HOST,
  MYSQL_DATABASE,
  MYSQL_ROOT,
  MYSQL_PASSWORD } = require("../app/config")

// 创建连接池
const connections = mysql.createPool({
  host: MYSQL_HOST,
  database: MYSQL_DATABASE,
  user: MYSQL_ROOT,
  password: MYSQL_PASSWORD
});

// 测试连接
connections.getConnection((err, conn) => {
  conn.connect((err) => {
    if (err) throw err;
    console.log("数据库连接成功");
  })
});

module.exports = connections.promise();