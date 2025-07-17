const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model("Product", productSchema);

// const fs = require("fs");
// const path = require("path");

// const { ObjectId } = require("mongodb");

// const { root } = require("../ultil/path");

// const Cart = require("./Cart");

// const { getDb } = require("../ultil/database");
// const { get } = require("../routes/admin");

// const p = path.join(root, "data", "products.json");

// const getProductsFromFile = (cb) => {
//     fs.readFile(p, (err, fileContent) => {
//         if (!err && fileContent.length > 0) {
//             cb(JSON.parse(fileContent));
//         } else {
//             cb([]);
//         }
//     });
// };

// class Product {
//     constructor(title, price, description, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this._id = id ? new ObjectId(id) : null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         let dbOp;
//         if (this._id) {
//             dbOp = db
//                 .collection("products")
//                 .updateOne({ _id: new ObjectId(this._id) }, { $set: this });
//         } else {
//             dbOp = db.collection("products").insertOne(this);
//         }

//         return dbOp
//             .then((result) => {
//                 console.log(result);
//             })
//             .catch((err) => {
//                 console.log(err);
//                 throw err;
//             });
//     }

//     // save() {
//     //     getProductsFromFile((products) => {
//     //         if (!this.id) {
//     //             this.id = Math.random().toString();
//     //             products.push(this);
//     //             fs.writeFile(p, JSON.stringify(products), (err) => {
//     //                 console.log(err);
//     //             });
//     //             return;
//     //         } else {
//     //             const existingProductIndex = products.findIndex(
//     //                 (p) => p.id === this.id
//     //             );
//     //             products[existingProductIndex] = this;
//     //             fs.writeFile(p, JSON.stringify(products), (err) => {
//     //                 console.log(err);
//     //             });
//     //         }
//     //     });
//     // }

//     static fetchAll() {
//         const db = getDb();
//         return db
//             .collection("products")
//             .find()
//             .toArray()
//             .then((products) => {
//                 console.log(products);
//                 return products;
//             })
//             .catch((err) => {
//                 console.log(err);
//                 throw err;
//             });
//     }

//     static findById(productId) {
//         const db = getDb();
//         return db
//             .collection("products")
//             .find({ _id: new ObjectId(productId) })
//             .next()
//             .then((product) => {
//                 return product;
//             })
//             .catch((err) => {
//                 console.log(err);
//                 throw err;
//             });
//     }

//     static deleteById(id) {
//         const db = getDb();

//         return db
//             .collection("products")
//             .deleteOne({ _id: new ObjectId(id) })
//             .then(() => {
//                 console.log("Deleted Successfully!");
//             })
//             .catch((err) => {
//                 console.log(err);
//                 throw err;
//             });
//         // getProductsFromFile((products) => {
//         //     const product = products.find((p) => p.id === id);
//         //     const updatedProducts = products.filter((p) => p.id !== id);
//         //     Cart.deleteById(id, product.price);

//         //     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//         //         console.log(err);
//         //     });
//         // });
//     }
// }

// module.exports = Product;
