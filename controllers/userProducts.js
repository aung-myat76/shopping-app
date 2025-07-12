const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

exports.getProducts = (req, res, next) => {
    Product.find().then((products) => {
        res.render("shop/products", {
            products: products,
            path: "/",
            isLoggedIn: req.session.isLoggedIn,
        });
    });
};

exports.getCart = (req, res, next) => {
    // fetch cart
    req.session.user.populate("cart.products.productId").then((user) => {
        console.log(user.cart.products);
        cartProducts = user.cart.products;
        res.render("shop/cart", {
            path: "/cart",
            products: cartProducts,
            totalPrice: user.cart.totalPrice,
            isLoggedIn: req.session.isLoggedIn,
        });
    });
};

exports.postAddCart = (req, res, next) => {
    const { productId } = req.body;

    Product.findById(productId).then((product) => {
        req.session.user
            .addToCart(product._id, product.price)
            .then((result) => {
                console.log(result);
                res.redirect("/cart");
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    });

    // Product.findById(productId, (product) => {
    //     Cart.addCart(productId, product.price);
    //     res.redirect("/cart");
    // });
};

exports.postDeleteCart = (req, res, next) => {
    const { productId } = req.body;
    req.session.user.deleteById(productId).then(() => {
        res.redirect("/cart");
    });
};

exports.getOrder = (req, res, next) => {
    Order.find({ "user.userId": req.session.user._id }).then((orders) => {
        res.render("shop/order", {
            path: "/order",
            orders: orders,
            isLoggedIn: req.session.isLoggedIn,
        });
    });
};

exports.postOrder = (req, res, next) => {
    req.session.user
        .populate("cart.products.productId")
        .then((user) => {
            console.log(user.cart.products);
            cartProducts = user.cart.products;
            const products = cartProducts.map((p) => {
                return { product: p.productId._doc, qty: p.qty };
            });
            console.log(products);
            const order = new Order({
                products: products,
                user: {
                    name: req.session.user.name,
                    userId: req.session.user._id,
                },
            });
            return order.save();
        })
        .then(() => {
            return req.session.user.clearCart();
        })
        .then(() => {
            res.redirect("/order");
        })
        .catch((err) => {
            throw err;
        });
};

exports.getProductDetail = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .then((product) => {
            res.render("shop/product-detail", {
                path: "/",
                product: product,
                isLoggedIn: req.session.isLoggedIn,
            });
        })
        .catch((err) => {
            throw err;
        });
};
