// 引入 查找用户是否存在 的函数
const { findUserExists, passwordIsEqual } = require("../service/user.service")
// 引入 对密码进行加密 的函数
const md5Password = require('../utils/md5-password');
// 引入 jsonwebtoken
const jwt = require("jsonwebtoken");
// 引入公钥
const { PUBLIC_KEY } = require("../constants/keys.js");

/**
 * 对注册的用户进行验证
 */
async function verifyUser(req, res, next) {
  const { name, password } = req.body;
  // 1. 判断用户名是否为空
  if (!name || !password) {
    req.status = 400;
    return next(new Error("用户名或者密码不能为空！"));
  }

  // 2. 判断用户名是否已经存在
  const result = await findUserExists(name);
  if (result.length !== 0) {
    req.status = 400;
    return next(new Error("用户名已存在"));
  }

  // 3. 没发生错误，继续执行
  await next();
}

/**
 * 加密用户的密码存入数据库
 */
async function passwordHandle(req, res, next) {
  const { password } = req.body;
  req.body.password = md5Password(password);

  await next();
}

/**
 * 对登录的用户进行验证
 */
async function verifyLogin(req, res, next) {
  const { name, password } = req.body;
  // 1. 判断用户名或者密码是否为空
  if (!name || !password) {
    req.status = 400;
    return next(new Error("用户名或者密码不能为空！"));
  }

  // 2. 判断用户名是否不存在
  const result = await findUserExists(name);
  if (result.length === 0) {
    req.status = 400;
    return next(new Error("用户名不存在"));
  }

  // 3. 判断密码是否正确
  if (md5Password(password) !== result[0].password) {
    req.status = 400;
    return next(new Error("用户名或者密码错误！"));
  }
  // 4. 将 user 绑定到 req 上
  req.user = result[0];

  // 5. 账号密码正确
  await next();
}

/**
 * 验证 用户 token授权
 */
async function verifyAuth(req, res, next) {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    req.status = 401;
    return next(new Error("无效的token！"));
  }
  const token = authorization.replace("Bearer ", "");
  // 验证 token(id,name,iat,exp)
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    });
    req.user = result;
    await next();
  } catch (error) {
    req.status = 401;
    next(new Error("无效的token！"));
  }
}

module.exports = {
  verifyUser,
  passwordHandle,
  verifyLogin,
  verifyAuth
}