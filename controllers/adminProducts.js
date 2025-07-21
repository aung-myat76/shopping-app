const { validationResult } = require("express-validator");

const Product = require("../models/Product");
const { deleteFile } = require("../ultil/file");

const PRODUCT_PER_PAGE = 2;

exports.getAddProduct = (req, res, next) => {
    res.render("admin/add-product", { path: "/admin/add-product" });
};

exports.getProducts = (req, res, next) => {
    // Product.find({ userId: req.session.user._id })
    //     .then((products) => {
    //         res.render("admin/products", {
    //             products: products,
    //             path: "/admin/products",
    //             isLoggedIn: req.session.isLoggedIn,
    //         });
    //     })
    const page = +req.query.page || 1;

    Product.find({ userId: req.session.user._id })
        .countDocuments()
        .then((pages) => {
            return Product.find({ userId: req.session.user._id })
                .skip((page - 1) * PRODUCT_PER_PAGE)
                .limit(PRODUCT_PER_PAGE)
                .then((products) => {
                    res.render("admin/products", {
                        products: products,
                        path: "/admin/products",
                        isLoggedIn: req.session.isLoggedIn,
                        currentPage: page,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(pages / PRODUCT_PER_PAGE),
                        hasNextPage: pages > page * PRODUCT_PER_PAGE,
                        hasPreviousPage: page !== 1,
                    });
                });
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

exports.postAddProduct = (req, res, next) => {
    const { title, image, price, description } = req.body;

    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        req.flash("error_msg", errors.array()[0].msg);
        return res.redirect("/admin/add-product");
    }

    const imageUrl = req.file;

    console.log(imageUrl);

    const product = new Product({
        title,
        image: imageUrl.path,
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
    const { productId, image, title, price, description } = req.body;

    let imageUrl = req.file || {};

    if (!req.file) {
        imageUrl.path = image;
    } else {
        deleteFile(image);
    }

    console.log(imageUrl);

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
                (product.image = imageUrl.path ? imageUrl.path : product.image),
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

    Product.findByIdAndDelete(productId).then((product) => {
        deleteFile(product.image);
        res.redirect("/admin/products");
    });
};
