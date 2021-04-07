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
  res.render("shop", { products, docTitle: "My Shop" });
  //....
});

/** End render template */

module.exports = router;
