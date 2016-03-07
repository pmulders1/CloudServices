var express = require('express');
var router = express.Router();
var User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function GetUsers(req, res){
	var query = {};
	if(req.params.id){
		query._id = req.params.id;
	} 

	var result = User.find(query);
	console.log(User);
	result.exec(function(err, data){
		if(err){ return handleError(req, res, 500, err); }

		// We hebben gezocht op id, dus we gaan geen array teruggeven.
		if(req.params.id){
			data = data[0];
		}
		res.json(data);
	});
}

/* GET Userlist page. */
router.route('/userlist').get(GetUsers);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing books routing module');
	User = mongoose.model('PowerUsers');
	return router;
};
