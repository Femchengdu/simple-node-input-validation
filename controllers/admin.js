const Product = require("../models/product");

// Products data store

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
  //....
};
exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId)
    .then((product) => {
      if (product) {
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: true,
          product: product,
          isAuthenticated: req.session.isLoggedIn,
        });
      } else {
        res.redirect("/admin/products");
      }
    })
    .catch((error) => console.log(error));

  //....
};
exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, productId } = req.body;

  const product = Product.findById(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/admin/products");
    });

  //....
};
exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  if (productId) {
    Product.findByIdAndRemove(productId)
      .then(() => {
        res.redirect("/admin/products");
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/admin/products");
      });
  }

  //....
};
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => console.log(error));

  //....
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description, imageUrl } = req.body;
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((error) => console.log(error));
};
