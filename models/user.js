function init(mongoose){
	console.log('Initializing user schema');
	var schema = mongoose.Schema({
		firstname : { type: String, required: true},
		lastname : { type: String, required: true}
	});

	schema.statics.get = function(options){
		return this.find(options.filter).exec(options.callback);
	};


	schema.statics.add = function(options){
		options.data.save(options.callback)
	}

	schema.statics.update = function(options){
		this.where('_id', options.data._id).update({$set: {firstname: options.data.firstname, lastname: options.data.lastname}}, options.callback);
	};

	mongoose.model('User', schema);
}

module.exports = init;