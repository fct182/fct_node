const { createLabel, getLabelsList } = require("../service/label.service");


class LabelController {
  /**
   * 创建标签
   */
  async create(req, res, next) {
    const { labelName } = req.body;
    const result = await createLabel(labelName);
    if (result.affectedRows) {
      res.send({
        status: 200,
        message: "创建标签成功！"
      });
    } else {
      return next(new Error("创建标签失败！"))
    }
  }
  /**
   * 获取所有标签
   */
  async getLabels(req, res, next) {
    const { limit, offset } = req.query;
    const result = await getLabelsList(limit, offset);
    res.send(result);
  }
}

module.exports = new LabelController();