/**
 * A Model for User
 * @module  User
 * @exports User
 */
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


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

/**
 * Validation for the username path.
 * When a User is saved, the username must be at least 3 characters long.
 * Otherwise a User can't be saved.
 * @param {string} username
 */
schema.path('username').validate(function(){
	return this.username.length > 2;
}, 'Name should be at least 3 characters long.');
/**
 * @typedef {Object} User
 * Validation for the local.email path.
 * When a User is saved, the local.email must be at least 3 characters long.
 * Otherwise a User can't be saved.
 */
schema.path('local.email').validate(function(){
	return this.local.email.length > 2;
}, 'Please enter a valid email address');
/**
 * @typedef {Object} User
 * Validation for the roles path, to set a default role when a role hasn't been entered.
 * When a User is saved, the array of roles is checked to see if there is already a role present.
 * If this is not the case, the role user will be pushed into the roles array.
 * Otherwise, the given role will be pushed into the array.
 */
schema.pre("save",function(next) {
	if (this.roles.indexOf("user") == -1){
		this.roles.push("user");
	}
	next();
});

/**
 * @typedef {Object} User
 * Method to check if an User has a certain role.
 * If an User had the given role, the function will return 1
 * Other wise the function will return -1.
 * @param {role} role
 */
schema.methods.isInRole = function(role){
	return this.roles.indexOf(role) > -1;
}

/**
 * @typedef {Object} User
 * Method to generate a hash for a given password.
 * @param {string} password
 */
schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * @typedef {Object} User
 * Checks to see if the password checks with the hash.
 * @param {string} password
 */
schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

/**
 * Static method to get the User fitting the filter criteria.
 * The user can enter parameters, pagenr and itemsPerPage, in the filter for pagination.
 * The default values for pagenr and itemsPerPage are respectively 1 and 20.
 * @param {string[]} options
 */
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
	return this.find(options.filter).skip(itemsToSkip).limit(itemsPerPage).lean().exec(function(res, data){
		data.pagenr = pagenr;
		data.itemsPerPage = itemsPerPage;
		options.callback(res, data);
	});
};

/**
 * Static method to add a certain User to the schema.
 * @param {string[]} options
 */
schema.statics.add = function(options){
	var user = mongoose.model('User')();
	user.username = options.data.username;
	user.local.email = options.data.email;
	user.local.password = user.generateHash(options.data.password);
	user.save(options.callback);
}
/**
 * Static method to delete a certain User from the schema.
 * @param {string[]} options
 */
schema.statics.delete = function(options){
	this.remove({_id: options._id}, options.callback);
}
/**
 * Static method to update a certain User in the schema.
 * @param {string[]} options
 */
schema.statics.update = function(options){
	this.findOne({_id: options.data._id}).exec(function(err, doc){
		doc.username = options.data.username;
		doc.local.email = options.data.email;
		doc.save(options.callback);
	});
}
// /Statics

mongoose.model('User', schema);