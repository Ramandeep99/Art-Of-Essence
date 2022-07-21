const Artist = require('../models/user');
const Painting = require('../models/item')
 
exports.showArtists = async (req, res) => {
    const paints = await Painting.find();
    const artists = await Artist.find()
    const vis = new Map();
    paints.forEach(p =>{
        if(vis.has(JSON.stringify(p.artist)) == false){
            vis.set(JSON.stringify(p.artist) , 1);
        } 
    })
    // console.log(vis)
    const arr = []
    vis.forEach(art => {
        arr.push(art);
    });
    res.render('artists', {artists : arr});
}

