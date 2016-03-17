var raceList = [];

$(document).ready(function(){
	populateTable();

	$('#crRace').on('click', createRace);
	$('#raceList').on('click', 'td a#upRace', showRace);
	socket.on('updated', function(data){
		utilities.showMessageBox(data.message.classType, data.message.selector, data.message.message);
		populateTable();
	});
});

function populateTable(){
	var tableContent = '';

	$.getJSON('/races/all', function(data){
		raceList = data;
		$.each(data, function(){
			tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
			tableContent += '<td>' + this.hasStarted + '</td>';
			tableContent += '<td>' + this.count.locations + '</td>';
			tableContent += '<td>' + this.count.users + '</td>';
            tableContent += '<td><a href="#" class="btn btn-default btn-sm right5" id="upRace" rel="' + this._id + '"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a><a href="#" class="btn btn-default btn-sm" id="deRace" rel="' + this._id + '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>';
            tableContent += '</tr>';
		});
		$('#raceList').html(tableContent);
	});
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
    var arrayPosition = raceList.map(function(arrayItem) { return arrayItem._id; }).indexOf(_id);
    var race = raceList[arrayPosition];

    $('#upName').val(race.name);
    $('#upStarted').attr('checked',race.hasStarted);
    $('#upId').val(race._id);
}