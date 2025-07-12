const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                qty: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
    },
});

userSchema.methods.addToCart = function (productId, productPrice) {
    // find the product

    const existingProductIndex = this.cart.products.findIndex(
        (p) => p.productId.toString() === productId.toString()
    );

    const updatedCart = {
        products: this.cart.products,
        totalPrice: this.cart.totalPrice,
    };
    console.log(updatedCart);

    const existingProduct = updatedCart.products[existingProductIndex];

    if (existingProductIndex >= 0) {
        existingProduct.qty += 1;
    } else {
        updatedCart.products.push({
            productId: productId,
            price: productPrice,
            qty: 1,
        });
    }
    updatedCart.totalPrice += +productPrice;

    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.deleteById = function (productId) {
    const updatedCartProducts = this.cart.products.filter((p) => {
        return p.productId.toString() !== productId.toString();
    });
    const product = this.cart.products.find(
        (p) => p.productId.toString() === productId.toString()
    );
    let updatedTotalPrice = this.cart.totalPrice;
    updatedTotalPrice -= +product.price * +product.qty;

    this.cart = {
        products: updatedCartProducts,
        totalPrice: updatedTotalPrice,
    };
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = {
        products: [],
        totalPrice: 0,
    };

    return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const { ObjectId } = require("mongodb");
// const { getDb } = require("../ultil/database");

// class User {
//     constructor(username, email, cart, userId) {
//         this.username = username;
//         this.email = email;
//         this.cart = cart;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         return db
//             .collection("users")
//             .insertOne(this)
//             .then((user) => {
//                 return user;
//             })
//             .catch((err) => {
//                 console.log(err);
//                 throw err;
//             });
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db
//             .collection("users")
//             .findOne({ _id: new ObjectId(userId) })
//             .then((user) => {
//                 return user;
//             })
//             .catch((err) => {
//                 console.log(err);
//                 throw err;
//             });
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.products.map((p) => p.productId);

//         return db
//             .collection("products")
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then((products) => {
//                 return {
//                     products: products.map((p) => {
//                         return {
//                             ...p,
//                             qty: this.cart.products.find(
//                                 (cp) =>
//                                     cp.productId.toString() === p._id.toString()
//                             ).qty,
//                         };
//                     }),
//                     totalPrice: this.cart.totalPrice,
//                 };
//             });
//     }

//     addToCart(productId, productPrice) {
//         const db = getDb();
//         // find the product
//         const updatedCart = this.cart
//             ? { ...this.cart }
//             : { products: [], totalPrice: 0 };

//         const existingProductIndex = updatedCart.products.findIndex(
//             (p) => p.productId.toString() === productId.toString()
//         );
//         const existingProduct = updatedCart.products[existingProductIndex];

//         if (existingProductIndex >= 0) {
//             existingProduct.qty += 1;
//         } else {
//             updatedCart.products.push({
//                 productId: new ObjectId(productId),
//                 price: productPrice,
//                 qty: 1,
//             });
//         }
//         updatedCart.totalPrice += +productPrice;

//         console.log(updatedCart);

//         return db
//             .collection("users")
//             .updateOne(
//                 { _id: new ObjectId(this.userId) },
//                 { $set: { cart: updatedCart } }
//             )
//             .then((result) => {
//                 console.log(result);
//                 return result;
//             })
//             .catch((err) => {
//                 throw err;
//             });
//     }

//     deleteById(productId) {
//         const updatedCartProducts = this.cart.products.filter((p) => {
//             return p.productId.toString() !== productId.toString();
//         });
//         const product = this.cart.products.find(
//             (p) => p.productId.toString() === productId.toString()
//         );
//         let updatedTotalPrice = this.cart.totalPrice;
//         updatedTotalPrice -= +product.price * +product.qty;

//         const db = getDb();
//         return db
//             .collection("users")
//             .updateOne(
//                 { _id: new ObjectId(this.userId) },
//                 {
//                     $set: {
//                         cart: {
//                             products: updatedCartProducts,
//                             totalPrice: updatedTotalPrice,
//                         },
//                     },
//                 }
//             )
//             .then((result) => {
//                 console.log(result, updatedCartProducts);
//                 return result;
//             })
//             .catch((err) => {
//                 throw err;
//             });
//     }

//     getOrder() {
//         const db = getDb();
//         return db
//             .collection("orders")
//             .find({ "user.userId": new ObjectId(this.userId) })
//             .toArray();
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then((cart) => {
//                 const order = {
//                     products: cart.products,
//                     user: {
//                         userId: this.userId,
//                         username: this.username,
//                     },
//                 };
//                 return order;
//             })
//             .then((order) => {
//                 return db
//                     .collection("orders")
//                     .insertOne(order)
//                     .then((result) => {
//                         db.collection("users").updateOne(
//                             { _id: new ObjectId(this.userId) },
//                             { $set: { cart: { products: [], totalPrice: 0 } } }
//                         );
//                     });
//             });
//     }
// }

// module.exports = User;
