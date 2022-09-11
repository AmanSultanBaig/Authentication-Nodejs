const express = require("express")
const router = express.Router();

const AuthController = require("../controllers/auth.controller")

router.post("/user/sign-up", AuthController.signUp)
router.post("/user/verify-account", AuthController.verifyAccount)

module.exports = router;