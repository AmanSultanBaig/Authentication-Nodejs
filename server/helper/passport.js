const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, BACKEND_URL } = process.env;

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
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}))
