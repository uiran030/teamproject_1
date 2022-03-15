// isRun = 중복 작동 금지
var isRun= false
var gdata = '';

function abc(titName,pageno,category){
    if (isRun==true){ 
        return
    }

    isRun = true

    $.ajax({
        type:'GET',
        // url: `https://ryukevin.herokuapp.com/http://apis.data.go.kr/1262000/CountrySafetyService/getCountrySafetyList?serviceKey=Cm6iVvqGBwjh2oznueJPtJ%2Bj2nbXtKNAP5V7ZTvwx2pnzBWlI2hFXHhkuWcOo76C6XJ6iz%2FBVrcJdrFSXsuOaQ%3D%3D&numOfRows=10&pageNo=${pageno}&title=${titName}&content=${category}`,
        url: `https://ryukevin.herokuapp.com/http://apis.data.go.kr/1262000/CountrySafetyService/getCountrySafetyList?serviceKey=Cm6iVvqGBwjh2oznueJPtJ%2Bj2nbXtKNAP5V7ZTvwx2pnzBWlI2hFXHhkuWcOo76C6XJ6iz%2FBVrcJdrFSXsuOaQ%3D%3D&numOfRows=10`,
        dataType:'xml',
        beforeSend:function(){
            $('#main').append('<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i>로딩중</div>')
        },
        complete:function(){
            $('#main .loading').remove()
        },
        success:function(getdata){
            gdata = getdata
            usedata(getdata, pageno)
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

    var countryN =  $(document).find('#title').find('option:selected').val()

    var elem = ` <div class="imgbox"><img src="./jsimg/${countryN}.gif" alt=""></div>`

    elem+= `<ul class="databox">`

    $(data).find('item').each(function(){
        var contentName = $(this).find('content').text()
        contentName = contentName.replace(/&nbsp;/gi,'').replaceAll('다.','다. <br> ').replaceAll('○',' <br>○ ').replaceAll('"',"'").replaceAll('■',' <br>■ ').replaceAll('☞',' <br>☞ ').replaceAll('※',' <br>※ ').replaceAll('음.','음.<br>').replaceAll('함.','함.<br>').replaceAll('임.','임.<br>').replaceAll('●',' <br>● ').replaceAll('▶',' <br>▶ ').replaceAll('o ',' <br>o ').replaceAll('△',' <br>△ ')

        var newtext = contentName.substr(0,700)
        var contenttit = $(this).find('title').text()
        contenttit=contenttit.replaceAll('"',"'")
        var countryNa = $(this).find('countryName').text()

        if(titName===countryNa){
            $(this).find('.page').addClass('on')
            elem+=`<li><h2>${contenttit}</h2>`
            if (contentName.length>700){
                elem+=`<p class="txt">${newtext}...</p>`
                elem+=`<span class="more"><button type="button" data-content="${contentName}" data-title="${contenttit}">더보기 <i class="fa-solid fa-angle-right"></i></button></span></li>`
            }else{
                elem+=`<p class="txt">${contentName}</p></li>`
            }
        }
    })
    elem +=`</ul>`

    elem += `<div class="page">`

    // if (startPage > 10) {
    //     elem += `<span class="prev">이전</span>`
    // }

    elem += `<span>`
    for (let i = startPage; i <= totalCount && i<startPage+10; i++) {
        if (pno == i) {
            elem += `<a href="${i}" class="on" > ${i} </a>`
        }  else {
            elem += `<a href="${i}"> ${i} </a>`
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
    var noneTitle = $('#title').find('option:selected').val()
    var noneCategory = $('#category').find('option:selected').val()
    
    if(txtblock){
        $('.imgbox , .databox , .page').fadeIn(3000)
    }else if(noneCategory==='카테고리 선택'&& noneTitle!=='나라이름 선택'){
        $('#main').append(`<div class="mentbox"><div class="showbox"><p>카테고리를 선택해 주세요</p></div></div>`).fadeIn(3000)
        $('.showbox').fadeIn(500)
    }else if(noneTitle==='나라이름 선택' && noneCategory!=='카테고리 선택'){
        $('#main').append(`<div class="mentbox"><div class="showbox"><p>원하시는 나라를 선택해 주세요</p></div></div>`).fadeIn(3000)
        $('.showbox').fadeIn(500)
    }else if(noneTitle==='나라이름 선택' && noneCategory==='카테고리 선택'){
        $('.mentbox').append(`<div class="mentbox"><div class="showbox"><p>원하시는 나라와 카테고리를 선택 후 검색버튼을 눌러주세요</p></div></div>`) 
        $('.showbox').fadeIn(500)
    }else{
        $('#main').append(`<div class="mentbox"><div class="showbox"><p>자료가 없습니다.</p></div></div>`).fadeIn(3000)
        $('.showbox').fadeIn(500)
    }
}



$('#main').on('click', '.page a',function(){
    var pno= $(this).attr('href')
    category = $('#category').find('option:selected').val()
    $('.databox, .imgbox, .page, .mentbox').remove()
    $(this).addClass('on').siblings().removeClass('on')
    abc(titName,pno,category)
    return false
})

$('#main .btn').on('click',function(){
    titName = $('#title').find('option:selected').val()
    category = $('#category').find('option:selected').val()
    startPage=1
    $('.databox, .imgbox, .page, .mentbox').remove()
    abc(titName,startPage,category)
})


// 더보기 클릭 시 전체화면
$('body').on('click', '#main .databox > li > .more > button',function(){
    var newcontent = $(this).attr('data-content')
    var newcontenttit = $(this).attr('data-title')
    
    var input = `<div class="fxbox"><div class="content"><h2>${newcontenttit}</h2><p>${newcontent}<button type="button">닫기</button></p></div><div class="circle"><span>닫기</span></div></div>`
    $('body').append(input)
    $('.fxbox').fadeIn(500)
})

$('body').on('click','.fxbox .circle, .fxbox button', function(){
    $('.fxbox').fadeOut(500, function(){
        $('.fxbox').remove()
    })
})

$(document).mousemove(function(e){
    $('.circle').css("top", e.clientY+'px');
    $('.circle').css("left", e.clientX+'px');
});
