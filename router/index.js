const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");

const adminRouter = require("./admin");
router.use("/admin", adminRouter);

router.get("/health/data", async (req, res) => {
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
});

router.post("/health/data", async (req, res) => {
  const { userId, pulse, activityLevel, stressLevel, sleepHours } = req.body;
  if (!userId || !pulse || !activityLevel || !stressLevel || !sleepHours) {
    return res.status(400).json({ error: "Invalid input data" });
  }
  // Пример обработки данных
  res.status(201).json({ message: "Data successfully added" });
});

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", userController.getUsers);

router.get("/", (req, res) => {
  res.send("Hello world from api");
});

module.exports = router;
