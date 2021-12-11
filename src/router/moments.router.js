const express = require("express");
const { verifyAuth } = require("../middleware/user.middleware")
const { create, momentDetail, momentsList, updateMoment, deleteMoment, addLabels, getLabelList, getPicture } = require("../controller/moments.controller");
const { verifyPermission } = require("../middleware/auth.middleware");
const { verifyLabelExist } = require("../middleware/label.middle");

const router = express.Router();

/**
 * 发表动态
 */
router.post("/publish", verifyAuth, create);

/**
 * 获取单个动态的详情
 */
router.get("/:momentId", momentDetail);

/**
 * 获取动态列表
 */
router.get("/", momentsList);

/**
 * 修改动态内容
 */
router.patch("/:momentId", verifyAuth, verifyPermission, updateMoment);

/**
 * 删除动态内容
 */
router.delete("/:momentId", verifyAuth, verifyPermission, deleteMoment);

/**
 * 给动态添加标签
 */
router.post("/:momentId/labels", verifyAuth, verifyPermission, verifyLabelExist, addLabels);

/**
 * 获取某个动态的所有标签
 */
router.get("/:momentId/labelList", getLabelList);

/**
 * 获取动态的配图，?size=(320/640/1280/空)
 */
router.get("/images/:filename", getPicture);

module.exports = router;