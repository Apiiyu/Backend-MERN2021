const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("./controller");
const multer = require("multer");
const os = require("os");
/* Router Payment of Method Page */

router.post("/signup", multer({ dest: os.tmpdir() }).single("avatar"), signUp);
router.post("/signin", signIn);

module.exports = router;
