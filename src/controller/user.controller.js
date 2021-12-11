const service = require('../service/user.service');
// 引入 jsonwebtoken
const jwt = require('jsonwebtoken');
// 引入 私钥
const { PRIVATE_KEY } = require('../constants/keys.js');
const { getAvatarByUserId } = require('../service/file.service');
const fs = require('fs');

class UserController {
  /**
   * 注册
   */
  async create(req, res, next) {
    // 1. 获取用户请求该接口传递的参数
    const user = req.body;

    // 2. 插入新用户数据，并取得结果
    const result = await service.create(user);

    // 3. 返回操作提示
    if (result.affectedRows) {
      res.status(200).send({
        status: 200,
        message: "注册成功"
      });
    } else {
      req.status = 500;
      next(new Error("注册失败！"));
    }
  }

  /**
   * 登录
   */
  async login(req, res, next) {
    const { name, id } = req.user;
    // 颁发 令牌 token
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24, // 设置过期时间，单位 s
      algorithm: "RS256"
    });
    // 返回客户端信息
    res.send({
      status: 200, id, name, token
    });
  }

  /**
   * 测试
   */
  async test(req, res, next) {
    console.log(req.user);
    res.send("授权成功");
  }

  /**
   * 获取用户头像
   */
  async avatarInfo(req, res, next) {
    const { userId } = req.params;
    // 获取用户头像信息
    const result = await getAvatarByUserId(userId);
    if (result) { // 判断当前用户有无头像
      const stream = fs.createReadStream(`./uploads/avatar/${result.filename}`);
      res.set('Content-Type', result.mimetype);
      // stream.on("data", chunk => {
      //   res.write(chunk);
      // });
      // stream.on("end", () => {
      //   res.status(200);
      //   res.end();
      // });
      stream.pipe(res);
    } else {
      return next(new Error("当前用户没有设置头像！"));
    }
  }
}
module.exports = new UserController();
