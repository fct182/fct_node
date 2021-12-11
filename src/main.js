const app = require("./app");
// 引入环境变量
const { APP_PORT } = require('./app/config');


app.listen(APP_PORT, () => {
  console.log(APP_PORT + "端口服务器启动成功");
});