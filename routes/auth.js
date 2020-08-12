var express = require('express');
var router = express.Router();

let nextUserId = 1;

router.get('/login', function (req, res) {
  if (req.session.userId) {
    res.redirect('/');
  }

  res.header('Cache-Control', 'no-cache');
  res.render('authLogin');
});

router.post('/login', function(req, res, next) {
  const user = {
    _id: nextUserId++,
    username: req.body.username,
  };

  console.debug('login user = %j', user);

  // for session
  req.session.user = user
  req.session.userId = user._id

  res.redirect('/')
});

router.get('/logout', function (req, res, next) {
  req.session.user = null;
  req.session.userId = null;
  res.redirect('/auth/login')
})

module.exports = router;
