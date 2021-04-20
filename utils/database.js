const mongodb = require("mongodb");

const { MongoClient } = mongodb;

let _mongoDbClient;
const mongoDbConnect = (cb) => {
  MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
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
