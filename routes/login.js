const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const path = require('path');
let checkNotAuthenticated = require('./functions.js').checkNotAuthenticated;
let checkAuthenticated = require('./functions.js').checkAuthenticated;
let Users = require(path.join(__dirname, '../models/index.js')).users;


(async ()=>{
    try {
        let initializePassport = require('./passport-config');
        initializePassport(passport, (email) => {
            // console.log(email)
            return (async ()=>{
                let user = await Users.find({email: email});
                if(user.length === 0){
                    return null;
                }
                else {
                    return user[0];
                }
            })();
        },
        (id) => {
            return (async ()=>{
                let user = await Users.find({_id: id});
                if(user.length === 0){
                    return null;
                }
                else {
                    return user[0];
                }
            })();
        });
        
    }
    catch(error) {
        console.log(error);
    }
})();


router.get('/login',checkNotAuthenticated, (req, res)=>{
    (async ()=>{
        try {
            let login = true;
            res.render('login', {login, login_errors: req.flash().error});
        }
        catch(err){
            console.log(err);
        }
    })();
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', checkAuthenticated, (req, res)=>{
(async ()=>{
    try {
        req.logOut();
        res.redirect('/login');
    }
    catch(err){
        console.log(err);
    }
})();
});

router.get('/register', checkNotAuthenticated, (req, res)=>{
    (async ()=>{
        try {
            let register = true;
            res.render('login', {register});
        }
        catch(err){
            console.log(err);
        }
    })();
});

router.post('/register', checkNotAuthenticated, async (req, res)=>{
    console.log('request received')

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
        const dbEmail = await Users.findOne({ email: email });
        if (dbEmail) {
            return res.status(404).json({ error: 'Email Already Registered' })
        }

        if (password === confirm_password) {

            let hashPassword = bcrypt.hashSync(req.body.password, 10);

            const detail = new Users({
                name,
                email,
                password: hashPassword
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
});


module.exports = router;