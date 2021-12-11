const express = require("express");
const { create, deleteComment, list } = require("../controller/comment.controller");
const { verifyAuth } = require("../middleware/user.middleware");
const { verifyPermission } = require("../middleware/auth.middleware")

const router = express.Router();

/**
 * 发表(回复)评论
 */
router.post("/", verifyAuth, create);

/**
 * 删除评论
 */
router.delete("/:commentId", verifyAuth, verifyPermission, deleteComment);

/**
 * 获取某一个动态的评论列表
 */
router.get("/", list);

module.exports = router;