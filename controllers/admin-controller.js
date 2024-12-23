const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const Notification = require("../models/notification-model.js");

class AdminController {
  async getUsers(req, res, next) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async createNotification(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Помилка при валідації", errors.array()));
      }

      const { email, password, role } = req.body;
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.json({ message: "User deleted successfully" });
    } catch (e) {
      next(e);
    }
  }

  async getNotification(req, res, next) {
    try {
      const notifications = await Notification.find();
      res.json(notifications);
    } catch (e) {
      next(e);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const { id } = req.params;
      await Notification.findByIdAndDelete(id);
      res.json({ message: "Notification deleted successfully" });
    } catch (e) {
      res.status(500).json({ message: "Error deleting notification" });
    }
  }

  async getUserHelthData(req, res, next) {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    // Пример данных
    const data = {
      userId,
      pulse: 70,
      activityLevel: 3,
      stressLevel: 2,
      sleepHours: 7,
    };
    res.status(200).json(data);
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async addUserHealthData(req, res, next) {
    try {
      const { userId, pulse, activityLevel, stressLevel, sleepHours } = req.body;
      if (!userId || !pulse || !activityLevel || !stressLevel || !sleepHours) {
        return res.status(400).json({ error: "Invalid input data" });
      }
      // Пример обработки данных
      res.status(201).json({ message: "Data successfully added" });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AdminController();
