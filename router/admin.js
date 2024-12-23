const Router = require("express").Router;
const adminMiddleware = require("../middlewares/admin-middleware.js");
const adminController = require("../controllers/admin-controller.js");

const Admin = require("../models/user-model.js");

const router = new Router();

// Получение списка всех пользователей
router.get("/users", adminMiddleware, adminController.getUsers);

//
router.post("/create/notification", adminController.createNotification);

// Удаление пользователя
router.delete("/users/:id", adminController.deleteUser);

// Получение всех напоминаний
router.get("/notifications", adminController.getNotification);

// Удаление напоминания
router.delete("/notifications/:id", adminController.deleteNotification);

router.get("/health/data", adminController.getUserHelthData);

router.post("/health/data", adminController.addUserHealthData);

router.get("/refresh", adminController.refresh);
module.exports = router;
