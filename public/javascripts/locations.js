$(document).ready(function() {
    // Add User button click
    $('#btnSearchLocation').on('click', getLocation);

    $('#locationsList table tbody').on('click', 'td a.showPlaces', getPlaces);
});

function getLocation(){
	var location = $('#locationName').val();
	var province = ', '+ $('#provinceName').val();

	$.ajax({
		type: 'GET',
		url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + province + ', Nederland',
		success:function(data){
			console.log(data);
			var tableContent = '';
			$.each(data.results, function(){
		        tableContent += '<tr>';
		        tableContent += '<td><a href="#" class="showPlaces" rel="' + this.geometry.location.lat + ',' + this.geometry.location.lng + '">' + this.address_components[0].long_name + '</a></td>';
		        tableContent += '<td>' + this.address_components[2].long_name + '</td>';
		        tableContent += '<td>' + this.geometry.location.lat + '</td>';
		        tableContent += '<td>' + this.geometry.location.lng + '</td>';
		        tableContent += '</tr>';
		    });
			$('#locationsList table tbody').html(tableContent);

		}, error:function(err){
			console.log('Error: ' + err);
		}
	});
}

function getPlaces(){
	var latlng =  $(this).attr('rel');

	$.ajax({
		type: 'GET',
    	crossDomain: true,
		      //https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBlZETTCSIdZg7V3ofgZswDcSrfvBdViPM&location=51.697816,5.303675&radius=1000&type=cafe
		url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBlZETTCSIdZg7V3ofgZswDcSrfvBdViPM&location=51.697816,5.303675&radius=1000&type=cafe',
		success:function(data){
			console.log(data);
		},
		error: function(err){
			console.log('Error: ' + err);
		}
	});
}