const Artist = require('../models/user');
const Painting = require('../models/item');

module.exports.showFeed = async function(req, res){
    const user = await req.user
    Painting.find({})
    .sort({createdAt: 'desc'})
    .populate('artist')
    .exec(function(err, posts){
        if(err){console.log(err); return;}
        return res.render('feed', {posts:posts, user:user});
    })
    // const posts  = await Painting.find();
    // res.render('feed', {posts:posts});

}

// module.exports.likePost = function(req, res){
//     Painting.findById(req.params.id, function(err, post){
//         if(err){console.log(err); return;}
//         post.likesCount++;
//         post.save();
//         return res.render('feed', {likeCount:likesCount});
//     })
// }



// for likes
module.exports.likePost = async (req, res) => {
    try {
      const currUser = await req.user
      const post = await Painting.findById(req.params.id);
  
      // check if post already been liked
      if (post.likes.includes(currUser._id)) {
        post.likes.pull(currUser._id);
        await post.save();
  
        return res.status(400).json({ msg: "Disliked" });
      } else {
        post.likes.push(currUser._id);
  
        await post.save();
        return res.json({ msg: "Liked" });
      }
    } catch (error) {
      // console.log(error.message);
      return res.status(500).json({ msg: error.message });
    }
  };
  
  
  