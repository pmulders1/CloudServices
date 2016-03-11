var mongoose = require('mongoose');
var Race = mongoose.model('Race');



// Userlist data array for filling in info box
var racesListData = [];
// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateRacesTable();
    // Username link click
    $('#racesList table tbody').on('click', 'td a.linkshowrace', showRaceInfo);

    // Add User button click
    $('#btnAddRace').on('click', addRace);

    $('#joinRace').on('click', joinRace);

    // Delete User link click
    $('#raceList table tbody').on('click', 'td a.linkdeleterace', deleteRace);

});

// Functions =============================================================

// Fill table with data
function populateRacesTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/races/races', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        racesListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowrace" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.hasStarted + '</td>';
            tableContent += '<td><a href="#" class="linkdeleterace" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#racesList table tbody').html(tableContent);
    });
};
// Show User Info
function showRaceInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisRaceName = $(this).attr('rel');
    
    // Get Index of object based on id value
    var arrayPosition = racesListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisRaceName);
    // Get our User Object
    var thisRaceObject = racesListData[arrayPosition];
    //Populate Info Box
    $('#raceId').val(thisRaceObject._id);
    var tableContent = '';

    $.each(thisRaceObject.participants, function(){
        tableContent += '<tr>';
        tableContent += '<td>' + this.firstname + '</td>';
        tableContent += '<td><a href="#" class="deleteFromRace" rel="' + this._id + '">delete</a></td>';
        tableContent += '</tr>';
    });
    // Inject the whole content string into our existing HTML table
    $('#participantsList table tbody').html(tableContent);

    $.getJSON( '/participants/', function( data ) {
        // Empty content string
        tableContent = '';

        $.each(data, function(){
            tableContent += '<option value=' + this._id +  '>' + this.firstname + '</option>';
        });

        // Inject the whole content string into our existing HTML table
        $('#selectParticipants').html(tableContent);
    });
};

function getRaces(id){
    
}

// Add User
function addRace(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addRace input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newRace = {
            'name': $('#addRace fieldset input#raceName').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newRace,
            url: '/races/addrace',
            dataType: 'JSON',
            success: function( data, status ) {

                // Clear the form inputs
                $('#addRace fieldset input').val('');

                // Update the table
                populateRacesTable();
            },
            error: function(err){
                console.log('Error: ' + err);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};


function joinRace(event){
    event.preventDefault();
    var raceData = {
            'raceid': $('#raceId').val(),
            'participantid': $('#selectParticipants').val()
    }
    $.ajax({
        type: 'POST',
        url: '/races/joinrace',
        data: raceData,
        dataType: 'JSON',
        success: function( data, status ) {

            console.log('hi');
        },
        error: function(err){
            console.log('Error: ' + err);
        }
    });
}

// Delete User
function deleteRace(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/rooms/deleteroom/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateRoomTable();
            // If they said no to the confirm, do nothing
            return false;

        });
    }
};