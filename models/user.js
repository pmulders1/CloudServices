function init(mongoose, bcrypt){
	console.log('Initializing user schema');
	var schema = mongoose.Schema({
		username : { type: String, required: [true, "Please enter a valid username"]},
		roles: [{type: String }],
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

	// Validation
	schema.path('username').validate(function(){
		return this.username.length > 2;
	}, 'Name should be at least 3 characters long.');

	schema.path('local.email').validate(function(){
		return this.local.email.length > 2;
	}, 'Please enter a valid email address');

	schema.pre("save",function(next) {
		if (this.roles.indexOf("user") == -1){
			this.roles.push("user");
		}
		next();
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
		var itemsPerPage = 20;
		var pagenr = 1;
		
		if(options.filter.pagenr && options.filter.itemsPerPage){
			pagenr = options.filter.pagenr;
			itemsPerPage = options.filter.itemsPerPage;
		}
		delete options.filter.pagenr;
		delete options.filter.itemsPerPage;

		var itemsToSkip = (pagenr - 1) * itemsPerPage;
		return this.find(options.filter).skip(itemsToSkip).limit(itemsPerPage).exec(options.callback);
	};

	schema.statics.add = function(options){
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
		this.where('_id', options.data._id).update({$set: {username: options.data.username, 'local.email': options.data.email }}, options.callback);
	}
	// /Statics
	mongoose.model('User', schema);
}

module.exports = init;