const express = require("express");
// 导入 用户管理 路由
const userRouter = require("../router/user.router");
// 导入 内容动态 路由
const momentsRouter = require("../router/moments.router");
// 导入 评论 路由
const commentRouter = require("../router/comment.router");
// 导入 标签 路由
const labelRouter = require("../router/label.router");
// 导入 文件相关操作 路由
const fileRouter = require("../router/file.router");

const app = express();

// 对 JSON 数据进行处理
app.use(express.json());
// 对 urlencoded 数据进行处理
app.use(express.urlencoded({ extended: true }));

// 使用 用户路由
app.use("/users", userRouter);

// 使用 内容动态/文章 的路由
app.use("/moments", momentsRouter);

// 使用 评论 的路由
app.use("/comment", commentRouter);

// 使用 标签 的路由fileRouter
app.use("/label", labelRouter);

// 使用 文件操作 的路由
app.use("/upload", fileRouter);


// 错误统一处理
app.use((err, req, res, next) => {
  // 获取状态码 req.status
  const status = req.status || 400;
  res.status(status).send({
    status: status,
    message: err.message
  })
})

module.exports = app;