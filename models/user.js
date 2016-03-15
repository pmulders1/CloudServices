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

	schema.statics.delete = function(options){
		options.data.remove(options.callback)
	}

	schema.static.update = function(options){
		console.log(options.data);
		this.findByIdAndUpdate(
		    options.data._id,
		    {
		    	$set: {
		    		firstname: options.data.firstname,
		    		lastname: options.data.lastname
		    	}
		    },
		    {
		    	safe: true, upsert: true, new : true
		    },
		    function(err, model) {
		        console.log(err);
		        console.log(model);
		    }
		);
	};

	mongoose.model('User', schema);
}

module.exports = init;