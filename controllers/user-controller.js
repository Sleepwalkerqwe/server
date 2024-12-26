const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }
      const { email, password, role } = req.body;

      const userData = await userService.registration(email, password, role);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("accessToken", userData.accessToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
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

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getMyHealthData(req, res, next) {
    try {
      const accessToken = req.cookies.accessToken; // Retrieving the token from cookies

      const userData = tokenService.validateAccessToken(accessToken); // Validate the token
      const userId = userData.id;
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
    } catch (e) {
      next(e);
    }
  }

  async addMyHealthData(req, res, next) {
    try {
      const accessToken = req.cookies.accessToken; // Retrieving the token from cookies
      const userData = tokenService.validateAccessToken(accessToken); // Validate the token
      const userId = userData.id;
      const { pulse, activityLevel, stressLevel, sleepHours } = req.body;
      if (!userId || !pulse || !activityLevel || !stressLevel || !sleepHours) {
        return res.status(400).json({ error: "Invalid input data" });
      }
      // Example of data processing
      res.status(201).json({ message: "Data successfully added" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
