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
			name: 'TestRace', 
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
		} else{
			console.log('Skipping create races testdata, allready present');
		}

		if(callback){ callback(); }
	});
};

function fillTestUsers(callback){
	var testData = [
		{
			_id: userId,
			username: "PaulTheKing",
			local: {
				email: "test@test.com",
				password: "$2a$08$ObyTFRXwxyGgUwB1CZGitOHAtFrJkuaMast95wlxnIx7m1NPe.LYi"
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
				new User(user).save(saveCallback);
			});
		} else{
			console.log('Skipping create user testdata, allready present');
		}

		if(callback){ callback(); }
	});
};

function fillTestLocations(callback){
	var testData = [
		{
			_id: locationId,
			place_id: "asdasdasdcx"
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
		} else{
			console.log('Skipping create locations testdata, allready present');
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