const Painting = require('../models/paintingModel');


module.exports.showAuctionPage = function(req, res){
    Painting.findById(req.params.id)
    .exec(function(err, painting){
        if(err){console.log("Error in getting painting"); return;}
        return res.render('auction', {painting:painting});
    })
}