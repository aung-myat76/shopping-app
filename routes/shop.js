const path = require("path");

const express = require("express");

const router = express.Router();

const { root } = require("../ultil/path");

const userProductsControllers = require("../controllers/userProducts");
const isAuth = require("../middles/isAuth");

router.get("/", userProductsControllers.getProducts);

router.get("/cart", isAuth, userProductsControllers.getCart);

router.post("/add-cart", isAuth, userProductsControllers.postAddCart);

router.get("/order", isAuth, userProductsControllers.getOrder);

router.post("/add-order", isAuth, userProductsControllers.postOrder);

router.post("/delete-cart", isAuth, userProductsControllers.postDeleteCart);

router.get("/products/:productId", userProductsControllers.getProductDetail);

module.exports = router;
