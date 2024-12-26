const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");

const adminRouter = require("./admin");
router.use("/admin", adminRouter);

router.get("/health/data", userController.getMyHealthData);

router.post("/health/data", userController.addMyHealthData);

router.post("/registration", body("email").isEmail(), body("password").isLength({ min: 3, max: 32 }), userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", userController.getUsers);

router.get("/", (req, res) => {
  res.send("Hello world from api");
});

router.get("/data", async (req, res) => {
  console.log("ACHTUNG");
  res.send("Hello world");
});

router.post("/data", async (req, res) => {
  try {
    const { temperature, steps, heartRate } = req.body;
    const data = new SensorData({
      temperature,
      steps,
      heartRate,
      timestamp: new Date(),
    });
    console.log("ACHTUNG");

    await data.save();
    res.status(201).send("Данные успешно сохранены");
  } catch (err) {
    res.status(500).send("Ошибка сервера: " + err.message);
  }
});
module.exports = router;
