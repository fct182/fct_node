const { getLabelByName, createLabel } = require("../service/label.service");


/**
 * 验证要添加的标签是否存在
 */
async function verifyLabelExist(req, res, next) {
  // 1. 取出要添加的标签
  const { labels } = req.body;
  const newLabels = []
  for (let name of labels) {
    let labelRes = await getLabelByName(name);
    const label = { name };
    if (!labelRes) {
      // 创建标签数据
      let result = await createLabel(name);
      label.id = result.insertId;
    } else {
      label.id = labelRes.id;
    }
    newLabels.push(label);
  }
  req.labels = newLabels;
  await next();
}


module.exports = {
  verifyLabelExist
};
