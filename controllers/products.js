// Products data store
const products = [];

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formCss: true, // Handlebars prop.
    activeAddProduct: true, // Handlebars prop.
    productCss: true, // hack for handlebars
  });
  //....
};

exports.postAddProduct = (req, res, next) => {
  const { title } = req.body;
  products.push({ title });
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  res.render("shop", {
    products,
    pageTitle: "My Shop",
    path: "/",
    prodsGTZero: products.length > 0, // hack for handlebars
    activeShop: true, // hack for handlebars,
    productCss: true, // hack for handlebars
  });
  //....
};
