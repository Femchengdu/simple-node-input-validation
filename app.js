const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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
  User.findById("607a5c291c7e0f73b56939e2")
    .then((user) => {
      //const { username, email, cart, _id } = user;

      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});

// Routes and controllers
app.use("/admin", adminRoutes);

app.use(shopRoutes);

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
