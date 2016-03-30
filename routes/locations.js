var express = require('express');
var router = express();
var Location;
var _ = require('underscore');
var handleError;
var async = require('async');

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

function tagUser(req, res){
	Location.tagUser({
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