const path = require("path");
const express = require("express");

const rootDir = require("../utils/getPath");
const router = express.Router();

// Products data store
const products = [];
/** Render Templates */

// Html template
// router.get("/add-product", (req, res, next) => {
//   res.sendFile(path.join(rootDir, "views", "add-product.html"));
//   //....
// });

router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
  //....
});

/** end Templates */

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  const { title } = req.body;
  products.push({ title });
  res.redirect("/");
});
module.exports = { router, products };

//zz
