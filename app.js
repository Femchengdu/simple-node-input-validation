const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MDbSStore = require("connect-mongodb-session")(session);

const User = require("./models/user");
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
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          username: "rDev",
          email: "rDev@internetdollars.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3090, () => console.log("Express server ready to serve!"));
  })
  .catch((error) => console.log(error));
