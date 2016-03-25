function init(mongoose, bcrypt){
	console.log('Initializing user schema');
	var schema = mongoose.Schema({
		username : { type: String, required: true},
		roles: [{type: String, default: "User"}],
		local            : {
	        email        : String,
	        password     : String,
	    },
	    facebook         : {
	        id           : String,
	        token        : String,
	        email        : String,
	        name         : String
	    },
	    twitter          : {
	        id           : String,
	        token        : String,
	        displayName  : String,
	        username     : String
	    },
	    google           : {
	        id           : String,
	        token        : String,
	        email        : String,
	        name         : String
	    }
	}, {
		toJSON: {
			virtuals: true
		}
	});

	schema.methods.isInRole = function(role){
		return this.roles.indexOf(role) > -1;
	}

	// methods ======================
	// generating a hash
	schema.methods.generateHash = function(password) {
	    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};

	// checking if password is valid
	schema.methods.validPassword = function(password) {
	    return bcrypt.compareSync(password, this.local.password);
	};

	// Statics
	schema.statics.get = function(options){
		return this.find(options.filter).exec(options.callback);
	};

	schema.statics.add = function(options){
		console.log(options);
		var user = mongoose.model('User')();
		user.username = options.data.username;
		user.local.email = options.data.email;
		user.local.password = user.generateHash(options.data.password);
		user.save(options.callback);
	}

	schema.statics.delete = function(options){
		this.remove({_id: options._id}, options.callback);
	}

	schema.statics.update = function(options){
		this.where('_id', options.data._id).update({$set: {username: options.data.username}}, options.callback);
	}
	// /Statics
	mongoose.model('User', schema);
}

module.exports = init;