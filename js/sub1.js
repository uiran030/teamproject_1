$('#main .text .box ul li').on('mouseover mouseout',function(){
    $(this).toggleClass('on')
})

$('#main .imgbox > ul> li').on('mouseover mouseout',function(){
    $(this).toggleClass('on')
}) 

// 2월 11일 추가 (이미지 클릭 시 전체화면 모드)
$('#main .imgbox > ul > li').on('click',function(){
    var imglink = $(this).find('img').attr('src')
    // console.log(imglink)
    var input = `<div class="fxbox"><div class="content"><button type="button">나가기</button><img src="${imglink}" alt=""></div></div>`
    $('body').append(input)
    $('.fxbox').fadeIn(500)
})

$('body').on('click','.fxbox .content >button, .fxbox', function(){
    $('.fxbox').fadeOut(500, function(){
        $('.fxbox').remove()
    })
})
