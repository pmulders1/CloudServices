function init(mongoose){
	console.log('Initializing location schema');
	var schema = mongoose.Schema({
		place_id: { type: String, required: true },
		users: [{
			type: mongoose.Schema.Types.ObjectId, ref: "User"
		}]
	});
	mongoose.model('Location', schema);
}

module.exports = init;