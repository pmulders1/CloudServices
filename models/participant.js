function init(mongoose){
	console.log('Initializing participant schema');
	var schema = mongoose.Schema({
		firstname : { type: String, required: true},
		lastname : { type: String, required: true}
	});
	mongoose.model('Participant', schema);
}

module.exports = init;