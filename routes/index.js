var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Rate the Cars' });
});

router.get('/standings', function(req, res, next) {
  res.render('standings', { title: 'Standings' });
});

module.exports = router;
