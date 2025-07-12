const fs = require("fs");
const path = require("path");
const { root } = require("../ultil/path");

const Product = require("./Product");

const p = path.join(root, "data", "cart.json");

const getCartFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (!err && fileContent.length > 0) {
            cb(JSON.parse(fileContent));
        } else {
            cb({ products: [], totalPrice: 0 });
        }
    });
};

module.exports = class Cart {
    static addCart(id, price) {
        // fetch prev cart
        getCartFromFile((prevCart) => {
            const existingProductIndex = prevCart.products.findIndex(
                (p) => p.id === id
            );
            const existingProduct = prevCart.products[existingProductIndex];

            const updatedCart = { ...prevCart };

            if (!existingProduct) {
                console.log("not same");
                const updatedProduct = { id: id, qty: 1 };
                updatedCart.products.push(updatedProduct);
            } else {
                console.log("same");
                const updatedProduct = { ...existingProduct };
                updatedProduct.qty += 1;
                updatedCart.products[existingProductIndex] = updatedProduct;
            }

            updatedCart.totalPrice += +price;
            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteById(id, productPrice) {
        getCartFromFile((prevCart) => {
            const updatedCart = { ...prevCart };

            // const product = products.find((p) => p.id === id);
            const cart = updatedCart.products.find((p) => p.id === id);

            updatedCart.totalPrice =
                updatedCart.totalPrice - +productPrice * cart.qty;

            updatedCart.products = updatedCart.products.filter(
                (p) => p.id !== id
            );

            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAllCart(cb) {
        getCartFromFile((cart) => cb(cart));
    }
};
