const { createComment, deleteComm, commentList } = require("../service/comment.service");

// 评论操作接口处理
class CommentController {
  /**
   * 发表评论
   */
  async create(req, res, next) {
    // 1. 获取（userid,content,momentid,commentid）
    const { id } = req.user;
    // (commentId有值则意味是发表回复评论)
    const { momentId, content, commentId = null } = req.body;
    // 2. 插入到数据库中
    const result = await createComment(momentId, content, id, commentId);
    if (result.affectedRows) {
      res.send({
        status: 200,
        message: "发表评论成功！"
      });
    } else {
      res.send({
        status: 400,
        message: "发表评论失败！"
      });
    }
  }

  /**
   * 删除评论
   */
  async deleteComment(req, res, next) {
    const { commentId } = req.params;
    const result = await deleteComm(commentId);
    if (result.affectedRows) {
      res.send({
        status: 200,
        message: "删除评论成功！"
      });
    } else {
      res.send({
        status: 400,
        message: "删除评论失败！"
      });
    }
  }

  /**
   * 获取某个动态的评论列表
   */
  async list(req, res, next) {
    const { momentId } = req.query;
    if (!momentId) {
      return next(new Error("查询评论缺少参数momentId"));
    }
    const result = await commentList(momentId);
    res.send(result);
  }
}

module.exports = new CommentController();