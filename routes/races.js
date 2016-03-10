var express = require('express');
var router = express();
var Race;
var _ = require('underscore');
var handleError;
var async = require('async');
var mongoose = require('mongoose');

function getRaces(req, res){
	var query = {};
	if(req.params.id){
		query._id = req.params.id;
	} 

	var result = Race.find(query).populate('locations').populate('participants').exec(function(err, data){
		if(err){ return handleError(req, res, 500, err); }

		// We hebben gezocht op id, dus we gaan geen array teruggeven.
		if(req.params.id){
			data = data[0];
		}
		res.json(data);
	});
}

function addRace(req, res){
	var race = new Race(req.body);
	race.save(function(err, savedRace){
		if(err){ return handleError(req, res, 500, err); }
		else {
			res.status(201);
			res.json(savedRace);
		}
	});
}

function joinRace(req, res){


	Race.findByIdAndUpdate(
	    req.body.raceid,
	    {
	    	$push: {participants: req.body.participantid}
	    },
	    {
	    	safe: true, upsert: true, new : true
	    },
	    function(err, model) {
	        console.log(err);
	        console.log(model);
	    }
	);
}

// Routing
router.get('/', function(req, res, next) {
  res.render('races', { title: 'Express' });
});

router.route('/addrace')
	.post(addRace);

router.route('/races')
	.get(getRaces);

router.route('/joinrace')
	.post(joinRace);

router.route('/:id')
	.get(getRaces);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing races routing module');
	Race = mongoose.model('Race');
	handleError = errCallback;
	return router;
};