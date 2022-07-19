const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
function initialize(passport, getUserByEmail, getUserById){

    const authenticateUser = async(email, password, done)=>{
        // console.log(email)
            const user = await getUserByEmail(email);
            // console.log(user)
            if(user == null) {
                return done(null, false, {message: 'Email address or password is incorrect.'});
            }
            try {
                (async ()=>{
                    if(await bcrypt.compare(password, user.password)){
                        console.log(user)
                        return done(null, user);
                    }
                    else {
                        return done(null, false, {message: 'Email address or password is incorrect.'});
                    }
                })();
            }
            catch(err){
                done(err);
            }
    }
    
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
    passport.serializeUser((user, done)=> done(null, user._id));
    passport.deserializeUser((id, done)=>{
        return done(null, getUserById(id));
    });

}

module.exports = initialize;


// const LocalStrategy = require('passport-local').Strategy
// const bcrypt = require('bcrypt')

// function initialize(passport, getUserByEmail, getUserById) {
//   const authenticateUser = async (email, password, done) => {
//     const user = getUserByEmail(email)
//     if (user == null) {
//       return done(null, false, { message: 'No user with that email' })
//     }

//     try {
//       if (await bcrypt.compare(password, user.password)) {
//         return done(null, user)
//       } else {
//         return done(null, false, { message: 'Password incorrect' })
//       }
//     } catch (e) {
//       return done(e)
//     }
//   }

//   passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
//   passport.serializeUser((user, done) => done(null, user.id))
//   passport.deserializeUser((id, done) => {
//     return done(null, getUserById(id))
//   })
// }

// module.exports = initialize