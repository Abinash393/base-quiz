const express = require("express");
const router = express.Router();

const auth = require("../../modules/auth");
const isUser = require("../../modules/isUser");

const userController = require("../../controllers/users")

// create new user
router.post("/", userController.registerUser);

// login user
router.post("/login", userController.loginUser);

// update user
router.put("/:id", auth.verifyToken, isUser.checkDb, userController.updateUser);

module.exports = router;
