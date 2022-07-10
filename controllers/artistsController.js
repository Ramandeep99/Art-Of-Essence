const Artist = require('../models/artistModel');

module.exports.showArtists = function(req, res){
    Artist.find({}, function(err, artists){
        if(err){console.log(err); return;}
        //console.log(artists.length)
        //console.log(artists.entries())
        return res.render('artists', {artists : artists})
    })
}