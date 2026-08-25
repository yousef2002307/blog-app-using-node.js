const express = require("express");
const router  = express.Router();
const PostController = require("../../app/Http/Controllers/PostController");
const verifyJWT    = require("../../app/Http/Middleware/VerifyJwt");
const authorize    = require("../../app/Http/Middleware/authorize");

router.post("/post",     verifyJWT, authorize("post:create"), PostController.store.bind(PostController));
router.get("/post/:id",  verifyJWT, authorize("post:read"),   PostController.show.bind(PostController));
router.delete("/post/:id", verifyJWT, authorize("post:delete"), PostController.delete.bind(PostController));
router.get("/post",      verifyJWT, authorize("post:read"),   PostController.index.bind(PostController));
router.put("/post/:id",  verifyJWT, authorize("post:edit"),   PostController.edit.bind(PostController));

module.exports = router;
