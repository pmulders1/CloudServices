function init(mongoose){
	console.log('Initializing race schema');

	var schema = mongoose.Schema,
	ObjectId = schema.ObjectId;

	schema = mongoose.Schema({
		name: {type: String, unique: [true, "Please enter a unique name"]},
		hasStarted : {type: Boolean, default:false },
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

	// Validation
	schema.path('name').validate(function(){
		return this.name.length > 2;
	}, 'Name should be at least 3 characters long.');

	// schema.pre('update', function() {
	//   	console.log(this.hasStarted);
	//   	console.log(this.name);
	// });

	// schema.path('hasStarted').validate(function(locations){
	//     if(!locations){return false}
	//     else if(locations.length === 0){return false}
	//     return true;
	// }, 'Race must have at least one locations before it can be started');

	// Virtuals 
	schema.virtual('count.users').get(function () {
		return this.users.length;
	});

	schema.virtual('count.locations').get(function () {
		return this.locations.length;
	});
	// /Virtuals

	// Statics 
	schema.statics.get = function(options){

		var itemsPerPage = 20;
		var pagenr = 1;
		
		if(options.filter.pagenr && options.filter.itemsPerPage){
			pagenr = options.filter.pagenr;
			itemsPerPage = options.filter.itemsPerPage;
		}
		//delete options.filter.pagenr;
		//delete options.filter.itemsPerPage;

		var itemsToSkip = (pagenr - 1) * itemsPerPage;
		
		return this.find(options.filter).populate('users').populate('locations').skip(itemsToSkip).limit(itemsPerPage).exec(options.callback);
	};

	schema.statics.getJoinedRaces = function(options){
		return this.find({"users" : options._id}).exec(options.callback);
	}

	schema.statics.add = function(options){
		options.data.save(options.callback)
	}

	schema.statics.delete = function(options){
		this.remove({_id: options._id}, options.callback);
	}

	schema.statics.update = function(options){
		this.where('_id', options.data._id).update({$set: {name: options.data.name, hasStarted: options.data.hasStarted}}, options.callback);
	}
	
	schema.statics.removeParticipant = function(options){
		this.where('_id', options.data._id).update({$pull: {users: options.data.itemId}}, options.callback);
	}
	schema.statics.addLocation = function(options){
		var location = mongoose.model('Location')();
		location.place_id = options.data.place_id;
		location.name = options.data.place_name;
		location.address = options.data.place_address;
		location.save();
		this.where('_id', options.data._id).update({$addToSet: {locations: location._id}}, options.callback);
	}
	schema.statics.removeLocation = function(options){
		var location =  mongoose.model('Location')();

		location.remove({_id: options.data.itemId}); //?????

		this.where('_id', options.data._id).update({$pull: {locations: options.data.itemId}}, options.callback);
	}
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
}

module.exports = init;