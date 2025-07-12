const Product = require("../models/Product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/add-product", { path: "/admin/add-product" });
};

exports.getProducts = (req, res, next) => {
    Product.find()
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
    Product.findByIdAndDelete(productId).then(() => {
        res.redirect("/admin/products");
    });
};
