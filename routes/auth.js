const express = require("express")
const router = express.Router();

const AuthController = require("../controllers/auth.controller")

router.post("/user/login", AuthController.login)
router.post("/user/sign-up", AuthController.signUp)
router.post("/user/verify-account", AuthController.verifyAccount)

router.post("/user/forgot-password", AuthController.forgotPassword)

module.exports = router;