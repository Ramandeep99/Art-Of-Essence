
const Painting = require('../models/item');
const Artist = require('../models/userModel');
const path = require('path')

// module.exports.uploadPainting = function(req, res){
//     Painting.uploadedPainting(req, res, function(err){
//         if(err){console.log(err); return;}
//         const painting = Painting.avatarPath + "/" + req.file.filename;
//         console.log(painting);
        
//     })
// }

module.exports.uploadPost = function(req, res){
    Painting.uploadedPainting(req, res, function(err){
        // console.log(req.file);

        //console.log(Painting.avatarPath + '/' + req.file.filename);
        // console.log(req.body);
        // console.log(req.user._id)
            
    
        let start_bid_date = new Date().getTime() + 10000;

        req.user.then(function(result) {
            // console.log(result._id)

        Artist.findById(result._id, function(err, user){
            Painting.create({
                title: req.body.title,
                description: req.body.description,
                painting: req.file.path,
                basePrice: req.body.basePrice,
                artist: result._id,
                start_bid_date : start_bid_date
             }, function(err, painting){
                if(err){console.log('err', err); return;}
                
                painting.save();
                return res.render('afterPostUpload')
             })
        })

    })
    })
}


exports.getPainting = (req, res) => {
    return res.render('post');
}


exports.getSinglePainting = async (req,res) =>{
    const singlePainting = await Painting.findOne({_id : req.params.id});
    res.render('painting' , {painting : singlePainting});
}





