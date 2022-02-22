// isRun = 중복 작동 금지
var isRun= false
function abc(titName,pageno,category){

    if (isRun==true){
        return
    }

    isRun = true
    $.ajax({
        type:'GET',
        url: `https://ryukevin.herokuapp.com/http://apis.data.go.kr/1262000/CountrySafetyService/getCountrySafetyList?serviceKey=Cm6iVvqGBwjh2oznueJPtJ%2Bj2nbXtKNAP5V7ZTvwx2pnzBWlI2hFXHhkuWcOo76C6XJ6iz%2FBVrcJdrFSXsuOaQ%3D%3D&numOfRows=10&pageNo=${pageno}&title=${titName}&content=${category}`,
        dataType:'xml',
        beforeSend:function(){
            $('#main').append('<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i>로딩중</div>')
        },
        complete:function(){
            $('#main .loading').remove()
        },
        success:function(getdata){
            usedata(getdata)
        },
        error:function(xhr){
            alert(xhr.status + '/' + xhr.errorText)
        }
    })
}


// 변수선언
var titName = ''                    //타이틀명
var startPage=1                     //시작페이지
var category= ''                    //세부 카테고리
abc(titName,startPage,category)     //함수 호출


// API 데이터 호출
function usedata(data, pno){

    totalCount = $(data).find('totalCount').text();
    totalCount = Math.ceil(Number(totalCount)/10)
    // console.log(totalCount)
    var tenCount = Math.ceil(totalCount / 10)
    var countryN =  $(document).find('#title').find('option:selected').val()
    // console.log(countryN)
    var elem = ` <div class="imgbox"><img src="./jsimg/${countryN}.gif" alt=""></div>`
    elem+= `<ul class="databox">`
    $(data).find('item').each(function(){
        var contentName = $(this).find('content').text()
        contentName = contentName.replace(/&nbsp;/gi,'')
        var contenttit = $(this).find('title').text()
        var countryNa = $(this).find('countryName').text()
        // console.log(countryNa)
        if(titName===countryNa){
            console.log(contentName)
            $(this).find('.page').addClass('on')
            elem+=`<li><h2>${contenttit}</h2>`
            elem+=`<p>${contentName}</p>`
            
            // elem+=`<span class="more"><a href="#">더보기<i class="fa-solid fa-angle-right"></i></a></span></li>`
        }
        // console.log(contentName)
    })
    elem +=`</ul>`

    elem += `<div class="page">`
    // if (startPage > 10) {
    //     elem += `<span class="prev">이전</span>`
    // }

    elem += `<span>`
    for (let i = startPage; i <= totalCount && i<startPage+10; i++) {
        if (pno == i) {
            elem += `<a href="${i}" class="on"> [${i}] </a>`
        }  else {
            elem += `<a href="${i}"> [${i}] </a>`
        }
    }
    elem += `</span>`

    // if (tenCount >= 2 && totalCount > startPage + 9) {
    //     elem += `<span class="next">다음</span>`
    // }

    elem += `</div>`
    $('#main').append(elem)
    isRun = false

    var txtblock = $('.databox').text()
    // console.log(txtblock)
    var noneTitle = $('#title').find('option:selected').val()
    var noneCategory = $('#category').find('option:selected').val()
    // console.log(displaynon)
    
    if(txtblock){
        $('.imgbox , .databox , .page').fadeIn(3000)
    }else if(noneCategory==='카테고리 선택'&&noneTitle!=='나라이름 선택'){
        $('#main').append(`<div class="mentbox"><div class="showbox"><p>카테고리를 선택해 주세요</p></div></div>`).fadeIn(3000)
        $('.showbox').fadeIn(500)
    }else if(noneTitle==='나라이름 선택' &&noneCategory!=='카테고리 선택'){
        $('#main').append(`<div class="mentbox"><div class="showbox"><p>원하시는 나라를 선택해 주세요</p></div></div>`).fadeIn(3000)
        $('.showbox').fadeIn(500)
    }else if(noneTitle==='나라이름 선택' && noneCategory==='카테고리 선택'){
        $('.mentbox').append(`<div class="mentbox"><div class="showbox"><p>원하시는 나라와 카테고리를 선택 후 검색버튼을 눌러주세요</p></div></div>`) 
        $('.showbox').fadeIn(500)
    }else{
        $('#main').append(`<div class="mentbox"><div class="showbox"><p>자료가 없습니다.</p></div></div>`).fadeIn(3000)
        $('.showbox').fadeIn(500)
    }
    limit()
}

$('#main').on('click', '.page a',function(){
    var pno= $(this).attr('href')
    category = $('#category').find('option:selected').val()
    $('.databox, .imgbox,.page, .mentbox').remove()
    abc(titName,pno,category)
    return false
})

$('#main').on('click', '.page .next',function(){
    if (startPage>10) {
        startPage -= 10
    }
    category = $('#category').find('option:selected').val()
    $('.databox,.imgbox,.page, .mentbox').remove()
    abc(titName,startPage,category)
})

$('#main').on('click', '.page .next',function(){
    if (startPage<totalCount) {
        startPage += 10
    }
    category = $('#category').find('option:selected').val()
    $('.databox,.imgbox,.page, .mentbox').remove()
    abc(titName,startPage,category)
})

$('#main .btn').on('click',function(){
    titName = $('#title').find('option:selected').val()
    category = $('#category').find('option:selected').val()
    startPage=1
    $('.databox,.imgbox,.page, .mentbox').remove()
    abc(titName,startPage,category)
})

// 줄 수 맞추고 더보기
function limit() {$('.databox >li>p').each(function(){
    var text = $(this).text()
    var newtext = text.substr(0,1000)
    if (text.length<1000) {
        $(this).html(text)
    }else{
        $(this).text(newtext+'...')
        $(this).parent().append(`<span class="more"><button type="button">더보기<i class="fa-solid fa-angle-right"></i></button></span></li>`)
    }
})}

// 더보기 클릭 시 전체화면
$('body').on('click', '#main .databox > li > .more > button',function(){
    // var link = $(this).find('button')
    // console.log(imglink)
    var contentName = $(this).find('content').text()
    contentName = contentName.replace(/&nbsp;/gi,'')
    var contenttit = $(this).find('title').text()

    var input = `<div class="fxbox"><div class="content"><h2>${contenttit}</h2><p>${contentName}</p><button type="button">나가기</button></div></div>`
    $('body').append(input)
    $('.fxbox').fadeIn(500)
})
$('body').on('click','.fxbox .content >button, .fxbox', function(){
    $('.fxbox').fadeOut(500, function(){
        $('.fxbox').remove()
    })
})