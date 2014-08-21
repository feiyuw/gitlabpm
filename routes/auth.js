function checkLogin(req, res, next) {
    if(!req.session.user) {
        req.flash('error', 'please login first!');
        res.redirect('/users/login');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if(req.session.user) {
        req.flash('error', 'already login!');
        res.redirect('back');
    }
    next();
}

exports.checkLogin = checkLogin;
exports.checkNotLogin = checkNotLogin;
