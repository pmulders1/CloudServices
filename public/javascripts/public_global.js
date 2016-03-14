var socket = io();

$(document).ready(function(){
	window.utilities = window.utilities || {};

	utilities.showMessageBox = function(classType, selector, message){
		$(selector).fadeIn(500).removeClass('hidden').addClass(classType).html(message);

		setTimeout(function(){
			$(selector).fadeOut(function(){
				$(selector).removeClass(classType).addClass('hidden').html('');
			})
		},5000);
	}
});