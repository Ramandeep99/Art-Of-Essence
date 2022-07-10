const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Artist = require('../models/artistModel');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true 
},function(req, email, password, done){
    Artist.findOne({email: email}, function(err, user){
        if(err){console.log('Error in finding the user', err); return done(err);}
        if(!user){
            return done(null, false, { message: 'Incorrect email.' });
        }
        if (user.password !== password) {
            //req.flash('error', 'Invalid Username/Password');
            return done(null, false, { message: 'Incorrect password.', failureFlash: 'Invalid username or password.' });
        }
        return done(null, user);
    })
}))

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function(id, done){
    Artist.findById(id, function(err, user){
        if(err){
            console.log('Error in finding the user')
            return done(err)
        }
        return done(null, user);
    })
})

//---------------------------passport-local-mongoose----------------
// passport.use(Artist.createStrategy());      

// passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });

// passport.deserializeUser(function(id, done){
//     Artist.findById(id, function(err, user){
//         if(err){
//             console.log('Error in finding the user')
//             return done(err)
//         }
//         return done(null, user);
//     })
// })

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains the information of the current signed in user and we are sending this to locals for the views
        res.locals.user = req.user;
    }
    return next();
}

module.exports = passport;