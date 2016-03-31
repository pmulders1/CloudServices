function init(mongoose){
	console.log('Initializing race schema');

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

	// Validation
	schema.path('name').validate(function(){
		return this.name.length > 2;
	}, 'Name should be at least 3 characters long.');

	schema.path('hasStarted').validate(function(){
		console.log(this);
		console.log('Editing the hasStarted ('+this.hasStarted+') with locations length of ' + this.locations.length)

		if(this.hasStarted){
			return this.locations.length > 0;
		}

		return true;
	}, 'Race must have at least one location');

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
		delete options.filter.pagenr;
		delete options.filter.itemsPerPage;

		var itemsToSkip = (pagenr - 1) * itemsPerPage;
		
		return this.find(options.filter).populate('users').populate('locations').skip(itemsToSkip).limit(itemsPerPage).exec(options.callback);
	};

	schema.statics.getJoinedRaces = function(options){
		return this.find({"users" : options._id}).exec(options.callback);
	}

	schema.statics.add = function(options){
		console.log(options.data)
		options.data.state = "notready"
		options.data.save(options.callback)
	}

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

	schema.statics.update = function(options){
		this.findOne({_id: options.data._id}).populate('users').populate('locations').exec(function(err, doc){
			doc.name = options.data.name;
			doc.hasStarted = options.data.hasStarted;
			doc.save(options.callback);
		});
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
		this.where('_id', options.data._id).update({$addToSet: { locations: location._id }}, options.callback);
	}
	schema.statics.removeLocation = function(options){
		var location =  mongoose.model('Location');
		location.remove({_id: options.data.itemId}).exec();
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