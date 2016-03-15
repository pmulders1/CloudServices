var userList = [];

$(document).ready(function(){

	populateTable();

	$('#crUser').on('click', createUser);
	$('#userList').on('click', 'td a#upUser', showUser);
	$('#userList').on('click', 'td a#deUser', deleteUser);
	$('#updateUser').on('click', updateUser);
	socket.on('crUser', function(user){
		populateTable();
	});
});

function populateTable(){
	var tableContent = '';

	$.getJSON('/users/all', function(data){
		userList = data;
		$.each(data, function(){
			tableContent += '<tr>';
            tableContent += '<td>' + this.firstname + '</td>';
			tableContent += '<td>' + this.lastname + '</td>';
            tableContent += '<td><a href="#" class="btn btn-default btn-sm right5" id="upUser" rel="' + this._id + '"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a><a href="#" class="btn btn-default btn-sm" id="deUser" rel="' + this._id + '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>';
            tableContent += '</tr>';
		});
		$('#userList').html(tableContent);
	});
}

function createUser(event){
	event.preventDefault();

	var data = {
		'firstname': $('#crFirstname').val(),
		'lastname': $('#crLastname').val()
	}
	$.ajax({
		type: 'POST',
		data: data,
		url: '/users/add',
		dataType: 'JSON',
		success:function(data){
			socket.emit('crUser', data);
			utilities.showMessageBox('alert-success', '#messageUser', 'User is created!');
			$('#crFirstname').val('');
			$('#crLastname').val('');
		}, error: function(err){
			utilities.showMessageBox('alert-danger', '#messageUser', err.responseJSON.message);
		}
	});
}

function showUser(event){
    var _id = $(this).attr('rel');
    var arrayPosition = userList.map(function(arrayItem) { return arrayItem._id; }).indexOf(_id);
    var user = userList[arrayPosition];

    $('#upFirstname').val(user.firstname);
    $('#upLastname').val(user.lastname);
    $('#upId').val(user._id);
}

function updateUser(event){
	event.preventDefault();
	var data = {
	 		'_id': $('#upId').val(),
            'firstname': $('#upFirstname').val(),
            'lastname': $('#upLastname').val()
    }
    $.ajax({
        type: 'PUT',
        url: '/users/' + data._id,
        data: data,
        dataType: 'JSON',
        success: function( data, status ) {
			socket.emit('crUser', data);
			utilities.showMessageBox('alert-success', '#messageUser', 'User is updated!');
			$('#upFirstname').val('');
			$('#upLastname').val('');
			$('#upId').val('');
        },
        error: function(err){
            utilities.showMessageBox('alert-danger', '#messageUser', err.responseJSON.message);
        }
    });
}

function deleteUser(event){
	event.preventDefault();
	console.log('delete');
}