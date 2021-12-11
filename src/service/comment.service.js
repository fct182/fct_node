const connection = require("../app/database");

class CommentService {
  /**
   * 发表评论
   */
  async createComment(mid, content, userId, cid) {
    const statement = `insert into comments (content,moment_id,user_id,comment_id) values(?,?,?,?)`;
    const [result] = await connection.execute(statement, [content, mid, userId, cid]);
    return result;
  }

  /**
   * 删除评论
   */
  async deleteComm(commentId) {
    const statement = `delete from comments where id = ?`;
    const [result] = await connection.execute(statement, [commentId]);
    return result;
  }

  /**
   * 获取评论列表
   */
  async commentList(id) {
    const statement = `select 
      c.id,content,c.moment_id,c.comment_id,c.createAt,u.id userId,u.name userName,u.avatarUrl
    from comments c
    left JOIN users u on u.id=c.user_id
    where c.moment_id = ?;`;
    const [result] = await connection.execute(statement, [id]);
    return result;
  }
}

module.exports = new CommentService();