const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");

const adminRouter = require("./admin");
router.use("/admin", adminRouter);

router.get("/health/data", userController.getMyHealthData);

router.post("/health/data", userController.addMyHealthData);

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
