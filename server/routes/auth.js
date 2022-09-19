const express = require("express")
const router = express.Router();
const passport = require('passport');
const { authenticateUser, authorizedUser } = require("../middlewares/auth-handling")

const AuthController = require("../controllers/auth.controller")

router.post("/user/login", AuthController.login)
router.post("/user/sign-up", AuthController.signUp)
router.post("/user/verify-account", AuthController.verifyAccount)

router.post("/user/forgot-password", AuthController.forgotPassword)
router.put("/user/reset-password", AuthController.resetPassword)

// If login failed with facebook
router.get("/login", (req, res) => res.send("Login failed with Facebook"))

// social login routes
// ********** Facebook Authentication ************ // 
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/callback', passport.authenticate('facebook', { failureRedirect: '/login', failureMessage: true }), (req, res) => {
    res.send("Logged In successfully")
    console.log("FB loggedin user: ", req.user)
    console.log("Facebook Authentication: ", req.isAuthenticated())
});

// protected routes | only logged in user can access 
router.get("/user/access-user", authenticateUser, authorizedUser, AuthController.getUserAccess)

module.exports = router;