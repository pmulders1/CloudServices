function init(mongoose){
	console.log('Initializing location schema');
	var schema = mongoose.Schema({
		place_id: { type: Number, unique: true, required: true }
	});
	mongoose.model('Location', schema);
}

module.exports = init;