var express = require('express');
var router = express();
var Race;
var _ = require('underscore');
var handleError;
var async = require('async');

function getRaces(req, res){
	Race.get({
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
		}
	});
}

// Routing
router.get('/', function(req, res, next) {
  res.render('races', { title: 'Express' });
});

router.route('/:id').get(getRaces).put(updateRace).delete(deleteRace);

router.route('/:id/participant').delete(deleteParticipantRace);

router.route('/:id/location').put(addLocation).delete(deleteLocationRace);

router.route('/:id/join').put(joinRace);

router.route('/all').get(getRaces);

router.route('/add').post(addRace);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing races routing module');
	Race = mongoose.model('Race');
	handleError = errCallback;
	return router;
};