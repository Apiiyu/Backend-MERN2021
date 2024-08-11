const express = require("express");
const router = express.Router();
const {
  index,
  viewCreate,
  createData,
  viewUpdate,
  updateData,
  deleteData,
} = require("./controller");
const { isLoginAdmin } = require("../middleware/auth");

/* Router Bank Page */
router.use(isLoginAdmin);

router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", createData);
router.get("/update/:id", viewUpdate);
router.put("/update/:id", updateData);
router.delete("/delete/:id", deleteData);

module.exports = router;
