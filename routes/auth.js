const express = require("express")
const router = express.Router();

const AuthController = require("../controllers/auth.controller")

router.post("/user/sign-up", AuthController.signUp)

module.exports = router;