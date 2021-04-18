exports.pathError = (req, res, next) => {
  res.status(404).render("404", {
    path: "",
    pageTitle: "Page Not Found!",
    isAuthenticated: req.session.isLoggedIn,
  });
};
