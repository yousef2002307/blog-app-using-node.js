const express = require("express");
const router = express.Router();
const AdminsController = require("../../../app/Http/Controllers/Admin/AdminsController");
const verifyJWT = require("../../../app/Http/Middleware/verifyJWT");
const authorize = require("../../../app/Http/Middleware/authorize");
router.get("/admins", verifyJWT, authorize("user:manage"), AdminsController.index.bind(AdminsController));
router.post("/admin", verifyJWT, authorize("user:manage"), AdminsController.createAdmin.bind(AdminsController));

module.exports = router;
