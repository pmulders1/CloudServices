var raceList = [];
$(document).ready(function(){
	populateRaceTable();

	$('#notMeRaces').on('click', 'td a#joinRace', joinRace);
	$('#meRaces').on('click', 'td a#playRace', playRace);
	$('#raceLocations').on('click', 'a#backBtn', showProfile);
	$('#raceDetails').on('click', 'a#tagLocation', tagLocation);

	socket.on('updated', function(data){
		utilities.showMessageBox(data.message.classType, data.message.selector, data.message.message);
		
		if(data.message.type === 'sublist' && $('#raceId').val() === data.message.id){
			getLocations(data.message.id);
			console.log('updating sublist')
		}else{
			populateRaceTable();
		}
		
	});
});

function populateRaceTable(callBack){
	var tableContent2 = '';
	var _id = $('#userId').val();
	$.getJSON('/races/notme', _id, function(data){
		raceList = data;
		$.each(data, function(){
			tableContent2 += '<tr>';
            tableContent2 += '<td>' + this.name + '</td>';
			tableContent2 += '<td>' + this.hasStarted + '</td>';
			tableContent2 += '<td>' + this.count.locations + '</td>';
			tableContent2 += '<td>' + this.count.users + '</td>';
            tableContent2 += '<td><a href="#" class="btn btn-default btn-sm" id="joinRace" rel="' + this._id + '"><span class="glyphicon glyphicon-log-in" aria-hidden="true"></span></a></td>';
            tableContent2 += '</tr>';
		});
		$('#notMeRaces').html(tableContent2);

		if(callBack){
			callBack();
		}
	});

	var tableContent = '';
	var _id = $('#userId').val();
	$.getJSON('/races/me', _id, function(data){
		raceList = data;
		$.each(data, function(){
			tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
			tableContent += '<td>' + this.hasStarted + '</td>';
			tableContent += '<td>' + this.count.locations + '</td>';
			tableContent += '<td>' + this.count.users + '</td>';
            tableContent += '<td><a href="#" class="btn btn-default btn-sm" id="playRace" rel="' + this._id + '"><span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span></a></td>';
            tableContent += '</tr>';
		});
		$('#meRaces').html(tableContent);

		if(callBack){
			callBack();
		}
	});
}
function showProfile(event){
	event.preventDefault();
	$('#raceLocations').toggle( "slide" );
	$('#profile').toggle( "slide" );
	$('#raceId').val('');
}
function playRace(event){
	event.preventDefault();
	$('#profile').toggle( "slide" );
	$('#raceLocations').toggle( "slide" );
	$('#raceId').val($(this).attr('rel'));
	console.log($('#raceId').val());
	getLocations($('#raceId').val());
}

function getLocations (id) {
	var data = {
		'_id': id
	}

	$.ajax({
        type: 'GET',
        url: '/races/' + id,
        data: data,
        success: function( data, status ) {
			
			var tableContent = '';
			$.each(data[0].locations, function(index, item){
				tableContent += '<tr>'
				tableContent += '<td>' + item.name + '</td>'
				tableContent += '<td>' + item.address + '</td>'
				if($.inArray($('#userId').val(), item.users) == -1){
					tableContent += '<td><a href="#" class="btn btn-default btn-sm" id="tagLocation" rel="' + item._id + '"><span class="glyphicon glyphicon-tag" aria-hidden="true"></span></a></td>';
				} else{ 
					tableContent += '<td><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
				}
				tableContent += '</tr>'
			})
			$('#raceDetails').html(tableContent);
        },
        error: function(err){
            $.each(err.responseJSON.errors, function(index, item){
				utilities.showMessageBox('alert-danger', '#messageBox', item.message);
			});
        }
    });
}

function tagLocation(event){
	event.preventDefault();
	var data = {
		'_id': $(this).attr('rel'),
		'race_id': $('#raceId').val(),
		'user_id': $('#userId').val()
	}

	$.ajax({
        type: 'PUT',
        url: '/locations/' + data._id,
        data: data,
        dataType: 'JSON',
        success: function( data, status ) {
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'User tagged location!',
				type: 'sublist',
				id: $('#raceId').val()
			}
			socket.emit('updated', data);
        },
        error: function(err){
            $.each(err.responseJSON.errors, function(index, item){
				utilities.showMessageBox('alert-danger', '#messageBox', item.message);
			});
        }
    });
}

function joinRace(event){
	event.preventDefault();
	var data = {
	 		'_id': $(this).attr('rel'),
            'userId': $('#userId').val()
    }
    $.ajax({
        type: 'PUT',
        url: '/races/' + data._id + '/participant',
        data: data,
        dataType: 'JSON',
        success: function( data, status ) {
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'User joined race!'
			}
			socket.emit('updated', data);
			
        },
        error: function(err){
            $.each(err.responseJSON.errors, function(index, item){
				utilities.showMessageBox('alert-danger', '#messageBox', item.message);
			});
        }
    });
}
