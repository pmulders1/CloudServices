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
		return this.find(options.filter).exec(options.callback);
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
	// /Statics
	mongoose.model('Race', schema);
}

module.exports = init;