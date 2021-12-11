const crypto = require("crypto");

function md5Password(password) {
  const md5 = crypto.createHash("md5");
  // 使用 md5 加密，编码为16进制
  const result = md5.update(password).digest("hex");
  return result;
}

module.exports = md5Password