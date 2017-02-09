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
	var getImagesQuery = "SELECT * FROM images WHERE id NOT IN"+
	"(SELECT imageID FROM votes WHERE ip = '"+req.ip+"');";
	connection.query(getImagesQuery, (error, results, fields)=>{
		var randomIndex = Math.floor(Math.random() * results.length);
		console.log(results.length);
		// res.json(results);
		if(results.length === 0){
			// res.send('nope');
			res.render('index', { msg: "Thanks for voting! See the results above in the standings!", title: 'Rate the Cars' });
		}else{
			res.render('index', {
				title: 'Rate the Cars',
				image: results[randomIndex].imageURL,
				imageID: results[randomIndex].id,
				imageName: results[randomIndex].imageName
			});
		}
	});
});

router.get('/vote/:voteDirection/:imageID', (req, res, next)=>{
	var imageId = req.params.imageID;
	var voteDirection = req.params.voteDirection;
	if (voteDirection === "up"){
		voteDirection = 1;
	}else{
		voteDirection = -1;
	}
	var insertVoteQuery = "INSERT INTO votes (ip, imageID, voteDirection) VALUES ('"+req.ip+"',"+imageId+",'"+voteDirection+"')";
	connection.query(insertVoteQuery, (error, results, fields)=>{
		if (error) throw error;
		res.redirect('/');
	});
});

router.get('/standings', (req, res, next)=>{
	// var getCarsQuery = "SELECT * FROM votes";
	// connection.query(getCarsQuery, (error, results, fields)=>{

		res.render('standings', { title: 'Standings' });
	// });
});

router.get('/testQ', (req, res, next)=>{
	// var id1 = 1;
	// var id2 = 3;
	// var query = "SELECT * FROM images WHERE id > ? AND < ?";
	// connection.query(query, [id1, id2], (error, results, fields)=>{
	// 	res.json(results);
	// });
	var imageIdVoted = 14;
	var votedDirection = 1;
	var insertQuery = "INSERT INTO votes (ip, imageID, voteDirection) VALUES ('?','?','?')";
	connection.query(insertQuery, [req.ip, imageIdVoted, votedDirection], (error, results, fields)=>{
		var query = "SELECT * FROM votes";
		connection.query(query, (error, results, fields)=>{
			res.json(results);
		});
	});
});


module.exports = router;
