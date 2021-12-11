const connection = require("../app/database");

class FileService {
  /**
   * 插入用户头像信息
   */
  async createAvatar(filename, mimetype, size, userId) {
    const statement = `insert into avatar (filename,mimetype,size,user_id) values(?,?,?,?)`;
    const [result] = await connection.execute(statement, [filename, mimetype, size, userId]);
    return result;
  }
  /**
   * 获取头像信息通过用户ID
   */
  async getAvatarByUserId(id) {
    const statement = `select * from avatar where user_id = ?`;
    const [result] = await connection.execute(statement, [id]);
    return result[0];
  }

  /**
   * 删除用户旧头像信息
   */
  async deleteAvatar(id) {
    const statement = `delete from avatar where user_id = ?`;
    const [result] = await connection.execute(statement, [id]);
    return result;
  }

  /**
   * 插入到数据库中--动图配图信息
   */
  async createPictures(filename, mimetype, size, momentId, userId) {
    const statement = `insert into file (filename, mimetype, size, moment_id,user_id) values(?,?,?,?,?)`;
    const [result] = await connection.execute(statement, [filename, mimetype, size, momentId, userId]);
    return result;
  }
}

module.exports = new FileService();