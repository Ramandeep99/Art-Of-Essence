const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const artistSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        //required: true
    },
    followersCount:{
        type: Number
    },
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Painting'
        }
    ]
});

// artistSchema.plugin(passportLocalMongoose);

const Artist = mongoose.model('Artist', artistSchema);


module.exports = Artist;