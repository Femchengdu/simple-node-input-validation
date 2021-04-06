const express = require("express");

// Import router middleware
const adminRoutes = require("./routes/admin");

const shopRoutes = require("./routes/shop");

const bodyParser = require("body-parser");

// Create app
const app = express();

// Deprecation warning on bodyParser below.
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

// setup 404
app.use((req, res, next) => {
  res.status(404).send("<h1>Page not found!</h1>");
});

app.listen(3090);
