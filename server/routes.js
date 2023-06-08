const router = require("express").Router();
const authController = require("./controllers/authController");
const productController = require("./controllers/productController");
const userController = require("./controllers/userController");
const messageController = require("./controllers/messageController");
const isAuth = require("./middlewares/isAuth");

router.get("/", (req, res) => {
  res.send("Server is running");
});

router.use("/auth", authController);

// 카테고리에 사용되는 products를 productController 에서 가지고옵니다.
router.use("/products", productController);
router.use("/user", userController);
router.use("/messages", messageController);

module.exports = router;
