const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { mongoDbConnect } = require("./utils/database");
const User = require("./models/user");
// Import router middleware
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { pathError } = require("./controllers/error");

// Create app
const app = express();

/** Templates */

// using ejs
app.set("view engine", "ejs");

app.set("views", "views");
/** End Template */

// Deprecation warning on bodyParser below.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6078bf13b7cd704361df0060")
    .then((user) => {
      const { username, email, cart, _id } = user;

      req.user = new User(username, email, cart, _id);
      next();
    })
    .catch((error) => console.log(error));
});

// Routes and controllers
app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(pathError);

mongoDbConnect(() => {
  app.listen(3090, () => console.log("App listening on port 3090"));
});
