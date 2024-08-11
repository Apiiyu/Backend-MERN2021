const express = require("express");
const router = express.Router();
const { viewSignIn, SignIn, logout } = require("./controller");

/* GET category page. */
router.get("/", viewSignIn);
router.post("/", SignIn);
router.get("/logout", logout);

module.exports = router;
