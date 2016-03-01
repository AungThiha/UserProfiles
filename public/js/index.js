
$(document).ready(function() {

    $('.glyphicon-trash').click(function(e){
        var id = event.target.id;
        var item = $(this).parent().parent();
        item.addClass("hiden");
        $.ajax({
            url: '/user/delete/' + id,
            type: 'POST',
        })
        .done(function() {
            item.remove();
            $("ul.navbar-right").html('<li><a href="/user/login" id="login">Login</a></li>');
        })
        .fail(function() {
            item.removeClass("hiden");
            alert( "You're not authorized to delete" );
        });
    });
});