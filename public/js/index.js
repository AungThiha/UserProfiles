
$(document).ready(function() {

    $('.glyphicon-trash').click(function(e){
        var id = event.target.id;
        $(this).parent().parent().remove();
        $.ajax({
            url: '/user/delete/' + id,
            type: 'POST',
        })
        .done(function() {
            $("ul.navbar-right").html('<li><a href="/user/login" id="login">Login</a></li>');
        })
        .fail(function() {
            alert( "server error" );
        });
    });
});