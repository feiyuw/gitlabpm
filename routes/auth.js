var ldap = require('ldapjs');


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

module.exports.checkLogin = checkLogin;
module.exports.checkNotLogin = checkNotLogin;
