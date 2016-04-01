var express = require('express');
var router = express();
var Location;
var _ = require('underscore');
var handleError;
var async = require('async');

/**
 * Returns all the Locations in Json.
 * @param {string} request - The request.
 * @param {string} response - The reponse.
 */
function getLocations(req, res){
	Location.get({
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

/**
 * Adds a User with an _id on a Location with an _id.
 * @param {string} request - The request.
 * @param {string} response - The reponse.
 */
function tagUser(req, res){
	Location.tagUser({
		data: req.body,
		callback: function(err, data){
			if(err){ return handleError(req, res, 500, err); }
			else {
				res.status(201);
				res.json(data);
			}
		}, error: function(err, data){
			return handleError(req, res, 500, err);
		}
	});
}

// Routing

router.route('/')
	.get(getLocations);

router.route('/:id')
	.get(getLocations).put(tagUser);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing locations routing module');
	Location = mongoose.model('Location');
	handleError = errCallback;
	return router;
};