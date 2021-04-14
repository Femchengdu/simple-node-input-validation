const express = require("express");
const {
  getProducts,
  getCheckout,
  getCart,
  getIndex,
  getOrders,
  getProduct,
  postCart,
  postDeleteCartItem,
} = require("../controllers/shop");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);
router.get("/products/:productId", getProduct);

router.get("/cart", getCart);
router.post("/cart", postCart);
router.post("/delete-cart-item", postDeleteCartItem);
router.get("/orders", getOrders);

router.get("/checkout", getCheckout);

/** End render template */

module.exports = router;
