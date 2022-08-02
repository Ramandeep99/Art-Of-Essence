const Artist = require('../models/user');
const Painting = require('../models/item')

exports.showArtists = async (req, res) => {
    const otherUser = await req.user
    const paints = await Painting.find();
    const artists1 = await Artist.find()
    const vis = new Map();
    paints.forEach(p =>{
        if(vis.has(JSON.stringify(p.artist)) == false){
            vis.set(JSON.stringify(p.artist) , 1);
        } 
    })
    // console.log(vis)
    const arr = []
    artists1.forEach(artist=>{
        if(vis.has(JSON.stringify(artist._id)) == true){
            arr.push(artist);
        }
    })
    res.render('artists', {artists : arr , user : otherUser});
}

