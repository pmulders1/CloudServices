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

	mongoose.model('User', schema);
}

module.exports = init;