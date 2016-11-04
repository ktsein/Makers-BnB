var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

// GET /profile
router.get('/profile', function(req, res, next){
  if (! req.session.userId) {
    var err = new Error("You are not authorized to view this page.");
    error.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
    .exec(function (error, user){
      if (error){
        return next(err);
      } else {
        // getting data out of MongoDB
        return res.render('profile', {title: 'Profile', name: user.name, favorite: user.favoriteBook });
      }
    });
});

// GET /login
router.get('/login', function(req, res, next){
  return res.render('login', {title: 'Log In'});
});

// POST /login
router.post('/login', function(req, res, next){
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user){
      if (error || !user) {
        var err = new Error('Something is not right. Thank Fool!');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and password are required. Moron!');
    err.status = 401;
    return next(err);
  }
});

// GET /register
router.get('/register', function(req, res, next) {
  return res.render('register', { title: 'Sign Up'});
});

// POST /register
router.post('/register', function(req, res, next) {
  if (req.body.name &&
    req.body.email &&
    req.body.password &&
    req.body.confirmPassword){
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Password do not match. Moron!');
        err.status = 400;
        return next(err);
      }

      var userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };

      User.create(userData, function(error, user){
        if(error){
          return next(error);
        } else {
          // So that user is kept logged in once logged in
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      })

    } else {
      var err = new Error('All field required.');
      err.status = 400;
      return next(err);
    }
});

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
