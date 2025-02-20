const express = require("express");
const {
  getPersistenceType,
  updatePersistenceType,
} = require("../controllers/adminController");
const { verifyAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/persistence", getPersistenceType);
router.put("/persistence", verifyAdmin, updatePersistenceType);

module.exports = router;
