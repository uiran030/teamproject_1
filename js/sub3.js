$('#main .text .box .img').on('mouseover mouseout',function(){
    $(this).toggleClass('on')
})

$('#category a').on('click', function(){
    var aindex = $(this).index()
    console.log(aindex)
    var topbox = $('.text .box').eq(aindex).offset().top
    $('html').animate({scrollTop:topbox}, 1000)
    return false
})