module.exports = function (req, res, next) {
  try {
    const userRole = req.user.role; // Предполагается, что токен содержит роль пользователя
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized", error: e.message });
  }
};
1;
