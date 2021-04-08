const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
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

// Routes and controllers
app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(pathError);

app.listen(3090);
