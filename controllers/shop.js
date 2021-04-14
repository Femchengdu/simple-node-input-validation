const Product = require("../models/product");
const Cart = require("../models/cart");
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product_list", {
      products,
      pageTitle: "Products List",
      path: "/shop/products",
    });
  });

  //....
};
exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    res.render("shop/product-detail", {
      product,
      pageTitle: "Product Detail",
      path: "/products",
    });
  });

  //....
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      products,
      pageTitle: "My Shop",
      path: "/",
    });
  });

  //....
};
exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    const cartProducts = [];
    if (cart) {
      // Make sure there is a valid cart
      Product.fetchAll((products) => {
        if (products) {
          // Make sure there are products to iterate over
          for (product of products) {
            const cartProduct = cart.products.find(
              (cartProduct) => cartProduct.id === product.id
            );
            if (cartProduct) {
              cartProducts.push({ product, qty: cartProduct.qty });
            }
          }
        }
        res.render("shop/cart", {
          pageTitle: "My Cart",
          path: "/cart",
          products: cartProducts,
        });
      });
    } else {
      res.render("shop/cart", {
        pageTitle: "My Cart",
        path: "/cart",
        products: cartProducts,
      });
    }
  });
};
exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  console.log("post cart :", productId);
  Product.findById(productId, (product) => {
    const { price } = product;
    Cart.addProduct(productId, price);
    console.log("post cart controller :", product);
  });
  res.redirect("/cart");

  //....
};

exports.getOrders = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/orders", {
      products,
      pageTitle: "My Orders",
      path: "/orders",
    });
  });

  //....
};
exports.postDeleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    const { price } = product;
    Cart.deleteProduct(productId, price);
    res.redirect("/cart");
  });
};
exports.getCheckout = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/checkout", {
      products,
      pageTitle: "My Checkout",
      path: "/checkout",
    });
  });

  //....
};
