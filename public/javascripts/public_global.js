var socket = io();
var utilities = null;
$(document).ready(function(){
	utilities = utilities || {};

	utilities.showMessageBox = function(classType, selector, message){
		$(selector).fadeIn(500).addClass(classType).html(message);

		setTimeout(function(){
			$(selector).fadeOut(function(){
				$(selector).removeClass(classType).html('');
			})
		},5000);
	}
});