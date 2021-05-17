$(function () {
  var w = $(window).width();
  // ページトップ
  $('.c-footer__pagetop,.l-pagetop').on('click', function () {
    $('body,html').animate({
      scrollTop: 0
    }, 850, 'easeInOutQuad');
  });
  // SPメニュー
  if (w <= 768) {
    $('.c-header__menubtn').on('click', function () {
      var st = $(window).scrollTop();
      $('.c-nav__bg').stop().fadeIn(400);
      $('.l-nav').stop().delay(150).fadeIn(400);
      return false;
    });
    $('.c-nav__close,.c-nav__list li a').on('click', function () {
      $('.c-nav__bg').stop().fadeOut(400);
      $('.l-nav').stop().fadeOut(400);
    });
  }
})
jQuery.extend(jQuery.easing, {
  easeOutQuart: function (x, t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  }
});
$(window).on('load scroll', function () {
  sc = $(window).scrollTop();
  $('.bg01').css({'transform': 'translateY(-'+sc/4+'px)'});
  $('.bg02').css({'transform': 'translateY(-'+sc/6+'px)'});
});
var w = $(window).width();
$(window).on('load', function () {
  $('body').addClass('active');
  // メニューアクティブ表示
  var id = $('body').attr('id');
  setTimeout(function () {
    if (w <= 768) {
      if($('.l-wrapper').hasClass('p-movie') || $('.wrapper').hasClass('p-movie')) {
        $('.c-nav__list.left__list li a.' + id).addClass('active');
      }else {
        $('.c-nav__in .c-nav__inner .c-nav__list li a.' + id).addClass('active');
      }
    }else {
      $('.c-nav__list.left__list li a.' + id).addClass('active');
    }
  }, 2000);
});
if($('.l-pagetop').length) {
  $(window).on('load scroll', function () {
    var scr = $(window).scrollTop();
    var wh = $(window).height();
    if (scr > wh) {
      $('.l-pagetop').addClass('active');
    } else {
      $('.l-pagetop').removeClass('active');
    }
  });
}