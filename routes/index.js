const express = require('express');
const router = express();
const bodyParser = require('body-parser');
router.set(express.urlencoded({extended: true}));
router.set(express.json());
const cookieParser = require('cookie-parser')
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require('./passport-config.js');
const MongoStore = require('connect-mongo');
let mongoConnection = require('../models/db.js');
const auth = require('./functions')
const users = require('../models/index').users

// initializePassport(
//   passport,
//   email => users.find(user => user.email === email),
//   id => users.find(user => user._id === id)
// )

router.use(flash());
router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));



router.use(passport.initialize());
router.use(passport.session());


let homePage = require('./home.js');
let loginPage = require('./login.js');
let profilePage = require('./profile.js');
let userRoute = require('./userRoutes')
// router.use(homePage);
router.use(loginPage);
// router.use(profilePage);
router.use(userRoute)
// router.all('*' ,auth.setAuthenticatedUser());


router.get('/' ,async (req,res)=>{
    let user = await req.user
    console.log(user)
    res.render('home' ,{user});
})


module.exports = router;

