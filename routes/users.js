var express = require('express');
var router = express();
var User;
var _ = require('underscore');
var handleError;
var async = require('async');

function getUsers(req, res){
	User.get({
		filter: req.query,
		callback: function(err, data){
			if(err){ return handleError(req, res, 500, err); }
			else {
				res.status(201);
				res.json(data);
			}
		}
	});
}

function addUser(req, res){
	User.add({
		data: new User(req.body),
		callback: function(err, data){
			if(err){ return handleError(req, res, 500, err); }
			else {
				res.status(201);
				res.json(data);
			}
		}
	});
}

// Routing
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Express' });
});

router.route('/all').get(getUsers);

router.route('/add').post(addUser);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing user routing module');
	User = mongoose.model('User');
	handleError = errCallback;
	return router;
};