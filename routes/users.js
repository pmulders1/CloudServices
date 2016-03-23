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
	console.log(" kippetje tok")
	User.add({
		data: req.body,
		callback: function(err, data){
			console.log(err);
			if(err){ console.log(' koetje koe' );return handleError(req, res, 500, err); }
			
				res.status(201);
				res.json(data);
			
		}
	});
}

function updateUser(req, res){
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
	User.delete({
		_id: req.params.id,
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

router.route('/:id').get(getUsers).put(updateUser).delete(deleteUser);

router.route('/all').get(getUsers);

router.route('/add').post(addUser);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing user routing module');
	User = mongoose.model('User');
	handleError = errCallback;
	return router;
};