const express = require("express");
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
} = require("../controllers/auth");

const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);
router.post("/logout", postLogout);
router.post("/signup", postSignup);
router.get("/signup", getSignup);

module.exports = router;
