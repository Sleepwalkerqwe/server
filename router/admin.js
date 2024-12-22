const Router = require("express").Router;
const adminMiddleware = require("../middlewares/admin-middleware.js");
const User = require("../models/user-model.js");
const Notification = require("../models/notification-model.js");

const router = new Router();

// Получение списка всех пользователей
router.get("/users", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Удаление пользователя
router.delete("/users/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Получение всех напоминаний
router.get("/notifications", adminMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (e) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// Удаление напоминания
router.delete("/notifications/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.json({ message: "Notification deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Error deleting notification" });
  }
});

module.exports = router;
