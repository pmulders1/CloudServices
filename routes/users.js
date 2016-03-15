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
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(data, null, '\t'));
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

function updateUsers(req, res){
	console.log(req.body);
	User.update({
		data: req.body,
		callback: function(err, data){
			if(err){ return handleError(req, res, 500, err); }
			else {
				res.status(201);
				res.json(data);
			}
		}
	});
}

function deleteUser(req, res){
	User.remove({
		data: req.body,
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

router.route('/:id').get(getUsers).put(updateUsers).delete(deleteUser);

router.route('/all').get(getUsers);

router.route('/add').post(addUser);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing user routing module');
	User = mongoose.model('User');
	handleError = errCallback;
	return router;
};