const mongodb = require("mongodb");

const { MongoClient } = mongodb;
const dbUrl =
  "mongodb+srv://rDev:example2@cluster-node-mongo-db.e9wor.mongodb.net/shop?retryWrites=true&w=majority";
let _mongoDbClient;
const mongoDbConnect = (cb) => {
  MongoClient.connect(dbUrl, { useUnifiedTopology: true })
    .then((client) => {
      console.log("Connected to the mongoDb server");
      _mongoDbClient = client.db();
      cb();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const getMongoDbClient = () => {
  if (_mongoDbClient) {
    return _mongoDbClient;
  }
  throw "No database client";
};

module.exports = { mongoDbConnect, getMongoDbClient };
