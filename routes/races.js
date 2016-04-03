var express = require('express');
var router = express();
var Race;
var _ = require('underscore');
var handleError;
var async = require('async');
var auth = require('../modules/authen');

/**
 * Returns all the Races in Json based on the Acceptance header or otherwise renders the view.
 * @param {string} request - The request with the potential Acceptance header.
 * @param {string} response - The reponse.
 */
function getRaces(req, res){
	if(req.headers.accept.indexOf("application/json") > -1){
		Race.get({
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
		res.render('races', { title: 'Races view', user: req.user });
	}
}

/**
 * Add a new Race into the database.
 * @param {string} request - The request with the parameters for a new Race.
 * @param {string} response - The reponse.
 */
function addRace(req, res){
	Race.add({
		data: new Race(req.body),
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
 * Add a new Location into a Race with an _id.
 * @param {string} request - The request with the parameters for a new Location.
 * @param {string} response - The reponse.
 */
function addLocation(req, res){
	Race.addLocation({
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
 * Updates a certain Race with the _id in the request body.
 * @param {string} request - The request with the parameters for the be updated Race.
 * @param {string} response - The reponse.
 */
function updateRace(req, res){
	Race.update({
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
 * Deletes a certain Race with the _id in the request body.
 * @param {string} request - The request with the parameters for the be deleted Race.
 * @param {string} response - The reponse.
 */
function deleteRace(req, res){
	Race.delete({
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
 * Deletes a User from a Race, both the User _id and Race _id are in the request body. 
 * @param {string} request - The request with the parameters for the be deleted User in a certain Race.
 * @param {string} response - The reponse.
 */
function deleteParticipantRace(req, res){
	Race.removeParticipant({
		data: req.body,
		collection: 'users',
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
 * Deletes a Location from a Race, both the Location _id and Race _id are in the request body. 
 * @param {string} request - The request with the parameters for the be deleted Location in a certain Race.
 * @param {string} response - The reponse.
 */
function deleteLocationRace(req, res){
	Race.removeLocation({
		data: req.body,
		collection: 'locations',
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
 * Lets a User with an _id join a Race with an _id. 
 * @param {string} request - The request with the parameters for the be updated User in a certain Race.
 * @param {string} response - The reponse.
 */
function joinRace(req, res){
	Race.joinRace({
		data: req.body,
		callback: function(err, data){
			if(err){ return handleError(req, res, 500, err); }
			else {
				res.status(201);
				res.json(data);
			}
		},
		error: function(err, data){
			if(err){ return handleError(req, res, 500, err); }
			else {
				res.status(201);
				res.json(data);
			}
		}
	});
}

// Routing
router.route('/').get(getRaces).post(auth('admin'), addRace);

router.route('/:id').get(getRaces).put(auth('admin'), updateRace).delete(auth('admin'), deleteRace);

router.route('/:id/participant/').delete(auth('admin'), deleteParticipantRace).put(joinRace);

router.route('/:id/location').put(auth('admin'), addLocation).delete(auth('admin'), deleteLocationRace);

// Export
module.exports = function (mongoose, errCallback){
	Race = mongoose.model('Race');
	handleError = errCallback;
	return router;
};