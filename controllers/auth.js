const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: "send-grid-api-key",
    },
  })
);
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
            return transporter.sendMail({
              to: email,
              from: "rDev@nodeApp.com",
              subject: "Signup Success",
              html: "<h1>Signup Success!!!</h1>",
            });
          })
          .catch((err) => {
            console.log(err);
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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  console.log(req.session);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return transporter.sendMail({
          to: req.body.email,
          from: "rDev@nodeApp.com",
          subject: "Password Reset",
          html: `<p>Your requested a password reset </p>
          <p>Click this <a href="http://localhost:3090/reset/${token}"> link</a> to set a new password</p>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now(),
    },
  })
    .then((user) => {
      let message = req.flash("error");
      console.log(req.session);
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {
      $gt: Date.now(),
    },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => conosle.log(err));
};
