function checkAuthenticated(req, res, next){
    console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/login');
}

function checkNotAuthenticated(req, res, next){
    // console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return next(); 
}

function setAuthenticatedUser(req, res, next){
    // console.log(req.user)
    if(req.isAuthenticated()){
        //req.user contains the information of the current signed in user and we are sending this to locals for the views
        res.locals.user = req.user;
    }
    return next();
}

module.exports = {checkAuthenticated, checkNotAuthenticated , setAuthenticatedUser};

