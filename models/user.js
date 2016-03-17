function init(mongoose){
	console.log('Initializing user schema');
	var schema = mongoose.Schema({
		firstname : { type: String, required: true},
		lastname : { type: String, required: true}
	}, {
		toJSON: {
			virtuals: true
		}
	});

	// Virtuals 
		schema.virtual('fullname').get(function () {
			return this.firstname + ' ' + this.lastname;
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
		this.where('_id', options.data._id).update({$set: {firstname: options.data.firstname, lastname: options.data.lastname}}, options.callback);
	}
	// /Statics
	mongoose.model('User', schema);
}

module.exports = init;