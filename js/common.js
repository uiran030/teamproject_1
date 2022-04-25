$(window).on('scroll', function(){
    var sct = $(this).scrollTop()
    if (sct > 200) {
        $('.up_btn').addClass('on')
    } else {
        $('.up_btn').removeClass('on')
    }
})

$('.up_btn button i').on('click', function(){
    $('html').animate({scrollTop:0}, '1000');
})