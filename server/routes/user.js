const express = require("express")
const router = express.Router();
const passport = require('passport');
const { authenticateUser, authorizedUser } = require("../middlewares/auth-handling")

const UserController = require("../controllers/user.controller")

router.post("/user/login", UserController.login)
router.post("/user/sign-up", UserController.signUp)
router.post("/user/verify-account", UserController.verifyAccount)

router.post("/user/forgot-password", UserController.forgotPassword)
router.put("/user/reset-password", UserController.resetPassword)

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
router.get("/user/access-user", authenticateUser, authorizedUser, UserController.getUserAccess)

module.exports = router;