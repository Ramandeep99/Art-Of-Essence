/**
 * @requires mongoose.models
 */
 const User = require('../models/userModel');
 /**
  * @requires jsonwebtoken
  */
 const jwt = require('jsonwebtoken');
 
 /**
  * 
  * @param {Object} req 
  * @param {number} res 
  * @param {*} next
  * @param {callback} 
  * @async function
  */

 const authenticate = async(req, res, next) => {
 
    //  console.log("in user middleware")
    
     try {
         const token = req.cookies.jwtoken;
        //  console.log(token)
         const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        //  console.log(verifyToken._id)
         const verifiedUser = await User.findOne({ _id: verifyToken._id });
        //  console.log(verifiedUser)
         if (!verifiedUser) {
             throw new Error(`Could not find user`);
             
         }
 
         req.token = token;
         req.verifiedUser = verifiedUser;
         req.userId = verifiedUser._id;
         res.locals.user = verifiedUser;
         res.locals.unauthenticated = false;
         res.locals.id = verifiedUser._id;
 
         next();
     } catch (err) {
        //  res.locals.unauthenticated = true;
        //  res.locals.id = null;
         res.redirect('/login');
         next();
         console.log(err);
     }
 
 }
 
 /**
  * @exports authenticate
  */
 module.exports = authenticate;