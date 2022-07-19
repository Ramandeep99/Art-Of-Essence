const express = require('express');
const app = express();
const port = 5000;
var server = require('http').createServer(app);
// var io = require('socket.io')(server);

const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// const session = require('express-session'); 
// const setUser = require('./routes/functions')  
// const flash = require("express-flash")
// const MongoStore = require('connect-mongo');
// const mongoConnection = require('./models/db')


const dotenv = require("dotenv");
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.urlencoded({extended: false}));
app.use(express.static('./assets'));

// app.use(cookieParser());
// app.use(express.json())
// app.use(setUser.setAuthenticatedUser);

dotenv.config({ path: "./config.env" });

app.use('/uploads', express.static('./uploads'));    //Multer uploads

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// to add new category
// const cat = require('./models/category')
// let newcat = new cat({name: 'Painting'});
// let fun = async(req,res) =>{
//     await newcat.save()
// }
// fun()

// const initializePassport = require('./routes/passport-config');
// initializePassport(
//     passport,
//     email => users.find(user => user.email === email),
//     id => users.find(user => user.id === id)
//   )
  

// app.get('/' ,setUser.checkAuthenticated, (req,res) =>{
//     // console.log(req)
//     res.render('home' ,{user : req.user})
// })

// const userRoute = require("./routes/userRoutes");

// const auctionRoutes = require("./routes/auctionRoutes");
const router = require('./routes/index.js');

app.use(router);
// app.use( userRoute);
// app.use( auctionRoutes);

server.listen(port, function(err){
    console.log('Server has started successfully at port:', `${port}`);
});