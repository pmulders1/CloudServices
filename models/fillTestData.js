var Race, Participant, Location;

var mongoose = require('mongoose');

function saveCallback(err){
	if(err){
		console.log('Fill testdata failed, reason: %s', err)
	}
};

var locationId = new mongoose.Types.ObjectId();
var raceId = new mongoose.Types.ObjectId();
var participantId = new mongoose.Types.ObjectId();

function fillTestRaces(callback){
	var testData = [
		{
			_id: raceId,
			name: 'TestRace', 
			hasStarted: true,
			locations: [locationId],
			participants: [participantId]
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

function fillTestParticipant(callback){
	var testData = [
		{
			_id: participantId,
			firstname: "Paul",
			lastname: "Mulders"
		}
		// Vul hier je testdata voor boeken in 
		// {}, {}, {}
	];

	Participant.find({}, function(err, data){
		// Als er nog geen boeken zijn vullen we de testdata
		if(data.length == 0){
			console.log('Creating participant testdata');
			
			testData.forEach(function(participant){
				new Participant(participant).save(saveCallback);
			});
		} else{
			console.log('Skipping create participant testdata, allready present');
		}

		if(callback){ callback(); }
	});
};

function fillTestLocations(callback){
	var testData = [
		{
			_id: locationId,
			place_id: 23
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
	Participant = mongoose.model('Participant');
	Race = mongoose.model('Race');

	fillTestParticipant(fillTestLocations(fillTestRaces()));
}