var express = require('express');
var router = express();
var User;
var _ = require('underscore');
var handleError;
var async = require('async');
var auth = require('../modules/authen');

function getUsers(req, res){
	if(req.headers.accept.indexOf("application/json") > -1){
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
	}else{
		res.render('users', { title: 'Users view' });
	}
}

function addUser(req, res){
	User.add({
		data: req.body,
		callback: function(err, data){
			if(err){ return handleError(req, res, 500, err); }
			else{
				res.status(201);
				res.json(data);
			}
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
router.route('/:id').get(getUsers).put(updateUser).delete(deleteUser);

router.route('/').get(getUsers).post(addUser);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing user routing module');
	User = mongoose.model('User');
	handleError = errCallback;
	return router;
};