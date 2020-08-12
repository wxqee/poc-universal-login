var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.header('Cache-Control', 'no-cache');
  res.render('index', { title: 'Express' });
});

module.exports = router;
