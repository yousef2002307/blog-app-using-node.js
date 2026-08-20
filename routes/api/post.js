const express = require("express");
const router  = express.Router();
const PostController = require("../../app/Http/Controllers/PostController");
const verifyJWT = require("../../app/Http/Middleware/VerifyJwt");

router.post("/post", verifyJWT, PostController.store.bind(PostController));
router.get("/post/:id", verifyJWT, PostController.show.bind(PostController));
router.delete("/post/:id", verifyJWT, PostController.delete.bind(PostController));
module.exports = router;
