const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MDbSStore = require("connect-mongodb-session")(session);
const User = require("./models/user");
const csrf = require("csurf");
const flash = require("connect-flash");
// Import router middleware
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { pathError } = require("./controllers/error");

// Create app
const app = express();
const store = new MDbSStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

/** Templates */
// using ejs
app.set("view engine", "ejs");
app.set("views", "views");
/** End Template */

// Deprecation warning on bodyParser below.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "mySessionSecret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes and controllers
app.use("/admin", adminRoutes);

app.use(shopRoutes);
app.use(authRoutes);

app.use(pathError);
// Test all goes well
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(3090, () => console.log("Express server ready to serve!"));
  })
  .catch((error) => console.log(error));
