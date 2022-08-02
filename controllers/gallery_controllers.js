const Artist = require('../models/artistModel');
const Painting = require('../models/item');
const Bids = require('../models/index').bids

module.exports.showGalery = async function(req, res){

    const currUser = await req.user
    const bids = await Bids.find()
    const arr=[]

    Painting.find({})
    .sort({createdAt: 'desc'})
    .populate('artist')
    .exec(function(err, posts){
        if(err){console.log(err); return;}
        posts.forEach(post => {
            // bought paintings for this user
            bids.forEach(bid =>{
                // console.log(bid.item_id == post._id && bid.user_id == currUser._id )
                if(post._id == bid.item_id && bid.user_id == currUser._id){
                    arr.push(post)
                }
            })
        });
        return res.render('gallery', {posts:arr});

    })    
}

// module.exports.showGalery = async (req, res) => {
//     console.log(req.user)z
//     const paintings = await Painting.find();
    
//     res.render('gallery', {posts:paintings});
// }


module.exports.likePost = function(req, res){
    Painting.findById(req.params.id, function(err, post){
        if(err){console.log(err); return;}
        post.likesCount++;
        post.save();
        return res.render('gallery', {likeCount:likesCount});
    })
}