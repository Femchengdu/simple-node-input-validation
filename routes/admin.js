const path = require("path");
const express = require("express");

const rootDir = require("../utils/getPath");
const router = express.Router();

// Products data store
const products = [];

router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
  //....
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  const { title } = req.body;
  products.push({ title });
  res.redirect("/");
});
module.exports = { router, products };

//zz
