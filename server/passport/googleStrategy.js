const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const passport = require('passport');
const User = require('../models/User');
const config = require('../config/config');

module.exports = (googleStrategy) => {
    passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        userProfile:"https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cd){
        User.findOrCreate({googleId: profile.id}, function(err, user){
            return cd(err, user);
        })
    }
    ));
};