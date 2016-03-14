var userList = [];

$(document).ready(function(){

	populateTable();

	$('#crUser').on('click', createUser);
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

		console.log(tableContent);
		console.log($('#userList'));
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
		dataType: 'JSON'
	}).done(function(response){
		$('#crFirstname').val('');
		$('#crLastname').val('');
		populateTable();
	});
}