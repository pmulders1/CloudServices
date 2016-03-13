function init(mongoose){
	console.log('Initializing user schema');
	var schema = mongoose.Schema({
		firstname : { type: String, required: true},
		lastname : { type: String, required: true}
	});
	mongoose.model('User', schema);
}

module.exports = init;