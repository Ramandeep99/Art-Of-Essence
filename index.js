const express = require('express');
const app = express();
const port = 5000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-layout');
const db = require('./config/mongoose');
const Artist = require('./models/artistModel');
const Painting = require('./models/paintingModel');
const postController = require('./controllers/postController');
const profileContainer = require('./controllers/profileController');
const artistsController = require('./controllers/artistsController');
const feedController = require('./controllers/feedController');
const galleryController = require('./controllers/gallery_controllers')
const auctionController = require('./controllers/auctionController');

const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy')
const passportGoogle = require('./config/passport-google-oauth-strategy');

const session = require('express-session');    


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./assets'));

app.use(cookieParser());


app.use('/uploads', express.static('./uploads'));    //Multer uploads

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret:"My secret",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: (1000*60*100)           //after that session expires
   }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// Chatroom

Timer = require('./assets/js/timer2.js').Timer,
timer = new Timer();

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  //added later [sset timer for buyers]
  socket.emit('currentEndTime', {time: timer.getEndTime() });
  
  socket.on('setTimer', function(data) {
    timer.setEndTime(data.time);
    socket.broadcast.emit('currentEndTime', {time: timer.getEndTime() });
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});


app.get('/', function(req, res){
  return res.render('home');
})

app.get('/login', function(req, res){
    return res.render('login')
})
// app.get('/profile', function(req, res){
//     return res.render('profile')
// })
//app.get('/profile', profileContainer.showProfile)

app.get('/profile/:id', profileContainer.showProfile);

app.get('/home', function(req, res){
    return res.render('home');
})
app.get('/artists', artistsController.showArtists);
// app.get('/artists', function(req, res){
//     if(req.isAuthenticated() || req.user){
//         return res.render('artists');
//     }
//     res.redirect('/login')
// })
app.get('/post', function(req, res){
    if(req.isAuthenticated() || req.user){
        return res.render('post');
    }
    res.redirect('/login');
})

app.post('/signup', function(req, res){
    Artist.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    },function(err, artist){
        if(err){console.log('Error in registering user', err); return;}
        res.render('login')
    })
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/feed', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  });



//--------Passport-local-mongoose--------

// app.post('/signup', function(req, res) {
//     Artist.register({ email : req.body.email, name: req.body.name}, req.body.password, function(err, user) {
//         if (err) {
//             console.log('Error in registering user', err)
//             return res.render('login');
//         }
        
//         passport.authenticate('local')(req, res, function () {
//           res.send('Registered');
//         });
//     });
//   });

// app.post('/login', function(req, res){
//     Artist.findOne({email: req.body.email}, function(err, user){
//         if(err){console.log('Error in finding the user'); return;}
//         if(user.password === req.body.password){
//             res.send('Logged In');
//         }
//     })
// })


//----------------Passport Local Mongoose-----------------
app.post('/login', passport.authenticate('local'), function(req, res) {
    res.render('home');
});

app.get('/logout', function(req, res){
    req.logout();
    return res.redirect('/login')
})

// app.post('/uploadPainting' ,function(req, res){
//     Painting.uploadedPainting(req, res, function(err){
//         if(err){console.log(err); return;}
//         console.log(req.file)
//     })
// })

//app.post('/uploadPainting', postController.uploadPainting);

app.post('/post', postController.uploadPost);

app.get('/navbar', function(req, res){
    return res.render('navbar')
})

app.get('/painting', function(req, res){
    return res.render('painting');
})

app.get('/buy/:id', function(req, res){
    res.send('Hello')
    //console.log(req)
})

app.get('/feed', feedController.showFeed);

// app.post('/like/:id', feedController.likePost);

app.get('/auction/:id', auctionController.showAuctionPage);

app.get('/checkout', function(req, res){
  res.render('checkoutForm');
})

app.get('/gallery', galleryController.showGalery);

server.listen(port, function(err){
    console.log('Server has started successfully at port:', `${port}`);
});