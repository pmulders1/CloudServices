// Userlist data array for filling in info box
var userListData = [];
// DOM Ready =============================================================
$(document).ready(function() {

    // Add User button click
    $('#btnAddUser').on('click', addUser);

});

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'firstname': $('#addUser fieldset input#inputFirstName').val(),
            'lastname': $('#addUser fieldset input#inputLastName').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/participants/addParticipant',
            dataType: 'JSON'
        }).done(function( data, status ) {
            console.log(data);
            console.log(status);
            // Check for successful (blank) response
            if (response.message) {

                // Clear the form inputs
               $('#addUser fieldset input').val('');
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.message);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};