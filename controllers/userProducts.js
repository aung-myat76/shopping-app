const fs = require("fs");
const path = require("path");

const PDF = require("pdfkit");

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const PRODUCT_PER_PAGE = 4;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;

    Product.find()
        .countDocuments()
        .then((pages) => {
            return Product.find()
                .skip((page - 1) * PRODUCT_PER_PAGE)
                .limit(PRODUCT_PER_PAGE)
                .then((products) => {
                    res.render("shop/products", {
                        products: products,
                        path: "/",
                        isLoggedIn: req.session.isLoggedIn,
                        currentPage: page,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(pages / PRODUCT_PER_PAGE),
                        hasNextPage: pages > page * PRODUCT_PER_PAGE,
                        hasPreviousPage: page !== 1,
                    });
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

            const myanmarDate = new Date().toLocaleString("en-GB", {
                timeZone: "Asia/Yangon", // ✅ Myanmar Timezone
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });

            console.log(myanmarDate);

            console.log(myanmarDate);

            const order = new Order({
                products: products,
                user: {
                    email: user.email, // or user.name if you have it
                    userId: user._id,
                },
                orderDate: myanmarDate,
            });

            return order.save().then(() => user.clearCart());
        })
        .then(() => {
            res.redirect("/order");
        })
        .catch((err) => next(err));
};

exports.getOrderDetail = (req, res, next) => {
    const { orderId } = req.params;

    Order.findById(orderId)
        .then((order) => {
            if (
                order.user.userId.toString() !== req.session.user._id.toString()
            ) {
                console.log("not found");

                return res.send("Not found the invoice pdf");
            }

            // if (!fs.existsSync(invoicePath)) {
            //     return res.status(404).send("Invoice not found.");
            // }

            // fs.readFile(invoicePath, (err, data) => {
            //     res.setHeader("Content-Type", "application/pdf");
            //     res.setHeader(
            //         "Content-Disposition",
            //         "inline; filename=invoice_" + orderId + ".pdf"
            //     );

            //     return res.send(data);
            // });

            const pdf = new PDF({ margin: 50 });

            pdf.pipe(fs.createWriteStream(`invoice_${order._id}.pdf`));
            pdf.pipe(res);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                "inline; filename=invoice_" + orderId + ".pdf"
            );

            pdf.fontSize(22)
                .fillColor("#333")
                .text("INVOICE", { underline: true, align: "center" });

            pdf.moveDown(); // Add some spacing

            pdf.fontSize(14)
                .fillColor("#666")
                .text("Order Summary", { align: "left" });
            pdf.moveDown();

            pdf.text("------------------------------------------");

            let totalPrice = 0;

            // Better formatting for products
            order.products.forEach(({ product, qty }) => {
                const lineTotal = product.price * qty;
                totalPrice += lineTotal;

                pdf.fillColor("#000").fontSize(12).text(
                    `${product.title}  |  $${product.price} x ${qty}  =  $${lineTotal}`,
                    { indent: 20 } // Indent a little
                );
            });

            pdf.text("------------------------------------------");
            pdf.moveDown();

            // Highlight total price
            pdf.fontSize(16)
                .fillColor("#000")
                .text(`Total Price: $${totalPrice}`, {
                    align: "right",
                    underline: true,
                });

            pdf.end();

            //     pdf.fontSize(22).text("Invoice", {
            //         underline: true,
            //     });

            //     pdf.text("------------------------------------------");

            //     let totalPrice = 0;
            //     order.products.forEach(({ product, qty }) => {
            //         totalPrice += product.price * qty;
            //         pdf.text(
            //             `${product.title} - $${product.price} x ${qty} > ${
            //                 product.price * qty
            //             }`
            //         );
            //     });

            //     pdf.fontSize(21).text(totalPrice)
            //     pdf.end();
        })
        .catch((err) => {
            console.log(err);
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
