
$(document).ready(function() {

    $('.glyphicon-trash').click(function(e){
        var id = event.target.id;
        $(this).parent().parent().remove();
        $.ajax({
            url: '/user/delete/' + id,
            type: 'POST',
        });
    });
});