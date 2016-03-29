var raceList = [];
$(document).ready(function(){
	populateRaceTable();

	$('#map').on('click', 'a#addToRace', addToRace);

	$('#crRace').on('click', createRace);
	$('#raceList').on('click', 'td a#upRace', showRace);
	$('#raceList').on('click', 'td a#deRace', deleteRace);
	$('#raceParticipantsList').on('click', 'td a#deParticipantRace', deleteParticipantRace);
	$('#raceLocationsList').on('click', 'td a#deLocationRace', deleteLocationRace);
	$('#updateRace').on('click', updateRace);
	socket.on('updated', function(data){
		utilities.showMessageBox(data.message.classType, data.message.selector, data.message.message);
		populateRaceTable(function(){
			
			if(data.message.type === 'sublist' && $('#upId').val() === data.message.id){
				populateSublistTable(data.message.id);
			}
		});
	});
});

function populateRaceTable(callBack){
	var tableContent = '';
	
	$.getJSON('/races/all', function(data){
		raceList = data;
		$.each(data, function(index){
			tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
			tableContent += '<td>' + this.hasStarted + '</td>';
			tableContent += '<td>' + this.count.locations + '</td>';
			tableContent += '<td>' + this.count.users + '</td>';
            tableContent += '<td><a href="#" class="btn btn-default btn-sm right5" id="upRace" rel="' + this._id + '"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a><a href="#" class="btn btn-default btn-sm" id="deRace" rel="' + this._id + '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>';
            tableContent += '</tr>';
		});
		$('#raceList').html(tableContent);

		if(callBack){
			callBack();
		}
	});
}

function populateSublistTable(_id){
	var index = -1;
	$.each(raceList, function(i, item){
    	if(item._id == _id){
    		index = i;
    	}
    });

	var tableContent = '';
    $.each(raceList[index].users, function(){
    	tableContent += '<tr>';
        tableContent += '<td>' + this.username + '</td>';
        tableContent += '<td><a href="#" class="btn btn-default btn-sm" id="deParticipantRace" rel="' + this._id + '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>';
        tableContent += '</tr>';
    });
    $('#raceParticipantsList').html(tableContent);
    var tableContent = '';
    $.each(raceList[index].locations, function(){
    	tableContent += '<tr>';
        tableContent += '<td>' + this.name + '</td>';
        tableContent += '<td>' + this.address + '</td>';
        tableContent += '<td><a href="#" class="btn btn-default btn-sm" id="deLocationRace" rel="' + this._id + '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>';
        tableContent += '</tr>';
    });
    $('#raceLocationsList').html(tableContent);
}

function createRace(event){
	event.preventDefault();

	var data = {
		'name': $('#crName').val()
	}
	$.ajax({
		type: 'POST',
		data: data,
		url: '/races/add',
		dataType: 'JSON',
		success:function(data){
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'Race is created!'
			}
			socket.emit('updated', data);
			$('#createForm').find('input:text').val('');
		}, error: function(err){
			utilities.showMessageBox('alert-danger', '#messageBox', err.responseJSON.message);
		}
	});
}

function showRace(event){
    var _id = $(this).attr('rel');
    $.each(raceList, function(i, item){
    	if(item._id == _id){
    		$('#upName').val(item.name);
    		$('#upId').val(_id);
    		$('#upStarted').prop('checked', item.hasStarted);
    	}
    });
   
    populateSublistTable(_id);
}

function updateRace(event){
	event.preventDefault();
	var data = {
	 		'_id': $('#upId').val(),
            'name': $('#upName').val(),
            'hasStarted': $('#upStarted').is(':checked')
    }
    $.ajax({
        type: 'PUT',
        url: '/races/' + data._id,
        data: data,
        dataType: 'JSON',
        success: function( data, status ) {
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'Race is updated!'
			}
			socket.emit('updated', data);
			$('#updateForm').find('input:text').val('');
			$('#upId').val('');
			$('#upStarted').prop('checked', false);
			$('#raceParticipantsList').html('');
    		$('#raceLocationsList').html('');
        },
        error: function(err){
            utilities.showMessageBox('alert-danger', '#messageBox', err.responseJSON.message);
        }
    });
}

function deleteRace(event){
	event.preventDefault();
	$.ajax({
		type: 'delete',
		url: '/races/' + $(this).attr('rel'),
		success: function( data, status ){
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'Race is removed!'
			}
			socket.emit('updated', data);
		},
		error: function(err){
            utilities.showMessageBox('alert-danger', '#messageBox', err.responseJSON.message);
        }
	});
}

function deleteParticipantRace(event){
	event.preventDefault();
	var data = {
	 		'_id': $('#upId').val(),
            'itemId': $(this).attr('rel')
    }
    $.ajax({
        type: 'delete',
        url: '/races/' + data._id + '/participant',
        data: data,
        dataType: 'JSON',
        success: function( data, status ) {
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'Participant removed from Race!',
				type: 'sublist',
				id: $('#upId').val()
			}
			socket.emit('updated', data);
        },
        error: function(err){
            utilities.showMessageBox('alert-danger', '#messageBox', err.responseJSON.message);
        }
    });
}

function deleteLocationRace(event){
	event.preventDefault();
	var data = {
	 		'_id': $('#upId').val(),
            'itemId': $(this).attr('rel')
    }
    $.ajax({
        type: 'delete',
        url: '/races/' + data._id + '/location',
        data: data,
        dataType: 'JSON',
        success: function( data, status ) {
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'Location removed from Race!',
				type: 'sublist',
				id: $('#upId').val()
			}
			socket.emit('updated', data);
        },
        error: function(err){
            utilities.showMessageBox('alert-danger', '#messageBox', err.responseJSON.message);
        }
    });
}

function addToRace(event){
	event.preventDefault();
	if(!$('#upId').val()){
		utilities.showMessageBox('alert-danger', '#messageBox', "Please select a race before adding a location!");
		return;
	}

	var data = {
 		'_id': $('#upId').val(),
        'place_id': $(this).attr('rel'),
        'place_name': $(this).data('name'),
        'place_address': $(this).data('address')
    }
    $.ajax({
        type: 'PUT',
        url: '/races/' + data._id + '/location',
        data: data,
        dataType: 'JSON',
        success: function( data, status ) {
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'Location added to race!',
				type: 'sublist',
				id: $('#upId').val()
			}
			socket.emit('updated', data);
			// Deze uit de lijst halen en andere lijst updaten.
        },
        error: function(err){
            utilities.showMessageBox('alert-danger', '#messageBox', err.responseJSON.message);
        }
    });
}