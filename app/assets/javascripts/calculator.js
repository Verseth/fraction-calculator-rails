
$(document).ready( () => {
    $("#try-it").click(function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#calculator").offset().top
        }, 1500);
    });

    
});