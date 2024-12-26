const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const Notification = require("../models/notification-model.js");
const User = require("../models/user-model.js");
const Data = require("../models/Data.js");
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

  async addNotification(req, res, next) {
    try {
      const { userId, type, message, dueDate } = req.body;
      const userExists = await User.findById(userId);
      if (!userExists) {
        console.log(userId);
        return res.status(404).json({ error: "User not found." });
      }
      console.log(userId);

      const notification = new Notification({
        userId,
        type,
        message,
        dueDate,
      });
      await notification.save();
      res.status(201).json({ message: "Notification created successfully.", notification });
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
    const userDataExists = await Data.find({ userId });
    const finallData = [];

    if (userDataExists) {
      for (let i = 0; i < userDataExists.length; i++) {
        // Пример данных
        const data = {
          userId,
          temperature: userDataExists[i].temperature,
          heartRate: userDataExists[i].heartRate,
          steps: userDataExists[i].steps,
          createdAt: userDataExists[i].createdAt,
        };
        finallData.push(data);
      }
      res.status(200).json(finallData);
    } else {
      console.log("No data found for the given user ID.");
    }
  }

  async getAverageHealthData(req, res, next) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const userDataExists = await Data.find({ userId });
      let sumTemp = 0;
      let sumPulse = 0;
      let sumSteps = 0;

      if (userDataExists) {
        for (let i = 0; i < userDataExists.length; i++) {
          sumTemp += userDataExists[i].temperature;
          sumPulse += userDataExists[i].heartRate;
          sumSteps += userDataExists[i].steps;
        }
        const { email } = await User.findById(userId);

        const data = {
          messageTemp: `Average temperature for user with ID - ${userId} is ${sumTemp / userDataExists.length} `,
          messageHeartRate: `Average pulse for user with ID - ${userId} is ${sumPulse / userDataExists.length} `,
          messageSteps: `Average pulse for user with ID - ${userId} is ${sumSteps / userDataExists.length} `,
          userEmail: email,
        };
        res.status(200).json(data);
      } else {
        console.log("No data found for the given user ID.");
      }
    } catch (e) {
      next(e);
    }
  }

  async getAverageTemperature(req, res, next) {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const userDataExists = await Data.find({ userId });
    let sum = 0;
    if (userDataExists) {
      for (let i = 0; i < userDataExists.length; i++) {
        sum += userDataExists[i].temperature;
      }
      const { email } = await User.findById(userId);

      const data = {
        message: `Average temperature for user with ID - ${userId} is ${sum / userDataExists.length} `,
        userEmail: email,
      };
      res.status(200).json(data);
    } else {
      console.log("No data found for the given user ID.");
    }
  }

  async getAverageHeartRate(req, res, next) {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const userDataExists = await Data.find({ userId });
    let sum = 0;
    if (userDataExists) {
      for (let i = 0; i < userDataExists.length; i++) {
        sum += userDataExists[i].heartRate;
      }
      const { email } = await User.findById(userId);

      const data = {
        message: `Average pulse for user with ID - ${userId} is ${sum / userDataExists.length} `,
        userEmail: email,
      };
      res.status(200).json(data);
    } else {
      console.log("No data found for the given user ID.");
    }
  }

  async getAverageSteps(req, res, next) {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const userDataExists = await Data.find({ userId });
    let sum = 0;
    if (userDataExists) {
      for (let i = 0; i < userDataExists.length; i++) {
        sum += userDataExists[i].steps;
      }
      const { email } = await User.findById(userId);

      const data = {
        message: `Average steps for user with ID - ${userId} is ${sum / userDataExists.length} `,
        userEmail: email,
      };
      res.status(200).json(data);
    } else {
      console.log("No data found for the given user ID.");
    }
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
