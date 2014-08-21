var Post = require('../models/post.js');
var User = require('../models/user.js');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    Post.getAll(null, function(err, posts) {
        if (err) {
            posts = [];
        }
        res.render('index', { title: 'Home',
            user: req.session.user,
            posts: posts,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});

router.get('/u/:name', function(req, res) {
    User.get(req.params.name, function(err, user) {
        if(!user) {
            req.flash('error', 'user not exist!');
            return res.redirect('/');
        }
        Post.getAll(user.name, function(err, posts) {
            if(err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('user', {
                title: user.name,
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
});

router.get('/u/:name/:day/:title', function (req, res) {
    Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
        if (err) {
            req.flash('error', err); 
            return res.redirect('/');
        }
        res.render('article', {
            title: req.params.title,
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});

module.exports = router;
