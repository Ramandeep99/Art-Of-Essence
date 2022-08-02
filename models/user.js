const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    phone: String,
    followers: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'users' }],
},
{ collection: 'users' });


let User = mongoose.model('users', userSchema);

module.exports = User;