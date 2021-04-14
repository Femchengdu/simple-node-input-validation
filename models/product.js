const fs = require("fs");
const path = require("path");
const pathName = require("../utils/getPath");
const Cart = require("./cart");
// Helper function
const dataPath = path.join(pathName, "data", "products.json");

const getproductsFromFile = (cb) => {
  fs.readFile(dataPath, (error, fileContent) => {
    if (error) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    (this.id = id), (this.title = title);
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
  }

  save() {
    getproductsFromFile((products) => {
      if (this.id) {
        const existingIndex = products.findIndex(
          (product) => product.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingIndex] = this; // the curren product creaed
        fs.writeFile(dataPath, JSON.stringify(updatedProducts), (err) => {
          console.log("Update products error", err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(dataPath, JSON.stringify(products), (err) => {
          console.log("Save products error", err);
        });
      }
    });
  }

  static delete(id) {
    console.log("In delete method :", id);
    getproductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      const filteredProducts = products.filter((product) => product.id !== id);
      fs.writeFile(dataPath, JSON.stringify(filteredProducts), (error) => {
        if (!error) {
          Cart.deleteProduct(id, product.price);
        } else {
          console.log("Delete product error :", error);
        }
      });
    });
  }

  static fetchAll(cb) {
    getproductsFromFile(cb);
  }

  static findById(id, cb) {
    getproductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      cb(product);
    });
  }
};
