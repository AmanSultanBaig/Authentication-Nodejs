const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const UserModel = require("../models/user.model")
const { hashPassword } = require("../helper/bcrypt")
const { createJwtToken } = require("../helper/jwt")

const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, BACKEND_URL, LOGIN_SECRET_KEY } = process.env;

passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID, //The App ID generated when app was created on https://developers.facebook.com/
    clientSecret: FACEBOOK_CLIENT_SECRET, //The App Secret generated when app was created on https://developers.facebook.com/
    callbackURL: `${BACKEND_URL}/callback`,
    profileFields: ['id', 'email', 'displayName'] // You have the option to specify the profile objects you want returned
}, async function (accessToken, refreshToken, profile, done) {
    const fbUserDetails = profile._json;
    let response = {}

    const { email, name, id } = fbUserDetails

    let isUserExist = await UserModel.findOne({ facebook_id: id, email: email })

    // if user from facebook is already exist in system
    if (isUserExist) {
        const loginToken = createJwtToken({ "email": isUserExist.email }, LOGIN_SECRET_KEY, "7d");
        response = {
            token: loginToken,
            user: { email: isUserExist.email, name: isUserExist.name, id: isUserExist._id }
        }
        return done(null, response)
    }
    // generating password for facebook user
    const hashedPassword = await hashPassword(id)
    const fb_loginToken = createJwtToken({ "email": email }, LOGIN_SECRET_KEY, "7d");

    const body = {
        email: email,
        name: name,
        facebookId: id,
        password: hashedPassword
    }

    response = {
        token: fb_loginToken,
        user: { email: email, name: name, id: id }
    }
    await UserModel.create(body)     // creating fb user to system
    return done(null, response);
}))