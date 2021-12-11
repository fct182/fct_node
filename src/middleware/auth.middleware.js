const { checkAuth } = require("../service/auth.service");


/**
 * 验证 用户是否具有权限进行修改、删除操作
 */
async function verifyPermission(req, res, next) {
  // 1. 获取 数据
  const authKey = Object.keys(req.params)[0];
  const authId = req.params[authKey];
  const tableName = authKey.replace("Id", "s");
  const { id } = req.user;

  // 2. 查询动态作者id和请求修改的userId是否相同
  const result = await checkAuth(tableName, authId, id);
  if (result) {
    await next();
  } else {
    req.status = 403;
    return next(new Error("您没有权限对该动态进行操作！"));
  }
}


module.exports = {
  verifyPermission
};