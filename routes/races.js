var express = require('express');
var router = express();
var Race;
var _ = require('underscore');
var handleError;
var async = require('async');


/**
 * Gets a race.
 * @param {string} request - The request.
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
		res.render('races', { title: 'Races view' });
	}
}

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

//users/me/races
//races

// Routing
router.route('/').get(getRaces).post(addRace);

router.route('/:id').get(getRaces).put(updateRace).delete(deleteRace);

router.route('/:id/participant/').delete(deleteParticipantRace).put(joinRace);

router.route('/:id/location').put(addLocation).delete(deleteLocationRace);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing races routing module');
	Race = mongoose.model('Race');
	handleError = errCallback;
	return router;
};