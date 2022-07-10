
const Painting = require('../models/paintingModel');
const Artist = require('../models/artistModel');
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
        console.log(req.file);

        //console.log(Painting.avatarPath + '/' + req.file.filename);
        //console.log(req.body);

        Artist.findById(req.user.id, function(err, user){
            Painting.create({
                title: req.body.title,
                description: req.body.description,
                painting: req.file.path,
                basePrice: req.body.basePrice,
                artist: req.user.id
             }, function(err, painting){
                if(err){console.log('err', err); return;}
                
                user.posts.push(painting);
                user.save();
                return res.render('afterPostUpload')
             })
        })

        
    })
}
