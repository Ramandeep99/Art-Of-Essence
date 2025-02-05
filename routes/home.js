const express = require('express');
const { use } = require( 'passport' );
const router = express.Router();
const path  = require('path');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
let Items = require(path.join(__dirname, '../models/index.js')).items;
let Bids = require(path.join(__dirname, '../models/index.js')).bids;
// let Categories = require(path.join(__dirname, '../models/index.js')).categories;
let Users = require(path.join(__dirname, '../models/index.js')).users;
let Sessions = require(path.join(__dirname, '../models/index.js')).sessions;
const authenticate = require('./functions').checkAuthenticated
const setAuthenticatedUser = require('./functions').setAuthenticatedUser

let message = {
    type: 'noItem',
    content: {
        currentItem: [],
        degree: 0,
        previousBidsUser: [],
        current_price: 0,
        winner : []
    },
    private: {
        previousBids: [],
    }
}

async function checkNewItem(){
    let checkNewItemId = setInterval(() => {
        if(message.type === 'noItem'){
            if(message.content.currentItem[0] !== undefined){
                (async ()=>{
                    let check = await Items.find({bidded: false}).sort({start_bid_date: 1}).limit(1);
                    if(check.length > 0){
                        pickItem();
                    }
               })();
            }
            else {
               (async ()=>{
                    let check = await Items.find({bidded: false}).sort({start_bid_date: 1}).limit(1);
                    if(check.length > 0){
                        pickItem();
                    }
               })();
            }
        }
        else if(message.type === 'inWait'){
            (async ()=>{
                let check = await Items.find({bidded: false}).sort({start_bid_date: 1}).limit(1);
                if(check.length > 0){
                    // if there is new item and bid date is less than the current item that in wait
                    
                    if(check[0]._id != message.content.currentItem[0]._id){
                        if(check[0].start_bid_date < message.content.currentItem[0].start_bid_date){
                            message.type = 'itemPlaced';
                            broadcast();
                            global.clearInterval(global.inWaitId);
                            // replace the new one
                            message.content.currentItem = check;
                            setTimeout(() => {
                                pickItem();
                            }, 1000);
                        }
                    }
                }
           })();
        }
    }, 5000);
}

checkNewItem();

async function pickItem(){
    try {
        let check = await Items.find({bidded: false}).sort({start_bid_date: 1}).limit(1);
        let noItemId;
        if(check.length > 0){
            message.content.currentItem = check;
            message.content.previousBidsUser = [];
            message.content.currentItem[0].start_bid_date;
            // is there remain time for the current item to be started
            if(message.content.currentItem[0].start_bid_date >= new Date().getTime()){ 
                inWait();
            }
            else {
                bidLoop();
            }
            message.content.current_price = check[0].basePrice;
        }
        else {
            // there is no item in queue to bid
            noItem();
        }
    }
    catch(err){
        console.log(err);
    }
}

pickItem();

router.get('/auction', authenticate,setAuthenticatedUser, (req, res)=>{
    (async ()=>{
        try {
            if(message.type !== 'noItem' && message.content.currentItem[0] !== undefined){
                let loggedInUser = await req.user;
                let previous_bids = [];
                // select an item from db
                let currentItem = message.content.currentItem;
                let arr = [];
                for (bid in message.content.previousBidsUser) {
                    arr.push(bid);
                }
                for (let n=arr.length; n--; ){
                    let prop = message.content.previousBidsUser[arr[n]];
                    previous_bids.push(prop);
                }
                // let category = await Categories.find({_id: currentItem[0].category_id});
                let owner = await Users.find({_id: currentItem[0].artist});   // artist
                let currentPrice = message.content.current_price;
                let previousBids = message.content.previousBidsUser;
                let startBidDate = message.content.currentItem.start_bid_date
                // console.log(previousBids)
                // console.log(previous_bids)
                res.render('auction', {message,currentItem, previousBids, currentPrice, previous_bids, startBidDate, loggedInUser});
            }
            else{
                let noItem = true;
                let user = await req.user
                res.render('emptyAuction',  {noItem , user});
            }
        }
        catch(err){
            console.log(err);
        }
    })();
});

function broadcast(){
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({type: message.type, content: message.content}));
        }
    });
}

function noItem(){
    message.type = 'noItem';
    broadcast();
}

let bidPlaced = false;
function inWait(itemPlaced){
    message.type = 'inWait';
    broadcast();
     global.inWaitId = global.setInterval(()=>{
        if(message.content.currentItem[0].start_bid_date < new Date().getTime()) {
            global.clearInterval(inWaitId);
            // bid start
            bidPlaced = false;
            bidLoop();
        }
    }, 1000);

}

function bidLoop(){
    let i = 0;
    function bidStart(){
        i=0;
        message.type = 'bidStart';
        message.content.degree = i;
        broadcast();
        global.bidStartId = setInterval(() => {
            message.content.degree = i;
            // 360 is the circle timer degree
            if(bidPlaced){
                global.clearInterval(bidStartId);
                bidPlaced = false;
                bidStart();
                broadcast();
            }
            if(i > 360) {
                global.clearInterval(bidStartId);
                // bonus time
                message.type = 'bonusTime'
                broadcast();
                // start the bonus after 2s
                setTimeout(() => {
                    bonusStart();
                }, 2000);
            }
            i++;
        }, 30);
    }

    setTimeout(()=>{
        bidStart();
    }, 1000);


    function bonusStart(){
        // bonus start
        i = 0;
        message.type = 'bonusStart';
        global.bonusStartId = setInterval(() => {
            if(i <= 360) {
                message.content.degree = i;
                if(i == 0){
                    broadcast();
                }
            }
            else {
                global.clearInterval(bonusStartId);
                // bonus time finished
                message.content.degree = 0;
                if(message.content.previousBidsUser.length > 0){
                    console.log(message.content.previousBids)

                    message.type = 'itemSold';
                    Users.findOne({_id : message.private.previousBids[message.private.previousBids.length-1].user_id}).then(function(result) {
                        message.content.winner.push(result)
                        // console.log(result)
                        broadcast();
                    })
                    setTimeout(()=>{
                        nextItem();
                    }, 2000);
                }
                else {
                    nextItem();
                }
                
            }
            i++;
        }, 30);
    }
}



// next item
function nextItem(){
    message.type = 'nextItem';
    broadcast();
    (async()=>{
        // if item sold
        if(message.content.previousBidsUser.length > 0){
            // update the sold and bidded item
            // console.log(message.content.previousBidsUser)
            // console.log(message.private.previousBids[message.private.previousBids.length-1].user_id)
            
            
            await Items.updateOne({_id: message.content.currentItem[0]._id}, {bidded: true, sold: true});
            await Bids.create({
                item_id: message.content.currentItem[0]._id,
                user_id: message.private.previousBids[message.private.previousBids.length-1].user_id,
                price: message.content.current_price
            });
            // console.log(message.private.previousBids[message.private.previousBids.length-1].artist)
            // pick a new item in db
            pickItem();
        }
        else {
            await Items.updateOne({_id: message.content.currentItem[0]._id}, {bidded: true});
            pickItem();
        }
        message.content.previousBidsUser = [];
        message.content.current_price = 0;
        
    })();
}


wss.on('connection', function connection(ws, req) {
        if(req.headers.cookie){
            let cookie = decodeURIComponent(req.headers.cookie);
            let str = cookie.split('s:')[1];
            let userCookie = str.split('.')[0];
            (async ()=>{
                let checkUser = await Sessions.find({_id: userCookie});
                if(checkUser.length > 0){
                    let expireDate, found = false;
                    for(let i=0; i< checkUser.length; i++){
                        expireDate = Date.parse(checkUser[i].expires);
                        // if session not expired
                        if(expireDate > new Date().getTime()){
                            found = true;
                            if(JSON.parse(checkUser[i].session).passport){
                                let userId = JSON.parse(checkUser[i].session).passport.user;
                                let user = await Users.find({_id: userId}, {_id: 1, address: 1});
                                if(user.length > 0){
                                    // console.log(user, 1)
                                    ws.user = user;
                                    // console.log(ws.user , 2)
                                }
                                else
                                    ws.user = undefined;
                            }
                            else
                                ws.user = undefined;
                        }
                    }
                    // if no session found in db
                    if(!found)
                        ws.user = undefined;
                }
                else 
                    ws.user = undefined;
            })();
        }
        else 
            ws.user = undefined;
        // console.log(ws.user)
    
    ws.on('message', async function incoming(data) {
        let parsed = JSON.parse(data);
        if((message.type == 'bidStart' || message.type == 'bonusStart') && parseInt(parsed.price) > message.content.current_price){
            if(ws.user !== undefined){
                // console.log(message.content.previousBidsUser)
                // console.log(ws.user[0], 3)
                const user = await Users.findOne({_id : ws.user[ws.user.length-1]._id})
                console.log(user.name)
                message.content.previousBidsUser.push({price: parsed.price, user_id: ws.user[0]._id , name : user.name});
                message.private.previousBids.push({price: parsed.price, user_id: ws.user[0]._id , name : user.name});
                message.content.current_price = parseInt(parsed.price);
                global.clearInterval(global.bidStartId);
                global.clearInterval(global.bonusStartId);
                // console.log(message.content.previousBidsUser)
                message.type = 'bidPlaced';
                broadcast();
                bidPlaced = true;
                // start bid timer again
                bidLoop();
            }
        }
    });
    ws.send(JSON.stringify({type: message.type, content: message.content}));
});


module.exports = router;

// 318 , 219