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
		participants: [{
			type: mongoose.Schema.Types.ObjectId, ref: "Participant"
		}]
	});
	mongoose.model('Race', schema);
}

module.exports = init;