const Artist = require('../models/artistModel')
const Painting = require('../models/paintingModel')

// module.exports.showProfile = function(req, res){
//     Painting.find({}, function(err, posts){
//         if(err){console.log(err); return;}
//         //console.log(posts)
//         return res.render('profile', {posts:posts})
//     })
// }

module.exports.showProfile = function(req, res){
    Artist.findById(req.params.id)
    .populate('posts')
    .exec(function(err, artist){
        if(err){console.log(err); return;}
        return res.render('profile', {artist:artist})
    })
    //  function(err, artist){
    //     if(err){console.log(err); return;}
    //     return res.render('profile', {artist:artist});
    // })
}