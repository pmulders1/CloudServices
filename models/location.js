/**
 * A Model for Location
 * @module  Location
 * @exports Location
 */

var mongoose = require('mongoose');

var schema = mongoose.Schema({
	place_id: { type: String, required: true },
	name: { type:String, required: true },
	address: { type: String, required: true},
	users: [{
		type: mongoose.Schema.Types.ObjectId, ref: "User"
	}]
});

/**
 * Validation for the name path.
 * When a Location is saved, the name must be at least 3 characters long.
 * Otherwise a Location can't be saved.
 */
schema.path('name').validate(function(){
	return this.name.length > 2;
}, 'Name should be at least 3 characters long.');

// Statics 

/**
 * Static method to get the Locations fitting the filter criteria.
 * The user can enter parameters, pagenr and itemsPerPage, in the filter for pagination.
 * The default values for pagenr and itemsPerPage are respectively 1 and 20.
 */
schema.statics.get = function(options){
	var itemsPerPage = 20;
	var pagenr = 1;
	
	if(options.filter.pagenr && options.filter.itemsPerPage){
		pagenr = options.filter.pagenr;
		itemsPerPage = options.filter.itemsPerPage;
	}
	delete options.filter.pagenr;
	delete options.filter.itemsPerPage;

	var itemsToSkip = (pagenr - 1) * itemsPerPage;
	return this.find(options.filter).populate('users').skip(itemsToSkip).limit(itemsPerPage).lean().exec(function(res, data){
		data.pagenr = pagenr;
		data.itemsPerPage = itemsPerPage;
		options.callback(res, data);
	});
};

/**
 * Static method to tag a User to a Location.
 * Before a User can be saved, the race with an _id is checked to see if the Race hasn't started.
 * If the race hasn't started the User can't be tagged in the Location.
 * Otherwise, the User with an _id is pushed into the users array of Location.
 */
schema.statics.tagUser = function(options){
	var loc = mongoose.model('Location');
	var race = mongoose.model('Race');
	race.findOne({_id: options.data.race_id}).populate('users').populate('locations').exec(function(err, data){
		if(!data.hasStarted){
			err = {
				message: "You can't tag a location when race hasn't started"
			}
		}
		if(err){
			options.error(err, data);
		}else{
			loc.where('_id', options.data._id).update({$addToSet: {users: options.data.user_id}}, options.callback);
		}
	});
}

mongoose.model('Location', schema);
