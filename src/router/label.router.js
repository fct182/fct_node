const express = require("express");
const { create, getLabels } = require("../controller/label.controller");
const { verifyAuth } = require("../middleware/user.middleware");

const router = express.Router();

/**
 * 创建标签接口
 */
router.post("/", verifyAuth, create);

/**
 * 获取所有标签接口(limit、offset)
 */
router.get("/", getLabels);

module.exports = router;