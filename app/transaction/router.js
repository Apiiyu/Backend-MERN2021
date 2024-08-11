const express = require("express");
const router = express.Router();
const { index, changeStatus } = require("./controller");
const { isLoginAdmin } = require("../middleware/auth");

/* Router Payment of Method Page */
router.use(isLoginAdmin);

router.get("/", index);
router.put("/status/:id", changeStatus);

module.exports = router;
