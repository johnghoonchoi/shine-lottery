'use strict';

// hide notification window when user clicks outside the window
$(document).mouseup((e) => {
  if (! $('.notifications').is(e.target) &&
      $('.notifications').has(e.target).length === 0) {
    $('#container').removeClass('notifications-set')
  }
});

// subscribe account collection with filtering
Meteor.subscribe('userData');

Meteor.subscribe('systemView');

$(window).on('resize', function () {
  var container = $('#container');
  var headerLeftBtn = $('#container > header .header-left');
  if ($(this).width() <= 767 && (localStorage.getItem('aside-pin-left') === "1")) {
    localStorage.setItem('aside-pin-left', 0);
    container.removeClass('aside-left-fixed');
    container.addClass('aside-left-on');
  } else if ($(this).width() > 767 && $('aside.left > header > button').hasClass('active')) {
    localStorage.setItem('aside-pin-left', 1);
    container.removeClass('aside-left-on');
    container.addClass('aside-left-fixed');
  }
});

