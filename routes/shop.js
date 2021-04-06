const path = require("path");
const { products } = require("./admin");
const rootDir = require("../utils/getPath");
const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("The products :", products);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
  //....
});

module.exports = router;
