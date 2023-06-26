const router = require("express").Router();
const authController = require("./controllers/authController");
const productController = require("./controllers/productController");
const userController = require("./controllers/userController");
const imageTest = require("./controllers/imageTestController");
const review = require("./controllers/reviewController");
const isAuth = require("./middlewares/isAuth");
const admin = require("./controllers/adminController");
const AiTest = require("./services/AiTest")


router.get("/", (req, res) => {
  res.send("Server is running");
});

router.use('/auth', authController);

// 카테고리에 사용되는 products를 productController 에서 가지고옵니다.
router.use("/products", productController);
router.use("/user", userController);
router.use("/admin",admin);
//router.use("/messages", messageController);
router.use("/imageTest",imageTest);
router.use("/review",review);
router.use("/AiTest", AiTest);
module.exports = router;
