const fs = require('fs');
const { publicMoments, queryMomentById, queryMoments, update, deleteMome, hasLabel, addLabel, getList, getPicFile } = require("../service/moments.service");

class MomentsController {
  /**
   * 发表动态
   */
  async create(req, res, next) {
    // 1. 获取信息（user_id，content）
    const userId = req.user.id;
    const content = req.body.content;
    if (!content) {
      req.status = 400;
      return next(new Error("动态内容不能为空！"));
    }

    // 2. 插入动态内容到数据库
    const result = await publicMoments(userId, content);
    if (result.affectedRows) {
      res.send({
        userId,
        message: "发表动态成功！"
      });
    } else {
      req.status = 400;
      return next(new Error("发表动态失败！"));
    }
  }

  /**
   * 查询单个动态内容详情
   */
  async momentDetail(req, res, next) {
    // 1. 获取需要查询动态的id
    const momentId = req.params.momentId;

    // 2. 连接数据库查询数据
    const result = await queryMomentById(momentId);

    // 3. 返回内容
    if (!result) {
      req.status = 404;
      return next(new Error("您要找的文章不在哦。"));
    }
    res.send({
      status: 200,
      result
    });
  }

  /**
   * 查询动态列表
   */
  async momentsList(req, res, next) {
    // 1. 获取参数数据(size,offset)
    const { size = 10, offset = 0 } = req.query;

    // 2. 连接数据库，获取内容
    const result = await queryMoments(size, offset);
    // 返回内容
    res.send(result);
  }

  /**
   * 修改动态
   */
  async updateMoment(req, res, next) {
    const { content } = req.body;
    const { momentId } = req.params;
    const result = await update(content, momentId);
    if (result.affectedRows) {
      res.send({
        status: 200,
        message: "修改动态成功！"
      });
    } else {
      res.send({
        status: 400,
        message: "修改动态失败！"
      });
    }
  }

  /**
   * 删除动态
   */
  async deleteMoment(req, res, next) {
    // 1. 获取 momentId
    const { momentId } = req.params;
    // 2. 连接数据库进行操作
    const result = await deleteMome(momentId);
    if (result.affectedRows) {
      res.send({
        status: 200,
        message: "删除动态成功！"
      });
    } else {
      res.send({
        status: 400,
        message: "删除动态失败！"
      });
    }
  }

  /**
   * 为动态添加标签
   */
  async addLabels(req, res, next) {
    const labels = req.labels;
    let flag = true;
    const { momentId } = req.params;
    for (let i of labels) {
      // 1. 判断原动态是否已经有该标签
      const isHave = await hasLabel(momentId, i.id);
      if (!isHave) {  // 不存在
        // 为动态添加标签
        const result = await addLabel(momentId, i.id);
        if (!result.affectedRows) {
          flag = false;
        }
      }
    }
    if (flag) {
      res.send({ status: 200, message: "为动态添加标签成功！" });
    } else {
      return next(new Error("为动态添加标签失败！"));
    }
  }

  /**
   * 获取某条动态的所有标签
   */
  async getLabelList(req, res, next) {
    const { momentId } = req.params;
    const result = await getList(momentId);
    res.send(result);
  }

  /**
   * 获取动态配图
   */
  async getPicture(req, res, next) {
    const { filename } = req.params;
    const { size } = req.query;
    const result = await getPicFile(filename);
    // 处理需要的图片大小
    const stream = fs.createReadStream(`./uploads/pictures/${result.filename}${size ? `-${size}` : ''}`);
    res.set('Content-Type', result.mimetype);
    stream.pipe(res);
  }
}

module.exports = new MomentsController();