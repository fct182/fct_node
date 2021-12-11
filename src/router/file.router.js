const express = require('express');

const { saveAvatarInfo, savePictureInfo } = require("../controller/file.controller");
const { verifyPermission } = require('../middleware/auth.middleware');
const { avatarHandle, verifyAvatar, updateUserAvatar, picturesHandle, pictureResize } = require('../middleware/file.middleware');
const { verifyAuth } = require('../middleware/user.middleware');

const router = express.Router();

/**
 * 上传用户头像
 */
router.post("/avatar", verifyAuth, avatarHandle, verifyAvatar, updateUserAvatar, saveAvatarInfo);

/**
 * 上传用户发表动态的配图
 */
router.post("/pictures/:momentId", verifyAuth, verifyPermission, picturesHandle, pictureResize, savePictureInfo);

module.exports = router;