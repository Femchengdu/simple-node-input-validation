const mongodb = require("mongodb");
const { getMongoDbClient } = require("../utils/database");

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this._id = id ? new mongodb.ObjectID(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getMongoDbClient();
    let dbOperation;
    if (this._id) {
      dbOperation = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOperation = db.collection("products").insertOne(this);
    }
    return dbOperation
      .then((result) => {})
      .catch((error) => console.log(error));
  }

  static fetchAll() {
    const db = getMongoDbClient();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((error) => console.log(error));
  }

  static findById(productId) {
    const db = getMongoDbClient();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectID(productId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((error) => console.log(error));
  }

  static deleteById(productId) {
    const db = getMongoDbClient();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectID(productId) })
      .then((product) => {})
      .catch((error) => console.log(error));
  }
}
module.exports = Product;
