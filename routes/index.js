var express = require('express');
var router = express.Router();
var config = require('../config/config');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.database
});

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	var getImagesQuery = "SELECT * FROM images";
	connection.query(getImagesQuery, (error, results, fields)=>{
		var randomIndex = Math.floor(Math.random() * results.length);
		var imageUrl = results[randomIndex].imageURL;
		var imageID = results[randomIndex].id;
		// res.json(results);
		res.render('index', { title: 'Rate the Cars', image: imageUrl, imageID: imageID});
	});
});

router.get('/standings', function(req, res, next) {
	res.render('standings', { title: 'Standings' });
});

router.get('/vote/:voteDirection/:imageID', (req, res, next)=>{
	var imageId = req.params.imageID;
	var voteDirection = req.params.voteDirection;
	var insertVoteQuery = "INSERT INTO votes (ip, imageID, voteDirection) VALUES ('"+req.ip+"',"+imageId+",'"+voteDirection+"')";
	res.send(insertVoteQuery);
});

module.exports = router;
