$(document).ready(function(){

	$("#login").click(function(){
		window.location = "/user/login";
	});

	$("#logout").click(function(){
		$.ajax({
            url: '/user/logout',
            type: 'POST'
        })
        .done(function() {
            window.location = "/";
        })
        .fail(function() {
            alert( "server error" );
        });
	});
});