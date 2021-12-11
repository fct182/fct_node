const connection = require("../app/database");

// 用于权限审查
class AuthService {
  /**
   * 检查用户是否有相关的权限
   */
  async checkAuth(tableName, momentId, userId) {
    const statement = `select * from ${tableName} where id=? and user_id=?`;
    const [result] = await connection.execute(statement, [momentId, userId]);
    if (result.length) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = new AuthService();