const { createAvatar, createPictures } = require("../service/file.service");
const { updateAvatar } = require("../service/user.service");
const { APP_PORT, APP_HOST } = require("../app/config");

class FileController {
  /**
   * 保存用户头像信息
   */
  async saveAvatarInfo(req, res, next) {
    // 1. 获取图像的相关信息
    const { mimetype, filename, size } = req.file;
    const { id } = req.user;
    // 2. 将图像信息存储到数据库中
    const result = await createAvatar(filename, mimetype, size, id);
    // 3. 将图片地址保存到users表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    const result1 = await updateAvatar(id, avatarUrl);

    // 4. 返回客户端信息
    if (result.affectedRows && result1.affectedRows) {
      res.send({
        status: 200,
        message: "上传用户头像成功！"
      });
    } else {
      return next(new Error("上传用户头像失败！"))
    }
  }

  /**
   * 保存用户发表动态的图片信息
   */
  async savePictureInfo(req, res, next) {
    // 1. 获取图片信息
    const { files } = req;
    const { id } = req.user;
    const { momentId } = req.params;
    // 2. 将数据保存在数据库中
    for (let file of files) {
      const { mimetype, filename, size } = file;
      await createPictures(filename, mimetype, size, momentId, id);
    }
    // 3. 动态配图上传完成
    res.send({
      status: 200,
      message: "动态配图上传完成"
    });
  }
}

module.exports = new FileController();