//sending flash request to response(to pass flash messages to ejs templates)
module.exports.setFlash = function(req, res, next){
    console.log('1');
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
}