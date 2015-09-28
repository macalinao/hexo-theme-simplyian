var hasPushstate = !!(window.history && history.pushState);

var smallScreen = window.screen.width < 500;

//    Generate table of contents
var generateTOC = function() {

  $(".post-content").find('h1,h2,h3,h4')
    .each(function(i) {
      var current = $(this);
      current.attr("id", "title" + i);
      $("#toc").append("<li><a id='link" + i + "' href='#title" +
        i + "' title='" + current.text() + "'>" +
        current.text() + "</a></li>");
    });

};


// detect a click outside the trigger.

$('html').click(function() {
  var triggerOpened = $('span.ds-thread-count').filter('.active');
  triggerOpened.removeClass('active');
  if (triggerOpened.next().is(":visible")) {
    triggerOpened.next().fadeOut();
  }
  $(".post-content").filter('.right').removeClass('right');
});

//   Scroll spy headline
var scrollSpy = function() {
  for (var i = 1; i < 7; i++) {
    var headI = 'h' + i;
    $('#toc-content').text('Introduction');
    $('.post-content').find(headI).each(function() {
      var self = $(this);
      self.waypoint(function() {
        $('#navbar-toc').show();
        var tocText = self.text();
        $('#toc-content').text(tocText);
      }, {
        context: '.scroller',
        offset: 90
      });
    });
  };
};

afterPjax();

function afterPjax() {

  postTitle = document.title;
  postHref = window.location.href;

  var ie = navigator.userAgent.match(/windows\snt\s([\d\.]+)/i);
  if (ie !== null && ie[1] < 6) {
    document.getElementsByTagName('html')[0].className += ' windows-xp';
  }

  //    Scroll-To-Top button take effect
  $("#scroll-up").click(function() {
    $(".scroller").animate({
      scrollTop: "10"
    }, "350");
  });




  //  Mutil-push-menu init
  new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'), {
    type: 'cover'
  });

  $('img').each(function() {
    var $img = $(this),
      href = $img.attr('src');
    $img.wrap('<a data-lightbox="a" href="' + href + '" title="' + $img.attr('alt') + '"' + '></a>');
  });

  $('a[data-lightbox="a"]').fluidbox({
    stackIndex: 1
  });



  $('.share-button').popover({
    placement: 'bottom',
    content: '<a target="_blank" href="http://twitter.com/share?url=' +
      postHref +
      '"><i class="fa share-icon fa-twitter fa-2x"></i></a>' +
      '<a target="_blank" href="https://plus.google.com/share?url=' +
      postHref + "&title=" + postTitle +
      '"><i class="fa share-icon fa-google-plus fa-2x"></i></a>' +
      '<a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' +
      postHref + "&title=" + postTitle +
      '"><i class="fa fa-facebook-square fa-2x"></i></a>',
    html: true
  });

  //    Fixed Multi-level-push-menu for PJAX
  $(".mp-pjax a").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    var pjaxHref = this.href;
    $('.scroller').trigger('click');
    if (hasPushstate) {
      $(".pjax-hidden a").each(function() {
        if (this.href === pjaxHref) {
          $(this).trigger('click');
        }
      });
    }
  });

  $("a.back-home").click(function(e) {
    e.preventDefault();
    $('.scroller').trigger('click');
    $('#nexus-back').trigger('click');
  });



  //  Some JS hacks

  $("a.fa-archive,a.fa-copy,a.fa-tags").click(function() {
    $(".fa-angle-left").css('opacity', '0');
  });
  $(".mp-back").click(function() {
    $(".fa-angle-left").css('opacity', '1');
  });
  //    Instant search init
  $('input.search-archive').quicksearch('li.search-archive-li');
  $('input.search-category').quicksearch('li.search-category-li');
  $('input.search-tag').quicksearch('li.search-tag-li');

  //    Detect URL is Post page or NOT

  isPostPage = false;

  if (location.pathname === "/" || location.pathname.match("/tags/") !== null || location.pathname.match("/categories/") !== null ||
    location.pathname.match("/page/") !== null) {
    isPostPage = false;
  } else {
    isPostPage = true;
  }
  //    Scroll 500px show Scroll-To-Top button
  $('.scroller').scroll(function() {
    var scroll2top = $('.scroller').scrollTop();
    if (scroll2top > 500) {
      $("#scroll-up").show();
    } else {
      $("#scroll-up").hide();
    }
  });


  $("#scroll-up").hide();


  //    If no headline , hide the toc
  if ($('#toc').find('li').length === 0) {
    $('#navbar-toc').hide();
  }
  //    Scroll 150px show full header
  if (isPostPage && !smallScreen) {
    generateTOC();
    setTimeout("scrollSpy()", 300);

    $('.scroller').scroll(function() {
      if ((window.screen.width - 700) / 2 > $('#trigger').parent().width() + $('#nexus-back').parent().width()) {
        if ($('li#navbar-title').width() + $('li#navbar-toc').width() > $('.post').width()) {
          $('li#navbar-title').hide();
        } else {
          $('li#navbar-title').show();
        }
      } else {
        $('li#navbar-title').hide();
      }
      var scroll2top = $('.scroller').scrollTop();
      if (scroll2top > 150) {
        $('.nexus').css('width', '100%');
        $('.post-navbar').show(300);
        $('#navbar-title a').show();

      } else {
        $('.post-navbar').hide(300);
        $('.nexus').css('width', 'auto');
      }
    });
  }

  // Reset disqus
  if (isPostPage) {
    setTimeout(function() {
      DISQUS.reset({
        reload: true,
        config: function() {
          this.page.identifier = document.URL;
          this.page.url = document.URL;
        }
      });
    }, 1000);
  }

  //    Smooth Scroll for the TOC in header
  $('#toc a').click(function(e) {
    var headID = $(this).attr('href');
    var headIDpos = $(headID).position().top;
    $('.scroller').animate({
      scrollTop: headIDpos + 200
    }, 'linear');

    e.preventDefault();
  });

  //    Hover TOC navbar to show
  $('#navbar-toc').hover(function() {
    $('#navbar-toc i').removeClass('hover-down').addClass("hover-up");
    $('.hidden-box').slideDown();
  }, function() {
    $('#navbar-toc i').removeClass('hover-up').addClass("hover-down");
    $('.hidden-box').slideUp();
  });




  //    Reset Header
  if (isPostPage) {
    var headTitle = $('h1.post-title').text();
    $("#navbar-title a").text(headTitle);
  } else {
    $('.post-navbar').hide(300);
    $('.nexus').css('width', 'auto');
  }

};
//      PJAX init
$(document).pjax('a[data-pjax]', '.container', {
  fragment: '.container',
  timeout: 10000
});
$(document).on({
  'pjax:click': function() {
    $('.scroller').removeClass('fadeIn').addClass('fadeOut');
    NProgress.start();
  },
  'pjax:start': function() {
    $('.scroller').css('opacity', '0');
  },
  'pjax:end': function() {
    NProgress.done();
    $('.scroller').css('opacity', '1').removeClass('fadeOut').addClass('fadeIn');
    afterPjax();
    $('#navbar-toc').hide();
    $('.nexus').css('width', 'auto');
    $('#navbar-title a').hide();
  },
  'pjax:popstate': function() {
    setTimeout("$('#toc').find('li').remove();", 100);
    setTimeout("generateTOC()", 200);
    setTimeout("$('#comment-box').children().remove();", 100);
  },
});
