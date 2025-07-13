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
    // Instead of req.session.user.populate(), find user by ID first
    User.findById(req.session.user._id)
        .populate("cart.products.productId") // populate product details in cart
        .then((user) => {
            if (!user) {
                // handle no user found if needed
                return res.redirect("/");
            }
            const cartProducts = user.cart.products;
            res.render("shop/cart", {
                path: "/cart",
                products: cartProducts,
                totalPrice: user.cart.totalPrice,
                isLoggedIn: req.session.isLoggedIn,
            });
        })
        .catch((err) => next(err));
};

exports.postAddCart = (req, res, next) => {
    const { productId } = req.body;

    Product.findById(productId).then((product) => {
        // console.log(req.session.user);
        // req.session.user
        //     .addToCart(product._id, product.price)

        return User.findById(req.session.user._id)
            .then((user) => {
                if (!user) return res.redirect("/login");

                // Now you have full mongoose user doc, call instance method
                return user.addToCart(productId, product.price);
            })
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
    User.findById(req.session.user._id)
        .then((user) => {
            if (!user) {
                res.redirect("/login");
            }

            user.deleteById(productId).then(() => {
                res.redirect("/cart");
            });
        })
        .catch((err) => {
            console.log(err);
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
    User.findById(req.session.user._id)
        .populate("cart.products.productId")
        .then((user) => {
            if (!user) {
                return res.redirect("/login");
            }

            const cartProducts = user.cart.products;
            const products = cartProducts.map((p) => {
                return { product: p.productId._doc, qty: p.qty };
            });

            const order = new Order({
                products: products,
                user: {
                    email: user.email, // or user.name if you have it
                    userId: user._id,
                },
            });

            return order.save().then(() => user.clearCart());
        })
        .then(() => {
            res.redirect("/order");
        })
        .catch((err) => next(err));
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
