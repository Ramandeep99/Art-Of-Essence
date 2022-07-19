const mongoose = require('mongoose');
try {
    (async ()=>{
        await mongoose.connect('mongodb://localhost:27017/project', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to Database...")
    })();
}catch(err){
    console.log(err);
}


module.exports = mongoose;
