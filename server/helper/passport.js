const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const UserModel = require("../models/auth.model")
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
    clientID: FACEBOOK_CLIENT_ID,//The App ID generated when app was created on https://developers.facebook.com/
    clientSecret: FACEBOOK_CLIENT_SECRET,//The App Secret generated when app was created on https://developers.facebook.com/
    callbackURL: `${BACKEND_URL}/callback`,
    profileFields: ['id', 'email', 'displayName'] // You have the option to specify the profile objects you want returned
}, async function (accessToken, refreshToken, profile, done) {
    const fbUserDetails = profile._json;
    let response = {}

    let isUserExist = await UserModel.findOne({ facebook_id: fbUserDetails.id, email: fbUserDetails.email })

    if (isUserExist) {
        const fb_loginToken = createJwtToken({ id: isUserExist._id }, LOGIN_SECRET_KEY, "7d");
        response = {
            token: fb_loginToken,
            user: { email: isUserExist.email, name: isUserExist.name, id: isUserExist._id }
        }
        return done(null, response)
    }
    let hashedPassword = await hashPassword(fbUserDetails.id)

    const body = {
        email: fbUserDetails.email,
        name: fbUserDetails.name,
        facebookId: fbUserDetails.id,
        password: hashedPassword
    }

    response = {
        token: accessToken,
        user: { email: fbUserDetails.email, name: fbUserDetails.name, id: fbUserDetails.id }
    }
    await UserModel.create(body)
    return done(null, response);
}))
