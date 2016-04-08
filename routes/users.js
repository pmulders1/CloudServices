var express = require('express');
var router = express();
var User;
var Race;
var _ = require('underscore');
var handleError;
var async = require('async');
var auth = require('../modules/authen');

/**
 * Returns all the Users in Json based on the Acceptance header or otherwise renders the view.
 * @param {string} request - The request with the potential Acceptance header.
 * @param {string} response - The reponse.
 */
function getUsers(req, res){
	if(req.headers.accept.indexOf("application/json") > -1){
		User.get({
			filter: req.query,
			callback: function(err, data){
				if(err){ return handleError(req, res, 500, err); }
				else {
					var data = {
						data: data,
						pagenr: data.pagenr,
						itemsPerPage: data.itemsPerPage
					};
					res.status(201);
					res.setHeader('Content-Type', 'application/json');
					res.send(JSON.stringify(data, null, '\t'));
				}
			}
		});
	}else{
		res.render('users', { title: 'Users view', user: req.user });
	}
}

/**
 * Add a new User into the database.
 * @param {string} request - The request with the parameters for a new User.
 * @param {string} response - The reponse.
 */
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

/**
 * Updates a certain User with the _id in the request body.
 * @param {string} request - The request with the parameters for the be updated User.
 * @param {string} response - The reponse.
 */
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

/**
 * Deletes a certain User with the _id in the request body.
 * @param {string} request - The request with the parameters for the be deleted User.
 * @param {string} response - The reponse.
 */
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

/**
 * Returns the Races which the User with an _id is enrolled.
 * @param {string} request - The request with the parameters for the User.
 * @param {string} response - The reponse.
 */
function getMeRaces(req, res){
	Race.getJoinedRaces({
		_id: req.user._id,
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

router.route('/me/races').get(getMeRaces);

router.route('/').get(getUsers).post(addUser);

// Export
module.exports = function (mongoose, errCallback){
	User = mongoose.model('User');
	Race = mongoose.model('Race');
	handleError = errCallback;
	return router;
};