(function ($) {

'use strict';

var IS_SP = !!(navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0);
//tablet css
if (IS_SP) {
    document.write('<link rel="stylesheet" type="text/css" href="../css/tablet.css">');
}

//sp menu
$(function(){
    var $brandContents = $('.lu_brand-cotents');
    var $menu = $(".lu_mod-brandMenu");

    function _openMenu() {
      $menu.addClass('is-active');
      $(window).on('touchmove.lu_noScroll', function (e) {
        e.preventDefault();
        return false;
      });
    }

    $(".lu_js-menuBtn").click(function(){
      if ($menu.hasClass('is-active')) {
        $menu.removeClass('is-active');
        $(window).off('.lu_noScroll');
        return;
      }

      var targetTop = $brandContents.offset().top;
      var scrollTop = $(window).scrollTop();
      if (scrollTop >= targetTop) {
        _openMenu();
        return;
      }

      $('html,body').animate({scrollTop: targetTop}, _openMenu);
    });
});

//sp accordion
$(function(){
  $('.lu_js-accordion_body:not(:first)').hide();
  $(".lu_js-accordion_trigger").on("click", function() {
      $(this).toggleClass('is-active').next().slideToggle();
  });
});

var initializedFadeUp = false;
function initFadeup() {

if (initializedFadeUp) {
  return;
}
initializedFadeUp = true;

$(function () {
  var $elements = $('.lu_js-tab-itemName');
  if (!$elements.length) {
    return;
  }

  var raf = function (fn) {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(fn);
    }
    else {
      setTimeout(fn, 60);
    }
  };

  var $window = $(window);
  var centerTop;
  var centerBottom;
  var centerSpan = $elements.eq(0).width();
  var updateCenter = function () {
    var center = $window.scrollTop() + ($window.height() / 2);
    center += centerSpan / 4;
    centerTop = center - centerSpan;
    centerBottom = center + centerSpan;
  };
  
  $window
    .on('scroll', updateCenter)
    .on('resize', updateCenter)
    .resize();

  var toggleClass = function () {

    $elements.each(function (i) {
      var $this = $elements.eq(i);
      var oTop = $this.offset().top;
      var oBottom = oTop + $this.outerHeight();
      $this.toggleClass('lu_js-tab-itemName-on',
          (centerTop <= oBottom && oBottom < centerBottom));
    });

    raf(toggleClass);
  };

  toggleClass();
});

$(function () {

  $.fn.lazyloadCustomEffect = function () {
    this.show();
    this.on('transitionend', function (e) {
      if ($(e.target).hasClass('lu_js-anim-fadeup') && e.originalEvent && e.originalEvent.propertyName === 'opacity') {
        $(this).removeClass('lu_js-anim-fadeup');
      }
    });
    this.addClass('on');
  };

  var $animElements = $('.lu_js-anim-fadeup');
  function checkPosition() {
    var count = 0;
    var settings = {
        threshold       : 0,
        failure_limit   : 0,
        event           : "scroll",
        effect          : "show",
        container       : window,
        data_attribute  : "original",
        skip_invisible  : false,
        appear          : null,
        load            : null,
    };

    $animElements.each(function () {
      var $this = $(this);
      if ($this.hasClass('on')) {
        count++;
        return;
      }

      if ($.abovethetop(this, settings) ||
          $.leftofbegin(this, settings)) {
              /* Nothing. */
      } else if (!$.belowthefold(this, settings) &&
          !$.rightoffold(this, settings)) {
              $this.lazyloadCustomEffect();
              /* if we found an image we'll load, reset the counter */
              count++;
      }
    });

    if (window.requestAnimationFrame) {
      if (count === $animElements.length) {
        return;
      }
      else {
        window.requestAnimationFrame(checkPosition);
      }
    }
    else {
      if (count === $animElements.length) {
        $(window).off('scroll', checkPosition);
      }
    }
  }

  if ($animElements.length) {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(checkPosition);
    }
    else {
      $(window).on('scroll', checkPosition);
    }
  }

  $('[data-lazyload-src]').addClass('lu_js-anim-fadeup').lazyload({
    effect: 'lazyloadCustomEffect',
    data_attribute: 'lazyload-src',
    threshold: 0
  });
});

}

setTimeout(function () {
  if ($(window).scrollTop() > 5) {
    initFadeup();
    $(window).scroll();
  }
  else {
    $(window).on('scroll', function onScrollInitialize() {
      $(window).off('scroll', onScrollInitialize);
      initFadeup();
    });
  }
}, 100);

$(function () {
  var size = [
    [980, 'lu_media-min'],
    [1280, 'lu_media-mid'],
    [100000, 'lu_media-max']
  ];
  $(window).resize(function () {
    var wwidth = $(window).width();
    var cls;
    var $body = $('body');
    for (var i in size) {
      if (size[i][0] >= wwidth && !cls) {
        cls = size[i][1];
      }
      else {
        $body.removeClass(size[i][1]);
      }
    }

    if (cls) {
      $body.addClass(cls);
    }

  }).resize();
});

})(window.snm ? snm.$ : $);
