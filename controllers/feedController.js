const Artist = require('../models/artistModel');
const Painting = require('../models/paintingModel');

module.exports.showFeed = function(req, res){
    Painting.find({})
    .sort({createdAt: 'desc'})
    .populate('artist')
    .exec(function(err, posts){
        if(err){console.log(err); return;}
        return res.render('feed', {posts:posts});
    })
}

module.exports.likePost = function(req, res){
    Painting.findById(req.params.id, function(err, post){
        if(err){console.log(err); return;}
        post.likesCount++;
        post.save();
        return res.render('feed', {likeCount:likesCount});
    })
}