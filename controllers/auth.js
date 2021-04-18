const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  console.log(req.session);
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};
exports.postLogin = (req, res, next) => {
  User.findById("607a5c291c7e0f73b56939e2")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((error) => {
        res.redirect("/");
      });
    })
    .catch((error) => console.log(error));
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect("/");
  });
};
