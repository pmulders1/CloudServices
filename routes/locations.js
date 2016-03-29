var express = require('express');
var router = express();
var Location;
var _ = require('underscore');
var handleError;
var async = require('async');

function getLocations(req, res){
	var query = {};
	if(req.params.id){
		query._id = req.params.id;
	} 

	var result = Location.find(query);

	result.exec(function(err, data){
		if(err){ return handleError(req, res, 500, err); }

		// We hebben gezocht op id, dus we gaan geen array teruggeven.
		if(req.params.id){
			data = data[0];
		}
		res.json(data);
	});
}

// Routing
router.get('/', function(req, res, next) {
  res.render('locations', { title: 'Express' });
});

router.route('/all')
	.get(getLocations);

router.route('/:id')
	.get(getLocations);

// Export
module.exports = function (mongoose, errCallback){
	console.log('Initializing locations routing module');
	Location = mongoose.model('Location');
	handleError = errCallback;
	return router;
};