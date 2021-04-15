const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

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
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});

// Routes and controllers
app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(pathError);

// Associations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.hasMany(CartItem);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
Order.hasMany(OrderItem);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  //.sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "rDev", email: "rDev@internetdollars.com" });
    } else {
      // This is automatically wrapped in a promise
      return user;
    }
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3090, () => console.log("App listening on port 3090"));
  })
  .catch((error) => console.log("Sync error :", error));
