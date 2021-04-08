const path = require("path");
const { products } = require("./admin");
const rootDir = require("../utils/getPath");
const express = require("express");

const router = express.Router();

/** Render Templates */
// router.get("/", (req, res, next) => {
//   console.log("The products :", products);
//   res.sendFile(path.join(rootDir, "views", "shop.html"));
//   //....
// });

// Pug template
router.get("/", (req, res, next) => {
  res.render("shop", {
    products,
    pageTitle: "My Shop",
    path: "/",
    prodsGTZero: products.length > 0, // hack for handlebars
    activeShop: true, // hack for handlebars,
    productCss: true, // hack for handlebars
  });
  //....
});

/** End render template */

module.exports = router;
