const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
  try {
    const accessToken = req.cookies.accessToken; // Извлекаем токен из cookies
    if (!accessToken) {
      console.log(1);
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken); // Валидируем токен

    if (!userData) {
      console.log(accessToken.split(" ")[1]);
      console.log(2);

      return next(ApiError.UnauthorizedError());
    }
    console.log(userData);
    req.user = userData;
    [userRole] = [...req.user.role];

    if (userRole !== "admin") {
      return next(ApiError.PermissionsError());
    }
    console.log(...req.user.role);
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};
