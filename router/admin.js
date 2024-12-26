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

// Notifications
router.post("/notification", adminController.addNotification);

router.get("/notifications", adminController.getNotification);

router.delete("/notifications/:id", adminController.deleteNotification);

router.get("/health/data", adminController.getUserHelthData);
router.post("/health/data", adminController.addUserHealthData);

router.get("/health/data/average-temperature", adminController.getAverageTemperature);
router.get("/health/data/average-heart-rate", adminController.getAverageHeartRate);
router.get("/health/data/average-steps", adminController.getAverageSteps);

router.get("/health/data/average-healthData", adminController.getAverageHealthData);

//
//
router.get("/refresh", adminController.refresh);

module.exports = router;
