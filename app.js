const path = require("path");
const express = require("express");

// Import router middleware
const { router: adminRoutes, products } = require("./routes/admin");

const shopRoutes = require("./routes/shop");

const bodyParser = require("body-parser");

// Create app
const app = express();

/** Templates */
app.set("view engine", "pug");
app.set("views", "views");
/** End Template */

// Deprecation warning on bodyParser below.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);

app.use(shopRoutes);

/** Render Templates */

// setup 404
// HTML Template
// app.use((req, res, next) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

// Pug
app.use((req, res, next) => {
  res.status(404).render("404", { pageTile: "Page Not Found!" });
});

/** End render Templates */

app.listen(3090);
