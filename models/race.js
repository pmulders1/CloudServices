var mongoose = require('mongoose');

var schema = mongoose.Schema,
ObjectId = schema.ObjectId;

schema = mongoose.Schema({
	name: { type: String, unique: [true, "Please enter a unique name"]},
	hasStarted : { type: Boolean, default:false },
	locations: [{
		type: mongoose.Schema.Types.ObjectId, ref: "Location"
	}],
	users: [{
		type: mongoose.Schema.Types.ObjectId, ref: "User"
	}]
}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true 
	}
});

/**
 * Validation for the name path.
 * When a Race is saved, the name must be at least 3 characters long.
 * Otherwise a Race can't be saved.
 * @param {string} name
 */
schema.path('name').validate(function(){
	return this.name.length > 2;
}, 'Name should be at least 3 characters long.');

/**
 * Validation for the hasStarted path.
 * When a Race is saved this will check if the value of hasStarted is set to true.
 * Ifso, there must be at least on location in the locations array otherwise this will fail.
 * @param {boolean} hasStarted
 */
schema.path('hasStarted').validate(function(){

	if(this.hasStarted){
		return this.locations.length > 0;
	}

	return true;
}, 'Race must have at least one location');

// Virtuals 
/**
 * Virtual to show the length of the users array.
 */
schema.virtual('count.users').get(function () {
	return this.users.length;
});
/**
 * Virtual to show the length of the locations array.
 */
schema.virtual('count.locations').get(function () {
	return this.locations.length;
});
// /Virtuals

// Statics 
/**
 * Static method to get the Race fitting the filter criteria.
 * The user can enter parameters, pagenr and itemsPerPage, in the filter for pagination.
 * The default values for pagenr and itemsPerPage are respectively 1 and 20.
 * @param {string[]} options
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
	
	return this.find(options.filter).populate('users').populate('locations').skip(itemsToSkip).limit(itemsPerPage).lean().exec(function(res, data){
		data.pagenr = pagenr;
		data.itemsPerPage = itemsPerPage;
		options.callback(res, data);
	});
};

/**
 * Static method to get the User's joined races.
 * @param {string[]} options
 */
schema.statics.getJoinedRaces = function(options){
	return this.find({"users" : options._id}).exec(options.callback);
}
/**
 * Static method to add a certain Race to the schema.
 * @param {string[]} options
 */
schema.statics.add = function(options){
	options.data.save(options.callback)
}
/**
 * Static method to delete a certain Race from the schema.
 * When a Race is deleted all the Locations in the locations array will be deleted.
 * @param {string[]} options
 */
schema.statics.delete = function(options){
	var loc = mongoose.model('Location');
	var rac = mongoose.model('Race');
	var temp = this.findOne({_id: options._id}).populate('users').populate('locations').exec(function(err, data){
		data.locations.forEach(function(record){
			loc.remove({_id: record.id}).exec();
	    });
	    rac.remove({_id: options._id}, options.callback);
	});
}

/**
 * Static method to update a certain Race in the schema.
 * @param {string[]} options
 */
schema.statics.update = function(options){
	this.findOne({_id: options.data._id}).populate('users').populate('locations').exec(function(err, doc){
		doc.name = options.data.name;
		doc.hasStarted = options.data.hasStarted;
		doc.save(options.callback);
	});
}
/**
 * Static method to remove a certain User form the Race schema.
 * @param {string[]} options
 */
schema.statics.removeParticipant = function(options){
	this.where('_id', options.data._id).update({$pull: {users: options.data.itemId}}, options.callback);
}
/**
 * Static method to add a certain Location to the Race schema.
 * The Location is created and saved before push to the Race locations array.
 * @param {string[]} options
 */
schema.statics.addLocation = function(options){
	var location = mongoose.model('Location')();
	location.place_id = options.data.place_id;
	location.name = options.data.place_name;
	location.address = options.data.place_address;
	location.save();
	this.where('_id', options.data._id).update({$addToSet: { locations: location._id }}, options.callback);
}
/**
 * Static method to delete a certain Location from the Race schema.
 * The Location is deleted before pulling it from the Race locations array.
 * @param {string[]} options
 */
schema.statics.removeLocation = function(options){
	var location =  mongoose.model('Location');
	location.remove({_id: options.data.itemId}).exec();
	this.where('_id', options.data._id).update({$pull: {locations: options.data.itemId}}, options.callback);
}
/**
 * Static method for a User to Join a Race.
 * This function will check if the Race hasn't been started, ifso the User can't join and the race will fail.
 * @param {string[]} options
 */
schema.statics.joinRace = function(options){
	var race = mongoose.model("Race");
	this.find({_id: options.data._id}).exec(function(err, data){
		if(data[0].hasStarted){
			err = {
				message: "You cant join a race that has already started."
			}
		}
		if(err){
			options.error(err, data[0]);
		} else {
			race.where('_id', options.data._id).update({$addToSet: {users: options.data.userId}}, options.callback);
		}
	});
}
// /Statics

mongoose.model('Race', schema);