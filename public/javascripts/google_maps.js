// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;

function initMap() {
  var pyrmont = {lat: 51.6891047, lng: 5.30264};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
      location: pyrmont,
      radius: 5000,
      type: ['cafe']
    }, callback);
  }

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    var data = {
      vicinity: place.vicinity, 
      name: place.name
    };
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.vicinity + '<br><a href="#" rel="' + place.place_id + '" id="addToRace" data-name="'+ place.name +'" data-address="'+ place.vicinity +'">Add to Race</a></div>');
    infowindow.open(map, this);
  });
}