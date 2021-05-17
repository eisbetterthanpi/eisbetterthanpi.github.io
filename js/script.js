$(function () {
  // エンターモーダル
  // $('.c-enter__content.close').on('click', function () {
  //   $('.c-modal__enter').stop().fadeOut(400);
  // });
  // movieモーダル
  $(".movie_list li").click(function () {
    var id = $(this).attr("youtube-id");
    var iframe = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + id + '?autoplay=1&amp;rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
    $("#modal").find(".player").html(iframe).velocity({
      opacity: 1
    }, 500);

    $("#modal").show().velocity({
      opacity: 1
    }, 500);
  })
  $("#modal").find(".wrap,.btn_close").click(function () {
    $("#modal").velocity({
      opacity: 0
    }, {
      duration: 300,
      complete: function () {
        $(this).hide();
        $(this).find(".player").empty();
      }
    })
  })
})
jQuery.extend(jQuery.easing, {
  easeOutQuart: function (x, t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  }
});
var w = $(window).width();
// パララックス
$(window).on('load scroll', function () {
  sc = $(window).scrollTop();
  $('.snow').css({
    'transform': 'translateY(-' + sc / 5 + 'px)'
  });
  $('.chara.mai').css({
    'transform': 'translateY(' + sc / 8 + 'px)'
  });
  $('.chara.shoko').css({
    'transform': 'translateY(' + sc / 18 + 'px)'
  });
});
$(window).on('load', function () {
  // 映画ページ用クラス
  $('body,.l-wrapper,.l-nav,.l-content,.l-footer').addClass('p-movie');
  $('.wrapper,.content').addClass('p-movie');
  // エンターモーダル出し分け
  var from = window.location.search.substring(1, window.location.search.length);
  if (from.match(/innerlink/)) {
    $('.c-modal__enter').stop().hide();
  }
  // バナーエリア
  if ($('.c-banner__list .swiper-wrapper .swiper-slide').length > 2) {
    var swiper = new Swiper('.swiper-container.c-banner__list', {
      slidesPerView: 3,
      loop: true,
      speed: 1000,
      spaceBetween: 10,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      breakpoints: {
        768: {
          spaceBetween: 2,
          centeredSlides: true,
          slidesPerView: 2,
          loopedSlides: 2,
          pagination: {
            el: '.swiper-pagination',
          },
        },
      },
    });
  } else {
    $('.c-banner__list').addClass('noneSlide');
  }
  // ハッシュリンク
  var target = location.hash.replace('#', '.');
  if ($(target).length) {
    $('.c-modal__enter').hide();
    var position = $(target).offset().top;
    setTimeout(function () {
      $('html, body').stop(true).animate({
        scrollTop: position
      }, 1000);
      return false;
    }, 750);
  }
});
// ページ内リンク
$('a[href^="/#"]').on('click', function (e) {
  var href = $(this).attr('href').replace(/\/#/, '.');
  var position2 = $(href).offset().top;
  if ($('.c-banner').length && $('.c-banner').hasClass('fixed')) {
    $('html,body').stop(true).animate({
      scrollTop: position2 + 262
    }, 1000);
    return false;
  }else {
    setTimeout(function () {
      $('html, body').stop(true).animate({
        scrollTop: position2
      }, 1000);
    }, 0);
    return false;
  }
});


//april
// $(window).on('load', function () {
//     if(location.hash) {
//         $('.april_modal').hide();
//     } else {
//     }
// });
// $('.april_bk,.april_close').on('click', function () {
//   $('.april_modal').stop().fadeOut(400);
// });

//movie
$(window).on('load', function () {
	var from = window.location.search.substring(1, window.location.search.length);
	if(from == "innerlink" || location.hash){
      $('#modal .player').empty();
    } else {
      $('#modal').delay(300).show().velocity({opacity: 1}, 500);
      $('#modal .player').velocity({opacity: 1}, 500);
    }
});