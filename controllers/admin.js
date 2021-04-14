const Product = require("../models/product");

// Products data store

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
  //....
};
exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId, (product) => {
    if (product) {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        product: product,
      });
    } else {
      res.redirect("/admin/products");
    }
  });

  //....
};
exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, productId } = req.body;
  console.log(
    "update product details :",
    title,
    imageUrl,
    price,
    description,
    productId
  );
  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  );
  updatedProduct.save();
  res.redirect("/admin/products");

  //....
};
exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  if (productId) {
    Product.delete(productId);
  }

  // Product.findById(productId, (toBeDeleted) => {
  //   if (toBeDeleted) {
  //     //toBeDeleted.delete();
  //     console.log("delete product :", toBeDeleted);
  //   }
  // });

  res.redirect("/admin/products");

  //....
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });

  //....
};

exports.postAddProduct = (req, res, next) => {
  const { title, description, price, imageUrl } = req.body;
  const newProduct = new Product(null, title, imageUrl, description, price);
  newProduct.save();
  //products.push({ title });
  res.redirect("/");
};
