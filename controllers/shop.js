const Product = require("../models/product");
const Order = require("../models/order");
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product_list", {
        products,
        pageTitle: "Products List",
        path: "/shop/products",
      });
    })
    .catch((error) => console.log(error));

  //....
};
exports.getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: "Product Detail",
        path: "/products",
      });
    })
    .catch((error) => console.log(error));

  //....
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        products,
        pageTitle: "My Shop",
        path: "/",
      });
    })
    .catch((error) => console.log(error));
};
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "My Cart",
        path: "/cart",
        products,
      });
    })
    .catch((error) => console.log(error));
};
exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      req.user.addToCart(product);
      res.redirect("/cart");
    })
    .then((result) => {});
};

exports.postOrders = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((productItem) => {
        const { quantity, productId } = productItem;
        return {
          quantity,
          product: { ...productId._doc },
        };
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      return res.redirect("/orders");
    })
    .catch((error) => console.log(error));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        orders,
        pageTitle: "My Orders",
        path: "/orders",
      });
    })
    .catch((error) => console.log(error));

  //....
};
exports.postDeleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteItemFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((error) => console.log(error));
};
