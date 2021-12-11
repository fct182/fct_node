const connection = require("../app/database");


class UserService {
  // 用户注册
  async create(user) {
    // 插入 SQL 语句
    const statement = `insert into users (name,password) values (?,?)`;
    const result = await connection.execute(statement, [user.name, user.password]);
    return result[0];
  }
  // 查询用户是否存在
  async findUserExists(name) {
    const statement = `select * from users where name = ?`;
    const [result] = await connection.execute(statement, [name]);
    return result;
  }
  // 更新用户的头像信息
  async updateAvatar(id, path) {
    const statement = `update users set avatarUrl = ? where id = ?`;
    const [result] = await connection.execute(statement, [path, id]);
    return result;
  }
}

module.exports = new UserService();