var ConnectRoles = require('connect-roles');
var user = new ConnectRoles();

user.use(function (req, action) {
	if (!req.isAuthenticated()) return action === 'access home page';
})
// set up all the authorisation rules here

module.exports = user;