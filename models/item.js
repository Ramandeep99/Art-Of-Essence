const mongoose = require('./db.js');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads'); 

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type: String
    },
    painting:{
        type: String
    },
    basePrice:{
      type: Number
    },
    artist:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    likesCount:{
      type: Number,
      default: 0
    },
    date: {type: Number, default: new Date().getTime()},
    start_bid_date: {type: Number, default: new Date().getTime()},
    bidded: {type: Boolean, default: false},
    sold: {type: Boolean, default: false}
  }, {timestamps: true});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //cb(null, path.join(__dirname, '..', '/uploads'))
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

//paintingSchema.statics.upload = multer({storage: storage});
ItemSchema.statics.uploadedPainting = multer({storage: storage}).single('painting');
ItemSchema.statics.avatarPath = AVATAR_PATH;


let Item = mongoose.model('items', ItemSchema);

module.exports = Item;