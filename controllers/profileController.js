const Artist = require('../models/user')
const Painting = require('../models/item')

// module.exports.showProfile = function(req, res){
//     Painting.find({}, function(err, posts){
//         if(err){console.log(err); return;}
//         //console.log(posts)
//         return res.render('profile', {posts:posts})
//     })
// }

module.exports.showProfile = async function(req, res){
    const posts = []
    const loggedInUser = await req.user
    const currUser = await Artist.findOne({_id: req.params.id})
    const Paintings = await Painting.find()
    Paintings.forEach(post => {
        if(post.artist == req.params.id){
            posts.push(post)
        }
    });
    // console.log(currUser)
    // console.log(posts)
    return res.render('profile', {artist:currUser , posts:posts , otherUser : loggedInUser})
}



module.exports.follow_put = async (req, res) => {
    
    try {
        const current = await req.user
        const to_follow = await Artist.findById(req.params.id);
        console.log(current)
        console.log(to_follow)
        // check if already a follower
        if (current.following.includes(req.params.id)) {

            current.following.pull(req.params.id)
            to_follow.followers.pull(current)

            await current.save();
            await to_follow.save();

            return res.status(200).json({ "msg": 'Unfollowed' })
        }
        else {

            current.following.push(req.params.id)
            to_follow.followers.push(current)

            await current.save();
            await to_follow.save();

            return res.status(200).json({ "msg": 'Followed' })
        }

    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: error.message });
    }
}


