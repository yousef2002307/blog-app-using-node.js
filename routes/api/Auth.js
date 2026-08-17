const express = require("express");
const router  = express.Router();
const AuthController = require("../../app/Http/Controllers/AuthController");

router.post("/register", AuthController.register.bind(AuthController));
router.post("/login", AuthController.login.bind(AuthController));
router.get("/regenerate-token", AuthController.regenerateToken.bind(AuthController));

module.exports = router;
