const connection = require("../app/database");

const { APP_HOST, APP_PORT } = require("../app/config");

class MomentsService {
  // 插入动态到数据库
  async publicMoments(userId, content) {
    const statement = `insert into moments (content,user_id) values(?,?)`;
    const [result] = await connection.execute(statement, [content, userId]);
    return result;
  }

  // 查询单个动态内容
  async queryMomentById(id) {
    const statement = `select 
      m.id,m.content,m.createAt as createTime,m.updateAt as updateTime,u.id as authorId,u.name as authorName,u.avatarUrl 
    from moments m
    left join users u on m.user_id = u.id
    where m.id = ?`;
    const [result] = await connection.execute(statement, [id]);
    // 获取当前动态的配图信息
    const statement1 = `select filename from file where moment_id = ?`;
    const [pics] = await connection.execute(statement1, [id]);
    const mPics = [];
    for (let file of pics) {
      mPics.push(`${APP_HOST}:${APP_PORT}/moments/images/${file.filename}`);
    }
    result[0].pics = mPics;
    return result[0];
  }

  // 查询动态列表
  async queryMoments(size, offset) {
    const statement = `select 
      m.id,m.content,m.createAt as createTime,m.updateAt as updateTime,u.id as authorId,u.name as authorName,
      (select count(*) from comments c where c.moment_id = m.id) commentCount,
      (select count(*) from moment_label ml where ml.moment_id = m.id) labelCount 
    from moments m
    left join users u on m.user_id = u.id
    limit ? offset ?`;
    const [result] = await connection.execute(statement, [size, offset]);
    // 添加动态的配图信息
    for (let moment of result) {
      const statement1 = `select filename from file where moment_id = ?`;
      const [pics] = await connection.execute(statement1, [moment.id]);
      const mPics = [];
      for (let file of pics) {
        mPics.push(`${APP_HOST}:${APP_PORT}/moments/images/${file.filename}`);
      }
      moment.pics = mPics;
    }
    return result;
  }

  // 修改动态
  async update(content, momentId) {
    const statement = `update moments set content = ? where id = ?`;
    const [result] = await connection.execute(statement, [content, momentId]);
    return result;
  }

  // 删除动态
  async deleteMome(momentId) {
    const statement = `delete from moments where id = ?`;
    const [result] = await connection.execute(statement, [momentId]);
    console.log(result);
    return result;
  }

  // 判断当前动态是否有该标签
  async hasLabel(momentId, labelId) {
    const statement = `select * from moment_label where moment_id = ? and label_id = ?`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    // console.log(result[0]); //undefined or Object
    return result[0] ? true : false;
  }

  // 为动态添加标签
  async addLabel(momentId, labelId) {
    const statement = `insert into moment_label (moment_id,label_id) values(?,?)`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }

  // 获取某条动态的所有标签
  async getList(id) {
    const statement = `SELECT 
      m.label_id,l.name
    from moment_label m
    LEFT JOIN labels l on l.id = m.label_id
    WHERE m.moment_id = 1;`;
    const [result] = await connection.execute(statement, [id]);
    return result;
  }

  // 获取图片文件
  async getPicFile(filename) {
    const statement = `select * from file where filename = ?`;
    const [result] = await connection.execute(statement, [filename]);
    return result[0];
  }
}

module.exports = new MomentsService();