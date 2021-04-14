const fs = require("fs");
const pathName = require("../utils/getPath");
const path = require("path");
const dataPath = path.join(pathName, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(dataPath, (error, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!error) {
        cart = JSON.parse(fileContent);
      }
      // Find the product index
      const existingIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      // Get the existing product
      const existingProduct = cart.products[existingIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products[existingIndex] = updatedProduct;
      } else {
        updatedProduct = {
          id,
          qty: 1,
        };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(dataPath, JSON.stringify(cart), (error) => {
        console.log("File write error :", error);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(dataPath, (error, fileContent) => {
      if (error) {
        console.log("delete cart item error :", error);
        return;
      } else {
        const updatedCart = JSON.parse(fileContent);
        let toUpdateCartProducts = [...updatedCart.products];
        const product = toUpdateCartProducts.find(
          (product) => product.id === id
        );
        // if product
        if (product) {
          const productQuantity = product.qty;
          toUpdateCartProducts = toUpdateCartProducts.filter(
            (product) => product.id !== id
          );
          updatedCart.products = toUpdateCartProducts;

          updatedCart.totalPrice =
            updatedCart.totalPrice - productPrice * productQuantity;
          fs.writeFile(dataPath, JSON.stringify(updatedCart), (error) => {
            console.log("cart update error :", error);
          });
        }
      }
    });
  }

  static getCart(cb) {
    fs.readFile(dataPath, (error, fileContent) => {
      if (error) {
        cb(null);
      } else {
        const cart = JSON.parse(fileContent);
        cb(cart);
      }
    });
  }
};
