const res = require("express/lib/response");
const connection = require("../app/database");

class LabelService {
  /**
   * 创建标签
   */
  async createLabel(name) {
    const statement = `insert into labels (name) values(?)`;
    const [result] = await connection.execute(statement, [name]);
    return result;
  }
  /**
   * 标签是否存在
   */
  async getLabelByName(name) {
    const statement = `select * from labels where name=?`;
    const [result] = await connection.execute(statement, [name]);
    return result[0];
  }
  /**
   * 获取所有标签
   */
  async getLabelsList(limit, offset) {
    const statement = `select * from labels limit ? offset ?`;
    const [result] = await connection.execute(statement, [limit, offset]);
    return result;
  }
}

module.exports = new LabelService();