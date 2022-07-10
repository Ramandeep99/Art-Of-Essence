const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Artist = require('../models/artistModel');

passport.use(new GoogleStrategy({
    clientID: "10094447066-pa1q94gpj8c71rn35usu2hjk0jhhvvk6.apps.googleusercontent.com",
    clientSecret: "DigQQDdgAGlQDp64rLk8ueib",
    callbackURL: "http://localhost:5000/auth/google/feed"
  },
  function(accessToken, refreshToken, profile, done){
    Artist.findOne({email: profile.emails[0].value}).exec(function(err, user){
        if(err){console.log('Error in google strategy passport'); return;}

        if(user){
            return done(null, user);
        }else{
            Artist.create({
                name: profile.displayName,
                email: profile.emails[0].value
            },function(err, user){
                if(err){console.log('error in creating user google strategy-passport'); return;}

                return done(null, user);
            })
        }
    })
}
  ))

  module.exports = passport;