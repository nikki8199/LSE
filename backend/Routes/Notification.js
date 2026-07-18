const express = require("express");

const router = express.Router();

const isUser = require("../MiddleWare/isUser");
const { deleteNotification, markAllRead, markAsRead, getNotifications } = require("../Controller/NotificationContoller");



router.get("/", isUser, getNotifications);

router.patch("/read/:id", isUser, markAsRead);

router.patch("/read-all", isUser, markAllRead);

router.delete("/:id", isUser, deleteNotification);

module.exports = router;