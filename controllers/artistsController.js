const Artist = require('../models/userModel');
 
exports.showArtists = async (req, res) => {
    const artists = await Artist.find()
    const arr = []
    artists.forEach(art => {
        if(art.posts.length > 0){
            arr.push(art);
        }
    });
    res.render('artists', {artists : arr});

}

