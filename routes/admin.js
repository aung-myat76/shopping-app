const path = require("path");

const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const adminProductControllers = require("../controllers/adminProducts");
const isAuth = require("../middles/isAuth");

router.get("/products", isAuth, adminProductControllers.getProducts);

router.get("/add-product", isAuth, adminProductControllers.getAddProduct);

router.post(
    "/add-product",
    [
        body("title")
            .not()
            .isEmpty()
            .withMessage("Product name cannot be ommited"),
        body("price").isNumeric().withMessage("You need to add price"),
        body("description")
            .isLength({ min: 5, max: 200 })
            .withMessage(
                "You have to describe your product in at least 5 characters"
            ),
    ],
    isAuth,
    adminProductControllers.postAddProduct
);

router.get("/edit-product", isAuth, adminProductControllers.getEditProduct);

router.post(
    "/edit-product",
    [
        body("title")
            .not()
            .isEmpty()
            .withMessage("Product name cannot be ommited"),
        body("price").isNumeric().withMessage("You need to add price"),
        body("description")
            .isLength({ min: 5, max: 200 })
            .withMessage(
                "You have to describe your product in at least 5 characters"
            ),
    ],
    isAuth,
    adminProductControllers.postEditProduct
);

router.delete(
    "/products/:productId",
    isAuth,
    adminProductControllers.deleteProduct
);

module.exports = router;
