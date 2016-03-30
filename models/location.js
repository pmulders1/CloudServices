function init(mongoose){
	console.log('Initializing location schema');
	var schema = mongoose.Schema({
		place_id: { type: String, required: true },
		name: { type:String, required: true },
		address: { type: String, required: true},
		users: [{
			type: mongoose.Schema.Types.ObjectId, ref: "User"
		}]
	});

	schema.path('name').validate(function(){
		return this.name.length > 2;
	}, 'Name should be at least 3 characters long.');

	schema.statics.tagUser = function(options){
		console.log(options.data);
		console.log('-----');
		this.where('_id', options.data._id).update({$addToSet: {users: options.data.user_id}}, options.callback);
	}

	mongoose.model('Location', schema);
}

module.exports = init;