var userList = [];

$(document).ready(function(){

	populateTable();

	$('#crUser').on('click', createUser);
	$('#userList').on('click', 'td a#upUser', showUser);
	$('#userList').on('click', 'td a#deUser', deleteUser);
	$('#updateUser').on('click', updateUser);
	socket.on('updated', function(data){
		utilities.showMessageBox(data.message.classType, data.message.selector, data.message.message);
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
            tableContent += '<td><button type="button" class="btn btn-default btn-sm right5"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></button><button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></td>';
            tableContent += '</tr>';
		});

		$('#userList').html(tableContent);
	});
}

function createUser(event){
	event.preventDefault();

	var errorCount = 0;

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
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'User is created!'
			}
			socket.emit('updated', data);
			$('#createForm').trigger('reset');
		}, error: function(err){
			utilities.showMessageBox('alert-danger', '#messageBox', err.responseJSON.message);
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
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'User is updated!'
			}
			socket.emit('updated', data);
			$('#updateForm').trigger('reset');
        },
        error: function(err){
            utilities.showMessageBox('alert-danger', '#messageBox', err.responseJSON.message);
        }
    });
}

function deleteUser(event){
	event.preventDefault();

	console.log("delete")
	$.ajax({
		type: 'DELETE',
		data: data,
		url: '/users/' + $(this).attr('rel'),
		dataType: 'JSON',
		success: function( data, status ){
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'User is updated!'
			}
			socket.emit('updated', data);
		},
		error: function(err){
            utilities.showMessageBox('alert-danger', '#messageBox', err.responseJSON.message);
        }
	});
}