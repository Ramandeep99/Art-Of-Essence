const Artist = require('../models/artistModel');
const Painting = require('../models/paintingModel');

// module.exports.showGalery = function(req, res){
//     Painting.find({})
//     .sort({createdAt: 'desc'})
//     .populate('artist')
//     .exec(function(err, posts){
//         if(err){console.log(err); return;}
//         return res.render('gallery', {posts:posts});
//     })
// }

module.exports.showGalery = async (req, res) => {
    console.log(req.user)
    const paintings = await Painting.find();
    
    res.render('gallery', {posts:paintings});
}


module.exports.likePost = function(req, res){
    Painting.findById(req.params.id, function(err, post){
        if(err){console.log(err); return;}
        post.likesCount++;
        post.save();
        return res.render('gallery', {likeCount:likesCount});
    })
}