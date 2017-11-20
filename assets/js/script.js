
/*!--------------------------------*\
   3-Jekyll Theme
   @author Peiwen Lu (P233)
   https://github.com/P233/3-Jekyll
\*---------------------------------*/

// Detect window size, if less than 1280px add class 'mobile' to sidebar therefore it will be auto hide when trigger the pjax request in small screen devices.
if ($(window).width() <= 1920) {
  $('#sidebar').addClass('mobile')
}

// Variables
var sidebar    = $('#sidebar'),
    container  = $('#post'),
    content    = $('#pjax'),
    button     = $('#icon-arrow');

// Tags switcher
var clickHandler = function(id) {
  return function() {
    $(this).addClass('active').siblings().removeClass('active');
    $('.pl__all').hide();
    $('.' + id).delay(50).fadeIn(350);
  }
};

$('#tags__ul li').each(function(index){
  $('#' + $(this).attr('id')).on('click', clickHandler($(this).attr('id')));
});

//判断是否是微信浏览器
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

// If sidebar has class 'mobile', hide it after clicking.
$('.pl__all').on('click', function() {
  $(this).addClass('active').siblings().removeClass('active');
  $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
  // if( !isWeiXin() ){
  //   setTimeout(function(){location.reload(true);},0);
  // }else{
  //   $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
  // }
});

$(document).ready(function() {
  if (sidebar.hasClass('mobile')) {
    $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
  }

  //@16-09-09 监听Ctrl+Enter || Enter键--以打开或关闭左边SideBar---Start;
  document.onkeydown=function(event){
　　 if(13 == event.keyCode && event.ctrlKey){
        openOrCloseSidebar(true)
    }else if(13 == event.keyCode){
        openOrCloseSidebar(false)
    }
　}
  //@16-09-09 监听Ctrl+Enter || Enter键--以打开或关闭左边SideBar----End;

  //@17-11-20 Randomly updated ads display basis configuration
  var jadeAdsConfArr = [
    {path: '//t.cn/Rj36MOy', image: '//t.cn/Rj36MOU'},
    {path: '//t.cn/RjB8Z0C', image: '//t.cn/Rik8XrG'}]
  var randomIdx = Math.floor(Math.random() * jadeAdsConfArr.length)
  $('#jade-ads-block .jade-ads-a').attr("href", jadeAdsConfArr[randomIdx].path)
  $('#jade-ads-block .jade-ads-img').attr("src", jadeAdsConfArr[randomIdx].image)
});

//Modify On-2016-02-26.-----------------Start
$allLink = $('.pl__all');//所有链接
$('#search-input').on('input', function(e){
    var value = this.value;
    $allLink.hide();
    var filter = "all"; //所有链接中搜索
    if (filter === 'all') {
        $.each($allLink, function(k, v){
            $(v).filter(":contains('"+value+"')").fadeIn(350);
        });
    }else{
       $.each($filterLink[filter], function(k, v){
            $(v).filter(":contains('"+value+"')").fadeIn(350);
        });
    }
});
//Modify On-2016-02-26.-----------------End

function openOrCloseSidebar(isFocus){
    if (button.hasClass('fullscreen')) {
      sidebar.removeClass('fullscreen');
      button.removeClass('fullscreen');
      content.delay(300).queue(function(){
        $(this).removeClass('fullscreen').dequeue();
      });
      if(isFocus){
        setTimeout(function(){document.getElementById('search-input').focus();},0)
      }
    } else {
      sidebar.addClass('fullscreen');
      button.addClass('fullscreen');
      content.delay(200).queue(function(){
        $(this).addClass('fullscreen').dequeue();
      });
    }
}

// Enable fullscreen.
$('#js-fullscreen').on('click', function() {
    openOrCloseSidebar()
});

$('#mobile-avatar').on('click', function(){
  $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
});

// Pjax
$(document).pjax('#avatar, #mobile-avatar, .pl__all', '#pjax', { fragment: '#pjax', timeout: 10000 });
$(document).on({
  'pjax:click': function() {
    content.removeClass('fadeIn').addClass('fadeOut');
    NProgress.start();
  },
  'pjax:start': function() {
    content.css({'opacity':0});
  },
  'pjax:end': function() {
    NProgress.done();
    container.scrollTop(0);
    content.css({'opacity':1}).removeClass('fadeOut').addClass('fadeIn');
    afterPjax();
  }
});

// Re-run scripts for post content after pjax
function afterPjax() {
  // Open links in new tab
  $('#post__content a').attr('target','_blank');

  // Generate post TOC for h1 h2 and h3
  var toc = $('#post__toc-ul');
  // Empty TOC and generate an entry for h1
  toc.empty().append('<li class="post__toc-li post__toc-h1"><a href="#post__title" class="js-anchor-link">' + $('#post__title').text() + '</a></li>');

  // Generate entries for h2 and h3
  $('#post__content').children('h2,h3').each(function() {
    // Generate random ID for each heading
    $(this).attr('id', function() {
      var ID = "",
          alphabet = "abcdefghijklmnopqrstuvwxyz";

      for(var i=0; i < 5; i++) {
        ID += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      return ID;
    });

    if ($(this).prop("tagName") == 'H2') {
      toc.append('<li class="post__toc-li post__toc-h2"><a href="#' + $(this).attr('id') + '" class="js-anchor-link">' + $(this).text() + '</a></li>');
    } else {
      toc.append('<li class="post__toc-li post__toc-h3"><a href="#' + $(this).attr('id') + '" class="js-anchor-link">' + $(this).text() + '</a></li>');
    }
  });

  // Smooth scrolling
  $('.js-anchor-link').on('click', function() {
    var target = $(this.hash);
    container.animate({scrollTop: target.offset().top + container.scrollTop() - 70}, 500, function() {
      target.addClass('flash').delay(700).queue(function() {
        $(this).removeClass('flash').dequeue();
      });
    });
  });

  // Lazy Loading Disqus
  // http://jsfiddle.net/dragoncrew/SHGwe/1/
  var ds_loaded = false,
      top = $('#disqus_thread').offset().top;
  window.disqus_shortname = $('#disqus_thread').attr('name');

  function check() {
    if ( !ds_loaded && container.scrollTop() + container.height() > top ) {
      $.ajax({
        type: 'GET',
        url: '//' + disqus_shortname + '.disqus.com/embed.js',
        dataType: 'script',
        cache: true
      });
      ds_loaded = true;
    }
  }check();
  container.scroll(check);
}
afterPjax();
