var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/rooms/room01');
});

// Choose from one of three rooms
router.get('/room01', function(req, res, next) {
  res.render('counter', { testHeader: 'test' });
});

/*
router.get('/room02', function(req, res, next) {
  res.send('This is room 2.');
});
router.get('/room03', function(req, res, next) {
  res.send('This is room 3.');
});
*/

module.exports = router;
