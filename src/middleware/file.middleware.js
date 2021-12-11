const multer = require('multer');
const { getAvatarByUserId, deleteAvatar } = require("../service/file.service");
const fs = require('fs');
const jimp = require('jimp');
const path = require('path');

// 配置 multer
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "./uploads/avatar");
//   },
//   filename(req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
//   }
// })
// const avatarUpload = multer({ storage });
const avatarUpload = multer({ dest: './uploads/avatar' });
/**
 * 处理上传的单个文件
 */
const avatarHandle = avatarUpload.single("avatar");

const picturesUpload = multer({ dest: './uploads/pictures' });
/**
 * 处理上传的多个文件
 */
const picturesHandle = picturesUpload.array("picture", 9);

/**
 * 验证用户是否已经有头像
 */
async function verifyAvatar(req, res, next) {
  const { id } = req.user;
  // 查询当前用户是否无头像
  const result = await getAvatarByUserId(id);
  // 已经有头像则 flag 为 false。反之
  req.avatarFlag = result ? false : true;
  // 记录旧头像文件名
  req.oldAvatar = result.filename;
  await next();
}

/**
 * 更新用户头像
 */
async function updateUserAvatar(req, res, next) {
  if (!req.avatarFlag) {// 当前用户是更新头像
    // 1. 删除当前已在数据库存储的头像信息
    const result = await deleteAvatar(req.user.id);
    // 2. 删除本地文件
    fs.unlink(`./uploads/avatar/${req.oldAvatar}`, (err) => {
      if (err) throw err;
      console.log(`./uploads/avatar/${req.oldAvatar} was deleted`);
    });
    if (result.affectedRows) {
      await next();
    } else {
      return next(new Error("删除用户旧头像失败！"));
    }
  } else {  // 当前用户是第一次上传头像
    await next();
  }
}

/**
 * 图片大小尺寸的处理
 */
async function pictureResize(req, res, next) {
  // 1. 获取图片信息
  const { files } = req;
  // 对图像处理( jimp 库)
  for (let file of files) {
    const destPath = path.join(file.destination, file.filename);
    // const image = await jimp.read(file.path);
    jimp.read(file.path).then(img => {
      img.resize(1280, jimp.AUTO).write(`${destPath}-1280`);
      img.resize(640, jimp.AUTO).write(`${destPath}-640`);
      img.resize(320, jimp.AUTO).write(`${destPath}-320`);
    });
  }
  await next();
}
module.exports = {
  avatarHandle,
  verifyAvatar,
  updateUserAvatar,
  picturesHandle,
  pictureResize
};
