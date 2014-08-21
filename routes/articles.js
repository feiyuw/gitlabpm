var checkLogin = require('./auth.js').checkLogin;
var checkNotLogin = require('./auth.js').checkNotLogin;
var Post = require('../models/post.js');
var fs = require('fs');
var express = require('express');
var router = express.Router();

/* article related actions, include post, comment */
router.get('/post', checkLogin);
router.get('/post', function(req, res) {
    res.render('post', {
        title: 'New Article',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

router.post('/post', checkLogin);
router.post('/post', function(req, res) {
    var currentUser = req.session.user,
        post = new Post(currentUser.name, req.body.title, req.body.post);
    post.save(function(err) {
        if(err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', 'Post successfully!');
        res.redirect('/');
    });
});

router.get('/upload', checkLogin);
router.get('/upload', function(req, res) {
    res.render('upload', {
        title: 'File upload',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

router.post('/upload', checkLogin);
router.post('/upload', function(req, res) {
    for(var i in req.files) {
        if(req.files[i].size == 0) {
            fs.unlinkSync(req.files[i].path);
            console.log('Successfully remove an empty file!');
        } else {
            var targetPath = './public/images/' + req.files[i].originalname;
            fs.renameSync(req.files[i].path, targetPath);
            console.log('Successfully rename a file!');
        }
    }
    req.flash('success', 'file uploaded!');
    res.redirect('/articles/upload');
});

router.get('/edit/:name/:day/:title', checkLogin);
router.get('/edit/:name/:day/:title', function(req, res) {
    var currentUser = req.session.user;
    Post.edit(currentUser.name, req.params.day, req.params.title, function(err, post) {
        if(err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        res.render('edit', {
            title: 'Edit',
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});


router.post('/edit/:name/:day/:title', checkLogin);
router.post('/edit/:name/:day/:title', function(req, res) {
    var currentUser = req.session.user;
    Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function(err) {
        var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
        console.log('url: ' + url);
        if(err) {
            req.flash('error', err);
            return res.redirect(url);
        }
        req.flash('success', 'Updated!');
        res.redirect(url);
    });
});

router.get('/remove/:name/:day/:title', checkLogin);
router.get('/remove/:name/:day/:title', function(req, res) {
    var currentUser = req.session.user;
    Post.remove(currentUser.name, req.params.day, req.params.title, function(err) {
        if(err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        req.flash('success', 'Deleted!');
        res.redirect('/');
    });
});

module.exports = router;
