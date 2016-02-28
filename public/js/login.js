
$(document).ready(function() {

    // process the form
    $('#form').submit(function(event) {

        event.preventDefault();

        var $form = $(event.target);
        // Use Ajax to submit form data
        $.ajax({
            url: $form.attr('action'),
            type: 'POST',
            data: $form.serialize()
        })
        .done(function() {
            window.location = "/";
        })
        .fail(function() {
            alert( "server error" );
        });
    });


});