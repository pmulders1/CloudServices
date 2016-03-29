var raceList = [];
$(document).ready(function(){
	populateRaceTable();

	$('#notMeRaces').on('click', 'td a#joinRace', joinRace);
	socket.on('updated', function(data){
		utilities.showMessageBox(data.message.classType, data.message.selector, data.message.message);
		populateRaceTable();
	});
});

function populateRaceTable(callBack){
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
            tableContent += '<td><a href="#" class="btn btn-default btn-sm" id="joinRace" rel="' + this._id + '"><span class="glyphicon glyphicon-log-in" aria-hidden="true"></span></a></td>';
            tableContent += '</tr>';
		});
		$('#meRaces').html(tableContent);

		if(callBack){
			callBack();
		}
	});

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
}

function joinRace(event){
	event.preventDefault();
	var data = {
	 		'_id': $(this).attr('rel'),
            'userId': $('#userId').val()
    }
    $.ajax({
        type: 'PUT',
        url: '/races/' + data._id + '/join',
        data: data,
        dataType: 'JSON',
        success: function( data, status ) {
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'User joined race!'
			}
			socket.emit('updated', data);
			// Deze uit de lijst halen en andere lijst updaten.
        },
        error: function(err){
            utilities.showMessageBox('alert-danger', '#messageBox', err.responseJSON.message);
        }
    });
}
