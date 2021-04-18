const express = require("express");
const {
  getProducts,

  getCart,
  getIndex,
  getOrders,
  getProduct,
  postCart,
  postDeleteCartItem,
  postOrders,
} = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);
router.get("/products/:productId", getProduct);

router.get("/cart", isAuth, getCart);
router.post("/cart", isAuth, postCart);
router.post("/delete-cart-item", isAuth, postDeleteCartItem);
router.get("/orders", isAuth, getOrders);
router.post("/create-order", isAuth, postOrders);

/** End render template */

module.exports = router;
