function init(mongoose){
	console.log('Initializing race schema');

	var schema = mongoose.Schema,
	ObjectId = schema.ObjectId;

	schema = mongoose.Schema({
		name: {type: String, unique: true},
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
		return this.find(options.filter).populate('users').populate('locations').exec(options.callback);
	};

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
		location.save();
		this.where('_id', options.data._id).update({$addToSet: {locations: location._id}}, options.callback);
	}
	schema.statics.removeLocation = function(options){
		var location =  mongoose.model('Location')();
		location.remove({_id: options.data.itemId});
		this.where('_id', options.data._id).update({$pull: {locations: options.data.itemId}}, options.callback);
	}
	schema.statics.joinRace = function(options){
		this.where('_id', options.data._id).update({$addToSet: {users: options.data.userId}}, options.callback);
	}
	// /Statics
	mongoose.model('Race', schema);
}

module.exports = init;