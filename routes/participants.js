var express = require('express');
var router = express();
var Participant;
var _ = require('underscore');
var handleError;
var async = require('async');

function getParticipants(req, res){
	var query = {};
	if(req.params.id){
		query._id = req.params.id;
	} 

	var result = Participant.find(query);

	result.exec(function(err, data){
		if(err){ return handleError(req, res, 500, err); }

		// We hebben gezocht op id, dus we gaan geen array teruggeven.
		if(req.params.id){
			data = data[0];
		}
		res.json(data);
	});
}

function addParticipant(req, res){
	var participant = new Participant(req.body);
	participant.save(function(err, savedAuthor){
		if(err){ return handleError(req, res, 500, err); }
		else {
			res.status(201);
			res.json(savedAuthor);
		}
	});
}

// Routing
router.route('/')
	.get(getParticipants);

router.route('/:id')
	.get(getParticipants);

router.route('/addParticipant')
	.post(addParticipant);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing participant routing module');
	Participant = mongoose.model('Participant');
	handleError = errCallback;
	return router;
};