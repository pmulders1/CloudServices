var express = require('express');
var router = express();
var User;
var _ = require('underscore');
var handleError;
var async = require('async');

function getUsers(req, res){
	var query = {};
	if(req.params.id){
		query._id = req.params.id;
	} 

	var result = User.find(query);

	result.exec(function(err, data){
		if(err){ return handleError(req, res, 500, err); }

		// We hebben gezocht op id, dus we gaan geen array teruggeven.
		if(req.params.id){
			data = data[0];
		}
		res.json(data);
	});
}

function addUser(req, res){
	var user = new User(req.body);
	user.save(function(err, data){
		if(err){ return handleError(req, res, 500, err); }
		else {
			res.status(201);
			res.json(data);
		}
	});
}

// Routing
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Express' });
});

router.route('/:id')
	.get(getUsers);

router.route('/add')
	.post(addUser);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing user routing module');
	User = mongoose.model('User');
	handleError = errCallback;
	return router;
};