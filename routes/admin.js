const path = require("path");

const express = require("express");

const router = express.Router();

const adminProductControllers = require("../controllers/adminProducts");
const isAuth = require("../middles/isAuth");

router.get("/products", isAuth, adminProductControllers.getProducts);

router.get("/add-product", isAuth, adminProductControllers.getAddProduct);

router.post("/add-product", isAuth, adminProductControllers.postAddProduct);

router.get("/edit-product", isAuth, adminProductControllers.getEditProduct);

router.post("/edit-product", isAuth, adminProductControllers.postEditProduct);

router.post(
    "/delete-product",
    isAuth,
    adminProductControllers.postDeleteProduct
);

module.exports = router;
