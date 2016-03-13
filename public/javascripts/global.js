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
            dataType: 'JSON',
            success: function( data, status ) {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

            },
            error: function(err){
                console.log('Error: ' + err.message + ' ' + err.statusCode);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};