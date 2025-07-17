const { validationResult } = require("express-validator");

const Product = require("../models/Product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/add-product", { path: "/admin/add-product" });
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.session.user._id })
        .then((products) => {
            res.render("admin/products", {
                products: products,
                path: "/admin/products",
                isLoggedIn: req.session.isLoggedIn,
            });
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

exports.postAddProduct = (req, res, next) => {
    const { title, price, description } = req.body;

    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        req.flash("error_msg", errors.array()[0].msg);
        return res.redirect("/admin/add-product");
    }

    const product = new Product({
        title,
        price,
        description,
        userId: req.session.user,
    });
    product
        .save()
        .then((result) => {
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

exports.getEditProduct = (req, res, next) => {
    const { productId } = req.query;

    Product.findById(productId)
        .then((product) => {
            res.render("admin/edit-product", {
                path: "edit-product",
                product: product,
                isLoggedIn: req.session.isLoggedIn,
            });
        })
        .catch((err) => {
            throw err;
        });
};

exports.postEditProduct = (req, res, next) => {
    const { productId, title, price, description } = req.body;

    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        req.flash("error_msg", errors.array()[0].msg);
        return res.render("admin/edit-product", {
            path: "edit-product",
            product: req.body,
            error_msg: errors.array()[0].msg,
            isLoggedIn: req.session.isLoggedIn,
        });
    }

    Product.findById(productId)
        .then((product) => {
            (product.title = title),
                (product.price = price),
                (product.description = description);

            return product.save();
        })
        .then((result) => {
            console.log("Updated Successfully!");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            throw err;
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    if (confirm("Are you sure to delete this product?")) {
        Product.findByIdAndDelete(productId).then(() => {
            res.redirect("/admin/products");
        });
    }
};
