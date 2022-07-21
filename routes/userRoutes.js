/**
 * @file This file inside Routes will be used to route to login/logout and Signup for a normal user
 * @see <a href="routes_login_signup.js.html">see the source code Here</a>
 */

 const express = require('express');
 const router = express.Router();
 const authcontrollers = require('../controllers/userControllers'); //Controller for and Registration authentication
 const feedControllers = require('../controllers/feedController')
 const galleryController = require('../controllers/gallery_controllers');
const postController = require('../controllers/postController') 
const artistsController = require('../controllers/artistsController')
const profileContainer = require('../controllers/profileController')
const auctionController = require('../controllers/auctionController')
const authenticate = require('./functions').checkAuthenticated
const setAuthenticatedUser = require('./functions').setAuthenticatedUser

 //......................Routes for Registration.............................
 
 /**
  * Routing to register.ejs
  * @module normal_user_login_signup
  * @method GET
  */
//  router.get('/register', authcontrollers.register_get);
 /*
  * Routing to register
  * @module normal_user_login_signup
  * @method POST
 */
//  router.post('/register', authcontrollers.register_post);

 //......................Routes for Login.....................................
 
 /**
  * Routing to login.ejs
  * @module normal_user_login_signup
  * @method GET
  */
//  router.get('/login', authcontrollers.login_get);
 /**
  * Routing to login
  * @module normal_user_login_signup
  * @method POST
  */
 
//  router.post('/login', authcontrollers.login_post);


//  router.get('/userHome'  , authcontrollers.userHome);

 
 router.get('/feed' , authenticate,setAuthenticatedUser, feedControllers.showFeed)

//  router.post('/like/:id',authenticate, feedControllers.likePost);


router.get('/gallery',authenticate,setAuthenticatedUser, galleryController.showGalery);


router.get('/post' ,authenticate,setAuthenticatedUser, postController.getPainting)

router.post('/post',authenticate,setAuthenticatedUser, postController.uploadPost);

// artists
router.get('/artists',authenticate,setAuthenticatedUser, artistsController.showArtists);

// user profile 
router.get('/profile/:id', profileContainer.showProfile);

// single painting page
router.get('/painting1/:id', postController.getSinglePainting)

// auction
// router.get('/auction', authenticate, auctionController.showAuctionPage);


// router.get('/logout', authcontrollers.logout_get);


 
 /**
  * @exports  normal_user_login_signup
  */
 module.exports = router;