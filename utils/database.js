const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "rDev", "example2", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
