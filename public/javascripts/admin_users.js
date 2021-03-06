var userList = [];

$(document).ready(function(){
	populateUserTable();
	$('#crUser').on('click', createUser);
	$('#userList').on('click', 'td a#upUser', showUser);
	$('#userList').on('click', 'td a#deUser', deleteUser);
	$('#updateUser').on('click', updateUser);
	socket.on('updated', function(data){
		utilities.showMessageBox(data.message.classType, data.message.selector, data.message.message);
		populateUserTable();
	});
});
function populateUserTable(){
	var tableContent = '';
	$.getJSON('/users/', function(data){
		userList = data.data;
		$.each(data.data, function(){
			tableContent += '<tr>';
            tableContent += '<td>' + this.username + '</td>';
            tableContent += '<td><a href="#" class="btn btn-default btn-sm right5" id="upUser" rel="' + this._id + '"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a><a href="#" class="btn btn-default btn-sm" id="deUser" rel="' + this._id + '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>';
            tableContent += '</tr>';
		});
		$('#userList').html(tableContent);
	});
}

function createUser(event){
	event.preventDefault();

	var data = {
		'username': $('#crUsername').val(),
		'email': $('#crEmail').val(),
		'password': $('#crPassword').val()
	}
	$.ajax({
		type: 'POST',
		data: data,
		url: '/users/',
		dataType: 'JSON',
		success:function(data){
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'User is created!'
			}
			socket.emit('updated', data);
			$('#createForm').find('input:text').val('');
			$('#crPassword').val('');
		}, error: function(err){
			if(!err.responseJSON){
				utilities.showMessageBox('alert-danger', '#messageBox', JSON.parse(err.responseText).errors.message.message);
			}else{
				$.each(err.responseJSON.errors, function(index, item){
					utilities.showMessageBox('alert-danger', '#messageBox', item.message);
				});
			}
		}
	});
}

function showUser(event){
    var _id = $(this).attr('rel');
    var arrayPosition = userList.map(function(arrayItem) { return arrayItem._id; }).indexOf(_id);
    var user = userList[arrayPosition];

    $('#upUsername').val(user.username);
    $('#upEmail').val(user.local.email);
    $('#upId').val(user._id);
}

function updateUser(event){
	event.preventDefault();
	var data = {
	 		'_id': $('#upId').val(),
            'username': $('#upUsername').val(),
            'email': $('#upEmail').val()
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
			$('#updateForm').find('input:text').val('');
        },
        error: function(err){
        	if(!err.responseJSON){
				utilities.showMessageBox('alert-danger', '#messageBox', JSON.parse(err.responseText).errors.message.message);
			}else{
				$.each(err.responseJSON.errors, function(index, item){
					utilities.showMessageBox('alert-danger', '#messageBox', item.message);
				});
			}
        }
    });
}

function deleteUser(event){
	event.preventDefault();
	$.ajax({
		type: 'delete',
		url: '/users/' + $(this).attr('rel'),
		success: function( data, status ){
			data.message = {
				classType: 'alert-success',
				selector: '#messageBox',
				message: 'User is removed!'
			}
			socket.emit('updated', data);
		},
		error: function(err){
			if(!err.responseJSON){
				utilities.showMessageBox('alert-danger', '#messageBox', JSON.parse(err.responseText).errors.message.message);
			}else{
				$.each(err.responseJSON.errors, function(index, item){
					utilities.showMessageBox('alert-danger', '#messageBox', item.message);
				});
			}
        }
	});
}