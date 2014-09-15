var checkLogin = require('./auth.js').checkLogin;
var checkNotLogin = require('./auth.js').checkNotLogin;
var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');
var settings = require('../settings');

/* GET users listing. */
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
  var client = ldap.createClient({
     url: settings.ldapServer,
  });
  client.search(settings.ldapBaseDN, {filter: 'uid=' + req.body.name, scope: settings.ldapSearchScope}, function(err, ldapRes) {
    if(err) {
      req.flash('error', err);
      return res.redirect('/users/login');
    }
    var userEntry = null;

    ldapRes.on('searchEntry', function(entry) {
      userEntry = entry.object;
      client.bind(userEntry.dn, req.body.password, function(err) {
        if(!err) {
          req.session.user = userEntry.cn;
          req.flash('success', 'login successfully!');
          return res.redirect('/');
        } else {
          req.flash('error', 'incorrect password!');
          return res.redirect('/users/login');
        }
      });
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
