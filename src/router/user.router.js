const express = require('express');
// 引入 用户请求处理 函数
const { create, login, test, avatarInfo } = require("../controller/user.controller");
// 引入 用户验证处理、密码处理 函数
const { verifyUser, passwordHandle, verifyLogin, verifyAuth } = require("../middleware/user.middleware")

const router = express.Router();

/**
 * 用户 注册 接口
 */
router.post("/register", verifyUser, passwordHandle, create);

/**
 * 用户 登录 接口
 */
router.post("/login", verifyLogin, login);

/**
 * 验证用户 token
 */
router.get("/test", verifyAuth, test);

/**
 * 获取用户 头像avatar
 */
router.get("/:userId/avatar", avatarInfo);


module.exports = router;