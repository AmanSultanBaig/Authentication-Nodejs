const express = require("express")
const router = express.Router();
const passport = require('passport');
const { authenticateUser, authorizedUser } = require("../middlewares/auth-handling")

const UserService = require("../services/user-service")
// Service Instance
const UserServiceInstance = new UserService();

router.post("/user/login", async (req, res) => {
    try {
        const response = await UserServiceInstance.SignIn(req.body);
        res.status(response.status).json({ status: true, message: response.message, data: response.data })
    } catch (error) {
        next(error)
    }
})

router.post("/user/sign-up", async (req, res, next) => {
    try {
        const data = await UserServiceInstance.SignUp(req.body);
        res.status(data.status).json({ status: true, message: data.message })
    } catch (error) {
        next(error)
    }
})

router.post("/user/verify-account", async (req, res, next) => {
    try {
        const data = await UserServiceInstance.AccountActivation(req.body);
        res.status(data.status).json({ status: true, message: data.message })
    } catch (error) {
        next(error)
    }
})

router.post("/user/forgot-password", async (req, res) => {
    try {
        const data = await UserServiceInstance.ForgotPassword(req.body);
        res.status(data.status).json({ status: true, message: data.message })
    } catch (error) {
        next(error)
    }
})

router.put("/user/reset-password", async (req, res) => {
    try {
        const data = await UserServiceInstance.ChangePassword(req.body);
        res.status(data.status).json({ status: true, message: data.message })
    } catch (error) {
        next(error)
    }
})

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
router.get("/user/access-user", authenticateUser, authorizedUser, (req, res) => {
    res.status(200).json({
        status: true,
        message: "I Have accessed this route"
    })
})

module.exports = router;