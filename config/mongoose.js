const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/ArtOfEssenceDB' , {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to db'));
db.once('open', function(){
    console.log("Sucessfully connected to the database.");
})