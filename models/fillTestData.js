var Race, User, Location;

var mongoose = require('mongoose');

function saveCallback(err){
	if(err){
		console.log('Fill testdata failed, reason: %s', err)
	}
};

var locationId = new mongoose.Types.ObjectId();
var raceId = new mongoose.Types.ObjectId();
var userId = new mongoose.Types.ObjectId();

function fillTestRaces(callback){
	var testData = [
		{
			_id: raceId,
			name: 'Kroegentocht', 
			hasStarted: true,
			locations: [locationId],
			users: [userId]
		}
		// Vul hier je testdata voor boeken in 
		// {}, {}, {}
	];

	Race.find({}, function(err, data){
		// Als er nog geen boeken zijn vullen we de testdata
		if(data.length == 0){
			console.log('Creating races testdata');
			
			testData.forEach(function(race){
				new Race(race).save(saveCallback);
			});
		} 

		if(callback){ callback(); }
	});
};

function fillTestUsers(callback){
	var testData = [
		{
			_id: userId,
			username: "admin",
			local: {
				email: "admin@admin.com",
				password: "admin"
			}
		}
		// Vul hier je testdata voor boeken in 
		// {}, {}, {}
	];

	User.find({}, function(err, data){
		// Als er nog geen boeken zijn vullen we de testdata
		if(data.length == 0){
			console.log('Creating user testdata');
			
			testData.forEach(function(user){
				var temp = new User();
				temp._id = user._id;
				temp.username = user.username;
				temp.local.email = user.local.email;
				temp.local.password = temp.generateHash(user.local.password);
				temp.roles.push('admin');
				temp.save(saveCallback);
			});
		} 

		if(callback){ callback(); }
	});
};

function fillTestLocations(callback){
	var testData = [
		{
			_id: locationId,
			place_id: "ChIJsVYznYruxkcRGn-allVHDw0",
			name: "Restaurant Mell's Place",
			address: "Stationsplein 89, 's-Hertogenbosch"
		}
		// Vul hier je testdata voor boeken in 
		// {}, {}, {}
	];

	Location.find({}, function(err, data){
		// Als er nog geen boeken zijn vullen we de testdata
		if(data.length == 0){
			console.log('Creating location testdata');
			
			testData.forEach(function(location){
				new Location(location).save(saveCallback);
			});
		} 

		if(callback){ callback(); }
	});
};

module.exports = function(mongoose){
	Location = mongoose.model('Location');
	User = mongoose.model('User');
	Race = mongoose.model('Race');

	fillTestUsers(fillTestLocations(fillTestRaces()));
}