var express = require('express');
var router = express();
var Race;
var _ = require('underscore');
var handleError;
var async = require('async');

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

// Routing
router.route('/')
	.get(getRaces);

router.route('/:id')
	.get(getRaces);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing races routing module');
	Race = mongoose.model('Race');
	handleError = errCallback;
	return router;
};