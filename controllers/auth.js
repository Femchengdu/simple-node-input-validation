const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  console.log(req.session);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((passwordMatch) => {
            if (passwordMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save((error) => {
                if (error) {
                  console.log(error);
                }
                res.redirect("/");
              });
            } else {
              req.flash("error", "Invalid email or password.");
              return res.redirect("/login");
            }
          })
          .catch((error) => {
            console.log(error);
            return res.redirect("/login");
          });
      } else {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
    })
    .catch((error) => console.log(error));
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect("/");
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "E-Mail already exists.");
        return res.redirect("/signup");
      } else {
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              email,
              password: hashedPassword,
              cart: { items: [] },
            });
            return user.save();
          })
          .then((result) => {
            res.redirect("/login");
          });
      }
    })
    .catch((error) => {});
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  console.log(req.session);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};
