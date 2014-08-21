var crypto = require('crypto');
var User = require('../models/user.js');
var checkLogin = require('./auth.js').checkLogin;
var checkNotLogin = require('./auth.js').checkNotLogin;
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.get('/login', checkNotLogin);
router.get('/login', function(req, res) {
    res.render('login', {
        title: 'login',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.get(req.body.name, function(err, user) {
        if(!user) {
            req.flash('error', 'user does not exists!');
            return res.redirect('/users/login');
        }
        if(user.password != password) {
            req.flash('error', 'incorrect password!');
            return res.redirect('/users/login');
        }
        req.session.user = user;
        req.flash('success', 'login successfully!');
        res.redirect('/');
    });
});

router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res) {
    res.render('reg', {
        title: 'register',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res) {
    // register function
    var name = req.body.name,
        password = req.body.password,
        passwordRepeat = req.body.passwordRepeat;
    if(password != passwordRepeat) {
        req.flash('error', 'password mismatched!');
        return res.redirect('/users/reg');
    }
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email
    });
    User.get(newUser.name, function(err, user) {
        if(user) {
            req.flash('error', 'user already exists!');
            return res.redirect('/users/reg');
        }
        newUser.save(function(err, user) {
            if(err) {
                req.flash('error', err);
                return res.redirect('/users/reg');
            }
            req.session.user = user;
            req.flash('success', 'Registed!');
            res.redirect('/');
        });
    });
});

router.get('/logout', checkLogin);
router.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', 'logout successfully');
    res.redirect('/');
});

module.exports = router;
