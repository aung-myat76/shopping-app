const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            product: {
                type: Object,
                required: true,
            },
            qty: {
                type: Number,
                required: true,
            },
        },
    ],

    user: {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        email: {
            type: String,
            required: true,
        },
    },
    orderDate: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Order", orderSchema);

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
