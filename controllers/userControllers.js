
const User = require('../models/userModel')
const Artist = require('../models/artistModel')
 const bcrypt = require('bcryptjs');
 
 
 //....................Implementing Signup Part..............................................
 
 
 /**
  * Function to GET request for rendering HTML for Signup page
  * @module register_normal_user_get
  * @name get/register
  * @param {String} path
  * @param {callback} middleware
  * @param {*} req 
  * @param {register.ejs} res 
  * @exports register_normal_user_get
  */

 exports.register_get = (req, res) => {
     res.render('login');
 }
 
 /**
  * Function to POST request for Register if userregistered successfully server will send of status code 201
  * else a status code of 404 will be send
  * @module register_normal_user_post
  * @param {Object} req 
  * @param {Number} res 
  * @returns {Number} status code
  * @async
  * @exports register_normal_user_post
  */
 exports.register_post = async(req, res) => {
    // console.log(req.body)
     const { name, email, password, confirm_password } = req.body;
     if (!name || !email || !password || !confirm_password) {
         return res.status(422).json({ error: "Please fill the fields properly" });
     } else if (password.length < 4) {
         return res.status(401).json({ error: "Password must be at least 4 characters" })
     }
     
     try {
         /**
          Searching if a user already exist with the email
         */
         const dbEmail = await User.findOne({ email: email });
         if (dbEmail) {
             return res.status(404).json({ error: 'Email Already Registered' })
         }
 
         if (password === confirm_password) {
 
             const detail = new User({
                 name,
                 email,
                 password
             });
 
            //  console.log(detail) //For testing purpose
             const registered = await detail.save();
             
             if (registered) {
                 res.status(200).json({ registered: registered._id });
             } else {
                 res.status(500).json({ error: "User Failed to Register" });
             }
 
         } else {
             res.status(404).json({ error: 'Enter same confirm password' })
         }
     } catch (error) {
         res.status(404).json({ error: error });
     }
 }
 
 
 
 
 
 
 //.....................Implementing Login Part...............................................
 
 
 /**
  * Function to GET request for rendering HTML for login page
  * @module normal_user_login_get
  * @name get/login
  * @param {string} path
  * @param {callback} middleware
  * @param {*} req 
  * @param {login.ejs} res 
  * @exports normal_user_login_get
  */
 
 exports.login_get = (req, res) => {
     res.render('login');
 }
 
 
 /**
  * Function to POST request for validating login and if user is verified a response 'ok' will be send to
  * client otherwise a status code '400' will be send to client.
  * @module normal_user_login_post
  * @param {Object} req 
  * @param {Number} res 
  * @param {callback} middleware
  * @returns {number}a status code o '400' when input fields are not filled
  * @async 
  * @exports normal_admin_login_post
  */
 exports.login_post = async(req, res) => {
     try {
         /**
          * object destructuring to get email and password from client
          */
         const { email, password } = req.body;
         if (!email || !password) {
             return res.status(400).json({ error: "Please fill the data" });
         }
         /**
          * Storing user data if user exists in database 
          */
         const validateUser = await User.findOne({ email: email });
         const validateNormalAdmin = await Artist.findOne({ email: email });
        //  console.log(validateUser)
         if (validateUser) {
             const isValidlogin = await bcrypt.compare(password, validateUser.password);
             const token = await validateUser.generateAuthToken();
            //  console.log(token); //for testing pupose 
             res.cookie("jwtoken", token, {
                 expires: new Date(Date.now() + 60480000), //expiry data of token set for 1 week
                 httpOnly: true
             })
 
             if (!isValidlogin) {
                 res.status(400).json({ error: "User not found" });
             } else {
                 console.log('user found'); //For testing purpose in backend
                 res.status(200).json({ userData: 'okUser' });
             }
         } else if (validateNormalAdmin) {
             // console.log(validateNormalAdmin);
             const isValidlogin = await bcrypt.compare(password, validateNormalAdmin.password);
             const token = await validateNormalAdmin.generateAuthToken();
             // console.log(token); //for testing pupose 
             res.cookie("jwtoken", token, {
                 expires: new Date(Date.now() + 60480000), //expiry data of token set for 1 week
                 httpOnly: true
             });
 
             if (!isValidlogin) {
                 res.status(400).json({ error: "Artist not found" });
             } else {
                 // console.log('user found'); //For testing purpose in backend
                 res.json({ status: 'okArtist' });
             }
         } else {
             res.status(400).json({ error: "User not found" });
         }
 
     } catch (err) {
         console.log(err);
     };
 }


 
 //.....................Implementing Logout Part...............................................
 
 /**
  * GET request to logout the user
  * @module normal_user_logout_get
  * @param {*} req 
  * @param {Number} res 
  * @exports normal_user_logout_get
  */
 exports.logout_get = (req, res) => {
     res.clearCookie('jwtoken');
     res.status(200).redirect('/login');
 }
 
 
 
exports.userHome = async(req,res)=>{
    res.render('home');
}